#!/usr/bin/env python3
"""
How Prokaryotes Live: the I Do animation for 'Describe how a prokaryote reproduces' (8I, Y8 Science, Unit 3 Prokaryotes).
PIL + ffmpeg, silent. It reuses the bacterium of build/media/prokaryotes_cells.py (same colours, same capsule, same wall band, membrane,
cytoplasm, ribosome dots, DNA loop and plasmid rings) so it is the SAME drawing the class has just labelled.

  prok-fission.mp4/png   Binary fission, then doubling. 960 x 540, 20 fps, about 33 s, PLAYS ON CLICK, and it PAUSES (about 2 s) after every step:
                           SCENE A (one big cell)
                             1  The DNA copies itself.                    the single DNA loop buds a second loop; each plasmid buds a twin
                             2  The cell grows longer. The copies move apart.   the capsule doubles in length; one loop and one of each plasmid pair go each way
                             3  A new wall grows across the middle.       membrane and wall pinch in from both sides until they meet: a lime wall band
                             4  The cell splits into two cells. They are identical.   the halves part and each becomes a complete capsule
                           SCENE B (the same idea, counted, small cells, 4 x 2 grid at the end)
                             a clock (top left) and a cell count (top right): 0 minutes 1 cell, then 20 minutes 2 cells,
                             40 minutes 4 cells, 60 minutes 8 cells, ending on "Every 20 minutes the number doubles." and 2 x 2 x 2 = 8.
                         The cover (png) is the dividing cell at the end of step 3, with no caption.

Every cell stays the same size from one generation to the next: a cell grows to twice its length, then splits into two cells of the original
length (340 px in scene A, 92 px in scene B). Nothing overlaps: --check tests every dot, loop and plasmid against the cell wall and each other
every 0.1 s, and every pair of small cells in scene B.

    python3 build/media/how-prokaryotes-live-media.py                  # writes assets/media/prok-fission.mp4 and .png
    python3 build/media/how-prokaryotes-live-media.py --check          # overlap checks only
    python3 build/media/how-prokaryotes-live-media.py --stills DIR 1.0 4.0 ...   # PNG stills at those times, to look at
"""
import argparse, math, os, pathlib, random, shutil, subprocess, sys, tempfile
from multiprocessing import Pool
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'build' / 'media'))
import prokaryotes_cells as pc                      # Layer, catmull, capsule, COL, dna_curve, DNA_C: the bacterium, drawn once

OUT = ROOT / 'assets' / 'media'
NAME = 'prok-fission'
W, H, FPS, SS = 960, 540, 20, pc.SS                 # SS = 3: draw at 3x, then downscale with LANCZOS
BG = 'F6F1F5'                                       # the slide colour, so the video blends in
ALERT = 'C73C28'
C = pc.COL
INK, CYTO, WALL, WALLLINE, DNA, PLASMID, RIBO = C['ink'], C['cyto'], C['wall'], C['wallline'], C['dna'], C['plasmid'], C['ribo']


