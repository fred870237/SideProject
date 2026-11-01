'use strict';
/* ========== 大人模式（JLPT N5）==========
   這個檔案只定義函式，執行時才用到 app.js 的共用工具（h、state、speak…），
   所以要在 app.js 之前載入，讓 app.js 啟動時就找得到這裡的頁面。 */

/* ---------- 羅馬拼音 → 假名 ---------- */
const ROMA = (() => {
  const m = { a: 'あ', i: 'い', u: 'う', e: 'え', o: 'お' };
  const V = 'aiueo';
  const rows = {
    k: 'かきくけこ', s: 'さしすせそ', t: 'たちつてと', n: 'なにぬねの', h: 'はひふへほ', m: 'まみむめも',
    r: 'らりるれろ', g: 'がぎぐげご', z: 'ざじずぜぞ', d: 'だぢづでど', b: 'ばびぶべぼ', p: 'ぱぴぷぺぽ',
  };
  for (const [c, s] of Object.entries(rows)) [...s].forEach((k, i) => { m[c + V[i]] = k; });
  Object.assign(m, { ya: 'や', yu: 'ゆ', yo: 'よ', wa: 'わ', wo: 'を', shi: 'し', chi: 'ち', tsu: 'つ', fu: 'ふ', ji: 'じ', vu: 'ゔ' });
  [...V].forEach((v, i) => { m['x' + v] = m['l' + v] = 'ぁぃぅぇぉ'[i]; });
  Object.assign(m, { xya: 'ゃ', xyu: 'ゅ', xyo: 'ょ', lya: 'ゃ', lyu: 'ゅ', lyo: 'ょ', xtu: 'っ', ltu: 'っ', xtsu: 'っ', ltsu: 'っ' });
  const yoon = {
    ky: 'き', sh: 'し', sy: 'し', ch: 'ち', ty: 'ち', cy: 'ち', ny: 'に', hy: 'ひ', my: 'み', ry: 'り',
    gy: 'ぎ', j: 'じ', jy: 'じ', zy: 'じ', by: 'び', py: 'ぴ', dy: 'ぢ',
  };
  for (const [c, k] of Object.entries(yoon)) { m[c + 'a'] = k + 'ゃ'; m[c + 'u'] = k + 'ゅ'; m[c + 'o'] = k + 'ょ'; }
  Object.assign(m, {
    she: 'しぇ', che: 'ちぇ', je: 'じぇ', fa: 'ふぁ', fi: 'ふぃ', fe: 'ふぇ', fo: 'ふぉ', thi: 'てぃ', dhi: 'でぃ',
    wi: 'うぃ', we: 'うぇ', ye: 'いぇ', va: 'ゔぁ', vi: 'ゔぃ', ve: 'ゔぇ', vo: 'ゔぉ',
  });
  return m;
})();

// final=true 時把結尾的 n 當成ん（送出答案時用）；輸入中則先保留 n 等下一個字母
function toKana(input, final = false) {
  const s = input.toLowerCase();
  let out = '', i = 0;
  while (i < s.length) {
    const c = s[i], n = s[i + 1];
    if (c === '-') { out += 'ー'; i++; continue; }
    if (c === 'n') {
      if (n === undefined) { out += final ? 'ん' : 'n'; i++; continue; }
      if (n === "'") { out += 'ん'; i += 2; continue; }
      if (!'aiueoy'.includes(n)) {
        out += 'ん'; i++;
        if (n === 'n' && !'aiueoy'.includes(s[i + 1] || '_')) i++; // nn → ん
        continue;
      }
    }
    if (c === 'm' && (n === 'b' || n === 'p')) { out += 'ん'; i++; continue; } // 赫本式 shimbun
    if (c === n && /[bcdfghjkmpqrstvwxyz]/.test(c)) { out += 'っ'; i++; continue; }
    if (c === 't' && n === 'c' && s[i + 2] === 'h') { out += 'っ'; i++; continue; }
    let hit = false;
    for (const len of [4, 3, 2, 1]) {
      const kana = ROMA[s.slice(i, i + len)];
      if (kana) { out += kana; i += len; hit = true; break; }
    }
    if (!hit) { out += s[i]; i++; }
  }
  return out;
}

const VOWEL_OF = (() => {
  const m = { ゃ: 'あ', ゅ: 'う', ょ: 'お', ぁ: 'あ', ぃ: 'い', ぅ: 'う', ぇ: 'え', ぉ: 'お' };
  [...KANA.basic, ...KANA.dakuten].flat().filter(Boolean).forEach(k => {
    const v = 'aiueo'.indexOf(k.r.at(-1));
    if (v >= 0) m[k.hira] = 'あいうえお'[v];
  });
  return m;
})();
const toHira = s => s.replace(/[ァ-ヶ]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60));

// 比對讀音前先統一：片假名→平假名、長音ー→母音、ぢづを 視同 じずお
function normKana(s) {
  const t = toHira(s.replace(/[\s・]/g, ''));
  return t.replace(/ー/g, (_, i) => VOWEL_OF[t[i - 1]] || '')
    .replace(/ぢ/g, 'じ').replace(/づ/g, 'ず').replace(/を/g, 'お');
}
function readingMatches(typed, answer) {
  const u = normKana(toKana(typed.trim(), true));
  return u === normKana(answer) || u === normKana(answer.replace(/は$/, 'わ'));
}

