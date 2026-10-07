#!/usr/bin/env python3
"""
Living Things Grow (T3, Unit 4 Lesson 3): the I Do animation. PIL + ffmpeg, silent, 'meadow' palette.

  living-things-grow.mp4/png   960 x 540, about 22 s, PLAYS ON CLICK. Two pots side by side, a seed in one and a small rock
                               in the other, and a day counter over both. It is a process animation, so it is slow and it
                               PAUSES at every stage (CLAUDE.md, "Media"): the counter runs, stops, the stage is named in one
                               short word ("seed", "root", "shoot", "leaves", "plant") and only then does it move on. The rock
                               never changes. At the end: "grows" under the plant, and a cross under the rock.
                               The cover is day 1, both pots the same, so the answer is not on the slide before the click.

The words on the film are the lesson's words and nothing harder: seed, root, shoot and leaves are said by the teacher,
not drilled (the notes say so); "grow" is the target.

    python3 build/media/living-things-grow-media.py
"""
import math, pathlib, shutil, subprocess, tempfile
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / 'assets' / 'media'
OUT.mkdir(parents=True, exist_ok=True)
FPS, W, H = 20, 960, 540
DARK, SUN, LEAF, BERRY, MIST, SLATE, WHITE = '#0C2819', '#FFC845', '#237D38', '#B8335A', '#F4F8EF', '#5E6B78', '#FFFFFF'
SOIL, SOIL_D, POT, POT_D, STEM, LEAF_L, SEED, ROCK, ROCK_D, ROOT_C = '#6B4A2F', '#4E3420', '#C0643B', '#9A4C2A', '#4E9A3C', '#6CBF4E', '#C9A66B', '#8E8A84', '#6F6B66', '#E8DCC0'

