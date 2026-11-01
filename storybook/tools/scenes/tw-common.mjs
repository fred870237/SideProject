// 台灣故事共用：三合院、稻田、竹林、大樹、屋內、紅眠床、水牛、雞、火、老虎、龍……
// 只給台灣地區的書（hu-gu-po、bai-zei-qi、snake-lord、good-nose、sun-moon-lake）使用。

import * as S from './lib.mjs';

const { W, H, BX, BW, BY, INK, line, L, SKIN, at, face } = S;

// ---------- 建築 ----------
const BRICK = '#c8553d', BRICK_D = '#a9442f', ROOF = '#b84a32', ROOF_D = '#963a26';

// 紅磚花紋（重複定義同一個 id 沒關係，內容一樣）
export const brickDefs = (id = 'twbrick', c = BRICK, d = BRICK_D) =>
  `<defs><pattern id="${id}" width="28" height="16" patternUnits="userSpaceOnUse">` +
  `<rect width="28" height="16" fill="${c}"/><path d="M0 .5 H28 M0 8.5 H28 M.5 0 V8 M14.5 8 V16" stroke="${d}" stroke-width="1.6"/></pattern></defs>`;

// 燕尾屋頂：寬 w，屋簷在 y = top（0 以上），高 rh
const swallowRoof = (w, top, rh, roof = ROOF, roofD = ROOF_D) =>
  `<path d="M${-w / 2 - 26} ${top + 6} L${-w / 2 + 6} ${top - rh} H${w / 2 - 6} L${w / 2 + 26} ${top + 6}z" fill="${roof}" ${L}/>` +
  Array.from({ length: Math.floor(w / 22) }, (_, i) => {
    const t = (i + 0.5) / Math.floor(w / 22), xb = -w / 2 - 20 + t * (w + 40), xt = -w / 2 + 8 + t * (w - 16);
    return `<path d="M${xb} ${top + 2} L${xt} ${top - rh + 4}" stroke="${roofD}" stroke-width="2.5"/>`;
  }).join('') +
  `<path d="M${-w / 2 - 6} ${top - rh} H${w / 2 + 6}" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>` +
  `<path d="M${-w / 2 - 6} ${top - rh} H${w / 2 + 6}" stroke="${roofD}" stroke-width="6" stroke-linecap="round"/>` +
  [-1, 1].map((d) => `<path d="M${d * (w / 2)} ${top - rh} Q${d * (w / 2 + 30)} ${top - rh - 2} ${d * (w / 2 + 40)} ${top - rh - 26}" fill="none" stroke="${INK}" stroke-width="11" stroke-linecap="round"/>` +
    `<path d="M${d * (w / 2)} ${top - rh} Q${d * (w / 2 + 30)} ${top - rh - 2} ${d * (w / 2 + 40)} ${top - rh - 26}" fill="none" stroke="${roofD}" stroke-width="5" stroke-linecap="round"/>`).join('');

// 正身（正廳）：紅磚牆、木門、春聯、格子窗
export function twHall(w = 280, h = 120, { wall = 'url(#twbrick)', roof = ROOF, roofD = ROOF_D, door = '#7a4a2e', burnt = false, lit = false, open = false } = {}) {
  const win = (x) => `<rect x="${x - 26}" y="${-h + 34}" width="52" height="42" fill="${lit ? '#ffe08a' : '#5a3a28'}" ${L}/>` +
    [-13, 0, 13].map((dx) => `<path d="M${x + dx} ${-h + 34} v42" stroke="${lit ? '#c99a3a' : '#a07a52'}" stroke-width="4"/>`).join('');
  return brickDefs() +
    `<rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" fill="${wall}" ${L}/>` +
    `<rect x="${-w / 2 - 4}" y="-14" width="${w + 8}" height="14" fill="#b9b2a6" ${L}/>` +
    (open ? `<rect x="-30" y="${-h + 26}" width="60" height="${h - 40}" fill="#ffe08a" ${L}/>`
      : `<rect x="-30" y="${-h + 26}" width="60" height="${h - 40}" fill="${door}" ${L}/><path d="M0 ${-h + 26} V-14" ${line(2.5)}/>` +
        `<circle cx="-7" cy="${-h / 2 + 10}" r="3" fill="#f6d36b"/><circle cx="7" cy="${-h / 2 + 10}" r="3" fill="#f6d36b"/>`) +
    `<rect x="-44" y="${-h + 26}" width="10" height="${h - 50}" fill="#e2483d" ${line(2)}/><rect x="34" y="${-h + 26}" width="10" height="${h - 50}" fill="#e2483d" ${line(2)}/>` +
    `<rect x="-30" y="${-h + 12}" width="60" height="10" fill="#e2483d" ${line(2)}/>` +
    win(-w / 2 + 52) + win(w / 2 - 52) +
    swallowRoof(w, -h, 46, burnt ? '#4a4040' : roof, burnt ? '#2f2a2a' : roofD) +
    (burnt ? `<path d="M${-w / 2 + 10} ${-h} q30 -30 60 -10 q20 -40 50 -10 q30 -20 40 10z" fill="#2f2a2a" opacity=".8"/>` : '');
}

