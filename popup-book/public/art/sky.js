// ✈️ 天空：點飛機會唸英文名字，然後像機關書一樣動起來
// 版面 1600×1000；遠山後面是天空，跑道在 y 612～755（中間的白色虛線在 y ≈ 683），跑道前面是草地
// 飛機是 AI 生成的圖（art/img/sky/*.webp），做法跟工地那一頁一樣（見 construction.js 開頭的說明）
// 在天上飛的東西沒有地面：y 是它在場景裡的下緣
// 整個檔案包在 { } 裡，變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/sky/${name}.webp`;
const IMG = (name, w, h) => `<image href="${SRC(name)}" width="${w}" height="${h}"/>`;
const SMOKE = '#ffffff';
const accel = (t) => t * t, decel = (t) => 1 - (1 - t) ** 2;

// 整張圖放在零件 body 裡（圖片座標，左上角是 (0, 0)）
const whole = (p, name, w, h, extra = '', front = '') =>
  `<g transform="translate(0 ${-h})"><g id="${p}-body">${extra}${IMG(name, w, h)}${front}</g></g>`;
// 要往右移多遠才會整個飛出畫面、從左邊多遠的地方飛進來（依 body 現在在場景裡的位置和放大倍率算，焦點模式會放大）
function offscreen(c, w) {
  const m = document.getElementById('root').getCTM().inverse().multiply(c.el('body').getCTM());
  return [(SCENES.sky.w - m.e) / m.a + 60, -m.e / m.a - w - 60];
}
// 轉動中的螺旋槳：一片半透明的白色橢圓，快速閃動
const blur = (p, cx, cy, rx, ry) =>
  `<g id="${p}-prop" opacity="0"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#ffffff" opacity=".55"/></g>`;
async function spin(c, ms) {
  c.set('prop', { o: 1 });
  for (let t = 0; t < ms; t += 120) {
    await c.anim(60, { prop: { sy: 0.75 } });
    await c.anim(60, { prop: { sy: 1 } });
  }
  c.set('prop', { o: 0 });
}

// ---------- 客機：在跑道上加速，抬頭起飛飛出畫面右邊，再從左邊飛回來降落 ----------
// 圖 894×316（機頭在右），主輪在 (480, 308)，起飛時繞主輪抬頭
const airliner = {
  id: 'airliner', en: 'Airplane', zh: '客機', x: 380, y: 703, s: 0.75,
  hint: [560, -150],
  pivots: { body: [480, 308] },
  art: (p) => whole(p, 'airliner', 894, 316),
  async act(c) {
    const [right, left] = offscreen(c, 894);
    speak('Whoosh!', { queue: true });
    await c.anim(1100, { body: { tx: 220 } }, null, accel);
    await c.anim(400, { body: { tx: 330, r: -10 } });
    await c.anim(1000, { body: { tx: right, ty: -260, r: -12 } }, null, accel);
    // 從左邊高高的地方飛回來，慢慢降低高度
    c.set('body', { tx: left, ty: -220, r: 4 });
    await c.wait(300);
    await c.anim(1600, { body: { tx: -60, ty: 0, r: -3 } }, null, decel);
    c.burst('body', 480, 308, { n: 10, color: '#c8ccd2', vx: [-2, 0], vy: [-1.5, -0.3], g: 0, size: [6, 12] });
    await c.anim(300, { body: { r: 0 } });
    await c.anim(900, { body: { tx: 0 } });
  },
};

// ---------- 熱氣球：火焰呼呼噴出來，慢慢升高、左右晃，再降下來 ----------
// 圖 512×655，燃燒器在 (290, 548)，火焰往上噴進氣球裡
const balloon = {
  id: 'balloon', en: 'Hot Air Balloon', zh: '熱氣球', x: 1000, y: 525, s: 0.48,
  hint: [256, -400],
  pivots: { body: [256, 0], flame: [290, 548] },
  box: [0, -655 - 220, 512, 655 + 220], // 焦點模式把升高的高度也算進去
  art(p) {
    const flame = `<g id="${p}-flame" opacity="0">` +
      '<path d="M290,552 C250,520 262,480 290,420 C318,480 330,520 290,552Z" fill="#ff7a1a"/>' +
      '<path d="M290,550 C268,526 274,500 290,462 C306,500 312,526 290,550Z" fill="#ffe14a"/></g>';
    return whole(p, 'balloon', 512, 655, '', flame);
  },
  async act(c) {
    const fire = async (n) => {
      c.set('flame', { o: 1 });
      for (let i = 0; i < n; i++) {
        await c.anim(90, { flame: { sy: 1.25 } });
        await c.anim(90, { flame: { sy: 0.85 } });
      }
      c.set('flame', { o: 0, sy: 1 });
    };
    await fire(5);
    const up = c.anim(2200, { body: { ty: -220 } });
    await fire(8);
    await up;
    for (let i = 0; i < 2; i++) {
      await c.anim(500, { body: { r: 3 } });
      await c.anim(500, { body: { r: -3 } });
    }
    await c.anim(400, { body: { r: 0 } });
    await c.anim(2200, { body: { ty: 0 } });
  },
};

