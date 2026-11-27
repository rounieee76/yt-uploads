"""Cast kit: caricature heads per expression, hands, arms, bodies. Neck pivot (0,0) for heads,
shoulder pivot (0,0) for arms (arm hangs toward +y, reaches toward +x), hip pivot for bodies."""
import math
from ink import *

# ----------------------------------------------------------------- face parts

def eye(rng, x, y, s, mode, side, look=(0, 0), lid=0.45, bags=1):
    """hooded eye. side=-1 left (screen), +1 right"""
    o = []
    if mode == 'shock':
        r = s * 1.35
        pts = blob(x, y - 2, r, r * 1.05, rng, n=12, lump=0.03)
        o.append(fill(pts, LILAC, rng, j=0.3))
        o.append(outline(pts, 3.2, rng, breaks=2))
        o.append(f'<circle cx="{x + look[0] * 2:.1f}" cy="{y - 2 + look[1] * 2:.1f}" r="{max(1.6, s * 0.16):.1f}" fill="{INK}"/>')
        return ''.join(o)
    if mode == 'blink':
        o.append(ink([(x - s * 1.1, y - 1), (x - s * 0.3, y + s * 0.35), (x + s * 0.4, y + s * 0.35), (x + s * 1.1, y - 1)], 4.2, rng, taper=(0.25, 0.25)))
        o.append(fine([(x - s * 0.9, y - s * 0.6), (x, y - s * 0.85), (x + s * 0.9, y - s * 0.55)], 1.8, rng))
        for b in range(bags):
            yy = y + s * (0.95 + 0.45 * b)
            o.append(fine([(x - s * 0.8, yy), (x, yy + s * 0.3), (x + s * 0.8, yy)], 1.7, rng))
        return ''.join(o)
    if mode == 'squint':  # joy: closed upturned arcs pushed by cheeks
        o.append(ink([(x - s * 1.1, y + s * 0.3), (x, y - s * 0.45), (x + s * 1.1, y + s * 0.3)], 4.4, rng, taper=(0.3, 0.3)))
        o.append(fine([(x - s * 0.8, y + s * 0.9), (x, y + s * 0.65), (x + s * 0.8, y + s * 0.95)], 1.8, rng))
        o.append(ticks(rng, x + side * s * 1.4, y, 2, 3, 3, ln=5, ang=side * 0.3, w=1.8))
        return ''.join(o)
    # almond white
    w, h = s * 1.15, s * 0.62
    alm = [(x - w, y), (x - w * 0.4, y - h), (x + w * 0.4, y - h), (x + w, y), (x + w * 0.35, y + h * 0.85), (x - w * 0.35, y + h * 0.85)]
    o.append(fill(alm, LILAC, rng, j=0.3))
    pr = s * (0.42 if mode != 'angry' else 0.26)
    px, py = x + look[0] * s * 0.35, y + look[1] * s * 0.2
    o.append(f'<circle cx="{px:.1f}" cy="{py:.1f}" r="{pr:.1f}" fill="{INK}"/>')
    o.append(f'<circle cx="{px - pr * 0.35:.1f}" cy="{py - pr * 0.4:.1f}" r="{pr * 0.28:.1f}" fill="{PALE}"/>')
    # hooded upper lid (skin shade cap)
    if mode == 'angry':
        inner = -side  # inner corner toward nose is lower
        ya, yb = (y + h * 0.35, y - h * 0.35) if inner < 0 else (y - h * 0.35, y + h * 0.35)
        lidpts = [(x - w * 1.1, y - h * 1.6), (x + w * 1.1, y - h * 1.6), (x + w * 1.05, yb), (x - w * 1.05, ya)]
        lash = [(x - w * 1.05, ya), (x + w * 1.05, yb)]
    else:
        ly = y - h + 2 * h * lid
        lidpts = [(x - w * 1.12, y - h * 1.7), (x + w * 1.12, y - h * 1.7), (x + w * 1.08, y + 0.5), (x + w * 0.4, ly), (x - w * 0.4, ly), (x - w * 1.08, y + 0.5)]
        lash = [(x - w * 1.1, y + 1), (x - w * 0.4, ly), (x + w * 0.4, ly), (x + w * 1.1, y + 1)]
    o.append(clip_group(f'e{rng.randrange(1 << 30)}', alm, fill(lidpts, SKIN_D, rng, j=0.2)))
    o.append(ink(lash, 6.0, rng, taper=(0.12, 0.3), wob=0.3))           # thick lash line
    o.append(fine([(x - w * 0.9, y + h * 0.85), (x, y + h * 1.05), (x + w * 0.8, y + h * 0.8)], 1.6, rng))  # lower lid
    o.append(fine([(x - w * 0.95, y - h * 1.35), (x, y - h * 1.75), (x + w * 0.95, y - h * 1.3)], 1.8, rng))  # crease
    for b in range(bags):
        yy = y + h * (1.7 + 0.75 * b)
        o.append(fine([(x - w * 0.85, yy - 2), (x - w * 0.1, yy + h * 0.4), (x + w * 0.75, yy)], 1.7, rng))
    return ''.join(o)


def brow(rng, x, y, s, side, ang, color=INK, bushy=False, w=6):
    """ang>0 raises the outer end; anger = inner end driven down"""
    L = s * (2.0 if bushy else 1.45)
    xi, xo = x - side * L * 0.55, x + side * L * 0.6
    yi, yo = y + ang * -0.0, y - ang * s * 1.1
    mid = ((xi + xo) / 2, min(yi, yo) - s * 0.22)
    if bushy:
        pts = [(xi, yi + 3), mid, (xo, yo + 2), (xo, yo - 6), (mid[0], mid[1] - 9), (xi, yi - 6)]
        o = fill(pts, color, rng, j=0.6) + outline(pts, 3.2, rng, breaks=2) + ink([(xi, yi + 4), mid, (xo, yo + 3)], 4.0, rng, taper=(0.2, 0.5))
        for i in range(7):
            t = i / 6
            px = xi + (xo - xi) * t
            py = yi + (yo - yi) * t - 7
            o += ink([(px, py), (px + side * 4, py - 6)], 2.0, rng, taper=(0.2, 0.6), wob=0.1)
        return o
    return ink([(xi, yi), mid, (xo, yo)], w, rng, taper=(0.15, 0.55), wob=0.4, color=color)


