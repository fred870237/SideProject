// 🏢 蓋大樓：點車子會唸英文名字，然後像機關書一樣動起來
// 版面 1600×1000；右邊是蓋到一半的大樓（場景座標 x 835～1430，二樓樓板 y ≈ 568），地面從 y ≈ 730 開始
// 車子和背景是 AI 生成的圖（art/img/building/*.webp），做法跟工地那一頁一樣（見 construction.js 開頭的說明）
// 整個檔案包在 { } 裡，車子的變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/building/${name}.webp`;
const IMG = (name, w, h, clip) =>
  `<image href="${SRC(name)}" width="${w}" height="${h}"${clip ? ` clip-path="url(#${clip})"` : ''}/>`;
const PATH = (pts) => 'M' + pts.map((p) => p.join(',')).join('L') + 'Z';
const RECT = (x0, y0, x1, y1) => PATH([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]);
const CLIP = (id, d) => `<clipPath id="${id}"><path d="${d}"/></clipPath>`;
const HOLE = (id, w, h, d) => `<clipPath id="${id}"><path clip-rule="evenodd" d="M0,0H${w}V${h}H0Z${d}"/></clipPath>`;
const CIRCLE = (cx, cy, r) => `M${cx - r},${cy}a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0Z`;
const CONCRETE = '#9a9ca4';