// ---------- 雙翼機：螺旋槳轉起來，翻一個大筋斗，後面拉出一圈白煙 ----------
// 圖 761×401（翻轉過，機頭在右），螺旋槳在 (640, 140)，機尾在 (20, 250)
// 翻筋斗：整架飛機繞著上方 LOOP_R 的一點轉 -360 度（逆時針：先往右、往上，再從上面倒著飛回來）
const LOOP_R = 260;
const biplane = {
  id: 'biplane', en: 'Biplane', zh: '雙翼機', x: 60, y: 525, s: 0.38,
  hint: [430, -270],
  pivots: { body: [380, 200 - LOOP_R], prop: [640, 140] },
  box: [0, -401 - 2 * LOOP_R, 761, 401 + 2 * LOOP_R], // 焦點模式把整個筋斗都算進去
  art: (p) => whole(p, 'biplane', 761, 401, '', blur(p, 640, 140, 16, 118)),
  async act(c) {
    const prop = spin(c, 4000);
    await c.wait(500);
    const smoke = setInterval(() => c.burst('body', 20, 250, { n: 3, color: SMOKE, vx: [-0.4, 0.4], vy: [-0.4, 0.4], g: 0, size: [10, 16], life: 1800 }), 30);
    await c.anim(2800, { body: { r: -360 } });
    clearInterval(smoke);
    c.set('body', { r: 0 });
    await prop;
  },
};

// ---------- 飛船：螺旋槳轉起來，慢慢往前飄，上下晃一晃再飄回來 ----------
// 圖 782×294（機頭在右），吊艙後面的小螺旋槳在 (305, 262)
const airship = {
  id: 'airship', en: 'Airship', zh: '飛船', x: 520, y: 335, s: 0.55,
  hint: [480, -170],
  pivots: { prop: [305, 262] },
  art: (p) => whole(p, 'airship', 782, 294, '', blur(p, 305, 262, 6, 30)),
  async act(c) {
    const prop = spin(c, 5200);
    await c.anim(2400, { body: { tx: 180 } }, (t) => c.set('body', { ty: -12 * Math.sin(t * Math.PI * 2) }));
    await c.anim(2400, { body: { tx: 0 } }, (t) => c.set('body', { ty: 12 * Math.sin(t * Math.PI * 2) }));
    await prop;
  },
};

// ---------- 滑翔機：沒有引擎，安安靜靜地乘著風一高一低滑過去再滑回來 ----------
// 圖 841×344（機頭在右）
const glider = {
  id: 'glider', en: 'Glider', zh: '滑翔機', x: 1180, y: 255, s: 0.38,
  hint: [480, -180],
  pivots: { body: [420, 170] },
  art: (p) => whole(p, 'glider', 841, 344),
  async act(c) {
    const wave = (dir) => (t) => {
      const k = Math.sin(t * Math.PI * 3);
      c.set('body', { ty: -50 * k, r: dir * 6 * Math.cos(t * Math.PI * 3) });
    };
    await c.anim(2600, { body: { tx: -320 } }, wave(1));
    await c.anim(2600, { body: { tx: 0 } }, wave(-1));
    await c.anim(300, { body: { r: 0, ty: 0 } });
  },
};

// ---------- 噴射機：「Whoosh!」拉出紅白藍三色彩煙衝出畫面，再從左邊翻滾著飛回來 ----------
// 圖 662×258（機頭在右），噴嘴在 (45, 132)
const COLORS = ['#ff4a4a', '#ffffff', '#3a7bff'];
const jet = {
  id: 'jet', en: 'Jet Plane', zh: '噴射機', x: 120, y: 305, s: 0.45,
  hint: [380, -140],
  pivots: { body: [330, 130] },
  art: (p) => whole(p, 'jet', 662, 258),
  async act(c) {
    const [right, left] = offscreen(c, 662);
    speak('Whoosh!', { queue: true });
    const trail = () => COLORS.forEach((color, i) =>
      c.burst('body', 45, 112 + i * 20, { n: 2, color, vx: [-2, 0], vy: [-0.2, 0.2], g: 0, size: [11, 15], life: 1300 }));
    let smoke = setInterval(trail, 25);
    await c.anim(1000, { body: { tx: right, r: -6 } }, null, accel);
    clearInterval(smoke);
    c.set('body', { tx: left, r: 0 });
    await c.wait(400);
    smoke = setInterval(trail, 25);
    // 翻滾：上下縮放 1 → -1 → 1，看起來像整架飛機沿著機身轉了一圈
    await c.anim(1300, { body: { tx: 0 } }, (t) => c.set('body', { sy: Math.cos(t * Math.PI * 2) }), decel);
    clearInterval(smoke);
    c.set('body', { sy: 1 });
  },
};

