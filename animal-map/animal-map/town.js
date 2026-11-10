// 🧸 貼紙小鎮：把收集到的動物、車子貼紙拖到場景裡自由擺放
// 沒有題目、沒有分數、沒有字：點一下動物會跳＋叫、車子會往前開；長按會轉向；拖到 🗑️ 會收起來
// 每個場景擺的東西存在這台 iPad（localStorage「town」）
const $ = (id) => document.getElementById(id);
const svg = $('scene');
const SVGNS = 'http://www.w3.org/2000/svg';
const W = 1000, H = 600, HORIZON = 250;

const ITEMS = [...ANIMALS.map((a) => ({ ...a, kind: 'animal' })), ...VEHICLES.map((v) => ({ ...v, kind: 'vehicle' }))].filter((x) => ART[x.id]);
const byId = new Map(ITEMS.map((x) => [x.id, x]));
// 還沒收集到貼紙也能玩：一開始就有這幾個
const STARTERS = ['lion', 'elephant', 'rabbit', 'panda', 'car', 'bus', 'fire-truck', 'train'];

/* ================= 四個場景（畫在 1000 × 600 的畫布上） ================= */

const tree = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-6" y="-10" width="12" height="40" rx="4" fill="#8a5a3a"/><circle cy="-34" r="34" fill="#5fae3b"/><circle cx="-18" cy="-20" r="22" fill="#4f9e31"/><circle cx="20" cy="-22" r="24" fill="#6cbf4a"/></g>`;
const cloud = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#fff" opacity=".95"><circle r="26"/><circle cx="30" cy="-12" r="32"/><circle cx="64" r="24"/><rect y="-4" width="64" height="28" rx="14"/></g>`;
const sky = (top, bottom) => `<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient><rect width="${W}" height="${H}" fill="url(#sky)"/>`;

