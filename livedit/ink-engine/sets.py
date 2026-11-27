"""Sets in depth layers + prop inserts. Every set is built for a 1080x1920 frame with room to move."""
from chars import *

W, H = 1600, 2400


def masonry(rng, x0, y0, x1, y1, ch=60, cw=130, lit=PALE_D, shade=BLUE, split=None, crack=6):
    """stone wall: two flat tones split on a hard diagonal, broken course lines, branching cracks"""
    o = [f'<rect x="{x0}" y="{y0}" width="{x1 - x0}" height="{y1 - y0}" fill="{lit}"/>']
    if split:
        o.append(fill(split, shade, rng, j=0))
    y = y0
    r = 0
    while y < y1:
        o.append(ink([(x0, y), (x0 + (x1 - x0) * 0.3, y + rng.uniform(-2, 2)), (x0 + (x1 - x0) * 0.32, y + 30)], 0.1, rng)) if False else None
        # broken course line
        x = x0
        while x < x1:
            seg = rng.uniform(60, 220)
            if rng.random() < 0.8:
                o.append(ink([(x, y + rng.uniform(-1, 1)), (min(x1, x + seg), y + rng.uniform(-1, 1))], 2.4, rng, taper=(0.1, 0.1), color=FINE, alpha=0.8))
            x += seg + rng.uniform(4, 20)
        off = (r % 2) * cw / 2
        xx = x0 + off
        while xx < x1:
            if rng.random() < 0.85:
                o.append(ink([(xx, y), (xx + rng.uniform(-2, 2), y + ch)], 2.2, rng, taper=(0.1, 0.1), color=FINE, alpha=0.75))
            xx += cw
        o.append(dots(rng, (x0 + x1) / 2, y + ch / 2, (x1 - x0) / 2, ch / 2, int((x1 - x0) / 40), r=1.2, alpha=0.4))
        y += ch
        r += 1
    for _ in range(crack):
        cx, cy = rng.uniform(x0, x1), rng.uniform(y0, y1)
        pts = [(cx, cy)]
        for k in range(5):
            cx += rng.uniform(-25, 25); cy += rng.uniform(10, 35)
            pts.append((cx, cy))
        o.append(ink(pts, 2.4, rng, taper=(0.1, 0.7), color=INK))
        bx, by = pts[2]
        o.append(ink([(bx, by), (bx + rng.uniform(15, 35), by + rng.uniform(10, 25))], 1.8, rng, taper=(0.1, 0.8)))
    return ''.join(o)


def scrolls(rng, x0, y0, x1, y1, step=150, color=GOLD, alpha=0.55):
    """brocade wallpaper: repeating scroll + medallion"""
    o = []
    for j, y in enumerate(range(int(y0), int(y1), step)):
        for i, x in enumerate(range(int(x0) - step, int(x1), step)):
            xx = x + (j % 2) * step / 2
            o.append(ink([(xx, y + 60), (xx + 10, y + 20), (xx + 40, y + 10), (xx + 55, y + 35), (xx + 38, y + 48), (xx + 28, y + 34)], 2.4, rng, color=color, alpha=alpha, taper=(0.1, 0.6)))
            o.append(ink([(xx, y + 60), (xx - 10, y + 100), (xx - 40, y + 110), (xx - 55, y + 85), (xx - 38, y + 72), (xx - 28, y + 86)], 2.4, rng, color=color, alpha=alpha, taper=(0.1, 0.6)))
            o.append(f'<circle cx="{xx + step / 2:.0f}" cy="{y + 60}" r="9" fill="{color}" fill-opacity="{alpha * 0.8}"/>')
    return ''.join(o)


def planks(rng, x0, y0, x1, y1, n=9, a=GOLD, b=GOLD_D, vp=(800, 600)):
    """parquet floor in perspective toward vanishing point; grain ticks + seams"""
    o = [f'<rect x="{x0}" y="{y0}" width="{x1 - x0}" height="{y1 - y0}" fill="{a}"/>']
    for i in range(-n, 2 * n):
        xb = x0 + (x1 - x0) * i / n
        t = (y0 - vp[1]) / (y1 - vp[1])
        xt = vp[0] + (xb - vp[0]) * t
        if i % 2:
            xb2 = x0 + (x1 - x0) * (i + 1) / n
            xt2 = vp[0] + (xb2 - vp[0]) * t
            o.append(fill([(xt, y0), (xt2, y0), (xb2, y1), (xb, y1)], b, rng, j=0, alpha=0.55))
        o.append(ink([(xt, y0), (xb, y1)], 2.6, rng, taper=(0.05, 0.05), color=FINE, alpha=0.8))
    for k in range(70):
        y = rng.uniform(y0 + 10, y1)
        x = rng.uniform(x0, x1)
        o.append(ink([(x, y), (x + rng.uniform(14, 34), y + rng.uniform(-2, 2))], 1.8, rng, taper=(0.4, 0.4), color=FINE, alpha=0.6))
    return ''.join(o)


