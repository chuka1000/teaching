#!/usr/bin/env python3
"""
Pathogens And Antibiotics: the antibiotic-resistance animation (Y8 Science, Prokaryotes unit). PIL + ffmpeg, silent, unit palette.

  prok-resistance.mp4/png   Antibiotic resistance AS NATURAL SELECTION, 960 x 540, 20 fps, about 40 s, and it PAUSES (about 2 s) on every finished step:
                              1  Variation: a few bacteria are already resistant, by chance.   (40 bacteria, 2 resistant: thick outline + shield)
                              2  The antibiotic arrives. It kills the bacteria that are not resistant.   (the resistant ones are touched and stay)
                              3  The survivors reproduce. Their offspring are resistant too.   (2, 4, 8, 16, 32: each cell pinches into two)
                              4  Soon the whole population is resistant.   (the antibiotic now does nothing)
                              5  Resistance can also pass on a plasmid.   (a second scene: a copy of a plasmid slides along a tube from one
                                 bacterium to another. DNA moving SIDEWAYS, not from parent to child.)

The science it keeps straight:
  - no bacterium 'learns' or 'becomes' resistant in steps 1 to 4: the resistant cells are resistant from the start (a chance mutation, already there
    before the drug), and the population changes only because the ones that are not resistant die. That is natural selection.
  - the offspring inherit the resistance, so they are drawn with the same marking.
  - no real time spans are shown (in a patient it takes weeks to months): the rounds are labelled 'division 1' ... 'division 4', and step 4 only 'Later'.
    The label list DIV_LABELS holds the five states: the two survivors, then the population after each division (2, 4, 8, 16, 32).
  - resistant = thick plum-red outline AND a shield mark inside, so it reads in black and white, not by colour alone.

Colours are the Prokaryotes cell diagram's (build/media/prokaryotes_cells.py): lime wall, plum membrane, lilac cytoplasm, green main DNA loop, teal plasmid.
Everything is drawn at 3x and downscaled (LANCZOS). Frames are a pure function of the time, so the film is the same every run.

    python3 build/media/pathogens-and-antibiotics-media.py              # frames -> assets/media/prok-resistance.mp4 and .png
    python3 build/media/pathogens-and-antibiotics-media.py --stills 2.4 9 20   # just write those frames as PNGs to the temp folder
(set ANIM_TMP to choose the folder the frames go in; it is emptied at the end)
"""
import math, os, pathlib, random, shutil, subprocess, sys, tempfile
from functools import lru_cache
from multiprocessing import get_context
from PIL import Image, ImageChops, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'build' / 'media'))
import prokaryotes_cells as pc                                  # Layer, catmull, capsule, COL: the unit's own cell style

OUT = ROOT / 'assets' / 'media'
NAME = 'prok-resistance'
FPS, W, H, SS = 20, 960, 540, 3
FONT = pc.FONT
INK, CYTO, LIME, LIME_LINE, DNA, PLASMID = (pc.COL[k] for k in ('ink', 'cyto', 'wall', 'wallline', 'dna', 'plasmid'))
BG, ALERT, WHITE, WINE = 'F6F1F5', 'C73C28', 'FFFFFF', '8A1C45'           # WINE: the plum-red of the resistant outline
rgba = pc.rgba

# ------------------------------------------------------------------------------------------------ the timeline (seconds)
S2, S3 = 5.4, 13.4                                      # step 2 (drug), step 3 (survivors reproduce)
LEAD, ROUND, DIVT, STAG, N_DIV = 1.2, 1.6, 0.8, 0.2, 4  # step 3: lead-in, one round, the pinch, the stagger between cells, divisions
S4 = S3 + LEAD + N_DIV * ROUND + 2.0                    # step 4 (fast-forward, then the drug does nothing)
FF = 1.5                                                # step 4: the jump to a full panel
A_END, XF = S4 + 8.9, 0.7                               # end of the first scene; the cross-fade into the plasmid scene
B_TOTAL = 9.4
TOTAL = A_END + B_TOTAL
HIT0, HITSPAN = 1.5, 4.0                                # step 2: first hit after the drug arrives; the deaths are spread over this long
DIV_LABELS = ['Survivors', 'division 1', 'division 2', 'division 3', 'division 4']
# panel geometry (scene A) and the right-hand column
PX, PY, PW, PH = 40, 30, 600, 400
BX, BY, BW, BH = 40, 30, 880, 400
CX0, CX1 = 668, 930
R_C, A0, GAP = 15.0, 20.0, 5.0                          # a bacterium is 70 x 30: radius 15, straight part 2 x 20


def clamp(x, a=0.0, b=1.0): return max(a, min(b, x))
def ease(u): u = clamp(u); return u * u * (3 - 2 * u)
def lerp(a, b, u): return a + (b - a) * u
def mix(h1, h2, u): return ''.join('%02X' % round(lerp(int(h1[i:i + 2], 16), int(h2[i:i + 2], 16), u)) for i in (0, 2, 4))
def rgb3(h): return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))
def nem(d): return (d + math.pi / 2) % math.pi - math.pi / 2             # an angle difference for rods (a rod has no direction)


@lru_cache(maxsize=None)
def F(size): return ImageFont.truetype(FONT, int(round(size * SS)))
def P(pts): return [(x * SS, y * SS) for x, y in pts]


def text(d, x, y, s, size, col, anchor='la'): d.text((x * SS, y * SS), s, font=F(size), fill=rgba(col), anchor=anchor)
def rrect(d, x0, y0, x1, y1, r, fill=None, outline=None, width=0):
    d.rounded_rectangle([x0 * SS, y0 * SS, x1 * SS, y1 * SS], radius=r * SS, fill=rgba(fill) if fill else None,
                        outline=rgba(outline) if outline else None, width=int(width * SS))


# ------------------------------------------------------------------------------------------------ sprites
def sprite(w, h): return Image.new('RGBA', (int(math.ceil(w * SS)) + 2, int(math.ceil(h * SS)) + 2), (0, 0, 0, 0))


def fade(sp, a):
    if a < 0.999:
        sp.putalpha(sp.getchannel('A').point(lambda v: int(v * a)))
    return sp


