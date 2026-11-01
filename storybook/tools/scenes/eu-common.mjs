// 歐洲故事共用：動物、道具、背景（小紅帽、醜小鴨、龜兔賽跑、灰姑娘、國王的新衣）
// 角色一樣以「腳底中心」為原點、面向右邊。

import { BX, BW, BY, H, INK, line, L, SKIN, at, face, armsAt, sparkle } from './lib.mjs';

// ---------- 小東西 ----------
export const txt = (x, y, s, size = 40, c = INK) =>
  `<text x="${x}" y="${y}" font-size="${size}" font-weight="700" fill="${c}" text-anchor="middle" font-family="sans-serif" stroke="#fff" stroke-width="6" paint-order="stroke" stroke-linejoin="round">${s}</text>`;
export const zzz = (x, y, s = 1) => at(x, y, s, false,
  [[0, 0, 22], [24, -26, 28], [54, -58, 34]].map(([dx, dy, f]) =>
    `<text x="${dx}" y="${dy}" font-size="${f}" font-weight="700" fill="#5b8fd0" font-family="sans-serif" stroke="#fff" stroke-width="5" paint-order="stroke">Z</text>`).join(''));
export const speed = (x, y, n = 3, len = 60) =>
  Array.from({ length: n }, (_, i) => `<path d="M${x - i * 8} ${y + i * 22} h${-len + i * 10}" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".9"/>`).join('');
export const flower = (x, y, s = 1, c = '#ff8fb1') => at(x, y, s, false,
  `<path d="M0 0 V-26" stroke="#5f9f4f" stroke-width="4"/>` +
  [0, 72, 144, 216, 288].map((a) => `<circle cx="${Math.cos(a * Math.PI / 180) * 9}" cy="${-30 + Math.sin(a * Math.PI / 180) * 9}" r="7" fill="${c}" ${line(1.5)}/>`).join('') +
  `<circle cx="0" cy="-30" r="5" fill="#ffd25e"/>`);
export const flowers = (y, xs, cs = ['#ff8fb1', '#ffd25e', '#b98ae0', '#fff']) => xs.map((x, i) => flower(x, y + (i % 3) * 8, 0.9 + (i % 2) * 0.2, cs[i % cs.length])).join('');

// 籃子（拿在手上：放在手的位置，提把往上）
export const basket = (x, y, s = 1) => at(x, y, s, false,
  `<path d="M-22 -6 Q0 -46 22 -6" fill="none" stroke="${INK}" stroke-width="7"/><path d="M-22 -6 Q0 -46 22 -6" fill="none" stroke="#c99a5a" stroke-width="3.5"/>` +
  `<ellipse cx="-6" cy="-6" rx="10" ry="7" fill="#e8b170" ${line(2)}/><path d="M6 -16 l4 -12 h6 l2 12z" fill="#e2483d" ${line(2)}/>` +
  `<path d="M-26 -6 H26 L20 22 H-20z" fill="#c99a5a" ${L}/><path d="M-23 4 H23 M-21 13 H21" stroke="#a67f3f" stroke-width="2.5"/>`);

// 床：頭在左邊。content 畫在棉被下面（身體座標），blanket 決定棉被樣子
export const bed = (x, y, s = 1, { head = '', belly = 0, quilt = '#f2b8c6' } = {}) => at(x, y, s, false,
  `<rect x="-200" y="-150" width="22" height="150" rx="6" fill="#a0683e" ${L}/><path d="M-200 -140 Q-189 -175 -178 -140" fill="#a0683e" ${L}/>` +
  `<rect x="160" y="-90" width="20" height="90" rx="6" fill="#a0683e" ${L}/>` +
  `<rect x="-180" y="-70" width="345" height="40" fill="#fff8ec" ${L}/>` +
  `<rect x="-180" y="-34" width="345" height="16" fill="#a0683e" ${L}/>` +
  `<ellipse cx="-130" cy="-80" rx="48" ry="22" fill="#fff" ${L}/>` + head +
  `<path d="M-100 -30 V-72 Q-80 -80 -60 -80 C-50 ${-80 - belly * 1.3} 80 ${-80 - belly * 1.3} 90 -80 Q130 -84 170 -72 V-30z" fill="${quilt}" ${L}/>` +
  [-40, 20, 80, 130].map((dx) => `<circle cx="${dx}" cy="-46" r="5" fill="#fff" opacity=".8"/>`).join(''));

