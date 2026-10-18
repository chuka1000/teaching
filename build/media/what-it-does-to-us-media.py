#!/usr/bin/env python3
"""
What It Does To Us: the acid rain animation, the particle-size picture and the haemoglobin picture (Y9 Science, Human Actions and the
Atmosphere). PIL + ffmpeg, silent, 'Upper Air' palette.

  atm-acid-rain.mp4/png   How acid rain forms and what it damages.  960 x 540, 20 fps, 26 s, and it PAUSES (about 2 s) on every finished step.
                          A coal power station on the left, a white cloud, a lake with two fish, a conifer and a stone building on the right
                          bank, and a pH meter at the lake. The whole scene is there from the start; the steps change it:
                            1  Burning coal that contains sulfur makes sulfur dioxide, SO2.   (yellow SO2 molecules, a few orange NOx, leave the chimney)
                            2  The gases rise and dissolve in cloud water.                    (they drift into the cloud and are absorbed; the droplets tint pale red)
                            3  They turn into sulfuric acid and nitric acid.                  (two droplets swell and are labelled H2SO4 and HNO3)
                            4  Acid rain falls.                                               (red-tinted rain; pH 7.0 -> 4.5; the fish fade out; the building's
                                                                                               carving wears away; the conifer's needles turn brown and fall)
                                                                                               then three labels: lakes, trees, buildings.
  atm-particles.png        Particle sizes drawn to scale: a human hair (70 um) beside PM10 (10 um) and PM2.5 (2.5 um), with a scale bar.   1100 x 620
  atm-haemoglobin.png      Two panels, Normal and Carbon monoxide: oxygen sits in the four sockets of haemoglobin, or CO takes them.        1100 x 620

The science it keeps straight:
  - the pH figures (7.0 to 4.5) are an illustration, not data: the picture says 'pH' and nothing about a real lake.
  - SO2 from burning coal and NOx from burning fuel dissolve in cloud water and are turned into sulfuric and nitric acid: no equations.
  - the lake is not made muddy. Acidified lakes are often clear, because the life in them has gone, so the water is left alone and the fish fade.
  - the particles are drawn to ONE scale (5.2 px per um): 70 : 10 : 2.5. PM2.5 is a small dot beside a hair, and that is the point.
  - in the haemoglobin picture, the CO sits in the four sockets and the O2 outside cannot get in. No equations, no numbers.
  - shape and label, not colour alone: the molecules are drawn with shape (one big circle and two small ones; a circle) and named in chips.

    python3 build/media/what-it-does-to-us-media.py              # the two pictures and the film (assets/pictures, assets/media)
    python3 build/media/what-it-does-to-us-media.py --pictures   # just the two pictures
    python3 build/media/what-it-does-to-us-media.py --stills 5.8 20   # just those film frames as PNGs in the temp folder (ANIM_TMP)
"""
import math, pathlib, random, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import atm_draw as A
from atm_draw import (W, H, SS, DARK, ACCENT, ACCENT_INK, GREEN, ALERT, TINT, TINT_DEEP, INK, INK_SOFT, WHITE, SUN, HAZE, OZONE, NOX, SULFUR,
                      Sp, clamp, ease, lerp, mix, pop, tw)

NAME = 'atm-acid-rain'
S2, S3, S4, TOTAL = 6.6, 12.8, 16.2, 26.2             # the start of each step; the film length
COVER_T = 5.8                                         # the cover: end of step 1 (the scene, and the gas leaving the chimney; no answer on it)
CAPS = {1: ['Burning coal that contains sulfur', 'makes sulfur dioxide, SO₂.'],
        2: ['The gases rise and dissolve', 'in cloud water.'],
        3: ['They turn into sulfuric acid', 'and nitric acid.'],
        4: ['Acid rain falls.']}
A.check_caption_widths(CAPS)

GY = 340                                              # the ground line
LAKE_X0, LAKE_X1 = 345, 645
CHIM = (140, 130)                                     # the chimney mouth
TREE_X, BLD_X = 700, 835
CLOUD_CIRCLES = [(430, 112, 38), (485, 88, 46), (555, 76, 50), (628, 78, 50), (695, 92, 46), (750, 112, 36)]
CLOUD_BASE = (415, 98, 775, 142)                      # a rounded slab under the bumps: the flat underside
BLOBS = [dict(x=505, y=104, text='H₂SO₄'), dict(x=682, y=104, text='HNO₃')]
SLOTS_A = [(196, 82), (256, 82), (316, 82), (376, 82)]
SLOTS_B = [(172, 124), (232, 124), (292, 124), (352, 124)]
KINDS = ['so2', 'so2', 'nox', 'so2', 'so2', 'nox', 'so2', 'nox']
T_RISE = 1.6
BASE, SPR, ST = {}, {}, {}


# ------------------------------------------------------------------------------------------------ the plan (all fixed numbers)
def in_cloud(x, y, m=0):
    if any(math.hypot(x - cx, y - cy) <= r - m for cx, cy, r in CLOUD_CIRCLES): return True
    x0, y0, x1, y1 = CLOUD_BASE
    return x0 + m <= x <= x1 - m and y0 + m <= y <= y1 - m


