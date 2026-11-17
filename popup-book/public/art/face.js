// 😊 我的臉：女生（左）和男生（右）的大臉，點五官會唸英文名字，然後動起來
// 版面 1600×1000；背景是粉紅色的浴室牆（art/img/face/bg.webp），兩張臉是 AI 生成的圖，肩膀貼著下緣
// 女生 girl.webp 801×827，放在 (30, 1000)、縮 0.95；男生 boy.webp 625×989，放在 (960, 1000)、縮 0.8
// 每個五官是一個 item，都畫在同一張臉上，所以全部 focus: false（在原地動，不放大）；
// 臉本身畫在 bg 裡，item 只畫會動的零件（用 clipPath 從同一張圖切出來）和 SVG 補的東西（眼皮、張開的嘴巴）
// 零件座標都是圖上的像素；看不到的零件下面墊一塊透明的點擊範圍（HIT）
// 整個檔案包在 { } 裡，變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/face/${name}.webp`;
const GIRL = { x: 30, s: 0.95, w: 801, h: 827, skin: '#fed0b6' };
const BOY = { x: 960, s: 0.8, w: 625, h: 989, skin: '#f8c6a3' };
const IMG = (f, name, clip) => `<image href="${SRC(name)}" width="${f.w}" height="${f.h}"${clip ? ` clip-path="url(#${clip})"` : ''}/>`;
const CLIP = (id, d) => `<clipPath id="${id}"><path d="${d}"/></clipPath>`;
const HOLE = (id, f, d) => `<clipPath id="${id}"><path clip-rule="evenodd" d="M0,0H${f.w}V${f.h}H0Z${d}"/></clipPath>`;
const HIT = (d) => `<path d="${d}" fill="#000" fill-opacity="0"/>`;
const ell = (cx, cy, rx, ry) => `M${cx - rx},${cy}a${rx},${ry} 0 1,0 ${rx * 2},0a${rx},${ry} 0 1,0 ${-rx * 2},0Z`;
// 圖的座標（左上角 = 0）轉成 item 的座標（肩膀下緣 = 0）
const onFace = (f, inner) => `<g transform="translate(0 ${-f.h})">${inner}</g>`;
const at = (f, x, y) => [x, y - f.h];
// item 的共同設定：位置、縮放、在原地動
// 名牌放在頭頂上，才不會蓋住五官
const base = (f) => ({ x: f.x, y: 1000, s: f.s, focus: false, label: [f.w / 2, 40 - f.h] });

// ---------- 女生 ----------
// 兩邊的馬尾：整條馬尾（含紅色髮圈）切出來繞著髮圈轉；臉上只挖掉離頭比較遠、垂下來的那一段，
// 靠近頭的那一段臉上也留著，馬尾甩開時才不會露出縫
const mirrorG = (pts) => pts.map(([x, y]) => [814 - x, y]);
const path = (pts) => `M${pts.map((p) => p.join(',')).join('L')}Z`;
const TAIL_L = [[0, 610], [0, 230], [60, 140], [130, 60], [170, 8], [262, 0], [266, 110], [205, 122], [150, 192], [126, 300], [120, 360], [110, 440], [162, 468], [162, 518], [140, 570], [60, 610]];
const TAIL_L_OUT = [[0, 610], [0, 230], [60, 140], [104, 110], [112, 200], [96, 300], [100, 445], [155, 472], [155, 520], [134, 568], [55, 610]];
const TAIL_R = mirrorG(TAIL_L), TAIL_R_OUT = mirrorG(TAIL_L_OUT);
// 眼睛：中心、眼皮（膚色橢圓，從上面往下蓋）
const G_EYES = [[288, 410], [510, 410]];

const hair = {
  id: 'g-hair', en: 'Hair', zh: '頭髮', ...base(GIRL),
  hint: at(GIRL, 60, 380), tag: [95, 735],
  pivots: { tl: [215, 90], tr: [599, 90] },
  art: (p) => onFace(GIRL, `
    <defs>${CLIP(`${p}-cl`, path(TAIL_L))}${CLIP(`${p}-cr`, path(TAIL_R))}</defs>
    <g id="${p}-tl">${IMG(GIRL, 'girl', `${p}-cl`)}</g>
    <g id="${p}-tr">${IMG(GIRL, 'girl', `${p}-cr`)}</g>`),
  async act(c) {
    speak('Swish swish!', { queue: true });
    // 搖頭甩馬尾：兩邊一起往同一邊甩，越甩越小
    for (const a of [16, -16, 12, -12, 7, -7]) await c.anim(230, { tl: { r: a }, tr: { r: a } });
    await c.anim(250, { tl: { r: 0 }, tr: { r: 0 } });
    // 馬尾彈一彈
    await c.anim(180, { tl: { sy: 0.9 }, tr: { sy: 0.9 } });
    await c.anim(220, { tl: { sy: 1 }, tr: { sy: 1 } });
  },
};