// 護龍（左右兩側的廂房），斜斜地往前伸；side = -1 左邊、1 右邊
const wing = (side, { wall = 'url(#twbrick)', roof = ROOF, roofD = ROOF_D } = {}) => at(0, 0, 1, side > 0,
  `<path d="M-150 -92 L-300 -52 L-300 66 L-150 0z" fill="${wall}" ${L}/>` +
  `<path d="M-150 0 L-300 66 L-300 78 L-150 12z" fill="#b9b2a6" ${L}/>` +
  `<path d="M-185 -50 L-215 -42 L-215 34 L-185 18z" fill="#7a4a2e" ${L}/>` +
  `<path d="M-240 -40 L-280 -30 L-280 6 L-240 -4z" fill="#5a3a28" ${L}/><path d="M-253 -37 V-1 M-267 -34 V2" stroke="#a07a52" stroke-width="3"/>` +
  `<path d="M-142 -88 L-312 -44 L-320 -92 L-162 -136z" fill="${roof}" ${L}/>` +
  [0, 1, 2, 3, 4, 5, 6].map((i) => `<path d="M${-150 - i * 24} ${-88 + i * 6.2} l-10 -44" stroke="${roofD}" stroke-width="2.5"/>`).join('') +
  `<path d="M-162 -136 L-320 -92" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M-162 -136 L-320 -92" stroke="${roofD}" stroke-width="5" stroke-linecap="round"/>`);

// 三合院：正身在中間，兩邊護龍往前；(x, y) 是正身牆腳中心
export const sanheyuan = (x, y, s = 1, o = {}) => at(x, y, s, false, brickDefs() + wing(-1, o) + wing(1, o) + twHall(280, 120, o));

// 小一點的單棟紅磚厝
export const brickHouse = (x, y, s = 1, o = {}) => at(x, y, s, false, twHall(220, 110, o));

// 禾埕（曬穀場）和泥土地
export const courtyard = (y, c = '#e8d4a8') => `<rect x="${BX}" y="${y}" width="${BW}" height="${H - y}" fill="${c}"/>`;

// 稻田：從 y 開始往下，綠色或金黃色；田埂分格
export function paddy(y, { gold = false, h = 120 } = {}) {
  const c = gold ? '#e8c45a' : '#9ed27a', c2 = gold ? '#d9a93a' : '#6fb257';
  let out = `<rect x="${BX}" y="${y}" width="${BW}" height="${h}" fill="${c}"/>`;
  for (let r = 0; r < Math.ceil(h / 26); r++) {
    const yy = y + 14 + r * 26;
    for (let i = 0; i < 46; i++) {
      const x = -1000 + i * 62 + (r % 2) * 31;
      out += `<path d="M${x} ${yy} l-5 -10 M${x} ${yy} l0 -13 M${x} ${yy} l5 -10" stroke="${c2}" stroke-width="3" stroke-linecap="round"/>`;
    }
  }
  return out + `<rect x="${BX}" y="${y - 6}" width="${BW}" height="8" fill="#c9a06a"/>`;
}

