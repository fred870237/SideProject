// 🦘 遠古澳洲（史前動物書）：點冰河時期澳洲的巨大動物會唸英文名字，然後動起來
// 版面 1600×1000；地平線在 y ≈ 640，下面是紅色的沙地，中間有一個小水塘（y ≈ 660～690），遠方是紅色的大石山
// 動物是 AI 生成的圖（art/img/ancient-australia/*.webp），在洋紅色背景上生圖（picks 用 {"key": "magenta"}）
// 叫聲：袋獅借用動物書的獅子叫聲（audio/sound/），其他用預先錄好的英文音效
// 整個檔案包在 { } 裡，變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/ancient-australia/${name}.webp`;
const DUST = '#e8794a', DUST2 = '#c9562e', GRASS = '#d9b648';

const whole = (p, name, w, h) =>
  `<g transform="translate(0 ${-h})"><g id="${p}-body"><image href="${SRC(name)}" width="${w}" height="${h}"/></g></g>`;
// 踢起一點紅土
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

// ---------- 雙門齒獸（像河馬那麼大的袋熊）：低頭嚼草，再搖搖擺擺走一段 ----------
// 圖 790×522（臉朝右），腳在 (400, 522)
const diprotodon = {
  id: 'diprotodon', en: 'Diprotodon', zh: '雙門齒獸', x: 380, y: 790, s: 0.45,
  hint: [400, -260],
  pivots: { body: [400, 522] },
  art: (p) => whole(p, 'diprotodon', 790, 522),
  async act(c) {
    await c.anim(400, { body: { r: 6 } });
    speak('Munch munch!', { queue: true });
    for (let i = 0; i < 3; i++) {
      c.burst('body', 760, 470, { n: 4, color: GRASS, vx: [-1, 1.5], vy: [-2, -0.5], g: 0.12, size: [5, 10], life: 700 });
      await c.anim(200, { body: { r: 8 } });
      await c.anim(200, { body: { r: 5 } });
    }
    await c.anim(300, { body: { r: 0 } });
    await stroll(c, 180, 1400, 4, 8);
  },
};

// ---------- 巨型短面袋鼠：用大大的後腳跳兩下再跳回來 ----------
// 圖 726×675（臉朝右），後腳在 (330, 675)
const giantKangaroo = {
  id: 'giant-kangaroo', en: 'Giant Kangaroo', zh: '巨型袋鼠', x: 40, y: 960, s: 0.5,
  hint: [430, -330],
  pivots: { body: [330, 675] },
  art: (p) => whole(p, 'giant-kangaroo', 726, 675),
  async act(c) {
    speak('Wheee!', { queue: true });
    for (const [dir, n] of [[1, 2], [-1, 2]]) {
      if (dir < 0) c.set('body', { sx: -1 });
      for (let i = 0; i < n; i++) {
        await c.anim(120, { body: { sy: 0.9 } });
        const from = c.get('body').tx;
        await c.anim(500, { body: { sy: 1, tx: from + dir * 150 } }, (t) => c.set('body', { ty: -170 * Math.sin(t * Math.PI), r: -10 * dir * Math.sin(t * Math.PI) }));
        dust(c, 330, 675, 8);
      }
    }
    c.set('body', { sx: 1, ty: 0, r: 0, tx: 0 });
  },
};

// ---------- 袋獅：壓低身體吼一聲，往前撲 ----------
// 圖 749×554（臉朝右），後腳在 (150, 554)
const marsupialLion = {
  id: 'marsupial-lion', en: 'Marsupial Lion', zh: '袋獅', x: 560, y: 975, s: 0.42,
  hint: [370, -270],
  pivots: { body: [370, 554] },
  art: (p) => whole(p, 'marsupial-lion', 749, 554),
  async act(c) {
    await c.anim(400, { body: { sy: 0.88, r: 4 } });
    playSound('lion');
    for (let i = 0; i < 3; i++) {
      await c.anim(90, { body: { tx: -4 } });
      await c.anim(90, { body: { tx: 4 } });
    }
    await c.anim(500, { body: { sy: 1, tx: 160, r: -6 } }, (t) => c.set('body', { ty: -140 * Math.sin(t * Math.PI) }));
    dust(c, 370, 554, 12);
    await c.anim(200, { body: { r: 0 } });
    c.set('body', { sx: -1 });
    await c.anim(1000, { body: { tx: 0 } }, bob(c, 4, 10));
    c.set('body', { sx: 1, ty: 0 });
  },
};

// ---------- 古巨蜥：吐吐舌頭聞一聞，扭著身體往前爬 ----------
// 圖 844×326（臉朝右），腳在 (420, 326)
const megalania = {
  id: 'megalania', en: 'Megalania', zh: '古巨蜥', x: 1000, y: 975, s: 0.45,
  hint: [420, -160],
  pivots: { body: [420, 326] },
  art: (p) => whole(p, 'megalania', 844, 326),
  async act(c) {
    speak('Sniff sniff!', { queue: true });
    for (let i = 0; i < 2; i++) {
      await c.anim(150, { body: { r: -3 } });
      await c.anim(150, { body: { r: 0 } });
    }
    const wiggle = (t) => c.set('body', { r: 3 * Math.sin(t * Math.PI * 8) });
    c.set('body', { sx: -1 });
    await c.anim(1300, { body: { tx: -200 } }, wiggle);
    c.set('body', { sx: 1 });
    await c.anim(1300, { body: { tx: 0 } }, wiggle);
    c.set('body', { r: 0 });
  },
};

// ---------- 牛頓巨鳥：低頭啄一啄地上的東西，再大步走 ----------
// 圖 638×639（臉朝右），腳在 (300, 639)
const genyornis = {
  id: 'genyornis', en: 'Genyornis', zh: '牛頓巨鳥', x: 1080, y: 760, s: 0.42,
  hint: [320, -320],
  pivots: { body: [300, 639] },
  art: (p) => whole(p, 'genyornis', 638, 639),
  async act(c) {
    for (let i = 0; i < 3; i++) {
      await c.anim(160, { body: { r: 22 } });
      c.burst('body', 600, 620, { n: 3, color: DUST, vx: [-1.5, 1.5], vy: [-2, -0.5], g: 0.12, size: [5, 9], life: 600 });
      await c.anim(160, { body: { r: 0 } });
    }
    speak('Stomp stomp!', { queue: true });
    await stroll(c, -220, 1000, 5, 14);
  },
};

SCENES['ancient-australia'] = {
  w: 1600,
  h: 1000,
  bg: () => `
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <text x="56" y="98" font-size="60" font-weight="900" fill="${LINE}">Ancient Australia</text>
    <text x="58" y="148" font-size="38" font-weight="900" fill="${LINE}" opacity=".7">遠古澳洲</text>
  `,
  // 先畫後排（遠的），再畫前排
  items: [diprotodon, genyornis, giantKangaroo, marsupialLion, megalania],
};
}
