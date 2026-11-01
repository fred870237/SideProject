// 動物著色本：把地圖上的動物插圖自動變成線稿，讓小朋友塗顏色，同時學英文
// 兩層畫布：下面 paint 是顏色，上面 lines 是黑色線稿（顏色永遠不會蓋到線）

const SIZE = 1024;           // 畫布實際像素
const SVGNS = 'http://www.w3.org/2000/svg';

const COLORS = [
  { hex: '#e53935', en: 'Red',        zh: '紅色' },
  { hex: '#fb8c00', en: 'Orange',     zh: '橘色' },
  { hex: '#fdd835', en: 'Yellow',     zh: '黃色' },
  { hex: '#7cb342', en: 'Green',      zh: '綠色' },
  { hex: '#4fc3f7', en: 'Light Blue', zh: '淺藍色' },
  { hex: '#1e5bb8', en: 'Blue',       zh: '藍色' },
  { hex: '#8e44ad', en: 'Purple',     zh: '紫色' },
  { hex: '#f48fb1', en: 'Pink',       zh: '粉紅色' },
  { hex: '#8d5524', en: 'Brown',      zh: '咖啡色' },
  { hex: '#f6d7b0', en: 'Peach',      zh: '膚色' },
  { hex: '#9e9e9e', en: 'Gray',       zh: '灰色' },
  { hex: '#212121', en: 'Black',      zh: '黑色' },
  { hex: '#ffffff', en: 'White',      zh: '白色' },
];

const BLANK = { id: 'blank', en: 'Blank Paper', zh: '白紙' };
// 兩套圖：動物、車子（網址 ?set=vehicles 時先打開車子）
const SETS = {
  animals: ANIMALS.filter((a) => ART[a.id]).map((a) => ({ ...a, set: 'animals' })),
  vehicles: VEHICLES.filter((a) => ART[a.id]).map((a) => ({ ...a, set: 'vehicles' })),
};
const PAGES = [BLANK, ...SETS.animals, ...SETS.vehicles];
let currentSet = new URLSearchParams(location.search).get('set') === 'vehicles' ? 'vehicles' : 'animals';

const $ = (id) => document.getElementById(id);
const paint = $('paint'), lines = $('lines');
// 不加 willReadFrequently：加了 Safari 會改用 CPU 畫，iPad 畫筆會很卡（只有油漆桶和存檔才讀像素）
const pctx = paint.getContext('2d');
const lctx = lines.getContext('2d');
[paint, lines].forEach((c) => { c.width = c.height = SIZE; });

const state = {
  page: BLANK,
  color: COLORS[0],
  tool: 'fill',
  size: 24,
  inside: true,
  walls: new Uint8Array(SIZE * SIZE), // 1 = 線（油漆桶的邊界）
  hasWalls: false,                    // 白紙或線稿還沒載入時是 false
  undo: [],                           // 每一步存一張畫布（複製畫布比 getImageData 快很多）
  saved: new Map(),                   // 換動物時暫存已經塗好的顏色
  loadToken: 0,
};

// ---------- 把彩色插圖變成線稿 ----------
function hexLum(c) {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(c || '');
  if (!m) return 128;
  let h = m[1];
  if (h.length === 3) h = h.replace(/./g, '$&$&');
  const n = parseInt(h, 16);
  return ((n >> 16) * 0.3 + ((n >> 8) & 255) * 0.59 + (n & 255) * 0.11);
}

