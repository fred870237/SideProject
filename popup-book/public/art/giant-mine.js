// ⛏️ 巨型礦場：露天礦坑裡的超大機器，點了會唸英文名字，然後動起來
// 版面 1600×1000；背景是一層一層的礦坑階梯，地面從 y ≈ 730 開始；Bagger 橫跨整頁的後排，其他機器排在前面
// 機器和背景是 AI 生成的圖（art/img/giant-mine/*.webp），做法跟工地那一頁一樣（見 construction.js 開頭的說明）
// 主角是斗輪挖掘機 Bagger（像德國的 Bagger 293，世界上最大的陸上機器），放在正中間、畫得很大；英文名字照 Fred 的意思直接叫 Bagger
// 整個檔案包在 { } 裡，變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/giant-mine/${name}.webp`;
const IMG = (name, w, h, clip) =>
  `<image href="${SRC(name)}" width="${w}" height="${h}"${clip ? ` clip-path="url(#${clip})"` : ''}/>`;
const PATH = (pts) => 'M' + pts.map((p) => p.join(',')).join('L') + 'Z';
const RECT = (x0, y0, x1, y1) => PATH([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]);
const CLIP = (id, d) => `<clipPath id="${id}"><path d="${d}"/></clipPath>`;
const HOLE = (id, w, h, d) => `<clipPath id="${id}"><path clip-rule="evenodd" d="M0,0H${w}V${h}H0Z${d}"/></clipPath>`;
const CIRCLE = (cx, cy, r) => `M${cx - r},${cy}a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0Z`;
const DIRT = '#b5713a', ROCK = '#8a8d96';

// 輪子：從圖上裁出圓形，class="wheel" 給 c.wheels() 轉
// 有第 4 個值（內半徑）的話只裁外圈的黑色輪胎（圓環），中間的輪圈和擋在前面的零件不跟著轉
const ring = (cx, cy, r, rIn) => CIRCLE(cx, cy, r) + (rIn ? CIRCLE(cx, cy, rIn) : '');
const wheel = (p, name, k, w, h, [cx, cy, r, rIn]) =>
  `<clipPath id="${p}-cw${k}"><path clip-rule="evenodd" d="${ring(cx, cy, r, rIn)}"/></clipPath>` +
  `<g id="${p}-w${k}" class="wheel" data-cx="${cx}" data-cy="${cy}">${IMG(name, w, h, `${p}-cw${k}`)}</g>`;

// ---------- 斗輪挖掘機 Bagger（這頁的主角，放在正中間、很大）：巨大的轉輪轉起來挖土，土塊沿著長長的吊臂送回機身 ----------
// 圖 1754×833（轉輪在左，跟照片一樣）：先用 tools/ai-art/sketch_bagger.py 照照片的比例畫草圖，再讓 AI 照草圖重畫
// 轉輪中心 (210, 470)、半徑約 202（含鏟斗的齒）
// 吊臂上緣從轉輪旁 (420, 452) 往右下到機身 (860, 512)：挖下來的土塊（程式畫的圓點）沿著這條線送過去
// 注意：圖片的點擊範圍是整個長方形，所以 Bagger 後面的東西點不到，其他機器都要排在它前面（items 裡排在它後面）
const BWE_WHEEL = [210, 470, 202];
const BWE_BELT = [[420, 452], [860, 512]];
const BWE_CHUNKS = [0, 1, 2, 3, 4, 5, 6];
const bwe = {
  id: 'bwe', en: 'Bagger', zh: '斗輪挖掘機', x: 90, y: 840, s: 0.82,
  hint: [210, -363],
  tag: [262, 728], // 外框很大，預設的標籤會跑到前排機器下面，自己指定放在轉輪下方
  pivots: { wheel: BWE_WHEEL.slice(0, 2) },
  art(p) {
    const w = CIRCLE(...BWE_WHEEL);
    const [[x0, y0]] = BWE_BELT;
    return '<g transform="translate(0 -833)">' +
      HOLE(`${p}-cb`, 1754, 833, w) + IMG('bwe', 1754, 833, `${p}-cb`) +
      BWE_CHUNKS.map((k) => `<g id="${p}-k${k}" opacity="0"><circle cx="${x0}" cy="${y0 - 12}" r="${11 + (k % 3) * 3}" fill="${k % 2 ? DIRT : '#8c5c30'}"/></g>`).join('') +
      CLIP(`${p}-cw`, w) + `<g id="${p}-wheel">${IMG('bwe', 1754, 833, `${p}-cw`)}</g>` +
    '</g>';
  },
  async act(c) {
    const [[x0, y0], [x1, y1]] = BWE_BELT;
    // 轉輪轉兩圈（往左下挖），邊轉邊噴出土塊
    const dig = c.anim(4800, { wheel: { r: c.get('wheel').r + 720 } });
    // 挖下來的土塊一塊一塊沿著吊臂送回機身
    const belt = BWE_CHUNKS.map(async (k) => {
      await c.wait(600 + k * 450);
      c.set(`k${k}`, { tx: 0, ty: 0, o: 1 });
      await c.anim(2000, { [`k${k}`]: { tx: x1 - x0, ty: y1 - y0 } }, null, (t) => t);
      c.set(`k${k}`, { o: 0 });
    });
    for (let i = 0; i < 16; i++) {
      c.burst('wheel', 40, 600, { n: 6, color: i % 3 ? DIRT : '#8c5c30', vx: [-2.5, 0.5], vy: [-3, 0], size: [7, 15] });
      await c.wait(280);
    }
    await Promise.all([dig, ...belt]);
  },
};

