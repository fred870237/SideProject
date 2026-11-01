// 美國地區（綠野仙蹤、強尼蘋果籽、薑餅人、李伯大夢、保羅班揚）共用的背景、動物和道具。
// 座標規則同 lib.mjs：角色以腳底中心為原點、面向右邊。

import * as S from './lib.mjs';

const { INK, line, L, SKIN, at, face, BX, BW, H } = S;

// ---------- 背景、道具 ----------

// 蘋果樹：apples = 要不要結果
export const appleTree = (x, y, s = 1, { apples = true, flowers = false } = {}) => at(x, y, s, false,
  `<path d="M-10 0 L-8 -70 Q-30 -90 -40 -100 M-8 -70 L8 -70 Q30 -95 36 -104 M8 -70 L10 0z" fill="#9a6b45" ${L}/>` +
  `<rect x="-10" y="-72" width="20" height="72" fill="#9a6b45" ${L}/>` +
  `<circle cx="-40" cy="-110" r="40" fill="#6cbd62" ${L}/><circle cx="40" cy="-110" r="40" fill="#6cbd62" ${L}/>` +
  `<circle cx="0" cy="-140" r="50" fill="#5fae5a" ${L}/>` +
  (apples ? [[-50, -100], [-20, -150], [20, -120], [45, -95], [10, -170], [-30, -125], [55, -130]].map(([ax, ay]) =>
    `<circle cx="${ax}" cy="${ay}" r="9" fill="#e2483d" ${line(2)}/><path d="M${ax} ${ay - 9} l2 -5" ${line(2)}/>`).join('') : '') +
  (flowers ? [[-50, -100], [-20, -150], [20, -120], [45, -95], [10, -170], [-30, -125], [55, -130]].map(([ax, ay]) =>
    `<circle cx="${ax}" cy="${ay}" r="7" fill="#ffe3ec"/><circle cx="${ax}" cy="${ay}" r="3" fill="#f6d36b"/>`).join('') : ''));

export const apple = (x, y, s = 1) => at(x, y, s, false,
  `<circle cx="-6" cy="0" r="14" fill="#e2483d" ${line(2.5)}/><circle cx="6" cy="0" r="14" fill="#e2483d" ${line(2.5)}/>` +
  `<path d="M-14 -4 q4 -8 10 -6" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>` +
  `<path d="M0 -12 l2 -10" ${line(3)}/><path d="M2 -18 q10 -8 16 0 q-8 6 -16 0z" fill="#6cbd62" ${line(2)}/>`);

// 小樹苗
export const sapling = (x, y, s = 1) => at(x, y, s, false,
  `<path d="M0 0 V-40" stroke="#7a5638" stroke-width="5" stroke-linecap="round"/>` +
  `<path d="M0 -26 q-22 -6 -24 -22 q18 0 24 22z M0 -36 q20 -8 24 -24 q-20 0 -24 24z" fill="#6cbd62" ${line(2)}/>`);

// 小土堆（剛種下的地方）
export const mound = (x, y, s = 1) => at(x, y, s, false, `<path d="M-30 0 Q0 -20 30 0z" fill="#a0764e" ${line(2.5)}/>`);

// 木屋（拓荒者的小屋）
export const logCabin = (x, y, s = 1) => at(x, y, s, false,
  `<rect x="60" y="-200" width="30" height="70" fill="#9a8a7a" ${L}/>` +
  `<rect x="-120" y="-120" width="240" height="120" fill="#b5835a" ${L}/>` +
  [-100, -80, -60, -40, -20].map((yy) => `<path d="M-120 ${yy} H120" stroke="#8a5a32" stroke-width="4"/>`).join('') +
  [-100, -80, -60, -40, -20].map((yy) => `<circle cx="-120" cy="${yy + 10}" r="9" fill="#d9a877" ${line(2)}/><circle cx="120" cy="${yy + 10}" r="9" fill="#d9a877" ${line(2)}/>`).join('') +
  `<path d="M-145 -112 L0 -200 L145 -112z" fill="#7a5638" ${L}/>` +
  `<rect x="-24" y="-80" width="48" height="80" fill="#6b4a2f" ${L}/><circle cx="14" cy="-40" r="4" fill="#f6d36b"/>` +
  `<rect x="-95" y="-90" width="44" height="40" fill="#ffe9a6" ${L}/><path d="M-73 -90 v40 M-95 -70 h44" ${line(2)}/>` +
  `<rect x="51" y="-90" width="44" height="40" fill="#ffe9a6" ${L}/><path d="M73 -90 v40 M51 -70 h44" ${line(2)}/>`);

