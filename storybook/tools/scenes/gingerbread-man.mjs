// 薑餅人的插畫。用法：node tools/scenes/gingerbread-man.mjs --sheet

import * as S from './lib.mjs';
import * as U from './us-common.mjs';

const { BX, BW, H, INK, line, L, at, svg, face, sky, sun, cloud, hills, ground, tree, pine, grass, sparkle, water, cottage, room, fence, bird, person, hand, sweat, hearts, writeBook } = S;
const { farmhouse, barn, cow, horse, fox, note, thought, speed, dust } = U;

// ---------- 薑餅人專用 ----------
const GB = '#c47a3e';
const limb = (x1, y1, x2, y2) =>
  `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${INK}" stroke-width="28" stroke-linecap="round"/>` +
  `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${GB}" stroke-width="22" stroke-linecap="round"/>`;
const icing = (x, y, a = 0) => `<path d="M-8 0 q4 -5 8 0 q4 5 8 0" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" transform="translate(${x} ${y}) rotate(${a})"/>`;

// pose: down / run / up / stop（一手往前擋）/ think（手放下巴）
function gingerbread({ mood = 'happy', pose = 'down' } = {}) {
  const LEGS = pose === 'run' ? [[-8, -36, -34, -14], [8, -36, 26, -4]] : [[-8, -36, -18, -6], [8, -36, 18, -6]];
  const ARMS = {
    down: [[-16, -70, -40, -46], [16, -70, 40, -46]],
    run: [[-16, -70, -44, -84], [16, -70, 44, -52]],
    up: [[-16, -70, -40, -108], [16, -70, 40, -108]],
    stop: [[-16, -70, -40, -46], [16, -70, 50, -88]],
    think: [[-16, -70, -40, -46], [16, -70, 22, -96]],
  }[pose];
  const all = [...LEGS, ...ARMS];
  return all.map((a) => limb(...a)).join('') +
    `<ellipse cx="0" cy="-58" rx="26" ry="32" fill="${GB}" ${L}/>` +
    all.map(([x1, y1, x2, y2]) => icing(x2 - (x2 - x1) * 0.18, y2 - (y2 - y1) * 0.18, Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI + 90)).join('') +
    ['#e2483d', '#5fae5a', '#5b8fd0'].map((c, i) => `<circle cx="0" cy="${-74 + i * 16}" r="5.5" fill="${c}" ${line(2)}/>`).join('') +
    at(0, -112, 1, false,
      `<circle r="28" fill="${GB}" ${L}/>` +
      `<path d="M-20 -12 q20 -14 40 0" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="1 7"/>` +
      `<ellipse cx="-10" cy="-2" rx="4.5" ry="5.5" fill="#3a2418"/><ellipse cx="10" cy="-2" rx="4.5" ry="5.5" fill="#3a2418"/>` +
      `<ellipse cx="-17" cy="8" rx="5" ry="3" fill="#f08a8a" opacity=".8"/><ellipse cx="17" cy="8" rx="5" ry="3" fill="#f08a8a" opacity=".8"/>` +
      (mood === 'happy' ? `<path d="M-10 10 q10 10 20 0" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>`
        : mood === 'scared' ? `<ellipse cx="0" cy="13" rx="5" ry="6" fill="#fff"/>`
          : `<path d="M-8 14 q8 -6 16 0" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>`));
}

const glasses = `<circle cx="-11" cy="-2" r="9" fill="none" ${line(2.5)}/><circle cx="11" cy="-2" r="9" fill="none" ${line(2.5)}/><path d="M-2 -2 h4" ${line(2.5)}/>`;
const grandma = (o = {}) => person({ outfit: 'dress', top: '#d36b6b', apron: '#fff', hair: 'bun', hairColor: '#e6e6e6', hat: glasses, ...o });
const grandpa = (o = {}) => person({ outfit: 'shirt', top: '#6f9bd1', bottom: '#6b5a3a', hair: 'bald', hairColor: '#e6e6e6', beard: '#f2f2f2', ...o });