const eyes = {
  id: 'g-eyes', en: 'Eyes', zh: '眼睛', ...base(GIRL),
  hint: at(GIRL, 288, 410), tag: [410, 610],
  pivots: { ll: [288, 356], lr: [510, 356], cl: [288, 425], cr: [510, 425] },
  art: (p) => onFace(GIRL, `
    ${HIT(ell(288, 410, 70, 55) + ell(510, 410, 70, 55))}
    ${G_EYES.map(([x, y], i) => `
      <ellipse id="${p}-${i ? 'lr' : 'll'}" cx="${x}" cy="${y}" rx="68" ry="54" fill="${GIRL.skin}" opacity="0"/>
      <g id="${p}-${i ? 'cr' : 'cl'}" opacity="0" fill="none" stroke="#3b2622" stroke-width="8" stroke-linecap="round">
        <path d="M${x - 62},${y + 6} Q${x},${y + 38} ${x + 62},${y + 6}"/>
        <path d="M${x + (i ? 50 : -50)},${y + 14} l${i ? 16 : -16},-12"/>
      </g>`).join('')}`),
  async act(c) {
    speak('Blink blink!', { queue: true });
    const lid = async (names, close) => {
      const spec = {}, line = {};
      names.forEach((n) => { spec[`l${n}`] = { sy: close ? 1 : 0.05 }; line[`c${n}`] = { o: close ? 1 : 0 }; });
      if (close) names.forEach((n) => c.set(`l${n}`, { o: 1, sy: 0.05 }));
      await c.anim(close ? 110 : 140, spec);
      names.forEach((n) => c.set(`c${n}`, { o: close ? 1 : 0 }));
      if (!close) names.forEach((n) => c.set(`l${n}`, { o: 0 }));
    };
    for (let i = 0; i < 2; i++) {
      await lid(['l', 'r'], true);
      await c.wait(120);
      await lid(['l', 'r'], false);
      await c.wait(250);
    }
    // 眨一隻眼（對你拋媚眼）
    await c.wait(200);
    await lid(['r'], true);
    await c.wait(450);
    await lid(['r'], false);
  },
};

const cheeks = {
  id: 'g-cheeks', en: 'Cheeks', zh: '臉頰', ...base(GIRL),
  hint: at(GIRL, 548, 482), tag: [270, 712],
  pivots: { bl: [250, 480], br: [548, 480] },
  art: (p) => onFace(GIRL, `
    ${HIT(ell(250, 480, 72, 45) + ell(548, 480, 72, 45))}
    <ellipse id="${p}-bl" cx="250" cy="480" rx="72" ry="44" fill="#ff6f86" opacity="0"/>
    <ellipse id="${p}-br" cx="548" cy="480" rx="72" ry="44" fill="#ff6f86" opacity="0"/>`),
  async act(c) {
    // 害羞：臉頰變得紅通通，冒出粉紅色的小泡泡
    await c.anim(500, { bl: { o: 0.55 }, br: { o: 0.55 } });
    for (let i = 0; i < 3; i++) {
      c.burst('bl', 250, 440, { n: 3, color: '#ff8fa3', vx: [-1.2, 0.4], vy: [-2.5, -1.2], g: -0.01, size: [7, 13], life: 1100 });
      c.burst('br', 548, 440, { n: 3, color: '#ff8fa3', vx: [-0.4, 1.2], vy: [-2.5, -1.2], g: -0.01, size: [7, 13], life: 1100 });
      await c.anim(260, { bl: { sx: 1.12, sy: 1.12 }, br: { sx: 1.12, sy: 1.12 } });
      await c.anim(260, { bl: { sx: 1, sy: 1 }, br: { sx: 1, sy: 1 } });
    }
    await c.wait(300);
    await c.anim(600, { bl: { o: 0 }, br: { o: 0 } });
  },
};

