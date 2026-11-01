// 強尼蘋果籽的插畫。用法：node tools/scenes/johnny-appleseed.mjs --sheet

import * as S from './lib.mjs';
import * as U from './us-common.mjs';

const { BX, BW, H, INK, line, L, SKIN, at, svg, face, sky, sun, cloud, hills, mountain, ground, tree, pine, grass, sparkle, water, forest, person, hand, hearts, bird, writeBook } = S;
const { appleTree, apple, sapling, mound, logCabin, cow, deer, squirrel, bear, rabbit, thought } = U;

// ---------- 強尼專用 ----------
// 頭上戴鍋子（右邊有把手）
const potHat = `<path d="M-32 -16 H32 L28 -50 H-28z" fill="#8a8f99" ${L}/><ellipse cx="0" cy="-50" rx="28" ry="6" fill="#a7adb8" ${line(2.5)}/>` +
  `<path d="M30 -36 h28" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M30 -36 h28" stroke="#5a5560" stroke-width="5" stroke-linecap="round"/>` +
  `<path d="M-30 -20 H30" stroke="#6a6f78" stroke-width="3"/>`;
const bareFeet = [-14, 14].map((x) => `<ellipse cx="${x}" cy="-4" rx="14" ry="6" fill="${SKIN}" ${line(2.5)}/>` +
  `<path d="M${x + 6} -9 v4 M${x + 10} -8 v4" ${line(1.5)}/>`).join('');
const sackBack = `<path d="M-30 -130 Q-70 -130 -64 -80 Q-62 -40 -30 -44 Q-10 -60 -14 -100z" fill="#c9a25a" ${L}/><path d="M-50 -126 q6 -12 16 -6" fill="none" ${line(3)}/>`;
const strap = `<path d="M-24 -96 L18 -52" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M-24 -96 L18 -52" stroke="#8a5a32" stroke-width="4" stroke-linecap="round"/>`;
const patch = `<rect x="2" y="-40" width="14" height="14" fill="#a08a6a" ${line(2)}/>`;
function johnny({ sack = true, item = '', ...o } = {}) {
  return (sack ? sackBack : '') + person({
    outfit: 'tunic', top: '#c9a77a', bottom: '#7a6a5a', hair: 'short', hairColor: '#7a4a2a', hat: potHat, shoes: SKIN,
    item: bareFeet + patch + (sack ? strap : '') + item, ...o,
  });
}
const shovel = (x, y, rot = 0) => at(x, y, 1, false, `<g transform="rotate(${rot})"><path d="M0 -110 V0" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M0 -110 V0" stroke="#a8764a" stroke-width="6" stroke-linecap="round"/>` +
  `<path d="M-14 0 H14 L10 30 Q0 40 -10 30z" fill="#a7adb8" ${L}/><path d="M-10 -114 h20" ${line(6)}/></g>`);
const seeds = (x, y) => [[0, 0], [14, 12], [-8, 22], [24, 30], [6, 40]].map(([dx, dy]) => `<ellipse cx="${x + dx}" cy="${y + dy}" rx="4" ry="6" fill="#5a3a24" transform="rotate(30 ${x + dx} ${y + dy})"/>`).join('');

// 拓荒者
const papa = (o = {}) => person({ outfit: 'shirt', top: '#5b8fd0', bottom: '#6b5a3a', hair: 'short', hairColor: '#5a3a24', beard: '#5a3a24', hat: 'cap', hatColor: '#8a6a4a', ...o });
const bonnet = `<path d="M-38 10 Q-44 -44 0 -46 Q44 -44 38 10 Q30 -26 0 -28 Q-30 -26 -38 10z" fill="#f2efe6" ${L}/>`;
const mama = (o = {}) => person({ outfit: 'dress', top: '#c86b7a', apron: '#fff', hair: 'long', hairColor: '#8a5a32', hat: bonnet, ...o });
const kid = (o = {}) => person({ age: 'child', outfit: 'shirt', top: '#f2c14e', bottom: '#6b5a3a', hair: 'short', hairColor: '#c08040', ...o });
const girl = (o = {}) => person({ age: 'child', outfit: 'dress', top: '#8fc87a', hair: 'pigtails', hairColor: '#e0a050', ...o });

// 篷車
const wagon = (x, y, s = 1) => at(x, y, s, false,
  `<path d="M-100 -60 H100 L90 -20 H-90z" fill="#a8764a" ${L}/>` +
  `<path d="M-96 -60 Q-110 -170 -60 -170 H60 Q110 -170 96 -60z" fill="#f5f0e2" ${L}/>` +
  [-50, 0, 50].map((d) => `<path d="M${d} -60 Q${d * 1.1} -120 ${d} -168" fill="none" stroke="#d9cdb0" stroke-width="4"/>`).join('') +
  [-60, 60].map((wx) => `<circle cx="${wx}" cy="-20" r="28" fill="#c9a06a" ${L}/><circle cx="${wx}" cy="-20" r="6" fill="${INK}"/>` +
    [0, 45, 90, 135].map((a) => `<path d="M${wx} -20 l${(Math.cos(a * Math.PI / 180) * 26).toFixed(1)} ${(Math.sin(a * Math.PI / 180) * 26).toFixed(1)} M${wx} -20 l${(-Math.cos(a * Math.PI / 180) * 26).toFixed(1)} ${(-Math.sin(a * Math.PI / 180) * 26).toFixed(1)}" ${line(2.5)}/>`).join('')).join('') +
  `<path d="M100 -40 H150" ${line(5)}/>`);