def eiffel(rng, cx, top, base, half, lit=SKIN, shade=BLUE, light=-1, detail=True):
    """Eiffel Tower: lit half / shade half on a hard diagonal, lattice X ticks, arches, platforms"""
    def xw(y):
        t = (y - top) / (base - top)
        return half * (0.04 + 0.96 * t ** 2.2)
    o = []
    ys = np.linspace(top, base, 40)
    leftp = [(cx - xw(y), y) for y in ys]
    rightp = [(cx + xw(y), y) for y in ys[::-1]]
    outline_pts = [(cx, top - 70)] + leftp + rightp
    # arch cut at base
    body = fill(outline_pts, lit, rng, j=0.4)
    sh = fill([(cx + 10, top - 80), (cx + half * 2, top - 80), (cx + half * 2, base + 10), (cx - half * 0.15, base + 10)], shade, rng, j=0)
    lat = ''
    if detail:
        for y in np.arange(top + 40, base, 34):
            w0 = xw(y)
            n = max(1, int(w0 / 22))
            for i in range(-n, n):
                x = cx + (i + 0.5) * w0 / n
                lat += ink([(x - 9, y - 12), (x + 9, y + 12)], 1.7, rng, taper=(0.1, 0.1), wob=0.1, color=FINE, alpha=0.7)
                lat += ink([(x + 9, y - 12), (x - 9, y + 12)], 1.7, rng, taper=(0.1, 0.1), wob=0.1, color=FINE, alpha=0.7)
    o.append(clip_group(f'et{rng.randrange(1 << 30)}', outline_pts, body + sh + lat))
    # arch opening
    ay = base - (base - top) * 0.12
    arch = [(cx - xw(ay) * 0.62, base + 2)] + [(cx + xw(ay) * 0.62 * math.cos(math.pi - math.pi * k / 12), base - (base - ay) * math.sin(math.pi * k / 12)) for k in range(13)] + [(cx + xw(ay) * 0.62, base + 2)]
    o.append(fill(arch, BLUE_D, rng, j=0.3) + ink(arch[1:-1], 3.2, rng, taper=(0.1, 0.1)))
    for fy in (0.31, 0.58):  # platforms
        y = top + (base - top) * fy
        w0 = xw(y) + 14
        p = [(cx - w0, y - 14), (cx + w0, y - 14), (cx + w0 - 6, y + 6), (cx - w0 + 6, y + 6)]
        o.append(fill(p, lit, rng) + fill([(cx + 10, y - 16), (cx + w0, y - 16), (cx + w0, y + 8), (cx - 10, y + 8)], shade, rng, j=0) + outline(p, 3.0, rng, breaks=2))
    o.append(ink(leftp, 3.6, rng, taper=(0.3, 0.05)) + ink(rightp, 3.6, rng, taper=(0.05, 0.3)))
    o.append(ink([(cx, top - 70), (cx, top + 10)], 4, rng))
    return ''.join(o)


def moon(x, y, r):
    o = ''.join(f'<circle cx="{x}" cy="{y}" r="{r * k}" fill="{PALE}" fill-opacity="{a}"/>' for k, a in ((2.6, 0.06), (2.0, 0.09), (1.5, 0.14)))
    rng = R('moon')
    return o + fill(blob(x, y, r, r, rng, n=14, lump=0.015), PALE, rng) + fill(blob(x + r * 0.3, y - r * 0.2, r * 0.25, r * 0.18, rng, n=8), PALE_D, rng, alpha=0.6) + outline(blob(x, y, r, r, rng, n=14, lump=0.015), 2.4, rng)


def stars(rng, x0, y0, x1, y1, n):
    return ''.join(f'<circle cx="{rng.uniform(x0, x1):.0f}" cy="{rng.uniform(y0, y1):.0f}" r="{rng.uniform(1.2, 2.6):.1f}" fill="{PALE}" fill-opacity="{rng.uniform(0.5, 0.95):.2f}"/>' for _ in range(n))


