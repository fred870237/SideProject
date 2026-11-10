// 🚜 農場：點車子會唸英文名字，然後像機關書一樣動起來
// 版面 1600×1000；草地到 y ≈ 630，下面是泥土路；後排地面 y = 705，前排地面 y = 975
// 車子和背景是 AI 生成的圖（art/img/farm/*.webp），做法跟工地那一頁一樣（見 construction.js 開頭的說明）
// 整個檔案包在 { } 裡，車子的變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/farm/${name}.webp`;
const IMG = (name, w, h, clip) =>
  `<image href="${SRC(name)}" width="${w}" height="${h}"${clip ? ` clip-path="url(#${clip})"` : ''}/>`;
const PATH = (pts) => 'M' + pts.map((p) => p.join(',')).join('L') + 'Z';
const RECT = (x0, y0, x1, y1) => PATH([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]);
const CLIP = (id, d) => `<clipPath id="${id}"><path d="${d}"/></clipPath>`;
const HOLE = (id, w, h, d) => `<clipPath id="${id}"><path clip-rule="evenodd" d="M0,0H${w}V${h}H0Z${d}"/></clipPath>`;
const CIRCLE = (cx, cy, r) => `M${cx - r},${cy}a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0Z`;
// 把整張圖切成「車身＋幾個會動的零件」：parts = { 零件名: 裁切範圍 d }
// wheels = { w1: [cx, cy], ... }：輪子用 tools/ai-art/rig.py 拆好的圖層（<圖名>-w1.webp…，正圓、只有外圈胎紋），
// 加上 .wheel 讓 c.wheels() 轉；輪框和擋在輪子前面的東西在 <圖名>-front.webp，蓋在輪子上面不動
// （front 會挖掉 parts 的範圍，零件動的時候才不會留下一塊不動的分身）
function cut(p, name, w, h, parts, wheels = {}) {
  let out = HOLE(`${p}-cb`, w, h, Object.values(parts).join('')) + IMG(name, w, h, `${p}-cb`);
  for (const [k, [cx, cy]] of Object.entries(wheels)) {
    out += `<g id="${p}-${k}" class="wheel" data-cx="${cx}" data-cy="${cy}">${IMG(`${name}-${k}`, w, h)}</g>`;
  }
  if (Object.keys(wheels).length) out += HOLE(`${p}-cf`, w, h, Object.values(parts).join('')) + IMG(`${name}-front`, w, h, `${p}-cf`);
  for (const [k, d] of Object.entries(parts)) out += CLIP(`${p}-c${k}`, d) + `<g id="${p}-${k}">${IMG(name, w, h, `${p}-c${k}`)}</g>`;
  return out;
}
const SMOKE = { n: 2, color: '#9a9ea8', vx: [-0.8, 0.2], vy: [-2.6, -1.4], g: -0.02, size: [10, 18], life: 1000 };
const GRAIN = '#f2c14e';
// 圓形的牧草捆（扁平色塊＋捲起來的紋路），中心在 (0, 0)
const BALE = (r) =>
  `<circle r="${r}" fill="#e8b23a"/><circle r="${r * 0.86}" fill="${GRAIN}"/>` +
  `<path d="M0,0 m${r * 0.12},0 a${r * 0.12},${r * 0.12} 0 1,0 ${-r * 0.24},0 a${r * 0.3},${r * 0.3} 0 1,0 ${r * 0.54},0 a${r * 0.5},${r * 0.5} 0 1,0 ${-r * 0.92},0 a${r * 0.7},${r * 0.7} 0 1,0 ${r * 1.32},0" ` +
  `stroke="#c98f1e" stroke-width="${r * 0.06}" fill="none" stroke-linecap="round"/>`;

// ---------- 農藥噴灑機：從右邊飛出去，繞一圈從左邊飛回來，一路噴霧 ----------
// 圖 642×284；螺旋槳在最右邊，用上下縮放假裝在轉（中間的機鼻不裁）
const PLANE = { x: 700, y: 230, s: 0.42, r: -6 };
const plane = {
  id: 'plane', en: 'Crop Duster', zh: '農藥噴灑機', ...PLANE,
  hint: [330, -150],
  pivots: { prop: [622, 100] },
  art(p) {
    return `<g id="${p}-body"><g transform="translate(0 -284)">` +
      cut(p, 'plane', 642, 284, { prop: RECT(606, 0, 642, 72) + RECT(606, 128, 642, 284) }) +
    '</g></g>';
  },
  async act(c) {
    const out = (1700 - PLANE.x) / PLANE.s, back = -(PLANE.x + 300) / PLANE.s;
    let flying = true;
    const prop = c.tween(5200, (t) => c.set('prop', { sy: Math.cos(t * 90 * Math.PI) }), (t) => t);
    const mist = (async () => {
      while (flying) {
        c.burst('body', 300, -70, { n: 3, color: '#9fd4f2', vx: [-1.5, -0.5], vy: [0.5, 1.5], g: 0.03, size: [5, 10], life: 900 });
        await c.wait(90);
      }
    })();
    await c.anim(2000, { body: { tx: out, ty: -60 } });
    c.set('body', { tx: back, ty: 60 });
    await c.anim(2400, { body: { tx: 0, ty: 0 } });
    flying = false;
    await mist;
    await prop;
    c.set('prop', { sy: 1 });
  },
};

