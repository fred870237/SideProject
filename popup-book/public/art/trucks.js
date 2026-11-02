// 🚛 貨運卡車：點車子會唸英文名字，然後像機關書一樣動起來
// 版面 1600×1000；人行道到 y ≈ 604，下面是馬路；後排地面 y = 720，前排地面 y = 975
// 車子和背景是 AI 生成的圖（art/img/trucks/*.webp），做法跟工地那一頁一樣（見 construction.js 開頭的說明）
// 整個檔案包在 { } 裡，車子的變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/trucks/${name}.webp`;
const IMG = (name, w, h, clip) =>
  `<image href="${SRC(name)}" width="${w}" height="${h}"${clip ? ` clip-path="url(#${clip})"` : ''}/>`;
const PATH = (pts) => 'M' + pts.map((p) => p.join(',')).join('L') + 'Z';
const RECT = (x0, y0, x1, y1) => PATH([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]);
const CLIP = (id, d) => `<clipPath id="${id}"><path d="${d}"/></clipPath>`;
const HOLE = (id, w, h, d) => `<clipPath id="${id}"><path clip-rule="evenodd" d="M0,0H${w}V${h}H0Z${d}"/></clipPath>`;
const CIRCLE = (cx, cy, r) => `M${cx - r},${cy}a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0Z`;
// 把整張圖切成「車身＋幾個會動的零件」：parts = { 零件名: 裁切範圍 d }，wheels 的零件會加上 .wheel 讓 c.wheels() 轉
function cut(p, name, w, h, parts, wheels = {}) {
  const all = { ...parts, ...Object.fromEntries(Object.entries(wheels).map(([k, [cx, cy, r]]) => [k, CIRCLE(cx, cy, r)])) };
  let out = HOLE(`${p}-cb`, w, h, Object.values(all).join('')) + IMG(name, w, h, `${p}-cb`);
  for (const [k, d] of Object.entries(all)) {
    const wh = wheels[k];
    out += CLIP(`${p}-c${k}`, d) +
      `<g id="${p}-${k}"${wh ? ` class="wheel" data-cx="${wh[0]}" data-cy="${wh[1]}"` : ''}>${IMG(name, w, h, `${p}-c${k}`)}</g>`;
  }
  return out;
}
const SMOKE = { n: 2, color: '#9a9ea8', vx: [-0.8, 0.2], vy: [-2.6, -1.4], g: -0.02, size: [10, 18], life: 1000 };
// 紙箱（扁平色塊），左上角在 (x, y)
const BOX = (x, y, w, h) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#d9a35b"/><rect x="${x}" y="${y + h * 0.7}" width="${w}" height="${h * 0.3}" fill="#bf8740"/>` +
  `<rect x="${x + w * 0.42}" y="${y}" width="${w * 0.16}" height="${h}" fill="#f0d29a"/>`;

// ---------- 聯結車：叭叭兩聲，排氣管冒煙，往前開一小段再倒回來 ----------
// 圖 874×339；兩根排氣管頂端在 (615, 10)、(680, 10)
const semi = {
  id: 'semi', en: 'Semi Truck', zh: '聯結車', x: 20, y: 720, s: 0.55,
  hint: [730, -200],
  art(p) {
    return `<g id="${p}-body"><g transform="translate(0 -339)">${IMG('semi', 874, 339)}</g></g>`;
  },
  async act(c) {
    speak('Honk honk!');
    for (let i = 0; i < 6; i++) {
      c.burst('body', 615, -330, SMOKE);
      c.burst('body', 680, -330, SMOKE);
      await c.anim(120, { body: { ty: -5 } });
      await c.anim(120, { body: { ty: 0 } });
    }
    await c.anim(900, { body: { tx: 40 } });
    await c.anim(900, { body: { tx: 0 } });
  },
};

