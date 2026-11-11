// 🚂 環島地圖：通用的「地區地圖」引擎，資料放在 regions/<id>.js（格式見 regions/taiwan.js，日本的多島、新幹線、日語見 regions/japan.js）
// 網址 region.html?r=taiwan；點車站 → 火車沿著鐵路開過去 → 到站卡片（中文、English、第三種語言：台語或日語）＋蓋護照印章
// 想加新的國家或地區：新增 regions/<id>.js，並把 id 加進下面的 REGION_FILES（travel.js 的 TRIPS 也要設成 ready）
const REGION_FILES = ['taiwan', 'japan', 'china', 'europe', 'africa', 'australia', 'usa', 'south-america', 'arctic', 'antarctica', 'india', 'korea', 'canada', 'thailand', 'new-zealand', 'russia', 'silk-road', 'southeast-asia'];

const $ = (id) => document.getElementById(id);
const SVGNS = 'http://www.w3.org/2000/svg';
const params = new URLSearchParams(location.search);
const regionId = REGION_FILES.includes(params.get('r')) ? params.get('r') : REGION_FILES[0];
if (params.get('from') === 'city') $('backBtn').href = 'city.html';

// 先載入地區的資料檔，再開始畫
const script = document.createElement('script');
script.src = `regions/${regionId}.js?v=55`;
script.onload = () => start(window.REGIONS[regionId]);
document.body.append(script);