// 美國農舍（白牆、門廊）
export const farmhouse = (x, y, s = 1, { wall = '#f5f0e6', roof = '#8a5a4a' } = {}) => at(x, y, s, false,
  `<rect x="50" y="-250" width="30" height="70" fill="#a0522d" ${L}/>` +
  `<rect x="-110" y="-160" width="220" height="160" fill="${wall}" ${L}/>` +
  [-140, -120, -100, -80, -60, -40, -20].map((yy) => `<path d="M-110 ${yy} H110" stroke="#ddd3c0" stroke-width="3"/>`).join('') +
  `<path d="M-130 -155 L0 -260 L130 -155z" fill="${roof}" ${L}/>` +
  `<rect x="-22" y="-240" width="44" height="40" fill="#bfe4ff" ${L}/>` +
  `<path d="M-120 -70 H120 L110 -86 H-110z" fill="${roof}" ${L}/>` +
  [-100, -40, 40, 100].map((px) => `<rect x="${px - 4}" y="-70" width="8" height="70" fill="#fff" ${line(2)}/>`).join('') +
  `<rect x="-22" y="-62" width="44" height="62" fill="#8c5a3a" ${L}/><circle cx="12" cy="-30" r="4" fill="#f6d36b"/>` +
  `<rect x="-90" y="-140" width="40" height="44" fill="#bfe4ff" ${L}/><path d="M-70 -140 v44 M-90 -118 h40" ${line(2)}/>` +
  `<rect x="50" y="-140" width="40" height="44" fill="#bfe4ff" ${L}/><path d="M70 -140 v44 M50 -118 h40" ${line(2)}/>`);

// 紅色穀倉
export const barn = (x, y, s = 1) => at(x, y, s, false,
  `<path d="M-100 0 V-120 L-70 -170 H70 L100 -120 V0z" fill="#c8553d" ${L}/>` +
  `<path d="M-110 -116 L-74 -176 H74 L110 -116" fill="none" stroke="#fff" stroke-width="8" stroke-linejoin="round"/>` +
  `<rect x="-40" y="-90" width="80" height="90" fill="#a8432f" stroke="#fff" stroke-width="5"/>` +
  `<path d="M-40 -90 L40 0 M40 -90 L-40 0" stroke="#fff" stroke-width="5"/>` +
  `<rect x="-16" y="-140" width="32" height="28" fill="#fff" ${line(2)}/>`);

// 風車（農場用）
export const windmill = (x, y, s = 1) => at(x, y, s, false,
  `<path d="M-30 0 L-6 -190 H6 L30 0 M-24 -50 H24 M-16 -110 H16" fill="none" stroke="#8a8f99" stroke-width="6"/>` +
  [0, 45, 90, 135, 180, 225, 270, 315].map((r) => `<g transform="translate(0 -200) rotate(${r})"><path d="M0 0 L8 -50 H-8z" fill="#e8ebf0" ${line(2)}/></g>`).join('') +
  `<circle cx="0" cy="-200" r="8" fill="#8a8f99" ${line(2)}/><path d="M0 -200 h50 l10 -10 v20 l-10 -10" fill="#c8553d" ${line(2)}/>`);

// 麥田：從 y 往下一整片金黃色
export const wheat = (y, c = '#f0cf6a') =>
  `<rect x="${BX}" y="${y}" width="${BW}" height="${H - y}" fill="${c}"/>` +
  Array.from({ length: 70 }, (_, i) => {
    const x = (i * 137) % 2000 - 600, yy = y + 20 + ((i * 53) % (H - y - 10));
    return `<path d="M${x} ${yy} l-4 -16 M${x} ${yy} l0 -20 M${x} ${yy} l4 -16" stroke="#d6a93e" stroke-width="3" stroke-linecap="round"/>`;
  }).join('');

// 雪地
export const snow = (y, c = '#f4f8ff') => `<path d="M${BX} ${y + 20} Q0 ${y - 30} 300 ${y} T800 ${y - 10} Q1300 ${y + 30} ${BX + BW} ${y} V${H} H${BX}z" fill="${c}"/>`;
export const snowflakes = (n = 30, c = '#fff') => Array.from({ length: n }, (_, i) => {
  const x = (i * 263) % 1700 - 450, y = (i * 149) % 620 - 40;
  return `<circle cx="${x}" cy="${y}" r="${3 + (i % 3) * 2}" fill="${c}" opacity=".9"/>`;
}).join('');

