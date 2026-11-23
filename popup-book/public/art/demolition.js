// 🏚️ 拆房子：點機器會唸英文名字，然後像機關書一樣動起來
// 版面 1600×1000；右邊是拆到一半的舊房子（破掉的左邊牆在 x ≈ 925），左邊是工地圍籬和一堆水泥塊，地面從 y ≈ 720 開始
// 機器和背景是 AI 生成的圖（art/img/demolition/*.webp），做法跟工地那一頁一樣（見 construction.js 開頭的說明）
// 零件的座標是圖上的像素；整個檔案包在 { } 裡，變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/demolition/${name}.webp`;
const IMG = (name, w, h, clip) =>
  `<image href="${SRC(name)}" width="${w}" height="${h}"${clip ? ` clip-path="url(#${clip})"` : ''}/>`;
const PATH = (pts) => 'M' + pts.map((p) => p.join(',')).join('L') + 'Z';
const RECT = (x0, y0, x1, y1) => PATH([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]);
const CIRCLE = (cx, cy, r) => `M${cx - r},${cy}a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0Z`;
const CLIP = (id, d) => `<clipPath id="${id}"><path d="${d}"/></clipPath>`;
const HOLE = (id, w, h, d) => `<clipPath id="${id}"><path clip-rule="evenodd" d="M0,0H${w}V${h}H0Z${d}"/></clipPath>`;
const BRICK = '#d9532c', CONCRETE = '#9a9ca4', DUST = '#d8cbb4';

// ---------- 錘球吊車：大鐵球往後盪，再「碰！」地撞上舊房子的牆，磚塊掉下來 ----------
// 圖 794×575；鋼索從吊臂尖端 (662, 85) 垂下來，鐵球在 (662, 300～405)
// AI 在旁邊多畫了一條斷掉的鋼索 (700～720)，所以鋼索和鐵球那一塊整個從車身裁掉，鋼索改用 SVG 線重畫
const BALL = RECT(608, 290, 718, 408);
const wrecking = {
  id: 'wrecking', en: 'Wrecking Ball Crane', zh: '錘球吊車', x: 372, y: 765, s: 0.75,
  hint: [300, -300],
  pivots: { swing: [662, 85] },
  focus: false, // 在原地撞：放大到中間的話，鐵球就對不到背景裡房子的牆
  art(p) {
    const cut = PATH([[598, 165], [690, 100], [762, 55], [762, 420], [598, 420]]);
    return '<g transform="translate(0 -575)">' +
      HOLE(`${p}-cb`, 794, 575, cut) + IMG('wrecking', 794, 575, `${p}-cb`) +
      CLIP(`${p}-cl`, BALL) +
      `<g id="${p}-swing"><line x1="662" y1="85" x2="662" y2="300" stroke="#26272e" stroke-width="5"/>` +
        IMG('wrecking', 794, 575, `${p}-cl`) + '</g>' +
    '</g>';
  },
  async act(c) {
    speak('Swing!', { queue: true });
    await c.anim(1000, { swing: { r: 28 } }); // 往後盪
    await c.anim(550, { swing: { r: -20 } }, null, (t) => t * t); // 越盪越快，撞上牆
    speak('Crash!', { queue: true });
    c.burst('swing', 718, 350, { n: 18, color: BRICK, vx: [-1, 4], vy: [-5, -1], g: 0.3, size: [8, 16], life: 1200 });
    c.burst('swing', 718, 350, { n: 12, color: DUST, vx: [-1, 3], vy: [-2, 0], g: -0.02, size: [12, 22], life: 1300 });
    await c.anim(260, { swing: { r: -12 } });
    await c.anim(260, { swing: { r: -19 } });
    await c.anim(900, { swing: { r: 10 } });
    await c.anim(600, { swing: { r: -4 } });
    await c.anim(400, { swing: { r: 0 } });
  },
};

