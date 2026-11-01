// 英國地區（three-pigs、jack-beanstalk、goldilocks、little-red-hen、king-arthur）共用的動物和道具。
// 動物角色用 lib 的 person() 當身體（skin = 毛色），再用 hat 參數疊上耳朵、鼻子、嘴巴。

import { INK, line, L, at, face, person, BX, BW, BY, H, sparkle } from './lib.mjs';

// 嘴巴（畫在鼻子下面，蓋過 face() 原本的嘴）
export const mouthAt = (mood, y, w = 7) => {
  if (mood === 'happy') return `<path d="M${-w} ${y} q${w} ${w + 1} ${w * 2} 0" fill="#c94f4f" ${line(2.5)}/>`;
  if (mood === 'scared' || mood === 'ouch') return `<ellipse cx="0" cy="${y + 4}" rx="${w * 0.75}" ry="${w}" fill="#c94f4f" ${line(2.5)}/>`;
  if (mood === 'cry' || mood === 'sad') return `<path d="M${-w} ${y + 5} q${w} ${-w} ${w * 2} 0" fill="none" ${line(2.5)}/>`;
  if (mood === 'angry') return `<path d="M${-w} ${y + 2} h${w * 2}" ${line(3)}/>`;
  if (mood === 'blow') return `<circle cx="0" cy="${y + 3}" r="5" fill="#c94f4f" ${line(2.5)}/>`;
  if (mood === 'sleep') return `<path d="M-5 ${y + 2} q5 4 10 0" fill="none" ${line(2.5)}/>`;
  return `<path d="M${-w + 1} ${y} q${w - 1} 6 ${w * 2 - 2} 0" fill="none" ${line(2.5)}/>`;
};

// 閉眼睡覺的臉（蓋在 face() 上面）
export const sleepEyes = (skin) => `<rect x="-20" y="-9" width="40" height="13" fill="${skin}"/>` +
  [-1, 1].map((d) => `<path d="M${d * 11.4 - 6} -2 q6 5 12 0" fill="none" ${line(3)}/>`).join('');

// 把 person() 的 mood 轉成 face() 能用的
const faceMood = (m) => ({ ouch: 'scared', blow: 'normal', sad: 'cry', sleep: 'normal' }[m] || m);

// ---------- 小豬 ----------
const PINK = '#f7b6c2', PINK2 = '#f28fa5';
export function pigHead(mood = 'happy', extra = '') {
  return `<path d="M-28 -12 L-32 -44 L-8 -28z M28 -12 L32 -44 L8 -28z" fill="${PINK}" ${L}/>` +
    `<path d="M-26 -18 L-28 -36 L-14 -27z M26 -18 L28 -36 L14 -27z" fill="${PINK2}"/>` +
    (mood === 'sleep' ? sleepEyes(PINK) : '') +
    `<ellipse cx="0" cy="11" rx="12" ry="8" fill="${PINK2}" ${line(2.5)}/>` +
    `<ellipse cx="-4" cy="11" rx="2" ry="3" fill="${INK}"/><ellipse cx="4" cy="11" rx="2" ry="3" fill="${INK}"/>` +
    mouthAt(mood, 21, 6) + extra;
}
const pigTail = `<path d="M-30 -40 q-18 0 -16 -12 q4 -8 10 -2 q4 6 -4 8" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>` +
  `<path d="M-30 -40 q-18 0 -16 -12 q4 -8 10 -2 q4 6 -4 8" fill="none" stroke="${PINK}" stroke-width="3.5" stroke-linecap="round"/>`;

