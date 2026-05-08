/**
 * Manga Viewer v0.5.0
 * A standalone, feature-rich manga/comic viewer for the web.
 *
 * https://github.com/tokagemushi999/manga-viewer
 * (c) tokagemushi — MIT License
 */

// ──────────────────────────────────────────
// SVG icon paths (inline, no FA dependency)
// ──────────────────────────────────────────
// Material-Design solid icons. Filled paths read significantly better than
// stroke at the 16–18px size used in header buttons. Uniform 24×24 viewBox.
const _FILL = 'fill="currentColor" aria-hidden="true" focusable="false"';
const ICONS = {
  chevronLeft:   `<svg viewBox="0 0 24 24" width="18" height="18" ${_FILL}><path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>`,
  expand:        `<svg viewBox="0 0 24 24" width="18" height="18" ${_FILL}><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>`,
  compress:      `<svg viewBox="0 0 24 24" width="18" height="18" ${_FILL}><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>`,
  xLogo:         `<svg viewBox="0 0 24 24" width="16" height="16" ${_FILL}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  link:          `<svg viewBox="0 0 24 24" width="18" height="18" ${_FILL}><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>`,
  question:      `<svg viewBox="0 0 24 24" width="18" height="18" ${_FILL}><path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/></svg>`,
  bookmark:      `<svg viewBox="0 0 24 24" width="18" height="18" ${_FILL}><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>`,
  searchPlus:    `<svg viewBox="0 0 24 24" width="20" height="20" ${_FILL}><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm-.5-7H8v2H6v1h2v2h1v-2h2V9H9z"/></svg>`,
  compressAlt:   `<svg viewBox="0 0 24 24" width="20" height="20" ${_FILL}><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7z"/></svg>`,
  check:         `<svg viewBox="0 0 24 24" width="16" height="16" ${_FILL}><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`,
  questionCircle:`<svg viewBox="0 0 24 24" width="20" height="20" ${_FILL}><path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/></svg>`,
  times:         `<svg viewBox="0 0 24 24" width="16" height="16" ${_FILL}><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`,
  play:          `<svg viewBox="0 0 24 24" width="14" height="14" ${_FILL}><path d="M8 5v14l11-7z"/></svg>`,
};

// ──────────────────────────────────────────
// Public icons — pre-built SVG strings for use in `extraButtons[].icon`.
// Exported so callers can do `import MangaViewer, { icons } from '...';`
// then `extraButtons: [{ icon: icons.reload, label: '更新', onClick: ... }]`.
// All strings pass through the built-in SVG sanitizer at render time.
// ──────────────────────────────────────────
export const icons = {
  // Material Design "refresh". Path bounds verified at x=4–20, y=4–20
  // (4-unit margin on every side of the 24×24 viewBox, no overflow).
  reload:  '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false"><path d="M17.65 6.35A7.96 7.96 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>',
  download:'<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>',
  print:   '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>',
};
icons.refresh = icons.reload;     // alias

// ──────────────────────────────────────────
// Tunable constants (durations in milliseconds)
// ──────────────────────────────────────────
const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.5;
const DOUBLE_TAP_DELAY = 300;
const TWO_FINGER_TAP_MAX_DIST = 50;          // max px between fingers for two-finger tap
const ORIENTATION_DEBOUNCE_MS = 100;
const ADSENSE_INIT_DELAY_MS = 500;
const RESUME_NAVIGATE_DELAY_MS = 100;
const TOAST_VISIBLE_MS = 2000;
const TOAST_FADE_MS = 300;
const BOOKMARK_LONG_PRESS_MS = 500;
const PROGRESS_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// ──────────────────────────────────────────
// Default i18n messages (override via opts.messages).
// Defaults are Japanese; override with English (or any locale) by passing
// `messages: { ... }` in the constructor options. Only keys you supply get
// replaced — the rest fall back to defaults.
// ──────────────────────────────────────────
const DEFAULT_MESSAGES = {
  // Bookmarks
  bookmarkPanelTitle:    'しおり',
  bookmarkAdd:           ' 現在のページをブックマーク',
  bookmarkRemove:        ' しおりを削除',
  bookmarkEmpty:         'しおりはまだありません',
  bookmarkPageLabel:     (n) => `${n}ページ`,
  bookmarkDefaultTitle:  (n) => `ページ${n}`,
  bookmarkAdded:         'しおりを追加しました',
  bookmarkRemoved:       'しおりを削除しました',
  bookmarkLimit:         (max) => `しおりは${max}個までです`,
  bookmarkGenericError:  'エラーが発生しました',
  bookmarkBtnTitle:      'しおり',
  // Resume dialog
  resumeTitle:           '続きから読みますか？',
  resumeSubtitle:        (n) => `${n}ページから続行`,
  resumeStart:           '最初から',
  resumeContinue:        ' 続きから',
  // Toast
  linkCopied:            'リンクをコピーしました',
  // Help
  helpBtnTitle:          'ヘルプ',
  helpClose:             '閉じる',
  helpTitle:             ' ヘルプ',
  helpSettings:          '⚙ 設定',
  helpControls:          '👆 操作',
  helpModePage:          'ページ送り',
  helpModeScroll:        '縦スクロール',
  helpDirRtl:            '右から左へ',
  helpDirLtr:            '左から右へ',
  helpDirection:         (label) => `読む方向: ${label}`,
  helpScrollAction:      (action) => `${action}で上下に読む`,
  helpScrollMobile:      'スワイプ',
  helpScrollDesktop:     'スクロール',
  helpTapLabel:          'タップ',
  helpTapDesc:           (left, right) => `左: ${left}ページ / 右: ${right}ページ / 中央: メニュー`,
  helpSwipeLabel:        'スワイプ',
  helpSwipeDesc:         '左右にスワイプしてページめくり',
  helpPinchLabel:        'ピンチ',
  helpPinchDesc:         'ピンチでズーム、ドラッグで移動。端までドラッグでページ送り。',
  helpClickLabel:        'クリック',
  helpClickDesc:         (left, right) => `左: ${left} / 右: ${right} / 中央: メニュー`,
  helpKeyboardLabel:     'キーボード',
  helpKeyboardDesc:      '← →: ページめくり / Space: 次へ / Esc: ズーム解除',
  helpZoomLabel:         'ズーム',
  helpZoomDesc:          'ボタン、または中央ダブルクリックでズーム',
  helpDirNext:           '次',
  helpDirPrev:           '前',
  // Aria-live page announcement
  pageAnnounce:          (n, total) => `${n} / ${total} ページ`,
  // Tap-area aria labels
  ariaPrevPage:          '前のページ',
  ariaNextPage:          '次のページ',
  // Purchase / preview popup
  purchaseTitle:         '試し読みここまで',
  purchaseTotal:         (total, free) => `全${total}ページ — ${free}ページが無料`,
  purchaseCta:           '購入して続きを読む',
  purchaseBtn:           '購入',
  purchaseBack:          '戻る',
};

