// 🚒 消防救援：點車子會唸英文名字，然後像機關書一樣動起來
// 版面 1600×1000；人行道 y ≈ 632～690，後排地面 y = 712，前排地面 y = 975
// 車子和背景是 AI 生成的圖（art/img/rescue/*.webp），做法跟工地那一頁一樣（見 construction.js 開頭的說明）
// 整個檔案包在 { } 裡，車子的變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/rescue/${name}.webp`;
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
// 警示燈的光暈（一開始看不到，閃的時候才亮）
const GLOW = (id, cx, cy, rx, color) =>
  `<g id="${id}" opacity="0"><ellipse cx="${cx}" cy="${cy}" rx="${rx * 1.6}" ry="${rx}" fill="${color}" opacity=".35"/>` +
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx * 0.8}" ry="${rx * 0.5}" fill="#fff" opacity=".8"/></g>`;
// 兩組燈輪流閃 n 次
async function flash(c, a, b, n = 6, ms = 180) {
  for (let i = 0; i < n; i++) {
    c.set(a, { o: 1 }); c.set(b, { o: 0 });
    await c.wait(ms);
    c.set(a, { o: 0 }); c.set(b, { o: 1 });
    await c.wait(ms);
  }
  c.set(a, { o: 0 }); c.set(b, { o: 0 });
}
const WATER = '#6ec3ff';

// ---------- 救援直升機：螺旋槳轉起來，放下救援吊籃再收回來 ----------
// 圖 783×366；主旋翼是側面看的一條線，用左右縮放假裝在轉
const heli = {
  id: 'heli', en: 'Rescue Helicopter', zh: '救援直升機', x: 620, y: 330, s: 0.46, r: -8,
  hint: [430, -230],
  pivots: { rotor: [436, 58], tail: [55, 62], basket: [430, 300] },
  box: [0, -366, 783, 716], // 焦點模式的範圍要包含放下來的吊籃（300 + 190 + 226）
  art(p) {
    return `<g id="${p}-body"><g transform="translate(0 -366)">` +
      `<line id="${p}-rope" x1="430" y1="250" x2="430" y2="300" stroke="#3a3f4a" stroke-width="8"/>` +
      // 吊籃裡的救難員（AI 生成的 rescuer.webp 489×752，頂端的吊環在 (232, 8)），吊環掛在繩子末端 (430, 300)
      `<g id="${p}-basket" opacity="0"><image href="${SRC('rescuer')}" x="${430 - 232 * 0.3}" y="${300 - 8 * 0.3}" width="${489 * 0.3}" height="${752 * 0.3}"/></g>` +
      cut(p, 'helicopter', 783, 366, { rotor: RECT(85, 36, 783, 80), tail: CIRCLE(55, 62, 52) }) +
    '</g></g>';
  },
  async act(c) {
    const T = 6200;
    // 螺旋槳：整段時間一直轉（線性，不要加減速）
    const spin = c.tween(T, (t) => {
      c.set('rotor', { sx: Math.cos(t * 70 * Math.PI) });
      c.set('tail', { r: t * 9000 });
    }, (t) => t);
    const rope = c.el('rope');
    const upd = () => rope.setAttribute('y2', 300 + c.get('basket').ty);
    await c.anim(700, { body: { ty: -60 } });
    c.set('basket', { o: 1 });
    await c.anim(1300, { basket: { ty: 190 } }, upd); // 焦點模式會放大，放太長吊籃會跑出畫面
    for (let i = 0; i < 3; i++) {
      await c.anim(200, { basket: { r: 4 } });
      await c.anim(200, { basket: { r: -4 } });
    }
    await c.anim(1300, { basket: { ty: 0, r: 0 } }, upd);
    c.set('basket', { o: 0 });
    await c.anim(800, { body: { ty: 0 } });
    await spin;
    c.set('rotor', { sx: 1 });
  },
};

