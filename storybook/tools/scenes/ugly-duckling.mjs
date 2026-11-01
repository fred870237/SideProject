// 醜小鴨的插畫：夏 → 秋 → 冬 → 春，最後變成白天鵝。用法：node tools/scenes/ugly-duckling.mjs --sheet
import { BX, BW, H, INK, line, L, at, svg, sky, sun, cloud, hills, ground, tree, grass, sparkle, water, fence, hearts, sweat, bird, writeBook } from './lib.mjs';
import { duckling, uglyDuck, motherDuck, hen, swan, flowers, txt } from './eu-common.mjs';

// ---------- 道具、背景 ----------
const egg = (x, y, s = 1, crack = false) => at(x, y, s, false,
  `<ellipse cx="0" cy="-26" rx="21" ry="27" fill="#fffaf0" ${L}/>` +
  (crack ? `<path d="M-20 -30 l8 -8 l6 8 l6 -10 l6 8 l6 -8 l7 6" fill="none" ${line(2.5)}/>` : '') +
  `<ellipse cx="-7" cy="-36" rx="5" ry="8" fill="#fff" opacity=".9"/>`);
const shell = (x, y, s = 1) => at(x, y, s, false, `<path d="M-18 0 Q-20 -18 -12 -22 l5 6 l6 -8 l6 8 l6 -6 Q20 -18 18 0z" fill="#fffaf0" ${L}/>`);
const nest = (x, y, s = 1, front = '') => at(x, y, s, false,
  `<ellipse cx="0" cy="-10" rx="130" ry="30" fill="#c99a5a" ${L}/>` + front +
  `<path d="M-130 -10 Q0 40 130 -10 Q120 18 0 22 Q-120 18 -130 -10z" fill="#b5884a" ${L}/>` +
  [-100, -60, -20, 20, 60, 100].map((d) => `<path d="M${d - 14} ${0 + Math.abs(d) * -0.05} q14 10 28 0" fill="none" stroke="#8c6a3a" stroke-width="3"/>`).join(''));
const barn = (x, y, s = 1) => at(x, y, s, false,
  `<rect x="-110" y="-150" width="220" height="150" fill="#d0503a" ${L}/>` +
  `<path d="M-130 -140 L-80 -220 H80 L130 -140z" fill="#8c3a2a" ${L}/>` +
  `<rect x="-45" y="-100" width="90" height="100" fill="#fff4e0" ${L}/><path d="M-45 -100 L45 0 M45 -100 L-45 0" ${line(4)}/>` +
  `<rect x="-20" y="-190" width="40" height="34" fill="#fff4e0" ${L}/>`);
const reeds = (x, y, s = 1, snow = false) => at(x, y, s, false,
  [-24, -8, 8, 22].map((d, i) => `<path d="M${d} 0 Q${d + (i % 2 ? 6 : -6)} -60 ${d + (i % 2 ? 10 : -4)} ${-110 - i * 8}" fill="none" stroke="#7a9a4a" stroke-width="5" stroke-linecap="round"/>` +
    `<rect x="${d + (i % 2 ? 6 : -8)}" y="${-120 - i * 8}" width="10" height="34" rx="5" fill="#8c5a3a" ${line(2)}/>` +
    (snow ? `<ellipse cx="${d + (i % 2 ? 11 : -3)}" cy="${-122 - i * 8}" rx="9" ry="5" fill="#fff"/>` : '')).join(''));
const leafTree = (x, y, s, c1, c2) => at(x, y, s, false,
  `<rect x="-8" y="-60" width="16" height="60" fill="#9a6b45" ${L}/>` +
  `<circle cx="0" cy="-90" r="45" fill="${c1}" ${L}/><circle cx="-28" cy="-70" r="28" fill="${c2}" ${L}/><circle cx="30" cy="-68" r="26" fill="${c2}" ${L}/>`);