// 讀音輸入框：可以打羅馬拼音（即時轉成假名）或直接用日文輸入法
function readingInput(onSubmit, placeholder = '輸入讀音（羅馬拼音或假名）') {
  const input = h('input', {
    class: 'reading-input', type: 'text', placeholder, autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', lang: 'ja',
  });
  const preview = h('p', { class: 'reading-preview', lang: 'ja' }, '　');
  input.addEventListener('input', () => { preview.textContent = toKana(input.value) || '　'; });
  input.addEventListener('keydown', e => {
    if (e.key !== 'Enter' || e.isComposing) return;
    e.preventDefault(); e.stopPropagation();
    if (input.value.trim()) onSubmit(input.value);
  });
  return { input, preview, el: h('div', { class: 'reading-box' }, input, preview) };
}

/* ---------- 間隔重複（簡化版 SM-2）---------- */
const DECKS = {
  vocab: { name: 'N5 單字', items: N5_VOCAB },
  kanji: { name: 'N5 漢字', items: N5_KANJI },
};
const GRADES = [
  { label: '忘了', cls: 'again' }, { label: '困難', cls: 'hard' },
  { label: '記得', cls: 'good' }, { label: '簡單', cls: 'easy' },
];

function addDays(n) { const d = new Date(); d.setDate(d.getDate() + n); return dayStr(d); }

// i=間隔天數、e=難易係數、r=複習次數、l=遺忘次數；g: 0 忘了 1 困難 2 記得 3 簡單
function schedule(s, g) {
  const c = s ? { ...s } : { i: 0, e: 2.5, r: 0, l: 0 };
  c.r++;
  if (g === 0) { if (c.i) c.l++; c.e = Math.max(1.3, c.e - 0.2); c.i = 0; }
  else if (!c.i) c.i = [0, 1, 2, 4][g];
  else if (g === 1) { c.i = Math.max(c.i + 1, Math.round(c.i * 1.2)); c.e = Math.max(1.3, c.e - 0.15); }
  else if (g === 2) c.i = Math.max(c.i + 1, Math.round(c.i * c.e));
  else { c.i = Math.max(c.i + 2, Math.round(c.i * c.e * 1.3)); c.e += 0.15; }
  c.due = addDays(c.i);
  return c;
}
const intervalText = i => (!i ? '馬上' : i < 30 ? `${i} 天` : i < 365 ? `${Math.round(i / 30)} 個月` : `${(i / 365).toFixed(1)} 年`);

function srsDay() {
  if (state.srsDay.date !== dayStr()) state.srsDay = { date: dayStr(), vocab: 0, kanji: 0 };
  return state.srsDay;
}
const srsStatus = key => { const s = state.srs[key]; return !s ? 'new' : s.i >= 21 ? 'mature' : 'learning'; };
const STATUS_LABEL = { new: '未學', learning: '學習中', mature: '熟練' };
const isDue = key => { const s = state.srs[key]; return !!s && s.due <= dayStr(); };
const dueItems = deck => DECKS[deck].items.filter(it => isDue(it.key));
const newLeft = deck => Math.max(0, state.newPerDay - srsDay()[deck]);
const newItems = deck => DECKS[deck].items.filter(it => !state.srs[it.key]).slice(0, newLeft(deck));
const kanjiExamples = (c, n = 4) => N5_VOCAB.filter(w => w.w.includes(c)).slice(0, n);

/* ---------- 共用小元件 ---------- */
function modeSwitch() {
  return h('div', { class: 'mode-switch' }, h('div', { class: 'seg' }, [['kids', '🧒 兒童模式'], ['adult', '🧑 大人模式']].map(([m, label]) =>
    h('a', {
      href: '#/', class: state.mode === m ? 'on' : null,
      onclick: e => { e.preventDefault(); state.mode = m; save(); render(); },
    }, label))));
}

function themeSetting() {
  return h('div', { class: 'setting' },
    h('span', {}, '外觀'),
    h('div', { class: 'seg' }, [['auto', '跟隨系統'], ['light', '☀️ 淺色'], ['dark', '🌙 深色']].map(([t, label]) => h('a', {
      href: location.hash || '#/', class: state.theme === t ? 'on' : null,
      onclick: e => { e.preventDefault(); state.theme = t; save(); render(); },
    }, label))));
}

function exampleChip(word, sub, zh) {
  return h('button', { class: 'ex-chip', onclick: () => speak(word) },
    h('b', { lang: 'ja' }, word), sub ? h('span', { class: 'romaji', lang: 'ja' }, sub) : null, zh ? h('small', {}, zh) : null);
}

function kanjiInfo(k) {
  const ex = kanjiExamples(k.c, 6);
  return [
    h('div', { class: 'kj-readings' },
      h('p', {}, h('span', { class: 'kj-tag' }, '音讀'), h('b', { lang: 'ja' }, k.on)),
      h('p', {}, h('span', { class: 'kj-tag' }, '訓讀'), h('b', { lang: 'ja' }, k.kun))),
    ex.length ? h('div', { class: 'kj-examples' }, ex.map(w => exampleChip(w.w, w.r !== w.w ? w.r : null, w.zh))) : null,
  ];
}

function showKanjiDetail(k) {
  const st = srsStatus(k.key);
  openModal(h('div', { class: 'kana-detail' },
    h('div', { class: 'kd-head' },
      h('div', { class: 'kd-big kj-big', lang: 'ja' }, k.c),
      h('div', { class: 'kd-info' },
        h('div', { class: 'kj-mean' }, k.zh),
        h('span', { class: `status-badge ${st}` }, STATUS_LABEL[st]))),
    ...kanjiInfo(k),
    tracePad(k.c)));
}

