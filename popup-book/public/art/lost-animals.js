// 🐦 消失的動物（史前動物書）：最近幾百年才消失的動物，點了會唸英文名字，然後動起來
// 版面 1600×1000；左邊是長滿樹的小山，右邊遠方是海（y ≈ 580～680），下面一大片綠色的草地
// 動物是 AI 生成的圖（art/img/lost-animals/*.webp），在洋紅色背景上生圖（picks 用 {"key": "magenta"}）
// 有臺灣的雲豹；旅鴿的圖連著一小段樹枝（AI 畫的），飛起來時樹枝留在原地
// 叫聲都用預先錄好的英文音效（Squawk! 之類），沒有借真的動物叫聲
// 整個檔案包在 { } 裡，變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/lost-animals/${name}.webp`;
const IMG = (name, w, h, clip) =>
  `<image href="${SRC(name)}" width="${w}" height="${h}"${clip ? ` clip-path="url(#${clip})"` : ''}/>`;
const DUST = '#c8e09a', DUST2 = '#9cc46a', WATER = '#bfe6ff', FEATHER = '#cfd6e2';

const whole = (p, name, w, h) =>
  `<g transform="translate(0 ${-h})"><g id="${p}-body">${IMG(name, w, h)}</g></g>`;
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

// ---------- 渡渡鳥：搖搖擺擺地走，叫一聲 ----------
// 圖 661×658（臉朝右），腳在 (420, 658)
const dodo = {
  id: 'dodo', en: 'Dodo', zh: '渡渡鳥', x: 40, y: 975, s: 0.38,
  hint: [330, -330],
  pivots: { body: [420, 658] },
  art: (p) => whole(p, 'dodo', 661, 658),
  async act(c) {
    speak('Squawk!', { queue: true });
    await c.anim(200, { body: { r: -8 } });
    await c.anim(200, { body: { r: 0 } });
    const waddle = (t) => c.set('body', { r: 7 * Math.sin(t * Math.PI * 8), ty: -8 * Math.abs(Math.sin(t * Math.PI * 8)) });
    await c.anim(1400, { body: { tx: 200 } }, waddle);
    c.set('body', { sx: -1 });
    await c.anim(1400, { body: { tx: 0 } }, waddle);
    c.set('body', { sx: 1, r: 0, ty: 0 });
  },
};

// ---------- 袋狼（塔斯馬尼亞虎）：張開大嘴打一個超大的哈欠，再小跑一段 ----------
// 圖 672×515（臉朝右），後腳在 (150, 515)
const thylacine = {
  id: 'thylacine', en: 'Thylacine', zh: '袋狼', x: 480, y: 975, s: 0.45,
  hint: [340, -260],
  pivots: { body: [200, 515] },
  art: (p) => whole(p, 'thylacine', 672, 515),
  async act(c) {
    speak('Yawn!', { queue: true });
    await c.anim(700, { body: { r: -10, sy: 1.04 } });
    await c.wait(500);
    await c.anim(400, { body: { r: 0, sy: 1 } });
    await stroll(c, 220, 1000, 5, 12);
  },
};

// ---------- 恐鳥（比大人還高的鳥）：大步大步地走 ----------
// 圖 543×645（臉朝右），腳在 (200, 645)
const moa = {
  id: 'moa', en: 'Moa', zh: '恐鳥', x: 160, y: 760, s: 0.55,
  hint: [270, -320],
  pivots: { body: [200, 645] },
  art: (p) => whole(p, 'moa', 543, 645),
  async act(c) {
    speak('Stomp stomp!', { queue: true });
    for (let i = 0; i < 2; i++) {
      await c.anim(200, { body: { ty: -16 } });
      await c.anim(150, { body: { ty: 0 } }, null, (t) => t * t);
      dust(c, 200, 645, 8);
    }
    await stroll(c, 260, 1300, 4, 16);
  },
};