const pie = (x, y, s = 1) => at(x, y, s, false,
  `<ellipse cx="0" cy="0" rx="70" ry="20" fill="#e8ebf0" ${L}/><path d="M-56 -4 Q-56 -40 0 -42 Q56 -40 56 -4 Q0 10 -56 -4z" fill="#e2b06a" ${L}/>` +
  [-30, 0, 30].map((d) => `<path d="M${d - 16} -24 L${d + 16} -24" stroke="#c9904a" stroke-width="5" stroke-linecap="round"/>`).join('') +
  `<path d="M-20 -36 l-8 20 M10 -38 l-6 22 M36 -30 l-6 18" stroke="#c9904a" stroke-width="5" stroke-linecap="round"/>` +
  `<path d="M-10 -52 q-6 -12 2 -20 M10 -52 q-6 -12 2 -20" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"/>`);
const stump = (x, y, s = 1) => at(x, y, s, false, `<path d="M-50 0 V-40 H50 V0z" fill="#9a6b45" ${L}/><ellipse cx="0" cy="-40" rx="50" ry="12" fill="#d9a877" ${L}/>`);
const orchardRow = (y, s, n, x0, dx) => Array.from({ length: n }, (_, i) => appleTree(x0 + i * dx, y, s)).join('');

// ---------- 每一頁 ----------
const pages = {
  // 封面：強尼一邊走一邊撒蘋果籽
  cover: svg(sky('#d4efff', '#fff8e8') + sun(660, 110, 46) + cloud(170, 110) + hills(390, '#a9d98f', '#8dc775') +
    appleTree(110, 470, 1.15) + appleTree(690, 460, 1.2) +
    at(400, 570, 1.3, false, johnny({ pose: 'raise', mood: 'happy' })) +
    seeds(470, 380) + sapling(540, 560, 1) + sapling(600, 580, 0.8) + mound(540, 562) + mound(600, 582, 0.8) +
    bird(250, 300, 1, '#e2483d') + sparkle(560, 260, 0.7)),

  // 1. 約翰最喜歡蘋果樹
  '01': svg(sky() + sun(110, 90) + cloud(600, 100) + hills(380) +
    appleTree(520, 520, 1.7) + appleTree(120, 460, 0.8) +
    at(300, 570, 1.2, false, johnny({ pose: 'raise', sack: false, item: apple(40, -170, 1.1) })) + hearts(380, 300)),

  // 2. 背著種子袋、戴鍋子、光著腳
  '02': svg(sky() + sun(680, 90) + cloud(170, 110) + hills(380, '#a9d98f', '#8dc775') + S.path() + pine(120, 450) + tree(700, 470) +
    at(400, 570, 1.5, false, johnny({ pose: 'hips', mood: 'happy' })) +
    seeds(250, 520) + sparkle(470, 260, 0.6) + sparkle(300, 330, 0.5)),

  // 3. 大家搬到西邊，那裡什麼都沒有
  '03': svg(sky('#ffd9b0', '#fff2dc') + sun(680, 200, 60) + mountain(560, 380, 460, 220, '#b7a7c9') + mountain(250, 380, 360, 160, '#c9b9d6') +
    `<rect x="${BX}" y="380" width="${BW}" height="${H - 380}" fill="#d9c890"/>` +
    [[60, 520], [160, 560], [700, 540], [620, 590]].map(([x, y]) => grass(x, y)).join('') +
    pine(50, 430, 0.6) + pine(740, 420, 0.5) +
    wagon(360, 540, 1.05) + at(560, 540, 0.7, false, cow({ c: '#b5784a', ox: true, muzzle: '#e8c4a0' })) +
    at(200, 560, 0.85, false, papa({ pose: 'point' })) + at(110, 560, 0.75, false, kid({ pose: 'up' }))),

  // 4. 我先去種蘋果樹！
  '04': svg(sky() + sun(110, 90) + hills(380) + pine(700, 440) +
    at(300, 570, 1.2, false, johnny({ pose: 'hold', mood: 'happy', item: shovel(30, -40, 15) })) +
    `<path d="M400 572 Q440 540 480 572z" fill="#a0764e" ${L}/><ellipse cx="380" cy="574" rx="20" ry="6" fill="#6b4a2f"/>` +
    thought(560, 300, 220, 150, 420, 400, appleTree(-40, 50, 0.55) + at(40, 60, 0.4, false, kid({ pose: 'up' })) + at(80, 60, 0.4, false, girl({ pose: 'up' })))),

  // 5. 走過山、走過河，一路種下蘋果籽
  '05': svg(sky() + cloud(160, 100) + cloud(600, 80, 0.8) + mountain(200, 370, 360, 180) + mountain(560, 370, 420, 220, '#b7c7e0') + hills(380) +
    `<path d="M${BX} 470 Q200 440 360 480 T${BX + BW} 470 V530 Q400 560 0 520 T${BX} 540z" fill="#7cc4f2"/>` +
    `<path d="M60 495 q20 -10 40 0 q20 10 40 0 M500 500 q20 -10 40 0 q20 10 40 0" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>` +
    [[60, 440, 0.7], [160, 430, 0.75], [260, 430, 0.8], [90, 590, 1], [220, 590, 1]].map(([x, y, s]) => sapling(x, y, s) + mound(x, y + 2, s)).join('') +
    at(560, 590, 1.1, true, johnny({ pose: 'reach', item: seeds(70, -70) })) + mound(440, 592) + `<ellipse cx="440" cy="580" rx="5" ry="7" fill="#5a3a24"/>`),

  // 6. 森林裡的動物都是他的朋友
  '06': svg(sky('#d8f0e0', '#f4fff4') + forest(410) + `<rect x="${BX}" y="410" width="${BW}" height="${H - 410}" fill="#8dc775"/>` +
    at(400, 570, 1.15, false, johnny({ pose: 'reach', item: apple(74, -76, 0.8) })) +
    at(600, 570, 0.95, true, deer({ antlers: true })) + at(160, 570, 0.95, false, bear()) +
    at(300, 590, 0.9, false, squirrel()) + at(500, 590, 1, true, rabbit()) +
    bird(560, 300, 1, '#e2483d') + bird(300, 280, 0.9, '#5b8fd0') + hearts(470, 330)),

  // 7. 送新來的家庭蘋果樹苗
  '07': svg(sky() + sun(680, 90) + cloud(170, 110) + hills(380) + logCabin(620, 460, 0.8) + pine(80, 450, 0.9) +
    at(230, 570, 1.1, false, johnny({ pose: 'reach', item: sapling(76, -66, 1.2) })) +
    at(430, 570, 1.1, true, papa({ pose: 'reach' })) + at(530, 575, 1, true, mama({ pose: 'hold' })) +
    at(650, 580, 0.95, true, kid({ pose: 'up' })) + hearts(340, 340)),

  // 8. 小朋友最喜歡聽他講故事
  '08': svg(sky('#ffe2c4', '#fff6e8') + sun(650, 130, 50) + hills(390, '#a9d98f', '#8dc775') + appleTree(400, 430, 1.1) +
    stump(400, 560, 0.9) + at(400, 530, 1.05, false, johnny({ pose: 'up', sack: false })) +
    at(180, 580, 1, false, kid({ item: apple(14, -50, 0.8), pose: 'hold' })) + at(270, 590, 0.9, false, girl({ pose: 'hold', item: apple(14, -50, 0.8) })) +
    at(560, 590, 0.9, true, kid({ top: '#7cc4f2', hairColor: '#3a2a22', pose: 'up' })) + at(650, 580, 1, true, girl({ top: '#f7a8c8', hairColor: '#8a5a32', pose: 'hold', item: apple(14, -50, 0.8) })) +
    sparkle(250, 300, 0.7) + sparkle(560, 290, 0.6)),

  // 9. 好多年後，一大片蘋果園
  '09': svg(sky() + sun(400, 110, 50) + cloud(150, 90) + cloud(650, 100, 0.8) + hills(330, '#a9d98f', '#8dc775') +
    orchardRow(380, 0.5, 9, -40, 110) + orchardRow(450, 0.7, 7, 0, 140) + orchardRow(560, 1, 5, -20, 210) +
    bird(300, 220, 0.9, '#e2483d') + bird(500, 240, 0.8, '#5b8fd0')),

  // 10. 吃到香甜的蘋果，就會想起他
  '10': svg(sky('#ffe2c4', '#fff6e8') + sun(160, 130, 50) + cloud(640, 110) + hills(380, '#a9d98f', '#8dc775') +
    appleTree(110, 470, 1) + appleTree(700, 460, 1) +
    at(560, 360, 0.45, false, johnny({ pose: 'raise' })) + sapling(600, 362, 0.5) +
    `<rect x="250" y="490" width="300" height="16" fill="#c99a6b" ${L}/><rect x="270" y="506" width="14" height="80" fill="#9a6b45" ${L}/><rect x="516" y="506" width="14" height="80" fill="#9a6b45" ${L}/>` +
    pie(400, 486, 0.9) + apple(300, 474) + apple(500, 474) +
    at(200, 590, 1, false, girl({ pose: 'hold', item: apple(14, -50, 0.8) })) + at(620, 590, 1, true, kid({ pose: 'up', item: apple(52, -150, 0.8) })) +
    hearts(420, 330)),
};

writeBook('johnny-appleseed', pages);
