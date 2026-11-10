'use strict';

const $ = (sel) => document.querySelector(sel);
const SVG_NS = 'http://www.w3.org/2000/svg';
const MAP_W = 1000, MAP_H = 560;

const LANGS = {
  en: { label: 'English', tts: 'en-US' },
  zh: { label: '中文',    tts: 'zh-TW' },
  tw: { label: '台語',    tts: null },   // 系統沒有台語語音，要用錄音
  ja: { label: '日本語',  tts: 'ja-JP' },
};
const SEQUENCE = ['en', 'zh', 'tw', 'ja'];

// 動物版用 ANIMALS（世界地圖），車子版（city.html）用 VEHICLES（城市地圖）
const CITY = typeof cityScene === 'function';
const ITEMS = CITY ? VEHICLES : ANIMALS;

const state = {
  mode: storageGet('mode') || 'zh',
  current: null,
  parent: false,
  playToken: 0,
};

function storageGet(k) { try { return localStorage.getItem(k); } catch { return null; } }
function storageSet(k, v) { try { localStorage.setItem(k, v); } catch { /* 私密瀏覽等情況忽略 */ } }
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/* ================= 錄音儲存（IndexedDB） ================= */

const DB = {
  db: null,
  open() {
    return new Promise((resolve) => {
      if (!('indexedDB' in window)) return resolve(false);
      const req = indexedDB.open('animal-map', 1);
      req.onupgradeneeded = () => req.result.createObjectStore('rec');
      req.onsuccess = () => { this.db = req.result; resolve(true); };
      req.onerror = () => resolve(false);
    });
  },
  store(mode) { return this.db.transaction('rec', mode).objectStore('rec'); },
  all() {
    return new Promise((resolve) => {
      if (!this.db) return resolve([]);
      const out = [];
      const cur = this.store('readonly').openCursor();
      cur.onsuccess = () => {
        const c = cur.result;
        if (c) { out.push([c.key, c.value]); c.continue(); } else resolve(out);
      };
      cur.onerror = () => resolve(out);
    });
  },
  put(key, value) {
    return new Promise((resolve, reject) => {
      const r = this.store('readwrite').put(value, key);
      r.onsuccess = () => resolve(); r.onerror = () => reject(r.error);
    });
  },
  del(key) {
    return new Promise((resolve) => {
      const r = this.store('readwrite').delete(key);
      r.onsuccess = r.onerror = () => resolve();
    });
  },
};

const recordings = new Map();   // "lion_tw" -> blob URL（家長在 iPad 上錄的）
const audioFiles = new Map();   // "lion_tw" -> "audio/tw/lion.mp3"（放在資料夾裡的音檔）

function setRecording(key, blob) {
  if (recordings.has(key)) URL.revokeObjectURL(recordings.get(key));
  recordings.set(key, URL.createObjectURL(blob));
}

async function loadRecordings() {
  if (!(await DB.open())) return;
  for (const [key, v] of await DB.all()) {
    setRecording(key, new Blob([v.buf], { type: v.type }));
  }
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
}

// 找出 audio/<lang>/<id>.mp3 有哪些檔案存在（同時讓離線快取存起來）
async function probeAudioFiles() {
  const jobs = [];
  for (const a of ITEMS) {
    for (const lang of SEQUENCE) {
      const url = `audio/${lang}/${a.id}.mp3`;
      jobs.push(fetch(url).then((r) => { if (r.ok) audioFiles.set(`${a.id}_${lang}`, url); }).catch(() => {}));
    }
  }
  // 錄音室匯出的錄音（audio/recordings.json 列出每個檔案在哪裡）
  jobs.push(fetch('audio/recordings.json', { cache: 'no-cache' })
    .then((r) => (r.ok ? r.json() : {}))
    .then((list) => Object.entries(list).forEach(([key, url]) => { if (!audioFiles.has(key)) audioFiles.set(key, url); }))
    .catch(() => {}));
  await Promise.all(jobs);
  if (state.current) renderCard();
}

/* ================= 發音 ================= */

const player = new Audio();
player.preload = 'auto';
const SILENT_WAV = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';

// iOS 要在第一次觸控時「解鎖」聲音，之後才能連續播放
// （如果第一次觸控已經直接播放了動物聲音，就不用再解鎖）
let unlocked = false;
function unlockAudio() {
  if (unlocked) return;
  unlocked = true;
  player.src = SILENT_WAV;
  player.play().catch(() => {});
  if ('speechSynthesis' in window) {
    const u = new SpeechSynthesisUtterance(' ');
    u.volume = 0;
    speechSynthesis.speak(u);
  }
}
['touchend', 'click'].forEach((ev) => document.addEventListener(ev, unlockAudio, { capture: true, once: true }));

let voices = [];
function loadVoices() { voices = 'speechSynthesis' in window ? speechSynthesis.getVoices() : []; }
if ('speechSynthesis' in window) {
  loadVoices();
  speechSynthesis.addEventListener('voiceschanged', loadVoices);
}
function pickVoice(code) {
  const norm = (s) => s.replace('_', '-').toLowerCase();
  const exact = voices.filter((v) => norm(v.lang) === code.toLowerCase());
  if (exact.length) return exact.find((v) => v.localService) || exact[0];
  const base = code.split('-')[0];
  return voices.find((v) => norm(v.lang).startsWith(base)) || null;
}

// 預先生成的語音（voice-clips.js）優先，沒有才用系統語音
async function speakTTS(text, code) {
  const clip = VoiceClips.url(text, code);
  if (clip && await playSrc(clip)) return true;
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) return resolve(false);
    const u = new SpeechSynthesisUtterance(text);
    u.lang = code;
    u.rate = 0.8;     // 慢一點，小朋友比較聽得清楚
    u.pitch = 1.1;
    const v = pickVoice(code);
    if (v) u.voice = v;
    let done = false;
    const finish = (ok) => { if (!done) { done = true; resolve(ok); } };
    unlocked = true;
    u.onend = () => finish(true);
    u.onerror = () => finish(false);
    speechSynthesis.speak(u);
    setTimeout(() => finish(true), 5000); // 保險：某些瀏覽器不會觸發 onend
  });
}

function playSrc(src) {
  return new Promise((resolve) => {
    const finish = (ok) => { player.onended = player.onerror = null; resolve(ok); };
    player.onended = () => finish(true);
    player.onerror = () => finish(false);
    unlocked = true;
    player.src = src;
    player.play().catch(() => finish(false));
  });
}

function stopAll() {
  state.playToken++;
  player.pause();
  stopSound();
  if (typeof stopListening === 'function') stopListening();
  player.onended = player.onerror = null;
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  markSpeaking(null);
}

