// 桃太郎的插畫：共用的背景、角色在 lib.mjs，這裡只放桃太郎專用的角色和每一頁的場景。
// 用法：node tools/scenes/momotaro.mjs

import * as S from './lib.mjs';

const {
  W, H, BX, BW, BY, INK, line, L, SKIN, at, svg, face, sky, sun, cloud, hills, mountain, path, tree, pine, grass, sparkle,
  water, sea, jpHouse, jpInterior, feet, arm, arms, grandpa, grandma, dog, monkey, pheasant, oni, boat, island,
  treasure, sweat, hearts, writeBook,
} = S;

// ---------- 桃太郎專用 ----------
function momotaro({ mood = 'happy', pose = 'down', flag = false, item = '' } = {}) {
  const C = '#ef7b45';
  const banner = flag
    ? `<path d="M-46 -40 V-300" stroke="#8a5a32" stroke-width="7" stroke-linecap="round"/>` +
      `<path d="M-46 -296 h-46 v108 h46z" fill="#fff" ${L}/>` +
      ['日', '本', '一'].map((c, i) => `<text x="-69" y="${-266 + i * 32}" font-size="26" font-weight="700" text-anchor="middle" fill="${INK}" font-family="serif">${c}</text>`).join('')
    : '';
  return banner + feet() +
    `<path d="M-30 -4 L-26 -54 H26 L30 -4z" fill="#3d5a99" ${L}/><path d="M0 -54 V-4" ${line(2.5)}/>` +
    `<path d="M-28 -52 L-24 -98 Q0 -108 24 -98 L28 -52z" fill="${C}" ${L}/>` +
    `<path d="M0 -102 L-12 -70 M0 -102 L12 -70" ${line(2.5)}/>` +
    `<rect x="-29" y="-62" width="58" height="10" fill="#f6e27a" ${L}/>` +
    `<path d="M-20 -58 L-62 -28" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M-20 -58 L-62 -28" stroke="#6b4a2f" stroke-width="5" stroke-linecap="round"/>` +
    arms(pose, C) + item +
    at(0, -134, 1, false,
      `<circle cx="0" cy="-36" r="12" fill="#2f2a2a" ${L}/>` +
      `<circle r="33" fill="${SKIN}" ${L}/>` +
      `<path d="M-33 -2 Q-34 -36 0 -36 Q34 -36 33 -2 Q20 -24 0 -22 Q-20 -24 -33 -2z" fill="#2f2a2a" ${line(2.5)}/>` +
      `<path d="M-34 -10 Q0 -24 34 -10 L34 -2 Q0 -16 -34 -2z" fill="#fff" ${line(2.5)}/>` +
      `<path d="M0 -21 q-7 -2 -6 5 q2 6 6 8 q4 -2 6 -8 q1 -7 -6 -5z" fill="#ff9aa8" ${line(1.5)}/>` +
      `<path d="M30 -8 q14 4 18 16 M30 -4 q10 8 10 18" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>` +
      face(33, mood));
}

const baby = () =>
  `<ellipse cx="0" cy="-30" rx="30" ry="28" fill="${SKIN}" ${L}/>` +
  arm(-20, -44, -44, -86, SKIN) + arm(20, -44, 44, -86, SKIN) +
  at(0, -82, 1, false, `<circle r="30" fill="${SKIN}" ${L}/><path d="M-6 -30 q6 -10 12 0" fill="none" ${line(2.5)}/>` + face(30, 'happy'));