// ---------- 大野狼 ----------
const WC = '#8d8f9e', WB = '#dcdde4';
// 狼頭（頭的座標，半徑 30），面向右；ears / eyes / mouth: 'big' 放大強調
export function wolfHead({ mood = 'grin', cap = false, ears = 1, eyes = 1, mouth = 1 } = {}) {
  const earSvg = at(0, 0, 1, false,
    `<path d="M${-26} -14 L${-24 - 6 * ears} ${-30 - 26 * ears} L-4 -26z" fill="${WC}" ${L}/><path d="M-21 -20 L${-22 - 4 * ears} ${-30 - 18 * ears} L-10 -26z" fill="#f2b8c6"/>` +
    `<path d="M6 -26 L${16 + 6 * ears} ${-30 - 26 * ears} L26 -12z" fill="${WC}" ${L}/><path d="M11 -25 L${17 + 4 * ears} ${-30 - 18 * ears} L22 -16z" fill="#f2b8c6"/>`);
  const capSvg = cap
    ? `<path d="M-30 -16 Q-26 -46 4 -44 Q30 -42 30 -18 Q0 -28 -30 -16z" fill="#fff" ${L}/>` +
      `<path d="M-32 -16 q5 6 10 0 q5 6 10 0 q5 6 10 0 q5 6 10 0 q5 6 10 0 q5 6 10 0" fill="none" ${line(2)}/>` +
      `<path d="M0 -42 Q-28 -60 -48 -42" fill="none" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M0 -42 Q-28 -60 -48 -42" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round"/>` +
      `<circle cx="-50" cy="-38" r="8" fill="#f2b8c6" ${line(2)}/>`
    : '';
  const er = 4 * eyes;
  let eyeSvg;
  if (mood === 'sleep') eyeSvg = [-6, 14].map((x) => `<path d="M${x - 7} -6 q7 6 14 0" fill="none" ${line(3)}/>`).join('');
  else if (mood === 'scared') eyeSvg = [-6, 14].map((x) => `<circle cx="${x}" cy="-6" r="9" fill="#fff" ${line(2)}/><circle cx="${x + 2}" cy="-6" r="3" fill="${INK}"/>`).join('');
  else if (eyes > 1) eyeSvg = [-8, 16].map((x) => `<circle cx="${x}" cy="-8" r="${5 + 6 * eyes}" fill="#fff" ${line(2.5)}/><circle cx="${x + 3}" cy="-6" r="${3 + 2 * eyes}" fill="${INK}"/>`).join('');
  else eyeSvg = [-6, 14].map((x) => `<circle cx="${x}" cy="-6" r="${er}" fill="${INK}"/>`).join('') +
    (mood === 'grin' ? `<path d="M-14 -16 L0 -12 M8 -13 L22 -17" ${line(3)}/>` : '');
  let mouthSvg;
  if (mouth > 1) mouthSvg = `<path d="M8 12 Q30 ${20 + 26 * mouth} 62 8 Q40 22 8 12z" fill="#c94f4f" ${L}/>` +
    `<path d="M16 15 l5 9 l4 -8 M34 18 l4 9 l5 -10 M50 15 l3 8 l4 -10" fill="#fff" ${line(1.5)}/>`;
  else if (mood === 'scared') mouthSvg = `<ellipse cx="34" cy="20" rx="9" ry="7" fill="#c94f4f" ${line(2.5)}/>`;
  else if (mood === 'sleep') mouthSvg = `<path d="M20 18 q12 6 24 0" fill="none" ${line(2.5)}/>`;
  else mouthSvg = `<path d="M14 16 Q34 30 54 14" fill="none" ${line(2.5)}/><path d="M24 20 l3 7 l3 -6" fill="#fff" ${line(1.5)}/>`;
  return earSvg + `<circle r="30" fill="${WC}" ${L}/>` +
    `<path d="M4 -2 Q40 -14 62 0 Q66 16 44 22 Q14 26 4 14z" fill="${WB}" ${L}/>` +
    `<ellipse cx="60" cy="0" rx="8" ry="6" fill="${INK}"/>` +
    `<ellipse cx="-14" cy="12" rx="6" ry="4" fill="#f2b8c6" opacity=".7"/>` +
    capSvg + eyeSvg + mouthSvg;
}