function lineArt(id) {
  const tmp = document.createElementNS(SVGNS, 'svg');
  tmp.innerHTML = ART[id]();
  tmp.querySelectorAll('*').forEach((el) => {
    if (el.tagName === 'g') return;
    const fill = el.getAttribute('fill');
    const stroke = el.getAttribute('stroke');
    const hasStroke = stroke && stroke !== 'none';
    if (fill === 'none') {
      // 線條：如果是疊在粗黑線上的彩色細線（尾巴、象鼻），改白色變成空心；其他彩色線改成黑線
      if (!hasStroke || stroke.toLowerCase() === LINE) return;
      const prev = el.previousElementSibling;
      const hollow = prev && prev.getAttribute('d') === el.getAttribute('d') && prev.getAttribute('stroke') === LINE;
      el.setAttribute('stroke', hollow ? '#fff' : LINE);
      if (!hollow) el.setAttribute('stroke-width', Math.min(Number(el.getAttribute('stroke-width')) || 2, 2.2));
    } else if (hasStroke) {
      el.setAttribute('fill', '#fff');          // 有外框的形狀：留外框、裡面變白
    } else {
      const lum = hexLum(fill);
      const op = Number(el.getAttribute('opacity') || 1);
      if (lum < 70 || lum > 245) return;         // 眼睛、鼻子、眼睛反光保留
      if (op < 1) { el.remove(); return; }       // 腮紅拿掉
      el.setAttribute('fill', '#fff');          // 花紋、肚子：變成可以塗的小區塊
      el.setAttribute('stroke', LINE);
      el.setAttribute('stroke-width', '1.4');
    }
  });
  return tmp.innerHTML;
}

const lineCache = new Map();
const getLines = (id) => {
  if (!lineCache.has(id)) lineCache.set(id, lineArt(id));
  return lineCache.get(id);
};
const svgString = (inner, size) =>
  `<svg xmlns="${SVGNS}" viewBox="-54 -54 108 108" width="${size}" height="${size}">${inner}</svg>`;

// 算好的線稿和邊界留著，最近畫過的動物切回來就不用重算（每份約 5MB，只留幾隻）
const pageCache = new Map(); // id -> { out: ImageData, walls: Uint8Array, any }
const PAGE_CACHE_MAX = 6;

// 把線稿畫到 lines 畫布，並算出油漆桶的邊界
function loadPage(page) {
  const token = ++state.loadToken;
  lctx.clearRect(0, 0, SIZE, SIZE);
  state.walls.fill(0);
  state.hasWalls = false;
  if (page.id === 'blank') return Promise.resolve();
  const hit = pageCache.get(page.id);
  if (hit) {
    pageCache.delete(page.id); pageCache.set(page.id, hit); // 移到最新
    lctx.putImageData(hit.out, 0, 0);
    state.walls.set(hit.walls);
    state.hasWalls = hit.any;
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      if (token !== state.loadToken) return resolve();
      const off = document.createElement('canvas');
      off.width = off.height = SIZE;
      const octx = off.getContext('2d', { willReadFrequently: true });
      octx.fillStyle = '#fff';
      octx.fillRect(0, 0, SIZE, SIZE);
      octx.drawImage(img, 0, 0, SIZE, SIZE);
      const src = octx.getImageData(0, 0, SIZE, SIZE);
      const out = lctx.createImageData(SIZE, SIZE);
      const d = src.data, o = out.data, walls = state.walls;
      let any = false;
      for (let i = 0, p = 0; p < walls.length; i += 4, p++) {
        const lum = d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11;
        if (lum < 170) { walls[p] = 1; any = true; }
        const a = Math.min(255, (255 - lum) * 1.8);
        if (a > 8) { o[i] = d[i]; o[i + 1] = d[i + 1]; o[i + 2] = d[i + 2]; o[i + 3] = a; }
      }
      lctx.putImageData(out, 0, 0);
      state.hasWalls = any;
      pageCache.set(page.id, { out, walls: walls.slice(), any });
      if (pageCache.size > PAGE_CACHE_MAX) pageCache.delete(pageCache.keys().next().value);
      resolve();
    };
    img.onerror = () => resolve();
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString(getLines(page.id), SIZE));
  });
}

// ---------- 油漆桶：找出同一塊區域 ----------
function nearestOpen(x, y) {
  const walls = state.walls;
  for (let r = 0; r <= 8; r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < SIZE && ny < SIZE && !walls[ny * SIZE + nx]) return [nx, ny];
      }
    }
  }
  return null;
}

