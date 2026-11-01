// 小紅帽的插畫。用法：node tools/scenes/red-riding-hood.mjs --sheet
import { BX, BW, H, INK, line, L, at, svg, sky, sun, cloud, hills, ground, path, tree, pine, grass, sparkle, forest,
  cottage, room, person, grandma, hand, hearts, sweat, bird, writeBook } from './lib.mjs';
import { wolf, wolfHead, bed, basket, flower, flowers, txt, zzz } from './eu-common.mjs';

// ---------- 角色 ----------
const redHood = (o = {}) => person({ age: 'child', hat: 'hood', hatColor: '#e2483d', hair: 'short', hairColor: '#8a5a32',
  outfit: 'dress', top: '#4f7fc8', apron: '#fff', shoes: '#8a3a2a', ...o });
// 拿籃子的小紅帽（右手）
const redWithBasket = (o = {}) => {
  const [hx, hy] = hand(o.pose || 'down', 'child');
  return redHood({ ...o, item: basket(hx, hy + 2, 0.9) + (o.item || '') });
};
const mom = (o = {}) => person({ hair: 'bun', hairColor: '#8a5a32', outfit: 'dress', top: '#8fbf6a', apron: '#fff', ...o });
const hunterHat = `<path d="M-38 -14 Q0 -4 38 -14 L28 -26 Q0 -62 -28 -26z" fill="#4f7f3f" ${L}/><path d="M-30 -22 Q0 -14 30 -22" fill="none" stroke="#c9a03a" stroke-width="4"/>` +
  `<path d="M18 -30 Q30 -62 54 -70 Q46 -42 22 -26z" fill="#e2483d" ${line(2)}/>`;
const hunter = (o = {}) => person({ outfit: 'tunic', top: '#5f8f4f', bottom: '#7a5638', beard: '#7a5638', hairColor: '#7a5638', hat: hunterHat, shoes: '#5a3a22', ...o });
const scissors = (x, y, s = 1) => at(x, y, s, false,
  `<circle cx="-10" cy="14" r="9" fill="none" stroke="${INK}" stroke-width="8"/><circle cx="-10" cy="14" r="9" fill="none" stroke="#5b8fd0" stroke-width="4"/>` +
  `<circle cx="10" cy="14" r="9" fill="none" stroke="${INK}" stroke-width="8"/><circle cx="10" cy="14" r="9" fill="none" stroke="#5b8fd0" stroke-width="4"/>` +
  `<path d="M-4 6 L14 -50 L4 4z M4 6 L-14 -50 L-4 4z" fill="#dfe6ee" ${line(2.5)}/>`);

// 奶奶的房間
const grannyRoom = () => room({ wall: '#eef0f8', stripe: '#e2e6f2', floor: '#c99a6b' }) +
  `<rect x="650" y="330" width="60" height="50" fill="#a0683e" ${L}/><rect x="640" y="320" width="80" height="14" fill="#b87a4a" ${L}/>` +
  `<path d="M668 320 v-26 h24 v26" fill="#bfe4ff" ${line(2)}/><path d="M676 294 q4 -14 12 -10" fill="none" ${line(2)}/>` +
  `<rect x="60" y="250" width="70" height="80" fill="#f6e7b8" ${L}/><circle cx="95" cy="290" r="22" fill="#f5a3a3" ${line(2)}/>`;
const bedWolf = (opts = {}, belly = 30) => bed(380, 560, 1.15, {
  belly,
  head: at(-132, -104, 1, false, `<g transform="rotate(-8)">${wolfHead({ cap: true, ...opts })}</g>`),
});

// 森林小路背景
const woods = (sunX = 680) => sky('#bfe4ff', '#eaf6ff') + sun(sunX, 90) + cloud(200, 100) +
  hills(330, '#8fc879', '#76b864') + forest(360, '#4f9a5f', '#3f8a52') + ground(420, '#86c46f') +
  `<path d="M260 ${H} Q330 500 380 460 T470 420 L520 420 Q460 470 500 520 T600 ${H}z" fill="#e9d3a3"/>`;