// ---------- 男生 ----------
// 眉毛：切出來往上抬；臉上挖掉的地方墊一塊膚色
const BROW_L = [[135, 336], [150, 300], [185, 278], [225, 267], [262, 264], [264, 293], [230, 297], [195, 307], [160, 330]];
const BROW_R = BROW_L.map(([x, y]) => [630 - x, y]);
const brows = {
  id: 'b-brows', en: 'Eyebrows', zh: '眉毛', ...base(BOY),
  hint: at(BOY, 200, 300), tag: [1212, 452],
  pivots: { l: [200, 300], r: [430, 300] },
  art: (p) => onFace(BOY, `
    <defs>${CLIP(`${p}-cl`, path(BROW_L))}${CLIP(`${p}-cr`, path(BROW_R))}</defs>
    <path d="${path(BROW_L)}${path(BROW_R)}" fill="${BOY.skin}"/>
    <g id="${p}-l">${IMG(BOY, 'boy', `${p}-cl`)}</g>
    <g id="${p}-r">${IMG(BOY, 'boy', `${p}-cr`)}</g>`),
  async act(c) {
    // 驚訝：眉毛抬高高兩次，再一高一低扭一扭
    for (let i = 0; i < 2; i++) {
      await c.anim(200, { l: { ty: -24 }, r: { ty: -24 } });
      await c.wait(200);
      await c.anim(200, { l: { ty: 0 }, r: { ty: 0 } });
      await c.wait(120);
    }
    for (let i = 0; i < 3; i++) {
      await c.anim(160, { l: { ty: -22, r: 6 }, r: { ty: 0, r: 0 } });
      await c.anim(160, { l: { ty: 0, r: 0 }, r: { ty: -22, r: -6 } });
    }
    await c.anim(160, { l: { ty: 0, r: 0 }, r: { ty: 0, r: 0 } });
  },
};

// 耳朵：切出來繞著貼在頭上的地方搖；旁邊冒出聲波
const EAR_L = [[0, 398], [93, 398], [93, 548], [0, 548]];
const EAR_R = [[533, 398], [625, 398], [625, 548], [533, 548]];
// 切出來的耳朵比臉上挖掉的地方寬一點點，交界才不會有一條白縫
const EAR_LC = [[0, 398], [97, 398], [97, 548], [0, 548]];
const EAR_RC = [[529, 398], [625, 398], [625, 548], [529, 548]];
const wave = (x, dir) => [40, 75, 110].map((r) =>
  `<path d="M${x + dir * r * 0.2},${470 - r} A${r},${r} 0 0,${dir < 0 ? 0 : 1} ${x + dir * r * 0.2},${470 + r}" transform="translate(${dir * 10} 0)"/>`).join('');
const ears = {
  id: 'b-ears', en: 'Ears', zh: '耳朵', ...base(BOY),
  hint: at(BOY, 45, 470), tag: [1000, 680],
  pivots: { l: [93, 470], r: [533, 470], wl: [-20, 470], wr: [645, 470] },
  art: (p) => onFace(BOY, `
    <defs>${CLIP(`${p}-cl`, path(EAR_LC))}${CLIP(`${p}-cr`, path(EAR_RC))}</defs>
    <g id="${p}-wl" opacity="0" fill="none" stroke="#ff8a5c" stroke-width="12" stroke-linecap="round">${wave(-20, -1)}</g>
    <g id="${p}-wr" opacity="0" fill="none" stroke="#ff8a5c" stroke-width="12" stroke-linecap="round">${wave(645, 1)}</g>
    <g id="${p}-l">${IMG(BOY, 'boy', `${p}-cl`)}</g>
    <g id="${p}-r">${IMG(BOY, 'boy', `${p}-cr`)}</g>`),
  async act(c) {
    // 聽到聲音了：兩邊冒出聲波，耳朵動一動
    for (let i = 0; i < 2; i++) {
      c.set('wl', { o: 0, sx: 0.6, sy: 0.6 });
      c.set('wr', { o: 0, sx: 0.6, sy: 0.6 });
      await c.anim(350, { wl: { o: 1, sx: 1, sy: 1 }, wr: { o: 1, sx: 1, sy: 1 } });
      await c.anim(350, { wl: { o: 0, sx: 1.25, sy: 1.25 }, wr: { o: 0, sx: 1.25, sy: 1.25 } });
    }
    for (let i = 0; i < 4; i++) {
      await c.anim(130, { l: { r: 12 }, r: { r: -12 } });
      await c.anim(130, { l: { r: -6 }, r: { r: 6 } });
    }
    await c.anim(150, { l: { r: 0 }, r: { r: 0 } });
  },
};

