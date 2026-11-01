// 金太郎的插畫。用法：node tools/scenes/kintaro.mjs --sheet

import {
  BX, BW, INK, line, L, SKIN, at, svg, face, sky, sun, cloud, hills, mountain, tree, pine, grass, sparkle,
  forest, jpHouse, armsAt, feet, monkey, person, hearts, sweat, writeBook,
} from './lib.mjs';
import { rot, say, bear, rabbit, deer, waistSword, jpCastle, sakura, petals } from './jp-common.mjs';

const R = '#e2483d';

// 大斧頭：原點在握柄底端，往上 130，刀刃朝右
const bigAxe = (x, y, deg = 0, s = 1) => rot(x, y, deg, s,
  `<path d="M0 0 V-130" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M0 0 V-130" stroke="#a8764a" stroke-width="8" stroke-linecap="round"/>` +
  `<path d="M2 -138 L50 -156 Q66 -112 50 -68 L2 -88z" fill="#cfd8e2" ${L}/>` +
  `<path d="M42 -150 Q56 -112 42 -76" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>` +
  `<rect x="-8" y="-144" width="16" height="60" rx="4" fill="#7a7a8a" ${L}/>`);

// 金太郎：娃娃頭、紅色肚兜（金字）、光著手腳
function kintaro({ mood = 'happy', pose = 'down', axe = false } = {}) {
  return (axe ? bigAxe(40, -96) : '') + feet() +
    `<rect x="-20" y="-44" width="16" height="40" fill="${SKIN}" ${L}/><rect x="4" y="-44" width="16" height="40" fill="${SKIN}" ${L}/>` +
    `<path d="M-26 -34 L-24 -82 Q0 -92 24 -82 L26 -34 Q0 -26 -26 -34z" fill="${SKIN}" ${L}/>` +
    `<path d="M-20 -86 H20 L30 -50 Q0 -14 -30 -50z" fill="${R}" ${L}/>` +
    `<circle cx="0" cy="-58" r="14" fill="#fff8e6" ${line(2.5)}/>` +
    `<text x="0" y="-51.5" font-size="18" font-weight="700" text-anchor="middle" fill="${INK}" font-family="serif">金</text>` +
    armsAt(pose, SKIN, -80) +
    at(0, -112, 1, false,
      `<circle r="30" fill="${SKIN}" ${L}/>` +
      `<path d="M-33 8 Q-38 -38 0 -38 Q38 -38 33 8 L26 8 Q26 -4 24 -12 H-24 Q-26 -4 -26 8z" fill="#2f2a2a" ${line(2.5)}/>` +
      face(30, mood));
}

const mom = (o = {}) => person({ hair: 'bun', top: '#c9708f', bottom: '#7a4a8a', ...o });
const samurai = (o = {}) => person({ hair: 'topknot', top: '#3d5a99', bottom: '#2a3a66', beard: '#3a2a22', item: waistSword, ...o });

// 長大後的坂田金時：頭盔、紅色鎧甲、大斧頭
const kintoki = (o = {}) => bigAxe(40, -110, 0, 1.1) + person({
  hair: 'topknot', hairColor: '#2f2a2a', top: R, bottom: '#3d3d5a', outfit: 'tunic', pose: 'raise',
  hat: `<path d="M-35 -4 Q-36 -46 0 -46 Q36 -46 35 -4z" fill="#3d3d5a" ${L}/><path d="M-40 -6 H40" ${line(5)}/>` +
    `<path d="M-6 -44 Q-30 -70 -34 -96 Q-14 -70 0 -52 Q14 -70 34 -96 Q30 -70 6 -44z" fill="#f6d36b" ${line(2.5)}/>`,
  item: `<circle cx="0" cy="-70" r="12" fill="#fff8e6" ${line(2.5)}/><text x="0" y="-64.5" font-size="16" font-weight="700" text-anchor="middle" fill="${INK}" font-family="serif">金</text>`,
  ...o,
});

