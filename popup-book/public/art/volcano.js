// 🌋 火山：點火山會轟隆隆噴發，點恐龍會唸英文名字然後動起來
// 版面 1600×1000；地平線在 y ≈ 630，下面是一大片褐色的岩石地
// 火山和恐龍都是 AI 生成的圖（art/img/volcano/*.webp），在洋紅色背景上生圖（picks 用 {"key": "magenta"}）
// 火山圖頂端原本有一小團粉紅色的煙，去背後手動切掉了；噴發的岩漿和煙都是程式噴的小顆粒
// 整個檔案包在 { } 裡，變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/volcano/${name}.webp`;
const IMG = (name, w, h, clip, extra = '') =>
  `<image href="${SRC(name)}" width="${w}" height="${h}"${clip ? ` clip-path="url(#${clip})"` : ''}${extra}/>`;
const PATH = (pts) => 'M' + pts.map((p) => p.join(',')).join('L') + 'Z';
const RECT = (x0, y0, x1, y1) => PATH([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]);
const CLIP = (id, d) => `<clipPath id="${id}"><path d="${d}"/></clipPath>`;
const HOLE = (id, w, h, d) => `<clipPath id="${id}"><path clip-rule="evenodd" d="M0,0H${w}V${h}H0Z${d}"/></clipPath>`;
const CIRCLE = (cx, cy, r) => `M${cx - r},${cy}a${r},${r} 0 1 0 ${2 * r},0a${r},${r} 0 1 0 ${-2 * r},0Z`;
const DUST = '#b8683a', LAVA = ['#ff4a1c', '#ff8a1c', '#ffd23f'], SMOKE = ['#6d6470', '#8f8790', '#b3adb5'];

// 整張圖放在零件 body 裡；inner 不給就是整張圖
const whole = (p, name, w, h, inner) =>
  `<g transform="translate(0 ${-h})"><g id="${p}-body">${inner ?? IMG(name, w, h)}</g></g>`;
const dust = (c, x, y, n = 6) =>
  c.burst('body', x, y, { n, color: DUST, vx: [-2.5, 2.5], vy: [-3, -0.5], g: 0.15, size: [6, 12], life: 800 });
// 走路／跑步時身體一上一下
const bob = (c, n, amp) => (t) => c.set('body', { ty: -amp * Math.abs(Math.sin(t * Math.PI * n)) });

// ---------- 火山：轟隆隆搖一搖，「Boom!」噴出岩漿和濃煙 ----------
// 圖 927×536，火山口在 (487, 5)
// focus: false：火山很大，就在原地噴發
// glow：同一張圖疊上變亮濾鏡，噴發時淡入，岩漿看起來在發光
const volcano = {
  id: 'volcano', en: 'Volcano', zh: '火山', x: 330, y: 655, s: 0.8,
  hint: [487, -330], focus: false,
  label: [-60, -200], // 名牌放在火山左邊，才不會擋住火山口
  pivots: { body: [463, 536] },
  art: (p) => `
    <filter id="${p}-hot"><feComponentTransfer>
      <feFuncR type="linear" slope="1.7" intercept=".15"/><feFuncG type="linear" slope="1.3"/><feFuncB type="linear" slope=".8"/>
    </feComponentTransfer></filter>` +
    whole(p, 'volcano', 927, 536,
      IMG('volcano', 927, 536) + `<g id="${p}-glow" opacity="0">${IMG('volcano', 927, 536, null, ` filter="url(#${p}-hot)"`)}</g>`),
  async act(c) {
    // 轟隆隆：左右抖動
    await c.anim(900, { glow: { o: 0.6 } }, (t) => c.set('body', { tx: 6 * Math.sin(t * Math.PI * 18) }));
    c.set('body', { tx: 0 });
    speak('Boom!', { queue: true });
    for (let i = 0; i < 6; i++) {
      LAVA.forEach((color) =>
        c.burst('body', 487, 10, { n: 6, color, vx: [-5, 5], vy: [-14, -8], g: 0.32, size: [12, 26], life: 1600 }));
      SMOKE.forEach((color) =>
        c.burst('body', 487, 0, { n: 3, color, vx: [-1.2, 1.2], vy: [-3, -1.5], g: -0.02, size: [30, 56], life: 2400 }));
      await c.anim(250, { glow: { o: i % 2 ? 0.6 : 1 } });
    }
    await c.anim(1200, { glow: { o: 0 } });
  },
};