def font(px):
    for p in (pc.FONT, '/System/Library/Fonts/Supplemental/Arial Bold.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if pathlib.Path(p).exists():
            return ImageFont.truetype(p, int(round(px * SS)))
    raise SystemExit('no bold font found')


FONTS = {}
def F(px):
    if px not in FONTS:
        FONTS[px] = font(px)
    return FONTS[px]


def ease(u):
    u = max(0.0, min(1.0, u))
    return u * u * (3 - 2 * u)


def prog(t, a, b):
    return max(0.0, min(1.0, (t - a) / (b - a)))


def lerp(a, b, u):
    return a + (b - a) * u


def mix(a, b, u):
    """Colour a to colour b (hex), u = 0..1."""
    pa = [int(a[i:i + 2], 16) for i in (0, 2, 4)]
    pb = [int(b[i:i + 2], 16) for i in (0, 2, 4)]
    return ''.join(f'{int(round(x + (y - x) * u)):02X}' for x, y in zip(pa, pb))


# ------------------------------------------------------------------------------------------------ timeline (seconds)
# scene A: the four steps. Each step: a caption, the move, then a hold of 2 s so a teacher can talk over it.
CAPS_A = [(0.0, '1  The DNA copies itself.'),
          (5.3, '2  The cell grows longer. The copies move apart.'),
          (9.9, '3  A new wall grows across the middle.'),
          (14.3, '4  The cell splits into two cells. They are identical.')]
T_BUD, T_PBUD = (0.7, 2.5), (2.5, 3.3)             # the main DNA loop buds a copy; each plasmid buds a twin
T_GROW = (5.5, 7.9)                                # the capsule doubles in length, the copies move apart
T_PINCH = (10.1, 12.3)                             # membrane and wall pinch in from both sides, a wall band across the middle
T_SPLIT = (14.5, 16.5)                             # the halves part and become complete capsules
TA = 18.5                                          # end of scene A (the last 0.3 s fades out)
# scene B (local time tb, starts at TA)
B_START = [None, 1.0, 5.0, 9.0]                    # each round: 2.5 s of dividing, then a hold (1.5 s, 1.5 s, 3.0 s)
B_ANIM = 2.5
T_FINAL = 11.5                                     # tb when the last round is done: the closing caption and 2 x 2 x 2 = 8
TB = 14.5
TOTAL = TA + TB
CAPS_B = [(0.3, '5  One division takes 20 minutes.'), (T_FINAL, 'Every 20 minutes the number doubles.')]
CAP_PX, CAP_Y = 32, 497
COVER_T = 14.0                                     # the dividing cell at the end of step 3


# ------------------------------------------------------------------------------------------------ the canvas
class Canvas(pc.Layer):
    """pc.Layer (poly, stroke, dot) on an opaque 960 x 540 canvas, drawn at 3x."""
    def __init__(self):
        self.im = Image.new('RGBA', (W * SS, H * SS), pc.rgba(BG))
        self.d = ImageDraw.Draw(self.im)

    def finish(self):
        return self.im.resize((W, H), Image.LANCZOS).convert('RGB')

    def text(self, xy, s, px, colour, anchor='mm'):
        self.d.text((xy[0] * SS, xy[1] * SS), s, font=F(px), fill=pc.rgba(colour), anchor=anchor)

    def ring(self, x, y, rx, ry, w, colour):
        self.d.ellipse([(x - rx) * SS, (y - ry) * SS, (x + rx) * SS, (y + ry) * SS], outline=pc.rgba(colour), width=max(1, int(round(w * SS))))


# ------------------------------------------------------------------------------------------------ rounded polygons
def rpoly(pts, radii):
    """A polygon with each corner rounded by its own radius (clamped to half the shorter edge): a smooth closed outline."""
    n = len(pts)
    out = []
    for i in range(n):
        p0, p1, p2 = pts[i - 1], pts[i], pts[(i + 1) % n]
        r = radii[i]
        ax, ay, bx, by = p0[0] - p1[0], p0[1] - p1[1], p2[0] - p1[0], p2[1] - p1[1]
        la, lb = math.hypot(ax, ay), math.hypot(bx, by)
        if r < 0.05 or la < 1e-6 or lb < 1e-6:
            out.append(p1)
            continue
        ux, uy, vx, vy = ax / la, ay / la, bx / lb, by / lb
        ang = math.acos(max(-1.0, min(1.0, ux * vx + uy * vy)))
        if ang < 1e-3 or ang > math.pi - 1e-3:
            out.append(p1)
            continue
        t = min(r / math.tan(ang / 2), 0.5 * min(la, lb))
        re = t * math.tan(ang / 2)
        a = (p1[0] + ux * t, p1[1] + uy * t)
        b = (p1[0] + vx * t, p1[1] + vy * t)
        sx, sy = ux + vx, uy + vy
        sl = math.hypot(sx, sy)
        cd = re / math.sin(ang / 2)
        cx, cy = p1[0] + sx / sl * cd, p1[1] + sy / sl * cd
        a0, a1 = math.atan2(a[1] - cy, a[0] - cx), math.atan2(b[1] - cy, b[0] - cx)
        d = a1 - a0
        while d > math.pi:
            d -= 2 * math.pi
        while d < -math.pi:
            d += 2 * math.pi
        m = max(3, int(abs(d) * re / 0.8) + 1)
        for k in range(m + 1):
            q = a0 + d * k / m
            out.append((cx + re * math.cos(q), cy + re * math.sin(q)))
    return out


class Geo:
    """The shape of one bacterium at one size. R = half the height (outer), band = the wall's thickness.
    Outer = the wall's outer edge (lime, dark green line). Inner = the membrane (plum line) round the cytoplasm.
    A cell divides in two stages:  parent(p)    p = 0..1: the wall and membrane pinch in from both sides (a V notch outside, a slot of wall inside)
                                   daughter()   two complete cells part and their new ends round off into capsules."""
    def __init__(self, R, band, lw, rc_frac=0.5):
        self.R, self.band, self.lw = R, band, lw
        self.Rin = R - band
        self.rc0 = rc_frac * R                      # corner radius of a daughter's new end at the moment the wall is complete
        self.rin0 = max(0.6, self.rc0 - band)       # the same corner on the membrane (concentric)

    def _outer_pinch(self, x0, x1, cy, D):
        """The wall's outline with a notch of depth D at the middle: two rounded corners (radius rc0) pressed together."""
        R, rc = self.R, self.rc0
        xm, top = (x0 + x1) / 2, cy - R
        Dc = 2 * math.sqrt(max(0.0, D * (2 * rc - D)))
        phic = math.atan2(D - rc, Dc / 2)
        n = max(6, int(rc * (phic + math.pi / 2) / 0.7))
        left = [(xm - Dc / 2 + rc * math.cos(a), top + rc + rc * math.sin(a)) for a in (-math.pi / 2 + (phic + math.pi / 2) * k / n for k in range(n + 1))]
        right = [(2 * xm - x, y) for x, y in reversed(left)][1:]
        arc = left + right                          # from the top, down to the cusp and back up to the top
        ncap = 48
        cap_l = [(x0 + R + R * math.cos(a), cy + R * math.sin(a)) for a in (math.pi / 2 + math.pi * k / ncap for k in range(ncap + 1))]
        cap_r = [(x1 - R + R * math.cos(a), cy + R * math.sin(a)) for a in (-math.pi / 2 + math.pi * k / ncap for k in range(ncap + 1))]
        bottom = [(x, 2 * cy - y) for x, y in reversed(arc)]
        return cap_l + arc + cap_r + bottom

    def _bags(self, x0, x1, cy):
        b, Rin, rin = self.band, self.Rin, self.rin0
        xm, top, bot = (x0 + x1) / 2, cy - Rin, cy + Rin
        left = rpoly([(x0 + b, top), (xm - b, top), (xm - b, bot), (x0 + b, bot)], [Rin, rin, rin, Rin])
        right = rpoly([(xm + b, top), (x1 - b, top), (x1 - b, bot), (xm + b, bot)], [rin, Rin, Rin, rin])
        return [left, right]

    def parent_layers(self, x0, x1, cy, p):
        """One cell from x0 to x1, p = how far the pinch has got (0 = plain capsule, 1 = two compartments with a wall band between).
        Returns [(weight, outer polygons, inner polygons), ...]: normally one layer. In the last few frames, while the two membranes meet,
        two: the film dissolves from the thin neck to the finished wall band, so there is no flash of a dark line where the membranes touch."""
        R, b, Rin = self.R, self.band, self.Rin
        if p <= 0.004:
            return [(1.0, [pc.capsule(x0, cy - R, x1, cy + R)], [pc.capsule(x0 + b, cy - Rin, x1 - b, cy + Rin)])]
        outer = self._outer_pinch(x0, x1, cy, p * self.rc0)
        nu = Rin * (1 - p)                          # half the thickness of the neck that still joins the two halves
        if nu <= 0.5 * self.lw:                     # the two membrane lines would touch: the neck is gone
            return [(1.0, [outer], self._bags(x0, x1, cy))]
        M = Rin * p                                 # how far the wall has grown in from each side
        xm, top, bot, xl, xr = (x0 + x1) / 2, cy - Rin, cy + Rin, x0 + b, x1 - b
        tip, lip = min(0.09 * Rin, 0.9 * nu), self.rin0
        pts = [(xl, top), (xm - b, top), (xm - b, top + M), (xm + b, top + M), (xm + b, top), (xr, top),
               (xr, bot), (xm + b, bot), (xm + b, bot - M), (xm - b, bot - M), (xm - b, bot), (xl, bot)]
        neck = [rpoly(pts, [Rin, lip, tip, tip, lip, Rin, Rin, lip, tip, tip, lip, Rin])]
        w = prog(nu, 0.5 * self.lw, 1.7 * self.lw)
        if w >= 1:
            return [(1.0, [outer], neck)]
        return [(1.0, [outer], self._bags(x0, x1, cy)), (w, [outer], neck)]

    def parent(self, x0, x1, cy, p):
        """The same as one pair of polygon lists (the last layer), for the checks."""
        _, o, i = self.parent_layers(x0, x1, cy, p)[-1]
        return o, i

    def daughter(self, c, cy, ell, rc, new_pole):
        """A cell of length ell centred on c whose NEW end ('R' or 'L') has corner radius rc (rc = R is a full capsule)."""
        R, b, Rin = self.R, self.band, self.Rin
        rin = max(0.6, rc - b)
        x0, x1 = c - ell / 2, c + ell / 2
        ro, ri = ([R, rc, rc, R], [Rin, rin, rin, Rin]) if new_pole == 'R' else ([rc, R, R, rc], [rin, Rin, Rin, rin])
        outer = rpoly([(x0, cy - R), (x1, cy - R), (x1, cy + R), (x0, cy + R)], ro)
        inner = rpoly([(x0 + b, cy - Rin), (x1 - b, cy - Rin), (x1 - b, cy + Rin), (x0 + b, cy + Rin)], ri)
        return outer, inner


def draw_body(cv, geo, outers, inners):
    for o in outers:
        cv.poly(o, fill=WALL)
    for o in outers:
        cv.stroke(o, geo.lw, WALLLINE, closed=True)
    for i in inners:
        cv.poly(i, fill=CYTO)
    for i in inners:
        cv.stroke(i, geo.lw, INK, closed=True)


def draw_layers(cv, geo, layers):
    """Draw the cell(s) of one frame: one layer, or (while the membranes meet) two layers dissolved into each other."""
    if len(layers) == 1:
        draw_body(cv, geo, layers[0][1], layers[0][2])
        return
    base, top = Canvas(), Canvas()
    draw_body(base, geo, layers[0][1], layers[0][2])
    draw_body(top, geo, layers[1][1], layers[1][2])
    cv.im = Image.blend(base.im, top.im, layers[1][0])
    cv.d = ImageDraw.Draw(cv.im)


# ------------------------------------------------------------------------------------------------ scene A: one big cell, four steps
XC, CY = 480, 232
R_A, BAND_A = 80, 14                                # 160 px high, a 14 px wall (0.32 x the diagram's 500 px / 44 px)
L_START, L_END, GMAX = 340.0, 680.0, 34.0           # a cell doubles its length, then splits into two cells of the first length
GEO_A = Geo(R_A, BAND_A, 3.0)
KD = 0.27                                           # the DNA loop's scale: the loop of prokaryotes_cells.py, smaller to fit two side by side
_rel = [(x - pc.DNA_C[0], y - pc.DNA_C[1]) for x, y in pc.catmull(pc.dna_curve(), closed=True, n=2)]
LOOP = [(x * KD, y * KD) for x, y in _rel]
RIM = max(LOOP, key=lambda q: q[0])                 # where the copy buds out: the loop's right-hand edge
DOT_A = 3.4
# the plasmid rings: (rx, ry, start, after step 1, after step 2); a twin buds from each and one of each pair goes each way
PLASMIDS = {
    'P1': (9, 8, (XC, CY - 52), (XC - 40, CY - 52), (XC - 130, CY - 52)),
    'P2': (8, 9, (XC, CY + 52), (XC - 40, CY + 52), (XC - 210, CY + 52)),
    "P1'": (9, 8, None, (XC + 40, CY - 52), (XC + 210, CY - 52)),
    "P2'": (8, 9, None, (XC + 40, CY + 52), (XC + 130, CY + 52)),
}


def a_geom(t):
    L = L_START + (L_END - L_START) * ease(prog(t, *T_GROW))
    return L, ease(prog(t, *T_PINCH)), ease(prog(t, *T_SPLIT))


def a_layers(t, geo):
    L, p, s = a_geom(t)
    x0, x1 = XC - L / 2, XC + L / 2
    if s <= 0:
        return geo.parent_layers(x0, x1, CY, p)
    ell, g = L / 2, GMAX * s
    rc = geo.rc0 + (geo.R - geo.rc0) * s
    ol, il = geo.daughter(x0 + ell / 2 - g / 2, CY, ell, rc, 'R')
    orr, ir = geo.daughter(x1 - ell / 2 + g / 2, CY, ell, rc, 'L')
    return [(1.0, [ol, orr], [il, ir])]


def a_body(t, geo):
    """(outer polygons, inner polygons) of scene A at time t: for the checks and for placing the dots."""
    _, o, i = a_layers(t, geo)[-1]
    return o, i


def a_contents(t):
    """Where the DNA loops and the plasmid rings are at time t: loops (x, y, scale), plasmids (x, y, rx, ry, scale)."""
    L, p, s = a_geom(t)
    ub, up, ug = ease(prog(t, *T_BUD)), ease(prog(t, *T_PBUD)), ease(prog(t, *T_GROW))
    dl, dr = -GMAX * s / 2, GMAX * s / 2
    ax = XC - 60 * ub - 110 * ug
    loops = [(ax + dl, CY, 1.0)]
    if ub > 0.02:                                   # the copy buds out of the original's edge and grows to full size beside it
        loops.append((lerp(ax + RIM[0], XC + 60, ub) + 110 * ug + dr, lerp(CY + RIM[1], CY, ub), ub))
    pl = []
    for key in ('P1', 'P2'):
        rx, ry, s0, s1, s2 = PLASMIDS[key]
        x = s0[0] + (s1[0] - s0[0]) * up + (s2[0] - s1[0]) * ug + dl
        pl.append((x, s0[1], rx, ry, 1.0))
        trx, trY, _, t1, t2 = PLASMIDS[key + "'"]
        if up > 0.02:
            tx = lerp(x - dl + rx, t1[0], up) + (t2[0] - t1[0]) * ug + dr
            pl.append((tx, lerp(s0[1], t1[1], up), trx, trY, up))
    return {'loops': loops, 'plasmids': pl}


def loop_pts(cx, cy, sc):
    return [(cx + sc * x, cy + sc * y) for x, y in LOOP]


def dot_pos(half, fx, fy, t):
    """A ribosome dot, by its place (fx 0..1 across its half, fy -1..1 up and down): the dots spread as the cell grows."""
    L, p, s = a_geom(t)
    lo, hi = XC - L / 2 + BAND_A + 10, XC - 40
    x, y = lo + fx * (hi - lo), CY + fy * (R_A - BAND_A - 12)
    g = GMAX * s
    return (x - g / 2, y) if half == 'L' else (2 * XC - x + g / 2, y)


def build_dots():
    """Ribosome dots for scene A, chosen once (seeded, so the film is the same every run): every dot is inside the membrane and clear of the
    loops, plasmids and other dots at every 0.25 s of the film. 10 per half at the start; 10 more per half appear as the cell grows, so each daughter ends with as many as the cell began with."""
    rnd = random.Random(8)
    inset, clear = 9, 20
    geo = Geo(R_A, BAND_A + inset, 3.0)
    ts = [k * 0.25 for k in range(int(TA / 0.25) + 1)]
    masks = []
    for t in ts:
        m = Image.new('L', (W, H), 255)
        d = ImageDraw.Draw(m)
        for poly in a_body(t, geo)[1]:
            d.polygon(poly, fill=0)
        c = a_contents(t)
        for cx, cy, sc in c['loops']:
            pts = loop_pts(cx, cy, sc)
            d.line(pts + [pts[0]], fill=255, width=int(2 * (DOT_A + 2 + 4)), joint='curve')
        for x, y, rx, ry, sc in c['plasmids']:
            r = max(rx, ry) * sc + DOT_A + 2 + 4
            d.ellipse((x - r, y - r, x + r, y + r), fill=255)
        masks.append(m)
    dots = {'L': [], 'R': []}
    for stage, (n, appear_range) in enumerate(((10, None), (10, (T_GROW[0] + 0.1, T_GROW[1] - 0.5)))):
        for k in range(n):
            for half in ('L', 'R'):
                for _ in range(4000):
                    fx, fy = rnd.random(), rnd.uniform(-1, 1)
                    ap = 0.0 if appear_range is None else rnd.uniform(*appear_range)
                    good = True
                    for m, t in zip(masks, ts):
                        if t < ap:
                            continue
                        x, y = dot_pos(half, fx, fy, t)
                        if not (0 <= x < W and 0 <= y < H) or m.getpixel((int(x), int(y))) != 0:
                            good = False
                            break
                    if good:
                        for m, t in zip(masks, ts):
                            if t >= ap:
                                x, y = dot_pos(half, fx, fy, t)
                                ImageDraw.Draw(m).ellipse((x - clear, y - clear, x + clear, y + clear), fill=255)
                        dots[half].append((fx, fy, ap))
                        break
    n = min(len(dots['L']), len(dots['R']))       # both daughters get the same number
    return {h: v[:n] for h, v in dots.items()}


DOTS = build_dots()


def a_dots(t):
    out = []
    for half in ('L', 'R'):
        for fx, fy, ap in DOTS[half]:
            a = 1.0 if ap <= 0 else ease(prog(t, ap, ap + 0.4))
            if a > 0.01:
                x, y = dot_pos(half, fx, fy, t)
                out.append((x, y, a))
    return out


def draw_caption(cv, caps, t):
    for i, (ts, text) in enumerate(caps):
        a_in = prog(t, ts + (0.15 if i else 0.0), ts + (0.45 if i else 0.4))
        t_end = caps[i + 1][0] if i + 1 < len(caps) else 1e9
        a = a_in * (1 - prog(t, t_end, t_end + 0.15))
        if a > 0.01:
            cv.text((W / 2, CAP_Y), text, CAP_PX, mix(BG, INK, a))


def frame_a(t, caption=True):
    cv = Canvas()
    draw_layers(cv, GEO_A, a_layers(t, GEO_A))
    for x, y, a in a_dots(t):
        cv.dot(x, y, DOT_A, mix(CYTO, RIBO, a))
    c = a_contents(t)
    for x, y, rx, ry, sc in c['plasmids']:
        if sc > 0.15:
            cv.ring(x, y, rx * sc, ry * sc, 3.2, PLASMID)
    for cx, cy, sc in c['loops']:
        cv.stroke(loop_pts(cx, cy, sc), 3.6 if sc > 0.5 else 3.6 * max(0.6, sc), DNA, closed=True)
    if caption:
        draw_caption(cv, CAPS_A, t)
    return cv


# ------------------------------------------------------------------------------------------------ scene B: the same idea, counted
R_B, BAND_B, L_B = 20, 5, 92.0
GEO_B = Geo(R_B, BAND_B, 1.8)
DOT_B = 4.2
Y0, YU, YD = 285, 230, 340                          # the grid: two rows, four columns (255 405 555 705)
CELLS_B = [[(480, Y0)],
           [(480, YU), (480, YD)],
           [(405, YU), (555, YU), (405, YD), (555, YD)],
           [(255, YU), (405, YU), (555, YU), (705, YU), (255, YD), (405, YD), (555, YD), (705, YD)]]
# each cell that divides in a round: where it is, which end stays put while it grows, where its two daughters go to
PARENTS_B = [None,
             [dict(c=(480, Y0), mode='sym', tL=(480, YU), tR=(480, YD), ywin=(1.55, 2.1), xwin=(1.85, 2.5))],
             [dict(c=(480, y), mode='sym', tL=(405, y), tR=(555, y), ywin=None, xwin=(1.5, 2.2)) for y in (YU, YD)],
             [d for y in (YU, YD) for d in (dict(c=(405, y), mode='right', tL=(255, y), tR=(405, y), ywin=None, xwin=(1.5, 2.2)),
                                           dict(c=(555, y), mode='left', tL=(555, y), tR=(705, y), ywin=None, xwin=(1.5, 2.2)))]]


def b_round(tb):
    k = 0
    for i in (1, 2, 3):
        if tb >= B_START[i]:
            k = i
    return k, (tb - B_START[k] if k else tb)


def b_parent(par, tr):
    """One dividing cell of scene B at time tr of its round: its layers (see Geo.parent_layers), its two DNA dots, and a box per cell for the overlap check."""
    geo = GEO_B
    (cx, cy0), mode = par['c'], par['mode']
    eg = ease(prog(tr, 0.0, 1.0))
    Lp = L_B * (1 + eg)
    if mode == 'sym':
        x0 = cx - Lp / 2
    elif mode == 'left':
        x0 = cx - L_B / 2
    else:
        x0 = cx + L_B / 2 - Lp
    x1 = x0 + Lp
    ed = ease(prog(tr, 0.15, 0.95))                 # the DNA dot copies itself and the two dots move to the middles of the future cells
    if tr < 1.5:
        layers = geo.parent_layers(x0, x1, cy0, ease(prog(tr, 0.85, 1.5)))
        dots = [(x0 + Lp / 2 - Lp / 4 * ed, cy0), (x0 + Lp / 2 + Lp / 4 * ed, cy0)]
        return layers, dots, [(x0, cy0 - R_B, x1, cy0 + R_B)]
    # the two daughters, from the middles of the two halves, to their places in the grid
    s = ease(prog(tr, 1.5, 2.2))
    rc = geo.rc0 + (geo.R - geo.rc0) * s
    ex = ease(prog(tr, *par['xwin']))
    ey = ease(prog(tr, *par['ywin'])) if par['ywin'] else 0.0
    c0L, c0R = x0 + L_B / 2, x0 + 1.5 * L_B         # Lp = 2 L_B by now
    cL = (lerp(c0L, par['tL'][0], ex), lerp(cy0, par['tL'][1], ey))
    cR = (lerp(c0R, par['tR'][0], ex), lerp(cy0, par['tR'][1], ey))
    ol, il = geo.daughter(cL[0], cL[1], L_B, rc, 'R')
    orr, ir = geo.daughter(cR[0], cR[1], L_B, rc, 'L')
    boxes = [(c[0] - L_B / 2, c[1] - R_B, c[0] + L_B / 2, c[1] + R_B) for c in (cL, cR)]
    return [(1.0, [ol, orr], [il, ir])], [cL, cR], boxes


def b_scene(tb):
    """Everything drawn in scene B: (layers, DNA dots, [(box, group)] for the overlap check). All cells divide together, so they share their layers."""
    k, tr = b_round(tb)
    if k == 0 or tr >= B_ANIM:
        outers, inners, dots, boxed = [], [], [], []
        for n, (x, y) in enumerate(CELLS_B[k]):
            _, o, i = GEO_B.parent_layers(x - L_B / 2, x + L_B / 2, y, 0.0)[0]
            outers += o
            inners += i
            dots.append((x, y))
            boxed.append(((x - L_B / 2, y - R_B, x + L_B / 2, y + R_B), ('c', n)))
        return [(1.0, outers, inners)], dots, boxed
    layers, dots, boxed = {}, [], []
    for n, par in enumerate(PARENTS_B[k]):
        lay, d, b = b_parent(par, tr)
        for m, (w, o, i) in enumerate(lay):
            cur = layers.setdefault(m, [w, [], []])
            cur[1] += o
            cur[2] += i
        dots += d
        boxed += [(bb, ('p', n)) for bb in b]
    return [tuple(layers[m]) for m in sorted(layers)], dots, boxed


def b_hud(tb):
    """(minutes shown, hand angle in minutes, cell count, seconds since the count changed)."""
    k, tr = b_round(tb)
    if k == 0:
        return 0.0, 1, None
    minutes = 20 * (k - 1) + 20 * ease(prog(tr, 0.0, 1.5))
    split = tr >= 1.52
    return minutes, 2 ** k if split else 2 ** (k - 1), (tr - 1.52 if split else None)


def clock_icon(cv, x, y, r, minutes):
    cv.d.ellipse([(x - r) * SS, (y - r) * SS, (x + r) * SS, (y + r) * SS], outline=pc.rgba(INK), width=int(3.5 * SS), fill=pc.rgba('FFFFFF'))
    for k in range(4):                              # 12, 3, 6 and 9
        a = math.pi / 2 * k
        cv.stroke([(x + (r - 7) * math.sin(a), y - (r - 7) * math.cos(a)), (x + (r - 3) * math.sin(a), y - (r - 3) * math.cos(a))], 2.5, INK)
    a = math.radians(minutes * 6)                   # 60 minutes is one full turn
    cv.stroke([(x, y), (x + (r - 6) * math.sin(a), y - (r - 6) * math.cos(a))], 3.5, INK)
    cv.dot(x, y, 2.6, INK)


def frame_b(tb, caption=True):
    cv = Canvas()
    layers, dots, boxed = b_scene(tb)
    draw_layers(cv, GEO_B, layers)
    for x, y in dots:
        cv.dot(x, y, DOT_B, DNA)
    minutes, count, since = b_hud(tb)
    clock_icon(cv, 66, 64, 27, minutes)
    shown = int(round(minutes / 5.0)) * 5
    cv.text((112, 64), f'{shown} minute{"" if shown == 1 else "s"}', 46, INK, anchor='lm')
    flash = 0.0 if since is None else 1 - prog(since, 0.5, 1.4)
    cv.text((W - 50, 64), f'{count} cell{"" if count == 1 else "s"}', 46, mix(INK, ALERT, flash), anchor='rm')
    if tb >= T_FINAL:
        cv.text((W - 50, 118), '2 × 2 × 2 = 8', 32, mix(BG, RIBO, ease(prog(tb, T_FINAL + 0.2, T_FINAL + 0.6))), anchor='rm')
    if caption:
        draw_caption(cv, CAPS_B, tb)
    return cv


# ------------------------------------------------------------------------------------------------ the film
def frame(t, caption=True):
    if t < TA:
        im = frame_a(t, caption).finish()
        a = 1 - prog(t, TA - 0.3, TA)               # scene A fades out
    else:
        tb = t - TA
        im = frame_b(tb, caption).finish()
        a = prog(tb, 0.0, 0.3)                      # scene B fades in
    if a < 1:
        im = Image.blend(Image.new('RGB', (W, H), '#' + BG), im, a)
    return im


def _render(args):
    i, d = args
    frame(i / FPS).save(pathlib.Path(d) / f'{i:04d}.png')


def build():
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = pathlib.Path(tempfile.mkdtemp(prefix='prok-fission-'))
    n = int(round(TOTAL * FPS))
    out = OUT / f'{NAME}.mp4'
    try:
        with Pool(max(1, os.cpu_count() or 1)) as pool:
            pool.map(_render, [(i, str(tmp)) for i in range(n)], chunksize=8)
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', str(tmp / '%04d.png'), '-an',
                        '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '26', '-preset', 'veryslow', '-movflags', '+faststart',
                        '-fflags', '+bitexact', '-flags:v', '+bitexact', '-map_metadata', '-1', str(out)], check=True)
        frame(COVER_T, caption=False).save(OUT / f'{NAME}.png')
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    print(f'{out.name}: {n} frames, {n / FPS:.1f} s, {out.stat().st_size / 1024:.0f} KB, {W}x{H}')