// ---------- 旅鴿：從樹枝上飛起來繞一圈，再飛回來 ----------
// 圖 603×567（臉朝右），樹枝在下面 (y 470～567)：樹枝留在原地，鳥飛走
const PIGEON_BRANCH = 'M0,470H603V567H0Z';
const passengerPigeon = {
  id: 'passenger-pigeon', en: 'Passenger Pigeon', zh: '旅鴿', x: 760, y: 770, s: 0.32,
  hint: [300, -300],
  // 在原本的位置飛一大圈（放大到中間的話會飛出畫面）
  focus: false,
  pivots: { body: [300, 300] },
  art: (p) => `<g transform="translate(0 -567)">` +
    `<clipPath id="${p}-cbr"><path d="${PIGEON_BRANCH}"/></clipPath>${IMG('passenger-pigeon', 603, 567, `${p}-cbr`)}` +
    `<clipPath id="${p}-cbd"><path clip-rule="evenodd" d="M0,0H603V567H0Z${PIGEON_BRANCH}"/></clipPath>` +
    `<g id="${p}-body">${IMG('passenger-pigeon', 603, 567, `${p}-cbd`)}</g>` +
  '</g>',
  async act(c) {
    speak('Tweet tweet!', { queue: true });
    await c.anim(150, { body: { sy: 0.9 } });
    c.burst('body', 300, 300, { n: 6, color: FEATHER, vx: [-2, 2], vy: [-2, 0], g: 0.05, size: [5, 9], life: 900 });
    // 繞一個大圈飛回來，一邊飛一邊拍翅膀（上下壓扁一點）
    await c.anim(2600, { body: { sy: 1 } }, (t) => c.set('body', {
      tx: 700 * Math.sin(t * Math.PI * 2),
      ty: -500 * Math.sin(t * Math.PI),
      sx: t < 0.25 || t > 0.75 ? 1 : -1,
      sy: 1 - 0.15 * Math.abs(Math.sin(t * Math.PI * 16)),
      r: -10 * Math.sin(t * Math.PI),
    }));
    c.set('body', { tx: 0, ty: 0, sx: 1, sy: 1, r: 0 });
  },
};

// ---------- 大海雀：跳一跳，撲通跳進海裡再跳上來 ----------
// 圖 521×560（臉朝右），腳在 (250, 560)；牠站在右邊的海邊
// focus: false：在原本的位置跳，才會真的跳進後面的海裡
const greatAuk = {
  id: 'great-auk', en: 'Great Auk', zh: '大海雀', x: 1250, y: 720, s: 0.32,
  hint: [260, -280], focus: false,
  pivots: { body: [250, 560] },
  art: (p) => whole(p, 'great-auk', 521, 560),
  async act(c) {
    for (let i = 0; i < 2; i++) {
      await c.anim(200, { body: { ty: -40 } });
      await c.anim(150, { body: { ty: 0 } }, null, (t) => t * t);
    }
    await c.anim(700, { body: { tx: 160, r: 40 } }, (t) => c.set('body', { ty: -180 * Math.sin(t * Math.PI) - 60 * t, o: t > 0.9 ? 1 - (t - 0.9) * 10 : 1 }));
    speak('Splash!', { queue: true });
    c.burst('body', 250, 560, { n: 14, color: WATER, vx: [-3, 3], vy: [-6, -2], g: 0.3, size: [6, 12] });
    c.burst('body', 250, 560, { n: 8, color: '#ffffff', vx: [-3, 3], vy: [-5, -2], g: 0.3, size: [6, 11] });
    await c.wait(700);
    c.set('body', { tx: 0, ty: 0, r: 0, o: 0 });
    await c.anim(500, { body: { o: 1 } });
  },
};

// ---------- 臺灣雲豹：壓低身體，輕巧地往前一跳，再走回來 ----------
// 圖 747×437（臉朝右），後腳在 (150, 437)
const cloudedLeopard = {
  id: 'clouded-leopard', en: 'Clouded Leopard', zh: '臺灣雲豹', x: 1000, y: 975, s: 0.45,
  hint: [370, -220],
  pivots: { body: [370, 437] },
  art: (p) => whole(p, 'clouded-leopard', 747, 437),
  async act(c) {
    await c.anim(400, { body: { sy: 0.88, r: 4 } });
    for (let i = 0; i < 3; i++) {
      await c.anim(90, { body: { tx: -4 } });
      await c.anim(90, { body: { tx: 4 } });
    }
    await c.anim(600, { body: { sy: 1, tx: 200, r: -8 } }, (t) => c.set('body', { ty: -200 * Math.sin(t * Math.PI) }));
    dust(c, 370, 437, 10);
    await c.anim(200, { body: { r: 0 } });
    c.set('body', { sx: -1 });
    await c.anim(1100, { body: { tx: 0 } }, bob(c, 4, 10));
    c.set('body', { sx: 1, ty: 0 });
  },
};

SCENES['lost-animals'] = {
  w: 1600,
  h: 1000,
  bg: () => `
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <text x="56" y="98" font-size="60" font-weight="900" fill="${LINE}">Lost Animals</text>
    <text x="58" y="148" font-size="38" font-weight="900" fill="${LINE}" opacity=".7">消失的動物</text>
  `,
  // 先畫後排（遠的），再畫前排
  items: [moa, greatAuk, passengerPigeon, dodo, thylacine, cloudedLeopard],
};
}
