// 離線用的 service worker：網路優先（內容永遠是最新的），沒網路或太慢時用存起來的版本。
// 安裝時把網頁本身和所有書（含插圖）都存起來，所以加到主畫面後沒有網路也能讀。
const CACHE = 'storybook-v3';
const SHELL = [
  './', 'index.html', 'style.css', 'app.js', 'icon.svg', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/apple-touch-icon.png', 'books/index.json',
];
const TIMEOUT = 3000; // 網路超過 3 秒沒回應就先用存起來的版本

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(SHELL.map((url) => new Request(url, { cache: 'reload' })));
    await cacheBooks();
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    // 只刪自己的舊版快取：同一個網域（例如 GitHub Pages）上的其他 App 也有自己的快取
    for (const key of await caches.keys()) if (key.startsWith('storybook-') && key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});

// 網頁每次開啟都會傳 'cache-books'，把之後新增的書也存起來
self.addEventListener('message', (e) => {
  if (e.data === 'cache-books') e.waitUntil(cacheBooks());
});

async function cacheBooks() {
  const cache = await caches.open(CACHE);
  try {
    const { books } = await (await fetch('books/index.json', { cache: 'no-cache' })).json();
    await Promise.all(books.map(async (b) => {
      const url = `books/${b.id}.json`;
      let book = await (await cache.match(url))?.json();
      if (!book) {
        const res = await fetch(url);
        if (!res.ok) return;
        await cache.put(url, res.clone());
        book = await res.json();
      }
      // 插圖
      const images = [b.coverImage, book.coverImage, ...book.pages.map((p) => p.image)].filter(Boolean);
      for (const img of images) if (!(await cache.match(img))) await cache.add(img).catch(() => {});
    }));
  } catch {} // 沒網路就下次再補
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    // no-cache：每次都向伺服器確認有沒有新版（沒變只回 304），不然瀏覽器可能直接沿用舊檔
    const fresh = req.mode === 'navigate' ? fetch(req.url, { cache: 'no-cache' }) : fetch(req, { cache: 'no-cache' });
    const network = fresh.then((res) => {
      if (res.ok) cache.put(req, res.clone());
      return res;
    });
    const timeout = new Promise((resolve) => setTimeout(resolve, TIMEOUT));
    try {
      const res = await Promise.race([network, timeout]);
      if (res) return res;
    } catch {}
    // 網路失敗或太慢：用存起來的版本（網址的 #、? 不影響）
    const hit = await cache.match(req, { ignoreSearch: true });
    return hit || network;
  })());
});