// 山裡的背景
const mountainBg = (y = 380) => sky() + mountain(220, y - 30, 460, 260) + mountain(600, y - 30, 380, 200, '#b7c7e0') +
  forest(y + 10, '#6aae64', '#5a9e5a') + hills(y + 30, '#9fd38a', '#86c46f');

// 側面看的急流：左岸、右岸，中間是河（x 300～520）
const gorge = (left = 300, right = 520, top = 450) =>
  `<rect x="${BX}" y="${top}" width="${BW}" height="${600 - top}" fill="#3f8fd8"/>` +
  [0, 1, 2, 3, 4].map((i) => `<path d="M${left + 10 + (i % 2) * 40} ${top + 40 + i * 26} q20 -12 40 0 q20 12 40 0 q20 -12 40 0" fill="none" stroke="#e6f6ff" stroke-width="5" stroke-linecap="round"/>`).join('') +
  `<path d="M${BX} ${top} H${left} Q${left + 10} ${top + 60} ${left - 6} 600 H${BX}z" fill="#7fc06c" ${L}/>` +
  `<path d="M${BX + BW} ${top} H${right} Q${right - 10} ${top + 60} ${right + 6} 600 H${BX + BW}z" fill="#7fc06c" ${L}/>` +
  `<rect x="${BX}" y="${top}" width="${left - BX - 4}" height="16" fill="#8dc775"/>` +
  `<rect x="${right + 4}" y="${top}" width="${BX + BW - right - 4}" height="16" fill="#8dc775"/>`;