// ---------- 風車：風扇轉起來 ----------
// 圖 334×684；風扇中心 (165, 162)，用圓形裁出來轉；後面補兩條塔頂的鐵架
const windmill = {
  id: 'windmill', en: 'Windmill', zh: '風車', x: 1390, y: 620, s: 0.45,
  hint: [165, -522],
  pivots: { fan: [165, 162] },
  art(p) {
    return '<g transform="translate(0 -684)">' +
      HOLE(`${p}-cb`, 334, 684, CIRCLE(165, 162, 170)) + IMG('windmill', 334, 684, `${p}-cb`) +
      '<path d="M132,332 L160,175 M200,332 L172,175" stroke="#8f96a3" stroke-width="7"/>' +
      CLIP(`${p}-cf`, CIRCLE(165, 162, 170)) +
      `<g id="${p}-fan">${IMG('windmill', 334, 684, `${p}-cf`)}</g>` +
    '</g>';
  },
  async act(c) {
    await c.anim(3000, { fan: { r: c.get('fan').r + 1080 } });
  },
};

// ---------- 小貨車：叭叭兩聲，車上的牧草跳一跳，開出去再倒回來 ----------
// 圖 869×451
const pickup = {
  id: 'pickup', en: 'Pickup Truck', zh: '小貨車', x: 250, y: 700, s: 0.4, r: 3,
  hint: [560, -290],
  pivots: { bales: [210, 240] },
  art(p) {
    return `<g id="${p}-body"><g transform="translate(0 -451)">` +
      cut(p, 'pickup', 869, 451, { bales: RECT(0, 86, 410, 248) },
        { w1: [189.5, 346.5], w2: [452.5, 360], w3: [769, 349.5] }) +
    '</g></g>';
  },
  async act(c) {
    speak('Beep beep!', { queue: true });
    for (let i = 0; i < 2; i++) {
      await c.anim(160, { bales: { ty: -30 } });
      await c.anim(160, { bales: { ty: 0 } });
    }
    await c.anim(1200, { body: { tx: 300 }, ...c.wheels(260) }, (t) => c.set('bales', { ty: -Math.abs(Math.sin(t * Math.PI * 6)) * 12 }));
    await c.wait(250);
    await c.anim(1200, { body: { tx: 0 }, ...c.wheels(-260) }, (t) => c.set('bales', { ty: -Math.abs(Math.sin(t * Math.PI * 6)) * 12 }));
    c.set('bales', { ty: 0 });
  },
};

// ---------- 牧草打捆機：後門往上打開，滾出一捆圓圓的牧草 ----------
// 圖 731×635；後門在左邊，鉸鍊在上面；門後面用深色補上，牧草捆一開始藏在門裡
const BALER_DOOR = PATH([[70, 70], [150, 30], [245, 22], [262, 40], [238, 120], [226, 210], [236, 300], [252, 382], [160, 384], [78, 372], [62, 250]]);
const baler = {
  id: 'baler', en: 'Hay Baler', zh: '牧草打捆機', x: 1000, y: 700, s: 0.32,
  hint: [160, -420],
  pivots: { door: [245, 26] },
  art(p) {
    return '<g transform="translate(0 -635)">' +
      HOLE(`${p}-cb`, 731, 635, BALER_DOOR) + IMG('baler', 731, 635, `${p}-cb`) +
      `<path d="${BALER_DOOR}" fill="#6b3108"/>` +
      `<g id="${p}-bale" opacity="0"><g transform="translate(160 240)"><g id="${p}-roll">${BALE(105)}</g></g></g>` +
      CLIP(`${p}-cd`, BALER_DOOR) +
      `<g id="${p}-door">${IMG('baler', 731, 635, `${p}-cd`)}</g>` +
    '</g>';
  },
  async act(c) {
    c.set('bale', { o: 1, tx: 0, ty: 0 });
    c.set('roll', { r: 0 });
    await c.anim(700, { door: { r: 60 } });
    // 從門口掉到地上（牧草捆半徑 105，地面在 y = 635）
    await c.anim(500, { bale: { tx: -140, ty: 635 - 105 - 240 }, roll: { r: -90 } });
    await c.anim(1100, { bale: { tx: -560 }, roll: { r: -330 } });
    await c.anim(600, { door: { r: 0 } });
    await c.wait(600);
    await c.anim(400, { bale: { o: 0 } });
  },
};

