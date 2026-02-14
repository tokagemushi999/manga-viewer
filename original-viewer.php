<?php
/**
 * 漫画ビューアー v2.2.9
 * RTL: 1ページ目が右端、左タップ/左スワイプで次へ進む（左方向）
 * シークバー: RTLは右端が0%（1ページ目）、左端が100%（最終ページ）
 * * Update History:
 * v2.1: 拡大時に端で隣のページが見えるように修正
 * v2.1.1: 拡大時のページめくり感度（引っ掛かり）を調整
 * v2.1.2: バックヤード連携（挿入ページ判定）の記述修正
 * v2.2: Google AdSense広告挿入機能を追加
 * v2.2.1: UI表示切り替えをフェードアニメーションに対応（Tailwindとの競合解消）
 * v2.2.2: 拡大時の移動範囲（パンニング）計算を見開き対応＆縦方向の余白調整
 * v2.2.3: 拡大移動時の慣性スクロール（イナーシャ）を追加
 * v2.2.4: 拡大時の慣性を滑らかに改善、縦方向の余白を大幅拡大（上下端が中央まで移動可能）
 * v2.2.5: 慣性スクロールを物理ベースの指数減衰に変更（より自然な動き）
 * v2.2.6: 端での縦スワイプ時に慣性を維持、横スワイプのみページめくりモードに入るよう改善
 * v2.2.7: 拡大時の端でラバーバンド効果（引っ張り）とバウンスバック（跳ね返り）を追加
 * v2.2.8: バウンドを控えめに調整、横方向にも余白（画面幅20%）を追加
 * v2.2.9: バウンスバックは余白範囲内に戻す、横余白8%に縮小、バウンド弱め
 */

// ==========================================
//  Google AdSense 設定
// ==========================================
// 広告を表示する場合は、以下のIDを設定してください
$adSenseClient = ''; // 例: ca-pub-1234567890123456
$adSenseSlot   = ''; // 例: 1234567890
// ==========================================

// キャッシュを無効化
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");

require_once 'includes/db.php';
require_once 'includes/site-settings.php';
require_once 'includes/seo-tags.php';

// 会員認証機能を読み込み（セッション開始含む）
require_once __DIR__ . '/includes/member-auth.php';

$db = getDB();

$workId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if (!$workId) {
    header('Location: index.php');
    exit;
}

