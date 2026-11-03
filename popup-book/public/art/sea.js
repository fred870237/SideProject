// 🚢 海上：點船會唸英文名字，然後像機關書一樣動起來
// 版面 1600×1000；海平線在 y ≈ 437，左邊有一段碼頭（x 0～205, y 560～790）
// 船是 AI 生成的圖（art/img/sea/*.webp），做法跟工地那一頁一樣（見 construction.js 開頭的說明）
// 船都浮在水面上：每艘船的「地面」（y = 0）是吃水線。吃水線以上照常畫，以下只畫一層半透明的影子，看起來像泡在水裡
// 整個檔案包在 { } 裡，船的變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/sea/${name}.webp`;
const IMG = (name, w, h, clip) =>
  `<image href="${SRC(name)}" width="${w}" height="${h}"${clip ? ` clip-path="url(#${clip})"` : ''}/>`;
const PATH = (pts) => 'M' + pts.map((p) => p.join(',')).join('L') + 'Z';
const RECT = (x0, y0, x1, y1) => PATH([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]);
const CLIP = (id, d) => `<clipPath id="${id}"><path d="${d}"/></clipPath>`;
const HOLE = (id, w, h, d) => `<clipPath id="${id}"><path clip-rule="evenodd" d="M0,0H${w}V${h}H0Z${d}"/></clipPath>`;
const FOAM = '#e9f7ff', SMOKE = '#8d949c';

// 浮在水上的船：船身（零件 body，會動的東西都放在裡面）以吃水線 wl 為界，上面正常畫、下面用 <use> 複製一份半透明的
// 圖片座標：w×h 的圖，吃水線在圖上的 y = wl；最後在吃水線畫一條白色的浪
const afloat = (p, w, h, wl, inner) => {
  const wave = Array.from({ length: Math.ceil((w + 60) / 60) }, (_, i) => `q15,-9 30,0t30,0`).join('');
  return `<g transform="translate(0 ${-wl})">` +
    `<clipPath id="${p}-up"><rect x="-3000" y="-3000" width="7000" height="${3000 + wl}"/></clipPath>` +
    `<clipPath id="${p}-dn"><rect x="-3000" y="${wl}" width="7000" height="3000"/></clipPath>` +
    `<g clip-path="url(#${p}-dn)" opacity=".3"><use href="#${p}-body"/></g>` +
    `<g clip-path="url(#${p}-up)"><g id="${p}-body">${inner}</g></g>` +
    `<path d="M-30,${wl + 2}${wave}" fill="none" stroke="${FOAM}" stroke-width="7" stroke-linecap="round" opacity=".9"/>` +
  '</g>';
};
// 輕輕上下晃（給 anim 用）
const bob = async (c, n = 2, dy = 6, ms = 380) => {
  for (let i = 0; i < n; i++) {
    await c.anim(ms, { body: { ty: dy } });
    await c.anim(ms, { body: { ty: 0 } });
  }
};

// ---------- 貨櫃輪：船笛「嗚——嗚——」，煙囪冒煙，慢慢往前開再倒回來 ----------
// 圖 916×342（船頭在右），吃水線 y = 290，煙囪口在 (250, 8)
const cargo = {
  id: 'cargo', en: 'Container Ship', zh: '貨櫃輪', x: 900, y: 548, s: 0.56,
  hint: [500, -160],
  art: (p) => afloat(p, 916, 342, 290, IMG('cargo', 916, 342)),
  async act(c) {
    horn([[0, 1.1], [1.4, 1.4]]);
    for (let i = 0; i < 10; i++) {
      c.burst('body', 250, 8, { n: 3, color: SMOKE, vx: [-1.2, -0.3], vy: [-1.6, -0.8], g: -0.01, size: [10, 18], life: 1400 });
      await c.wait(260);
    }
    const wake = setInterval(() => c.burst('body', 70, 290, { n: 3, color: FOAM, vx: [-1.5, -0.5], vy: [-1.5, -0.5], g: 0.08, size: [6, 11] }), 120);
    await c.anim(2200, { body: { tx: 160 } });
    clearInterval(wake);
    await bob(c, 1, 5, 400);
    await c.anim(2000, { body: { tx: 0 } });
  },
};

