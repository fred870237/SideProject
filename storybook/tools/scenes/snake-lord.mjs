// 蛇郎君的插畫。用法：node tools/scenes/snake-lord.mjs --sheet
import * as S from './lib.mjs';
import * as T from './tw-common.mjs';

const { BX, BW, BY, H, INK, line, L, at, svg, sky, sun, cloud, sparkle, person, hearts, sweat, fence, bird, face } = S;
const { sanheyuan, courtyard, paddy, bamboo, greenMountains, twInterior, flowerBed, flower, bush, word, bang, qmark, bubble } = T;

// ---------- 角色 ----------
const firewood = `<g transform="translate(-30 -60) rotate(-12)">` +
  [-14, 0, 14].map((d) => `<rect x="${d - 7}" y="-90" width="14" height="96" rx="6" fill="#a8764a" ${line(2.5)}/>`).join('') +
  `<path d="M-24 -50 h48 M-24 -10 h48" ${line(4)}/></g>`;
const papa = (o = {}, wood = false) => (wood ? firewood : '') +
  person({ hair: 'bald', hairColor: '#e8e8e8', beard: '#eeeeee', outfit: 'tunic', top: '#8b6b4a', bottom: '#5a4632', ...o });
const dajie = (o = {}) => person({ hair: 'bun', outfit: 'dress', top: '#e89a3c', ...o });
const erjie = (o = {}) => person({ hair: 'short', outfit: 'dress', top: '#8e6bb0', ...o });
const PINK = '#f08aa8';
const pin = `<circle cx="24" cy="-22" r="7" fill="#fff" ${line(2)}/><circle cx="24" cy="-22" r="3" fill="#ffd25e"/>`;
const sanmei = (o = {}) => person({ hair: 'long', outfit: 'dress', top: PINK, hat: pin, ...o });
const crownJade = `<rect x="-9" y="-50" width="18" height="16" rx="3" fill="#f6d36b" ${line(2.5)}/><path d="M-20 -40 h40" ${line(3)}/>`;
const lord = (o = {}) => person({ hair: 'topknot', outfit: 'robe', top: '#3f9a7a', bottom: '#2a6a55', hat: crownJade, ...o });
const blush = `<ellipse cx="-18" cy="-122" rx="9" ry="6" fill="#ff6b6b" opacity=".8"/><ellipse cx="18" cy="-122" rx="9" ry="6" fill="#ff6b6b" opacity=".8"/>`;

// 大蛇：盤起來，頭抬高，戴小金冠
function bigSnake({ mood = 'normal', c = '#6cbf6a', d = '#4f9a5a' } = {}) {
  const coil = (cy, rx, ry) => `<ellipse cx="0" cy="${cy}" rx="${rx}" ry="${ry}" fill="${c}" ${L}/>` +
    `<path d="M${-rx * 0.6} ${cy} q${rx * 0.3} ${ry * 0.5} ${rx * 0.6} 0 q${rx * 0.3} ${ry * 0.5} ${rx * 0.6} 0" fill="none" stroke="${d}" stroke-width="4"/>`;
  return coil(-26, 100, 30) + coil(-70, 80, 26) +
    `<path d="M30 -84 Q70 -120 50 -170" fill="none" stroke="${INK}" stroke-width="46" stroke-linecap="round"/>` +
    `<path d="M30 -84 Q70 -120 50 -170" fill="none" stroke="${c}" stroke-width="38" stroke-linecap="round"/>` +
    `<path d="M40 -100 Q58 -126 46 -160" fill="none" stroke="#f6e7a8" stroke-width="12" stroke-linecap="round"/>` +
    at(56, -194, 1, false,
      `<path d="M36 10 l20 4 l6 -6 M56 14 l6 6" fill="none" stroke="#e2483d" stroke-width="3" stroke-linecap="round"/>` +
      `<ellipse rx="40" ry="32" fill="${c}" ${L}/>` + face(30, mood, { cheek: '#f3a0a0' }) +
      `<path d="M-14 -30 L-14 -46 L-4 -38 L4 -50 L12 -38 L20 -46 L20 -30z" fill="#f6d36b" ${line(2.5)}/>`);
}

