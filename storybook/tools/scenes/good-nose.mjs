// 好鼻師的插畫。用法：node tools/scenes/good-nose.mjs --sheet
import * as S from './lib.mjs';
import * as T from './tw-common.mjs';

const { BX, BW, BY, H, INK, line, L, at, svg, sky, sun, cloud, sparkle, person, hearts, sweat, night, moon, tree, treasure, cnHouse, bird, hand } = S;
const { sanheyuan, brickHouse, courtyard, paddy, bamboo, greenMountains, twInterior, dim, buffalo, word, bang, qmark, bush, bubble, zzz, flowerBed } = T;

// ---------- 角色 ----------
const NOSE = `<ellipse cx="0" cy="-123" rx="7.5" ry="5.5" fill="#f2a080" ${line(2.5)}/>`;
const SMELL = `<path d="M44 -150 q10 -8 20 0 t20 0 M48 -132 q10 -8 20 0 t20 0" fill="none" stroke="#9ad0ff" stroke-width="4" stroke-linecap="round"/>`;
// 好鼻師：橘色短衫，大大的紅鼻子；sniff = true 加上聞味道的線
const haobi = (o = {}, sniff = false) => person({ hair: 'short', outfit: 'shirt', top: '#e8a85a', bottom: '#6b4a2f', ...o }) + NOSE + (sniff ? SMELL : '');
const neighbor = (o = {}) => person({ hair: 'bald', hairColor: '#555', hat: 'straw', outfit: 'shirt', top: '#7aa8c8', bottom: '#4a4a5a', ...o });
const auntie = (o = {}) => person({ hair: 'bun', outfit: 'robe', top: '#c06a8a', bottom: '#6a3a50', ...o });
const MIAN = `<rect x="-26" y="-50" width="52" height="22" fill="#2f2a2a" ${line(2.5)}/><rect x="-44" y="-58" width="88" height="10" fill="#2f2a2a" ${line(2.5)}/>` +
  [-36, -24, 24, 36].map((x) => `<path d="M${x} -48 v18" stroke="#e2483d" stroke-width="2.5"/><circle cx="${x}" cy="-28" r="3" fill="#f6d36b"/>`).join('');
const emperor = (o = {}) => person({ hair: 'short', hat: MIAN, beard: '#2f2a2a', outfit: 'robe', top: '#f2c14e', bottom: '#c9782a', ...o });
const OFFHAT = `<path d="M-30 -18 Q-30 -50 0 -50 Q30 -50 30 -18z" fill="#2f2a2a" ${line(2.5)}/><path d="M-30 -30 h-26 M30 -30 h26" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M-30 -30 h-26 M30 -30 h26" stroke="#2f2a2a" stroke-width="4" stroke-linecap="round"/>`;
const official = (o = {}) => person({ hair: 'short', hat: OFFHAT, outfit: 'robe', top: '#4a6aa8', bottom: '#2f3f6a', ...o });
const thief = (o = {}) => person({ hair: 'short', hat: 'scarf', hatColor: '#3a3a4a', outfit: 'shirt', top: '#5a5a6a', bottom: '#3a3a4a', ...o });
const bow = (body, a = 20) => `<g transform="rotate(${a})">${body}</g>`;

const scroll = (x, y) => `<rect x="${x - 6}" y="${y - 30}" width="12" height="60" rx="5" fill="#c9782a" ${line(2)}/><rect x="${x}" y="${y - 26}" width="34" height="52" fill="#fff8e6" ${line(2)}/><rect x="${x + 30}" y="${y - 30}" width="12" height="60" rx="5" fill="#c9782a" ${line(2)}/>`;
// 碗（蓋著或打開）、柿子
const persimmon = (x, y, s = 1) => at(x, y, s, false, `<ellipse cx="0" cy="-22" rx="28" ry="22" fill="#f28a2a" ${L}/><path d="M-12 -44 l12 6 l12 -6 l-4 10 l-8 2 l-8 -2z" fill="#5f9f4f" ${line(2)}/><path d="M-12 -30 q6 -6 12 -2" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>`);
const bowl = (x, y, s = 1, open = false) => at(x, y, s, false,
  (open ? persimmon(0, -34, 1) : '') +
  `<path d="M-50 -40 Q-50 0 0 0 Q50 0 50 -40z" fill="#eef4fa" ${L}/><path d="M-40 -24 h80" stroke="#5b8fd0" stroke-width="4"/>` +
  (open ? `<g transform="translate(90 -20) rotate(30)"><path d="M-46 0 Q-46 -40 0 -40 Q46 -40 46 0z" fill="#eef4fa" ${L}/><circle cx="0" cy="-44" r="7" fill="#eef4fa" ${L}/></g>`
    : `<path d="M-52 -40 Q-50 -86 0 -86 Q50 -86 52 -40z" fill="#eef4fa" ${L}/><circle cx="0" cy="-90" r="8" fill="#eef4fa" ${L}/><path d="M-36 -56 h72" stroke="#5b8fd0" stroke-width="4"/>`));
