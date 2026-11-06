// 🌊 遠古海洋：點海裡的爬行動物和遠古生物會唸英文名字，然後像機關書一樣動起來
// 版面 1600×1000；上面是天空，海面在 y ≈ 375，下面一大片海水，y ≈ 890 以下是沙地
// 動物是 AI 生成的圖（art/img/dino-sea/*.webp），在洋紅色背景上生圖（picks 用 {"key": "magenta"}）
// 泡泡、水花、墨汁是程式噴的小顆粒
// 整個檔案包在 { } 裡，變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/dino-sea/${name}.webp`;
const IMG = (name, w, h, clip) =>
  `<image href="${SRC(name)}" width="${w}" height="${h}"${clip ? ` clip-path="url(#${clip})"` : ''}/>`;
const PATH = (pts) => 'M' + pts.map((p) => p.join(',')).join('L') + 'Z';
const RECT = (x0, y0, x1, y1) => PATH([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]);
const CLIP = (id, d) => `<clipPath id="${id}"><path d="${d}"/></clipPath>`;
const HOLE = (id, w, h, d) => `<clipPath id="${id}"><path clip-rule="evenodd" d="M0,0H${w}V${h}H0Z${d}"/></clipPath>`;
const CIRCLE = (cx, cy, r) => `M${cx - r},${cy}a${r},${r} 0 1 0 ${2 * r},0a${r},${r} 0 1 0 ${-2 * r},0Z`;
const WATER = '#bfe6ff', FOAM = '#ffffff', SAND = '#f0d5a0';

// 整張圖放在零件 body 裡；inner 不給就是整張圖
const whole = (p, name, w, h, inner) =>
  `<g transform="translate(0 ${-h})"><g id="${p}-body">${inner ?? IMG(name, w, h)}</g></g>`;
// 會轉的一塊（尾巴、脖子）：沿著 cut 裁出來當零件 part，轉軸上再蓋一圈原圖（[x, y, 半徑]）遮住切口
const joint = (p, name, w, h, part, cut, [jx, jy, jr]) =>
  HOLE(`${p}-cb`, w, h, cut) + IMG(name, w, h, `${p}-cb`) +
  CLIP(`${p}-cp`, cut) + `<g id="${p}-${part}">${IMG(name, w, h, `${p}-cp`)}</g>` +
  CLIP(`${p}-cj`, CIRCLE(jx, jy, jr)) + IMG(name, w, h, `${p}-cj`);
// 冒泡泡：往上飄的小圓圈
const bubbles = (c, x, y, n = 6) =>
  c.burst('body', x, y, { n, color: WATER, vx: [-0.6, 0.6], vy: [-2.5, -1.2], g: -0.02, size: [5, 11], life: 1400 });

// ---------- 魚龍：像海豚一樣跳出水面翻身，落下時濺起水花 ----------
// 圖 849×348（臉朝右）；牠游在海面下（y 500），海面在 y ≈ 375
// focus: false：在原本的位置跳，才是真的從海面跳出去
const ichthyosaurus = {
  id: 'ichthyosaurus', en: 'Ichthyosaurus', zh: '魚龍', x: 1130, y: 505, s: 0.4,
  hint: [430, -200], focus: false,
  pivots: { body: [425, 174] },
  art: (p) => whole(p, 'ichthyosaurus', 849, 348),
  async act(c) {
    await c.anim(300, { body: { sy: 0.92, r: 25 } });
    bubbles(c, 425, 174, 8);
    // 往左上跳出水面，在空中翻身，再落回水裡
    await c.anim(1600, { body: { sy: 1 } }, (t) => c.set('body', {
      tx: -400 * t,
      ty: -700 * Math.sin(t * Math.PI),
      r: 25 - 70 * t,
    }));
    c.burst('body', 425, 174, { n: 18, color: FOAM, vx: [-5, 5], vy: [-8, -3], g: 0.35, size: [7, 14] });
    c.burst('body', 425, 174, { n: 10, color: WATER, vx: [-4, 4], vy: [-6, -2], g: 0.3, size: [6, 11] });
    speak('Splash!', { queue: true });
    await c.anim(400, { body: { ty: 40, r: -20 } });
    await c.anim(1300, { body: { tx: 0, ty: 0, r: 0 } });
  },
};