// 三隻小豬：n = 1 豬大哥（黃衣、草帽）、2 豬二哥（綠衣、頭巾）、3 豬小弟（藍衣、紅帽）
export const PIG_STYLE = {
  1: { top: '#f2c14e', bottom: '#b5884a', hat: `<path d="M-46 -18 Q0 -34 46 -18 Q0 -10 -46 -18z" fill="#e8cd7a" ${L}/><path d="M-24 -20 Q-22 -48 0 -48 Q22 -48 24 -20z" fill="#e8cd7a" ${L}/><path d="M-23 -24 h46" stroke="#c94f4f" stroke-width="5"/>` },
  2: { top: '#6cbd62', bottom: '#8a6a4a', hat: `<path d="M-31 -8 Q-32 -40 0 -40 Q32 -40 31 -8 Q0 -22 -31 -8z" fill="#e2483d" ${L}/><circle cx="-10" cy="-28" r="3" fill="#fff"/><circle cx="10" cy="-32" r="3" fill="#fff"/><path d="M30 -14 q16 -6 18 8 q-10 -2 -16 2z" fill="#e2483d" ${line(2.5)}/>` },
  3: { top: '#5b8fd0', bottom: '#3d5a99', hat: `<path d="M-30 -14 Q-28 -44 0 -44 Q28 -44 30 -14z" fill="#e2483d" ${L}/><path d="M18 -16 Q42 -18 46 -10 H22z" fill="#e2483d" ${L}/>` },
};
export function pig({ n = 3, mood = 'happy', pose = 'down', item = '', hat = true } = {}) {
  const st = PIG_STYLE[n];
  return pigTail + person({
    age: 'child', skin: PINK, hair: 'none', outfit: 'shirt', top: st.top, bottom: st.bottom,
    mood: faceMood(mood), pose, item, shoes: '#b5657a', hat: pigHead(mood, hat ? st.hat : ''),
  });
}
export function mamaPig({ mood = 'happy', pose = 'down', item = '' } = {}) {
  return pigTail + person({
    age: 'adult', skin: PINK, hair: 'none', outfit: 'dress', top: '#c58fd6', apron: '#fff8e6',
    mood: faceMood(mood), pose, item, shoes: '#b5657a',
    hat: pigHead(mood, `<path d="M-20 -26 q20 -16 40 0 q-20 8 -40 0z" fill="#ff7a8a" ${line(2)}/><circle cx="0" cy="-27" r="5" fill="#ffd25e" ${line(2)}/>`),
  });
}

// ---------- 大野狼（灰色、穿補丁褲子，不兇） ----------
const GREY = '#9aa3b0', GREY2 = '#dfe3e8';
export function wolfHead(mood = 'normal') {
  const blow = mood === 'blow';
  return `<path d="M-30 -10 L-34 -54 L-8 -30z M30 -10 L34 -54 L8 -30z" fill="${GREY}" ${L}/>` +
    `<path d="M-27 -18 L-29 -42 L-14 -30z M27 -18 L29 -42 L14 -30z" fill="#f2b8c0"/>` +
    `<path d="M-30 6 l-12 4 l10 4 l-8 6 l12 0 M30 6 l12 4 l-10 4 l8 6 l-12 0" fill="${GREY}" ${line(2)}/>` +
    (blow ? `<circle cx="-22" cy="12" r="13" fill="#f5a3a3" ${line(2.5)}/><circle cx="22" cy="12" r="13" fill="#f5a3a3" ${line(2.5)}/>` : '') +
    (mood === 'sleep' ? sleepEyes(GREY) : '') +
    `<ellipse cx="0" cy="14" rx="15" ry="11" fill="${GREY2}" ${line(2.5)}/>` +
    `<ellipse cx="0" cy="7" rx="7" ry="5" fill="${INK}"/>` +
    (mood === 'angry' || mood === 'blow' ? `<path d="M-22 -14 L-6 -8 M22 -14 L6 -8" ${line(3.5)}/>` : '') +
    mouthAt(mood === 'normal' ? 'happy' : mood, 16, 6) +
    (mood === 'normal' ? `<path d="M-3 17 l2 5 l2 -5" fill="#fff" ${line(1.5)}/>` : '');
}
const wolfTail = `<path d="M-26 -50 Q-80 -60 -86 -20 Q-60 -36 -28 -30z" fill="${GREY}" ${L}/><path d="M-80 -30 q-6 6 -6 10 q10 -8 14 -6z" fill="#fff"/>`;
export function wolf({ mood = 'normal', pose = 'down', item = '' } = {}) {
  return wolfTail + person({
    age: 'adult', skin: GREY, hair: 'none', outfit: 'shirt', top: '#c9a26a', bottom: '#6b7fa8',
    mood: faceMood(mood), pose, item, shoes: '#5a5f6a',
    hat: wolfHead(mood),
  }) + `<rect x="6" y="-30" width="12" height="10" fill="#e2c27a" ${line(2)}/>`;
}
// 吹氣的風
export const wind = (x, y, s = 1) => at(x, y, s, false,
  [0, 1, 2].map((i) => `<path d="M0 ${-30 + i * 30} q60 ${-16 + i * 8} 120 0 q30 8 40 -10" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>` +
    `<path d="M0 ${-30 + i * 30} q60 ${-16 + i * 8} 120 0 q30 8 40 -10" fill="none" stroke="#9fd0ee" stroke-width="3" stroke-linecap="round"/>`).join(''));

