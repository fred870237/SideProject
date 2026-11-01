// 日本地區故事（金太郎、浦島太郎、一寸法師、輝夜姬）共用的動物、道具和背景。
// 只給這幾本書用，通用的東西在 lib.mjs。

import { BX, BW, BY, H, INK, line, L, SKIN, at, face, person } from './lib.mjs';

// 旋轉後放到畫面上
export const rot = (x, y, deg, s = 1, body = '') =>
  `<g transform="translate(${x} ${y}) rotate(${deg}) scale(${s})">${body}</g>`;

// 狀聲詞（只能放在 y > 200）
export const say = (x, y, t, size = 40, c = INK) =>
  `<text x="${x}" y="${y}" font-size="${size}" font-weight="700" fill="${c}" stroke="#fff" stroke-width="6" paint-order="stroke" stroke-linejoin="round" text-anchor="middle">${t}</text>`;

// 烏帽子（頭部座標）
export const eboshi = (c = '#2f2a2a') => `<path d="M-24 -22 Q-22 -66 6 -78 Q18 -52 24 -22z" fill="${c}" ${L}/><path d="M-26 -22 H26" ${line(4)}/>`;

// 武士刀插在腰間（身體座標，大人）
export const waistSword = `<path d="M-14 -50 L-66 -18" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M-14 -50 L-66 -18" stroke="#2f2a2a" stroke-width="6" stroke-linecap="round"/><path d="M-22 -58 l8 14" ${line(5)}/>`;

// ---------- 動物 ----------
export function bear({ mood = 'happy', pose = 'stand', arms = 'down' } = {}) {
  const C = '#9a6a44', F = '#ecd0a6';
  const head = (hx, hy, s = 1) => at(hx, hy, s, false,
    `<circle cx="-27" cy="-28" r="13" fill="${C}" ${L}/><circle cx="27" cy="-28" r="13" fill="${C}" ${L}/>` +
    `<circle cx="-27" cy="-28" r="6" fill="${F}"/><circle cx="27" cy="-28" r="6" fill="${F}"/>` +
    `<circle r="38" fill="${C}" ${L}/><ellipse cx="0" cy="15" rx="17" ry="12" fill="${F}" ${line(2)}/>` +
    `<ellipse cx="0" cy="9" rx="6" ry="4" fill="${INK}"/>` + face(34, mood, { cheek: '#e08a7a' }));
  const limb = (x1, y1, x2, y2, w = 24) =>
    `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${INK}" stroke-width="${w + 6}" stroke-linecap="round"/>` +
    `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${C}" stroke-width="${w}" stroke-linecap="round"/>`;
  if (pose === 'walk') {
    return `<circle cx="-82" cy="-66" r="11" fill="${C}" ${L}/>` +
      [-62, -36, 22, 46].map((x) => `<rect x="${x - 12}" y="-44" width="24" height="44" rx="10" fill="${C}" ${L}/>`).join('') +
      `<ellipse cx="-10" cy="-62" rx="76" ry="42" fill="${C}" ${L}/>` + head(66, -86, 0.9);
  }
  const A = {
    down: [[-34, -100, -52, -58], [34, -100, 52, -58]],
    up: [[-34, -100, -60, -160], [34, -100, 60, -160]],
    reach: [[-30, -100, 44, -100], [34, -100, 74, -110]],
    wave: [[-34, -100, -52, -58], [34, -100, 64, -158]],
  }[arms] || [];
  return `<ellipse cx="-22" cy="-8" rx="20" ry="10" fill="${C}" ${L}/><ellipse cx="22" cy="-8" rx="20" ry="10" fill="${C}" ${L}/>` +
    `<ellipse cx="0" cy="-70" rx="48" ry="60" fill="${C}" ${L}/><ellipse cx="0" cy="-64" rx="28" ry="38" fill="${F}"/>` +
    A.map((a) => limb(...a)).join('') + A.map(([, , x, y]) => `<circle cx="${x}" cy="${y}" r="12" fill="${C}" ${L}/>`).join('') +
    head(0, -150);
}

