// 🥚 恐龍蛋巢：點恐龍會唸英文名字然後動起來；點巢裡的蛋，蛋會搖一搖、裂開，孵出恐龍寶寶
// 版面 1600×1000；地面在 y ≈ 630 以下，三個空鳥巢畫在背景圖裡（左 x ≈ 515、中 x ≈ 930、右 x ≈ 1268）
// 恐龍、蛋和寶寶都是 AI 生成的圖（art/img/dino-nest/*.webp），在洋紅色背景上生圖（picks 用 {"key": "magenta"}）
// 蛋坐在巢裡：把背景圖的巢前緣裁一塊蓋在蛋上面（nestFront），看起來蛋就在巢裡
// 整個檔案包在 { } 裡，變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/dino-nest/${name}.webp`;
const IMG = (name, w, h, clip) =>
  `<image href="${SRC(name)}" width="${w}" height="${h}"${clip ? ` clip-path="url(#${clip})"` : ''}/>`;
const CLIP = (id, d) => `<clipPath id="${id}"><path d="${d}"/></clipPath>`;
const HOLE = (id, w, h, d) => `<clipPath id="${id}"><path clip-rule="evenodd" d="M0,0H${w}V${h}H0Z${d}"/></clipPath>`;
const SAND = '#e9b872', HEART = '#ff6b6b';

// 整張圖放在零件 body 裡
const whole = (p, name, w, h) =>
  `<g transform="translate(0 ${-h})"><g id="${p}-body">${IMG(name, w, h)}</g></g>`;
// 揚起一點沙
const dust = (c, x, y, n = 6) =>
  c.burst('body', x, y, { n, color: SAND, vx: [-2, 2], vy: [-2.5, -0.5], g: 0.12, size: [5, 10], life: 800 });

// ---------- 會孵出寶寶的蛋 ----------
// 蛋殼在 crack（蛋高的 42%）的地方用鋸齒線切成上下兩半：上半是零件 top，下半留在原地
// 寶寶（零件 baby）藏在下半殼後面，一開始是透明的；孵出來時往上冒出來
// nest：背景圖裡巢的範圍（背景座標）：front 是巢前緣，裁出來蓋在蛋前面；back 是整個巢，畫在蛋後面
// 兩塊都跟著蛋走，放大的時候整個巢會一起帶過來
function hatchEgg({ id, en, zh, egg, w, h, baby, bw, bh, x, y, s, shell, nest, extra }) {
  const piece = (p, part, d) => CLIP(`${p}-${part}`, d) +
    `<g transform="scale(${1 / s}) translate(${-x} ${-y})"><image href="${SRC('bg')}" width="1600" height="1000" clip-path="url(#${p}-${part})"/></g>`;
  const cy = Math.round(h * 0.42), tooth = Math.round(h * 0.05);
  // 鋸齒裂縫：左右多留一點邊，免得蛋的邊緣被切到
  const zig = [];
  for (let i = 0; i <= 8; i++) zig.push([Math.round(-20 + (i * (w + 40)) / 8), cy + (i % 2 ? -tooth : tooth)]);
  const top = 'M-20,-20L' + (w + 20) + ',-20L' + zig.slice().reverse().map((p) => p.join(',')).join('L') + 'Z';
  // 寶寶縮到蛋裡面，腳底貼在蛋高 95% 的地方
  const k = Math.min((0.85 * w) / bw, (0.9 * h) / bh);
  const bx = (w - bw * k) / 2, by = h * 0.95 - bh * k;
  const rise = Math.round(h * 0.38);
  return {
    id, en, zh, x, y, s,
    hint: [w / 2, -h * 0.55],
    // 外框被巢前緣那塊背景圖撐大了，標籤位置自己指定（巢的正下方）
    tag: [x + (w * s) / 2, 872],
    // 放大時要把冒出來的寶寶也算進去
    box: [-0.4 * w, -1.5 * h, 1.8 * w, 1.6 * h],
    pivots: { egg: [w / 2, h], top: [w / 2, cy], baby: [w / 2, h] },
    art: (p) =>
      piece(p, 'nb', nest.back) +
      `<g transform="translate(0 ${-h})"><g id="${p}-egg">` +
        `<g id="${p}-baby" opacity="0"><g transform="translate(${bx.toFixed(1)} ${by.toFixed(1)}) scale(${k.toFixed(4)})">${IMG(baby, bw, bh)}</g></g>` +
        HOLE(`${p}-cb`, w, h, top) + IMG(egg, w, h, `${p}-cb`) +
        CLIP(`${p}-ct`, top) + `<g id="${p}-top">${IMG(egg, w, h, `${p}-ct`)}</g>` +
      `</g></g>` +
      piece(p, 'nf', nest.front),
    async act(c) {
      // 蛋搖一搖
      for (let i = 0; i < 3; i++) {
        await c.anim(110, { egg: { r: -7 } });
        await c.anim(110, { egg: { r: 7 } });
      }
      await c.anim(90, { egg: { r: 0 } });
      speak('Crack!', { queue: true });
      c.burst('egg', w / 2, cy, { n: 12, color: shell, vx: [-4, 4], vy: [-6, -2], g: 0.3, size: [8, 16] });
      // 上半殼飛起來，寶寶冒出來
      c.set('baby', { o: 1 });
      await c.anim(600, { top: { tx: w * 0.5, ty: -h * 0.6, r: 50, o: 0 }, baby: { ty: -rise } }, null, (t) => 1 - (1 - t) ** 2);
      speak('Peep peep!', { queue: true });
      for (let i = 0; i < 2; i++) {
        await c.anim(180, { baby: { ty: -rise - 40, sy: 1.04 } });
        await c.anim(180, { baby: { ty: -rise, sy: 1 } });
      }
      if (extra) await extra(c, rise);
      await c.wait(600);
      // 寶寶縮回蛋裡，蛋殼蓋回去
      await c.anim(500, { baby: { ty: 0, o: 0 } });
      c.set('top', { tx: 0, ty: -h * 0.3, r: 0, o: 0 });
      await c.anim(400, { top: { ty: 0, o: 1 } });
    },
  };
}

