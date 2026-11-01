// 三隻小豬的插畫。用法：node tools/scenes/three-pigs.mjs --sheet
import * as S from './lib.mjs';
import { pig, mamaPig, wolf, pigHead, wind, say, steam, field } from './uk-common.mjs';

const { BX, BW, BY, H, INK, line, L, at, svg, face, sky, sun, cloud, hills, path, tree, grass, sparkle, sweat, hearts, cottage, room, forest, fence, bird, writeBook } = S;

// ---------- 房子 ----------
const strawHouse = (x, y, s = 1, peek = '') => at(x, y, s, false,
  `<path d="M-120 0 Q-132 -140 0 -190 Q132 -140 120 0z" fill="#e8cd7a" ${L}/>` +
  Array.from({ length: 9 }, (_, i) => `<path d="M${-100 + i * 25} -6 Q${-90 + i * 22} -90 ${-40 + i * 10} -170" fill="none" stroke="#c9a03a" stroke-width="3"/>`).join('') +
  `<path d="M-120 -40 Q0 -60 120 -40 M-110 -100 Q0 -126 110 -100" fill="none" stroke="#c9a03a" stroke-width="4"/>` +
  `<path d="M-10 -186 q-6 -24 4 -30 M6 -188 q8 -20 18 -22" fill="none" stroke="#c9a03a" stroke-width="5" stroke-linecap="round"/>` +
  `<path d="M-30 0 V-70 Q0 -96 30 -70 V0z" fill="#a67f3f" ${L}/>` +
  `<circle cx="70" cy="-90" r="24" fill="#bfe4ff" ${L}/>` + peek);

const woodHouse = (x, y, s = 1, peek = '') => at(x, y, s, false,
  `<rect x="-110" y="-130" width="220" height="130" fill="#c98a4a" ${L}/>` +
  [1, 2, 3, 4, 5, 6, 7].map((i) => `<path d="M-110 ${-i * 16.25} H110" stroke="#9a6440" stroke-width="3"/>`).join('') +
  `<path d="M-135 -125 L0 -230 L135 -125z" fill="#9a6440" ${L}/>` +
  [-1, 0, 1].map((d) => `<path d="M${d * 40} -150 L${d * 20} -205" stroke="#7a4a2a" stroke-width="3"/>`).join('') +
  `<rect x="-25" y="-80" width="50" height="80" fill="#7a4a2a" ${L}/><circle cx="14" cy="-40" r="4" fill="#f6d36b"/>` +
  `<rect x="46" y="-104" width="46" height="44" fill="#bfe4ff" ${L}/>` + peek + `<path d="M69 -104 v44 M46 -82 h46" ${line(2)}/>`);

const bricks = (x0, y0, w, h, rows) => {
  let out = '';
  const rh = h / rows;
  for (let r = 1; r < rows; r++) out += `<path d="M${x0} ${y0 + r * rh} h${w}" stroke="#b5452f" stroke-width="2.5"/>`;
  for (let r = 0; r < rows; r++) for (let bx = x0 + (r % 2 ? 18 : 36); bx < x0 + w; bx += 36) out += `<path d="M${bx} ${y0 + r * rh} v${rh}" stroke="#b5452f" stroke-width="2.5"/>`;
  return out;
};
const brickHouse = (x, y, s = 1, { partial = false, peek = '', smoke = false } = {}) => at(x, y, s, false,
  partial
    ? `<rect x="-40" y="-102" width="72" height="34" fill="#d9654b" ${L}/>` + bricks(-40, -102, 72, 34, 2) +
      `<rect x="-110" y="-68" width="220" height="68" fill="#d9654b" ${L}/>` + bricks(-110, -68, 220, 68, 4)
    : (smoke ? `<path d="M77 -250 q-20 -30 6 -50 q26 -20 0 -50" fill="none" stroke="#e8e8e8" stroke-width="12" stroke-linecap="round" opacity=".8"/>` : '') +
      `<rect x="60" y="-240" width="40" height="90" fill="#d9654b" ${L}/>` + bricks(60, -240, 40, 90, 5) + `<rect x="54" y="-250" width="52" height="14" fill="#b5452f" ${L}/>` +
      `<rect x="-110" y="-130" width="220" height="130" fill="#d9654b" ${L}/>` + bricks(-110, -130, 220, 130, 8) +
      `<path d="M-135 -125 L0 -230 L135 -125z" fill="#6f7480" ${L}/>` +
      `<path d="M-25 0 V-80 Q0 -100 25 -80 V0z" fill="#5a7a4a" ${L}/><circle cx="14" cy="-40" r="4" fill="#f6d36b"/>` +
      `<rect x="-92" y="-104" width="46" height="44" fill="#bfe4ff" ${L}/>` + peek + `<path d="M-69 -104 v44 M-92 -82 h46" ${line(2)}/>` +
      `<rect x="46" y="-104" width="46" height="44" fill="#bfe4ff" ${L}/><path d="M69 -104 v44 M46 -82 h46" ${line(2)}/>`);