def tinted(sp, col, u):
    r, g, b, a = sp.split()
    base = Image.merge('RGB', (r, g, b))
    base = Image.blend(base, Image.new('RGB', sp.size, rgb3(col)), u)
    return Image.merge('RGBA', (*base.split(), a))


def blit(target, sp, x0, y0):
    """Composite a sprite whose top-left is at (x0, y0) in 1x units, clipped to the target."""
    dx, dy = int(round(x0 * SS)), int(round(y0 * SS))
    sx0, sy0 = max(0, -dx), max(0, -dy)
    sx1, sy1 = min(sp.width, target.width - dx), min(sp.height, target.height - dy)
    if sx1 > sx0 and sy1 > sy0:
        target.alpha_composite(sp.crop((sx0, sy0, sx1, sy1)), (dx + sx0, dy + sy0))


def cap_pts(cx, cy, th, a, r):
    """A capsule (a rod with round ends): straight part 2a long, radius r, pointing along th."""
    n = max(10, int(r * SS / 4))
    ux, uy = math.cos(th), math.sin(th)
    ex, ey, sx, sy = cx + a * ux, cy + a * uy, cx - a * ux, cy - a * uy
    pts = [(ex + r * math.cos(th - math.pi / 2 + math.pi * i / n), ey + r * math.sin(th - math.pi / 2 + math.pi * i / n)) for i in range(n + 1)]
    pts += [(sx + r * math.cos(th + math.pi / 2 + math.pi * i / n), sy + r * math.sin(th + math.pi / 2 + math.pi * i / n)) for i in range(n + 1)]
    return pts


def fill_cap(d, cx, cy, th, a, r, col): d.polygon(P(cap_pts(cx, cy, th, a, r)), fill=rgba(col))


def shield_poly(cx, cy, w, h):
    hw, hh = w / 2, h / 2
    right = []
    for i in range(1, 9):
        u = i / 8
        right.append((hw * ((1 - u) ** 2 + 2 * u * (1 - u) * 0.62), 2 * u * (1 - u) * hh * 0.72 + u * u * hh))
    pts = [(cx - hw, cy - hh), (cx + hw, cy - hh), (cx + hw, cy)] + [(cx + x, cy + y) for x, y in right]
    pts += [(cx - x, cy + y) for x, y in reversed(right[:-1])]
    return pts


def draw_shield(d, cx, cy, w, h):
    """The resistance mark: a plum shield with a lilac emblem, upright whatever the cell's angle."""
    d.polygon(P(shield_poly(cx, cy, w, h)), fill=rgba(INK))
    d.polygon(P(shield_poly(cx, cy - h * 0.04, w * 0.5, h * 0.5)), fill=rgba(CYTO))


_raw = pc.dna_curve()[::5]
_x0, _x1, _y0, _y1 = min(p[0] for p in _raw), max(p[0] for p in _raw), min(p[1] for p in _raw), max(p[1] for p in _raw)
DNA_UNIT = pc.catmull([((x - (_x0 + _x1) / 2) / (_x1 - _x0), (y - (_y0 + _y1) / 2) / (_y1 - _y0)) for x, y in _raw], closed=True, n=3)


def draw_cell(target, x, y, th, k=1.0, offs=(0.0,), res=0.0, alpha=1.0, tint=0.0, shield_k=1.0, L=70.0, Wd=30.0,
              dna_u=-12.0, shield_u=15.0, dna_size=(25.0, 12.0)):
    """A bacterium in the unit's style: lime wall band, plum membrane line, lilac cytoplasm, the green main DNA loop.
    res 0 = ordinary (thin green outline).  res 1 = resistant (thick plum-red outline AND a shield mark).
    offs = axial centres of the pieces: (0,) is one cell; (-d/2, d/2) is a cell in the middle of dividing (one capsule, then a waist, then two)."""
    a, R = (L - Wd) / 2 * k, Wd / 2 * k
    half = (max(abs(o) for o in offs) + L / 2 + 8) * k
    sp = sprite(2 * half, 2 * half)
    d = ImageDraw.Draw(sp)
    c = half
    ux, uy = math.cos(th), math.sin(th)
    ctr = [(c + o * k * ux, c + o * k * uy) for o in offs]
    t_out = (1.4 + 2.5 * res) * Wd / 30 * k
    for (px, py) in ctr: fill_cap(d, px, py, th, a, R, mix(LIME_LINE, WINE, res))          # the outline, drawn under everything (a union when dividing)
    for (px, py) in ctr: fill_cap(d, px, py, th, a, R - t_out, LIME)                        # the wall band
    for (px, py) in ctr: fill_cap(d, px, py, th, a, R * 0.667, INK)                         # the membrane line
    for (px, py) in ctr: fill_cap(d, px, py, th, a, R * 0.595, CYTO)                        # the cytoplasm
    dw, dh = dna_size[0] * k, dna_size[1] * k
    for (px, py) in ctr:
        cxp, cyp = px + dna_u * k * ux, py + dna_u * k * uy
        pts = [(cxp + u * dw * ux - v * dh * uy, cyp + u * dw * uy + v * dh * ux) for u, v in DNA_UNIT]
        d.line(P(pts + [pts[0]]), fill=rgba(DNA), width=max(2, int(1.6 * k * SS)), joint='curve')
    if res > 0.02:
        s = ease(res) * shield_k
        for (px, py) in ctr:
            draw_shield(d, px + shield_u * k * ux, py + shield_u * k * uy, 12.0 * k * s, 16.0 * k * s)
    if tint > 0.01: sp = tinted(sp, ALERT, tint)
    blit(target, fade(sp, alpha), x - half, y - half)


def draw_plasmid(target, x, y, r, s=1.0, alpha=1.0, shield=True):
    """A plasmid ring (teal), with the resistance shield inside it."""
    half = r * s + 8
    sp = sprite(2 * half, 2 * half)
    d = ImageDraw.Draw(sp)
    rr_, w_ = r * s, max(2.0, r * 0.24 * s)
    d.ellipse([(half - rr_) * SS, (half - rr_) * SS, (half + rr_) * SS, (half + rr_) * SS], outline=rgba(PLASMID), width=int(w_ * SS))
    if shield: draw_shield(d, half, half, rr_ * 0.9, rr_ * 1.08)
    blit(target, fade(sp, alpha), x - half, y - half)


