// 🙆 身體部位：女生（左）和男生（右）站在教室裡，點身體的部位會唸英文名字，然後那個部位動起來
// 版面 1600×1000；背景是幼兒園教室（art/img/body-parts/bg.webp），地板線 y ≈ 960
// 女生 girl.webp 519×748，放在 (180, 960)、縮 1.1；男生 boy.webp 523×915，放在 (880, 960)、縮 0.92
// 跟「我的臉」一樣，每個部位是一個 item，畫在同一張人上，全部 focus: false（在原地動）；
// 人本身畫在 bg 裡（會動的部位先挖掉），item 只畫用 clipPath 從同一張圖切出來的零件
// 切出來的零件比挖掉的洞大一點點，接縫才不會露出白線
// 整個檔案包在 { } 裡，變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/body-parts/${name}.webp`;
const GROUND = 960;
const GIRL = { x: 180, s: 1.1, w: 519, h: 748 };
const BOY = { x: 880, s: 0.92, w: 523, h: 915 };
const IMG = (f, name, clip) => `<image href="${SRC(name)}" width="${f.w}" height="${f.h}"${clip ? ` clip-path="url(#${clip})"` : ''}/>`;
const CLIP = (id, d) => `<clipPath id="${id}"><path d="${d}"/></clipPath>`;
const HOLE = (id, f, d) => `<clipPath id="${id}"><path clip-rule="evenodd" d="M0,0H${f.w}V${f.h}H0Z${d}"/></clipPath>`;
const path = (pts) => `M${pts.map((p) => p.join(',')).join('L')}Z`;
const ell = (cx, cy, rx, ry) => `M${cx - rx},${cy}a${rx},${ry} 0 1,0 ${rx * 2},0a${rx},${ry} 0 1,0 ${-rx * 2},0Z`;
const onBody = (f, inner) => `<g transform="translate(0 ${-f.h})">${inner}</g>`;
const at = (f, x, y) => [x, y - f.h];
const base = (f) => ({ x: f.x, y: GROUND, s: f.s, focus: false, label: [f.w / 2, 30 - f.h] });
const mirror = (f, pts) => pts.map(([x, y]) => [f.w - x, y]);

// ---------- 女生 ----------
// 頭（含馬尾）：繞著脖子歪頭
const G_HEAD = [[0, 0], [519, 0], [519, 238], [392, 238], [332, 278], [188, 278], [128, 238], [0, 238]];
const G_HEAD_HOLE = [[0, 0], [519, 0], [519, 232], [392, 232], [332, 266], [188, 266], [128, 232], [0, 232]];
// 手臂：從袖口到手指，繞著肩膀轉
const G_ARM_L = [[0, 252], [158, 280], [160, 352], [0, 356]];
const G_ARM_L_HOLE = [[0, 252], [152, 280], [154, 352], [0, 356]];
const G_ARM_R = mirror(GIRL, G_ARM_L), G_ARM_R_HOLE = mirror(GIRL, G_ARM_L_HOLE);
// 腳：小腿和鞋子
const G_FOOT_L = [[176, 652], [254, 652], [254, 748], [176, 748]];
const G_FOOT_L_HOLE = [[178, 668], [252, 668], [252, 748], [178, 748]];
const G_FOOT_R = [[268, 652], [348, 652], [348, 748], [268, 748]];
const G_FOOT_R_HOLE = [[270, 668], [346, 668], [346, 748], [270, 748]];

const head = {
  id: 'p-head', en: 'Head', zh: '頭', ...base(GIRL),
  hint: at(GIRL, 258, 60), tag: [464, 125],
  pivots: { h: [258, 268] },
  art: (p) => onBody(GIRL, `<defs>${CLIP(`${p}-c`, path(G_HEAD))}</defs><g id="${p}-h">${IMG(GIRL, 'girl', `${p}-c`)}</g>`),
  async act(c) {
    // 歪頭左、右，再點點頭
    for (const a of [-12, 12, -8, 8]) await c.anim(300, { h: { r: a } });
    await c.anim(250, { h: { r: 0 } });
    for (let i = 0; i < 2; i++) {
      await c.anim(180, { h: { ty: 10 } });
      await c.anim(180, { h: { ty: 0 } });
    }
  },
};