// ---------- 混凝土泵浦車：支撐腳伸出來，四節手臂一節一節展開拱成大弧，從垂下來的軟管把混凝土打進大樓 ----------
// 圖 940×308（車頭在左），AI 圖上的手臂只有兩節：所以把手臂的一段（x 300～620，橘色臂＋灰色管子）當「一節」的素材，
// 重複接成 4 節（每一節接在上一節的末端，巢狀轉軸）。收起來 Z 字形摺疊平躺在車上，展開時像真的泵浦車拱成一個大弧，最後一節垂直往下
// 支撐腳：前 (238～282) 後 (822～935) 兩組，從圖上裁出來；平常收在車底（往上縮），工作前往外伸、再往下踩到地上
const PUMP = { x: 380, y: 805, s: 0.7, h: 308 };
const pumpLocal = (X, Y) => [(X - PUMP.x) / PUMP.s, (Y - PUMP.y) / PUMP.s + PUMP.h]; // 場景座標 → 圖片座標
const ARM_ORIG = PATH([[300, 46], [630, 50], [636, 98], [300, 100]]) + PATH([[630, 46], [792, 56], [792, 98], [630, 100]]);
const SEC_LEN = [320, 300, 260, 180]; // 四節手臂的長度（素材原本長 320）
const SEC_FOLD = [-4, 176, -176, 176]; // 收起來：Z 字形疊在車上（每一節相對上一節的角度）
const SEC_OPEN = [-70, 50, 50, 55]; // 展開：絕對角度 -70°、-20°、30°、85°（最後一節幾乎垂直往下）
const LEG_F = RECT(236, 192, 284, 306), LEG_R = PATH([[820, 192], [874, 192], [874, 220], [936, 220], [936, 252], [874, 252], [874, 306], [820, 306]]);
const LEG_UP = -78, LEG_OUT = 46; // 腳收起來時往上縮多少；工作時往外伸多少
// 大樓二樓的一小塊（場景座標 910～1110, 470～640）放進泵浦車這一組，焦點模式放大時跟著出來
const [AX, AY] = pumpLocal(910, 470);
const [AX2, AY2] = pumpLocal(1110, 640);
const [PX, PY] = pumpLocal(1014, 572); // 混凝土倒在樓板上的位置
const pump = {
  id: 'pump', en: 'Concrete Pump Truck', zh: '混凝土泵浦車', ...PUMP,
  hint: [450, -233],
  // 焦點模式的範圍：車子＋展開的手臂（最高到 y ≈ -336）＋那一小塊大樓
  box: [0, -660, Math.max(940, AX2), 660],
  tag: [PUMP.x + 470 * PUMP.s, PUMP.y + 26], // 外框被那一小塊大樓撐大了，標籤位置自己指定
  art(p) {
    // 一節手臂：素材從 (300, 73) 開始，沿 x 方向拉成長度 L；下一節接在 (L, 0)
    const sec = (k, inner) =>
      `<g id="${p}-s${k}"><g transform="scale(${SEC_LEN[k] / 320} 1)">` +
        `<image href="${SRC('pump')}" x="-300" y="-73" width="940" height="308" clip-path="url(#${p}-sc)"/></g>` +
        `<g transform="translate(${SEC_LEN[k]} 0)">${inner}</g></g>`;
    const hose = `<g id="${p}-hose" opacity="0"><path d="M0,0 L72,0" stroke="#2d2f38" stroke-width="13" stroke-linecap="round"/></g>`;
    let arm = hose;
    for (let k = SEC_LEN.length - 1; k >= 0; k--) arm = sec(k, arm);
    const leg = (id, near) =>
      `<g id="${p}-${id}">${near ? '<g transform="translate(0 10) scale(1 1.04)">' : '<g>'}${IMG('pump', 940, 308, `${p}-c${id.slice(0, 2)}`)}</g></g>`;
    return '<g transform="translate(0 -308)">' +
      `<svg x="${AX}" y="${AY}" width="${AX2 - AX}" height="${AY2 - AY}" viewBox="910 470 200 170" preserveAspectRatio="none">` +
        `<clipPath id="${p}-cw"><rect x="910" y="470" width="200" height="170" rx="16"/></clipPath>` +
        `<image href="${SRC('bg')}" width="1600" height="1000" clip-path="url(#${p}-cw)"/></svg>` +
      // 倒在樓板上的混凝土（一開始看不到）
      `<g id="${p}-pour" opacity="0"><ellipse cx="${PX}" cy="${PY}" rx="62" ry="13" fill="${CONCRETE}"/><ellipse cx="${PX - 8}" cy="${PY - 6}" rx="34" ry="8" fill="#b4b6bd"/></g>` +
      CLIP(`${p}-clf`, LEG_F) + CLIP(`${p}-clr`, LEG_R) + `<clipPath id="${p}-sc"><rect x="0" y="-25" width="320" height="50"/></clipPath>` +
      // 支撐腳畫在車身後面：收起來往上縮時會被車身擋住；靠近我們的那一支（near）往下錯開一點，表示另一側的腳
      leg('lf') + leg('lr') +
      HOLE(`${p}-cb`, 940, 308, ARM_ORIG + LEG_F + LEG_R) + IMG('pump', 940, 308, `${p}-cb`) +
      leg('lfn', true) + leg('lrn', true) +
      `<g transform="translate(275 68)">${arm}</g>` +
    '</g>';
  },
  setup(c) {
    SEC_FOLD.forEach((r, k) => c.set(`s${k}`, { r }));
    ['lf', 'lr', 'lfn', 'lrn'].forEach((k) => c.set(k, { ty: LEG_UP, o: k.length > 2 ? 0 : 1 }));
  },
  async act(c) {
    // 1. 支撐腳：前後左右往外伸出去，再往下踩到地上
    c.set('lfn', { o: 1 }); c.set('lrn', { o: 1 });
    await c.anim(600, { lf: { tx: -LEG_OUT }, lr: { tx: LEG_OUT }, lfn: { tx: -LEG_OUT * 1.4 }, lrn: { tx: LEG_OUT * 1.4 } });
    await c.anim(500, { lf: { ty: 0 }, lr: { ty: 0 }, lfn: { ty: 0 }, lrn: { ty: 0 } });
    // 零件座標是原圖的位置（伸出去的位移已經在零件的 transform 裡）
    c.burst('lf', 260, 306, { n: 8, color: '#c9a36b', vx: [-2, 2], vy: [-2, -0.5], size: [5, 10] });
    c.burst('lr', 848, 306, { n: 8, color: '#c9a36b', vx: [-2, 2], vy: [-2, -0.5], size: [5, 10] });
    // 2. 四節手臂一節一節展開
    await c.anim(1100, { s0: { r: SEC_OPEN[0] } });
    await c.anim(1000, { s1: { r: SEC_OPEN[1] } });
    await c.anim(1000, { s2: { r: SEC_OPEN[2] } });
    await c.anim(800, { s3: { r: SEC_OPEN[3] } });
    await c.anim(250, { hose: { o: 1 } });
    // 3. 從軟管末端倒出混凝土（灰色），樓板上慢慢積一攤
    const pour = c.anim(1800, { pour: { o: 1 } });
    for (let i = 0; i < 16; i++) {
      c.burst('s3', SEC_LEN[3] + 72, 0, { n: 4, color: CONCRETE, vx: [-0.6, 0.6], vy: [0.5, 2], g: 0.3, size: [6, 11], life: 500 });
      await c.wait(120);
    }
    await pour;
    // 4. 收回：手臂反著摺回去，腳收起來
    await c.anim(250, { hose: { o: 0 } });
    await c.anim(700, { s3: { r: SEC_FOLD[3] } });
    await c.anim(800, { s2: { r: SEC_FOLD[2] } });
    await c.anim(800, { s1: { r: SEC_FOLD[1] } });
    await c.anim(1000, { s0: { r: SEC_FOLD[0] } });
    await c.anim(450, { lf: { ty: LEG_UP }, lr: { ty: LEG_UP }, lfn: { ty: LEG_UP }, lrn: { ty: LEG_UP } });
    await c.anim(500, { lf: { tx: 0 }, lr: { tx: 0 }, lfn: { tx: 0, o: 0 }, lrn: { tx: 0, o: 0 } });
    await c.anim(500, { pour: { o: 0 } });
  },
};

