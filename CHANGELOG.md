# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/) and
this project adheres to [Semantic Versioning](https://semver.org/).

## [0.3.0] — 2026-05-07

### Added
- **`htmlSanitizer` option** — supply a custom sanitizer (e.g. `DOMPurify.sanitize`)
  for `type: 'html'` insert pages. Strongly recommended when rendering any
  un-trusted HTML.
- **`messages` option** — full i18n: every UI string (bookmarks, resume dialog,
  help overlay, page announcements) can be overridden. Defaults remain Japanese.
- **`abortSignal` getter** — `AbortSignal` that fires on `destroy()`. Use it to
  cancel your own fetches or event listeners that should die with the viewer.
- **Screen-reader announcements** — page changes are announced via a
  visually-hidden `aria-live="polite"` region.
- **`scripts/build.mjs`** — zero-dependency build that keeps `src/manga-viewer.css`
  as the single source of truth and emits minified `dist/` artifacts. Hooked into
  `prepublishOnly`.

### Changed
- **Default UI language is now Japanese** for resume dialog and help overlay
  (bookmarks were already Japanese). Pass `messages: { resumeTitle: '…', … }` to
  switch to English or another locale.
- **`_sanitizeHtml` rewritten** — now whitelist-based (allowed tags / attributes /
  URL schemes). Strips `iframe`, `object`, `style`, `link`, `meta`, `base`, `form`,
  inputs, event handlers, `javascript:`/`vbscript:`/`data:text/html` URLs, and
  unsafe `style` values. `<a target>` automatically gets `rel="noopener noreferrer"`.
- **`destroy()` now fully cleans up** — cancels every tracked `setTimeout` and
  `requestAnimationFrame`, aborts in-flight bookmark fetches via `AbortController`,
  removes all event listeners. Idempotent (safe to call multiple times).
- **Magic numbers extracted to module-level constants** (`ZOOM_MIN`, `ZOOM_MAX`,
  `DOUBLE_TAP_DELAY`, `TOAST_VISIBLE_MS`, etc.).
- **Bookmark fetch errors no longer disappear silently for AbortError** — other
  failures still fall back to `localStorage`.

### Fixed
- **README documented `bookmarkEnabled` but the implementation accepted `bookmarks`**.
  Documentation now matches the implementation.
- README falsely instructed users to load `manga-viewer.css` via `<link>`.
  Because the viewer mounts in Shadow DOM, those styles cannot reach internal
  elements; the viewer always inlines its own CSS.

### Migration notes
- API surface for `bookmarks: true` is unchanged. If your README was using the
  documented-but-wrong `bookmarkEnabled` key, change it to `bookmarks`.
- If you rely on the previous `_sanitizeHtml` behaviour (script + on-handler
  stripping only), pass an empty sanitizer: `htmlSanitizer: (html) => html`.
  This is **not recommended** for un-trusted input.
- Resume dialog / help overlay strings used to be English. To restore the old
  English UI, pass:
  ```js
  messages: {
    resumeTitle: 'Resume reading?',
    resumeSubtitle: (n) => `Continue from page ${n}`,
    resumeStart: 'Start over',
    resumeContinue: ' Resume',
    helpTitle: ' Help',
    // …see DEFAULT_MESSAGES in src/manga-viewer.js for the full list
  }
  ```

## [0.2.0] — earlier

Initial public release. See git history for details.
