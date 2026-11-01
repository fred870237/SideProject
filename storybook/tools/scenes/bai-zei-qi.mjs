// 白賊七的插畫。用法：node tools/scenes/bai-zei-qi.mjs --sheet
import * as S from './lib.mjs';
import * as T from './tw-common.mjs';

const { BX, BW, BY, H, INK, line, L, at, svg, sky, sun, cloud, grass, sparkle, person, hearts, sweat, night, moon, water, bird, hand } = S;
const { sanheyuan, brickHouse, twHall, courtyard, paddy, bamboo, bigTree, greenMountains, buffalo, chicken, flames, smoke,
  word, bang, qmark, bush, bubble } = T;

// ---------- 角色 ----------
// 白賊七：白色短衫、藍褲子、脖子上綁紅色毛巾
const scarfQi = `<path d="M-20 -100 Q0 -88 20 -100 L14 -88 Q0 -80 -14 -88z" fill="#e2483d" ${line(2)}/><path d="M10 -90 l10 22 l8 -4 l-8 -20z" fill="#e2483d" ${line(2)}/>`;
const qi = (o = {}) => person({ hair: 'short', outfit: 'shirt', top: '#f7f3e6', bottom: '#4a6aa8', ...o, item: scarfQi + (o.item || '') });
const abe = (o = {}) => person({ hair: 'bald', hairColor: '#ddd', hat: 'straw', outfit: 'shirt', top: '#8bb0c8', bottom: '#5a5a5a', beard: '', ...o });
const apo = (o = {}) => person({ hair: 'bun', hairColor: '#d9d9d9', outfit: 'robe', top: '#c06a8a', bottom: '#6a3a50', apron: '#f2efe6', ...o });
const auntie = (o = {}) => person({ hair: 'short', hat: 'scarf', hatColor: '#5fa8a0', outfit: 'robe', top: '#e8a85a', bottom: '#8a5a32', ...o });
const uncle = (o = {}) => person({ hair: 'short', hat: 'cap', hatColor: '#6a8a4a', outfit: 'shirt', top: '#9a7ac0', bottom: '#4a4a5a', ...o });

const bow = (body, a = 22) => `<g transform="rotate(${a})">${body}</g>`;
const fishIcon = (x, y, s = 1) => at(x, y, s, false,
  `<path d="M-40 0 Q-10 -30 30 0 Q-10 30 -40 0z" fill="#7cc4f2" ${L}/><path d="M30 0 l22 -18 v36z" fill="#7cc4f2" ${L}/><circle cx="-22" cy="-4" r="4" fill="${INK}"/>`);
const fireIcon = (x, y, s = 1) => flames(x, y, s);
const haystack = (x, y, s = 1) => at(x, y, s, false,
  `<path d="M-90 0 Q-96 -120 0 -130 Q96 -120 90 0z" fill="#e8c45a" ${L}/>` +
  [-60, -30, 0, 30, 60].map((d) => `<path d="M${d} -6 Q${d * 0.9} -60 ${d * 0.5} -110" fill="none" stroke="#c9a03a" stroke-width="3"/>`).join('') +
  `<path d="M-14 -128 L0 -152 L14 -128z" fill="#c9a03a" ${L}/>`);
const bucket = (x, y) => `<path d="M${x - 18} ${y - 10} L${x - 14} ${y + 22} H${x + 14} L${x + 18} ${y - 10}z" fill="#c9a06a" ${L}/><ellipse cx="${x}" cy="${y - 10}" rx="18" ry="5" fill="#7cc4f2" ${line(2)}/><path d="M${x - 18} ${y - 10} Q${x} ${y - 36} ${x + 18} ${y - 10}" fill="none" ${line(2.5)}/>`;
const basket = (x, y, s = 1) => at(x, y, s, false, `<path d="M-40 -40 L-32 0 H32 L40 -40z" fill="#c9a06a" ${L}/><path d="M-36 -26 H36 M-34 -12 H34" stroke="#a67f3f" stroke-width="3"/>`);
const village = (y = 400) => sanheyuan(150, y, 0.4) + brickHouse(640, y - 5, 0.45) + bamboo(30, y + 10, 0.55) + bamboo(770, y + 10, 0.5);

const daySky = () => sky() + sun(680, 90) + cloud(160, 100) + cloud(480, 70, 0.7);