// ---------- 熊 ----------
const BROWN = '#b07a4a', MUZ = '#ead2b0';
export function bearHead(mood = 'happy', extra = '') {
  return `<circle cx="-24" cy="-24" r="11" fill="${BROWN}" ${L}/><circle cx="24" cy="-24" r="11" fill="${BROWN}" ${L}/>` +
    `<circle cx="-24" cy="-24" r="5" fill="${MUZ}"/><circle cx="24" cy="-24" r="5" fill="${MUZ}"/>` +
    (mood === 'sleep' ? sleepEyes(BROWN) : '') +
    `<ellipse cx="0" cy="13" rx="13" ry="10" fill="${MUZ}" ${line(2.5)}/>` +
    `<ellipse cx="0" cy="7" rx="6" ry="4" fill="${INK}"/>` + mouthAt(mood, 14, 5) + extra;
}
// size: papa / mama / baby
export function bear({ size = 'papa', mood = 'happy', pose = 'down', item = '' } = {}) {
  if (size === 'papa') return person({
    age: 'adult', skin: BROWN, hair: 'none', outfit: 'shirt', top: '#4f8a5a', bottom: '#6b4a2f', mood: faceMood(mood), pose, item,
    shoes: '#5a3a24', hat: bearHead(mood, `<path d="M-8 34 l8 6 l8 -6 l-8 -5z" fill="#e2483d" ${line(2)}/>`),
  });
  if (size === 'mama') return person({
    age: 'adult', skin: BROWN, hair: 'none', outfit: 'dress', top: '#e889a8', apron: '#fff8e6', mood: faceMood(mood), pose, item,
    shoes: '#5a3a24', hat: bearHead(mood, `<path d="M-30 -18 q10 -14 22 -6 q-10 12 -22 6z M-8 -12 q-10 -14 -22 -6" fill="#ffd25e" ${line(2)}/><circle cx="-19" cy="-16" r="4" fill="#ff7a8a"/>`),
  });
  return person({
    age: 'child', skin: BROWN, hair: 'none', outfit: 'shirt', top: '#f2c14e', bottom: '#5b8fd0', mood: faceMood(mood), pose, item,
    shoes: '#5a3a24', hat: bearHead(mood),
  });
}