// ---------- 垃圾車：把垃圾桶舉起來倒進車斗，再放回地上 ----------
// 圖 841×485；車斗在左邊（車尾），垃圾桶畫在車尾後面的地上
const garbage = {
  id: 'garbage', en: 'Garbage Truck', zh: '垃圾車', x: 600, y: 720, s: 0.36,
  hint: [500, -260],
  pivots: { bin: [-40, 485] },
  art(p) {
    return '<g transform="translate(0 -485)">' + IMG('garbage', 841, 485) +
      `<g id="${p}-bin">` +
        '<path d="M-150,335 H-40 L-48,485 H-142Z" fill="#3f6fb5"/><path d="M-150,335 H-95 L-99,485 H-142Z" fill="#4f82cc"/>' +
        '<rect x="-158" y="320" width="126" height="20" rx="6" fill="#2f568f"/><circle cx="-58" cy="470" r="16" fill="#2d2a3a"/>' +
      '</g>' +
    '</g>';
  },
  async act(c) {
    await c.anim(900, { bin: { tx: 70, ty: -330, r: 115 } });
    for (let i = 0; i < 4; i++) {
      c.burst('bin', -95, 335, { n: 4, color: ['#8a6a4a', '#d9534f', '#f0c419', '#6b7280'][i], vx: [0.5, 2], vy: [0, 2], g: 0.3, size: [5, 10], life: 600 });
      await c.anim(150, { bin: { r: 125 } });
      await c.anim(150, { bin: { r: 115 } });
    }
    await c.anim(900, { bin: { tx: 0, ty: 0, r: 0 } });
  },
};

// ---------- 送貨車：側門滑開，一個包裹跳出來落到地上 ----------
// 圖 925×506；側門 (290, 42)～(460, 305)，門後面補一個放滿紙箱的車廂
const VAN_DOOR = RECT(290, 42, 460, 305);
const van = {
  id: 'van', en: 'Delivery Van', zh: '送貨車', x: 1000, y: 720, s: 0.36,
  hint: [375, -320],
  art(p) {
    return '<g transform="translate(0 -506)">' +
      HOLE(`${p}-cb`, 925, 506, VAN_DOOR) + IMG('van', 925, 506, `${p}-cb`) +
      '<rect x="290" y="42" width="170" height="263" fill="#3d4250"/><rect x="290" y="170" width="170" height="10" fill="#5a6070"/>' +
      BOX(300, 100, 70, 70) + BOX(378, 115, 60, 55) + BOX(305, 235, 60, 70) +
      `<g id="${p}-box">${BOX(375, 235, 70, 70)}</g>` +
      CLIP(`${p}-cd`, VAN_DOOR) +
      `<g id="${p}-door">${IMG('van', 925, 506, `${p}-cd`)}</g>` +
    '</g>';
  },
  async act(c) {
    c.set('box', { tx: 0, ty: 0, r: 0, o: 1 });
    await c.anim(600, { door: { tx: -175 } });
    await c.anim(300, { box: { ty: -50, tx: 20 } });
    await c.anim(400, { box: { ty: 506 - 305, tx: 60, r: 15 } });
    await c.anim(150, { box: { ty: 506 - 315, r: 0 } });
    await c.anim(150, { box: { ty: 506 - 305 } });
    await c.wait(500);
    await c.anim(600, { door: { tx: 0 } });
    await c.anim(400, { box: { o: 0 } });
    c.set('box', { tx: 0, ty: 0 });
    await c.anim(300, { box: { o: 1 } });
  },
};

// ---------- 冰淇淋車：車頂的冰淇淋跳起來搖一搖，噴出彩色糖粒 ----------
// 圖 647×500；冰淇淋插在車頂 (195, 150)
const icecream = {
  id: 'icecream', en: 'Ice Cream Truck', zh: '冰淇淋車', x: 1380, y: 720, s: 0.3,
  hint: [330, -260],
  pivots: { cone: [195, 150] },
  art(p) {
    return '<g transform="translate(0 -500)">' + cut(p, 'icecream', 647, 500, { cone: RECT(95, 0, 248, 152) }) + '</g>';
  },
  async act(c) {
    await c.wait(500);
    speak('Ice cream!');
    for (let i = 0; i < 3; i++) {
      await c.anim(180, { cone: { ty: -60, r: 12 } });
      ['#ff6b9a', '#6ec3ff', '#ffd23f', '#9be27b'].forEach((color) =>
        c.burst('cone', 150, 20, { n: 3, color, vx: [-3, 3], vy: [-5, -2], g: 0.25, size: [5, 9], life: 800 }));
      await c.anim(180, { cone: { ty: 0, r: -12 } });
    }
    await c.anim(180, { cone: { r: 0 } });
  },
};

