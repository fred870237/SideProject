// 🏗️ 工地：點車子會唸英文名字，然後像機關書一樣動起來
// 版面 1600×1000（左右兩頁，中間是書縫）；後排地面 y = 720，前排地面 y = 965～975
// 車子和背景是 AI 生成的圖（art/img/construction/*.webp，來源和做法見 popup-book/README.md）
// 會動的零件：用 clipPath 從同一張圖裁出來單獨轉動，車身那張圖再把同一塊挖掉（hole）
// 每台車的 art 先 translate(0, -圖高)，所以零件、轉軸、clipPath 都直接用「圖片像素座標」；hint 用的是地面 = 0 的座標
// 整個檔案包在 { } 裡，車子的變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/construction/${name}.webp`;
const IMG = (name, w, h, clip) =>
  `<image href="${SRC(name)}" width="${w}" height="${h}"${clip ? ` clip-path="url(#${clip})"` : ''}/>`;
const PATH = (pts) => 'M' + pts.map((p) => p.join(',')).join('L') + 'Z';
// 只留下 d 裡面的範圍
const CLIP = (id, d) => `<clipPath id="${id}"><path d="${d}"/></clipPath>`;
// 整張圖挖掉 d 的範圍（給車身用）
const HOLE = (id, w, h, d) => `<clipPath id="${id}"><path clip-rule="evenodd" d="M0,0H${w}V${h}H0Z${d}"/></clipPath>`;
const CIRCLE = (cx, cy, r) => `M${cx - r},${cy}a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0Z`;
// 土堆（扁平色塊，跟 AI 圖一樣沒有外框）
const MOUND = (x0, x1, h, id = '') => {
  const m = (x0 + x1) / 2, w = x1 - x0;
  return `<g${id ? ` id="${id}"` : ''}>` +
    `<path d="M${x0},0 Q${m},${-2 * h} ${x1},0Z" fill="#a8743f"/>` +
    `<path d="M${x0 + w * 0.08},0 Q${m},${-1.1 * h} ${x1 - w * 0.08},0Z" fill="#8c5c30"/>` +
    [0.3, 0.52, 0.7].map((f, i) => `<circle cx="${x0 + w * f}" cy="${-h * (0.25 + i * 0.12)}" r="${w * 0.025}" fill="#6e4524"/>`).join('') +
    '</g>';
};

// ---------- 塔式起重機：把鋼樑吊起來，搬到另一邊放下 ----------
// 圖 706×884；吊臂底部 y = 130，塔身中心 x = 268；鋼索、小車、吊鉤、鋼樑用程式畫
const CRANE_D = 110; // 吊鉤頂端到鋼樑底部的距離
const CRANE_SPOTS = [600, 470]; // 鋼樑放在地上的兩個位置（輪流）
function craneDraw(c) {
  const s = c.state;
  if (s.carry) { s.bx = s.tx; s.by = s.hy + CRANE_D; }
  c.set('trolley', { tx: s.tx });
  c.set('hook', { tx: s.tx, ty: s.hy });
  c.set('beam', { tx: s.bx, ty: s.by });
  const cable = c.el('cable');
  cable.setAttribute('x1', s.tx);
  cable.setAttribute('x2', s.tx);
  cable.setAttribute('y2', s.hy);
}

