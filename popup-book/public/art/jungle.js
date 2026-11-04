// 🐒 叢林：點動物會唸英文名字、播真的叫聲，然後像機關書一樣動起來
// 版面 1600×1000；左右兩邊是大樹，上面有兩根橫的樹枝（左 (208,240)→(792,94)、右 (885,94)→(1406,250)）
// 中間是黃綠色的空地（地面約 y 540～830），下面有一條小河（y 830 以下）
// 動物是 AI 生成的圖（art/img/jungle/*.webp）；猴子、樹懶、鸚鵡的圖裡自帶一小段樹枝；綠鬣蜥趴在右邊樹枝的左段
// 叫聲是 Pixabay 的音效（audio/sound/，來源見那裡的 CREDITS.md），用 playSound() 排在名字後面播
// 整個檔案包在 { } 裡，變數名稱才不會跟其他頁面的檔案撞名
{
const SRC = (name) => `art/img/jungle/${name}.webp`;
const IMG = (name, w, h, clip) =>
  `<image href="${SRC(name)}" width="${w}" height="${h}"${clip ? ` clip-path="url(#${clip})"` : ''}/>`;
const PATH = (pts) => 'M' + pts.map((p) => p.join(',')).join('L') + 'Z';
const RECT = (x0, y0, x1, y1) => PATH([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]);
const CLIP = (id, d) => `<clipPath id="${id}"><path d="${d}"/></clipPath>`;
const HOLE = (id, w, h, d) => `<clipPath id="${id}"><path clip-rule="evenodd" d="M0,0H${w}V${h}H0Z${d}"/></clipPath>`;
const DUST = '#b8a06a';

// 整張圖放在零件 body 裡；inner 不給就是整張圖
const whole = (p, name, w, h, inner) =>
  `<g transform="translate(0 ${-h})"><g id="${p}-body">${inner ?? IMG(name, w, h)}</g></g>`;
// 掛在樹枝上的動物：樹枝（圖的上緣）不動，下面的身體裁出來（零件 hang）繞手抓的地方轉
const hanging = (p, name, w, h, part) => whole(p, name, w, h,
  HOLE(`${p}-cb`, w, h, part) + IMG(name, w, h, `${p}-cb`) +
  CLIP(`${p}-ch`, part) + `<g id="${p}-hang">${IMG(name, w, h, `${p}-ch`)}</g>`);

// ---------- 猴子：抓著樹枝盪鞦韆，「吱吱吱」，越盪越小再停下來 ----------
// 圖 795×594；樹枝在 y < 42，兩隻手抓在 (345, 30)、(535, 30)，身體繞兩手中間 (440, 30) 盪
const monkey = {
  id: 'monkey', en: 'Monkey', zh: '猴子', x: 380, y: 366, s: 0.38,
  hint: [480, -344],
  pivots: { hang: [440, 30] },
  art: (p) => hanging(p, 'monkey', 795, 594, RECT(0, 42, 795, 594)),
  async act(c) {
    playSound('macaque');
    for (const r of [22, -20, 16, -12, 7, -4]) await c.anim(520, { hang: { r } });
    await c.anim(400, { hang: { r: 0 } });
  },
};

// ---------- 樹懶：慢——慢——地晃一晃，慢慢說「Hello!」 ----------
// 圖 620×484；樹枝在上面（左邊往下斜到 y ≈ 130），手抓在 (300, 20)、(510, 20)
const sloth = {
  id: 'sloth', en: 'Sloth', zh: '樹懶', x: 1050, y: 354, s: 0.4,
  hint: [350, -184],
  pivots: { hang: [405, 30] },
  art: (p) => hanging(p, 'sloth', 620, 484, RECT(150, 45, 620, 484)),
  async act(c) {
    await c.anim(1800, { hang: { r: 8 } });
    speak('Hello!', { queue: true });
    await c.anim(2000, { hang: { r: -6 } });
    await c.anim(1600, { hang: { r: 0 } });
  },
};

// ---------- 鸚鵡：在樹枝上前後搖擺，「嘎——」叫一聲，學人說「Hello!」，羽毛飄下來 ----------
// 圖 432×609，腳抓在 (255, 310) 的樹枝上
const FEATHERS = ['#e8302a', '#ffd23f', '#2f6fe0'];
const parrot = {
  id: 'parrot', en: 'Parrot', zh: '鸚鵡', x: 250, y: 520, s: 0.35,
  hint: [300, -459],
  pivots: { body: [255, 310] },
  art: (p) => whole(p, 'parrot', 432, 609),
  async act(c) {
    playSound('parrot');
    for (let i = 0; i < 3; i++) {
      await c.anim(220, { body: { r: -12 } });
      await c.anim(220, { body: { r: 8 } });
    }
    await c.anim(200, { body: { r: 0 } });
    speak('Hello!', { queue: true });
    FEATHERS.forEach((color) => c.burst('body', 200, 220, { n: 3, color, vx: [-1.5, 1.5], vy: [-1.5, 0], g: 0.05, size: [6, 10], life: 1500 }));
    await c.anim(300, { body: { sy: 1.06 } });
    await c.anim(300, { body: { sy: 1 } });
  },
};

// ---------- 老虎：蹲低，往前一撲，落地以後「吼——」 ----------
// 圖 587×619（臉朝右）
const tiger = {
  id: 'tiger', en: 'Tiger', zh: '老虎', x: 520, y: 820, s: 0.5,
  hint: [300, -400],
  pivots: { body: [293, 619] },
  art: (p) => whole(p, 'tiger', 587, 619),
  async act(c) {
    await c.anim(500, { body: { sy: 0.85, sx: 1.06 } });
    await c.anim(700, { body: { tx: 300, sy: 1, sx: 1, r: -10 } }, (t) => c.set('body', { ty: -260 * Math.sin(t * Math.PI) }));
    c.set('body', { ty: 0 });
    c.burst('body', 293, 615, { n: 12, color: DUST, vx: [-3, 3], vy: [-2, -0.5], g: 0.08, size: [6, 12] });
    await c.anim(200, { body: { r: 0, sy: 0.92 } });
    await c.anim(200, { body: { sy: 1 } });
    playSound('tiger');
    await c.anim(300, { body: { r: -4, sx: 1.05 } });
    await c.wait(1200);
    await c.anim(300, { body: { r: 0, sx: 1 } });
    await c.anim(1300, { body: { tx: 0 } });
  },
};

// ---------- 蟒蛇：慢慢抬高身體，左右搖，吐吐舌頭「嘶——」 ----------
// 圖 663×573（頭在右上），嘴巴在 (592, 62)；舌頭是程式畫的
const snake = {
  id: 'snake', en: 'Snake', zh: '蟒蛇', x: 150, y: 960, s: 0.38,
  hint: [520, -493],
  pivots: { body: [330, 573], tongue: [592, 62] },
  art: (p) => whole(p, 'snake', 663, 573, IMG('snake', 663, 573) +
    `<g id="${p}-tongue" opacity="0"><path d="M592,62 L650,62 L672,48 M650,62 L672,76" fill="none" stroke="#e8406a" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g>`),
  setup(c) { c.set('tongue', { sx: 0 }); },
  async act(c) {
    playSound('anaconda');
    await c.anim(700, { body: { sy: 1.1 } });
    for (let i = 0; i < 3; i++) {
      c.set('tongue', { o: 1 });
      await c.anim(150, { tongue: { sx: 1 }, body: { r: i % 2 ? -5 : 5 } });
      await c.anim(150, { tongue: { sx: 0 } });
      await c.wait(250);
    }
    c.set('tongue', { o: 0 });
    await c.anim(600, { body: { sy: 1, r: 0 } });
  },
};

// ---------- 青蛙：伸出長舌頭把小蒼蠅黏走，「呱呱」，再跳一下 ----------
// 圖 634×583（臉朝右），嘴巴在 (490, 95)；蒼蠅和舌頭是程式畫的，蒼蠅在 (720, 20)
const frog = {
  id: 'frog', en: 'Frog', zh: '青蛙', x: 930, y: 905, s: 0.22,
  hint: [300, -333],
  pivots: { body: [317, 583], tongue: [490, 95] },
  art(p) {
    const fly = `<g id="${p}-fly" data-cx="720" data-cy="20">` +
      '<ellipse cx="708" cy="6" rx="16" ry="10" fill="#ffffff" opacity=".8"/><ellipse cx="730" cy="4" rx="16" ry="10" fill="#ffffff" opacity=".8"/>' +
      '<ellipse cx="720" cy="20" rx="17" ry="12" fill="#333344"/></g>';
    const tongue = `<g id="${p}-tongue" opacity="0"><path d="M490,95 L715,22" stroke="#ff6b8a" stroke-width="16" stroke-linecap="round"/></g>`;
    return whole(p, 'frog', 634, 583, tongue + IMG('frog', 634, 583) + fly);
  },
  setup(c) { c.set('tongue', { sx: 0, sy: 0 }); },
  async act(c) {
    // 蒼蠅嗡嗡飛
    await c.anim(900, {}, (t) => c.set('fly', { tx: 20 * Math.sin(t * 18), ty: 12 * Math.cos(t * 23) }));
    c.set('fly', { tx: 0, ty: 0 });
    c.set('tongue', { o: 1 });
    await c.anim(260, { tongue: { sx: 1, sy: 1 } });
    c.set('fly', { o: 0 });
    await c.wait(150);
    await c.anim(300, { tongue: { sx: 0, sy: 0 } });
    c.set('tongue', { o: 0 });
    playSound('frog');
    await c.anim(250, { body: { sy: 0.85 } });
    await c.anim(600, { body: { sy: 1 } }, (t) => c.set('body', { ty: -320 * Math.sin(t * Math.PI) }));
    c.set('body', { ty: 0 });
    await c.anim(150, { body: { sy: 0.9 } });
    await c.anim(150, { body: { sy: 1 } });
    await c.wait(500);
    await c.anim(400, { fly: { o: 1 } }); // 又飛來一隻
  },
};

// ---------- 大猩猩：搥胸「咚咚咚」，跳一下 ----------
// 圖 618×663（臉朝右）
const gorilla = {
  id: 'gorilla', en: 'Gorilla', zh: '大猩猩', x: 1000, y: 830, s: 0.5,
  hint: [400, -450],
  pivots: { body: [309, 663] },
  art: (p) => whole(p, 'gorilla', 618, 663),
  async act(c) {
    playSound('chimpanzee');
    await c.anim(300, { body: { r: -6, sy: 1.05 } });
    for (let i = 0; i < 8; i++) await c.anim(110, { body: { r: i % 2 ? -8 : -3, sx: i % 2 ? 1.03 : 0.98 } });
    await c.anim(250, { body: { r: 0, sx: 1, sy: 0.9 } });
    await c.anim(500, { body: { sy: 1 } }, (t) => c.set('body', { ty: -150 * Math.sin(t * Math.PI) }));
    c.set('body', { ty: 0 });
    c.burst('body', 309, 660, { n: 14, color: DUST, vx: [-3, 3], vy: [-2, -0.5], g: 0.08, size: [6, 12] });
    await c.anim(150, { body: { sy: 0.94 } });
    await c.anim(200, { body: { sy: 1 } });
  },
};

// ---------- 綠鬣蜥：趴在右邊樹枝上做伏地挺身、鼓起下巴的喉扇，再「撲通」跳進河裡，最後爬回樹枝 ----------
// 圖 696×370（臉朝右，尾巴垂在身體下面）；綠色的動物不能用綠幕，改用洋紅色背景生圖
// 腳踩在圖的 y ≈ 190，r: 17 讓牠順著樹枝的斜度趴；喉扇是程式畫的，在下巴 (585, 165)
// focus: false：在原地表演，才看得到牠從樹枝跳進下面的河
const iguana = {
  id: 'iguana', en: 'Green Iguana', zh: '綠鬣蜥', x: 850, y: 151, s: 0.36, r: 17,
  hint: [350, -260],
  focus: false,
  pivots: { body: [100, 200], dewlap: [585, 135] },
  art: (p) => whole(p, 'iguana', 696, 370,
    `<g id="${p}-dewlap"><ellipse cx="585" cy="165" rx="42" ry="48" fill="#a8d23c"/><ellipse cx="585" cy="175" rx="30" ry="34" fill="#c3e85a"/></g>` +
    IMG('iguana', 696, 370)),
  setup(c) { c.set('dewlap', { sx: 0.3, sy: 0.3, o: 0 }); },
  async act(c) {
    // 點頭做伏地挺身
    for (let i = 0; i < 3; i++) {
      await c.anim(220, { body: { r: -8 } });
      await c.anim(220, { body: { r: 0 } });
    }
    // 喉扇鼓起來兩次
    for (let i = 0; i < 2; i++) {
      await c.anim(300, { dewlap: { sx: 1, sy: 1, o: 1 } });
      await c.wait(300);
      await c.anim(300, { dewlap: { sx: 0.3, sy: 0.3, o: 0 } });
    }
    // 往右前方跳出去，劃個拱形掉進河裡（樹枝斜 17°，所以畫面往下在牠的座標是往右下）
    await c.anim(1300, {}, (t) => c.set('body', { tx: 1546 * t, ty: -1400 * t + 3134 * t * t, r: 40 * t }), (t) => t);
    speak('Splash!', { queue: true });
    c.burst('body', 600, 200, { n: 20, color: '#ffffff', vx: [-5, 5], vy: [-8, -3], g: 0.35, size: [6, 13] });
    c.burst('body', 600, 200, { n: 12, color: '#8fd3ff', vx: [-4, 4], vy: [-6, -2], g: 0.3, size: [6, 11] });
    await c.anim(200, { body: { o: 0 } });
    await c.wait(600);
    // 從樹枝左邊慢慢爬回來
    c.set('body', { tx: -250, ty: 0, r: 0 });
    await c.anim(1600, { body: { tx: 0, o: 1 } }, (t) => c.set('body', { ty: -6 * Math.abs(Math.sin(t * Math.PI * 6)) }));
    c.set('body', { ty: 0 });
  },
};

SCENES.jungle = {
  w: 1600,
  h: 1000,
  bg: () => `
    <image href="${SRC('bg')}" width="1600" height="1000"/>
    <g font-weight="900" fill="#ffffff" stroke="#2f4a22" stroke-width="10" paint-order="stroke" stroke-linejoin="round">
      <text x="56" y="98" font-size="60">Jungle</text>
      <text x="58" y="148" font-size="38">叢林</text>
    </g>
  `,
  // 先畫後排（遠的），再畫前排
  items: [monkey, sloth, parrot, gorilla, iguana, tiger, frog, snake],
};
}