def draw_pill(target, x, y, th, scale=1.0, alpha=1.0, cross=False, Lp=32.0, Wp=15.0):
    """An antibiotic particle: a capsule pill, white half and red half, plum outline (reads in black and white too)."""
    a, r = (Lp - Wp) / 2 * scale, Wp / 2 * scale
    half = Lp * scale / 2 + 14
    sp = sprite(2 * half, 2 * half)
    d = ImageDraw.Draw(sp)
    c = half
    ri = r - 1.7 * scale
    fill_cap(d, c, c, th, a, r, INK)
    fill_cap(d, c, c, th, a, ri, WHITE)
    ux, uy = math.cos(th), math.sin(th)
    ex, ey = c + a * ux, c + a * uy
    n = 12
    arc = [(ex + ri * math.cos(th - math.pi / 2 + math.pi * i / n), ey + ri * math.sin(th - math.pi / 2 + math.pi * i / n)) for i in range(n + 1)]
    top = (c + ri * math.cos(th + math.pi / 2), c + ri * math.sin(th + math.pi / 2))
    bot = (c + ri * math.cos(th - math.pi / 2), c + ri * math.sin(th - math.pi / 2))
    d.polygon(P(arc + [top, bot]), fill=rgba(ALERT))
    d.line(P([top, bot]), fill=rgba(INK), width=int(1.5 * scale * SS))
    if cross:                                                                             # a red cross over it: it does nothing now
        q = 7.5
        for col, wd in ((WHITE, 7.6), (ALERT, 3.6)):
            for sgn in (1, -1):
                d.line(P([(c - q, c - sgn * q), (c + q, c + sgn * q)]), fill=rgba(col), width=int(wd * SS))
        for sgn in (1, -1):
            for ex_ in (-q, q):
                yy = c + (sgn * ex_)
                dd = (3.6 * SS) / 2
                d.ellipse([(c + ex_) * SS - dd, yy * SS - dd, (c + ex_) * SS + dd, yy * SS + dd], fill=rgba(ALERT))
    blit(target, fade(sp, alpha), x - half, y - half)


def draw_ring(target, x, y, th, u, k=1.0):
    """A pulse ring that opens out round a cell and fades: 'look at this one'."""
    a, R = 20 * k, (15 + 4 + 16 * u) * k
    half = a + R + 8
    sp = sprite(2 * half, 2 * half)
    d = ImageDraw.Draw(sp)
    pts = P(cap_pts(half, half, th, a, R))
    d.line(pts + [pts[0]], fill=rgba(ALERT), width=int(3.0 * k * SS), joint='curve')
    blit(target, fade(sp, 0.95 * (1 - u) ** 0.8), x - half, y - half)


def draw_burst(target, x, y, th, v):
    """The small burst when a cell is killed."""
    half = 60
    sp = sprite(2 * half, 2 * half)
    d = ImageDraw.Draw(sp)
    ux, uy = math.cos(th), math.sin(th)
    for i in range(10):
        along = (i - 4.5) * 7.0
        ang = 2 * math.pi * i / 10 + 0.35 * math.sin(i * 2.1)
        dist = 6 + (26 + 6 * (i % 3)) * ease(v)
        px, py = half + along * ux + dist * math.cos(ang), half + along * uy + dist * math.sin(ang)
        rd = (4.2 - 2.6 * v) * (1.0 if i % 2 else 0.75)
        d.ellipse([(px - rd) * SS, (py - rd) * SS, (px + rd) * SS, (py + rd) * SS], fill=rgba((ALERT, LIME_LINE, INK)[i % 3]))
    blit(target, fade(sp, 1 - v ** 1.5), x - half, y - half)


# ------------------------------------------------------------------------------------------------ geometry: rods that must not overlap
class Cell:
    __slots__ = ('x', 'y', 'th', 'a', 'm', 'id', 'tt', 'div0', 'd')

    def __init__(self, x, y, th, m=1.0, cid=0):
        self.x, self.y, self.th, self.a, self.m, self.id, self.tt, self.div0, self.d = x, y, th, A0, m, cid, None, None, None


def ends(c):
    ux, uy = math.cos(c.th), math.sin(c.th)
    return (c.x - c.a * ux, c.y - c.a * uy), (c.x + c.a * ux, c.y + c.a * uy)


def seg_close(p1, p2, q1, q2):
    """Closest points of two segments (Ericson)."""
    d1, d2, r = (p2[0] - p1[0], p2[1] - p1[1]), (q2[0] - q1[0], q2[1] - q1[1]), (p1[0] - q1[0], p1[1] - q1[1])
    a, e, f = d1[0] ** 2 + d1[1] ** 2, d2[0] ** 2 + d2[1] ** 2, d2[0] * r[0] + d2[1] * r[1]
    if a <= 1e-9 and e <= 1e-9: s = t = 0.0
    elif a <= 1e-9: s, t = 0.0, clamp(f / e)
    else:
        c = d1[0] * r[0] + d1[1] * r[1]
        if e <= 1e-9: t, s = 0.0, clamp(-c / a)
        else:
            b = d1[0] * d2[0] + d1[1] * d2[1]
            den = a * e - b * b
            s = clamp((b * f - c * e) / den) if den > 1e-9 else 0.0
            t = (b * s + f) / e
            if t < 0: t, s = 0.0, clamp(-c / a)
            elif t > 1: t, s = 1.0, clamp((b - c) / a)
    return (p1[0] + s * d1[0], p1[1] + s * d1[1]), (q1[0] + t * d2[0], q1[1] + t * d2[1])


def dist2(a, b): return math.hypot(a[0] - b[0], a[1] - b[1])
def pt_seg(px, py, p1, p2):
    q, _ = seg_close(p1, p2, (px, py), (px, py))
    return math.hypot(px - q[0], py - q[1])