/* ---------- 大人首頁 ---------- */
function adultHome() {
  setHeader('日語學習・N5');
  const due = d => dueItems(d).length, fresh = d => newItems(d).length;
  const total = due('vocab') + due('kanji') + fresh('vocab') + fresh('kanji');
  const deckRow = d => h('div', { class: 'deck-row' },
    h('span', { class: 'deck-name' }, DECKS[d].name),
    h('span', { class: 'deck-count due' }, `複習 ${due(d)}`),
    h('span', { class: 'deck-count new' }, `新字 ${fresh(d)}`),
    h('a', { class: 'btn small' + (due(d) + fresh(d) ? '' : ' ghost'), href: `#/srs/${d}` }, '開始'));
  const progress = d => {
    const items = DECKS[d].items;
    const learned = items.filter(it => state.srs[it.key]).length;
    const mature = items.filter(it => srsStatus(it.key) === 'mature').length;
    return h('div', { class: 'bar-row wide' },
      h('span', {}, DECKS[d].name),
      h('div', { class: 'bar stack' },
        h('i', { class: 'mature', style: `width:${(mature / items.length) * 100}%` }),
        h('i', { class: 'learning', style: `width:${((learned - mature) / items.length) * 100}%` })),
      h('span', { class: 'bar-num' }, `${learned}/${items.length}`));
  };
  const tiles = [
    { href: '#/kana/hira', icon: 'あ', label: '五十音', sub: '平假名・片假名・筆順', jp: true },
    { href: '#/kana/hira/yoon', icon: 'きゃ', label: '拗音・特殊音', sub: '拗音・促音・長音', jp: true },
    { href: '#/n5', icon: '語', label: 'N5 單字', sub: `${N5_VOCAB.length} 個單字`, jp: true },
    { href: '#/kanji', icon: '漢', label: 'N5 漢字', sub: `${N5_KANJI.length} 個漢字`, jp: true },
    { href: '#/grammar', icon: 'は', label: 'N5 文法', sub: `${GRAMMAR.length} 個句型・填空・重組`, jp: true },
    { href: '#/listen', icon: '🎧', label: '例句聽力', sub: '聽句子選意思' },
    { href: '#/typing', icon: '⌨️', label: '打字練習', sub: '看中文打出日文' },
    { href: '#/progress', icon: '📊', label: '進度與成就', sub: `總共 ${state.stars} 顆星` },
  ];

  app.append(
    modeSwitch(),
    h('section', { class: 'review-hero' },
      h('div', { class: 'rh-top' },
        h('div', {},
          h('p', { class: 'rh-label' }, '今日複習'),
          h('p', { class: 'rh-num' }, total ? `${total} 張卡片` : '今天都完成了 🎉')),
        h('a', { class: 'btn big' + (total ? '' : ' ghost'), href: '#/srs/all' }, total ? '開始複習' : '再學一些')),
      deckRow('vocab'), deckRow('kanji')),
    dailyCard(),
    h('h2', { class: 'section-title' }, '學習進度'),
    h('div', { class: 'bars' }, progress('vocab'), progress('kanji'),
      h('p', { class: 'legend' }, h('i', { class: 'dot mature' }), '熟練（間隔 21 天以上）', h('i', { class: 'dot learning' }), '學習中')),
    h('nav', { class: 'tiles adult-tiles' }, tiles.map(t =>
      h('a', { class: 'tile', href: t.href },
        h('span', { class: 'tile-icon', lang: t.jp ? 'ja' : null }, t.icon),
        h('span', { class: 'tile-label' }, t.label),
        h('span', { class: 'tile-sub' }, t.sub)))),
    h('h2', { class: 'section-title' }, '設定'),
    themeSetting(),
    h('div', { class: 'setting' },
      h('span', {}, '每天新字（每類）'),
      h('div', { class: 'seg' }, [5, 10, 20].map(n => h('a', {
        href: '#/', class: state.newPerDay === n ? 'on' : null,
        onclick: e => { e.preventDefault(); state.newPerDay = n; save(); render(); },
      }, `${n}`)))),
    h('div', { class: 'setting' },
      h('span', {}, '複習單字時打字回答讀音'),
      h('button', {
        class: 'chip' + (state.typeAnswer ? ' on' : ''),
        onclick: () => { state.typeAnswer = !state.typeAnswer; save(); render(); },
      }, state.typeAnswer ? '開啟' : '關閉')),
  );
  updateVoiceTip();
}

