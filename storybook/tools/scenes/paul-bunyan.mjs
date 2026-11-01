// 保羅班揚的插畫。用法：node tools/scenes/paul-bunyan.mjs --sheet

import * as S from './lib.mjs';
import * as U from './us-common.mjs';

const { BX, BW, BY, H, INK, line, L, SKIN, at, svg, face, sky, sun, cloud, hills, mountain, ground, tree, pine, grass, sparkle, sea, room, person, hand, sweat, hearts, bird, writeBook } = S;
const { cow, stork, snow, snowflakes, rain, logCabin, thought, speed, dust } = U;

// ---------- 保羅、寶貝 ----------
const plaid = `<path d="M-26 -84 H26 M-26 -66 H26 M-12 -100 V-48 M10 -100 V-48" stroke="#9a2a2a" stroke-width="4" opacity=".8"/>`;
const beanie = `<path d="M-33 -10 Q-32 -50 0 -50 Q32 -50 33 -10z" fill="#3d5a99" ${L}/><rect x="-35" y="-18" width="70" height="12" rx="5" fill="#5b8fd0" ${L}/><circle cx="0" cy="-52" r="9" fill="#f2efe6" ${L}/>`;
const bigBeard = `<path d="M-30 0 Q-34 40 -10 50 Q0 58 10 50 Q34 40 30 0 Q22 20 0 18 Q-22 20 -30 0z" fill="#2f2a2a" ${L}/><path d="M-12 18 q12 -8 24 0" fill="#2f2a2a" ${line(2)}/><path d="M-6 28 q6 4 12 0" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>`;
const paul = ({ item = '', ...o } = {}) => person({
  outfit: 'shirt', top: '#d9483d', bottom: '#3d5a99', hair: 'short', hairColor: '#2f2a2a', hat: bigBeard + beanie, shoes: '#5a3a24',
  item: plaid + item, ...o,
});
const axe = (x, y, rot = 0, s = 1) => at(x, y, s, false, `<g transform="rotate(${rot})"><path d="M0 40 V-90" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M0 40 V-90" stroke="#a8764a" stroke-width="7" stroke-linecap="round"/>` +
  `<path d="M0 -90 L40 -108 Q48 -78 40 -54 L0 -70z" fill="#dfe6ee" ${L}/></g>`);
const babe = (o = {}) => cow({ c: '#5b8fd0', ox: true, ...o });
const babyPaul = (mood = 'happy') =>
  `<circle r="34" fill="${SKIN}" ${L}/><path d="M-6 -34 q6 -10 12 0" fill="none" ${line(2.5)}/>` + face(34, mood) +
  `<path d="M-24 14 Q0 44 24 14 Q12 26 0 24 Q-12 26 -24 14z" fill="#2f2a2a" ${line(2)}/>`;
const fallingPine = (x, y, rot, s = 1) => at(x, y, s, false, `<g transform="rotate(${rot})"><rect x="-7" y="-30" width="14" height="30" fill="#9a6b45"/><path d="M0 -150 L-40 -80 H-20 L-50 -30 H50 L20 -80 H40z" fill="#4f9a5f" ${L}/></g>`);
const stumpS = (x, y, s = 1) => at(x, y, s, false, `<path d="M-14 0 V-14 H14 V0z" fill="#9a6b45" ${line(2)}/><ellipse cx="0" cy="-14" rx="14" ry="5" fill="#e0b88a" ${line(2)}/>`);
const bowl = (x, y, s = 1) => at(x, y, s, false, `<path d="M-30 -20 H30 Q28 6 0 8 Q-28 6 -30 -20z" fill="#e8ebf0" ${L}/><ellipse cx="0" cy="-20" rx="30" ry="7" fill="#f2e2b0" ${line(2)}/>`);
const chefHat = `<path d="M-22 -24 Q-36 -50 -16 -58 Q-4 -76 12 -60 Q34 -56 22 -24z" fill="#fff" ${L}/><rect x="-22" y="-30" width="44" height="10" fill="#fff" ${line(2.5)}/>`;
const cook = (o = {}) => person({ outfit: 'shirt', top: '#fff', bottom: '#8a8f99', hair: 'short', hairColor: '#8a5a32', hat: chefHat, pose: 'up', shoes: '#5a3a24',
  item: `<rect x="-30" y="-10" width="28" height="12" rx="3" fill="#f6e27a" ${line(2)}/><rect x="2" y="-10" width="28" height="12" rx="3" fill="#f6e27a" ${line(2)}/>`, ...o });
