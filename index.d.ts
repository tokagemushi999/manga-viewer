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
}

export default class MangaViewer {
  constructor(options?: MangaViewerOptions);

  get currentPage(): number;
  get totalPages(): number;
  get bookmarkManager(): MangaViewerBookmarkManager | null;

  goToSlot(idx: number): void;
  goToPage(pageNum: number): void;
  zoomIn(): void;
  resetZoom(): void;
  destroy(): void;
}
