'use strict';
// 機關書：書架（主題）→ 一本書的目錄 → 一頁一個場景
// 點場景裡的車子：先唸英文名字，再像機關書一樣動起來（每台車的動作寫在 art/<頁面>.js 的 act）
// 網址：#/ 書架、#/vehicles 目錄、#/vehicles/construction 場景

const SVGNS = 'http://www.w3.org/2000/svg';
const app = document.getElementById('app');
const isReady = (page) => !!SCENES[page.id];

// ---------- 說英文 ----------
let voices = [];
function loadVoices() { voices = 'speechSynthesis' in window ? speechSynthesis.getVoices() : []; }
if ('speechSynthesis' in window) {
  loadVoices();
  speechSynthesis.addEventListener('voiceschanged', loadVoices);
}
function pickVoice() {
  const en = voices.filter((v) => /^en[-_]US/i.test(v.lang));
  return en.find((v) => v.localService) || en[0] || voices.find((v) => /^en/i.test(v.lang)) || null;
}
// 預先錄好的語音（Qwen3-TTS 生成，見 tools/voice/）：清單在 voices.js，檔名 audio/en/<slug>.mp3
// 用 Web Audio 播：第一次點的時候解鎖，之後動作裡晚一點才唸的音效也能播（iOS 的 <audio> 離開點擊就不讓播）
const voiceSlug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const recorded = new Set(self.VOICES || []);
let actx = null, clipEnd = 0, clipGen = 0, clipSrcs = [];
const clipBufs = {};
// iPhone 靜音鍵打開時 Web Audio 預設不出聲，設成 playback 跟瀏覽器語音一樣照樣唸
if (navigator.audioSession) navigator.audioSession.type = 'playback';
function audioCtx() {
  const C = window.AudioContext || window.webkitAudioContext;
  if (!actx && C) actx = new C();
  if (actx && actx.state === 'suspended') actx.resume();
  return actx;
}
function loadClip(slug) {
  const c = audioCtx();
  if (!c) return Promise.reject(new Error('no Web Audio'));
  return (clipBufs[slug] ||= fetch(`audio/en/${slug}.mp3`)
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
    .then((b) => new Promise((ok, bad) => c.decodeAudioData(b, ok, bad)))
    .catch((err) => { delete clipBufs[slug]; throw err; }));
}
// ---------- 合成的音效（警笛、垃圾車音樂）：不用音檔，Web Audio 現場產生 ----------
let sfxNodes = [];
function stopSfx() {
  sfxNodes.forEach((n) => { try { n.stop(); } catch { /* 已經停了 */ } });
  sfxNodes = [];
}
// 音量包絡：淡入、維持、淡出
function envelope(c, t0, dur, vol) {
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.06);
  g.gain.setValueAtTime(vol, Math.max(t0 + 0.06, t0 + dur - 0.12));
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  return g;
}
// 警笛：高低兩個音交替
//   ambulance：台灣救護車「歐咿、歐咿」，低音先、每個音約 0.45 秒
//   police：警車「嗚—嗚—嗚—」，高低音很快地交替（每個音約 0.2 秒），音跟音之間有一點滑音
function siren(kind, ms) {
  const c = audioCtx();
  if (!c) return;
  const t0 = c.currentTime + 0.03, dur = ms / 1000;
  const [first, second, step, glide] = kind === 'police' ? [1080, 700, 0.21, 0.05] : [760, 960, 0.45, 0.025];
  const osc = c.createOscillator();
  osc.type = 'sawtooth';
  for (let t = 0, i = 0; t < dur; t += step, i++) osc.frequency.setTargetAtTime(i % 2 ? second : first, t0 + t, glide);
  const lp = c.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 2400;
  osc.connect(lp).connect(envelope(c, t0, dur, 0.08)).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
  sfxNodes.push(osc);
}
// 船笛「嗚——」：兩個低音（差五度）疊在一起，blasts 是每一聲的 [開始秒數, 長度秒數]
function horn(blasts, pitch = 110) {
  const c = audioCtx();
  if (!c) return;
  const t0 = c.currentTime + 0.03;
  blasts.forEach(([at, dur]) => {
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 900;
    lp.connect(envelope(c, t0 + at, dur, 0.12)).connect(c.destination);
    [pitch, pitch * 1.5].forEach((f) => {
      const osc = c.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = f;
      osc.connect(lp);
      osc.start(t0 + at);
      osc.stop(t0 + at + dur + 0.05);
      sfxNodes.push(osc);
    });
  });
}
// 用方波彈一段旋律（像垃圾車喇叭放的電子音樂）：notes = [[第幾拍, MIDI 音高], ...]，每個音延續到下一個音開始
function playTune(notes, bpm, endBeats = 2) {
  const c = audioCtx();
  if (!c) return 0;
  const beat = 60 / bpm, t0 = c.currentTime + 0.05;
  notes.forEach(([b, m], i) => {
    const next = notes[i + 1] ? notes[i + 1][0] : b + endBeats;
    const start = t0 + b * beat, dur = Math.max(0.08, (next - b) * beat - 0.04);
    const osc = c.createOscillator();
    osc.type = 'square';
    osc.frequency.value = 440 * 2 ** ((m - 69) / 12);
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 1800;
    osc.connect(lp).connect(envelope(c, start, dur, 0.06)).connect(c.destination);
    osc.start(start);
    osc.stop(start + dur + 0.02);
    sfxNodes.push(osc);
  });
  return (notes[notes.length - 1][0] + endBeats) * beat * 1000; // 整段要幾毫秒
}