/* ---------- 複習 ---------- */
function srsPage(deck = 'all') {
  const decks = deck === 'all' ? ['vocab', 'kanji'] : [deck];
  if (!decks.every(d => DECKS[d])) { location.replace('#/'); return; }
  setHeader(deck === 'all' ? '今日複習' : `${DECKS[deck].name}・複習`, '#/');
  const token = renderToken;
  const queue = [
    ...shuffle(decks.flatMap(d => dueItems(d).map(it => ({ it, d, isNew: false })))).slice(0, 100),
    ...decks.flatMap(d => newItems(d).map(it => ({ it, d, isNew: true }))),
  ];
  const total = queue.length;
  let done = 0, again = 0, front = true, onKey = null;
  const box = h('div', { class: 'srs' });
  app.append(box);

  const keyHandler = e => {
    if (token !== renderToken) { document.removeEventListener('keydown', keyHandler); return; }
    if (e.repeat || e.target.tagName === 'INPUT' || $('#modal').hidden === false) return;
    if (onKey) onKey(e);
  };
  document.addEventListener('keydown', keyHandler);

  if (!total) return emptyState();
  show();

  function show() {
    if (!queue.length) return finish();
    front = true;
    const card = queue[0], it = card.it, isV = card.d === 'vocab';
    const hasKanji = isV && it.w !== it.r;
    const typing = hasKanji && state.typeAnswer;
    const tag = card.counted ? '再一次' : card.isNew ? '新' : '複習';
    const head = h('div', { class: 'srs-progress' },
      h('div', { class: 'bar' }, h('i', { style: `width:${(done / total) * 100}%` })),
      h('span', {}, `${done} / ${total}`));
    const cardEl = h('div', { class: 'srs-card' },
      h('div', { class: 'srs-meta' }, h('span', { class: `srs-tag ${card.isNew ? 'new' : ''}` }, tag), h('span', {}, isV ? it.cat : 'N5 漢字')),
      h('div', { class: 'srs-front', lang: 'ja' }, isV ? it.w : it.c),
      h('p', { class: 'srs-ask' }, !isV ? '想想看：意思和讀音？' : typing ? '這個字怎麼唸？' : hasKanji ? '想想看：讀音和意思？' : '想想看：是什麼意思？'));
    const actions = h('div', { class: 'srs-actions' });

    if (typing) {
      const ri = readingInput(v => reveal(readingMatches(v, it.r), toKana(v, true)));
      actions.append(ri.el, h('div', { class: 'row' },
        h('button', { class: 'btn', onclick: () => ri.input.value.trim() && reveal(readingMatches(ri.input.value, it.r), toKana(ri.input.value, true)) }, '確認（Enter）'),
        h('button', { class: 'btn ghost', onclick: () => reveal(false, '') }, '不知道')));
      onKey = null;
      setTimeout(() => ri.input.focus(), 50);
    } else {
      actions.append(h('button', { class: 'btn big', onclick: () => reveal(null) }, '顯示答案（空白鍵）'));
      onKey = e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); reveal(null); } };
    }
    box.replaceChildren(head, cardEl, actions);

    function reveal(ok, typed) {
      if (!front) return;
      front = false;
      const back = isV
        ? [h('p', { class: 'srs-reading', lang: 'ja' }, it.r), h('p', { class: 'srs-mean' }, it.zh)]
        : [h('p', { class: 'srs-mean' }, it.zh), ...kanjiInfo(it),
          h('button', { class: 'btn ghost small', onclick: () => openModal(h('div', { class: 'kana-detail' }, tracePad(it.c))) }, '✍️ 寫寫看')];
      if (ok === true) { back.unshift(h('p', { class: 'srs-result right' }, '✅ 答對了！')); sfx.good(); }
      if (ok === false) {
        back.unshift(h('p', { class: 'srs-result wrong' }, typed ? `❌ 你的答案：${typed}` : '❌ 沒關係，記下來！'));
        sfx.bad();
      }
      cardEl.append(h('div', { class: 'srs-back' }, back,
        h('button', { class: 'btn ghost small', onclick: () => speak(isV ? it.r : (kanjiExamples(it.c, 1)[0] || {}).r || it.c) }, '🔊 發音')));
      if (isV) setTimeout(() => token === renderToken && speak(it.r), ok == null ? 0 : 350);
      const s = state.srs[it.key];
      actions.replaceChildren(h('div', { class: 'grades' }, GRADES.map((gr, g) =>
        h('button', { class: `grade ${gr.cls}${ok === false && g === 0 ? ' suggest' : ''}`, onclick: () => grade(g) },
          h('b', {}, gr.label), h('small', {}, intervalText(schedule(s, g).i)), h('kbd', {}, g + 1)))));
      onKey = e => {
        if ('1234'.includes(e.key)) grade(+e.key - 1);
        else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); grade(ok === false ? 0 : 2); }
      };
    }

    function grade(g) {
      onKey = null;
      state.srs[it.key] = schedule(state.srs[it.key], g);
      if (card.isNew && !card.counted) srsDay()[card.d]++;
      queue.shift();
      if (g === 0) { again++; queue.push({ ...card, counted: true }); } else { done++; addStars(1); }
      save();
      show();
    }
  }

  function finish() {
    onKey = null;
    sfx.win(); confetti();
    box.replaceChildren(h('div', { class: 'result' },
      h('div', { class: 'result-emoji' }, '🎉'),
      h('h2', {}, '複習完成！'),
      h('p', { class: 'result-score' }, `完成 ${done} 張卡片${again ? `，其中 ${again} 次重來` : ''}，獲得 ${done} 顆星`),
      nextDueText(decks),
      h('div', { class: 'row' },
        h('a', { class: 'btn', href: '#/' }, '回首頁'),
        moreNewButton(decks))));
  }

  function emptyState() {
    box.replaceChildren(h('div', { class: 'result' },
      h('div', { class: 'result-emoji' }, '☕'),
      h('h2', {}, '目前沒有要複習的卡片'),
      nextDueText(decks),
      h('div', { class: 'row' }, moreNewButton(decks), h('a', { class: 'btn ghost', href: '#/' }, '回首頁'))));
  }
}

function nextDueText(decks) {
  const tomorrow = addDays(1);
  const n = decks.flatMap(d => DECKS[d].items).filter(it => { const s = state.srs[it.key]; return s && s.due <= tomorrow && s.due > dayStr(); }).length;
  return h('p', { class: 'hint' }, n ? `明天有 ${n} 張要複習。` : '明天沒有排定的複習。');
}

function moreNewButton(decks) {
  const left = decks.flatMap(d => DECKS[d].items).filter(it => !state.srs[it.key]).length;
  if (!left) return null;
  return h('button', {
    class: 'btn',
    onclick: () => { decks.forEach(d => { srsDay()[d] -= 5; }); save(); render(); },
  }, '➕ 再學 5 個新字');
}

