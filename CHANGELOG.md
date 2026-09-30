# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/) and
this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Breaking changes
- **`lastPageAlign` now defaults to `'start'` instead of `'center'`.** An odd
  final page used to float in the middle of a spread, belonging to neither
  half. It now sits on the reading side — right in a right-bound book, left in
  a left-bound one — paired with a blank, which is where a real book leaves it.
  Pass `lastPageAlign: 'center'` to keep the old layout. Beyond looking wrong,
  a centred page cannot be turned with `pageTransition: 'curl'`: with no gutter
  and no bound edge there is nothing to hinge it on, so it falls back to
  sliding.
- **A left-bound book's cover now sits on the right of a two-page view.** It
  used to sit on the left, the spine side, where a real book is never opened
  from — the curl turned the blank beside it instead. It is now at the
  reading-end side in both directions (left when bound on the right, as
  before; right when bound on the left), in slide mode as well.

### Added
- **A released page falls with the weight of paper.** The settle is a damped
  spring rather than a replayed easing: the sheet keeps whatever speed the
  finger gave it, so a flick sends it over hard and a gentle release lets it
  fall away slowly, and it lands with one soft flap (damping just under
  critical).
- **Two shadows under the fold, not one.** A narrow dark contact line where
  the paper almost touches the page, and a broad penumbra that widens as the
  sheet stands further off it. A faint sheen rides the crest of the bend.
- **The corner of the page breathes once when a book opens** (`curlHint`,
  default on), so a first-time reader can see the page turns. It skips itself
  once the reader has turned a page on their own.
- **`pageTransition` option** — `'slide'` (default, the existing behaviour) or
  `'curl'`, a paper-like page turn drawn with WebGL. The sheet bends around a
  cylinder, shades from the surface normal, and casts a shadow on the page
  beneath.
  - **The page is taken wherever the finger lands, and that point stays under
    the finger.** Take a corner and the corner follows the fingertip; take the
    middle of the free edge and that is what follows. The crease runs square to
    the way the hand moves, so a diagonal pull folds the page diagonally (the
    lean is capped, since a sheet held by its spine cannot swing wide). Turning
    back draws the sheet up off the far side the same way, starting from where a
    forward turn ends.
  - **In a spread only the leaf on the free side lifts.** The other half stays
    bound, the crease runs down the gutter, and the sheet's reverse carries the
    matching half of the next spread — so turning a left-hand page reveals the
    next spread's right-hand page on the back of the paper, as in a real book.
  - On a single page the reverse is bare paper with the front showing faintly
    through, because a sheet turning about the screen's own edge takes whatever
    is printed on its back out of view with it.
  - Falls back to `'slide'` per gesture whenever the curl cannot be drawn
    faithfully: no WebGL, a lost context, a zoomed-in page, scroll mode, or a
    slot holding something other than images (ads, the purchase page, custom
    HTML).
- Page transitions are now a replaceable strategy internally, so further
  transitions do not need new branches through the navigation code.

### Fixed
- **Turning a page is steadier under the finger** (`pageTransition: 'curl'`):
  - A touch with no sideways movement in its first step — or one that passes
    back over its starting point — no longer switches the whole gesture to
    sliding.
  - A tap while the last page is still landing no longer carries it back up
    before the view jumps on; a new drag lands it and starts the next turn
    under the finger; a pinch ends the turn instead of freezing it on screen.
  - A drag that begins while the corner hint is playing takes the page where
    the finger is, not where the hint held it.
- **The sheet no longer runs ahead of the finger.** The crease was placed as
  if the held point had already gone round the whole bend, which in a spread
  put it up to 70px ahead early in a drag. It now stays under the finger (and,
  turning back, moves from the first pixel instead of after ~180px). Past the
  spine, a diagonal pull swings the sheet about the corner of the spine rather
  than leaving it behind, and a near-vertical drag no longer flickers between
  a large fold and none.
- **Nothing of the old page is left at the end of a turn.** On a phone's
  single page a sliver stayed along the spine, and a turn run by key or tap
  came to rest still leaning, with a wedge of the old page standing until
  the view snapped over.
