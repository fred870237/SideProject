// 🛣️ 鋪馬路：刨掉舊柏油、運來新柏油、鋪平、壓實、畫線，一台接一台把一條馬路做好
// 版面 1600×1000；背景是側面看的施工中馬路（tools/ai-art/sketch_road.py 畫構圖，再讓 AI 照構圖重畫）：
// 上面是山坡和一排交通錐，後面那條路（y ≈ 583～807）已經鋪好黑色柏油，前面那條（y ≈ 825～1000）還是碎石路基
// 機器排兩排：後排在鋪好的路上（y ≈ 772），前排在碎石路基上（y ≈ 985）；鋪路機左邊那一段已經鋪好柏油（bg 畫的黑色長條）
// 機器是 AI 生成的圖（art/img/paving/*.webp），做法跟工地那一頁一樣（見 construction.js 開頭的說明）
// 畫線車的輪子用 tools/ai-art/rig.py 拆好的圖層；刨路機和鋪路機是履帶、壓路機是光滑的鋼輪，不用轉
// 整個檔案包在 { } 裡，變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/paving/${name}.webp`;
const IMG = (name, w, h, clip) =>
  `<image href="${SRC(name)}" width="${w}" height="${h}"${clip ? ` clip-path="url(#${clip})"` : ''}/>`;
const PATH = (pts) => 'M' + pts.map((p) => p.join(',')).join('L') + 'Z';
const CLIP = (id, d) => `<clipPath id="${id}"><path d="${d}"/></clipPath>`;
const HOLE = (id, w, h, d) => `<clipPath id="${id}"><path clip-rule="evenodd" d="M0,0H${w}V${h}H0Z${d}"/></clipPath>`;
const ASPHALT = '#3d3f47', OLD = '#7d7a74', STEAM = '#e9e9e4';
// 前面那條路的上下緣（場景座標）：鋪好的柏油長條就畫在這中間
const LANE_TOP = 828, LANE_BOT = 1000;

// ---------- 刨路機：往前開，把舊柏油刨碎，碎塊從長長的輸送帶尾端掉出來 ----------
// 圖 1233×450（車頭在右）；輸送帶從車頭 (660, 230) 斜斜伸到右上 (1200, 50)
const milling = {
  id: 'milling', en: 'Milling Machine', zh: '刨路機', x: -10, y: 772, s: 0.58,
  hint: [520, -230],
  art(p) {
    return `<g id="${p}-body"><g transform="translate(0 -450)">${IMG('milling', 1233, 450)}</g></g>`;
  },
  async act(c) {
    await c.anim(2600, { body: { tx: 90 } }, (t) => {
      c.set('body', { ty: Math.sin(t * Math.PI * 40) * 1.5 });
      if (Math.random() < 0.4) c.burst('body', 1200, 60 - 450, { n: 2, color: Math.random() < 0.5 ? OLD : ASPHALT, vx: [0.5, 2.5], vy: [-1, 0.5], size: [5, 11] });
      if (Math.random() < 0.2) c.burst('body', 440, -10, { n: 2, color: '#b9b2a4', vx: [-1.5, 1.5], vy: [-1.5, -0.3], g: -0.01, size: [8, 14], life: 800 });
    });
    c.set('body', { ty: 0 });
    await c.wait(250);
    await c.anim(1400, { body: { tx: 0 } });
  },
};

// ---------- 畫線車：往前開，後面的噴嘴在路上畫出白色的虛線 ----------
// 圖 647×242（車頭在右）；噴嘴在左下 (40, 215)；虛線畫在地面上（y = 0），放在車身外面，車子倒回去線還留著
const PAINT_DX = 160; // 開多遠（圖的座標）
const painter = {
  id: 'painter', en: 'Line Painting Truck', zh: '畫線車', x: 1110, y: 772, s: 0.6,
  hint: [330, -130],
  pivots: { reveal: [40, 0] },
  // 放大到中間的話車子一開就跑出畫面、線也跟路對不上，所以在原地動
  focus: false,
  art(p) {
    let dashes = '';
    for (let x = 40; x < 40 + PAINT_DX; x += 70) dashes += `<rect x="${x}" y="-14" width="44" height="8" rx="3" fill="#fff"/>`;
    const wheels = [['w1', 198, 188.5], ['w2', 280.5, 192.5], ['w3', 555, 191.5]];
    return `<clipPath id="${p}-cl"><rect id="${p}-reveal" x="40" y="-20" width="${PAINT_DX}" height="24" transform="scale(0.001 1)"/></clipPath>` +
      `<g id="${p}-line" clip-path="url(#${p}-cl)">${dashes}</g>` +
      `<g id="${p}-body"><g transform="translate(0 -242)">` +
        IMG('painter', 647, 242) +
        wheels.map(([k, cx, cy]) => `<g id="${p}-${k}" class="wheel" data-cx="${cx}" data-cy="${cy}">${IMG(`painter-${k}`, 647, 242)}</g>`).join('') +
        IMG('painter-front', 647, 242) +
      '</g></g>';
  },
  setup(c) { c.set('reveal', { sx: 0.001 }); },
  async act(c) {
    c.set('line', { o: 1 });
    await c.anim(2200, { body: { tx: PAINT_DX }, reveal: { sx: 1 }, ...c.wheels(PAINT_DX * 1.2) }, () => {
      if (Math.random() < 0.3) c.burst('body', 40, -30, { n: 2, color: '#ffffff', vx: [-0.6, 0.6], vy: [-0.6, 0.2], g: 0.1, size: [3, 6], life: 500 });
    }, (t) => t);
    await c.wait(600);
    await c.anim(1600, { body: { tx: 0 }, ...c.wheels(-PAINT_DX * 1.2) });
    await c.anim(500, { line: { o: 0 } });
    c.set('reveal', { sx: 0.001 });
  },
};

