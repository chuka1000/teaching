#!/usr/bin/env python3
"""
Fossils and the Fossil Record: the two I Do animations (8I) and the worksheet diagram.
Generated with PIL and encoded with ffmpeg (CLAUDE.md, Media, preference 1). Silent,
Galapagos colours. They play ON CLICK and PAUSE at every stage: nothing moves while
the caption is being read.

  fossils-formation.mp4   a clam dies, is buried, the soft parts rot, layers build up and
                          the shell turns to stone, then the rock wears away.   960 x 600
  fossils-layers.mp4      three layers form one on top of another, each burying a
                          different fossil; then the rock, labelled oldest and youngest.  960 x 1040
  worksheet-strata.png    the rock layers on the worksheet (Silver Q5 to Q7)

    python3 build/media/fossils-animations.py
"""
import pathlib, subprocess, shutil, tempfile, math, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / 'assets' / 'media'
ICONS = ROOT / 'assets' / 'icons'
OUT.mkdir(parents=True, exist_ok=True)
FPS = 20
DARK, AMBER, AMBER_INK, TEAL, RUST, CREAM, DARKSOFT, CREAM2, INK = '#1F3D2B', '#DE9A4C', '#A8651F', '#3E93A3', '#C1442D', '#F5F1E6', '#3A5F44', '#E8E0CC', '#182B1E'
WATER, WATER2, SAND, ROCK, ROCK2, ROCK3, SHELL, STONE, FLESH = '#BFE0E6', '#9CCDD6', '#D8C7A3', '#9A876A', '#85735A', '#6F5F4B', '#F2E8CF', '#7A7367', '#E6A0A0'
ARIAL_B = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
F = lambda s: ImageFont.truetype(ARIAL_B, s)
SS = 2                                                             # supersample

smooth = lambda t: (lambda t: t * t * (3 - 2 * t))(max(0.0, min(1.0, t)))
lerp = lambda a, b, t: a + (b - a) * t
def mix(c1, c2, t):
    a = tuple(int(c1[i:i + 2], 16) for i in (1, 3, 5)); b = tuple(int(c2[i:i + 2], 16) for i in (1, 3, 5))
    return '#%02X%02X%02X' % tuple(round(lerp(a[i], b[i], t)) for i in range(3))

def canvas(w, h, bg):
    im = Image.new('RGB', (w * SS, h * SS), bg); return im, ImageDraw.Draw(im)
def R(d, box, r, **k): d.rounded_rectangle(tuple(v * SS for v in box), r * SS, **k)
def T(d, xy, text, size, fill, anchor='mm'): d.text((xy[0] * SS, xy[1] * SS), text, font=F(size * SS), fill=fill, anchor=anchor)
def POLY(d, pts, **k): d.polygon([(x * SS, y * SS) for x, y in pts], **k)
def LINE(d, pts, w, fill): d.line([(x * SS, y * SS) for x, y in pts], fill=fill, width=int(w * SS), joint='curve')
def ELL(d, box, **k): d.ellipse(tuple(v * SS for v in box), **k)
def finish(im, size): return im.resize(size, Image.LANCZOS)
def icon(name, size, role='dark'):
    p = ICONS / f'{name}_galapagos_{role}.png'
    return Image.open(p).convert('RGBA').resize((size * SS, size * SS), Image.LANCZOS)
def paste_icon(im, name, cx, cy, size, role='dark', alpha=1.0):
    ic = icon(name, size, role)
    if alpha < 1.0: ic.putalpha(ic.getchannel('A').point(lambda v: int(v * alpha)))
    im.paste(ic, (int((cx - size / 2) * SS), int((cy - size / 2) * SS)), ic)

def caption(d, W, H, n, text, top=False):
    y0 = 24 if top else H - 118
    R(d, (30, y0, W - 30, y0 + 94), 18, fill=DARK)
    ELL(d, (48, y0 + 18, 48 + 58, y0 + 18 + 58), fill=AMBER)
    T(d, (77, y0 + 47), str(n), 34, DARK)
    T(d, (126, y0 + 47), text, 32, CREAM, 'lm')