// 唸一種語言：家長錄音 → 資料夾音檔 → 系統語音
async function sayOne(animal, lang) {
  const key = `${animal.id}_${lang}`;
  markSpeaking(lang);
  if (recordings.has(key) && await playSrc(recordings.get(key))) return;
  if (audioFiles.has(key) && await playSrc(audioFiles.get(key))) return;
  if (LANGS[lang].tts) { await speakTTS(animal[lang], LANGS[lang].tts); return; }
  toast(`台語還沒錄音喔～「${animal.tw}」唸作 ${animal.twRom}`);
  await wait(1500);
}

async function say(animal, langs) {
  stopAll();
  const token = state.playToken;
  for (const lang of langs) {
    await sayOne(animal, lang);
    if (token !== state.playToken) return;
    await wait(400);
    if (token !== state.playToken) return;
  }
  markSpeaking(null);
}

const modeLangs = () => (state.mode === 'all' ? SEQUENCE : [state.mode]);

/* ================= 地圖繪製 ================= */

// 和 map-shapes.js 相同的 Miller 投影，把經緯度換成地圖座標
const MILLER_K = MAP_W / (2 * Math.PI);
const miller = (lat) => 1.25 * Math.log(Math.tan(Math.PI / 4 + 0.4 * (lat * Math.PI) / 180));
const MILLER_TOP = miller(84);
const project = (lon, lat) => [((lon + 180) / 360) * MAP_W, (MILLER_TOP - miller(lat)) * MILLER_K];

// 插畫風地圖：深藍海洋、綠色陸地＋白邊，沙漠、雨林、冰原用色塊，再撒上小樹、高山、雪花、小魚
const LAND_COLOR = '#8fd15a';
const AREAS = [
  // [顏色, 經緯度外框]
  ['#f7b04b', [[-16, 20], [-12, 28], [-5, 31], [5, 32], [15, 31], [25, 30], [33, 28], [35, 22], [33, 16], [20, 15], [5, 16], [-8, 17]]], // 撒哈拉
  ['#f7b04b', [[36, 30], [45, 30], [52, 25], [57, 20], [52, 15], [44, 13], [40, 18], [36, 26]]], // 阿拉伯
  ['#f5c66a', [[92, 44], [100, 46], [110, 45], [114, 42], [106, 40], [95, 40]]], // 戈壁
  ['#f5c66a', [[-118, 36], [-110, 38], [-102, 35], [-100, 29], [-106, 25], [-114, 29]]], // 北美沙漠
  ['#f5c66a', [[16, -20], [24, -19], [27, -24], [24, -28], [18, -28], [15, -24]]], // 喀拉哈里
  ['#f7b04b', [[116, -22], [124, -18], [134, -17], [140, -22], [142, -28], [136, -32], [126, -30], [118, -28]]], // 澳洲內陸
  ['#62b84a', [[-75, 0], [-65, 3], [-52, 2], [-48, -4], [-55, -10], [-68, -11], [-75, -6]]], // 亞馬遜雨林
  ['#62b84a', [[10, 4], [22, 5], [29, 1], [28, -5], [18, -6], [11, -2]]], // 剛果雨林
  ['#62b84a', [[97, 20], [106, 21], [109, 12], [103, 9], [99, 12]]], // 中南半島
  ['#62b84a', [[96, 4], [104, 1], [110, 3], [118, 4], [118, -3], [110, -4], [102, -5]]], // 印尼
  ['#ffffff', [[-73, 78], [-60, 82], [-30, 84], [-18, 80], [-20, 72], [-40, 60], [-50, 62], [-56, 70], [-70, 76]]], // 格陵蘭
  ['#ffffff', [[-125, 74], [-100, 80], [-75, 82], [-62, 78], [-80, 70], [-100, 70], [-120, 70]]], // 北極群島
  ['#ffffff', [[10, 80], [30, 80], [25, 77], [12, 77]]], // 斯瓦巴
];

// 洲名寫在陸地上，海洋名寫在海上；英文用 \n 分成兩行，比較不會蓋到動物
const LABELS = [
  ['北美洲', 'NORTH\nAMERICA', -100, 52, 'land'], ['南美洲', 'SOUTH\nAMERICA', -66, -50, 'land'],
  ['歐洲', 'EUROPE', 14, 58, 'land'], ['非洲', 'AFRICA', 18, 6, 'land'],
  ['亞洲', 'ASIA', 75, 50, 'land'], ['澳洲', 'AUSTRALIA', 132, -33, 'land'], ['南極洲', 'ANTARCTICA', 24, -66, 'land'],
  ['太平洋', 'PACIFIC\nOCEAN', -150, -25, 'sea'], ['太平洋', 'PACIFIC\nOCEAN', 168, 24, 'sea'],
  ['大西洋', 'ATLANTIC\nOCEAN', -38, 38, 'sea'], ['大西洋', 'ATLANTIC\nOCEAN', -20, -36, 'sea'],
  ['印度洋', 'INDIAN\nOCEAN', 80, -8, 'sea'], ['北冰洋', 'ARCTIC OCEAN', 60, 80, 'sea'],
  ['台灣', 'TAIWAN', 121, 19.5, 'tw'],
];

// 裝飾：[種類, 經度, 緯度, 大小]；太靠近動物或文字的會自動略過
const DECOR = [
  ...[[-125, 62], [-105, 56], [-92, 50], [-70, 50], [-112, 51], [-135, 58], [-88, 58], [-68, 57],
    [12, 62], [32, 61], [48, 63], [62, 62], [80, 60], [98, 63], [118, 60], [132, 56], [70, 55], [88, 55], [112, 54], [145, 62], [160, 64]]
    .map(([lon, lat]) => ['pine', lon, lat, 1]),
  ...[[-82, 40], [-76, 44], [-92, 35], [5, 47], [18, 48], [-2, 45], [30, 56], [117, 34], [125, 40], [140, 36]]
    .map(([lon, lat]) => ['tree', lon, lat, 1]),
  ...[[-64, -2], [-47, -4], [-58, -15], [-8, 7], [20, 8], [30, 4], [77, 12], [105, 11], [124, 10], [112, -7], [132, -14], [145, -16], [-90, 17], [47, -14]]
    .map(([lon, lat]) => ['palm', lon, lat, 1]),
  ...[[-118, 48], [-110, 40], [-122, 42], [-70, -17], [-70, -32], [-72, -46], [9, 46], [86, 30], [96, 34], [82, 41], [58, 56], [-6, 32], [37, -3], [44, 41], [146, -36]]
    .map(([lon, lat]) => ['mountain', lon, lat, 1]),
  ...[[-112, 32], [-104, 29], [134, -22]].map(([lon, lat]) => ['cactus', lon, lat, 1]),
  ...[[-170, 72], [-160, -60], [120, -58], [-30, -58], [170, -55], [30, 79], [150, 76], [-150, 76], [-100, -58], [80, -56]]
    .map(([lon, lat]) => ['snow', lon, lat, 1]),
  ...[[-120, 20], [-30, 42], [-8, -5], [90, -5], [100, -30], [172, 8], [-100, -40], [-160, 30], [62, 12], [-150, -45], [40, -40], [-60, 25]]
    .map(([lon, lat], i) => ['fish', lon, lat, i % 2 ? 1 : -1]),
  ...[[-170, 42], [-120, -20], [-82, -52], [-25, 10], [-52, 46], [55, -45], [110, -45], [172, -12], [176, 46], [-170, -20], [2, -45], [88, -20], [-130, 35], [150, 0], [-10, 55]]
    .map(([lon, lat]) => ['wave', lon, lat, 1]),
];

