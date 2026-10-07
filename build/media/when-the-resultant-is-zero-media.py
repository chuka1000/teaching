#!/usr/bin/env python3
"""
When The Resultant Is Zero: the two animations and the worksheet's diagrams (10A). PIL + ffmpeg, silent, 'motion' palette (Night Highway).

  wtrz-motion.mp4/png   I Do 1.  One crate, three situations, and the resultant under each:  960 x 540, about 25 s
                          1. at rest:               weight 100 N down, reaction force 100 N up         -> 0 N, it stays at rest
                          2. sliding at a steady 5 m/s: push 60 N right, friction 60 N left (plus the vertical pair) -> 0 N, the speed stays 5 m/s
                          3. the push stops:        friction 60 N alone                               -> 60 N to the left, the speed falls to 0
                        The ground scrolls past at a speed proportional to the crate's speed, so the motion is SEEN. It plays ON CLICK.
  wtrz-probe.mp4/png    I Do 2.  A probe in deep space, engine off: no forces at all. Stars scroll past at a constant speed. 960 x 540, 14 s
  wtrz-ws-*.png         the worksheet's free-body diagrams (arrow lengths drawn to scale)

    python3 build/media/when-the-resultant-is-zero-media.py
"""
import pathlib, random, shutil, subprocess, tempfile
from PIL import Image, ImageChops, ImageDraw, ImageFont

OUT = pathlib.Path(__file__).resolve().parents[2] / 'assets' / 'media'
OUT.mkdir(parents=True, exist_ok=True)
FPS = 20
NIGHT, ORANGE, ORANGE_INK, CYAN, TINT, ROSE, SOFT, WHITE, GREY, GREEN = '#17203F', '#FF8A3D', '#C25A16', '#1FB6BC', '#F2F4FA', '#E03D6B', '#5A6480', '#FFFFFF', '#C3C8D8', '#1E8E5A'
ARIAL = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
F = lambda s: ImageFont.truetype(ARIAL, s)
centre = lambda d, xy, t, f, c: d.text(xy, t, font=f, fill=c, anchor='mm')
COL = {'left': ROSE, 'right': GREEN, 'up': CYAN, 'down': ORANGE_INK}

def arrow(d, x0, y0, x1, y1, col, w=8, head=22):
    d.line((x0, y0, x1, y1), fill=col, width=w)
    dx, dy = x1 - x0, y1 - y0; L = (dx * dx + dy * dy) ** .5; ux, uy = dx / L, dy / L; px, py = -uy, ux
    d.polygon([(x1 + ux * 2, y1 + uy * 2), (x1 - ux * head + px * head * .55, y1 - uy * head + py * head * .55), (x1 - ux * head - px * head * .55, y1 - uy * head - py * head * .55)], fill=col)

def draw_force(d, cx, cy, bw, bh, f, y_off=0, label_size=26, scale=1.2):
    L = f['n'] * scale; col = COL[f['dir']]
    txt = f.get('label') or f"{f['name']} {f['n']} N"
    if f['dir'] == 'right':
        x0 = cx + bw / 2; y = cy + y_off; arrow(d, x0, y, x0 + L, y, col); d.text((x0 + 6, y - 19), txt, font=F(label_size), fill=col, anchor='lb')
    elif f['dir'] == 'left':
        x0 = cx - bw / 2; y = cy + y_off; arrow(d, x0, y, x0 - L, y, col); d.text((x0 - 6, y - 19), txt, font=F(label_size), fill=col, anchor='rb')
    elif f['dir'] == 'down':
        y0 = cy + bh / 2; arrow(d, cx, y0, cx, y0 + L, col); d.text((cx + 14, y0 + L / 2), txt, font=F(label_size), fill=col, anchor='lm')
    else:
        y0 = cy - bh / 2; arrow(d, cx, y0, cx, y0 - L, col); d.text((cx + 14, y0 - L / 2), txt, font=F(label_size), fill=col, anchor='lm')