/* ---------- N5 單字列表 ---------- */
function n5Page(cat) {
  setHeader('N5 單字', '#/');
  const current = N5_CATS.includes(cat) ? cat : N5_CATS[0];
  const list = h('div', { class: 'vlist' });
  const search = h('input', { class: 'search', type: 'search', placeholder: '搜尋：中文、假名、漢字或羅馬拼音', lang: 'ja' });

  const row = w => {
    const st = srsStatus(w.key);
    return h('button', { class: 'vrow', onclick: () => speak(w.r) },
      h('i', { class: `dot ${st}`, title: STATUS_LABEL[st] }),
      h('span', { class: 'vw', lang: 'ja' }, w.w),
      h('span', { class: 'vr', lang: 'ja' }, w.r !== w.w ? w.r : ''),
      h('span', { class: 'vz' }, w.zh));
  };
  const draw = () => {
    const q = search.value.trim();
    let items = N5_VOCAB.filter(w => w.cat === current);
    if (q) {
      const kana = normKana(toKana(q, true));
      items = N5_VOCAB.filter(w => w.w.includes(q) || w.zh.includes(q) || normKana(w.r).includes(kana));
    }
    list.replaceChildren(...(items.length ? items.map(row) : [h('p', { class: 'hint' }, '找不到符合的單字')]));
  };
  search.addEventListener('input', draw);
  draw();

  app.append(
    h('div', { class: 'toolbar' }, h('a', { class: 'btn', href: '#/srs/vocab' }, `🔁 複習單字（${dueItems('vocab').length + newItems('vocab').length}）`)),
    search,
    h('div', { class: 'cats' }, N5_CATS.map(c =>
      h('a', { href: `#/n5/${encodeURIComponent(c)}`, class: 'cat' + (c === current ? ' on' : '') },
        c, h('small', {}, N5_VOCAB.filter(w => w.cat === c).length)))),
    h('p', { class: 'legend' }, '點一下聽發音　', h('i', { class: 'dot new' }), '未學', h('i', { class: 'dot learning' }), '學習中', h('i', { class: 'dot mature' }), '熟練'),
    list,
  );
}

/* ---------- N5 漢字 ---------- */
function kanjiPage() {
  setHeader('N5 漢字', '#/');
  app.append(
    h('div', { class: 'toolbar' }, h('a', { class: 'btn', href: '#/srs/kanji' }, `🔁 複習漢字（${dueItems('kanji').length + newItems('kanji').length}）`)),
    h('p', { class: 'hint' }, '點漢字看讀音、例字、筆順，還可以描字挑戰。'),
    h('div', { class: 'kanji-grid' }, N5_KANJI.map(k =>
      h('button', { class: `kcell ${srsStatus(k.key)}`, onclick: () => showKanjiDetail(k) },
        h('span', { class: 'kc', lang: 'ja' }, k.c), h('small', {}, k.zh.split('；')[0])))),
  );
}

/* ---------- 打字練習 ---------- */
function typingPage() {
  setHeader('打字練習', '#/');
  const token = renderToken;
  const learned = N5_VOCAB.filter(w => state.srs[w.key]);
  const qs = sample(learned.length >= 10 ? learned : N5_VOCAB, 10);
  let i = 0, score = 0;
  const box = h('div', { class: 'srs' });
  app.append(
    h('p', { class: 'hint' }, learned.length >= 10 ? '從你學過的單字出題。看中文，打出日文讀音。' : '看中文，打出日文讀音（可以打羅馬拼音，例如 taberu）。'),
    box);

  function show() {
    const w = qs[i];
    let answered = false;
    const ri = readingInput(v => check(v));
    const feedback = h('div', { class: 'type-feedback' });
    const next = h('button', { class: 'btn', hidden: true, onclick: () => go() }, '下一題（Enter）');
    function check(v) {
      if (answered) return go();
      answered = true;
      const ok = readingMatches(v, w.r);
      if (ok) { score++; sfx.good(); } else sfx.bad();
      ri.input.readOnly = true;
      feedback.replaceChildren(h('div', {},
        h('p', { class: `srs-result ${ok ? 'right' : 'wrong'}` }, ok ? '✅ 答對了！' : v ? `❌ 你的答案：${toKana(v, true)}` : '❌ 答案是：'),
        h('p', { class: 'srs-front small', lang: 'ja' }, w.w),
        w.w !== w.r ? h('p', { class: 'srs-reading', lang: 'ja' }, w.r) : null));
      next.hidden = false;
      speak(w.r);
    }
    function go() { if (token !== renderToken) return; i++; i < qs.length ? show() : finish(); }
    box.replaceChildren(
      h('div', { class: 'srs-progress' },
        h('div', { class: 'bar' }, h('i', { style: `width:${(i / qs.length) * 100}%` })),
        h('span', {}, `${i + 1} / ${qs.length}`)),
      h('div', { class: 'srs-card' },
        h('div', { class: 'srs-meta' }, h('span', {}, w.cat)),
        h('div', { class: 'srs-front zh' }, w.zh),
        h('p', { class: 'srs-ask' }, '用日文怎麼說？')),
      h('div', { class: 'srs-actions' }, ri.el, feedback,
        h('div', { class: 'row' },
          h('button', { class: 'btn ghost', onclick: () => !answered && check('') }, '不知道'),
          next)));
    setTimeout(() => ri.input.focus(), 50);
  }

  function finish() {
    addStars(score);
    sfx.win();
    if (score >= 8) confetti();
    box.replaceChildren(h('div', { class: 'result' },
      h('div', { class: 'result-emoji' }, score >= 8 ? '🏆' : score >= 5 ? '👍' : '💪'),
      h('h2', {}, `答對 ${score} / ${qs.length} 題`),
      h('p', { class: 'result-score' }, `獲得 ${score} 顆星`),
      h('div', { class: 'row' },
        h('button', { class: 'btn', onclick: render }, '🔁 再練一次'),
        h('a', { class: 'btn ghost', href: '#/' }, '回首頁'))));
  }

  show();
}