# ------------------------------------------------------------------ 1. formation
W1, H1 = 960, 600
FLOOR = 480                                                        # the top of the sea floor
HOLD1 = [3.0, 3.4, 3.4, 3.8, 4.0]                                  # seconds each stage is held: the caption is read here
MOVE = 2.2                                                         # seconds each change takes
def timeline(holds, move, first_move=0.0):
    t, out = 0.0, []
    for i, h in enumerate(holds):
        start = t
        hold_from = start + (move if i else first_move)
        out.append((start, hold_from, hold_from + h)); t = hold_from + h
    return out
ST1 = timeline(HOLD1, MOVE)
TOTAL1 = ST1[-1][2] + 1.0
CAP1 = ['The animal dies on the sea floor.', 'Mud and sand bury it quickly.', 'The soft parts rot away. The shell stays.',
        'Layers turn to rock. The shell turns to stone.', 'The rock is worn away. The fossil is found.']

def shell(d, cx, cy, fill, soft, cavity=False, speck=False):
    """A fan-shaped shell lying open on the floor, with a soft body inside."""
    r = 100
    pts = [(cx + r * math.cos(math.radians(180 + k)), cy + r * math.sin(math.radians(180 + k)) * 0.8) for k in range(0, 181, 6)]
    POLY(d, pts, fill=fill, outline=INK)
    for k in range(20, 180, 20):
        a = math.radians(180 + k); LINE(d, [(cx, cy), (cx + (r - 4) * math.cos(a), cy + (r - 4) * math.sin(a) * 0.8)], 2, INK)
    if soft > 0.02: ELL(d, (cx - 52, cy - 56, cx + 52, cy - 8), fill=mix(fill, FLESH, soft))
    if cavity: ELL(d, (cx - 52, cy - 56, cx + 52, cy - 8), outline=INK, width=2 * SS)
    if speck:
        rnd = random.Random(5)
        for _ in range(40):
            a = rnd.uniform(math.pi, 2 * math.pi); rr = rnd.uniform(8, r - 10)
            x, y = cx + rr * math.cos(a), cy + rr * math.sin(a) * 0.8
            ELL(d, (x - 3, y - 3, x + 3, y + 3), fill=mix(fill, '#000000', 0.3))

def frame1(t):
    im, d = canvas(W1, H1, CREAM)
    prog = [1.0] + [smooth((t - ST1[i][0]) / MOVE) for i in range(1, 5)]
    stage = [i for i in range(5) if t >= ST1[i][0]][-1]
    bury, rot, build, erode = prog[1], prog[2], prog[3], prog[4]
    # the sea drains in stage 5
    sea_top = lerp(130, FLOOR, erode)
    R(d, (0, sea_top, W1, FLOOR), 0, fill=WATER)
    R(d, (0, lerp(320, FLOOR, erode), W1, FLOOR), 0, fill=WATER2)
    # the ground below the floor: sediment that becomes rock
    R(d, (0, FLOOR, W1, H1), 0, fill=mix(SAND, ROCK, build))
    LINE(d, [(0, FLOOR), (W1, FLOOR)], 3, mix('#A89574', ROCK3, build))
    # the shell lies on the floor (a cross-section, so it stays visible inside the layers)
    soft = 1.0 - rot
    shell(d, 480, FLOOR - 4, mix(SHELL, STONE, build), soft, cavity=rot > 0.85, speck=build > 0.5)
    # layers above the floor, drawn semi-transparent over the shell so the fossil stays visible inside the rock
    ov = Image.new('RGBA', im.size, (0, 0, 0, 0)); od = ImageDraw.Draw(ov)
    heights = [100 * bury] + [55 * smooth(max(0.0, min(1.0, build * 3 - k))) for k in range(3)]
    tones = [(SAND, ROCK2), ('#CDB98F', ROCK3), ('#BFAA80', ROCK), ('#D2C093', ROCK2)]
    y = FLOOR; y_cut = lerp(0, 1, erode)
    limit = FLOOR - lerp(300, 88, erode)                               # erosion cuts every layer back to just above the shell
    top = FLOOR
    for h, (cs, cr) in zip(heights, tones):
        if h < 0.5: continue
        y1 = max(y - h, limit if erode > 0.01 else -1e9)
        if y1 < y:
            od.rectangle((0, y1 * SS, W1 * SS, y * SS), fill=tuple(int(mix(cs, cr, build)[i:i + 2], 16) for i in (1, 3, 5)) + (215,))
            od.line((0, y1 * SS, W1 * SS, y1 * SS), fill=(80, 60, 40, 200), width=2 * SS)
        y -= h
    im.paste(Image.alpha_composite(im.convert('RGBA'), ov).convert('RGB'))
    d = ImageDraw.Draw(im)
    # falling sediment in stage 2
    if 0.02 < bury < 0.98:
        rnd = random.Random(11); span = FLOOR - 100 * bury - 150
        for _ in range(70):
            gx = rnd.uniform(30, W1 - 30); off = rnd.uniform(0, 1); sp = rnd.uniform(0.7, 1.3)
            gy = 140 + ((off + bury * 1.6 * sp) % 1.0) * span
            ELL(d, (gx - 3, gy - 3, gx + 3, gy + 3), fill='#B4A07C')
    # labels
    if stage == 3 and build > 0.6: T(d, (W1 - 180, 160), 'millions of years', 30, DARKSOFT)
    if stage == 4 and erode > 0.85:
        T(d, (760, 300), 'the fossil', 34, RUST); LINE(d, [(700, 315), (600, FLOOR - 70)], 5, RUST)
        POLY(d, [(586, FLOOR - 92), (612, FLOOR - 80), (598, FLOOR - 62)], fill=RUST)
    caption(d, W1, H1, stage + 1, CAP1[stage], top=True)
    return finish(im, (W1, H1))

