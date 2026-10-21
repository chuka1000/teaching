#!/usr/bin/env python3
"""
Area With A Bracket: the I Do 2 animation (8CN). Generated with PIL and encoded with ffmpeg (CLAUDE.md, Media,
preference 1). Silent, Number Revision colours. It plays ON CLICK (lib/animate.js, effect "play") and it PAUSES at
every step: the garden (4 high, x + 5 long), a line that splits the length into x and 5, the first piece lit and its
area written (4 x x = 4x), the second piece lit and its area written (4 x 5 = 20), the total 4(x + 5) = 4x + 20, and
then the check with x = 3 (the pieces become 3 and 5 wide: 12 + 20 = 32 = 4 x 8).

  area-with-a-bracket-split.mp4   4(x + 5) = 4x + 20.   960 x 540

    python3 build/media/area-with-a-bracket-split.py
"""
import pathlib, subprocess, shutil, tempfile
from PIL import Image, ImageDraw, ImageFont

OUT = pathlib.Path(__file__).resolve().parents[2] / 'assets' / 'media'
OUT.mkdir(parents=True, exist_ok=True)
FPS = 20
NAVY, CORAL, LAV, WHITE, SOFT, GREY, BRICK, GREEN, BLUE = '#2B2350', '#EC6B58', '#F2F0F8', '#FFFFFF', '#5E5A70', '#CFCADF', '#C0392B', '#2E8B57', '#1F6FB2'
BLUE_FILL, GREEN_FILL = '#DCE9F7', '#DDF0E5'
BOLD = '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'
F = lambda s: ImageFont.truetype(BOLD, s)
f_cap, f_lab, f_piece, f_total = F(34), F(44), F(40), F(52)

L, R, T, B = 100, 860, 175, 375
SPLIT_ALGEBRA = 480                         # x | 5, not to scale
SPLIT_CHECK = L + (R - L) * 3 // 8          # x = 3: the pieces are 3 and 5 wide

T_SPLIT, T_LEFT, T_RIGHT, T_TOTAL, T_CHECK = 1.8, 4.2, 8.2, 12.2, 16.4
T_CHECK_L, T_CHECK_R, T_CHECK_SUM, T_MATCH = 18.4, 21.0, 23.4, 26.4
TOTAL = 30.0


def centre(d, xy, text, font, fill): d.text(xy, text, font=font, fill=fill, anchor='mm')


def caption(t):
    if t < T_SPLIT: return 'The garden is 4 high and (x + 5) long.'
    if t < T_LEFT: return 'Split the length into x and 5.'
    if t < T_RIGHT: return 'The first piece: 4 high and x long.'
    if t < T_TOTAL: return 'The second piece: 4 high and 5 long.'
    if t < T_CHECK: return 'The garden is both pieces.'
    return 'Check with x = 3.'


def frame(t):
    im = Image.new('RGB', (960, 540), LAV); d = ImageDraw.Draw(im)
    centre(d, (480, 34), caption(t), f_cap, NAVY)
    check = t >= T_CHECK
    split = SPLIT_CHECK if check else SPLIT_ALGEBRA
    left_on = (T_LEFT <= t < T_RIGHT) or t >= T_TOTAL - 0.0 and False
    # piece fills: lit while it is being talked about, both lit once the garden is whole
    lit_left = T_LEFT <= t < T_RIGHT or t >= T_TOTAL
    lit_right = T_RIGHT <= t < T_TOTAL or t >= T_TOTAL
    d.rectangle((L, T, R, B), fill=WHITE)
    if lit_left: d.rectangle((L, T, split, B), fill=BLUE_FILL)
    if lit_right: d.rectangle((split, T, R, B), fill=GREEN_FILL)
    d.rectangle((L, T, R, B), outline=NAVY, width=6)
    if t >= T_SPLIT: d.line([(split, T), (split, B)], fill=NAVY, width=5)
    # side label
    centre(d, (L - 38, (T + B) // 2), '4', f_lab, NAVY)
    # length labels
    if t < T_SPLIT:
        centre(d, ((L + R) // 2, T - 38), 'x + 5', f_lab, NAVY)
    else:
        centre(d, ((L + split) // 2, T - 38), '3' if check else 'x', f_lab, BLUE)
        centre(d, ((split + R) // 2, T - 38), '5', f_lab, GREEN)
        if check: centre(d, ((L + R) // 2, T - 84), 'x + 5 = 8', F(30), SOFT)
    # the areas of the pieces
    if not check:
        if t >= T_LEFT: centre(d, ((L + split) // 2, (T + B) // 2), '4 × x = 4x', f_piece, BLUE)
        if t >= T_RIGHT: centre(d, ((split + R) // 2, (T + B) // 2), '4 × 5 = 20', f_piece, GREEN)
        if t >= T_TOTAL: centre(d, (480, 450), '4(x + 5) = 4x + 20', f_total, BRICK)
    else:
        if t >= T_CHECK_L: centre(d, ((L + split) // 2, (T + B) // 2), '4 × 3 = 12', f_piece, BLUE)
        if t >= T_CHECK_R: centre(d, ((split + R) // 2, (T + B) // 2), '4 × 5 = 20', f_piece, GREEN)
        if t >= T_CHECK_SUM:
            centre(d, (300, 450), '12 + 20 = 32', F(46), NAVY)
            centre(d, (700, 450), '4 × 8 = 32', F(46), BRICK)
        if t >= T_MATCH:
            d.rounded_rectangle((300, 482, 660, 530), 14, fill=WHITE, outline=GREEN, width=4)
            centre(d, (480, 506), 'They match. It fits!', F(30), GREEN)
    return im


def render(name, total):
    n = int(total * FPS)
    tmp = pathlib.Path(tempfile.mkdtemp())
    for i in range(n): frame(i / FPS).save(tmp / f'{i:04d}.png')
    out = OUT / f'{name}.mp4'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', str(tmp / '%04d.png'),
                    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '26', '-preset', 'veryslow', str(out)], check=True)
    frame(0.2).save(OUT / f'{name}.png')            # the cover: the garden, waiting for a click
    shutil.rmtree(tmp)
    print(f'{out.name}: {n} frames, {total:.1f} s, {out.stat().st_size // 1024} KB')


if __name__ == '__main__':
    render('area-with-a-bracket-split', TOTAL)
    scratch = pathlib.Path('/tmp/claude-0/-home-user-teaching/924fe8d1-92ea-5cc2-853a-cf6e7f8bc0ad/scratchpad')
    for nm, tt in (('left', 6.0), ('whole', 14.0), ('check', 28.0)):
        frame(tt).save(scratch / f'split-{nm}.png')