/* ---------- 拗音・促音・長音 ---------- */
const YOON_BASE = [['ki', 'ky'], ['shi', 'sh'], ['chi', 'ch'], ['ni', 'ny'], ['hi', 'hy'], ['mi', 'my'], ['ri', 'ry'], ['gi', 'gy'], ['ji', 'j'], ['bi', 'by'], ['pi', 'py']];

function kanaExtras(sc) {
  const isHira = sc === 'hira';
  const small = isHira ? 'ゃゅょ' : 'ャュョ';
  const all = [...BASIC, ...DAKU];
  const cell = (text, ro) => h('button', { class: 'cell', onclick: () => speak(text) },
    h('span', { class: 'kana', lang: 'ja' }, text), h('span', { class: 'romaji' }, ro));
  const yoon = h('div', { class: 'kana-grid yoon' }, YOON_BASE.flatMap(([base, pre]) => {
    const k = all.find(x => x.r === base);
    return [...small].map((s, i) => cell(k[sc] + s, pre + 'auo'[i]));
  }));
  const conv = s => (isHira ? s : s.replace(/[ぁ-ゖ]/g, ch => String.fromCharCode(ch.charCodeAt(0) + 0x60)));
  const section = (title, desc, ...body) => h('section', { class: 'extra-sec' },
    h('h2', { class: 'section-title' }, title), h('p', { class: 'hint' }, desc), ...body);
  const chips = list => h('div', { class: 'ex-list' }, list.map(([w, ro, zh]) => exampleChip(w, ro, zh)));

  return [
    section('拗音', `「い段」的字加上小寫的 ${[...small].join('・')}，兩個字合成一拍來唸。`, yoon,
      chips(isHira
        ? [['きょう', 'kyou', '今天'], ['しゃしん', 'shashin', '照片'], ['びょういん', 'byouin', '醫院'], ['りょこう', 'ryokou', '旅行'], ['ちゃわん', 'chawan', '碗']]
        : [['シャツ', 'shatsu', '襯衫'], ['ジュース', 'juusu', '果汁'], ['ニュース', 'nyuusu', '新聞'], ['チョコ', 'choko', '巧克力']])),
    section('促音（小寫的 ' + conv('っ') + '）', '小小的「つ」不發音，而是停頓一拍，讓後面的子音重複。打字時把子音打兩次，例如 kitte。',
      chips(isHira
        ? [['きって', 'kitte', '郵票'], ['ざっし', 'zasshi', '雜誌'], ['がっこう', 'gakkou', '學校'], ['きっぷ', 'kippu', '車票'], ['いっしょに', 'issho ni', '一起']]
        : [['カップ', 'kappu', '杯子'], ['ベッド', 'beddo', '床'], ['ポケット', 'poketto', '口袋'], ['サッカー', 'sakkaa', '足球']])),
    section('長音', isHira
      ? '母音拉長一拍。注意：「えい」通常唸成「ええ」，「おう」唸成「おお」，但寫法要照原本的寫。'
      : '片假名用「ー」表示拉長一拍。打字時可以打 - 或重複母音，例如 ko-hi- 或 koohii。',
    chips(isHira
      ? [['おかあさん', 'okaasan', '媽媽'], ['おにいさん', 'oniisan', '哥哥'], ['くうき', 'kuuki', '空氣'], ['おねえさん', 'oneesan', '姊姊'], ['せんせい', 'sensei', '老師'], ['おとうさん', 'otousan', '爸爸'], ['ひこうき', 'hikouki', '飛機']]
      : [['コーヒー', 'koohii', '咖啡'], ['ケーキ', 'keeki', '蛋糕'], ['スーパー', 'suupaa', '超市'], ['ノート', 'nooto', '筆記本'], ['ビール', 'biiru', '啤酒']])),
    isHira ? null : section('外來語特殊音', '為了拼外來語，片假名會用小寫的 ァィゥェォ 組合出日語原本沒有的音。',
      h('div', { class: 'kana-grid yoon' },
        [['ティ', 'ti'], ['ディ', 'di'], ['トゥ', 'tu'], ['ファ', 'fa'], ['フィ', 'fi'], ['フェ', 'fe'], ['フォ', 'fo'], ['ウィ', 'wi'], ['ウェ', 'we'],
          ['ウォ', 'wo'], ['シェ', 'she'], ['チェ', 'che'], ['ジェ', 'je'], ['ヴァ', 'va'], ['ヴィ', 'vi']].map(([k, r]) => cell(k, r))),
      chips([['パーティー', 'paatii', '派對'], ['カフェ', 'kafe', '咖啡廳'], ['フォーク', 'fooku', '叉子'], ['チェック', 'chekku', '檢查'], ['シェフ', 'shefu', '主廚']])),
  ].filter(Boolean);
}

/* ---------- 文法 ---------- */
const grammarBest = id => state.grammar[id];