const SCENES = {
  meadow: {
    icon: '🌳', say: '草原',
    draw: () => sky('#8fd3ff', '#e3f6ff') +
      `<circle cx="860" cy="90" r="50" fill="#ffd23f"/>` + cloud(130, 90) + cloud(560, 60, .8) +
      `<path d="M0 ${HORIZON + 10} Q200 ${HORIZON - 60} 420 ${HORIZON} T820 ${HORIZON - 10} T1000 ${HORIZON} V${H} H0Z" fill="#b6e388"/>` +
      `<rect y="${HORIZON + 20}" width="${W}" height="${H}" fill="#9bd770"/>` +
      `<ellipse cx="760" cy="470" rx="150" ry="46" fill="#7cc9ee"/><ellipse cx="740" cy="460" rx="60" ry="10" fill="#fff" opacity=".5"/>` +
      tree(90, HORIZON + 10, .9) + tree(330, HORIZON, .7) + tree(600, HORIZON + 5, .8) + tree(930, HORIZON + 10, .9) +
      [[180, 420], [420, 520], [560, 380], [260, 560], [880, 560]].map(([x, y]) => `<g fill="#fff"><circle cx="${x}" cy="${y}" r="5"/><circle cx="${x + 12}" cy="${y + 3}" r="5" fill="#ffd23f"/></g>`).join(''),
  },
  city: {
    icon: '🏙️', say: '城市',
    draw: () => {
      let b = '';
      const cols = ['#f7b267', '#8ecae6', '#ffb4a2', '#b8c0ff', '#cdb4db', '#a7c957'];
      for (let i = 0, x = -10; x < W; i++) {
        const w = 90 + (i * 37) % 60, h = 120 + (i * 53) % 110;
        b += `<rect x="${x}" y="${HORIZON + 30 - h}" width="${w}" height="${h}" fill="${cols[i % cols.length]}"/>`;
        for (let wy = HORIZON + 45 - h; wy < HORIZON; wy += 30) for (let wx = x + 14; wx < x + w - 20; wx += 28) b += `<rect x="${wx}" y="${wy}" width="14" height="16" rx="2" fill="#fff" opacity=".7"/>`;
        x += w + 8;
      }
      let dash = '';
      for (let x = 0; x < W; x += 80) dash += `<rect x="${x + 10}" y="448" width="44" height="8" rx="4" fill="#fff"/>`;
      return sky('#9ad8ff', '#e8f7ff') + cloud(200, 70, .7) + cloud(700, 50, .9) + b +
        `<rect y="${HORIZON + 30}" width="${W}" height="60" fill="#d6d3cf"/>` + tree(120, HORIZON + 60, .45) + tree(520, HORIZON + 60, .45) + tree(880, HORIZON + 60, .45) +
        `<rect y="${HORIZON + 90}" width="${W}" height="${H}" fill="#6b7280"/>` + dash +
        `<rect y="560" width="${W}" height="40" fill="#d6d3cf"/>`;
    },
  },
  sea: {
    icon: '🌊', say: '海邊',
    draw: () => {
      let waves = '';
      for (let y = HORIZON + 30; y < 470; y += 40) for (let x = (y / 2) % 120; x < W; x += 120) waves += `<path d="M${x} ${y} q15 -10 30 0 t30 0" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".55"/>`;
      return sky('#7fd0ff', '#e0f6ff') + `<circle cx="140" cy="100" r="54" fill="#ffd23f"/>` + cloud(600, 80, .9) +
        `<rect y="${HORIZON}" width="${W}" height="${H}" fill="#3ba7e6"/><rect y="${HORIZON}" width="${W}" height="30" fill="#5fbcf0"/>` + waves +
        `<path d="M0 470 Q250 440 500 470 T1000 460 V${H} H0Z" fill="#f6dd9c"/>` +
        `<g transform="translate(860 470)"><path d="M0 0 Q-10 -80 8 -150" fill="none" stroke="#9a6a3e" stroke-width="12" stroke-linecap="round"/><path d="M8 -150 q-50 -20 -80 20 q40 -20 80 -20 q-30 -50 -70 -45 q50 0 70 45 q20 -55 70 -45 q-45 5 -70 45 q55 -10 80 25 q-40 -35 -80 -25z" fill="#3aa64f"/></g>` +
        `<g fill="#f2a65a"><path d="M300 520 l10 -18 l10 18z"/><circle cx="520" cy="540" r="7" fill="#ffb4a2"/></g>`;
    },
  },
  snow: {
    icon: '❄️', say: '雪地',
    draw: () => {
      let flakes = '';
      for (let i = 0; i < 40; i++) flakes += `<circle cx="${(i * 97) % W}" cy="${(i * 53) % 230 + 10}" r="${2 + (i % 3)}" fill="#fff" opacity=".9"/>`;
      return sky('#b9d7f5', '#eef6ff') + flakes +
        `<path d="M0 ${HORIZON + 10} L160 ${HORIZON - 120} L300 ${HORIZON - 10} L470 ${HORIZON - 150} L650 ${HORIZON} L800 ${HORIZON - 100} L1000 ${HORIZON + 10}Z" fill="#cfe0f2"/>` +
        `<path d="M160 ${HORIZON - 120} l-36 50 l20 -8 l16 14 l14 -18 l20 6z M470 ${HORIZON - 150} l-40 56 l22 -8 l18 14 l16 -18 l20 6z M800 ${HORIZON - 100} l-30 42 l18 -6 l12 10 l14 -14 l16 4z" fill="#fff"/>` +
        `<rect y="${HORIZON + 10}" width="${W}" height="${H}" fill="#f4faff"/>` +
        `<ellipse cx="300" cy="470" rx="130" ry="36" fill="#a8d8f0"/><ellipse cx="760" cy="540" rx="110" ry="30" fill="#a8d8f0"/>` +
        `<g transform="translate(900 ${HORIZON + 40})"><path d="M-30 30 L0 -30 L30 30Z" fill="#2f7a4a"/><path d="M-22 6 L0 -40 L22 6Z" fill="#3c9a5d"/><path d="M-12 -20 L0 -48 L12 -20Z" fill="#fff"/></g>`;
    },
  },
};

