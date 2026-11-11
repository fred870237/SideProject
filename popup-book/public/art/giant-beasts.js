// 🦏 遠古巨獸（史前動物書）：點恐龍滅絕以後出現的巨大哺乳動物會唸英文名字，然後動起來
// 版面 1600×1000；地平線在 y ≈ 700，下面是一大片草地，遠方是山坡，右邊有大樹
// 動物是 AI 生成的圖（art/img/giant-beasts/*.webp），在洋紅色背景上生圖（picks 用 {"key": "magenta"}）
// 巨犀和恐象只用文字生成一定會畫成現代的犀牛和大象，所以先用 tools/ai-art/sketch_beasts.py 畫輪廓草圖，再讓 AI 照草圖重畫
// 叫聲：恐象借用大象、巨豬獸借用豬、巨猿借用黑猩猩（audio/sound/），其他用預先錄好的英文音效
// 整個檔案包在 { } 裡，變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/giant-beasts/${name}.webp`;
const DUST = '#d9c98a', DUST2 = '#b8a466', LEAF = '#8bc34a';

const whole = (p, name, w, h) =>
  `<g transform="translate(0 ${-h})"><g id="${p}-body"><image href="${SRC(name)}" width="${w}" height="${h}"/></g></g>`;
const dust = (c, x, y, n = 8) => {
  c.burst('body', x, y, { n, color: DUST, vx: [-2.5, 2.5], vy: [-3, -0.5], g: 0.12, size: [6, 12], life: 800 });
  c.burst('body', x, y, { n: Math.ceil(n / 2), color: DUST2, vx: [-2, 2], vy: [-3, -0.5], g: 0.12, size: [5, 10], life: 800 });
};
const bob = (c, n, amp) => (t) => c.set('body', { ty: -amp * Math.abs(Math.sin(t * Math.PI * n)) });
async function stroll(c, dx, ms, n, amp) {
  if (dx < 0) c.set('body', { sx: -1 });
  await c.anim(ms, { body: { tx: dx } }, bob(c, n, amp));
  c.set('body', { sx: dx < 0 ? 1 : -1 });
  await c.anim(ms, { body: { tx: 0 } }, bob(c, n, amp));
  c.set('body', { sx: 1, ty: 0 });
}

// ---------- 巨犀（最大的陸地哺乳動物）：伸長脖子吃高高的樹葉，再慢慢走 ----------
// 圖 767×645（臉朝右），頭在 (700, 90)，後腳在 (250, 645)
const paraceratherium = {
  id: 'paraceratherium', en: 'Paraceratherium', zh: '巨犀', x: 60, y: 790, s: 0.6,
  hint: [380, -330],
  pivots: { body: [250, 645] },
  art: (p) => whole(p, 'paraceratherium', 767, 645),
  async act(c) {
    await c.anim(700, { body: { sy: 1.1, r: -4 } });
    speak('Munch munch!', { queue: true });
    for (let i = 0; i < 3; i++) {
      c.burst('body', 740, 40, { n: 5, color: LEAF, vx: [-2, 2], vy: [-2, 0], g: 0.12, size: [7, 13], life: 1000 });
      await c.anim(250, { body: { r: -6 } });
      await c.anim(250, { body: { r: -3 } });
    }
    await c.anim(600, { body: { sy: 1, r: 0 } });
    await stroll(c, 160, 1600, 4, 8);
  },
};

// ---------- 恐象：象牙往下彎，用象牙挖土，再抬頭叫一聲 ----------
// 圖 713×523（臉朝右），象牙尖在 (600, 500)，後腳在(200, 523)
const deinotherium = {
  id: 'deinotherium', en: 'Deinotherium', zh: '恐象', x: 560, y: 780, s: 0.48,
  hint: [360, -260],
  pivots: { body: [250, 523] },
  art: (p) => whole(p, 'deinotherium', 713, 523),
  async act(c) {
    for (let i = 0; i < 3; i++) {
      await c.anim(250, { body: { r: 7 } });
      dust(c, 640, 520, 10);
      await c.anim(250, { body: { r: 1 } });
    }
    await c.anim(500, { body: { r: -8 } });
    playSound('elephant');
    await c.wait(1200);
    await c.anim(400, { body: { r: 0 } });
    speak('Stomp stomp!', { queue: true });
    for (let i = 0; i < 2; i++) {
      await c.anim(200, { body: { ty: -20 } });
      await c.anim(150, { body: { ty: 0 } }, null, (t) => t * t);
      dust(c, 360, 523, 10);
    }
  },
};