const DECOR_DEFS = `
  <g id="d-pine"><path d="M0 -13 L7 -3 H3.5 L9 6 H-9 L-3.5 -3 H-7Z" fill="#2f9a55" stroke="#1d6b3a" stroke-width="1.3" stroke-linejoin="round"/><rect x="-1.6" y="6" width="3.2" height="4" fill="#8a5a3a"/></g>
  <g id="d-tree"><rect x="-1.6" y="0" width="3.2" height="9" fill="#8a5a3a"/><circle cx="0" cy="-4" r="7.5" fill="#4fae48" stroke="#2c7a34" stroke-width="1.3"/><circle cx="-2.5" cy="-6" r="2" fill="#7fd06a"/></g>
  <g id="d-palm"><path d="M0 10 Q-1 2 1 -6" fill="none" stroke="#9a6a3e" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M1 -6 q-8 -4 -12 2 q6 -3 12 -2 q-4 -7 -10 -6 q7 0 10 6 q3 -8 10 -6 q-6 1 -10 6 q8 -2 11 4 q-5 -5 -11 -4z" fill="#3aa64f" stroke="#237a38" stroke-width="1.1" stroke-linejoin="round"/></g>
  <g id="d-mountain"><path d="M-14 8 L-3 -11 L3 -3 L7 -8 L16 8Z" fill="#a08d7a" stroke="#6f5e4f" stroke-width="1.3" stroke-linejoin="round"/><path d="M-3 -11 L-7.4 -3.4 L-4.5 -5 L-2 -2.8 L0.6 -6.6Z M7 -8 L4.6 -4.3 L7 -5.2 L9 -3.8Z" fill="#fff"/></g>
  <g id="d-cactus"><path d="M-2.5 9 V-9 a2.5 2.5 0 0 1 5 0 V9Z M-2.5 1 H-6 V-4 a1.8 1.8 0 0 1 3.5 0 M2.5 -1 H6 V-6 a1.8 1.8 0 0 0 -3.5 0" fill="#4caf50" stroke="#2e7d32" stroke-width="1.2" stroke-linejoin="round"/></g>
  <g id="d-snow" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".85"><path d="M0 -7 V7 M-6 -3.5 L6 3.5 M-6 3.5 L6 -3.5 M-2 -5.5 L0 -3.8 L2 -5.5 M-2 5.5 L0 3.8 L2 5.5"/></g>
  <g id="d-fish"><path d="M-7 0 Q-2 -5.5 5 0 Q-2 5.5 -7 0Z M5 0 L10 -4 V4Z" fill="#ffb347" stroke="#e07b24" stroke-width="1.1" stroke-linejoin="round"/><circle cx="-3.5" cy="-1" r="1" fill="#2a2226"/></g>
  <g id="d-wave"><path d="M-12 0 q3 -3.5 6 0 t6 0 t6 0 t6 0" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity=".45"/></g>`;

