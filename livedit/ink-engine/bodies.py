"""Bodies (neck-base pivot at (0,0), +y down) and the two extras as single drawings."""
from cast import *

SHOULDERS = {'lustig': ((-66, 34), (66, 34)), 'poisson': ((-150, 52), (150, 52)), 'dealer': ((-80, 30), (80, 30)), 'gendarme': ((-90, 30), (90, 30))}


def body_lustig(light=-1):
    rng = R('lustig:body')
    o = []
    # legs (black trousers with pale stripe), shoes
    for sd in (-1, 1):
        lr = R(f'lustig:leg{sd}')
        leg = [(sd * 8, 360), (sd * 52, 360), (sd * 46, 760), (sd * 14, 760)]
        o.append(fill(leg, INK if sd > 0 else BLUE_D, lr) + outline(leg, 3.4, lr, breaks=2))
        o.append(ink([(sd * 40, 380), (sd * 37, 750)], 2.0, lr, color=BLUE_L, alpha=0.6))
        shoe = [(sd * 6, 752), (sd * 52, 750), (sd * 86, 770), (sd * 84, 790), (sd * 4, 792)]
        o.append(fill(shoe, INK, lr) + sparkle(sd * 60, 766, 7))
    # tailcoat body
    coat = [(-70, 30), (-30, 6), (30, 6), (70, 30), (64, 200), (56, 350), (78, 470), (40, 470), (8, 372), (-8, 372), (-40, 470), (-78, 470), (-56, 350), (-64, 200)]
    o.append(fill(coat, INK, rng, j=0.6))
    lit = [(-70, 30), (-30, 6), (-6, 10), (-26, 372), (-40, 470), (-78, 470), (-56, 350), (-64, 200)]
    o.append(fill(lit, BLUE_D, rng, j=0.5))
    # shirt front, waistcoat V, bow tie, carnation, watch chain
    shirt = [(-26, 8), (26, 8), (14, 230), (0, 250), (-14, 230)]
    o.append(fill(shirt, PALE, rng) + outline(shirt, 2.6, rng, breaks=2))
    for i in range(4):
        o.append(f'<circle cx="0" cy="{60 + i * 44}" r="3.2" fill="{INK}"/>')
    o.append(ticks(rng, 0, 140, 12, 90, 10, ln=8, ang=1.57, w=1.4, color=PALE_D, alpha=0.9))
    for sd in (-1, 1):  # lapels
        lap = [(sd * 26, 8), (sd * 52, 22), (sd * 30, 160), (sd * 12, 236)]
        o.append(fill(lap, INK if sd > 0 else '#1d2350', rng, j=0.3) + ink(lap[1:], 2.4, rng, color=BLUE_L, alpha=0.7))
    bow = [(-30, 8), (-4, 18), (4, 18), (30, 8), (30, 32), (4, 24), (-4, 24), (-30, 32)]
    o.append(fill(bow, PALE, rng) + outline(bow, 2.6, rng, breaks=2) + f'<circle cx="0" cy="21" r="6" fill="{PALE_D}"/>')
    carn = blob(-44, 70, 13, 12, R('carn'), n=9, lump=0.15)
    o.append(fill(carn, RED, rng) + outline(carn, 2.0, rng) + ticks(rng, -44, 70, 8, 8, 6, ln=5, w=1.6, color=RED_D, alpha=0.9))
    o.append(ink([(-12, 200), (-30, 214), (-50, 206)], 2.6, rng, color=GOLD, taper=(0.05, 0.05), wob=0.2))
    o.append(sparkle(-50, 206, 6))
    o.append(outline(coat, 4.0, rng, breaks=3))
    # collar line at neck
    o.append(fill([(-24, -4), (24, -4), (28, 14), (-28, 14)], PALE, rng) + outline([(-24, -4), (24, -4), (28, 14), (-28, 14)], 2.4, rng))
    return ''.join(o)


