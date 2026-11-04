// 🦖 恐龍山谷：點恐龍會唸英文名字，然後像機關書一樣動起來
// 版面 1600×1000；遠山和湖在 y ≈ 540～660，下面是沙地；右邊的棕櫚樹葉在 x 1120～1600、y 150～350
// 恐龍是 AI 生成的圖（art/img/dino-valley/*.webp），做法跟工地那一頁一樣（見 construction.js 開頭的說明）
// 恐龍是綠色的，所以在洋紅色背景上生圖（picks 用 {"key": "magenta"}）
// 沒有真的恐龍叫聲，吼叫和「Honk honk!」用旁白的聲音唸
// 整個檔案包在 { } 裡，變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/dino-valley/${name}.webp`;
const IMG = (name, w, h, clip, extra = '') =>
  `<image href="${SRC(name)}" width="${w}" height="${h}"${clip ? ` clip-path="url(#${clip})"` : ''}${extra}/>`;
const PATH = (pts) => 'M' + pts.map((p) => p.join(',')).join('L') + 'Z';
const RECT = (x0, y0, x1, y1) => PATH([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]);
const CLIP = (id, d) => `<clipPath id="${id}"><path d="${d}"/></clipPath>`;
const HOLE = (id, w, h, d) => `<clipPath id="${id}"><path clip-rule="evenodd" d="M0,0H${w}V${h}H0Z${d}"/></clipPath>`;
const DUST = '#d8c27a', LEAF = '#3f8a3a';
const CIRCLE = (cx, cy, r) => `M${cx - r},${cy}a${r},${r} 0 1 0 ${2 * r},0a${r},${r} 0 1 0 ${-2 * r},0Z`;

// 會甩的尾巴：分兩節，像關節一樣各轉一半，彎起來比較自然
// cut1 是整條尾巴（掛在 j1），cut2 是尾巴尖那一節（要整個在 cut1 裡面，掛在 j2，零件 tail2）
// 每個關節上再蓋一圈原圖（[x, y, 半徑]，要蓋住尾巴整個粗細）：尾巴一轉，切口兩端就會露出縫，蓋上這一圈接縫就看不出來
const swingTail = (p, name, w, h, cut1, j1, cut2, j2, extra = '') =>
  HOLE(`${p}-cb`, w, h, cut1) + IMG(name, w, h, `${p}-cb`) +
  `<g id="${p}-tail">` +
    CLIP(`${p}-ct2`, cut2) + `<g id="${p}-tail2">${extra}${IMG(name, w, h, `${p}-ct2`)}</g>` +
    `<clipPath id="${p}-ct"><path clip-rule="evenodd" d="${cut1}${cut2}"/></clipPath>` + IMG(name, w, h, `${p}-ct`) +
    CLIP(`${p}-cj2`, CIRCLE(...j2)) + IMG(name, w, h, `${p}-cj2`) +
  '</g>' +
  CLIP(`${p}-cj`, CIRCLE(...j1)) + IMG(name, w, h, `${p}-cj`);
// 尾巴轉 r 度：兩節各轉一半
const bend = (r) => ({ tail: { r: r / 2 }, tail2: { r: r / 2 } });

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

// ---------- 腕龍：長脖子伸進棕櫚樹葉裡，咬一咬，葉子一片一片掉下來 ----------
// 圖 822×589（臉朝右）；脖子和頭裁出來繞脖子根部 (610, 290) 轉，嘴巴在 (815, 60)
// 身體只挖掉 x > 620、y < 230 的部分：脖子根部留著，接縫才看不出來
const BRA_NECK = PATH([[580, 0], [822, 0], [822, 130], [690, 260], [600, 320], [570, 300]]);
const brachiosaurus = {
  id: 'brachiosaurus', en: 'Brachiosaurus', zh: '腕龍', x: 1040, y: 690, s: 0.62,
  hint: [500, -300],
  pivots: { neck: [610, 290] },
  art: (p) => whole(p, 'brachiosaurus', 822, 589,
    HOLE(`${p}-cb`, 822, 589, RECT(620, 0, 822, 230)) + IMG('brachiosaurus', 822, 589, `${p}-cb`) +
    CLIP(`${p}-cn`, BRA_NECK) + `<g id="${p}-neck">${IMG('brachiosaurus', 822, 589, `${p}-cn`)}</g>`),
  async act(c) {
    await c.anim(800, { neck: { r: -6 } });
    await c.anim(500, { neck: { r: 4 } });
    for (let i = 0; i < 4; i++) {
      if (i === 0) speak('Munch munch!', { queue: true });
      await c.anim(200, { neck: { r: 7 } });
      c.burst('neck', 805, 60, { n: 5, color: LEAF, vx: [-1.5, 1.5], vy: [-1, 0.5], g: 0.12, size: [7, 13], life: 1400 });
      await c.anim(200, { neck: { r: 3 } });
    }
    await c.wait(300);
    await c.anim(800, { neck: { r: 0 } });
  },
};