# ---------------------------------------------------------------- the worksheet's diagrams
def fbd_image(forces, name, box_label='', scale=1.6):
    W, H = 1000, 420
    im = Image.new('RGB', (W, H), WHITE); d = ImageDraw.Draw(im)
    cx, cy, bw, bh = W // 2, H // 2, 130, 84
    d.rounded_rectangle((cx - bw / 2, cy - bh / 2, cx + bw / 2, cy + bh / 2), 10, fill=TINT, outline=NIGHT, width=5)
    if box_label: centre(d, (cx, cy), box_label, F(26), NIGHT)
    for side in ('left', 'right'):
        fs = [f for f in forces if f['dir'] == side]
        offs = {1: [0], 2: [-32, 32], 3: [-60, 0, 60]}[len(fs)] if fs else []
        for f, o in zip(fs, offs): draw_force(d, cx, cy, bw, bh, f, y_off=o, scale=scale)
    x0, y0, x1, y1 = ImageChops.difference(im, Image.new('RGB', im.size, WHITE)).getbbox()
    im.crop((max(x0 - 24, 0), max(y0 - 24, 0), min(x1 + 24, W), min(y1 + 24, H))).save(OUT / f'{name}.png')

WS = {
  'wtrz-ws-q4': ([{'name': 'Pull', 'dir': 'right', 'n': 45}, {'name': 'Friction', 'dir': 'left', 'n': 25}, {'name': 'Air resistance', 'dir': 'left', 'n': 20}], 'trolley', 1.6),
  'wtrz-ws-q6': ([{'name': 'Thrust', 'dir': 'right', 'n': 200}, {'name': 'Water resistance', 'dir': 'left', 'n': 150}, {'name': 'Wind', 'dir': 'left', 'n': 50, 'label': 'Wind X'}], 'boat', 1.0),
}
for name, (forces, lab, sc) in WS.items(): fbd_image(forces, name, box_label=lab, scale=sc)

def render(name, total, frame):
    n = int(total * FPS)
    tmp = pathlib.Path(tempfile.mkdtemp())
    for i in range(n): frame(i / FPS).save(tmp / f'{i:04d}.png')
    out = OUT / f'{name}.mp4'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', str(tmp / '%04d.png'),
                    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '26', '-preset', 'veryslow', str(out)], check=True)
    frame(1.0).save(OUT / f'{name}.png')
    shutil.rmtree(tmp)
    print(f'{out.name}: {n} frames, {total:.1f} s, {out.stat().st_size // 1024} KB')

# ---------------------------------------------------------------- 1. the crate: at rest, steady speed, push stops
V0, PX_PER_MS = 5.0, 30            # steady speed (m/s); ground scroll in pixels per second for each m/s
T_BOX, T_W, T_R, T_SUM1 = 0.6, 2.0, 3.5, 5.0
T_B, T_PUSH, T_FRIC, T_SUM2 = 8.0, 9.0, 10.5, 12.0
T_S0, T_SUM3, T_S1, TOTAL = 16.5, 18.0, 22.0, 25.0
def speed(t):
    if t < T_B: return 0.0
    if t < T_S0: return V0
    if t < T_S1: return V0 * (1 - (t - T_S0) / (T_S1 - T_S0))
    return 0.0
DIST = [0.0]
for i in range(1, int(TOTAL * FPS) + 2): DIST.append(DIST[-1] + speed(i / FPS) * PX_PER_MS / FPS)
def caption(t):
    if t < T_W: return 'A crate on the floor.'
    if t < T_R: return 'Weight: down. 100 N.'
    if t < T_SUM1: return 'Reaction force: up. 100 N.'
    if t < T_B - 0.5: return 'Resultant 0 N. It stays at rest.'
    if t < T_PUSH: return 'Now it slides at a steady 5 m/s.'
    if t < T_FRIC: return 'Push: right. 60 N.'
    if t < T_SUM2 + 0.5: return 'Friction: left. 60 N.'
    if t < T_S0 - 0.3: return 'Resultant 0 N. The speed stays 5 m/s.'
    if t < T_SUM3: return 'Now the push stops.'
    if t < T_S1: return 'A resultant force. The speed changes.'
    return 'It stops. No resultant force: it stays at rest.'
