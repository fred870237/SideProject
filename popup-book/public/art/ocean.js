// 🐳 海洋：點動物會唸英文名字（鯨魚、海豚有真的叫聲），然後像機關書一樣動起來
// 版面 1600×1000；上面是天空，海面在 y ≈ 375，下面一大片海水，y ≈ 900 以下是沙地，左右兩邊有珊瑚
// 動物是 AI 生成的圖（art/img/ocean/*.webp）；水柱、泡泡、墨汁是程式噴的小顆粒
// 叫聲是 Pixabay 的音效（audio/sound/，來源見那裡的 CREDITS.md）
// 整個檔案包在 { } 裡，變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/ocean/${name}.webp`;
const IMG = (name, w, h, clip) =>
  `<image href="${SRC(name)}" width="${w}" height="${h}"${clip ? ` clip-path="url(#${clip})"` : ''}/>`;
const PATH = (pts) => 'M' + pts.map((p) => p.join(',')).join('L') + 'Z';
const RECT = (x0, y0, x1, y1) => PATH([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]);
const CLIP = (id, d) => `<clipPath id="${id}"><path d="${d}"/></clipPath>`;
const HOLE = (id, w, h, d) => `<clipPath id="${id}"><path clip-rule="evenodd" d="M0,0H${w}V${h}H0Z${d}"/></clipPath>`;
const WATER = '#bfe6ff', FOAM = '#ffffff';

// 整張圖放在零件 body 裡；inner 不給就是整張圖
const whole = (p, name, w, h, inner) =>
  `<g transform="translate(0 ${-h})"><g id="${p}-body">${inner ?? IMG(name, w, h)}</g></g>`;
// 圖的一塊（尾巴、鉗子）剪下來當會動的零件，身體那張圖把這塊挖掉
const withParts = (p, name, w, h, parts) =>
  HOLE(`${p}-hole`, w, h, Object.values(parts).join('')) + IMG(name, w, h, `${p}-hole`) +
  Object.entries(parts).map(([k, d]) => CLIP(`${p}-c${k}`, d) + `<g id="${p}-${k}">${IMG(name, w, h, `${p}-c${k}`)}</g>`).join('');
// 冒泡泡：往上飄的小圓圈
const bubbles = (c, x, y, n = 6) =>
  c.burst('body', x, y, { n, color: WATER, vx: [-0.6, 0.6], vy: [-2.5, -1.2], g: -0.02, size: [5, 11], life: 1400 });

// ---------- 鯨魚：浮上來從頭頂噴水柱，尾巴拍一拍 ----------
// 圖 831×364（臉朝右），噴氣孔在 (610, 75)，尾巴 (0～115, 0～135) 掛在 (110, 100)
const whale = {
  id: 'whale', en: 'Whale', zh: '鯨魚', x: 560, y: 575, s: 0.6,
  hint: [450, -220],
  pivots: { body: [415, 364], tail: [110, 100] },
  box: [0, -700, 831, 700],
  art: (p) => whole(p, 'whale', 831, 364, withParts(p, 'whale', 831, 364, { tail: RECT(0, 0, 115, 135) })),
  async act(c) {
    playSound('whale');
    await c.anim(700, { body: { ty: -40, r: -3 } });
    for (let i = 0; i < 6; i++) {
      c.burst('body', 610, 70, { n: 9, color: i % 2 ? FOAM : WATER, vx: [-2.5, 2.5], vy: [-13, -9], g: 0.35, size: [6, 13], life: 1100 });
      await c.wait(160);
    }
    for (let i = 0; i < 3; i++) {
      await c.anim(220, { tail: { r: 18 } });
      await c.anim(220, { tail: { r: -12 } });
    }
    await c.anim(600, { body: { ty: 0, r: 0 }, tail: { r: 0 } });
  },
};

