// 經典故事書：書架 + 翻頁閱讀器
// 書的資料放在 books/ 資料夾：books/index.json 列出所有書，每本書一個 JSON 檔。

const $ = (sel) => document.querySelector(sel);
const shelfView = $('#shelf');
const readerView = $('#reader');
const bookEl = $('#book');
const dotsEl = $('#dots');
const btnPrev = $('#btn-prev');
const btnNext = $('#btn-next');
const btnSpeak = $('#btn-speak');
const btnZhuyin = $('#btn-zhuyin');
const btnAuto = $('#btn-auto');

const cache = {};          // 已載入的書
let book = null;           // 目前這本書
let pages = [];            // 封面 + 內頁 + 結尾
let index = 0;             // 目前頁碼
let turning = false;
let speakOn = load('speakOn', false);
let zhuyinOn = load('zhuyinOn', true);

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem('storybook.' + key)) ?? fallback; }
  catch { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem('storybook.' + key, JSON.stringify(value)); } catch {}
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(url + ' ' + res.status);
  return res.json();
}

// ---------- 書架（依地區分類） ----------
let shelfData = null;
let region = load('region', 'all');

async function renderShelf() {
  shelfData ??= await fetchJSON('books/index.json');
  const { regions, books } = shelfData;
  if (region !== 'all' && !regions.some((r) => r.id === region)) region = 'all';

  // 地區分頁
  const tabs = $('#region-tabs');
  tabs.innerHTML = '';
  for (const r of [{ id: 'all', name: '全部', icon: '📚' }, ...regions]) {
    const count = r.id === 'all' ? books.length : books.filter((b) => b.region === r.id).length;
    const btn = document.createElement('button');
    btn.className = 'region-tab';
    btn.setAttribute('aria-pressed', r.id === region);
    btn.innerHTML = `<span class="tab-icon">${r.icon}</span>${r.name}<span class="tab-count">${count}</span>`;
    btn.onclick = () => { region = r.id; save('region', region); renderShelf(); };
    tabs.appendChild(btn);
  }
  tabs.querySelector('[aria-pressed="true"]').scrollIntoView({ inline: 'center', block: 'nearest' });

  // 「全部」依地區分段顯示；單一地區只顯示該地區
  const sections = $('#book-sections');
  sections.innerHTML = '';
  const shown = region === 'all' ? regions : regions.filter((r) => r.id === region);
  for (const r of shown) {
    const list = books.filter((b) => b.region === r.id);
    if (region === 'all' && !list.length) continue;
    const sec = document.createElement('section');
    sec.className = 'region-section';
    sec.innerHTML = `<h2 class="region-title">${r.icon} ${r.name}的故事</h2>`;
    if (list.length) sec.appendChild(buildBookList(list));
    else sec.insertAdjacentHTML('beforeend', '<p class="empty">故事準備中，敬請期待！📖</p>');
    sections.appendChild(sec);
  }
}

function buildBookList(books) {
  const progress = load('progress', {});
  const ul = document.createElement('ul');
  ul.className = 'book-list';
  const medals = load('medals', {});
  for (const b of books) {
    const li = document.createElement('li');
    const read = medals[b.id] ? '<span class="badge">🏅 全答對</span>'
      : progress[b.id] === 'done' ? '<span class="badge">⭐ 讀完了</span>' : '';
    const cover = b.coverImage ? `<img src="${b.coverImage}" alt="">` : b.cover;
    li.innerHTML = `
      <button class="book-card">
        <div class="book-cover" style="background:${b.color}">${cover}${read}</div>
        <span class="book-name">${b.title}</span>
      </button>`;
    li.firstElementChild.addEventListener('click', () => { location.hash = '#/book/' + b.id; });
    ul.appendChild(li);
  }
  return ul;
}