// ---------- 救護車：警示燈閃，開出去再倒回來 ----------
// 圖 919×440
const ambulance = {
  id: 'ambulance', en: 'Ambulance', zh: '救護車', x: 430, y: 735, s: 0.4,
  hint: [440, -280],
  art(p) {
    return `<g id="${p}-body"><g transform="translate(0 -440)">` +
      cut(p, 'ambulance', 919, 440, {}, { w1: [167, 370], w2: [767.5, 370] }) +
      GLOW(`${p}-la`, 600, 20, 50, '#ff3b3b') + GLOW(`${p}-lb`, 665, 20, 50, '#ffd23f') +
    '</g></g>';
  },
  async act(c) {
    const lights = flash(c, 'la', 'lb', 9);
    siren('ambulance', 9 * 360);
    await c.anim(1300, { body: { tx: 420 }, ...c.wheels(400) });
    await c.wait(300);
    await c.anim(1300, { body: { tx: 0 }, ...c.wheels(-400) });
    await lights;
  },
};

// ---------- 拖吊車：吊臂舉起來，吊鉤晃一晃 ----------
// 圖 827×439；吊臂轉軸在後面的支架上，吊鉤掛在吊臂尖端，吊臂轉的時候吊鉤反過來轉，才會一直往下垂
const towtruck = {
  id: 'tow', en: 'Tow Truck', zh: '拖吊車', x: 1060, y: 712, s: 0.34,
  hint: [180, -330],
  pivots: { boom: [340, 180], hook: [20, 60] },
  art(p) {
    const boom = PATH([[0, 30], [20, 10], [60, 15], [360, 150], [360, 195], [290, 195], [0, 78]]);
    const hook = RECT(0, 78, 48, 275);
    return '<g transform="translate(0 -439)">' +
      HOLE(`${p}-cb`, 827, 439, boom + hook) + IMG('towtruck', 827, 439, `${p}-cb`) +
      CLIP(`${p}-cm`, boom) + CLIP(`${p}-ck`, hook) +
      `<g id="${p}-boom">${IMG('towtruck', 827, 439, `${p}-cm`)}` +
        `<g id="${p}-hook">${IMG('towtruck', 827, 439, `${p}-ck`)}</g>` +
      '</g>' +
      GLOW(`${p}-la`, 495, 30, 45, '#ffa31a') + GLOW(`${p}-lb`, 535, 30, 45, '#ffd23f') +
    '</g>';
  },
  async act(c) {
    const lights = flash(c, 'la', 'lb', 8);
    await c.anim(900, { boom: { r: 14 }, hook: { r: -14 } });
    for (let i = 0; i < 3; i++) {
      await c.anim(260, { hook: { r: -26 } });
      await c.anim(260, { hook: { r: -2 } });
    }
    await c.anim(900, { boom: { r: 0 }, hook: { r: 0 } });
    await lights;
  },
};

// ---------- 警用機車：前輪抬起來（翹孤輪），往前衝一下再回來 ----------
// 圖 649×528
const motorbike = {
  id: 'moto', en: 'Police Motorcycle', zh: '警用機車', x: 60, y: 990, s: 0.36, r: -6,
  hint: [330, -300],
  pivots: { body: [97, 528] },
  art(p) {
    return `<g id="${p}-body"><g transform="translate(0 -528)">` +
      cut(p, 'motorbike', 649, 528, {}, { w1: [110.5, 441.5], w2: [546.5, 426] }) +
    '</g></g>';
  },
  async act(c) {
    await c.anim(500, { body: { r: -14 }, ...c.wheels(120) });
    await c.anim(900, { body: { tx: 260 }, ...c.wheels(500) });
    await c.anim(350, { body: { r: 0 } });
    await c.wait(250);
    await c.anim(1100, { body: { tx: 0 }, ...c.wheels(-560) });
  },
};

// ---------- 警車：紅藍燈一直閃，警笛「嗚—嗚—嗚—」 ----------
// 圖 885×456
const police = {
  id: 'police', en: 'Police Car', zh: '警車', x: 230, y: 950, s: 0.46, r: -2,
  hint: [450, -250],
  pivots: { body: [440, 456] },
  art(p) {
    return `<g id="${p}-body"><g transform="translate(0 -456)">` + IMG('police', 885, 456) +
      GLOW(`${p}-la`, 505, 20, 60, '#3b8bff') + GLOW(`${p}-lb`, 590, 20, 60, '#ff3b3b') +
    '</g></g>';
  },
  async act(c) {
    const lights = flash(c, 'la', 'lb', 10);
    await c.wait(300); // 等車名唸完
    siren('police', 10 * 360 - 300);
    for (let i = 0; i < 9; i++) {
      await c.anim(150, { body: { sy: 0.97 } });
      await c.anim(150, { body: { sy: 1 } });
    }
    await lights;
  },
};

