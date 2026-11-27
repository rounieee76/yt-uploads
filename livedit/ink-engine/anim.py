"""Compositor: rigs, camera with parallax, whips, particles, old-cartoon finish, captions, encode."""
import json, math, os, sys, subprocess
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont

PD = '/home/claude/eiffel/parts'
WK = '/home/claude/eiffel/work'
SD = '/home/claude/eiffel/shots'
OW, OH, FPS = 1080, 1920, 30
REG = json.load(open(f'{PD}/reg.json'))
SHOULDERS = {'lustig': ((-66, 34), (66, 34)), 'poisson': ((-150, 52), (150, 52))}
OVER_HEAD = {'shh', 'face', 'chin'}

# ------------------------------------------------------------- images
_cache = {}


def img(key, blur=0.0):
    ck = (key, round(blur, 1))
    if ck in _cache:
        return _cache[ck]
    if (key, 0.0) not in _cache:
        a = cv2.imread(REG[key]['file'], cv2.IMREAD_UNCHANGED)
        if a.shape[2] == 3:
            a = np.dstack([a, np.full(a.shape[:2], 255, np.uint8)])
        al = a[:, :, 3:4].astype(np.float32) / 255
        a = np.dstack([(a[:, :, :3].astype(np.float32) * al).astype(np.uint8), a[:, :, 3]])  # premultiplied
        _cache[(key, 0.0)] = a
    a = _cache[(key, 0.0)]
    if blur > 0.3:
        a = cv2.GaussianBlur(a, (0, 0), blur)
        _cache[ck] = a
    return a


def clear_cache():
    _cache.clear()


# ------------------------------------------------------------- matrices
def T(x, y):
    return np.array([[1, 0, x], [0, 1, y], [0, 0, 1]], float)


def S(sx, sy=None):
    return np.array([[sx, 0, 0], [0, sx if sy is None else sy, 0], [0, 0, 1]], float)


def Rz(deg):
    a = math.radians(deg)
    c, s = math.cos(a), math.sin(a)
    return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]], float)


def part_local(key):
    """matrix mapping part pixel coords to design units around the pivot"""
    r = REG[key]
    return S(1 / r['scale']) @ T(-r['ox'], -r['oy'])


