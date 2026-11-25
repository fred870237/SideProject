// 🔍 找找看：旁白問「Where is the Fire Engine?」，小朋友在書頁上找到那台點下去，那台就照平常一樣唸名字、動起來
// 點錯了說「Try again!」，點錯兩次就在答案外面畫一個會閃的圈圈提示；這一頁全部找完就撒彩色紙片
// 上方列的 🔍 按鈕是 app.js 畫場景時放的；車子被點到的時候 app.js 會先問 Find.tap()，答錯的那一下就不表演
{
let game = null; // { scene, order: [item…], i, misses, done }

const $ = (sel) => document.querySelector(sel);
const shuffle = (arr) => arr.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((p) => p[1]);
const busy = () => !!document.querySelector('.item[data-busy]');

// 問法：一般「Where is the …?」，複數「Where are the …?」，動作（五種感覺、好習慣）「Can you find …?」
const PLURAL = new Set(['Eyes', 'Cheeks', 'Eyebrows', 'Ears', 'Arms', 'Hands', 'Legs', 'Feet', 'Lungs', 'Intestines', 'Teeth', 'Sweets']);
const ACTION = new Set(['See', 'Hear', 'Smell', 'Taste', 'Touch', 'Brush Your Teeth',
  'Sleep', 'Use the Toilet', 'Exercise', 'Drink Water', 'Wash Your Hands', 'Eat Vegetables']);
const lead = (it) => (ACTION.has(it.en) ? 'Can you find' : PLURAL.has(it.en) ? 'Where are the' : 'Where is the');

// 開頭那幾個字有預先生成的語音就跟名字接起來播，沒有就整句用瀏覽器語音唸
function ask() {
  const it = game.order[game.i];
  const l = lead(it);
  if (recorded.has(voiceSlug(l))) {
    speak(l);
    speak(it.en, { queue: true });
  } else {
    speak(`${l} ${it.en}?`);
  }
}

// found = true：剛找到、車子還在表演，先顯示「找到了」，表演完問下一台的時候才換題目
function render(found = false) {
  const it = game.order[game.i];
  const bar = $('#findBar');
  bar.querySelector('.find-q').innerHTML = found ? '🎉 You found it!<small>找到了！</small>'
    : it ? `${lead(it)} <b>${it.en}</b>?<small>${it.zh}在哪裡？</small>`
    : '🎉 You found them all!<small>全部找到了！</small>';
  bar.querySelector('.find-stars').textContent = '⭐'.repeat(game.i) + '☆'.repeat(game.order.length - game.i);
}

function start() {
  stop();
  if (!shown || !shown.page) return;
  const scene = SCENES[shown.page.id];
  game = { scene, order: shuffle(scene.items), i: 0, misses: 0, done: false };
  const bar = document.createElement('div');
  bar.id = 'findBar';
  bar.className = 'find-bar';
  bar.innerHTML = `
    <button class="find-say" aria-label="再說一次">🔊</button>
    <div class="find-q"></div>
    <div class="find-stars"></div>
    <button class="find-close" aria-label="不找了">✖</button>`;
  $('.book').appendChild(bar);
  $('.scene-view').classList.add('finding'); // 找的時候藏起車子下面的英文小字
  bar.querySelector('.find-say').onclick = () => { if (game && !game.done) ask(); };
  bar.querySelector('.find-close').onclick = stop;
  render();
  ask();
}

function stop() {
  $('#findBar')?.remove();
  $('.scene-view')?.classList.remove('finding');
  clearRing();
  game = null;
}

// 提示：答案外面畫一個會閃的橢圓圈圈
function ring(it) {
  clearRing();
  const root = document.getElementById('root');
  const b = sceneBox(document.getElementById(it.id), root);
  const e = document.createElementNS(SVGNS, 'ellipse');
  e.setAttribute('class', 'find-ring');
  e.setAttribute('cx', (b.x0 + b.x1) / 2);
  e.setAttribute('cy', (b.y0 + b.y1) / 2);
  e.setAttribute('rx', (b.x1 - b.x0) / 2 + 24);
  e.setAttribute('ry', (b.y1 - b.y0) / 2 + 24);
  root.insertBefore(e, document.getElementById('dim'));
}
function clearRing() { document.querySelector('.find-ring')?.remove(); }

// 點到一台車：回傳 null（沒在玩，照平常表演）、'right'（找到了，照平常表演，表演完再問下一個）、'wrong'（不表演）
function tap(it) {
  if (!game || game.done || busy()) return null;
  const want = game.order[game.i];
  if (it === want) {
    clearRing();
    game.i++;
    game.misses = 0;
    render(true);
    return 'right';
  }
  game.misses++;
  speak('Try again!');
  const bar = $('#findBar');
  bar.classList.remove('shake'); void bar.offsetWidth; bar.classList.add('shake');
  if (game.misses >= 2) ring(want);
  return 'wrong';
}

// 找到的那台表演完：說「You found it!」，再問下一台；全部找完撒紙片
async function after() {
  if (!game) return;
  const g = game;
  speak('You found it!');
  await wait(1200);
  if (game !== g) return; // 中途關掉或換頁了
  render();
  if (g.i < g.order.length) { ask(); return; }
  g.done = true;
  speak('You found them all!');
  const fx = makeFx(document.getElementById('fx'));
  const { w, h } = g.scene;
  ['#ff5a5f', '#ffcf3f', '#4cc38a', '#3b82f6', '#c084fc'].forEach((color) =>
    fx.burst(document.getElementById('fx'), w / 2, h * 0.35, { n: 14, color, vx: [-10, 10], vy: [-14, -4], g: 0.4, size: [7, 12], life: 1600 }));
}

window.Find = { tap, after, active: () => !!game };

document.addEventListener('click', (e) => {
  if (e.target.closest('#findBtn')) (game ? stop() : start());
});
window.addEventListener('hashchange', stop);
}