def body_poisson(light=-1):
    rng = R('poisson:body')
    o = []
    for sd in (-1, 1):  # stubby plaid legs, black shoes
        lr = R(f'poisson:leg{sd}')
        leg = [(sd * 14, 380), (sd * 112, 380), (sd * 104, 610), (sd * 24, 610)]
        o.append(clip_group(f'pl{sd}', leg, plaid(lr, -200, 360, 400, 280, base=GOLD if sd < 0 else GOLD_D)) + outline(leg, 3.6, lr, breaks=2))
        shoe = [(sd * 18, 600), (sd * 110, 598), (sd * 150, 622), (sd * 146, 646), (sd * 16, 648)]
        o.append(fill(shoe, INK, lr) + sparkle(sd * 120, 616, 8))
    # jacket (plaid) around a huge belly
    jacket = [(-150, 52), (-70, 6), (70, 6), (150, 52), (178, 200), (184, 330), (150, 420), (-150, 420), (-184, 330), (-178, 200)]
    o.append(clip_group('pj', jacket, plaid(rng, -220, -20, 440, 460) + fill([(20, -20), (240, -20), (240, 460), (60, 460)], GOLD_D, rng, j=0, alpha=0.45)))
    # waistcoat (red, medallion brocade) over belly, shirt, tie
    vest = [(-60, 20), (60, 20), (118, 190), (126, 330), (92, 410), (0, 430), (-92, 410), (-126, 330), (-118, 190)]
    vr = R('poisson:vest')
    inner = fill(vest, RED, vr) + fill([(10, 0), (160, 0), (160, 440), (40, 440)], RED_D, vr, j=0)
    for i in range(4):
        for j in range(5):  # medallions
            mx, my = -90 + i * 60 + (j % 2) * 30, 80 + j * 70
            inner += f'<circle cx="{mx}" cy="{my}" r="13" fill="none"/>' + ink([(mx - 9, my), (mx, my - 9), (mx + 9, my), (mx, my + 9), (mx - 9, my)], 1.8, vr, color=GOLD, alpha=0.75, taper=(0.05, 0.05))
    o.append(clip_group('pv', vest, inner) + outline(vest, 3.4, vr, breaks=2))
    shirt = [(-46, 10), (46, 10), (20, 140), (-20, 140)]
    o.append(fill(shirt, PALE, rng) + outline(shirt, 2.6, rng))
    tie = [(-12, 16), (12, 16), (18, 120), (0, 140), (-18, 120)]
    o.append(fill(tie, BLUE, rng) + outline(tie, 2.4, rng) + dots(rng, 0, 70, 9, 40, 8, r=1.6, color=PALE, alpha=0.9))
    for i in range(4):  # gold buttons with glint
        o.append(f'<circle cx="0" cy="{180 + i * 56}" r="7" fill="{GOLD}"/>' + sparkle(-2, 178 + i * 56, 4))
    # belly creases at button pulls
    for i in range(3):
        y = 205 + i * 56
        o.append(ink([(-30, y - 6), (-6, y), (6, y), (30, y - 6)], 1.8, rng, color=RED_D))
    # watch chain
    o.append(ink([(-6, 250), (-50, 268), (-96, 252)], 3, rng, color=GOLD, taper=(0.05, 0.05)) + sparkle(-96, 252, 7))
    for sd in (-1, 1):  # lapels
        lap = [(sd * 60, 14), (sd * 96, 40), (sd * 70, 160), (sd * 112, 196)]
        o.append(ink(lap, 3.2, rng))
    o.append(outline(jacket, 4.2, rng, breaks=3))
    o.append(fill([(-58, -6), (58, -6), (64, 22), (-64, 22)], PALE, rng) + outline([(-58, -6), (58, -6), (64, 22), (-64, 22)], 2.6, rng))
    return ''.join(o)


BODIES = {'lustig': body_lustig, 'poisson': body_poisson}