// ──────────────────────────────────────────
// HTML sanitizer whitelist (used by `type: 'html'` insert pages)
// Override entirely by passing opts.htmlSanitizer (e.g. DOMPurify.sanitize).
// ──────────────────────────────────────────
const SANITIZE_ALLOWED_TAGS = new Set([
  'div','span','p','br','hr','h1','h2','h3','h4','h5','h6',
  'blockquote','pre','code','figure','figcaption',
  'ul','ol','li','dl','dt','dd',
  'a','em','strong','b','i','u','s','mark','small','sub','sup','kbd','abbr','time',
  'img','picture','source','video','audio',
  'table','thead','tbody','tfoot','tr','th','td','caption','colgroup','col',
  // Inline SVG (icons). <foreignObject> is intentionally disallowed because
  // it embeds arbitrary HTML; everything below is presentational only.
  'svg','g','path','circle','ellipse','rect','line','polyline','polygon',
  'text','tspan','title','desc','defs','use','symbol',
  'lineargradient','radialgradient','stop','clippath','mask',
]);
// Drop element AND its children (dangerous container tags).
const SANITIZE_DISALLOWED_TAGS = new Set([
  'script','style','iframe','frame','frameset','object','embed','applet',
  'link','meta','base','title','head',
  'form','input','button','select','option','textarea','fieldset','legend',
]);
const SANITIZE_GLOBAL_ATTRS = new Set([
  'class','id','title','lang','dir','role','tabindex',
]);
const SANITIZE_TAG_ATTRS = {
  a: new Set(['href','target','rel','download','hreflang']),
  img: new Set(['src','alt','width','height','loading','decoding','srcset','sizes']),
  picture: new Set([]),
  source: new Set(['src','srcset','type','media','sizes']),
  video: new Set(['src','controls','poster','preload','width','height','muted','loop','playsinline']),
  audio: new Set(['src','controls','preload','muted','loop']),
  th: new Set(['colspan','rowspan','scope']),
  td: new Set(['colspan','rowspan']),
  col: new Set(['span']),
  colgroup: new Set(['span']),
  time: new Set(['datetime']),
  abbr: new Set([]),
  // SVG presentational attributes. Keys are LOWERCASE because the sanitizer
  // lowercases attr.name before lookup; SVG camelCase attributes like
  // `viewBox` / `preserveAspectRatio` would otherwise fall through and be
  // stripped — which silently broke icon rendering until v0.5.0.
  // `xlink:href` is intentionally NOT in <use>'s set so external icon
  // references can't be loaded.
  svg: new Set(['viewbox','xmlns','width','height','fill','stroke','preserveaspectratio','focusable','aria-hidden']),
  g: new Set(['transform','fill','stroke','opacity','clip-path','mask']),
  path: new Set(['d','fill','stroke','stroke-width','stroke-linecap','stroke-linejoin','stroke-miterlimit','stroke-dasharray','stroke-dashoffset','opacity','transform','clip-path','fill-rule','clip-rule','vector-effect']),
  circle: new Set(['cx','cy','r','fill','stroke','stroke-width','opacity','transform']),
  ellipse: new Set(['cx','cy','rx','ry','fill','stroke','stroke-width','opacity','transform']),
  rect: new Set(['x','y','width','height','rx','ry','fill','stroke','stroke-width','opacity','transform']),
  line: new Set(['x1','y1','x2','y2','stroke','stroke-width','opacity','transform']),
  polyline: new Set(['points','fill','stroke','stroke-width','opacity','transform']),
  polygon: new Set(['points','fill','stroke','stroke-width','opacity','transform']),
  text: new Set(['x','y','dx','dy','text-anchor','fill','font-size','font-family','transform']),
  tspan: new Set(['x','y','dx','dy','text-anchor','fill','font-size']),
  use: new Set(['href','x','y','width','height','transform']),       // href guarded to '#fragment' below
  symbol: new Set(['viewbox','id']),
  defs: new Set([]),
  lineargradient: new Set(['id','x1','y1','x2','y2','gradientunits','gradienttransform','spreadmethod']),
  radialgradient: new Set(['id','cx','cy','r','fx','fy','gradientunits','gradienttransform','spreadmethod']),
  stop: new Set(['offset','stop-color','stop-opacity']),
  clippath: new Set(['id','clippathunits']),
  mask: new Set(['id','x','y','width','height','maskunits','maskcontentunits']),
};
// Match URL schemes we trust on href/src/action attributes.
const SAFE_URL_RE = /^(?:(?:https?|mailto|tel|sms):|#|\/|\.\.?\/|data:image\/(?:png|jpe?g|gif|webp|svg\+xml);)/i;
// Match dangerous patterns inside style="..." values.
const DANGEROUS_STYLE_RE = /(?:expression\s*\(|url\s*\(|@import|behaviou?r\s*:|javascript\s*:|vbscript\s*:|data\s*:(?!image\/))/i;

// ──────────────────────────────────────────
// CSS — single source of truth lives in src/manga-viewer.css.
// scripts/build.mjs syncs the literal below from that file.
// (The viewer mounts in Shadow DOM, so external <link> styles cannot reach
// internal classes; the CSS must be inlined here.)
// ──────────────────────────────────────────
const MANGA_VIEWER_CSS = String.raw`/**
 * Manga Viewer v0.5.0
 * https://github.com/tokagemushi999/manga-viewer
 * (c) tokagemushi — MIT License
 */

/* ============================================================
   Theme tokens
   These CSS variables are the single source of truth for every
   color in the viewer. Overriding them on the host element (e.g.
   \`#viewer { --mv-bg: #003366; }\`) applies the change throughout
   Shadow DOM. The \`theme\` constructor option toggles between
   built-in palettes by setting a class on the host:
     - \`mv-theme-auto\`  (default): mobile=light, desktop=dark
     - \`mv-theme-light\`: forced light
     - \`mv-theme-dark\` : forced dark
   ============================================================ */

/* Default = dark palette. */
:host {
  /* Pop-friendly Japanese font stack. Defined on :host so every node in
     Shadow DOM (help overlay, resume dialog, toasts) inherits it, not
     just .mv-container. */
  font-family: var(--mv-font-family,
    'Zen Maru Gothic', 'M PLUS Rounded 1c', 'Hiragino Maru Gothic ProN',
    'Hiragino Sans', 'Yu Gothic', YuGothic, 'Meiryo',
    -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
  --mv-bg:                 #000;
  --mv-fg:                 #fff;
  --mv-text-muted:         rgba(255, 255, 255, 0.7);
  --mv-header-bg:          rgba(40, 40, 40, 0.95);
  --mv-footer-bg:          rgba(40, 40, 40, 0.95);
  --mv-btn-bg:             rgba(255, 255, 255, 0.08);
  --mv-btn-bg-hover:       rgba(255, 255, 255, 0.15);
  --mv-btn-fg:             rgba(255, 255, 255, 0.9);
  --mv-slider-track:       rgba(255, 255, 255, 0.2);
  --mv-spinner-track:      rgba(250, 204, 21, 0.2);
  --mv-spinner-fg:         #facc15;
  --mv-accent:             #facc15;
  --mv-shadow:             rgba(0, 0, 0, 0.3);
  --mv-footer-bottom-padding: 0px;
  --mv-pwa-footer-bonus: 0px;          /* extra footer padding when running as PWA */
}

/* When the viewer runs in a PWA / installed app context (iOS/Android home
   screen launch), the slider sits very close to the home indicator and
   feels cramped. Add a bonus padding that callers can tune via the
   \`--mv-pwa-footer-bonus\` variable on the host. */
@media all and (display-mode: standalone) {
  :host {
    --mv-pwa-footer-bonus: 16px;
  }
}

/* Light palette overrides. */
:host(.mv-theme-light) {
  --mv-bg:                 #fff;
  --mv-fg:                 #333;
  --mv-text-muted:         rgba(0, 0, 0, 0.5);
  --mv-header-bg:          rgba(245, 245, 245, 0.98);
  --mv-footer-bg:          rgba(245, 245, 245, 0.98);
  --mv-btn-bg:             rgba(0, 0, 0, 0.06);
  --mv-btn-bg-hover:       rgba(0, 0, 0, 0.1);
  --mv-btn-fg:             #333;
  --mv-slider-track:       rgba(0, 0, 0, 0.15);
  --mv-spinner-track:      rgba(100, 100, 100, 0.2);
  --mv-spinner-fg:         #666;
}

/* Auto mode mirrors viewport size — same behaviour as v0.3.x.
   \`:host\` here is fine because explicit \`.mv-theme-light/dark\` class
   selectors below have higher specificity and override on mobile too. */
@media (max-width: 768px) {
  :host {
    --mv-bg:               #fff;
    --mv-fg:               #333;
    --mv-text-muted:       rgba(0, 0, 0, 0.5);
    --mv-header-bg:        rgba(245, 245, 245, 0.98);
    --mv-footer-bg:        rgba(245, 245, 245, 0.98);
    --mv-btn-bg:           rgba(0, 0, 0, 0.06);
    --mv-btn-bg-hover:     rgba(0, 0, 0, 0.1);
    --mv-btn-fg:           #333;
    --mv-slider-track:     rgba(0, 0, 0, 0.15);
    --mv-spinner-track:    rgba(100, 100, 100, 0.2);
    --mv-spinner-fg:       #666;
  }
}

/* Forced dark always wins, even on mobile. */
:host(.mv-theme-dark) {
  --mv-bg:                 #000;
  --mv-fg:                 #fff;
  --mv-text-muted:         rgba(255, 255, 255, 0.7);
  --mv-header-bg:          rgba(40, 40, 40, 0.95);
  --mv-footer-bg:          rgba(40, 40, 40, 0.95);
  --mv-btn-bg:             rgba(255, 255, 255, 0.08);
  --mv-btn-bg-hover:       rgba(255, 255, 255, 0.15);
  --mv-btn-fg:             rgba(255, 255, 255, 0.9);
  --mv-slider-track:       rgba(255, 255, 255, 0.2);
  --mv-spinner-track:      rgba(250, 204, 21, 0.2);
  --mv-spinner-fg:         #facc15;
}

/* ===== Reset / Base ===== */
.mv-loading-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--mv-bg);
  transition: opacity 0.4s ease, visibility 0.4s ease;
}

.mv-loading-screen.mv-fade-out {
  opacity: 0;
  visibility: hidden;
}

.mv-loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--mv-spinner-track);
  border-top-color: var(--mv-spinner-fg);
  border-radius: 50%;
  animation: mv-spin 0.8s linear infinite;
}

.mv-loading-text {
  margin-top: 16px;
  color: var(--mv-text-muted);
  font-size: 14px;
}

@keyframes mv-spin {
  to { transform: rotate(360deg); }
}

/* Visually-hidden for screen reader announcements */
.mv-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* ===== Container ===== */
.mv-container {
  position: fixed;
  inset: 0;
  height: 100vh;
  height: 100dvh;
  background: var(--mv-bg);
  line-height: 1.5;
  color: var(--mv-fg);
  -webkit-text-size-adjust: 100%;
  box-sizing: border-box;
}

.mv-container *, .mv-container *::before, .mv-container *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.mv-container.mv-pseudo-fullscreen {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  z-index: 9999;
}

body.mv-pseudo-fullscreen-body {
  overflow: hidden;
}

/* ===== Status Bar Cover (mobile notch) ===== */
.mv-status-bar-cover {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: env(safe-area-inset-top, 0px);
  background: var(--mv-bg);
  z-index: 45;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.mv-status-bar-cover.mv-visible { opacity: 1; }

@media (min-width: 769px) {
  .mv-status-bar-cover { display: none; }
}

/* ===== Header ===== */
.mv-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: auto;
  padding: 8px 12px;
  padding-top: max(8px, env(safe-area-inset-top));
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 50;
  background: var(--mv-header-bg);
  opacity: 1;
  transition: opacity 0.3s ease;
}

.mv-header.mv-ui-hidden {
  opacity: 0;
  pointer-events: none;
}

.mv-header.mv-hidden {
  display: none !important;
}

.mv-title {
  /* Absolutely centered so the visual centre matches the viewport centre,
     even when the back button and the right-side button cluster have
     different widths. pointer-events stay on the buttons behind it. */
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: var(--mv-fg);
  font-weight: bold;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 50%;
  pointer-events: none;
  margin: 0;
}

@media (max-width: 480px) {
  /* On phone widths the right-side cluster of buttons can squeeze the
     title; cap it harder so it just truncates with ellipsis instead of
     overlapping. */
  .mv-title { max-width: 40%; }
}

.mv-header-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mv-header-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--mv-btn-bg);
  border: none;
  color: var(--mv-btn-fg);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  text-decoration: none;
}

.mv-header-btn:hover {
  background: var(--mv-btn-bg-hover);
}

.mv-header-btn svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

@media (max-width: 768px) {
  .mv-header-btn {
    width: 32px;
    height: 32px;
    font-size: 13px;
  }
  .mv-title { font-size: 13px; }
}

/* ===== Footer ===== */
.mv-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px 12px;
  padding-bottom: calc(max(8px, env(safe-area-inset-bottom)) + var(--mv-footer-bottom-padding) + var(--mv-pwa-footer-bonus));
  z-index: 50;
  background: var(--mv-footer-bg);
  opacity: 1;
  transition: opacity 0.3s ease;
}

@media (max-width: 768px) {
  .mv-footer {
    padding: 10px 16px 16px 16px;
    padding-bottom: calc(max(16px, calc(env(safe-area-inset-bottom) + 8px)) + var(--mv-footer-bottom-padding) + var(--mv-pwa-footer-bonus));
  }
}

.mv-footer.mv-ui-hidden {
  opacity: 0;
  pointer-events: none;
}

.mv-footer.mv-hidden {
  display: none !important;
}

.mv-footer-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
  color: var(--mv-fg);
  font-size: 12px;
}

.mv-footer-info span {
  opacity: 0.7;
}

/* ===== Slider ===== */
.mv-page-slider {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--mv-slider-track);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}

@media (max-width: 768px) {
  .mv-page-slider {
    height: 8px;
    margin-top: 4px;
  }
}

.mv-page-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: #facc15;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.mv-page-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #facc15;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .mv-page-slider::-webkit-slider-thumb { width: 22px; height: 22px; }
  .mv-page-slider::-moz-range-thumb { width: 22px; height: 22px; }
}

.mv-page-slider.mv-rtl-slider {
  direction: rtl;
}

/* ===== Main Viewer Area ===== */
.mv-main {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: var(--mv-bg);
}

.mv-main.mv-scroll-mode {
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

/* ===== Slot Track ===== */
.mv-slot-track {
  display: flex;
  width: 100%;
  height: 100%;
  transform: var(--mv-track-transform, translateX(0px));
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.mv-slot-track.mv-no-transition {
  transition: none;
}

.mv-slot-track.mv-scroll-track {
  flex-direction: column;
  height: auto;
  transition: none;
}

/* ===== Page Slot ===== */
.mv-page-slot {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

@media all and (display-mode: standalone) {
  .mv-page-slot {
    padding-bottom: env(safe-area-inset-top, 0px);
  }
}

.mv-scroll-track .mv-page-slot {
  flex: 0 0 auto;
  height: auto;
  min-height: auto;
}

/* ===== Zoom Container ===== */
.mv-zoom-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: center center;
  transform: var(--mv-zoom-transform, scale(1) translate(0px, 0px));
  touch-action: none;
  transition: transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.mv-zoom-container.mv-no-transition {
  transition: none !important;
}

/* ===== Page Images ===== */
.mv-page-slot img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  -webkit-user-drag: none;
  pointer-events: auto;
  display: block;
}

.mv-scroll-track .mv-page-slot img {
  width: 100%;
  height: auto;
  max-height: none;
}

/* ===== Blank page for single-page-in-spread ===== */
.mv-spread-slot .mv-blank-page {
  height: 100%;
  width: auto;
  aspect-ratio: var(--mv-blank-aspect-ratio, auto);
  max-width: 50%;
  max-height: 100%;
  background: var(--mv-bg);
}

.mv-page-fill {
  width: 100%;
  height: 100%;
}

.mv-page-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.mv-page-bg {
  background: var(--mv-page-bg, transparent);
}

.mv-page-link {
  text-decoration: none;
}

.mv-display-none {
  display: none !important;
}

.mv-adsense-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.mv-adsense-inner {
  width: 100%;
  max-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mv-adsense-slot {
  display: block;
  min-width: 300px;
  min-height: 250px;
  width: 100%;
}

.mv-adsense-label {
  margin-top: 20px;
  color: #666;
  font-size: 12px;
  text-align: center;
}

.mv-purchase-trigger {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

/* ===== Spread Mode ===== */
.mv-page-slot.mv-spread-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
}

.mv-page-slot.mv-spread-slot .mv-zoom-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
}

.mv-page-slot.mv-spread-slot img {
  height: 100%;
  width: auto;
  max-width: 50%;
  max-height: 100%;
}

.mv-page-slot.mv-spread-slot.mv-rtl-slot .mv-zoom-container {
  flex-direction: row-reverse;
}

/* ===== Tap Areas ===== */
.mv-tap-area {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 10;
}

.mv-tap-area.mv-left { left: 0; width: 30%; }
.mv-tap-area.mv-right { right: 0; width: 30%; }
.mv-tap-area.mv-center { left: 30%; width: 40%; }

/* ===== Zoom Controls ===== */
.mv-zoom-controls {
  position: fixed;
  bottom: 100px;
  right: 16px;
  z-index: 60;
  display: none;
  flex-direction: column;
  gap: 8px;
  transition: opacity 0.3s ease;
}

.mv-zoom-controls.mv-ui-hidden {
  opacity: 0;
  pointer-events: none;
}

@media (min-width: 769px) {
  .mv-zoom-controls { display: flex; }
}

@media (max-width: 768px) {
  .mv-zoom-controls { display: none !important; }
}

.mv-zoom-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 18px;
}

.mv-zoom-btn:hover {
  background: rgba(250, 204, 21, 0.8);
  color: black;
}

.mv-zoom-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.mv-zoom-btn:disabled:hover {
  background: rgba(0, 0, 0, 0.6);
  color: white;
}

/* ===== Resume Dialog ===== */
.mv-resume-dialog {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  animation: mv-fadeIn 0.3s ease;
}

@keyframes mv-fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.mv-resume-card {
  background: white;
  border-radius: 24px;
  padding: 32px;
  max-width: 340px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: mv-slideUp 0.3s ease;
}

@keyframes mv-slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.mv-resume-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.mv-resume-icon svg {
  width: 28px;
  height: 28px;
  fill: #fff;
}

.mv-resume-title {
  color: #1f2937;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
}

.mv-resume-subtitle {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 24px;
}

.mv-resume-buttons {
  display: flex;
  gap: 12px;
}

.mv-resume-btn {
  flex: 1;
  padding: 14px 16px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.mv-resume-btn.mv-primary {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
}

.mv-resume-btn.mv-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(34, 197, 94, 0.4);
}

.mv-resume-btn.mv-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.mv-resume-btn.mv-secondary:hover {
  background: #e5e7eb;
}

/* ===== Help Overlay ===== */
.mv-help-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.mv-help-card {
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 400px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

@media (max-width: 768px) {
  .mv-help-card { max-height: 70vh; }
}

.mv-help-header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mv-help-title {
  color: #facc15;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
}

.mv-help-close {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.mv-help-close:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.mv-help-content {
  padding: 20px 24px;
}

.mv-help-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}

.mv-help-section:last-child { margin-bottom: 0; }

.mv-help-section-title {
  color: #facc15;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.mv-help-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 10px;
}

.mv-help-item:last-child { margin-bottom: 0; }

.mv-help-item-icon {
  width: 32px;
  height: 32px;
  background: rgba(250, 204, 21, 0.15);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #facc15;
  font-size: 14px;
}

.mv-help-item-text { flex: 1; }

.mv-help-item-label {
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 2px;
}

.mv-help-item-desc {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
}

/* ===== Toast ===== */
.mv-toast {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #fff;
  padding: 10px 18px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 400;
  font-family: 'Zen Maru Gothic', "Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif;
  letter-spacing: 0.02em;
  white-space: nowrap;
  text-align: center;
  max-width: 90vw;
  z-index: 300;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  animation: mv-toastIn 0.3s ease;
}

.mv-toast.mv-fade-out {
  animation: mv-toastOut 0.3s ease forwards;
}

@keyframes mv-toastIn {
  from { opacity: 0; transform: translate(-50%, 20px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}

@keyframes mv-toastOut {
  from { opacity: 1; transform: translate(-50%, 0); }
  to { opacity: 0; transform: translate(-50%, 20px); }
}

/* ===== Purchase Popup ===== */
.mv-purchase-popup {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  pointer-events: none;
}

.mv-purchase-card {
  background: white;
  border-radius: 24px;
  padding: 32px;
  max-width: 380px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  text-align: center;
  pointer-events: auto;
}

.mv-purchase-icon {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #22c55e, #10b981);
  border-radius: 50%;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mv-purchase-title {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 12px;
  color: #1f2937;
}

.mv-purchase-desc {
  color: #6b7280;
  margin-bottom: 6px;
  line-height: 1.5;
  font-size: 0.95rem;
}

.mv-purchase-btn {
  display: block;
  background: linear-gradient(135deg, #22c55e, #10b981);
  color: white;
  padding: 16px 32px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 1.1rem;
  text-decoration: none;
  margin-bottom: 12px;
  margin-top: 24px;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
  border: none;
  cursor: pointer;
  width: 100%;
}

.mv-purchase-back {
  display: block;
  color: #6b7280;
  font-size: 0.9rem;
  padding: 8px 16px;
  text-decoration: none;
}

/* ===== Responsive helpers ===== */
@media (min-width: 769px) {
  .mv-mobile-only { display: none !important; }
}

@media (max-width: 768px) {
  .mv-pc-only { display: none !important; }
}

/* ===== Bookmark Button Active ===== */
.mv-bookmark-btn.mv-bookmark-active {
  color: #facc15 !important;
}

@media (max-width: 768px) {
  .mv-bookmark-btn.mv-bookmark-active {
    color: #f59e0b !important;
  }
  .mv-bookmark-btn.mv-bookmark-active svg {
    fill: #f59e0b !important;
  }
}

/* ===== Bookmark Panel Overlay ===== */
.mv-bookmark-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 90;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.mv-bookmark-overlay.mv-open {
  opacity: 1;
  visibility: visible;
}

/* ===== Bookmark Panel ===== */
.mv-bookmark-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 320px;
  max-width: 85vw;
  background: rgba(30, 30, 30, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 100;
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

[dir="rtl"] .mv-bookmark-panel,
.mv-bookmark-panel.mv-rtl {
  right: auto;
  left: 0;
  transform: translateX(-100%);
}

.mv-bookmark-panel.mv-open {
  transform: translateX(0);
}

@media (max-width: 768px) {
  .mv-bookmark-panel {
    background: rgba(250, 250, 250, 0.98);
  }
}

/* Panel header */
.mv-bookmark-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  padding-top: max(16px, env(safe-area-inset-top));
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .mv-bookmark-panel-header {
    border-bottom-color: rgba(0, 0, 0, 0.1);
  }
}

.mv-bookmark-panel-title {
  color: #fff;
  font-size: 18px;
  font-weight: 700;
}

@media (max-width: 768px) {
  .mv-bookmark-panel-title { color: #333; }
}

.mv-bookmark-panel-close {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.mv-bookmark-panel-close:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

@media (max-width: 768px) {
  .mv-bookmark-panel-close {
    background: rgba(0, 0, 0, 0.06);
    color: #666;
  }
  .mv-bookmark-panel-close:hover { background: rgba(0, 0, 0, 0.1); }
}

/* Toggle button (add/remove current page) */
.mv-bookmark-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 16px 20px 8px;
  padding: 12px 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, #facc15, #f59e0b);
  color: #000;
  font-weight: 600;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mv-bookmark-toggle-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(250, 204, 21, 0.3);
}

.mv-bookmark-toggle-btn svg {
  width: 14px;
  height: 14px;
  fill: currentColor;
}

.mv-bookmark-toggle-btn.mv-bookmark-remove {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.mv-bookmark-toggle-btn.mv-bookmark-remove:hover {
  background: rgba(239, 68, 68, 0.25);
  box-shadow: none;
}

@media (max-width: 768px) {
  .mv-bookmark-toggle-btn.mv-bookmark-remove {
    background: rgba(239, 68, 68, 0.1);
  }
}

/* Bookmark list */
.mv-bookmark-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 12px;
  -webkit-overflow-scrolling: touch;
}

.mv-bookmark-empty {
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
  padding: 32px 16px;
}

@media (max-width: 768px) {
  .mv-bookmark-empty { color: rgba(0, 0, 0, 0.35); }
}

.mv-bookmark-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  margin-bottom: 4px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.mv-bookmark-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.mv-bookmark-item.mv-active {
  background: rgba(250, 204, 21, 0.12);
}

@media (max-width: 768px) {
  .mv-bookmark-item:hover { background: rgba(0, 0, 0, 0.05); }
  .mv-bookmark-item.mv-active { background: rgba(250, 204, 21, 0.1); }
}

.mv-bookmark-item-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.mv-bookmark-item-page {
  font-size: 12px;
  color: #facc15;
  font-weight: 600;
}

.mv-bookmark-item-title {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 768px) {
  .mv-bookmark-item-title { color: #333; }
  .mv-bookmark-item-page { color: #f59e0b; }
}

.mv-bookmark-item-delete {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s ease;
  margin-left: 8px;
}

.mv-bookmark-item-delete:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

@media (max-width: 768px) {
  .mv-bookmark-item-delete { color: rgba(0, 0, 0, 0.25); }
  .mv-bookmark-item-delete:hover { color: #ef4444; }
}

/* ===== SVG icon defaults inside viewer ===== */
.mv-container svg {
  display: inline-block;
  vertical-align: middle;
}
`;

// ──────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function _svgIcon(svgString) {
  // Use a <template> so the browser parses <svg> with the right namespace.
  // DOMParser('image/svg+xml') + importNode used to work but is flaky in
  // some Safari versions when the result is appended into Shadow DOM.
  const tpl = document.createElement('template');
  tpl.innerHTML = String(svgString || '').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  const svg = tpl.content.querySelector('svg');
  if (!svg) return document.createDocumentFragment();
  svg.querySelectorAll('*').forEach((node) => {
    for (const attr of Array.from(node.attributes)) {
      if (/^on/i.test(attr.name)) node.removeAttribute(attr.name);
    }
  });
  return svg;
}

/** Create an element with attributes/listeners and append children. */
function el(tag, attrs = {}, children = []) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'style' && typeof v === 'object') {
      Object.assign(e.style, v);
    } else if (k === 'className') {
      e.className = v;
    } else if (k.startsWith('on') && typeof v === 'function') {
      e.addEventListener(k.slice(2).toLowerCase(), v);
    } else {
      e.setAttribute(k, v);
    }
  }
  for (const c of (Array.isArray(children) ? children : [children])) {
    if (typeof c === 'string') e.appendChild(document.createTextNode(c));
    else if (c) e.appendChild(c);
  }
  return e;
}