// ---------- 鋪路機：慢慢往前開，後面鋪出一條熱熱的新柏油（冒蒸氣） ----------
// 圖 600×330（前面的料斗在右，後面在左）；新鋪的柏油是一條黑色長條，從圖的左邊 x = 0 往右長出來（放在車身外面）
const PAVE_DX = 200;
const paver = {
  id: 'paver', en: 'Asphalt Paver', zh: '鋪路機', x: 470, y: 985, s: 0.62,
  hint: [300, -170],
  pivots: { mat: [0, 0] },
  // 新鋪的柏油要跟背景那條路對齊，放大到中間就對不上了，所以在原地動
  focus: false,
  art(p) {
    const y0 = (LANE_TOP - paver.y) / paver.s, y1 = (LANE_BOT - paver.y) / paver.s;
    return `<rect id="${p}-mat" x="0" y="${y0}" width="${PAVE_DX}" height="${y1 - y0}" fill="${ASPHALT}" transform="scale(0.001 1)"/>` +
      `<g id="${p}-body"><g transform="translate(0 -330)">${IMG('paver', 600, 330)}</g></g>`;
  },
  setup(c) { c.set('mat', { sx: 0.001 }); },
  async act(c) {
    await c.anim(2600, { body: { tx: PAVE_DX }, mat: { sx: 1 } }, () => {
      if (Math.random() < 0.35) c.burst('body', 10, -110, { n: 2, color: STEAM, vx: [-0.8, 0.2], vy: [-2, -1], g: -0.03, size: [10, 18], life: 1100 });
    }, (t) => t);
    await c.wait(700);
    await c.anim(1600, { body: { tx: 0 }, mat: { sx: 0.001 } });
  },
};

// ---------- 壓路機：在剛鋪好的柏油上來回壓，一邊震動把路壓平 ----------
// 圖 896×462；兩個大鋼輪是光滑的，不用轉（id 不用 roller，免得跟工地那頁的壓路機撞名）
const roller = {
  id: 'proller', en: 'Road Roller', zh: '壓路機', x: 30, y: 985, s: 0.4,
  hint: [450, -260],
  art(p) {
    return `<g id="${p}-body"><g transform="translate(0 -462)">${IMG('roller', 896, 462)}</g></g>`;
  },
  async act(c) {
    const shake = () => c.set('body', { ty: (Math.random() - 0.5) * 5 });
    await c.anim(1400, { body: { tx: -60 } }, shake);
    await c.anim(1400, { body: { tx: 100 } }, shake);
    await c.anim(1000, { body: { tx: 0 } }, shake);
    c.set('body', { ty: 0 });
  },
};

// ---------- 柏油卡車：把車斗舉起來，熱熱的柏油倒進後面鋪路機的料斗 ----------
// 圖 607×329（車頭在右）；車斗 (0～458, 0～196) 繞後面下緣 (40, 110) 往上舉
const TIPPER = PATH([[0, 0], [458, 0], [458, 178], [300, 196], [150, 152], [0, 98]]);
const asphalt = {
  id: 'asphalt', en: 'Asphalt Truck', zh: '柏油卡車', x: 900, y: 985, s: 0.6,
  hint: [330, -170],
  pivots: { tipper: [40, 110] },
  art(p) {
    return `<g transform="translate(0 -329)">` +
      HOLE(`${p}-cb`, 607, 329, TIPPER) + IMG('asphalt', 607, 329, `${p}-cb`) +
      CLIP(`${p}-ct`, TIPPER) + `<g id="${p}-tipper">${IMG('asphalt', 607, 329, `${p}-ct`)}</g>` +
    '</g>';
  },
  async act(c) {
    await c.anim(1200, { tipper: { r: -24 } });
    for (let i = 0; i < 12; i++) {
      c.burst('tipper', 6, 30, { n: 4, color: ASPHALT, vx: [-2.2, -0.6], vy: [-0.5, 1], size: [6, 12] });
      if (i % 3 === 0) c.burst('tipper', 30, 10, { n: 1, color: STEAM, vx: [-0.5, 0.5], vy: [-1.8, -1], g: -0.03, size: [10, 16], life: 900 });
      await c.wait(130);
    }
    await c.wait(200);
    await c.anim(1200, { tipper: { r: 0 } });
  },
};

SCENES.paving = {
  w: 1600,
  h: 1000,
  bg: () => `
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <rect x="0" y="${LANE_TOP}" width="${paver.x + 4}" height="${LANE_BOT - LANE_TOP}" fill="${ASPHALT}"/>
    <text x="56" y="98" font-size="60" font-weight="900" fill="${LINE}">Road Paving</text>
    <text x="58" y="148" font-size="38" font-weight="900" fill="${LINE}" opacity=".7">鋪馬路</text>
  `,
  // 先畫後排（鋪好的路上），再畫前排（碎石路基上）；鋪路機要比壓路機先畫，新鋪的柏油才不會蓋住壓路機
  items: [milling, painter, paver, roller, asphalt],
};
}
