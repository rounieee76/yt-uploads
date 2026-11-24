"""Fallback thumbnail in the Mr. Company style (use only when ChatGPT image generation is unavailable):
light-gray studio background, 2-4 casual words in bold black at the top with ONE word underlined in red,
one hero object in the middle. Usage:
  thumb_mc.py --text "it's a Trap" --underline "Trap" --out out/thumbnail.jpg [--object path/to/object.png]
Without --object a flat illustrated car is drawn (weaker than a photoreal product shot)."""
import argparse
from PIL import Image, ImageDraw, ImageFont, ImageFilter
F = '/home/claude/ce/tools/fonts'
ap = argparse.ArgumentParser(); ap.add_argument('--text', required=True); ap.add_argument('--underline', required=True)
ap.add_argument('--out', required=True); ap.add_argument('--object'); a = ap.parse_args()
S = 2; W, H = 1280 * S, 720 * S
img = Image.new('RGB', (W, H), '#E9E9E9')
# soft vignette: lighter centre
glow = Image.new('L', (W, H), 0); ImageDraw.Draw(glow).ellipse([W * .1, H * .15, W * .9, H * 1.2], fill=255)
glow = glow.filter(ImageFilter.GaussianBlur(220)); img = Image.composite(Image.new('RGB', (W, H), '#F7F7F7'), img, glow)
d = ImageDraw.Draw(img)
size = 150
while True:
    f = ImageFont.truetype(f'{F}/Montserrat-Black.ttf', size * S)
    if d.textlength(a.text, font=f) < W * .88 or size < 70: break
    size -= 6
tw = d.textlength(a.text, font=f); x0 = (W - tw) / 2; y0 = 40 * S
d.text((x0, y0), a.text, font=f, fill='#0A0A0A')
i = a.text.rfind(a.underline)
ux0 = x0 + d.textlength(a.text[:i], font=f); ux1 = ux0 + d.textlength(a.underline, font=f)
uy = y0 + size * S * 1.08
d.rectangle([ux0, uy, ux1, uy + 9 * S], fill='#E10600')
if a.object:
    ob = Image.open(a.object).convert('RGBA'); ob.thumbnail((int(W * .8), int(H * .66)))
    sh = Image.new('L', (W, H), 0); ImageDraw.Draw(sh).ellipse([W / 2 - ob.width * .45, H - 120 * S, W / 2 + ob.width * .45, H - 70 * S], fill=120)
    img.paste('#BDBDBD', mask=sh.filter(ImageFilter.GaussianBlur(30)))
    img.paste(ob, (int((W - ob.width) / 2), int(H - ob.height - 60 * S)), ob)
else:
    sc = 3.0 * S; cx, cy = W / 2 - 190 * sc, H - 520 * S
    P = lambda pts: [(cx + x * sc, cy + y * sc) for x, y in pts]
    d.ellipse([W / 2 - 560 * S, H - 140 * S, W / 2 + 560 * S, H - 80 * S], fill='#CFCFCF')
    d.polygon(P([(30, 110), (60, 60), (95, 45), (250, 45), (295, 65), (330, 100), (365, 112), (370, 132), (20, 132), (20, 118)]), fill='#1F4FA8')
    for wx, wy, ww, wh in [(95, 60, 55, 38), (165, 60, 90, 38)]:
        d.rectangle([cx + wx * sc, cy + wy * sc, cx + (wx + ww) * sc, cy + (wy + wh) * sc], fill='#BFE3FF')
    for c in (95, 290):
        d.ellipse([cx + (c - 26) * sc, cy + 106 * sc, cx + (c + 26) * sc, cy + 158 * sc], fill='#151515')
img.resize((1280, 720), Image.LANCZOS).save(a.out, quality=93)
print('thumbnail', a.out)