def mouth(rng, x, y, mw, mode, drop=0.0, beard_clear=0):
    """returns (svg, extra_jaw_drop)."""
    o = []
    if mode in ('flat', 'neutral'):
        o.append(ink([(x - mw, y), (x - mw * 0.3, y + 2), (x + mw * 0.4, y + 1), (x + mw, y - 1)], 4.0, rng))
        o.append(fill([(x - mw * 0.5, y + 7), (x + mw * 0.5, y + 7), (x + mw * 0.3, y + 14), (x - mw * 0.3, y + 14)], SKIN_D, rng, j=0.6))
        return ''.join(o), 0
    if mode == 'smirk':
        o.append(ink([(x - mw, y + 3), (x - mw * 0.2, y + 3), (x + mw * 0.6, y - 2), (x + mw * 1.05, y - 10)], 4.2, rng))
        o.append(ink([(x + mw * 1.05, y - 14), (x + mw * 1.2, y - 3)], 2.6, rng, taper=(0.4, 0.4)))  # dimple
        o.append(fill([(x - mw * 0.4, y + 9), (x + mw * 0.5, y + 7), (x + mw * 0.3, y + 15), (x - mw * 0.3, y + 15)], SKIN_D, rng, j=0.6))
        return ''.join(o), 0
    if mode in ('frown', 'sad'):
        o.append(ink([(x - mw, y + 6), (x - mw * 0.3, y - 2), (x + mw * 0.3, y - 2), (x + mw, y + 7)], 4.0, rng))
        o.append(ink([(x - mw * 1.15, y + 9), (x - mw * 1.05, y + 16)], 2.4, rng, taper=(0.4, 0.4)))
        return ''.join(o), 0
    # open mouths: grin / shock / shout
    if mode == 'grin':
        H = mw * 0.75 + drop * 0.25
        top = y - 2
        rim = [(x - mw * 1.15, top - 6), (x - mw * 0.5, top), (x + mw * 0.5, top), (x + mw * 1.15, top - 6),
               (x + mw * 0.8, top + H * 0.75), (x, top + H), (x - mw * 0.8, top + H * 0.75)]
        extra = H * 0.35
    elif mode == 'shock':
        H = mw * 1.25 + drop
        top = y - 4
        rim = [(x - mw * 0.75, top + H * 0.2), (x - mw * 0.4, top - 2), (x + mw * 0.4, top - 2), (x + mw * 0.75, top + H * 0.2),
               (x + mw * 0.6, top + H * 0.8), (x, top + H), (x - mw * 0.6, top + H * 0.8)]
        extra = H * 0.75
    else:  # shout / anger
        H = mw * 1.0 + drop
        top = y - 2
        rim = [(x - mw * 1.0, top + 6), (x - mw * 0.5, top - 3), (x + mw * 0.5, top - 3), (x + mw * 1.0, top + 6),
               (x + mw * 0.75, top + H * 0.85), (x, top + H * 0.92), (x - mw * 0.75, top + H * 0.85)]
        extra = H * 0.6
    # lip rim (thick skin-shade ring) then interior
    big = [(px + (px - x) * 0.18, py + (py - (top + H * 0.45)) * 0.22) for px, py in rim]
    o.append(fill(big, SKIN_D, rng, j=0.5))
    inner = ''
    inner += fill(rim, MOUTH, rng, j=0.3)
    # tongue
    inner += fill(blob(x + mw * 0.1, top + H * 0.95, mw * 0.62, H * 0.32, rng, n=10, lump=0.05), RED, rng, j=0.3)
    inner += fine([(x + mw * 0.1, top + H * 0.72), (x + mw * 0.1, top + H * 0.9)], 1.6, rng)
    # upper gums + teeth one by one
    n = 6 if mode == 'grin' else 4
    tw = (mw * 1.9) / n
    gy = top - 2
    if mode == 'grin':
        inner += fill([(x - mw * 1.2, gy - 4), (x + mw * 1.2, gy - 4), (x + mw * 1.1, gy + 6), (x - mw * 1.1, gy + 6)], RED, rng, j=0.3)
    th = (H * 0.32) if mode == 'grin' else H * 0.2
    for i in range(n):
        tx = x - mw * 0.95 + tw * i
        cur = 3 * math.sin(math.pi * (i + 0.5) / n)
        t = [(tx + 1, gy + 3), (tx + tw - 1, gy + 3), (tx + tw - 1.5, gy + th + cur), (tx + tw * 0.5, gy + th + cur + 2), (tx + 1.5, gy + th + cur)]
        inner += fill(t, PALE, rng, j=0.25) + fine([(tx + tw - 1, gy + 4), (tx + tw - 1.2, gy + th + cur)], 1.3, rng)
    # lower teeth
    ly = top + H * (0.78 if mode == 'grin' else 0.86)
    for i in range(n - 1):
        tx = x - mw * 0.8 + tw * i * 0.95
        t = [(tx + 1, ly), (tx + tw * 0.9, ly), (tx + tw * 0.85, ly - th * 0.55), (tx + 2, ly - th * 0.55)]
        inner += fill(t, PALE_D, rng, j=0.25)
    o.append(clip_group(f'm{rng.randrange(1 << 30)}', rim, inner))
    o.append(outline(rim, 3.6, rng, breaks=2))
    return ''.join(o), extra


def moustache(rng, x, y, mw, kind, color, open_mouth=False):
    o = []
    if kind == 'pencil':
        for sd in (-1, 1):
            pts = [(x + sd * 3, y - 9), (x + sd * mw * 0.6, y - 12), (x + sd * mw * 1.2, y - 8 - (6 if open_mouth else 0)),
                   (x + sd * mw * 1.3, y - 2 - (6 if open_mouth else 0)), (x + sd * mw * 0.6, y + 1), (x + sd * 3, y)]
            o.append(fill(pts, INK, rng, j=0.3))
            for i in range(5):
                px = x + sd * (6 + i * mw * 0.22)
                o.append(ink([(px, y - 2), (px + sd * 2, y + 3)], 1.6, rng, taper=(0.1, 0.9), wob=0))
        return ''.join(o)
    if kind == 'walrus':
        lift = 12 if open_mouth else 0
        pts = [(x - 4, y - 26), (x - mw * 0.9, y - 22), (x - mw * 1.55, y - 4 - lift), (x - mw * 1.6, y + 14 - lift),
               (x - mw * 0.9, y + 6 - lift * 0.6), (x, y + 4 - lift * 0.4), (x + mw * 0.9, y + 6 - lift * 0.6),
               (x + mw * 1.6, y + 14 - lift), (x + mw * 1.55, y - 4 - lift), (x + mw * 0.9, y - 22), (x + 4, y - 26)]
        o.append(fill(pts, color, rng, j=0.5))
        # barbed lower edge
        for i in range(14):
            t = i / 13
            px = x - mw * 1.5 + t * mw * 3.0
            base = y + 6 - lift * 0.5 + 8 * abs(t - 0.5) * 1.4
            o.append(fill([(px - 4, base - 6), (px + 4, base - 6), (px + rng.uniform(-2, 2), base + 7)], color, rng, j=0.2))
            o.append(ink([(px, base - 10), (px + rng.uniform(-1.5, 1.5), base + 6)], 1.6, rng, taper=(0.1, 0.8), wob=0, color=FINE, alpha=0.7))
        o.append(outline(pts, 3.0, rng, breaks=3))
        o.append(dash_rows(rng, x - mw * 1.2, y - 18, x + mw * 1.2, y - 2, 3, 10, ln=6, ang=1.3, w=1.6))
        return ''.join(o)
    if kind == 'handlebar':
        for sd in (-1, 1):
            pts = [(x + sd * 3, y - 8), (x + sd * mw * 0.8, y - 10), (x + sd * mw * 1.5, y - 16), (x + sd * mw * 1.75, y - 28),
                   (x + sd * mw * 1.55, y - 12), (x + sd * mw * 0.8, y), (x + sd * 3, y)]
            o.append(fill(pts, INK, rng, j=0.3))
        return ''.join(o)
    return ''


def beard(rng, x, y, w, h, color):
    pts = [(x - w, y - h * 0.55), (x - w * 0.95, y + h * 0.1), (x - w * 0.6, y + h * 0.75), (x, y + h), (x + w * 0.6, y + h * 0.75),
           (x + w * 0.95, y + h * 0.1), (x + w, y - h * 0.55), (x + w * 0.5, y - h * 0.05), (x, y), (x - w * 0.5, y - h * 0.05)]
    o = fill(pts, color, rng, j=0.6)
    for i in range(22):  # barbed edge
        a = math.pi * (0.05 + 0.9 * i / 21)
        px, py = x - math.cos(a) * w * 0.98, y - h * 0.2 + math.sin(a) * h * 1.15
        o += fill([(px - 5, py - 7), (px + 5, py - 7), (px + rng.uniform(-3, 3), py + 9)], color, rng, j=0.2)
    return o


# ----------------------------------------------------------------- head