def plan():
    rnd = random.Random(5)
    drops = []                                        # the tiny droplets that fill the cloud, on a staggered grid
    row = 0
    for y in range(52, 140, 25):
        for x in range(380 + (15 if row % 2 else 0), 800, 30):
            if in_cloud(x, y, 12) and min([math.hypot(x - b['x'], y - b['y']) for b in BLOBS]) > 20:
                drops.append(dict(x=x + rnd.uniform(-3, 3), y=y + rnd.uniform(-3, 3), ph=rnd.uniform(0, 6.28),
                                  t_tint=S2 + 1.0 + 2.2 * (x - 380) / 420 + rnd.uniform(0, 0.3)))
        row += 1
    slots = []
    for i in range(4): slots += [SLOTS_B[i], SLOTS_A[i]]
    gas = []
    for k, (kind, (sx, sy)) in enumerate(zip(KINDS, slots)):
        gas.append(dict(k=k, kind=kind, sx=sx, sy=sy, te=0.8 + 0.3 * k, ph=rnd.uniform(0, 6.28), rot=rnd.uniform(-0.2, 0.2)))
    order = sorted(gas, key=lambda g: -g['sx'])        # the ones nearest the cloud set off first
    for rank, g in enumerate(order):
        b = BLOBS[0] if g['kind'] == 'so2' else BLOBS[1]
        ang, rr = rnd.uniform(0, 6.28), rnd.uniform(0, 40)
        g['tx'], g['ty'] = b['x'] + rr * math.cos(ang), b['y'] + 0.5 * rr * math.sin(ang)
        g['td'] = S2 + 0.4 + 0.2 * rank
    # rain: spawn times and places, falling with a slant
    rain = []
    for m in range(230):
        rain.append(dict(x0=rnd.uniform(430, 785), ts=S4 + 0.6 + rnd.uniform(0, 3.6), ph=rnd.uniform(0, 6.28)))
    needles = [dict(x=TREE_X + rnd.uniform(-34, 34), y=GY - rnd.uniform(40, 120), t0=S4 + 2.0 + 0.16 * n, ph=rnd.uniform(0, 6.28)) for n in range(18)]
    fish = [dict(x0=455, y0=382, amp=45, f=0.42, ph=0.5), dict(x0=555, y0=402, amp=40, f=0.35, ph=2.4)]
    ST.update(drops=drops, gas=gas, rain=rain, needles=needles, fish=fish)