const autumnTree = (x, y, s = 1) => leafTree(x, y, s, '#e8873a', '#f2b14a');
const blossomTree = (x, y, s = 1) => leafTree(x, y, s, '#ffc2d6', '#ffd9e6') +
  at(x, y, s, false, [[-20, -110], [14, -96], [-34, -70], [34, -72], [0, -76]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="5" fill="#ff8fb1"/>`).join(''));
const bareTree = (x, y, s = 1) => at(x, y, s, false,
  `<path d="M0 0 V-90 M0 -60 L-34 -100 M0 -76 L30 -120 M-20 -84 L-30 -130 M16 -98 L40 -104" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>` +
  `<path d="M0 0 V-90 M0 -60 L-34 -100 M0 -76 L30 -120 M-20 -84 L-30 -130 M16 -98 L40 -104" fill="none" stroke="#8c6a4a" stroke-width="7" stroke-linecap="round"/>` +
  `<ellipse cx="-34" cy="-102" rx="12" ry="5" fill="#fff"/><ellipse cx="30" cy="-122" rx="12" ry="5" fill="#fff"/><ellipse cx="-30" cy="-132" rx="10" ry="4" fill="#fff"/>`);
const leaves = (pts) => pts.map(([x, y, r], i) => at(x, y, 1, false,
  `<path d="M0 -10 Q10 0 0 10 Q-10 0 0 -10z" fill="${['#e8873a', '#d0503a', '#f2b14a'][i % 3]}" ${line(2)} transform="rotate(${r})"/>`)).join('');
const snowflakes = (n = 30) => Array.from({ length: n }, (_, i) => {
  const x = ((i * 233) % 1700) - 450, y = ((i * 137) % 700) - 200;
  return `<circle cx="${x}" cy="${y}" r="${3 + (i % 3) * 2}" fill="#fff" opacity=".9"/>`;
}).join('');
const raindrops = (pts) => pts.map(([x, y]) => `<path d="M${x} ${y} l-6 16" stroke="#7cc4f2" stroke-width="4" stroke-linecap="round"/>`).join('');
// 倒影：上下翻轉、半透明
const reflect = (x, y, s, body) => `<g transform="translate(${x} ${y}) scale(${s} ${-s * 0.9})" opacity=".45">${body}</g>`;
const lake = (y = 380, c = '#7cc4f2') => water(y, H - y, c);

// 季節背景
const summer = () => sky() + sun(680, 90) + cloud(170, 110) + hills(360, '#9fd38a', '#86c46f') + ground(420, '#8dc775');
const spring = (y = 400) => sky('#c7e8ff', '#f2fbff') + sun(670, 100, 46) + cloud(180, 110) + cloud(470, 80, 0.7) +
  hills(y - 30, '#b3e09a', '#9fd38a');

// ---------- 每一頁 ----------
const pages = {
  // 封面：醜小鴨看著湖上的白天鵝
  cover: svg(spring(400) + blossomTree(110, 400, 1.1) + lake(400) +
    at(500, 470, 1.3, false, swan()) + reflect(500, 476, 1.3, swan()) +
    `<path d="M${BX} 500 Q160 480 300 560 L320 ${H} H${BX}z" fill="#9fd38a"/>` +
    at(170, 560, 1.1, false, uglyDuck({ mood: 'normal' })) +
    flowers(590, [60, 300]) + sparkle(640, 270) + sparkle(380, 300, 0.6) + hearts(260, 380)),

  // 1. 夏天，小鴨子一隻隻破殼而出
  '01': svg(summer() + barn(140, 420, 0.8) + fence(300, 430, 480) + leafTree(700, 430, 1, '#5fae5a', '#6cbd62') +
    nest(470, 560, 1.15, egg(70, -12, 1.1) + shell(-80, -8) + shell(20, -4, 0.8)) +
    at(390, 540, 0.9, false, duckling()) + at(470, 550, 0.9, false, duckling({ mood: 'normal' })) +
    at(130, 580, 1.15, false, motherDuck()) + sparkle(400, 360, 0.6) + sparkle(560, 380, 0.5) + grass(700, 580)),

  // 2. 最大的蛋終於裂開了
  '02': svg(summer() + barn(110, 420, 0.7) + fence(240, 430, 560) +
    nest(450, 570, 1.2, egg(0, -10, 2.1, true)) +
    at(310, 560, 0.75, false, duckling({ mood: 'scared' })) + at(600, 560, 0.75, true, duckling({ mood: 'scared' })) +
    at(140, 585, 1.1, false, motherDuck({ mood: 'scared' })) +
    txt(560, 320, '喀——', 46, '#a0683e') + sparkle(360, 330, 0.7)),

  // 3. 又大又灰的小鴨
  '03': svg(summer() + fence(-100, 430, 900) +
    nest(420, 570, 1.1, shell(-40, -8, 1.4) + shell(30, -4, 1.3)) +
    at(420, 545, 1.2, false, uglyDuck({ mood: 'normal' })) +
    at(210, 560, 0.85, true, duckling({ mood: 'scared' })) + at(620, 560, 0.85, false, duckling({ mood: 'scared' })) + at(700, 575, 0.8, true, duckling({ mood: 'scared' })) +
    at(110, 590, 1, false, motherDuck({ mood: 'scared' })) + txt(560, 330, '？', 46, '#5b8fd0') + txt(260, 330, '？', 40, '#5b8fd0')),

  // 4. 大家都笑他好醜
  '04': svg(summer() + barn(660, 420, 0.75) + fence(-200, 430, 700) +
    at(130, 560, 1, false, hen()) + at(280, 575, 1, false, motherDuck({ mood: 'laugh' })) +
    at(500, 560, 1.15, true, uglyDuck({ mood: 'cry' })) +
    at(650, 575, 0.75, false, duckling({ mood: 'laugh' })) + at(740, 575, 0.75, false, duckling({ mood: 'laugh' })) +
    txt(200, 300, '哈哈哈', 36, '#d0503a')),

  // 5. 偷偷離開農場
  '05': svg(sky('#f8d9b0', '#fff2df') + sun(130, 120, 46) + cloud(560, 100) + hills(360, '#c9d98a', '#b3cc74') +
    barn(120, 400, 0.45) + fence(-200, 410, 400) + ground(430, '#b3cc74') +
    `<path d="M${BX} 520 Q300 490 500 520 T${BX + BW} 510 V560 Q500 570 300 550 T${BX} 560z" fill="#e9d3a3"/>` +
    at(500, 540, 1.15, false, uglyDuck({ mood: 'sad' })) + grass(150, 580) + grass(680, 590) + grass(380, 600) +
    `<path d="M430 520 l-12 4 M400 528 l-12 4" ${line(3)}/>`),

  // 6. 秋天，葉子一片片掉下來
  '06': svg(sky('#d6cfc4', '#f2ebe0') + cloud(200, 110, 1.1) + cloud(540, 90) +
    hills(360, '#d6b06a', '#c99a5a') + ground(430, '#c9a560') +
    autumnTree(110, 450, 1.3) + autumnTree(680, 440, 1.1) +
    `<ellipse cx="400" cy="540" rx="240" ry="40" fill="#8fb0a6"/>` + reeds(170, 560, 1) + reeds(650, 560, 0.9) +
    at(400, 540, 1.1, false, uglyDuck({ mood: 'cry' })) +
    leaves([[300, 260, 20], [480, 230, 70], [560, 330, -30], [250, 380, 45], [610, 250, 0], [360, 320, 110]]) +
    raindrops([[150, 230], [260, 210], [520, 220], [660, 240], [720, 200]])),

  // 7. 天上飛過一群白色大鳥
  '07': svg(sky('#a9d4f5', '#f0f8ff') + cloud(150, 110) + cloud(620, 130, 0.8) +
    at(190, 350, 0.75, false, swan({ fly: true })) + at(410, 310, 0.8, false, swan({ fly: true })) + at(620, 280, 0.75, false, swan({ fly: true })) +
    hills(440, '#d6b06a', '#c99a5a') + ground(500, '#c9a560') + autumnTree(80, 520, 0.9) + reeds(700, 580, 0.9) +
    at(390, 580, 1, false, uglyDuck({ mood: 'normal' })) + sparkle(520, 380, 0.6, '#fff') + hearts(450, 470)),

  // 8. 冬天，湖水結冰，躲在蘆葦叢裡
  '08': svg(sky('#b8c4d6', '#e8eef6') + snowflakes(40) +
    hills(360, '#f4f7fb', '#e6edf5') + bareTree(120, 430, 1.3) + bareTree(700, 420, 1) +
    `<rect x="${BX}" y="430" width="${BW}" height="${H - 430}" fill="#cfe8f4"/>` +
    `<path d="M120 480 l60 20 l40 -14 M500 470 l40 30 l60 -6 M300 560 l50 -16" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>` +
    `<path d="M${BX} 520 Q300 500 600 520 T${BX + BW} 520 V${H} H${BX}z" fill="#fff"/>` +
    reeds(330, 560, 1.2, true) + at(420, 570, 1.1, false, uglyDuck({ mood: 'cry' })) + reeds(520, 580, 1.1, true) +
    sweat(500, 430) + `<path d="M470 470 q6 -6 12 0 M478 486 q6 -6 12 0" fill="none" stroke="#7cc4f2" stroke-width="3" stroke-linecap="round"/>`),

  // 9. 春天來了，翅膀變得好有力氣
  '09': svg(spring(420) + ground(440, '#9fd38a') + blossomTree(110, 460, 1.2) + blossomTree(690, 450, 1) +
    flowers(500, [60, 130, 220, 560, 620, 740]) + flowers(580, [40, 180, 300, 520, 660, 760]) +
    at(400, 560, 1.3, false, uglyDuck({ mood: 'happy', stage: 1, wings: true })) +
    sparkle(300, 330) + sparkle(520, 300, 0.8) + sparkle(560, 420, 0.6) + bird(560, 240, 0.9, '#f2c14e')),

  // 10. 湖邊的白色大鳥，他低下頭
  '10': svg(spring(400) + blossomTree(720, 400, 0.9) + lake(400) +
    at(470, 470, 0.85, true, swan()) + at(600, 500, 0.9, true, swan()) + at(720, 470, 0.8, true, swan()) +
    `<path d="M${BX} 520 Q100 500 300 540 V${H} H${BX}z" fill="#9fd38a"/>` +
    at(220, 545, 1.05, false, swan({ look: 1, mood: 'sad', col: '#f2f3f6' })) + flowers(590, [40, 100]) +
    txt(140, 330, '…', 40, '#7a6fa0')),

  // 11. 水面上的倒影，原來他是天鵝
  '11': svg(spring(380) + lake(380, '#8cd0f6') +
    at(380, 440, 1.35, false, swan({ look: 1, mood: 'normal' })) + reflect(380, 446, 1.35, swan({ look: 1, mood: 'normal' })) +
    sparkle(560, 300) + sparkle(260, 300, 0.8) + sparkle(600, 520, 0.6, '#fff') + sparkle(200, 540, 0.7, '#fff') +
    txt(620, 380, '哇！', 44, '#e86a6a')),

  // 12. 天鵝們歡迎他加入
  '12': svg(spring(400) + blossomTree(100, 400, 1) + blossomTree(720, 390, 0.85) + lake(400) +
    at(290, 445, 0.6, false, swan()) + at(560, 445, 0.6, true, swan()) +
    at(160, 510, 0.85, false, swan()) + at(670, 510, 0.85, true, swan()) + at(390, 570, 1.15, false, swan()) +
    hearts(380, 270) + sparkle(260, 300) + sparkle(560, 290, 0.8) + sparkle(680, 560, 0.6, '#fff')),
};

writeBook('ugly-duckling', pages);
