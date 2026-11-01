// 李伯大夢的插畫。用法：node tools/scenes/rip-van-winkle.mjs --sheet

import * as S from './lib.mjs';
import * as U from './us-common.mjs';

const { BX, BW, H, INK, line, L, SKIN, at, svg, face, sky, sun, cloud, hills, mountain, ground, tree, pine, grass, sparkle, forest, cottage, fence, night, moon, person, hand, sweat, hearts, bird, writeBook } = S;
const { pup, thought, zzz } = U;

// ---------- 李伯 ----------
const tricorn = `<path d="M-46 -20 Q0 -36 46 -20 L34 -50 Q0 -64 -34 -50z" fill="#3a3236" ${L}/><path d="M-40 -24 Q0 -40 40 -24" fill="none" stroke="#c9a25a" stroke-width="3"/>`;
const longBeard = `<path d="M-26 6 Q-34 70 -10 110 Q0 100 4 116 Q14 98 22 104 Q34 70 26 6 Q14 24 0 22 Q-14 24 -26 6z" fill="#f4f4f4" ${L}/>` +
  `<path d="M-14 22 Q0 14 14 22" fill="none" ${line(2.5)}/>`;
const youngBeard = `<path d="M-22 10 Q0 40 22 10 Q12 22 0 20 Q-12 22 -22 10z" fill="#7a4a2a" ${line(2)}/>`;
// old = 睡了二十年之後：白色長鬍子、長白髮、衣服破舊
function rip({ old = false, item = '', ...o } = {}) {
  return person({
    outfit: 'tunic', top: old ? '#7a8a6a' : '#5b8a6a', bottom: old ? '#8a7a6a' : '#7a5a3a',
    hair: old ? 'long' : 'short', hairColor: old ? '#f4f4f4' : '#7a4a2a',
    hat: (old ? longBeard : youngBeard) + tricorn,
    item: (old ? `<rect x="-22" y="-60" width="14" height="14" fill="#c9a77a" ${line(2)}/><rect x="6" y="-30" width="14" height="12" fill="#c9a77a" ${line(2)}/>` : '') + item,
    ...o,
  });
}
const wolf = (o = {}) => pup({ c: '#c08a52', muzzle: '#f3d7b5', ear: '#8a5a32', ...o });
const musket = (x, y, rot = 0, rusty = false) => at(x, y, 1, false, `<g transform="rotate(${rot})">` +
  `<path d="M0 0 L120 0" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M0 0 L120 0" stroke="${rusty ? '#b5703e' : '#8a8f99'}" stroke-width="5" stroke-linecap="round"/>` +
  `<path d="M-50 -2 L10 -6 L10 8 L-46 16z" fill="${rusty ? '#8a6a52' : '#8a5a32'}" ${L}/>` +
  (rusty ? `<circle cx="60" cy="0" r="4" fill="#c97a3e"/><circle cx="96" cy="0" r="3" fill="#c97a3e"/>` : '') + `</g>`);

// 山上的小老頭：矮矮的、灰色長鬍子、高帽子
const tallHat = (c) => `<ellipse cx="0" cy="-24" rx="36" ry="8" fill="${c}" ${L}/><path d="M-22 -26 L-18 -72 H18 L22 -26z" fill="${c}" ${L}/><path d="M-20 -36 H20" stroke="#f2c14e" stroke-width="5"/>`;
const dwarf = ({ c = '#7a5aa0', pants = '#c8553d', ...o } = {}) => person({
  age: 'child', outfit: 'tunic', top: c, bottom: pants, hair: 'bald', hairColor: '#ccc', hat: tallHat(c) + `<path d="M-22 12 Q-26 54 0 66 Q26 54 22 12 Q10 24 0 22 Q-10 24 -22 12z" fill="#d6d6d6" ${line(2)}/>`,
  mood: 'happy', ...o,
});
const keg = (x, y, s = 1) => at(x, y, s, false,
  `<path d="M-30 -70 Q-40 -35 -30 0 H30 Q40 -35 30 -70z" fill="#b5783e" ${L}/><path d="M-34 -54 H34 M-34 -16 H34" stroke="#6a6f78" stroke-width="6"/><ellipse cx="0" cy="-70" rx="30" ry="8" fill="#d9a877" ${L}/>`);
