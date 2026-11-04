// 🐮 農場動物：點動物會唸英文名字、播真的叫聲，然後像機關書一樣動起來
// 版面 1600×1000；左邊是紅色穀倉（x 0～440），中間有一段木頭圍欄（y ≈ 470～520），右下角是鴨子的池塘（x 1160～1600, y 750～880）
// 動物是 AI 生成的圖（art/img/farm-animals/*.webp）；母雞下的蛋和孵出來的小雞是程式畫的
// 叫聲是 Pixabay 的音效（audio/sound/，來源見那裡的 CREDITS.md）：羊、馬、公雞的原檔很長，只剪了最響的 2～3 秒
// 頁面 id 叫 farm-animals：交通工具那本已經有一頁 farm（農場的車子）
// 整個檔案包在 { } 裡，變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/farm-animals/${name}.webp`;
const IMG = (name, w, h, clip) =>
  `<image href="${SRC(name)}" width="${w}" height="${h}"${clip ? ` clip-path="url(#${clip})"` : ''}/>`;
const PATH = (pts) => 'M' + pts.map((p) => p.join(',')).join('L') + 'Z';
const RECT = (x0, y0, x1, y1) => PATH([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]);
const CLIP = (id, d) => `<clipPath id="${id}"><path d="${d}"/></clipPath>`;
const HOLE = (id, w, h, d) => `<clipPath id="${id}"><path clip-rule="evenodd" d="M0,0H${w}V${h}H0Z${d}"/></clipPath>`;
const MUD = '#8a5a2b', GRASS = '#b9c95a';

// 整張圖放在零件 body 裡；inner 不給就是整張圖
const whole = (p, name, w, h, inner) =>
  `<g transform="translate(0 ${-h})"><g id="${p}-body">${inner ?? IMG(name, w, h)}</g></g>`;
// 跳一下：ty 走一個拱形，落地壓扁一下
async function hop(c, h, ms, tx) {
  await c.anim(180, { body: { sy: 0.9 } });
  await c.anim(ms, { body: { sy: 1, ...(tx === undefined ? {} : { tx }) } }, (t) => c.set('body', { ty: -h * Math.sin(t * Math.PI) }));
  c.set('body', { ty: 0 });
  await c.anim(120, { body: { sy: 0.92 } });
  await c.anim(150, { body: { sy: 1 } });
}

// ---------- 乳牛：「哞——」抬頭叫，尾巴甩一甩 ----------
// 圖 722×626（臉朝右），尾巴 (0～58, 170～545) 掛在 (55, 180)
const COW_TAIL = RECT(0, 170, 58, 545);
const cow = {
  id: 'cow', en: 'Cow', zh: '乳牛', x: 950, y: 720, s: 0.48,
  hint: [300, -380],
  pivots: { body: [361, 626], tail: [55, 180] },
  art: (p) => whole(p, 'cow', 722, 626,
    HOLE(`${p}-cb`, 722, 626, COW_TAIL) + IMG('cow', 722, 626, `${p}-cb`) +
    CLIP(`${p}-ct`, COW_TAIL) + `<g id="${p}-tail">${IMG('cow', 722, 626, `${p}-ct`)}</g>`),
  async act(c) {
    playSound('cow');
    await c.anim(500, { body: { r: -4 } });
    for (let i = 0; i < 4; i++) {
      await c.anim(200, { tail: { r: 25 } });
      await c.anim(200, { tail: { r: -10 } });
    }
    await c.anim(400, { body: { r: 0 }, tail: { r: 0 } });
  },
};

// ---------- 小豬：「齁齁」開心地跳兩下，濺起泥巴 ----------
// 圖 681×553（臉朝右）
const pig = {
  id: 'pig', en: 'Pig', zh: '小豬', x: 360, y: 930, s: 0.42,
  hint: [300, -300],
  pivots: { body: [340, 553] },
  art: (p) => whole(p, 'pig', 681, 553),
  async act(c) {
    playSound('pig');
    for (let i = 0; i < 2; i++) {
      await hop(c, 120, 450);
      c.burst('body', 340, 548, { n: 14, color: MUD, vx: [-4, 4], vy: [-4, -1], g: 0.25, size: [6, 13] });
    }
    await c.wait(200);
    playSound('pig');
    for (let i = 0; i < 3; i++) {
      await c.anim(120, { body: { r: 4 } });
      await c.anim(120, { body: { r: -4 } });
    }
    await c.anim(120, { body: { r: 0 } });
  },
};