const towerCrane = {
  id: 'crane', en: 'Tower Crane', zh: '塔式起重機', x: 1092, y: 720, s: 0.7,
  hint: [600, -444],
  art(p) {
    return '<g transform="translate(0 -884)">' + IMG('crane', 706, 884) +
      `<g id="${p}-beam"><g id="${p}-sling" opacity="0">` +
        `<path d="M0,${56 - CRANE_D} L-70,-26 M0,${56 - CRANE_D} L70,-26" stroke="#3a3f4a" stroke-width="5" fill="none"/></g>` +
        '<rect x="-82" y="-28" width="164" height="28" fill="#e2572a"/><rect x="-82" y="-12" width="164" height="12" fill="#b9431d"/>' +
      '</g>' +
      `<line id="${p}-cable" x1="0" y1="146" x2="0" y2="400" stroke="#3a3f4a" stroke-width="5"/>` +
      `<g id="${p}-trolley"><rect x="-24" y="130" width="48" height="20" fill="#5b6270"/><rect x="-24" y="143" width="48" height="7" fill="#454b57"/></g>` +
      // 吊鉤外面多一圈透明的範圍，小朋友比較好點
      `<g id="${p}-hook"><circle cx="0" cy="30" r="70" fill="transparent"/>` +
        '<rect x="-20" y="0" width="40" height="28" fill="#f5b400"/><rect x="-20" y="18" width="40" height="10" fill="#d99a00"/>' +
        '<path d="M0,28 L0,40 Q0,56 14,56 Q27,56 27,43" stroke="#3a3f4a" stroke-width="8" fill="none" stroke-linecap="round"/></g>' +
      '</g>';
  },
  setup(c) {
    const x = CRANE_SPOTS[0];
    Object.assign(c.state, { tx: x, hy: 400, bx: x, by: 884, carry: false, spot: 0 });
    craneDraw(c);
  },
  async act(c) {
    const s = c.state;
    const go = (to) => {
      const from = {};
      let dist = 0;
      for (const k in to) { from[k] = s[k]; dist = Math.max(dist, Math.abs(to[k] - s[k])); }
      return c.tween(350 + dist * 1.6, (t) => { for (const k in to) s[k] = lerp(from[k], to[k], t); craneDraw(c); });
    };
    s.spot = 1 - s.spot;
    await go({ hy: s.by - CRANE_D });
    await c.anim(250, { sling: { o: 1 } });
    s.carry = true;
    await go({ hy: 260 });
    await go({ tx: CRANE_SPOTS[s.spot] });
    await go({ hy: 884 - CRANE_D });
    s.carry = false;
    await c.anim(250, { sling: { o: 0 } });
    await go({ hy: 400 });
  },
};

// ---------- 水泥攪拌車：滾筒搖搖晃晃轉起來，後面倒出水泥 ----------
// 圖 876×506
const MIXER_DRUM = PATH([[22, 0], [516, 0], [516, 296], [132, 300], [96, 244], [42, 152], [18, 60]]);
const mixer = {
  id: 'mixer', en: 'Cement Mixer', zh: '水泥攪拌車', x: 40, y: 720, s: 0.375,
  hint: [280, -356],
  pivots: { drum: [270, 150] },
  art(p) {
    return '<g transform="translate(0 -506)">' +
      CLIP(`${p}-cd`, MIXER_DRUM) + HOLE(`${p}-cb`, 876, 506, MIXER_DRUM) +
      IMG('mixer', 876, 506, `${p}-cb`) +
      `<g id="${p}-drum">${IMG('mixer', 876, 506, `${p}-cd`)}</g>` +
      '</g>';
  },
  async act(c) {
    for (let i = 0; i < 8; i++) {
      if (i > 1) c.burst('drum', 40, 120, { n: 6, color: '#a3a6b4', vx: [-2.4, -0.6], vy: [-0.5, 1.5], g: 0.35, size: [8, 16], life: 800 });
      await c.anim(160, { drum: { r: 2.5 } });
      await c.anim(160, { drum: { r: -2.5 } });
    }
    await c.anim(200, { drum: { r: 0 } });
  },
};