// ---------- 帆船：風吹過來，船身傾斜，乘風往前開再回來 ----------
// 圖 639×631（船頭在右），吃水線 y = 585
const sailboat = {
  id: 'sailboat', en: 'Sailboat', zh: '帆船', x: 260, y: 562, s: 0.42,
  hint: [450, -285],
  pivots: { body: [320, 585] },
  art: (p) => afloat(p, 639, 631, 585, IMG('sailboat', 639, 631)),
  async act(c) {
    // 風：從左邊吹來的一陣白色小點
    for (let i = 0; i < 6; i++) {
      c.burst('body', 0, 150 + i * 50, { n: 2, color: '#ffffff', vx: [4, 6], vy: [-0.3, 0.3], g: 0, size: [5, 8], life: 700 });
    }
    await c.anim(700, { body: { r: 7 } });
    const wake = setInterval(() => c.burst('body', 40, 585, { n: 2, color: FOAM, vx: [-1.5, -0.5], vy: [-1.5, -0.5], g: 0.08, size: [5, 10] }), 140);
    await c.anim(1800, { body: { tx: 300, r: 9 } });
    clearInterval(wake);
    await c.anim(600, { body: { r: 2 } });
    await c.anim(1800, { body: { tx: 0, r: 0 } });
  },
};

// ---------- 拖船：「Toot toot!」短短兩聲，煙囪噗噗冒煙，往前推一段再回來 ----------
// 圖 742×641（船頭在右），吃水線 y = 580，煙囪口在 (415, 112)
const tugboat = {
  id: 'tugboat', en: 'Tugboat', zh: '拖船', x: 1060, y: 765, s: 0.36,
  hint: [480, -230],
  pivots: { body: [370, 580] },
  art: (p) => afloat(p, 742, 641, 580, IMG('tugboat', 742, 641)),
  async act(c) {
    speak('Toot toot!', { queue: true });
    horn([[0.9, 0.3], [1.35, 0.3]], 196);
    for (let i = 0; i < 4; i++) {
      c.burst('body', 415, 112, { n: 5, color: SMOKE, vx: [-0.8, 0.4], vy: [-2.2, -1.2], g: -0.01, size: [12, 20], life: 1200 });
      await c.anim(220, { body: { sy: 0.97 } });
      await c.anim(220, { body: { sy: 1 } });
    }
    const wake = setInterval(() => c.burst('body', 20, 580, { n: 3, color: FOAM, vx: [-1.5, -0.5], vy: [-1.8, -0.6], g: 0.08, size: [6, 11] }), 120);
    await c.anim(1500, { body: { tx: 200, r: -2 } });
    clearInterval(wake);
    await bob(c, 1, 8, 300);
    await c.anim(1500, { body: { tx: 0, r: 0 } });
  },
};