// ---------- 四輪越野車：前輪抬起來跳一下，往前衝再倒回來 ----------
// 圖 713×621
const quad = {
  id: 'quad', en: 'Quad Bike', zh: '四輪越野車', x: 1260, y: 960, s: 0.36, r: -8,
  hint: [360, -330],
  pivots: { body: [130, 621] },
  art(p) {
    return `<g id="${p}-body"><g transform="translate(0 -621)">` +
      cut(p, 'quad', 713, 621, {}, { w1: [129.5, 492], w2: [581.5, 496.5] }) +
    '</g></g>';
  },
  async act(c) {
    await c.anim(350, { body: { r: -10 }, ...c.wheels(90) });
    await c.anim(350, { body: { r: 0, ty: -60 }, ...c.wheels(90) });
    await c.anim(300, { body: { ty: 0 }, ...c.wheels(90) });
    c.burst('body', 120, 0, { n: 8, color: '#d9b27a', vx: [-2.5, 0], vy: [-3, -1], size: [6, 12] });
    await c.anim(700, { body: { tx: 340 }, ...c.wheels(300) });
    await c.wait(200);
    await c.anim(1100, { body: { tx: 0 }, ...c.wheels(-570) });
  },
};

// ---------- 拖拉機：排氣管噗噗冒煙，往前開再倒回來 ----------
// 圖 928×697；後輪的外圈輪胎是斜著看的（橢圓，不能直接整塊轉）：
// 黃色輪框固定不動，外圈另外畫一圈胎紋（壓扁成同樣的橢圓）跟著轉，看起來就是輪胎在滾
// 前輪用 tools/ai-art/rig.py 拆好的圖層（tractor-w2.webp 只有外圈胎紋會轉、tractor-front.webp 輪框不動）
const TREAD = Array.from({ length: 18 }, (_, i) =>
  `<rect x="-15" y="-192" width="30" height="46" rx="7" fill="#4a4955" transform="rotate(${i * 20}) skewX(-14)"/>`).join('');
const tractor = {
  id: 'tractor', en: 'Tractor', zh: '拖拉機', x: 30, y: 985, s: 0.46, r: -5,
  hint: [560, -330],
  art(p) {
    return `<g id="${p}-body"><g transform="translate(0 -697)">` +
      IMG('tractor', 928, 697) +
      `<clipPath id="${p}-ct"><ellipse cx="205" cy="440" rx="140" ry="188"/></clipPath>` +
      `<g clip-path="url(#${p}-ct)"><g transform="translate(205 440) scale(0.74 1)">` +
        `<g id="${p}-tread" class="wheel" data-cx="0" data-cy="0">${TREAD}</g></g></g>` +
      `<g id="${p}-w2" class="wheel" data-cx="821.5" data-cy="504.5">${IMG('tractor-w2', 928, 697)}</g>` +
      IMG('tractor-front', 928, 697) +
    '</g></g>';
  },
  async act(c) {
    for (let i = 0; i < 4; i++) {
      c.burst('body', 640, -680, SMOKE);
      c.burst('body', 745, -670, SMOKE);
      await c.anim(130, { body: { ty: -6 } });
      await c.anim(130, { body: { ty: 0 } });
    }
    const puff = setInterval(() => c.burst('body', 640, -680, SMOKE), 160);
    await c.anim(1300, { body: { tx: 220 }, ...c.wheels(150) });
    await c.wait(250);
    await c.anim(1300, { body: { tx: 0 }, ...c.wheels(-150) });
    clearInterval(puff);
  },
};

// ---------- 聯合收割機：前面的撥禾輪轉起來，後面的管子噴出穀子 ----------
// 圖 890×509；撥禾輪中心 (790, 355)
const combine = {
  id: 'combine', en: 'Combine Harvester', zh: '聯合收割機', x: 600, y: 980, s: 0.6,
  hint: [790, -154],
  pivots: { body: [445, 509], reel: [790, 355] },
  art(p) {
    return `<g id="${p}-body"><g transform="translate(0 -509)">` +
      cut(p, 'combine', 890, 509, { reel: CIRCLE(790, 355, 92) }) +
    '</g></g>';
  },
  async act(c) {
    const shake = c.tween(3000, (t) => c.set('body', { ty: Math.sin(t * Math.PI * 30) * 2 }), (t) => t);
    const reel = c.anim(3000, { reel: { r: c.get('reel').r + 900 } });
    await c.wait(500);
    for (let i = 0; i < 16; i++) {
      c.burst('body', 870, -170, { n: 2, color: '#e3c46a', vx: [0.5, 2], vy: [-2, 0], size: [4, 8], life: 600 });
      if (i > 3) c.burst('body', 20, -460, { n: 4, color: GRAIN, vx: [-3.5, -1.5], vy: [-1, 1], g: 0.25, size: [4, 8], life: 900 });
      await c.wait(130);
    }
    await reel;
    await shake;
    c.set('body', { ty: 0 });
  },
};

SCENES.farm = {
  w: 1600,
  h: 1000,
  bg: () => `
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <text x="500" y="98" font-size="60" font-weight="900" fill="${LINE}">Farm</text>
    <text x="502" y="148" font-size="38" font-weight="900" fill="${LINE}" opacity=".7">農場</text>
  `,
  // 先畫後排（天空、草地），再畫前排
  items: [plane, windmill, pickup, baler, tractor, combine, quad],
};
}
