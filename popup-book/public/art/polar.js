// 🐧 極地：點動物會唸英文名字、播真的叫聲（北極熊、海豹、北極狐、雪鴞），然後像機關書一樣動起來
// 版面 1600×1000；上面是有極光的天空，地平線在 y ≈ 575，下面是雪地；右下是深藍色的海（x 350～1600, y ≈ 730 以下）
// 動物是 AI 生成的圖（art/img/polar/*.webp）；白色的動物放在白雪上看不清楚，所以加一圈淡藍色的外光（#polar-edge）
// 叫聲是 Pixabay 的音效（audio/sound/，來源見那裡的 CREDITS.md）：海豹的原檔很長，只剪了最響的 2.5 秒
// 整個檔案包在 { } 裡，變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/polar/${name}.webp`;
const IMG = (name, w, h) => `<image href="${SRC(name)}" width="${w}" height="${h}" filter="url(#polar-edge)"/>`;
const SNOW = '#ffffff', ICE = '#d6ecff', SEA = '#8fd3ff';

// 整張圖放在零件 body 裡
const whole = (p, name, w, h) =>
  `<g transform="translate(0 ${-h})"><g id="${p}-body">${IMG(name, w, h)}</g></g>`;
// 跳一下：ty 走一個拱形，落地壓扁一下
async function hop(c, h, ms, tx) {
  await c.anim(180, { body: { sy: 0.9 } });
  await c.anim(ms, { body: { sy: 1, ...(tx === undefined ? {} : { tx }) } }, (t) => c.set('body', { ty: -h * Math.sin(t * Math.PI) }));
  c.set('body', { ty: 0 });
  await c.anim(120, { body: { sy: 0.92 } });
  await c.anim(150, { body: { sy: 1 } });
}

// ---------- 北極熊：站起來「吼——」，再用力踩地，雪花噴起來 ----------
// 圖 687×511（臉朝右），後腳在 (200, 505)
const polarbear = {
  id: 'polarbear', en: 'Polar Bear', zh: '北極熊', x: 120, y: 770, s: 0.55,
  hint: [350, -330],
  pivots: { body: [200, 505] },
  box: [0, -700, 760, 700],
  art: (p) => whole(p, 'polarbear', 687, 511),
  async act(c) {
    playSound('polar-bear');
    await c.anim(700, { body: { r: -35 } });
    for (let i = 0; i < 2; i++) {
      await c.anim(200, { body: { r: -39 } });
      await c.anim(200, { body: { r: -33 } });
    }
    await c.wait(300);
    await c.anim(350, { body: { r: 0 } }, undefined, (t) => t * t);
    c.burst('body', 560, 500, { n: 16, color: SNOW, vx: [-4, 4], vy: [-6, -2], g: 0.2, size: [7, 14] });
    c.burst('body', 560, 500, { n: 8, color: ICE, vx: [-3, 3], vy: [-5, -2], g: 0.2, size: [6, 11] });
    await c.anim(120, { body: { sy: 0.94 } });
    await c.anim(160, { body: { sy: 1 } });
  },
};

// ---------- 企鵝：「Wheee!」趴下來用肚子滑雪，再搖搖擺擺走回來 ----------
// 圖 474×635（臉朝右），腳在 (300, 620)
const penguin = {
  id: 'penguin', en: 'Penguin', zh: '企鵝', x: 560, y: 715, s: 0.3,
  hint: [260, -420],
  pivots: { body: [300, 620] },
  box: [-100, -735, 1200, 835],
  art: (p) => whole(p, 'penguin', 474, 635),
  async act(c) {
    speak('Wheee!', { queue: true });
    await c.anim(400, { body: { r: 75, ty: -60 } });
    // 肚子貼著雪往前滑，後面揚起雪花
    await c.anim(1300, { body: { tx: 600 } }, (t) => {
      if (Math.random() < 0.3) c.burst('body', 60, 560, { n: 2, color: SNOW, vx: [-3, -1], vy: [-3, -1], g: 0.15, size: [6, 11] });
    });
    await c.anim(400, { body: { r: 0, ty: 0 } });
    await hop(c, 60, 300);
    c.set('body', { sx: -1 });
    const waddle = (t) => c.set('body', { r: 10 * Math.sin(t * Math.PI * 10) });
    await c.anim(1800, { body: { tx: 0 } }, waddle);
    c.set('body', { sx: 1, r: 0 });
  },
};

