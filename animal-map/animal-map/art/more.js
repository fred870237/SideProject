// 後來加的動物（全身）：農場和寵物，還有幾種很有名的野生動物
Object.assign(ART, (() => {
  const { circle, ell, flat, path, flatPath, line, both, leg, backLeg, neck, eyes, blush, nose, wmouth, smile, beak, whiskers, roundEars, pointEars } = K;
  const tail = (d, c, w = 6) => line(d, LINE, w + 3.5) + line(d, c, w);
  const nostrils = (cx, y, dx = 3) => flat(cx - dx, y, 1.4, 1.1, LINE) + flat(cx + dx, y, 1.4, 1.1, LINE);

  return {
    /* ---------- 農場、寵物 ---------- */
    dog: () => {
      const b = '#d9a066', d = '#a8693a', l = '#fbe3c4';
      return tail('M34 12 q10 -6 8 -18', b, 5) +
        backLeg(6, 24, 8, b) + backLeg(30, 24, 8, b) +
        neck(-14, -6, 2, 14, 16, b) + ell(16, 18, 22, 13, b) + flat(14, 25, 14, 5, l) + flat(24, 12, 7, 5, d) +
        leg(-2, 26, 8.5, b) + leg(22, 26, 8.5, b) +
        both((s) => ell(-14 + s * 15, -6, 6, 12, d, s * -18)) +
        circle(-14, -9, 16, b) + flat(-14, 0, 9, 6.5, l) +
        nose(-14, -2, LINE, 3.4) + wmouth(-14, 2) + path('M-16 4 q2 7 4 0z', '#ff7d96') +
        eyes(-14, -11, 7) + blush(-14, -2, 11.5);
    },

    cat: () => {
      const b = '#f4a95a', st = '#d9772e', l = '#fff1dc';
      return tail('M34 14 Q50 12 44 -6 Q40 -14 46 -18', b, 5) +
        backLeg(8, 24, 7, b) + backLeg(30, 24, 7, b) +
        neck(-14, -6, 2, 14, 15, b) + ell(16, 18, 21, 12, b) + flat(14, 25, 13, 4.5, l) +
        line('M10 8 q2 5 0 9 M18 7 q2 5 0 9 M26 8 q2 5 0 9', st, 2.6) +
        leg(0, 26, 7.5, b) + leg(23, 26, 7.5, b) +
        pointEars(-14, -19, 10, 12, 10, b, '#ffb4c0') +
        circle(-14, -8, 16, b) + line('M-18 -22 q2 3 0 6 M-10 -22 q-2 3 0 6', st, 2.4) +
        flat(-14, 1, 8, 5.5, l) + nose(-14, -1, '#ff8fa3', 2.6) + wmouth(-14, 2) + whiskers(-14, 0, 9) +
        eyes(-14, -10, 7, 4) + blush(-14, -2, 11.5);
    },

    cow: () => {
      const w = '#ffffff', k = '#3a3336', m = '#f7b7c3';
      return tail('M36 10 q8 8 4 22', w, 3) + circle(40, 33, 3, k) +
        backLeg(6, 24, 9, w) + backLeg(30, 24, 9, w) +
        neck(-14, 2, 2, 14, 17, w) + ell(15, 16, 24, 15, w) +
        flat(8, 10, 7, 5, k, 20) + flat(26, 18, 6, 6, k) + flat(18, 6, 4, 3, k) +
        leg(-2, 26, 9.5, w) + leg(24, 26, 9.5, w) + ell(30, 31, 5, 3, m) +
        both((s) => path(`M${-16 + s * 9} -14 q${s * 4} -8 ${s * 9} -6 q${-s * 3} 2 ${-s * 5} 8z`, '#f2d49b')) +
        both((s) => ell(-16 + s * 17, -2, 7, 4, w, s * 20)) +
        circle(-16, -1, 15, w) + flat(-22, -6, 5, 4, k) +
        ell(-16, 10, 11, 7, m) + nostrils(-16, 9, 4) +
        eyes(-16, -2, 6.5, 3.8) + blush(-16, 5, 12, 3.2);
    },

    pig: () => {
      const p = '#ffb3c6', d = '#f48aa8';
      // 豬沒有脖子：頭低低的，直接貼在圓滾滾的身體前面
      return line('M37 12 q6 -2 5 -7 q-1 -4 -4 -1 q-2 3 2 4', LINE, 2.4) +
        backLeg(6, 26, 8, p) + backLeg(30, 26, 8, p) +
        ell(13, 19, 26, 16, p) +
        leg(-4, 28, 8.5, p) + leg(24, 28, 8.5, p) +
        both((s) => path(`M${-20 + s * 5} 0 L${-20 + s * 15} -11 L${-20 + s * 15} 4z`, d)) +
        circle(-20, 12, 15, p) +
        ell(-20, 18, 8.5, 6, d) + nostrils(-20, 18, 3) +
        eyes(-20, 8, 7) + blush(-20, 15, 12.5);
    },

    sheep: () => {
      const wool = '#fbf8f1', f = '#4a3b33', fs = '#f2e3d0';
      let fluff = '';
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI * 2;
        fluff += circle((15 + Math.cos(a) * 21).toFixed(1), (14 + Math.sin(a) * 12).toFixed(1), 9, wool);
      }
      return leg(4, 26, 6, f, 44) + leg(30, 26, 6, f, 44) + fluff + flat(15, 14, 22, 13, wool) +
        leg(-2, 26, 6.5, f) + leg(22, 26, 6.5, f) +
        both((s) => ell(-14 + s * 14, -6, 7, 4, fs, s * 25)) +
        [[-24, -18], [-14, -22], [-4, -18]].map(([x, y]) => circle(x, y, 7, wool)).join('') +
        ell(-14, -6, 11, 13, fs) +
        nostrils(-14, 2, 2.6) + smile(-14, 4.5, 2.6) +
        eyes(-14, -8, 5, 3.4) + blush(-14, -1, 8.5, 2.6);
    },

    horse: () => {
      const b = '#b8763f', m = '#5a3a24', l = '#e8c49a';
      return tail('M36 6 Q48 10 44 30', m, 7) +
        backLeg(8, 22, 7, b) + backLeg(30, 22, 7, b) +
        path('M-12 4 L-6 -24 L8 -20 L8 12z', b) + ell(16, 14, 22, 12, b) +
        leg(2, 22, 7.5, b) + leg(24, 22, 7.5, b) +
        both((s) => leg(s > 0 ? 24 : 2, 40, 8, LINE, 44), 0) +
        path('M-8 -30 Q2 -32 6 -18 Q8 -6 4 4 L0 2 Q2 -10 -2 -22z', m) +
        pointEars(-12, -26, 5, 8, 6, b, l) +
        ell(-13, -12, 11.5, 17, b, 14) + flat(-16, -2, 8.5, 6.5, l, 14) +
        nostrils(-17, -2, 3) + smile(-16, 2.5, 2.6) +
        eyes(-11, -18, 5, 3.4) + blush(-12, -9, 9, 2.8);
    },

    chicken: () => {
      const w = '#ffffff', r = '#ef4444', y = '#f7a531';
      return line('M-2 30 V42 M8 30 V42', y, 3) + line('M-6 43 h8 M4 43 h8', y, 2.4) +
        path('M20 6 Q36 -10 34 10 Q42 4 38 22 Q30 26 22 20z', w) +
        neck(-10, -6, 2, 10, 14, w) + ell(4, 16, 20, 16, w) + path('M2 14 Q10 8 16 16 Q10 24 2 18z', '#f3eee4') +
        path('M-16 -26 q2 -8 6 -2 q3 -8 6 0 q4 -6 5 3z', r) +
        circle(-10, -14, 13, w) +
        beak(-22, -12, 4, 3) + path('M-20 -6 q-2 6 2 8 q3 -4 1 -8z', r) +
        eyes(-10, -16, 4.5, 3) + blush(-10, -9, 8, 2.6);
    },

    /* ---------- 野生動物 ---------- */
    ostrich: () => {
      const k = '#3a3336', pk = '#f4b6a0';
      return line('M4 22 L0 34 L4 44 M16 22 L18 34 L14 44', LINE, 5.5) + line('M4 22 L0 34 L4 44 M16 22 L18 34 L14 44', pk, 2.8) +
        path('M30 0 Q44 -4 42 10 Q46 16 34 16z', '#fbf8f1') +
        ell(12, 10, 22, 14, k) + flat(18, 6, 8, 4, '#5a5258') +
        tail('M-2 4 Q-8 -14 -10 -30', pk, 5) +
        circle(-11, -34, 9, pk) + path('M-12 -42 q2 -4 4 0 q2 -4 4 0', '#5a5258') +
        beak(-20, -32, 3.6, 2.4, '#f2c94c') +
        eyes(-10, -36, 3, 2.8) + blush(-10, -30, 5, 2);
    },

    chimpanzee: () => {
      const b = '#4a3b35', f = '#e8c4a2';
      const arm = (s) => tail(`M${s * 12} 10 Q${s * 24} 20 ${s * 20} 36`, b, 6.5) + circle(s * 20, 38, 4.2, f);
      return neck(0, -8, 0, 14, 18, b) + ell(0, 24, 15, 16, b) +
        both((s) => ell(s * 9, 38, 7.5, 6, b) + ell(s * 9, 42.5, 6, 2.4, f)) +
        both(arm) +
        both((s) => circle(s * 17, -12, 6, f)) +
        circle(0, -13, 16, b) +
        path('M0 -24 Q10 -24 10 -14 Q12 -2 0 2 Q-12 -2 -10 -14 Q-10 -24 0 -24z', f) +
        nostrils(0, -6, 2) + smile(0, -2.5, 4) +
        eyes(0, -13, 5, 3.4) + blush(0, -6, 8, 2.6);
    },

    'komodo-dragon': () => {
      const b = '#8d8a6a', d = '#6e6b50', l = '#c9c4a0';
      return tail('M30 28 Q46 30 48 40', b, 8) +
        backLeg(4, 30, 8, b) + backLeg(28, 30, 8, b) +
        ell(12, 26, 24, 11, b) + flat(12, 32, 16, 3.5, l) +
        [2, 12, 22].map((x) => flat(x, 22, 3, 2, d)).join('') +
        leg(-6, 32, 8.5, b) + leg(20, 32, 8.5, b) +
        ell(-12, 14, 10, 9, b) +
        ell(-20, 2, 15, 11, b) + flat(-24, 8, 9, 3.5, l) +
        line('M-35 6 l-7 -1 m7 1 l-6 3', '#ef4444', 1.8) +
        flat(-32, 0, 1.2, 1, LINE) + line('M-34 6 q8 3 18 0', LINE, 1.6) +
        eyes(-20, -2, 5.5, 3.2) + blush(-20, 5, 9, 2.6);
    },

    tortoise: () => {
      const s = '#b98552', d = '#8d5f34', sk = '#a8b06a';
      return backLeg(0, 28, 9, sk) + backLeg(30, 28, 9, sk) + line('M40 30 l6 2', LINE, 4) +
        path('M-12 32 Q-12 0 14 -4 Q42 0 42 32z', s) +
        path('M2 6 L14 0 L26 6 L26 18 L14 24 L2 18z', d) + line('M2 6 L-8 14 M26 6 L36 14 M2 18 L-6 30 M26 18 L34 30 M14 24 V32 M14 0 V-4', d, 2.4) +
        path('M-14 32 H42 Q42 36 38 37 H-10 Q-14 36 -14 32z', '#d9b07a') +
        leg(-6, 32, 9, sk) + leg(30, 32, 9, sk) +
        tail('M-10 26 Q-18 18 -20 8', sk, 9) +
        circle(-22, 2, 11, sk) + smile(-25, 6, 3) +
        eyes(-22, 0, 5, 3.2) + blush(-22, 7, 8, 2.4);
    },

    'sea-otter': () => {
      const b = '#8a6248', l = '#e8d3bd';
      const water = 'M-50 30 q6.25 -4 12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0';
      return flatPath(`${water} V48 H-50Z`, '#7cc9ee') +
        ell(8, 20, 30, 12, b) + flat(10, 16, 18, 6, l) +
        tail('M36 22 q10 2 12 -4', b, 6) + both((s) => circle(s > 0 ? 34 : -18, 20, 5, b)) +
        circle(-20, 4, 15, b) + ell(-20, 8, 11, 9, l) +
        both((s) => circle(-20 + s * 12, -8, 4, b)) +
        nostrils(-20, 4, 2.2) + wmouth(-20, 7) + whiskers(-20, 6, 7) +
        path('M0 6 Q6 -2 12 6 Q6 10 0 6z', '#f3c6d6') +
        both((s) => circle(s > 0 ? 12 : 0, 8, 4, b)) +
        eyes(-20, 0, 6, 3.2) + blush(-20, 6, 10, 2.6) +
        line(water, '#3b9fd6', 2.2);
    },

    clownfish: () => {
      const o = '#ff8a2a', w = '#ffffff';
      return path('M28 0 L46 -14 Q44 0 46 14z', o) +
        path('M-6 -18 Q6 -30 18 -16z', o) + path('M0 16 Q8 28 16 16z', o) +
        ell(4, 0, 30, 18, o) +
        path('M-14 -15 Q-8 0 -14 15 Q-6 16 -3 14 Q-8 0 -3 -14z', w) +
        path('M8 -18 Q14 0 8 18 Q16 18 18 16 Q22 0 18 -16z', w) +
        path('M28 -10 Q32 0 28 10 L34 8 Q36 0 34 -8z', w) +
        smile(-20, 4, 3) +
        K.eye(-20, -4, 4) + blush(-18, 3, 6, 2.6);
    },

    orca: () => {
      const k = '#2b2b33', w = '#ffffff';
      const water = 'M-50 34 q6.25 -4 12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0';
      return flatPath(`${water} V48 H-50Z`, '#7cc9ee') +
        path('M2 -2 L10 -34 L20 -2z', k) +
        path('M34 8 L48 -6 Q46 10 50 22z', k) +
        path('M-44 14 Q-40 -6 -10 -6 Q20 -6 38 10 Q34 24 0 26 Q-36 28 -44 14z', k) +
        path('M-43 15 Q-30 24 -6 22 Q8 21 14 16 Q20 22 10 25 Q-10 29 -30 26 Q-40 23 -43 15z', w) +
        ell(-17, 0, 8, 4.2, w, -10) +
        path('M14 2 Q22 0 26 6 Q20 8 14 2z', '#c9ccd6') +
        smile(-36, 14, 4) +
        K.eye(-31, 4, 3.4) + blush(-31, 10, 6, 2.4) +
        line(water, '#3b9fd6', 2.2);
    },
  };
})());