// ---------- 閱讀器 ----------
async function openBook(id) {
  book = cache[id] ??= await fetchJSON(`books/${id}.json`);
  // 故事後面接小問答和「聊一聊」；睡前模式不出題，讓孩子安靜聽完
  const extra = night() ? [] : [
    ...(book.quiz ?? []).map((q, n) => ({ type: 'quiz', q, n })),
    ...(book.talk?.length ? [{ type: 'talk' }] : []),
  ];
  pages = [{ type: 'cover' }, ...book.pages, ...extra, { type: 'end' }];
  quiz = { answered: {}, missed: new Set(), wrong: new Set() };
  quizVoice = false;
  bookCounted = false;
  $('#book-title').textContent = book.title;
  document.title = book.title + '｜經典故事書';
  dotsEl.innerHTML = pages.map(() => '<span></span>').join('');
  index = 0;
  bookEl.innerHTML = '';
  bookEl.appendChild(buildPage(index));
  updateNav();
}

function buildPage(i) {
  const p = pages[i];
  const el = document.createElement('article');
  el.className = 'page';
  el.dataset.index = i;
  el.style.background = p.bg || (p.type ? book.color : '');

  if (p.type === 'cover') {
    el.classList.add('cover');
    const art = book.coverImage ? illustration(el, book.coverImage) : `<span class="emoji">${book.cover}</span>`;
    el.innerHTML = `
      <div class="scene">${art}</div>
      <div class="text"><h3>${book.title}</h3><div class="hint">點右邊翻頁，或按上面的 ▶ 自動播放</div></div>`;
  } else if (p.type === 'quiz') {
    buildQuiz(el, p);
  } else if (p.type === 'talk') {
    el.classList.add('talk');
    el.innerHTML = `
      <div class="scene"><span class="emoji">💬</span></div>
      <div class="text">
        <h3>和爸爸媽媽聊一聊</h3>
        <ol>${book.talk.map((t) => `<li>${renderText(t.text, t.zhuyin)}</li>`).join('')}</ol>
      </div>`;
  } else if (p.type === 'end') {
    el.classList.add('end');
    const total = book.quiz?.length && !night() ? book.quiz.length : 0;
    const right = Object.values(quiz.answered).length === total && total
      ? total - quiz.missed.size : -1;
    const score = right < 0 ? ''
      : right === total ? `<div class="score">🏅 小問答全部答對！</div>`
      : `<div class="score">${'⭐'.repeat(right)} 答對 ${right} / ${total} 題</div>`;
    el.innerHTML = `
      <div class="scene"><span class="emoji">${night() ? '🌙' : '🎉'}</span></div>
      <div class="text">
        <div>${night() ? '故事說完了，晚安！' : '故事說完了！'}</div>
        ${score}
        <div class="end-actions">
          <button class="big-btn" data-act="again">🔁 再讀一次</button>
          <button class="big-btn alt" data-act="home">📚 回書架</button>
        </div>
      </div>`;
    el.querySelector('[data-act="again"]').onclick = (e) => { e.stopPropagation(); goTo(0); };
    el.querySelector('[data-act="home"]').onclick = (e) => { e.stopPropagation(); location.hash = ''; };
  } else {
    const art = p.image ? illustration(el, p.image) : `<span class="emoji">${p.scene || ''}</span>`;
    el.innerHTML = `
      <div class="scene">${art}</div>
      <div class="text"><p>${renderText(p.text, p.zhuyin)}</p></div>
      <span class="page-no">${i} / ${book.pages.length}</span>`;
  }
  el.querySelectorAll('.text p, .text li').forEach((t) => t.classList.toggle('with-zy', !!t.querySelector('.zy')));
  return el;
}

// 插畫鋪滿整頁，文字疊在上方。
// SVG 插畫的背景有往畫面外多畫（見 tools/scenes），用 fill 讓它依螢幕比例露出更多背景、不裁切角色；
// 一般圖片（webp、png）就用 cover 裁切，靠下對齊。
function illustration(page, src) {
  page.classList.add('full');
  return `<img src="${src}" alt=""${src.endsWith('.svg') ? ' class="bleed"' : ''}>`;
}