const arms = {
  id: 'p-arms', en: 'Arms', zh: '手臂', ...base(GIRL),
  hint: at(GIRL, 90, 312), tag: [300, 545],
  pivots: { l: [160, 312], r: [359, 312] },
  art: (p) => onBody(GIRL, `
    <defs>${CLIP(`${p}-cl`, path(G_ARM_L))}${CLIP(`${p}-cr`, path(G_ARM_R))}</defs>
    <g id="${p}-l">${IMG(GIRL, 'girl', `${p}-cl`)}</g>
    <g id="${p}-r">${IMG(GIRL, 'girl', `${p}-cr`)}</g>`),
  async act(c) {
    // 像小鳥一樣拍翅膀：左手往上是 r 正、右手往上是 r 負
    speak('Flap flap!', { queue: true });
    for (let i = 0; i < 4; i++) {
      await c.anim(220, { l: { r: 35 }, r: { r: -35 } });
      await c.anim(220, { l: { r: -15 }, r: { r: 15 } });
    }
    await c.anim(250, { l: { r: 0 }, r: { r: 0 } });
  },
};

const tummy = {
  id: 'p-tummy', en: 'Tummy', zh: '肚子', ...base(GIRL),
  hint: at(GIRL, 262, 380), tag: [468, 590],
  pivots: { t: [262, 380] },
  art: (p) => onBody(GIRL, `<defs>${CLIP(`${p}-c`, ell(262, 372, 100, 60))}</defs><g id="${p}-t">${IMG(GIRL, 'girl', `${p}-c`)}</g>`),
  async act(c) {
    // 肚子餓了，咕嚕咕嚕：一直變大一點再縮回來（只變大，原本的肚子才不會露出來）
    speak('Rumble rumble!', { queue: true });
    for (let i = 0; i < 4; i++) {
      await c.anim(160, { t: { sx: 1.1, sy: 1.05, r: i % 2 ? 3 : -3 } });
      await c.anim(160, { t: { sx: 1, sy: 1, r: 0 } });
    }
  },
};

const feet = {
  id: 'p-feet', en: 'Feet', zh: '腳', ...base(GIRL),
  hint: at(GIRL, 215, 720), tag: [466, 990],
  pivots: { l: [215, 748], r: [308, 748] },
  art: (p) => onBody(GIRL, `
    <defs>${CLIP(`${p}-cl`, path(G_FOOT_L))}${CLIP(`${p}-cr`, path(G_FOOT_R))}</defs>
    <g id="${p}-l">${IMG(GIRL, 'girl', `${p}-cl`)}</g>
    <g id="${p}-r">${IMG(GIRL, 'girl', `${p}-cr`)}</g>`),
  async act(c) {
    // 左右腳輪流踏步
    speak('Tap tap!', { queue: true });
    for (let i = 0; i < 4; i++) {
      const k = i % 2 ? 'r' : 'l';
      await c.anim(160, { [k]: { ty: -30, r: k === 'l' ? -6 : 6 } });
      await c.anim(140, { [k]: { ty: 0, r: 0 } });
      c.burst(k, k === 'l' ? 215 : 308, 745, { n: 4, color: '#e8c79a', vx: [-2, 2], vy: [-2, -0.5], g: 0.15, size: [4, 7] });
    }
  },
};

// ---------- 男生 ----------
// 頭髮：只往上、往外動（不挖洞，原本的頭髮留在下面）
const B_HAIR = [[95, 0], [428, 0], [416, 218], [396, 218], [362, 162], [302, 130], [240, 120], [190, 132], [150, 172], [124, 218], [100, 218]];
// 手：從手腕切出來揮手
const B_HAND_L = [[0, 425], [86, 425], [86, 512], [0, 512]];
const B_HAND_L_HOLE = [[0, 425], [80, 425], [80, 512], [0, 512]];
const B_HAND_R = mirror(BOY, B_HAND_L), B_HAND_R_HOLE = mirror(BOY, B_HAND_L_HOLE);
// 腿：短褲下面到鞋子
const B_LEG_L = [[132, 732], [258, 732], [258, 915], [132, 915]];
const B_LEG_L_HOLE = [[134, 752], [256, 752], [256, 915], [134, 915]];
const B_LEG_R = [[266, 732], [392, 732], [392, 915], [266, 915]];
const B_LEG_R_HOLE = [[268, 752], [390, 752], [390, 915], [268, 915]];

