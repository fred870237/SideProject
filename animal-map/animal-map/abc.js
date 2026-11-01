// 🔤 字母探險：三種模式
//   ABC  ：點字母 → 這個字母開頭的動物和車子，聽英文；考考你「Which one starts with B?」
//   ㄅㄆㄇ：點注音 → 這個注音開頭的動物和車子（字上面有注音），聽中文；考考你「哪一個是 ㄅ 開頭的？」
//   あいう：點假名 → 這個假名開頭的動物和車子（が、ぱ 也算 か、は），聽日文；考考你「あではじまるのはどれ？」

const $ = (id) => document.getElementById(id);
const TILE_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

// 沒有動物或車子的英文字母（Q、U、V、X）補幾個繪本常見的字
Object.assign(ART, {
  xylophone: () => {
    const { st, line } = K;
    const bars = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];
    return line('M-40 4 L40 -6 M-40 30 L40 22', LINE, 3.4) +
      bars.map((c, i) => {
        const x = -36 + i * 13, h = 40 - i * 4;
        return `<rect x="${x}" y="${12 - i * 1.8 - h / 2}" width="10" height="${h}" rx="3" ${st(c)}/>`;
      }).join('') +
      line('M-12 40 L8 -30 M14 42 L34 -24', '#c98b55', 3) +
      `<circle cx="8" cy="-32" r="5" ${st('#ef4444')}/><circle cx="34" cy="-26" r="5" ${st('#3b82f6')}/>`;
  },
});
const ABC_EXTRAS = [
  { id: 'queen', en: 'Queen', zh: '皇后', emoji: '👑' },
  { id: 'unicorn', en: 'Unicorn', zh: '獨角獸', emoji: '🦄' },
  { id: 'umbrella', en: 'Umbrella', zh: '雨傘', emoji: '☂️' },
  { id: 'violin', en: 'Violin', zh: '小提琴', emoji: '🎻' },
  { id: 'volcano', en: 'Volcano', zh: '火山', emoji: '🌋' },
  { id: 'xylophone', en: 'Xylophone', zh: '木琴' },
].map((w) => ({ ...w, extra: true }));

const ITEMS = [...ANIMALS, ...VEHICLES].filter((w) => ART[w.id]);

/* ================= 兩種模式的設定 ================= */

const zyColor = (S) => (ZY_MEDIALS.includes(S) ? '#8b5cf6'
  : ZY_FINALS.includes(S) ? TILE_COLORS[(ZY_FINALS.indexOf(S) + 3) % TILE_COLORS.length]
  : TILE_COLORS[ZY_INITIALS.indexOf(S) % TILE_COLORS.length]);
const syllables = (w) => w.zy.split(' ');
const firstZy = (w) => syllables(w)[0].replace('˙', '')[0];

const ZY_WORDS = ITEMS.filter((w) => ZHUYIN[w.id]).map((w) => ({ ...w, zy: ZHUYIN[w.id] }))
  .concat(ZHUYIN_EXTRAS.map((w) => ({ ...w, extra: true })));

// 中文字上面標注音，選到的注音符號用顏色標出來
function rubyHtml(w, S, color) {
  const chars = [...w.zh], syls = syllables(w);
  if (chars.length !== syls.length) return w.zh;
  return chars.map((ch, i) => {
    const rt = S ? syls[i].split(S).join(`<b style="color:${color}">${S}</b>`) : syls[i];
    return `<ruby>${ch}<rt>${rt}</rt></ruby>`;
  }).join('');
}

