// ✏️ 描一描：用手指沿著淡淡的字描，描滿了就過關
//   ABC  ：大寫字母，有筆順（數字起點＋箭頭）和「看示範」
//   ㄅㄆㄇ：37 個注音，描字形（筆順還沒有做，避免教錯）
const $ = (id) => document.getElementById(id);
const SIZE = 600;                 // 畫布像素
const W = SIZE * 0.13;            // 字的筆畫粗細
const GRID = 120;                 // 檢查描了多少時用的小格子
const CRAYONS = ['#ef4444', '#f97316', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];
const CRAYON_NAMES = ['紅色', '橘色', '綠色', '藍色', '紫色', '粉紅色'];

/* ================= 英文大寫字母的筆畫（0~100 的格子，照筆順、照方向） ================= */

// 圓弧：角度用螢幕座標（0 = 右邊、90 = 下面），a0 → a1
function arc(cx, cy, rx, ry, a0, a1, n = 24) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
    pts.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]);
  }
  return pts;
}
// 三次貝茲曲線：把幾段接起來
function bez(...segs) {
  const pts = [];
  segs.forEach(([p0, p1, p2, p3], s) => {
    for (let i = s ? 1 : 0; i <= 16; i++) {
      const t = i / 16, u = 1 - t;
      pts.push([0, 1].map((k) => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k]));
    }
  });
  return pts;
}
const L_ = (...pts) => pts;

const LETTERS = {
  A: [L_([50, 10], [22, 90]), L_([50, 10], [78, 90]), L_([33, 62], [67, 62])],
  B: [L_([28, 10], [28, 90]), [[28, 10], ...arc(54, 29, 20, 19, -90, 90), [28, 48]], [[28, 48], ...arc(58, 69, 22, 21, -90, 90), [28, 90]]],
  C: [arc(54, 50, 36, 40, -40, -320)],
  D: [L_([28, 10], [28, 90]), [[28, 10], ...arc(44, 50, 32, 40, -90, 90), [28, 90]]],
  E: [L_([28, 10], [28, 90]), L_([28, 10], [74, 10]), L_([28, 50], [66, 50]), L_([28, 90], [74, 90])],
  F: [L_([28, 10], [28, 90]), L_([28, 10], [74, 10]), L_([28, 50], [66, 50])],
  G: [arc(52, 50, 36, 40, -40, -345), L_([60, 60], [87, 60])],
  H: [L_([26, 10], [26, 90]), L_([74, 10], [74, 90]), L_([26, 50], [74, 50])],
  I: [L_([50, 10], [50, 90]), L_([32, 10], [68, 10]), L_([32, 90], [68, 90])],
  J: [[[66, 10], ...arc(48, 68, 18, 22, 0, 180)]],
  K: [L_([28, 10], [28, 90]), L_([72, 10], [28, 56]), L_([42, 44], [74, 90])],
  L: [L_([30, 10], [30, 90], [74, 90])],
  M: [L_([20, 90], [20, 10]), L_([20, 10], [50, 64], [80, 10]), L_([80, 10], [80, 90])],
  N: [L_([26, 90], [26, 10]), L_([26, 10], [74, 90]), L_([74, 90], [74, 10])],
  O: [arc(50, 50, 34, 40, -90, -450, 36)],
  P: [L_([28, 10], [28, 90]), [[28, 10], ...arc(54, 31, 22, 21, -90, 90), [28, 52]]],
  Q: [arc(50, 50, 34, 40, -90, -450, 36), L_([56, 66], [82, 94])],
  R: [L_([28, 10], [28, 90]), [[28, 10], ...arc(54, 31, 22, 21, -90, 90), [28, 52]], L_([46, 52], [76, 90])],
  S: [bez([[74, 22], [64, 6], [28, 6], [28, 28]], [[28, 28], [28, 46], [72, 46], [72, 68]], [[72, 68], [72, 94], [32, 96], [24, 78]])],
  T: [L_([50, 10], [50, 90]), L_([22, 10], [78, 10])],
  U: [[[26, 10], ...arc(50, 64, 24, 26, 180, 0), [74, 10]]],
  V: [L_([22, 10], [50, 90], [78, 10])],
  W: [L_([14, 10], [32, 90], [50, 32], [68, 90], [86, 10])],
  X: [L_([26, 10], [74, 90]), L_([74, 10], [26, 90])],
  Y: [L_([26, 10], [50, 50]), L_([74, 10], [50, 50], [50, 90])],
  Z: [L_([26, 10], [74, 10], [26, 90], [74, 90])],
};