// ──────────────────────────────────────────
// Bookmark Manager
// ──────────────────────────────────────────
class BookmarkManager {
  constructor(opts = {}) {
    this._api = opts.bookmarkApi || null;
    this._headers = opts.bookmarkHeaders || {};
    this._id = opts.bookmarkId || this._hashString(location.pathname);
    this._storageKey = `mv-bookmarks-${this._id}`;
    this._maxBookmarks = 20;
    this._bookmarks = []; // [{page_number, title, note?}]
    this._onChange = opts.onBookmarkChange || null;
    this._signal = opts.signal || null;
    this._msg = opts.messages || DEFAULT_MESSAGES;
  }

  _hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
    }
    return Math.abs(hash).toString(36);
  }

  async load() {
    if (this._api) {
      try {
        const res = await fetch(`${this._api}?work_id=${encodeURIComponent(this._id)}`, {
          headers: this._headers,
          signal: this._signal || undefined,
        });
        const data = await res.json();
        if (data.success) this._bookmarks = data.bookmarks || [];
      } catch (e) {
        if (e && e.name === 'AbortError') return this._bookmarks;
        this._loadLocal();
      }
    } else {
      this._loadLocal();
    }
    return this._bookmarks;
  }

  _loadLocal() {
    try {
      const raw = localStorage.getItem(this._storageKey);
      this._bookmarks = raw ? JSON.parse(raw) : [];
    } catch (_) {
      this._bookmarks = [];
    }
  }

  _saveLocal() {
    try {
      localStorage.setItem(this._storageKey, JSON.stringify(this._bookmarks));
    } catch (_) { /* quota */ }
  }

  _notify() {
    if (typeof this._onChange === 'function') this._onChange([...this._bookmarks]);
  }

  get bookmarks() { return this._bookmarks; }

  has(pageNum) {
    return this._bookmarks.some(b => b.page_number === pageNum);
  }

  async add(pageNum, title) {
    if (this._bookmarks.length >= this._maxBookmarks && !this.has(pageNum)) {
      return { success: false, error: this._msg.bookmarkLimit(this._maxBookmarks) };
    }
    title = title || this._msg.bookmarkDefaultTitle(pageNum);

    if (this._api) {
      try {
        const res = await fetch(this._api, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...this._headers },
          body: JSON.stringify({ work_id: this._id, page_number: pageNum, title }),
          signal: this._signal || undefined,
        });
        const data = await res.json();
        if (data.success) {
          const idx = this._bookmarks.findIndex(b => b.page_number === pageNum);
          if (idx >= 0) this._bookmarks[idx].title = title;
          else this._bookmarks.push({ page_number: pageNum, title });
          this._bookmarks.sort((a, b) => a.page_number - b.page_number);
          this._notify();
        }
        return data;
      } catch (e) {
        return { success: false, error: e.message };
      }
    }

    const idx = this._bookmarks.findIndex(b => b.page_number === pageNum);
    if (idx >= 0) this._bookmarks[idx].title = title;
    else this._bookmarks.push({ page_number: pageNum, title });
    this._bookmarks.sort((a, b) => a.page_number - b.page_number);
    this._saveLocal();
    this._notify();
    return { success: true };
  }

  async remove(pageNum) {
    if (this._api) {
      try {
        const res = await fetch(this._api, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json', ...this._headers },
          body: JSON.stringify({ work_id: this._id, page_number: pageNum }),
        });
        const data = await res.json();
        if (data.success) {
          this._bookmarks = this._bookmarks.filter(b => b.page_number !== pageNum);
          this._notify();
        }
        return data;
      } catch (e) {
        return { success: false, error: e.message };
      }
    }

    this._bookmarks = this._bookmarks.filter(b => b.page_number !== pageNum);
    this._saveLocal();
    this._notify();
    return { success: true };
  }
}

// ──────────────────────────────────────────
// MangaViewer class
// ──────────────────────────────────────────
export default class MangaViewer {
  /**
   * @param {Object} options
   * @param {string|HTMLElement} options.container  — selector or DOM element
   * @param {Array<string|Object>} options.pages    — image URLs or page objects
   *   string → image URL
   *   { type:'image', src, linkUrl?, linkTarget?, backgroundColor? }
   *   { type:'html',  html, linkUrl?, linkTarget?, backgroundColor? }
   *   { type:'adsense', client, slot, backgroundColor? }
   * @param {string}  [options.direction='rtl']         — 'rtl' | 'ltr'
   * @param {boolean} [options.firstPageSingle=true]     — show first page alone in spread
   * @param {string}  [options.viewMode='page']          — 'page' | 'scroll'
   * @param {Object}  [options.adsense]                  — { client, slot } appended at end
   * @param {number}  [options.previewLimit=null]         — free preview pages
   * @param {Function}[options.onPageChange]              — (currentPage, totalPages) => {}
   * @param {Function}[options.onComplete]                — called when last page reached
   * @param {string}  [options.storageKey='manga_progress'] — localStorage key
   * @param {string}  [options.title='']
   * @param {string}  [options.backUrl='/']
   * @param {boolean} [options.showHeader=true]
   * @param {boolean} [options.showFooter=true]
   * @param {string}  [options.shareUrl]                  — URL used for share/copy
   * @param {string}  [options.purchaseUrl]               — URL for purchase button
   * @param {string}  [options.purchasePrice]             — display price string
   * @param {string}  [options.loadingText='Loading...']
   * @param {boolean} [options.bookmarks=true]            — enable bookmarks UI
   * @param {string}  [options.bookmarkId]                — work-id used for bookmark sync; defaults to a hash of location.pathname
   * @param {string}  [options.bookmarkApi=null]          — REST endpoint for cross-device bookmark sync
   * @param {Object}  [options.bookmarkHeaders={}]        — extra fetch headers for bookmarkApi requests
   * @param {Function}[options.onBookmarkChange]          — (bookmarks) => void; fires after add/remove
   * @param {Function}[options.htmlSanitizer]             — (htmlString) => string; pass DOMPurify.sanitize for stronger guarantees
   * @param {Object}  [options.messages]                  — partial override for UI strings (see DEFAULT_MESSAGES)
   */
  constructor(options = {}) {
    // ── Options ──
    const o = Object.assign({
      container: '#viewer',
      pages: [],
      direction: 'rtl',
      firstPageSingle: true,
      viewMode: 'page',
      adsense: null,
      previewLimit: null,
      onPageChange: null,
      onComplete: null,
      storageKey: 'manga_progress',
      title: '',
      backUrl: '/',
      showHeader: true,
      showFooter: true,
      shareUrl: '',
      purchaseUrl: '',
      purchasePrice: '',
      loadingText: '読み込み中…',
      bookmarks: true,
      bookmarkId: '',
      bookmarkApi: null,
      bookmarkHeaders: {},
      onBookmarkChange: null,
      htmlSanitizer: null,
      messages: null,
      theme: 'auto',
      hideButtons: [],
      extraButtons: [],
      footerBottomPadding: null,
      onBack: null,
      lastPageAlign: 'center',
    }, options);

    if (!['auto', 'light', 'dark'].includes(o.theme)) {
      // Defensive — fall back rather than throw, since theme is cosmetic.
      o.theme = 'auto';
    }

    this.opts = o;
    // Merge user-provided messages over the defaults, leaving unsupplied keys at default.
    this._msg = Object.assign({}, DEFAULT_MESSAGES, o.messages || {});

    // resolve container
    this._host = typeof o.container === 'string'
      ? document.querySelector(o.container)
      : o.container;
    if (!this._host) throw new Error('MangaViewer: container not found');
    this._host.setAttribute('tabindex', '0');
    this._host.classList.remove('mv-theme-auto', 'mv-theme-light', 'mv-theme-dark');
    this._host.classList.add(`mv-theme-${o.theme}`);
    if (o.footerBottomPadding != null) {
      const value = typeof o.footerBottomPadding === 'number'
        ? `${o.footerBottomPadding}px`
        : String(o.footerBottomPadding);
      this._host.style.setProperty('--mv-footer-bottom-padding', value);
    }
    this.shadowRoot = this._host.shadowRoot || this._host.attachShadow({ mode: 'open' });
    this._root = this.shadowRoot;

    // ── Normalise pages ──
    this._rawPages = this._normalisePages(o.pages);

    // Append AdSense page if provided at top-level
    if (o.adsense && o.adsense.client && o.adsense.slot) {
      this._rawPages.push({
        type: 'adsense',
        client: o.adsense.client,
        slot: o.adsense.slot,
        backgroundColor: '#1a1a1a',
        isInsert: true,
      });
    }

    // Preview limit: add purchase page
    this._totalOriginalPages = this._rawPages.filter(p => !p.isInsert).length;
    this._hasPreviewLimit = (o.previewLimit != null && o.previewLimit > 0);
    if (this._hasPreviewLimit) {
      // Count only non-insert pages up to limit, keep inserts before them
      let count = 0;
      const limited = [];
      for (const p of this._rawPages) {
        if (p.isInsert) { limited.push(p); continue; }
        count++;
        if (count > o.previewLimit) break;
        limited.push(p);
      }
      limited.push({ type: 'purchase', isPurchasePage: true });
      this._rawPages = limited;
    }

    this._pages = this._rawPages;
    this._totalPages = this._pages.length;

    // ── State ──
    this._currentSlotIndex = 0;
    this._slots = [];
    this._spreadMode = false;
    this._uiVisible = true;
    this._containerWidth = 0;

    // Drag / swipe
    this._isDragging = false;
    this._startX = 0;
    this._currentX = 0;
    this._offsetX = 0;
    this._dragStartTime = 0;

    // Zoom
    this._currentZoom = 1;
    this._zoomPanX = 0;
    this._zoomPanY = 0;
    this._isZoomPanning = false;
    this._zoomPanStartX = 0;
    this._zoomPanStartY = 0;
    this._zoomPanOffsetX = 0;
    this._zoomPanOffsetY = 0;

    // Momentum / inertia
    this._velocityX = 0;
    this._velocityY = 0;
    this._lastMoveTime = 0;
    this._lastMoveX = 0;
    this._lastMoveY = 0;
    this._momentumID = null;
    this._velocityHistory = [];
    this._momentumStartTime = 0;
    this._momentumInitialVelocityX = 0;
    this._momentumInitialVelocityY = 0;

    // Bounce
    this._bounceAnimationID = null;
    this._bounceVelocityX = 0;
    this._bounceVelocityY = 0;
    this._isOverscrolling = false;

    // Pinch
    this._initialPinchDistance = 0;
    this._initialPinchZoom = 1;
    this._pinchCenterX = 0;
    this._pinchCenterY = 0;
    this._zoomPanStartXBackup = 0;
    this._zoomPanStartYBackup = 0;

    // Double-tap
    this._lastTapTime = 0;
    this._pendingTapAction = null;
    this._lastTouchEndTime = 0;
    this._lastTouchX = 0;
    this._lastTouchY = 0;

    // Edge swipe (zoomed)
    this._edgeSwipeStartX = 0;
    this._edgeOverscroll = 0;

    // Device
    this._isMobile = window.matchMedia('(max-width: 768px)').matches;
    this._isTouchDevice = 'ontouchstart' in window;

    // Wheel cooldown
    this._wheelCooldownUntil = 0;
    this._resizeRaf = null;

    // Bound handlers (for cleanup)
    this._bound = {};

    // Bookmark manager
    this._bookmarkMgr = null;
    this._bookmarkPanelOpen = false;
    this._bmLongPress = false;
    this._bmTimer = null;

    // Pending async work (cleared on destroy)
    this._timers = new Set();
    this._rafs = new Set();
    this._abortController = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    this._destroyed = false;

    // Build DOM & init
    this._build();
    this._init();
    this._trackRaf(requestAnimationFrame(() => this._focusHost()));
  }