function start(R) {
  document.title = R.title.zh;
  const trip = Travel.trip(R.id);
  $('title').textContent = `${trip ? trip.icon : '🚂'} ${R.title.zh}`;
  document.body.style.background = R.sea;
  // 每個地方可以不一樣的設定（沒寫就用台灣環島的）
  const islands = R.islands || (R.outline ? [R.outline] : []); // 好幾個島（日本）就寫 islands: [[...], [...]]；歐洲沒有，用 countries
  const VEHICLE = R.vehicle || 'train'; // 坐什麼：ART 裡的名字，車頭要朝左
  const LANG3 = R.lang3 || 'tw'; // 第三種語言：'tw' 台語（家長錄音）、'ja' 日語（系統語音）、'none' 只有中文和英文、'local' 每個國家自己的語言（歐洲）
  // 好幾個國家（歐洲）：countries 每國一個顏色、國旗、當地語言的「你好」；國界是手畫的大概形狀，海岸線用主地圖的陸地裁出來
  const COUNTRIES = R.countries || [];
  const countryOf = (s) => COUNTRIES.find((c) => c.id === s.country) || null;
  const loop = R.loop !== false; // 環島（最後一站接回第一站）；false = 從頭開到尾的一條線
  if (R.hint) $('hint').textContent = R.hint;

  /* ---------- 投影：經緯度 → 畫面座標（1000 高） ---------- */
  // 用跟主世界地圖一樣的 Miller 投影（travel.js），只是放大、平移：
  // 地區畫面座標 = (主地圖座標 - 左上角) × SC，主地圖上的陸地也能用同一套座標畫在旁邊
  // R.bounds = [西經, 南緯, 東經, 北緯]：手動指定要看的範圍（歐洲的國家外框有畫到海上，不能拿來算範圍）
  const B = R.bounds ? [[R.bounds[0], R.bounds[1]], [R.bounds[2], R.bounds[3]]] : [];
  const pts = [...(R.islands || R.outline ? islands.flatMap((o) => o.pts || o) : []), ...B, ...R.stops.flatMap((s) => [s.at, s.marker || s.at])];
  // 南極（R.projection = 'south-pole'）：Miller 投影在南極附近會拉得很誇張，改成「從南極正上方往下看」的地圖（極射赤面投影），
  // R.rotate 把哪一邊轉到上面（南極半島朝上）；這時候主地圖的陸地資料對不起來，背景的陸地改用 islands 自己畫
  const POLAR = R.projection === 'south-pole';
  const ROT = ((R.rotate || 0) * Math.PI) / 180;
  const PROJ = POLAR
    ? (lon, lat) => { const r = Math.tan(((90 + lat) * Math.PI) / 360) * 1000, a = (lon * Math.PI) / 180 + ROT; return [r * Math.sin(a), -r * Math.cos(a)]; }
    : Travel.project;
  let OX, OY, EX, EY;
  if (POLAR) {
    const xy = pts.map((p) => PROJ(p[0], p[1])), xs = xy.map((q) => q[0]), ys = xy.map((q) => q[1]);
    const pd = (Math.max(...ys) - Math.min(...ys)) * 0.03;
    [OX, OY, EX, EY] = [Math.min(...xs) - pd, Math.min(...ys) - pd, Math.max(...xs) + pd, Math.max(...ys) + pd];
  } else {
    const lons = pts.map((p) => p[0]), lats = pts.map((p) => p[1]);
    const pad = 0.18;
    [OX, OY] = Travel.project(Math.min(...lons) - pad, Math.max(...lats) + pad);
    [EX, EY] = Travel.project(Math.max(...lons) + pad, Math.min(...lats) - pad);
  }
  const SC = 1000 / (EY - OY);
  const VW = (EX - OX) * SC, VH = 1000;
  const P = ([lon, lat]) => { const [x, y] = PROJ(lon, lat); return [(x - OX) * SC, (y - OY) * SC]; };
  // 左右多留一點海；很寬的地方（美國）少留一點，地圖才不會被縮得太小
  const PADX = VW > VH * 1.4 ? VW * 0.06 : VW * 0.25;
  const HOME_VB = [-PADX, -60, VW + PADX * 2, VH + 120];
  // 很寬的地方（加拿大、美國）整張地圖會被縮得很小，車站和火車跟著放大一點，小朋友才點得到
  const ICON = Math.min(3.2, Math.max(1, VW / VH / 1.8));
  const setVB = ([x, y, w, h]) => $('map').setAttribute('viewBox', `${x.toFixed(1)} ${y.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`);
  setVB(HOME_VB);

  // 平滑的封閉曲線
  const smooth = (list, closed = true) => {
    const p = list.map(P), n = p.length, f = (v) => v.toFixed(1);
    let d = `M${f(p[0][0])} ${f(p[0][1])}`;
    const last = closed ? n : n - 1;
    for (let i = 0; i < last; i++) {
      const p0 = closed ? p[(i - 1 + n) % n] : p[Math.max(i - 1, 0)], p1 = p[i], p2 = p[(i + 1) % n];
      const p3 = closed ? p[(i + 2) % n] : p[Math.min(i + 2, n - 1)];
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
  // 鐵路：by: 'ship' 的站要坐船過去（海上畫虛線），其他照順序連成鐵路
  const runs = [[]];
  R.stops.forEach((s, i) => { if (s.by && i > 0) runs.push([]); runs[runs.length - 1].push(s.at); });
  const railD = loop ? smooth(R.stops.map((s) => s.at)) : runs.filter((r) => r.length > 1).map((r) => smooth(r, false)).join(' ');
  const seaRoutes = R.stops.map((s, i) => {
    if (!s.by || i === 0) return '';
    const [ax, ay] = P(R.stops[i - 1].at), [bx, by] = P(s.at);
    return `<path class="sea-route" d="M${ax.toFixed(1)} ${ay.toFixed(1)} Q${((ax + bx) / 2 + (by - ay) * 0.2).toFixed(1)} ${((ay + by) / 2 - (bx - ax) * 0.2).toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)}"/>`;
  }).join('');
  /* ---------- 真的路線（lines）：照著路線開，兩站之間走最短的那條路 ----------
     lines: [{ name: '京滬高鐵', path: ['beijing', [117.0, 36.65], ..., 'shanghai'], mode?, vehicle? }]
     mode：'rail' 鐵路（預設）、'road' 公路（吉普車、露營車）、'boat' 河上或海上坐船、'air' 坐飛機（自動畫成弧線）
     vehicle：這條路線坐什麼（ART 的名字，車頭朝左）；沒寫就用 mode 的預設：鐵路 R.vehicle、公路 R.roadVehicle、船 ship、飛機 airplane
     （舊的寫法 by: 'ship' 等於 mode: 'boat'）
     path 裡的字串是車站（stops 的 id）或轉乘站（junctions 的 id），[經度, 緯度] 是讓鐵路彎得像真的那樣的中間點
     沒有 lines 的地方（台灣）照舊：環島或一條線 */
  const NODES = { ...(R.junctions || {}) };
  R.stops.forEach((s) => { NODES[s.id] = s.at; });
  const EDGES = {}; // 車站 id → [{ to, pts（經緯度）, veh（坐什麼）, len }]
  const modeOf = (l) => l.mode || (l.by === 'ship' ? 'boat' : 'rail');
  const vehOf = (l) => l.vehicle || { rail: VEHICLE, road: R.roadVehicle || 'jeep', boat: 'ship', air: 'airplane' }[modeOf(l)];
  // 坐飛機的路線：兩點之間自動加一個往上拱的中間點，畫起來和飛起來都是弧線
  const lineNodes = (l) => {
    const raw = l.path.map((n) => (typeof n === 'string' ? NODES[n] : n));
    // 南極的地圖是從正上方往下看，用經緯度算弧線會歪掉，直接畫直線
    if (modeOf(l) !== 'air' || POLAR) return l.path;
    const out = [l.path[0]];
    for (let i = 1; i < l.path.length; i++) {
      const a = raw[i - 1], b = raw[i];
      out.push([(a[0] + b[0]) / 2 - (b[1] - a[1]) * 0.22, (a[1] + b[1]) / 2 + (b[0] - a[0]) * 0.22], l.path[i]);
    }
    return out;
  };
  const plen = (pts) => pts.reduce((sum, q, i) => (i ? sum + Math.hypot(...P(q).map((v, k) => v - P(pts[i - 1])[k])) : 0), 0);
  (R.lines || []).forEach((line) => {
    let last = null, buf = [];
    lineNodes(line).forEach((n) => {
      const ll = typeof n === 'string' ? NODES[n] : n;
      if (!ll) throw new Error(`${R.id}：路線 ${line.name} 找不到 ${n}`);
      buf.push(ll);
      if (typeof n !== 'string') return;
      if (last) {
        // 飛機比較快：算最短路的時候打個折，長途的才會選飛機
        const pts = buf, veh = vehOf(line), len = plen(pts) * (modeOf(line) === 'air' ? 0.6 : 1);
        (EDGES[last] = EDGES[last] || []).push({ to: n, pts, veh, len });
        (EDGES[n] = EDGES[n] || []).push({ to: last, pts: [...pts].reverse(), veh, len });
      }
      last = n; buf = [ll];
    });
  });
  // 最短的路（Dijkstra）：回傳要經過的 [{ pts, ship }]
  function findRoute(from, to) {
    const dist = { [from]: 0 }, prev = {}, done = new Set();
    for (;;) {
      let u = null;
      for (const k in dist) if (!done.has(k) && (u === null || dist[k] < dist[u])) u = k;
      if (u === null || u === to) break;
      done.add(u);
      for (const e of EDGES[u] || []) {
        if (dist[e.to] === undefined || dist[u] + e.len < dist[e.to]) { dist[e.to] = dist[u] + e.len; prev[e.to] = { from: u, e }; }
      }
    }
    if (dist[to] === undefined) return null;
    const legs = [];
    for (let k = to; k !== from; k = prev[k].from) legs.unshift(prev[k].e);
    return legs;
  }
  const lineD = (l) => smooth(lineNodes(l).map((n) => (typeof n === 'string' ? NODES[n] : n)), false);
  const linesOf = (m) => (R.lines || []).filter((l) => modeOf(l) === m);
  const lineRail = linesOf('rail').map(lineD).join(' ');
  const lineRoad = linesOf('road').map(lineD).join(' ');
  const lineSea = linesOf('boat').map((l) => `<path class="sea-route" d="${lineD(l)}"/>`).join('') +
    linesOf('air').map((l) => `<path class="air-route" d="${lineD(l)}"/>`).join('');

  const pins = R.stops.filter((s) => s.marker).map((s) => {
    const [ax, ay] = P(s.at), [mx, my] = P(s.marker);
    return `<path class="pin" d="M${ax.toFixed(1)} ${ay.toFixed(1)} L${mx.toFixed(1)} ${my.toFixed(1)}"/><circle cx="${ax.toFixed(1)}" cy="${ay.toFixed(1)}" r="5" fill="#fff"/>`;
  }).join('');
  const stations = R.stops.map((s, i) => {
    const [x, y] = P(s.marker || s.at);
    const { art, emoji: icon } = stopIcon(s);
    return `<g class="station" data-i="${i}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${ICON.toFixed(2)})">
      <circle class="ring" r="36"/>
      ${art ? `<use href="#art-${art}" x="-30" y="-30" width="60" height="60"/>` : `<text font-size="38">${icon}</text>`}
      <text class="label" y="52">${s.zh}</text>
      <text class="check" x="28" y="-28"></text>
    </g>`;
  }).join('');

  $('world').innerHTML = `
    <rect x="-200000" y="-200000" width="400000" height="400000" fill="${R.sea}"/>${waves}
    ${POLAR ? '' : `<g transform="translate(${(-OX * SC).toFixed(1)} ${(-OY * SC).toFixed(1)}) scale(${SC.toFixed(3)})"><path d="${MAP_LAND} ${MAP_TAIWAN}" fill="${R.landFar || '#b8de95'}"/></g>`}
    ${COUNTRIES.length && !POLAR ? `<clipPath id="landClip"><path transform="translate(${(-OX * SC).toFixed(1)} ${(-OY * SC).toFixed(1)}) scale(${SC.toFixed(3)})" d="${MAP_LAND}"/></clipPath>
      <g clip-path="url(#landClip)">${COUNTRIES.flatMap((c) => c.polys.map((o) => `<path d="${smooth(o)}" fill="${c.color}" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>`)).join('')}</g>
      <g transform="translate(${(-OX * SC).toFixed(1)} ${(-OY * SC).toFixed(1)}) scale(${SC.toFixed(3)})"><path d="${MAP_LAND}" fill="none" stroke="#fff" stroke-width="${(5 / SC).toFixed(3)}"/></g>` : ''}
    ${islands.map((o) => `<path d="${smooth(o.pts || o)}" fill="#000" opacity=".15" transform="translate(4 8)"/>`).join('')}
    ${islands.map((o) => `<path d="${smooth(o.pts || o)}" fill="${(!Array.isArray(o) && o.fill) || R.land}" stroke="#fff" stroke-width="5" stroke-linejoin="round"/>`).join('')}
    ${(R.insets || []).map((b) => {
      // 小框框：離太遠放不進來的地方（夏威夷）搬到旁邊畫，用虛線框起來，跟真的地圖一樣
      const [x0, y0] = P([b.box[0], b.box[3]]), [x1, y1] = P([b.box[2], b.box[1]]);
      return `<rect class="inset" x="${x0.toFixed(1)}" y="${y0.toFixed(1)}" width="${(x1 - x0).toFixed(1)}" height="${(y1 - y0).toFixed(1)}" rx="14"/>` +
        `<text class="inset-label" x="${((x0 + x1) / 2).toFixed(1)}" y="${(y0 - 10).toFixed(1)}">${b.label}</text>`;
    }).join('')}
    ${mountains}
    ${R.lines ? lineSea : seaRoutes}
    ${R.lines && lineRoad ? `<path class="road-bed" d="${lineRoad}"/><path class="road" d="${lineRoad}"/>` : ''}
    <path class="rail-bed" d="${R.lines ? lineRail : railD}"/><path class="rail" d="${R.lines ? lineRail : railD}"/>
    ${pins}
    <g id="train"><use href="#art-${VEHICLE}" x="-44" y="-66" width="88" height="88"/></g>
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
    train.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(trainFlip * ICON).toFixed(2)} ${ICON.toFixed(2)})`);
  }
  placeTrain(P(R.stops[prog.at].at));
  // 停在要坐船才到得了的站（沖繩），就停一艘船；站自己寫了 vehicle 就停那個
  const parkAt = (i) => train.querySelector('use').setAttribute('href', `#art-${R.stops[i].vehicle || (R.stops[i].by ? 'ship' : VEHICLE)}`);
  parkAt(prog.at);

  let moving = false;
  function travel(to) {
    if (moving) return;
    const n = R.stops.length;
    if (to === prog.at) { arrive(to, false); return; }
    // 每一段切成小點，每一點記住坐什麼（換路線時換交通工具）
    const seg = [], ride = [];
    const addLeg = (pts, veh) => {
      for (let k = 0; k < pts.length - 1; k++) {
        const a = P(pts[k]), b = P(pts[k + 1]);
        for (let t = 0; t <= 1; t += 0.1) { seg.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); ride.push(veh); }
      }
    };
    const legs = R.lines ? findRoute(R.stops[prog.at].id, R.stops[to].id) : null;
    if (legs) legs.forEach((e) => addLeg(e.pts, e.veh));
    else {
      // 沒有路線網：環島就照環島的方向開；一條線的就往前或往回開
      const idx = [prog.at];
      if (loop) for (let i = prog.at; i !== to;) { i = (i + 1) % n; idx.push(i); }
      else for (let i = prog.at; i !== to;) { i += to > i ? 1 : -1; idx.push(i); }
      // by: 'ship' 的站和前一站之間坐船
      for (let k = 0; k < idx.length - 1; k++) {
        addLeg([R.stops[idx[k]].at, R.stops[idx[k + 1]].at], R.stops[Math.max(idx[k], idx[k + 1])].by && Math.abs(idx[k] - idx[k + 1]) === 1 ? 'ship' : VEHICLE);
      }
    }
    const lens = [0];
    for (let i = 1; i < seg.length; i++) lens.push(lens[i - 1] + Math.hypot(seg[i][0] - seg[i - 1][0], seg[i][1] - seg[i - 1][1]));
    // 開多久：越遠越久；換好幾種交通工具（坐船→飛機→吉普車）的話再久一點，才看得清楚
    const changes = ride.filter((v, k) => k && v !== ride[k - 1]).length;
    const total = lens[lens.length - 1], dur = Math.min(9000, Math.max(1200, total * 4) + changes * 1200);
    moving = true;
    $('stop').classList.add('hidden');
    $('hint').classList.add('hidden');
    stopSpeech();
    // 交通工具的聲音：用輕柔的「旅行版」（不叭喇叭、不鳴汽笛，小小聲），坐船、坐飛機、坐車、坐火車各一種
    const ROAD = ['jeep', 'camper-van', 'bus', 'tuk-tuk', 'car', 'taxi'];
    const soundOf = (v) => (['ship', 'sailboat'].includes(v) ? 'ride-boat' : v === 'airplane' ? 'ride-air' : ROAD.includes(v) ? 'ride-road' : 'ride-rail');
    const use = train.querySelector('use');
    let riding = null;
    const t0 = performance.now();
    const step = (now) => {
      const d = Math.min(1, (now - t0) / dur) * total;
      let i = lens.findIndex((l) => l >= d);
      if (i <= 0) i = 1;
      const r = (d - lens[i - 1]) / Math.max(1e-6, lens[i] - lens[i - 1]);
      if (ride[i] !== riding) { riding = ride[i]; use.setAttribute('href', `#art-${riding}`); Synth.play(soundOf(riding)); }
      placeTrain([seg[i - 1][0] + (seg[i][0] - seg[i - 1][0]) * r, seg[i - 1][1] + (seg[i][1] - seg[i - 1][1]) * r], seg[i][0] - seg[i - 1][0]);
      if (d < total) requestAnimationFrame(step);
      // 停下來的時候停最後坐的那個（坐露營車到烏魯魯，就停一台露營車）
      else { moving = false; use.setAttribute('href', `#art-${R.stops[to].vehicle || ride[ride.length - 1] || VEHICLE}`); arrive(to, true); }
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

  function flagSvg(f, w = 30, h = 20) {
    if (!f) return '';
    const [kind, ...c] = f;
    let body = '';
    const star5 = (x, y, r, col) => `<path d="${[...Array(10)].map((_, k) => { const a = (k * Math.PI) / 5 - Math.PI / 2, rr = k % 2 ? r * 0.42 : r; return `${k ? 'L' : 'M'}${(x + rr * Math.cos(a)).toFixed(2)} ${(y + rr * Math.sin(a)).toFixed(2)}`; }).join('')}Z" fill="${col}"/>`;
    if (kind === 'v') body = c.map((col, i) => `<rect x="${(i * 30) / c.length}" width="${30 / c.length + 0.5}" height="20" fill="${col}"/>`).join('');
    else if (kind === 'h') body = c.map((col, i) => `<rect y="${(i * 20) / c.length}" width="30" height="${20 / c.length + 0.5}" fill="${col}"/>`).join('');
    else if (kind === 'swiss') body = `<rect width="30" height="20" fill="${c[0]}"/><path d="M13 4h4v4h4v4h-4v4h-4v-4h-4v-4h4z" fill="#fff"/>`;
    // 北歐十字；有第三個顏色的話十字外面再包一圈（冰島：藍底、白邊、紅十字）
    else if (kind === 'nordic') body = `<rect width="30" height="20" fill="${c[0]}"/>${c[2] ? `<path d="M0 7h30v6H0zM8 0h6v20H8z" fill="${c[2]}"/>` : ''}<path d="M0 8h30v4H0zM9 0h4v20H9z" fill="${c[1]}"/>`;
    // 加拿大：左右紅色、中間白色，中間一片紅色楓葉（簡化）
    else if (kind === 'ca') body = '<rect width="30" height="20" fill="#fff"/><rect width="7.5" height="20" fill="#D52B1E"/><rect x="22.5" width="7.5" height="20" fill="#D52B1E"/><path d="M15 4l1.2 2.4 1.6-.6-.4 3 2-1.6.6 1.2 1.6-.2-.8 2 1 .8-3.6 2.4.4 1.4-3.2-.4V17h-.8v-2.6l-3.2.4.4-1.4-3.6-2.4 1-.8-.8-2 1.6.2.6-1.2 2 1.6-.4-3 1.6.6z" fill="#D52B1E"/>';
    // 格陵蘭：上白下紅，中間偏左一個圓，圓也是上紅下白
    else if (kind === 'gl') body = '<rect width="30" height="10" fill="#fff"/><rect y="10" width="30" height="10" fill="#D00C33"/><path d="M5 10a6 6 0 0 1 12 0z" fill="#D00C33"/><path d="M5 10a6 6 0 0 0 12 0z" fill="#fff"/>';
    // 坦尚尼亞：左上綠、右下藍，中間一條斜斜的黑色帶子（兩邊黃色）
    else if (kind === 'diag') body = `<path d="M0 0H30L0 20Z" fill="${c[0]}"/><path d="M30 0V20H0Z" fill="${c[1]}"/><path d="M0 20L30 0" stroke="#FCD116" stroke-width="9"/><path d="M0 20L30 0" stroke="#000" stroke-width="5.5"/>`;
    // 馬達加斯加：左邊白色直條，右邊上紅下綠
    else if (kind === 'mg') body = '<rect width="30" height="20" fill="#007E3A"/><rect width="30" height="10" fill="#FC3D32"/><rect width="10" height="20" fill="#fff"/>';
    // 南非（簡化）：上紅下藍，中間橫躺的綠色 Y
    else if (kind === 'za') body = '<rect width="30" height="10" fill="#E03C31"/><rect y="10" width="30" height="10" fill="#001489"/><path d="M0 0L12 10L0 20M12 10H30" fill="none" stroke="#fff" stroke-width="7"/><path d="M0 0L12 10L0 20M12 10H30" fill="none" stroke="#007749" stroke-width="4.2"/><path d="M0 3.5L7.5 10L0 16.5Z" fill="#000"/>';
    // 肯亞（簡化）：黑、紅、綠，中間有白線，再加一個盾牌
    else if (kind === 'ke') body = '<rect width="30" height="7" fill="#000"/><rect y="6.5" width="30" height="7" fill="#fff"/><rect y="7.6" width="30" height="4.8" fill="#BB0000"/><rect y="13" width="30" height="7" fill="#006600"/><ellipse cx="15" cy="10" rx="3.2" ry="6.5" fill="#BB0000" stroke="#000" stroke-width="1"/>';
    // 越南：紅底，中間一顆黃色大星星
    else if (kind === 'vn') body = '<rect width="30" height="20" fill="#DA251D"/>' + star5(15, 10.4, 6, '#FFFF00');
    // 馬來西亞（簡化）：紅白條紋，左上角深藍底、黃色月亮和星星
    else if (kind === 'my') {
      body = '<rect width="30" height="20" fill="#fff"/>' + [...Array(7)].map((_, k) => `<rect y="${(k * 20) / 7}" width="30" height="${10 / 7}" fill="#CC0001"/>`).join('');
      body += '<rect width="15" height="11.4" fill="#010066"/><circle cx="5.8" cy="5.7" r="3.8" fill="#FFCC00"/><circle cx="7" cy="5.7" r="3.2" fill="#010066"/>' + star5(11, 5.7, 2.4, '#FFCC00');
    }
    // 新加坡：上紅下白，左上角白色月亮和五顆小星星
    else if (kind === 'sg') body = '<rect width="30" height="20" fill="#fff"/><rect width="30" height="10" fill="#EF3340"/><circle cx="5.6" cy="5" r="3.4" fill="#fff"/><circle cx="6.8" cy="5" r="3.1" fill="#EF3340"/>' +
      [0, 1, 2, 3, 4].map((k) => { const a = (k * 2 * Math.PI) / 5 - Math.PI / 2; return star5(9.6 + 1.8 * Math.cos(a), 5 + 1.8 * Math.sin(a), 0.8, '#fff'); }).join('');
    // 菲律賓：上藍下紅，左邊白色三角形，裡面一個黃色太陽
    else if (kind === 'ph') body = '<rect width="30" height="10" fill="#0038A8"/><rect y="10" width="30" height="10" fill="#CE1126"/><path d="M0 0L17.3 10L0 20Z" fill="#fff"/><circle cx="5.8" cy="10" r="2.4" fill="#FCD116"/>' +
      star5(1.8, 2.6, 1, '#FCD116') + star5(1.8, 17.4, 1, '#FCD116') + star5(14.2, 10, 1, '#FCD116');
    // 澳洲：深藍色，左上角是英國國旗，下面一顆大星星，右邊是南十字星
    else if (kind === 'au') {
      const star = (x, y, r) => `<path d="${[...Array(10)].map((_, k) => { const a = (k * Math.PI) / 5 - Math.PI / 2, rr = k % 2 ? r * 0.45 : r; return `${k ? 'L' : 'M'}${(x + rr * Math.cos(a)).toFixed(1)} ${(y + rr * Math.sin(a)).toFixed(1)}`; }).join('')}Z" fill="#fff"/>`;
      body = '<rect width="30" height="20" fill="#012169"/><g transform="scale(.5)"><path d="M0 0L30 20M30 0L0 20" stroke="#fff" stroke-width="4"/><path d="M0 0L30 20M30 0L0 20" stroke="#C8102E" stroke-width="1.5"/><path d="M15 0v20M0 10h30" stroke="#fff" stroke-width="6"/><path d="M15 0v20M0 10h30" stroke="#C8102E" stroke-width="3.5"/></g>' +
        star(7.5, 15, 2.6) + star(22.5, 4, 1.4) + star(19, 9, 1.4) + star(26, 8, 1.4) + star(22.5, 16, 1.4);
    }
    // 美國：紅白條紋，左上角藍底白點（星星）
    else if (kind === 'us') {
      body = [...Array(7)].map((_, k) => `<rect y="${(k * 20) / 6.5}" width="30" height="${10 / 6.5}" fill="#B22234"/>`).join('');
      body = `<rect width="30" height="20" fill="#fff"/>${body}<rect width="13" height="10.8" fill="#3C3B6E"/>`;
      for (let y = 1.6; y < 10; y += 2.2) for (let x = 1.4; x < 13; x += 2.2) body += `<circle cx="${x}" cy="${y}" r=".55" fill="#fff"/>`;
    }
    // 巴西：綠底、黃色菱形、中間藍色圓球
    else if (kind === 'br') body = '<rect width="30" height="20" fill="#009C3B"/><path d="M15 2.5L27.5 10L15 17.5L2.5 10Z" fill="#FFDF00"/><circle cx="15" cy="10" r="4.6" fill="#002776"/><path d="M10.6 9.2Q15 7.6 19.4 10.4" stroke="#fff" stroke-width=".9" fill="none"/>';
    // 智利：上白下紅，左上角藍色方塊裡一顆白星星
    else if (kind === 'cl') body = '<rect width="30" height="20" fill="#fff"/><rect y="10" width="30" height="10" fill="#D52B1E"/><rect width="10" height="10" fill="#0039A6"/><path d="M5 2.4L6 5.6H9.2L6.6 7.5L7.6 10.6L5 8.6L2.4 10.6L3.4 7.5L.8 5.6H4Z" transform="translate(0 -.6) scale(1 .9)" fill="#fff"/>';
    // 阿根廷：淺藍、白、淺藍，中間一個黃色的太陽
    else if (kind === 'ar') body = '<rect width="30" height="20" fill="#74ACDF"/><rect y="6.7" width="30" height="6.6" fill="#fff"/><circle cx="15" cy="10" r="2.2" fill="#F6B40E"/>';
    // 印度：橘、白、綠，中間一個藍色的法輪
    else if (kind === 'in') body = '<rect width="30" height="6.7" fill="#FF9933"/><rect y="6.6" width="30" height="6.8" fill="#fff"/><rect y="13.3" width="30" height="6.7" fill="#138808"/><circle cx="15" cy="10" r="2.6" fill="none" stroke="#000080" stroke-width=".7"/><circle cx="15" cy="10" r=".6" fill="#000080"/>';
    // 韓國（簡化）：白底，中間上紅下藍的太極圓，四個角落各有一組黑色的卦
    else if (kind === 'kr') {
      const bars = (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-2.6" y="-2" width="5.2" height=".9" fill="#000"/><rect x="-2.6" y="-.45" width="5.2" height=".9" fill="#000"/><rect x="-2.6" y="1.1" width="5.2" height=".9" fill="#000"/></g>`;
      body = '<rect width="30" height="20" fill="#fff"/><circle cx="15" cy="10" r="5" fill="#0047A0"/><path d="M10 10a5 5 0 0 1 10 0a2.5 2.5 0 0 1 -5 0a2.5 2.5 0 0 0 -5 0z" fill="#CD2E3A"/>' +
        bars(6, 4.4, -56) + bars(24, 4.4, 56) + bars(6, 15.6, 56) + bars(24, 15.6, -56);
    }
    // 紐西蘭：深藍色，左上角是英國國旗，右邊四顆白邊的紅星星（南十字星）
    else if (kind === 'nz') {
      const star = (x, y, r, fill) => `<path d="${[...Array(10)].map((_, k) => { const a = (k * Math.PI) / 5 - Math.PI / 2, rr = k % 2 ? r * 0.45 : r; return `${k ? 'L' : 'M'}${(x + rr * Math.cos(a)).toFixed(1)} ${(y + rr * Math.sin(a)).toFixed(1)}`; }).join('')}Z" fill="${fill}"/>`;
      const red = (x, y, r) => star(x, y, r + 0.5, '#fff') + star(x, y, r, '#C8102E');
      body = '<rect width="30" height="20" fill="#012169"/><g transform="scale(.5)"><path d="M0 0L30 20M30 0L0 20" stroke="#fff" stroke-width="4"/><path d="M0 0L30 20M30 0L0 20" stroke="#C8102E" stroke-width="1.5"/><path d="M15 0v20M0 10h30" stroke="#fff" stroke-width="6"/><path d="M15 0v20M0 10h30" stroke="#C8102E" stroke-width="3.5"/></g>' +
        red(22.5, 4.5, 1.5) + red(19, 9.5, 1.5) + red(26, 8.5, 1.3) + red(22.5, 16, 1.7);
    }
    // 哈薩克：天藍色，中間一個金色的太陽（簡化，沒畫老鷹）
    else if (kind === 'kz') body = '<rect width="30" height="20" fill="#00AFCA"/><circle cx="15" cy="9" r="3.4" fill="#FEC50C"/>' +
      [...Array(16)].map((_, k) => { const a = (k * Math.PI) / 8; return `<path d="M${(15 + 4 * Math.cos(a)).toFixed(1)} ${(9 + 4 * Math.sin(a)).toFixed(1)}L${(15 + 5.6 * Math.cos(a)).toFixed(1)} ${(9 + 5.6 * Math.sin(a)).toFixed(1)}" stroke="#FEC50C" stroke-width=".8"/>`; }).join('') +
      '<rect x="1.5" y="1" width="1.6" height="18" fill="#FEC50C" opacity=".8"/>';
    // 吉爾吉斯：紅底，中間一個黃色的太陽
    else if (kind === 'kg') body = '<rect width="30" height="20" fill="#E8112D"/>' +
      [...Array(20)].map((_, k) => { const a = (k * Math.PI) / 10; return `<path d="M15 10L${(15 + 6.2 * Math.cos(a)).toFixed(1)} ${(10 + 6.2 * Math.sin(a)).toFixed(1)}" stroke="#FFEF00" stroke-width="1.1"/>`; }).join('') +
      '<circle cx="15" cy="10" r="3.6" fill="#FFEF00"/><circle cx="15" cy="10" r="2.4" fill="#E8112D"/>';
    else if (kind === 'uk') body = '<rect width="30" height="20" fill="#012169"/><path d="M0 0L30 20M30 0L0 20" stroke="#fff" stroke-width="4"/><path d="M0 0L30 20M30 0L0 20" stroke="#C8102E" stroke-width="1.5"/><path d="M15 0v20M0 10h30" stroke="#fff" stroke-width="6"/><path d="M15 0v20M0 10h30" stroke="#C8102E" stroke-width="3.5"/>';
    return `<svg class="flag" viewBox="0 0 30 20" width="${w}" height="${h}">${body}</svg>`;
  }
  const zhChip = (s) => `<button class="name-chip zh" data-lang="zh"><span class="tag">中文</span><b>${s.zh}</b></button>`;
  const enChip = (s) => `<button class="name-chip en" data-lang="en"><span class="tag">English</span><b>${s.en}</b></button>`;
  const twChip = (s) => `<button class="name-chip tw" data-lang="tw"><span class="tag">台語</span><b>${s.tw}</b><small>${s.twRom}</small></button>`;
  const jaChip = (s) => `<button class="name-chip ja" data-lang="ja"><span class="tag">日本語</span><b>${s.ja}</b><small>${s.jaRom}</small></button>`;
  // 歐洲：這一站是哪一國（國旗＋國名），用當地的語言打招呼、唸站名
  const localChip = (s) => { const c = countryOf(s); return c ? `<button class="name-chip local" data-lang="local"><span class="tag">${flagSvg(c.flag, 22, 15)} ${c.zh}</span><b>${s.hello || c.hello}!</b><small>${s.local || ''}</small></button>` : ''; };
  const chip3 = (s) => (LANG3 === 'ja' ? jaChip(s) : LANG3 === 'tw' ? twChip(s) : LANG3 === 'local' ? localChip(s) : '');
  let curStop = null; // 現在這一站（歐洲的東西要知道是哪一國的語言）
  const line3 = (it) => (LANG3 === 'local' ? (it.local ? `<span class="local">${it.local}</span>` : '') : LANG3 === 'ja' ? `<span class="ja">${it.ja}<br><small>${it.jaRom}</small></span>` : LANG3 === 'tw' ? `<span class="tw">${it.tw}<br><small>${it.twRom}</small></span>` : '');

  function showStop(s, stamp) {
    curStop = s;
    $('stopStamp').textContent = stamp ? '🎫' : '🚉';
    $('stopStamp').style.animation = 'none'; void $('stopStamp').offsetWidth; $('stopStamp').style.animation = '';
    $('stopNames').innerHTML = zhChip(s) + enChip(s) + chip3(s);
    $('stopNames').querySelectorAll('.name-chip').forEach((b) => b.addEventListener('click', () => sayIn(s, b.dataset.lang)));
    $('stopItems').innerHTML = '';
    $('stopFact').classList.add('hidden');
    s.items.forEach((it) => {
      const c = document.createElement('button');
      c.className = 'item';
      c.innerHTML = (it.art ? `<svg viewBox="-50 -50 100 100"><use href="#art-${it.art}" x="-50" y="-50" width="100" height="100"/></svg>` : `<span class="emoji">${it.emoji}</span>`) +
        `<b>${it.zh}</b><span class="en">${it.en}</span>${line3(it)}`;
      c.addEventListener('click', () => {
        c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop');
        if (it.fact) { $('stopFact').textContent = `💡 ${it.fact}`; $('stopFact').classList.remove('hidden'); }
        sayItem(it);
      });
      $('stopItems').append(c);
    });
    $('stop').classList.remove('hidden');
    if (stamp) confetti();
    // 到站廣播：「臺中到了！」＋英文（日本再加日文站名）
    const c = countryOf(s);
    sayLines([[`${s.zh}到了！`, 'zh-TW'], [s.en, 'en-US'], ...(LANG3 === 'ja' ? [[s.ja, 'ja-JP']] : []), ...(LANG3 === 'local' && c ? [[`${s.hello || c.hello}! ${s.local || ''}`, s.lang || c.lang]] : [])]);
  }

  /* ---------- 說話：中文、英文用系統語音；台語用家長錄音（錄音室的 key：<id>_tw）；日語用系統的日文語音 ---------- */
  let voices = [];
  const loadVoices = () => { voices = 'speechSynthesis' in window ? speechSynthesis.getVoices() : []; };
  if ('speechSynthesis' in window) { loadVoices(); speechSynthesis.addEventListener('voiceschanged', loadVoices); }
  function speak(text, lang) {
    // 預先生成的語音（voice-clips.js）優先，沒有才用系統語音
    const clip = VoiceClips.url(text, lang);
    if (clip) return playRec(clip);
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) return resolve();
      const norm = (x) => x.lang.replace('_', '-').toLowerCase(), base = lang.split('-')[0].toLowerCase();
      const v = voices.find((x) => norm(x) === lang.toLowerCase()) || voices.find((x) => norm(x).startsWith(base));
      // 這台機器根本沒有這種語言的聲音（例如只裝了中文語音的電腦唸日文）：瀏覽器會拿中文的聲音硬唸，漢字變成中文、假名唸不出來，
      // 乾脆跳過不唸；中文、英文不跳過（中文的聲音唸英文單字還可以）
      if (!v && voices.length && !['zh', 'en'].includes(base)) return resolve();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang; u.rate = 0.85; u.pitch = 1.1;
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
  // 這一站自己的語言（加拿大的魁北克說法文：stop.lang、stop.hello）優先，沒有就用那一國的
  const localLang = () => (curStop && curStop.lang) || (countryOf(curStop || {}) || {}).lang || 'en-US';
  const line3Say = (x) => (LANG3 === 'local' ? (x.local ? [[x.local, localLang()]] : []) : LANG3 === 'ja' ? [[x.ja, 'ja-JP']] : LANG3 === 'tw' ? twLine(x) : []);
  function sayIn(s, lang) {
    if (lang === 'zh') sayLines([[s.zh, 'zh-TW']]);
    else if (lang === 'en') sayLines([[s.en, 'en-US']]);
    else if (lang === 'ja') sayLines([[s.ja, 'ja-JP']]);
    else if (lang === 'local') { const c = countryOf(s); if (c) sayLines([[`這裡是${c.zh}`, 'zh-TW'], [`${s.hello || c.hello}! ${s.local || ''}`, s.lang || c.lang]]); }
    else sayLines(twLine(s).length ? twLine(s) : [[`台語唸作：${s.twRom}`, 'zh-TW']]);
  }
  function sayItem(it) {
    sayLines([[it.zh, 'zh-TW'], [it.en, 'en-US'], ...line3Say(it), ...(it.fact ? [[it.fact, 'zh-TW']] : [])]);
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
    if (prog.visited.length === R.stops.length) { confetti(); sayLines([[R.doneSay || '環島成功！你好厲害！', 'zh-TW']]); }
  }
  $('passBtn').addEventListener('click', openPass);
  $('passClose').addEventListener('click', () => $('pass').classList.add('hidden'));

  /* ---------- 操作 ---------- */
  $('stations').addEventListener('click', (e) => {
    const g = e.target.closest('.station');
    if (g) travel(Number(g.dataset.i));
  });
  // 下一站：一條線的開到最後一站以後，從頭再開一次
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
  if (LANG3 === 'tw') Recs.load(['_tw']);
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
    const bw = Math.max(x1 - x0, 12), bh = Math.max(y1 - y0, 12);
    // 小地圖的範圍：至少看得到附近幾個國家；地方很大（非洲）就再拉遠一點，紅框才放得下
    const w = Math.max(300, bw * 1.6, bh * 1.6 * (156 / 100)), h = w * (100 / 156);
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
    // 「坐飛機回世界地圖」還沒唸完的話，等它唸完再換頁
    if (typeof VoiceUI !== 'undefined' && VoiceUI.enabled()) await VoiceUI.waitDone();
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
      Travel.say(Travel.welcomeText(t)); // 「歡迎來到日本！」
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
