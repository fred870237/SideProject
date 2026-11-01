// 綠野仙蹤的插畫。用法：node tools/scenes/wizard-of-oz.mjs --sheet

import * as S from './lib.mjs';
import * as U from './us-common.mjs';

const { BX, BW, BY, H, INK, line, L, SKIN, at, svg, face, sky, sun, cloud, hills, ground, tree, pine, grass, sparkle, forest, castle, room, person, hand, sweat, hearts, bird, writeBook } = S;
const { farmhouse, windmill, wheat, pup, lion, cow, thought, speed } = U;

// ---------- 角色 ----------
const bows = `<path d="M-36 -6 l-10 -8 v14z M-36 -6 l10 -8 v14z M36 -6 l-10 -8 v14z M36 -6 l10 -8 v14z" fill="#5b8fd0" ${line(2)}/>`;
// 桃樂絲：藍色洋裝、白色圍裙、咖啡色辮子；silver = 穿上銀色魔法鞋
const dorothy = ({ silver = true, ...o } = {}) =>
  person({ age: 'child', outfit: 'dress', top: '#6fa8dc', apron: '#fff', hair: 'pigtails', hairColor: '#8a5a32', hat: bows, shoes: silver ? '#c9ced8' : '#7a4a2a', ...o });
const toto = (o = {}) => pup({ c: '#3f3a44', muzzle: '#7a7480', ...o });

const straw = (x, y) => `<path d="M${x} ${y} l-8 12 M${x} ${y} l0 14 M${x} ${y} l8 12" stroke="#e8c45a" stroke-width="4" stroke-linecap="round"/>`;
const scarecrowHat = `<path d="M-26 -16 l-6 14 M-14 -22 l-4 12 M14 -22 l4 12 M26 -16 l6 14" stroke="#e8c45a" stroke-width="5" stroke-linecap="round"/>` +
  `<ellipse cx="0" cy="-24" rx="44" ry="9" fill="#7a5a3a" ${L}/><path d="M-26 -26 Q-24 -66 6 -70 Q22 -56 26 -26z" fill="#7a5a3a" ${L}/>`;
// 稻草人：草黃色的臉、綠上衣、藍褲子、手腳冒出稻草
function scarecrow({ pose = 'down', item = '', ...o } = {}) {
  const [lx, ly] = hand(pose, 'adult', 0), [rx, ry] = hand(pose, 'adult', 1);
  return person({
    outfit: 'shirt', top: '#7a9a4e', bottom: '#5b7fb0', skin: '#f3e2b0', hair: 'none', hat: scarecrowHat, shoes: '#7a5a3a', pose,
    item: `<rect x="-20" y="-80" width="16" height="14" fill="#c9a25a" ${line(2)}/>` + straw(lx, ly + 4) + straw(rx, ry + 4) + item, ...o,
  });
}
const funnel = `<ellipse cx="0" cy="-26" rx="24" ry="6" fill="#b8c0cc" ${L}/><path d="M-10 -28 L-4 -76 H4 L10 -28z" fill="#b8c0cc" ${L}/>`;
const axe = (x, y, rot = 0) => at(x, y, 1, false, `<g transform="rotate(${rot})"><path d="M0 40 V-70" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M0 40 V-70" stroke="#a8764a" stroke-width="6" stroke-linecap="round"/>` +
  `<path d="M0 -70 L30 -84 Q36 -60 30 -42 L0 -54z" fill="#dfe6ee" ${L}/></g>`);
