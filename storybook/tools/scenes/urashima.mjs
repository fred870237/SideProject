// 浦島太郎的插畫。用法：node tools/scenes/urashima.mjs --sheet

import {
  BX, BW, INK, line, L, SKIN, at, svg, face, sky, sun, cloud, hills, mountain, tree, pine, grass, sparkle,
  sea, jpHouse, boat, person, hearts, sweat, writeBook,
} from './lib.mjs';
import {
  rot, say, turtle, fish, octopus, seaweed, coral, bubbles, shell, undersea, tamatebako, smoke, sakura,
} from './jp-common.mjs';

// ---------- 浦島太郎專用 ----------
// 浦島太郎：藍色漁夫短衣、髮髻；old = true 變成白頭髮白鬍子
const urashima = ({ old = false, ...o } = {}) => person({
  hair: old ? 'bald' : 'topknot', hairColor: old ? '#f2f2f2' : '#2f2a2a', beard: old ? '#ffffff' : '',
  top: '#4a8fb8', bottom: '#e8d8b0', outfit: 'tunic', ...o,
});

// 釣竿（拿在 point 的右手）
const rod = `<path d="M62 -96 L190 -196" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M62 -96 L190 -196" stroke="#c9905a" stroke-width="3.5" stroke-linecap="round"/>` +
  `<path d="M190 -196 Q200 -120 196 -40" fill="none" stroke="${INK}" stroke-width="1.5"/>`;

// 乙姬公主：長髮、粉紅和服、珍珠頭飾、飄帶
const otohime = (o = {}) =>
  `<path d="M-40 -100 Q-96 -110 -76 -56 Q-64 -20 -104 0" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>` +
  `<path d="M-40 -100 Q-96 -110 -76 -56 Q-64 -20 -104 0" fill="none" stroke="#a6e3e9" stroke-width="7" stroke-linecap="round"/>` +
  person({
    hair: 'long', hairColor: '#2f2a2a', top: '#ff8fb0', bottom: '#f6d36b', outfit: 'robe',
    hat: `<path d="M-26 -24 Q0 -44 26 -24 L22 -34 Q0 -52 -22 -34z" fill="#f6d36b" ${line(2.5)}/><circle cx="0" cy="-44" r="7" fill="#fff" ${line(2)}/><circle cx="-16" cy="-38" r="4" fill="#fff" ${line(1.5)}/><circle cx="16" cy="-38" r="4" fill="#fff" ${line(1.5)}/>`,
    ...o,
  });

const kid = (top, o = {}) => person({ age: 'child', hair: 'short', top, bottom: '#6b5a4a', outfit: 'tunic', ...o });
const stick = `<path d="M70 -60 L120 -110" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M70 -60 L120 -110" stroke="#b5884a" stroke-width="4" stroke-linecap="round"/>`;

// 海邊：海、沙灘
const beach = (seaY = 330, sandY = 450, skyTop, skyBottom) => sky(skyTop, skyBottom) + sea(seaY) +
  `<path d="M${BX} ${sandY} Q-300 ${sandY - 20} 0 ${sandY} Q200 ${sandY + 16} 420 ${sandY - 6} T${BX + BW} ${sandY} V600 H${BX}z" fill="#f0dca8"/>` +
  `<path d="M${BX} ${sandY} Q-300 ${sandY - 20} 0 ${sandY} Q200 ${sandY + 16} 420 ${sandY - 6} T${BX + BW} ${sandY}" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".9"/>`;

// 龍宮
const ryugu = (x, y, s = 1) => {
  const roof = (w, yy) => `<path d="M${-w - 26} ${yy} Q${-w - 10} ${yy - 6} ${-w + 4} ${yy - 30} H${w - 4} Q${w + 10} ${yy - 6} ${w + 26} ${yy}z" fill="#3fae9e" ${L}/>` +
    `<path d="M${-w - 26} ${yy} q-8 -10 -2 -18 M${w + 26} ${yy} q8 -10 2 -18" fill="none" stroke="#f6d36b" stroke-width="5" stroke-linecap="round"/>`;
  return at(x, y, s, false,
    `<ellipse cx="0" cy="-130" rx="260" ry="190" fill="#fff6c8" opacity=".35"/>` +
    `<rect x="-200" y="-36" width="400" height="36" fill="#f6d36b" ${L}/>` +
    `<rect x="-160" y="-140" width="320" height="104" fill="#e2604a" ${L}/>` +
    [-130, -70, 70, 130].map((px) => `<rect x="${px - 8}" y="-140" width="16" height="104" fill="#c9443a" ${line(2)}/>`).join('') +
    `<path d="M-40 -36 V-96 Q0 -130 40 -96 V-36z" fill="#3d2f5a" ${L}/><path d="M-40 -96 Q0 -130 40 -96" fill="none" stroke="#f6d36b" stroke-width="5"/>` +
    roof(160, -136) +
    `<rect x="-100" y="-232" width="200" height="70" fill="#e2604a" ${L}/>` +
    [-60, 0, 60].map((wx) => `<circle cx="${wx}" cy="-198" r="13" fill="#fff6c8" ${line(2.5)}/>`).join('') +
    roof(100, -228) +
    `<circle cx="0" cy="-272" r="16" fill="#fff" ${L}/><circle cx="-5" cy="-277" r="5" fill="#fff6c8"/>`);
};

