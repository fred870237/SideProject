// 🚂 環島地圖：通用的「地區地圖」引擎，資料放在 regions/<id>.js（格式見 regions/taiwan.js）
// 網址 region.html?r=taiwan；點車站 → 火車沿著鐵路開過去 → 到站卡片（中文、English、台語）＋蓋護照印章
// 想加新的國家或地區：新增 regions/<id>.js，並把 id 加進下面的 REGION_FILES
const REGION_FILES = ['taiwan'];

const $ = (id) => document.getElementById(id);
const SVGNS = 'http://www.w3.org/2000/svg';
const params = new URLSearchParams(location.search);
const regionId = REGION_FILES.includes(params.get('r')) ? params.get('r') : REGION_FILES[0];
if (params.get('from') === 'city') $('backBtn').href = 'city.html';

// 先載入地區的資料檔，再開始畫
const script = document.createElement('script');
script.src = `regions/${regionId}.js?v=28`;
script.onload = () => start(window.REGIONS[regionId]);
document.body.append(script);

function start(R) {
  document.title = R.title.zh;
  $('title').textContent = `🚂 ${R.title.zh}`;
  document.body.style.background = R.sea;

  /* ---------- 投影：經緯度 → 畫面座標（1000 高） ---------- */
  // 用跟主世界地圖一樣的 Miller 投影（travel.js），只是放大、平移：
  // 地區畫面座標 = (主地圖座標 - 左上角) × SC，主地圖上的陸地也能用同一套座標畫在旁邊
  const pts = [...R.outline, ...R.stops.flatMap((s) => [s.at, s.marker || s.at])];
  const lons = pts.map((p) => p[0]), lats = pts.map((p) => p[1]);
  const pad = 0.18;
  const [OX, OY] = Travel.project(Math.min(...lons) - pad, Math.max(...lats) + pad);
  const [EX, EY] = Travel.project(Math.max(...lons) + pad, Math.min(...lats) - pad);
  const SC = 1000 / (EY - OY);
  const VW = (EX - OX) * SC, VH = 1000;
  const P = ([lon, lat]) => { const [x, y] = Travel.project(lon, lat); return [(x - OX) * SC, (y - OY) * SC]; };
  const HOME_VB = [-VW * 0.25, -60, VW * 1.5, VH + 120];
  const setVB = ([x, y, w, h]) => $('map').setAttribute('viewBox', `${x.toFixed(1)} ${y.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`);
  setVB(HOME_VB);

  // 平滑的封閉曲線
  const smooth = (list, closed = true) => {
    const p = list.map(P), n = p.length, f = (v) => v.toFixed(1);
    let d = `M${f(p[0][0])} ${f(p[0][1])}`;
    const last = closed ? n : n - 1;
    for (let i = 0; i < last; i++) {
      const p0 = p[(i - 1 + n) % n], p1 = p[i], p2 = p[(i + 1) % n], p3 = p[(i + 2) % n];
      d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
    }
    return d + (closed ? 'Z' : '');
  };

  // 車站圖示：資料裡有 icon（{ art } 或 { emoji }）就用它，沒有就用這站第一樣東西
  function stopIcon(s) {
    const src = s.icon || s.items[0] || {};
    return { art: src.art || null, emoji: src.emoji || '🚉' };
  }

  /* ---------- 畫地圖 ---------- */
  $('defs').innerHTML = Object.entries(ART).map(([id, fn]) => `<symbol id="art-${id}" viewBox="-50 -50 100 100">${fn()}</symbol>`).join('');
  let waves = '';
  for (let i = 0; i < 26; i++) {
    const x = ((i * 173) % (VW * 1.5)) - VW * 0.25, y = (i * 97) % VH;
    waves += `<path d="M${x.toFixed(0)} ${y} q10 -7 20 0 t20 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".4"/>`;
  }
  const mountains = (R.mountains || []).map((m) => {
    const [x, y] = P(m);
    return `<path d="M${x - 34} ${y + 20} L${x - 8} ${y - 26} L${x + 4} ${y - 8} L${x + 14} ${y - 20} L${x + 36} ${y + 20}Z" fill="#7aa95c" stroke="#5b8a43" stroke-width="2" stroke-linejoin="round"/>` +
      `<path d="M${x - 8} ${y - 26} L${x - 15} ${y - 14} L${x - 9} ${y - 17} L${x - 4} ${y - 12} L${x + 0} ${y - 20}Z" fill="#fff"/>`;
  }).join('');
  const route = R.stops.map((s) => s.at);
  const pins = R.stops.filter((s) => s.marker).map((s) => {
    const [ax, ay] = P(s.at), [mx, my] = P(s.marker);
    return `<path class="pin" d="M${ax.toFixed(1)} ${ay.toFixed(1)} L${mx.toFixed(1)} ${my.toFixed(1)}"/><circle cx="${ax.toFixed(1)}" cy="${ay.toFixed(1)}" r="5" fill="#fff"/>`;
  }).join('');
  const stations = R.stops.map((s, i) => {
    const [x, y] = P(s.marker || s.at);
    const { art, emoji: icon } = stopIcon(s);
    return `<g class="station" data-i="${i}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">
      <circle class="ring" r="36"/>
      ${art ? `<use href="#art-${art}" x="-30" y="-30" width="60" height="60"/>` : `<text font-size="38">${icon}</text>`}
      <text class="label" y="52">${s.zh}</text>
      <text class="check" x="28" y="-28"></text>
    </g>`;
  }).join('');

  $('world').innerHTML = `
    <rect x="-200000" y="-200000" width="400000" height="400000" fill="${R.sea}"/>${waves}
    <g transform="translate(${(-OX * SC).toFixed(1)} ${(-OY * SC).toFixed(1)}) scale(${SC.toFixed(3)})"><path d="${MAP_LAND}" fill="${R.landFar || '#b8de95'}"/></g>
    <path d="${smooth(R.outline)}" fill="#000" opacity=".15" transform="translate(4 8)"/>
    <path d="${smooth(R.outline)}" fill="${R.land}" stroke="#fff" stroke-width="5" stroke-linejoin="round"/>
    ${mountains}
    <path class="rail-bed" d="${smooth(route)}"/><path class="rail" d="${smooth(route)}"/>
    ${pins}
    <g id="train"><use href="#art-train" x="-44" y="-66" width="88" height="88"/></g>
    <g id="stations">${stations}</g>`; // 火車畫在車站下面，停靠時不會蓋住車站圖示

  /* ---------- 進度：去過哪些站、現在在哪 ---------- */
  const KEY = `region-${R.id}`;
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const prog = Object.assign({ at: 0, visited: [] }, load());
  // total 給主地圖的旅行模式看（⭐ 去過幾站 / 全部幾站）
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify({ ...prog, total: R.stops.length })); } catch { /* */ } };

  function markStations() {
    document.querySelectorAll('.station').forEach((g) => {
      const i = Number(g.dataset.i), id = R.stops[i].id;
      g.classList.toggle('visited', prog.visited.includes(id));
      g.classList.toggle('here', i === prog.at);
      g.querySelector('.check').textContent = prog.visited.includes(id) ? '⭐' : '';
    });
    $('passCount').textContent = `${prog.visited.length}/${R.stops.length}`;
  }

  /* ---------- 火車：沿著鐵路一站一站開 ---------- */
  const train = $('train');
  let trainFlip = 1;
  function placeTrain([x, y], dx = 0) {
    if (dx > 1) trainFlip = -1; else if (dx < -1) trainFlip = 1; // 火車頭朝左；往右開就翻過來
    train.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${trainFlip} 1)`);
  }
  placeTrain(P(R.stops[prog.at].at));

  let moving = false;
  function travel(to) {
    if (moving) return;
    const n = R.stops.length;
    if (to === prog.at) { arrive(to, false); return; }
    // 照環島的方向開過去，經過的每一站都會停一下下（不顯示卡片）
    const path = [P(R.stops[prog.at].at)];
    for (let i = prog.at; i !== to;) { i = (i + 1) % n; path.push(P(R.stops[i].at)); }
    // 每一段用曲線上的點，比較像在鐵路上跑
    const seg = [];
    for (let i = 0; i < path.length - 1; i++) for (let t = 0; t <= 1; t += 0.1) seg.push([path[i][0] + (path[i + 1][0] - path[i][0]) * t, path[i][1] + (path[i + 1][1] - path[i][1]) * t]);
    const lens = [0];
    for (let i = 1; i < seg.length; i++) lens.push(lens[i - 1] + Math.hypot(seg[i][0] - seg[i - 1][0], seg[i][1] - seg[i - 1][1]));
    const total = lens[lens.length - 1], dur = Math.min(6000, Math.max(1200, total * 4));
    moving = true;
    $('stop').classList.add('hidden');
    $('hint').classList.add('hidden');
    stopSpeech();
    Synth.play('train');
    const t0 = performance.now();
    const step = (now) => {
      const d = Math.min(1, (now - t0) / dur) * total;
      let i = lens.findIndex((l) => l >= d);
      if (i <= 0) i = 1;
      const r = (d - lens[i - 1]) / Math.max(1e-6, lens[i] - lens[i - 1]);
      placeTrain([seg[i - 1][0] + (seg[i][0] - seg[i - 1][0]) * r, seg[i - 1][1] + (seg[i][1] - seg[i - 1][1]) * r], seg[i][0] - seg[i - 1][0]);
      if (d < total) requestAnimationFrame(step);
      else { moving = false; arrive(to, true); }
    };
    requestAnimationFrame(step);
  }

  /* ---------- 到站 ---------- */
  function arrive(i, fresh) {
    const s = R.stops[i];
    prog.at = i;
    const first = !prog.visited.includes(s.id);
    if (first) prog.visited.push(s.id);
    save();
    markStations();
    showStop(s, first && fresh);
  }

  const zhChip = (s) => `<button class="name-chip zh" data-lang="zh"><span class="tag">中文</span><b>${s.zh}</b></button>`;
  const enChip = (s) => `<button class="name-chip en" data-lang="en"><span class="tag">English</span><b>${s.en}</b></button>`;
  const twChip = (s) => `<button class="name-chip tw" data-lang="tw"><span class="tag">台語</span><b>${s.tw}</b><small>${s.twRom}</small></button>`;

  function showStop(s, stamp) {
    $('stopStamp').textContent = stamp ? '🎫' : '🚉';
    $('stopStamp').style.animation = 'none'; void $('stopStamp').offsetWidth; $('stopStamp').style.animation = '';
    $('stopNames').innerHTML = zhChip(s) + enChip(s) + twChip(s);
    $('stopNames').querySelectorAll('.name-chip').forEach((b) => b.addEventListener('click', () => sayIn(s, b.dataset.lang)));
    $('stopItems').innerHTML = '';
    $('stopFact').classList.add('hidden');
    s.items.forEach((it) => {
      const c = document.createElement('button');
      c.className = 'item';
      c.innerHTML = (it.art ? `<svg viewBox="-50 -50 100 100"><use href="#art-${it.art}" x="-50" y="-50" width="100" height="100"/></svg>` : `<span class="emoji">${it.emoji}</span>`) +
        `<b>${it.zh}</b><span class="en">${it.en}</span><span class="tw">${it.tw}<br><small>${it.twRom}</small></span>`;
      c.addEventListener('click', () => {
        c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop');
        if (it.fact) { $('stopFact').textContent = `💡 ${it.fact}`; $('stopFact').classList.remove('hidden'); }
        sayItem(it);
      });
      $('stopItems').append(c);
    });
    $('stop').classList.remove('hidden');
    if (stamp) confetti();
    // 到站廣播：「臺中到了！」＋英文
    sayLines([[`${s.zh}到了！`, 'zh-TW'], [s.en, 'en-US']]);
  }

  /* ---------- 說話：中文、英文用系統語音；台語用家長錄音（錄音室的 key：<id>_tw） ---------- */
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
      u.lang = lang; u.rate = 0.85; u.pitch = 1.1;
      const v = voices.find((x) => x.lang.replace('_', '-').toLowerCase() === lang.toLowerCase());
      if (v) u.voice = v;
      let done = false;
      const fin = () => { if (!done) { done = true; resolve(); } };
      u.onend = u.onerror = fin;
      speechSynthesis.speak(u);
      setTimeout(fin, 6000);
    });
  }
  let token = 0;
  function stopSpeech() { token++; if ('speechSynthesis' in window) speechSynthesis.cancel(); recPlayer.pause(); }
  async function sayLines(lines) {
    stopSpeech();
    const t = token;
    for (const [text, lang] of lines) {
      if (t !== token) return;
      if (lang === 'rec') await playRec(text); else await speak(text, lang);
    }
  }
  const twLine = (x) => (Recs.has(`${x.id}_tw`) ? [[Recs.url(`${x.id}_tw`), 'rec']] : []);
  function sayIn(s, lang) {
    if (lang === 'zh') sayLines([[s.zh, 'zh-TW']]);
    else if (lang === 'en') sayLines([[s.en, 'en-US']]);
    else sayLines(twLine(s).length ? twLine(s) : [[`台語唸作：${s.twRom}`, 'zh-TW']]);
  }
  function sayItem(it) {
    sayLines([[it.zh, 'zh-TW'], [it.en, 'en-US'], ...twLine(it), ...(it.fact ? [[it.fact, 'zh-TW']] : [])]);
  }

  /* ---------- 🛂 護照 ---------- */
  function openPass() {
    $('passGrid').innerHTML = R.stops.map((s) => {
      const got = prog.visited.includes(s.id);
      const { art, emoji } = stopIcon(s);
      const icon = art ? `<svg viewBox="-50 -50 100 100" width="48" height="48"><use href="#art-${art}" x="-50" y="-50" width="100" height="100"/></svg>` : emoji;
      return `<div class="pass-stamp ${got ? 'got' : ''}"><span>${icon}</span>${s.zh}</div>`;
    }).join('');
    $('passTotal').textContent = `${prog.visited.length} / ${R.stops.length}`;
    $('pass').classList.remove('hidden');
    if (prog.visited.length === R.stops.length) { confetti(); sayLines([['環島成功！你好厲害！', 'zh-TW']]); }
  }
  $('passBtn').addEventListener('click', openPass);
  $('passClose').addEventListener('click', () => $('pass').classList.add('hidden'));

  /* ---------- 操作 ---------- */
  $('stations').addEventListener('click', (e) => {
    const g = e.target.closest('.station');
    if (g) travel(Number(g.dataset.i));
  });
  $('nextBtn').addEventListener('click', () => travel((prog.at + 1) % R.stops.length));
  $('stopClose').addEventListener('click', () => { stopSpeech(); $('stop').classList.add('hidden'); });

  function confetti() {
    const box = $('confetti');
    const colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
    box.innerHTML = '';
    for (let i = 0; i < 50; i++) {
      const p = document.createElement('i');
      p.style.left = Math.random() * 100 + 'vw';
      p.style.background = colors[i % colors.length];
      p.style.animationDuration = 1.6 + Math.random() * 1.6 + 's';
      p.style.animationDelay = Math.random() * 0.4 + 's';
      box.append(p);
    }
    setTimeout(() => { box.innerHTML = ''; }, 3800);
  }

  markStations();
  save();
  Recs.load(['_tw']);
  travelUi(R, P, setVB, HOME_VB, VW, P(R.stops[prog.at].at));
}

/* ---------- ✈️ 環遊世界：坐飛機降落、左上角的小地圖、坐飛機回世界地圖 ---------- */
function travelUi(R, P, setVB, HOME_VB, VW, trainAt) {
  const t = Travel.trip(R.id);
  const fromCity = params.get('from') === 'city';
  const ease = (k) => (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2);
  // 畫面（viewBox）從 a 慢慢變成 b
  const moveVB = (a, b, ms) => new Promise((resolve) => {
    const t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / ms), e = ease(k);
      // 寬高用等比的方式變，中心跟著走
      const w = a[2] * (b[2] / a[2]) ** e, h = a[3] * (b[3] / a[3]) ** e;
      const cx = a[0] + a[2] / 2 + (b[0] + b[2] / 2 - a[0] - a[2] / 2) * e, cy = a[1] + a[3] / 2 + (b[1] + b[3] / 2 - a[1] - a[3] / 2) * e;
      setVB([cx - w / 2, cy - h / 2, w, h]);
      if (k < 1) requestAnimationFrame(step); else resolve();
    };
    requestAnimationFrame(step);
  });
  // 從遠一點的地方看（看得到旁邊的國家）
  const far = (k) => { const [x, y, w, h] = HOME_VB; return [x + w / 2 - (w * k) / 2, y + h / 2 - (h * k) / 2, w * k, h * k]; };

  /* 小地圖：主世界地圖縮小版，紅框框出現在在哪裡；點了就坐飛機回世界地圖 */
  if (t) {
    const [x0, y0, x1, y1] = Travel.frame(t);
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    const w = 300, h = w * (100 / 156);
    const bw = Math.max(x1 - x0, 12), bh = Math.max(y1 - y0, 12);
    const mini = document.createElement('button');
    mini.className = 'mini-map';
    mini.dataset.say = '回世界地圖';
    mini.setAttribute('aria-label', '回世界地圖');
    mini.innerHTML = `<svg viewBox="${(cx - w / 2).toFixed(1)} ${(cy - h / 2).toFixed(1)} ${w} ${h.toFixed(1)}">
        <rect x="-500" y="-500" width="2000" height="1600" fill="#2e5fc2"/>
        <path d="${MAP_LAND}" fill="#8fd15a"/><path d="${MAP_TAIWAN}" fill="#8fd15a"/>
        <rect class="here" x="${(cx - bw / 2).toFixed(1)}" y="${(cy - bh / 2).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="3"/>
      </svg><small>📍 你在這裡</small>`;
    document.body.append(mini);
    mini.addEventListener('click', () => leave());
  }

  /* 回世界地圖：畫面拉遠、飛進雲裡，再換到主地圖（主地圖會接著縮小回整張、飛機飛回家） */
  let leaving = false;
  async function leave() {
    if (leaving || !t) return;
    leaving = true;
    Synth.play('airplane');
    const going = moveVB(HOME_VB, far(3.5), 1100);
    await Travel.wait(500);
    await Travel.cloudsIn();
    await going;
    Travel.setFlight(R.id, 'out');
    location.href = `index.html?back=${R.id}`;
  }
  if (!fromCity && t) {
    // 拿掉連結，「按鈕會說話」（voice-ui.js）才不會自己換頁
    $('backBtn').removeAttribute('href');
    $('backBtn').setAttribute('role', 'button');
    $('backBtn').addEventListener('click', () => leave());
    $('backBtn').textContent = '✈️';
    $('backBtn').dataset.say = '坐飛機回世界地圖';
  }

  /* 從主地圖飛進來：雲散開，畫面從遠遠的地方拉近，飛機降落在火車那一站 */
  if (params.get('fly') && Travel.takeFlight('in')) {
    history.replaceState(null, '', `${location.pathname}?r=${R.id}`);
    const stations = $('stations'), train = $('train');
    stations.style.opacity = '0'; train.style.opacity = '0';
    setVB(far(2.4));
    const plane = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    plane.innerHTML = Travel.PLANE;
    $('world').append(plane);
    const land = trainAt; // 降落在火車停的那一站
    const start = [land[0] - VW * 1.2, land[1] - 700];
    (async () => {
      await Travel.cloudsOut();
      const zoom = moveVB(far(2.4), HOME_VB, 1600);
      const t0 = performance.now(), ms = 1800;
      await new Promise((resolve) => {
        const step = (now) => {
          const k = Math.min(1, (now - t0) / ms), e = 1 - (1 - k) ** 2;
          const x = start[0] + (land[0] - start[0]) * e, y = start[1] + (land[1] - start[1]) * e;
          const ang = 22 * (1 - k); // 往下降，最後放平
          plane.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(1)}) scale(${(2.2 - 0.9 * e).toFixed(2)})`);
          plane.setAttribute('opacity', String(k < 0.85 ? 1 : (1 - k) / 0.15));
          if (k < 1) requestAnimationFrame(step); else resolve();
        };
        requestAnimationFrame(step);
      });
      await zoom;
      plane.remove();
      stations.style.transition = train.style.transition = 'opacity .5s';
      stations.style.opacity = train.style.opacity = '1';
    })();
  }
}

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