// ---------- 海豚：「吱吱」跳出水面翻一圈，落下時濺起水花 ----------
// 圖 712×413（臉朝右）
const dolphin = {
  id: 'dolphin', en: 'Dolphin', zh: '海豚', x: 160, y: 610, s: 0.45,
  hint: [380, -280],
  pivots: { body: [356, 206] },
  box: [0, -760, 712, 760],
  art: (p) => whole(p, 'dolphin', 712, 413),
  async act(c) {
    playSound('dolphin');
    await c.anim(250, { body: { sy: 0.9, r: -20 } });
    c.burst('body', 356, 380, { n: 12, color: FOAM, vx: [-3, 3], vy: [-6, -2], g: 0.3, size: [6, 12] });
    // 往上跳、在最高點翻一圈、再掉回來
    await c.anim(1500, { body: { sy: 1 } }, (t) => c.set('body', {
      ty: -320 * Math.sin(t * Math.PI),
      r: -20 + 380 * Math.min(1, Math.max(0, (t - 0.25) / 0.5)),
    }));
    c.set('body', { ty: 0, r: 0 });
    c.burst('body', 356, 300, { n: 18, color: FOAM, vx: [-5, 5], vy: [-8, -3], g: 0.35, size: [7, 14] });
    c.burst('body', 356, 300, { n: 10, color: WATER, vx: [-4, 4], vy: [-6, -2], g: 0.3, size: [6, 11] });
    for (let i = 0; i < 2; i++) {
      await c.anim(160, { body: { ty: 15 } });
      await c.anim(160, { body: { ty: 0 } });
    }
  },
};

// ---------- 鯊魚：「Chomp chomp!」往前衝咬兩口，尾巴左右甩 ----------
// 圖 826×354（臉朝左），尾巴 (655～826) 掛在 (680, 240)
const shark = {
  id: 'shark', en: 'Shark', zh: '鯊魚', x: 1110, y: 560, s: 0.5,
  hint: [400, -220],
  pivots: { body: [413, 354], tail: [680, 240] },
  box: [-200, -354, 1026, 354],
  art: (p) => whole(p, 'shark', 826, 354, withParts(p, 'shark', 826, 354, { tail: RECT(655, 0, 826, 354) })),
  async act(c) {
    speak('Chomp chomp!', { queue: true });
    for (let i = 0; i < 2; i++) {
      await c.anim(350, { body: { tx: -100 * (i + 1), sx: 1.06, sy: 0.94 }, tail: { r: 15 } });
      await c.anim(200, { body: { sx: 0.96, sy: 1.06 }, tail: { r: -15 } });
      bubbles(c, 60, 180, 5);
      await c.anim(150, { body: { sx: 1, sy: 1 } });
    }
    for (let i = 0; i < 3; i++) {
      await c.anim(200, { tail: { r: 15 } });
      await c.anim(200, { tail: { r: -15 } });
    }
    await c.anim(900, { body: { tx: 0 }, tail: { r: 0 } });
  },
};

// ---------- 海龜：慢慢往上划水，冒出一串泡泡「Blub blub!」，再划回來 ----------
// 圖 727×428（臉朝右），嘴巴在 (700, 90)
const turtle = {
  id: 'turtle', en: 'Sea Turtle', zh: '海龜', x: 880, y: 770, s: 0.4,
  hint: [380, -300],
  pivots: { body: [363, 214] },
  box: [0, -628, 927, 628],
  art: (p) => whole(p, 'turtle', 727, 428),
  async act(c) {
    speak('Blub blub!', { queue: true });
    const paddle = (t) => c.set('body', { sy: 1 - 0.04 * Math.abs(Math.sin(t * Math.PI * 4)) });
    await c.anim(1600, { body: { tx: 200, ty: -200, r: -10 } }, paddle);
    for (let i = 0; i < 3; i++) { bubbles(c, 705, 85, 5); await c.wait(300); }
    await c.anim(1600, { body: { tx: 0, ty: 0, r: 0 } }, paddle);
    c.set('body', { sy: 1 });
  },
};

// ---------- 小丑魚：「Whoosh!」咻咻咻游來游去，尾巴搖不停 ----------
// 圖 676×395（臉朝右），尾鰭 (0～140, 200～395) 掛在 (140, 285)
const clownfish = {
  id: 'clownfish', en: 'Clownfish', zh: '小丑魚', x: 600, y: 810, s: 0.3,
  hint: [340, -220],
  pivots: { body: [338, 200], tail: [140, 285] },
  box: [-100, -595, 1076, 795],
  art: (p) => whole(p, 'clownfish', 676, 395, withParts(p, 'clownfish', 676, 395, { tail: RECT(0, 200, 140, 395) })),
  async act(c) {
    speak('Whoosh!', { queue: true });
    const wag = (t) => c.set('tail', { r: 20 * Math.sin(t * Math.PI * 10) });
    await c.anim(700, { body: { tx: 350, ty: -150 } }, wag);
    c.set('body', { sx: -1 });
    await c.anim(700, { body: { tx: 0, ty: 0 } }, wag);
    bubbles(c, 650, 180, 4);
    await c.anim(500, { body: { tx: -60, ty: 120 } }, wag);
    c.set('body', { sx: 1 });
    await c.anim(500, { body: { tx: 0, ty: 0 } }, wag);
    c.set('tail', { r: 0 });
  },
};