const mansionOpt = { roof: '#3f8f7a', roofD: '#2f6f5a' };
const mansion = (x, y, s) => sanheyuan(x, y, s, mansionOpt);
const flowerBasket = (x, y, s = 1) => at(x, y, s, false,
  `<path d="M-30 -30 Q0 -70 30 -30" fill="none" ${line(4)}/>` +
  [[-16, -34, '#ff8fb1'], [0, -40, '#ffd25e'], [16, -34, '#ff7a6b']].map(([cx, cy, col]) => `<circle cx="${cx}" cy="${cy}" r="10" fill="${col}" ${line(2)}/>`).join('') +
  `<path d="M-32 -30 L-24 0 H24 L32 -30z" fill="#c9a06a" ${L}/><path d="M-30 -18 H30" stroke="#a67f3f" stroke-width="3"/>`);
const mirror = (x, y, s = 1) => at(x, y, s, false,
  `<rect x="-6" y="-90" width="12" height="90" fill="#8c5a3a" ${L}/><rect x="-40" y="-8" width="80" height="12" fill="#8c5a3a" ${L}/>` +
  `<ellipse cx="0" cy="-150" rx="50" ry="64" fill="#a8432f" ${L}/><ellipse cx="0" cy="-150" rx="40" ry="54" fill="#d6efff" ${L}/>` +
  `<path d="M-20 -180 l20 -14 M-14 -160 l26 -20" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`);
const garden = () => flowerBed(-60, 860, 470, 42) + flowerBed(-40, 860, 560, 52);

const daySky = () => sky() + sun(680, 90) + cloud(160, 100) + cloud(480, 70, 0.7);