function stopClips() {
  stopSfx();
  clipGen++;
  clipSrcs.forEach((s) => { try { s.stop(); } catch { /* 已經停了 */ } });
  clipSrcs = [];
  clipEnd = 0;
}
// queue: true 是車子動作裡的音效（Honk honk、Ice cream…），排在車名後面唸，不要把還沒唸完的車名切掉
function speak(text, { queue = false } = {}) {
  if (!queue) {
    stopClips();
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  }
  const slug = voiceSlug(text);
  if (recorded.has(slug) && audioCtx()) {
    const gen = clipGen;
    loadClip(slug).then((buf) => {
      if (gen !== clipGen) return; // 等載入的時候又點了別的車
      const c = audioCtx();
      const src = c.createBufferSource();
      src.buffer = buf;
      src.connect(c.destination);
      const t = Math.max(c.currentTime, clipEnd);
      src.start(t);
      clipEnd = t + buf.duration;
      clipSrcs.push(src);
      src.onended = () => { clipSrcs = clipSrcs.filter((s) => s !== src); };
    }).catch(() => { if (gen === clipGen) speakTTS(text); }); // 沒網路又沒快取到：退回瀏覽器語音
    return;
  }
  speakTTS(text);
}
function speakTTS(text) {
  if (!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = 0.85;
  u.pitch = 1.1;
  const v = pickVoice();
  if (v) u.voice = v;
  speechSynthesis.speak(u);
}

// ---------- 動畫小工具 ----------
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const lerp = (a, b, t) => a + (b - a) * t;
const rand = ([a, b]) => a + Math.random() * (b - a);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
function tween(ms, fn, easing = ease) {
  return new Promise((resolve) => {
    const t0 = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - t0) / ms);
      fn(easing(t));
      if (t < 1) requestAnimationFrame(step); else resolve();
    };
    requestAnimationFrame(step);
  });
}

