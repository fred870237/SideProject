// 🌵 南美洲草原（史前動物書）：點冰河時期南美洲的動物會唸英文名字，然後動起來
// 版面 1600×1000；地平線在 y ≈ 700，下面是一大片金黃色的草原，遠方是安地斯山，左邊有仙人掌
// 動物是 AI 生成的圖（art/img/sa-plains/*.webp），在洋紅色背景上生圖（picks 用 {"key": "magenta"}）
// 叫聲：短面熊借用動物書的棕熊叫聲（audio/sound/），其他用預先錄好的英文音效（Munch munch! 之類）
// 整個檔案包在 { } 裡，變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/sa-plains/${name}.webp`;
const DUST = '#e3c27a', DUST2 = '#c9a35a', LEAF = '#7cb342';

// 整張圖放在零件 body 裡
const whole = (p, name, w, h) =>
  `<g transform="translate(0 ${-h})"><g id="${p}-body"><image href="${SRC(name)}" width="${w}" height="${h}"/></g></g>`;
// 踢起一點土
const dust = (c, x, y, n = 8) => {
  c.burst('body', x, y, { n, color: DUST, vx: [-2.5, 2.5], vy: [-3, -0.5], g: 0.12, size: [6, 12], life: 800 });
  c.burst('body', x, y, { n: Math.ceil(n / 2), color: DUST2, vx: [-2, 2], vy: [-3, -0.5], g: 0.12, size: [5, 10], life: 800 });
};
// 走路時一上一下
const bob = (c, n, amp) => (t) => c.set('body', { ty: -amp * Math.abs(Math.sin(t * Math.PI * n)) });
// 走過去再走回來（往左走要把圖翻過來）
async function stroll(c, dx, ms, n, amp) {
  if (dx < 0) c.set('body', { sx: -1 });
  await c.anim(ms, { body: { tx: dx } }, bob(c, n, amp));
  c.set('body', { sx: dx < 0 ? 1 : -1 });
  await c.anim(ms, { body: { tx: 0 } }, bob(c, n, amp));
  c.set('body', { sx: 1, ty: 0 });
}

// ---------- 大地懶：用尾巴撐著站高，伸長手臂拉樹葉來吃 ----------
// 圖 612×650（臉朝右），站著的後腳在 (300, 650)
const groundSloth = {
  id: 'ground-sloth', en: 'Giant Ground Sloth', zh: '大地懶', x: 560, y: 790, s: 0.55,
  hint: [300, -330],
  pivots: { body: [300, 650] },
  art: (p) => whole(p, 'ground-sloth', 612, 650),
  async act(c) {
    await c.anim(700, { body: { sy: 1.1, r: 6 } });
    speak('Munch munch!', { queue: true });
    for (let i = 0; i < 3; i++) {
      c.burst('body', 560, 20, { n: 5, color: LEAF, vx: [-2, 2], vy: [-2, 0], g: 0.12, size: [7, 13], life: 1000 });
      await c.anim(250, { body: { r: 9 } });
      await c.anim(250, { body: { r: 4 } });
    }
    await c.anim(600, { body: { sy: 1, r: 0 } });
    dust(c, 300, 650, 8);
  },
};

// ---------- 雕齒獸：縮進硬硬的殼裡躲起來，再探出頭慢慢走 ----------
// 圖 790×533（臉朝右），腳在 (400, 533)
const glyptodon = {
  id: 'glyptodon', en: 'Glyptodon', zh: '雕齒獸', x: 30, y: 975, s: 0.42,
  hint: [380, -280],
  pivots: { body: [400, 533] },
  art: (p) => whole(p, 'glyptodon', 790, 533),
  async act(c) {
    await c.anim(400, { body: { sy: 0.82, sx: 1.04 } });
    for (let i = 0; i < 3; i++) {
      await c.anim(110, { body: { r: -3 } });
      await c.anim(110, { body: { r: 3 } });
    }
    await c.anim(150, { body: { r: 0 } });
    await c.wait(300);
    await c.anim(300, { body: { sy: 1.05, sx: 1 } });
    await c.anim(200, { body: { sy: 1 } });
    await stroll(c, 160, 1300, 4, 6);
  },
};