// 經緯度外框 → 平滑的封閉曲線
function blob(pts) {
  const p = pts.map(([lon, lat]) => project(lon, lat));
  const f = (v) => v.toFixed(1);
  const n = p.length;
  let d = `M${f(p[0][0])} ${f(p[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = p[(i - 1 + n) % n], p1 = p[i], p2 = p[(i + 1) % n], p3 = p[(i + 2) % n];
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d + 'Z';
}

function antarcticaPath() {
  // 上緣是波浪狀的冰原，下緣是圓弧，直向螢幕時下方會露出海洋而不是一大片白色
  let d = 'M-600 520 L0 520';
  for (let x = 0; x < 1000; x += 50) d += ` q12.5 ${x % 100 ? 8 : -8} 25 0 t25 0`;
  let bottom = '';
  for (let x = 1000; x > 0; x -= 100) bottom += ` Q${x - 50} 596 ${x - 100} 582`;
  return `<path class="ice" d="${d} L1600 520 L1600 582 L1000 582${bottom} L-600 582Z"/>
    <path class="ice-shine" d="M120 534 h40 M300 540 h26 M640 536 h48 M860 542 h30"/>`;
}

function cloud(x, y, s, delay) {
  return `<g class="cloud-wrap" transform="translate(${x} ${y}) scale(${s})"><g class="cloud" style="animation-delay:${delay}s">
    <circle cx="0" cy="0" r="13"/><circle cx="17" cy="-7" r="17"/><circle cx="35" cy="0" r="12"/><rect x="0" y="-2" width="35" height="14" rx="7"/>
  </g></g>`;
}

function compass(x, y) {
  return `<g class="compass" transform="translate(${x} ${y})">
    <circle r="25"/>
    <path d="M0 -21 L5 0 L0 21 L-5 0Z" fill="#fff"/><path d="M0 -21 L5 0 L-5 0Z" fill="#ff6b6b"/>
    <path d="M-21 0 L0 -4 L21 0 L0 4Z" fill="#fff" opacity=".8"/>
    <text y="-30">N</text>
  </g>`;
}

function buildMap() {
  let defs = `
    <linearGradient id="ocean" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2e5fc2"/><stop offset="1" stop-color="#1f4699"/>
    </linearGradient>
    <pattern id="dots" width="46" height="46" patternUnits="userSpaceOnUse">
      <circle cx="6" cy="8" r="1.6" fill="#fff" opacity=".22"/><circle cx="30" cy="22" r="1.1" fill="#fff" opacity=".18"/><circle cx="16" cy="38" r="1.3" fill="#fff" opacity=".2"/>
    </pattern>
    <path id="land" d="${MAP_LAND}"/>
    <clipPath id="landClip"><use href="#land"/></clipPath>
    ${DECOR_DEFS}`;
  for (const [id, fn] of Object.entries(ART)) defs += `<symbol id="art-${id}" viewBox="-50 -50 100 100">${fn()}</symbol>`;

  if (CITY) {
    const scene = cityScene();
    $('#mapDefs').innerHTML = defs + scene.defs;
    $('#world').innerHTML = `${scene.scenery}<g class="labels">${scene.labels}</g><g id="animals">${markersHtml()}</g>`;
    return;
  }
  $('#mapDefs').innerHTML = defs;

  ANIMALS.forEach((a) => { [a.x, a.y] = project(a.lon, a.lat); });
  // 中英文兩套文字都畫出來，用 #world 上的 class 決定顯示哪一套
  const zhW = (t) => t.length * 17 + 16;
  const enW = (t) => Math.max(...t.split('\n').map((l) => l.length)) * 9 + 16;
  const labelPos = LABELS.map(([zh, en, lon, lat, kind]) => {
    const [x, y] = project(lon, lat);
    return { zh, en, x, y, kind, w: Math.max(zhW(zh), enW(en)), h: en.includes('\n') ? 30 : 18 };
  });
  const labelText = (t, lang, kind, x, y) => {
    const lines = t.split('\n');
    const tspans = lines.map((l, i) => `<tspan x="${x.toFixed(1)}" dy="${i ? '1.1em' : `${-(lines.length - 1) * 0.55}em`}">${l}</tspan>`).join('');
    return `<text class="${kind} ${lang}" x="${x.toFixed(1)}" y="${y.toFixed(1)}">${tspans}</text>`;
  };
  const labels = labelPos.map(({ zh, en, x, y, kind }) => kind === 'tw'
    ? ['zh', 'en'].map((lang) => {
      const t = lang === 'zh' ? zh : en, w = lang === 'zh' ? zhW(t) : enW(t);
      return `<g class="tw ${lang}" data-region="taiwan" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><rect x="${-w / 2}" y="-13" width="${w}" height="26" rx="13"/><text>${t}</text></g>`;
    }).join('')
    : labelText(zh, 'zh', kind, x, y) + labelText(en, 'en', kind, x, y)).join('');

  // 裝飾不要蓋到動物或文字
  const free = (x, y) => ANIMALS.every((a) => Math.hypot(a.x - x, a.y - y) > 26) &&
    labelPos.every((l) => Math.abs(l.x - x) > l.w / 2 + 8 || Math.abs(l.y - y) > l.h);
  const decor = DECOR.map(([kind, lon, lat, s]) => {
    const [x, y] = project(lon, lat);
    if (!free(x, y)) return '';
    return `<use href="#d-${kind}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})${s < 0 ? ' scale(-1 1)' : ''}"/>`;
  }).join('');

  let pins = '';
  ANIMALS.forEach((a) => {
    if (!a.pin) return;
    const [px, py] = project(...a.pin);
    pins += `<path d="M${px.toFixed(1)} ${py.toFixed(1)} L${a.x.toFixed(1)} ${a.y.toFixed(1)}"/>`;
  });
  const markers = markersHtml();

  $('#world').innerHTML = `
    <rect x="-600" y="-400" width="2200" height="1360" fill="url(#ocean)"/>
    <rect x="-600" y="-400" width="2200" height="1360" fill="url(#dots)"/>
    <use href="#land" class="land-shadow" transform="translate(2 4)"/>
    <use href="#land" fill="${LAND_COLOR}"/>
    <g clip-path="url(#landClip)">${AREAS.map(([c, pts]) => `<path d="${blob(pts)}" fill="${c}"/>`).join('')}</g>
    <use href="#land" class="land-edge"/>
    <path class="taiwan" d="${MAP_TAIWAN}"/>
    ${antarcticaPath()}
    <g class="decor">${decor}</g>
    ${cloud(170, 250, 0.8, 0)}${cloud(640, 462, 0.7, -7)}${cloud(962, 212, 0.75, -13)}
    ${compass(52, 452)}
    <g class="labels">${labels}</g>
    <g class="pins">${pins}</g>
    <g id="animals">${markers}</g>`;
}

// 地圖上可以點的動物 / 車子（兩種地圖共用）
function markersHtml() {
  return ITEMS.map((a, i) => `<g class="animal" data-id="${a.id}" transform="translate(${a.x.toFixed(1)} ${a.y.toFixed(1)})">
      <g class="bob" style="animation-delay:${((i * 0.37) % 2.6).toFixed(2)}s">
        <ellipse class="halo" cy="2" rx="27" ry="26"/>
        <ellipse class="shadow" cy="21" rx="16" ry="4"/>
        <use href="#art-${a.id}" x="-24" y="-24" width="48" height="48"/>
      </g></g>`).join('');
}

buildMap();

const animalLayer = $('#animals');
const animalEls = new Map();
animalLayer.querySelectorAll('.animal').forEach((g) => animalEls.set(g.dataset.id, g));

function selectAnimal(id, speak = true) {
  const a = ITEMS.find((x) => x.id === id);
  if (!a) return;
  $('#hint').classList.add('hidden');
  if (state.current) animalEls.get(state.current.id).classList.remove('selected', 'pop');
  state.current = a;
  const el = animalEls.get(id);
  el.classList.add('selected');
  el.classList.remove('pop');
  void el.getBBox(); // 重新觸發動畫
  el.classList.add('pop');
  animalLayer.append(el); // 移到最上層
  renderCard();
  if (speak) say(a, modeLangs());
  if (Stickers.add(a.id, 'seen')) toast(`🎉 得到新貼紙：${a.zh}！`);
}

/* ================= 卡片 ================= */

const card = $('#card');
const rowsEl = $('#cardRows');

function renderCard() {
  const a = state.current;
  if (!a) { card.classList.add('hidden'); return; }
  const wasHidden = card.classList.contains('hidden');
  card.classList.remove('hidden');
  card.classList.toggle('dock-left', a.x > MAP_W * 0.55); // 寬螢幕時卡片放在動物的另一邊
  if (wasHidden) { card.style.animation = 'none'; void card.offsetWidth; card.style.animation = ''; }

  const art = $('#cardArt');
  $('#cardArtUse').setAttribute('href', `#art-${a.id}`);
  art.style.animation = 'none'; void art.getBoundingClientRect(); art.style.animation = '';
  $('#cardPlace').textContent = `📍 ${a.place}`;
  // 🔊 叫聲：有聲音的寫「叫聲／聲音」，只有小知識的寫「小知識」
  const onlyFact = !SOUND_FILES[a.id] && !Synth.has(a.id) && !recordings.has(`${a.id}_sound`) && !audioFiles.has(`${a.id}_sound`);
  $('#cardSound').textContent = onlyFact ? '💡 小知識' : CITY ? '🔊 聲音' : '🔊 叫聲';
  $('#cardSound').classList.toggle('hidden', !hasSound(a) && !recordings.has(`${a.id}_sound`));
  $('#cardFact').classList.add('hidden');
  $('#sayPanel').classList.add('hidden');

  rowsEl.innerHTML = '';
  for (const lang of SEQUENCE) {
    const row = document.createElement('button');
    row.className = `row ${lang}`;
    row.dataset.lang = lang;
    row.innerHTML = `<span class="tag">${LANGS[lang].label}</span>
      <span class="text"><span class="word"></span>${lang === 'tw' || lang === 'ja' ? '<span class="rom"></span>' : ''}</span>
      <span class="spk">🔊</span>`;
    row.querySelector('.word').textContent = a[lang];
    if (lang === 'tw') row.querySelector('.rom').textContent = a.twRom;
    if (lang === 'ja') row.querySelector('.rom').textContent = a.jaRom;
    row.addEventListener('click', () => say(a, [lang]));
    rowsEl.append(row);
    if (state.parent) rowsEl.append(recTools(a, lang));
  }
}

