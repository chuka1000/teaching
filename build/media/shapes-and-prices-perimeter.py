#!/usr/bin/env python3
"""
Expressions From Shapes And Prices: the I Do 1 animation (8CN). Generated with PIL and encoded with ffmpeg
(CLAUDE.md, Media, preference 1). Silent, Number Revision colours. It plays ON CLICK (lib/animate.js, effect
"play") and it PAUSES at every step:

  route 1: a dot walks round the rectangle, one side at a time, and the running total grows beside it
           (x + 3, then 3x + 3, then 4x + 6, then 6x + 6);
  route 2: the two x + 3 sides are lit together, then the two 2x sides, and the shorter sum is written;
  the check: the sides turn into numbers (x = 4: 7 and 8) and 7 + 8 + 7 + 8 = 30 = 6 x 4 + 6.

  shapes-and-prices-perimeter.mp4   rectangle x + 3 by 2x, perimeter 6x + 6.   960 x 540

    python3 build/media/shapes-and-prices-perimeter.py
"""
import pathlib, subprocess, shutil, tempfile
from PIL import Image, ImageDraw, ImageFont

OUT = pathlib.Path(__file__).resolve().parents[2] / 'assets' / 'media'
OUT.mkdir(parents=True, exist_ok=True)
FPS = 20
NAVY, CORAL, LAV, WHITE, SOFT, GREY, BRICK, GREEN, BLUE = '#2B2350', '#EC6B58', '#F2F0F8', '#FFFFFF', '#5E5A70', '#CFCADF', '#C0392B', '#2E8B57', '#1F6FB2'
BOLD = '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'
F = lambda s: ImageFont.truetype(BOLD, s)
f_cap, f_side, f_row, f_big = F(34), F(40), F(38), F(52)

