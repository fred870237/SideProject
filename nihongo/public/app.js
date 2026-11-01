'use strict';

/* ---------- 小工具 ---------- */
const $ = (s, el = document) => el.querySelector(s);
const app = $('#app');

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const sample = (arr, n) => shuffle(arr).slice(0, n);

function h(tag, attrs, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'class') el.className = v;
    else if (k === 'style') el.style.cssText = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : String(c));
  }
  return el;
}

const BASIC = KANA.basic.flat().filter(Boolean);
const DAKU = KANA.dakuten.flat().filter(Boolean);
const ALL_WORDS = VOCAB.flatMap(c => c.words.map(w => ({ ...w, cat: c.id })));

/* ---------- 進度儲存 ---------- */
const STORE_KEY = 'nihongo-kids-v1';
const state = Object.assign(
  {
    stars: 0, heard: {}, best: {}, mistakes: {}, stages: {}, writing: {}, romaji: true,
    spent: 0, stickers: {}, dailyGoal: 15, daily: {}, streak: { count: 0, last: null }, goalDays: [], goalsDone: 0,
    mode: 'kids', srs: {}, srsDay: {}, newPerDay: 10, typeAnswer: true, grammar: {}, slowAudio: false, theme: 'auto',
  },
  (() => { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch { return {}; } })()
);

function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch { /* 無痕模式等 */ }
  syncUI();
}
function syncUI() {
  $('#star-count').textContent = wallet();
  document.body.classList.toggle('hide-romaji', !state.romaji);
  document.body.classList.toggle('adult', state.mode === 'adult');
  if (state.theme === 'auto') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = state.theme;
}
function addStars(n) { state.stars += n; trackDaily(n); save(); bumpStars(); }
function markHeard(key) { if (!state.heard[key]) { state.heard[key] = 1; save(); } }
function bumpStars() {
  const el = $('.stars');
  el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
}

/* ---------- 發音 ---------- */
const canSpeak = 'speechSynthesis' in window;
let jaVoice = null, voicesLoaded = false;
function pickVoice() {
  const vs = speechSynthesis.getVoices();
  if (vs.length) voicesLoaded = true;
  jaVoice = vs.find(v => v.lang === 'ja-JP') || vs.find(v => /^ja/i.test(v.lang)) || null;
  updateVoiceTip();
}
if (canSpeak) { pickVoice(); speechSynthesis.addEventListener('voiceschanged', pickVoice); }

function speak(text, onend, rate = 0.8) {
  if (!canSpeak) { onend && onend(); return; }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ja-JP';
  if (jaVoice) u.voice = jaVoice;
  u.rate = rate;
  if (onend) { u.onend = onend; u.onerror = onend; }
  speechSynthesis.speak(u);
}
function stopSpeak() { if (canSpeak) speechSynthesis.cancel(); }

function updateVoiceTip() {
  const tip = $('#voice-tip');
  if (!tip) return;
  tip.hidden = canSpeak && (jaVoice || !voicesLoaded);
}

/* ---------- 音效 ---------- */
let actx;
function beep(notes) {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    let t = actx.currentTime;
    for (const [f, d] of notes) {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = 'triangle'; o.frequency.value = f;
      g.gain.setValueAtTime(0.15, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + d);
      o.connect(g).connect(actx.destination);
      o.start(t); o.stop(t + d);
      t += d * 0.8;
    }
  } catch { /* 不支援就安靜 */ }
}
const sfx = {
  good: () => beep([[660, 0.12], [880, 0.2]]),
  bad: () => beep([[240, 0.15], [200, 0.25]]),
  win: () => beep([[523, 0.12], [659, 0.12], [784, 0.12], [1047, 0.35]]),
};

function confetti() {
  const items = ['🌸', '⭐', '🎉', '💖', '✨', '🎈'];
  for (let i = 0; i < 36; i++) {
    const s = h('span', {
      class: 'confetti',
      style: `left:${Math.random() * 100}vw;animation-delay:${Math.random() * 0.7}s;font-size:${18 + Math.random() * 22}px`,
    }, items[i % items.length]);
    document.body.append(s);
    setTimeout(() => s.remove(), 3500);
  }
}

/* ---------- 對話框 ---------- */
function openModal(content) {
  const m = $('#modal');
  m.replaceChildren(h('div', { class: 'modal-box', role: 'dialog', 'aria-modal': 'true' },
    h('button', { class: 'close', onclick: closeModal, 'aria-label': '關閉' }, '✕'),
    content));
  m.hidden = false;
  m.onclick = e => { if (e.target === m) closeModal(); };
}
function closeModal() { const m = $('#modal'); m.hidden = true; m.replaceChildren(); }
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ---------- 路由 ---------- */
let renderToken = 0;
function setHeader(title, back) {
  $('.title').textContent = title;
  const b = $('.back');
  b.hidden = !back;
  if (back) b.href = back;
  document.title = title === '小小日語樂園' ? title : `${title}｜小小日語樂園`;
}