// 回傳 { mask, box }，mask 往線底下多長 3px，塗起來邊緣才不會有白邊
function region(x, y) {
  const start = nearestOpen(x, y);
  if (!start) return null;
  const walls = state.walls;
  const mask = new Uint8Array(SIZE * SIZE);
  let x0 = SIZE, y0 = SIZE, x1 = 0, y1 = 0;
  const stack = [start[0], start[1]];
  while (stack.length) {
    const sy = stack.pop(), sx = stack.pop();
    let lx = sx;
    while (lx > 0 && !walls[sy * SIZE + lx - 1] && !mask[sy * SIZE + lx - 1]) lx--;
    let rx = sx;
    while (rx < SIZE - 1 && !walls[sy * SIZE + rx + 1] && !mask[sy * SIZE + rx + 1]) rx++;
    for (let i = lx; i <= rx; i++) mask[sy * SIZE + i] = 1;
    if (lx < x0) x0 = lx; if (rx > x1) x1 = rx;
    if (sy < y0) y0 = sy; if (sy > y1) y1 = sy;
    for (const ny of [sy - 1, sy + 1]) {
      if (ny < 0 || ny >= SIZE) continue;
      let open = false;
      for (let i = lx; i <= rx; i++) {
        const p = ny * SIZE + i;
        const ok = !walls[p] && !mask[p];
        if (ok && !open) { stack.push(i, ny); open = true; } else if (!ok) open = false;
      }
    }
  }
  // 往線底下長
  for (let pass = 0; pass < 3; pass++) {
    x0 = Math.max(0, x0 - 1); y0 = Math.max(0, y0 - 1);
    x1 = Math.min(SIZE - 1, x1 + 1); y1 = Math.min(SIZE - 1, y1 + 1);
    const grow = [];
    for (let yy = y0; yy <= y1; yy++) {
      for (let xx = x0; xx <= x1; xx++) {
        const p = yy * SIZE + xx;
        if (mask[p] || !walls[p]) continue;
        if ((xx > 0 && mask[p - 1] === 1) || (xx < SIZE - 1 && mask[p + 1] === 1) ||
            (yy > 0 && mask[p - SIZE] === 1) || (yy < SIZE - 1 && mask[p + SIZE] === 1)) grow.push(p);
      }
    }
    grow.forEach((p) => { mask[p] = 2; });
    grow.forEach((p) => { mask[p] = 1; });
  }
  return { mask, box: [x0, y0, x1 - x0 + 1, y1 - y0 + 1] };
}

function hexRGB(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
}

function bucket(x, y) {
  const r = region(x, y);
  if (!r) return;
  pushUndo();
  const [bx, by, bw, bh] = r.box;
  const img = pctx.getImageData(bx, by, bw, bh);
  const d = img.data;
  const [cr, cg, cb] = hexRGB(state.color.hex);
  for (let yy = 0; yy < bh; yy++) {
    for (let xx = 0; xx < bw; xx++) {
      if (!r.mask[(by + yy) * SIZE + bx + xx]) continue;
      const i = (yy * bw + xx) * 4;
      d[i] = cr; d[i + 1] = cg; d[i + 2] = cb; d[i + 3] = 255;
    }
  }
  pctx.putImageData(img, bx, by);
  changed();
}

// ---------- 畫筆 / 橡皮擦 ----------
const base = document.createElement('canvas');
const strokeC = document.createElement('canvas');
const maskC = document.createElement('canvas');
[base, strokeC, maskC].forEach((c) => { c.width = c.height = SIZE; });
const bctx = base.getContext('2d'), sctx = strokeC.getContext('2d'), mctx = maskC.getContext('2d');

let drawing = null; // { id, last:[x,y], clip:boolean, rect }
// iPad 畫起來順的關鍵：每一小段只處理筆畫經過的那一塊（dirty），而且一個畫面只重畫一次（requestAnimationFrame）
let dirty = null;   // [x0, y0, x1, y1] 還沒畫到 paint 的範圍
let frame = 0;

