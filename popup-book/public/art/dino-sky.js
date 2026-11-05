// 🦅 遠古天空：點翼龍會唸英文名字，然後拍拍翅膀飛起來
// 版面 1600×1000；左邊是大樹（樹枝在 x 30～360、y 50～330），中間的懸崖頂在 x 460～600、y ≈ 375，海平面 y ≈ 605，沙灘在 y > 720
// 動物是 AI 生成的圖（art/img/dino-sky/*.webp），在洋紅色背景上生圖（picks 用 {"key": "magenta"}）
// 會飛的翼龍是側面、翅膀往上舉的姿勢：翅膀沿著「肩膀那一條水平線」裁出來（零件 wing），
// 拍翅膀就是把 wing 的 sy 從 1 壓到負的（翅膀翻到下面），水平線上的點不會動，接縫看不出來
// 飛來飛去的動物用 focus: false，在原本的畫面裡飛，才看得到牠飛過天空、俯衝到海裡
// 整個檔案包在 { } 裡，變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/dino-sky/${name}.webp`;
const IMG = (name, w, h, clip) =>
  `<image href="${SRC(name)}" width="${w}" height="${h}"${clip ? ` clip-path="url(#${clip})"` : ''}/>`;
const PATH = (pts) => 'M' + pts.map((p) => p.join(',')).join('L') + 'Z';
const RECT = (x0, y0, x1, y1) => PATH([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]);
const CLIP = (id, d) => `<clipPath id="${id}"><path d="${d}"/></clipPath>`;
const HOLE = (id, w, h, d) => `<clipPath id="${id}"><path clip-rule="evenodd" d="M0,0H${w}V${h}H0Z${d}"/></clipPath>`;
const WATER = '#bfe9ff', SAND = '#e6c27a';

// 整張圖放在零件 body 裡；inner 不給就是整張圖
const whole = (p, name, w, h, inner) =>
  `<g transform="translate(0 ${-h})"><g id="${p}-body">${inner ?? IMG(name, w, h)}</g></g>`;
// 身體挖掉翅膀，翅膀另外裁出來放在零件 wing（畫在身體上面）
const winged = (p, name, w, h, wing, extra = '') => whole(p, name, w, h,
  HOLE(`${p}-cb`, w, h, wing) + IMG(name, w, h, `${p}-cb`) + extra +
  CLIP(`${p}-cw`, wing) + `<g id="${p}-wing">${IMG(name, w, h, `${p}-cw`)}</g>`);
// 拍一下翅膀的角度：t 從 0 到 1，翅膀 1 → -0.6 → 1
const flapAt = (t, n) => 0.2 + 0.8 * Math.cos(t * Math.PI * 2 * n);
async function flap(c, n = 2, ms = 450) {
  await c.anim(ms * n, {}, (t) => c.set('wing', { sy: flapAt(t, n) }));
  c.set('wing', { sy: 1 });
}
// 從嘴巴往右擴散的聲波（零件 w0～w2），中心 (x, y)
const waves = (p, x, y, color = '#ffffff') => [0, 1, 2].map((i) =>
  `<g id="${p}-w${i}" opacity="0" data-cx="${x}" data-cy="${y}">` +
  `<path d="M${x + 30},${y - 34} A44,44 0 0 1 ${x + 30},${y + 34}" fill="none" stroke="${color}" stroke-width="10" stroke-linecap="round"/></g>`).join('');
async function shout(c, n = 3) {
  for (let i = 0; i < n; i++) {
    const w = `w${i % 3}`;
    c.set(w, { o: 1, sx: 0.6, sy: 0.6 });
    c.anim(700, { [w]: { o: 0, sx: 2.4, sy: 2.4 } });
    await c.wait(260);
  }
}

// ---------- 無齒翼龍：拍拍翅膀，在天空繞一大圈再飛回來 ----------
// 圖 723×519（臉朝右）；翅膀在肩膀線 y = 315 以上（x < 430，頭冠在 x 440 以右不會被裁到），掛在 (360, 315)
const pteranodon = {
  id: 'pteranodon', en: 'Pteranodon', zh: '無齒翼龍', x: 640, y: 390, s: 0.5,
  hint: [480, -280], focus: false,
  pivots: { body: [360, 400], wing: [360, 315] },
  art: (p) => winged(p, 'pteranodon', 723, 519, RECT(0, 0, 430, 315)),
  async act(c) {
    await flap(c, 2);
    // 繞一個橫的 8 字：往右上飛、繞回左下，再回到原位；往回飛的時候轉身
    await c.anim(4200, {}, (t) => {
      const a = t * Math.PI * 2;
      c.set('body', {
        tx: 900 * Math.sin(a),
        ty: -260 * Math.sin(2 * a),
        sx: Math.cos(a) >= 0 ? 1 : -1,
        r: -8 * Math.cos(2 * a),
      });
      c.set('wing', { sy: flapAt(t, 9) });
    }, (t) => t);
    c.set('body', { tx: 0, ty: 0, sx: 1, r: 0 });
    c.set('wing', { sy: 1 });
  },
};

