// 🦉 森林：點動物會唸英文名字、播真的叫聲（棕熊、貓頭鷹、松鼠、狼），然後像機關書一樣動起來
// 版面 1600×1000；左邊是一棵大樹（樹幹 x ≈ 100～260，往右伸出樹枝），右邊是一棵細樹（樹幹 x ≈ 1505～1545），
// 中間遠處是一排秋天的樹，下半部是黃綠色的草地，右下有一根倒下的木頭
// 動物是 AI 生成的圖（art/img/forest/*.webp）
// 叫聲是 Pixabay 的音效（audio/sound/，來源見那裡的 CREDITS.md）：貓頭鷹跟極地的雪鴞共用同一個叫聲
// 整個檔案包在 { } 裡，變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/forest/${name}.webp`;
const IMG = (name, w, h) => `<image href="${SRC(name)}" width="${w}" height="${h}"/>`;
const LEAVES = ['#f7a531', '#f2c230', '#e86a2c'];
const GRASS = '#d9c93a', WOOD = '#9a5b2e';

// 整張圖放在零件 body 裡
const whole = (p, name, w, h) =>
  `<g transform="translate(0 ${-h})"><g id="${p}-body">${IMG(name, w, h)}</g></g>`;
// 跳一下：ty 走一個拱形，落地壓扁一下
async function hop(c, h, ms, tx) {
  await c.anim(160, { body: { sy: 0.9 } });
  await c.anim(ms, { body: { sy: 1, ...(tx === undefined ? {} : { tx }) } }, (t) => c.set('body', { ty: -h * Math.sin(t * Math.PI) }));
  c.set('body', { ty: 0 });
  await c.anim(100, { body: { sy: 0.92 } });
  await c.anim(130, { body: { sy: 1 } });
}
// 樹上飄下來的落葉
const leaves = (c, x, y, n) => LEAVES.forEach((color) =>
  c.burst('body', x, y, { n, color, vx: [-3, 3], vy: [-2, 1], g: 0.05, size: [8, 14] }));

// ---------- 棕熊：「吼——」站起來，用力踩地，樹上的葉子掉下來 ----------
// 圖 793×606（臉朝右），後腳在 (230, 600)
const bear = {
  id: 'bear', en: 'Brown Bear', zh: '棕熊', x: 300, y: 930, s: 0.5,
  hint: [400, -380],
  pivots: { body: [230, 600] },
  box: [0, -1000, 900, 1000],
  art: (p) => whole(p, 'bear', 793, 606),
  async act(c) {
    playSound('brown-bear');
    await c.anim(700, { body: { r: -35 } });
    for (let i = 0; i < 2; i++) {
      await c.anim(200, { body: { r: -39 } });
      await c.anim(200, { body: { r: -32 } });
    }
    await c.wait(250);
    await c.anim(350, { body: { r: 0 } }, undefined, (t) => t * t);
    c.burst('body', 600, 600, { n: 14, color: GRASS, vx: [-4, 4], vy: [-5, -2], g: 0.2, size: [6, 12] });
    leaves(c, 400, -300, 5);
    await c.anim(120, { body: { sy: 0.94 } });
    await c.anim(160, { body: { sy: 1 } });
  },
};

// ---------- 鹿：輕輕點兩下頭，往右跳一大步，轉身再跳回來 ----------
// 圖 338×648（臉朝右），腳在 (170, 640)
const deer = {
  id: 'deer', en: 'Deer', zh: '鹿', x: 790, y: 705, s: 0.42,
  hint: [170, -430],
  pivots: { body: [170, 640] },
  box: [-50, -1000, 1400, 1000],
  art: (p) => whole(p, 'deer', 338, 648),
  async act(c) {
    for (let i = 0; i < 2; i++) {
      await c.anim(220, { body: { r: 6 } });
      await c.anim(220, { body: { r: 0 } });
    }
    const leap = (tx) => c.anim(900, { body: { tx } }, (t) =>
      c.set('body', { ty: -300 * Math.sin(t * Math.PI), r: -20 * Math.cos(t * Math.PI) * (tx ? 1 : -1) }));
    await c.anim(160, { body: { sy: 0.9 } });
    c.set('body', { sy: 1 });
    await leap(900);
    c.set('body', { ty: 0, r: 0 });
    c.burst('body', 170, 640, { n: 8, color: GRASS, vx: [-3, 3], vy: [-4, -1], g: 0.2, size: [6, 10] });
    await c.wait(300);
    c.set('body', { sx: -1 });
    await c.anim(160, { body: { sy: 0.9 } });
    c.set('body', { sy: 1 });
    await leap(0);
    c.set('body', { ty: 0, r: 0, sx: 1 });
    c.burst('body', 170, 640, { n: 8, color: GRASS, vx: [-3, 3], vy: [-4, -1], g: 0.2, size: [6, 10] });
  },
};

