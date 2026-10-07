#!/usr/bin/env python3
"""
Shuffling The Gene Pool: pictures and the We Do animation (8I). PIL + ffmpeg, silent, Galapagos colours.

  shuffling-hook.png        20 beads, 10 green and 10 brown: the gene pool of a beetle population (the Hook)
  shuffling-drift.mp4/png   a COMPUTER MODEL (not real data) of allele frequency over 8 generations, starting at 50%:
                            left, a small population (4 alleles); right, a big one (20 alleles). Six runs each. Each
                            generation is formed by drawing the same number of alleles, at random, from the one before.
                            It PAUSES while the lines are drawn one generation at a time. 960 x 540. Plays ON CLICK.
  build/shuffling-the-gene-pool.sim.json   the exact numbers drawn (read back by build/shuffling-the-gene-pool-check.py)

    python3 build/media/shuffling-the-gene-pool-media.py
"""
import json, pathlib, random, shutil, subprocess, tempfile
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / 'assets' / 'media'
OUT.mkdir(parents=True, exist_ok=True)
FPS = 20
FOREST, CREAM, AMBER, GREEN, BROWN, RUST, SOFT, GREY, WHITE = '#1F3D2B', '#F5F1E6', '#DE9A4C', '#4C9A5B', '#8A5A2B', '#C1442D', '#52685A', '#D9C9A8', '#FFFFFF'
ARIAL = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
F = lambda s: ImageFont.truetype(ARIAL, s)
centre = lambda d, xy, t, f, c: d.text(xy, t, font=f, fill=c, anchor='mm')

# ---------------------------------------------------------------- the model
N_SMALL, N_BIG, RUNS, GENS, SEED = 4, 200, 6, 8, 7

def simulate(n_alleles, rng):
    """Start with half the alleles green. Each generation is n_alleles draws, with replacement, from the one before."""
    k = n_alleles // 2; path = [k]
    for _ in range(GENS):
        k = sum(1 for _ in range(n_alleles) if rng.random() < k / n_alleles)
        path.append(k)
    return path
rng = random.Random(SEED)
SIM = {'seed': SEED, 'generations': GENS,
       'small': {'n': N_SMALL, 'runs': [simulate(N_SMALL, rng) for _ in range(RUNS)]},
       'big': {'n': N_BIG, 'runs': [simulate(N_BIG, rng) for _ in range(RUNS)]}}
(ROOT / 'build' / 'shuffling-the-gene-pool.sim.json').write_text(json.dumps(SIM))
def spread(side): return sum(abs(r[-1] / SIM[side]['n'] - 0.5) for r in SIM[side]['runs']) / RUNS * 100
print(f"mean distance from 50% after {GENS} generations: small {spread('small'):.1f} points, big {spread('big'):.1f} points")
assert spread('small') > 2 * spread('big')

# ---------------------------------------------------------------- the hook picture
def bead(d, cx, cy, r, col): d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=col, outline=FOREST, width=3)
def hook():
    im = Image.new('RGB', (640, 330), CREAM); d = ImageDraw.Draw(im)
    d.rounded_rectangle((12, 12, 628, 318), 36, fill='#EFE6CF', outline=FOREST, width=5)
    order = [1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0]                 # 10 brown (1) and 10 green (0), mixed
    assert sum(order) == 10
    for k in range(20):
        row, col = divmod(k, 10)
        bead(d, 56 + col * 60, 100 + row * 82, 24, BROWN if order[k] else GREEN)
    im.save(OUT / 'shuffling-hook.png')

# ---------------------------------------------------------------- the animation
PX = [(60, 110, 460, 410), (500, 110, 900, 410)]       # the two plot boxes: left, top, right, bottom
COLS = ['#C1442D', '#3E93A3', '#8A5A2B', '#6A4C93', '#DE9A4C', '#1F3D2B']
T0, STEP = 2.2, 0.8
T_END = T0 + GENS * STEP
TOTAL = T_END + 6.5

def panel(d, box, side, t, title):
    l, tp, r, b = box
    d.rounded_rectangle((l - 10, tp - 50, r + 10, b + 44), 18, fill='#FBF8EF', outline=GREY, width=3)
    centre(d, ((l + r) // 2, tp - 24), title, F(26), FOREST)
    d.line((l, tp, l, b), fill=FOREST, width=3); d.line((l, b, r, b), fill=FOREST, width=3)
    for frac, lab in ((0, '0%'), (0.5, '50%'), (1, '100%')):
        y = b - frac * (b - tp)
        d.line((l - 6, y, l, y), fill=FOREST, width=3); centre(d, (l - 30, y), lab, F(20), SOFT)
        if frac == 0.5: d.line((l, y, r, y), fill=GREY, width=2)
    centre(d, ((l + r) // 2, b + 24), 'generation', F(20), SOFT)
    runs = SIM[side]['runs']; n = SIM[side]['n']
    g_now = max(0.0, (t - T0) / STEP)
    for ri, path in enumerate(runs):
        pts = []
        for g in range(GENS + 1):
            if g > g_now: break
            pts.append((l + g * (r - l) / GENS, b - (path[g] / n) * (b - tp)))
        if len(pts) > 1: d.line(pts, fill=COLS[ri], width=5, joint='curve')
        if pts: d.ellipse((pts[-1][0] - 6, pts[-1][1] - 6, pts[-1][0] + 6, pts[-1][1] + 6), fill=COLS[ri])

def frame(t):
    im = Image.new('RGB', (960, 540), CREAM); d = ImageDraw.Draw(im)
    centre(d, (480, 28), 'A computer model: the same start, two population sizes', F(28), FOREST)
    panel(d, PX[0], 'small', t, f'Small population: {N_SMALL} alleles')
    panel(d, PX[1], 'big', t, f'Big population: {N_BIG} alleles')
    if t >= T_END + 1.0: centre(d, (480, 500), 'Small: the lines swing, and many reach 0% or 100%.   Big: they move far less.', F(24), RUST)
    if t < T0: centre(d, (480, 500), 'Every line starts at 50%. Nothing helps or harms any allele.', F(24), SOFT)
    return im

def render(name, total):
    n = int(total * FPS)
    tmp = pathlib.Path(tempfile.mkdtemp())
    for i in range(n): frame(i / FPS).save(tmp / f'{i:04d}.png')
    out = OUT / f'{name}.mp4'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', str(tmp / '%04d.png'),
                    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '26', '-preset', 'veryslow', str(out)], check=True)
    frame(0.5).save(OUT / f'{name}.png')
    shutil.rmtree(tmp)
    print(f'{out.name}: {n} frames, {total:.1f} s, {out.stat().st_size // 1024} KB')

hook(); render('shuffling-drift', TOTAL)
frame(T_END + 2).save('/tmp/shuf-last.png')
