"""把兒歌「唱」出來：Windows 英文語音逐音節唸 → 調成旋律的音高與長度 → 混上音樂盒伴奏。

用法：python sing.py <歌曲設定.json> <輸出.wav> <暫存資料夾>
設定檔格式見 twinkle.json；音高調整用 TD-PSOLA（只用 numpy），不需要額外安裝套件。
"""
import json, math, os, subprocess, sys, wave
import numpy as np

SR = 22050
NOTE = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}


def freq(name):
    midi = 12 * (int(name[-1]) + 1) + NOTE[name[0]] + (1 if '#' in name else 0)
    return 440 * 2 ** ((midi - 69) / 12)


def read_wav(path):
    with wave.open(path) as w:
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768
    return x


def write_wav(path, x):
    x = np.clip(x, -1, 1)
    with wave.open(path, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


# ---------- 1. 用 Windows 語音產生每個音節 ----------

def tts_all(words, voice, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    todo = [w for w in words if not os.path.exists(os.path.join(out_dir, f'{w}.wav'))]
    if not todo:
        return
    lines = [
        'Add-Type -AssemblyName System.Speech',
        '$s = New-Object System.Speech.Synthesis.SpeechSynthesizer',
        f"$s.SelectVoice('{voice}')",
        '$s.Rate = -2',
        '$fmt = New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(22050, [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen, [System.Speech.AudioFormat.AudioChannel]::Mono)',
    ]
    for w in todo:
        p = os.path.join(out_dir, f'{w}.wav').replace("'", "''")
        lines += [f"$s.SetOutputToWaveFile('{p}', $fmt)", f"$s.Speak('{w}')"]
    lines.append('$s.SetOutputToNull()')
    script = os.path.join(out_dir, 'tts.ps1')
    with open(script, 'w', encoding='utf-8-sig') as f:
        f.write('\n'.join(lines))
    subprocess.run(['powershell', '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', script], check=True)


def trim(x, thr=0.02):
    idx = np.where(np.abs(x) > thr)[0]
    if len(idx) == 0:
        return x
    a, b = max(0, idx[0] - 200), min(len(x), idx[-1] + 400)
    return x[a:b]


# ---------- 2. 音高偵測 + TD-PSOLA 調音 ----------

def pitch_track(x, hop=110, win=882, fmin=120, fmax=420):
    """每 5ms 一格：回傳 (每格週期[樣本數] 或 0 表示無聲)"""
    lo, hi = int(SR / fmax), int(SR / fmin)
    periods = []
    for start in range(0, max(1, len(x) - win), hop):
        f = x[start:start + win] * np.hanning(win)
        if np.sqrt(np.mean(f ** 2)) < 0.01:
            periods.append(0); continue
        ac = np.correlate(f, f, 'full')[win - 1:]
        ac /= ac[0] + 1e-9
        lag = lo + int(np.argmax(ac[lo:hi]))
        periods.append(lag if ac[lag] > 0.45 else 0)
    return np.array(periods), hop


def analysis_marks(x, periods, hop):
    marks, t = [], 0
    while t < len(x):
        k = min(len(periods) - 1, t // hop)
        p = periods[k] if periods[k] else 110
        if periods[k]:  # 對齊到局部最大值，讓每個顆粒以聲門脈衝為中心
            seg = x[t:t + p]
            if len(seg):
                t = t + int(np.argmax(np.abs(seg)))
        marks.append((t, p, bool(periods[k])))
        t += p
    return marks


def sing_syllable(x, f_target, dur, vib=True):
    """把一個音節調到 f_target 並拉長/縮短到 dur 秒"""
    periods, hop = pitch_track(x)
    marks = analysis_marks(x, periods, hop)
    voiced = [m[0] for m in marks if m[2]]
    n_out = int(dur * SR)
    if not voiced:
        out = np.zeros(n_out); out[:min(len(x), n_out)] = x[:n_out]; return out
    v0, v1 = voiced[0], voiced[-1]
    head = v0 + int(0.03 * SR)                 # 開頭子音保持原速
    tail = len(x) - v1                         # 結尾子音保持原速
    body_out = max(1, n_out - head - tail)
    body_in = max(1, v1 - head)

    def warp(ts):  # 輸出時間 → 原始時間
        if ts < head:
            return ts
        if ts < head + body_out:
            return head + (ts - head) * body_in / body_out
        return v1 + (ts - head - body_out)

    out = np.zeros(n_out + 2000)
    mark_t = np.array([m[0] for m in marks])
    ts = 0.0
    while ts < n_out:
        ta = warp(ts)
        i = int(np.argmin(np.abs(mark_t - ta)))
        t, p, is_v = marks[i]
        if is_v:
            f = f_target
            if vib and ts / SR > 0.22:
                f *= 1 + 0.012 * math.sin(2 * math.pi * 5.5 * ts / SR)
            step = SR / f
        else:
            step = p
        a, b = t - p, t + p
        if a >= 0 and b <= len(x):
            grain = x[a:b] * np.hanning(b - a)
            s = int(ts) - p
            if s >= 0:
                out[s:s + len(grain)] += grain
        ts += step
    out = out[:n_out]
    fade = min(len(out) // 4, int(0.02 * SR))
    if fade > 0:
        out[:fade] *= np.linspace(0, 1, fade)
        out[-fade:] *= np.linspace(1, 0, fade)
    return out


# ---------- 3. 音樂盒伴奏（和 app 內的播放器同樣的音色與時間） ----------

def pluck(buf, t0, f, dur):
    n = int(max(0.6, dur * 1.7) * SR)
    t = np.arange(n) / SR
    env = np.minimum(t / 0.008, 1) * np.exp(-t * 6.9 / max(0.5, dur * 1.6))
    tone = np.sin(2 * np.pi * f * t) + 0.28 * np.sin(4 * np.pi * f * t) + 0.08 * (2 / np.pi) * np.arcsin(np.sin(6 * np.pi * f * t))
    s = int(t0 * SR)
    seg = (0.32 * env * tone)[:max(0, len(buf) - s)]
    buf[s:s + len(seg)] += seg


def bass(buf, t0, f, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    env = np.minimum(t / 0.02, 1) * np.exp(-t * 6.9 / dur)
    tone = (2 / np.pi) * np.arcsin(np.sin(np.pi * f * t))
    s = int(t0 * SR)
    seg = (0.12 * env * tone)[:max(0, len(buf) - s)]
    buf[s:s + len(seg)] += seg


def main(spec_path, out_path, tmp_dir):
    spec = json.load(open(spec_path, encoding='utf-8'))
    spb = 60 / spec['bpm']
    lines = []
    for ln in spec['lines']:
        notes = []
        for tok in ln['n'].split():
            name, _, d = tok.partition(':')
            notes.append((freq(name), float(d) if d else 1.0))
        sings = ln['sing'].split()
        assert len(sings) == len(notes), (ln['sing'], len(sings), len(notes))
        lines.append(list(zip(sings, notes)))

    words = sorted({w for ln in lines for w, _ in ln})
    tts_all(words, spec.get('voice', 'Microsoft Zira Desktop'), tmp_dir)
    raw = {w: trim(read_wav(os.path.join(tmp_dir, f'{w}.wav'))) for w in words}

    total = 0.15 + sum(sum(n[1] for _, n in ln) * spb + spb * 0.25 for ln in lines) + 2
    voice = np.zeros(int(total * SR))
    music = np.zeros(int(total * SR))
    t = 0.15
    for ln in lines:
        line_beats = sum(n[1] for _, n in ln)
        bass(music, t, ln[0][1][0], line_beats * spb * 0.9)
        for w, (f, beats) in ln:
            dur = beats * spb
            pluck(music, t, f, dur)
            sung = sing_syllable(raw[w], f * spec.get('octave', 1), dur * 0.96)
            s = int(t * SR)
            voice[s:s + len(sung)] += sung
            t += dur
        t += spb * 0.25

    voice /= np.max(np.abs(voice)) + 1e-9
    music /= np.max(np.abs(music)) + 1e-9
    mix = 0.78 * voice + 0.42 * music
    mix /= np.max(np.abs(mix)) / 0.9
    end = int((t + 1.2) * SR)
    write_wav(out_path, mix[:end])
    if os.environ.get('SING_VOICE_ONLY'):  # 檢查用：另外輸出純人聲
        write_wav(os.environ['SING_VOICE_ONLY'], 0.9 * voice[:end])
    print('wrote', out_path, f'{end / SR:.1f}s')


if __name__ == '__main__':
    main(*sys.argv[1:4])