// ---------- 打樁機：重錘「咚、咚、咚」把樁打進地裡 ----------
// 圖 781×563；重錘掛在 (455, 25～190)；原圖的樁在右邊 (630～668)，裁出來移到重錘正下方，露出地面的部分才看得到
const PILE = RECT(626, 25, 672, 545);
const PILE_DX = 455 - 649, PILE_TOP = 300; // 樁移過去以後頂端在 y = 300
const piledriver = {
  id: 'piledriver', en: 'Pile Driver', zh: '打樁機', x: 10, y: 990, s: 0.58,
  hint: [455, -453],
  art(p) {
    const hammer = RECT(425, 20, 485, 195);
    return '<g transform="translate(0 -563)">' +
      HOLE(`${p}-cb`, 781, 563, PILE + hammer) + IMG('piledriver', 781, 563, `${p}-cb`) +
      CLIP(`${p}-cp`, PILE) + CLIP(`${p}-ch`, hammer) +
      `<clipPath id="${p}-cg"><rect x="0" y="0" width="781" height="548"/></clipPath>` +
      `<g clip-path="url(#${p}-cg)"><g transform="translate(${PILE_DX} ${PILE_TOP - 25})"><g id="${p}-pile">${IMG('piledriver', 781, 563, `${p}-cp`)}</g></g></g>` +
      `<g id="${p}-hammer">${IMG('piledriver', 781, 563, `${p}-ch`)}</g>` +
    '</g>';
  },
  async act(c) {
    c.set('pile', { ty: 0 });
    const hit = PILE_TOP - 192; // 重錘底部 (y 190) 碰到樁頂要往下多少
    for (let i = 0; i < 3; i++) {
      await c.anim(500, { hammer: { ty: -10 } });
      await c.anim(220, { hammer: { ty: hit + i * 28 } }, null);
      c.burst('pile', 649, 548 - (PILE_TOP - 25) - i * 28, { n: 10, color: '#a8743f', vx: [-2.5, 2.5], vy: [-3, -1], size: [6, 12] });
      c.set('pile', { ty: (i + 1) * 28 });
      await c.anim(120, { hammer: { ty: hit + (i + 1) * 28 - 8 } });
    }
    await c.anim(700, { hammer: { ty: 0 } });
    await c.wait(500);
    await c.anim(500, { pile: { o: 0 } });
    c.set('pile', { ty: 0 });
    await c.anim(400, { pile: { o: 1 } });
  },
};

// ---------- 吊車：伸縮吊臂抬高，吊鉤晃一晃 ----------
// 圖 764×538（翻轉過，車頭在右）；吊臂轉軸在轉台 (495, 290)，吊鉤掛在吊臂尖端 (22, 15)，吊臂轉的時候吊鉤反過來轉才會一直往下垂
const crane = {
  id: 'crane', en: 'Mobile Crane', zh: '吊車', x: 30, y: 755, s: 0.56,
  hint: [250, -398],
  pivots: { boom: [495, 290], hook: [22, 15] },
  art(p) {
    const boom = PATH([[0, 0], [62, 0], [540, 262], [540, 318], [470, 320], [0, 58]]);
    const hook = RECT(0, 58, 52, 168);
    return '<g transform="translate(0 -538)">' +
      HOLE(`${p}-cb`, 764, 538, boom + hook) + IMG('crane', 764, 538, `${p}-cb`) +
      CLIP(`${p}-cm`, boom) + CLIP(`${p}-ck`, hook) +
      `<g id="${p}-boom">${IMG('crane', 764, 538, `${p}-cm`)}<g id="${p}-hook">${IMG('crane', 764, 538, `${p}-ck`)}</g></g>` +
    '</g>';
  },
  async act(c) {
    await c.anim(1000, { boom: { r: 18 }, hook: { r: -18 } });
    for (let i = 0; i < 3; i++) {
      await c.anim(280, { hook: { r: -30 } });
      await c.anim(280, { hook: { r: -6 } });
    }
    await c.anim(280, { hook: { r: -18 } });
    await c.anim(1000, { boom: { r: 0 }, hook: { r: 0 } });
  },
};

