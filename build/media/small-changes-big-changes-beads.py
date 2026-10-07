#!/usr/bin/env python3
"""
Small Changes, Big Changes: pictures and the I Do 2 animation (8I). PIL + ffmpeg, silent, Galapagos colours.

  small-changes-handful.png   five beads taken out of a bag: 4 green, 1 brown (the Hook)
  small-changes-bag.png       the whole bag: 20 beads, 15 green and 5 brown (I Do 1)
  small-changes-eyes.png      two eyes, two versions (alleles) of one gene: brown and blue (I Do 1)
  small-changes-generations.mp4/png   the gene pool over three generations: green goes 15, 17, 19 of 20
                              (75%, 85%, 95%). It PAUSES at every step. 960 x 540. Plays ON CLICK.

    python3 build/media/small-changes-big-changes-beads.py
"""
import pathlib, subprocess, shutil, tempfile
from PIL import Image, ImageDraw, ImageFont

OUT = pathlib.Path(__file__).resolve().parents[2] / 'assets' / 'media'
OUT.mkdir(parents=True, exist_ok=True)
FPS = 20
FOREST, CREAM, AMBER, GREEN, BROWN, RUST, SOFT, GREY, WHITE = '#1F3D2B', '#F5F1E6', '#DE9A4C', '#4C9A5B', '#8A5A2B', '#C1442D', '#52685A', '#D9C9A8', '#FFFFFF'
ARIAL = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
F = lambda s: ImageFont.truetype(ARIAL, s)
centre = lambda d, xy, t, f, c: d.text(xy, t, font=f, fill=c, anchor='mm')

def bead(d, cx, cy, r, col):
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=col, outline=FOREST, width=3)

def grid(d, x0, y0, n_green, cols=5, rows=4, gap=50, r=19):
    """20 beads: the first n_green are green, the rest brown, laid out by a fixed shuffled pattern so the colours are mixed."""
    order = [0, 7, 3, 12, 9, 15, 2, 18, 5, 11, 14, 1, 17, 8, 4, 19, 10, 6, 13, 16]   # a fixed scramble of 0..19
    for k in range(cols * rows):
        row, col = divmod(k, cols)
        green = order[k] < n_green
        bead(d, x0 + col * gap, y0 + row * gap, r, GREEN if green else BROWN)

def handful():
    im = Image.new('RGB', (560, 130), CREAM); d = ImageDraw.Draw(im)
    for i, col in enumerate([GREEN, GREEN, BROWN, GREEN, GREEN]): bead(d, 60 + i * 110, 65, 36, col)
    im.save(OUT / 'small-changes-handful.png')

def bag():
    im = Image.new('RGB', (520, 420), CREAM); d = ImageDraw.Draw(im)
    d.rounded_rectangle((20, 30, 500, 400), 40, fill='#EFE6CF', outline=FOREST, width=5)
    d.polygon([(130, 30), (390, 30), (350, 4), (170, 4)], fill=GREY, outline=FOREST)
    grid(d, 108, 96, 15, gap=76, r=29)
    im.save(OUT / 'small-changes-bag.png')

def eye(d, cx, cy, iris):
    d.ellipse((cx - 150, cy - 85, cx + 150, cy + 85), fill=WHITE, outline=FOREST, width=6)
    d.ellipse((cx - 62, cy - 62, cx + 62, cy + 62), fill=iris, outline=FOREST, width=4)
    d.ellipse((cx - 26, cy - 26, cx + 26, cy + 26), fill='#111111')
    d.ellipse((cx - 38, cy - 44, cx - 12, cy - 18), fill=WHITE)

def eyes():
    im = Image.new('RGB', (760, 230), CREAM); d = ImageDraw.Draw(im)
    eye(d, 190, 115, '#7A4B22'); eye(d, 570, 115, '#3F7FB8')
    im.save(OUT / 'small-changes-eyes.png')

# ---------------------------------------------------------------- the animation: three generations
GENS = [15, 17, 19]
X0 = [78, 378, 678]                 # left edge of each panel's first bead column
Y0 = 150
T_GEN = [0.6, 8.4, 16.2]            # each generation's beads appear
T_COUNT = [3.0, 10.8, 18.6]         # the count is written
T_ARROW = [5.6, 13.4]               # the arrow between generations and its reason
T_END = 21.2
TOTAL = 26.4

def frame(t):
    im = Image.new('RGB', (960, 540), CREAM); d = ImageDraw.Draw(im)
    centre(d, (480, 36), 'The gene pool of a beetle population', F(34), FOREST)
    for g in range(3):
        if t < T_GEN[g]: continue
        x0 = X0[g]
        d.rounded_rectangle((x0 - 34, Y0 - 34, x0 + 4 * 50 + 34, Y0 + 3 * 50 + 34), 22, fill='#EFE6CF', outline=GREY, width=3)
        grid(d, x0, Y0, GENS[g], gap=50, r=19)
        centre(d, (x0 + 100, Y0 - 62), f'Generation {g + 1}', F(30), FOREST)
        if t >= T_COUNT[g]:
            centre(d, (x0 + 100, Y0 + 3 * 50 + 70), f'green {GENS[g]} of 20', F(30), GREEN)
            centre(d, (x0 + 100, Y0 + 3 * 50 + 114), f'= {GENS[g] * 5}%', F(42), GREEN)
    for g in range(2):
        if t >= T_ARROW[g]:
            xa = X0[g] + 4 * 50 + 40
            d.line((xa, Y0 + 75, xa + 16, Y0 + 75), fill=RUST, width=6)
            d.polygon([(xa + 26, Y0 + 75), (xa + 10, Y0 + 63), (xa + 10, Y0 + 87)], fill=RUST)
    if T_ARROW[0] <= t < T_END: centre(d, (480, 504), 'Birds eat more brown beetles, so fewer brown alleles are passed on.', F(26), RUST)
    if t >= T_END: centre(d, (480, 504), 'Green: 75% → 85% → 95%. A change in allele frequency: microevolution.', F(26), FOREST)
    return im

def render(name, total):
    n = int(total * FPS)
    tmp = pathlib.Path(tempfile.mkdtemp())
    for i in range(n): frame(i / FPS).save(tmp / f'{i:04d}.png')
    out = OUT / f'{name}.mp4'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', str(tmp / '%04d.png'),
                    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '26', '-preset', 'veryslow', str(out)], check=True)
    frame(1.0).save(OUT / f'{name}.png')
    shutil.rmtree(tmp)
    print(f'{out.name}: {n} frames, {total:.1f} s, {out.stat().st_size // 1024} KB')

assert [g * 5 for g in GENS] == [75, 85, 95]
handful(); bag(); eyes()
render('small-changes-generations', TOTAL)
frame(24).save('/tmp/scbc-last.png'); frame(12).save('/tmp/scbc-mid.png')