# ------------------------------------------------------------------------------------------------ the scenery, drawn once
def build_base():
    im = A.canvas(W, H, DARK)
    im.alpha_composite(A.vgrad(W, GY, [(0, 'A5D9EC'), (0.6, 'D2EAF3'), (1, 'EEF6F9')]), (0, 0))
    sp = Sp(0, 0, W, 444)
    # ground
    sp.rect(0, GY, W, 444, fill='B8D3AA')
    sp.rect(0, GY, W, GY + 7, fill='6FA67E')
    for x in range(8, W, 46): sp.line([(x, GY + 20), (x + 9, GY + 16)], '9CC08F', 3, caps=True)
    # the lake: a cross-section, with the water level at the ground line
    lake = [(LAKE_X0, GY), (LAKE_X0 + 8, GY + 46), (LAKE_X0 + 36, GY + 80), (LAKE_X1 - 36, GY + 80), (LAKE_X1 - 8, GY + 46), (LAKE_X1, GY)]
    sp.poly(lake, fill='5DB4DA', outline=INK, width=2.8)
    sp.poly([(LAKE_X0 + 3, GY + 3), (LAKE_X1 - 3, GY + 3), (LAKE_X1 - 5, GY + 14), (LAKE_X0 + 5, GY + 14)], fill='8FD0EA')
    for x, y in ((380, 360), (430, 418), (505, 360), (590, 372), (610, 410), (396, 392)):
        sp.line([(x, y), (x + 12, y - 3), (x + 24, y)], '8FD0EA', 3, caps=True)
    # the power station
    sp.rect(8, 268, 122, GY, fill='7D8CA0', outline=INK, width=2.6)
    sp.rect(8, 258, 122, 270, fill='55667A', outline=INK, width=2.4)
    sp.rect(66, 226, 122, 262, fill='6E7F93', outline=INK, width=2.6)
    for x in (18, 42, 66, 90): sp.rect(x, 288, x + 16, 308, fill='CFE8F5', outline=INK, width=1.8)
    sp.rect(96, 312, 114, GY, fill='3E4C5E', outline=INK, width=1.8)
    sp.poly([(120, GY), (160, GY), (150, CHIM[1]), (130, CHIM[1])], fill='D8DEE5', outline=INK, width=2.6)
    for y0, y1, col in ((CHIM[1] + 6, CHIM[1] + 34, ALERT), (CHIM[1] + 62, CHIM[1] + 90, ALERT), (CHIM[1] + 118, CHIM[1] + 146, ALERT)):
        w0 = 10 + 10 * (y0 - CHIM[1]) / (GY - CHIM[1]); w1 = 10 + 10 * (y1 - CHIM[1]) / (GY - CHIM[1])
        sp.poly([(140 - w0, y0), (140 + w0, y0), (140 + w1, y1), (140 - w1, y1)], fill=col)
    sp.poly([(120, GY), (160, GY), (150, CHIM[1]), (130, CHIM[1])], outline=INK, width=2.6)
    sp.rect(126, CHIM[1] - 6, 154, CHIM[1] + 2, fill='3E4C5E', outline=INK, width=2, r=2)
    # coal
    sp.poly([(158, GY), (166, GY - 14), (176, GY - 22), (186, GY - 18), (194, GY - 12), (202, GY)], fill='1C2733', outline=INK, width=2)
    for x, y in ((172, GY - 9), (184, GY - 8), (192, GY - 4), (178, GY - 16)): sp.circle(x, y, 2.6, fill='4A5B6E')
    # labels on the ground
    sp.text(65, 366, 'power', 26, INK, 'mm')
    sp.text(65, 394, 'station', 26, INK, 'mm')
    sp.text(180, 372, 'coal', 26, INK, 'mm')
    # the pH meter: a panel on the shore, a probe into the water
    px0, py0, px1, py1 = 210, 150, 336, GY - 2
    sp.line([(px1 - 4, py1 - 16), (px1 + 18, GY + 36)], INK, 3, caps=True)
    sp.circle(px1 + 18, GY + 36, 6, fill=ACCENT, outline=INK, width=2)
    sp.rect(px0, py0, px1, py1, fill=WHITE, outline=INK, width=2.8, r=12)
    sp.text((px0 + px1) / 2, 171, 'pH', 28, INK, 'mm')
    sp.text(px0 + 62, 316, 'acid', 26, ALERT, 'lm')
    sp.blit(im)
    bar = A.vgrad(28, 96, [(0, '2A6FA8'), (0.33, '23A06B'), (0.5, 'B5CF5A'), (0.66, 'F6C445'), (0.83, 'E8833A'), (1, 'C2432E')])
    im.alpha_composite(bar, (222 * SS, 228 * SS))
    sp2 = Sp(0, 0, W, 444)
    sp2.rect(222, 228, 250, 324, outline=INK, width=2.4)
    for ph in (4, 5, 6, 7, 8):
        y = 324 - (ph - 3) * 16
        sp2.line([(250, y), (256, y)], INK, 2)
    sp2.blit(im)
    BASE['img'] = im
    # the cloud (the union of the bumps and the slab, with one outline)
    c = Sp(380, 10, 800, 160)
    x0, y0, x1, y1 = CLOUD_BASE
    for (cx, cy, r) in CLOUD_CIRCLES: c.circle(cx, cy, r + 3, fill='A5BFD0')
    c.rect(x0 - 3, y0 - 3, x1 + 3, y1 + 3, fill='A5BFD0', r=26)
    for (cx, cy, r) in CLOUD_CIRCLES: c.circle(cx, cy, r, fill=WHITE)
    c.rect(x0, y0, x1, y1, fill=WHITE, r=23)
    SPR['cloud'] = c
    SPR['tree0'], SPR['tree1'] = tree_sprite(False), tree_sprite(True)
    SPR['bld0'], SPR['bld1'] = building_sprite(False), building_sprite(True)


def jag(pts, amp, seed, step=7.0, inward=0.0):
    """Roughen a closed outline: add points along each edge and push them about by amp (worn stone, ragged needles)."""
    r = random.Random(seed)
    out = []
    n = len(pts)
    for i in range(n):
        (ax, ay), (bx, by) = pts[i], pts[(i + 1) % n]
        L = math.hypot(bx - ax, by - ay)
        m = max(1, int(L / step))
        for j in range(m):
            u = j / m
            out.append((lerp(ax, bx, u) + r.uniform(-amp, amp), lerp(ay, by, u) + r.uniform(-amp, amp)))
    return out


