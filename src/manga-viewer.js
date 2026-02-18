/**
 * Manga Viewer v0.2.0
 * A standalone, feature-rich manga/comic viewer for the web.
 *
 * https://github.com/tokagemushi/manga-viewer
 * (c) tokagemushi — MIT License
 */

// ──────────────────────────────────────────
// SVG icon paths (inline, no FA dependency)
// ──────────────────────────────────────────
const ICONS = {
  chevronLeft:  '<svg viewBox="0 0 320 512" width="14" height="14" fill="currentColor"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>',
  expand:       '<svg viewBox="0 0 448 512" width="14" height="14" fill="currentColor"><path d="M32 32C14.3 32 0 46.3 0 64v96c0 17.7 14.3 32 32 32s32-14.3 32-32V96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H32zM64 416H32c-17.7 0-32-14.3-32-32V288c0-17.7 14.3-32 32-32s32 14.3 32 32v64h64c17.7 0 32 14.3 32 32s-14.3 32-32 32zm320-320c17.7 0 32-14.3 32-32s-14.3-32-32-32H320c-17.7 0-32 14.3-32 32s14.3 32 32 32h64v64c0 17.7 14.3 32 32 32s32-14.3 32-32V64zM384 416h-64c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96z"/></svg>',
  compress:     '<svg viewBox="0 0 448 512" width="14" height="14" fill="currentColor"><path d="M160 64c0-17.7-14.3-32-32-32s-32 14.3-32 32v64H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32V64zM32 384c-17.7 0-32 14.3-32 32s14.3 32 32 32h64v64c0 17.7 14.3 32 32 32s32-14.3 32-32V384c0-17.7-14.3-32-32-32H32zM352 448h-64c-17.7 0-32 14.3-32 32v96c0 17.7 14.3 32 32 32s32-14.3 32-32v-64h64c17.7 0 32-14.3 32-32s-14.3-32-32-32zM288 160c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H352V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v96z"/></svg>',
  xLogo:        '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  link:         '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  question:     '<svg viewBox="0 0 320 512" width="14" height="14" fill="currentColor"><path d="M80 160c0-35.3 28.7-64 64-64h32c35.3 0 64 28.7 64 64v3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1A87.983 87.983 0 0 0 128 313v7c0 17.7 14.3 32 32 32s32-14.3 32-32v-7c0-7.4 3.6-14.3 9.6-18.5l42.2-27.1C274 237.3 272 196.2 272 163.6V160c0-70.7-57.3-128-128-128H112C41.3 32 -16 89.3-16 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"/></svg>',
  bookmark:     '<svg viewBox="0 0 384 512" width="14" height="14" fill="currentColor"><path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4 13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"/></svg>',
  searchPlus:   '<svg viewBox="0 0 512 512" width="18" height="18" fill="currentColor"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM184 296c0 13.3 10.7 24 24 24s24-10.7 24-24V232h64c13.3 0 24-10.7 24-24s-10.7-24-24-24H232V120c0-13.3-10.7-24-24-24s-24 10.7-24 24v64H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h64v64z"/></svg>',
  compressAlt:  '<svg viewBox="0 0 512 512" width="18" height="18" fill="currentColor"><path d="M456 224H312c-13.3 0-24-10.7-24-24V56c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2l40 40L442.3 5.7C454.8-6.8 475.2-6.8 487.7 5.7s12.5 32.8 0 45.3L414.4 124.3l40 40c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8zm0 64c9.7 0 18.5 5.8 22.2 14.8s1.7 19.3-5.2 26.2l-40 40 73.4 73.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L387.6 414.4l-40 40c-6.9 6.9-17.2 8.9-26.2 5.2s-14.8-12.5-14.8-22.2V312c0-13.3 10.7-24 24-24H456zM56 224c-9.7 0-18.5-5.8-22.2-14.8s-1.7-19.3 5.2-26.2l40-40L5.7 69.7C-6.8 57.2-6.8 36.8 5.7 24.3s32.8-12.5 45.3 0l73.4 73.4 40-40c6.9-6.9 17.2-8.9 26.2-5.2s14.8 12.5 14.8 22.2V200c0 13.3-10.7 24-24 24H56zm0 64H200c13.3 0 24 10.7 24 24V456c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-40-40L69.7 506.3C57.2 518.8 36.8 518.8 24.3 506.3s-12.5-32.8 0-45.3l73.4-73.4-40-40c-6.9-6.9-8.9-17.2-5.2-26.2S46.3 288 56 288z"/></svg>',
  check:        '<svg viewBox="0 0 512 512" width="14" height="14" fill="currentColor"><path d="M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>',
  questionCircle:'<svg viewBox="0 0 512 512" width="18" height="18" fill="currentColor"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>',
  times:        '<svg viewBox="0 0 384 512" width="14" height="14" fill="currentColor"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3l105.4 105.3c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256l105.3-105.4z"/></svg>',
  play:         '<svg viewBox="0 0 384 512" width="14" height="14" fill="currentColor"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.8 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>',
};