def building(rng, x, w, top, base, night=True, lit_left=True, windows=True):
    o = []
    face = [(x, base), (x, top), (x + w, top), (x + w, base)]
    o.append(fill(face, BLUE if night else PALE_D, rng, j=0.3))
    if lit_left:
        o.append(fill([(x, top), (x + w * 0.35, top), (x + w * 0.12, base), (x, base)], SKIN_D if night else PALE, rng, j=0.2))
    # mansard roof + chimneys
    roof = [(x - 8, top), (x + 26, top - 110), (x + w - 26, top - 110), (x + w + 8, top)]
    o.append(fill(roof, BLUE_D, rng, j=0.4) + outline(roof, 3.0, rng, breaks=2))
    for k in range(int(w / 90)):
        dx = x + 50 + k * 90
        dorm = [(dx, top - 20), (dx, top - 70), (dx + 22, top - 92), (dx + 44, top - 70), (dx + 44, top - 20)]
        o.append(fill(dorm, BLUE, rng) + fill([(dx + 10, top - 30), (dx + 10, top - 64), (dx + 34, top - 64), (dx + 34, top - 30)], GOLD if rng.random() < 0.5 else BLUE_D, rng) + outline(dorm, 2.4, rng))
    for k in range(2):
        cx = x + w * (0.25 + 0.5 * k)
        ch = [(cx, top - 100), (cx, top - 170), (cx + 34, top - 170), (cx + 34, top - 100)]
        o.append(fill(ch, BLUE_D, rng) + outline(ch, 2.4, rng) + fill([(cx - 4, top - 176), (cx + 38, top - 176), (cx + 38, top - 164), (cx - 4, top - 164)], RED_D, rng))
    if windows:
        rows = int((base - top - 40) / 120)
        cols = max(1, int(w / 95))
        for r in range(rows):
            for cc in range(cols):
                wx = x + 28 + cc * (w - 40) / cols
                wy = top + 40 + r * 120
                lit = rng.random() < 0.45
                win = [(wx, wy), (wx + 46, wy), (wx + 46, wy + 74), (wx, wy + 74)]
                o.append(fill(win, GOLD if lit else BLUE_D, rng, j=0.3))
                if lit:
                    o.append(fill([(wx, wy + 74), (wx + 46, wy + 74), (wx + 46, wy + 50)], SKIN, rng, j=0.2, alpha=0.7))
                o.append(outline(win, 2.0, rng, breaks=1) + ink([(wx + 23, wy), (wx + 23, wy + 74)], 1.6, rng, color=FINE))
                o.append(ink([(wx - 6, wy + 80), (wx + 52, wy + 80)], 3.0, rng, color=INK))  # balcony rail
    o.append(outline(face, 3.4, rng, breaks=2))
    return ''.join(o)


def cobbles(rng, x0, y0, x1, y1, a=SKIN_D, b=BLUE, split=None):
    o = [f'<rect x="{x0}" y="{y0}" width="{x1 - x0}" height="{y1 - y0}" fill="{b}"/>']
    if split:
        o.append(fill(split, a, rng, j=0))
    y = y0 + 10
    r = 0
    while y < y1:
        h = 16 + (y - y0) * 0.06
        x = x0 - (r % 2) * h
        while x < x1:
            w = h * rng.uniform(1.4, 2.0)
            st = blob(x + w / 2, y + h / 2, w / 2 - 3, h / 2 - 3, rng, n=8, lump=0.08)
            o.append(outline(st, 2.0, rng, breaks=1))
            x += w
        y += h
        r += 1
    return ''.join(o)


def lamppost(rng, x, base, h=900):
    o = []
    post = [(x - 10, base), (x - 7, base - h), (x + 7, base - h), (x + 10, base)]
    o.append(fill(post, INK, rng) + fill([(x - 26, base), (x - 18, base - 70), (x + 18, base - 70), (x + 26, base)], INK, rng))
    lamp = [(x - 40, base - h - 10), (x + 40, base - h - 10), (x + 28, base - h - 110), (x - 28, base - h - 110)]
    for k, a in ((3.2, 0.08), (2.4, 0.12), (1.7, 0.18)):
        o.append(f'<circle cx="{x}" cy="{base - h - 60}" r="{50 * k:.0f}" fill="{GOLD}" fill-opacity="{a}"/>')
    o.append(fill(lamp, GOLD, rng) + outline(lamp, 3.0, rng, breaks=2) + fill([(x - 50, base - h - 112), (x + 50, base - h - 112), (x, base - h - 160)], INK, rng))
    o.append(sparkle(x - 10, base - h - 70, 16))
    return ''.join(o)


def smoke_puff(rng, x, y, r, col=PALE, a=0.9):
    pts = blob(x, y, r, r * 0.8, rng, n=12, lump=0.12)
    return fill(pts, col, rng, alpha=a) + outline(pts, 2.4, rng, breaks=2)


# ------------------------------------------------------------------ the sets

