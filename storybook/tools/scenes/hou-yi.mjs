// 后羿射日的插畫。用法：node tools/scenes/hou-yi.mjs --sheet

import * as S from './lib.mjs';
import { figure, headband, karst, willow, bang } from './cn-common.mjs';

const { BX, BW, H, INK, L, line, at, svg, face, sky, cloud, hills, sparkle, sweat, hearts, grass, writeBook } = S;

// ---------- 太陽 ----------
// 有表情的小太陽；mood 多了 dizzy（被射中、頭暈）、sleep（睡覺）
function sunFace(x, y, r = 34, mood = 'happy', { hot = false } = {}) {
  const rays = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6, a1 = a - 0.16, a2 = a + 0.16, r1 = r + 4, r2 = r + (i % 2 ? 14 : 22);
    return `${i ? '' : ''}M${(Math.cos(a1) * r1).toFixed(1)} ${(Math.sin(a1) * r1).toFixed(1)} L${(Math.cos(a) * r2).toFixed(1)} ${(Math.sin(a) * r2).toFixed(1)} L${(Math.cos(a2) * r1).toFixed(1)} ${(Math.sin(a2) * r1).toFixed(1)}z`;
  }).join(' ');
  let f;
  if (mood === 'dizzy') {
    const ex = r * 0.38;
    f = [-1, 1].map((d) => `<path d="M${d * ex - 6} -8 l12 12 M${d * ex + 6} -8 l-12 12" ${line(3)}/>`).join('') +
      `<ellipse cx="0" cy="${r * 0.42}" rx="6" ry="5" fill="#c94f4f" ${line(2.5)}/>`;
  } else if (mood === 'sleep') {
    const ex = r * 0.38;
    f = [-1, 1].map((d) => `<path d="M${d * ex - 6} -2 q6 5 12 0" fill="none" ${line(3)}/>`).join('') +
      `<path d="M-5 ${r * 0.38} h10" ${line(2.5)}/>`;
  } else if (mood === 'tongue') {
    const ex = r * 0.38;
    f = [-1, 1].map((d) => `<path d="M${d * ex - 6} 2 q6 -8 12 0" fill="none" ${line(3)}/>`).join('') +
      `<path d="M-9 ${r * 0.32} q9 6 18 0" fill="none" ${line(2.5)}/><path d="M-5 ${r * 0.36} q5 14 10 0" fill="#f27d7d" ${line(2)}/>`;
  } else f = face(r, mood, { cheek: '#ff8a5a' });
  return at(x, y, 1, false,
    (hot ? `<circle r="${r + 30}" fill="#ffb347" opacity=".35"/>` : `<circle r="${r + 22}" fill="#ffe9a6" opacity=".5"/>`) +
    `<path d="${rays}" fill="#ffb347" ${line(2)}/>` +
    `<circle r="${r}" fill="#ffd25e" ${L}/>` + f);
}

// ---------- 角色 ----------
const HY = { hair: 'topknot', hairColor: '#2f2a2a', hat: headband(), outfit: 'tunic', top: '#3f7f6a', bottom: '#6b4a2f', beard: '' };
const houyi = (o = {}, arms) => figure({ ...HY, ...o }, arms);

// 大弓：拿在手上（hx, hy），朝右上方 45 度瞄準
const bowAim = () => {
  const string = `<path d="M128 -100 L40 -112 L30 -200" fill="none" stroke="#f6e6c0" stroke-width="2.5"/>`;
  return `<path d="M128 -100 Q116 -186 30 -200" fill="none" stroke="${INK}" stroke-width="11" stroke-linecap="round"/>` +
    `<path d="M128 -100 Q116 -186 30 -200" fill="none" stroke="#a0522d" stroke-width="6" stroke-linecap="round"/>` + string;
};
// 瞄準的姿勢：前手握弓、後手拉弦
const aimArms = [[-26, -88, 40, -112], [26, -88, 94, -162]];
const arrow = (x1, y1, x2, y2) =>
  `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="#d9b27c" stroke-width="3" stroke-linecap="round"/>` +
  at(x2, y2, 1, false, `<path d="M0 0 l-14 -4 l4 10z" fill="#b8c2cc" ${line(2)} transform="rotate(${(Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI + 45})"/>`);
