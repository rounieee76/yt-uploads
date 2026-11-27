"""The cast for 'The Eiffel Tower con' (Paris, 1925). Original caricatures."""
from chars import *

# Victor Lustig: thin, tall top hat, huge jug ears, long pointed nose, pencil moustache, gold signet ring
LUSTIG = dict(name='lustig', rx=104, ryt=150, ryb=150, jaw=64, chin=0.3, cy=-168, ear=42, nose='long', nose_len=96, nose_w=16,
              es=17, ex=33, eye_y=-18, mouth_y=118, mw=28, mous='pencil', mous_w=34, mous_dy=16, hair='slick', hat='top',
              hatshade=22, pores=18, stubble=0, fwrinkles=1, folds=1, fold_x=34, bags=2, lid=0.45, neck=30,
              brow_w=8, sleeve=INK, sleeve_d=INK, cuff=PALE, ring=True, hand=0.95, sleeve_w=40, lw=4.0)

# Andre Poisson: huge, round, bowler hat, bald dome with pale fringe, walrus moustache, bulb nose, jowls
POISSON = dict(name='poisson', rx=150, ryt=122, ryb=150, jaw=132, chin=0.55, cy=-185, ear=24, nose='bulb', nose_r=36, nose_len=46,
               es=15, ex=40, eye_y=-20, mouth_y=100, mw=36, mous='walrus', mous_w=46, mous_color=PALE, hair='fringe',
               hat='bowler', hatshade=8, jowls=True, dchin=True, pores=40, stubble=40, fwrinkles=3, folds=2, fold_x=44,
               bags=3, lid=0.5, neck=70, bushy=True, brow_color=PALE, blush=True, sleeve=GOLD, sleeve_d=GOLD_D,
               sleeve_pattern=lambda r, x, y, w, h: plaid(r, x, y, w, h), cuff=PALE, ring=True, hand=1.12, sleeve_w=58, lw=4.4, dropk=1.1)

# Extras: short bearded dealer (flat cap, hook nose), gendarme (kepi, handlebar moustache)
DEALER = dict(name='dealer', rx=112, ryt=110, ryb=110, jaw=96, chin=0.5, cy=-160, ear=24, nose='hook', nose_len=56,
              es=14, ex=32, eye_y=-14, mouth_y=78, mw=24, beard=True, beard_color=INK, hair='cropped', hat='cap', pores=16,
              fwrinkles=2, folds=1, fold_x=30, bags=2, neck=40, brow_w=7, lw=4.0)
GENDARME = dict(name='gendarme', rx=110, ryt=125, ryb=128, jaw=100, chin=0.55, cy=-170, ear=26, nose='long', nose_len=52,
                es=14, ex=32, eye_y=-10, mouth_y=86, mw=26, mous='handlebar', mous_w=30, hair='cropped', hat='kepi',
                pores=20, stubble=30, folds=1, fold_x=32, bags=1, neck=44, brow_w=7, lw=4.0)

CAST = {'lustig': LUSTIG, 'poisson': POISSON, 'dealer': DEALER, 'gendarme': GENDARME}

# ---- recurring duo (original). Palette slots: they always wear the story's locked colours.
LEO = dict(name='leo', rx=104, ryt=132, ryb=138, jaw=92, chin=0.62, cy=-160, ear=26, nose='button', nose_r=17, nose_len=40,
           es=17, ex=34, eye_y=-10, mouth_y=86, mw=30, hair='spiky', hair_color=GOLD, hair_over=True, freckles=True, pores=10, stubble=0,
           fwrinkles=0, folds=0, fold_x=34, bags=0, lid=0.4, neck=38, young=True, brow_w=9, brow_color=GOLD_D, lw=4.2,
           sleeve=BLUE, sleeve_d=BLUE_D, cuff=GOLD, hand=1.0, sleeve_w=48)
MIRA = dict(name='mira', rx=116, ryt=124, ryb=116, jaw=80, chin=0.42, cy=-150, ear=22, nose='button', nose_r=13, nose_len=34,
            es=18, ex=38, eye_y=-4, mouth_y=74, mw=24, hair='bob', hair_color=INK, hair_over=True, lashes=True, lips=RED, glasses=True, earring=True,
            pores=6, stubble=0, fwrinkles=0, folds=0, fold_x=34, bags=0, lid=0.35, neck=30, young=True, brow_w=7, lw=4.0,
            sleeve=RED, sleeve_d=RED_D, cuff=PALE, hand=0.9, sleeve_w=42, ring=True)
CAST.update(leo=LEO, mira=MIRA)