def head(c, expr, light=-1):
    """c: character spec dict; expr: neutral/blink/angry/smug/joy/shock/doubt/grief/shh.
    light=-1 means light from screen-left (shade on right)."""
    rng = R(c['name'] + ':skull')
    cy = c.get('cy', -175)
    rx, ryt, ryb = c['rx'], c['ryt'], c['ryb']
    jw = c['jaw']
    E = EXPR[expr]
    mw = c.get('mw', 34)
    my = cy + c.get('mouth_y', 70)
    # mouth first to know jaw drop
    mrng = R(c['name'] + ':mouth:' + E['mouth'])
    msvg, drop = mouth(mrng, 0, my, mw * E.get('mw', 1.0), E['mouth'], drop=E.get('drop', 0))
    if c.get('lips') and E['mouth'] in ('flat', 'neutral', 'smirk', 'frown', 'sad'):
        lr_ = R(c['name'] + ':lips')
        up = -4 if E['mouth'] in ('frown', 'sad') else 0
        lip = [(-mw * 0.9, my + up), (-mw * 0.35, my - 8), (0, my - 4), (mw * 0.35, my - 8), (mw * 0.9, my + (-6 if E['mouth'] == 'smirk' else 0)), (mw * 0.4, my + 11), (-mw * 0.4, my + 11)]
        msvg = fill(lip, c['lips'], lr_, j=0.3) + fill(blob(-mw * 0.2, my + 5, mw * 0.2, 3, lr_, n=6), SKIN_L, lr_, alpha=0.7) + msvg
    drop = drop * c.get('dropk', 1.0)
    # head outline: cranium arc + jaw with drop
    pts = []
    for i in range(9):  # top arc from left cheek over to right cheek
        a = math.pi + math.pi * i / 8
        lump = 1 + 0.04 * math.sin(3 * a + 1.3) + 0.03 * math.sin(5 * a)
        pts.append((rx * lump * math.cos(a), cy + ryt * lump * math.sin(a)))
    chin_y = cy + ryb + drop
    cw = c.get('chin', 0.45)
    pts += [(rx * 0.98, cy + ryb * 0.25), (jw, cy + ryb * 0.7 + drop * 0.75), (jw * cw, chin_y - 6), (0, chin_y + 2),
            (-jw * cw, chin_y - 6), (-jw, cy + ryb * 0.7 + drop * 0.75), (-rx * 0.98, cy + ryb * 0.25)]
    pts = jitter(pts, rng, 0.8)
    o = []
    # neck
    nw = c.get('neck', 46)
    neck = [(-nw, cy + ryb * 0.5), (nw, cy + ryb * 0.5), (nw * 1.05, 30), (-nw * 1.05, 30)]
    o.append(fill(neck, SKIN_D, rng, j=0.5) + ink([(-nw, cy + ryb * 0.7), (-nw * 1.05, 24)], 3.2, rng) + ink([(nw, cy + ryb * 0.7), (nw * 1.05, 24)], 3.2, rng))
    # ears behind
    er = c.get('ear', 26)
    for sd in (-1, 1):
        erng = R(c['name'] + f':ear{sd}')
        ex = sd * (rx * 0.97 + er * 0.35)
        ep = blob(ex, cy + 8, er * 0.75, er * 1.15, erng, n=10, lump=0.08, rot=sd * 0.25)
        o.append(fill(ep, SKIN if sd == light else SKIN_D, erng, j=0.4) + outline(ep, 3.4, erng, breaks=2))
        o.append(ink([(ex - sd * er * 0.2, cy - er * 0.55), (ex + sd * er * 0.25, cy - er * 0.2), (ex + sd * er * 0.05, cy + er * 0.45), (ex - sd * er * 0.2, cy + er * 0.25)], 2.6, erng, taper=(0.3, 0.6)))
    # jowls / double chin under face
    if c.get('jowls'):
        jr = R(c['name'] + ':jowl')
        for sd in (-1, 1):
            jp = blob(sd * jw * 0.92, cy + ryb * 0.78 + drop * 0.8, jw * 0.36, ryb * 0.3, jr, n=10, lump=0.05)
            o.append(fill(jp, SKIN if sd == light else SKIN_D, jr, j=0.4) + outline(jp, 3.2, jr, breaks=2))
    if c.get('dchin'):
        dr = R(c['name'] + ':dchin')
        dp = blob(0, chin_y + 14, jw * 0.62, 24, dr, n=10, lump=0.04)
        o.append(fill(dp, SKIN_D, dr, j=0.4) + outline(dp, 3.0, dr, breaks=2))
    # face fill + side shade (hard diagonal) + highlights
    o.append(fill(pts, SKIN, rng, j=0.3))
    sh = ''
    sx = -light
    sh += fill([(sx * rx * 0.35, cy - ryt * 1.2), (sx * rx * 1.4, cy - ryt * 1.2), (sx * rx * 1.4, chin_y + 40), (sx * rx * 0.05, chin_y + 40)], SKIN_D, rng, j=0)
    sh += fill([(-rx * 1.4, chin_y - 26), (rx * 1.4, chin_y - 34), (rx * 1.4, chin_y + 60), (-rx * 1.4, chin_y + 60)], SKIN_D, rng, j=0, alpha=0.0) if False else ''
    # cheekbone / forehead light
    hl = R(c['name'] + ':hl')
    sh += fill(blob(light * rx * 0.45, cy + 18, rx * 0.22, ryb * 0.14, hl, n=8, lump=0.1), SKIN_L, hl, j=0.3)
    sh += fill(blob(light * rx * 0.2, cy - ryt * 0.62, rx * 0.3, ryt * 0.12, hl, n=8, lump=0.1, rot=-0.2), SKIN_L, hl, j=0.3)
    if c.get('hatshade'):
        sh += fill([(-rx * 1.3, cy - ryt * 1.3), (rx * 1.3, cy - ryt * 1.3), (rx * 1.3, cy - ryt * 0.55 + c['hatshade']), (-rx * 1.3, cy - ryt * 0.62 + c['hatshade'] + 10)], SKIN_D, rng, j=0)
    if c.get('blush'):
        for sd in (-1, 1):
            sh += fill(blob(sd * rx * 0.55, cy + 30, rx * 0.2, 18, hl, n=8, lump=0.1), RED, hl, j=0.3, alpha=0.28)
    o.append(clip_group(f'f{rng.randrange(1 << 30)}', pts, sh))
    # hair (under hat)
    c = dict(c, _ryb=ryb)
    if not c.get('hair_over'): o.append(hair(c, cy, rx, ryt))
    # skin texture: pores + stubble + wrinkles following skull
    tr = R(c['name'] + ':tex')
    tex = dots(tr, 0, cy + 10, rx * 0.8, ryb * 0.6, c.get('pores', 26), r=1.0, alpha=0.45)
    if c.get('stubble'):
        tex += ticks(tr, 0, chin_y - ryb * 0.35, jw * 0.95, ryb * 0.35, c['stubble'], ln=4, ang=1.5, w=1.6, alpha=0.6)
    for k in range(c.get('fwrinkles', 2)):
        yy = cy - ryt * (0.42 + 0.12 * k)
        tex += fine([(-rx * 0.45, yy + 6), (-rx * 0.15, yy), (rx * 0.15, yy), (rx * 0.45, yy + 6)], 1.7, tr)
    o.append(clip_group(f't{tr.randrange(1 << 30)}', pts, tex))
    # eyes, brows
    es, ex, ey = c.get('es', 14), c.get('ex', 34), cy + c.get('eye_y', -8)
    for sd in (-1, 1):
        erng = R(c['name'] + f':eye{sd}:{E["eye"]}')
        o.append(eye(erng, sd * ex, ey, es, E['eye'], sd, look=E.get('look', (0, 0)), lid=E.get('lid', c.get('lid', 0.45)), bags=c.get('bags', 1)))
        brng = R(c['name'] + f':brow{sd}')
        ang = E['brow'] if not E.get('brow_asym') else (E['brow'] if sd < 0 else E['brow_asym'])
        o.append(brow(brng, sd * (ex + 2), ey - es * (1.5 + (0.7 if E['eye'] == 'shock' else 0)) - E.get('brow_up', 0), es, sd, ang,
                      color=c.get('brow_color', INK), bushy=c.get('bushy', False), w=c.get('brow_w', 6)))
    # nose
    o.append(nose(c, cy, E))
    # nasolabial folds (deeper with age)
    fr = R(c['name'] + ':folds')
    fd = c.get('folds', 1)
    for sd in ((-1, 1) if fd else ()):
        fx = sd * (c.get('fold_x', 30))
        o.append(ink([(fx, cy + 18), (fx + sd * 12, my - 8), (fx + sd * 14 + sd * (drop * 0.1), my + 14 + drop * 0.5)], 2.0 + fd, fr, taper=(0.3, 0.6), color=INK if fd > 1 else FINE, alpha=1 if fd > 1 else 0.8))
    # mouth + facial hair
    o.append(msvg)
    if c.get('beard'):
        o.append(beard(R(c['name'] + ':beard'), 0, my + 8, jw * 1.05, ryb * 0.55 + drop, c.get('beard_color', INK)))
    if c.get('mous'):
        o.append(moustache(R(c['name'] + ':mous'), 0, my - c.get('mous_dy', 6), c.get('mous_w', 30), c['mous'], c.get('mous_color', INK), open_mouth=E['mouth'] in ('grin', 'shock', 'shout')))
    cr_ = R(c['name'] + ':contour')
    if not c.get('young'): o.append(ink([(-light * rx * 0.62, cy + 10), (-light * rx * 0.7, cy + ryb * 0.45 + drop * 0.5), (-light * jw * 0.7, cy + ryb * 0.75 + drop * 0.8)], 2.4, cr_, taper=(0.5, 0.5), color=FINE, alpha=0.85))
    o.append(ink([(-jw * 0.18, chin_y - 18), (0, chin_y - 22), (jw * 0.18, chin_y - 18)], 2.0, cr_, taper=(0.4, 0.4), color=FINE, alpha=0.8))
    for sd in (() if c.get('young') else (-1, 1)):
        o.append(ticks(cr_, sd * (ex + es * 1.6), ey + 2, 3, 4, 3, ln=6, ang=(0.2 if sd > 0 else math.pi - 0.2), w=1.6))
    xr = R(c['name'] + ':extras')
    if c.get('freckles'):
        for sd in (-1, 1):
            o.append(dots(xr, sd * (ex + 6), ey + es * 2.6, es * 1.6, es * 0.7, 14, r=2.0, color=SKIN_D, alpha=0.95))
    if c.get('lashes') and E['eye'] not in ('shock',):
        for sd in (-1, 1):
            x0 = sd * (ex + es * 1.05)
            for k2 in range(3):
                o.append(ink([(x0 - sd * k2 * 5, ey - 2 - k2 * 3), (x0 + sd * (10 - k2 * 2), ey - 12 - k2 * 5)], 3.0, xr, taper=(0.1, 0.9), wob=0))
    if c.get('glasses'):
        for sd in (-1, 1):
            gp = blob(sd * ex, ey + 2, es * 1.75, es * 1.6, xr, n=14, lump=0.02)
            o.append(fill(gp, PALE, xr, alpha=0.18) + outline(gp, 4.2, xr, breaks=2).replace(INK, GOLD_D) + outline(gp, 2.0, xr, breaks=1))
            o.append(sparkle(sd * ex - es * 0.8, ey - es * 0.6, 7))
        o.append(ink([(-ex + es * 1.7, ey - 2), (0, ey - 8), (ex - es * 1.7, ey - 2)], 3.6, xr, color=GOLD_D))
    if c.get('earring'):
        for sd in (-1, 1):
            o.append(f'<circle cx="{sd * (rx + 4):.0f}" cy="{cy + 46}" r="7" fill="{GOLD}"/>' + sparkle(sd * (rx + 2), cy + 42, 5))
    # outline
    o.append(outline(pts, c.get('lw', 4.2), R(c['name'] + ':ol'), breaks=3))
    if c.get('hair_over'): o.append(hair(c, cy, rx, ryt))
    o.append(hat(c, cy, rx, ryt))
    return ''.join(o)