$stmt = $db->prepare("SELECT w.*, c.name as creator_name, c.id as creator_id 
                      FROM works w 
                      LEFT JOIN creators c ON w.creator_id = c.id 
                      WHERE w.id = ? AND w.is_active = 1");
$stmt->execute([$workId]);
$work = $stmt->fetch();

if (!$work) {
    header('Location: index.php');
    exit;
}

// 試し読み制限チェック
$previewLimit = null;
$isPurchased = false;
$productInfo = null;

// 商品情報を取得（related_work_idから逆引き）
try {
    $stmt = $db->prepare("SELECT id, name, price, preview_pages FROM products WHERE related_work_id = ? AND is_published = 1 LIMIT 1");
    $stmt->execute([$workId]);
    $productInfo = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($productInfo) {
        // 商品のpreview_pagesを優先、なければ作品のpreview_pages、それもなければ3
        $previewLimit = (int)($productInfo['preview_pages'] ?? $work['preview_pages'] ?? 3);
        
        // ログイン中なら購入済みかチェック（実際のDBで確認）
        if (function_exists('isLoggedIn') && isLoggedIn() && isset($_SESSION['member_id'])) {
            $stmt = $db->prepare("SELECT id FROM member_bookshelf WHERE member_id = ? AND product_id = ?");
            $stmt->execute([$_SESSION['member_id'], $productInfo['id']]);
            $isPurchased = (bool)$stmt->fetch();
        }
    }
} catch (PDOException $e) {
    // productsテーブルがない場合は制限なし
}

// 商品情報がなくても、本棚に該当作品があれば購入済み
if (!$isPurchased && function_exists('isLoggedIn') && isLoggedIn() && isset($_SESSION['member_id'])) {
    try {
        $stmt = $db->prepare("
            SELECT mb.id FROM member_bookshelf mb
            JOIN products p ON mb.product_id = p.id
            WHERE mb.member_id = ? AND p.related_work_id = ?
        ");
        $stmt->execute([$_SESSION['member_id'], $workId]);
        if ($stmt->fetch()) {
            $isPurchased = true;
        }
    } catch (PDOException $e) {
        // エラー時は無視
    }
}

// 購入済みなら制限解除
if ($isPurchased) {
    $previewLimit = null;
}

$stmt = $db->prepare("SELECT * FROM work_pages WHERE work_id = ? ORDER BY page_number ASC");
$stmt->execute([$workId]);
$pages = $stmt->fetchAll();

if (empty($pages) && !empty($work['image'])) {
    $pages = [['id' => 0, 'page_number' => 1, 'image' => $work['image']]];
}

// 総ページ数を保持（制限前）
$totalPageCount = count($pages);

// 試し読み制限フラグ
$hasPreviewLimit = ($previewLimit !== null && $previewLimit > 0 && !$isPurchased);

// 試し読み制限がある場合、サーバー側でページデータを制限し、購入ページを追加
if ($hasPreviewLimit) {
    $pages = array_slice($pages, 0, $previewLimit);
    
    // 購入案内ページを追加
    $pages[] = [
        'id' => 'purchase_page',
        'page_number' => $previewLimit + 1,
        'image' => null,
        'is_purchase_page' => true
    ];
}

// 挿入ページを取得（テーブルが存在する場合のみ）
$insertPages = [];
try {
    $stmt = $db->query("SHOW TABLES LIKE 'work_insert_pages'");
    if ($stmt->rowCount() > 0) {
        $stmt = $db->prepare("SELECT * FROM work_insert_pages WHERE work_id = ? AND is_active = 1 ORDER BY insert_after ASC, sort_order ASC");
        $stmt->execute([$workId]);
        $insertPages = $stmt->fetchAll();
    }
} catch (Exception $e) {
    // テーブルが存在しない場合は無視
}

// 挿入ページをマンガページに統合
if (!empty($insertPages)) {
    $mergedPages = [];
    $pageIndex = 0;
    $originalPageNum = 0;
    
    // insert_after = 0 の挿入ページ（最初に表示）
    foreach ($insertPages as $ip) {
        if ((int)$ip['insert_after'] === 0) {
            $mergedPages[] = [
                'id' => 'insert_' . $ip['id'],
                'page_number' => ++$pageIndex,
                'is_insert' => true,
                'page_type' => $ip['page_type'],
                'image' => $ip['image'],
                'html_content' => $ip['html_content'],
                'link_url' => $ip['link_url'],
                'link_target' => $ip['link_target'] ?? '_blank',
                'background_color' => $ip['background_color'] ?? '#000000'
            ];
        }
    }
    
    // 通常のページと挿入ページを統合
    foreach ($pages as $page) {
        $originalPageNum++;
        $page['page_number'] = ++$pageIndex;
        $page['is_insert'] = false;
        $mergedPages[] = $page;
        
        // このページの後に挿入するページを追加
        foreach ($insertPages as $ip) {
            if ((int)$ip['insert_after'] === $originalPageNum) {
                $mergedPages[] = [
                    'id' => 'insert_' . $ip['id'],
                    'page_number' => ++$pageIndex,
                    'is_insert' => true,
                    'page_type' => $ip['page_type'],
                    'image' => $ip['image'],
                    'html_content' => $ip['html_content'],
                    'link_url' => $ip['link_url'],
                    'link_target' => $ip['link_target'] ?? '_blank',
                    'background_color' => $ip['background_color'] ?? '#000000'
                ];
            }
        }
    }
    
    // insert_after = -1 の挿入ページ（最後に表示）
    foreach ($insertPages as $ip) {
        if ((int)$ip['insert_after'] === -1) {
            $mergedPages[] = [
                'id' => 'insert_' . $ip['id'],
                'page_number' => ++$pageIndex,
                'is_insert' => true,
                'page_type' => $ip['page_type'],
                'image' => $ip['image'],
                'html_content' => $ip['html_content'],
                'link_url' => $ip['link_url'],
                'link_target' => $ip['link_target'] ?? '_blank',
                'background_color' => $ip['background_color'] ?? '#000000'
            ];
        }
    }
    
    $pages = $mergedPages;
}

// AdSense広告を最後に追加
if (!empty($adSenseClient) && !empty($adSenseSlot)) {
    // ページ番号をインクリメントするか、最後のページの次として扱う
    $nextPageNum = empty($pages) ? 1 : ($pages[count($pages) - 1]['page_number'] + 1);
    
    $pages[] = [
        'id' => 'adsense_end',
        'page_number' => $nextPageNum,
        'is_insert' => true,
        'page_type' => 'adsense', // 特別なタイプ
        'image' => '',
        'ad_client' => $adSenseClient,
        'ad_slot' => $adSenseSlot,
        'background_color' => '#1a1a1a' // 広告ページの背景色（ダークモードに合わせて暗めに設定）
    ];
}

$totalPages = count($pages);
$readingDirection = $work['reading_direction'] ?? 'rtl';
$viewMode = $work['view_mode'] ?? 'page';
$firstPageSingle = isset($work['first_page_single']) ? (int)$work['first_page_single'] : 1;
$pagesJson = json_encode($pages, JSON_UNESCAPED_UNICODE);
$hasPreviewLimitJs = isset($hasPreviewLimit) && $hasPreviewLimit ? 'true' : 'false';

// 埋め込みモード判定
$isEmbed = isset($_GET['embed']) && $_GET['embed'] == '1';
$allowEmbed = isset($work['allow_embed']) ? (int)$work['allow_embed'] : 1;
$embedShowHeader = isset($work['embed_show_header']) ? (int)$work['embed_show_header'] : 1;
$embedShowFooter = isset($work['embed_show_footer']) ? (int)$work['embed_show_footer'] : 1;

if ($isEmbed && !$allowEmbed) {
    header('HTTP/1.1 403 Forbidden');
    echo 'この作品の埋め込みは許可されていません';
    exit;
}

$siteName = getSiteSetting($db, 'site_name', 'ぷれぐら！');
$siteUrl = getSiteSetting($db, 'site_url', 'https://' . ($_SERVER['HTTP_HOST'] ?? 'localhost'));

$backUrl = '/';
if ($work['creator_id']) {
    $creatorStmt = $db->prepare("SELECT slug FROM creators WHERE id = ?");
    $creatorStmt->execute([$work['creator_id']]);
    $creatorSlug = $creatorStmt->fetchColumn();
    if ($creatorSlug) {
        $backUrl = '/creator/' . $creatorSlug;
    } else {
        $backUrl = '/creator.php?id=' . $work['creator_id'];
    }
}

// リファラーがあれば、同じホストからの場合はそのまま使用
$referer = $_SERVER['HTTP_REFERER'] ?? '';
if (!empty($referer)) {
    $host = $_SERVER['HTTP_HOST'] ?? '';
    // 同じホストからのリファラーなら全て許可（ストア、クリエイター、インデックス等）
    if (strpos($referer, $host) !== false) {
        $backUrl = $referer;
    }
}

// OGP用のURL生成
$baseUrl = getBaseUrl();
$mangaUrl = $baseUrl . '/manga/' . $workId;
// OGP画像（WebPはLINE/Twitter等で認識されないため、JPG/PNG版を優先）
$ogImage = getOgImageUrl($work['image'] ?? '', $baseUrl);
$ogDescription = !empty($work['description']) 
    ? mb_substr(strip_tags($work['description']), 0, 100) 
    : $siteName . 'の漫画作品';
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="theme-color" content="#000000">
    <title><?= htmlspecialchars($work['title']) ?> - <?= htmlspecialchars($siteName) ?></title>
    <meta name="description" content="<?= htmlspecialchars($ogDescription) ?>">
    
    <!-- OGP (Open Graph Protocol) -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="<?= htmlspecialchars($work['title']) ?>">
    <meta property="og:description" content="<?= htmlspecialchars($ogDescription) ?>">
    <meta property="og:url" content="<?= htmlspecialchars($mangaUrl) ?>">
    <meta property="og:image" content="<?= htmlspecialchars($ogImage) ?>">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="<?= htmlspecialchars($siteName) ?>">
    <meta property="og:locale" content="ja_JP">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?= htmlspecialchars($work['title']) ?>">
    <meta name="twitter:description" content="<?= htmlspecialchars($ogDescription) ?>">
    <meta name="twitter:image" content="<?= htmlspecialchars($ogImage) ?>">
    
    <?php outputSeoTags($db); ?>
    
    <link rel="manifest" href="/manifest.json">
    <?php $faviconInfo = getFaviconInfo($db); ?>
    <link rel="icon" href="<?= htmlspecialchars($faviconInfo['path']) ?>" type="<?= htmlspecialchars($faviconInfo['type']) ?>">
    <link rel="apple-touch-icon" href="<?= htmlspecialchars($faviconInfo['path']) ?>">
    
    <!-- Tailwind CSS（同期読み込み - レイアウト崩れ防止） -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"></noscript>
    <link href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
    <noscript><link href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700&display=swap" rel="stylesheet"></noscript>
    <?php if (!empty($adSenseClient)): ?>
    <!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=<?= htmlspecialchars($adSenseClient) ?>" crossorigin="anonymous"></script>
    <?php endif; ?>
    <style>
        @media (max-width: 768px) {
            .loading-screen { background: #fff; }
            .loading-spinner {
                border-color: rgba(100, 100, 100, 0.2);
                border-top-color: #666;
            }
            .loading-text { color: rgba(0, 0, 0, 0.5); }
        }
        
        .loading-screen.fade-out {
            opacity: 0;
            visibility: hidden;
        }
        
        .loading-spinner {
            width: 48px;
            height: 48px;
            border: 3px solid rgba(250, 204, 21, 0.2);
            border-top-color: #facc15;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }
        
        .loading-text {
            margin-top: 16px;
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .viewer-container {
            position: fixed;
            inset: 0;
            height: 100dvh;
            background: #000;
        }
        
        @media (max-width: 768px) {
            .viewer-container { background: #fff; }
        }
        
        .viewer-container.pseudo-fullscreen {
            position: fixed;
            inset: 0;
            width: 100vw;
            height: 100vh;
            height: 100dvh;
            z-index: 9999;
        }
        
        body.pseudo-fullscreen-body {
            overflow: hidden;
        }
        
        .status-bar-cover {
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
        .status-bar-cover.visible { opacity: 1; }
        @media (min-width: 769px) {
            .status-bar-cover { display: none; }
        }
        
        .viewer-header {
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
            .viewer-header {
                background: rgba(245, 245, 245, 0.98);
            }
            .viewer-header h1 { color: #333 !important; }
        }
        
        /* 修正: Tailwindのhiddenと競合しないように ui-hidden クラスを使用 */
        .viewer-header.ui-hidden {
            opacity: 0;
            pointer-events: none;
        }
        /* 埋め込みなどで完全に消す場合用 */
        .viewer-header.hidden {
            display: none !important;
        }
        
        .viewer-footer {
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
            .viewer-footer {
                background: rgba(245, 245, 245, 0.98);
            }
            .viewer-footer .text-white,
            .viewer-footer span { color: #333 !important; }
        }
        
        /* 修正: ui-hiddenを使用 */
        .viewer-footer.ui-hidden {
            opacity: 0;
            pointer-events: none;
        }
        .viewer-footer.hidden {
            display: none !important;
        }
        
        .viewer-main {
            position: absolute;
            inset: 0;
            overflow: hidden;
            background: #000;
        }
        
        @media (max-width: 768px) {
            .viewer-main { background: #fff; }
        }
        
        .viewer-main.scroll-mode {
            overflow-y: auto;
            overflow-x: hidden;
            -webkit-overflow-scrolling: touch;
        }
        
        .slot-track {
            display: flex;
            width: 100%;
            height: 100%;
            transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .slot-track.no-transition {
            transition: none;
        }
        
        .slot-track.scroll-track {
            flex-direction: column;
            height: auto;
            transition: none;
        }
        
        .page-slot {
            flex: 0 0 100%;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            position: relative;
        }
        
        /* PWA standaloneモードで少し上に調整 */
        @media all and (display-mode: standalone) {
            .page-slot {
                /* safe-area分を考慮して少し上寄りに */
                padding-bottom: env(safe-area-inset-top, 0px);
            }
        }
        
        .scroll-track .page-slot {
            flex: 0 0 auto;
            height: auto;
            min-height: auto;
        }
        
        .page-slot .zoom-container {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            transform-origin: center center;
            touch-action: none;
            transition: transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .page-slot .zoom-container.no-transition {
            transition: none !important;
        }
        
        .page-slot img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            -webkit-user-drag: none;
            pointer-events: auto;
            display: block;
        }
        
        .scroll-track .page-slot img {
            width: 100%;
            height: auto;
            max-height: none;
        }
        
        .page-slot.spread-slot {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0;
        }
        
        .page-slot.spread-slot .zoom-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0;
        }
        
        .page-slot.spread-slot img {
            height: 100%;
            width: auto;
            max-width: 50%;
            max-height: 100%;
        }
        
        .page-slot.spread-slot.rtl-slot .zoom-container {
            flex-direction: row-reverse;
        }
        
        .tap-area {
            position: absolute;
            top: 0;
            bottom: 0;
            z-index: 10;
        }
        
        .tap-area.left { left: 0; width: 30%; }
        .tap-area.right { right: 0; width: 30%; }
        .tap-area.center { left: 30%; width: 40%; }
        
        .page-slider {
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
            .page-slider { background: rgba(0, 0, 0, 0.15); }
        }
        
        .page-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 18px;
            height: 18px;
            background: #facc15;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        
        .page-slider::-moz-range-thumb {
            width: 18px;
            height: 18px;
            background: #facc15;
            border-radius: 50%;
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        
        .page-slider.rtl-slider {
            direction: rtl;
        }
        
        .zoom-controls {
            position: fixed;
            bottom: 100px;
            right: 16px;
            z-index: 60;
            display: none;
            flex-direction: column;
            gap: 8px;
            transition: opacity 0.3s ease;
        }
        
        /* 修正: ui-hiddenを使用 */
        .zoom-controls.ui-hidden {
            opacity: 0;
            pointer-events: none;
        }
        .zoom-controls.hidden {
            display: none !important;
        }
        
        .zoom-btn {
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
        }
        
        .zoom-btn:hover {
            background: rgba(250, 204, 21, 0.8);
            color: black;
        }
        
        .zoom-btn:disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }
        
        .zoom-btn:disabled:hover {
            background: rgba(0, 0, 0, 0.6);
            color: white;
        }
        
        .resume-dialog {
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
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .resume-card {
            background: white;
            border-radius: 24px;
            padding: 32px;
            max-width: 340px;
            width: 100%;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            animation: slideUp 0.3s ease;
        }
        
        @keyframes slideUp {
            from { 
                opacity: 0;
                transform: translateY(20px);
            }
            to { 
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .resume-icon {
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, #22c55e, #16a34a);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
        }
        
        .resume-icon i {
            font-size: 28px;
            color: #fff;
        }
        
        .resume-title {
            color: #1f2937;
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 8px;
        }
        
        .resume-subtitle {
            color: #6b7280;
            font-size: 14px;
            margin-bottom: 24px;
        }
        
        .resume-buttons {
            display: flex;
            gap: 12px;
        }
        
        .resume-btn {
            flex: 1;
            padding: 14px 16px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 15px;
            cursor: pointer;
            transition: all 0.2s ease;
            border: none;
        }
        
        .resume-btn.primary {
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: #fff;
        }
        
        .resume-btn.primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(34, 197, 94, 0.4);
        }
        
        .resume-btn.secondary {
            background: #f3f4f6;
            color: #374151;
            border: 1px solid #e5e7eb;
        }
        
        .resume-btn.secondary:hover {
            background: #e5e7eb;
        }
        
        .help-overlay {
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
        
        .help-card {
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
        
        .help-header {
            padding: 20px 24px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .help-title {
            color: #facc15;
            font-size: 20px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .help-close {
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
        
        .help-close:hover {
            background: rgba(255, 255, 255, 0.2);
            color: #fff;
        }
        
        .help-content {
            padding: 20px 24px;
        }
        
        .help-section {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 12px;
        }
        
        .help-section:last-child {
            margin-bottom: 0;
        }
        
        .help-section-title {
            color: #facc15;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .help-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 10px;
        }
        
        .help-item:last-child {
            margin-bottom: 0;
        }
        
        .help-item-icon {
            width: 32px;
            height: 32px;
            background: rgba(250, 204, 21, 0.15);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        
        .help-item-icon i {
            color: #facc15;
            font-size: 14px;
        }
        
        .help-item-text {
            flex: 1;
        }
        
        .help-item-label {
            color: #fff;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 2px;
        }
        
        .help-item-desc {
            color: rgba(255, 255, 255, 0.5);
            font-size: 12px;
        }
        
        .header-btn {
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
        }
        
        .header-btn:hover {
            background: rgba(255, 255, 255, 0.15);
        }
        
        @media (max-width: 768px) {
            .header-btn {
                background: rgba(0, 0, 0, 0.06);
                color: #333;
            }
            .header-btn:hover { background: rgba(0, 0, 0, 0.1); }
            .header-btn svg { fill: #333; }
        }
        
        @media (min-width: 769px) {
            .zoom-controls {
                display: flex;
            }
            
            .mobile-only {
                display: none !important;
            }
        }
        
        @media (max-width: 768px) {
            .zoom-controls {
                display: none !important;
            }
            
            .pc-only {
                display: none !important;
            }
            
            .viewer-header {
                padding: 8px 12px;
                padding-top: max(8px, env(safe-area-inset-top));
            }
            
            .header-btn {
                width: 32px;
                height: 32px;
                font-size: 13px;
            }
            
            .viewer-footer {
                padding: 10px 16px 16px 16px;
                padding-bottom: max(16px, calc(env(safe-area-inset-bottom) + 8px));
            }
            
            .page-slider {
                height: 8px;
                margin-top: 4px;
            }
            
            .page-slider::-webkit-slider-thumb {
                width: 22px;
                height: 22px;
            }
            
            .page-slider::-moz-range-thumb {
                width: 22px;
                height: 22px;
            }
            
            .help-card {
                max-height: 70vh;
            }
            
            .viewer-header h1 {
                font-size: 13px;
            }
            
            .viewer-footer .text-xs {
                font-size: 11px;
            }
        }
        
        .toast {
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(30, 30, 30, 0.95);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            color: #fff;
            padding: 12px 20px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 500;
            z-index: 300;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            animation: toastIn 0.3s ease;
        }
        
        .toast.fade-out {
            animation: toastOut 0.3s ease forwards;
        }
        
        @keyframes toastIn {
            from {
                opacity: 0;
                transform: translate(-50%, 20px);
            }
            to {
                opacity: 1;
                transform: translate(-50%, 0);
            }
        }
        
        @keyframes toastOut {
            from {
                opacity: 1;
                transform: translate(-50%, 0);
            }
            to {
                opacity: 0;
                transform: translate(-50%, 20px);
            }
        }
    </style>
</head>
<body>
    <div class="loading-screen" id="loading-screen">
        <div class="loading-spinner"></div>
        <div class="loading-text">読み込み中...</div>
    </div>
    
    <div class="status-bar-cover" id="status-bar-cover"></div>
    
    <div class="viewer-container" id="viewer">
        <div class="viewer-main" id="viewer-main">
            <div class="slot-track" id="slot-track"></div>
            
            <div class="tap-area left" id="tap-left"></div>
            <div class="tap-area center" id="tap-center"></div>
            <div class="tap-area right" id="tap-right"></div>
        </div>
        
        <header class="viewer-header<?= $isEmbed && !$embedShowHeader ? ' hidden' : '' ?>" id="header">
            <?php if ($isEmbed): ?>
            <button onclick="toggleFullscreen()" class="header-btn pc-only" title="全画面表示">
                <i class="fas fa-expand" id="fullscreen-icon"></i>
            </button>
            <h1 class="text-white font-bold text-sm truncate flex-1 text-center mx-3">
                <?= htmlspecialchars($work['title']) ?>
            </h1>
            <a href="<?= htmlspecialchars($siteUrl) ?>/manga/<?= $workId ?>" target="_blank" class="header-btn" title="サイトで開く">
                <i class="fas fa-external-link-alt text-sm"></i>
            </a>
            <?php else: ?>
            <a href="<?= htmlspecialchars($backUrl) ?>" class="header-btn" title="戻る">
                <i class="fas fa-chevron-left"></i>
            </a>
            <h1 class="text-white font-bold text-sm truncate flex-1 text-center mx-3">
                <?= htmlspecialchars($work['title']) ?>
            </h1>
            <div class="flex items-center gap-2">
                <?php if ($isPurchased): ?>
                <button class="header-btn" onclick="toggleBookmarkPanel()" title="しおり">
                    <i class="fas fa-bookmark text-sm"></i>
                </button>
                <?php endif; ?>
                <button class="header-btn pc-only" onclick="toggleFullscreen()" title="全画面表示">
                    <i class="fas fa-expand" id="fullscreen-icon"></i>
                </button>
                <button class="header-btn" onclick="shareToX()" title="Xでシェア">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </button>
                <button class="header-btn" onclick="copyLink()" title="リンクをコピー">
                    <i class="fas fa-link text-sm"></i>
                </button>
                <button class="header-btn" onclick="showHelp()" title="ヘルプ">
                    <i class="fas fa-question text-sm"></i>
                </button>
            </div>
            <?php endif; ?>
        </header>
        
        <footer class="viewer-footer<?= $isEmbed && !$embedShowFooter ? ' hidden' : '' ?>" id="footer">
            <div class="flex items-center justify-between mb-1 text-white text-xs">
                <span class="opacity-70"><span id="current-page">1</span> / <?= $totalPages ?></span>
                <span class="opacity-70" id="progress">0%</span>
            </div>
            <input type="range" 
                   class="page-slider <?= $readingDirection === 'rtl' ? 'rtl-slider' : '' ?>" 
                   id="page-slider" 
                   min="1" 
                   max="<?= $totalPages ?>" 
                   value="1">
        </footer>
        
        <div class="zoom-controls" id="zoom-controls">
            <button class="zoom-btn" id="zoom-in-btn" onclick="zoomIn()" title="拡大">
                <i class="fas fa-search-plus"></i>
            </button>
            <button class="zoom-btn" id="zoom-reset-btn" onclick="resetZoom()" title="原寸に戻す" disabled>
                <i class="fas fa-compress-arrows-alt"></i>
            </button>
        </div>
        
        <!-- しおりパネル -->
        <?php if ($isPurchased): ?>
        <div id="bookmark-panel" class="bookmark-panel hidden">
            <div class="bookmark-panel-header">
                <h3><i class="fas fa-bookmark"></i> しおり</h3>
                <button onclick="closeBookmarkPanel()" class="bookmark-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="bookmark-panel-content">
                <div class="bookmark-add">
                    <button onclick="addBookmark()" class="bookmark-add-btn">
                        <i class="fas fa-plus"></i> 現在のページにしおりを追加
                    </button>
                </div>
                <div id="bookmark-list" class="bookmark-list">
                    <div class="bookmark-empty">しおりはありません</div>
                </div>
            </div>
        </div>
        <style>
            .bookmark-panel {
                position: fixed;
                top: 60px;
                right: 10px;
                width: 280px;
                max-height: calc(100vh - 120px);
                background: rgba(30, 30, 30, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 12px;
                z-index: 1001;
                box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                overflow: hidden;
                transition: opacity 0.2s, transform 0.2s;
            }
            .bookmark-panel.hidden {
                opacity: 0;
                transform: translateY(-10px);
                pointer-events: none;
            }
            .bookmark-panel-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 16px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            .bookmark-panel-header h3 {
                color: white;
                font-size: 14px;
                font-weight: bold;
                margin: 0;
            }
            .bookmark-close {
                background: none;
                border: none;
                color: rgba(255,255,255,0.6);
                cursor: pointer;
                padding: 4px 8px;
            }
            .bookmark-close:hover { color: white; }
            .bookmark-panel-content {
                max-height: calc(100vh - 200px);
                overflow-y: auto;
            }
            .bookmark-add {
                padding: 12px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            .bookmark-add-btn {
                width: 100%;
                padding: 10px 16px;
                background: linear-gradient(135deg, #FF6B35, #ff8c5a);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 13px;
                font-weight: bold;
                cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            .bookmark-add-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(255,107,53,0.4);
            }
            .bookmark-list {
                padding: 8px;
            }
            .bookmark-empty {
                text-align: center;
                color: rgba(255,255,255,0.4);
                padding: 20px;
                font-size: 13px;
            }
            .bookmark-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px 12px;
                background: rgba(255,255,255,0.05);
                border-radius: 8px;
                margin-bottom: 6px;
                cursor: pointer;
                transition: background 0.2s;
            }
            .bookmark-item:hover {
                background: rgba(255,255,255,0.1);
            }
            .bookmark-item-page {
                width: 36px;
                height: 36px;
                background: rgba(255,107,53,0.2);
                color: #FF6B35;
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 12px;
                flex-shrink: 0;
            }
            .bookmark-item-info {
                flex: 1;
                min-width: 0;
            }
            .bookmark-item-title {
                color: white;
                font-size: 13px;
                font-weight: bold;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .bookmark-item-date {
                color: rgba(255,255,255,0.4);
                font-size: 11px;
            }
            .bookmark-item-delete {
                background: none;
                border: none;
                color: rgba(255,255,255,0.3);
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
            }
            .bookmark-item-delete:hover {
                color: #ff4444;
                background: rgba(255,68,68,0.1);
            }
            @media (max-width: 640px) {
                .bookmark-panel {
                    width: calc(100% - 20px);
                    right: 10px;
                    left: 10px;
                }
            }
        </style>
        <?php endif; ?>
    </div>
    
    <script>
        // ========== 設定 ==========
        const pages = <?= $pagesJson ?>;
        const totalPages = <?= $totalPages ?>;
        const readingDirection = '<?= $readingDirection ?>';
        const viewMode = '<?= $viewMode ?>';
        const firstPageSingle = <?= $firstPageSingle ? 'true' : 'false' ?>;
        const STORAGE_KEY = 'manga_reading_progress_<?= $workId ?>';
        
        // 試し読み制限
        const previewLimit = <?= $previewLimit !== null ? $previewLimit : 'null' ?>;
        const isPurchased = <?= $isPurchased ? 'true' : 'false' ?>;
        const productInfo = <?= $productInfo ? json_encode($productInfo, JSON_UNESCAPED_UNICODE) : 'null' ?>;
        const totalPageCount = <?= $totalPageCount ?>;
        const hasPreviewLimit = <?= $hasPreviewLimitJs ?>;
        const refererUrl = '<?= addslashes($_SERVER['HTTP_REFERER'] ?? '') ?>';
        
        // 戻り先URL（リファラーがあればそこへ、なければ商品ページ）
        function getBackUrl() {
            if (refererUrl && refererUrl.length > 0) {
                return refererUrl;
            }
            if (productInfo) {
                return '/store/product.php?id=' + productInfo.id;
            }
            return '/';
        }
        
        // ========== 状態変数 ==========
        let currentSlotIndex = 0;
        let slots = [];
        let spreadMode = false;
        let uiVisible = true;
        let containerWidth = 0;
        
        // ドラッグ/スワイプ
        let isDragging = false;
        let startX = 0;
        let currentX = 0;
        let offsetX = 0;
        let dragStartTime = 0;
        
        // ズーム
        let currentZoom = 1;
        const MIN_ZOOM = 1;
        const MAX_ZOOM = 3;
        const ZOOM_STEP = 0.5;
        let zoomPanX = 0;
        let zoomPanY = 0;
        let isZoomPanning = false;
        let zoomPanStartX = 0;
        let zoomPanStartY = 0;
        let zoomPanOffsetX = 0;
        let zoomPanOffsetY = 0;
        
        // 慣性スクロール用
        let velocityX = 0;
        let velocityY = 0;
        let lastMoveTime = 0;
        let lastMoveX = 0;
        let lastMoveY = 0;
        let momentumID = null;
        // 速度履歴（平滑化用）
        let velocityHistory = [];
        
        // ピンチズーム
        let initialPinchDistance = 0;
        let initialPinchZoom = 1;
        let pinchCenterX = 0;
        let pinchCenterY = 0;
        let zoomPanStartXBackup = 0;
        let zoomPanStartYBackup = 0;
        
        // ダブルタップ
        const DOUBLE_TAP_DELAY = 300;
        let lastTapTime = 0;
        let pendingTapAction = null;
        
        // 端スワイプ（拡大時の隣ページ表示）
        let edgeSwipeStartX = 0;
        let edgeOverscroll = 0;     // 端に達してからのスワイプ量
        
        // デバイス判定
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const isTouchDevice = 'ontouchstart' in window;
        
        // ========== DOM要素 ==========
        const viewerMain = document.getElementById('viewer-main');
        const slotTrack = document.getElementById('slot-track');
        const loadingScreen = document.getElementById('loading-screen');
        const slider = document.getElementById('page-slider');
        const currentPageEl = document.getElementById('current-page');
        const progressEl = document.getElementById('progress');
        const header = document.getElementById('header');
        const footer = document.getElementById('footer');
        const tapLeft = document.getElementById('tap-left');
        const tapCenter = document.getElementById('tap-center');
        const tapRight = document.getElementById('tap-right');
        const statusBarCover = document.getElementById('status-bar-cover');
        const zoomControls = document.getElementById('zoom-controls');
        const zoomInBtn = document.getElementById('zoom-in-btn');
        const zoomResetBtn = document.getElementById('zoom-reset-btn');
        
        // ========== 初期化 ==========
        function showResumeDialog(savedProgress) {
            const pageNum = savedProgress.pageIndex + 1;
            const dialog = document.createElement('div');
            dialog.className = 'resume-dialog';
            dialog.id = 'resume-dialog';
            dialog.innerHTML = `
                <div class="resume-card">
                    <div class="resume-icon">
                        <i class="fas fa-bookmark"></i>
                    </div>
                    <div class="resume-title">続きから読みますか？</div>
                    <div class="resume-subtitle">${pageNum}ページ目から再開できます</div>
                    <div class="resume-buttons">
                        <button class="resume-btn secondary" id="start-from-beginning-btn">最初から</button>
                        <button class="resume-btn primary" id="resume-from-saved-btn" data-page-index="${savedProgress.pageIndex}">
                            <i class="fas fa-play" style="margin-right: 8px;"></i>続きから
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(dialog);
            
            document.getElementById('start-from-beginning-btn').addEventListener('click', startFromBeginning);
            document.getElementById('resume-from-saved-btn').addEventListener('click', function() {
                const pageIndex = parseInt(this.getAttribute('data-page-index'));
                resumeFromSaved(pageIndex);
            });
        }
        
        function resumeFromSaved(pageIndex) {
            const dialog = document.getElementById('resume-dialog');
            if (dialog) {
                dialog.remove();
            }
            setTimeout(() => goToPageByIndex(pageIndex), 100);
        }
        
        function startFromBeginning() {
            const dialog = document.getElementById('resume-dialog');
            if (dialog) {
                dialog.remove();
            }
            try {
                localStorage.removeItem(STORAGE_KEY);
            } catch (e) {
                console.error('Error removing reading progress:', e);
            }
        }
        
        async function init() {
            try {
                containerWidth = viewerMain.offsetWidth;
                checkOrientation();
                
                if (viewMode === 'scroll') {
                    viewerMain.classList.add('scroll-mode');
                    slotTrack.classList.add('scroll-track');
                    if (tapLeft) tapLeft.style.display = 'none';
                    if (tapRight) tapRight.style.display = 'none';
                    if (zoomControls) zoomControls.style.display = 'none';
                }
                
                buildSlots();
                renderSlots();
                updateTrackPosition(false);
                updateUI();
                
                setupEvents();
                
                // 進捗を読み込み（サーバー優先）
                let savedProgress = null;
                if (isPurchased) {
                    savedProgress = await loadServerProgress();
                }
                if (!savedProgress) {
                    savedProgress = loadReadingProgress();
                }
                if (savedProgress && savedProgress.pageIndex > 0) {
                    showResumeDialog(savedProgress);
                }
                
            } catch (error) {
                console.error('Init error:', error);
            } finally {
                setTimeout(() => {
                    const loadingScreen = document.getElementById('loading-screen');
                    if (loadingScreen) {
                        loadingScreen.classList.add('fade-out');
                    }
                }, 300);
            }
        }
        
        function checkOrientation() {
            if (viewMode === 'scroll') {
                spreadMode = false;
                return;
            }
            
            const isLandscape = window.innerWidth > window.innerHeight;
            const wasSpread = spreadMode;
            spreadMode = isLandscape;
            
            if (wasSpread !== spreadMode && slots.length > 0) {
                const currentPageIdx = getCurrentPageIndex();
                buildSlots();
                renderSlots();
                currentSlotIndex = findSlotByPageIndex(currentPageIdx);
                updateTrackPosition(false);
                updateUI();
            }
        }
        
        function onResize() {
            containerWidth = viewerMain.offsetWidth;
            checkOrientation();
            updateTrackPosition(false);
        }
        
        function buildSlots() {
            slots = [];
            
            if (!spreadMode) {
                pages.forEach((p, i) => {
                    slots.push({ pages: [i], spread: false });
                });
            } else {
                let i = 0;
                if (firstPageSingle && pages.length > 0) {
                    slots.push({ pages: [0], spread: false });
                    i = 1;
                }
                while (i < pages.length) {
                    // AdSenseページは常に見開きにしない（単独ページ）
                    if (pages[i].page_type === 'adsense') {
                        slots.push({ pages: [i], spread: false });
                        i++;
                        continue;
                    }
                    
                    if (i + 1 < pages.length && pages[i+1].page_type !== 'adsense') {
                        slots.push({ pages: [i, i + 1], spread: true });
                        i += 2;
                    } else {
                        slots.push({ pages: [i], spread: false });
                        i++;
                    }
                }
            }
        }
        
        function loadReadingProgress() {
            // まずローカルストレージから読み込み（フォールバック）
            try {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved) {
                    const data = JSON.parse(saved);
                    if (Date.now() - data.timestamp < 30 * 24 * 60 * 60 * 1000) { // 30日に延長
                        return data;
                    }
                }
            } catch (e) {
                console.error('Error loading reading progress:', e);
            }
            return null;
        }
        
        // サーバーから進捗を読み込み
        async function loadServerProgress() {
            if (!isPurchased) return null;
            
            try {
                const response = await fetch(`/api/save-reading-progress.php?work_id=<?= $workId ?>`);
                const data = await response.json();
                if (data.success && data.page) {
                    return {
                        pageIndex: data.page - 1, // 0-indexed
                        serverSaved: true
                    };
                }
            } catch (e) {
                console.error('Error loading server progress:', e);
            }
            return null;
        }
        
        let saveTimeout = null;
        function saveReadingProgress() {
            const pageIndex = getCurrentPageIndex();
            const pageNumber = pageIndex + 1; // 1-indexed for display/server
            
            // ローカルストレージに保存
            try {
                const data = {
                    slotIndex: currentSlotIndex,
                    pageIndex: pageIndex,
                    timestamp: Date.now()
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            } catch (e) {
                console.error('Error saving reading progress to localStorage:', e);
            }
            
            // 購入済みならサーバーにも保存（デバウンス）
            if (isPurchased && pageNumber > 1) {
                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(() => {
                    saveToServer(pageNumber);
                }, 2000); // 2秒後に保存（頻繁なリクエストを防ぐ）
            }
        }
        
        async function saveToServer(pageNumber) {
            try {
                await fetch('/api/save-reading-progress.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        work_id: <?= $workId ?>,
                        page_number: pageNumber
                    })
                });
            } catch (e) {
                console.error('Error saving to server:', e);
            }
        }
        
        function preloadNearbyPages() {
            const radius = 5;
            
            for (let d = 1; d <= radius; d++) {
                [currentSlotIndex + d, currentSlotIndex - d].forEach(idx => {
                    if (idx < 0 || idx >= slots.length) return;
                    
                    const slotEl = document.querySelector(`.page-slot[data-slot="${idx}"]`);
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
        
        function renderSlots() {
            const shouldReverse = viewMode !== 'scroll' && readingDirection === 'rtl';
            const displaySlots = shouldReverse ? [...slots].reverse() : slots;
            
            const html = displaySlots.map((slot, displayIdx) => {
                const realIdx = shouldReverse ? slots.length - 1 - displayIdx : displayIdx;
                
                let classes = 'page-slot';
                if (slot.spread) {
                    classes += ' spread-slot';
                    if (readingDirection === 'rtl') {
                        classes += ' rtl-slot';
                    }
                }
                
                const shouldEagerLoad = realIdx <= 2;
                const loadingAttr = shouldEagerLoad ? 'eager' : 'lazy';
                
                const images = slot.pages.map(pageIdx => {
                    const page = pages[pageIdx];
                    
                    if (page.is_insert) {
                        if (page.page_type === 'adsense') {
                            // AdSense用スロット
                            // 描画後にスクリプトを実行するため、ユニークなIDを付与
                            const adId = `google-ad-${realIdx}-${pageIdx}`;
                            return `
                                <div style="width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;background:${page.background_color};padding:20px;">
                                    <div style="width:100%;max-width:100%;display:flex;justify-content:center;align-items:center;">
                                        <ins class="adsbygoogle"
                                             style="display:block;min-width:300px;min-height:250px;width:100%;"
                                             data-ad-client="${page.ad_client}"
                                             data-ad-slot="${page.ad_slot}"
                                             data-ad-format="auto"
                                             data-full-width-responsive="true"></ins>
                                    </div>
                                    <div style="margin-top:20px;color:#666;font-size:12px;text-align:center;">
                                        <p>広告</p>
                                    </div>
                                </div>
                            `;
                        } else if (page.page_type === 'html') {
                            const bgColor = page.background_color || '#000000';
                            const htmlContent = page.html_content || '';
                            if (page.link_url) {
                                return `<a href="${escapeHtml(page.link_url)}" target="${page.link_target || '_blank'}" class="insert-page-link" style="background:${bgColor};display:flex;align-items:center;justify-content:center;width:100%;height:100%;">${htmlContent}</a>`;
                            }
                            return `<div class="insert-page-html" style="background:${bgColor};display:flex;align-items:center;justify-content:center;width:100%;height:100%;">${htmlContent}</div>`;
                        } else {
                            const src = page.image ? (page.image.startsWith('http') ? page.image : '/' + page.image.replace(/^\//, '')) : '';
                            const bgColor = page.background_color || '#000000';
                            if (page.link_url) {
                                return `<a href="${escapeHtml(page.link_url)}" target="${page.link_target || '_blank'}" style="background:${bgColor};display:flex;align-items:center;justify-content:center;"><img src="${src}" alt="Ad" draggable="false" loading="${loadingAttr}" decoding="async" style="max-width:100%;max-height:100%;object-fit:contain;"></a>`;
                            }
                            return `<div style="background:${bgColor};display:flex;align-items:center;justify-content:center;"><img src="${src}" alt="Ad" draggable="false" loading="${loadingAttr}" decoding="async" style="max-width:100%;max-height:100%;object-fit:contain;"></div>`;
                        }
                    }
                    
                    // 購入ページ（試し読み最終ページの次）→ ポップアップと一体化
                    if (page.is_purchase_page) {
                        return `<div class="purchase-page-trigger" style="width:100%;height:100%;background:linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);"></div>`;
                    }
                    
                    const src = page.image.startsWith('http') ? page.image : '/' + page.image.replace(/^\//, '');
                    return `<img src="${src}" alt="Page ${pageIdx + 1}" draggable="false" loading="${loadingAttr}" decoding="async">`;
                }).join('');
                
                return `<div class="${classes}" data-slot="${realIdx}"><div class="zoom-container" data-zoom-slot="${realIdx}">${images}</div></div>`;
            }).join('');
            
            slotTrack.innerHTML = html;
            preloadNearbyPages();
            
            // AdSenseの初期化呼び出し
            setTimeout(initAds, 500);
            
            // 試し読み制限: 最終ページに到達していたら自動でモーダル表示（少し遅延）
            if (previewLimit !== null && previewLimit > 0 && !isPurchased && slots.length > 0) {
                // 最終スロットに到達した時のイベントを設定
                setTimeout(() => {
                    // UIに試し読み制限の情報を表示
                    const pageInfo = document.getElementById('page-info');
                    if (pageInfo) {
                        const originalUpdate = updateUI;
                        updateUI = function() {
                            originalUpdate();
                            // 最終ページの場合は表示を変更
                            if (currentSlotIndex === slots.length - 1) {
                                pageInfo.textContent = `${previewLimit}/${totalPageCount} (試し読み)`;
                            }
                        };
                        updateUI();
                    }
                }, 100);
            }
        }
        
        // AdSense初期化用関数
        function initAds() {
            if (typeof window.adsbygoogle === 'undefined') return;
            
            try {
                const ads = document.querySelectorAll('.adsbygoogle');
                ads.forEach(ad => {
                    // まだ初期化されていない広告スロットに対してのみpushを実行
                    if (!ad.getAttribute('data-adsbygoogle-status')) {
                        (window.adsbygoogle = window.adsbygoogle || []).push({});
                    }
                });
            } catch (e) {
                console.error('AdSense push error:', e);
            }
        }
        
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
        
        function setupEvents() {
            if (viewMode !== 'scroll') {
                viewerMain.addEventListener('touchstart', onTouchStart, { passive: false });
                viewerMain.addEventListener('touchmove', onTouchMove, { passive: false });
                viewerMain.addEventListener('touchend', onTouchEnd);
                
                viewerMain.addEventListener('mousedown', onMouseDown);
                viewerMain.addEventListener('mousemove', onMouseMove);
                viewerMain.addEventListener('mouseup', onMouseUp);
                viewerMain.addEventListener('mouseleave', onMouseUp);
                
                if (tapLeft) tapLeft.addEventListener('click', onTapLeft);
                if (tapRight) tapRight.addEventListener('click', onTapRight);
            } else {
                viewerMain.addEventListener('scroll', onScroll);
            }
            
            if (tapCenter) tapCenter.addEventListener('click', onTapCenter);
            
            document.addEventListener('keydown', onKeyDown);
            if (viewerMain) viewerMain.addEventListener('wheel', onWheel, { passive: false });
            if (slider) slider.addEventListener('input', onSliderInput);
            
            window.addEventListener('resize', onResize);
            window.addEventListener('orientationchange', () => setTimeout(onResize, 100));
            
            // ページを離れる時に即座に保存
            window.addEventListener('beforeunload', saveProgressImmediately);
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'hidden') {
                    saveProgressImmediately();
                }
            });
            // モバイルでページ離脱時
            window.addEventListener('pagehide', saveProgressImmediately);
        }
        
        // 即座に進捗を保存（ページ離脱時用）
        function saveProgressImmediately() {
            const pageIndex = getCurrentPageIndex();
            const pageNumber = pageIndex + 1;
            
            // ローカルストレージに保存
            try {
                const data = {
                    slotIndex: currentSlotIndex,
                    pageIndex: pageIndex,
                    timestamp: Date.now()
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            } catch (e) {
                console.error('Error saving reading progress:', e);
            }
            
            // サーバーにも即座に保存（sendBeaconを使用）
            if (isPurchased && pageNumber > 1) {
                clearTimeout(saveTimeout); // 保留中のデバウンス保存をキャンセル
                try {
                    const data = JSON.stringify({
                        work_id: <?= $workId ?>,
                        page_number: pageNumber
                    });
                    navigator.sendBeacon('/api/save-reading-progress.php', data);
                } catch (e) {
                    console.error('Error saving to server:', e);
                }
            }
        }
        
        function onScroll() {
            if (viewMode !== 'scroll') return;
            
            const pageElements = slotTrack.querySelectorAll('.page-slot');
            const viewportHeight = viewerMain.clientHeight;
            
            pageElements.forEach((el, idx) => {
                const rect = el.getBoundingClientRect();
                const containerRect = viewerMain.getBoundingClientRect();
                const relativeTop = rect.top - containerRect.top;
                
                if (relativeTop <= viewportHeight / 2 && relativeTop + rect.height >= viewportHeight / 2) {
                    if (currentSlotIndex !== idx) {
                        currentSlotIndex = idx;
                        updateUI();
                    }
                }
            });
        }
        
        function getPinchDistance(touches) {
            const dx = touches[0].clientX - touches[1].clientX;
            const dy = touches[0].clientY - touches[1].clientY;
            return Math.sqrt(dx * dx + dy * dy);
        }
        
        function getPinchCenter(touches) {
            return {
                x: (touches[0].clientX + touches[1].clientX) / 2,
                y: (touches[0].clientY + touches[1].clientY) / 2
            };
        }
        
        let lastTouchEndTime = 0;
        let lastTouchX = 0;
        let lastTouchY = 0;
        
        function onTouchStart(e) {
            // 慣性スクロール中なら停止
            if (momentumID) {
                cancelAnimationFrame(momentumID);
                momentumID = null;
            }
            velocityX = 0;
            velocityY = 0;

            if (e.touches.length === 2) {
                e.preventDefault();
                
                const container = getCurrentZoomContainer();
                if (container) container.classList.add('no-transition');
                
                const dist = getPinchDistance(e.touches);
                const center = getPinchCenter(e.touches);
                initialPinchDistance = dist;
                initialPinchZoom = currentZoom;
                pinchCenterX = center.x - window.innerWidth / 2;
                pinchCenterY = center.y - window.innerHeight / 2;
                zoomPanStartXBackup = zoomPanX;
                zoomPanStartYBackup = zoomPanY;
                isDragging = false;
                return;
            }
            
            if (currentZoom > 1 && e.touches.length === 1) {
                e.preventDefault();
                
                const touchX = e.touches[0].clientX;
                const touchY = e.touches[0].clientY;
                
                isZoomPanning = true;
                edgeOverscroll = 0;
                
                const container = getCurrentZoomContainer();
                if (container) container.classList.add('no-transition');
                // トラックも動かす可能性があるのでtransition停止
                slotTrack.classList.add('no-transition');
                
                zoomPanStartX = touchX;
                zoomPanStartY = touchY;
                zoomPanOffsetX = zoomPanX;
                zoomPanOffsetY = zoomPanY;
                edgeSwipeStartX = touchX;
                
                // 慣性用記録初期化
                lastMoveTime = Date.now();
                lastMoveX = touchX;
                lastMoveY = touchY;
                velocityX = 0;
                velocityY = 0;
                velocityHistory = [];
                return;
            }
            
            if (e.touches.length !== 1) return;
            startDrag(e.touches[0].clientX);
        }
        
        function onTouchMove(e) {
            if (e.touches.length === 2 && initialPinchDistance > 0) {
                e.preventDefault();
                const dist = getPinchDistance(e.touches);
                const scale = dist / initialPinchDistance;
                let newZoom = initialPinchZoom * scale;
                
                if (initialPinchZoom > 0) {
                    const zoomRatio = newZoom / initialPinchZoom;
                    zoomPanX = pinchCenterX - (pinchCenterX - zoomPanStartXBackup) * zoomRatio;
                    zoomPanY = pinchCenterY - (pinchCenterY - zoomPanStartYBackup) * zoomRatio;
                }
                
                if (newZoom !== currentZoom) {
                    setZoom(newZoom);
                }
                return;
            }
            
            if (isZoomPanning && e.touches.length === 1) {
                e.preventDefault();
                const touchX = e.touches[0].clientX;
                const touchY = e.touches[0].clientY;
                const dx = touchX - zoomPanStartX;
                const dy = touchY - zoomPanStartY;
                
                // 速度計算（履歴ベース）
                const now = Date.now();
                const dt = now - lastMoveTime;
                if (dt > 0 && dt < 100) { // 100ms以上空いたら無視
                    const vx = (touchX - lastMoveX) / dt * 16; // 16ms（60fps）あたりの移動量に正規化
                    const vy = (touchY - lastMoveY) / dt * 16;
                    
                    // 履歴に追加（最新5フレーム分）
                    velocityHistory.push({ vx, vy, time: now });
                    if (velocityHistory.length > 5) {
                        velocityHistory.shift();
                    }
                }
                lastMoveTime = now;
                lastMoveX = touchX;
                lastMoveY = touchY;
                
                // 画像内移動処理
                const res = updateZoomPan(zoomPanOffsetX + dx, zoomPanOffsetY + dy);
                
                // スワイプ方向を判定（縦メインか横メインか）
                const totalDx = touchX - edgeSwipeStartX;
                const totalDy = touchY - zoomPanStartY;
                const isHorizontalSwipe = Math.abs(totalDx) > Math.abs(totalDy) * 1.5; // 横方向が1.5倍以上強い
                
                // 端に達した場合の処理
                if (res.overscroll !== 0) {
                    // 縦方向メインのスワイプなら、端でも慣性を維持（ページめくりモードに入らない）
                    if (!isHorizontalSwipe) {
                        // 横方向は端で止める（overscrollは0として扱う）
                        edgeOverscroll = 0;
                        return;
                    }
                    
                    // 横方向スワイプの場合のみページめくりモードへ
                    edgeOverscroll = res.overscroll;
                    
                    // ページめくりモードに入ったら慣性速度をクリア
                    velocityHistory = [];

                    // ノイズ対策：小さな動きは無視 (10px未満は動かさない)
                    if (Math.abs(edgeOverscroll) < 10) return;
                    
                    // 抵抗係数
                    const trackOffset = edgeOverscroll * 0.3;
                    
                    // 現在のトラック基本位置を計算
                    let displayIndex;
                    if (readingDirection === 'rtl') {
                        displayIndex = slots.length - 1 - currentSlotIndex;
                    } else {
                        displayIndex = currentSlotIndex;
                    }
                    const baseOffset = -displayIndex * containerWidth;
                    
                    // スロット全体を平行移動 (拡大された現在のページ + 隣のページが見える)
                    slotTrack.style.transform = `translateX(${baseOffset + trackOffset}px)`;
                } else {
                    // 端に達していない場合はページめくり状態をリセット
                    edgeOverscroll = 0;
                }
                
                return;
            }
            
            if (!isDragging) return;
            e.preventDefault();
            moveDrag(e.touches[0].clientX);
        }
        
        function onTouchEnd(e) {
            if (initialPinchDistance > 0) {
                initialPinchDistance = 0;
                
                const container = getCurrentZoomContainer();
                if (container) container.classList.remove('no-transition');
                
                if (currentZoom < 1.1) {
                    resetZoom();
                } else if (currentZoom > MAX_ZOOM) {
                    setZoom(MAX_ZOOM);
                }
                return;
            }
            
            if (isZoomPanning) {
                isZoomPanning = false;
                
                // 慣性開始判定（端スワイプ中でなければ）
                if (Math.abs(edgeOverscroll) < 10) {
                    initMomentum();
                } else {
                    const container = getCurrentZoomContainer();
                    if (container) container.classList.remove('no-transition');
                }
                
                // トラックのtransition復活
                slotTrack.classList.remove('no-transition');
                
                const OVERSCROLL_THRESHOLD = 120; // ページ遷移する閾値
                
                // 端で一定以上引っ張っていたらページ遷移
                if (Math.abs(edgeOverscroll) > OVERSCROLL_THRESHOLD) {
                    // RTLの場合:
                    // 左スワイプ(edgeOverscroll < 0): 右隣が見えている -> 前のページへ(Prev)
                    // 右スワイプ(edgeOverscroll > 0): 左隣が見えている -> 次のページへ(Next)
                    // LTRの場合: 逆
                    
                    const isNext = (readingDirection === 'rtl') ? (edgeOverscroll > 0) : (edgeOverscroll < 0);
                    
                    // ページ遷移を実行
                    if (isNext) {
                        goNext(true);
                    } else {
                        goPrev(true);
                    }
                } else {
                    // 閾値以下の場合は元の位置に戻す
                    updateTrackPosition(true);
                }
                
                edgeOverscroll = 0;
                
                if (currentZoom > 1) {
                    const now = Date.now();
                    const timeDiff = now - lastTouchEndTime;
                    const moveDistance = Math.sqrt(
                        Math.pow(zoomPanStartX - lastTouchX, 2) + 
                        Math.pow(zoomPanStartY - lastTouchY, 2)
                    );
                    
                    if (timeDiff < DOUBLE_TAP_DELAY && moveDistance < 50) {
                        resetZoom();
                    }
                    
                    lastTouchEndTime = now;
                    lastTouchX = zoomPanStartX;
                    lastTouchY = zoomPanStartY;
                }
                return;
            }
            
            endDrag();
        }
        
        function onMouseDown(e) {
            // 慣性スクロール中なら停止
            if (momentumID) {
                cancelAnimationFrame(momentumID);
                momentumID = null;
            }
            velocityX = 0;
            velocityY = 0;
            velocityHistory = [];

            if (currentZoom > 1) {
                e.preventDefault();
                isZoomPanning = true;
                zoomPanStartX = e.clientX;
                zoomPanStartY = e.clientY;
                zoomPanOffsetX = zoomPanX;
                zoomPanOffsetY = zoomPanY;
                
                // 慣性用記録初期化
                lastMoveTime = Date.now();
                lastMoveX = e.clientX;
                lastMoveY = e.clientY;

                // トラック移動の準備
                slotTrack.classList.add('no-transition');
                edgeSwipeStartX = e.clientX;
                return;
            }
            
            e.preventDefault();
            startDrag(e.clientX);
        }
        
        function onMouseMove(e) {
            if (isZoomPanning) {
                e.preventDefault();
                const dx = e.clientX - zoomPanStartX;
                const dy = e.clientY - zoomPanStartY;
                
                // 速度計算（履歴ベース）
                const now = Date.now();
                const dt = now - lastMoveTime;
                if (dt > 0 && dt < 100) {
                    const vx = (e.clientX - lastMoveX) / dt * 16;
                    const vy = (e.clientY - lastMoveY) / dt * 16;
                    
                    velocityHistory.push({ vx, vy, time: now });
                    if (velocityHistory.length > 5) {
                        velocityHistory.shift();
                    }
                }
                lastMoveTime = now;
                lastMoveX = e.clientX;
                lastMoveY = e.clientY;

                // タッチと同じロジック
                const res = updateZoomPan(zoomPanOffsetX + dx, zoomPanOffsetY + dy);
                
                // スワイプ方向を判定（縦メインか横メインか）
                const totalDx = e.clientX - edgeSwipeStartX;
                const totalDy = e.clientY - zoomPanStartY;
                const isHorizontalSwipe = Math.abs(totalDx) > Math.abs(totalDy) * 1.5;
                
                if (res.overscroll !== 0) {
                    // 縦方向メインのスワイプなら、端でも慣性を維持
                    if (!isHorizontalSwipe) {
                        edgeOverscroll = 0;
                        return;
                    }
                    
                    // 横方向スワイプの場合のみページめくりモードへ
                    edgeOverscroll = res.overscroll;
                    velocityHistory = [];

                    if (Math.abs(edgeOverscroll) < 10) return;
                    
                    const trackOffset = edgeOverscroll * 0.3;
                    let displayIndex;
                    if (readingDirection === 'rtl') {
                        displayIndex = slots.length - 1 - currentSlotIndex;
                    } else {
                        displayIndex = currentSlotIndex;
                    }
                    const baseOffset = -displayIndex * containerWidth;
                    slotTrack.style.transform = `translateX(${baseOffset + trackOffset}px)`;
                } else {
                    edgeOverscroll = 0;
                }
                return;
            }
            
            if (!isDragging) return;
            e.preventDefault();
            moveDrag(e.clientX);
        }
        
        function onMouseUp() {
            if (isZoomPanning) {
                isZoomPanning = false;
                
                // 慣性開始判定
                if (Math.abs(edgeOverscroll) < 10) {
                    initMomentum();
                } else {
                    const container = getCurrentZoomContainer();
                    if (container) container.classList.remove('no-transition');
                }

                slotTrack.classList.remove('no-transition');
                
                const OVERSCROLL_THRESHOLD = 120;
                
                if (Math.abs(edgeOverscroll) > OVERSCROLL_THRESHOLD) {
                    const isNext = (readingDirection === 'rtl') ? (edgeOverscroll > 0) : (edgeOverscroll < 0);
                    if (isNext) goNext(true);
                    else goPrev(true);
                } else {
                    updateTrackPosition(true);
                }
                edgeOverscroll = 0;
                return;
            }
            endDrag();
        }
        
        // 速度履歴から平均速度を計算
        function calculateAverageVelocity() {
            if (velocityHistory.length === 0) {
                velocityX = 0;
                velocityY = 0;
                return;
            }
            
            // 直近100ms以内のデータのみ使用
            const now = Date.now();
            const recentHistory = velocityHistory.filter(v => now - v.time < 100);
            
            if (recentHistory.length === 0) {
                velocityX = 0;
                velocityY = 0;
                return;
            }
            
            // 新しいデータほど重みを大きく（指数加重平均）
            let sumVx = 0, sumVy = 0, weightSum = 0;
            recentHistory.forEach((v, i) => {
                const weight = Math.pow(2, i); // 新しいほど重み大
                sumVx += v.vx * weight;
                sumVy += v.vy * weight;
                weightSum += weight;
            });
            
            velocityX = sumVx / weightSum;
            velocityY = sumVy / weightSum;
            
            // 初速度に少しブーストをかける（指を離した瞬間の自然さ）
            const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
            if (speed > 2) {
                const boost = 1.2;
                velocityX *= boost;
                velocityY *= boost;
            }
        }

        // 慣性スクロール用の変数
        let momentumStartTime = 0;
        let momentumInitialVelocityX = 0;
        let momentumInitialVelocityY = 0;
        
        // 慣性スクロール実行関数（物理ベース）
        function startMomentum() {
            const now = performance.now();
            const elapsed = now - momentumStartTime;
            
            // 減衰時定数（ms）- 大きいほど長く滑る
            const timeConstant = 325;
            
            // 指数減衰: v(t) = v0 * e^(-t/τ)
            const decay = Math.exp(-elapsed / timeConstant);
            
            velocityX = momentumInitialVelocityX * decay;
            velocityY = momentumInitialVelocityY * decay;
            
            // 速度が十分小さくなったら停止
            const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
            if (speed < 0.5) {
                // オーバースクロール状態ならバウンスバック
                if (isOverscrolling) {
                    bounceBack(velocityX, velocityY);
                } else {
                    const container = getCurrentZoomContainer();
                    if (container) container.classList.remove('no-transition');
                }
                momentumID = null;
                return;
            }

            // 位置を更新（時間ベースで計算）
            const frameTime = 16; // 約60fps
            const nextX = zoomPanX + velocityX * (frameTime / 16);
            const nextY = zoomPanY + velocityY * (frameTime / 16);

            const res = updateZoomPan(nextX, nextY, true);

            // 端に達したらバウンスバックへ移行（速度を引き継ぐ）
            if (res.overscroll !== 0 || res.overscrollY !== 0) {
                // 現在の速度をバウンスバックに引き継いでバウンド感を出す
                bounceBack(velocityX, velocityY);
                momentumID = null;
                return;
            }

            momentumID = requestAnimationFrame(startMomentum);
        }
        
        // 慣性スクロール開始
        function initMomentum() {
            // バウンスアニメーション中なら停止して引き継ぎ
            if (bounceAnimationID) {
                cancelAnimationFrame(bounceAnimationID);
                bounceAnimationID = null;
                bounceVelocityX = 0;
                bounceVelocityY = 0;
            }
            
            calculateAverageVelocity();
            
            const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
            
            // オーバースクロール状態ならバウンスバックへ（速度を引き継ぐ）
            if (isOverscrolling) {
                bounceBack(velocityX, velocityY);
                return;
            }
            
            if (speed < 1) {
                const container = getCurrentZoomContainer();
                if (container) container.classList.remove('no-transition');
                return;
            }
            
            momentumStartTime = performance.now();
            momentumInitialVelocityX = velocityX;
            momentumInitialVelocityY = velocityY;
            
            momentumID = requestAnimationFrame(startMomentum);
        }
        
        function startDrag(x) {
            isDragging = true;
            startX = x;
            currentX = x;
            offsetX = 0;
            dragStartTime = Date.now();
            slotTrack.classList.add('no-transition');
        }
        
        function moveDrag(x) {
            currentX = x;
            const diff = currentX - startX;
            
            const isFirst = currentSlotIndex === 0;
            const isLast = currentSlotIndex === slots.length - 1;
            
            if (readingDirection === 'rtl') {
                if ((isFirst && diff > 0) || (isLast && diff < 0)) {
                    offsetX = diff * 0.3;
                } else {
                    offsetX = diff;
                }
            } else {
                if ((isFirst && diff > 0) || (isLast && diff < 0)) {
                    offsetX = diff * 0.3;
                } else {
                    offsetX = diff;
                }
            }
            
            updateTrackPosition(false);
        }
        
        function endDrag() {
            if (!isDragging) return;
            isDragging = false;
            
            slotTrack.classList.remove('no-transition');
            
            if (currentZoom > 1) {
                offsetX = 0;
                updateTrackPosition(true);
                return;
            }
            
            const diff = currentX - startX;
            const elapsed = Date.now() - dragStartTime;
            const threshold = containerWidth * 0.15;
            const isQuickSwipe = elapsed < 300 && Math.abs(diff) > 30;
            
            if (Math.abs(diff) > threshold || isQuickSwipe) {
                if (readingDirection === 'rtl') {
                    if (diff < 0 && currentSlotIndex > 0) {
                        currentSlotIndex--;
                    } else if (diff > 0 && currentSlotIndex < slots.length - 1) {
                        currentSlotIndex++;
                    }
                } else {
                    if (diff < 0 && currentSlotIndex < slots.length - 1) {
                        currentSlotIndex++;
                    } else if (diff > 0 && currentSlotIndex > 0) {
                        currentSlotIndex--;
                    }
                }
            }
            
            offsetX = 0;
            updateTrackPosition(true);
            updateUI();
        }
        
        function onTapLeft(e) {
            e.stopPropagation();
            // 慣性中は停止のみ
            if (momentumID) {
                cancelAnimationFrame(momentumID);
                momentumID = null;
                return;
            }

            const now = Date.now();
            const timeDiff = now - lastTapTime;
            lastTapTime = now;
            
            if (currentZoom > 1) {
                if (timeDiff < DOUBLE_TAP_DELAY) resetZoom();
                return;
            }
            
            if (timeDiff < DOUBLE_TAP_DELAY && viewMode !== 'scroll') {
                if (pendingTapAction) clearTimeout(pendingTapAction);
                zoomAtPoint(2, e.clientX || window.innerWidth * 0.15, e.clientY || window.innerHeight / 2);
                return;
            }
            
            if (pendingTapAction) clearTimeout(pendingTapAction);
            pendingTapAction = setTimeout(() => {
                if (readingDirection === 'rtl') {
                    if (currentSlotIndex < slots.length - 1) {
                        currentSlotIndex++;
                        updateTrackPosition(true);
                        updateUI();
                    }
                } else {
                    if (currentSlotIndex > 0) {
                        currentSlotIndex--;
                        updateTrackPosition(true);
                        updateUI();
                    }
                }
            }, DOUBLE_TAP_DELAY);
        }
        
        function onTapCenter(e) {
            e.stopPropagation();
            // 慣性中は停止のみ
            if (momentumID) {
                cancelAnimationFrame(momentumID);
                momentumID = null;
                return;
            }

            const now = Date.now();
            const timeDiff = now - lastTapTime;
            lastTapTime = now;
            
            if (timeDiff < DOUBLE_TAP_DELAY && viewMode !== 'scroll') {
                if (pendingTapAction) clearTimeout(pendingTapAction);
                if (currentZoom > 1) resetZoom();
                else zoomAtPoint(2, e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2);
                return;
            }
            
            if (pendingTapAction) clearTimeout(pendingTapAction);
            pendingTapAction = setTimeout(() => {
                toggleUI();
            }, DOUBLE_TAP_DELAY);
        }
        
        function onTapRight(e) {
            e.stopPropagation();
            // 慣性中は停止のみ
            if (momentumID) {
                cancelAnimationFrame(momentumID);
                momentumID = null;
                return;
            }

            const now = Date.now();
            const timeDiff = now - lastTapTime;
            lastTapTime = now;
            
            if (currentZoom > 1) {
                if (timeDiff < DOUBLE_TAP_DELAY) resetZoom();
                return;
            }
            
            if (timeDiff < DOUBLE_TAP_DELAY && viewMode !== 'scroll') {
                if (pendingTapAction) clearTimeout(pendingTapAction);
                zoomAtPoint(2, e.clientX || window.innerWidth * 0.85, e.clientY || window.innerHeight / 2);
                return;
            }
            
            if (pendingTapAction) clearTimeout(pendingTapAction);
            pendingTapAction = setTimeout(() => {
                if (readingDirection === 'rtl') {
                    if (currentSlotIndex > 0) {
                        currentSlotIndex--;
                        updateTrackPosition(true);
                        updateUI();
                    }
                } else {
                    if (currentSlotIndex < slots.length - 1) {
                        currentSlotIndex++;
                        updateTrackPosition(true);
                        updateUI();
                    }
                }
            }, DOUBLE_TAP_DELAY);
        }
        
        function goToSlot(idx) {
            if (idx >= 0 && idx < slots.length) {
                resetZoomOnPageChange();
                currentSlotIndex = idx;
                
                if (viewMode === 'scroll') {
                    const pageElements = slotTrack.querySelectorAll('.page-slot');
                    if (pageElements[idx]) {
                        pageElements[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                } else {
                    updateTrackPosition(true);
                }
                
                updateUI();
            }
        }
        
        function goToPageByIndex(pageIdx) {
            const slotIdx = findSlotByPageIndex(pageIdx);
            goToSlot(slotIdx);
        }
        
        function goNext(animate = true) {
            if (currentZoom > 1) {
                // 強制遷移の場合はズームリセット
                resetZoomOnPageChange();
            }
            
            if (currentSlotIndex < slots.length - 1) {
                currentSlotIndex++;
                updateTrackPosition(animate);
                updateUI();
            } else {
                // 最終ページでさらに進もうとした場合はバネで戻る
                updateTrackPosition(true);
            }
        }
        
        function goPrev(animate = true) {
            if (currentZoom > 1) {
                resetZoomOnPageChange();
            }
            
            if (currentSlotIndex > 0) {
                currentSlotIndex--;
                updateTrackPosition(animate);
                updateUI();
            } else {
                updateTrackPosition(true);
            }
        }
        
        function updateTrackPosition(animate) {
            if (viewMode === 'scroll') return;
            
            if (animate) {
                slotTrack.classList.remove('no-transition');
            } else {
                slotTrack.classList.add('no-transition');
            }
            
            let displayIndex;
            if (readingDirection === 'rtl') {
                displayIndex = slots.length - 1 - currentSlotIndex;
            } else {
                displayIndex = currentSlotIndex;
            }
            
            const baseOffset = -displayIndex * containerWidth;
            const totalOffset = baseOffset + offsetX;
            slotTrack.style.transform = `translateX(${totalOffset}px)`;
        }
        
        function updateUI() {
            const slot = slots[currentSlotIndex];
            if (!slot) return;
            
            const firstPageNum = slot.pages[0] + 1;
            const lastPageNum = slot.pages[slot.pages.length - 1] + 1;
            
            if (slot.spread && slot.pages.length > 1) {
                currentPageEl.textContent = `${firstPageNum}-${lastPageNum}`;
            } else {
                currentPageEl.textContent = firstPageNum;
            }
            
            let progress;
            if (slots.length <= 1) {
                progress = 100;
            } else {
                progress = Math.round((currentSlotIndex / (slots.length - 1)) * 100);
            }
            progressEl.textContent = `${progress}%`;
            
            if (slots.length <= 1) {
                slider.value = totalPages;
            } else {
                const sliderValue = 1 + Math.round((currentSlotIndex / (slots.length - 1)) * (totalPages - 1));
                slider.value = sliderValue;
            }
            
            saveReadingProgress();
            preloadNearbyPages();
            
            // 購入ページに到達したらポップアップ表示、離れたら閉じる
            if (hasPreviewLimit && currentSlotIndex === slots.length - 1) {
                showPurchasePopup();
            } else {
                closePurchasePopup();
            }
        }
        
        // 購入促進ポップアップ表示（説明文込みで画面中央）
        function showPurchasePopup() {
            if (document.getElementById('purchase-popup')) return;
            
            const price = productInfo ? '¥' + Number(productInfo.price).toLocaleString() : '';
            const backUrl = getBackUrl();
            
            const popupHTML = `
            <div id="purchase-popup" style="
                position: fixed;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                padding: 20px;
                pointer-events: none;
            ">
                <div style="
                    background: white;
                    border-radius: 24px;
                    padding: 32px;
                    max-width: 380px;
                    width: 100%;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.4);
                    text-align: center;
                    pointer-events: auto;
                ">
                    <div style="
                        width: 72px;
                        height: 72px;
                        background: linear-gradient(135deg, #22c55e, #10b981);
                        border-radius: 50%;
                        margin: 0 auto 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                    </div>
                    <h2 style="font-size: 1.4rem; font-weight: bold; margin-bottom: 12px; color: #1f2937;">
                        試し読みはここまで
                    </h2>
                    <p style="color: #6b7280; margin-bottom: 6px; line-height: 1.5; font-size: 0.95rem;">
                        全${totalPageCount}ページ中 ${previewLimit}ページまで無料
                    </p>
                    <p style="color: #6b7280; margin-bottom: 24px; line-height: 1.5; font-size: 0.95rem;">
                        続きを読むには商品をご購入ください
                    </p>
                    <a href="/store/product.php?id=${productInfo ? productInfo.id : ''}" style="
                        display: block;
                        background: linear-gradient(135deg, #22c55e, #10b981);
                        color: white;
                        padding: 16px 32px;
                        border-radius: 12px;
                        font-weight: bold;
                        font-size: 1.1rem;
                        text-decoration: none;
                        margin-bottom: 12px;
                        box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
                    ">
                        購入する ${price}
                    </a>
                    <a href="${backUrl}" style="
                        display: block;
                        color: #6b7280;
                        font-size: 0.9rem;
                        padding: 8px 16px;
                        text-decoration: none;
                    ">
                        戻る
                    </a>
                </div>
            </div>
            `;
            document.body.insertAdjacentHTML('beforeend', popupHTML);
        }
        
        function closePurchasePopup() {
            const popup = document.getElementById('purchase-popup');
            if (popup) popup.remove();
        }
        
        function getCurrentPageIndex() {
            const slot = slots[currentSlotIndex];
            return slot ? slot.pages[0] : 0;
        }
        
        function findSlotByPageIndex(pageIdx) {
            for (let i = 0; i < slots.length; i++) {
                if (slots[i].pages.includes(pageIdx)) {
                    return i;
                }
            }
            return 0;
        }
        
        function onSliderInput(e) {
            const pageNum = parseInt(e.target.value);
            goToPageByIndex(pageNum - 1);
        }
        
        function shouldIgnoreKeyEvent(e) {
            const t = e.target;
            if (!t) return false;
            const tag = (t.tagName || '').toUpperCase();
            return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || t.isContentEditable;
        }
        
        function onKeyDown(e) {
            if (shouldIgnoreKeyEvent(e)) return;
            
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    if (readingDirection === 'rtl') goNext(true); else goPrev(true);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    if (readingDirection === 'rtl') goPrev(true); else goNext(true);
                    break;
                case ' ':
                case 'ArrowDown':
                case 'PageDown':
                    e.preventDefault();
                    goNext(true);
                    break;
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    goPrev(true);
                    break;
                case 'Home':
                    e.preventDefault();
                    goToSlot(0);
                    break;
                case 'End':
                    e.preventDefault();
                    goToSlot(slots.length - 1);
                    break;
                case 'Escape':
                    if (currentZoom > 1) resetZoom();
                    else history.back();
                    break;
            }
        }
        
        let wheelCooldownUntil = 0;
        function onWheel(e) {
            if (viewMode === 'scroll') return;
            if (e.ctrlKey) return;
            
            const dx = e.deltaX || 0;
            const dy = e.deltaY || 0;
            const primary = Math.abs(dx) > Math.abs(dy) ? dx : dy;
            
            if (Math.abs(primary) < 8) return;
            
            e.preventDefault();
            
            const now = Date.now();
            if (now < wheelCooldownUntil) return;
            wheelCooldownUntil = now + 160;
            
            if (primary > 0) goNext(true); else goPrev(true);
        }
        
        function toggleUI() {
            uiVisible = !uiVisible;
            header.classList.toggle('ui-hidden', !uiVisible);
            footer.classList.toggle('ui-hidden', !uiVisible);
            if (zoomControls && viewMode !== 'scroll' && !isMobile) {
                zoomControls.classList.toggle('ui-hidden', !uiVisible);
            }
            if (statusBarCover) {
                statusBarCover.classList.toggle('visible', !uiVisible);
            }
        }
        
        function getCurrentZoomContainer() {
            return document.querySelector(`.zoom-container[data-zoom-slot="${currentSlotIndex}"]`);
        }
        
        function setZoom(newZoom) {
            currentZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
            
            const container = getCurrentZoomContainer();
            if (container) {
                if (currentZoom > 1) {
                    container.classList.add('zoomed');
                } else {
                    container.classList.remove('zoomed');
                    zoomPanX = 0;
                    zoomPanY = 0;
                }
                updateZoomTransform(container);
            }
            updateZoomButtons();
        }
        
        function zoomAtPoint(targetZoom, pointX, pointY) {
            const container = getCurrentZoomContainer();
            if (!container) return;
            
            container.classList.remove('no-transition');
            
            const centerX = pointX - window.innerWidth / 2;
            const centerY = pointY - window.innerHeight / 2;
            const zoomRatio = targetZoom / (currentZoom || 1);
            
            zoomPanX = centerX - (centerX - zoomPanX) * zoomRatio;
            zoomPanY = centerY - (centerY - zoomPanY) * zoomRatio;
            
            setZoom(targetZoom);
        }
        
        function updateZoomTransform(container) {
            if (!container) container = getCurrentZoomContainer();
            if (!container) return;
            container.style.transform = `scale(${currentZoom}) translate(${zoomPanX / currentZoom}px, ${zoomPanY / currentZoom}px)`;
        }
        
        // オーバースクロール用の変数
        let overscrollY = 0;
        let isOverscrolling = false;
        
        function updateZoomPan(newX, newY, allowRubberBand = true) {
            const container = getCurrentZoomContainer();
            if (!container) return { overscroll: 0, overscrollY: 0 };
            
            const images = container.querySelectorAll('img');
            let scaledWidth = 0;
            let scaledHeight = 0;

            if (images.length > 0) {
                images.forEach(img => {
                    const rect = img.getBoundingClientRect();
                    scaledWidth += rect.width;
                    scaledHeight = Math.max(scaledHeight, rect.height);
                });
            } else {
                const rect = container.getBoundingClientRect();
                scaledWidth = rect.width;
                scaledHeight = rect.height;
            }
            
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            
            // 横方向の余白（画面幅の8%程度、控えめ）
            const horizontalMargin = screenWidth * 0.08;
            const maxPanX = Math.max(0, (scaledWidth - screenWidth) / 2 + horizontalMargin);
            
            // 縦方向の余白計算（ページの上下が画面中央まで来れるようにする）
            const verticalMargin = screenHeight / 2;
            const maxPanY = Math.max(0, (scaledHeight - screenHeight) / 2 + verticalMargin);
            
            const atLeft = newX > maxPanX;
            const atRight = newX < -maxPanX;
            const atTop = newY > maxPanY;
            const atBottom = newY < -maxPanY;
            
            let overscroll = 0;
            let overscrollYAmount = 0;
            
            // ラバーバンド効果の強さ（0.15 = 15%の抵抗で引っ張れる、控えめ）
            const rubberBandFactor = 0.15;
            
            // 横方向の処理
            if (atLeft) {
                overscroll = newX - maxPanX;
                if (allowRubberBand) {
                    // ラバーバンド: 超えた分は抵抗をかけて少しだけ動く
                    zoomPanX = maxPanX + overscroll * rubberBandFactor;
                } else {
                    zoomPanX = maxPanX;
                }
            } else if (atRight) {
                overscroll = newX + maxPanX;
                if (allowRubberBand) {
                    zoomPanX = -maxPanX + overscroll * rubberBandFactor;
                } else {
                    zoomPanX = -maxPanX;
                }
            } else {
                zoomPanX = newX;
                overscroll = 0;
            }
            
            // 縦方向の処理（ラバーバンド効果付き）
            if (atTop) {
                overscrollYAmount = newY - maxPanY;
                if (allowRubberBand) {
                    zoomPanY = maxPanY + overscrollYAmount * rubberBandFactor;
                } else {
                    zoomPanY = maxPanY;
                }
            } else if (atBottom) {
                overscrollYAmount = newY + maxPanY;
                if (allowRubberBand) {
                    zoomPanY = -maxPanY + overscrollYAmount * rubberBandFactor;
                } else {
                    zoomPanY = -maxPanY;
                }
            } else {
                zoomPanY = newY;
                overscrollYAmount = 0;
            }
            
            isOverscrolling = (overscroll !== 0 || overscrollYAmount !== 0);
            
            updateZoomTransform(container);
            
            return { overscroll, overscrollY: overscrollYAmount };
        }
        
        // 端に達した時のバウンスバック処理
        let bounceAnimationID = null;
        let bounceVelocityX = 0;
        let bounceVelocityY = 0;
        
        function bounceBack(initialVelocityX = 0, initialVelocityY = 0) {
            // 慣性スクロール中なら停止
            if (momentumID) {
                cancelAnimationFrame(momentumID);
                momentumID = null;
            }
            
            const container = getCurrentZoomContainer();
            if (!container) return;
            
            // 画像サイズを取得
            const images = container.querySelectorAll('img');
            let scaledWidth = 0;
            let scaledHeight = 0;

            if (images.length > 0) {
                images.forEach(img => {
                    const rect = img.getBoundingClientRect();
                    scaledWidth += rect.width;
                    scaledHeight = Math.max(scaledHeight, rect.height);
                });
            } else {
                const rect = container.getBoundingClientRect();
                scaledWidth = rect.width;
                scaledHeight = rect.height;
            }
            
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            
            // 余白付きの範囲（ドラッグ中に動ける範囲）
            // 横方向の余白（控えめ）
            const horizontalMargin = screenWidth * 0.08;
            const verticalMargin = screenHeight / 2;
            const maxPanX = Math.max(0, (scaledWidth - screenWidth) / 2 + horizontalMargin);
            const maxPanY = Math.max(0, (scaledHeight - screenHeight) / 2 + verticalMargin);
            
            // 余白の範囲内に収める（余白内ならそのまま、超えていたら余白の端まで戻す）
            const targetX = Math.max(-maxPanX, Math.min(maxPanX, zoomPanX));
            const targetY = Math.max(-maxPanY, Math.min(maxPanY, zoomPanY));
            
            // 初回呼び出し時は初速度を設定（バウンドを弱めに）
            if (initialVelocityX !== 0 || initialVelocityY !== 0) {
                bounceVelocityX = initialVelocityX * 0.15;
                bounceVelocityY = initialVelocityY * 0.15;
            }
            
            const dx = targetX - zoomPanX;
            const dy = targetY - zoomPanY;
            
            // 既に範囲内で速度も小さいならバウンス終了
            if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && 
                Math.abs(bounceVelocityX) < 0.5 && Math.abs(bounceVelocityY) < 0.5) {
                zoomPanX = targetX;
                zoomPanY = targetY;
                bounceVelocityX = 0;
                bounceVelocityY = 0;
                updateZoomTransform(container);
                container.classList.remove('no-transition');
                isOverscrolling = false;
                bounceAnimationID = null;
                return;
            }
            
            // スプリング物理: F = -k*x - c*v (バネ力 + 減衰)
            const springK = 0.12;  // バネ定数（弱め）
            const damping = 0.8;   // 減衰係数（強め＝早く収束）
            
            // 加速度 = バネ力
            const ax = dx * springK;
            const ay = dy * springK;
            
            // 速度更新（減衰付き）
            bounceVelocityX = bounceVelocityX * damping + ax;
            bounceVelocityY = bounceVelocityY * damping + ay;
            
            // 位置更新
            zoomPanX += bounceVelocityX;
            zoomPanY += bounceVelocityY;
            
            updateZoomTransform(container);
            
            bounceAnimationID = requestAnimationFrame(() => bounceBack(0, 0));
        }
        
        function zoomIn() {
            if (currentZoom >= MAX_ZOOM) return;
            setZoom(currentZoom + ZOOM_STEP);
        }
        
        function resetZoom() {
            zoomPanX = 0;
            zoomPanY = 0;
            isOverscrolling = false;
            setZoom(1);
            if (momentumID) {
                cancelAnimationFrame(momentumID);
                momentumID = null;
            }
            if (bounceAnimationID) {
                cancelAnimationFrame(bounceAnimationID);
                bounceAnimationID = null;
            }
            velocityX = 0;
            velocityY = 0;
            bounceVelocityX = 0;
            bounceVelocityY = 0;
        }
        
        function updateZoomButtons() {
            if (zoomInBtn) zoomInBtn.disabled = currentZoom >= MAX_ZOOM;
            if (zoomResetBtn) zoomResetBtn.disabled = currentZoom <= MIN_ZOOM;
        }
        
        function resetZoomOnPageChange() {
            if (currentZoom > 1) {
                const container = getCurrentZoomContainer();
                if (container) {
                    container.classList.remove('zoomed');
                    container.style.transform = '';
                }
                currentZoom = 1;
                zoomPanX = 0;
                zoomPanY = 0;
                isOverscrolling = false;
                updateZoomButtons();
                
                // 慣性リセット
                if (momentumID) {
                    cancelAnimationFrame(momentumID);
                    momentumID = null;
                }
                if (bounceAnimationID) {
                    cancelAnimationFrame(bounceAnimationID);
                    bounceAnimationID = null;
                }
                velocityX = 0;
                velocityY = 0;
                bounceVelocityX = 0;
                bounceVelocityY = 0;
            }
        }
        
        function toggleFullscreen() {
            const viewer = document.getElementById('viewer');
            const icon = document.getElementById('fullscreen-icon');
            
            const isRealFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement);
            const isPseudoFullscreen = viewer && viewer.classList.contains('pseudo-fullscreen');
            
            const setIcon = (on) => {
                if (!icon) return;
                icon.classList.toggle('fa-expand', !on);
                icon.classList.toggle('fa-compress', on);
            };
            
            const enterPseudo = () => {
                if (!viewer) return;
                viewer.classList.add('pseudo-fullscreen');
                document.body.classList.add('pseudo-fullscreen-body');
                setIcon(true);
            };
            
            const exitPseudo = () => {
                if (!viewer) return;
                viewer.classList.remove('pseudo-fullscreen');
                document.body.classList.remove('pseudo-fullscreen-body');
                setIcon(false);
            };
            
            if (isRealFullscreen || isPseudoFullscreen) {
                if (isRealFullscreen) {
                    try {
                        if (document.exitFullscreen) document.exitFullscreen();
                        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
                    } catch (e) {}
                }
                if (isPseudoFullscreen) exitPseudo();
                return;
            }
            
            const request = viewer && (viewer.requestFullscreen || viewer.webkitRequestFullscreen);
            if (request) {
                try {
                    const ret = (viewer.requestFullscreen) ? viewer.requestFullscreen() : viewer.webkitRequestFullscreen();
                    if (ret && typeof ret.catch === 'function') {
                        ret.then(() => setIcon(true)).catch(() => enterPseudo());
                    } else {
                        setIcon(true);
                    }
                } catch (e) {
                    enterPseudo();
                }
            } else {
                enterPseudo();
            }
        }
        
        document.addEventListener('fullscreenchange', updateFullscreenIcon);
        document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);
        
        function updateFullscreenIcon() {
            const icon = document.getElementById('fullscreen-icon');
            const viewer = document.getElementById('viewer');
            if (!icon || !viewer) return;
            
            const on = !!(document.fullscreenElement || document.webkitFullscreenElement) ||
                       viewer.classList.contains('pseudo-fullscreen');
            
            icon.classList.toggle('fa-expand', !on);
            icon.classList.toggle('fa-compress', on);
        }
        
        // ========== しおり機能 ==========
        let bookmarks = [];
        const workId = <?= $workId ?>;
        
        function toggleBookmarkPanel() {
            const panel = document.getElementById('bookmark-panel');
            if (panel) {
                panel.classList.toggle('hidden');
                if (!panel.classList.contains('hidden')) {
                    loadBookmarks();
                }
            }
        }
        
        function closeBookmarkPanel() {
            const panel = document.getElementById('bookmark-panel');
            if (panel) {
                panel.classList.add('hidden');
            }
        }
        
        async function loadBookmarks() {
            if (!isPurchased) return;
            
            try {
                const response = await fetch(`/api/bookmarks.php?work_id=${workId}`);
                const data = await response.json();
                if (data.success) {
                    bookmarks = data.bookmarks || [];
                    renderBookmarks();
                }
            } catch (e) {
                console.error('Error loading bookmarks:', e);
            }
        }
        
        function renderBookmarks() {
            const list = document.getElementById('bookmark-list');
            if (!list) return;
            
            if (bookmarks.length === 0) {
                list.innerHTML = '<div class="bookmark-empty">しおりはありません</div>';
                return;
            }
            
            list.innerHTML = bookmarks.map(b => {
                const date = new Date(b.created_at);
                const dateStr = `${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2,'0')}`;
                return `
                    <div class="bookmark-item" onclick="goToBookmark(${b.page_number})">
                        <div class="bookmark-item-page">${b.page_number}</div>
                        <div class="bookmark-item-info">
                            <div class="bookmark-item-title">${escapeHtml(b.title || b.page_number + 'ページ')}</div>
                            <div class="bookmark-item-date">${dateStr}</div>
                        </div>
                        <button class="bookmark-item-delete" onclick="event.stopPropagation(); deleteBookmark(${b.page_number})" title="削除">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                `;
            }).join('');
        }
        
        function escapeHtml(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }
        
        async function addBookmark() {
            if (!isPurchased) return;
            
            const pageNumber = getCurrentPageIndex() + 1;
            const title = prompt('しおりの名前を入力してください（空欄でもOK）', `${pageNumber}ページ`);
            
            if (title === null) return; // キャンセル
            
            try {
                const response = await fetch('/api/bookmarks.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        work_id: workId,
                        page_number: pageNumber,
                        title: title || `${pageNumber}ページ`
                    })
                });
                const data = await response.json();
                if (data.success) {
                    showToast('しおりを追加しました');
                    loadBookmarks();
                } else {
                    showToast(data.error || 'エラーが発生しました');
                }
            } catch (e) {
                console.error('Error adding bookmark:', e);
                showToast('エラーが発生しました');
            }
        }
        
        async function deleteBookmark(pageNumber) {
            if (!confirm('このしおりを削除しますか？')) return;
            
            try {
                const response = await fetch('/api/bookmarks.php', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        work_id: workId,
                        page_number: pageNumber
                    })
                });
                const data = await response.json();
                if (data.success) {
                    showToast('しおりを削除しました');
                    loadBookmarks();
                }
            } catch (e) {
                console.error('Error deleting bookmark:', e);
            }
        }
        
        function goToBookmark(pageNumber) {
            closeBookmarkPanel();
            goToPageByIndex(pageNumber - 1);
        }
        
        function shareToX() {
            const title = <?= json_encode($work['title']) ?>;
            const url = '<?= htmlspecialchars($siteUrl) ?>/manga/<?= $workId ?>';
            const text = `「${title}」を読んでいます`;
            const shareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            window.open(shareUrl, '_blank', 'width=550,height=420');
        }
        
        function copyLink() {
            const url = '<?= htmlspecialchars($siteUrl) ?>/manga/<?= $workId ?>';
            navigator.clipboard.writeText(url).then(() => {
                showToast('リンクをコピーしました');
            }).catch(() => {
                const textarea = document.createElement('textarea');
                textarea.value = url;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                showToast('リンクをコピーしました');
            });
        }
        
        function showToast(message) {
            const existing = document.querySelector('.toast');
            if (existing) existing.remove();
            
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.innerHTML = `<i class="fas fa-check"></i>${message}`;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.classList.add('fade-out');
                setTimeout(() => toast.remove(), 300);
            }, 2000);
        }
        
        function showHelp() {
            const dir = readingDirection === 'rtl' ? '右から左へ' : '左から右へ';
            const mode = viewMode === 'scroll' ? '縦スクロール' : 'ページめくり';
            
            let controlsHTML = '';
            
            if (viewMode === 'scroll') {
                controlsHTML = `
                    <div class="help-item">
                        <div class="help-item-icon"><i class="fas fa-arrows-alt-v"></i></div>
                        <div class="help-item-text">
                            <div class="help-item-label">${isMobile ? 'スワイプ' : 'スクロール'}</div>
                            <div class="help-item-desc">画面を上下に${isMobile ? 'スワイプ' : 'スクロール'}して読み進めます</div>
                        </div>
                    </div>
                    <div class="help-item">
                        <div class="help-item-icon"><i class="fas fa-hand-pointer"></i></div>
                        <div class="help-item-text">
                            <div class="help-item-label">画面${isMobile ? 'タップ' : 'クリック'}</div>
                            <div class="help-item-desc">メニューの表示/非表示を切り替え</div>
                        </div>
                    </div>
                `;
            } else {
                if (isMobile) {
                    controlsHTML = `
                        <div class="help-item">
                            <div class="help-item-icon"><i class="fas fa-hand-pointer"></i></div>
                            <div class="help-item-text">
                                <div class="help-item-label">タップ操作</div>
                                <div class="help-item-desc">左側：${readingDirection === 'rtl' ? '次のページ' : '前のページ'}</div>
                                <div class="help-item-desc">右側：${readingDirection === 'rtl' ? '前のページ' : '次のページ'}</div>
                                <div class="help-item-desc">中央：メニュー表示/非表示</div>
                            </div>
                        </div>
                        <div class="help-item">
                            <div class="help-item-icon"><i class="fas fa-hand-paper"></i></div>
                            <div class="help-item-text">
                                <div class="help-item-label">スワイプ</div>
                                <div class="help-item-desc">左右にスワイプしてページ移動</div>
                            </div>
                        </div>
                        <div class="help-item">
                            <div class="help-item-icon"><i class="fas fa-search-plus"></i></div>
                            <div class="help-item-text">
                                <div class="help-item-label">ピンチ操作</div>
                                <div class="help-item-desc">2本指で拡大、ドラッグで移動</div>
                                <div class="help-item-desc">※端までドラッグでページ移動</div>
                            </div>
                        </div>
                    `;
                } else {
                    controlsHTML = `
                        <div class="help-item">
                            <div class="help-item-icon"><i class="fas fa-mouse"></i></div>
                            <div class="help-item-text">
                                <div class="help-item-label">クリック操作</div>
                                <div class="help-item-desc">左側：${readingDirection === 'rtl' ? '次のページ' : '前のページ'}</div>
                                <div class="help-item-desc">右側：${readingDirection === 'rtl' ? '前のページ' : '次のページ'}</div>
                                <div class="help-item-desc">中央：メニュー表示/非表示</div>
                            </div>
                        </div>
                        <div class="help-item">
                            <div class="help-item-icon"><i class="fas fa-keyboard"></i></div>
                            <div class="help-item-text">
                                <div class="help-item-label">キーボード</div>
                                <div class="help-item-desc">← → ：ページ移動</div>
                                <div class="help-item-desc">Space：次のページ</div>
                                <div class="help-item-desc">Esc：戻る / ズーム解除</div>
                            </div>
                        </div>
                        <div class="help-item">
                            <div class="help-item-icon"><i class="fas fa-search-plus"></i></div>
                            <div class="help-item-text">
                                <div class="help-item-label">拡大</div>
                                <div class="help-item-desc">右下のボタンで拡大</div>
                                <div class="help-item-desc">中央ダブルクリックで拡大/原寸</div>
                            </div>
                        </div>
                    `;
                }
            }
            
            const helpHTML = `
                <div class="help-overlay" onclick="this.remove()">
                    <div class="help-card" onclick="event.stopPropagation()">
                        <div class="help-header">
                            <div class="help-title">
                                <i class="fas fa-question-circle"></i>
                                操作方法
                            </div>
                            <button class="help-close" onclick="this.closest('.help-overlay').remove()">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="help-content">
                            <div class="help-section">
                                <div class="help-section-title">
                                    <i class="fas fa-cog"></i>
                                    表示設定
                                </div>
                                <div class="help-item">
                                    <div class="help-item-icon"><i class="fas fa-book-open"></i></div>
                                    <div class="help-item-text">
                                        <div class="help-item-label">${mode}</div>
                                        <div class="help-item-desc">${viewMode !== 'scroll' ? `読む方向：${dir}` : ''}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="help-section">
                                <div class="help-section-title">
                                    <i class="fas fa-hand-pointer"></i>
                                    操作方法
                                </div>
                                ${controlsHTML}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', helpHTML);
        }
        
        // 試し読み制限チェック（購入ページが追加されるため常にtrue）
        function checkPreviewLimit(pageIndex) {
            return true;
        }
        
        // 購入促進モーダル表示（後方互換のため残す）
        function showPurchaseModal() {
            // 購入ページがあるので通常は呼ばれない
            if (document.getElementById('purchase-modal')) return;
            
            const price = productInfo ? '¥' + Number(productInfo.price).toLocaleString() : '';
            const backUrl = getBackUrl();
            
            const modalHTML = `
            <div id="purchase-modal" style="
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.95);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            ">
                <div style="
                    background: white;
                    border-radius: 20px;
                    max-width: 400px;
                    width: 100%;
                    padding: 32px;
                    text-align: center;
                ">
                    <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 12px; color: #1f2937;">
                        試し読みはここまで
                    </h2>
                    <p style="color: #6b7280; margin-bottom: 24px;">
                        続きを読むには商品をご購入ください
                    </p>
                    <a href="/store/product.php?id=${productInfo ? productInfo.id : ''}" style="
                        display: block;
                        background: linear-gradient(135deg, #22c55e, #10b981);
                        color: white;
                        padding: 16px 32px;
                        border-radius: 12px;
                        font-weight: bold;
                        text-decoration: none;
                        margin-bottom: 16px;
                    ">
                        購入する ${price}
                    </a>
                    <a href="${backUrl}" style="color: #6b7280; text-decoration: none;">戻る</a>
                </div>
            </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
        
        function closePurchaseModal() {
            const modal = document.getElementById('purchase-modal');
            if (modal) modal.remove();
        }
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    </script>
</body>
</html>