/* ================= 狀態與儲存 ================= */

const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch { return d; } };
const town = read('town', { scene: 'meadow', items: {} });
if (!SCENES[town.scene]) town.scene = 'meadow';
const save = () => { try { localStorage.setItem('town', JSON.stringify(town)); } catch { /* */ } };
const placed = () => (town.items[town.scene] = town.items[town.scene] || []);

const params = new URLSearchParams(location.search);
if (params.get('from') === 'city') $('backBtn').href = 'city.html';

/* ================= 畫面 ================= */

// 越下面（越近）越大
const sizeAt = (y) => 70 + Math.max(0, Math.min(1, (y - HORIZON) / (H - HORIZON))) * 100;
const clampY = (y) => Math.max(HORIZON - 40, Math.min(H - 6, y));
// 畫面比場景窄的時候（直立 iPad），左右會被裁掉：只能放在看得到的地方
function visibleX() {
  const m = svg.getScreenCTM();
  if (!m) return [0, W];
  const inv = m.inverse(), pt = svg.createSVGPoint();
  pt.x = 0; pt.y = 0; const left = pt.matrixTransform(inv).x;
  pt.x = innerWidth; const right = pt.matrixTransform(inv).x;
  return [Math.max(0, left), Math.min(W, right)];
}
const clampX = (x) => { const [l, r] = visibleX(); return Math.max(l + 40, Math.min(r - 40, x)); };

function buildDefs() {
  $('defs').innerHTML = ITEMS.map((x) => `<symbol id="art-${x.id}" viewBox="-50 -50 100 100">${ART[x.id]()}</symbol>`).join('');
}

function itemEl(p) {
  const g = document.createElementNS(SVGNS, 'g');
  g.setAttribute('class', 'it');
  g.innerHTML = `<ellipse class="shadow"/><g class="body"><g class="anim"><use href="#art-${p.id}"/></g></g>`;
  g._p = p;
  layout(g);
  return g;
}
// 依位置、大小、方向擺好
function layout(g) {
  const p = g._p, s = sizeAt(p.y);
  g.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
  const sh = g.querySelector('.shadow');
  sh.setAttribute('rx', s * 0.32); sh.setAttribute('ry', s * 0.07); sh.setAttribute('cy', 0);
  g.querySelector('.body').setAttribute('transform', `scale(${p.f || 1} 1)`);
  const u = g.querySelector('use');
  u.setAttribute('x', -s / 2); u.setAttribute('y', -s * 0.94); u.setAttribute('width', s); u.setAttribute('height', s);
}
// 前後順序：越下面越前面
function sortItems() {
  const box = $('items');
  [...box.children].sort((a, b) => a._p.y - b._p.y).forEach((g) => box.append(g));
}

function renderScene() {
  $('bg').innerHTML = SCENES[town.scene].draw();
  $('items').innerHTML = '';
  placed().forEach((p) => $('items').append(itemEl(p)));
  sortItems();
  document.querySelectorAll('.scene-btn').forEach((b) => b.classList.toggle('on', b.dataset.scene === town.scene));
}

function buildScenes() {
  Object.entries(SCENES).forEach(([key, sc]) => {
    const b = document.createElement('button');
    b.className = 'scene-btn';
    b.dataset.scene = key;
    b.dataset.say = sc.say;
    b.textContent = sc.icon;
    b.addEventListener('click', () => { town.scene = key; save(); renderScene(); });
    $('scenes').append(b);
  });
}

function buildTray() {
  const stickers = read('stickers', {});
  const ids = [...new Set([...STARTERS, ...ITEMS.map((x) => x.id).filter((id) => stickers[id])])];
  ids.sort((a, b) => ITEMS.indexOf(byId.get(a)) - ITEMS.indexOf(byId.get(b)));
  const tray = $('tray');
  tray.innerHTML = '';
  ids.forEach((id) => {
    const b = document.createElement('div');
    b.className = 'sticker';
    b.dataset.id = id;
    b.innerHTML = `<svg viewBox="-50 -50 100 100"><use href="#art-${id}" x="-50" y="-50" width="100" height="100"/></svg>`;
    tray.append(b);
  });
  // ➕：還有更多貼紙在地圖上等你收集
  const more = document.createElement('button');
  more.className = 'sticker more';
  more.textContent = '➕';
  more.dataset.say = '去地圖點點看，可以收集更多貼紙喔！';
  tray.append(more);
}