  /** Schedule a setTimeout that auto-cancels on destroy(). */
  _setManagedTimeout(fn, ms) {
    if (this._destroyed) return null;
    const id = setTimeout(() => {
      this._timers.delete(id);
      if (!this._destroyed) fn();
    }, ms);
    this._timers.add(id);
    return id;
  }

  /** Track a requestAnimationFrame ID so destroy() can cancel it. */
  _trackRaf(id) {
    if (id != null) this._rafs.add(id);
    return id;
  }

  /** AbortSignal for fetch / event listeners that should die with the viewer. */
  get abortSignal() {
    return this._abortController ? this._abortController.signal : undefined;
  }

  // ─── Page normalisation ───
  _normalisePages(input) {
    return input.map((p, i) => {
      if (typeof p === 'string') return { type: 'image', src: p, pageIndex: i };
      return Object.assign({ pageIndex: i }, p);
    });
  }

  // ─── DOM Construction ───
  _build() {
    const o = this.opts;
    this._root.replaceChildren();

    const styleTag = el('style');
    styleTag.textContent = MANGA_VIEWER_CSS;
    this._root.appendChild(styleTag);

    // Loading screen
    this._loadingEl = el('div', { className: 'mv-loading-screen' }, [
      el('div', { className: 'mv-loading-spinner' }),
      el('div', { className: 'mv-loading-text' }, o.loadingText),
    ]);
    this._root.appendChild(this._loadingEl);

    // Screen-reader-only live region for page change announcements
    this._liveRegion = el('div', {
      className: 'mv-sr-only',
      'aria-live': 'polite',
      'aria-atomic': 'true',
    });
    this._root.appendChild(this._liveRegion);

    // Status bar cover
    this._statusBarCover = el('div', { className: 'mv-status-bar-cover' });

    // Container
    this._container = el('div', { className: 'mv-container' });

    // Main area
    this._main = el('div', { className: 'mv-main' });
    this._slotTrack = el('div', { className: 'mv-slot-track' });
    this._main.appendChild(this._slotTrack);

    // Tap areas (page mode only)
    this._tapLeft = el('div', { className: 'mv-tap-area mv-left', role: 'button', 'aria-label': this.opts.direction === 'rtl' ? this._msg.ariaNextPage : this._msg.ariaPrevPage });
    this._tapCenter = el('div', { className: 'mv-tap-area mv-center' });
    this._tapRight = el('div', { className: 'mv-tap-area mv-right', role: 'button', 'aria-label': this.opts.direction === 'rtl' ? this._msg.ariaPrevPage : this._msg.ariaNextPage });
    this._main.appendChild(this._tapLeft);
    this._main.appendChild(this._tapCenter);
    this._main.appendChild(this._tapRight);

    this._container.appendChild(this._main);

    // Header
    this._header = this._buildHeader();
    if (!o.showHeader) this._header.classList.add('mv-hidden');
    this._container.appendChild(this._header);

    // Footer
    this._footer = this._buildFooter();
    if (!o.showFooter) this._footer.classList.add('mv-hidden');
    this._container.appendChild(this._footer);

    // Zoom controls
    this._zoomControls = el('div', { className: 'mv-zoom-controls' });
    this._zoomInBtn = el('button', { className: 'mv-zoom-btn', title: 'Zoom in', onClick: () => this.zoomIn() }, _svgIcon(ICONS.searchPlus));
    this._zoomResetBtn = el('button', { className: 'mv-zoom-btn', title: 'Reset zoom', disabled: 'disabled', onClick: () => this.resetZoom() }, _svgIcon(ICONS.compressAlt));
    if (!this._isHidden('zoomIn'))    this._zoomControls.appendChild(this._zoomInBtn);
    if (!this._isHidden('zoomReset')) this._zoomControls.appendChild(this._zoomResetBtn);
    this._container.appendChild(this._zoomControls);

    this._container.appendChild(this._statusBarCover);
    this._root.appendChild(this._container);
  }

  /** Returns true when the named standard button is in `opts.hideButtons`. */
  _isHidden(name) {
    return Array.isArray(this.opts.hideButtons) && this.opts.hideButtons.includes(name);
  }

  /**
   * Render the icon value supplied in an extraButtons entry.
   * - HTMLElement / DocumentFragment → cloned and used verbatim
   * - String → treated as inline SVG and run through the sanitizer
   * - Falsy → returns null
   * @returns {Node|null}
   */
  _renderExtraIcon(icon) {
    if (!icon) return null;
    if (icon instanceof Node) return icon.cloneNode(true);
    if (typeof icon === 'string') {
      const frag = this._sanitizeHtml(icon);
      // If sanitizer stripped everything, fall back gracefully.
      return frag.childNodes.length ? frag : null;
    }
    return null;
  }

  /**
   * Append all caller-supplied buttons whose `slot` matches the given slot
   * name onto `target`. Insertion order in the array is preserved; `position`
   * controls insertion against the existing children of `target`.
   */
  _appendExtraButtons(target, slot) {
    const list = Array.isArray(this.opts.extraButtons) ? this.opts.extraButtons : [];
    for (const def of list) {
      if (!def || typeof def.onClick !== 'function') continue;
      if ((def.slot || 'header') !== slot) continue;

      const label = def.label || def.ariaLabel || '';
      const ariaLabel = def.ariaLabel || label;
      const className = `mv-header-btn${def.className ? ' ' + def.className : ''}`;
      const btn = el('button', {
        className,
        type: 'button',
        title: label,
        'aria-label': ariaLabel,
        onClick: (event) => {
          try { def.onClick(event, this); } catch (e) { /* never let user code break the viewer */ }
        },
      });
      const iconNode = this._renderExtraIcon(def.icon);
      if (iconNode) btn.appendChild(iconNode);
      else if (label) btn.appendChild(document.createTextNode(label));

      // Position: 'start' | 'end' | number. Default 'end'.
      const pos = def.position;
      if (pos === 'start') {
        target.insertBefore(btn, target.firstChild);
      } else if (typeof pos === 'number' && Number.isFinite(pos)) {
        const ref = target.children[Math.max(0, Math.min(pos, target.children.length))];
        if (ref) target.insertBefore(btn, ref); else target.appendChild(btn);
      } else {
        target.appendChild(btn);
      }
    }
  }