const puffer = (x, y, s = 1) => at(x, y, s, false,
  `<path d="M-26 0 L-50 -18 L-44 0 L-50 18z" fill="#f2c14e" ${line(2.5)}/>` +
  `<path d="M-4 -24 q8 -18 20 -6z" fill="#f2c14e" ${line(2)}/>` +
  Array.from({ length: 7 }, (_, i) => rot(0, 0, i * 36 - 100, 1, `<path d="M0 -28 l-4 -10 l8 0z" fill="#f2c14e" ${line(1.5)}/>`)).join('') +
  `<circle r="28" fill="#f6d36b" ${L}/><path d="M-26 6 Q0 28 26 6 Q0 34 -26 6z" fill="#fff6d8"/>` + at(0, 0, 0.7, false, face(30, 'happy')));

const note = (x, y, s = 1, c = '#e2483d') => at(x, y, s, false,
  `<path d="M0 0 V-34 L16 -28" fill="none" ${line(4)}/><ellipse cx="-6" cy="2" rx="9" ry="7" fill="${c}" ${line(2.5)}/>`);

// 一桌好吃的：鯛魚、飯糰、糰子
const feast = (x, y, s = 1) => at(x, y, s, false,
  `<rect x="-120" y="-40" width="240" height="22" rx="4" fill="#c9443a" ${L}/><rect x="-104" y="-20" width="18" height="20" fill="#9a3028" ${L}/><rect x="86" y="-20" width="18" height="20" fill="#9a3028" ${L}/>` +
  `<ellipse cx="-60" cy="-46" rx="44" ry="10" fill="#fff" ${line(2.5)}/>` +
  at(-60, -54, 0.9, false, `<path d="M-30 0 L-46 -12 L-46 12z" fill="#ff7a6a" ${line(2)}/><ellipse rx="30" ry="16" fill="#ff7a6a" ${line(2.5)}/><circle cx="16" cy="-4" r="3" fill="${INK}"/>`) +
  `<ellipse cx="30" cy="-46" rx="34" ry="9" fill="#fff" ${line(2.5)}/>` +
  [10, 46].map((ox) => `<path d="M${ox - 14} -50 Q${ox} -78 ${ox + 14} -50z" fill="#fff" ${line(2.5)}/><rect x="${ox - 8}" y="-58" width="16" height="8" fill="#2f2a2a"/>`).join('') +
  `<path d="M74 -44 L112 -84" ${line(3)}/>` + ['#ffd9e0', '#fff8e6', '#b7e0a0'].map((c, i) => `<circle cx="${80 + i * 11}" cy="${-52 - i * 11}" r="8" fill="${c}" ${line(2)}/>`).join(''));

// 想念的氣泡：媽媽和家
const thought = (x, y) =>
  `<circle cx="${x - 120}" cy="${y + 96}" r="8" fill="#fff" ${line(2.5)}/><circle cx="${x - 96}" cy="${y + 72}" r="13" fill="#fff" ${line(2.5)}/>` +
  `<ellipse cx="${x}" cy="${y}" rx="130" ry="86" fill="#fff" ${L}/>` +
  `<clipPath id="tb"><ellipse cx="${x}" cy="${y}" rx="124" ry="80"/></clipPath>` +
  `<g clip-path="url(#tb)"><rect x="${x - 130}" y="${y + 30}" width="260" height="60" fill="#a9d98f"/>` +
  jpHouse(x - 40, y + 50, 0.42) +
  at(x + 60, y + 66, 0.62, true, person({ hair: 'bun', hairColor: '#d9d9d9', top: '#8e6bb0', bottom: '#5a4632', mood: 'normal', pose: 'down' })) + `</g>`;

// 坐在海龜背上的浦島太郎（腳底對齊殼頂）
const riding = (x, y, s = 1) => at(x, y, s, false, turtle() + at(-6, -96, 0.82, false, urashima({ pose: 'point' })));