// ---------- 蛇頸龍：長脖子往上伸到海面換氣，再左右擺一擺 ----------
// 圖 767×307（臉朝右）；脖子在 x = 610 切開（前鰭在下面不會被裁到），掛在 (612, 150)
const PLE_NECK = RECT(610, 0, 767, 200);
const plesiosaurus = {
  id: 'plesiosaurus', en: 'Plesiosaurus', zh: '蛇頸龍', x: 520, y: 565, s: 0.55,
  hint: [400, -200],
  pivots: { body: [380, 200], neck: [612, 150] },
  art: (p) => whole(p, 'plesiosaurus', 767, 307, joint(p, 'plesiosaurus', 767, 307, 'neck', PLE_NECK, [612, 150, 52])),
  async act(c) {
    await c.anim(700, { neck: { r: -14 }, body: { ty: -40 } });
    bubbles(c, 760, 20, 8);
    await c.wait(400);
    for (let i = 0; i < 2; i++) {
      await c.anim(350, { neck: { r: 8 } });
      await c.anim(350, { neck: { r: -8 } });
    }
    // 划著鰭往前游一段再游回來
    await c.anim(1200, { body: { tx: 200, ty: 0 }, neck: { r: 0 } }, (t) => c.set('body', { r: 3 * Math.sin(t * Math.PI * 4) }));
    await c.anim(1200, { body: { tx: 0 } }, (t) => c.set('body', { r: 3 * Math.sin(t * Math.PI * 4) }));
    c.set('body', { r: 0 });
  },
};

// ---------- 古巨龜：慢慢划水往前游，冒一串泡泡，再游回來 ----------
// 圖 841×441（臉朝右），嘴巴在 (830, 120)
const archelon = {
  id: 'archelon', en: 'Archelon', zh: '古巨龜', x: 100, y: 610, s: 0.45,
  hint: [430, -260],
  pivots: { body: [420, 220] },
  art: (p) => whole(p, 'archelon', 841, 441),
  async act(c) {
    const swim = (t) => c.set('body', { ty: -25 * Math.sin(t * Math.PI * 4), r: -3 * Math.sin(t * Math.PI * 4) });
    await c.anim(1800, { body: { tx: 300 } }, swim);
    for (let i = 0; i < 3; i++) { bubbles(c, 830, 110, 5); await c.wait(300); }
    c.set('body', { sx: -1 });
    await c.anim(1800, { body: { tx: 0 } }, swim);
    c.set('body', { sx: 1, ty: 0, r: 0 });
  },
};

// ---------- 滄龍：尾鰭甩一甩，往前衝「Chomp chomp!」咬兩口 ----------
// 圖 836×263（臉朝右）；尾巴在 x = 680 切開，掛在 (680, 117)
const mosasaurus = {
  id: 'mosasaurus', en: 'Mosasaurus', zh: '滄龍', x: 760, y: 765, s: 0.7,
  hint: [400, -150],
  pivots: { body: [420, 131], tail: [680, 117] },
  art: (p) => whole(p, 'mosasaurus', 836, 263, joint(p, 'mosasaurus', 836, 263, 'tail', RECT(680, -20, 860, 283), [680, 117, 38])),
  async act(c) {
    for (let i = 0; i < 2; i++) {
      await c.anim(220, { tail: { r: -14 } });
      await c.anim(220, { tail: { r: 14 } });
    }
    await c.anim(150, { tail: { r: 0 } });
    speak('Chomp chomp!', { queue: true });
    for (let i = 0; i < 2; i++) {
      await c.anim(250, { body: { tx: -160, r: 4 } }, null, (t) => t * t);
      bubbles(c, 20, 110, 6);
      await c.anim(150, { body: { sy: 0.92 } });
      await c.anim(150, { body: { sy: 1 } });
    }
    await c.anim(1000, { body: { tx: 0, r: 0 } }, (t) => c.set('tail', { r: 12 * Math.sin(t * Math.PI * 4) }));
    c.set('tail', { r: 0 });
  },
};

