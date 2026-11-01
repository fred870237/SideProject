// 龜兔賽跑的插畫。用法：node tools/scenes/tortoise-hare.mjs --sheet
import { BX, BW, H, INK, line, L, at, svg, sky, sun, cloud, hills, ground, tree, pine, grass, sparkle, forest, sweat, bird, hearts, writeBook } from './lib.mjs';
import { hare, tortoise, owl, squirrel, finishLine, flowers, txt, zzz, speed } from './eu-common.mjs';

// ---------- 道具、背景 ----------
const dust = (x, y, s = 1) => at(x, y, s, false,
  `<circle cx="0" cy="-14" r="16" fill="#efe3c8" ${line(2)}/><circle cx="-22" cy="-10" r="12" fill="#efe3c8" ${line(2)}/><circle cx="-40" cy="-6" r="8" fill="#efe3c8" ${line(2)}/>`);
const confetti = (n = 26) => Array.from({ length: n }, (_, i) => {
  const x = 50 + ((i * 197) % 700), y = 200 + ((i * 113) % 190);
  return `<rect x="${x}" y="${y}" width="10" height="16" rx="2" fill="${['#e2483d', '#ffd25e', '#5b8fd0', '#6cbd62', '#ff8fb1'][i % 5]}" transform="rotate(${i * 37} ${x + 5} ${y + 8})"/>`;
}).join('');
// 山頂的大樹（終點）
const bigTree = (x, y, s = 1) => tree(x, y, s);
const track = (y = 470) => `<path d="M${BX} ${y} Q200 ${y - 30} 400 ${y} T${BX + BW} ${y - 10} V${y + 50} Q600 ${y + 30} 400 ${y + 50} T${BX} ${y + 50}z" fill="#e9d3a3"/>`;
const meadow = (skyTop = '#bfe4ff', skyBot = '#eaf6ff', sunX = 680) => sky(skyTop, skyBot) + sun(sunX, 90) + cloud(170, 110) + cloud(500, 80, 0.7) +
  hills(360) + ground(430, '#8dc775');
// 遠方有大樹的山丘
const goalHill = (x = 620, s = 1) => at(x, 440, s, false, `<path d="M-300 20 Q-140 -70 0 -70 Q140 -70 300 20z" fill="#a9d98f"/>`) + bigTree(x, 440 - 66 * s, 0.8 * s);
const start = (x) => `<path d="M${x} 520 L${x - 20} 600" stroke="#fff" stroke-width="8" stroke-linecap="round"/>`;

