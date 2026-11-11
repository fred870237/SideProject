// 🛣️ 長途運輸：在公路上跑長途的貨運車隊（公路列車、雙層汽車運輸車、運木材卡車、油罐車）
// 原本跟 🚚 超大運輸 同一頁，太擠所以拆成兩頁；圖和背景都放在 art/img/giant-haulers/（兩頁共用）
// 版面 1600×1000；背景是側面看的公路（場景座標 y ≈ 590 以下是柏油路，y ≈ 760 是中間的白色虛線），遠方有山坡、風車和港口
// 車子和背景是 AI 生成的圖（art/img/giant-haulers/*.webp），做法跟工地那一頁一樣（見 construction.js 開頭的說明）
// 輪子用 tools/ai-art/rig.py 拆好的圖層：<圖名>-w1.webp… 是正圓的輪胎外圈（會轉），<圖名>-front.webp 是輪框和擋在輪子前面的東西（不動）
// 輪子的位置是 tools/ai-art/find_wheels.py 自動找的，圓心在 rig.py 輸出的 <圖名>-rig.json
// 整個檔案包在 { } 裡，變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/giant-haulers/${name}.webp`;
const IMG = (name, w, h, clip) =>
  `<image href="${SRC(name)}" width="${w}" height="${h}"${clip ? ` clip-path="url(#${clip})"` : ''}/>`;
const PATH = (pts) => 'M' + pts.map((p) => p.join(',')).join('L') + 'Z';
const RECT = (x0, y0, x1, y1) => PATH([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]);
const CLIP = (id, d) => `<clipPath id="${id}"><path d="${d}"/></clipPath>`;
const HOLE = (id, w, h, d) => `<clipPath id="${id}"><path clip-rule="evenodd" d="M0,0H${w}V${h}H0Z${d}"/></clipPath>`;
const DUST = { n: 3, color: '#b9b2a4', vx: [-1.5, -0.3], vy: [-1.2, -0.2], g: -0.01, size: [8, 15], life: 900 };

// 一台車：車身（parts 的範圍挖掉）＋輪子圖層（會轉）＋ front（不動，也挖掉 parts）＋ parts（會動的零件）
// wheels = { w1: [cx, cy], ... }（rig.json 的圓心）；parts = { 零件名: 裁切範圍 d }
function truck(p, name, w, h, wheels, parts = {}) {
  const holes = Object.values(parts).join('');
  let out = HOLE(`${p}-cb`, w, h, holes) + IMG(name, w, h, `${p}-cb`);
  for (const [k, [cx, cy]] of Object.entries(wheels)) {
    out += `<g id="${p}-${k}" class="wheel" data-cx="${cx}" data-cy="${cy}">${IMG(`${name}-${k}`, w, h)}</g>`;
  }
  out += HOLE(`${p}-cf`, w, h, holes) + IMG(`${name}-front`, w, h, `${p}-cf`);
  for (const [k, d] of Object.entries(parts)) out += CLIP(`${p}-c${k}`, d) + `<g id="${p}-${k}">${IMG(name, w, h, `${p}-c${k}`)}</g>`;
  return out;
}

// 開出去再倒回來：dx 是開多遠（往右是正的），每走一步噴一點灰塵
async function drive(c, dx, ms, dustAt) {
  const deg = dx * 1.4;
  await c.anim(ms, { body: { tx: dx }, ...c.wheels(deg) }, (t) => { if (dustAt && Math.random() < 0.25) c.burst('body', ...dustAt, DUST); });
  await c.wait(250);
  await c.anim(ms, { body: { tx: 0 }, ...c.wheels(-deg) });
}

// ---------- 公路列車（澳洲那種一台車頭拖好幾節）：叭叭兩聲，一節一節開出去 ----------
// 圖 1647×268（翻轉過，車頭在右）
const roadtrain = {
  id: 'roadtrain', en: 'Road Train', zh: '公路列車', x: -20, y: 785, s: 0.62,
  hint: [1420, -170],
  art(p) {
    return `<g id="${p}-body"><g transform="translate(0 -268)">` +
      truck(p, 'roadtrain', 1647, 268, { w1: [398.5, 235], w2: [471.5, 235], w3: [698.5, 232], w4: [778, 232], w5: [901.5, 223.5], w6: [969, 230], w7: [1221.5, 222.5], w8: [1556.5, 222.5] }) +
    '</g></g>';
  },
  async act(c) {
    speak('Honk honk!', { queue: true });
    await drive(c, 220, 1600, [20, -40]);
  },
};