def font(size):
    for p in ('/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if pathlib.Path(p).exists():
            return ImageFont.truetype(p, size)
    raise SystemExit('no bold font found')
F = {s: font(s) for s in (30, 40, 48, 60)}

# the timeline: (day, label, growth 0..1 at this stage). Each stage: the counter runs to the day, then a pause with its label.
STAGES = [(1, 'seed', 0.00), (3, 'root', 0.12), (6, 'shoot', 0.30), (10, 'leaves', 0.55), (20, 'plant', 1.00)]
RUN, HOLD, END = 1.6, 2.2, 3.0          # seconds to run between stages, seconds held on each stage, final hold
T0 = 1.0                                # day 1 shown still at the start
TIMES = []
t = T0
for i, st in enumerate(STAGES):
    start_run = t
    end_run = t + (RUN if i else 0)
    TIMES.append((start_run, end_run, end_run + HOLD))
    t = end_run + HOLD
TOTAL = t + END

def state(tt):
    """(day, growth, label shown) at time tt."""
    if tt < T0:
        return 1, 0.0, None
    for i, (s, e, h) in enumerate(TIMES):
        if tt < e:          # running towards stage i
            d0, g0 = (STAGES[i - 1][0], STAGES[i - 1][2]) if i else (1, 0.0)
            f = (tt - s) / (e - s)
            f = f * f * (3 - 2 * f)
            return d0 + (STAGES[i][0] - d0) * f, g0 + (STAGES[i][2] - g0) * f, None
        if tt < h:
            return STAGES[i][0], STAGES[i][2], STAGES[i][1]
    return STAGES[-1][0], 1.0, 'plant'

def pot(d, cx, top):
    """A pot of soil seen in cross-section, so the seed and its roots show; the soil surface is at y = top."""
    d.polygon([(cx - 140, top - 6), (cx + 140, top - 6), (cx + 112, top + 118), (cx - 112, top + 118)], fill=POT)
    d.polygon([(cx - 126, top - 6), (cx + 126, top - 6), (cx + 102, top + 106), (cx - 102, top + 106)], fill=SOIL)
    d.rectangle([cx - 152, top - 28, cx + 152, top - 4], fill=POT_D)
    return top - 4

def leaf(d, x, y, length, angle, width):
    pts = []
    for k in range(21):
        u = k / 20
        r = math.sin(math.pi * u) * width
        px, py = u * length, r
        pts.append((px, py))
    pts += [(u, -r) for (u, r) in reversed(pts)]
    ca, sa = math.cos(angle), math.sin(angle)
    d.polygon([(x + px * ca - py * sa, y + px * sa + py * ca) for px, py in pts], fill=LEAF_L, outline=LEAF)

def plant(d, cx, soil, g):
    # the seed, in the soil, a little below the surface
    sy = soil + 30
    d.ellipse([cx - 22, sy - 13, cx + 22, sy + 13], fill=SEED, outline='#8C6D3F', width=3)
    if g <= 0:
        return
    # root: grows down from the seed (first 30% of growth)
    rl = min(g / 0.3, 1) * 62
    d.line([(cx, sy + 8), (cx - 6, sy + 8 + rl * 0.5), (cx + 4, sy + 8 + rl)], fill=ROOT_C, width=5, joint='curve')
    if g > 0.15:
        d.line([(cx - 4, sy + 8 + rl * 0.5), (cx - 30, sy + 8 + rl * 0.8)], fill=ROOT_C, width=3)
    # shoot: from 12% of growth, up through the soil
    if g > 0.12:
        h = (g - 0.12) / 0.88 * 225
        top = soil - h
        d.line([(cx, sy - 6), (cx, top)], fill=STEM, width=9)
        # leaves: pairs appear as it grows
        for k, at in enumerate((0.30, 0.50, 0.70, 0.86)):
            if g > at:
                size = min((g - at) / 0.18, 1)
                ly = soil - (at - 0.12) / 0.88 * 225 * 0.95 - 10
                leaf(d, cx, ly, 70 * size + 10, -0.45 - (k % 2) * 0.1, 18 * size + 3)
                leaf(d, cx, ly, 70 * size + 10, math.pi + 0.45 + (k % 2) * 0.1, 18 * size + 3)
        if g > 0.92:   # a flower at the top for the last stage
            f = (g - 0.92) / 0.08
            r = 26 * f
            for a in range(8):
                ang = a * math.pi / 4
                px, py = cx + math.cos(ang) * r, top + math.sin(ang) * r
                d.ellipse([px - 13 * f, py - 13 * f, px + 13 * f, py + 13 * f], fill=SUN)
            d.ellipse([cx - 12 * f, top - 12 * f, cx + 12 * f, top + 12 * f], fill='#B36B00')

def rock(d, cx, soil):
    pts = [(cx - 62, soil + 6), (cx - 70, soil - 30), (cx - 38, soil - 66), (cx + 10, soil - 74), (cx + 56, soil - 48), (cx + 68, soil - 6)]
    d.polygon(pts, fill=ROCK, outline=ROCK_D)
    d.polygon([(cx - 38, soil - 66), (cx + 10, soil - 74), (cx - 4, soil - 30)], fill='#A7A39C')

def text_c(d, x, y, s, f, fill):
    w = d.textlength(s, font=f)
    d.text((x - w / 2, y), s, font=f, fill=fill)

def frame(tt):
    im = Image.new('RGB', (W, H), MIST)
    d = ImageDraw.Draw(im)
    day, g, label = state(tt)
    # the day counter, top centre
    d.rounded_rectangle([W / 2 - 120, 18, W / 2 + 120, 82], radius=16, fill=DARK)
    text_c(d, W / 2, 26, f'Day {int(round(day))}', F[40], SUN)
    lx, rx, soil_top = 260, 700, 330
    plant(d, lx, pot(d, lx, soil_top), g)
    rock(d, rx, pot(d, rx, soil_top))
    if label is None and tt < T0:
        text_c(d, lx, 470, 'seed', F[30], LEAF)
    text_c(d, rx, 470, 'rock', F[30], DARK)
    if label and tt < TIMES[-1][1]:
        text_c(d, lx, 470, label, F[30], LEAF)
    end = tt >= TIMES[-1][1]
    if end:
        d.rounded_rectangle([lx - 100, 462, lx + 100, 512], radius=12, fill=LEAF)
        text_c(d, lx, 468, 'grows', F[30], WHITE)
        # a cross beside the rock's name: it does not grow
        cx, cy = rx + 85, 488
        d.line([(cx - 20, cy - 20), (cx + 20, cy + 20)], fill=SLATE, width=9)
        d.line([(cx + 20, cy - 20), (cx - 20, cy + 20)], fill=SLATE, width=9)
    return im

if __name__ == '__main__':
    tmp = pathlib.Path(tempfile.mkdtemp())
    try:
        n = int(TOTAL * FPS)
        for k in range(n):
            frame(k / FPS).save(tmp / f'{k:04d}.png')
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', str(tmp / '%04d.png'), '-c:v', 'libx264',
                        '-pix_fmt', 'yuv420p', '-crf', '26', '-preset', 'veryslow', str(OUT / 'living-things-grow.mp4')], check=True)
        frame(0.2).save(OUT / 'living-things-grow.png')          # cover: day 1, seed and rock look alike
        for at in (0.5, TIMES[1][2] - 0.5, TIMES[2][2] - 0.5, TIMES[3][2] - 0.5, TOTAL - 0.5):
            frame(at).save(tmp.parent / f'living-things-grow-{at:.1f}.png')
        print(f'living-things-grow.mp4: {TOTAL:.1f} s, {(OUT / "living-things-grow.mp4").stat().st_size // 1024} KB')
    finally:
        shutil.rmtree(tmp)
