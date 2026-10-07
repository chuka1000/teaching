#!/usr/bin/env python3
"""
The Greatest Show On Earth: the I Do 2 animation (8I). PIL + ffmpeg, silent, 'galapagos' palette.

  gse-finches.mp4/png   How one species becomes two. A MODEL of Darwin's finches, 960 x 540, about 30 s, PLAYS ON CLICK, and it PAUSES at every step:
                          1. one population (one island, finches with the same sort of beak)
                          2. a barrier: a few finches cross the sea to a new island, and the sea keeps the two groups apart (geographic isolation)
                          3. different conditions: big hard seeds on one island, small soft seeds on the other
                          4. different selection: deep beaks survive on the first island, slim beaks on the second
                          5. the differences build up over many generations (a generation counter runs to "many thousands")
                          6. they meet again and do not interbreed: two species
                        The six captions are the six steps of the game's Sequencer, in the same words.

    python3 build/media/the-greatest-show-on-earth-media.py
"""
import math, pathlib, shutil, subprocess, tempfile
from PIL import Image, ImageDraw, ImageFont

OUT = pathlib.Path(__file__).resolve().parents[2] / 'assets' / 'media'
OUT.mkdir(parents=True, exist_ok=True)
FPS = 20
FOREST, AMBER, AMBER_INK, TEAL, RUST, CREAM, WHITE = '#1F3D2B', '#DE9A4C', '#A8651F', '#3E93A3', '#C1442D', '#F5F1E6', '#FFFFFF'
SEA, LAND = '#BFE0E6', '#D9C9A8'
ARIAL = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
F = lambda s: ImageFont.truetype(ARIAL, s)
centre = lambda d, xy, t, f, c: d.text(xy, t, font=f, fill=c, anchor='mm')

# the timeline (seconds)
T_ONE, T_BARRIER, T_SEA, T_COND, T_SEL, T_BUILD, T_MEET, T_END, TOTAL = 0.0, 3.5, 7.0, 10.0, 14.0, 19.0, 25.0, 28.0, 30.0
# the starting beak depths (0 slim ... 1 deep): variation in ONE population
A_BEAKS = [0.25, 0.4, 0.5, 0.5, 0.6, 0.75, 0.35, 0.65]
B_BEAKS = [0.3, 0.5, 0.7]        # the three finches that cross the sea
POS_A = [(110, 330), (180, 390), (250, 330), (130, 440), (230, 440), (300, 390), (190, 290), (300, 300)]
POS_B = [(700, 380), (790, 430), (850, 360)]
ISL_A, ISL_B = (40, 270, 360, 500), (640, 320, 920, 500)

def clamp(x, a=0.0, b=1.0): return max(a, min(b, x))
def bird(d, x, y, beak, alpha=1.0, flip=False, col=AMBER_INK):
    """A finch: body, head, eye and a beak whose DEPTH (0 slim ... 1 deep) is drawn to scale."""
    if alpha < 0.05: return
    s = -1 if flip else 1
    def fade(hexcol):
        r, g, b = (int(hexcol[i:i + 2], 16) for i in (1, 3, 5)); bgc = (217, 201, 168)
        return tuple(int(v * alpha + bv * (1 - alpha)) for v, bv in zip((r, g, b), bgc))
    d.ellipse((x - 34, y - 18, x + 34, y + 20), fill=fade(col))
    d.polygon([(x - s * 30, y - 2), (x - s * 58, y - 12), (x - s * 58, y + 10)], fill=fade(col))
    hx, hy = x + s * 28, y - 22
    d.ellipse((hx - 17, hy - 17, hx + 17, hy + 17), fill=fade(col))
    depth = 6 + 24 * beak; length = 16 + 8 * beak
    d.polygon([(hx + s * 12, hy - depth / 2), (hx + s * (12 + length), hy + 2), (hx + s * 12, hy + depth / 2)], fill=fade('#3B2A1A'))
    d.ellipse((hx + s * 2 - 3, hy - 8, hx + s * 2 + 4, hy - 1), fill=WHITE)
def seeds(d, island, big):
    x0, y0, x1, y1 = island
    for i in range(7):
        sx = x0 + 40 + i * (x1 - x0 - 80) / 6; sy = y0 + 18 + (i % 2) * 18
        r = 9 if big else 3
        d.ellipse((sx - r, sy - r, sx + r, sy + r), fill='#6B4A2B')
def caption(t):
    if t < T_BARRIER: return '1. One population of finches.'
    if t < T_SEA: return '2. A barrier: some finches reach a new island.'
    if t < T_COND: return '2. The sea keeps the two groups apart.'
    if t < T_SEL: return '3. Different conditions on each island.'
    if t < T_BUILD: return '4. Different selection on each island.'
    if t < T_MEET: return '5. The differences build up over many generations.'
    if t < T_END: return '6. They meet again. They no longer interbreed.'
    return 'Two species.'
def survives_A(b, t):    # deep beaks survive on the island with big hard seeds
    f = clamp((t - T_SEL) / 3.0)
    return 1.0 - f * (1.0 if b < 0.5 else 0.0)
def survives_B(b, t):    # slim beaks survive on the island with small soft seeds
    f = clamp((t - T_SEL) / 3.0)
    return 1.0 - f * (1.0 if b > 0.5 else 0.0)