// 錫樵夫：銀灰色、漏斗帽子、拿斧頭；rust = 生鏽
function tinman({ pose = 'down', rust = false, heart = false, axeOn = true, item = '', ...o } = {}) {
  const [rx, ry] = hand(pose, 'adult', 1);
  const spots = rust ? [[-14, -70], [12, -40], [-30, -120], [20, -150], [-16, -20]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#c97a3e" opacity=".85"/>`).join('') : '';
  return person({
    outfit: 'shirt', top: '#b8c0cc', bottom: '#a3abb8', skin: '#d3d9e2', hair: 'none', hat: funnel, shoes: '#7a828e', pose,
    item: `<circle cx="-12" cy="-74" r="3" fill="#8a929e"/><circle cx="12" cy="-74" r="3" fill="#8a929e"/>` +
      (heart ? `<path d="M0 -50 C-22 -66 -16 -86 0 -74 C16 -86 22 -66 0 -50z" fill="#e2483d" ${line(2.5)}/>` : '') +
      (axeOn ? axe(rx, ry, pose === 'raise' ? 10 : 0) : '') + spots + item, ...o,
  });
}
const glinda = (o = {}) => person({ outfit: 'dress', top: '#f7a8c8', hair: 'long', hairColor: '#f2d27a', hat: 'crown', pose: 'raise',
  item: `<path d="M40 -160 L54 -230" ${line(4)}/>` + at(56, -236, 1, false, `<path d="M0 -16 L5 -5 L16 -4 L8 4 L10 15 L0 9 L-10 15 L-8 4 L-16 -4 L-5 -5z" fill="#f6d36b" ${line(2)}/>`), ...o });
const broom = (x, y, rot = 0) => at(x, y, 1, false, `<g transform="rotate(${rot})"><path d="M0 0 V-120" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M0 0 V-120" stroke="#a8764a" stroke-width="4"/>` +
  `<path d="M-6 -4 L-18 50 H18 L6 -4z" fill="#d9b25a" ${L}/></g>`);
const witch = (o = {}) => person({ outfit: 'dress', top: '#3a3340', skin: '#a6d98a', hair: 'long', hairColor: '#2f2a33', hat: 'pointy', hatColor: '#2f2a33', mood: 'angry', pose: 'raise', shoes: '#2f2a33',
  item: broom(40, -150, 170), ...o });
const munchkin = (o = {}) => person({ age: 'child', outfit: 'tunic', top: '#5b8fd0', bottom: '#3d5a99', hat: 'pointy', hatColor: '#5b8fd0', hair: 'short', hairColor: '#8a5a32', pose: 'up', ...o });
const wizard = (o = {}) => person({ outfit: 'shirt', top: '#3f8a56', bottom: '#2f5f3f', hair: 'bald', hairColor: '#ddd', mood: 'happy', ...o,
  hat: `<path d="M-18 6 q-4 10 4 12 M18 6 q4 10 -4 12" fill="none" ${line(2)}/><path d="M-14 12 q14 -10 28 0" fill="#ddd" ${line(2)}/>` });

// ---------- 背景、道具 ----------
const brickDefs = `<defs><pattern id="brick" width="44" height="22" patternUnits="userSpaceOnUse"><rect width="44" height="22" fill="#f6d35b"/>` +
  `<path d="M0 0.5 H44 M0 11 H44 M22 0 V11 M0 11 V22 M44 11 V22" stroke="#d9a92e" stroke-width="2.5"/></pattern></defs>`;
const brickRoad = (d = `M220 ${H + 20} Q340 470 400 420 T510 320 L550 320 Q500 400 530 470 T720 ${H + 20}z`) =>
  brickDefs + `<path d="${d}" fill="url(#brick)" ${line(3)}/>`;
const rainbow = (x, y, r = 300) => ['#f27d7d', '#f6b25a', '#f6e27a', '#8fd18a', '#7cc4f2', '#a98fd8'].map((c, i) =>
  `<path d="M${x - r + i * 16} ${y} A${r - i * 16} ${r - i * 16} 0 0 1 ${x + r - i * 16} ${y}" fill="none" stroke="${c}" stroke-width="16" opacity=".75"/>`).join('');
const flower = (x, y, c = '#f27d9a', s = 1) => at(x, y, s, false, `<path d="M0 0 V-24" stroke="#5f9f4f" stroke-width="4"/>` +
  [0, 72, 144, 216, 288].map((a) => `<circle cx="${(Math.cos(a * Math.PI / 180) * 8).toFixed(1)}" cy="${(-28 + Math.sin(a * Math.PI / 180) * 8).toFixed(1)}" r="7" fill="${c}"/>`).join('') +
  `<circle cx="0" cy="-28" r="5" fill="#f6d36b"/>`);
const flowers = (pts) => pts.map(([x, y], i) => flower(x, y, ['#f27d9a', '#f6b25a', '#a98fd8', '#fff', '#e2483d'][i % 5])).join('');
const emeraldCity = (x, y, s = 1) => at(x, y, s, false,
  [[-170, 170, 50], [-100, 250, 56], [0, 330, 76], [100, 240, 56], [170, 160, 50]].map(([tx, h, w]) =>
    `<rect x="${tx - w / 2}" y="${-h}" width="${w}" height="${h}" fill="#7fd39a" ${L}/>` +
    `<path d="M${tx - w / 2 - 6} ${-h} L${tx} ${-h - w * 1.2} L${tx + w / 2 + 6} ${-h}z" fill="#2f9a5a" ${L}/>` +
    `<rect x="${tx - 8}" y="${-h + 30}" width="16" height="26" rx="8" fill="#2f7a4a"/>`).join('') +
  `<rect x="-210" y="-110" width="420" height="110" fill="#9fe0b0" ${L}/>` +
  [-190, -140, -90, -40, 10, 60, 110, 160].map((bx) => `<rect x="${bx}" y="-128" width="30" height="20" fill="#9fe0b0" ${L}/>`).join('') +
  `<path d="M-40 0 V-60 Q0 -100 40 -60 V0z" fill="#2f9a5a" ${L}/>` +
  [[-150, -60], [140, -50], [0, -200], [-90, -180], [90, -170]].map(([sx, sy]) => sparkle(sx, sy, 0.6, '#fff')).join(''));
const bucket = (x, y, rot = 0, splash = false) => at(x, y, 1, false, `<g transform="rotate(${rot})"><path d="M-18 -20 H18 L14 14 H-14z" fill="#a8b0bc" ${L}/><path d="M-18 -20 Q0 -44 18 -20" fill="none" ${line(3)}/></g>` +
  (splash ? [[30, -20, 8], [50, -6, 6], [44, -34, 7], [66, -22, 5]].map(([dx, dy, r]) => `<circle cx="${dx}" cy="${dy}" r="${r}" fill="#7cc4f2" ${line(2)}/>`).join('') : ''));
const bubble = (x, y, w, h, content) => `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="#fff" ${line(3)}/>` + at(x, y, 1, false, content);
const bigHeart = (s = 1, c = '#e2483d') => at(0, 0, s, false, `<path d="M0 22 C-40 -6 -30 -40 0 -20 C30 -40 40 -6 0 22z" fill="${c}" ${line(3)}/>`);
const brain = `<path d="M-26 6 q-10 -20 6 -28 q4 -14 20 -8 q14 -10 24 4 q16 4 10 22 q4 16 -14 18 h-34 q-16 -2 -12 -8z" fill="#f7b6c2" ${line(2.5)}/><path d="M-10 -14 q6 8 0 16 M8 -18 q-6 10 4 18" fill="none" ${line(2)}/>`;
const medal = `<path d="M-8 -30 l8 18 l8 -18" fill="none" stroke="#e2483d" stroke-width="6"/><circle cx="0" cy="0" r="16" fill="#f6d36b" ${line(2.5)}/><path d="M0 -8 l3 6 l6 1 l-5 4 l1 6 l-5 -3 l-5 3 l1 -6 l-5 -4 l6 -1z" fill="#e2a62e"/>`;
const ozFloor = (y = 400, c = '#3f9a62') => `<rect x="${BX}" y="${y}" width="${BW}" height="${H - y}" fill="${c}"/>` +
  Array.from({ length: 30 }, (_, i) => `<path d="M${-1000 + i * 100} ${y} L${-600 + i * 100 - (i - 14) * 30} ${H}" stroke="#2f7a4a" stroke-width="3"/>`).join('') +
  [0, 1, 2].map((i) => `<path d="M${BX} ${y + 40 + i * 50} H${BX + BW}" stroke="#2f7a4a" stroke-width="3"/>`).join('');
const greenHall = () => `<rect x="${BX}" y="${BY}" width="${BW}" height="${H - BY}" fill="#bfe8c8"/>` +
  Array.from({ length: 14 }, (_, i) => `<rect x="${-960 + i * 200}" y="${BY}" width="40" height="${400 - BY}" fill="#9fdcae"/>`).join('') + ozFloor();
const tornado = (x, y) => Array.from({ length: 10 }, (_, i) => {
  const w = 50 + i * i * 6.5, cy = y - i * 58, cx = x + Math.sin(i * 0.8) * 30;
  return `<ellipse cx="${cx}" cy="${cy}" rx="${w / 2}" ry="${18 + i * 2}" fill="${i % 2 ? '#8e95a2' : '#a7adb8'}" ${line(2.5)}/>` +
    `<path d="M${cx - w * 0.3} ${cy + 4} q${w * 0.3} 10 ${w * 0.6} 0" fill="none" stroke="#d6dae2" stroke-width="3" stroke-linecap="round"/>`;
}).reverse().join('');
const plank = (x, y, r) => at(x, y, 1, false, `<rect x="-24" y="-5" width="48" height="10" fill="#c9a06a" ${line(2)} transform="rotate(${r})"/>`);
const curtain = (x, y, open = true) => `<path d="M${x} ${BY} H${x + 260} V${y} Q${x + 200} ${y - 40} ${x + (open ? 120 : 200)} ${y} Q${x + 60} ${y - 30} ${x} ${y}z" fill="#3f8a56" ${L}/>` +
  [40, 90, 140, 190, 230].map((d) => `<path d="M${x + d} ${BY} V${y - 20}" stroke="#2f6f42" stroke-width="4"/>`).join('');

// ---------- 每一頁 ----------
const pages = {
  // 封面：四個好朋友和托托走在黃磚路上，遠方是翡翠城
  cover: svg(sky('#bfe8ff', '#f0fbff') + rainbow(400, 330, 330) + cloud(150, 110) + cloud(650, 90, 0.8) + hills(350, '#9fd38a', '#7fc06c') +
    emeraldCity(530, 320, 0.45) + brickRoad() +
    flowers([[60, 560], [110, 590], [740, 560], [690, 590], [160, 530]]) +
    at(150, 560, 1, false, scarecrow({ pose: 'up' })) + at(300, 560, 1.1, false, dorothy({ pose: 'up' })) +
    at(370, 580, 0.9, false, toto()) + at(520, 560, 1, true, tinman({ pose: 'raise' })) +
    at(670, 560, 1, true, lion({ mood: 'happy' })) + sparkle(420, 210, 0.8) + sparkle(640, 210, 0.6)),

  // 1. 堪薩斯大草原上的桃樂絲和托托
  '01': svg(sky('#cfe6f5', '#fff7e0') + sun(660, 100, 44) + cloud(200, 110) + wheat(400) +
    farmhouse(240, 430, 0.8, { wall: '#e8e2d6', roof: '#7a6a5a' }) + windmill(620, 430, 0.9) + U.barn(-120, 430, 0.6) +
    at(450, 560, 1.15, false, dorothy({ silver: false, pose: 'hips' })) + at(560, 570, 1.1, true, toto()) + hearts(510, 420)),

  // 2. 龍捲風把房子捲到天上
  '02': svg(sky('#8d93a0', '#c9ccd4') + `<rect x="${BX}" y="480" width="${BW}" height="${H - 480}" fill="#a6b48a"/>` +
    tornado(560, 560) +
    at(330, 400, 0.62, false, `<g transform="rotate(-18)">${farmhouse(0, 0, 1, { wall: '#e8e2d6', roof: '#7a6a5a' })}` +
      at(-70, -118, 1, false, `<circle r="16" fill="${SKIN}" ${line(2)}/><circle cx="-18" cy="4" r="6" fill="#8a5a32"/><circle cx="18" cy="4" r="6" fill="#8a5a32"/>` + face(16, 'scared')) +
      at(70, -100, 0.5, false, toto({ mood: 'scared' })) + `</g>`) +
    at(640, 300, 0.4, false, `<g transform="rotate(30)">${cow({ mood: 'scared' })}</g>`) +
    plank(180, 260, 30) + plank(720, 380, -40) + plank(470, 220, 70) +
    `<path d="M120 330 q40 -20 80 0 M600 470 q40 -20 80 0 M80 430 q40 -20 80 0" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"/>` +
    `<text x="160" y="250" font-size="44" font-weight="700" fill="#fff">呼～</text>`),

  // 3. 房子掉在奧茲國：花、彩虹、小矮人
  '03': svg(sky('#c4ecff', '#fff4fb') + rainbow(400, 380, 360) + cloud(120, 100) + cloud(680, 90, 0.8) + hills(380, '#a6e08e', '#86d070') +
    farmhouse(400, 470, 0.75, { wall: '#e8e2d6', roof: '#7a6a5a' }) +
    flowers([[60, 560], [130, 520], [200, 590], [600, 590], [680, 520], [750, 570], [300, 580], [520, 560]]) +
    at(150, 580, 0.75, false, munchkin({ beard: '#fff' })) + at(250, 590, 0.7, false, munchkin({ top: '#7cc4f2', mood: 'happy' })) +
    at(560, 590, 0.7, true, munchkin({ hair: 'pigtails', hairColor: '#f2c14e', top: '#9ccff0' })) + at(660, 580, 0.75, true, munchkin({ beard: '#ddd' })) +
    at(400, 500, 0.85, false, dorothy({ silver: false, mood: 'scared', pose: 'down' })) + sparkle(250, 260) + sparkle(560, 240, 0.7)),

  // 4. 好女巫送銀色魔法鞋，指黃磚路
  '04': svg(sky('#c4ecff', '#fff4fb') + cloud(140, 100) + hills(360, '#a6e08e', '#86d070') + brickRoad() +
    emeraldCity(560, 320, 0.3) +
    flowers([[60, 560], [120, 520], [700, 580], [760, 540]]) +
    `<circle cx="250" cy="420" r="120" fill="#ffd6ea" opacity=".45"/>` +
    at(250, 560, 1.15, false, glinda()) +
    at(470, 560, 1.15, true, dorothy({ mood: 'happy', pose: 'up' })) + at(590, 580, 0.9, true, toto()) +
    sparkle(470, 560, 0.8, '#fff') + sparkle(430, 545, 0.6, '#fff') + sparkle(340, 260, 0.9) + sparkle(160, 280, 0.6) +
    at(660, 590, 0.6, true, munchkin({ beard: '#fff' }))),

  // 5. 遇到稻草人：我想要聰明的腦袋
  '05': svg(sky() + sun(690, 90) + cloud(180, 110) + hills(360) +
    Array.from({ length: 14 }, (_, i) => `<path d="M${-200 + i * 80} 470 V330" stroke="#c9a85a" stroke-width="6"/><path d="M${-200 + i * 80} 360 q-14 -10 -20 -30 M${-200 + i * 80} 390 q14 -10 20 -30" fill="none" stroke="#7fae4e" stroke-width="6" stroke-linecap="round"/>`).join('') +
    brickRoad() + bird(110, 300, 1, '#3f3a44') +
    at(260, 570, 1.1, false, dorothy({ pose: 'point' })) + at(150, 580, 0.85, false, toto()) +
    at(560, 570, 1.15, true, scarecrow({ pose: 'up' })) +
    thought(640, 280, 130, 100, 590, 360, brain)),

  // 6. 生鏽的錫樵夫：我想要一顆心
  '06': svg(sky('#d2ebf7', '#f0faf5') + forest(420, '#5a9e5a', '#4a8a4f') + `<rect x="${BX}" y="420" width="${BW}" height="${H - 420}" fill="#8dc775"/>` +
    brickRoad(`M260 ${H + 20} Q360 500 400 460 T470 420 L520 420 Q480 470 510 510 T680 ${H + 20}z`) + tree(700, 470, 1.1) +
    at(540, 570, 1.15, true, tinman({ pose: 'raise', rust: true, mood: 'normal' })) +
    at(300, 570, 1.1, false, dorothy({ pose: 'reach', item: at(76, -58, 1, false, `<ellipse cx="0" cy="0" rx="16" ry="12" fill="#e2a62e" ${L}/><path d="M12 -6 L40 -22" ${line(4)}/>`) })) +
    at(180, 580, 0.85, false, scarecrow({ pose: 'down' })) +
    `<circle cx="452" cy="410" r="5" fill="#2f2a33"/><circle cx="460" cy="430" r="4" fill="#2f2a33"/>` +
    thought(660, 270, 120, 100, 590, 360, bigHeart(1.1))),

  // 7. 膽小的獅子：我想要勇氣！
  '07': svg(sky('#d2ebf7', '#f0faf5') + forest(400, '#5a9e5a', '#4a8a4f') + `<rect x="${BX}" y="400" width="${BW}" height="${H - 400}" fill="#8dc775"/>` +
    brickRoad(`M260 ${H + 20} Q360 500 400 440 T470 400 L520 400 Q480 460 510 510 T680 ${H + 20}z`) +
    at(110, 570, 0.95, false, scarecrow({ pose: 'down' })) + at(220, 570, 1, false, dorothy({ pose: 'reach' })) +
    at(330, 580, 0.95, false, tinman({ pose: 'down' })) + at(170, 585, 0.7, false, toto()) +
    at(580, 570, 1.25, true, lion({ mood: 'cry' })) + sweat(680, 380) + sweat(520, 400) +
    thought(560, 270, 120, 100, 560, 360, medal)),

  // 8. 走過森林、越過河流，來到閃閃發亮的翡翠城
  '08': svg(sky('#c8f0d8', '#f0fff4') + cloud(150, 90) + cloud(650, 110, 0.8) + emeraldCity(400, 400, 0.85) +
    hills(470, '#a6e08e', '#86d070') + brickRoad(`M200 ${H + 20} Q330 520 370 440 L430 440 Q470 520 600 ${H + 20}z`) +
    at(110, 580, 0.9, false, tinman({ pose: 'up' })) + at(210, 590, 0.8, false, toto()) +
    at(690, 580, 0.9, true, lion({ mood: 'happy' })) +
    at(310, 590, 0.95, false, dorothy({ pose: 'up' })) + at(510, 590, 0.95, true, scarecrow({ pose: 'up' })) +
    sparkle(150, 300) + sparkle(680, 280, 0.8) + sparkle(400, 210, 0.7)),

  // 9. 魔法師（好大的綠色頭）說：先打敗壞女巫
  '09': svg(greenHall() +
    at(400, 330, 1, false, `<circle r="130" fill="#7fe0a0" opacity=".35"/><circle r="100" fill="#8fe0a8" ${L}/>` +
      `<path d="M-60 -80 Q0 -120 60 -80" fill="none" ${line(4)}/>` + face(100, 'angry', { cheek: '#5fc080' }) +
      `<path d="M-40 50 Q0 80 40 50" fill="none" ${line(3)}/>`) +
    [[200, 380], [600, 380]].map(([x, y]) => at(x, y, 1, false, `<rect x="-20" y="0" width="40" height="80" fill="#2f7a4a" ${L}/><path d="M0 0 q-30 -40 0 -80 q30 40 0 80z" fill="#f6b25a" ${L}/><path d="M0 -6 q-12 -20 0 -40 q12 20 0 40z" fill="#f6e27a"/>`)).join('') +
    at(130, 590, 0.85, false, scarecrow({ pose: 'up', mood: 'scared' })) + at(250, 590, 0.85, false, dorothy({ mood: 'scared', pose: 'up' })) +
    at(560, 590, 0.85, true, tinman({ mood: 'scared', axeOn: false, pose: 'up' })) + at(690, 590, 0.85, true, lion({ mood: 'scared' })) +
    at(340, 595, 0.65, false, toto({ mood: 'scared' })) + sweat(720, 430) + sweat(100, 400) +
    `<text x="610" y="280" font-size="44" font-weight="700" text-anchor="middle" fill="#2f6f42">轟！</text>`),

  // 10. 潑水！壞女巫融化，只剩一灘水和帽子
  '10': svg(room({ wall: '#cfc8d8', stripe: '#c2bacd', floor: '#8a8094', window: false }) +
    `<rect x="560" y="200" width="110" height="140" rx="55" fill="#6b6170" ${L}/><path d="M615 200 V340 M560 270 H670" ${line(3)}/>` +
    at(500, 520, 1, false,
      `<path d="M-110 30 Q-130 0 -80 -8 Q-40 -26 20 -16 Q90 -26 110 6 Q130 34 60 40 Q0 50 -60 44 Q-110 46 -110 30z" fill="#7cc4c2" ${L}/>` +
      `<path d="M-60 10 q30 -10 60 0" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"/>` +
      `<ellipse cx="10" cy="0" rx="58" ry="12" fill="#2f2a33" ${L}/><path d="M-22 -2 L30 -96 L40 -2z" fill="#2f2a33" ${L}/>` +
      `<path d="M-18 -10 h50" stroke="#7a5aa0" stroke-width="6"/>`) +
    broom(680, 560, 80) +
    [[440, 360], [560, 340], [500, 320]].map(([x, y]) => `<path d="M${x} ${y} q-14 -16 0 -32 q14 -16 0 -32" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>`).join('') +
    `<text x="610" y="430" font-size="40" font-weight="700" text-anchor="middle" fill="#3f8aa0">嘶～</text>` +
    at(250, 570, 1.15, false, dorothy({ pose: 'reach', mood: 'scared', item: bucket(76, -60, -60, true) })) +
    at(110, 580, 0.85, false, toto()) + sparkle(330, 330, 0.7, '#fff')),

  // 11. 魔法師只是普通人：你們早就有聰明、愛心和勇氣
  '11': svg(greenHall() + curtain(500, 520) +
    at(620, 570, 1.05, true, wizard({ pose: 'point' })) +
    at(130, 580, 0.95, false, scarecrow({ pose: 'up', item: at(0, -200, 1, false, '') })) +
    at(290, 580, 0.95, false, tinman({ pose: 'up', heart: true, axeOn: false })) +
    at(440, 580, 0.95, false, lion({ mood: 'happy', medal: true })) +
    thought(130, 250, 90, 70, 130, 330, at(0, 4, 0.7, false, brain)) +
    sparkle(220, 300, 0.7) + sparkle(380, 330, 0.7) + sparkle(520, 330, 0.6)),

  // 12. 把鞋跟碰三下：沒有一個地方比得上家
  '12': svg(sky('#c4ecff', '#fff4fb') + rainbow(400, 400, 340) + cloud(140, 100) + hills(380, '#a6e08e', '#86d070') + emeraldCity(680, 380, 0.3) +
    flowers([[60, 560], [740, 580]]) +
    at(200, 570, 1.05, false, glinda({ mood: 'happy' })) +
    at(430, 560, 1.2, false, dorothy({ pose: 'hold', mood: 'happy' })) + at(410, 532, 0.62, false, toto()) +
    [[400, 572], [460, 572], [430, 590]].map(([x, y]) => sparkle(x, y, 0.8, '#fff')).join('') +
    `<path d="M380 590 q-20 -10 -30 -30 M480 590 q20 -10 30 -30" fill="none" stroke="#c9ced8" stroke-width="4" stroke-linecap="round"/>` +
    `<text x="540" y="460" font-size="36" font-weight="700" fill="#a98fd8">叩、叩、叩！</text>` +
    sparkle(560, 300) + sparkle(300, 260, 0.7) + at(620, 260, 0.6, false, `<path d="M-40 40 H40 V0 L0 -36 L-40 0z" fill="#fff" ${L}/>` + `<rect x="-12" y="12" width="24" height="28" fill="#8c5a3a" ${line(2)}/>`)),

  // 13. 回到堪薩斯的家，抱住家人
  '13': svg(sky('#cfe6f5', '#fff7e0') + sun(150, 100, 46) + cloud(600, 100) + wheat(400) +
    farmhouse(620, 440, 0.75, { wall: '#e8e2d6', roof: '#7a6a5a' }) + windmill(-80, 430, 0.9) +
    at(140, 570, 1.05, false, person({ outfit: 'shirt', top: '#8a6a4a', bottom: '#4a5a7a', hair: 'bald', hairColor: '#bbb', beard: '#ccc', pose: 'up' })) +
    at(300, 570, 1.15, false, dorothy({ pose: 'reach' })) +
    at(400, 570, 1.1, true, person({ outfit: 'dress', top: '#9a8ab8', apron: '#fff', hair: 'bun', hairColor: '#aaa', pose: 'reach', mood: 'cry' })) +
    at(500, 580, 0.95, true, toto()) + hearts(340, 330) + hearts(220, 360)),
};

writeBook('wizard-of-oz', pages);