function render() {
  renderToken++;
  stopSpeak();
  closeModal();
  app.replaceChildren();
  const [name = '', ...args] = location.hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
  const routes = { grammar: grammarPage, gpractice: grammarPractice, listen: listenPage, srs: srsPage, n5: n5Page, kanji: kanjiPage, typing: typingPage, stickers: stickerPage, map: mapPage, stage: stagePage, kana: kanaPage, vocab: vocabPage, quiz: quizPage, match: matchPage, progress: progressPage };
  (routes[name] || homePage)(...args);
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', render);

/* ---------- 首頁 ---------- */
function homePage() {
  if (state.mode === 'adult') return adultHome();
  setHeader('小小日語樂園');
  const cur = currentStage();
  const cleared = allStages().filter(stageStars).length;
  const tiles = [
    { href: '#/kana/hira', icon: 'あ', label: '平假名', sub: 'ひらがな', color: 'pink', jp: true },
    { href: '#/kana/kata', icon: 'ア', label: '片假名', sub: 'カタカナ', color: 'blue', jp: true },
    { href: '#/vocab', icon: '🐶', label: '單字卡', sub: '動物・食物・顏色…', color: 'yellow' },
    { href: '#/quiz', icon: '🎯', label: '小測驗', sub: mistakeCount() ? `📒 ${mistakeCount()} 個錯題要複習` : '答對拿星星', color: 'green' },
    { href: '#/match', icon: '🃏', label: '翻牌配對', sub: '記憶力大考驗', color: 'purple' },
    { href: '#/stickers', icon: '🎁', label: '貼紙本', sub: `${stickerOwned()} / ${stickerTotal} 張・扭蛋機`, color: 'pink' },
    { href: '#/progress', icon: '🏆', label: '我的進度', sub: `總共獲得 ${state.stars} 顆星`, color: 'orange' },
  ];
  app.append(
    modeSwitch(),
    h('section', { class: 'hero' },
      h('button', { class: 'mascot', onclick: () => speak('こんにちは！いっしょに にほんごを べんきょうしよう！'), 'aria-label': '狐狸打招呼' }, '🦊'),
      h('div', {},
        h('p', { class: 'hero-hi', lang: 'ja' }, 'こんにちは！'),
        h('p', {}, '今天想學什麼呢？點一下任何字，就會唸給你聽喔！'))),
    h('p', { id: 'voice-tip', class: 'tip', hidden: true },
      '🔈 這台裝置好像沒有日語語音，發音可能不正確。建議使用 Chrome / Edge / Safari，或在系統設定中加入「日本語」語音。'),
    h('a', { class: 'map-banner', href: cur ? `#/stage/${cur.id}` : '#/map' },
      h('span', { class: 'map-banner-icon' }, '🗺️'),
      h('span', { class: 'map-banner-text' },
        h('b', {}, '冒險地圖'),
        h('span', {}, cur ? `下一關：${cur.chapter.icon} ${cur.name}` : '全部關卡都過關了！👑')),
      h('span', { class: 'map-banner-count' }, `${cleared} / ${allStages().length} 關`)),
    dailyCard(),
    h('nav', { class: 'tiles' }, tiles.map(t =>
      h('a', { class: `tile ${t.color}`, href: t.href },
        h('span', { class: 'tile-icon', lang: t.jp ? 'ja' : null }, t.icon),
        h('span', { class: 'tile-label' }, t.label),
        h('span', { class: 'tile-sub' }, t.sub)))),
  );
  updateVoiceTip();
}

/* ---------- 五十音 ---------- */
function romajiToggle() {
  return h('button', {
    class: 'chip' + (state.romaji ? ' on' : ''),
    onclick: e => { state.romaji = !state.romaji; save(); e.currentTarget.classList.toggle('on', state.romaji); },
  }, 'ABC 拼音');
}

function kanaPage(script = 'hira', set = 'basic') {
  const isHira = script !== 'kata';
  const sc = isHira ? 'hira' : 'kata';
  const rows = set === 'dakuten' ? KANA.dakuten : KANA.basic;
  setHeader(isHira ? '平假名 ひらがな' : '片假名 カタカナ', '#/');

  const seg = (items, cur) => h('div', { class: 'seg' }, items.map(([href, label, key]) =>
    h('a', { href, class: key === cur ? 'on' : null }, label)));

  const grid = h('div', { class: 'kana-grid' });
  for (const row of rows) {
    for (const k of row) {
      if (!k) { grid.append(h('div', { class: 'cell empty' })); continue; }
      const ch = k[sc], key = `${sc}:${ch}`;
      const cell = h('button', { class: 'cell' + (state.heard[key] ? ' heard' : '') + (state.mistakes[key] ? ' weak' : '') },
        h('span', { class: 'kana', lang: 'ja' }, ch),
        h('span', { class: 'romaji' }, k.r));
      cell.onclick = () => {
        speak(ch); markHeard(key); cell.classList.add('heard');
        showKanaDetail(k, isHira);
      };
      grid.append(cell);
    }
  }

  const total = (set === 'dakuten' ? DAKU : BASIC).length;
  const heard = (set === 'dakuten' ? DAKU : BASIC).filter(k => state.heard[`${sc}:${k[sc]}`]).length;
  const curSet = ['dakuten', 'yoon'].includes(set) ? set : 'basic';

  app.append(
    h('div', { class: 'toolbar' },
      seg([[`#/kana/hira/${curSet}`, '平假名 あ', 'hira'], [`#/kana/kata/${curSet}`, '片假名 ア', 'kata']], sc),
      seg([[`#/kana/${sc}/basic`, '清音', 'basic'], [`#/kana/${sc}/dakuten`, '濁音・半濁音', 'dakuten'], [`#/kana/${sc}/yoon`, '拗音・特殊音', 'yoon']], curSet),
      romajiToggle()),
    ...(curSet === 'yoon' ? kanaExtras(sc) : [
      h('p', { class: 'hint' }, `點一下字卡聽發音、練習寫字。已經聽過 ${heard} / ${total} 個 ✨`),
      grid]),
  );
}

function showKanaDetail(k, isHira) {
  const ch = isHira ? k.hira : k.kata;
  const other = isHira ? k.kata : k.hira;
  const ex = ALL_WORDS.find(w => w.jp.startsWith(ch));
  openModal(h('div', { class: 'kana-detail' },
    h('div', { class: 'kd-head' },
      h('button', { class: 'kd-big', lang: 'ja', onclick: () => speak(ch), 'aria-label': '再聽一次' }, ch),
      h('div', { class: 'kd-info' },
        h('div', { class: 'kd-romaji' }, k.r),
        h('div', { class: 'kd-other' }, isHira ? '片假名 ' : '平假名 ', h('b', { lang: 'ja' }, other)),
        h('button', { class: 'btn', onclick: () => speak(ch) }, '🔊 再聽一次'))),
    ex && h('button', { class: 'kd-example', onclick: () => speak(ex.jp) },
      h('span', { class: 'emoji' }, ex.e),
      h('span', { lang: 'ja' }, ex.jp),
      h('small', {}, ex.zh)),
    tracePad(ch)));
}

/* 筆順動畫：灰色底字 + 依序畫出的彩色筆畫 + 起筆編號 */
const SVGNS = 'http://www.w3.org/2000/svg';
function svgEl(tag, attrs, text) {
  const el = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  if (text != null) el.textContent = text;
  return el;
}

function strokeGuide(strokes) {
  const svg = svgEl('svg', { viewBox: '0 0 109 109', class: 'stroke-svg', 'aria-hidden': 'true' });
  const guide = svgEl('g', { class: 'sg-guide' }), ink = svgEl('g', { class: 'sg-ink' }), nums = svgEl('g', { class: 'sg-nums' });
  const inkPaths = [], numEls = [], placed = [];
  strokes.forEach((d, i) => {
    guide.append(svgEl('path', { d }));
    const p = svgEl('path', { d });
    ink.append(p); inkPaths.push(p);
    let [x, y] = (d.match(/^M\s*(-?[\d.]+)[,\s]+(-?[\d.]+)/) || [0, 0, 0]).slice(1).map(Number);
    // 起筆點太靠近前一個編號時（例如濁點），往旁邊挪開
    while (placed.some(([px, py]) => Math.hypot(px - x, py - y) < 11)) x += 11;
    placed.push([x, y]);
    const n = svgEl('g', { class: 'sg-num' });
    n.append(svgEl('circle', { cx: x, cy: y, r: 5.5 }), svgEl('text', { x, y }, i + 1));
    nums.append(n); numEls.push(n);
  });
  svg.append(guide, ink, nums);

  let anims = [];
  const stop = () => { anims.forEach(a => a.cancel()); anims = []; };
  const length = i => inkPaths[i].getTotalLength();
  const num = (i, on) => { numEls[i].style.opacity = on ? 1 : 0; };
  function setStroke(i, visible, cls = '') {
    const p = inkPaths[i], len = length(i);
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = visible ? 0 : len;
    p.setAttribute('class', cls);
    num(i, visible);
  }
  function reset() { stop(); inkPaths.forEach((_, i) => setStroke(i, false)); }

  function play() {
    reset();
    let t = 200;
    inkPaths.forEach((p, i) => {
      const len = length(i);
      const dur = 300 + len * 9;
      anims.push(
        p.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: dur, delay: t, fill: 'both', easing: 'ease-in-out' }),
        numEls[i].animate([{ opacity: 0, transform: 'scale(.3)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 200, delay: t, fill: 'both' }));
      t += dur + 300;
    });
  }

  // 示範單一筆畫：畫出來後淡出
  function hint(i) {
    stop();
    const p = inkPaths[i], len = length(i);
    setStroke(i, false, 'hint');
    num(i, true);
    anims.push(p.animate(
      [{ strokeDashoffset: len, opacity: 1 }, { strokeDashoffset: 0, opacity: 1, offset: 0.65 }, { strokeDashoffset: 0, opacity: 0 }],
      { duration: 900 + len * 10, easing: 'ease-out' }));
  }

  // 沿著筆畫平均取點（109×109 座標）
  function points(i, n = 20) {
    const p = inkPaths[i], len = length(i);
    return Array.from({ length: n }, (_, k) => { const pt = p.getPointAtLength((len * k) / (n - 1)); return [pt.x, pt.y]; });
  }

  return { svg, play, reset, setStroke, hint, num, points, length, count: strokes.length };
}

/* ---------- 描字檢查 ---------- */
const STROKE_TOL = 20; // 平均誤差容許值（109 座標中約 18%，對小朋友寬鬆一點）

function polyLen(pts) {
  let s = 0;
  for (let i = 1; i < pts.length; i++) s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return s;
}

function resample(pts, n = 20) {
  const d = [0];
  for (let i = 1; i < pts.length; i++) d.push(d[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const total = d[d.length - 1];
  if (!total) return Array(n).fill(pts[0]);
  const out = [];
  let j = 0;
  for (let k = 0; k < n; k++) {
    const t = (total * k) / (n - 1);
    while (j < d.length - 2 && d[j + 1] < t) j++;
    const r = (t - d[j]) / (d[j + 1] - d[j] || 1);
    out.push([pts[j][0] + (pts[j + 1][0] - pts[j][0]) * r, pts[j][1] + (pts[j + 1][1] - pts[j][1]) * r]);
  }
  return out;
}

function strokeDist(user, exp) {
  const n = user.length;
  let fwd = 0, rev = 0;
  for (let k = 0; k < n; k++) {
    fwd += Math.hypot(user[k][0] - exp[k][0], user[k][1] - exp[k][1]);
    rev += Math.hypot(user[k][0] - exp[n - 1 - k][0], user[k][1] - exp[n - 1 - k][1]);
  }
  return { fwd: fwd / n, rev: rev / n };
}

// 三點平均（頭尾不動），去掉手抖造成的鋸齒，長度才不會被灌水
const smooth = pts => pts.map((p, i) => (i === 0 || i === pts.length - 1 ? p
  : [(pts[i - 1][0] + p[0] + pts[i + 1][0]) / 3, (pts[i - 1][1] + p[1] + pts[i + 1][1]) / 3]));

// 回傳 ok / reverse（方向反了）/ order（寫成後面的筆畫）/ miss
function judgeStroke(raw, guide, k) {
  const user = resample(raw.length > 1 ? raw : [raw[0], raw[0]]);
  const uLen = polyLen(smooth(smooth(user)));
  const lenOk = i => uLen > guide.length(i) * 0.4 - 6 && uLen < guide.length(i) * 2.5 + 20;
  const { fwd, rev } = strokeDist(user, guide.points(k));
  if (lenOk(k) && fwd < STROKE_TOL) return 'ok';
  if (lenOk(k) && rev < STROKE_TOL) return 'reverse';
  for (let j = k + 1; j < guide.count; j++) if (lenOk(j) && strokeDist(user, guide.points(j)).fwd < STROKE_TOL) return 'order';
  return 'miss';
}

function tracePad(ch) {
  const strokes = typeof STROKES !== 'undefined' && STROKES[ch];
  const guide = strokes ? strokeGuide(strokes) : null;
  const canvas = h('canvas', { class: 'trace-canvas', 'aria-label': '描字區' });
  const ctx = canvas.getContext('2d');
  let drawing = false, last = null, cur = [];
  let testing = false, k = 0, misses = 0, missHere = 0;
  const done = [];

  const best = state.writing[ch];
  const freeHint = strokes
    ? `✏️ 筆順：共 ${strokes.length} 畫。看完動畫，換你描描看，或按「描字挑戰」讓我幫你檢查！${best ? `（目前成績 ${starText(best)}）` : ''}`
    : '✏️ 用手指或滑鼠，跟著淡淡的字描描看';
  const msg = h('p', { class: 'kd-hint' }, freeHint);
  const say = (text, cls = '') => { msg.textContent = text; msg.className = `kd-hint ${cls}`; };

  const fit = () => {
    const r = canvas.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    canvas.width = r.width * dpr; canvas.height = r.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.lineWidth = Math.max(8, r.width / 18);
    ctx.strokeStyle = ctx.fillStyle = '#ff5d8f';
  };
  requestAnimationFrame(() => { fit(); if (guide) guide.play(); });
  const clear = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

  const pos = e => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  canvas.addEventListener('pointerdown', e => {
    drawing = true; last = pos(e); cur = [last];
    canvas.setPointerCapture(e.pointerId);
    ctx.beginPath(); ctx.arc(last[0], last[1], ctx.lineWidth / 2, 0, Math.PI * 2); ctx.fill();
  });
  canvas.addEventListener('pointermove', e => {
    if (!drawing) return;
    const p = pos(e);
    ctx.beginPath(); ctx.moveTo(...last); ctx.lineTo(...p); ctx.stroke();
    last = p; cur.push(p);
  });
  const end = () => {
    if (!drawing) return;
    drawing = false;
    if (testing) checkStroke(cur);
  };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);

  const box = h('div', { class: 'trace' }, guide ? guide.svg : h('div', { class: 'trace-guide', lang: 'ja' }, ch), canvas);
  const testBtn = h('button', { class: 'btn', onclick: startTest }, '✍️ 描字挑戰');

  function startTest() {
    testing = true; k = 0; misses = 0; missHere = 0; done.length = 0;
    clear(); redraw();
    box.classList.add('testing');
    testBtn.textContent = '🔄 重新挑戰';
    say(`✍️ 描字挑戰！從第 1 畫開始寫（共 ${guide.count} 畫）`);
  }

  function checkStroke(raw) {
    // 畫布座標 → 筆順 SVG 的 109×109 座標（SVG 內縮 6%、佔 88%）
    const W = canvas.clientWidth, H = canvas.clientHeight;
    const pts = raw.map(([x, y]) => [((x / W - 0.06) / 0.88) * 109, ((y / H - 0.06) / 0.88) * 109]);
    const res = judgeStroke(pts, guide, k);
    clear();
    if (res === 'ok') {
      done[k++] = 'done';
      missHere = 0;
      beep([[520 + k * 80, 0.12]]);
      redraw();
      if (k >= guide.count) return finishTest();
      return say(`很好！接著寫第 ${k + 1} 畫 ✨`, 'good');
    }
    misses++; missHere++;
    sfx.bad();
    box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake');
    if (missHere < 3) {
      say({
        reverse: '方向反了喔！要從數字那一頭開始寫 ↩️',
        order: `順序不對喔！要先寫第 ${k + 1} 畫`,
        miss: `再試一次！看看第 ${k + 1} 畫怎麼寫 👀`,
      }[res], 'warn');
      return guide.hint(k);
    }
    // 同一畫錯 3 次就幫忙寫好，避免小朋友卡住
    done[k++] = 'auto';
    missHere = 0;
    redraw();
    if (k >= guide.count) return finishTest();
    say(`沒關係！這一畫幫你寫好了，接著寫第 ${k + 1} 畫 💪`, 'warn');
  }

  // 已完成的筆畫用綠色（自己寫的）或橘色（幫忙寫的）顯示，並標出下一畫的起點
  function redraw() {
    guide.reset();
    done.forEach((cls, i) => guide.setStroke(i, true, cls));
    if (k < guide.count) guide.num(k, true);
  }

  function finishTest() {
    testing = false;
    box.classList.remove('testing');
    const stars = misses === 0 ? 3 : misses <= 2 ? 2 : 1;
    if (stars > (state.writing[ch] || 0)) state.writing[ch] = stars;
    addStars(stars);
    speak(ch);
    if (stars === 3) { confetti(); setTimeout(() => awardSticker('writer'), 900); } else sfx.win();
    say(`${stars === 3 ? '寫得太棒了！' : stars === 2 ? '寫得很好！' : '完成了！多練習會更棒！'} ${starText(stars)} 獲得 ${stars} 顆星`, 'good big');
    testBtn.textContent = '✍️ 再挑戰一次';
    done.length = 0;
  }

  return h('div', { class: 'trace-area' },
    msg,
    box,
    h('div', { class: 'row' },
      guide && h('button', {
        class: 'btn ghost',
        onclick: () => { testing = false; done.length = 0; box.classList.remove('testing'); clear(); guide.play(); say(freeHint); testBtn.textContent = '✍️ 描字挑戰'; },
      }, '▶️ 看筆順'),
      guide && testBtn,
      h('button', { class: 'btn ghost', onclick: clear }, '🧽 擦掉')));
}

/* ---------- 單字卡 ---------- */
function vocabPage(catId) {
  const cat = VOCAB.find(c => c.id === catId) || VOCAB[0];
  setHeader('單字卡', '#/');
  const token = renderToken;

  const cards = cat.words.map(w => {
    const card = h('button', { class: 'word-card' + (state.heard[`v:${w.jp}`] ? ' heard' : '') },
      h('span', { class: 'emoji' }, w.e),
      h('span', { class: 'jp', lang: 'ja' }, w.jp),
      h('span', { class: 'romaji' }, w.ro),
      h('span', { class: 'zh' }, w.zh));
    card.onclick = () => { stopAll(); sayCard(card, w); };
    return card;
  });

  function sayCard(card, w, onend) {
    card.classList.remove('pop'); void card.offsetWidth; card.classList.add('pop', 'heard');
    markHeard(`v:${w.jp}`);
    speak(w.jp, onend);
  }

  let playing = false;
  const playBtn = h('button', { class: 'btn' }, '▶️ 全部唸一遍');
  function stopAll() {
    playing = false; playBtn.textContent = '▶️ 全部唸一遍';
    cards.forEach(c => c.classList.remove('now'));
  }
  playBtn.onclick = () => {
    if (playing) { stopAll(); stopSpeak(); return; }
    playing = true; playBtn.textContent = '⏹ 停止';
    const step = i => {
      cards.forEach(c => c.classList.remove('now'));
      if (!playing || token !== renderToken || i >= cards.length) { stopAll(); return; }
      cards[i].classList.add('now');
      cards[i].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      sayCard(cards[i], cat.words[i], () => setTimeout(() => step(i + 1), 500));
    };
    step(0);
  };

  app.append(
    h('div', { class: 'cats' }, VOCAB.map(c =>
      h('a', { href: `#/vocab/${c.id}`, class: 'cat' + (c === cat ? ' on' : '') }, h('span', {}, c.icon), c.name))),
    h('div', { class: 'toolbar' }, playBtn, romajiToggle()),
    h('div', { class: 'word-grid' }, cards),
  );
}

/* ---------- 小測驗 ---------- */
function optionsFrom(answer, pool, keyFn, n = 4) {
  const others = sample(pool.filter(x => keyFn(x) !== keyFn(answer)), n - 1);
  // 避免重複選項（例如濁音的 ji / zu）
  const uniq = [...new Map(others.map(x => [keyFn(x), x])).values()];
  return shuffle([answer, ...uniq]).map(x => ({ item: x, correct: x === answer }));
}

// 題目產生器；key 用來記錄錯題（與「聽過」用同一套 key）
const Q = {
  listenKana: (k, sc, pool = BASIC) => ({
    key: `${sc}:${k[sc]}`, ask: '聽一聽，是哪一個字？', optClass: 'opt-kana', optLang: 'ja',
    prompt: { kind: 'audio', value: k[sc] }, say: k[sc],
    options: optionsFrom(k, pool, x => x[sc]).map(o => ({ ...o, label: o.item[sc] })),
  }),
  readKana: (k, sc, pool = BASIC) => ({
    key: `${sc}:${k[sc]}`, ask: '這個字怎麼唸？', optClass: 'opt-romaji',
    prompt: { kind: 'text', value: k[sc] }, say: k[sc],
    options: optionsFrom(k, pool, x => x.r).map(o => ({ ...o, label: o.item.r })),
  }),
  listenPic: w => ({
    key: `v:${w.jp}`, ask: '聽一聽，是哪一個？', optClass: 'opt-emoji',
    prompt: { kind: 'audio', value: w.jp }, say: w.jp, reveal: `${w.jp}＝${w.zh}`,
    options: optionsFrom(w, ALL_WORDS, x => x.e).map(o => ({ ...o, label: o.item.e })),
  }),
  picWord: w => ({
    key: `v:${w.jp}`, ask: '這個用日語怎麼說？', optClass: 'opt-word', optLang: 'ja',
    prompt: { kind: 'emoji', value: w.e }, say: w.jp, reveal: `${w.jp}＝${w.zh}`,
    options: optionsFrom(w, ALL_WORDS, x => x.jp).map(o => ({ ...o, label: o.item.jp, sub: o.item.ro })),
  }),
};

// 出題時優先放入最多 4 個錯過的字，其餘隨機
function pickItems(pool, keyFn, n = 10) {
  const weak = shuffle(pool.filter(x => state.mistakes[keyFn(x)])).slice(0, 4);
  const rest = sample(pool.filter(x => !weak.includes(x)), n - weak.length);
  return shuffle([...weak, ...rest]);
}

const QUIZ_TYPES = {
  'listen-hira': {
    icon: '👂', name: '聽聲音・找平假名',
    make: () => pickItems(BASIC, k => `hira:${k.hira}`).map(k => Q.listenKana(k, 'hira')),
  },
  'listen-kata': {
    icon: '🎧', name: '聽聲音・找片假名',
    make: () => pickItems(BASIC, k => `kata:${k.kata}`).map(k => Q.listenKana(k, 'kata')),
  },
  'read-hira': {
    icon: 'あ', name: '平假名怎麼唸',
    make: () => pickItems(BASIC, k => `hira:${k.hira}`).map(k => Q.readKana(k, 'hira')),
  },
  'read-kata': {
    icon: 'ア', name: '片假名怎麼唸',
    make: () => pickItems(BASIC, k => `kata:${k.kata}`).map(k => Q.readKana(k, 'kata')),
  },
  'listen-pic': {
    icon: '🖼️', name: '聽日語・找圖片',
    make: () => pickItems(ALL_WORDS, w => `v:${w.jp}`).map(Q.listenPic),
  },
  'pic-word': {
    icon: '📖', name: '看圖片・選日語',
    make: () => pickItems(ALL_WORDS, w => `v:${w.jp}`).map(Q.picWord),
  },
};

/* ---------- 錯題 ---------- */
// 答錯記 2 分，之後每答對一次減 1，歸零就從錯題本畢業
function recordAnswer(key, ok) {
  const m = state.mistakes;
  if (!ok) m[key] = 2;
  else if (m[key] && --m[key] <= 0) delete m[key];
  save();
}

function lookupKey(key) {
  const i = key.indexOf(':'), kind = key.slice(0, i), val = key.slice(i + 1);
  if (kind === 'v') {
    const w = ALL_WORDS.find(x => x.jp === val);
    return w && { kind, w, label: `${w.e} ${w.jp}`, say: w.jp };
  }
  const pool = BASIC.some(k => k[kind] === val) ? BASIC : DAKU;
  const k = pool.find(x => x[kind] === val);
  return k && { kind, k, pool, label: val, say: val };
}

const REVIEW = {
  icon: '🔁', name: '錯題複習', review: true,
  make: () => shuffle(Object.keys(state.mistakes)
    .sort((a, b) => state.mistakes[b] - state.mistakes[a])
    .slice(0, 10)
    .map(key => {
      const it = lookupKey(key);
      if (!it) { delete state.mistakes[key]; return null; }
      const listen = Math.random() < 0.5;
      if (it.kind === 'v') return listen ? Q.listenPic(it.w) : Q.picWord(it.w);
      return listen ? Q.listenKana(it.k, it.kind, it.pool) : Q.readKana(it.k, it.kind, it.pool);
    })
    .filter(Boolean)),
};

const mistakeCount = () => Object.keys(state.mistakes).length;

function quizPage(type) {
  if (type === 'review') return mistakeCount() ? runQuiz('review', REVIEW) : reviewEmpty();
  if (QUIZ_TYPES[type]) return runQuiz(type, QUIZ_TYPES[type]);
  setHeader('小測驗', '#/');
  const n = mistakeCount();
  app.append(
    h('p', { class: 'hint' }, '每回 10 題，答對一題得 1 顆星 ⭐ 答錯的字會記在錯題本，之後會多考幾次喔！'),
    h('a', { class: 'quiz-item review' + (n ? '' : ' empty'), href: '#/quiz/review' },
      h('span', { class: 'qi-icon' }, REVIEW.icon),
      h('span', { class: 'qi-name' }, REVIEW.name),
      h('span', { class: 'qi-best' }, n ? `${n} 個字要加油` : '沒有錯題 🎉')),
    h('div', { class: 'quiz-list' }, Object.entries(QUIZ_TYPES).map(([id, q]) =>
      h('a', { class: 'quiz-item', href: `#/quiz/${id}` },
        h('span', { class: 'qi-icon', lang: 'ja' }, q.icon),
        h('span', { class: 'qi-name' }, q.name),
        h('span', { class: 'qi-best' }, state.best[id] != null ? `最佳 ${state.best[id]}/10` : '還沒玩過')))),
  );
}

function reviewEmpty() {
  setHeader('錯題複習', '#/quiz');
  app.append(h('div', { class: 'result' },
    h('div', { class: 'result-emoji' }, '🎉'),
    h('h2', {}, '錯題本是空的！'),
    h('p', { class: 'result-score' }, '答錯的字會自動放進這裡，答對 2 次就會畢業。'),
    h('div', { class: 'row' }, h('a', { class: 'btn', href: '#/quiz' }, '去玩小測驗'))));
}

function runQuiz(type, def) {
  setHeader(def.name, def.back || '#/quiz');
  const token = renderToken;
  const alive = () => token === renderToken;
  const qs = def.make();
  let i = 0, score = 0;
  const box = h('div', { class: 'quiz' });
  app.append(box);

  function show() {
    const q = qs[i];
    let locked = false;
    let prompt;
    if (q.prompt.kind === 'audio') {
      prompt = h('button', { class: 'prompt prompt-audio', onclick: () => speak(q.prompt.value), 'aria-label': '再聽一次' }, '🔊');
      setTimeout(() => alive() && speak(q.prompt.value), 400);
    } else {
      prompt = h('div', { class: `prompt prompt-${q.prompt.kind}`, lang: q.prompt.kind === 'text' ? 'ja' : null }, q.prompt.value);
    }
    const reveal = h('p', { class: 'reveal', lang: 'ja' });
    const opts = h('div', { class: 'options' });
    q.options.forEach(o => {
      const b = h('button', { class: `opt ${q.optClass}`, lang: q.optLang },
        o.label, o.sub && h('small', { class: 'romaji' }, o.sub));
      b.onclick = () => {
        if (locked) return;
        locked = true;
        opts.classList.add('locked');
        recordAnswer(q.key, o.correct);
        if (o.correct) { b.classList.add('right'); score++; sfx.good(); }
        else {
          b.classList.add('wrong');
          opts.children[q.options.findIndex(x => x.correct)].classList.add('right');
          sfx.bad();
        }
        if (q.reveal) reveal.textContent = q.reveal;
        setTimeout(() => alive() && speak(q.say), 350);
        setTimeout(() => { if (!alive()) return; i++; i < qs.length ? show() : finish(); }, o.correct ? 1500 : 2300);
      };
      opts.append(b);
    });
    box.replaceChildren(
      h('div', { class: 'quiz-progress' },
        h('div', { class: 'bar' }, h('i', { style: `width:${(i / qs.length) * 100}%` })),
        h('span', {}, `${i + 1} / ${qs.length}`), h('span', {}, `⭐ ${score}`)),
      def.review && state.mistakes[q.key] ? h('p', { class: 'review-tag' }, '🔁 之前錯過的字') : null,
      h('p', { class: 'quiz-ask' }, q.ask),
      prompt, reveal, opts);
  }

  function finish() {
    if (def.stage) return stageFinish(def.stage, score, qs.length, box);
    addStars(score);
    const isBest = !def.review && (state.best[type] == null || score > state.best[type]);
    if (isBest) { state.best[type] = score; save(); }
    const total = qs.length, ratio = score / total;
    if (score === total) setTimeout(() => awardSticker('perfect'), 900);
    const left = mistakeCount();
    const msg = ratio >= 0.9 ? '太厲害了！すごい！' : ratio >= 0.6 ? '做得很好！いいね！' : '再試一次會更棒！がんばって！';
    sfx.win();
    if (ratio >= 0.8) confetti();
    box.replaceChildren(h('div', { class: 'result' },
      h('div', { class: 'result-emoji' }, ratio >= 0.9 ? '🏆' : ratio >= 0.6 ? '🎉' : '💪'),
      h('h2', {}, msg),
      h('p', { class: 'result-score' }, `答對 ${score} / ${total} 題，獲得 ${score} 顆星星`),
      h('p', { class: 'result-stars' }, '⭐'.repeat(score) || '🌱'),
      isBest && score > 0 ? h('p', { class: 'badge' }, '🎖️ 新紀錄！') : null,
      def.review ? h('p', { class: 'badge' }, left ? `錯題本還有 ${left} 個字` : '🎊 錯題全部清光了！') : null,
      h('div', { class: 'row' },
        h('button', { class: 'btn', onclick: render }, def.review && left ? '🔁 繼續複習' : '🔁 再玩一次'),
        !def.review && left ? h('a', { class: 'btn ghost', href: '#/quiz/review' }, `📒 複習錯題（${left}）`) : null,
        h('a', { class: 'btn ghost', href: '#/quiz' }, '換別的測驗'))));
  }

  show();
}

/* ---------- 冒險地圖 ---------- */
// 第 10 關「わ行」把ん一起帶進來
const kanaRowItems = row => KANA.basic.slice(row, row === 9 ? 11 : row + 1).flat().filter(Boolean);
const kanaPoolUpTo = row => KANA.basic.slice(0, row === 9 ? 11 : row + 1).flat().filter(Boolean);

function kanaChapter(id, sc, name, icon, color, requires) {
  const stages = KANA.basic.slice(0, 10).map((_, row) => {
    const first = kanaRowItems(row)[0][sc];
    return { id: `${id}-${row}`, type: 'kana', sc, row, label: first, name: `${first}行` };
  });
  stages.push({ id: `${id}-boss`, type: 'boss', sc, label: '👑', name: `${name}大魔王` });
  return { id, name, icon, color, requires, stages };
}

const CHAPTERS = [
  kanaChapter('hira', 'hira', '平假名森林', '🌳', 'green'),
  kanaChapter('kata', 'kata', '片假名海洋', '🌊', 'blue', 'hira-boss'),
  {
    id: 'words', name: '單字城堡', icon: '🏰', color: 'purple',
    stages: [
      ...VOCAB.map(c => ({ id: `w-${c.id}`, type: 'words', cat: c.id, label: c.icon, name: c.name })),
      { id: 'words-boss', type: 'wboss', label: '👑', name: '單字大魔王' },
    ],
  },
];
const STAGES = {};
CHAPTERS.forEach(ch => ch.stages.forEach((st, i) => Object.assign(STAGES, { [st.id]: Object.assign(st, { chapter: ch, index: i }) })));

const isBoss = st => st.type === 'boss' || st.type === 'wboss';
const stageStars = st => state.stages[st.id] || 0;
const chapterOpen = ch => !ch.requires || state.stages[ch.requires] > 0;
const stageOpen = st => chapterOpen(st.chapter) && (st.index === 0 || stageStars(st.chapter.stages[st.index - 1]) > 0);
const allStages = () => CHAPTERS.flatMap(ch => ch.stages);
const currentStage = () => allStages().find(st => stageOpen(st) && !stageStars(st));
const starText = n => '★'.repeat(n) + '☆'.repeat(3 - n);

function nextStage(st) {
  const ch = st.chapter;
  if (st.index + 1 < ch.stages.length) return ch.stages[st.index + 1];
  const unlocked = CHAPTERS.find(c => c.requires === st.id);
  return unlocked ? unlocked.stages[0] : null;
}

function makeStageQuiz(st) {
  if (st.type === 'kana') {
    const items = kanaRowItems(st.row), pool = kanaPoolUpTo(st.row);
    const seq = [];
    while (seq.length < 8) seq.push(items[seq.length % items.length]);
    return shuffle(seq).map((k, i) => (i % 2 ? Q.readKana(k, st.sc, pool) : Q.listenKana(k, st.sc, pool)));
  }
  if (st.type === 'boss') return sample(BASIC, 10).map(k => (Math.random() < 0.5 ? Q.readKana(k, st.sc) : Q.listenKana(k, st.sc)));
  const words = st.type === 'words' ? VOCAB.find(c => c.id === st.cat).words : ALL_WORDS;
  return sample(words, isBoss(st) ? 10 : 8).map(w => (Math.random() < 0.5 ? Q.picWord(w) : Q.listenPic(w)));
}
const stageNeed = st => (isBoss(st) ? 7 : 6);

function mapPage() {
  setHeader('冒險地圖', '#/');
  const cur = currentStage();
  const GAP = 100, XS = [50, 78, 50, 22];

  app.append(h('p', { class: 'hint' }, '一關一關往前走！每關答對 6 題就過關，全對拿 3 顆星 ⭐'));
  for (const ch of CHAPTERS) {
    const open = chapterOpen(ch);
    const cleared = ch.stages.filter(stageStars).length;
    const n = ch.stages.length, height = n * GAP;
    const pts = ch.stages.map((_, i) => [XS[i % 4], i * GAP + GAP / 2]);
    const d = pts.map(([x, y], i) => {
      if (!i) return `M${x},${y}`;
      const [px, py] = pts[i - 1], my = (py + y) / 2;
      return `C${px},${my} ${x},${my} ${x},${y}`;
    }).join(' ');
    const svg = svgEl('svg', { class: 'map-path', viewBox: `0 0 100 ${height}`, preserveAspectRatio: 'none', 'aria-hidden': 'true' });
    svg.append(svgEl('path', { d, 'vector-effect': 'non-scaling-stroke' }));

    const nodes = ch.stages.map((st, i) => {
      const unlocked = stageOpen(st), stars = stageStars(st);
      const cls = ['node', isBoss(st) && 'boss', stars && 'cleared', !unlocked && 'locked', st === cur && 'current'].filter(Boolean).join(' ');
      const style = `left:${pts[i][0]}%;top:${pts[i][1]}px`;
      const inner = [
        st === cur ? h('span', { class: 'node-fox', 'aria-hidden': 'true' }, '🦊') : null,
        h('span', { class: 'node-dot', lang: st.type === 'kana' ? 'ja' : null }, unlocked ? st.label : '🔒'),
        h('span', { class: 'node-stars' }, stars ? starText(stars) : st.name),
      ];
      return unlocked
        ? h('a', { class: cls, style, href: `#/stage/${st.id}`, 'aria-label': `${st.name}${stars ? `，${stars} 顆星` : ''}` }, inner)
        : h('div', { class: cls, style, 'aria-label': `${st.name}（還沒解鎖）` }, inner);
    });

    const req = ch.requires && STAGES[ch.requires].chapter;
    app.append(h('section', { class: `chapter ${ch.color}${open ? '' : ' closed'}` },
      h('div', { class: 'chapter-head' },
        h('span', { class: 'chapter-icon' }, ch.icon),
        h('h2', {}, ch.name),
        h('span', { class: 'chapter-count' }, `${cleared} / ${n}`)),
      open ? null : h('p', { class: 'chapter-lock' }, `🔒 打敗「${req.name}」的大魔王就能出發！`),
      h('div', { class: 'map-track', style: `height:${height}px` }, svg, nodes)));
  }
  const curEl = $('.node.current');
  if (curEl) requestAnimationFrame(() => curEl.scrollIntoView({ block: 'center' }));
}

function stagePage(id, go) {
  const st = STAGES[id];
  if (!st || !stageOpen(st)) { location.replace('#/map'); return; }
  if (go === 'go') {
    return runQuiz(st.id, { name: `${st.name}・挑戰`, back: `#/stage/${st.id}`, stage: st, make: () => makeStageQuiz(st) });
  }
  setHeader(`${st.chapter.icon} ${st.name}`, '#/map');
  const total = isBoss(st) ? 10 : 8;
  let learn;
  if (st.type === 'kana') {
    const isHira = st.sc === 'hira';
    learn = h('div', { class: 'learn-grid' }, kanaRowItems(st.row).map(k => {
      const ch = k[st.sc], key = `${st.sc}:${ch}`;
      const b = h('button', { class: 'cell' + (state.heard[key] ? ' heard' : '') },
        h('span', { class: 'kana', lang: 'ja' }, ch), h('span', { class: 'romaji' }, k.r));
      b.onclick = () => { speak(ch); markHeard(key); b.classList.add('heard'); showKanaDetail(k, isHira); };
      return b;
    }));
  } else if (st.type === 'words') {
    learn = h('div', { class: 'word-grid' }, VOCAB.find(c => c.id === st.cat).words.map(w => {
      const b = h('button', { class: 'word-card' },
        h('span', { class: 'emoji' }, w.e), h('span', { class: 'jp', lang: 'ja' }, w.jp),
        h('span', { class: 'romaji' }, w.ro), h('span', { class: 'zh' }, w.zh));
      b.onclick = () => { b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); markHeard(`v:${w.jp}`); speak(w.jp); };
      return b;
    }));
  } else {
    learn = h('div', { class: 'boss-intro' }, h('div', { class: 'boss-face' }, '👹'),
      h('p', {}, `大魔王會從整個「${st.chapter.name}」出題！`));
  }
  const stars = stageStars(st);
  app.append(
    h('div', { class: 'stage-banner' },
      h('p', { class: 'stage-no' }, `第 ${st.index + 1} 關`),
      h('h2', {}, st.name),
      h('p', {}, isBoss(st) ? '準備好了嗎？' : '先點每個卡片聽一聽、看筆順，準備好就開始挑戰！'),
      h('p', { class: 'stage-rule' }, `共 ${total} 題，答對 ${stageNeed(st)} 題就過關`),
      stars ? h('p', { class: 'stage-best' }, `目前成績 ${starText(stars)}`) : null),
    learn,
    h('div', { class: 'row stage-go' }, h('a', { class: 'btn big', href: `#/stage/${st.id}/go` }, '⚔️ 開始挑戰')),
  );
}

function stageFinish(st, score, total, box) {
  const need = stageNeed(st);
  const stars = score === total ? 3 : score >= total - 1 ? 2 : score >= need ? 1 : 0;
  const prev = stageStars(st);
  const first = stars > 0 && !prev;
  const next = nextStage(st);
  if (stars > prev) state.stages[st.id] = stars;
  if (stars) {
    setTimeout(() => {
      awardSticker('first');
      if (isBoss(st)) awardSticker('boss');
      if (score === total) awardSticker('perfect');
    }, 900);
  }
  addStars(score + (first ? 5 : 0));

  if (!stars) {
    sfx.bad();
    box.replaceChildren(h('div', { class: 'result' },
      h('div', { class: 'result-emoji' }, '💪'),
      h('h2', {}, '差一點點！'),
      h('p', { class: 'result-score' }, `答對 ${score} / ${total} 題，要答對 ${need} 題才能過關`),
      h('div', { class: 'row' },
        h('button', { class: 'btn', onclick: render }, '🔁 再挑戰一次'),
        h('a', { class: 'btn ghost', href: `#/stage/${st.id}` }, '📖 回去複習'))));
    return;
  }
  sfx.win(); confetti();
  box.replaceChildren(h('div', { class: 'result' },
    h('div', { class: 'result-emoji' }, isBoss(st) ? '👑' : '🎉'),
    h('h2', {}, isBoss(st) ? '打敗大魔王了！' : '過關了！'),
    h('p', { class: 'stage-stars' }, starText(stars)),
    h('p', { class: 'result-score' }, `答對 ${score} / ${total} 題，獲得 ${score} 顆星星`),
    first ? h('p', { class: 'badge' }, '🎁 第一次過關，多送 5 顆星！') : null,
    first && next ? h('p', { class: 'badge' }, `🔓 解鎖新關卡「${next.name}」`) : null,
    h('div', { class: 'row' },
      next ? h('a', { class: 'btn', href: `#/stage/${next.id}` }, '下一關 ➜') : null,
      stars < 3 ? h('button', { class: 'btn ghost', onclick: render }, '🔁 再挑戰拿 3 星') : null,
      h('a', { class: 'btn ghost', href: '#/map' }, '🗺️ 回地圖'))));
}

/* ---------- 提示小卡 ---------- */
function toast(icon, title, sub, say) {
  let wrap = $('#toasts');
  if (!wrap) { wrap = h('div', { id: 'toasts', 'aria-live': 'polite' }); document.body.append(wrap); }
  const t = h('div', { class: 'toast' },
    h('span', { class: 'toast-icon' }, icon),
    h('div', {}, h('b', {}, title), sub ? h('small', { lang: say ? 'ja' : null }, sub) : null));
  wrap.append(t);
  sfx.win();
  if (say) setTimeout(() => speak(say), 400);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 400); }, 3500);
}

