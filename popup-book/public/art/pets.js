// 🐶 寵物：點動物會唸英文名字、播真的叫聲（比熊犬和柴犬共用狗叫聲、貓），然後像機關書一樣動起來
// 版面 1600×1000；客廳：左邊紅沙發（坐墊頂 y ≈ 478），中間上面是窗戶和窗簾桿（y ≈ 92），
// 右邊是小桌子（桌面 y ≈ 412），下面是木地板（y ≈ 560 以下）和一張藍色圓地毯
// 動物是 AI 生成的圖（art/img/pets/*.webp）；倉鼠的滾輪、金魚缸、烏龜吃的菜葉是 SVG 畫的（平塗、沒有外框）
// 叫聲是 Pixabay 的音效（audio/sound/，來源見那裡的 CREDITS.md）：狗叫的原檔很長，只剪了 2 秒
// 整個檔案包在 { } 裡，變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/pets/${name}.webp`;
const IMG = (name, w, h) => `<image href="${SRC(name)}" width="${w}" height="${h}"/>`;
const WATER = '#9fdcf5', FLOOR = '#f6c99a';

// 整張圖放在零件 body 裡
const whole = (p, name, w, h) =>
  `<g transform="translate(0 ${-h})"><g id="${p}-body">${IMG(name, w, h)}</g></g>`;
// 跳一下：ty 走一個拱形，落地壓扁一下；spin 是空中轉幾度
async function hop(c, h, ms, tx, spin = 0) {
  await c.anim(150, { body: { sy: 0.9 } });
  await c.anim(ms, { body: { sy: 1, ...(tx === undefined ? {} : { tx }) } }, (t) =>
    c.set('body', { ty: -h * Math.sin(t * Math.PI), r: spin * Math.sin(t * Math.PI) }));
  c.set('body', { ty: 0, r: 0 });
  await c.anim(100, { body: { sy: 0.92 } });
  await c.anim(130, { body: { sy: 1 } });
}

// ---------- 狗狗（柴犬＋比熊犬一組）：一起「汪汪！」歪頭，比熊跳兩下，
// 柴犬暴衝出去、比熊在後面追，一起跑回來，最後比熊追自己的尾巴轉圈、柴犬開心地扭一扭 ----------
// 柴犬圖 622×556（臉朝右），腳在 (330, 550)，零件 shiba
// 比熊犬圖 595×527（臉朝右），腳在 (280, 520)，縮成柴犬的 0.6 倍站在柴犬右前方，零件 bichon
// 比熊的零件座標是自己圖上的像素，所以要跟柴犬跑一樣遠，tx 要除以 0.6
// 白色的毛在淺色地板上加一圈淡淡的外光（#pets-edge）
const BK = 0.6;
const dogs = {
  id: 'dogs', en: 'Shiba Inu and Bichon Frise', zh: '柴犬和比熊犬', x: 40, y: 905, s: 0.42,
  hint: [500, -300],
  pivots: { shiba: [330, 550], bichon: [280, 520] },
  box: [-100, -800, 1800, 900],
  art: (p) => `
    <g transform="translate(0 -556)"><g id="${p}-shiba">${IMG('shiba', 622, 556)}</g></g>
    <g transform="translate(520 ${40 - 527 * BK}) scale(${BK})"><g id="${p}-bichon">
      <image href="${SRC('bichon')}" width="595" height="527" filter="url(#pets-edge)"/></g></g>`,
  async act(c) {
    playSound('dog');
    // 一起歪頭（往不同邊）
    await c.anim(300, { shiba: { r: -10 }, bichon: { r: 10 } });
    await c.wait(300);
    await c.anim(300, { shiba: { r: 8 }, bichon: { r: -8 } });
    await c.wait(300);
    await c.anim(200, { shiba: { r: 0 }, bichon: { r: 0 } });
    // 比熊跳兩下
    for (let i = 0; i < 2; i++) {
      await c.anim(120, { bichon: { sy: 0.88 } });
      await c.anim(350, { bichon: { sy: 1 } }, (t) => c.set('bichon', { ty: -200 * Math.sin(t * Math.PI) }));
      c.set('bichon', { ty: 0 });
    }
    // 暴衝：柴犬先衝出去，比熊晚一點跟上；轉身再一起跑回來
    const dash = (from, to) => c.anim(900, {}, (t) => {
      const a = Math.min(1, t / 0.8), b = Math.max(0, (t - 0.2) / 0.8);
      c.set('shiba', { tx: from + (to - from) * a, ty: -30 * Math.abs(Math.sin(a * Math.PI * 7)), r: a < 1 ? -6 : 0 });
      c.set('bichon', { tx: (from + (to - from) * b) / BK, ty: -40 * Math.abs(Math.sin(b * Math.PI * 9)), r: b > 0 && b < 1 ? -6 : 0 });
    }, (t) => t);
    const turn = (dir) => c.anim(300, {}, (t) => {
      const sx = dir * Math.cos(t * Math.PI);
      c.set('shiba', { ty: -120 * Math.sin(t * Math.PI), sx, r: 0 });
      c.set('bichon', { ty: -160 * Math.sin(t * Math.PI), sx, r: 0 });
    });
    await dash(0, 650);
    await turn(1);
    await dash(650, 0);
    await turn(-1);
    c.set('shiba', { sx: 1, ty: 0, r: 0 });
    c.set('bichon', { sx: 1, ty: 0, r: 0 });
    // 比熊追尾巴：在原地跑兩圈小圓圈（側面看是一個橢圓：前面往右跑、繞到後面變小一點往左跑），
    // 頭一直朝跑的方向、身體往圓心歪；柴犬在旁邊開心地扭
    await c.anim(1800, {}, (t) => {
      const a = t * Math.PI * 4;
      const face = Math.max(-1, Math.min(1, Math.cos(a) * 4)); // 轉身很快，不會一直是扁扁的
      const depth = 0.88 + 0.12 * Math.cos(a); // 繞到後面時小一點
      c.set('bichon', {
        tx: 220 * Math.sin(a),
        ty: -70 * (1 - Math.cos(a)) / 2 - 25 * Math.abs(Math.sin(a * 3)),
        sx: face * depth, sy: depth,
        r: 12 * Math.cos(a),
      });
      c.set('shiba', { r: 3 * Math.sin(t * Math.PI * 10) });
      if (Math.random() < 0.15) c.burst('bichon', 280, 520, { n: 2, color: '#e8d2b8', vx: [-2, 2], vy: [-2, -0.5], g: 0.05, size: [8, 14] });
    }, (t) => t);
    c.set('bichon', { tx: 0, ty: 0, sx: 1, sy: 1, r: 0 });
    c.set('shiba', { r: 0 });
    // 轉暈了，晃一晃
    for (let i = 0; i < 2; i++) {
      await c.anim(200, { bichon: { r: 10 } });
      await c.anim(200, { bichon: { r: -10 } });
    }
    await c.anim(150, { bichon: { r: 0 } });
  },
};

