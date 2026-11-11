// 🔊 叫聲：
//   動物：Pixabay 下載的真實叫聲（audio/sound/，來源見 CREDITS.md）；不太會叫的動物顯示小知識
//   車子：用 Web Audio 現場合成（警笛、喇叭、火車汽笛、引擎……），不用音效檔
// 播放順序：家長錄的（key「id_sound」）→ 上面這些 → 都沒有就說小知識

// 動物 id → audio/sound/ 裡的檔名
const SOUND_FILES = {
  'polar-bear': 'polar-bear', 'brown-bear': 'brown-bear', 'formosan-bear': 'brown-bear',
  anaconda: 'anaconda', 'king-cobra': 'king-cobra', rattlesnake: 'rattlesnake',
  fox: 'fox', 'arctic-fox': 'fox', camel: 'camel', dolphin: 'dolphin', eagle: 'eagle', elephant: 'elephant',
  frog: 'frog', lion: 'lion', macaque: 'macaque', parrot: 'parrot', peacock: 'peacock',
  'red-crowned-crane': 'red-crowned-crane', rhino: 'rhino', seal: 'seal', 'snowy-owl': 'snowy-owl',
  squirrel: 'squirrel', tiger: 'tiger', whale: 'whale', wolf: 'wolf',
  dog: 'dog', cat: 'cat', cow: 'cow', pig: 'pig', sheep: 'sheep', horse: 'horse', chicken: 'chicken', chimpanzee: 'chimpanzee',
};

// 沒有合適叫聲（或幾乎不會叫）的動物：說一個小知識
const SOUND_FACTS = {
  narwhal: '獨角鯨會發出「喀喀」聲，用聲音在黑黑的海裡找路！',
  walrus: '海象會用長長的牙齒，把自己從冰上撐起來！',
  puffin: '海鸚的叫聲低低的，有人說很像電鋸「嗡嗡」叫！',
  moose: '駝鹿秋天會發出很低的「嗚～」叫聲找朋友。',
  beaver: '河狸遇到危險，會用尾巴「啪！」地拍水，提醒家人快躲起來。',
  bison: '野牛會發出像打雷一樣低低的「轟轟」叫聲。',
  raccoon: '浣熊吃東西以前，喜歡先用手把食物摸一摸、搓一搓。',
  iguana: '綠鬣蜥不太會叫，生氣的時候會張開嘴巴、甩甩尾巴。',
  toucan: '巨嘴鳥的嘴巴看起來很大，其實很輕，裡面像海綿一樣有很多小洞。',
  sloth: '樹懶非常安靜，一天裡大部分的時間都在休息。',
  jaguar: '美洲豹的叫聲很特別，像在鋸木頭一樣「呼、呼、呼」。',
  llama: '羊駝平常會發出「嗯～嗯～」的哼哼聲，生氣的時候還會吐口水！',
  capybara: '水豚會發出小小的「咕咕」聲，跟家人說悄悄話。',
  flamingo: '紅鶴吃了很多粉紅色的小蝦，羽毛才會變成粉紅色！',
  reindeer: '馴鹿走路的時候，腳會發出「喀、喀」的聲音！',
  hedgehog: '刺蝟找東西吃的時候，鼻子會「呼呼、嗤嗤」地聞來聞去。',
  rabbit: '兔子很安靜，緊張的時候會用後腳「咚咚」跺地。',
  crocodile: '鱷魚寶寶在蛋裡面就會「唧唧」叫，請媽媽來幫忙！',
  cheetah: '獵豹不會吼叫！牠們會發出像小鳥一樣「啾啾」的聲音。',
  giraffe: '長頸鹿幾乎不出聲，晚上會發出很低很低的「嗡嗡」聲。',
  gorilla: '大猩猩會用手拍胸口「咚咚咚」，告訴大家「我在這裡！」',
  hippo: '河馬的叫聲很大，在水裡和水面上都聽得到！',
  zebra: '斑馬的叫聲很奇怪，像小狗「汪汪」叫又像驢子叫！',
  meerkat: '狐獴會派一隻站高高站崗，看到老鷹就大叫，讓大家趕快躲起來！',
  lemur: '環尾狐猴走路時會把尾巴舉高高，像旗子一樣讓家人跟上。',
  'snow-leopard': '雪豹不會吼叫！牠們會發出「喵～」和「呼呼」的聲音。',
  yak: '犛牛會發出低低的「哼哼」聲，牠的學名意思就是「會哼哼叫的牛」。',
  panda: '貓熊寶寶會發出像小羊一樣「咩咩」的叫聲。',
  'red-panda': '小貓熊會發出小小的「吱吱」聲，生氣時會站起來，讓自己看起來大一點。',
  orangutan: '紅毛猩猩爸爸會發出長長的叫聲，很遠很遠的地方都聽得到！',
  'leopard-cat': '石虎是台灣的野生貓，叫聲有點像家裡的小貓「喵喵」。',
  'blue-magpie': '台灣藍鵲的叫聲很大聲，常常一群一起「嘎嘎」叫。',
  kangaroo: '袋鼠很少叫，媽媽會用「咯咯」聲叫袋子裡的寶寶。',
  koala: '無尾熊爸爸會發出很低很大的「呼嚕」聲，像在打呼一樣！',
  platypus: '鴨嘴獸很安靜，牠的嘴巴可以感覺到水裡小蟲的動靜。',
  'sea-turtle': '海龜不太會叫，可以憋氣在水裡很久很久。',
  kiwi: '奇異鳥不會飛，晚上才出來，用長長的嘴巴找蟲吃。',
  shark: '鯊魚不會叫！牠們沒有可以發出聲音的聲帶。',
  octopus: '章魚不會叫，可是會變顏色，用顏色來「說話」！',
  penguin: '每隻企鵝寶寶的叫聲都不一樣，爸爸媽媽聽聲音就找得到自己的寶寶！',
  crab: '聖誕島每年有好幾千萬隻紅色螃蟹，一起橫著走到海邊生寶寶！',
  ostrich: '鴕鳥是世界上最大的鳥，不會飛，可是跑得超級快！',
  'komodo-dragon': '科摩多龍是世界上最大的蜥蜴，會用叉叉的舌頭聞味道。',
  tortoise: '加拉巴哥象龜可以活超過一百歲！',
  'sea-otter': '海獺睡覺的時候會手牽手，才不會被海水沖走！',
  clownfish: '小丑魚住在海葵裡面，海葵會保護牠。',
  orca: '虎鯨其實是海豚家族裡最大的，會一家人一起在海裡游泳。',
};

