#!/usr/bin/env python3
"""
What Gets Into The Air: the photochemical smog animation (Y9 Science, Human Actions and the Atmosphere). PIL + ffmpeg, silent, 'Upper Air' palette.

  atm-smog.mp4/png   How photochemical smog forms.  960 x 540, 20 fps, 24 s, and it PAUSES (about 2 s) on every finished step.
                     A street: three side-view cars on a road, a city skyline, a sun in the upper right. The scene builds up:
                       1  Cars release nitrogen oxides and VOCs.   (cars drive in; orange circles NOx and purple diamonds VOC rise from the
                                                                    exhausts and gather in a cloud over the street; two legend chips name them)
                       2  Sunlight shines on the gases.            (pale yellow rays sweep down from the sun onto the cloud; the dots wobble and glow)
                       3  They react and make ozone, O3.           (the orange and purple dots shrink away; violet molecules of THREE joined circles
                                                                    appear and multiply; two are labelled; a brown haze fades in over the skyline)
                       4  Ozone is made in the air. It does not come out of the exhaust.
                                                                   (one O3 is ringed: 'ground-level ozone', 'harms the lungs')

The science it keeps straight:
  - sunlight drives a series of reactions of NOx and VOCs that make ozone. No equations, no arrows between formulas, no counting of atoms.
    (the sun keeps shining through steps 3 and 4: the reaction needs it.)
  - the ozone is made in the air at street level, in the same cloud, and it is labelled 'ground-level ozone'. Nothing in the picture is
    high up and nothing is a layer, so it cannot be mistaken for the protective ozone layer.
  - the dots are told apart by SHAPE (circle, diamond, three joined circles) and by a label, not by colour alone.

    python3 build/media/what-gets-into-the-air-media.py                   # frames -> assets/media/atm-smog.mp4 and .png
    python3 build/media/what-gets-into-the-air-media.py --stills 6.6 10   # just those frames as PNGs in the temp folder (ANIM_TMP)
"""
import math, pathlib, random, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import atm_draw as A
from atm_draw import (W, H, SS, DARK, ACCENT, ALERT, INK, INK_SOFT, WHITE, SUN, HAZE, OZONE, NOX, VOC, Sp, clamp, ease, lerp, pop, tw)

NAME = 'atm-smog'
S2, S3, S4, TOTAL = 7.2, 11.4, 17.2, 24.0            # the start of each step; the film length
COVER_T = 6.6                                         # the cover: end of step 1 (cars and the gas cloud, nothing explained yet)
CAPS = {1: ['Cars release nitrogen oxides and VOCs.'],
        2: ['Sunlight shines on the gases.'],
        3: ['They react and make ozone, O₃.'],
        4: ['Ozone is made in the air.', 'It does not come out of the exhaust.']}
A.check_caption_widths(CAPS)

SCENE_B = 444                                         # the caption band starts here
SKY_BASE = 372                                        # the skyline stands on this line
WHEEL_Y = 426                                         # the bottom of the wheels
CAR_X = (215, 480, 745)
CAR_COL = (('E9EEF3', 'CFD8E0'), ('2A4A73', '1E3552'), ('C2432E', '9A3322'))
CAR_D, CAR_DUR, X_START = (0.6, 0.3, 0.0), 2.8, -210.0   # when each car sets off, how long it takes to arrive, where it comes from
SUN_XY, SUN_R = (860, 72), 38
CLOUD = (460, 160, 205, 52)                           # centre x, y, half-width, half-height of the gas cloud
CLOUD_CIRCLES = [(300, 165, 55), (365, 140, 62), (445, 128, 66), (530, 130, 64), (605, 148, 58), (660, 172, 46), (410, 180, 52), (500, 182, 54), (585, 182, 50)]
T_RISE = 2.0                                          # how long a dot takes to rise from the exhaust to the cloud
N_EMIT = (6, 7, 7)                                    # puffs from each car
EMIT_T0 = (1.7, 1.0, 0.7)
EMIT_GAP = 0.2
N_O3 = 10
BASE = {}
ST = {}