function markSpeaking(lang) {
  rowsEl.querySelectorAll('.row').forEach((r) => r.classList.toggle('speaking', r.dataset.lang === lang));
}

$('#cardSound').addEventListener('click', async () => {
  const a = state.current;
  if (!a) return;
  stopAll();
  const token = state.playToken;
  const res = playSound(a, recordings.get(`${a.id}_sound`) || audioFiles.get(`${a.id}_sound`));
  const btn = $('#cardSound');
  btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop');
  if (res.kind === 'fact') {
    $('#cardFact').textContent = `💡 ${res.fact}`;
    $('#cardFact').classList.remove('hidden');
    await speakTTS(res.fact, 'zh-TW');
    if (token === state.playToken) markSpeaking(null);
  }
});

$('#cardClose').addEventListener('click', () => {
  stopAll();
  if (state.current) animalEls.get(state.current.id).classList.remove('selected', 'pop');
  state.current = null;
  card.classList.add('hidden');
});

/* ================= 語言切換 ================= */

function setMode(mode) {
  state.mode = mode;
  storageSet('mode', mode);
  document.querySelectorAll('#langs .lang').forEach((b) => b.classList.toggle('active', b.dataset.mode === mode));
}
document.querySelectorAll('#langs .lang').forEach((b) => b.addEventListener('click', () => {
  setMode(b.dataset.mode);
  if (quiz.on && !quiz.answered) { showQuizText(); askQuiz(); return; }
  if (state.current) say(state.current, modeLangs());
}));
setMode(state.mode);

/* ================= 家長模式與錄音 ================= */

let holdTimer = null;
const parentBtn = $('#parentBtn');
parentBtn.addEventListener('pointerdown', () => {
  parentBtn.classList.add('holding');
  // 設了家長密碼的話，進家長模式也要輸入密碼（不然小朋友可以自己改遊戲時間）
  holdTimer = setTimeout(async () => {
    parentBtn.classList.remove('holding');
    if (await PlayTimer.requireParent('進入家長模式')) setParent(true);
  }, 2000);
});
['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => parentBtn.addEventListener(ev, () => {
  clearTimeout(holdTimer);
  parentBtn.classList.remove('holding');
}));
parentBtn.addEventListener('click', () => { if (!state.parent) toast('家長請按住 ⚙️ 2 秒'); });
$('#parentExit').addEventListener('click', () => setParent(false));
$('#timeBtn').addEventListener('click', () => PlayTimer.openSettings());
// 🔈 按鈕會說話：開／關
const voiceLabel = () => { $('#voiceBtn').textContent = `🔈 按鈕會說話：${VoiceUI.enabled() ? '開' : '關'}`; };
$('#voiceBtn').addEventListener('click', () => { VoiceUI.set(!VoiceUI.enabled()); voiceLabel(); });
voiceLabel();

function setParent(on) {
  state.parent = on;
  if (!on) stopRecording();
  $('#parentBanner').classList.toggle('hidden', !on);
  if (on) toast('已進入家長模式，點動物就可以錄音');
  renderCard();
}

let rec = null; // { mr, key, stream, timer }

function recTools(a, lang) {
  const key = `${a.id}_${lang}`;
  const box = document.createElement('div');
  box.className = 'rec-tools';
  const isRec = rec && rec.key === key;

  const recBtn = document.createElement('button');
  recBtn.textContent = isRec ? '⏹ 停止' : '🎙️ 錄音';
  if (isRec) recBtn.classList.add('recording');
  recBtn.addEventListener('click', () => (isRec ? stopRecording() : startRecording(key)));
  box.append(recBtn);

  if (recordings.has(key)) {
    const del = document.createElement('button');
    del.textContent = '🗑 刪除錄音';
    del.addEventListener('click', async () => {
      await DB.del(key);
      URL.revokeObjectURL(recordings.get(key));
      recordings.delete(key);
      toast('已刪除，改用預設發音');
      renderCard();
    });
    box.append(del);
  }

  const status = document.createElement('span');
  status.className = 'status';
  status.textContent = recordings.has(key) ? '✅ 已有家長錄音'
    : audioFiles.has(key) ? '📁 使用音檔'
    : LANGS[lang].tts ? '🤖 使用系統語音' : '⚠️ 尚未錄音';
  box.append(status);
  return box;
}

async function startRecording(key) {
  stopAll();
  stopRecording();
  if (!navigator.mediaDevices || !window.MediaRecorder) {
    toast('這個瀏覽器不能錄音（需要 HTTPS 網址）');
    return;
  }
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch {
    toast('沒有麥克風權限，請到設定允許');
    return;
  }
  const type = ['audio/mp4', 'audio/webm', 'audio/ogg'].find((t) => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t));
  const mr = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
  const chunks = [];
  mr.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
  mr.onstop = async () => {
    stream.getTracks().forEach((t) => t.stop());
    if (!chunks.length) return;
    const blob = new Blob(chunks, { type: mr.mimeType || type || 'audio/mp4' });
    try {
      await DB.put(key, { buf: await blob.arrayBuffer(), type: blob.type });
    } catch {
      toast('儲存失敗，空間可能不足');
    }
    setRecording(key, blob);
    renderCard();
    toast('錄好了！點上面的名字聽聽看');
  };
  mr.start();
  rec = { mr, key, timer: setTimeout(stopRecording, 8000) }; // 最長 8 秒
  renderCard();
}

function stopRecording() {
  if (!rec) return;
  clearTimeout(rec.timer);
  const { mr } = rec;
  rec = null;
  if (mr.state !== 'inactive') mr.stop();
  renderCard();
}

/* ================= 地圖縮放與拖曳 ================= */

const svg = $('#map');
const world = $('#world');
const view = { s: 1, x: 0, y: 0 };
const MIN_S = 1, MAX_S = 4;

function applyView() {
  view.s = Math.min(MAX_S, Math.max(MIN_S, view.s));
  view.x = Math.min(0, Math.max(MAP_W - MAP_W * view.s, view.x));
  view.y = Math.min(0, Math.max(MAP_H - MAP_H * view.s, view.y));
  world.setAttribute('transform', `translate(${view.x} ${view.y}) scale(${view.s})`);
}

function toSvg(clientX, clientY) {
  const pt = svg.createSVGPoint();
  pt.x = clientX; pt.y = clientY;
  const p = pt.matrixTransform(svg.getScreenCTM().inverse());
  return { x: p.x, y: p.y };
}

function zoomAt(cx, cy, factor) {
  const s2 = Math.min(MAX_S, Math.max(MIN_S, view.s * factor));
  const wx = (cx - view.x) / view.s, wy = (cy - view.y) / view.s;
  view.s = s2;
  view.x = cx - wx * s2;
  view.y = cy - wy * s2;
  applyView();
}