def tree_sprite(dmg):
    """A conifer: three tiers of needles. Damaged: brown, ragged, thinner, with bare branches showing."""
    cx = TREE_X
    sp = Sp(cx - 70, GY - 140, cx + 70, GY + 4)
    sp.rect(cx - 7, GY - 28, cx + 7, GY, fill='6B5136' if dmg else '7A5A3A', outline=INK, width=2.2)
    tiers = [(GY - 72, GY - 20, 50), (GY - 100, GY - 52, 41), (GY - 127, GY - 84, 31)]
    r = random.Random(4)
    for ti, (ya, yb, hw) in enumerate(tiers):
        pts = []
        n = 6
        for i in range(n + 1):                                                   # the left edge, with teeth
            u = i / n
            x, y = lerp(cx, cx - hw, u), lerp(ya, yb, u)
            pts.append((x - (4 if i % 2 else 0) - (r.uniform(0, 9) if dmg and 0 < i < n else 0) * (-1), y))
        for i in range(1, 8):                                                    # the underside, with teeth
            u = i / 8
            pts.append((lerp(cx - hw, cx + hw, u), yb + (5 if i % 2 else -1) + (r.uniform(-3, 5) if dmg else 0)))
        for i in range(n, -1, -1):
            u = i / n
            x, y = lerp(cx, cx + hw, u), lerp(ya, yb, u)
            pts.append((x + (4 if i % 2 else 0) + (r.uniform(0, 9) if dmg and 0 < i < n else 0) * (-1), y))
        sp.poly(pts, fill='A07F40' if dmg else GREEN, outline=INK, width=2.2)
        for k in range(5):                                                       # needle strokes
            u = (k + 0.5) / 5
            xx, yy = lerp(cx - hw * 0.72, cx + hw * 0.72, u), lerp(ya + 10, yb - 4, 0.35 + 0.5 * ((k * 7) % 5) / 4)
            sp.line([(xx, yy), (xx + (3 if k % 2 else -3), yy + 9)], '5E4A24' if dmg else '17604A', 2.2, caps=True)
        if dmg:                                                                  # bare branches showing through
            for k in range(3):
                u = (k + 1) / 4
                sp.line([(cx, lerp(ya + 8, yb - 6, 0.5)), (lerp(cx - hw * 0.8, cx + hw * 0.8, u), yb - 3 - 4 * (k % 2))], '4A3720', 2.2, caps=True)
    return sp


def building_sprite(worn):
    """A small stone building with columns, a carved frieze and a pediment with an emblem. Worn: the carving gone, the edges rounded and chipped, stained."""
    cx = BLD_X
    sp = Sp(cx - 80, GY - 124, cx + 80, GY + 4)
    stone, stone2, line = ('B9BDC1', 'A9ADB2', '8E9298') if worn else ('E4E8EC', 'CBD1D8', 'B5BDC6')
    r = random.Random(9)

    def block(x0, y0, x1, y1, fill, amp=0.0):
        pts = [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]
        sp.poly(jag(pts, amp, r.randint(0, 999), 6.0) if worn else pts, fill=fill, outline=INK, width=2.0)
    block(cx - 64, GY - 8, cx + 64, GY, stone2, 1.4)
    block(cx - 58, GY - 16, cx + 58, GY - 8, stone2, 1.4)
    sp.rect(cx - 56, GY - 60, cx + 56, GY - 16, fill='8D99A8')                                  # the dark wall behind the columns
    for x in (-42, -14, 14, 42):
        if worn:
            sp.poly([(cx + x - 7, GY - 60), (cx + x + 7, GY - 60), (cx + x + 5.5, GY - 38), (cx + x + 7, GY - 16), (cx + x - 7, GY - 16), (cx + x - 5.5, GY - 38)],
                    fill=stone, outline=INK, width=2.0)
        else:
            sp.rect(cx + x - 7, GY - 60, cx + x + 7, GY - 16, fill=stone, outline=INK, width=1.8)
            sp.rect(cx + x - 9, GY - 64, cx + x + 9, GY - 60, fill=stone2, outline=INK, width=1.4)
            sp.rect(cx + x - 9, GY - 20, cx + x + 9, GY - 16, fill=stone2, outline=INK, width=1.4)
            for dx in (-2.4, 2.4): sp.line([(cx + x + dx, GY - 57), (cx + x + dx, GY - 22)], line, 1.2)
    block(cx - 60, GY - 76, cx + 60, GY - 64, stone2, 1.6)
    if not worn:
        for x in range(-54, 56, 9): sp.rect(cx + x, GY - 72, cx + x + 5, GY - 67, fill=line)          # dentils
    tri = [(cx - 66, GY - 76), (cx, GY - 108), (cx + 66, GY - 76)]
    sp.poly(jag(tri, 1.8, 5, 6.0) if worn else tri, fill=stone, outline=INK, width=2.2)
    if worn:
        sp.circle(cx, GY - 86, 8, fill=stone2)                                                     # the emblem has softened to a smudge
    else:
        sp.poly([(cx - 52, GY - 80), (cx, GY - 101), (cx + 52, GY - 80)], outline=line, width=1.6)
        star = []
        for k in range(10):
            a = -math.pi / 2 + k * math.pi / 5
            rr = 9 if k % 2 == 0 else 4.2
            star.append((cx + rr * math.cos(a), GY - 87 + rr * math.sin(a)))
        sp.poly(star, fill='D9B72B', outline=INK, width=1.4)
    if worn:                                                                                       # stains running down from the roof line
        for x, ln in ((-50, 38), (-26, 24), (4, 44), (30, 30), (54, 36)):
            sp.line([(cx + x, GY - 64), (cx + x + 2, GY - 64 + ln)], ('5E564B', 0.45), 5, caps=True, blend=True)
        for x, y, rad in ((-34, -40, 6), (30, -44, 5)): sp.circle(cx + x, GY + y + 6, rad, fill=('5E564B', 0.2), blend=True)
    return sp