// 暴龍寶寶：蛋 440×564、寶寶 489×666；放在左邊的巢
const babyTrex = hatchEgg({
  id: 'baby-trex', en: 'Baby T-Rex', zh: '暴龍寶寶',
  egg: 'egg-a', w: 440, h: 564, baby: 'baby-trex', bw: 489, bh: 666,
  x: 449, y: 790, s: 0.3, shell: '#f3e7c4',
  nest: {
    front: 'M388,738A127,20 0 0 0 642,738L646,790Q622,836 515,839Q408,836 384,790Z',
    back: 'M388,738A127,34 0 0 1 642,738L646,790Q622,836 515,839Q408,836 384,790Z',
  },
  // 小小聲吼一下：頭抬高、身體一抖一抖
  async extra(c, rise) {
    speak('Roar!', { queue: true });
    await c.anim(200, { baby: { sx: 1.1, sy: 1.1 } });
    for (let i = 0; i < 3; i++) {
      await c.anim(70, { baby: { r: -3 } });
      await c.anim(70, { baby: { r: 3 } });
    }
    await c.anim(200, { baby: { sx: 1, sy: 1, r: 0 } });
  },
});

// 三角龍寶寶：蛋 426×535、寶寶 561×676；放在中間的巢
const babyTriceratops = hatchEgg({
  id: 'baby-triceratops', en: 'Baby Triceratops', zh: '三角龍寶寶',
  egg: 'egg-c', w: 426, h: 535, baby: 'baby-triceratops', bw: 561, bh: 676,
  x: 872, y: 800, s: 0.27, shell: '#f7dc6f',
  nest: {
    front: 'M838,764A92,12 0 0 0 1022,764L1027,810Q1010,846 930,848Q850,846 833,810Z',
    back: 'M838,764A92,20 0 0 1 1022,764L1027,810Q1010,846 930,848Q850,846 833,810Z',
  },
  // 搖搖頭
  async extra(c) {
    for (let i = 0; i < 2; i++) {
      await c.anim(160, { baby: { r: -10 } });
      await c.anim(160, { baby: { r: 10 } });
    }
    await c.anim(120, { baby: { r: 0 } });
  },
});

// 腕龍寶寶：蛋 421×576、寶寶 417×705；放在右邊的巢
const babyBrachiosaurus = hatchEgg({
  id: 'baby-brachiosaurus', en: 'Baby Brachiosaurus', zh: '腕龍寶寶',
  egg: 'egg-b', w: 421, h: 576, baby: 'baby-brachiosaurus', bw: 417, bh: 705,
  x: 1205, y: 790, s: 0.3, shell: '#cfe8cf',
  nest: {
    front: 'M1138,740A131,18 0 0 0 1400,740L1406,795Q1380,839 1268,841Q1156,839 1131,795Z',
    back: 'M1138,740A131,36 0 0 1 1400,740L1406,795Q1380,839 1268,841Q1156,839 1131,795Z',
  },
  // 脖子伸長長，往上看
  async extra(c, rise) {
    await c.anim(400, { baby: { sy: 1.2, ty: -rise - 20 } });
    await c.wait(300);
    await c.anim(400, { baby: { sy: 1, ty: -rise } });
  },
});

// ---------- 慈母龍：走到巢邊，低頭聞聞蛋，冒出愛心 ----------
// 圖 902×427（臉朝右），嘴巴在 (890, 120)，前腳在 (640, 427)
const maiasaura = {
  id: 'maiasaura', en: 'Maiasaura', zh: '慈母龍', x: 20, y: 720, s: 0.42,
  hint: [560, -220],
  pivots: { body: [640, 427] },
  art: (p) => whole(p, 'maiasaura', 902, 427),
  async act(c) {
    const step = (t) => c.set('body', { ty: -10 * Math.abs(Math.sin(t * Math.PI * 4)) });
    await c.anim(1000, { body: { tx: 70 } }, step);
    // 低頭
    await c.anim(500, { body: { r: 12, ty: 0 } });
    for (let i = 0; i < 3; i++) {
      c.burst('body', 860, 80, { n: 3, color: HEART, vx: [-0.8, 0.8], vy: [-2.5, -1.5], g: -0.02, size: [7, 12], life: 1200 });
      await c.anim(200, { body: { r: 9 } });
      await c.anim(200, { body: { r: 12 } });
    }
    await c.anim(500, { body: { r: 0 } });
    c.set('body', { sx: -1 });
    await c.anim(1000, { body: { tx: 0 } }, step);
    c.set('body', { sx: 1, ty: 0 });
  },
};

