// 一寸法師的插畫。用法：node tools/scenes/issun-boshi.mjs --sheet

import {
  BX, BW, INK, line, L, SKIN, at, svg, face, sky, sun, cloud, hills, mountain, tree, pine, grass, sparkle,
  water, jpHouse, jpInterior, grandpa, grandma, oni, person, hearts, sweat, writeBook,
} from './lib.mjs';
import { rot, say, eboshi, waistSword, jpCastle, torii, hokora, sakura, petals } from './jp-common.mjs';

// ---------- 一寸法師專用 ----------
// 縫衣針寶劍（身體座標，舉在 raise 的右手）
const needleUp = `<path d="M40 -120 L40 -250" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M40 -120 L40 -250" stroke="#e6ecf2" stroke-width="5" stroke-linecap="round"/>` +
  `<ellipse cx="40" cy="-128" rx="3" ry="7" fill="none" stroke="${INK}" stroke-width="2"/>`;
// 插在腰間的針
const needleWaist = `<path d="M-14 -50 L-80 -14" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M-14 -50 L-80 -14" stroke="#e6ecf2" stroke-width="4" stroke-linecap="round"/>`;

// 一寸法師：髮髻、綠色衣服、藍綠褲裙；畫面上用很小的比例（0.3 左右）
const issun = (o = {}) => person({ age: 'child', hair: 'topknot', top: '#5fae5a', bottom: '#2f7a7a', outfit: 'tunic', item: needleWaist, ...o });
// 長大後
const issunBig = (o = {}) => person({ hair: 'topknot', top: '#5fae5a', bottom: '#2f7a7a', outfit: 'robe', item: waistSword, ...o });

const princess = (o = {}) => person({
  hair: 'long', hairColor: '#2f2a2a', top: '#e8647e', bottom: '#f6d36b', outfit: 'robe',
  hat: `<circle cx="22" cy="-28" r="9" fill="#ffc6d6" ${line(2)}/><circle cx="22" cy="-28" r="3" fill="#f6d36b"/><path d="M28 -22 l8 14 M24 -20 l2 16" ${line(2)}/>`,
  ...o,
});
const minister = (o = {}) => person({ hair: 'short', top: '#6b4a8a', bottom: '#3d2f5a', beard: '#3a2a22', hat: eboshi(), ...o });

// 木碗（紅色漆碗），原點在碗底中心；back / front 分開畫，人才能坐進碗裡
const bowlBack = (s = 1) => at(0, 0, s, false, `<ellipse cx="0" cy="-60" rx="70" ry="16" fill="#5a1f1a" ${L}/>`);
const bowlFront = (s = 1) => at(0, 0, s, false,
  `<path d="M-70 -60 Q-66 -6 -20 0 H20 Q66 -6 70 -60 Q0 -40 -70 -60z" fill="#c9443a" ${L}/>` +
  `<path d="M-56 -36 Q0 -22 56 -36" fill="none" stroke="#f6d36b" stroke-width="4"/>` +
  `<path d="M-50 -48 q4 20 18 30" fill="none" stroke="#e8786a" stroke-width="5" stroke-linecap="round"/>`);
const bowl = (x, y, s = 1) => at(x, y, s, false, bowlBack() + bowlFront());

const chopsticks = (x, y, deg = 0, s = 1) => rot(x, y, deg, s,
  [0, 12].map((d) => `<path d="M${d} 0 L${d - 4} -170" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M${d} 0 L${d - 4} -170" stroke="#d9a45a" stroke-width="5" stroke-linecap="round"/>`).join(''));
const needle = (x, y, deg = 0, s = 1) => rot(x, y, deg, s,
  `<path d="M0 0 L0 -100" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M0 0 L0 -100" stroke="#e6ecf2" stroke-width="4" stroke-linecap="round"/>` +
  `<ellipse cx="0" cy="-8" rx="2.5" ry="6" fill="none" stroke="${INK}" stroke-width="2"/>`);

