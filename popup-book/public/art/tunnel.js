// 🚇 隧道工程：在山裡挖隧道的機器，點了會唸英文名字，然後動起來
// 版面 1600×1000；背景是山的剖面（tools/ai-art/sketch_tunnel.py 畫構圖，再讓 AI 照構圖重畫）：
// 隧道像剖開的房間，後牆 y ≈ 375～771、地面 y ≈ 771～969（前面的軌道在 y ≈ 930～946），右端 x ≈ 1460 是還沒挖開的岩壁
// 機器排兩排：後排站在地面上（y ≈ 805），前排在軌道上（y ≈ 955）
// 機器和背景是 AI 生成的圖（art/img/tunnel/*.webp），做法跟工地那一頁一樣（見 construction.js 開頭的說明）
// 輪子用 tools/ai-art/rig.py 拆好的圖層：<圖名>-w1.webp… 是正圓的輪胎外圈（會轉），<圖名>-front.webp 是輪框和擋在輪子前面的東西（不動）
// 整個檔案包在 { } 裡，變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/tunnel/${name}.webp`;
const IMG = (name, w, h, clip) =>
  `<image href="${SRC(name)}" width="${w}" height="${h}"${clip ? ` clip-path="url(#${clip})"` : ''}/>`;
const PATH = (pts) => 'M' + pts.map((p) => p.join(',')).join('L') + 'Z';
const RECT = (x0, y0, x1, y1) => PATH([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]);
const CLIP = (id, d) => `<clipPath id="${id}"><path d="${d}"/></clipPath>`;
const HOLE = (id, w, h, d) => `<clipPath id="${id}"><path clip-rule="evenodd" d="M0,0H${w}V${h}H0Z${d}"/></clipPath>`;
const ELLIPSE = (cx, cy, rx, ry) => `M${cx - rx},${cy}a${rx},${ry} 0 1,0 ${2 * rx},0a${rx},${ry} 0 1,0 ${-2 * rx},0Z`;
const ROCK = '#8c5c30', DUST = '#c9b79c', SHOT = '#a7a9ae';

// 一台車：車身（parts 的範圍挖掉）＋輪子圖層（會轉）＋ front（不動，也挖掉 parts）＋ parts（會動的零件）
function machine(p, name, w, h, wheels, parts = {}, cut = '') {
  const holes = Object.values(parts).join('');
  let out = HOLE(`${p}-cb`, w, h, holes + cut) + IMG(name, w, h, `${p}-cb`);
  for (const [k, [cx, cy]] of Object.entries(wheels)) {
    out += `<g id="${p}-${k}" class="wheel" data-cx="${cx}" data-cy="${cy}">${IMG(`${name}-${k}`, w, h)}</g>`;
  }
  if (Object.keys(wheels).length) out += HOLE(`${p}-cf`, w, h, holes + cut) + IMG(`${name}-front`, w, h, `${p}-cf`);
  for (const [k, d] of Object.entries(parts)) out += CLIP(`${p}-c${k}`, d) + `<g id="${p}-${k}">${IMG(name, w, h, `${p}-c${k}`)}</g>`;
  return out;
}

// ---------- 隧道鑽掘機（這頁的主角）：前面的大刀盤轉起來，往岩壁推進，碎石噴出來 ----------
// 圖 1318×430（刀盤在右）；刀盤是斜著看的圓（橢圓：中心 (1158, 208)、橫半徑 160、直半徑 198）
// 斜著看的圓不能直接轉（會晃），所以先把它壓成正圓、轉、再拉回橢圓：看起來就是刀盤在原地自轉
const TBM_C = [1158, 208], TBM_RX = 160, TBM_RY = 198;
const tbm = {
  id: 'tbm', en: 'Tunnel Boring Machine', zh: '隧道鑽掘機', x: 643, y: 805, s: 0.62,
  hint: [700, -230],
  pivots: { cutter: [0, 0] },
  art(p) {
    const [cx, cy] = TBM_C, k = TBM_RX / TBM_RY;
    const disc = ELLIPSE(cx, cy, TBM_RX, TBM_RY);
    return `<g id="${p}-body"><g transform="translate(0 -430)">` +
      HOLE(`${p}-cb`, 1318, 430, disc) + IMG('tbm', 1318, 430, `${p}-cb`) + CLIP(`${p}-cc`, disc) +
      `<g transform="translate(${cx} ${cy}) scale(${k} 1)"><g id="${p}-cutter">` +
        `<g transform="scale(${1 / k} 1) translate(${-cx} ${-cy})">${IMG('tbm', 1318, 430, `${p}-cc`)}</g>` +
      '</g></g>' +
    '</g></g>';
  },
  async act(c) {
    speak('Whoosh!', { queue: true });
    const spin = c.anim(4200, { cutter: { r: c.get('cutter').r + 1080 } });
    await c.anim(900, { body: { tx: 26 } });
    for (let i = 0; i < 14; i++) {
      c.burst('body', 1318, 120 + (i % 4) * 60 - 430, { n: 5, color: i % 2 ? ROCK : DUST, vx: [-3, 0.5], vy: [-3, 0], size: [6, 13] });
      await c.wait(160);
    }
    await c.anim(900, { body: { tx: 0 } });
    await spin;
  },
};