// ---------- 綿羊：「咩——」往前跳一大步再跳回來，掉下幾團羊毛 ----------
// 圖 589×575（臉朝右）
const sheep = {
  id: 'sheep', en: 'Sheep', zh: '綿羊', x: 720, y: 950, s: 0.42,
  hint: [230, -380],
  pivots: { body: [294, 575] },
  art: (p) => whole(p, 'sheep', 589, 575),
  async act(c) {
    playSound('sheep');
    await c.wait(400);
    await hop(c, 260, 700, 380);
    c.burst('body', 230, 300, { n: 8, color: '#fffaf0', vx: [-2, 2], vy: [-2, 0], g: 0.06, size: [10, 18], life: 1300 });
    c.set('body', { sx: -1 }); // 轉身
    await c.wait(300);
    await hop(c, 260, 700, 0);
    c.set('body', { sx: 1 });
  },
};

// ---------- 馬：前腳抬起來「嘶——」，再小跑一段回來 ----------
// 圖 670×672（臉朝右），後腳在 (190, 668)
const horse = {
  id: 'horse', en: 'Horse', zh: '馬', x: 620, y: 690, s: 0.45,
  hint: [330, -400],
  pivots: { body: [190, 668] },
  art: (p) => whole(p, 'horse', 670, 672),
  async act(c) {
    playSound('horse');
    await c.anim(500, { body: { r: -22 } });
    for (let i = 0; i < 2; i++) {
      await c.anim(160, { body: { r: -26 } });
      await c.anim(160, { body: { r: -20 } });
    }
    await c.anim(300, { body: { r: 0 } });
    c.burst('body', 520, 668, { n: 10, color: GRASS, vx: [-3, 3], vy: [-2, -0.5], g: 0.1, size: [6, 11] });
    const trot = (t) => c.set('body', { ty: -25 * Math.abs(Math.sin(t * Math.PI * 6)) });
    await c.anim(1000, { body: { tx: 260 } }, trot);
    c.set('body', { sx: -1, ty: 0 });
    c.get('body').px = 335; // 轉身時繞身體中間翻
    await c.anim(1000, { body: { tx: 0 } }, trot);
    c.set('body', { sx: 1, ty: 0 });
    c.get('body').px = 190;
  },
};

// ---------- 公雞：挺起胸膛「喔喔喔——」 ----------
// 圖 654×677（臉朝右），腳在 (480, 670)
const rooster = {
  id: 'rooster', en: 'Rooster', zh: '公雞', x: 420, y: 640, s: 0.3,
  hint: [480, -520],
  pivots: { body: [480, 670] },
  art: (p) => whole(p, 'rooster', 654, 677),
  async act(c) {
    await c.anim(400, { body: { sy: 0.92 } });
    playSound('rooster');
    await c.anim(500, { body: { sy: 1.1, r: -8 } });
    await c.wait(1600);
    await c.anim(400, { body: { sy: 1, r: 0 } });
    c.burst('body', 300, 300, { n: 6, color: '#e8742a', vx: [-1.5, 1.5], vy: [-1.5, 0], g: 0.06, size: [6, 10], life: 1300 });
  },
};

