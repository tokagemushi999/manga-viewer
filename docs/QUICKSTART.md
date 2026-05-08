# Manga Viewer クイックスタート

依存ゼロの Web 漫画ビューア。コピペ1ブロックで導入できます。

## 5分で始める

### 1. HTML を用意

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
</head>
<body>
  <div id="viewer"></div>

  <script type="module">
    import MangaViewer from 'https://cdn.jsdelivr.net/npm/@tokagemushi/manga-viewer@0.5.0/src/manga-viewer.js';

    new MangaViewer({
      container: '#viewer',
      pages: ['p1.jpg', 'p2.jpg', 'p3.jpg'],
      direction: 'rtl',           // 右綴じ（日本の漫画）
      title: 'サンプル漫画',
    });
  </script>
</body>
</html>
```

これだけで動きます。CSS は viewer が Shadow DOM 内に自動展開するため `<link>` 不要。

### 2. 画像を置く

`p1.jpg` `p2.jpg` ... のような形でローカルやCDNに画像を置いて、`pages` 配列に URL を並べてください。

### 3. ブラウザで開く

`http://localhost/your-page.html` を開けば即読書できます。

---

## 全オプション一覧

| オプション | 型 | 既定値 | 説明 |
|---|---|---|---|
| `container` | `string \| HTMLElement` | `'#viewer'` | マウント先 |
| `pages` | `Array<string \| Object>` | `[]` | 画像URLまたはページオブジェクト |
| `direction` | `'rtl' \| 'ltr'` | `'rtl'` | 読み進める方向 |
| `firstPageSingle` | `boolean` | `true` | 見開き時の表紙単独表示 |
| `viewMode` | `'page' \| 'scroll'` | `'page'` | ページ送り or 縦スクロール |
| `title` | `string` | `''` | ヘッダー中央タイトル |
| `backUrl` | `string` | `'/'` | 戻るボタンの遷移先 |
| `onBack` | `Function \| null` | `null` | 戻るボタン押下時のコールバック（指定時は backUrl 無効） |
| `shareUrl` | `string` | `''` | X共有・URLコピー用 |
| `showHeader` / `showFooter` | `boolean` | `true` | ヘッダー・フッター全体の表示 |
| `loadingText` | `string` | `'読み込み中…'` | ローディング画面の文言 |
| `bookmarks` | `boolean` | `true` | しおり機能の有効化 |
| `bookmarkId` | `string` | `''` | 同期用作品ID（未指定はpathnameハッシュ） |
| `bookmarkApi` | `string \| null` | `null` | しおり同期APIエンドポイント（未指定はlocalStorage） |
| `theme` | `'auto' \| 'light' \| 'dark'` | `'auto'` | テーマ（autoは画面幅で切替） |
| `hideButtons` | `string[]` | `[]` | 非表示にする標準ボタン名 |
| `extraButtons` | `ExtraButton[]` | `[]` | カスタムボタン挿入 |
| `lastPageAlign` | `'center' \| 'start' \| 'end'` | `'center'` | 見開きで最終ページが余ったときの寄せ位置 |
| `footerBottomPadding` | `number \| string` | `null` | スライダー下の余白(px) |
| `htmlSanitizer` | `Function \| null` | `null` | `type:'html'` ページ用カスタムサニタイザ |
| `messages` | `Object \| null` | `null` | UI文字列の上書き（i18n） |
| `previewLimit` | `number \| null` | `null` | 試し読みできるページ数 |
| `purchaseUrl` / `purchasePrice` | `string` | `''` | 購入導線 |
| `adsense` | `{client, slot}` | `null` | 末尾AdSense |
| `onPageChange` | `Function` | `null` | `(currentPage, totalPages) => {}` |
| `onComplete` | `Function` | `null` | 最終ページ到達時 |

### 標準ボタン名（`hideButtons` で指定）
`back` / `bookmark` / `fullscreen` / `share` / `copy` / `help` / `zoomIn` / `zoomReset`

---

## よくあるレシピ

### A. 日本の漫画（右綴じ・見開き・しおり同期なし）
```js
new MangaViewer({
  container: '#viewer',
  pages: [...],
  direction: 'rtl',
  title: '○○巻',
});
```