// ---------- 噴凝土機：手臂舉高，往隧道頂噴混凝土 ----------
// 圖 698×521（車頭在左）；手臂從底座 (250, 395) 斜斜伸到右上的噴嘴 (600, 20)，繞底座轉
const SHOT_ARM = PATH([[215, 395], [255, 355], [520, 40], [560, 0], [645, 0], [645, 60], [575, 120], [300, 425], [235, 428]]);
const shotcrete = {
  id: 'shotcrete', en: 'Shotcrete Sprayer', zh: '噴凝土機', x: 330, y: 805, s: 0.48,
  hint: [430, -330],
  pivots: { arm: [250, 395] },
  art(p) {
    return `<g transform="translate(0 -521)">` +
      machine(p, 'shotcrete', 698, 521, { w1: [120, 457], w2: [542.5, 457.5] }, { arm: SHOT_ARM }) +
    '</g>';
  },
  async act(c) {
    await c.anim(800, { arm: { r: -8 } });
    for (let i = 0; i < 18; i++) {
      c.burst('arm', 615, 10, { n: 4, color: SHOT, vx: [-0.5, 2.5], vy: [-5, -2.5], g: 0.05, size: [6, 12], life: 800 });
      if (i === 6) c.anim(900, { arm: { r: -2 } });
      if (i === 12) c.anim(900, { arm: { r: -8 } });
      await c.wait(120);
    }
    await c.anim(800, { arm: { r: 0 } });
  },
};

// ---------- 出土小火車：拉著裝滿石頭的礦車，冒煙往外開（朝左），再倒回來 ----------
// 圖 868×269（車頭在左）；煙囪在 (125, 5)
const loco = {
  id: 'loco', en: 'Mining Locomotive', zh: '出土小火車', x: -10, y: 958, s: 0.5,
  hint: [250, -170],
  art(p) {
    return `<g id="${p}-body"><g transform="translate(0 -269)">` +
      machine(p, 'loco', 868, 269, { w1: [111.5, 221.5], w2: [259, 222.5], w3: [381, 239], w4: [480.5, 239], w5: [632.5, 239], w6: [754.5, 231.5] }) +
    '</g></g>';
  },
  async act(c) {
    speak('Toot toot!', { queue: true });
    await c.anim(1600, { body: { tx: -200 }, ...c.wheels(-420) }, () => {
      if (Math.random() < 0.3) c.burst('body', 125, 5 - 269, { n: 2, color: '#9a9ea8', vx: [-0.5, 0.8], vy: [-2.6, -1.4], g: -0.02, size: [10, 18], life: 1000 });
    });
    await c.wait(300);
    await c.anim(1600, { body: { tx: 0 }, ...c.wheels(420) });
  },
};

// ---------- 隧道鑿岩台車：長手臂往前伸、抬一點，鑽頭在岩壁上鑽孔（震動、冒灰塵） ----------
// 圖 862×332（車頭在右）；手臂從根部 (185, 85) 一直伸到右邊 (810, 145)
const JUMBO_BOOM = PATH([[50, 0], [115, 0], [812, 126], [812, 164], [700, 160], [200, 102], [60, 72]]);
const jumbo = {
  id: 'jumbo', en: 'Drill Jumbo', zh: '隧道鑿岩台車', x: 440, y: 955, s: 0.45,
  hint: [520, -210],
  pivots: { boom: [185, 85] },
  art(p) {
    return `<g id="${p}-body"><g transform="translate(0 -332)">` +
      machine(p, 'jumbo', 862, 332, { w1: [276, 276.5], w2: [671, 276] }, { boom: JUMBO_BOOM }) +
    '</g></g>';
  },
  async act(c) {
    await c.anim(900, { body: { tx: 60 }, ...c.wheels(80) });
    await c.anim(600, { boom: { r: -5 } });
    for (let i = 0; i < 16; i++) {
      c.set('boom', { tx: i % 2 ? 3 : -3 });
      c.burst('boom', 812, 145, { n: 3, color: DUST, vx: [-1, 2], vy: [-2, 0], g: 0.05, size: [6, 12], life: 900 });
      await c.wait(90);
    }
    c.set('boom', { tx: 0 });
    await c.anim(600, { boom: { r: 0 } });
    await c.anim(900, { body: { tx: 0 }, ...c.wheels(-80) });
  },
};

// ---------- 地下鏟裝機：往前開，鏟斗鏟起一斗碎石舉起來，再倒車回去 ----------
// 圖 829×252（鏟斗在右）；鏟斗 (688～829, 35～205) 繞 (700, 100) 轉；左下角有一小堆土（AI 畫的），裁掉
const LHD_BUCKET = RECT(688, 35, 829, 205);
const lhd = {
  id: 'lhd', en: 'Underground Loader', zh: '地下鏟裝機', x: 880, y: 955, s: 0.45,
  hint: [430, -190],
  pivots: { bucket: [700, 100] },
  art(p) {
    return `<g id="${p}-body"><g transform="translate(0 -252)">` +
      machine(p, 'lhd', 829, 252, { w1: [324, 183.5], w2: [546, 182] }, { bucket: LHD_BUCKET }, RECT(0, 185, 210, 252)) +
    '</g></g>';
  },
  async act(c) {
    await c.anim(1000, { body: { tx: 130 }, ...c.wheels(170) });
    c.burst('bucket', 800, 200, { n: 12, color: ROCK, vx: [-1.5, 1.5], vy: [-3, -0.5], size: [6, 12] });
    await c.anim(600, { bucket: { r: -28 } });
    await c.wait(400);
    await c.anim(1000, { body: { tx: 0 }, ...c.wheels(-170) });
    await c.anim(500, { bucket: { r: 0 } });
  },
};

SCENES.tunnel = {
  w: 1600,
  h: 1000,
  bg: () => `
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <text x="56" y="98" font-size="60" font-weight="900" fill="${LINE}">Tunnel</text>
    <text x="58" y="148" font-size="38" font-weight="900" fill="${LINE}" opacity=".7">隧道工程</text>
  `,
  // 先畫後排（站在隧道地面上），再畫前排（軌道上）
  items: [shotcrete, tbm, loco, jumbo, lhd],
};
}