// ---------- 拉鏟挖掘機：把鏟斗甩出去，落地挖土，再拖回來 ----------
// 圖 858×555；鏟斗掛在吊臂尖端 (790, 22) 下面；鋼索用程式畫（AI 圖上的鋼索斷斷續續）
// 圖的左邊有一段斷掉的鋼索和吊鉤（x < 140、y > 230）、最下面有一條地平線，都裁掉
const DRAG_BUCKET = RECT(680, 240, 858, 480);
const dragline = {
  id: 'dragline', en: 'Dragline Excavator', zh: '拉鏟挖掘機', x: 1250, y: 992, s: 0.4,
  hint: [770, -150],
  pivots: { bucket: [790, 22] },
  art(p) {
    return '<g transform="translate(0 -546)">' +
      HOLE(`${p}-cb`, 858, 546, RECT(0, 230, 140, 546) + DRAG_BUCKET) + IMG('dragline', 858, 555, `${p}-cb`) +
      CLIP(`${p}-ck`, DRAG_BUCKET) +
      `<g id="${p}-bucket"><path d="M790,22 L790,312" stroke="#3a3d46" stroke-width="5"/>${IMG('dragline', 858, 555, `${p}-ck`)}</g>` +
    '</g>';
  },
  async act(c) {
    // 吊臂尖端已經在圖的最右邊，往外甩太多會跑出畫面，所以只往外一點點，主要是往裡面拖
    await c.anim(600, { bucket: { r: 14 } });   // 先往裡面盪
    await c.anim(800, { bucket: { r: -12 } });  // 甩出去
    c.burst('bucket', 770, 470, { n: 14, color: DIRT, vx: [-2.5, 2.5], vy: [-3, -0.5], size: [6, 12] });
    await c.anim(1500, { bucket: { r: 28 } });  // 拖回來，鏟斗裝滿土
    c.burst('bucket', 770, 420, { n: 8, color: '#8c5c30', vx: [-1.5, 1.5], vy: [-2, 0], size: [5, 10] });
    await c.anim(500, { bucket: { r: 20 } });
    await c.anim(900, { bucket: { r: 0 } });
  },
};

// ---------- 電鏟：大鏟斗往上一挖，裝滿石頭再倒出來 ----------
// 圖 788×628；鏟斗 (515～788, 260～455)，掛在斗桿末端 (580, 290)
const SHOVEL_DIPPER = RECT(515, 258, 788, 458);
const shovel = {
  id: 'shovel', en: 'Mining Shovel', zh: '電鏟', x: 330, y: 990, s: 0.38, r: -2,
  hint: [650, -258],
  pivots: { dipper: [580, 290] },
  art(p) {
    return '<g transform="translate(0 -628)">' +
      HOLE(`${p}-cb`, 788, 628, SHOVEL_DIPPER) + IMG('shovel', 788, 628, `${p}-cb`) +
      CLIP(`${p}-cd`, SHOVEL_DIPPER) + `<g id="${p}-dipper">${IMG('shovel', 788, 628, `${p}-cd`)}</g>` +
    '</g>';
  },
  async act(c) {
    await c.anim(500, { dipper: { r: 12 } });
    await c.anim(900, { dipper: { r: -30 } }); // 往上挖
    c.burst('dipper', 760, 430, { n: 12, color: ROCK, vx: [-2, 1.5], vy: [-3, -0.5], size: [6, 12] });
    await c.wait(500);
    await c.anim(700, { dipper: { r: 28 } });  // 倒出來
    for (let i = 0; i < 4; i++) {
      c.burst('dipper', 700, 450, { n: 6, color: i % 2 ? ROCK : DIRT, vx: [-1, 1], vy: [0, 1.5], size: [6, 12] });
      await c.wait(150);
    }
    await c.anim(700, { dipper: { r: 0 } });
  },
};

// ---------- 鑽孔機：鑽桿往地下鑽，機器震動、冒出灰塵 ----------
// 圖 581×584；鑽桿在桅杆裡 (400～470)，鑽頭在地面 (440, 575)
const drill = {
  id: 'drill', en: 'Drill Rig', zh: '鑽孔機', x: 1060, y: 990, s: 0.34, r: -2,
  hint: [432, -400],
  art(p) {
    return `<g id="${p}-body"><g transform="translate(0 -584)">${IMG('drill', 581, 584)}</g></g>`;
  },
  async act(c) {
    for (let i = 0; i < 16; i++) {
      c.set('body', { tx: (i % 2 ? 1 : -1) * 2.5, ty: i % 3 ? 0 : -1.5 });
      c.burst('body', 440, -10, { n: 4, color: i % 2 ? '#c9a36b' : '#a8a08f', vx: [-2.5, 2.5], vy: [-2.5, -0.5], g: 0.12, size: [6, 13], life: 1100 });
      await c.wait(110);
    }
    c.set('body', { tx: 0, ty: 0 });
  },
};