# ------------------------------------------------------------------------------------------------ the film's plan (all fixed numbers)
def plan():
    rnd = random.Random(7)
    ems = []
    for c in range(3):
        for j in range(N_EMIT[c]):
            ems.append((EMIT_T0[c] + EMIT_GAP * j + rnd.uniform(0, 0.05), c))
    ems.sort()
    n = len(ems)
    cx0, cy0, rx, ry = CLOUD
    pts = []                                          # best-candidate sampling: each new target is the one farthest from the others
    for _ in range(n):
        best, bd = None, -1
        for _ in range(500):
            a, r = rnd.uniform(0, 2 * math.pi), math.sqrt(rnd.uniform(0, 1))
            p = (cx0 + (rx - 14) * r * math.cos(a), cy0 + (ry - 2) * r * math.sin(a))
            d = min([math.hypot(p[0] - q[0], p[1] - q[1]) for q in pts] or [999])
            if d > bd: best, bd = p, d
        pts.append(best)
    dots = []
    order = list(range(n)); rnd.shuffle(order)
    for i, (te, c) in enumerate(ems):
        sx, sy = car_x(c, te) - 96, WHEEL_Y - 15
        dots.append(dict(i=i, kind='nox' if i % 2 == 0 else 'voc', te=te, car=c, sx=sx, sy=sy, tx=pts[i][0], ty=pts[i][1],
                         ph=rnd.uniform(0, 6.28), rank=order[i]))
    # ozone sites: two rows of five, the rows offset (a hex grid inside the cloud)
    sites = [(300 + 80 * k, 136) for k in range(5)] + [(340 + 80 * k, 188) for k in range(5)]
    o_order = list(range(N_O3)); rnd.shuffle(o_order)
    o3s = [dict(i=j, x=x, y=y, ta=S3 + 0.9 + 0.17 * o_order[j], ph=rnd.uniform(0, 6.28)) for j, (x, y) in enumerate(sites)]
    ST.update(dots=dots, o3s=o3s, last_arrival=max(d['te'] for d in dots) + T_RISE)


def car_x(c, t):
    u = clamp((t - CAR_D[c]) / CAR_DUR)
    return CAR_X[c] - (CAR_X[c] - X_START) * (1 - u) ** 3


# ------------------------------------------------------------------------------------------------ the still scenery (drawn once)
def build_base():
    im = A.canvas(W, H, DARK)
    im.alpha_composite(A.vgrad(W, SKY_BASE, [(0, '7FCBE5'), (0.5, 'BCE3F0'), (0.85, 'E8F3F8'), (1, 'F2F7FA')]), (0, 0))
    rnd = random.Random(3)
    sp = Sp(0, 0, W, SCENE_B)
    # the sun, with a soft glow and short ticks
    sx, sy = SUN_XY
    for r, a in ((70, 0.16), (58, 0.24), (48, 0.34)): sp.circle(sx, sy, r, fill=('FFF3B0', a))
    for k in range(12):
        ang = k * math.pi / 6
        sp.line([(sx + 54 * math.cos(ang), sy + 54 * math.sin(ang)), (sx + 66 * math.cos(ang), sy + 66 * math.sin(ang))], SUN, 4, caps=True)
    sp.circle(sx, sy, SUN_R, fill=SUN, outline='D9A21F', width=3)
    # the skyline: a lighter row behind, a darker row in front, two towers with aerials
    def row(col, hmin, hmax, wmin, wmax, seed, windows):
        r = random.Random(seed)
        x = -12
        while x < W + 10:
            w, h = r.randint(wmin, wmax), r.randint(hmin, hmax)
            sp.rect(x, SKY_BASE - h, x + w, SKY_BASE + 2, fill=col)
            if windows:
                for wy in range(int(SKY_BASE - h + 10), SKY_BASE - 12, 17):
                    for wx in range(int(x + 7), int(x + w - 9), 14):
                        if r.random() < 0.55: sp.rect(wx, wy, wx + 6, wy + 8, fill='5B7490')
            x += w + r.randint(0, 6)
    row('5D7894', 66, 118, 44, 84, 11, False)
    for tx, th in ((110, 135), (800, 128)):
        sp.rect(tx - 24, SKY_BASE - th, tx + 24, SKY_BASE + 2, fill='4C6580')
        sp.line([(tx, SKY_BASE - th), (tx, SKY_BASE - th - 22)], '4C6580', 3)
    row('3C506B', 40, 92, 40, 78, 29, True)
    # pavement and road
    sp.rect(0, SKY_BASE, W, 386, fill='9AA7B5')
    sp.rect(0, 386, W, SCENE_B, fill='3A4658')
    sp.rect(0, SKY_BASE, W, SKY_BASE + 4, fill='7D8B9B')
    for x in range(-20, W, 90): sp.rect(x, 435, x + 52, 440, fill=('F2F7FA', 0.75), r=2)
    sp.blit(im)
    BASE['img'] = im
    BASE['haze'] = A.alpha_grad(W, SCENE_B - 150, HAZE, [(0, 0.0), ((260 - 150) / 294, 0.30), ((SKY_BASE - 150) / 294, 0.64), (1, 0.50)])
    # one car body per car (the wheels are drawn each frame, because they turn)
    for c in range(3):
        body, shade = CAR_COL[c]
        s = Sp(-110, -80, 110, 20)
        s.rect(-86, -44, 86, -12, fill=body, outline=INK, width=2.6, r=11)
        s.poly([(-46, -44), (-30, -68), (34, -68), (60, -44)], fill=body, outline=INK, width=2.6)
        s.poly([(-39, -47), (-27, -64), (-4, -64), (-4, -47)], fill='CFE8F5', outline=INK, width=1.8)
        s.poly([(4, -47), (4, -64), (30, -64), (50, -47)], fill='CFE8F5', outline=INK, width=1.8)
        s.line([(0, -44), (0, -14)], shade, 2)
        s.rect(80, -40, 87, -31, fill=SUN, outline=INK, width=1.4, r=2)
        s.rect(-87, -40, -81, -31, fill=ALERT, outline=INK, width=1.2, r=2)
        s.rect(-98, -19, -84, -12, fill='4A5563', outline=INK, width=1.6, r=2)               # the exhaust pipe
        for wx in (-50, 52): s.circle(wx, -17, 22, fill=INK)                                  # wheel arches
        BASE['car%d' % c] = s


