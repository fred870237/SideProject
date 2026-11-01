// 北美洲、北極與海洋的動物（全身）
Object.assign(ART, (() => {
  const { circle, ell, flat, path, flatPath, line, both, g, leg, backLeg, shade, eye, eyes, blush, nose, wmouth, smile, beak, whiskers, roundEars, pointEars, neck } = K;
  // 小斑點
  const dots = (pts, c, r = 1.2) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`).join('');
  // 鳥腳：細腿＋腳掌
  const birdLeg = (x, top, c, bottom = 42) => leg(x, top, 4, c, bottom) + ell(x - 1, bottom + 1, 5, 2.2, c);

  return {
    'polar-bear': () => {
      const body = '#f4f7fb';
      return circle(38, 10, 4.5, body) +
        backLeg(4, 22, 10, body) + backLeg(30, 22, 10, body) +
        ell(14, 17, 25, 15, body) + flat(12, 25, 15, 5.5, '#ffffff') +
        leg(-4, 24, 10.5, body) + leg(24, 24, 10.5, body) +
        roundEars(-14, -22, 12, 5.5, body, '#f6dde5') +
        circle(-14, -8, 17, body) +
        ell(-14, 1, 8.5, 6, '#ffffff') + nose(-14, -1) + wmouth(-14, 3) +
        eyes(-14, -11, 7) + blush(-14, -3, 11.5);
    },

    eagle: () => {
      const brown = '#7a4e2d', yel = '#ffc233';
      return path('M12 24 L32 40 L22 43 L8 32z', '#fbfbfb') +
        birdLeg(0, 30, yel) + birdLeg(10, 30, yel) +
        ell(6, 12, 15, 21, brown, -15) +
        ell(13, 12, 7, 16, shade(brown), -18) + line('M10 20 l4 6 M14 18 l3 6', '#4a2f1c', 1.4) +
        circle(-6, -19, 15, '#fbfbfb') +
        path('M-11.5 -14 Q-6 -18 -0.5 -14 Q-1 -7 -6 -4.5 Q-5.5 -9 -11.5 -14z', yel) +
        eyes(-6, -21, 6.5, 3.8) + blush(-6, -13, 10.5, 3.5);
    },

    moose: () => {
      const body = '#7a5643', antler = '#d9b98a';
      const ant = both((s) => {
        const bx = -14 + s * 8;
        return path(`M${bx} -19 C${bx + s * 4} -24 ${bx + s * 9} -24 ${bx + s * 12} -30 l${s * 2} -6 l${s * 2.5} 4 l${s * 2} -5 l${s * 2.5} 5 l${s * 1.5} -4 C${bx + s * 25} -24 ${bx + s * 22} -16 ${bx + s * 9} -15z`, antler);
      });
      return line('M35 8 q4 1 4 5', LINE, 3) +
        backLeg(6, 20, 8, body) + backLeg(30, 20, 8, body) +
        ell(14, 12, 24, 14, body) + flat(14, 20, 15, 5, '#9c7660') +
        leg(-3, 22, 8.5, body) + leg(23, 22, 8.5, body) +
        ant + both((s) => ell(-14 + s * 15, -13, 6, 3, body, s * -20)) +
        path('M-17 12 q3 9 6 0z', body) +
        circle(-14, -8, 15, body) +
        ell(-14, 3, 10, 8, '#9c7660') + both((s) => flat(-14 + s * 4, 3, 1.8, 2.4, LINE)) + smile(-14, 7, 2.6) +
        eyes(-14, -10, 6.5, 3.8, '#f3e1c8') + blush(-14, -4, 11, 3.4);
    },

    beaver: () => {
      const body = '#9c6a43', tail = '#5e4030';
      return ell(36, 34, 11, 6.5, tail, -18) + line('M30 33 l10 -3 M31 37 l10 -3 M34 30 l3 8 M39 29 l2 7', '#3e2a1f', 1.2) +
        backLeg(6, 30, 8, body) + backLeg(26, 30, 8, body) +
        ell(14, 24, 22, 14, body) + flat(12, 30, 14, 5, '#d8b48d') +
        leg(-2, 32, 8.5, body) + leg(20, 32, 8.5, body) +
        roundEars(-14, -8, 12.5, 4.5, body, '#d8b48d') +
        circle(-14, 6, 16, body) +
        `<rect x="-17" y="17" width="6" height="6.5" rx="1.5" fill="#fff" stroke="${LINE}" stroke-width="1.6"/><path d="M-14 17 v6.5" stroke="${LINE}" stroke-width="1.2"/>` +
        flat(-14, 14, 8.5, 5.5, '#d8b48d') + nose(-14, 11, '#3a2a2a', 3.5) + line('M-18 17 q4 2 8 0', LINE, 1.6) +
        eyes(-14, 2, 6.5, 3.8) + blush(-14, 9, 11, 3.4);
    },

    bison: () => {
      const body = '#6b4630', wool = '#4a2f20', horn = '#f3ead9';
      return line('M38 12 q5 6 3 14', LINE, 2.2) + circle(41, 27, 2.6, wool) +
        backLeg(8, 24, 8.5, body) + backLeg(32, 24, 8.5, body) +
        ell(18, 18, 23, 14, body) + flat(18, 26, 14, 4, '#8a5c3e') +
        circle(4, 6, 16, wool) +
        leg(-2, 26, 9, wool) + leg(26, 26, 9, body) +
        both((s) => path(`M${-14 + s * 11} -8 Q${-14 + s * 20} -9 ${-14 + s * 20} -21 Q${-14 + s * 16} -14 ${-14 + s * 11} -14z`, horn)) +
        path('M-23 8 Q-14 24 -5 8z', wool) +
        circle(-14, -4, 15, body) +
        circle(-23, -16, 6, wool) + circle(-14, -18, 6.5, wool) + circle(-5, -16, 6, wool) +
        flat(-14, 5, 9, 6, '#9a6a4c') + both((s) => flat(-14 + s * 3.5, 4, 1.6, 2.2, LINE)) + smile(-14, 8, 2.4) +
        eyes(-14, -5, 6.5, 3.8, '#f3e1c8') + blush(-14, 1, 11, 3.2);
    },

    raccoon: () => {
      const body = '#afafb9', dark = '#3a3a44';
      const ring = [[42, -14, dark, 5.5], [41, -6, body, 6.5], [39, 1, dark, 7], [36, 7, body, 7], [32, 12, dark, 7]]
        .map(([x, y, c, r]) => circle(x, y, r, c)).join('');
      return ring +
        backLeg(4, 24, 8.5, dark) + backLeg(28, 24, 8.5, dark) +
        neck(-14, -6, 2, 14, 17, body) + ell(14, 18, 23, 14, body) + flat(12, 25, 14, 5, '#e2e2e8') +
        leg(-4, 26, 9, dark) + leg(22, 26, 9, dark) +
        pointEars(-14, -19, 10, 11, 10, body, '#f2f2f5') +
        circle(-14, -7, 16, body) +
        both((s) => flat(-14 + s * 7, -16.5, 5, 2, '#fff')) +
        flatPath('M-29 -8 C-24 -16 -18 -14 -14 -9 C-10 -14 -4 -16 1 -8 C-3 -3 -9 -3 -14 -6 C-19 -3 -25 -3 -29 -8z', dark) +
        flat(-14, 1, 8, 5.5, '#fff') + nose(-14, -1, '#2c2a2e') + wmouth(-14, 3) +
        eyes(-14, -9, 7, 3.6, '#fff') + blush(-14, -1, 11.5, 3.2);
    },

    walrus: () => {
      const body = '#b77f5c', pad = '#e3b08f', tusk = '#fffbea';
      return path('M33 31 Q44 27 46 39 Q40 44 30 40z', shade(body)) +
        ell(14, 27, 27, 15, body) + flat(12, 34, 18, 5, '#d39c78') +
        ell(-4, 41, 10, 3.5, shade(body), -8) +
        g(circle(-16, -5, 17, body) +
        both((s) => path(`M${-16 + s * 4.5} 7 L${-16 + s * 3} 25 L${-16 + s * 7.5} 8z`, tusk)) +
        both((s) => ell(-16 + s * 5.5, 5, 6.5, 5.5, pad)) +
        dots([[-24, 4], [-21, 7], [-19, 3], [-13, 3], [-11, 7], [-8, 4]], '#8a5a3e', 0.9) +
        `<ellipse cx="-16" cy="0" rx="2.6" ry="1.8" fill="#3a2a2a"/>` +
        whiskers(-16, 5, 11) +
        eyes(-16, -11, 6.5, 3.6) + blush(-16, -4, 13, 3.2), 'translate(2 10)');
    },

    narwhal: () => {
      const body = '#a9c2d6', belly = '#eef5fb';
      return path('M-32 -6 L-47 -20 L-31 -1z', '#f6efd8') + line('M-36 -7 l2 -3 M-40 -11 l2 -3 M-44 -15 l1.5 -2', '#b8a98a', 1.2) +
        path('M-34 0 C-34 -13 -18 -16 0 -13 C14 -10 26 -5 34 -1 L40 -10 Q45 -3 42 1 Q45 6 40 11 L34 4 C24 13 8 17 -8 17 C-26 17 -34 11 -34 0z', body) +
        flatPath('M-31 7 C-24 14 -4 16 14 12 C4 17 -22 18 -31 7z', belly) +
        dots([[2, -8], [8, -4], [14, -6], [-2, -3], [20, -2], [10, 2], [26, 1]], '#7d97ad', 1.3) +
        ell(-10, 11, 6.5, 2.8, shade(body), 25) +
        eye(-22, -3, 4) + flat(-20, 4, 4, 2.4, '#ff7d96', 0, 0.55) + line('M-33 4 q5 4 10 1.5', LINE, 1.8);
    },

    puffin: () => {
      const black = '#2b2d3a', org = '#f56b2a';
      return path('M18 22 L30 28 L19 30z', black) +
        birdLeg(-1, 32, org) + birdLeg(9, 32, org) +
        ell(4, 18, 17, 18, black) + flat(1, 22, 11, 13, '#fff') +
        ell(15, 14, 6, 12, shade(black, 0.7), -15) +
        g(circle(-6, -16, 15, black) +
        ell(-6, -14, 11.5, 9, '#f4f4f0') +
        path('M-15 -12 Q-6 -16 3 -12 L-6 10z', org) +
        flatPath('M-14.3 -11.4 Q-6 -15 2.3 -11.4 L1.2 -8 Q-6 -10.5 -13.2 -8z', '#5b6575') +
        line('M-12.4 -6.6 Q-6 -8.6 0.4 -6.6', '#ffd23f', 1.8) +
        line('M-9.5 0 Q-6 -1 -2.5 0', '#d94d16', 1.4) +
        eyes(-6, -19, 7, 3.5) + line('M-15 -20 l-2 1.5 M3 -20 l2 1.5', '#e0515a', 1.2) + blush(-6, -13, 12, 3), 'translate(2 5)');
    },

    'snowy-owl': () => {
      const white = '#fbfbf8', fleck = '#4a4a52';
      const flecks = [[-6, 14], [2, 18], [10, 12], [-2, 24], [8, 26], [16, 20], [-10, 22], [4, 32]]
        .map(([x, y]) => line(`M${x} ${y} l2.5 -0.8`, fleck, 1.6)).join('');
      return path('M14 30 L28 38 L16 40z', white) +
        ell(2, 20, 20, 21, white) + flecks +
        both((s) => ell(2 + s * 17, 18, 6, 13, '#ecece6', s * 12)) +
        line('M-15 16 l2 -1 M-14 22 l2 -1 M18 16 l2 -1 M17 22 l2 -1', fleck, 1.4) +
        both((s) => ell(2 + s * 6, 41, 5.5, 3.5, white)) + both((s) => line(`M${2 + s * 6 - 3} 44 v1.5 M${2 + s * 6} 44.5 v1.5 M${2 + s * 6 + 3} 44 v1.5`, LINE, 1.4)) +
        circle(0, -14, 18, white) +
        line('M-10 -28 l2 -0.6 M6 -29 l2 -0.6 M-1 -30 l2 0', fleck, 1.4) +
        both((s) => flat(s * 7, -13, 7, 7, '#fff')) +
        eyes(0, -14, 7, 4, '#ffd23f') +
        path('M-2.5 -8 L2.5 -8 L0 -3z', '#5a5560') + blush(0, -6, 11.5, 3.2);
    },

    whale: () => {
      const body = '#5b9ae8', belly = '#d4eaff';
      return line('M-16 -19 v-10 M-16 -26 q-5 -8 -11 -6 M-16 -26 q5 -8 11 -6', '#e6f6ff', 3.2) +
        dots([[-29, -30], [-3, -30], [-16, -38]], '#e6f6ff', 1.8) +
        path('M-42 0 C-42 -16 -22 -20 0 -16 C16 -13 28 -6 36 -2 L41 -11 Q46 -4 43 0 Q46 5 41 11 L36 4 C26 16 8 22 -10 22 C-30 22 -42 14 -42 0z', body) +
        flatPath('M-39 8 C-30 18 -8 21 12 17 C0 22 -30 23 -39 8z', belly) +
        line('M-30 13 l8 3 M-26 10 l10 3.5 M-20 8 l10 3', '#9cc6f0', 1.3) +
        ell(-6, 16, 9, 3.5, shade(body), 25) +
        eye(-27, -4, 4.6) + flat(-25, 4, 4.5, 2.7, '#ff7d96', 0, 0.55) + line('M-41 4 q6 5 13 2', LINE, 1.8);
    },

    dolphin: () => {
      const body = '#8ab4e4', belly = '#e8f3ff';
      const fish = path('M0 -15 Q6 -24 10 -12z', shade(body)) +
        path('M-44 2 C-40 -2 -36 -4 -30 -6 C-24 -16 0 -18 16 -10 C26 -5 32 0 37 2 L43 -6 Q46 2 43 6 Q46 12 41 16 L35 8 C24 14 0 16 -20 12 C-30 10 -38 8 -44 2z', body) +
        flatPath('M-40 5 C-32 10 -10 14 12 10 C0 15 -26 14 -40 5z', belly) +
        ell(-10, 12, 7, 2.8, shade(body), 30) +
        eye(-24, -5, 4.2) + flat(-22, 2, 4, 2.4, '#ff7d96', 0, 0.55) + line('M-43 2 q6 2.5 12 0', LINE, 1.8);
      return g(fish, 'translate(-2 4) rotate(18)') +
        line('M20 42 q8 -6 16 0 q8 -6 10 0', '#e6f6ff', 2.6) + dots([[26, 34], [38, 32], [32, 28]], '#e6f6ff', 1.8);
    },

    seal: () => {
      const body = '#c3ccd8', belly = '#f2f5f9';
      return path('M34 30 Q44 24 47 32 Q44 34 47 40 Q40 42 32 38z', shade(body)) +
        ell(11, 30, 27, 13, body) + flat(10, 38, 18, 4, belly) +
        dots([[6, 24], [14, 22], [22, 26], [28, 30], [18, 30], [10, 28]], '#8a96a3', 1.3) +
        ell(-4, 41, 8.5, 3.2, shade(body), -10) +
        g(circle(-18, 4, 16, body) +
        flat(-21.5, 11, 5.5, 4.5, belly) + flat(-14.5, 11, 5.5, 4.5, belly) +
        `<ellipse cx="-18" cy="7.5" rx="3" ry="2.2" fill="#3a2a2a"/>` +
        dots([[-23, 11], [-20, 13], [-16, 13], [-13, 11]], '#8a96a3', 0.8) +
        whiskers(-18, 10, 10) +
        eyes(-18, 0, 7, 5) + blush(-18, 7, 12.5, 3.4), 'translate(1 8)');
    },

    penguin: () => {
      const black = '#2b2d3a', org = '#ffa62b';
      return both((s) => ell(2 + s * 6, 42, 5.5, 2.6, org)) +
        ell(2, 18, 16, 21, black) + flat(2, 22, 11, 16, '#fff') +
        ell(-13, 16, 4.5, 12, black, 15) + ell(17, 16, 4.5, 12, black, -15) +
        circle(0, -18, 16, black) +
        path('M0 -24 C5 -32 15 -26 13 -16 C12 -8 6 -4 0 -4 C-6 -4 -12 -8 -13 -16 C-15 -26 -5 -32 0 -24z', '#fff', 'stroke="none"') +
        both((s) => flat(s * 15, -14, 2.5, 5, '#ffc94a', s * 20)) +
        beak(0, -13, 3.5, 3, org) +
        eyes(0, -19, 5.5, 3.6) + blush(0, -11, 9, 2.8);
    },
  };
})());