// ---------- 小紅母雞和朋友們 ----------
export function henHead(mood = 'happy', extra = '') {
  return `<path d="M-14 -26 q-4 -18 8 -16 q2 -14 14 -6 q10 -10 14 6 q8 4 -2 14z" fill="#e2483d" ${L}/>` +
    (mood === 'sleep' ? sleepEyes('#c8553d') : '') +
    `<path d="M-11 6 L11 6 L0 22z" fill="#f2b33d" ${line(2.5)}/><path d="M-10 9 H10" ${line(2)}/>` +
    `<path d="M-4 20 q4 14 8 0" fill="#e2483d" ${line(2)}/>` + extra;
}
export function hen({ mood = 'happy', pose = 'down', item = '' } = {}) {
  return `<path d="M-28 -50 q-36 -16 -30 -46 q12 12 18 4 q2 14 16 16z" fill="#a8432f" ${L}/>` +
    person({
      age: 'child', skin: '#c8553d', hair: 'none', outfit: 'dress', top: '#c8553d', apron: '#fff8e6', mood: faceMood(mood), pose, item,
      shoes: '#f2a03d', hat: henHead(mood, `<path d="M-30 -6 Q-32 -36 0 -38 Q32 -36 30 -6 Q24 -24 0 -26 Q-24 -24 -30 -6z" fill="#5b8fd0" ${line(2.5)}/><circle cx="-12" cy="-28" r="2.5" fill="#fff"/><circle cx="8" cy="-31" r="2.5" fill="#fff"/>`),
    });
}
export function catHead(mood = 'happy') {
  return `<path d="M-28 -10 L-28 -48 L-6 -28z M28 -10 L28 -48 L6 -28z" fill="#f2a65a" ${L}/>` +
    `<path d="M-24 -18 L-24 -38 L-12 -28z M24 -18 L24 -38 L12 -28z" fill="#f7c6c6"/>` +
    `<path d="M-6 -30 l3 10 M6 -30 l-3 10 M0 -31 v10" stroke="#d07a32" stroke-width="3" stroke-linecap="round"/>` +
    (mood === 'sleep' ? sleepEyes('#f2a65a') : '') +
    `<ellipse cx="0" cy="13" rx="12" ry="9" fill="#fff6e8"/>` +
    `<path d="M-4 6 h8 l-4 5z" fill="#ff8aa0" ${line(1.5)}/>` +
    `<path d="M-14 10 h-18 M-14 15 l-16 4 M14 10 h18 M14 15 l16 4" ${line(1.5)}/>` + mouthAt(mood, 14, 5);
}
export function cat({ mood = 'happy', pose = 'down', item = '' } = {}) {
  return `<path d="M-24 -30 q-50 -6 -40 -60" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M-24 -30 q-50 -6 -40 -60" fill="none" stroke="#f2a65a" stroke-width="7" stroke-linecap="round"/>` +
    person({ age: 'child', skin: '#f2a65a', hair: 'none', outfit: 'shirt', top: '#9ad0ff', bottom: '#f2a65a', mood: faceMood(mood), pose, item, shoes: '#d07a32', hat: catHead(mood) });
}
export function puppyHead(mood = 'happy') {
  return (mood === 'sleep' ? sleepEyes('#e8c792') : '') +
    `<ellipse cx="0" cy="13" rx="13" ry="10" fill="#fff6e8" ${line(2.5)}/><ellipse cx="0" cy="7" rx="6" ry="4" fill="${INK}"/>` + mouthAt(mood, 14, 5) +
    `<path d="M-24 -24 Q-48 -16 -40 18 Q-30 22 -26 0z M24 -24 Q48 -16 40 18 Q30 22 26 0z" fill="#9a6440" ${L}/>` +
    `<circle cx="14" cy="-14" r="0" fill="none"/>`;
}
export function puppy({ mood = 'happy', pose = 'down', item = '' } = {}) {
  return `<path d="M-24 -36 q-30 -14 -26 -40" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M-24 -36 q-30 -14 -26 -40" fill="none" stroke="#e8c792" stroke-width="7" stroke-linecap="round"/>` +
    person({ age: 'child', skin: '#e8c792', hair: 'none', outfit: 'shirt', top: '#e2483d', bottom: '#3d5a99', mood: faceMood(mood), pose, item, shoes: '#9a6440', hat: puppyHead(mood) });
}
export function duckHead(mood = 'happy') {
  return (mood === 'sleep' ? sleepEyes('#fff') : '') +
    `<path d="M-6 -30 q4 -14 10 -4 q4 -10 6 2" fill="none" ${line(2.5)}/>` +
    `<ellipse cx="0" cy="14" rx="17" ry="8" fill="#f2a03d" ${line(2.5)}/><path d="M-16 14 H16" ${line(2)}/>` +
    (mood === 'scared' || mood === 'happy' ? `<path d="M-12 15 Q0 26 12 15" fill="#c97a2a"/>` : '');
}
export function duck({ mood = 'happy', pose = 'down', item = '' } = {}) {
  return `<path d="M-26 -40 l-22 -10 l6 18z" fill="#fff" ${L}/>` +
    person({ age: 'child', skin: '#fff', hair: 'none', outfit: 'shirt', top: '#5b8fd0', bottom: '#fff', mood: faceMood(mood), pose, item, shoes: '#f2a03d',
      hat: duckHead(mood) + `<path d="M-30 -14 Q-28 -40 0 -40 Q28 -40 30 -14z" fill="#3d5a99" ${L}/><path d="M-30 -18 H30" stroke="#fff" stroke-width="4"/>` });
}

