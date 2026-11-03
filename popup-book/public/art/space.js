// 🚀 太空：點太空船會唸英文名字，然後像機關書一樣動起來
// 版面 1600×1000；上面是黑色的太空，右上有地球 (1257, 326)；下面是月球表面（中間 y ≈ 610，往兩邊彎到 y ≈ 720）
// 太空船是 AI 生成的圖（art/img/space/*.webp），做法跟工地那一頁一樣（見 construction.js 開頭的說明）
// 在太空裡飄的東西沒有地面：y 是它在場景裡的下緣
// 整個檔案包在 { } 裡，變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/space/${name}.webp`;
const IMG = (name, w, h) => `<image href="${SRC(name)}" width="${w}" height="${h}"/>`;
const DUST = '#c9ccd3';
const decel = (t) => 1 - (1 - t) ** 2;

// 整張圖放在零件 body 裡（圖片座標，左上角是 (0, 0)）；back 畫在圖後面、front 畫在圖前面
const whole = (p, name, w, h, back = '', front = '') =>
  `<g transform="translate(0 ${-h})"><g id="${p}-body">${back}${IMG(name, w, h)}${front}</g></g>`;
// 往下噴的火焰（零件 flame），噴嘴在 (x, y)，長度 len
const flame = (p, x, y, w, len) => `<g id="${p}-flame" opacity="0">` +
  `<path d="M${x - w},${y} C${x - w},${y + len * 0.5} ${x - w * 0.3},${y + len * 0.8} ${x},${y + len} C${x + w * 0.3},${y + len * 0.8} ${x + w},${y + len * 0.5} ${x + w},${y}Z" fill="#ff7a1a"/>` +
  `<path d="M${x - w * 0.55},${y} C${x - w * 0.55},${y + len * 0.4} ${x - w * 0.2},${y + len * 0.55} ${x},${y + len * 0.7} C${x + w * 0.2},${y + len * 0.55} ${x + w * 0.55},${y + len * 0.4} ${x + w * 0.55},${y}Z" fill="#ffe14a"/></g>`;
// 火焰一閃一閃（給 anim 的 onStep 用）
const flicker = (c) => () => c.set('flame', { sy: 0.8 + Math.random() * 0.4 });

// ---------- 火箭：「Three, two, one, blast off!」抖一抖、噴火，一路飛出畫面上面，再噴著火慢慢降落回來 ----------
// 圖 212×654（直立），噴嘴在 (106, 618)
const rocket = {
  id: 'rocket', en: 'Rocket', zh: '火箭', x: 1380, y: 930, s: 0.62,
  hint: [106, -480],
  pivots: { flame: [106, 618] },
  art: (p) => whole(p, 'rocket', 212, 654, flame(p, 106, 612, 34, 190)),
  async act(c) {
    speak('Three, two, one, blast off!', { queue: true });
    await c.wait(1500);
    c.set('flame', { o: 1, sy: 0.3 });
    // 抖一抖、冒煙
    for (let i = 0; i < 8; i++) {
      c.burst('body', 106, 650, { n: 6, color: DUST, vx: [-4, 4], vy: [-1.5, -0.2], g: 0.02, size: [10, 20], life: 1300 });
      await c.anim(90, { body: { tx: i % 2 ? 3 : -3 }, flame: { sy: 0.4 + i * 0.08 } });
    }
    c.set('body', { tx: 0 });
    // 飛出畫面上面：火箭底部 (y 654) 要高過畫面頂端
    const m = document.getElementById('root').getCTM().inverse().multiply(c.el('body').getCTM());
    const up = -m.f / m.d - 654 - 260;
    await c.anim(1800, { body: { ty: up } }, flicker(c), (t) => t * t);
    await c.wait(600);
    // 從上面噴著火慢慢降落
    await c.anim(2400, { body: { ty: 0 } }, flicker(c), decel);
    c.burst('body', 106, 650, { n: 14, color: DUST, vx: [-4, 4], vy: [-1.5, -0.2], g: 0.02, size: [10, 18], life: 1100 });
    await c.anim(300, { flame: { o: 0 } });
  },
};