/* ---------- 每日目標 ---------- */
const dayStr = (d = new Date()) => d.toLocaleDateString('sv'); // YYYY-MM-DD（本地時間）
const daysAgo = n => { const d = new Date(); d.setDate(d.getDate() - n); return dayStr(d); };

function today() {
  if (state.daily.date !== dayStr()) state.daily = { date: dayStr(), stars: 0, done: false };
  return state.daily;
}
const currentStreak = () => ([dayStr(), daysAgo(1)].includes(state.streak.last) ? state.streak.count : 0);

// 由 addStars 呼叫；達標時更新連續天數並發獎勵
function trackDaily(n) {
  const d = today();
  d.stars += n;
  if (d.done || d.stars < state.dailyGoal) return;
  d.done = true;
  const count = state.streak.last === daysAgo(1) ? state.streak.count + 1 : 1;
  state.streak = { count, last: d.date };
  state.goalDays = [...state.goalDays.filter(x => x !== d.date), d.date].slice(-60);
  state.goalsDone++;
  setTimeout(() => {
    toast('🎯', '今日目標達成！', `連續 ${count} 天 🔥`);
    if (count >= 3) awardSticker('streak3');
    if (count >= 7) awardSticker('streak7');
    if (state.goalsDone >= 5) awardSticker('goal5');
  }, 1200);
}