// ---------- 雙層汽車運輸車：上層前段（車頭上方那段，連同上面的車）液壓往下傾斜再升回來，其他車子跳一跳，然後開出去再倒回來 ----------
// 圖 1374×335（車頭在右）；照 Fred 給的照片（上下兩層、上層伸到車頭上方）用文字描述生成
// 上層前段 (690～1090, 20～100) 繞後端 (690, 92) 轉；其他三台車：上層後面兩台、下層一台
const CC_DECK = RECT(690, 18, 1092, 102);
const CC_CARS = { car1: RECT(72, 0, 330, 82), car2: RECT(474, 8, 675, 82), car4: RECT(152, 140, 355, 214) };
const carcarrier = {
  id: 'carcarrier', en: 'Double-Deck Car Carrier', zh: '雙層汽車運輸車', x: 520, y: 995, s: 0.7,
  hint: [560, -230],
  pivots: { deck: [690, 92] },
  art(p) {
    return `<g id="${p}-body"><g transform="translate(0 -335)">` +
      truck(p, 'carcarrier', 1374, 335, { w1: [202, 288.5], w2: [320, 288.5], w3: [431.5, 284], w4: [979.5, 286], w5: [1273, 285.5] },
        { deck: CC_DECK, ...CC_CARS }) +
    '</g></g>';
  },
  async act(c) {
    await c.anim(1000, { deck: { r: 9 } });
    await c.wait(300);
    await c.anim(1000, { deck: { r: 0 } });
    for (let i = 0; i < 2; i++) {
      await c.anim(160, { car1: { ty: -10 }, car2: { ty: -8 }, car4: { ty: -10 } });
      await c.anim(200, { car1: { ty: 0 }, car2: { ty: 0 }, car4: { ty: 0 } });
    }
    await drive(c, 180, 1300, [10, -40]);
  },
};

// ---------- 運木材卡車：木頭跳一跳，開出去再倒回來 ----------
// 圖 899×272（車頭在右）；木頭和固定的樁 (0～615, 28～150)
const LOGS = RECT(0, 26, 615, 150);
const logtruck = {
  id: 'logtruck', en: 'Log Truck', zh: '運木材卡車', x: -10, y: 995, s: 0.55,
  hint: [300, -190],
  art(p) {
    return `<g id="${p}-body"><g transform="translate(0 -272)">` +
      truck(p, 'logtruck', 899, 272, { w1: [183.5, 226.5], w2: [253, 220], w3: [464.5, 219.5], w4: [563, 230.5], w5: [816.5, 220.5] }, { logs: LOGS }) +
    '</g></g>';
  },
  async act(c) {
    for (let i = 0; i < 3; i++) {
      await c.anim(160, { logs: { ty: -12 } });
      await c.anim(200, { logs: { ty: 0 } });
    }
    await drive(c, 200, 1300, [10, -40]);
  },
};

// ---------- 油罐車：叭一聲，開出去再倒回來 ----------
// 圖 809×272（車頭在右）
const tanker = {
  id: 'tanker', en: 'Tank Truck', zh: '油罐車', x: 1060, y: 785, s: 0.55,
  hint: [250, -200],
  art(p) {
    return `<g id="${p}-body"><g transform="translate(0 -272)">` +
      truck(p, 'tanker', 809, 272, { w1: [111, 225.5], w2: [200, 227.5], w3: [456, 213], w4: [745, 222] }) +
    '</g></g>';
  },
  async act(c) {
    speak('Honk honk!', { queue: true });
    await drive(c, -180, 1300, [790, -40]);
  },
};

SCENES['long-haul'] = {
  w: 1600,
  h: 1000,
  bg: () => `
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <text x="56" y="98" font-size="60" font-weight="900" fill="${LINE}">Long Haul</text>
    <text x="58" y="148" font-size="38" font-weight="900" fill="${LINE}" opacity=".7">長途運輸</text>
  `,
  // 先畫後排（上面的車道），再畫前排
  items: [roadtrain, tanker, logtruck, carcarrier],
};
}