# ------------------------------------------------------------------------------------------------ the changing parts
def gas_state(g, t):
    """(x, y, scale) of a gas molecule, or None. Step 1: it leaves the chimney and settles in its slot. Step 2: it drifts into the cloud and is absorbed."""
    if t < g['te']: return None
    u = clamp((t - g['te']) / T_RISE)
    x = lerp(CHIM[0], g['sx'], ease(u))
    y = lerp(CHIM[1] - 6, g['sy'], 1 - (1 - u) ** 2) - 10 * math.sin(math.pi * u)
    k = 0.45 + 0.55 * ease(u)
    b = ease(u)
    x, y = x + 2.4 * b * math.sin(1.4 * t + g['ph']), y + 2.4 * b * math.cos(1.1 * t + g['ph'])
    if t >= g['td']:
        v = clamp((t - g['td']) / 1.5)
        x0 = g['sx'] + 2.4 * math.sin(1.4 * g['td'] + g['ph']); y0 = g['sy'] + 2.4 * math.cos(1.1 * g['td'] + g['ph'])
        x, y = lerp(x0, g['tx'], ease(v)), lerp(y0, g['ty'], ease(v)) - 14 * math.sin(math.pi * v)
        k = 1.0 - 0.9 * ease((v - 0.5) / 0.5)
        if v >= 1: return None
    return x, y, k


def draw_plume(img, t):
    sp = Sp(110, 20, 800, 170)
    for g in ST['gas']:                                                       # the smoke puff at the chimney mouth, as each molecule leaves
        u = (t - g['te']) / 0.9
        if 0 <= u < 1: sp.circle(CHIM[0] + 6 * u, CHIM[1] - 8 - 20 * u, 7 + 12 * u, fill=('D3DAE1', 0.85 * (1 - u)))
    for g in ST['gas']:
        s = gas_state(g, t)
        if not s: continue
        x, y, k = s
        if g['kind'] == 'so2': A.so2(sp, x, y, 0.85 * k, g['rot'])
        else: A.nox(sp, x, y, 0.85 * k)
    sp.blit(img)


def draw_cloud(img, t):
    SPR['cloud'].blit(img)
    sp = Sp(380, 10, 800, 160)
    for d in ST['drops']:
        u = ease((t - d['t_tint']) / 0.6)
        x, y = d['x'] + 1.6 * math.sin(0.9 * t + d['ph']), d['y'] + 1.4 * math.cos(0.8 * t + d['ph'])
        sp.circle(x, y, 7.5, fill=mix('D6ECF7', 'F4B5AA', u), outline=mix('8DB6CC', ALERT, u), width=1.8)
    for g in ST['gas']:                                                       # a ring where a molecule is absorbed
        u = (t - (g['td'] + 1.5)) / 0.6
        if 0 <= u < 1: sp.circle(g['tx'], g['ty'], 10 + 22 * u, outline=(ALERT, 0.7 * (1 - u)), width=3, blend=True)
    for i, b in enumerate(BLOBS):                                             # step 3: two droplets swell and take their names
        u = pop((t - (S3 + 0.4 + 0.2 * i)) / 0.6, 1.2)
        if u <= 0.02: continue
        w, h = (tw(b['text'], 30) + 34) * u, 62 * u
        sp.rect(b['x'] - w / 2, b['y'] - h / 2, b['x'] + w / 2, b['y'] + h / 2, fill='F8C9C0', outline=ALERT, width=3.4, r=h / 2)
        sp.text(b['x'], b['y'] + 1, b['text'], 30, INK, 'mm') if u > 0.9 else None
    sp.blit(img)


def draw_legend(img, t):
    fa = ease((t - 0.7) / 0.4) * (1 - ease((t - (S3 + 0.2)) / 0.5))
    def icon_so2(sp, cx, cy): A.so2(sp, cx, cy, 0.52)
    def icon_nox(sp, cx, cy): A.nox(sp, cx, cy, 0.95)
    A.label_chip(img, 16, 12, ['SO₂'], [28], [INK], fa, icon=icon_so2, icon_w=36)
    A.label_chip(img, 160, 12, ['NOx'], [28], [INK], fa, icon=icon_nox, icon_w=26)


def fish_pos(f, t):
    x = f['x0'] + f['amp'] * math.sin(f['f'] * t + f['ph'])
    d = 1 if math.cos(f['f'] * t + f['ph']) >= 0 else -1
    return x, f['y0'] + 5 * math.sin(0.9 * t + f['ph']), d