### B. 西洋コミック（左綴じ・縦スクロール）
```js
new MangaViewer({
  container: '#viewer',
  pages: [...],
  direction: 'ltr',
  viewMode: 'scroll',
});
```

### C. スマホでも黒背景
```js
new MangaViewer({
  // ...
  theme: 'dark',
});
```

### D. X共有・リンクコピーを消す
```js
hideButtons: ['share', 'copy'],
```

### E. 更新ボタンを追加
```js
import MangaViewer, { icons } from '...';

new MangaViewer({
  // ...
  extraButtons: [{
    icon: icons.reload,
    label: '更新',
    onClick: () => location.reload(),
  }],
});
```

### F. 戻るボタンを履歴で戻す
```js
onBack: () => history.back(),
```

### G. 右綴じで最終ページが余ったとき右寄せに
```js
direction: 'rtl',
lastPageAlign: 'start',   // start = 読み始め側 = RTLでは右
```

### H. PWAでスライダーが iOS ホームバーにかぶる
v0.5.0 から `@media (display-mode: standalone)` で自動16px加算。さらに調整したい場合:
```css
#viewer { --mv-pwa-footer-bonus: 24px; }
```

### I. 試し読み制限＋購入導線
```js
previewLimit: 30,                                  // 30ページまで無料
purchaseUrl: 'https://your-shop.com/buy',
purchasePrice: '500円',
```

### J. UI を英語化
```js
messages: {
  resumeTitle: 'Resume reading?',
  resumeStart: 'Start over',
  resumeContinue: ' Resume',
  helpTitle: ' Help',
  helpSettings: '⚙ Settings',
  helpControls: '👆 Controls',
  bookmarkPanelTitle: 'Bookmarks',
  // ...必要なキーだけ上書き
},
```

### K. CSS 変数でカラー上書き
```css
#viewer {
  --mv-bg: #1a1a1a;
  --mv-fg: #f0f0f0;
  --mv-accent: #ff6b6b;
}
```
利用可能な変数: `--mv-bg`, `--mv-fg`, `--mv-text-muted`, `--mv-header-bg`, `--mv-footer-bg`, `--mv-btn-bg`, `--mv-btn-bg-hover`, `--mv-btn-fg`, `--mv-slider-track`, `--mv-spinner-track`, `--mv-spinner-fg`, `--mv-accent`, `--mv-shadow`, `--mv-footer-bottom-padding`, `--mv-pwa-footer-bonus`

### L. HTML/広告ページ挿入
```js
pages: [
  'p1.jpg',
  { type: 'html', html: '<div>広告枠</div>', backgroundColor: '#fff' },
  'p2.jpg',
  { type: 'adsense', client: 'ca-pub-XXX', slot: '123456' },
],
```
※ HTML はホワイトリストサニタイザを通る。スクリプトや危険なタグは除去される。

---

## トラブルシュート

| 症状 | 原因 | 対処 |
|---|---|---|
| ブラウザ画面が真っ暗 | JS/CSSの読み込み失敗、または imports のパスが間違い | DevTools コンソールでエラー確認、Networkタブで 404 がないか確認 |
| アイコンが切れる/見切れる | v0.4.0 のサニタイザバグ（修正済） | v0.5.0 に更新 |
| ヘルプ画面が変なフォント | v0.4.0 で `:host` にフォント設定が無かった（修正済） | v0.5.0 に更新 |
| しおりが保存されない | プライベートブラウジング、または localStorage 容量超過 | プライベートモード解除 or `bookmarkApi` を実装 |
| iOS PWA でスライダーが触りにくい | ホーム指示子と干渉 | `--mv-pwa-footer-bonus` を増やす |
| 画像のロードが遅い | `pages` 配列に大量URL | 画像CDN利用、`loading="lazy"` は内部で自動付与 |

---

## リンク
- GitHub: https://github.com/tokagemushi999/manga-viewer
- npm: https://www.npmjs.com/package/@tokagemushi/manga-viewer
- ライブデモ: https://tokagemushi.jp/lab/manga-viewer/demo/
- CHANGELOG: [CHANGELOG.md](../CHANGELOG.md)
- 詳細README: [README.md](../README.md)

不具合・要望は GitHub Issues か [tokagemushi.jp](https://tokagemushi.jp) からどうぞ。