// 每台車的「操作盒」：用零件名字（<車子id>-<零件名>）轉動、移動、淡入淡出
// 零件狀態：r 旋轉角度、tx/ty 位移、sx/sy 縮放、o 透明度；轉軸用 item.pivots[零件名]，輪子用 data-cx / data-cy
function makeCtx(it, el, fx) {
  const parts = {};
  const part = (name) => {
    if (parts[name]) return parts[name];
    const e = el.querySelector(`#${it.id}-${name}`);
    if (!e) throw new Error(`${it.id}：找不到零件 ${name}`);
    const pv = (it.pivots && it.pivots[name]) || [Number(e.dataset.cx) || 0, Number(e.dataset.cy) || 0];
    const o = e.getAttribute('opacity');
    return (parts[name] = { e, r: 0, tx: 0, ty: 0, sx: 1, sy: 1, o: o === null ? 1 : Number(o), px: pv[0], py: pv[1] });
  };
  const apply = (p) => {
    p.e.setAttribute('transform',
      `translate(${p.tx} ${p.ty}) translate(${p.px} ${p.py}) rotate(${p.r}) scale(${p.sx} ${p.sy}) translate(${-p.px} ${-p.py})`);
    p.e.setAttribute('opacity', p.o);
  };
  return {
    state: {},
    tween,
    wait,
    el: (name) => part(name).e,
    get: part,
    set(name, props) { const p = part(name); Object.assign(p, props); apply(p); },
    // anim(毫秒, { 零件: { r: 30, tx: 100 } }, 每一格要額外做的事, 速度曲線（預設慢－快－慢）)
    async anim(ms, spec, onStep, easing = ease) {
      const keys = Object.keys(spec);
      const from = {};
      keys.forEach((k) => { const p = part(k); from[k] = {}; for (const prop in spec[k]) from[k][prop] = p[prop]; });
      await tween(ms, (t) => {
        keys.forEach((k) => {
          const p = part(k);
          for (const prop in spec[k]) p[prop] = lerp(from[k][prop], spec[k][prop], t);
          apply(p);
        });
        if (onStep) onStep(t);
      }, easing);
    },
    // 這台車所有輪子再轉 deg 度（給 anim 用）
    wheels(deg) {
      const out = {};
      el.querySelectorAll('.wheel').forEach((w) => {
        const name = w.id.slice(it.id.length + 1);
        out[name] = { r: part(name).r + deg };
      });
      return out;
    },
    // 從零件上的某一點噴出土、水泥、水花
    burst(name, x, y, opts) { fx.burst(part(name).e, x, y, opts); },
  };
}

// 噴出來的小顆粒（土、水泥）：畫在場景最上層，自己往下掉、慢慢消失
function makeFx(layer) {
  const list = [];
  let running = false;
  function burst(e, x, y, { n = 10, color = '#a8743f', size = [4, 9], vx = [-1.5, 1.5], vy = [-3, -0.5], g = 0.3, life = 900 } = {}) {
    const m = layer.getCTM().inverse().multiply(e.getCTM());
    const pt = new DOMPoint(x, y).matrixTransform(m);
    for (let i = 0; i < n; i++) {
      const c = document.createElementNS(SVGNS, 'circle');
      c.setAttribute('r', rand(size).toFixed(1));
      c.setAttribute('fill', color);
      layer.appendChild(c);
      list.push({ c, x: pt.x, y: pt.y, vx: rand(vx), vy: rand(vy), g, t0: performance.now(), life });
    }
    if (!running) { running = true; requestAnimationFrame(tick); }
  }
  function tick(now) {
    for (let i = list.length - 1; i >= 0; i--) {
      const p = list[i];
      const age = now - p.t0;
      if (age > p.life) { p.c.remove(); list.splice(i, 1); continue; }
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.c.setAttribute('cx', p.x.toFixed(1));
      p.c.setAttribute('cy', p.y.toFixed(1));
      p.c.setAttribute('opacity', Math.min(1, (p.life - age) / (p.life * 0.3)).toFixed(2));
    }
    if (list.length) requestAnimationFrame(tick); else running = false;
  }
  return { burst };
}

// ---------- 畫面：書架 ----------
function showHome() {
  document.title = '機關書';
  app.innerHTML = `
    <div class="home">
      <h1>📖 機關書 <small>Pop-up Book</small></h1>
      <div class="shelf">
        ${THEMES.map((t) => {
          const ready = t.pages.some(isReady);
          return `<a class="cover${ready ? '' : ' soon'}" ${ready ? `href="#/${t.id}"` : ''} style="--c:${t.color}">
            <span class="cover-icon">${t.icon}</span>
            <b>${t.zh}</b><small>${t.en}</small>
            ${ready ? '' : '<em>敬請期待</em>'}
          </a>`;
        }).join('')}
      </div>
    </div>`;
}

