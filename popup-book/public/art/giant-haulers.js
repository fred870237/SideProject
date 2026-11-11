// 🚚 超大運輸：載超大、超長、超重貨物的特種車（葉片、船身、變壓器），前導車在旁邊提醒大家小心
// 同一條公路的另一頁是 🛣️ 長途運輸（long-haul.js），兩頁共用 art/img/giant-haulers/ 裡的圖和背景
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

// ---------- 風機葉片運輸車：超長的白色葉片，尾端抬起來（真的運輸車轉彎時會把葉片抬高） ----------
// 圖 1378×247（車頭在左，往左開）；葉片從車頭後面的根部 (200, 80) 一路伸到右邊 (1378, 100)，繞根部轉
const BLADE = PATH([[160, 0], [420, 6], [800, 40], [1100, 70], [1378, 92], [1378, 108], [1000, 122], [700, 138], [450, 150], [160, 160]]);
const blade = {
  id: 'blade', en: 'Wind Turbine Blade Truck', zh: '風機葉片運輸車', x: -30, y: 785, s: 0.66,
  hint: [700, -160],
  pivots: { blade: [200, 80] },
  // 葉片抬起來會比車子高很多，焦點模式的範圍要把它算進去
  box: [0, -560, 1378, 560],
  art(p) {
    return `<g id="${p}-body"><g transform="translate(0 -247)">` +
      truck(p, 'blade', 1378, 247, { w1: [84, 234.5], w2: [213, 207], w3: [683.5, 209], w4: [883.5, 208.5] }, { blade: BLADE }) +
    '</g></g>';
  },
  async act(c) {
    await c.anim(1600, { blade: { r: -16 } });
    await c.wait(500);
    await c.anim(500, { blade: { r: -13 } });
    await c.anim(500, { blade: { r: -16 } });
    await c.wait(300);
    await c.anim(1500, { blade: { r: 0 } });
  },
};

// ---------- 多軸自走式平台車：一排排小輪子一起轉，載著巨大的船身慢慢移動 ----------
// 圖 1436×400；沒有駕駛室，用遙控的；液壓懸吊讓它走的時候上下輕輕起伏
const spmt = {
  id: 'spmt', en: 'Modular Transporter', zh: '多軸平台車', x: 560, y: 995, s: 0.66,
  hint: [720, -250],
  art(p) {
    return `<g id="${p}-body"><g transform="translate(0 -400)">` +
      truck(p, 'spmt', 1436, 400, { w1: [169.5, 350], w2: [327, 350], w3: [483.5, 349.5], w4: [1081, 351.5], w5: [1171, 351], w6: [1335.5, 349.5] }) +
    '</g></g>';
  },
  async act(c) {
    speak('Beep beep!', { queue: true });
    const deg = 160;
    await c.anim(2600, { body: { tx: 160 }, ...c.wheels(deg) }, (t) => c.set('body', { ty: Math.sin(t * Math.PI * 6) * 3 }));
    await c.wait(300);
    await c.anim(2600, { body: { tx: 0 }, ...c.wheels(-deg) }, (t) => c.set('body', { ty: Math.sin(t * Math.PI * 6) * 3 }));
    c.set('body', { ty: 0 });
  },
};

// ---------- 重型平板拖車：載著巨大的變壓器，慢慢開，貨物晃一晃 ----------
// 圖 882×244（車頭在右）；變壓器 (0～430, 0～140) 單獨裁出來晃
const HEAVY_LOAD = RECT(0, 0, 430, 142);
const heavyhaul = {
  id: 'heavyhaul', en: 'Heavy Haul Truck', zh: '重型平板拖車', x: -10, y: 995, s: 0.6,
  hint: [215, -170],
  pivots: { load: [215, 142] },
  art(p) {
    return `<g id="${p}-body"><g transform="translate(0 -244)">` +
      truck(p, 'heavyhaul', 882, 244, { w1: [86, 208], w2: [165, 208], w3: [469.5, 211], w4: [544, 211], w5: [825, 200] }, { load: HEAVY_LOAD }) +
    '</g></g>';
  },
  async act(c) {
    speak('Toot toot!', { queue: true });
    const go = c.anim(1800, { body: { tx: -160 }, ...c.wheels(-224) });
    for (let i = 0; i < 3; i++) {
      await c.anim(300, { load: { r: 2 } });
      await c.anim(300, { load: { r: -2 } });
    }
    await go;
    await c.anim(200, { load: { r: 0 } });
    await c.anim(1800, { body: { tx: 0 }, ...c.wheels(224) });
  },
};

// ---------- 前導車：車頂的黃燈閃啊閃，大牌子寫著「OVERSIZE LOAD」（後面有超大的貨，請小心） ----------
// 圖 627×379（車頭在右）；牌子 (22～277, 0～108)，字用程式寫；車頂兩顆黃燈在 (380, 152)、(472, 156)
// 圖的左下角有一點雜點、最下面有一條陰影線，都裁掉（高度只用到 368）
const ESCORT_LIGHTS = [[380, 152], [472, 156]];
const escort = {
  id: 'escort', en: 'Escort Truck', zh: '前導車', x: 1150, y: 785, s: 0.5,
  hint: [440, -170],
  pivots: { sign: [150, 108] },
  art(p) {
    return `<g id="${p}-body"><g transform="translate(0 -368)">` +
      `<clipPath id="${p}-cc"><path clip-rule="evenodd" d="M0,0H627V368H0Z${RECT(20, 328, 52, 368)}"/></clipPath>` +
      `<g clip-path="url(#${p}-cc)">` +
        truck(p, 'escort', 627, 379, { w1: [139.5, 323], w2: [241.5, 321], w3: [549, 333] }, { sign: RECT(18, 0, 282, 112) }) +
      '</g>' +
      // 牌子上的字跟著牌子動，所以放在 sign 這個零件裡（用 c.el 加進去）
      ESCORT_LIGHTS.map(([x, y], k) => `<g id="${p}-l${k}" opacity="0"><circle cx="${x}" cy="${y}" r="34" fill="#ffd23f" opacity=".55"/><circle cx="${x}" cy="${y}" r="16" fill="#fff6c4"/></g>`).join('') +
    '</g></g>';
  },
  setup(c) {
    c.el('sign').insertAdjacentHTML('beforeend',
      '<text x="150" y="48" text-anchor="middle" font-size="40" font-weight="900" fill="#1e1e28">OVERSIZE</text>' +
      '<text x="150" y="92" text-anchor="middle" font-size="40" font-weight="900" fill="#1e1e28">LOAD</text>');
  },
  async act(c) {
    speak('Oversize load!', { queue: true });
    const blink = (async () => {
      for (let i = 0; i < 8; i++) {
        c.set(`l${i % 2}`, { o: 1 }); c.set(`l${(i + 1) % 2}`, { o: 0 });
        await c.wait(260);
      }
      c.set('l0', { o: 0 }); c.set('l1', { o: 0 });
    })();
    await c.anim(300, { sign: { sy: 1.12, sx: 1.08 } });
    await c.anim(300, { sign: { sy: 1, sx: 1 } });
    await drive(c, 160, 1000, [10, -30]);
    await blink;
  },
};

SCENES['giant-haulers'] = {
  w: 1600,
  h: 1000,
  bg: () => `
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <text x="56" y="98" font-size="60" font-weight="900" fill="${LINE}">Giant Haulers</text>
    <text x="58" y="148" font-size="38" font-weight="900" fill="${LINE}" opacity=".7">超大運輸</text>
  `,
  // 先畫後排（上面的車道），再畫前排
  items: [blade, escort, heavyhaul, spmt],
};
}