// ---------- 風神翼龍：最大的翼龍，慢慢拍著大翅膀滑翔過去，再飛回來 ----------
// 圖 794×572（臉朝右）；前面那片往上舉的翅膀裁出來（避開脖子），掛在 (470, 350)；後面那片平的翅膀不動
const QUE_WING = PATH([[420, 0], [794, 0], [794, 220], [640, 260], [600, 280], [570, 320], [560, 350], [430, 350], [415, 300]]);
const quetzalcoatlus = {
  id: 'quetzalcoatlus', en: 'Quetzalcoatlus', zh: '風神翼龍', x: 1010, y: 470, s: 0.6,
  hint: [380, -300], focus: false,
  pivots: { body: [400, 400], wing: [470, 350] },
  art: (p) => winged(p, 'quetzalcoatlus', 794, 572, QUE_WING),
  async act(c) {
    await flap(c, 2, 700);
    const glide = (dir) => (t) => {
      c.set('body', { ty: -60 * Math.sin(t * Math.PI), r: dir * 4 * Math.sin(t * Math.PI * 2) });
      c.set('wing', { sy: t < 0.35 ? flapAt(t / 0.35, 2) : 0.75 });
    };
    await c.anim(2400, { body: { tx: -700 } }, (t) => { c.set('body', { sx: -1 }); glide(-1)(t); });
    await c.anim(2400, { body: { tx: 0 } }, (t) => { c.set('body', { sx: 1 }); glide(1)(t); });
    c.set('body', { ty: 0, r: 0 });
    await flap(c, 1, 700);
  },
};

// ---------- 喙嘴翼龍：俯衝到海裡「Splash!」，叼起一條魚飛回來 ----------
// 圖 684×476（臉朝右）；兩片翅膀都在肩膀線 y = 262 以上，掛在 (330, 262)；嘴巴尖在 (680, 165)
// 魚是 SVG（零件 fish），平常藏起來，叼起來才出現在嘴巴前面
const RHA_WING = PATH([[100, 0], [440, 0], [440, 160], [400, 235], [330, 262], [100, 262]]);
const rhamphorhynchus = {
  id: 'rhamphorhynchus', en: 'Rhamphorhynchus', zh: '喙嘴翼龍', x: 760, y: 560, s: 0.3,
  hint: [400, -300], focus: false,
  pivots: { body: [400, 300], wing: [330, 262] },
  art(p) {
    const fish = `<g id="${p}-fish" opacity="0" transform="translate(0 0)">` +
      '<path d="M650,180 q60,-40 120,0 q-60,40 -120,0Z" fill="#7fc8e8"/><path d="M652,180 l-40,-28 v56Z" fill="#5aa8cc"/>' +
      '<circle cx="745" cy="174" r="7" fill="#234"/></g>';
    return winged(p, 'rhamphorhynchus', 684, 476, RHA_WING, fish);
  },
  async act(c) {
    await flap(c, 2, 350);
    // 往下俯衝到海面（海平面在畫面 y ≈ 640，牠的腳在 y 560，差 80 ÷ 0.3 ≈ 270）
    c.set('wing', { sy: 0.4 });
    await c.anim(600, { body: { tx: 200, ty: 330, r: 30 } }, null, (t) => t * t);
    speak('Splash!', { queue: true });
    c.burst('body', 650, 200, { n: 20, color: WATER, vx: [-4, 4], vy: [-7, -2], g: 0.3, size: [7, 14], life: 1000 });
    c.set('fish', { o: 1 });
    await c.anim(700, { body: { tx: 300, ty: 0, r: -10 } }, (t) => c.set('wing', { sy: flapAt(t, 3) }));
    await c.anim(1300, { body: { tx: 0, r: 0 } }, (t) => {
      c.set('body', { sx: t < 0.95 ? -1 : 1 });
      c.set('wing', { sy: flapAt(t, 5) });
    });
    c.set('body', { sx: 1 });
    c.set('wing', { sy: 1 });
    await c.wait(500);
    await c.anim(300, { fish: { o: 0 } });
  },
};

// ---------- 古神翼龍：抬起頭秀出又大又紅的頭冠，拍拍翅膀上下飛 ----------
// 圖 617×363（臉朝右）；翅膀在肩膀線 y = 215 以上（x < 425，頭冠在右邊不會被裁到），掛在 (320, 215)
const TAP_WING = PATH([[40, 0], [425, 0], [425, 170], [380, 215], [40, 215]]);
const tapejara = {
  id: 'tapejara', en: 'Tapejara', zh: '古神翼龍', x: 1170, y: 660, s: 0.4,
  hint: [300, -200],
  pivots: { body: [400, 200], wing: [320, 215] },
  art: (p) => winged(p, 'tapejara', 617, 363, TAP_WING),
  async act(c) {
    await c.anim(400, { body: { r: -10, sx: 1.08, sy: 1.08 } });
    await c.wait(500);
    await c.anim(300, { body: { r: 0, sx: 1, sy: 1 } });
    await c.anim(1800, {}, (t) => {
      c.set('body', { ty: -80 * Math.sin(t * Math.PI * 2) });
      c.set('wing', { sy: flapAt(t, 4) });
    }, (t) => t);
    c.set('body', { ty: 0 });
    c.set('wing', { sy: 1 });
  },
};