const bootPrint = (x, y, s = 1) => at(x, y, s, false, `<path d="M-50 -16 Q-60 -40 -20 -40 H40 Q70 -36 70 -10 Q70 14 40 14 H-20 Q-60 14 -50 -16z" fill="#4fa8e0" stroke="#3f7f60" stroke-width="5"/>` +
  `<path d="M-20 -14 q20 -8 40 0" fill="none" stroke="#d6efff" stroke-width="4" stroke-linecap="round"/>`);
const hoofPrint = (x, y, s = 1) => at(x, y, s, false, `<ellipse cx="-24" cy="0" rx="22" ry="34" fill="#4fa8e0" stroke="#3f7f60" stroke-width="5"/><ellipse cx="24" cy="0" rx="22" ry="34" fill="#4fa8e0" stroke="#3f7f60" stroke-width="5"/>`);
const fish = (x, y, s = 1, r = -30) => at(x, y, s, false, `<g transform="rotate(${r})"><ellipse cx="0" cy="0" rx="16" ry="9" fill="#f2a24a" ${line(2)}/><path d="M-14 0 l-12 -9 v18z" fill="#f2a24a" ${line(2)}/><circle cx="8" cy="-2" r="2" fill="${INK}"/></g>`);
const sailboat = (x, y, s = 1) => at(x, y, s, false, `<path d="M-30 0 H30 L22 14 H-22z" fill="#c8553d" ${line(2.5)}/><path d="M0 0 V-50 L28 -6z" fill="#fff" ${line(2.5)}/>`);
const pancakes = (x, y, s = 1) => at(x, y, s, false, `<ellipse cx="0" cy="0" rx="60" ry="14" fill="#e8ebf0" ${L}/>` +
  [0, 1, 2, 3, 4].map((i) => `<ellipse cx="0" cy="${-10 - i * 12}" rx="48" ry="12" fill="#e2a85a" ${L}/>`).join('') +
  `<rect x="-14" y="-74" width="28" height="12" rx="3" fill="#f6e27a" ${line(2)}/><path d="M10 -64 q14 10 10 30" fill="none" stroke="#c9782a" stroke-width="6" stroke-linecap="round"/>`);