def nose(c, cy, E):
    rng = R(c['name'] + ':nose')
    k = c.get('nose', 'long')
    o = []
    if k == 'long':  # long pointed nose, slight hook, tip juts out
        L = c.get('nose_len', 70)
        tw = c.get('nose_w', 15)
        pts = [(-7, cy - 26), (7, cy - 26), (tw * 0.9, cy + L * 0.45), (tw * 1.6, cy + L * 0.88), (tw * 1.2, cy + L + 8), (0, cy + L + 10),
               (-tw * 1.2, cy + L + 4), (-tw * 1.0, cy + L * 0.7), (-tw * 0.6, cy + L * 0.4)]
        o.append(fill(pts, SKIN, rng, j=0.3))
        o.append(clip_group(f'n{rng.randrange(1 << 30)}', pts, fill([(4, cy - 30), (60, cy - 30), (60, cy + L + 20), (-4, cy + L + 20)], SKIN_D, rng, j=0)))
        o.append(ink([(7, cy - 24), (tw * 0.95, cy + L * 0.45), (tw * 1.6, cy + L * 0.88), (tw * 1.2, cy + L + 8), (0, cy + L + 10)], 4.0, rng, taper=(0.5, 0.25)))
        o.insert(0, fill(blob(tw * 0.6, cy + L + 18, tw * 1.6, 7, rng, n=8, lump=0.05), SKIN_D, rng, j=0.3))  # cast shade under nose
        o.append(ink([(-6, cy - 14), (-tw * 0.6, cy + L * 0.42), (-tw * 1.0, cy + L * 0.72)], 3.4, rng, taper=(0.5, 0.3)))
        o.append(ink([(-tw * 1.3, cy + L - 4), (-tw * 1.45, cy + L + 3), (-tw * 0.8, cy + L + 8)], 3.0, rng, taper=(0.3, 0.3)))
        o.append(f'<ellipse cx="{-tw * 0.35:.1f}" cy="{cy + L + 4:.1f}" rx="{5 if not E.get("flare") else 7}" ry="2.6" fill="{INK}"/>')
        o.append(fill(blob(-tw * 0.1, cy + L * 0.75, 6, 9, rng, n=6), SKIN_L, rng, j=0.2))
        o.append(dots(rng, tw * 0.2, cy + L * 0.8, tw * 0.8, 10, 6, r=1.0, alpha=0.6))
    elif k == 'bulb':
        r = c.get('nose_r', 30)
        L = c.get('nose_len', 40)
        o.append(ink([(-8, cy - 14), (-12, cy + L * 0.5)], 2.6, rng, taper=(0.5, 0.3), color=FINE, alpha=0.8))
        bp = blob(2, cy + L, r, r * 0.85, rng, n=10, lump=0.08)
        o.append(fill(bp, SKIN, rng, j=0.4))
        o.append(clip_group(f'n{rng.randrange(1 << 30)}', bp, fill([(6, cy + L - r * 2), (r * 2, cy + L - r * 2), (r * 2, cy + L + r * 2), (-r * 0.5, cy + L + r * 2)], SKIN_D, rng, j=0) + fill(blob(2, cy + L, r, r, rng), RED, rng, alpha=0.22)))
        o.append(outline(bp, 3.6, rng, breaks=2))
        for sd in (-1, 1):
            nx = 2 + sd * r * 0.55
            fl = 1.3 if E.get('flare') else 1.0
            o.append(f'<ellipse cx="{nx:.1f}" cy="{cy + L + r * 0.55:.1f}" rx="{5 * fl:.1f}" ry="{3:.1f}" fill="{INK}"/>')
        o.append(fill(blob(-r * 0.3, cy + L - r * 0.35, r * 0.25, r * 0.18, rng, n=6), SKIN_L, rng, j=0.2))
        o.append(dots(rng, 2, cy + L + 4, r * 0.7, r * 0.5, 10, r=1.1, alpha=0.6))
    elif k == 'button':
        r = c.get('nose_r', 16)
        L = c.get('nose_len', 34)
        o.append(ink([(-4, cy - 8), (-8, cy + L * 0.6)], 2.4, rng, taper=(0.5, 0.3), color=FINE, alpha=0.8))
        bp = blob(0, cy + L, r * 1.2, r, rng, n=10, lump=0.06)
        o.append(fill(bp, SKIN, rng, j=0.3) + clip_group(f'n{rng.randrange(1 << 30)}', bp, fill([(2, cy + L - 40), (60, cy + L - 40), (60, cy + L + 40), (-6, cy + L + 40)], SKIN_D, rng, j=0)))
        o.append(ink([(-r * 1.2, cy + L - 2), (-r * 0.6, cy + L + r * 0.9), (r * 0.6, cy + L + r * 0.9), (r * 1.2, cy + L - 2)], 3.2, rng, taper=(0.3, 0.3)))
        for sd in (-1, 1):
            o.append(f'<ellipse cx="{sd * r * 0.5:.1f}" cy="{cy + L + r * 0.45:.1f}" rx="{4 * (1.3 if E.get("flare") else 1):.1f}" ry="2.4" fill="{INK}"/>')
        o.append(fill(blob(-r * 0.35, cy + L - r * 0.35, r * 0.3, r * 0.22, rng, n=6), SKIN_L, rng, j=0.2))
    elif k == 'hook':
        L = c.get('nose_len', 55)
        pts = [(-8, cy - 16), (6, cy - 18), (26, cy + L * 0.5), (22, cy + L), (4, cy + L + 4), (-10, cy + L - 2)]
        o.append(fill(pts, SKIN, rng, j=0.3) + outline(pts, 3.4, rng, breaks=2))
        o.append(f'<ellipse cx="{6}" cy="{cy + L - 1}" rx="5" ry="2.5" fill="{INK}"/>')
    return ''.join(o)


