#!/usr/bin/env python3
"""
T3 Unit 8 Lesson 3, Does It Light Up: the circuit test as a silent 25-second film, plus the stills the deck and worksheet use.

A battery, a bulb and a gap. A sample slides into the gap. Copper: the bulb comes on and yellow dots (electricity) run round
the loop. Then sulfur: the dots do not move and the bulb stays off. The film stops at every step (CLAUDE.md, "a process
animation is slow and it pauses"): sample in, a second to look, THEN the bulb.

  python3 build/media/circuit-test.py            # assets/media/circuit-test.mp4 and .png (the cover)
Stills (assets/pictures): circuit_gap.png (no sample, off), circuit_on.png (copper, on), circuit_off.png (sulfur, off).
Palette: nucleus (navy 123B54, yellow FFD166, mint 06A77D).
"""
import math, pathlib, subprocess, sys, tempfile
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).parent.parent.parent
OUT_MEDIA = ROOT / 'assets' / 'media'
OUT_PIC = ROOT / 'assets' / 'pictures'
W, H, SS, FPS = 960, 540, 2, 20
NAVY, YEL, MINT, TINT, BOARD = (18, 59, 84), (255, 209, 102), (6, 167, 125), (244, 248, 250), (222, 234, 240)
GREY = (150, 164, 174)
FONT = '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'

# the loop, clockwise from the top-left corner
L, R, T, B = 170, 790, 196, 430
MID = (T + B) // 2
GAP = (400, 560)                    # the gap in the bottom wire (x range)
PATH = [(L, T), (R, T), (R, B), (GAP[1], B), (GAP[0], B), (L, B), (L, T)]
SEG = [math.dist(PATH[i], PATH[i + 1]) for i in range(len(PATH) - 1)]
PERIM = sum(SEG)


def along(d):
    d %= PERIM
    for i, s in enumerate(SEG):
        if d <= s:
            a, b = PATH[i], PATH[i + 1]
            f = d / s
            return a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f
        d -= s
    return PATH[0]


def ease(x):
    x = max(0.0, min(1.0, x))
    return x * x * (3 - 2 * x)


def lerp(a, b, f):
    return a + (b - a) * f


SAMPLES = {
    'copper': dict(base=(196, 112, 60), hi=(238, 170, 118), shiny=True),
    'sulfur': dict(base=(232, 206, 70), hi=(240, 222, 110), shiny=False),
}


def draw_sample(d, name, cx, cy, s=SS):
    spec = SAMPLES[name]
    w, h = 190, 36
    x0, y0, x1, y1 = (cx - w / 2) * s, (cy - h / 2) * s, (cx + w / 2) * s, (cy + h / 2) * s
    d.rounded_rectangle([x0, y0, x1, y1], radius=8 * s, fill=spec['base'], outline=(90, 60, 30) if spec['shiny'] else (140, 120, 30), width=2 * s)
    if spec['shiny']:
        d.rounded_rectangle([x0 + 14 * s, y0 + 6 * s, x1 - 14 * s, y0 + 13 * s], radius=3 * s, fill=spec['hi'])
        d.line([x0 + 30 * s, y1 - 8 * s, x0 + 90 * s, y1 - 8 * s], fill=(160, 88, 44), width=2 * s)
    else:
        for k in range(12):          # a dull, grainy lump
            px = x0 + (14 + (k * 53) % 160) * s
            py = y0 + (6 + (k * 17) % 22) * s
            d.ellipse([px, py, px + 6 * s, py + 5 * s], fill=(214, 186, 50))