const MANGA_VIEWER_CSS = String.raw`/**
 * Manga Viewer v0.2.0
 * https://github.com/tokagemushi/manga-viewer
 * (c) tokagemushi — MIT License
 */

/* ===== Reset / Base ===== */
.mv-loading-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #000;
  transition: opacity 0.4s ease, visibility 0.4s ease;
}

@media (max-width: 768px) {
  .mv-loading-screen { background: #fff; }
}

.mv-loading-screen.mv-fade-out {
  opacity: 0;
  visibility: hidden;
}

.mv-loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(250, 204, 21, 0.2);
  border-top-color: #facc15;
  border-radius: 50%;
  animation: mv-spin 0.8s linear infinite;
}

@media (max-width: 768px) {
  .mv-loading-spinner {
    border-color: rgba(100, 100, 100, 0.2);
    border-top-color: #666;
  }
}

.mv-loading-text {
  margin-top: 16px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

@media (max-width: 768px) {
  .mv-loading-text { color: rgba(0, 0, 0, 0.5); }
}

@keyframes mv-spin {
  to { transform: rotate(360deg); }
}

/* ===== Container ===== */
.mv-container {
  position: fixed;
  inset: 0;
  height: 100dvh;
  background: #000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.5;
  color: #fff;
  -webkit-text-size-adjust: 100%;
  box-sizing: border-box;
}

.mv-container *, .mv-container *::before, .mv-container *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

@media (max-width: 768px) {
  .mv-container { background: #fff; }
}

.mv-container.mv-pseudo-fullscreen {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  z-index: 9999;
}

/* ===== Status Bar Cover (mobile notch) ===== */
.mv-status-bar-cover {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: env(safe-area-inset-top, 0px);
  background: #fff;
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
  background: rgba(40, 40, 40, 0.95);
  opacity: 1;
  transition: opacity 0.3s ease;
}

@media (max-width: 768px) {
  .mv-header {
    background: rgba(245, 245, 245, 0.98);
  }
  .mv-header .mv-title { color: #333 !important; }
}

.mv-header.mv-ui-hidden {
  opacity: 0;
  pointer-events: none;
}

.mv-header.mv-hidden {
  display: none !important;
}

.mv-title {
  color: #fff;
  font-weight: bold;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  text-align: center;
  margin: 0 12px;
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
  background: rgba(255, 255, 255, 0.08);
  border: none;
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  text-decoration: none;
}

.mv-header-btn:hover {
  background: rgba(255, 255, 255, 0.15);
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
    background: rgba(0, 0, 0, 0.06);
    color: #333;
  }
  .mv-header-btn:hover { background: rgba(0, 0, 0, 0.1); }
  .mv-header-btn svg { fill: #333; }
  .mv-title { font-size: 13px; }
}

/* ===== Footer ===== */
.mv-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px 12px;
  padding-bottom: max(8px, env(safe-area-inset-bottom));
  z-index: 50;
  background: rgba(40, 40, 40, 0.95);
  opacity: 1;
  transition: opacity 0.3s ease;
}

@media (max-width: 768px) {
  .mv-footer {
    background: rgba(245, 245, 245, 0.98);
    padding: 10px 16px 16px 16px;
    padding-bottom: max(16px, calc(env(safe-area-inset-bottom) + 8px));
  }
  .mv-footer .mv-footer-info,
  .mv-footer span { color: #333 !important; }
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
  color: #fff;
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
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}

@media (max-width: 768px) {
  .mv-page-slider {
    background: rgba(0, 0, 0, 0.15);
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
  background: #000;
}

@media (max-width: 768px) {
  .mv-main { background: #fff; }
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
  background: #000;
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
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  if (doc.querySelector('parsererror')) return document.createDocumentFragment();
  const svg = doc.documentElement;
  if (!svg || svg.nodeName.toLowerCase() !== 'svg') return document.createDocumentFragment();
  svg.querySelectorAll('script').forEach((node) => node.remove());
  [svg, ...svg.querySelectorAll('*')].forEach((node) => {
    for (const attr of Array.from(node.attributes)) {
      if (/^on/i.test(attr.name)) node.removeAttribute(attr.name);
    }
  });
  return document.importNode(svg, true);
}

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
        });
        const data = await res.json();
        if (data.success) this._bookmarks = data.bookmarks || [];
      } catch (_) {
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
      return { success: false, error: `しおりは${this._maxBookmarks}個までです` };
    }
    title = title || `ページ${pageNum}`;

    if (this._api) {
      try {
        const res = await fetch(this._api, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...this._headers },
          body: JSON.stringify({ work_id: this._id, page_number: pageNum, title }),
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
      loadingText: 'Loading...',
      bookmarks: true,
      bookmarkId: '',
      bookmarkApi: null,
      bookmarkHeaders: {},
      onBookmarkChange: null,
    }, options);

    this.opts = o;

    // resolve container
    this._host = typeof o.container === 'string'
      ? document.querySelector(o.container)
      : o.container;
    if (!this._host) throw new Error('MangaViewer: container not found');
    this._host.setAttribute('tabindex', '0');
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
    this._MIN_ZOOM = 1;
    this._MAX_ZOOM = 3;
    this._ZOOM_STEP = 0.5;
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
    this._DOUBLE_TAP_DELAY = 300;
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

    // Bound handlers (for cleanup)
    this._bound = {};

    // Bookmark manager
    this._bookmarkMgr = null;
    this._bookmarkPanelOpen = false;
    this._bmLongPress = false;
    this._bmTimer = null;

    // Build DOM & init
    this._build();
    this._init();
    requestAnimationFrame(() => this._focusHost());
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

    // Status bar cover
    this._statusBarCover = el('div', { className: 'mv-status-bar-cover' });

    // Container
    this._container = el('div', { className: 'mv-container' });

    // Main area
    this._main = el('div', { className: 'mv-main' });
    this._slotTrack = el('div', { className: 'mv-slot-track' });
    this._main.appendChild(this._slotTrack);

    // Tap areas (page mode only)
    this._tapLeft = el('div', { className: 'mv-tap-area mv-left' });
    this._tapCenter = el('div', { className: 'mv-tap-area mv-center' });
    this._tapRight = el('div', { className: 'mv-tap-area mv-right' });
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
    this._zoomControls.appendChild(this._zoomInBtn);
    this._zoomControls.appendChild(this._zoomResetBtn);
    this._container.appendChild(this._zoomControls);

    this._container.appendChild(this._statusBarCover);
    this._root.appendChild(this._container);
  }

  _buildHeader() {
    const o = this.opts;
    const header = el('div', { className: 'mv-header' });

    // Back button
    const backBtn = el('a', { href: o.backUrl, className: 'mv-header-btn', title: 'Back' }, _svgIcon(ICONS.chevronLeft));
    header.appendChild(backBtn);

    // Title
    const title = el('h1', { className: 'mv-title' }, o.title);
    header.appendChild(title);

    // Right buttons
    const btns = el('div', { className: 'mv-header-buttons' });

    // Bookmark
    this._bookmarkBtn = el('button', { className: 'mv-header-btn mv-bookmark-btn', title: 'Bookmarks' }, _svgIcon(ICONS.bookmark));
    if (this.opts.bookmarks) btns.appendChild(this._bookmarkBtn);

    // Fullscreen (PC only)
    this._fullscreenBtn = el('button', { className: 'mv-header-btn mv-pc-only', title: 'Fullscreen', onClick: () => this._toggleFullscreen() }, _svgIcon(ICONS.expand));
    btns.appendChild(this._fullscreenBtn);

    // Share to X
    btns.appendChild(el('button', { className: 'mv-header-btn', title: 'Share on X', onClick: () => this._shareToX() }, _svgIcon(ICONS.xLogo)));

    // Copy link
    btns.appendChild(el('button', { className: 'mv-header-btn', title: 'Copy link', onClick: () => this._copyLink() }, _svgIcon(ICONS.link)));

    // Help
    btns.appendChild(el('button', { className: 'mv-header-btn', title: 'Help', onClick: () => this._showHelp() }, _svgIcon(ICONS.question)));

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
    });
    footer.appendChild(this._slider);

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
          this._slots.push({ pages: [i], spread: false });
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
        if (dir === 'rtl') pageNodes.unshift(blank);
        else pageNodes.push(blank);
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
    setTimeout(() => this._initAds(), 500);
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
    bind(window, 'orientationchange', () => setTimeout(() => this._onResize(), 100));
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
    this._containerWidth = this._main.offsetWidth;
    this._isMobile = window.matchMedia('(max-width: 768px)').matches;
    this._checkOrientation();
    this._updateTrackPosition(false);
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
      else if (this._currentZoom > this._MAX_ZOOM) this._setZoom(this._MAX_ZOOM);
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
        if (now - this._lastTouchEndTime < this._DOUBLE_TAP_DELAY && dist < 50) {
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
      if (timeDiff < this._DOUBLE_TAP_DELAY) this.resetZoom();
      return;
    }

    if (timeDiff < this._DOUBLE_TAP_DELAY && this.opts.viewMode !== 'scroll') {
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
    }, this._DOUBLE_TAP_DELAY);
  }

  _onTapCenter(e) {
    e.stopPropagation();
    if (this._momentumID) { this._stopMomentum(); return; }

    const now = Date.now();
    const timeDiff = now - this._lastTapTime;
    this._lastTapTime = now;

    if (timeDiff < this._DOUBLE_TAP_DELAY && this.opts.viewMode !== 'scroll') {
      if (this._pendingTapAction) clearTimeout(this._pendingTapAction);
      if (this._currentZoom > 1) this.resetZoom();
      else this._zoomAtPoint(2, e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2);
      return;
    }

    if (this._pendingTapAction) clearTimeout(this._pendingTapAction);
    this._pendingTapAction = setTimeout(() => this._toggleUI(), this._DOUBLE_TAP_DELAY);
  }

  _onTapRight(e) {
    e.stopPropagation();
    if (this._momentumID) { this._stopMomentum(); return; }

    const now = Date.now();
    const timeDiff = now - this._lastTapTime;
    this._lastTapTime = now;

    if (this._currentZoom > 1) {
      if (timeDiff < this._DOUBLE_TAP_DELAY) this.resetZoom();
      return;
    }

    if (timeDiff < this._DOUBLE_TAP_DELAY && this.opts.viewMode !== 'scroll') {
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
    }, this._DOUBLE_TAP_DELAY);
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
    this._currentZoom = Math.max(this._MIN_ZOOM, Math.min(this._MAX_ZOOM, newZoom));
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
    if (this._currentZoom >= this._MAX_ZOOM) return;
    this._setZoom(this._currentZoom + this._ZOOM_STEP);
  }

  resetZoom() {
    this._zoomPanX = 0;
    this._zoomPanY = 0;
    this._isOverscrolling = false;
    this._setZoom(1);
    this._stopMomentum();
  }

  _updateZoomButtons() {
    if (this._zoomInBtn) this._zoomInBtn.disabled = this._currentZoom >= this._MAX_ZOOM;
    if (this._zoomResetBtn) this._zoomResetBtn.disabled = this._currentZoom <= this._MIN_ZOOM;
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
        if (Date.now() - d.timestamp < 30 * 24 * 60 * 60 * 1000) return d;
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
    card.appendChild(el('div', { className: 'mv-resume-title' }, 'Resume reading?'));
    card.appendChild(el('div', { className: 'mv-resume-subtitle' }, `Continue from page ${pageNum}`));

    const btns = el('div', { className: 'mv-resume-buttons' });
    btns.appendChild(el('button', { className: 'mv-resume-btn mv-secondary', onClick: () => { overlay.remove(); try { localStorage.removeItem(this.opts.storageKey); } catch (_) {} } }, 'Start over'));
    const resumeBtn = el('button', {
      className: 'mv-resume-btn mv-primary',
      onClick: () => { overlay.remove(); setTimeout(() => this.goToSlot(this._findSlotByPageIndex(saved.pageIndex)), 100); },
    });
    resumeBtn.appendChild(_svgIcon(ICONS.play));
    resumeBtn.appendChild(document.createTextNode(' Resume'));
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
    navigator.clipboard.writeText(url).then(() => this._showToast('Link copied!')).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = url; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      this._showToast('Link copied!');
    });
  }

  // ─── Toast ───
  _showToast(message) {
    const existing = this._root.querySelector('.mv-toast');
    if (existing) existing.remove();
    const toast = el('div', { className: 'mv-toast' });
    toast.appendChild(_svgIcon(ICONS.check));
    toast.appendChild(document.createTextNode(` ${message}`));
    this._root.appendChild(toast);
    setTimeout(() => { toast.classList.add('mv-fade-out'); setTimeout(() => toast.remove(), 300); }, 2000);
  }

  // ─── Help ───
  _showHelp() {
    const dir = this.opts.direction;
    const isRtl = dir === 'rtl';
    const mode = this.opts.viewMode === 'scroll' ? 'Vertical scroll' : 'Page flip';
    const dirLabel = isRtl ? 'Right to left' : 'Left to right';
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
      const action = isMob ? 'Swipe' : 'Scroll';
      controls.push(makeHelpItem('↕', action, `${action} up/down to read`));
    } else if (isMob) {
      controls.push(
        makeHelpItem('👆', 'Tap', `Left: ${isRtl ? 'next' : 'prev'} page / Right: ${isRtl ? 'prev' : 'next'} page / Center: toggle menu`),
        makeHelpItem('👋', 'Swipe', 'Swipe left/right to turn pages'),
        makeHelpItem('🔍', 'Pinch', 'Pinch to zoom, drag to pan. Drag to edge to turn page.')
      );
    } else {
      controls.push(
        makeHelpItem('🖱', 'Click', `Left: ${isRtl ? 'next' : 'prev'} / Right: ${isRtl ? 'prev' : 'next'} / Center: menu`),
        makeHelpItem('⌨', 'Keyboard', '← → : page turn / Space: next / Esc: reset zoom'),
        makeHelpItem('🔍', 'Zoom', 'Use buttons or double-click center to zoom')
      );
    }

    const overlay = el('div', { className: 'mv-help-overlay' });
    overlay.addEventListener('click', () => overlay.remove());

    const card = el('div', { className: 'mv-help-card' });
    card.addEventListener('click', (e) => e.stopPropagation());

    const header = el('div', { className: 'mv-help-header' });
    const title = el('div', { className: 'mv-help-title' });
    title.appendChild(_svgIcon(ICONS.questionCircle));
    title.appendChild(document.createTextNode(' Help'));
    const closeBtn = el('button', { className: 'mv-help-close', type: 'button' }, _svgIcon(ICONS.times));
    closeBtn.addEventListener('click', () => overlay.remove());
    header.appendChild(title);
    header.appendChild(closeBtn);

    const content = el('div', { className: 'mv-help-content' });
    const settingsSection = el('div', { className: 'mv-help-section' });
    settingsSection.appendChild(el('div', { className: 'mv-help-section-title' }, '⚙ Settings'));
    settingsSection.appendChild(makeHelpItem('📖', mode, isPage ? `Direction: ${dirLabel}` : ''));

    const controlsSection = el('div', { className: 'mv-help-section' });
    controlsSection.appendChild(el('div', { className: 'mv-help-section-title' }, '👆 Controls'));
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
    card.appendChild(el('div', { className: 'mv-purchase-title' }, 'Preview ends here'));
    card.appendChild(el('p', { className: 'mv-purchase-desc' }, `${this._totalOriginalPages} pages total — ${o.previewLimit} free`));
    card.appendChild(el('p', { className: 'mv-purchase-desc' }, 'Purchase to continue reading'));
    if (o.purchaseUrl) {
      const purchaseBtn = el('a', { href: purchaseUrl, className: 'mv-purchase-btn' }, 'Purchase');
      if (o.purchasePrice) purchaseBtn.appendChild(document.createTextNode(` ${o.purchasePrice}`));
      card.appendChild(purchaseBtn);
    }
    if (o.backUrl) card.appendChild(el('a', { href: o.backUrl, className: 'mv-purchase-back' }, 'Go back'));
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
    });
    await this._bookmarkMgr.load();
    this._buildBookmarkPanel();
    this._updateBookmarkBtn();
  }

  _buildBookmarkPanel() {
    this._bookmarkPanel = el('div', { className: 'mv-bookmark-panel' });
    this._bookmarkOverlay = el('div', { className: 'mv-bookmark-overlay', onClick: () => this._toggleBookmarkPanel() });

    // Header
    const header = el('div', { className: 'mv-bookmark-panel-header' });
    header.appendChild(el('span', { className: 'mv-bookmark-panel-title' }, 'しおり'));
    header.appendChild(el('button', { className: 'mv-bookmark-panel-close', onClick: () => this._toggleBookmarkPanel() }, _svgIcon(ICONS.times)));
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
      document.createTextNode(hasCurrent ? ' しおりを削除' : ' 現在のページをブックマーク'),
    );
    this._bookmarkToggleBtn.classList.toggle('mv-bookmark-remove', hasCurrent);

    // List
    this._bookmarkList.innerHTML = '';
    if (bms.length === 0) {
      this._bookmarkList.appendChild(el('div', { className: 'mv-bookmark-empty' }, 'しおりはまだありません'));
      return;
    }
    bms.forEach(bm => {
      const item = el('div', { className: 'mv-bookmark-item' + (bm.page_number === currentPage ? ' mv-active' : ''), onClick: () => {
        this.goToPage(bm.page_number);
        this._toggleBookmarkPanel();
      }});
      const info = el('div', { className: 'mv-bookmark-item-info' });
      info.appendChild(el('span', { className: 'mv-bookmark-item-page' }, `${bm.page_number}ページ`));
      info.appendChild(el('span', { className: 'mv-bookmark-item-title' }, bm.title || `ページ${bm.page_number}`));
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

  _sanitizeHtml(html) {
    const template = document.createElement('template');
    template.innerHTML = String(html || '');
    template.content.querySelectorAll('script').forEach((node) => node.remove());
    template.content.querySelectorAll('*').forEach((node) => {
      for (const attr of Array.from(node.attributes)) {
        if (/^on/i.test(attr.name)) node.removeAttribute(attr.name);
      }
    });
    return template.content.cloneNode(true);
  }

  async _toggleCurrentPageBookmark() {
    if (!this._bookmarkMgr) return;
    const currentPage = this._getCurrentPageIndex() + 1;
    if (this._bookmarkMgr.has(currentPage)) {
      await this._bookmarkMgr.remove(currentPage);
      this._showToast('しおりを削除しました');
    } else {
      const result = await this._bookmarkMgr.add(currentPage);
      if (result.success) this._showToast('しおりを追加しました');
      else this._showToast(result.error || 'エラーが発生しました');
    }
    this._renderBookmarkList();
    this._updateBookmarkBtn();
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

  /** Destroy viewer and clean up */
  destroy() {
    this._stopMomentum();
    this._setPseudoFullscreenBodyLock(false);
    clearTimeout(this._bmTimer);
    this._bmTimer = null;
    if (this._bound._list) {
      for (const [target, evt, fn, opts] of this._bound._list) {
        target.removeEventListener(evt, fn, opts);
      }
    }
    this._root.replaceChildren();
  }
}