// ---------- 飛碟：燈一閃一閃、搖一搖，射出黃色光束把月球上的石頭吸上去 ----------
// 圖 738×466，底下的艙口在 (370, 460)；光束和石頭是程式畫的，畫在飛碟後面
const BEAM = 470; // 光束長度：剛好照到月球表面
const saucer = {
  id: 'saucer', en: 'Flying Saucer', zh: '飛碟', x: 140, y: 520, s: 0.42,
  hint: [370, -250],
  pivots: { body: [370, 300] },
  box: [0, -466, 738, 466 + BEAM], // 焦點模式把光束也算進去
  tag: [140 + 369 * 0.42, 520 + 28], // 外框被光束和石頭撐大了，標籤位置自己指定
  art(p) {
    const beam = `<g id="${p}-beam" opacity="0"><path d="M320,450 L420,450 L520,${460 + BEAM} L220,${460 + BEAM}Z" fill="#fff38a" opacity=".55"/></g>` +
      `<g id="${p}-rock"><ellipse cx="370" cy="${460 + BEAM - 18}" rx="34" ry="22" fill="#8d919b"/><ellipse cx="360" cy="${460 + BEAM - 26}" rx="16" ry="9" fill="#a9adb6"/></g>`;
    // 邊緣的一圈小燈：兩組輪流亮
    const lights = [[18, 238], [100, 228], [180, 224], [278, 222], [380, 222], [488, 222], [580, 226], [650, 232], [712, 240]]
      .map(([x, y], i) => `<circle class="${p}-l${i % 2}" cx="${x}" cy="${y}" r="14" fill="#fff6a8" opacity="0"/>`).join('');
    return whole(p, 'saucer', 738, 466, beam, `<g id="${p}-lights">${lights}</g>`);
  },
  setup(c) { c.set('rock', { o: 0 }); },
  async act(c) {
    speak('Beep boop!', { queue: true });
    const lights = (k) => c.el('lights').querySelectorAll(`circle`).forEach((e, i) => e.setAttribute('opacity', i % 2 === k ? 0.9 : 0));
    let k = 0;
    const blink = setInterval(() => lights((k = 1 - k)), 220);
    for (let i = 0; i < 2; i++) {
      await c.anim(300, { body: { r: 6 } });
      await c.anim(300, { body: { r: -6 } });
    }
    await c.anim(300, { body: { r: 0 } });
    // 光束打下來，石頭出現在光束底部，慢慢被吸上去
    c.set('rock', { o: 1, ty: 0, sx: 1, sy: 1 });
    await c.anim(400, { beam: { o: 1 } });
    await c.anim(1800, { rock: { ty: -BEAM + 40 } }, (t) => c.set('rock', { r: t * 200 }));
    await c.anim(300, { rock: { o: 0 } });
    await c.anim(400, { beam: { o: 0 } });
    clearInterval(blink);
    lights(-1);
    c.set('rock', { ty: 0, r: 0 });
  },
};

// ---------- 太空人：「Hello!」揮揮手，背包噴氣，在太空裡慢慢翻一個跟斗 ----------
// 圖 434×523，背包的噴氣口在 (420, 300)
const astronaut = {
  id: 'astronaut', en: 'Astronaut', zh: '太空人', x: 720, y: 520, s: 0.45,
  hint: [230, -330],
  pivots: { body: [217, 262] },
  art: (p) => whole(p, 'astronaut', 434, 523),
  async act(c) {
    speak('Hello!', { queue: true });
    for (let i = 0; i < 3; i++) {
      await c.anim(250, { body: { r: -8 } });
      await c.anim(250, { body: { r: 6 } });
    }
    await c.anim(250, { body: { r: 0 } });
    const puff = setInterval(() => c.burst('body', 420, 300, { n: 2, color: '#ffffff', vx: [1, 2.5], vy: [-0.5, 0.5], g: 0, size: [6, 11], life: 700 }), 90);
    await c.anim(2600, { body: { r: 360 } }, (t) => c.set('body', { ty: -60 * Math.sin(t * Math.PI) }));
    clearInterval(puff);
    c.set('body', { r: 0, ty: 0 });
  },
};

// ---------- 月球車：在月球上一彈一彈地往前開（重力很小），揚起灰塵，再倒回來 ----------
// 圖 765×573（車頭在右）
const rover = {
  id: 'rover', en: 'Moon Rover', zh: '月球車', x: 110, y: 960, s: 0.42,
  hint: [520, -380],
  pivots: { body: [382, 573] },
  art: (p) => whole(p, 'rover', 765, 573),
  async act(c) {
    const hop = (dir) => (t) => {
      const h = Math.abs(Math.sin(t * Math.PI * 3));
      c.set('body', { ty: -50 * h, r: dir * 4 * Math.sin(t * Math.PI * 6) });
      if (h < 0.06) c.burst('body', dir > 0 ? 80 : 700, 570, { n: 3, color: DUST, vx: [-2.5, 2.5], vy: [-1.5, -0.3], g: 0.03, size: [7, 13] });
    };
    await c.anim(2200, { body: { tx: 300 } }, hop(1));
    await c.wait(300);
    await c.anim(2200, { body: { tx: 0 } }, hop(-1));
    c.set('body', { ty: 0, r: 0 });
  },
};