def draw_car(img, c, t):
    x = car_x(c, t)
    moving = clamp((t - CAR_D[c]) / CAR_DUR) < 1
    bob = 1.1 * math.sin(9 * t + c) * (1 - clamp((t - CAR_D[c]) / CAR_DUR)) if moving else 0.0
    idle = 0.5 * math.sin(2 * math.pi * 11 * t + c) if (not moving and t < ST['last_arrival'] + 1.0) else 0.0
    y = WHEEL_Y + bob + idle
    BASE['car%d' % c].blit(img, dx=x, dy=y)
    sp = Sp(x - 80, y - 40, x + 80, y + 2)
    ang = (x - X_START) / 17.0
    for wx in (-50, 52):
        cx, cy = x + wx, y - 17
        sp.circle(cx, cy, 17, fill='1B2430', outline=INK, width=1.5)
        sp.circle(cx, cy, 9, fill='AEB9C5', outline=INK, width=1.4)
        for k in range(4):
            a = ang + k * math.pi / 2
            sp.line([(cx, cy), (cx + 8 * math.cos(a), cy + 8 * math.sin(a))], '5D6B7A', 2)
        sp.circle(cx, cy, 2.6, fill=INK)
    sp.blit(img)


# ------------------------------------------------------------------------------------------------ the changing parts
def dot_xy(d, t):
    u = clamp((t - d['te']) / T_RISE)
    ey = 1 - (1 - u) ** 2.2
    ex = ease(u)
    x = lerp(d['sx'], d['tx'], ex) + 11 * math.sin(2 * math.pi * 1.2 * u + d['ph']) * (1 - u) * u * 2
    y = lerp(d['sy'], d['ty'], ey)
    b = ease(u)
    return x + 2.6 * b * math.sin(1.5 * t + d['ph']), y + 2.6 * b * math.cos(1.2 * t + 1.7 * d['ph'])


def cloud_alpha(t):
    arrived = sum(1 for d in ST['dots'] if t >= d['te'] + T_RISE * 0.8)
    return 0.22 + 0.55 * clamp(arrived / 12.0)


def draw_blob(img, t):
    """The gas cloud: a pale, see-through white shape with one edge round the whole (the outline is the union of the circles)."""
    a = cloud_alpha(t)
    sp = Sp(190, 60, 740, 260)
    for (cx, cy, r) in CLOUD_CIRCLES: sp.circle(cx, cy, r + 2.5, fill=(WHITE, 0.9))
    for (cx, cy, r) in CLOUD_CIRCLES: sp.circle(cx, cy, r, fill=(WHITE, 0.55))
    sp.blit(img, a)


