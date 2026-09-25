#!/usr/bin/env python3
"""
Pictures for the Atoms assessment (T3). PRINTED IN BLACK AND WHITE (ASSESSMENT.md):
pure black on white, light grey and hatching only. The class learned protons as yellow
dots and neutrons as rose dots; on paper that cannot be told apart, so a proton is a
solid black dot and a neutron an open one, with a key beside every picture that needs it.

  * the taught icons are converted to greyscale (they survive it: checked by eye)
  * the atom and the nucleus are drawn in the same style as Drawing an Atom and The Nucleus
Written to assets/assessment/atoms/, read by build/atoms-assessment.js.

    python3 build/atoms-assessment-diagrams.py
"""
import math, pathlib
from PIL import Image, ImageDraw, ImageFont, ImageOps

HERE = pathlib.Path(__file__).parent
SRC = HERE.parent / 'assets' / 'atoms'
OUT = HERE.parent / 'assets' / 'assessment' / 'atoms'
OUT.mkdir(parents=True, exist_ok=True)
ARIAL = '/System/Library/Fonts/Supplemental/Arial.ttf'
ARIAL_B = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
F = lambda s, b=False: ImageFont.truetype(ARIAL_B if b else ARIAL, s)
K, W_, GREY = 0, 255, 222

# ---- 1. the taught icons, in greyscale ------------------------------------------------
for n in ['atom_green', 'matter', 'tiny', 'part', 'centre', 'electron', 'nucleus', 'outside', 'water', 'apple', 'air', 'hand', 'pencil']:
    im = Image.open(SRC / f'{n}.png').convert('RGBA')
    bg = Image.new('RGBA', im.size, (255, 255, 255, 255)); bg.alpha_composite(im)
    g = ImageOps.autocontrast(bg.convert('L'), cutoff=1)
    g.thumbnail((360, 360)); g.save(OUT / f'g_{n}.png')

# ---- 2. drawing helpers ---------------------------------------------------------------
def hatch_circle(im, cx, cy, r, gap=13):
    """light grey fill with diagonal hatching, clipped to the circle, with a black outline"""
    d = ImageDraw.Draw(im)
    mask = Image.new('L', im.size, 0); ImageDraw.Draw(mask).ellipse((cx - r, cy - r, cx + r, cy + r), fill=255)
    layer = Image.new('L', im.size, GREY); ld = ImageDraw.Draw(layer)
    for k in range(-2 * r, 2 * r, gap):
        ld.line([(cx - r + k, cy + r), (cx + r + k, cy - r)], fill=120, width=2)
    im.paste(layer, (0, 0), mask)
    d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=K, width=5)

def dot(d, x, y, kind, r=28):
    if kind == 'p': d.ellipse((x - r, y - r, x + r, y + r), fill=K, outline=K, width=5)
    else: d.ellipse((x - r, y - r, x + r, y + r), fill=W_, outline=K, width=6)

def key(d, x, y):
    dot(d, x + 16, y, 'p', 16); d.text((x + 44, y), 'proton', font=F(30), fill=K, anchor='lm')
    dot(d, x + 250, y, 'n', 16); d.text((x + 278, y), 'neutron', font=F(30), fill=K, anchor='lm')

