#!/usr/bin/env python3
"""
Deep Time: the I Do 1 animation (8I). PIL + ffmpeg, silent, 'galapagos' palette.

  deep-time-eras.mp4/png   The geologic time scale DRAWN TO SCALE, 960 x 540, about 27 s, PLAYS ON CLICK, and it PAUSES at every era:
                             - a bar for all 4,600 million years fills era by era (Precambrian, Palaeozoic, Mesozoic, Cenozoic);
                             - beside it a clock counts the same history as ONE DAY, from midnight, and stops at each era boundary
                               (21:11, 22:41, 23:39, midnight), which settles the hook;
                             - then the last 539 million years are stretched out underneath, with a trilobite, a dinosaur and a person;
                             - and it ends on the first humans: 0.3 million years ago, 23:59:54, the last 6 seconds of the day.
                           The cover is the empty bar, so the answer to the hook is not on the slide before the click.

Every date comes from build/deep-time.data.json; every clock time is checked in build/deep-time-check.py.

    python3 build/media/deep-time-media.py
"""
import json, pathlib, shutil, subprocess, tempfile
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / 'assets' / 'media'
OUT.mkdir(parents=True, exist_ok=True)
DATA = json.loads((ROOT / 'build' / 'deep-time.data.json').read_text())
FPS, W, H = 20, 960, 540
FOREST, AMBER, AMBER_INK, TEAL, RUST, CREAM, WHITE, INK = '#1F3D2B', '#DE9A4C', '#A8651F', '#3E93A3', '#C1442D', '#F5F1E6', '#FFFFFF', '#182B1E'
ERA_COL = {'Precambrian': '#8C7356', 'Palaeozoic': TEAL, 'Mesozoic': '#3A5F44', 'Cenozoic': AMBER}
def font(size):
    for p in ('/System/Library/Fonts/Supplemental/Arial Bold.ttf', '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf',
              '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if pathlib.Path(p).exists(): return ImageFont.truetype(p, size)
    raise SystemExit('no bold font found')
F = {s: font(s) for s in (20, 22, 26, 30, 40)}
AGE = DATA['earth_age']
ERAS = DATA['eras']
HUMANS = DATA['events']['humans'][1]

# geometry: the full bar, and the zoomed bar for the last 539 million years
X0, X1, BY0, BY1 = 60, 900, 95, 155
ZX0, ZX1, ZY0, ZY1 = 60, 900, 300, 370
ZOOM_FROM = ERAS[1][1]                          # 539
xs = lambda t: X0 + (AGE - t) / AGE * (X1 - X0)
xz = lambda t: ZX0 + (ZOOM_FROM - t) / ZOOM_FROM * (ZX1 - ZX0)

def clock_text(t):
    """Earth's history as one day: the clock time when 't' million years ago is reached (t = 0 is midnight)."""
    s = round((AGE - t) / AGE * 24 * 3600)
    s = min(s, 24 * 3600 - 1) if t > 0 else 24 * 3600
    return '24:00:00' if s == 24 * 3600 else f'{s // 3600:02d}:{s % 3600 // 60:02d}:{s % 60:02d}'

# the timeline (seconds): each era fills, then the film pauses on it
STEPS = [  # (era index, fill start, fill end, pause end)
    (0, 2.0, 7.0, 9.5), (1, 9.5, 11.0, 13.5), (2, 13.5, 14.8, 17.3), (3, 17.3, 18.3, 20.5)]
T_ZOOM, T_ZOOM_END, T_HUMANS, TOTAL = 20.5, 22.0, 23.5, 27.5
CAPTIONS = [   # short, so they can be large: the film is read from the back of a classroom
    (0.0, "Earth's history: 4,600 million years."),
    (2.0, 'Precambrian: 4,600 to 539 million years ago.'),
    (9.5, 'Palaeozoic: 539 to 252 million years ago.'),
    (13.5, 'Mesozoic: 252 to 66 million years ago.'),
    (17.3, 'Cenozoic: 66 million years ago to now.'),
    (T_ZOOM, 'Stretch out the last 539 million years.'),
    (T_HUMANS, 'First humans: the last 6 seconds of the day.'),
]
ICONS = [(ROOT / 'assets' / 'icons' / f'{n}_galapagos_white.png', t) for n, t in (('trilobite', 400), ('dinosaur', 160), ('person', 33))]
icon_imgs = [(Image.open(p).convert('RGBA').resize((52, 52)), t) for p, t in ICONS]

def ease(u): u = max(0.0, min(1.0, u)); return u * u * (3 - 2 * u)

def frame(t):
    im = Image.new('RGB', (W, H), CREAM)
    d = ImageDraw.Draw(im)
    # the full bar: outline, end labels
    d.rectangle((X0, BY0, X1, BY1), outline=FOREST, width=2, fill=WHITE)
    d.text((X0, BY0 - 22), '4,600 million years ago', font=F[22], fill=INK, anchor='lm')
    d.text((X1 - 6, BY1 + 8), 'now', font=F[22], fill=INK, anchor='ra')
    # fill each era as far as the film has got
    clock_t = AGE                                   # how far back the clock has reached (million years ago)
    for (i, a, b, p) in STEPS:
        name, start, end = ERAS[i]
        if t < a: break
        u = ease((t - a) / (b - a))
        cur = start - u * (start - end)
        d.rectangle((xs(start), BY0 + 2, xs(cur), BY1 - 2), fill=ERA_COL[name])
        clock_t = cur
        if u >= 1.0:   # the era is complete: label it (wide eras inside, narrow ones above with a leader)
            mid = (xs(start) + xs(end)) / 2
            if i == 0: d.text((mid, (BY0 + BY1) / 2), name, font=F[30], fill=WHITE, anchor='mm')
            else:   # the narrow eras are labelled above the bar, staggered, with a leader line
                lx = {1: 640, 2: 745, 3: 880}[i]
                ly = {1: 62, 2: 28, 3: 28}[i]
                d.line((mid, BY0, lx, ly + 14), fill=ERA_COL[name], width=3)
                d.text((lx, ly), name, font=F[26], fill=ERA_COL[name] if name != 'Cenozoic' else AMBER_INK, anchor='mm')
    # the clock: Earth's history as one day
    # (bottom left, clear of the zoom's connecting lines)
    d.rounded_rectangle((X0, 172, X0 + 240, 242), radius=10, fill=FOREST)
    d.text((X0 + 16, 180), 'AS ONE DAY', font=F[20], fill=AMBER, anchor='la')
    shown = clock_text(clock_t) if t >= STEPS[0][1] else '00:00:00'
    if t >= T_HUMANS: shown = clock_text(HUMANS)
    d.text((X0 + 16, 222), shown, font=F[40], fill=WHITE, anchor='lm')
    # the zoom: the last 539 million years stretched across the width
    if t >= T_ZOOM:
        u = ease((t - T_ZOOM) / (T_ZOOM_END - T_ZOOM))
        col = tuple(int(int(FOREST[k:k + 2], 16) * u + int(CREAM[k:k + 2], 16) * (1 - u)) for k in (1, 3, 5))
        d.line((xs(ZOOM_FROM), BY1, ZX0, ZY0), fill=col, width=2); d.line((xs(0), BY1, ZX1, ZY0), fill=col, width=2)
        d.rectangle((ZX0, ZY0, ZX1, ZY1), outline=col, width=2)
        if u >= 1.0:
            for name, start, end in ERAS[1:]:
                d.rectangle((xz(start), ZY0 + 2, xz(end), ZY1 - 2), fill=ERA_COL[name])
                d.text(((xz(start) + xz(end)) / 2, ZY1 + 22), name, font=F[26], fill=ERA_COL[name] if name != 'Cenozoic' else AMBER_INK, anchor='mm')
            for img, at in icon_imgs:
                im.paste(img, (int(xz(at) - 26), ZY0 + 9), img)
            for t_, lab in ((539, '539'), (252, '252'), (66, '66')):
                d.text((xz(t_), ZY0 - 18), lab, font=F[22], fill=INK, anchor='mm')
            d.text((ZX1 - 12, ZY0 - 18), 'now', font=F[22], fill=INK, anchor='rm')
    # the first humans: a flashing tick at the very end of the zoomed bar
    if t >= T_HUMANS:
        on = int((t - T_HUMANS) * 3) % 2 == 0 or t > T_HUMANS + 2
        if on:
            d.line((ZX1 - 2, ZY0 - 34, ZX1 - 2, ZY1 + 4), fill=RUST, width=5)
            d.text((ZX1 - 10, ZY1 + 52), 'first humans', font=F[22], fill=RUST, anchor='rm')
    # caption
    cap = [c for at, c in CAPTIONS if t >= at][-1]
    d.rounded_rectangle((30, H - 78, W - 30, H - 16), radius=12, fill=WHITE, outline=AMBER, width=3)
    d.text((W / 2, H - 47), cap, font=F[30], fill=FOREST, anchor='mm')
    return im

def main():
    tmp = pathlib.Path(tempfile.mkdtemp())
    n = int(TOTAL * FPS)
    for k in range(n):
        frame(k / FPS).save(tmp / f'{k:04d}.png')
    out = OUT / 'deep-time-eras.mp4'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', str(tmp / '%04d.png'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
                    '-crf', '26', '-preset', 'veryslow', str(out)], check=True)
    frame(0.5).save(OUT / 'deep-time-eras.png')          # cover: the empty bar, no answer on it
    for at in (8.0, 19.5, 26.0):                          # stills to look at
        frame(at).save(tmp.parent / f'deep-time-eras-{at:.1f}.png')
    shutil.rmtree(tmp)
    print(f'{out.name}: {out.stat().st_size // 1024} KB, {TOTAL} s;  clock at the boundaries:',
          ', '.join(f'{ERAS[i][2]} -> {clock_text(ERAS[i][2])}' for i in range(4)), f'; humans -> {clock_text(HUMANS)}')

if __name__ == '__main__':
    main()