RAY_TARGETS = ((320, 118), (395, 152), (468, 184), (545, 208), (620, 228))


def draw_rays(img, t):
    """Five pale yellow beams from the sun to the cloud. They grow out one after another, right to left: a sweep."""
    if t < S2 + 0.3: return
    sx, sy = SUN_XY
    sp = Sp(200, 20, 900, 270)
    for k, (tx, ty) in enumerate(reversed(RAY_TARGETS)):
        f = ease((t - (S2 + 0.3 + 0.2 * k)) / 0.8)
        if f <= 0: continue
        L = math.hypot(tx - sx, ty - sy)
        ux, uy = (tx - sx) / L, (ty - sy) / L
        px, py = -uy, ux
        d0, d1 = SUN_R + 6, SUN_R + 6 + f * (L - SUN_R - 6)
        w0, w1 = 4, 4 + 13 * f
        dm = lerp(d0, d1, 0.8)                                                      # the beam narrows to a point at its far end
        wm = lerp(w0, w1, 0.8)
        sp.poly([(sx + ux * d0 + px * w0, sy + uy * d0 + py * w0), (sx + ux * dm + px * wm, sy + uy * dm + py * wm), (sx + ux * d1, sy + uy * d1),
                 (sx + ux * dm - px * wm, sy + uy * dm - py * wm), (sx + ux * d0 - px * w0, sy + uy * d0 - py * w0)], fill=('FFE680', 1.0))
    shimmer = 0.58 + 0.07 * math.sin(2 * math.pi * 0.8 * t)
    keep = 1.0 if t < S3 else lerp(1.0, 0.7, ease((t - S3) / 1.0))                 # the sun keeps shining on the gases in steps 3 and 4
    sp.blit(img, shimmer * keep)


def draw_exhaust_puffs(img, t):
    sp = Sp(0, 330, 800, 445)
    for d in ST['dots']:
        u = (t - d['te']) / 0.8
        if 0 <= u < 1:
            r = 5 + 10 * u
            sp.circle(d['sx'] - 14 * u, d['sy'] - 8 * u, r, fill=('D7DFE7', 0.85 * (1 - u)))
    sp.blit(img)


def draw_legend(img, t):
    def icon_nox(sp, cx, cy): A.nox(sp, cx, cy, 0.95)
    def icon_voc(sp, cx, cy): A.voc(sp, cx, cy, 0.78)
    def icon_o3(sp, cx, cy): A.o3(sp, cx, cy, 0.62)
    a1, a2 = ease((t - 1.0) / 0.4), ease((t - 1.2) / 0.4)
    fa = 1 - 0.55 * ease((t - S3) / 0.6)                                      # NOx and VOC are used up in step 3
    A.label_chip(img, 16, 12, ['NOx'], [28], [INK], a1 * fa, icon=icon_nox, icon_w=26)
    A.label_chip(img, 152, 12, ['VOC'], [28], [INK], a2 * fa, icon=icon_voc, icon_w=30)
    A.label_chip(img, 288, 12, ['O₃'], [28], [INK], ease((t - (S3 + 0.8)) / 0.4), icon=icon_o3, icon_w=34)