// 日文：第一個假名（が → か），名字裡的這個假名上色，片假名的字下面附平假名
const kanaFirst = (w) => kanaBase(w.ja[0]);
const kanaHas = (w, S) => [...w.ja].some((c) => kanaBase(c) === S);
function kanaHtml(w, S, color) {
  const word = [...w.ja].map((c) => (S && kanaBase(c) === S ? `<b style="color:${color}">${c}</b>` : c)).join('');
  const read = toHira(w.ja) !== w.ja ? `<span class="kana-read">${toHira(w.ja)}</span>` : '';
  return `<span class="kana-word">${word}</span>${read}`;
}
// が 開頭的字放在 か 這一格：卡片上教「か＋゛＝が」
function dakuten(w, S) {
  const c = toHira(w.ja[0]);
  if (c === S) return '';
  return `<span class="kana-dk">${S} ＋ ${c.normalize('NFD')[1] === '゚' ? '゜' : '゛'} ＝ ${c}</span>`;
}
const KANA_WORDS = ITEMS.filter((w) => w.ja).concat(KANA_EXTRAS.map((w) => ({ ...w, extra: true })));
const kanaRow = (S) => KANA_ROWS.findIndex((r) => r.includes(S));
const firstKanaOf = (w) => toHira(w.ja[0]);

const MODES = {
  abc: {
    title: '🔤 字母探險 <span>ABC</span>',
    symbols: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    words: ITEMS.concat(ABC_EXTRAS),
    first: (w) => w.en[0].toUpperCase(),
    contains: () => false,
    color(L) { return TILE_COLORS[this.symbols.indexOf(L) % TILE_COLORS.length]; },
    tile: (L) => `${L}<small>${L.toLowerCase()}</small>`,
    big: (L) => `<span class="big-upper">${L}</span><span class="big-lower">${L.toLowerCase()}</span>`,
    lang: 'en-US',
    // 卡片：圖、英文（第一個字母上色）、中文
    card: (w, L, color) => `<span class="en"><b style="color:${color}">${w.en[0]}</b>${w.en.slice(1)}</span><span class="zh">${w.zh}</span>`,
    choiceLabel: (w) => `<span class="en">${w.en}</span>`,
    revealLabel(w) { const L = this.first(w); return `<span class="en"><b style="color:${this.color(L)}">${w.en[0]}</b>${w.en.slice(1)}</span>`; },
    sayWord: (w) => [w.en],
    // 家長錄了字母發音（/æ/）就在字母名字後面接著播
    sayLetter: (L, w) => [`${L}.`, ...phonics(L), `${L} is for ${w.en.toLowerCase()}.`],
    sayAll: (L, words) => [`${L}.`, ...phonics(L), words.slice(0, 5).map((w) => w.en).join(', ') + '.'],
    ask: (L) => ({ html: `<span>Which one starts with</span><b id="gameLetter" class="game-letter">${L}</b><span>?</span>`, sub: `哪一個是 ${L} 開頭的？`, say: [`Which one starts with ${L}?`] }),
    right: (L, w) => [pick(['Yes!', 'Great job!', 'You got it!']), `${L} is for ${w.en.toLowerCase()}!`],
    wrong(w) { return [`${w.en}.`, `${w.en} starts with ${this.first(w)}.`]; },
    count: (n) => `${n} 個字`,
  },

  zy: {
    title: '🔤 注音探險 <span>ㄅㄆㄇ</span>',
    symbols: ZY_SYMBOLS,
    words: ZY_WORDS,
    first: firstZy,
    // 「藏在裡面」：不是開頭，但名字裡有這個注音
    contains: (w, S) => w.zy.includes(S),
    color: zyColor,
    tile: (S) => S,
    big: (S) => `<span class="big-upper zy">${S}</span>`,
    lang: 'zh-TW',
    card: (w, S, color) => `<span class="ruby">${rubyHtml(w, S, color)}</span>${w.en ? `<span class="zh">${w.en}</span>` : ''}`,
    choiceLabel: (w) => `<span class="ruby">${rubyHtml(w)}</span>`,
    revealLabel(w) { const S = this.first(w); return `<span class="ruby">${rubyHtml(w, S, this.color(S))}</span>`; },
    sayWord: (w) => [w.zh],
    // zySound：家長錄了這個注音就播錄音，沒有就用同音字
    sayLetter: (S, w) => [zySound(S), zySound(S), `${w.zh}的${w.zh[0]}。`],
    sayAll: (S, words) => [zySound(S), words.slice(0, 5).map((w) => w.zh).join('，') + '。'],
    ask: (S) => ({ html: `<span>哪一個是</span><b id="gameLetter" class="game-letter">${S}</b><span>開頭的？</span>`, sub: '', say: ['哪一個是', zySound(S), '開頭的？'] }),
    right: (S, w) => [pick(['答對了！', '好棒！', '你好厲害！']), zySound(S), `${w.zh}的${w.zh[0]}！`],
    wrong(w) { return [`${w.zh}，是`, zySound(this.first(w)), '開頭的喔。']; },
    count: (n, hidden) => `${n} 個開頭${hidden ? `・${hidden} 個藏在裡面` : ''}`,
  },

  kana: {
    title: '🔤 五十音探險 <span>あいう</span>',
    symbols: KANA_SYMBOLS,
    words: KANA_WORDS,
    first: kanaFirst,
    contains: kanaHas,
    // 同一行（あ行、か行…）同一個顏色
    color: (S) => TILE_COLORS[kanaRow(S) % TILE_COLORS.length],
    tile: (S) => `${S}<small>${toKata(S)}</small>`,
    big: (S) => `<span class="big-upper kana">${S}</span><span class="big-lower kana">${toKata(S)}</span><span class="big-rom">${KANA_ROMAJI[S]}</span>`,
    lang: 'ja-JP',
    card: (w, S, color) => `<span class="ruby">${kanaHtml(w, S, color)}</span>${dakuten(w, S)}<span class="zh">${w.zh}</span>`,
    choiceLabel: (w) => `<span class="ruby">${kanaHtml(w)}</span>`,
    revealLabel(w) { const S = this.first(w); return `<span class="ruby">${kanaHtml(w, S, this.color(S))}</span>`; },
    sayWord: (w) => [w.ja],
    sayLetter: (S, w) => [`${S}。`, `${w.ja}の、${firstKanaOf(w)}。`],
    sayAll: (S, words) => [`${S}。`, words.slice(0, 5).map((w) => w.ja).join('、') + '。'],
    ask: (S) => ({ html: `<b id="gameLetter" class="game-letter">${S}</b><span>ではじまるのは どれ？</span>`, sub: `哪一個是 ${S}（${KANA_ROMAJI[S]}）開頭的？`, say: [`${S}、ではじまるのは、どれ？`] }),
    right: (S, w) => [pick(['せいかい！', 'すごい！', 'やったね！']), `${w.ja}の、${firstKanaOf(w)}！`],
    wrong(w) { return [`${w.ja}。`, `${firstKanaOf(w)}、ではじまるよ。`]; },
    count: (n, hidden) => `${n} 個開頭${hidden ? `・${hidden} 個藏在裡面` : ''}`,
  },
};

