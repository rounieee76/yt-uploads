"""Thumbnails in Python (Pillow). Drawn at 2x, downscaled to 1280x720. Genre style: one subject, 2-4 huge words
with a thick black outline, a red crash cue, high contrast, readable at 320x180."""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math
F = '/home/claude/ce/tools/fonts'; OUT = '/home/claude/ce/out'
S = 2; W, H = 1280 * S, 720 * S
INK, NAVY, BLUE, LIME, RED, YEL, WHITE, PAPER = '#0B0F09', '#0A1A2E', '#2E8BFF', '#C5EE3C', '#FF3B30', '#FFD60A', '#FFFFFF', '#F1EEE5'
def font(n, size): return ImageFont.truetype(f'{F}/{n}.ttf', size * S)
def outlined(d, xy, txt, f, fill, stroke=10, sc=INK, anchor='la'):
    d.text((xy[0] * S, xy[1] * S), txt, font=f, fill=fill, stroke_width=stroke * S, stroke_fill=sc, anchor=anchor)
def shadow_layer(img, draw_fn, off=(10, 12), blur=14, alpha=170):
    sh = Image.new('RGBA', img.size, (0, 0, 0, 0)); draw_fn(ImageDraw.Draw(sh), True)
    sh = sh.filter(ImageFilter.GaussianBlur(blur * S)); a = sh.split()[3].point(lambda v: min(alpha, v))
    sh.putalpha(a); img.alpha_composite(sh, (off[0] * S, off[1] * S)); draw_fn(ImageDraw.Draw(img), False)
def P(*pts): return [(x * S, y * S) for x, y in pts]
def rect(d, x0, y0, x1, y1, fill, r=0): d.rounded_rectangle([x0 * S, y0 * S, x1 * S, y1 * S], r * S, fill=fill)
def arrow(d, x0, y0, x1, y1, w, color, head=1.0):
    ang = math.atan2(y1 - y0, x1 - x0); hl, hw = 95 * head, 85 * head
    bx, by = x1 - hl * math.cos(ang), y1 - hl * math.sin(ang)
    nx, ny = -math.sin(ang), math.cos(ang)
    d.line(P((x0, y0), (bx, by)), fill=color, width=int(w * S))
    d.polygon(P((x1, y1), (bx + nx * hw, by + ny * hw), (bx - nx * hw, by - ny * hw)), fill=color)
def car(d, x, y, sc, color):
    pts = [(30, 110), (60, 60), (95, 45), (250, 45), (295, 65), (330, 100), (365, 112), (370, 132), (20, 132), (20, 118)]
    d.polygon(P(*[(x + px * sc, y + py * sc) for px, py in pts]), fill=color)
    for wx, wy, ww, wh in [(95, 60, 55, 38), (165, 60, 90, 38)]:
        d.rectangle([(x + wx * sc) * S, (y + wy * sc) * S, (x + (wx + ww) * sc) * S, (y + (wy + wh) * sc) * S], fill='#BFE3FF')
    for cx in (95, 290):
        d.ellipse([(x + (cx - 26) * sc) * S, (y + 106 * sc) * S, (x + (cx + 26) * sc) * S, (y + 158 * sc) * S], fill='#151A13')
def base(bg):
    return Image.new('RGBA', (W, H), bg)
def finish(img, name):
    img.convert('RGB').resize((1280, 720), Image.LANCZOS).save(f'{OUT}/{name}.jpg', quality=93)

# ── V1: IT'S OVER — the car wash with a crash arrow ──
def v1():
    img = base(NAVY); d = ImageDraw.Draw(img)
    rect(d, 0, 560, 1280, 720, '#121A10')                                # ground
    rect(d, 600, 210, 1220, 560, '#163E6B', 30); rect(d, 650, 260, 1170, 560, '#071628', 18)   # tunnel
    for i in range(9): rect(d, 690 + i * 55, 280, 700 + i * 55, 330 + (i % 3) * 30, '#5FB4FF', 4)  # spray
    car(d, 740, 395, 1.05, PAPER)
    # sign hanging askew
    sign = Image.new('RGBA', (560 * S, 130 * S), (0, 0, 0, 0)); sd = ImageDraw.Draw(sign)
    sd.rounded_rectangle([0, 0, 560 * S, 130 * S], 18 * S, fill=LIME)
    sd.text((280 * S, 66 * S), 'UNLIMITED', font=font('Anton', 92), fill=INK, anchor='mm')
    sign = sign.rotate(-11, expand=True, resample=Image.BICUBIC); img.alpha_composite(sign, (640 * S, 95 * S))
    # crash arrow across the building
    def ar(dd, sh): arrow(dd, 640, 150, 1180, 600, 62, INK if sh else RED, 1.25)
    shadow_layer(img, ar, (0, 0), 6, 255); d = ImageDraw.Draw(img); arrow(d, 640, 150, 1180, 600, 44, RED, 1.1)
    def tx(dd, sh):
        c = INK if sh else None
        dd.text((60 * S, 70 * S), "IT'S", font=font('Anton', 190), fill=c or WHITE, stroke_width=12 * S, stroke_fill=INK)
        dd.text((60 * S, 270 * S), 'OVER', font=font('Anton', 230), fill=c or YEL, stroke_width=14 * S, stroke_fill=INK)
    shadow_layer(img, tx); d = ImageDraw.Draw(img)
    rect(d, 66, 590, 520, 672, RED, 14); d.text((293 * S, 631 * S), '$654M IN DEBT', font=font('Montserrat-Black', 46), fill=WHITE, anchor='mm')
    finish(img, 'thumbnail_1_its_over')