// ---------- 雲梯消防車：雲梯升起、伸長，梯子頂端的水砲噴水把公寓的火澆熄 ----------
// 圖 896×340；雲梯是圖上方那一條，轉軸在後面；伸長的那一節是同一塊圖，在雲梯裡往前滑
// 真的雲梯車就是這樣：水帶沿著梯子拉上去，從頂端的噴嘴噴水
const FT = { x: 720, y: 975, s: 0.7, h: 340 };
// 場景座標 → 消防車的圖片座標（火在公寓的窗戶上，但要畫在消防車這個零件裡才能一起動）
const ftLocal = (X, Y) => [(X - FT.x) / FT.s, (Y - FT.y) / FT.s + FT.h];
const FLAME = (x, y, k, c1, c2) =>
  `<path d="M${x},${y} c${-34 * k},${-12 * k} ${-28 * k},${-60 * k} 0,${-100 * k} c${28 * k},${40 * k} ${34 * k},${88 * k} 0,${100 * k}Z" fill="${c1}"/>` +
  `<path d="M${x},${y} c${-18 * k},${-8 * k} ${-14 * k},${-34 * k} 0,${-56 * k} c${14 * k},${22 * k} ${18 * k},${48 * k} 0,${56 * k}Z" fill="${c2}"/>`;