// 烤箱（老式鑄鐵爐）
const oven = (x, y, s = 1, open = false) => at(x, y, s, false,
  `<rect x="-10" y="-280" width="30" height="120" fill="#5a5560" ${L}/>` +
  `<rect x="-80" y="-170" width="160" height="160" rx="8" fill="#4a4550" ${L}/>` +
  `<rect x="-90" y="-180" width="180" height="16" rx="4" fill="#5a5560" ${L}/>` +
  `<rect x="-70" y="-10" width="16" height="10" fill="${INK}"/><rect x="54" y="-10" width="16" height="10" fill="${INK}"/>` +
  (open
    ? `<rect x="-60" y="-140" width="120" height="90" rx="6" fill="#f2a24a" ${L}/><path d="M-60 -50 L-80 -10 H80 L60 -50z" fill="#6a6570" ${L}/>`
    : `<rect x="-60" y="-140" width="120" height="90" rx="6" fill="#6a6570" ${L}/><rect x="-40" y="-120" width="80" height="40" rx="4" fill="#f2a24a" ${line(2)}/><path d="M-30 -60 h60" ${line(5)}/>`));

// 河：中間一條，上下是草地
const river = (top = 340, h = 150) =>
  `<rect x="${BX}" y="${top - 60}" width="${BW}" height="60" fill="#9fd38a"/>` + water(top, h, '#6db8ea') +
  `<rect x="${BX}" y="${top + h}" width="${BW}" height="${H - top - h}" fill="#8dc775"/>` +
  `<path d="M${BX} ${top + h} H${BX + BW}" stroke="#5f9f4f" stroke-width="5"/>`;
const reeds = (x, y) => [0, 12, 24].map((d, i) => `<path d="M${x + d} ${y} q-4 -30 ${-6 + i * 6} -${40 + i * 8}" fill="none" stroke="#5f9f4f" stroke-width="4" stroke-linecap="round"/><ellipse cx="${x + d - 6 + i * 6}" cy="${y - 44 - i * 8}" rx="4" ry="10" fill="#8a5a32"/>`).join('');

const road = `<path d="M${BX} 470 Q200 440 400 460 T${BX + BW} 450 V530 Q400 545 0 520 T${BX} 540z" fill="#e9d3a3"/>`;
const crumb = (x, y) => `<path d="M${x} ${y} l14 -16 l16 4 l4 14 l-18 8z" fill="${GB}" ${line(2.5)}/><path d="M${x + 8} ${y - 6} q6 -4 12 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="${x + 50}" cy="${y + 2}" r="5" fill="${GB}" ${line(2)}/><circle cx="${x - 14}" cy="${y + 4}" r="4" fill="${GB}" ${line(2)}/>`;