// ---------- 小問答：每本書 book.quiz，第一個選項是正確答案（畫面上會打亂順序） ----------
let quiz = { answered: {}, missed: new Set(), wrong: new Set() };
let quizVoice = false; // 從自動播放進到問答時，題目繼續唸出來

function quizOptions(p) {
  // 用書名和題號當亂數種子，同一題每次的順序都一樣
  let seed = [...book.id + p.n].reduce((h, c) => (h * 31 + c.codePointAt(0)) >>> 0, 7);
  const rand = () => ((seed = (seed * 1103515245 + 12345) >>> 0) / 2 ** 32);
  const opts = p.q.options.map((o, k) => ({ ...o, ok: k === 0 }));
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  return opts;
}

function buildQuiz(el, p) {
  el.classList.add('quiz');
  const state = quiz.answered[p.n];
  el.innerHTML = `
    <div class="quiz-head">
      <span>🤔 小問答 ${p.n + 1} / ${book.quiz.length}</span>
      <button class="icon-btn listen" aria-label="唸題目">🔊</button>
    </div>
    <div class="text quiz-q"><p>${renderText(p.q.text, p.q.zhuyin)}</p></div>
    <div class="options">${quizOptions(p).map((o) => `
      <button class="option" data-ok="${o.ok}">
        ${o.icon ? `<span class="opt-icon">${o.icon}</span>` : ''}
        <span class="opt-text">${renderText(o.text, o.zhuyin)}</span>
      </button>`).join('')}
    </div>`;
  el.querySelector('.listen').onclick = (e) => { e.stopPropagation(); speakPage(true); };
  // 翻回已經答過的題目時，保留答對、答錯的記號
  el.querySelectorAll('.option').forEach((btn, k) => {
    btn.dataset.key = p.n + ':' + k;
    if (state && btn.dataset.ok === 'true') btn.classList.add('right');
    if (quiz.wrong.has(btn.dataset.key)) btn.classList.add('wrong');
    btn.disabled = !!state || quiz.wrong.has(btn.dataset.key);
    btn.onclick = (e) => { e.stopPropagation(); answer(btn, p); };
  });
}

function answer(btn, p) {
  if (btn.disabled || turning) return;
  const page = btn.closest('.page');
  if (btn.dataset.ok === 'true') {
    btn.classList.add('right');
    page.querySelectorAll('.option').forEach((b) => { b.disabled = true; });
    quiz.answered[p.n] = 'right';
    chime(true);
    const token = say('答對了！');
    if (Object.keys(quiz.answered).length === book.quiz.length && !quiz.missed.size) {
      const medals = load('medals', {});
      medals[book.id] = true;
      save('medals', medals);
    }
    setTimeout(() => { if (token === speechToken) goTo(index + 1); }, 1800);
  } else {
    btn.classList.add('wrong');
    btn.disabled = true;
    quiz.missed.add(p.n);
    quiz.wrong.add(btn.dataset.key);
    chime(false);
    say('再想想看喔');
  }
}

// 答對、答錯的提示音（不需要音效檔）
let audioCtx = null;
function chime(good) {
  try {
    audioCtx ??= new (window.AudioContext || window.webkitAudioContext)();
    const notes = good ? [523, 659, 784] : [330, 247];
    notes.forEach((f, k) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      const t = audioCtx.currentTime + k * 0.12;
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      o.connect(g).connect(audioCtx.destination);
      o.start(t);
      o.stop(t + 0.4);
    });
  } catch {}
}

// ---------- 故事文字：每個字包成 <span class="ch" data-i>，朗讀時用來標示唸到哪裡 ----------
// 注音直排在字的右邊，資料由 tools/add-zhuyin.mjs 產生
const HAN = /\p{Script=Han}/u;

