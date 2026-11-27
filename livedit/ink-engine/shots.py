from anim import *

BOUNDS = [0, 1.805, 3.541, 4.892, 5.927, 8.043, 10.139, 13.233, 14.498, 17.061, 19.312, 20.947, 24.413, 25.591, 27.566, 29.987, 33.0]
WHIP = [None, 'zoom', 'blur', 'zoom', 'blur', 'zoom', 'blur', 'zoom', 'zoom', 'zoom', 'zoom', 'zoom', 'blur', 'blur', 'blur', 'blur']

LX, LY = 430, 1320      # Lustig's mark in the hotel
PX, PY = 1100, 1480     # Poisson's mark in the hotel


def hotel(blur_back=0.0, blur_mid=0.0, dust=True, glints=True):
    els = [Layer('set:hotel:back', 0.85, blur_back), Layer('set:hotel:mid', 0.92, blur_mid)]
    if glints:
        els.append(Glints([(1050 - 220 + k * 110, 262) for k in range(5)] + [(1010, 292), (1262, 1540)], depth=0.92, size=14, speed=2.6))
    if dust:
        els.append(Particles('dust', 70, (560, 300, 1500, 2300), depth=0.95, seed=3, size=(2, 4.5), speed=(15, 40)))
    return els


def paris(life=True):
    els = [Layer('set:paris:sky', 0.3), Particles('twinkle', 14, (0, 0, 1600, 1100), depth=0.3, seed=5, size=(3, 5)),
           Layer('set:paris:back', 0.55)]
    if life:
        for k, (x, y) in enumerate([(52, 1010), (382, 1090), (1172, 1030), (1457, 970)]):
            for j in range(3):
                els.append(Mover([f'prop:puff{(k + j) % 3}'], (x, y), (x + 140, y - 420), 3.2, depth=0.8, s=0.45, phase=j * 1.07 + k * 0.4, kind='smoke', alpha=0.75))
        for j in range(4):
            els.append(Mover(['prop:bird0', 'prop:bird1'], (-100 - j * 90, 700 + j * 55), (1800, 520 + j * 40), 5.0 + j, depth=0.6, s=0.9 - j * 0.1, phase=j * 1.3))
    els += [Layer('set:paris:mid', 0.8), Glow(220, 1040, 260, '#e0a52c', depth=1.0, flicker=0.25, base=0.22), Layer('set:paris:fg', 1.0)]
    return els


def L_(acts, **k):
    return Char('lustig', LX, LY, 1.0, acts, blink_phase=0.3, **k)


def Po(acts, **k):
    return Char('poisson', PX, PY, 1.0, acts, blink_phase=1.4, **k)


