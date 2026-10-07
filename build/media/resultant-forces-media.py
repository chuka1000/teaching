#!/usr/bin/env python3
"""
Resultant Forces: the I Do 2 animation and the worksheet's diagrams (10A). PIL + ffmpeg, silent, 'motion' palette (Night Highway).

  resultant-forces-fbd.mp4/png   building a free-body diagram one arrow at a time, then finding the resultant.   960 x 540
                                 A 10 kg crate (weight 100 N) is pushed along the floor with 80 N against 50 N of friction. It PAUSES at
                                 every step. It plays ON CLICK.
  rf-ws-*.png                    the worksheet's free-body diagrams (arrow lengths are drawn to scale, 1.6 px per newton)

    python3 build/media/resultant-forces-media.py
"""
import pathlib, shutil, subprocess, tempfile
from PIL import Image, ImageDraw, ImageFont

OUT = pathlib.Path(__file__).resolve().parents[2] / 'assets' / 'media'
OUT.mkdir(parents=True, exist_ok=True)
FPS = 20
NIGHT, ORANGE, ORANGE_INK, CYAN, TINT, ROSE, SOFT, WHITE, GREY, GREEN = '#17203F', '#FF8A3D', '#C25A16', '#1FB6BC', '#F2F4FA', '#E03D6B', '#5A6480', '#FFFFFF', '#C3C8D8', '#1E8E5A'
ARIAL = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
ARIAL_R = '/System/Library/Fonts/Supplemental/Arial.ttf'
F = lambda s, b=True: ImageFont.truetype(ARIAL if b else ARIAL_R, s)
centre = lambda d, xy, t, f, c: d.text(xy, t, font=f, fill=c, anchor='mm')
PX_PER_N = 1.6

def arrow(d, x0, y0, x1, y1, col, w=8, head=22):
    d.line((x0, y0, x1, y1), fill=col, width=w)
    dx, dy = x1 - x0, y1 - y0; L = (dx * dx + dy * dy) ** .5; ux, uy = dx / L, dy / L; px, py = -uy, ux
    d.polygon([(x1 + ux * 2, y1 + uy * 2), (x1 - ux * head + px * head * .55, y1 - uy * head + py * head * .55), (x1 - ux * head - px * head * .55, y1 - uy * head - py * head * .55)], fill=col)

COL = {'left': ROSE, 'right': GREEN, 'up': CYAN, 'down': ORANGE_INK}
def draw_force(d, cx, cy, bw, bh, f, y_off=0, x_off=0, label_size=26, scale=PX_PER_N):
    L = f['n'] * scale; col = COL[f['dir']]
    txt = f"{f['name']} {f['n']} N"
    if f['dir'] == 'right':
        x0 = cx + bw / 2; y = cy + y_off; arrow(d, x0, y, x0 + L, y, col); d.text((x0 + 6, y - 19), txt, font=F(label_size), fill=col, anchor='lb')
    elif f['dir'] == 'left':
        x0 = cx - bw / 2; y = cy + y_off; arrow(d, x0, y, x0 - L, y, col); d.text((x0 - 6, y - 19), txt, font=F(label_size), fill=col, anchor='rb')
    elif f['dir'] == 'down':
        y0 = cy + bh / 2; x = cx + x_off; arrow(d, x, y0, x, y0 + L, col); d.text((x + 14, y0 + L / 2), txt, font=F(label_size), fill=col, anchor='lm')
    else:
        y0 = cy - bh / 2; x = cx + x_off; arrow(d, x, y0, x, y0 - L, col); d.text((x + 14, y0 - L / 2), txt, font=F(label_size), fill=col, anchor='lm')

