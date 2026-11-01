// 輝夜姬的插畫。用法：node tools/scenes/kaguya.mjs --sheet

import {
  BX, BW, BY, H, INK, line, L, SKIN, at, svg, face, sky, sun, cloud, hills, mountain, tree, pine, grass, sparkle,
  night, stars, moon, jpHouse, jpInterior, grandpa, grandma, person, hearts, sweat, writeBook,
} from './lib.mjs';
import { rot, say, eboshi, bamboo, bambooGrove, koban, sakura, petals, cloudSeat, tennyo } from './jp-common.mjs';

// ---------- 輝夜姬專用 ----------
// 輝夜姬：長黑髮、層層和服（粉紅 + 紫）、金色髮飾
const KHAT = `<path d="M-20 -30 Q0 -40 20 -30" fill="none" stroke="#f6d36b" stroke-width="5" stroke-linecap="round"/><circle cx="0" cy="-36" r="5" fill="#f6d36b" ${line(2)}/>`;
const kaguya = (o = {}) => person({ hair: 'long', hairColor: '#2f2a2a', top: '#f2a0c0', bottom: '#9a6bc0', outfit: 'robe', hat: KHAT, ...o }) ;
// 層次衣領（加在 item）
const layers = `<path d="M-14 -98 L0 -70 L14 -98" fill="none" stroke="#fff" stroke-width="4"/><path d="M-20 -96 L0 -62 L20 -96" fill="none" stroke="#9a6bc0" stroke-width="3"/>`;
// 小小的輝夜姬（手掌大）
const tiny = (o = {}) => person({ age: 'child', hair: 'long', hairColor: '#2f2a2a', top: '#f2a0c0', bottom: '#9a6bc0', outfit: 'robe', ...o });

// 柴刀（老爺爺 raise 的右手）
const hatchet = rot(40, -150, 25, 1,
  `<path d="M0 10 V-60" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M0 10 V-60" stroke="#a8764a" stroke-width="6" stroke-linecap="round"/>` +
  `<path d="M-4 -66 H30 Q36 -40 22 -30 H-4z" fill="#cfd8e2" ${L}/>`);

const prince = (top, o = {}) => person({ hair: 'short', top, bottom: '#4a4a6a', hat: eboshi(), ...o });
const PRINCES = ['#5b8fd0', '#e2a03d', '#5fae5a', '#c9443a', '#8e6bb0'];

const spear = `<path d="M30 -40 L60 -230" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M30 -40 L60 -230" stroke="#a8764a" stroke-width="4" stroke-linecap="round"/><path d="M60 -230 l-8 -6 l12 -30 l8 32z" fill="#cfd8e2" ${line(2)}/>`;
const soldier = (o = {}) => person({ hair: 'short', top: '#7a8a9a', bottom: '#3d4a5a', hat: 'helmet', outfit: 'tunic', pose: 'raise', item: spear, ...o });

// 竹筒（被砍開，切口朝上），裡面可以放東西
const cutBamboo = (x, y, h = 130, glow = true, inside = '') => at(x, y, 1, false,
  (glow ? `<ellipse cx="0" cy="${-h}" rx="80" ry="90" fill="#fff6a8" opacity=".55"/>` : '') +
  `<rect x="-26" y="${-h}" width="52" height="${h}" fill="${glow ? '#e8f08a' : '#79bf63'}" ${L}/>` +
  `<path d="M-26 ${-h + 60} h52" stroke="${INK}" stroke-width="3"/>` +
  `<ellipse cx="0" cy="${-h}" rx="26" ry="9" fill="#fffbd0" ${L}/>` + inside);

const basket = (x, y, s = 1, inside = '') => at(x, y, s, false,
  `<ellipse cx="0" cy="-34" rx="44" ry="10" fill="#b5884a" ${L}/>` + inside +
  `<path d="M-44 -34 Q-40 0 0 0 Q40 0 44 -34 Q0 -22 -44 -34z" fill="#d9b27c" ${L}/>` +
  `<path d="M-30 -24 l8 18 M-10 -22 l4 20 M10 -22 l-4 20 M30 -24 l-8 18" ${line(2)}/>`);