// ---------- 母雞：「Cluck cluck!」在窩裡扭一扭，生下一顆蛋，蛋裂開孵出一隻小雞「Peep peep!」 ----------
// 圖 660×622（坐在稻草窩裡，臉朝右）；蛋和小雞畫在窩的右前方 (590, 560)
const EGG_X = 590, EGG_Y = 560;
const hen = {
  id: 'hen', en: 'Hen', zh: '母雞', x: 40, y: 790, s: 0.42,
  hint: [300, -420],
  pivots: { body: [330, 622], egg: [EGG_X, EGG_Y + 40], top: [EGG_X + 30, EGG_Y - 10], chick: [EGG_X, EGG_Y + 40] },
  box: [0, -622, 700, 622],
  art(p) {
    const eggPath = (y0, y1) => `<path d="M${EGG_X - 34},${EGG_Y} C${EGG_X - 34},${EGG_Y + 50} ${EGG_X + 34},${EGG_Y + 50} ${EGG_X + 34},${EGG_Y}` +
      ` L${EGG_X + 22},${y1} L${EGG_X + 8},${y0} L${EGG_X - 8},${y1} L${EGG_X - 22},${y0}Z" fill="#fff6e0"/>`;
    const chick = `<g id="${p}-chick" opacity="0">` +
      `<circle cx="${EGG_X}" cy="${EGG_Y + 4}" r="32" fill="#ffd43b"/><circle cx="${EGG_X + 12}" cy="${EGG_Y - 30}" r="22" fill="#ffd43b"/>` +
      `<path d="M${EGG_X + 32},${EGG_Y - 32} l14,5 l-14,5z" fill="#ff8a1a"/><circle cx="${EGG_X + 20}" cy="${EGG_Y - 34}" r="4" fill="#222"/></g>`;
    const egg = `<g id="${p}-egg" opacity="0">${eggPath(EGG_Y - 14, EGG_Y - 2)}` +
      `<g id="${p}-top"><path d="M${EGG_X - 34},${EGG_Y} C${EGG_X - 34},${EGG_Y - 70} ${EGG_X + 34},${EGG_Y - 70} ${EGG_X + 34},${EGG_Y}` +
      ` L${EGG_X + 22},${EGG_Y - 2} L${EGG_X + 8},${EGG_Y - 14} L${EGG_X - 8},${EGG_Y - 2} L${EGG_X - 22},${EGG_Y - 14}Z" fill="#fff6e0"/></g></g>`;
    return whole(p, 'hen', 660, 622, IMG('hen', 660, 622) + chick + egg);
  },
  async act(c) {
    speak('Cluck cluck!', { queue: true });
    for (let i = 0; i < 3; i++) {
      await c.anim(150, { body: { r: 3, sy: 0.97 } });
      await c.anim(150, { body: { r: -3, sy: 1 } });
    }
    await c.anim(150, { body: { r: 0 } });
    // 蛋「咚」一聲滾出來
    c.set('egg', { o: 1, sx: 0.2, sy: 0.2, tx: -80 });
    await c.anim(400, { egg: { sx: 1, sy: 1, tx: 0 } });
    await c.wait(400);
    for (let i = 0; i < 3; i++) {
      await c.anim(110, { egg: { r: 10 } });
      await c.anim(110, { egg: { r: -10 } });
    }
    await c.anim(110, { egg: { r: 0 } });
    // 蛋殼上半部翻開，小雞冒出來
    await c.anim(400, { top: { r: 50, ty: -40, o: 0 } });
    c.set('chick', { o: 1, sx: 0.3, sy: 0.3 });
    await c.anim(300, { chick: { sx: 1, sy: 1 } });
    speak('Peep peep!', { queue: true });
    for (let i = 0; i < 2; i++) {
      await c.anim(150, { chick: { ty: -25 } });
      await c.anim(150, { chick: { ty: 0 } });
    }
    await c.wait(800);
    await c.anim(500, { chick: { o: 0 }, egg: { o: 0 } });
    c.set('top', { r: 0, ty: 0, o: 1 });
    c.set('chick', { sx: 1, sy: 1 });
  },
};

// ---------- 鴨子：「Quack quack!」左搖右擺地走到池塘邊，濺起水花再走回來 ----------
// 圖 455×663（臉朝右），腳在 (300, 660)
const duck = {
  id: 'duck', en: 'Duck', zh: '鴨子', x: 1250, y: 900, s: 0.32,
  hint: [250, -400],
  pivots: { body: [300, 660] },
  art: (p) => whole(p, 'duck', 455, 663),
  async act(c) {
    speak('Quack quack!', { queue: true });
    const waddle = (t) => c.set('body', { r: 8 * Math.sin(t * Math.PI * 8) });
    await c.anim(1500, { body: { tx: 300 } }, waddle);
    c.burst('body', 380, 640, { n: 14, color: '#8fd3ff', vx: [-3, 3], vy: [-5, -2], g: 0.25, size: [6, 11] });
    await hop(c, 80, 350);
    c.set('body', { sx: -1 });
    await c.anim(1500, { body: { tx: 0 } }, waddle);
    c.set('body', { sx: 1, r: 0 });
  },
};

SCENES['farm-animals'] = {
  w: 1600,
  h: 1000,
  bg: () => `
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <text x="1544" y="98" text-anchor="end" font-size="60" font-weight="900" fill="${LINE}">Farm Animals</text>
    <text x="1542" y="148" text-anchor="end" font-size="38" font-weight="900" fill="${LINE}" opacity=".7">農場動物</text>
  `,
  // 先畫後排（遠的），再畫前排
  items: [rooster, horse, cow, hen, duck, pig, sheep],
};
}