// 雨滴
export const rain = (n = 30) => Array.from({ length: n }, (_, i) => {
  const x = (i * 233) % 1700 - 450, y = (i * 127) % 520 - 20;
  return `<path d="M${x} ${y} l-6 18" stroke="#7cc4f2" stroke-width="4" stroke-linecap="round"/>`;
}).join('');

// 音符（唱歌用）
export const note = (x, y, s = 1, c = INK) => at(x, y, s, false,
  `<ellipse cx="0" cy="0" rx="9" ry="7" fill="${c}" transform="rotate(-20)"/><path d="M8 -2 V-34 q10 4 14 14" fill="none" stroke="${c}" stroke-width="3.5" stroke-linecap="round"/>`);

// 思考泡泡：(x, y) 是泡泡中心，content 是泡泡裡的 SVG（以中心為原點）
export const thought = (x, y, w, h, fromX, fromY, content = '') =>
  `<circle cx="${fromX}" cy="${fromY}" r="6" fill="#fff" ${line(2.5)}/>` +
  `<circle cx="${(fromX * 2 + x) / 3}" cy="${(fromY * 2 + y) / 3 + 10}" r="10" fill="#fff" ${line(2.5)}/>` +
  `<ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="${h / 2}" fill="#fff" ${line(3)}/>` + at(x, y, 1, false, content);

// 對話框：簡單的圓角框（給短短的狀聲詞）
export const zzz = (x, y, s = 1) => at(x, y, s, false,
  `<text x="0" y="0" font-size="34" font-weight="700" fill="#5b6fb0" font-family="sans-serif">Z</text>` +
  `<text x="24" y="-26" font-size="26" font-weight="700" fill="#5b6fb0" font-family="sans-serif">z</text>` +
  `<text x="42" y="-46" font-size="20" font-weight="700" fill="#5b6fb0" font-family="sans-serif">z</text>`);

// 速度線（往左邊）
export const speed = (x, y, n = 3, len = 50) => Array.from({ length: n }, (_, i) =>
  `<path d="M${x} ${y + i * 18} h-${len - i * 10}" stroke="${INK}" stroke-width="3.5" stroke-linecap="round" opacity=".55"/>`).join('');

// 塵土
export const dust = (x, y, s = 1) => at(x, y, s, false,
  `<circle cx="0" cy="0" r="14" fill="#e8dcc0"/><circle cx="-18" cy="6" r="10" fill="#e8dcc0"/><circle cx="-34" cy="2" r="7" fill="#e8dcc0"/>`);

// ---------- 動物 ----------
const legs = (xs, top, bottom, c, w = 14, hoof = '') => xs.map((x) =>
  `<rect x="${x - w / 2}" y="${top}" width="${w}" height="${bottom - top}" rx="5" fill="${c}" ${line(2.5)}/>` +
  (hoof ? `<rect x="${x - w / 2}" y="${bottom - 8}" width="${w}" height="8" rx="3" fill="${hoof}" ${line(2)}/>` : '')).join('');

