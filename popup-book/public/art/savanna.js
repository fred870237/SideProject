// 🦁 草原：點動物會唸英文名字（獅子、大象、犀牛還會播真的叫聲），然後像機關書一樣動起來
// 版面 1600×1000；遠山在 y ≈ 645，下面是草原；水塘在 x 267～933、y 800～840；右邊的金合歡樹冠在 x 1150～1560、y ≈ 400
// 動物是 AI 生成的圖（art/img/savanna/*.webp），做法跟工地那一頁一樣（見 construction.js 開頭的說明）
// 叫聲是 Pixabay 的音效（audio/sound/，來源見那裡的 CREDITS.md），用 playSound() 排在名字後面播
// 整個檔案包在 { } 裡，變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/savanna/${name}.webp`;
const IMG = (name, w, h, clip) =>
  `<image href="${SRC(name)}" width="${w}" height="${h}"${clip ? ` clip-path="url(#${clip})"` : ''}/>`;
const PATH = (pts) => 'M' + pts.map((p) => p.join(',')).join('L') + 'Z';
const RECT = (x0, y0, x1, y1) => PATH([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]);
const CLIP = (id, d) => `<clipPath id="${id}"><path d="${d}"/></clipPath>`;
const HOLE = (id, w, h, d) => `<clipPath id="${id}"><path clip-rule="evenodd" d="M0,0H${w}V${h}H0Z${d}"/></clipPath>`;
const DUST = '#c9a060', WATER = '#6cc8ff';

// 整張圖放在零件 body 裡；inner 不給就是整張圖
const whole = (p, name, w, h, inner) =>
  `<g transform="translate(0 ${-h})"><g id="${p}-body">${inner ?? IMG(name, w, h)}</g></g>`;
// 從嘴巴往右擴散的聲波（零件 w0～w2），中心 (x, y)
const waves = (p, x, y, color = '#ffffff') => [0, 1, 2].map((i) =>
  `<g id="${p}-w${i}" opacity="0" data-cx="${x}" data-cy="${y}">` +
  `<path d="M${x + 30},${y - 34} A44,44 0 0 1 ${x + 30},${y + 34}" fill="none" stroke="${color}" stroke-width="10" stroke-linecap="round"/></g>`).join('');
async function shout(c, n = 3) {
  for (let i = 0; i < n; i++) {
    const w = `w${i % 3}`;
    c.set(w, { o: 1, sx: 0.6, sy: 0.6 });
    c.anim(700, { [w]: { o: 0, sx: 2.4, sy: 2.4 } });
    await c.wait(260);
  }
}

// ---------- 獅子：往後一縮，再往前大吼一聲「吼——」，嘴巴前面冒出聲波 ----------
// 圖 590×666（臉朝右），嘴巴在 (575, 230)
const lion = {
  id: 'lion', en: 'Lion', zh: '獅子', x: 680, y: 830, s: 0.5,
  hint: [440, -440],
  pivots: { body: [150, 666] },
  art: (p) => whole(p, 'lion', 590, 666, IMG('lion', 590, 666) + waves(p, 575, 230)),
  async act(c) {
    await c.anim(500, { body: { r: -5, sx: 0.97 } });
    playSound('lion');
    await c.anim(250, { body: { r: 3, sx: 1.05 } });
    await shout(c, 6);
    await c.wait(500);
    await c.anim(500, { body: { r: 0, sx: 1 } });
  },
};

// ---------- 大象：抬起頭「叭——」叫一聲，再從鼻子噴出水來 ----------
// 圖 788×561（臉朝右）；耳朵前面的整個頭（臉、象牙、鼻子）裁出來，繞耳朵前緣 (540, 140) 往上抬，鼻尖在 (660, 445)
// 只裁鼻子一段會在接縫斷開，所以整個頭一起轉；頭抬起來後接縫露出的空隙，用原圖靠脖子的那一條（眼睛後面，x 520～590）墊在後面補起來
const ELE_HEAD = PATH([[520, 0], [788, 0], [788, 480], [630, 480], [625, 262], [560, 262], [520, 240]]);
const ELE_SEAM = PATH([[520, 0], [590, 0], [590, 262], [560, 262], [520, 240]]);
const elephant = {
  id: 'elephant', en: 'Elephant', zh: '大象', x: 40, y: 885, s: 0.55,
  hint: [350, -300],
  pivots: { trunk: [540, 140] },
  art: (p) => whole(p, 'elephant', 788, 561,
    CLIP(`${p}-cs`, ELE_SEAM) + IMG('elephant', 788, 561, `${p}-cs`) +
    HOLE(`${p}-cb`, 788, 561, ELE_HEAD) + IMG('elephant', 788, 561, `${p}-cb`) +
    CLIP(`${p}-ct`, ELE_HEAD) + `<g id="${p}-trunk">${IMG('elephant', 788, 561, `${p}-ct`)}</g>`),
  async act(c) {
    await c.anim(700, { trunk: { r: -14 } });
    playSound('elephant');
    await c.wait(900);
    // 噴水：從鼻尖一陣一陣噴出來
    for (let i = 0; i < 14; i++) {
      c.burst('trunk', 660, 445, { n: 5, color: WATER, vx: [1.5, 4.5], vy: [-6, -3], g: 0.3, size: [5, 10], life: 900 });
      await c.wait(90);
    }
    await c.wait(500);
    await c.anim(700, { trunk: { r: 0 } });
  },
};