function grammarPage(id) {
  const g = GRAMMAR.find(x => x.id === id);
  if (g) return grammarDetail(g);
  setHeader('N5 文法', '#/');
  const done = GRAMMAR.filter(x => grammarBest(x.id) >= 80).length;
  app.append(
    h('div', { class: 'toolbar' },
      h('a', { class: 'btn', href: '#/gpractice/all' }, '🧩 綜合練習（10 題）'),
      h('a', { class: 'btn ghost', href: '#/listen' }, '🎧 例句聽力')),
    h('p', { class: 'hint' }, `${GRAMMAR.length} 個句型，已練熟 ${done} 個（練習 80 分以上）。點進去看說明和例句。`),
    h('div', { class: 'glist' }, GRAMMAR.map((x, i) => {
      const best = grammarBest(x.id);
      return h('a', { class: 'gitem', href: `#/grammar/${x.id}` },
        h('span', { class: 'gnum' }, i + 1),
        h('span', { class: 'gtext' }, h('b', { lang: 'ja' }, x.p), h('small', {}, x.zh)),
        best != null ? h('span', { class: `gbest${best >= 80 ? ' ok' : ''}` }, best >= 80 ? `✓ ${best}` : best) : null);
    })),
  );
}

function sentenceRow(s) {
  return h('button', { class: 'sent', onclick: () => speak(s.jp) },
    h('span', { class: 'sent-jp', lang: 'ja' }, s.jp + '。'),
    s.r !== s.jp ? h('span', { class: 'sent-r', lang: 'ja' }, s.r) : null,
    h('span', { class: 'sent-zh' }, s.zh));
}

function grammarDetail(g) {
  setHeader(g.p, '#/grammar');
  const best = grammarBest(g.id);
  app.append(
    h('section', { class: 'gcard' },
      h('h2', { lang: 'ja' }, g.p),
      h('p', { class: 'gzh' }, g.zh),
      h('p', { class: 'gnote' }, g.note)),
    h('h2', { class: 'section-title' }, '例句（點一下聽發音）'),
    h('div', { class: 'sents' }, SENTENCES.filter(s => s.g === g).map(sentenceRow)),
    h('div', { class: 'row stage-go' },
      h('a', { class: 'btn big', href: `#/gpractice/${g.id}` }, '🧩 練習這個句型'),
      best != null ? h('span', { class: 'hint' }, `最佳 ${best} 分`) : null),
  );
}

function fillQuestion(s) {
  if (s.star < 0) return null;
  const ans = s.chunks[s.star];
  const wrong = s.wrong || (PARTICLES.includes(ans) ? sample(PARTICLES.filter(p => p !== ans && p !== PARTICLE_PAIRS[ans]), 3) : null);
  return wrong && { type: 'fill', s, ans, options: shuffle([ans, ...wrong]) };
}
const reorderQuestion = s => (s.chunks.length >= 3 ? { type: 'order', s } : null);

function grammarPractice(id) {
  const g = GRAMMAR.find(x => x.id === id);
  const all = !g;
  setHeader(all ? '綜合練習' : `練習：${g.p}`, all ? '#/grammar' : `#/grammar/${g.id}`);
  const token = renderToken;
  const pool = all ? SENTENCES : SENTENCES.filter(s => s.g === g);
  const qs = all
    ? sample(pool, 10).map(s => (Math.random() < 0.5 && fillQuestion(s)) || reorderQuestion(s) || fillQuestion(s)).filter(Boolean)
    : shuffle(pool.flatMap(s => [fillQuestion(s), reorderQuestion(s)]).filter(Boolean));
  let i = 0, score = 0;
  const box = h('div', { class: 'srs' });
  app.append(box);
  show();

  function reveal(ok, feedback, next) {
    const s = qs[i].s;
    if (ok) { score++; sfx.good(); } else sfx.bad();
    feedback.replaceChildren(h('div', {},
      h('p', { class: `srs-result ${ok ? 'right' : 'wrong'}` }, ok ? '✅ 答對了！' : '❌ 正確答案：'),
      h('p', { class: 'sent-jp big', lang: 'ja' }, s.jp + '。'),
      s.r !== s.jp ? h('p', { class: 'sent-r', lang: 'ja' }, s.r) : null,
      all ? h('a', { class: 'glink', href: `#/grammar/${s.g.id}` }, `📘 ${s.g.p}`) : null));
    next.hidden = false;
    next.focus();
    setTimeout(() => token === renderToken && speak(s.jp), 300);
  }

  function show() {
    const q = qs[i], s = q.s;
    const feedback = h('div', { class: 'type-feedback' });
    const next = h('button', { class: 'btn', hidden: true, onclick: () => { if (token !== renderToken) return; i++; i < qs.length ? show() : finish(); } }, '下一題 ➜');
    let body;
    if (q.type === 'fill') {
      let locked = false;
      const sentence = h('p', { class: 'fill-sent', lang: 'ja' }, s.chunks.map((c, k) => (k === s.star ? h('span', { class: 'blank' }, '？') : c)), '。');
      const opts = h('div', { class: 'options' }, q.options.map(o => {
        const b = h('button', { class: 'opt opt-word', lang: 'ja' }, o);
        b.onclick = () => {
          if (locked) return;
          locked = true;
          const ok = o === q.ans;
          b.classList.add(ok ? 'right' : 'wrong');
          if (!ok) [...opts.children].find(x => x.textContent === q.ans).classList.add('right');
          sentence.querySelector('.blank').textContent = q.ans;
          reveal(ok, feedback, next);
        };
        return b;
      }));
      body = [h('p', { class: 'srs-ask' }, '選出空格裡正確的字'), sentence, opts];
    } else {
      const order = shuffle(s.chunks.map((c, k) => k));
      const picked = [];
      const answer = h('div', { class: 'order-answer', lang: 'ja' });
      const bank = h('div', { class: 'order-bank', lang: 'ja' });
      const check = () => {
        if (picked.length < s.chunks.length) return;
        const ok = picked.map(k => s.chunks[k]).join('') === s.jp;
        answer.classList.add(ok ? 'right' : 'wrong');
        [...answer.children, ...bank.children].forEach(b => { b.disabled = true; });
        reveal(ok, feedback, next);
      };
      const draw = () => {
        answer.replaceChildren(...(picked.length
          ? picked.map(k => h('button', { class: 'chunk', onclick: () => { picked.splice(picked.indexOf(k), 1); draw(); } }, s.chunks[k]))
          : [h('span', { class: 'order-hint' }, '點下面的積木排出句子')]));
        bank.replaceChildren(...order.filter(k => !picked.includes(k)).map(k =>
          h('button', { class: 'chunk', onclick: () => { picked.push(k); draw(); check(); } }, s.chunks[k])));
      };
      draw();
      body = [h('p', { class: 'srs-ask' }, '把積木排成正確的句子'), answer, bank];
    }
    box.replaceChildren(
      h('div', { class: 'srs-progress' },
        h('div', { class: 'bar' }, h('i', { style: `width:${(i / qs.length) * 100}%` })),
        h('span', {}, `${i + 1} / ${qs.length}`)),
      h('div', { class: 'srs-card' },
        h('div', { class: 'srs-meta' }, h('span', {}, q.type === 'fill' ? '填空' : '句子重組'), h('span', { lang: 'ja' }, all ? s.g.p : '')),
        h('p', { class: 'gq-zh' }, s.zh),
        ...body),
      h('div', { class: 'srs-actions' }, feedback, next));
  }

  function finish() {
    const pct = Math.round((score / qs.length) * 100);
    if (!all && (grammarBest(g.id) == null || pct > grammarBest(g.id))) { state.grammar[g.id] = pct; save(); }
    addStars(score);
    sfx.win();
    if (pct >= 80) confetti();
    box.replaceChildren(h('div', { class: 'result' },
      h('div', { class: 'result-emoji' }, pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '💪'),
      h('h2', {}, `${pct} 分`),
      h('p', { class: 'result-score' }, `答對 ${score} / ${qs.length} 題，獲得 ${score} 顆星`),
      h('div', { class: 'row' },
        h('button', { class: 'btn', onclick: render }, '🔁 再練一次'),
        h('a', { class: 'btn ghost', href: all ? '#/grammar' : `#/grammar/${g.id}` }, all ? '回文法列表' : '回句型說明'))));
  }
}