let animTimer = null;
function animateTo(target) {
  cancelAnimationFrame(animTimer);
  const from = { ...view }, t0 = performance.now();
  const step = (now) => {
    const k = Math.min(1, (now - t0) / 300), e = 1 - (1 - k) ** 3;
    view.s = from.s + (target.s - from.s) * e;
    view.x = from.x + (target.x - from.x) * e;
    view.y = from.y + (target.y - from.y) * e;
    applyView();
    if (k < 1) animTimer = requestAnimationFrame(step);
  };
  animTimer = requestAnimationFrame(step);
}
function zoomCenter(factor) {
  const s2 = Math.min(MAX_S, Math.max(MIN_S, view.s * factor));
  const cx = MAP_W / 2, cy = MAP_H / 2;
  const wx = (cx - view.x) / view.s, wy = (cy - view.y) / view.s;
  animateTo({ s: s2, x: cx - wx * s2, y: cy - wy * s2 });
}
$('#zoomIn').addEventListener('click', () => zoomCenter(1.6));
$('#zoomOut').addEventListener('click', () => zoomCenter(1 / 1.6));
$('#zoomReset').addEventListener('click', () => animateTo({ s: 1, x: 0, y: 0 }));

// 地圖上的洲名、海洋名切換中文 / 英文
function setMapLang(lang) {
  storageSet('mapLang', lang);
  $('#world').classList.toggle('map-en', lang === 'en');
  $('#mapLang').textContent = lang === 'en' ? '中' : 'EN';
  $('#mapLang').setAttribute('aria-label', lang === 'en' ? '地圖改成中文' : '地圖改成英文');
}
$('#mapLang').addEventListener('click', () => setMapLang($('#world').classList.contains('map-en') ? 'zh' : 'en'));
setMapLang(storageGet('mapLang') === 'en' ? 'en' : 'zh');

const pointers = new Map();
let gesture = null; // { tapTarget, startX, startY, moved, multi }

svg.addEventListener('pointerdown', (e) => {
  svg.setPointerCapture(e.pointerId);
  pointers.set(e.pointerId, toSvg(e.clientX, e.clientY));
  if (pointers.size === 1) {
    const target = e.target.closest && e.target.closest('.animal');
    // 點「台灣」這種有 data-region 的標籤：打開那個地區的環島地圖
    const region = e.target.closest && e.target.closest('[data-region]');
    gesture = { tapId: target ? target.dataset.id : null, region: region ? region.dataset.region : null, startX: e.clientX, startY: e.clientY, moved: false, multi: false };
  } else if (gesture) {
    gesture.multi = true;
  }
});

svg.addEventListener('pointermove', (e) => {
  if (!pointers.has(e.pointerId)) return;
  const prev = [...pointers.values()];
  const p = toSvg(e.clientX, e.clientY);
  if (gesture && Math.hypot(e.clientX - gesture.startX, e.clientY - gesture.startY) > 10) gesture.moved = true;

  if (pointers.size === 1) {
    const old = pointers.get(e.pointerId);
    view.x += p.x - old.x;
    view.y += p.y - old.y;
    pointers.set(e.pointerId, p);
    applyView();
  } else if (pointers.size === 2) {
    const [a0, b0] = prev;
    pointers.set(e.pointerId, p);
    const [a1, b1] = [...pointers.values()];
    const c0 = { x: (a0.x + b0.x) / 2, y: (a0.y + b0.y) / 2 };
    const c1 = { x: (a1.x + b1.x) / 2, y: (a1.y + b1.y) / 2 };
    const d0 = Math.hypot(a0.x - b0.x, a0.y - b0.y) || 1;
    const d1 = Math.hypot(a1.x - b1.x, a1.y - b1.y);
    const s2 = Math.min(MAX_S, Math.max(MIN_S, view.s * (d1 / d0)));
    const wx = (c0.x - view.x) / view.s, wy = (c0.y - view.y) / view.s;
    view.s = s2;
    view.x = c1.x - wx * s2;
    view.y = c1.y - wy * s2;
    applyView();
  }
});

function endPointer(e) {
  if (!pointers.has(e.pointerId)) return;
  pointers.delete(e.pointerId);
  if (pointers.size === 0 && gesture) {
    if (e.type === 'pointerup' && !gesture.moved && !gesture.multi && gesture.region && !gesture.tapId) location.href = `region.html?r=${gesture.region}`;
    if (e.type === 'pointerup' && !gesture.moved && !gesture.multi && gesture.tapId) {
      if (quiz.on) quizTap(gesture.tapId); else selectAnimal(gesture.tapId);
    }
    gesture = null;
  }
}
svg.addEventListener('pointerup', endPointer);
svg.addEventListener('pointercancel', endPointer);

svg.addEventListener('wheel', (e) => {
  e.preventDefault();
  const p = toSvg(e.clientX, e.clientY);
  zoomAt(p.x, p.y, Math.exp(-e.deltaY * 0.0015));
}, { passive: false });

// 防止 iOS Safari 整頁縮放
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('dblclick', (e) => e.preventDefault());

/* ================= 📒 貼紙收集 ================= */

// 存在這台 iPad 的瀏覽器裡：{ lion: { seen: 3, found: 1, colored: 1 }, ... }
// seen = 在地圖上點過、found = 找找看找到、colored = 著色本畫好（著色本也會寫進同一個地方）
const Stickers = {
  data: {},
  load() {
    try { this.data = JSON.parse(storageGet('stickers')) || {}; } catch { this.data = {}; }
  },
  get(id) { return this.data[id]; },
  add(id, kind) {
    this.load();
    const isNew = !this.data[id];
    const rec = this.data[id] || (this.data[id] = {});
    rec[kind] = (rec[kind] || 0) + 1;
    storageSet('stickers', JSON.stringify(this.data));
    updateBookCount(isNew);
    return isNew;
  },
};

function updateBookCount(bump = false) {
  const n = ITEMS.filter((a) => Stickers.get(a.id)).length;
  const badge = $('#bookCount');
  badge.textContent = n;
  if (bump) { badge.classList.remove('bump'); void badge.offsetWidth; badge.classList.add('bump'); }
}

