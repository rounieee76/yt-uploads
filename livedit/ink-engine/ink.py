"""Hand-inked cel kit. Every line is a filled variable-width polygon (no SVG stroke).
Coordinates are in 1080-wide design units; parts are rasterised at SCALE x."""
import math, random, subprocess, os, hashlib, json
import numpy as np

INK = '#170b08'      # warm sepia-black
FINE = '#4d140a'     # finest strokes, dark red, slightly see-through

# ---- locked palette (Paris 1925) ----
BLUE = '#2f49b3'     # cobalt
BLUE_D = '#22337f'   # cobalt in shade (same hue, darker)
BLUE_L = '#6f86d9'   # periwinkle (lit cobalt)
SKIN = '#ef866b'     # salmon - whole cast
SKIN_D = '#c45d4b'   # shade
SKIN_L = '#ffb69b'   # fat / bone catching light
PALE = '#f1e2c0'     # cream
PALE_D = '#cdb9a6'   # cream in shade (cool)
GOLD = '#e0a52c'
GOLD_D = '#a8731c'
RED = '#b2302a'
RED_D = '#7e1f1f'
LILAC = '#d8c7e8'    # eye whites only
MOUTH = '#3a0d0b'    # mouth interior
PALETTE = [('cobalt', BLUE), ('salmon skin', SKIN), ('cream', PALE), ('gold', GOLD), ('red', RED)]

SCALE = 2.0


def R(seed):
    """deterministic rng, reseeded per body part"""
    if isinstance(seed, str):
        seed = int(hashlib.md5(seed.encode()).hexdigest()[:8], 16)
    return random.Random(seed)


def cr(pts, closed=False, step=2.5):
    """Catmull-Rom smoothing -> dense polyline"""
    P = np.asarray(pts, float)
    if len(P) < 2:
        return P
    if closed:
        P = np.vstack([P[-1], P, P[0], P[1]])
    else:
        P = np.vstack([2 * P[0] - P[1], P, 2 * P[-1] - P[-2]])
    out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        m = max(2, int(np.linalg.norm(p2 - p1) / step))
        for t in np.linspace(0, 1, m, endpoint=False):
            t2, t3 = t * t, t * t * t
            out.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3))
    if not closed:
        out.append(P[-2])
    return np.array(out)


def _normals(S):
    d = np.gradient(S, axis=0)
    n = np.stack([-d[:, 1], d[:, 0]], 1)
    l = np.linalg.norm(n, axis=1, keepdims=True) + 1e-9
    return n / l


def _path(poly):
    return 'M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in poly) + ' Z'


def ink(pts, w=4.0, rng=None, taper=(0.3, 0.3), wob=0.7, color=INK, alpha=1.0, press=0.3, closed=False):
    """dip-pen stroke: CR smoothing, pressure swell, pointed ends, wobble -> filled polygon"""
    rng = rng or R(str(pts[:2]))
    S = cr(pts, closed=closed)
    if len(S) < 3:
        return ''
    seg = np.linalg.norm(np.diff(S, axis=0), axis=1)
    L = np.concatenate([[0], np.cumsum(seg)])
    tot = L[-1] + 1e-6
    s = L / tot
    N = _normals(S)
    f1, f2, p1, p2 = rng.uniform(0.6, 1.6), rng.uniform(2, 4), rng.uniform(0, 6.3), rng.uniform(0, 6.3)
    wobble = wob * (np.sin(2 * math.pi * f1 * L / 60 + p1) * 0.7 + np.sin(2 * math.pi * f2 * L / 60 + p2) * 0.3)
    S = S + N * wobble[:, None]
    pres = 1 + press * np.sin(2 * math.pi * s * rng.uniform(0.7, 1.4) + p2)
    ta, tb = taper
    if closed:
        tap = np.ones_like(s)
    else:
        tap = np.minimum(1, (s / max(ta, 1e-3))) ** 0.55 * np.minimum(1, ((1 - s) / max(tb, 1e-3))) ** 0.55
    hw = np.maximum(0.12, w * pres * tap) / 2
    left = S + N * hw[:, None]
    right = S - N * hw[:, None]
    poly = np.vstack([left, right[::-1]])
    op = f' fill-opacity="{alpha}"' if alpha < 1 else ''
    return f'<path d="{_path(poly)}" fill="{color}"{op}/>'


def fine(pts, w=2.2, rng=None, **k):
    return ink(pts, w=w, rng=rng, color=FINE, alpha=0.8, **k)


def jitter(pts, rng, j=1.0):
    return [(x + rng.uniform(-j, j), y + rng.uniform(-j, j)) for x, y in pts]


def fill(pts, color, rng=None, j=0.8, closed=True, alpha=1.0):
    rng = rng or R(str(pts[:2]))
    S = cr(jitter(pts, rng, j), closed=closed)
    op = f' fill-opacity="{alpha}"' if alpha < 1 else ''
    return f'<path d="{_path(S)}" fill="{color}"{op}/>'