// ---------- 每一頁 ----------
const pages = {
  // 封面：巨人保羅和藍色大牛寶貝，小小的松樹只到腳邊
  cover: svg(sky('#cfe8ff', '#fff4e0') + sun(680, 110, 46) + cloud(150, 100) + mountain(560, 420, 500, 230, '#b7c7e0') + hills(430, '#8fc87a', '#7aba66') +
    Array.from({ length: 9 }, (_, i) => pine(30 + i * 90, 600 - (i % 2) * 14, 0.32)).join('') +
    at(240, 570, 1.5, false, babe()) +
    axe(700, 600, 18, 1.7) +
    at(560, 595, 2.0, true, paul({ pose: 'hips' })) +
    bird(450, 260, 0.8) + bird(500, 290, 0.6)),

  // 1. 超級大寶寶，要五隻鸛鳥一起抬
  '01': svg(sky('#d4ecff', '#fff8f0') + cloud(140, 120) + cloud(660, 140, 0.8) + hills(480) + pine(80, 520, 0.8) + pine(720, 520, 0.9) +
    [[180, 280, 0.9], [300, 250, 0.9], [420, 240, 0.9], [540, 250, 0.9], [650, 280, 0.9]].map(([x, y, s], i) =>
      `<path d="M${x + 80 * s} ${y - 20 * s} L${400 + (x - 400) * 0.4} 360" stroke="${INK}" stroke-width="2.5"/>` + at(x, y, s, false, stork({ flap: i % 2 ? 20 : 0 }))).join('') +
    at(400, 420, 1, false, `<path d="M-120 -40 Q-140 60 0 80 Q140 60 120 -40 Q60 -70 0 -60 Q-60 -70 -120 -40z" fill="#fff8e6" ${L}/>` +
      `<path d="M-120 -40 Q0 -10 120 -40" fill="none" ${line(3)}/>` + at(0, -20, 1.3, false, babyPaul('happy')) + at(70, 20, 1, false, `<circle r="16" fill="${SKIN}" ${L}/>`)) +
    sweat(250, 300) + sweat(560, 290)),

  // 2. 每天四十碗粥，搖籃大得要放在海上
  '02': svg(sky('#c4e4ff', '#eaf6ff') + cloud(160, 110) + cloud(620, 100, 0.8) + sea(360) +
    `<path d="M${BX} 520 H140 Q200 470 260 520 H${BX + BW}" fill="none"/>` +
    at(420, 470, 1, false, `<path d="M-180 -40 H180 Q170 40 0 50 Q-170 40 -180 -40z" fill="#c9905a" ${L}/>` +
      `<path d="M-200 30 Q0 110 200 30" fill="none" stroke="#8a5a32" stroke-width="12" stroke-linecap="round"/>` +
      at(-60, -50, 1.3, false, babyPaul('happy')) + `<path d="M-120 -40 Q0 -70 140 -40" fill="#7cc4f2" ${line(2)}/>` +
      `<rect x="10" y="-60" width="130" height="24" rx="10" fill="#f7a8c8" ${L}/>` +
      [0, 1, 2, 3, 4].map((i) => bowl(110, -62 - i * 20, 0.7)).join('')) +
    [[200, 520], [640, 520], [130, 470], [710, 470]].map(([x, y]) => `<path d="M${x - 50} ${y} q25 -50 50 -30 q-10 -24 20 -30 q-30 30 30 60z" fill="#d6efff" ${L}/>`).join('') +
    sailboat(720, 560, 0.8) + sailboat(90, 580, 0.7) +
    `<text x="250" y="300" font-size="44" font-weight="700" fill="#2f6f9f" text-anchor="middle">嘩啦！</text>`),

  // 3. 長成巨人伐木工，一揮斧頭砍倒好幾棵樹
  '03': svg(sky('#d2ebf7', '#f4fbff') + cloud(620, 100) + hills(420, '#8fc87a', '#7aba66') +
    pine(80, 460, 0.6) + pine(150, 470, 0.55) +
    at(230, 590, 1.6, false, paul({ pose: 'raise', mood: 'happy', item: axe(40, -160, 60) })) +
    stumpS(480, 572) + stumpS(560, 586) + stumpS(650, 574) + stumpS(730, 590) +
    fallingPine(480, 560, 25, 0.75) + fallingPine(560, 576, 60, 0.75) + fallingPine(650, 562, 40, 0.7) + fallingPine(730, 580, 80, 0.65) +
    [[470, 420], [590, 450], [680, 430]].map(([x, y]) => `<path d="M${x} ${y} q40 -10 60 20" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round" opacity=".5"/>`).join('') +
    dust(520, 590) + dust(700, 596) +
    `<text x="610" y="250" font-size="52" font-weight="700" text-anchor="middle" fill="#8a5a32">咚！咚！咚！</text>`),

  // 4. 下了藍色的雪，發現凍僵的小牛
  '04': svg(sky('#a9c4f0', '#dfe9ff') + snowflakes(40, '#8fb0f0') + snow(420, '#c9dcff') + pine(70, 450, 0.8) + pine(730, 440, 0.9) +
    at(580, 560, 0.72, false, babe({ mood: 'cry' })) +
    `<path d="M520 470 l6 18 l6 -18 M560 466 l5 14 l5 -14" fill="#fff" ${line(2)}/>` +
    at(320, 580, 1.3, false, paul({ pose: 'reach', mood: 'scared' })) + snowflakes(14, '#fff') +
    `<path d="M630 500 q10 -14 20 0 M636 520 q10 -14 20 0" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`),

  // 5. 在火爐旁照顧小牛，牠一直是藍色的，叫牠「寶貝」
  '05': svg(room({ wall: '#e8d4b8', stripe: '#dcc6a6', floor: '#b5835a', window: false }) +
    at(630, 380, 1, false, `<rect x="-120" y="-200" width="240" height="200" fill="#a8a0a0" ${L}/>` +
      [-160, -110, -60].map((yy) => `<path d="M-120 ${yy} H120" stroke="#8a8282" stroke-width="3"/>`).join('') +
      `<path d="M-70 0 V-100 Q0 -150 70 -100 V0z" fill="#3a3236" ${L}/>` +
      `<path d="M-40 0 Q-50 -50 -20 -70 Q-10 -40 0 -80 Q20 -40 30 -60 Q50 -30 40 0z" fill="#f2a24a" ${line(2.5)}/><path d="M-20 0 Q-20 -30 0 -40 Q20 -30 20 0z" fill="#f6e27a"/>` +
      `<rect x="-140" y="-220" width="280" height="22" fill="#8a5a32" ${L}/>`) +
    at(470, 570, 0.75, true, babe({ mood: 'happy' })) +
    `<path d="M448 498 Q492 470 540 494 L546 548 Q494 562 450 548z" fill="#e2483d" ${L}/><path d="M452 514 H540 M452 530 H542" stroke="#f6e27a" stroke-width="5"/>` +
    at(210, 570, 1.25, false, paul({ pose: 'reach', mood: 'happy', item: bowl(74, -54, 0.8) })) + hearts(370, 360) +
    `<text x="250" y="270" font-size="44" font-weight="700" fill="#3d5a99" text-anchor="middle">寶貝！</text>`),

  // 6. 寶貝越長越大，兩角之間可以掛四十二個斧頭柄
  '06': svg(sky() + sun(690, 90) + cloud(170, 100) + mountain(600, 400, 500, 230, '#b7c7e0') + hills(430, '#8fc87a', '#7aba66') +
    Array.from({ length: 8 }, (_, i) => pine(40 + i * 100, 600 - (i % 2) * 10, 0.3)).join('') +
    at(420, 560, 2.0, false, babe({ mood: 'happy' })) +
    `<path d="M432 236 Q544 290 656 236" fill="none" ${line(4)}/>` +
    Array.from({ length: 12 }, (_, i) => { const t = (i + 0.5) / 12, x = 432 + 224 * t, y = 236 + 2 * t * (1 - t) * 54 + 2; return `<path d="M${x} ${y} V${y + 40}" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M${x} ${y} V${y + 40}" stroke="#c9a06a" stroke-width="4" stroke-linecap="round"/>`; }).join('') +
    at(140, 590, 1.6, false, paul({ pose: 'point', mood: 'happy' }))),

  // 7. 巨大的腳印下雨後裝滿水，變成一個又一個湖
  '07': svg(sky('#c8d8ec', '#eef4fb') + cloud(150, 110, 1.2) + cloud(560, 90) + rain(24) + mountain(640, 380, 420, 200, '#b7c7e0') + hills(380, '#8fc87a', '#7aba66') +
    at(640, 380, 0.55, true, paul({ pose: 'down' })) + at(560, 380, 0.4, true, babe()) +
    bootPrint(140, 560, 1.2) + bootPrint(360, 480, 0.9) + hoofPrint(560, 560, 1) + hoofPrint(470, 440, 0.6) +
    fish(170, 520, 1) + fish(570, 520, 0.9, -50) + bird(300, 300, 0.8) +
    `<path d="M560 480 q20 -20 40 0" fill="none" stroke="#fff" stroke-width="3"/>`),

  // 8. 寶貝把彎彎曲曲的路拉直了
  '08': svg(sky() + sun(110, 90) + cloud(620, 100) + hills(380) + pine(720, 440, 0.8) +
    `<path d="M${BX} 520 Q-60 440 0 500 Q60 560 110 480 Q160 400 220 490 Q260 550 300 510 L520 510" fill="none" stroke="#e9d3a3" stroke-width="44" stroke-linecap="round"/>` +
    `<path d="M300 510 H${BX + BW}" stroke="#e9d3a3" stroke-width="44"/>` +
    `<path d="M300 510 L560 470" ${line(4)}/>` +
    at(620, 560, 1.15, false, babe({ mood: 'angry' })) + sweat(700, 360) + dust(520, 560) + dust(560, 580, 0.8) +
    `<path d="M${BX} 580 Q100 560 200 590 T420 580" fill="none" stroke="#7cc4f2" stroke-width="18" stroke-linecap="round"/>` +
    `<text x="420" y="330" font-size="48" font-weight="700" text-anchor="middle" fill="#3d5a99">嘿咻！</text>`),

  // 9. 超大平底鍋，廚師把奶油綁在腳上溜冰
  '09': svg(room({ wall: '#f2e4cc', stripe: '#e8d6b8', floor: '#c99a6b', window: false }) +
    at(580, 420, 1.15, false, paul({ pose: 'hold', mood: 'happy', item: `<path d="M24 -80 L60 -150" stroke="#a7adb8" stroke-width="8" stroke-linecap="round"/><path d="M50 -150 l4 -24 M60 -150 l2 -24 M70 -148 l-2 -24" ${line(4)}/>` })) +
    `<ellipse cx="380" cy="490" rx="380" ry="90" fill="#3a3236" ${L}/><ellipse cx="380" cy="480" rx="350" ry="74" fill="#5a5560"/>` +
    `<path d="M760 490 H${BX + BW}" stroke="${INK}" stroke-width="24"/>` +
    at(230, 500, 0.7, false, `<g transform="rotate(-10)">${cook()}</g>`) + at(430, 480, 0.7, true, `<g transform="rotate(-10)">${cook({ mood: 'happy' })}</g>`) +
    `<path d="M150 520 q40 14 80 0 M380 500 q40 14 80 0" fill="none" stroke="#f6e27a" stroke-width="4" stroke-linecap="round"/>` +
    pancakes(700, 590, 0.8) + speed(180, 440, 2, 40) +
    [[200, 360], [420, 340], [300, 330]].map(([x, y]) => `<path d="M${x} ${y} q-12 -16 0 -32 q12 -16 0 -32" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>`).join('')),

  // 10. 美國人還在說他們的故事；還有什麼地方是他們弄出來的？
  '10': svg(sky('#f6a87a', '#ffe6c4') + sun(400, 330, 80) + mountain(160, 400, 400, 200, '#a07a9a') + mountain(640, 400, 420, 220, '#b08aa8') +
    hills(440, '#8aa86a', '#7a9a5a') +
    `<ellipse cx="160" cy="540" rx="90" ry="24" fill="#6db8ea"/><ellipse cx="640" cy="560" rx="80" ry="20" fill="#6db8ea"/>` +
    at(300, 560, 1.4, false, paul({ pose: 'raise', mood: 'happy' })) + at(500, 560, 1.1, true, babe({ mood: 'happy' })) +
    `<text x="660" y="300" font-size="64" font-weight="700" text-anchor="middle" fill="#fff">?</text>` + sparkle(560, 260, 0.8, '#fff')),
};

writeBook('paul-bunyan', pages);