// ---------- 貓頭鷹：「呼——呼——」轉頭看看左右，飛下來繞一圈再回到樹枝上 ----------
// 圖 395×622（臉朝右），腳在 (230, 605)；站在大樹的樹枝上
const owl = {
  id: 'owl', en: 'Owl', zh: '貓頭鷹', x: 320, y: 344, s: 0.26,
  hint: [200, -400],
  pivots: { body: [230, 605] },
  box: [-200, -800, 1700, 1800],
  art: (p) => whole(p, 'owl', 395, 622),
  async act(c) {
    playSound('snowy-owl');
    // 轉頭：翻到左邊看一下，再翻回來
    for (let i = 0; i < 2; i++) {
      await c.anim(200, { body: { sx: -1 } });
      await c.wait(300);
      await c.anim(200, { body: { sx: 1 } });
      await c.wait(300);
    }
    await c.anim(250, { body: { sy: 0.9 } });
    // 往右下飛一大圈再回來，翅膀拍動用身體上下抖來表現
    await c.anim(3000, { body: { sy: 1 } }, (t) => {
      const a = t * Math.PI * 2;
      c.set('body', {
        tx: 800 * Math.sin(a / 2) + 250 * Math.sin(a),
        ty: 650 * Math.sin(a / 2) + 20 * Math.sin(t * Math.PI * 26),
        sx: t < 0.5 ? 1 : -1,
        r: -10 * Math.sin(a),
      });
    });
    c.set('body', { tx: 0, ty: 0, sx: 1, r: 0 });
    leaves(c, 230, 600, 3);
  },
};

// ---------- 松鼠：吱吱叫、啃一啃橡果，跳到樹幹上爬上去，再溜下來 ----------
// 圖 683×685（臉朝右），腳在 (450, 680)；坐在右下的木頭上
const squirrel = {
  id: 'squirrel', en: 'Squirrel', zh: '松鼠', x: 1360, y: 800, s: 0.22, focus: false, // 要爬真的樹幹，所以原地演
  hint: [450, -400],
  pivots: { body: [450, 680] },
  box: [-100, -2400, 1000, 2500],
  art: (p) => whole(p, 'squirrel', 683, 685),
  async act(c) {
    playSound('squirrel');
    // 啃橡果：頭一點一點
    for (let i = 0; i < 4; i++) {
      await c.anim(110, { body: { r: 5 } });
      await c.anim(110, { body: { r: 0 } });
    }
    // 跳到右邊的樹幹，轉成頭朝上往上爬
    await hop(c, 120, 300, 200);
    await c.anim(200, { body: { r: -90 } });
    await c.anim(1300, { body: { ty: -1600 } }, (t) => c.set('body', { tx: 200 + 15 * Math.sin(t * Math.PI * 12) }));
    c.set('body', { tx: 200 });
    // 在上面左右張望
    for (let i = 0; i < 2; i++) {
      await c.anim(200, { body: { r: -80 } });
      await c.anim(200, { body: { r: -100 } });
    }
    await c.anim(200, { body: { r: -90 } });
    // 溜下來，跳回木頭上
    await c.anim(700, { body: { ty: 0 } }, undefined, (t) => t * t);
    await c.anim(200, { body: { r: 0 } });
    c.set('body', { sx: -1 });
    await hop(c, 120, 300, 0);
    c.set('body', { sx: 1 });
  },
};

// ---------- 兔子：「Hop hop hop!」往右跳三下，轉身跳回來 ----------
// 圖 563×661（臉朝右），腳在 (280, 655)
const rabbit = {
  id: 'rabbit', en: 'Rabbit', zh: '兔子', x: 740, y: 965, s: 0.24,
  hint: [300, -400],
  pivots: { body: [280, 655] },
  box: [-100, -1000, 1500, 1050],
  art: (p) => whole(p, 'rabbit', 563, 661),
  async act(c) {
    speak('Hop hop hop!', { queue: true });
    for (let i = 1; i <= 3; i++) await hop(c, 220, 380, 280 * i);
    c.set('body', { sx: -1 });
    await c.wait(200);
    for (let i = 2; i >= 0; i--) await hop(c, 220, 380, 280 * i);
    c.set('body', { sx: 1 });
  },
};

