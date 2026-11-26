#!/usr/bin/env python3
"""Lived It compositor v2: layered scenes -> 1080p30 with parallax camera, lighting, rim light, fog, particles, grain.
usage: comp.py PROJECT plan|frames IDS|shots A B|concat
"""
import json, math, os, sys, subprocess, hashlib
import numpy as np, cv2
cv2.setNumThreads(1)
sys.path.insert(0, '/home/claude/lived')
from PIL import Image, ImageDraw, ImageFont

W, H, FPS = 1920, 1080, 30
LW, LH = 2304, 1296  # layer size (1.2x)
FONTS = '/home/claude/lived/fonts'
P = os.path.abspath(sys.argv[1]); MODE = sys.argv[2]
J = lambda f: json.load(open(f'{P}/{f}'))
norm = lambda s: s.replace('’', "'")

def timeline():
    tl = J('work/timeline.json'); sen = tl['sentences']
    def Q(phrase):
        p = norm(phrase)
        for s in sen:
            k = norm(s['text']).find(p)
            if k >= 0: return s['start'] + (s['end'] - s['start']) * (k / max(1, len(s['text'])))
        raise SystemExit(f'MISSING CUE: {phrase}')
    return tl, sen, Q

def plan():
    tl, sen, Q = timeline()
    pl = J('work/plan.json')
    for s in pl: s['t'] = 0.0 if s['cue'] == '@0' else Q(s['cue'])
    pl.sort(key=lambda s: s['t']); pl[0]['t'] = 0.0
    chaps = []
    for sec in J('script/narration.json')['sections']:
        if sec.get('chapter'):
            first = sec['paras'][0][0]
            chaps.append((next(s['start'] for s in sen if s['text'] == first), sec['chapter']))
    out = []
    moves = ['in', 'panR', 'out', 'panL', 'in', 'up', 'panR', 'out']
    for i, s in enumerate(pl):
        t1 = pl[i + 1]['t'] if i + 1 < len(pl) else tl['duration']
        d = t1 - s['t']; n = 1 if d < 8 or s.get('hold') else 2 if d < 15 else 3
        for k in range(n):
            o = dict(s); o['start'] = s['t'] + d * k / n; o['end'] = s['t'] + d * (k + 1) / n; o['part'] = k
            o['move'] = s['cam'] if k == 0 else moves[(i + k) % len(moves)]
            if k > 0: o['tag'] = None; o['big'] = None
            out.append(o)
    for s in out: s['f0'] = round(s['start'] * FPS)
    for i, s in enumerate(out):
        s['f1'] = out[i + 1]['f0'] if i + 1 < len(out) else round(tl['duration'] * FPS)
        s['sid'] = f'{i:03d}'
        s['chap'] = [(t, c) for t, c in chaps if s['start'] - 0.05 <= t < s['end'] - 0.05]
    return out, tl

def ease(x): x = min(1, max(0, x)); return x * x * (3 - 2 * x)
def cam(move, part, u):
    e = ease(u); base = 1.07 if part == 0 else 1.18
    return {'in': (base + 0.09 * e, 0, 0), 'out': (base + 0.10 * (1 - e), 0, 0), 'panR': (base + 0.08, -0.045 + 0.09 * e, 0),
            'panL': (base + 0.08, 0.045 - 0.09 * e, 0), 'up': (base + 0.08, 0, 0.04 - 0.07 * e), 'still': (base + 0.02, 0, 0),
            'crash': (base + 0.25 * (1 - ease(min(1, u * 6))) + 0.03 * e, 0, 0)}.get(move, (base, 0, 0))