// ---------- 每一頁 ----------
const pages = {
  // 封面：小紅帽提著籃子，大野狼躲在樹後
  cover: svg(woods(120) + tree(640, 520, 1.5) + pine(90, 470, 1.1) +
    at(700, 520, 1, true, wolf({ pose: 'point' })) + tree(600, 560, 1.1) +
    at(360, 560, 1.25, false, redWithBasket({ pose: 'down' })) +
    flowers(570, [150, 210, 250, 470, 520]) + sparkle(280, 260, 0.7) + bird(230, 230, 0.9)),

  // 1. 戴紅帽子的小女孩
  '01': svg(sky() + sun(680, 90) + cloud(160, 110) + hills(380) + cottage(200, 470, 0.9) + tree(660, 470, 1.1) +
    at(440, 560, 1.3, false, redHood({ pose: 'raise' })) +
    flowers(570, [70, 120, 330, 560, 610, 730]) + sparkle(520, 270) + sparkle(370, 250, 0.6) + hearts(520, 360)),

  // 2. 媽媽交代：把籃子送去給奶奶
  '02': svg(room({ wall: '#f6e3c8', stripe: '#efd5b2' }) +
    `<rect x="120" y="330" width="160" height="50" fill="#b87a4a" ${L}/><rect x="110" y="320" width="180" height="14" fill="#c98a5a" ${L}/>` +
    `<ellipse cx="170" cy="312" rx="26" ry="10" fill="#e8b170" ${line(2)}/><path d="M230 320 v-30 h20 v30" fill="#e2483d" ${line(2)}/>` +
    at(250, 570, 1.2, false, mom({ pose: 'reach', mood: 'normal' })) +
    basket(330, 470, 1.1) +
    at(490, 570, 1.2, true, redHood({ pose: 'reach' }))),

  // 3. 走進森林
  '03': svg(woods() + pine(80, 470, 1.2) + pine(720, 480, 1.3) + tree(170, 520, 1.1) + tree(640, 540, 1) +
    at(430, 540, 1.15, false, redWithBasket()) + flowers(575, [250, 300, 580]) + bird(560, 260, 0.9, '#f2c14e')),

  // 4. 大野狼笑咪咪地問
  '04': svg(woods() + pine(90, 480, 1.2) + tree(720, 520, 1.2) +
    at(280, 560, 1.15, false, redWithBasket({ mood: 'normal' })) +
    at(530, 560, 1.15, true, wolf({ pose: 'point' })) +
    flowers(580, [100, 160, 690]) + txt(400, 290, '？', 44, '#5b8fd0')),

  // 5. 離開小路去摘花，大野狼偷偷跑走
  '05': svg(sky() + sun(110, 90) + cloud(560, 100) + hills(340, '#a9d98f', '#8dc775') + forest(370, '#5a9e5a', '#4a8a4f') + ground(420, '#9fd38a') +
    flowers(470, [60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720]) + flowers(520, [40, 100, 160, 220, 380, 440, 500, 560, 620, 700, 760]) +
    at(300, 580, 1.15, false, redHood({ pose: 'hold', item: flower(14, -50, 1.1, '#ff8fb1') + flower(4, -44, 1, '#ffd25e') })) + basket(180, 580, 1) +
    flowers(590, [80, 400, 560, 760]) +
    at(640, 450, 0.75, false, wolf({ run: true, pose: 'up' })) + `<path d="M560 420 h-50 M556 440 h-60 M560 460 h-46" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`),

  // 6. 大野狼穿上奶奶的睡衣，躺在床上等
  '06': svg(grannyRoom() + bedWolf({ mood: 'grin' }, 36) +
    `<path d="M520 520 Q560 500 556 470 Q576 490 566 530z" fill="#8d8f9e" ${L}/>` +
    txt(240, 300, '嘿嘿嘿', 34, '#7a6fa0')),

  // 7. 奶奶，妳的耳朵怎麼這麼大？
  '07': svg(grannyRoom() + bed(300, 560, 1.1, { belly: 30, head: at(-132, -104, 1.1, false, wolfHead({ cap: true, mood: 'grin', ears: 2.2 })) }) +
    at(640, 570, 1.25, true, redWithBasket({ mood: 'normal' })) + txt(560, 330, '？', 46, '#5b8fd0')),

  // 8. 眼睛怎麼這麼大？
  '08': svg(grannyRoom() + bed(300, 560, 1.1, { belly: 30, head: at(-132, -104, 1.15, false, wolfHead({ cap: true, mood: 'grin', eyes: 2 })) }) +
    at(640, 570, 1.25, true, redWithBasket({ mood: 'scared' })) + txt(560, 330, '？', 46, '#5b8fd0')),

  // 9. 嘴巴怎麼這麼大？大野狼跳起來
  '09': svg(grannyRoom() + bed(250, 560, 0.9, { belly: 0 }) +
    at(330, 570, 1.25, false, wolf({ gown: true, cap: true, pose: 'up', mouth: 2.2 })) +
    at(640, 575, 1.2, true, redHood({ mood: 'scared', pose: 'up' })) + sweat(600, 380) + sweat(700, 400) +
    txt(520, 290, '嗷嗚！', 48, '#c94f4f')),

  // 10. 吃得好飽，呼嚕呼嚕睡著了
  '10': svg(grannyRoom() + bedWolf({ mood: 'sleep' }, 90) + zzz(300, 380, 1) + txt(520, 360, '呼嚕～', 40, '#7a6fa0')),

  // 11. 獵人經過，發現鼓著大肚子的大野狼
  '11': svg(grannyRoom() +
    `<rect x="30" y="210" width="150" height="170" fill="#7fc06c" ${L}/><path d="M30 210 L80 225 V395 L30 380z" fill="#8c5a3a" ${L}/>` +
    bed(440, 560, 1.05, { belly: 90, head: at(-132, -104, 1, false, `<g transform="rotate(-8)">${wolfHead({ cap: true, mood: 'sleep' })}</g>`) }) +
    zzz(330, 400, 0.8) +
    at(140, 575, 1.15, false, hunter({ mood: 'scared', pose: 'point' })) + txt(260, 310, '咦？', 38, '#5f8f4f')),

  // 12. 小紅帽和奶奶平安無事，大野狼嚇得逃走
  '12': svg(sky() + sun(400, 100, 50) + cloud(140, 100) + cloud(640, 90, 0.8) + hills(370) + forest(400, '#5a9e5a', '#4a8a4f') + ground(440, '#8dc775') +
    cottage(110, 480, 0.75) +
    at(250, 570, 1.05, false, hunter({ pose: 'raise', item: scissors(...hand('raise'), 1.3) })) +
    at(380, 570, 1.05, false, grandma({ pose: 'up' })) + at(480, 570, 1.1, false, redHood({ pose: 'up' })) +
    at(690, 500, 0.85, false, wolf({ gown: true, cap: true, run: true, mood: 'scared', pose: 'up' })) +
    `<path d="M610 440 h-50 M606 462 h-60 M610 484 h-46" stroke="#fff" stroke-width="5" stroke-linecap="round"/>` + sweat(640, 360) +
    sparkle(430, 260) + sparkle(320, 290, 0.7) + sparkle(540, 300, 0.6)),

  // 13. 我以後一定會聽媽媽的話
  '13': svg(sky('#ffd9c9', '#fff2e6') + sun(660, 110, 50) + cloud(170, 100) + hills(380, '#a9d98f', '#8dc775') + cottage(130, 470, 0.8) +
    at(310, 570, 1, false, hunter()) + at(420, 570, 1, false, grandma()) +
    at(530, 570, 1.1, false, redHood({ pose: 'raise' })) + at(650, 570, 1, true, mom({ pose: 'hold' })) +
    hearts(520, 330) + flowers(590, [60, 220, 740]) + sparkle(600, 280, 0.6)),
};

writeBook('red-riding-hood', pages);