function openBook() {
  stopAll();
  Stickers.load();
  const grid = $('#bookGrid');
  grid.innerHTML = '';
  let n = 0;
  ITEMS.forEach((a) => {
    const rec = Stickers.get(a.id);
    if (rec) n++;
    const b = document.createElement('button');
    b.className = 'sticker' + (rec ? '' : ' locked');
    b.innerHTML = `<svg viewBox="-50 -50 100 100"><use href="#art-${a.id}" x="-50" y="-50" width="100" height="100"/></svg>
      <span class="sticker-name">${rec ? a.en : '?'}</span>
      <span class="sticker-badges">${rec && rec.found ? '⭐' : ''}${rec && rec.colored ? '🎨' : ''}${rec && rec.said ? '🗣️' : ''}</span>`;
    b.addEventListener('click', () => {
      if (!rec) { toast('還沒找到喔～到地圖上點點看！'); return; }
      b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
      say(a, modeLangs());
    });
    grid.append(b);
  });
  $('#bookTotal').textContent = `${n} / ${ITEMS.length}`;
  $('#book').classList.remove('hidden');
}
const closeBook = () => { stopAll(); $('#book').classList.add('hidden'); };
$('#bookBtn').addEventListener('click', openBook);
$('#bookClose').addEventListener('click', closeBook);
$('#book').addEventListener('click', (e) => { if (e.target.id === 'book') closeBook(); });

// 從著色本回來時，重新讀一次貼紙
window.addEventListener('pageshow', () => { Stickers.load(); updateBookCount(); });

/* ================= 🔍 找找看 ================= */

const quiz = { on: false, target: null, round: 0, stars: 0, misses: 0, answered: false, recent: [] };
// 「全部」模式用英文出題
const quizLang = () => (state.mode === 'all' ? 'en' : state.mode);

function showQuizText() {
  const a = quiz.target, lang = quizLang();
  const [main, sub] = lang === 'en' ? [`Where is the ${a.en}?`, `${a.zh}在哪裡？`]
    : lang === 'tw' ? [`${a.tw}佇佗位？`, a.twRom]
    : lang === 'ja' ? [`${a.ja}はどこ？`, `${a.jaRom} wa doko?（${a.zh}在哪裡？）`]
    : [`${a.zh}在哪裡？`, `Where is the ${a.en}?`];
  $('#quizMain').textContent = main;
  $('#quizSub').textContent = sub;
  $('#quizScore').textContent = `第 ${quiz.round} 題　⭐ ${quiz.stars}`;
}

async function askQuiz() {
  stopAll();
  const a = quiz.target, lang = quizLang();
  const token = state.playToken;
  if (lang === 'en') await speakTTS(`Where is the ${a.en.toLowerCase()}?`, 'en-US');
  else if (lang === 'zh') await speakTTS(`${a.zh}在哪裡？`, 'zh-TW');
  else if (lang === 'ja') await speakTTS(`${a.jaAlt || a.ja}はどこ？`, 'ja-JP');
  else await sayOne(a, 'tw');
  if (token === state.playToken) markSpeaking(null);
}

function clearClue() {
  animalLayer.querySelectorAll('.clue, .nope').forEach((el) => el.classList.remove('clue', 'nope'));
}

function closeCard() {
  if (state.current) animalEls.get(state.current.id).classList.remove('selected', 'pop');
  state.current = null;
  card.classList.add('hidden');
}

function nextQuiz() {
  clearClue();
  closeCard();
  // 先出還沒找到過的，也不要和最近幾題重複
  const fresh = ITEMS.filter((a) => !quiz.recent.includes(a.id));
  const notFound = fresh.filter((a) => !(Stickers.get(a.id) || {}).found);
  const pool = notFound.length ? notFound : fresh;
  quiz.target = pool[Math.floor(Math.random() * pool.length)];
  quiz.recent = [quiz.target.id, ...quiz.recent].slice(0, 8);
  quiz.round++;
  quiz.misses = 0;
  quiz.answered = false;
  $('#quizNext').classList.add('hidden');
  showQuizText();
  askQuiz();
}

function startQuiz() {
  Stickers.load();
  quiz.on = true;
  quiz.round = 0;
  quiz.stars = 0;
  $('#hint').classList.add('hidden');
  $('#quiz').classList.remove('hidden');
  $('#quizBtn').classList.add('active');
  nextQuiz();
}

function stopQuiz() {
  quiz.on = false;
  stopAll();
  clearClue();
  $('#quiz').classList.add('hidden');
  $('#quizBtn').classList.remove('active');
}

const PRAISE_EN = ['Great job!', 'You found it!', 'Yes! Well done!', 'Super!'];
const PRAISE_ZH = ['答對了！好棒！', '找到了！', '你好厲害！'];
const PRAISE_JA = ['すごい！', 'みつけた！', 'よくできました！'];
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function quizTap(id) {
  const a = ITEMS.find((x) => x.id === id);
  if (!a) return;
  // 答對之後可以自由點別的，等按「下一題」
  if (quiz.answered) { selectAnimal(id); return; }

  if (id === quiz.target.id) {
    quiz.answered = true;
    quiz.stars++;
    clearClue();
    confetti();
    Stickers.add(id, 'found');
    selectAnimal(id, false);
    $('#quizScore').textContent = `第 ${quiz.round} 題　⭐ ${quiz.stars}`;
    $('#quizNext').classList.remove('hidden');
    stopAll();
    const token = state.playToken;
    if (quizLang() === 'zh') await speakTTS(pick(PRAISE_ZH), 'zh-TW');
    else if (quizLang() === 'ja') await speakTTS(pick(PRAISE_JA), 'ja-JP');
    else await speakTTS(pick(PRAISE_EN), 'en-US');
    if (token === state.playToken) say(a, modeLangs());
    return;
  }

  // 點錯：搖搖頭，唸出自己的名字；錯兩次就讓答案發亮
  const el = animalEls.get(id);
  el.classList.remove('nope');
  void el.getBBox();
  el.classList.add('nope');
  quiz.misses++;
  if (quiz.misses >= 2) {
    animalEls.get(quiz.target.id).classList.add('clue');
    if (view.s > 1) animateTo({ s: 1, x: 0, y: 0 });
  }
  stopAll();
  await sayOne(a, quizLang());
  markSpeaking(null);
}

$('#quizBtn').addEventListener('click', () => (quiz.on ? stopQuiz() : startQuiz()));
$('#quizStop').addEventListener('click', stopQuiz);
$('#quizNext').addEventListener('click', nextQuiz);
$('#quizSay').addEventListener('click', () => (quiz.answered ? nextQuiz() : askQuiz()));

function confetti() {
  const box = $('#confetti');
  const colors = ['#ef4444', '#f59e0b', '#fde047', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
  box.innerHTML = '';
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('i');
    p.style.left = Math.random() * 100 + 'vw';
    p.style.background = colors[i % colors.length];
    p.style.animationDuration = 1.6 + Math.random() * 1.6 + 's';
    p.style.animationDelay = Math.random() * 0.4 + 's';
    box.append(p);
  }
  setTimeout(() => { box.innerHTML = ''; }, 3800);
}

/* ================= 🎤 說說看：跟著唸，iPad 聽聽看 ================= */

// 英文、中文用 iPad 的語音辨識；台語（或 iPad 不支援辨識）就「錄下來、播給自己聽、再聽一次正確的」
// 不打分數、不會失敗：說對了動物會開心，說不對就鼓勵再試，試兩次以後也誇獎
const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const sayIt = { rec: null, recorder: null, tries: 0 };
const sayLang = () => (state.mode === 'all' ? 'en' : state.mode);