// ---------- 偷蛋龍：跳兩下，「Squawk!」叫一聲，羽毛飛起來 ----------
// 圖 680×621（臉朝右），站在右邊的巢旁邊
const oviraptor = {
  id: 'oviraptor', en: 'Oviraptor', zh: '偷蛋龍', x: 1390, y: 800, s: 0.3,
  hint: [380, -330],
  pivots: { body: [400, 621] },
  art: (p) => whole(p, 'oviraptor', 680, 621),
  async act(c) {
    for (let i = 0; i < 2; i++) {
      await c.anim(120, { body: { sy: 0.9 } });
      await c.anim(300, { body: { sy: 1.05, ty: -120 } }, null, (t) => 1 - (1 - t) ** 2);
      await c.anim(300, { body: { sy: 1, ty: 0 } }, null, (t) => t * t);
      dust(c, 400, 621);
    }
    speak('Squawk!', { queue: true });
    await c.anim(250, { body: { r: -10 } });
    c.burst('body', 500, 330, { n: 10, color: '#4fb3d9', vx: [-3, 3], vy: [-4, -1], g: 0.08, size: [7, 12], life: 1200 });
    c.burst('body', 500, 330, { n: 6, color: '#ffb347', vx: [-3, 3], vy: [-4, -1], g: 0.08, size: [7, 12], life: 1200 });
    for (let i = 0; i < 2; i++) {
      await c.anim(120, { body: { r: -6 } });
      await c.anim(120, { body: { r: -12 } });
    }
    await c.anim(400, { body: { r: 0 } });
  },
};

// ---------- 原角龍：往前走，低頭用嘴挖挖沙，再走回來 ----------
// 圖 804×518（臉朝右），嘴巴在 (790, 330)，前腳在 (640, 518)
const protoceratops = {
  id: 'protoceratops', en: 'Protoceratops', zh: '原角龍', x: 60, y: 975, s: 0.4,
  hint: [430, -260],
  pivots: { body: [640, 518] },
  art: (p) => whole(p, 'protoceratops', 804, 518),
  async act(c) {
    const step = (t) => c.set('body', { ty: -12 * Math.abs(Math.sin(t * Math.PI * 4)) });
    speak('Stomp stomp!', { queue: true });
    await c.anim(800, { body: { tx: 120 } }, step);
    await c.anim(350, { body: { r: 14, ty: 0 } });
    for (let i = 0; i < 3; i++) {
      dust(c, 790, 480, 5);
      await c.anim(160, { body: { r: 18 } });
      await c.anim(160, { body: { r: 12 } });
    }
    await c.anim(350, { body: { r: 0 } });
    c.set('body', { sx: -1 });
    await c.anim(1000, { body: { tx: 0 } }, step);
    c.set('body', { sx: 1, ty: 0 });
  },
};

// ---------- 美頜龍：小小一隻，咻地跑過去又跑回來 ----------
// 圖 720×431（臉朝右，跑步的樣子），在後面的沙地上
// focus: false：在原地跑，才看得出牠跑多遠
const compsognathus = {
  id: 'compsognathus', en: 'Compsognathus', zh: '美頜龍', x: 640, y: 690, s: 0.2,
  hint: [380, -220], focus: false,
  pivots: { body: [360, 431] },
  art: (p) => whole(p, 'compsognathus', 720, 431),
  async act(c) {
    const run = (t) => c.set('body', { ty: -40 * Math.abs(Math.sin(t * Math.PI * 8)) });
    await c.anim(900, { body: { tx: 2000 } }, run, (t) => t);
    dust(c, 100, 431, 8);
    c.set('body', { sx: -1 });
    await c.anim(900, { body: { tx: -400 } }, run, (t) => t);
    c.set('body', { sx: 1 });
    await c.anim(600, { body: { tx: 0 } }, run, (t) => t);
    c.set('body', { ty: 0 });
  },
};

SCENES['dino-nest'] = {
  w: 1600,
  h: 1000,
  bg: () => `
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <text x="56" y="98" font-size="60" font-weight="900" fill="${LINE}">Dino Nest</text>
    <text x="58" y="148" font-size="38" font-weight="900" fill="${LINE}" opacity=".7">恐龍蛋巢</text>
  `,
  // 先畫後排（遠的），再畫前排
  items: [compsognathus, maiasaura, babyTrex, babyTriceratops, babyBrachiosaurus, oviraptor, protoceratops],
};
}
