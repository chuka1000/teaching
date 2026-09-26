#!/usr/bin/env python3
"""
Diagrams for the How Science Works assessment (7B). PRINTED IN BLACK AND WHITE:
black on white plus light grey for grid lines. Written to assets/assessment/hsw/.

    python3 build/how-science-works-assessment-check.py
    python3 build/how-science-works-assessment-diagrams.py
"""
import json, math, pathlib
from PIL import Image, ImageDraw, ImageFont

HERE = pathlib.Path(__file__).parent
OUT = HERE.parent / 'assets' / 'assessment' / 'hsw'
OUT.mkdir(parents=True, exist_ok=True)
NUM = json.loads((HERE / 'how-science-works-assessment.numbers.json').read_text())
ARIAL = '/System/Library/Fonts/Supplemental/Arial.ttf'
ARIAL_B = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
F = lambda s, b=False: ImageFont.truetype(ARIAL_B if b else ARIAL, s)
K, WHITE, GREY, MID = 0, 255, 215, 150

def canvas(w, h):
    im = Image.new('L', (w, h), WHITE); return im, ImageDraw.Draw(im)

def fly(d, x, y, s=1.0):
    s = s * 1.7
    d.ellipse((x - 9 * s, y - 5 * s, x + 9 * s, y + 5 * s), fill=K)
    d.ellipse((x - 14 * s, y - 16 * s, x - 2 * s, y - 3 * s), outline=K, width=2)
    d.ellipse((x + 2 * s, y - 16 * s, x + 14 * s, y - 3 * s), outline=K, width=2)

# ---- Redi's three jars ----------------------------------------------------
def redi():
    W, H = 1500, 640
    im, d = canvas(W, H)
    kinds = [('A', 'Open'), ('B', 'Covered with gauze'), ('C', 'Sealed')]
    for i, (L, name) in enumerate(kinds):
        cx = 250 + i * 500
        d.text((cx, 40), f'Jar {L}', font=F(40, True), fill=K, anchor='mm')
        x0, x1, y0, y1 = cx - 130, cx + 130, 150, 430
        d.line([(x0, y0), (x0, y1), (x1, y1), (x1, y0)], fill=K, width=8, joint='curve')
        d.ellipse((cx - 70, y1 - 70, cx + 70, y1 - 8), fill=90)          # the meat
        if L == 'B':                                                     # gauze: a cross-hatched cover
            d.rectangle((x0 - 6, y0 - 8, x1 + 6, y0 + 14), outline=K, width=3)
            for gx in range(x0, x1, 22): d.line([(gx, y0 - 8), (gx, y0 + 14)], fill=K, width=2)
        if L == 'C':                                                     # sealed: a solid lid
            d.rectangle((x0 - 14, y0 - 22, x1 + 14, y0 + 4), fill=K)
        if L == 'A': fly(d, cx - 30, 100); fly(d, cx + 40, 120, 0.9); fly(d, cx - 10, 200, 0.9)
        if L == 'B': fly(d, cx - 50, 100); fly(d, cx + 55, 108, 0.9)
        if L == 'C': fly(d, cx + 200, 210); fly(d, cx - 210, 160, 0.9)
        d.text((cx, 480), name, font=F(34, True), fill=K, anchor='mm')
    d.text((W // 2, 590), 'The small black shapes are flies.', font=F(28), fill=70, anchor='mm')
    im.save(OUT / 'redi_jars.png')

# ---- the turkey's confidence graph -----------------------------------------
def turkey():
    W, H = 1400, 900
    S = 3                                          # draw big, then shrink for smooth lines
    im, d = canvas(W * S, H * S)
    L, R, T, B = 170 * S, 1330 * S, 60 * S, 740 * S
    xs = lambda day: L + (R - L) * day / 100
    ys = lambda pct: B - (B - T) * (pct - 50) / 50
    for pct in range(50, 101, 5):
        d.line([(L, ys(pct)), (R, ys(pct))], fill=GREY if pct % 10 else MID, width=(2 if pct % 10 else 3) * S)
    for day in range(0, 101, 10):
        d.line([(xs(day), T), (xs(day), B)], fill=GREY if day % 20 else MID, width=(2 if day % 20 else 3) * S)
    d.line([(L, T), (L, B), (R, B)], fill=K, width=7 * S)
    for pct in range(50, 101, 10):
        d.text((L - 22 * S, ys(pct)), str(pct), font=F(34 * S), fill=K, anchor='rm')
    for day in range(0, 101, 20):
        d.text((xs(day), B + 20 * S), str(day), font=F(34 * S), fill=K, anchor='mt')
    d.text((xs(50), B + 100 * S), 'Days the turkey has been fed', font=F(38 * S, True), fill=K, anchor='mt')
    d.text((34 * S, (T + B) // 2), '', font=F(10 * S), fill=K)
    lab = Image.new('L', (620 * S, 60 * S), WHITE); ld = ImageDraw.Draw(lab)
    ld.text((310 * S, 30 * S), 'How sure the turkey is (%)', font=F(38 * S, True), fill=K, anchor='mm')
    lab = lab.rotate(90, expand=True); im.paste(lab, (20 * S, int((T + B) / 2 - 310 * S)))
    pts = [(xs(dd), ys(c)) for dd, c in NUM['q10']['curve']]
    d.line(pts, fill=K, width=8 * S, joint='curve')
    im = im.resize((W, H), Image.LANCZOS); im.save(OUT / 'turkey_graph.png')

def tickbox():
    im, d = canvas(40, 40)
    d.rectangle((3, 3, 36, 36), outline=K, width=4); im.save(OUT / 'box.png')

if __name__ == '__main__':
    redi(); turkey(); tickbox(); print('diagrams written to', OUT)
