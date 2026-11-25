// 🍽️ 餵牠：動物卡片上的按鈕，打開一個餵食的小畫面
// 動物肚子餓了，下面有 3 種食物（1 種牠會吃的＋2 種牠不吃的），點對了食物飛進嘴巴、動物開心地叫、撒彩色紙片；
// 點錯了動物搖搖頭，那個食物變淡，可以再試。答對以後告訴小朋友牠是「吃肉的／吃植物的／什麼都吃的」動物
// 只在世界地圖（index.html）載入，車子版沒有；要在 app.js 後面載入（用到 state、stopAll、speakTTS、playSound、confetti、Stickers）
{
// 食物：emoji（只用 Emoji 12 以前的）、中文、英文；plant = 植物類
const FOODS = {
  meat:    { e: '🍖', zh: '肉',     en: 'Meat' },
  fish:    { e: '🐟', zh: '魚',     en: 'Fish' },
  mouse:   { e: '🐭', zh: '老鼠',   en: 'Mouse' },
  shrimp:  { e: '🦐', zh: '小蝦子', en: 'Shrimp' },
  squid:   { e: '🦑', zh: '魷魚',   en: 'Squid' },
  oyster:  { e: '🦪', zh: '貝殼',   en: 'Clam' },
  crab:    { e: '🦀', zh: '螃蟹',   en: 'Crab' },
  snake:   { e: '🐍', zh: '蛇',     en: 'Snake' },
  bug:     { e: '🐛', zh: '小蟲',   en: 'Bugs' },
  ant:     { e: '🐜', zh: '螞蟻',   en: 'Ants' },
  egg:     { e: '🥚', zh: '蛋',     en: 'Eggs' },
  bone:    { e: '🦴', zh: '骨頭',   en: 'Bone' },
  scorpion: { e: '🦂', zh: '蠍子',  en: 'Scorpion' },
  grass:   { e: '🌿', zh: '草',     en: 'Grass', plant: true },
  seaweed: { e: '🌱', zh: '海草',   en: 'Seaweed', plant: true },
  leaves:  { e: '🍃', zh: '樹葉',   en: 'Leaves', plant: true },
  bamboo:  { e: '🎋', zh: '竹子',   en: 'Bamboo', plant: true },
  banana:  { e: '🍌', zh: '香蕉',   en: 'Banana', plant: true },
  fruit:   { e: '🍎', zh: '水果',   en: 'Fruit', plant: true },
  carrot:  { e: '🥕', zh: '紅蘿蔔', en: 'Carrot', plant: true },
  nuts:    { e: '🌰', zh: '堅果',   en: 'Nuts', plant: true },
  grain:   { e: '🌾', zh: '穀子',   en: 'Grain', plant: true },
  honey:   { e: '🍯', zh: '蜂蜜',   en: 'Honey', plant: true },
};

// 每隻動物會吃什麼（eats），什麼都吃的動物另外指定明顯不吃的（no），不然錯的選項可能其實牠也吃
// 只吃肉的動物，錯的選項從 PLANT_WRONG 挑；只吃植物的從 MEAT_WRONG 挑
const DIET = {
  'polar-bear': { eats: ['fish', 'meat'] },
  narwhal: { eats: ['fish', 'squid'] },
  walrus: { eats: ['oyster'] },
  'snowy-owl': { eats: ['mouse'] },
  puffin: { eats: ['fish'] },
  eagle: { eats: ['fish', 'mouse'] },
  moose: { eats: ['leaves', 'grass'] },
  beaver: { eats: ['leaves'] },
  bison: { eats: ['grass'] },
  rattlesnake: { eats: ['mouse'] },
  raccoon: { eats: ['fruit', 'fish', 'egg'], no: ['bamboo', 'grass'] },
  iguana: { eats: ['leaves', 'fruit'] },
  toucan: { eats: ['fruit'] },
  parrot: { eats: ['nuts', 'fruit'] },
  frog: { eats: ['bug', 'ant'] },
  sloth: { eats: ['leaves'] },
  jaguar: { eats: ['meat', 'fish'] },
  anaconda: { eats: ['meat', 'mouse'] },
  llama: { eats: ['grass'] },
  capybara: { eats: ['grass'] },
  flamingo: { eats: ['shrimp'] },
  reindeer: { eats: ['grass', 'leaves'] },
  fox: { eats: ['mouse', 'bug', 'fruit'], no: ['bamboo', 'grass'] },
  hedgehog: { eats: ['bug', 'egg'] },
  rabbit: { eats: ['carrot', 'grass'] },
  camel: { eats: ['grass', 'leaves'] },
  crocodile: { eats: ['meat', 'fish'] },
  lion: { eats: ['meat'] },
  cheetah: { eats: ['meat'] },
  giraffe: { eats: ['leaves'] },
  gorilla: { eats: ['leaves', 'banana'] },
  hippo: { eats: ['grass'] },
  elephant: { eats: ['grass', 'leaves', 'banana'] },
  rhino: { eats: ['grass', 'leaves'] },
  zebra: { eats: ['grass'] },
  meerkat: { eats: ['bug', 'scorpion'] },
  lemur: { eats: ['fruit', 'leaves', 'banana'] },
  squirrel: { eats: ['nuts', 'grain'] },
  wolf: { eats: ['meat'] },
  'arctic-fox': { eats: ['mouse', 'egg'] },
  'brown-bear': { eats: ['fish', 'honey', 'fruit'], no: ['bamboo', 'squid'] },
  'red-crowned-crane': { eats: ['fish', 'grain'], no: ['bamboo', 'banana'] },
  yak: { eats: ['grass'] },
  'snow-leopard': { eats: ['meat'] },
  panda: { eats: ['bamboo'] },
  'red-panda': { eats: ['bamboo', 'fruit'] },
  tiger: { eats: ['meat'] },
  peacock: { eats: ['grain', 'bug'], no: ['fish', 'bamboo'] },
  orangutan: { eats: ['fruit', 'banana', 'leaves'] },
  'king-cobra': { eats: ['snake', 'mouse'] },
  macaque: { eats: ['fruit', 'nuts', 'leaves'], no: ['meat', 'mouse'] },
  'formosan-bear': { eats: ['fruit', 'nuts', 'honey'], no: ['squid', 'shrimp'] },
  'leopard-cat': { eats: ['mouse', 'meat'] },
  'blue-magpie': { eats: ['bug', 'fruit'], no: ['grass', 'bamboo'] },
  kangaroo: { eats: ['grass'] },
  koala: { eats: ['leaves'] },
  platypus: { eats: ['shrimp', 'bug'] },
  'sea-turtle': { eats: ['seaweed'], no: ['meat', 'mouse'] },
  kiwi: { eats: ['bug'] },
  whale: { eats: ['shrimp', 'fish'] },
  dolphin: { eats: ['fish', 'squid'] },
  shark: { eats: ['fish', 'squid'] },
  octopus: { eats: ['crab', 'shrimp'] },
  penguin: { eats: ['fish', 'shrimp'] },
  seal: { eats: ['fish'] },
  crab: { eats: ['seaweed', 'fish'], no: ['bamboo', 'carrot'] },
  dog: { eats: ['bone', 'meat'], no: ['bamboo', 'grass'] },
  cat: { eats: ['fish', 'mouse'] },
  cow: { eats: ['grass'] },
  pig: { eats: ['carrot', 'fruit', 'grain'], no: ['mouse', 'bamboo'] },
  sheep: { eats: ['grass'] },
  horse: { eats: ['carrot', 'grass'] },
  chicken: { eats: ['grain', 'bug'], no: ['fish', 'bamboo'] },
  ostrich: { eats: ['grass', 'grain'], no: ['fish', 'meat'] },
  chimpanzee: { eats: ['banana', 'fruit', 'ant'], no: ['fish', 'oyster'] },
  'komodo-dragon': { eats: ['meat'] },
  tortoise: { eats: ['grass', 'leaves', 'fruit'] },
  'sea-otter': { eats: ['oyster', 'crab'] },
  clownfish: { eats: ['shrimp'] },
  orca: { eats: ['fish', 'meat'] },
};
const PLANT_WRONG = ['carrot', 'banana', 'bamboo', 'grass'];
const MEAT_WRONG = ['meat', 'fish', 'mouse'];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => arr.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((p) => p[1]);
// 吃肉的／吃植物的／什麼都吃的
function dietKind(d) {
  const plants = d.eats.filter((k) => FOODS[k].plant).length;
  if (plants === d.eats.length) return '吃植物的動物 🌿';
  if (!plants) return '吃肉的動物 🍖';
  return '什麼都吃的動物 🍽️';
}
function wrongPool(d) {
  if (d.no) return d.no;
  const plants = d.eats.some((k) => FOODS[k].plant);
  return (plants ? MEAT_WRONG : PLANT_WRONG).filter((k) => !d.eats.includes(k));
}

// 畫面
const box = document.createElement('div');
box.id = 'feed';
box.className = 'feed hidden';
box.innerHTML = `
  <div class="feed-panel">
    <button class="card-close" id="feedClose" aria-label="關閉">✕</button>
    <div class="feed-title" id="feedTitle"></div>
    <div class="feed-stage">
      <div class="feed-bubble" id="feedBubble">肚子餓了！</div>
      <svg class="feed-art" id="feedArt" viewBox="-50 -50 100 100"><use id="feedArtUse" href="" x="-50" y="-50" width="100" height="100"/></svg>
      <div class="feed-hearts" id="feedHearts"></div>
    </div>
    <div class="feed-msg" id="feedMsg">牠想吃什麼呢？點一個食物給牠吃！</div>
    <div class="feed-foods" id="feedFoods"></div>
    <button class="feed-again hidden" id="feedAgain">🔁 再餵一次</button>
  </div>`;
document.body.append(box);

const btn = document.createElement('button');
btn.id = 'cardFeed';
btn.className = 'card-feed';
btn.textContent = '🍽️ 餵牠';
document.querySelector('.card-btns').append(btn);

let cur = null; // { a, d, done }
const say = (text) => { stopAll(); speakTTS(text, 'zh-TW'); };

function open() {
  const a = state.current;
  if (!a || !DIET[a.id]) return;
  stopAll();
  box.classList.remove('hidden');
  $('#feedArtUse').setAttribute('href', `#art-${a.id}`);
  $('#feedTitle').textContent = `🍽️ 餵${a.zh}吃東西`;
  round(a);
}

function round(a) {
  const d = DIET[a.id];
  cur = { a, d, done: false };
  const choices = shuffle([pick(d.eats), ...shuffle(wrongPool(d)).slice(0, 2)]);
  const foods = $('#feedFoods');
  foods.innerHTML = '';
  choices.forEach((k) => {
    const f = FOODS[k];
    const b = document.createElement('button');
    b.className = 'feed-food';
    b.innerHTML = `<span class="feed-emoji">${f.e}</span><span class="feed-name">${f.zh}</span>`;
    b.addEventListener('click', () => tap(b, k));
    foods.append(b);
  });
  $('#feedMsg').textContent = '牠想吃什麼呢？點一個食物給牠吃！';
  $('#feedBubble').textContent = '肚子餓了！';
  $('#feedBubble').className = 'feed-bubble';
  $('#feedAgain').classList.add('hidden');
  foods.classList.remove('hidden');
  $('#feedArt').classList.remove('chomp', 'nope');
  say(`${a.zh}肚子餓了，牠想吃什麼呢？`);
}

async function tap(b, k) {
  if (!cur || cur.done || b.disabled) return;
  const { a, d } = cur;
  const f = FOODS[k];
  const art = $('#feedArt');
  if (!d.eats.includes(k)) {
    // 不吃：動物搖搖頭，食物變淡
    b.disabled = true;
    b.classList.add('wrong');
    art.classList.remove('nope'); void art.getBoundingClientRect(); art.classList.add('nope');
    $('#feedBubble').textContent = '不要～';
    $('#feedMsg').textContent = `${a.zh}不吃${f.zh}喔，再試試看！`;
    say(`${a.zh}不吃${f.zh}喔，再試試看！`);
    return;
  }
  // 吃了：食物飛進嘴巴，動物嚼一嚼、開心地叫
  cur.done = true;
  document.querySelectorAll('.feed-food').forEach((x) => { x.disabled = true; });
  b.classList.add('right');
  const from = b.querySelector('.feed-emoji').getBoundingClientRect();
  const to = art.getBoundingClientRect();
  const fly = document.createElement('span');
  fly.className = 'feed-fly';
  fly.textContent = f.e;
  fly.style.left = from.left + 'px';
  fly.style.top = from.top + 'px';
  document.body.append(fly);
  const dx = to.left + to.width / 2 - from.left - from.width / 2, dy = to.top + to.height * 0.45 - from.top - from.height / 2;
  // 動畫被暫停（例如畫面切到背景）也不要卡住：最多等 0.9 秒
  await Promise.race([wait(900), fly.animate([
    { transform: 'translate(0, 0) scale(1)' },
    { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 80}px) scale(1.2)`, offset: 0.5 },
    { transform: `translate(${dx}px, ${dy}px) scale(.3)`, opacity: 0.2 },
  ], { duration: 650, easing: 'ease-in' }).finished.catch(() => {})]);
  fly.remove();
  art.classList.remove('chomp'); void art.getBoundingClientRect(); art.classList.add('chomp');
  hearts();
  $('#feedBubble').textContent = '好好吃！';
  $('#feedBubble').className = 'feed-bubble happy';
  $('#feedMsg').innerHTML = `${a.zh}最喜歡吃${f.zh}！<br><b>${a.zh}是${dietKind(d)}</b>`;
  confetti();
  if (Stickers.add(a.id, 'fed')) toast(`🎉 得到新貼紙：${a.zh}！`);
  playSound(a, recordings.get(`${a.id}_sound`) || audioFiles.get(`${a.id}_sound`));
  await wait(1300);
  if (cur && cur.a === a && !box.classList.contains('hidden')) {
    stopAll();
    speakTTS(`好好吃！${a.zh}最喜歡吃${f.zh}！`, 'zh-TW');
  }
  // 食物那一排換成「再餵一次」（矮螢幕上按鈕才不會被擠到看不到的地方）
  $('#feedFoods').classList.add('hidden');
  $('#feedAgain').classList.remove('hidden');
}

function hearts() {
  const h = $('#feedHearts');
  h.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const s = document.createElement('span');
    s.textContent = '❤️';
    s.style.left = 30 + Math.random() * 40 + '%';
    s.style.animationDelay = i * 0.12 + 's';
    h.append(s);
  }
}

function close() {
  stopAll();
  box.classList.add('hidden');
  cur = null;
}

btn.addEventListener('click', open);
$('#feedClose').addEventListener('click', close);
$('#feedAgain').addEventListener('click', () => cur && round(cur.a));
box.addEventListener('click', (e) => { if (e.target === box) close(); });
}