// ---------- 海豹：抬頭叫，往前跳兩下，翻身露出肚子 ----------
// 圖 803×399（臉朝右）
const seal = {
  id: 'seal', en: 'Seal', zh: '海豹', x: 20, y: 975, s: 0.38,
  hint: [500, -260],
  pivots: { body: [400, 399] },
  box: [0, -600, 1103, 600],
  art: (p) => whole(p, 'seal', 803, 399),
  async act(c) {
    playSound('seal');
    await c.anim(400, { body: { r: -8 } });
    for (let i = 0; i < 2; i++) {
      await c.anim(150, { body: { r: -12 } });
      await c.anim(150, { body: { r: -6 } });
    }
    await c.anim(200, { body: { r: 0 } });
    await hop(c, 60, 400, 150);
    await hop(c, 60, 400, 300);
    // 在雪地上滾一圈，再滑回原位
    await c.anim(900, { body: { r: 360 } }, (t) => c.set('body', { ty: -50 * Math.sin(t * Math.PI) }));
    c.set('body', { r: 0, ty: 0 });
    c.burst('body', 400, 395, { n: 10, color: SNOW, vx: [-3, 3], vy: [-4, -1], g: 0.15, size: [6, 11] });
    await c.anim(900, { body: { tx: 0 } });
  },
};

// ---------- 海象：「Clap clap!」抬起上半身拍拍手，再撲通一下趴下 ----------
// 圖 750×377（臉朝右），尾巴在 (60, 370)
const walrus = {
  id: 'walrus', en: 'Walrus', zh: '海象', x: 840, y: 730, s: 0.4,
  hint: [500, -260],
  pivots: { body: [60, 370] },
  box: [0, -600, 750, 600],
  art: (p) => whole(p, 'walrus', 750, 377),
  async act(c) {
    speak('Clap clap!', { queue: true });
    for (let i = 0; i < 3; i++) {
      await c.anim(220, { body: { r: -10, sy: 1.05 } });
      await c.anim(220, { body: { r: -3, sy: 1 } });
    }
    await c.anim(400, { body: { r: -16 } });
    await c.anim(250, { body: { r: 2 } }, undefined, (t) => t * t);
    c.burst('body', 600, 370, { n: 16, color: SEA, vx: [-4, 4], vy: [-7, -2], g: 0.3, size: [7, 13] });
    c.burst('body', 300, 370, { n: 10, color: SNOW, vx: [-4, 4], vy: [-5, -1], g: 0.25, size: [6, 11] });
    await c.anim(150, { body: { sy: 0.92, r: 0 } });
    await c.anim(200, { body: { sy: 1 } });
  },
};

// ---------- 北極狐：「汪」一聲，蹲低再高高跳起，頭朝下鑽進雪裡 ----------
// 圖 661×567（坐著，臉朝右），屁股在 (330, 560)
const fox = {
  id: 'fox', en: 'Arctic Fox', zh: '北極狐', x: 1130, y: 640, s: 0.32,
  hint: [400, -380],
  pivots: { body: [330, 560] },
  box: [-50, -967, 1061, 1067],
  art: (p) => whole(p, 'fox', 661, 567),
  async act(c) {
    playSound('fox');
    // 豎起耳朵聽雪底下的聲音
    for (let i = 0; i < 2; i++) {
      await c.anim(250, { body: { r: 6 } });
      await c.anim(250, { body: { r: -4 } });
    }
    await c.anim(300, { body: { r: 0, sy: 0.85 } });
    // 往前跳一個大拱形，頭朝下鑽進雪裡
    await c.anim(900, { body: { sy: 1, tx: 380 } }, (t) => c.set('body', { ty: -350 * Math.sin(t * Math.PI), r: 100 * t }));
    c.set('body', { ty: 0 });
    c.burst('body', 600, 150, { n: 22, color: SNOW, vx: [-5, 5], vy: [-8, -2], g: 0.25, size: [8, 15] });
    c.burst('body', 600, 150, { n: 10, color: ICE, vx: [-4, 4], vy: [-6, -2], g: 0.25, size: [6, 12] });
    for (let i = 0; i < 3; i++) {
      await c.anim(130, { body: { r: 108 } });
      await c.anim(130, { body: { r: 92 } });
    }
    // 跳出來、轉身回原位
    await c.anim(300, { body: { r: 0, ty: -80 } });
    c.set('body', { sx: -1 });
    await c.anim(900, { body: { tx: 0 } }, (t) => c.set('body', { ty: -80 * (1 - t) - 40 * Math.abs(Math.sin(t * Math.PI * 4)) }));
    c.set('body', { sx: 1, ty: 0 });
  },
};