- **Turning back by key or tap before any drag** no longer creases along NaN.
- **Turning back no longer swings the whole page at the first touch.** A
  backward drag with the slightest slant in its first pixel used to rotate the
  sheet lying on the far side by up to twice the lean cap; the slant now grows
  in with the pull. A return pulled all the way lands flat instead of snapping
  flat.
- **The reverse of a turning sheet in a left-bound spread** was printed
  mirror-wise.
- **A lost WebGL context no longer switches the curl off for good.** The next
  turn makes a new canvas; the curl gives up only if contexts keep being lost
  (three within a minute).
- **The pages either side of the current one are decoded ahead of time**, so
  the first turn onto a new page does not stall while the browser decodes it.
- **Rubber-banding at the wrong end in RTL.** Dragging forward from the first
  slot of a right-bound book was treated as pulling past the start, so the page
  resisted instead of turning. The edge test now accounts for reading
  direction, matching what the release handler already did.

## [0.6.0] — 2026-05-08

### Breaking changes
- **`hideButtons`, `extraButtons`, `headerOrder` are removed.** A single
  `headerButtons` option replaces all three. Mixed array of standard
  button names (strings) and custom button definitions (objects). Order
  in the array maps 1:1 to display order; names not in the array are
  hidden.

      // v0.5.x
      hideButtons: ['share', 'copy'],
      extraButtons: [{ icon: icons.reload, label: '更新', onClick: ... }],

      // v0.6.0
      headerButtons: [
        'back',
        'bookmark',
        { icon: icons.reload, label: '更新', onClick: ... },
        'help',
      ],

  Pass `headerButtons: null` (default) for the v0.5.x default lineup.
- The `'zoomIn'` / `'zoomReset'` names that previously worked in
  `hideButtons` are gone — the zoom HUD is always shown. (No real-world
  use of hiding it has been reported.)
- The `extraButtons` `slot: 'footer'` option is gone. Custom buttons
  only land in the header now; the footer is reserved for the page
  slider and indicator.

### Why
Three options to express "what buttons appear" was confusing. One mixed
array (string-or-object) is the cleanest mental model: "headerButtons
is exactly what's in the header, in this order".

### Migration
- `hideButtons: [name, ...]` → list every name you DO want in
  `headerButtons` (or omit the option to use the default).
- `extraButtons: [obj, ...]` (header slot) → drop the objects into
  `headerButtons` at whatever position you want.
- `headerOrder` → the same array is `headerButtons` now.

## [0.5.1] — 2026-05-08

### Added
- **`headerOrder` option** — whitelist + ordering for standard header
  buttons. When supplied, only the listed names render and they appear
  in that exact order. Supersedes `hideButtons` for the listed buttons.
  `'back'` always anchors to the left of the header; the rest fill the
  right cluster in array order. `extraButtons` are appended after.
  Pass `null` (default) to keep the v0.4.x behaviour.
  Recognised names: `'back'`, `'bookmark'`, `'fullscreen'`, `'share'`,
  `'copy'`, `'help'`.

## [0.5.0] — 2026-05-08

### Added
- **`onBack` option** — function called when the back button is clicked.
  When supplied, the default navigation to `backUrl` is suppressed and the
  callback runs instead. Drop-in replacement for `() => history.back()`.
- **`lastPageAlign` option** — controls where the last page sits when
  spread mode produces an odd-numbered orphan at the end. Values:
  `'center'` (default — single centered slot, v0.4.x compat),
  `'start'` (reading-start side: RTL→right, LTR→left), or
  `'end'` (reading-end side: RTL→left, LTR→right).
- **PWA-aware footer padding** — when running as an installed PWA
  (`@media (display-mode: standalone)`), the footer slider gets an extra
  16px below to clear the iOS home indicator. Tunable via the
  `--mv-pwa-footer-bonus` CSS variable on the host.