// ---------- 爪獸：用後腳站起來，用長長的前爪拉樹枝吃葉子 ----------
// 圖 681×472（臉朝右），後腳在 (150, 472)
const chalicotherium = {
  id: 'chalicotherium', en: 'Chalicotherium', zh: '爪獸', x: 1130, y: 770, s: 0.42,
  hint: [340, -240],
  pivots: { body: [170, 472] },
  art: (p) => whole(p, 'chalicotherium', 681, 472),
  async act(c) {
    await c.anim(700, { body: { r: -28 } });
    speak('Munch munch!', { queue: true });
    for (let i = 0; i < 3; i++) {
      c.burst('body', 640, 20, { n: 5, color: LEAF, vx: [-2, 2], vy: [-2, 0], g: 0.12, size: [7, 13], life: 1000 });
      await c.anim(250, { body: { r: -31 } });
      await c.anim(250, { body: { r: -26 } });
    }
    await c.anim(500, { body: { r: 0 } }, null, (t) => t * t);
    dust(c, 520, 472, 10);
  },
};

// ---------- 巨豬獸：哼哼叫，低頭往前衝，再走回來 ----------
// 圖 720×528（臉朝右），鼻子在 (700, 320)
const entelodon = {
  id: 'entelodon', en: 'Entelodon', zh: '巨豬獸', x: 120, y: 975, s: 0.4,
  hint: [360, -260],
  pivots: { body: [360, 528] },
  art: (p) => whole(p, 'entelodon', 720, 528),
  async act(c) {
    playSound('pig');
    for (let i = 0; i < 2; i++) {
      await c.anim(150, { body: { r: 6 } });
      dust(c, 640, 528, 4);
      await c.anim(150, { body: { r: 0 } });
    }
    await c.anim(400, { body: { tx: -30 } });
    await c.anim(500, { body: { tx: 200, r: 4 } }, (t) => { if (Math.random() < 0.4) dust(c, 300, 528, 3); }, (t) => t * t);
    dust(c, 640, 528, 12);
    await c.anim(200, { body: { r: 0 } });
    c.set('body', { sx: -1 });
    await c.anim(1100, { body: { tx: 0 } }, bob(c, 4, 10));
    c.set('body', { sx: 1, ty: 0 });
  },
};

// ---------- 巨猿（最大的猿）：站起來搥搥胸口，再坐回去 ----------
// 圖 605×658（臉朝右），後腳在 (200, 658)
const gigantopithecus = {
  id: 'gigantopithecus', en: 'Gigantopithecus', zh: '巨猿', x: 560, y: 975, s: 0.45,
  hint: [300, -330],
  pivots: { body: [220, 658] },
  art: (p) => whole(p, 'gigantopithecus', 605, 658),
  async act(c) {
    await c.anim(600, { body: { r: -14, sy: 1.06 } });
    playSound('chimpanzee');
    for (let i = 0; i < 4; i++) {
      await c.anim(110, { body: { sx: 1.05, tx: -6 } });
      await c.anim(110, { body: { sx: 1, tx: 0 } });
    }
    await c.anim(500, { body: { r: 0, sy: 1 } }, null, (t) => t * t);
    dust(c, 420, 658, 10);
    await c.anim(150, { body: { sy: 0.94 } });
    await c.anim(150, { body: { sy: 1 } });
  },
};

// ---------- 安氏中獸：張開長長的大嘴「Chomp chomp!」，往前撲 ----------
// 圖 716×505（臉朝右），嘴巴在 (690, 120)，後腳在 (130, 505)
const andrewsarchus = {
  id: 'andrewsarchus', en: 'Andrewsarchus', zh: '安氏中獸', x: 1050, y: 975, s: 0.42,
  hint: [360, -250],
  pivots: { body: [360, 505] },
  art: (p) => whole(p, 'andrewsarchus', 716, 505),
  async act(c) {
    await c.anim(400, { body: { sy: 0.9, r: 4 } });
    speak('Chomp chomp!', { queue: true });
    await c.anim(500, { body: { sy: 1, tx: -170, r: 0 } }, (t) => { c.set('body', { sx: -1, ty: -120 * Math.sin(t * Math.PI) }); });
    dust(c, 360, 505, 12);
    for (let i = 0; i < 2; i++) {
      await c.anim(120, { body: { r: -5 } });
      await c.anim(120, { body: { r: 0 } });
    }
    c.set('body', { sx: 1 });
    await c.anim(1000, { body: { tx: 0 } }, bob(c, 4, 10));
    c.set('body', { ty: 0 });
  },
};

SCENES['giant-beasts'] = {
  w: 1600,
  h: 1000,
  bg: () => `
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <text x="56" y="98" font-size="60" font-weight="900" fill="${LINE}">Giant Beasts</text>
    <text x="58" y="148" font-size="38" font-weight="900" fill="${LINE}" opacity=".7">遠古巨獸</text>
  `,
  // 先畫後排（遠的），再畫前排
  items: [paraceratherium, deinotherium, chalicotherium, entelodon, gigantopithecus, andrewsarchus],
};
}
