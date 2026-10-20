#!/usr/bin/env python3
"""
Tables and graphs for the Scientific Research and Technology assessment (7B). PRINTED IN BLACK AND WHITE: black on white plus light grey for
grid lines and shading. Written to assets/assessment/srt/.

    python3 build/scientific-research-assessment-check.py
    python3 build/scientific-research-assessment-diagrams.py
"""
import json, pathlib
from PIL import Image, ImageDraw, ImageFont

HERE = pathlib.Path(__file__).parent
OUT = HERE.parent / 'assets' / 'assessment' / 'srt'
OUT.mkdir(parents=True, exist_ok=True)
NUM = json.loads((HERE / 'scientific-research-assessment.numbers.json').read_text())
FONT = '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'
FONT_B = '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'
F = lambda s, b=False: ImageFont.truetype(FONT_B if b else FONT, s)
K, WHITE, LIGHT, GRID, MID = 0, 255, 232, 205, 140

def table(name, headers, rows, widths, row_h=84, head_h=110, font=34):
    """a ruled table: grey header, black rules. `rows` is a list of lists of strings ('' is an empty cell for the student)."""
    W, H = sum(widths) + 6, head_h + row_h * len(rows) + 6
    im = Image.new('L', (W, H), WHITE); d = ImageDraw.Draw(im)
    x = [3]
    for w in widths: x.append(x[-1] + w)
    d.rectangle((3, 3, W - 4, 3 + head_h), fill=LIGHT)
    for i, h in enumerate(headers):
        lines = h.split('\n')
        for j, ln in enumerate(lines):
            d.text(((x[i] + x[i + 1]) / 2, 3 + head_h / 2 + (j - (len(lines) - 1) / 2) * (font + 4)), ln, font=F(font, True), fill=K, anchor='mm')
    for r, row in enumerate(rows):
        for i, c in enumerate(row):
            d.text(((x[i] + x[i + 1]) / 2, 3 + head_h + row_h * r + row_h / 2), c, font=F(font + 2, i == 0), fill=K, anchor='mm')
    for r in range(len(rows) + 2):
        y = 3 + (0 if r == 0 else head_h + row_h * (r - 1))
        d.line([(3, y), (W - 4, y)], fill=K, width=4)
    for xx in x: d.line([(xx, 3), (xx, H - 4)], fill=K, width=4)
    im.save(OUT / f'{name}.png')

def balances():
    q = NUM['q8']
    rows = [[f'Balance {k}'] + [f'{v:.1f}' for v in q[k]['readings']] for k in 'ABCD']
    table('balances_table', ['Balance', 'Reading 1\n(g)', 'Reading 2\n(g)', 'Reading 3\n(g)'], rows, [260, 220, 220, 220], row_h=76, head_h=104)

def ball_table():
    t = NUM['q10']['trials']; m = NUM['q10']['means']
    rows = []
    for h in ('20', '40', '60', '80'):
        rows.append([h] + [str(v) for v in t[h]] + [f'{m[h]:.0f}' if h in ('20', '40') else ''])
    table('ball_table', ['Drop height\n(cm)', 'Bounce 1\n(cm)', 'Bounce 2\n(cm)', 'Bounce 3\n(cm)', 'Mean bounce\n(cm)'], rows, [260, 210, 210, 210, 270], row_h=82, head_h=116)

def graph(name, answer=False):
    S = 3
    W, H = 1700, 960
    im = Image.new('L', (W * S, H * S), WHITE); d = ImageDraw.Draw(im)
    L, R, T, B = 190 * S, 1640 * S, 50 * S, 770 * S
    xs = lambda x: L + (R - L) * x / 100
    ys = lambda y: B - (B - T) * y / 60
    for x in range(0, 101, 5):
        d.line([(xs(x), T), (xs(x), B)], fill=MID if x % 20 == 0 else GRID, width=(3 if x % 20 == 0 else 1) * S)
    for y in range(0, 61, 2):
        d.line([(L, ys(y)), (R, ys(y))], fill=MID if y % 10 == 0 else GRID, width=(3 if y % 10 == 0 else 1) * S)
    d.line([(L, T), (L, B), (R, B)], fill=K, width=6 * S)
    for x in range(0, 101, 20): d.text((xs(x), B + 18 * S), str(x), font=F(34 * S), fill=K, anchor='mt')
    for y in range(0, 61, 10): d.text((L - 20 * S, ys(y)), str(y), font=F(34 * S), fill=K, anchor='rm')
    d.text((xs(50), B + 90 * S), 'Drop height (cm)', font=F(38 * S, True), fill=K, anchor='mt')
    lab = Image.new('L', (700 * S, 60 * S), WHITE); ld = ImageDraw.Draw(lab)
    ld.text((350 * S, 30 * S), 'Mean bounce height (cm)', font=F(38 * S, True), fill=K, anchor='mm')
    lab = lab.rotate(90, expand=True); im.paste(lab, (24 * S, int((T + B) / 2 - 350 * S)))
    cross = lambda x, y: [d.line([(xs(x) - 16 * S, ys(y) - 16 * S), (xs(x) + 16 * S, ys(y) + 16 * S)], fill=K, width=6 * S), d.line([(xs(x) - 16 * S, ys(y) + 16 * S), (xs(x) + 16 * S, ys(y) - 16 * S)], fill=K, width=6 * S)]
    m = NUM['q10']['means']
    for h in ('20', '40'): cross(int(h), m[h])
    if answer:
        for h in ('60', '80'): cross(int(h), m[h])
        s, c = NUM['q10']['slope'], NUM['q10']['icpt']
        d.line([(xs(0), ys(c)), (xs(98), ys(s * 98 + c))], fill=K, width=5 * S)
        # the estimate at 50 cm, shown as a dashed guide
        e = NUM['q10']['est50']
        for t in range(0, 20):
            y0 = ys(0) - (ys(0) - ys(e)) * t / 20; y1 = ys(0) - (ys(0) - ys(e)) * (t + 0.5) / 20
            d.line([(xs(50), y0), (xs(50), y1)], fill=K, width=3 * S)
    im.resize((W, H), Image.LANCZOS).save(OUT / f'{name}.png')

def tickbox():
    im = Image.new('L', (40, 40), WHITE); d = ImageDraw.Draw(im); d.rectangle((3, 3, 36, 36), outline=K, width=4); im.save(OUT / 'box.png')

if __name__ == '__main__':
    balances(); ball_table(); graph('ball_graph'); graph('ball_graph_answer', True); tickbox()
    print('diagrams written to', OUT)