def hair(c, cy, rx, ryt):
    k = c.get('hair')
    rng = R(c['name'] + ':hair')
    if k == 'slick':
        pts = [(-rx * 1.02, cy - 10), (-rx * 1.04, cy - ryt * 0.6), (-rx * 0.6, cy - ryt * 0.98), (0, cy - ryt * 1.06), (rx * 0.6, cy - ryt * 0.98),
               (rx * 1.04, cy - ryt * 0.6), (rx * 1.02, cy - 10), (rx * 0.9, cy - 30), (rx * 0.85, cy - ryt * 0.55), (rx * 0.2, cy - ryt * 0.72),
               (-rx * 0.5, cy - ryt * 0.6), (-rx * 0.85, cy - ryt * 0.5), (-rx * 0.9, cy - 30)]
        o = fill(pts, INK, rng, j=0.4)
        o += ink([(-rx * 0.7, cy - ryt * 0.8), (-rx * 0.1, cy - ryt * 0.93), (rx * 0.4, cy - ryt * 0.9)], 5, rng, color=BLUE_L, taper=(0.3, 0.5))
        return o
    if k == 'fringe':  # bald dome with barbed pale tufts over the ears
        o = fill(blob(-rx * 0.35, cy - ryt * 0.7, rx * 0.22, ryt * 0.1, rng, n=8, rot=-0.4), SKIN_L, rng)
        col = c.get('hair_color', PALE)
        for sd in (-1, 1):
            pts = [(sd * rx * 0.78, cy - ryt * 0.62), (sd * rx * 1.02, cy - ryt * 0.6), (sd * rx * 1.16, cy - ryt * 0.4), (sd * rx * 1.2, cy - ryt * 0.1),
                   (sd * rx * 1.12, cy + 14), (sd * rx * 0.98, cy + 4), (sd * rx * 0.9, cy - ryt * 0.3)]
            o += fill(pts, col, rng, j=0.5)
            for i in range(7):
                t = i / 6
                px = sd * (rx * 1.02 + rx * 0.16 * math.sin(t * 3.0))
                py = cy - ryt * 0.58 + t * (ryt * 0.58 + 14)
                o += fill([(px - sd * 6, py - 6), (px - sd * 6, py + 6), (px + sd * 12, py + rng.uniform(-3, 3))], col, rng, j=0.3)
            o += outline(pts, 2.8, rng, breaks=2)
            o += dash_rows(rng, min(sd * rx * 0.85, sd * rx * 1.12), cy - ryt * 0.5, max(sd * rx * 0.85, sd * rx * 1.12), cy, 5, 3, ln=7, ang=1.4, w=1.6)
        return o
    if k == 'spiky':  # messy pointed tufts, a few falling over the forehead
        col = c.get('hair_color', GOLD)
        dk = GOLD_D if col == GOLD else INK
        o = ''
        cap = [(-rx * 1.0, cy - 30), (-rx * 1.0, cy - ryt * 0.75), (-rx * 0.5, cy - ryt * 1.05), (rx * 0.5, cy - ryt * 1.05), (rx * 1.0, cy - ryt * 0.75), (rx * 1.0, cy - 30),
               (rx * 0.85, cy - ryt * 0.45), (-rx * 0.85, cy - ryt * 0.45)]
        tufts = []
        for i in range(11):
            a = math.pi + 0.15 + (math.pi - 0.3) * i / 10
            bx, by = rx * 0.92 * math.cos(a), cy - ryt * 0.55 + ryt * 0.62 * math.sin(a)
            L = ryt * (0.42 + 0.22 * ((i * 7) % 5) / 4)
            ta = a + rng.uniform(-0.25, 0.25) + 0.15
            tip = (bx + math.cos(ta) * L, by + math.sin(ta) * L)
            w = rx * 0.2
            nrm = (-math.sin(a), math.cos(a))
            tufts.append([(bx + nrm[0] * w, by + nrm[1] * w), tip, (bx - nrm[0] * w, by - nrm[1] * w)])
        for k2, xx in enumerate((-0.45, -0.1, 0.3)):  # forehead tufts
            tufts.append([(rx * (xx - 0.18), cy - ryt * 0.62), (rx * (xx + 0.08), cy - ryt * 0.4 + k2 * 5), (rx * (xx + 0.22), cy - ryt * 0.6)])
        o += fill(cap, col, rng, j=0.4)
        for t in tufts:
            o += fill(t, col, rng, j=0.3)
        o += clip_group(f'sp{rng.randrange(1 << 30)}', [(rx * 0.15, cy - ryt * 2.2), (rx * 2, cy - ryt * 2.2), (rx * 2, cy), (rx * 0.35, cy)],
                        ''.join(fill(t, dk, rng, j=0.3) for t in tufts) + fill(cap, dk, rng, j=0.4))
        for t in tufts:
            o += ink([t[0], t[1], t[2]], 3.2, rng, taper=(0.3, 0.3))
            o += ink([((t[0][0] + t[2][0]) / 2, (t[0][1] + t[2][1]) / 2), ((t[0][0] + t[2][0]) / 2 * 0.4 + t[1][0] * 0.6, (t[0][1] + t[2][1]) / 2 * 0.4 + t[1][1] * 0.6)], 1.8, rng, color=FINE, alpha=0.8, taper=(0.2, 0.8))
        for sd in (-1, 1):
            o += ink([(sd * rx * 1.0, cy - ryt * 0.7), (sd * rx * 1.0, cy - 30)], 3.4, rng)
        return o
    if k == 'quiff':  # pompadour: big swept wave cresting forward over the forehead, shaved sides
        col = c.get('hair_color', RED)
        dk = RED_D if col == RED else INK
        pts = [(-rx * 0.98, cy - 34), (-rx * 1.02, cy - ryt * 0.62), (-rx * 0.85, cy - ryt * 0.98), (-rx * 0.45, cy - ryt * 1.32), (rx * 0.05, cy - ryt * 1.55),
               (rx * 0.6, cy - ryt * 1.6), (rx * 1.05, cy - ryt * 1.42), (rx * 1.18, cy - ryt * 1.12), (rx * 0.98, cy - ryt * 0.98), (rx * 0.75, cy - ryt * 1.08),
               (rx * 0.92, cy - ryt * 0.78), (rx * 1.0, cy - 34), (rx * 0.86, cy - ryt * 0.5), (rx * 0.45, cy - ryt * 0.7), (-rx * 0.2, cy - ryt * 0.72), (-rx * 0.86, cy - ryt * 0.46)]
        o = fill(pts, col, rng, j=0.6)
        o += clip_group(f'q{rng.randrange(1 << 30)}', pts, fill([(rx * 0.2, cy - ryt * 2), (rx * 2, cy - ryt * 2), (rx * 2, cy), (rx * 0.5, cy)], dk, rng, j=0))
        for i in range(8):  # strands following the wave
            t = i / 7
            a0 = (-rx * 0.8 + t * rx * 1.2, cy - ryt * (0.62 + 0.1 * t))
            a1 = (-rx * 0.5 + t * rx * 1.25, cy - ryt * (1.15 + 0.3 * math.sin(t * 2.6)))
            a2 = (-rx * 0.1 + t * rx * 1.15, cy - ryt * (1.38 + 0.18 * math.sin(t * 2.6)))
            o += ink([a0, a1, a2], 2.4, rng, color=FINE if i % 2 else INK, alpha=0.75, taper=(0.3, 0.7))
        o += ink([(rx * 0.98, cy - ryt * 0.98), (rx * 0.72, cy - ryt * 1.02), (rx * 0.8, cy - ryt * 1.2), (rx * 1.0, cy - ryt * 1.15)], 3.4, rng, taper=(0.2, 0.6))  # front curl
        o += fill(blob(-rx * 0.2, cy - ryt * 1.25, rx * 0.3, ryt * 0.07, rng, n=8, rot=-0.5), PALE, rng, alpha=0.55)
        o += outline(pts, 3.8, rng, breaks=3)
        for sd in (-1, 1):
            o += dots(rng, sd * rx * 0.93, cy - ryt * 0.25, rx * 0.06, ryt * 0.2, 30, r=1.3, color=dk, alpha=0.9)
        return o
    if k == 'bob':  # heavy blunt bob with straight bangs, covers the ears
        col = c.get('hair_color', INK)
        ryb = c.get('_ryb', ryt)
        back = [(-rx * 1.25, cy + ryb * 0.45), (-rx * 1.3, cy - ryt * 0.5), (-rx * 0.8, cy - ryt * 1.12), (0, cy - ryt * 1.22), (rx * 0.8, cy - ryt * 1.12),
                (rx * 1.3, cy - ryt * 0.5), (rx * 1.25, cy + ryb * 0.45), (rx * 0.95, cy + ryb * 0.5), (rx * 0.88, cy - ryt * 0.46), (-rx * 0.88, cy - ryt * 0.46), (-rx * 0.95, cy + ryb * 0.5)]
        o = fill(back, col, rng, j=0.5)
        bang = [(-rx * 1.0, cy - ryt * 0.42), (-rx * 0.85, cy - ryt * 0.95), (0, cy - ryt * 1.1), (rx * 0.85, cy - ryt * 0.95), (rx * 1.0, cy - ryt * 0.42), (rx * 0.6, cy - ryt * 0.5), (0, cy - ryt * 0.47), (-rx * 0.6, cy - ryt * 0.5)]
        o += fill(bang, col, rng, j=0.4)
        o += ink([(-rx * 0.7, cy - ryt * 0.85), (-rx * 0.1, cy - ryt * 1.0), (rx * 0.5, cy - ryt * 0.92)], 6, rng, color=BLUE_L, taper=(0.3, 0.5))
        for i in range(10):
            x = -rx * 0.9 + i * rx * 0.2
            o += ink([(x, cy - ryt * 0.9), (x + 2, cy - ryt * 0.52)], 1.6, rng, color=BLUE_L, alpha=0.6)
        return o
    if k == 'cropped':
        pts = [(-rx * 1.0, cy - 20), (-rx * 0.8, cy - ryt * 0.85), (0, cy - ryt * 1.04), (rx * 0.8, cy - ryt * 0.85), (rx * 1.0, cy - 20), (rx * 0.85, cy - ryt * 0.5), (0, cy - ryt * 0.66), (-rx * 0.85, cy - ryt * 0.5)]
        return fill(pts, INK, rng, j=0.4)
    return ''