// ---------- 漁船：船尾的吊桿放下漁網，沉到水裡，拉上來的時候網子裡都是魚 ----------
// 圖 682×482（船頭在右），吃水線 y = 440，吊桿尖端在 (72, 92)
// 漁網和繩子是程式畫的，放在船身裡面：沉到吃水線以下時一樣只看得到半透明的影子
const NET_TOP = 170, NET_DROP = 300; // 漁網平常掛在 y = 170；放下去要再往下多少
const FISH = ['#ff8a3d', '#ffd23f', '#ff5d73', '#8a7dff'];
const fishing = {
  id: 'fishing', en: 'Fishing Boat', zh: '漁船', x: 470, y: 738, s: 0.5,
  hint: [360, -180],
  art(p) {
    const mesh = [-18, -6, 6, 18].map((x) => `M${x},0 L${x * 0.6},56`).join('') + 'M-30,18 H30 M-27,36 H27';
    const fish = FISH.map((f, i) => {
      const [x, y] = [[-14, 22], [12, 28], [-4, 42], [16, 46]][i];
      return `<g transform="translate(${x} ${y}) rotate(${i % 2 ? 20 : -15})"><ellipse rx="11" ry="6" fill="${f}"/><path d="M9,0 l9,-6 v12z" fill="${f}"/><circle cx="-5" cy="-1" r="1.6" fill="#223"/></g>`;
    }).join('');
    const net =
      `<line id="${p}-rope" x1="72" y1="92" x2="72" y2="${NET_TOP}" stroke="#f3efe4" stroke-width="4"/>` +
      `<g transform="translate(72 ${NET_TOP})"><g id="${p}-net">` +
        `<g id="${p}-fish" opacity="0">${fish}</g>` +
        `<path d="M-32,0 Q-34,48 0,62 Q34,48 32,0Z" fill="#e8a13a" fill-opacity=".22" stroke="#e8a13a" stroke-width="4"/>` +
        `<path d="${mesh}" stroke="#e8a13a" stroke-width="2.5" fill="none"/>` +
        `<rect x="-35" y="-4" width="70" height="8" rx="4" fill="#c4682a"/>` +
      '</g></g>';
    return afloat(p, 682, 482, 440, IMG('fishing', 682, 482) + net);
  },
  async act(c) {
    const rope = c.el('rope');
    const follow = () => rope.setAttribute('y2', NET_TOP + c.get('net').ty);
    // 1. 漁網放下去，碰到水面濺起水花
    await c.anim(1300, { net: { ty: NET_DROP } }, (t) => {
      follow();
      if (!c.state.splashed && NET_TOP + c.get('net').ty > 440) {
        c.state.splashed = true;
        c.burst('body', 72, 440, { n: 12, color: FOAM, vx: [-2, 2], vy: [-4, -1.5], size: [5, 10] });
      }
    });
    c.state.splashed = false;
    await c.wait(500);
    // 2. 魚游進網子
    await c.anim(500, { fish: { o: 1 } });
    await c.wait(300);
    // 3. 拉上來：重重的，網子晃一晃，魚活蹦亂跳
    await c.anim(1700, { net: { ty: 0 } }, follow);
    c.burst('body', 72, NET_TOP + 40, { n: 10, color: FOAM, vx: [-1.5, 1.5], vy: [-2, 0], size: [4, 8] });
    for (let i = 0; i < 3; i++) {
      await c.anim(160, { net: { r: 10 }, fish: { ty: -4 } });
      await c.anim(160, { net: { r: -10 }, fish: { ty: 0 } });
    }
    await c.anim(160, { net: { r: 0 } });
    await bob(c, 1, 5, 350);
    await c.anim(500, { fish: { o: 0 } });
  },
};

// ---------- 快艇：船頭翹起來，激起浪花往前衝出畫面右邊，再從左邊衝回來繞一圈 ----------
// 圖 874×305（船頭在右），吃水線 y = 255，船尾的馬達在 (30, 250)
// 要移多遠才會出畫面，依船身現在在場景裡的位置和放大倍率算（焦點模式會放大、移到中間）
const speedboat = {
  id: 'speedboat', en: 'Speedboat', zh: '快艇', x: 140, y: 922, s: 0.42,
  hint: [450, -105],
  pivots: { body: [120, 255] },
  art: (p) => afloat(p, 874, 305, 255, IMG('speedboat', 874, 305)),
  async act(c) {
    const body = c.el('body');
    const m = document.getElementById('root').getCTM().inverse().multiply(body.getCTM());
    const outRight = (SCENES.sea.w - m.e) / m.a + 40; // 船尾 (x = 0) 超過畫面右邊
    const outLeft = -m.e / m.a - 874 - 40; // 船頭 (x = 874) 還在畫面左邊外面
    await c.anim(300, { body: { r: -6 } });
    const spray = setInterval(() => c.burst('body', 30, 250, { n: 5, color: FOAM, vx: [-4, -1.5], vy: [-4, -1.5], g: 0.25, size: [6, 12] }), 60);
    await c.anim(900, { body: { tx: outRight, r: -8 } }, null, (t) => t * t);
    c.set('body', { tx: outLeft });
    await c.wait(250);
    await c.anim(900, { body: { tx: 0, r: -4 } }, null, (t) => 1 - (1 - t) ** 2);
    clearInterval(spray);
    await c.anim(300, { body: { r: 0 } });
    await bob(c, 1, 6, 260);
  },
};