// 稀世寶物：蓬萊玉枝、火鼠皮衣、龍頸之珠、佛的石缽、燕子的子安貝
const treasures = {
  branch: `<path d="M0 30 V-20 M0 0 L-20 -24 M0 -10 L18 -30" fill="none" stroke="#d8a830" stroke-width="6" stroke-linecap="round"/>` +
    [[-20, -26, '#ff8aa0'], [18, -32, '#9ad0ff'], [0, -22, '#fff'], [-8, -6, '#b7e0a0']].map(([cx, cy, c]) => `<circle cx="${cx}" cy="${cy}" r="7" fill="${c}" ${line(2)}/>`).join(''),
  robe: `<path d="M-28 -24 L-10 -30 L0 -20 L10 -30 L28 -24 L34 0 L22 4 L20 30 H-20 L-22 4 L-34 0z" fill="#e2603d" ${L}/><path d="M0 -20 V30" ${line(2)}/>`,
  jewel: `<circle r="24" fill="#fff" ${L}/><path d="M-24 0 Q-12 -14 0 0 T24 0" fill="none" stroke="#7cc4f2" stroke-width="5"/><path d="M-20 -12 Q0 -24 20 -12" fill="none" stroke="#ff8aa0" stroke-width="4"/><path d="M-18 12 Q0 22 18 12" fill="none" stroke="#b7e0a0" stroke-width="4"/>`,
  bowl: `<path d="M-30 -10 H30 Q26 24 0 26 Q-26 24 -30 -10z" fill="#8a8794" ${L}/><ellipse cx="0" cy="-10" rx="30" ry="8" fill="#5a5766" ${L}/>`,
  shell: `<path d="M0 -26 Q22 -24 22 4 Q20 28 0 28 Q-20 28 -22 4 Q-22 -24 0 -26z" fill="#ffe6d0" ${L}/><path d="M0 -20 V22" ${line(2.5)}/>` + [-12, -4, 4, 12].map((yy) => `<path d="M-4 ${yy} h-6 M4 ${yy} h6" ${line(2)}/>`).join(''),
};
const bubble = (x, y, body) => `<circle cx="${x}" cy="${y}" r="40" fill="#fff" opacity=".9" stroke="${INK}" stroke-width="3" stroke-dasharray="6 6"/>` + at(x, y, 0.95, false, body);

const letter = `<rect x="-16" y="-10" width="32" height="20" fill="#fff" ${line(2.5)}/><path d="M-16 -10 L0 2 L16 -10" fill="none" ${line(2)}/>`;
const jar = `<path d="M-12 -24 h24 v6 q12 6 10 22 q-2 14 -16 16 h-12 q-14 -2 -16 -16 q-2 -16 10 -22z" fill="#e8dcc0" ${L}/><rect x="-10" y="-30" width="20" height="8" fill="#c9443a" ${line(2)}/>`;

const veranda = (y = 470) => `<rect x="${BX}" y="${y}" width="${BW}" height="${H - y}" fill="#b98a5a"/>` +
  [0, 1, 2, 3].map((i) => `<path d="M${BX} ${y + 30 + i * 30} H${BX + BW}" stroke="#a0744a" stroke-width="3"/>`).join('') + `<path d="M${BX} ${y} H${BX + BW}" ${line(4)}/>`;

const zzz = (x, y) => say(x, y, 'z', 22, '#5b6b8a') + say(x + 14, y - 16, 'z', 18, '#5b6b8a');