def hat(c, cy, rx, ryt):
    k = c.get('hat')
    rng = R(c['name'] + ':hat')
    o = []
    if k == 'top':
        by = cy - ryt * 0.62
        brim = [(-rx * 1.35, by + 4), (-rx * 1.1, by - 10), (rx * 1.1, by - 10), (rx * 1.35, by + 4), (rx * 1.15, by + 14), (-rx * 1.15, by + 14)]
        crown = [(-rx * 0.82, by - 6), (-rx * 0.9, by - 230), (-rx * 0.6, by - 240), (rx * 0.6, by - 240), (rx * 0.9, by - 230), (rx * 0.82, by - 6)]
        o.append(fill(crown, INK, rng, j=0.6))
        o.append(fill([(-rx * 0.66, by - 200), (-rx * 0.56, by - 206), (-rx * 0.52, by - 70), (-rx * 0.6, by - 66)], BLUE_D, rng, j=0.4))  # sheen
        o.append(fill([(-rx * 0.83, by - 42), (rx * 0.83, by - 42), (rx * 0.82, by - 12), (-rx * 0.82, by - 12)], RED, rng, j=0.2))  # band
        o.append(fill(brim, INK, rng, j=0.6))
        o.append(sparkle(-rx * 0.55, by - 190, 12, PALE))
        o.append(outline(crown, 3.6, rng, breaks=2))
    elif k == 'bowler':
        by = cy - ryt * 0.55
        brim = [(-rx * 1.3, by + 6), (-rx * 1.05, by - 10), (rx * 1.05, by - 10), (rx * 1.3, by + 6), (rx * 1.1, by + 16), (-rx * 1.1, by + 16)]
        dome = [(-rx * 0.95, by - 4)] + [(rx * 0.95 * math.cos(math.pi + math.pi * i / 10), by - 6 + ryt * 0.95 * math.sin(math.pi + math.pi * i / 10)) for i in range(11)] + [(rx * 0.95, by - 4)]
        o.append(fill(dome, INK, rng, j=0.5))
        o.append(fill(blob(-rx * 0.35, by - ryt * 0.62, rx * 0.22, ryt * 0.12, rng, n=8, rot=-0.5), BLUE_D, rng))
        o.append(fill([(-rx * 0.95, by - 30), (rx * 0.95, by - 30), (rx * 0.95, by - 6), (-rx * 0.95, by - 6)], RED_D, rng, j=0.3))
        o.append(fill(brim, INK, rng, j=0.5))
        o.append(sparkle(-rx * 0.4, by - ryt * 0.7, 10, PALE))
    elif k == 'cap':  # flat cap (cobalt tweed)
        by = cy - ryt * 0.5
        pts = [(-rx * 1.08, by + 10), (-rx * 1.0, by - ryt * 0.45), (0, by - ryt * 0.62), (rx * 1.05, by - ryt * 0.4), (rx * 1.4, by + 8), (rx * 1.0, by + 20), (-rx * 1.0, by + 18)]
        o.append(fill(pts, BLUE_D, rng, j=0.5))
        o.append(dash_rows(rng, -rx * 0.9, by - ryt * 0.45, rx * 1.0, by + 10, 4, 12, ln=5, ang=0.6, w=1.7, color=BLUE_L, alpha=0.7))
        o.append(outline(pts, 3.6, rng, breaks=2))
    elif k == 'kepi':
        by = cy - ryt * 0.55
        pts = [(-rx * 0.9, by + 6), (-rx * 0.8, by - 120), (rx * 0.8, by - 120), (rx * 0.9, by + 6)]
        o.append(fill(pts, RED, rng, j=0.4))
        o.append(fill([(-rx * 0.9, by - 30), (rx * 0.9, by - 30), (rx * 0.9, by + 6), (-rx * 0.9, by + 6)], BLUE, rng, j=0.4))
        o.append(fill([(-rx * 1.0, by + 4), (rx * 1.0, by + 4), (rx * 0.6, by + 30), (-rx * 0.6, by + 30)], INK, rng, j=0.4))
        o.append(fill(blob(0, by - 60, 14, 14, rng), GOLD, rng) + sparkle(-6, by - 66, 6))
        o.append(outline(pts, 3.4, rng, breaks=2))
    return ''.join(o)