def blit(out, key, M, alpha=1.0, blur=0.0):
    a = img(key, blur)
    h, w = a.shape[:2]
    pts = np.array([[0, 0, 1], [w, 0, 1], [0, h, 1], [w, h, 1]], float).T
    q = (M @ pts)[:2]
    x0, y0 = max(0, int(math.floor(q[0].min())) - 1), max(0, int(math.floor(q[1].min())) - 1)
    x1, y1 = min(OW, int(math.ceil(q[0].max())) + 1), min(OH, int(math.ceil(q[1].max())) + 1)
    if x1 <= x0 or y1 <= y0:
        return
    Mr = (T(-x0, -y0) @ M)[:2]
    wa = cv2.warpAffine(a, Mr, (x1 - x0, y1 - y0), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
    src = wa.astype(np.float32) * (alpha / 255.0)
    roi = out[y0:y1, x0:x1]
    roi *= (1 - src[:, :, 3:4])
    roi += src[:, :, :3]


# ------------------------------------------------------------- easing / springs
def ease(t):
    t = min(1, max(0, t))
    return t * t * (3 - 2 * t)


def kick(dt, f=2.4, d=6.5):
    """overshoot response: 0 at dt=0, overshoots then settles"""
    if dt < 0:
        return 0.0
    return math.exp(-d * dt) * math.sin(2 * math.pi * f * dt)


# ------------------------------------------------------------- camera
class Cam:
    def __init__(self, keys, punches=(), shake=0.0, orbit=0.0):
        self.keys = keys  # [(t, cx, cy, z, rot)]
        self.punches = punches  # [(t, amount)]
        self.shake = shake
        self.orbit = orbit

    def at(self, t):
        k = self.keys
        if t <= k[0][0]:
            v = list(k[0][1:])
        elif t >= k[-1][0]:
            v = list(k[-1][1:])
        else:
            for a, b in zip(k[:-1], k[1:]):
                if a[0] <= t <= b[0]:
                    u = ease((t - a[0]) / (b[0] - a[0]))
                    v = [a[i] + (b[i] - a[i]) * u for i in range(1, 5)]
                    break
        cx, cy, z, rot = v
        for tp, amt in self.punches:
            if t >= tp:
                z *= 1 + amt * (1 - math.exp(-14 * (t - tp))) + amt * 0.5 * kick(t - tp, 3, 7)
        if self.orbit:
            rot += self.orbit * math.sin(t * 0.9)
            cx += 40 * self.orbit * math.sin(t * 0.9)
        cx += 3 * math.sin(t * 1.7) + 2 * math.sin(t * 2.9)  # never still: slow drift
        cy += 3 * math.sin(t * 1.3 + 1)
        return cx, cy, z, rot


def cam_matrix(cx, cy, z, rot, depth, W=1600, H=2400, z0=0.8):
    zd = z0 * (z / z0) ** depth
    ccx = W / 2 + (cx - W / 2) * depth
    ccy = H / 2 + (cy - H / 2) * depth
    hw, hh = OW / (2 * zd), OH / (2 * zd)  # clamp so we never see past the set edge
    ccx = min(max(ccx, hw), W - hw) if hw < W / 2 else W / 2
    ccy = min(max(ccy, hh), H - hh) if hh < H / 2 else H / 2
    return T(OW / 2, OH / 2) @ Rz(rot * depth) @ S(zd) @ T(-ccx, -ccy)


# ------------------------------------------------------------- characters
MOODS = {  # head_rot, head_dx, head_dy, body_dx, body_rot, bob
    'calm': (0, 0, 0, 0, 0, 0), 'smug': (-6, 4, -8, 0, -1.5, 1), 'shock': (-5, -6, -26, -30, -3, 0),
    'anger': (4, 6, 10, 10, 2, 2), 'grief': (9, 0, 24, 0, 2, 0), 'joy': (3, 0, -10, 0, 0, 3), 'doubt': (8, -4, 2, 0, 1, 0),
    'lean': (-10, 18, 8, 12, 4, 0)}


class Char:
    def __init__(self, name, x, y, s, acts, depth=1.0, blink_phase=0.0, flip=False, blur=0.0, extra=False, alpha=1.0, slide=None):
        self.name, self.x, self.y, self.s, self.depth = name, x, y, s, depth
        self.acts = acts  # [(t, expr|[exprs], left_arm, right_arm, mood)]
        self.blink_phase, self.flip, self.blur, self.extra, self.alpha = blink_phase, flip, blur, extra, alpha
        self.slide = slide  # (t0, t1, dx, dy) entrance

    def state(self, t):
        cur, prev = self.acts[0], self.acts[0]
        for a in self.acts:
            if a[0] <= t:
                prev, cur = cur, a
        return cur, prev

    def expr_at(self, t, cur):
        e = cur[1]
        if isinstance(e, (list, tuple)):
            e = e[int((t - cur[0]) / 0.42) % len(e)]
        if e in ('neutral', 'smug', 'doubt', 'joy', 'grief'):  # auto blink
            ph = (t + self.blink_phase) % 2.3
            if ph < 0.12 and e != 'joy':
                e = 'blink'
        return e

    def draw(self, out, CM, t, blur=None):
        blur = self.blur if blur is None else blur
        cur, prev = self.state(t)
        dt = t - cur[0]
        m1, m0 = MOODS[cur[4]], MOODS[prev[4]]
        k = kick(dt)
        v = [m1[i] + (m1[i] - m0[i]) * 0.45 * k for i in range(6)]
        if cur[4] == 'grief':  # slow, no snap
            u = ease(dt / 0.9)
            v = [m0[i] + (m1[i] - m0[i]) * u for i in range(6)]
        hr, hdx, hdy, bdx, brot, bob = v
        breath = math.sin(2 * math.pi * t / 2.2 + self.blink_phase)
        heave = 1 + (0.02 if cur[4] == 'anger' else 0.008) * breath
        chuckle = 0
        if cur[4] == 'smug' and dt < 0.9:
            chuckle = -5 * abs(math.sin(2 * math.pi * 3.2 * dt)) * (1 - dt / 0.9)
        if cur[4] == 'joy':
            chuckle = -6 * abs(math.sin(2 * math.pi * 2.0 * t))
        x, y = self.x, self.y
        if self.slide:
            t0, t1, dx, dy = self.slide
            u = ease((t - t0) / (t1 - t0))
            x += dx * (1 - u)
            y += dy * (1 - u) - 18 * abs(math.sin(math.pi * 4 * u)) * (1 - u)
        base = CM @ T(x, y) @ S(self.s * (-1 if self.flip else 1), self.s) @ T(bdx, 0) @ Rz(brot)
        name = self.name
        e = self.expr_at(t, cur)
        if self.extra:
            key = f'extra:{name}:{e}' if f'extra:{name}:{e}' in REG else f'extra:{name}:neutral'
            M = base @ T(0, 520) @ S(1, heave) @ T(0, -520 + breath * 2 + chuckle) @ part_local(key)
            blit(out, key, M, self.alpha, blur)
            return
        body_M = base @ T(0, 700) @ S(1, heave) @ T(0, -700)
        blit(out, f'body:{name}', body_M @ part_local(f'body:{name}'), self.alpha, blur)
        neck = body_M @ T(0, -2 * breath)
        (lx, ly), (rx_, ry) = SHOULDERS[name]
        arms = []
        for side, pose, ppose, (sx, sy) in (('L', cur[2], prev[2], (lx, ly)), ('R', cur[3], prev[3], (rx_, ry))):
            lit = side == 'L'
            ak = f'arm:{name}:{pose}:{int(lit)}'
            changed = pose != ppose
            ar = (14 * kick(dt, 2.6, 7.5) if changed else 0) + 1.5 * breath
            sc = 1 + (0.06 * kick(dt, 2.6, 7.5) if changed else 0)
            M = neck @ T(sx, sy) @ (S(-1, 1) if lit else S(1)) @ Rz(ar) @ S(sc) @ part_local(ak)
            arms.append((pose in OVER_HEAD, ak, M))
        for over, ak, M in arms:
            if not over:
                blit(out, ak, M, self.alpha, blur)
        hk = f'head:{name}:{e}'
        HM = neck @ T(hdx, hdy + chuckle + bob * 0.0) @ Rz(hr + 1.2 * math.sin(t * 1.1 + self.blink_phase)) @ part_local(hk)
        blit(out, hk, HM, self.alpha, blur)
        for over, ak, M in arms:
            if over:
                blit(out, ak, M, self.alpha, blur)


class Prop:
    def __init__(self, key, x, y, s=1.0, rot=0.0, depth=1.0, t_in=None, alpha=1.0, path=None, blur=0.0, wobble=0.0):
        self.key, self.x, self.y, self.s, self.rot, self.depth = key, x, y, s, rot, depth
        self.t_in, self.alpha, self.path, self.blur, self.wobble = t_in, alpha, path, blur, wobble

    def draw(self, out, CM, t, blur=None):
        x, y, s, rot, a = self.x, self.y, self.s, self.rot, self.alpha
        if self.path:  # (t0, t1, x0, y0, x1, y1)
            t0, t1, x0, y0, x1, y1 = self.path
            u = ease((t - t0) / (t1 - t0))
            x, y = x0 + (x1 - x0) * u, y0 + (y1 - y0) * u
        if self.t_in is not None:
            if t < self.t_in:
                return
            dt = t - self.t_in
            s *= 1 + 0.35 * kick(dt, 2.2, 6) + max(0, 0.6 * (1 - dt / 0.08))
            rot += 8 * kick(dt, 2.2, 6)
        rot += self.wobble * math.sin(t * 2.1)
        blit(out, self.key, CM @ T(x, y) @ Rz(rot) @ S(s) @ part_local(self.key), a, self.blur if blur is None else blur)


class Layer:
    def __init__(self, key, depth, blur=0.0, dx=0.0, scroll=0.0, alpha=1.0):
        self.key, self.depth, self.blur, self.dx, self.scroll, self.alpha = key, depth, blur, dx, scroll, alpha

    def draw(self, out, CM, t, blur=None):
        b = self.blur if blur is None else blur
        if self.scroll:  # endless horizontal scroll (train): two copies
            off = (t * self.scroll) % 1600
            for k in (-1, 0):
                blit(out, self.key, CM @ T(off + k * 1600, 0) @ part_local(self.key), self.alpha, b)
        else:
            blit(out, self.key, CM @ T(self.dx, 0) @ part_local(self.key), self.alpha, b)


# ------------------------------------------------------------- particles & life
def glint(out, p, r, a):
    x, y = p
    if not (0 <= x < OW and 0 <= y < OH):
        return
    pts = np.array([[x, y - r], [x + r * 0.18, y - r * 0.18], [x + r, y], [x + r * 0.18, y + r * 0.18], [x, y + r], [x - r * 0.18, y + r * 0.18], [x - r, y], [x - r * 0.18, y - r * 0.18]], np.int32)
    ov = out.copy()
    cv2.fillPoly(ov, [pts], (0.94, 0.95, 0.97), cv2.LINE_AA)
    cv2.addWeighted(ov, a, out, 1 - a, 0, out)


def P(CM, x, y):
    q = CM @ np.array([x, y, 1.0])
    return q[0], q[1]


def hexbgr(h):
    h = h.lstrip('#')
    return (int(h[4:6], 16) / 255, int(h[2:4], 16) / 255, int(h[0:2], 16) / 255)


class Particles:
    def __init__(self, kind, n, box, depth=1.0, seed=1, color='#f1e2c0', size=(2, 5), speed=(10, 30)):
        rng = np.random.default_rng(seed)
        self.kind, self.depth, self.color = kind, depth, hexbgr(color)
        x0, y0, x1, y1 = box
        self.box = box
        self.p = np.stack([rng.uniform(x0, x1, n), rng.uniform(y0, y1, n), rng.uniform(*size, n), rng.uniform(*speed, n), rng.uniform(0, 6.28, n)], 1)

    def draw(self, out, CM, t, blur=None):
        x0, y0, x1, y1 = self.box
        zx = math.hypot(CM[0, 0], CM[1, 0])
        for x, y, r, sp, ph in self.p:
            if self.kind == 'dust':
                xx = x + 30 * math.sin(t * 0.5 + ph)
                yy = y0 + (y - y0 - sp * t) % (y1 - y0)
                a = 0.35 + 0.35 * math.sin(t * 2 + ph)
            elif self.kind == 'flake':
                xx = x + 25 * math.sin(t * 3 + ph)
                yy = y0 + (y - y0 + sp * 4 * t) % (y1 - y0)
                a = 0.95
            elif self.kind == 'twinkle':
                xx, yy = x, y
                a = max(0, math.sin(t * 3 + ph)) ** 6
                if a > 0.05:
                    glint(out, P(CM, xx, yy), r * zx * 3, a * 0.9)
                continue
            else:
                xx, yy, a = x, y, 0.5
            px, py = P(CM, xx, yy)
            if 0 <= px < OW and 0 <= py < OH:
                rr = max(1, int(r * zx))
                if self.kind == 'flake':
                    ang = t * 4 + ph
                    pts = np.array([[px + rr * math.cos(ang + k * 1.57) * (1 if k % 2 else 0.5), py + rr * math.sin(ang + k * 1.57) * (1 if k % 2 else 0.5)] for k in range(4)], np.int32)
                    cv2.fillPoly(out, [pts], self.color, cv2.LINE_AA)
                else:
                    ov = out[max(0, int(py) - rr - 2):int(py) + rr + 3, max(0, int(px) - rr - 2):int(px) + rr + 3]
                    if ov.size:
                        tmp = ov.copy()
                        cv2.circle(tmp, (int(px) - max(0, int(px) - rr - 2), int(py) - max(0, int(py) - rr - 2)), rr, self.color, -1, cv2.LINE_AA)
                        cv2.addWeighted(tmp, a, ov, 1 - a, 0, ov)


class Glints:
    def __init__(self, pts, depth=1.0, size=12, speed=2.0):
        self.pts, self.depth, self.size, self.speed = pts, depth, size, speed

    def draw(self, out, CM, t, blur=None):
        zx = math.hypot(CM[0, 0], CM[1, 0])
        for i, (x, y) in enumerate(self.pts):
            a = 0.25 + 0.75 * max(0, math.sin(t * self.speed + i * 1.9)) ** 3
            glint(out, P(CM, x, y), self.size * zx * (0.7 + 0.5 * a), a)


class Glow:
    def __init__(self, x, y, r, color, depth=1.0, flicker=0.15, base=0.18):
        self.x, self.y, self.r, self.c, self.depth, self.f, self.base = x, y, r, hexbgr(color), depth, flicker, base

    def draw(self, out, CM, t, blur=None):
        px, py = P(CM, self.x, self.y)
        rr = self.r * math.hypot(CM[0, 0], CM[1, 0])
        a = self.base * (1 + self.f * (math.sin(t * 13) * 0.5 + math.sin(t * 7.3) * 0.5))
        x0, y0, x1, y1 = int(max(0, px - rr)), int(max(0, py - rr)), int(min(OW, px + rr)), int(min(OH, py + rr))
        if x1 <= x0 or y1 <= y0:
            return
        yy, xx = np.mgrid[y0:y1, x0:x1]
        d = np.sqrt((xx - px) ** 2 + (yy - py) ** 2) / rr
        m = (np.clip(1 - d, 0, 1) ** 2 * a)[..., None]
        out[y0:y1, x0:x1] = out[y0:y1, x0:x1] * (1 - m) + np.array(self.c, np.float32) * m


class Mover:
    """a part travelling along a line, optionally flapping between two keys (birds) or growing+fading (smoke)"""
    def __init__(self, keys, p0, p1, dur, depth=1.0, s=1.0, phase=0.0, kind='bird', alpha=1.0):
        self.keys, self.p0, self.p1, self.dur, self.depth, self.s, self.ph, self.kind, self.alpha = keys, p0, p1, dur, depth, s, phase, kind, alpha

    def draw(self, out, CM, t, blur=None):
        u = ((t + self.ph) / self.dur) % 1.0
        x = self.p0[0] + (self.p1[0] - self.p0[0]) * u
        y = self.p0[1] + (self.p1[1] - self.p0[1]) * u
        if self.kind == 'bird':
            k = self.keys[int((t + self.ph) * 8) % 2]
            y += 12 * math.sin((t + self.ph) * 5)
            blit(out, k, CM @ T(x, y) @ S(self.s) @ part_local(k), self.alpha, 0)
        else:
            k = self.keys[0]
            s = self.s * (0.5 + 1.2 * u)
            a = self.alpha * min(1, u * 5) * (1 - u) ** 0.7
            blit(out, k, CM @ T(x, y) @ Rz(u * 40) @ S(s) @ part_local(k), a, 0)


# ------------------------------------------------------------- finish
_rng = np.random.default_rng(7)
_grain = [(_rng.standard_normal((OH, OW)).astype(np.float32)) for _ in range(4)]
_mott = [cv2.resize(_rng.standard_normal((OH // 60, OW // 60)).astype(np.float32), (OW, OH), interpolation=cv2.INTER_CUBIC) for _ in range(3)]
yy, xx = np.mgrid[0:OH, 0:OW]
_vig = (1 - 0.22 * (((xx - OW / 2) / (OW / 2)) ** 2 * 0.6 + ((yy - OH / 2) / (OH / 2)) ** 2 * 0.6) ** 1.3).astype(np.float32)[..., None]
del yy, xx


def finish(f, fi):
    f = np.clip(f, 0, 1)
    f = cv2.GaussianBlur(f, (0, 0), 0.75)                         # soften the ink ~1px
    bl = cv2.GaussianBlur(f, (0, 0), 5)
    f = np.clip(f + 0.6 * (f - bl), 0, 1)                          # unsharp r5 60% -> faint pale rim on strokes
    u = (fi / 90.0) % 3                                            # slow mottling of flat fills
    i0, w = int(u), u - int(u)
    m = _mott[i0] * (1 - w) + _mott[(i0 + 1) % 3] * w
    f = f * (1 + 0.025 * m[..., None])
    ycc = cv2.cvtColor(f, cv2.COLOR_BGR2YCrCb)                    # chroma blurred more than luma, 2px off-register
    cr = cv2.GaussianBlur(ycc[:, :, 1], (0, 0), 2.2)
    cb = cv2.GaussianBlur(ycc[:, :, 2], (0, 0), 2.2)
    cr = np.roll(cr, 2, axis=1)
    cb = np.roll(cb, -2, axis=1)
    f = cv2.cvtColor(np.dstack([ycc[:, :, 0], cr, cb]), cv2.COLOR_YCrCb2BGR)
    small = cv2.resize(f, (OW // 4, OH // 4), interpolation=cv2.INTER_AREA)  # gentle bloom
    br = np.clip(small - 0.72, 0, 1) * 2.0
    br = cv2.GaussianBlur(br, (0, 0), 6)
    f = f + 0.35 * cv2.resize(br, (OW, OH), interpolation=cv2.INTER_LINEAR)
    f = f * np.array([0.95, 1.0, 1.04], np.float32)                 # warm tone (BGR)
    lift = np.array([10, 14, 28], np.float32) / 255                 # blacks lifted to deep brown
    f = lift + f * (1 - lift)
    f = f * _vig
    g = _grain[fi % 4]
    gs = np.roll(g, (fi * 37) % OH, axis=0)
    f = f + (0.018 * gs)[..., None]                                 # luma-only grain
    return np.clip(f * 255, 0, 255).astype(np.uint8)


def motion_blur(fr, L, horiz=True):
    if L < 2:
        return fr
    k = np.zeros((L, L) if not horiz else (1, L), np.float32)
    if horiz:
        k[0, :] = 1.0 / L
    else:
        k[:, L // 2] = 1.0 / L
    return cv2.filter2D(fr, -1, k)


def zoom_blur(fr, amt, n=6):
    acc = fr.astype(np.float32)
    for i in range(1, n):
        s = 1 + amt * i / n
        z = cv2.resize(fr, None, fx=s, fy=s, interpolation=cv2.INTER_LINEAR)
        y0, x0 = (z.shape[0] - OH) // 2, (z.shape[1] - OW) // 2
        acc += z[y0:y0 + OH, x0:x0 + OW]
    return (acc / n).astype(np.uint8)


# ------------------------------------------------------------- captions
FONT = '/home/claude/eiffel/fonts/Fredoka.ttf'


def font(sz):
    f = ImageFont.truetype(FONT, sz)
    try:
        f.set_variation_by_axes([700, 100])
    except Exception:
        pass
    return f


WEAK = {'the', 'a', 'an', 'to', 'of', 'for', 'with', 'is', 'too', 'over', 'and', 'so', 'his', 'him', 'would', 'about', 'in', 'top', 'say', 'all'}


def chunks(tl):
    words = [w for c in tl for w in c['words']]
    out, cur = [], []
    for i, (w, a, b) in enumerate(words):
        cur.append((w, a, b))
        punct = w[-1] in ',.:;?!'
        if punct or len(cur) == 3:
            if not punct and len(cur) == 3 and cur[-1][0].lower() in WEAK and i + 1 < len(words):
                out.append(cur[:-1]); cur = [cur[-1]]
                continue
            out.append(cur); cur = []
    if cur:
        out.append(cur)
    res = []
    for i, c in enumerate(out):
        st = c[0][1]
        en = out[i + 1][0][1] if i + 1 < len(out) else c[-1][2] + 0.6
        res.append((' '.join(w for w, _, _ in c).upper().strip(',:;'), st, en))
    return res


def caption(frame, text, age_frames, y):
    sz = 112
    im = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    d = ImageDraw.Draw(im)
    F = font(sz)
    while d.textlength(text, font=F) > OW - 110 and sz > 72:
        sz -= 6
        F = font(sz)
    dim = age_frames < 3
    col = (255, 226, 26) if not dim else (140, 124, 34)
    tw = d.textlength(text, font=F)
    x = (OW - tw) / 2
    d.text((x + 4, y + 8), text, font=F, fill=(23, 11, 8), stroke_width=14, stroke_fill=(23, 11, 8), anchor='lm')
    d.text((x, y), text, font=F, fill=col, stroke_width=11, stroke_fill=(23, 11, 8), anchor='lm')
    return cv2.cvtColor(np.asarray(im), cv2.COLOR_RGB2BGR)


# ------------------------------------------------------------- shot render
def render_frame(shot, t, fi):
    out = np.zeros((OH, OW, 3), np.float32)
    cx, cy, z, rot = shot['cam'].at(t)
    # whip offsets
    for el in shot['els']:
        d = getattr(el, 'depth', 1.0)
        CM = cam_matrix(cx + shot.get('wx', 0), cy, z * shot.get('wz', 1), rot, d, *shot.get('size', (1600, 2400)))
        el.draw(out, CM, t)
    return out


def render_shot(shot, fn, t0, n_frames, captions, whip_in, whip_out, still_only=None):
    os.makedirs(SD, exist_ok=True)
    frames_iter = range(n_frames) if still_only is None else still_only
    proc = None
    if still_only is None:
        tmp = fn[:-4] + '.tmp.mp4'
        proc = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{OW}x{OH}', '-r', str(FPS), '-i', '-',
                                 '-c:v', 'libx264', '-crf', '17', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', tmp], stdin=subprocess.PIPE)
    stills = []
    for f in frames_iter:
        t = f / FPS
        shot['wx'], shot['wz'] = 0, 1
        blurL, zb = 0, 0
        WF = 3
        if whip_in and f < WF:  # arriving: finish the whip
            k = (WF - f) / WF
            if whip_in == 'blur':
                shot['wx'] = 260 * k * k
                blurL = int(70 * k)
            else:
                shot['wz'] = 1 - 0.25 * k * k
                zb = 0.18 * k
        if whip_out and f >= n_frames - WF:  # leaving: start the whip
            k = (f - (n_frames - WF) + 1) / WF
            if whip_out == 'blur':
                shot['wx'] = -260 * k * k
                blurL = int(70 * k)
            else:
                shot['wz'] = 1 + 0.3 * k * k
                zb = 0.2 * k
        fr = render_frame(shot, t, f)
        for P_ in shot.get('post', []):
            P_(fr, t)
        fr = finish(fr, int(round((t0 + t) * FPS)))
        if blurL:
            fr = motion_blur(fr, blurL)
        if zb:
            fr = zoom_blur(fr, zb)
        gt = t0 + t
        for text, a, b in captions:
            if a <= gt < b:
                fr = caption(fr, text, int((gt - a) * FPS), shot.get('cap_y', 1460))
                break
        if proc:
            proc.stdin.write(fr.tobytes())
        else:
            stills.append(fr)
    if proc:
        proc.stdin.close()
        if proc.wait() == 0:
            os.replace(fn[:-4] + '.tmp.mp4', fn)
    return stills
