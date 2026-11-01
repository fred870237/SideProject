// 亞洲北部（西伯利亞、遠東）的動物（全身）
Object.assign(ART, (() => {
  const { circle, ell, flat, path, line, leg, backLeg, eyes, blush, nose, wmouth, smile, roundEars, pointEars } = K;
  const fluffTail = (d, c, w) => line(d, LINE, w + 4.8) + line(d, c, w);

  return {
    'brown-bear': () => {
      const b = '#9a6a43', m = '#d9b48a';
      return circle(38, 10, 4.5, b) +
        backLeg(6, 22, 10, b) + backLeg(30, 22, 10, b) +
        ell(16, 16, 24, 16, b) + flat(15, 25, 15, 5, '#b4825a') +
        leg(-2, 24, 11, b) + leg(24, 24, 11, b) + ell(-5, 8, 12, 11, b) +
        roundEars(-14, -23, 11, 5.5, b, '#c48d5e') +
        circle(-14, -10, 16, b) +
        ell(-14, -2, 9, 7, m) + nose(-14, -5) + wmouth(-14, -1) +
        eyes(-14, -12, 7) + blush(-14, -4, 11.5, 3.6);
    },

    wolf: () => {
      const g = '#98a2b0', w = '#eef1f4';
      return fluffTail('M34 14 Q48 12 45 -6', g, 7) + ell(45, -6, 4, 5.5, w, 15) +
        backLeg(6, 20, 7, g) + backLeg(30, 20, 7, g) +
        ell(15, 15, 22, 12, g) + flat(8, 20, 10, 5, w) +
        leg(0, 22, 7.5, g) + leg(25, 22, 7.5, g) + ell(-5, 7, 10, 10, g) +
        pointEars(-14, -21, 9, 13, 9, g, '#f2c6d0') +
        circle(-14, -9, 15, g) +
        path('M-25 -6 Q-14 -18 -3 -6 Q-6 6 -14 6 Q-22 6 -25 -6z', w, 'stroke="none"') +
        ell(-14, 0, 8.5, 6, w) + nose(-14, -2) + smile(-14, 2.5, 3) +
        eyes(-14, -11, 6.5, 4) + blush(-14, -3, 11, 3.2);
    },

    'arctic-fox': () => {
      const w = '#f8fafc', s = '#dbe4ee';
      return ell(36, 8, 9, 15, w, 25) + flat(38, 2, 4, 7, s, 25) +
        backLeg(8, 24, 6.5, w) + backLeg(28, 24, 6.5, w) +
        ell(16, 20, 18, 11, w) + flat(16, 26, 11, 3, s) +
        leg(3, 26, 7, w) + leg(23, 26, 7, w) + ell(-3, 10, 10, 10, w) +
        pointEars(-12, -20, 9, 11, 9, w, '#f6cbd6') +
        circle(-12, -9, 15, w) +
        flat(-12, 0, 7, 4.5, s) + nose(-12, -2) + smile(-12, 2, 3) +
        eyes(-12, -11, 6.5, 4) + blush(-12, -3, 11, 3.4);
    },

    'red-crowned-crane': () => {
      const w = '#fbfbfb', k = '#2c2a2e';
      return line('M4 20 L2 43 M14 20 L16 43', LINE, 2.8) + line('M-2 43 h8 M12 43 h8', LINE, 2.4) +
        path('M22 2 Q38 4 40 18 Q30 12 20 14z', k) +
        ell(10, 10, 18, 11, w) + path('M2 4 Q12 0 20 8 Q12 14 4 12z', '#eef0f2') +
        line('M-4 6 Q-12 -8 -12 -20', LINE, 9.5) + line('M-4 6 Q-12 -8 -12 -20', k, 5.2) +
        circle(-12, -28, 11, w) + path('M-18 -36 Q-12 -42 -6 -36 Q-12 -33 -18 -36z', '#e63946') +
        path('M-15 -22 L-12 -12 L-9 -22z', '#d9c27a') +
        eyes(-12, -28, 5, 3.4) + blush(-12, -23, 7.5, 2.6);
    },

    squirrel: () => {
      const c = '#c8693a', l = '#f6dcc0';
      return ell(24, 14, 12, 24, c, 12) + ell(30, -12, 10, 10, c) + flat(26, 12, 5, 16, '#e08a55', 12) +
        ell(-2, 26, 14, 16, c) + flat(-4, 28, 8, 11, l) +
        ell(-12, 42, 7, 3, c) + ell(7, 42, 7, 3, c) +
        ell(-6, 14, 4.5, 5, '#a8733a') + path('M-11 11 Q-6 6 -1 11z', '#6b4a2a') +
        ell(-12, 15, 3.4, 5.5, c, -25) + ell(0, 15, 3.4, 5.5, c, 25) +
        pointEars(-4, -20, 9, 12, 8, c, '#f2b49a') +
        circle(-4, -8, 14, c) +
        ell(-4, -1, 8, 6, l) + nose(-4, -3, '#3a2a2a', 2.2) + wmouth(-4, 0) +
        eyes(-4, -10, 6, 3.8) + blush(-4, -3, 10, 3);
    },
  };
})());
