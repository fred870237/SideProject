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
