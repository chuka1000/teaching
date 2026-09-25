#!/usr/bin/env python3
"""
Putting Numbers In: I Do 1 animation. A formula is a machine: the numbers 1, 2,
3, 4 go in, each is multiplied by 3 and then has 2 added, and the answers come
out. It shows what words cannot: the SAME rule, in the SAME order, working for
any number, and the answers building into a pattern.

Generated with PIL and encoded with ffmpeg (CLAUDE.md, Media, preference 1).
Silent, about 10 seconds, 960 x 540, Number Revision colours.

    python3 build/media/putting-numbers-in-machine.py
"""
import pathlib, subprocess, shutil, tempfile
from PIL import Image, ImageDraw, ImageFont

OUT = pathlib.Path(__file__).resolve().parents[2] / 'assets' / 'media'
OUT.mkdir(parents=True, exist_ok=True)
W, H, FPS = 960, 540, 20

NAVY, CORAL, LAV, WHITE, SOFT = '#2B2350', '#EC6B58', '#F2F0F8', '#FFFFFF', '#5E5A70'
ARIAL = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
# Arial, not Georgia: Georgia's old-style figures sit at different heights, which reads badly for numbers.
f_big = ImageFont.truetype(ARIAL, 62)
f_mid = ImageFont.truetype(ARIAL, 42)
f_chip = ImageFont.truetype(ARIAL, 38)
f_small = ImageFont.truetype(ARIAL, 24)

Y = 250                                      # belt height
X_IN, X_B1, X_B2, X_OUT = 90, 335, 585, 850  # chip x positions: start, box 1, box 2, end
BOX_W, BOX_H = 150, 130
CHIP_W, CHIP_H = 104, 64
PER = 2.2                                    # seconds per input
INPUTS = [1, 2, 3, 4]
HOLD = 1.6

def smooth(t):
    t = max(0.0, min(1.0, t))
    return t * t * (3 - 2 * t)

def centre_text(d, xy, text, font, fill):
    d.text(xy, text, font=font, fill=fill, anchor='mm')

def chip_state(u, n):
    """x position and shown value for progress u (0..1) of one input."""
    if u < 0.15:   return X_IN, n
    if u < 0.45:   return X_IN + (X_B1 - X_IN) * smooth((u - 0.15) / 0.30), n
    if u < 0.55:   return X_B1, 3 * n
    if u < 0.80:   return X_B1 + (X_B2 - X_B1) * smooth((u - 0.55) / 0.25), 3 * n
    if u < 0.88:   return X_B2, 3 * n + 2
    return X_B2 + (X_OUT - X_B2) * smooth((u - 0.88) / 0.12), 3 * n + 2

def frame(t):
    im = Image.new('RGB', (W, H), LAV)
    d = ImageDraw.Draw(im)
    d.text((48, 34), '3n + 2', font=f_big, fill=NAVY)
    d.text((300, 60), 'multiply by 3, then add 2', font=f_small, fill=SOFT)
    d.rounded_rectangle((40, Y - 6, W - 40, Y + 6), 6, fill='#CFCADF')
    for x, label in ((X_B1, '× 3'), (X_B2, '+ 2')):
        d.rounded_rectangle((x - BOX_W // 2, Y - BOX_H // 2, x + BOX_W // 2, Y + BOX_H // 2), 18, fill=NAVY)
        centre_text(d, (x, Y), label, f_mid, WHITE)
    d.text((X_B1 - 30, Y - 108), 'first', font=f_small, fill=SOFT)
    d.text((X_B2 - 30, Y - 108), 'then', font=f_small, fill=SOFT)
    d.text((X_IN - 14, Y - 84), 'in', font=f_small, fill=SOFT)
    d.text((X_OUT - 24, Y - 84), 'out', font=f_small, fill=SOFT)

    for i, n in enumerate(INPUTS):                       # the answers so far, along the bottom
        x0 = 70 + i * 215
        if t >= (i + 1) * PER - 0.05:
            d.rounded_rectangle((x0, 405, x0 + 190, 480), 14, fill=WHITE, outline=CORAL, width=3)
            centre_text(d, (x0 + 42, 442), str(n), f_mid, NAVY)
            d.line((x0 + 72, 442, x0 + 112, 442), fill=CORAL, width=6)                    # the arrow is drawn:
            d.polygon([(x0 + 122, 442), (x0 + 104, 430), (x0 + 104, 454)], fill=CORAL)    # Georgia has no arrow glyph
            centre_text(d, (x0 + 158, 442), str(3 * n + 2), f_mid, NAVY)
        else:
            d.rounded_rectangle((x0, 405, x0 + 190, 480), 14, outline='#CFCADF', width=3)

    if t < len(INPUTS) * PER:                            # the travelling chip
        idx = int(t // PER)
        x, v = chip_state((t - idx * PER) / PER, INPUTS[idx])
        d.rounded_rectangle((x - CHIP_W // 2, Y - CHIP_H // 2, x + CHIP_W // 2, Y + CHIP_H // 2), 16, fill=CORAL)
        centre_text(d, (x, Y), str(v), f_chip, NAVY)
    return im

def main():
    total = len(INPUTS) * PER + HOLD
    n = int(total * FPS)
    tmp = pathlib.Path(tempfile.mkdtemp())
    for i in range(n):
        frame(i / FPS).save(tmp / f'{i:04d}.png')
    out = OUT / 'putting-numbers-in-machine.mp4'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', str(tmp / '%04d.png'),
                    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '26', '-preset', 'veryslow', str(out)], check=True)
    frame(total).save(OUT / 'putting-numbers-in-machine.png')     # cover: the finished table
    shutil.rmtree(tmp)
    print(f'{out.name}: {n} frames, {out.stat().st_size // 1024} KB')

main()