/* ================= 車子的聲音：Web Audio 合成 ================= */

const Synth = (() => {
  let ac = null, out = null;
  function ctx() {
    if (!ac) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ac = new AC();
      const comp = ac.createDynamicsCompressor();
      out = ac.createGain();
      out.gain.value = 0.6;
      out.connect(comp).connect(ac.destination);
    }
    if (ac.state === 'suspended') ac.resume();
    return ac;
  }
  let noiseBuf = null;
  const noise = () => {
    if (!noiseBuf) {
      noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const s = ac.createBufferSource();
    s.buffer = noiseBuf;
    s.loop = true;
    return s;
  };
  // 音量包絡：淡入、維持、淡出，避免「啪」的雜音
  function env(g, t0, dur, peak, attack = 0.02, release = 0.08) {
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(peak, t0 + attack);
    g.gain.setValueAtTime(peak, t0 + Math.max(attack, dur - release));
    g.gain.linearRampToValueAtTime(0, t0 + dur);
  }
  // 一個音：freq 可以是數字或 [起, 終]（滑音）
  function tone(t, dur, freq, { type = 'sine', gain = 0.3, attack, release, lp } = {}) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type;
    const [f0, f1] = Array.isArray(freq) ? freq : [freq, freq];
    o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    env(g, t, dur, gain, attack, release);
    let node = o.connect(g);
    if (lp) { const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = lp; node = g.connect(f); }
    node.connect(out);
    o.start(t);
    o.stop(t + dur + 0.05);
    return o;
  }
  // 雜訊（風聲、蒸汽、引擎）；band 可以是數字或 [起, 終]
  function hiss(t, dur, band, { gain = 0.3, q = 1, type = 'bandpass', attack = 0.05, release = 0.2 } = {}) {
    const s = noise(), f = ac.createBiquadFilter(), g = ac.createGain();
    f.type = type;
    f.Q.value = q;
    const [b0, b1] = Array.isArray(band) ? band : [band, band];
    f.frequency.setValueAtTime(b0, t);
    if (b1 !== b0) f.frequency.exponentialRampToValueAtTime(b1, t + dur);
    env(g, t, dur, gain, attack, release);
    s.connect(f).connect(g).connect(out);
    s.start(t, Math.random());
    s.stop(t + dur + 0.05);
  }
  // 一下一下的雜訊（火車「嘁嘁」、螺旋槳「噠噠」、引擎「噗噗」）
  function pulses(t, dur, rate, band, gain = 0.35, len = 0.6) {
    for (let x = 0; x < dur; x += 1 / rate) hiss(t + x, len / rate, band, { gain, attack: 0.005, release: 0.6 / rate });
  }
  // 低沉的引擎聲：鋸齒波＋低頻雜訊，音量一抖一抖
  function engine(t, dur, base = 50, gain = 0.25) {
    const o = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter(), lfo = ac.createOscillator(), lg = ac.createGain();
    o.type = 'sawtooth';
    o.frequency.value = base;
    f.type = 'lowpass';
    f.frequency.value = base * 5;
    lfo.frequency.value = base / 4;
    lg.gain.value = gain * 0.4;
    lfo.connect(lg).connect(g.gain);
    env(g, t, dur, gain, 0.3, 0.4);
    o.connect(f).connect(g).connect(out);
    [o, lfo].forEach((n) => { n.start(t); n.stop(t + dur + 0.1); });
    hiss(t, dur, 120, { gain: gain * 0.8, type: 'lowpass', attack: 0.3, release: 0.4 });
  }
  const beeps = (t, n, freq = 1000, on = 0.25, off = 0.25, gain = 0.18) => {
    for (let i = 0; i < n; i++) tone(t + i * (on + off), on, freq, { type: 'square', gain, lp: 3000 });
  };
  const horn = (t, f1, f2, dur = 0.35, gain = 0.18) => {
    tone(t, dur, f1, { type: 'square', gain, lp: 1800 });
    tone(t, dur, f2, { type: 'square', gain, lp: 1800 });
  };
  const bell = (t, base = 2000, gain = 0.2) => [1, 1.32, 1.76, 2.4].forEach((k, i) => tone(t, 0.9, base * k, { gain: gain / (i + 1), attack: 0.002, release: 0.85 }));
  const melody = (t, notes, step, type = 'triangle', gain = 0.25) => notes.forEach((n, i) => {
    if (n) tone(t + i * step, step * 0.9, 440 * 2 ** ((n - 69) / 12), { type, gain, attack: 0.01, release: step * 0.5 });
  });

  // 每台車的聲音（t = 開始時間）
  const SOUNDS = {
    // 救援：三種不同的警笛
    'fire-truck': (t) => { for (let i = 0; i < 2; i++) { tone(t + i * 1.4, 0.7, [500, 1200], { type: 'sawtooth', gain: 0.16, lp: 2500 }); tone(t + i * 1.4 + 0.7, 0.7, [1200, 500], { type: 'sawtooth', gain: 0.16, lp: 2500 }); } },
    'ladder-truck': (t) => { SOUNDS['fire-truck'](t); horn(t + 2.9, 180, 225, 0.6, 0.2); },
    ambulance: (t) => { for (let i = 0; i < 4; i++) { tone(t + i * 0.7, 0.35, 960, { type: 'triangle', gain: 0.25 }); tone(t + i * 0.7 + 0.35, 0.35, 720, { type: 'triangle', gain: 0.25 }); } },
    'police-car': (t) => { for (let i = 0; i < 6; i++) tone(t + i * 0.45, 0.42, [700, 1500], { type: 'sawtooth', gain: 0.14, lp: 2500 }); },
    'police-motorcycle': (t) => { engine(t, 2.8, 70, 0.18); for (let i = 0; i < 5; i++) tone(t + i * 0.5, 0.45, [800, 1500], { type: 'sawtooth', gain: 0.12, lp: 2500 }); },
    'tow-truck': (t) => { engine(t, 2.6, 45); beeps(t + 0.4, 4, 1100); },
    'rescue-helicopter': (t) => { pulses(t, 2.8, 11, 220, 0.4); hiss(t, 2.8, 2500, { gain: 0.05, q: 0.5 }); },
    helicopter: (t) => { pulses(t, 2.8, 9, 180, 0.42); },

    // 工地：引擎＋倒車的「嗶嗶」聲、油壓、履帶
    excavator: (t) => { engine(t, 2.8, 45); tone(t + 0.6, 1.2, [300, 650], { type: 'sawtooth', gain: 0.07, lp: 1200 }); beeps(t + 1.9, 2, 1050); },
    bulldozer: (t) => { engine(t, 2.8, 38, 0.3); pulses(t + 0.2, 2.4, 6, 900, 0.12, 0.3); },
    crane: (t) => { engine(t, 2.6, 48); tone(t + 0.5, 1.6, [200, 420], { type: 'sawtooth', gain: 0.06, lp: 900 }); },
    'tower-crane': (t) => { tone(t, 2.2, [180, 260], { type: 'sawtooth', gain: 0.08, lp: 900 }); pulses(t + 2.2, 0.4, 5, 1500, 0.2, 0.3); bell(t + 2.4, 900, 0.12); },
    'dump-truck': (t) => { engine(t, 2.4, 42); horn(t + 0.3, 150, 190, 0.7, 0.2); hiss(t + 1.8, 0.5, 3000, { gain: 0.2, type: 'highpass' }); },
    'cement-mixer': (t) => { engine(t, 2.8, 44); for (let i = 0; i < 3; i++) hiss(t + i * 0.9, 0.9, [300, 900], { gain: 0.15 }); },
    'road-roller': (t) => { engine(t, 2.8, 32, 0.3); tone(t, 2.8, 30, { type: 'square', gain: 0.08, lp: 120 }); },
    loader: (t) => { engine(t, 2.6, 50); beeps(t + 0.8, 3, 1000); },
    forklift: (t) => { tone(t, 2.6, [220, 330], { type: 'sawtooth', gain: 0.05, lp: 700 }); beeps(t, 5, 1250, 0.2, 0.3, 0.16); },

    // 馬路上：喇叭「叭叭」、公車煞車「噗嘶」
    car: (t) => { horn(t, 400, 500, 0.2); horn(t + 0.3, 400, 500, 0.35); },
    taxi: (t) => { horn(t, 440, 554, 0.15); horn(t + 0.25, 440, 554, 0.15); horn(t + 0.5, 440, 554, 0.3); },
    bus: (t) => { hiss(t, 0.6, 3500, { gain: 0.3, type: 'highpass', attack: 0.01 }); horn(t + 0.8, 250, 315, 0.7, 0.2); },
    'school-bus': (t) => { horn(t, 290, 365, 0.3); horn(t + 0.45, 290, 365, 0.5); },
    scooter: (t) => { pulses(t, 1.6, 14, 400, 0.18, 0.5); horn(t + 1.7, 620, 760, 0.12, 0.14); horn(t + 1.9, 620, 760, 0.12, 0.14); },
    'delivery-truck': (t) => { engine(t, 1.8, 50, 0.2); horn(t + 1.2, 200, 250, 0.6, 0.2); },
    'camper-van': (t) => { engine(t, 1.6, 55, 0.15); horn(t + 1, 350, 440, 0.4); },
    'street-sweeper': (t) => { engine(t, 2.8, 50, 0.15); for (let i = 0; i < 6; i++) hiss(t + i * 0.45, 0.4, [1500, 4000], { gain: 0.16 }); },
    bicycle: (t) => { bell(t, 2100); bell(t + 0.25, 2100); },
    // 台灣的垃圾車：《給愛麗絲》
    'garbage-truck': (t) => melody(t, [76, 75, 76, 75, 76, 71, 74, 72, 69, 0, 60, 64, 69, 71], 0.22, 'square', 0.12),
    'ice-cream-truck': (t) => melody(t, [72, 76, 79, 84, 79, 76, 72, 0, 74, 77, 81, 79], 0.18, 'sine', 0.3),
    'mail-truck': (t) => { horn(t, 380, 480, 0.25); bell(t + 0.5, 1500, 0.15); },

    // 鐵路
    train: (t) => { horn(t, 311, 392, 0.9, 0.15); pulses(t + 0.9, 1.8, 4, 1200, 0.25, 0.5); },
    // 旅行（環遊地圖）坐車用的輕柔聲音：不叭喇叭、不鳴汽笛，小小聲的，只讓人知道「出發了」
    'ride-rail': (t) => { pulses(t, 1.6, 3, 600, 0.07, 0.5); tone(t, 1.6, 70, { gain: 0.03, attack: 0.3, release: 0.6 }); },
    'ride-road': (t) => { engine(t, 1.4, 45, 0.05); },
    'ride-boat': (t) => { hiss(t, 1.8, 500, { gain: 0.1, type: 'lowpass', attack: 0.5, release: 0.9 }); },
    'ride-air': (t) => { hiss(t, 2, [400, 1100], { gain: 0.09, q: 0.5, attack: 0.8, release: 0.9 }); },
    'high-speed-train': (t) => { hiss(t, 2.6, [200, 2500], { gain: 0.35, q: 0.7, attack: 1, release: 1.2 }); tone(t + 0.2, 2.2, [90, 160], { type: 'sawtooth', gain: 0.05, lp: 400 }); },
    metro: (t) => { melody(t, [76, 72, 76, 72], 0.3, 'sine', 0.25); tone(t + 1.3, 1.4, [300, 900], { type: 'sawtooth', gain: 0.05, lp: 1500 }); },
    'steam-train': (t) => { tone(t, 0.9, 880, { gain: 0.15 }); tone(t, 0.9, 1047, { gain: 0.12 }); hiss(t, 0.9, 2200, { gain: 0.08 }); pulses(t + 1, 2, 3.5, 1800, 0.35, 0.55); },

    // 天空
    airplane: (t) => { hiss(t, 3, [300, 1800], { gain: 0.35, q: 0.5, attack: 1.2, release: 1 }); tone(t, 3, [60, 90], { type: 'sawtooth', gain: 0.05, lp: 300 }); },
    'hot-air-balloon': (t) => { hiss(t, 1.4, 600, { gain: 0.4, type: 'lowpass', attack: 0.1, release: 0.5 }); hiss(t + 1.7, 1, 600, { gain: 0.35, type: 'lowpass', attack: 0.1, release: 0.4 }); },
    rocket: (t) => { [0, 0.4, 0.8].forEach((x, i) => tone(t + x, 0.15, 880 - i * 110, { gain: 0.2 })); hiss(t + 1.2, 2, [150, 900], { gain: 0.5, type: 'lowpass', attack: 0.2, release: 1 }); tone(t + 1.2, 2, [40, 70], { type: 'sawtooth', gain: 0.12, lp: 200 }); },

    // 港口
    ship: (t) => { tone(t, 1.6, 110, { type: 'sawtooth', gain: 0.18, lp: 500, attack: 0.15, release: 0.4 }); tone(t, 1.6, 165, { type: 'sawtooth', gain: 0.1, lp: 500, attack: 0.15, release: 0.4 }); },
    sailboat: (t) => { for (let i = 0; i < 2; i++) hiss(t + i * 1.4, 1.4, 500, { gain: 0.3, type: 'lowpass', attack: 0.6, release: 0.7 }); bell(t + 0.3, 1200, 0.08); },
    'fishing-boat': (t) => { pulses(t, 2.6, 5, 250, 0.3, 0.5); tone(t, 2.6, 55, { type: 'square', gain: 0.05, lp: 200 }); },
    submarine: (t) => { tone(t, 1.2, 1150, { gain: 0.25, attack: 0.005, release: 1.1 }); tone(t + 0.35, 1, 1150, { gain: 0.08, attack: 0.005, release: 0.9 }); tone(t + 1.5, 1.2, 1150, { gain: 0.25, attack: 0.005, release: 1.1 }); },
    speedboat: (t) => { tone(t, 2.5, [120, 320], { type: 'sawtooth', gain: 0.1, lp: 900 }); hiss(t, 2.5, 1500, { gain: 0.15, q: 0.5 }); },

    // 農場
    tractor: (t) => { pulses(t, 2.6, 7, 180, 0.35, 0.6); tone(t, 2.6, 52, { type: 'sawtooth', gain: 0.06, lp: 250 }); },
    'combine-harvester': (t) => { engine(t, 2.8, 46); hiss(t, 2.8, 2500, { gain: 0.1, q: 2 }); },
  };

  return {
    has: (id) => !!SOUNDS[id],
    play(id) {
      if (!SOUNDS[id] || !ctx()) return 0;
      SOUNDS[id](ac.currentTime + 0.05);
      return 3200; // 大約幾毫秒會播完
    },
  };
})();

