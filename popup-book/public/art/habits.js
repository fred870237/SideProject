// 🛁 好習慣：剖開來的房子，左邊是晚上的臥室、右邊是白天的廚房；
// 男生上廁所、睡覺（蓋住背景裡的床）、運動，女生喝水、洗手、吃青菜
// 版面 1600×1000；背景 art/img/habits/bg.webp，地板 y ≈ 950
// 人都是 AI 生成的圖，整張圖是一個零件 body，點了放大到中間做動作；睡覺冒出來的 Z 是 SVG 文字
// 整個檔案包在 { } 裡，變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/habits/${name}.webp`;
const IMG = (name, w, h) => `<image href="${SRC(name)}" width="${w}" height="${h}"/>`;
const whole = (p, name, w, h, extra = '') => `<g transform="translate(0 ${-h})"><g id="${p}-body">${IMG(name, w, h)}</g>${extra}</g>`;
// 轉軸在腳底中間（零件座標是圖上的像素）
const item = (id, en, zh, name, w, h, x, y, s, extra) => ({
  id, en, zh, x, y, s, hint: [w / 2, -h * 0.55], pivots: { body: [w / 2, h] },
  art: (p) => whole(p, name, w, h), ...extra,
});
const FLOOR = 950;

// 睡覺：呼吸起伏，頭上飄出 Z Z Z
const ZS = [[0, 0, 70], [70, -90, 90], [150, -200, 110]];
const sleep = item('hb-sleep', 'Sleep', '睡覺', 'sleep', 738, 712, 190, FLOOR + 10, 0.62, {
  pivots: { body: [369, 712], z0: [520, 180], z1: [590, 90], z2: [670, -20] },
  art: (p) => whole(p, 'sleep', 738, 712, ZS.map(([dx, dy, fs], i) =>
    `<text id="${p}-z${i}" x="${520 + dx}" y="${180 + dy}" font-size="${fs}" font-weight="900" fill="#7c8cff" opacity="0">Z</text>`).join('')),
  async act(c) {
    speak('Good night!', { queue: true });
    for (let k = 0; k < 2; k++) {
      for (let i = 0; i < 3; i++) {
        c.set(`z${i}`, { o: 0, ty: 30 });
        c.anim(500, { [`z${i}`]: { o: 1, ty: 0 } });
        await c.anim(400, { body: { sy: i % 2 ? 1 : 1.02 } });
      }
      await c.wait(300);
      await c.anim(400, { z0: { o: 0 }, z1: { o: 0 }, z2: { o: 0 }, body: { sy: 1 } });
    }
  },
});

// 上廁所：按一下沖水，水花轉一轉
const toilet = item('hb-toilet', 'Use the Toilet', '上廁所', 'toilet', 618, 732, 10, FLOOR, 0.42, {
  async act(c) {
    speak('Flush!', { queue: true });
    await c.anim(200, { body: { r: -2 } });
    await c.anim(1200, {}, (t) => {
      c.set('body', { tx: 3 * Math.sin(t * Math.PI * 20), r: 0 });
      if (Math.random() < 0.35) c.burst('body', 180, 330, { n: 2, color: '#8fd3ff', vx: [-3, 3], vy: [-4, -1], g: 0.15, size: [6, 12] });
    }, (t) => t);
    c.set('body', { tx: 0 });
    speak('Now wash your hands!', { queue: true });
  },
});

// 運動：開合跳，跳三下
const exercise = item('hb-exercise', 'Exercise', '運動', 'exercise', 635, 703, 650, FLOOR - 40, 0.42, {
  async act(c) {
    speak('Jump, jump, jump!', { queue: true });
    for (let i = 0; i < 3; i++) {
      await c.anim(120, { body: { sy: 0.88, sx: 1.05 } });
      await c.anim(420, { body: { sy: 1, sx: 1 } }, (t) => c.set('body', { ty: -150 * Math.sin(t * Math.PI) }));
      c.set('body', { ty: 0 });
    }
    await c.anim(120, { body: { sy: 0.92 } });
    await c.anim(150, { body: { sy: 1 } });
  },
});

// 喝水：仰頭咕嚕咕嚕
const water = item('hb-water', 'Drink Water', '喝水', 'water', 435, 862, 965, FLOOR, 0.45, {
  async act(c) {
    speak('Gulp gulp!', { queue: true });
    await c.anim(300, { body: { r: -6 } });
    for (let i = 0; i < 3; i++) {
      await c.anim(200, { body: { sy: 1.03 } });
      await c.anim(200, { body: { sy: 1 } });
    }
    await c.anim(300, { body: { r: 0 } });
    speak('Ahh!', { queue: true });
  },
});

// 洗手：搓搓搓，冒出好多泡泡
const wash = item('hb-wash', 'Wash Your Hands', '洗手', 'wash', 555, 885, 1140, FLOOR, 0.45, {
  async act(c) {
    speak('Scrub scrub!', { queue: true });
    await c.anim(1800, {}, (t) => {
      c.set('body', { tx: 5 * Math.sin(t * Math.PI * 18), r: 1.2 * Math.sin(t * Math.PI * 18) });
      if (Math.random() < 0.3) c.burst('body', 410, 520, { n: 2, color: '#ffffff', vx: [-2, 2], vy: [-3, -1], g: 0.01, size: [9, 18], life: 1300 });
    }, (t) => t);
    c.set('body', { tx: 0, r: 0 });
  },
});

// 吃青菜：咬一口，嚼一嚼
const veggies = item('hb-veggies', 'Eat Vegetables', '吃青菜', 'veggies', 540, 858, 1345, FLOOR, 0.45, {
  async act(c) {
    speak('Munch munch!', { queue: true });
    for (let i = 0; i < 5; i++) {
      await c.anim(140, { body: { sy: 1.025, r: 1.5 } });
      await c.anim(140, { body: { sy: 1, r: 0 } });
    }
    speak('Yummy!', { queue: true });
    await c.anim(150, { body: { ty: -20 } });
    await c.anim(150, { body: { ty: 0 } });
  },
});

SCENES['habits'] = {
  w: 1600,
  h: 1000,
  bg: () => `
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <text x="800" y="70" text-anchor="middle" font-size="56" font-weight="900" fill="${LINE}">Good Habits</text>
    <text x="800" y="116" text-anchor="middle" font-size="36" font-weight="900" fill="${LINE}" opacity=".7">好習慣</text>
  `,
  items: [sleep, toilet, exercise, water, wash, veggies],
};
}