// ---------- 畫面：一本書的目錄 ----------
function showTheme(theme) {
  document.title = `${theme.zh} - 機關書`;
  app.innerHTML = `
    <div class="toc" style="--c:${theme.color}">
      <header class="bar">
        <a class="round" href="#/" aria-label="回書架">🏠</a>
        <h2>${theme.icon} ${theme.zh}<small>${theme.en}</small></h2>
      </header>
      <div class="pages">
        ${theme.pages.map((p) => {
          const ready = isReady(p);
          return `<a class="page-card${ready ? '' : ' soon'}" ${ready ? `href="#/${theme.id}/${p.id}"` : ''}>
            <span class="page-icon">${p.icon}</span>
            <b>${p.zh}</b><small>${p.en}</small>
            ${ready ? '' : '<em>敬請期待</em>'}
          </a>`;
        }).join('')}
      </div>
    </div>`;
}

// ---------- 畫面：場景 ----------
let labelTimer = 0;

function showScene(theme, page) {
  const scene = SCENES[page.id];
  const ready = theme.pages.filter(isReady);
  const i = ready.indexOf(page);
  const prev = ready[i - 1], next = ready[i + 1];
  document.title = `${page.zh} - 機關書`;
  app.innerHTML = `
    <div class="scene-view" style="--c:${theme.color}">
      <header class="bar">
        <a class="round" href="#/${theme.id}" aria-label="回目錄">⬅</a>
        <h2>${page.en}<small>${page.zh}</small></h2>
        <span class="spacer"></span>
        ${prev ? `<a class="round" href="#/${theme.id}/${prev.id}" aria-label="上一頁">◀</a>` : ''}
        ${next ? `<a class="round" href="#/${theme.id}/${next.id}" aria-label="下一頁">▶</a>` : ''}
      </header>
      <div class="stage">
        <div class="book">
          <svg id="scene" viewBox="0 0 ${scene.w} ${scene.h}" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="fold" x1="0" x2="1">
                <stop offset="0" stop-color="#000" stop-opacity="0"/>
                <stop offset=".5" stop-color="#000" stop-opacity=".12"/>
                <stop offset="1" stop-color="#000" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <g id="root">
              ${scene.bg()}
              ${scene.items.map((it) => `<g id="${it.id}" class="item" transform="${baseXf(it)}">
                ${it.art(it.id)}
                ${it.hint ? `<circle class="hint" cx="${it.hint[0]}" cy="${it.hint[1]}" r="${18 / (it.s || 1)}" style="stroke-width:${6 / (it.s || 1)}"/>` : ''}
              </g>`).join('')}
              ${scene.front ? scene.front() : ''}
              <g id="tags">${scene.items.map((it) => `<text class="tag" data-for="${it.id}">${it.en.toLowerCase()}</text>`).join('')}</g>
              <rect id="dim" width="${scene.w}" height="${scene.h}" opacity="0" pointer-events="none"/>
              <g id="fx"></g>
              <rect x="${scene.w / 2 - 30}" y="0" width="60" height="${scene.h}" fill="url(#fold)" pointer-events="none"/>
            </g>
          </svg>
          <div id="label" class="label hidden"></div>
        </div>
      </div>
    </div>`;

  const fx = makeFx(document.getElementById('fx'));
  // 先把這一頁的車名語音載進來，第一次點才不會慢半拍
  scene.items.forEach((it) => { if (recorded.has(voiceSlug(it.en))) loadClip(voiceSlug(it.en)).catch(() => {}); });
  scene.items.forEach((it) => {
    const el = document.getElementById(it.id);
    const c = makeCtx(it, el, fx);
    if (it.setup) it.setup(c);
    el.addEventListener('click', () => play(it, el, c, scene));
  });
  placeTags(scene);
}

// 車子在場景裡的位置：可以有傾斜角度 r（例如停在土堆上斜斜的）
const baseXf = (it) => `translate(${it.x} ${it.y}) rotate(${it.r || 0}) scale(${it.s || 1})`;