const pages = {
  // 封面：坐在海龜背上游向龍宮
  cover: svg(undersea(510) + ryugu(640, 520, 0.6) +
    coral(90, 560, 1.1) + coral(170, 580, 0.8, '#ffb36b') + seaweed(250, 590, 130) + seaweed(560, 600, 110) + shell(470, 570) +
    riding(330, 490, 1.1) +
    fish(560, 300, 0.8, '#f6a13a') + fish(110, 330, 0.7, '#ff7a8a', true) + fish(700, 380, 0.6, '#7ad0a0', true) +
    bubbles(200, 300) + bubbles(500, 260, 0.8) + sparkle(640, 240, 0.8, '#fff')),

  // 1. 海邊善良的年輕漁夫
  '01': svg(beach(330, 450) + sun(660, 100, 46) + cloud(160, 100) + cloud(480, 80, 0.7) +
    jpHouse(110, 470, 0.6) + pine(250, 480, 0.9) + boat(620, 520, 0.6) +
    at(360, 570, 1.15, false, urashima({ pose: 'point', item: rod })) +
    `<path d="M560 400 q10 -6 20 0" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>` + grass(30, 590)),

  // 2. 小孩們在欺負小海龜
  '02': svg(beach(330, 440) + cloud(150, 100) + cloud(620, 90, 0.8) +
    at(480, 560, 0.5, false, turtle({ mood: 'cry' })) +
    at(360, 570, 0.95, false, kid('#f2c14e', { mood: 'angry', pose: 'reach', item: stick })) +
    at(610, 570, 0.95, true, kid('#7ad0a0', { mood: 'angry', pose: 'reach', item: stick })) +
    at(540, 470, 0.85, true, kid('#ff9a8a', { hair: 'topknot', mood: 'angry', pose: 'point' })) +
    at(140, 570, 1.1, false, urashima({ mood: 'scared', pose: 'point' })) + sweat(500, 470)),

  // 3. 救下小海龜，放回大海
  '03': svg(beach(330, 450) + sun(670, 90) + cloud(170, 100) +
    at(470, 560, 1.1, false, urashima({ mood: 'happy', pose: 'reach' })) +
    at(550, 500, 0.32, false, turtle()) + hearts(580, 400) +
    at(160, 570, 0.8, true, kid('#f2c14e', { mood: 'cry', pose: 'down' })) +
    at(250, 575, 0.8, true, kid('#7ad0a0', { mood: 'cry', pose: 'down' })) +
    shell(700, 560) + shell(330, 590, 0.8, '#ffe0a0')),

  // 4. 大海龜來報恩
  '04': svg(beach(330, 470) + sun(120, 100) + cloud(560, 90) +
    at(560, 480, 1.25, false, turtle({ mood: 'happy' })) +
    `<path d="M${BX} 470 Q300 455 ${BX + BW} 470" fill="none" stroke="#fff" stroke-width="6"/>` +
    at(250, 570, 1.15, false, urashima({ mood: 'scared', pose: 'down' })) + sparkle(420, 260, 0.8) + sparkle(700, 280, 0.6)),

  // 5. 坐在海龜背上游向海底，好多魚
  '05': svg(undersea(540) + coral(100, 590) + seaweed(700, 600, 150) + seaweed(740, 600, 110, '#3f9a6a') +
    riding(380, 440, 1.1) +
    fish(170, 260, 0.7, '#f6a13a') + fish(110, 420, 0.8, '#ff7a8a') + fish(640, 260, 0.75, '#7ad0a0', true) +
    fish(690, 400, 0.65, '#b48ae8', true) + fish(560, 500, 0.6, '#f6d36b', true) + fish(230, 520, 0.6, '#5bb0f0') +
    bubbles(560, 300) + bubbles(160, 350, 0.8)),

  // 6. 海底深處閃閃發亮的龍宮
  '06': svg(undersea(500) + ryugu(430, 530, 1.05) +
    coral(90, 570, 1.2) + coral(760, 580, 1, '#ffb36b') + seaweed(170, 590, 140) + seaweed(680, 600, 120) +
    riding(150, 470, 0.55) + sparkle(250, 250, 1, '#fff') + sparkle(620, 230, 0.8, '#fff') + sparkle(700, 330, 0.6, '#fff6a8') +
    fish(640, 440, 0.5, '#f6a13a', true)),

  // 7. 乙姬公主歡迎，魚兒跳舞、章魚唱歌
  '07': svg(undersea(470) +
    [60, 740].map((px) => `<rect x="${px - 16}" y="-1400" width="32" height="1880" fill="#e2604a" ${L}/>`).join('') +
    `<rect x="${BX}" y="470" width="${BW}" height="130" fill="#f6c6a0"/>` + `<path d="M${BX} 470 H${BX + BW}" ${line(4)}/>` +
    at(580, 570, 1.15, true, otohime({ pose: 'reach' })) +
    at(290, 570, 1.1, false, urashima({ pose: 'up' })) +
    at(440, 575, 0.85, false, feast(0, 0, 1)) +
    at(150, 500, 1.05, false, octopus()) + note(200, 330) + note(240, 300, 0.8, '#5b8fd0') +
    fish(360, 300, 0.7, '#f6a13a') + fish(470, 260, 0.7, '#ff7a8a', true) + fish(680, 290, 0.6, '#7ad0a0', true) +
    bubbles(560, 260, 0.7)),

  // 8. 玩得好開心，忘記時間
  '08': svg(undersea(470) +
    [60, 740].map((px) => `<rect x="${px - 16}" y="-1400" width="32" height="1880" fill="#e2604a" ${L}/>`).join('') +
    `<rect x="${BX}" y="470" width="${BW}" height="130" fill="#f6c6a0"/>` + `<path d="M${BX} 470 H${BX + BW}" ${line(4)}/>` +
    at(380, 560, 1.2, false, urashima({ pose: 'up' })) +
    at(600, 570, 1, false, feast(0, 0, 1)) +
    puffer(200, 330, 1.1) + at(160, 560, 0.75, false, octopus()) +
    note(260, 260) + note(540, 280, 0.9, '#5b8fd0') + note(660, 340, 0.8) +
    fish(560, 380, 0.6, '#b48ae8', true) + fish(270, 430, 0.55, '#f6a13a') + hearts(470, 300)),

  // 9. 想起家裡的媽媽
  '09': svg(undersea(470) +
    [60, 740].map((px) => `<rect x="${px - 16}" y="-1400" width="32" height="1880" fill="#e2604a" ${L}/>`).join('') +
    `<rect x="${BX}" y="470" width="${BW}" height="130" fill="#f6c6a0"/>` + `<path d="M${BX} 470 H${BX + BW}" ${line(4)}/>` +
    at(260, 570, 1.2, false, urashima({ mood: 'cry', pose: 'hold' })) +
    thought(530, 320) + fish(140, 320, 0.5, '#f6a13a', true)),

  // 10. 乙姬公主送玉手箱：千萬不可以打開
  '10': svg(undersea(490) + ryugu(400, 480, 0.55) +
    `<rect x="${BX}" y="490" width="${BW}" height="110" fill="#f0dca8"/>` +
    at(560, 580, 1.15, true, otohime({ pose: 'raise', mood: 'normal' })) +
    at(250, 580, 1.15, false, urashima({ pose: 'reach', mood: 'normal' })) +
    tamatebako(400, 560, 1) + sparkle(470, 460, 0.6, '#fff6a8') +
    say(400, 280, '不可以打開喔！', 32, '#e2483d') + coral(60, 590) + coral(740, 590, 0.9, '#ffb36b')),

  // 11. 回到村子，什麼都變了
  '11': svg(beach(360, 470, '#cfd8e6', '#eef2f6') + cloud(170, 100) + cloud(560, 90, 0.8) +
    hills(380, '#b9cfa6', '#a4bf90') +
    jpHouse(110, 480, 0.55) + jpHouse(690, 470, 0.6) +
    at(400, 470, 0.5, false, `<rect x="-110" y="-110" width="220" height="110" fill="#e8e0d0" ${L}/><path d="M-140 -100 L-80 -170 H80 L140 -100z" fill="#6f7480" ${L}/><rect x="-24" y="-80" width="48" height="80" fill="#8c6a4a" ${L}/>`) +
    at(280, 575, 1.15, false, urashima({ mood: 'scared', pose: 'hips' })) +
    at(520, 575, 1, true, person({ hair: 'short', top: '#9a9a6a', bottom: '#5a4a3a', mood: 'normal' })) +
    at(630, 580, 0.85, true, person({ age: 'child', hair: 'pigtails', outfit: 'dress', top: '#f2a0b0', mood: 'normal' })) +
    say(220, 330, '？', 54, '#5b8fd0') + say(350, 300, '？', 44, '#5b8fd0') + say(580, 360, '？', 40, '#5b8fd0')),

  // 12. 打開玉手箱，咻！白煙
  '12': svg(beach(340, 460, '#c9c2dc', '#efe8f2') + cloud(160, 100) +
    smoke(440, 380, 1.3) + smoke(600, 320, 0.8) + smoke(480, 500, 0.45) +
    tamatebako(470, 560, 0.8) +
    at(330, 575, 1.15, false, urashima({ mood: 'scared', pose: 'up' })) +
    say(610, 470, '咻！', 50, '#5b6b8a')),

  // 13. 變成白頭髮、白鬍子的老爺爺
  '13': svg(beach(340, 460, '#ffcfb0', '#fff0e0') + sun(560, 330, 56) +
    `<rect x="${BX}" y="340" width="${BW}" height="6" fill="#ffd9a0" opacity=".6"/>` +
    smoke(170, 420, 0.7) + smoke(640, 400, 0.55) +
    tamatebako(530, 570, 0.7) +
    at(380, 575, 1.2, false, urashima({ old: true, mood: 'cry', pose: 'down' })) + pine(730, 480, 0.9)),
};

writeBook('urashima', pages);
