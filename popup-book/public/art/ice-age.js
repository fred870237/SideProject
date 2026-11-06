// ❄️ 冰河時期（史前動物書）：點冰河時期的動物會唸英文名字、播真的動物叫聲，然後動起來
// 版面 1600×1000；地平線在 y ≈ 590，下面是一大片雪地
// 動物是 AI 生成的圖（art/img/ice-age/*.webp），在洋紅色背景上生圖（picks 用 {"key": "magenta"}）
// 叫聲借用動物書的真實叫聲（audio/sound/）：長毛象用大象、披毛犀用犀牛、劍齒虎用老虎、洞熊用棕熊、恐狼用狼
// 雪花是程式噴的小顆粒
// 整個檔案包在 { } 裡，變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/ice-age/${name}.webp`;
const SNOW = '#ffffff', SNOW2 = '#d8ecff';

// 整張圖放在零件 body 裡
const whole = (p, name, w, h) =>
  `<g transform="translate(0 ${-h})"><g id="${p}-body"><image href="${SRC(name)}" width="${w}" height="${h}"/></g></g>`;
// 踢起一點雪
const snow = (c, x, y, n = 8, up = 4) => {
  c.burst('body', x, y, { n, color: SNOW, vx: [-2.5, 2.5], vy: [-up, -1], g: 0.15, size: [6, 13], life: 900 });
  c.burst('body', x, y, { n: Math.ceil(n / 2), color: SNOW2, vx: [-2, 2], vy: [-up, -1], g: 0.15, size: [5, 10], life: 900 });
};
// 走路時一上一下
const bob = (c, n, amp) => (t) => c.set('body', { ty: -amp * Math.abs(Math.sin(t * Math.PI * n)) });

// ---------- 長毛象：抬起頭「叭——」叫，用鼻子噴出一團雪，再跺跺腳 ----------
// 圖 747×632（臉朝右），鼻子尖在 (700, 560)，後腳在 (200, 632)
const mammoth = {
  id: 'mammoth', en: 'Woolly Mammoth', zh: '長毛象', x: 560, y: 760, s: 0.62,
  hint: [380, -330],
  pivots: { body: [200, 632] },
  art: (p) => whole(p, 'mammoth', 747, 632),
  async act(c) {
    await c.anim(500, { body: { r: -6 } });
    playSound('elephant');
    for (let i = 0; i < 4; i++) {
      c.burst('body', 720, 520, { n: 6, color: SNOW, vx: [0.5, 4], vy: [-6, -2], g: 0.12, size: [8, 16], life: 1200 });
      await c.anim(200, { body: { r: -8 } });
      await c.anim(200, { body: { r: -5 } });
    }
    await c.anim(400, { body: { r: 0 } });
    for (let i = 0; i < 2; i++) {
      await c.anim(200, { body: { ty: -25 } });
      await c.anim(150, { body: { ty: 0 } }, null, (t) => t * t);
      snow(c, 380, 632, 10);
    }
  },
};

// ---------- 大角鹿：甩甩巨大的鹿角，再輕輕跳一下 ----------
// 圖 481×660（臉朝右），後腳在 (120, 660)
const giantDeer = {
  id: 'giant-deer', en: 'Giant Deer', zh: '大角鹿', x: 1080, y: 700, s: 0.45,
  hint: [240, -300],
  pivots: { body: [260, 660] },
  art: (p) => whole(p, 'giant-deer', 481, 660),
  async act(c) {
    for (let i = 0; i < 3; i++) {
      await c.anim(160, { body: { r: -5 } });
      await c.anim(160, { body: { r: 5 } });
    }
    await c.anim(150, { body: { r: 0 } });
    await c.anim(150, { body: { sy: 0.92 } });
    await c.anim(400, { body: { sy: 1, ty: -140, tx: 80, r: -8 } }, null, (t) => 1 - (1 - t) ** 2);
    await c.anim(400, { body: { ty: 0, tx: 160, r: 0 } }, null, (t) => t * t);
    snow(c, 240, 660, 10);
    c.set('body', { sx: -1 });
    await c.anim(1000, { body: { tx: 0 } }, bob(c, 4, 12));
    c.set('body', { sx: 1, ty: 0 });
  },
};

// ---------- 草原野牛：甩甩頭，用前腳刨雪，再往前小跑一段 ----------
// 圖 702×590（臉朝右），前腳在 (560, 590)
const bison = {
  id: 'bison', en: 'Steppe Bison', zh: '草原野牛', x: 1275, y: 860, s: 0.42,
  hint: [330, -290],
  pivots: { body: [400, 590] },
  art: (p) => whole(p, 'bison', 702, 590),
  async act(c) {
    for (let i = 0; i < 2; i++) {
      await c.anim(200, { body: { r: 6 } });
      await c.anim(200, { body: { r: -4 } });
    }
    await c.anim(150, { body: { r: 0 } });
    for (let i = 0; i < 3; i++) {
      snow(c, 600, 590, 6);
      await c.anim(150, { body: { ty: -10 } });
      await c.anim(150, { body: { ty: 0 } });
    }
    await c.anim(800, { body: { tx: -160 } }, bob(c, 4, 14));
    c.set('body', { sx: -1 });
    await c.anim(800, { body: { tx: 0 } }, bob(c, 4, 14));
    c.set('body', { sx: 1, ty: 0 });
  },
};