// ---------- 高空作業車：手臂抬起來，把籃子裡的工人送到高處 ----------
// 圖 589×498；底座以上的整組手臂（灰色臂、斜臂、上臂、籃子）一起繞灰色臂插進底座的地方 (490, 236) 轉
// 底座的上緣是斜的（左邊 (255, 293) 低、右邊 (512, 229) 高），裁切線要沿著這條斜邊，灰色臂的根部才不會被留在底座上斷成一截
const boomlift = {
  id: 'boomlift', en: 'Boom Lift', zh: '高空作業車', x: 1170, y: 990, s: 0.5,
  hint: [75, -408],
  pivots: { arm: [490, 236] },
  box: [0, -700, 589, 700], // 焦點模式要把抬高以後的籃子也算進去
  art(p) {
    const arm = PATH([[0, 0], [589, 0], [589, 221], [512, 223], [255, 286], [0, 286]]);
    return '<g transform="translate(0 -498)">' +
      HOLE(`${p}-cb`, 589, 498, arm) + IMG('boomlift', 589, 498, `${p}-cb`) +
      CLIP(`${p}-ca`, arm) + `<g id="${p}-arm">${IMG('boomlift', 589, 498, `${p}-ca`)}</g>` +
    '</g>';
  },
  async act(c) {
    await c.anim(1400, { arm: { r: 20 } });
    for (let i = 0; i < 3; i++) {
      await c.anim(200, { arm: { r: 22 } });
      await c.anim(200, { arm: { r: 18 } });
    }
    await c.wait(300);
    await c.anim(1300, { arm: { r: 0 } });
  },
};

// ---------- 小山貓（滑移裝載機）：鏟斗舉起來，往前衝一下再倒回來 ----------
// 圖 757×551（翻轉過，鏟斗在右）
const SKID_BUCKET = PATH([[530, 285], [757, 285], [757, 515], [530, 515]]);
const skidsteer = {
  id: 'skid', en: 'Skid Steer Loader', zh: '小山貓', x: 640, y: 990, s: 0.36, r: -4,
  hint: [650, -121],
  pivots: { bucket: [545, 300] },
  art(p) {
    return `<g id="${p}-body"><g transform="translate(0 -551)">` +
      HOLE(`${p}-cb`, 757, 551, SKID_BUCKET + CIRCLE(165, 455, 88) + CIRCLE(430, 455, 88)) +
      IMG('skidsteer', 757, 551, `${p}-cb`) +
      CLIP(`${p}-cw1`, CIRCLE(165, 455, 88)) + CLIP(`${p}-cw2`, CIRCLE(430, 455, 88)) + CLIP(`${p}-ck`, SKID_BUCKET) +
      `<g id="${p}-w1" class="wheel" data-cx="165" data-cy="455">${IMG('skidsteer', 757, 551, `${p}-cw1`)}</g>` +
      `<g id="${p}-w2" class="wheel" data-cx="430" data-cy="455">${IMG('skidsteer', 757, 551, `${p}-cw2`)}</g>` +
      `<g id="${p}-bucket">${IMG('skidsteer', 757, 551, `${p}-ck`)}</g>` +
    '</g></g>';
  },
  async act(c) {
    await c.anim(500, { bucket: { r: -25 } });
    await c.anim(800, { body: { tx: 220 }, ...c.wheels(200) });
    c.burst('bucket', 700, 420, { n: 10, color: '#a8743f', vx: [0.5, 2.5], vy: [-2, 0], size: [6, 12] });
    await c.anim(300, { bucket: { r: 10 } });
    await c.anim(300, { bucket: { r: -25 } });
    await c.anim(900, { body: { tx: 0 }, ...c.wheels(-200) });
    await c.anim(400, { bucket: { r: 0 } });
  },
};

SCENES.building = {
  w: 1600,
  h: 1000,
  bg: () => `
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <text x="56" y="98" font-size="60" font-weight="900" fill="${LINE}">Building Site</text>
    <text x="58" y="148" font-size="38" font-weight="900" fill="${LINE}" opacity=".7">蓋大樓</text>
  `,
  // 先畫後排，再畫前排
  items: [crane, pump, boomlift, piledriver, skidsteer],
};
}