// ---------- 章魚：縮一下、噴一團墨汁、往上衝，再慢慢飄回來 ----------
// 圖 566×548（正面）
const octopus = {
  id: 'octopus', en: 'Octopus', zh: '章魚', x: 270, y: 905, s: 0.42,
  hint: [280, -420],
  pivots: { body: [283, 548] },
  box: [0, -848, 566, 848],
  art: (p) => whole(p, 'octopus', 566, 548),
  async act(c) {
    speak('Blub blub!', { queue: true });
    for (let i = 0; i < 2; i++) {
      await c.anim(250, { body: { sx: 1.12, sy: 0.85 } });
      await c.anim(250, { body: { sx: 0.95, sy: 1.05 } });
    }
    await c.anim(200, { body: { sx: 1.15, sy: 0.8 } });
    c.burst('body', 283, 450, { n: 22, color: '#3b2a52', vx: [-3, 3], vy: [0.5, 3], g: -0.03, size: [10, 22], life: 1600 });
    await c.anim(500, { body: { sx: 0.9, sy: 1.15, ty: -280 } });
    // 慢慢飄下來，左右搖
    await c.anim(1800, { body: { sx: 1, sy: 1, ty: 0 } }, (t) => c.set('body', { r: 8 * Math.sin(t * Math.PI * 4) }));
    c.set('body', { r: 0 });
  },
};

// ---------- 螃蟹：「Snip snap!」兩隻大鉗子夾夾夾，橫著走一段再走回來 ----------
// 圖 494×467（正面），左鉗 (0～135, 0～190) 掛在 (105, 195)，右鉗 (365～494, 0～175) 掛在 (395, 185)
const crab = {
  id: 'crab', en: 'Crab', zh: '螃蟹', x: 1130, y: 965, s: 0.32,
  hint: [247, -380],
  pivots: { body: [247, 467], left: [105, 195], right: [395, 185] },
  box: [-200, -567, 894, 567],
  art: (p) => whole(p, 'crab', 494, 467, withParts(p, 'crab', 494, 467, { left: RECT(0, 0, 135, 190), right: RECT(365, 0, 494, 175) })),
  async act(c) {
    speak('Snip snap!', { queue: true });
    for (let i = 0; i < 3; i++) {
      await c.anim(150, { left: { r: -18 }, right: { r: 18 } });
      await c.anim(150, { left: { r: 6 }, right: { r: -6 } });
    }
    await c.anim(150, { left: { r: 0 }, right: { r: 0 } });
    const scuttle = (t) => c.set('body', { ty: -12 * Math.abs(Math.sin(t * Math.PI * 8)) });
    await c.anim(1000, { body: { tx: 180 } }, scuttle);
    c.burst('body', 247, 460, { n: 8, color: '#f3d9a8', vx: [-2, 2], vy: [-2, -0.5], g: 0.12, size: [5, 9] });
    await c.anim(1600, { body: { tx: -180 } }, scuttle);
    c.burst('body', 247, 460, { n: 8, color: '#f3d9a8', vx: [-2, 2], vy: [-2, -0.5], g: 0.12, size: [5, 9] });
    await c.anim(800, { body: { tx: 0 } }, scuttle);
    c.set('body', { ty: 0 });
  },
};

SCENES['ocean'] = {
  w: 1600,
  h: 1000,
  bg: () => `
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <text x="56" y="98" font-size="60" font-weight="900" fill="${LINE}">Ocean</text>
    <text x="58" y="148" font-size="38" font-weight="900" fill="${LINE}" opacity=".7">海洋</text>
  `,
  // 先畫後排（遠的），再畫前排
  items: [whale, shark, dolphin, turtle, clownfish, octopus, crab],
};
}
