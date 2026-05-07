// Build script — zero deps, Node ≥ 16.
//
// Responsibilities:
//   1. Treat `src/manga-viewer.css` as the single source of truth and inline
//      its contents into the `MANGA_VIEWER_CSS` literal inside
//      `src/manga-viewer.js` (the viewer mounts in Shadow DOM, so it must
//      embed its own styles — external <link> stylesheets cannot reach
//      Shadow DOM internals).
//   2. Emit minified copies into `dist/`.
//
// Run: `npm run build`
// Hooked into `prepublishOnly` so npm publish always ships fresh artifacts.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC_JS  = resolve(ROOT, 'src/manga-viewer.js');
const SRC_CSS = resolve(ROOT, 'src/manga-viewer.css');
const DIST_JS  = resolve(ROOT, 'dist/manga-viewer.min.js');
const DIST_CSS = resolve(ROOT, 'dist/manga-viewer.min.css');

// Markers placed inside src/manga-viewer.js around the inlined CSS literal.
// The build script replaces everything between them.
const CSS_BEGIN_RE = /(const\s+MANGA_VIEWER_CSS\s*=\s*String\.raw`)([\s\S]*?)(`;)/;

function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')               // strip /* comments */
    .replace(/\s+/g, ' ')                           // collapse whitespace
    .replace(/\s*([{}:;,>+~])\s*/g, '$1')           // tighten around punctuation
    .replace(/;}/g, '}')                             // drop trailing semicolons
    .replace(/(^|[{};])\s+/g, '$1')
    .trim();
}

// JS "minification" is intentionally minimal: we copy the source verbatim,
// only collapsing trailing whitespace per line. Stripping `//` comments
// safely requires distinguishing them from regex literals and template
// strings — that's a real parser, not a regex job. Real compression should
// come from a downstream bundler if the consumer needs it.
function minifyJs(js) {
  return js.replace(/[ \t]+(\r?\n)/g, '$1');
}

async function main() {
  const [jsSrc, cssSrc] = await Promise.all([
    readFile(SRC_JS, 'utf8'),
    readFile(SRC_CSS, 'utf8'),
  ]);

  // 1) Sync the CSS literal in the JS source.
  if (!CSS_BEGIN_RE.test(jsSrc)) {
    throw new Error('build: could not locate MANGA_VIEWER_CSS literal in src/manga-viewer.js');
  }
  // Backticks and ${ inside CSS would terminate the template literal — the
  // current stylesheet has none, but we still escape defensively.
  const escapedCss = cssSrc.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
  const updatedJs = jsSrc.replace(CSS_BEGIN_RE, `$1${escapedCss}$3`);

  if (updatedJs !== jsSrc) {
    await writeFile(SRC_JS, updatedJs, 'utf8');
    console.log('✓ Synced MANGA_VIEWER_CSS literal in src/manga-viewer.js');
  } else {
    console.log('✓ MANGA_VIEWER_CSS already in sync');
  }

  // 2) Generate minified dist artifacts.
  await mkdir(dirname(DIST_JS), { recursive: true });
  await Promise.all([
    writeFile(DIST_JS, minifyJs(updatedJs), 'utf8'),
    writeFile(DIST_CSS, minifyCss(cssSrc), 'utf8'),
  ]);
  console.log(`✓ Wrote ${DIST_JS} (${(updatedJs.length / 1024).toFixed(1)} KB → ${(minifyJs(updatedJs).length / 1024).toFixed(1)} KB)`);
  console.log(`✓ Wrote ${DIST_CSS} (${(cssSrc.length / 1024).toFixed(1)} KB → ${(minifyCss(cssSrc).length / 1024).toFixed(1)} KB)`);
}

main().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