// ---------- 每一頁 ----------
const pages = {
  // 封面：薑餅人在前面跑，後面一路追
  cover: svg(sky('#ffe2c4', '#fff6e8') + sun(660, 110, 46) + cloud(180, 110) + hills(380, '#b5dc94', '#9ccf7c') + road +
    farmhouse(110, 420, 0.5) + tree(720, 430, 0.9) +
    at(160, 520, 0.55, false, cow({ run: true })) + at(310, 520, 0.85, false, grandma({ pose: 'up', mood: 'scared' })) +
    at(430, 520, 0.85, false, grandpa({ pose: 'up', mood: 'scared' })) +
    at(620, 540, 1.35, false, gingerbread({ pose: 'run' })) + speed(550, 410, 3, 60) + dust(540, 530) +
    note(560, 300) + note(700, 270, 0.8) + sparkle(740, 330, 0.7)),

  // 1. 鄉下小房子裡的老爺爺和老奶奶
  '01': svg(sky() + sun(680, 90) + cloud(160, 100) + hills(380) +
    farmhouse(300, 470, 0.95) + tree(620, 470, 1.1) + fence(480, 520, 300) +
    at(500, 560, 1, false, grandpa()) + at(600, 560, 1, true, grandma()) +
    grass(100, 560) + grass(160, 580) + grass(720, 575)),

  // 2. 做薑餅人，放進烤箱
  '02': svg(room() + oven(170, 470, 0.95, true) +
    `<rect x="520" y="420" width="240" height="20" fill="#b5835a" ${L}/><rect x="540" y="440" width="18" height="120" fill="#9a6b45" ${L}/><rect x="722" y="440" width="18" height="120" fill="#9a6b45" ${L}/>` +
    `<rect x="560" y="398" width="130" height="22" rx="11" fill="#e8c792" ${L}/><rect x="540" y="404" width="20" height="10" rx="4" fill="#c9a06a" ${line(2)}/><rect x="690" y="404" width="20" height="10" rx="4" fill="#c9a06a" ${line(2)}/>` +
    [[600, 390], [640, 392], [670, 388]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#5a2a3a"/>`).join('') +
    at(420, 560, 1.1, true, grandma({ pose: 'reach', mood: 'happy' })) +
    `<rect x="290" y="${560 - 76 * 1.1 - 4}" width="120" height="10" rx="4" fill="#c9ccd6" ${L}/>` +
    at(374, 560 - 76 * 1.1 - 8, 0.62, false, `<g transform="rotate(-90)">${gingerbread({ mood: 'normal' })}</g>`) +
    `<path d="M150 270 q-10 -20 6 -36 M180 270 q-10 -24 8 -40" fill="none" stroke="#c9c2b8" stroke-width="5" stroke-linecap="round"/>`),

  // 3. 打開烤箱，薑餅人跳出來跑出門
  '03': svg(room({ window: false }) +
    `<rect x="560" y="200" width="150" height="180" fill="#9fd38a" ${L}/><rect x="560" y="200" width="150" height="80" fill="#bfe4ff"/>` +
    `<path d="M560 200 L500 220 V400 L560 380z" fill="#8c5a3a" ${L}/>` +
    oven(150, 470, 0.95, true) +
    at(250, 560, 1, false, grandma({ pose: 'up', mood: 'scared' })) +
    at(500, 470, 1.05, false, gingerbread({ pose: 'run' })) + speed(420, 350, 3, 70) +
    sparkle(400, 250, 0.8) + sparkle(330, 330, 0.6) +
    `<text x="400" y="230" font-size="40" font-weight="700" text-anchor="middle" fill="#e86a6a">咻！</text>`),

  // 4. 老爺爺、老奶奶在後面追
  '04': svg(sky() + cloud(140, 90) + cloud(560, 70, 0.8) + hills(380) + road + farmhouse(90, 440, 0.5) +
    at(270, 520, 0.95, false, grandpa({ pose: 'up', mood: 'angry' })) + at(380, 520, 0.95, false, grandma({ pose: 'up', mood: 'scared' })) +
    sweat(320, 330) + dust(210, 510) +
    at(620, 530, 1.15, false, gingerbread({ pose: 'run' })) + speed(560, 420, 3) +
    note(560, 300) + note(700, 260, 0.8) + note(760, 330, 0.7)),

  // 5. 跑過一頭牛
  '05': svg(sky() + sun(110, 90) + hills(380, '#a9d98f', '#8dc775') + road + barn(140, 440, 0.6) + fence(-200, 470, 500) +
    at(320, 530, 1.05, false, cow({ run: true, mood: 'happy' })) + dust(220, 520) +
    at(620, 530, 1.05, false, gingerbread({ pose: 'run' })) + speed(560, 420, 3) +
    note(600, 290) + note(720, 320, 0.8) + tree(740, 440, 0.8)),

  // 6. 跑過一匹馬，牛也一起追
  '06': svg(sky() + cloud(600, 100) + hills(380) + road + pine(60, 440, 0.9) +
    at(140, 520, 0.7, false, cow({ run: true })) +
    at(390, 530, 1, false, horse({ run: true })) + dust(310, 520) +
    at(650, 530, 1.05, false, gingerbread({ pose: 'run' })) + speed(590, 420, 3) +
    note(620, 290) + note(740, 330, 0.8)),

  // 7. 前面有一條大河，急得團團轉
  '07': svg(sky() + cloud(200, 100) + cloud(600, 80, 0.7) + river(300, 170) + pine(150, 300, 0.6) + pine(620, 300, 0.7) + tree(420, 290, 0.5) +
    reeds(80, 560) + reeds(700, 560) +
    at(400, 560, 1.3, false, gingerbread({ pose: 'up', mood: 'scared' })) + sweat(340, 380) + sweat(470, 370) +
    `<path d="M330 580 q70 20 140 0" fill="none" stroke="${INK}" stroke-width="3" stroke-dasharray="6 8" opacity=".5"/>`),

  // 8. 狐狸笑咪咪地說：坐到我的尾巴上
  '08': svg(sky() + cloud(600, 90) + river(300, 170) + pine(200, 300, 0.6) + tree(560, 290, 0.5) + reeds(40, 560) +
    at(270, 570, 1.15, false, fox({ mood: 'sly', tailUp: false })) +
    at(560, 570, 1.1, true, gingerbread({ pose: 'think', mood: 'normal' })) +
    `<text x="410" y="380" font-size="60" font-weight="700" text-anchor="middle" fill="#c8553d">？</text>`),

  // 9. 游到河中間，薑餅人爬到狐狸頭上
  '09': svg(sky('#bfe4ff', '#eaf6ff') + cloud(140, 100) + `<rect x="${BX}" y="280" width="${BW}" height="${H - 280}" fill="#6db8ea"/>` +
    `<rect x="${BX}" y="250" width="${BW}" height="30" fill="#9fd38a"/>` + pine(120, 280, 0.5) + pine(660, 280, 0.55) +
    at(400, 480, 1.25, false, fox({ swim: true, mood: 'sly' })) +
    at(452, 352, 0.75, false, gingerbread({ pose: 'up', mood: 'scared' })) +
    `<path d="M${BX} 432 H${BX + BW} V${H} H${BX}z" fill="#6db8ea"/>` + `<path d="M290 434 q20 -10 40 0 q20 10 40 0 q20 -10 40 0 q20 10 40 0 q20 -10 40 0" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>` +
    [[-100, 470], [120, 500], [300, 460], [520, 470], [700, 500], [880, 470], [200, 560], [620, 560]].map(([x, y]) =>
      `<path d="M${x} ${y} q20 -12 40 0 q20 12 40 0" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"/>`).join('') +
    sweat(500, 280)),

  // 10. 喀滋！狐狸滿足地舔嘴巴，只剩一小塊餅乾屑
  '10': svg(sky('#ffe2c4', '#fff6e8') + sun(660, 120, 44) + cloud(200, 100) +
    `<rect x="${BX}" y="300" width="${BW}" height="90" fill="#6db8ea"/>` +
    `<path d="M80 340 q20 -12 40 0 q20 12 40 0 M520 330 q20 -12 40 0 q20 12 40 0" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"/>` +
    `<rect x="${BX}" y="390" width="${BW}" height="${H - 390}" fill="#8dc775"/><path d="M${BX} 390 H${BX + BW}" stroke="#5f9f4f" stroke-width="5"/>` +
    reeds(60, 560) + reeds(720, 560) +
    at(390, 540, 1.4, false, fox({ mood: 'yum', tailUp: true })) + crumb(570, 552) +
    sparkle(560, 380, 0.7) + sparkle(250, 330, 0.6)),

  // 11. 小心甜言蜜語：先想一想！
  '11': svg(sky() + sun(110, 90) + cloud(620, 100) + hills(380) + tree(80, 450, 0.9) +
    at(230, 560, 1.05, false, fox({ mood: 'sly', tailUp: true })) +
    at(560, 560, 1.25, true, gingerbread({ pose: 'stop', mood: 'normal' })) +
    thought(620, 280, 150, 100, 590, 380,
      `<text x="-28" y="20" font-size="58" font-weight="700" text-anchor="middle" fill="#c8553d">?</text>` +
      `<text x="28" y="20" font-size="58" font-weight="700" text-anchor="middle" fill="#e2483d">!</text>`)),
};

writeBook('gingerbread-man', pages);