// 竹子：一叢
export const bamboo = (x, y, s = 1) => at(x, y, s, false,
  [[-30, 230, -6], [-10, 280, 2], [12, 250, 6], [30, 210, 10]].map(([dx, h, lean]) =>
    `<path d="M${dx} 0 L${dx + lean} ${-h}" stroke="${INK}" stroke-width="13" stroke-linecap="round"/>` +
    `<path d="M${dx} 0 L${dx + lean} ${-h}" stroke="#7cbf5a" stroke-width="8" stroke-linecap="round"/>` +
    [0.25, 0.5, 0.75].map((t) => `<path d="M${dx + lean * t - 5} ${-h * t} h10" stroke="#4f8f3f" stroke-width="3"/>`).join('') +
    [0.55, 0.8, 1].map((t, k) => {
      const lx = dx + lean * t, ly = -h * t, d = k % 2 ? 1 : -1;
      return `<path d="M${lx} ${ly} q${d * 20} -14 ${d * 40} -6 q${-d * 20} 10 ${-d * 40} 6z" fill="#5fae5a" ${line(2)}/>` +
        `<path d="M${lx} ${ly} q${-d * 16} -18 ${-d * 30} -14 q${d * 14} 12 ${d * 30} 14z" fill="#6cbd62" ${line(2)}/>`;
    }).join('')).join(''));

// 大樹（可以爬上去）：主幹、一根橫向大樹枝在 y-200、茂密樹冠
export const bigTree = (x, y, s = 1) => at(x, y, s, false,
  `<path d="M-40 0 Q-30 -120 -26 -260 H26 Q30 -120 40 0z" fill="#8c6440" ${L}/>` +
  `<path d="M-50 0 q10 -10 20 -6 M50 0 q-10 -10 -20 -6" ${line(3)}/>` +
  `<path d="M20 -200 Q90 -220 170 -214 L170 -196 Q90 -198 24 -176z" fill="#8c6440" ${L}/>` +
  `<circle cx="0" cy="-330" r="110" fill="#4f9a5f" ${L}/><circle cx="-100" cy="-280" r="70" fill="#5fae5a" ${L}/>` +
  `<circle cx="110" cy="-290" r="80" fill="#5fae5a" ${L}/><circle cx="160" cy="-230" r="44" fill="#6cbd62" ${L}/>` +
  `<circle cx="-30" cy="-250" r="40" fill="#6cbd62" ${L}/>`);

// 遠山（綠色山巒，台灣中部的山）
export const greenMountains = (y, c1 = '#8fbf9a', c2 = '#77ad86') =>
  `<path d="M${BX} ${y} L-300 ${y - 120} L-60 ${y - 40} L120 ${y - 170} L300 ${y - 60} L470 ${y - 190} L650 ${y - 70} L820 ${y - 160} L1100 ${y - 40} L1400 ${y - 130} L${BX + BW} ${y - 20} V${y + 60} H${BX}z" fill="${c1}"/>` +
  `<path d="M${BX} ${y + 30} Q-200 ${y - 60} 40 ${y - 10} Q220 ${y - 90} 400 ${y - 20} Q600 ${y - 90} 780 ${y - 10} Q1100 ${y - 70} ${BX + BW} ${y + 10} V${y + 80} H${BX}z" fill="${c2}"/>`;

// ---------- 室內 ----------
// 紅磚牆的屋內，木格窗、磨石地；dark = true 是晚上（窗外有月光）
export function twInterior({ dark = false, window: win = true } = {}) {
  return brickDefs('twbrickIn', dark ? '#7a4a44' : '#d9765a', dark ? '#653c38' : '#c0634a') +
    `<rect x="${BX}" y="${BY}" width="${BW}" height="${360 - BY}" fill="url(#twbrickIn)"/>` +
    `<rect x="${BX}" y="40" width="${BW}" height="18" fill="${dark ? '#4a3426' : '#8c6a4a'}"/>` +
    (win ? `<rect x="560" y="200" width="160" height="110" fill="${dark ? '#2a3466' : '#bfe4ff'}" ${L}/>` +
      (dark ? `<circle cx="680" cy="232" r="16" fill="#fff1b8"/>` : '') +
      [600, 640, 680].map((x) => `<path d="M${x} 200 v110" stroke="#8c6a4a" stroke-width="7"/>`).join('') +
      `<path d="M560 255 h160" stroke="#8c6a4a" stroke-width="5"/><rect x="560" y="200" width="160" height="110" fill="none" ${line(4)}/>` : '') +
    `<rect x="${BX}" y="360" width="${BW}" height="${H - 360}" fill="${dark ? '#5d5a66' : '#b9b2a6'}"/>` +
    [0, 1, 2, 3, 4].map((i) => `<path d="M${BX} ${392 + i * 46} H${BX + BW}" stroke="${dark ? '#4c4956' : '#a59e92'}" stroke-width="3"/>`).join('') +
    `<path d="M${BX} 360 H${BX + BW}" ${line(4)}/>`;
}