// 小雞
export const chick = (x, y, s = 1, flip = false) => at(x, y, s, flip,
  `<path d="M-6 0 v-8 M6 0 v-8" ${line(3)}/>` +
  `<ellipse cx="0" cy="-26" rx="22" ry="20" fill="#ffe066" ${L}/>` +
  `<path d="M-12 -28 q-10 2 -8 10" fill="none" ${line(2)}/>` +
  `<circle cx="6" cy="-32" r="3" fill="${INK}"/><path d="M16 -30 l10 4 l-10 4z" fill="#f2a03d" ${line(1.5)}/>` +
  `<path d="M-2 -46 q2 -8 6 -2" fill="none" ${line(2)}/>`);

// 一般的母雞（四平八穩站著，不穿衣服），golden = 傑克的金蛋母雞
export const henBird = (x, y, s = 1, flip = false, golden = false) => at(x, y, s, flip,
  `<path d="M-10 0 v-18 M10 0 v-18" stroke="#f2a03d" stroke-width="5" stroke-linecap="round"/>` +
  `<path d="M-36 -46 q-30 -20 -20 -48 q10 10 16 2 q4 14 16 18z" fill="${golden ? '#d9a63a' : '#a8432f'}" ${L}/>` +
  `<ellipse cx="0" cy="-42" rx="40" ry="28" fill="${golden ? '#f6d36b' : '#c8553d'}" ${L}/>` +
  `<path d="M-20 -46 q16 -14 34 0 q-16 14 -34 0z" fill="${golden ? '#e8b84a' : '#a8432f'}" ${line(2.5)}/>` +
  at(30, -74, 1, false,
    `<path d="M-8 -16 q-2 -12 6 -10 q2 -10 10 -4 q8 -4 6 10z" fill="#e2483d" ${line(2.5)}/>` +
    `<circle r="17" fill="${golden ? '#f6d36b' : '#c8553d'}" ${L}/><circle cx="6" cy="-4" r="3" fill="${INK}"/>` +
    `<path d="M15 -2 L28 3 L15 8z" fill="#f2b33d" ${line(2)}/><path d="M12 8 q2 12 6 2" fill="#e2483d" ${line(1.5)}/>`));

// 金蛋
export const goldEgg = (x, y, s = 1) => at(x, y, s, false,
  `<ellipse cx="0" cy="-16" rx="13" ry="16" fill="#f6d36b" ${L}/><path d="M-5 -24 q2 -6 7 -6" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`);

// ---------- 大型動物 ----------
export const cow = (x, y, s = 1, flip = false, mood = 'happy') => at(x, y, s, flip,
  `<path d="M-80 -90 q-24 10 -20 50" fill="none" ${line(4)}/><path d="M-102 -44 l-6 10 h12z" fill="${INK}"/>` +
  [-60, -34, 34, 58].map((lx) => `<rect x="${lx - 8}" y="-50" width="16" height="50" fill="#fff" ${L}/><rect x="${lx - 8}" y="-10" width="16" height="10" fill="#5a4632"/>`).join('') +
  `<ellipse cx="0" cy="-80" rx="84" ry="44" fill="#fff" ${L}/>` +
  `<path d="M-40 -110 q20 -8 30 10 q-6 22 -30 14 q-12 -10 0 -24z" fill="#5a4632"/><path d="M20 -60 q20 -14 36 4 q-8 18 -30 10z" fill="#5a4632"/>` +
  `<path d="M-10 -40 q10 14 24 0" fill="#f7b6c2" ${line(2.5)}/>` +
  at(84, -110, 1, false,
    `<path d="M-22 -24 q-10 -20 -2 -26 M22 -24 q10 -20 2 -26" fill="none" stroke="#e8dcc0" stroke-width="8" stroke-linecap="round"/>` +
    `<ellipse cx="-34" cy="-10" rx="14" ry="7" fill="#fff" ${L}/><ellipse cx="34" cy="-10" rx="14" ry="7" fill="#fff" ${L}/>` +
    `<circle r="30" fill="#fff" ${L}/><path d="M-26 -14 q10 -16 24 -10 q-4 14 -24 10z" fill="#5a4632"/>` + face(30, mood) +
    `<ellipse cx="0" cy="18" rx="22" ry="13" fill="#f7b6c2" ${L}/><ellipse cx="-7" cy="18" rx="3" ry="4" fill="${INK}"/><ellipse cx="7" cy="18" rx="3" ry="4" fill="${INK}"/>`));