// ---------- 潛水艇：「Splash!」潛到水裡，潛望鏡升起來左右看看，再浮上來 ----------
// 圖 714×523（船頭在右），吃水線 y = 420（只露出上半部）；潛望鏡在 (285～300, 0～150)
// 潛望鏡裁出來放在船身後面，下面接一段程式畫的管子：升起來的時候管子才不會斷掉
const PERI = RECT(250, 0, 332, 148);
const DIVE = 330; // 潛下去多少（塔頂 y 150 + 330 = 480，在吃水線以下）
const submarine = {
  id: 'submarine', en: 'Submarine', zh: '潛水艇', x: 790, y: 945, s: 0.42,
  hint: [500, -60],
  pivots: { peri: [292, 100] },
  box: [0, -420, 714, 420 + DIVE + 103], // 焦點模式把潛下去的深度也算進去，潛到水裡才不會跑出書外
  art(p) {
    const inner =
      CLIP(`${p}-cp`, PERI) + HOLE(`${p}-cb`, 714, 523, PERI) +
      `<g id="${p}-peri"><rect x="285" y="100" width="15" height="200" fill="#f6c21c"/>${IMG('submarine', 714, 523, `${p}-cp`)}</g>` +
      IMG('submarine', 714, 523, `${p}-cb`);
    return afloat(p, 714, 523, 420, inner);
  },
  async act(c) {
    speak('Splash!', { queue: true });
    for (let i = 0; i < 5; i++) c.burst('body', 150 + i * 110, 420, { n: 4, color: FOAM, vx: [-1.5, 1.5], vy: [-4, -1.5], size: [5, 10] });
    await c.anim(1600, { body: { ty: DIVE } });
    // 泡泡一顆一顆冒上來
    for (let i = 0; i < 6; i++) {
      c.burst('body', 420 + Math.random() * 200, 80, { n: 1, color: '#ffffff', vx: [-0.3, 0.3], vy: [-1.5, -0.8], g: -0.02, size: [5, 9], life: 700 });
      await c.wait(120);
    }
    // 潛望鏡升起來，左右轉頭看看
    await c.anim(700, { peri: { ty: -150 } });
    await c.anim(400, { peri: { sx: -1 } });
    await c.wait(400);
    await c.anim(400, { peri: { sx: 1 } });
    await c.wait(300);
    await c.anim(500, { peri: { ty: 0 } });
    // 浮上來
    await c.anim(1500, { body: { ty: 0 } });
    for (let i = 0; i < 5; i++) c.burst('body', 150 + i * 110, 420, { n: 4, color: FOAM, vx: [-1.5, 1.5], vy: [-3, -1], size: [5, 10] });
    await bob(c, 1, 8, 350);
  },
};

// ---------- 燈塔：燈亮起來，光束繞著燈塔轉三圈 ----------
// 圖 556×666（不是船，立在礁石上），燈在 (312, 100)
// 光束往右照出去，左右翻（sx 從 1 變 -1）看起來就像繞著燈塔轉
const lighthouse = {
  id: 'lighthouse', en: 'Lighthouse', zh: '燈塔', x: 1405, y: 625, s: 0.32,
  hint: [312, -366],
  pivots: { beam: [312, 100], glow: [312, 100] },
  box: [0, -666, 556, 666], // 光束很長，焦點模式只算燈塔本身
  tag: [1405 + 278 * 0.32, 625 + 28], // 外框被光束撐大了，標籤位置自己指定
  art(p) {
    return '<g transform="translate(0 -666)">' +
      `<linearGradient id="${p}-lg" x1="0" x2="1"><stop offset="0" stop-color="#fff38a" stop-opacity="1"/><stop offset="1" stop-color="#fff6a8" stop-opacity="0"/></linearGradient>` +
      IMG('lighthouse', 556, 666) +
      `<g id="${p}-beam" opacity="0"><path d="M312,84 L1150,-60 L1150,260 L312,116Z" fill="url(#${p}-lg)"/></g>` +
      `<g id="${p}-glow" opacity="0"><circle cx="312" cy="100" r="46" fill="#fff6a8" opacity=".85"/><circle cx="312" cy="100" r="26" fill="#ffffff"/></g>` +
    '</g>';
  },
  async act(c) {
    await c.anim(400, { glow: { o: 1 }, beam: { o: 1 } });
    for (let i = 0; i < 3; i++) {
      await c.anim(650, { beam: { sx: -1 } });
      await c.anim(650, { beam: { sx: 1 } });
    }
    await c.anim(500, { glow: { o: 0 }, beam: { o: 0 } });
  },
};

SCENES.sea = {
  w: 1600,
  h: 1000,
  bg: () => `
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <text x="56" y="98" font-size="60" font-weight="900" fill="${LINE}">Sea</text>
    <text x="58" y="148" font-size="38" font-weight="900" fill="${LINE}" opacity=".7">海上</text>
  `,
  // 先畫後排（遠的），再畫前排
  items: [cargo, lighthouse, sailboat, fishing, tugboat, submarine, speedboat],
};
}
