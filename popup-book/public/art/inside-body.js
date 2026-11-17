// 🫀 身體裡面：醫生診間的牆上有一塊大白板，大腦、心臟、肺、胃、腸子、肌肉和骨頭笑咪咪地排在一起
// 版面 1600×1000；白板大約在 x 350～990、y 230～610，地板 y ≈ 950
// 器官都是 AI 生成的圖（art/img/inside-body/*.webp），整張圖是一個零件 body，點了會放大到中間做動作
// 整個檔案包在 { } 裡，變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/inside-body/${name}.webp`;
const IMG = (name, w, h) => `<image href="${SRC(name)}" width="${w}" height="${h}"/>`;
// 整張圖放在零件 body 裡，底部中間 = 地面 0
const whole = (p, name, w, h) => `<g transform="translate(0 ${-h})"><g id="${p}-body">${IMG(name, w, h)}</g></g>`;
const item = (id, en, zh, name, w, h, x, y, s, extra) => ({
  id, en, zh, x, y, s, hint: [w / 2, -h / 2], pivots: { body: [w / 2, h / 2] }, // 零件座標是圖上的像素
  art: (p) => whole(p, name, w, h), ...extra,
});
// 撲通撲通：快速變大兩下，停一下
async function beat(c, k, n) {
  for (let i = 0; i < n; i++) {
    await c.anim(110, { body: { sx: k, sy: k } });
    await c.anim(110, { body: { sx: 1, sy: 1 } });
    await c.anim(110, { body: { sx: k * 0.97, sy: k * 0.97 } });
    await c.anim(160, { body: { sx: 1, sy: 1 } });
    await c.wait(180);
  }
}

// 大腦：想到好點子了！亮起來、冒出黃色的小星星
const brain = item('in-brain', 'Brain', '大腦', 'brain', 413, 391, 400, 480, 0.6, {
  async act(c) {
    speak('I have an idea!', { queue: true });
    for (let i = 0; i < 2; i++) {
      await c.anim(250, { body: { r: -6 } });
      await c.anim(250, { body: { r: 6 } });
    }
    await c.anim(200, { body: { r: 0, sx: 1.12, sy: 1.12 } });
    for (let i = 0; i < 3; i++) {
      c.burst('body', 206, 30, { n: 8, color: '#ffd23f', vx: [-4, 4], vy: [-5, -1], g: 0.08, size: [8, 14], life: 1100 });
      await c.wait(250);
    }
    await c.anim(300, { body: { sx: 1, sy: 1 } });
  },
});

// 心臟：撲通、撲通
const heart = item('in-heart', 'Heart', '心臟', 'heart', 556, 741, 680, 540, 0.4, {
  async act(c) {
    speak('Ba-dum, ba-dum!', { queue: true });
    await beat(c, 1.15, 4);
  },
});

// 肺：深深吸一口氣（變大），再慢慢吐出來
const lungs = item('in-lungs', 'Lungs', '肺', 'lungs', 570, 642, 950, 540, 0.45, {
  async act(c) {
    speak('Breathe in, breathe out.', { queue: true });
    for (let i = 0; i < 2; i++) {
      await c.anim(1000, { body: { sx: 1.16, sy: 1.1 } });
      await c.wait(200);
      await c.anim(1000, { body: { sx: 1, sy: 1 } }, (t) => {
        if (Math.random() < 0.2) c.burst('body', 285, 20, { n: 1, color: '#d9f1ff', vx: [-0.6, 0.6], vy: [-2.5, -1], g: -0.01, size: [8, 14] });
      });
    }
  },
});

// 胃：咕嚕咕嚕，扭來扭去
const stomach = item('in-stomach', 'Stomach', '胃', 'stomach', 554, 569, 550, 900, 0.45, {
  async act(c) {
    speak('Rumble rumble!', { queue: true });
    for (let i = 0; i < 4; i++) {
      await c.anim(170, { body: { r: 8, sx: 1.08, sy: 0.94 } });
      await c.anim(170, { body: { r: -8, sx: 0.94, sy: 1.08 } });
    }
    await c.anim(200, { body: { r: 0, sx: 1, sy: 1 } });
  },
});

// 腸子：把食物擠過去，一下扁一下高
const intestines = item('in-intestines', 'Intestines', '腸子', 'intestines', 602, 650, 840, 920, 0.45, {
  async act(c) {
    speak('Squish squish!', { queue: true });
    for (let i = 0; i < 4; i++) {
      await c.anim(220, { body: { sx: 1.12, sy: 0.9 } });
      await c.anim(220, { body: { sx: 0.92, sy: 1.1 } });
    }
    await c.anim(200, { body: { sx: 1, sy: 1 } });
  },
});

// 肌肉：用力！手臂一直鼓起來
const muscle = item('in-muscle', 'Muscle', '肌肉', 'muscle', 387, 483, 1170, 900, 0.55, {
  async act(c) {
    speak('So strong!', { queue: true });
    for (let i = 0; i < 3; i++) {
      await c.anim(200, { body: { sx: 1.18, sy: 1.12, r: -5 } });
      c.burst('body', 260, 60, { n: 5, color: '#ffd23f', vx: [-3, 3], vy: [-4, -1], g: 0.1, size: [6, 11] });
      await c.anim(250, { body: { sx: 1, sy: 1, r: 0 } });
    }
  },
});

// 骨頭（骷髏）：喀啦喀啦跳舞
const skeleton = {
  ...item('in-skeleton', 'Skeleton', '骨頭', 'skeleton', 442, 753, 40, 950, 0.8),
  pivots: { body: [221, 753] }, // 腳底
  async act(c) {
    speak('Rattle rattle!', { queue: true });
    for (let i = 0; i < 3; i++) {
      await c.anim(150, { body: { sy: 0.92 } });
      await c.anim(350, { body: { sy: 1 } }, (t) => c.set('body', { ty: -120 * Math.sin(t * Math.PI), r: (i % 2 ? 10 : -10) * Math.sin(t * Math.PI) }));
      c.set('body', { ty: 0, r: 0 });
    }
    for (let i = 0; i < 3; i++) {
      await c.anim(160, { body: { sx: -1 } });
      await c.anim(160, { body: { sx: 1 } });
    }
  },
};

SCENES['inside-body'] = {
  w: 1600,
  h: 1000,
  bg: () => `
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <text x="1290" y="140" text-anchor="middle" font-size="58" font-weight="900" fill="${LINE}">Inside My Body</text>
    <text x="1290" y="190" text-anchor="middle" font-size="38" font-weight="900" fill="${LINE}" opacity=".7">身體裡面</text>
  `,
  items: [brain, heart, lungs, skeleton, stomach, intestines, muscle],
};
}
