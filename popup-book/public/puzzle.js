// 🧩 拼拼看：把這一頁的一台車切成 4 塊拼圖，拖回中間的灰色影子裡，拼好了就唸名字、動起來
// 拼圖塊用車子原本的圖（it.art）各裁一塊，所以每一頁都不用另外準備圖；focus: false 的東西（臉上的五官、錘球吊車）不拿來拼
// 畫在書本上面的一層 <svg class="puzzle">，座標跟場景一樣（scene.w × scene.h）
{
const COLS = 2, ROWS = 2;
const canPuzzle = (scene) => scene.items.filter((it) => it.focus !== false);
let last = null; // 上一台拼的車，下一台換別的

// 兩點之間的一段拼圖邊：中間凸出一個半圓的小耳朵（dir = 1 往左手邊凸，-1 往右手邊凸，0 直線）
function edge([x0, y0], [x1, y1], r, dir) {
  if (!dir) return [[x1, y1]];
  const len = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / len, uy = (y1 - y0) / len;
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, nx = uy * dir, ny = -ux * dir;
  const pts = [[mx - ux * r, my - uy * r]];
  for (let i = 1; i <= 10; i++) {
    const a = Math.PI * (i / 10); // 從耳朵的一邊繞半圈到另一邊
    pts.push([mx - ux * r * Math.cos(a) + nx * r * Math.sin(a), my - uy * r * Math.cos(a) + ny * r * Math.sin(a)]);
  }
  pts.push([x1, y1]);
  return pts;
}

// 把車子的外框 b 切成 COLS × ROWS 塊；回傳每一塊的外形（區域座標）和中心點
// 外圍那幾邊往外多留 pad，車子超出外框一點點的地方（例如噴出來的煙）才不會被切掉
function cutPieces(b, pad) {
  const xs = [b.x - pad], ys = [b.y - pad];
  for (let i = 1; i < COLS; i++) xs.push(b.x + (b.width * i) / COLS);
  for (let j = 1; j < ROWS; j++) ys.push(b.y + (b.height * j) / ROWS);
  xs.push(b.x + b.width + pad); ys.push(b.y + b.height + pad);
  const r = Math.min(b.width / COLS, b.height / ROWS) * 0.13;
  // 每條內部切線上的耳朵方向（隨機凸向左／右、上／下），相鄰兩塊共用同一條邊才會剛好吻合
  const vDir = xs.map(() => ys.map(() => (Math.random() < 0.5 ? 1 : -1)));
  const hDir = ys.map(() => xs.map(() => (Math.random() < 0.5 ? 1 : -1)));
  const out = [];
  for (let j = 0; j < ROWS; j++) {
    for (let i = 0; i < COLS; i++) {
      const tl = [xs[i], ys[j]], tr = [xs[i + 1], ys[j]], br = [xs[i + 1], ys[j + 1]], bl = [xs[i], ys[j + 1]];
      const pts = [tl,
        ...edge(tl, tr, r, j > 0 ? hDir[j][i] : 0),          // 上邊（往右走）
        ...edge(tr, br, r, i < COLS - 1 ? vDir[i + 1][j] : 0), // 右邊（往下走）
        ...edge(br, bl, r, j < ROWS - 1 ? -hDir[j + 1][i] : 0), // 下邊（往左走，方向要反過來）
        ...edge(bl, tl, r, i > 0 ? -vDir[i][j] : 0)];          // 左邊（往上走）
      const cx = (Math.max(xs[i], b.x) + Math.min(xs[i + 1], b.x + b.width)) / 2;
      const cy = (Math.max(ys[j], b.y) + Math.min(ys[j + 1], b.y + b.height)) / 2;
      out.push({ d: 'M' + pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join('L') + 'Z', cx, cy });
    }
  }
  return out;
}

// 卡一聲：拼圖塊放對位置
function snapSound() {
  const c = audioCtx();
  if (!c) return;
  const t0 = c.currentTime + 0.01;
  const osc = c.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(900, t0);
  osc.frequency.exponentialRampToValueAtTime(500, t0 + 0.09);
  const g = c.createGain();
  g.gain.setValueAtTime(0.25, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.12);
  osc.connect(g).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + 0.15);
}

// it.puzzle = { hide: 'CSS 選擇器', box: [x, y, 寬, 高] }：拼圖時藏起來的東西（例如消防車帶著的那塊著火公寓）和拼圖的範圍
// 只是藏起來（display: none）不刪掉，拼好以後動作裡還找得到那些零件
function hideExtras(it, el) {
  const sel = it.puzzle && it.puzzle.hide;
  if (sel) el.querySelectorAll(sel).forEach((e) => { e.style.display = 'none'; });
  return el;
}