// 大桃子；open = true 時裂成兩半
function peach(open = false) {
  const half = (d) => `<path d="M0 -150 Q${d * 110} -150 ${d * 100} -60 Q${d * 80} 0 0 0z" fill="url(#pch)" ${L}/>`;
  const defs = `<defs><radialGradient id="pch" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#ffe3d6"/><stop offset=".6" stop-color="#ffb0a0"/><stop offset="1" stop-color="#f27d7d"/></radialGradient></defs>`;
  const leaves = `<path d="M0 -150 q-40 -30 -70 -10 q35 25 70 10z" fill="#6cbd62" ${L}/><path d="M0 -150 q30 -40 70 -25 q-30 30 -70 25z" fill="#5fae5a" ${L}/>`;
  if (!open) return defs + `<path d="M0 -150 Q110 -150 100 -60 Q80 0 0 0 Q-80 0 -100 -60 Q-110 -150 0 -150z" fill="url(#pch)" ${L}/>` +
    `<path d="M0 -150 Q20 -80 0 -10" fill="none" stroke="#e86a6a" stroke-width="4" stroke-linecap="round"/>` + leaves;
  return defs + at(-55, 0, 1, false, `<g transform="rotate(-18)">${half(-1)}</g>`) + at(55, 0, 1, false, `<g transform="rotate(18)">${half(1)}</g>`);
}

const dango = (x, y, s = 1) => at(x, y, s, false,
  `<path d="M-40 0 H50" ${line(4)}/>` +
  ['#ffd9e0', '#fff8e6', '#b7e0a0'].map((c, i) => `<circle cx="${-24 + i * 24}" cy="0" r="12" fill="${c}" ${line(2.5)}/>`).join(''));

const kibiPouch = `<path d="M18 -70 q-8 18 8 22 h20 q16 -4 8 -22z" fill="#e2c27a" ${line(2.5)}/><path d="M22 -70 h28" ${line(2.5)}/>`;