export function rabbit({ mood = 'happy' } = {}) {
  const C = '#fffaf2';
  return `<circle cx="-26" cy="-22" r="9" fill="${C}" ${line(2.5)}/>` +
    `<ellipse cx="0" cy="-24" rx="26" ry="23" fill="${C}" ${L}/>` +
    `<ellipse cx="14" cy="-4" rx="12" ry="6" fill="${C}" ${line(2.5)}/>` +
    at(12, -58, 1, false,
      `<ellipse cx="-8" cy="-34" rx="7" ry="24" fill="${C}" ${line(2.5)} transform="rotate(-12 -8 -20)"/>` +
      `<ellipse cx="9" cy="-34" rx="7" ry="24" fill="${C}" ${line(2.5)} transform="rotate(12 9 -20)"/>` +
      `<ellipse cx="-8" cy="-34" rx="3" ry="16" fill="#ffc2cc" transform="rotate(-12 -8 -20)"/>` +
      `<ellipse cx="9" cy="-34" rx="3" ry="16" fill="#ffc2cc" transform="rotate(12 9 -20)"/>` +
      `<circle r="21" fill="${C}" ${L}/>` + at(0, 0, 0.7, false, face(28, mood)));
}

export function deer({ mood = 'happy' } = {}) {
  const C = '#cf8f55', F = '#fff3df';
  return `<path d="M-50 -82 l-12 -8 l4 14z" fill="${C}" ${line(2.5)}/>` +
    [-40, -24, 18, 32].map((x) => `<rect x="${x - 5}" y="-62" width="10" height="60" rx="4" fill="${C}" ${line(2.5)}/>`).join('') +
    `<ellipse cx="-6" cy="-74" rx="50" ry="25" fill="${C}" ${L}/>` +
    [[-28, -80], [-10, -86], [8, -78], [-20, -66], [0, -66]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="${F}"/>`).join('') +
    `<path d="M22 -86 L36 -126 L56 -122 L44 -78z" fill="${C}" ${line(2.5)}/>` +
    at(50, -134, 1, false,
      `<ellipse cx="-20" cy="-18" rx="7" ry="14" fill="${C}" ${line(2.5)} transform="rotate(-40 -20 -18)"/>` +
      `<ellipse cx="20" cy="-18" rx="7" ry="14" fill="${C}" ${line(2.5)} transform="rotate(40 20 -18)"/>` +
      `<circle r="22" fill="${C}" ${L}/><ellipse cx="6" cy="10" rx="12" ry="9" fill="${F}"/><ellipse cx="8" cy="5" rx="4" ry="3" fill="${INK}"/>` +
      at(0, 0, 0.72, false, face(28, mood, { cheek: '#ee8f7f' })));
}

// 海龜：面向右、腹部中心為原點；殼頂大約 y -100
export function turtle({ mood = 'happy' } = {}) {
  const C = '#7cb86a', S = '#4f8f5a', F = '#a6d88f';
  return `<path d="M50 -24 Q90 -10 112 18 Q76 16 40 -8z" fill="${F}" ${L}/>` +
    `<path d="M-60 -20 Q-100 -6 -112 14 Q-80 14 -50 -4z" fill="${F}" ${L}/>` +
    `<path d="M-96 -32 l-22 6 l20 6z" fill="${F}" ${line(2.5)}/>` +
    `<ellipse cx="0" cy="-22" rx="96" ry="16" fill="#f4e3b0" ${L}/>` +
    `<path d="M-92 -26 Q-84 -104 0 -106 Q84 -104 92 -26z" fill="${C}" ${L}/>` +
    `<path d="M-28 -98 L-40 -64 L-18 -36 H18 L40 -64 L28 -98 M-40 -64 H-84 M40 -64 H84 M-18 -36 L-24 -28 M18 -36 L24 -28 M-28 -98 L-50 -96 M28 -98 L50 -96" fill="none" stroke="${S}" stroke-width="4" stroke-linejoin="round"/>` +
    `<path d="M-40 -64 L-18 -36 H18 L40 -64 L28 -98 H-28z" fill="${S}" opacity=".35"/>` +
    at(116, -50, 1, false, `<path d="M-34 6 Q-20 -6 -8 0 L-10 24 Q-26 26 -34 18z" fill="${F}" ${L}/><circle r="28" fill="${F}" ${L}/>` + face(26, mood, { cheek: '#f0a090' }));
}

export const fish = (x, y, s = 1, c = '#f6a13a', flip = false, stripe = '#fff') => at(x, y, s, flip,
  `<path d="M-24 0 L-46 -16 L-42 0 L-46 16z" fill="${c}" ${line(2.5)}/>` +
  `<path d="M-8 -16 l10 -12 l12 10z" fill="${c}" ${line(2.5)}/>` +
  `<ellipse rx="28" ry="18" fill="${c}" ${line(2.5)}/>` +
  `<path d="M-6 -16 q8 16 0 32" fill="none" stroke="${stripe}" stroke-width="5" opacity=".9"/>` +
  `<circle cx="14" cy="-4" r="3.5" fill="${INK}"/><path d="M22 6 q4 2 6 0" fill="none" ${line(2)}/>`);

export function octopus({ mood = 'happy' } = {}) {
  const C = '#f07a6a';
  return [-34, -20, -6, 8, 22, 36].map((x, i) =>
    `<path d="M${x * 0.6} -30 Q${x} -10 ${x * 1.2} -4 q${i % 2 ? 10 : -10} 2 ${i % 2 ? 4 : -4} -10" fill="none" stroke="${INK}" stroke-width="14" stroke-linecap="round"/>` +
    `<path d="M${x * 0.6} -30 Q${x} -10 ${x * 1.2} -4 q${i % 2 ? 10 : -10} 2 ${i % 2 ? 4 : -4} -10" fill="none" stroke="${C}" stroke-width="8" stroke-linecap="round"/>`).join('') +
    `<ellipse cx="0" cy="-62" rx="36" ry="40" fill="${C}" ${L}/>` +
    `<path d="M-36 -74 Q0 -88 36 -74 L36 -64 Q0 -78 -36 -64z" fill="#fff" ${line(2)}/>` +
    `<ellipse cx="22" cy="-40" rx="7" ry="6" fill="${C}" ${line(2.5)}/>` +
    at(0, -46, 0.8, false, face(34, mood, { cheek: '#d84f4f' }));
}

export const seaweed = (x, y, h = 120, c = '#4fae7a') =>
  `<path d="M${x} ${y} q-14 ${-h / 4} 0 ${-h / 2} q14 ${-h / 4} 0 ${-h / 2}" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/>` +
  `<path d="M${x} ${y} q-14 ${-h / 4} 0 ${-h / 2} q14 ${-h / 4} 0 ${-h / 2}" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round"/>`;
export const coral = (x, y, s = 1, c = '#ff8a8a') => at(x, y, s, false,
  `<path d="M0 0 V-50 M0 -30 L-24 -56 V-74 M-24 -56 L-36 -64 M0 -50 L18 -76 V-92 M18 -76 L32 -80" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="M0 0 V-50 M0 -30 L-24 -56 V-74 M-24 -56 L-36 -64 M0 -50 L18 -76 V-92 M18 -76 L32 -80" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`);
export const bubbles = (x, y, s = 1) => at(x, y, s, false,
  [[0, 0, 8], [10, -24, 6], [-4, -44, 5], [8, -62, 4]].map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#e8f8ff" opacity=".7" stroke="#fff" stroke-width="2"/>`).join(''));
export const shell = (x, y, s = 1, c = '#ffc2b0') => at(x, y, s, false,
  `<path d="M-18 0 Q-22 -26 0 -28 Q22 -26 18 0z" fill="${c}" ${line(2.5)}/><path d="M0 -26 V0 M-10 -22 L-6 0 M10 -22 L6 0" ${line(2)}/>`);

// 海底：上淺下深、光束、沙地、水草
export const undersea = (sandY = 500) =>
  `<defs><linearGradient id="deep" gradientUnits="userSpaceOnUse" x1="0" y1="-200" x2="0" y2="${H}"><stop offset="0" stop-color="#8fdcf2"/><stop offset="1" stop-color="#2f7fbf"/></linearGradient></defs>` +
  `<rect x="${BX}" y="${BY}" width="${BW}" height="${H - BY}" fill="url(#deep)"/>` +
  [-300, 80, 420, 760, 1100].map((x) => `<path d="M${x} ${BY} L${x + 120} ${BY} L${x + 260} ${sandY} L${x + 170} ${sandY}z" fill="#fff" opacity=".12"/>`).join('') +
  `<path d="M${BX} ${sandY} Q-400 ${sandY - 30} 0 ${sandY - 10} T400 ${sandY - 6} T800 ${sandY - 12} T${BX + BW} ${sandY} V${H} H${BX}z" fill="#f0dca8"/>` +
  [[-600, 1], [-250, 0.7], [1050, 0.9], [1400, 1]].map(([x, s]) => seaweed(x, sandY + 20, 160 * s)).join('');

// 玉手箱
export const tamatebako = (x, y, s = 1) => at(x, y, s, false,
  `<rect x="-40" y="-56" width="80" height="56" rx="4" fill="#2f2a3a" ${L}/>` +
  `<rect x="-44" y="-70" width="88" height="18" rx="4" fill="#3d3550" ${L}/>` +
  `<path d="M-30 -30 q10 -10 20 0 q10 10 20 0 q10 -10 20 0" fill="none" stroke="#f6d36b" stroke-width="3"/>` +
  `<path d="M0 -70 V0 M-44 -40 H44" stroke="#e2483d" stroke-width="6"/>` +
  `<path d="M0 -70 q-20 -20 -24 -4 q4 8 24 4 q20 -20 24 -4 q-4 8 -24 4" fill="#e2483d" ${line(2)}/>`);

// 白煙
export const smoke = (x, y, s = 1) => at(x, y, s, false,
  `<path d="M-50 0 q-30 -10 -16 -40 q-10 -40 30 -44 q10 -40 50 -26 q40 -20 50 20 q34 10 16 44 q10 30 -30 40 q-30 20 -60 4 q-30 14 -40 2z" fill="#fff" opacity=".92" stroke="#c9d3dc" stroke-width="3"/>` +
  `<circle cx="-10" cy="-30" r="14" fill="#eef2f6"/><circle cx="30" cy="-10" r="10" fill="#eef2f6"/>`);

// ---------- 建築、植物 ----------
export const jpCastle = (x, y, s = 1) => {
  const roof = (w, yy) => `<path d="M${-w - 22} ${yy} Q${-w - 10} ${yy - 6} ${-w + 4} ${yy - 26} H${w - 4} Q${w + 10} ${yy - 6} ${w + 22} ${yy}z" fill="#55627a" ${L}/>`;
  return at(x, y, s, false,
    `<path d="M-160 0 L-136 -60 H136 L160 0z" fill="#b3ac9f" ${L}/>` +
    [[-120, -30], [-60, -44], [0, -24], [60, -40], [120, -28]].map(([a, b]) => `<path d="M${a - 20} ${b} h40" stroke="#948d80" stroke-width="3"/>`).join('') +
    `<rect x="-110" y="-140" width="220" height="80" fill="#fbf8f0" ${L}/>` +
    [-80, -40, 0, 40, 80].map((wx) => `<rect x="${wx - 8}" y="-118" width="16" height="22" fill="#4a3426"/>`).join('') +
    roof(110, -136) +
    `<rect x="-76" y="-216" width="152" height="70" fill="#fbf8f0" ${L}/>` +
    [-44, 0, 44].map((wx) => `<rect x="${wx - 8}" y="-196" width="16" height="20" fill="#4a3426"/>`).join('') +
    roof(76, -212) +
    `<rect x="-46" y="-284" width="92" height="62" fill="#fbf8f0" ${L}/>` +
    `<rect x="-8" y="-266" width="16" height="20" fill="#4a3426"/>` +
    roof(46, -280) +
    `<path d="M-30 -306 q-10 -20 6 -26 M30 -306 q10 -20 -6 -26" fill="none" stroke="#f6d36b" stroke-width="7" stroke-linecap="round"/>`);
};

export const torii = (x, y, s = 1) => at(x, y, s, false,
  `<rect x="-78" y="-200" width="20" height="200" fill="#e2483d" ${L}/><rect x="58" y="-200" width="20" height="200" fill="#e2483d" ${L}/>` +
  `<rect x="-96" y="-170" width="192" height="16" fill="#e2483d" ${L}/>` +
  `<path d="M-120 -214 Q0 -200 120 -214 L114 -196 Q0 -186 -114 -196z" fill="#2f2a2a" ${L}/>` +
  `<rect x="-104" y="-198" width="208" height="12" fill="#e2483d" ${L}/>`);

// 小神社（祠）
export const hokora = (x, y, s = 1) => at(x, y, s, false,
  `<rect x="-60" y="-24" width="120" height="24" fill="#b3ac9f" ${L}/>` +
  `<rect x="-40" y="-100" width="80" height="76" fill="#c9905a" ${L}/>` +
  `<rect x="-24" y="-86" width="48" height="56" fill="#8c6a4a" ${L}/><path d="M0 -86 V-30" ${line(2)}/>` +
  `<path d="M-66 -96 L0 -140 L66 -96z" fill="#6b5a4a" ${L}/>` +
  `<path d="M-44 -98 Q0 -86 44 -98" fill="none" stroke="#e8d8a0" stroke-width="6"/>` +
  [-24, 0, 24].map((d) => `<path d="M${d} -94 l-4 12 h8z" fill="#fff" ${line(1.5)}/>`).join(''));

export const sakura = (x, y, s = 1) => at(x, y, s, false,
  `<path d="M-10 0 L-8 -70 Q-30 -100 -50 -110 M-8 -70 Q10 -100 40 -110 M-8 -60 L10 0z" fill="#8a5a3c" stroke="#8a5a3c" stroke-width="16" stroke-linecap="round"/>` +
  [[-60, -120, 40], [0, -150, 50], [56, -120, 40], [-30, -100, 34], [30, -96, 34]].map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffc6d6" ${L}/>`).join('') +
  [[-50, -130], [10, -170], [50, -126], [-14, -120], [-70, -100], [28, -140]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="5" fill="#ff9ab4"/>`).join(''));
export const petals = (pts) => pts.map(([px, py], i) => rot(px, py, i * 50, 1, `<path d="M0 -6 Q6 0 0 6 Q-6 0 0 -6z" fill="#ffb0c6"/>`)).join('');

// 竹子：從 y 往上 h 高；glow 發光
export function bamboo(x, y, h = 400, { glow = false, w = 22, c = '#79bf63' } = {}) {
  const fill = glow ? '#f2f59a' : c;
  const nodes = Array.from({ length: Math.floor(h / 60) }, (_, i) => `<path d="M${x - w / 2} ${y - 50 - i * 60} h${w}" stroke="${INK}" stroke-width="3"/>`).join('');
  const halo = glow ? `<ellipse cx="${x}" cy="${y - 90}" rx="${w * 3}" ry="110" fill="#fff6a8" opacity=".55"/><ellipse cx="${x}" cy="${y - 90}" rx="${w * 1.8}" ry="70" fill="#fffbd0" opacity=".8"/>` : '';
  return halo + `<rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" fill="${fill}" ${L}/>` + nodes +
    `<path d="M${x} ${y - h + 40} l34 -16 q-16 20 -34 16z M${x} ${y - h + 80} l-34 -14 q14 20 34 14z" fill="#5fae5a" ${line(2)}/>`;
}
// 竹林背景：竹子一路往上長到畫面外
export const bambooGrove = (y, c = '#a8d890', c2 = '#8cc87a') =>
  Array.from({ length: 22 }, (_, i) => {
    const x = -900 + i * 120 + (i % 3) * 30, w = 16 + (i % 3) * 4;
    return `<rect x="${x - w / 2}" y="${BY}" width="${w}" height="${y - BY}" fill="${i % 2 ? c : c2}"/>` +
      Array.from({ length: 6 }, (_, k) => `<path d="M${x - w / 2} ${y - 60 - k * 70 - (i % 4) * 12} h${w}" stroke="#6fa860" stroke-width="2"/>`).join('');
  }).join('');

export const koban = (x, y, s = 1, r = 0) => rot(x, y, r, s,
  `<ellipse rx="16" ry="24" fill="#f6d36b" ${line(2.5)}/><ellipse rx="9" ry="15" fill="none" stroke="#d8a830" stroke-width="2"/>`);

// 雲朵座（月亮使者站的）
export const cloudSeat = (x, y, s = 1, c = '#fff') => at(x, y, s, false,
  `<path d="M-150 0 q-30 -30 10 -44 q10 -36 60 -26 q30 -30 80 -6 q50 -20 70 20 q40 4 30 36 q20 20 -10 30 H-130 q-40 -4 -20 -10z" fill="${c}" ${L}/>` +
  `<path d="M-90 4 q20 -14 40 0 M20 6 q20 -14 40 0" fill="none" stroke="#d8d0ec" stroke-width="4" stroke-linecap="round"/>`);

// 仙女（天女）：飄帶、盤髮
export const tennyo = ({ top = '#fff0f6', ribbon = '#ffb0d0', mood = 'normal', pose = 'down' } = {}) =>
  `<path d="M-40 -100 Q-90 -120 -70 -60 Q-60 -20 -100 0" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>` +
  `<path d="M-40 -100 Q-90 -120 -70 -60 Q-60 -20 -100 0" fill="none" stroke="${ribbon}" stroke-width="7" stroke-linecap="round"/>` +
  `<path d="M40 -100 Q90 -130 80 -70 Q76 -30 110 -20" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>` +
  `<path d="M40 -100 Q90 -130 80 -70 Q76 -30 110 -20" fill="none" stroke="${ribbon}" stroke-width="7" stroke-linecap="round"/>` +
  person({ hair: 'bun', hairColor: '#2f2a2a', outfit: 'dress', top, mood, pose, shoes: '#fff' });

export { BX, BW, BY, H, INK, line, L, SKIN, at, face, person };