// ---------- 人造衛星：慢慢轉一圈，碟形天線對著地球送出一圈一圈的訊號 ----------
// 圖 653×432，碟形天線在 (175, 45)
const satellite = {
  id: 'satellite', en: 'Satellite', zh: '人造衛星', x: 980, y: 262, s: 0.4,
  hint: [330, -170],
  pivots: { body: [326, 216] },
  art(p) {
    const waves = [0, 1, 2].map((i) => `<g id="${p}-w${i}" opacity="0" data-cx="175" data-cy="45">` +
      '<path d="M215,5 A60,60 0 0 1 235,45" fill="none" stroke="#7fe3ff" stroke-width="10" stroke-linecap="round"/>' +
      '<path d="M135,5 A60,60 0 0 0 115,45" fill="none" stroke="#7fe3ff" stroke-width="10" stroke-linecap="round"/></g>').join('');
    return whole(p, 'satellite', 653, 432, '', waves);
  },
  async act(c) {
    const spin = c.anim(3600, { body: { r: 360 } });
    for (let i = 0; i < 6; i++) {
      const w = `w${i % 3}`;
      c.set(w, { o: 1, sx: 0.6, sy: 0.6 });
      c.anim(900, { [w]: { o: 0, sx: 2.2, sy: 2.2 } });
      await c.wait(500);
    }
    await spin;
    c.set('body', { r: 0 });
  },
};

// ---------- 登月小艇：噴嘴噴火，從月球表面升起來晃一晃，再慢慢降落 ----------
// 圖 722×621（四支腳的腳墊底部 y = 621），噴嘴在 (330, 490)
const LANDER_UP = 260;
const lander = {
  id: 'lander', en: 'Lunar Lander', zh: '登月小艇', x: 600, y: 905, s: 0.45,
  hint: [330, -470],
  pivots: { body: [361, 621], flame: [330, 490] },
  box: [0, -621 - LANDER_UP, 722, 621 + LANDER_UP], // 焦點模式把升高的高度也算進去
  art: (p) => whole(p, 'lander', 722, 621, flame(p, 330, 486, 40, 200)),
  async act(c) {
    c.set('flame', { o: 1 });
    c.burst('body', 330, 615, { n: 16, color: DUST, vx: [-4, 4], vy: [-1.5, -0.3], g: 0.02, size: [9, 16], life: 1100 });
    await c.anim(1600, { body: { ty: -LANDER_UP } }, flicker(c));
    for (let i = 0; i < 2; i++) {
      await c.anim(450, { body: { r: 4, tx: 30 } }, flicker(c));
      await c.anim(450, { body: { r: -4, tx: -30 } }, flicker(c));
    }
    await c.anim(400, { body: { r: 0, tx: 0 } }, flicker(c));
    await c.anim(1800, { body: { ty: 0 } }, flicker(c), decel);
    c.burst('body', 330, 615, { n: 16, color: DUST, vx: [-4, 4], vy: [-1.5, -0.3], g: 0.02, size: [9, 16], life: 1100 });
    await c.anim(300, { flame: { o: 0 } });
  },
};

// ---------- 太空站：兩頭的紅綠燈一閃一閃，慢慢地往前飄再飄回來 ----------
// 圖 853×405，艙段從 (120, 175) 到 (640, 180)
const station = {
  id: 'station', en: 'Space Station', zh: '太空站', x: 470, y: 215, s: 0.4,
  hint: [430, -220],
  pivots: { body: [426, 200] },
  art(p) {
    const light = (id, x, y, color) => `<g id="${p}-${id}" opacity="0"><circle cx="${x}" cy="${y}" r="26" fill="${color}" opacity=".4"/><circle cx="${x}" cy="${y}" r="11" fill="${color}"/></g>`;
    return whole(p, 'station', 853, 405, '', light('red', 122, 178, '#ff4a4a') + light('green', 640, 178, '#5dff7a'));
  },
  async act(c) {
    const drift = c.anim(4000, { body: { tx: 120, r: 6 } }, (t) => c.set('body', { tx: 120 * Math.sin(t * Math.PI), r: 6 * Math.sin(t * Math.PI) }));
    for (let i = 0; i < 6; i++) {
      await c.anim(200, { red: { o: 1 }, green: { o: 0 } });
      await c.wait(150);
      await c.anim(200, { red: { o: 0 }, green: { o: 1 } });
      await c.wait(150);
    }
    await drift;
    c.set('body', { tx: 0, r: 0 });
    await c.anim(200, { red: { o: 0 }, green: { o: 0 } });
  },
};

SCENES.space = {
  w: 1600,
  h: 1000,
  bg: () => `
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <text x="56" y="98" font-size="60" font-weight="900" fill="#ffffff">Space</text>
    <text x="58" y="148" font-size="38" font-weight="900" fill="#ffffff" opacity=".75">太空</text>
  `,
  // 先畫後排（遠的），再畫前排
  items: [station, satellite, saucer, astronaut, rocket, lander, rover],
};
}