// ---------- 碎石機：大石塊從後面倒進漏斗，齒輪轉、機器抖，碎石由前面的輸送帶往上送出去 ----------
// 圖 1323×501（車頭在右）；漏斗口在後面上方 (215～425, 0)，大齒輪中心 (487, 248)，
// 輸送帶從 (715, 235) 往右上到尾端 (1300, 95)，碎石從尾端掉下來
const GEAR = CIRCLE(487, 248, 72);
const GRAVEL = '#cfcbc2'; // 輸送帶是深色的，碎石用淺一點的灰才看得到
const crusher = {
  id: 'crusher', en: 'Rock Crusher', zh: '碎石機', x: 610, y: 990, s: 0.4,
  hint: [480, -330],
  pivots: { body: [480, 501], gear: [487, 248] },
  art(p) {
    return `<g transform="translate(0 -501)"><g id="${p}-body">` +
      HOLE(`${p}-cb`, 1323, 501, GEAR) + IMG('crusher', 1323, 501, `${p}-cb`) +
      CLIP(`${p}-cg`, GEAR) + `<g id="${p}-gear">${IMG('crusher', 1323, 501, `${p}-cg`)}</g>` +
    '</g></g>';
  },
  async act(c) {
    // 1. 大水泥塊從後面上方掉進漏斗
    for (let i = 0; i < 3; i++) {
      c.burst('body', 320, -70, { n: 3, color: CONCRETE, vx: [-0.8, 0.8], vy: [0, 1], g: 0.35, size: [16, 26], life: 450 });
      await c.wait(250);
    }
    // 2. 喀啦喀啦咬碎：齒輪轉、整台抖；碎石沿著輸送帶往右上跑，從尾端掉下來
    speak('Crunch crunch!', { queue: true });
    let rot = 0;
    await c.anim(2600, {}, (t) => {
      rot += 9;
      c.set('gear', { r: rot });
      c.set('body', { tx: 2.5 * Math.sin(t * Math.PI * 50), ty: -1.5 * Math.abs(Math.sin(t * Math.PI * 36)) });
      if (t > 0.1 && Math.random() < 0.7) {
        const k = Math.random(); // 輸送帶上的位置（0 = 起點，1 = 尾端）
        c.burst('body', 730 + k * 540, 222 - k * 135, { n: 1, color: GRAVEL, vx: [1.6, 2], vy: [-0.55, -0.43], g: 0, size: [7, 11], life: 600 });
      }
      if (t > 0.3 && Math.random() < 0.45) c.burst('body', 1305, 90, { n: 2, color: GRAVEL, vx: [0.3, 1.4], vy: [-0.8, 0.3], g: 0.3, size: [7, 11], life: 1000 });
      if (Math.random() < 0.12) c.burst('body', 320, 20, { n: 1, color: DUST, vx: [-1, 1], vy: [-2, -0.5], g: -0.02, size: [12, 20], life: 1000 });
    }, (t) => t);
    c.set('body', { tx: 0, ty: 0 });
  },
};

// ---------- 破碎機：挖土機手臂前面的大鑽頭「噠噠噠」敲碎水泥 ----------
// 圖 824×659；鑽頭和固定架在 (620～800, 95～545)，鑽頭尖端在 (650, 540)
const TOOL = PATH([[652, 92], [800, 92], [800, 232], [722, 232], [700, 548], [600, 548], [622, 455], [650, 210]]);
const breaker = {
  id: 'breaker', en: 'Hydraulic Breaker', zh: '破碎機', x: 330, y: 992, s: 0.48,
  hint: [430, -420],
  art(p) {
    return '<g transform="translate(0 -659)">' +
      HOLE(`${p}-cb`, 824, 659, TOOL) + IMG('breaker', 824, 659, `${p}-cb`) +
      CLIP(`${p}-ct`, TOOL) + `<g id="${p}-tool">${IMG('breaker', 824, 659, `${p}-ct`)}</g>` +
    '</g>';
  },
  async act(c) {
    await c.anim(300, { tool: { ty: -25 } });
    speak('Rat-a-tat-tat!', { queue: true });
    await c.anim(2000, {}, (t) => {
      c.set('tool', { ty: -6 + 6 * Math.sin(t * Math.PI * 60) });
      if (Math.random() < 0.35) c.burst('tool', 650, 545, { n: 2, color: CONCRETE, vx: [-3, 3], vy: [-4, -1], g: 0.3, size: [6, 12] });
      if (Math.random() < 0.15) c.burst('tool', 650, 540, { n: 1, color: DUST, vx: [-1, 1], vy: [-1.5, -0.3], g: -0.02, size: [12, 22], life: 1200 });
    }, (t) => t);
    await c.anim(300, { tool: { ty: 0 } });
  },
};