def set_hotel():
    """Hôtel de Crillon suite, day. Cool cobalt room, one warm shaft from the window."""
    rng = R('hotel')
    L = {}
    back = [f'<rect x="0" y="0" width="{W}" height="{H}" fill="{BLUE}"/>']
    back.append(fill([(900, 0), (W, 0), (W, 1500), (1300, 1500)], BLUE_D, rng, j=0))
    back.append(scrolls(rng, 0, 0, W, 1450))
    # wainscot
    back.append(f'<rect x="0" y="1180" width="{W}" height="320" fill="{PALE_D}"/>')
    back.append(fill([(1100, 1180), (W, 1180), (W, 1500), (1250, 1500)], BLUE_L, rng, j=0, alpha=0.6))
    for k in range(6):
        px = 40 + k * 270
        pn = [(px, 1220), (px + 220, 1220), (px + 220, 1460), (px, 1460)]
        back.append(outline(pn, 2.6, rng, breaks=2) + ink([(px + 12, 1232), (px + 208, 1232)], 1.8, rng, color=FINE))
    back.append(ink([(0, 1180), (W, 1182)], 5, rng))
    # tall window with a day view of the tower
    wx0, wx1, wy0, wy1 = 140, 560, 260, 1160
    view = f'<rect x="{wx0}" y="{wy0}" width="{wx1 - wx0}" height="{wy1 - wy0}" fill="{BLUE_L}"/>' + eiffel(R('dayT'), 350, 520, 1160, 160, lit=PALE, shade=BLUE, detail=True)
    view += ''.join(building(R(f'db{k}'), 140 + k * 140, 130, 980 + (k % 2) * 40, 1170, night=False, lit_left=True) for k in range(3))
    back.append(clip_group('win', [(wx0, wy0), (wx1, wy0), (wx1, wy1), (wx0, wy1)], view))
    for k in range(1, 3):
        back.append(ink([(wx0 + (wx1 - wx0) * k / 3, wy0), (wx0 + (wx1 - wx0) * k / 3, wy1)], 6, rng, color=PALE))
    back.append(ink([(wx0, 700), (wx1, 700)], 6, rng, color=PALE))
    back.append(outline([(wx0, wy0), (wx1, wy0), (wx1, wy1), (wx0, wy1)], 7, rng, breaks=2))
    # red velvet curtains with fold lines
    for sd, (a, b) in (( -1, (40, 200)), (1, (500, 660))):
        cur = [(a, 160), (b, 160), (b - 10 + sd * 20, 1200), (a + 10, 1240)]
        back.append(fill(cur, RED, rng) + fill([((a + b) / 2, 160), (b, 160), (b - 10 + sd * 20, 1200), ((a + b) / 2 + 10, 1220)], RED_D, rng, j=0))
        for f in range(4):
            fx = a + (b - a) * (f + 0.5) / 4
            back.append(ink([(fx, 180), (fx + 4, 700), (fx - 4, 1190)], 2.4, rng, color=RED_D if f % 2 else INK, alpha=0.9))
        back.append(outline(cur, 3.6, rng, breaks=2))
    back.append(fill([(20, 140), (680, 140), (680, 175), (20, 175)], GOLD, rng) + sparkle(600, 150, 10))
    # floor
    back.append(planks(rng, 0, 1500, W, H, n=10, vp=(800, 900)))
    back.append(ink([(0, 1500), (W, 1500)], 5, rng))
    # the one warm shaft of light from the window: wall patch + floor patch (hard diagonal edges)
    back.append(fill([(560, 260), (760, 330), (1500, 1500), (1500, 2400), (760, 2400), (560, 1160)], SKIN_L, rng, j=0, alpha=0.32))
    back.append(fill([(620, 1500), (1500, 1500), (1600, 2200), (900, 2200)], PALE, rng, j=0, alpha=0.38))
    L['back'] = ''.join(back)
    # mid: chandelier + table with champagne
    mid = []
    cx = 1050
    mid.append(ink([(cx, 0), (cx, 260)], 5, rng, color=GOLD) + ink([(cx + 3, 0), (cx + 3, 260)], 2, rng))
    arms_ = []
    for k in range(5):
        ax = cx - 220 + k * 110
        arms_.append(ink([(cx, 280), (ax, 330), (ax, 300)], 6, rng, color=GOLD, taper=(0.05, 0.3)))
        arms_.append(fill(blob(ax, 290, 12, 22, R(f'cand{k}'), n=8), PALE, rng) + sparkle(ax, 262, 12, GOLD))
        for d in range(3):
            arms_.append(fill(blob(ax - 10 + d * 10, 360 + d * 14, 6, 11, R(f'drop{k}{d}'), n=6), PALE, rng) + outline(blob(ax - 10 + d * 10, 360 + d * 14, 6, 11, R(f'drop{k}{d}'), n=6), 1.6, rng))
    mid.append(''.join(arms_))
    bowl = blob(cx, 300, 90, 36, rng, n=12)
    mid.append(fill(bowl, GOLD, rng) + fill(blob(cx + 30, 310, 60, 20, rng, n=10), GOLD_D, rng) + outline(bowl, 3.2, rng) + sparkle(cx - 40, 292, 14))
    # table
    tt = [(760, 1640), (1440, 1640), (1500, 1720), (700, 1720)]
    cloth = [(700, 1700), (1500, 1700), (1490, 1960), (710, 1960)]
    mid.append(fill(cloth, PALE, rng) + fill([(1200, 1700), (1500, 1700), (1490, 1960), (1150, 1960)], PALE_D, rng, j=0) + outline(cloth, 3.6, rng, breaks=2))
    for f in range(6):
        fx = 740 + f * 130
        mid.append(ink([(fx, 1720), (fx + 6, 1950)], 2.2, rng, color=FINE, alpha=0.8))
    mid.append(fill(tt, PALE, rng) + outline(tt, 3.6, rng, breaks=2))
    # bottle + glasses + papers
    bt = [(1250, 1660), (1250, 1500), (1268, 1440), (1268, 1380), (1292, 1380), (1292, 1440), (1310, 1500), (1310, 1660)]
    mid.append(fill(bt, BLUE_D, rng) + fill([(1250, 1520), (1266, 1520), (1266, 1650), (1250, 1650)], BLUE_L, rng, alpha=0.7) + fill([(1262, 1380), (1298, 1380), (1300, 1430), (1260, 1430)], GOLD, rng) + outline(bt, 3.0, rng, breaks=2) + sparkle(1262, 1540, 10))
    for gx in (1120, 1380):
        g = [(gx - 24, 1560), (gx + 24, 1560), (gx + 8, 1610), (gx + 4, 1650), (gx + 20, 1662), (gx - 20, 1662), (gx - 4, 1650), (gx - 8, 1610)]
        mid.append(fill(g, PALE, rng, alpha=0.75) + fill([(gx - 20, 1575), (gx + 20, 1575), (gx + 8, 1606), (gx - 8, 1606)], GOLD, rng, alpha=0.85) + outline(g, 2.2, rng, breaks=2) + sparkle(gx - 12, 1572, 7))
    pap = [(860, 1655), (1020, 1640), (1032, 1690), (872, 1705)]
    mid.append(fill(pap, PALE, rng) + outline(pap, 2.4, rng) + ''.join(ink([(880, 1665 + i * 9), (1000, 1652 + i * 9)], 1.4, rng, color=FINE, alpha=0.7) for i in range(4)))
    L['mid'] = ''.join(mid)
    # fg: velvet armchair corner
    fg = []
    ch = [(-40, 1900), (330, 1880), (380, 2000), (360, 2450), (-40, 2450)]
    fg.append(fill(ch, RED, rng) + fill([(180, 1880), (380, 2000), (360, 2450), (200, 2450)], RED_D, rng, j=0) + outline(ch, 4.2, rng, breaks=2))
    for i in range(3):
        for j in range(3):
            bx, by = 40 + i * 100, 1980 + j * 120
            fg.append(f'<circle cx="{bx}" cy="{by}" r="8" fill="{GOLD}"/>' + ink([(bx - 30, by - 40), (bx, by), (bx + 30, by - 40)], 1.8, rng, color=RED_D))
    L['fg'] = ''.join(fg)
    return L