// 站著的大野狼；gown = true 穿奶奶的睡衣
export function wolf({ mood = 'grin', pose = 'down', gown = false, cap = false, run = false, belly = false, item = '', ears = 1, eyes = 1, mouth = 1 } = {}) {
  const sh = -96;
  const tail = `<path d="M-24 -40 Q-80 -40 -92 -96 Q-64 -78 -30 -66z" fill="${WC}" ${L}/><path d="M-86 -88 Q-80 -80 -70 -76" fill="none" stroke="${WB}" stroke-width="6" stroke-linecap="round"/>`;
  const legs = run
    ? `<path d="M-6 -36 L-44 -8" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M-6 -36 L-44 -8" stroke="${WC}" stroke-width="15" stroke-linecap="round"/>` +
      `<path d="M6 -36 L36 -4" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M6 -36 L36 -4" stroke="${WC}" stroke-width="15" stroke-linecap="round"/>` +
      `<ellipse cx="-50" cy="-6" rx="14" ry="7" fill="#5f6170"/><ellipse cx="44" cy="-2" rx="14" ry="7" fill="#5f6170"/>`
    : `<rect x="-22" y="-44" width="18" height="40" fill="${WC}" ${L}/><rect x="4" y="-44" width="18" height="40" fill="${WC}" ${L}/>` +
      `<ellipse cx="-14" cy="-4" rx="15" ry="7" fill="#5f6170"/><ellipse cx="14" cy="-4" rx="15" ry="7" fill="#5f6170"/>`;
  const bw = belly ? 52 : 34;
  const body = gown
    ? `<path d="M-24 ${sh} Q0 ${sh - 10} 24 ${sh} L${bw + 6} -24 Q0 -12 ${-bw - 6} -24z" fill="#f6d0e0" ${L}/>` +
      `<path d="M${-bw - 6} -24 q8 8 16 0 q8 8 16 0 q8 8 16 0 q8 8 16 0 q8 8 16 0 q8 8 16 0 q8 8 16 0" fill="none" ${line(2)}/>` +
      [[-12, -70], [12, -52], [-16, -40], [16, -80]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="4" fill="#fff"/>`).join('')
    : `<ellipse cx="0" cy="-62" rx="${bw}" ry="46" fill="${WC}" ${L}/><ellipse cx="4" cy="-56" rx="${bw * 0.6}" ry="32" fill="${WB}"/>`;
  return tail + legs + body + armsAt(pose, gown ? '#f6d0e0' : WC, sh, WB) + item +
    at(4, -132, 1, false, wolfHead({ mood, cap, ears, eyes, mouth }));
}

// ---------- 鴨子、天鵝、雞 ----------
// 正面圓頭 + 扁嘴巴；col 身體顏色
const beakFront = (r) => `<path d="M${-r * 0.42} ${r * 0.3} Q0 ${r * 0.14} ${r * 0.42} ${r * 0.3} Q${r * 0.3} ${r * 0.62} 0 ${r * 0.6} Q${-r * 0.3} ${r * 0.62} ${-r * 0.42} ${r * 0.3}z" fill="#f59a3c" ${line(2.5)}/>`;
const beakOpen = (r) => `<path d="M${-r * 0.42} ${r * 0.26} Q0 ${r * 0.1} ${r * 0.42} ${r * 0.26} L${r * 0.3} ${r * 0.38} Q0 ${r * 0.3} ${-r * 0.3} ${r * 0.38}z" fill="#f59a3c" ${line(2.5)}/>` +
  `<path d="M${-r * 0.3} ${r * 0.5} Q0 ${r * 0.44} ${r * 0.3} ${r * 0.5} Q0 ${r * 0.9} ${-r * 0.3} ${r * 0.5}z" fill="#f59a3c" ${line(2.5)}/><path d="M${-r * 0.2} ${r * 0.48} Q0 ${r * 0.72} ${r * 0.2} ${r * 0.48}" fill="#c94f4f"/>`;
const eyesOnly = (r, mood) => {
  const ex = r * 0.38, ey = -r * 0.05;
  if (mood === 'happy' || mood === 'laugh') return [-1, 1].map((d) => `<path d="M${d * ex - 6} ${ey + 2} q6 -8 12 0" fill="none" ${line(3)}/>`).join('');
  if (mood === 'cry') return [-1, 1].map((d) => `<path d="M${d * ex - 6} ${ey} q6 5 12 0" fill="none" ${line(3)}/>` +
    `<path d="M${d * ex} ${ey + 6} q-4 10 0 16 q4 -6 0 -16z" fill="#7cc4f2"/>`).join('');
  if (mood === 'sad') return [-1, 1].map((d) => `<circle cx="${d * ex}" cy="${ey}" r="4" fill="${INK}"/><path d="M${d * (ex - 8)} ${ey - 12} L${d * (ex + 6)} ${ey - 8}" ${line(2.5)}/>`).join('');
  if (mood === 'scared') return [-1, 1].map((d) => `<circle cx="${d * ex}" cy="${ey}" r="6" fill="#fff" ${line(2)}/><circle cx="${d * ex}" cy="${ey}" r="2.5" fill="${INK}"/>`).join('');
  if (mood === 'sleep') return [-1, 1].map((d) => `<path d="M${d * ex - 6} ${ey} q6 5 12 0" fill="none" ${line(3)}/>`).join('');
  return [-1, 1].map((d) => `<circle cx="${d * ex}" cy="${ey}" r="4" fill="${INK}"/>`).join('');
};
const cheeks = (r, c = '#f5a3a3') => [-1, 1].map((d) => `<ellipse cx="${d * r * 0.6}" cy="${r * 0.25}" rx="${r * 0.15}" ry="${r * 0.1}" fill="${c}" opacity=".7"/>`).join('');
const duckHead = (r, col, mood, tuft = '') => `<circle r="${r}" fill="${col}" ${L}/>` + tuft + cheeks(r) + eyesOnly(r, mood) + (mood === 'laugh' ? beakOpen(r) : beakFront(r));

// 小鴨（黃色）
export function duckling({ mood = 'happy', col = '#ffd84a' } = {}) {
  return `<path d="M-10 -2 l-6 4 h12z M8 -2 l-6 4 h12z" fill="#f59a3c" ${line(2)}/>` +
    `<path d="M-32 -26 L-44 -38 L-28 -36z" fill="${col}" ${L}/>` +
    `<ellipse cx="-4" cy="-22" rx="30" ry="21" fill="${col}" ${L}/>` +
    `<path d="M-20 -26 q10 14 24 4" fill="none" ${line(2.5)}/>` +
    at(10, -54, 1, false, `<path d="M-2 -20 q4 -10 10 -4 q2 -8 8 -2" fill="none" ${line(2.5)}/>` + duckHead(20, col, mood));
}

// 醜小鴨：灰灰的、比較大、頭上亂毛；stage 1 是長大一點、羽毛比較白
export function uglyDuck({ mood = 'sad', stage = 0, wings = false } = {}) {
  const col = stage ? '#c9ccd2' : '#9b9ea6', dark = stage ? '#a8acb4' : '#7c7f88';
  const tuft = `<path d="M-6 -24 l-4 -16 l8 10 l4 -14 l4 14 l8 -10 l-4 16z" fill="${col}" ${line(2)}/>`;
  const wing = wings
    ? `<path d="M-10 -44 Q-64 -84 -44 -132 q12 6 12 18 q14 -2 14 16 q14 0 10 20 Q6 -70 8 -44z" fill="${dark}" ${L}/><path d="M-20 -70 l-16 -30 M-8 -66 l-6 -26" ${line(2)}/>`
    : `<path d="M-30 -36 q20 22 40 2" fill="none" ${line(2.5)}/><path d="M-42 -40 l-6 -10 l10 6 l2 -10 l6 10" fill="${dark}" ${line(2)}/>`;
  return `<path d="M-14 -2 l-8 5 h16z M10 -2 l-8 5 h16z" fill="#e88a2c" ${line(2)}/>` +
    `<path d="M-38 -34 L-56 -50 L-34 -46z" fill="${col}" ${L}/>` +
    `<ellipse cx="-6" cy="-30" rx="38" ry="28" fill="${col}" ${L}/>` + wing +
    at(14, -74, 1, false, duckHead(24, col, mood, tuft));
}

// 鴨媽媽（白色）
export function motherDuck({ mood = 'happy' } = {}) {
  return `<path d="M-16 -2 l-8 5 h18z M12 -2 l-8 5 h18z" fill="#f59a3c" ${line(2)}/>` +
    `<path d="M-50 -46 L-74 -64 L-46 -58z" fill="#fff" ${L}/>` +
    `<ellipse cx="-8" cy="-38" rx="52" ry="34" fill="#fff" ${L}/>` +
    `<path d="M-40 -46 q24 30 54 4" fill="#eef0f4" ${line(2.5)}/>` +
    `<path d="M24 -60 Q30 -80 24 -96" stroke="${INK}" stroke-width="28" stroke-linecap="round" fill="none"/><path d="M24 -60 Q30 -80 24 -96" stroke="#fff" stroke-width="22" stroke-linecap="round" fill="none"/>` +
    at(26, -110, 1, false, duckHead(28, '#fff', mood) + `<path d="M-10 -22 q-12 -10 -4 -16" fill="none" ${line(2.5)}/>` +
      '');
}

// 母雞
export function hen({ mood = 'laugh' } = {}) {
  return `<path d="M-12 -24 V-2 M10 -24 V-2" ${line(4)}/><path d="M-18 -2 h12 M4 -2 h12" ${line(3)}/>` +
    `<path d="M-40 -60 Q-70 -90 -56 -100 Q-44 -80 -30 -70z" fill="#fff" ${L}/>` +
    `<ellipse cx="-4" cy="-48" rx="40" ry="30" fill="#fff" ${L}/>` +
    `<path d="M-24 -54 q16 22 34 2" fill="none" ${line(2.5)}/>` +
    at(18, -92, 1, false, `<path d="M-14 -22 q2 -16 10 -10 q4 -14 12 -4 q8 -10 10 6z" fill="#e2483d" ${line(2.5)}/>` +
      `<circle r="24" fill="#fff" ${L}/>` + cheeks(24) + eyesOnly(24, mood) +
      (mood === 'laugh' ? `<path d="M-8 6 L8 6 L0 14z M-6 16 L6 16 L0 22z" fill="#f2c14e" ${line(2)}/>` : `<path d="M-7 6 L7 6 L0 16z" fill="#f2c14e" ${line(2)}/>`) +
      `<path d="M-4 18 q4 12 8 0" fill="#e2483d" ${line(2)}/>`);
}

// 天鵝（側面，浮在水上：原點是水面）；fly = 展翅飛
export function swan({ mood = 'happy', fly = false, look = 0, col = '#ffffff' } = {}) {
  if (fly) {
    // 飛行：身體橫的、脖子往前伸直、翅膀張開（原點是身體中心下方）
    const feather = (d) => `<path d="M-30 -40 Q${-60} ${-40 + d * 70} ${-10} ${-40 + d * 110} Q${0} ${-40 + d * 70} 20 -40z" fill="${col}" ${L}/>` +
      `<path d="M-20 ${-40 + d * 40} l-14 ${d * 30} M-4 ${-40 + d * 40} l-4 ${d * 40}" ${line(2)}/>`;
    return feather(-1) +
      `<path d="M-90 -36 l-24 -10 l4 14 l-6 10z" fill="${col}" ${L}/>` +
      `<ellipse cx="-20" cy="-36" rx="72" ry="24" fill="${col}" ${L}/>` +
      `<path d="M-92 -26 l-30 6 M-92 -20 l-28 10" stroke="#2f2a2a" stroke-width="4" stroke-linecap="round"/>` +
      `<path d="M44 -44 L104 -52" fill="none" stroke="${INK}" stroke-width="20" stroke-linecap="round"/><path d="M44 -44 L104 -52" fill="none" stroke="${col}" stroke-width="13" stroke-linecap="round"/>` +
      at(112, -54, 1, false, `<circle r="15" fill="${col}" ${L}/><path d="M8 -6 L34 2 L8 8z" fill="#f59a3c" ${line(2.5)}/><path d="M8 -7 Q14 0 8 8 Q2 0 8 -7z" fill="${INK}"/>` +
        `<path d="M-4 -4 q4 -6 8 0" fill="none" ${line(2.5)}/>`) +
      feather(0.7).replace(/fill="#ffffff"/, 'fill="#f0f2f6"');
  }
  const wing = fly
    ? `<path d="M-20 -40 Q-70 -150 10 -170 Q0 -110 20 -40z" fill="${col}" ${L}/><path d="M-6 -80 l-14 -40 M6 -80 l-2 -50" ${line(2)}/>`
    : `<path d="M-60 -40 Q-30 -76 30 -50 Q-10 -26 -60 -40z" fill="#f0f2f6" ${L}/>`;
  const neckEnd = look ? [62, -96] : [42, -112];
  const headPos = look ? [72, -84] : [52, -118];
  const eye = mood === 'happy' ? `<path d="M-4 -4 q4 -6 8 0" fill="none" ${line(2.5)}/>` : mood === 'sad' ? `<circle cx="0" cy="-2" r="3" fill="${INK}"/><path d="M-6 -10 l10 3" ${line(2)}/>` : `<circle cx="0" cy="-2" r="3" fill="${INK}"/>`;
  return `<path d="M-80 -22 Q-96 -54 -70 -40 Q-40 -10 40 -24 Q60 -28 54 -8 Q30 6 -40 4 Q-70 2 -80 -22z" fill="${col}" ${L}/>` +
    `<path d="M30 -24 Q${look ? 26 : 10} ${look ? -120 : -70} ${neckEnd[0]} ${neckEnd[1]}" fill="none" stroke="${INK}" stroke-width="20" stroke-linecap="round"/>` +
    `<path d="M30 -24 Q${look ? 26 : 10} ${look ? -120 : -70} ${neckEnd[0]} ${neckEnd[1]}" fill="none" stroke="${col}" stroke-width="13" stroke-linecap="round"/>` +
    wing +
    at(headPos[0], headPos[1], 1, false, `<g transform="rotate(${look ? 55 : 0})"><circle r="15" fill="${col}" ${L}/>` +
      `<path d="M8 -6 L34 2 L8 8z" fill="#f59a3c" ${line(2.5)}/><path d="M8 -7 Q14 0 8 8 Q2 0 8 -7z" fill="${INK}"/>` +
      `<ellipse cx="-4" cy="6" rx="4" ry="2.5" fill="#f5a3a3" opacity=".8"/>` + `<g transform="translate(0 0)">${eye}</g></g>`);
}

// ---------- 龜兔賽跑 ----------
const HC = '#d9b48a';
// 兔子：pose = stand / hips / run / sleep / point / bow；mood 同 face()
export function hare({ mood = 'happy', pose = 'stand' } = {}) {
  const ears = (tilt = 0) => `<g transform="rotate(${tilt})">` +
    `<ellipse cx="-12" cy="-58" rx="10" ry="32" fill="${HC}" ${L} transform="rotate(-10 -12 -30)"/><ellipse cx="-12" cy="-58" rx="4.5" ry="22" fill="#f6b6c4" transform="rotate(-10 -12 -30)"/>` +
    `<ellipse cx="12" cy="-58" rx="10" ry="32" fill="${HC}" ${L} transform="rotate(14 12 -30)"/><ellipse cx="12" cy="-58" rx="4.5" ry="22" fill="#f6b6c4" transform="rotate(14 12 -30)"/></g>`;
  const head = (m, tilt = 0) => ears(tilt) + `<circle r="28" fill="${HC}" ${L}/><ellipse cx="0" cy="12" rx="14" ry="10" fill="#fff6ea"/>` +
    face(26, m) + `<ellipse cx="0" cy="5" rx="4" ry="3" fill="#e27a8a"/>`;
  const sleepFace = ears(-30) + `<circle r="28" fill="${HC}" ${L}/><ellipse cx="0" cy="12" rx="14" ry="10" fill="#fff6ea"/>` +
    cheeks(26) + eyesOnly(26, 'sleep') + `<ellipse cx="0" cy="5" rx="4" ry="3" fill="#e27a8a"/><ellipse cx="0" cy="15" rx="4" ry="5" fill="#c94f4f" ${line(2)}/>`;
  const limb = (x1, y1, x2, y2, w = 16) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${INK}" stroke-width="${w + 6}" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="${HC}" stroke-width="${w}" stroke-linecap="round"/>`;
  const tail = (x, y) => `<circle cx="${x}" cy="${y}" r="12" fill="#fff" ${L}/>`;
  if (pose === 'run') {
    return `<g transform="rotate(14)">` + tail(-34, -50) + limb(-10, -30, -52, -8, 18) + `<ellipse cx="-60" cy="-6" rx="18" ry="8" fill="${HC}" ${L}/>` +
      limb(10, -30, 40, -10, 18) + `<ellipse cx="48" cy="-8" rx="18" ry="8" fill="${HC}" ${L}/>` +
      `<ellipse cx="0" cy="-56" rx="30" ry="36" fill="${HC}" ${L}/><ellipse cx="6" cy="-52" rx="16" ry="24" fill="#fff6ea"/>` +
      limb(-16, -72, -46, -54, 12) + limb(16, -72, 46, -90, 12) +
      at(6, -112, 1, false, head(mood, -40)) + `</g>`;
  }
  if (pose === 'sleep') {
    return tail(-36, -14) + `<ellipse cx="-4" cy="-38" rx="32" ry="36" fill="${HC}" ${L}/><ellipse cx="2" cy="-34" rx="18" ry="24" fill="#fff6ea"/>` +
      `<ellipse cx="34" cy="-8" rx="26" ry="10" fill="${HC}" ${L}/><ellipse cx="-34" cy="-6" rx="20" ry="9" fill="${HC}" ${L}/>` +
      limb(-18, -56, 8, -30, 12) + limb(18, -56, 4, -28, 12) +
      at(-8, -92, 1, false, `<g transform="rotate(-18)">${sleepFace}</g>`);
  }
  const armsP = {
    stand: [[-18, -70, -30, -40], [18, -70, 30, -40]],
    hips: [[-18, -70, -38, -50], [18, -70, 38, -50]],
    point: [[-18, -70, -30, -40], [18, -70, 60, -96]],
    up: [[-18, -70, -44, -124], [18, -70, 44, -124]],
    bow: [[-18, -66, -6, -36], [18, -66, 10, -36]],
  }[pose] || [[-18, -70, -30, -40], [18, -70, 30, -40]];
  const hipsBits = pose === 'hips' ? `<circle cx="-38" cy="-50" r="0"/>` : '';
  return tail(-30, -34) + `<ellipse cx="-16" cy="-6" rx="18" ry="8" fill="${HC}" ${L}/><ellipse cx="18" cy="-6" rx="18" ry="8" fill="${HC}" ${L}/>` +
    `<ellipse cx="0" cy="-48" rx="30" ry="40" fill="${HC}" ${L}/><ellipse cx="4" cy="-44" rx="17" ry="27" fill="#fff6ea"/>` +
    armsP.map(([a, b, c, d]) => limb(a, b, c, d, 12)).join('') + hipsBits +
    at(0, pose === 'bow' ? -100 : -112, 1, false, `<g transform="rotate(${pose === 'bow' ? 18 : 0})">${head(mood)}</g>`);
}

// 烏龜：四隻腳、綠色殼
export function tortoise({ mood = 'happy', step = 0 } = {}) {
  const S = '#b8d98a';
  const leg = (x, d) => `<rect x="${x - 10}" y="-36" width="20" height="${34 + d}" rx="9" fill="${S}" ${L}/>`;
  return `<path d="M-58 -30 l-18 8 l16 4z" fill="${S}" ${L}/>` +
    leg(-40, step ? -6 : 0) + leg(-14, step ? 0 : -6) + leg(18, step ? -6 : 0) + leg(42, step ? 0 : -6) +
    `<path d="M50 -38 Q66 -44 72 -66" stroke="${INK}" stroke-width="28" stroke-linecap="round" fill="none"/><path d="M50 -38 Q66 -44 72 -66" stroke="${S}" stroke-width="21" stroke-linecap="round" fill="none"/>` +
    `<path d="M-62 -34 Q-58 -102 0 -104 Q58 -102 62 -34z" fill="#6aa84f" ${L}/>` +
    `<path d="M-30 -34 L-24 -64 L0 -76 L24 -64 L30 -34 M-24 -64 L-52 -54 M24 -64 L52 -54 M0 -76 L0 -102" fill="none" stroke="#4c8a3a" stroke-width="3.5" stroke-linejoin="round"/>` +
    `<path d="M-66 -34 H66 Q66 -22 56 -22 H-56 Q-66 -22 -66 -34z" fill="#a8cf7a" ${L}/>` +
    at(80, -80, 1, false, `<circle r="24" fill="${S}" ${L}/>` + face(22, mood));
}

// 貓頭鷹裁判：flag = true 舉旗子
export function owl({ mood = 'happy', flag = false, cheer = false } = {}) {
  const C = '#a5784e';
  const wingR = flag || cheer
    ? `<path d="M28 -70 Q60 -100 50 -130 Q34 -100 22 -88z" fill="${C}" ${L}/>`
    : `<path d="M30 -80 Q46 -50 28 -24 Q22 -50 22 -76z" fill="${C}" ${L}/>`;
  const wingL = cheer
    ? `<path d="M-28 -70 Q-60 -100 -50 -130 Q-34 -100 -22 -88z" fill="${C}" ${L}/>`
    : `<path d="M-30 -80 Q-46 -50 -28 -24 Q-22 -50 -22 -76z" fill="${C}" ${L}/>`;
  const fl = flag ? `<path d="M50 -126 V-200" ${line(5)}/><path d="M50 -200 h46 v32 h-46z" fill="#fff" ${L}/>` +
    `<path d="M50 -200 h12 v10 h-12z M74 -200 h12 v10 h-12z M62 -190 h12 v10 h-12z M86 -190 h10 v10 h-10z M50 -180 h12 v10 h-12z M74 -180 h12 v10 h-12z" fill="${INK}"/>` : '';
  return fl + `<path d="M-14 -4 l-6 6 M-10 -4 v8 M10 -4 v8 M14 -4 l6 6" ${line(3)}/>` +
    `<ellipse cx="0" cy="-60" rx="34" ry="56" fill="${C}" ${L}/><ellipse cx="0" cy="-48" rx="22" ry="36" fill="#f1dcb8"/>` +
    [-1, 0, 1].map((i) => `<path d="M${i * 10 - 5} ${-58 + Math.abs(i) * 4} q5 6 10 0" fill="none" stroke="#c9a679" stroke-width="2.5"/>`).join('') +
    wingL + wingR +
    at(0, -116, 1, false, `<path d="M-30 -20 L-36 -46 L-14 -28z M30 -20 L36 -46 L14 -28z" fill="${C}" ${L}/>` +
      `<ellipse cx="0" cy="0" rx="36" ry="30" fill="${C}" ${L}/>` +
      `<circle cx="-14" cy="-2" r="13" fill="#fff6e0" ${line(2)}/><circle cx="14" cy="-2" r="13" fill="#fff6e0" ${line(2)}/>` +
      (mood === 'happy' ? `<path d="M-20 -1 q6 -8 12 0 M8 -1 q6 -8 12 0" fill="none" ${line(3)}/>` : `<circle cx="-14" cy="-2" r="5" fill="${INK}"/><circle cx="14" cy="-2" r="5" fill="${INK}"/>`) +
      `<path d="M-5 10 L5 10 L0 20z" fill="#f2c14e" ${line(2)}/>` +
      `<path d="M-24 -26 h48 v-6 h-48z" fill="#3a3a4a"/><rect x="-14" y="-46" width="28" height="16" fill="#3a3a4a"/>`);
}

// 松鼠（觀眾）
export function squirrel({ mood = 'happy', up = false } = {}) {
  const C = '#c9773e';
  return `<path d="M-20 -20 Q-74 -30 -60 -90 Q-40 -120 -24 -96 Q-46 -80 -36 -50 Q-30 -36 -16 -34z" fill="${C}" ${L}/>` +
    `<ellipse cx="0" cy="-30" rx="22" ry="28" fill="${C}" ${L}/><ellipse cx="4" cy="-26" rx="12" ry="18" fill="#f6dcc0"/>` +
    `<ellipse cx="-10" cy="-3" rx="10" ry="5" fill="${C}" ${line(2)}/><ellipse cx="12" cy="-3" rx="10" ry="5" fill="${C}" ${line(2)}/>` +
    (up ? `<path d="M-12 -44 L-26 -78 M12 -44 L26 -78" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M-12 -44 L-26 -78 M12 -44 L26 -78" stroke="${C}" stroke-width="7" stroke-linecap="round"/>` : '') +
    at(4, -70, 1, false, `<path d="M-18 -10 L-14 -32 L-4 -18z M4 -18 L14 -32 L18 -10z" fill="${C}" ${L}/><circle r="20" fill="${C}" ${L}/><ellipse cx="0" cy="8" rx="11" ry="8" fill="#f6dcc0"/>` + face(18, mood));
}

// 終點：兩根柱子 + 布條
export const finishLine = (x, y, s = 1, broken = false) => at(x, y, s, false,
  `<rect x="-90" y="-150" width="10" height="150" fill="#d9b27c" ${L}/><rect x="80" y="-150" width="10" height="150" fill="#d9b27c" ${L}/>` +
  (broken
    ? `<path d="M-80 -60 q20 30 10 60 M80 -60 q-20 30 -10 60" fill="none" stroke="#e2483d" stroke-width="6" stroke-linecap="round"/>`
    : `<path d="M-80 -60 Q0 -48 80 -60" fill="none" stroke="#e2483d" stroke-width="6" stroke-linecap="round"/>`) +
  `<rect x="-86" y="-150" width="172" height="34" fill="#fff" ${L}/>` +
  Array.from({ length: 8 }, (_, i) => `<rect x="${-86 + i * 21.5}" y="${-150 + (i % 2) * 17}" width="21.5" height="17" fill="${INK}"/>`).join(''));

// ---------- 灰姑娘 ----------
export const slipper = (x, y, s = 1, rot = 0) => at(x, y, s, false, `<g transform="rotate(${rot})">` +
  `<path d="M-30 0 Q-34 -22 -14 -22 Q6 -18 22 -6 L30 -24 L34 -24 L32 0z" fill="#c9eeff" fill-opacity=".85" ${L}/>` +
  `<path d="M-22 -12 Q-10 -18 4 -10" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/></g>` + sparkle(18, -32, 0.5, '#fff'));

export const wand = (x1, y1, x2, y2) =>
  `<path d="M${x1} ${y1} L${x2} ${y2}" ${line(5)}/>` +
  at(x2, y2, 1, false, `<path d="M0 -16 L5 -5 L16 -5 L7 2 L10 14 L0 7 L-10 14 L-7 2 L-16 -5 L-5 -5z" fill="#ffd25e" ${line(2)}/>`);

export const pumpkin = (x, y, s = 1) => at(x, y, s, false,
  `<ellipse cx="-24" cy="-36" rx="30" ry="36" fill="#ef8a2c" ${L}/><ellipse cx="24" cy="-36" rx="30" ry="36" fill="#ef8a2c" ${L}/>` +
  `<ellipse cx="0" cy="-36" rx="26" ry="38" fill="#f59a3c" ${L}/>` +
  `<path d="M0 -72 q-2 -16 8 -24" fill="none" stroke="#5f8f3f" stroke-width="7" stroke-linecap="round"/><path d="M4 -76 q20 -16 30 4 q-16 6 -30 -4z" fill="#6cbd62" ${line(2)}/>`);

export const mouse = (x, y, s = 1, flip = false) => at(x, y, s, flip,
  `<path d="M-24 -10 Q-50 -10 -54 -30" fill="none" ${line(3)}/>` +
  `<ellipse cx="0" cy="-14" rx="26" ry="15" fill="#b9b4c4" ${L}/>` +
  `<circle cx="16" cy="-34" r="9" fill="#b9b4c4" ${L}/><circle cx="16" cy="-34" r="4" fill="#f6b6c4"/>` +
  `<path d="M14 -24 Q30 -26 38 -14 Q24 -8 14 -10z" fill="#b9b4c4" ${L}/><circle cx="38" cy="-15" r="3.5" fill="#e27a8a"/><circle cx="26" cy="-20" r="2.5" fill="${INK}"/>`);

// 白馬（側面，面向右）
export const horse = (x, y, s = 1, flip = false, { harness = true } = {}) => at(x, y, s, flip,
  [[-46, 0], [-24, 4], [32, 4], [52, 0]].map(([lx, d]) => `<rect x="${lx - 8}" y="-62" width="16" height="${60 + d}" rx="6" fill="#fff" ${L}/><rect x="${lx - 9}" y="${-8 + d}" width="18" height="8" rx="3" fill="#8a8a96"/>`).join('') +
  `<path d="M-70 -86 Q-100 -70 -96 -30 Q-84 -56 -66 -66z" fill="#f2e7c9" ${L}/>` +
  `<ellipse cx="0" cy="-80" rx="70" ry="32" fill="#fff" ${L}/>` +
  `<path d="M42 -96 L62 -150 L92 -140 L72 -84z" fill="#fff" ${L}/>` +
  `<path d="M58 -158 Q86 -170 112 -136 Q118 -122 104 -118 Q80 -122 64 -132z" fill="#fff" ${L}/>` +
  `<path d="M64 -160 l-4 -18 l14 12z" fill="#fff" ${L}/>` +
  `<path d="M60 -150 Q40 -130 44 -96 Q50 -120 66 -136z M62 -160 q-8 -4 -14 6" fill="#f2e7c9" ${line(2.5)}/>` +
  `<circle cx="84" cy="-146" r="3.5" fill="${INK}"/><ellipse cx="104" cy="-128" rx="5" ry="3" fill="#f5a3a3"/>` +
  (harness ? `<path d="M64 -132 L104 -124 M48 -108 Q60 -98 74 -96" fill="none" stroke="#c9a03a" stroke-width="5"/><circle cx="62" cy="-118" r="5" fill="#ffd25e" ${line(2)}/>` +
    `<path d="M68 -164 q6 -14 16 -10" fill="none" stroke="#ff8fb1" stroke-width="6" stroke-linecap="round"/>` : ''));

// 南瓜馬車
export const coach = (x, y, s = 1) => at(x, y, s, false,
  `<path d="M-120 -40 Q0 -20 120 -40" fill="none" stroke="${INK}" stroke-width="10"/><path d="M-120 -40 Q0 -20 120 -40" fill="none" stroke="#c9a03a" stroke-width="5"/>` +
  `<ellipse cx="-56" cy="-130" rx="58" ry="84" fill="#f2a43c" ${L}/><ellipse cx="56" cy="-130" rx="58" ry="84" fill="#f2a43c" ${L}/>` +
  `<ellipse cx="0" cy="-130" rx="62" ry="90" fill="#f7b24c" ${L}/>` +
  `<path d="M-30 -110 V-160 Q0 -186 30 -160 V-110z" fill="#bfe4ff" ${L}/><path d="M0 -178 V-110 M-30 -138 H30" ${line(2)}/>` +
  `<path d="M-12 -228 L-12 -248 L-4 -238 L0 -254 L4 -238 L12 -248 L12 -228z" fill="#ffd25e" ${L}/>` +
  `<path d="M-60 -60 Q0 -40 60 -60" fill="none" stroke="#c9a03a" stroke-width="6"/>` +
  [[-80, -30], [80, -30]].map(([wx, wy]) => `<circle cx="${wx}" cy="${wy}" r="32" fill="#fff4cc" ${L}/><circle cx="${wx}" cy="${wy}" r="8" fill="#c9a03a" ${line(2)}/>` +
    [0, 45, 90, 135].map((a) => `<path d="M${wx - Math.cos(a * Math.PI / 180) * 28} ${wy - Math.sin(a * Math.PI / 180) * 28} L${wx + Math.cos(a * Math.PI / 180) * 28} ${wy + Math.sin(a * Math.PI / 180) * 28}" stroke="#c9a03a" stroke-width="3"/>`).join('')).join(''));

// 時鐘（指在 12 點）；tower = true 畫成鐘塔頂
export const clock = (x, y, r = 50, { h = 12, m = 0 } = {}) => at(x, y, 1, false,
  `<circle r="${r + 8}" fill="#c9a03a" ${L}/><circle r="${r}" fill="#fffaf0" ${L}/>` +
  Array.from({ length: 12 }, (_, i) => {
    const a = i * 30 * Math.PI / 180;
    return `<circle cx="${Math.sin(a) * r * 0.8}" cy="${-Math.cos(a) * r * 0.8}" r="${i % 3 ? 2.5 : 4.5}" fill="${INK}"/>`;
  }).join('') +
  `<path d="M0 0 L${Math.sin(h * 30 * Math.PI / 180) * r * 0.5} ${-Math.cos(h * 30 * Math.PI / 180) * r * 0.5}" ${line(6)}/>` +
  `<path d="M0 0 L${Math.sin(m * 6 * Math.PI / 180) * r * 0.72} ${-Math.cos(m * 6 * Math.PI / 180) * r * 0.72}" ${line(4)}/>` +
  `<circle r="5" fill="${INK}"/>`);

export const broom = (x1, y1, x2, y2) =>
  `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="#b5884a" stroke-width="5" stroke-linecap="round"/>` +
  at(x2, y2, 1, false, `<path d="M-6 -4 L6 -4 L22 30 L-22 30z" fill="#e2c27a" ${L}/><path d="M-10 6 L-14 28 M0 6 V28 M10 6 L14 28" stroke="#b5884a" stroke-width="2.5"/>`);

export const fireplace = (x, y, s = 1, fire = true) => at(x, y, s, false,
  `<rect x="-120" y="-200" width="240" height="200" fill="#c48a6a" ${L}/>` +
  [0, 1, 2, 3, 4].map((r) => `<path d="M-120 ${-200 + r * 40} H120" stroke="#a8705a" stroke-width="2"/>` +
    [0, 1, 2, 3, 4].map((c) => -120 + c * 48 + (r % 2) * 24).filter((x) => x > -120 && x < 120).map((x) => `<path d="M${x} ${-200 + r * 40} v40" stroke="#a8705a" stroke-width="2"/>`).join('')).join('') +
  `<rect x="-140" y="-220" width="280" height="24" fill="#8c5a3a" ${L}/>` +
  `<path d="M-70 0 V-90 Q0 -150 70 -90 V0z" fill="#3a2a2a" ${L}/>` +
  (fire ? `<path d="M-40 -6 Q-50 -50 -20 -70 Q-20 -40 0 -50 Q-6 -90 24 -104 Q20 -60 44 -50 Q50 -20 40 -6z" fill="#ff9a3c"/><path d="M-20 -6 Q-24 -36 -4 -44 Q0 -24 14 -30 Q24 -16 20 -6z" fill="#ffd25e"/>` +
    `<path d="M-50 -6 H50" stroke="#7a5638" stroke-width="12" stroke-linecap="round"/>` : ''));

// 吊燈
export const chandelier = (x, y, s = 1) => at(x, y, s, false,
  `<path d="M0 -200 V-30" ${line(3)}/><path d="M-80 0 Q0 30 80 0" fill="none" stroke="#c9a03a" stroke-width="8"/>` +
  `<ellipse cx="0" cy="-10" rx="24" ry="14" fill="#ffd25e" ${L}/>` +
  [-80, -40, 0, 40, 80].map((cx) => `<rect x="${cx - 5}" y="${-22 + Math.abs(cx) * 0.15}" width="10" height="20" fill="#fff" ${line(2)}/><path d="M${cx} ${-30 + Math.abs(cx) * 0.15} q-5 -8 0 -14 q5 6 0 14z" fill="#ffb84a"/>`).join(''));

// 宮殿室內：紅色牆面、金色柱子、大理石地板
export const palaceRoom = ({ wall = '#c8504a', stripe = '#b8423e', floor = '#e9e0f0', curtains = true } = {}) =>
  `<rect x="${BX}" y="${BY}" width="${BW}" height="${H - BY}" fill="${wall}"/>` +
  Array.from({ length: 30 }, (_, i) => `<rect x="${-1000 + i * 100}" y="${BY}" width="50" height="${400 - BY}" fill="${stripe}"/>`).join('') +
  Array.from({ length: 12 }, (_, i) => `<path d="M${-1050 + i * 250} ${BY} V400" stroke="${INK}" stroke-width="30"/><path d="M${-1050 + i * 250} ${BY} V400" stroke="#f2c96a" stroke-width="24"/>`).join('') +
  (curtains ? `<path d="M${BX} ${BY} H40 Q30 200 70 330 Q20 340 ${BX} 360z M${BX + BW} ${BY} H760 Q770 200 730 330 Q780 340 ${BX + BW} 360z" fill="#7a3fa0" ${L}/>` : '') +
  `<rect x="${BX}" y="400" width="${BW}" height="${H - 400}" fill="${floor}"/>` +
  Array.from({ length: 30 }, (_, i) => `<path d="M${-1000 + i * 100} 400 L${-1000 + i * 100 + (i * 100 - 600) * 0.4} ${H}" stroke="#cfc4dc" stroke-width="3"/>`).join('') +
  `<path d="M${BX} 460 H${BX + BW} M${BX} 530 H${BX + BW}" stroke="#cfc4dc" stroke-width="3"/>` +
  `<path d="M${BX} 400 H${BX + BW}" ${line(4)}/>`;

// 紅地毯
export const carpet = (y = 400) => `<path d="M300 ${y} H500 L600 ${H} H200z" fill="#c8303a" ${L}/><path d="M314 ${y} H486 L578 ${H} M222 ${H} L314 ${y}" fill="none" stroke="#f2c96a" stroke-width="4"/>`;

// 王座
export const throne = (x, y, s = 1) => at(x, y, s, false,
  `<path d="M-60 -60 V-220 Q0 -270 60 -220 V-60z" fill="#c9a03a" ${L}/><path d="M-44 -70 V-210 Q0 -248 44 -210 V-70z" fill="#a8323e" ${L}/>` +
  `<rect x="-70" y="-70" width="140" height="30" rx="8" fill="#a8323e" ${L}/><rect x="-62" y="-40" width="14" height="40" fill="#c9a03a" ${L}/><rect x="48" y="-40" width="14" height="40" fill="#c9a03a" ${L}/>` +
  `<circle cx="0" cy="-236" r="10" fill="#e2483d" ${L}/>`);

// 一袋金子
export const goldBag = (x, y, s = 1) => at(x, y, s, false,
  `<path d="M-30 0 Q-40 -40 -12 -50 L-18 -62 H18 L12 -50 Q40 -40 30 0z" fill="#d9b27c" ${L}/><path d="M-14 -52 H14" ${line(4)}/>` +
  `<text x="0" y="-14" font-size="24" font-weight="700" fill="#a67f3f" text-anchor="middle" font-family="sans-serif">$</text>` +
  [[-40, -4], [40, -6], [-26, 6], [30, 8]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="9" fill="#f6d36b" ${line(2)}/>`).join(''));

// 街道：一排歐式房子
export const townRow = (y = 400) =>
  Array.from({ length: 14 }, (_, i) => {
    const x = -900 + i * 200, h = 180 + (i % 3) * 40, c = ['#f3d9b1', '#e8c4c0', '#cfe0c8', '#f6e7b8'][i % 4], r = ['#c8553d', '#7a6fa0', '#a0522d'][i % 3];
    return `<rect x="${x}" y="${y - h}" width="170" height="${h}" fill="${c}" ${L}/>` +
      `<path d="M${x - 10} ${y - h + 4} L${x + 85} ${y - h - 70} L${x + 180} ${y - h + 4}z" fill="${r}" ${L}/>` +
      [0, 1].map((k) => `<rect x="${x + 25 + k * 80}" y="${y - h + 30}" width="40" height="44" fill="#bfe4ff" ${L}/><path d="M${x + 45 + k * 80} ${y - h + 30} v44" ${line(2)}/>`).join('');
  }).join('');