// 著火的窗戶（場景座標 1354,437 ～ 1441,484）
const [WX, WY] = ftLocal(1354, 437);
const [WX2, WY2] = ftLocal(1441, 484);
const WFX = (WX + WX2) / 2;
// 公寓的一小塊（場景座標 1300～1500, 385～545，著火的窗戶附近）：直接從背景圖裁下來放進消防車這一組
// 平常跟背景完全重疊看不出來；焦點模式放大時，這塊牆和火會跟著消防車一起出來（裁太大的話消防車就放不大）
const [AX, AY] = ftLocal(1300, 385);
const [AX2, AY2] = ftLocal(1500, 545);
// 雲梯上的水帶（紅色），伸出去那一節的前端有水砲噴嘴，水從噴嘴噴出來
const HOSE = (x0, x1) => `<path d="M${x0},40 H${x1}" stroke="#c62f2a" stroke-width="11" stroke-linecap="round"/><path d="M${x0},37 H${x1}" stroke="#e8564e" stroke-width="4" stroke-linecap="round"/>`;
const NOZZLE = '<path d="M598,26 L646,14 L646,30 L598,46Z" fill="#c9a227"/><path d="M598,36 L646,26 L646,30 L598,46Z" fill="#a8851a"/><rect x="586" y="22" width="16" height="28" rx="4" fill="#5a5f6b"/>';
const firetruck = {
  id: 'fire', en: 'Fire Engine', zh: '消防車', ...FT,
  hint: [300, -315],
  // 焦點模式放大的範圍：消防車＋那一小塊公寓（巢狀 svg 的 getBBox 會算成整張背景，所以自己指定）
  box: [0, AY - 340, Math.max(896, AX2), 340 - AY],
  art(p) {
    const ladder = RECT(0, 0, 615, 50);
    return '<g transform="translate(0 -340)">' +
      // 用巢狀 <svg> 當小視窗（getBBox 只算視窗大小；如果用整張圖加 clip-path，外框會變成整張背景那麼大，焦點模式就放不大）
      `<svg x="${AX}" y="${AY}" width="${AX2 - AX}" height="${AY2 - AY}" viewBox="1300 385 200 160" preserveAspectRatio="none">` +
        `<clipPath id="${p}-cw"><rect x="1300" y="385" width="200" height="160" rx="16"/></clipPath>` +
        `<image href="${SRC('bg')}" width="1600" height="1000" clip-path="url(#${p}-cw)"/></svg>` +
      // 公寓窗戶裡的火（火焰以底部為中心一直在跳）
      `<g id="${p}-flame" data-cx="${WFX}" data-cy="${WY2}">` +
        `<rect x="${WX}" y="${WY}" width="${WX2 - WX}" height="${WY2 - WY}" fill="#ff9a2e"/>` +
        `<g transform="translate(${WFX} ${WY2})"><g>` +
          `${FLAME(-40, 0, 1.1, '#ff5a1f', '#ffd23f')}${FLAME(38, 0, 0.9, '#ff5a1f', '#ffd23f')}${FLAME(0, 0, 1.5, '#ff7a1a', '#ffe66b')}` +
          '<animateTransform attributeName="transform" type="scale" values="1 1;1.04 .9;.97 1.06;1 1" dur=".7s" repeatCount="indefinite"/>' +
        '</g></g>' +
      '</g>' +
      HOLE(`${p}-cb`, 896, 340, ladder) + IMG('firetruck', 896, 340, `${p}-cb`) +
      CLIP(`${p}-cl`, ladder) +
      `<g id="${p}-ladder"><g id="${p}-ext">${IMG('firetruck', 896, 340, `${p}-cl`)}${HOSE(0, 600)}${NOZZLE}</g>` +
        `${IMG('firetruck', 896, 340, `${p}-cl`)}${HOSE(36, 600)}</g>` +
    '</g>';
  },
  pivots: { ladder: [40, 25] },
  async act(c) {
    const s = c.state;
    if (s.out) { // 火已經熄了：先讓火再燒起來
      await c.anim(500, { flame: { o: 1, sy: 1 } });
      s.out = false;
    }
    await c.anim(900, { ladder: { r: -24 } });
    await c.anim(800, { ext: { tx: 300 } });
    const out = (async () => {
      await c.wait(1000);
      await c.anim(1300, { flame: { o: 0, sy: 0.3 } });
    })();
    for (let i = 0; i < 18; i++) {
      c.burst('ext', 646, 22, { n: 5, color: WATER, vx: [4.5, 6.5], vy: [-3.4, -2.2], g: 0.14, size: [5, 10], life: 800 });
      if (i > 10) c.burst('flame', WFX, WY2 - 80, { n: 2, color: '#c8ccd6', vx: [-0.6, 0.6], vy: [-2.4, -1.2], g: -0.02, size: [12, 20], life: 1100 });
      await c.wait(120);
    }
    await out;
    s.out = true;
    await c.anim(700, { ext: { tx: 0 } });
    await c.anim(900, { ladder: { r: 0 } });
  },
};

// ---------- 消防栓：搖一搖，兩邊噴出水來 ----------
// 圖 381×681
const hydrant = {
  id: 'hydrant', en: 'Fire Hydrant', zh: '消防栓', x: 1450, y: 975, s: 0.2,
  hint: [190, -420],
  pivots: { body: [190, 681] },
  art(p) {
    return `<g id="${p}-body"><g transform="translate(0 -681)">${IMG('hydrant', 381, 681)}</g></g>`;
  },
  async act(c) {
    for (let i = 0; i < 3; i++) {
      await c.anim(90, { body: { r: 3 } });
      await c.anim(90, { body: { r: -3 } });
    }
    await c.anim(90, { body: { r: 0 } });
    for (let i = 0; i < 14; i++) {
      c.burst('body', 370, -350, { n: 3, color: WATER, vx: [1.5, 3.5], vy: [-5, -3], g: 0.25, size: [4, 8], life: 800 });
      c.burst('body', 10, -350, { n: 3, color: WATER, vx: [-3.5, -1.5], vy: [-5, -3], g: 0.25, size: [4, 8], life: 800 });
      await c.wait(110);
    }
  },
};

SCENES.rescue = {
  w: 1600,
  h: 1000,
  bg: () => `
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <text x="500" y="98" font-size="60" font-weight="900" fill="${LINE}">Rescue</text>
    <text x="502" y="148" font-size="38" font-weight="900" fill="${LINE}" opacity=".7">消防救援</text>
  `,
  // 先畫後排（天空、人行道），再畫前排
  items: [heli, ambulance, towtruck, motorbike, police, firetruck, hydrant],
};
}