const table = (x, y, s = 1) => at(x, y, s, false, `<rect x="-80" y="-70" width="160" height="16" fill="#a8432f" ${L}/><path d="M-66 -54 V0 M66 -54 V0" stroke="${INK}" stroke-width="12"/><path d="M-66 -54 V0 M66 -54 V0" stroke="#a8432f" stroke-width="7"/>`);
const palace = (x, y, s = 1) => cnHouse(x, y, s, { wall: '#d9573f', roof: '#e0a830', door: '#8c2f22' });
// 宮殿的屋內：紅牆、金色橫樑
const palaceIn = (dark = false) => twInterior({ dark, window: false }) +
  `<rect x="${BX}" y="40" width="${BW}" height="26" fill="#e0a830"/>` +
  [120, 680].map((x) => `<rect x="${x - 18}" y="40" width="36" height="320" fill="#b5302a" ${L}/>`).join('');
const hoe = (() => { const [hx, hy] = hand('raise'); return `<path d="M${hx} ${hy} L${hx + 20} ${hy - 60}" ${line(7)}/><path d="M${hx} ${hy} L${hx + 20} ${hy - 60}" stroke="#a8764a" stroke-width="4"/><path d="M${hx + 14} ${hy - 62} l30 4 l-4 18 z" fill="#9aa4ae" ${L}/>`; })();

const daySky = () => sky() + sun(680, 90) + cloud(160, 100) + cloud(480, 70, 0.7);