function toCanvas(e, r = paint.getBoundingClientRect()) {
  return [Math.round((e.clientX - r.left) * SIZE / r.width), Math.round((e.clientY - r.top) * SIZE / r.height)];
}

function startStroke(e, x, y) {
  pushUndo();
  bctx.clearRect(0, 0, SIZE, SIZE);
  bctx.drawImage(paint, 0, 0);
  sctx.clearRect(0, 0, SIZE, SIZE);
  dirty = null;
  let clip = false;
  // 白紙沒有線，不用算區域
  if (state.inside && state.hasWalls) {
    const r = region(x, y);
    if (r) {
      // 遮罩只做區域那一塊，外面清成透明
      const [bx, by, bw, bh] = r.box;
      const m = mctx.createImageData(bw, bh);
      for (let yy = 0; yy < bh; yy++) {
        const row = (by + yy) * SIZE + bx;
        for (let xx = 0; xx < bw; xx++) if (r.mask[row + xx]) m.data[(yy * bw + xx) * 4 + 3] = 255;
      }
      mctx.clearRect(0, 0, SIZE, SIZE);
      mctx.putImageData(m, bx, by);
      clip = true;
    }
  }
  drawing = { id: e.pointerId, last: [x, y], clip, rect: paint.getBoundingClientRect() };
  strokeTo(x, y);
}

function strokeTo(x, y) {
  const [lx, ly] = drawing.last;
  const width = (state.tool === 'eraser' ? 48 : state.size) * 1.6;
  sctx.globalCompositeOperation = 'source-over';
  sctx.strokeStyle = state.tool === 'eraser' ? '#000' : state.color.hex;
  sctx.lineWidth = width;
  sctx.lineCap = sctx.lineJoin = 'round';
  sctx.beginPath();
  sctx.moveTo(lx, ly);
  sctx.lineTo(x + 0.01, y);
  sctx.stroke();
  drawing.last = [x, y];
  const pad = width / 2 + 2;
  const x0 = Math.max(0, Math.floor(Math.min(lx, x) - pad)), y0 = Math.max(0, Math.floor(Math.min(ly, y) - pad));
  const x1 = Math.min(SIZE, Math.ceil(Math.max(lx, x) + pad)), y1 = Math.min(SIZE, Math.ceil(Math.max(ly, y) + pad));
  if (x1 <= x0 || y1 <= y0) return;
  if (drawing.clip) {
    // destination-in 會清掉圖片範圍外的東西，所以先 clip 在這一段的範圍裡
    sctx.save();
    sctx.beginPath();
    sctx.rect(x0, y0, x1 - x0, y1 - y0);
    sctx.clip();
    sctx.globalCompositeOperation = 'destination-in';
    sctx.drawImage(maskC, x0, y0, x1 - x0, y1 - y0, x0, y0, x1 - x0, y1 - y0);
    sctx.restore();
  }
  dirty = dirty
    ? [Math.min(dirty[0], x0), Math.min(dirty[1], y0), Math.max(dirty[2], x1), Math.max(dirty[3], y1)]
    : [x0, y0, x1, y1];
  if (!frame) frame = requestAnimationFrame(render);
}

// 把 dirty 那一塊重新組合：底圖＋這一筆
function render() {
  frame = 0;
  if (!dirty) return;
  const [x0, y0, x1, y1] = dirty;
  const w = x1 - x0, h = y1 - y0;
  dirty = null;
  pctx.globalCompositeOperation = 'source-over';
  pctx.clearRect(x0, y0, w, h);
  pctx.drawImage(base, x0, y0, w, h, x0, y0, w, h);
  if (state.tool === 'eraser') pctx.globalCompositeOperation = 'destination-out';
  pctx.drawImage(strokeC, x0, y0, w, h, x0, y0, w, h);
  pctx.globalCompositeOperation = 'source-over';
}