/* ================= 拖、點、長按 ================= */

const toSvg = (e) => {
  const pt = svg.createSVGPoint();
  pt.x = e.clientX; pt.y = e.clientY;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
};
const overTrash = (e) => {
  const r = $('trash').getBoundingClientRect();
  return Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)) < r.width * 0.75;
};
let drag = null; // { g, id, dx, dy, sx, sy, moved, fresh, timer, long }

function startDrag(e, g, fresh) {
  const pt = toSvg(e);
  drag = { g, id: e.pointerId, dx: g._p.x - pt.x, dy: g._p.y - pt.y, sx: e.clientX, sy: e.clientY, moved: fresh, fresh, long: false };
  g.classList.add('dragging');
  $('items').append(g); // 拖的時候放最上面
  if (!fresh) drag.timer = setTimeout(() => { if (drag && !drag.moved) { drag.long = true; flip(g); } }, 550);
}

$('items').addEventListener('pointerdown', (e) => {
  const g = e.target.closest('.it');
  if (!g || drag) return;
  e.preventDefault();
  startDrag(e, g, false);
});

// 從貼紙盤往上拖出來
let trayPress = null;
$('tray').addEventListener('pointerdown', (e) => {
  const s = e.target.closest('.sticker[data-id]');
  if (s && !drag) trayPress = { id: s.dataset.id, x: e.clientX, y: e.clientY, pointer: e.pointerId };
});

window.addEventListener('pointermove', (e) => {
  if (trayPress && !drag && e.pointerId === trayPress.pointer && trayPress.y - e.clientY > 14) {
    const pt = toSvg(e);
    const p = { id: trayPress.id, x: clampX(pt.x), y: clampY(pt.y + 40), f: 1 };
    const g = itemEl(p);
    g.classList.add('new');
    $('items').append(g);
    startDrag(e, g, true);
    drag.dx = 0; drag.dy = 40;
    trayPress = null;
    sayName(p.id);
  }
  if (!drag || e.pointerId !== drag.id) return;
  if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 8) { drag.moved = true; clearTimeout(drag.timer); }
  if (!drag.moved) return;
  const pt = toSvg(e);
  drag.g._p.x = clampX(pt.x + drag.dx);
  drag.g._p.y = clampY(pt.y + drag.dy);
  layout(drag.g);
  $('trash').classList.toggle('hot', overTrash(e));
});

function endDrag(e) {
  trayPress = null;
  if (!drag || e.pointerId !== drag.id) return;
  const { g, moved, fresh, long } = drag;
  clearTimeout(drag.timer);
  drag = null;
  g.classList.remove('dragging');
  $('trash').classList.remove('hot');
  if (moved && overTrash(e)) { remove(g); return; }
  if (fresh) placed().push(g._p);
  else if (!moved && !long) act(g);
  sortItems();
  save();
}
window.addEventListener('pointerup', endDrag);
window.addEventListener('pointercancel', endDrag);

function remove(g) {
  const list = placed(), i = list.indexOf(g._p);
  if (i >= 0) list.splice(i, 1);
  g.remove();
  save();
  pop();
}

function flip(g) {
  g._p.f = -(g._p.f || 1);
  layout(g);
  g.classList.remove('flipped'); void g.getBBox(); g.classList.add('flipped');
  save();
}

// 點一下：動物跳一跳＋叫；車子往前開（碰到邊會轉頭）
function act(g) {
  const item = byId.get(g._p.id);
  const res = playSound(item);
  if (res.kind === 'fact' || res.kind === 'none') sayName(item.id);
  if (item.kind === 'vehicle') { drive(g); return; }
  g.classList.remove('hop'); void g.getBBox(); g.classList.add('hop');
}