// 打出小槌：原點在握柄底端
const kozuchi = (x, y, deg = 0, s = 1) => rot(x, y, deg, s,
  `<path d="M0 0 V-70" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M0 0 V-70" stroke="#c9443a" stroke-width="8" stroke-linecap="round"/>` +
  `<rect x="-46" y="-110" width="92" height="50" rx="20" fill="#f6d36b" ${L}/>` +
  `<path d="M-30 -110 V-60 M30 -110 V-60" stroke="#c9443a" stroke-width="6"/>` +
  `<circle cx="0" cy="-85" r="11" fill="#ff7a8a" ${line(2)}/>`);

// 量尺（顯示一寸有多小）
const ruler = (x, y, s = 1) => at(x, y, s, false,
  `<rect x="-12" y="-150" width="24" height="150" fill="#f1dfbf" ${L}/>` +
  Array.from({ length: 10 }, (_, i) => `<path d="M-12 ${-15 - i * 15} h${i % 2 ? 8 : 14}" ${line(2)}/>`).join(''));

const cup = (x, y, s = 1) => at(x, y, s, false,
  `<path d="M-30 -66 H30 L26 -4 Q0 4 -26 -4z" fill="#8fb8c9" ${L}/><path d="M-26 -40 h52" stroke="#6a96aa" stroke-width="4"/>`);

const frog = (x, y, s = 1, flip = false) => at(x, y, s, flip,
  `<ellipse cx="0" cy="-26" rx="36" ry="26" fill="#7cc06a" ${L}/>` +
  `<circle cx="-14" cy="-52" r="12" fill="#7cc06a" ${L}/><circle cx="14" cy="-52" r="12" fill="#7cc06a" ${L}/>` +
  `<circle cx="-14" cy="-52" r="4" fill="${INK}"/><circle cx="14" cy="-52" r="4" fill="${INK}"/>` +
  `<path d="M-16 -24 q16 12 32 0" fill="none" ${line(3)}/><ellipse cx="0" cy="-12" rx="20" ry="10" fill="#d8f0b0"/>`);
const lilypad = (x, y, s = 1) => at(x, y, s, false, `<ellipse cx="0" cy="-6" rx="66" ry="18" fill="#5fae5a" ${L}/><path d="M0 -6 L40 8" ${line(2.5)}/>`);
const dragonfly = (x, y, s = 1) => at(x, y, s, false,
  `<ellipse cx="-12" cy="-10" rx="22" ry="8" fill="#e6f6ff" opacity=".9" ${line(2)} transform="rotate(-20 -12 -10)"/>` +
  `<ellipse cx="12" cy="-10" rx="22" ry="8" fill="#e6f6ff" opacity=".9" ${line(2)} transform="rotate(20 12 -10)"/>` +
  `<path d="M0 0 L0 50" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M0 0 L0 50" stroke="#5b8fd0" stroke-width="4" stroke-linecap="round"/>` +
  `<circle cx="0" cy="-4" r="8" fill="#5b8fd0" ${line(2)}/>`);
const reeds = (x, y, s = 1) => at(x, y, s, false,
  [-20, 0, 18].map((d, i) => `<path d="M${d} 0 Q${d + 6} -100 ${d - 4} -${190 + i * 20}" fill="none" stroke="#5f9f4f" stroke-width="6" stroke-linecap="round"/>` +
    `<ellipse cx="${d - 3}" cy="-${180 + i * 20}" rx="7" ry="22" fill="#9a6b45" ${line(2)}/>`).join(''));

// 嬰兒（包在布裡）
const baby = `<ellipse cx="0" cy="-16" rx="20" ry="16" fill="#ffd0dc" ${L}/>` + at(0, -40, 1, false, `<circle r="18" fill="${SKIN}" ${L}/>` + at(0, 0, 0.6, false, face(30, 'happy')));

