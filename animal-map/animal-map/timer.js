// ⏰ 遊戲時間：玩太久就鎖住，要爸爸媽媽輸入 4 位數密碼才能解鎖
// 放在每一個小朋友會玩的頁面（地圖、車子城市、著色本、字母探險、描一描）；錄音室不計時
// 只有畫面開著的時候才算時間；新的一天自動重新計時、解鎖
// 資料存在這台 iPad：play-settings（每次可以玩幾分鐘、密碼的雜湊）、play-state（今天玩了多久、有沒有鎖住）
const PlayTimer = (() => {
  const TICK = 5;          // 每幾秒記一次
  const WARN = 120;        // 剩幾秒提醒
  const EXTRA = 10;        // 「再玩 10 分鐘」
  const MAX_TRIES = 3;     // 密碼錯幾次要等一下
  const WAIT = 30;         // 等幾秒

  const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch { return d; } };
  const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* 私密瀏覽 */ } };
  const today = () => new Date().toDateString();

  let settings = read('play-settings', { minutes: 0, pin: null, salt: null });
  let st = read('play-state', { day: today(), used: 0, locked: false, warned: false });
  if (st.day !== today()) st = { day: today(), used: 0, locked: false, warned: false };

  /* ---------- 密碼（只存雜湊，不存密碼本身） ---------- */
  async function hash(pin, salt) {
    const text = `${salt}:${pin}`;
    if (window.crypto && crypto.subtle) {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
      return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
    }
    let h = 2166136261; // 沒有 https 時的備用做法
    for (const ch of text) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; }
    return `f${h.toString(16)}`;
  }
  const hasPin = () => !!settings.pin;
  async function checkPin(pin) { return hasPin() && (await hash(pin, settings.salt)) === settings.pin; }
  async function setPin(pin) {
    settings.salt = Math.random().toString(36).slice(2);
    settings.pin = await hash(pin, settings.salt);
    write('play-settings', settings);
  }

  /* ---------- 畫面（全部用程式加進頁面，每個頁面只要載入這個檔案） ---------- */
  const css = `
  .pt-layer { position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 16px;
    font-family: -apple-system, "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif; color: #1f2d3a;
    -webkit-user-select: none; user-select: none; touch-action: none; }
  .pt-lock { background: radial-gradient(circle at 50% 30%, #3b4a8c, #1b2250 70%); color: #fff; flex-direction: column; text-align: center; }
  .pt-lock .pt-moon { font-size: 110px; line-height: 1; animation: pt-float 3s ease-in-out infinite; }
  .pt-lock h1 { margin: 18px 0 6px; font-size: 34px; }
  .pt-lock p { margin: 0 0 26px; font-size: 21px; opacity: .85; }
  .pt-stars { position: absolute; inset: 0; pointer-events: none; }
  .pt-stars i { position: absolute; width: 4px; height: 4px; border-radius: 50%; background: #fff; animation: pt-twinkle 2s ease-in-out infinite; }
  @keyframes pt-float { 50% { transform: translateY(-12px); } }
  @keyframes pt-twinkle { 50% { opacity: .2; } }
  .pt-btn { min-height: 56px; padding: 0 26px; border: none; border-radius: 28px; font: inherit; font-size: 20px; font-weight: 800; cursor: pointer; }
  .pt-btn.main { background: #ffd23f; color: #1f2d3a; }
  .pt-btn.soft { background: #eef2f6; color: #1f2d3a; }
  .pt-btn.ok { background: #22c55e; color: #fff; }
  .pt-btn:active { transform: scale(.95); }
  .pt-dim { background: rgba(15, 23, 42, .55); }
  .pt-card { width: min(420px, 100%); max-height: 100%; overflow-y: auto; padding: 22px; border-radius: 26px; background: #fff; box-shadow: 0 12px 40px rgba(0,0,0,.3); text-align: center; }
  .pt-card h2 { margin: 0 0 6px; font-size: 24px; }
  .pt-card .pt-sub { margin: 0 0 14px; font-size: 15px; color: #6b7c8c; min-height: 20px; }
  .pt-card .pt-sub.err { color: #ef4444; font-weight: 700; }
  .pt-dots { display: flex; justify-content: center; gap: 14px; margin: 6px 0 16px; }
  .pt-dots i { width: 18px; height: 18px; border-radius: 50%; border: 3px solid #94a3b8; }
  .pt-dots i.on { background: #1f2d3a; border-color: #1f2d3a; }
  .pt-dots.shake { animation: pt-shake .4s; }
  @keyframes pt-shake { 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
  .pt-keys { display: grid; grid-template-columns: repeat(3, 76px); gap: 12px; justify-content: center; }
  .pt-keys button { height: 66px; border: none; border-radius: 18px; background: #f1f5f9; font: inherit; font-size: 28px; font-weight: 800; cursor: pointer; }
  .pt-keys button:active { background: #cbd5e1; }
  .pt-keys button:disabled { opacity: .35; }
  .pt-link { margin-top: 14px; border: none; background: none; font: inherit; font-size: 15px; color: #64748b; text-decoration: underline; cursor: pointer; }
  .pt-row { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-top: 16px; }
  .pt-opts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 8px 0 14px; }
  .pt-opts button { height: 50px; border: 3px solid #e2e8f0; border-radius: 14px; background: #fff; font: inherit; font-size: 18px; font-weight: 800; cursor: pointer; }
  .pt-opts button.on { border-color: #0ea5e9; background: #e0f2fe; color: #0369a1; }
  .pt-label { margin: 14px 0 4px; font-size: 15px; font-weight: 800; color: #475569; text-align: left; }
  .pt-used { font-size: 16px; color: #475569; }
  .pt-input { width: 140px; height: 54px; border: 3px solid #cbd5e1; border-radius: 14px; font: inherit; font-size: 26px; text-align: center; }
  .pt-toast { position: fixed; left: 50%; top: 16px; transform: translateX(-50%); z-index: 9998; padding: 14px 26px; border-radius: 26px;
    background: #fff7d6; border: 3px solid #f5c542; font-family: -apple-system, "PingFang TC", sans-serif; font-size: 20px; font-weight: 800;
    box-shadow: 0 6px 18px rgba(0,0,0,.2); animation: pt-drop .5s ease-out; }
  @keyframes pt-drop { from { transform: translate(-50%, -80px); } }`;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.append(style);

  const el = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; };

  /* ---------- 鎖住時：所有聲音停下來，也不能再播 ---------- */
  const media = new Set();
  const origPlay = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function play(...args) {
    media.add(this);
    if (st.locked) return Promise.reject(new Error('locked'));
    return origPlay.apply(this, args);
  };
  let allowSpeech = false;
  if ('speechSynthesis' in window) {
    const origSpeak = speechSynthesis.speak.bind(speechSynthesis);
    speechSynthesis.speak = (u) => { if (!st.locked || allowSpeech) origSpeak(u); };
  }
  function silenceAll() {
    media.forEach((m) => { try { m.pause(); } catch { /* */ } });
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  }
  function say(text) {
    if (!('speechSynthesis' in window)) return;
    allowSpeech = true;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-TW';
    u.rate = 0.85;
    speechSynthesis.speak(u);
    allowSpeech = false;
  }

  /* ---------- 4 位數密碼鍵盤 ---------- */
  let lockedUntil = 0, wrong = 0;
  // mode: 'check'（核對）、'new'（設新密碼）；回傳輸入的 4 位數（取消時回傳 null）
  function keypad({ title, sub = '', mode = 'check', onForgot } = {}) {
    return new Promise((resolve) => {
      const layer = el(`<div class="pt-layer pt-dim"><div class="pt-card">
        <h2>${title}</h2><p class="pt-sub">${sub}</p>
        <div class="pt-dots"><i></i><i></i><i></i><i></i></div>
        <div class="pt-keys">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button data-k="${n}">${n}</button>`).join('')}
          <button data-k="x">✕</button><button data-k="0">0</button><button data-k="b">⌫</button></div>
        ${onForgot ? '<button class="pt-link" data-k="forgot">忘記密碼？</button>' : ''}
      </div></div>`);
      document.body.append(layer);
      const dots = [...layer.querySelectorAll('.pt-dots i')], subEl = layer.querySelector('.pt-sub');
      let code = '';
      const show = () => dots.forEach((d, i) => d.classList.toggle('on', i < code.length));
      const close = (v) => { layer.remove(); resolve(v); };
      const waitTick = () => {
        const left = Math.ceil((lockedUntil - Date.now()) / 1000);
        layer.querySelectorAll('.pt-keys button').forEach((b) => { b.disabled = left > 0 && b.dataset.k !== 'x'; });
        if (left > 0) { subEl.textContent = `錯太多次了，請等 ${left} 秒`; subEl.classList.add('err'); setTimeout(waitTick, 500); }
        else if (subEl.classList.contains('err')) { subEl.textContent = sub; subEl.classList.remove('err'); }
      };
      waitTick();
      layer.addEventListener('click', async (e) => {
        const k = e.target.dataset && e.target.dataset.k;
        if (!k) return;
        if (k === 'x') return close(null);
        if (k === 'forgot') { layer.remove(); onForgot(resolve); return; }
        if (Date.now() < lockedUntil) return;
        if (k === 'b') code = code.slice(0, -1);
        else if (code.length < 4) code += k;
        show();
        if (code.length < 4) return;
        if (mode === 'new') return close(code);
        if (await checkPin(code)) { wrong = 0; return close(code); }
        wrong++;
        const box = layer.querySelector('.pt-dots');
        box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake');
        code = '';
        setTimeout(show, 300);
        if (wrong >= MAX_TRIES) { wrong = 0; lockedUntil = Date.now() + WAIT * 1000; waitTick(); }
        else { subEl.textContent = '密碼不對，再試一次'; subEl.classList.add('err'); }
      });
    });
  }

  // 忘記密碼：算一題大人才會的乘法，答對就重新設定
  function forgot(resolve) {
    const a = 13 + Math.floor(Math.random() * 80), b = 6 + Math.floor(Math.random() * 4);
    const layer = el(`<div class="pt-layer pt-dim"><div class="pt-card">
      <h2>忘記密碼</h2><p class="pt-sub">請家長算出答案，答對就可以重新設定密碼</p>
      <p style="font-size:34px;font-weight:900;margin:6px 0 12px">${a} × ${b} = ?</p>
      <input class="pt-input" inputmode="numeric" pattern="[0-9]*" autocomplete="off">
      <div class="pt-row"><button class="pt-btn soft" data-a="x">取消</button><button class="pt-btn ok" data-a="ok">確定</button></div>
    </div></div>`);
    document.body.append(layer);
    const input = layer.querySelector('input');
    layer.addEventListener('click', async (e) => {
      const act = e.target.dataset && e.target.dataset.a;
      if (act === 'x') { layer.remove(); resolve(null); }
      if (act === 'ok') {
        if (Number(input.value) !== a * b) { layer.querySelector('.pt-sub').textContent = '答案不對喔'; layer.querySelector('.pt-sub').classList.add('err'); return; }
        layer.remove();
        settings.pin = null;
        write('play-settings', settings);
        resolve((await createPin()) ? 'reset' : null);
      }
    });
  }

  async function createPin() {
    const a = await keypad({ title: '設定家長密碼', sub: '請輸入 4 位數字（小朋友不知道的）', mode: 'new' });
    if (!a) return false;
    const b = await keypad({ title: '再輸入一次', sub: '確認密碼', mode: 'new' });
    if (!b) return false;
    if (a !== b) { toast('兩次密碼不一樣，請重新設定'); return createPin(); }
    await setPin(a);
    toast('✅ 密碼設定好了');
    return true;
  }

  // 家長才能做的事都先問密碼；還沒設定密碼就直接通過
  async function requireParent(title = '請輸入家長密碼') {
    if (!hasPin()) return true;
    return !!(await keypad({ title, onForgot: forgot }));
  }

  /* ---------- ⏰ 家長設定 ---------- */
  async function openSettings() {
    if (!hasPin() && !(await createPin())) return;
    const opts = [15, 20, 30, 45, 60, 0];
    const render = () => `<div class="pt-card">
      <h2>⏰ 遊戲時間</h2><p class="pt-sub">時間到了會鎖住，要輸入家長密碼才能繼續玩</p>
      <div class="pt-label">每次可以玩</div>
      <div class="pt-opts">${opts.map((m) => `<button data-m="${m}" class="${settings.minutes === m ? 'on' : ''}">${m ? `${m} 分鐘` : '不限制'}</button>`).join('')}</div>
      <div class="pt-used">今天這次已經玩了 <b>${Math.floor(st.used / 60)}</b> 分鐘</div>
      <div class="pt-row">
        <button class="pt-btn soft" data-a="reset">🔄 重新計時</button>
        <button class="pt-btn soft" data-a="pin">🔑 更改密碼</button>
      </div>
      <div class="pt-row"><button class="pt-btn ok" data-a="done">完成</button></div>
    </div>`;
    const layer = el(`<div class="pt-layer pt-dim">${render()}</div>`);
    document.body.append(layer);
    layer.addEventListener('click', async (e) => {
      const d = e.target.dataset || {};
      if (d.m !== undefined) { settings.minutes = Number(d.m); write('play-settings', settings); st.warned = false; save(); }
      if (d.a === 'reset') { st.used = 0; st.warned = false; save(); toast('已重新計時'); }
      if (d.a === 'pin') { layer.style.display = 'none'; await createPin(); layer.style.display = ''; }
      if (d.a === 'done') { layer.remove(); check(); return; }
      layer.innerHTML = render();
    });
  }

  /* ---------- 鎖住的畫面 ---------- */
  let lockLayer = null;
  function showLock(announce) {
    silenceAll();
    if (lockLayer) return;
    const stars = Array.from({ length: 24 }, () => `<i style="left:${Math.random() * 100}%;top:${Math.random() * 60}%;animation-delay:${(Math.random() * 2).toFixed(2)}s"></i>`).join('');
    lockLayer = el(`<div class="pt-layer pt-lock"><div class="pt-stars">${stars}</div>
      <div class="pt-moon">😴</div>
      <h1>玩好久了，眼睛要休息囉！</h1>
      <p>去喝杯水、看看窗外遠遠的地方 👀</p>
      <button class="pt-btn main" data-a="unlock">👨‍👩‍👧 請爸爸媽媽來解鎖</button>
    </div>`);
    document.body.append(lockLayer);
    lockLayer.addEventListener('click', async (e) => {
      if (!(e.target.dataset && e.target.dataset.a === 'unlock')) return;
      if (!(await requireParent('家長解鎖'))) return;
      chooseUnlock();
    });
    if (announce) setTimeout(() => say('時間到囉！眼睛要休息一下，請爸爸媽媽來幫你解鎖。'), 300);
  }
  function chooseUnlock() {
    const layer = el(`<div class="pt-layer pt-dim"><div class="pt-card">
      <h2>🔓 解鎖</h2><p class="pt-sub">要讓小朋友再玩多久？</p>
      <div class="pt-row" style="flex-direction:column">
        <button class="pt-btn ok" data-a="extra">再玩 ${EXTRA} 分鐘</button>
        <button class="pt-btn soft" data-a="fresh">重新計時（再玩 ${settings.minutes || '不限'}${settings.minutes ? ' 分鐘' : ''}）</button>
        <button class="pt-btn soft" data-a="settings">⏰ 打開設定</button>
      </div>
    </div></div>`);
    document.body.append(layer);
    layer.addEventListener('click', (e) => {
      const a = e.target.dataset && e.target.dataset.a;
      if (!a) return;
      layer.remove();
      st.locked = false;
      st.warned = false;
      st.used = a === 'extra' && settings.minutes ? Math.max(0, settings.minutes * 60 - EXTRA * 60) : 0;
      save();
      lockLayer.remove();
      lockLayer = null;
      if (a === 'settings') openSettings();
    });
  }

  /* ---------- 計時 ---------- */
  function save() { write('play-state', st); }
  let toastTimer;
  function toast(msg) {
    document.querySelectorAll('.pt-toast').forEach((t) => t.remove());
    const t = el(`<div class="pt-toast">${msg}</div>`);
    document.body.append(t);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.remove(), 4000);
  }
  function check(announce = true) {
    // 換了一天：重新計時、自動解鎖
    if (st.day !== today()) { st = { day: today(), used: 0, locked: false, warned: false }; save(); if (lockLayer) { lockLayer.remove(); lockLayer = null; } }
    const limit = settings.minutes * 60;
    if (st.locked) { showLock(false); return; }
    if (!limit) return;
    if (st.used >= limit) { st.locked = true; save(); showLock(announce); return; }
    if (!st.warned && limit - st.used <= WARN) {
      st.warned = true;
      save();
      toast('⏰ 再玩 2 分鐘就要休息囉！');
      say('再玩兩分鐘，就要休息囉！');
    }
  }
  let last = Date.now();
  function tick() {
    const now = Date.now();
    const dt = Math.min((now - last) / 1000, TICK * 2); // 睡眠、切到背景的時間不算
    last = now;
    settings = read('play-settings', settings); // 別的頁面改了設定也跟著變
    const saved = read('play-state', st);
    if (saved.day === st.day) { st.used = Math.max(st.used, saved.used); st.locked = st.locked || saved.locked; st.warned = st.warned || saved.warned; }
    if (document.visibilityState === 'visible' && !st.locked && settings.minutes) { st.used += dt; save(); }
    check();
  }
  document.addEventListener('visibilitychange', () => { last = Date.now(); if (document.visibilityState === 'visible') check(false); });
  setInterval(tick, TICK * 1000);
  // 一打開就檢查（重新整理也逃不掉）
  if (document.body) check(false); else document.addEventListener('DOMContentLoaded', () => check(false));

  return { requireParent, openSettings, hasPin };
})();