function renderText(text, zhuyin) {
  const chars = [...text];
  const marks = zhuyin ? zhuyin.split(' ') : [];
  // 文字改過但注音沒重新產生時，對不上就不顯示注音
  const useZy = zhuyinOn && marks.length === chars.filter((c) => HAN.test(c)).length;
  let pos = 0; // 在朗讀字串裡的位置（UTF-16），對應 boundary 事件的 charIndex
  let k = 0;
  return chars.map((c) => {
    const inner = useZy && HAN.test(c) ? zhuyinChar(c, marks[k++]) : c;
    const html = `<span class="ch" data-i="${pos}">${inner}</span>`;
    pos += c.length;
    return html;
  }).join('');
}

function zhuyinChar(ch, mark) {
  const light = mark.startsWith('˙');
  const tone = /[ˊˇˋ]$/.exec(mark)?.[0] || '';
  const syms = [...mark.replace(/[˙ˊˇˋ]/g, '')];
  return `<span class="zy"><span class="hz">${ch}</span><span class="bp">` +
    (light ? '<span class="lt">˙</span>' : '') +
    syms.map((s) => s === 'ㄧ' ? '<span class="i">ㄧ</span>' : `<span>${s}</span>`).join('') +
    (tone ? `<span class="tn">${tone}</span>` : '') +
    '</span></span>';
}

function setZhuyin(on) {
  zhuyinOn = on;
  save('zhuyinOn', on);
  btnZhuyin.setAttribute('aria-pressed', on);
}
btnZhuyin.onclick = () => {
  setZhuyin(!zhuyinOn);
  if (!book || turning) return;
  bookEl.replaceChild(buildPage(index), bookEl.lastElementChild);
};
setZhuyin(zhuyinOn);

function goTo(next) {
  if (turning || next < 0 || next >= pages.length || next === index) return;
  turning = true;
  const forward = next > index;
  const oldPage = bookEl.lastElementChild;
  const newPage = buildPage(next);

  if (forward) {
    // 新頁墊在下面，舊頁翻走
    bookEl.insertBefore(newPage, oldPage);
    oldPage.classList.add('turn-out-next');
    afterAnimation(oldPage, () => { oldPage.remove(); done(); });
  } else {
    // 新頁從左邊翻回來，蓋在舊頁上
    bookEl.appendChild(newPage);
    newPage.classList.add('turn-in-prev');
    afterAnimation(newPage, () => {
      newPage.classList.remove('turn-in-prev');
      oldPage.remove();
      done();
    });
  }
  index = next;
  updateNav();
  if (index === pages.length - 1) { markDone(); countBedtimeBook(); }

  function done() { turning = false; }
}

// 分頁切到背景時 animationend 可能不會觸發，翻頁就會卡住，所以加計時器保底
function afterAnimation(el, fn) {
  let called = false;
  const once = () => { if (!called) { called = true; fn(); } };
  el.addEventListener('animationend', once, { once: true });
  setTimeout(once, 900);
}

function updateNav() {
  btnPrev.disabled = index === 0;
  btnNext.disabled = index === pages.length - 1;
  [...dotsEl.children].forEach((d, i) => d.classList.toggle('on', i === index));
  if (pages[index + 1]?.image) new Image().src = pages[index + 1].image; // 先載入下一頁的插圖，翻頁時才不會閃
  speakPage();
}

function markDone() {
  const progress = load('progress', {});
  progress[book.id] = 'done';
  save('progress', progress);
}

// ---------- 朗讀（瀏覽器內建語音）＋ 唸到哪裡就標到哪裡 ----------
const hasSpeech = 'speechSynthesis' in window;
let followTimer = null;
let speechToken = 0; // 翻頁時舊的語音被取消也會送 end 事件，用編號忽略舊的
let currentUtterance = null; // Chrome 的語音物件沒被參照時可能被回收，end 事件就不會來

// 自動播放：唸完一頁就翻下一頁，直到故事結束
let autoPlay = false;
let autoTimer = null;