// ---------- 雙型齒翼龍：站在沙灘上「Squawk!」大叫，點點頭再跳兩下 ----------
// 圖 662×602（臉朝右），嘴巴在 (650, 75)，腳在 (300, 600)
const dimorphodon = {
  id: 'dimorphodon', en: 'Dimorphodon', zh: '雙型齒翼龍', x: 1150, y: 965, s: 0.3,
  hint: [380, -330],
  pivots: { body: [300, 602] },
  art: (p) => whole(p, 'dimorphodon', 662, 602, IMG('dimorphodon', 662, 602) + waves(p, 650, 75, '#fff6c0')),
  async act(c) {
    await c.anim(300, { body: { r: -8 } });
    speak('Squawk!', { queue: true });
    await shout(c, 4);
    await c.anim(300, { body: { r: 0 } });
    for (let i = 0; i < 2; i++) {
      await c.anim(150, { body: { r: 10 } });
      await c.anim(150, { body: { r: 0 } });
    }
    for (let i = 0; i < 2; i++) {
      await c.anim(250, { body: { ty: -90 } }, null, (t) => 1 - (1 - t) ** 2);
      await c.anim(200, { body: { ty: 0 } }, null, (t) => t * t);
      c.burst('body', 300, 598, { n: 8, color: SAND, vx: [-3, 3], vy: [-3, -0.5], g: 0.12, size: [6, 11] });
    }
  },
};

// ---------- 始祖鳥：站在懸崖頂上，拍拍翅膀跳起來，飛一小圈再回來 ----------
// 圖 675×573（臉朝右），腳在 (220, 565)；翅膀跟身體疊在一起，拍翅膀用身體上下抖來表現
const archaeopteryx = {
  id: 'archaeopteryx', en: 'Archaeopteryx', zh: '始祖鳥', x: 470, y: 380, s: 0.2,
  hint: [380, -330], focus: false,
  pivots: { body: [220, 573] },
  art: (p) => whole(p, 'archaeopteryx', 675, 573),
  async act(c) {
    for (let i = 0; i < 3; i++) {
      await c.anim(120, { body: { sy: 0.9 } });
      await c.anim(120, { body: { sy: 1 } });
    }
    await c.anim(3000, {}, (t) => {
      const a = t * Math.PI * 2;
      c.set('body', {
        tx: 700 * Math.sin(a),
        ty: -500 * Math.sin(a / 2) + 25 * Math.sin(t * Math.PI * 30),
        sx: Math.cos(a) >= 0 ? 1 : -1,
        r: -10 * Math.cos(a),
      });
    }, (t) => t);
    c.set('body', { tx: 0, ty: 0, sx: 1, r: 0 });
    await c.anim(150, { body: { sy: 0.9 } });
    await c.anim(150, { body: { sy: 1 } });
  },
};

// ---------- 小盜龍：四片翅膀張開，從大樹上滑翔下來，再拍拍翅膀飛回樹上 ----------
// 圖 854×585（臉朝右）；手上的翅膀裁出來（避開脖子），掛在 (440, 262)
const MIC_WING = PATH([[30, 0], [620, 0], [620, 225], [560, 262], [300, 262], [30, 250]]);
const microraptor = {
  id: 'microraptor', en: 'Microraptor', zh: '小盜龍', x: 210, y: 330, s: 0.25,
  hint: [420, -300], focus: false,
  pivots: { body: [420, 300], wing: [440, 262] },
  art: (p) => winged(p, 'microraptor', 854, 585, MIC_WING),
  async act(c) {
    await flap(c, 2, 300);
    // 滑翔：斜斜地往右下飄到沙灘上空
    await c.anim(1800, { body: { tx: 1400, ty: 1500, r: 18 } }, (t) => c.set('wing', { sy: 0.9 + 0.1 * Math.sin(t * Math.PI * 6) }));
    await c.anim(300, { body: { r: -15 } });
    // 拍翅膀飛回樹上
    c.set('body', { sx: -1 });
    await c.anim(1800, { body: { tx: 0, ty: 0 } }, (t) => c.set('wing', { sy: flapAt(t, 8) }));
    c.set('body', { sx: 1 });
    await c.anim(300, { body: { r: 0 } });
    c.set('wing', { sy: 1 });
  },
};

SCENES['dino-sky'] = {
  w: 1600,
  h: 1000,
  bg: () => `
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <text x="440" y="110" font-size="60" font-weight="900" fill="${LINE}">Prehistoric Sky</text>
    <text x="442" y="160" font-size="38" font-weight="900" fill="${LINE}" opacity=".7">遠古天空</text>
  `,
  // 先畫後排（遠的），再畫前排
  items: [quetzalcoatlus, pteranodon, archaeopteryx, rhamphorhynchus, tapejara, microraptor, dimorphodon],
};
}