def draw_gas(img, t):
    """All the dots, their halos and the ozone molecules in one patch."""
    sp = Sp(0, 40, 800, 445)
    dots = ST['dots']
    sun = ease((t - (S2 + 0.9)) / 0.7)                                        # the dots wobble and glow once the light reaches them
    wob = 4.2 * sun
    live = []
    for d in dots:
        if t < d['te']: continue
        x, y = dot_xy(d, t)
        arrived = clamp((t - d['te']) / T_RISE)
        k = ease((t - d['te']) / 0.3)
        if t >= S3:                                                           # step 3: shrink away, one after another
            tv = S3 + 0.5 + 1.9 * d['rank'] / (len(dots) - 1)
            u = (t - tv) / 0.5
            if u >= 1: continue
            k *= 1 - ease(u)
            if 0 <= u < 1: live.append(('flash', x, y, u))
        if wob > 0:
            x += wob * math.sin(2 * math.pi * 3.1 * t + d['ph']) * arrived
            y += wob * math.cos(2 * math.pi * 2.6 * t + 1.3 * d['ph']) * arrived
        g = sun * (1 - ease((t - S3) / 1.6)) * arrived
        live.append((d['kind'], x, y, k, g, d))
    for it in live:                                                           # halos first, so no shape is covered by a neighbour's glow
        if it[0] in ('nox', 'voc') and it[4] > 0.01:
            _, x, y, k, g, d = it
            A.glow(sp, x, y, 13 * k + 2.6 * math.sin(2 * math.pi * 1.7 * t + d['ph']), g)
    for it in live:
        if it[0] == 'nox': A.nox(sp, it[1], it[2], it[3])
        elif it[0] == 'voc': A.voc(sp, it[1], it[2], it[3])
        elif it[0] == 'flash':
            _, x, y, u = it
            sp.circle(x, y, 14 + 16 * u, outline=('FFFFFF', 0.9 * (1 - u)), width=3, blend=True)
    for m in ST['o3s']:
        u = (t - m['ta']) / 0.45
        if u <= 0: continue
        k = 1.2 * pop(u)
        x, y = m['x'] + 2.2 * math.sin(1.3 * t + m['ph']), m['y'] + 2.2 * math.cos(1.1 * t + m['ph'])
        if u < 1.2: sp.circle(m['x'], m['y'], 16 + 22 * clamp(u), outline=('FFFFFF', 0.8 * (1 - clamp(u))), width=3)
        A.o3(sp, x, y, k, 0.12 * math.sin(0.9 * t + m['ph']))
    sp.blit(img)


def o3_pos(j, t):
    m = ST['o3s'][j]
    return m['x'] + 2.2 * math.sin(1.3 * t + m['ph']), m['y'] + 2.2 * math.cos(1.1 * t + m['ph'])


def draw_o3_labels(img, t):
    a = ease((t - (S3 + 2.9)) / 0.4)
    if a <= 0: return
    for j, (cx, cy, side) in ((0, (186, 140, 'l')), (4, (752, 152, 'r'))):
        x, y = o3_pos(j, t)
        if side == 'l': A.leader(img, cx + 36, cy, x - 36, y, INK, 2.6, a)
        else: A.leader(img, cx - 36, cy, x + 36, y, INK, 2.6, a)
        A.label_chip(img, cx, cy - 22, ['O\u2083'], [30], [INK], a, anchor='tc', outline=OZONE)


def draw_haze(img, t):
    a = ease((t - (S3 + 0.5)) / 3.0)
    if a <= 0.004: return
    h = BASE['haze']
    img.alpha_composite(A.fade(h.copy(), a), (0, 150 * SS))


def draw_step4(img, t):
    j = 7                                                                     # the ringed molecule (second row, third from the left)
    x, y = o3_pos(j, t)
    ra = ease((t - (S4 + 0.4)) / 0.4)
    if ra > 0:
        sp = Sp(x - 60, y - 60, x + 60, y + 60)
        pulse = 1 + 0.07 * math.sin(2 * math.pi * 1.1 * t)
        sp.circle(x, y, 33 * pulse, outline=(WHITE, 1.0), width=9)
        sp.circle(x, y, 33 * pulse, outline=ALERT, width=5.5)
        sp.blit(img, ra)
    ca = ease((t - (S4 + 0.9)) / 0.4)
    la = ease((t - (S4 + 2.6)) / 0.5)
    if ca > 0:
        A.leader(img, x + 6, y + 36, 534, 256, INK, 2.8, ca, dot=False)
        A.label_chip(img, 520, 256, ['ground-level ozone', 'harms the lungs'], [30, 26], [INK, (ALERT, la)], ca, outline=ALERT)


# ------------------------------------------------------------------------------------------------ the frame
def frame(t):
    img = BASE['img'].copy()
    draw_blob(img, t)
    draw_haze(img, t)
    draw_rays(img, t)
    for c in range(3): draw_car(img, c, t)
    draw_exhaust_puffs(img, t)
    draw_gas(img, t)
    draw_legend(img, t)
    draw_o3_labels(img, t)
    if t >= S4: draw_step4(img, t)
    A.step_captions(img, CAPS, (0.0, S2, S3, S4), t)
    return A.finish(img)


def init():
    plan()
    build_base()


if __name__ == '__main__':
    A.encode(frame, TOTAL, NAME, COVER_T, init=init)
