#!/usr/bin/env python3
"""
Diagrams for the Ecosystems assessment (9I and 9G). PRINTED IN BLACK AND WHITE:
pure black on white, plus light grey for grid lines only. Regions and lines are
told apart by style (solid, dashed) and by label, never by colour. Written to
assets/assessment/ and read by build/ecosystem-assessment.js.

    python3 build/ecosystem-assessment-check.py
    python3 build/ecosystem-assessment-diagrams.py
"""
import json, math, pathlib
from PIL import Image, ImageDraw, ImageFont

HERE = pathlib.Path(__file__).parent
OUT = HERE.parent / 'assets' / 'assessment'
OUT.mkdir(parents=True, exist_ok=True)
NUM = json.loads((HERE / 'ecosystem-assessment.numbers.json').read_text())

ARIAL = '/System/Library/Fonts/Supplemental/Arial.ttf'
ARIAL_B = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
F = lambda size, bold=False: ImageFont.truetype(ARIAL_B if bold else ARIAL, size)
K, WHITE, GREY = 0, 255, 200          # 'L' mode: black, white, light grey

def canvas(w, h):
    im = Image.new('L', (w, h), WHITE)
    return im, ImageDraw.Draw(im)

def box(d, cx, cy, lines, w=300, h=100, dashed=False, size=34):
    x0, y0, x1, y1 = cx - w // 2, cy - h // 2, cx + w // 2, cy + h // 2
    d.rounded_rectangle((x0, y0, x1, y1), 14, fill=WHITE, outline=K, width=5)
    lines = lines if isinstance(lines, list) else [lines]
    step = size + 6
    y = cy - (len(lines) - 1) * step / 2
    for i, t in enumerate(lines):
        d.text((cx, y + i * step), t, font=F(size, bold=(i == 0)), fill=K, anchor='mm')
    return (x0, y0, x1, y1)

def arrow(d, p, q, width=6, head=30):
    d.line([p, q], fill=K, width=width)
    ang = math.atan2(q[1] - p[1], q[0] - p[0])
    a = (q[0], q[1])
    l = (q[0] - head * math.cos(ang - 0.42), q[1] - head * math.sin(ang - 0.42))
    r = (q[0] - head * math.cos(ang + 0.42), q[1] - head * math.sin(ang + 0.42))
    d.polygon([a, l, r], fill=K)