// 夜晚的屋內暗暗的：蓋一層深藍色
export const dim = (o = 0.35) => `<rect x="${BX}" y="${BY}" width="${BW}" height="${H - BY}" fill="#141a3a" opacity="${o}"/>`;

// 紅眠床（有床架和床頂）；寬 300，床面在 y = -70
export const bed = (x, y, s = 1, inside = '') => at(x, y, s, false,
  `<rect x="-160" y="-250" width="320" height="250" fill="#5a3022" opacity=".35"/>` +
  `<rect x="-150" y="-70" width="300" height="70" fill="#a8432f" ${L}/>` +
  [-90, 0, 90].map((dx) => `<rect x="${dx - 34}" y="-56" width="68" height="40" rx="6" fill="#c9783a" ${line(2)}/>`).join('') +
  inside +
  `<path d="M-160 0 V-260 M160 0 V-260" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M-160 0 V-260 M160 0 V-260" stroke="#b5452f" stroke-width="10" stroke-linecap="round"/>` +
  `<rect x="-172" y="-280" width="344" height="34" fill="#b5452f" ${L}/>` +
  `<path d="M-150 -246 h300" stroke="#f2c14e" stroke-width="5"/>` +
  [-120, -60, 0, 60, 120].map((dx) => `<circle cx="${dx}" cy="-263" r="7" fill="#f2c14e" ${line(2)}/>`).join(''));

// 睡覺的頭（閉眼）
export const sleepHead = (r = 30, { hair = '#3a2a22', skin = SKIN, extra = '' } = {}) =>
  `<circle r="${r}" fill="${skin}" ${L}/>` +
  (hair ? `<path d="M-31 2 Q-32 -32 0 -32 Q32 -32 31 2 Q20 -22 0 -20 Q-20 -22 -31 2z" fill="${hair}" ${line(2.5)}/>` : '') +
  [-1, 1].map((d) => `<path d="M${d * 11 - 6} 0 q6 5 12 0" fill="none" ${line(3)}/>`).join('') +
  `<ellipse cx="0" cy="12" rx="4" ry="3" fill="#c94f4f"/>` + extra;

// 被子（蓋到下巴）
export const quilt = (x, y, w = 120, c = '#6aa58a') =>
  `<path d="M${x - w / 2} ${y} Q${x} ${y - 30} ${x + w / 2} ${y} L${x + w / 2 + 6} ${y + 40} H${x - w / 2 - 6}z" fill="${c}" ${L}/>` +
  [[-0.25, 12], [0.05, 22], [0.3, 10]].map(([t, dy]) => `<circle cx="${x + t * w}" cy="${y + dy}" r="5" fill="#fff" opacity=".8"/>`).join('');

// ---------- 小東西 ----------
export const zzz = (x, y, s = 1) => at(x, y, s, false,
  [[0, 0, 22], [22, -24, 28], [50, -54, 34]].map(([dx, dy, f]) => `<text x="${dx}" y="${dy}" font-size="${f}" font-weight="700" fill="#7a7fb0" font-family="sans-serif">Z</text>`).join(''));
export const qmark = (x, y, s = 1, c = '#5b8fd0') => `<text x="${x}" y="${y}" font-size="${44 * s}" font-weight="900" fill="${c}" stroke="${INK}" stroke-width="2" text-anchor="middle" font-family="sans-serif">?</text>`;
export const bang = (x, y, s = 1, c = '#e2483d') => `<text x="${x}" y="${y}" font-size="${50 * s}" font-weight="900" fill="${c}" stroke="${INK}" stroke-width="2" text-anchor="middle" font-family="sans-serif">!</text>`;
export const word = (x, y, t, size = 36, c = INK, stroke = '') =>
  `<text x="${x}" y="${y}" font-size="${size}" font-weight="800" fill="${c}" ${stroke ? `stroke="${stroke}" stroke-width="5" paint-order="stroke"` : ''} text-anchor="middle" font-family="sans-serif">${t}</text>`;