def outline(pts, w=4.0, rng=None, color=INK, breaks=2):
    """closed shape outline as 1-3 overlapping tapered strokes (hand-lifted pen)"""
    rng = rng or R(str(pts[:2]))
    n = len(pts)
    if n < 3:
        return ''
    out = []
    k = max(1, breaks)
    start = rng.randrange(n)
    ring = pts[start:] + pts[:start] + [pts[start]]
    cuts = sorted(rng.sample(range(1, len(ring) - 1), k - 1)) if k > 1 and len(ring) > k + 1 else []
    bounds = [0] + cuts + [len(ring) - 1]
    for a, b in zip(bounds[:-1], bounds[1:]):
        seg = ring[max(0, a - 1):b + 1]
        if len(seg) >= 2:
            out.append(ink(seg, w, rng, taper=(0.12, 0.12)))
    return ''.join(out)


def blob(cx, cy, rx, ry, rng, n=14, lump=0.06, rot=0.0):
    """lumpy ellipse point ring"""
    ph = [rng.uniform(0, 6.28) for _ in range(3)]
    pts = []
    for i in range(n):
        a = 2 * math.pi * i / n
        r = 1 + lump * (math.sin(2 * a + ph[0]) + 0.6 * math.sin(3 * a + ph[1]) + 0.4 * math.sin(5 * a + ph[2]))
        x, y = rx * r * math.cos(a), ry * r * math.sin(a)
        c, s = math.cos(rot), math.sin(rot)
        pts.append((cx + x * c - y * s, cy + x * s + y * c))
    return pts


def ticks(rng, cx, cy, rx, ry, n, ln=6, ang=None, w=2.2, color=FINE, alpha=0.75):
    out = []
    for _ in range(n):
        a = rng.uniform(0, 6.28)
        rr = math.sqrt(rng.random())
        x, y = cx + rx * rr * math.cos(a), cy + ry * rr * math.sin(a)
        t = ang if ang is not None else rng.uniform(0, math.pi)
        t += rng.uniform(-0.3, 0.3)
        l = ln * rng.uniform(0.6, 1.2)
        out.append(ink([(x, y), (x + l * math.cos(t), y + l * math.sin(t))], w, rng, taper=(0.4, 0.5), wob=0.2, color=color, alpha=alpha))
    return ''.join(out)


def dots(rng, cx, cy, rx, ry, n, r=1.1, color=FINE, alpha=0.7):
    out = []
    for _ in range(n):
        a = rng.uniform(0, 6.28)
        rr = math.sqrt(rng.random())
        x, y = cx + rx * rr * math.cos(a), cy + ry * rr * math.sin(a)
        out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r * rng.uniform(0.7, 1.3):.2f}" fill="{color}" fill-opacity="{alpha}"/>')
    return ''.join(out)


def dash_rows(rng, x0, y0, x1, y1, rows, per, ln=5, ang=0.0, w=2.0, color=FINE, alpha=0.6):
    """rows of short dashes (wool, knit, fur)"""
    out = []
    for r in range(rows):
        y = y0 + (y1 - y0) * (r + 0.5) / rows
        off = (r % 2) * 0.5
        for i in range(per):
            x = x0 + (x1 - x0) * (i + off + 0.5) / per
            if x > x1:
                continue
            xx, yy = x + rng.uniform(-1, 1), y + rng.uniform(-1, 1)
            t = ang + rng.uniform(-0.25, 0.25)
            out.append(ink([(xx, yy), (xx + ln * math.cos(t), yy + ln * math.sin(t))], w, rng, taper=(0.4, 0.4), wob=0.1, color=color, alpha=alpha))
    return ''.join(out)


def sparkle(x, y, s=14, color=PALE):
    a = s; b = s * 0.18
    p = f'M{x} {y - a} L{x + b} {y - b} L{x + a} {y} L{x + b} {y + b} L{x} {y + a} L{x - b} {y + b} L{x - a} {y} L{x - b} {y - b} Z'
    return f'<path d="{p}" fill="{color}"/><circle cx="{x}" cy="{y}" r="{s * 0.22}" fill="#ffffff"/>'


def clip_group(cid, clip_pts, inner):
    S = cr(clip_pts, closed=True)
    return f'<defs><clipPath id="{cid}"><path d="{_path(S)}"/></clipPath></defs><g clip-path="url(#{cid})">{inner}</g>'


def svg_doc(body, vb, w, h):
    x, y, vw, vh = vb
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x} {y} {vw} {vh}" width="{w}" height="{h}">' + body + '</svg>')


def render(body, vb, out_png, scale=SCALE):
    """rasterise an SVG body (viewBox in design units) to PNG at scale; returns meta"""
    x, y, vw, vh = vb
    w, h = int(round(vw * scale)), int(round(vh * scale))
    doc = svg_doc(body, vb, w, h)
    key = hashlib.md5(doc.encode()).hexdigest()[:12]
    meta_p = out_png + '.json'
    if os.path.exists(out_png) and os.path.exists(meta_p):
        m = json.load(open(meta_p))
        if m.get('key') == key:
            return m
    svgp = out_png[:-4] + '.svg'
    open(svgp, 'w').write(doc)
    subprocess.run(['rsvg-convert', '-w', str(w), '-h', str(h), '-o', out_png, svgp], check=True)
    os.remove(svgp)
    m = {'key': key, 'vb': vb, 'scale': scale, 'size': [w, h]}
    json.dump(m, open(meta_p, 'w'))
    return m