// 牛（ox = true 是保羅的藍色大牛，沒有斑點、角比較大）
export function cow({ mood = 'happy', c = '#fff', spot = '#3a3236', ox = false, run = false, muzzle = '' } = {}) {
  const MZ = muzzle || (ox ? '#9cc0f0' : '#f7b6c2');
  const lx = run ? [[-56, -40, -6], [-30, -40, 6], [14, -40, -10], [36, -40, 10]] : [[-56], [-34], [14], [36]];
  const legSvg = lx.map(([x, , r = 0]) => `<g transform="rotate(${r} ${x} -40)">${legs([x], -50, 0, c, 16, '#5a4632')}</g>`).join('');
  const horns = ox
    ? `<path d="M-18 -22 Q-50 -30 -56 -62 Q-40 -40 -14 -36z M18 -22 Q50 -30 56 -62 Q40 -40 14 -36z" fill="#f2ead2" ${L}/>`
    : `<path d="M-16 -24 q-14 -6 -14 -22 q10 8 18 10z M16 -24 q14 -6 14 -22 q-10 8 -18 10z" fill="#f2ead2" ${line(2.5)}/>`;
  return legSvg +
    `<path d="M-74 -78 q-20 20 -12 44" fill="none" ${line(4)}/><circle cx="-86" cy="-32" r="6" fill="${ox ? '#2f5590' : spot}"/>` +
    `<ellipse cx="-10" cy="-74" rx="70" ry="38" fill="${c}" ${L}/>` +
    (ox ? '' : `<path d="M-50 -100 q20 -6 26 12 q-6 22 -30 14 q-12 -14 4 -26z" fill="${spot}"/><path d="M10 -64 q18 -10 30 6 q-4 20 -26 16 q-12 -8 -4 -22z" fill="${spot}"/>` +
      `<ellipse cx="-14" cy="-38" rx="14" ry="8" fill="#f7b6c2" ${line(2)}/>`) +
    at(62, -100, 1, false,
      horns +
      `<ellipse cx="-30" cy="-12" rx="16" ry="8" fill="${c}" ${line(2.5)} transform="rotate(-20 -30 -12)"/><ellipse cx="30" cy="-12" rx="16" ry="8" fill="${c}" ${line(2.5)} transform="rotate(20 30 -12)"/>` +
      `<circle r="32" fill="${c}" ${L}/>` +
      `<ellipse cx="0" cy="18" rx="26" ry="16" fill="${MZ}" ${line(2.5)}/>` +
      `<circle cx="-8" cy="18" r="3" fill="${INK}"/><circle cx="8" cy="18" r="3" fill="${INK}"/>` +
      at(0, -8, 1, false, face(24, mood, { cheek: ox ? '#7aa6e6' : '#f5a3a3' }).replace(/<path d="M-[0-9]+ [0-9.]+ q[^"]*" fill="(#c94f4f|none)"[^>]*\/>$/, '')));
}

// 馬
export function horse({ mood = 'happy', c = '#b5784a', mane = '#5a3a24', run = false } = {}) {
  const r = run ? [[-50, 14], [-30, -10], [20, 16], [40, -14]] : [[-50, 0], [-30, 0], [20, 0], [40, 0]];
  return r.map(([x, a]) => `<g transform="rotate(${a} ${x} -60)">${legs([x], -70, 0, c, 15, '#4a3426')}</g>`).join('') +
    `<path d="M-66 -96 q-34 6 -36 50 q14 -16 24 -18 q-6 -20 12 -32z" fill="${mane}" ${line(2.5)}/>` +
    `<ellipse cx="-6" cy="-92" rx="66" ry="32" fill="${c}" ${L}/>` +
    `<path d="M30 -110 L50 -170 L84 -150 L60 -96z" fill="${c}" ${L}/>` +
    `<path d="M44 -176 q-20 30 -18 66 l-12 -4 q-4 -40 18 -66z" fill="${mane}" ${line(2.5)}/>` +
    at(72, -168, 1, false,
      `<path d="M-14 -22 L-8 -44 L4 -24z" fill="${c}" ${L}/>` +
      `<ellipse cx="0" cy="0" rx="28" ry="26" fill="${c}" ${L}/>` +
      `<ellipse cx="22" cy="12" rx="20" ry="16" fill="#e8c4a0" ${line(2.5)}/><circle cx="28" cy="8" r="2.5" fill="${INK}"/>` +
      `<path d="M-6 -24 q-10 -12 4 -16 q4 8 2 16z" fill="${mane}" ${line(2)}/>` +
      `<circle cx="2" cy="-4" r="4" fill="${INK}"/>` +
      (mood === 'happy' ? `<path d="M14 22 q8 6 16 0" fill="none" ${line(2.5)}/>` : `<ellipse cx="22" cy="22" rx="5" ry="6" fill="#c94f4f" ${line(2)}/>`) +
      `<ellipse cx="-8" cy="8" rx="5" ry="3" fill="#f0a080" opacity=".7"/>`);
}

// 狐狸：mood = sly（瞇眼笑）/ happy / yum（舔嘴巴）；swim = 只畫上半身（下面被水蓋住）
export function fox({ mood = 'sly', swim = false, tailUp = false } = {}) {
  const C = '#ec8a3c', W = '#fff6e8';
  const tail = tailUp
    ? `<path d="M-44 -50 Q-110 -60 -120 -130 Q-80 -110 -60 -80 Q-50 -70 -40 -66z" fill="${C}" ${L}/><path d="M-120 -130 Q-112 -104 -96 -98 Q-110 -118 -120 -130z" fill="${W}" ${line(2)}/>`
    : `<path d="M-44 -46 Q-120 -40 -126 -90 Q-90 -66 -40 -64z" fill="${C}" ${L}/><path d="M-126 -90 Q-116 -64 -100 -60 Q-118 -76 -126 -90z" fill="${W}" ${line(2)}/>`;
  const head = at(42, -92, 1, false,
    `<path d="M-26 -14 L-24 -54 L-4 -26z M4 -26 L22 -56 L28 -14z" fill="${C}" ${L}/>` +
    `<path d="M-20 -22 L-20 -44 L-10 -28z M12 -28 L20 -46 L22 -22z" fill="#5a3a24"/>` +
    `<circle r="30" fill="${C}" ${L}/>` +
    `<path d="M-30 4 Q-18 26 0 30 Q18 26 30 4 Q14 14 0 12 Q-14 14 -30 4z" fill="${W}" ${line(2)}/>` +
    `<path d="M10 6 Q30 4 44 12 Q30 22 10 18z" fill="${C}" ${line(2.5)}/><ellipse cx="44" cy="12" rx="5" ry="4" fill="${INK}"/>` +
    (mood === 'sly'
      ? `<path d="M-18 -6 q6 4 12 0 M4 -6 q6 4 12 0" fill="none" ${line(3)}/><path d="M6 20 q10 6 20 -2" fill="none" ${line(2.5)}/><ellipse cx="-20" cy="8" rx="5" ry="3" fill="#f5a3a3" opacity=".7"/>`
      : mood === 'yum'
        ? `<path d="M-18 -4 q6 -8 12 0 M4 -4 q6 -8 12 0" fill="none" ${line(3)}/><path d="M6 20 q10 6 20 -2" fill="none" ${line(2.5)}/><path d="M22 18 q10 2 8 12 q-8 0 -8 -12z" fill="#f27d8a" ${line(2)}/><ellipse cx="-20" cy="8" rx="6" ry="3.5" fill="#f5a3a3" opacity=".8"/>`
        : face(28, mood, { cheek: '#f5a3a3' })));
  if (swim) return tail +
    `<ellipse cx="-4" cy="-50" rx="52" ry="26" fill="${C}" ${L}/>` + head;
  return legs([-30, -14, 14, 30], -50, 0, C, 12, '#5a3a24') + tail +
    `<ellipse cx="-4" cy="-56" rx="52" ry="26" fill="${C}" ${L}/><ellipse cx="22" cy="-50" rx="18" ry="16" fill="${W}"/>` + head;
}

// 小狗：c 身體顏色、muzzle 口鼻（托托是黑色小狗）
export function pup({ c = '#3f3a44', muzzle = '#8a8490', mood = 'happy', ear = '' } = {}) {
  const E = ear || c;
  return `<path d="M-34 -40 q-16 -16 -6 -30" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M-34 -40 q-16 -16 -6 -30" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"/>` +
    legs([-24, -8, 10, 24], -26, 0, c, 11) +
    `<ellipse cx="0" cy="-34" rx="36" ry="20" fill="${c}" ${L}/>` +
    at(28, -60, 1, false,
      `<path d="M-20 -12 L-22 -36 L-6 -20z M6 -20 L20 -36 L20 -12z" fill="${E}" ${L}/>` +
      `<circle r="22" fill="${c}" ${L}/>` +
      `<ellipse cx="4" cy="8" rx="14" ry="10" fill="${muzzle}"/>` +
      `<circle cx="-8" cy="-2" r="6" fill="#fff"/><circle cx="8" cy="-2" r="6" fill="#fff"/>` +
      `<ellipse cx="6" cy="2" rx="5" ry="3.5" fill="${INK}"/>` +
      (mood === 'happy' ? `<circle cx="-8" cy="-2" r="3.5" fill="${INK}"/><circle cx="8" cy="-2" r="3.5" fill="${INK}"/><path d="M0 10 q6 8 12 0" fill="#e86a7a" ${line(2)}/>`
        : `<circle cx="-8" cy="-2" r="3.5" fill="${INK}"/><circle cx="8" cy="-2" r="3.5" fill="${INK}"/><ellipse cx="6" cy="13" rx="3" ry="4" fill="#c94f4f"/>`));
}

// 鹿
export function deer({ mood = 'happy', antlers = false } = {}) {
  const C = '#c98a52';
  return legs([-34, -20, 16, 30], -56, 0, C, 10, '#5a3a24') +
    `<path d="M-46 -76 q-10 -12 -2 -18 q8 4 6 14z" fill="#fff" ${line(2)}/>` +
    `<ellipse cx="-6" cy="-70" rx="48" ry="24" fill="${C}" ${L}/>` +
    [[-30, -76], [-14, -84], [-2, -72], [-20, -64]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="#fff6e8"/>`).join('') +
    `<path d="M22 -80 L34 -126 L54 -118 L40 -72z" fill="${C}" ${L}/>` +
    at(48, -136, 1, false,
      (antlers ? `<path d="M-8 -20 q-6 -20 -20 -26 M-14 -34 q-12 -2 -16 6 M8 -20 q6 -20 20 -26 M14 -34 q12 -2 16 6" fill="none" stroke="#8a5a32" stroke-width="5" stroke-linecap="round"/>` : '') +
      `<ellipse cx="-24" cy="-14" rx="14" ry="7" fill="${C}" ${line(2.5)} transform="rotate(-30 -24 -14)"/><ellipse cx="24" cy="-14" rx="14" ry="7" fill="${C}" ${line(2.5)} transform="rotate(30 24 -14)"/>` +
      `<circle r="22" fill="${C}" ${L}/><ellipse cx="6" cy="10" rx="12" ry="9" fill="#fff6e8"/><ellipse cx="8" cy="6" rx="4" ry="3" fill="${INK}"/>` +
      face(20, mood, { cheek: '#f0a080' }).replace(/<path d="M-[^"]*" fill="#c94f4f"[^>]*\/>$/, ''));
}

// 松鼠（坐著）
export function squirrel({ mood = 'happy', nut = true } = {}) {
  const C = '#b5703e';
  return `<path d="M-10 -10 Q-60 -10 -54 -60 Q-50 -100 -14 -90 Q-40 -70 -20 -40z" fill="${C}" ${L}/>` +
    `<ellipse cx="0" cy="-26" rx="20" ry="26" fill="${C}" ${L}/><ellipse cx="4" cy="-22" rx="11" ry="16" fill="#f3d7b5"/>` +
    (nut ? `<ellipse cx="14" cy="-34" rx="8" ry="10" fill="#8a5a32" ${line(2)}/><path d="M8 -42 h12" ${line(3)}/>` : '') +
    at(4, -62, 1, false,
      `<path d="M-14 -10 L-14 -28 L-4 -16z M4 -16 L14 -28 L14 -10z" fill="${C}" ${line(2.5)}/>` +
      `<circle r="18" fill="${C}" ${L}/><ellipse cx="2" cy="6" rx="10" ry="8" fill="#f3d7b5"/>` +
      `<circle cx="-6" cy="-2" r="3" fill="${INK}"/><circle cx="8" cy="-2" r="3" fill="${INK}"/><circle cx="2" cy="6" r="2.5" fill="${INK}"/>` +
      `<ellipse cx="-11" cy="6" rx="4" ry="2.5" fill="#f5a3a3"/>`);
}

// 熊（坐著、很友善）
export function bear({ mood = 'happy' } = {}) {
  const C = '#8a5a3a';
  return `<ellipse cx="-24" cy="-10" rx="20" ry="12" fill="${C}" ${L}/><ellipse cx="24" cy="-10" rx="20" ry="12" fill="${C}" ${L}/>` +
    `<ellipse cx="0" cy="-56" rx="46" ry="52" fill="${C}" ${L}/><ellipse cx="0" cy="-48" rx="28" ry="34" fill="#c99a6b"/>` +
    `<ellipse cx="-38" cy="-60" rx="12" ry="22" fill="${C}" ${L} transform="rotate(20 -38 -60)"/><ellipse cx="38" cy="-60" rx="12" ry="22" fill="${C}" ${L} transform="rotate(-20 38 -60)"/>` +
    at(0, -122, 1, false,
      `<circle cx="-26" cy="-24" r="12" fill="${C}" ${L}/><circle cx="26" cy="-24" r="12" fill="${C}" ${L}/>` +
      `<circle r="34" fill="${C}" ${L}/><ellipse cx="0" cy="12" rx="16" ry="12" fill="#c99a6b"/><ellipse cx="0" cy="6" rx="6" ry="4" fill="${INK}"/>` +
      face(32, mood, { cheek: '#e08a7a' }).replace(/<path d="M-[^"]*" fill="#c94f4f"[^>]*\/>$/, `<path d="M-6 14 q6 6 12 0" fill="none" ${line(2.5)}/>`));
}

// 兔子
export function rabbit() {
  const C = '#f0ece4';
  return `<ellipse cx="0" cy="-18" rx="22" ry="18" fill="${C}" ${L}/><circle cx="-22" cy="-16" r="7" fill="#fff" ${line(2)}/>` +
    at(16, -42, 1, false,
      `<ellipse cx="-6" cy="-28" rx="6" ry="18" fill="${C}" ${line(2.5)}/><ellipse cx="8" cy="-28" rx="6" ry="18" fill="${C}" ${line(2.5)}/>` +
      `<ellipse cx="8" cy="-28" rx="2.5" ry="12" fill="#f7b6c2"/>` +
      `<circle r="15" fill="${C}" ${L}/><circle cx="-4" cy="-2" r="2.5" fill="${INK}"/><circle cx="7" cy="-2" r="2.5" fill="${INK}"/><circle cx="2" cy="5" r="2" fill="#e86a7a"/>`);
}

// 獅子（膽小的獅子：mood = scared 時尾巴夾著、冒汗）
export function lion({ mood = 'scared', medal = false } = {}) {
  const C = '#e6b35a', M = '#b8642e';
  return legs([-34, -18, 14, 30], -50, 0, C, 15) +
    `<path d="M-50 -60 Q-90 -60 -86 -100" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M-50 -60 Q-90 -60 -86 -100" fill="none" stroke="${C}" stroke-width="4" stroke-linecap="round"/>` +
    `<circle cx="-86" cy="-104" r="10" fill="${M}" ${line(2.5)}/>` +
    `<ellipse cx="-6" cy="-62" rx="54" ry="30" fill="${C}" ${L}/>` +
    at(40, -108, 1, false,
      Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return `<circle cx="${(Math.cos(a) * 38).toFixed(1)}" cy="${(Math.sin(a) * 38).toFixed(1)}" r="18" fill="${M}" ${L}/>`;
      }).join('') +
      `<circle r="38" fill="${M}"/>` +
      `<circle cx="-22" cy="-26" r="9" fill="${C}" ${line(2.5)}/><circle cx="22" cy="-26" r="9" fill="${C}" ${line(2.5)}/>` +
      `<circle r="30" fill="${C}" ${L}/><ellipse cx="0" cy="12" rx="14" ry="10" fill="#fff1d0"/><path d="M-5 4 h10 l-5 6z" fill="${INK}"/>` +
      face(30, mood, { cheek: '#f0a070' })) +
    (medal ? `<path d="M22 -86 l10 20 l10 -20" fill="none" stroke="#e2483d" stroke-width="5"/><circle cx="32" cy="-58" r="12" fill="#f6d36b" ${line(2.5)}/>` : '');
}

// 鸛鳥（飛行）：叼著的東西另外畫
export function stork({ flap = 0 } = {}) {
  return `<path d="M-30 -2 l-26 10 M-30 2 l-26 14" ${line(3)}/><path d="M-30 -2 l-26 10 M-30 2 l-26 14" stroke="#f08a3c" stroke-width="2"/>` +
    `<ellipse cx="0" cy="0" rx="36" ry="16" fill="#fff" ${L}/>` +
    `<path d="M-10 -6 Q-30 ${-60 + flap} 10 ${-70 + flap} Q16 -30 10 -6z" fill="#fff" ${L}/><path d="M-4 ${-50 + flap} Q4 ${-70 + flap} 10 ${-70 + flap} Q14 ${-50 + flap} 12 ${-40 + flap / 2}z" fill="#2f2a33"/>` +
    `<path d="M30 -6 Q46 -14 52 -24" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M30 -6 Q46 -14 52 -24" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>` +
    `<circle cx="56" cy="-28" r="11" fill="#fff" ${line(2.5)}/><circle cx="59" cy="-31" r="2.5" fill="${INK}"/>` +
    `<path d="M64 -30 L96 -24 L64 -22z" fill="#f08a3c" ${line(2)}/>`;
}