paint.addEventListener('pointerdown', (e) => {
  if (drawing || !e.isPrimary) return; // 只認第一根手指，手掌碰到不會亂畫
  e.preventDefault();
  const [x, y] = toCanvas(e);
  if (state.tool === 'fill') { bucket(x, y); return; }
  try { paint.setPointerCapture(e.pointerId); } catch {}
  startStroke(e, x, y);
});
paint.addEventListener('pointermove', (e) => {
  if (!drawing || e.pointerId !== drawing.id) return;
  const coalesced = e.getCoalescedEvents ? e.getCoalescedEvents() : [];
  const events = coalesced.length ? coalesced : [e];
  events.forEach((ev) => { const [x, y] = toCanvas(ev, drawing.rect); strokeTo(x, y); });
});
const endStroke = (e) => {
  if (!drawing || e.pointerId !== drawing.id) return;
  if (frame) { cancelAnimationFrame(frame); render(); } // 最後一段馬上畫上去
  drawing = null;
  changed();
};
paint.addEventListener('pointerup', endStroke);
paint.addEventListener('pointercancel', endStroke);

// ---------- 上一步 ----------
const UNDO_MAX = 12;
function pushUndo() {
  // 滿了就拿最舊的那張畫布來重用
  let c = state.undo.length >= UNDO_MAX ? state.undo.shift() : null;
  if (!c) { c = document.createElement('canvas'); c.width = c.height = SIZE; }
  const cctx = c.getContext('2d');
  cctx.clearRect(0, 0, SIZE, SIZE);
  cctx.drawImage(paint, 0, 0);
  state.undo.push(c);
}
$('undoBtn').addEventListener('click', () => {
  const c = state.undo.pop();
  if (!c) return;
  pctx.clearRect(0, 0, SIZE, SIZE);
  pctx.drawImage(c, 0, 0);
  changed();
});
$('clearBtn').addEventListener('click', () => {
  pushUndo();
  pctx.clearRect(0, 0, SIZE, SIZE);
  changed();
});

// ---------- 自動保存：每隻動物塗的顏色存在 iPad 裡（IndexedDB），關掉 app 再開還在 ----------
const db = new Promise((resolve) => {
  try {
    const req = indexedDB.open('animal-draw', 1);
    req.onupgradeneeded = () => req.result.createObjectStore('works');
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
  } catch { resolve(null); }
});
async function store(mode, fn) {
  const d = await db;
  if (!d) return null;
  return new Promise((resolve) => {
    const req = fn(d.transaction('works', mode).objectStore('works'));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
  });
}

const isEmpty = (img) => { for (let i = 3; i < img.data.length; i += 4) if (img.data[i]) return false; return true; };

async function saveWork(id, img) {
  markWork(id, !isEmpty(img));
  if (isEmpty(img)) { await store('readwrite', (s) => s.delete(id)); return; }
  const c = document.createElement('canvas');
  c.width = c.height = SIZE;
  c.getContext('2d').putImageData(img, 0, 0);
  const blob = await new Promise((r) => c.toBlob(r, 'image/png'));
  if (blob) await store('readwrite', (s) => s.put({ blob, time: Date.now() }, id));
}

async function loadWork(id) {
  const rec = await store('readonly', (s) => s.get(id));
  if (!rec) return null;
  const img = await createImageBitmap(rec.blob).catch(() => null);
  if (!img) return null;
  const c = document.createElement('canvas');
  c.width = c.height = SIZE;
  const cctx = c.getContext('2d');
  cctx.drawImage(img, 0, 0);
  return cctx.getImageData(0, 0, SIZE, SIZE);
}