def leader(d, box, target):
    d.line([(box[0], (box[1] + box[3]) // 2), target], fill=K, width=4)
    d.ellipse((target[0] - 8, target[1] - 8, target[0] + 8, target[1] + 8), fill=K)

def label_boxes(d, points, x0=700, x1=970, h=96, ys=None):
    ys = ys or [150, 320, 490][:len(points)]
    for cy, target in zip(ys, points):
        box = (x0, cy - h // 2, x1, cy + h // 2)
        d.rectangle(box, fill=W_, outline=K, width=4); leader(d, box, target)

CX, CY, R, NR = 300, 320, 235, 72

def atom_points(electrons, nucleus_r=NR):
    a = math.radians(electrons[0])
    return {'nucleus': (CX + nucleus_r * math.cos(math.radians(-25)), CY + nucleus_r * math.sin(math.radians(-25))),
            'electron': (CX + R * math.cos(a), CY + R * math.sin(a)),
            'outside': (CX + 158 * math.cos(math.radians(38)), CY + 158 * math.sin(math.radians(38)))}

def atom(name, electrons, labels=None, size=(1000, 640), letter=None, small=False):
    im = Image.new('L', size, W_); d = ImageDraw.Draw(im)
    d.ellipse((CX - R, CY - R, CX + R, CY + R), fill=W_, outline=K, width=5)
    hatch_circle(im, CX, CY, NR)
    for deg in electrons:
        a = math.radians(deg); x, y = CX + R * math.cos(a), CY + R * math.sin(a)
        d.ellipse((x - 18, y - 18, x + 18, y + 18), fill=K)
    if labels:
        pts = atom_points(electrons); label_boxes(d, [pts[k] for k in labels])
    if letter: d.text((30, 28), letter, font=F(64, True), fill=K)
    im.save(OUT / name)

def ring(kinds, r, start, centre=None):
    """dots evenly round a ring (so no two touch), optionally one in the middle"""
    pts = [(r * math.cos(math.radians(start + i * 360 / len(kinds))), r * math.sin(math.radians(start + i * 360 / len(kinds))), k) for i, k in enumerate(kinds)]
    return pts + ([(0.0, 0.0, centre)] if centre else [])

LAYOUT_A = ring(['p', 'n', 'p', 'n', 'p'], 0.66, -90, 'n')          # 3 protons, 3 neutrons
LAYOUT_B = ring(['p', 'p', 'n', 'p', 'n'], 0.66, -60, 'n')          # 3 protons, 3 neutrons
LAYOUT_S = ring(['p', 'n', 'n', 'p'], 0.55, -45)                     # 2 protons, 2 neutrons
LAYOUT_C = ring(['p', 'p', 'n', 'p', 'p'], 0.66, -100, 'n')         # 4 protons, 2 neutrons

def nucleus(name, layout, labels=None, size=(1000, 640), letter=None, nr=150):
    im = Image.new('L', size, W_); d = ImageDraw.Draw(im)
    d.ellipse((CX - R, CY - R, CX + R, CY + R), fill=W_, outline=K, width=5)
    hatch_circle(im, CX, CY, nr, gap=15)
    pos = [(CX + x * nr * 0.80, CY + y * nr * 0.80, k) for x, y, k in layout]
    for i, (x, y, k) in enumerate(pos):
        for j in range(i + 1, len(pos)):
            assert math.hypot(x - pos[j][0], y - pos[j][1]) > 62, (name, i, j)        # dots must not touch
    d2 = ImageDraw.Draw(im)
    for x, y, k in pos: dot(d2, x, y, k)
    if labels:
        pts = {'nucleus': (CX + nr * math.cos(math.radians(-140)) * 0.98, CY + nr * math.sin(math.radians(-140)) * 0.98),
               'proton': next((x, y) for x, y, k in pos if k == 'p'), 'neutron': next((x, y) for x, y, k in pos if k == 'n')}
        label_boxes(d2, [pts[k] for k in labels])
    key(d2, 40, 604)
    if letter: d2.text((30, 28), letter, font=F(64, True), fill=K)
    im.save(OUT / name)

# paper
atom('d_atom_label.png', [-58, 20, 140, 212], labels=['electron', 'nucleus', 'outside'])
nucleus('d_nucleus.png', LAYOUT_A)
atom('d_pic_A.png', [-50, 100, 215], letter='A', size=(640, 640))
nucleus('d_pic_B.png', LAYOUT_A, letter='B', size=(640, 640))
# feedback variants
atom('d_f4_S.png', [-40, 150, 250], labels=['electron', 'nucleus'])
atom('d_f4_C.png', [30, 120, 200, 290], labels=['nucleus', 'outside', 'electron'])
nucleus('d_f4_E.png', LAYOUT_B, labels=['nucleus', 'proton', 'neutron'])
atom('d_f6_S.png', [], size=(1000, 640))
nucleus('d_f7_S.png', LAYOUT_S)
nucleus('d_f7_C.png', LAYOUT_C)
atom('d_f11_A.png', [-80, 40, 130, 250], letter='A', size=(640, 640))
nucleus('d_f11_B.png', LAYOUT_B, letter='B', size=(640, 640))

# drawing box, and the proton / neutron pictures for the word bank
box = Image.new('L', (1300, 560), W_); ImageDraw.Draw(box).rectangle((3, 3, 1296, 556), outline=K, width=5); box.save(OUT / 'draw_box.png')
box2 = Image.new('L', (1300, 420), W_); ImageDraw.Draw(box2).rectangle((3, 3, 1296, 416), outline=K, width=5); box2.save(OUT / 'draw_box_small.png')
for nme, kind in (('proton', 'p'), ('neutron', 'n')):
    im = Image.new('L', (200, 200), W_); dot(ImageDraw.Draw(im), 100, 100, kind, 70); im.save(OUT / f'g_{nme}.png')

# ---- the chair for "part": an arrow points at ONE LEG, so the picture says "a leg is a part of a chair" ----
chair = Image.open(OUT / 'g_part.png').convert('L')
cv = Image.new('L', (640, 360), W_); cv.paste(chair, (0, 0)); cd = ImageDraw.Draw(cv)
ay = 305
cd.line([(600, ay), (272, ay)], fill=K, width=14)
cd.polygon([(250, ay), (300, ay - 26), (300, ay + 26)], fill=K)
cv.save(OUT / 'g_part_arrow.png')

# ---- one writing line, as a picture (Google Docs and Pages drop tab leaders and cell borders) ----
# drawn at its display height (34 px), so it is only ever scaled sideways: no blur above the line
ln = Image.new('L', (1000, 34), W_); ImageDraw.Draw(ln).rectangle((0, 31, 999, 32), fill=110); ln.save(OUT.parent / 'line.png')
print('written to', OUT, sorted(p.name for p in OUT.iterdir()))