function sayPanel(face, text, { again = false } = {}) {
  $('#sayPanel').classList.remove('hidden');
  $('#sayFace').textContent = face;
  $('#sayFace').classList.toggle('listening', face === '👂' || face === '🎙️');
  $('#sayText').textContent = text;
  $('#sayAgain').classList.toggle('hidden', !again);
}
function stopListening() {
  if (sayIt.rec) { try { sayIt.rec.abort(); } catch { /* */ } sayIt.rec = null; }
  if (sayIt.recorder && sayIt.recorder.state !== 'inactive') { try { sayIt.recorder.stop(); } catch { /* */ } }
  sayIt.recorder = null;
}

// 寬鬆比對：英文有聽到名字裡的主要單字、或拼起來很像；中文有一半以上的字對
function heardIt(alts, word, lang, alt) {
  // 日文：片假名換成平假名再比；漢字寫法（犬、消防車）也算
  const hira = (s) => s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
  const norm = (s) => hira(s.toLowerCase()).replace(/[^a-z㐀-鿿ぁ-ゖー]/g, '');
  if (lang === 'ja' && alt && alts.some((t) => norm(t).includes(norm(alt)))) return true;
  const target = norm(word);
  const close = (a, b) => {
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    return 1 - d[a.length][b.length] / Math.max(a.length, b.length, 1);
  };
  return alts.some((t) => {
    const heard = norm(t);
    if (!heard) return false;
    if (heard.includes(target)) return true;
    if (lang === 'en') {
      const words = word.toLowerCase().split(/[\s-]+/).filter((x) => x.length >= 3);
      return words.some((x) => heard.includes(x)) || close(heard, target) >= 0.5; // 小朋友常被聽成很像的字（lion → line），寬鬆一點
    }
    const chars = [...target];
    return chars.filter((c) => heard.includes(c)).length / chars.length >= 0.5;
  });
}

function listen(lang) {
  return new Promise((resolve) => {
    const r = new Recognition();
    r.lang = LANGS[lang].tts;
    r.interimResults = false;
    r.maxAlternatives = 5;
    let done = false;
    const finish = (v) => { if (!done) { done = true; clearTimeout(timer); try { r.abort(); } catch { /* */ } resolve(v); } };
    r.onresult = (e) => finish({ alts: [...e.results[0]].map((x) => x.transcript) });
    r.onerror = (e) => finish({ error: e.error });
    r.onend = () => finish({ error: 'no-speech' });
    const timer = setTimeout(() => finish({ error: 'no-speech' }), 7000);
    sayIt.rec = r;
    try { r.start(); } catch { finish({ error: 'not-allowed' }); }
  });
}

// 錄 3 秒，回傳錄音網址（沒有麥克風就回傳 null）
async function recordShort(seconds = 3) {
  if (!navigator.mediaDevices || !window.MediaRecorder) return null;
  let stream;
  try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch { return null; }
  return new Promise((resolve) => {
    const type = ['audio/mp4', 'audio/webm'].find((t) => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t));
    const mr = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
    const chunks = [];
    mr.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
    mr.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      resolve(chunks.length ? URL.createObjectURL(new Blob(chunks, { type: mr.mimeType || type })) : null);
    };
    sayIt.recorder = mr;
    mr.start();
    setTimeout(() => { if (mr.state !== 'inactive') mr.stop(); }, seconds * 1000);
  });
}

async function celebrateSay(a, lang) {
  const el = animalEls.get(a.id);
  if (el) { el.classList.remove('pop'); void el.getBBox(); el.classList.add('pop'); }
  confetti();
  if (Stickers.add(a.id, 'said')) updateBookCount(true);
  const praise = { en: 'Great job!', ja: 'じょうず！' }[lang] || '說得好棒！';
  sayPanel('🌟', praise);
  await speakTTS(praise, lang === 'tw' ? 'zh-TW' : LANGS[lang].tts);
  playSound(a, recordings.get(`${a.id}_sound`) || audioFiles.get(`${a.id}_sound`));
}

async function startSayIt() {
  const a = state.current;
  if (!a) return;
  stopAll();
  const token = state.playToken;
  const alive = () => token === state.playToken && state.current === a;
  const lang = sayLang();

  // 1. 先示範：唸一次這個字，再說「換你說說看」
  sayPanel('👄', a[lang]);
  await sayOne(a, lang);
  markSpeaking(null);
  if (!alive()) return;
  await speakTTS('換你說說看！', 'zh-TW');
  if (!alive()) return;

  // 2a. 英文、中文：用語音辨識聽
  if (Recognition && lang !== 'tw') {
    sayPanel('👂', '我在聽喔…');
    const res = await listen(lang);
    sayIt.rec = null;
    if (!alive()) return;
    if (res.alts && heardIt(res.alts, a[lang], lang, a.jaAlt)) { sayIt.tries = 0; await celebrateSay(a, lang); return; }
    if (res.error === 'no-speech' || res.alts) {
      sayIt.tries++;
      if (sayIt.tries >= 2) { sayIt.tries = 0; sayPanel('💪', '很接近了！你好棒！'); await speakTTS('很接近了！你好棒！', 'zh-TW'); return; }
      const msg = res.alts ? '很接近了，再說一次！' : '我沒聽到喔，大聲一點再說一次！';
      sayPanel('🙂', msg, { again: true });
      await speakTTS(msg, 'zh-TW');
      return;
    }
    // 其他錯誤（沒有權限、iPad 不支援）→ 改用錄音
  }

  // 2b. 錄下來，播給自己聽，再聽一次正確的
  sayPanel('🎙️', '說吧！我在錄音…');
  const url = await recordShort(3);
  if (!alive()) return;
  if (!url) { sayPanel('🙂', '這台 iPad 不能錄音，跟著唸就好囉！'); return; }
  sayPanel('🎧', '聽聽看你說的');
  await playSrc(url);
  URL.revokeObjectURL(url);
  if (!alive()) return;
  sayPanel('👄', `再聽一次：${a[lang]}`);
  await sayOne(a, lang);
  markSpeaking(null);
  if (!alive()) return;
  await celebrateSay(a, lang);
}

$('#cardSay').addEventListener('click', () => { sayIt.tries = 0; startSayIt(); });
$('#sayAgain').addEventListener('click', startSayIt);
$('#sayClose').addEventListener('click', () => { stopAll(); $('#sayPanel').classList.add('hidden'); });

/* ================= 其他 ================= */

let toastTimer = null;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), 2600);
}

SongPlayer.init(() => stopAll());

if (window.innerHeight > window.innerWidth * 1.1) setTimeout(() => toast('📱 把 iPad 橫過來，地圖會更大喔！'), 800);

applyView();
Stickers.load();
updateBookCount();
loadRecordings();
probeAudioFiles();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