// ---------- 直升機：主旋翼越轉越快，直直地升起來，往前歪著飛一小段，再降落、旋翼慢慢停下來 ----------
// 圖 704×392（翻轉過，機頭在右）；主旋翼在 y 0～28、中心 (362, 14)，從側面看轉起來就是左右一伸一縮
// 尾旋翼在 (45, 195)，跟尾翼黏在一起裁不乾淨：圖不動，轉的時候在上面蓋一片半透明的圓盤
const HELI_UP = 320;
const helicopter = {
  id: 'helicopter', en: 'Helicopter', zh: '直升機', x: 110, y: 965, s: 0.55,
  hint: [380, -190],
  pivots: { body: [362, 392], rotor: [362, 14], tail: [45, 195] },
  box: [0, -392 - HELI_UP, 704, 392 + HELI_UP], // 焦點模式把升高的高度也算進去
  art(p) {
    const ROTOR = 'M25,0H704V28H25Z';
    return `<g transform="translate(0 -392)"><g id="${p}-body">` +
      `<clipPath id="${p}-cb"><path clip-rule="evenodd" d="M0,0H704V392H0Z${ROTOR}"/></clipPath>` +
      `<clipPath id="${p}-cr"><path d="${ROTOR}"/></clipPath>` +
      `<image href="${SRC('helicopter')}" width="704" height="392" clip-path="url(#${p}-cb)"/>` +
      `<g id="${p}-tail" opacity="0"><circle cx="45" cy="195" r="50" fill="#ffffff" opacity=".5"/><circle cx="45" cy="195" r="12" fill="#5b6b7a"/></g>` +
      `<g id="${p}-rotor"><image href="${SRC('helicopter')}" width="704" height="392" clip-path="url(#${p}-cr)"/></g>` +
    '</g></g>';
  },
  async act(c) {
    // 旋翼的角度一直累加：轉速 speed(t) 決定每一格加多少
    let a = 0;
    const turn = (speed) => (t) => {
      a += speed(t);
      c.set('rotor', { sx: Math.cos(a) });
      c.set('tail', { o: speed(t) > 0.15 ? 1 : 0, sx: 0.8 + 0.2 * Math.cos(a * 2) });
    };
    await c.anim(1200, {}, turn((t) => 0.1 + 0.5 * t)); // 越轉越快
    c.burst('body', 362, 390, { n: 14, color: '#8cc63f', vx: [-3, 3], vy: [-1.5, -0.3], g: 0.05, size: [5, 10] });
    await c.anim(1500, { body: { ty: -HELI_UP } }, turn(() => 0.6));
    await c.anim(900, { body: { tx: 160, r: 6 } }, turn(() => 0.6));
    await c.anim(400, { body: { r: 0 } }, turn(() => 0.6));
    await c.anim(1100, { body: { tx: 0, r: -4 } }, turn(() => 0.6));
    await c.anim(300, { body: { r: 0 } }, turn(() => 0.6));
    await c.anim(1500, { body: { ty: 0 } }, turn(() => 0.6));
    c.burst('body', 362, 390, { n: 10, color: '#8cc63f', vx: [-3, 3], vy: [-1.2, -0.3], g: 0.05, size: [5, 10] });
    await c.anim(1200, {}, turn((t) => 0.6 * (1 - t))); // 慢慢停下來
    await c.anim(200, { rotor: { sx: 1 }, tail: { o: 0 } });
  },
};

// ---------- 塔台：屋頂的紅燈一閃一閃，塔台說「Ready for takeoff!」 ----------
// 圖 483×648（不是飛機），屋頂的紅色燈球在 (228, 10)
const tower = {
  id: 'tower', en: 'Control Tower', zh: '塔台', x: 1290, y: 930, s: 0.6,
  hint: [290, -480],
  art(p) {
    const glow = `<g id="${p}-glow" opacity="0"><circle cx="228" cy="10" r="34" fill="#ff5a4a" opacity=".45"/><circle cx="228" cy="10" r="16" fill="#ffd0c8"/></g>`;
    return whole(p, 'tower', 483, 648, '', glow);
  },
  async act(c) {
    speak('Ready for takeoff!', { queue: true });
    for (let i = 0; i < 5; i++) {
      await c.anim(250, { glow: { o: 1 } });
      await c.anim(350, { glow: { o: 0 } });
    }
  },
};

SCENES.sky = {
  w: 1600,
  h: 1000,
  bg: () => `
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <text x="56" y="98" font-size="60" font-weight="900" fill="${LINE}">Sky</text>
    <text x="58" y="148" font-size="38" font-weight="900" fill="${LINE}" opacity=".7">天空</text>
  `,
  // 先畫後排（遠的），再畫前排
  items: [glider, airship, balloon, jet, biplane, airliner, helicopter, tower],
};
}