def set_paris_night():
    rng = R('paris')
    L = {}
    L['sky'] = f'<rect x="0" y="0" width="{W}" height="{H}" fill="{BLUE_D}"/>' + stars(rng, 0, 0, W, 1400, 90) + moon(1220, 380, 95)
    L['back'] = eiffel(R('nightT'), 800, 420, 2000, 470, lit=SKIN, shade=BLUE)
    mid = []
    xs = [(-60, 380, 1180), (300, 260, 1260), (1080, 300, 1200), (1360, 320, 1140)]
    for k, (x, w, top) in enumerate(xs):
        mid.append(building(R(f'nb{k}'), x, w, top, 2150, night=True, lit_left=(k < 2)))
    L['mid'] = ''.join(mid)
    fg = [cobbles(rng, 0, 2080, W, H, split=[(0, 2080), (900, 2080), (500, H), (0, H)])]
    fg.append(lamppost(rng, 220, 2200, h=1100))
    L['fg'] = ''.join(fg)
    return L


def set_train():
    rng = R('train')
    L = {}
    L['sky'] = f'<rect x="0" y="0" width="{W}" height="{H}" fill="{BLUE_D}"/>' + stars(rng, 0, 0, W, 1200, 70) + moon(1250, 300, 80)
    hills = [(0, 1350), (300, 1200), (700, 1300), (1100, 1150), (1600, 1280), (1600, H), (0, H)]
    L['back'] = fill(hills, BLUE, rng) + fill([(0, 1500), (500, 1420), (1000, 1500), (1600, 1430), (1600, H), (0, H)], BLUE_D, rng) + ''.join(
        fill(blob(150 + k * 260, 1230 + (k % 2) * 60, 30, 60, R(f'tree{k}'), n=8), INK, rng) for k in range(6))
    # carriage with window cut-outs (even-odd), red body gold trim
    body_pts = [(-50, 900), (1650, 900), (1650, 1700), (-50, 1700)]
    win = [(380, 1020, 700, 1380), (900, 1020, 1220, 1380)]
    d = 'M-50 900 L1650 900 L1650 1700 L-50 1700 Z ' + ' '.join(f'M{a} {b} L{a} {dd} L{c} {dd} L{c} {b} Z' for a, b, c, dd in win)
    car = f'<path d="{d}" fill="{RED}" fill-rule="evenodd"/>'
    car += fill([(1000, 900), (1650, 900), (1650, 1700), (1300, 1700)], RED_D, rng, j=0, alpha=0.9) if False else ''
    car += f'<rect x="-50" y="900" width="1700" height="40" fill="{GOLD}"/><rect x="-50" y="1600" width="1700" height="26" fill="{GOLD}"/>'
    for a, b, c, dd in win:
        car += outline([(a, b), (c, b), (c, dd), (a, dd)], 6, rng, breaks=2) + ink([(a - 14, b - 14), (c + 14, b - 14)], 4, rng, color=GOLD)
    roof = [(-60, 900), (1660, 900), (1600, 820), (0, 820)]
    car += fill(roof, INK, rng) + ink([(-50, 1700), (1650, 1700)], 5, rng)
    for k in range(9):
        car += f'<circle cx="{20 + k * 200}" cy="1650" r="7" fill="{GOLD}"/>'
    car += ''.join(f'<circle cx="{x}" cy="1780" r="70" fill="{INK}"/><circle cx="{x}" cy="1780" r="28" fill="{RED_D}"/>' for x in (200, 420, 1200, 1420))
    car += ''.join(smoke_puff(R(f'sm{k}'), 100 + k * 230, 700 - (k % 3) * 60, 90 + (k % 2) * 30) for k in range(8))
    L['interior'] = f'<rect x="300" y="950" width="1000" height="500" fill="{SKIN_L}"/>' + fill([(300, 950), (520, 950), (300, 1300)], PALE, rng, alpha=0.6)
    L['fg'] = car
    return L


