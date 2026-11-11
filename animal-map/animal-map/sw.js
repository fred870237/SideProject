// 離線快取：第一次開啟後，地圖、程式和音檔都會存在 iPad 上
// 修改程式後把版本號 +1，iPad 下次開啟就會更新
const CACHE = 'animal-map-v66';
importScripts('voices.js'); // VOICE_CLIPS：預先生成的語音清單（audio/voice/<語言>/<名稱>.mp3）
const CORE = [
  './',
  'index.html',
  'city.html',
  'city-map.js',
  'vehicles.js',
  'art/vehicles.js',
  'abc.html',
  'abc.css',
  'abc.js',
  'zhuyin.js',
  'recordings.js',
  'sounds.js',
  'timer.js',
  'voice-ui.js',
  'town.html',
  'town.css',
  'town.js',
  'region.html',
  'region.css',
  'region.js',
  'travel.js',
  'travel.css',
  'travel-map.js',
  'regions/taiwan.js',
  'regions/japan.js',
  'regions/china.js',
  'regions/europe.js',
  'regions/africa.js',
  'regions/australia.js',
  'regions/usa.js',
  'regions/south-america.js',
  'regions/arctic.js',
  'regions/antarctica.js',
  'regions/india.js',
  'regions/korea.js',
  'regions/canada.js',
  'regions/thailand.js',
  'regions/new-zealand.js',
  'regions/russia.js',
  'record.html',
  'record.css',
  'record.js',
  'trace.html',
  'trace.css',
  'trace.js',
  'draw.html',
  'draw.css',
  'draw.js',
  'style.css',
  'app.js',
  'japanese.js',
  'animals.js',
  'art/kit.js',
  'art/north.js',
  'art/south-europe.js',
  'art/africa.js',
  'art/asia.js',
  'art/reptiles.js',
  'art/siberia.js',
  'art/more.js',
  'art/landmarks.js',
  'map-shapes.js',
  'songs.js',
  'voices.js',
  'voice-clips.js',
  'song-player.js',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png',
  // 預先生成的語音也存起來，沒有網路也能播
  // 中文的 AI 語音先關掉了（見 voice-clips.js 的 OFF），先不下載
  ...Object.entries(VOICE_CLIPS).filter(([lang]) => lang !== 'zh').flatMap(([lang, list]) => list.map((s) => `audio/voice/${lang}/${s}.mp3`)),
  // 兒歌的人聲（tools/voice/soulx.py 生成）
  ...['abc', 'twinkle', 'old-macdonald', 'mary', 'row', 'baa-baa', 'itsy-bitsy', 'london-bridge'].map((id) => `audio/songs/${id}.mp3`),
];

self.addEventListener('install', (e) => {
  // cache: 'reload' 直接跟伺服器拿最新檔案，不要拿到瀏覽器自己暫存的舊版
  const fresh = CORE.map((url) => new Request(url, { cache: 'reload' }));
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(fresh)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      // 只刪自己的舊版快取：同一個網域（例如 GitHub Pages）上的其他 App 也有自己的快取
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('animal-map-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // Safari 播放音檔會用 Range 請求，要回傳 206 才能播
  if (req.headers.get('range')) { e.respondWith(rangeResponse(req)); return; }
  e.respondWith(staleWhileRevalidate(req));
});

async function staleWhileRevalidate(req) {
  const cache = await caches.open(CACHE);
  const exact = await cache.match(req);
  const network = fetch(req.url, { cache: 'no-cache' }) // 每次都跟伺服器確認有沒有新版
    .then((res) => { if (res.ok) cache.put(req, res.clone()); return res; })
    .catch(() => null);
  if (exact) return exact;
  // 網址的版本號（?v=）變了：一定要拿新檔案，新舊程式混在一起會壞掉；沒有網路時才退回舊的
  const fresh = await network;
  if (fresh) return fresh;
  return (await cache.match(req, { ignoreSearch: true })) || new Response('', { status: 504 });
}

async function rangeResponse(req) {
  const cache = await caches.open(CACHE);
  let res = await cache.match(req.url);
  if (!res) {
    try { res = await fetch(req.url); } catch { return new Response('', { status: 504 }); }
    if (!res.ok) return res;
    cache.put(req.url, res.clone());
  }
  const buf = await res.arrayBuffer();
  const m = /bytes=(\d*)-(\d*)/.exec(req.headers.get('range')) || [];
  const start = m[1] ? Number(m[1]) : 0;
  const end = m[2] ? Math.min(Number(m[2]), buf.byteLength - 1) : buf.byteLength - 1;
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    headers: {
      'Content-Type': res.headers.get('Content-Type') || 'audio/mpeg',
      'Content-Range': `bytes ${start}-${end}/${buf.byteLength}`,
      'Content-Length': String(end - start + 1),
      'Accept-Ranges': 'bytes',
    },
  });
}