function dailyCard() {
  const d = today(), goal = state.dailyGoal;
  const got = Math.min(d.stars, goal), pct = (got / goal) * 100;
  const WEEK = '日一二三四五六';
  const ring = svgEl('svg', { viewBox: '0 0 36 36', class: 'ring', 'aria-hidden': 'true' });
  ring.append(
    svgEl('circle', { cx: 18, cy: 18, r: 15.9, class: 'ring-bg' }),
    got ? svgEl('circle', { cx: 18, cy: 18, r: 15.9, class: 'ring-fg', 'stroke-dasharray': `${pct} 100` }) : '');
  const days = [6, 5, 4, 3, 2, 1, 0].map(n => {
    const ds = daysAgo(n);
    const done = state.goalDays.includes(ds);
    return h('span', { class: 'wday' + (done ? ' done' : '') + (n === 0 ? ' today' : ''), title: ds },
      done ? '⭐' : '', h('small', {}, WEEK[new Date(ds + 'T00:00').getDay()]));
  });
  return h('section', { class: 'daily' + (d.done ? ' complete' : '') },
    h('div', { class: 'ring-wrap' }, ring, h('span', { class: 'ring-label' }, d.done ? '🎉' : '⭐')),
    h('div', { class: 'daily-text' },
      h('b', {}, d.done ? '今日目標達成！' : '今日目標'),
      h('span', {}, `今天拿到 ${got} / ${goal} 顆星`),
      h('div', { class: 'week' }, days)),
    h('div', { class: 'streak' + (currentStreak() ? ' on' : '') },
      h('span', { class: 'flame' }, '🔥'), h('b', {}, currentStreak()), h('small', {}, '連續天數')));
}

