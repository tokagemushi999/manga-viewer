# 📖 Manga Viewer

**A standalone, zero-dependency manga & comic viewer for the web.**

Built for Japanese manga reading conventions (RTL page order, spread mode on landscape) but fully configurable for any comic format.

<!-- [Live Demo](https://tokagemushi.jp/lab/manga-viewer) -->

---

## ✅ Features

- **RTL & LTR** reading direction
- **Spread mode** — automatic two-page spread on landscape screens
- **Pinch zoom** with inertia & rubber-band bounce
- **Swipe navigation** with momentum
- **Double-tap zoom** (touch & mouse)
- **Keyboard navigation** — arrow keys, Space, Home/End, Esc
- **Mouse & touch** support
- **Reading progress** saved to localStorage
- **UI controls** — header, footer, page slider, zoom buttons
- **Help overlay** with context-aware instructions
- **Resume dialog** — "Continue from page X?"
- **Orientation detection** — auto spread/single on resize
- **Preloading** — nearby pages loaded eagerly
- **Insert pages** — ads, HTML, or image inserts at any position
- **Preview limit** — free-preview with purchase prompt
- **Google AdSense** integration
- **Scroll mode** — vertical continuous scroll
- **Fullscreen** — native + pseudo-fullscreen fallback
- **Status bar cover** — for mobile notch/safe-area
- **Share** — X (Twitter) share & link copy
- **Dark theme** — matches mobile light / desktop dark automatically
- **No dependencies** — pure vanilla JS & CSS, no build tools required
- **ES Module** — `import MangaViewer from './manga-viewer.js'`

---

## 🚀 Quick Start

### 1. Download or CDN

```html
<link rel="stylesheet" href="manga-viewer.css">
<script type="module">
  import MangaViewer from './manga-viewer.js';
</script>
```

### 2. Create a viewer

```html
<div id="viewer"></div>

<script type="module">
  import MangaViewer from './manga-viewer.js';

  const viewer = new MangaViewer({
    container: '#viewer',
    pages: [
      'pages/001.jpg',
      'pages/002.jpg',
      'pages/003.jpg',
      // ...
    ],
    direction: 'rtl',
    title: 'My Manga',
  });
</script>
```

That's it. The viewer takes over the container element with a full-screen reading experience.

---

## 📚 API Reference

### Constructor Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `container` | `string \| HTMLElement` | `'#viewer'` | CSS selector or DOM element |
| `pages` | `Array<string \| Object>` | `[]` | Image URLs or page objects (see below) |
| `direction` | `'rtl' \| 'ltr'` | `'rtl'` | Reading direction |
| `firstPageSingle` | `boolean` | `true` | Show first page alone in spread mode |
| `viewMode` | `'page' \| 'scroll'` | `'page'` | Page-flip or vertical scroll |
| `title` | `string` | `''` | Displayed in the header |
| `backUrl` | `string` | `'/'` | URL for the back button |
| `shareUrl` | `string` | `''` | URL used for share/copy (defaults to current page) |
| `bookmarkEnabled` | `boolean` | `true` | Enable bookmark UI and bookmark manager |
| `bookmarkApi` | `string \| null` | `null` | API endpoint used to sync bookmarks (falls back to localStorage) |
| `storageKey` | `string` | `'manga_progress'` | localStorage key for reading progress |
| `showHeader` | `boolean` | `true` | Show/hide header bar |
| `showFooter` | `boolean` | `true` | Show/hide footer bar |
| `loadingText` | `string` | `'Loading...'` | Loading screen text |
| `previewLimit` | `number \| null` | `null` | Number of free-preview pages |
| `purchaseUrl` | `string` | `''` | URL for purchase button |
| `purchasePrice` | `string` | `''` | Price label on purchase button |
| `adsense` | `{ client, slot }` | `null` | Append AdSense page at end |
| `onPageChange` | `Function` | `null` | `(currentPage, totalPages) => {}` |
| `onComplete` | `Function` | `null` | Called when last page is reached |

### Page Objects

Pages can be simple image URLs or objects:

```js
// Simple
'page001.jpg'

// Image with link
{ type: 'image', src: 'ad.jpg', linkUrl: 'https://...', linkTarget: '_blank', backgroundColor: '#000' }

// HTML insert
{ type: 'html', html: '<div>...</div>', backgroundColor: '#fff' }

// AdSense
{ type: 'adsense', client: 'ca-pub-XXX', slot: '123456' }
```

### Instance Properties

| Property | Type | Description |
|----------|------|-------------|
| `viewer.currentPage` | `number` | Current page number (1-indexed) |
| `viewer.totalPages` | `number` | Total page count |

### Instance Methods

| Method | Description |
|--------|-------------|
| `viewer.goToPage(n)` | Jump to page number (1-indexed) |
| `viewer.goToSlot(n)` | Jump to slot index (0-indexed) |
| `viewer.zoomIn()` | Zoom in by one step |
| `viewer.resetZoom()` | Reset zoom to 1× |
| `viewer.destroy()` | Remove viewer and clean up all event listeners |

---

## 🎨 Styling

The viewer uses `mv-` prefixed CSS classes to avoid conflicts. All styles are in `manga-viewer.css`. The default theme:

- **Desktop**: dark background with light controls
- **Mobile (≤768px)**: light background with dark controls

Override any class in your own stylesheet. Key classes:

- `.mv-container` — outer wrapper
- `.mv-header` / `.mv-footer` — top/bottom bars
- `.mv-page-slider` — range input (slider)
- `.mv-page-slot` — individual page frame

---

## 📱 Use in iOS / Android Apps

Manga Viewer works inside **WKWebView** (iOS) and **WebView** (Android), so you can embed it in native apps.

### Swift (WKWebView)

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
        webView.scrollView.isScrollEnabled = false // viewer handles its own scroll
        view.addSubview(webView)

        // Load from local bundle
        if let url = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "manga-viewer") {
            webView.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
        }

        // Or load from CDN / your server
        // webView.load(URLRequest(url: URL(string: "https://your-site.com/reader.html")!))
    }
}
```

### Minimal `reader.html` for the WebView

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <link rel="stylesheet" href="manga-viewer.css">
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
      title: 'My Manga',
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
      // or source={require('./assets/reader.html')} for local
      javaScriptEnabled={true}
      scrollEnabled={false}
      style={{ flex: 1 }}
    />
  );
}
```

### Capacitor / Cordova

Just `npm install @tokagemushi/manga-viewer` and use it in your web layer — it runs natively inside the Capacitor WebView with no extra config.

### Tips

- Set `scrollEnabled = false` on the WebView — the viewer handles its own touch gestures
- Use `viewport-fit=cover` for full safe-area coverage on notched devices
- To pass page data from native → WebView, use `evaluateJavaScript` (Swift) or `postMessage` (React Native)

---

## 🖥 Browser Support

| Browser | Support |
|---------|---------|
| Chrome / Edge | ✅ Latest |
| Firefox | ✅ Latest |
| Safari / iOS Safari | ✅ Latest |
| Samsung Internet | ✅ Latest |

Requires ES Module support (`<script type="module">`).

---

## 📄 License

MIT — Created by [tokagemushi](https://tokagemushi.jp)