// ---------- 雪鴞：「呼——呼——」左右歪頭，再飛起來繞一圈回來 ----------
// 圖 481×575（臉朝右），腳在 (310, 560)
const owl = {
  id: 'owl', en: 'Snowy Owl', zh: '雪鴞', x: 1380, y: 700, s: 0.3,
  hint: [260, -400],
  pivots: { body: [310, 560] },
  box: [-1200, -1175, 1681, 1275],
  art: (p) => whole(p, 'owl', 481, 575),
  async act(c) {
    playSound('snowy-owl');
    for (let i = 0; i < 2; i++) {
      await c.anim(350, { body: { r: 12 } });
      await c.anim(350, { body: { r: -12 } });
    }
    await c.anim(300, { body: { r: 0, sy: 0.9 } });
    // 飛起來：往左上繞一大圈，翅膀拍動用身體上下抖來表現
    c.set('body', { sx: -1 });
    await c.anim(2600, { body: { sy: 1 } }, (t) => {
      const a = t * Math.PI * 2;
      c.set('body', {
        tx: -500 * Math.sin(a / 2) - 150 * Math.sin(a),
        ty: -420 * Math.sin(a / 2) + 15 * Math.sin(t * Math.PI * 24),
        sx: t < 0.5 ? -1 : 1,
        r: 10 * Math.sin(a),
      });
    });
    c.set('body', { tx: 0, ty: 0, sx: 1, r: 0 });
    c.burst('body', 310, 560, { n: 8, color: SNOW, vx: [-2, 2], vy: [-3, -1], g: 0.12, size: [6, 10] });
  },
};

// ---------- 虎鯨：「Splash!」從海裡跳出來，落下時濺起大水花 ----------
// 圖 746×487（臉朝右）
const orca = {
  id: 'orca', en: 'Orca', zh: '虎鯨', x: 1060, y: 990, s: 0.42,
  hint: [400, -300],
  pivots: { body: [373, 243] },
  box: [0, -987, 746, 987],
  art: (p) => whole(p, 'orca', 746, 487),
  async act(c) {
    speak('Splash!', { queue: true });
    await c.anim(300, { body: { sy: 0.9, r: -25 } });
    c.burst('body', 373, 450, { n: 12, color: SEA, vx: [-3, 3], vy: [-6, -2], g: 0.3, size: [6, 12] });
    await c.anim(1300, { body: { sy: 1 } }, (t) => c.set('body', { ty: -420 * Math.sin(t * Math.PI), r: -25 + 55 * t }));
    c.set('body', { ty: 0, r: 0 });
    c.burst('body', 373, 300, { n: 22, color: SNOW, vx: [-6, 6], vy: [-9, -3], g: 0.35, size: [7, 15] });
    c.burst('body', 373, 300, { n: 12, color: SEA, vx: [-5, 5], vy: [-7, -2], g: 0.3, size: [6, 12] });
    for (let i = 0; i < 2; i++) {
      await c.anim(160, { body: { ty: 18 } });
      await c.anim(160, { body: { ty: 0 } });
    }
  },
};

SCENES['polar'] = {
  w: 1600,
  h: 1000,
  bg: () => `
    <defs><filter id="polar-edge" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#5d86b5" flood-opacity=".75"/>
    </filter></defs>
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <text x="1544" y="98" text-anchor="end" font-size="60" font-weight="900" fill="${LINE}">Polar</text>
    <text x="1542" y="148" text-anchor="end" font-size="38" font-weight="900" fill="${LINE}" opacity=".7">極地</text>
  `,
  // 先畫後排（遠的），再畫前排
  items: [fox, owl, walrus, penguin, polarbear, orca, seal],
};
}