def draw_fish(img, t, alpha):
    if alpha <= 0.01: return
    for f in ST['fish']:
        x, y, d = fish_pos(f, t)
        sp = Sp(x - 52, y - 30, x + 52, y + 30)
        sp.poly([(x - d * 22, y), (x - d * 42, y - 16), (x - d * 42, y + 16)], fill='F3F7FA', outline=INK, width=2.2)
        sp.ellipse(x - 28, y - 15, x + 28, y + 15, fill='F3F7FA', outline=INK, width=2.4)
        sp.poly([(x - d * 4, y - 14), (x + d * 6, y - 26), (x + d * 14, y - 13)], fill='C9D8E4', outline=INK, width=1.8)
        sp.line([(x + d * 8, y - 11), (x + d * 3, y), (x + d * 8, y + 11)], 'B5C6D4', 2.2)
        sp.circle(x + d * 15, y - 3, 3.4, fill=INK)
        sp.blit(img, alpha)


def draw_rain(img, t):
    if t < S4 + 0.4: return
    sp = Sp(330, 120, 880, 350)
    VY, VX = 300.0, 75.0
    Y0 = 135.0
    for r in ST['rain']:
        u = t - r['ts']
        if u < 0: continue
        fall = (GY - Y0) / VY
        x = r['x0'] + VX * min(u, fall)
        if u < fall:
            y = Y0 + VY * u
            ln = 15
            nx, ny = VX / math.hypot(VX, VY), VY / math.hypot(VX, VY)
            sp.line([(x - nx * ln, y - ny * ln), (x, y)], 'D2574A', 4.6, caps=True)
        elif u < fall + 0.45 and LAKE_X0 < x < LAKE_X1:
            v = (u - fall) / 0.45
            sp.ellipse(x - 4 - 14 * v, GY - 1 - 4 * v, x + 4 + 14 * v, GY + 1 + 4 * v, outline=('D2574A', 0.9 * (1 - v)), width=2.4)
    sp.blit(img)


def draw_needles(img, t):
    sp = Sp(TREE_X - 90, GY - 150, TREE_X + 90, GY + 6)
    for n in ST['needles']:
        u = (t - n['t0']) / 1.5
        if 0 <= u < 1:
            x = n['x'] + 9 * math.sin(2.2 * u + n['ph']); y = n['y'] + (GY - 6 - n['y']) * ease(u) ** 1.1
            a = n['ph'] + 4 * u
            sp.line([(x - 5 * math.cos(a), y - 5 * math.sin(a)), (x + 5 * math.cos(a), y + 5 * math.sin(a))], ('8A6A2E', 1 - 0.8 * u), 3, caps=True)
    sp.blit(img)


def ph_value(t):
    return 7.0 - 2.5 * ease((t - (S4 + 1.2)) / 3.8)


def draw_ph(img, t):
    ph = ph_value(t)
    sp = Sp(205, 160, 340, 340)
    sp.text(273, 208, '%.1f' % ph, 44, mix(INK, ALERT, clamp((7.0 - ph) / 2.5)), 'mm')
    y = 324 - (ph - 3) * 16
    sp.line([(222, y), (252, y)], INK, 3.4)
    sp.poly([(254, y), (270, y - 9), (270, y + 9)], fill=INK)
    sp.blit(img)


def draw_end_labels(img, t):
    """The three damage labels, one after another: a white chip and a pointer to the thing (chip x, chip bottom, pointer end x, y)."""
    a = [ease((t - (S4 + 6.0 + 0.5 * i)) / 0.4) for i in range(3)]
    items = [('lakes', 480, 236, 480, GY - 3), ('trees', 686, 200, TREE_X - 2, GY - 126), ('buildings', 850, 212, BLD_X, GY - 110)]
    for (s, cx, cy, tx, ty), al in zip(items, a):
        if al <= 0: continue
        px = clamp(tx, cx - 20, cx + 20)                                          # the pointer leaves the chip straight above its target
        A.leader(img, px, cy, tx, ty, INK, 3.0, al)
        A.label_chip(img, cx, cy, [s], [30], [INK], al, anchor='bc', outline=ALERT)


# ------------------------------------------------------------------------------------------------ the frame
def frame(t):
    img = BASE['img'].copy()
    D = ease((t - (S4 + 1.4)) / 4.0)                                          # how far the damage has gone
    draw_fish(img, t, 1 - ease((D - 0.2) / 0.55))
    draw_rain(img, t)
    SPR['tree0'].blit(img, 1 - ease((D - 0.05) / 0.85))
    SPR['tree1'].blit(img, ease((D - 0.05) / 0.85))
    SPR['bld0'].blit(img, 1 - ease((D - 0.05) / 0.85))
    SPR['bld1'].blit(img, ease((D - 0.05) / 0.85))
    draw_needles(img, t)
    draw_cloud(img, t)
    draw_plume(img, t)
    draw_ph(img, t)
    draw_legend(img, t)
    if t >= S4 + 6.0: draw_end_labels(img, t)
    A.step_captions(img, CAPS, (0.0, S2, S3, S4), t)
    return A.finish(img)


def init():
    plan()
    build_base()


