// 虎姑婆的插畫。用法：node tools/scenes/hu-gu-po.mjs --sheet
import * as S from './lib.mjs';
import * as T from './tw-common.mjs';

const { BX, BW, BY, H, INK, line, L, at, svg, sky, sun, cloud, grass, sparkle, person, hearts, sweat, night, moon, pine, forest, bird } = S;
const { sanheyuan, twHall, courtyard, paddy, bamboo, bigTree, greenMountains, twInterior, dim, bed, sleepHead, quilt,
  tigerHead, tiger, chicken, steam, speed, word, bang, qmark, bush, flames } = T;

// ---------- 角色 ----------
const mom = (o = {}) => person({ hair: 'bun', outfit: 'robe', top: '#5fa8a0', bottom: '#2f6a66', ...o });
const ajin = (o = {}) => person({ age: 'child', hair: 'pigtails', outfit: 'shirt', top: '#e86a6a', bottom: '#3d5a99', ...o });
const atu = (o = {}) => person({ age: 'child', hair: 'short', outfit: 'shirt', top: '#f2c14e', bottom: '#6b4a2f', ...o });

const TIGER = '#f2a03d';
// 老虎尾巴（從身體後面伸出來，條紋用虛線畫）
const tail = (d, w = 14) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 6}" stroke-linecap="round"/>` +
  `<path d="${d}" fill="none" stroke="${TIGER}" stroke-width="${w}" stroke-linecap="round"/>` +
  `<path d="${d}" fill="none" stroke="#3a2a22" stroke-width="${w}" stroke-dasharray="6 12"/>`;
// 姑婆的頭巾 + 從頭巾露出來的老虎耳朵
const granHead = (mood) => tigerHead(30, mood, { ears: false }) +
  `<path d="M-34 8 Q-40 -44 0 -44 Q40 -44 34 8 Q26 -22 0 -24 Q-26 -22 -34 8z" fill="#3d4f8f" ${L}/>` +
  [[-18, -32], [0, -36], [18, -32], [-26, -14], [26, -14]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="#fff"/>`).join('') +
  `<path d="M28 14 l12 10 l-4 -14z" fill="#3d4f8f" ${line(2)}/>` +
  [-1, 1].map((d) => `<path d="M${d * 12} -38 L${d * 28} -58 L${d * 32} -32z" fill="${TIGER}" ${L}/><path d="M${d * 18} -38 L${d * 27} -50 L${d * 28} -36z" fill="#f5a3a3"/>`).join('');
// 虎姑婆：穿姑婆的衣服（紫色長袍、頭巾），但露出老虎尾巴和老虎臉
const granny = ({ mood = 'sly', pose = 'down', item = '', tailUp = false } = {}) =>
  tail(tailUp ? 'M-26 -40 q-50 -20 -40 -80 q4 -20 20 -24' : 'M-26 -24 q-56 6 -62 -44 q-2 -22 14 -30') +
  person({ skin: TIGER, hair: 'none', outfit: 'robe', top: '#7a5ea8', bottom: '#4a3a6a', mood, pose, item, hat: granHead(mood) });

// 包袱
const bundle = `<path d="M-40 -46 q-26 14 -16 44 h40 q12 -30 -14 -44z" fill="#e2483d" ${line(2.5)}/><circle cx="-36" cy="-46" r="6" fill="#e2483d" ${line(2)}/>` +
  [[-46, -26], [-28, -18], [-38, -10]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#fff"/>`).join('');
// 鍋子（tilt 角度）
const pot = (x, y, s = 1, tilt = 0) => at(x, y, s, false, `<g transform="rotate(${tilt})">` +
  `<path d="M-46 -40 Q-46 10 0 10 Q46 10 46 -40z" fill="#4a4a52" ${L}/>` +
  `<ellipse cx="0" cy="-40" rx="46" ry="10" fill="#f2c14e" ${L}/>` +
  `<path d="M-46 -40 h-12 M46 -40 h12" ${line(5)}/></g>`);
// 灶
const stove = (x, y, s = 1) => at(x, y, s, false,
  `<rect x="-60" y="-70" width="120" height="70" fill="#c8553d" ${L}/><path d="M-26 0 V-36 Q0 -56 26 -36 V0z" fill="#3a2a22" ${L}/>` +
  flames(0, -2, 0.32));

const nightOut = (top = '#24306a', bottom = '#5a62a0') => night(top, bottom) + moon(660, 110, 42);