function closePuzzle() {
  const old = document.querySelector('.puzzle');
  if (old) { old._off?.(); old.remove(); }
  stopClips();
}

function startPuzzle(scene) {
  closePuzzle();
  const pool = canPuzzle(scene);
  if (!pool.length) return;
  const choices = pool.length > 1 ? pool.filter((it) => it !== last) : pool;
  const it = choices[Math.floor(Math.random() * choices.length)];
  last = it;
  const W = scene.w, H = scene.h;

  const wrap = document.createElement('div');
  wrap.className = 'puzzle';
  wrap.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="pz-flat" x="-5%" y="-5%" width="110%" height="110%">
          <feFlood flood-color="#7d7591"/><feComposite operator="in" in2="SourceAlpha"/>
        </filter>
        <filter id="pz-white"><feFlood flood-color="#fff"/><feComposite operator="in" in2="SourceAlpha"/></filter>
        <filter id="pz-lift" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="#2d2a3a" flood-opacity=".35"/>
        </filter>
      </defs>
      <rect width="${W}" height="${H}" fill="#fff8e6" opacity=".96"/>
      <g id="pz-measure" opacity="0">${it.art(it.id)}</g>
      <g id="pz-target"></g>
      <g id="pz-done"></g>
      <g id="pz-pieces"></g>
      <g id="pz-fx"></g>
    </svg>
    <button class="round pz-close" aria-label="不拼了">✖</button>
    <button class="round pz-next hidden" aria-label="再拼一台">🧩</button>`;
  document.querySelector('.book').appendChild(wrap);
  wrap.querySelector('.pz-close').onclick = closePuzzle;
  wrap.querySelector('.pz-next').onclick = () => startPuzzle(scene);

  const svg = wrap.querySelector('svg');
  const measure = svg.querySelector('#pz-measure');
  // 拼圖的範圍：車子圖的外框。it.box（焦點模式用的放大範圍）有的比車子大（例如要看得到噴出去的水霧），
  // 有的是因為 getBBox 算太大（藏起來的零件也算進去）才設的，所以取兩個的交集
  hideExtras(it, measure);
  let b = measure.getBBox();
  if (it.puzzle && it.puzzle.box) {
    const [x, y, w, h] = it.puzzle.box;
    b = { x, y, width: w, height: h };
  } else if (it.box) {
    const [x, y, w, h] = it.box;
    const x0 = Math.max(b.x, x), y0 = Math.max(b.y, y);
    const x1 = Math.min(b.x + b.width, x + w), y1 = Math.min(b.y + b.height, y + h);
    if (x1 > x0 && y1 > y0) b = { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
  }
  measure.remove();
  // 影子放在中間偏下，左右留位置放打散的拼圖塊
  const s = Math.min((W * 0.5) / b.width, (H * 0.56) / b.height);
  const cx = W / 2, cy = H * 0.55;
  const place = `translate(${cx} ${cy}) scale(${s}) translate(${-(b.x + b.width / 2)} ${-(b.y + b.height / 2)})`;
  const toScene = (x, y) => [cx + s * (x - b.x - b.width / 2), cy + s * (y - b.y - b.height / 2)];
  const pieces = cutPieces(b, Math.max(b.width, b.height) * 0.3);

  // 灰色影子＋每一塊的虛線輪廓（只畫在車子的形狀裡面）
  const target = svg.querySelector('#pz-target');
  target.innerHTML = `<g transform="${place}">
    <mask id="pz-shape" maskUnits="userSpaceOnUse" x="-99999" y="-99999" width="199998" height="199998">
      <g filter="url(#pz-white)">${it.art(it.id)}</g>
    </mask>
    <g filter="url(#pz-flat)" opacity=".35">${it.art(it.id)}</g>
    <g mask="url(#pz-shape)" fill="none" stroke="#fff" stroke-width="${3 / s}" stroke-dasharray="${10 / s} ${8 / s}">
      ${pieces.map((p) => `<path d="${p.d}"/>`).join('')}
    </g>
  </g>`;
  hideExtras(it, target);

  // 拼圖塊：同一張車子的圖，各自裁成一塊；dx、dy 是離正確位置多遠
  // 每塊墊一層幾乎透明的底（只到車子外框為止），車子空隙的地方也拿得起來
  const layer = svg.querySelector('#pz-pieces');
  const slots = [[0.14, 0.3], [0.86, 0.3], [0.14, 0.76], [0.86, 0.76], [0.5, 0.16], [0.5, 0.9]]
    .slice(0, pieces.length).sort(() => Math.random() - 0.5);
  const state = pieces.map((p, i) => {
    const [hx, hy] = toScene(p.cx, p.cy);
    const g = document.createElementNS(SVGNS, 'g');
    g.setAttribute('class', 'pz-piece');
    g.setAttribute('filter', 'url(#pz-lift)');
    g.innerHTML = `<clipPath id="pz-clip${i}"><path d="${p.d}"/></clipPath>
      <g transform="${place}"><g clip-path="url(#pz-clip${i})">
        <rect x="${b.x}" y="${b.y}" width="${b.width}" height="${b.height}" fill="#fff" opacity=".01"/>${it.art(it.id)}
      </g></g>`;
    layer.appendChild(g);
    hideExtras(it, g);
    if (it.setup) it.setup(makeCtx(it, g, { burst() {} })); // 一開始藏起來的零件（例如放下的吊籃）也要先藏好
    const st = { g, hx, hy, dx: slots[i][0] * W - hx, dy: slots[i][1] * H - hy, r: (Math.random() - 0.5) * 24, done: false };
    g._pz = st; // 方便除錯時查每一塊的位置
    draw(st);
    return st;
  });
  function draw(st) {
    st.g.setAttribute('transform', `translate(${st.dx} ${st.dy}) rotate(${st.r} ${st.hx} ${st.hy})`);
  }

  // 拖拉：拿起來轉正，放開時離正確位置夠近就吸進去
  const toSvg = (e) => new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.getScreenCTM().inverse());
  let drag = null;
  state.forEach((st) => {
    st.g.addEventListener('pointerdown', (e) => {
      if (st.done || drag) return;
      e.preventDefault();
      layer.appendChild(st.g); // 拿起來的那塊放到最上面
      const p = toSvg(e);
      drag = { st, id: e.pointerId, x: p.x - st.dx, y: p.y - st.dy };
      tween(150, (t) => { st.r *= 1 - t; draw(st); });
    });
  });
  // 移動和放開掛在整個視窗上：手指拖太快離開拼圖塊也追得到
  const move = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const p = toSvg(e);
    drag.st.dx = p.x - drag.x;
    drag.st.dy = p.y - drag.y;
    draw(drag.st);
  };
  const drop = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const st = drag.st;
    drag = null;
    st.r = 0;
    if (Math.hypot(st.dx, st.dy) < W * 0.07) snap(st);
  };
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', drop);
  window.addEventListener('pointercancel', drop);
  wrap._off = () => {
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', drop);
    window.removeEventListener('pointercancel', drop);
  };

  async function snap(st) {
    st.done = true;
    st.g.removeAttribute('filter');
    st.g.classList.add('placed');
    layer.insertBefore(st.g, layer.firstChild); // 放好的塊壓在還沒放的下面
    snapSound();
    const x0 = st.dx, y0 = st.dy;
    await tween(180, (t) => { st.dx = x0 * (1 - t); st.dy = y0 * (1 - t); draw(st); });
    if (state.every((o) => o.done)) finish();
  }

  // 全部拼好：換成一整台完整的車，唸名字、撒彩色紙片，然後動起來
  async function finish() {
    await wait(200);
    layer.remove();
    target.remove();
    const done = svg.querySelector('#pz-done');
    done.innerHTML = `<g transform="${place}">${it.art(it.id)}</g>
      <text x="${W / 2}" y="${H * 0.13}" class="pz-name">${it.en}</text>
      <text x="${W / 2}" y="${H * 0.13 + 50}" class="pz-name zh">${it.zh}</text>`;
    const fx = makeFx(svg.querySelector('#pz-fx'));
    const car = hideExtras(it, done.firstElementChild);
    const c = makeCtx(it, car, fx);
    if (it.setup) it.setup(c);
    speak(it.en);
    playTune([[0, 72], [0.5, 76], [1, 79], [1.5, 84]], 240, 1);
    const fxEl = svg.querySelector('#pz-fx');
    ['#ff5a5f', '#ffcf3f', '#4cc38a', '#3b82f6', '#c084fc'].forEach((color) =>
      fx.burst(fxEl, W / 2, H * 0.3, { n: 8, color, vx: [-9, 9], vy: [-12, -3], g: 0.4, size: [6, 11], life: 1400 }));
    await wait(900);
    try { await it.act(c); } catch (err) { console.error(err); }
    wrap.querySelector('.pz-next')?.classList.remove('hidden');
  }
}

// 上方列的 🧩 按鈕（app.js 畫場景的時候放的）
document.addEventListener('click', (e) => {
  if (!e.target.closest('#puzzleBtn') || !shown || !shown.page) return;
  startPuzzle(SCENES[shown.page.id]);
});
// 換頁時把拼圖收掉
window.addEventListener('hashchange', closePuzzle);
}