def relax(cells, iters, gap, obst=(), pw=PW, ph=PH, align=0.0, margin=8.0):
    """Push rods apart until none overlaps (positions only; mobility m shares the push), keep them inside the panel."""
    D = 2 * R_C + gap
    for _ in range(iters):
        for i, ci in enumerate(cells):
            for cj in cells[i + 1:]:
                reach = ci.a + cj.a + D
                if abs(ci.x - cj.x) > reach or abs(ci.y - cj.y) > reach: continue
                pa, qa = seg_close(*ends(ci), *ends(cj))
                dd = dist2(pa, qa)
                if dd >= D: continue
                if align and dd < D + 6: dth = align * math.sin(2 * (cj.th - ci.th)) / 2; ci.th += dth * ci.m; cj.th -= dth * cj.m
                mm = ci.m + cj.m
                if mm <= 0: continue
                if dd < 1e-6: nx, ny = 1.0, 0.0
                else: nx, ny = (pa[0] - qa[0]) / dd, (pa[1] - qa[1]) / dd
                o = D - dd
                ci.x += nx * o * ci.m / mm; ci.y += ny * o * ci.m / mm
                cj.x -= nx * o * cj.m / mm; cj.y -= ny * o * cj.m / mm
        for c in cells:
            if c.m <= 0: continue
            for (o1, o2, rad) in obst:
                pa, qa = seg_close(*ends(c), o1, o2)
                dd = dist2(pa, qa)
                need = R_C + rad + gap / 2
                if dd < need:
                    nx, ny = ((pa[0] - qa[0]) / dd, (pa[1] - qa[1]) / dd) if dd > 1e-6 else (0.0, -1.0)
                    c.x += nx * (need - dd); c.y += ny * (need - dd)
            (p1, p2) = ends(c)
            lo_x, hi_x = min(p1[0], p2[0]) - R_C - margin, max(p1[0], p2[0]) + R_C + margin
            lo_y, hi_y = min(p1[1], p2[1]) - R_C - margin, max(p1[1], p2[1]) + R_C + margin
            if lo_x < 0: c.x -= lo_x
            if hi_x > pw: c.x -= hi_x - pw
            if lo_y < 0: c.y -= lo_y
            if hi_y > ph: c.y -= hi_y - ph


def min_gap(cells):
    g = 1e9
    for i, ci in enumerate(cells):
        for cj in cells[i + 1:]:
            pa, qa = seg_close(*ends(ci), *ends(cj))
            g = min(g, dist2(pa, qa) - 2 * R_C)
    return g


def best_candidate(cells, rnd, margin=30, tries=40, m=1.0):
    best, bs = None, -1e9
    for _ in range(tries):
        c = Cell(rnd.uniform(margin + 20, PW - margin - 20), rnd.uniform(margin, PH - margin), rnd.uniform(0, math.pi), m)
        s = min([dist2(*seg_close(*ends(c), *ends(o))) for o in cells] or [1e9])
        if s > bs: best, bs = c, s
    return best


# ------------------------------------------------------------------------------------------------ the state of the film
ST = {}


def layout1():
    """Step 1: 40 bacteria scattered in the sample, two of them resistant (placed in open space, with room for their tag)."""
    rnd = random.Random(11)
    r1, r2 = Cell(168, 150, math.radians(-16), 0.0, 0), Cell(432, 262, math.radians(20), 0.0, 1)
    cells = [r1, r2]
    obst = [((c.x - 40, c.y - 38), (c.x + 40, c.y - 38), 14) for c in (r1, r2)]
    for i in range(38):
        c = best_candidate(cells, rnd); c.id = 2 + i; cells.append(c)
    relax(cells, 700, 12.0, obst)
    return cells


def plan_pills(cells, seed=23):
    """Step 2: one antibiotic particle per bacterium. Each flies in a straight line from outside the sample, entering mostly from the top right,
    along a path that touches nothing else on the way, and the hits are spread over HITSPAN seconds (near the top right first)."""
    rnd = random.Random(seed)
    RP = 8.0
    n = len(cells)
    order = sorted(range(n), key=lambda i: dist2((cells[i].x, cells[i].y), (PW, 0)) + rnd.uniform(-45, 45))
    t_hits = {i: S2 + HIT0 + HITSPAN * rank / (n - 1) for rank, i in enumerate(order)}
    plans = [None] * n
    SPEED = 235.0
    blocked_total = 0
    for rank, i in enumerate(order):
        c = cells[i]
        t_hit = t_hits[i]
        offs = [0.0]
        for kdeg in range(10, 181, 10): offs += [math.radians(kdeg), -math.radians(kdeg)]
        best = None
        for off in offs:
            phi = math.radians(-35) + off
            ux, uy = math.cos(phi), math.sin(phi)
            s = 0.0
            while True:
                s += 4.0
                sx, sy = c.x + s * ux, c.y + s * uy
                if sx < -30 or sx > PW + 30 or sy < -30 or sy > PH + 30: break
            sx, sy = c.x + s * ux, c.y + s * uy
            sk = ends(c)
            q = s                                                                           # contact point: walk in until the pill touches this cell
            while q > 0 and pt_seg(c.x + q * ux, c.y + q * uy, *sk) > R_C + RP: q -= 1.0
            tx, ty = c.x + q * ux, c.y + q * uy
            L_ = math.hypot(tx - sx, ty - sy)
            nst = max(1, int(L_ / 3))
            bad = 0
            for step in range(nst + 1):
                f_ = step / nst
                px, py = lerp(sx, tx, f_), lerp(sy, ty, f_)
                tau = t_hit - (1 - f_) * L_ / SPEED                                         # when the pill is here
                for j, o in enumerate(cells):
                    if j == i: continue
                    if j >= 2 and tau > t_hits[j] + 0.1: continue                           # that bacterium is already dead
                    if pt_seg(px, py, *ends(o)) < R_C + RP + 3: bad += 1; break
            if best is None or bad < best[0]: best = (bad, sx, sy, tx, ty, L_)
            if bad == 0: break
        bad, sx, sy, tx, ty, L_ = best
        blocked_total += bad
        t0 = max(S2 + 0.05 + 0.01 * rank, t_hit - L_ / SPEED)
        plans[i] = dict(i=i, sx=sx, sy=sy, tx=tx, ty=ty, t0=t0, t_hit=t_hit, spin=1.1 * (1 if rank % 2 else -1), ph=rnd.uniform(0, 6.28),
                        th0=rnd.uniform(0, 6.28), res=(i < 2), speed=L_ / max(0.05, t_hit - t0), bad=bad)
    return plans