// force：按問答頁的 🔊，不管朗讀有沒有開都唸
function speakPage(force = false) {
  const token = ++speechToken;
  clearTimeout(autoTimer);
  if (hasSpeech) speechSynthesis.cancel();
  stopFollow();
  if (!book) return;
  const p = pages[index];
  // 自動播放到小問答就停下來，讓孩子自己作答，題目還是繼續唸
  if (autoPlay && p.type === 'quiz') { setAutoPlay(false); quizVoice = true; }
  const speaking = force || speakOn || autoPlay || (quizVoice && (p.type === 'quiz' || p.type === 'talk'));
  if (autoPlay && index === pages.length - 1) setAutoPlay(false); // 到結尾頁就停
  if (!speaking) return;

  const text = pageSpeech(p);
  // 沒有語音功能時，自動播放就依文字長度停留後翻頁
  if (!hasSpeech) { scheduleNext(token, [...text].length * 300 + 1500); return; }

  const u = utterance(text);
  if (!p.type) followSpeech(u, index);
  u.addEventListener('end', () => scheduleNext(token, night() ? 2000 : 1200));
  u.addEventListener('error', (e) => {
    if (e.error !== 'interrupted' && e.error !== 'canceled') scheduleNext(token, [...text].length * 300);
  });
  // 保底：萬一瀏覽器沒送 end 事件，也不會停在這一頁
  if (autoPlay) autoTimer = setTimeout(() => scheduleNext(token, 0), [...text].length * 600 + 6000);
  speechSynthesis.speak(u);
}

function pageSpeech(p) {
  if (p.type === 'cover') return book.title;
  if (p.type === 'end') return night() ? '故事說完了，晚安。' : '故事說完了！';
  if (p.type === 'talk') return '和爸爸媽媽聊一聊。' + book.talk.map((t) => t.text).join('　');
  if (p.type === 'quiz') {
    const opts = quizOptions(p).map((o) => o.text);
    return `${p.q.text}　${opts.slice(0, -1).join('、')}，還是${opts.at(-1)}？`;
  }
  return p.text;
}

function utterance(text) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'zh-TW';
  u.rate = night() ? 0.72 : 0.85; // 睡前模式唸慢一點
  u.pitch = night() ? 0.9 : 1;
  currentUtterance = u;
  return u;
}

// 唸一句提示（答對了、再想想看），回傳編號讓呼叫的人知道之後有沒有翻頁
function say(text) {
  const token = ++speechToken;
  clearTimeout(autoTimer);
  stopFollow();
  if (hasSpeech) { speechSynthesis.cancel(); speechSynthesis.speak(utterance(text)); }
  return token;
}

function scheduleNext(token, ms) {
  if (!autoPlay || token !== speechToken) return;
  clearTimeout(autoTimer);
  autoTimer = setTimeout(function next() {
    if (!autoPlay || token !== speechToken) return;
    if (turning) { autoTimer = setTimeout(next, 300); return; }
    goTo(index + 1);
  }, ms);
}

function setAutoPlay(on) {
  autoPlay = on;
  if (!on) clearTimeout(autoTimer);
  btnAuto.setAttribute('aria-pressed', on);
  btnAuto.setAttribute('aria-label', on ? '停止自動播放' : '自動播放');
  btnAuto.textContent = on ? '⏸' : '▶';
}
btnAuto.onclick = () => {
  if (autoPlay) {
    setAutoPlay(false);
    if (!speakOn) speakPage(); // 沒開朗讀的話，順便把正在唸的停掉
    return;
  }
  setAutoPlay(true);
  if (index === pages.length - 1) goTo(0); // 在最後一頁按，就從頭播
  else speakPage();
};