// 家長錄音室錄的聲音（recordings.js）
function zySound(S) { return Recs.has(`zy_${S}`) ? { audio: Recs.url(`zy_${S}`) } : `${ZY_SOUND[S]}。`; }
function phonics(L) { return Recs.has(`abc_${L}`) ? [{ audio: Recs.url(`abc_${L}`) }] : []; }

const params = new URLSearchParams(location.search);
if (params.get('from') === 'city') $('backBtn').href = 'city.html';
let modeKey = params.get('mode') || (() => { try { return localStorage.getItem('abc-mode'); } catch { return null; } })() || 'abc';
if (!MODES[modeKey]) modeKey = 'abc';
let M = MODES[modeKey];
const current = { abc: 'A', zy: 'ㄅ', kana: 'あ' };

/* ================= 說話（系統語音） ================= */

let voices = [];
const loadVoices = () => { voices = 'speechSynthesis' in window ? speechSynthesis.getVoices() : []; };
if ('speechSynthesis' in window) { loadVoices(); speechSynthesis.addEventListener('voiceschanged', loadVoices); }
function pickVoice(code) {
  const norm = (s) => s.replace('_', '-').toLowerCase();
  const exact = voices.filter((v) => norm(v.lang) === code.toLowerCase());
  if (exact.length) return exact.find((v) => v.localService) || exact[0];
  const base = code.split('-')[0];
  return voices.find((v) => norm(v.lang).startsWith(base)) || null;
}
function speak(text, lang) {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) return resolve();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.8;
    u.pitch = 1.1;
    const v = pickVoice(lang);
    if (v) u.voice = v;
    let done = false;
    const finish = () => { if (!done) { done = true; resolve(); } };
    u.onend = u.onerror = finish;
    speechSynthesis.speak(u);
    setTimeout(finish, 5000);
  });
}
// 一句接一句唸；按別的東西時前面的會停掉
let speakToken = 0;
async function sayLines(lines) {
  const token = ++speakToken;
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  recPlayer.pause();
  for (const line of lines) {
    if (token !== speakToken) return;
    if (line.audio) await playRec(line.audio); else await speak(line, M.lang);
  }
}