// 畫完一筆就排隊保存（停手 2 秒後才真的存，連續塗不會卡；換頁、關掉 app 時會馬上存）
let saveTimer = null;
function changed() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(flush, 2000);
}
function flush({ later = false } = {}) {
  if (saveTimer === null) return;
  clearTimeout(saveTimer);
  saveTimer = null;
  const id = state.page.id;
  const img = pctx.getImageData(0, 0, SIZE, SIZE);
  state.saved.set(id, img);
  if (!later) { pending.delete(id); saveWork(id, img); return; }
  // 換動物時：壓成 PNG 在 iPad 上要一段時間，先讓新的一頁出來，等沒在畫的時候再存
  pending.set(id, img);
  clearTimeout(pendingTimer);
  pendingTimer = setTimeout(savePending, 1500);
}
const pending = new Map(); // id -> ImageData，還沒寫進 IndexedDB 的
let pendingTimer = 0;
function savePending() {
  clearTimeout(pendingTimer);
  if (drawing) { pendingTimer = setTimeout(savePending, 1000); return; }
  pending.forEach((img, id) => saveWork(id, img));
  pending.clear();
}
const flushAll = () => { flush(); pending.size && savePending(); };
document.addEventListener('visibilitychange', () => { if (document.hidden) flushAll(); });
window.addEventListener('pagehide', flushAll);

// 有作品的卡片右上角顯示 🖍️
function markWork(id, has) {
  const el = document.querySelector(`.page[data-id="${id}"]`);
  if (el) el.classList.toggle('has-work', has);
}

// ---------- 說英文 ----------
let voices = [];
function loadVoices() { voices = 'speechSynthesis' in window ? speechSynthesis.getVoices() : []; }
if ('speechSynthesis' in window) {
  loadVoices();
  speechSynthesis.addEventListener('voiceschanged', loadVoices);
}
function pickVoice() {
  const en = voices.filter((v) => /^en[-_]US/i.test(v.lang));
  return en.find((v) => v.localService) || en[0] || voices.find((v) => /^en/i.test(v.lang)) || null;
}
function speak(text, { rate = 0.8, cancel = true } = {}) {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) return resolve();
    if (cancel) speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = rate;
    u.pitch = 1.1;
    const v = pickVoice();
    if (v) u.voice = v;
    let done = false;
    const finish = () => { if (!done) { done = true; resolve(); } };
    u.onend = u.onerror = finish;
    speechSynthesis.speak(u);
    setTimeout(finish, 4000);
  });
}

// 有放 audio/en/<id>.mp3 就用音檔，沒有就用系統語音
const player = new Audio();
const noMp3 = new Set(); // 找過沒有音檔的，下次直接用系統語音，不用再等
function sayAnimal(page) {
  if (page.id === 'blank') return speak('Paper');
  if (noMp3.has(page.id)) return speak(page.en);
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  let fell = false;
  const fallback = () => { if (!fell) { fell = true; noMp3.add(page.id); speak(page.en); } };
  player.onerror = fallback;
  player.src = `audio/en/${page.id}.mp3`;
  player.play().catch(fallback);
}

let bubbleTimer;
function bubble(html, color) {
  const b = $('bubble');
  b.innerHTML = html;
  b.style.color = color === '#ffffff' ? '#bbb' : color;
  b.classList.remove('hidden');
  b.style.animation = 'none'; void b.offsetWidth; b.style.animation = '';
  clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(() => b.classList.add('hidden'), 1400);
}

// ---------- 👀 範例：原本彩色的樣子，點一下放大 ----------
function showRef(page) {
  const blank = page.id === 'blank';
  $('ref').classList.toggle('hidden', blank);
  if (blank) return;
  const art = svgString(ART[page.id](), 100).replace(/ width="100" height="100"/, '');
  $('refArt').innerHTML = art;
  $('refBigArt').innerHTML = art;
  $('refBigName').textContent = `${page.en} ${page.zh}`;
}
$('ref').addEventListener('click', () => { $('refBig').classList.remove('hidden'); sayAnimal(state.page); });
$('refBig').addEventListener('click', () => $('refBig').classList.add('hidden'));

// ---------- 換頁 ----------
function showWord(page) {
  $('wordEn').textContent = page.en;
  $('wordZh').textContent = page.zh;
  const w = $('word');
  w.classList.remove('pop'); void w.offsetWidth; w.classList.add('pop');
}