function drive(g) {
  const p = g._p;
  const dir = -(p.f || 1); // 車頭朝左，翻過來就朝右
  const [l, rgt] = visibleX();
  let target = p.x + dir * 260;
  if (target < l + 60 || target > rgt - 60) { p.f = -(p.f || 1); layout(g); target = p.x - dir * 260; }
  const from = p.x, t0 = performance.now(), dur = 1300;
  const step = (now) => {
    const k = Math.min(1, (now - t0) / dur), e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
    p.x = clampX(from + (target - from) * e);
    layout(g);
    if (k < 1) requestAnimationFrame(step); else save();
  };
  requestAnimationFrame(step);
}

/* ================= 聲音 ================= */

let zhVoice = null;
if ('speechSynthesis' in window) {
  const pick = () => { zhVoice = speechSynthesis.getVoices().find((v) => /^zh[-_]TW/i.test(v.lang)) || null; };
  pick(); speechSynthesis.addEventListener('voiceschanged', pick);
}
function sayName(id) {
  // 預先生成的語音（voice-clips.js）優先，沒有才用系統語音
  if (VoiceClips.play(byId.get(id).zh, 'zh-TW')) return;
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(byId.get(id).zh);
  u.lang = 'zh-TW'; u.rate = 0.9; u.pitch = 1.15;
  if (zhVoice) u.voice = zhVoice;
  speechSynthesis.speak(u);
}
function pop() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  const ac = pop.ac || (pop.ac = new AC());
  const o = ac.createOscillator(), g = ac.createGain();
  o.frequency.setValueAtTime(600, ac.currentTime);
  o.frequency.exponentialRampToValueAtTime(120, ac.currentTime + 0.2);
  g.gain.setValueAtTime(0.25, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.22);
  o.connect(g).connect(ac.destination);
  o.start(); o.stop(ac.currentTime + 0.25);
}

/* ================= 🧹 全部收起來、📷 拍照 ================= */

$('clearBtn').addEventListener('click', () => $('ask').classList.remove('hidden'));
$('askNo').addEventListener('click', () => $('ask').classList.add('hidden'));
$('askYes').addEventListener('click', () => {
  $('ask').classList.add('hidden');
  town.items[town.scene] = [];
  save();
  renderScene();
  pop();
});

$('photoBtn').addEventListener('click', async () => {
  // 把場景和貼紙組成一張 SVG，再畫到畫布上存成照片
  const clean = (s) => { const t = document.createElementNS(SVGNS, 'svg'); t.innerHTML = s; return t.innerHTML; };
  const items = [...placed()].sort((a, b) => a.y - b.y).map((p) => {
    const s = sizeAt(p.y);
    return `<g transform="translate(${p.x} ${p.y})"><ellipse rx="${s * 0.32}" ry="${s * 0.07}" fill="#000" opacity=".14"/>` +
      `<g transform="scale(${p.f || 1} 1)"><svg x="${-s / 2}" y="${-s * 0.94}" width="${s}" height="${s}" viewBox="-50 -50 100 100">${clean(ART[p.id]())}</svg></g></g>`;
  }).join('');
  const markup = `<svg xmlns="${SVGNS}" viewBox="0 0 ${W} ${H}" width="${W * 1.6}" height="${H * 1.6}">${clean(SCENES[town.scene].draw())}${items}</svg>`;
  const img = new Image();
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(markup);
  try { await img.decode(); } catch { return; }
  const c = document.createElement('canvas');
  c.width = W * 1.6; c.height = H * 1.6;
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  const blob = await new Promise((r) => c.toBlob(r, 'image/png'));
  const file = new File([blob], `貼紙小鎮-${Date.now()}.png`, { type: 'image/png' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file] }); return; } catch (err) { if (err.name === 'AbortError') return; }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = file.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 3000);
});

buildDefs();
buildScenes();
buildTray();
renderScene();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
