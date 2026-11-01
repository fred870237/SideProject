// 非洲的動物（全身）
Object.assign(ART, (() => {
  const { circle, ell, flat, path, line, both, leg, backLeg, eyes, blush, nose, wmouth, smile, roundEars, pointEars, neck } = K;
  const dots = (pts, c, rx = 1.5, ry = rx) => pts.map(([x, y]) => flat(x, y, rx, ry, c)).join('');

  return {
    // 範例：頭在左邊、身體往右，尾巴翹起來；後腳先畫（顏色暗一點），再畫身體、前腳，最後畫頭
    lion: () => {
      const body = '#f6c36a', mane = '#e0813a';
      let maneRing = '';
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        maneRing += circle((-14 + Math.cos(a) * 19).toFixed(1), (-10 + Math.sin(a) * 19).toFixed(1), 8, mane);
      }
      return line('M33 16 q12 -4 10 -18', LINE, 6) + line('M33 16 q12 -4 10 -18', body, 3) + circle(43, -3, 5, mane) +
        backLeg(4, 22, 9, body) + backLeg(30, 22, 9, body) +
        ell(14, 18, 24, 15, body) + flat(12, 25, 15, 6, '#fde7bb') +
        leg(-4, 24, 9.5, body) + leg(24, 24, 9.5, body) +
        maneRing + circle(-14, -10, 19, mane, 'stroke="none"') +
        roundEars(-14, -24, 12, 5.5, body, '#f09a5a') +
        circle(-14, -9, 16, body) +
        flat(-14, -1, 9, 6.5, '#fde7bb') + nose(-14, -3) + wmouth(-14, 1) +
        eyes(-14, -11, 7) + blush(-14, -3, 11);
    },

    camel: () => {
      const b = '#e5b97c', d = '#d9a96a', m = '#f4d7a6';
      return line('M34 12 q6 4 5 14', LINE, 3.2) +
        backLeg(8, 18, 7, b) + backLeg(30, 18, 7, b) +
        ell(9, 4, 9, 10, d) + ell(25, 5, 8, 9, d) +
        ell(16, 15, 21, 11, b) + flat(15, 21, 13, 4, m) +
        path('M-16 -10 Q-8 2 -4 14 L12 12 Q4 -4 -6 -16z', b) +
        leg(2, 20, 7.5, b) + leg(24, 20, 7.5, b) +
        both((s) => ell(-18 + s * 13, -24, 4.5, 3, d, s * 25)) +
        circle(-18, -18, 14, b) +
        ell(-18, -9, 10, 6.5, m) + `<circle cx="-21.5" cy="-10.5" r="1.3" fill="${LINE}"/><circle cx="-14.5" cy="-10.5" r="1.3" fill="${LINE}"/>` + smile(-18, -6.5, 3) +
        line('M-24 -31 q3 -4 6 -1 q3 -4 6 1', '#c99554', 3) +
        eyes(-18, -20, 6, 3.8) + blush(-18, -12, 11, 3.6);
    },

    elephant: () => {
      const b = '#bac7d5', e = '#a9b7c7';
      return line('M37 14 q6 2 6 10', LINE, 2.6) +
        backLeg(6, 22, 11, b) + backLeg(30, 22, 11, b) +
        ell(16, 15, 23, 16, b) +
        leg(-2, 24, 11.5, b) + leg(23, 24, 11.5, b) +
        both((s) => ell(-14 + s * 18, -9, 10, 14, e, s * -10) + flat(-14 + s * 19, -8, 5.5, 9, '#f2c6d0', s * -10)) +
        circle(-14, -10, 17, b) +
        line('M-14 -2 q-1 14 -9 19 q-6 2 -7 -3', LINE, 9.5) + line('M-14 -2 q-1 14 -9 19 q-6 2 -7 -3', b, 5.2) +
        line('M-15.5 6 h3.4 M-17 11 h3.4', '#93a2b3', 1.4) +
        both((s) => path(`M${-14 + s * 6} 1 q${s * 2} 5 ${s * 6} 5 q${-s * 4} -4 ${-s * 3} -6z`, '#fffdf5')) +
        eyes(-14, -12, 7, 4) + blush(-14, -4, 11, 3.6);
    },

    gorilla: () => {
      const b = '#5b5560', f = '#c9a99a';
      return backLeg(6, 24, 10, b) + backLeg(30, 22, 10, b) +
        ell(16, 15, 22, 16, b) + flat(20, 9, 13, 6, '#8a8590') +
        leg(-2, 12, 11, b) + leg(25, 24, 10, b) +
        roundEars(-12, -11, 16.5, 4.5, b, f) +
        circle(-12, -12, 17, b) +
        path('M-12 -16 C-2 -20 3 -10 0 -4 C-2 4 -22 4 -24 -4 C-27 -10 -22 -20 -12 -16z', f) +
        line('M-21 -17 q4 -3 8 -1 M-3 -17 q-4 -3 -8 -1', b, 3) +
        flat(-14, -5, 1.4, 1.1, LINE) + flat(-10, -5, 1.4, 1.1, LINE) + smile(-12, -1.5, 3.4) +
        eyes(-12, -11, 5, 3.6) + blush(-12, -5, 9.5, 3);
    },

    giraffe: () => {
      const b = '#f7c75e', s = '#d9893a', m = '#fbe3a6', o = '#b5652b';
      return line('M34 18 q5 6 3 14', LINE, 2.6) + circle(37, 32, 2.8, o) +
        backLeg(10, 24, 6.5, b) + backLeg(32, 24, 6.5, b) +
        path('M-4 18 L-20 -18 L-6 -22 L12 12z', b) +
        dots([[-12, -8], [-5, 4]], s, 3, 3.4) +
        ell(17, 20, 19, 10, b) + dots([[8, 18], [18, 15], [27, 20], [16, 25]], s, 3.2, 2.6) +
        leg(5, 26, 6.5, b) + leg(26, 26, 6.5, b) +
        both((q) => line(`M${-14 + q * 5} -36 l${q * 1} -6`, LINE, 3.4) + circle(-14 + q * 6, -43, 3, o)) +
        both((q) => ell(-14 + q * 15, -29, 6, 3, b, q * 20)) +
        circle(-14, -27, 13, b) + flat(-21, -33, 2.6, 2.2, s) + flat(-6, -34, 2.2, 2, s) +
        ell(-14, -19, 8.5, 5.5, m) + `<circle cx="-17" cy="-20" r="1.3" fill="${LINE}"/><circle cx="-11" cy="-20" r="1.3" fill="${LINE}"/>` + smile(-14, -17, 2.6) +
        eyes(-14, -28, 5.5, 3.4) + blush(-14, -22, 10, 3);
    },

    hippo: () => {
      const b = '#c7a8d6', m = '#dcc3e6';
      return line('M38 16 l5 2', LINE, 2.6) +
        backLeg(6, 26, 10, b) + backLeg(30, 26, 10, b) +
        ell(15, 18, 25, 15, b) + flat(14, 26, 16, 5, m) +
        leg(-2, 28, 10.5, b) + leg(24, 28, 10.5, b) +
        roundEars(-14, -22, 9, 4, '#b99acb', '#f2c6d0') +
        circle(-14, -10, 15, b) +
        ell(-14, 1, 15, 10, m) + flat(-19, -2, 2.4, 3, '#8f6aa3') + flat(-9, -2, 2.4, 3, '#8f6aa3') + smile(-14, 4, 5) +
        eyes(-14, -14, 6.5, 3.8) + blush(-14, -6, 13, 3.4);
    },

    zebra: () => {
      const w = '#ffffff', k = '#2c2a2e';
      return line('M35 12 q6 4 6 12', LINE, 2.6) + ell(41, 26, 2.6, 4, k) +
        backLeg(6, 20, 7, w) + backLeg(30, 20, 7, w) +
        neck(-14, -8, 2, 13, 15, w) + ell(15, 15, 22, 12, w) +
        line('M3 6 q2 7 0 14 M11 4 q2 8 0 16 M19 4 q2 8 0 16 M27 6 q2 6 0 12', k, 2.8) +
        leg(0, 22, 7.5, w) + leg(25, 22, 7.5, w) +
        line('M-3 30 h6 M-3 35 h6 M22 30 h6 M22 35 h6', k, 2) +
        line('M-22 -24 l3 -6 l3 5 l3 -6 l3 5 l3 -6 l3 5', LINE, 4) +
        pointEars(-14, -21, 10, 11, 8, w, '#f8c9d4') +
        circle(-14, -10, 15, w) +
        line('M-20 -22 q2 4 1 7 M-14 -24 v7 M-8 -22 q-2 4 -1 7', k, 2.6) +
        ell(-14, 0, 10, 6.5, '#5d5a63') + flat(-18, -1, 1.8, 1.5, k) + flat(-10, -1, 1.8, 1.5, k) +
        line('M-17 3 q3 2 6 0', '#f5f2f2', 1.6) +
        eyes(-14, -11, 6.5, 3.8) + blush(-14, -5, 11, 3.2);
    },

    crocodile: () => {
      const b = '#6cbf4f', d = '#57a33d', l = '#c9e89a';
      let bumps = '';
      for (let i = 0; i < 6; i++) bumps += circle(-6 + i * 7, (21 + Math.abs(i - 2.5) * 0.6).toFixed(1), 3, d);
      return bumps + path('M28 25 Q42 24 47 16 Q46 34 28 37z', b) +
        backLeg(0, 32, 8, b) + backLeg(26, 32, 8, b) +
        ell(10, 30, 23, 9, b) + flat(8, 35, 16, 3.5, l) +
        leg(-6, 34, 8.5, b) + leg(20, 34, 8.5, b) +
        ell(-34, 32, 13, 6, b) + flat(-36, 34, 9, 2.5, l) +
        circle(-24, 27, 11, b) +
        both((s) => circle(-24 + s * 5, 18, 5, b)) +
        flat(-44, 29, 1.2, 1, LINE) + flat(-40, 28, 1.2, 1, LINE) +
        line('M-44 34 q8 3 16 -1', LINE, 1.8) + path('M-38 35 l1.4 2.6 l1.4 -2.4z M-33 35 l1.4 2.6 l1.4 -2.6z', '#fff') +
        eyes(-24, 18, 5, 3.2) + blush(-24, 28, 7, 2.8);
    },

    rhino: () => {
      const b = '#9aa3ad', l = '#c3cad2';
      return line('M38 14 q5 2 5 9', LINE, 2.6) +
        backLeg(6, 24, 10, b) + backLeg(30, 24, 10, b) +
        ell(15, 16, 24, 15, b) + flat(14, 24, 15, 5, l) +
        leg(-2, 26, 10.5, b) + leg(24, 26, 10.5, b) +
        both((s) => ell(-14 + s * 12, -22, 4, 7.5, b, s * 25)) +
        circle(-14, -10, 15, b) +
        // 角長在大鼻子上
        ell(-14, 3, 13, 9, l) +
        path('M-19 -2 Q-17 -12 -12 -20 Q-11 -10 -9 -2z', '#efe7d6') +
        flat(-20, 5, 1.6, 1.3, LINE) + flat(-8, 5, 1.6, 1.3, LINE) + smile(-14, 8, 3.2) +
        eyes(-14, -12, 9.5, 3.4) + blush(-14, 0, 13.5, 3);
    },

    cheetah: () => {
      const b = '#f2c14e', k = '#3a2e2a', m = '#fff3dc';
      return line('M34 14 q10 2 10 -14 q0 -5 -3 -6', LINE, 6) + line('M34 14 q10 2 10 -14 q0 -5 -3 -6', b, 3) +
        line('M42 4 h3 M43 -4 h3', k, 2) +
        backLeg(6, 20, 7, b) + backLeg(30, 20, 7, b) +
        neck(-14, -8, 2, 14, 15, b) + ell(15, 16, 22, 10, b) + flat(14, 22, 14, 3.5, m) +
        dots([[4, 12], [11, 9], [19, 11], [27, 9], [8, 18], [23, 17], [31, 14], [15, 15]], k, 1.6) +
        leg(0, 22, 7.5, b) + leg(25, 22, 7.5, b) + dots([[0, 30], [25, 33]], k, 1.3) +
        roundEars(-14, -22, 11, 4.5, b, '#f8d9c4') +
        circle(-14, -10, 15, b) + dots([[-20, -20], [-8, -20], [-14, -22], [-25, -12], [-3, -12]], k, 1.3) +
        flat(-14, -1, 8, 5.5, m) +
        line('M-21.5 -8 q0 5 3.5 8 M-6.5 -8 q0 5 -3.5 8', k, 1.8) +
        nose(-14, -4) + wmouth(-14, 0) +
        eyes(-14, -12, 6.5, 3.8) + blush(-14, -3, 11.5, 3);
    },

    meerkat: () => {
      const b = '#d9b98a', l = '#f3e2c2', p = '#6b4e33';
      return line('M8 34 q14 2 16 -10', LINE, 6.5) + line('M8 34 q14 2 16 -10', b, 3.4) + flat(24, 24, 2, 2.4, p) +
        ell(-6, 41, 6, 3.5, b) + ell(6, 41, 6, 3.5, b) +
        ell(0, 15, 13, 26, b) + flat(0, 19, 7.5, 17, l) +
        ell(-6, 6, 3.6, 6, b, 15) + ell(6, 6, 3.6, 6, b, -15) +
        roundEars(0, -25, 13, 4, b, p) +
        circle(0, -24, 14, b) +
        flat(0, -16, 7, 5, l) + nose(0, -18, LINE, 2.4) + smile(0, -14, 2.4) +
        eyes(0, -25, 5.5, 3.6, p) + blush(0, -17, 9.5, 2.8);
    },

    lemur: () => {
      const b = '#a9a7a4', w = '#fdfbf6', k = '#3a3336';
      const pts = [[30, 12], [35, 7], [38, 1], [40, -5], [41, -11], [41, -17], [40, -23], [38, -29], [35, -34], [31, -38], [27, -40]];
      const tail = pts.map(([x, y], i) => circle(x, y, 4.6, i % 2 ? w : k)).join('');
      return tail +
        backLeg(6, 20, 7, b) + backLeg(28, 20, 7, b) +
        neck(-14, -8, 1, 14, 15, b) + ell(14, 16, 20, 11, b) + flat(13, 22, 13, 4, '#e6e2dc') +
        leg(0, 22, 7.5, b) + leg(23, 22, 7.5, b) +
        pointEars(-14, -20, 10, 9, 7, b, w) +
        circle(-14, -10, 15, b) +
        flat(-14, -6, 12, 10, w) +
        both((s) => flat(-14 + s * 6, -10, 4.6, 5.5, k, s * -25)) +
        nose(-14, -3, k, 2.6) + smile(-14, 1, 2.6) +
        eyes(-14, -10, 6, 3.4, '#f5b041') + blush(-14, -2, 11, 3);
    },

    'sea-turtle': () => {
      const sh = '#43a047', pl = '#66bb6a', sk = '#9ccc65', fl = '#8bc34a';
      return ell(36, 18, 5, 3, fl, 20) +
        ell(30, -6, 9, 4.5, fl, -35) + ell(30, 24, 9, 4.5, fl, 35) +
        ell(0, -16, 18, 6.5, fl, -28) + ell(0, 30, 18, 6.5, fl, 28) +
        ell(10, 8, 26, 19, sh) +
        path('M0 0 L10 -6 L20 0 L20 14 L10 20 L0 14z', pl) +
        line('M0 0 L-12 -4 M20 0 L32 -4 M0 14 L-12 20 M20 14 L32 20 M10 -6 V-11 M10 20 V27', '#2e7d32', 2) +
        circle(-28, 6, 13, sk) +
        eyes(-28, 3, 5, 3.3) + blush(-28, 10, 8, 2.8) + smile(-28, 11, 2.6);
    },

    kiwi: () => {
      const b = '#8d6e4f', d = '#6e533a', lg = '#e0a96d', bk = '#d9b38c';
      return both((s) => line(`M${6 + s * 6} 30 v12 l${s * 4} 2 M${6 + s * 6} 42 l${-s * 3} 2`, lg, 2.8)) +
        ell(8, 12, 25, 21, b) +
        dots([[18, 0], [26, 10], [14, 24], [24, 22], [4, 28], [30, 2]], d, 3, 1.5) +
        circle(-14, -4, 14, b) +
        line('M-15 3 q-10 12 -30 24', LINE, 6.2) + line('M-15 3 q-10 12 -30 24', bk, 3.4) +
        eyes(-14, -7, 6, 3.6) + blush(-14, 0, 10, 3);
    },
  };
})());
