"""Place downloaded CC0 sound effects (SFX Kit by Wyzowl, github.com/wyzowl/sfx-kit) on phrases of the voiceover.
Each effect is peak-normalised to -11 dBFS. Writes work/sfx.wav (48 kHz stereo) and research/sfx_cues.json."""
import json, os, numpy as np, soundfile as sf
from scipy.signal import resample_poly
ROOT = '/home/claude/ce'; KIT = '/home/claude/dl/sfx-kit'; SR = 48000; PEAK_DB = -11.0
TL = json.load(open(f'{ROOT}/work/timeline.json')); SEN = TL['sentences']
META = {s['id']: s for s in json.load(open(f'{KIT}/sounds.json'))['sounds']}

def Q(phrase):
    p = phrase.replace('’', "'")
    for s in SEN:
        k = s['text'].replace('’', "'").find(p)
        if k >= 0:
            return s['start'] + (s['end'] - s['start']) * k / len(s['text'])
    raise SystemExit(f'MISSING CUE: {phrase}')
def E(phrase):
    p = phrase.replace('’', "'")
    for s in SEN:
        if p in s['text'].replace('’', "'"): return s['end']
    raise SystemExit(f'MISSING CUE: {phrase}')

C = [tuple(c) for c in json.load(open(f'{ROOT}/script/sfx_cues.json'))]
# "__STING__" = 0.35 s after the last sentence of the first section (the logo sting)
STING_T = [s for s in SEN if s['sec'] == SEN[0]['sec']][-1]['end'] + .35

def load(sid):
    m = META[sid]; a, sr = sf.read(f"{KIT}/{m['file']}", dtype='float32', always_2d=True)
    if a.shape[1] == 1: a = np.repeat(a, 2, 1)
    if sr != SR: a = resample_poly(a, SR, sr, axis=0).astype('float32')
    a = a / (np.max(np.abs(a)) + 1e-9) * 10 ** (PEAK_DB / 20)
    return a, m.get('sync', m.get('sync_point', 0)) or 0

dur = TL['duration']; out = np.zeros((int(dur * SR) + SR * 6, 2), 'float32'); cues = []
for when, sid, off in C:
    t = (STING_T if when == '__STING__' else Q(when)) + off
    a, sync = load(sid)
    if isinstance(sync, dict): sync = sync.get('at', 0)
    st = max(0, int((t - float(sync)) * SR))
    out[st:st + len(a)] += a
    cues.append({'t': round(t, 2), 'sound': sid, 'cue': when})
pk = np.max(np.abs(out)); print('sfx count', len(cues), 'max overlap peak dBFS', round(20 * np.log10(pk), 1))
sf.write(f'{ROOT}/work/sfx.wav', out[:int(dur * SR)], SR)
json.dump({'source': 'SFX Kit by Wyzowl, CC0-1.0, https://github.com/wyzowl/sfx-kit', 'peak_dbfs': PEAK_DB, 'cues': cues}, open(f'{ROOT}/research/sfx_cues.json', 'w'), indent=1)