def set_police():
    rng = R('police')
    L = {}
    L['sky'] = f'<rect x="0" y="0" width="{W}" height="{H}" fill="{BLUE_D}"/>' + stars(rng, 0, 0, W, 500, 30) + moon(260, 230, 70)
    back = [masonry(rng, 0, 380, W, 2100, ch=64, cw=150, lit=SKIN_D, shade=BLUE, split=[(0, 380), (520, 380), (260, 2100), (0, 2100)] and [(700, 380), (W, 380), (W, 2100), (1000, 2100)], crack=9)]
    # door arch with warm interior
    door = [(560, 2100), (560, 1250)] + [(820 + 260 * math.cos(math.pi - math.pi * k / 12), 1250 - 260 * math.sin(math.pi * k / 12)) for k in range(13)] + [(1080, 1250), (1080, 2100)]
    back.append(fill(door, INK, rng) + fill([(600, 2100), (600, 1300), (800, 1100), (900, 1300), (900, 2100)], RED_D, rng, alpha=0.8) + outline(door, 6, rng, breaks=2))
    # blue POLICE lamp
    back.append(fill([(740, 830), (900, 830), (880, 930), (760, 930)], BLUE_L, rng) + outline([(740, 830), (900, 830), (880, 930), (760, 930)], 3, rng)
                + f'<text x="820" y="895" font-family="Oswald" font-size="44" text-anchor="middle" fill="{PALE}" font-weight="700">POLICE</text>'
                + ''.join(f'<circle cx="820" cy="880" r="{r}" fill="{BLUE_L}" fill-opacity="{a}"/>' for r, a in ((200, 0.07), (140, 0.1))) + sparkle(760, 840, 10))
    back.append(f'<rect x="0" y="2080" width="{W}" height="40" fill="{INK}"/>')
    L['back'] = ''.join(back)
    L['fg'] = cobbles(rng, 0, 2100, W, H, split=[(700, 2100), (W, 2100), (W, H), (1100, H)])
    return L


