// 亞洲與大洋洲的動物（全身）
Object.assign(ART, (() => {
  const { circle, ell, flat, path, flatPath, line, both, leg, backLeg, shade, eyes, blush, nose, wmouth, smile, beak, whiskers, roundEars, pointEars, neck } = K;
  const ring = (x, y, r, c) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${c}" stroke-width="2"/>`;
  const dots = (pts, r, c) => pts.map(([x, y]) => flat(x, y, r, r, c)).join('');
  // 粗尾巴：先畫深色外框線再畫顏色
  const tail = (d, c, w = 6.5) => line(d, LINE, w + 3.5) + line(d, c, w);

  return {
    'snow-leopard': () => {
      const b = '#eef1f4', sp = '#5c6670';
      return tail('M32 16 q10 0 8 -16 q-1 -5 -5 -4', b) + ring(40, 4, 2, sp) + ring(39, -6, 2, sp) +
        backLeg(4, 22, 9, b) + backLeg(30, 22, 9, b) +
        neck(-14, -6, 2, 14, 17, b) + ell(14, 18, 24, 15, b) + flat(12, 26, 15, 5, '#fff') +
        ring(6, 10, 3, sp) + ring(17, 8, 3, sp) + ring(28, 11, 3, sp) + ring(12, 18, 2.6, sp) + ring(24, 19, 2.6, sp) + ring(34, 18, 2.4, sp) +
        leg(-4, 24, 9.5, b) + leg(24, 24, 9.5, b) +
        roundEars(-14, -23, 12, 5.5, b, '#f8dbe2') + circle(-14, -9, 16, b) +
        dots([[-21, -19], [-14, -21], [-7, -19], [-27, -8], [-1, -8]], 1.7, sp) +
        flat(-14, -1, 9, 6.5, '#fff') + nose(-14, -3, '#e58aa0') + wmouth(-14, 1) +
        eyes(-14, -11, 7, 4, '#9fd3e8') + blush(-14, -3, 11);
    },

    tiger: () => {
      const b = '#f6a23c', st = '#3d2a20';
      return tail('M33 16 q12 -4 10 -18', b, 4.5) + line('M38 14 l3 -3 M42 6 l-4 -1', st, 2.4) + circle(43, -3, 3.5, st) +
        backLeg(4, 22, 9, b) + backLeg(30, 22, 9, b) +
        neck(-14, -6, 2, 14, 17, b) + ell(14, 18, 24, 15, b) + flat(12, 26, 15, 5, '#fff1dc') +
        [6, 14, 22, 30].map((x) => line(`M${x} 4 q2.5 5 0 10`, st, 2.8)).join('') +
        leg(-4, 24, 9.5, b) + leg(24, 24, 9.5, b) +
        roundEars(-14, -23, 12, 5.5, b, '#fff1dc') + circle(-14, -9, 16, b) +
        line('M-20 -23 q2 4 0 7 M-14 -25 v8 M-8 -23 q-2 4 0 7', st, 2.6) +
        line('M-30 -10 l5 1.5 M-30 -5 l5 0 M2 -10 l-5 1.5 M2 -5 l-5 0', st, 2.4) +
        flat(-18, 0, 6, 5, '#fff') + flat(-10, 0, 6, 5, '#fff') + nose(-14, -3) + wmouth(-14, 1) +
        eyes(-14, -11, 7) + blush(-14, -3, 11);
    },

    'red-panda': () => {
      const b = '#d8622c', d = '#a8441c', dk = '#5a2a17', w = '#fff6ea';
      return circle(39, -14, 7, d) + circle(38, -6, 7, b) + circle(35, 2, 7, d) + circle(31, 10, 7, b) +
        backLeg(4, 24, 9, dk) + backLeg(28, 24, 9, dk) +
        neck(-14, -6, 2, 14, 17, b) + ell(14, 18, 22, 14, b) + flat(10, 27, 12, 4, dk) +
        leg(-3, 26, 9.5, dk) + leg(22, 26, 9.5, dk) +
        pointEars(-14, -20, 10, 11, 11, b, w) + circle(-14, -9, 16, b) +
        flat(-21, -1, 6.5, 5.5, w) + flat(-7, -1, 6.5, 5.5, w) + flat(-14, 1, 5, 4.5, w) +
        flat(-20, -18, 2.8, 2, w) + flat(-8, -18, 2.8, 2, w) +
        flat(-20, -4, 1.6, 4, '#8a3416', 15) + flat(-8, -4, 1.6, 4, '#8a3416', -15) +
        nose(-14, -2) + wmouth(-14, 2) + eyes(-14, -11, 6.5) + blush(-14, -2, 11.5);
    },

    panda: () => {
      const w = '#fbfbfb', k = '#2c2a2e';
      return circle(37, 12, 4.5, w) +
        backLeg(4, 22, 9.5, k) + backLeg(30, 22, 9.5, k) +
        neck(-14, -6, 2, 14, 17, w) + ell(14, 18, 24, 15, w) + flat(0, 17, 7, 12, k, 10) + ell(14, 18, 24, 15, 'none') +
        leg(-4, 24, 10, k) + leg(24, 24, 10, k) +
        roundEars(-14, -23, 11.5, 6, k) + circle(-14, -9, 16, w) +
        flat(-20, -10, 4.6, 6.2, k, 25) + flat(-8, -10, 4.6, 6.2, k, -25) +
        eyes(-14, -10, 6, 2.6, '#fff') + nose(-14, -2, k) + wmouth(-14, 2) + blush(-14, -1, 11);
    },

    orangutan: () => {
      const b = '#d4743a', d = '#b4561f', f = '#f2c49b';
      const arm = (s) => tail(`M${s * 12} 10 Q${s * 25} 20 ${s * 22} 37`, b, 6.5) + circle(s * 22, 39, 4.5, f);
      return neck(0, -8, 0, 14, 18, b) + ell(0, 24, 16, 17, b) + flat(0, 26, 9, 11, '#e8945a') +
        both((s) => ell(s * 9, 38, 8, 6, b) + ell(s * 9, 42.5, 6, 2.4, f)) +
        both(arm) +
        both((s) => circle(s * 16.5, -12, 4, f)) +
        circle(0, -14, 17, b) + line('M-6 -29 q3 -8 6 -1 q3 -8 6 1', d, 3.4) +
        ell(0, -11, 12, 12.5, f) +
        both((s) => flat(s * 2.2, -6.5, 1.5, 1.2, LINE)) + smile(0, -3, 4) +
        eyes(0, -14, 5, 3.6) + blush(0, -7, 8.5, 3.2);
    },

    'formosan-bear': () => {
      const k = '#2f2b2e', c = '#fff6dc', m = '#d9b48a';
      return both((s) => ell(s * 15, 41, 7.5, 4.5, k)) +
        ell(0, 24, 18, 18, k) +
        path('M-12 9 L0 22 L12 9 L8 8 L0 16 L-8 8z', c) +
        both((s) => leg(s * 8.5, 27, 8.5, k)) +
        roundEars(0, -23, 13, 6.5, k, '#5a5458') + circle(0, -10, 17, k) +
        flat(0, -1, 9, 7, m) + nose(0, -4) + wmouth(0, 0) +
        eyes(0, -12, 7, 3.4, '#fff') + blush(0, -3, 12);
    },

    'leopard-cat': () => {
      const b = '#dba864', sp = '#5a3b22', w = '#fff6ea';
      return tail('M32 18 q10 -2 10 -16', b, 4.2) + line('M37 15 l2 3 M41 9 l-3 1', sp, 2.2) + circle(42, 2, 2.6, sp) +
        backLeg(6, 25, 8, b) + backLeg(28, 25, 8, b) +
        neck(-14, -5, 2, 16, 16, b) + ell(14, 20, 21, 13, b) + flat(12, 28, 13, 4, '#fff8ee') +
        dots([[2, 13], [10, 10], [18, 9], [26, 11], [32, 17], [8, 19], [16, 17], [24, 19]], 1.9, sp) +
        leg(-2, 27, 8.5, b) + leg(21, 27, 8.5, b) +
        roundEars(-14, -21, 11, 5.5, b, w) + circle(-14, -8, 16, b) +
        line('M-17.5 -14 L-18.5 -22.5 M-10.5 -14 L-9.5 -22.5', w, 2.6) + line('M-14 -15 v-8', sp, 2) +
        dots([[-27, -7], [-25, -1], [-1, -7], [-3, -1]], 1.6, sp) +
        flat(-14, 0, 8, 5.5, '#fff8ee') + nose(-14, -2, '#e58aa0') + wmouth(-14, 2) + whiskers(-14, 0, 8) +
        eyes(-14, -9, 6.5, 3.8, w) + blush(-14, -2, 11);
    },

    'blue-magpie': () => {
      const bl = '#2c6fd1', k = '#1f2230', r = '#e0322b';
      return tail('M14 16 L40 31', bl, 5) + line('M35.7 28.5 L40 31', '#fff', 5) + line('M33.6 27.3 l1.4 0.8', k, 5) +
        tail('M14 13 L44 20', bl, 5.5) + line('M39.1 18.9 L44 20', '#fff', 5.5) + line('M36.8 18.3 l1.6 0.4', k, 5.5) +
        line('M-3 22 l-1 20 M4 22 l1 20', r, 2.6) + line('M-7 43 l4 -1 l3 1 M2 43 l4 -1 l3 1', r, 2.2) +
        ell(3, 12, 17, 12, bl) + flat(-1, 17, 10, 5, '#5d97e6') +
        ell(9, 9, 11, 6.5, '#2459b0', -12) + flat(17, 11, 3, 1.6, '#fff', -12) + flat(12, 13, 3, 1.6, '#fff', -12) +
        circle(-12, -10, 15, k) +
        path('M-24 -7 Q-34 -4 -38 -1 Q-30 1 -22 -1z', r) +
        eyes(-12, -12, 6.5, 3.4, '#ffd23f') + blush(-12, -3, 10, 3.4);
    },

    peacock: () => {
      const bl = '#2a6fd6', gr = '#3fae5a', dk = '#2f8a46';
      const spots = [];
      for (let i = 0; i <= 6; i++) { const a = Math.PI + (i / 6) * Math.PI; spots.push([8 + Math.cos(a) * 30, 8 + Math.sin(a) * 26]); }
      for (let i = 0; i < 4; i++) { const a = Math.PI * (1.17 + i * 0.22); spots.push([8 + Math.cos(a) * 17, 8 + Math.sin(a) * 15]); }
      const fan = spots.map(([x, y]) => line(`M8 22 L${x.toFixed(1)} ${y.toFixed(1)}`, dk, 1.4)).join('') +
        spots.map(([x, y]) => {
          x = x.toFixed(1); y = y.toFixed(1);
          return flat(x, y, 4.6, 5.6, '#ffd23f') + flat(x, y, 3.2, 4, '#1f9a8f') + flat(x, y, 1.6, 2.1, '#1b3f8f');
        }).join('');
      return ell(8, 6, 38, 33, gr) + fan +
        line('M-2 35 l-1 8 M5 35 l1 8', '#9a8f86', 2.6) + line('M-7 44 l4 -1 l3 1 M2 44 l4 -1 l3 1', '#9a8f86', 2) +
        ell(1, 22, 11, 14, bl) + flat(-1, 26, 6, 7, '#4a8ae8') + ell(6, 22, 5, 8, '#1f56b0', -10) +
        line('M0 -19 l-4 -8 M0 -19 v-10 M0 -19 l4 -8', LINE, 1.6) +
        circle(-4, -27, 2, bl) + circle(0, -29, 2, bl) + circle(4, -27, 2, bl) +
        circle(0, -5, 14, bl) + flat(-7, -5, 2.6, 1.5, '#fff') + flat(7, -5, 2.6, 1.5, '#fff') +
        eyes(0, -7, 6, 3.5) + beak(0, -1, 3.5, 3) + blush(0, 0, 9.5, 3);
    },

    yak: () => {
      const b = '#5a3d2b', l = '#7a5640', h = '#efe4c8';
      const skirt = 'M-10.5 20 L-8 34 L-4 30 L0 35 L4 30 L8 35 L12 30 L16 35 L20 30 L24 35 L28 30 L32 34 L36 29 L38 17';
      return line('M37 10 q7 6 5 17', LINE, 3.4) + ell(42, 29, 3.5, 5.5, b) +
        backLeg(6, 26, 9, b) + backLeg(32, 26, 9, b) + leg(-2, 28, 9.5, b) + leg(26, 28, 9.5, b) +
        ell(6, 2, 14, 8, b) + ell(14, 14, 26, 16, b) +
        flatPath(skirt + ' L20 12z', b) + line(skirt, LINE, SW) +
        line('M4 8 q3 4 0 8 M14 6 q3 4 0 8 M24 8 q3 4 0 8', l, 2) +
        path('M-26 -12 Q-38 -14 -36 -28 Q-32 -18 -24 -17z', h) + path('M-6 -12 Q6 -14 4 -28 Q0 -18 -8 -17z', h) +
        ell(-31, -3, 5, 3, l, -15) + ell(-1, -3, 5, 3, l, 15) +
        circle(-16, -6, 15, b) + flat(-16, -17, 8, 3.5, l) +
        flat(-16, 2, 8.5, 5.5, '#8a6a55') + flat(-19, 1, 1.4, 1.2, LINE) + flat(-13, 1, 1.4, 1.2, LINE) + smile(-16, 4.5, 2.8) +
        eyes(-16, -7, 6.5, 3.8) + blush(-16, 0, 11, 3.6);
    },

    macaque: () => {
      const b = '#9c8b7a', l = '#c9bba9', f = '#f2a3a8', p = '#e7a9a4';
      return neck(0, -8, 0, 14, 18, b) + ell(0, 24, 16, 17, b) + flat(0, 25, 8, 10, l) +
        both((s) => ell(s * 9, 35, 7.5, 7, b) + ell(s * 9, 41.5, 6, 2.6, p)) +
        both((s) => tail(`M${s * 12} 12 Q${s * 17} 22 ${s * 10} 28`, b, 5.5) + circle(s * 9, 29, 3.4, p)) +
        both((s) => circle(s * 17, -12, 4, f)) +
        circle(0, -13, 17, b) + flat(0, -12, 14, 14, l) +
        path('M0 -19 Q7 -25 11 -16 Q14 -4 0 1 Q-14 -4 -11 -16 Q-7 -25 0 -19z', f) +
        both((s) => flat(s * 2, -6, 1.4, 1.1, LINE)) + smile(0, -2.5, 3.4) +
        eyes(0, -12, 5.5, 3.8) + blush(0, -6, 8, 2.8);
    },

    kangaroo: () => {
      const b = '#d69a62', d = '#c98b55', inn = '#f1c3a0', be = '#f3d3ae';
      return tail('M12 30 Q28 40 41 41', b, 6.6) +
        ell(2, 41, 12, 3.2, shade(b)) + ell(10, 30, 10, 11, b) +
        ell(2, 14, 13, 18, b, 8) + flat(-1, 18, 8, 12, be, 8) +
        ell(-4, 42.5, 12, 3.2, b) +
        both((s) => ell(-2 + s * 3, 10, 1.6, 3.2, b, s * 15)) + circle(-2, 15, 5, b) +
        flat(-4, 14.5, 1, 1, LINE) + flat(0, 14.5, 1, 1, LINE) + flat(-2, 17, 1, 0.7, LINE) +
        path('M-9 20 Q-2 23 6 20 Q5 30 -2 31 Q-9 30 -9 20z', be) +
        ell(-8, 6, 2.8, 6, b, 25) +
        both((s) => ell(-3 + s * 7, -29, 4.5, 10, d, s * 14) + flat(-3 + s * 7, -29, 2.2, 7, inn, s * 14)) +
        circle(-3, -14, 14, b) + flat(-3, -6, 8, 5.5, be) + nose(-3, -8) + smile(-3, -4, 3) +
        eyes(-3, -16, 6, 3.8) + blush(-3, -9, 10, 3.4);
    },

    koala: () => {
      const g = '#b9c1ca', e = '#9aa4ae', inn = '#f6dbe3', br = '#8a6a4a', lf = '#5fae3b';
      return path('M14 -40 L22 -40 L24 44 L16 44z', br) +
        line('M20 -22 l10 -6 M18 -6 l12 2', br, 2.6) +
        ell(31, -30, 7, 3.4, lf, -30) + ell(33, -4, 6.5, 3.2, lf, 15) + ell(10, -36, 6, 3, lf, 30) +
        ell(4, 18, 15, 17, g) + flat(2, 22, 8, 10, '#dde2e7') +
        ell(4, 40, 8, 4, g) + ell(17, 34, 6, 4, g, -20) +
        ell(13, 7, 11, 4.5, g, -10) + ell(14, 22, 10, 4.5, g, 10) +
        line('M22 4 l2 2 M22 8 l2 1 M22 21 l2 1 M22 25 l2 0', LINE, 1.4) +
        both((s) => circle(-4 + s * 15, -22, 8, e) + flat(-4 + s * 15, -21, 4.8, 4.8, inn)) +
        circle(-4, -12, 16, g) +
        `<ellipse cx="-4" cy="-8" rx="4.5" ry="5.8" fill="#3a3a3f"/>` + flat(-5.5, -10, 1.2, 1.8, '#6a6a72') +
        smile(-4, -0.5, 3) + eyes(-4, -14, 8.5, 3.8) + blush(-4, -5, 12, 3.6);
    },

    platypus: () => {
      const b = '#8a5a3a', be = '#c99a6e', bill = '#4a4650', t = '#6e4529';
      const foot = (x, c) => path(`M${x - 3} 37 L${x - 7} 43.5 Q${x} 45.5 ${x + 7} 43.5 L${x + 3} 37z`, c);
      return ell(35, 32, 10, 6.5, t, -10) + line('M29 30 l10 -2 M30 34 l10 -2 M33 27 l2 9 M38 26 l2 9', shade(t), 1.4) +
        foot(4, shade(bill)) + foot(28, shade(bill)) +
        ell(12, 30, 24, 11, b) + flat(10, 36, 16, 4, be) +
        foot(-4, bill) + foot(20, bill) +
        circle(-18, 13, 14, b) +
        ell(-18, 24, 11, 5, bill) + flat(-21, 22.5, 1.3, 1, '#8a8590') + flat(-15, 22.5, 1.3, 1, '#8a8590') +
        eyes(-18, 10, 6, 3.6) + blush(-18, 16, 10, 3);
    },
  };
})());