const pages = {
  // 封面：坐在碗船裡，用筷子划船，身邊的青蛙比他還大
  cover: svg(sky('#cfeaff', '#eef8ff') + sun(660, 100, 44) + cloud(170, 110) + hills(330, '#a9d98f', '#8dc775') +
    jpCastle(640, 340, 0.4) +
    water(380, 220, '#6cbcf0') +
    reeds(80, 540, 1.1) + reeds(740, 560, 0.9) +
    at(400, 500, 1.4, false, bowlBack() + at(0, -54, 0.38, false, issun({ pose: 'reach', mood: 'happy' })) + bowlFront()) +
    chopsticks(520, 528, -30, 0.95) +
    lilypad(200, 530) + frog(200, 526, 0.9) + dragonfly(560, 300, 0.9) +
    sparkle(320, 270, 0.7) + sparkle(470, 240, 0.5)),

  // 1. 老爺爺老奶奶向神明祈求
  '01': svg(sky('#ffd9c9', '#fff2e6') + sun(620, 150, 46) + cloud(180, 110) + hills(400, '#a9d98f', '#8dc775') +
    torii(400, 520, 0.95) + hokora(400, 520, 0.9) + pine(90, 500, 1) + pine(720, 500, 1.1) +
    at(260, 580, 1.05, false, grandpa({ mood: 'normal', pose: 'hold' })) +
    at(540, 580, 1.05, true, grandma({ mood: 'normal', pose: 'hold' })) +
    sparkle(400, 250, 0.8) + sparkle(330, 300, 0.5) + sparkle(470, 300, 0.5)),

  // 2. 只有手指頭那麼大的男孩
  '02': svg(jpInterior() +
    at(460, 570, 1.25, true, grandma({ mood: 'happy', pose: 'hold' })) +
    at(440, 488, 0.6, false, baby) +
    at(220, 570, 1.2, false, grandpa({ mood: 'scared', pose: 'up' })) +
    sparkle(370, 380, 0.7) + sparkle(320, 430, 0.5) + hearts(560, 300)),

  // 3. 怎麼長都長不高，叫他一寸法師
  '03': svg(jpInterior() +
    at(170, 570, 1.2, false, grandpa({ mood: 'happy', pose: 'down' })) +
    ruler(420, 560, 1) + cup(560, 560, 0.9) +
    at(470, 560, 0.33, false, issun({ pose: 'hips', mood: 'happy' })) +
    at(660, 570, 1.2, true, grandma({ mood: 'happy', pose: 'down' })) +
    sparkle(470, 470, 0.5)),

  // 4. 我要去京城！
  '04': svg(sky() + sun(110, 90) + cloud(560, 100) + hills(370) + jpCastle(640, 400, 0.45) +
    `<path d="M300 600 Q420 470 560 420 L600 420 Q480 480 440 600z" fill="#e9d3a3"/>` +
    jpHouse(130, 470, 0.6) +
    at(200, 580, 1, false, grandpa({ mood: 'scared', pose: 'down' })) + at(300, 580, 1, false, grandma({ mood: 'cry', pose: 'hold' })) +
    // 站在石頭上的一寸法師
    `<ellipse cx="470" cy="560" rx="40" ry="16" fill="#a8a39a" ${L}/>` +
    at(470, 550, 0.4, false, issun({ pose: 'point', mood: 'happy' })) +
    sparkle(520, 460, 0.5) + say(560, 380, '我要去京城！', 30, '#2f7a7a')),

  // 5. 針當寶劍、木碗當船、筷子當槳
  '05': svg(jpInterior() +
    at(150, 580, 1.2, false, grandma({ mood: 'happy', pose: 'reach' })) +
    bowl(560, 560, 1) + chopsticks(700, 570, 70, 1) + needle(330, 520, 90, 1) +
    at(430, 560, 0.33, false, issun({ pose: 'raise', mood: 'happy', item: needleUp })) +
    sparkle(560, 440, 0.6) + sparkle(430, 450, 0.5)),

  // 6. 坐在碗船裡，用筷子划到京城
  '06': svg(sky() + cloud(170, 100) + sun(690, 90) + hills(330, '#9fd38a', '#86c46f') + jpCastle(660, 350, 0.45) +
    water(370, 230, '#6cbcf0') +
    reeds(60, 560, 1) + reeds(760, 580, 1.1) +
    at(380, 490, 1.3, false, bowlBack() + at(0, -54, 0.38, false, issun({ pose: 'reach', mood: 'happy' })) + bowlFront()) +
    chopsticks(500, 522, -32, 0.9) +
    lilypad(600, 540, 0.8) + frog(600, 536, 0.7, true) + dragonfly(230, 300, 0.8) +
    `<path d="M300 520 q20 -10 40 0 M440 530 q20 -10 40 0" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`),

  // 7. 來到大臣家，留下來工作
  '07': svg(jpInterior() +
    at(270, 580, 1.25, false, minister({ mood: 'happy', pose: 'point' })) +
    // 坐墊上的一寸法師
    `<rect x="440" y="540" width="90" height="22" rx="8" fill="#8e6bb0" ${L}/>` +
    at(485, 542, 0.34, true, issun({ pose: 'hold', mood: 'happy' })) +
    hearts(560, 400) + sparkle(380, 430, 0.5)),

  // 8. 陪公主去寺廟參拜
  '08': svg(sky('#ffe6ee', '#fff6f8') + cloud(170, 100) + hills(380, '#b9e0a0', '#9fd38a') +
    torii(600, 500, 1.05) + sakura(120, 500, 1.1) + sakura(760, 520, 0.9) +
    `<rect x="${BX}" y="500" width="${BW}" height="100" fill="#e9d3a3"/>` +
    at(350, 580, 1.25, false, princess({ pose: 'reach', mood: 'happy' })) +
    at(350 + 74 * 1.25, 580 - 76 * 1.25, 0.32, false, issun({ pose: 'point', mood: 'happy' })) +
    petals([[260, 330], [480, 300], [560, 420], [200, 440], [680, 350], [420, 250]])),

  // 9. 突然跳出一隻大鬼
  '09': svg(sky('#b9a7d0', '#efe6f5') + cloud(150, 100, 0.9) + hills(380, '#9fbf8a', '#86ab74') +
    pine(80, 480) + pine(740, 470, 1.1) +
    `<rect x="${BX}" y="500" width="${BW}" height="100" fill="#d9c59a"/>` +
    at(570, 580, 1.2, true, oni({ mood: 'angry' })) +
    at(180, 580, 1.15, false, princess({ pose: 'up', mood: 'scared' })) +
    at(330, 580, 0.36, false, issun({ pose: 'raise', mood: 'angry', item: needleUp })) +
    sweat(140, 380) + say(400, 300, '哇！', 44, '#e2483d')),

  // 10. 大鬼哈哈大笑，把小小的他抓起來
  '10': svg(sky('#b9a7d0', '#efe6f5') + cloud(150, 100, 0.9) + hills(380, '#9fbf8a', '#86ab74') +
    pine(740, 470, 1.1) +
    `<rect x="${BX}" y="500" width="${BW}" height="100" fill="#d9c59a"/>` +
    at(480, 580, 1.2, true, oni({ mood: 'happy', club: false }) +
      `<path d="M40 -124 L74 -186" stroke="${INK}" stroke-width="30" stroke-linecap="round"/><path d="M40 -124 L74 -186" stroke="#e0503a" stroke-width="22" stroke-linecap="round"/>` +
      at(76, -196, 0.3, false, issun({ pose: 'raise', mood: 'angry', item: needleUp })) +
      `<circle cx="76" cy="-192" r="16" fill="#e0503a" ${L}/>`) +
    at(150, 580, 1.1, false, princess({ pose: 'hold', mood: 'cry' })) +
    say(620, 300, '哈哈哈！', 40, '#c9443a')),

  // 11. 在肚子裡戳戳戳，大鬼痛得把他吐出來
  '11': svg(sky('#c9b9de', '#f2ecf7') + cloud(620, 100, 0.9) + hills(380, '#9fbf8a', '#86ab74') +
    `<rect x="${BX}" y="500" width="${BW}" height="100" fill="#d9c59a"/>` +
    at(560, 580, 1.15, true, oni({ mood: 'cry', club: false })) +
    [[540, 470], [600, 430], [500, 420]].map(([x, y]) => sparkle(x, y, 0.6)).join('') +
    // 被吐出來的一寸法師，飛在空中
    `<path d="M450 400 Q380 330 290 420" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="6 10" stroke-linecap="round"/>` +
    rot(280, 450, -20, 0.34, issun({ pose: 'up', mood: 'happy', item: needleUp })) +
    at(130, 580, 1.05, false, princess({ pose: 'up', mood: 'happy' })) +
    say(640, 300, '哎唷哎唷！', 36, '#c9443a')),

  // 12. 大鬼掉下了打出小槌
  '12': svg(sky() + cloud(170, 100) + sun(690, 90) + hills(380) + pine(740, 470) +
    at(620, 420, 0.35, true, oni({ mood: 'cry', club: false })) +
    `<rect x="${BX}" y="500" width="${BW}" height="100" fill="#e9d3a3"/>` +
    `<ellipse cx="420" cy="560" rx="90" ry="20" fill="#fff6a8" opacity=".8"/>` +
    kozuchi(380, 560, -70, 1) +
    sparkle(400, 470, 0.8) + sparkle(480, 500, 0.6) + sparkle(340, 500, 0.5) +
    at(210, 580, 1.2, false, princess({ pose: 'point', mood: 'happy' })) +
    at(560, 570, 0.36, true, issun({ pose: 'up', mood: 'happy' }))),

  // 13. 變大、變大！越長越高
  '13': svg(jpInterior() +
    at(180, 580, 1.2, false, princess({ pose: 'raise', mood: 'happy', item: kozuchi(40, -150, 30, 0.9) })) +
    `<g opacity=".45">${at(360, 570, 0.35, false, issun({ pose: 'up' }))}</g>` +
    `<g opacity=".7">${at(450, 570, 0.65, false, issun({ pose: 'up' }))}</g>` +
    at(600, 570, 1.15, false, issunBig({ pose: 'up', mood: 'happy' })) +
    `<path d="M380 470 Q470 380 560 330" fill="none" stroke="#f6d36b" stroke-width="6" stroke-dasharray="4 12" stroke-linecap="round"/>` +
    sparkle(320, 330) + sparkle(520, 260, 0.8) + sparkle(700, 300, 0.7) + sparkle(420, 420, 0.6) +
    say(400, 260, '變大！變大！', 34, '#e2483d')),

  // 14. 結婚，接爺爺奶奶到京城
  '14': svg(sky('#ffe6ee', '#fff6f8') + sun(400, 120, 50) + cloud(150, 100) + cloud(640, 90, 0.8) +
    hills(400, '#b9e0a0', '#9fd38a') + jpCastle(400, 450, 0.55) + sakura(80, 520, 1) + sakura(730, 520, 1) +
    at(320, 580, 1.1, false, issunBig({ pose: 'up', mood: 'happy' })) +
    at(440, 580, 1.1, true, princess({ pose: 'up', mood: 'happy' })) +
    at(180, 585, 0.95, false, grandpa({ pose: 'up' })) + at(590, 585, 0.95, true, grandma({ pose: 'up' })) +
    hearts(370, 340) + petals([[230, 300], [520, 280], [640, 400], [150, 420], [380, 230]])),
};

writeBook('issun-boshi', pages);