// ---------- 推土機：鏟子放下，把土堆往前推 ----------
// 圖 840×552
const DOZER_BLADE = PATH([[632, 238], [840, 238], [840, 552], [632, 552]]);
const bulldozer = {
  id: 'dozer', en: 'Bulldozer', zh: '推土機', x: 420, y: 720, s: 0.344,
  hint: [740, -160],
  art(p) {
    return MOUND(850, 1070, 120, `${p}-pile`) +
      `<g id="${p}-body"><g transform="translate(0 -552)">` +
        CLIP(`${p}-cl`, DOZER_BLADE) + HOLE(`${p}-cb`, 840, 552, DOZER_BLADE) +
        IMG('bulldozer', 840, 552, `${p}-cb`) +
        `<g id="${p}-blade">${IMG('bulldozer', 840, 552, `${p}-cl`)}</g>` +
      '</g></g>';
  },
  setup(c) { c.set('blade', { ty: -30 }); },
  async act(c) {
    await c.anim(350, { blade: { ty: 0 } });
    // 履帶不會轉，車身一邊前進一邊輕輕上下晃
    await c.anim(1500, { body: { tx: 300 }, pile: { tx: 300 } }, (t) => c.set('body', { ty: Math.sin(t * Math.PI * 10) * 3 }));
    await c.anim(350, { blade: { ty: -30 } });
    await c.anim(1200, { body: { tx: 0, ty: 0 } });
    // 推走的土堆消失，原來的地方再冒出一堆新的
    await c.anim(300, { pile: { o: 0 } });
    c.set('pile', { tx: 0 });
    await c.anim(400, { pile: { o: 1 } });
  },
};

// ---------- 流動廁所：門打開，裡面的工人揮手說 Hello ----------
// 圖 361×565；門在左邊那一面，鉸鍊在左側
const TOILET_DOOR = PATH([[22, 88], [200, 88], [200, 527], [22, 527]]);
const toilet = {
  id: 'toilet', en: 'Portable Toilet', zh: '流動廁所', x: 1000, y: 720, s: 0.3,
  hint: [110, -265],
  pivots: { door: [22, 300], arm: [150, 300] },
  art(p) {
    return '<g transform="translate(0 -565)">' +
      CLIP(`${p}-cd`, TOILET_DOOR) + HOLE(`${p}-cb`, 361, 565, TOILET_DOOR) +
      IMG('toilet', 361, 565, `${p}-cb`) +
      '<rect x="22" y="88" width="178" height="439" fill="#1d3550"/>' +
      // 裡面的工人（扁平色塊）
      '<rect x="58" y="272" width="104" height="255" rx="24" fill="#ff7a1a"/><rect x="58" y="380" width="104" height="22" fill="#ffe04a"/>' +
      '<circle cx="110" cy="222" r="44" fill="#f2c29b"/><circle cx="96" cy="224" r="5" fill="#2d2a3a"/><circle cx="124" cy="224" r="5" fill="#2d2a3a"/>' +
      '<path d="M98,244 Q110,254 122,244" stroke="#2d2a3a" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<path d="M62,210 a48,46 0 0,1 96,0Z" fill="#ffcc1a"/><rect x="54" y="204" width="112" height="12" rx="6" fill="#e0a800"/>' +
      `<g id="${p}-arm"><path d="M150,300 L198,196" stroke="#ff7a1a" stroke-width="28" stroke-linecap="round"/><circle cx="202" cy="186" r="18" fill="#f2c29b"/></g>` +
      `<g id="${p}-door">${IMG('toilet', 361, 565, `${p}-cd`)}</g>` +
      '</g>';
  },
  async act(c) {
    await c.anim(450, { door: { sx: -0.3 } });
    await c.wait(250);
    speak('Hello!');
    for (let i = 0; i < 3; i++) {
      await c.anim(170, { arm: { r: -25 } });
      await c.anim(170, { arm: { r: 15 } });
    }
    await c.anim(170, { arm: { r: 0 } });
    await c.wait(300);
    await c.anim(450, { door: { sx: 1 } });
  },
};