// 有些語音（例如 Windows 的 Microsoft 語音、Edge）會送 boundary 事件告訴我們唸到第幾個字；
// 沒有的話（例如 Chrome 的 Google 語音）就依每個字大約的時間往前推。
function followSpeech(u, pageIndex) {
  const token = speechToken;
  const stale = () => token !== speechToken;
  let synced = false;
  u.onstart = () => {
    if (stale()) return;
    followTimer = setTimeout(() => { if (!synced) estimate(pageIndex, 0); }, 400);
  };
  u.onboundary = (e) => {
    if (stale() || (e.name && e.name !== 'word')) return;
    if (!synced) { synced = true; stopFollow(); }
    highlight(pageIndex, e.charIndex, e.charLength || 1);
  };
  u.onend = () => {
    if (stale()) return;
    stopFollow();
    highlight(pageIndex, Infinity, 0); // 全部標成唸過
    followTimer = setTimeout(() => clearHighlight(pageIndex), 1200);
  };
}

function estimate(pageIndex, n) {
  const spans = currentSpans(pageIndex);
  if (n >= spans.length) return;
  const ch = spans[n].textContent[0];
  highlight(pageIndex, Number(spans[n].dataset.i), 1);
  const ms = /[，。！？、；：]/.test(ch) ? 380 : /[「」『』（）—…]/.test(ch) ? 0 : 290;
  followTimer = setTimeout(() => estimate(pageIndex, n + 1), ms);
}

function currentSpans(pageIndex) {
  const page = bookEl.querySelector(`.page[data-index="${pageIndex}"]`);
  return page ? [...page.querySelectorAll('.ch')] : [];
}

function highlight(pageIndex, start, len) {
  for (const s of currentSpans(pageIndex)) {
    const i = Number(s.dataset.i);
    s.classList.toggle('done', i < start);
    s.classList.toggle('now', i >= start && i < start + len);
  }
}

function clearHighlight(pageIndex) {
  for (const s of currentSpans(pageIndex)) s.classList.remove('done', 'now');
}

function stopFollow() {
  clearTimeout(followTimer);
  followTimer = null;
  bookEl.querySelectorAll('.ch.now, .ch.done').forEach((s) => s.classList.remove('now', 'done'));
}
function setSpeak(on) {
  speakOn = on;
  save('speakOn', on);
  btnSpeak.setAttribute('aria-pressed', on);
  btnSpeak.textContent = on ? '🔊' : '🔈';
}
btnSpeak.onclick = () => { setSpeak(!speakOn); speakPage(); };
if (!hasSpeech) btnSpeak.hidden = true;
setSpeak(speakOn);

// ---------- 操作：按鈕、點左右半邊、滑動、鍵盤 ----------
btnPrev.onclick = () => goTo(index - 1);
btnNext.onclick = () => goTo(index + 1);
$('#btn-home').onclick = () => { location.hash = ''; };

bookEl.addEventListener('click', (e) => {
  if (e.target.closest('button')) return;
  const rect = bookEl.getBoundingClientRect();
  goTo(e.clientX - rect.left < rect.width / 3 ? index - 1 : index + 1);
});

let touchX = null;
bookEl.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
bookEl.addEventListener('touchend', (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  touchX = null;
  if (Math.abs(dx) > 50) {
    e.preventDefault(); // 滑動時不要再觸發 click
    goTo(dx < 0 ? index + 1 : index - 1);
  }
});

document.addEventListener('keydown', (e) => {
  if (readerView.hidden) return;
  if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goTo(index + 1); }
  if (e.key === 'ArrowLeft') goTo(index - 1);
  if (e.key === 'Escape') location.hash = '';
});

// ---------- 睡前模式：畫面變暗、唸慢一點、不出問答，讀完設定的本數就說晚安 ----------
const btnNight = $('#btn-night');
const nightPanel = $('#night-panel');
const goodnight = $('#goodnight');
let bedtime = load('bedtime', null); // { limit: 幾本, count: 讀完幾本, since: 開始時間 }
let bookCounted = false;
if (bedtime && Date.now() - bedtime.since > 12 * 3600e3) bedtime = null; // 隔天自動關掉

function night() { return !!bedtime; }
function bedtimeOver() { return night() && bedtime.count >= bedtime.limit; }