// ---------- 貓：「喵～」伸個大懶腰，扭扭屁股撲到沙發扶手上，再走回來 ----------
// 圖 582×639（臉朝右），腳在 (300, 630)；站在沙發坐墊上
const cat = {
  id: 'cat', en: 'Cat', zh: '貓', x: 300, y: 480, s: 0.28,
  hint: [330, -400],
  pivots: { body: [300, 630] },
  box: [-100, -1100, 1400, 1150],
  art: (p) => whole(p, 'cat', 582, 639),
  async act(c) {
    playSound('cat');
    // 伸懶腰：拉長壓低，再恢復
    await c.anim(600, { body: { sx: 1.15, sy: 0.82 } });
    await c.wait(400);
    await c.anim(300, { body: { sx: 1, sy: 1 } });
    // 扭屁股準備撲
    for (let i = 0; i < 3; i++) {
      await c.anim(120, { body: { r: -4, sy: 0.92 } });
      await c.anim(120, { body: { r: 4, sy: 0.92 } });
    }
    await c.anim(100, { body: { r: 0 } });
    await c.anim(800, { body: { sy: 1, tx: 650 } }, (t) =>
      c.set('body', { ty: -380 * Math.sin(t * Math.PI), r: -15 * Math.cos(t * Math.PI) }));
    c.set('body', { ty: 0, r: 0 });
    await c.anim(100, { body: { sy: 0.9 } });
    await c.anim(150, { body: { sy: 1 } });
    await c.wait(300);
    // 轉身輕輕走回來
    c.set('body', { sx: -1 });
    await c.anim(1300, { body: { tx: 0 } }, (t) => c.set('body', { ty: -8 * Math.abs(Math.sin(t * Math.PI * 6)) }));
    c.set('body', { sx: 1, ty: 0 });
  },
};