const pages = {
  // 封面：金太郎騎著大熊，扛著大斧頭，動物朋友圍在旁邊
  cover: svg(mountainBg(380) + sun(670, 100, 46) + cloud(160, 110) +
    at(400, 560, 1.15, false, bear({ pose: 'walk' })) +
    at(388, 478, 1.05, false, kintaro({ pose: 'raise', axe: true })) +
    at(150, 570, 0.95, false, rabbit()) + at(640, 570, 0.85, true, deer()) + at(710, 575, 0.75, true, monkey({ pose: 'up' })) +
    sparkle(250, 260) + sparkle(560, 240, 0.7) + grass(80, 590) + grass(560, 595)),

  // 1. 足柄山深山裡，金太郎和媽媽
  '01': svg(mountainBg(390) + sun(680, 90) + cloud(160, 100) + cloud(500, 70, 0.7) +
    jpHouse(250, 470, 0.85) + pine(60, 500, 1.1) + pine(720, 490, 1.2) + tree(620, 500, 0.9) +
    at(430, 560, 1.05, false, mom({ pose: 'down' })) + at(520, 560, 1.05, true, kintaro({ pose: 'up' })) +
    grass(120, 580) + grass(380, 590) + grass(700, 585)),

  // 2. 紅色肚兜、扛大斧頭，力氣好大
  '02': svg(sky('#ffe0b8', '#fff4e0') + sun(650, 110, 50) + cloud(150, 110) + hills(400, '#a9d98f', '#8dc775') +
    pine(110, 480, 1.1) + pine(700, 470, 1) +
    at(400, 560, 1.3, false, kintaro({ pose: 'raise', axe: true })) +
    // 被輕鬆舉起的大石頭
    at(220, 560, 1, false, `<path d="M-60 0 Q-70 -60 -20 -76 Q30 -86 56 -50 Q72 -20 60 0z" fill="#a8a39a" ${L}/><path d="M-30 -50 q14 -10 26 0" fill="none" ${line(2.5)}/>`) +
    sparkle(560, 260) + sparkle(280, 300, 0.7) + say(600, 360, '嘿！', 44, R)),

  // 3. 動物朋友：熊、兔子、猴子、小鹿
  '03': svg(mountainBg(380) + cloud(170, 100) + sun(680, 90) +
    at(160, 560, 1.05, false, bear({ arms: 'wave' })) +
    at(360, 565, 1.05, false, kintaro({ pose: 'up' })) +
    at(500, 565, 0.85, false, rabbit()) +
    at(640, 565, 0.95, true, deer()) + at(740, 570, 0.75, true, monkey({ pose: 'up' })) +
    hearts(420, 330) + grass(250, 590) + grass(560, 595)),

  // 4. 和大熊玩相撲
  '04': svg(sky() + cloud(150, 100) + cloud(620, 80, 0.8) + mountain(600, 360, 400, 200, '#b7c7e0') + hills(380) +
    // 土俵
    `<ellipse cx="400" cy="560" rx="300" ry="46" fill="#d9b27c" ${L}/><ellipse cx="400" cy="556" rx="250" ry="34" fill="none" stroke="#fff8e6" stroke-width="6"/>` +
    at(330, 560, 1.25, false, kintaro({ pose: 'reach', mood: 'angry' })) +
    at(480, 560, 1.1, true, bear({ arms: 'reach', mood: 'scared' })) + sweat(560, 340) +
    at(130, 570, 0.8, false, rabbit()) + at(700, 575, 0.7, true, monkey({ pose: 'up' })) +
    say(400, 260, '嘿咻！嘿咻！', 42, R)),

  // 5. 帶著動物朋友去山的另一邊
  '05': svg(sky() + sun(110, 90) + cloud(560, 100) + mountain(620, 360, 420, 210) + hills(380) +
    `<path d="M${BX} 520 Q200 480 400 520 T${BX + BW} 510 V600 H${BX}z" fill="#e9d3a3"/>` +
    pine(720, 470, 1.1) + tree(80, 460, 0.9) +
    at(540, 575, 1, false, bear({ pose: 'walk' })) + at(530, 500, 0.9, false, kintaro({ pose: 'point' })) +
    at(330, 580, 0.85, false, deer()) + at(200, 585, 0.8, false, rabbit()) + at(95, 585, 0.7, false, monkey({ pose: 'up' }))),

  // 6. 很急的河，沒有橋
  '06': svg(sky() + cloud(160, 100) + mountain(620, 380, 420, 200, '#b7c7e0') + forest(440, '#6aae64', '#5a9e5a') + gorge() +
    pine(650, 450, 1) + tree(740, 450, 0.8) +
    at(250, 450, 0.85, false, kintaro({ pose: 'hips', mood: 'normal' })) +
    at(140, 450, 0.8, false, bear({ mood: 'scared' })) +
    at(70, 455, 0.65, false, rabbit({ mood: 'scared' })) +
    at(200, 560, 0.75, false, deer({ mood: 'scared' })) + at(80, 575, 0.6, false, monkey({ mood: 'scared' })) +
    say(410, 430, '嘩啦啦！', 34, '#2f6f9f')),

  // 7. 推倒大樹，轟隆！
  '07': svg(sky() + cloud(560, 90) + mountain(640, 380, 400, 190, '#b7c7e0') + forest(440, '#6aae64', '#5a9e5a') + gorge() +
    // 正在倒下的大樹（樹根在左岸）
    rot(250, 450, 55, 1,
      `<rect x="-20" y="-300" width="40" height="300" fill="#9a6b45" ${L}/>` +
      `<circle cx="0" cy="-330" r="56" fill="#5fae5a" ${L}/><circle cx="-36" cy="-296" r="34" fill="#6cbd62" ${L}/><circle cx="36" cy="-300" r="34" fill="#6cbd62" ${L}/>`) +
    `<path d="M210 455 q-10 10 -24 6 M290 452 q12 10 24 4" fill="none" ${line(3)}/>` +
    at(190, 455, 1, false, kintaro({ pose: 'reach', mood: 'angry' })) +
    at(80, 455, 0.65, false, bear({ arms: 'up', mood: 'scared' })) +
    at(130, 580, 0.6, false, rabbit({ mood: 'scared' })) +
    [[330, 300], [470, 260], [560, 360]].map(([x, y]) => sparkle(x, y, 0.8, '#fff')).join('') +
    say(470, 230, '轟隆！', 52, R)),

  // 8. 大家走過大樹橋
  '08': svg(sky() + sun(690, 90) + cloud(170, 100) + mountain(620, 380, 420, 200, '#b7c7e0') + forest(440, '#6aae64', '#5a9e5a') + gorge() +
    // 橫跨河面的大樹
    `<rect x="240" y="430" width="340" height="30" rx="12" fill="#9a6b45" ${L}/>` +
    `<circle cx="600" cy="420" r="40" fill="#5fae5a" ${L}/><circle cx="620" cy="446" r="26" fill="#6cbd62" ${L}/>` +
    `<path d="M240 446 l-20 -10 M240 452 l-18 10" ${line(4)}/>` +
    at(300, 432, 0.6, false, rabbit()) + at(400, 432, 0.65, false, deer()) + at(500, 432, 0.6, false, monkey({ pose: 'up' })) +
    at(130, 452, 0.75, false, bear({ arms: 'wave' })) +
    at(690, 452, 0.85, true, kintaro({ pose: 'up' })) +
    hearts(560, 300) + say(420, 280, '謝謝你！', 38, R)),

  // 9. 路過的武士躲在樹後看見了
  '09': svg(sky() + cloud(170, 100) + cloud(560, 80, 0.7) + mountain(330, 380, 420, 200, '#b7c7e0') + forest(440, '#6aae64', '#5a9e5a') +
    gorge(160, 380, 450) +
    `<rect x="120" y="430" width="300" height="24" rx="10" fill="#9a6b45" ${L}/>` +
    at(200, 432, 0.5, false, rabbit()) + at(270, 432, 0.5, false, deer()) + at(350, 432, 0.5, false, monkey()) +
    at(460, 452, 0.6, true, kintaro({ pose: 'up' })) +
    at(620, 580, 1.15, true, samurai({ mood: 'happy', pose: 'hold' })) +
    tree(720, 590, 1.5) +
    say(560, 330, '真了不起！', 34, INK)),

  // 10. 武士來到家裡，請媽媽讓金太郎去京城
  '10': svg(sky() + cloud(160, 90) + sun(690, 90) + mountain(250, 340, 420, 200) + hills(380) +
    jpHouse(400, 470, 0.95) +
    at(180, 570, 1.1, false, samurai({ pose: 'point' })) +
    at(420, 570, 1.05, false, kintaro({ pose: 'down', mood: 'normal' })) +
    at(600, 570, 1.1, true, mom({ pose: 'hold', mood: 'normal' })) +
    pine(740, 520, 0.9) + grass(300, 590) + grass(700, 590)),

  // 11. 和動物們說再見
  '11': svg(sky('#ffd9c9', '#fff2e6') + sun(400, 140, 56) + cloud(150, 100) + mountain(620, 380, 420, 200, '#c9b7d6') +
    hills(400, '#a9d98f', '#8dc775') +
    `<path d="M${BX} 540 Q200 500 420 530 T${BX + BW} 520 V600 H${BX}z" fill="#e9d3a3"/>` +
    at(150, 560, 0.95, false, bear({ arms: 'wave', mood: 'cry' })) +
    at(260, 570, 0.75, false, rabbit({ mood: 'cry' })) + at(350, 570, 0.8, false, deer({ mood: 'cry' })) +
    at(80, 580, 0.6, false, monkey({ mood: 'cry', pose: 'up' })) +
    at(560, 570, 1.05, true, kintaro({ pose: 'raise' })) +
    at(680, 570, 1.05, false, samurai({ pose: 'down' })) + hearts(440, 360)),

  // 12. 長大成為英雄坂田金時
  '12': svg(sky('#ffe7b8', '#fff7e6') + sun(620, 110, 54) + cloud(170, 100) + hills(400, '#a9d98f', '#8dc775') +
    jpCastle(580, 480, 0.8) + sakura(120, 520, 1.1) + sakura(760, 540, 0.8) +
    at(330, 570, 1.25, false, kintoki()) +
    at(470, 575, 0.65, true, bear({ arms: 'up' })) +
    sparkle(220, 260) + sparkle(460, 230, 0.8) + sparkle(680, 300, 0.7) +
    petals([[200, 330], [420, 300], [640, 420], [80, 400], [520, 380]])),
};

writeBook('kintaro', pages);