/* ================= 模式 ================= */

const MODES = {
  abc: { symbols: Object.keys(LETTERS), lang: 'en-US', strokes: true },
  zy: { symbols: ZY_SYMBOLS, lang: 'zh-TW', strokes: false },
  kana: { symbols: KANA_SYMBOLS, lang: 'ja-JP', strokes: false },
};
const params = new URLSearchParams(location.search);
let modeKey = MODES[params.get('mode')] ? params.get('mode') : 'abc';
let M = MODES[modeKey];
let current = MODES[modeKey].symbols.includes(params.get('letter')) ? params.get('letter') : M.symbols[0];
let crayon = CRAYONS[3];
const backHref = () => `abc.html?mode=${modeKey}${params.get('from') === 'city' ? '&from=city' : ''}`;

/* ================= 畫布 ================= */

const guide = $('guide'), ink = $('ink');
const gctx = guide.getContext('2d'), ictx = ink.getContext('2d');
[guide, ink].forEach((c) => { c.width = c.height = SIZE; });
const maskC = document.createElement('canvas'), wideC = document.createElement('canvas'), smallC = document.createElement('canvas');
[maskC, wideC, smallC].forEach((c) => { c.width = c.height = GRID; });
let mask = null, wide = null, maskCount = 0, passed = false;

const P = ([x, y], s = SIZE) => [(x / 100) * s, (y / 100) * s];

