#!/usr/bin/env python3
"""
Expressions From Shapes And Prices (and Area With A Bracket): the shape pictures for the two worksheets (8CN).
Each is a labelled polygon in the Number Revision colours, drawn with PIL at 3x and reduced, so the lines are
crisp when printed. Labels sit just outside the middle of their side (found with a point-in-polygon test, so
the notch of the L-shape is labelled on the right side). Equal sides carry a small tick.

  python3 build/media/shapes-and-prices-shapes.py          # every picture, into assets/worksheets/expressions/
"""
import pathlib
from PIL import Image, ImageDraw, ImageFont

OUT = pathlib.Path(__file__).resolve().parents[2] / 'assets' / 'worksheets' / 'expressions'
OUT.mkdir(parents=True, exist_ok=True)
NAVY, BLUE, LAV, SOFT, GREY = '#2B2350', '#1F6FB2', '#F2F0F8', '#5E5A70', '#CFCADF'
BOLD = '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'
S = 3
W, H = 520, 340


def font(px): return ImageFont.truetype(BOLD, int(px * S))


def inside(pt, poly):
    x, y = pt; n = len(poly); hit = False
    for i in range(n):
        (x1, y1), (x2, y2) = poly[i], poly[(i + 1) % n]
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1: hit = not hit
    return hit


def draw(name, pts, labels, ticks=(), size=26, off=24, fill=LAV, extra=None):
    """pts in 520 x 340 coordinates; labels[i] is the label of the side pts[i] -> pts[i+1] ('' for none); ticks: side indices."""
    im = Image.new('RGB', (W * S, H * S), 'white'); d = ImageDraw.Draw(im)
    big = [(x * S, y * S) for x, y in pts]
    d.polygon(big, fill=fill, outline=NAVY)
    d.line(big + [big[0]], fill=NAVY, width=5 * S, joint='curve')
    for p in big: d.ellipse((p[0] - 2.5 * S, p[1] - 2.5 * S, p[0] + 2.5 * S, p[1] + 2.5 * S), fill=NAVY)
    n = len(pts)
    for i in range(n):
        (x1, y1), (x2, y2) = pts[i], pts[(i + 1) % n]
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        dx, dy = x2 - x1, y2 - y1
        ln = (dx * dx + dy * dy) ** 0.5
        nx, ny = dy / ln, -dx / ln
        if inside((mx + 6 * nx, my + 6 * ny), pts): nx, ny = -nx, -ny           # make it point OUT of the shape
        if i in ticks:
            tx, ty = -ny, nx                                                    # along the side
            for k in (-4, 4):
                cx, cy = mx + tx * k, my + ty * k
                d.line([((cx - nx * 9) * S, (cy - ny * 9) * S), ((cx + nx * 9) * S, (cy + ny * 9) * S)], fill=NAVY, width=3 * S)
        if labels[i]:
            f = font(size)
            w = d.textlength(labels[i], font=f) / S
            # push the label out far enough that its box clears the side, whichever way the side leans
            push = off + abs(nx) * (w / 2) + abs(ny) * (size * 0.38)
            d.text(((mx + nx * push) * S, (my + ny * push) * S), labels[i], font=f, fill=BLUE, anchor='mm')
    if extra: extra(d)
    im = im.resize((W, H), Image.LANCZOS)
    im.save(OUT / f'{name}.png', optimize=True)
    print('wrote', name)


def rect(name, top, side):
    draw(name, [(110, 85), (410, 85), (410, 255), (110, 255)], [top, side, top, side])


def main():
    # Lesson 8
    draw('tri_bw',  [(70, 280), (450, 280), (260, 70)], ['2x', 'x + 1', 'x + 1'], ticks=(1, 2))                 # bottom, right, left
    rect('rect_b1', 'x + 2', '3x')
    draw('sq_b2',   [(160, 70), (360, 70), (360, 270), (160, 270)], ['2x + 3', '', '', ''], ticks=(0, 1, 2, 3))   # a square: all sides equal
    rect('rect_sw', '2x + 1', 'x + 4')
    draw('tri_s7',  [(80, 290), (440, 290), (370, 120)], ['2x + 5', 'x − 1', '3x + 2'])
    draw('pent_s8', [(160, 280), (360, 280), (440, 170), (260, 60), (80, 170)], ['x', 'x + 2', '2x − 1', 'x + 2', '2x − 1'])
    draw('hex_gw',  [(170, 70), (350, 70), (440, 170), (350, 270), (170, 270), (80, 170)], ['2x − 1', '', '', '', '', ''], ticks=range(6))
    draw('tri_g14', [(200, 280), (320, 280), (260, 50)], ['x − 1', '2x + 3', '2x + 3'], ticks=(1, 2))
    draw('L_g15',   [(90, 290), (420, 290), (420, 150), (270, 150), (270, 70), (90, 70)],
         ['3x + 2', 'x + 2', 'x', '2', '2x + 2', 'x + 4'])


if __name__ == '__main__':
    main()