### Fixed
- **SVG sanitizer dropped `viewBox` and other camelCase attributes** —
  `_sanitizeAttrs` lowercases attr names before whitelist lookup, but
  `SANITIZE_TAG_ATTRS` still listed the camelCase originals
  (`viewBox`, `preserveAspectRatio`, `gradientUnits`, …), so the lookup
  silently failed and those attributes were stripped. Without `viewBox`,
  the SVG falls back to its `width`/`height` for the user-space coordinate
  system, which mismatches the path coordinates and clips the rendered
  icon. Affects every `extraButtons[].icon` supplied as a string,
  including `icons.reload` from the library. All keys in
  `SANITIZE_TAG_ATTRS` are now lowercase.
- **SVG icon rendering** — switched the internal `_svgIcon` helper from
  `DOMParser` + `importNode` to a `<template>` parser. The previous
  approach occasionally produced empty / namespace-broken nodes inside
  Shadow DOM on some Safari versions.
- **Header icons re-styled** to Material Design solid set; line-style
  icons looked under-weight at the 16–18px header button size.
- **Auto theme on mobile** — the `:not([class*="mv-theme-"])` selector
  used inside `:host()` proved fragile in some browsers and could drop the
  whole rule, leaving icons white-on-white in mobile auto mode. The cascade
  now uses plain `:host` inside the mobile media query, with explicit
  `:host(.mv-theme-light/dark)` overrides above it.
- **Pop font cascade into Shadow DOM** — moved the default
  `font-family: 'Zen Maru Gothic', 'M PLUS Rounded 1c', …` from
  `.mv-container` to `:host` so help overlays / resume dialogs / toasts
  inherit it instead of falling back to system sans.

### Migration notes
- All v0.4.x configurations continue to work unchanged.
- If you used `backUrl` for in-page navigation control, consider
  switching to `onBack: () => history.back()` for a more natural feel.
- If you noticed last-page centering in spread mode and wanted it
  right-aligned (RTL) or left-aligned (LTR), set
  `lastPageAlign: 'start'` (page sits where the next-page slot would be).

## [0.4.0] — 2026-05-07

### Added
- **`theme` option** — `'auto'` (default, current viewport-based behaviour),
  `'light'`, or `'dark'`. The forced modes apply regardless of viewport size,
  so mobile users can have a black background.
- **`hideButtons` option** — array of standard button names to hide. Names:
  `'back'`, `'bookmark'`, `'fullscreen'`, `'share'`, `'copy'`, `'help'`,
  `'zoomIn'`, `'zoomReset'`. Future-compatible (new buttons appear by default).
- **`extraButtons` option** — inject custom buttons into the header or footer.
  Each entry has `slot` / `position` / `icon` / `label` / `onClick` /
  `className` / `ariaLabel`. Icons accept HTMLElement, DocumentFragment, or
  inline SVG strings (sanitized through a presentation-only SVG whitelist).
- **`footerBottomPadding` option** — extra padding (px) below the slider,
  e.g. to overlay a credit row. Equivalent to setting the
  `--mv-footer-bottom-padding` CSS variable on the host element.
- **`icons` named export** — pre-built SVG strings for common actions:
  `icons.reload` / `icons.refresh` / `icons.download` / `icons.print`.
- **`--mv-*` CSS variables** — every theme color is exposed as a custom
  property (`--mv-bg`, `--mv-fg`, `--mv-header-bg`, `--mv-footer-bg`,
  `--mv-btn-bg`, `--mv-btn-bg-hover`, `--mv-btn-fg`, `--mv-slider-track`,
  `--mv-spinner-track`, `--mv-spinner-fg`, `--mv-accent`, `--mv-shadow`,
  `--mv-text-muted`, `--mv-footer-bottom-padding`). Override on the host
  element to customize without forking.

### Changed
- The legacy `@media (max-width: 768px)` palette overrides have been
  consolidated into the CSS variable system. Visual output for `theme: 'auto'`
  (the default) is unchanged.

### Migration notes
- All v0.3.x configurations continue to work unchanged. The new options have
  defaults that preserve existing behaviour.
- If you previously injected your own CSS to override viewer colors, you can
  now use the `--mv-*` variables instead — they propagate into Shadow DOM
  via the host element.

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