// ---------- 每一頁 ----------
const pages = {
  // 封面：姊弟在三合院前，虎姑婆在旁邊偷看
  cover: svg(sky('#5a5a9a', '#f0b9a0') + moon(150, 110, 40) + greenMountains(330, '#7a8ab0', '#6a7aa0') +
    courtyard(380, '#d9c49a') + sanheyuan(380, 400, 0.62) + bamboo(80, 420, 0.8) + bamboo(720, 410, 0.75) +
    at(250, 560, 1.15, false, ajin({ pose: 'hold' })) + at(360, 565, 1.1, false, atu({ mood: 'normal' })) +
    at(580, 570, 1.2, true, granny({ mood: 'sly', pose: 'point' })) + sweat(210, 380)),

  // 1. 山腳下的三合院：媽媽、阿金、阿土
  '01': svg(sky() + sun(680, 90) + cloud(160, 100) + cloud(500, 70, 0.7) + greenMountains(330) +
    paddy(330, { h: 70 }) + courtyard(395) + sanheyuan(400, 400, 0.78) + bamboo(40, 440, 0.8) + bamboo(770, 440, 0.7) +
    at(400, 565, 1.05, false, mom({ pose: 'down' })) + at(290, 565, 1, false, ajin({ pose: 'up' })) + at(510, 565, 1, true, atu({ pose: 'up' })) +
    at(660, 560, 0.8, true, chicken()) + at(130, 570, 0.7, false, chicken({ c: '#e8a85a' }))),

  // 2. 媽媽要去外婆家，叮嚀關好門
  '02': svg(sky('#ffcfa8', '#fff0e0') + sun(660, 150, 44) + cloud(200, 100) + greenMountains(340, '#9cc79a', '#86b98a') +
    courtyard(400) + `<path d="M380 ${H} Q470 470 560 400 L620 400 Q560 470 700 ${H}z" fill="#d9bc85"/>` +
    sanheyuan(170, 410, 0.6) +
    at(560, 560, 1.1, true, mom({ pose: 'raise', item: bundle })) +
    at(280, 565, 1, false, ajin({ pose: 'raise' })) + at(380, 565, 0.95, false, atu({ pose: 'raise' }))),

  // 3. 山上的老虎精偷聽，偷偷笑
  '03': svg(sky('#a9cfa0', '#e6f2d8') + greenMountains(300, '#6f9f7a', '#5f8f6a') + forest(400, '#4f8a5a', '#447a4f') +
    `<rect x="${BX}" y="390" width="${BW}" height="${H - 390}" fill="#6a9a5a"/>` +
    sanheyuan(110, 330, 0.18) + pine(680, 470, 1.1) + pine(80, 480, 0.9) +
    at(420, 540, 1.4, false, tiger({ mood: 'sly' })) + bush(300, 560, 1.4) + bush(560, 580, 1.1, '#6cbd62') +
    `<path d="M520 300 q14 -10 22 6 M530 286 q24 -16 34 10" fill="none" ${line(3)}/>`),

  // 4. 晚上有人敲門：叩叩叩！
  '04': svg(nightOut() + courtyard(520, '#9a8f7a') + at(420, 520, 2, false, twHall(280, 120)) +
    at(290, 570, 1.1, false, granny({ mood: 'happy', pose: 'point' })) +
    word(560, 262, '叩叩叩！', 46, '#fff6c8', INK) + `<path d="M370 400 l-16 -8 M372 420 l-20 0 M370 440 l-16 8" ${line(3)}/>`),

  // 5. 弟弟把門打開了，姊姊覺得聲音好奇怪
  '05': svg(twInterior({ dark: true, window: false }) +
    `<rect x="70" y="140" width="170" height="220" fill="#2a3466" ${L}/>` + moon(98, 172, 12) +
    at(150, 360, 0.85, false, granny({ mood: 'happy', pose: 'reach' })) +
    `<path d="M240 140 L300 160 V380 L240 360z" fill="#7a4a2e" ${L}/>` +
    `<rect x="60" y="130" width="190" height="16" fill="#4a3426"/>` +
    at(340, 540, 1.1, true, atu({ pose: 'reach' })) +
    at(560, 560, 1.15, true, ajin({ mood: 'normal', pose: 'hips' })) + qmark(610, 340) + qmark(650, 370, 0.7)),

  // 6. 屋裡很暗，半夜聽到「喀滋、喀滋」
  '06': svg(twInterior({ dark: true }) +
    bed(360, 540, 1.1, at(-90, -100, 1, false, granHead('sly')) + at(0, -96, 0.9, false, sleepHead(30)) +
      quilt(-40, -70, 190, '#6aa58a') + tail('M60 -50 q30 -30 60 -10', 10)) +
    dim(0.3) +
    at(640, 570, 1.1, true, ajin({ mood: 'scared', pose: 'down' })) + sweat(600, 400) +
    word(250, 300, '喀滋', 34, '#fff6c8', INK) + word(330, 340, '喀滋', 28, '#fff6c8', INK)),

  // 7. 「妳在吃什麼？」姊姊嚇了一大跳（不畫手指，只畫姊姊嚇到）
  '07': svg(twInterior({ dark: true }) +
    bed(330, 540, 1.1, at(-60, -100, 1, false, granHead('sly')) + quilt(-10, -70, 200, '#6aa58a') +
      tail('M90 -50 q40 -40 70 -10', 10)) +
    dim(0.38) +
    at(640, 570, 1.2, true, ajin({ mood: 'scared', pose: 'up' })) + bang(560, 330, 1.3) + sweat(590, 380) + sweat(700, 380)),

  // 8. 姊姊說要上廁所，偷偷爬上大樹
  '08': svg(nightOut('#2a3570', '#6a72aa') + courtyard(500, '#5f7a5a') +
    `<rect x="${BX}" y="460" width="${BW}" height="${H - 460}" fill="#5f7a5a"/>` +
    at(640, 470, 0.9, false, twHall(280, 120, { lit: true })) + bigTree(200, 580, 1.05) +
    at(320, 375, 0.85, false, ajin({ mood: 'happy', pose: 'hold' })) + bamboo(780, 520, 0.7)),

  // 9. 虎姑婆在樹下大叫，姊姊說要熱油
  '09': svg(nightOut('#2a3570', '#6a72aa') + `<rect x="${BX}" y="460" width="${BW}" height="${H - 460}" fill="#5f7a5a"/>` +
    bigTree(200, 580, 1.05) + at(320, 375, 0.85, false, ajin({ mood: 'happy', pose: 'point' })) +
    at(520, 580, 1.15, true, granny({ mood: 'angry', pose: 'up', tailUp: true })) + sweat(570, 380)),

  // 10. 煮好一鍋熱油，用繩子吊上樹，張大嘴巴等著
  '10': svg(nightOut('#2a3570', '#6a72aa') + `<rect x="${BX}" y="460" width="${BW}" height="${H - 460}" fill="#5f7a5a"/>` +
    bigTree(200, 580, 1.05) + at(320, 375, 0.85, false, ajin({ mood: 'normal', pose: 'reach' })) +
    `<path d="M384 328 V420" ${line(3)}/>` + pot(384, 466, 0.75) + steam(384, 420, 0.7) +
    at(500, 590, 1.15, true, granny({ mood: 'gape', pose: 'up', tailUp: true })) +
    stove(700, 560, 0.9)),

  // 11. 熱油一倒——嘩！虎姑婆燙得哇哇叫，逃回深山
  '11': svg(nightOut('#2a3570', '#6a72aa') + `<rect x="${BX}" y="460" width="${BW}" height="${H - 460}" fill="#5f7a5a"/>` +
    bigTree(200, 580, 1.05) + at(320, 375, 0.85, false, ajin({ mood: 'happy', pose: 'reach' })) +
    pot(390, 360, 0.75, 70) +
    [[420, 410], [440, 440], [430, 470], [455, 500], [470, 470]].map(([x, y]) => `<path d="M${x} ${y} q-7 10 0 15 q7 -5 0 -15z" fill="#f2c14e" ${line(2)}/>`).join('') +
    at(620, 580, 1.1, false, `<g transform="rotate(12)">${granny({ mood: 'cry', pose: 'up', tailUp: true })}</g>`) + steam(560, 330, 0.8) + steam(690, 350, 0.7) +
    speed(540, 470, 1.2) + word(600, 260, '燙燙燙！', 40, '#ffd25e', INK) + sweat(680, 400)),

  // 12. 媽媽回來，緊緊抱住阿金
  '12': svg(sky('#ffd2b0', '#fff3e2') + sun(400, 170, 60) + cloud(150, 100) + cloud(650, 90, 0.8) + greenMountains(340, '#9cc79a', '#86b98a') +
    courtyard(395) + sanheyuan(400, 400, 0.72) +
    at(430, 570, 1.15, true, mom({ pose: 'hold', mood: 'cry' })) + at(370, 575, 1.05, false, ajin({ pose: 'up', mood: 'cry' })) +
    hearts(470, 330) + bird(140, 260, 1, '#e86a6a') + bird(680, 250, 0.9) + at(660, 570, 0.7, true, chicken())),
};

S.writeBook('hu-gu-po', pages);