def shots():
    S = []
    # 1  "A con man is selling the Eiffel Tower,"  CU Lustig, the tower in the window behind him
    S.append(dict(els=hotel(6, 5) + [Char('lustig', 520, 1250, 1.0, [(0, 'neutral', 'gesture', 'down', 'calm'), (0.38, 'smug', 'gesture', 'rub', 'smug'),
                                                                         (0.95, ['smug', 'joy'], 'gesture', 'rub', 'smug'), (1.45, 'smug', 'up', 'rub', 'smug')], blink_phase=0.9)],
                  cam=Cam([(0, 540, 1270, 1.55, -1), (1.8, 520, 1210, 1.85, 1)])))
    # 2  "and the buyer is about to say yes."  Poisson reacts, Lustig's shoulder in the foreground
    S.append(dict(els=hotel(4, 3) + [Po([(0, 'doubt', 'down', 'hold', 'doubt'), (0.45, 'neutral', 'gesture', 'hold', 'calm'), (0.85, 'joy', 'gesture', 'hold', 'joy'), (1.35, ['joy', 'blink'], 'up', 'hold', 'joy')]),
                                     Char('lustig', 690, 1300, 1.05, [(0, 'smug', 'down', 'rub', 'smug'), (0.9, ['smug', 'blink'], 'down', 'rub', 'smug')], depth=1.08, blur=3)],
                  cam=Cam([(0, 1010, 1480, 1.38, 0), (1.74, 1090, 1440, 1.5, 1.5)])))
    # 3  "Paris, 1925."  crane up the street to the tower
    S.append(dict(els=paris(), cam=Cam([(0, 800, 1750, 0.86, 0), (1.35, 800, 1250, 0.93, 0)])))
    # 4  "The tower is rusting,"  girder insert, rust flakes falling
    S.append(dict(els=[Layer('set:girder:back', 1.0), Particles('flake', 50, (150, -100, 1500, 2500), seed=9, color='#a8731c', size=(5, 10), speed=(20, 50)),
                       Particles('flake', 30, (150, -100, 1500, 2500), seed=11, color='#7e1f1f', size=(4, 8), speed=(25, 55))],
                  cam=Cam([(0, 800, 1250, 1.0, -2), (1.04, 820, 1150, 1.22, 2)])))
    # 5  "and newspapers say it costs too much to fix."  paper slams in; Lustig rises behind it
    S.append(dict(els=[Layer('set:desk:back', 0.9, 2), Particles('dust', 40, (0, 0, 1600, 2400), depth=0.95, seed=4),
                       Char('lustig', 800, 1080, 0.95, [(0, 'neutral', 'down', 'down', 'calm'), (0.9, 'doubt', 'down', 'down', 'doubt'), (1.35, 'smug', 'down', 'down', 'smug'), (1.8, ['smug', 'blink'], 'down', 'down', 'smug')],
                            slide=(0.5, 1.1, 0, 260)),
                       Prop('prop:newspaper', 395, 960, 1.0, rot=-3, t_in=0.04, wobble=0.6)],
                  cam=Cam([(0, 800, 1500, 1.15, 0), (0.8, 800, 1430, 1.3, 0), (2.1, 800, 1180, 1.38, -1)], punches=[(0.12, 0.1)]), cap_y=1650))
    # 6  "Victor Lustig forges government letters"  letter insert, ringed hand, seal stamps down
    S.append(dict(els=[Layer('set:desk:back', 0.9, 1.5), Prop('prop:letter', 470, 780, 1.6, rot=2),
                       Prop('arm:lustig:hold:1', 430, 1800, 1.9, rot=-62, path=(0.0, 0.7, -400, 2350, 430, 1800)),
                       Prop('prop:seal', 1010, 1440, 1.05, t_in=1.15), Particles('dust', 40, (0, 0, 1600, 2400), depth=0.95, seed=6)],
                  cam=Cam([(0, 790, 1330, 1.15, -2), (2.1, 830, 1380, 1.32, 1)], punches=[(1.15, 0.08)]), cap_y=1700))
    # 7  "and invites the city's top scrap dealers to a luxury hotel."  wide; dealers arrive
    S.append(dict(els=hotel(0, 0) + [Char('dealer', 1390, 1664, 1.0, [(0, 'neutral', 0, 0, 'calm'), (1.4, 'joy', 0, 0, 'joy'), (2.3, ['joy', 'blink'], 0, 0, 'joy')], extra=True, blink_phase=0.7, slide=(0.25, 1.05, 520, 0)),
                                     Po([(0, 'neutral', 'down', 'down', 'calm'), (1.1, 'joy', 'gesture', 'down', 'joy'), (2.1, ['joy', 'neutral'], 'gesture', 'hold', 'joy')], slide=(0.0, 0.85, 620, 0)),
                                     L_([(0, 'joy', 'wave', 'gesture', 'joy'), (0.95, 'smug', 'gesture', 'gesture', 'smug'), (1.9, ['smug', 'blink'], 'gesture', 'rub', 'smug')]),
                                     Layer('set:hotel:fg', 1.15)],
                  cam=Cam([(0, 700, 1420, 0.9, 0), (3.1, 880, 1440, 0.99, 0)], orbit=0.8)))
    # 8  "He tells them, in secret:"  CU Lustig leans in, finger to his lips
    S.append(dict(els=hotel(7, 6, dust=True) + [L_([(0, 'smug', 'shh', 'down', 'lean'), (0.55, ['smug', 'blink'], 'shh', 'down', 'lean'), (0.95, 'neutral', 'shh', 'down', 'lean')])],
                  cam=Cam([(0, 455, 1150, 2.0, 0), (1.27, 480, 1120, 2.25, -2)])))
    # 9  "the city will sell over seven thousand tons of iron."  Lustig points to the tower; dealers gasp
    S.append(dict(els=hotel(1.5, 1) + [Char('dealer', 1390, 1664, 1.0, [(0, 'neutral', 0, 0, 'calm'), (1.05, 'shock', 0, 0, 'shock'), (1.8, ['shock', 'joy'], 0, 0, 'joy')], extra=True, blink_phase=0.2),
                                       Po([(0, 'neutral', 'down', 'hold', 'calm'), (1.05, 'shock', 'recoil', 'recoil', 'shock'), (1.75, ['shock', 'joy'], 'up', 'recoil', 'joy')]),
                                       L_([(0, 'smug', 'point', 'down', 'smug'), (0.55, 'joy', 'point', 'gesture', 'joy'), (1.5, ['smug', 'blink'], 'point', 'rub', 'smug')])],
                  cam=Cam([(0, 790, 1450, 0.95, 0), (2.56, 960, 1380, 1.12, 0)], punches=[(1.05, 0.16)])))
    # 10 "One dealer, André Poisson, has doubts."  CU Poisson, hand to chin
    S.append(dict(els=hotel(7, 6) + [Po([(0, 'neutral', 'down', 'chin', 'calm'), (0.35, 'doubt', 'down', 'chin', 'doubt'), (0.9, ['doubt', 'neutral', 'doubt'], 'down', 'chin', 'doubt'), (1.7, 'angry', 'fist', 'chin', 'anger')])],
                  cam=Cam([(0, 1110, 1400, 1.85, 0), (2.25, 1080, 1360, 2.05, 2)])))
    # 11 "So Lustig asks him for a bribe."  two-shot: money-rub, Poisson recoils
    S.append(dict(els=hotel(3, 2) + [Po([(0, 'doubt', 'down', 'chin', 'doubt'), (0.7, 'shock', 'recoil', 'recoil', 'shock'), (1.25, 'shock', 'face', 'recoil', 'shock')]),
                                     L_([(0, 'smug', 'down', 'rub', 'smug'), (0.4, ['smug', 'blink'], 'gesture', 'rub', 'smug'), (1.0, 'joy', 'gesture', 'rub', 'joy')])],
                  cam=Cam([(0, 730, 1330, 1.18, 0), (1.63, 790, 1300, 1.3, 0)], punches=[(0.7, 0.1)])))
    # 12 "And that's what convinces him. Only a real official would want a bribe."  Poisson works it out
    S.append(dict(els=hotel(3, 2) + [L_([(0, 'smug', 'down', 'rub', 'smug'), (1.2, ['smug', 'blink'], 'gesture', 'rub', 'smug'), (2.4, 'joy', 'gesture', 'rub', 'joy')], blur=2.5),
                                     Po([(0, 'shock', 'recoil', 'recoil', 'shock'), (0.55, 'doubt', 'down', 'chin', 'doubt'), (1.0, 'joy', 'up', 'chin', 'joy'),
                                         (1.6, ['joy', 'blink', 'joy'], 'up', 'gesture', 'joy'), (2.6, 'smug', 'gesture', 'gesture', 'smug')])],
                  cam=Cam([(0, 1060, 1330, 1.5, 0), (1.4, 1020, 1350, 1.58, 0), (3.45, 830, 1350, 1.25, 0)], punches=[(1.55, 0.12)])))
    # 13 "Poisson pays."  notes slide across, coins drop into Lustig's hand
    S.append(dict(els=[Layer('set:desk:back', 0.9, 1.5), Prop('arm:lustig:hold:1', 380, 1760, 1.8, rot=-48, path=(0.0, 0.45, -400, 2300, 380, 1760)),
                       Prop('prop:notes', 470, 1120, 1.5, rot=-6, path=(0.0, 0.5, 1500, 1050, 470, 1120)),
                       Prop('prop:coin0', 640, 1640, 1.8, t_in=0.55), Prop('prop:coin1', 860, 1720, 1.8, t_in=0.68), Prop('prop:coin2', 1080, 1630, 1.8, t_in=0.81)],
                  cam=Cam([(0, 820, 1420, 1.15, 0), (1.18, 820, 1400, 1.28, 0)], punches=[(0.5, 0.1)]), cap_y=1180))
    # 14 "Lustig escapes to Austria with the money."  night train, waving the notes
    trn = [Layer('set:train:sky', 0.3), Particles('twinkle', 10, (0, 0, 1600, 800), depth=0.3, seed=8),
           Layer('set:train:back', 0.5, scroll=-900), Layer('set:train:interior', 1.0),
           Char('lustig', 540, 1330, 0.55, [(0, 'joy', 'wave', 'up', 'joy'), (0.7, ['joy', 'smug'], 'wave', 'up', 'joy'), (1.4, 'smug', 'wave', 'up', 'smug')]),
           Prop('prop:notes', 615, 1140, 0.32, rot=-24, wobble=6),
           Layer('set:train:fg', 1.0)]
    trn += [Mover([f'prop:puff{j % 3}'], (1750, 760 - j * 20), (-250, 560 - j * 30), 1.6, depth=0.95, s=0.9, phase=j * 0.4, kind='smoke', alpha=0.9) for j in range(4)]
    S.append(dict(els=trn, cam=Cam([(0, 600, 1220, 1.45, -1), (1.97, 640, 1200, 1.62, 1)], orbit=0.5), cap_y=1560))
    # 15 "Poisson is too embarrassed to call the police."  outside the station, head down
    S.append(dict(els=[Layer('set:police:sky', 0.3), Layer('set:police:back', 0.9), Glow(820, 880, 280, '#6f86d9', depth=0.9, flicker=0.3, base=0.3),
                       Char('gendarme', 1000, 1540, 0.8, [(0, 'neutral', 0, 0, 'calm'), (0.9, 'doubt', 0, 0, 'doubt'), (1.7, ['doubt', 'blink'], 0, 0, 'doubt')], extra=True, depth=0.9, blur=1.5),
                       Char('poisson', 760, 1720, 1.0, [(0, 'grief', 'down', 'down', 'grief'), (1.15, ['grief', 'blink', 'grief'], 'face', 'down', 'grief')], blink_phase=0.5),
                       Layer('set:police:fg', 1.05)],
                  cam=Cam([(0, 800, 1520, 1.05, 0), (2.42, 790, 1440, 1.24, 0)])))
    # 16 "So Lustig comes back to Paris and does it all again."  he strolls back in, winks
    S.append(dict(els=paris() + [Char('lustig', 1060, 1560, 1.0, [(0, 'smug', 'down', 'down', 'smug'), (0.55, 'joy', 'wave', 'rub', 'joy'), (1.45, 'smug', 'gesture', 'rub', 'smug'),
                                                                  (2.2, ['smug', 'blink', 'smug'], 'gesture', 'rub', 'smug')], slide=(0.0, 0.6, 420, 0), blink_phase=0.0)],
                  cam=Cam([(0, 900, 1320, 0.9, 0), (1.45, 980, 1360, 1.05, 0), (3.0, 1050, 1120, 1.55, 0)], punches=[(1.5, 0.12)])))
    return S