async function choose(page) {
  if (page === state.page) { sayAnimal(page); showWord(page); return; }
  flush({ later: true });
  state.page = page;
  try { localStorage.setItem(`draw-last-${currentSet}`, page.id); } catch {}
  state.undo = [];
  document.querySelectorAll('.page').forEach((el) => el.classList.toggle('on', el.dataset.id === page.id));
  showWord(page);
  sayAnimal(page);
  showRef(page);
  pctx.clearRect(0, 0, SIZE, SIZE);
  const linesReady = loadPage(page);
  const prev = state.saved.get(page.id) || await loadWork(page.id);
  if (prev && state.page === page) {
    state.saved.set(page.id, prev);
    pctx.putImageData(prev, 0, 0);
  }
  await linesReady;
}

function buildPages() {
  const box = $('pages');
  PAGES.forEach((page) => {
    const b = document.createElement('button');
    b.className = 'page' + (page === state.page ? ' on' : '');
    b.dataset.id = page.id;
    if (page.set) b.dataset.set = page.set;
    b.setAttribute('aria-label', `${page.en} ${page.zh}`);
    b.innerHTML = (page.id === 'blank' ? '<svg></svg>' : svgString(getLines(page.id), 100).replace(/ width="100" height="100"/, '')) +
      `<span>${page.en}</span>`;
    b.addEventListener('click', () => choose(page));
    box.appendChild(b);
  });
}

// ---------- 顏料和工具 ----------
function buildPalette() {
  const box = $('palette');
  COLORS.forEach((c, i) => {
    const b = document.createElement('button');
    b.className = 'paint-dot' + (i === 0 ? ' on' : '');
    b.style.background = c.hex;
    b.setAttribute('aria-label', `${c.en} ${c.zh}`);
    b.addEventListener('click', () => {
      state.color = c;
      box.querySelectorAll('.paint-dot').forEach((el) => el.classList.toggle('on', el === b));
      document.documentElement.style.setProperty('--cur', c.hex);
      if (state.tool === 'eraser') setTool(document.querySelector('.tool[data-tool="fill"]'));
      bubble(`${c.en}<small>${c.zh}</small>`, c.hex); // 只顯示顏色名字，不唸
    });
    box.appendChild(b);
  });
  document.documentElement.style.setProperty('--cur', COLORS[0].hex);
}

function setTool(btn) {
  state.tool = btn.dataset.tool;
  if (btn.dataset.size) state.size = Number(btn.dataset.size);
  document.querySelectorAll('.tool[data-tool]').forEach((el) => el.classList.toggle('on', el === btn));
}
document.querySelectorAll('.tool[data-tool]').forEach((b) => b.addEventListener('click', () => setTool(b)));

$('inside').addEventListener('click', () => {
  state.inside = !state.inside;
  $('inside').classList.toggle('on', state.inside);
});

$('word').addEventListener('click', () => { showWord(state.page); sayAnimal(state.page); });

// 🔤 一個字母一個字母拼出來
let spelling = false;
$('spellBtn').addEventListener('click', async () => {
  if (spelling || state.page.id === 'blank') return;
  spelling = true;
  const word = state.page.en.toUpperCase();
  const box = $('spell');
  box.innerHTML = [...word].map((ch) => (ch === ' ' || ch === '-' ? '<b class="gap"></b>' : `<b>${ch}</b>`)).join('');
  const cells = [...box.children];
  for (let i = 0; i < word.length; i++) {
    if (cells[i].classList.contains('gap')) continue;
    cells[i].classList.add('lit');
    await speak(word[i].toLowerCase() === 'a' ? 'A' : word[i], { rate: 0.9 });
  }
  cells.forEach((c) => c.classList.add('lit'));
  await speak(state.page.en, { rate: 0.75 });
  setTimeout(() => { box.innerHTML = ''; spelling = false; }, 600);
});