// ---------- 菊石：觸手揮一揮，「咻」地往後噴水衝出去，再慢慢漂回來 ----------
// 圖 598×437（觸手朝右），觸手在 (560, 230)
const ammonite = {
  id: 'ammonite', en: 'Ammonite', zh: '菊石', x: 1370, y: 820, s: 0.3,
  hint: [250, -230],
  pivots: { body: [250, 220] },
  art: (p) => whole(p, 'ammonite', 598, 437),
  async act(c) {
    for (let i = 0; i < 2; i++) {
      await c.anim(250, { body: { r: -8 } });
      await c.anim(250, { body: { r: 4 } });
    }
    speak('Whoosh!', { queue: true });
    // 往後（左邊）噴水衝出去，前面冒出一串泡泡
    const jet = setInterval(() => c.burst('body', 560, 230, { n: 4, color: WATER, vx: [1, 4], vy: [-1, 1], g: 0, size: [6, 12], life: 800 }), 60);
    await c.anim(700, { body: { tx: -700, r: 0 } }, null, (t) => 1 - (1 - t) ** 3);
    clearInterval(jet);
    await c.wait(300);
    await c.anim(1800, { body: { tx: 0 } }, (t) => c.set('body', { ty: -30 * Math.sin(t * Math.PI * 3) }));
    c.set('body', { ty: 0 });
  },
};

// ---------- 鄧氏魚：張大嘴往前衝「Chomp chomp!」咬兩口 ----------
// 圖 886×459（臉朝左），嘴巴在 (40, 230)
const dunkleosteus = {
  id: 'dunkleosteus', en: 'Dunkleosteus', zh: '鄧氏魚', x: 270, y: 870, s: 0.42,
  hint: [430, -250],
  pivots: { body: [440, 230] },
  art: (p) => whole(p, 'dunkleosteus', 886, 459),
  async act(c) {
    await c.anim(400, { body: { tx: 80, r: -4 } });
    speak('Chomp chomp!', { queue: true });
    for (let i = 0; i < 2; i++) {
      await c.anim(220, { body: { tx: -220, r: 3 } }, null, (t) => t * t);
      bubbles(c, 40, 230, 6);
      await c.anim(120, { body: { sy: 0.9 } });
      await c.anim(120, { body: { sy: 1 } });
      await c.anim(300, { body: { tx: -60, r: 0 } });
    }
    await c.anim(800, { body: { tx: 0 } });
  },
};

// ---------- 三葉蟲：在沙地上爬一爬，縮成一顆球滾一下，再打開爬回來 ----------
// 圖 640×394（從上面看，頭朝右），貼在沙地上
const trilobite = {
  id: 'trilobite', en: 'Trilobite', zh: '三葉蟲', x: 1040, y: 945, s: 0.2,
  hint: [320, -200],
  pivots: { body: [320, 197] },
  art: (p) => whole(p, 'trilobite', 640, 394),
  async act(c) {
    await c.anim(1000, { body: { tx: 400 } }, (t) => c.set('body', { r: 4 * Math.sin(t * Math.PI * 8) }));
    // 縮成球：壓扁變圓，滾一圈
    await c.anim(300, { body: { sx: 0.6, sy: 1, r: 0 } });
    await c.anim(900, { body: { tx: -100, r: -360 } });
    c.burst('body', 320, 394, { n: 8, color: SAND, vx: [-2, 2], vy: [-2, -0.5], g: 0.1, size: [6, 10] });
    c.set('body', { r: 0 });
    await c.anim(300, { body: { sx: 1 } });
    c.set('body', { sx: -1 });
    await c.anim(1000, { body: { tx: 0 } }, (t) => c.set('body', { r: 4 * Math.sin(t * Math.PI * 8) }));
    c.set('body', { sx: 1, r: 0 });
  },
};

SCENES['dino-sea'] = {
  w: 1600,
  h: 1000,
  bg: () => `
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <text x="56" y="98" font-size="60" font-weight="900" fill="${LINE}">Prehistoric Sea</text>
    <text x="58" y="148" font-size="38" font-weight="900" fill="${LINE}" opacity=".7">遠古海洋</text>
  `,
  // 先畫後排（遠的），再畫前排
  items: [ichthyosaurus, plesiosaurus, archelon, mosasaurus, ammonite, dunkleosteus, trilobite],
};
}