DEPTH = {'bg': 0.45, 'mid': 0.8, 'chars': 1.0, 'blink': 1.0, 'fg': 1.4}
def warp(img, z, dx, dy, d, sh=(0, 0)):
    zl = 1 + (z - 1) * d
    s = (W / LW) * 1.0 * zl * (LW / W) / 1.2 * 1.2  # layer covers 1.2x frame; s maps layer px -> frame px
    s = W / (LW / 1.2) / 1.2 * zl * 1.2 / 1.2  # = zl / 1.2 * (W*1.2/LW) ; LW=1.2W so = zl/1.2*1
    s = zl / 1.2 * 1.0 * 1.0 * (1.2 * W / LW) * 1.2 / 1.0 / 1.0  # final: frame shows 1/1.2 of layer at zl=1 -> keep margin
    s = 1.0 * zl * (W / LW) * 1.2 / 1.0 / 1.2 * 1.2 / 1.0  # simplified below
    s = zl * W / LW * 1.2 / 1.0  # zl=1 -> 1920/2304*1.2 = 1.0 : layer px == frame px, 192px margin each side
    cx = LW / 2 - dx * d * LW * 0.5; cy = LH / 2 - dy * d * LH * 0.5
    M = np.array([[s, 0, W / 2 - s * cx + sh[0] * d], [0, s, H / 2 - s * cy + sh[1] * d]], dtype=np.float32)
    return cv2.warpAffine(img, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE if img.shape[2] == 3 else cv2.BORDER_CONSTANT)

def load(f):
    im = cv2.imread(f, cv2.IMREAD_UNCHANGED)
    if im.shape[2] == 4: im = im.astype(np.float32); im[..., :3] *= im[..., 3:4] / 255.0; return im  # premultiplied
    return im.astype(np.float32)
def comp(dst, src):  # src premultiplied BGRA
    a = src[..., 3:4] / 255.0
    return dst * (1 - a) + src[..., :3]

yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
VIG = (1 - 0.42 * np.clip(((xx - W / 2) / (W * 0.62)) ** 2 + ((yy - H / 2) / (H * 0.6)) ** 2, 0, 1) ** 1.5)[..., None]
rng = np.random.default_rng(7)
GRAIN = [cv2.resize(rng.normal(0, 4.5, (H // 2, W // 2)).astype(np.float32), (W, H), interpolation=cv2.INTER_NEAREST)[..., None] for _ in range(4)]
def fog_layer(seed):
    r = np.random.default_rng(seed); n = r.random((14, 40)).astype(np.float32)
    n = cv2.GaussianBlur(cv2.resize(n, (W * 2, H), interpolation=cv2.INTER_CUBIC), (0, 0), 50)
    return ((n - n.min()) / (n.max() - n.min() + 1e-6))
FOG = fog_layer(3)

def hexbgr(h): h = h.lstrip('#'); return np.array([int(h[4:6], 16), int(h[2:4], 16), int(h[0:2], 16)], np.float32)
def light_maps(light):
    """returns (ambient multiplier HxWx3, list of (glowmap HxW, color, intensity, flicker))"""
    amb = light.get('amb')
    A = None
    if amb:
        c = hexbgr(amb[0]) / 255.0; k = amb[1]
        A = (1 - k) + k * c  # 3-vector
    G = []
    for L in light.get('lights', []):
        x, y, rad, col, inten = L[:5]; fl = L[5] if len(L) > 5 else 0
        d2 = ((xx - x) ** 2 + (yy - y) ** 2) / (rad * rad)
        g = np.exp(-d2 * 2.2).astype(np.float32)
        G.append(((g[..., None] * hexbgr(col)).astype(np.float32), inten, fl))
    return A, G

class Particles:
    def __init__(self, kind, seed):
        r = np.random.default_rng(seed); self.kind = kind
        n = {'snow': 240, 'rain': 380, 'dust': 60, 'embers': 80, 'sparks': 30}[kind]
        self.x = r.random(n) * W; self.y = r.random(n) * H; self.sz = r.random(n); self.ph = r.random(n) * 6.28
    def draw(self, f, t):
        k = self.kind
        if k == 'snow':
            x = (self.x + 30 * np.sin(t * 0.8 + self.ph) + t * 20) % W; y = (self.y + t * (60 + 90 * self.sz)) % H
            for a, b, s in zip(x, y, self.sz): cv2.circle(f, (int(a), int(b)), int(1 + 3 * s), (245, 245, 250), -1, cv2.LINE_AA)
        elif k == 'rain':
            x = (self.x + t * 300) % W; y = (self.y + t * (1400 + 600 * self.sz)) % H
            for a, b, s in zip(x, y, self.sz): cv2.line(f, (int(a), int(b)), (int(a - 6), int(b - 34 - 20 * s)), (200, 205, 215), 1, cv2.LINE_AA)
        elif k == 'dust':
            x = (self.x + 14 * np.sin(t * 0.4 + self.ph) + t * 8) % W; y = (self.y - t * (6 + 10 * self.sz)) % H
            for a, b, s in zip(x, y, self.sz): cv2.circle(f, (int(a), int(b)), int(1 + 2 * s), (190, 225, 250), -1, cv2.LINE_AA)
        elif k == 'embers':
            x = (self.x + 25 * np.sin(t * 1.3 + self.ph)) % W; y = (self.y - t * (50 + 80 * self.sz)) % H
            for a, b, s in zip(x, y, self.sz): cv2.circle(f, (int(a), int(b)), int(1 + 2.5 * s), (60, 150, 255), -1, cv2.LINE_AA)

def font(n, s): return ImageFont.truetype(f'{FONTS}/{n}', s)
def text_rgba(kind, text):
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    if kind == 'chapter':
        parts = text.split('·') if '·' in text else text.split(':')
        num, title = (parts[0].strip(), parts[1].strip()) if len(parts) > 1 else ('', text)
        band = Image.new('RGBA', (W, H), (0, 0, 0, 0)); bd = ImageDraw.Draw(band)
        for i in range(440): bd.line([(0, H - i), (W, H - i)], fill=(8, 6, 4, int(185 * (1 - i / 440) ** 1.6)))
        im = Image.alpha_composite(im, band); d = ImageDraw.Draw(im)
        f1 = font('Oswald.ttf', 40); f1.set_variation_by_axes([600]); f2 = font('PlayfairDisplay.ttf', 118); f2.set_variation_by_axes([800])
        x, y = 120, H - 250
        d.text((x, y - 62), 'PROLOGUE' if num.lower().startswith('prologue') else f'CHAPTER {num}', font=f1, fill=(236, 190, 110, 255))
        d.line([(x, y - 10), (x + 90, y - 10)], fill=(236, 190, 110, 255), width=3)
        d.text((x + 4, y + 6), title, font=f2, fill=(0, 0, 0, 170)); d.text((x, y), title, font=f2, fill=(250, 244, 232, 255))
    elif kind == 'tag':
        f = font('Oswald.ttf', 46); f.set_variation_by_axes([600]); tw = d.textlength(text, font=f); x, y = 92, 84
        d.rounded_rectangle([x - 22, y - 10, x + tw + 22, y + 62], 10, fill=(14, 10, 8, 175)); d.rectangle([x - 22, y - 10, x - 14, y + 62], fill=(214, 64, 52, 255))
        d.text((x, y - 4), text, font=f, fill=(250, 244, 232, 255))
    elif kind == 'big':
        f = font('Anton.ttf', 140); tw = d.textlength(text, font=f); x, y = (W - tw) / 2, H * 0.70 - 80
        for dx, dy in [(-7, 0), (7, 0), (0, -7), (0, 7), (-5, -5), (5, 5), (-5, 5), (5, -5)]: d.text((x + dx, y + dy), text, font=f, fill=(10, 8, 6, 255))
        d.text((x, y), text, font=f, fill=(255, 214, 90, 255))
    return np.array(im)
def mark_rgba():
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    f = font('Oswald.ttf', 30); f.set_variation_by_axes([600]); t = 'LIVED IT'; tw = d.textlength(t, font=f); x, y = W - tw - 70, 52
    d.rounded_rectangle([x - 40, y - 8, x + tw + 18, y + 42], 22, fill=(14, 10, 8, 120)); d.ellipse([x - 28, y + 9, x - 12, y + 25], fill=(214, 64, 52, 230))
    d.text((x, y - 2), t, font=f, fill=(250, 244, 232, 200)); return np.array(im)
class Ov:
    def __init__(self, rgba):
        ys, xs = np.nonzero(rgba[..., 3])
        if len(ys) == 0: self.e = True; return
        self.e = False
        self.y0, self.y1, self.x0, self.x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
        self.a = rgba[self.y0:self.y1, self.x0:self.x1, 3:4].astype(np.float32) / 255
        self.c = rgba[self.y0:self.y1, self.x0:self.x1, 2::-1].astype(np.float32)
def over(f, ov, alpha=1.0):
    if not isinstance(ov, Ov): ov = Ov(ov)
    if ov.e: return f
    a = ov.a * alpha
    f[ov.y0:ov.y1, ov.x0:ov.x1] = f[ov.y0:ov.y1, ov.x0:ov.x1] * (1 - a) + ov.c * a
    return f
MARK = Ov(mark_rgba())

def render(s, out):
    lay = {k: load(v) for k, v in s['layers'].items()}
    A, G = light_maps(s['light'])
    if A is not None:
        for k in ('bg', 'mid', 'chars', 'blink'):
            if k in lay: lay[k][..., :3] *= A
        if 'fg' in lay: lay['fg'][..., :3] *= A * s['depth'].get('fgdark', 0.7)
    elif 'fg' in lay: lay['fg'][..., :3] *= s['depth'].get('fgdark', 0.7)
    fx = set(s['fx']); parts = {k: Particles(k, int(s['sid'])) for k in ['snow', 'rain', 'dust', 'embers'] if k in fx}
    rim = s['light'].get('rim')  # [color, dx, dy, strength]
    rays = s['light'].get('rays')  # [x, y, color, strength]
    texts = [(t, Ov(text_rgba('chapter', c)), 'chapter') for t, c in s['chap']]
    if s.get('tag'): texts.append((s['start'] + 0.3, Ov(text_rgba('tag', s['tag'])), 'tag'))
    if s.get('big'): texts.append((s['start'] + 0.1, Ov(text_rgba('big', s['big'])), 'big'))
    RAY = None
    if rays:
        rx, ry, rc, rs = rays; ang = np.arctan2(yy - ry, xx - rx); dist = np.sqrt((xx - rx) ** 2 + (yy - ry) ** 2)
        RAY = ((0.5 + 0.5 * np.sin(ang * 17)) ** 10 * np.exp(-dist / 700) * 0.45)[..., None].astype(np.float32) * hexbgr(rc) * rs
    STATIC = None
    for gc, inten, fl in G:
        if not fl: STATIC = gc * inten if STATIC is None else STATIC + gc * inten
    n = s['f1'] - s['f0']; tmp = out + '.tmp.mp4'
    ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                           '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '19', '-pix_fmt', 'yuv420p', tmp], stdin=subprocess.PIPE)
    seed = int(hashlib.md5(s['sid'].encode()).hexdigest()[:6], 16)
    blink_period = 3.3 + (seed % 10) / 10
    for i in range(n):
        u = i / max(1, n - 1); t = (s['f0'] + i) / FPS
        z, dx, dy = cam(s['move'], s['part'], u)
        sh = (0, 0)
        if s.get('shake'): k = s['shake']; sh = (k * 7 * math.sin(t * 37 + seed), k * 6 * math.sin(t * 29 + 1.3))
        f = warp(lay['bg'], z, dx, dy, s['depth'].get('bg', DEPTH['bg']), sh)[..., :3]
        if 'mid' in lay: f = comp(f, warp(lay['mid'], z, dx, dy, s['depth'].get('mid', DEPTH['mid']), sh))
        if 'chars' in lay:
            blink = 'blink' in lay and ((t + seed % 7) % blink_period) < 0.13
            bob = 2.0 * math.sin(t * 2.2 + seed)
            cl = warp(lay['blink' if blink else 'chars'], z, dx, dy - bob / LH * 2 / 1.0 * 0, s['depth'].get('chars', 1.0), (sh[0], sh[1] + bob))
            body = cl[..., :3]
            a = cl[..., 3:4] / 255.0
            f = f * (1 - a) + body
            if rim:
                col = hexbgr(rim[0]); ddx, ddy, st = rim[1], rim[2], rim[3]
                al = cl[..., 3] / 255.0
                M = np.float32([[1, 0, -ddx], [0, 1, -ddy]])
                sh_al = cv2.warpAffine(al, M, (W, H))
                edge = np.clip(al - sh_al, 0, 1)[..., None]
                f = f + edge * col * st
        if 'fg' in lay:
            fgl = warp(lay['fg'], z, dx, dy, s['depth'].get('fg', DEPTH['fg']), sh)
            f = comp(f, fgl)
        if G:
            if STATIC is not None: f += STATIC
            for gc, inten, fl in G:
                if fl: f += gc * (inten * (1 + fl * (0.6 * math.sin(t * 9 + seed) * math.sin(t * 2.3 + 1) + 0.4 * math.sin(t * 23))))
        if RAY is not None: f += RAY
        if s.get('flash'):
            ph = (t * 3.1 + seed % 7) % 1
            if ph < 0.1: f = f + (255 - f) * (0.4 * s['flash'] * (1 - ph / 0.1))
        if 'fog' in fx:
            off = int((t * 35 + seed) % W); fg_ = FOG[:, off:off + W][..., None]
            f = f * (1 - 0.13 * fg_) + 215 * 0.13 * fg_
        f = f * VIG
        f += GRAIN[(s['f0'] + i) % 4]
        f = np.clip(f, 0, 255).astype(np.uint8)
        for p in parts.values(): p.draw(f, t)
        if texts:
            f = f.astype(np.float32)
            for t0, rgba, kind in texts:
                dur = 3.2 if kind == 'chapter' else 3.0 if kind == 'tag' else 2.4
                a = min(1, (t - t0) / 0.35, (t0 + dur - t) / 0.45)
                if a > 0: f = over(f, rgba, a)
        f = over(f.astype(np.float32) if f.dtype != np.float32 else f, MARK, 1.0)
        ff.stdin.write(np.clip(f, 0, 255).astype(np.uint8).tobytes())
    ff.stdin.close(); code = ff.wait()
    if code == 0: os.replace(tmp, out)
    return code

def main():
    shots, tl = plan()
    os.makedirs(f'{P}/shots', exist_ok=True)
    if MODE == 'plan':
        for s in shots: print(s['sid'], s['id'], f"{s['start']:7.2f} {s['end'] - s['start']:5.2f}s", s['move'], s['cue'][:36], [c for _, c in s['chap']], s.get('tag') or '')
        print(len(shots), 'shots', f"{tl['duration'] / 60:.2f} min")
    elif MODE == 'frames':
        for sid in sys.argv[3].split(','):
            s = next(x for x in shots if x['id'] == sid and x['part'] == 0)
            s2 = dict(s); mid = s['f0'] + int((s['f1'] - s['f0']) * 0.6); s2['f0'] = mid; s2['f1'] = mid + 1
            render(s2, f'{P}/work/chk_{sid}.mp4')
            subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f'{P}/work/chk_{sid}.mp4', '-frames:v', '1', '-q:v', '3', f'{P}/work/chk_{sid}.jpg'])
            print('frame', sid, flush=True)
    elif MODE == 'shots':
        a, b = int(sys.argv[3]), int(sys.argv[4]); step = int(sys.argv[5]) if len(sys.argv) > 5 else 1; off = int(sys.argv[6]) if len(sys.argv) > 6 else 0
        for idx in range(a, min(b, len(shots) - 1) + 1):
            if (idx - a) % step != off: continue
            s = shots[idx]
            key = hashlib.md5(json.dumps({k: v for k, v in s.items()}, sort_keys=True, default=str).encode()).hexdigest()
            out = f"{P}/shots/{s['sid']}.mp4"; kf = out + '.key'
            if os.path.exists(out) and os.path.exists(kf) and open(kf).read() == key: continue
            code = render(s, out)
            if code == 0: open(kf, 'w').write(key)
            print(s['sid'], 'ok' if code == 0 else 'FAIL', flush=True)
    elif MODE == 'concat':
        with open(f'{P}/work/concat.txt', 'w') as fh:
            for s in shots: fh.write(f"file '{P}/shots/{s['sid']}.mp4'\n")
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', f'{P}/work/concat.txt', '-c', 'copy', f'{P}/work/video_silent.mp4'], check=True)
        print('concat ok', len(shots))

if __name__ == '__main__':
    main()
