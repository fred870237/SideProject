// ✈️ 主世界地圖的旅行模式（只有 index.html 用，要放在 app.js 後面載入，會用到 app.js 的 world、view、applyView、toast…）
// 按 ✈️ 旅行：動物變淡，地圖上出現可以去的地方（台灣環島、日本、中國、歐洲）
// 點一個地方：飛機從家（台北）沿著弧線飛過去 → 畫面一路放大到那一塊 → 飛進雲裡 → 換到那裡的環遊地圖（region.html）
// 從環遊地圖回來（index.html?back=<id>）：從雲裡出來 → 畫面從那一塊縮小回整張世界地圖 → 飛機飛回家
(() => {
  if (typeof CITY !== 'undefined' && CITY) return;
  const P = (ll) => Travel.project(ll[0], ll[1]);
  const home = P(Travel.HOME);

  /* ---------- 畫出可以去的地方 ---------- */
  function tripsHtml() {
    const pins = Travel.TRIPS.map((t) => {
      const [x, y] = P(t.at);
      const { done, total } = Travel.progress(t.id);
      const sub = t.ready ? (total ? `⭐ ${done}/${total}` : '') : '敬請期待';
      return `<g class="trip ${t.ready ? '' : 'soon'}" data-region="${t.id}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">
        <circle class="ripple" r="17"/><circle class="disc" r="17"/>
        <text class="ico">${t.icon}</text>
        <text class="name" y="27">${t.zh}</text>
        <text class="${t.ready ? 'stars' : 'sub'}" y="39">${sub}</text>
      </g>`;
    }).join('');
    return `<g class="home-mark" transform="translate(${home[0].toFixed(1)} ${(home[1] - 24).toFixed(1)})"><text>🏠</text></g>` +
      pins + '<path id="planeTrail"/><g id="puffs"></g><g id="plane" opacity="0"></g>';
  }
  const layer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  layer.id = 'trips';
  world.append(layer);
  const draw = () => { layer.innerHTML = tripsHtml(); $('#plane').innerHTML = Travel.PLANE; };
  draw();

  /* ---------- 進入 / 離開旅行模式 ---------- */
  const btn = $('#travelBtn');
  const hint = document.createElement('div');
  hint.className = 'travel-hint hidden';
  hint.innerHTML = '✈️ 要去哪裡玩？點一個地方！<button aria-label="不去了" data-say="不去了">✕</button>';
  $('.map-wrap').append(hint);
  function setTravel(on) {
    world.classList.toggle('travel', on);
    btn.classList.toggle('on', on);
    hint.classList.toggle('hidden', !on);
    $('#hint').classList.add('hidden');
    if (on) { $('#card').classList.add('hidden'); draw(); }
  }
  btn.addEventListener('click', () => { if (!flying) setTravel(!world.classList.contains('travel')); });
  hint.querySelector('button').addEventListener('click', () => setTravel(false));

  /* ---------- 畫面：放大到超過平常的上限（飛進一個國家要放大很多倍） ---------- */
  const setRaw = (s, cx, cy) => {
    // 讓地圖座標 (cx, cy) 在畫面正中間，放大 s 倍
    view.s = s; view.x = MAP_W / 2 - cx * s; view.y = MAP_H / 2 - cy * s;
    world.setAttribute('transform', `translate(${view.x} ${view.y}) scale(${s})`);
  };
  const center = () => [(MAP_W / 2 - view.x) / view.s, (MAP_H / 2 - view.y) / view.s];
  // 從現在的畫面慢慢移到 (s, cx, cy)；放大倍數用等比的方式變，放很大的時候才不會一下子衝過去
  function camera(s1, c1, ms, onStep) {
    const s0 = view.s, c0 = center(), t0 = performance.now();
    return new Promise((resolve) => {
      const step = (now) => {
        const k = Math.min(1, (now - t0) / ms), e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
        const s = s0 * (s1 / s0) ** e;
        // 放大時：要去的地方（c1）在畫面上平平地滑到正中間，不會先晃到別的地方
        // 縮小時反過來：出發的地方（c0）從正中間平平地滑開
        const c = s1 >= s0
          ? c1.map((v, i) => v - (1 - e) * (v - c0[i]) * (s0 / s))
          : c0.map((v, i) => v - e * (v - c1[i]) * (s1 / s));
        setRaw(s, c[0], c[1]);
        if (onStep) onStep(e);
        if (k < 1) requestAnimationFrame(step); else resolve();
      };
      requestAnimationFrame(step);
    });
  }
  // 放大到剛好看得到這個地方
  function fitTrip(t) {
    const [x0, y0, x1, y1] = Travel.frame(t);
    return { s: Math.min(MAP_W / (x1 - x0), MAP_H / (y1 - y0)) * 0.85, c: [(x0 + x1) / 2, (y0 + y1) / 2] };
  }

  /* ---------- 飛機沿著弧線飛 ---------- */
  function route(a, b) {
    const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy);
    if (d < 12) {
      // 太近了（台灣環島就在家旁邊）：繞一個小圈再降落
      const r = 16, c = [b[0], b[1] - r];
      return (t) => {
        const ang = Math.PI / 2 - t * Math.PI * 2;
        return [c[0] + r * Math.cos(ang) * (1 - t * 0.3), c[1] + r * Math.sin(ang)];
      };
    }
    // 弧線：中間往上拱起來
    const ctl = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - d * 0.35];
    return (t) => [
      (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * ctl[0] + t * t * b[0],
      (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * ctl[1] + t * t * b[1],
    ];
  }
  function fly(a, b, ms) {
    const at = route(a, b), plane = $('#plane'), trail = $('#planeTrail'), puffs = $('#puffs');
    const pts = [];
    let last = 0;
    plane.setAttribute('opacity', '1');
    puffs.innerHTML = '';
    Synth.play('airplane');
    const t0 = performance.now();
    return new Promise((resolve) => {
      const step = (now) => {
        const k = Math.min(1, (now - t0) / ms), t = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
        const p = at(t), q = at(Math.min(1, t + 0.01)), p0 = at(Math.max(0, t - 0.01));
        const ang = (Math.atan2(q[1] - p0[1], q[0] - p0[0]) * 180) / Math.PI;
        // 起飛時變大一點、降落時變小（看起來像飛高再降下來），大小不跟著畫面放大
        const size = (0.3 + 0.18 * Math.sin(Math.PI * t)) / view.s;
        const flip = Math.abs(ang) > 90 ? -1 : 1; // 往左飛時把飛機翻過來，才不會頭下腳上
        plane.setAttribute('transform', `translate(${p[0].toFixed(2)} ${p[1].toFixed(2)}) rotate(${ang.toFixed(1)}) scale(${size} ${size * flip})`);
        pts.push(p);
        trail.setAttribute('d', 'M' + pts.map((v) => v.map((n) => n.toFixed(2)).join(' ')).join(' L'));
        if (now - last > 120 && k < 0.95) { last = now; puffs.insertAdjacentHTML('beforeend', Travel.puff(p[0], p[1], 5 / view.s)); }
        if (k < 1) requestAnimationFrame(step); else resolve();
      };
      requestAnimationFrame(step);
    });
  }

  /* ---------- 點一個地方：飛過去 ---------- */
  let flying = false;
  async function flyTo(id) {
    const t = Travel.trip(id);
    if (!t || flying) return;
    if (!t.ready) { setTravel(true); toast(`${t.icon} ${t.zh}：敬請期待！`); return; }
    flying = true;
    setTravel(true);
    hint.classList.add('hidden');
    await camera(1, [MAP_W / 2, MAP_H / 2], 400);
    await fly(home, P(t.at), Math.hypot(...[0, 1].map((i) => P(t.at)[i] - home[i])) < 12 ? 1800 : 2600);
    // 一路放大到那一塊，最後飛進雲裡
    world.classList.add('flying');
    const { s, c } = fitTrip(t);
    let covered = false;
    await camera(s, c, 1500, (e) => {
      $('#plane').setAttribute('opacity', String(Math.max(0, 1 - e * 2)));
      if (e > 0.6 && !covered) { covered = true; Travel.cloudsIn(); }
    });
    await Travel.wait(300);
    Travel.setFlight(id, 'in');
    location.href = `region.html?r=${id}&fly=1`;
  }
  window.flyTo = flyTo; // app.js 點到「台灣」標籤時也會呼叫

  /* ---------- 從環遊地圖飛回來 ---------- */
  async function welcomeBack(id) {
    const t = Travel.trip(id);
    if (!t) return;
    flying = true;
    setTravel(true);
    hint.classList.add('hidden');
    world.classList.add('flying');
    const { s, c } = fitTrip(t);
    setRaw(s, c[0], c[1]);
    await Travel.cloudsOut();
    await camera(1, [MAP_W / 2, MAP_H / 2], 1500);
    world.classList.remove('flying');
    applyView();
    await fly(P(t.at), home, Math.hypot(...[0, 1].map((i) => P(t.at)[i] - home[i])) < 12 ? 1500 : 2400);
    await Travel.wait(400);
    $('#plane').setAttribute('opacity', '0');
    $('#planeTrail').setAttribute('d', '');
    flying = false;
    hint.classList.remove('hidden');
  }
  const back = new URLSearchParams(location.search).get('back');
  if (back) {
    history.replaceState(null, '', location.pathname);
    if (Travel.takeFlight('out')) welcomeBack(back);
    else setTravel(true);
  }
})();
