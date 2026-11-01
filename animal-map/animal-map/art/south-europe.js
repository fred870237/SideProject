// 南美洲、歐洲、海洋的動物（全身）
Object.assign(ART, (() => {
  const { circle, ell, flat, path, flatPath, line, both, leg, backLeg, shade, eye, eyes, blush, nose, wmouth, smile, whiskers, roundEars, pointEars, tuft, neck } = K;
  const thick = (d, c, w = 6) => line(d, LINE, w) + line(d, c, w - 3); // 有外框的粗線（尾巴、脖子、觸手）
  const branch = (y) => path(`M-46 ${y} H46 V${y + 6} H-46z`, '#8a5a35') +
    ell(-34, y - 2, 6, 3, '#6cc04a', -20) + ell(36, y - 2, 6, 3, '#6cc04a', 20);

  return {
    toucan: () => {
      const black = '#26242a';
      return path('M12 26 L22 44 L31 41 L22 22z', black) + branch(33) +
        ell(8, 12, 15, 19, black) + ell(14, 10, 8, 13, '#3a3840', -15) +
        flat(0, 8, 9, 13, '#fff3b0') +
        circle(2, 33, 3, '#ff9f1c') + circle(12, 33, 3, '#ff9f1c') +
        circle(-6, -16, 15, black) + flat(-6, -12, 10, 8, '#fff3b0') +
        eyes(-6, -19, 6, 3.4, '#7dd3fc') +
        path('M-5 -12 C -20 -20 -42 -14 -46 -3 C -36 -1 -18 -2 -4 -5z', '#ff9f1c') +
        line('M-8 -9 C -20 -9 -34 -7 -44 -4', '#e85d04', 1.8) +
        flatPath('M-46 -3 C -45 -8 -42 -11 -39 -13 L-38 -2z', '#e53935') +
        flat(0, -10, 3, 2, '#ff7d96', 0, 0.55);
    },

    parrot: () => {
      const red = '#e53935';
      return thick('M14 24 Q20 34 25 43', red, 8) + thick('M18 22 Q28 30 35 40', '#3b82f6', 8) + branch(31) +
        ell(6, 10, 14, 18, red) +
        path('M8 -2 C 22 0 24 18 16 28 C 10 22 6 10 8 -2z', '#ffd23f') +
        path('M12 14 C 22 16 22 26 16 28 C 13 24 12 19 12 14z', '#3b82f6') +
        circle(0, 31, 3, '#6b6b6b') + circle(10, 31, 3, '#6b6b6b') +
        circle(-6, -16, 15, red) + both((s) => flat(-6 + s * 7, -17, 6, 7, '#fff')) +
        eyes(-6, -18, 6.5, 3.4) +
        path('M-11 -11 Q-6 -16 -1 -11 Q0 -2 -6 1 Q-7 -6 -11 -11z', '#f3ead9') +
        line('M-9 -5 q3 4 6 2', '#2c2a2e', 2) + blush(-6, -9, 11, 3);
    },

    sloth: () => {
      const fur = '#c8a884', dark = shade(fur);
      return branch(-26) +
        thick('M2 0 L-2 -24', dark, 8) + thick('M30 -2 L34 -24', dark, 8) +
        ell(12, 2, 22, 13, fur) + flat(12, 8, 14, 5, '#e0c9a6') +
        thick('M-6 4 L-10 -24', fur, 8) + thick('M22 2 L22 -24', fur, 8) +
        [-10, -2, 22, 34].map((x) => line(`M${x - 3} -28 q3 -4 6 0`, LINE, 2)).join('') +
        circle(-14, 12, 16, fur) + ell(-14, 14, 12, 10, '#efe0c8') +
        both((s) => flat(-14 + s * 6, 11, 5, 3.5, '#6b4d36', s * 18)) +
        eyes(-14, 11, 6, 2.8) +
        `<ellipse cx="-14" cy="17" rx="3" ry="2.2" fill="#3a2a2a"/>` + smile(-14, 20, 3) + blush(-14, 18, 10, 3);
    },

    jaguar: () => {
      const body = '#f2bb4e', spot = '#6b4423';
      const ros = (x, y, r = 3) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${spot}" stroke-width="1.8"/><circle cx="${x}" cy="${y}" r="${r * 0.35}" fill="${spot}"/>`;
      return thick('M33 16 q12 -4 10 -18', body, 6) + circle(43, -3, 3, spot) +
        backLeg(4, 22, 9, body) + backLeg(30, 22, 9, body) +
        ell(14, 18, 24, 15, body) + flat(12, 26, 15, 5, '#fff1dc') +
        [[6, 10], [16, 8], [27, 12], [12, 18], [24, 20], [34, 18]].map(([x, y]) => ros(x, y)).join('') +
        leg(-4, 24, 9.5, body) + leg(24, 24, 9.5, body) +
        roundEars(-14, -23, 11, 5.5, body, '#fff1dc') +
        circle(-14, -9, 16, body) +
        flat(-19, -20, 1.4, 1.4, spot) + flat(-14, -22, 1.4, 1.4, spot) + flat(-9, -20, 1.4, 1.4, spot) +
        flat(-14, -1, 9, 6.5, '#fff8e8') + nose(-14, -3) + wmouth(-14, 1) + whiskers(-14, -1, 9) +
        eyes(-14, -11, 7) + blush(-14, -3, 11);
    },

    llama: () => {
      const wool = '#f6ead8', light = '#fbf3e6';
      return backLeg(2, 26, 7, wool) + backLeg(24, 26, 7, wool) +
        ell(12, 18, 20, 13, wool) + [0, 9, 18, 27].map((x, i) => circle(x, 8 - (i % 2) * 2, 6, light)).join('') +
        circle(32, 12, 5, light) +
        leg(-4, 28, 7, wool) + leg(18, 28, 7, wool) +
        path('M-18 -22 H-3 V20 Q-10 26 -18 20z', wool) +
        [-12, -4, 6].map((y) => flat(-10, y, 6, 3, light)).join('') +
        both((s) => ell(-10 + s * 7, -37, 4, 8, '#f4e6d0', s * 14) + flat(-10 + s * 7, -36, 1.8, 5, '#f2b8b8', s * 14)) +
        circle(-10, -26, 13, wool) + circle(-10, -38, 5, light, 'stroke="none"') + circle(-6, -37, 4, light, 'stroke="none"') +
        flat(-10, -19, 8, 6, '#fff8ee') + line('M-13 -22 q2 2 0 3 M-7 -22 q-2 2 0 3', LINE, 1.6) + smile(-10, -17, 2.6) +
        eyes(-10, -28, 6, 3.4) + blush(-10, -22, 10, 3);
    },

    capybara: () => {
      const fur = '#b07a4f', dark = '#9c6a43';
      return backLeg(6, 26, 8, fur) + backLeg(30, 26, 8, fur) +
        ell(12, 17, 27, 16, fur) + flat(10, 26, 18, 5, '#c8946a') +
        leg(-4, 28, 8.5, fur) + leg(24, 28, 8.5, fur) +
        roundEars(-18, -16, 12, 4, dark) +
        path('M-34 -6 C -34 -22 -2 -22 -2 -6 L-1 8 C -1 20 -35 20 -35 8z', fur) +
        ell(-18, 9, 11, 7, dark) + both((s) => flat(-18 + s * 4, 6, 1.8, 1.4, LINE)) + smile(-18, 10, 2.6) +
        eyes(-18, -4, 7, 3.4) + blush(-18, 3, 11, 3.2) +
        circle(-18, -23, 5.5, '#ffb020') + flatPath('M-18 -28 q4 -4 7 -2 q-3 3 -7 2z', '#6cc04a');
    },

    frog: () => {
      const blue = '#2f8cf0', spot = '#1c1c2a';
      return both((s) => ell(s * 20, 33, 12, 9, blue) +
          ell(s * 26, 42, 8, 3.2, '#5aa7f5') + flat(s * 6, 42, 4, 2.5, spot)) +
        ell(0, 22, 21, 18, blue) + flat(0, 26, 12, 11, '#9fd0ff') +
        both((s) => leg(s * 9, 30, 6, blue)) +
        both((s) => circle(s * 13, -16, 9, blue)) +
        ell(0, -2, 25, 16, blue) +
        [[-16, 4], [14, 6], [-8, -10], [6, -12], [-18, 24], [17, 22]].map(([x, y]) => flat(x, y, 2.6, 2.2, spot)).join('') +
        eyes(0, -17, 13, 5) + smile(0, 4, 8) + blush(0, 1, 14, 3.6);
    },

    flamingo: () => {
      const pink = '#f7a1c4', leg_ = '#f0739f';
      return thick('M10 8 L10 44', leg_, 5) + thick('M14 8 L22 24 L10 26', leg_, 5) +
        line('M5 44 h10', LINE, 3) +
        path('M26 -4 L40 -10 L36 2z', '#ef7fae') +
        ell(12, -2, 17, 12, pink) + ell(16, -3, 10, 7, '#f48bb6', -10) +
        thick('M0 -4 C -12 -8 -2 -20 -10 -28', pink, 9) +
        circle(-14, -33, 11, pink) + eyes(-14, -35, 5, 3) + blush(-14, -30, 8, 2.6) +
        path('M-19 -28 Q-14 -25 -9 -28 L-10 -22 Q-14 -18 -17 -18 Q-19 -23 -19 -28z', '#fff3e0') +
        flatPath('M-10.5 -23 Q-14 -18 -17 -18 Q-17.5 -21 -17 -22 Q-14 -21 -10.5 -23z', '#2a2226');
    },

    reindeer: () => {
      const fur = '#a8743f', ant = '#8a5a35', hoof = '#4a3b33';
      const legH = (x, top, w, c, back) => (back ? backLeg(x, top, w, c) : leg(x, top, w, c)) + flat(x, back ? 41.5 : 42.5, w / 2 - 1, 1.6, hoof);
      return circle(37, 6, 4, '#fff8ee') +
        legH(6, 20, 7.5, fur, 1) + legH(28, 20, 7.5, fur, 1) +
        ell(16, 14, 22, 12, fur) + flat(14, 21, 14, 4.5, '#ecd2a8') +
        legH(-2, 22, 8, fur) + legH(22, 22, 8, fur) +
        both((s) => thick(`M${-14 + s * 6} -18 C${-14 + s * 9} -30 ${-14 + s * 16} -36 ${-14 + s * 22} -44 M${-14 + s * 11} -30 L${-14 + s * 6} -40 M${-14 + s * 17} -38 L${-14 + s * 24} -36`, ant, 5)) +
        both((s) => ell(-14 + s * 17, -12, 7, 3.6, fur, s * 20)) +
        circle(-14, -6, 15, fur) +
        flat(-14, 2, 9, 6.5, '#ecd2a8') + circle(-14, -1, 3.4, '#e53935', 'stroke-width="1.6"') + smile(-14, 4, 3) +
        eyes(-14, -8, 6.5, 3.8) + blush(-14, -1, 10.5);
    },

    fox: () => {
      const fur = '#f08a32', cream = '#fff8ef', sock = '#5b3b2e';
      return ell(41, -6, 6.5, 6.5, cream) + ell(34, 5, 9, 15, fur, 25) +
        backLeg(6, 24, 7, fur) + flat(6, 40.5, 2.5, 2.5, sock) + backLeg(28, 24, 7, fur) + flat(28, 40.5, 2.5, 2.5, sock) +
        neck(-14, -6, 0, 16, 16, fur) + ell(12, 18, 21, 12, fur) + flat(10, 24, 13, 5, cream) +
        leg(-2, 26, 7.5, fur) + flat(-2, 41.5, 2.6, 2.4, sock) + leg(22, 26, 7.5, fur) + flat(22, 41.5, 2.6, 2.4, sock) +
        pointEars(-14, -18, 10, 15, 12, fur, '#5b3b2e') +
        circle(-14, -8, 16, fur) +
        flatPath('M-29 -4 C -22 -4 -17 -2 -14 6 C -11 -2 -6 -4 1 -4 C 1 6 -6 8 -14 8 C -22 8 -29 6 -29 -4z', cream) +
        nose(-14, 0) + smile(-14, 4, 2.6) + eyes(-14, -10, 7) + blush(-14, -2, 11);
    },

    hedgehog: () => {
      const sp = '#8b6248';
      let spikes = '';
      for (let i = 0; i < 11; i++) {
        const a = Math.PI * (1 + i / 10), b = a - 0.16, c = a + 0.16;
        const P = (t, rx, ry) => `${(8 + Math.cos(t) * rx).toFixed(1)} ${(24 + Math.sin(t) * ry).toFixed(1)}`;
        spikes += `${i ? 'L' : 'M'}${P(b, 24, 20)} L${P(a, 33, 29)} L${P(c, 24, 20)} `;
      }
      return backLeg(18, 36, 7, '#f4d8b0') + path(spikes + 'L32 30 L-16 30z', sp) +
        ell(8, 28, 24, 14, '#a57858', 0, 'stroke="none"') +
        leg(-2, 37, 7, '#f4d8b0') + leg(24, 37, 7, '#f4d8b0') +
        roundEars(-16, 5, 10, 4, '#f4d8b0', '#e8a98f') +
        circle(-16, 18, 13, '#f4d8b0') + circle(-16, 22, 3, '#2c2a2e', 'stroke="none"') + smile(-16, 26, 2.4) +
        eyes(-16, 15, 5.5, 3.4) + blush(-16, 21, 9, 3);
    },

    rabbit: () => {
      const fur = '#f3eee8', pink = '#f8c4d0';
      return circle(32, 22, 6, '#fff') +
        ell(12, 26, 20, 15, fur) + circle(18, 28, 12, fur) + flat(8, 32, 10, 5, '#fff') +
        ell(16, 41, 11, 3.5, fur) +
        leg(0, 30, 7, fur) + leg(9, 31, 7, fur) +
        both((s) => ell(-8 + s * 6, -22, 5, 14, fur, s * 10) + flat(-8 + s * 6, -21, 2.4, 10, pink, s * 10)) +
        circle(-8, 0, 15, fur) +
        `<path d="M-10.5 4 h5 l-2.5 2.6z" fill="#e58aa0"/>` + line('M-8 6.6 v2 M-8 8.6 q-2.4 2.4 -4.8 0.8 M-8 8.6 q2.4 2.4 4.8 0.8', LINE, 1.6) +
        whiskers(-8, 5, 8) + eyes(-8, -3, 6.5, 3.8) + blush(-8, 4, 10.5);
    },

    shark: () => {
      const grey = '#a9bccf';
      const body = 'M-44 6 C -44 -14 -20 -20 4 -16 C 18 -14 28 -6 34 0 L44 -14 C 46 -6 44 4 40 8 C 44 12 46 20 44 26 L34 13 C 26 20 10 24 -8 24 C -30 24 -44 18 -44 6z';
      return path('M-6 -15 L4 -34 C 10 -28 14 -20 16 -13z', grey) + path(body, grey) +
        flatPath('M-43 9 C -30 15 -4 17 22 14 C 12 21 0 24 -8 24 C -30 24 -42 18 -43 9z', '#fff') +
        `<path d="${body}" fill="none" stroke="${LINE}" stroke-width="2.4" stroke-linejoin="round"/>` +
        path('M-8 13 L-2 30 L8 15z', '#8fa6bd') +
        line('M-4 -6 q-2 4 0 8 M1 -6 q-2 4 0 8', '#7f93a8', 1.8) +
        eyes(-27, -5, 7, 3.6) + blush(-27, 2, 11, 3) +
        line('M-35 6 Q-27 12 -19 6', LINE, 2) +
        `<circle cx="-36" cy="-24" r="3" fill="none" stroke="#cfe7ff" stroke-width="1.6"/><circle cx="-42" cy="-32" r="2" fill="none" stroke="#cfe7ff" stroke-width="1.4"/>`;
    },

    octopus: () => {
      const purple = '#c46bd8', pink = '#f3a6e0';
      let back = '', front = '';
      for (let i = 0; i < 8; i++) {
        const x0 = -18 + i * 36 / 7, xe = Math.round(-38 + i * 76 / 7), s = xe < 0 ? -1 : 1, ye = i % 2 ? 31 : 37;
        const d = `M${x0.toFixed(1)} 0 C${x0.toFixed(1)} 20 ${xe} 18 ${xe} ${ye} c0 6 ${-s * 7} 7 ${-s * 7} 1`;
        if (i % 2) back += thick(d, shade(purple), 8.5);
        else front += thick(d, purple, 9.5) + flat(xe, ye - 6, 1.6, 1.6, pink) + flat(xe, ye - 1, 1.6, 1.6, pink);
      }
      return back + front + ell(0, -14, 24, 23, purple) +
        flat(-9, -30, 4, 3, pink) + flat(8, -32, 3, 2.4, pink) + flat(14, -24, 2.4, 2, pink) +
        eyes(0, -10, 9, 4.6) + blush(0, -2, 15) + smile(0, -1, 4);
    },

    // 螃蟹：正面、兩隻大鉗子舉高高、眼睛長在小柱子上，左右各三隻腳
    crab: () => {
      const { circle, ell, flat, line, both } = K;
      const red = '#f0603c', light = '#ffc2ad';
      const thick = (d, c, w) => line(d, LINE, w + 3.4) + line(d, c, w);
      const legs = both((s) =>
        thick(`M${s * 16} 26 L${s * 26} 36 L${s * 28} 44`, red, 4.4) +
        thick(`M${s * 22} 20 L${s * 36} 28 L${s * 40} 40`, red, 4.4) +
        thick(`M${s * 26} 12 L${s * 42} 16 L${s * 47} 28`, red, 4.4));
      const arms = both((s) => thick(`M${s * 22} 4 Q${s * 34} 0 ${s * 36} -12`, red, 6.5));
      // 鉗子：上下兩片，中間開一個 V
      const claws = both((s) => ell(s * 41, -28, 8, 12, red, s * 28) + ell(s * 33, -22, 6.5, 10, red, -s * 22));
      const stalks = both((s) => thick(`M${s * 8} 0 L${s * 10} -14`, red, 3.6) + circle(s * 10, -19, 7.5, '#fff'));
      return legs + arms + claws + stalks +
        ell(0, 14, 31, 20, red) + flat(0, 22, 17, 6.5, light) +
        flat(-12, 6, 4, 2.4, '#fff', -20, 0.6) +
        both((s) => `<circle cx="${s * 10}" cy="-18" r="3.6" fill="#2a2226"/><circle cx="${s * 10 + 1.2}" cy="-19.4" r="1.4" fill="#fff"/>`) +
        line('M-4 16 q4 3.6 8 0', LINE, 1.8) +
        flat(-17, 14, 4, 2.4, '#ff7d96', 0, 0.55) + flat(17, 14, 4, 2.4, '#ff7d96', 0, 0.55);
    },
  };
})());