def extra(c, kind, expr='neutral'):
    """single drawing (head + simple body + arms down) with neck-base at (0,0)"""
    rng = R(c['name'] + ':xbody')
    o = []
    if kind == 'dealer':  # short, round, cobalt tweed coat, scarf
        for sd in (-1, 1):
            leg = [(sd * 10, 300), (sd * 70, 300), (sd * 64, 470), (sd * 16, 470)]
            o.append(fill(leg, BLUE_D, rng) + outline(leg, 3.2, rng))
            o.append(fill([(sd * 12, 462), (sd * 72, 460), (sd * 100, 480), (sd * 12, 486)], INK, rng))
        coat = [(-96, 30), (-40, 4), (40, 4), (96, 30), (122, 200), (110, 320), (-110, 320), (-122, 200)]
        o.append(fill(coat, BLUE, rng) + fill([(10, 0), (140, 0), (140, 330), (30, 330)], BLUE_D, rng, j=0, alpha=0.0))
        o.append(clip_group('dc', coat, fill([(0, 0), (160, 0), (160, 340), (30, 340)], BLUE_D, rng, j=0) + dash_rows(rng, -120, 30, 120, 320, 12, 12, ln=6, ang=0.5, w=1.6, color=BLUE_L, alpha=0.5)))
        o.append(outline(coat, 4.0, rng, breaks=3))
        scarf = [(-50, -4), (50, -4), (56, 30), (30, 40), (40, 120), (14, 124), (8, 42), (-56, 30)]
        o.append(fill(scarf, RED, rng) + outline(scarf, 2.8, rng) + dash_rows(rng, -50, 0, 50, 34, 3, 9, ln=5, ang=1.2, w=1.5, color=RED_D, alpha=0.8))
        sh = ((-96, 34), (96, 34))
    else:  # gendarme: tall cobalt tunic, red-striped trousers, cape
        for sd in (-1, 1):
            leg = [(sd * 8, 360), (sd * 60, 360), (sd * 54, 680), (sd * 14, 680)]
            o.append(fill(leg, BLUE_D, rng) + outline(leg, 3.2, rng) + ink([(sd * 50, 370), (sd * 46, 670)], 4, rng, color=RED))
            o.append(fill([(sd * 10, 672), (sd * 62, 670), (sd * 92, 690), (sd * 10, 698)], INK, rng))
        coat = [(-90, 30), (-36, 4), (36, 4), (90, 30), (96, 220), (88, 380), (-88, 380), (-96, 220)]
        o.append(clip_group('gc', coat, fill(coat, BLUE, rng) + fill([(0, 0), (160, 0), (160, 400), (20, 400)], BLUE_D, rng, j=0)) + outline(coat, 4.0, rng, breaks=3))
        for i in range(5):
            o.append(f'<circle cx="0" cy="{50 + i * 60}" r="6" fill="{GOLD}"/>')
        o.append(fill([(-92, 250), (92, 250), (92, 278), (-92, 278)], INK, rng) + f'<rect x="-14" y="248" width="28" height="32" fill="{GOLD}"/>' + sparkle(-6, 256, 6))
        sh = ((-90, 34), (90, 34))
    for i, (sx, sy) in enumerate(sh):
        lit = sx < 0
        spec = dict(c, sleeve=(BLUE if lit else BLUE_D), sleeve_d=BLUE_D, cuff=PALE, sleeve_w=46)
        a, _ = arm(spec, 'down', lit=lit)
        mir = ' scale(-1 1)' if sx < 0 else ''
        o.append(f'<g transform="translate({sx} {sy}){mir}">{a}</g>')
    o.append(head(c, expr))
    return ''.join(o)