/* ---------- 貼紙 ---------- */
const GACHA_COST = 10;
const STICKER_SERIES = [
  {
    name: '動物', items: [
      ['🐶', 'いぬ'], ['🐱', 'ねこ'], ['🐰', 'うさぎ'], ['🐻', 'くま'], ['🐼', 'パンダ'], ['🦊', 'きつね'],
      ['🐨', 'コアラ'], ['🐯', 'とら'], ['🦁', 'ライオン'], ['🐸', 'かえる'], ['🐧', 'ペンギン'], ['🐤', 'ひよこ'],
    ],
  },
  { name: '海洋', items: [['🐳', 'くじら'], ['🐬', 'いるか'], ['🐙', 'たこ'], ['🦀', 'かに'], ['🐠', 'さかな'], ['🐢', 'かめ']] },
  { name: '甜點', items: [['🍩', 'ドーナツ'], ['🍦', 'アイス'], ['🍭', 'あめ'], ['🧁', 'カップケーキ'], ['🍡', 'だんご'], ['🍮', 'プリン']] },
  {
    name: '特別貼紙', special: true, items: [
      ['🚩', 'はじめて', '第一次過關', 'first'], ['👑', 'おうさま', '打敗大魔王', 'boss'],
      ['💯', 'まんてん', '測驗全部答對', 'perfect'], ['🔥', 'みっか', '連續 3 天達成目標', 'streak3'],
      ['🏆', 'なのか', '連續 7 天達成目標', 'streak7'], ['🌈', 'にじ', '完成每日目標 5 次', 'goal5'],
      ['✍️', 'かける', '描字挑戰拿到 3 星', 'writer'],
    ],
  },
];
const STICKERS = {};
STICKER_SERIES.forEach(s => s.items.forEach(([e, jp, how, id]) => {
  STICKERS[id || e] = { id: id || e, e, jp, how, special: !!s.special };
}));
const stickerTotal = Object.keys(STICKERS).length;
const stickerOwned = () => Object.keys(state.stickers).filter(id => STICKERS[id]).length;
const wallet = () => state.stars - state.spent;