// 英文小標籤（像書上印的小字）：預設放在車子正下方，it.tag = [x, y] 可以指定場景座標
function placeTags(scene) {
  const root = document.getElementById('root');
  scene.items.forEach((it) => {
    const t = root.querySelector(`.tag[data-for="${it.id}"]`);
    let [x, y] = it.tag || [];
    if (it.tag === undefined) {
      const b = sceneBox(document.getElementById(it.id), root);
      x = (b.x0 + b.x1) / 2;
      y = Math.min(scene.h - 14, b.y1 + 28);
    }
    t.setAttribute('x', x);
    t.setAttribute('y', y);
  });
}
// 元素在場景座標裡的外框
function sceneBox(el, root) {
  const b = el.getBBox();
  const m = root.getCTM().inverse().multiply(el.getCTM());
  const pts = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]]
    .map(([x, y]) => new DOMPoint(x, y).matrixTransform(m));
  return {
    x0: Math.min(...pts.map((p) => p.x)), x1: Math.max(...pts.map((p) => p.x)),
    y0: Math.min(...pts.map((p) => p.y)), y1: Math.max(...pts.map((p) => p.y)),
  };
}

// 焦點模式：點到的車子轉正、放大移到畫面中間，其他東西變暗，在前面做動作，做完再回原位
// 從原位到中間的過程中，車子（外框中心）沿直線移動，同時轉正、放大
async function focus(it, el, scene, into) {
  const root = document.getElementById('root');
  const dim = document.getElementById('dim');
  const fxLayer = document.getElementById('fx');
  // it.box = [x, y, 寬, 高]（地面 = 0 的座標）可以指定要放大的範圍；沒指定就用整台車的外框
  const b = it.box ? { x: it.box[0], y: it.box[1], width: it.box[2], height: it.box[3] } : el.getBBox();
  const bc = [b.x + b.width / 2, b.y + b.height / 2];
  const s0 = it.s || 1, r0 = it.r || 0, rad = (r0 * Math.PI) / 180;
  const c0 = [it.x + s0 * (Math.cos(rad) * bc[0] - Math.sin(rad) * bc[1]), it.y + s0 * (Math.sin(rad) * bc[0] + Math.cos(rad) * bc[1])];
  const s1 = Math.min(s0 * 3.5, Math.max(s0, Math.min((scene.w * 0.86) / b.width, (scene.h * 0.78) / b.height)));
  const c1 = [scene.w / 2, scene.h * 0.54];
  const xf = (t) => `translate(${lerp(c0[0], c1[0], t)} ${lerp(c0[1], c1[1], t)}) rotate(${lerp(r0, 0, t)}) scale(${lerp(s0, s1, t)}) translate(${-bc[0]} ${-bc[1]})`;
  if (into) {
    el._home = el.nextSibling; // 記住原本的前後順序
    root.insertBefore(el, fxLayer); // 移到最上層（變暗的那一層上面）
  }
  await tween(into ? 600 : 550, (t) => {
    const k = into ? t : 1 - t;
    el.setAttribute('transform', xf(k));
    dim.setAttribute('opacity', (k * 0.55).toFixed(3));
  });
  if (!into) {
    el.setAttribute('transform', baseXf(it));
    root.insertBefore(el, el._home);
  }
}

// 點一台車：唸英文名字、出現名牌，跑到前面放大，然後動起來（動作還沒做完再點，只唸名字）
async function play(it, el, c, scene) {
  const busy = document.querySelector('.item[data-busy]');
  if (busy && busy !== el) return; // 別台車正在前面表演，點到後面變暗的車子不理它
  speak(it.en);
  if (busy) { showLabel(it, el); return; }
  el.dataset.busy = 'focus';
  el.querySelector('.hint')?.remove();
  // focus: false 的車子在原地表演（例如消防車要對著背景裡著火的公寓噴水，放大以後就看不到公寓了）
  const zoom = it.focus !== false;
  try {
    if (zoom) await focus(it, el, scene, true);
    showLabel(it, el);
    await wait(zoom ? 150 : 350);
    await it.act(c);
    if (zoom) await wait(350);
  } catch (err) {
    console.error(err);
  } finally {
    if (zoom) await focus(it, el, scene, false);
    delete el.dataset.busy;
  }
}

