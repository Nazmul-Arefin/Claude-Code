<?php
// Serves the public pages with the parts of <head> that come from the admin panel: the Meta Pixel base code
// on every page, and the SEO tags (title, description, Open Graph, verification, GTM/GA4, custom head code)
// on the landing page. .htaccess sends index.html, dashboard.html and the legal pages here.
// If anything goes wrong the page is still sent as is; assets/api.js then loads the Pixel by itself.

declare(strict_types=1);
require __DIR__ . '/lib.php';

const PAGES = ['index', 'dashboard', 'contact', 'privacy', 'refund', 'terms'];

$p = (string)($_GET['p'] ?? 'index');
if (!in_array($p, PAGES, true)) { http_response_code(404); exit; }
$html = (string)file_get_contents(__DIR__ . "/$p.html");

$head = '';
try {
    $seo = '';
    if ($p === 'index') {
        $seo = seo_head();
        // seo_head() has its own title and description.
        $html = preg_replace(['#<title>.*?</title>\s*#s', '#<meta name="description"[^>]*>\s*#'], '', $html, 1);
    }
    // A Pixel pasted into the custom head code already does the job; a second copy would double count.
    $pixel = stripos($seo, 'connect.facebook.net') === false ? pixel_head() : '';
    $head = trim($seo . "\n" . $pixel);
} catch (Throwable $e) {
    error_log('techill page: ' . $e->getMessage());
}
// Plain insert: custom head code may hold "$1" or "\\", which a regex replacement would rewrite.
$at = stripos($html, '</head>');
if ($head !== '' && $at !== false) $html = substr_replace($html, $head . "\n", $at, 0);

header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-cache');
echo $html;