// 點到動物或車子也幫忙收集貼紙（和地圖上的 📒 貼紙冊共用）
function collect(w) {
  if (w.extra) return;
  let data = {};
  try { data = JSON.parse(localStorage.getItem('stickers')) || {}; } catch {}
  const rec = data[w.id] || (data[w.id] = {});
  rec.seen = (rec.seen || 0) + 1;
  try { localStorage.setItem('stickers', JSON.stringify(data)); } catch {}
}

/* ================= 畫面 ================= */

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => arr.map((v) => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
const bounce = (el, cls = 'pop') => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
const artHtml = (w) => (w.emoji ? `<span class="emoji">${w.emoji}</span>` : `<svg viewBox="-50 -50 100 100">${ART[w.id]()}</svg>`);
const startsWith = (S) => M.words.filter((w) => M.first(w) === S);
const hiddenIn = (S) => M.words.filter((w) => M.first(w) !== S && M.contains(w, S)).slice(0, 12);

function buildLetters() {
  const nav = $('letters');
  nav.innerHTML = '';
  nav.classList.toggle('zy', modeKey === 'zy');
  nav.classList.toggle('kana', modeKey === 'kana');
  M.symbols.forEach((L) => {
    const b = document.createElement('button');
    b.className = 'tile';
    b.dataset.letter = L;
    b.style.setProperty('--c', M.color(L));
    b.innerHTML = M.tile(L);
    b.addEventListener('click', () => { if (game.on) stopGame(); setLetter(L, true); });
    nav.append(b);
  });
}

function makeCard(w, L, color, i) {
  const c = document.createElement('button');
  c.className = 'card' + (modeKey === 'abc' ? '' : ` ${modeKey}`);
  c.style.animationDelay = `${i * 0.04}s`;
  c.innerHTML = artHtml(w) + M.card(w, L, color);
  c.addEventListener('click', () => {
    bounce(c, 'tap');
    collect(w);
    sayLines(M.sayWord(w));
  });
  return c;
}

function setLetter(L, talk) {
  current[modeKey] = L;
  // ✏️ 描一描：直接打開同一個字
  $('traceLink').href = `trace.html?mode=${modeKey}&letter=${encodeURIComponent(L)}${params.get('from') === 'city' ? '&from=city' : ''}`;
  const color = M.color(L);
  const words = startsWith(L), hidden = hiddenIn(L);
  document.querySelectorAll('.tile').forEach((t) => t.classList.toggle('on', t.dataset.letter === L));
  document.querySelector(`.tile[data-letter="${L}"]`).scrollIntoView({ block: 'nearest', inline: 'nearest' });
  $('bigLetter').innerHTML = `${M.big(L)}<span class="big-spk">🔊</span><small>${M.count(words.length, hidden.length)}</small>`;
  $('bigLetter').style.setProperty('--c', color);
  bounce($('bigLetter'));

  const box = $('cards');
  box.innerHTML = '';
  let i = 0;
  words.forEach((w) => box.append(makeCard(w, L, color, i++)));
  if (hidden.length) {
    const h = document.createElement('div');
    h.className = 'hidden-head';
    h.innerHTML = `🔍 <b style="color:${color}">${L}</b> 藏在裡面`;
    box.append(h);
    hidden.forEach((w) => box.append(makeCard(w, L, color, i++)));
  }
  box.scrollTo(0, 0);

  if (talk) {
    const pool = words.length ? words : hidden;
    if (pool.length) sayLines(M.sayLetter(L, pick(pool)));
  }
}

// 點大字母：唸字母，再唸前幾個單字
$('bigLetter').addEventListener('click', () => {
  bounce($('bigLetter'));
  const L = current[modeKey];
  const words = startsWith(L);
  sayLines(M.sayAll(L, words.length ? words : hiddenIn(L)));
});

function setMode(key) {
  modeKey = key;
  M = MODES[key];
  try { localStorage.setItem('abc-mode', key); } catch {}
  document.querySelectorAll('.mode-tab').forEach((b) => b.classList.toggle('on', b.dataset.mode === key));
  $('title').innerHTML = M.title;
  document.title = { zy: '注音探險', kana: '五十音探險' }[key] || '字母探險';
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  buildLetters();
  if (game.on) { game.recent = []; nextGame(); } else setLetter(current[key], false);
}
document.querySelectorAll('.mode-tab').forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mode)));