// 鼻子：聞一聞（變大一點點），然後打一個大噴嚏
const nose = {
  id: 'b-nose', en: 'Nose', zh: '鼻子', ...base(BOY),
  hint: at(BOY, 315, 470), tag: [1292, 604],
  pivots: { n: [315, 478] },
  art: (p) => onFace(BOY, `
    <defs>${CLIP(`${p}-c`, ell(315, 472, 50, 36))}</defs>
    <g id="${p}-n">${IMG(BOY, 'boy', `${p}-c`)}</g>`),
  async act(c) {
    for (let i = 0; i < 3; i++) {
      await c.anim(140, { n: { sx: 1.12, sy: 1.08 } });
      await c.anim(140, { n: { sx: 1, sy: 1 } });
    }
    await c.wait(200);
    speak('Achoo!', { queue: true });
    await c.anim(500, { n: { sx: 1.3, sy: 1.25, ty: -8 } });
    await c.anim(90, { n: { sx: 0.95, sy: 0.95, ty: 6 } });
    c.burst('n', 315, 505, { n: 18, color: '#bfe6ff', vx: [-4, 4], vy: [-1, 3], g: 0.12, size: [6, 12], life: 1000 });
    await c.anim(250, { n: { sx: 1, sy: 1, ty: 0 } });
  },
};

// 嘴巴：張開說「啊～」，再咬三口
const MOUTH = (p, id) => `
  <g id="${p}-${id}" opacity="0">
    <path d="M222,526 Q315,516 408,526 Q402,646 315,656 Q228,646 222,526Z" fill="#8c2f39"/>
    <path d="M240,530 Q315,522 390,530 L386,556 Q315,562 244,556Z" fill="#fff"/>
    <ellipse cx="315" cy="622" rx="62" ry="30" fill="#ff8a95"/>
  </g>`;
const mouth = {
  id: 'b-mouth', en: 'Mouth', zh: '嘴巴', ...base(BOY),
  hint: at(BOY, 315, 545), tag: [1340, 648],
  pivots: { m: [315, 524] },
  art: (p) => onFace(BOY, `${HIT(ell(315, 540, 105, 32))}${MOUTH(p, 'm')}`),
  async act(c) {
    c.set('m', { o: 1, sy: 0.1 });
    speak('Ahh!', { queue: true });
    await c.anim(350, { m: { sy: 1 } });
    await c.wait(900);
    for (let i = 0; i < 3; i++) {
      await c.anim(150, { m: { sy: 0.15 } });
      await c.anim(150, { m: { sy: 0.6 } });
    }
    await c.anim(200, { m: { sy: 0.1 } });
    c.set('m', { o: 0, sy: 1 });
  },
};

// 舌頭：嘴巴開一點點，舌頭伸出來左右搖
const tongue = {
  id: 'b-tongue', en: 'Tongue', zh: '舌頭', ...base(BOY),
  hint: at(BOY, 315, 610), tag: [1212, 760],
  pivots: { m: [315, 524], t: [315, 545] },
  art: (p) => onFace(BOY, `
    ${HIT(ell(315, 615, 85, 40))}
    ${MOUTH(p, 'm')}
    <g id="${p}-t" opacity="0">
      <path d="M262,545 L368,545 L366,640 Q315,700 264,640Z" fill="#ff7d8c"/>
      <path d="M315,560 L315,640" stroke="#e05a6c" stroke-width="7" stroke-linecap="round"/>
    </g>`),
  async act(c) {
    c.set('m', { o: 1, sy: 0.1 });
    await c.anim(200, { m: { sy: 0.45 } });
    c.set('t', { o: 1, sy: 0.05 });
    await c.anim(300, { t: { sy: 1 } });
    for (let i = 0; i < 3; i++) {
      await c.anim(170, { t: { r: 14 } });
      await c.anim(170, { t: { r: -14 } });
    }
    await c.anim(150, { t: { r: 0 } });
    await c.wait(250);
    await c.anim(250, { t: { sy: 0.05 } });
    c.set('t', { o: 0, sy: 1 });
    await c.anim(150, { m: { sy: 0.1 } });
    c.set('m', { o: 0, sy: 1 });
  },
};

SCENES['face'] = {
  w: 1600,
  h: 1000,
  bg: () => `
    <defs>
      ${HOLE('face-gh', GIRL, path(TAIL_L_OUT) + path(TAIL_R_OUT))}
      ${HOLE('face-bh', BOY, path(EAR_L) + path(EAR_R))}
    </defs>
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <g transform="translate(${GIRL.x} ${1000 - GIRL.h * GIRL.s}) scale(${GIRL.s})">${IMG(GIRL, 'girl', 'face-gh')}</g>
    <g transform="translate(${BOY.x} ${1000 - BOY.h * BOY.s}) scale(${BOY.s})">${IMG(BOY, 'boy', 'face-bh')}</g>
    <text x="800" y="96" text-anchor="middle" font-size="60" font-weight="900" fill="${LINE}">My Face</text>
    <text x="800" y="146" text-anchor="middle" font-size="38" font-weight="900" fill="${LINE}" opacity=".7">我的臉</text>
  `,
  items: [hair, eyes, cheeks, brows, ears, nose, mouth, tongue],
};
}