function showLabel(it, el) {
  const lab = document.getElementById('label');
  const book = lab.parentElement.getBoundingClientRect();
  let lx, ly;
  if (it.label) [lx, ly] = it.label;
  else { const b = el.getBBox(); lx = b.x + b.width / 2; ly = b.y; }
  const pt = new DOMPoint(lx, ly).matrixTransform(el.getScreenCTM());
  lab.innerHTML = `<b>${it.en}</b><small>${it.zh}</small>`;
  lab.classList.remove('hidden', 'pop');
  // 名牌不要超出書的左右邊和上緣
  const half = lab.offsetWidth / 2 + 8;
  lab.style.left = Math.min(book.width - half, Math.max(half, pt.x - book.left)) + 'px';
  lab.style.top = Math.max(lab.offsetHeight + 18, pt.y - book.top) + 'px';
  void lab.offsetWidth;
  lab.classList.add('pop');
  clearTimeout(labelTimer);
  labelTimer = setTimeout(() => lab.classList.add('hidden'), 2600);
}

// ---------- 翻書特效 ----------
// 同一本書換頁時：新的一頁先畫好放在最下面，舊的那一頁做成一張紙，繞著中間的書縫翻過去
// dir = 1 下一頁（右半頁往左翻），-1 上一頁（左半頁往右翻）
// 紙切成 TURN_STRIPS 條直條，一條接在上一條的邊上（巢狀的 3D 轉軸）：外側的紙邊先被掀起來、靠書縫的慢一點跟上，
// 每一條的角度都不一樣，整張紙看起來就是彎的，像真的用手翻書
// 每一條的正面是舊頁的那一小條，背面是新頁對應的那一小條；還沒被紙蓋到的舊半邊先留著，紙落下來才拿掉
// TURN_LAG 越大紙捲得越彎（0.55 會捲成圓筒，0.4 比較像真的紙）
const TURN_STRIPS = 10, TURN_MS = 1000, TURN_LAG = 0.4;

