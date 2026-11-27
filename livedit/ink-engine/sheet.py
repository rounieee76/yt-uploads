from bodies import *
from sets import *
from PIL import Image, ImageDraw, ImageFont
import os
WK='/home/claude/eiffel/work'
def full(n, expr, la, ra):
    c=CAST[n]; (lx,ly),(rx_,ry)=SHOULDERS[n]
    A,_=arm(c, ra, lit=False); B,_=arm(c, la, lit=True)
    return BODIES[n]() + f'<g transform="translate({rx_} {ry})">{A}</g>' + f'<g transform="translate({lx} {ly}) scale(-1 1)">{B}</g>' + head(c, expr)
if __name__=="__main__":
    # cast panel
    ex=['neutral','blink','angry','smug','joy','shock','doubt','grief']
    b=f'<rect x="0" y="0" width="3600" height="2750" fill="{PALE}"/>'
    b+=f'<g transform="translate(330 560)">{full("lustig","smug","gesture","rub")}</g>'
    for i,e in enumerate(ex):
        b+=f'<g transform="translate({830+i*340} 560) scale(0.95)">{head(LUSTIG,e)}</g>'
    b+=f'<g transform="translate(360 2000) scale(0.95)">{full("poisson","doubt","chin","hold")}</g>'
    for i,e in enumerate(ex):
        b+=f'<g transform="translate({830+i*340} 1420) scale(0.85)">{head(POISSON,e)}</g>'
    b+=f'<g transform="translate(1150 2330) scale(0.75)">{extra(DEALER,"dealer","joy")}</g>'
    b+=f'<g transform="translate(1650 2160) scale(0.75)">{extra(GENDARME,"gendarme","doubt")}</g>'
    for i,(n,p) in enumerate([('lustig','point'),('lustig','shh'),('poisson','recoil'),('poisson','fist')]):
        A,_=arm(CAST[n],p,lit=True)
        b+=f'<g transform="translate({2150+i*360} 2250) scale(0.8)">{A}</g>'
    T=lambda x,y,t,sz=40: f'<text x="{x}" y="{y}" font-family="Oswald" font-size="{sz}" fill="{INK}">{t}</text>'
    for i,e in enumerate(ex):
        b+=T(770+i*340,640,e.upper(),30)+T(770+i*340,1520,e.upper(),30)
    b+=T(40,60,'VICTOR LUSTIG - thin, jug ears, long nose, pencil moustache, top hat, gold signet ring',44)
    b+=T(40,1010,'ANDRE POISSON - huge, bowler, bald dome + pale fringe, walrus moustache, bulb nose, jowls, plaid',44)
    b+=T(900,2700,'EXTRAS: rival dealer (short, beard, flat cap) and gendarme (tall, kepi, handlebar)',40)+T(2150,1900,'extra arm poses (each its own drawing)',36)
    render(b,(0,0,3600,2750),WK+'/sheet_cast.png',scale=0.5)
    for k,f in SETS.items():
        L=f(); order=['sky','back','interior','mid','fg']
        body=''.join(L[o] for o in order if o in L)
        render(body,(0,0,1600,2400),WK+f'/sheet_set_{k}.png',scale=0.25)
    rng=R('props')
    pb=f'<rect x="0" y="0" width="2600" height="1300" fill="{BLUE}"/>'+letter(rng,60,120,rot=-4)+newspaper(rng,560,80,w=760,h=1060,rot=3)+banknotes(rng,1420,300,rot=-8)+coin(rng,1550,720,60)+coin(rng,1700,760,50)
    pb+=f'<g transform="translate(1900 60) scale(0.42)">{girder(R("gird"))}</g>'
    render(pb,(0,0,2600,1300),WK+'/sheet_props.png',scale=0.4)
    # assemble
    S=Image.new('RGB',(1800,2400),'#f1e2c0'); d=ImageDraw.Draw(S)
    F=lambda s: ImageFont.truetype('/home/claude/lived/fonts/Oswald.ttf',s)
    d.text((40,24),'THE EIFFEL TOWER CON  ·  design sheet  ·  Paris 1925',font=F(46),fill='#170b08')
    x=40
    for nm,hx in PALETTE+[('ink','#170b08'),('fine ink','#4d140a')]:
        d.rectangle([x,100,x+120,170],fill=hx,outline='#170b08',width=3); d.text((x,176),f'{nm}\n{hx}',font=F(20),fill='#170b08'); x+=150
    d.text((1110,104),'locked: cobalt · salmon skin · cream · gold · red\n+ one shade/one light tone each; lilac = eye whites only',font=F(22),fill='#4d140a')
    cast=Image.open(WK+'/sheet_cast.png').convert('RGB'); cast=cast.resize((1720,int(cast.height*1720/cast.width))); S.paste(cast,(40,250))
    y=250+cast.height+20
    d.text((40,y),'SETS (layered for parallax)  —  hotel suite (day) · Paris night · night train · police station',font=F(26),fill='#170b08'); y+=44
    for i,k in enumerate(['hotel','paris','train','police']):
        im=Image.open(WK+f'/sheet_set_{k}.png').convert('RGB').resize((300,450)); S.paste(im,(40+i*320,y))
    pr=Image.open(WK+'/sheet_props.png').convert('RGB'); pr=pr.resize((420,int(pr.height*420/pr.width)))
    S.paste(pr,(1330,y)); d.text((1330,y+pr.height+8),'PROPS: forged letter, newspaper,\nfranc notes, coins, rusting girder',font=F(22),fill='#170b08')
    S=S.crop((0,0,1800,y+470)); S.save(WK+'/design_sheet.jpg',quality=92); print(S.size)
