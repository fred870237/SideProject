// 離線用的 service worker：網路優先（有網路時永遠拿最新的檔案），沒網路時用存起來的版本
// 新增檔案（例如新的一頁 art/<id>.js）要加進 CORE，並把版本號 +1
const CACHE = 'popup-book-v4';
const CORE = [
  './', 'index.html', 'style.css', 'app.js', 'themes.js',
  'art/kit.js', 'art/construction.js', 'art/rescue.js', 'art/farm.js',
  ...['bg', 'crane', 'mixer', 'bulldozer', 'toilet', 'excavator', 'dumptruck', 'forklift', 'roller']
    .map((n) => `art/img/construction/${n}.webp`),
  ...['bg', 'helicopter', 'ambulance', 'towtruck', 'motorbike', 'police', 'firetruck', 'hydrant']
    .map((n) => `art/img/rescue/${n}.webp`),
  ...['bg', 'plane', 'windmill', 'pickup', 'baler', 'tractor', 'combine', 'quad']
    .map((n) => `art/img/farm/${n}.webp`),
  'icon.svg', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(CORE.map((url) => new Request(url, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      // 只刪自己的舊版快取：同一個網域（例如 GitHub Pages）上的其他 App 也有自己的快取
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('popup-book-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