  _buildHeader() {
    const o = this.opts;
    const header = el('div', { className: 'mv-header' });

    // Back button.
    // - If `opts.onBack` is a function, the button stops navigation and calls it.
    //   Useful for `history.back()` or "return to landing page" scenarios.
    // - Otherwise the button navigates to `opts.backUrl` like in v0.4.x.
    const backHref = (typeof o.onBack === 'function') ? '#' : o.backUrl;
    const backBtn = el('a', { href: backHref, className: 'mv-header-btn', title: 'Back', 'aria-label': 'Back' }, _svgIcon(ICONS.chevronLeft));
    if (typeof o.onBack === 'function') {
      backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        try { o.onBack(e, this); } catch (_) {}
      });
    }
    if (!this._isHidden('back')) header.appendChild(backBtn);

    // Title
    const title = el('h1', { className: 'mv-title' }, o.title);
    header.appendChild(title);

    // Right buttons
    const btns = el('div', { className: 'mv-header-buttons' });

    // Bookmark
    this._bookmarkBtn = el('button', { className: 'mv-header-btn mv-bookmark-btn', title: this._msg.bookmarkBtnTitle, 'aria-label': this._msg.bookmarkBtnTitle }, _svgIcon(ICONS.bookmark));
    if (this.opts.bookmarks && !this._isHidden('bookmark')) btns.appendChild(this._bookmarkBtn);

    // Fullscreen (PC only)
    this._fullscreenBtn = el('button', { className: 'mv-header-btn mv-pc-only', title: 'Fullscreen', onClick: () => this._toggleFullscreen() }, _svgIcon(ICONS.expand));
    if (!this._isHidden('fullscreen')) btns.appendChild(this._fullscreenBtn);

    // Share to X
    if (!this._isHidden('share')) {
      btns.appendChild(el('button', { className: 'mv-header-btn', title: 'Share on X', onClick: () => this._shareToX() }, _svgIcon(ICONS.xLogo)));
    }

    // Copy link
    if (!this._isHidden('copy')) {
      btns.appendChild(el('button', { className: 'mv-header-btn', title: 'Copy link', onClick: () => this._copyLink() }, _svgIcon(ICONS.link)));
    }

    // Help
    if (!this._isHidden('help')) {
      btns.appendChild(el('button', { className: 'mv-header-btn', title: this._msg.helpBtnTitle, 'aria-label': this._msg.helpBtnTitle, onClick: () => this._showHelp() }, _svgIcon(ICONS.question)));
    }

    // Caller-supplied custom buttons (header slot)
    this._appendExtraButtons(btns, 'header');

    header.appendChild(btns);
    return header;
  }

  _buildFooter() {
    const o = this.opts;
    const footer = el('div', { className: 'mv-footer' });

    const info = el('div', { className: 'mv-footer-info' });
    this._currentPageEl = el('span');
    this._currentPageEl.textContent = '1 / ' + this._totalPages;
    this._progressEl = el('span');
    this._progressEl.textContent = '0%';
    info.appendChild(this._currentPageEl);
    info.appendChild(this._progressEl);
    footer.appendChild(info);

    this._slider = el('input', {
      type: 'range',
      className: 'mv-page-slider' + (o.direction === 'rtl' ? ' mv-rtl-slider' : ''),
      min: '1',
      max: String(this._totalPages),
      value: '1',
      role: 'slider',
      'aria-label': 'Page slider',
    });
    footer.appendChild(this._slider);

    // Caller-supplied custom buttons (footer slot)
    this._appendExtraButtons(footer, 'footer');

    return footer;
  }

  // ─── Init ───
  _init() {
    this._containerWidth = this._main.offsetWidth;
    this._checkOrientation();

    if (this.opts.viewMode === 'scroll') {
      this._main.classList.add('mv-scroll-mode');
      this._slotTrack.classList.add('mv-scroll-track');
      this._tapLeft.classList.add('mv-display-none');
      this._tapRight.classList.add('mv-display-none');
      this._zoomControls.classList.add('mv-display-none');
    }

    this._buildSlots();
    this._renderSlots();
    this._updateTrackPosition(false);
    this._updateUI();
    this._setupEvents();

    // Resume reading
    const saved = this._loadProgress();
    if (saved && saved.pageIndex > 0) {
      this._showResumeDialog(saved);
    }

    // Hide loading
    setTimeout(() => {
      if (this._loadingEl) this._loadingEl.classList.add('mv-fade-out');
    }, 300);

    // Init bookmarks
    if (this.opts.bookmarks) this._initBookmarks();
  }

  // ─── Slots ───
  _buildSlots() {
    this._slots = [];
    const pages = this._pages;

    if (!this._spreadMode) {
      pages.forEach((_, i) => this._slots.push({ pages: [i], spread: false }));
    } else {
      let i = 0;
      if (this.opts.firstPageSingle && pages.length > 0) {
        // Pair cover with a blank page as a normal spread
        this._slots.push({ pages: [0], spread: true, hasBlank: true });
        i = 1;
      }
      while (i < pages.length) {
        const p = pages[i];
        if (p.type === 'adsense' || p.type === 'purchase') {
          this._slots.push({ pages: [i], spread: false });
          i++;
          continue;
        }
        if (i + 1 < pages.length && pages[i + 1].type !== 'adsense' && pages[i + 1].type !== 'purchase') {
          this._slots.push({ pages: [i, i + 1], spread: true });
          i += 2;
        } else {
          // Orphan last page in spread mode. Position depends on lastPageAlign:
          //   'center' (default v0.4.x compat) — single, centered slot
          //   'start' — pair with blank on the reading-end side (so page sits at reading start)
          //   'end'   — pair with blank on the reading-start side (so page sits at reading end)
          const align = this.opts.lastPageAlign;
          if (align === 'start' || align === 'end') {
            this._slots.push({ pages: [i], spread: true, hasBlank: true, blankAlign: align });
          } else {
            this._slots.push({ pages: [i], spread: false });
          }
          i++;
        }
      }
    }
  }

  _renderSlots() {
    const dir = this.opts.direction;
    const isScroll = this.opts.viewMode === 'scroll';
    const shouldReverse = !isScroll && dir === 'rtl';
    const displaySlots = shouldReverse ? [...this._slots].reverse() : this._slots;
    this._slotTrack.replaceChildren();

    displaySlots.forEach((slot, displayIdx) => {
      const realIdx = shouldReverse ? this._slots.length - 1 - displayIdx : displayIdx;
      const classes = ['mv-page-slot'];
      if (slot.spread) {
        classes.push('mv-spread-slot');
        if (dir === 'rtl') classes.push('mv-rtl-slot');
      }

      const slotEl = el('div', { className: classes.join(' '), 'data-slot': String(realIdx) });
      const zoomEl = el('div', { className: 'mv-zoom-container', 'data-zoom-slot': String(realIdx) });
      slotEl.appendChild(zoomEl);

      const pageNodes = [];
      slot.pages.forEach(pageIdx => {
        const shouldEagerLoad = realIdx <= 2;
        const loadingAttr = shouldEagerLoad ? 'eager' : 'lazy';
        pageNodes.push(this._createPageNode(pageIdx, loadingAttr));
      });

      if (slot.hasBlank) {
        const blank = el('div', { className: 'mv-blank-page', 'aria-hidden': 'true' });
        // Cover slot keeps the v0.2.x convention. Orphan last-page slots
        // honour `lastPageAlign`:
        //   'start' → page at reading-start side (RTL=right, LTR=left)
        //   'end'   → page at reading-end side (RTL=left, LTR=right)
        if (slot.blankAlign === 'start') {
          pageNodes.push(blank);
        } else if (slot.blankAlign === 'end') {
          pageNodes.unshift(blank);
        } else if (dir === 'rtl') {
          pageNodes.unshift(blank);
        } else {
          pageNodes.push(blank);
        }
      }

      pageNodes.forEach(node => zoomEl.appendChild(node));
      this._slotTrack.appendChild(slotEl);
    });

    // Match blank page size to adjacent cover image
    this._slotTrack.querySelectorAll('.mv-blank-page').forEach(blank => {
      const sibling = blank.parentElement.querySelector('img');
      if (sibling) {
        const matchSize = () => {
          if (sibling.naturalWidth && sibling.naturalHeight) {
            blank.style.setProperty('--mv-blank-aspect-ratio', `${sibling.naturalWidth} / ${sibling.naturalHeight}`);
          }
        };
        if (sibling.complete) matchSize();
        else sibling.addEventListener('load', matchSize, { once: true });
      }
    });

    this._preloadNearby();

    // AdSense push
    this._setManagedTimeout(() => this._initAds(), ADSENSE_INIT_DELAY_MS);
  }

  _createPageNode(pageIdx, loadingAttr) {
    const page = this._pages[pageIdx];

    if (page.type === 'adsense') {
      const wrap = el('div', { className: 'mv-adsense-page mv-page-fill mv-page-bg' });
      wrap.style.setProperty('--mv-page-bg', page.backgroundColor || '#1a1a1a');

      const inner = el('div', { className: 'mv-adsense-inner' });
      const ad = el('ins', {
        className: 'adsbygoogle mv-adsense-slot',
        'data-ad-client': page.client || '',
        'data-ad-slot': page.slot || '',
        'data-ad-format': 'auto',
        'data-full-width-responsive': 'true',
      });
      inner.appendChild(ad);
      wrap.appendChild(inner);

      const labelWrap = el('div', { className: 'mv-adsense-label' });
      labelWrap.appendChild(el('p', {}, 'Ad'));
      wrap.appendChild(labelWrap);
      return wrap;
    }

    if (page.type === 'purchase' || page.isPurchasePage) {
      return el('div', { className: 'mv-purchase-trigger mv-page-fill' });
    }

    if (page.type === 'html') {
      const target = page.linkUrl
        ? el('a', {
          href: page.linkUrl,
          target: page.linkTarget || '_blank',
          rel: 'noopener noreferrer',
          className: 'mv-page-fill mv-page-center mv-page-bg mv-page-link',
        })
        : el('div', { className: 'mv-page-fill mv-page-center mv-page-bg' });
      target.style.setProperty('--mv-page-bg', page.backgroundColor || '#000');
      if (page.html) target.appendChild(this._sanitizeHtml(page.html));
      return target;
    }

    const src = page.src || '';
    const img = el('img', {
      src,
      alt: `Page ${pageIdx + 1}`,
      draggable: 'false',
      loading: loadingAttr,
      decoding: 'async',
    });

    if (!page.linkUrl) return img;

    const anchor = el('a', {
      href: page.linkUrl,
      target: page.linkTarget || '_blank',
      rel: 'noopener noreferrer',
      className: 'mv-page-center mv-page-bg mv-page-link',
    });
    if (page.backgroundColor) anchor.style.setProperty('--mv-page-bg', page.backgroundColor);
    anchor.appendChild(img);
    return anchor;
  }

  _initAds() {
    // Warning: AdSense may not work inside Shadow DOM. Consider using slots for ad placement.
    if (typeof window.adsbygoogle === 'undefined') return;
    try {
      this.shadowRoot.querySelectorAll('.adsbygoogle').forEach(ad => {
        if (!ad.getAttribute('data-adsbygoogle-status')) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      });
    } catch (_) { /* ignore */ }
  }

  _preloadNearby() {
    const radius = 5;
    for (let d = 1; d <= radius; d++) {
      [this._currentSlotIndex + d, this._currentSlotIndex - d].forEach(idx => {
        if (idx < 0 || idx >= this._slots.length) return;
        const slotEl = this._slotTrack.querySelector(`.mv-page-slot[data-slot="${idx}"]`);
        if (!slotEl) return;
        slotEl.querySelectorAll('img[loading="lazy"]').forEach(img => {
          if (!img.complete && !img.dataset.preloaded) {
            img.loading = 'eager';
            img.dataset.preloaded = 'true';
          }
        });
      });
    }
  }

  // ─── Orientation / Spread ───
  _checkOrientation() {
    if (this.opts.viewMode === 'scroll') { this._spreadMode = false; return; }
    const isLandscape = window.innerWidth > window.innerHeight;
    const wasSpread = this._spreadMode;
    this._spreadMode = isLandscape;

    if (wasSpread !== this._spreadMode && this._slots.length > 0) {
      const pageIdx = this._getCurrentPageIndex();
      this._buildSlots();
      this._renderSlots();
      this._currentSlotIndex = this._findSlotByPageIndex(pageIdx);
      this._updateTrackPosition(false);
      this._updateUI();
    }
  }

  // ─── Events ───
  _setupEvents() {
    const bind = (target, evt, fn, opts) => {
      const bound = fn.bind(this);
      target.addEventListener(evt, bound, opts);
      if (!this._bound._list) this._bound._list = [];
      this._bound._list.push([target, evt, bound, opts]);
    };

    if (this.opts.viewMode !== 'scroll') {
      bind(this._main, 'touchstart', this._onTouchStart, { passive: false });
      bind(this._main, 'touchmove', this._onTouchMove, { passive: false });
      bind(this._main, 'touchend', this._onTouchEnd);
      bind(this._main, 'mousedown', this._onMouseDown);
      bind(this._main, 'mousemove', this._onMouseMove);
      bind(this._main, 'mouseup', this._onMouseUp);
      bind(this._main, 'mouseleave', this._onMouseUp);
      bind(this._tapLeft, 'click', this._onTapLeft);
      bind(this._tapRight, 'click', this._onTapRight);
    } else {
      bind(this._main, 'scroll', this._onScroll);
    }

    bind(this._tapCenter, 'click', this._onTapCenter);
    bind(this._host, 'click', () => this._focusHost());
    bind(this._host, 'keydown', this._onKeyDown);
    bind(this._main, 'wheel', this._onWheel, { passive: false });
    bind(this._slider, 'input', this._onSliderInput);
    bind(window, 'resize', this._onResize);
    bind(window, 'orientationchange', () => this._setManagedTimeout(() => this._onResize(), ORIENTATION_DEBOUNCE_MS));
    bind(window, 'beforeunload', () => this._saveProgress());
    bind(document, 'visibilitychange', () => { if (document.visibilityState === 'hidden') this._saveProgress(); });
    bind(window, 'pagehide', () => this._saveProgress());
    bind(document, 'fullscreenchange', () => this._updateFullscreenIcon());
    bind(document, 'webkitfullscreenchange', () => this._updateFullscreenIcon());
    bind(this._bookmarkBtn, 'pointerdown', this._onBookmarkPointerDown);
    bind(this._bookmarkBtn, 'pointerup', this._onBookmarkPointerUp);
    bind(this._bookmarkBtn, 'pointerleave', this._onBookmarkPointerLeave);
  }

  _onBookmarkPointerDown() {
    this._bmLongPress = false;
    clearTimeout(this._bmTimer);
    this._bmTimer = setTimeout(() => {
      this._bmLongPress = true;
      this._toggleBookmarkPanel();
    }, 500);
  }

  _onBookmarkPointerUp() {
    clearTimeout(this._bmTimer);
    this._bmTimer = null;
    if (!this._bmLongPress) this._toggleCurrentPageBookmark();
  }

  _onBookmarkPointerLeave() {
    clearTimeout(this._bmTimer);
    this._bmTimer = null;
  }

  _focusHost() {
    if (!this._host || typeof this._host.focus !== 'function') return;
    try {
      this._host.focus({ preventScroll: true });
    } catch (_) {
      this._host.focus();
    }
  }

  _onResize() {
    if (this._resizeRaf !== null) return;
    this._resizeRaf = requestAnimationFrame(() => {
      this._resizeRaf = null;
      this._containerWidth = this._main.offsetWidth;
      this._isMobile = window.matchMedia('(max-width: 768px)').matches;
      this._checkOrientation();
      this._updateTrackPosition(false);
    });
  }

  // ─── Touch handlers ───
  _onTouchStart(e) {
    this._stopMomentum();

    if (e.touches.length === 2) {
      e.preventDefault();
      const container = this._getCurrentZoomContainer();
      if (container) container.classList.add('mv-no-transition');
      const dist = this._pinchDist(e.touches);
      const center = this._pinchCenter(e.touches);
      this._initialPinchDistance = dist;
      this._initialPinchZoom = this._currentZoom;
      this._pinchCenterX = center.x - window.innerWidth / 2;
      this._pinchCenterY = center.y - window.innerHeight / 2;
      this._zoomPanStartXBackup = this._zoomPanX;
      this._zoomPanStartYBackup = this._zoomPanY;
      this._isDragging = false;
      return;
    }

    if (this._currentZoom > 1 && e.touches.length === 1) {
      e.preventDefault();
      this._startZoomPan(e.touches[0].clientX, e.touches[0].clientY);
      return;
    }

    if (e.touches.length !== 1) return;
    this._startDrag(e.touches[0].clientX);
  }

  _onTouchMove(e) {
    if (e.touches.length === 2 && this._initialPinchDistance > 0) {
      e.preventDefault();
      const dist = this._pinchDist(e.touches);
      const scale = dist / this._initialPinchDistance;
      let newZoom = this._initialPinchZoom * scale;
      if (this._initialPinchZoom > 0) {
        const ratio = newZoom / this._initialPinchZoom;
        this._zoomPanX = this._pinchCenterX - (this._pinchCenterX - this._zoomPanStartXBackup) * ratio;
        this._zoomPanY = this._pinchCenterY - (this._pinchCenterY - this._zoomPanStartYBackup) * ratio;
      }
      if (newZoom !== this._currentZoom) this._setZoom(newZoom);
      return;
    }

    if (this._isZoomPanning && e.touches.length === 1) {
      e.preventDefault();
      this._moveZoomPan(e.touches[0].clientX, e.touches[0].clientY);
      return;
    }

    if (!this._isDragging) return;
    e.preventDefault();
    this._moveDrag(e.touches[0].clientX);
  }

  _onTouchEnd(e) {
    if (this._initialPinchDistance > 0) {
      this._initialPinchDistance = 0;
      const container = this._getCurrentZoomContainer();
      if (container) container.classList.remove('mv-no-transition');
      if (this._currentZoom < 1.1) this.resetZoom();
      else if (this._currentZoom > ZOOM_MAX) this._setZoom(ZOOM_MAX);
      return;
    }

    if (this._isZoomPanning) {
      this._endZoomPan();
      if (this._currentZoom > 1) {
        const now = Date.now();
        const dist = Math.sqrt(
          Math.pow(this._zoomPanStartX - this._lastTouchX, 2) +
          Math.pow(this._zoomPanStartY - this._lastTouchY, 2)
        );
        if (now - this._lastTouchEndTime < DOUBLE_TAP_DELAY && dist < 50) {
          this.resetZoom();
        }
        this._lastTouchEndTime = now;
        this._lastTouchX = this._zoomPanStartX;
        this._lastTouchY = this._zoomPanStartY;
      }
      return;
    }

    this._endDrag();
  }

  // ─── Mouse handlers ───
  _onMouseDown(e) {
    this._stopMomentum();
    if (this._currentZoom > 1) {
      e.preventDefault();
      this._startZoomPan(e.clientX, e.clientY);
      return;
    }
    e.preventDefault();
    this._startDrag(e.clientX);
  }

  _onMouseMove(e) {
    if (this._isZoomPanning) {
      e.preventDefault();
      this._moveZoomPan(e.clientX, e.clientY);
      return;
    }
    if (!this._isDragging) return;
    e.preventDefault();
    this._moveDrag(e.clientX);
  }

  _onMouseUp() {
    if (this._isZoomPanning) {
      this._endZoomPan();
      return;
    }
    this._endDrag();
  }

  // ─── Zoom panning (shared touch/mouse) ───
  _startZoomPan(x, y) {
    this._isZoomPanning = true;
    this._edgeOverscroll = 0;
    const container = this._getCurrentZoomContainer();
    if (container) container.classList.add('mv-no-transition');
    this._slotTrack.classList.add('mv-no-transition');
    this._zoomPanStartX = x;
    this._zoomPanStartY = y;
    this._zoomPanOffsetX = this._zoomPanX;
    this._zoomPanOffsetY = this._zoomPanY;
    this._edgeSwipeStartX = x;
    this._lastMoveTime = Date.now();
    this._lastMoveX = x;
    this._lastMoveY = y;
    this._velocityX = 0;
    this._velocityY = 0;
    this._velocityHistory = [];
  }

  _moveZoomPan(x, y) {
    const dx = x - this._zoomPanStartX;
    const dy = y - this._zoomPanStartY;

    // Velocity tracking
    const now = Date.now();
    const dt = now - this._lastMoveTime;
    if (dt > 0 && dt < 100) {
      const vx = (x - this._lastMoveX) / dt * 16;
      const vy = (y - this._lastMoveY) / dt * 16;
      this._velocityHistory.push({ vx, vy, time: now });
      if (this._velocityHistory.length > 5) this._velocityHistory.shift();
    }
    this._lastMoveTime = now;
    this._lastMoveX = x;
    this._lastMoveY = y;

    const res = this._updateZoomPan(this._zoomPanOffsetX + dx, this._zoomPanOffsetY + dy);

    // Determine swipe direction
    const totalDx = x - this._edgeSwipeStartX;
    const totalDy = y - this._zoomPanStartY;
    const isHorizontalSwipe = Math.abs(totalDx) > Math.abs(totalDy) * 1.5;

    if (res.overscroll !== 0) {
      if (!isHorizontalSwipe) { this._edgeOverscroll = 0; return; }
      this._edgeOverscroll = res.overscroll;
      this._velocityHistory = [];
      if (Math.abs(this._edgeOverscroll) < 10) return;

      const trackOffset = this._edgeOverscroll * 0.3;
      let displayIndex = this.opts.direction === 'rtl'
        ? this._slots.length - 1 - this._currentSlotIndex
        : this._currentSlotIndex;
      const baseOffset = -displayIndex * this._containerWidth;
      this._slotTrack.style.setProperty('--mv-track-transform', `translateX(${baseOffset + trackOffset}px)`);
    } else {
      this._edgeOverscroll = 0;
    }
  }

  _endZoomPan() {
    this._isZoomPanning = false;

    if (Math.abs(this._edgeOverscroll) < 10) {
      this._initMomentum();
    } else {
      const container = this._getCurrentZoomContainer();
      if (container) container.classList.remove('mv-no-transition');
    }

    this._slotTrack.classList.remove('mv-no-transition');

    const THRESHOLD = 120;
    if (Math.abs(this._edgeOverscroll) > THRESHOLD) {
      const isNext = this.opts.direction === 'rtl'
        ? (this._edgeOverscroll > 0) : (this._edgeOverscroll < 0);
      if (isNext) this._goNext(true); else this._goPrev(true);
    } else {
      this._updateTrackPosition(true);
    }
    this._edgeOverscroll = 0;
  }

  // ─── Drag (page swipe) ───
  _startDrag(x) {
    this._isDragging = true;
    this._startX = x;
    this._currentX = x;
    this._offsetX = 0;
    this._dragStartTime = Date.now();
    this._slotTrack.classList.add('mv-no-transition');
  }

  _moveDrag(x) {
    this._currentX = x;
    const diff = this._currentX - this._startX;
    const isFirst = this._currentSlotIndex === 0;
    const isLast = this._currentSlotIndex === this._slots.length - 1;

    if ((isFirst && diff > 0) || (isLast && diff < 0)) {
      this._offsetX = diff * 0.3;
    } else {
      this._offsetX = diff;
    }
    this._updateTrackPosition(false);
  }

  _endDrag() {
    if (!this._isDragging) return;
    this._isDragging = false;
    this._slotTrack.classList.remove('mv-no-transition');

    if (this._currentZoom > 1) {
      this._offsetX = 0;
      this._updateTrackPosition(true);
      return;
    }

    const diff = this._currentX - this._startX;
    const elapsed = Date.now() - this._dragStartTime;
    const threshold = this._containerWidth * 0.15;
    const isQuickSwipe = elapsed < 300 && Math.abs(diff) > 30;

    if (Math.abs(diff) > threshold || isQuickSwipe) {
      if (this.opts.direction === 'rtl') {
        if (diff < 0 && this._currentSlotIndex > 0) this._currentSlotIndex--;
        else if (diff > 0 && this._currentSlotIndex < this._slots.length - 1) this._currentSlotIndex++;
      } else {
        if (diff < 0 && this._currentSlotIndex < this._slots.length - 1) this._currentSlotIndex++;
        else if (diff > 0 && this._currentSlotIndex > 0) this._currentSlotIndex--;
      }
    }

    this._offsetX = 0;
    this._updateTrackPosition(true);
    this._updateUI();
  }

  // ─── Tap handlers ───
  _onTapLeft(e) {
    e.stopPropagation();
    if (this._momentumID) { this._stopMomentum(); return; }

    const now = Date.now();
    const timeDiff = now - this._lastTapTime;
    this._lastTapTime = now;

    if (this._currentZoom > 1) {
      if (timeDiff < DOUBLE_TAP_DELAY) this.resetZoom();
      return;
    }

    if (timeDiff < DOUBLE_TAP_DELAY && this.opts.viewMode !== 'scroll') {
      if (this._pendingTapAction) clearTimeout(this._pendingTapAction);
      this._zoomAtPoint(2, e.clientX || window.innerWidth * 0.15, e.clientY || window.innerHeight / 2);
      return;
    }

    if (this._pendingTapAction) clearTimeout(this._pendingTapAction);
    this._pendingTapAction = setTimeout(() => {
      if (this.opts.direction === 'rtl') {
        if (this._currentSlotIndex < this._slots.length - 1) { this._currentSlotIndex++; this._updateTrackPosition(true); this._updateUI(); }
      } else {
        if (this._currentSlotIndex > 0) { this._currentSlotIndex--; this._updateTrackPosition(true); this._updateUI(); }
      }
    }, DOUBLE_TAP_DELAY);
  }

  _onTapCenter(e) {
    e.stopPropagation();
    if (this._momentumID) { this._stopMomentum(); return; }

    const now = Date.now();
    const timeDiff = now - this._lastTapTime;
    this._lastTapTime = now;

    if (timeDiff < DOUBLE_TAP_DELAY && this.opts.viewMode !== 'scroll') {
      if (this._pendingTapAction) clearTimeout(this._pendingTapAction);
      if (this._currentZoom > 1) this.resetZoom();
      else this._zoomAtPoint(2, e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2);
      return;
    }

    if (this._pendingTapAction) clearTimeout(this._pendingTapAction);
    this._pendingTapAction = setTimeout(() => this._toggleUI(), DOUBLE_TAP_DELAY);
  }

  _onTapRight(e) {
    e.stopPropagation();
    if (this._momentumID) { this._stopMomentum(); return; }

    const now = Date.now();
    const timeDiff = now - this._lastTapTime;
    this._lastTapTime = now;

    if (this._currentZoom > 1) {
      if (timeDiff < DOUBLE_TAP_DELAY) this.resetZoom();
      return;
    }

    if (timeDiff < DOUBLE_TAP_DELAY && this.opts.viewMode !== 'scroll') {
      if (this._pendingTapAction) clearTimeout(this._pendingTapAction);
      this._zoomAtPoint(2, e.clientX || window.innerWidth * 0.85, e.clientY || window.innerHeight / 2);
      return;
    }

    if (this._pendingTapAction) clearTimeout(this._pendingTapAction);
    this._pendingTapAction = setTimeout(() => {
      if (this.opts.direction === 'rtl') {
        if (this._currentSlotIndex > 0) { this._currentSlotIndex--; this._updateTrackPosition(true); this._updateUI(); }
      } else {
        if (this._currentSlotIndex < this._slots.length - 1) { this._currentSlotIndex++; this._updateTrackPosition(true); this._updateUI(); }
      }
    }, DOUBLE_TAP_DELAY);
  }

  // ─── Keyboard ───
  _onKeyDown(e) {
    const t = e.target;
    const tag = (t && t.tagName || '').toUpperCase();
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable)) return;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        this.opts.direction === 'rtl' ? this._goNext(true) : this._goPrev(true);
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.opts.direction === 'rtl' ? this._goPrev(true) : this._goNext(true);
        break;
      case ' ':
      case 'ArrowDown':
      case 'PageDown':
        e.preventDefault(); this._goNext(true); break;
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault(); this._goPrev(true); break;
      case 'Home':
        e.preventDefault(); this.goToSlot(0); break;
      case 'End':
        e.preventDefault(); this.goToSlot(this._slots.length - 1); break;
      case 'Escape':
        if (this._currentZoom > 1) this.resetZoom();
        break;
    }
  }

  _onWheel(e) {
    if (this.opts.viewMode === 'scroll') return;
    if (e.ctrlKey) return;
    const dx = e.deltaX || 0;
    const dy = e.deltaY || 0;
    const primary = Math.abs(dx) > Math.abs(dy) ? dx : dy;
    if (Math.abs(primary) < 8) return;
    e.preventDefault();
    const now = Date.now();
    if (now < this._wheelCooldownUntil) return;
    this._wheelCooldownUntil = now + 160;
    if (primary > 0) this._goNext(true); else this._goPrev(true);
  }

  _onSliderInput(e) {
    this.goToPage(parseInt(e.target.value));
  }

  _onScroll() {
    if (this.opts.viewMode !== 'scroll') return;
    const slots = this._slotTrack.querySelectorAll('.mv-page-slot');
    const vh = this._main.clientHeight;
    const cr = this._main.getBoundingClientRect();
    slots.forEach((el, idx) => {
      const r = el.getBoundingClientRect();
      const rt = r.top - cr.top;
      if (rt <= vh / 2 && rt + r.height >= vh / 2) {
        if (this._currentSlotIndex !== idx) {
          this._currentSlotIndex = idx;
          this._updateUI();
        }
      }
    });
  }

  // ─── Navigation ───
  _goNext(animate = true) {
    if (this._currentZoom > 1) this._resetZoomOnPageChange();
    if (this._currentSlotIndex < this._slots.length - 1) {
      this._currentSlotIndex++;
      this._updateTrackPosition(animate);
      this._updateUI();
    } else {
      this._updateTrackPosition(true);
    }
  }

  _goPrev(animate = true) {
    if (this._currentZoom > 1) this._resetZoomOnPageChange();
    if (this._currentSlotIndex > 0) {
      this._currentSlotIndex--;
      this._updateTrackPosition(animate);
      this._updateUI();
    } else {
      this._updateTrackPosition(true);
    }
  }

  goToSlot(idx) {
    if (idx >= 0 && idx < this._slots.length) {
      this._resetZoomOnPageChange();
      this._currentSlotIndex = idx;
      if (this.opts.viewMode === 'scroll') {
        const els = this._slotTrack.querySelectorAll('.mv-page-slot');
        if (els[idx]) els[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        this._updateTrackPosition(true);
      }
      this._updateUI();
    }
  }

  /**
   * Go to a specific page number (1-indexed).
   */
  goToPage(pageNum) {
    this.goToSlot(this._findSlotByPageIndex(pageNum - 1));
  }

  // ─── Track position ───
  _updateTrackPosition(animate) {
    if (this.opts.viewMode === 'scroll') return;
    if (animate) this._slotTrack.classList.remove('mv-no-transition');
    else this._slotTrack.classList.add('mv-no-transition');

    let displayIndex = this.opts.direction === 'rtl'
      ? this._slots.length - 1 - this._currentSlotIndex
      : this._currentSlotIndex;
    const baseOffset = -displayIndex * this._containerWidth;
    this._slotTrack.style.setProperty('--mv-track-transform', `translateX(${baseOffset + this._offsetX}px)`);
  }

  // ─── UI Update ───
  _updateUI() {
    const slot = this._slots[this._currentSlotIndex];
    if (!slot) return;

    const first = slot.pages[0] + 1;
    const last = slot.pages[slot.pages.length - 1] + 1;
    const pageText = (slot.spread && slot.pages.length > 1) ? `${first}-${last}` : `${first}`;
    this._currentPageEl.textContent = `${pageText} / ${this._totalPages}`;

    const progress = this._slots.length <= 1 ? 100 : Math.round((this._currentSlotIndex / (this._slots.length - 1)) * 100);
    this._progressEl.textContent = `${progress}%`;

    const sliderVal = this._slots.length <= 1
      ? this._totalPages
      : 1 + Math.round((this._currentSlotIndex / (this._slots.length - 1)) * (this._totalPages - 1));
    this._slider.value = sliderVal;

    this._saveProgress();
    this._preloadNearby();

    // Purchase page check
    if (this._hasPreviewLimit && this._currentSlotIndex === this._slots.length - 1) {
      this._showPurchasePopup();
    } else {
      this._closePurchasePopup();
    }

    // Bookmark state
    this._updateBookmarkBtn();

    // a11y page announcement
    this._announcePage(first);

    // Callbacks
    if (typeof this.opts.onPageChange === 'function') {
      this.opts.onPageChange(first, this._totalPages);
    }
    if (typeof this.opts.onComplete === 'function' && this._currentSlotIndex === this._slots.length - 1) {
      this.opts.onComplete();
    }
  }

  // ─── UI Toggle ───
  _toggleUI() {
    this._uiVisible = !this._uiVisible;
    this._header.classList.toggle('mv-ui-hidden', !this._uiVisible);
    this._footer.classList.toggle('mv-ui-hidden', !this._uiVisible);
    if (this.opts.viewMode !== 'scroll' && !this._isMobile) {
      this._zoomControls.classList.toggle('mv-ui-hidden', !this._uiVisible);
    }
    this._statusBarCover.classList.toggle('mv-visible', !this._uiVisible);
  }

  // ─── Zoom ───
  _getCurrentZoomContainer() {
    return this._slotTrack.querySelector(`.mv-zoom-container[data-zoom-slot="${this._currentSlotIndex}"]`);
  }

  _setZoom(newZoom) {
    this._currentZoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, newZoom));
    const container = this._getCurrentZoomContainer();
    if (container) {
      if (this._currentZoom > 1) container.classList.add('mv-zoomed');
      else { container.classList.remove('mv-zoomed'); this._zoomPanX = 0; this._zoomPanY = 0; }
      this._updateZoomTransform(container);
    }
    this._updateZoomButtons();
  }

  _zoomAtPoint(targetZoom, px, py) {
    const container = this._getCurrentZoomContainer();
    if (!container) return;
    container.classList.remove('mv-no-transition');
    const cx = px - window.innerWidth / 2;
    const cy = py - window.innerHeight / 2;
    const ratio = targetZoom / (this._currentZoom || 1);
    this._zoomPanX = cx - (cx - this._zoomPanX) * ratio;
    this._zoomPanY = cy - (cy - this._zoomPanY) * ratio;
    this._setZoom(targetZoom);
  }

  _updateZoomTransform(container) {
    if (!container) container = this._getCurrentZoomContainer();
    if (!container) return;
    container.style.setProperty('--mv-zoom-transform', `scale(${this._currentZoom}) translate(${this._zoomPanX / this._currentZoom}px, ${this._zoomPanY / this._currentZoom}px)`);
  }

  _updateZoomPan(newX, newY, allowRubberBand = true) {
    const container = this._getCurrentZoomContainer();
    if (!container) return { overscroll: 0, overscrollY: 0 };

    const images = container.querySelectorAll('img');
    let scaledWidth = 0, scaledHeight = 0;
    if (images.length > 0) {
      images.forEach(img => { const r = img.getBoundingClientRect(); scaledWidth += r.width; scaledHeight = Math.max(scaledHeight, r.height); });
    } else {
      const r = container.getBoundingClientRect(); scaledWidth = r.width; scaledHeight = r.height;
    }

    const sw = window.innerWidth, sh = window.innerHeight;
    const hMargin = sw * 0.08;
    const vMargin = sh / 2;
    const maxPanX = Math.max(0, (scaledWidth - sw) / 2 + hMargin);
    const maxPanY = Math.max(0, (scaledHeight - sh) / 2 + vMargin);

    const rubberBand = 0.15;
    let overscroll = 0, overscrollY = 0;

    // X
    if (newX > maxPanX) {
      overscroll = newX - maxPanX;
      this._zoomPanX = allowRubberBand ? maxPanX + overscroll * rubberBand : maxPanX;
    } else if (newX < -maxPanX) {
      overscroll = newX + maxPanX;
      this._zoomPanX = allowRubberBand ? -maxPanX + overscroll * rubberBand : -maxPanX;
    } else {
      this._zoomPanX = newX; overscroll = 0;
    }

    // Y
    if (newY > maxPanY) {
      overscrollY = newY - maxPanY;
      this._zoomPanY = allowRubberBand ? maxPanY + overscrollY * rubberBand : maxPanY;
    } else if (newY < -maxPanY) {
      overscrollY = newY + maxPanY;
      this._zoomPanY = allowRubberBand ? -maxPanY + overscrollY * rubberBand : -maxPanY;
    } else {
      this._zoomPanY = newY; overscrollY = 0;
    }

    this._isOverscrolling = (overscroll !== 0 || overscrollY !== 0);
    this._updateZoomTransform(container);
    return { overscroll, overscrollY };
  }

  zoomIn() {
    if (this._currentZoom >= ZOOM_MAX) return;
    this._setZoom(this._currentZoom + ZOOM_STEP);
  }

  resetZoom() {
    this._zoomPanX = 0;
    this._zoomPanY = 0;
    this._isOverscrolling = false;
    this._setZoom(1);
    this._stopMomentum();
  }

  _updateZoomButtons() {
    if (this._zoomInBtn) this._zoomInBtn.disabled = this._currentZoom >= ZOOM_MAX;
    if (this._zoomResetBtn) this._zoomResetBtn.disabled = this._currentZoom <= ZOOM_MIN;
  }

  _resetZoomOnPageChange() {
    if (this._currentZoom > 1) {
      const container = this._getCurrentZoomContainer();
      if (container) {
        container.classList.remove('mv-zoomed');
        container.style.removeProperty('--mv-zoom-transform');
      }
      this._currentZoom = 1;
      this._zoomPanX = 0;
      this._zoomPanY = 0;
      this._isOverscrolling = false;
      this._updateZoomButtons();
      this._stopMomentum();
    }
  }

  // ─── Momentum / Inertia ───
  _stopMomentum() {
    if (this._momentumID) { cancelAnimationFrame(this._momentumID); this._momentumID = null; }
    if (this._bounceAnimationID) { cancelAnimationFrame(this._bounceAnimationID); this._bounceAnimationID = null; }
    this._velocityX = 0;
    this._velocityY = 0;
    this._bounceVelocityX = 0;
    this._bounceVelocityY = 0;
  }

  _calculateAverageVelocity() {
    if (this._velocityHistory.length === 0) { this._velocityX = 0; this._velocityY = 0; return; }
    const now = Date.now();
    const recent = this._velocityHistory.filter(v => now - v.time < 100);
    if (recent.length === 0) { this._velocityX = 0; this._velocityY = 0; return; }

    let svx = 0, svy = 0, ws = 0;
    recent.forEach((v, i) => {
      const w = Math.pow(2, i);
      svx += v.vx * w; svy += v.vy * w; ws += w;
    });
    this._velocityX = svx / ws;
    this._velocityY = svy / ws;
    const speed = Math.sqrt(this._velocityX ** 2 + this._velocityY ** 2);
    if (speed > 2) { this._velocityX *= 1.2; this._velocityY *= 1.2; }
  }

  _initMomentum() {
    if (this._bounceAnimationID) { cancelAnimationFrame(this._bounceAnimationID); this._bounceAnimationID = null; this._bounceVelocityX = 0; this._bounceVelocityY = 0; }
    this._calculateAverageVelocity();
    const speed = Math.sqrt(this._velocityX ** 2 + this._velocityY ** 2);

    if (this._isOverscrolling) { this._bounceBack(this._velocityX, this._velocityY); return; }
    if (speed < 1) {
      const c = this._getCurrentZoomContainer();
      if (c) c.classList.remove('mv-no-transition');
      return;
    }

    this._momentumStartTime = performance.now();
    this._momentumInitialVelocityX = this._velocityX;
    this._momentumInitialVelocityY = this._velocityY;
    this._momentumID = requestAnimationFrame(() => this._runMomentum());
  }

  _runMomentum() {
    const elapsed = performance.now() - this._momentumStartTime;
    const tau = 325;
    const decay = Math.exp(-elapsed / tau);
    this._velocityX = this._momentumInitialVelocityX * decay;
    this._velocityY = this._momentumInitialVelocityY * decay;

    const speed = Math.sqrt(this._velocityX ** 2 + this._velocityY ** 2);
    if (speed < 0.5) {
      if (this._isOverscrolling) this._bounceBack(this._velocityX, this._velocityY);
      else { const c = this._getCurrentZoomContainer(); if (c) c.classList.remove('mv-no-transition'); }
      this._momentumID = null;
      return;
    }

    const nextX = this._zoomPanX + this._velocityX;
    const nextY = this._zoomPanY + this._velocityY;
    const res = this._updateZoomPan(nextX, nextY, true);
    if (res.overscroll !== 0 || res.overscrollY !== 0) {
      this._bounceBack(this._velocityX, this._velocityY);
      this._momentumID = null;
      return;
    }
    this._momentumID = requestAnimationFrame(() => this._runMomentum());
  }

  _bounceBack(ivx = 0, ivy = 0) {
    if (this._momentumID) { cancelAnimationFrame(this._momentumID); this._momentumID = null; }
    const container = this._getCurrentZoomContainer();
    if (!container) return;

    const images = container.querySelectorAll('img');
    let sw2 = 0, sh2 = 0;
    if (images.length > 0) images.forEach(img => { const r = img.getBoundingClientRect(); sw2 += r.width; sh2 = Math.max(sh2, r.height); });
    else { const r = container.getBoundingClientRect(); sw2 = r.width; sh2 = r.height; }

    const screenW = window.innerWidth, screenH = window.innerHeight;
    const maxPX = Math.max(0, (sw2 - screenW) / 2 + screenW * 0.08);
    const maxPY = Math.max(0, (sh2 - screenH) / 2 + screenH / 2);

    if (ivx !== 0 || ivy !== 0) {
      this._bounceVelocityX = ivx * 0.15;
      this._bounceVelocityY = ivy * 0.15;
    }

    const targetX = Math.max(-maxPX, Math.min(maxPX, this._zoomPanX));
    const targetY = Math.max(-maxPY, Math.min(maxPY, this._zoomPanY));
    const dx = targetX - this._zoomPanX;
    const dy = targetY - this._zoomPanY;

    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && Math.abs(this._bounceVelocityX) < 0.5 && Math.abs(this._bounceVelocityY) < 0.5) {
      this._zoomPanX = targetX; this._zoomPanY = targetY;
      this._bounceVelocityX = 0; this._bounceVelocityY = 0;
      this._updateZoomTransform(container);
      container.classList.remove('mv-no-transition');
      this._isOverscrolling = false;
      this._bounceAnimationID = null;
      return;
    }

    const springK = 0.12, damping = 0.8;
    this._bounceVelocityX = this._bounceVelocityX * damping + dx * springK;
    this._bounceVelocityY = this._bounceVelocityY * damping + dy * springK;
    this._zoomPanX += this._bounceVelocityX;
    this._zoomPanY += this._bounceVelocityY;
    this._updateZoomTransform(container);
    this._bounceAnimationID = requestAnimationFrame(() => this._bounceBack(0, 0));
  }

  // ─── Pinch helpers ───
  _pinchDist(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
  _pinchCenter(touches) {
    return { x: (touches[0].clientX + touches[1].clientX) / 2, y: (touches[0].clientY + touches[1].clientY) / 2 };
  }

  // ─── Page index helpers ───
  _getCurrentPageIndex() {
    const slot = this._slots[this._currentSlotIndex];
    return slot ? slot.pages[0] : 0;
  }

  _findSlotByPageIndex(pageIdx) {
    for (let i = 0; i < this._slots.length; i++) {
      if (this._slots[i].pages.includes(pageIdx)) return i;
    }
    return 0;
  }

  // ─── Progress ───
  _saveProgress() {
    const pageIndex = this._getCurrentPageIndex();
    try {
      localStorage.setItem(this.opts.storageKey, JSON.stringify({
        slotIndex: this._currentSlotIndex,
        pageIndex,
        timestamp: Date.now(),
      }));
    } catch (_) { /* quota exceeded etc */ }
  }

  _loadProgress() {
    try {
      const s = localStorage.getItem(this.opts.storageKey);
      if (s) {
        const d = JSON.parse(s);
        if (Date.now() - d.timestamp < PROGRESS_MAX_AGE_MS) return d;
      }
    } catch (_) { /* ignore */ }
    return null;
  }

  // ─── Resume Dialog ───
  _showResumeDialog(saved) {
    const pageNum = saved.pageIndex + 1;
    const overlay = el('div', { className: 'mv-resume-dialog' });
    const card = el('div', { className: 'mv-resume-card' });

    const icon = el('div', { className: 'mv-resume-icon' }, _svgIcon('<svg viewBox="0 0 384 512" width="28" height="28" fill="#fff"><path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4 13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"/></svg>'));
    card.appendChild(icon);
    card.appendChild(el('div', { className: 'mv-resume-title' }, this._msg.resumeTitle));
    card.appendChild(el('div', { className: 'mv-resume-subtitle' }, this._msg.resumeSubtitle(pageNum)));

    const btns = el('div', { className: 'mv-resume-buttons' });
    btns.appendChild(el('button', { className: 'mv-resume-btn mv-secondary', onClick: () => { overlay.remove(); try { localStorage.removeItem(this.opts.storageKey); } catch (_) {} } }, this._msg.resumeStart));
    const resumeBtn = el('button', {
      className: 'mv-resume-btn mv-primary',
      onClick: () => { overlay.remove(); this._setManagedTimeout(() => this.goToSlot(this._findSlotByPageIndex(saved.pageIndex)), RESUME_NAVIGATE_DELAY_MS); },
    });
    const resumeIcon = _svgIcon(ICONS.play);
    const resumeText = document.createElement('span');
    resumeText.textContent = this._msg.resumeContinue;
    resumeBtn.appendChild(resumeIcon);
    resumeBtn.appendChild(resumeText);
    btns.appendChild(resumeBtn);

    card.appendChild(btns);
    overlay.appendChild(card);
    this._root.appendChild(overlay);
  }

  // ─── Fullscreen ───
  _toggleFullscreen() {
    const viewer = this._container;
    const isReal = !!(document.fullscreenElement || document.webkitFullscreenElement);
    const isPseudo = viewer.classList.contains('mv-pseudo-fullscreen');

    const enterPseudo = () => { viewer.classList.add('mv-pseudo-fullscreen'); this._setPseudoFullscreenBodyLock(true); };
    const exitPseudo = () => { viewer.classList.remove('mv-pseudo-fullscreen'); this._setPseudoFullscreenBodyLock(false); };

    if (isReal || isPseudo) {
      if (isReal) try { (document.exitFullscreen || document.webkitExitFullscreen).call(document); } catch (_) {}
      if (isPseudo) exitPseudo();
      this._updateFullscreenIcon();
      return;
    }

    const req = viewer.requestFullscreen || viewer.webkitRequestFullscreen;
    if (req) {
      try {
        const ret = req.call(viewer);
        if (ret && typeof ret.catch === 'function') ret.catch(() => enterPseudo());
      } catch (_) { enterPseudo(); }
    } else {
      enterPseudo();
    }
    this._updateFullscreenIcon();
  }

  _setPseudoFullscreenBodyLock(locked) {
    // Note: This modifies host document body for pseudo-fullscreen. May affect other components.
    const doc = this._host?.ownerDocument || document;
    const body = doc.body;
    if (!body) return;
    if (locked) {
      if (!this._pseudoFullscreenBodyStyle || !this._pseudoFullscreenBodyStyle.isConnected) {
        const st = doc.createElement('style');
        st.textContent = 'body.mv-pseudo-fullscreen-body { overflow: hidden; }';
        (doc.head || doc.documentElement).appendChild(st);
        this._pseudoFullscreenBodyStyle = st;
      }
      body.classList.add('mv-pseudo-fullscreen-body');
      return;
    }
    body.classList.remove('mv-pseudo-fullscreen-body');
    if (this._pseudoFullscreenBodyStyle) {
      this._pseudoFullscreenBodyStyle.remove();
      this._pseudoFullscreenBodyStyle = null;
    }
  }

  _updateFullscreenIcon() {
    const on = !!(document.fullscreenElement || document.webkitFullscreenElement) || this._container.classList.contains('mv-pseudo-fullscreen');
    if (this._fullscreenBtn) this._fullscreenBtn.replaceChildren(_svgIcon(on ? ICONS.compress : ICONS.expand));
  }

  // ─── Share / Copy ───
  _shareToX() {
    const text = this.opts.title ? `Reading "${this.opts.title}"` : '';
    const url = this.opts.shareUrl || window.location.href;
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'width=550,height=420');
  }

  _copyLink() {
    const url = this.opts.shareUrl || window.location.href;
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(url).then(() => this._showToast('Link copied!')).catch(() => this._showToast('Failed to copy link'));
      return;
    }
    this._copyLinkFallback(url);
  }

  _copyLinkFallback(url) {
    const ta = document.createElement('textarea');
    ta.value = url;
    this.shadowRoot.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    this._showToast(this._msg.linkCopied);
  }

  // ─── Toast ───
  _showToast(message) {
    const existing = this._root.querySelector('.mv-toast');
    if (existing) existing.remove();
    const toast = el('div', { className: 'mv-toast' });
    toast.appendChild(_svgIcon(ICONS.check));
    toast.appendChild(document.createTextNode(` ${message}`));
    this._root.appendChild(toast);
    this._setManagedTimeout(() => {
      toast.classList.add('mv-fade-out');
      this._setManagedTimeout(() => toast.remove(), TOAST_FADE_MS);
    }, TOAST_VISIBLE_MS);
  }

  // ─── Help ───
  _showHelp() {
    const m = this._msg;
    const isRtl = this.opts.direction === 'rtl';
    const mode = this.opts.viewMode === 'scroll' ? m.helpModeScroll : m.helpModePage;
    const dirLabel = isRtl ? m.helpDirRtl : m.helpDirLtr;
    const isMob = this._isMobile;
    const isPage = this.opts.viewMode !== 'scroll';

    const makeHelpItem = (icon, label, desc) => {
      const item = el('div', { className: 'mv-help-item' });
      item.appendChild(el('div', { className: 'mv-help-item-icon' }, icon));
      const text = el('div', { className: 'mv-help-item-text' });
      text.appendChild(el('div', { className: 'mv-help-item-label' }, label));
      text.appendChild(el('div', { className: 'mv-help-item-desc' }, desc));
      item.appendChild(text);
      return item;
    };

    const controls = [];
    if (!isPage) {
      const action = isMob ? m.helpScrollMobile : m.helpScrollDesktop;
      controls.push(makeHelpItem('↕', action, m.helpScrollAction(action)));
    } else if (isMob) {
      controls.push(
        makeHelpItem('👆', m.helpTapLabel, m.helpTapDesc(isRtl ? m.helpDirNext : m.helpDirPrev, isRtl ? m.helpDirPrev : m.helpDirNext)),
        makeHelpItem('👋', m.helpSwipeLabel, m.helpSwipeDesc),
        makeHelpItem('🔍', m.helpPinchLabel, m.helpPinchDesc),
      );
    } else {
      controls.push(
        makeHelpItem('🖱', m.helpClickLabel, m.helpClickDesc(isRtl ? m.helpDirNext : m.helpDirPrev, isRtl ? m.helpDirPrev : m.helpDirNext)),
        makeHelpItem('⌨', m.helpKeyboardLabel, m.helpKeyboardDesc),
        makeHelpItem('🔍', m.helpZoomLabel, m.helpZoomDesc),
      );
    }

    const overlay = el('div', { className: 'mv-help-overlay', role: 'dialog', 'aria-modal': 'true' });
    overlay.addEventListener('click', () => overlay.remove());

    const card = el('div', { className: 'mv-help-card' });
    card.addEventListener('click', (e) => e.stopPropagation());

    const header = el('div', { className: 'mv-help-header' });
    const title = el('div', { className: 'mv-help-title' });
    title.appendChild(_svgIcon(ICONS.questionCircle));
    title.appendChild(document.createTextNode(m.helpTitle));
    const closeBtn = el('button', { className: 'mv-help-close', type: 'button', 'aria-label': m.helpClose }, _svgIcon(ICONS.times));
    closeBtn.addEventListener('click', () => overlay.remove());
    header.appendChild(title);
    header.appendChild(closeBtn);

    const content = el('div', { className: 'mv-help-content' });
    const settingsSection = el('div', { className: 'mv-help-section' });
    settingsSection.appendChild(el('div', { className: 'mv-help-section-title' }, m.helpSettings));
    settingsSection.appendChild(makeHelpItem('📖', mode, isPage ? m.helpDirection(dirLabel) : ''));

    const controlsSection = el('div', { className: 'mv-help-section' });
    controlsSection.appendChild(el('div', { className: 'mv-help-section-title' }, m.helpControls));
    controls.forEach((item) => controlsSection.appendChild(item));

    content.appendChild(settingsSection);
    content.appendChild(controlsSection);
    card.appendChild(header);
    card.appendChild(content);
    overlay.appendChild(card);
    this._root.appendChild(overlay);
  }

  // ─── Purchase Popup ───
  _showPurchasePopup() {
    if (this._root.querySelector('.mv-purchase-popup')) return;
    const o = this.opts;
    let purchaseUrl = o.purchaseUrl || '';
    if (!/^https?:\/\//.test(purchaseUrl)) purchaseUrl = '#';
    const popup = el('div', { className: 'mv-purchase-popup' });
    const card = el('div', { className: 'mv-purchase-card' });
    card.appendChild(
      el('div', { className: 'mv-purchase-icon' }, _svgIcon('<svg width="36" height="36" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>'))
    );
    card.appendChild(el('div', { className: 'mv-purchase-title' }, this._msg.purchaseTitle));
    card.appendChild(el('p', { className: 'mv-purchase-desc' }, this._msg.purchaseTotal(this._totalOriginalPages, o.previewLimit)));
    card.appendChild(el('p', { className: 'mv-purchase-desc' }, this._msg.purchaseCta));
    if (o.purchaseUrl) {
      const purchaseBtn = el('a', { href: purchaseUrl, className: 'mv-purchase-btn' }, this._msg.purchaseBtn);
      if (o.purchasePrice) purchaseBtn.appendChild(document.createTextNode(` ${o.purchasePrice}`));
      card.appendChild(purchaseBtn);
    }
    if (o.backUrl) card.appendChild(el('a', { href: o.backUrl, className: 'mv-purchase-back' }, this._msg.purchaseBack));
    popup.appendChild(card);
    this._root.appendChild(popup);
  }

  _closePurchasePopup() {
    const p = this._root.querySelector('.mv-purchase-popup');
    if (p) p.remove();
  }

  // ─── Bookmarks ───
  async _initBookmarks() {
    this._bookmarkMgr = new BookmarkManager({
      bookmarkApi: this.opts.bookmarkApi,
      bookmarkHeaders: this.opts.bookmarkHeaders,
      bookmarkId: this.opts.bookmarkId,
      onBookmarkChange: this.opts.onBookmarkChange,
      messages: this._msg,
      signal: this.abortSignal,
    });
    await this._bookmarkMgr.load();
    this._buildBookmarkPanel();
    this._updateBookmarkBtn();
  }

  _buildBookmarkPanel() {
    this._bookmarkPanel = el('div', { className: 'mv-bookmark-panel', role: 'dialog' });
    this._bookmarkOverlay = el('div', { className: 'mv-bookmark-overlay', onClick: () => this._toggleBookmarkPanel() });

    // Header
    const header = el('div', { className: 'mv-bookmark-panel-header' });
    header.appendChild(el('span', { className: 'mv-bookmark-panel-title' }, this._msg.bookmarkPanelTitle));
    header.appendChild(el('button', { className: 'mv-bookmark-panel-close', onClick: () => this._toggleBookmarkPanel(), 'aria-label': this._msg.helpClose }, _svgIcon(ICONS.times)));
    this._bookmarkPanel.appendChild(header);

    // Add/remove button for current page
    this._bookmarkToggleBtn = el('button', { className: 'mv-bookmark-toggle-btn', onClick: () => this._toggleCurrentPageBookmark() });
    this._bookmarkPanel.appendChild(this._bookmarkToggleBtn);

    // List
    this._bookmarkList = el('div', { className: 'mv-bookmark-list' });
    this._bookmarkPanel.appendChild(this._bookmarkList);

    this._container.appendChild(this._bookmarkOverlay);
    this._container.appendChild(this._bookmarkPanel);
    this._renderBookmarkList();
  }

  _toggleBookmarkPanel() {
    this._bookmarkPanelOpen = !this._bookmarkPanelOpen;
    this._bookmarkPanel.classList.toggle('mv-open', this._bookmarkPanelOpen);
    this._bookmarkOverlay.classList.toggle('mv-open', this._bookmarkPanelOpen);
    if (this._bookmarkPanelOpen) this._renderBookmarkList();
  }

  _renderBookmarkList() {
    if (!this._bookmarkMgr || !this._bookmarkList) return;
    const bms = this._bookmarkMgr.bookmarks;
    const currentPage = this._getCurrentPageIndex() + 1;

    // Update toggle button
    const hasCurrent = this._bookmarkMgr.has(currentPage);
    this._bookmarkToggleBtn.replaceChildren(
      _svgIcon(ICONS.bookmark),
      document.createTextNode(hasCurrent ? this._msg.bookmarkRemove : this._msg.bookmarkAdd),
    );
    this._bookmarkToggleBtn.classList.toggle('mv-bookmark-remove', hasCurrent);

    // List
    this._bookmarkList.innerHTML = '';
    if (bms.length === 0) {
      this._bookmarkList.appendChild(el('div', { className: 'mv-bookmark-empty' }, this._msg.bookmarkEmpty));
      return;
    }
    bms.forEach(bm => {
      const item = el('div', { className: 'mv-bookmark-item' + (bm.page_number === currentPage ? ' mv-active' : ''), onClick: () => {
        this.goToPage(bm.page_number);
        this._toggleBookmarkPanel();
      }});
      const info = el('div', { className: 'mv-bookmark-item-info' });
      info.appendChild(el('span', { className: 'mv-bookmark-item-page' }, this._msg.bookmarkPageLabel(bm.page_number)));
      info.appendChild(el('span', { className: 'mv-bookmark-item-title' }, bm.title || this._msg.bookmarkDefaultTitle(bm.page_number)));
      item.appendChild(info);
      const delBtn = el('button', { className: 'mv-bookmark-item-delete', onClick: (e) => {
        e.stopPropagation();
        this._bookmarkMgr.remove(bm.page_number).then(() => {
          this._renderBookmarkList();
          this._updateBookmarkBtn();
        });
      }}, _svgIcon(ICONS.times));
      item.appendChild(delBtn);
      this._bookmarkList.appendChild(item);
    });
  }

  /**
   * Sanitize an HTML string for use in a `type: 'html'` insert page.
   * - When `opts.htmlSanitizer` is supplied, it is used verbatim (pass DOMPurify.sanitize for stronger guarantees).
   * - Otherwise a whitelist-based pass strips disallowed tags, dangerous attributes, and unsafe URL schemes.
   * @returns {DocumentFragment}
   */
  _sanitizeHtml(html) {
    const template = document.createElement('template');
    const userSanitizer = this.opts.htmlSanitizer;
    if (typeof userSanitizer === 'function') {
      try {
        template.innerHTML = String(userSanitizer(String(html || '')) || '');
      } catch (e) {
        // Sanitizer threw — drop the content rather than risk injection.
        template.innerHTML = '';
      }
      return template.content.cloneNode(true);
    }
    template.innerHTML = String(html || '');
    this._sanitizeNode(template.content);
    return template.content.cloneNode(true);
  }

  _sanitizeNode(root) {
    const toRemove = [];
    const toUnwrap = [];
    // TreeWalker is depth-first; collecting first then mutating keeps iteration sane.
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
    let node = walker.nextNode();
    while (node) {
      const tag = node.tagName ? node.tagName.toLowerCase() : '';
      if (SANITIZE_DISALLOWED_TAGS.has(tag)) {
        toRemove.push(node);
      } else if (!SANITIZE_ALLOWED_TAGS.has(tag)) {
        toUnwrap.push(node);
      } else {
        this._sanitizeAttrs(node, tag);
      }
      node = walker.nextNode();
    }
    for (const n of toRemove) {
      if (n.parentNode) n.parentNode.removeChild(n);
    }
    for (const n of toUnwrap) {
      const parent = n.parentNode;
      if (!parent) continue;
      while (n.firstChild) parent.insertBefore(n.firstChild, n);
      parent.removeChild(n);
    }
  }

  _sanitizeAttrs(node, tag) {
    const tagAllowed = SANITIZE_TAG_ATTRS[tag];
    for (const attr of Array.from(node.attributes)) {
      const name = attr.name.toLowerCase();
      const value = attr.value;
      // Strip event handlers (onclick, onerror, …) regardless of tag.
      if (name.startsWith('on')) { node.removeAttribute(attr.name); continue; }
      // ARIA / data attributes are allowed everywhere.
      if (name.startsWith('aria-') || name.startsWith('data-')) continue;
      if (!SANITIZE_GLOBAL_ATTRS.has(name) && !(tagAllowed && tagAllowed.has(name))) {
        node.removeAttribute(attr.name); continue;
      }
      if (name === 'href' || name === 'src' || name === 'srcset' || name === 'action' || name === 'formaction') {
        // <use href> must be fragment-only — external SVG icons can carry scripts.
        if (tag === 'use' && name === 'href') {
          if (!/^#[\w-]+$/.test(value.trim())) { node.removeAttribute(attr.name); continue; }
        } else if (name === 'srcset') {
          const ok = value.split(',').every(part => SAFE_URL_RE.test(part.trim().split(/\s+/)[0] || ''));
          if (!ok) { node.removeAttribute(attr.name); continue; }
        } else if (!SAFE_URL_RE.test(value.trim())) {
          node.removeAttribute(attr.name); continue;
        }
      }
      if (name === 'style' && DANGEROUS_STYLE_RE.test(value)) {
        node.removeAttribute(attr.name);
      }
    }
    // Force safe rel on links that open new tabs (reverse-tabnabbing protection).
    if (tag === 'a' && node.hasAttribute('target')) {
      node.setAttribute('rel', 'noopener noreferrer');
    }
  }

  async _toggleCurrentPageBookmark() {
    if (!this._bookmarkMgr) return;
    const currentPage = this._getCurrentPageIndex() + 1;
    if (this._bookmarkMgr.has(currentPage)) {
      await this._bookmarkMgr.remove(currentPage);
      this._showToast(this._msg.bookmarkRemoved);
    } else {
      const result = await this._bookmarkMgr.add(currentPage);
      if (result.success) this._showToast(this._msg.bookmarkAdded);
      else this._showToast(result.error || this._msg.bookmarkGenericError);
    }
    this._renderBookmarkList();
    this._updateBookmarkBtn();
  }

  _announcePage(pageNum) {
    if (!this._liveRegion) return;
    // Replace text rather than append so SR re-reads only the latest value.
    this._liveRegion.textContent = this._msg.pageAnnounce(pageNum, this._totalPages);
  }

  _updateBookmarkBtn() {
    if (!this._bookmarkMgr || !this._bookmarkBtn) return;
    const currentPage = this._getCurrentPageIndex() + 1;
    const active = this._bookmarkMgr.has(currentPage);
    this._bookmarkBtn.classList.toggle('mv-bookmark-active', active);
  }

  // ─── Public API ───
  /** Get current page number (1-indexed) */
  get currentPage() { return this._getCurrentPageIndex() + 1; }

  /** Get total page count */
  get totalPages() { return this._totalPages; }

  /** Get bookmark manager */
  get bookmarkManager() { return this._bookmarkMgr; }

  /** Destroy viewer and clean up. Safe to call multiple times. */
  destroy() {
    if (this._destroyed) return;
    this._destroyed = true;

    this._stopMomentum();
    this._setPseudoFullscreenBodyLock(false);

    if (this._resizeRaf !== null) {
      cancelAnimationFrame(this._resizeRaf);
      this._resizeRaf = null;
    }
    if (this._bounceAnimationID !== null) {
      cancelAnimationFrame(this._bounceAnimationID);
      this._bounceAnimationID = null;
    }
    if (this._momentumID !== null) {
      cancelAnimationFrame(this._momentumID);
      this._momentumID = null;
    }
    for (const id of this._rafs) cancelAnimationFrame(id);
    this._rafs.clear();

    if (this._pendingTapAction !== null) {
      clearTimeout(this._pendingTapAction);
      this._pendingTapAction = null;
    }
    if (this._bmTimer !== null) {
      clearTimeout(this._bmTimer);
      this._bmTimer = null;
    }
    for (const id of this._timers) clearTimeout(id);
    this._timers.clear();

    if (this._abortController) {
      try { this._abortController.abort(); } catch (_) {}
      this._abortController = null;
    }

    if (this._bound._list) {
      for (const [target, evt, fn, opts] of this._bound._list) {
        target.removeEventListener(evt, fn, opts);
      }
      this._bound._list.length = 0;
    }
    this._root.replaceChildren();
  }
}