def simulate_growth(seeds):
    """Step 3: the survivors divide, round after round. A dividing cell elongates and pinches in two (two capsules sliding apart: a waist appears by
    itself), the daughters keep the marking, and the cells push each other aside so nothing overlaps. Returns one snapshot per frame."""
    rnd = random.Random(77)
    cells = [Cell(s.x, s.y, s.th, 1.0, s.id) for s in seeds]
    nxt = 100
    rounds = [S3 + LEAD + k * ROUND for k in range(N_DIV)]
    started = [False] * N_DIV
    nf = int(round((S4 - S3) * FPS)) + 1
    snaps, worst = [], 1e9
    for f in range(nf):
        t = S3 + f / FPS
        for k, rs in enumerate(rounds):
            if not started[k] and t >= rs - 1e-9:
                started[k] = True
                for c in cells: c.div0 = rs + rnd.uniform(0, STAG)
        new = []
        for c in cells:
            if c.div0 is not None:
                u = (t - c.div0) / DIVT
                if u >= 1:
                    ux, uy = math.cos(c.th), math.sin(c.th)
                    for sgn in (-1, 1):
                        dd = Cell(c.x + sgn * 35 * ux, c.y + sgn * 35 * uy, c.th, 1.0, nxt); nxt += 1
                        dd.tt = c.th + sgn * math.radians(rnd.uniform(4, 11))
                        new.append(dd)
                    continue
                if u > 0: c.d = 70.0 * ease(u); c.a = A0 + c.d / 2
            new.append(c)
        cells = new
        for c in cells:
            if c.tt is not None: c.th += (c.tt - c.th) * 0.12
        relax(cells, 10, GAP)
        D = 2 * R_C + GAP + 20                                                              # a gentle spreading push, so the colonies open out
        for i, ci in enumerate(cells):
            for cj in cells[i + 1:]:
                if abs(ci.x - cj.x) > ci.a + cj.a + D or abs(ci.y - cj.y) > ci.a + cj.a + D: continue
                pa, qa = seg_close(*ends(ci), *ends(cj))
                dd = dist2(pa, qa)
                if dd < D and dd > 1e-6:
                    o = 0.03 * (D - dd)
                    nx, ny = (pa[0] - qa[0]) / dd, (pa[1] - qa[1]) / dd
                    ci.x += nx * o; ci.y += ny * o; cj.x -= nx * o; cj.y -= ny * o
        relax(cells, 3, GAP)
        worst = min(worst, min_gap(cells))
        snaps.append([(c.x, c.y, c.th, c.d, c.id) for c in cells])
    return snaps, worst


def layout60(final32):
    """Step 4: the same 32 cells, now with 28 more, spread over the sample (nearly full), none overlapping."""
    rnd = random.Random(5)
    cells = [Cell(x, y, th, 0.25, cid) for (x, y, th, d, cid) in final32]
    old = [(c.x, c.y, c.th) for c in cells]
    for i in range(28):
        c = best_candidate(cells, rnd, margin=24, tries=60, m=1.0); c.id = 200 + i; cells.append(c)
    relax(cells, 1200, 4.0, align=0.02)
    return cells, old


def build_state():
    L1 = layout1()
    print('step 1: %d bacteria, smallest gap %.1f px' % (len(L1), min_gap(L1)))
    for seed in range(23, 80):                                                              # the first ordering in which no particle crosses a live bacterium
        pills = plan_pills(L1, seed)
        if not any(p['bad'] for p in pills): break
    print('step 2: particle ordering seed %d, particles that cross a live bacterium on the way: %d' % (seed, sum(1 for p in pills if p['bad'])))
    print('step 2: fastest particle %.0f px/s' % max(p['speed'] for p in pills))
    snaps, worst = simulate_growth(L1[:2])
    print('step 3: %d cells at the end, smallest gap in any frame %.1f px' % (len(snaps[-1]), worst))
    F60, old = layout60(snaps[-1])
    print('step 4: %d bacteria, smallest gap %.1f px' % (len(F60), min_gap(F60)))
    rnd = random.Random(41)
    ST.update(L1=L1, pills=pills, snaps=snaps, F60=F60, old=old, delay=[rnd.uniform(0.0, 0.7) for _ in F60])


# ------------------------------------------------------------------------------------------------ the furniture
def make_base_A():
    im = Image.new('RGBA', (W * SS, H * SS), rgba(BG))
    d = ImageDraw.Draw(im)
    rrect(d, PX, PY, PX + PW, PY + PH, 28, fill=WHITE, outline=INK, width=3)
    rrect(d, CX0, 282, CX1, PY + PH, 16, fill=WHITE, outline=INK, width=2.5)                    # the key
    rows = [(318, 'not resistant'), (356, 'resistant'), (394, 'antibiotic')]
    draw_cell(im, CX0 + 42, rows[0][0], 0, k=0.95)
    draw_cell(im, CX0 + 42, rows[1][0], 0, k=0.95, res=1.0)
    draw_pill(im, CX0 + 42, rows[2][0], 0.0, 1.0)
    for (y, s) in rows: text(d, CX0 + 90, y, s, 23, INK, 'lm')
    return im


def make_base_B():
    im = Image.new('RGBA', (W * SS, H * SS), rgba(BG))
    rrect(ImageDraw.Draw(im), BX, BY, BX + BW, BY + BH, 28, fill=WHITE, outline=INK, width=3)
    return im


def panel_mask(w, h):
    m = Image.new('L', (w * SS, h * SS), 0)
    ImageDraw.Draw(m).rounded_rectangle([1.5 * SS, 1.5 * SS, (w - 1.5) * SS, (h - 1.5) * SS], radius=26.5 * SS, fill=255)
    return m


CAPS = {1: ['Variation: a few bacteria are already resistant, by chance.'],
        2: ['The antibiotic arrives.', 'It kills the bacteria that are not resistant.'],
        3: ['The survivors reproduce.', 'Their offspring are resistant too.'],
        4: ['Soon the whole population is resistant.'],
        5: ['Resistance can also pass on a plasmid.', '... and the other bacterium is now resistant too.']}