export const bubble = (x, y, w, h, tailX, tailY, inner = '', c = '#fff') =>
  `<path d="M${x - w / 2 + 20} ${y - h / 2} H${x + w / 2 - 20} Q${x + w / 2} ${y - h / 2} ${x + w / 2} ${y - h / 2 + 20} V${y + h / 2 - 20} Q${x + w / 2} ${y + h / 2} ${x + w / 2 - 20} ${y + h / 2} H${x + 14} L${tailX} ${tailY} L${x - 14} ${y + h / 2} H${x - w / 2 + 20} Q${x - w / 2} ${y + h / 2} ${x - w / 2} ${y + h / 2 - 20} V${y - h / 2 + 20} Q${x - w / 2} ${y - h / 2} ${x - w / 2 + 20} ${y - h / 2}z" fill="${c}" ${L}/>` + inner;

// 火焰（卡通）
export const flames = (x, y, s = 1) => at(x, y, s, false,
  `<path d="M-60 0 Q-80 -60 -40 -90 Q-40 -60 -20 -50 Q-30 -110 10 -140 Q10 -90 30 -80 Q40 -110 60 -100 Q50 -70 70 -50 Q80 -20 60 0z" fill="#ff8a3a" ${L}/>` +
  `<path d="M-36 0 Q-46 -40 -18 -60 Q-14 -36 0 -34 Q-4 -74 20 -90 Q22 -56 36 -46 Q50 -24 36 0z" fill="#ffd25e"/>`);
export const smoke = (x, y, s = 1, c = '#9a9aa6') => at(x, y, s, false,
  `<circle cx="0" cy="0" r="22" fill="${c}" opacity=".8"/><circle cx="20" cy="-30" r="28" fill="${c}" opacity=".7"/><circle cx="-6" cy="-66" r="34" fill="${c}" opacity=".55"/>`);
export const steam = (x, y, s = 1) => at(x, y, s, false,
  [-20, 0, 20].map((dx) => `<path d="M${dx} 0 q-12 -14 0 -28 q12 -14 0 -28" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".9"/>`).join(''));
export const speed = (x, y, s = 1, flip = false) => at(x, y, s, flip,
  [0, 22, 44].map((dy) => `<path d="M0 ${dy} h-${60 - dy / 2}" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".9"/>`).join(''));
export const flower = (x, y, s = 1, c = '#ff8fb1') => at(x, y, s, false,
  `<path d="M0 0 V-30" stroke="#5f9f4f" stroke-width="4"/>` +
  [0, 72, 144, 216, 288].map((a) => `<circle cx="${Math.cos(a * Math.PI / 180) * 9}" cy="${-36 + Math.sin(a * Math.PI / 180) * 9}" r="8" fill="${c}" ${line(2)}/>`).join('') +
  `<circle cx="0" cy="-36" r="6" fill="#ffd25e" ${line(2)}/>`);
export const flowerBed = (x0, x1, y, step = 46, colors = ['#ff8fb1', '#ffd25e', '#ff7a6b', '#c79cf0', '#fff']) =>
  Array.from({ length: Math.floor((x1 - x0) / step) + 1 }, (_, i) => flower(x0 + i * step, y + (i % 2) * 14, 0.9 + (i % 3) * 0.12, colors[i % colors.length])).join('');
export const bush = (x, y, s = 1, c = '#5fae5a') => at(x, y, s, false,
  `<path d="M-70 0 Q-80 -50 -40 -56 Q-30 -90 10 -80 Q50 -96 64 -54 Q90 -40 76 0z" fill="${c}" ${L}/>`);

// ---------- 動物 ----------
// 水牛
export function buffalo({ mood = 'happy' } = {}) {
  const C = '#7d7f8c', D = '#5f616c';
  return `<path d="M-74 -70 q-24 10 -20 40" fill="none" ${line(4)}/>` +
    `<ellipse cx="-10" cy="-62" rx="70" ry="40" fill="${C}" ${L}/>` +
    [-62, -36, 14, 40].map((x) => `<rect x="${x}" y="-34" width="18" height="34" rx="6" fill="${C}" ${L}/>`).join('') +
    at(62, -82, 1, false,
      `<path d="M-14 -24 Q-40 -50 -66 -30 Q-46 -40 -26 -16z M14 -24 Q40 -50 66 -30 Q46 -40 26 -16z" fill="#e8dcc0" ${L}/>` +
      `<ellipse cx="-30" cy="-6" rx="12" ry="7" fill="${D}" ${L}/><ellipse cx="30" cy="-6" rx="12" ry="7" fill="${D}" ${L}/>` +
      `<circle r="30" fill="${C}" ${L}/><ellipse cx="0" cy="16" rx="22" ry="14" fill="#a7a9b4" ${line(2.5)}/>` +
      `<circle cx="-7" cy="16" r="3" fill="${INK}"/><circle cx="7" cy="16" r="3" fill="${INK}"/>` +
      [-1, 1].map((d) => `<circle cx="${d * 12}" cy="-6" r="4" fill="${INK}"/>`).join('') +
      (mood === 'happy' ? `<path d="M-5 26 q5 4 10 0" fill="none" ${line(2)}/>` : ''));
}

