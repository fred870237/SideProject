// 交通工具插圖（座標範圍 -50 ~ 50，輪子底部在 y = 44），車頭大多朝左
// 畫法和動物一樣：粗深色外框＋平塗顏色，著色本會自動把它們變成線稿
Object.assign(ART, (() => {
  const { st, circle, ell, flat, flatPath, path, line, both, g } = K;

  const GLASS = '#bfe6ff', TIRE = '#3b3640', HUB = '#d6dbe1', STEEL = '#9aa3ad', DARK = '#5a5560';
  const rr = (x, y, w, h, r, fill) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ${st(fill)}/>`;
  // 輪子：輪胎＋輪框，預設底部貼地
  const wheel = (x, r = 8, y = 44 - r) => circle(x, y, r, TIRE) + circle(x, y, r * 0.45, HUB);
  // 有外框的粗棍子（吊臂、車架、梯子）
  const bar = (d, c, w = 6) => line(d, LINE, w + 3.5) + line(d, c, w);
  const shine = (x, y, w = 5, h = 2.2) => flat(x, y, w, h, '#fff', -20, 0.9);
  const lamp = (x, y, r = 3, c = '#ffe066') => circle(x, y, r, c);
  // 履帶：圓角長條＋裡面的小輪子
  const tracks = (x, y, w, h = 13) => {
    const r = h / 2 - 2.2, n = Math.max(2, Math.round(w / 13));
    let wh = '';
    for (let i = 0; i < n; i++) wh += circle((x + h / 2 + (i * (w - h)) / (n - 1)).toFixed(1), y + h / 2, r, HUB);
    return rr(x, y, w, h, h / 2, DARK) + wh;
  };

  // 一般小汽車（車頭朝左），extra 是車身上的裝飾
  const car = (c, extra = '', roof = '') =>
    roof + path('M-26 16 L-15 -2 Q-13 -5 -9 -5 H14 Q18 -5 20 -2 L30 16Z', c) +
    rr(-42, 13, 84, 22, 9, c) +
    path('M-20 13 L-12 0 H-2 V13Z', GLASS) + path('M3 13 V0 H14 L22 13Z', GLASS) +
    shine(-11, 4, 3, 1.5) + extra +
    lamp(-38, 21) + rr(36, 18, 5, 6, 2, '#ff6b6b') +
    line('M0 17 v8', LINE, 1.6) +
    wheel(-23) + wheel(23);

  // 卡車車頭（朝左），x0 是車頭最前面，回傳車頭＋窗戶
  const cab = (x0, top, c, w = 26) =>
    path(`M${x0} 34 V${top + 10} Q${x0} ${top} ${x0 + 9} ${top} H${x0 + w} V34Z`, c) +
    path(`M${x0 + 4} ${top + 15} V${top + 8} Q${x0 + 4} ${top + 4} ${x0 + 9} ${top + 4} H${x0 + w - 4} V${top + 15}Z`, GLASS) +
    shine(x0 + 10, top + 8, 3, 1.4) + lamp(x0 + 2, 26);

  // 廂型車（救護車、郵車、冰淇淋車、露營車）
  const van = (c, extra = '', roof = '') =>
    roof + path('M-44 34 V8 Q-44 2 -38 0 L-28 -12 Q-26 -14 -22 -14 H40 Q44 -14 44 -10 V34Z', c) +
    path('M-40 6 L-30 -8 H-18 V6Z', GLASS) + shine(-27, -3, 3, 1.4) +
    rr(-14, -8, 18, 13, 3, GLASS) + extra +
    lamp(-41, 24) + rr(40, 20, 4, 7, 1.5, '#ff6b6b') +
    rr(-46, 32, 92, 5, 2.5, STEEL) +
    wheel(-26) + wheel(26);

  // 直升機
  const heli = (c, extra = '') =>
    rr(-4, -20, 8, 8, 2, STEEL) + bar('M-42 -22 H34', DARK, 3.4) +
    path('M14 0 L46 -8 V2 L16 14Z', c) + path('M40 -8 L48 -22 L50 -8Z', c) + circle(44, -2, 5, STEEL) +
    ell(-6, 6, 26, 18, c) + path('M-31 4 Q-30 -10 -14 -11 V8 Z', GLASS) + shine(-23, -4, 3, 1.4) +
    extra +
    line('M-18 24 V34 M8 24 V34', LINE, 2.4) + bar('M-30 36 H20 Q24 36 26 33', STEEL, 3);

  // 鐵軌（火車用）
  const rails = (x0 = -48, x1 = 48) => {
    let ties = '';
    for (let x = x0 + 4; x < x1; x += 10) ties += `M${x} 42 v4 `;
    return line(ties, '#8a5a3a', 3) + line(`M${x0} 42.5 H${x1}`, STEEL, 2.4);
  };

  // 水波（船用）
  const water = () => flatPath('M-50 34 q6.25 -4 12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 V48 H-50Z', '#7cc9ee') +
    line('M-50 34 q6.25 -4 12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0', '#3b9fd6', 2.2);

  return {
    /* ---------- 工地 ---------- */
    excavator: () => {
      const y = '#ffc21a';
      return tracks(-26, 31, 70) +
        rr(-12, 24, 50, 9, 3, DARK) +
        // 機身後半（引擎和配重）
        path('M2 26 V4 Q2 0 6 0 H36 Q46 0 46 10 V26Z', y) +
        line('M26 8 v12 M31 8 v12 M36 8 v12', '#c98f00', 1.8) +
        rr(14, -9, 4, 10, 1.5, DARK) +
        // 大手臂（彎彎的，從駕駛室後面伸出來）、小手臂、油壓桿
        bar('M8 14 Q-4 -32 -28 -36', y, 10) +
        bar('M-26 -44 L-40 -2', y, 7) +
        bar('M-8 -31 L-26 -44', STEEL, 2.6) +
        // 挖斗＋牙齒
        path('M-38 -6 Q-53 -4 -53 11 Q-52 22 -40 25 L-28 25 Q-30 10 -38 -6Z', STEEL) +
        path('M-40 25 l2 5 l2.5 -5 l2 5 l2.5 -5 l2 5 l2 -5', '#7c8590') +
        // 高高的駕駛室，大窗戶
        path('M-16 26 V-10 Q-16 -18 -8 -18 H10 V26Z', y) +
        path('M-12 8 V-9 Q-12 -14 -7 -14 H6 V8Z', GLASS) + shine(-6, -9, 3, 1.4) +
        bar('M-19 24 L-11 -12', STEEL, 3) +
        circle(-28, -36, 3, STEEL) + circle(-40, -2, 3, STEEL) + circle(-19, 24, 2.4, STEEL);
    },

    bulldozer: () => {
      const y = '#ffb020';
      return tracks(-22, 31, 64) +
        rr(-18, 8, 56, 24, 5, y) +
        rr(0, -16, 28, 26, 4, y) + rr(4, -12, 20, 14, 3, GLASS) + shine(10, -8, 3, 1.4) +
        rr(32, -4, 4, 12, 1.5, DARK) +
        bar('M-20 22 L-34 26', DARK, 4) +
        path('M-46 42 Q-50 22 -44 6 L-34 8 Q-38 24 -34 42Z', STEEL) +
        line('M-45 12 h8 M-46 20 h9 M-46 28 h10', '#7c8590', 1.6);
    },

    crane: () => {
      const r = '#e53935', y = '#ffc21a';
      return g(rr(0, -5, 66, 10, 3, y) + line('M8 -5 v10 M18 -5 v10 M28 -5 v10 M38 -5 v10 M48 -5 v10 M58 -5 v10', LINE, 1.4), 'translate(20 8) rotate(-128)') +
        line('M-21 -43 V-12', LINE, 1.6) + path('M-24 -12 h6 v4 q0 6 -5 5', 'none') +
        rr(-48, 14, 94, 20, 4, r) + cab(-48, -4, r, 20) +
        rr(10, 2, 26, 14, 3, y) +
        wheel(-30) + wheel(4) + wheel(30);
    },

    'dump-truck': () => {
      const y = '#ffc21a', dirt = '#a0703c';
      return g(path('M-2 -6 Q8 -24 26 -18 Q40 -22 46 -8Z', dirt) + path('M-4 -8 H48 L44 18 H0Z', y) +
        line('M10 -6 v22 M22 -6 v22 M34 -6 v22', '#d99a00', 2), 'rotate(-12 0 20)') +
        rr(-14, 22, 60, 10, 3, DARK) +
        cab(-46, -2, y, 28) +
        wheel(-30, 9) + wheel(12, 9) + wheel(32, 9);
    },

    'cement-mixer': () => {
      const o = '#ff8a3d', drum = '#e6e9ef';
      return rr(-16, 22, 62, 10, 3, DARK) +
        ell(16, 4, 27, 17, drum, -12) +
        line('M0 -10 q8 10 0 24 M14 -14 q8 12 0 30 M28 -14 q8 12 0 26', o, 3) +
        path('M40 -4 L48 -10 L48 4Z', STEEL) +
        cab(-46, -4, o, 26) +
        wheel(-30, 9) + wheel(14, 9) + wheel(34, 9);
    },

    'road-roller': () => {
      const y = '#ffc21a';
      return line('M-6 -16 V8 M28 -16 V8', LINE, 3) + rr(-12, -22, 46, 7, 3, y) +
        rr(-20, 4, 60, 22, 5, y) + rr(-6, -12, 10, 16, 2, GLASS) +
        rr(-48, 14, 32, 30, 12, STEEL) + line('M-44 22 h24 M-44 30 h24 M-44 38 h24', '#7c8590', 1.6) +
        bar('M-20 14 L-26 24', DARK, 4) +
        wheel(28, 11);
    },

    forklift: () => {
      const o = '#ff8a3d';
      return rr(-44, -12, 22, 18, 2, '#c98b55') + line('M-44 -3 h22 M-33 -12 v18', '#9a6a3e', 1.6) +
        bar('M-20 -34 V40', STEEL, 4) +
        bar('M-20 8 H-46', DARK, 3) + bar('M-20 38 H-46', DARK, 3) + rr(-46, 6, 26, 4, 1, STEEL) +
        line('M-12 -28 H26 M-12 -28 V14 M24 -28 V14', LINE, 3) +
        rr(-16, 12, 52, 22, 5, o) + rr(30, 2, 14, 32, 4, o) +
        rr(4, 0, 12, 12, 3, DARK) +
        wheel(-8, 10) + wheel(32, 8);
    },

    loader: () => {
      const y = '#ffc21a';
      return bar('M-6 10 L-30 -10', y, 7) +
        path('M-48 -22 Q-34 -26 -26 -18 L-30 4 Q-42 0 -48 -8Z', STEEL) + line('M-48 -8 l-2 4', LINE, 2) +
        rr(-14, 6, 60, 24, 6, y) +
        rr(-6, -20, 26, 28, 4, y) + rr(-2, -16, 18, 14, 3, GLASS) + shine(4, -12, 3, 1.4) +
        rr(30, -6, 4, 12, 1.5, DARK) +
        wheel(-4, 12) + wheel(34, 12);
    },

    'tower-crane': () => {
      const y = '#ffc21a';
      let lattice = '';
      for (let yy = 40; yy > -30; yy -= 10) lattice += `M-16 ${yy} L-4 ${yy - 10} M-4 ${yy} L-16 ${yy - 10} `;
      let jib = '';
      for (let x = -46; x < 44; x += 8) jib += `M${x} -36 L${x + 4} -30 L${x + 8} -36 `;
      return rr(-26, 38, 32, 6, 2, STEEL) +
        rr(-16, -32, 12, 72, 1, y) + line(lattice, '#d99a00', 1.4) +
        rr(-48, -38, 96, 8, 2, y) + line(jib, '#d99a00', 1.2) +
        path('M-10 -38 L-10 -48 L4 -38Z', y) +
        rr(30, -30, 16, 12, 2, STEEL) +
        rr(-4, -30, 12, 10, 2, GLASS) +
        line('M-36 -30 V2', LINE, 1.6) + path('M-39 2 h6 v3 q0 5 -4 4', 'none') +
        rr(-46, 10, 20, 14, 2, '#c98b55') + line('M-36 10 l-6 -4 M-36 10 l6 -4', LINE, 1.4);
    },

    /* ---------- 消防、救援 ---------- */
    'fire-truck': () => {
      const r = '#e53935';
      return rr(-14, -12, 60, 6, 2, '#cfd6de') + line('M-6 -12 v6 M4 -12 v6 M14 -12 v6 M24 -12 v6 M34 -12 v6', LINE, 1.4) +
        rr(-20, -4, 66, 38, 4, r) +
        rr(-14, 2, 16, 18, 2, '#ffcf3f') + rr(6, 2, 16, 18, 2, '#ffcf3f') + rr(26, 2, 14, 18, 2, '#ffcf3f') +
        flat(14, 26, 30, 2.2, '#fff') +
        cab(-48, -4, r, 28) + rr(-40, -10, 8, 6, 2, '#4fc3f7') + rr(-32, -10, 8, 6, 2, '#ff6b6b') +
        wheel(-32) + wheel(8) + wheel(32);
    },

    'ladder-truck': () => {
      const r = '#e53935';
      let rungs = '';
      for (let x = 8; x < 60; x += 8) rungs += `M${x} -4 v8 `;
      return g(rr(0, -4, 64, 8, 2, '#cfd6de') + line(rungs, LINE, 1.4) + rr(58, -8, 12, 14, 2, r), 'translate(34 -4) rotate(-148)') +
        rr(-20, 0, 66, 34, 4, r) + rr(20, -8, 16, 10, 3, STEEL) +
        flat(14, 22, 30, 2.2, '#fff') + rr(-14, 6, 14, 12, 2, '#ffcf3f') +
        cab(-48, -2, r, 28) +
        wheel(-32) + wheel(8) + wheel(32);
    },

    ambulance: () => van('#ffffff',
      flat(14, 18, 30, 2.6, '#e53935') +
      flatPath('M20 -4 h6 v6 h6 v6 h-6 v6 h-6 v-6 h-6 v-6 h6z', '#e53935'),
      rr(-28, -20, 10, 7, 2, '#ff6b6b') + rr(-18, -20, 10, 7, 2, '#4fc3f7')),

    'police-car': () => car('#ffffff',
      flat(0, 24, 38, 3, '#2f6fd6'),
      rr(-10, -12, 10, 7, 2, '#ff6b6b') + rr(0, -12, 10, 7, 2, '#4fc3f7')),

    'police-motorcycle': () => {
      const w = '#ffffff', b = '#2f6fd6';
      return wheel(-26, 10) + wheel(26, 10) +
        bar('M-26 34 L-14 6', STEEL, 3.4) +
        path('M-18 26 Q-16 10 -4 8 H18 Q28 8 30 22 L22 28Z', w) + flat(6, 18, 14, 2.6, b) +
        rr(0, 0, 20, 8, 4, DARK) +
        path('M-12 8 L-18 -10 L-10 -11 L-6 6Z', GLASS) +
        bar('M-16 -2 l-8 -2', DARK, 2.4) + lamp(-20, 6, 3.4) +
        rr(16, -6, 6, 6, 2, '#ff6b6b') + rr(22, -6, 6, 6, 2, '#4fc3f7');
    },

    'tow-truck': () => {
      const c = '#ff8a3d';
      return bar('M14 10 L38 -18', STEEL, 5) + line('M38 -18 V8', LINE, 1.6) + path('M35 8 h6 v4 q0 6 -5 5', 'none') +
        rr(-20, 14, 66, 20, 4, c) + flat(14, 22, 22, 2.2, '#fff') +
        cab(-48, -6, c, 28) + rr(-38, -12, 12, 6, 2, '#ffe066') +
        wheel(-32) + wheel(8) + wheel(32);
    },

    'rescue-helicopter': () => heli('#ff7043', flat(-2, 14, 18, 3, '#fff') +
      flatPath('M0 -4 h4 v4 h4 v4 h-4 v4 h-4 v-4 h-4 v-4 h4z', '#fff')),

    /* ---------- 馬路上 ---------- */
    car: () => car('#e53935'),

    taxi: () => car('#ffd23f',
      flatPath('M-30 22 h4 v4 h-4z M-22 22 h4 v4 h-4z M-14 22 h4 v4 h-4z M10 22 h4 v4 h-4z M18 22 h4 v4 h-4z M26 22 h4 v4 h-4z', '#2c2a2e'),
      rr(-6, -13, 14, 8, 2, '#fff8e1')),

    bus: () => {
      const c = '#3d8bf2';
      return rr(-46, -16, 92, 52, 8, c) +
        path('M-46 -2 V-8 Q-46 -16 -38 -16 H-34 V18 H-46Z', GLASS) +
        rr(-28, -8, 16, 14, 2, GLASS) + rr(-8, -8, 16, 14, 2, GLASS) + rr(12, -8, 16, 14, 2, GLASS) + rr(32, -8, 10, 14, 2, GLASS) +
        flat(0, 18, 44, 2.4, '#fff') +
        rr(-30, 12, 12, 22, 2, GLASS) + line('M-24 12 v22', LINE, 1.4) +
        rr(-40, -24, 26, 7, 2, '#ffe066') +
        lamp(-42, 28) + wheel(-24) + wheel(28);
    },

    'school-bus': () => {
      const c = '#ffc61a';
      return rr(-36, -14, 82, 50, 6, c) +
        path('M-48 36 V14 Q-48 8 -42 8 H-30 V36Z', c) +
        path('M-34 6 V-8 Q-34 -12 -30 -12 H-26 V6Z', GLASS) +
        rr(-20, -8, 14, 14, 2, GLASS) + rr(-2, -8, 14, 14, 2, GLASS) + rr(16, -8, 14, 14, 2, GLASS) + rr(34, -8, 8, 14, 2, GLASS) +
        line('M-36 14 H46 M-36 20 H46', '#2c2a2e', 2) +
        rr(-56, 4, 7, 7, 2, '#e53935') + line('M-49 7.5 h3', LINE, 1.6) +
        lamp(-45, 26) + wheel(-28) + wheel(28);
    },

    scooter: () => {
      const c = '#5cc8b4';
      // 台灣常見的速克達：前面有擋腳的護板，中間平平的踏板，後面圓圓的車殼
      return wheel(-26, 9) + wheel(26, 9) +
        path('M-33 30 Q-34 6 -22 -6 H-13 Q-17 8 -12 22 H4 Q8 8 24 9 Q40 11 38 30 Z', c) +
        rr(4, 2, 28, 8, 4, DARK) +
        bar('M-19 -8 L-17 -16 M-21 -16 h-8', DARK, 2.6) + lamp(-26, 0, 3.4) +
        rr(36, 12, 6, 6, 2, '#ff6b6b');
    },

    bicycle: () => {
      const f = '#e53935';
      const ring = (x) => circle(x, 30, 13, '#fff') + circle(x, 30, 3, HUB) + line(`M${x} 18 V42 M${x - 12} 30 H${x + 12}`, '#b8c0c9', 1.2);
      return ring(-26) + ring(26) +
        bar('M-26 30 L-16 4 M-26 30 H2 L-12 6 H18 L26 30 M2 30 L14 -2', f, 3.4) +
        rr(6, -6, 16, 6, 3, DARK) + bar('M-16 4 L-20 -4 h-8', DARK, 2.6);
    },

    'garbage-truck': () => {
      const y = '#ffd23f';
      return path('M-20 -14 H34 Q48 -14 48 2 V34 H-20Z', y) +
        flat(14, 6, 26, 3, '#3fae5a') + rr(6, 14, 22, 12, 3, '#e6e9ef') +
        flatPath('M14 -6 v-8 h10 v6 M14 -6 a3 2.4 0 1 1 -1 -1 M24 -8 a3 2.4 0 1 1 -1 -1', LINE) +
        cab(-48, -4, y, 28) +
        wheel(-32) + wheel(8) + wheel(32);
    },

    'mail-truck': () => van('#2e9e5b',
      rr(12, -4, 22, 16, 2, '#ffffff') + line('M12 -4 L23 5 L34 -4', LINE, 1.6) +
      flat(-6, 20, 40, 2.2, '#ffd23f')),

    'ice-cream-truck': () => van('#ffb3d1',
      rr(6, -6, 30, 18, 3, '#fff8e1') + line('M6 -1 h30', '#e78fb3', 2) +
      flatPath('M-6 22 q4 -3 8 0 t8 0 t8 0 t8 0 t8 0 t8 0', '#fff'),
      path('M18 -14 L26 -34 L34 -14Z', '#e0a35c') + circle(26, -36, 8, '#ffe8f0') + circle(26, -44, 6, '#ffb3d1') + circle(27, -50, 2.6, '#e53935')),

    'camper-van': () => van('#f5f1e6',
      flat(0, 20, 44, 3, '#3cb4a6') + rr(10, -8, 20, 13, 3, GLASS) + rr(32, -6, 8, 30, 2, '#3cb4a6'),
      rr(-14, -22, 48, 8, 3, '#3cb4a6')),

    'delivery-truck': () => {
      const b = '#3d8bf2';
      return rr(-18, -18, 64, 52, 3, '#ffffff') +
        rr(4, -4, 22, 20, 2, '#d9a65f') + line('M4 2 h22 M15 -4 v6', '#9a6a3e', 1.6) +
        cab(-48, -2, b, 30) +
        rr(-48, 32, 94, 5, 2.5, STEEL) +
        wheel(-32) + wheel(26);
    },

    'street-sweeper': () => {
      const c = '#ffb020';
      const brush = (x) => circle(x, 38, 6, '#7cb342') + line(`M${x - 8} 40 l-3 2 M${x - 7} 34 l-4 -1 M${x + 7} 40 l3 2`, '#5a8f2e', 1.6);
      return rr(-10, -10, 56, 44, 6, c) + flat(18, 12, 24, 2.6, '#fff') +
        rr(14, -4, 18, 10, 2, '#e6e9ef') +
        cab(-44, -4, c, 30) + rr(-36, -12, 12, 6, 2, '#ffe066') +
        brush(-34) + brush(-6) +
        wheel(-20, 7) + wheel(32, 9);
    },

    /* ---------- 鐵路 ---------- */
    train: () => {
      const w = '#f5f7fa', b = '#2f6fd6', o = '#ff8a3d';
      return rails() +
        path('M-46 36 V0 Q-46 -14 -32 -16 H46 V36Z', w) +
        path('M-42 2 Q-42 -10 -32 -11 H-24 V6 H-42Z', GLASS) +
        rr(-16, -8, 14, 14, 2, GLASS) + rr(4, -8, 14, 14, 2, GLASS) + rr(24, -8, 14, 14, 2, GLASS) +
        flat(0, 16, 46, 2.6, b) + flat(0, 22, 46, 1.8, o) +
        lamp(-42, 26) +
        circle(-28, 38, 5, TIRE) + circle(-14, 38, 5, TIRE) + circle(18, 38, 5, TIRE) + circle(32, 38, 5, TIRE);
    },

    'high-speed-train': () => {
      const w = '#ffffff', o = '#ff8a3d', nb = '#2b3a6e';
      return rails() +
        path('M-48 34 Q-48 18 -28 10 Q-16 -6 0 -8 H48 V34Z', w) +
        path('M-24 8 Q-14 -2 -2 -3 V8Z', GLASS) +
        rr(4, -2, 40, 9, 4, nb) +
        flat(4, 18, 44, 2.6, o) + flat(4, 24, 44, 1.6, nb) +
        lamp(-44, 28, 2.6) +
        circle(-20, 38, 5, TIRE) + circle(-6, 38, 5, TIRE) + circle(26, 38, 5, TIRE) + circle(40, 38, 5, TIRE);
    },

    metro: () => {
      const s = '#d9dee5', b = '#2f6fd6';
      return rails() +
        rr(-44, -16, 90, 52, 6, s) +
        rr(-40, -10, 18, 20, 3, GLASS) + shine(-34, -5, 3, 1.4) +
        rr(-16, -10, 12, 30, 2, GLASS) + line('M-10 -10 v30', LINE, 1.4) +
        rr(2, -8, 14, 14, 2, GLASS) + rr(22, -8, 18, 14, 2, GLASS) +
        flat(2, 26, 44, 2.6, b) +
        lamp(-40, 26) + lamp(-30, 26) +
        circle(-28, 38, 5, TIRE) + circle(-14, 38, 5, TIRE) + circle(18, 38, 5, TIRE) + circle(32, 38, 5, TIRE);
    },

    'steam-train': () => {
      const k = '#3a3a44', r = '#e53935';
      return rails() +
        circle(-30, -38, 6, '#eef1f4') + circle(-22, -44, 8, '#eef1f4') + circle(-10, -46, 6, '#eef1f4') +
        rr(-34, -30, 10, 20, 2, k) + rr(-36, -32, 14, 5, 2, k) +
        rr(-40, -12, 50, 24, 10, '#2f9a55') + rr(-12, -16, 8, 6, 2, '#ffc21a') +
        rr(8, -22, 34, 44, 4, r) + rr(14, -16, 20, 14, 3, GLASS) + rr(4, -26, 42, 6, 2, k) +
        rr(-44, 10, 90, 12, 3, k) +
        path('M-44 22 L-50 38 H-40Z', STEEL) + lamp(-40, -4, 3) +
        circle(-28, 32, 9, r) + circle(-6, 32, 9, r) + circle(22, 34, 7, r) +
        bar('M-28 32 H-6', STEEL, 2.4);
    },

    /* ---------- 天空 ---------- */
    airplane: () => {
      const w = '#ffffff', b = '#3d8bf2';
      const wing = '#d9dee5';
      // 後面那邊的機翼和水平尾翼（被機身擋住一半）
      return path('M0 -6 L16 -24 H23 L16 -6Z', wing) + path('M36 -8 L44 -18 H48 L46 -8Z', wing) +
        // 尾翼
        path('M26 -8 L38 -36 H47 L45 -10Z', b) +
        // 機身：圓圓的機頭，尾巴往上翹
        path('M-47 2 Q-47 -8 -35 -8 H26 L43 -11 Q47 -11 46 -7 L44 4 Q42 8 34 8 H-37 Q-47 8 -47 2Z', w) +
        path('M-44 -1 Q-42 -6 -36 -6 L-34 -1Z', GLASS) +
        [-20, -12, -4, 4, 12, 20].map((x) => circle(x, -2, 2.2, GLASS)).join('') +
        rr(-31, -5, 5, 10, 1.5, 'none') + flat(4, 5, 42, 1.6, b) +
        // 前面這邊的機翼往後斜，下面掛一個引擎
        path('M-6 2 L14 30 H23 L13 2Z', wing) +
        rr(-6, 13, 17, 8, 4, STEEL) + circle(-5, 17, 2.6, DARK) +
        path('M36 2 L48 8 L49 4 L42 0Z', wing);
    },

    helicopter: () => heli('#4fb3ff', flat(-2, 14, 18, 3, '#ffe066')),

    'hot-air-balloon': () => {
      const env = 'M0 18 Q-34 4 -34 -16 Q-34 -46 0 -46 Q34 -46 34 -16 Q34 4 0 18Z';
      return path(env, '#ff6b6b') +
        flatPath('M0 18 Q-14 4 -14 -16 Q-14 -44 0 -46 Q14 -44 14 -16 Q14 4 0 18Z', '#ffd23f') +
        flatPath('M0 18 Q-4 4 -4 -16 Q-4 -44 0 -46 Q4 -44 4 -16 Q4 4 0 18Z', '#4fb3ff') +
        path(env, 'none') +
        line('M-8 16 L-10 30 M8 16 L10 30', LINE, 1.4) +
        rr(-12, 30, 24, 14, 3, '#c98b55') + line('M-12 36 h24', '#9a6a3e', 1.6);
    },

    rocket: () => {
      const w = '#ffffff', r = '#e53935';
      return flatPath('M-8 32 Q-10 42 0 50 Q10 42 8 32Z', '#ffb020') + flatPath('M-4 32 Q-5 40 0 45 Q5 40 4 32Z', '#ffe066') +
        path('M-14 6 L-26 30 L-12 26Z', r) + path('M14 6 L26 30 L12 26Z', r) +
        path('M0 -48 Q16 -30 14 0 L12 30 H-12 L-14 0 Q-16 -30 0 -48Z', w) +
        path('M0 -48 Q10 -38 12 -28 H-12 Q-10 -38 0 -48Z', r) +
        circle(0, -8, 7, GLASS) + shine(-2, -10, 2.4, 1.2) +
        line('M-12 16 H12', '#d9dee5', 2) + rr(-4, 26, 8, 6, 2, r);
    },

    /* ---------- 港口 ---------- */
    ship: () => {
      const hull = '#2f6fd6', r = '#e53935';
      return rr(4, -32, 12, 22, 2, r) + rr(4, -36, 12, 6, 2, '#2c2a2e') +
        circle(14, -42, 3, '#eef1f4') + circle(20, -46, 4, '#eef1f4') +
        rr(-30, -12, 60, 16, 3, '#ffffff') + rr(-20, -22, 36, 12, 3, '#ffffff') +
        [-24, -14, -4, 6, 16].map((x) => circle(x, -4, 2.6, GLASS)).join('') +
        rr(-14, -19, 22, 5, 2, GLASS) +
        water() +
        path('M-48 2 H48 L40 30 H-38Z', hull) + flat(0, 22, 40, 2.6, r) +
        circle(-30, 12, 2.6, '#fff') + circle(-18, 12, 2.6, '#fff');
    },

    sailboat: () => {
      return line('M0 -46 V22', '#8a5a3a', 3) +
        path('M3 -42 L36 14 H3Z', '#ffffff') + line('M3 -14 L20 -14', '#d9dee5', 1.4) +
        path('M-3 -32 L-30 14 H-3Z', '#ff6b6b') +
        path('M0 -46 L12 -42 L0 -38Z', '#ffd23f') +
        water() +
        path('M-40 18 H42 L32 34 H-30Z', '#c98b55') + flat(0, 26, 30, 2, '#9a6a3e');
    },

    submarine: () => {
      const y = '#ffd23f';
      return water() +
        line('M-6 -38 V-24 M-6 -38 h-8', LINE, 3) +
        rr(-14, -26, 24, 18, 5, y) +
        ell(0, 10, 42, 22, y) +
        circle(-20, 8, 5, GLASS) + circle(-4, 8, 5, GLASS) + circle(12, 8, 5, GLASS) +
        path('M40 4 L50 -6 L50 26 L40 16Z', '#ff8a3d') +
        flat(0, 26, 30, 2, '#e8b800');
    },

    'fishing-boat': () => {
      const b = '#2f6fd6';
      return line('M-30 -40 L-6 -4 M30 -36 L8 -4', '#8a5a3a', 2.4) +
        path('M-30 -40 l-8 3 l8 3Z', '#e53935') + path('M30 -36 l8 3 l-8 3Z', '#ffd23f') +
        line('M-30 -40 Q-40 -10 -36 4 M30 -36 Q42 -6 38 4', LINE, 1) +
        rr(-4, -16, 26, 20, 3, '#ffffff') + rr(0, -12, 8, 8, 2, GLASS) + rr(12, -12, 8, 8, 2, GLASS) +
        rr(-6, -20, 30, 5, 2, '#e53935') +
        water() +
        path('M-46 2 H46 L38 30 H-36Z', b) + flat(0, 10, 40, 2.4, '#fff') + flat(0, 22, 36, 2, '#e53935');
    },

    speedboat: () => {
      const r = '#e53935';
      return water() +
        rr(36, 6, 10, 22, 3, '#3a3a44') +
        path('M-8 6 L4 -10 H16 L12 6Z', GLASS) +
        path('M-48 10 Q-30 4 -4 4 H40 V18 Q36 30 -10 30 Q-36 28 -48 10Z', '#ffffff') +
        flatPath('M-40 14 Q-26 12 -4 12 H38 V20 H-6 Q-30 20 -40 14Z', r);
    },

    /* ---------- 農場 ---------- */
    tractor: () => {
      const r = '#e53935';
      return line('M-12 -6 V-22', LINE, 3.6) + rr(-15, -26, 6, 6, 1.5, DARK) +
        line('M4 -22 V6 M30 -22 V6', LINE, 3) + rr(0, -28, 36, 7, 3, '#ffd23f') +
        rr(-40, 4, 48, 22, 6, r) + rr(-36, 8, 14, 8, 2, DARK) +
        rr(2, -2, 32, 30, 4, r) + rr(8, -18, 20, 16, 2, GLASS) +
        lamp(-38, 18) +
        wheel(-28, 9) + circle(26, 28, 16, TIRE) + circle(26, 28, 7, '#ffd23f');
    },

    'combine-harvester': () => {
      const gr = '#3fae5a';
      return bar('M28 -6 L46 -30', gr, 5) + rr(42, -34, 8, 6, 2, gr) +
        rr(-16, -4, 58, 34, 6, gr) + flat(14, 4, 22, 2.4, '#ffd23f') +
        rr(-14, -26, 24, 24, 4, gr) + rr(-10, -22, 16, 14, 2, GLASS) + shine(-4, -18, 3, 1.4) +
        rr(-48, 18, 34, 14, 3, '#ffd23f') + line('M-46 32 l-3 6 M-38 32 l-3 6 M-30 32 l-3 6 M-22 32 l-3 6', LINE, 1.6) +
        circle(-32, 14, 9, '#ffd23f') + line('M-32 5 V23 M-41 14 H-23', '#d99a00', 1.6) +
        bar('M-14 22 L-26 16', DARK, 3) +
        tracks(-12, 31, 56);
    },
  };
})());