/* ================= 播放：家長錄音 → 音效檔 → 合成 → 小知識 ================= */

const soundPlayer = new Audio();
let soundTimer = null;
// recordingUrl：呼叫的頁面自己找到的家長錄音網址（沒有就不傳）
// 回傳 { kind: 'audio' | 'synth' | 'fact' | 'none', fact }
function playSound(item, recordingUrl) {
  soundPlayer.pause();
  clearTimeout(soundTimer);
  const file = recordingUrl || (SOUND_FILES[item.id] && `audio/sound/${SOUND_FILES[item.id]}.mp3`);
  if (file) {
    soundPlayer.src = file;
    soundPlayer.play().catch(() => {});
    soundTimer = setTimeout(() => soundPlayer.pause(), 6000); // 太長的叫聲只播 6 秒
    return { kind: 'audio' };
  }
  if (Synth.play(item.id)) return { kind: 'synth' };
  if (SOUND_FACTS[item.id]) return { kind: 'fact', fact: SOUND_FACTS[item.id] };
  return { kind: 'none' };
}
function stopSound() {
  soundPlayer.pause();
  clearTimeout(soundTimer);
}
const hasSound = (item) => !!(SOUND_FILES[item.id] || Synth.has(item.id) || SOUND_FACTS[item.id]);