// ---------- 鸚鵡（虎皮鸚鵡）：「Tweet tweet!」在窗簾桿上點點頭，飛一圈再回來 ----------
// 圖 572×633（臉朝右），腳在 (330, 375)；站在窗簾桿上
const budgie = {
  id: 'budgie', en: 'Budgie', zh: '虎皮鸚鵡', x: 427, y: 149, s: 0.22,
  hint: [330, -420],
  pivots: { body: [330, 375] },
  box: [-1400, -900, 2300, 2100],
  art: (p) => whole(p, 'budgie', 572, 633),
  async act(c) {
    speak('Tweet tweet!', { queue: true });
    for (let i = 0; i < 3; i++) {
      await c.anim(160, { body: { r: 12 } });
      await c.anim(160, { body: { r: -4 } });
    }
    await c.anim(200, { body: { r: 0, sy: 0.9 } });
    // 往左下繞一圈飛回來，用身體上下抖表現拍翅膀
    c.set('body', { sx: -1 });
    await c.anim(2600, { body: { sy: 1 } }, (t) => {
      const a = t * Math.PI * 2;
      c.set('body', {
        tx: -900 * Math.sin(a / 2) - 250 * Math.sin(a),
        ty: 800 * Math.sin(a / 2) + 25 * Math.sin(t * Math.PI * 30),
        sx: t < 0.5 ? -1 : 1,
        r: 10 * Math.sin(a),
      });
    });
    c.set('body', { tx: 0, ty: 0, sx: 1, r: 0 });
  },
};

// ---------- 倉鼠：「Squeak squeak!」在滾輪裡跑跑跑，停下來頭暈晃一晃 ----------
// 圖 496×542（臉朝右），腳在 (250, 535)；滾輪中心 (248, -470)、半徑 420，倉鼠站在滾輪底部內側（y = -50）
const WHEEL_SPOKES = Array.from({ length: 8 }, (_, i) => {
  const a = (i * Math.PI) / 4;
  return `<line x1="248" y1="-470" x2="${248 + 410 * Math.cos(a)}" y2="${-470 + 410 * Math.sin(a)}"/>`;
}).join('');
const hamster = {
  id: 'hamster', en: 'Hamster', zh: '倉鼠', x: 720, y: 680, s: 0.22,
  hint: [250, -300],
  pivots: { body: [250, 535], wheel: [248, -470] },
  box: [-250, -950, 1000, 1000],
  art: (p) => `
    <polygon points="248,-470 40,0 120,0 248,-380 376,0 456,0" fill="#e07a5f"/>
    <g id="${p}-wheel">
      <circle cx="248" cy="-470" r="420" fill="#c9ecfa" opacity=".45"/>
      <g stroke="#7fbfe0" stroke-width="12">${WHEEL_SPOKES}</g>
      <circle cx="248" cy="-470" r="420" fill="none" stroke="#5aa9d6" stroke-width="30"/>
      <circle cx="248" cy="-470" r="38" fill="#5aa9d6"/>
    </g>
    <g transform="translate(0 ${-50 - 542})"><g id="${p}-body">${IMG('hamster', 496, 542)}</g></g>`,
  async act(c) {
    speak('Squeak squeak!', { queue: true });
    // 跑：滾輪往後轉，倉鼠上下彈
    await c.anim(2800, { wheel: { r: -1440 } }, (t) => c.set('body', {
      ty: -18 * Math.abs(Math.sin(t * Math.PI * 22)), r: 6 * Math.sin(t * Math.PI * 22),
    }), (t) => t);
    c.set('wheel', { r: 0 });
    c.set('body', { ty: 0, r: 0 });
    // 頭暈
    for (let i = 0; i < 3; i++) {
      await c.anim(220, { body: { r: 10 } });
      await c.anim(220, { body: { r: -10 } });
    }
    await c.anim(200, { body: { r: 0 } });
  },
};

// ---------- 金魚：「Blub blub!」在魚缸裡游來游去，吐泡泡 ----------
// 圖 664×429（臉朝右），中心 (332, 215)；魚缸是 SVG 畫的，中心 (332, -520)、半徑 520，放在桌面上
const goldfish = {
  id: 'goldfish', en: 'Goldfish', zh: '金魚', x: 1384, y: 412, s: 0.14,
  hint: [332, -520],
  pivots: { body: [332, 215] },
  box: [-250, -1150, 1164, 1200],
  art: (p) => `
    <ellipse cx="332" cy="-10" rx="300" ry="40" fill="#d9a066" opacity=".6"/>
    <circle cx="332" cy="-520" r="520" fill="${WATER}" opacity=".6"/>
    <ellipse cx="332" cy="-60" rx="330" ry="60" fill="#f2b84b"/>
    <g transform="translate(0 ${-520 - 215})"><g id="${p}-body">${IMG('goldfish', 664, 429)}</g></g>
    <ellipse cx="332" cy="-960" rx="300" ry="50" fill="#e6f7ff" opacity=".9"/>
    <path d="M 70 -760 A 400 400 0 0 1 200 -900" fill="none" stroke="#ffffff" stroke-width="30" stroke-linecap="round" opacity=".8"/>`,
  async act(c) {
    speak('Blub blub!', { queue: true });
    const swim = (tx, ms) => c.anim(ms, { body: { tx } }, (t) => c.set('body', { ty: -40 * Math.sin(t * Math.PI * 2), r: 5 * Math.sin(t * Math.PI * 6) }));
    const bubbles = () => c.burst('body', 650, 180, { n: 5, color: '#ffffff', vx: [-0.5, 0.5], vy: [-3, -1.5], g: -0.02, size: [6, 12] });
    bubbles();
    await swim(120, 700);
    c.set('body', { sx: -1 });
    await swim(-160, 1300);
    bubbles();
    c.set('body', { sx: 1 });
    await swim(0, 700);
    bubbles();
    c.set('body', { ty: 0, r: 0 });
  },
};

