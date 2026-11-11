// 🗺️ 旅行模式（環遊地圖）用的地標插圖：沒有合適 emoji 的東西自己畫
// 風格跟動物一樣：座標 -50 ~ 50、底部在 y ≈ 44、粗深色外框＋平塗顏色（工具在 art/kit.js）
Object.assign(ART, {
  // 荷蘭的風車：磚紅色的塔、四片格子帆布扇葉、門口種著鬱金香
  windmill: () => {
    const { path, circle, flatPath, line, g } = K;
    const blade = path('M-3.5 -4 V-38 H6 V-4Z', '#f6eedb') +
      line('M-3.5 -14 H6 M-3.5 -24 H6 M-3.5 -32 H6 M1.2 -4 V-38', '#b49a73', 1.3);
    const tulip = (x, c) => line(`M${x} 44 V36`, '#3f9b3a', 2) + path(`M${x - 3.5} 33 q0 5 3.5 5 q3.5 0 3.5 -5 l-1.8 1.8 l-1.7 -2.6 l-1.7 2.6z`, c);
    return path('M-15 44 L-10 -4 H10 L15 44Z', '#b5603f') +
      flatPath('M3 -4 H10 L15 44 H6Z', '#000', 0.12) +
      line('M-12 20 H12 M-13.5 32 H13.5', '#8f4a30', 1.6) +
      path('M-5 44 V34 a5 5 0 0 1 10 0 V44Z', '#6b4128') +
      circle(0, 12, 3.6, '#bfe3ff') +
      path('M-13 -4 Q0 -20 13 -4Z', '#3d6fb6') +
      [25, 115, 205, 295].map((a) => g(blade, `translate(0 -10) rotate(${a})`)).join('') +
      circle(0, -10, 4.2, '#6b4128') +
      tulip(-24, '#e8434f') + tulip(-19, '#f7c531') + tulip(21, '#f7c531') + tulip(26, '#e8434f');
  },

  // 長城：綠色的山上，城牆彎彎曲曲地爬過山頭，中間一座烽火台
  'great-wall': () => {
    const { path, flatPath, line } = K;
    const wallTop = 'M-50 24 Q-30 2 -8 12 Q14 22 50 -4';
    return path('M-50 44 Q-32 8 -8 18 Q16 30 50 2 V44Z', '#8fcf6b') +
      flatPath('M-50 44 Q-20 30 10 38 Q30 44 50 30 V44Z', '#000', 0.08) +
      path(`${wallTop} L50 6 Q14 32 -8 22 Q-30 12 -50 34Z`, '#d6b483') +
      // 城垛：上緣一個一個小凸起
      `<path d="${wallTop}" fill="none" stroke="#d6b483" stroke-width="5" stroke-dasharray="3.5 3.5" transform="translate(0 -3.5)"/>` +
      `<path d="${wallTop}" fill="none" stroke="${LINE}" stroke-width="1.4" stroke-dasharray="3.5 3.5" transform="translate(0 -6)"/>` +
      line('M-50 29 Q-30 7 -8 17 Q14 27 50 1', '#b8925f', 1.4) +
      // 烽火台
      path('M-19 22 V-10 H3 V22Z', '#e2c393') +
      path('M-21 -10 V-16 H-17 V-13 H-12 V-16 H-8 V-13 H-3 V-16 H1 V-13 H5 V-10Z', '#e2c393') +
      path('M-11.5 22 V12 a3.5 3.5 0 0 1 7 0 V22Z', '#6b4b33') +
      path('M-12 0 h3 v-5 h-3z M-5 0 h3 v-5 h-3z', '#6b4b33');
  },

  // 兵馬俑：泥土色的小士兵，頭上綁著髮髻，穿著一片一片的盔甲，雙手放在前面
  'terracotta-warrior': () => {
    const { path, circle, ell, flat, leg, line, eyes, smile, blush } = K;
    const clay = '#c48b5c', dark = '#a8714a';
    let armor = '';
    for (let y = 8; y <= 22; y += 5) for (let x = -12; x <= 9; x += 5.2) armor += `<rect x="${x}" y="${y}" width="4" height="3.4" rx="0.8" fill="${dark}" opacity=".55"/>`;
    return leg(-7, 28, 9, dark) + leg(7, 28, 9, dark) +
      path('M-19 34 Q-21 3 0 1 Q21 3 19 34Z', clay) + armor +
      line('M-17 26 H17', '#8a5838', 1.6) +
      ell(-18, 14, 5.5, 10, clay, 18) + ell(18, 14, 5.5, 10, clay, -18) +
      circle(0, 22, 5, '#d39b6c') +
      circle(0, -16, 16, '#d39b6c') +
      path('M-15 -21 Q-14 -34 0 -34 Q14 -34 15 -21 Q8 -27 0 -27 Q-8 -27 -15 -21Z', '#8a5838') +
      circle(7, -35, 5.5, '#8a5838') +
      flat(0, -4, 6, 1.6, '#8a5838') +
      eyes(0, -15, 6.5, 3.2) + smile(0, -8, 3) + blush(0, -10, 11, 3.2);
  },

  // 草原上看動物的吉普車（車頭朝左）：卡其色、沒有車頂只有鐵架、後面掛著備胎
  jeep: () => {
    const { path, circle, line, flat } = K;
    const body = '#d9b96a', dark = '#a8873f';
    const wheel = (x) => circle(x, 34, 10, '#3b3640') + circle(x, 34, 4.5, '#d6dbe1');
    return line('M-14 4 V-16 H24 V4 M5 -16 V4', '#5a5560', 3.2) +
      path('M-46 22 V12 Q-46 6 -40 6 H-22 L-14 -2 H34 Q38 -2 38 2 V22Z', body) +
      path('M-44 22 H38 V30 H-44Z', dark) +
      path('M-17 4 L-11 -2 H-2 V4Z', '#bfe6ff') +
      flat(-8, 1, 2.5, 1.2, '#fff', -20, 0.9) +
      line('M8 4 V20 M-20 8 V20', '#8a6a2a', 1.6) +
      circle(-42, 13, 3, '#ffe066') +
      circle(43, 10, 8, '#3b3640') + circle(43, 10, 3.5, '#d6dbe1') +
      wheel(-28) + wheel(22);
  },

  // 泰國的嘟嘟車（車頭朝左）：三個輪子，前面一個、後面兩個，上面一片彩色的車篷
  'tuk-tuk': () => {
    const { path, circle, line, flat } = K;
    const body = '#2f8fd6', roof = '#ffcf3f';
    const wheel = (x) => circle(x, 36, 8, '#3b3640') + circle(x, 36, 3.6, '#d6dbe1');
    return path('M-30 -18 Q-30 -26 -20 -26 H34 Q42 -26 42 -18 V-14 H-30Z', roof) +
      line('M-26 -14 V10 M38 -14 V12 M12 -14 V12', '#5a5560', 2.4) +
      path('M-44 30 V18 Q-44 8 -34 6 L-24 4 V30Z', body) +
      path('M-24 30 V12 H44 V30Z', body) +
      path('M0 12 V0 Q0 -4 4 -4 H36 Q40 -4 40 0 V12Z', '#e53935') +
      flat(-34, 12, 4, 2, '#fff', -20, 0.8) + circle(-41, 22, 2.6, '#ffe066') +
      line('M-20 4 L-12 -6', '#5a5560', 2) +
      wheel(-34) + wheel(28) +
      line('M-40 -18 h10 M36 -22 h4', '#fff', 1.4);
  },

  // 埃及的金字塔：沙漠裡三座金黃色的金字塔，旁邊一棵椰子樹
  pyramid: () => {
    const { path, flatPath, line } = K;
    const stone = '#e8c070', side = '#c99d52';
    const pyr = (x, w, h) => path(`M${x - w} 40 L${x} ${40 - h} L${x + w} 40Z`, stone) + flatPath(`M${x} ${40 - h} L${x + w} 40 H${x + w * 0.15}Z`, side) +
      line(`M${x - w * 0.66} ${40 - h * 0.33} H${x + w * 0.66} M${x - w * 0.33} ${40 - h * 0.66} H${x + w * 0.33}`, '#b9894a', 1.2);
    return path('M-50 44 Q-20 34 10 40 Q32 44 50 38 V44Z', '#f3d48f') +
      pyr(26, 16, 26) + pyr(-24, 18, 30) + pyr(2, 26, 48) +
      line('M-46 40 Q-44 24 -40 14', '#8a5a3a', 3) +
      path('M-40 14 q-10 -2 -14 6 q8 -6 14 -6 q-4 -9 -12 -8 q9 0 12 8 q4 -9 12 -7 q-8 0 -12 7 q8 -1 11 6 q-5 -5 -11 -6z', '#4caf50');
  },

  // 馬達加斯加的猴麵包樹：又粗又高的樹幹，最上面才有一小撮樹枝和葉子
  baobab: () => {
    const { path, flat, line } = K;
    return path('M-50 44 Q0 36 50 44Z', '#e9b973') +
      path('M-11 44 Q-8 10 -9 -18 H9 Q8 10 11 44Z', '#b07a52') +
      flat(4, 12, 3, 22, '#000', 0, 0.1) +
      line('M-7 -18 L-18 -30 M-2 -18 L-6 -34 M3 -18 L8 -33 M7 -18 L19 -29', '#8a5a3a', 3.4) +
      flat(-18, -32, 9, 5.5, '#5fae3b') + flat(-5, -37, 9, 6, '#6cbb47') + flat(9, -36, 9, 6, '#5fae3b') + flat(20, -31, 8, 5, '#6cbb47');
  },

  // 雪梨歌劇院：海邊的平台上，好幾片白色的貝殼屋頂一片疊一片
  'opera-house': () => {
    const { path, flatPath, line } = K;
    const shell = (x, w, h, c = '#fbfaf5') => path(`M${x} 18 Q${x + w * 0.15} ${18 - h} ${x + w} ${18 - h * 1.05} Q${x + w * 0.55} ${18 - h * 0.45} ${x + w * 0.75} 18Z`, c);
    return path('M-50 44 V30 H50 V44Z', '#4aa3df') +
      line('M-44 38 q4 -3 8 0 t8 0 M-8 38 q4 -3 8 0 t8 0 M26 38 q4 -3 8 0 t8 0', '#fff', 1.6) +
      path('M-40 30 V18 H42 V30Z', '#e2c9a0') +
      line('M-36 24 H38', '#c4a678', 1.4) +
      shell(-34, 22, 18, '#efece3') + shell(-22, 26, 26) + shell(-6, 22, 20, '#efece3') + shell(6, 26, 32) + shell(22, 18, 22) +
      flatPath('M-20 18 Q-14 4 -2 0 Q-6 8 -4 18Z', '#d9e2ec', 0.6) + flatPath('M8 18 Q16 -2 30 -9 Q22 4 24 18Z', '#d9e2ec', 0.6);
  },

  // 烏魯魯：紅色沙漠裡一塊又大又長、圓圓的紅色大石頭
  uluru: () => {
    const { path, flatPath, line, circle } = K;
    return circle(30, -26, 8, '#ffd23f') +
      path('M-50 44 V32 Q0 26 50 32 V44Z', '#e9a15a') +
      path('M-44 32 Q-42 6 -26 2 Q0 -4 26 1 Q42 4 46 32Z', '#d9653b') +
      flatPath('M-44 32 Q-42 22 -30 20 Q0 18 30 20 Q42 22 46 32Z', '#b84e2c', 0.5) +
      line('M-30 8 q2 10 0 20 M-14 4 q3 12 1 24 M2 2 q2 12 0 26 M18 4 q3 12 1 24 M32 10 q2 10 0 18', '#b04a2a', 1.6) +
      line('M-48 40 l3 -4 l3 4 M36 40 l3 -4 l3 4', '#7a9a3a', 1.8);
  },

  // 紐約的自由女神：綠色的女神站在台座上，右手高高舉著火炬，頭上戴著尖尖的皇冠
  'statue-of-liberty': () => {
    const { path, circle, line, flatPath } = K;
    const green = '#7fc8a9', dark = '#5aa58a';
    return path('M-16 44 V30 H16 V44Z', '#c9b28a') + path('M-12 30 V22 H12 V30Z', '#d8c39c') +
      path('M-11 22 Q-12 0 -6 -10 H6 Q12 0 11 22Z', green) +
      flatPath('M2 -10 H6 Q12 0 11 22 H4Z', dark, 0.5) +
      line('M-6 0 Q0 6 7 -2 M-8 12 Q0 16 9 10', dark, 1.6) +
      path('M-4 -2 Q-12 2 -12 8 L-8 9 Q-8 4 -2 2Z', green) +
      path('M5 -8 L9 -32 L13 -31 L9 -6Z', green) +
      path('M7 -32 h8 l-1 -4 h-6z', '#d8c39c') + path('M11 -36 q-4 -6 0 -11 q4 5 0 11z', '#ffb347') +
      circle(0, -16, 6.5, green) +
      [-40, -15, 15, 40].map((a) => line(`M${(Math.sin((a * Math.PI) / 180) * 6.5).toFixed(1)} ${(-16 - Math.cos((a * Math.PI) / 180) * 6.5).toFixed(1)} L${(Math.sin((a * Math.PI) / 180) * 12).toFixed(1)} ${(-16 - Math.cos((a * Math.PI) / 180) * 12).toFixed(1)}`, dark, 2)).join('') +
      line('M-2.5 -17 h1 M2 -17 h1', '#2a2226', 1.6);
  },

  // 舊金山的金門大橋：兩座橘紅色的高塔，中間垂下來大大的鋼索，橋下是海
  'golden-gate': () => {
    const { path, line } = K;
    const red = '#e4572e';
    const tower = (x) => path(`M${x - 4} 44 V-30 H${x + 4} V44Z`, red) + line(`M${x - 4} -18 H${x + 4} M${x - 4} -4 H${x + 4}`, '#b8401f', 1.6);
    return path('M-50 44 V26 H50 V44Z', '#4aa3df') +
      line('M-44 36 q4 -3 8 0 t8 0 M-4 38 q4 -3 8 0 t8 0 M30 36 q4 -3 8 0 t8 0', '#fff', 1.6) +
      path('M-50 18 H50 V23 H-50Z', red) +
      line('M-50 -6 Q-36 16 -22 -26 Q0 14 22 -26 Q36 16 50 -6', '#b8401f', 2.6) +
      line('M-12 16 V2 M-4 16 V8 M4 16 V8 M12 16 V2 M-34 16 V6 M30 16 V2 M38 16 V8', '#b8401f', 1.2) +
      tower(-22) + tower(22);
  },

  // 秘魯的馬丘比丘：高高的綠色尖山下面，有一層一層的梯田和灰色石頭房子
  'machu-picchu': () => {
    const { path, flatPath, line } = K;
    const stone = '#b8b2a7';
    const hut = (x, y) => path(`M${x - 6} ${y} V${y - 7} H${x + 6} V${y}Z`, stone) + path(`M${x - 7} ${y - 7} L${x} ${y - 12} L${x + 7} ${y - 7}Z`, '#8a7d6b');
    return path('M-50 44 V20 Q-40 10 -30 16 L-6 -42 Q2 -48 8 -40 L22 -6 Q36 0 50 10 V44Z', '#6cbb47') +
      flatPath('M2 -44 Q8 -40 22 -6 Q36 0 50 10 V44 H20Z', '#000', 0.1) +
      line('M-40 26 H40 M-36 32 H44 M-30 38 H48', '#4f9a36', 2) +
      path('M-38 26 H34 V20 H-38Z', '#8fd06a') +
      hut(-26, 20) + hut(-10, 20) + hut(6, 20) + hut(22, 20) +
      line('M-50 44 Q-30 40 -10 44', '#3d8bd6', 2.4);
  },

  // 伊瓜蘇瀑布：綠色的懸崖上，好幾條白色的大瀑布轟隆隆地衝下來，前面還有一道彩虹
  waterfall: () => {
    const { path, line, flat } = K;
    const fall = (x, w) => path(`M${x} -14 H${x + w} L${x + w + 2} 30 H${x - 2}Z`, '#eaf6ff') + line(`M${x + w / 3} -10 V26 M${(x + (w * 2) / 3).toFixed(1)} -6 V28`, '#bfe3ff', 1.4);
    return path('M-50 -14 Q-30 -26 0 -20 Q30 -26 50 -14 V-10 H-50Z', '#4caf50') +
      path('M-50 -10 H50 V30 H-50Z', '#8a6a4a') +
      fall(-44, 14) + fall(-22, 18) + fall(4, 12) + fall(24, 18) +
      path('M-50 30 H50 V44 H-50Z', '#4aa3df') + flat(0, 31, 48, 3, '#fff', 0, 0.8) +
      line('M-36 40 Q0 -22 36 40', '#ff6b6b', 2.2) + line('M-32 40 Q0 -16 32 40', '#ffd23f', 2.2) + line('M-28 40 Q0 -10 28 40', '#4caf50', 2.2);
  },

  // 印度的泰姬瑪哈陵：白色的大圓頂，旁邊四根高高的尖塔，前面一條長長的水池
  'taj-mahal': () => {
    const { path, circle, flatPath, line } = K;
    const white = '#f8f6f0', shade = '#e2ddd0';
    const minaret = (x) => path(`M${x - 2.6} 26 V-10 H${x + 2.6} V26Z`, white) + path(`M${x - 3.6} -10 Q${x} -17 ${x + 3.6} -10Z`, white) + line(`M${x - 2.6} 0 H${x + 2.6} M${x - 2.6} 12 H${x + 2.6}`, shade, 1.2);
    return path('M-50 44 V26 H50 V44Z', '#a6dd8f') +
      path('M-10 44 V30 H10 V44Z', '#7cc4ff') + flatPath('M-6 44 V32 H6 V44Z', '#fff', 0.4) +
      minaret(-38) + minaret(38) +
      path('M-28 26 V0 H28 V26Z', white) +
      flatPath('M10 0 H28 V26 H10Z', shade, 0.6) +
      path('M-7 26 V12 Q0 4 7 12 V26Z', '#c9b9a0') +
      path('M-22 0 Q-24 -14 -14 -22 Q0 -38 14 -22 Q24 -14 22 0Z', white) +
      flatPath('M4 -30 Q14 -22 18 -12 Q22 -6 22 0 H8Z', shade, 0.6) +
      line('M0 -34 V-44', LINE, 1.6) + circle(0, -45, 1.6, '#f2c94c') +
      path('M-24 0 Q-24 -8 -19 -10 Q-14 -8 -14 0Z', white) + path('M14 0 Q14 -8 19 -10 Q24 -8 24 0Z', white);
  },

  // 莫斯科的聖瓦西里大教堂：好幾個彩色條紋的洋蔥形圓頂，像一盒糖果
  'onion-church': () => {
    const { path, circle, line } = K;
    const onion = (x, y, s, c1, c2) => path(`M${x} ${y - 16 * s} Q${x + 11 * s} ${y - 6 * s} ${x + 8 * s} ${y + 2 * s} Q${x} ${y + 6 * s} ${x - 8 * s} ${y + 2 * s} Q${x - 11 * s} ${y - 6 * s} ${x} ${y - 16 * s}Z`, c1) +
      line(`M${x - 6 * s} ${y - 4 * s} Q${x} ${y - 9 * s} ${x + 6 * s} ${y - 4 * s} M${x - 7 * s} ${y} Q${x} ${y - 5 * s} ${x + 7 * s} ${y}`, c2, 2) +
      line(`M${x} ${y - 16 * s} V${y - 21 * s}`, '#d9a520', 1.6) + circle(x, y - 22 * s, 1.4 * s, '#f2c94c');
    const tower = (x, top, w, c) => path(`M${x - w} 40 V${top} H${x + w} V40Z`, c);
    return path('M-46 44 V36 H46 V44Z', '#c94c3c') +
      tower(0, -8, 8, '#e8d9b8') + tower(-22, 6, 7, '#f0e2c4') + tower(22, 6, 7, '#f0e2c4') + tower(-36, 16, 5, '#e8d9b8') + tower(36, 16, 5, '#e8d9b8') +
      path('M-8 -8 L0 -32 L8 -8Z', '#3f9b3a') +
      onion(-22, 6, 0.9, '#2f8fd6', '#fff') + onion(22, 6, 0.9, '#f5a623', '#c94c3c') +
      onion(-36, 16, 0.6, '#3f9b3a', '#ffd23f') + onion(36, 16, 0.6, '#c94c3c', '#fff') +
      onion(0, -30, 0.75, '#e94b6a', '#ffd23f') +
      path('M-4 40 V30 a4 4 0 0 1 8 0 V40Z', '#7a4a32');
  },

  // 俄羅斯娃娃：圓圓胖胖、穿著紅色花衣服的木頭娃娃，打開裡面還有一個更小的
  matryoshka: () => {
    const { path, circle, flat, line, eyes, smile, blush } = K;
    // 一個娃娃：x 是中心，s 是大小（1 = 大約 70 高）
    const doll = (x, s, c) => {
      return path(`M${x} ${44 - 70 * s} Q${x + 18 * s} ${44 - 70 * s} ${x + 19 * s} ${44 - 44 * s} Q${x + 24 * s} ${44 - 18 * s} ${x + 18 * s} 44 H${x - 18 * s} Q${x - 24 * s} ${44 - 18 * s} ${x - 19 * s} ${44 - 44 * s} Q${x - 18 * s} ${44 - 70 * s} ${x} ${44 - 70 * s}Z`, c) +
        `<ellipse cx="${x}" cy="${(44 - 47 * s).toFixed(1)}" rx="${(11 * s).toFixed(1)}" ry="${(11 * s).toFixed(1)}" fill="#ffe6cf"/>` +
        flat(x, 44 - 20 * s, 12 * s, 9 * s, '#fff', 0, 0.9) +
        circle(x, 44 - 20 * s, 4.5 * s, '#e94b6a') +
        flat(x - 5 * s, 44 - 14 * s, 3 * s, 2 * s, '#3f9b3a') + flat(x + 5 * s, 44 - 14 * s, 3 * s, 2 * s, '#3f9b3a');
    };
    return doll(18, 0.55, '#3f8fd6') +
      doll(-6, 0.95, '#d83a3a') +
      eyes(-6, 1, 4, 2.4) + smile(-6, 6, 2.6) + blush(-6, 4, 7, 2.4) +
      line('M-17 -12 Q-6 -20 5 -12', '#7a4a32', 2) +
      eyes(18, 17.5, 2.4, 1.5) + smile(18, 21, 1.6);
  },

  // 撒馬爾罕的雷吉斯坦：沙色的大門上貼滿藍色磁磚，後面一個藍色有條紋的圓頂，兩邊是高高的宣禮塔
  // 吉隆坡雙子星塔：兩座一模一樣的銀色尖塔，中間有一座天橋連起來
  petronas: () => {
    const { path, line } = K;
    const steel = '#cdd6df', dk = '#8796a5';
    const tower = (x) => path(`M${x - 8} 40 V-6 L${x - 6.5} -10 V-20 L${x - 5} -24 V-32 L${x - 3} -35 V-40 L${x} -49 L${x + 3} -40 V-35 L${x + 5} -32 V-24 L${x + 6.5} -20 V-10 L${x + 8} -6 V40Z`, steel) +
      line(`M${x - 8} 4 H${x + 8} M${x - 8} 14 H${x + 8} M${x - 8} 24 H${x + 8} M${x - 8} 33 H${x + 8} M${x - 6.5} -15 H${x + 6.5} M${x - 5} -28 H${x + 5}`, dk, 1.3) +
      line(`M${x} -6 V40`, dk, 1.1);
    return path('M-50 44 V40 H50 V44Z', '#9aa5ae') + tower(-15) + tower(15) + path('M-7 -3 H7 V2 H-7Z', dk) + line('M-7 2 L-2 8 M7 2 L2 8', dk, 1.6);
  },

  // 婆羅浮屠：一層一層的石頭大佛塔，上面排著鐘形的小佛塔，最頂端一個大佛塔
  borobudur: () => {
    const { path, line } = K;
    const stone = '#9b8f80', lt = '#b8ad9e', dk = '#6f6559';
    const stupa = (x, y, r) => path(`M${x - r} ${y} Q${x - r} ${y - r * 1.4} ${x} ${y - r * 1.5} Q${x + r} ${y - r * 1.4} ${x + r} ${y}Z`, lt) + line(`M${x} ${y - r * 1.5} v${-r * 0.7}`, dk, 1.8);
    return path('M-50 44 V40 H50 V44Z', '#7fb35a') +
      path('M-46 40 V30 H46 V40Z', stone) + path('M-40 30 V20 H40 V30Z', stone) + path('M-33 20 V11 H33 V20Z', stone) + path('M-26 11 V3 H26 V11Z', lt) +
      line('M-46 35 H46 M-40 25 H40 M-33 15.5 H33', dk, 1.2) +
      [-20, -10, 10, 20].map((x) => stupa(x, 3, 4)).join('') +
      path('M-14 3 V-3 H14 V3Z', lt) + stupa(-9, -3, 3.4) + stupa(9, -3, 3.4) + stupa(0, -3, 9);
  },

  registan: () => {
    const { path, circle, flatPath, line } = K;
    const sand = '#e7c58f', blue = '#2f8fd6', turq = '#3cc3c8';
    const minaret = (x) => path(`M${x - 4} 40 V-14 H${x + 4} V40Z`, sand) + line(`M${x - 4} -2 H${x + 4} M${x - 4} 12 H${x + 4} M${x - 4} 26 H${x + 4}`, blue, 2.2) + path(`M${x - 5} -14 H${x + 5} V-18 H${x - 5}Z`, turq);
    return path('M-50 44 V40 H50 V44Z', '#d9b27a') +
      path('M-10 -2 Q-10 -30 10 -30 Q30 -30 30 -2Z', turq) +
      line('M0 -29 Q-2 -16 -2 -2 M10 -30 V-2 M20 -29 Q22 -16 22 -2', '#1f7fa8', 1.6) +
      minaret(-38) + minaret(38) +
      path('M-30 40 V-6 H30 V40Z', sand) +
      path('M-18 40 V8 Q-18 -8 0 -8 Q18 -8 18 8 V40Z', blue) +
      path('M-11 40 V12 Q-11 2 0 2 Q11 2 11 12 V40Z', '#6b4b33') +
      flatPath('M-30 -6 H30 V0 H-30Z', blue, 0.9) +
      line('M-26 4 v32 M26 4 v32', turq, 2.4) +
      circle(10, -32, 2, '#f2c94c');
  },

  // 大笨鐘：米黃色的鐘塔，大大的白色時鐘，屋頂是尖尖的灰綠色塔頂
  'big-ben': () => {
    const { path, circle, flatPath, line } = K;
    return path('M-12 44 V-12 H12 V44Z', '#dcbf86') +
      flatPath('M4 -12 H12 V44 H4Z', '#000', 0.1) +
      line('M-12 6 H12 M-12 20 H12 M-12 34 H12', '#b8975e', 1.4) +
      path('M-5 34 V26 h4 v8z M1 34 V26 h4 v8z M-5 20 V12 h4 v8z M1 20 V12 h4 v8z', '#7b6a4f') +
      path('M-15 -12 V-26 H15 V-12Z', '#dcbf86') +
      circle(0, -19, 9, '#fffaf0') +
      line('M0 -19 V-25 M0 -19 L4.5 -17', '#2a2226', 1.8) +
      path('M-15 -26 L-10 -32 H10 L15 -26Z', '#7f8f86') +
      path('M-9 -32 L0 -50 L9 -32Z', '#7f8f86') +
      circle(0, -50, 1.8, '#f2c94c');
  },
});
