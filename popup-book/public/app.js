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
function speak(text) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
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
    // anim(毫秒, { 零件: { r: 30, tx: 100 } }, 每一格要額外做的事)
    async anim(ms, spec, onStep) {
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
      });
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
      c.setAttribute('stroke', LINE);
      c.setAttribute('stroke-width', '2');
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
              ${scene.items.map((it) => `<g id="${it.id}" class="item" transform="translate(${it.x} ${it.y}) scale(${it.s || 1})">
                ${it.art(it.id)}
                ${it.hint ? `<circle class="hint" cx="${it.hint[0]}" cy="${it.hint[1]}" r="18"/>` : ''}
              </g>`).join('')}
              ${scene.front ? scene.front() : ''}
              <g id="fx"></g>
              <rect x="${scene.w / 2 - 30}" y="0" width="60" height="${scene.h}" fill="url(#fold)" pointer-events="none"/>
            </g>
          </svg>
          <div id="label" class="label hidden"></div>
        </div>
      </div>
    </div>`;

  const fx = makeFx(document.getElementById('fx'));
  scene.items.forEach((it) => {
    const el = document.getElementById(it.id);
    const c = makeCtx(it, el, fx);
    if (it.setup) it.setup(c);
    el.addEventListener('click', () => play(it, el, c));
  });
}

// 點一台車：唸英文名字、出現名牌，然後動起來（動作還沒做完再點，只唸名字）
async function play(it, el, c) {
  speak(it.en);
  showLabel(it, el);
  if (el.dataset.busy) return;
  el.dataset.busy = '1';
  el.querySelector('.hint')?.remove();
  await wait(350);
  try {
    await it.act(c);
  } catch (err) {
    console.error(err);
  } finally {
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

// ---------- 換頁 ----------
function route() {
  const [themeId, pageId] = location.hash.replace(/^#\/?/, '').split('/');
  const theme = THEMES.find((t) => t.id === themeId);
  const page = theme && theme.pages.find((p) => p.id === pageId);
  if (page && isReady(page)) showScene(theme, page);
  else if (theme && theme.pages.some(isReady)) showTheme(theme);
  else showHome();
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);
route();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