export const horse = (x, y, s = 1, flip = false, { color = '#c98a4a', mane = '#6b4a2f', saddle = '#c94f4f' } = {}) => at(x, y, s, flip,
  `<path d="M-84 -96 q-30 10 -24 60" fill="none" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M-84 -96 q-30 10 -24 60" fill="none" stroke="${mane}" stroke-width="9" stroke-linecap="round"/>` +
  [-60, -36, 40, 64].map((lx) => `<rect x="${lx - 8}" y="-60" width="16" height="60" fill="${color}" ${L}/><rect x="${lx - 9}" y="-10" width="18" height="10" fill="#4a3426"/>`).join('') +
  `<ellipse cx="0" cy="-90" rx="88" ry="40" fill="${color}" ${L}/>` +
  `<path d="M-20 -128 q24 -6 44 0 l-4 40 h-36z" fill="${saddle}" ${L}/>` +
  `<path d="M56 -110 L84 -190 L118 -180 L96 -96z" fill="${color}" ${L}/>` +
  at(110, -190, 1, false,
    `<path d="M-14 -24 l-2 -20 l12 14z" fill="${color}" ${L}/>` +
    `<path d="M-26 -10 Q-20 -32 6 -28 L46 4 Q52 24 30 26 Q10 26 -20 12z" fill="${color}" ${L}/>` +
    `<circle cx="4" cy="-10" r="4" fill="${INK}"/><ellipse cx="38" cy="14" rx="3" ry="2.5" fill="${INK}"/><path d="M8 -6 q4 -8 10 -2" fill="none" ${line(2)}/>` +
    `<ellipse cx="-4" cy="2" rx="7" ry="4" fill="#f5a3a3" opacity=".7"/>`) +
  `<path d="M90 -196 q-20 20 -30 60 q-10 30 -26 40" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M90 -196 q-20 20 -30 60 q-10 30 -26 40" fill="none" stroke="${mane}" stroke-width="10" stroke-linecap="round"/>`);

// ---------- 道具 ----------
export const say = (x, y, t, size = 40, c = '#e2483d', stroke = '#fff') =>
  `<text x="${x}" y="${y}" font-size="${size}" font-weight="900" text-anchor="middle" fill="${c}" stroke="${stroke}" stroke-width="${size / 6}" paint-order="stroke" font-family="sans-serif">${t}</text>`;

export const steam = (x, y, s = 1) => at(x, y, s, false,
  [-20, 0, 20].map((d, i) => `<path d="M${d} 0 q-12 -20 0 -40 q12 -20 0 -40" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="${0.9 - i * 0.15}"/>`).join(''));

// 麥穗
export const wheat = (x, y, s = 1, ripe = true) => at(x, y, s, false,
  `<path d="M0 0 V-90" stroke="${ripe ? '#c9a03a' : '#6cbd62'}" stroke-width="4" stroke-linecap="round"/>` +
  `<path d="M0 -40 q-18 -6 -22 -20 M0 -54 q16 -6 20 -20" fill="none" stroke="${ripe ? '#c9a03a' : '#6cbd62'}" stroke-width="3" stroke-linecap="round"/>` +
  Array.from({ length: 5 }, (_, i) => `<ellipse cx="-6" cy="${-92 - i * 11}" rx="5" ry="8" fill="${ripe ? '#f2c14e' : '#9fd38a'}" ${line(1.5)} transform="rotate(-25 -6 ${-92 - i * 11})"/>` +
    `<ellipse cx="6" cy="${-96 - i * 11}" rx="5" ry="8" fill="${ripe ? '#f2c14e' : '#9fd38a'}" ${line(1.5)} transform="rotate(25 6 ${-96 - i * 11})"/>`).join('') +
  `<ellipse cx="0" cy="-152" rx="4" ry="8" fill="${ripe ? '#f2c14e' : '#9fd38a'}" ${line(1.5)}/>`);