def label(d, cx, cy, text, size=32, w=None, filled=True):
    tw = d.textlength(text, font=F(size, bold=True))
    w = w or int(tw + 36)
    d.rounded_rectangle((cx - w // 2, cy - 32, cx + w // 2, cy + 32), 12, fill=WHITE, outline=K, width=4)
    d.text((cx, cy), text, font=F(size, bold=True), fill=K, anchor='mm')

def save(im, name):
    im.convert('L').save(OUT / name)

# ------------------------------------------------------------------ food webs
# The boxes are laid out so that NO direction can be guessed from the picture. The main
# diagram has no arrows at all: the student is told who eats whom and draws the arrows,
# and the four relationships run left, down, right and up. (An earlier version gave some
# arrows already drawn, all pointing left to right, which gave the direction away.)
def web(name, nodes, arrows, w=1200, h=600, box_w=300, box_h=100, size=38):
    """nodes: {name: (cx, cy)}; arrows: [(from, to)], drawn from the food towards the eater."""
    im, d = canvas(w, h)
    for t, (cx, cy) in nodes.items():
        box(d, cx, cy, t, w=box_w, h=box_h, size=size)
    def clip(a, b, margin):
        (ax, ay), (bx, by) = nodes[a], nodes[b]
        dx, dy = bx - ax, by - ay
        tx = (box_w / 2) / abs(dx) if dx else 1e9
        ty = (box_h / 2) / abs(dy) if dy else 1e9
        t0 = min(tx, ty); L = math.hypot(dx, dy)
        ux, uy = dx / L, dy / L
        return (ax + dx * t0 + ux * margin, ay + dy * t0 + uy * margin)
    for a, b in arrows:
        p = clip(a, b, 8); q = clip(b, a, 10)
        arrow(d, p, q)
    save(im, name)

# columns 170 / 600 / 1030, rows 150 / 450
MAIN = {'Egret': (170, 150), 'Crab': (170, 450), 'Copepod': (600, 150), 'Small fish': (600, 450),
        'Phytoplankton': (1030, 150), 'Large fish': (1030, 450)}
web('foodweb_main.png', MAIN, [])
# the four relationships the paper lists, and the extra one used in the Extend variant
MAIN_ARROWS = [('Phytoplankton', 'Copepod'), ('Copepod', 'Small fish'), ('Small fish', 'Large fish'), ('Crab', 'Egret')]
web('foodweb_main_complete.png', MAIN, MAIN_ARROWS + [('Small fish', 'Egret')])

# support: three organisms and a fourth to place, no arrows
web('foodweb_support.png', {'Grass': (1030, 150), 'Rabbit': (600, 150), 'Fox': (600, 450), 'Hawk': (170, 150)}, [])
# consolidate: the same shape with new organisms, no arrows
web('foodweb_consolidate.png', {'Heron': (170, 150), 'Water snail': (170, 450), 'Water flea': (600, 150), 'Minnow': (600, 450),
                                'Algae': (1030, 150), 'Perch': (1030, 450)}, [])

# ------------------------------------------------------------------ cycles
def cycle(name, boxes, arrows, w=1500, h=1000):
    im, d = canvas(w, h)
    for (cx, cy, lines, bw, bh) in boxes:
        box(d, cx, cy, lines, w=bw, h=bh, size=32)
    for (p, q, lab, at) in arrows:
        arrow(d, p, q)
        label(d, at[0], at[1], lab[0], w=lab[1] if len(lab) > 1 else None)
    save(im, name)

BW, BH = 440, 120
carbon_boxes = [
    (750, 120, ['Carbon dioxide', 'in the air'], BW, BH),
    (1210, 480, ['Producers', '(plants and phytoplankton)'], 500, BH),
    (750, 860, ['Consumers', '(animals)'], BW, BH),
    (290, 480, ['Dead organisms', 'and waste'], BW, BH),
]
def carbon(name, A, B, C, feeding='feeding'):
    arrows = [
        ((940, 172), (1100, 408), (A, ), (1046, 270)),        # air -> producers
        ((1100, 552), (940, 808), (feeding, ), (1046, 690)),   # producers -> consumers
        ((560, 808), (400, 552), (B, ), (454, 690)),           # consumers -> dead
        ((400, 408), (560, 172), (C, ), (454, 270)),           # dead -> air
    ]
    cycle(name, carbon_boxes, arrows)
carbon('carbon_main.png', 'A', 'B', 'C')
carbon('carbon_support.png', 'A', 'death and waste', 'C')

nitrogen_boxes = [
    (750, 120, ['Nitrogen gas', 'in the air'], BW, BH),
    (1230, 400, ['Nitrates', 'in the soil'], 420, BH),
    (1010, 860, ['Producers', '(plants)'], 380, BH),
    (490, 860, ['Consumers', '(animals)'], 380, BH),
    (270, 400, ['Dead matter', 'and waste'], 420, BH),
]
nitrogen_arrows = [
    ((940, 172), (1130, 336), ('A', ), (1050, 240)),                       # N2 -> nitrates (fixation)
    ((1230, 462), (1120, 798), ('taken up by roots', 330), (1230, 630)),  # nitrates -> producers
    ((820, 860), (680, 860), ('feeding', 190), (750, 792)),               # producers -> consumers
    ((400, 798), (290, 462), ('death and waste', 300), (290, 640)),       # consumers -> dead
    ((490, 400), (1010, 400), ('B', ), (750, 400)),                       # dead -> nitrates (decomposers)
]
cycle('nitrogen_consolidate.png', nitrogen_boxes, nitrogen_arrows, w=1500, h=1000)

# ------------------------------------------------------------------ the population graph
def pchip(xs, ys):
    n = len(xs); h = [xs[i + 1] - xs[i] for i in range(n - 1)]; dl = [(ys[i + 1] - ys[i]) / h[i] for i in range(n - 1)]
    m = [0.0] * n
    for i in range(1, n - 1):
        if dl[i - 1] * dl[i] > 0:
            w1, w2 = 2 * h[i] + h[i - 1], h[i] + 2 * h[i - 1]
            m[i] = (w1 + w2) / (w1 / dl[i - 1] + w2 / dl[i])
    def end(h0, h1, d0, d1):
        v = ((2 * h0 + h1) * d0 - h0 * d1) / (h0 + h1)
        if v * d0 <= 0: return 0.0
        if d0 * d1 <= 0 and abs(v) > 3 * abs(d0): return 3 * d0
        return v
    m[0] = end(h[0], h[1], dl[0], dl[1]); m[-1] = end(h[-1], h[-2], dl[-1], dl[-2])
    def f(x):
        i = max(0, min(n - 2, next((k for k in range(n - 1) if xs[k] <= x <= xs[k + 1]), n - 2)))
        t = (x - xs[i]) / h[i]
        h00, h10, h01, h11 = 2*t**3 - 3*t**2 + 1, t**3 - 2*t**2 + t, -2*t**3 + 3*t**2, t**3 - t**2
        return h00 * ys[i] + h10 * h[i] * m[i] + h01 * ys[i + 1] + h11 * h[i] * m[i + 1]
    return f

pts = NUM['q6']['points']
px = sorted(int(k) for k in pts); py = [pts[str(k)] for k in px]
curve = pchip(px, py)
GW, GH = 1700, 1080
L, R_, T, B_ = 200, 70, 70, 190
im, d = canvas(GW, GH)
X = lambda yr: L + (yr - 1950) * (GW - L - R_) / 150
Y = lambda v: GH - B_ - v * (GH - T - B_) / 12
for v in range(0, 13):                                                     # horizontal grid every 1 billion
    d.line([(L, Y(v)), (GW - R_, Y(v))], fill=GREY if v % 2 else 170, width=2 if v % 2 else 3)
    d.text((L - 24, Y(v)), str(v), font=F(34), fill=K, anchor='rm')
for yr in range(1950, 2101, 5):                                            # vertical grid every 5 years, labelled every 25
    major = (yr - 1950) % 25 == 0
    d.line([(X(yr), T), (X(yr), GH - B_)], fill=170 if major else GREY, width=3 if major else 2)
    if major: d.text((X(yr), GH - B_ + 22), str(yr), font=F(34), fill=K, anchor='mt')
d.rectangle((L, T, GW - R_, GH - B_), outline=K, width=5)
xs = [1950 + i * 0.25 for i in range(int(150 / 0.25) + 1)]
seg = [(X(x), Y(curve(x))) for x in xs]
solid = [p for p, x in zip(seg, xs) if x <= 2022]
d.line(solid, fill=K, width=8, joint='curve')
dash_pts = [p for p, x in zip(seg, xs) if x >= 2022]
dist = 0.0; drawing = True
for a, b in zip(dash_pts, dash_pts[1:]):
    seglen = math.hypot(b[0] - a[0], b[1] - a[1])
    if drawing: d.line([a, b], fill=K, width=8)
    dist += seglen
    if dist > (26 if drawing else 16): dist = 0.0; drawing = not drawing
d.text((L + (GW - L - R_) / 2, GH - 46), 'Year', font=F(38, bold=True), fill=K, anchor='mm')
tmp = Image.new('L', (700, 60), WHITE); td = ImageDraw.Draw(tmp)
td.text((350, 30), 'World population (billions)', font=F(38, bold=True), fill=K, anchor='mm')
im.paste(tmp.rotate(90, expand=True), (16, int((T + GH - B_) / 2 - 350)))
# a key, so the two line styles are told apart without colour
kx, ky = X(1954), Y(11.2)
d.rectangle((kx - 14, ky - 62, kx + 610, ky + 62), fill=WHITE, outline=K, width=3)
d.line([(kx + 8, ky - 24), (kx + 110, ky - 24)], fill=K, width=8)
d.text((kx + 130, ky - 24), 'estimate', font=F(32), fill=K, anchor='lm')
for i in range(0, 5):
    d.line([(kx + 8 + i * 22, ky + 24), (kx + 8 + i * 22 + 14, ky + 24)], fill=K, width=8)
d.text((kx + 130, ky + 24), 'projection (UN)', font=F(32), fill=K, anchor='lm')
save(im, 'population_graph.png')
print('diagrams written to', OUT)
