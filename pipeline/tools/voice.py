"""Voice the script sentence by sentence with Kokoro and write timings.

Outputs:
  work/vo/s####.wav       one file per sentence (cached by text hash)
  work/voice.wav          full voiceover with pauses
  work/timeline.json      [{i, sec, para, text, start, end}] in seconds
"""
import json, re, hashlib, os, sys
import numpy as np, soundfile as sf
from num2words import num2words as _n2w

def num2words(*a, **k):
    return _n2w(*a, **k).replace(" and ", " ").replace(",", "")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOICE = os.environ.get("VOICE", "am_michael")
SPEED = float(os.environ.get("SPEED", "1.12"))
SR = 24000
GAP_SENT, GAP_PARA, GAP_SEC = 0.30, 0.65, 1.10
STING_AFTER = {"open": 2.6}   # extra silence for the logo sting

def year(m):
    y = int(m.group(0))
    if 2000 <= y <= 2009:
        return num2words(y)
    return num2words(y, to="year")

def normalize(t):
    t = t.replace("U.S.", "U S").replace("FTC", "F T C").replace("IPO", "I P O")
    t = t.replace("SUVs", "S U Vs").replace("Take 5", "Take Five").replace("CoStar", "Co-Star")
    t = t.replace("…", ".").replace("—", ", ")
    t = re.sub(r"\b(\d+)(st|nd|rd|th)\b", lambda m: num2words(int(m.group(1)), to="ordinal"), t)
    t = re.sub(r"\b(19|20)\d{2}\b", year, t)
    t = re.sub(r"\b\d{1,3}(,\d{3})+\b", lambda m: num2words(int(m.group(0).replace(",", ""))), t)
    t = re.sub(r"\b\d+\.\d+\b", lambda m: num2words(float(m.group(0))).replace(" zero", ""), t)
    t = re.sub(r"\b\d+\b", lambda m: num2words(int(m.group(0))), t)
    return t.replace("-", " ") if False else t

def main():
    from kokoro_onnx import Kokoro
    k = Kokoro(f"{ROOT}/models/kokoro-v1.0.onnx", f"{ROOT}/models/voices-v1.0.bin")
    script = json.load(open(f"{ROOT}/script/narration.json"))
    os.makedirs(f"{ROOT}/work/vo", exist_ok=True)
    out, tl, t, i = [], [], 0.0, 0
    for sec in script["sections"]:
        for pi, para in enumerate(sec["paras"]):
            for si, text in enumerate(para):
                say = normalize(text)
                h = hashlib.md5(f"{VOICE}{SPEED}{say}".encode()).hexdigest()[:10]
                fn = f"{ROOT}/work/vo/s{i:04d}_{h}.wav"
                if not os.path.exists(fn):
                    a, sr = k.create(say, voice=VOICE, speed=SPEED, lang="en-us")
                    sf.write(fn, a, sr)
                a, sr = sf.read(fn, dtype="float32")
                # trim leading/trailing near-silence so gaps are controlled by us
                nz = np.where(np.abs(a) > 0.01)[0]
                if len(nz):
                    a = a[max(0, nz[0] - 240): nz[-1] + 1200]
                tl.append({"i": i, "sec": sec["id"], "para": f"{sec['id']}.{pi}", "text": text, "say": say,
                           "start": round(t, 3), "end": round(t + len(a) / SR, 3)})
                out.append(a); t += len(a) / SR
                last_s = si == len(para) - 1
                last_p = pi == len(sec["paras"]) - 1
                gap = GAP_SEC if (last_s and last_p) else GAP_PARA if last_s else GAP_SENT
                if last_s and last_p:
                    gap += STING_AFTER.get(sec["id"], 0)
                out.append(np.zeros(int(gap * SR), dtype="float32")); t += gap
                i += 1
                print(f"\r{i} sentences, {t/60:.2f} min", end="", flush=True)
    full = np.concatenate([np.zeros(int(0.6 * SR), dtype="float32")] + out)
    for e in tl:
        e["start"] = round(e["start"] + 0.6, 3); e["end"] = round(e["end"] + 0.6, 3)
    sf.write(f"{ROOT}/work/voice.wav", full, SR)
    json.dump({"duration": round(len(full) / SR, 3), "sentences": tl}, open(f"{ROOT}/work/timeline.json", "w"), indent=1)
    words = sum(len(e["text"].split()) for e in tl)
    print(f"\nDONE {len(tl)} sentences, {words} words, {len(full)/SR/60:.2f} min, {words/(len(full)/SR/60):.0f} wpm")

if __name__ == "__main__":
    main()