// ---------- 梁龍：長長的鞭子尾巴甩一甩，脖子抬高 ----------
// 圖 788×539（臉朝右）；尾巴分兩節：x = 230 和 x = 110 切開（後腳從 x ≈ 320 才開始，不會切到）
const DIP_TAIL = RECT(110, 150, 230, 360), DIP_TIP = RECT(-20, 150, 110, 360);
const diplodocus = {
  id: 'diplodocus', en: 'Diplodocus', zh: '梁龍', x: 1160, y: 650, s: 0.5,
  hint: [520, -330],
  pivots: { body: [560, 539], tail: [230, 296], tail2: [110, 308] },
  art: (p) => whole(p, 'diplodocus', 788, 539,
    HOLE(`${p}-cb`, 788, 539, RECT(-20, 150, 230, 360)) + IMG('diplodocus', 788, 539, `${p}-cb`) +
    `<g id="${p}-tail">` +
      CLIP(`${p}-ct`, DIP_TAIL) + IMG('diplodocus', 788, 539, `${p}-ct`) +
      CLIP(`${p}-ct2`, DIP_TIP) + `<g id="${p}-tail2">${IMG('diplodocus', 788, 539, `${p}-ct2`)}</g>` +
      CLIP(`${p}-cj2`, CIRCLE(110, 308, 22)) + IMG('diplodocus', 788, 539, `${p}-cj2`) +
    `</g>` +
    CLIP(`${p}-cj`, CIRCLE(230, 296, 46)) + IMG('diplodocus', 788, 539, `${p}-cj`)),
  async act(c) {
    // 甩尾巴：兩節各轉一半，看起來像鞭子
    for (let i = 0; i < 3; i++) {
      await c.anim(260, { tail: { r: -5 }, tail2: { r: -7 } });
      await c.anim(260, { tail: { r: 5 }, tail2: { r: 7 } });
    }
    await c.anim(200, { tail: { r: 0 }, tail2: { r: 0 } });
    // 抬起前半身，再慢慢走一段
    await c.anim(600, { body: { r: -6 } });
    await c.wait(400);
    await c.anim(600, { body: { r: 0 } });
    await c.anim(1400, { body: { tx: -120 } }, bob(c, 4, 8));
    c.set('body', { sx: -1 });
    await c.anim(1400, { body: { tx: 0 } }, bob(c, 4, 8));
    c.set('body', { sx: 1, ty: 0 });
  },
};

// ---------- 棘龍：往後一仰，「Roar!」大吼一聲，再跺跺腳 ----------
// 圖 786×544（臉朝右），嘴巴在 (775, 100)，後腳在 (430, 544)
const spinosaurus = {
  id: 'spinosaurus', en: 'Spinosaurus', zh: '棘龍', x: 960, y: 930, s: 0.55,
  hint: [420, -320],
  pivots: { body: [430, 544] },
  art: (p) => whole(p, 'spinosaurus', 786, 544),
  async act(c) {
    await c.anim(400, { body: { r: -10 } });
    speak('Roar!', { queue: true });
    await c.anim(200, { body: { r: 4, sx: 1.06, sy: 1.06 } });
    for (let i = 0; i < 4; i++) {
      await c.anim(70, { body: { tx: -5 } });
      await c.anim(70, { body: { tx: 5 } });
    }
    await c.anim(300, { body: { r: 0, sx: 1, sy: 1, tx: 0 } });
    speak('Stomp stomp!', { queue: true });
    for (let i = 0; i < 2; i++) {
      await c.anim(200, { body: { ty: -30 } });
      await c.anim(150, { body: { ty: 0 } }, null, (t) => t * t);
      dust(c, 430, 544, 8);
    }
  },
};

// ---------- 腫頭龍：低頭往前衝，「Bonk!」頭頂撞出星星，再彈回來 ----------
// 圖 795×606（臉朝右），圓頂頭在 (735, 60)
const pachycephalosaurus = {
  id: 'pachycephalosaurus', en: 'Pachycephalosaurus', zh: '腫頭龍', x: 1310, y: 985, s: 0.4,
  hint: [430, -330],
  pivots: { body: [520, 606] },
  art: (p) => whole(p, 'pachycephalosaurus', 795, 606),
  async act(c) {
    // 往後退一點、低頭
    await c.anim(400, { body: { tx: -80, r: 18 } });
    for (let i = 0; i < 2; i++) dust(c, 520, 606, 4);
    await c.anim(350, { body: { tx: 60 } }, null, (t) => t * t);
    speak('Bonk!', { queue: true });
    c.burst('body', 770, 160, { n: 10, color: '#ffe14d', vx: [-3, 3], vy: [-5, -1], g: 0.08, size: [8, 14], life: 1000 });
    await c.anim(200, { body: { tx: 20, sx: 0.95, sy: 1.05 } });
    // 頭暈暈，搖一搖
    for (let i = 0; i < 2; i++) {
      await c.anim(200, { body: { r: 8 } });
      await c.anim(200, { body: { r: -4 } });
    }
    await c.anim(500, { body: { tx: 0, r: 0, sx: 1, sy: 1 } });
  },
};