// 雞
export function chicken({ c = '#fff', flap = false } = {}) {
  return `<path d="M-6 0 v-14 M6 0 v-14" ${line(3)}/>` +
    `<path d="M-30 -30 q-10 -26 4 -34 q2 14 8 18z" fill="${c}" ${line(2.5)}/>` +
    `<ellipse cx="0" cy="-28" rx="26" ry="18" fill="${c}" ${line(2.5)}/>` +
    (flap ? `<path d="M-6 -34 q-10 -36 22 -40 q-2 24 -22 40z" fill="${c}" ${line(2.5)}/>` : `<path d="M-14 -30 q14 -10 22 4 q-12 8 -22 -4z" fill="${c === '#fff' ? '#eee' : c}" ${line(2)}/>`) +
    at(18, -50, 1, false, `<path d="M-6 -12 q2 -10 8 -6 q4 -8 8 0 q6 -2 4 8z" fill="#e2483d" ${line(2)}/>` +
      `<circle r="13" fill="${c}" ${line(2.5)}/><path d="M11 -2 l10 4 l-10 4z" fill="#f2c14e" ${line(1.5)}/>` +
      `<path d="M8 6 q4 8 -2 10" fill="#e2483d"/><circle cx="4" cy="-3" r="2.5" fill="${INK}"/>`);
}

// 老虎（四隻腳）：mood happy / angry / sly
export function tiger({ mood = 'happy' } = {}) {
  const C = '#f2a03d', D = '#3a2a22';
  return `<path d="M-60 -50 q-50 -10 -40 -64" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/>` +
    `<path d="M-60 -50 q-50 -10 -40 -64" fill="none" stroke="${C}" stroke-width="10" stroke-linecap="round"/>` +
    `<path d="M-60 -50 q-50 -10 -40 -64" fill="none" stroke="${D}" stroke-width="10" stroke-dasharray="5 11"/>` +
    `<ellipse cx="-10" cy="-42" rx="58" ry="30" fill="${C}" ${L}/><ellipse cx="0" cy="-30" rx="32" ry="14" fill="#fff6e8"/>` +
    [-44, -26, -8].map((x) => `<path d="M${x} -70 q6 12 0 22" fill="none" stroke="${D}" stroke-width="5" stroke-linecap="round"/>`).join('') +
    [-46, -24, 10, 30].map((x) => `<rect x="${x}" y="-24" width="16" height="24" rx="7" fill="${C}" ${L}/>`).join('') +
    at(48, -76, 1, false, tigerHead(32, mood));
}

