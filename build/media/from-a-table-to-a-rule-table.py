#!/usr/bin/env python3
"""
From A Table To A Rule: the I Do 1 animation (8CN). Generated with PIL and encoded with ffmpeg
(CLAUDE.md, Media, preference 1). Silent, Number Revision colours. It plays ON CLICK
(lib/animate.js, effect "play"), and it PAUSES at every step: the +1 arrows are drawn one at a
time, then the +3 arrows, then the row of 3x appears one cell at a time, then the gaps (+2) are
marked, and only then is the formula written and checked with the last pair.

  from-a-table-to-a-rule-table.mp4   x = 1, 2, 3, 4 and y = 5, 8, 11, 14.   y = 3x + 2.   960 x 540

    python3 build/media/from-a-table-to-a-rule-table.py
"""
import pathlib, subprocess, shutil, tempfile
from PIL import Image, ImageDraw, ImageFont

OUT = pathlib.Path(__file__).resolve().parents[2] / 'assets' / 'media'
OUT.mkdir(parents=True, exist_ok=True)
FPS = 20
NAVY, CORAL, LAV, WHITE, SOFT, GREY, BRICK, GREEN, BLUE = '#2B2350', '#EC6B58', '#F2F0F8', '#FFFFFF', '#5E5A70', '#CFCADF', '#C0392B', '#2E8B57', '#1F6FB2'
ARIAL = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
F = lambda s: ImageFont.truetype(ARIAL, s)
f_lab, f_cell, f_cap, f_tag, f_eq, f_big = F(40), F(42), F(34), F(28), F(44), F(54)

XS = [1, 2, 3, 4]
YS = [5, 8, 11, 14]
M_, C_ = 3, 2                                   # y = 3x + 2
assert [M_ * x + C_ for x in XS] == YS
ROW_X, ROW_M, ROW_Y = 165, 280, 380             # row centres (x row, 3x row, y row)
COLS = [250, 430, 610, 790]                     # column centres
CW, CH = 130, 68
ROWS_ORDER = None

def centre(d, xy, text, font, fill): d.text(xy, text, font=font, fill=fill, anchor='mm')
def cell(d, cx, cy, text, fill, ink, outline=None, w=3):
    d.rounded_rectangle((cx - CW // 2, cy - CH // 2, cx + CW // 2, cy + CH // 2), 14, fill=fill, outline=outline, width=w if outline else 0)
    centre(d, (cx, cy), str(text), f_cell, ink)
def arrow(d, x0, x1, y, col):
    d.line((x0, y, x1 - 14, y), fill=col, width=6)
    d.polygon([(x1, y), (x1 - 18, y - 11), (x1 - 18, y + 11)], fill=col)
def fade_in(t, t0, dur=0.35): return max(0.0, min(1.0, (t - t0) / dur))

# the timeline, in seconds: every step is a pause
T_X_ARROWS = [1.2, 1.9, 2.6]                    # +1 between the x cells, one at a time
T_Y_ARROWS = [4.0, 4.7, 5.4]                    # +3 between the y cells
T_MUL_ROW = [7.4, 8.1, 8.8, 9.5]                # the 3x row, one cell at a time
T_GAPS = [11.4, 12.1, 12.8, 13.5]               # the +2 between 3x and y, one at a time
T_FORMULA = 15.6
T_CHECK = 18.4
TOTAL = 22.4

def caption(t):
    if t < 1.2: return 'Here is a table.'
    if t < 4.0: return 'x goes up by 1 each time.'
    if t < 7.4: return 'y goes up by 3 each time.'
    if t < 11.4: return 'So multiply x by 3.'
    if t < 15.6: return 'y is always 2 more than 3x.'
    if t < 18.4: return 'The rule: multiply by 3, then add 2.'
    return 'Check with the last pair.'

def frame(t):
    im = Image.new('RGB', (960, 540), LAV); d = ImageDraw.Draw(im)
    centre(d, (480, 34), caption(t), f_cap, NAVY)
    # row labels
    centre(d, (90, ROW_X), 'x', f_lab, BLUE); centre(d, (90, ROW_Y), 'y', f_lab, BRICK)
    if t >= T_MUL_ROW[0]: centre(d, (90, ROW_M), '3x', f_lab, SOFT)
    check_on = t >= T_CHECK
    for i, c in enumerate(COLS):
        last = (i == 3) and check_on
        cell(d, c, ROW_X, XS[i], WHITE, NAVY, CORAL if last else GREY)
        cell(d, c, ROW_Y, YS[i], WHITE, BRICK, CORAL if last else GREY)
        if t >= T_MUL_ROW[i]: cell(d, c, ROW_M, M_ * XS[i], LAV, SOFT, GREY if not last else CORAL)
    # +1 arrows above the x row, +3 arrows under the y row
    for i, t0 in enumerate(T_X_ARROWS):
        if t >= t0:
            a, b = COLS[i] + CW // 2 + 4, COLS[i + 1] - CW // 2 - 4
            arrow(d, a, b, ROW_X - 52, BLUE); centre(d, ((a + b) // 2, ROW_X - 80), '+1', f_tag, BLUE)
    for i, t0 in enumerate(T_Y_ARROWS):
        if t >= t0:
            a, b = COLS[i] + CW // 2 + 4, COLS[i + 1] - CW // 2 - 4
            arrow(d, a, b, ROW_Y + 52, BRICK); centre(d, ((a + b) // 2, ROW_Y + 80), '+3', f_tag, BRICK)
    # the gaps between the 3x row and the y row
    for i, t0 in enumerate(T_GAPS):
        if t >= t0:
            centre(d, (COLS[i], (ROW_M + ROW_Y) // 2 + 2), '+ 2', f_tag, GREEN)
    # the working for the check, then the formula
    if t >= T_FORMULA:
        centre(d, (480, 508), 'y = 3x + 2', f_big, NAVY)
    if check_on:
        centre(d, (480, 222), '3 × 4 + 2 = 14. It fits!', F(34), GREEN)
    return im

def render(name, total):
    n = int(total * FPS)
    tmp = pathlib.Path(tempfile.mkdtemp())
    for i in range(n): frame(i / FPS).save(tmp / f'{i:04d}.png')
    out = OUT / f'{name}.mp4'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', str(tmp / '%04d.png'),
                    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '26', '-preset', 'veryslow', str(out)], check=True)
    frame(0.2).save(OUT / f'{name}.png')            # the cover: the table, waiting for a click
    shutil.rmtree(tmp)
    print(f'{out.name}: {n} frames, {total:.1f} s, {out.stat().st_size // 1024} KB')

render('from-a-table-to-a-rule-table', TOTAL)
frame(21.0).save('/tmp/fatr-last.png'); frame(14.5).save('/tmp/fatr-mid.png')