def frame(t, st):
    """st: dict(sample=name|None, sx, sy offsets, bulb=0..1, flow=bool, label=str|None, flow_t=float)."""
    im = Image.new('RGBA', (W * SS, H * SS), TINT + (255,))
    d = ImageDraw.Draw(im, 'RGBA')
    s = SS
    d.rounded_rectangle([40 * s, 36 * s, 920 * s, 504 * s], radius=26 * s, fill=BOARD + (255,))
    # the wires, with the gap at the bottom and the battery at the left
    wire = 14 * s
    def line(p, q):
        d.line([p[0] * s, p[1] * s, q[0] * s, q[1] * s], fill=NAVY, width=wire)
        for c in (p, q):
            d.ellipse([c[0] * s - wire / 2, c[1] * s - wire / 2, c[0] * s + wire / 2, c[1] * s + wire / 2], fill=NAVY)
    line((L, MID - 70), (L, T)); line((L, T), (430, T)); line((530, T), (R, T)); line((R, T), (R, B)); line((R, B), (GAP[1], B))
    line((GAP[0], B), (L, B)); line((L, B), (L, MID + 70))
    # the battery: a navy body with a yellow band and + / -
    d.rounded_rectangle([(L - 44) * s, (MID - 70) * s, (L + 44) * s, (MID + 70) * s], radius=10 * s, fill=NAVY)
    d.rectangle([(L - 44) * s, (MID - 24) * s, (L + 44) * s, (MID + 24) * s], fill=YEL)
    f = ImageFont.truetype(FONT, 34 * s)
    d.text((L * s, MID * s), '+', font=f, fill=NAVY, anchor='mm')
    d.text((L * s, 206 * s), '−', font=ImageFont.truetype(FONT, 30 * s), fill=YEL, anchor='mm')
    # the bulb on the top wire
    bx, by = 480, T - 58
    g = st['bulb']
    if g > 0:
        for rr, a in ((100, 40), (80, 70), (64, 110)):
            d.ellipse([(bx - rr) * s, (by - rr) * s, (bx + rr) * s, (by + rr) * s], fill=YEL + (int(a * g),))
        for k in range(12):
            ang = k * math.pi / 6
            r0, r1 = 64, 64 + 26 * g
            d.line([(bx + r0 * math.cos(ang)) * s, (by + r0 * math.sin(ang)) * s, (bx + r1 * math.cos(ang)) * s, (by + r1 * math.sin(ang)) * s], fill=YEL + (255,), width=5 * s)
    glass = tuple(int(lerp(a, b, g)) for a, b in zip((236, 240, 244), (255, 233, 150)))
    d.ellipse([(bx - 52) * s, (by - 52) * s, (bx + 52) * s, (by + 52) * s], fill=glass + (255,), outline=NAVY, width=5 * s)
    d.rectangle([(bx - 30) * s, (by + 44) * s, (bx + 30) * s, (by + 64) * s], fill=GREY + (255,), outline=NAVY, width=4 * s)
    d.rectangle([(bx - 30) * s, (by + 64) * s, (bx + 30) * s, (T + 6) * s], fill=NAVY)
    fil = NAVY if g > 0.5 else GREY
    d.line([(bx - 18) * s, (by + 44) * s, (bx - 10) * s, (by - 12) * s, (bx + 10) * s, (by - 12) * s, (bx + 18) * s, (by + 44) * s], fill=fil + (255,), width=4 * s)
    # the two clips at the gap
    for cx in GAP:
        d.rounded_rectangle([(cx - 22) * s, (B - 20) * s, (cx + 22) * s, (B + 20) * s], radius=7 * s, fill=(60, 80, 96, 255), outline=NAVY, width=3 * s)
        d.rectangle([(cx - 9) * s, (B - 8) * s, (cx + 9) * s, (B + 8) * s], fill=GREY + (255,))
    # the sample
    if st['sample']:
        draw_sample(d, st['sample'], (GAP[0] + GAP[1]) / 2 + st['sx'], B + st['sy'])
        f2 = ImageFont.truetype(FONT, 34 * s)
        d.text(((GAP[0] + GAP[1]) / 2 * s + st['sx'] * s, (B + 64 + st['sy']) * s), st['sample'], font=f2, fill=NAVY, anchor='mm')
    # the electricity
    if st['flow']:
        for k in range(18):
            x, y = along(st['flow_t'] * 260 + k * PERIM / 18)
            if y > B - 1 and GAP[0] < x < GAP[1] and not st['sample']:
                continue
            if abs(x - L) < 2 and MID - 72 < y < MID + 72:     # inside the battery
                continue
            d.ellipse([(x - 9) * s, (y - 9) * s, (x + 9) * s, (y + 9) * s], fill=YEL + (255,), outline=NAVY, width=3 * s)
    # ON / OFF
    on = g > 0.5
    pill = MINT if on else GREY
    d.rounded_rectangle([590 * s, (by - 18) * s, 690 * s, (by + 18) * s], radius=18 * s, fill=pill + (255,))
    d.text((640 * s, by * s), 'ON' if on else 'OFF', font=ImageFont.truetype(FONT, 26 * s), fill=(255, 255, 255, 255), anchor='mm')
    return im.resize((W, H), Image.LANCZOS).convert('RGB')


def timeline(t):
    """The state at second t. Copper in at 2 to 4, contact and a pause, ON at 5.5, out at 13 to 15; sulfur in at 15 to 17, nothing happens, out at 23 to 25."""
    st = dict(sample=None, sx=0, sy=0, bulb=0.0, flow=False, flow_t=0.0)
    def slide(a, b, out=False):
        f = ease((t - a) / (b - a))
        f = 1 - f if out else f
        return (1 - f) * 260, (1 - f) * 150
    if 2 <= t < 4:
        st.update(sample='copper', sx=slide(2, 4)[0], sy=slide(2, 4)[1])
    elif 4 <= t < 13:
        st.update(sample='copper')
        if t >= 5.5:
            st.update(bulb=ease((t - 5.5) / 0.5), flow=True, flow_t=t - 5.5)
    elif 13 <= t < 15:
        st.update(sample='copper', sx=slide(13, 15, True)[0], sy=slide(13, 15, True)[1])
    elif 15 <= t < 17:
        st.update(sample='sulfur', sx=slide(15, 17)[0], sy=slide(15, 17)[1])
    elif 17 <= t < 23:
        st.update(sample='sulfur')
    elif 23 <= t < 25:
        st.update(sample='sulfur', sx=slide(23, 25, True)[0], sy=slide(23, 25, True)[1])
    return st


def main():
    OUT_MEDIA.mkdir(parents=True, exist_ok=True)
    # stills
    frame(0, dict(sample=None, sx=0, sy=0, bulb=0.0, flow=False, flow_t=0)).save(OUT_PIC / 'circuit_gap.png')
    on = frame(9, dict(sample='copper', sx=0, sy=0, bulb=1.0, flow=True, flow_t=3.5)); on.save(OUT_PIC / 'circuit_on.png')
    frame(20, dict(sample='sulfur', sx=0, sy=0, bulb=0.0, flow=False, flow_t=0)).save(OUT_PIC / 'circuit_off.png')
    on.save(OUT_MEDIA / 'circuit-test.png')
    n = 25 * FPS
    with tempfile.TemporaryDirectory() as td:
        for i in range(n):
            frame(i / FPS, timeline(i / FPS)).save(f'{td}/{i:04d}.png')
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', f'{td}/%04d.png', '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
                        '-crf', '26', '-preset', 'veryslow', str(OUT_MEDIA / 'circuit-test.mp4')], check=True)
    print('wrote circuit-test.mp4', round((OUT_MEDIA / 'circuit-test.mp4').stat().st_size / 1024), 'KB')


if __name__ == '__main__':
    main()