# ------------------------------------------------------------------ props

def letter(rng, x, y, w=420, h=560, rot=0):
    p = [(0, 0), (w, 0), (w, h), (0, h)]
    o = fill(p, PALE, rng) + fill([(w * 0.6, 0), (w, 0), (w, h), (w * 0.4, h)], PALE_D, rng, j=0, alpha=0.6) + outline(p, 3.4, rng, breaks=2)
    o += f'<circle cx="{w / 2}" cy="80" r="40" fill="none"/>' + ink([(w / 2 - 34, 80), (w / 2, 44), (w / 2 + 34, 80), (w / 2, 116), (w / 2 - 34, 80)], 3, rng, color=GOLD, taper=(0.05, 0.05))
    o += f'<text x="{w / 2}" y="160" font-family="Playfair Display" font-size="24" text-anchor="middle" fill="{INK}">MINISTÈRE DES POSTES</text>'
    o += f'<text x="{w / 2}" y="188" font-family="Playfair Display" font-size="18" text-anchor="middle" fill="{FINE}">ET TÉLÉGRAPHES</text>'
    for i in range(9):
        o += ink([(40, 240 + i * 30), (w - 40 - (60 if i == 8 else rng.uniform(0, 30)), 240 + i * 30 + rng.uniform(-2, 2))], 2.0, rng, color=FINE, alpha=0.75, wob=1.2)
    o += ink([(w - 200, h - 70), (w - 150, h - 95), (w - 110, h - 60), (w - 60, h - 90)], 3, rng)
    seal = blob(w - 80, h - 150, 46, 44, rng, n=12, lump=0.1)
    o += fill(seal, RED, rng) + fill(blob(w - 80, h - 150, 28, 28, rng, n=10), RED_D, rng) + outline(seal, 2.6, rng) + sparkle(w - 100, h - 170, 8)
    return f'<g transform="translate({x} {y}) rotate({rot})">{o}</g>'


def newspaper(rng, x, y, w=820, h=1100, rot=0):
    p = [(0, 0), (w, 0), (w, h), (0, h)]
    o = fill(p, PALE, rng) + outline(p, 3.6, rng, breaks=2)
    o += f'<text x="{w / 2}" y="110" font-family="Playfair Display" font-size="82" text-anchor="middle" fill="{INK}" font-weight="700">LA GAZETTE</text>'
    o += ink([(30, 140), (w - 30, 140)], 4, rng) + ink([(30, 156), (w - 30, 156)], 2, rng)
    o += f'<text x="{w / 2}" y="250" font-family="Oswald" font-size="84" text-anchor="middle" fill="{INK}" font-weight="700">LA TOUR EIFFEL</text>'
    o += f'<text x="{w / 2}" y="350" font-family="Oswald" font-size="84" text-anchor="middle" fill="{RED}" font-weight="700">TROP CHÈRE ?</text>'
    o += f'<rect x="50" y="400" width="{w * 0.45}" height="360" fill="{PALE_D}"/>' + eiffel(R('npT'), 50 + w * 0.225, 450, 740, 120, lit=PALE, shade=FINE, detail=False)
    o += outline([(50, 400), (50 + w * 0.45, 400), (50 + w * 0.45, 760), (50, 760)], 2.4, rng)
    for col in range(2):
        for i in range(14 if col else 22):
            xx = (w * 0.55 + 10) if col == 0 else 50
            yy = (410 if col == 0 else 790) + i * 24
            xe = w - 50 if col == 0 else w - 50
            o += ink([(xx, yy), (xe - rng.uniform(0, 40), yy)], 2.0, rng, color=FINE, alpha=0.7, wob=0.8)
    return f'<g transform="translate({x} {y}) rotate({rot})">{o}</g>'