def draw_caption(img, num, alphas):
    """The step number in a plum badge, then the caption in big bold plum (sentences on their own lines)."""
    lines = CAPS[num]
    ys = [470, 508] if len(lines) == 2 else [489]
    lay = Image.new('RGBA', img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    d.ellipse([40 * SS, (ys[0] - 22) * SS, 84 * SS, (ys[0] + 22) * SS], fill=rgba(INK))
    text(d, 62, ys[0] + 1, str(num), 30, WHITE, 'mm')
    img.alpha_composite(lay)
    for i, s_ in enumerate(lines):
        if alphas[i] > 0:
            ln = Image.new('RGBA', img.size, (0, 0, 0, 0))
            text(ImageDraw.Draw(ln), 104, ys[i], s_, 28, INK, 'lm')
            img.alpha_composite(fade(ln, alphas[i]))


def time_label(img, s, ff=False):
    d = ImageDraw.Draw(img)
    rrect(d, CX0, PY, CX1, PY + 56, 14, fill=INK)
    if ff:                                                                                  # the fast-forward mark: two small triangles
        w = F(28).getlength(s) / SS
        x0 = (CX0 + CX1) / 2 - (w + 40) / 2
        for j in range(2):
            xx = x0 + j * 15
            d.polygon(P([(xx, PY + 18), (xx, PY + 38), (xx + 14, PY + 28)]), fill=rgba(WHITE))
        text(d, x0 + 40, PY + 29, s, 28, WHITE, 'lm')
    else:
        text(d, (CX0 + CX1) / 2, PY + 29, s, 28, WHITE, 'mm')


def counters(img, res, nres):
    d = ImageDraw.Draw(img)
    rrect(d, CX0, 98, CX1, 202, 16, fill=WHITE, outline=INK, width=2.5)
    for y, lab, n in ((125, 'Resistant', res), (176, 'Not resistant', nres)):
        text(d, CX0 + 18, y, lab, 23, INK, 'lm')
        text(d, CX1 - 18, y, str(n), 38, INK, 'rm')
    d.line(P([(CX0 + 14, 150), (CX1 - 14, 150)]), fill=rgba('D8C4DE'), width=2 * SS)


def note(img, lines, alpha, pill=False):
    lay = Image.new('RGBA', img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    for j, s in enumerate(lines): text(d, CX0 + 6, 226 + 26 * j, s, 22, INK, 'lm')
    img.alpha_composite(fade(lay, alpha))


def finish(img): return img.convert('RGB').resize((W, H), Image.LANCZOS)


# ------------------------------------------------------------------------------------------------ scene A: the sample
def wob(cid, t): return (1.0 * math.sin(0.9 * t + 1.7 * cid), 1.0 * math.sin(0.7 * t + 2.3 * cid + 1.0), 0.03 * math.sin(0.6 * t + 0.9 * cid))


def put(pan, c, t, **kw):
    dx, dy, dth = wob(c[4] if isinstance(c, tuple) else c.id, t)
    x, y, th = (c[0], c[1], c[2]) if isinstance(c, tuple) else (c.x, c.y, c.th)
    draw_cell(pan, x + dx, y + dy, th + dth, **kw)


def pill_pos(p, t):
    u = clamp((t - p['t0']) / (p['t_hit'] - p['t0']))
    x, y = lerp(p['sx'], p['tx'], u), lerp(p['sy'], p['ty'], u)
    L_ = max(1.0, math.hypot(p['tx'] - p['sx'], p['ty'] - p['sy']))
    nx, ny = -(p['ty'] - p['sy']) / L_, (p['tx'] - p['sx']) / L_
    w = 3.0 * math.sin(2 * math.pi * 0.6 * (t - p['t0']) + p['ph']) * (1 - u)
    return x + nx * w, y + ny * w, p['th0'] + p['spin'] * (t - p['t0'])


BASE = {}


def render_A(t):
    img = BASE['A'].copy()
    pan = Image.new('RGBA', (PW * SS, PH * SS), (0, 0, 0, 0))
    L1, pills, snaps, F60, old = ST['L1'], ST['pills'], ST['snaps'], ST['F60'], ST['old']
    label, ff, counts, nt, nalpha, cap_n, cap_t0 = '', False, (2, 38), None, 0.0, 1, 0.0
    if t < S2:                                                                                # ---- step 1: variation
        label, cap_n, cap_t0 = 'Before the drug', 1, 0.0
        order = sorted(range(len(L1)), key=lambda i: -L1[i].id if L1[i].id > 1 else -999)
        for c in sorted(L1, key=lambda c: -c.id):
            i = c.id
            u = ease((t - 0.04 * i) / 0.55)
            if u <= 0: continue
            put(pan, c, t, k=0.5 + 0.5 * u, res=1.0 if c.id < 2 else 0.0, alpha=u)
        for c in L1[:2]:
            for p0 in (1.3, 2.0, 2.7):
                u = (t - p0) / 0.9
                if 0 <= u < 1: draw_ring(pan, c.x, c.y, c.th, u)
            a = ease((t - 1.3) / 0.3)
            if a > 0:
                tag = sprite(120, 34); dt = ImageDraw.Draw(tag)
                rrect(dt, 2, 2, 118, 32, 12, fill=WHITE, outline=INK, width=2.2)
                text(dt, 60, 18, 'resistant', 21, INK, 'mm')
                blit(pan, fade(tag, a), c.x - 60, c.y - 38 - 17)
    elif t < S3:                                                                              # ---- step 2: the antibiotic arrives
        label, cap_n, cap_t0 = 'Drug added', 2, S2
        n_dead = sum(1 for p in pills if not p['res'] and t >= p['t_hit'])
        counts = (2, 38 - n_dead)
        hit = {p['i']: p for p in pills}
        for c in sorted(L1, key=lambda c: c.id):
            p = hit[c.id]
            if c.id < 2:
                s = 1.0
                if t >= p['t_hit']: v = (t - p['t_hit']) / 0.45; s = 1 + 0.35 * math.sin(math.pi * clamp(v))
                put(pan, c, t, res=1.0, shield_k=s)
                if 0 <= t - p['t_hit'] < 0.5: draw_ring(pan, c.x, c.y, c.th, (t - p['t_hit']) / 0.5)
            else:
                v = (t - p['t_hit']) / 0.55
                if v < 0: put(pan, c, t)
                elif v < 1:
                    put(pan, c, t, alpha=1 - ease(v), tint=clamp(v * 5) * 0.8, k=1 - 0.12 * ease(v))
                    dx, dy, _ = wob(c.id, t); draw_burst(pan, c.x + dx, c.y + dy, c.th, v)
        a = 1 - ease((t - S2) / 0.3)
        if a > 0:
            for c in L1[:2]:
                tag = sprite(120, 34); dt = ImageDraw.Draw(tag)
                rrect(dt, 2, 2, 118, 32, 12, fill=WHITE, outline=INK, width=2.2)
                text(dt, 60, 18, 'resistant', 21, INK, 'mm')
                blit(pan, fade(tag, a), c.x - 60, c.y - 38 - 17)
        for p in pills:
            if t < p['t0']: continue
            if t < p['t_hit']:
                x, y, th = pill_pos(p, t); draw_pill(pan, x, y, th)
            elif p['res'] and t < p['t_hit'] + 0.9:                                           # it bounces off the resistant cell and drifts away
                c = L1[p['i']]
                nx, ny = p['tx'] - c.x, p['ty'] - c.y
                nn = math.hypot(nx, ny) or 1.0
                w = (t - p['t_hit'])
                draw_pill(pan, p['tx'] + nx / nn * 60 * ease(w / 0.9), p['ty'] + ny / nn * 60 * ease(w / 0.9),
                          p['th0'] + p['spin'] * (t - p['t0']), alpha=1 - ease(w / 0.9))
    elif t < S4:                                                                              # ---- step 3: the survivors reproduce
        label, cap_n, cap_t0 = DIV_LABELS[0], 3, S3
        f = min(len(snaps) - 1, int(round((t - S3) * FPS)))
        done = [S3 + LEAD + k * ROUND + DIVT + STAG for k in range(N_DIV)]
        n_div = sum(1 for dt_ in done if t >= dt_)
        label = DIV_LABELS[n_div]
        counts = (2 ** (n_div + 1), 0)
        for (x, y, th, dlt, cid) in snaps[f]:
            offs = (0.0,) if dlt is None else (-dlt / 2, dlt / 2)
            put(pan, (x, y, th, dlt, cid), t, res=1.0, offs=offs)
        nt, nalpha = ['Offspring inherit', 'the resistance.'], ease((t - done[0]) / 0.4)
    else:                                                                                     # ---- step 4: later, the whole population is resistant
        label, ff, cap_n, cap_t0 = 'Later', True, 4, S4
        u = (t - S4) / FF
        counts = (32 + int(round(28 * ease(u))), 0)
        for j, c in enumerate(ST['F60']):
            if j < 32:
                ox, oy, oth = old[j]
                e = ease(u)
                dx, dy, dth = wob(c.id if c.id else j, t)
                draw_cell(pan, lerp(ox, c.x, e) + dx, lerp(oy, c.y, e) + dy, oth + nem(c.th - oth) * e + dth, res=1.0)
            else:
                a = ease((t - S4 - ST['delay'][j]) / 0.5)
                if a > 0: put(pan, c, t, res=1.0, alpha=a, k=0.45 + 0.55 * a)
        # the drug drifts by, and does nothing
        for j in range(4):
            t0, dur = S4 + FF + 0.1 + 0.8 * j, 3.4
            v = (t - t0) / dur
            if 0 <= v <= 1:
                y0, y1 = (70, 130, 255, 325)[j], (140, 200, 320, 370)[j]
                x, y = lerp(PW + 36, -36, v), lerp(y0, y1, v) + 5 * math.sin(2 * math.pi * 0.5 * (t - t0) + j)
                draw_pill(pan, x, y, math.pi + 0.5 * math.sin(1.1 * (t - t0) + j), 1.6, cross=True)
        nt, nalpha = [], 0.0
    pan.putalpha(ImageChops.multiply(pan.getchannel('A'), BASE['MA']))
    img.alpha_composite(pan, (PX * SS, PY * SS))
    time_label(img, label, ff)
    counters(img, *counts)
    if t >= S4 + FF + 0.3:                                                                    # the note beside a drifting, crossed pill
        a = ease((t - S4 - FF - 0.3) / 0.4)
        lay = Image.new('RGBA', img.size, (0, 0, 0, 0))
        draw_pill(lay, CX0 + 30, 244, 0.0, 1.45, cross=True)
        text(ImageDraw.Draw(lay), CX0 + 66, 244, 'no effect now', 22, INK, 'lm')
        img.alpha_composite(fade(lay, a))
    elif nt and nalpha > 0:
        note(img, nt, nalpha)
    draw_caption(img, cap_n, [ease((t - cap_t0) / 0.35), ease((t - cap_t0 - 0.5) / 0.35)])
    return finish(img)


# ------------------------------------------------------------------------------------------------ scene B: a plasmid passes sideways
KB = 4.2                                                   # a bacterium here is 294 px long: the small ones, scaled up
CY = 190                                                   # their centre line (panel coordinates)
CXL, CXR = 440 - 45 - 147, 440 + 45 + 147
TUBE_W = 30


def render_B(tb):
    img = BASE['B'].copy()
    pan = Image.new('RGBA', (BW * SS, BH * SS), (0, 0, 0, 0))
    d = ImageDraw.Draw(pan)
    # the tube (a pilus) grows from the left bacterium towards the right one
    g = ease((tb - 0.8) / 0.9)
    if g > 0:
        x_a, x_b = CXL + 120, lerp(CXL + 120, CXR - 120, g)
        if x_b > x_a + 1:
            rrect(d, x_a, CY - TUBE_W / 2, x_b, CY + TUBE_W / 2, TUBE_W / 2, fill=INK)                  # the tube: plum wall, lilac inside
            x_in = x_b - 3.5 if g < 1 else x_b
            if x_in > x_a + 1: rrect(d, x_a, CY - TUBE_W / 2 + 3.5, x_in, CY + TUBE_W / 2 - 3.5, TUBE_W / 2 - 3.5, fill=CYTO)
    # the transformation of the right bacterium
    r = ease((tb - 6.3) / 0.6)
    right_kw = dict(k=KB, res=r, dna_u=-15.5, shield_u=3.0, dna_size=(23.0, 11.0))
    left_kw = dict(k=KB, res=1.0, dna_u=-15.5, shield_u=3.0, dna_size=(23.0, 11.0))
    draw_cell(pan, CXL, CY, 0.0, **left_kw)
    draw_cell(pan, CXR, CY, math.pi, **right_kw)
    if 6.3 <= tb < 7.2: draw_ring(pan, CXR, CY, 0.0, (tb - 6.3) / 0.9, k=KB)
    # the plasmids: the original stays in the left bacterium; a copy slides across
    ring_r = 6.0 * KB
    draw_plasmid(pan, CXL + 82, CY, ring_r)
    keys = [(2.8, CXL + 82, 1.0), (3.4, CXL + 112, 1.0), (3.9, CXL + 151, 0.38), (5.2, CXR - 151, 0.38), (5.7, CXR - 112, 1.0), (6.2, CXR - 82, 1.0)]
    if tb >= 2.2:
        if tb < keys[0][0]:
            u = ease((tb - 2.2) / 0.6); cx_, s_ = keys[0][1], 1.0; a_ = u; s_ = 0.4 + 0.6 * u
        else:
            a_, cx_, s_ = 1.0, keys[-1][1], keys[-1][2]
            for (t1, x1, s1), (t2, x2, s2) in zip(keys, keys[1:]):
                if t1 <= tb < t2:
                    u = (tb - t1) / (t2 - t1)
                    inside_tube = (x1 >= CXL + 151 and x2 <= CXR - 151)
                    e = u if inside_tube else ease(u)
                    cx_, s_ = lerp(x1, x2, e), lerp(s1, s2, e)
        draw_plasmid(pan, cx_, CY, ring_r, s_, a_)
        la = ease((tb - 2.6) / 0.4) * (1 - ease((tb - 6.5) / 0.4))
        if la > 0:
            lab = sprite(80, 140); dl = ImageDraw.Draw(lab)
            rrect(dl, 2, 2, 78, 32, 12, fill=WHITE, outline=INK, width=2.2)
            text(dl, 40, 18, 'copy', 21, INK, 'mm')
            top, bot = 34, 112 - 78 + (CY - ring_r * s_ - 6 - 112)
            dl.line(P([(40, 34), (40, bot)]), fill=rgba(INK), width=int(2 * SS))
            blit(pan, fade(lab, la), cx_ - 40, 78)
    # the labels
    text(d, CXL - 45, 282, 'resistant', 25, INK, 'mm')
    text(d, CXR + 45, 282, 'not resistant' if tb < 6.5 else 'resistant', 25, INK, 'mm')
    lp = ease((tb - 0.5) / 0.4)
    if lp > 0:
        lay = sprite(BW, 330); dl = ImageDraw.Draw(lay)
        dl.line(P([(CXL + 82, CY + ring_r + 6), (CXL + 82, 268)]), fill=rgba(INK), width=int(2 * SS))
        text(dl, CXL + 82 + 20, 282, 'plasmid', 25, INK, 'mm')
        blit(pan, fade(lay, lp), 0, 0)
    na = ease((tb - 7.2) / 0.5)
    if na > 0:
        lay = sprite(BW, 60); dl = ImageDraw.Draw(lay)
        text(dl, BW / 2, 30, 'DNA moves sideways, not from parent to child.', 25, INK, 'mm')
        blit(pan, fade(lay, na), 0, 338)
    rrect(d, BW - 250, 18, BW - 20, 66, 14, fill=INK)
    text(d, BW - 135, 43, 'Plasmid transfer', 25, WHITE, 'mm')
    pan.putalpha(ImageChops.multiply(pan.getchannel('A'), BASE['MB']))
    img.alpha_composite(pan, (BX * SS, BY * SS))
    draw_caption(img, 5, [1.0, ease((tb - 6.3) / 0.4)])
    return finish(img)


# ------------------------------------------------------------------------------------------------ the film
def frame(i):
    t = i / FPS
    if t < A_END: return render_A(t)
    if t < A_END + XF:
        u = (t - A_END) / XF
        bg = Image.new('RGB', (W, H), rgb3(BG))
        return Image.blend(render_A(A_END), bg, ease(u * 2)) if u < 0.5 else Image.blend(bg, render_B(t - A_END), ease(u * 2 - 1))
    return render_B(t - A_END)


def init():
    BASE['A'], BASE['B'] = make_base_A(), make_base_B()
    BASE['MA'], BASE['MB'] = panel_mask(PW, PH), panel_mask(BW, BH)


def work(args):
    i, folder = args
    frame(i).save(os.path.join(folder, '%04d.png' % i))
    return i


def main():
    init()
    build_state()
    tmp = pathlib.Path(os.environ.get('ANIM_TMP') or tempfile.mkdtemp())
    tmp.mkdir(parents=True, exist_ok=True)
    if '--stills' in sys.argv:
        for s in sys.argv[sys.argv.index('--stills') + 1:]:
            frame(int(round(float(s) * FPS))).save(tmp / ('still-%s.png' % s))
        print('stills in', tmp)
        return
    n = int(round(TOTAL * FPS))
    with get_context('fork').Pool(4) as pool:
        for k, _ in enumerate(pool.imap_unordered(work, [(i, str(tmp)) for i in range(n)], chunksize=8)):
            if k % 100 == 0: print('frame', k, 'of', n, flush=True)
    OUT.mkdir(parents=True, exist_ok=True)
    out = OUT / (NAME + '.mp4')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', str(tmp / '%04d.png'), '-c:v', 'libx264',
                    '-pix_fmt', 'yuv420p', '-crf', '26', '-preset', 'veryslow', '-movflags', '+faststart', str(out)], check=True)
    frame(int(round(COVER_T * FPS))).save(OUT / (NAME + '.png'))
    for f in tmp.glob('*.png'): f.unlink()
    print('%s: %d frames, %.1f s, %d KB' % (out.name, n, n / FPS, out.stat().st_size // 1024))


COVER_T = 2.9                                              # the cover: step 1, the two resistant bacteria picked out, no answer on it

if __name__ == '__main__':
    main()