function awardSticker(id) {
  const s = STICKERS[id];
  if (!s || state.stickers[id]) return;
  state.stickers[id] = dayStr();
  save();
  toast(s.e, `獲得特別貼紙「${s.how}」`, s.jp, s.jp);
}

function stickerPage() {
  setHeader('貼紙本', '#/');
  app.replaceChildren();
  const pool = Object.values(STICKERS).filter(s => !s.special && !state.stickers[s.id]);
  const money = wallet();
  const canSpin = pool.length > 0 && money >= GACHA_COST;

  const machine = h('div', { class: 'gacha-machine', 'aria-hidden': 'true' },
    h('div', { class: 'gacha-globe' }, [
      ['#ff8fab', 6, 4], ['#7cc6fe', 38, 2], ['#ffd166', 70, 6], ['#7ed9a6', 20, 30],
      ['#c3a6ff', 54, 32], ['#ffad7a', 86, 26], ['#7cc6fe', 38, 58],
    ].map(([c, x, y]) => h('span', { class: 'capsule', style: `--cc:${c};left:${x}px;bottom:${y}px` }))),
    h('div', { class: 'gacha-base' }, h('span', { class: 'gacha-knob' })));

  const spin = h('button', { class: 'btn big', disabled: !canSpin },
    !pool.length ? '全部集滿了！🎉' : canSpin ? `🎰 轉一次（${GACHA_COST} ⭐）` : `還差 ${GACHA_COST - money} 顆星`);
  spin.onclick = () => {
    if (!canSpin) return;
    const token = renderToken;
    const s = sample(pool, 1)[0];
    state.spent += GACHA_COST;
    state.stickers[s.id] = dayStr();
    save();
    spin.disabled = true;
    machine.classList.add('spinning');
    beep([[400, 0.08], [500, 0.08], [400, 0.08], [600, 0.08], [700, 0.12]]);
    setTimeout(() => {
      if (token !== renderToken) return;
      stickerPage();
      sfx.win(); confetti();
      openModal(h('div', { class: 'reveal-card' },
        h('div', { class: 'reveal-sticker' }, s.e),
        h('h2', {}, '獲得新貼紙！'),
        h('p', { class: 'reveal-jp', lang: 'ja' }, s.jp),
        h('div', { class: 'row' },
          h('button', { class: 'btn', onclick: () => speak(s.jp) }, '🔊 聽聽看'),
          h('button', { class: 'btn ghost', onclick: closeModal }, '貼進貼紙本'))));
      setTimeout(() => speak(s.jp), 500);
    }, 1300);
  };

  app.append(
    h('section', { class: 'gacha' }, machine,
      h('div', { class: 'gacha-info' },
        h('p', { class: 'gacha-title' }, '扭蛋機'),
        h('p', {}, `用 ${GACHA_COST} 顆星星轉一次，抽一張還沒有的貼紙！`),
        h('p', { class: 'gacha-wallet' }, `我的星星：${money} ⭐`),
        spin)),
    h('p', { class: 'hint' }, `已收集 ${stickerOwned()} / ${stickerTotal} 張。點貼紙會說出它的日語名字喔！`),
    ...STICKER_SERIES.map(series => {
      const items = series.items.map(([e, , , id]) => STICKERS[id || e]);
      const n = items.filter(s => state.stickers[s.id]).length;
      return h('section', { class: 'sticker-series' },
        h('h2', { class: 'section-title' }, `${series.name}　${n} / ${items.length}`),
        h('div', { class: 'sticker-grid' }, items.map(s => {
          if (!state.stickers[s.id]) {
            return h('div', { class: 'sticker missing' }, h('span', { class: 'sticker-e' }, '？'),
              h('small', {}, s.special ? s.how : '扭蛋抽'));
          }
          const b = h('button', { class: 'sticker' + (s.special ? ' special' : '') },
            h('span', { class: 'sticker-e' }, s.e), h('small', { lang: 'ja' }, s.jp));
          b.onclick = () => { b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); speak(s.jp); };
          return b;
        })));
    }),
  );
}