def frame_crate(t):
    im = Image.new('RGB', (960, 540), TINT); d = ImageDraw.Draw(im)
    centre(d, (480, 36), caption(t), F(32), NIGHT)
    cx, cy, bw, bh = 480, 250, 140, 90
    gy = cy + bh / 2
    d.rectangle((60, gy, 900, gy + 16), fill=GREY)
    off = DIST[min(int(t * FPS), len(DIST) - 1)]
    k = -(off % 80)
    while k < 900:
        if k > 62: d.rectangle((k, gy + 2, k + 4, gy + 14), fill='#8F97B3')
        k += 80
    if t >= T_BOX:
        v = speed(t); col = GREEN if T_B <= t < T_S0 else (ROSE if T_S0 <= t < T_S1 else NIGHT)
        txt = f'Speed: {v:.1f} m/s' if T_S0 <= t < T_S1 else f'Speed: {int(round(v))} m/s'
        d.rounded_rectangle((60, 76, 300, 122), 12, fill=WHITE, outline=col, width=3); centre(d, (180, 99), txt, F(27), col)
        d.rounded_rectangle((cx - bw / 2, cy - bh / 2, cx + bw / 2, cy + bh / 2), 12, fill=WHITE, outline=NIGHT, width=6); centre(d, (cx, cy), 'crate', F(30), NIGHT)
    if t >= T_W: draw_force(d, cx, cy, bw, bh, {'name': 'Weight', 'dir': 'down', 'n': 100})
    if t >= T_R: draw_force(d, cx, cy, bw, bh, {'name': 'Reaction force', 'dir': 'up', 'n': 100})
    if T_PUSH <= t < T_S0: draw_force(d, cx, cy, bw, bh, {'name': 'Push', 'dir': 'right', 'n': 60})
    if T_FRIC <= t < T_S1: draw_force(d, cx, cy, bw, bh, {'name': 'Friction', 'dir': 'left', 'n': 60})
    if t >= T_SUM1: centre(d, (480, 462), 'Up and down: 100 − 100 = 0 N. The forces are balanced.', F(27), NIGHT)
    if T_SUM2 <= t < T_S0: centre(d, (480, 504), 'Left and right: 60 − 60 = 0 N.', F(30), GREEN)
    if T_SUM3 <= t < T_S1: centre(d, (480, 504), 'Left and right: 0 − 60 = 60 N to the left.', F(30), ROSE)
    return im
assert 100 - 100 == 0 and 60 - 60 == 0 and 0 - 60 == -60
render('wtrz-motion', TOTAL, frame_crate)

# ---------------------------------------------------------------- 2. the probe in deep space: no forces at all
random.seed(7)
STARS = [(random.uniform(0, 960), random.uniform(120, 520), random.choice([2, 2, 3, 4])) for _ in range(70)]
SPEED_PX = 110.0
def pcaption(t):
    if t < 4.0: return 'Deep space. Far from every star and planet.'
    if t < 8.0: return 'Engine off. Nothing pushes or pulls it.'
    return 'No forces. It keeps going at 5 km/s.'
def frame_probe(t):
    im = Image.new('RGB', (960, 540), NIGHT); d = ImageDraw.Draw(im)
    centre(d, (480, 36), pcaption(t), F(32), WHITE)
    for x, y, r in STARS:
        xx = (x - SPEED_PX * t) % 960
        d.ellipse((xx - r, y - r, xx + r, y + r), fill='#C9D0E8')
    d.rounded_rectangle((60, 76, 300, 122), 12, fill=NIGHT, outline=ORANGE, width=3); centre(d, (180, 99), 'Speed: 5 km/s', F(27), ORANGE)
    cx, cy = 480, 310
    d.polygon([(cx - 70, cy - 22), (cx + 40, cy - 22), (cx + 90, cy), (cx + 40, cy + 22), (cx - 70, cy + 22)], fill=WHITE, outline=ORANGE, width=4)
    d.rectangle((cx - 40, cy - 60, cx + 10, cy - 22), fill=CYAN); d.rectangle((cx - 40, cy + 22, cx + 10, cy + 60), fill=CYAN)
    d.ellipse((cx + 8, cy - 9, cx + 30, cy + 9), fill=NIGHT)
    if t >= 8.0: centre(d, (480, 462), 'Resultant force: 0 N', F(34), ORANGE)
    if t >= 10.5: centre(d, (480, 506), 'The motion does not change.', F(30), WHITE)
    return im
render('wtrz-probe', 14.0, frame_probe)