// ---------- 每一頁 ----------
const pages = {
  // 封面：蛇郎君和三妹在開滿花的大宅前
  cover: svg(sky('#ffd9e0', '#fff4ec') + sun(650, 120, 46) + cloud(160, 100) + greenMountains(340, '#a8d0a0', '#90c090') +
    courtyard(390, '#e8d8b0') + mansion(400, 400, 0.6) + flowerBed(-60, 860, 470, 44) +
    at(330, 570, 1.2, false, sanmei({ pose: 'hold' })) + at(470, 570, 1.25, true, lord({ pose: 'hold' })) +
    hearts(380, 330) + sparkle(220, 280) + sparkle(600, 270, 0.8) + flowerBed(-40, 860, 590, 60)),

  // 1. 賣柴的老爸爸和三個女兒
  '01': svg(daySky() + greenMountains(330) + paddy(330, { h: 70 }) + courtyard(395) + sanheyuan(400, 400, 0.65) + bamboo(60, 430, 0.75) +
    at(180, 570, 1.1, false, papa({ pose: 'down' }, true)) +
    at(360, 570, 1, true, dajie()) + at(470, 570, 1, true, erjie()) + at(580, 570, 0.95, true, sanmei({ pose: 'up' }))),

  // 2. 經過漂亮的花園，摘了幾朵花
  '02': svg(daySky() + greenMountains(320) + `<rect x="${BX}" y="380" width="${BW}" height="${H - 380}" fill="#9ed27a"/>` +
    mansion(560, 380, 0.5) + fence(BX, 440, BW) + garden() +
    at(300, 570, 1.15, false, papa({ pose: 'reach', mood: 'happy', item: flower(80, -70, 0.9, '#ff8fb1') + flower(60, -66, 0.8, '#ffd25e') }, true))),

  // 3. 大蛇擋在前面：你偷摘我的花！
  '03': svg(sky('#c8d8e8', '#eef4f0') + greenMountains(320, '#8fb79a', '#7aa886') + `<rect x="${BX}" y="380" width="${BW}" height="${H - 380}" fill="#8cc475"/>` +
    fence(BX, 440, BW) + flowerBed(-60, 860, 470, 42) +
    at(520, 580, 1.3, false, bigSnake({ mood: 'angry' })) +
    at(200, 575, 1.1, false, papa({ pose: 'up', mood: 'scared', item: flower(52, -168, 0.8) }, true)) + sweat(160, 390) + bang(280, 330)),

  // 4. 回家告訴女兒們，大姊二姊都不要
  '04': svg(twInterior() +
    at(150, 570, 1.1, false, papa({ mood: 'cry', pose: 'down' })) +
    at(330, 575, 1, false, sanmei({ mood: 'normal', pose: 'down' })) +
    at(500, 575, 1.05, true, dajie({ mood: 'angry', pose: 'hips' })) + at(640, 575, 1.05, true, erjie({ mood: 'angry', pose: 'hips' }))),

  // 5. 三妹勇敢地跟著大蛇走了
  '05': svg(daySky() + greenMountains(330) + paddy(330, { h: 70 }) + courtyard(395) +
    sanheyuan(110, 405, 0.38) + mansion(700, 380, 0.3) +
    `<path d="M${BX} 470 Q300 440 520 430 T${BX + BW} 400 V520 Q400 520 ${BX} 540z" fill="#d9bc85"/>` +
    at(120, 575, 1, false, papa({ mood: 'cry', pose: 'raise' })) +
    at(390, 560, 1.1, false, sanmei({ mood: 'happy', pose: 'raise' })) + at(580, 570, 0.9, false, bigSnake({ mood: 'happy' }))),

  // 6. 大蛇一轉身，變成英俊的蛇郎君
  '06': svg(sky('#e8d8f8', '#fff4ec') + greenMountains(340, '#a8c8b0', '#90b8a0') + courtyard(395, '#e8d8b0') + mansion(400, 400, 0.55) +
    `<g opacity=".35">${at(470, 580, 1.2, false, bigSnake())}</g>` +
    at(500, 575, 1.2, true, lord({ pose: 'up' })) +
    sparkle(400, 300, 1.4) + sparkle(600, 280) + sparkle(560, 420, 0.9) + sparkle(420, 470, 0.7) + sparkle(640, 380, 0.8) +
    at(220, 575, 1.1, false, sanmei({ mood: 'scared', pose: 'up' }))),

  // 7. 住在開滿鮮花的大房子裡，過著幸福的日子
  '07': svg(sky('#ffe0e8', '#fff6ee') + sun(660, 110, 46) + cloud(180, 100) + greenMountains(340, '#a8d0a0', '#90c090') +
    courtyard(390, '#e8d8b0') + mansion(400, 400, 0.6) + flowerBed(-60, 860, 470, 44) +
    at(330, 575, 1.15, false, sanmei({ pose: 'hold', item: flowerBasket(14, -40, 0.9) })) + at(470, 575, 1.2, true, lord({ pose: 'down' })) +
    hearts(380, 320) + bird(150, 250, 1, '#ff8fb1') + bird(650, 260, 0.9) + flowerBed(-40, 860, 595, 60)),

  // 8. 大姊偷偷穿上三妹的衣服
  '08': svg(twInterior({ window: true }) +
    `<rect x="80" y="230" width="120" height="16" fill="#8c5a3a"/><path d="M110 246 l-10 60 h60 l-10 -60" fill="#f08aa8" opacity=".5" ${line(2)}/>` +
    mirror(560, 580, 1.1) +
    at(380, 575, 1.2, false, dajie({ top: PINK, mood: 'happy', pose: 'hips' })) + sparkle(470, 330, 0.7) + sparkle(300, 300, 0.6)),

  // 9. 蛇郎君一看：妳不是我的妻子
  '09': svg(twInterior() +
    at(260, 575, 1.15, false, dajie({ top: PINK, mood: 'scared', pose: 'down' })) + sweat(220, 380) + sweat(310, 370) +
    at(540, 575, 1.2, true, lord({ mood: 'angry', pose: 'point' })) + qmark(620, 330)),

  // 10. 大姊羞紅了臉道歉，三妹送她一籃花
  '10': svg(sky('#ffe0e8', '#fff6ee') + cloud(180, 100) + greenMountains(340, '#a8d0a0', '#90c090') + courtyard(390, '#e8d8b0') +
    mansion(400, 400, 0.5) + flowerBed(-60, 860, 470, 44) +
    at(280, 575, 1.15, false, `<g transform="rotate(10)">${dajie({ mood: 'cry', pose: 'hold' }) + blush}</g>`) +
    at(500, 575, 1.15, true, sanmei({ mood: 'happy', pose: 'reach' })) + flowerBasket(420, 530, 1.1) + hearts(440, 360)),

  // 11. 把老爸爸接來一起住，善良勇敢的心得到幸福
  '11': svg(sky('#ffd9c0', '#fff4ea') + sun(400, 140, 56) + cloud(150, 100) + cloud(660, 100, 0.8) + greenMountains(340, '#a8d0a0', '#90c090') +
    courtyard(390, '#e8d8b0') + mansion(400, 400, 0.55) + flowerBed(-60, 860, 470, 44) +
    at(270, 575, 1.1, false, papa({ pose: 'up' })) + at(400, 575, 1.1, false, sanmei({ pose: 'up' })) + at(530, 575, 1.15, true, lord({ pose: 'up' })) +
    hearts(390, 320) + sparkle(200, 280) + sparkle(620, 270, 0.8) + flowerBed(-40, 860, 595, 60)),
};

S.writeBook('snake-lord', pages);