/* ---------- 翻牌配對 ---------- */
function matchPage() {
  setHeader('翻牌配對', '#/');
  const token = renderToken;
  const words = sample(ALL_WORDS, 6);
  const deck = shuffle(words.flatMap((w, id) => [{ id, w, face: w.e, kind: 'emoji' }, { id, w, face: w.jp, kind: 'word' }]));
  let open = [], matched = 0, moves = 0, busy = false;

  const info = h('p', { class: 'hint' });
  const updateInfo = () => { info.textContent = `把圖片和日語配成一對！已翻 ${moves} 次，配對 ${matched} / ${words.length}`; };
  updateInfo();
  const result = h('div');

  const grid = h('div', { class: 'match-grid' }, deck.map(c => {
    const el = h('button', { class: `mcard ${c.kind}`, 'aria-label': '翻開卡片' },
      h('span', { class: 'mcard-inner' },
        h('span', { class: 'mcard-front' }, '？'),
        h('span', { class: 'mcard-back', lang: c.kind === 'word' ? 'ja' : null }, c.face)));
    el.onclick = () => {
      if (busy || el.classList.contains('flip')) return;
      el.classList.add('flip');
      if (c.kind === 'word') speak(c.w.jp);
      open.push([el, c]);
      if (open.length < 2) return;
      moves++;
      const [[e1, c1], [e2, c2]] = open;
      open = [];
      if (c1.id === c2.id) {
        e1.classList.add('done'); e2.classList.add('done');
        matched++; sfx.good();
        setTimeout(() => token === renderToken && speak(c1.w.jp), 300);
        if (matched === words.length) setTimeout(() => token === renderToken && finish(), 900);
      } else {
        busy = true;
        setTimeout(() => { e1.classList.remove('flip'); e2.classList.remove('flip'); busy = false; }, 1000);
      }
      updateInfo();
    };
    return el;
  }));

  function finish() {
    const stars = moves <= 9 ? 3 : moves <= 13 ? 2 : 1;
    addStars(stars);
    sfx.win(); confetti();
    result.replaceChildren(h('div', { class: 'result' },
      h('div', { class: 'result-emoji' }, '🎊'),
      h('h2', {}, '全部配對成功！'),
      h('p', { class: 'result-score' }, `翻了 ${moves} 次，獲得 ${stars} 顆星星`),
      h('p', { class: 'result-stars' }, '⭐'.repeat(stars)),
      h('div', { class: 'word-list' }, words.map(w =>
        h('button', { class: 'mini-word', onclick: () => speak(w.jp) }, `${w.e} `, h('span', { lang: 'ja' }, w.jp), ` ${w.zh}`))),
      h('div', { class: 'row' }, h('button', { class: 'btn', onclick: render }, '🔁 再玩一次'))));
    result.scrollIntoView({ behavior: 'smooth' });
  }

  app.append(info, grid, result);
}