// ---------- 每一頁 ----------
const pages = {
  // 封面：桃太郎和三個夥伴
  cover: svg(sky('#ffd9c9', '#fff2e6') + sun(640, 120, 50) + cloud(170, 120) + mountain(560, 380, 420, 220) +
    hills(400, '#a9d98f', '#8dc775') +
    at(400, 330, 1.2, false, peach()) +
    at(190, 520, 1, false, dog()) + at(400, 540, 1.15, false, momotaro({ pose: 'raise', flag: true })) +
    at(600, 520, 1, true, monkey({ pose: 'up' })) + at(640, 240, 0.9, true, pheasant({ fly: true })) +
    sparkle(300, 200) + sparkle(520, 150, 0.7)),

  // 1. 山腳下的老爺爺和老奶奶
  '01': svg(sky() + sun(680, 90) + cloud(160, 100) + cloud(480, 70, 0.7) +
    mountain(220, 330, 420, 230) + mountain(560, 330, 360, 180, '#b7c7e0') + hills(360) +
    jpHouse(300, 440, 0.9) + tree(640, 450, 1.1) + tree(80, 470, 0.8) +
    at(470, 520, 1, false, grandpa()) + at(560, 520, 1, true, grandma()) +
    grass(120, 560) + grass(700, 570) + grass(380, 580)),

  // 2. 河邊洗衣服，上游漂來大桃子
  '02': svg(sky() + cloud(600, 90) + hills(260, '#a9d98f', '#8dc775') +
    water(300, 170) + `<rect x="${BX}" y="470" width="${BW}" height="130" fill="#d9c08f"/>` +
    [[120, 500], [420, 520], [690, 495]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="40" ry="14" fill="#b7a07a"/>`).join('') +
    at(560, 400, 0.7, false, peach()) + sparkle(470, 270, 0.8) + sparkle(650, 260, 0.6) +
    at(230, 560, 1.05, true, grandma({ mood: 'scared', pose: 'point' })) +
    at(330, 520, 1, false, `<path d="M-40 0 H40 L30 26 H-30z" fill="#c9a25a" ${L}/><path d="M-30 6 h60 M-24 16 h48" stroke="#a67f3f" stroke-width="3"/>`) +
    `<text x="560" y="250" font-size="34" font-weight="700" fill="#2f6f9f" text-anchor="middle">咚嘩啦～</text>`),

  // 3. 抱回家，老爺爺拿起刀
  '03': svg(jpInterior() + at(400, 470, 1.15, false, peach()) +
    at(200, 560, 1.05, false, grandpa({ mood: 'normal', pose: 'raise', item: `<path d="M40 -160 L48 -220" stroke="#ccd3dc" stroke-width="10" stroke-linecap="round"/><path d="M40 -160 L36 -140" stroke="#6b4a2f" stroke-width="8" stroke-linecap="round"/>` })) +
    at(620, 560, 1.05, true, grandma({ mood: 'happy', pose: 'point' }))),

  // 4. 桃子裂開，跳出小男孩
  '04': svg(jpInterior() + at(400, 500, 1.15, false, peach(true)) + at(400, 470, 1.1, false, baby()) +
    sparkle(300, 200, 1.2) + sparkle(520, 180) + sparkle(560, 300, 0.8) + sparkle(250, 330, 0.7) +
    `<text x="590" y="300" font-size="56" font-weight="700" text-anchor="middle" fill="#e86a6a">啪！</text>` +
    at(150, 580, 1, false, grandpa({ mood: 'scared', pose: 'up' })) + at(660, 580, 1, true, grandma({ mood: 'happy', pose: 'up' }))),

  // 5. 吃得多、長得快
  '05': svg(sky() + sun(680, 90) + hills(380) + jpHouse(150, 460, 0.7) +
    at(420, 540, 1.3, false, momotaro({ pose: 'up', item: '' })) +
    at(420, 300, 1, false, `<ellipse cx="0" cy="0" rx="130" ry="24" fill="#8a8a8a" ${L}/><path d="M-120 -4 Q0 -70 120 -4" fill="#9a9a9a" ${L}/>`) +
    at(640, 560, 1, false, `<ellipse cx="0" cy="0" rx="90" ry="18" fill="#e8e0d0" ${L}/>` +
      [[-40, -6], [40, -6], [0, -40]].map(([x, y]) => at(x, y, 1, false, `<path d="M-30 0 Q-30 -46 0 -50 Q30 -46 30 0z" fill="#fff" ${L}/><rect x="-16" y="-16" width="32" height="16" fill="#2f2a2a"/>`)).join('')) +
    sweat(500, 330)),

  // 6. 鬼島的鬼來搶東西
  '06': svg(sky('#8c7ca8', '#d8c8e0') + cloud(140, 90, 0.9) + sea(330) +
    island(560, 400, 0.8) + at(560, 290, 0.42, false, oni()) + at(475, 300, 0.33, false, oni({ color: '#4a7fd0' })) +
    `<rect x="${BX}" y="440" width="${320 - BX}" height="160" fill="#d9c08f"/>` +
    at(110, 590, 0.85, false, grandpa({ mood: 'scared', pose: 'up' })) + at(230, 590, 0.85, false, grandma({ mood: 'cry' })) +
    sweat(70, 400) + sweat(270, 420)),

  // 7. 我要去鬼島！奶奶做了黍糰子
  '07': svg(jpInterior() + at(400, 580, 1.2, false, momotaro({ mood: 'happy', pose: 'raise', flag: true })) +
    at(170, 580, 1, false, grandpa({ pose: 'down' })) +
    at(640, 580, 1, true, grandma({ pose: 'hold' })) + dango(612, 512, 0.85) +
    sparkle(560, 380, 0.6)),

  // 8. 遇到小狗
  '08': svg(sky() + sun(110, 90) + cloud(600, 100) + hills(360) + path() + pine(700, 420) + tree(120, 460) +
    at(320, 560, 1.1, false, momotaro({ pose: 'point', flag: true, item: kibiPouch })) +
    at(530, 560, 1.2, true, dog()) + dango(430, 410, 0.7) + hearts(560, 430)),

  // 9. 遇到猴子
  '09': svg(sky() + cloud(200, 90) + hills(360, '#9fd38a', '#86c46f') + tree(660, 470, 1.3) + tree(120, 450) +
    at(280, 560, 1.05, false, momotaro({ pose: 'point', flag: true, item: kibiPouch })) +
    at(140, 560, 0.9, false, dog()) +
    at(520, 560, 1.1, true, monkey({ pose: 'up' })) + dango(420, 410, 0.7) + hearts(560, 380)),

  // 10. 遇到雉雞，大家一起出發
  '10': svg(sky() + sun(690, 90) + hills(380) + path() + pine(90, 440, 0.9) +
    at(380, 560, 1.05, false, momotaro({ pose: 'raise', flag: true })) +
    at(200, 560, 0.9, false, dog()) + at(560, 560, 0.9, false, monkey({ pose: 'up' })) +
    at(620, 320, 1, true, pheasant({ fly: true })) + sparkle(500, 260, 0.7) + sparkle(250, 280, 0.6)),

  // 11. 坐船划到鬼島
  '11': svg(sky('#a9d4f5', '#e8f5ff') + cloud(150, 100) + sun(700, 80) + sea(330) +
    island(640, 340, 0.7) +
    at(330, 420, 0.75, false, momotaro({ pose: 'point', flag: true })) +
    at(200, 420, 0.65, false, dog()) + at(440, 420, 0.65, false, monkey()) +
    boat(320, 450, 1.05) + at(480, 280, 0.6, false, pheasant({ fly: true }))),

  // 12. 大戰：雉雞啄、猴子抓、小狗咬
  '12': svg(sky('#9a86b8', '#e6d6ee') + `<rect x="${BX}" y="400" width="${BW}" height="200" fill="#8a8094"/>` +
    at(560, 560, 1.1, false, oni({ mood: 'scared' })) +
    at(420, 290, 0.7, true, pheasant({ fly: true })) +
    at(460, 460, 0.8, false, monkey({ pose: 'up' })) +
    at(500, 590, 0.8, false, dog()) +
    at(240, 580, 1.15, false, momotaro({ mood: 'angry', pose: 'raise', item: `<path d="M40 -160 L62 -262" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M40 -160 L62 -262" stroke="#dfe6ee" stroke-width="7" stroke-linecap="round"/><path d="M30 -168 h22" ${line(5)}/>` })) +
    sparkle(420, 300, 0.9, '#fff') + sparkle(640, 380, 0.7, '#fff') + sweat(660, 330) +
    `<text x="720" y="290" font-size="40" font-weight="700" fill="#fff" text-anchor="middle">哇！</text>`),

  // 13. 鬼大王道歉，還回寶物
  '13': svg(sky('#b9a7d0', '#efe6f5') + `<rect x="${BX}" y="420" width="${BW}" height="180" fill="#9a90a6"/>` +
    at(560, 560, 1.2, false, oni({ mood: 'cry', bow: true })) +
    treasure(330, 560, 1.1) +
    at(130, 560, 1, false, momotaro({ pose: 'down', flag: true })) +
    at(720, 560, 0.7, true, dog()) + at(700, 300, 0.6, true, pheasant({ fly: true })) +
    `<text x="560" y="300" font-size="34" font-weight="700" fill="${INK}" text-anchor="middle">對不起！</text>`),

  // 14. 回到村子，從此快樂
  '14': svg(sky('#ffd9c9', '#fff2e6') + sun(400, 130, 60) + cloud(150, 100) + cloud(660, 110, 0.8) +
    hills(380, '#a9d98f', '#8dc775') + jpHouse(700, 420, 0.5) +
    at(80, 570, 0.85, false, grandpa({ pose: 'up' })) + at(180, 570, 0.85, false, grandma({ pose: 'up' })) +
    at(330, 570, 1, false, momotaro({ pose: 'up', flag: true })) +
    treasure(470, 570, 0.65) +
    at(600, 570, 0.8, true, dog()) + at(710, 570, 0.8, true, monkey({ pose: 'up' })) +
    at(600, 300, 0.7, true, pheasant({ fly: true })) +
    sparkle(250, 200) + sparkle(560, 180, 0.7) + hearts(420, 380)),
};


writeBook('momotaro', pages);