def beak_after(b, t, target):  # over the generations the survivors' young drift towards the extreme
    f = clamp((t - T_BUILD) / 5.0)
    return b + (target - b) * f
def frame(t):
    im = Image.new('RGB', (960, 540), CREAM); d = ImageDraw.Draw(im)
    centre(d, (480, 36), caption(t), F(30), FOREST)
    # the sea and the island(s)
    d.rectangle((0, 100, 960, 540), fill=SEA)
    if t < T_BARRIER:
        d.rounded_rectangle((40, 270, 920, 500), 60, fill=LAND)          # one big island: one place
    else:
        d.rounded_rectangle(ISL_A, 50, fill=LAND); d.rounded_rectangle(ISL_B, 50, fill=LAND)
        centre(d, (500, 300), 'SEA = BARRIER', F(26), TEAL)
        d.rectangle((410, 320, 590, 326), fill=TEAL)
    # conditions
    if t >= T_COND:
        seeds(d, ISL_A, True); seeds(d, ISL_B, False)
        d.text((60, 484), 'big, hard seeds', font=F(22), fill=RUST, anchor='lm'); d.text((660, 484), 'small, soft seeds', font=F(22), fill=RUST, anchor='lm')
    # the birds
    if t < T_BARRIER:
        for (x, y), b in zip(POS_A, A_BEAKS): bird(d, x + 150, y - 10, b, flip=False)          # one population: the same sort of beak on show
    else:
        groupA = list(zip(POS_A[:5], A_BEAKS[:5])) if t < T_COND else list(zip(POS_A[:5], A_BEAKS[:5]))
        for (x, y), b in groupA:
            bb = beak_after(b if t < T_BUILD else (1.0 if survives_A(b, T_SEL + 3) > .5 else b), t, 0.95) if t >= T_BUILD else b
            a = survives_A(b, t) if t >= T_SEL else 1.0
            if t >= T_BUILD and a < .5: continue
            bird(d, x, y, bb if t >= T_BUILD else b, alpha=a)
        for (x, y), b in zip(POS_B, B_BEAKS):
            a = survives_B(b, t) if t >= T_SEL else 1.0
            if t >= T_BUILD and a < .5: continue
            bb = beak_after(b, t, 0.1) if t >= T_BUILD else b
            bird(d, x, y, bb, alpha=a, flip=True)
        # a few finches fly across during step 2
        if T_BARRIER <= t < T_SEA - 1.0:
            f = (t - T_BARRIER) / (T_SEA - 1.0 - T_BARRIER)
            for k in range(3):
                x = 330 + (700 - 330) * clamp(f * 1.1 - k * 0.08); y = 340 - 120 * math.sin(math.pi * clamp(f * 1.1 - k * 0.08)) + k * 14
                if 0 < f * 1.1 - k * 0.08 < 1: bird(d, x, y, B_BEAKS[k], flip=False)
    # step 4 and 5 labels
    if T_SEL <= t < T_BUILD:
        d.text((60, 250), 'deep beaks survive', font=F(22), fill=FOREST, anchor='lm'); d.text((660, 300), 'slim beaks survive', font=F(22), fill=FOREST, anchor='lm')
        bird(d, 205, 190, 1.0); bird(d, 790, 190, 0.0, flip=True)
    if T_BUILD <= t < T_MEET:
        gen = int(10000 * clamp((t - T_BUILD) / 5.0)); d.rounded_rectangle((330, 110, 630, 160), 14, fill=WHITE, outline=FOREST, width=3)
        centre(d, (480, 135), f'Generation {gen:,}' if gen < 10000 else 'Many thousands of generations', F(24 if gen < 10000 else 20), FOREST)
        d.text((60, 250), 'deep beaks', font=F(22), fill=FOREST, anchor='lm'); d.text((660, 300), 'slim beaks', font=F(22), fill=FOREST, anchor='lm')
        bird(d, 205, 190, 1.0); bird(d, 790, 190, 0.0, flip=True)
    # step 6: they meet
    if t >= T_MEET:
        bird(d, 410, 235, 0.95); bird(d, 590, 235, 0.1, flip=True)
        d.line((470, 140, 520, 190), fill=RUST, width=8); d.line((520, 140, 470, 190), fill=RUST, width=8)
        centre(d, (495, 112), 'no young', F(26), RUST)
    if t >= T_END:
        d.text((60, 250), 'Species A', font=F(28), fill=FOREST, anchor='lm'); d.text((700, 300), 'Species B', font=F(28), fill=FOREST, anchor='lm')
    return im
def render(name, total, fr):
    n = int(total * FPS)
    tmp = pathlib.Path(tempfile.mkdtemp())
    for i in range(n): fr(i / FPS).save(tmp / f'{i:04d}.png')
    out = OUT / f'{name}.mp4'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', str(tmp / '%04d.png'),
                    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '26', '-preset', 'veryslow', str(out)], check=True)
    fr(1.0).save(OUT / f'{name}.png')
    shutil.rmtree(tmp)
    print(f'{out.name}: {n} frames, {total:.1f} s, {out.stat().st_size // 1024} KB')
render('gse-finches', TOTAL, frame)
