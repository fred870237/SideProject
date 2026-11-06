// 🦴 化石博物館：點恐龍骨骼會唸英文名字，骨頭喀啦喀啦抖一抖，然後「活過來」變成真的恐龍，動一動再變回化石
// 版面 1600×1000；地板從 y ≈ 690 開始
// 骨骼和菊石化石是 AI 生成的圖（art/img/fossil-museum/*.webp），在洋紅色背景上生圖（picks 用 {"key": "magenta"}）
// 活過來的恐龍直接借用前面幾頁的圖（恐龍山谷、遠古天空、遠古海洋），所以不用另外生圖
// AI 畫的背景左邊牆角多了一副小骨骼，匯出前用程式把它補成牆壁和踢腳板了
// 展示台、吊繩是平面的 SVG
// 整個檔案包在 { } 裡，變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/fossil-museum/${name}.webp`;
const WOOD = '#8a5a3c', WOOD2 = '#6e4630', STONE = '#d9cbb4', STONE2 = '#bfae93', CABLE = '#6b5a4e';

// 一件展品：骨骼（零件 fossil）和活過來的恐龍（零件 alive，一開始透明）疊在一起，腳底都貼在地面 y = 0
// bone：骨骼圖 [名稱, 寬, 高]；live：借來的恐龍圖 [路徑, 寬, 高]，縮放成跟骨骼差不多寬
// stand(s)：展示台（畫在地面下面，不會跟著動）；action(c)：活過來以後要做的事
function exhibit({ id, en, zh, x, y, s, bone, live, fit = 1, flip = false, stand, extra = '', box, action }) {
  const [bn, bw, bh] = bone, [lsrc, lw, lh] = live;
  const k = (bw * fit) / lw, aw = lw * k, ah = lh * k;
  const ax = (bw - aw) / 2;
  return {
    id, en, zh, x, y, s, box,
    hint: [bw / 2, -bh * 0.55],
    pivots: { fossil: [bw / 2, 0], alive: [bw / 2, 0] },
    art: (p) =>
      (stand ? stand(s, bw) : '') + extra +
      `<g id="${p}-fossil"><image href="${SRC(bn)}" y="${-bh}" width="${bw}" height="${bh}"/></g>` +
      `<g id="${p}-alive" opacity="0"><g transform="translate(${(flip ? ax + aw : ax).toFixed(1)} ${(-ah).toFixed(1)}) scale(${flip ? -k : k} ${k})">` +
        `<image href="${lsrc}" width="${lw}" height="${lh}"/></g></g>`,
    async act(c) {
      // 骨頭喀啦喀啦抖一抖
      for (let i = 0; i < 3; i++) {
        await c.anim(80, { fossil: { r: -3 } });
        await c.anim(80, { fossil: { r: 3 } });
      }
      await c.anim(80, { fossil: { r: 0 } });
      // 骨骼淡出、真的恐龍從小變大彈出來
      c.set('alive', { sx: 0.6, sy: 0.6 });
      await c.anim(500, { fossil: { o: 0, sx: 0.9, sy: 0.9 }, alive: { o: 1, sx: 1.08, sy: 1.08 } });
      await c.anim(200, { alive: { sx: 1, sy: 1 } });
      await action(c);
      await c.wait(500);
      // 變回化石
      await c.anim(500, { fossil: { o: 1, sx: 1, sy: 1 }, alive: { o: 0, sx: 0.8, sy: 0.8 } });
    },
  };
}

// 木頭展示台（矮矮的）
const platform = (h) => (s, w) => {
  const t = h / s, pad = 30 / s;
  return `<rect x="${-pad}" y="0" width="${w + 2 * pad}" height="${t}" rx="${6 / s}" fill="${WOOD}"/>` +
    `<rect x="${-pad}" y="${t * 0.65}" width="${w + 2 * pad}" height="${t * 0.35}" rx="${6 / s}" fill="${WOOD2}"/>`;
};
// 石頭柱子（菊石放在上面）
const pedestal = (h) => (s, w) => {
  const t = h / s, pad = 20 / s;
  return `<rect x="${-pad}" y="0" width="${w + 2 * pad}" height="${t}" fill="${STONE}"/>` +
    `<rect x="${w * 0.6}" y="0" width="${w * 0.4 + pad}" height="${t}" fill="${STONE2}"/>` +
    `<rect x="${-pad * 2}" y="0" width="${w + 4 * pad}" height="${16 / s}" fill="${STONE2}"/>`;
};

// 走路時一上一下
const bob = (c, n, amp) => (t) => c.set('alive', { ty: -amp * Math.abs(Math.sin(t * Math.PI * n)) });

// ---------- 腕龍：骨骼 768×615；活過來伸長脖子吃樹葉 ----------
const brachiosaurus = exhibit({
  id: 'fossil-brachiosaurus', en: 'Brachiosaurus', zh: '腕龍', x: 250, y: 720, s: 0.55,
  bone: ['brachiosaurus', 768, 615], live: ['art/img/dino-valley/brachiosaurus.webp', 822, 589], fit: 1.05,
  stand: platform(22),
  async action(c) {
    await c.anim(500, { alive: { sy: 1.08 } });
    speak('Munch munch!', { queue: true });
    for (let i = 0; i < 3; i++) {
      await c.anim(180, { alive: { r: -2 } });
      await c.anim(180, { alive: { r: 1 } });
    }
    await c.anim(400, { alive: { sy: 1, r: 0 } });
  },
});