// 把字畫出來：ABC 用筆畫，注音用字型（加粗一點比較好描）
function drawGlyph(ctx, s, color, widthK = 1, upTo = Infinity) {
  ctx.save();
  ctx.strokeStyle = ctx.fillStyle = color;
  ctx.lineCap = ctx.lineJoin = 'round';
  if (M.strokes) {
    ctx.lineWidth = (W / SIZE) * s * widthK;
    let left = upTo;
    for (const pts of LETTERS[current]) {
      if (left <= 0) break;
      ctx.beginPath();
      pts.slice(0, Math.max(1, Math.min(pts.length, Math.ceil(left)))).forEach((p, i) => (i ? ctx.lineTo(...P(p, s)) : ctx.moveTo(...P(p, s))));
      ctx.stroke();
      left -= pts.length;
    }
  } else {
    ctx.font = modeKey === 'kana'
      ? `800 ${s * 0.72}px "Hiragino Maru Gothic ProN", "Hiragino Sans", "Yu Gothic", "Meiryo", sans-serif`
      : `900 ${s * 0.72}px "PingFang TC", "Heiti TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = s * 0.05 * widthK;
    ctx.strokeText(current, s / 2, s * 0.53);
    ctx.fillText(current, s / 2, s * 0.53);
  }
  ctx.restore();
}

// 起點的數字和方向箭頭（只有 ABC）
function drawStarts() {
  if (!M.strokes) return;
  const placed = [];
  LETTERS[current].forEach((pts, i) => {
    let [x, y] = P(pts[0]);
    // 兩筆從同一點開始（像 A），數字往旁邊挪，才不會疊在一起
    while (placed.some(([px, py]) => Math.hypot(px - x, py - y) < 40)) x += 46;
    placed.push([x, y]);
    const [nx, ny] = P(pts[Math.min(3, pts.length - 1)]);
    const a = Math.atan2(ny - y, nx - x);
    gctx.save();
    gctx.strokeStyle = gctx.fillStyle = '#94a3b8';
    gctx.lineWidth = 4;
    gctx.setLineDash([2, 10]);
    gctx.lineCap = 'round';
    gctx.beginPath();
    LETTERS[current][i].forEach((p, k) => (k ? gctx.lineTo(...P(p)) : gctx.moveTo(...P(p))));
    gctx.stroke();
    gctx.setLineDash([]);
    // 箭頭
    const ax = x + Math.cos(a) * 46, ay = y + Math.sin(a) * 46;
    gctx.beginPath();
    gctx.moveTo(ax + Math.cos(a) * 12, ay + Math.sin(a) * 12);
    gctx.lineTo(ax + Math.cos(a + 2.4) * 12, ay + Math.sin(a + 2.4) * 12);
    gctx.lineTo(ax + Math.cos(a - 2.4) * 12, ay + Math.sin(a - 2.4) * 12);
    gctx.fill();
    // 起點圓圈＋數字
    gctx.fillStyle = '#22c55e';
    gctx.beginPath();
    gctx.arc(x, y, 22, 0, Math.PI * 2);
    gctx.fill();
    gctx.fillStyle = '#fff';
    gctx.font = '900 26px -apple-system, sans-serif';
    gctx.textAlign = 'center';
    gctx.textBaseline = 'middle';
    gctx.fillText(String(i + 1), x, y + 1);
    gctx.restore();
  });
}

function drawGuide(done = false) {
  gctx.clearRect(0, 0, SIZE, SIZE);
  drawGlyph(gctx, SIZE, done ? crayon : '#e2e8f0');
  if (!done) drawStarts();
}

// 做「要描的範圍」：字本身（mask）和放寬一點的範圍（wide，超出這裡才算畫出去）
function buildMask() {
  const read = (c, k) => {
    const x = c.getContext('2d', { willReadFrequently: true });
    x.clearRect(0, 0, GRID, GRID);
    drawGlyph(x, GRID, '#000', k);
    const d = x.getImageData(0, 0, GRID, GRID).data;
    const out = new Uint8Array(GRID * GRID);
    for (let i = 0; i < out.length; i++) out[i] = d[i * 4 + 3] > 100 ? 1 : 0;
    return out;
  };
  mask = read(maskC, 0.8);
  wide = read(wideC, 2.2);
  maskCount = mask.reduce((a, b) => a + b, 0);
  // ABC 每一筆都要描到（不然 A 少了中間那一橫也會過關）
  strokeMasks = [];
  if (M.strokes) {
    const all = LETTERS[current];
    all.forEach((_, i) => {
      LETTERS[current] = [all[i]];
      strokeMasks.push(read(maskC, 0.8));
    });
    LETTERS[current] = all;
  }
}
let strokeMasks = [];

function check() {
  const x = smallC.getContext('2d', { willReadFrequently: true });
  x.clearRect(0, 0, GRID, GRID);
  x.drawImage(ink, 0, 0, GRID, GRID);
  const d = x.getImageData(0, 0, GRID, GRID).data;
  let covered = 0, inked = 0, outside = 0;
  for (let i = 0; i < mask.length; i++) {
    if (d[i * 4 + 3] < 60) continue;
    inked++;
    if (mask[i]) covered++;
    if (!wide[i]) outside++;
  }
  const cover = covered / maskCount, out = inked ? outside / inked : 0;
  const everyStroke = strokeMasks.every((sm) => {
    let n = 0, hit = 0;
    for (let i = 0; i < sm.length; i++) if (sm[i]) { n++; if (d[i * 4 + 3] >= 60) hit++; }
    return !n || hit / n >= 0.7;
  });
  if (cover >= 0.8 && everyStroke && out < 0.3) success();
  else if (cover >= 0.8) showHint('小心，不要畫到外面喔！擦掉再試一次 🧽');
}

/* ================= 手指描字 ================= */

let drawing = null;
const toCanvas = (e) => {
  const r = ink.getBoundingClientRect();
  return [((e.clientX - r.left) * SIZE) / r.width, ((e.clientY - r.top) * SIZE) / r.height];
};
ink.addEventListener('pointerdown', (e) => {
  if (drawing || !e.isPrimary || passed) return;
  e.preventDefault();
  try { ink.setPointerCapture(e.pointerId); } catch {}
  drawing = { id: e.pointerId, last: toCanvas(e) };
  line(drawing.last, drawing.last);
});
ink.addEventListener('pointermove', (e) => {
  if (!drawing || e.pointerId !== drawing.id) return;
  const list = e.getCoalescedEvents ? e.getCoalescedEvents() : [];
  (list.length ? list : [e]).forEach((ev) => {
    const p = toCanvas(ev);
    line(drawing.last, p);
    drawing.last = p;
  });
});
const end = (e) => {
  if (!drawing || e.pointerId !== drawing.id) return;
  drawing = null;
  check();
};
ink.addEventListener('pointerup', end);
ink.addEventListener('pointercancel', end);

function line(a, b) {
  ictx.strokeStyle = crayon;
  ictx.lineWidth = W * 0.85;
  ictx.lineCap = ictx.lineJoin = 'round';
  ictx.beginPath();
  ictx.moveTo(...a);
  ictx.lineTo(b[0] + 0.01, b[1]);
  ictx.stroke();
}

/* ================= 說話（錄音優先） ================= */

let voices = [];
const loadVoices = () => { voices = 'speechSynthesis' in window ? speechSynthesis.getVoices() : []; };
if ('speechSynthesis' in window) { loadVoices(); speechSynthesis.addEventListener('voiceschanged', loadVoices); }
function speak(text, lang) {
  // 預先生成的語音（voice-clips.js）優先，沒有才用系統語音
  const clip = VoiceClips.url(text, lang);
  if (clip) return playRec(clip);
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) return resolve();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.8;
    u.pitch = 1.1;
    const v = voices.find((x) => x.lang.replace('_', '-').toLowerCase() === lang.toLowerCase());
    if (v) u.voice = v;
    let done = false;
    const finish = () => { if (!done) { done = true; resolve(); } };
    u.onend = u.onerror = finish;
    speechSynthesis.speak(u);
    setTimeout(finish, 4000);
  });
}
let token = 0;
async function sayLines(lines) {
  const t = ++token;
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  recPlayer.pause();
  for (const l of lines) {
    if (t !== token) return;
    if (l.audio) await playRec(l.audio); else await speak(l, M.lang);
  }
}
// 唸這個字：字母（＋家長錄的發音）；注音（家長錄音或同音字）
function soundOf(S) {
  if (modeKey === 'abc') return [`${S}.`, ...(Recs.has(`abc_${S}`) ? [{ audio: Recs.url(`abc_${S}`) }] : [])];
  if (modeKey === 'kana') return [`${S}。`];
  return [Recs.has(`zy_${S}`) ? { audio: Recs.url(`zy_${S}`) } : `${ZY_SOUND[S]}。`];
}

/* ================= 過關、進度 ================= */

const progress = (() => { try { return JSON.parse(localStorage.getItem('traced')) || {}; } catch { return {}; } })();
const isDone = (S) => (progress[modeKey] || []).includes(S);

function success() {
  passed = true;
  drawGuide(true);
  ictx.clearRect(0, 0, SIZE, SIZE);
  $('doneStamp').classList.remove('hidden');
  confetti();
  progress[modeKey] = [...new Set([...(progress[modeKey] || []), current])];
  try { localStorage.setItem('traced', JSON.stringify(progress)); } catch {}
  document.querySelector(`.pick[data-s="${current}"]`)?.classList.add('done');
  sayLines([...soundOf(current), modeKey === 'abc' ? pick(['Great job!', 'Super!', 'Well done!']) : modeKey === 'kana' ? pick(['じょうず！', 'すごい！', 'よくできました！']) : pick(['好棒！', '寫得真好！', '你好厲害！'])]);
}

let hintTimer;
function showHint(msg) {
  const h = $('hint');
  h.textContent = msg;
  h.classList.remove('hidden');
  clearTimeout(hintTimer);
  hintTimer = setTimeout(() => h.classList.add('hidden'), 2400);
}

/* ================= 選字、換模式 ================= */

function buildPicker() {
  const nav = $('picker');
  nav.innerHTML = '';
  M.symbols.forEach((S) => {
    const b = document.createElement('button');
    b.className = 'pick' + (isDone(S) ? ' done' : '');
    b.dataset.s = S;
    b.textContent = S;
    b.addEventListener('click', () => select(S, true));
    nav.append(b);
  });
}

function select(S, talk) {
  current = S;
  passed = false;
  cancelAnimationFrame(demoRaf);
  document.querySelectorAll('.pick').forEach((b) => b.classList.toggle('on', b.dataset.s === S));
  document.querySelector('.pick.on')?.scrollIntoView({ block: 'nearest', inline: 'center' });
  $('sayGlyph').textContent = S;
  $('doneStamp').classList.add('hidden');
  $('demoBtn').classList.toggle('hidden', !M.strokes);
  ictx.clearRect(0, 0, SIZE, SIZE);
  drawGuide();
  buildMask();
  if (talk) sayLines(soundOf(S));
}

function setMode(key) {
  modeKey = key;
  M = MODES[key];
  document.querySelectorAll('.mode-tab').forEach((b) => b.classList.toggle('on', b.dataset.mode === key));
  $('backBtn').href = backHref();
  buildPicker();
  select(M.symbols.includes(current) ? current : M.symbols[0], false);
}
document.querySelectorAll('.mode-tab').forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mode)));

/* ================= 看示範：照筆順一筆一筆畫出來 ================= */

let demoRaf = 0;
$('demoBtn').addEventListener('click', () => {
  if (!M.strokes) return;
  cancelAnimationFrame(demoRaf);
  const total = LETTERS[current].reduce((n, pts) => n + pts.length, 0);
  const speed = Math.max(0.35, total / 90); // 每一格畫幾個點
  let k = 0;
  const step = () => {
    k += speed;
    drawGuide();
    drawGlyph(gctx, SIZE, '#0ea5e9', 0.45, k);
    if (k < total + 1) demoRaf = requestAnimationFrame(step);
    else setTimeout(() => { if (!passed) drawGuide(); }, 700);
  };
  sayLines(soundOf(current));
  step();
});

$('sayBtn').addEventListener('click', () => sayLines(soundOf(current)));
$('clearBtn').addEventListener('click', () => select(current, false));
$('nextBtn').addEventListener('click', () => {
  const list = M.symbols;
  select(list[(list.indexOf(current) + 1) % list.length], true);
});

// 蠟筆
CRAYONS.forEach((c) => {
  const b = document.createElement('button');
  b.className = 'crayon' + (c === crayon ? ' on' : '');
  b.dataset.say = CRAYON_NAMES[CRAYONS.indexOf(c)];
  b.style.background = c;
  b.addEventListener('click', () => {
    crayon = c;
    document.querySelectorAll('.crayon').forEach((x) => x.classList.toggle('on', x === b));
  });
  $('crayons').append(b);
});

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
function confetti() {
  const box = $('confetti');
  box.innerHTML = '';
  for (let i = 0; i < 50; i++) {
    const p = document.createElement('i');
    p.style.left = Math.random() * 100 + 'vw';
    p.style.background = CRAYONS[i % CRAYONS.length];
    p.style.animationDuration = 1.6 + Math.random() * 1.6 + 's';
    p.style.animationDelay = Math.random() * 0.4 + 's';
    box.append(p);
  }
  setTimeout(() => { box.innerHTML = ''; }, 3800);
}

setMode(modeKey);
Recs.load(['zy_', 'abc_']);

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