# ================================================================================================ the two pictures
def hair_picture_parts(sp, cx, cy, r):
    """A human hair seen end-on: a thin outer cuticle, the cortex with pigment grains, a lighter core (the medulla)."""
    rnd = random.Random(2)
    sp.circle(cx, cy, r, fill='C49A66', outline='5E432A', width=5)
    sp.circle(cx, cy, r - 14, outline='8A653F', width=2.4)
    for _ in range(170):
        a, rr = rnd.uniform(0, 2 * math.pi), math.sqrt(rnd.uniform(0.12, 0.93)) * (r - 20)
        sp.circle(cx + rr * math.cos(a), cy + rr * math.sin(a), rnd.uniform(1.8, 3.6), fill=('6B4A28', 0.5), blend=True)
    sp.circle(cx, cy, 48, fill='A9824F', outline='7A5530', width=2.6)


def draw_particles():
    PXUM = 5.6                                         # pixels per micrometre: the SAME for every circle (70 : 10 : 2.5)
    w, h = 1100, 620
    im = A.canvas(w, h, TINT)
    sp = Sp(0, 0, w, h)
    hr = 70 * PXUM / 2
    hx, hy = 238, 282
    hair_picture_parts(sp, hx, hy, hr)
    for col, wd, hd in ((WHITE, 9, 22), (INK, 3.4, 18)):                                           # the width: a double arrow, with a white edge
        sp.arrow(hx - hr + 6, hy + 104, hx + hr - 6, hy + 104, col, wd, hd)
        sp.arrow(hx + hr - 6, hy + 104, hx - hr + 6, hy + 104, col, wd, hd)
    sp.blit(im)
    A.label_chip(im, hx, hy + 68, ['70 \u00b5m'], [34], [INK], 1.0, anchor='tc', outline=INK)
    s2 = Sp(0, 0, w, h)
    s2.text(hx, 514, 'Human hair', 34, INK, 'mm')
    s2.text(hx, 552, 'seen end-on', 26, INK_SOFT, 'mm', bold=False)
    # PM10 and PM2.5, to the same scale, side by side to the right of the hair
    r10, r25 = 10 * PXUM / 2, 2.5 * PXUM / 2
    x0 = 586
    s2.circle(x0, 188, r10, fill=HAZE, outline=INK, width=2.6)
    s2.text(x0 + 60, 160, 'PM10', 38, INK, 'lm')
    s2.text(x0 + 60, 200, '10 \u00b5m', 32, ACCENT_INK, 'lm')
    s2.text(x0 + 60, 236, 'dust, pollen, mould', 27, INK, 'lm', bold=False)
    s2.circle(x0, 366, r25, fill=ALERT, outline=INK, width=1.6)
    s2.line([(x0 + 14, 366), (x0 + 46, 366)], INK_SOFT, 2.2)                                       # a pointer to the small dot
    s2.text(x0 + 60, 340, 'PM2.5', 38, INK, 'lm')
    s2.text(x0 + 60, 380, '2.5 \u00b5m', 32, ACCENT_INK, 'lm')
    s2.text(x0 + 60, 416, 'soot, smoke, exhaust', 27, INK, 'lm', bold=False)
    s2.text(x0 + 60, 468, 'small enough to go deep', 27, ALERT, 'lm')
    s2.text(x0 + 60, 502, 'into the lungs', 27, ALERT, 'lm')
    # the scale bar
    bw = 20 * PXUM
    bx, by = 948 - bw, 592
    s2.text(bx - 16, by, 'Drawn to scale', 27, INK_SOFT, 'rm', bold=False)
    s2.line([(bx, by), (bx + bw, by)], INK, 4.5)
    for x in (bx, bx + bw): s2.line([(x, by - 9), (x, by + 9)], INK, 4.5)
    s2.text(bx + bw + 14, by, '20 \u00b5m', 28, INK, 'lm')
    s2.blit(im)
    A.PIC_OUT.mkdir(parents=True, exist_ok=True)
    A.finish(im, w, h).save(A.PIC_OUT / 'atm-particles.png')
    print('atm-particles.png written')


O2_BLUE, CO_BLACK, CO_RED = '3B82D6', '23272E', 'E23B3B'


def o2_mol(sp, cx, cy, rotation, k=1.0):
    """Oxygen: two joined blue circles."""
    return A.draw_mol(sp, cx, cy, [(-10, 0, 11, O2_BLUE), (10, 0, 11, O2_BLUE)], [(0, 1)], k, rotation, ow=2.2, bond_w=6)


def co_mol(sp, cx, cy, rotation, k=1.0):
    """Carbon monoxide: a joined black circle (C) and red circle (O)."""
    P = A.draw_mol(sp, cx, cy, [(-10, 0, 11, CO_BLACK), (10, 0, 11, CO_RED)], [(0, 1)], k, rotation, ow=2.2, bond_w=6)
    sp.text(P[0][0], P[0][1] + 0.5, 'C', 15 * k, WHITE, 'mm')
    sp.text(P[1][0], P[1][1] + 0.5, 'O', 15 * k, WHITE, 'mm')


CELL_R, HB_R, PIT_R, MOL_K = 124, 66, 29, 1.2


def pit_xy(cx, cy, ang): return cx + HB_R * math.cos(math.radians(ang)), cy + HB_R * math.sin(math.radians(ang))


