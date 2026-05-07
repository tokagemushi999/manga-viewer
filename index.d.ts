export type MangaPage =
  | string
  | {
      type?: 'image';
      src: string;
      linkUrl?: string;
      linkTarget?: string;
      backgroundColor?: string;
    }
  | {
      type: 'html';
      /**
       * HTML to inject into the slot. The string is sanitized via
       * a built-in whitelist sanitizer unless `htmlSanitizer` is provided.
       * Never pass un-trusted input without first sanitizing on your side.
       */
      html: string;
      linkUrl?: string;
      linkTarget?: string;
      backgroundColor?: string;
    }
  | {
      type: 'adsense';
      client: string;
      slot: string;
      backgroundColor?: string;
    };

export interface MangaViewerBookmark {
  page_number: number;
  title: string;
}

export interface MangaViewerBookmarkResult {
  success: boolean;
  error?: string;
}

export interface MangaViewerBookmarkManager {
  readonly bookmarks: MangaViewerBookmark[];
  load(): Promise<MangaViewerBookmark[]>;
  has(pageNum: number): boolean;
  add(pageNum: number, title?: string): Promise<MangaViewerBookmarkResult>;
  remove(pageNum: number): Promise<MangaViewerBookmarkResult>;
}

/**
 * UI strings used by the viewer. Pass any subset to `MangaViewerOptions.messages`
 * to override defaults. Functions receive a number/string and return the
 * formatted display string.
 */
export interface MangaViewerMessages {
  // Bookmarks
  bookmarkPanelTitle?: string;
  bookmarkAdd?: string;
  bookmarkRemove?: string;
  bookmarkEmpty?: string;
  bookmarkPageLabel?: (pageNum: number) => string;
  bookmarkDefaultTitle?: (pageNum: number) => string;
  bookmarkAdded?: string;
  bookmarkRemoved?: string;
  bookmarkLimit?: (max: number) => string;
  bookmarkGenericError?: string;
  bookmarkBtnTitle?: string;
  // Resume dialog
  resumeTitle?: string;
  resumeSubtitle?: (pageNum: number) => string;
  resumeStart?: string;
  resumeContinue?: string;
  // Toast
  linkCopied?: string;
  // Help overlay
  helpBtnTitle?: string;
  helpClose?: string;
  helpTitle?: string;
  helpSettings?: string;
  helpControls?: string;
  helpModePage?: string;
  helpModeScroll?: string;
  helpDirRtl?: string;
  helpDirLtr?: string;
  helpDirection?: (label: string) => string;
  helpScrollAction?: (action: string) => string;
  helpScrollMobile?: string;
  helpScrollDesktop?: string;
  helpTapLabel?: string;
  helpTapDesc?: (left: string, right: string) => string;
  helpSwipeLabel?: string;
  helpSwipeDesc?: string;
  helpPinchLabel?: string;
  helpPinchDesc?: string;
  helpClickLabel?: string;
  helpClickDesc?: (left: string, right: string) => string;
  helpKeyboardLabel?: string;
  helpKeyboardDesc?: string;
  helpZoomLabel?: string;
  helpZoomDesc?: string;
  helpDirNext?: string;
  helpDirPrev?: string;
  // Aria-live
  pageAnnounce?: (pageNum: number, total: number) => string;
  // Tap area aria labels
  ariaPrevPage?: string;
  ariaNextPage?: string;
  // Purchase popup
  purchaseTitle?: string;
  purchaseTotal?: (total: number, free: number) => string;
  purchaseCta?: string;
  purchaseBtn?: string;
  purchaseBack?: string;
}

export interface MangaViewerOptions {
  container?: string | HTMLElement;
  pages?: MangaPage[];
  direction?: 'rtl' | 'ltr';
  firstPageSingle?: boolean;
  viewMode?: 'page' | 'scroll';
  adsense?: { client: string; slot: string } | null;
  previewLimit?: number | null;
  onPageChange?: ((currentPage: number, totalPages: number) => void) | null;
  onComplete?: (() => void) | null;
  storageKey?: string;
  title?: string;
  backUrl?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  shareUrl?: string;
  purchaseUrl?: string;
  purchasePrice?: string;
  loadingText?: string;
  bookmarks?: boolean;
  bookmarkId?: string;
  bookmarkApi?: string | null;
  bookmarkHeaders?: Record<string, string>;
  onBookmarkChange?: ((bookmarks: MangaViewerBookmark[]) => void) | null;
  /**
   * Custom HTML sanitizer for `type: 'html'` insert pages. Receives the raw
   * HTML string and must return a sanitized HTML string. Pass `DOMPurify.sanitize`
   * for production use. When omitted, a built-in whitelist sanitizer is used.
   */
  htmlSanitizer?: ((html: string) => string) | null;
  /**
   * Override any subset of UI strings. Defaults are Japanese; supply English
   * (or any locale) by passing the keys you want to replace.
   */
  messages?: MangaViewerMessages | null;
}

export default class MangaViewer {
  constructor(options?: MangaViewerOptions);

  /** Current page number (1-indexed). */
  get currentPage(): number;
  /** Total number of pages, including inserts. */
  get totalPages(): number;
  /** Bookmark manager instance, or null when bookmarks are disabled. */
  get bookmarkManager(): MangaViewerBookmarkManager | null;
  /** AbortSignal that fires when destroy() is called. */
  get abortSignal(): AbortSignal | undefined;

  /** Jump to a slot by index (0-based). */
  goToSlot(idx: number): void;
  /** Jump to a page by page number (1-based). */
  goToPage(pageNum: number): void;
  /** Zoom in by one step. */
  zoomIn(): void;
  /** Reset zoom to 1× and clear pan offset. */
  resetZoom(): void;
  /** Tear down the viewer, cancel pending timers/RAFs, abort fetches. Idempotent. */
  destroy(): void;
}
