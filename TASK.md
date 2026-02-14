# Task: Manga Viewer OSS Library

## Goal
Extract the manga viewer from `original-viewer.php` (3546 lines) into a standalone, open-source JavaScript library. Keep ALL features and design intact.

## Source
- `original-viewer.php` in this directory — full manga viewer with PHP + HTML + CSS + JS in one file

## What to Build

### 1. Library Files
- `src/manga-viewer.js` — standalone ES module class `MangaViewer`
- `src/manga-viewer.css` — all styles extracted and cleaned up (remove Tailwind dependency for core styles, but keep the design identical)
- `dist/manga-viewer.min.js` — bundled version (just copy src for now, minification can come later)
- `dist/manga-viewer.min.css`

### 2. API Design
```js
const viewer = new MangaViewer({
  container: '#viewer',           // DOM element or selector
  pages: ['page1.jpg', 'page2.jpg', ...],  // array of image URLs
  direction: 'rtl',              // 'rtl' or 'ltr' (default: 'rtl')
  firstPageSingle: true,         // first page displayed alone in spread mode
  viewMode: 'page',              // 'page' or 'scroll'
  // Optional features
  adsense: { client: '', slot: '' },
  previewLimit: null,            // number of free pages (null = no limit)
  onPageChange: (page, total) => {},
  onComplete: () => {},
  storageKey: 'manga_progress',  // localStorage key for progress
  title: 'Manga Title',
  backUrl: '/',
});
viewer.destroy(); // cleanup
```

### 3. Demo Page
- `demo/index.html` — fully working demo
- Uses ブラックジャックによろしく (Say Hello to Black Jack) vol.1 as sample
  - Credit: 佐藤秀峰 (Shuho Sato), free for secondary use
  - Download pages from: https://mangaonweb.com or use placeholder images for now
  - Put images in `demo/pages/` directory
- Demo should showcase all features: RTL navigation, pinch zoom, spread mode, swipe, keyboard, progress save
- Dark theme matching the original design

### 4. Documentation
- `README.md` — English, professional quality
  - Title: "Manga Viewer" with a good tagline
  - Live demo link (will be tokagemushi.jp/lab later)
  - Feature list with ✅ checkmarks
  - Screenshots/GIF placeholder
  - Installation (CDN, npm, download)
  - Quick Start code example
  - Full API reference
  - Browser support
  - License: MIT
  - Credit: Created by tokagemushi (link to tokagemushi.jp)
- `LICENSE` — MIT license, copyright tokagemushi

### 5. Package
- `package.json` — name: `@tokagemushi/manga-viewer`, version: 0.1.0

## CRITICAL Rules
1. Keep EVERY feature from the original:
   - RTL/LTR reading direction
   - Spread mode (landscape auto-detect)
   - Pinch zoom with inertia + rubber band
   - Swipe with momentum
   - Double-tap zoom
   - Keyboard navigation (arrow keys, space, etc.)
   - Touch and mouse support
   - Reading progress save (localStorage)
   - UI: header, footer, page slider, zoom controls
   - Help overlay
   - Resume dialog
   - Orientation check
   - Preloading nearby pages
   - Insert pages (ads, HTML, images)
   - Purchase page / preview limit
   - AdSense integration
   - Scroll mode
   - Embed mode support
   - Status bar cover (for mobile notch)
   - Page info display
   - Share/link copy
2. Keep the EXACT same design/CSS — dark theme, animations, transitions
3. Remove PHP dependencies — everything configurable via JS options
4. Remove Tailwind dependency for core — use vanilla CSS that matches the Tailwind output
5. No build tools required — plain JS that works in browser
6. The demo page CAN use Tailwind CDN for the surrounding page, but the viewer itself must be standalone

## For demo images
If you can't download the actual manga pages, create a `demo/download-pages.sh` script that uses curl to download them, or create simple placeholder images with page numbers.

Actually, for the demo, just create numbered placeholder pages using HTML canvas or SVG — simple gray pages with "Page 1", "Page 2" etc. The user will add real images later.

## When Done
Run: openclaw system event --text "Done: Manga viewer OSS library extracted. Files in ~/Projects/manga-viewer/" --mode now
