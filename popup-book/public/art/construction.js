// 🏗️ 工地：點車子會唸英文名字，然後像機關書一樣動起來
// 版面 1600×1000（左右兩頁，中間是書縫）；後排地面 y = 720，前排地面 y = 965
// 每台車：art 畫圖（零件 id 是「<車子id>-<零件名>」）、pivots 零件的轉軸、act 點了以後的動作（用法見 app.js 的 makeCtx）
// 整個檔案包在 { } 裡，車子的變數名稱才不會跟其他頁面的檔案撞名
{
const PEBBLES = (x, w) => [0.25, 0.5, 0.72].map((f, i) =>
  `<circle cx="${x + w * f}" cy="${-8 - i * 7}" r="5" fill="#7d5428"/>`).join('');

// ---------- 塔式起重機（連蓋到一半的大樓）：把鋼樑吊上樓頂，再點一次吊回地面 ----------
const CRANE_D = 74; // 吊鉤到鋼樑底部的距離
function craneDraw(c) {
  const s = c.state;
  if (s.carry) { s.bx = s.tx; s.by = s.hy + CRANE_D; }
  c.set('trolley', { tx: s.tx });
  c.set('hook', { tx: s.tx, ty: s.hy });
  c.set('beam', { tx: s.bx, ty: s.by });
  const cable = c.el('cable');
  cable.setAttribute('x1', s.tx);
  cable.setAttribute('x2', s.tx);
  cable.setAttribute('y2', s.hy);
}

const towerCrane = {
  id: 'crane', en: 'Tower Crane', zh: '塔式起重機', x: 1400, y: 720, s: 0.78,
  hint: [-560, -500],
  label: [-260, -800],
  art(p) {
    const out = [];
    // 蓋到一半的大樓
    out.push('<rect x="-330" y="-430" width="290" height="430" fill="#e4e6ec"/>');
    for (const [top, bottom] of [[-150, 0], [-290, -150], [-430, -290]]) {
      for (const [a, b] of [[-312, -195], [-177, -60]]) {
        out.push(`<rect x="${a + 14}" y="${top + 20}" width="${b - a - 28}" height="${bottom - top - 40}" rx="4" fill="#9aa6ba"/>`);
      }
    }
    for (const x of [-372, -352]) out.push(K.bar(x, 0, x, -440, 3, '#3c7fd1'));
    for (const y of [-80, -150, -220, -290, -360, -430]) out.push(K.bar(-372, y, -330, y, 3, '#3c7fd1'));
    for (const x of [-330, -195, -60]) out.push(K.rect(x, -430, 18, 430, '#b8bcc8', 3));
    for (const y of [-150, -290, -430]) out.push(K.rect(-345, y - 14, 320, 16, '#cfd2da', 3));
    for (const x of [-325, -315, -190, -180, -55, -45]) out.push(K.line(x, -446, x, -474, 3, '#8a6a4a'));
    out.push(K.worker(-90, -444, 0.85, '#2ea8ff'));

    // 塔吊：底座、塔身、吊臂、平衡臂
    out.push(K.rect(-52, -22, 104, 22, '#8d90a0', 4));
    for (let y = -20; y > -760; y -= 40) out.push(K.line(-22, y, 22, y - 40, 5, '#d9960f'));
    out.push(K.bar(-22, -20, -22, -764, 6, '#f6b51e') + K.bar(22, -20, 22, -764, 6, '#f6b51e'));
    out.push(K.line(0, -880, -430, -790, 3) + K.line(0, -880, 165, -790, 3));
    out.push(K.bar(0, -790, 0, -880, 7, '#f6b51e'));
    for (let x = -650; x < 160; x += 30) out.push(K.line(x, -764, x + 15, -790, 4, '#d9960f') + K.line(x + 15, -790, x + 30, -764, 4, '#d9960f'));
    out.push(K.bar(-650, -790, 170, -790, 6, '#f6b51e') + K.bar(-650, -764, 170, -764, 6, '#f6b51e'));
    out.push(K.rect(104, -764, 64, 54, '#9a9dab', 4) + K.line(112, -740, 160, -740, 3) + K.line(112, -724, 160, -724, 3));
    out.push(K.rect(24, -764, 56, 48, '#f4f4f6', 6) + K.win(32, -756, 40, 28, 5));

    // 鋼樑、鋼索、小車、吊鉤（位置都由 craneDraw 決定）
    out.push(`<g id="${p}-beam"><g id="${p}-sling" opacity="0">${K.line(0, -26, -72, -18, 3)}${K.line(0, -26, 72, -18, 3)}</g>` +
      K.rect(-86, -20, 172, 20, '#e2572a', 4) + K.line(-78, -10, 78, -10, 3, '#b8401c') + '</g>');
    out.push(`<line id="${p}-cable" x1="0" y1="-752" x2="0" y2="-560" stroke="${LINE}" stroke-width="3"/>`);
    out.push(`<g id="${p}-trolley">${K.rect(-18, -766, 36, 16, '#77768a', 3, 3)}</g>`);
    // 吊鉤外面多一圈透明的範圍，小朋友比較好點
    out.push(`<g id="${p}-hook"><circle cx="2" cy="24" r="46" fill="transparent"/>${K.rect(-15, 0, 30, 24, '#ffcf1f', 4, 3)}${K.path('M0,24 L0,36 Q0,48 10,48 Q19,48 19,39', 'none', 4)}</g>`);
    return out.join('');
  },
  setup(c) {
    Object.assign(c.state, { tx: -560, hy: -560, bx: -560, by: 0, carry: false, at: 'ground' });
    craneDraw(c);
  },
  async act(c) {
    const s = c.state;
    const go = (to) => {
      const from = {};
      let dist = 0;
      for (const k in to) { from[k] = s[k]; dist = Math.max(dist, Math.abs(to[k] - s[k])); }
      return c.tween(350 + dist * 1.7, (t) => { for (const k in to) s[k] = lerp(from[k], to[k], t); craneDraw(c); });
    };
    const [dx, dy] = s.at === 'ground' ? [-180, -444] : [-560, 0]; // 樓頂 / 地面
    await go({ hy: s.by - CRANE_D });
    await c.anim(250, { sling: { o: 1 } });
    s.carry = true;
    await go({ hy: -660 });
    await go({ tx: dx });
    await go({ hy: dy - CRANE_D });
    s.carry = false;
    await c.anim(250, { sling: { o: 0 } });
    await go({ hy: -560 });
    s.at = s.at === 'ground' ? 'roof' : 'ground';
  },
};

// ---------- 水泥攪拌車：滾筒轉起來，滑槽倒出水泥 ----------
const MIXER_DRUM = 'M44,-118 Q50,-214 160,-226 L258,-206 Q306,-190 306,-142 Q306,-100 258,-94 L84,-94 Q44,-96 44,-118 Z';
const mixer = {
  id: 'mixer', en: 'Cement Mixer', zh: '水泥攪拌車', x: 60, y: 720, s: 0.8,
  hint: [175, -160],
  pivots: { chute: [44, -112] },
  art(p) {
    let stripes = '';
    for (let i = -8; i < 14; i++) stripes += `<path d="M${i * 44},-240 l26,0 l-40,160 l-26,0 Z" fill="#f29c1f"/>`;
    return K.rect(18, -82, 396, 22, '#3b3a48', 4) +
      K.rect(118, -98, 14, 20, '#77768a', 2, 3) + K.rect(250, -98, 14, 20, '#77768a', 2, 3) +
      `<clipPath id="${p}-clip"><path d="${MIXER_DRUM}"/></clipPath>` +
      `<path d="${MIXER_DRUM}" fill="#eef0f4"/>` +
      `<g clip-path="url(#${p}-clip)"><g id="${p}-stripes">${stripes}</g></g>` +
      `<path d="${MIXER_DRUM}" fill="none" stroke="${LINE}" stroke-width="4"/>` +
      `<g id="${p}-chute">${K.path('M44,-112 L8,-78 L18,-68 L54,-102 Z', '#9a9dab')}</g>` +
      K.rect(318, -184, 96, 108, '#2f7fd8', 12) + '<rect x="320" y="-120" width="92" height="10" fill="#fff"/>' +
      K.win(344, -174, 58, 44, 6) + K.head(370, -146, 13) + K.rect(404, -104, 12, 14, '#ffe27a', 3, 3) +
      K.wheel(`${p}-w1`, 82, -32, 32) + K.wheel(`${p}-w2`, 152, -32, 32) + K.wheel(`${p}-w3`, 356, -32, 32);
  },
  async act(c) {
    const spin = c.anim(2600, { stripes: { tx: -44 * 9 } });
    await c.anim(500, { chute: { r: -28 } });
    for (let i = 0; i < 7; i++) {
      c.burst('chute', 12, -72, { n: 5, color: '#a3a6b4', vx: [-1.8, -0.4], vy: [0, 1.2], g: 0.35, life: 700 });
      await c.wait(200);
    }
    await spin;
    c.set('stripes', { tx: 0 });
    await c.anim(400, { chute: { r: 0 } });
  },
};

// ---------- 推土機：鏟子放下，把土堆往前推 ----------
const bulldozer = {
  id: 'dozer', en: 'Bulldozer', zh: '推土機', x: 470, y: 720, s: 0.8,
  hint: [130, -100],
  art(p) {
    return `<g id="${p}-pile">${K.path('M300,0 Q352,-66 406,0 Z', '#a8743f')}${PEBBLES(300, 106)}</g>` +
      `<g id="${p}-body">` +
        K.rect(16, -62, 226, 62, '#3b3a48', 31) +
        [48, 98, 148, 198].map((x) => K.wheel(`${p}-w${x}`, x + 6, -31, 19)).join('') +
        K.rect(28, -142, 198, 82, '#f6b51e', 12) + `<rect x="28" y="-100" width="198" height="9" fill="${LINE}"/>` +
        K.rect(170, -178, 12, 38, '#77768a', 3, 3) +
        K.rect(40, -234, 94, 94, '#f6b51e', 10) + K.win(52, -224, 70, 60) + K.head(90, -190, 14) +
        K.bar(204, -96, 270, -66, 10, '#d9960f') +
        `<g id="${p}-blade">${K.path('M262,-152 Q298,-80 266,-4 L286,-4 Q320,-80 284,-152 Z', '#d9960f')}</g>` +
      '</g>';
  },
  setup(c) { c.set('blade', { ty: -26 }); },
  async act(c) {
    await c.anim(350, { blade: { ty: 0 } });
    await c.anim(1400, { body: { tx: 110 }, pile: { tx: 110 }, ...c.wheels(330) });
    await c.anim(350, { blade: { ty: -26 } });
    await c.anim(1200, { body: { tx: 0 }, ...c.wheels(-330) });
    // 推走的土堆消失，原來的地方再冒出一堆新的
    await c.anim(300, { pile: { o: 0 } });
    c.set('pile', { tx: 0 });
    await c.anim(400, { pile: { o: 1 } });
  },
};

// ---------- 流動廁所：門打開，裡面的工人揮手 ----------
const toilet = {
  id: 'toilet', en: 'Portable Toilet', zh: '流動廁所', x: 1462, y: 720, s: 0.85,
  hint: [42, -60],
  pivots: { door: [10, 0], arm: [52, -80] },
  art(p) {
    return K.rect(0, -162, 84, 162, '#3c9ad6', 8) + K.rect(-6, -176, 96, 18, '#5bb6ea', 8) +
      '<rect x="10" y="-146" width="64" height="140" fill="#1d4466"/>' +
      K.rect(24, -90, 32, 62, '#ff7a1a', 9, 3) + K.head(40, -106, 15) +
      `<g id="${p}-arm">${K.bar(52, -80, 68, -114, 6, '#ff7a1a')}${K.circle(69, -118, 7, '#f3c9a0', 3)}</g>` +
      `<g id="${p}-door">${K.rect(10, -146, 64, 140, '#4fb0ea', 4)}` +
        `<path d="M42,-130 a10,10 0 1,0 9,13 a8,8 0 1,1 -9,-13 Z" fill="${LINE}"/>${K.circle(64, -76, 4, '#fff', 2)}</g>`;
  },
  async act(c) {
    await c.anim(450, { door: { sx: -0.45 } });
    await c.wait(250);
    speak('Hello!');
    for (let i = 0; i < 3; i++) {
      await c.anim(170, { arm: { r: -28 } });
      await c.anim(170, { arm: { r: 16 } });
    }
    await c.anim(170, { arm: { r: 0 } });
    await c.wait(300);
    await c.anim(450, { door: { sx: 1 } });
  },
};

// ---------- 挖土機：伸到土堆挖一口，舉起來倒掉 ----------
const excavator = {
  id: 'excavator', en: 'Excavator', zh: '挖土機', x: 30, y: 965, s: 1,
  hint: [170, -125],
  pivots: { boom: [175, -150], stick: [325, -292], bucket: [392, -146], pile: [420, 0] },
  art(p) {
    return `<g id="${p}-pile">${K.path('M340,0 Q420,-76 500,0 Z', '#a8743f')}${PEBBLES(340, 160)}</g>` +
      K.rect(10, -64, 252, 64, '#3b3a48', 32) + K.rect(34, -74, 206, 14, '#55546a', 4, 3) +
      [50, 105, 160, 215].map((x) => K.wheel(`${p}-w${x}`, x, -32, 19)).join('') +
      K.rect(62, -92, 150, 20, '#3b3a48', 4) +
      K.rect(8, -156, 56, 66, '#d9960f', 12) +
      K.rect(22, -166, 200, 80, '#f6b51e', 12) + `<rect x="22" y="-116" width="200" height="10" fill="${LINE}"/>` +
      K.rect(52, -194, 12, 32, '#77768a', 3, 3) +
      K.rect(120, -250, 98, 90, '#f6b51e', 12) + K.win(132, -240, 74, 64) + K.head(172, -200, 14) +
      `<g id="${p}-boom">` +
        K.poly('160,-138 188,-166 320,-308 340,-284 206,-126', '#f6b51e') +
        K.bar(200, -152, 282, -246, 7, '#9a9dab') + K.circle(175, -150, 8, '#9a9dab', 3) +
        `<g id="${p}-stick">` +
          K.poly('312,-302 340,-304 404,-152 380,-140', '#f6b51e') + K.circle(325, -292, 8, '#9a9dab', 3) +
          `<g id="${p}-bucket">` +
            K.path('M392,-150 L430,-134 Q442,-96 414,-70 L382,-80 Q398,-110 392,-150 Z', '#4b4a5c') +
            K.path('M404,-74 l2,12 l8,-9 M414,-71 l2,12 l7,-11', 'none', 3) +
            `<g id="${p}-load" opacity="0">${K.path('M384,-82 Q386,-110 406,-104 Q424,-96 414,-70 Z', '#a8743f', 3)}</g>` +
            K.circle(392, -146, 8, '#9a9dab', 3) +
          '</g>' +
        '</g>' +
      '</g>';
  },
  async act(c) {
    await c.anim(800, { boom: { r: 22 }, stick: { r: -10 }, bucket: { r: -22 } }); // 伸到土堆
    c.burst('bucket', 414, -72, { n: 6, vy: [-3, -1] });
    await c.anim(550, { bucket: { r: 60 }, load: { o: 1 }, pile: { sy: 0.78 } }); // 挖一口
    await c.anim(800, { boom: { r: -12 }, stick: { r: -18 } }); // 舉起來
    c.burst('bucket', 404, -88, { n: 12 });
    await c.anim(450, { bucket: { r: -45 }, load: { o: 0 } }); // 倒掉
    c.burst('bucket', 414, -72, { n: 10 });
    await c.anim(800, { boom: { r: 0 }, stick: { r: 0 }, bucket: { r: 0 }, pile: { sy: 1 } });
  },
};

// ---------- 砂石車：車斗舉起來，把土倒在後面 ----------
const dumpTruck = {
  id: 'dump', en: 'Dump Truck', zh: '砂石車', x: 540, y: 965, s: 0.95,
  hint: [140, -130],
  pivots: { bed: [26, -84] },
  art(p) {
    return K.rect(18, -82, 352, 22, '#3b3a48', 4) +
      `<line id="${p}-piston" x1="178" y1="-76" x2="178" y2="-86" stroke="#9a9dab" stroke-width="10" stroke-linecap="round"/>` +
      `<g id="${p}-bed">` +
        `<g id="${p}-load">${K.path('M28,-176 Q92,-222 150,-198 Q214,-222 262,-172 Z', '#a8743f')}</g>` +
        K.poly('22,-84 264,-84 270,-174 16,-180', '#f26b1d') +
        [70, 120, 170, 220].map((x) => K.line(x, -92, x + 1, -168, 4, '#c94f12')).join('') +
        K.rect(12, -188, 264, 14, '#f68a45', 5) +
      '</g>' +
      K.path('M276,-82 L276,-178 Q276,-188 288,-188 L338,-188 Q352,-188 358,-172 L374,-122 L374,-82 Z', '#f26b1d') +
      K.win(292, -176, 52, 46, 6) + K.head(318, -150, 13) + K.rect(364, -112, 12, 14, '#ffe27a', 3, 3) +
      K.wheel(`${p}-w1`, 74, -32, 32) + K.wheel(`${p}-w2`, 146, -32, 32) + K.wheel(`${p}-w3`, 320, -32, 32);
  },
  async act(c) {
    const piston = c.el('piston');
    // 頂桿：下端固定在底盤，上端跟著車斗轉
    const upd = () => {
      const r = (c.get('bed').r * Math.PI) / 180;
      piston.setAttribute('x2', (26 + 152 * Math.cos(r) + 2 * Math.sin(r)).toFixed(1));
      piston.setAttribute('y2', (-84 + 152 * Math.sin(r) - 2 * Math.cos(r)).toFixed(1));
    };
    await c.anim(900, { bed: { r: -40 } }, upd);
    const pour = c.anim(800, { load: { tx: -150, ty: 30, o: 0 } });
    for (let i = 0; i < 5; i++) {
      c.burst('bed', 18, -150 + i * 10, { n: 6, vx: [-2.2, -0.6], vy: [-1, 1] });
      await c.wait(150);
    }
    await pour;
    await c.wait(250);
    await c.anim(900, { bed: { r: 0 } }, upd);
    c.set('load', { tx: 0, ty: 0 });
    await c.anim(400, { load: { o: 1 } });
  },
};

// ---------- 堆高機：把一疊磚頭舉高再放下 ----------
const forklift = {
  id: 'forklift', en: 'Forklift', zh: '堆高機', x: 950, y: 965, s: 0.9,
  hint: [110, -80],
  art(p) {
    return K.rect(172, -264, 18, 260, '#77768a', 4) +
      K.rect(8, -122, 46, 72, '#c23a2e', 10) +
      K.rect(30, -114, 146, 64, '#e84a3c', 12) +
      K.rect(100, -152, 28, 42, '#2ea8ff', 8, 3) + K.head(114, -166, 14) +
      K.bar(66, -112, 66, -216, 4, '#3b3a48') + K.bar(158, -112, 158, -216, 4, '#3b3a48') +
      K.rect(56, -224, 112, 12, '#3b3a48', 4) +
      `<g id="${p}-fork">` +
        K.rect(190, -112, 12, 106, '#55546a', 3, 3) + K.rect(190, -14, 80, 9, '#55546a', 3, 3) +
        K.rect(198, -32, 68, 18, '#c49a5c', 3, 3) +
        [[200, -54], [234, -54], [216, -76]].map(([x, y]) => K.rect(x, y, 30, 20, '#d0573c', 3, 3)).join('') +
      '</g>' +
      K.wheel(`${p}-w1`, 66, -30, 30) + K.wheel(`${p}-w2`, 156, -26, 26);
  },
  async act(c) {
    await c.anim(1100, { fork: { ty: -150 } });
    await c.wait(500);
    await c.anim(1000, { fork: { ty: 0 } });
  },
};

// ---------- 壓路機：往前壓一段路再倒回來（車頭朝左） ----------
const roller = {
  id: 'roller', en: 'Road Roller', zh: '壓路機', x: 1250, y: 965, s: 0.9,
  hint: [200, -100],
  art(p) {
    return `<g id="${p}-body">` +
      K.rect(36, -130, 92, 34, '#f6b51e', 8) +
      K.rect(104, -142, 198, 94, '#f6b51e', 14) + `<rect x="104" y="-104" width="198" height="10" fill="${LINE}"/>` +
      K.rect(206, -182, 40, 42, '#2ea8ff', 8, 3) + K.head(226, -196, 14) +
      K.bar(184, -246, 184, -142, 4, '#3b3a48') + K.bar(276, -246, 276, -142, 4, '#3b3a48') +
      K.rect(172, -256, 114, 12, '#3b3a48', 4) +
      `<g id="${p}-drum" class="wheel" data-cx="80" data-cy="-56">` +
        K.circle(80, -56, 56, '#9a9dab') + K.circle(80, -56, 20, '#6d7080', 3) +
        K.line(80, -110, 80, -78, 5) + K.line(80, -34, 80, -2, 5) + K.line(26, -56, 58, -56, 5) + K.line(102, -56, 134, -56, 5) +
      '</g>' +
      K.wheel(`${p}-w1`, 254, -40, 40) +
      '</g>';
  },
  async act(c) {
    await c.anim(1500, { body: { tx: -100 }, ...c.wheels(-130) });
    await c.wait(250);
    await c.anim(1400, { body: { tx: 0 }, ...c.wheels(130) });
  },
};

SCENES.construction = {
  w: 1600,
  h: 1000,
  bg: () => `
    <defs>
      <linearGradient id="c-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#a9dcff"/><stop offset="1" stop-color="#e6f6ff"/>
      </linearGradient>
    </defs>
    <rect width="1600" height="1000" fill="url(#c-sky)"/>
    <circle cx="700" cy="150" r="56" fill="#ffd84a"/>
    ${K.cloud(250, 220, 1)}${K.cloud(990, 190, 0.8)}${K.cloud(560, 330, 0.6)}
    <g fill="#d3e2ef">
      ${[[30, 540, 90], [140, 480, 70], [230, 570, 110], [370, 510, 80], [700, 530, 100], [820, 470, 70], [950, 560, 90], [1540, 520, 60]]
        .map(([x, y, w]) => `<rect x="${x}" y="${y}" width="${w}" height="${700 - y}"/>`).join('')}
    </g>
    <rect y="690" width="1600" height="310" fill="#f0d49c"/>
    <path d="M0,905 Q400,888 800,905 T1600,900 L1600,1000 L0,1000 Z" fill="#e5c07c"/>
    <text x="56" y="98" font-size="60" font-weight="900" fill="${LINE}">Construction Site</text>
    <text x="58" y="148" font-size="38" font-weight="900" fill="${LINE}" opacity=".7">工地</text>
    ${K.worker(1070, 722, 0.7, '#2ea8ff')}
  `,
  front: () => K.worker(920, 968, 0.8) + K.cone(1222, 992, 0.7) + K.cone(1582, 992, 0.7),
  // 先畫後排，再畫前排（後畫的會蓋在上面）
  items: [towerCrane, mixer, bulldozer, toilet, excavator, dumpTruck, forklift, roller],
};
}