# ------------------------------------------------------------------ 2. layers
W2, H2 = 960, 1040
BASE2 = 800                                                        # bottom of the rock in the picture
LH = 170                                                           # height of each layer
HOLD2 = [3.4, 3.4, 3.4, 3.4, 4.6]
ST2 = timeline(HOLD2, 2.0, first_move=2.0)
TOTAL2 = ST2[-1][2] + 1.0
CAP2 = ['Long ago: mud settles. A trilobite is buried.', 'Later: more mud. An ammonite is buried.', 'Later still: more mud. A mammal bone is buried.',
        'Millions of years later: the layers are rock.', 'Deeper is older. Higher is younger.']
LAYERS2 = [('trilobite', 'trilobite', SAND, ROCK), ('ammonite', 'ammonite', '#CDB98F', ROCK2), ('bone', 'mammal bone', '#D2C093', ROCK3)]

def frame2(t):
    im, d = canvas(W2, H2, CREAM)
    prog = [smooth(t / 2.0)] + [smooth((t - ST2[i][0]) / 2.0) for i in range(1, 5)]
    stage = [i for i in range(5) if t >= ST2[i][0]][-1]
    rock = prog[3] if stage >= 3 else 0.0
    T(d, (60, 50), 'Rock layers', 46, DARK, 'lm')
    T(d, (60, 100), 'a cross-section, not to scale', 24, DARKSOFT, 'lm')
    # water above (while mud is still settling)
    # the layers appear one after another; each is drawn as it forms
    tops = BASE2 - LH * sum(min(1.0, prog[k]) if stage >= k else 0.0 for k in range(3))
    if rock < 0.5: R(d, (140, 150, W2 - 60, tops), 0, fill=WATER)              # the water above, while the mud is still settling
    y = BASE2
    for k, (ic, name, cs, cr) in enumerate(LAYERS2):
        p = prog[k]
        if stage < k: continue
        h = LH * p
        col = mix(cs, cr, rock)
        R(d, (140, y - h, W2 - 60, y), 0, fill=col)
        d.line((140 * SS, (y - h) * SS, (W2 - 60) * SS, (y - h) * SS), fill=(80, 60, 40), width=3 * SS)
        if p > 0.55:
            paste_icon(im, ic, 470, y - LH / 2, 110, 'dark', alpha=min(1.0, (p - 0.55) / 0.35))
            T(d, (620, y - LH / 2), name, 30, INK if rock < 0.5 else CREAM, 'lm')
        if stage >= 4:
            T(d, (168, y - LH / 2), ['oldest', 'older', 'youngest'][k], 26, CREAM if rock > 0.5 else INK, 'lm')
        y -= h
    # the time arrow in the last stage
    if stage == 4 and prog[4] > 0.4:
        a = smooth((prog[4] - 0.4) / 0.6)
        x = 92
        LINE(d, [(x, BASE2 - 20), (x, BASE2 - LH * 3 + 30)], 8, RUST)
        POLY(d, [(x, BASE2 - LH * 3 + 5), (x - 22, BASE2 - LH * 3 + 45), (x + 22, BASE2 - LH * 3 + 45)], fill=RUST)
        T(d, (x, BASE2 + 32), 'older', 26, RUST); T(d, (x, BASE2 - LH * 3 - 14), 'younger', 26, RUST)
    caption(d, W2, H2, stage + 1, CAP2[stage])
    return finish(im, (W2, H2))

