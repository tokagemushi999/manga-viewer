# 📖 Manga Viewer

**Webブラウザ向けの、依存ライブラリゼロな漫画・コミックビューア。**

日本の漫画の読み方（右綴じ・横向き時の見開き）を前提に作っていますが、設定でどんなコミック形式にも対応できます。

<!-- [Live Demo](https://tokagemushi.jp/lab/manga-viewer) -->

---

## 🙋 ご利用にあたって（Notice）

このビューアは MIT ライセンスで自由にご利用いただけますが、
**もし使ってくださる場合は、ひと声お知らせいただけるととても嬉しいです。**

- どんなサイト・アプリ・作品で使われているのか、純粋に興味があります
- 共同開発・改善のご相談、機能追加のご要望も大歓迎です
- バグ報告や使ってみた感想も、お気軽にどうぞ

**ご連絡先:**
- GitHub Issues / Discussions（このリポジトリ）
- Webサイト: [tokagemushi.jp](https://tokagemushi.jp)

> If you use this viewer, I'd love to hear about it — feel free to open an Issue or reach out via [tokagemushi.jp](https://tokagemushi.jp). Co-development inquiries are very welcome.

---

## ✅ 主な機能

- **右綴じ / 左綴じ** 両対応
- **見開きモード** — 横画面で自動的に2ページ見開き表示
- **ピンチズーム** — 慣性・ラバーバンド付き
- **スワイプでページ送り** — 慣性付き
- **ダブルタップ拡大**（タッチ・マウス両対応）
- **キーボード操作** — 矢印キー / Space / Home/End / Esc
- **マウス・タッチ** 両対応
- **読書位置の保存** — localStorage に進捗記録
- **UI** — ヘッダー・フッター・ページスライダー・ズームボタン
- **ヘルプ表示** — 操作方法をデバイスごとに案内
- **続きから読むダイアログ** — 「○ページ目から続きを読みますか？」
- **画面回転検知** — 縦横で見開き⇄単ページを自動切替
- **先読み** — 近接ページを事前ロード
- **挿入ページ** — 広告・HTML・画像を任意の位置に挿入可能
- **試し読み制限** — 無料試し読み＋購入導線
- **Google AdSense** 連携
- **縦スクロールモード** — Webtoon対応
- **フルスクリーン** — ネイティブ + 疑似フルスクリーン
- **ステータスバー対応** — ノッチ／セーフエリア対応
- **シェア機能** — X(旧Twitter)シェア・URLコピー
- **ダークテーマ** — モバイル明 / デスクトップ暗を自動切替
- **依存ゼロ** — 実行時の外部依存はありません（純粋なvanilla JS / CSS）
- **i18n対応** — UI文字列をすべて差し替え可能（既定値は日本語）
- **アクセシビリティ** — Shadow DOM内に `aria-live` 領域、ページ変更通知
- **ESモジュール** — `import MangaViewer from './manga-viewer.js'`

---

## 🚀 クイックスタート

ビューアは Shadow DOM 内に CSS をインライン展開するため、CSSファイルを `<link>` で読み込む必要はありません。**JS一つだけ読み込めば動きます。**

```html
<div id="viewer"></div>

<script type="module">
  import MangaViewer from './src/manga-viewer.js';

  const viewer = new MangaViewer({
    container: '#viewer',
    pages: [
      'pages/001.jpg',
      'pages/002.jpg',
      'pages/003.jpg',
      // ...
    ],
    direction: 'rtl', // 右綴じ
    title: 'サンプル漫画',
  });
</script>
```

これで指定した要素がフルスクリーンの読書画面に変わります。

---

## 📚 APIリファレンス

### コンストラクタオプション

| オプション | 型 | 既定値 | 説明 |
|--------|------|---------|-------------|
| `container` | `string \| HTMLElement` | `'#viewer'` | CSSセレクタまたはDOM要素 |
| `pages` | `Array<string \| Object>` | `[]` | 画像URL、またはページオブジェクト（後述） |
| `direction` | `'rtl' \| 'ltr'` | `'rtl'` | 読み進める方向（rtl=右綴じ） |
| `firstPageSingle` | `boolean` | `true` | 見開き時に1ページ目を単独表示 |
| `viewMode` | `'page' \| 'scroll'` | `'page'` | ページ送り or 縦スクロール |
| `title` | `string` | `''` | ヘッダーに表示するタイトル |
| `backUrl` | `string` | `'/'` | 戻るボタンのリンク先 |
| `shareUrl` | `string` | `''` | シェア／コピー用URL（既定は現在のページ） |
| `bookmarks` | `boolean` | `true` | ブックマーク機能の有効化 |
| `bookmarkId` | `string` | `''` | ブックマーク同期用の作品ID（未指定時は `location.pathname` のハッシュ） |
| `bookmarkApi` | `string \| null` | `null` | ブックマーク同期API（無指定時はlocalStorage） |
| `bookmarkHeaders` | `Record<string,string>` | `{}` | `bookmarkApi` リクエストに付与するヘッダ |
| `onBookmarkChange` | `Function` | `null` | `(bookmarks) => {}`、追加・削除時に発火 |
| `storageKey` | `string` | `'manga_progress'` | 進捗保存に使うlocalStorageキー |
| `showHeader` | `boolean` | `true` | ヘッダーバーの表示 |
| `showFooter` | `boolean` | `true` | フッターバーの表示 |
| `loadingText` | `string` | `'Loading...'` | ローディング画面のテキスト |
| `previewLimit` | `number \| null` | `null` | 試し読みできるページ数 |
| `purchaseUrl` | `string` | `''` | 購入ボタンのURL |
| `purchasePrice` | `string` | `''` | 購入ボタンに表示する価格 |
| `adsense` | `{ client, slot }` | `null` | 末尾にAdSenseページを追加 |
| `htmlSanitizer` | `Function \| null` | `null` | `type:'html'` 用のサニタイザ。未指定時は組み込みのホワイトリスト方式を使用。`DOMPurify.sanitize` を渡すとさらに安全 |
| `messages` | `Object \| null` | `null` | UI文字列の上書き（後述）。既定値は日本語 |
| `theme` | `'auto' \| 'light' \| 'dark'` | `'auto'` | テーマ。`auto`=画面幅で切替（既定挙動）、`light`/`dark`=強制 |
| `hideButtons` | `string[]` | `[]` | 非表示にするボタン名（後述） |
| `extraButtons` | `ExtraButton[]` | `[]` | カスタムボタン挿入（後述） |
| `footerBottomPadding` | `number \| string \| null` | `null` | フッター下余白（px）。CSS変数 `--mv-footer-bottom-padding` でも指定可 |
| `onBack` | `Function \| null` | `null` | 戻るボタンクリック時のコールバック。指定すると `backUrl` への遷移を抑止し、この関数を実行（`() => history.back()` 等で使用） |
| `lastPageAlign` | `'center' \| 'start' \| 'end'` | `'center'` | 見開きで最終ページが奇数で余ったときの寄せ位置。`'start'`=読み始め側（RTL→右、LTR→左）、`'end'`=読み終わり側 |
| `onPageChange` | `Function` | `null` | `(currentPage, totalPages) => {}` |
| `onComplete` | `Function` | `null` | 最終ページに到達したとき呼ばれる |

### ページオブジェクト

`pages` には画像URLのほか、以下のオブジェクトも指定できます：

```js
// 画像URLのみ
'page001.jpg'

// リンク付き画像
{ type: 'image', src: 'ad.jpg', linkUrl: 'https://...', linkTarget: '_blank', backgroundColor: '#000' }

// HTML差し込み
{ type: 'html', html: '<div>...</div>', backgroundColor: '#fff' }

// AdSense
{ type: 'adsense', client: 'ca-pub-XXX', slot: '123456' }
```

### インスタンスプロパティ

| プロパティ | 型 | 説明 |
|----------|------|-------------|
| `viewer.currentPage` | `number` | 現在のページ番号（1始まり） |
| `viewer.totalPages` | `number` | 総ページ数 |
| `viewer.bookmarkManager` | `BookmarkManager \| null` | ブックマーク管理オブジェクト |
| `viewer.abortSignal` | `AbortSignal \| undefined` | `destroy()` で発火するシグナル |

### インスタンスメソッド

| メソッド | 説明 |
|--------|-------------|
| `viewer.goToPage(n)` | 指定ページへジャンプ（1始まり） |
| `viewer.goToSlot(n)` | 指定スロットへジャンプ（0始まり） |
| `viewer.zoomIn()` | 1段階ズームイン |
| `viewer.resetZoom()` | ズームを1倍にリセット |
| `viewer.destroy()` | ビューアを破棄。タイマー、フェッチ、イベントリスナーをすべて解放（複数回呼んでも安全） |

### 🎨 テーマ（v0.4.0+）

```js
new MangaViewer({
  theme: 'dark',     // 既定 'auto'（モバイル明・デスクトップ暗）
  // 'light' / 'dark' で固定
});
```

色を細かくカスタマイズしたい場合は CSS 変数を上書き:

```css
#viewer {
  --mv-bg: #1a1a1a;
  --mv-fg: #f0f0f0;
  --mv-header-bg: rgba(20, 20, 20, 0.95);
  --mv-accent: #ff6b6b;
}
```

主なCSS変数: `--mv-bg`, `--mv-fg`, `--mv-text-muted`, `--mv-header-bg`, `--mv-footer-bg`, `--mv-btn-bg`, `--mv-btn-bg-hover`, `--mv-btn-fg`, `--mv-slider-track`, `--mv-spinner-track`, `--mv-spinner-fg`, `--mv-accent`, `--mv-shadow`, `--mv-footer-bottom-padding`

### 🔘 ボタンのカスタマイズ（v0.4.0+）

**標準ボタンを隠す**:
```js
new MangaViewer({
  hideButtons: ['share', 'copy'],   // X共有とリンクコピーを非表示
});
```
標準名: `'back'`, `'bookmark'`, `'fullscreen'`, `'share'`, `'copy'`, `'help'`, `'zoomIn'`, `'zoomReset'`

**カスタムボタンを追加**:
```js
import MangaViewer, { icons } from './manga-viewer.js';

new MangaViewer({
  extraButtons: [
    {
      slot: 'header',                       // 'header' | 'footer'
      position: 'end',                       // 'start' | 'end' | number
      icon: icons.reload,                    // SVG文字列、HTMLElement、DocumentFragment いずれも可
      label: '更新',
      onClick: (event, viewer) => location.reload(),
    },
  ],
});
```

提供アイコン: `icons.reload` / `icons.refresh`（aliasとして同一） / `icons.download` / `icons.print`

### 🌐 i18n / UIの言語切り替え

UI文字列はすべて `messages` で上書き可能です。既定値は日本語。英語化したい場合：

```js
new MangaViewer({
  // ...
  messages: {
    resumeTitle: 'Resume reading?',
    resumeSubtitle: (n) => `Continue from page ${n}`,
    resumeStart: 'Start over',
    resumeContinue: ' Resume',
    bookmarkPanelTitle: 'Bookmarks',
    bookmarkAdded: 'Bookmark added',
    bookmarkRemoved: 'Bookmark removed',
    helpTitle: ' Help',
    helpSettings: '⚙ Settings',
    helpControls: '👆 Controls',
    // 必要なキーだけ上書き、未指定は日本語のまま
  },
});
```

利用可能なキーは `index.d.ts` の `MangaViewerMessages` を参照してください。

### 🛡 HTMLサニタイズと `type: 'html'` ページ

`type: 'html'` の挿入ページに渡す HTML は、組み込みの**ホワイトリスト方式**サニタイザで以下が除去されます:
- 危険なタグ（`script` / `iframe` / `object` / `style` / `link` / `form` / 入力要素など）
- イベントハンドラ属性（`onclick` 等）
- 危険なURLスキーム（`javascript:` / `vbscript:` / `data:text/html`）
- 危険な `style` 値（`expression()` / `url(...)` / `@import` など）
- `<a target>` には自動で `rel="noopener noreferrer"` を付与

**ユーザー入力をそのまま渡してはいけません。** 安全側に倒したい場合は [DOMPurify](https://github.com/cure53/DOMPurify) を併用してください：

```js
import DOMPurify from 'dompurify';

new MangaViewer({
  // ...
  htmlSanitizer: (html) => DOMPurify.sanitize(html, { USE_PROFILES: { html: true } }),
});
```

---

## 🎨 スタイルのカスタマイズ

CSSは Shadow DOM 内に**自動的にインライン展開**されます。外部の `<link>` でのスタイル上書きはできません（Shadow DOMの仕様）。

カスタマイズしたい場合の選択肢:
1. **`src/manga-viewer.css` を編集 → `npm run build`** でJSへ自動同期
2. **CSS変数を上書き** — ヘッダー背景などは `:host` の CSS変数で制御（今後の拡張予定）

既定のテーマ:
- **デスクトップ**: 黒背景・明色UI
- **モバイル（≤768px）**: 白背景・暗色UI

主なクラス:
- `.mv-container` — 全体ラッパー
- `.mv-header` / `.mv-footer` — ヘッダー・フッター
- `.mv-page-slider` — ページスライダー
- `.mv-page-slot` — 個別ページ枠

任意のCSSで上書きできます。

---

## 📱 iOS / Android アプリで使う

**WKWebView**（iOS）や **WebView**（Android）の中で動作するので、ネイティブアプリにそのまま組み込めます。

### Swift（WKWebView）

```swift
import WebKit

class MangaViewController: UIViewController, WKNavigationDelegate {
    var webView: WKWebView!

    override func viewDidLoad() {
        super.viewDidLoad()

        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true

        webView = WKWebView(frame: view.bounds, configuration: config)
        webView.navigationDelegate = self
        webView.scrollView.isScrollEnabled = false // ビューア側でスクロール制御
        view.addSubview(webView)

        // ローカルバンドルから読み込む
        if let url = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "manga-viewer") {
            webView.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
        }

        // または CDN / 自前サーバから
        // webView.load(URLRequest(url: URL(string: "https://your-site.com/reader.html")!))
    }
}
```

### WebView用 最小 `reader.html`

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <style>html, body { margin: 0; padding: 0; height: 100%; overflow: hidden; }</style>
</head>
<body>
  <div id="viewer"></div>
  <script type="module">
    import MangaViewer from './manga-viewer.js';
    new MangaViewer({
      container: '#viewer',
      pages: ['pages/001.jpg', 'pages/002.jpg', 'pages/003.jpg'],
      direction: 'rtl',
      title: 'サンプル漫画',
    });
  </script>
</body>
</html>
```

### React Native

```jsx
import { WebView } from 'react-native-webview';

export default function MangaScreen() {
  return (
    <WebView
      source={{ uri: 'https://your-site.com/reader.html' }}
      // または source={require('./assets/reader.html')} でローカル読み込み
      javaScriptEnabled={true}
      scrollEnabled={false}
      style={{ flex: 1 }}
    />
  );
}
```

### Capacitor / Cordova

`npm install @tokagemushi/manga-viewer` でインストールし、Web側からそのまま使えます。Capacitor WebView 内で追加設定なしで動作します。

### 組み込み時のヒント

- WebView 側の `scrollEnabled` は `false` にする（タッチ操作はビューアが担当）
- ノッチ端末向けに `viewport-fit=cover` を付ける
- ネイティブ → WebView へページデータを渡すには `evaluateJavaScript`（Swift）や `postMessage`（React Native）を利用

---

## 🖥 ブラウザ対応

| ブラウザ | 対応 |
|---------|---------|
| Chrome / Edge | ✅ 最新版 |
| Firefox | ✅ 最新版 |
| Safari / iOS Safari | ✅ 最新版 |
| Samsung Internet | ✅ 最新版 |

ESモジュール（`<script type="module">`）対応ブラウザが必要です。

---

## 📄 ライセンス

MIT License — Created by [tokagemushi](https://tokagemushi.jp)

ライセンスの範囲では自由にお使いいただけますが、上記の通り、ご利用報告をいただけると嬉しいです。

---

<details>
<summary>🌐 English README</summary>

## Manga Viewer

**A standalone, zero-dependency manga & comic viewer for the web.**

Built for Japanese manga reading conventions (RTL page order, spread mode on landscape) but fully configurable for any comic format.

### 🙋 Notice for Users

This viewer is MIT-licensed, but **if you use it, I'd really appreciate hearing about it.** I'm curious to know what sites, apps, or works it ends up in, and I'm always open to co-development or feature discussions. Bug reports and feedback are also welcome.

Contact: GitHub Issues / Discussions, or [tokagemushi.jp](https://tokagemushi.jp).

### Features

- RTL & LTR reading direction
- Spread mode — automatic two-page spread on landscape screens
- Pinch zoom with inertia & rubber-band bounce
- Swipe navigation with momentum
- Double-tap zoom (touch & mouse)
- Keyboard navigation — arrow keys, Space, Home/End, Esc
- Reading progress saved to localStorage
- Help overlay with context-aware instructions
- Resume dialog — "Continue from page X?"
- Orientation detection — auto spread/single on resize
- Preloading — nearby pages loaded eagerly
- Insert pages — ads, HTML, or image inserts at any position
- Preview limit — free-preview with purchase prompt
- Google AdSense integration
- Scroll mode — vertical continuous scroll
- Fullscreen — native + pseudo-fullscreen fallback
- Status bar cover — for mobile notch/safe-area
- Share — X (Twitter) share & link copy
- Dark theme — matches mobile light / desktop dark automatically
- No dependencies — pure vanilla JS & CSS, no build tools required
- ES Module — `import MangaViewer from './manga-viewer.js'`

### Quick Start

The viewer mounts inside Shadow DOM and inlines its own CSS, so no `<link>` is needed.

```html
<div id="viewer"></div>

<script type="module">
  import MangaViewer from './manga-viewer.js';

  const viewer = new MangaViewer({
    container: '#viewer',
    pages: ['pages/001.jpg', 'pages/002.jpg', 'pages/003.jpg'],
    direction: 'rtl',
    title: 'My Manga',
  });
</script>
```

For full API reference, iOS/Android integration examples, and styling details, please refer to the Japanese sections above — option names, types, and code samples are identical.

### License

MIT — Created by [tokagemushi](https://tokagemushi.jp)

</details>