// ---------- 長頸鹿：脖子伸向樹冠，咬一咬葉子，葉子一片一片掉下來 ----------
// 圖 448×692（臉朝右）；脖子和頭 (y < 300) 裁出來繞脖子根部 (285, 300) 轉
// 身體只挖掉 y < 230 的部分：脖子根部留著，轉的角度小，接縫才看不出來
const NECK = PATH([[200, 0], [448, 0], [448, 140], [345, 300], [228, 300], [200, 250]]);
const giraffe = {
  id: 'giraffe', en: 'Giraffe', zh: '長頸鹿', x: 1250, y: 790, s: 0.62,
  hint: [300, -560],
  pivots: { neck: [285, 300] },
  art: (p) => whole(p, 'giraffe', 448, 692,
    HOLE(`${p}-cb`, 448, 692, RECT(200, 0, 448, 230)) + IMG('giraffe', 448, 692, `${p}-cb`) +
    CLIP(`${p}-cn`, NECK) + `<g id="${p}-neck">${IMG('giraffe', 448, 692, `${p}-cn`)}</g>`),
  async act(c) {
    await c.anim(700, { neck: { r: 7 } });
    for (let i = 0; i < 4; i++) {
      await c.anim(180, { neck: { r: 9 } });
      c.burst('neck', 430, 70, { n: 4, color: '#6d8f2a', vx: [-1.5, 1.5], vy: [-1, 0.5], g: 0.12, size: [6, 11], life: 1300 });
      await c.anim(180, { neck: { r: 6 } });
    }
    await c.wait(300);
    await c.anim(700, { neck: { r: 0 } });
  },
};

// ---------- 斑馬：尾巴甩一甩，一蹦一跳地往前跑一段再跑回來 ----------
// 圖 578×650（臉朝右），尾巴 (0～72, 300～540) 掛在 (70, 320)
const TAIL = RECT(0, 300, 72, 540);
const zebra = {
  id: 'zebra', en: 'Zebra', zh: '斑馬', x: 960, y: 745, s: 0.36,
  hint: [300, -330],
  pivots: { body: [289, 650], tail: [70, 320] },
  art: (p) => whole(p, 'zebra', 578, 650,
    HOLE(`${p}-cb`, 578, 650, TAIL) + IMG('zebra', 578, 650, `${p}-cb`) +
    CLIP(`${p}-ct`, TAIL) + `<g id="${p}-tail">${IMG('zebra', 578, 650, `${p}-ct`)}</g>`),
  async act(c) {
    for (let i = 0; i < 3; i++) {
      await c.anim(180, { tail: { r: 22 } });
      await c.anim(180, { tail: { r: -12 } });
    }
    await c.anim(150, { tail: { r: 0 } });
    // 一蹦一跳：每一步 ty 往上彈、身體前後晃
    const gallop = (dir) => (t) => {
      const h = Math.abs(Math.sin(t * Math.PI * 5));
      c.set('body', { ty: -40 * h, r: dir * 4 * Math.sin(t * Math.PI * 10) });
      c.set('tail', { r: 25 * h });
      if (h < 0.08) c.burst('body', 300, 645, { n: 3, color: DUST, vx: [-2.5, 2.5], vy: [-1.5, -0.3], g: 0.05, size: [6, 11] });
    };
    await c.anim(1500, { body: { tx: 420 } }, gallop(1));
    c.set('body', { sx: -1 }); // 轉身
    await c.anim(1500, { body: { tx: 0 } }, gallop(-1));
    c.set('body', { sx: 1, ty: 0, r: 0 });
    c.set('tail', { r: 0 });
  },
};