/* ---------- 我的進度 ---------- */
function progressPage() {
  setHeader('我的進度', '#/');
  const count = (list, fn) => list.filter(x => state.heard[fn(x)]).length;
  const kanaAll = [...BASIC, ...DAKU];
  const bars = [
    ['平假名', count(kanaAll, k => `hira:${k.hira}`), kanaAll.length, 'pink'],
    ['片假名', count(kanaAll, k => `kata:${k.kata}`), kanaAll.length, 'blue'],
    ['單字', count(ALL_WORDS, w => `v:${w.jp}`), ALL_WORDS.length, 'yellow'],
    ['寫過的字', Object.keys(state.writing).length, kanaAll.length * 2, 'purple'],
    ['關卡', allStages().filter(stageStars).length, allStages().length, 'green'],
  ];
  const medal = state.stars >= 200 ? '👑 日語小達人' : state.stars >= 100 ? '🥇 金牌學習家' : state.stars >= 50 ? '🥈 銀牌學習家' : state.stars >= 10 ? '🥉 銅牌學習家' : '🌱 日語小芽芽';

  app.append(
    h('section', { class: 'star-box' },
      h('div', { class: 'big-star' }, '⭐'),
      h('div', {},
        h('p', { class: 'star-total' }, `${state.stars} 顆星星`),
        h('p', {}, medal),
        h('p', { class: 'star-sub' }, `可以用的星星 ${wallet()} ⭐・貼紙 ${stickerOwned()} / ${stickerTotal} 張`))),
    h('h2', { class: 'section-title' }, '🎯 每日目標'),
    dailyCard(),
    h('h2', { class: 'section-title' }, '聽過的字'),
    h('div', { class: 'bars' }, bars.map(([label, n, total, color]) =>
      h('div', { class: 'bar-row' },
        h('span', {}, label),
        h('div', { class: `bar ${color}` }, h('i', { style: `width:${(n / total) * 100}%` })),
        h('span', { class: 'bar-num' }, `${n}/${total}`)))),
    h('h2', { class: 'section-title' }, '📒 錯題本'),
    mistakeCount()
      ? h('div', { class: 'weak-box' },
        h('div', { class: 'weak-list' }, Object.keys(state.mistakes).map(lookupKey).filter(Boolean).map(it =>
          h('button', { class: 'weak-chip', lang: 'ja', onclick: () => speak(it.say) }, it.label))),
        h('a', { class: 'btn', href: '#/quiz/review' }, `🔁 開始複習（${mistakeCount()}）`))
      : h('p', { class: 'hint' }, '目前沒有錯題，太棒了！🎉'),
    h('h2', { class: 'section-title' }, '測驗最佳成績'),
    h('div', { class: 'best-list' }, Object.entries(QUIZ_TYPES).map(([id, q]) =>
      h('a', { class: 'best-item', href: `#/quiz/${id}` },
        h('span', { lang: 'ja' }, q.icon), h('span', {}, q.name),
        h('b', {}, state.best[id] != null ? `${state.best[id]}/10` : '—')))),
    h('h2', { class: 'section-title' }, '設定'),
    themeSetting(),
    h('div', { class: 'setting' },
      h('span', {}, '每日目標'),
      h('div', { class: 'seg' }, [10, 15, 20, 30].map(n =>
        h('a', {
          href: '#/progress', class: state.dailyGoal === n ? 'on' : null,
          onclick: e => { e.preventDefault(); state.dailyGoal = n; save(); render(); },
        }, `${n} ⭐`)))),
    h('div', { class: 'row' },
      romajiToggle(),
      h('button', {
        class: 'btn ghost danger',
        onclick: () => {
          if (!confirm('確定要把星星和進度全部清除嗎？')) return;
          Object.assign(state, {
            stars: 0, heard: {}, best: {}, mistakes: {}, stages: {}, writing: {},
            spent: 0, stickers: {}, daily: {}, streak: { count: 0, last: null }, goalDays: [], goalsDone: 0,
            srs: {}, srsDay: {}, grammar: {},
          });
          save(); render();
        },
      }, '🗑️ 清除進度')),
    h('p', { class: 'credit' }, '筆順資料來自 ',
      h('a', { href: 'https://kanjivg.tagaini.net', target: '_blank', rel: 'noopener' }, 'KanjiVG'),
      '（© Ulrich Apel，CC BY-SA 3.0）'),
  );
}

/* ---------- 啟動 ---------- */
syncUI();
render();
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