def render(name, frame, total, size):
    n = int(total * FPS)
    tmp = pathlib.Path(tempfile.mkdtemp())
    for i in range(n): frame(i / FPS).save(tmp / f'{i:04d}.png')
    out = OUT / f'{name}.mp4'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', str(tmp / '%04d.png'),
                    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '26', '-preset', 'veryslow', str(out)], check=True)
    frame(0.3).save(OUT / f'{name}.png')                            # the cover, shown before the click
    shutil.rmtree(tmp)
    print(f'{out.name}: {n} frames, {total:.1f} s, {out.stat().st_size // 1024} KB')

# ------------------------------------------------------------------ 3. the worksheet diagram
def strata_png():
    """Rock layers A (top) to E (bottom), for Silver Q5 to Q7. Each layer holds one fossil."""
    W, H = 900, 640; LHh = 112
    im, d = canvas(W, H, '#FFFFFF')
    layers = [('A', 'bone', 'mammal bone'), ('B', 'bones', 'dinosaur bones'), ('C', 'clam', 'clam shell'), ('D', 'ammonite', 'ammonite'), ('E', 'trilobite', 'trilobite')]
    tones = ['#D8C7A3', '#CDB98F', '#D2C093', '#C6B084', '#BBA57A']
    y0 = 30
    for i, (lab, ic, name) in enumerate(layers):
        y = y0 + i * LHh
        R(d, (120, y, W - 40, y + LHh), 0, fill=tones[i], outline='#6F5F4B', width=2 * SS)
        R(d, (40, y + 26, 100, y + LHh - 26), 10, fill=DARK)
        T(d, (70, y + LHh / 2), lab, 44, CREAM)
        if ic == 'clam':
            paste_clam(im, 470, y + LHh / 2 + 14, 84)
        else:
            paste_icon(im, ic, 470, y + LHh / 2, 84, 'dark')
        T(d, (560, y + LHh / 2), name, 30, INK, 'lm')
    T(d, (W / 2 + 40, H - 22), 'an example, not to scale', 22, DARKSOFT)
    finish(im, (W, H)).save(OUT / 'fossils-worksheet-strata.png')
    print('fossils-worksheet-strata.png')

def paste_clam(im, cx, cy, size):
    c = Image.open(OUT / 'clam-accentink.png').convert('RGBA')
    dark = Image.new('RGBA', c.size, (31, 61, 43, 255)); dark.putalpha(c.getchannel('A'))
    dark = dark.resize((size * SS, size * SS), Image.LANCZOS)
    im.paste(dark, (int((cx - size / 2) * SS), int((cy - size / 2) * SS)), dark)

if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == 'still':
        for i in range(5): frame1(ST1[i][2] - 0.3).save(f'/tmp/f1_{i}.png'); frame2(ST2[i][2] - 0.3).save(f'/tmp/f2_{i}.png')
    elif len(sys.argv) > 1 and sys.argv[1] == 'strata':
        strata_png()
    else:
        render('fossils-formation', frame1, TOTAL1, (W1, H1))
        render('fossils-layers', frame2, TOTAL2, (W2, H2))
        strata_png()
