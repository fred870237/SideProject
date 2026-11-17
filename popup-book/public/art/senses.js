// 👀 五種感覺：在公園裡，女生和男生用眼睛看、耳朵聽、鼻子聞、舌頭嚐、手摸
// 版面 1600×1000；背景是公園（art/img/senses/bg.webp），草地從 y ≈ 600 開始
// 後排（遠的、小一點）：看、聽；前排：聞、嚐、摸
// 人都是 AI 生成的圖，整張圖是一個零件 body，點了放大到中間做動作；聽到的聲波是 SVG 畫的
// 整個檔案包在 { } 裡，變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/senses/${name}.webp`;
const IMG = (name, w, h) => `<image href="${SRC(name)}" width="${w}" height="${h}"/>`;
const whole = (p, name, w, h, extra = '') => `<g transform="translate(0 ${-h})">${extra}<g id="${p}-body">${IMG(name, w, h)}</g></g>`;
// 腳底中間當轉軸（零件座標是圖上的像素）
const item = (id, en, zh, name, w, h, x, y, s, extra) => ({
  id, en, zh, x, y, s, hint: [w / 2, -h * 0.55], pivots: { body: [w / 2, h] },
  art: (p) => whole(p, name, w, h), ...extra,
});
const sway = async (c, a, n, ms = 260) => {
  for (let i = 0; i < n; i++) {
    await c.anim(ms, { body: { r: a } });
    await c.anim(ms, { body: { r: -a } });
  }
  await c.anim(ms / 2, { body: { r: 0 } });
};

// 看：拿著望遠鏡左看看、右看看
const see = item('se-see', 'See', '看', 'see', 465, 869, 360, 700, 0.5, {
  async act(c) {
    speak('I can see you!', { queue: true });
    await sway(c, 7, 2, 400);
    for (let i = 0; i < 2; i++) {
      await c.anim(150, { body: { ty: -20 } });
      await c.anim(150, { body: { ty: 0 } });
    }
  },
});

// 聽：手放在耳朵旁邊，旁邊冒出一圈一圈的聲波，小鳥在唱歌
const WAVES = [50, 95, 140].map((r) => `<path d="M${30 - r * 0.2},${290 - r} A${r},${r} 0 0,0 ${30 - r * 0.2},${290 + r}"/>`).join('');
const hear = {
  ...item('se-hear', 'Hear', '聽', 'hear', 473, 931, 880, 700, 0.5),
  pivots: { body: [236, 931], waves: [30, 290] },
  art: (p) => whole(p, 'hear', 473, 931,
    `<g id="${p}-waves" opacity="0" fill="none" stroke="#ff8a5c" stroke-width="16" stroke-linecap="round">${WAVES}</g>`),
  async act(c) {
    speak('Tweet tweet!', { queue: true });
    for (let i = 0; i < 3; i++) {
      c.set('waves', { o: 0, sx: 0.6, sy: 0.6 });
      await c.anim(350, { waves: { o: 1, sx: 1, sy: 1 }, body: { r: -4 } });
      await c.anim(350, { waves: { o: 0, sx: 1.3, sy: 1.3 }, body: { r: 0 } });
    }
  },
};

// 聞：閉著眼睛聞向日葵，好香！冒出黃色的花粉
const smell = item('se-smell', 'Smell', '聞', 'smell', 463, 879, 60, 965, 0.62, {
  async act(c) {
    speak('Sniff sniff!', { queue: true });
    for (let i = 0; i < 3; i++) {
      await c.anim(150, { body: { sy: 1.03 } });
      await c.anim(150, { body: { sy: 1 } });
    }
    speak('Mmm, it smells nice!', { queue: true });
    for (let i = 0; i < 3; i++) {
      c.burst('body', 260, 250, { n: 6, color: '#ffd23f', vx: [-2.5, 2.5], vy: [-3, -1], g: 0.03, size: [6, 11], life: 1200 });
      await c.anim(300, { body: { r: 4 } });
      await c.anim(300, { body: { r: -4 } });
    }
    await c.anim(200, { body: { r: 0 } });
  },
});

// 嚐：舔冰淇淋，好好吃！
const taste = item('se-taste', 'Taste', '嚐', 'taste', 403, 909, 610, 965, 0.62, {
  async act(c) {
    speak('Yum yum!', { queue: true });
    for (let i = 0; i < 4; i++) {
      await c.anim(160, { body: { ty: -14, sy: 1.02 } });
      await c.anim(160, { body: { ty: 0, sy: 1 } });
    }
    await sway(c, 5, 2);
  },
});

// 摸：輕輕摸小貓，小貓喵喵叫，冒出粉紅色的小泡泡
const touch = item('se-touch', 'Touch', '摸', 'touch', 651, 818, 1120, 965, 0.62, {
  async act(c) {
    playSound('cat');
    speak('So soft!', { queue: true });
    for (let i = 0; i < 4; i++) {
      c.burst('body', 150, 450, { n: 3, color: '#ff8fa3', vx: [-1.5, 1.5], vy: [-3, -1.2], g: 0.01, size: [8, 13], life: 1100 });
      await c.anim(220, { body: { r: 2, sx: 1.02 } });
      await c.anim(220, { body: { r: -2, sx: 1 } });
    }
    await c.anim(200, { body: { r: 0 } });
  },
});

SCENES['senses'] = {
  w: 1600,
  h: 1000,
  bg: () => `
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <text x="800" y="96" text-anchor="middle" font-size="60" font-weight="900" fill="${LINE}">My Five Senses</text>
    <text x="800" y="146" text-anchor="middle" font-size="38" font-weight="900" fill="${LINE}" opacity=".7">五種感覺</text>
  `,
  items: [see, hear, smell, taste, touch],
};
}