// ---------- 汽車運輸車：上層的車架往後傾斜，紅色小車滑下去一點再開回來 ----------
// 圖 847×352；上層車架和上面兩台車一起轉，轉軸在車架前端
const carrier = {
  id: 'carrier', en: 'Car Carrier', zh: '汽車運輸車', x: 40, y: 975, s: 0.6,
  hint: [200, -310],
  pivots: { deck: [620, 85] },
  art(p) {
    return '<g transform="translate(0 -352)">' +
      HOLE(`${p}-cb`, 847, 352, RECT(0, 0, 645, 98)) + IMG('carrier', 847, 352, `${p}-cb`) +
      // 車架那張圖要挖掉紅色小車（evenodd），小車另外裁一張
      `<clipPath id="${p}-cd"><path clip-rule="evenodd" d="${RECT(0, 0, 645, 98)}${RECT(68, 0, 335, 74)}"/></clipPath>` +
      CLIP(`${p}-cr`, RECT(68, 0, 335, 74)) +
      `<g id="${p}-deck">${IMG('carrier', 847, 352, `${p}-cd`)}` +
        `<g id="${p}-car">${IMG('carrier', 847, 352, `${p}-cr`)}</g>` +
      '</g>' +
    '</g>';
  },
  async act(c) {
    await c.anim(800, { deck: { r: -6 } });
    await c.anim(700, { car: { tx: -60 } });
    await c.wait(400);
    await c.anim(700, { car: { tx: 0 } });
    await c.anim(800, { deck: { r: 0 } });
  },
};

// ---------- 怪獸卡車：蹲下去，用力跳起來，落地彈兩下 ----------
// 圖 865×621；輪胎疊在一起不是正圓，所以整台一起跳
const monster = {
  id: 'monster', en: 'Monster Truck', zh: '怪獸卡車', x: 640, y: 975, s: 0.42,
  hint: [430, -470],
  pivots: { body: [430, 621] },
  art(p) {
    return `<g id="${p}-body"><g transform="translate(0 -621)">${IMG('monster', 865, 621)}</g></g>`;
  },
  async act(c) {
    await c.anim(300, { body: { sy: 0.88 } });
    await c.anim(450, { body: { sy: 1.05, ty: -260, r: -8 } });
    await c.anim(250, { body: { r: 4 } });
    await c.anim(400, { body: { sy: 1, ty: 0, r: 0 } });
    c.burst('body', 120, 0, { n: 10, color: '#a7a9b0', vx: [-3, -0.5], vy: [-3, -1], size: [6, 12] });
    c.burst('body', 760, 0, { n: 10, color: '#a7a9b0', vx: [0.5, 3], vy: [-3, -1], size: [6, 12] });
    await c.anim(150, { body: { sy: 0.9 } });
    await c.anim(200, { body: { sy: 1, ty: -40 } });
    await c.anim(200, { body: { ty: 0 } });
  },
};

// ---------- 掃街車：前面的圓刷轉起來，揚起灰塵，往前掃一段再倒回來 ----------
// 圖 747×432；圓刷中心 (665, 312)
const sweeper = {
  id: 'sweeper', en: 'Street Sweeper', zh: '掃街車', x: 1170, y: 975, s: 0.44,
  hint: [660, -140],
  pivots: { brush: [665, 312] },
  art(p) {
    return `<g id="${p}-body"><g transform="translate(0 -432)">` +
      cut(p, 'sweeper', 747, 432, { brush: CIRCLE(665, 312, 88) }, { w1: [148, 357, 76], w2: [532, 357, 76] }) +
    '</g></g>';
  },
  async act(c) {
    const brush = c.anim(3400, { brush: { r: c.get('brush').r + 2160 } });
    const dust = setInterval(() => c.burst('body', 700, -15, { n: 3, color: '#b9bcc4', vx: [-1, 2], vy: [-2.5, -0.8], g: 0.05, size: [6, 12], life: 800 }), 120);
    await c.anim(1500, { body: { tx: 200 }, ...c.wheels(160) });
    await c.wait(200);
    await c.anim(1500, { body: { tx: 0 }, ...c.wheels(-160) });
    clearInterval(dust);
    await brush;
  },
};

SCENES.trucks = {
  w: 1600,
  h: 1000,
  bg: () => `
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <text x="56" y="98" font-size="60" font-weight="900" fill="${LINE}">Trucks</text>
    <text x="58" y="148" font-size="38" font-weight="900" fill="${LINE}" opacity=".7">貨運卡車</text>
  `,
  // 先畫後排，再畫前排
  items: [semi, garbage, van, icecream, carrier, monster, sweeper],
};
}