// 一捆麥子
export const wheatBundle = (x, y, s = 1) => at(x, y, s, false,
  [-16, -8, 0, 8, 16].map((d) => `<path d="M${d * 0.4} 0 L${d} -70" stroke="#c9a03a" stroke-width="4" stroke-linecap="round"/><ellipse cx="${d * 1.3}" cy="-82" rx="7" ry="16" fill="#f2c14e" ${line(2)} transform="rotate(${d} ${d * 1.3} -82)"/>`).join('') +
  `<rect x="-12" y="-36" width="24" height="10" fill="#c94f4f" ${line(2)}/>`);

// 麵包
export const bread = (x, y, s = 1) => at(x, y, s, false,
  `<path d="M-60 0 Q-70 -50 -20 -56 Q0 -66 20 -56 Q70 -50 60 0z" fill="#d99a4e" ${L}/>` +
  `<path d="M-30 -40 q10 10 0 24 M0 -48 q10 12 0 28 M30 -40 q10 10 0 24" fill="none" stroke="#f2c98a" stroke-width="5" stroke-linecap="round"/>`);

// 麵粉袋
export const flourSack = (x, y, s = 1) => at(x, y, s, false,
  `<path d="M-34 0 Q-44 -60 -20 -80 L-26 -94 H26 L20 -80 Q44 -60 34 0z" fill="#f2ead8" ${L}/>` +
  `<path d="M-22 -82 H22" ${line(3)}/><ellipse cx="0" cy="-40" rx="14" ry="10" fill="none" stroke="#c9a03a" stroke-width="3"/><path d="M0 -50 v20 M-8 -44 l8 6 l8 -6" fill="none" stroke="#c9a03a" stroke-width="3"/>`);

// 碗（粥）：size 1 大、0.8 中、0.6 小
export const bowl = (x, y, s = 1, { c = '#5b8fd0', hot = false, empty = false } = {}) => at(x, y, s, false,
  (hot ? steam(0, -40, 0.6) : '') +
  `<ellipse cx="0" cy="-34" rx="44" ry="10" fill="${empty ? '#fff' : '#f2e2b8'}" ${L}/>` +
  `<path d="M-44 -34 Q-40 0 0 0 Q40 0 44 -34 Q0 -22 -44 -34z" fill="${c}" ${L}/>` +
  `<path d="M-30 -18 h60" stroke="#fff" stroke-width="3" opacity=".6"/>`);

// 斧頭（給手拿）：從 (0,0) 往上
export const axe = (x, y, s = 1, rot = 0) => at(x, y, s, false, `<g transform="rotate(${rot})">` +
  `<path d="M0 30 V-70" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M0 30 V-70" stroke="#b5884a" stroke-width="7" stroke-linecap="round"/>` +
  `<path d="M-2 -76 Q30 -86 34 -56 Q30 -40 -2 -48z" fill="#c8d0da" ${L}/></g>`);

// 星光一圈
export const glow = (x, y, n = 4, r = 60) => Array.from({ length: n }, (_, i) => {
  const a = (i / n) * Math.PI * 2 + 0.4;
  return sparkle(x + Math.cos(a) * r, y + Math.sin(a) * r * 0.8, 0.5 + (i % 2) * 0.3);
}).join('');

// 草地（從 BX 畫到 BX + BW）
export const field = (y, c = '#8dc775') => `<rect x="${BX}" y="${y}" width="${BW}" height="${H - y}" fill="${c}"/>`;
export { BX, BW, BY };