SFX = [  # (time s, sound id, gain dB)
    (0.42, 'money-coin-spin', -16), (1.75, 'whoosh-fast-soft', -14), (2.66, 'pop-medium-in', -14),
    (3.48, 'whoosh-medium-medium', -12), (3.7, 'props-shop-bell', -22), (4.85, 'whoosh-fast-medium', -13),
    (5.95, 'impact-medium-soft', -10), (6.0, 'foley-paper-slide', -12), (8.0, 'whoosh-fast-soft', -14), (8.3, 'foley-paper-touch', -10),
    (9.19, 'impact-heavy-soft', -8), (10.1, 'whoosh-medium-soft', -13), (10.4, 'props-doorbell', -20), (11.6, 'pop-small-in', -14),
    (13.2, 'whoosh-fast-soft', -14), (13.5, 'swish-soft', -16), (14.45, 'whoosh-fast-soft', -15), (15.55, 'sting-bold-short', -12),
    (15.6, 'impact-deep-soft', -12), (17.03, 'whoosh-fast-soft', -15), (18.8, 'impact-light-soft', -12), (19.28, 'whoosh-fast-soft', -15),
    (20.0, 'sting-playful-short', -15), (20.9, 'whoosh-fast-soft', -15), (21.95, 'shimmer-short-sparkle', -14), (22.5, 'notification-success-chime', -16),
    (24.38, 'whoosh-medium-medium', -13), (24.6, 'money-notes', -9), (24.96, 'money-coin-drop', -10), (25.1, 'money-coin-drop', -12),
    (25.55, 'whoosh-medium-medium', -12), (25.9, 'reverse-whoosh-short-soft', -18), (27.53, 'whoosh-medium-medium', -12), (28.75, 'boom-hit-soft', -14),
    (29.95, 'whoosh-medium-medium', -12), (30.6, 'swish-soft', -15), (31.5, 'impact-medium-soft', -11), (31.52, 'sting-playful-short', -13),
    (32.1, 'shimmer-short-sparkle', -15)]