// ---------- 拆除剪：大鉗子張開、「喀嚓」合起來咬碎水泥 ----------
// 圖 894×553；上面那一片鉗子（橘色臂的尖端和往下的牙齒）繞 (712, 62) 轉，下面灰色的鉗子不動
const JAW = PATH([[700, 32], [790, 0], [852, 0], [852, 78], [804, 76], [742, 82], [704, 88]]);
const shear = {
  id: 'shear', en: 'Demolition Shear', zh: '拆除剪', x: 1125, y: 992, s: 0.52,
  hint: [430, -400],
  pivots: { jaw: [712, 62], body: [200, 553] },
  art(p) {
    return `<g id="${p}-body"><g transform="translate(0 -553)">` +
      HOLE(`${p}-cb`, 894, 553, JAW) + IMG('shear', 894, 553, `${p}-cb`) +
      CLIP(`${p}-cj`, JAW) + `<g id="${p}-jaw">${IMG('shear', 894, 553, `${p}-cj`)}</g>` +
    '</g></g>';
  },
  async act(c) {
    for (let i = 0; i < 3; i++) {
      await c.anim(350, { jaw: { r: -14 } }); // 張大
      speak('Snip snap!', { queue: true });
      await c.anim(200, { jaw: { r: 16 } }, null, (t) => t * t); // 喀嚓合起來
      c.burst('jaw', 780, 140, { n: 10, color: CONCRETE, vx: [-2.5, 2.5], vy: [-3, 0], g: 0.3, size: [6, 12] });
      c.burst('jaw', 780, 140, { n: 3, color: DUST, vx: [-1, 1], vy: [-1.5, 0], g: -0.02, size: [12, 20], life: 1000 });
      await c.anim(120, { body: { r: 0.8 } });
      await c.anim(160, { body: { r: 0 } });
    }
    await c.anim(400, { jaw: { r: 0 } });
  },
};

// ---------- 灑水霧砲車：後面的大風扇轉起來，噴出水霧把灰塵壓下來 ----------
// 圖 912×505（車頭在左）；風扇的圓臉在 (815, 125)，水霧往右上噴
const FAN = CIRCLE(815, 125, 74);
const dust = {
  id: 'dust', en: 'Dust Control Truck', zh: '灑水霧砲車', x: 0, y: 992, s: 0.4,
  hint: [500, -300],
  pivots: { fan: [815, 125] },
  box: [0, -700, 1400, 700], // 噴出去的水霧也要看得到
  art(p) {
    return '<g transform="translate(0 -505)">' +
      IMG('dust', 912, 505) +
      CLIP(`${p}-cf`, FAN) + `<g id="${p}-fan">${IMG('dust', 912, 505, `${p}-cf`)}</g><g id="${p}-mist"></g>` + // 水霧從 mist 噴出來（不跟著風扇轉）
    '</g>';
  },
  async act(c) {
    speak('Whoosh!', { queue: true });
    await c.anim(2600, {}, (t) => {
      c.set('fan', { r: 1440 * t * t });
      if (t > 0.2 && Math.random() < 0.7) {
        c.burst('mist', 880, 110, { n: 3, color: Math.random() < 0.5 ? '#bfe6ff' : '#ffffff', vx: [4, 9], vy: [-4, -1], g: 0.06, size: [8, 16], life: 1100 });
      }
    }, (t) => t);
    await c.anim(700, { fan: { r: 1440 + 180 } });
    c.set('fan', { r: 0 });
  },
};

// ---------- 砂石車：車斗抬起來，把碎磚和水泥塊倒出去 ----------
// 圖 877×467（車頭在右）；車斗繞後面下方 (70, 255) 抬起，碎石從車斗後面 (0, 220) 倒出來
const BED = PATH([[0, 20], [560, 0], [708, 0], [704, 58], [640, 92], [602, 262], [60, 262], [0, 252]]);
const dump = {
  id: 'dump', en: 'Dump Truck', zh: '砂石車', x: 40, y: 800, s: 0.42,
  hint: [430, -300],
  pivots: { bed: [70, 255] },
  art(p) {
    return '<g transform="translate(0 -467)">' +
      HOLE(`${p}-cb`, 877, 467, BED) + IMG('dump', 877, 467, `${p}-cb`) +
      CLIP(`${p}-cd`, BED) + `<g id="${p}-bed">${IMG('dump', 877, 467, `${p}-cd`)}</g>` +
    '</g>';
  },
  async act(c) {
    await c.anim(1200, { bed: { r: -32 } });
    speak('Dump it out!', { queue: true });
    for (let i = 0; i < 10; i++) {
      c.burst('bed', 10, 200, { n: 3, color: Math.random() < 0.6 ? CONCRETE : BRICK, vx: [-2.5, -0.5], vy: [-1, 1], g: 0.35, size: [8, 16], life: 800 });
      await c.wait(120);
    }
    c.burst('bed', 10, 230, { n: 6, color: DUST, vx: [-1.5, 0], vy: [-1, 0], g: -0.02, size: [14, 24], life: 1200 });
    await c.wait(300);
    await c.anim(1100, { bed: { r: 0 } });
  },
};

SCENES.demolition = {
  w: 1600,
  h: 1000,
  bg: () => `
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <text x="56" y="98" font-size="60" font-weight="900" fill="${LINE}">Demolition</text>
    <text x="58" y="148" font-size="38" font-weight="900" fill="${LINE}" opacity=".7">拆房子</text>
  `,
  // 先畫後排，再畫前排
  items: [dump, wrecking, crusher, breaker, shear, dust],
};
}