// ---------- 副櫛龍：抬起頭用頭冠「Honk honk!」叫，嘴巴前面冒出聲波 ----------
// 圖 755×622（臉朝右），嘴巴在 (745, 105)
const parasaurolophus = {
  id: 'parasaurolophus', en: 'Parasaurolophus', zh: '副櫛龍', x: 130, y: 705, s: 0.45,
  hint: [420, -420],
  pivots: { body: [400, 622] },
  art: (p) => whole(p, 'parasaurolophus', 755, 622, IMG('parasaurolophus', 755, 622) + waves(p, 745, 105, '#fff6c0')),
  async act(c) {
    await c.anim(500, { body: { r: -7 } });
    speak('Honk honk!', { queue: true });
    for (let i = 0; i < 2; i++) {
      await c.anim(150, { body: { r: -10 } });
      await shout(c, 3);
      await c.anim(150, { body: { r: -7 } });
    }
    await c.wait(300);
    await c.anim(500, { body: { r: 0 } });
  },
};

// ---------- 劍龍：背上的骨板亮兩下，再用尾巴左右「咻」地甩 ----------
// 圖 861×521（臉朝右）；尾巴從 (118, 230)～(175, 360) 這條斜線切開，避開背上的骨板，掛在 (150, 311)；尾巴尖那一節在 x = 75 切開
// 發亮：同一張圖加上變亮的濾鏡（#dv-glow，在 bg 裡）疊在上面，淡入淡出
const STE_TAIL = PATH([[-20, 200], [104, 200], [118, 230], [175, 360], [-20, 360]]), STE_TIP = RECT(-20, 250, 75, 360);
const stegosaurus = {
  id: 'stegosaurus', en: 'Stegosaurus', zh: '劍龍', x: 390, y: 795, s: 0.45,
  hint: [380, -330],
  pivots: { body: [430, 521], tail: [150, 311], tail2: [75, 322] },
  art: (p) => whole(p, 'stegosaurus', 861, 521,
    swingTail(p, 'stegosaurus', 861, 521, STE_TAIL, [150, 311, 42], STE_TIP, [75, 322, 30]) +
    `<g id="${p}-glow" opacity="0">${IMG('stegosaurus', 861, 521, null, ' filter="url(#dv-glow)"')}</g>`),
  async act(c) {
    for (let i = 0; i < 2; i++) {
      await c.anim(300, { glow: { o: 0.9 }, body: { sy: 1.04 } });
      await c.anim(400, { glow: { o: 0 }, body: { sy: 1 } });
    }
    for (let i = 0; i < 3; i++) {
      await c.anim(220, bend(-12));
      if (i === 0) speak('Whoosh!', { queue: true });
      await c.anim(220, bend(12));
    }
    await c.anim(250, bend(0));
  },
};

// ---------- 暴龍：往後一縮，往前大吼「Roar!」，身體一震一震、嘴巴前面冒出聲波，再重重踩兩步 ----------
// 圖 698×508（臉朝右，嘴巴本來就張開），嘴巴在 (680, 65)，腳在 (325, 505)
const trex = {
  id: 'trex', en: 'T-Rex', zh: '暴龍', x: 640, y: 955, s: 0.85,
  hint: [380, -330],
  pivots: { body: [330, 508] },
  art: (p) => whole(p, 'trex', 698, 508, IMG('trex', 698, 508) + waves(p, 680, 65)),
  async act(c) {
    await c.anim(500, { body: { r: -6, sx: 0.96 } });
    speak('Roar!', { queue: true });
    await c.anim(200, { body: { r: 4, sx: 1.06 } });
    // 吼的時候整隻抖動
    const shake = setInterval(() => c.set('body', { tx: (Math.random() - 0.5) * 14 }), 40);
    await shout(c, 6);
    clearInterval(shake);
    await c.anim(300, { body: { r: 0, sx: 1, tx: 0 } });
    speak('Stomp stomp!', { queue: true });
    for (let i = 0; i < 2; i++) {
      await c.anim(250, { body: { ty: -40 } }, null, (t) => 1 - (1 - t) ** 2);
      await c.anim(150, { body: { ty: 0 } }, null, (t) => t * t);
      c.burst('body', 325, 505, { n: 12, color: DUST, vx: [-4, 4], vy: [-3, -0.5], g: 0.12, size: [7, 14] });
      await c.wait(200);
    }
  },
};

// ---------- 三角龍：用腳扒扒地，低下頭用角往前衝，再慢慢退回來 ----------
// 圖 703×492（臉朝右），角尖在 (685, 100)，腳在 (300, 490)
const triceratops = {
  id: 'triceratops', en: 'Triceratops', zh: '三角龍', x: 50, y: 965, s: 0.5,
  hint: [350, -300],
  pivots: { body: [300, 492] },
  art: (p) => whole(p, 'triceratops', 703, 492),
  async act(c) {
    await c.anim(400, { body: { r: 5 } });
    for (let i = 0; i < 3; i++) {
      c.burst('body', 300, 488, { n: 6, color: DUST, vx: [-3, -0.5], vy: [-2, -0.5], g: 0.08, size: [6, 12] });
      await c.anim(160, { body: { tx: -10 } });
      await c.anim(160, { body: { tx: 0 } });
    }
    const dust = setInterval(() => c.burst('body', 300, 488, { n: 3, color: DUST, vx: [-3, -1], vy: [-1.5, -0.3], g: 0.05, size: [7, 13] }), 70);
    await c.anim(900, { body: { tx: 380 } }, (t) => c.set('body', { ty: -10 * Math.abs(Math.sin(t * Math.PI * 6)) }), (t) => t * t);
    clearInterval(dust);
    // 撞到了：角前面冒出星星
    c.burst('body', 690, 110, { n: 14, color: '#ffe066', vx: [-3, 3], vy: [-4, 1], g: 0.1, size: [8, 14] });
    await c.anim(150, { body: { tx: 360, r: 2 } });
    await c.anim(300, { body: { r: 0, ty: 0 } });
    await c.anim(1500, { body: { tx: 0 } });
  },
};