const aimArrow = arrow(42, -114, 124, -196);
// 拿著弓站著（弓直立在身體右邊）
const bowHold = `<path d="M44 -150 Q86 -90 44 -30" fill="none" stroke="${INK}" stroke-width="11" stroke-linecap="round"/><path d="M44 -150 Q86 -90 44 -30" fill="none" stroke="#a0522d" stroke-width="6" stroke-linecap="round"/><path d="M44 -150 V-30" stroke="#f6e6c0" stroke-width="2.5"/>`;
const quiver = `<path d="M-30 -120 L-46 -40" stroke="${INK}" stroke-width="20" stroke-linecap="round"/><path d="M-30 -120 L-46 -40" stroke="#c9782a" stroke-width="14" stroke-linecap="round"/>` +
  [-6, 0, 6].map((d) => `<path d="M${-30 + d} -120 l${d} -26" ${line(3)}/>`).join('');

// 農夫：斗笠、短袍
const farmer = (i = 0, o = {}, arms) => figure({ hat: 'straw', hair: 'short', outfit: 'tunic', top: ['#5b8fd0', '#d97a9a', '#9a6fc0', '#e8a23b'][i % 4], bottom: '#5a4632', ...o }, arms);
const kid = (i = 0, o = {}) => figure({ age: 'child', hair: i % 2 ? 'bun' : 'topknot', top: ['#f29b4b', '#6cae6a'][i % 2], bottom: '#8a5a32', ...o });

// ---------- 背景 ----------
// 稻田（綠色或枯黃）
const paddy = (y, c = '#8fcf6a', stalk = '#5f9f4f') =>
  `<rect x="${BX}" y="${y}" width="${BW}" height="${H - y}" fill="${c}"/>` +
  Array.from({ length: 4 }, (_, r) => Array.from({ length: 34 }, (_, i) => {
    const x = -260 + i * 40 + (r % 2) * 20, yy = y + 30 + r * 40;
    return `<path d="M${x} ${yy} l-6 -16 M${x} ${yy} l0 -20 M${x} ${yy} l6 -16" stroke="${stalk}" stroke-width="3" stroke-linecap="round"/>`;
  }).join('')).join('');
// 乾裂的大地
const cracked = (y) =>
  `<rect x="${BX}" y="${y}" width="${BW}" height="${H - y}" fill="#d9a86a"/>` +
  Array.from({ length: 26 }, (_, i) => {
    const x = -300 + i * 60 + (i % 3) * 13, yy = y + 30 + ((i * 47) % (H - y - 40));
    return `<path d="M${x} ${yy} l14 8 l-6 14 l18 6 M${x + 14} ${yy + 8} l16 -6" fill="none" stroke="#a87a48" stroke-width="3" stroke-linecap="round"/>`;
  }).join('');
const deadPlant = (x, y) => at(x, y, 1, false, `<path d="M0 0 V-40 q-14 -10 -20 6 M0 -24 q14 -12 22 0" fill="none" stroke="#8a6a3a" stroke-width="4" stroke-linecap="round"/>`);
// 扶桑樹：九個太陽在樹上睡覺
const fusang = (x, y, s = 1, suns = []) => at(x, y, s, false,
  `<path d="M-20 0 Q-10 -120 -30 -200 M-24 -150 Q-90 -170 -120 -220 M-18 -170 Q60 -200 100 -250" fill="none" stroke="${INK}" stroke-width="30" stroke-linecap="round"/>` +
  `<path d="M-20 0 Q-10 -120 -30 -200 M-24 -150 Q-90 -170 -120 -220 M-18 -170 Q60 -200 100 -250" fill="none" stroke="#8a5a3a" stroke-width="22" stroke-linecap="round"/>` +
  `<ellipse cx="-10" cy="-250" rx="160" ry="80" fill="#6cbd62" ${L}/>`);

// 高山（后羿爬上去的山頂）
const peak = (x, y, w = 360) => `<path d="M${x - w / 2} ${H} L${x - w / 4} ${y + 40} Q${x} ${y - 10} ${x + w / 4} ${y + 30} L${x + w / 2} ${H}z" fill="#8a7a6a" ${L}/>` +
  `<path d="M${x - w / 4 + 20} ${y + 50} q30 -20 60 0" fill="none" stroke="#a89888" stroke-width="5" stroke-linecap="round"/>`;

const tenSuns = (pts, mood = 'happy', hot = false) => pts.map(([x, y, r, m]) => sunFace(x, y, r, m || mood, { hot })).join('');