// ---------- 刺蝟：「Sniff sniff!」嗅一嗅，縮成一顆球往前滾，再打開 ----------
// 圖 674×591（臉朝右），中心在 (340, 330)
const hedgehog = {
  id: 'hedgehog', en: 'Hedgehog', zh: '刺蝟', x: 1010, y: 960, s: 0.24,
  hint: [340, -300],
  pivots: { body: [340, 330] },
  box: [-100, -800, 1700, 850],
  art: (p) => whole(p, 'hedgehog', 674, 591),
  async act(c) {
    speak('Sniff sniff!', { queue: true });
    for (let i = 0; i < 3; i++) {
      await c.anim(150, { body: { r: 6, tx: 15 } });
      await c.anim(150, { body: { r: 0, tx: 0 } });
    }
    // 縮成球，往右滾兩圈
    await c.anim(300, { body: { sx: 0.8, sy: 0.8, ty: 60 } });
    await c.anim(1200, { body: { tx: 800, r: 720 } });
    c.set('body', { r: 0 });
    c.burst('body', 340, 590, { n: 8, color: GRASS, vx: [-3, 3], vy: [-4, -1], g: 0.2, size: [6, 10] });
    await c.anim(300, { body: { sx: 1, sy: 1, ty: 0 } });
    // 轉身慢慢走回來
    c.set('body', { sx: -1 });
    await c.anim(1400, { body: { tx: 0 } }, (t) => c.set('body', { ty: -10 * Math.abs(Math.sin(t * Math.PI * 8)) }));
    c.set('body', { sx: 1, ty: 0 });
  },
};

// ---------- 啄木鳥：「Peck peck peck!」用嘴巴叩叩叩啄樹幹，木屑噴出來 ----------
// 圖 366×625（臉朝右），抓著右邊那棵樹的樹幹，嘴巴尖在 (360, 125)，腳在 (260, 470)
const woodpecker = {
  id: 'woodpecker', en: 'Woodpecker', zh: '啄木鳥', x: 1410, y: 640, s: 0.3, focus: false, // 要啄真的樹幹，所以原地演
  hint: [180, -400],
  pivots: { body: [260, 470] },
  box: [-100, -700, 600, 750],
  art: (p) => whole(p, 'woodpecker', 366, 625),
  async act(c) {
    speak('Peck peck peck!', { queue: true });
    for (let round = 0; round < 2; round++) {
      await c.anim(250, { body: { r: -12 } });
      for (let i = 0; i < 5; i++) {
        await c.anim(60, { body: { r: 8 } });
        c.burst('body', 360, 125, { n: 3, color: WOOD, vx: [-3, 0], vy: [-3, 0], g: 0.2, size: [5, 9] });
        await c.anim(70, { body: { r: 0 } });
      }
      await c.wait(400);
    }
    await c.anim(200, { body: { r: 0 } });
  },
};

// ---------- 狼：坐下來仰頭「嗷嗚——」 ----------
// 圖 720×576（臉朝右），後腳在 (200, 570)
const wolf = {
  id: 'wolf', en: 'Wolf', zh: '狼', x: 1000, y: 745, s: 0.36,
  hint: [450, -350],
  pivots: { body: [200, 570] },
  box: [0, -900, 800, 900],
  art: (p) => whole(p, 'wolf', 720, 576),
  async act(c) {
    playSound('wolf');
    await c.anim(500, { body: { r: -28, sy: 0.95 } });
    // 嚎叫的時候頭微微抖動
    await c.anim(2600, { body: { r: -32 } }, (t) => c.set('body', { sx: 1 + 0.02 * Math.sin(t * Math.PI * 20) }));
    await c.anim(400, { body: { r: 0, sx: 1, sy: 1 } });
  },
};

SCENES['forest'] = {
  w: 1600,
  h: 1000,
  bg: () => `
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <text x="960" y="360" text-anchor="middle" font-size="60" font-weight="900" fill="${LINE}">Forest</text>
    <text x="960" y="410" text-anchor="middle" font-size="38" font-weight="900" fill="${LINE}" opacity=".7">森林</text>
  `,
  // 先畫後排（遠的），再畫前排
  items: [owl, woodpecker, deer, wolf, squirrel, bear, hedgehog, rabbit],
};
}
