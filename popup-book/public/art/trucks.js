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
// 紙箱（扁平色塊），左上角在 (x, y)
const BOX = (x, y, w, h) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#d9a35b"/><rect x="${x}" y="${y + h * 0.7}" width="${w}" height="${h * 0.3}" fill="#bf8740"/>` +
  `<rect x="${x + w * 0.42}" y="${y}" width="${w * 0.16}" height="${h}" fill="#f0d29a"/>`;

// ---------- 聯結車：叭叭兩聲，排氣管冒煙，往前開一小段再倒回來 ----------
// 圖 874×339；兩根排氣管頂端在 (615, 10)、(680, 10)
const semi = {
  id: 'semi', en: 'Semi Truck', zh: '聯結車', x: 10, y: 715, s: 0.58,
  hint: [730, -200],
  art(p) {
    return `<g id="${p}-body"><g transform="translate(0 -339)">${IMG('semi', 874, 339)}</g></g>`;
  },
  async act(c) {
    speak('Honk honk!', { queue: true });
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

// ---------- 垃圾車（台灣的）：放「少女的祈禱」，大家把垃圾袋丟進後面的車斗 ----------
// 圖 775×518；白色車頭在右，黃色車身，車頂有擴音喇叭；車斗開口在最左邊 (70, 230)
// 音樂：Bądarzewska《少女的祈禱》（1856，公共領域）的主題，音符從 Wikimedia Commons 的公共領域 MIDI 讀出來，
// 用 app.js 的 playTune 以方波合成（像垃圾車喇叭的電子音），不是任何錄音
// [第幾拍, MIDI 音高]：先一串往上的分解和弦，然後「G～ F F Eb｜Eb D C C～」，最後收在 Eb
const MAIDENS_PRAYER = [
  [0, 70], [0.33, 75], [0.67, 79], [1, 82], [1.33, 87], [1.67, 91], [3.17, 89], [3.67, 89], [4.42, 87], [4.67, 87], [5, 86], [5.33, 84], [5.67, 84],
  [8, 62], [8.33, 65], [8.67, 70], [9, 74], [9.33, 77], [9.67, 86], [11.17, 84], [11.67, 84], [12.42, 82], [12.67, 82], [13, 80], [13.33, 79], [13.67, 79],
  [16, 62], [16.33, 65], [16.67, 68], [17, 74], [17.33, 77], [18, 67], [18.33, 70], [18.67, 75], [19, 79], [19.33, 82],
  [19.67, 70], [19.83, 72], [20, 70], [20.17, 72], [20.33, 69], [20.5, 70], [20.67, 79], [21.42, 77], [21.67, 75],
];
// 垃圾袋（扁平色塊），底部中心在 (0, 0)
const BAG = (fill, tie) =>
  `<path d="M-34,0 Q-42,-44 -14,-60 L-8,-74 L8,-74 L14,-60 Q42,-44 34,0Z" fill="${fill}"/>` +
  `<path d="M-34,0 Q-38,-20 -30,-30 L30,-30 Q38,-20 34,0Z" fill="#000" opacity=".12"/><rect x="-10" y="-80" width="20" height="10" rx="4" fill="${tie}"/>`;
const BAGS = [['#2f3240', '#ffcf3f'], ['#e9eef2', '#ff6b6b'], ['#ff9fb8', '#2f3240'], ['#7cc4ff', '#2f3240']];
const garbage = {
  id: 'garbage', en: 'Garbage Truck', zh: '垃圾車', x: 560, y: 730, s: 0.4,
  hint: [380, -300],
  pivots: { body: [400, 518] },
  art(p) {
    return '<g transform="translate(0 -518)">' +
      `<g id="${p}-body">${IMG('garbage', 775, 518)}</g>` +
      // 垃圾袋一開始放在車尾後面的地上（看不到），丟的時候才出現
      BAGS.map(([f, t], k) => `<g transform="translate(${-110 - k * 70} 518)"><g id="${p}-bag${k}" opacity="0">${BAG(f, t)}</g></g>`).join('') +
    '</g>';
  },
  async act(c) {
    const ms = playTune(MAIDENS_PRAYER, 110);
    const t0 = performance.now();
    // 音樂播放的時候車子輕輕晃（引擎在動）
    const idle = c.tween(ms, (t) => c.set('body', { ty: Math.sin(t * Math.PI * 60) * 1.5 }), (t) => t);
    for (let k = 0; k < BAGS.length; k++) {
      await c.wait(Math.max(0, 1200 + k * 2000 - (performance.now() - t0)));
      // 從地上拋到車斗開口：橫向等速，高度走拋物線
      const dx = 70 - (-110 - k * 70), top = -330;
      c.set(`bag${k}`, { o: 1, tx: 0, ty: 0, r: 0 });
      await c.anim(750, { [`bag${k}`]: { tx: dx, r: 200 } }, (t) => c.set(`bag${k}`, { ty: top * 4 * t * (1 - t) + (230 - 518 + 60) * t * t }));
      c.set(`bag${k}`, { o: 0 });
      c.burst('body', 70, 230, { n: 6, color: BAGS[k][0], vx: [0.5, 2.5], vy: [-2, 0.5], size: [5, 10], life: 500 });
      await c.anim(120, { body: { r: -1 } });
      await c.anim(160, { body: { r: 0 } });
    }
    await idle;
    c.set('body', { ty: 0 });
  },
};

// ---------- 送貨車：側門滑開，一個包裹跳出來落到地上 ----------
// 圖 925×506；側門 (290, 42)～(460, 305)，門後面補一個放滿紙箱的車廂
// 原圖門上的窗戶畫了半個送貨員，門一滑開人就被切成半截：所以窗戶改蓋成玻璃，
// 車廂裡放一個完整的送貨員（AI 生成的 courier.webp 371×858，捧著包裹），門打開以後他跳到車子前面的地上
const VAN_DOOR = RECT(290, 42, 460, 305);
const VAN_GLASS =
  '<rect x="298" y="46" width="156" height="154" rx="6" fill="#cfe2ea"/>' +
  '<path d="M330,46 L298,90 L298,120 L352,46Z M392,46 L298,175 L298,196 L412,46Z" fill="#e8f2f6"/>';
const CR = { s: 0.29, w: 371, h: 858 }; // 送貨員：高 249，站在車廂地板 (y = 305) 上
const van = {
  id: 'van', en: 'Delivery Van', zh: '送貨車', x: 990, y: 715, s: 0.36,
  hint: [375, -320],
  pivots: { man: [375, 305] },
  art(p) {
    return '<g transform="translate(0 -506)">' +
      HOLE(`${p}-cb`, 925, 506, VAN_DOOR) + IMG('van', 925, 506, `${p}-cb`) +
      '<rect x="290" y="42" width="170" height="263" fill="#3d4250"/><rect x="290" y="170" width="170" height="10" fill="#5a6070"/>' +
      BOX(296, 115, 60, 55) + BOX(390, 112, 62, 58) +
      `<g id="${p}-man"><image href="${SRC('courier')}" x="${375 - (CR.w * CR.s) / 2}" y="${305 - CR.h * CR.s}" width="${CR.w * CR.s}" height="${CR.h * CR.s}"/></g>` +
      CLIP(`${p}-cd`, VAN_DOOR) +
      `<g id="${p}-door">${IMG('van', 925, 506, `${p}-cd`)}${VAN_GLASS}</g>` +
    '</g>';
  },
  async act(c) {
    await c.anim(600, { door: { tx: -175 } });
    // 跳下車：往前一點、落到地上（y 506），人也稍微變大（離我們比較近）
    const down = 506 - 305 + 6;
    await c.anim(550, { man: { tx: 40, sx: 1.2, sy: 1.2 } }, (t) => c.set('man', { ty: -90 * 4 * t * (1 - t) + down * t * t }));
    await c.anim(120, { man: { sy: 1.1 } });
    await c.anim(150, { man: { sy: 1.2 } });
    // 開心地左右搖一搖（把包裹拿給你）
    for (let i = 0; i < 3; i++) {
      await c.anim(180, { man: { r: -6 } });
      await c.anim(180, { man: { r: 6 } });
    }
    await c.anim(150, { man: { r: 0 } });
    await c.wait(250);
    // 跳回車上，關門
    await c.anim(550, { man: { tx: 0, sx: 1, sy: 1 } }, (t) => c.set('man', { ty: down * (1 - t) * (1 - t) - 90 * 4 * t * (1 - t) }));
    await c.anim(600, { door: { tx: 0 } });
  },
};

// ---------- 冰淇淋車：車頂的冰淇淋跳起來搖一搖，噴出彩色糖粒 ----------
// 圖 647×500；冰淇淋插在車頂 (195, 150)
const icecream = {
  id: 'icecream', en: 'Ice Cream Truck', zh: '冰淇淋車', x: 1370, y: 735, s: 0.32, r: 2,
  hint: [330, -260],
  pivots: { cone: [195, 150] },
  art(p) {
    return '<g transform="translate(0 -500)">' + cut(p, 'icecream', 647, 500, { cone: RECT(95, 0, 248, 152) }) + '</g>';
  },
  async act(c) {
    await c.wait(500);
    speak('Ice cream!', { queue: true });
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
  id: 'carrier', en: 'Car Carrier', zh: '汽車運輸車', x: 30, y: 985, s: 0.62,
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
  id: 'monster', en: 'Monster Truck', zh: '怪獸卡車', x: 660, y: 975, s: 0.44, r: -9,
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
  id: 'sweeper', en: 'Street Sweeper', zh: '掃街車', x: 1190, y: 990, s: 0.44,
  hint: [660, -140],
  pivots: { brush: [665, 312] },
  art(p) {
    return `<g id="${p}-body"><g transform="translate(0 -432)">` +
      cut(p, 'sweeper', 747, 432, { brush: CIRCLE(665, 312, 88) }, { w1: [145.5, 355.5], w2: [525.5, 355] }) +
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
