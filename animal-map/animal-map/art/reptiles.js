// 爬蟲類：綠鬣蜥和蛇（全身）
Object.assign(ART, (() => {
  const { circle, ell, flat, path, line, backLeg, leg, eyes, blush, smile, shade } = K;
  // 有外框的粗管子（蛇的身體、尾巴）
  const tube = (d, color, w) => line(d, LINE, w + 4.8) + line(d, color, w);
  // 分岔的小舌頭
  const tongue = (x, y) => line(`M${x} ${y} v5 l-2.4 3 M${x} ${y + 5} l2.4 3`, '#e8455a', 1.8);
  // 蛇盤起來的身體：兩圈疊在一起，再往上接到頭
  const coil = (c, belly) =>
    ell(10, 36, 30, 8.5, c) + flat(10, 39, 22, 3, belly) +
    ell(8, 26, 23, 7.5, c) + flat(8, 29, 16, 2.6, belly);
  const head = (cx, cy, c, belly) =>
    ell(cx, cy, 16, 13.5, c) + flat(cx, cy + 6, 10, 5, belly) +
    flat(cx - 3.5, cy + 3, 1.2, 0.9, LINE) + flat(cx + 3.5, cy + 3, 1.2, 0.9, LINE) +
    smile(cx, cy + 6, 3.4) + tongue(cx, cy + 9.5) +
    eyes(cx, cy - 3, 7, 4) + blush(cx, cy + 3, 11.5, 3.2);

  return {
    // 馬達加斯加的變色龍：抓著樹枝，尾巴捲成一圈，頭上有一個尖尖的頭盔
    chameleon: () => {
      const b = '#5cc46a', d = '#3f9e50', l = '#c4f09a';
      return line('M-48 34 Q0 30 48 36', LINE, 7.5) + line('M-48 34 Q0 30 48 36', '#9a6a44', 4.5) +
        tube('M28 16 Q44 14 44 26 Q44 36 36 34 Q30 32 34 26', b, 6) +
        ell(-6, 30, 4, 6, d) + ell(22, 30, 4, 6, d) +
        ell(10, 14, 21, 14, b) + flat(10, 20, 15, 4, l) +
        flat(2, 10, 2.6, 2.2, '#f29a4a') + flat(12, 8, 2.6, 2.2, '#f29a4a') + flat(22, 11, 2.4, 2, '#f29a4a') +
        line('M-8 1 Q10 -6 28 4', d, 3) +
        ell(0, 30, 4, 6, b) + ell(28, 30, 4, 6, b) +
        path('M-28 -10 Q-18 -30 -4 -6z', d) +
        circle(-17, -1, 13, b) + flat(-19, 7, 8, 3.5, l) +
        smile(-21, 5, 3) +
        eyes(-17, -3, 6, 4) + blush(-17, 3, 10.5, 3);
    },

    iguana: () => {
      const b = '#6dbb3e', d = '#4e9a2c', l = '#bfe58a';
      let crest = '';
      for (let i = 0; i < 6; i++) crest += path(`M${-2 + i * 6} ${13 - Math.abs(i - 2.5) * 0.5} l3 -7 l3 7z`, '#f2c94c');
      return tube('M30 26 Q46 28 44 14 Q42 4 34 8', b, 7) +
        line('M37 25 l2 -6 M42 20 l-1 -6', d, 2.4) +
        backLeg(2, 26, 7, b) + backLeg(28, 26, 7, b) +
        crest +
        ell(14, 22, 22, 11, b) + flat(13, 28, 15, 3.6, l) +
        line('M4 16 q3 4 0 8 M14 14 q3 4 0 8 M24 16 q3 4 0 8', d, 2.2) +
        leg(-4, 28, 7.5, b) + leg(22, 28, 7.5, b) +
        ell(-5, 8, 11, 9, b) + path('M-20 2 Q-14 18 -6 8z', '#f29a4a') +
        circle(-14, -10, 16, b) + path('M-24 -24 l3 -6 l3 5 l3 -6 l3 5 l3 -6 l3 6z', '#f2c94c') +
        flat(-14, -2, 9, 5, l) +
        flat(-17, -3, 1.1, 0.9, LINE) + flat(-11, -3, 1.1, 0.9, LINE) + smile(-14, 0.5, 3) +
        eyes(-14, -12, 7, 4.2) + blush(-14, -4, 11.5, 3.2);
    },

    rattlesnake: () => {
      const b = '#dcb56a', l = '#f6e2b0', k = '#8a5a2b';
      const spots = [[-8, 36], [4, 37], [16, 37], [28, 36], [-2, 26], [10, 27], [21, 26]]
        .map(([x, y]) => path(`M${x} ${y - 3} l3.2 3 l-3.2 3 l-3.2 -3z`, k, 'stroke="none"')).join('');
      return tube('M36 30 Q46 28 44 18', b, 7) +
        [0, 1, 2].map((i) => ell(44 - i * 0.4, 14 - i * 4.4, 4.2, 2.6, '#efe0bd')).join('') +
        coil(b, l) + spots +
        tube('M-4 24 Q-14 14 -14 0', b, 10) + flat(-11, 12, 2.6, 2, k) +
        head(-14, -12, b, l);
    },

    anaconda: () => {
      const b = '#7f9e3a', l = '#d8e39a', k = '#2f3a1f';
      const spots = [[-10, 35], [2, 37], [14, 37], [26, 35], [-4, 25], [8, 27], [20, 26]]
        .map(([x, y]) => flat(x, y, 3.4, 2.4, k) + flat(x, y, 1.6, 1.1, '#c9b34a')).join('');
      return tube('M37 34 Q46 34 46 26', b, 7) +
        coil(b, l) + spots +
        tube('M-4 24 Q-14 14 -14 0', b, 10) + flat(-12, 12, 3, 2.2, k) +
        head(-14, -12, b, l);
    },

    'king-cobra': () => {
      const b = '#8d7d3e', l = '#efe2a8', band = shade('#8d7d3e', 0.7);
      return tube('M36 32 Q46 32 44 22', b, 7) +
        coil(b, l) +
        line('M-6 30 v12 M6 30 v12 M18 30 v12 M28 32 v8', band, 2.4) +
        tube('M0 24 Q-8 16 -8 2', b, 11) +
        // 張開的頸部（眼鏡蛇的特徵）
        ell(-8, -6, 22, 24, b) + flat(-8, 0, 14, 16, l) +
        line('M-17 -2 q9 6 18 0', band, 2.4) +
        head(-8, -14, b, l);
    },
  };
})());