def banknotes(rng, x, y, n=5, w=360, h=190, rot=0):
    o = ''
    for k in range(n):
        dx, dy, a = k * 6, -k * 7, rng.uniform(-4, 4)
        p = [(0, 0), (w, 0), (w, h), (0, h)]
        g = fill(p, PALE, rng) + fill([(14, 14), (w - 14, 14), (w - 14, h - 14), (14, h - 14)], GOLD, rng, alpha=0.55)
        g += f'<circle cx="{w / 2}" cy="{h / 2}" r="52" fill="{PALE}"/>' + ink([(w / 2 - 40, h / 2), (w / 2, h / 2 - 40), (w / 2 + 40, h / 2), (w / 2, h / 2 + 40), (w / 2 - 40, h / 2)], 2.6, rng, color=RED_D, taper=(0.05, 0.05))
        g += f'<text x="40" y="58" font-family="Playfair Display" font-size="40" fill="{RED_D}" font-weight="700">1000</text>'
        g += f'<text x="{w / 2}" y="{h - 26}" font-family="Playfair Display" font-size="22" text-anchor="middle" fill="{INK}">BANQUE DE FRANCE</text>'
        g += outline(p, 2.8, rng, breaks=2)
        o += f'<g transform="translate({dx} {dy}) rotate({a} {w / 2} {h / 2})">{g}</g>'
    return f'<g transform="translate({x} {y}) rotate({rot})">{o}</g>'


def coin(rng, x, y, r=40):
    c = blob(x, y, r, r * 0.92, rng, n=12, lump=0.02)
    return fill(c, GOLD, rng) + fill(blob(x + r * 0.25, y + r * 0.2, r * 0.7, r * 0.6, rng, n=10), GOLD_D, rng, alpha=0.7) + outline(c, 2.6, rng) + f'<text x="{x}" y="{y + r * 0.3}" font-family="Playfair Display" font-size="{r * 0.8:.0f}" text-anchor="middle" fill="{GOLD_D}">F</text>' + sparkle(x - r * 0.4, y - r * 0.4, r * 0.3)


def girder(rng):
    """rusting iron lattice close-up (gold rust patches, red flakes)"""
    o = [f'<rect x="0" y="0" width="{W}" height="{H}" fill="{BLUE_D}"/>' + stars(rng, 0, 0, W, H, 40)]
    for k, (x0, y0, x1, y1) in enumerate([(200, -100, 700, 2500), (900, -100, 1400, 2500)]):
        beam = [(x0, y0), (x0 + 160, y0), (x1 + 160, y1), (x1, y1)]
        o.append(fill(beam, SKIN_D, rng) + fill([(x0 + 90, y0), (x0 + 160, y0), (x1 + 160, y1), (x1 + 90, y1)], BLUE, rng, j=0) + outline(beam, 4, rng, breaks=2))
        for j in range(18):
            yy = y0 + j * 150
            o.append(f'<circle cx="{x0 + 40 + (x1 - x0) * j / 18:.0f}" cy="{yy:.0f}" r="9" fill="{INK}"/>')
    for j in range(10):  # cross lattice
        y = 100 + j * 240
        o.append(ink([(340, y), (1080, y + 200)], 26, rng, color=SKIN_D, taper=(0.02, 0.02)) + ink([(340, y + 13), (1080, y + 213)], 3, rng))
        o.append(ink([(1080, y), (340, y + 200)], 26, rng, color=SKIN_D, taper=(0.02, 0.02)) + ink([(1080, y + 13), (340, y + 213)], 3, rng))
    for k in range(40):  # rust patches with dot texture
        x, y = rng.uniform(200, 1500), rng.uniform(0, H)
        rp = blob(x, y, rng.uniform(20, 60), rng.uniform(14, 40), rng, n=9, lump=0.2)
        o.append(fill(rp, GOLD_D, rng, alpha=0.85) + dots(rng, x, y, 30, 20, 8, r=1.6, color=RED_D, alpha=0.9))
    return ''.join(o)


def desk(rng):
    o = [f'<rect x="0" y="0" width="{W}" height="{H}" fill="{GOLD_D}"/>']
    o.append(fill([(0, 0), (700, 0), (1600, 1500), (1600, H), (0, H)], GOLD, rng, j=0, alpha=0.85))
    for k in range(18):  # plank seams + grain ticks
        x = k * 95
        o.append(ink([(x, 0), (x + 30, H)], 2.6, rng, color=FINE, alpha=0.8))
    for k in range(160):
        x, y = rng.uniform(0, W), rng.uniform(0, H)
        o.append(ink([(x, y), (x + rng.uniform(2, 6), y + rng.uniform(20, 46))], 1.7, rng, color=FINE, alpha=0.55, taper=(0.4, 0.4)))
    # inkwell
    iw = blob(1250, 600, 110, 90, rng, n=12)
    o.append(fill(iw, INK, rng) + fill(blob(1220, 570, 40, 22, rng), BLUE_D, rng) + sparkle(1200, 560, 12))
    return ''.join(o)


SETS = {'hotel': set_hotel, 'paris': set_paris_night, 'train': set_train, 'police': set_police}