const hair = {
  id: 'p-hair', en: 'Hair', zh: '頭髮', ...base(BOY),
  hint: at(BOY, 330, 60), tag: [1119, 108],
  pivots: { h: [260, 218] },
  art: (p) => onBody(BOY, `<defs>${CLIP(`${p}-c`, path(B_HAIR))}</defs><g id="${p}-h">${IMG(BOY, 'boy', `${p}-c`)}</g>`),
  async act(c) {
    // 頭髮被風吹得蓬蓬的，彈幾下
    speak('Boing boing!', { queue: true });
    for (let i = 0; i < 3; i++) {
      await c.anim(170, { h: { sy: 1.14, sx: 1.04, r: i % 2 ? 4 : -4 } });
      await c.anim(170, { h: { sy: 1, sx: 1, r: 0 } });
    }
  },
};

const hands = {
  id: 'p-hands', en: 'Hands', zh: '手', ...base(BOY),
  hint: at(BOY, 40, 465), tag: [1322, 610],
  pivots: { l: [82, 468], r: [441, 468] },
  art: (p) => onBody(BOY, `
    <defs>${CLIP(`${p}-cl`, path(B_HAND_L))}${CLIP(`${p}-cr`, path(B_HAND_R))}</defs>
    <g id="${p}-l">${IMG(BOY, 'boy', `${p}-cl`)}</g>
    <g id="${p}-r">${IMG(BOY, 'boy', `${p}-cr`)}</g>`),
  async act(c) {
    // 兩隻手一起揮手打招呼
    speak('Hello!', { queue: true });
    for (let i = 0; i < 4; i++) {
      await c.anim(170, { l: { r: 25 }, r: { r: -25 } });
      await c.anim(170, { l: { r: -10 }, r: { r: 10 } });
    }
    await c.anim(170, { l: { r: 0 }, r: { r: 0 } });
  },
};

const legs = {
  id: 'p-legs', en: 'Legs', zh: '腿', ...base(BOY),
  hint: at(BOY, 330, 790), tag: [1119, 862],
  pivots: { l: [195, 732], r: [329, 732] },
  art: (p) => onBody(BOY, `
    <defs>${CLIP(`${p}-cl`, path(B_LEG_L))}${CLIP(`${p}-cr`, path(B_LEG_R))}</defs>
    <g id="${p}-l">${IMG(BOY, 'boy', `${p}-cl`)}</g>
    <g id="${p}-r">${IMG(BOY, 'boy', `${p}-cr`)}</g>`),
  async act(c) {
    // 原地踏步走：腿輪流抬高
    speak('Left, right, left, right!', { queue: true });
    for (let i = 0; i < 6; i++) {
      const k = i % 2 ? 'r' : 'l';
      await c.anim(200, { [k]: { ty: -55 } });
      await c.anim(180, { [k]: { ty: 0 } });
    }
  },
};

SCENES['body-parts'] = {
  w: 1600,
  h: 1000,
  bg: () => `
    <defs>
      ${HOLE('bp-gh', GIRL, path(G_HEAD_HOLE) + path(G_ARM_L_HOLE) + path(G_ARM_R_HOLE) + path(G_FOOT_L_HOLE) + path(G_FOOT_R_HOLE))}
      ${HOLE('bp-bh', BOY, path(B_HAND_L_HOLE) + path(B_HAND_R_HOLE) + path(B_LEG_L_HOLE) + path(B_LEG_R_HOLE))}
    </defs>
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <ellipse cx="${GIRL.x + 285}" cy="${GROUND - 4}" rx="190" ry="18" fill="#000" opacity=".08"/>
    <ellipse cx="${BOY.x + 240}" cy="${GROUND - 4}" rx="190" ry="18" fill="#000" opacity=".08"/>
    <g transform="translate(${GIRL.x} ${GROUND - GIRL.h * GIRL.s}) scale(${GIRL.s})">${IMG(GIRL, 'girl', 'bp-gh')}</g>
    <g transform="translate(${BOY.x} ${GROUND - BOY.h * BOY.s}) scale(${BOY.s})">${IMG(BOY, 'boy', 'bp-bh')}</g>
    <text x="800" y="86" text-anchor="middle" font-size="60" font-weight="900" fill="${LINE}">Body Parts</text>
    <text x="800" y="136" text-anchor="middle" font-size="38" font-weight="900" fill="${LINE}" opacity=".7">身體部位</text>
  `,
  items: [head, arms, tummy, feet, hair, hands, legs],
};
}