/* ================= 🎯 考考你 ================= */

const game = { on: false, letter: null, answered: false, stars: 0, round: 0, recent: [] };

function askGame() { sayLines(M.ask(game.letter).say); }

function nextGame() {
  // 只出「有東西開頭」的字母／注音
  const usable = M.symbols.filter((L) => startsWith(L).length);
  const letters = usable.filter((L) => !game.recent.includes(L));
  game.letter = pick(letters.length ? letters : usable);
  game.recent = [game.letter, ...game.recent].slice(0, 6);
  game.answered = false;
  game.round++;
  // 一個正確答案＋兩個別的字母開頭的
  const right = pick(startsWith(game.letter));
  const others = shuffle(usable.filter((L) => L !== game.letter)).slice(0, 2).map((L) => pick(startsWith(L)));
  const box = $('choices');
  box.innerHTML = '';
  shuffle([right, ...others]).forEach((w) => {
    const c = document.createElement('button');
    c.className = 'card choice' + (modeKey === 'abc' ? '' : ` ${modeKey}`);
    c.innerHTML = artHtml(w) + M.choiceLabel(w);
    c.addEventListener('click', () => answer(c, w));
    box.append(c);
  });
  const q = M.ask(game.letter);
  $('gameAskText').innerHTML = q.html;
  $('gameLetter').style.background = M.color(game.letter);
  $('gameSub').textContent = q.sub;
  $('gameScore').textContent = `第 ${game.round} 題　⭐ ${game.stars}`;
  $('gameNext').classList.add('hidden');
  askGame();
}

function answer(el, w) {
  if (game.answered) { sayLines(M.sayWord(w)); return; }
  const L = M.first(w);
  el.innerHTML = artHtml(w) + M.revealLabel(w);
  if (L === game.letter) {
    game.answered = true;
    game.stars++;
    el.classList.add('right');
    collect(w);
    confetti();
    $('gameScore').textContent = `第 ${game.round} 題　⭐ ${game.stars}`;
    $('gameNext').classList.remove('hidden');
    sayLines(M.right(L, w));
  } else {
    bounce(el, 'nope');
    sayLines(M.wrong(w));
  }
}

function startGame() {
  game.on = true;
  game.stars = 0;
  game.round = 0;
  $('explore').classList.add('hidden');
  $('game').classList.remove('hidden');
  $('gameBtn').classList.add('on');
  $('gameBtn').textContent = '🔤 回去探險';
  document.querySelectorAll('.tile').forEach((t) => t.classList.remove('on'));
  nextGame();
}
function stopGame() {
  game.on = false;
  $('game').classList.add('hidden');
  $('explore').classList.remove('hidden');
  $('gameBtn').classList.remove('on');
  $('gameBtn').textContent = '🎯 考考你';
  setLetter(current[modeKey], false);
}
$('gameBtn').addEventListener('click', () => (game.on ? stopGame() : startGame()));
$('gameNext').addEventListener('click', nextGame);
$('gameAsk').addEventListener('click', askGame);

function confetti() {
  const box = $('confetti');
  box.innerHTML = '';
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('i');
    p.style.left = Math.random() * 100 + 'vw';
    p.style.background = TILE_COLORS[i % TILE_COLORS.length];
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
