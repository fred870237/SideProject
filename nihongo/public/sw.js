// 網路優先、離線時使用快取，確保每次部署後拿到最新版本
const CACHE = 'nihongo-kids-v9';
const CORE = ['./', 'index.html', 'style.css', 'app.js', 'adult.js', 'data.js', 'n5.js', 'grammar.js', 'strokes.js', 'strokes-extra.js', 'icon.svg', 'manifest.webmanifest'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      // 只刪自己的舊版快取：同一個網域（例如 GitHub Pages）上的其他 App 也有自己的快取
      .then(keys => Promise.all(keys.filter(k => k.startsWith('nihongo-kids-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