// ---------- 每一頁 ----------
const pages = {
  // 封面：后羿站在山頂拉弓，天上好幾個太陽
  cover: svg(sky('#ffb36b', '#ffe6b0') + karst(120, 470, 220, 200, '#c9a27a') + karst(700, 470, 200, 170, '#c9a27a') +
    tenSuns([[560, 120, 30, 'scared'], [700, 210, 28, 'scared'], [440, 70, 26, 'tongue'], [650, 60, 24, 'happy'], [180, 90, 24, 'tongue']]) +
    sunFace(560, 250, 34, 'dizzy') + bang(560, 250, 0.9, '#fff3c0', '#fff') +
    peak(300, 420, 460) +
    at(300, 470, 1.15, false, houyi({ mood: 'angry', item: bowAim() + aimArrow }, aimArms)) +
    arrow(420, 360, 500, 290)),

  // 1. 十個太陽住在扶桑樹上，每天輪流出來
  '01': svg(sky('#bfe4ff', '#fff2d6') + cloud(500, 90, 0.8) + hills(420, '#a9d98f', '#8dc775') +
    fusang(560, 560, 1.1) +
    tenSuns([[430, 270, 22], [490, 245, 22], [550, 262, 22], [610, 240, 22], [670, 262, 22], [720, 285, 22], [460, 315, 22], [580, 300, 22], [650, 315, 22]], 'sleep') +
    sunFace(200, 260, 46, 'happy') + sparkle(300, 220, 0.7)),

  // 2. 大地暖暖的，稻子長得好
  '02': svg(sky() + sunFace(620, 150, 46, 'happy') + cloud(180, 100) + karst(80, 380, 240, 200, '#9fc8b0') + karst(260, 380, 200, 150, '#8fbfa8') +
    paddy(380) + willow(700, 420, 0.9) +
    at(230, 560, 1, false, farmer(0, { pose: 'raise' })) + at(400, 560, 0.9, false, kid(0, { pose: 'up' })) + at(520, 560, 1, true, farmer(1, { pose: 'hold' })) +
    hearts(440, 360)),

  // 3. 十個太陽一起跑到天上玩
  '03': svg(sky('#ffd27a', '#fff2c6') + hills(440, '#c9d98a', '#b5c76c') +
    tenSuns([[100, 120, 30], [230, 210, 28, 'tongue'], [360, 110, 30], [480, 230, 30], [610, 120, 30, 'tongue'], [720, 240, 28], [170, 330, 26, 'tongue'], [330, 320, 26], [560, 340, 26], [690, 360, 26, 'tongue']]) +
    sparkle(420, 300, 0.6) + sparkle(280, 260, 0.5)),

  // 4. 好熱好熱，河水乾了、作物枯了
  '04': svg(sky('#ff9a5a', '#ffd08a') +
    tenSuns([[90, 90, 24], [220, 140, 22], [360, 80, 24], [500, 140, 22], [640, 90, 24], [740, 160, 20], [150, 200, 20], [300, 210, 20], [580, 210, 20], [700, 230, 20]], 'tongue', true) +
    cracked(380) + `<path d="M${BX} 470 Q200 440 400 480 T${BX + BW} 470 V500 Q600 520 400 508 T${BX} 500z" fill="#c4935a"/>` +
    deadPlant(80, 420) + deadPlant(700, 430) + deadPlant(620, 560) + deadPlant(120, 580) +
    at(260, 570, 1, false, farmer(2, { mood: 'cry', pose: 'up' })) + sweat(220, 370) + sweat(310, 360) +
    at(450, 570, 0.9, true, kid(1, { mood: 'cry' })) + sweat(480, 400) +
    at(580, 570, 1, true, farmer(3, { mood: 'scared', pose: 'hips' })) + sweat(620, 380)),

  // 5. 英雄后羿：力氣大、射箭準
  '05': svg(sky() + cloud(160, 100) + sunFace(660, 120, 30, 'tongue') + karst(120, 400, 260, 200, '#9fc8b0') + karst(700, 400, 240, 170, '#8fbfa8') + hills(420, '#c9d98a', '#b5c76c') +
    at(400, 570, 1.3, false, houyi({ mood: 'happy', pose: 'hips', item: quiver + bowHold })) +
    at(170, 570, 0.9, false, farmer(0, { pose: 'up' })) + at(620, 570, 0.9, true, kid(0, { pose: 'up' })) + at(720, 570, 0.95, true, farmer(1, { pose: 'up' })) +
    sparkle(520, 300, 0.9) + sparkle(280, 320, 0.7)),

  // 6. 后羿勸太陽們，太陽們都不聽
  '06': svg(sky('#ffd27a', '#fff2c6') +
    tenSuns([[460, 230, 30, 'tongue'], [580, 260, 30, 'tongue'], [700, 220, 28], [520, 120, 26, 'tongue'], [650, 110, 26], [400, 110, 24]]) +
    hills(440, '#c9d98a', '#b5c76c') +
    at(220, 570, 1.25, false, houyi({ mood: 'normal', pose: 'point', item: quiver })) +
    sweat(300, 360)),

  // 7. 爬上高山，拉弓射下一個太陽
  '07': svg(sky('#ffb36b', '#ffe6b0') + karst(650, 480, 260, 180, '#c9a27a') +
    tenSuns([[700, 110, 26, 'scared'], [600, 70, 24, 'scared'], [740, 230, 24, 'scared'], [460, 80, 24, 'tongue']]) +
    sunFace(560, 240, 34, 'dizzy') + bang(560, 240, 0.9, '#fff3c0', '#fff') +
    peak(260, 430, 460) +
    at(250, 480, 1.15, false, houyi({ mood: 'angry', item: bowAim() + aimArrow }, aimArms)) +
    arrow(400, 340, 500, 280) +
    `<text x="580" y="420" font-size="46" font-weight="700" fill="#c0563a" text-anchor="middle">咻——</text>`),

  // 8. 咻！咻！咻！太陽一個個掉下來，大地慢慢涼快
  '08': svg(sky('#ffd9a8', '#eaf6ff') + karst(660, 470, 240, 160, '#a8c4a0') +
    sunFace(520, 220, 26, 'dizzy') + sunFace(640, 280, 24, 'dizzy') + sunFace(720, 200, 24, 'dizzy') + sunFace(600, 110, 28, 'scared') +
    [[520, 220], [640, 280], [720, 200]].map(([x, y]) => `<path d="M${x - 10} ${y - 40} q-10 -40 4 -70 M${x + 10} ${y - 40} q10 -40 -4 -70" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>` + sparkle(x + 34, y - 20, 0.5, '#fff')).join('') +
    peak(250, 430, 460) +
    at(240, 480, 1.15, false, houyi({ mood: 'angry', item: bowAim() + aimArrow }, aimArms)) +
    arrow(400, 340, 470, 280) + arrow(430, 380, 590, 300) +
    `<text x="660" y="400" font-size="40" font-weight="700" fill="#c0563a" text-anchor="middle">咻！咻！</text>`),

  // 9. 大家喊：留下一個吧！
  '09': svg(sky('#cfe6ff', '#fff2e0') + sunFace(560, 230, 38, 'scared') + sweat(610, 190) + hills(420, '#b9d98a', '#9fc76c') +
    at(180, 570, 1.15, false, houyi({ mood: 'normal', item: quiver + bowHold })) +
    at(380, 570, 1, true, farmer(0, { pose: 'hold' })) + at(500, 570, 0.85, true, kid(1, { pose: 'hold' })) +
    at(620, 570, 1, true, farmer(1, { pose: 'hold' })) + at(720, 570, 1, true, farmer(3, { pose: 'hold' }))),

  // 10. 放下弓，留下最後一個太陽，東升西落
  '10': svg(sky('#ffcf9a', '#fff2e0') + karst(160, 420, 240, 150, '#9fc8b0') + karst(640, 420, 260, 170, '#8fbfa8') +
    `<path d="M120 300 Q400 120 680 300" fill="none" stroke="#ffb347" stroke-width="5" stroke-dasharray="4 16" stroke-linecap="round"/>` +
    sunFace(400, 250, 46, 'happy') + hills(440, '#b9d98a', '#9fc76c') +
    at(300, 570, 1.2, false, houyi({ mood: 'happy', pose: 'down', item: `<g transform="translate(0 34) scale(-1 1)">${bowHold}</g>` })) +
    hearts(480, 380) + sparkle(560, 380, 0.7)),

  // 11. 稻子又綠了，大家感謝后羿
  '11': svg(sky() + sunFace(640, 130, 42, 'happy') + cloud(160, 100) + karst(100, 380, 240, 180, '#9fc8b0') + karst(720, 380, 220, 150, '#8fbfa8') +
    paddy(400) +
    at(400, 570, 1.2, false, houyi({ mood: 'happy', pose: 'up' })) +
    at(200, 570, 1, false, farmer(0, { pose: 'up' })) + at(290, 570, 0.85, false, kid(0, { pose: 'up' })) +
    at(530, 570, 0.85, true, kid(1, { pose: 'up' })) + at(630, 570, 1, true, farmer(1, { pose: 'up' })) +
    sparkle(400, 260) + sparkle(300, 300, 0.7) + sparkle(520, 290, 0.7) + hearts(460, 330)),
};

writeBook('hou-yi', pages);