// ---------- 礦用巨型卡車：車斗升起來，把石頭倒出去，再開走一下回來 ----------
// 圖 840×574（車頭在右）；車斗連車頂的護板一起，繞後面的鉸鏈 (70, 238) 往上翻；旁邊站著工人比大小
const TRUCK_BED = PATH([[0, 0], [815, 0], [815, 168], [690, 178], [660, 262], [345, 262], [250, 246], [30, 218], [0, 190]]);
const haultruck = {
  id: 'haultruck', en: 'Mining Dump Truck', zh: '礦用巨型卡車', x: 640, y: 998, s: 0.48,
  hint: [430, -440],
  pivots: { bed: [70, 238] },
  art(p) {
    return '<g transform="translate(0 -574)">' +
      HOLE(`${p}-cb`, 840, 574, TRUCK_BED) + IMG('haultruck', 840, 574, `${p}-cb`) +
      CLIP(`${p}-cd`, TRUCK_BED) + `<g id="${p}-bed">${IMG('haultruck', 840, 574, `${p}-cd`)}</g>` +
    '</g>';
  },
  async act(c) {
    await c.anim(1500, { bed: { r: -26 } });
    for (let i = 0; i < 8; i++) {
      c.burst('bed', 10, 200, { n: 6, color: i % 2 ? ROCK : DIRT, vx: [-2.5, -0.5], vy: [-1, 1.5], size: [7, 15], life: 1200 });
      await c.wait(130);
    }
    await c.wait(300);
    await c.anim(1400, { bed: { r: 0 } });
  },
};

// ---------- 巨型輪式裝載機：往前開，舉起的大鏟斗把石頭倒出去，再倒車回來 ----------
// 圖 817×608（鏟斗在左，往左開）；鏟斗繞 (330, 250) 轉
// 鏟斗的範圍沿著灰色鏟斗的外緣（不能包到黃色手臂，不然手臂會跟著鏟斗飛走）
// 輪子只轉外圈的黑色輪胎（中心、外半徑、內半徑）；擋在輪胎前面的黃色零件（前輪前面的手臂、輪圈邊緣）不能跟著轉，
// 所以：車身整張不挖洞（原本的輪胎留在下面），上面疊一張只有黑色輪胎的圖 loader-tyres.webp 來轉，
// 最上面再蓋只有那些黃色零件的圖 loader-front.webp（輪胎圓環裡不是黑色的像素），兩張都是 tools/ai-art 用原圖算出來的
const LOADER_BUCKET = PATH([[0, 10], [285, 0], [330, 35], [372, 85], [394, 130], [387, 190], [356, 240], [312, 282], [240, 292], [0, 306]]);
const LOADER_WHEELS = [[200, 495, 101, 62], [410, 492, 108, 66], [690, 497, 98, 60]];
const loader = {
  id: 'loader', en: 'Giant Wheel Loader', zh: '巨型輪式裝載機', x: 0, y: 1000, s: 0.38, r: 2,
  hint: [560, -350],
  pivots: { bucket: [330, 250] },
  art(p) {
    return `<g id="${p}-body"><g transform="translate(0 -608)">` +
      HOLE(`${p}-cb`, 817, 608, LOADER_BUCKET) + IMG('loader', 817, 608, `${p}-cb`) +
      LOADER_WHEELS.map((w, k) => wheel(p, 'loader-tyres', k + 1, 817, 608, w)).join('') +
      IMG('loader-front', 817, 608) +
      CLIP(`${p}-ck`, LOADER_BUCKET) + `<g id="${p}-bucket">${IMG('loader', 817, 608, `${p}-ck`)}</g>` +
    '</g></g>';
  },
  async act(c) {
    await c.anim(1100, { body: { tx: -140 }, ...c.wheels(-260) });
    await c.anim(700, { bucket: { r: -38 } });
    for (let i = 0; i < 6; i++) {
      c.burst('bucket', 20, 230, { n: 6, color: i % 2 ? ROCK : DIRT, vx: [-1.5, 0.5], vy: [0, 1.5], size: [6, 13], life: 1000 });
      await c.wait(120);
    }
    await c.anim(600, { bucket: { r: 0 } });
    await c.anim(1100, { body: { tx: 0 }, ...c.wheels(260) });
  },
};

SCENES['giant-mine'] = {
  w: 1600,
  h: 1000,
  bg: () => `
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <text x="56" y="98" font-size="60" font-weight="900" fill="${LINE}">Giant Mine</text>
    <text x="58" y="148" font-size="38" font-weight="900" fill="${LINE}" opacity=".7">巨型礦場</text>
  `,
  // 先畫後排，再畫前排
  items: [bwe, shovel, drill, dragline, haultruck, loader],
};
}