/* ---------- 例句聽力 ---------- */
const listenRate = () => (state.slowAudio ? 0.6 : 0.85);

function listenPage() {
  setHeader('例句聽力', '#/');
  const token = renderToken;
  const qs = sample(SENTENCES, 10);
  let i = 0, score = 0;
  const box = h('div', { class: 'srs' });
  const slow = h('button', {
    class: 'chip' + (state.slowAudio ? ' on' : ''),
    onclick: () => { state.slowAudio = !state.slowAudio; save(); slow.classList.toggle('on', state.slowAudio); },
  }, '🐢 慢速');
  app.append(h('div', { class: 'toolbar' }, h('span', { class: 'hint' }, '聽句子，選出正確的中文意思。'), slow), box);

  function show() {
    const s = qs[i];
    let locked = false;
    const play = () => speak(s.jp, null, listenRate());
    const feedback = h('div', { class: 'type-feedback' });
    const next = h('button', { class: 'btn', hidden: true, onclick: () => { if (token !== renderToken) return; i++; i < qs.length ? show() : finish(); } }, '下一題 ➜');
    const others = sample([...new Set(SENTENCES.filter(x => x.zh !== s.zh).map(x => x.zh))], 3);
    const opts = h('div', { class: 'options single' }, shuffle([s.zh, ...others]).map(zh => {
      const b = h('button', { class: 'opt opt-zh' }, zh);
      b.onclick = () => {
        if (locked) return;
        locked = true;
        const ok = zh === s.zh;
        if (ok) { score++; sfx.good(); } else sfx.bad();
        b.classList.add(ok ? 'right' : 'wrong');
        if (!ok) [...opts.children].find(x => x.textContent === s.zh).classList.add('right');
        feedback.replaceChildren(h('div', {},
          h('p', { class: 'sent-jp big', lang: 'ja' }, s.jp + '。'),
          s.r !== s.jp ? h('p', { class: 'sent-r', lang: 'ja' }, s.r) : null,
          h('a', { class: 'glink', href: `#/grammar/${s.g.id}` }, `📘 ${s.g.p}`)));
        next.hidden = false;
        next.focus();
      };
      return b;
    }));
    box.replaceChildren(
      h('div', { class: 'srs-progress' },
        h('div', { class: 'bar' }, h('i', { style: `width:${(i / qs.length) * 100}%` })),
        h('span', {}, `${i + 1} / ${qs.length}`)),
      h('div', { class: 'srs-card' },
        h('button', { class: 'prompt prompt-audio', onclick: play, 'aria-label': '再聽一次' }, '🔊'),
        h('p', { class: 'srs-ask' }, '點喇叭可以再聽一次')),
      h('div', { class: 'srs-actions' }, opts, feedback, next));
    setTimeout(() => token === renderToken && play(), 400);
  }

  function finish() {
    addStars(score);
    sfx.win();
    if (score >= 8) confetti();
    box.replaceChildren(h('div', { class: 'result' },
      h('div', { class: 'result-emoji' }, score >= 8 ? '🏆' : score >= 5 ? '👍' : '💪'),
      h('h2', {}, `聽懂 ${score} / ${qs.length} 句`),
      h('p', { class: 'result-score' }, `獲得 ${score} 顆星`),
      h('div', { class: 'row' },
        h('button', { class: 'btn', onclick: render }, '🔁 再聽一回'),
        h('a', { class: 'btn ghost', href: '#/grammar' }, '看文法句型'))));
  }

  show();
}