// 窗戶裡探頭的小豬（只畫頭），座標是房子裡的位置
const pigPeek = (x, y, n, mood = 'happy', s = 0.6) => at(x, y, s, false,
  `<circle r="30" fill="#f7b6c2" ${L}/>` + face(30, mood === 'sleep' ? 'normal' : mood) + pigHead(mood, ''));

// 磚頭（拿在手上）
const brickStack = (x, y, n = 3) => Array.from({ length: n }, (_, i) =>
  `<rect x="${x - 26}" y="${y - (i + 1) * 16}" width="52" height="16" fill="#d9654b" ${line(2.5)}/>`).join('');
const hammer = (x, y) => `<path d="M${x} ${y + 10} L${x + 6} ${y - 50}" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M${x} ${y + 10} L${x + 6} ${y - 50}" stroke="#b5884a" stroke-width="5" stroke-linecap="round"/><rect x="${x - 12}" y="${y - 64}" width="36" height="18" rx="3" fill="#8a8a96" ${L}/>`;
const strawBits = (x, y, n = 10, spread = 160) => Array.from({ length: n }, (_, i) => {
  const dx = ((i * 73) % spread) - spread / 2, dy = ((i * 47) % 120) - 60, r = (i * 37) % 180;
  return `<path d="M${x + dx - 14} ${y + dy} h28" stroke="#c9a03a" stroke-width="5" stroke-linecap="round" transform="rotate(${r} ${x + dx} ${y + dy})"/>`;
}).join('');
const planks = (x, y, n = 6, spread = 200) => Array.from({ length: n }, (_, i) => {
  const dx = ((i * 83) % spread) - spread / 2, dy = ((i * 53) % 140) - 70, r = (i * 41) % 180;
  return `<rect x="${x + dx - 34}" y="${y + dy - 7}" width="68" height="14" fill="#c98a4a" ${line(2.5)} transform="rotate(${r} ${x + dx} ${y + dy})"/>`;
}).join('');
const lie = (x, y, s, body) => `<g transform="translate(${x} ${y}) scale(${s}) rotate(-90) translate(36 0)">${body}</g>`;
const zzz = (x, y) => [0, 1, 2].map((i) => `<text x="${x + i * 22}" y="${y - i * 24}" font-size="${22 + i * 6}" font-weight="900" fill="#5b8fd0" font-family="sans-serif">z</text>`).join('');

// 壁爐和大鍋
const fireplace = (x, y, { hot = true } = {}) => at(x, y, 1, false,
  `<rect x="-150" y="-260" width="300" height="260" fill="#b8aca0" ${L}/>` +
  Array.from({ length: 6 }, (_, r) => `<path d="M-150 ${-r * 43} h300" stroke="#9a8e82" stroke-width="2.5"/>`).join('') +
  `<rect x="-170" y="-278" width="340" height="24" fill="#8c6a4a" ${L}/>` +
  `<path d="M-100 0 V-150 Q0 -210 100 -150 V0z" fill="#3a2a22" ${L}/>` +
  `<path d="M-60 0 q-10 -50 20 -70 q0 30 20 40 q10 -50 30 -60 q10 40 30 50 q14 -20 10 -40 q30 40 10 80z" fill="#ff9a3c"/>` +
  `<path d="M-30 0 q0 -30 20 -40 q6 20 16 26 q10 -20 20 -24 q10 30 -6 38z" fill="#ffd25e"/>` +
  `<path d="M-60 -6 h120" stroke="#6b4a2f" stroke-width="12" stroke-linecap="round"/>` +
  `<path d="M0 -190 V-140" ${line(4)}/>` +
  `<path d="M-70 -120 Q-74 -50 0 -46 Q74 -50 70 -120z" fill="#4a4a56" ${L}/>` +
  `<ellipse cx="0" cy="-120" rx="70" ry="14" fill="#8fd0ff" ${L}/>` +
  `<path d="M-70 -120 Q0 -170 70 -120" fill="none" ${line(3)}/>` +
  (hot ? `<circle cx="-30" cy="-122" r="6" fill="#fff" opacity=".8"/><circle cx="20" cy="-118" r="5" fill="#fff" opacity=".8"/>` : ''));

const bg = () => sky() + sun(690, 90) + cloud(160, 100) + cloud(470, 70, 0.7) + hills(380);

