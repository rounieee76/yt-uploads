"""Rasterise every part to its own transparent PNG with a known pivot. Registry -> parts/reg.json"""
import json, os, sys
from bodies import *
from sets import *

PD = '/home/claude/eiffel/parts'
os.makedirs(PD, exist_ok=True)
REG = {}


def add(key, svg, vb, scale=2.0, anchor=None):
    fn = f"{PD}/{key.replace(':', '_')}.png"
    m = render(svg, vb, fn, scale=scale)
    REG[key] = dict(file=fn, ox=-vb[0] * scale, oy=-vb[1] * scale, scale=scale, anchor=anchor)


HEAD_VB = {'lustig': (-260, -600, 520, 690), 'poisson': (-290, -440, 580, 560), 'dealer': (-230, -350, 460, 440), 'gendarme': (-230, -430, 460, 520)}
BODY_VB = {'lustig': (-130, -30, 260, 840), 'poisson': (-205, -30, 410, 700)}
ARM_VB = (-220, -340, 600, 740)
EXPRS = ['neutral', 'blink', 'angry', 'smug', 'joy', 'shock', 'doubt', 'grief']
ARMS = {'lustig': ['down', 'gesture', 'rub', 'shh', 'point', 'hold', 'wave', 'up', 'face', 'hip'],
        'poisson': ['down', 'hold', 'chin', 'recoil', 'up', 'fist', 'gesture', 'face', 'rub']}


def build():
    for n in ('lustig', 'poisson'):
        c = CAST[n]
        for e in EXPRS:
            add(f'head:{n}:{e}', head(c, e), HEAD_VB[n])
        add(f'body:{n}', BODIES[n](), BODY_VB[n])
        for p in ARMS[n]:
            for lit in (True, False):
                svg, anc = arm(c, p, lit=lit)
                add(f'arm:{n}:{p}:{int(lit)}', svg, ARM_VB, anchor=anc)
    for e in ('neutral', 'blink', 'shock', 'joy', 'doubt'):
        add(f'extra:dealer:{e}', extra(DEALER, 'dealer', e), (-250, -330, 500, 840), scale=1.6)
    for e in ('neutral', 'blink', 'doubt', 'angry', 'smug'):
        add(f'extra:gendarme:{e}', extra(GENDARME, 'gendarme', e), (-250, -420, 500, 1140), scale=1.6)
    for k, f in SETS.items():
        L = f()
        for lay, svg in L.items():
            add(f'set:{k}:{lay}', svg, (0, 0, W, H), scale=1.25)
    add('set:girder:back', girder(R('gird')), (0, 0, W, H), scale=1.25)
    add('set:desk:back', desk(R('desk')), (0, 0, W, H), scale=1.25)
    rng = R('propsA')
    add('prop:newspaper', newspaper(rng, 0, 0), (-20, -20, 860, 1140), scale=1.6)
    add('prop:letter', letter(R('let'), 0, 0), (-20, -20, 460, 600), scale=2.0)
    seal = blob(0, 0, 70, 66, R('seal2'), n=14, lump=0.12)
    sr = R('seal2b')
    add('prop:seal', fill(seal, RED, sr) + fill(blob(0, 0, 42, 42, sr, n=10), RED_D, sr) + outline(seal, 3.4, sr) +
        ink([(-22, -10), (0, -30), (22, -10), (0, 26), (-22, -10)], 3.4, sr, color=GOLD, taper=(0.05, 0.05)) + sparkle(-30, -34, 12), (-100, -100, 200, 200))
    add('prop:notes', banknotes(R('notes'), 0, 0), (-40, -80, 480, 330), scale=2.0)
    for i in range(3):
        add(f'prop:coin{i}', coin(R(f'coin{i}'), 0, 0, 44), (-70, -70, 140, 140))
    for i, up in enumerate((True, False)):
        br = R('bird')
        wy = -16 if up else 12
        b = ink([(-34, wy), (-16, -2 if up else 4), (0, 4), (16, -2 if up else 4), (34, wy)], 5, br, taper=(0.5, 0.5))
        add(f'prop:bird{i}', b, (-50, -40, 100, 80))
    for i in range(3):
        pr = R(f'puff{i}')
        add(f'prop:puff{i}', smoke_puff(pr, 0, 0, 100 + i * 10, PALE, 1.0) + fill(blob(25, 20, 60, 40, pr, n=9), PALE_D, pr, alpha=0.8), (-150, -130, 300, 260), scale=1.2)
    json.dump(REG, open(f'{PD}/reg.json', 'w'), indent=0)
    print(len(REG), 'parts')


if __name__ == '__main__':
    build()
