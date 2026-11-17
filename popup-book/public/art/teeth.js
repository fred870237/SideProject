// 🪥 牙齒和刷牙：浴室裡，男生在刷牙，鏡子裡的女生笑出白白的牙齒；洗手台和地上有牙刷、牙膏、漱口杯、
// 健康的牙齒寶寶，還有牙齒最怕的甜食
// 版面 1600×1000；背景是浴室（art/img/teeth/bg.webp），鏡子中心約 (838, 300)，洗手台檯面 y ≈ 567，地板 y ≈ 960
// 東西都是 AI 生成的圖，整張圖是一個零件 body，點了放大到中間做動作
// 整個檔案包在 { } 裡，變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/teeth/${name}.webp`;
const IMG = (name, w, h) => `<image href="${SRC(name)}" width="${w}" height="${h}"/>`;
const whole = (p, name, w, h, extra = '') => `<g transform="translate(0 ${-h})"><g id="${p}-body">${IMG(name, w, h)}</g>${extra}</g>`;
// 預設轉軸在底部中間（零件座標是圖上的像素）
const item = (id, en, zh, name, w, h, x, y, s, extra) => ({
  id, en, zh, x, y, s, hint: [w / 2, -h / 2], pivots: { body: [w / 2, h] },
  art: (p) => whole(p, name, w, h), ...extra,
});
const sparkle = (c, x, y, n = 6) => c.burst('body', x, y, { n, color: '#fff7a8', vx: [-3, 3], vy: [-4, -1], g: 0.05, size: [7, 13], life: 1000 });
const bubbles = (c, x, y, n = 5) => c.burst('body', x, y, { n, color: '#ffffff', vx: [-2, 2], vy: [-3, -0.5], g: 0.02, size: [8, 16], life: 1100 });

// 刷牙：手上下刷，嘴巴旁邊冒出白白的泡泡
const brushing = item('th-brushing', 'Brush Your Teeth', '刷牙', 'brushing', 415, 920, 130, 965, 0.62, {
  async act(c) {
    speak('Brush brush brush!', { queue: true });
    await c.anim(1800, {}, (t) => {
      c.set('body', { tx: 6 * Math.sin(t * Math.PI * 16), r: 1.5 * Math.sin(t * Math.PI * 16) });
      if (Math.random() < 0.18) bubbles(c, 240, 390, 2);
    }, (t) => t);
    c.set('body', { tx: 0, r: 0 });
    await c.anim(200, { body: { sy: 1.03 } });
    await c.anim(200, { body: { sy: 1 } });
  },
});

// 牙齒：鏡子裡的女生咧嘴笑，牙齒閃閃發亮
const smile = item('th-smile', 'Teeth', '牙齒', 'smile', 884, 801, 723, 404, 0.26, {
  pivots: { body: [442, 400] },
  async act(c) {
    speak('Sparkle sparkle!', { queue: true });
    await c.anim(250, { body: { sx: 1.08, sy: 1.08 } });
    for (let i = 0; i < 3; i++) {
      sparkle(c, 330 + i * 110, 560, 5);
      await c.wait(250);
    }
    await c.anim(250, { body: { sx: 1, sy: 1 } });
  },
});

// 牙刷：在空中刷來刷去，冒泡泡
const toothbrush = item('th-toothbrush', 'Toothbrush', '牙刷', 'toothbrush', 812, 216, 640, 575, 0.27, {
  r: -6,
  pivots: { body: [406, 108] },
  async act(c) {
    await c.anim(1500, {}, (t) => {
      c.set('body', { tx: 60 * Math.sin(t * Math.PI * 8), r: 4 * Math.sin(t * Math.PI * 8) });
      if (Math.random() < 0.2) bubbles(c, 730, 40, 2);
    }, (t) => t);
    c.set('body', { tx: 0, r: 0 });
  },
});

// 牙膏：擠一擠，擠出一條白白的牙膏
const toothpaste = item('th-toothpaste', 'Toothpaste', '牙膏', 'toothpaste', 720, 233, 470, 390, 0.25, {
  pivots: { body: [360, 117], paste: [720, 100] },
  art: (p) => whole(p, 'toothpaste', 720, 233,
    `<g id="${p}-paste" opacity="0"><path d="M720,95 C790,70 850,140 920,100 C960,80 990,110 1000,120" fill="none" stroke="#fff" stroke-width="44" stroke-linecap="round"/>
      <path d="M720,95 C790,70 850,140 920,100 C960,80 990,110 1000,120" fill="none" stroke="#5aa9e6" stroke-width="10" stroke-linecap="round"/></g>`),
  async act(c) {
    speak('Squeeze!', { queue: true });
    await c.anim(250, { body: { sy: 0.8, sx: 1.04 } });
    c.set('paste', { o: 1, sx: 0.05 });
    await c.anim(500, { paste: { sx: 1 }, body: { sy: 1, sx: 1 } });
    await c.wait(800);
    await c.anim(300, { paste: { o: 0 } });
    c.set('paste', { sx: 1 });
  },
});

// 漱口杯：咕嚕咕嚕漱口，水花噴出來
const cup = item('th-cup', 'Cup', '漱口杯', 'cup', 289, 428, 880, 570, 0.22, {
  async act(c) {
    speak('Gargle gargle!', { queue: true });
    for (let i = 0; i < 4; i++) {
      await c.anim(150, { body: { r: 10 } });
      c.burst('body', 145, 10, { n: 5, color: '#8fd3ff', vx: [-2.5, 2.5], vy: [-5, -2], g: 0.2, size: [6, 11] });
      await c.anim(150, { body: { r: -10 } });
    }
    await c.anim(150, { body: { r: 0 } });
  },
});

// 健康的牙齒寶寶：開心地跳起來，亮晶晶
const tooth = item('th-tooth', 'Healthy Tooth', '健康的牙齒', 'tooth', 622, 524, 1120, 965, 0.5, {
  async act(c) {
    speak('Clean and healthy!', { queue: true });
    for (let i = 0; i < 2; i++) {
      await c.anim(120, { body: { sy: 0.88 } });
      await c.anim(380, { body: { sy: 1 } }, (t) => c.set('body', { ty: -160 * Math.sin(t * Math.PI) }));
      c.set('body', { ty: 0 });
      sparkle(c, 311, 80, 8);
    }
  },
});

// 甜食：吃太多會蛀牙！甜食抖一抖，牙齒寶寶嚇一跳
const sweets = item('th-sweets', 'Sweets', '甜食', 'sweets', 604, 495, 1400, 965, 0.33, {
  async act(c) {
    speak('Not too many sweets!', { queue: true });
    for (let i = 0; i < 5; i++) {
      await c.anim(90, { body: { r: 6 } });
      await c.anim(90, { body: { r: -6 } });
    }
    await c.anim(100, { body: { r: 0 } });
  },
});

SCENES['teeth'] = {
  w: 1600,
  h: 1000,
  bg: () => `
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <text x="1260" y="150" text-anchor="middle" font-size="58" font-weight="900" fill="${LINE}">Brushing Teeth</text>
    <text x="1260" y="200" text-anchor="middle" font-size="38" font-weight="900" fill="${LINE}" opacity=".7">牙齒和刷牙</text>
  `,
  items: [smile, toothpaste, toothbrush, cup, brushing, tooth, sweets],
};
}