function setBedtime(limit) {
  bedtime = limit ? { limit, count: 0, since: Date.now() } : null;
  save('bedtime', bedtime);
  applyBedtime();
}

function applyBedtime() {
  document.body.classList.toggle('night', night());
  $('meta[name="theme-color"]').content = night() ? '#1b1a2b' : '#fff4e0';
  btnNight.setAttribute('aria-pressed', night());
  btnNight.textContent = night()
    ? `🌙 睡前模式・還可以讀 ${Math.max(bedtime.limit - bedtime.count, 0)} 本`
    : '🌙 睡前模式';
  goodnight.hidden = !bedtimeOver();
}

function countBedtimeBook() {
  if (!night() || bookCounted) return;
  bookCounted = true;
  bedtime.count++;
  save('bedtime', bedtime);
  // 等結尾頁的「晚安」唸完，再蓋上晚安畫面
  if (bedtimeOver()) setTimeout(() => { setAutoPlay(false); applyBedtime(); }, 3500);
  else applyBedtime();
}

btnNight.onclick = () => { nightPanel.hidden = !nightPanel.hidden; };
nightPanel.querySelectorAll('[data-limit]').forEach((b) => {
  b.onclick = () => { setBedtime(Number(b.dataset.limit)); nightPanel.hidden = true; };
});

// 晚安畫面要爸媽長按 3 秒才能解除，避免孩子自己點掉
const btnUnlock = $('#btn-unlock');
let unlockTimer = null;
btnUnlock.addEventListener('pointerdown', () => {
  btnUnlock.classList.add('holding');
  unlockTimer = setTimeout(() => {
    btnUnlock.classList.remove('holding');
    setBedtime(0);
    location.hash = '';
  }, 3000);
});
for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) {
  btnUnlock.addEventListener(ev, () => { clearTimeout(unlockTimer); btnUnlock.classList.remove('holding'); });
}
btnUnlock.addEventListener('contextmenu', (e) => e.preventDefault());
applyBedtime();

// ---------- 加到主畫面（PWA）：可以像 App 一樣開啟，沒有網路也能讀 ----------
const installTip = $('#install-tip');
const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
let installEvent = null;

function showInstallTip() {
  if (standalone || load('installTipClosed', false)) return;
  let msg;
  if (installEvent) msg = '📲 把故事書安裝到桌面，沒有網路也能讀 <button data-act="install">安裝</button>';
  else if (isIOS) msg = '📲 按 Safari 的「分享」按鈕，選「加入主畫面」，就能像 App 一樣打開，沒有網路也能讀';
  else return;
  installTip.innerHTML = `<span>${msg}</span><button data-act="close" aria-label="關閉">✕</button>`;
  installTip.hidden = false;
}
installTip.addEventListener('click', async (e) => {
  const act = e.target.closest('button')?.dataset.act;
  if (act === 'install' && installEvent) { installEvent.prompt(); await installEvent.userChoice; installEvent = null; }
  if (act) { installTip.hidden = true; save('installTipClosed', true); }
});
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); installEvent = e; showInstallTip(); });
showInstallTip();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
  // 每次開啟都請 service worker 把還沒存的書下載起來（新增的書也能離線讀）
  navigator.serviceWorker.ready.then((reg) => reg.active?.postMessage('cache-books'));
}

// ---------- 路由：#/book/<id> 打開書，其他顯示書架 ----------
async function route() {
  const m = location.hash.match(/^#\/book\/([\w-]+)/);
  if (m) {
    shelfView.hidden = true;
    readerView.hidden = false;
    try { await openBook(m[1]); }
    catch { location.hash = ''; }
  } else {
    setAutoPlay(false);
    speechToken++;
    if (hasSpeech) speechSynthesis.cancel();
    readerView.hidden = true;
    shelfView.hidden = false;
    document.title = '經典故事書';
    renderShelf();
  }
}
window.addEventListener('hashchange', route);
route();
