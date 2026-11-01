// 插畫共用函式庫：背景、表情、人物、動物，以及輸出 SVG 和預覽圖的工具。
// 每本書一個腳本（例如 momotaro.mjs），import 這裡的東西組成每一頁，最後呼叫 writeBook(id, pages)。
//
// 座標規則：
// - 每頁畫面是 800x600，背景函式都會往外多畫（BX、BW、BY），閱讀器滿版時依螢幕比例露出更多背景，角色不會被裁掉
// - 上方 y < 180 會被故事文字蓋住：只放天空、雲、太陽、月亮、星星這類背景，角色和重要道具放在下面
// - 角色以「腳底中心」為原點、面向右邊；at(x, y, s, flip, body) 放到畫面上，flip = true 左右翻轉
// - 只用形狀畫，不用 emoji（Windows 會顯示不一致）；畫面上的字（像「啪！」）少用，必要時放在 y > 180

import { writeFileSync, mkdirSync, existsSync, rmSync, copyFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

export const W = 800, H = 600;

// ---------- 共用 ----------
export const INK = '#4a3426';
export const line = (w = 3) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
export const L = line();
export const SKIN = '#f8d5b5';
export const at = (x, y, s = 1, flip = false, body = '') =>
  `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">${body}</g>`;

// 背景都往 800x600 外多畫一圈（BX、BW、BY），閱讀器滿版顯示時，螢幕比較寬就露出左右、比較高就露出上方的天空，
// 角色不會被裁掉。preserveAspectRatio 靠下對齊，上方多出來的天空剛好放文字。
export const BX = -1000, BW = 2800, BY = -1400;
export function svg(body, bg = '#cfeaff') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax meet">
<rect x="${BX}" y="${BY}" width="${BW}" height="${H - BY}" fill="${bg}"/>
${body}
</svg>
`;
}

// 臉：mood = happy / normal / scared / cry / angry
export function face(r, mood = 'normal', { cheek = '#f5a3a3' } = {}) {
  const ex = r * 0.38, ey = -r * 0.05;
  let eyes, mouth;
  if (mood === 'happy') {
    eyes = [-1, 1].map((d) => `<path d="M${d * ex - 6} ${ey + 2} q6 -8 12 0" fill="none" ${line(3)}/>`).join('');
    mouth = `<path d="M-9 ${r * 0.35} q9 10 18 0" fill="#c94f4f" ${line(2.5)}/>`;
  } else if (mood === 'scared') {
    eyes = [-1, 1].map((d) => `<circle cx="${d * ex}" cy="${ey}" r="3.5" fill="${INK}"/>`).join('');
    mouth = `<ellipse cx="0" cy="${r * 0.42}" rx="5" ry="7" fill="#c94f4f" ${line(2.5)}/>`;
  } else if (mood === 'cry') {
    eyes = [-1, 1].map((d) => `<path d="M${d * ex - 6} ${ey} q6 5 12 0" fill="none" ${line(3)}/>` +
      `<path d="M${d * ex} ${ey + 6} q-4 10 0 16 q4 -6 0 -16z" fill="#7cc4f2"/>`).join('');
    mouth = `<path d="M-9 ${r * 0.45} q9 -9 18 0" fill="none" ${line(2.5)}/>`;
  } else if (mood === 'angry') {
    eyes = [-1, 1].map((d) => `<circle cx="${d * ex}" cy="${ey + 2}" r="4" fill="${INK}"/>` +
      `<path d="M${d * (ex + 9)} ${ey - 12} L${d * (ex - 7)} ${ey - 5}" ${line(3.5)}/>`).join('');
    mouth = `<path d="M-12 ${r * 0.42} h24" ${line(3)}/>`;
  } else {
    eyes = [-1, 1].map((d) => `<circle cx="${d * ex}" cy="${ey}" r="4" fill="${INK}"/>`).join('');
    mouth = `<path d="M-7 ${r * 0.35} q7 6 14 0" fill="none" ${line(2.5)}/>`;
  }
  const cheeks = [-1, 1].map((d) => `<ellipse cx="${d * r * 0.58}" cy="${r * 0.25}" rx="${r * 0.16}" ry="${r * 0.1}" fill="${cheek}" opacity=".7"/>`).join('');
  return cheeks + eyes + mouth;
}

// ---------- 背景 ----------
export const sky = (top = '#bfe4ff', bottom = '#eaf6ff') =>
  `<defs><linearGradient id="sky" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${H}"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient></defs><rect x="${BX}" y="${BY}" width="${BW}" height="${H - BY}" fill="url(#sky)"/>`;
export const sun = (x, y, r = 40) => `<circle cx="${x}" cy="${y}" r="${r + 14}" fill="#ffe9a6" opacity=".6"/><circle cx="${x}" cy="${y}" r="${r}" fill="#ffd25e"/>`;
export const cloud = (x, y, s = 1) => at(x, y, s, false,
  `<path d="M-60 0 q-10 -30 20 -32 q10 -28 45 -18 q25 -18 45 8 q30 0 25 28 z" fill="#fff" opacity=".95"/>`);
export const hills = (y, c1 = '#9fd38a', c2 = '#7fc06c') =>
  `<path d="M${BX} ${y + 20} Q-500 ${y - 90} 0 ${y} Q120 ${y - 120} 260 ${y - 30} T520 ${y - 50} T800 ${y - 90} Q1300 ${y - 10} ${BX + BW} ${y - 40} V${H} H${BX}z" fill="${c1}"/>` +
  `<path d="M${BX} ${y + 50} Q-500 ${y} 0 ${y + 40} Q200 ${y - 40} 380 ${y + 20} T800 ${y + 10} Q1300 ${y + 60} ${BX + BW} ${y + 20} V${H} H${BX}z" fill="${c2}"/>`;
export const mountain = (x, y, w, h, c = '#a7b9d6') =>
  `<path d="M${x - w / 2} ${y} L${x} ${y - h} L${x + w / 2} ${y}z" fill="${c}"/>` +
  `<path d="M${x - w * 0.12} ${y - h * 0.76} L${x} ${y - h} L${x + w * 0.12} ${y - h * 0.76} l-${w * 0.06} 10 l-${w * 0.06} -8 l-${w * 0.06} 8z" fill="#fff"/>`;
export const ground = (y, c = '#8dc775') => `<rect x="${BX}" y="${y}" width="${BW}" height="${H - y}" fill="${c}"/>`;
export const path = (c = '#e9d3a3') => `<path d="M300 ${H} Q380 470 420 420 T520 330 L560 330 Q500 400 520 470 T640 ${H}z" fill="${c}"/>`;
export const tree = (x, y, s = 1) => at(x, y, s, false,
  `<rect x="-8" y="-60" width="16" height="60" fill="#9a6b45" ${L}/>` +
  `<circle cx="0" cy="-90" r="45" fill="#5fae5a" ${L}/><circle cx="-28" cy="-70" r="28" fill="#6cbd62" ${L}/><circle cx="30" cy="-68" r="26" fill="#6cbd62" ${L}/>`);
export const pine = (x, y, s = 1) => at(x, y, s, false,
  `<rect x="-7" y="-30" width="14" height="30" fill="#9a6b45"/>` +
  `<path d="M0 -150 L-40 -80 H-20 L-50 -30 H50 L20 -80 H40z" fill="#4f9a5f" ${L}/>`);
export const grass = (x, y) => `<path d="M${x} ${y} l-6 -14 M${x} ${y} l0 -18 M${x} ${y} l6 -14" stroke="#5f9f4f" stroke-width="3" stroke-linecap="round"/>`;
export const sparkle = (x, y, s = 1, c = '#ffd25e') => at(x, y, s, false,
  `<path d="M0 -18 Q3 -3 18 0 Q3 3 0 18 Q-3 3 -18 0 Q-3 -3 0 -18z" fill="${c}"/>`);
export const water = (y, h = 140, c = '#7cc4f2') =>
  `<rect x="${BX}" y="${y}" width="${BW}" height="${h}" fill="${c}"/>` +
  [0, 1, 2, 3].map((i) => `<path d="M${60 + i * 190} ${y + 30 + (i % 2) * 40} q20 -12 40 0 q20 12 40 0" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"/>`).join('');
export const sea = (y) =>
  `<rect x="${BX}" y="${y}" width="${BW}" height="${H - y}" fill="#4fa8e0"/>` +
  Array.from({ length: 22 }, (_, i) => {
    const x = (i * 173) % 1560 - 380, yy = y + 30 + ((i * 61) % (H - y - 50));
    return `<path d="M${x} ${yy} q15 -12 30 0 q15 12 30 0" fill="none" stroke="#d6efff" stroke-width="4" stroke-linecap="round"/>`;
  }).join('');

// 日式農家：茅草屋頂
export const jpHouse = (x, y, s = 1) => at(x, y, s, false,
  `<rect x="-110" y="-110" width="220" height="110" fill="#f1dfbf" ${L}/>` +
  `<rect x="-30" y="-80" width="60" height="80" fill="#8c6a4a" ${L}/>` +
  `<rect x="-90" y="-85" width="45" height="40" fill="#fff8e6" ${L}/><path d="M-67.5 -85 v40 M-90 -65 h45" ${line(2)}/>` +
  `<rect x="45" y="-85" width="45" height="40" fill="#fff8e6" ${L}/><path d="M67.5 -85 v40 M45 -65 h45" ${line(2)}/>` +
  `<path d="M-150 -100 L-60 -210 H60 L150 -100z" fill="#c9a25a" ${L}/>` +
  `<path d="M-60 -210 H60 L80 -235 H-80z" fill="#a67f3f" ${L}/>` +
  [-100, -50, 0, 50, 100].map((d) => `<path d="M${d * 0.9} -110 L${d * 0.45} -200" stroke="#a67f3f" stroke-width="3"/>`).join(''));

// 日式屋內：木地板和紙拉門
export const jpInterior = () =>
  `<rect x="${BX}" y="${BY}" width="${BW}" height="${H - BY}" fill="#f4e6c8"/>` +
  // 拉門上方：淺色牆面 + 一根橫樑，直立的畫面多出來的部分放文字
  [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => `<path d="M${i * 200 + 5} ${BY} V40" stroke="#e2cda4" stroke-width="10"/>`).join('') +
  `<rect x="${BX}" y="18" width="${BW}" height="22" fill="#8c6a4a"/>` +
  [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<rect x="${i * 200 + 10}" y="40" width="180" height="300" fill="#fffaf0" ${L}/>` +
    `<path d="M${i * 200 + 100} 40 v300 M${i * 200 + 10} 140 h180 M${i * 200 + 10} 240 h180" stroke="#d8c39c" stroke-width="3"/>`).join('') +
  `<rect x="${BX}" y="340" width="${BW}" height="${H - 340}" fill="#d9b27c"/>` +
  [0, 1, 2, 3, 4, 5].map((i) => `<path d="M${BX} ${370 + i * 45} H${BX + BW}" stroke="#c69c66" stroke-width="3"/>`).join('');

// ---------- 角色 ----------
export const feet = (c = INK) => `<ellipse cx="-14" cy="-4" rx="14" ry="6" fill="${c}"/><ellipse cx="14" cy="-4" rx="14" ry="6" fill="${c}"/>`;

// 手臂：從肩膀 (sx, sy) 伸到 (hx, hy)，袖子顏色 c
export const arm = (sx, sy, hx, hy, c) =>
  `<path d="M${sx} ${sy} L${hx} ${hy}" stroke="${INK}" stroke-width="22" stroke-linecap="round"/>` +
  `<path d="M${sx} ${sy} L${hx} ${hy}" stroke="${c}" stroke-width="16" stroke-linecap="round"/>` +
  `<circle cx="${hx}" cy="${hy}" r="8" fill="${SKIN}" ${line(2.5)}/>`;

export const ARMS = {
  down: [[-26, -88, -36, -45], [26, -88, 36, -45]],
  up: [[-26, -88, -52, -170], [26, -88, 52, -170]],
  hold: [[-26, -88, 4, -62], [26, -88, 24, -60]], // 抱東西
  point: [[-26, -88, -36, -45], [26, -88, 70, -110]],
  raise: [[-26, -88, -36, -45], [26, -88, 40, -160]], // 單手舉高
};
export const arms = (pose, c) => (ARMS[pose] || ARMS.down).map((a) => arm(...a, c)).join('');

export function grandpa({ mood = 'happy', pose = 'down', item = '' } = {}) {
  const C = '#8b6b4a';
  return feet('#5a4632') +
    `<path d="M-36 -6 L-30 -96 Q0 -108 30 -96 L36 -6z" fill="${C}" ${L}/>` +
    `<path d="M0 -100 L-10 -60 M0 -100 L10 -60" ${line(2.5)}/><rect x="-32" y="-58" width="64" height="12" fill="#5a4632" ${L}/>` +
    arms(pose, C) + item +
    at(0, -128, 1, false,
      `<circle r="30" fill="${SKIN}" ${L}/>` +
      `<path d="M-30 -2 q-6 -16 4 -24 M30 -2 q6 -16 -4 -24" fill="#e8e8e8" ${line(2)}/>` +
      `<path d="M-14 -16 q6 -4 10 0 M4 -16 q6 -4 10 0" stroke="#fff" stroke-width="5" stroke-linecap="round"/>` +
      face(30, mood) +
      `<path d="M-20 14 Q0 52 20 14 Q10 24 0 22 Q-10 24 -20 14z" fill="#fff" ${line(2)}/>`);
}

export function grandma({ mood = 'happy', pose = 'down', item = '' } = {}) {
  const C = '#8e6bb0';
  return feet('#5a4632') +
    `<path d="M-38 -6 L-30 -96 Q0 -108 30 -96 L38 -6z" fill="${C}" ${L}/>` +
    `<path d="M-26 -70 H26 L30 -10 H-30z" fill="#f2efe6" ${L}/>` +
    `<path d="M0 -100 L-10 -72 M0 -100 L10 -72" ${line(2.5)}/>` +
    arms(pose, C) + item +
    at(0, -128, 1, false,
      `<circle cx="0" cy="-34" r="14" fill="#d9d9d9" ${L}/>` +
      `<circle r="30" fill="${SKIN}" ${L}/>` +
      `<path d="M-31 2 Q-32 -32 0 -32 Q32 -32 31 2 Q24 -18 0 -20 Q-24 -18 -31 2z" fill="#d9d9d9" ${line(2.5)}/>` +
      face(30, mood));
}

// 桃太郎：黑髮髻、白頭巾（桃子記號）、橘色和服、藍色褲裙、腰間的刀
export function dog({ mood = 'happy' } = {}) {
  const C = '#e8b170';
  return `<path d="M-50 -46 q-30 -20 -14 -44 q10 14 4 30" fill="${C}" ${L}/>` +
    `<ellipse cx="-10" cy="-38" rx="48" ry="28" fill="${C}" ${L}/>` +
    `<ellipse cx="6" cy="-30" rx="22" ry="16" fill="#fff6e8"/>` +
    [-42, -20, 8, 28].map((x) => `<rect x="${x}" y="-22" width="14" height="22" rx="6" fill="${C}" ${L}/>`).join('') +
    at(40, -72, 1, false,
      `<path d="M-24 -18 L-20 -48 L-4 -26z M8 -26 L22 -48 L26 -16z" fill="${C}" ${L}/>` +
      `<circle r="30" fill="${C}" ${L}/><ellipse cx="6" cy="10" rx="18" ry="14" fill="#fff6e8"/>` +
      `<ellipse cx="8" cy="2" rx="6" ry="4" fill="${INK}"/>` + face(26, mood, { cheek: '#f0a080' }));
}

export function monkey({ mood = 'happy', pose = 'down' } = {}) {
  const C = '#9a6440', F = '#f6c4a8';
  const hand = pose === 'up' ? [[-16, -64, -40, -110], [16, -64, 40, -110]] : [[-16, -64, -30, -30], [16, -64, 30, -30]];
  return `<path d="M-26 -20 q-60 0 -50 -50 q6 -20 20 -10" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>` +
    `<path d="M-26 -20 q-60 0 -50 -50 q6 -20 20 -10" fill="none" stroke="${C}" stroke-width="5" stroke-linecap="round"/>` +
    `<ellipse cx="-14" cy="-6" rx="12" ry="7" fill="${C}" ${L}/><ellipse cx="14" cy="-6" rx="12" ry="7" fill="${C}" ${L}/>` +
    `<ellipse cx="0" cy="-42" rx="28" ry="36" fill="${C}" ${L}/><ellipse cx="0" cy="-36" rx="16" ry="22" fill="${F}"/>` +
    hand.map(([a, b, c, d]) => `<path d="M${a} ${b} L${c} ${d}" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M${a} ${b} L${c} ${d}" stroke="${C}" stroke-width="10" stroke-linecap="round"/>`).join('') +
    at(0, -100, 1, false,
      `<circle cx="-30" cy="0" r="12" fill="${F}" ${L}/><circle cx="30" cy="0" r="12" fill="${F}" ${L}/>` +
      `<circle r="30" fill="${C}" ${L}/>` +
      `<path d="M-22 -2 Q-22 -20 0 -14 Q22 -20 22 -2 Q24 24 0 26 Q-24 24 -22 -2z" fill="${F}"/>` + face(26, mood, { cheek: '#ee8f8f' }));
}

export function pheasant({ mood = 'happy', fly = false } = {}) {
  return `<path d="M-30 -50 L-120 -30 L-116 -20 L-30 -38z" fill="#b5884a" ${L}/>` +
    `<path d="M-80 -42 l4 14 M-100 -38 l4 12" ${line(2)}/>` +
    (fly ? '' : `<path d="M-6 -24 v24 M10 -24 v24" ${line(4)}/>`) +
    `<ellipse cx="0" cy="-46" rx="40" ry="26" fill="#3f8f5a" ${L}/>` +
    (fly ? `<path d="M-10 -60 q-20 -70 30 -80 q10 40 -10 80z" fill="#c9a05a" ${L}/>`
      : `<path d="M-24 -50 q20 -20 46 0 q-20 18 -46 0z" fill="#c9a05a" ${L}/>`) +
    at(36, -78, 1, false,
      `<path d="M-12 18 L-4 -2 L14 6z" fill="#2e6f8f"/>` +
      `<circle r="20" fill="#2e6f8f" ${L}/><ellipse cx="6" cy="-2" rx="10" ry="12" fill="#e2483d"/>` +
      `<path d="M18 2 L34 8 L18 12z" fill="#f2c14e" ${L}/>` +
      `<circle cx="7" cy="-3" r="3.5" fill="${INK}"/>` + (mood === 'happy' ? '' : ''));
}

// 鬼：紅色（或藍色）皮膚、角、虎皮短褲、狼牙棒
export function oni({ color = '#e0503a', mood = 'angry', club = true, bow = false } = {}) {
  const head = at(0, bow ? -110 : -170, 1, false,
    `<path d="M-26 -30 L-34 -66 L-12 -38z M26 -30 L34 -66 L12 -38z" fill="#f6e27a" ${L}/>` +
    `<circle r="44" fill="${color}" ${L}/>` +
    `<path d="M-44 -6 Q-50 -50 0 -48 Q50 -50 44 -6 Q38 -30 26 -26 Q14 -40 0 -30 Q-14 -40 -26 -26 Q-38 -30 -44 -6z" fill="#2f2a2a" ${line(2.5)}/>` +
    face(40, mood, { cheek: '#b8302a' }) +
    (mood === 'angry' ? `<path d="M-12 22 l4 10 l4 -10 M4 22 l4 10 l4 -10" fill="#fff" ${line(2)}/>` : ''));
  const body = bow
    ? `<path d="M-50 -10 Q-60 -90 0 -100 Q60 -90 50 -10z" fill="${color}" ${L}/>`
    : `<path d="M-50 -60 L-44 -130 Q0 -146 44 -130 L50 -60z" fill="${color}" ${L}/>`;
  const shorts = bow ? '' :
    `<path d="M-52 -70 H52 L46 -20 H-46z" fill="#f2c14e" ${L}/>` +
    [-30, -6, 18, 38].map((x) => `<path d="M${x} -70 q6 20 -2 46" stroke="${INK}" stroke-width="6" fill="none"/>`).join('') +
    `<rect x="-40" y="-22" width="24" height="22" fill="${color}" ${L}/><rect x="16" y="-22" width="24" height="22" fill="${color}" ${L}/>`;
  const weapon = club && !bow
    ? `<path d="M56 -100 L96 -230" stroke="${INK}" stroke-width="26" stroke-linecap="round"/><path d="M56 -100 L96 -230" stroke="#7a7a8a" stroke-width="18" stroke-linecap="round"/>` +
      [0, 1, 2, 3].map((i) => `<circle cx="${70 + i * 8}" cy="${-150 - i * 24}" r="4" fill="#d8d8e0"/>`).join('') +
      `<circle cx="58" cy="-104" r="13" fill="${color}" ${L}/>`
    : '';
  const armsOni = bow
    ? `<circle cx="-46" cy="-14" r="14" fill="${color}" ${L}/><circle cx="46" cy="-14" r="14" fill="${color}" ${L}/>`
    : `<path d="M-44 -124 L-70 -80" stroke="${INK}" stroke-width="30" stroke-linecap="round"/><path d="M-44 -124 L-70 -80" stroke="${color}" stroke-width="22" stroke-linecap="round"/>`;
  return shorts + body + armsOni + weapon + head;
}

export const boat = (x, y, s = 1) => at(x, y, s, false,
  `<path d="M-160 -40 H160 Q140 20 100 20 H-110 Q-150 20 -160 -40z" fill="#a8764a" ${L}/>` +
  `<path d="M-150 -20 H150" stroke="#8a5a32" stroke-width="4"/>`);

export const island = (x, y, s = 1) => at(x, y, s, false,
  `<path d="M-180 0 Q-150 -80 -90 -100 L-60 -170 L-20 -120 L20 -200 L70 -110 L120 -130 Q170 -60 190 0z" fill="#6b6170" ${L}/>` +
  `<path d="M-40 -60 q20 -30 40 0z" fill="#2f2a3a"/>` +
  `<path d="M-200 0 H210" stroke="#d6efff" stroke-width="5" stroke-linecap="round"/>`);

export const treasure = (x, y, s = 1) => at(x, y, s, false,
  `<rect x="-60" y="-60" width="120" height="60" rx="6" fill="#b5651d" ${L}/>` +
  `<path d="M-60 -60 Q0 -100 60 -60" fill="#c9782a" ${L}/>` +
  `<rect x="-10" y="-50" width="20" height="22" fill="#f6d36b" ${L}/>` +
  [[-90, -6], [-74, -16], [80, -8], [96, -18], [-50, -96], [40, -100]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="11" fill="#f6d36b" ${line(2.5)}/>`).join('') +
  `<path d="M-6 -86 l6 -14 l6 14 l14 2 l-10 10 l2 14 l-12 -7 l-12 7 l2 -14 l-10 -10z" fill="#9ad0ff" ${line(2)}/>`);

export const sweat = (x, y) => `<path d="M${x} ${y} q-8 12 0 18 q8 -6 0 -18z" fill="#7cc4f2" ${line(2)}/>`;
export const hearts = (x, y) => [0, 1].map((i) => at(x + i * 30, y - i * 24, 0.8 + i * 0.2, false,
  `<path d="M0 6 C-14 -6 -10 -18 0 -10 C10 -18 14 -6 0 6z" fill="#ff7a8a"/>`)).join('');


// ---------- 通用人物 ----------
// 手的位置相對於肩膀高度 sh（大人 -96、小孩 -80）
const ARMS_REL = {
  down: [[-26, 8, -36, 51], [26, 8, 36, 51]],
  up: [[-26, 8, -52, -74], [26, 8, 52, -74]], // 雙手舉高（歡呼、舉東西）
  hold: [[-26, 8, 4, 34], [26, 8, 24, 36]], // 抱東西在胸前
  point: [[-26, 8, -36, 51], [26, 8, 70, -14]], // 右手往前指
  raise: [[-26, 8, -36, 51], [26, 8, 40, -64]], // 右手舉高（拿劍、揮手）
  reach: [[-26, 8, 40, 30], [26, 8, 74, 20]], // 雙手往前伸（給東西、拿東西）
  hips: [[-26, 8, -40, 40], [26, 8, 40, 40]], // 叉腰
};
export const armsAt = (pose, c, sh, skin = SKIN) => (ARMS_REL[pose] || ARMS_REL.down)
  .map(([sx, sy, hx, hy]) =>
    `<path d="M${sx} ${sh + sy} L${hx} ${sh + hy}" stroke="${INK}" stroke-width="22" stroke-linecap="round"/>` +
    `<path d="M${sx} ${sh + sy} L${hx} ${sh + hy}" stroke="${c}" stroke-width="16" stroke-linecap="round"/>` +
    `<circle cx="${hx}" cy="${sh + hy}" r="8" fill="${skin}" ${line(2.5)}/>`).join('');

// 手的位置（給道具定位用）：hand('raise', 'adult') → 右手的 [x, y]；which = 0 是左手
export function hand(pose = 'down', age = 'adult', which = 1) {
  const sh = age === 'child' ? -80 : -96;
  const [, , hx, hy] = (ARMS_REL[pose] || ARMS_REL.down)[which];
  return [hx, sh + hy];
}

const HAIR_FRONT = (c) => `<path d="M-31 2 Q-32 -32 0 -32 Q32 -32 31 2 Q20 -22 0 -20 Q-20 -22 -31 2z" fill="${c}" ${line(2.5)}/>`;

// 人物：大人約 160 高、小孩約 140 高（頭頂含頭髮）
// age: adult / child
// outfit: robe（長袍、和服、漢服）/ dress（洋裝、裙子）/ shirt（上衣 + 長褲）/ tunic（短袍 + 褲子）
// hair: short / long / bun / topknot / pigtails / bald / curly / none
// hat: '' / crown / hood / straw / pointy / cap / helmet / scarf，hatColor 決定顏色；也可以直接給 SVG 字串（頭部座標，頭半徑 30）
// beard: '' 或鬍子顏色；apron: '' 或圍裙顏色；item: 畫在手臂上面的道具（身體座標，可用 hand() 找手的位置）
export function person({
  age = 'adult', skin = SKIN, hair = 'short', hairColor = '#3a2a22', hat = '', hatColor = '#e2483d',
  outfit = 'robe', top = '#5b8fd0', bottom = '#3d5a99', apron = '', beard = '',
  mood = 'happy', pose = 'down', item = '', shoes = INK,
} = {}) {
  const child = age === 'child';
  const sh = child ? -80 : -96;
  const hy = sh - 32;
  let body = '';
  if (outfit === 'robe') {
    body = `<path d="M-36 -6 L-30 ${sh} Q0 ${sh - 12} 30 ${sh} L36 -6z" fill="${top}" ${L}/>` +
      `<path d="M0 ${sh - 4} L-10 ${sh + 34} M0 ${sh - 4} L10 ${sh + 34}" ${line(2.5)}/>` +
      `<rect x="-32" y="${sh + 36}" width="64" height="11" fill="${bottom}" ${L}/>`;
  } else if (outfit === 'dress') {
    body = `<path d="M-22 ${sh} Q0 ${sh - 10} 22 ${sh} L24 ${sh + 38} L46 -10 Q0 2 -46 -10 L-24 ${sh + 38}z" fill="${top}" ${L}/>` +
      `<path d="M-24 ${sh + 38} Q0 ${sh + 44} 24 ${sh + 38}" fill="none" ${line(2.5)}/>`;
  } else {
    const len = outfit === 'tunic' ? (child ? 60 : 72) : (child ? 42 : 50);
    body = `<rect x="-23" y="${sh + 30}" width="20" height="${-sh - 34}" fill="${bottom}" ${L}/>` +
      `<rect x="3" y="${sh + 30}" width="20" height="${-sh - 34}" fill="${bottom}" ${L}/>` +
      `<path d="M-28 ${sh + len} L-26 ${sh} Q0 ${sh - 10} 26 ${sh} L28 ${sh + len}z" fill="${top}" ${L}/>` +
      (outfit === 'tunic' ? `<rect x="-28" y="${sh + 36}" width="56" height="8" fill="#6b4a2f" ${line(2)}/>` : '');
  }
  if (apron) body += `<path d="M-20 ${sh + 30} H20 L24 -14 H-24z" fill="${apron}" ${L}/>`;

  // 頭
  const custom = typeof hat === 'string' && hat.startsWith('<');
  const hatType = custom ? '' : hat;
  let back = '', front = '';
  if (hair === 'long') back += `<path d="M-32 -4 Q-36 -38 0 -38 Q36 -38 32 -4 L38 46 Q0 56 -38 46z" fill="${hairColor}" ${L}/>`;
  if (hair === 'bun') back += `<circle cx="0" cy="-34" r="13" fill="${hairColor}" ${L}/>`;
  if (hair === 'topknot') back += `<circle cx="0" cy="-36" r="10" fill="${hairColor}" ${L}/>`;
  if (hair === 'pigtails') back += `<circle cx="-36" cy="8" r="12" fill="${hairColor}" ${L}/><circle cx="36" cy="8" r="12" fill="${hairColor}" ${L}/>`;
  if (hatType === 'hood') back += `<path d="M-42 26 Q-48 -46 0 -48 Q48 -46 42 26 L46 64 Q0 74 -46 64z" fill="${hatColor}" ${L}/>`;
  if (['short', 'long', 'bun', 'topknot', 'pigtails'].includes(hair)) front += HAIR_FRONT(hairColor);
  if (hair === 'bald') front += `<path d="M-30 -2 q-6 -16 4 -24 M30 -2 q6 -16 -4 -24" fill="${hairColor}" ${line(2)}/>`;
  if (hair === 'curly') front += [-24, -12, 0, 12, 24].map((x, i) => `<circle cx="${x}" cy="${-26 - (i % 2) * 4}" r="11" fill="${hairColor}" ${line(2)}/>`).join('') +
    `<circle cx="-30" cy="-10" r="9" fill="${hairColor}" ${line(2)}/><circle cx="30" cy="-10" r="9" fill="${hairColor}" ${line(2)}/>`;
  let hatSvg = custom ? hat : '';
  if (hatType === 'crown') hatSvg = `<path d="M-24 -24 L-24 -50 L-12 -38 L0 -56 L12 -38 L24 -50 L24 -24z" fill="#f6d36b" ${L}/><circle cx="0" cy="-34" r="4" fill="#e2483d"/>`;
  if (hatType === 'hood') hatSvg = `<path d="M-35 6 Q-38 -40 0 -40 Q38 -40 35 6" fill="none" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M-35 6 Q-38 -40 0 -40 Q38 -40 35 6" fill="none" stroke="${hatColor}" stroke-width="9" stroke-linecap="round"/>`;
  if (hatType === 'straw') hatSvg = `<path d="M-54 -16 L0 -52 L54 -16z" fill="#e2c27a" ${L}/>`;
  if (hatType === 'pointy') hatSvg = `<ellipse cx="0" cy="-24" rx="44" ry="9" fill="${hatColor}" ${L}/><path d="M-28 -26 L6 -104 L28 -26z" fill="${hatColor}" ${L}/>`;
  if (hatType === 'cap') hatSvg = `<path d="M-32 -12 Q-30 -46 0 -46 Q30 -46 32 -12z" fill="${hatColor}" ${L}/><path d="M20 -14 Q44 -16 48 -8 H24z" fill="${hatColor}" ${L}/>`;
  if (hatType === 'helmet') hatSvg = `<path d="M-34 -2 Q-36 -46 0 -46 Q36 -46 34 -2z" fill="#b8c2cc" ${L}/><path d="M0 -46 V-2" ${line(2)}/>`;
  if (hatType === 'scarf') hatSvg = `<path d="M-33 4 Q-36 -40 0 -40 Q36 -40 33 4 Q24 -24 0 -24 Q-24 -24 -33 4z" fill="${hatColor}" ${L}/>`;
  const beardSvg = beard ? `<path d="M-20 14 Q0 52 20 14 Q10 24 0 22 Q-10 24 -20 14z" fill="${beard}" ${line(2)}/>` : '';
  const head = at(0, hy, 1, false, back + `<circle r="30" fill="${skin}" ${L}/>` + front + face(30, mood) + beardSvg + hatSvg);
  return feet(shoes) + body + armsAt(pose, top, sh, skin) + item + head;
}

// ---------- 更多背景 ----------
// 夜空：深色漸層 + 星星
export function stars(n = 40, c = '#fff6c8') {
  let out = '';
  for (let i = 0; i < n; i++) {
    const x = ((i * 397) % 2400) - 800, y = ((i * 211) % 900) - 600;
    out += `<circle cx="${x}" cy="${y + 200}" r="${1.5 + (i % 3)}" fill="${c}" opacity="${0.5 + (i % 4) * 0.15}"/>`;
  }
  return out;
}
export const night = (top = '#1d2550', bottom = '#46508a') => sky(top, bottom) + stars();
export const moon = (x, y, r = 40, crescent = false) => crescent
  ? `<path d="M${x} ${y - r} A${r} ${r} 0 1 0 ${x} ${y + r} A${r * 0.8} ${r} 0 1 1 ${x} ${y - r}z" fill="#ffe9a6"/>`
  : `<circle cx="${x}" cy="${y}" r="${r + 16}" fill="#fff6c8" opacity=".25"/><circle cx="${x}" cy="${y}" r="${r}" fill="#fff1b8"/>` +
    `<circle cx="${x - r * 0.3}" cy="${y - r * 0.2}" r="${r * 0.18}" fill="#f2e2a0"/><circle cx="${x + r * 0.25}" cy="${y + r * 0.3}" r="${r * 0.12}" fill="#f2e2a0"/>`;

// 一排森林（背景）
export const forest = (y, c1 = '#5a9e5a', c2 = '#4a8a4f') =>
  Array.from({ length: 16 }, (_, i) => {
    const x = -700 + i * 150 + (i % 3) * 20, s = 0.8 + (i % 4) * 0.12;
    return at(x, y, s, false, `<path d="M0 -170 L-55 -40 H55z" fill="${i % 2 ? c1 : c2}"/><rect x="-7" y="-40" width="14" height="40" fill="#7a5638"/>`);
  }).join('');

// 西式小屋：紅屋頂、煙囪
export const cottage = (x, y, s = 1, { wall = '#f3e3c3', roof = '#c8553d', door = '#8c5a3a' } = {}) => at(x, y, s, false,
  `<rect x="60" y="-230" width="34" height="70" fill="#a0522d" ${L}/>` +
  `<rect x="-110" y="-130" width="220" height="130" fill="${wall}" ${L}/>` +
  `<path d="M-135 -125 L0 -235 L135 -125z" fill="${roof}" ${L}/>` +
  `<path d="M-25 0 V-80 Q0 -100 25 -80 V0z" fill="${door}" ${L}/><circle cx="14" cy="-40" r="4" fill="#f6d36b"/>` +
  `<rect x="-90" y="-100" width="44" height="44" fill="#bfe4ff" ${L}/><path d="M-68 -100 v44 M-90 -78 h44" ${line(2)}/>` +
  `<rect x="46" y="-100" width="44" height="44" fill="#bfe4ff" ${L}/><path d="M68 -100 v44 M46 -78 h44" ${line(2)}/>`);

// 城堡
export const castle = (x, y, s = 1, { wall = '#d9d4e8', roof = '#6b6fc0', flag = '#e2483d' } = {}) => at(x, y, s, false,
  [-130, 130].map((tx) => `<rect x="${tx - 35}" y="-260" width="70" height="260" fill="${wall}" ${L}/>` +
    `<path d="M${tx - 45} -258 L${tx} -340 L${tx + 45} -258z" fill="${roof}" ${L}/>` +
    `<path d="M${tx} -340 V-375" ${line(3)}/><path d="M${tx} -375 l28 8 l-28 8z" fill="${flag}" ${line(2)}/>` +
    `<rect x="${tx - 14}" y="-200" width="28" height="40" rx="14" fill="#5a5f8a" ${L}/>`).join('') +
  `<rect x="-95" y="-200" width="190" height="200" fill="${wall}" ${L}/>` +
  [-80, -40, 0, 40].map((bx) => `<rect x="${bx}" y="-222" width="30" height="24" fill="${wall}" ${L}/>`).join('') +
  `<path d="M-40 0 V-90 Q0 -130 40 -90 V0z" fill="#7a5638" ${L}/>` +
  `<rect x="-14" y="-160" width="28" height="40" rx="14" fill="#5a5f8a" ${L}/>`);

// 中式房子：白牆、灰瓦、翹屋簷
export const cnHouse = (x, y, s = 1, { wall = '#f5efe2', roof = '#6f7480', door = '#a8432f' } = {}) => at(x, y, s, false,
  `<rect x="-120" y="-120" width="240" height="120" fill="${wall}" ${L}/>` +
  `<rect x="-32" y="-90" width="64" height="90" fill="${door}" ${L}/><path d="M0 -90 V0" ${line(2)}/>` +
  `<circle cx="-8" cy="-45" r="3" fill="#f6d36b"/><circle cx="8" cy="-45" r="3" fill="#f6d36b"/>` +
  `<rect x="-100" y="-95" width="44" height="44" fill="#fff8e6" ${L}/><path d="M-78 -95 v44 M-100 -73 h44" ${line(2)}/>` +
  `<rect x="56" y="-95" width="44" height="44" fill="#fff8e6" ${L}/><path d="M78 -95 v44 M56 -73 h44" ${line(2)}/>` +
  `<path d="M-165 -108 Q-140 -118 -128 -150 H128 Q140 -118 165 -108 L150 -126 Q132 -148 122 -172 H-122 Q-132 -148 -150 -126z" fill="${roof}" ${L}/>` +
  `<path d="M-122 -172 Q0 -184 122 -172" fill="none" ${line(4)}/>`);

// 西式室內：條紋壁紙、木地板、窗戶（往上延伸的壁紙放文字）
export const room = ({ wall = '#f6e3c8', stripe = '#efd5b2', floor = '#c99a6b', window: win = true } = {}) =>
  `<rect x="${BX}" y="${BY}" width="${BW}" height="${H - BY}" fill="${wall}"/>` +
  Array.from({ length: 30 }, (_, i) => `<rect x="${-1000 + i * 100}" y="${BY}" width="40" height="${380 - BY}" fill="${stripe}"/>`).join('') +
  (win ? `<rect x="540" y="190" width="150" height="130" fill="#bfe4ff" ${L}/><path d="M615 190 v130 M540 255 h150" ${line(3)}/>` : '') +
  `<rect x="${BX}" y="380" width="${BW}" height="${H - 380}" fill="${floor}"/>` +
  [0, 1, 2, 3, 4].map((i) => `<path d="M${BX} ${410 + i * 45} H${BX + BW}" stroke="#b5875a" stroke-width="3"/>`).join('') +
  `<path d="M${BX} 380 H${BX + BW}" ${line(4)}/>`;

// 木柵欄
export const fence = (x, y, w = 300) =>
  `<path d="M${x} ${y - 40} h${w} M${x} ${y - 18} h${w}" stroke="${INK}" stroke-width="10"/><path d="M${x} ${y - 40} h${w} M${x} ${y - 18} h${w}" stroke="#d9b27c" stroke-width="5"/>` +
  Array.from({ length: Math.floor(w / 40) + 1 }, (_, i) => `<path d="M${x + i * 40 - 8} ${y} V${y - 52} l8 -10 l8 10 V${y}z" fill="#e8c792" ${line(2.5)}/>`).join('');

// 小鳥（背景點綴用）
export const bird = (x, y, s = 1, c = '#5b8fd0') => at(x, y, s, false,
  `<ellipse cx="0" cy="0" rx="16" ry="12" fill="${c}" ${line(2.5)}/><circle cx="12" cy="-8" r="8" fill="${c}" ${line(2.5)}/>` +
  `<path d="M19 -9 l8 2 l-8 3z" fill="#f2c14e"/><circle cx="14" cy="-9" r="2" fill="${INK}"/><path d="M-4 -4 q-6 -14 -16 -6" fill="none" ${line(2.5)}/>`);

// ---------- 輸出 ----------
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

// 把 pages（{ cover: svg 字串, '01': ..., '02': ... }）寫到 public/books/<id>/，
// 加 --sheet 參數時另外產生預覽圖 tools/scenes/_preview/<id>.png（需要 Microsoft Edge）
export function writeBook(id, pages) {
  const out = join(ROOT, 'public/books', id);
  mkdirSync(out, { recursive: true });
  for (const f of readdirSync(out)) if (f.endsWith('.svg')) rmSync(join(out, f));
  for (const [name, content] of Object.entries(pages)) writeFileSync(join(out, name + '.svg'), content);
  console.log(`${id}：畫好了 ${Object.keys(pages).length} 張`);
  if (process.argv.includes('--sheet')) sheet(id, Object.keys(pages));
}

// 預覽圖：每頁用 iPad 橫向的比例顯示，紅色虛線以上會被文字蓋住；最下面一列是手機直向
function sheet(id, names) {
  const edge = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
  if (!edge) { console.log('找不到 Microsoft Edge，略過預覽圖'); return; }
  // Edge 的截圖路徑不能有中文，所以先在暫存資料夾做
  const tmp = join(process.env.LOCALAPPDATA || 'C:/Temp', 'Temp', 'storybook-sheet', id);
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });
  for (const n of names) copyFileSync(join(ROOT, 'public/books', id, n + '.svg'), join(tmp, n + '.svg'));
  const tile = (n) => `<figure><div class="land"><img src="${n}.svg"><i></i></div><figcaption>${n}</figcaption></figure>`;
  const html = `<!doctype html><meta charset="utf-8"><style>
body{margin:0;padding:8px;background:#333;color:#fff;font:14px sans-serif;display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
figure{margin:0}.land{position:relative;aspect-ratio:1.57}img{width:100%;height:100%;object-fit:fill;display:block}
i{position:absolute;left:0;right:0;top:0;height:30%;border-bottom:2px dashed #f33;background:rgba(255,0,0,.08)}
.phones{grid-column:1/-1;display:flex;gap:6px;flex-wrap:wrap}.phones div{width:110px;height:190px}.phones img{width:100%;height:100%;object-fit:fill}
</style>${names.map(tile).join('')}<div class="phones">${names.map((n) => `<div><img src="${n}.svg"></div>`).join('')}</div>`;
  writeFileSync(join(tmp, 'sheet.html'), html);
  const rows = Math.ceil(names.length / 4);
  const png = join(tmp, 'sheet.png');
  execFileSync(edge, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--user-data-dir=${join(tmp, 'profile')}`,
    `--window-size=1400,${rows * 235 + 230}`, `--screenshot=${png}`, 'file:///' + join(tmp, 'sheet.html').replace(/\\/g, '/')], { stdio: 'ignore' });
  const dest = join(ROOT, 'tools/scenes/_preview');
  mkdirSync(dest, { recursive: true });
  copyFileSync(png, join(dest, id + '.png'));
  console.log(`預覽圖：tools/scenes/_preview/${id}.png`);
}