# ── V2: $15 → $7 — the Wall Street fall ──
def v2():
    img = base('#0E1410'); d = ImageDraw.Draw(img)
    # stock crash line
    pts = [(560, 120), (700, 200), (800, 160), (900, 330), (1000, 300), (1100, 520)]
    d.line(P(*pts), fill=RED, width=22 * S, joint='curve')
    arrow(d, 1000, 300, 1215, 660, 22, RED, 1.0)
    def tx(dd, sh):
        dd.text((60 * S, 40 * S), '$15', font=font('Anton', 260), fill=INK if sh else WHITE, stroke_width=14 * S, stroke_fill=INK)
        dd.text((560 * S, 250 * S), '$7', font=font('Anton', 360), fill=INK if sh else RED, stroke_width=16 * S, stroke_fill=INK)
    shadow_layer(img, tx); d = ImageDraw.Draw(img)
    d.line(P((50, 230), (420, 300)), fill=RED, width=28 * S)                     # strike-through on $15
    rect(d, 60, 600, 520, 680, LIME, 14); d.text((290 * S, 641 * S), 'CAR WASH STOCK', font=font('Montserrat-Black', 46), fill=INK, anchor='mm')
    finish(img, 'thumbnail_2_15_to_7')

# ── V3: THE TRAP — the pay screen ──
def v3():
    img = base('#123B66'); d = ImageDraw.Draw(img)
    rect(d, 0, 0, 560, 720, '#0B0F09')
    # kiosk
    rect(d, 650, 40, 1190, 760, '#1C241A', 36); rect(d, 690, 85, 1150, 520, '#0A2440', 18)
    rect(d, 720, 115, 1120, 215, '#1C4E80', 14)
    d.text((745 * S, 130 * S), 'Single wash', font=font('Montserrat-Bold', 30), fill=PAPER)
    d.text((745 * S, 165 * S), '$15', font=font('Montserrat-Black', 42), fill=PAPER)
    rect(d, 720, 235, 1120, 495, LIME, 16)
    d.text((750 * S, 255 * S), 'UNLIMITED', font=font('Montserrat-Black', 40), fill=INK)
    d.text((748 * S, 295 * S), '$25', font=font('Anton', 120), fill=INK)
    d.text((750 * S, 450 * S), 'a month · auto-renews', font=font('Montserrat-Bold', 24), fill=INK)
    # finger tap ring
    for r, w in [(48, 8), (26, 0)]:
        if w: d.ellipse([(1060 - r) * S, (300 - r) * S, (1060 + r) * S, (300 + r) * S], outline=WHITE, width=w * S)
        else: d.ellipse([(1060 - r) * S, (300 - r) * S, (1060 + r) * S, (300 + r) * S], fill=WHITE)
    def tx(dd, sh):
        dd.text((50 * S, 90 * S), 'THE', font=font('Anton', 170), fill=INK if sh else WHITE, stroke_width=12 * S, stroke_fill=INK)
        dd.text((50 * S, 270 * S), 'TRAP', font=font('Anton', 250), fill=INK if sh else YEL, stroke_width=14 * S, stroke_fill=INK)
    shadow_layer(img, tx); d = ImageDraw.Draw(img)
    st = Image.new('RGBA', (470 * S, 120 * S), (0, 0, 0, 0)); sd = ImageDraw.Draw(st)
    sd.rectangle([0, 0, 470 * S - 1, 120 * S - 1], fill=RED); sd.text((235 * S, 60 * S), 'IS BREAKING', font=font('Anton', 84), fill=WHITE, anchor='mm')
    st = st.rotate(7, expand=True, resample=Image.BICUBIC); img.alpha_composite(st, (40 * S, 560 * S))
    finish(img, 'thumbnail_3_the_trap')

v1(); v2(); v3(); print('done')