L, R, T, B = 110, 410, 175, 375             # the rectangle
SIDES = [  # (name, label, check label, start xy, end xy, label xy)
    ('top',    'x + 3', '7', (L, T), (R, T), ((L + R) // 2, T - 38)),
    ('right',  '2x',    '8', (R, T), (R, B), (R + 52, (T + B) // 2)),
    ('bottom', 'x + 3', '7', (R, B), (L, B), ((L + R) // 2, B + 40)),
    ('left',   '2x',    '8', (L, B), (L, T), (L - 52, (T + B) // 2)),
]
WALK = [1.6, 4.4, 7.2, 10.0]                # when the dot starts each side (route 1)
WALK_DUR = 1.4
ROUTE2 = 13.6                               # the route-2 caption
PAIR1, PAIR2, SUM2 = 14.6, 17.2, 19.8
AGREE = 23.0
CHECK = 25.6
TOTAL = 31.0


def centre(d, xy, text, font, fill): d.text(xy, text, font=font, fill=fill, anchor='mm')


def lerp(a, b, u): return (a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u)


def caption(t):
    if t < WALK[0]: return 'Perimeter: add every side.'
    if t < ROUTE2: return 'Route 1: walk round and add each side.'
    if t < PAIR1: return 'Route 2: two of each side.'
    if t < AGREE: return 'Route 2: two of each side.'
    if t < CHECK: return 'Both routes give 6x + 6.'
    return 'Check with a number: x = 4.'


def side_line(d, i, col, w=12):
    _, _, _, a, b, _ = SIDES[i]
    d.line([a, b], fill=col, width=w)


def frame(t):
    im = Image.new('RGB', (960, 540), LAV); d = ImageDraw.Draw(im)
    centre(d, (480, 34), caption(t), f_cap, NAVY)
    # the rectangle
    d.rectangle((L, T, R, B), fill=WHITE, outline=GREY, width=6)
    # route 1: sides stay lit once walked
    in_route1 = t < ROUTE2
    pair_a = PAIR1 <= t < AGREE
    pair_b = PAIR2 <= t < AGREE
    for i in range(4):
        col = None
        if in_route1 and t >= WALK[i]: col = CORAL
        elif not in_route1 and i in (0, 2) and pair_a: col = BLUE
        elif not in_route1 and i in (1, 3) and pair_b: col = GREEN
        elif AGREE <= t < CHECK and False: col = None
        if col: side_line(d, i, col)
    # the moving dot
    for i in range(4):
        if WALK[i] <= t < WALK[i] + WALK_DUR and in_route1:
            u = (t - WALK[i]) / WALK_DUR
            px, py = lerp(SIDES[i][3], SIDES[i][4], u)
            d.ellipse((px - 14, py - 14, px + 14, py + 14), fill=BRICK, outline=WHITE, width=3)
    # the labels, which turn into numbers for the check
    check = t >= CHECK
    for i, (_, lab, num, _, _, pos) in enumerate(SIDES):
        txt = num if check else lab
        col = NAVY
        if in_route1 and t >= WALK[i]: col = BRICK
        if not in_route1 and i in (0, 2) and pair_a and t < AGREE: col = BLUE
        if not in_route1 and i in (1, 3) and pair_b and t < AGREE: col = GREEN
        centre(d, pos, txt, f_side, col)
    # the right-hand panel
    X0 = 520
    if in_route1:
        rows = [('', 'x + 3', NAVY), ('+ ', '2x = 3x + 3', NAVY), ('+ ', '(x + 3) = 4x + 6', NAVY), ('+ ', '2x = 6x + 6', BRICK)]
        starts = [WALK[0] + WALK_DUR, WALK[1] + WALK_DUR, WALK[2] + WALK_DUR, WALK[3] + WALK_DUR]
        for i, (pre, body, col) in enumerate(rows):
            if t >= starts[i]:
                y = 150 + i * 62
                d.text((X0, y), pre + body, font=f_row, fill=col, anchor='lm')
    elif t < CHECK:
        rows = []
        if t >= PAIR1: rows.append(('2(x + 3)', BLUE))
        if t >= PAIR2: rows.append(('+ 2(2x)', GREEN))
        if t >= SUM2: rows += [('= 2x + 6 + 4x', NAVY), ('= 6x + 6', BRICK)]
        for i, (txt, col) in enumerate(rows):
            d.text((X0, 160 + i * 66), txt, font=f_row, fill=col, anchor='lm')
        if t >= AGREE:
            d.rounded_rectangle((X0 - 14, 440, 940, 500), 14, fill=WHITE, outline=GREEN, width=4)
            centre(d, ((X0 - 14 + 940) // 2, 470), 'Both routes agree: 6x + 6', F(32), GREEN)
    else:
        d.text((X0, 150), 'x = 4: the sides are 7 and 8', font=F(32), fill=SOFT, anchor='lm')
        d.text((X0, 225), '7 + 8 + 7 + 8 = 30', font=f_row, fill=NAVY, anchor='lm')
        if t >= CHECK + 2.4: d.text((X0, 295), '6 × 4 + 6 = 30', font=f_row, fill=BRICK, anchor='lm')
        if t >= CHECK + 4.4:
            d.rounded_rectangle((X0 - 14, 400, 940, 470), 14, fill=WHITE, outline=GREEN, width=4)
            centre(d, ((X0 - 14 + 940) // 2, 435), 'They match. It fits!', F(36), GREEN)
    return im


def render(name, total):
    n = int(total * FPS)
    tmp = pathlib.Path(tempfile.mkdtemp())
    for i in range(n): frame(i / FPS).save(tmp / f'{i:04d}.png')
    out = OUT / f'{name}.mp4'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', str(tmp / '%04d.png'),
                    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '26', '-preset', 'veryslow', str(out)], check=True)
    frame(0.2).save(OUT / f'{name}.png')            # the cover: the rectangle, waiting for a click
    shutil.rmtree(tmp)
    print(f'{out.name}: {n} frames, {total:.1f} s, {out.stat().st_size // 1024} KB')


if __name__ == '__main__':
    render('shapes-and-prices-perimeter', TOTAL)
    scratch = pathlib.Path('/tmp/claude-0/-home-user-teaching/924fe8d1-92ea-5cc2-853a-cf6e7f8bc0ad/scratchpad')
    for nm, tt in (('walk', 9.6), ('route2', 21.5), ('check', 29.5)):
        frame(tt).save(scratch / f'perim-{nm}.png')