const pages = {
  // 封面：月夜竹林裡，輝夜姬站在發光的竹子旁
  cover: svg(night('#1d2550', '#4a5a9a') + moon(600, 120, 56) + bambooGrove(560, '#3f6a5a', '#355e50') +
    `<rect x="${BX}" y="530" width="${BW}" height="70" fill="#2f4a3f"/>` +
    bamboo(250, 560, 1960, { glow: true, w: 26 }) + bamboo(110, 560, 1960, { c: '#4f8f5a' }) + bamboo(690, 560, 1960, { c: '#4f8f5a' }) +
    at(430, 570, 1.3, false, kaguya({ pose: 'hold', mood: 'happy', item: layers })) +
    sparkle(250, 330, 0.9, '#fff6a8') + sparkle(330, 260, 0.6, '#fff6a8') + sparkle(560, 300, 0.7, '#fff6a8') + sparkle(200, 440, 0.5, '#fff6a8')),

  // 1. 砍竹子的老爺爺
  '01': svg(sky() + sun(680, 90) + cloud(170, 100) + mountain(560, 380, 420, 220) + bambooGrove(520) + hills(460, '#9fd38a', '#86c46f') +
    bamboo(120, 560, 1960) + bamboo(640, 570, 1960) + bamboo(720, 580, 1960, { w: 18 }) +
    at(380, 570, 1.25, false, grandpa({ mood: 'happy', pose: 'raise', item: hatchet })) +
    `<path d="M480 560 L560 530" stroke="${INK}" stroke-width="20" stroke-linecap="round"/><path d="M480 560 L560 530" stroke="#79bf63" stroke-width="14" stroke-linecap="round"/>` +
    grass(250, 590) + grass(560, 590)),

  // 2. 一根竹子閃閃發光
  '02': svg(sky('#d8ecd0', '#f2faee') + bambooGrove(520) + hills(470, '#9fd38a', '#86c46f') +
    bamboo(100, 570, 1960) + bamboo(740, 580, 1960) +
    bamboo(520, 560, 1960, { glow: true, w: 28 }) +
    sparkle(470, 380, 0.9) + sparkle(580, 330, 0.7) + sparkle(560, 450, 0.6) + sparkle(470, 270, 0.6) +
    at(280, 575, 1.2, false, grandpa({ mood: 'scared', pose: 'point' })) + say(390, 310, '咦？', 36, '#5a7a3a')),

  // 3. 竹子裡坐著手掌大的小女孩
  '03': svg(sky('#d8ecd0', '#f2faee') + bambooGrove(520) + hills(470, '#9fd38a', '#86c46f') +
    bamboo(90, 570, 1960) + bamboo(730, 580, 1960) +
    cutBamboo(500, 560, 140, true, at(0, -136, 0.42, false, tiny({ pose: 'up', mood: 'happy' }))) +
    `<path d="M560 556 L640 520" stroke="${INK}" stroke-width="30" stroke-linecap="round"/><path d="M560 556 L640 520" stroke="#e8f08a" stroke-width="24" stroke-linecap="round"/>` +
    sparkle(440, 340, 0.8) + sparkle(570, 360, 0.6) + sparkle(500, 260, 0.6) +
    at(270, 575, 1.2, false, grandpa({ mood: 'happy', pose: 'up' })) + hearts(340, 330)),

  // 4. 帶回家，和老奶奶一起照顧
  '04': svg(jpInterior() +
    `<rect x="350" y="530" width="100" height="26" rx="8" fill="#e8647e" ${L}/>` +
    basket(400, 534, 1, at(0, -30, 0.36, false, tiny({ pose: 'up', mood: 'happy' }))) +
    at(210, 575, 1.2, false, grandpa({ mood: 'happy', pose: 'point' })) +
    at(590, 575, 1.2, true, grandma({ mood: 'happy', pose: 'point' })) +
    hearts(380, 360) + sparkle(470, 420, 0.5)),

  // 5. 竹子裡常常出現金子
  '05': svg(sky() + sun(110, 90) + bambooGrove(520) + hills(470, '#9fd38a', '#86c46f') +
    bamboo(80, 570, 1960) + bamboo(740, 580, 1960) +
    cutBamboo(500, 560, 120, true) +
    koban(470, 410, 1, -20) + koban(540, 380, 0.9, 15) + koban(500, 330, 0.8, 0) + koban(590, 440, 0.9, 30) + koban(430, 470, 0.8, -40) +
    [[620, 540], [660, 556], [580, 560]].map(([x, y], i) => koban(x, y, 0.8, 70 + i * 10)).join('') +
    sparkle(450, 300, 0.7) + sparkle(620, 340, 0.6) +
    at(280, 575, 1.2, false, grandpa({ mood: 'happy', pose: 'up' }))),

  // 6. 長成美麗溫柔的輝夜姬
  '06': svg(sky('#ffe6ee', '#fff6f8') + sun(660, 100, 44) + cloud(170, 100) + hills(400, '#b9e0a0', '#9fd38a') +
    jpHouse(150, 470, 0.6) + sakura(620, 520, 1.15) +
    at(400, 575, 1.35, false, kaguya({ pose: 'hold', mood: 'happy', item: layers })) +
    sparkle(300, 280, 0.8) + sparkle(500, 260, 0.6) + sparkle(520, 380, 0.5) +
    petals([[260, 360], [480, 330], [560, 440], [200, 450], [700, 330], [330, 230]])),

  // 7. 五位王子來求婚
  '07': svg(sky() + cloud(170, 100) + cloud(560, 80, 0.7) + hills(400, '#b9e0a0', '#9fd38a') +
    `<rect x="${BX}" y="500" width="${BW}" height="100" fill="#e9d3a3"/>` +
    jpHouse(680, 500, 0.6) +
    PRINCES.map((c, i) => at(80 + i * 95, 585, 0.88, false, prince(c, { pose: i % 2 ? 'reach' : 'point', mood: 'happy' }))).join('') +
    at(640, 585, 1.05, true, kaguya({ pose: 'hold', mood: 'normal', item: layers })) +
    hearts(250, 330) + hearts(420, 300)),

  // 8. 找到稀世寶物就嫁給他
  '08': svg(jpInterior() +
    bubble(140, 290, treasures.branch) + bubble(260, 270, treasures.robe) + bubble(380, 290, treasures.jewel) +
    bubble(500, 270, treasures.bowl) + bubble(620, 290, treasures.shell) +
    at(650, 585, 1.15, true, kaguya({ pose: 'raise', mood: 'normal', item: layers })) +
    [0, 1, 2].map((i) => at(120 + i * 130, 585, 0.95, false, prince(PRINCES[i * 2], { pose: 'hold', mood: 'scared' }))).join('') +
    sweat(165, 420) + sweat(425, 420)),

  // 9. 有的找假貨、有的半路放棄，沒有人成功
  '09': svg(sky('#d8dce6', '#f2f4f8') + cloud(170, 100) + cloud(600, 90, 0.8) + hills(400, '#b9cfa6', '#a4bf90') +
    `<rect x="${BX}" y="500" width="${BW}" height="100" fill="#e2d6b8"/>` +
    // 假的玉枝斷掉了
    at(200, 585, 1.05, false, prince(PRINCES[0], { pose: 'reach', mood: 'cry' })) +
    rot(290, 480, 50, 1, treasures.branch) + rot(320, 560, -70, 0.8, `<path d="M0 0 V-30" stroke="#d8a830" stroke-width="6" stroke-linecap="round"/>`) +
    say(300, 440, '✕', 50, '#e2483d') +
    at(460, 585, 0.95, false, prince(PRINCES[1], { pose: 'hold', mood: 'cry' })) + sweat(510, 420) +
    at(650, 585, 0.9, true, prince(PRINCES[3], { pose: 'down', mood: 'scared' })) +
    `<path d="M700 520 h40 M690 540 h50" stroke="#a8a39a" stroke-width="4" stroke-linecap="round"/>`),

  // 10. 望著月亮哭泣，爺爺奶奶擔心
  '10': svg(night('#1d2550', '#46508a') + moon(600, 130, 50) +
    `<rect x="${BX}" y="250" width="${BW}" height="230" fill="#2f3a6a"/>` + hills(470, '#3f5a6a', '#35505f') + veranda(480) +
    at(520, 580, 1.2, false, kaguya({ pose: 'hold', mood: 'cry', item: layers })) +
    at(180, 580, 1.05, false, grandpa({ mood: 'scared', pose: 'point' })) + at(300, 580, 1.05, false, grandma({ mood: 'scared', pose: 'hold' })) +
    sparkle(640, 260, 0.5, '#fff6c8')),

  // 11. 我是月亮上的人
  '11': svg(night('#1d2550', '#46508a') + moon(560, 170, 80) + hills(470, '#3f5a6a', '#35505f') + veranda(480) +
    at(420, 580, 1.2, false, kaguya({ pose: 'raise', mood: 'cry', item: layers })) +
    at(180, 580, 1.05, false, grandpa({ mood: 'cry', pose: 'hold' })) + at(660, 580, 1.05, true, grandma({ mood: 'cry', pose: 'hold' })) +
    sparkle(470, 300, 0.6, '#fff6c8') + sparkle(680, 260, 0.5, '#fff6c8')),

  // 12. 請士兵守在家門口
  '12': svg(night('#1d2550', '#46508a') + moon(640, 110, 46) + hills(430, '#3f5a6a', '#35505f') +
    jpHouse(400, 480, 0.8) + `<rect x="${BX}" y="480" width="${BW}" height="120" fill="#4a5a6a"/>` +
    [90, 220, 580, 710].map((x, i) => at(x, 585, 0.9, i > 1, soldier({ mood: 'angry' }))).join('') +
    at(400, 585, 1, false, grandpa({ mood: 'angry', pose: 'point' }))),

  // 13. 月亮使者坐著雲朵降下來，士兵們都動不了
  '13': svg(sky('#fff6c8', '#fffdf0') +
    [-300, -120, 60, 240, 420, 600, 780, 960].map((x) => `<path d="M560 -400 L${x} 600 L${x + 90} 600z" fill="#ffe9a6" opacity=".35"/>`).join('') +
    moon(560, 60, 70) + `<rect x="${BX}" y="500" width="${BW}" height="100" fill="#d8d0b8"/>` +
    cloudSeat(500, 410, 1.2) +
    at(420, 380, 0.75, false, tennyo({ top: '#fff0f6', ribbon: '#ffb0d0', mood: 'normal' })) +
    at(520, 370, 0.8, false, tennyo({ top: '#f0f6ff', ribbon: '#a6d8ff', mood: 'normal', pose: 'reach' })) +
    at(620, 380, 0.75, true, tennyo({ top: '#fff8e0', ribbon: '#ffd98a', mood: 'normal' })) +
    [[100, 0], [240, 1]].map(([x, i]) => at(x, 585, 0.85, false, soldier({ mood: 'happy', pose: 'down', item: '' }))).join('') +
    `<path d="M60 590 L180 560 M200 592 L320 566" stroke="#a8764a" stroke-width="6" stroke-linecap="round"/>` +
    zzz(150, 420) + zzz(290, 420) +
    at(720, 585, 0.85, true, soldier({ mood: 'happy', pose: 'down', item: '' })) + zzz(760, 420) +
    sparkle(330, 260, 0.8, '#fff') + sparkle(700, 280, 0.7, '#fff') + sparkle(170, 300, 0.6, '#fff')),

  // 14. 留下一封信和長生不老的藥
  '14': svg(sky('#fff2c0', '#fffbea') + moon(640, 80, 60) + cloudSeat(660, 330, 0.8) +
    `<rect x="${BX}" y="480" width="${BW}" height="120" fill="#d8d0b8"/>` +
    at(480, 585, 1.2, true, kaguya({ pose: 'reach', mood: 'cry', item: layers })) +
    at(388, 485, 1, false, letter) + at(410, 512, 0.9, false, jar) +
    at(180, 585, 1.1, false, grandpa({ mood: 'cry', pose: 'hold' })) + at(300, 585, 1.1, false, grandma({ mood: 'cry', pose: 'hold' })) +
    hearts(330, 380)),

  // 15. 穿上羽衣飛回月亮，爺爺奶奶抬頭想念她
  '15': svg(night('#1d2550', '#4a5a9a') + moon(620, 110, 70) +
    `<path d="M300 420 Q450 340 560 200" fill="none" stroke="#fff6c8" stroke-width="4" stroke-dasharray="4 12" stroke-linecap="round" opacity=".8"/>` +
    hills(470, '#3f5a6a', '#35505f') + jpHouse(680, 520, 0.55) + `<rect x="${BX}" y="520" width="${BW}" height="80" fill="#3a4a5a"/>` +
    cloudSeat(480, 360, 0.6) +
    at(480, 340, 0.7, false,
      `<path d="M-40 -100 Q-100 -90 -110 -30 Q-114 10 -150 20" fill="none" stroke="${INK}" stroke-width="14" stroke-linecap="round"/>` +
      `<path d="M-40 -100 Q-100 -90 -110 -30 Q-114 10 -150 20" fill="none" stroke="#e6f0ff" stroke-width="9" stroke-linecap="round"/>` +
      `<path d="M40 -100 Q90 -120 110 -60 Q120 -20 160 -20" fill="none" stroke="${INK}" stroke-width="14" stroke-linecap="round"/>` +
      `<path d="M40 -100 Q90 -120 110 -60 Q120 -20 160 -20" fill="none" stroke="#e6f0ff" stroke-width="9" stroke-linecap="round"/>` +
      kaguya({ pose: 'up', mood: 'happy', item: layers })) +
    at(180, 590, 1, false, grandpa({ mood: 'cry', pose: 'up' })) + at(300, 590, 1, false, grandma({ mood: 'cry', pose: 'up' })) +
    sparkle(380, 300, 0.6, '#fff6c8') + sparkle(590, 330, 0.5, '#fff6c8')),
};

writeBook('kaguya', pages);