EXPR = {
    'neutral': dict(eye='hood', brow=0.1, mouth='flat'),
    'blink': dict(eye='blink', brow=0.1, mouth='flat'),
    'angry': dict(eye='angry', brow=-0.9, mouth='shout', drop=6, flare=True, brow_up=-8),
    'smug': dict(eye='hood', lid=0.65, brow=0.5, brow_asym=0.0, mouth='smirk', look=(1, 0), brow_up=4),
    'joy': dict(eye='squint', brow=0.6, mouth='grin', drop=10, brow_up=10),
    'shock': dict(eye='shock', brow=1.0, mouth='shock', drop=26, brow_up=14),
    'doubt': dict(eye='hood', lid=0.6, brow=-0.5, brow_asym=0.7, mouth='frown', look=(-1, 0)),
    'grief': dict(eye='hood', lid=0.7, brow=0.9, brow_asym=0.9, mouth='sad', look=(0, 1), brow_up=-2),
    'talk': dict(eye='hood', brow=0.3, mouth='shout', drop=0, mw=0.7),
}

# ----------------------------------------------------------------- hands

def finger(rng, x0, y0, ang, L, w, curl=0.0, lit=True, nail=True, ring=False):
    """padded finger from knuckle (x0,y0) pointing at ang; curl bends segments"""
    segs = [0.45, 0.32, 0.23]
    pts = [(x0, y0)]
    a = ang
    x, y = x0, y0
    joints = []
    for i, s in enumerate(segs):
        x += math.cos(a) * L * s
        y += math.sin(a) * L * s
        pts.append((x, y))
        joints.append((x, y, a))
        a += curl
    left, right = [], []
    for i, (px, py) in enumerate(pts):
        aa = joints[min(i, len(joints) - 1)][2] if i else ang
        n = (-math.sin(aa), math.cos(aa))
        ww = w * (1.0 if i == 0 else (0.98 if i == 1 else 0.9 if i == 2 else 0.75)) / 2
        bulge = 1.08 if 0 < i < len(pts) - 1 else 1.0
        left.append((px + n[0] * ww * bulge, py + n[1] * ww * bulge))
        right.append((px - n[0] * ww * bulge, py - n[1] * ww * bulge))
    tipx, tipy, ta = joints[-1]
    tip = (tipx + math.cos(ta) * w * 0.42, tipy + math.sin(ta) * w * 0.42)
    poly = left + [tip] + right[::-1]
    col = SKIN if lit else SKIN_D
    o = fill(poly, col, rng, j=0.25)
    if not lit:
        pass
    else:
        o += fill([left[1], left[2], ((left[2][0] + pts[2][0]) / 2, (left[2][1] + pts[2][1]) / 2), ((left[1][0] + pts[1][0]) / 2, (left[1][1] + pts[1][1]) / 2)], SKIN_L, rng, j=0.2)
    o += outline(poly, 3.0, rng, breaks=2)
    for (jx, jy, ja) in joints[:-1]:  # crease ticks at knuckles
        n = (-math.sin(ja), math.cos(ja))
        o += ink([(jx + n[0] * w * 0.3, jy + n[1] * w * 0.3), (jx - n[0] * w * 0.1, jy - n[1] * w * 0.1)], 1.7, rng, taper=(0.3, 0.3), wob=0, color=FINE, alpha=0.85)
    if nail:  # short dark nail stopping at the fingertip
        nx, ny = tipx + math.cos(ta) * w * 0.05, tipy + math.sin(ta) * w * 0.05
        nl = w * 0.32
        n = (-math.sin(ta), math.cos(ta))
        npts = [(nx + n[0] * w * 0.22, ny + n[1] * w * 0.22), (nx + math.cos(ta) * nl + n[0] * w * 0.2, ny + math.sin(ta) * nl + n[1] * w * 0.2),
                (nx + math.cos(ta) * nl - n[0] * w * 0.2, ny + math.sin(ta) * nl - n[1] * w * 0.2), (nx - n[0] * w * 0.22, ny - n[1] * w * 0.22)]
        o += fill(npts, SKIN_D if lit else '#9e4a3c', rng, j=0.1) + ink([npts[0], npts[3]], 1.4, rng, wob=0, color=FINE, alpha=0.9)
    if ring:
        jx, jy, ja = joints[0]
        jx, jy = (x0 + jx) / 2, (y0 + jy) / 2
        n = (-math.sin(ja), math.cos(ja))
        rp = [(jx + n[0] * w * 0.6 - math.cos(ja) * 3, jy + n[1] * w * 0.6 - math.sin(ja) * 3), (jx + n[0] * w * 0.6 + math.cos(ja) * 4, jy + n[1] * w * 0.6 + math.sin(ja) * 4),
              (jx - n[0] * w * 0.6 + math.cos(ja) * 4, jy - n[1] * w * 0.6 + math.sin(ja) * 4), (jx - n[0] * w * 0.6 - math.cos(ja) * 3, jy - n[1] * w * 0.6 - math.sin(ja) * 3)]
        o += fill(rp, GOLD, rng, j=0.1) + outline(rp, 1.8, rng, breaks=1) + sparkle(rp[0][0], rp[0][1], 5)
    return o