// ---------- 挖土機：伸到土堆挖一口，舉起來倒掉 ----------
// 圖 824×511；手臂轉軸在臂根，鏟斗轉軸在斗臂末端（正的角度 = 鏟斗往內收）
const EXC_ARM = PATH([[380, 338], [382, 300], [390, 250], [500, 78], [620, 42], [790, 0], [824, 0], [824, 250], [640, 250], [640, 300], [462, 338]]);
const EXC_BUCKET = PATH([[640, 250], [824, 250], [824, 365], [640, 365]]);
const excavator = {
  id: 'excavator', en: 'Excavator', zh: '挖土機', x: 20, y: 975, s: 0.567,
  hint: [730, -211],
  pivots: { arm: [415, 322], bucket: [806, 245], pile: [730, 0] },
  art(p) {
    return MOUND(600, 860, 100, `${p}-pile`) +
      '<g transform="translate(0 -511)">' +
      CLIP(`${p}-ca`, EXC_ARM) + CLIP(`${p}-ck`, EXC_BUCKET) +
      HOLE(`${p}-cb`, 824, 511, EXC_ARM + EXC_BUCKET) +
      IMG('excavator', 824, 511, `${p}-cb`) +
      `<g id="${p}-arm">${IMG('excavator', 824, 511, `${p}-ca`)}` +
        `<g id="${p}-bucket">${IMG('excavator', 824, 511, `${p}-ck`)}` +
          `<g id="${p}-load" opacity="0"><ellipse cx="712" cy="272" rx="62" ry="26" fill="#8c5c30"/><ellipse cx="700" cy="262" rx="40" ry="16" fill="#a8743f"/></g>` +
        '</g>' +
      '</g>' +
      '</g>';
  },
  async act(c) {
    await c.anim(800, { arm: { r: 10 }, bucket: { r: -20 } }); // 伸到土堆
    c.burst('bucket', 660, 300, { n: 8, vy: [-3, -1], size: [8, 14] });
    await c.anim(550, { bucket: { r: 35 }, load: { o: 1 }, pile: { sy: 0.75 } }); // 挖一口
    await c.anim(800, { arm: { r: -16 } }); // 舉起來
    await c.anim(450, { bucket: { r: -40 }, load: { o: 0 } }); // 倒掉
    c.burst('bucket', 670, 300, { n: 14, size: [8, 14] });
    await c.anim(800, { arm: { r: 0 }, bucket: { r: 0 }, pile: { sy: 1 } });
  },
};

// ---------- 砂石車：車斗舉起來，把土倒在後面 ----------
// 圖 866×614；車斗轉軸在後輪上方
const DUMP_BED = PATH([[0, 0], [706, 0], [706, 150], [612, 158], [548, 172], [548, 318], [470, 345], [330, 332], [180, 302], [60, 294], [0, 222]]);
const DUMP_LOAD = PATH([[128, 0], [592, 0], [586, 100], [480, 110], [470, 138], [138, 152]]);
const DUMP_PIVOT = [90, 300];
const dumpTruck = {
  id: 'dump', en: 'Dump Truck', zh: '砂石車', x: 530, y: 975, s: 0.44,
  hint: [300, -394],
  pivots: { bed: DUMP_PIVOT },
  art(p) {
    return '<g transform="translate(0 -614)">' +
      CLIP(`${p}-cd`, DUMP_BED) + HOLE(`${p}-cb`, 866, 614, DUMP_BED) + CLIP(`${p}-cl`, DUMP_LOAD) +
      `<clipPath id="${p}-cr"><path clip-rule="evenodd" d="${DUMP_BED}${DUMP_LOAD}"/></clipPath>` +
      IMG('dumptruck', 866, 614, `${p}-cb`) +
      `<line id="${p}-piston" x1="330" y1="350" x2="330" y2="300" stroke="#5a5f6b" stroke-width="18" stroke-linecap="round"/>` +
      `<g id="${p}-bed">${IMG('dumptruck', 866, 614, `${p}-cr`)}` +
        `<g id="${p}-load">${IMG('dumptruck', 866, 614, `${p}-cl`)}</g>` +
      '</g>' +
      '</g>';
  },
  async act(c) {
    const piston = c.el('piston');
    // 頂桿：下端固定在底盤，上端跟著車斗轉
    const [px, py] = DUMP_PIVOT;
    const upd = () => {
      const r = (c.get('bed').r * Math.PI) / 180;
      piston.setAttribute('x2', (px + 240 * Math.cos(r)).toFixed(1));
      piston.setAttribute('y2', (py + 240 * Math.sin(r)).toFixed(1));
    };
    await c.anim(900, { bed: { r: -32 } }, upd);
    const pour = c.anim(800, { load: { tx: -260, ty: 60, o: 0 } });
    for (let i = 0; i < 5; i++) {
      c.burst('bed', 10, 160 + i * 14, { n: 7, vx: [-3, -0.8], vy: [-1, 1], size: [8, 15] });
      await c.wait(150);
    }
    await pour;
    await c.wait(250);
    await c.anim(900, { bed: { r: 0 } }, upd);
    c.set('load', { tx: 0, ty: 0 });
    await c.anim(400, { load: { o: 1 } });
  },
};