// ---------- 每一頁 ----------
const pages = {
  // 封面：兔子和烏龜賽跑，貓頭鷹當裁判
  cover: svg(meadow('#bfe4ff', '#eaf6ff', 110) + goalHill(600, 1.1) + track(500) +
    at(180, 540, 1.1, false, hare({ pose: 'run' })) + speed(110, 420, 3, 70) +
    at(430, 570, 1.25, false, tortoise({ mood: 'happy' })) +
    at(690, 580, 0.95, true, owl({ flag: true })) + flowers(590, [60, 300, 560]) + sparkle(330, 280, 0.7)),

  // 1. 我是森林裡跑得最快的！
  '01': svg(meadow() + forest(400, '#5a9e5a', '#4a8a4f') + ground(450, '#8dc775') + tree(110, 520, 1.2) + tree(690, 510, 1.1) +
    at(400, 570, 1.4, false, hare({ pose: 'hips', mood: 'happy' })) +
    sparkle(300, 300) + sparkle(510, 270, 0.8) + flowers(590, [200, 560, 620]) + bird(600, 250, 0.9, '#f2c14e')),

  // 2. 兔子笑烏龜爬得慢
  '02': svg(meadow() + tree(100, 470, 1.1) + pine(720, 450, 1) + track(480) +
    at(250, 570, 1.25, false, hare({ pose: 'point', mood: 'happy' })) +
    at(560, 560, 1.15, true, tortoise({ mood: 'normal', step: 1 })) +
    txt(250, 290, '哈哈哈', 38, '#d0503a') + `<path d="M650 540 h40 M660 556 h30" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`),

  // 3. 那我們來比賽吧！
  '03': svg(meadow() + goalHill(560, 1) + track(500) +
    at(220, 570, 1.2, false, tortoise({ mood: 'happy' })) +
    at(520, 575, 1.2, true, hare({ pose: 'stand', mood: 'scared' })) +
    txt(440, 330, '！', 48, '#e2483d') + txt(260, 300, '比賽吧！', 34, '#4c8a3a')),

  // 4. 貓頭鷹當裁判：預備——開始！
  '04': svg(meadow() + goalHill(640, 0.8) + track(500) + start(330) +
    at(110, 540, 0.8, false, squirrel({ up: true })) + at(720, 520, 0.75, true, squirrel({ up: true })) + bird(660, 300, 1, '#5b8fd0') +
    at(250, 570, 1.1, false, tortoise()) + at(410, 575, 1.1, false, hare({ pose: 'stand', mood: 'happy' })) +
    at(590, 575, 1.05, true, owl({ flag: true })) + txt(520, 250, '開始！', 40, '#e2483d')),

  // 5. 兔子咻一聲衝出去
  '05': svg(meadow() + forest(410, '#5a9e5a', '#4a8a4f') + track(480) +
    at(520, 550, 1.3, false, hare({ pose: 'run', mood: 'happy' })) + speed(420, 400, 4, 120) +
    dust(380, 560, 1) + dust(300, 580, 0.8) + txt(250, 330, '咻——', 44, '#5b8fd0') + flowers(590, [60, 720])),

  // 6. 靠在樹下呼呼大睡
  '06': svg(meadow('#bfe4ff', '#fff6dd') + goalHill(680, 0.7) + track(500) +
    at(330, 560, 1.7, false, `<rect x="-14" y="-110" width="28" height="110" fill="#9a6b45" ${L}/><circle cx="0" cy="-150" r="60" fill="#5fae5a" ${L}/><circle cx="-40" cy="-120" r="38" fill="#6cbd62" ${L}/><circle cx="42" cy="-118" r="36" fill="#6cbd62" ${L}/>`) +
    at(400, 575, 1.3, false, hare({ pose: 'sleep' })) + zzz(470, 400, 1.1) + flowers(590, [120, 620, 700])),

  // 7. 烏龜一步一步慢慢地爬
  '07': svg(sky('#ffe7b0', '#fff6dd') + sun(640, 110, 60) + cloud(200, 100) + hills(380, '#b9db8a', '#a3cf74') + ground(440, '#a3cf74') + track(490) +
    at(400, 565, 1.5, false, tortoise({ mood: 'normal', step: 1 })) + sweat(560, 380) + sweat(590, 410) +
    `<path d="M220 560 l10 -6 M190 566 l10 -6 M160 572 l10 -6" ${line(3)}/>` + txt(220, 360, '一步、一步', 32, '#4c8a3a') + flowers(590, [60, 720])),

  // 8. 爬過睡覺的兔子身邊
  '08': svg(meadow('#ffe7b0', '#fff6dd', 640) + goalHill(700, 0.7) + track(500) +
    at(200, 540, 1.4, false, `<rect x="-14" y="-110" width="28" height="110" fill="#9a6b45" ${L}/><circle cx="0" cy="-150" r="60" fill="#5fae5a" ${L}/><circle cx="-40" cy="-120" r="38" fill="#6cbd62" ${L}/><circle cx="42" cy="-118" r="36" fill="#6cbd62" ${L}/>`) +
    at(240, 560, 1.1, false, hare({ pose: 'sleep' })) + zzz(300, 410, 0.9) +
    at(520, 580, 1.2, false, tortoise({ mood: 'happy', step: 1 })) + txt(560, 330, '噓——', 34, '#4c8a3a')),

  // 9. 兔子醒來，太陽快下山了
  '09': svg(sky('#f29a6a', '#ffd9a0') + sun(400, 380, 70) + cloud(150, 110) + cloud(620, 90, 0.8) +
    hills(380, '#c9a96a', '#b8955a') + ground(440, '#b8955a') + track(490) +
    at(480, 555, 1.35, false, hare({ pose: 'run', mood: 'scared' })) + speed(370, 400, 4, 110) + dust(350, 570, 0.9) +
    sweat(560, 340) + sweat(600, 370) + txt(220, 300, '糟糕！', 42, '#e2483d')),

  // 10. 烏龜先到終點，大家歡呼
  '10': svg(sky('#ffd9c9', '#fff2e6') + sun(120, 110, 50) + cloud(600, 90) + hills(390, '#a9d98f', '#8dc775') + ground(450, '#8dc775') +
    tree(400, 440, 1.3) + finishLine(400, 560, 1.2, true) +
    at(400, 575, 1.15, false, tortoise({ mood: 'happy' })) +
    at(140, 580, 0.95, false, owl({ cheer: true })) + at(250, 570, 0.8, false, squirrel({ up: true })) +
    at(620, 570, 0.8, true, squirrel({ up: true })) + bird(700, 300, 1, '#f2c14e') + bird(560, 240, 0.9, '#5b8fd0') +
    confetti() + txt(660, 430, '好棒！', 36, '#e2483d')),

  // 11. 不驕傲、不放棄
  '11': svg(sky('#ffd9c9', '#fff2e6') + sun(660, 100, 50) + cloud(170, 100) + hills(380, '#a9d98f', '#8dc775') + ground(450, '#8dc775') +
    tree(110, 470, 1.1) + finishLine(660, 520, 0.8, true) +
    at(300, 575, 1.3, false, hare({ pose: 'bow', mood: 'cry' })) +
    at(510, 570, 1.25, true, tortoise({ mood: 'happy' })) + hearts(400, 330) + flowers(590, [60, 200, 740])),
};

writeBook('tortoise-hare', pages);