const pin = (x, y, s = 1, r = 0) => at(x, y, s, false, `<g transform="rotate(${r})"><path d="M-8 0 Q-14 -20 -6 -30 Q-10 -40 0 -48 Q10 -40 6 -30 Q14 -20 8 0z" fill="#fff" ${L}/><path d="M-6 -34 h12" stroke="#e2483d" stroke-width="4"/></g>`);
const ball = (x, y, r = 18) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#3a3236" ${L}/><circle cx="${x - 5}" cy="${y - 6}" r="3" fill="#fff"/><circle cx="${x + 4}" cy="${y - 7}" r="3" fill="#fff"/>`;
const bolt = (x, y, s = 1) => at(x, y, s, false, `<path d="M0 0 L-20 40 H0 L-14 80 L30 26 H8 L22 0z" fill="#f6d36b" ${L}/>`);
const flagon = `<path d="M-12 0 H12 L10 -30 H-10z" fill="#a8b0bc" ${L}/><path d="M12 -24 q12 0 10 12 q-2 8 -12 6" fill="none" ${line(3)}/>`;
const usFlag = (x, y, s = 1) => at(x, y, s, false, `<path d="M0 0 V-180" ${line(5)}/>` +
  Array.from({ length: 7 }, (_, i) => `<rect x="2" y="${-176 + i * 12}" width="96" height="12" fill="${i % 2 ? '#fff' : '#e2483d'}"/>`).join('') +
  `<rect x="2" y="-176" width="42" height="48" fill="#3d5a99"/>` +
  [[12, -166], [24, -160], [34, -168], [14, -146], [28, -142], [36, -150]].map(([sx, sy]) => `<circle cx="${sx}" cy="${sy}" r="2.5" fill="#fff"/>`).join('') +
  `<rect x="2" y="-176" width="96" height="84" fill="none" ${line(2.5)}/>`);
const villager = (o = {}) => person({ outfit: 'shirt', top: '#8a6aa0', bottom: '#4a4a5a', hair: 'short', hairColor: '#3a2a22', hat: 'cap', hatColor: '#3a3236', mood: 'scared', ...o });
const babyBundle = (x, y) => at(x, y, 1, false, `<ellipse cx="0" cy="0" rx="30" ry="18" fill="#fff8e6" ${L}/><circle cx="18" cy="-8" r="14" fill="${SKIN}" ${line(2.5)}/>` +
  `<path d="M14 -10 q2 -2 4 0 M22 -10 q2 -2 4 0" fill="none" ${line(2)}/><ellipse cx="22" cy="-2" rx="3" ry="2" fill="#f5a3a3"/>`);
const daughter = (o = {}) => person({ outfit: 'dress', top: '#5b8fd0', apron: '#fff', hair: 'bun', hairColor: '#7a4a2a', ...o });
const cobweb = (x, y, s = 1) => at(x, y, s, false, `<path d="M0 0 L40 0 M0 0 L0 40 M0 0 L30 30 M14 0 Q12 12 0 14 M28 0 Q26 24 0 28" fill="none" stroke="#fff" stroke-width="2" opacity=".9"/>`);
const mushroom = (x, y, c = '#e2483d') => at(x, y, 1, false, `<rect x="-5" y="-16" width="10" height="16" fill="#fff8e6" ${line(2)}/><path d="M-16 -14 Q0 -34 16 -14z" fill="${c}" ${line(2)}/><circle cx="-4" cy="-22" r="2.5" fill="#fff"/>`);
const bigTree = (x, y, s = 1) => at(x, y, s, false,
  `<path d="M-20 0 L-14 -150 H14 L20 0z" fill="#8a5a32" ${L}/>` +
  `<circle cx="-70" cy="-170" r="60" fill="#4f9a5f" ${L}/><circle cx="70" cy="-170" r="60" fill="#4f9a5f" ${L}/><circle cx="0" cy="-220" r="70" fill="#5fae5a" ${L}/>`);