// ---------- 每一頁 ----------
const pages = {
  // 封面：白賊七抱著雞，旁邊冒出他編的謊話（大魚、失火）
  cover: svg(sky('#ffd9b0', '#fff2e0') + sun(660, 120, 46) + cloud(160, 100) + greenMountains(340, '#9cc79a', '#86b98a') +
    paddy(340, { h: 80 }) + courtyard(410) + village(410) +
    at(400, 570, 1.25, false, qi({ pose: 'hold', mood: 'happy' })) + at(416, 500, 0.85, false, chicken({ c: '#e8a85a' })) +
    bubble(200, 290, 150, 100, 300, 360, fishIcon(200, 290, 1.2)) +
    bubble(620, 290, 140, 110, 500, 370, fireIcon(620, 335, 0.55))),

  // 1. 台灣鄉下的年輕人，排行老七，聰明但愛說謊
  '01': svg(daySky() + greenMountains(330) + paddy(330, { h: 260 }) +
    sanheyuan(560, 380, 0.5) + bamboo(250, 380, 0.6) +
    `<path d="M${BX} 470 H${BX + BW} V540 H${BX}z" fill="#d9bc85"/>` +
    at(380, 545, 1.25, false, qi({ pose: 'hips' })) + at(600, 540, 0.8, true, buffalo()) + bird(140, 260, 1, '#e86a6a')),

  // 2. 大家都叫他「白賊七」
  '02': svg(daySky() + greenMountains(330) + courtyard(380) + village(390) +
    at(400, 570, 1.2, false, qi({ pose: 'point', mood: 'happy' })) +
    bubble(560, 290, 150, 90, 470, 360, `<path d="M500 290 q15 -24 30 0 t30 0 t30 0" fill="none" ${line(4)}/><circle cx="530" cy="270" r="0"/>`) +
    at(160, 570, 1, false, uncle({ mood: 'normal', pose: 'point' })) + at(240, 575, 0.9, false, auntie({ mood: 'normal' })) +
    sweat(205, 400)),

  // 3. 跟阿伯說：河邊有一隻好大的魚！
  '03': svg(daySky() + greenMountains(330) + paddy(330, { h: 80 }) + courtyard(405) +
    at(500, 560, 1.15, true, qi({ pose: 'point', mood: 'happy' })) +
    at(230, 560, 1.1, false, abe({ mood: 'scared', pose: 'up' })) + at(100, 540, 0.75, false, buffalo()) +
    bubble(600, 290, 160, 100, 520, 360, fishIcon(600, 290, 1.3)) + bang(300, 330)),

  // 4. 阿伯在河邊找了老半天，什麼都沒有；白賊七在後面偷笑
  '04': svg(daySky() + greenMountains(300) + water(320, 180) + `<rect x="${BX}" y="480" width="${BW}" height="${H - 480}" fill="#9ed27a"/>` +
    at(330, 470, 1.1, false, abe({ mood: 'cry', pose: 'reach', item: `<path d="M70 -76 L120 -20" ${line(5)}/><ellipse cx="124" cy="-14" rx="26" ry="14" fill="#fff" opacity=".7" ${line(2.5)}/>` })) +
    `<ellipse cx="330" cy="470" rx="70" ry="12" fill="#5aa8d8"/>` + qmark(470, 320) + qmark(510, 350, 0.7) +
    at(660, 580, 1, true, qi({ pose: 'hold', mood: 'happy' })) + bush(700, 590, 1.2) +
    word(640, 380, '哈哈！', 34, '#ffd25e', INK)),

  // 5. 跟賣雞的阿婆說：妳家著火了！阿婆丟下雞跑回家
  '05': svg(daySky() + greenMountains(330) + courtyard(380) + brickHouse(150, 395, 0.45) +
    `<path d="M${BX} 450 H${BX + BW} V520 H${BX}z" fill="#d9bc85"/>` +
    at(260, 560, 1.15, true, apo({ mood: 'scared', pose: 'up' })) + sweat(220, 390) + sweat(300, 380) +
    basket(400, 570, 1) + at(430, 520, 0.8, false, chicken({ flap: true })) + at(370, 540, 0.75, true, chicken({ c: '#e8a85a', flap: true })) +
    at(600, 565, 1.15, true, qi({ pose: 'point', mood: 'normal' })) +
    bubble(640, 290, 140, 110, 600, 370, fireIcon(640, 335, 0.55))),

  // 6. 趁機抱走兩隻雞：騙人真好玩！
  '06': svg(daySky() + greenMountains(330) + paddy(330, { h: 90 }) + courtyard(415) +
    at(400, 570, 1.3, false, qi({ pose: 'hold', mood: 'happy' })) +
    at(370, 488, 0.8, true, chicken({ flap: true })) + at(440, 492, 0.8, false, chicken({ c: '#e8a85a', flap: true })) +
    word(560, 330, '嘻嘻！', 40, '#ffd25e', INK) + bush(130, 560, 1) + bush(690, 570, 0.9)),

  // 7. 大家都很生氣：誰都不要相信白賊七！
  '07': svg(daySky() + greenMountains(330) + courtyard(380) + village(390) +
    at(160, 570, 1.1, false, abe({ mood: 'angry', pose: 'hips' })) + at(280, 575, 1.05, false, apo({ mood: 'angry', pose: 'hips' })) +
    at(400, 575, 1.05, false, uncle({ mood: 'angry', pose: 'hips' })) +
    at(640, 565, 0.95, true, qi({ mood: 'scared', pose: 'down' })) + sweat(600, 400) + sweat(690, 395)),

  // 8. 晚上，稻草堆真的著火了！
  '08': svg(night('#2a2a5a', '#7a4a6a') + moon(120, 110, 34, true) + `<rect x="${BX}" y="430" width="${BW}" height="${H - 430}" fill="#5f6a4a"/>` +
    brickHouse(560, 440, 0.8) + haystack(330, 470, 1) + flames(320, 380, 1.1) + flames(400, 430, 0.6) + smoke(330, 230, 1.2, '#6a6a7a') +
    at(150, 580, 1.1, false, qi({ mood: 'scared', pose: 'up' })) + bang(220, 330, 1.2)),

  // 9. 大喊救命，可是大家都說「又在講白賊了」
  '09': svg(night('#2a2a5a', '#7a4a6a') + `<rect x="${BX}" y="430" width="${BW}" height="${H - 430}" fill="#5f6a4a"/>` +
    flames(110, 440, 0.8) + smoke(110, 280, 0.9, '#6a6a7a') +
    at(260, 570, 1.15, false, qi({ mood: 'cry', pose: 'up' })) + word(380, 300, '救命啊！', 36, '#fff6c8', INK) +
    brickHouse(620, 430, 0.55, { lit: true }) +
    at(560, 560, 0.85, false, abe({ mood: 'normal', pose: 'hips' })) + at(680, 560, 0.85, true, apo({ mood: 'normal', pose: 'hips' }))),

  // 10. 只好一個人提水救火，房子燒掉了一大半
  '10': svg(sky('#b8b8c8', '#e8e0d8') + greenMountains(330, '#9aa89a', '#8a988a') + courtyard(400, '#cbbfa0') +
    at(480, 420, 0.95, false, twHall(280, 120, { burnt: true })) + smoke(420, 230, 1, '#8a8a96') + smoke(540, 250, 0.8, '#8a8a96') +
    at(220, 570, 1.15, false, qi({ mood: 'cry', pose: 'hold', item: bucket(14, -40) })) +
    bucket(110, 560) + `<path d="M300 560 q10 -6 20 0" stroke="#7cc4f2" stroke-width="5" fill="none" stroke-linecap="round"/>`),

  // 11. 終於明白，向大家道歉
  '11': svg(daySky() + greenMountains(330) + courtyard(380) + village(390) +
    at(250, 575, 1.15, false, bow(qi({ mood: 'cry', pose: 'hold' }), 10)) +
    at(450, 575, 1, true, abe({ mood: 'normal' })) + at(560, 578, 1, true, apo({ mood: 'normal' })) + at(670, 578, 1, true, uncle({ mood: 'normal' }))),

  // 12. 大家又相信他了：做個誠實的人
  '12': svg(sky('#ffd9b0', '#fff2e0') + sun(400, 150, 56) + cloud(150, 100) + cloud(650, 90, 0.8) + greenMountains(340, '#9cc79a', '#86b98a') +
    paddy(340, { gold: true, h: 80 }) + courtyard(410) + village(410) +
    at(400, 575, 1.15, false, qi({ pose: 'up' })) + at(270, 580, 1, false, abe({ pose: 'up' })) + at(530, 580, 1, true, apo({ pose: 'up' })) +
    at(150, 580, 0.95, false, auntie({ pose: 'up' })) + at(650, 580, 0.95, true, uncle({ pose: 'up' })) +
    hearts(380, 330) + sparkle(220, 300) + sparkle(600, 290, 0.8)),
};

S.writeBook('bai-zei-qi', pages);