const pages = {
  // 封面：三隻小豬站在磚頭屋前，大野狼躲在樹後偷看
  cover: svg(sky('#bfe4ff', '#f2fbff') + sun(680, 90, 46) + cloud(170, 110) + hills(390, '#a9d98f', '#8dc775') +
    brickHouse(560, 470, 0.95) + tree(110, 470, 1.3) +
    at(70, 520, 0.8, false, wolf({ mood: 'normal', pose: 'hips' })) + tree(150, 500, 0.9) +
    at(300, 560, 1, false, pig({ n: 1, pose: 'up' })) + at(410, 570, 1, false, pig({ n: 2, pose: 'raise' })) + at(520, 580, 1, false, pig({ n: 3, pose: 'hips' })) +
    sparkle(250, 240, 0.8) + sparkle(640, 250, 0.6) + grass(700, 570) + grass(200, 585)),

  // 1. 豬媽媽要三隻小豬出去蓋房子
  '01': svg(bg() + cottage(170, 450, 0.85, { wall: '#f7e0e6', roof: '#e889a8' }) + path() +
    at(320, 560, 1.05, false, mamaPig({ pose: 'point' })) +
    at(500, 560, 0.95, true, pig({ n: 1, pose: 'up' })) + at(600, 570, 0.95, true, pig({ n: 2, pose: 'raise' })) + at(700, 580, 0.95, true, pig({ n: 3, pose: 'down' })) +
    hearts(420, 380) + grass(90, 570) + grass(760, 560)),

  // 2. 豬大哥用稻草蓋房子，躺下來睡大覺
  '02': svg(bg() + strawHouse(330, 480, 1) + tree(680, 460) +
    `<ellipse cx="560" cy="545" rx="110" ry="22" fill="#e8cd7a" ${L}/>` + `<ellipse cx="470" cy="525" rx="34" ry="16" fill="#fff8e6" ${L}/>` +
    lie(640, 540, 0.9, pig({ n: 1, mood: 'sleep', pose: 'hips' })) + zzz(560, 420) +
    grass(100, 560) + grass(740, 580) + bird(640, 300, 1.1)),

  // 3. 豬二哥用木頭蓋房子，敲敲打打
  '03': svg(bg() + woodHouse(280, 480, 1) + tree(730, 450, 0.9) +
    [0, 1, 2].map((i) => `<rect x="${560 + i * 6}" y="${540 - i * 14}" width="120" height="14" fill="#c98a4a" ${line(2.5)}/>`).join('') +
    at(520, 560, 1.05, false, pig({ n: 2, pose: 'raise', item: hammer(40, -160) })) +
    say(640, 340, '叩叩叩！', 34, '#9a6440') + grass(90, 570) + grass(740, 580)),

  // 4. 豬小弟搬磚頭，一塊一塊蓋
  '04': svg(bg() + brickHouse(270, 480, 1, { partial: true }) + tree(700, 450, 0.9) +
    brickStack(470, 560, 2) + brickStack(530, 560, 3) +
    at(620, 570, 1.05, true, pig({ n: 3, mood: 'normal', pose: 'hold', item: brickStack(14, -36, 2) })) +
    sweat(570, 400) + sweat(680, 410) + sun(690, 90) + grass(90, 570)),

  // 5. 大野狼來敲稻草屋
  '05': svg(sky() + cloud(160, 100) + hills(380) + strawHouse(470, 490, 1.05, pigPeek(70, -90, 1, 'scared', 0.66)) +
    tree(100, 470, 1.1) +
    at(260, 570, 1.1, false, wolf({ mood: 'normal', pose: 'reach' })) +
    say(380, 330, '叩叩！', 34, '#9a6440') + grass(720, 570)),

  // 6. 呼——稻草屋被吹倒，豬大哥逃走
  '06': svg(sky() + cloud(600, 100) + hills(380) +
    `<ellipse cx="560" cy="530" rx="140" ry="30" fill="#e8cd7a" ${L}/>` + strawBits(560, 380, 18, 280) +
    at(200, 570, 1.1, false, wolf({ mood: 'blow', pose: 'hips' })) + wind(300, 420, 1.2) +
    at(700, 570, 0.9, false, pig({ n: 1, mood: 'scared', pose: 'up', hat: false })) +
    at(690, 300, 0.9, false, `<path d="M-46 -18 Q0 -34 46 -18 Q0 -10 -46 -18z" fill="#e8cd7a" ${L}/><path d="M-24 -20 Q-22 -48 0 -48 Q22 -48 24 -20z" fill="#e8cd7a" ${L}/>`) +
    say(420, 300, '呼——', 44, '#5b8fd0') + sweat(650, 400)),

  // 7. 木頭屋也被吹倒，兩隻小豬逃走
  '07': svg(sky() + cloud(150, 90) + hills(380) +
    `<path d="M440 540 L520 500 L600 530 L680 490 L720 540z" fill="#9a6440" ${L}/>` + planks(590, 390, 7, 300) +
    at(190, 570, 1.1, false, wolf({ mood: 'blow', pose: 'hips' })) + wind(290, 420, 1.2) +
    at(640, 580, 0.85, false, pig({ n: 2, mood: 'scared', pose: 'up' })) + at(730, 570, 0.85, false, pig({ n: 1, mood: 'scared', pose: 'up' })) +
    say(420, 300, '呼——呼——呼！', 40, '#5b8fd0')),

  // 8. 拚命吹磚頭屋，臉都紅了，房子動也不動
  '08': svg(bg() + brickHouse(560, 500, 1.05, { peek: pigPeek(-69, -78, 3, 'happy', 0.6) }) +
    at(200, 570, 1.15, false, wolf({ mood: 'blow', pose: 'hips', item: '' })) +
    at(200, 570, 1.15, false, `<g transform="translate(0 -128)"><circle r="31" fill="#f07a6a" opacity=".45"/></g>`) +
    wind(300, 430, 0.9) + sweat(150, 380) + sweat(260, 370) +
    say(450, 300, '呼——！', 40, '#5b8fd0')),

  // 9. 爬上屋頂，想從煙囪溜進去
  '09': svg(sky('#a9c4e8', '#e6f0ff') + cloud(160, 90) + `<circle cx="680" cy="100" r="40" fill="#fff1b8"/>` + hills(400) +
    brickHouse(420, 590, 1.45) +
    `<path d="M120 600 L160 380 M200 600 L240 380 M150 540 H220 M140 480 H230 M130 420 H235" ${line(5)}/>` +
    at(445, 400, 0.72, false, `<g transform="rotate(-20)">${wolf({ mood: 'normal', pose: 'raise' })}</g>`) +
    sparkle(250, 230, 0.6) + say(660, 300, '嘿嘿…', 32, INK)),

  // 10. 豬小弟在壁爐上煮了一大鍋熱水
  '10': svg(room({ window: false }) + fireplace(400, 440) + steam(400, 300, 0.9) +
    at(170, 570, 1, false, pig({ n: 3, pose: 'point' })) +
    at(620, 570, 0.95, true, pig({ n: 1, mood: 'normal' })) + at(720, 580, 0.95, true, pig({ n: 2, mood: 'normal', pose: 'hold' }))),

  // 11. 撲通！燙得跳起來，從煙囪逃走
  '11': svg(room({ window: false }) + fireplace(400, 440) + steam(400, 330, 0.8) +
    `<path d="M440 300 q60 -40 100 -10 M450 330 q60 -30 110 0" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-dasharray="14 12"/>` +
    `<path d="M340 320 q-20 -30 0 -40 M460 320 q20 -30 0 -40" fill="none" stroke="#8fd0ff" stroke-width="8" stroke-linecap="round"/>` +
    at(590, 430, 0.95, false, `<g transform="rotate(14)">` + wolf({ mood: 'ouch', pose: 'up' }) +
      `<ellipse cx="0" cy="-40" rx="34" ry="14" fill="#ff7a6a" opacity=".55"/>` + steam(-20, -10, 0.5) + steam(20, -10, 0.5) + `</g>`) +
    say(190, 260, '燙燙燙！', 44, '#e2483d') + say(400, 250, '撲通！', 36, '#2f6f9f') +
    at(110, 590, 0.85, false, pig({ n: 1, mood: 'happy', pose: 'up' })) +
    at(250, 590, 0.85, false, pig({ n: 2, mood: 'scared', pose: 'up' })) + at(720, 590, 0.85, true, pig({ n: 3, mood: 'happy', pose: 'hips' }))),

  // 12. 三隻小豬開心地住在磚頭屋裡
  '12': svg(sky('#ffd9c9', '#fff2e6') + sun(400, 120, 56) + cloud(150, 100) + cloud(650, 110, 0.8) + hills(400, '#a9d98f', '#8dc775') +
    brickHouse(400, 470, 0.9, { smoke: true }) + fence(BX + 900, 500, 280) + fence(560, 500, 340) +
    at(240, 570, 1, false, pig({ n: 1, pose: 'up' })) + at(400, 580, 1, false, pig({ n: 3, pose: 'up' })) + at(560, 570, 1, true, pig({ n: 2, pose: 'up' })) +
    hearts(310, 380) + hearts(480, 370) + sparkle(180, 260, 0.7) + sparkle(640, 250, 0.8)),
};

writeBook('three-pigs', pages);