// 躺在地上睡覺的李伯：原點在身體下方中間，頭在左邊
function sleepingRip(old = false) {
  const coat = old ? '#7a8a6a' : '#5b8a6a', pants = old ? '#8a7a6a' : '#7a5a3a', hairC = old ? '#f4f4f4' : '#7a4a2a';
  return `<rect x="10" y="-34" width="110" height="20" rx="8" fill="${pants}" ${L}/><rect x="10" y="-20" width="104" height="20" rx="8" fill="${pants}" ${L}/>` +
    `<ellipse cx="128" cy="-24" rx="8" ry="13" fill="${INK}"/><ellipse cx="122" cy="-8" rx="8" ry="13" fill="${INK}"/>` +
    `<path d="M-60 0 Q-70 -50 -40 -56 H30 Q40 -30 30 0z" fill="${coat}" ${L}/><rect x="-20" y="-56" width="10" height="56" fill="#6b4a2f" ${line(2)}/>` +
    (old ? `<rect x="0" y="-40" width="14" height="14" fill="#c9a77a" ${line(2)}/>` : '') +
    `<path d="M-30 -40 L10 -10" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M-30 -40 L10 -10" stroke="${coat}" stroke-width="16" stroke-linecap="round"/><circle cx="12" cy="-10" r="8" fill="${SKIN}" ${line(2.5)}/>` +
    at(-92, -36, 1, false, `<g transform="rotate(-25)">` +
      (old ? `<path d="M-32 -4 Q-40 30 -20 40 L30 30 Q36 0 32 -4z" fill="${hairC}" ${L}/>` : '') +
      `<circle r="30" fill="${SKIN}" ${L}/>` +
      `<path d="M-31 2 Q-32 -32 0 -32 Q32 -32 31 2 Q20 -22 0 -20 Q-20 -22 -31 2z" fill="${hairC}" ${line(2.5)}/>` +
      `<path d="M-18 0 q6 6 12 0 M6 0 q6 6 12 0" fill="none" ${line(3)}/><ellipse cx="0" cy="14" rx="4" ry="5" fill="#c94f4f"/>` +
      `<ellipse cx="-18" cy="10" rx="5" ry="3" fill="#f5a3a3" opacity=".7"/><ellipse cx="18" cy="10" rx="5" ry="3" fill="#f5a3a3" opacity=".7"/>` +
      (old ? `<path d="M-20 18 Q10 30 40 60 Q70 80 110 70 Q80 60 60 40 Q30 10 20 16z" fill="#f4f4f4" ${L}/><path d="M10 34 Q40 56 76 66 M24 26 Q50 46 90 60" fill="none" stroke="#c9c9c9" stroke-width="3" stroke-linecap="round"/><path d="M-10 14 q10 -6 20 0" fill="none" ${line(2.5)}/>` : youngBeard) +
      `</g>` + at(170, 18, 0.7, false, tricorn));
}

// ---------- 每一頁 ----------
const villageBg = () => sky() + cloud(150, 100) + mountain(250, 360, 520, 260, '#9fb3d0') + mountain(600, 360, 460, 220, '#b7c7e0') + hills(380);