// ---------- 甲龍：尾巴上的骨錘左右甩，「咚」地敲在地上 ----------
// 圖 923×483（臉朝右）；AI 畫不出尾巴的骨錘，所以骨錘是另外畫的 SVG，接在尾巴尖 (5, 293)
// 尾巴在 x = 120（兩根尖刺中間）切開，掛在 (120, 300)；尾巴尖那一節（x < 60）連骨錘一起掛在 (60, 298)
const ANK_TAIL = RECT(-80, 200, 120, 360), ANK_TIP = RECT(-80, 200, 60, 360);
const ankylosaurus = {
  id: 'ankylosaurus', en: 'Ankylosaurus', zh: '甲龍', x: 1190, y: 985, s: 0.45,
  hint: [450, -280],
  pivots: { body: [460, 483], tail: [120, 300], tail2: [60, 298] },
  art(p) {
    const club = '<ellipse cx="-22" cy="293" rx="46" ry="36" fill="#9a6a3a"/>' +
      '<ellipse cx="-22" cy="306" rx="42" ry="21" fill="#7d5229"/>' +
      '<circle cx="-40" cy="282" r="9" fill="#d8b070"/><circle cx="-8" cy="276" r="8" fill="#d8b070"/><circle cx="-24" cy="300" r="7" fill="#d8b070"/>';
    return whole(p, 'ankylosaurus', 923, 483,
      swingTail(p, 'ankylosaurus', 923, 483, ANK_TAIL, [120, 300, 46], ANK_TIP, [60, 298, 30], club));
  },
  async act(c) {
    for (let i = 0; i < 2; i++) {
      await c.anim(300, bend(18));
      await c.anim(300, bend(-18));
    }
    // 舉高再「咚」地敲下去
    await c.anim(350, bend(22));
    await c.anim(180, bend(-22), null, (t) => t * t);
    c.burst('tail2', -22, 325, { n: 14, color: DUST, vx: [-4, 4], vy: [-4, -1], g: 0.15, size: [7, 14] });
    await c.anim(120, { body: { ty: -8 } });
    await c.anim(120, { body: { ty: 0 } });
    await c.wait(300);
    await c.anim(400, bend(0));
  },
};

// ---------- 迅猛龍：一溜煙跑過去，轉身跑回來，再跳一下 ----------
// 圖 724×459（臉朝右），腳在 (260, 455)
const raptor = {
  id: 'raptor', en: 'Velociraptor', zh: '迅猛龍', x: 400, y: 990, s: 0.36,
  hint: [380, -300],
  pivots: { body: [300, 459] },
  art: (p) => whole(p, 'raptor', 724, 459),
  async act(c) {
    const run = (t) => {
      const h = Math.abs(Math.sin(t * Math.PI * 7));
      c.set('body', { ty: -30 * h, r: -4 * h });
      if (h < 0.1) c.burst('body', 260, 455, { n: 3, color: DUST, vx: [-3, 0], vy: [-1.5, -0.3], g: 0.05, size: [6, 11] });
    };
    await c.anim(1100, { body: { tx: 700 } }, run);
    c.set('body', { sx: -1 }); // 轉身
    await c.anim(1100, { body: { tx: 0 } }, run);
    c.set('body', { sx: 1, ty: 0, r: 0 });
    await c.anim(300, { body: { ty: -120 } }, null, (t) => 1 - (1 - t) ** 2);
    await c.anim(300, { body: { ty: 0 } }, null, (t) => t * t);
  },
};

SCENES['dino-valley'] = {
  w: 1600,
  h: 1000,
  bg: () => `
    <defs><filter id="dv-glow"><feComponentTransfer>
      <feFuncR type="linear" slope="1.3" intercept=".25"/><feFuncG type="linear" slope="1.3" intercept=".2"/><feFuncB type="linear" slope="1.1" intercept=".05"/>
    </feComponentTransfer></filter></defs>
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <text x="620" y="108" font-size="60" font-weight="900" fill="${LINE}">Dino Valley</text>
    <text x="622" y="158" font-size="38" font-weight="900" fill="${LINE}" opacity=".7">恐龍山谷</text>
  `,
  // 先畫後排（遠的），再畫前排
  items: [brachiosaurus, parasaurolophus, stegosaurus, trex, triceratops, ankylosaurus, raptor],
};
}