// 老虎頭：mood happy / normal / angry / cry / gape（張大嘴）/ sly（賊賊的笑）
export function tigerHead(r = 30, mood = 'normal', { ears = true } = {}) {
  const C = '#f2a03d', D = '#3a2a22';
  let f;
  if (mood === 'gape') {
    f = [-1, 1].map((d) => `<path d="M${d * 11 - 6} -4 q6 -8 12 0" fill="none" ${line(3)}/>`).join('') +
      `<ellipse cx="0" cy="${r * 0.42}" rx="${r * 0.42}" ry="${r * 0.36}" fill="#c94f4f" ${line(2.5)}/>` +
      `<path d="M-8 ${r * 0.14} l3 6 l3 -6 M2 ${r * 0.14} l3 6 l3 -6" fill="#fff" ${line(1.5)}/>`;
  } else if (mood === 'sly') {
    f = [-1, 1].map((d) => `<path d="M${d * 11 - 7} -2 h14" ${line(3.5)}/><circle cx="${d * 11 + 3}" cy="-5" r="3" fill="${D}"/>`).join('') +
      `<path d="M-12 ${r * 0.36} q12 10 24 -4" fill="none" ${line(2.5)}/>`;
  } else {
    f = face(r, mood, { cheek: '#f07a5a' });
  }
  return (ears ? `<circle cx="${-r * 0.7}" cy="${-r * 0.72}" r="${r * 0.32}" fill="${C}" ${L}/><circle cx="${r * 0.7}" cy="${-r * 0.72}" r="${r * 0.32}" fill="${C}" ${L}/>` +
    `<circle cx="${-r * 0.7}" cy="${-r * 0.72}" r="${r * 0.15}" fill="#f5a3a3"/><circle cx="${r * 0.7}" cy="${-r * 0.72}" r="${r * 0.15}" fill="#f5a3a3"/>` : '') +
    `<circle r="${r}" fill="${C}" ${L}/>` +
    `<path d="M-8 ${-r + 2} l4 12 M0 ${-r} v14 M8 ${-r + 2} l-4 12" stroke="${D}" stroke-width="4" stroke-linecap="round"/>` +
    `<path d="M${-r} -2 h10 M${-r + 1} 8 h9 M${r} -2 h-10 M${r - 1} 8 h-9" stroke="${D}" stroke-width="4" stroke-linecap="round"/>` +
    `<circle cx="-8" cy="${r * 0.3}" r="${r * 0.28}" fill="#fff6e8"/><circle cx="8" cy="${r * 0.3}" r="${r * 0.28}" fill="#fff6e8"/>` +
    f +
    `<path d="M-5 ${r * 0.12} h10 l-5 6z" fill="#c94f4f" ${line(1.5)}/>`;
}

// 龍（可愛版）：c 身體顏色、belly 肚子；swallow = 'sun' / 'moon' 肚子發光；dizzy 頭昏眼花
export function dragon({ c = '#5fbf8a', belly = '#f6e7a8', mood = 'normal', swallow = '', dizzy = false } = {}) {
  const glow = swallow === 'sun' ? '#ffd25e' : swallow === 'moon' ? '#fff1b8' : belly;
  const body = 'M-150 -10 Q-120 -90 -60 -60 Q-10 -30 20 -90 Q40 -140 80 -130';
  let eyes = dizzy
    ? [-1, 1].map((d) => `<path d="M${d * 12 - 6} -12 l12 12 M${d * 12 + 6} -12 l-12 12" ${line(3.5)}/>`).join('') + `<path d="M-8 18 q4 -6 8 0 q4 6 8 0" fill="none" ${line(2.5)}/>`
    : face(30, mood, { cheek: '#f39a9a' });
  return `<path d="${body}" fill="none" stroke="${INK}" stroke-width="54" stroke-linecap="round"/>` +
    `<path d="${body}" fill="none" stroke="${c}" stroke-width="46" stroke-linecap="round"/>` +
    `<path d="${body}" fill="none" stroke="${glow}" stroke-width="16" stroke-linecap="round" opacity="${swallow ? 1 : 0.7}"/>` +
    (swallow ? `<circle cx="-40" cy="-55" r="26" fill="${glow}" opacity=".5"/>` : '') +
    [[-120, -70], [-30, -48], [40, -126]].map(([x, y]) => `<path d="M${x - 10} ${y - 18} l10 -18 l10 18z" fill="#f2c14e" ${line(2.5)}/>`).join('') +
    `<path d="M-150 -10 l-30 -10 l12 24z" fill="${c}" ${L}/>` +
    at(100, -156, 1.3, false,
      `<path d="M-18 -30 l-10 -26 l18 14z M10 -32 l8 -26 l10 22z" fill="#f2c14e" ${L}/>` +
      `<path d="M-30 -10 q-22 -6 -26 -24" fill="none" ${line(3)}/>` +
      `<circle r="34" fill="${c}" ${L}/>` +
      `<ellipse cx="22" cy="12" rx="22" ry="16" fill="${belly}" ${line(2.5)}/><circle cx="18" cy="8" r="2.5" fill="${INK}"/><circle cx="30" cy="8" r="2.5" fill="${INK}"/>` +
      `<path d="M38 2 q20 -6 26 -22 M38 8 q22 0 30 -10" fill="none" ${line(2.5)}/>` +
      at(-6, -4, 0.85, false, eyes));
}
