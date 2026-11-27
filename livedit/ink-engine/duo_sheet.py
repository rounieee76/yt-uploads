from bodies import *
from sheet import full
from PIL import Image
WK='/home/claude/eiffel/work'
ex=['neutral','blink','angry','smug','joy','shock','doubt','grief']
T=lambda x,y,t,sz=40: f'<text x="{x}" y="{y}" font-family="Oswald" font-size="{sz}" fill="{INK}">{t}</text>'
b=f'<rect x="0" y="0" width="3600" height="3000" fill="{PALE}"/>'
b+=T(40,80,'RECURRING DUO (original) - the "you" characters for every video. Skin, hair and clothes take that story\'s locked palette.',46)
b+=f'<g transform="translate(330 700)">{full("leo","joy","gesture","point")}</g>'
for i,e in enumerate(ex):
    b+=f'<g transform="translate({830+i*340} 640)">{head(LEO,e)}</g>'+T(770+i*340,730,e.upper(),30)
b+=T(40,160,'LEO - tall and lanky, gold spiky tufts, freckles, button nose, bomber jacket with ribbed gold trim, cream sneakers',40)
b+=f'<g transform="translate(330 2400)">{full("mira","smug","hip","wave")}</g>'
for i,e in enumerate(ex):
    b+=f'<g transform="translate({830+i*340} 2050)">{head(MIRA,e)}</g>'+T(770+i*340,2140,e.upper(),30)
b+=T(40,1700,'MIRA - short and round, heavy blunt bob, round gold glasses, lashes, red lips, gold studs, red coat, plaid skirt, boots',40)
render(b,(0,0,3600,3000),WK+'/duo_sheet.png',scale=0.5)
Image.open(WK+'/duo_sheet.png').convert('RGB').save(WK+'/duo_sheet.jpg',quality=92)