// ---------- 堆高機：把一疊磚頭舉高再放下 ----------
// 圖 720×600；貨叉＋磚頭往上移，原本被擋住的門架用深灰色補起來
const FORK = PATH([[483, 328], [705, 328], [705, 470], [722, 470], [722, 506], [483, 506]]);
const forklift = {
  id: 'forklift', en: 'Forklift', zh: '堆高機', x: 960, y: 975, s: 0.4,
  hint: [620, -190],
  art(p) {
    return '<g transform="translate(0 -600)">' +
      CLIP(`${p}-cf`, FORK) + HOLE(`${p}-cb`, 720, 600, FORK) +
      IMG('forklift', 720, 600, `${p}-cb`) +
      '<rect x="490" y="320" width="28" height="190" fill="#3f4450"/><rect x="552" y="320" width="34" height="190" fill="#4b505c"/>' +
      `<g id="${p}-fork">${IMG('forklift', 720, 600, `${p}-cf`)}</g>` +
      '</g>';
  },
  async act(c) {
    await c.anim(1100, { fork: { ty: -250 } });
    await c.wait(500);
    await c.anim(1000, { fork: { ty: 0 } });
  },
};

// ---------- 壓路機：倒車壓一段路再開回來 ----------
// 圖 767×622；後輪用圓形裁出來，跟著車子轉
const ROLLER_WHEEL = CIRCLE(115, 505, 100);
const roller = {
  id: 'roller', en: 'Road Roller', zh: '壓路機', x: 1290, y: 975, s: 0.354,
  hint: [380, -300],
  art(p) {
    return `<g id="${p}-body"><g transform="translate(0 -622)">` +
      CLIP(`${p}-cw`, ROLLER_WHEEL) + HOLE(`${p}-cb`, 767, 622, ROLLER_WHEEL) +
      IMG('roller', 767, 622, `${p}-cb`) +
      `<g id="${p}-w" class="wheel" data-cx="115" data-cy="505">${IMG('roller', 767, 622, `${p}-cw`)}</g>` +
      '</g></g>';
  },
  async act(c) {
    await c.anim(1300, { body: { tx: -200 }, ...c.wheels(-115) });
    await c.wait(250);
    await c.anim(1200, { body: { tx: 0 }, ...c.wheels(115) });
  },
};

SCENES.construction = {
  w: 1600,
  h: 1000,
  bg: () => `
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <text x="56" y="98" font-size="60" font-weight="900" fill="${LINE}">Construction Site</text>
    <text x="58" y="148" font-size="38" font-weight="900" fill="${LINE}" opacity=".7">工地</text>
  `,
  // 先畫後排，再畫前排（後畫的會蓋在上面）
  items: [towerCrane, mixer, bulldozer, toilet, excavator, dumpTruck, forklift, roller],
};
}
