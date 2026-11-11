// 🦈 巨齒鯊海洋（史前動物書）：點遠古大海裡的動物會唸英文名字，然後游起來
// 版面 1600×1000；上面是天空，海面在 y ≈ 380，下面一大片海水，y ≈ 890 以下是沙地，左邊有海草
// 動物是 AI 生成的圖（art/img/megalodon-sea/*.webp），在洋紅色背景上生圖（picks 用 {"key": "magenta"}；李氏鯨的圖原本朝左，cutout 時翻過來）
// 叫聲：李氏鯨借用動物書的鯨魚叫聲（audio/sound/），其他用預先錄好的英文音效；泡泡、水花是程式噴的小顆粒
// 整個檔案包在 { } 裡，變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/megalodon-sea/${name}.webp`;
const WATER = '#bfe6ff', FOAM = '#ffffff', SAND = '#f0dcb4', WEED = '#5fbf4a';

const whole = (p, name, w, h) =>
  `<g transform="translate(0 ${-h})"><g id="${p}-body"><image href="${SRC(name)}" width="${w}" height="${h}"/></g></g>`;
// 冒泡泡：往上飄的小圓圈
const bubbles = (c, x, y, n = 6) =>
  c.burst('body', x, y, { n, color: WATER, vx: [-0.6, 0.6], vy: [-2.5, -1.2], g: -0.02, size: [5, 11], life: 1400 });
// 游過去再游回來：身體輕輕上下擺
async function swim(c, dx, ms, sway = 3, bx, by) {
  const wave = (t) => { c.set('body', { r: sway * Math.sin(t * Math.PI * 4) }); if (bx !== undefined && Math.random() < 0.15) bubbles(c, bx, by, 2); };
  if (dx < 0) c.set('body', { sx: -1 });
  await c.anim(ms, { body: { tx: dx } }, wave);
  c.set('body', { sx: dx < 0 ? 1 : -1 });
  await c.anim(ms, { body: { tx: 0 } }, wave);
  c.set('body', { sx: 1, r: 0 });
}

// ---------- 巨齒鯊：張大嘴往前衝「Chomp chomp!」咬兩口，再游回來 ----------
// 圖 911×380（臉朝右），嘴巴在 (840, 230)
const megalodon = {
  id: 'megalodon', en: 'Megalodon', zh: '巨齒鯊', x: 180, y: 700, s: 0.6,
  hint: [450, -190],
  pivots: { body: [450, 190] },
  art: (p) => whole(p, 'megalodon', 911, 380),
  async act(c) {
    await c.anim(400, { body: { tx: -40, r: 3 } });
    await c.anim(500, { body: { tx: 220, r: 0 } }, null, (t) => t * t);
    speak('Chomp chomp!', { queue: true });
    for (let i = 0; i < 2; i++) {
      await c.anim(140, { body: { sy: 1.08, sx: 0.96 } });
      bubbles(c, 860, 230, 6);
      await c.anim(140, { body: { sy: 1, sx: 1 } });
    }
    await c.wait(200);
    await c.anim(1400, { body: { tx: 0 } }, (t) => c.set('body', { r: 3 * Math.sin(t * Math.PI * 4) }));
    c.set('body', { r: 0 });
  },
};

// ---------- 李氏鯨：游到海面換氣，噴出一道水柱，再潛下去 ----------
// 圖 862×319（臉朝右），噴氣孔在 (720, 30)；牠在海面下（y 640），海面在 y ≈ 380
// focus: false：在原本的位置游上去，才會真的碰到海面
const livyatan = {
  id: 'livyatan', en: 'Livyatan', zh: '李氏鯨', x: 980, y: 640, s: 0.55,
  hint: [430, -160], focus: false,
  pivots: { body: [430, 160] },
  art: (p) => whole(p, 'livyatan', 862, 319),
  async act(c) {
    playSound('whale');
    await c.anim(1200, { body: { ty: -420, r: -6 } }, () => { if (Math.random() < 0.2) bubbles(c, 720, 40, 2); });
    await c.anim(300, { body: { r: 0 } });
    for (let i = 0; i < 5; i++) {
      c.burst('body', 720, 20, { n: 6, color: FOAM, vx: [-1.5, 1.5], vy: [-9, -6], g: 0.3, size: [7, 14], life: 1100 });
      c.burst('body', 720, 20, { n: 4, color: WATER, vx: [-2, 2], vy: [-7, -4], g: 0.3, size: [6, 11], life: 1000 });
      await c.wait(130);
    }
    await c.wait(500);
    await c.anim(1400, { body: { ty: 0, r: 4 } });
    await c.anim(300, { body: { r: 0 } });
  },
};