// ---------- 天竺鼠：「Wheek wheek!」開心地原地蹦蹦跳（爆米花跳） ----------
// 圖 628×533（臉朝右），腳在 (310, 525)
const guineapig = {
  id: 'guineapig', en: 'Guinea Pig', zh: '天竺鼠', x: 880, y: 860, s: 0.3,
  hint: [300, -300],
  pivots: { body: [310, 525] },
  box: [-100, -900, 900, 950],
  art: (p) => whole(p, 'guineapig', 628, 533),
  async act(c) {
    speak('Wheek wheek!', { queue: true });
    await hop(c, 220, 380, undefined, 18);
    await hop(c, 260, 400, undefined, -18);
    await hop(c, 200, 360, undefined, 12);
    // 鼻子嗅嗅
    for (let i = 0; i < 3; i++) {
      await c.anim(100, { body: { r: 3 } });
      await c.anim(100, { body: { r: 0 } });
    }
  },
};

// ---------- 烏龜：慢慢爬到菜葉前面，「Munch munch!」一口一口吃掉，再慢慢爬回來 ----------
// 圖 677×460（臉朝右），腳在 (340, 450)，頭在 (640, 120)
const tortoise = {
  id: 'tortoise', en: 'Tortoise', zh: '烏龜', x: 1130, y: 915, s: 0.33,
  hint: [330, -300],
  pivots: { body: [340, 450], leaf: [940, -10] },
  box: [-100, -700, 1250, 750],
  art: (p) => `
    <g id="${p}-leaf">
      <ellipse cx="940" cy="-60" rx="80" ry="55" fill="#7cc94b"/>
      <ellipse cx="960" cy="-50" rx="50" ry="35" fill="#9bdc63"/>
      <path d="M 870 -40 Q 940 -70 1010 -80" fill="none" stroke="#5fa83a" stroke-width="8"/>
    </g>` + whole(p, 'tortoise', 677, 460),
  async act(c) {
    const crawl = (tx, ms) => c.anim(ms, { body: { tx } }, (t) => c.set('body', { ty: -6 * Math.abs(Math.sin(t * Math.PI * 6)), r: 2 * Math.sin(t * Math.PI * 6) }));
    await crawl(220, 1800);
    c.set('body', { ty: 0, r: 0 });
    speak('Munch munch!', { queue: true });
    for (let i = 1; i <= 4; i++) {
      await c.anim(150, { body: { r: 5 } });
      c.burst('leaf', 900, -60, { n: 4, color: '#7cc94b', vx: [-2, 2], vy: [-3, -1], g: 0.15, size: [5, 9] });
      c.set('leaf', { sx: 1 - i * 0.24, sy: 1 - i * 0.24 });
      await c.anim(150, { body: { r: 0 } });
    }
    c.set('leaf', { o: 0 });
    await c.wait(300);
    // 吃飽了，轉身慢慢爬回來；菜葉再長回來
    c.set('body', { sx: -1 });
    await crawl(0, 1800);
    c.set('body', { sx: 1, ty: 0, r: 0 });
    c.set('leaf', { sx: 1, sy: 1 });
    await c.anim(400, { leaf: { o: 1 } });
  },
};

SCENES['pets'] = {
  w: 1600,
  h: 1000,
  bg: () => `
    <defs><filter id="pets-edge" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#b08a6a" flood-opacity=".6"/>
    </filter></defs>
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <text x="720" y="110" font-size="60" font-weight="900" fill="${LINE}">Pets</text>
    <text x="722" y="160" font-size="38" font-weight="900" fill="${LINE}" opacity=".7">寵物</text>
  `,
  // 先畫後排（遠的），再畫前排
  items: [budgie, cat, goldfish, hamster, guineapig, tortoise, dogs],
};
}