# ------------------------------------------------------------------------------------------------ checks
def check():
    """Overlap checks, every 0.1 s of the film. Scene A: loops, plasmids and dots inside the membrane, clear of each other.
    Scene B: no two small cells overlap (two cells of one pair may touch while they part)."""
    bad = {'loop outside membrane': 0, 'plasmid outside membrane': 0, 'dot outside membrane': 0, 'dot on loop or plasmid': 0,
           'loop on plasmid': 0, 'dots too close': 0, 'cells overlap (scene B)': 0}
    geo_m = Geo(R_A, BAND_A + 3.0, 3.0)             # the membrane, 3 px in: a thing may not touch the line
    geo_d = Geo(R_A, BAND_A + 5.5, 3.0)             # for the dots (radius 3.4)
    for k in range(int(TA * 10)):
        t = k / 10.0
        inside_m = Image.new('L', (W, H), 255)
        inside_d = Image.new('L', (W, H), 255)
        for m, g in ((inside_m, geo_m), (inside_d, geo_d)):
            d = ImageDraw.Draw(m)
            for poly in a_body(t, g)[1]:
                d.polygon(poly, fill=0)
        c = a_contents(t)
        loopm = Image.new('L', (W, H), 0)
        ld = ImageDraw.Draw(loopm)
        for cx, cy, sc in c['loops']:
            pts = loop_pts(cx, cy, sc)
            ld.line(pts + [pts[0]], fill=255, width=int(2 * (1.8 + 3.0)), joint='curve')
            if any(inside_m.getpixel((int(x), int(y))) for x, y in pts[::4]):
                bad['loop outside membrane'] += 1
        plm = Image.new('L', (W, H), 0)
        pd = ImageDraw.Draw(plm)
        for x, y, rx, ry, sc in c['plasmids']:
            r = max(rx, ry) * sc
            pd.ellipse((x - r - 4, y - r - 4, x + r + 4, y + r + 4), fill=255)
            if sc > 0.5 and any(inside_m.getpixel((int(x + math.cos(a) * rx * sc), int(y + math.sin(a) * ry * sc))) for a in [i * math.pi / 8 for i in range(16)]):
                bad['plasmid outside membrane'] += 1
        if any(loopm.getpixel((int(x), int(y))) and plm.getpixel((int(x), int(y))) for cx, cy, sc in c['loops'] for x, y in loop_pts(cx, cy, sc)[::3]):
            bad['loop on plasmid'] += 1
        dots = [(x, y) for x, y, a in a_dots(t) if a > 0.99]
        for x, y in dots:
            if inside_d.getpixel((int(x), int(y))):
                bad['dot outside membrane'] += 1
            if loopm.getpixel((int(x), int(y))) or plm.getpixel((int(x), int(y))):
                bad['dot on loop or plasmid'] += 1
        for i in range(len(dots)):
            for j in range(i):
                if math.hypot(dots[i][0] - dots[j][0], dots[i][1] - dots[j][1]) < 12:
                    bad['dots too close'] += 1
    for k in range(int(TB * 20)):
        tb = k / 20.0
        boxed = b_scene(tb)[2]
        for i in range(len(boxed)):
            for j in range(i):
                (a, ga), (b, gb) = boxed[i], boxed[j]
                gap = max(b[0] - a[2], a[0] - b[2], b[1] - a[3], a[1] - b[3])        # < 0: the boxes overlap
                sisters = ga == gb and ga[0] == 'p'                                   # two cells from one parent may touch while they part
                if gap < (-0.01 if sisters else 2.0):
                    bad['cells overlap (scene B)'] += 1
    for name, v in bad.items():
        print(f'  {name:28s} {v}')
    print('check:', 'OK' if not any(bad.values()) else 'PROBLEMS')
    return not any(bad.values())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--check', action='store_true', help='overlap checks only')
    ap.add_argument('--stills', nargs='+', metavar=('DIR', 'T'), help='write PNG stills at times T (seconds) into DIR, and stop')
    a = ap.parse_args()
    if a.check:
        sys.exit(0 if check() else 1)
    if a.stills:
        d = pathlib.Path(a.stills[0])
        d.mkdir(parents=True, exist_ok=True)
        for s in a.stills[1:]:
            frame(float(s)).save(d / f'still-{float(s):05.2f}.png')
        return
    build()


if __name__ == '__main__':
    main()