// ---------- 河馬：「Yawn!」張開大嘴打一個大哈欠 ----------
// 圖 724×578（臉朝右）；上半個頭沿著嘴巴的線裁出來，繞後腦 (420, 220) 往上轉，露出後面畫的嘴巴裡面
const HEAD = PATH([[360, 10], [610, 10], [610, 245], [585, 262], [555, 288], [505, 284], [465, 262], [440, 240], [360, 240]]);
const hippo = {
  id: 'hippo', en: 'Hippo', zh: '河馬', x: 450, y: 880, s: 0.42,
  hint: [300, -330],
  pivots: { head: [420, 220], body: [362, 578] },
  art(p) {
    const mouth = `<path d="M430,236 C470,330 560,330 600,250 C580,210 470,200 430,236Z" fill="#8c2a45"/>` +
      '<ellipse cx="520" cy="290" rx="32" ry="12" fill="#e8607e"/>' +
      '<rect x="478" y="262" width="14" height="18" rx="4" fill="#fff"/><rect x="548" y="266" width="14" height="18" rx="4" fill="#fff"/>';
    return whole(p, 'hippo', 724, 578,
      mouth + HOLE(`${p}-cb`, 724, 578, HEAD) + IMG('hippo', 724, 578, `${p}-cb`) +
      CLIP(`${p}-ch`, HEAD) + `<g id="${p}-head">${IMG('hippo', 724, 578, `${p}-ch`)}</g>`);
  },
  async act(c) {
    speak('Yawn!', { queue: true });
    await c.anim(900, { head: { r: -24 } });
    await c.wait(900);
    await c.anim(600, { head: { r: 0 } });
    // 打完哈欠，舒服地晃一晃
    await c.anim(300, { body: { sy: 0.96 } });
    await c.anim(300, { body: { sy: 1 } });
  },
};

// ---------- 犀牛：低下頭用腳扒扒地「哼——」，往前衝一段再倒回來 ----------
// 圖 770×580（臉朝右）
const rhino = {
  id: 'rhino', en: 'Rhino', zh: '犀牛', x: 1130, y: 990, s: 0.42,
  hint: [380, -330],
  pivots: { body: [150, 580] },
  art: (p) => whole(p, 'rhino', 770, 580),
  async act(c) {
    playSound('rhino');
    await c.anim(400, { body: { r: 4 } });
    for (let i = 0; i < 3; i++) {
      c.burst('body', 120, 575, { n: 6, color: DUST, vx: [-3, -0.5], vy: [-2, -0.5], g: 0.08, size: [6, 12] });
      await c.anim(160, { body: { tx: -8 } });
      await c.anim(160, { body: { tx: 0 } });
    }
    const dust = setInterval(() => c.burst('body', 150, 575, { n: 3, color: DUST, vx: [-3, -1], vy: [-1.5, -0.3], g: 0.05, size: [7, 13] }), 70);
    await c.anim(900, { body: { tx: 360 } }, (t) => c.set('body', { ty: -10 * Math.abs(Math.sin(t * Math.PI * 6)) }), (t) => t * t);
    clearInterval(dust);
    await c.anim(400, { body: { r: 0, ty: 0 } });
    await c.anim(1500, { body: { tx: 0 } });
  },
};

// ---------- 狐獴：「Peekaboo!」躲進地洞，再探出頭來左右看看 ----------
// 圖 525×612（站著，臉朝右）；身體只畫地面以上（clipPath 到 y = 600），地洞畫在腳邊、身體前面
const meerkat = {
  id: 'meerkat', en: 'Meerkat', zh: '狐獴', x: 990, y: 985, s: 0.25,
  hint: [300, -400],
  pivots: { body: [300, 600] },
  art(p) {
    return '<g transform="translate(0 -612)">' +
      `<clipPath id="${p}-cg"><rect x="-200" y="-400" width="925" height="1000"/></clipPath>` +
      `<g clip-path="url(#${p}-cg)"><g id="${p}-body">${IMG('meerkat', 525, 612)}</g></g>` +
      '<ellipse cx="300" cy="604" rx="170" ry="26" fill="#6b4a2a"/><ellipse cx="300" cy="600" rx="140" ry="16" fill="#3a2614"/>' +
    '</g>';
  },
  async act(c) {
    await c.anim(400, { body: { ty: 640 } }, null, (t) => t * t);
    await c.wait(600);
    speak('Peekaboo!', { queue: true });
    await c.anim(450, { body: { ty: -30 } }, null, (t) => 1 - (1 - t) ** 2);
    await c.anim(200, { body: { ty: 0 } });
    await c.wait(300);
    await c.anim(250, { body: { sx: -1 } });
    await c.wait(500);
    await c.anim(250, { body: { sx: 1 } });
    await c.wait(300);
  },
};

SCENES.savanna = {
  w: 1600,
  h: 1000,
  bg: () => `
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <text x="56" y="98" font-size="60" font-weight="900" fill="${LINE}">Savanna</text>
    <text x="58" y="148" font-size="38" font-weight="900" fill="${LINE}" opacity=".7">草原</text>
  `,
  // 先畫後排（遠的），再畫前排
  items: [giraffe, lion, zebra, elephant, hippo, meerkat, rhino],
};
}
