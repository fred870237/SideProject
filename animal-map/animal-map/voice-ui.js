// 🔈 給還不識字的小朋友：按到有 data-say 的按鈕，會先用中文唸出它的名字
//   一般按鈕：唸名字，同時照常動作（如果按鈕本身也會說話，就以按鈕的聲音為主）
//   換頁的連結：先唸完名字再換頁
// 家長可以在家長模式關掉（localStorage「voice-ui」= 'off'）
const VoiceUI = (() => {
  const enabled = () => { try { return localStorage.getItem('voice-ui') !== 'off'; } catch { return true; } };
  let voice = null;
  const pick = () => {
    if (!('speechSynthesis' in window)) return;
    const list = speechSynthesis.getVoices().filter((v) => /^zh[-_]TW/i.test(v.lang));
    voice = list.find((v) => v.localService) || list[0] || null;
  };
  if ('speechSynthesis' in window) { pick(); speechSynthesis.addEventListener('voiceschanged', pick); }

  function speak(text) {
    // 預先生成的語音（voice-clips.js）優先，沒有才用系統語音
    if (typeof VoiceClips !== 'undefined' && VoiceClips.play(text, 'zh-TW')) return;
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-TW';
    u.rate = 0.95;
    u.pitch = 1.1;
    if (voice) u.voice = voice;
    speechSynthesis.speak(u);
  }

  // 用「捕捉」階段先處理：先唸名字，按鈕自己的動作再接著做（會說話的動作會蓋過名字）
  document.addEventListener('click', (e) => {
    if (!enabled()) return;
    const el = e.target.closest && e.target.closest('[data-say]');
    if (!el || el.disabled) return;
    speak(el.dataset.say);
    // 換頁的連結：等名字唸完（大約 0.8 秒）再走
    if (el.tagName === 'A' && el.href && !e.defaultPrevented && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const href = el.href;
      setTimeout(() => { location.href = href; }, 800);
    }
  }, true);

  return {
    enabled,
    set(on) { try { localStorage.setItem('voice-ui', on ? 'on' : 'off'); } catch { /* */ } },
    speak,
  };
})();
