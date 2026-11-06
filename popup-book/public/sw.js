// 離線用的 service worker：網路優先（有網路時永遠拿最新的檔案），沒網路時用存起來的版本
// 新增檔案（例如新的一頁 art/<id>.js）要加進 CORE，並把版本號 +1
const CACHE = 'popup-book-v32';
importScripts('voices.js'); // self.VOICES：預先錄好的英文語音清單
const CORE = [
  './', 'index.html', 'style.css', 'app.js', 'themes.js', 'voices.js',
  ...self.VOICES.map((s) => `audio/en/${s}.mp3`),
  'art/kit.js', 'art/construction.js', 'art/building.js', 'art/rescue.js',
  ...['bg', 'pump', 'piledriver', 'crane', 'boomlift', 'skidsteer'].map((n) => `art/img/building/${n}.webp`), 'art/farm.js', 'art/trucks.js',
  ...['bg', 'crane', 'mixer', 'bulldozer', 'toilet', 'excavator', 'dumptruck', 'forklift', 'roller', 'worker']
    .map((n) => `art/img/construction/${n}.webp`),
  ...['bg', 'helicopter', 'ambulance', 'towtruck', 'motorbike', 'police', 'firetruck', 'hydrant', 'rescuer']
    .map((n) => `art/img/rescue/${n}.webp`),
  ...['bg', 'plane', 'windmill', 'pickup', 'baler', 'tractor', 'combine', 'quad']
    .map((n) => `art/img/farm/${n}.webp`),
  ...['bg', 'semi', 'garbage', 'van', 'icecream', 'carrier', 'monster', 'sweeper', 'courier']
    .map((n) => `art/img/trucks/${n}.webp`),
  'art/sea.js',
  ...['bg', 'cargo', 'sailboat', 'tugboat', 'fishing', 'speedboat', 'submarine', 'lighthouse']
    .map((n) => `art/img/sea/${n}.webp`),
  'art/sky.js',
  ...['bg', 'airliner', 'balloon', 'biplane', 'airship', 'glider', 'jet', 'helicopter', 'tower']
    .map((n) => `art/img/sky/${n}.webp`),
  'art/space.js',
  ...['bg', 'rocket', 'saucer', 'astronaut', 'rover', 'satellite', 'lander', 'station']
    .map((n) => `art/img/space/${n}.webp`),
  'art/savanna.js',
  ...['bg', 'lion', 'elephant', 'giraffe', 'zebra', 'hippo', 'rhino', 'meerkat']
    .map((n) => `art/img/savanna/${n}.webp`),
  'art/jungle.js',
  ...['bg', 'monkey', 'sloth', 'parrot', 'tiger', 'snake', 'frog', 'gorilla', 'iguana']
    .map((n) => `art/img/jungle/${n}.webp`),
  'art/farm-animals.js',
  ...['bg', 'cow', 'pig', 'sheep', 'horse', 'rooster', 'hen', 'duck']
    .map((n) => `art/img/farm-animals/${n}.webp`),
  'art/ocean.js',
  ...['bg', 'whale', 'dolphin', 'shark', 'turtle', 'octopus', 'crab', 'clownfish']
    .map((n) => `art/img/ocean/${n}.webp`),
  'art/polar.js',
  ...['bg', 'polarbear', 'penguin', 'seal', 'walrus', 'fox', 'owl', 'orca']
    .map((n) => `art/img/polar/${n}.webp`),
  'art/forest.js',
  ...['bg', 'bear', 'deer', 'owl', 'squirrel', 'rabbit', 'hedgehog', 'woodpecker', 'wolf']
    .map((n) => `art/img/forest/${n}.webp`),
  'art/pets.js',
  ...['bg', 'bichon', 'shiba', 'cat', 'hamster', 'goldfish', 'budgie', 'guineapig', 'tortoise']
    .map((n) => `art/img/pets/${n}.webp`),
  'art/dino-valley.js',
  ...['bg', 'trex', 'triceratops', 'stegosaurus', 'brachiosaurus', 'ankylosaurus', 'raptor', 'parasaurolophus']
    .map((n) => `art/img/dino-valley/${n}.webp`),
  'art/dino-sky.js',
  ...['bg', 'pteranodon', 'quetzalcoatlus', 'rhamphorhynchus', 'tapejara', 'dimorphodon', 'archaeopteryx', 'microraptor']
    .map((n) => `art/img/dino-sky/${n}.webp`),
  'art/dino-sea.js',
  ...['bg', 'ichthyosaurus', 'plesiosaurus', 'archelon', 'mosasaurus', 'ammonite', 'dunkleosteus', 'trilobite']
    .map((n) => `art/img/dino-sea/${n}.webp`),
  'art/dino-nest.js',
  ...['bg', 'maiasaura', 'oviraptor', 'protoceratops', 'compsognathus', 'egg-a', 'egg-b', 'egg-c',
    'baby-trex', 'baby-triceratops', 'baby-brachiosaurus']
    .map((n) => `art/img/dino-nest/${n}.webp`),
  'art/volcano.js',
  ...['bg', 'volcano', 'spinosaurus', 'pachycephalosaurus', 'dilophosaurus', 'diplodocus', 'iguanodon', 'carnotaurus']
    .map((n) => `art/img/volcano/${n}.webp`),
  'art/fossil-museum.js',
  ...['bg', 'trex', 'triceratops', 'stegosaurus', 'brachiosaurus', 'raptor', 'pteranodon', 'ammonite']
    .map((n) => `art/img/fossil-museum/${n}.webp`),
  ...['lion', 'elephant', 'rhino', 'macaque', 'parrot', 'tiger', 'anaconda', 'frog', 'chimpanzee',
    'cow', 'pig', 'sheep', 'horse', 'rooster', 'whale', 'dolphin', 'polar-bear', 'seal', 'fox', 'snowy-owl',
    'brown-bear', 'squirrel', 'wolf', 'dog', 'cat']
    .map((n) => `audio/sound/${n}.mp3`),
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