def hand(name, kind, lit=True, size=1.0, ring=False):
    """hand with wrist at (0,0), pointing toward +x. kinds: open, fist, point, hold, relaxed, rub, shh"""
    rng = R(f'{name}:hand:{kind}:{lit}')
    s = size
    o = []
    col = SKIN if lit else SKIN_D
    palm = [(-6 * s, -20 * s), (30 * s, -26 * s), (52 * s, -22 * s), (56 * s, 16 * s), (40 * s, 26 * s), (4 * s, 22 * s)]
    fw = 15 * s
    if kind == 'open':
        fingers = [(-0.42, 54, 0.05), (-0.14, 60, 0.05), (0.13, 57, 0.06), (0.38, 46, 0.08)]
        th = (-1.25, 44, 0.25)
    elif kind == 'point':
        fingers = [(-0.2, 62, 0.0), (0.05, 30, 2.2), (0.25, 28, 2.2), (0.45, 24, 2.1)]
        th = (-1.0, 40, 0.5)
    elif kind == 'fist':
        fingers = [(-0.35, 30, 2.3), (-0.1, 32, 2.3), (0.15, 30, 2.3), (0.4, 26, 2.2)]
        th = (-0.4, 38, 1.1)
    elif kind == 'hold':
        fingers = [(-0.3, 46, 0.9), (-0.05, 50, 0.95), (0.2, 46, 0.95), (0.42, 38, 0.95)]
        th = (-1.4, 42, 0.6)
    elif kind == 'rub':  # money gesture: thumb rubbing fingertips
        fingers = [(-0.5, 52, 0.55), (-0.25, 54, 0.6), (0.05, 46, 1.2), (0.3, 38, 1.4)]
        th = (-1.0, 50, 0.35)
    elif kind == 'shh':  # one finger up (relative to wrist dir)
        fingers = [(-1.45, 64, 0.0), (0.1, 30, 2.3), (0.3, 28, 2.3), (0.5, 24, 2.2)]
        th = (-0.6, 38, 1.0)
    else:  # relaxed
        fingers = [(-0.2, 50, 0.35), (0.05, 56, 0.35), (0.25, 52, 0.4), (0.45, 42, 0.45)]
        th = (-1.0, 40, 0.3)
    # thumb behind palm on back-facing kinds
    tx, ty = 14 * s, -20 * s
    thumb = finger(rng, tx, ty, th[0], th[1] * s, fw * 1.15, curl=th[2], lit=lit)
    o.append(fill(palm, col, rng, j=0.4))
    knuckles = []
    for i, (a, L, cu) in enumerate(fingers):
        kx = 46 * s + math.cos(a) * 6 * s
        ky = (-18 + i * 13) * s
        knuckles.append((kx, ky))
        o.append(finger(rng, kx, ky, a, L * s, fw, curl=cu, lit=lit, ring=(ring and i == 2)))
    o.append(outline(palm, 3.2, rng, breaks=2))
    for kx, ky in knuckles:  # knuckle bumps
        o.append(ink([(kx - 6 * s, ky - 5 * s), (kx - 2 * s, ky), (kx - 6 * s, ky + 5 * s)], 1.8, rng, taper=(0.4, 0.4), color=FINE, alpha=0.8))
    o.append(ticks(rng, 24 * s, 0, 16 * s, 12 * s, 6, ln=4, w=1.5, alpha=0.6))
    o.append(thumb)
    return ''.join(o)


# ----------------------------------------------------------------- arms (shoulder pivot)

ARM_POSES = {
    #        elbow       wrist       hand-kind  hand angle(rad)
    'down': ((8, 125), (14, 245), 'relaxed', 1.62),
    'gesture': ((26, 120), (120, 78), 'open', -0.35),
    'point': ((70, 80), (175, 30), 'point', -0.35),
    'up': ((52, -60), (70, -180), 'open', -1.5),
    'hold': ((18, 125), (96, 150), 'hold', 0.15),
    'chin': ((60, 120), (-20, 30), 'relaxed', -2.1),
    'rub': ((30, 120), (110, 70), 'rub', -0.6),
    'shh': ((60, 125), (-10, -10), 'shh', -0.9),
    'recoil': ((85, 0), (120, -130), 'open', -1.35),
    'fist': ((70, 50), (70, -70), 'fist', -1.55),
    'wave': ((70, -30), (90, -150), 'open', -1.45),
    'face': ((50, 125), (-30, -40), 'open', -2.0),
    'hip': ((60, 90), (20, 160), 'fist', 2.4),
}


def arm(c, pose, lit=True):
    rng = R(c['name'] + f':arm:{pose}:{lit}')
    el, wr, hk, ha = ARM_POSES[pose]
    sl = c.get('sleeve_w', 44)
    col = c['sleeve'] if lit else c.get('sleeve_d', c['sleeve'])
    sh = (0, 0)
    def side(p, q, w):
        dx, dy = q[0] - p[0], q[1] - p[1]
        L = math.hypot(dx, dy) + 1e-6
        return (-dy / L * w / 2, dx / L * w / 2)
    n1 = side(sh, el, sl)
    n2 = side(el, wr, sl * 0.82)
    poly = [(sh[0] + n1[0], sh[1] + n1[1]), (el[0] + n1[0] + n2[0], el[1] + n1[1] + n2[1]), (wr[0] + n2[0], wr[1] + n2[1]),
            (wr[0] - n2[0], wr[1] - n2[1]), (el[0] - n1[0] - n2[0], el[1] - n1[1] - n2[1]), (sh[0] - n1[0], sh[1] - n1[1])]
    o = [fill(poly, col, rng, j=0.6)]
    if c.get('sleeve_pattern'):
        o.append(clip_group(f'sp{rng.randrange(1 << 30)}', poly, c['sleeve_pattern'](rng, -120, -220, 260, 300)))
    # fold ticks at the elbow
    o.append(ink([(el[0] - n1[0] * 0.6, el[1] - n1[1] * 0.6), (el[0] + 6, el[1] + 4)], 2.2, rng, taper=(0.3, 0.6)))
    o.append(outline(poly, 3.8, rng, breaks=2))
    # cuff
    cuff_c = c.get('cuff', PALE)
    cp = [(wr[0] + n2[0], wr[1] + n2[1]), (wr[0] - n2[0], wr[1] - n2[1])]
    dx, dy = wr[0] - el[0], wr[1] - el[1]
    L = math.hypot(dx, dy)
    ux, uy = dx / L, dy / L
    cuff = [cp[0], cp[1], (cp[1][0] + ux * 12, cp[1][1] + uy * 12), (cp[0][0] + ux * 12, cp[0][1] + uy * 12)]
    o.append(fill(cuff, cuff_c, rng, j=0.3) + outline(cuff, 2.6, rng, breaks=1))
    hsvg = hand(c['name'], hk, lit=lit, size=c.get('hand', 1.0), ring=c.get('ring', False))
    hx, hy = wr[0] + ux * 10, wr[1] + uy * 10
    o.append(f'<g transform="translate({hx:.1f} {hy:.1f}) rotate({math.degrees(ha):.1f})">{hsvg}</g>')
    return ''.join(o), (hx, hy, ha)


# ----------------------------------------------------------------- patterns

def plaid(rng, x, y, w, h, base=GOLD, a=RED, b=BLUE_D, step=34):
    o = [f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{base}"/>']
    for i in range(int(w / step) + 2):
        xx = x + i * step
        o.append(f'<rect x="{xx}" y="{y}" width="7" height="{h}" fill="{a}" fill-opacity="0.75"/>')
        o.append(f'<rect x="{xx + 16}" y="{y}" width="2.5" height="{h}" fill="{b}" fill-opacity="0.8"/>')
    for j in range(int(h / step) + 2):
        yy = y + j * step
        o.append(f'<rect x="{x}" y="{yy}" width="{w}" height="7" fill="{a}" fill-opacity="0.6"/>')
        o.append(f'<rect x="{x}" y="{yy + 16}" width="{w}" height="2.5" fill="{b}" fill-opacity="0.8"/>')
    return ''.join(o)


def pinstripe(rng, x, y, w, h, base=INK, line=BLUE_L, step=16):
    o = [f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{base}"/>']
    for i in range(int(w / step) + 2):
        xx = x + i * step
        o.append(ink([(xx, y), (xx + 3, y + h)], 1.3, rng, taper=(0.02, 0.02), wob=0.4, color=line, alpha=0.55))
    return ''.join(o)