// ---------- 後弓獸：用短短的象鼻嗅一嗅，低頭吃草，再小跑一段 ----------
// 圖 584×674（臉朝右），後腳在 (200, 674)
const macrauchenia = {
  id: 'macrauchenia', en: 'Macrauchenia', zh: '後弓獸', x: 120, y: 770, s: 0.42,
  hint: [300, -340],
  pivots: { body: [200, 674] },
  art: (p) => whole(p, 'macrauchenia', 584, 674),
  async act(c) {
    speak('Sniff sniff!', { queue: true });
    for (let i = 0; i < 2; i++) {
      await c.anim(250, { body: { r: 3 } });
      await c.anim(250, { body: { r: -1 } });
    }
    await c.anim(500, { body: { r: 10 } });
    c.burst('body', 560, 640, { n: 6, color: LEAF, vx: [-1.5, 1.5], vy: [-2, -0.5], g: 0.12, size: [5, 10], life: 800 });
    await c.wait(500);
    await c.anim(400, { body: { r: 0 } });
    await stroll(c, 220, 900, 5, 18);
  },
};

// ---------- 箭齒獸：跺跺腳，噴出一團土，再往前走 ----------
// 圖 739×499（臉朝右），前腳在 (560, 499)
const toxodon = {
  id: 'toxodon', en: 'Toxodon', zh: '箭齒獸', x: 1150, y: 770, s: 0.42,
  hint: [370, -250],
  pivots: { body: [370, 499] },
  art: (p) => whole(p, 'toxodon', 739, 499),
  async act(c) {
    speak('Stomp stomp!', { queue: true });
    for (let i = 0; i < 3; i++) {
      await c.anim(160, { body: { ty: -22, r: -2 } });
      await c.anim(130, { body: { ty: 0, r: 0 } }, null, (t) => t * t);
      dust(c, 370, 499, 10);
    }
    await stroll(c, -200, 1200, 4, 10);
  },
};

// ---------- 恐鶴：張開大嘴「Squawk!」，快快跑過去再跑回來 ----------
// 圖 573×589（臉朝右），腳在 (230, 589)
const terrorBird = {
  id: 'terror-bird', en: 'Terror Bird', zh: '恐鶴', x: 480, y: 970, s: 0.45,
  hint: [280, -300],
  pivots: { body: [230, 589] },
  art: (p) => whole(p, 'terror-bird', 573, 589),
  async act(c) {
    await c.anim(300, { body: { r: -8 } });
    speak('Squawk!', { queue: true });
    for (let i = 0; i < 2; i++) {
      await c.anim(120, { body: { r: -12 } });
      await c.anim(120, { body: { r: -6 } });
    }
    await c.anim(200, { body: { r: 0 } });
    // 跑得很快，一路踢起土
    await c.anim(700, { body: { tx: 300 } }, (t) => { bob(c, 7, 22)(t); if (Math.random() < 0.3) dust(c, 230, 589, 3); });
    c.set('body', { sx: -1 });
    await c.anim(700, { body: { tx: 0 } }, (t) => { bob(c, 7, 22)(t); if (Math.random() < 0.3) dust(c, 230, 589, 3); });
    c.set('body', { sx: 1, ty: 0 });
  },
};

// ---------- 短面熊：用後腳站起來吼一聲，再趴回去 ----------
// 圖 685×584（臉朝右），後腳在 (150, 584)
const shortFacedBear = {
  id: 'short-faced-bear', en: 'Short-faced Bear', zh: '南美短面熊', x: 1000, y: 975, s: 0.45,
  hint: [340, -290],
  pivots: { body: [170, 584] },
  art: (p) => whole(p, 'short-faced-bear', 685, 584),
  async act(c) {
    await c.anim(600, { body: { r: -18 } });
    playSound('brown-bear');
    for (let i = 0; i < 3; i++) {
      await c.anim(180, { body: { r: -21 } });
      await c.anim(180, { body: { r: -16 } });
    }
    await c.anim(400, { body: { r: 0 } }, null, (t) => t * t);
    dust(c, 560, 584, 12);
  },
};

SCENES['sa-plains'] = {
  w: 1600,
  h: 1000,
  bg: () => `
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <text x="56" y="98" font-size="60" font-weight="900" fill="${LINE}">South American Plains</text>
    <text x="58" y="148" font-size="38" font-weight="900" fill="${LINE}" opacity=".7">南美洲草原</text>
  `,
  // 先畫後排（遠的），再畫前排
  items: [macrauchenia, groundSloth, toxodon, glyptodon, terrorBird, shortFacedBear],
};
}