// 翻頁的聲音：用 Web Audio 現場合成（不用音檔）
// 紙張摩擦的「刷——」是一段雜訊，通過一個頻率從高往低滑的帶通濾波器；最後紙落下來加一聲很輕的「啪」
function playFlip(ms = TURN_MS) {
  const c = audioCtx();
  if (!c) return;
  const t0 = c.currentTime, dur = ms / 1000;
  const noise = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate);
  const d = noise.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = noise;
  const band = c.createBiquadFilter();
  band.type = 'bandpass';
  band.Q.value = 0.8;
  band.frequency.setValueAtTime(3800, t0);
  band.frequency.exponentialRampToValueAtTime(900, t0 + dur * 0.85);
  const vol = c.createGain();
  vol.gain.setValueAtTime(0.0001, t0);
  vol.gain.exponentialRampToValueAtTime(0.22, t0 + dur * 0.25);
  vol.gain.setValueAtTime(0.22, t0 + dur * 0.55);
  vol.gain.exponentialRampToValueAtTime(0.0001, t0 + dur * 0.9);
  src.connect(band).connect(vol).connect(c.destination);
  src.start(t0);
  src.stop(t0 + dur);
  // 紙落下來：低頻、很短的一聲
  const thump = c.createBufferSource();
  thump.buffer = noise;
  const low = c.createBiquadFilter();
  low.type = 'lowpass';
  low.frequency.value = 500;
  const tv = c.createGain();
  const tt = t0 + dur * 0.88;
  tv.gain.setValueAtTime(0.0001, tt);
  tv.gain.exponentialRampToValueAtTime(0.35, tt + 0.015);
  tv.gain.exponentialRampToValueAtTime(0.0001, tt + 0.12);
  thump.connect(low).connect(tv).connect(c.destination);
  thump.start(tt, 0, 0.15);
}
function pageTurn(book, oldSvg, dir) {
  const fwd = dir > 0, N = TURN_STRIPS;
  const newSvg = book.querySelector('svg');
  const div = (cls) => Object.assign(document.createElement('div'), { className: cls });
  // 大小都用百分比（一條 = 書寬的 1/2N），剛換頁還沒排版好、或轉向改變書的大小時也不會跑掉
  // svg 的一小條：整頁的 svg 寬 2N 條，往左移 i 條，只露出第 i 條
  const face = (svg, i, cls) => {
    const d = div(`turn-face ${cls}`);
    const s = svg.cloneNode(true);
    s.removeAttribute('id');
    s.style.cssText = `position:absolute;top:0;left:${-i * 100}%;width:${2 * N * 100}%;height:100%`;
    d.append(s, div('shade'));
    return d;
  };
  const under = div(`turn-half ${fwd ? 'left' : 'right'}`);
  const u = oldSvg.cloneNode(true);
  u.removeAttribute('id');
  under.append(u);
  book.append(under);

  const strips = [];
  let parent = book;
  for (let k = 0; k < N; k++) {
    const s = div('turn-strip');
    // 第一條貼著書縫，之後每一條接在上一條的外側（子元素的百分比是相對上一條的寬度）
    const left = k ? (fwd ? '100%' : '-100%') : (fwd ? '50%' : `${50 - 50 / N}%`);
    s.style.cssText = `left:${left};width:${k ? '100%' : `${50 / N}%`};transform-origin:${fwd ? 'left' : 'right'} center`;
    const fi = fwd ? N + k : N - 1 - k; // 舊頁上是第幾條
    const bi = fwd ? N - 1 - k : N + k; // 翻過去以後落在新頁上的第幾條
    s.append(face(oldSvg, fi, 'front'), face(newSvg, bi, 'back'));
    parent.append(s);
    parent = s;
    strips.push({ s, f: s.firstChild.lastChild, b: s.lastChild.lastChild });
  }
  book.classList.add('turning');
  playFlip();
  const smooth =(x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
  return tween(TURN_MS, (t) => {
    let prev = 0;
    strips.forEach(({ s, f, b }, k) => {
      // 外側的條先動（lag 小），靠書縫的晚一點；每一條自己的絕對角度 0 → 180
      const lag = TURN_LAG * (1 - k / (TURN_STRIPS - 1));
      const a = 180 * smooth((t * (1 + TURN_LAG) - lag));
      s.style.transform = `rotateY(${(fwd ? -1 : 1) * (a - prev)}deg)`;
      prev = a;
      // 紙越立起來越暗，翻過去以後背面從暗慢慢變亮
      const dark = Math.sin((a * Math.PI) / 180) * 0.32;
      f.style.opacity = a < 90 ? dark : 0;
      b.style.opacity = a >= 90 ? dark : 0;
    });
  }, (t) => t).then(() => {
    under.remove();
    strips[0].s.remove();
    book.classList.remove('turning');
  });
}

// 在場景上左右滑也可以翻頁（滑動不算點車子）
let swipe = null;
document.addEventListener('pointerdown', (e) => {
  swipe = e.target.closest('.stage') ? { x: e.clientX, y: e.clientY, moved: false } : null;
});
document.addEventListener('pointerup', (e) => {
  if (!swipe) return;
  const dx = e.clientX - swipe.x, dy = e.clientY - swipe.y;
  if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) {
    swipe.moved = true;
    const link = document.querySelector(`.bar a[aria-label="${dx < 0 ? '下一頁' : '上一頁'}"]`);
    if (link) location.hash = link.getAttribute('href');
  }
});
document.addEventListener('click', (e) => {
  if (swipe && swipe.moved) { e.stopPropagation(); e.preventDefault(); swipe = null; }
}, true);

// ---------- 換頁 ----------
let shown = null; // 目前顯示的 { theme, page }
function route() {
  const [themeId, pageId] = location.hash.replace(/^#\/?/, '').split('/');
  const theme = THEMES.find((t) => t.id === themeId);
  const page = theme && theme.pages.find((p) => p.id === pageId);
  stopSfx(); // 換頁的時候停掉還在響的警笛、垃圾車音樂
  if (page && isReady(page)) {
    const last = shown;
    const oldSvg = last && last.theme === theme && last.page && last.page !== page ? document.getElementById('scene') : null;
    showScene(theme, page);
    if (oldSvg && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const ready = theme.pages.filter(isReady);
      pageTurn(document.querySelector('.book'), oldSvg, ready.indexOf(page) > ready.indexOf(last.page) ? 1 : -1);
    }
    shown = { theme, page };
  } else {
    if (theme && theme.pages.some(isReady)) showTheme(theme);
    else showHome();
    shown = { theme };
  }
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);
route();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