def fbd_image(forces, name, box_label='', size=(1000, 420), table=False, scale=PX_PER_N):
    im = Image.new('RGB', size, WHITE); d = ImageDraw.Draw(im)
    W, H = size; cx, cy, bw, bh = W // 2, H // 2, (200 if table else 130), (130 if table else 84)
    if table: d.rectangle((cx - 300, cy + bh / 2, cx + 300, cy + bh / 2 + 14), fill=GREY)
    d.rounded_rectangle((cx - bw / 2, cy - bh / 2, cx + bw / 2, cy + bh / 2), 10, fill=TINT, outline=NIGHT, width=5)
    if box_label: centre(d, (cx, cy), box_label, F(34 if table else 26), NIGHT)
    for side in ('left', 'right'):
        fs = [f for f in forces if f['dir'] == side]
        offs = {1: [0], 2: [-32, 32], 3: [-60, 0, 60]}[len(fs)] if fs else []
        for f, o in zip(fs, offs): draw_force(d, cx, cy, bw, bh, f, y_off=o, scale=scale)
    for f in [f for f in forces if f['dir'] in ('up', 'down')]: draw_force(d, cx, cy, bw, bh, f, x_off=0, scale=scale)
    if forces:   # crop to the drawing, so the labels print big
        from PIL import ImageChops
        x0, y0, x1, y1 = ImageChops.difference(im, Image.new('RGB', im.size, WHITE)).getbbox()
        im = im.crop((max(x0 - 24, 0), max(y0 - 24, 0), min(x1 + 24, W), min(y1 + 24, H)))
    im.save(OUT / f'{name}.png')

# ---------------------------------------------------------------- the worksheet's diagrams
WS = {
  'rf-ws-q4': ([{'name': 'Push', 'dir': 'right', 'n': 30}, {'name': 'Friction', 'dir': 'left', 'n': 20}], 'trolley'),
  'rf-ws-q6': ([{'name': 'Thrust', 'dir': 'right', 'n': 90}, {'name': 'Drag', 'dir': 'left', 'n': 30}, {'name': 'Friction', 'dir': 'left', 'n': 20}], 'car'),
  'rf-ws-q7': ([{'name': 'Thrust', 'dir': 'right', 'n': 200}, {'name': 'Water resistance', 'dir': 'left', 'n': 150}, {'name': 'Wind', 'dir': 'left', 'n': 20}], 'boat'),
}
for name, (forces, lab) in WS.items(): fbd_image(forces, name, box_label=lab, scale=1.0 if name == 'rf-ws-q7' else PX_PER_N)
# a blank for the student to draw on: a book on a table, with no arrows
fbd_image([], 'rf-ws-q3-blank', box_label='book', size=(1000, 560), table=True)

# ---------------------------------------------------------------- the animation: build a free-body diagram
FORCES = [('Weight', 'down', 100), ('Reaction force', 'up', 100), ('Push', 'right', 80), ('Friction', 'left', 50)]
T_BOX, T_ARROWS, T_RES, TOTAL = 0.6, [3.0, 6.0, 9.0, 12.0], [15.6, 18.0], 22.5
CAPTION = ['Draw the object as a box.', 'Weight: down. 100 N.', 'Reaction force from the floor: up. 100 N.', 'Push: right. 80 N.', 'Friction: left. 50 N.']
def caption(t):
    if t < T_BOX + 1.5: return CAPTION[0]
    for i, t0 in enumerate(T_ARROWS):
        if t < (T_ARROWS[i + 1] if i + 1 < 4 else T_RES[0] - 0.4): return CAPTION[i + 1] if t >= t0 else CAPTION[i]
    return 'A longer arrow means a bigger force.'
def frame(t):
    im = Image.new('RGB', (960, 540), TINT); d = ImageDraw.Draw(im)
    centre(d, (480, 36), caption(t), F(32), NIGHT)
    cx, cy, bw, bh = 480, 232, 140, 90
    d.rectangle((60, cy + bh / 2, 900, cy + bh / 2 + 16), fill=GREY)
    if t >= T_BOX: d.rounded_rectangle((cx - bw / 2, cy - bh / 2, cx + bw / 2, cy + bh / 2), 12, fill=WHITE, outline=NIGHT, width=6); centre(d, (cx, cy), 'crate', F(30), NIGHT)
    for (name, dr, n), t0 in zip(FORCES, T_ARROWS):
        if t >= t0: draw_force(d, cx, cy, bw, bh, {'name': name, 'dir': dr, 'n': n}, label_size=26, scale=1.2)
    if t >= T_RES[0]: centre(d, (480, 462), 'Up and down: 100 − 100 = 0 N. The forces are balanced.', F(28), CYAN if False else NIGHT)
    if t >= T_RES[1]: centre(d, (480, 504), 'Left and right: 80 − 50 = 30 N to the right.', F(30), GREEN)
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

assert 100 - 100 == 0 and 80 - 50 == 30
render('resultant-forces-fbd', TOTAL)
frame(21).save('/tmp/rf-last.png')