// ---------- 每一頁 ----------
const pages = {
  // 封面：好鼻師用鼻子聞，旁邊是碗、柿子、寶物
  cover: svg(sky('#ffe0b8', '#fff4e6') + sun(650, 120, 46) + cloud(170, 100) + greenMountains(340, '#a8d0a0', '#90c090') +
    courtyard(400, '#ecd9a8') + palace(620, 410, 0.7) + bamboo(60, 430, 0.8) +
    at(330, 570, 1.3, false, haobi({ pose: 'hips', mood: 'happy' }, true)) +
    bowl(540, 560, 0.9, true) + treasure(180, 570, 0.7) + sparkle(470, 300) + sparkle(220, 330, 0.7)),

  // 1. 不愛工作，整天想不努力就過好日子
  '01': svg(daySky() + greenMountains(330) + paddy(330, { h: 80 }) + courtyard(410) + brickHouse(150, 420, 0.6) +
    tree(620, 480, 1.4) + at(660, 525, 1.25, false, `<g transform="rotate(-90)">${haobi({ pose: 'down', mood: 'happy' })}</g>`) + zzz(380, 450, 1.2) +
    bird(480, 300, 0.9, '#e86a6a')),

  // 2. 到處說：我的鼻子最厲害！
  '02': svg(daySky() + greenMountains(330) + courtyard(380) + sanheyuan(400, 390, 0.42) + bamboo(60, 400, 0.6) + bamboo(740, 400, 0.6) +
    at(400, 570, 1.25, false, haobi({ pose: 'hips', mood: 'happy' }, true)) +
    at(180, 575, 1, false, neighbor({ mood: 'scared', pose: 'up' })) + at(620, 575, 1, true, auntie({ mood: 'scared', pose: 'up' })) +
    sparkle(500, 300) + sparkle(300, 290, 0.7)),

  // 3. 鄰居的牛不見了，他假裝聞一聞：牛在竹林裡！
  '03': svg(daySky() + greenMountains(320) + `<rect x="${BX}" y="390" width="${BW}" height="${H - 390}" fill="#9ed27a"/>` +
    bamboo(560, 460, 1) + bamboo(660, 450, 0.9) + bamboo(760, 470, 1) +
    `<path d="M600 470 q-20 -10 -16 -40" fill="none" ${line(4)}/><path d="M584 430 l-8 -10 l14 2z" fill="#5f616c"/>` + bamboo(620, 500, 0.8) +
    at(160, 575, 1.05, false, neighbor({ mood: 'cry', pose: 'down' })) + qmark(160, 360) +
    at(360, 575, 1.2, false, haobi({ pose: 'point', mood: 'normal' }, true))),

  // 4. 牛真的在那裡！大家都叫他好鼻師
  '04': svg(daySky() + greenMountains(320) + `<rect x="${BX}" y="390" width="${BW}" height="${H - 390}" fill="#9ed27a"/>` +
    bamboo(520, 450, 0.9) + bamboo(700, 450, 1) +
    at(560, 560, 1, true, buffalo()) + at(420, 570, 1, false, neighbor({ mood: 'happy', pose: 'up' })) + hearts(470, 360) +
    at(180, 575, 1.15, false, haobi({ pose: 'hips', mood: 'happy' })) + sparkle(260, 320) + sparkle(120, 300, 0.7)),

  // 5. 皇帝的寶物不見了，派人來請好鼻師
  '05': svg(daySky() + greenMountains(330) + courtyard(390) + palace(690, 370, 0.4) + brickHouse(200, 400, 0.6) +
    at(250, 575, 1.1, false, haobi({ pose: 'down', mood: 'scared' })) + sweat(210, 390) +
    at(500, 575, 1.15, true, official({ pose: 'reach', mood: 'normal', item: scroll(60, -80) }))),

  // 6. 嚇壞了又不敢不去，一路上：糟糕了，怎麼辦？
  '06': svg(sky('#d8d0e0', '#f0eaf0') + cloud(200, 100) + greenMountains(320, '#9ab8a0', '#88a890') +
    `<rect x="${BX}" y="380" width="${BW}" height="${H - 380}" fill="#9ec880"/>` +
    `<path d="M${BX} 600 L180 600 Q420 460 600 400 L660 400 Q500 480 480 600 H${BX + BW} V610 H${BX}z" fill="#d9bc85"/>` +
    palace(660, 400, 0.45) +
    at(240, 575, 1.15, false, haobi({ pose: 'hold', mood: 'cry' })) + sweat(200, 380) + sweat(290, 370) +
    at(420, 520, 0.9, false, official({ pose: 'point' })) + qmark(150, 350)),

  // 7. 晚上自言自語「只剩三天了」，門外的小偷聽到了
  '07': svg(palaceIn(true) +
    `<rect x="170" y="150" width="140" height="210" fill="#1a1f40" ${L}/>` +
    at(250, 360, 0.85, false, thief({ mood: 'scared', pose: 'point' })) +
    `<path d="M310 150 L360 166 V376 L310 360z" fill="#7a3a2a" ${L}/>` +
    dim(0.25) +
    at(530, 575, 1.15, true, haobi({ pose: 'hold', mood: 'cry' })) +
    bubble(560, 290, 110, 90, 540, 360, word(560, 312, '3', 60, '#e2483d')) + sweat(200, 260)),

  // 8. 小偷跪下：寶物藏在花園的大樹下
  '08': svg(sky('#2a3570', '#6a72aa') + moon(660, 100, 36) + `<rect x="${BX}" y="420" width="${BW}" height="${H - 420}" fill="#5f8a5a"/>` +
    tree(600, 500, 1.6) + treasure(600, 520, 0.55) + sparkle(560, 440, 0.6) + sparkle(650, 450, 0.5) +
    at(200, 575, 1.15, false, haobi({ pose: 'down', mood: 'scared' })) +
    at(380, 575, 1.05, true, bow(thief({ mood: 'cry', pose: 'point' }), 18))),

  // 9. 找回寶物，皇帝好高興；又要考他：碗裡蓋著什麼？
  '09': svg(palaceIn() +
    at(560, 575, 1.2, true, emperor({ pose: 'up', mood: 'happy' })) + treasure(660, 470, 0.5) +
    table(380, 570, 1) + bowl(380, 500, 0.9) + qmark(380, 380, 1.2) +
    at(180, 575, 1.15, false, haobi({ pose: 'down', mood: 'happy' }))),

  // 10. 根本猜不出來：唉，這次死定了！
  '10': svg(palaceIn() +
    at(600, 575, 1.15, true, emperor({ pose: 'hips', mood: 'normal' })) +
    table(400, 570, 1) + bowl(400, 500, 0.9) +
    at(190, 575, 1.2, false, haobi({ pose: 'hold', mood: 'cry' })) + sweat(150, 360) + sweat(240, 350) + sweat(170, 320)),

  // 11. 打開碗，竟然是柿子！皇帝以為他又猜對了
  '11': svg(palaceIn() +
    at(600, 575, 1.15, true, emperor({ pose: 'up', mood: 'happy' })) +
    table(400, 570, 1) + bowl(390, 500, 0.9, true) + sparkle(400, 360) + sparkle(470, 400, 0.6) + sparkle(320, 380, 0.7) +
    at(190, 575, 1.2, false, haobi({ pose: 'up', mood: 'scared' })) + bang(260, 330)),

  // 12. 再也不吹牛，認真工作
  '12': svg(daySky() + greenMountains(330) + paddy(330, { h: 280 }) +
    `<path d="M${BX} 520 H${BX + BW} V560 H${BX}z" fill="#c9a06a"/>` + brickHouse(640, 380, 0.45) +
    at(330, 545, 1.2, false, haobi({ pose: 'raise', mood: 'happy', item: hoe })) + sweat(260, 360) +
    at(520, 545, 0.85, true, buffalo()) + bird(150, 280, 1, '#e86a6a')),
};

S.writeBook('good-nose', pages);
