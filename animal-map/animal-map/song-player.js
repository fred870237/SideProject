'use strict';

// 兒歌播放器：用 Web Audio 合成溫和的樂器音色（鋼琴、音樂盒、木琴、長笛）＋自動伴奏，歌詞逐字亮起（卡拉 OK 效果），不需要網路

const SongPlayer = (() => {
  const NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const freq = (name) => {
    const m = /^([A-G])(#?)(\d)$/.exec(name);
    const midi = 12 * (Number(m[3]) + 1) + NOTE[m[1]] + (m[2] ? 1 : 0);
    return 440 * 2 ** ((midi - 69) / 12);
  };

  // 把歌詞切成音節，並記住每個音節後面接的是空白還是連字號
  function parseLine(line) {
    const parts = line.t.split(/(\s+|-)/);
    const syl = [];
    for (let i = 0; i < parts.length; i += 2) {
      if (parts[i]) syl.push({ text: parts[i], after: parts[i + 1] === undefined ? '' : (parts[i + 1] === '-' ? '' : ' ') });
    }
    const notes = line.n.trim().split(/\s+/).map((tok) => {
      const [n, d] = tok.split(':');
      return { f: freq(n), beats: d ? Number(d) : 1 };
    });
    if (syl.length !== notes.length) console.warn('音節和音符數量不同：', line.t, syl.length, notes.length);
    return { syl, notes, p: line.p || 0 };
  }

  // 樂器音色：全部用溫和的正弦泛音，再用低通濾波讓聲音變圓，避免刺耳的電子音
  // harm = 各泛音的音量；tau = 自然消失的速度（0 = 持續音）；accomp = 伴奏用的樂器
  const INSTRUMENTS = {
    piano:    { label: '🎹 鋼琴', harm: [1, 0.42, 0.2, 0.1, 0.05, 0.025], attack: 0.005, tau: 0.9, release: 0.12, bright: 6, darken: 0.4, accomp: 'piano' },
    musicbox: { label: '🎶 音樂盒', harm: [1, 0, 0, 0.12, 0, 0, 0, 0.03], attack: 0.003, tau: 0.6, release: 0.35, bright: 9, darken: 0.6, accomp: 'musicbox' },
    marimba:  { label: '🪵 木琴', harm: [1, 0, 0, 0.09], attack: 0.004, tau: 0.3, release: 0.15, bright: 5, darken: 0.15, accomp: 'marimba' },
    flute:    { label: '🪈 長笛', harm: [1, 0.16, 0.05, 0.02], attack: 0.07, tau: 0, sustain: 0.85, release: 0.1, bright: 4, vibrato: true, accomp: 'piano' },
  };
  const INST_ORDER = Object.keys(INSTRUMENTS);

  let ctx = null, bus = null, master = null, vibOsc = null, vibDepth = null;
  let rafId = 0, timeline = [], current = null, speed = 1, ui = null;
  let instName = 'piano';
  try { if (INSTRUMENTS[localStorage.getItem('songInst')]) instName = localStorage.getItem('songInst'); } catch { /* 無痕模式 */ }
  const waves = {};

  function ensureCtx() {
    if (!ctx) {
      // iOS：設成 playback，靜音開關打開時也能聽到兒歌（Safari 16.4 以上）
      try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch { /* 舊版不支援 */ }
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      // 限幅器：很多音同時響也不會超過上限，避免爆音
      const limiter = ctx.createDynamicsCompressor();
      limiter.threshold.value = -14;
      limiter.knee.value = 8;
      limiter.ratio.value = 12;
      limiter.attack.value = 0.003;
      limiter.release.value = 0.25;
      const out = ctx.createGain();
      out.gain.value = 0.9;
      limiter.connect(out).connect(ctx.destination);
      // 小小的房間殘響，讓聲音比較溫暖
      bus = ctx.createGain();
      bus.connect(limiter);
      const len = Math.floor(ctx.sampleRate * 1.8);
      const ir = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const d = ir.getChannelData(ch);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3;
      }
      const verb = ctx.createConvolver();
      verb.buffer = ir;
      const verbTone = ctx.createBiquadFilter();
      verbTone.type = 'lowpass';
      verbTone.frequency.value = 3500;
      const send = ctx.createGain();
      send.gain.value = 0.2;
      bus.connect(send).connect(verb).connect(verbTone).connect(limiter);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function wave(name) {
    if (!waves[name]) {
      const h = INSTRUMENTS[name].harm;
      waves[name] = ctx.createPeriodicWave(new Float32Array(h.length + 1), new Float32Array([0, ...h]));
    }
    return waves[name];
  }

  // 彈一個音：t 開始、dur 秒後放開
  function note(name, t, f, dur, vol, out) {
    const inst = INSTRUMENTS[name];
    const o = ctx.createOscillator();
    o.setPeriodicWave(wave(name));
    o.frequency.value = f;
    if (inst.vibrato && vibDepth) vibDepth.connect(o.detune);
    const flt = ctx.createBiquadFilter();
    flt.type = 'lowpass';
    flt.Q.value = 0.4;
    flt.frequency.setValueAtTime(Math.min(12000, f * inst.bright), t);
    if (inst.darken) flt.frequency.setTargetAtTime(Math.max(600, f * 1.6), t + inst.attack, inst.darken);
    const g = ctx.createGain();
    const peak = t + inst.attack;
    const off = Math.max(peak + 0.02, t + dur);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, peak);
    if (inst.tau) g.gain.setTargetAtTime(0, peak, inst.tau * (f < 260 ? 1.5 : 1));
    else g.gain.setTargetAtTime(vol * inst.sustain, peak, 0.08);
    g.gain.setTargetAtTime(0, off, inst.release);
    o.connect(flt).connect(g).connect(out);
    o.start(t);
    o.stop(off + inst.release * 6);
  }

  // ---------- 自動配和弦：每小節從 I、IV、V 裡挑最符合旋律的 ----------
  const CHORDS = {
    I: { pcs: [0, 4, 7], tones: [52, 55, 60], root: 48 },
    IV: { pcs: [5, 9, 0], tones: [53, 57, 60], root: 53 },
    V: { pcs: [7, 11, 2, 5], tones: [50, 55, 59], root: 43 },
  };
  const midiOf = (f) => Math.round(69 + 12 * Math.log2(f / 440));
  const hz = (m) => 440 * 2 ** ((m - 69) / 12);

  function pickChord(notes, from, to, key, prev) {
    let best = null, bestScore = -1;
    for (const [name, ch] of Object.entries(CHORDS)) {
      let score = 0;
      for (const n of notes) {
        const overlap = Math.min(to, n.at + n.beats) - Math.max(from, n.at);
        if (overlap <= 0) continue;
        const pc = ((midiOf(n.f) - key) % 12 + 12) % 12;
        if (ch.pcs.includes(pc)) score += overlap + (n.at <= from + 0.01 ? 0.5 : 0);
      }
      if (name === prev) score += 0.2;
      if (name === 'I') score += 0.1;
      if (score > bestScore) { best = name; bestScore = score; }
    }
    return best;
  }

  // 伴奏：每小節第一拍彈低音，後半小節彈和弦（像「蹦－恰」）
  function accompany(line, t0, spb, key, prev, isLast, name, out) {
    const meter = current.song.meter || 2;
    const total = line.notes.reduce((a, n) => a + n.beats, 0);
    let at = 0;
    const notes = line.notes.map((n) => { const r = { ...n, at }; at += n.beats; return r; });
    const shift = key > 5 ? key - 12 : key;
    for (let b = line.p; b < total - 0.01; b += meter) {
      const end = Math.min(total, b + meter);
      const chord = isLast && end >= total - 0.01 ? 'I' : pickChord(notes, b, end, key, prev);
      prev = chord;
      const ch = CHORDS[chord];
      let root = ch.root + shift;
      if (root < 43) root += 12;
      note(name, t0 + b * spb, hz(root), (end - b) * spb * 0.95, 0.16, out);
      const half = meter / 2;
      if (end - b > half) {
        ch.tones.forEach((m) => note(name, t0 + (b + half) * spb, hz(m + shift), (end - b - half) * spb * 0.9, 0.06, out));
      }
    }
    return prev;
  }

  function stop() {
    cancelAnimationFrame(rafId);
    if (master) {
      const m = master, v = vibOsc;
      m.gain.setTargetAtTime(0, ctx.currentTime, 0.03);
      setTimeout(() => { m.disconnect(); if (v) v.stop(); }, 250);
      master = null;
      vibOsc = vibDepth = null;
    }
    timeline = [];
    if (ui) {
      ui.lyrics.querySelectorAll('.on, .done').forEach((el) => el.classList.remove('on', 'done'));
      setPlayingUI(false);
    }
  }

  function play() {
    if (!current) return;
    stop();
    ensureCtx();
    master = ctx.createGain();
    master.connect(bus);
    const inst = INSTRUMENTS[instName];
    if (inst.vibrato) { // 長笛的輕微顫音
      vibOsc = ctx.createOscillator();
      vibOsc.frequency.value = 5;
      vibDepth = ctx.createGain();
      vibDepth.gain.value = 8; // 音分
      vibOsc.connect(vibDepth);
      vibOsc.start();
    }
    const spb = 60 / (current.song.bpm * speed);
    const key = current.song.key || 0;
    let t = ctx.currentTime + 0.15;
    const start = t;
    timeline = [];
    let prev = 'I';
    current.parsed.forEach((line, li) => {
      prev = accompany(line, t, spb, key, prev, li === current.parsed.length - 1, inst.accomp, master);
      line.notes.forEach((n, ni) => {
        note(instName, t, n.f, n.beats * spb * 0.98, 0.3, master);
        timeline.push({ t, li, ni });
        t += n.beats * spb;
      });
      t += spb * 0.25; // 行與行之間稍微停一下，方便跟唱
    });
    const end = t + 0.8;
    setPlayingUI(true);
    const tick = () => {
      if (!master) return;
      const now = ctx.currentTime;
      let idx = -1;
      for (let i = 0; i < timeline.length && timeline[i].t <= now; i++) idx = i;
      highlight(idx);
      if (now >= end) { stop(); highlight(-1); return; }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return start;
  }

  let lastIdx = -2;
  function highlight(idx) {
    if (idx === lastIdx || !ui) return;
    lastIdx = idx;
    const spans = ui.lyrics.querySelectorAll('.syl');
    spans.forEach((s, i) => {
      s.classList.toggle('on', i === idx);
      s.classList.toggle('done', i < idx);
    });
    if (idx >= 0) {
      const line = spans[idx].closest('.lyric-line');
      ui.lyrics.querySelectorAll('.lyric-line').forEach((l) => l.classList.toggle('active', l === line));
      line.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }

  function setPlayingUI(on) {
    ui.play.textContent = on ? '⏹ 停止' : '▶ 播放';
    ui.play.classList.toggle('playing', on);
  }

  function renderList() {
    ui.list.innerHTML = '';
    SONGS.forEach((song) => {
      const b = document.createElement('button');
      b.className = 'song-item';
      b.innerHTML = `<span class="song-icon"></span><span class="song-name"><b></b><small></small></span>`;
      b.querySelector('.song-icon').textContent = song.icon;
      b.querySelector('b').textContent = song.title;
      b.querySelector('small').textContent = song.zh;
      b.addEventListener('click', () => open(song));
      ui.list.append(b);
    });
  }

  function open(song) {
    stop();
    current = { song, parsed: song.lines.map(parseLine) };
    ui.title.textContent = `${song.icon} ${song.title}`;
    ui.lyrics.innerHTML = '';
    current.parsed.forEach((line) => {
      const div = document.createElement('div');
      div.className = 'lyric-line';
      line.syl.forEach((s) => {
        const span = document.createElement('span');
        span.className = 'syl';
        span.textContent = s.text;
        div.append(span);
        if (s.after) div.append(document.createTextNode(s.after));
      });
      ui.lyrics.append(div);
    });
    lastIdx = -2;
    ui.list.classList.add('hidden');
    ui.player.classList.remove('hidden');
    ui.lyrics.scrollTop = 0;
    play();
  }

  function backToList() {
    stop();
    current = null;
    ui.player.classList.add('hidden');
    ui.list.classList.remove('hidden');
  }

  function init(onOpen) {
    ui = {
      modal: document.getElementById('songs'),
      list: document.getElementById('songList'),
      player: document.getElementById('songPlayer'),
      title: document.getElementById('songTitle'),
      lyrics: document.getElementById('songLyrics'),
      play: document.getElementById('songPlay'),
      speed: document.getElementById('songSpeed'),
    };
    renderList();
    document.getElementById('songsBtn').addEventListener('click', () => {
      onOpen();
      ensureCtx();
      ui.modal.classList.remove('hidden');
    });
    document.getElementById('songsClose').addEventListener('click', () => { backToList(); ui.modal.classList.add('hidden'); });
    document.getElementById('songBack').addEventListener('click', backToList);
    ui.play.addEventListener('click', () => (master ? stop() : play()));
    ui.inst = document.getElementById('songInst');
    ui.inst.textContent = INSTRUMENTS[instName].label;
    ui.inst.addEventListener('click', () => {
      instName = INST_ORDER[(INST_ORDER.indexOf(instName) + 1) % INST_ORDER.length];
      ui.inst.textContent = INSTRUMENTS[instName].label;
      try { localStorage.setItem('songInst', instName); } catch { /* 無痕模式 */ }
      if (master) play();
    });
    ui.speed.addEventListener('click', () => {
      speed = speed === 1 ? 0.75 : 1;
      ui.speed.textContent = speed === 1 ? '🐇 正常' : '🐢 慢慢';
      if (master) play();
    });
  }

  return { init, stop };
})();