// ---------- 披毛犀：低頭用長長的角鏟雪，往前衝，雪噴得到處都是 ----------
// 圖 769×558（臉朝右），角尖在 (750, 380)，後腳在 (200, 558)
const woollyRhino = {
  id: 'woolly-rhino', en: 'Woolly Rhino', zh: '披毛犀', x: 80, y: 800, s: 0.42,
  hint: [380, -280],
  pivots: { body: [400, 558] },
  art: (p) => whole(p, 'woolly-rhino', 769, 558),
  async act(c) {
    playSound('rhino');
    await c.anim(400, { body: { r: 10, tx: -40 } });
    await c.anim(500, { body: { tx: 100 } }, (t) => {
      if (Math.random() < 0.5) c.burst('body', 760, 520, { n: 3, color: SNOW, vx: [1, 5], vy: [-6, -2], g: 0.2, size: [7, 14], life: 900 });
    }, (t) => t * t);
    snow(c, 760, 520, 14, 6);
    await c.anim(300, { body: { r: 0 } });
    await c.anim(1000, { body: { tx: 0 } }, bob(c, 4, 10));
    c.set('body', { ty: 0 });
  },
};

// ---------- 洞熊：用後腳站起來吼一聲，再趴回去 ----------
// 圖 679×598（臉朝右），後腳在 (140, 598)
const caveBear = {
  id: 'cave-bear', en: 'Cave Bear', zh: '洞熊', x: 790, y: 965, s: 0.42,
  hint: [330, -300],
  pivots: { body: [160, 598] },
  art: (p) => whole(p, 'cave-bear', 679, 598),
  async act(c) {
    await c.anim(600, { body: { r: -18 } });
    playSound('brown-bear');
    for (let i = 0; i < 3; i++) {
      await c.anim(180, { body: { r: -21 } });
      await c.anim(180, { body: { r: -16 } });
    }
    await c.anim(400, { body: { r: 0 } }, null, (t) => t * t);
    snow(c, 560, 598, 12);
    await c.anim(150, { body: { sy: 0.94 } });
    await c.anim(150, { body: { sy: 1 } });
  },
};

// ---------- 劍齒虎：壓低身體，「吼」一聲，往前撲再走回來 ----------
// 圖 703×438（臉朝右），後腳在(150, 438)
const sabertooth = {
  id: 'sabertooth', en: 'Saber-toothed Cat', zh: '劍齒虎', x: 250, y: 975, s: 0.42,
  hint: [330, -220],
  pivots: { body: [350, 438] },
  art: (p) => whole(p, 'sabertooth', 703, 438),
  async act(c) {
    await c.anim(400, { body: { sy: 0.88, r: 4 } });
    playSound('tiger');
    for (let i = 0; i < 3; i++) {
      await c.anim(90, { body: { tx: -4 } });
      await c.anim(90, { body: { tx: 4 } });
    }
    // 往前撲
    await c.anim(500, { body: { sy: 1, tx: 150, r: -6 } }, (t) => c.set('body', { ty: -150 * Math.sin(t * Math.PI) }));
    snow(c, 350, 438, 12, 5);
    await c.anim(200, { body: { r: 0, sy: 0.95 } });
    await c.anim(150, { body: { sy: 1 } });
    c.set('body', { sx: -1 });
    await c.anim(1000, { body: { tx: 0 } }, bob(c, 4, 10));
    c.set('body', { sx: 1, ty: 0 });
  },
};

// ---------- 恐狼：抬起頭「嗷嗚——」長嚎 ----------
// 圖 796×605（臉朝右），後腳在 (150, 605)
const direWolf = {
  id: 'dire-wolf', en: 'Dire Wolf', zh: '恐狼', x: 1090, y: 990, s: 0.32,
  hint: [400, -300],
  pivots: { body: [200, 605] },
  art: (p) => whole(p, 'dire-wolf', 796, 605),
  async act(c) {
    await c.anim(500, { body: { r: -14, sy: 0.95 } });
    playSound('wolf');
    await c.anim(1600, { body: { r: -18 } }, (t) => c.set('body', { tx: 2 * Math.sin(t * Math.PI * 12) }));
    await c.anim(500, { body: { r: 0, sy: 1, tx: 0 } });
    snow(c, 400, 605, 6);
  },
};

SCENES['ice-age'] = {
  w: 1600,
  h: 1000,
  bg: () => `
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <text x="56" y="98" font-size="60" font-weight="900" fill="${LINE}">Ice Age</text>
    <text x="58" y="148" font-size="38" font-weight="900" fill="${LINE}" opacity=".7">冰河時期</text>
  `,
  // 先畫後排（遠的），再畫前排
  items: [mammoth, giantDeer, woollyRhino, bison, caveBear, sabertooth, direWolf],
};
}