def hb_panel(sp, cx, cy, kind):
    """A red blood cell (a disc) with a haemoglobin molecule (a round shape with four sockets) in it. kind 'o2' or 'co'."""
    sp.circle(cx, cy, CELL_R, fill='D9503E', outline='9E3227', width=5)
    sp.circle(cx, cy, CELL_R - 20, outline=('F2A596', 0.8), width=2.4, blend=True)
    sp.circle(cx, cy, HB_R, fill='7A1F2B', outline=INK, width=3)
    sp.circle(cx - 22, cy - 24, 15, fill=('FFFFFF', 0.13), blend=True)
    for ang in (45, 135, 225, 315):
        px, py = pit_xy(cx, cy, ang)
        sp.circle(px, py, PIT_R, fill='F8EFEA', outline=INK, width=2.8)
    for ang in (45, 135, 225, 315):
        px, py = pit_xy(cx, cy, ang)
        (o2_mol if kind == 'o2' else co_mol)(sp, px, py, math.radians(ang) + math.pi / 2, MOL_K)


def draw_haemoglobin():
    w, h = 1100, 620
    im = A.canvas(w, h, TINT)
    sp = Sp(0, 0, w, h)
    panels = [(24, 'Normal', GREEN), (556, 'Carbon monoxide', ALERT)]
    for x0, title, col in panels:
        sp.rect(x0, 20, x0 + 520, 600, fill=WHITE, outline=INK_SOFT, width=2.6, r=20)
        tw_ = tw(title, 36) + 44
        sp.rect(x0 + 260 - tw_ / 2, 34, x0 + 260 + tw_ / 2, 88, fill=col, r=14)
        sp.text(x0 + 260, 62, title, 36, WHITE, 'mm')
    ccy = 304
    lx, rx = 24 + 260, 556 + 260
    hb_panel(sp, lx, ccy, 'o2')
    hb_panel(sp, rx, ccy, 'co')
    # the floating oxygen outside the right-hand cell: a dashed arrow towards the cell, stopped by a cross
    for (fx, fy, tx, ty, ang) in ((rx - 176, ccy - 98, rx - 90, ccy - 58, 0.5), (rx + 176, ccy - 98, rx + 90, ccy - 58, -0.5), (rx - 180, ccy + 100, rx - 90, ccy + 60, -0.45)):
        o2_mol(sp, fx, fy, ang, MOL_K)
        ux, uy = tx - fx, ty - fy
        L = math.hypot(ux, uy)
        ux, uy = ux / L, uy / L
        sp.dashed(fx + ux * 38, fy + uy * 38, tx - ux * 12, ty - uy * 12, INK, 3.4, dash=9, gap=6)
        A.cross_out(sp, tx, ty, 9, ALERT, 5.2)
    sp.blit(im)
    # labels, each with a pointer to the thing it names
    A.leader(im, 110, 148, lx - 101, ccy - 71, INK, 3.0)
    A.label_chip(im, 44, 104, ['red blood cell'], [26], [INK], 1.0, outline=INK_SOFT)
    A.leader(im, lx + 60, 148, lx, ccy - 40, INK, 3.0)
    A.label_chip(im, 524, 104, ['haemoglobin'], [26], [INK], 1.0, anchor='tr', outline=INK_SOFT)
    px, py = pit_xy(lx, ccy, 135)
    A.leader(im, lx - 104, 450, px - 8, py + 8, INK, 3.0)
    A.label_chip(im, lx - 104, 450, ['O\u2082'], [30], [INK], 1.0, anchor='tc', outline=O2_BLUE)
    px, py = pit_xy(rx, ccy, 45)
    A.leader(im, rx + 104, 450, px + 8, py + 8, INK, 3.0)
    A.label_chip(im, rx + 104, 450, ['CO'], [30], [INK], 1.0, anchor='tc', outline=CO_BLACK)
    A.leader(im, rx - 224, 148, rx - 190, ccy - 106, INK, 3.0)
    A.label_chip(im, 576, 104, ['O\u2082'], [30], [INK], 1.0, outline=O2_BLUE)
    s2 = Sp(0, 0, w, h)
    s2.text(lx, 540, 'Oxygen is carried', 31, INK, 'mm')
    s2.text(lx, 576, 'to the body.', 31, INK, 'mm')
    s2.text(rx, 540, 'CO takes the places', 31, ALERT, 'mm')
    s2.text(rx, 576, 'oxygen needs.', 31, ALERT, 'mm')
    s2.blit(im)
    A.PIC_OUT.mkdir(parents=True, exist_ok=True)
    A.finish(im, w, h).save(A.PIC_OUT / 'atm-haemoglobin.png')
    print('atm-haemoglobin.png written')


if __name__ == '__main__':
    if '--stills' not in sys.argv:
        draw_particles()
        draw_haemoglobin()
    if '--pictures' not in sys.argv:
        A.encode(frame, TOTAL, NAME, COVER_T, init=init)