// ⭐ 畫好了：撒彩帶＋稱讚
const PRAISE = ['Great job!', 'Beautiful!', 'Wonderful!', 'You did it!', 'So colorful!'];
$('doneBtn').addEventListener('click', () => {
  const box = $('confetti');
  box.innerHTML = '';
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('i');
    p.style.left = Math.random() * 100 + 'vw';
    p.style.background = COLORS[i % (COLORS.length - 2)].hex;
    p.style.animationDuration = 1.6 + Math.random() * 1.6 + 's';
    p.style.animationDelay = Math.random() * 0.5 + 's';
    box.appendChild(p);
  }
  setTimeout(() => { box.innerHTML = ''; }, 3800);
  const praise = PRAISE[Math.floor(Math.random() * PRAISE.length)];
  speak(state.page.id === 'blank' ? praise : `${praise} What a beautiful ${state.page.en.toLowerCase()}!`);
  if (state.page.id !== 'blank') addColoredSticker(state.page);
});

// 畫好了就在地圖的「📒 貼紙」冊裡蓋一個 🎨（和地圖共用同一份記錄）
function addColoredSticker(page) {
  let data = {};
  try { data = JSON.parse(localStorage.getItem('stickers')) || {}; } catch {}
  const isNew = !data[page.id];
  const rec = data[page.id] || (data[page.id] = {});
  rec.colored = (rec.colored || 0) + 1;
  try { localStorage.setItem('stickers', JSON.stringify(data)); } catch {}
  setTimeout(() => bubble(isNew ? `🎉 新貼紙：${page.zh}` : `🎨 ${page.zh} 畫好了`, '#e8501a'), 600);
}

// 📷 存成照片（iPad 會跳出分享選單，可以選「儲存影像」）
$('saveBtn').addEventListener('click', async () => {
  const out = document.createElement('canvas');
  out.width = out.height = SIZE;
  const o = out.getContext('2d');
  o.fillStyle = '#fff';
  o.fillRect(0, 0, SIZE, SIZE);
  o.drawImage(paint, 0, 0);
  o.drawImage(lines, 0, 0);
  if (state.page.id !== 'blank') {
    o.font = `900 56px ${getComputedStyle(document.body).fontFamily}`;
    o.fillStyle = '#2563eb';
    o.textAlign = 'center';
    o.fillText(state.page.en, SIZE / 2, SIZE - 24);
  }
  const blob = await new Promise((r) => out.toBlob(r, 'image/png'));
  const name = `${state.page.id}-${Date.now()}.png`;
  const file = new File([blob], name, { type: 'image/png' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file], title: state.page.en }); return; } catch (err) { if (err.name === 'AbortError') return; }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
});

// 🐾 動物 / 🚒 車子 分頁，左上角的返回鍵也跟著回到對應的地圖
function setSet(set) {
  currentSet = set;
  document.querySelectorAll('.page[data-set]').forEach((el) => el.classList.toggle('hidden', el.dataset.set !== set));
  document.querySelectorAll('.set-tab').forEach((el) => el.classList.toggle('on', el.dataset.set === set));
  $('backBtn').href = set === 'vehicles' ? 'city.html' : 'index.html';
  $('pages').scrollTo(0, 0);
}
document.querySelectorAll('.set-tab').forEach((b) => b.addEventListener('click', () => setSet(b.dataset.set)));

buildPages();
buildPalette();
setSet(currentSet);
showWord(BLANK);

// 打開時：標出有作品的卡片，並回到上次畫的那一張
(async () => {
  const ids = await store('readonly', (s) => s.getAllKeys());
  (ids || []).forEach((id) => markWork(id, true));
  let last = null;
  try { last = localStorage.getItem(`draw-last-${currentSet}`); } catch {}
  const page = PAGES.find((p) => p.id === last);
  if (page && page !== BLANK) {
    await choose(page);
    document.querySelector('.page.on')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  } else if (page === BLANK) {
    const prev = await loadWork('blank');
    if (prev && state.page === BLANK) { state.saved.set('blank', prev); pctx.putImageData(prev, 0, 0); }
  }
})();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