// ---------- 龍王鯨：長長的身體像蛇一樣扭著游過去，再游回來 ----------
// 圖 878×230（臉朝右）
const basilosaurus = {
  id: 'basilosaurus', en: 'Basilosaurus', zh: '龍王鯨', x: 900, y: 820, s: 0.55,
  hint: [440, -115],
  pivots: { body: [440, 115] },
  art: (p) => whole(p, 'basilosaurus', 878, 230),
  async act(c) {
    const wave = (t) => c.set('body', { r: 5 * Math.sin(t * Math.PI * 6), sy: 1 + 0.08 * Math.sin(t * Math.PI * 12) });
    c.set('body', { sx: -1 });
    await c.anim(1500, { body: { tx: -300 } }, wave);
    c.set('body', { sx: 1 });
    await c.anim(1500, { body: { tx: 0 } }, wave);
    c.set('body', { r: 0, sy: 1 });
  },
};

// ---------- 水生地懶：潛到海底吃海草，吐泡泡，再游回來 ----------
// 圖 742×323（臉朝右），嘴巴在 (720, 120)
const aquaticSloth = {
  id: 'aquatic-sloth', en: 'Aquatic Sloth', zh: '水生地懶', x: 120, y: 900, s: 0.45,
  hint: [370, -160],
  pivots: { body: [370, 160] },
  art: (p) => whole(p, 'aquatic-sloth', 742, 323),
  async act(c) {
    await c.anim(700, { body: { r: 14, ty: 30, tx: 40 } });
    speak('Munch munch!', { queue: true });
    for (let i = 0; i < 3; i++) {
      c.burst('body', 730, 200, { n: 4, color: WEED, vx: [-1, 1], vy: [-1.5, -0.3], g: 0.02, size: [6, 11], life: 1000 });
      c.burst('body', 730, 200, { n: 2, color: SAND, vx: [-1, 1], vy: [-1, 0], g: 0.03, size: [5, 9], life: 900 });
      await c.anim(200, { body: { r: 17 } });
      await c.anim(200, { body: { r: 13 } });
    }
    bubbles(c, 720, 110, 8);
    await c.anim(800, { body: { r: 0, ty: 0, tx: 0 } });
    await swim(c, 200, 1100, 3);
  },
};

// ---------- 巨企鵝：在水裡轉一圈「Wheee!」，冒一串泡泡 ----------
// 圖 790×429（臉朝右）
const giantPenguin = {
  id: 'giant-penguin', en: 'Giant Penguin', zh: '巨企鵝', x: 720, y: 505, s: 0.3,
  hint: [400, -215],
  pivots: { body: [395, 215] },
  art: (p) => whole(p, 'giant-penguin', 790, 429),
  async act(c) {
    speak('Wheee!', { queue: true });
    // 繞一個圈：往前、往下、往回、往上
    await c.anim(1600, { body: { r: 360 } }, (t) => {
      c.set('body', { tx: 180 * Math.sin(t * Math.PI * 2), ty: 140 * (1 - Math.cos(t * Math.PI * 2)) });
      if (Math.random() < 0.3) bubbles(c, 100, 215, 2);
    });
    c.set('body', { r: 0, tx: 0, ty: 0 });
    bubbles(c, 760, 180, 8);
  },
};

SCENES['megalodon-sea'] = {
  w: 1600,
  h: 1000,
  bg: () => `
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <text x="56" y="98" font-size="60" font-weight="900" fill="${LINE}">Megalodon Sea</text>
    <text x="58" y="148" font-size="38" font-weight="900" fill="${LINE}" opacity=".7">巨齒鯊海洋</text>
  `,
  // 先畫後排（遠的），再畫前排
  items: [livyatan, giantPenguin, basilosaurus, megalodon, aquaticSloth],
};
}