// ---------- 雙脊龍：跳一跳、轉個圈，頭搖一搖 ----------
// 圖 733×586（臉朝右）
const dilophosaurus = {
  id: 'dilophosaurus', en: 'Dilophosaurus', zh: '雙脊龍', x: 300, y: 930, s: 0.4,
  hint: [460, -330],
  pivots: { body: [480, 586] },
  art: (p) => whole(p, 'dilophosaurus', 733, 586),
  async act(c) {
    for (let i = 0; i < 2; i++) {
      await c.anim(250, { body: { ty: -90 } }, null, (t) => 1 - (1 - t) ** 2);
      await c.anim(250, { body: { ty: 0 } }, null, (t) => t * t);
      dust(c, 480, 586, 5);
    }
    // 轉身再轉回來
    await c.anim(250, { body: { sx: -1 } });
    await c.anim(250, { body: { sx: 1 } });
    for (let i = 0; i < 3; i++) {
      await c.anim(120, { body: { r: -5 } });
      await c.anim(120, { body: { r: 5 } });
    }
    await c.anim(120, { body: { r: 0 } });
  },
};

// ---------- 禽龍：用後腳站起來，舉起大拇指的尖刺，再放下來走一走 ----------
// 圖 853×571（臉朝右），後腳在 (420, 571)
const iguanodon = {
  id: 'iguanodon', en: 'Iguanodon', zh: '禽龍', x: 40, y: 790, s: 0.45,
  hint: [480, -320],
  pivots: { body: [420, 571] },
  art: (p) => whole(p, 'iguanodon', 853, 571),
  async act(c) {
    await c.anim(600, { body: { r: -18 } });
    for (let i = 0; i < 2; i++) {
      await c.anim(200, { body: { r: -22 } });
      await c.anim(200, { body: { r: -16 } });
    }
    await c.anim(400, { body: { r: 0 } });
    dust(c, 720, 571, 6);
    await c.anim(1000, { body: { tx: 120 } }, bob(c, 4, 10));
    c.set('body', { sx: -1 });
    await c.anim(1000, { body: { tx: 0 } }, bob(c, 4, 10));
    c.set('body', { sx: 1, ty: 0 });
  },
};

// ---------- 食肉牛龍：飛快地衝出去再跑回來，揚起一路沙塵 ----------
// 圖 755×458（臉朝左，跑步的樣子），腳在 (380, 458)
const carnotaurus = {
  id: 'carnotaurus', en: 'Carnotaurus', zh: '食肉牛龍', x: 580, y: 985, s: 0.4,
  hint: [380, -230],
  pivots: { body: [380, 458] },
  art: (p) => whole(p, 'carnotaurus', 755, 458),
  async act(c) {
    const run = (t) => {
      c.set('body', { ty: -30 * Math.abs(Math.sin(t * Math.PI * 6)) });
      if (Math.random() < 0.25) dust(c, 600, 458, 2);
    };
    await c.anim(800, { body: { tx: -200 } }, run, (t) => t);
    c.set('body', { sx: -1 });
    await c.anim(1200, { body: { tx: 250 } }, run, (t) => t);
    c.set('body', { sx: 1 });
    await c.anim(600, { body: { tx: 0 } }, run, (t) => t);
    c.set('body', { ty: 0 });
  },
};

SCENES['volcano'] = {
  w: 1600,
  h: 1000,
  bg: () => `
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <text x="56" y="98" font-size="60" font-weight="900" fill="#fff">Volcano</text>
    <text x="58" y="148" font-size="38" font-weight="900" fill="#fff" opacity=".85">火山</text>
  `,
  // 先畫後排（遠的），再畫前排
  items: [volcano, diplodocus, iguanodon, dilophosaurus, spinosaurus, pachycephalosaurus, carnotaurus],
};
}