const pages = {
  // 封面：李伯在樹下睡著，小老頭們在旁邊打保齡球
  cover: svg(sky('#ffe0c0', '#fff4e4') + sun(660, 120, 46) + mountain(300, 380, 520, 240, '#b7a7c9') + hills(400, '#a9d98f', '#8dc775') +
    bigTree(220, 520, 1) +
    at(250, 560, 1.15, false, sleepingRip(true)) + zzz(190, 410) +
    at(470, 570, 0.85, false, dwarf({ pose: 'reach' })) + ball(560, 552) + speedLines(530, 544) +
    pin(660, 570, 1) + pin(690, 560, 1, 20) + pin(720, 572, 1, -10) + pin(700, 580, 1) +
    bolt(720, 230, 0.8)),

  // 1. 紐約山腳下的小村莊
  '01': svg(villageBg() + pine(60, 440) + pine(740, 430) +
    cottage(220, 480, 0.6, { wall: '#f3e3c3', roof: '#8a5a4a' }) + cottage(560, 470, 0.55, { wall: '#e8d8c8', roof: '#5a6a8a' }) + cottage(390, 460, 0.45, { roof: '#c8553d' }) +
    at(380, 570, 1.05, false, rip({ pose: 'raise' })) + at(470, 575, 0.9, true, wolf()) + bird(600, 280, 0.9)),

  // 2. 幫鄰居、陪小朋友，就是不做自己家裡的工作
  '02': svg(sky() + sun(680, 90) + cloud(170, 100) + hills(380) +
    cottage(130, 470, 0.6, { wall: '#efe0c8', roof: '#8a5a4a' }) +
    `<path d="M20 470 l20 -40 l10 50 l10 -50 l14 40" fill="none" stroke="#6b9a3a" stroke-width="5"/>` +
    `<path d="M210 470 l14 -40 l10 44" fill="none" stroke="#6b9a3a" stroke-width="5"/>` +
    at(400, 570, 1.1, false, rip({ pose: 'raise', item: `<path d="M40 -160 L140 -290" stroke="${INK}" stroke-width="2"/>` })) +
    at(560, 575, 0.9, true, person({ age: 'child', outfit: 'shirt', top: '#f2c14e', bottom: '#5b7fb0', hair: 'short', pose: 'up' })) +
    at(660, 580, 0.9, true, person({ age: 'child', outfit: 'dress', top: '#f7a8c8', hair: 'pigtails', hairColor: '#8a5a32', pose: 'up' })) +
    at(500, 220, 1, false, `<path d="M0 -40 L30 0 L0 40 L-30 0z" fill="#e2483d" ${L}/><path d="M0 -40 V40 M-30 0 H30" ${line(2)}/><path d="M0 40 q-10 20 6 30 q-12 10 0 24" fill="none" ${line(2)}/>`)),

  // 3. 帶著小狗、扛著獵槍上山
  '03': svg(sky() + cloud(600, 100) + mountain(500, 420, 700, 320, '#8fae8a') + hills(420, '#7fbf6c', '#6aae5c') +
    pine(120, 470, 1.1) + pine(700, 450, 1.2) + pine(620, 480, 0.9) +
    at(360, 570, 1.15, false, rip({ pose: 'hold', item: musket(-10, -60, -30) })) +
    at(500, 575, 1, false, wolf())),

  // 4. 傍晚，遇到扛著大木桶的小老頭
  '04': svg(sky('#f2a07a', '#ffe0b8') + sun(400, 330, 70) + mountain(200, 400, 500, 260, '#a07a9a') + mountain(620, 400, 460, 230, '#b08aa8') +
    `<rect x="${BX}" y="400" width="${BW}" height="${H - 400}" fill="#8aa86a"/>` + pine(80, 470, 1) + pine(730, 470, 1.1) +
    at(260, 570, 1.1, false, rip({ pose: 'point', mood: 'normal' })) + at(150, 575, 0.85, false, wolf({ mood: 'scared' })) +
    at(520, 570, 0.95, true, dwarf({ pose: 'up', mood: 'normal' })) + keg(520, 410, 0.9) +
    `<text x="640" y="400" font-size="56" font-weight="700" text-anchor="middle" fill="#7a4a6a">?</text>`),

  // 5. 小老頭們打保齡球，轟隆轟隆像打雷
  '05': svg(sky('#7a8ab0', '#c8cfe0') + cloud(160, 120, 1.1) + cloud(600, 110) + bolt(240, 150, 0.9) + bolt(620, 160, 0.8) +
    `<rect x="${BX}" y="400" width="${BW}" height="${H - 400}" fill="#8aa86a"/>` + `<path d="M120 520 L720 470" stroke="#7a9a5a" stroke-width="40" stroke-linecap="round"/>` +
    at(150, 570, 0.85, false, dwarf({ pose: 'reach' })) + ball(300, 500) + `<path d="M260 506 h-60 M262 494 h-40" stroke="#fff" stroke-width="4" stroke-linecap="round"/>` +
    pin(620, 490, 1.1) + pin(650, 480, 1.1) + pin(680, 478, 1.1, 30) + pin(700, 470, 1.1) + pin(650, 500, 1.1, -40) +
    at(420, 580, 0.75, false, dwarf({ c: '#3f8a56', pants: '#5b8fd0', pose: 'up' })) +
    at(560, 590, 0.75, true, dwarf({ c: '#c8553d', pants: '#3d5a99', pose: 'hips' })) +
    at(730, 580, 0.75, true, dwarf({ c: '#5b8fd0', pants: '#f2c14e', pose: 'up' })) +
    `<text x="420" y="300" font-size="50" font-weight="700" text-anchor="middle" fill="#fff">轟隆！</text>`),

  // 6. 喝了桶子裡的飲料，在樹下睡著了
  '06': svg(night('#2a3360', '#56609a') + moon(640, 120, 40) + `<rect x="${BX}" y="400" width="${BW}" height="${H - 400}" fill="#4f7a5a"/>` +
    bigTree(220, 500, 1) +
    at(290, 560, 1.1, false, sleepingRip(false)) + zzz(240, 420) +
    at(450, 585, 0.9, false, `<g transform="rotate(80)">${flagon}</g>`) + keg(600, 560, 0.8) + at(520, 570, 0.7, true, dwarf({ pose: 'down' })) +
    grass(400, 580) + grass(700, 590)),

  // 7. 醒來：鬍子又長又白，獵槍生鏽，小狗不見了
  '07': svg(sky('#ffd8b0', '#fff6e0') + sun(640, 300, 60) + `<rect x="${BX}" y="400" width="${BW}" height="${H - 400}" fill="#7fbf6c"/>` +
    bigTree(150, 500, 1) + cobweb(170, 380) +
    at(390, 570, 1.2, false, rip({ old: true, mood: 'scared', pose: 'up' })) +
    musket(500, 572, -10, true) + mushroom(600, 580) + mushroom(630, 588, '#c9a06a') + mushroom(80, 590) +
    `<text x="560" y="330" font-size="56" font-weight="700" text-anchor="middle" fill="#c8553d">?</text>` + sweat(470, 330)),

  // 8. 回到村子，大家都不認識他
  '08': svg(villageBg() +
    cottage(120, 470, 0.55, { roof: '#5a6a8a' }) + cottage(330, 450, 0.5, { wall: '#f5f0e6', roof: '#3d5a99' }) + cottage(700, 470, 0.6, { roof: '#c8553d' }) + usFlag(520, 460, 0.9) +
    at(230, 570, 1.05, false, rip({ old: true, mood: 'scared', pose: 'down' })) +
    at(450, 575, 0.95, true, villager({ pose: 'point' })) + at(560, 575, 0.9, true, villager({ top: '#c8553d', hat: '', hair: 'bun', outfit: 'dress', hairColor: '#8a5a32' })) +
    at(660, 580, 0.75, true, person({ age: 'child', outfit: 'shirt', top: '#f2c14e', bottom: '#5b7fb0', mood: 'scared' })) +
    `<text x="510" y="330" font-size="44" font-weight="700" text-anchor="middle" fill="#7a4a6a">?</text>` +
    `<text x="620" y="360" font-size="36" font-weight="700" text-anchor="middle" fill="#7a4a6a">?</text>`),

  // 9. 抱著孩子的年輕媽媽，是他的女兒！
  '09': svg(sky() + sun(110, 90) + cloud(600, 100) + hills(380) + cottage(660, 460, 0.6, { roof: '#3d5a99' }) + tree(80, 460) +
    at(270, 570, 1.15, false, rip({ old: true, mood: 'cry', pose: 'reach' })) +
    at(500, 570, 1.15, true, daughter({ pose: 'hold', mood: 'happy' })) + at(490, 570 - 60 * 1.15, 1.1, true, babyBundle(0, 0)) +
    hearts(370, 320) + hearts(420, 380)),

  // 10. 原來一睡就睡了二十年
  '10': svg(sky('#d8e4f8', '#f4f0ff') + `<rect x="${BX}" y="420" width="${BW}" height="${H - 420}" fill="#8dc775"/>` +
    tree(80, 450, 1) + pine(730, 440, 1) +
    at(410, 540, 1.3, false, sleepingRip(true)) + zzz(330, 420) +
    at(150, 330, 1, false, `<circle r="40" fill="#ffd25e" ${L}/>`) +
    at(670, 330, 1, false, `<path d="M0 -40 V40 M-35 -20 L35 20 M-35 20 L35 -20" stroke="#9cc8f0" stroke-width="10" stroke-linecap="round"/>`) +
    at(130, 470, 1, false, `<path d="M0 0 q-30 -20 -10 -50 q30 10 10 50z" fill="#e2883d" ${L}/>`) +
    at(670, 470, 1, false, S.sparkle(0, 0, 1, '#f7a8c8') + `<circle r="10" fill="#f27d9a" ${L}/><circle r="4" fill="#f6d36b"/>`) +
    `<path d="M200 300 Q400 200 600 300" fill="none" stroke="#9a8ab8" stroke-width="5" stroke-dasharray="10 10"/><path d="M590 288 l14 14 l-20 6" fill="none" stroke="#9a8ab8" stroke-width="5"/>` +
    `<text x="400" y="270" font-size="52" font-weight="700" text-anchor="middle" fill="#5b4a8a">二十年！</text>`),

  // 11. 坐在門口，跟小朋友說山上的奇妙故事
  '11': svg(sky('#ffe0c0', '#fff4e4') + sun(660, 120, 46) + hills(380, '#a9d98f', '#8dc775') + cottage(200, 470, 0.85, { wall: '#efe0c8', roof: '#8a5a4a' }) +
    `<rect x="280" y="510" width="150" height="14" fill="#9a6b45" ${L}/><rect x="292" y="524" width="12" height="50" fill="#8a5a32"/><rect x="406" y="524" width="12" height="50" fill="#8a5a32"/>` +
    at(355, 560, 1.05, false, rip({ old: true, mood: 'happy', pose: 'up' })) +
    at(540, 580, 0.9, true, person({ age: 'child', outfit: 'shirt', top: '#f2c14e', bottom: '#5b7fb0', pose: 'up' })) +
    at(630, 580, 0.9, true, person({ age: 'child', outfit: 'dress', top: '#f7a8c8', hair: 'pigtails', hairColor: '#8a5a32', mood: 'scared' })) +
    at(720, 580, 0.9, true, person({ age: 'child', outfit: 'shirt', top: '#7cc4f2', bottom: '#6b5a3a', hair: 'curly', hairColor: '#3a2a22' })) +
    thought(520, 280, 200, 120, 420, 360, at(-40, 40, 0.45, false, dwarf({ pose: 'reach' })) + ball(10, 30, 12) + pin(50, 40, 0.7) + pin(70, 36, 0.7) + bolt(60, -50, 0.4))),
};

function speedLines(x, y) { return `<path d="M${x - 10} ${y} h-40 M${x - 6} ${y + 14} h-30" stroke="${INK}" stroke-width="3.5" stroke-linecap="round" opacity=".5"/>`; }

writeBook('rip-van-winkle', pages);