def body_leo(light=-1):
    rng = R('leo:body')
    o = []
    for sd in (-1, 1):  # long legs in jeans, chunky cream sneakers
        lr = R(f'leo:leg{sd}')
        leg = [(sd * 6, 330), (sd * 64, 330), (sd * 58, 760), (sd * 16, 760)]
        o.append(fill(leg, BLUE_D if sd > 0 else BLUE, lr) + outline(leg, 3.4, lr, breaks=2))
        o.append(ink([(sd * 52, 340), (sd * 48, 750)], 1.6, lr, color=GOLD, alpha=0.7) + ticks(lr, sd * 36, 560, 14, 150, 8, ln=6, ang=1.6, w=1.4, color=FINE))
        sh = [(sd * 4, 752), (sd * 62, 748), (sd * 104, 770), (sd * 104, 798), (sd * 2, 800)]
        o.append(fill(sh, PALE, lr) + fill([(sd * 2, 786), (sd * 104, 786), (sd * 104, 800), (sd * 2, 800)], PALE_D, lr) + ink([(sd * 20, 768), (sd * 70, 760), (sd * 94, 780)], 4, lr, color=RED) + outline(sh, 3.0, lr, breaks=2))
    jacket = [(-82, 36), (-30, 4), (30, 4), (82, 36), (92, 200), (96, 330), (-96, 330), (-92, 200)]
    o.append(clip_group('lj', jacket, fill(jacket, BLUE, rng) + fill([(10, 0), (200, 0), (200, 360), (40, 360)], BLUE_D, rng, j=0)) + outline(jacket, 4.0, rng, breaks=3))
    tee = [(-30, 6), (30, 6), (22, 320), (-22, 320)]
    o.append(fill(tee, PALE, rng) + outline(tee, 2.6, rng, breaks=2))
    o.append(fill([(-96, 300), (96, 300), (96, 336), (-96, 336)], GOLD, rng) + dash_rows(rng, -94, 302, 94, 334, 2, 22, ln=6, ang=1.57, w=1.6, color=GOLD_D, alpha=0.9))
    o.append(ink([(-6, 10), (-8, 300)], 3, rng) + ink([(6, 10), (8, 300)], 3, rng))
    o.append(fill([(-40, -6), (40, -6), (44, 18), (-44, 18)], GOLD, rng) + dash_rows(rng, -40, -4, 40, 16, 1, 12, ln=6, ang=1.57, w=1.5, color=GOLD_D))
    patch = blob(-58, 120, 18, 18, R('lpatch'), n=8)
    o.append(fill(patch, RED, rng) + outline(patch, 2.2, rng) + sparkle(-58, 120, 8, GOLD))
    return ''.join(o)


def body_mira(light=-1):
    rng = R('mira:body')
    o = []
    for sd in (-1, 1):  # short legs, black boots
        lr = R(f'mira:leg{sd}')
        leg = [(sd * 10, 300), (sd * 52, 300), (sd * 48, 480), (sd * 16, 480)]
        o.append(fill(leg, SKIN if sd < 0 else SKIN_D, lr) + outline(leg, 3.0, lr, breaks=2))
        bt = [(sd * 12, 430), (sd * 54, 430), (sd * 56, 500), (sd * 86, 512), (sd * 86, 530), (sd * 10, 530)]
        o.append(fill(bt, INK, lr) + sparkle(sd * 60, 500, 6))
    skirt = [(-100, 250), (100, 250), (128, 340), (-128, 340)]
    o.append(clip_group('ms', skirt, plaid(rng, -140, 240, 280, 110, base=BLUE, a=GOLD, b=PALE, step=28)) + outline(skirt, 3.4, rng, breaks=2))
    coat = [(-74, 30), (-30, 4), (30, 4), (74, 30), (104, 180), (110, 270), (-110, 270), (-104, 180)]
    o.append(clip_group('mc', coat, fill(coat, RED, rng) + fill([(10, 0), (200, 0), (200, 300), (30, 300)], RED_D, rng, j=0)) + outline(coat, 4.0, rng, breaks=3))
    neck = [(-34, -8), (34, -8), (38, 40), (-38, 40)]
    o.append(fill(neck, PALE, rng) + dash_rows(rng, -32, -6, 32, 38, 4, 7, ln=5, ang=1.57, w=1.5, color=PALE_D, alpha=0.9) + outline(neck, 2.4, rng))
    for i in range(3):
        for sd in (-1, 1):
            o.append(f'<circle cx="{sd * 26}" cy="{90 + i * 60}" r="9" fill="{GOLD}"/>' + sparkle(sd * 26 - 2, 88 + i * 60, 5))
    o.append(ink([(0, 40), (0, 268)], 2.6, rng))
    return ''.join(o)


BODIES.update(leo=body_leo, mira=body_mira)
SHOULDERS.update(leo=((-82, 40), (82, 40)), mira=((-76, 34), (76, 34)))