// ---------- 無齒翼龍：骨骼 825×392，用兩條繩子吊在天花板上；活過來拍拍翅膀 ----------
// 繩子綁在翅膀 (300, -330) 和身體 (620, -300)，往上拉到場景最上面
const PTE = { x: 640, y: 330, s: 0.45 };
const pteranodon = exhibit({
  id: 'fossil-pteranodon', en: 'Pteranodon', zh: '無齒翼龍', ...PTE,
  bone: ['pteranodon', 825, 392], live: ['art/img/dino-sky/pteranodon.webp', 723, 519], fit: 0.9,
  // 吊繩一直拉到天花板，外框會太大；放大時只看翼龍本身
  box: [-40, -520, 905, 560],
  extra: [[300, -330], [620, -300]].map(([cx, cy]) =>
    `<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${-PTE.y / PTE.s}" stroke="${CABLE}" stroke-width="${3 / PTE.s}"/>`).join(''),
  async action(c) {
    speak('Squawk!', { queue: true });
    for (let i = 0; i < 4; i++) {
      await c.anim(160, { alive: { sy: 0.7, ty: 20 } });
      await c.anim(160, { alive: { sy: 1, ty: -20 } });
    }
    await c.anim(200, { alive: { ty: 0 } });
  },
});

// ---------- 暴龍：骨骼 802×624；活過來「Roar!」大吼 ----------
const trex = exhibit({
  id: 'fossil-trex', en: 'T-Rex', zh: '暴龍', x: 540, y: 905, s: 0.6,
  bone: ['trex', 802, 624], live: ['art/img/dino-valley/trex.webp', 698, 508], fit: 0.95,
  stand: platform(26),
  async action(c) {
    await c.anim(300, { alive: { r: -6 } });
    speak('Roar!', { queue: true });
    await c.anim(150, { alive: { r: 2, sx: 1.06, sy: 1.06 } });
    for (let i = 0; i < 4; i++) {
      await c.anim(70, { alive: { tx: -6 } });
      await c.anim(70, { alive: { tx: 6 } });
    }
    await c.anim(250, { alive: { r: 0, tx: 0, sx: 1, sy: 1 } });
  },
});

// ---------- 三角龍：骨骼 821×527；活過來低頭甩甩角 ----------
const triceratops = exhibit({
  id: 'fossil-triceratops', en: 'Triceratops', zh: '三角龍', x: 1120, y: 800, s: 0.5,
  bone: ['triceratops', 821, 527], live: ['art/img/dino-valley/triceratops.webp', 703, 492], fit: 0.95,
  stand: platform(22),
  async action(c) {
    for (let i = 0; i < 2; i++) {
      await c.anim(220, { alive: { r: 6 } });
      await c.anim(220, { alive: { r: -3 } });
    }
    await c.anim(200, { alive: { r: 0 } });
    speak('Stomp stomp!', { queue: true });
    await c.anim(700, { alive: {} }, bob(c, 3, 18));
    c.set('alive', { ty: 0 });
  },
});

// ---------- 劍龍：骨骼 862×510；活過來跺跺腳 ----------
const stegosaurus = exhibit({
  id: 'fossil-stegosaurus', en: 'Stegosaurus', zh: '劍龍', x: 60, y: 965, s: 0.45,
  bone: ['stegosaurus', 862, 510], live: ['art/img/dino-valley/stegosaurus.webp', 861, 521],
  stand: platform(22),
  async action(c) {
    speak('Stomp stomp!', { queue: true });
    await c.anim(900, { alive: {} }, bob(c, 4, 20));
    c.set('alive', { ty: 0 });
  },
});

// ---------- 迅猛龍：骨骼 728×527；活過來跳兩下 ----------
const raptor = exhibit({
  id: 'fossil-raptor', en: 'Velociraptor', zh: '迅猛龍', x: 1260, y: 975, s: 0.4,
  bone: ['raptor', 728, 527], live: ['art/img/dino-valley/raptor.webp', 724, 459],
  stand: platform(22),
  async action(c) {
    for (let i = 0; i < 2; i++) {
      await c.anim(220, { alive: { ty: -90, sy: 1.05 } }, null, (t) => 1 - (1 - t) ** 2);
      await c.anim(220, { alive: { ty: 0, sy: 1 } }, null, (t) => t * t);
    }
  },
});

// ---------- 菊石：化石 496×499 放在石頭柱子上；活過來轉一圈飄起來 ----------
const ammonite = exhibit({
  id: 'fossil-ammonite', en: 'Ammonite', zh: '菊石', x: 1065, y: 820, s: 0.2,
  bone: ['ammonite', 496, 499], live: ['art/img/dino-sea/ammonite.webp', 598, 437], fit: 1.1,
  stand: pedestal(150),
  // 石頭柱子很高，放大時只看菊石和柱子頂端
  box: [-120, -700, 740, 900],
  async action(c) {
    speak('Whoosh!', { queue: true });
    await c.anim(1200, { alive: { r: 360 } }, (t) => c.set('alive', { ty: -120 * Math.sin(t * Math.PI) }));
    c.set('alive', { r: 0, ty: 0 });
  },
});

SCENES['fossil-museum'] = {
  w: 1600,
  h: 1000,
  bg: () => `
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <!-- 標題壓在深色的屋樑上：白字加深色外框才看得清楚 -->
    <g fill="#fff" stroke="#5a3a28" stroke-width="10" stroke-linejoin="round" paint-order="stroke" font-weight="900" text-anchor="end">
      <text x="1544" y="98" font-size="60">Fossil Museum</text>
      <text x="1542" y="148" font-size="38">化石博物館</text>
    </g>
  `,
  // 先畫後排（遠的），再畫前排
  items: [pteranodon, brachiosaurus, triceratops, trex, ammonite, stegosaurus, raptor],
};
}
