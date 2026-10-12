#!/usr/bin/env python3
"""
The Bacteria We Need (Y8 Science, Unit 3 Prokaryotes): how bacteria are used to make human insulin. PIL + ffmpeg, silent.

  prok-insulin.mp4/png   960 x 540, 20 fps, about 36 s, and it PAUSES for 2 s at the end of every step:
                           1  Cut out the human gene for insulin.        scissors snip either side of the gene; it lifts out of the human DNA
                           2  Put the gene into a plasmid.               the plasmid ring is cut open, the gene slots into the gap, the ring is whole again
                           3  Put the plasmid into a bacterium.          the plasmid slides in through a gap in the cell wall
                           4  The bacterium makes insulin.               insulin molecules (orange and white drops) appear inside the cell and drift out
                           5  It divides every 20 minutes, ...           1, 2, 4, 8, 16 bacteria (every one carries the plasmid), then a tank of them
                           6  The insulin is collected, cleaned ...      drops flow out of the tank, through a filter, into a vial
                         The cover (png) is the first frame: the human DNA with the insulin gene marked.

The bacterium is the unit's own (build/media/prokaryotes_cells.py): its colours, its capsule shape, its main DNA loop.
Every frame is a pure function of the time, drawn at 3x and scaled down with LANCZOS, so the output is the same every run.

    python3 build/media/the-bacteria-we-need-media.py                  # writes assets/media/prok-insulin.mp4 and .png
    python3 build/media/the-bacteria-we-need-media.py --stills 3 9 15  # just writes those moments to PNG files (for looking)
"""
import argparse, math, os, pathlib, random, shutil, subprocess, sys, tempfile
from multiprocessing import Pool
from PIL import Image, ImageDraw, ImageFont

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(HERE))
sys.dont_write_bytecode = True                 # importing the cell module should not leave a __pycache__ in the repo
import prokaryotes_cells as pc            # the unit's bacterium: COL, catmull, capsule, in_capsule, dna_curve

OUT = ROOT / 'assets' / 'media'
W, H, S, FPS = 960, 540, 3, 20
FONT = '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'

# ------------------------------------------------------------------------------------------------ colours
BG = 'F6F1F5'                                           # the slide colour, so the video blends in
PLUM, LIME, LIMELINE, CYTO = pc.COL['ink'], pc.COL['wall'], pc.COL['wallline'], pc.COL['cyto']
DNAG, TEAL, RIBO = pc.COL['dna'], pc.COL['plasmid'], pc.COL['ribo']
RED, ORANGE, ORANGE_DK = 'C73C28', 'E8A25C', 'B8651B'   # alert red (cut lines), the human gene, its darker edge
BAND, RUNG, LILAC, LIQ, WHITE = 'FCE8CF', 'D7933F', 'D6B8E2', 'EBDDF2', 'FFFFFF'
assert (PLUM, LIME, LIMELINE, CYTO, DNAG, TEAL) == ('301338', 'B5E06A', '4C7A12', 'F0E2F4', '4C7A12', '167A74')

# ------------------------------------------------------------------------------------------------ timeline (seconds)
DUR = [6.1, 5.6, 4.8, 5.3, 8.0, 5.3]                     # each step, ending in a 2 s pause on the finished picture
START = [sum(DUR[:i]) for i in range(len(DUR))]
TAIL = 0.4
TOTAL = sum(DUR) + TAIL
CAPTIONS = ['Cut out the human gene for insulin.',
            'Put the gene into a plasmid.',
            'Put the plasmid into a bacterium.',
            'The bacterium makes insulin.',
            'It divides every 20 minutes, so there are billions of bacteria making insulin.',
            'The insulin is collected, cleaned and put in a pen or vial.']


def clamp(x, a=0.0, b=1.0): return max(a, min(b, x))
def ease(u): u = clamp(u); return u * u * (3 - 2 * u)
def ramp(t, a, b): return ease((t - a) / (b - a))
def lerp(a, b, u): return a + (b - a) * u
def rgb(h): return h if isinstance(h, tuple) else tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
def mix(a, b, u):
    a, b = rgb(a), rgb(b)
    return tuple(int(round(x + (y - x) * u)) for x, y in zip(a, b))


_FONTS = {}
def font(px):
    if px not in _FONTS:
        _FONTS[px] = ImageFont.truetype(FONT, int(round(px)))
    return _FONTS[px]


class Canvas:
    """A 3x canvas in logical (960 x 540) coordinates."""
    def __init__(self):
        self.im = Image.new('RGB', (W * S, H * S), rgb(BG))
        self.d = ImageDraw.Draw(self.im)

    def P(self, pts): return [(x * S, y * S) for x, y in pts]

    def poly(self, pts, fill):
        self.d.polygon(self.P(pts), fill=rgb(fill))

    def line(self, pts, w, col, caps=True):
        """A thick polyline: segments with a round dot at every vertex (PIL's own 'curve' joint leaves nicks on short segments)."""
        q = self.P(pts)
        wd = max(1, int(round(w * S)))
        self.d.line(q, fill=rgb(col), width=wd)
        r = w * S / 2
        dots = q if len(q) > 2 else (q if caps else [])
        for x, y in dots:
            self.d.ellipse([x - r, y - r, x + r, y + r], fill=rgb(col))

    def band(self, cx, cy, r, w, a0, a1, col):
        """A piece of a ring with flat ends: radius r, width w, from angle a0 to a1 (clockwise from the top)."""
        o = arc_pts(cx, cy, r + w / 2, a0, a1, 1.0)
        i = arc_pts(cx, cy, r - w / 2, a0, a1, 1.0)
        self.poly(o + i[::-1], col)

    def circle(self, x, y, r, fill=None, outline=None, w=0):
        self.d.ellipse([(x - r) * S, (y - r) * S, (x + r) * S, (y + r) * S], fill=rgb(fill) if fill else None,
                       outline=rgb(outline) if outline else None, width=int(round(w * S)))

    def ring(self, x, y, r, w, col):
        self.circle(x, y, r + w / 2, outline=col, w=w)

    def rrect(self, box, r, fill=None, outline=None, w=0, corners=None):
        x0, y0, x1, y1 = box
        self.d.rounded_rectangle([x0 * S, y0 * S, x1 * S, y1 * S], radius=max(0.5, r * S), fill=rgb(fill) if fill else None,
                                 outline=rgb(outline) if outline else None, width=int(round(w * S)), corners=corners)

    def rect(self, box, fill):
        x0, y0, x1, y1 = box
        self.d.rectangle([x0 * S, y0 * S, x1 * S, y1 * S], fill=rgb(fill))

    def text(self, x, y, s, size, col, anchor='mm'):
        self.d.text((x * S, y * S), s, font=font(size * S), fill=rgb(col), anchor=anchor)

    def out(self):
        return self.im.resize((W, H), Image.LANCZOS)


def label(c, x, y, s, fa=1.0, size=26, anchor='mm', col=PLUM, bg=BG):
    if fa > 0.02:
        c.text(x, y, s, size, mix(bg, col, fa), anchor)


def pointer(c, p, q, fa=1.0, bg=BG):
    if fa > 0.02:
        c.line([p, q], 2.5, mix(bg, PLUM, fa))


def arc_pts(cx, cy, r, a0, a1, step=2.0):
    """Points on a circle. The angle is measured clockwise from the top."""
    n = max(8, int(abs(a1 - a0) * r / step))
    return [(cx + r * math.sin(a0 + (a1 - a0) * i / n), cy - r * math.cos(a0 + (a1 - a0) * i / n)) for i in range(n + 1)]


# ------------------------------------------------------------------------------------------------ DNA: a twisting ladder
AMP, LAM = 30.0, 84.0                 # the helix: half-width and wavelength (px)
Y0 = 268                              # the human DNA, in step 1
LIFT = -125                           # how far the gene lifts out of it
GC, GL = 480, 152                     # the gene: its centre (also its phase) and its length
GX0, GX1 = GC - GL // 2, GC + GL // 2  # 404, 556 (the cut lines)
RETREAT = 14                          # how far each cut end draws back, so the cut is visible


def path_at(mx, my, kappa):
    """The centreline of a piece of DNA: straight (kappa = 0) or an arc of curvature kappa. Argument: the phase."""
    def at(ph):
        s = ph - GC
        if kappa < 1e-7:
            return (mx + s, my, 0.0, 1.0)
        f = kappa * s
        return (mx + math.sin(f) / kappa, my + (1 - math.cos(f)) / kappa, -math.sin(f), math.cos(f))
    return at


def stroke2(c, pts, w, e, fill, edge):
    c.line(pts, w + e, edge)
    c.line(pts, w, fill)


def runs(Z, positive):
    out, cur = [], None
    for i, z in enumerate(Z):
        if (z > 0) == positive:
            if cur is None:
                cur = [max(0, i - 1), i]
            else:
                cur[1] = i
        elif cur is not None:
            cur[1] = min(len(Z) - 1, i)
            out.append(tuple(cur)); cur = None
    if cur is not None:
        out.append(tuple(cur))
    return out


def helix(c, at, ph0, ph1, amp, w, fa=1.0, halo=BG):
    """A double helix drawn as a twisting ladder: two orange strands with rungs. Where the strands cross, the front one is on top."""
    if ph1 - ph0 < 2 or fa < 0.02:
        return
    n = max(2, int(math.ceil((ph1 - ph0) / 2.0)))
    A, B, Z = [], [], []
    for i in range(n + 1):
        ph = ph0 + (ph1 - ph0) * i / n
        x, y, nx, ny = at(ph)
        th = 2 * math.pi * ph / LAM
        o = amp * math.sin(th)
        A.append((x + nx * o, y + ny * o)); B.append((x - nx * o, y - ny * o)); Z.append(math.cos(th))
    fill, edge, hal = mix(BG, ORANGE, fa), mix(BG, ORANGE_DK, fa), rgb(halo)
    e = 3.0 * clamp((w - 2.2) / 2.8)
    if amp > 3:                                            # the rungs
        m = int(math.ceil(ph0 / 12.0))
        while m * 12 <= ph1:
            ph = m * 12
            x, y, nx, ny = at(ph)
            o = amp * math.sin(2 * math.pi * ph / LAM)
            c.line([(x + nx * o, y + ny * o), (x - nx * o, y - ny * o)], 3.2, mix(BG, RUNG, fa))
            m += 1
    if amp <= 8:                                           # nearly closed up: one twisted cord, no lines between the strands
        c.line(B, w + e, edge); c.line(A, w + e, edge)
        c.line(B, w, fill); c.line(A, w, fill)
        return
    stroke2(c, B, w, e, fill, edge)
    for i0, i1 in runs(Z, True):                           # strand A in front
        if amp > 8:
            c.line(A[i0:i1 + 1], w + e + 5, hal)
        stroke2(c, A[i0:i1 + 1], w, e, fill, edge)
    for i0, i1 in runs(Z, False):                          # strand B in front
        if amp > 8:
            c.line(B[i0:i1 + 1], w + e + 5, hal)
        stroke2(c, B[i0:i1 + 1], w, e, fill, edge)


def gene_band(c, at, ph0, ph1, w, fa=1.0):
    """The gene once its ladder has closed up: a plain orange strip with flat ends, w wide, following the path."""
    n = max(2, int(math.ceil((ph1 - ph0) / 2.0)))
    P = [at(ph0 + (ph1 - ph0) * i / n) for i in range(n + 1)]
    e = 3.0
    for ww, col in ((w + e, mix(BG, ORANGE_DK, fa)), (w, mix(BG, ORANGE, fa))):
        left = [(x + nx * ww / 2, y + ny * ww / 2) for x, y, nx, ny in P]
        right = [(x - nx * ww / 2, y - ny * ww / 2) for x, y, nx, ny in P]
        c.poly(left + right[::-1], col)


# ------------------------------------------------------------------------------------------------ the scissors
def scissors(c, px, py, a_deg, fa=1.0):
    """Two blades crossing at the pivot (px, py), pointing down, a_deg either side of vertical."""
    if fa < 0.02:
        return
    pl, li, wh = mix(BG, PLUM, fa), mix(BG, LILAC, fa), mix(BG, WHITE, fa)
    for sg in (1, -1):
        th = math.radians(sg * a_deg)
        co, si = math.cos(th), math.sin(th)
        R = lambda p: (px + p[0] * co - p[1] * si, py + p[0] * si + p[1] * co)
        blade = [R((sg * -9, -10)), R((sg * 6, -10)), R((sg * 2, 116)), R((sg * -3, 124))]
        c.poly(blade, li)
        c.line(blade + [blade[0]], 3.0, pl, caps=False)
        c.line([R((0, -8)), R((0, -50))], 8, pl)
        hx, hy = R((0, -68))
        c.ring(hx, hy, 17, 7, pl)
    c.circle(px, py, 8, fill=pl)
    c.circle(px, py, 2.6, fill=wh)


def snip_angle(t, t0, t1):
    if t < t0 or t > t1:
        return 26.0
    return 3.0 + 23.0 * (1 - math.sin(math.pi * (t - t0) / (t1 - t0)))


# ------------------------------------------------------------------------------------------------ the plasmid
R0, W0 = 105, 12                      # the plasmid ring in steps 1 to 2 (radius, line width)
RC = (480, 322)
TH0 = GL / (2 * R0)                   # half the angle of the gap that the gene fills
RC_TOP = RC[1] - R0
RING_R, RING_W = 34, 7                # the plasmid inside the bacterium


def plasmid(c, cx, cy, r, w, gap, gene, fa=1.0, gh=TH0):
    """A teal ring open by 'gap' at the top, with the orange gene closing it when gene is True."""
    if fa < 0.02:
        return
    teal = mix(BG, TEAL, fa)
    if gap < 0.01:
        c.ring(cx, cy, r, w, teal)
    else:
        c.band(cx, cy, r, w, gap, 2 * math.pi - gap, teal)
    if gene:
        e = 3.0 * clamp((w - 2.2) / 2.8)
        if e > 0.05:
            c.band(cx, cy, r, w + e, -gh, gh, mix(BG, ORANGE_DK, fa))
        c.band(cx, cy, r, w, -gh, gh, mix(BG, ORANGE, fa))


# ------------------------------------------------------------------------------------------------ the bacterium (the unit's style)
CELL = dict(cx=610, cy=250, L=620)
ASPECT = 260 / 620


def dims(L, tiny=False):
    k = L / 620.0
    if tiny:
        return dict(Hh=0.44 * L, wall=0.08 * L, ow=0.03 * L, mw=0.03 * L)
    return dict(Hh=ASPECT * L, wall=max(6.0, 22 * k), ow=max(2.0, 3.2 * k), mw=max(1.8, 3.5 * k))


def cap_pts(cx, cy, L, Hh, ang=0.0, grow=0.0):
    p = pc.capsule(cx - L / 2 - grow, cy - Hh / 2 - grow, cx + L / 2 + grow, cy + Hh / 2 + grow, n=24)
    if ang:
        co, si = math.cos(ang), math.sin(ang)
        p = [(cx + (x - cx) * co - (y - cy) * si, cy + (x - cx) * si + (y - cy) * co) for x, y in p]
    return p


def cell_body(c, items, L, fa=1.0, tiny=False):
    """Wall band, membrane line and cytoplasm for one or more cells at once. Drawn as a union, so two cells that are
    dividing show one outline with a waist, and no lines inside."""
    if fa < 0.02:
        return
    d = dims(L, tiny)
    Hh, wall, ow, mw = d['Hh'], d['wall'], d['ow'], d['mw']
    for cx, cy, ang in items:
        c.poly(cap_pts(cx, cy, L, Hh, ang, ow / 2), mix(BG, LIMELINE, fa))
    for cx, cy, ang in items:
        c.poly(cap_pts(cx, cy, L, Hh, ang, -ow / 2), mix(BG, LIME, fa))
    for cx, cy, ang in items:
        c.poly(cap_pts(cx, cy, L - 2 * wall, Hh - 2 * wall, ang, mw / 2), mix(BG, PLUM, fa))
    for cx, cy, ang in items:
        c.poly(cap_pts(cx, cy, L - 2 * wall, Hh - 2 * wall, ang, -mw / 2), mix(BG, CYTO, fa))


_DNA = pc.catmull(pc.dna_curve(), closed=True, n=2)
_DNA_REL = [(x - pc.DNA_C[0], y - pc.DNA_C[1]) for x, y in _DNA]


def rot(p, ang):
    co, si = math.cos(ang), math.sin(ang)
    return (p[0] * co - p[1] * si, p[0] * si + p[1] * co)


def cell_contents(c, items, L, fa=1.0, dna=True, plas=True, tiny=False):
    """The unit's green main DNA loop, and the plasmid with the orange gene, inside each cell."""
    if fa < 0.02:
        return
    k = L / 620.0
    for cx, cy, ang in items:
        if dna:
            pts = []
            for x, y in _DNA_REL:
                q = rot((x * 0.55 * k + 130 * k, y * 0.55 * k), ang)
                pts.append((cx + q[0], cy + q[1]))
            c.line(pts + [pts[0]], max(2.0, 5 * k), mix(CYTO, DNAG, fa), caps=False)
        if plas:
            if tiny:
                q = rot((0.0, 0.0), ang); r = 0.1 * L; w = 0.05 * L
            else:
                q = rot((-155 * k, 0.0), ang); r = max(RING_R * k, 8.0); w = max(2.8, RING_W * k)
            gh = TH0 + (1.1 - TH0) * clamp((RING_R - r) / (RING_R - 8.0))
            plasmid(c, cx + q[0], cy + q[1], r, w, gh, True, fa, gh)


def ribosome_spots():
    rnd = random.Random(7)
    out, tries = [], 0
    while len(out) < 16 and tries < 8000:
        tries += 1
        x, y = rnd.uniform(322, 898), rnd.uniform(142, 358)
        if not pc.in_capsule(x, y, 322, 142, 898, 358, margin=16):
            continue
        if 360 < x < 548:                                    # the plasmid, its label, the way in and the way out
            continue
        if ((x - 740) / 120) ** 2 + ((y - 250) / 100) ** 2 < 1:   # the main DNA loop
            continue
        if any((x - a) ** 2 + (y - b) ** 2 < 46 ** 2 for a, b in out):
            continue
        out.append((x, y))
    return out


RIBOS = ribosome_spots()


def door_left(c, h):
    """A gap through the wall at the left tip of the big bacterium, h tall either side of the middle."""
    if h < 0.5:
        return
    x0 = CELL['cx'] - CELL['L'] / 2
    cy = CELL['cy']
    c.rect((x0 - 4, cy - h, x0 + 24.5, cy + h), BG)
    c.rect((x0 + 24.5, cy - h, x0 + 30, cy + h), CYTO)


def door_top(c, h, x=500):
    """A gap through the wall at the top of the big bacterium, h wide either side of x."""
    if h < 0.5:
        return
    y0 = CELL['cy'] - ASPECT * CELL['L'] / 2
    c.rect((x - h, y0 - 4, x + h, y0 + 24.5), BG)
    c.rect((x - h, y0 + 24.5, x + h, y0 + 30), CYTO)


# ------------------------------------------------------------------------------------------------ insulin
def drop(c, x, y, r, fa=1.0, bg=BG):
    """An insulin molecule: an orange drop with a white highlight."""
    if fa < 0.02 or r < 0.8:
        return
    cc = (x, y + 0.3 * r)
    tip = (x, y - 1.9 * r)
    pts = [tip]
    a = math.radians(-27)
    while a < math.radians(207):
        pts.append((cc[0] + r * math.cos(a), cc[1] + r * math.sin(a)))
        a += math.radians(6)
    pts.append((cc[0] + r * math.cos(math.radians(207)), cc[1] + r * math.sin(math.radians(207))))
    e = max(1.4, 0.2 * r)
    c.line(pts + [pts[0]], e, mix(bg, ORANGE_DK, fa), caps=False)
    c.poly(pts, mix(bg, ORANGE, fa))
    c.circle(x - 0.38 * r, y + 0.05 * r, 0.3 * r, fill=mix(bg, WHITE, fa))


# step 4: where each of the six drops comes to rest above the cell
DROP_REST = [(525, 72), (575, 100), (620, 56), (668, 92), (712, 58), (752, 96)]
DOOR_TOP_X = 500


def drop_path(i, tau):
    """Position and size of drop i, tau seconds after it first appears. Out of the plasmid, up through the gap, then away."""
    P0 = (RING_R * 0 + CELL['cx'] - 155, CELL['cy'] - RING_R - 2)
    D = (DOOR_TOP_X, CELL['cy'] - ASPECT * CELL['L'] / 2 + 11)
    R = DROP_REST[i]
    if tau < 0.45:
        u = tau / 0.45
        p = (lerp(P0[0], D[0], u), lerp(P0[1], D[1], u))
    else:
        u = 1 - (1 - clamp((tau - 0.45) / 0.7)) ** 2
        p = (lerp(D[0], R[0], u), lerp(D[1], R[1], u))
    return p, lerp(3.0, 10.5, ease(tau / 0.3))


# ------------------------------------------------------------------------------------------------ step 5: dividing, the tank
PX, PY = 130, 62                                       # grid pitch of the sixteen cells
CL_C = (480, 262)


def _layouts():
    cells = [(gx, gy) for gx in range(4) for gy in range(4)]
    bits = lambda gx, gy: (gx >> 1, gy >> 1, gx & 1, gy & 1)
    levels = []
    for lv in range(5):
        groups = {}
        for gx, gy in cells:
            groups.setdefault(bits(gx, gy)[:lv], []).append(((gx - 1.5) * PX, (gy - 1.5) * PY))
        pos = [None] * (2 ** lv)
        for key, pts in groups.items():
            idx = int(''.join(map(str, key)), 2) if key else 0
            pos[idx] = (CL_C[0] + sum(p[0] for p in pts) / len(pts), CL_C[1] + sum(p[1] for p in pts) / len(pts))
        levels.append(pos)
    return levels


LAYOUT = _layouts()
DIV = [(1.4, 2.4), (2.5, 3.3), (3.4, 4.1), (4.2, 4.8)]  # when each division happens (seconds into step 5)
SHRINK = (0.3, 1.1)
CLUSTER_OUT = (5.1, 5.3)
TANK_IN = (5.3, 5.6)
POP = (5.55, 6.0)                                      # tank contents appear between these times


def cluster_items(t5):
    """The cells at this moment, and the count, and the sweep of the clock."""
    n = 0
    for k, (a, b) in enumerate(DIV, start=1):
        if t5 < a:
            return LAYOUT[k - 1], 2 ** (k - 1), k - 1, 0.0
        if t5 < b:
            e = ease((t5 - a) / (b - a))
            par, chi = LAYOUT[k - 1], LAYOUT[k]
            items = []
            for j, p in enumerate(par):
                for ch in (chi[2 * j], chi[2 * j + 1]):
                    items.append((lerp(p[0], ch[0], e), lerp(p[1], ch[1], e)))
            return items, (2 ** k if e > 0.5 else 2 ** (k - 1)), k - 1, e
    return LAYOUT[4], 16, 3, 1.0


# the tank (coordinates relative to the middle of the tank body)
TW, TH_, TR, LIQ_TOP = 215, 155, 55, -115


def inside_tank(x, y, m):
    if abs(x) > TW - m or y < LIQ_TOP + m or y > TH_ - m:
        return False
    cxx = TW - TR
    if y > TH_ - TR and abs(x) > cxx:
        return math.hypot(abs(x) - cxx, y - (TH_ - TR)) <= TR - m
    return True


def _tank_contents():
    rnd = random.Random(11)
    cells, tries = [], 0
    while len(cells) < 46 and tries < 40000:
        tries += 1
        x, y = rnd.uniform(-TW, TW), rnd.uniform(LIQ_TOP, TH_)
        if not inside_tank(x, y, 24):
            continue
        if any((x - a) ** 2 + (y - b) ** 2 < 38 ** 2 for a, b, _ in cells):
            continue
        cells.append((x, y, rnd.uniform(0, math.pi)))
    drops, tries = [], 0
    while len(drops) < 26 and tries < 40000:
        tries += 1
        x, y = rnd.uniform(-TW, TW), rnd.uniform(LIQ_TOP, TH_)
        if not inside_tank(x, y, 16):
            continue
        if any((x - a) ** 2 + (y - b) ** 2 < 27 ** 2 for a, b, _ in cells):
            continue
        if any((x - a) ** 2 + (y - b) ** 2 < 24 ** 2 for a, b in drops):
            continue
        drops.append((x, y))
    rnd2 = random.Random(5)
    cells_t = [rnd2.uniform(POP[0], POP[1] - 0.25) for _ in cells]
    drops_t = [rnd2.uniform(POP[0], POP[1] - 0.25) for _ in drops]
    return cells, drops, cells_t, drops_t


T_CELLS, T_DROPS, T_CELLS_T, T_DROPS_T = _tank_contents()
T_LEN = 46.0
# the drops that are collected in step 6: the ten nearest the outlet (bottom right)
COLLECT = sorted(range(len(T_DROPS)), key=lambda i: (T_DROPS[i][0] - TW) ** 2 + (T_DROPS[i][1] - 40) ** 2)[:10]

# step 6 geometry (absolute)
TANK6 = (220, 270, 0.62)
OUTLET = (353, 300)
NOZZLE_X = 720
PIPE = [OUTLET, (NOZZLE_X, 300), (NOZZLE_X, 346)]
FILTER = (460, 262, 540, 338)
VIAL_BODY = (676, 352, 764, 434)
VIAL_IN = (681, 357, 759, 429)
FLOW_T0, FLOW_GAP, FLOW_SPEED = 1.1, 0.12, 450.0       # when the first collected drop sets off, the gap between drops, px per second


def vial_level(t6):
    return VIAL_IN[3] - 50 * ramp(t6, 2.2, 3.8)


def collected(j, t6):
    """Collected drop number j in step 6: its position, or None before it sets off or once it has joined the insulin in the vial."""
    tau = t6 - (FLOW_T0 + FLOW_GAP * j)
    if tau <= 0:
        return None
    x, y = T_DROPS[COLLECT[j]]
    ox, oy, sc = TANK6
    full = [(ox + x * sc, oy + y * sc), OUTLET, (NOZZLE_X, 300), (NOZZLE_X, VIAL_IN[3] - 4)]
    q = along(full, FLOW_SPEED * tau)
    if q[0] >= NOZZLE_X - 0.5 and q[1] >= vial_level(t6) - 5:
        return None
    return q


def tank_pose(t6):
    if t6 < 0:
        return (410, 265, 1.0)
    u = ease(t6 / 0.5)
    return tuple(lerp(a, b, u) for a, b in zip((410, 265, 1.0), TANK6))


def draw_tank(c, ox, oy, sc, fa=1.0):
    X = lambda x: ox + x * sc
    Y = lambda y: oy + y * sc
    ow = max(2.5, 5 * sc)
    c.rrect((X(-TW), Y(-TH_), X(TW), Y(TH_)), TR * sc, fill=mix(BG, WHITE, fa), outline=mix(BG, PLUM, fa), w=ow)
    c.rrect((X(-TW) + ow, Y(LIQ_TOP), X(TW) - ow, Y(TH_) - ow), TR * sc - ow, fill=mix(BG, LIQ, fa), corners=(False, False, True, True))
    c.rrect((X(-110), Y(-TH_ - 22), X(110), Y(-TH_)), 6 * sc, fill=mix(BG, PLUM, fa))


def poly_len(path):
    return sum(math.hypot(b[0] - a[0], b[1] - a[1]) for a, b in zip(path, path[1:]))


def along(path, s):
    """The point s px along a polyline."""
    for a, b in zip(path, path[1:]):
        d = math.hypot(b[0] - a[0], b[1] - a[1])
        if s <= d:
            return (lerp(a[0], b[0], s / d), lerp(a[1], b[1], s / d))
        s -= d
    return path[-1]


def partial(path, frac):
    L = poly_len(path) * frac
    out = [path[0]]
    for a, b in zip(path, path[1:]):
        d = math.hypot(b[0] - a[0], b[1] - a[1])
        if L >= d:
            out.append(b); L -= d
        else:
            out.append((lerp(a[0], b[0], L / d), lerp(a[1], b[1], L / d)))
            break
    return out


def hatch(c, box, step, col):
    x0, y0, x1, y1 = box
    d = -(y1 - y0)
    while d < (x1 - x0):
        pts = []
        for (px, py) in ((x0 + d, y0), (x0 + d + (y1 - y0), y1)):
            pts.append((px, py))
        (ax, ay), (bx, by) = pts
        if ax < x0:
            ay += x0 - ax; ax = x0
        if bx > x1:
            by -= bx - x1; bx = x1
        if ax < bx and ay <= y1 and by >= y0:
            c.line([(ax, ay), (bx, by)], 3, col, caps=False)
        d += step


def clock(c, cx, cy, r, hand_deg, w0, w1, fa=1.0):
    pl = mix(BG, PLUM, fa)
    c.circle(cx, cy, r, fill=mix(BG, WHITE, fa), outline=pl, w=4)
    if w1 - w0 > 0.5:                                      # the part of the hour that has gone by in this step
        pts = [(cx, cy)] + [(cx + (r - 3) * math.sin(math.radians(a)), cy - (r - 3) * math.cos(math.radians(a)))
                            for a in [w0 + (w1 - w0) * i / 24 for i in range(25)]]
        c.poly(pts, mix(BG, 'BFE3DF', fa))
    for i in range(12):
        a = math.radians(30 * i)
        c.line([(cx + (r - 9) * math.sin(a), cy - (r - 9) * math.cos(a)), (cx + (r - 3) * math.sin(a), cy - (r - 3) * math.cos(a))], 2.2, pl, caps=False)
    a = math.radians(hand_deg)
    c.line([(cx, cy), (cx + (r - 9) * math.sin(a), cy - (r - 9) * math.cos(a))], 4, pl)
    c.circle(cx, cy, 4, fill=pl)


# ------------------------------------------------------------------------------------------------ captions
_cap_font = ImageFont.truetype(FONT, 29)
CAP_X0, CAP_MAXW = 100, 830


def _wrap(text):
    if _cap_font.getlength(text) <= CAP_MAXW:
        return [text]
    words = text.split(' ')
    best = None
    for i in range(1, len(words)):
        a, b = ' '.join(words[:i]), ' '.join(words[i:])
        m = max(_cap_font.getlength(a), _cap_font.getlength(b))
        if best is None or m < best[0]:
            best = (m, [a, b])
    return best[1]


CAP_LINES = [_wrap(t) for t in CAPTIONS]


def draw_caption(c, i, fa):
    if fa < 0.02:
        return
    lines = CAP_LINES[i]
    ys = [494] if len(lines) == 1 else [476, 512]
    c.circle(62, 494, 21, fill=mix(BG, PLUM, fa))
    c.text(62, 495, str(i + 1), 27, mix(BG, WHITE, fa))
    for s, y in zip(lines, ys):
        c.text(CAP_X0, y, s, 29, mix(BG, PLUM, fa), 'lm')


def caption_alpha(t, i):
    a = 1.0 if i == 0 else ramp(t, START[i] + 0.2, START[i] + 0.5)
    if i + 1 < len(START):
        a *= 1 - ramp(t, START[i + 1], START[i + 1] + 0.2)
    return a


# ------------------------------------------------------------------------------------------------ the frame
def gene_pose(t):
    """Where the gene is, how bent, how wide its ladder is, how thick its strands, how visible its highlight."""
    if t < START[1]:
        return GC, Y0 + LIFT * ease((t - 3.4) / 0.7), 0.0, AMP, 7.0, 1.0
    t2 = t - START[1]
    if t2 < 2.4:
        u = ease(t2 / 0.6)
        return lerp(GC, 730, u), lerp(Y0 + LIFT, 170, u), 0.0, AMP, 7.0, 1 - ramp(t2, 0, 0.4)
    u = ease((t2 - 2.4) / 0.9)
    # the ladder closes up in the first 60 % of the way in, then the strip thickens to the width of the ring
    return lerp(730, GC, u), lerp(170, RC_TOP, u), u / R0, AMP * (1 - ease(u / 0.6)), 7 + 5 * ease((u - 0.5) / 0.4), 0.0


def frame(t):
    c = Canvas()
    t1, t2, t3, t4, t5, t6 = [t - s for s in START]

    # ---------------- step 1 and the gene (steps 1 and 2)
    if t < START[2]:
        gx, gy, kap, amp, gw, band_a = gene_pose(t)
        if t < START[1] + 0.5:
            fa_body = 1 - ramp(t, START[1], START[1] + 0.4)
            cutL = ramp(t1, 1.62, 1.8)
            cutR = ramp(t1, 2.72, 2.9)
            at = path_at(GC, Y0, 0)
            helix(c, at, -30, GX0 - RETREAT * cutL, AMP, 7, fa_body)
            helix(c, at, GX1 + RETREAT * cutR, 990, AMP, 7, fa_body)
            # the highlight behind the gene
        if band_a > 0.02:
            hw = GL / 2 + 12
            c.rrect((gx - hw, gy - 52, gx + hw, gy + 52), 16, fill=mix(BG, BAND, band_a), outline=mix(BG, ORANGE, band_a), w=3)
        if amp < 0.5:
            gene_band(c, path_at(gx, gy, kap), GX0, GX1, gw)
        else:
            helix(c, path_at(gx, gy, kap), GX0, GX1, amp, gw, 1.0, halo=mix(BG, BAND, band_a))
        if t < START[1]:
            for x, a in ((GX0, 1 - ramp(t1, 1.62, 1.8)), (GX1, 1 - ramp(t1, 2.72, 2.9))):    # the cut lines
                if a > 0.02:
                    yy = Y0 - 72
                    while yy < Y0 + 72:
                        c.line([(x, yy), (x, min(yy + 10, Y0 + 72))], 3.5, mix(BG, RED, a), caps=False)
                        yy += 17
        # labels
        if t < START[1] + 0.5:
            fa_l = 1 - ramp(t, START[1], START[1] + 0.4)
            label(c, 70, Y0 + 84, 'human DNA', fa_l, anchor='lm')
            pointer(c, (118, Y0 + 41), (118, Y0 + 64), fa_l)
            fa_g = 1 - ramp(t1, 3.4, 3.7)
            label(c, GC, Y0 + 88, 'insulin gene', fa_g)
            pointer(c, (GC, Y0 + 58), (GC, Y0 + 70), fa_g)
        fa_g2 = ramp(t1, 3.9, 4.3) * (1 - ramp(t3, 0, 0.3)) if t >= 3.9 else 0
        if fa_g2 > 0.02:
            label(c, gx, gy - 80, 'insulin gene', fa_g2)
        # the scissors, for the gene
        if t1 < 3.5:
            u = ramp(t1, 0.8, 1.4) * (1 - ramp(t1, 3.0, 3.4))
            sx = lerp(GX0, GX1, ease((t1 - 1.9) / 0.6))
            a = snip_angle(t1, 1.4, 1.9) if t1 < 2.2 else snip_angle(t1, 2.5, 3.0)
            scissors(c, sx, Y0 - 85 - 120 * (1 - u), a, u)

    # ---------------- step 2: the plasmid
    if START[1] <= t < START[2] + 1.2:
        if t < START[2]:
            al = ramp(t2, 0, 0.5)
            gap = 0.05 * ramp(t2, 1.25, 1.35)
            if t2 > 1.7:
                gap = lerp(0.05, TH0, ease((t2 - 1.7) / 0.6))
            plasmid(c, RC[0], RC[1], R0, W0, gap, False, al)
            label(c, RC[0], RC[1], 'plasmid', al, size=30)
            # the scissors, for the ring
            u = ramp(t2, 0.6, 1.0) * (1 - ramp(t2, 1.5, 1.8))
            if u > 0.02:
                scissors(c, RC[0], RC_TOP - 85 - 120 * (1 - u), snip_angle(t2, 1.0, 1.5), u)
            # the join
            f = ramp(t2, 3.3, 3.45) * (1 - ramp(t2, 3.5, 3.9))
            if f > 0.02:
                for sgn in (-1, 1):
                    a0 = sgn * TH0
                    for da in (-0.28, 0.0, 0.28):
                        ang = a0 + da + (0.0 if da else 0.0)
                        p0 = (RC[0] + (R0 + 14) * math.sin(ang), RC[1] - (R0 + 14) * math.cos(ang))
                        p1 = (RC[0] + (R0 + 30) * math.sin(ang), RC[1] - (R0 + 30) * math.cos(ang))
                        c.line([p0, p1], 3.5, mix(BG, ORANGE_DK, f))
    if t >= START[2]:
        pass

    # ---------------- steps 3 to 5: the bacterium
    if t >= START[2]:
        # the plasmid
        if t < START[3]:
            u = ease(t3 / 0.7)
            pr, pw = lerp(R0, RING_R, u), lerp(W0, RING_W, u)
            px, py = lerp(RC[0], 205, u), lerp(RC[1], 250, u)
            px = lerp(px, 455, ease((t3 - 1.2) / 1.2)) if t3 > 1.2 else px
        else:
            pr, pw, px, py = RING_R, RING_W, 455, 250
        a_cell = ramp(t3, 0.3, 0.9) if t < START[3] else 1.0
        # the big bacterium (until step 5 shrinks it)
        if t < START[4] + SHRINK[1]:
            k_sh = ease((t5 - SHRINK[0]) / (SHRINK[1] - SHRINK[0])) if t5 > 0 else 0.0
            L = lerp(CELL['L'], 110.0, k_sh)
            cx, cy = lerp(CELL['cx'], CL_C[0], k_sh), lerp(CELL['cy'], CL_C[1], k_sh)
            fa_cell = a_cell
            cell_body(c, [(cx, cy, 0.0)], L, fa_cell)
            if t < START[4] + 0.3:                               # ribosomes (they go before the cell shrinks)
                fr = fa_cell * (1 - ramp(t5, 0.0, 0.3)) if t >= START[4] else fa_cell
                for x, y in RIBOS:
                    c.circle(x, y, 5, fill=mix(mix(BG, CYTO, fa_cell), RIBO, fr))
            if t < START[4]:
                cell_contents(c, [(cx, cy, 0.0)], L, fa_cell, plas=False)
            else:
                cell_contents(c, [(cx, cy, 0.0)], L, fa_cell, plas=True)
            # the way in: the left door
            if t < START[3]:
                h = 40 * ramp(t3, 0.7, 1.1) * (1 - ramp(t3, 2.4, 2.8))
                door_left(c, h)
            # the way out: the top door
            if START[3] <= t < START[4]:
                h = 22 * ramp(t4, 0.8, 1.1) * (1 - ramp(t4, 2.8, 3.1))
                door_top(c, h, DOOR_TOP_X)
        # the plasmid, on top of the cell wall
        if t < START[4]:
            plasmid(c, px, py, pr, pw, TH0, True, 1.0)
            # its label: inside the ring while the ring is big, then underneath it; hidden while the ring crosses the wall
            if t < START[3]:
                inside = 1 - ramp(t3, 0.0, 0.2)
                below = ramp(t3, 0.5, 0.8)
                below *= 1 - ramp(px, 232, 258) + ramp(px, 385, 410) if px < 410 else 1.0
                below = clamp(below)
                label(c, RC[0], RC[1], 'plasmid', inside, size=30)
                label(c, px, py + pr + 26, 'plasmid', below, size=26)
            else:
                label(c, px, py + pr + 26, 'plasmid', 1.0, size=26)
        # the label for the bacterium
        if t < START[4] + 0.3:
            fb = ramp(t3, 0.6, 1.0) * (1 - ramp(t5, 0.0, 0.3)) if t >= START[4] else ramp(t3, 0.6, 1.0)
            label(c, CELL['cx'], 410, 'bacterium', fb)
            pointer(c, (CELL['cx'], 384), (CELL['cx'], 394), fb)
        if START[3] <= t < START[4] + 0.3:
            # step 4: pulse, then the insulin drops
            for p0 in (0.0, 0.5):
                u = (t4 - p0) / 0.5
                if 0 < u < 1 and t < START[4]:
                    rr = lerp(10, 44, u ** 0.7)
                    c.ring(px, py - RING_R + 4, rr, 4.0, mix(CYTO, ORANGE, (1 - u) ** 0.5))
            fo = 1 - ramp(t5, 0.0, 0.3) if t >= START[4] else 1.0
            for i in range(6):
                tau = t4 - (0.7 + 0.3 * i) if t < START[4] else 9.0
                if tau > 0 and fo > 0.02:
                    p, r = drop_path(i, min(tau, 5.0))
                    inside_cell = p[1] > CELL['cy'] - ASPECT * CELL['L'] / 2 + 6
                    drop(c, p[0], p[1], r, fo, bg=CYTO if inside_cell else BG)
            fi = ramp(t4, 1.6, 2.0) * fo
            label(c, 782, 80, 'insulin', fi, anchor='lm')
            pointer(c, (775, 82), (757, 88), fi)

    # ---------------- step 5: 1, 2, 4, 8, 16
    if START[4] + SHRINK[1] <= t < START[4] + CLUSTER_OUT[1]:
        items, n, k_done, e = cluster_items(t5)
        fa = 1 - ramp(t5, *CLUSTER_OUT)
        its = [(x, y, 0.0) for x, y in items]
        cell_body(c, its, 110.0, fa)
        cell_contents(c, its, 110.0, fa)
        fa_ui = ramp(t5, 0.9, 1.3) * fa
        label(c, 110, 205, str(n), fa_ui, size=84)
        label(c, 110, 262, 'bacterium' if n == 1 else 'bacteria', fa_ui, size=26)
        hand = 120 * k_done + 120 * e
        clock(c, 850, 190, 40, hand, 120 * k_done, 120 * k_done + 120 * e if e < 1.0 else 120 * k_done + 120, fa_ui)
        label(c, 850, 262, 'every 20', fa_ui, size=26)
        label(c, 850, 292, 'minutes', fa_ui, size=26)

    # ---------------- the tank (end of step 5, all of step 6)
    if t >= START[4] + TANK_IN[0]:
        ox, oy, sc = tank_pose(t6)
        ta = ramp(t5, *TANK_IN) if t < START[5] else 1.0
        draw_tank(c, ox, oy, sc, ta)
        for i, (x, y, ang) in enumerate(T_CELLS):
            a = ramp(t5, T_CELLS_T[i], T_CELLS_T[i] + 0.25) if t < START[5] else 1.0
            if a > 0.02:
                it = [(ox + x * sc, oy + y * sc, ang)]
                cell_body(c, it, T_LEN * sc, a, tiny=True)
                cell_contents(c, it, T_LEN * sc, a, dna=False, tiny=True)
        # the drops of insulin (in step 6 the ten nearest the outlet set off down the pipe: they are drawn below)
        for i, (x, y) in enumerate(T_DROPS):
            a = ramp(t5, T_DROPS_T[i], T_DROPS_T[i] + 0.25) if t < START[5] else 1.0
            if a < 0.02:
                continue
            if t >= START[5] and i in COLLECT and t6 >= FLOW_T0 + FLOW_GAP * COLLECT.index(i):
                continue
            drop(c, ox + x * sc, oy + y * sc, 5.5 * sc, a, bg=LIQ)
        if t < START[5] or t6 < 0.35:
            fl = (ramp(t5, 5.5, 5.9) if t < START[5] else 1.0) * (1 - ramp(t6, 0, 0.3)) if t >= START[5] else ramp(t5, 5.5, 5.9)
            label(c, 410, 55, 'tank of bacteria', fl, size=28)
            # the key: every bacterium carries the plasmid
            plasmid(c, 830, 190, 20, 7, TH0, True, fl)
            label(c, 830, 248, 'every bacterium', fl, size=24)
            label(c, 830, 278, 'has the plasmid', fl, size=24)

    # ---------------- step 6: the pipe, the filter, the vial
    if t >= START[5]:
        a6 = ramp(t6, 0.5, 0.95)
        wh, pl = mix(BG, WHITE, a6), mix(BG, PLUM, a6)
        if a6 > 0.02:                                          # the vial
            c.rrect((698, 326, 742, 358), 4, fill=wh, outline=pl, w=4)
            c.rrect(VIAL_BODY, 16, fill=wh, outline=pl, w=4)
            c.rrect((690, 318, 750, 331), 4, fill=wh, outline=pl, w=4)
            lvl = vial_level(t6)
            if lvl < VIAL_IN[3] - 0.5:
                c.rrect((VIAL_IN[0], lvl, VIAL_IN[2], VIAL_IN[3]), 12, fill=mix(BG, ORANGE, a6), corners=(False, False, True, True))
        pp = ramp(t6, 0.45, 0.95)                              # the pipe grows out of the tank
        if pp > 0.01:
            path = partial(PIPE, pp)
            c.line(path, 24, pl if pp < 1 else mix(BG, PLUM, 1.0))
            c.line(path, 16, wh if pp < 1 else mix(BG, WHITE, 1.0))
        if a6 > 0.02:                                          # the filter
            c.rrect(FILTER, 8, fill=wh, outline=pl, w=4)
            hatch(c, (FILTER[0] + 5, FILTER[1] + 5, FILTER[2] - 5, FILTER[3] - 5), 15, mix(BG, 'C9B3D6', a6))
        for j in range(len(COLLECT)):                          # the drops in the pipe, over the filter
            q = collected(j, t6)
            if q is not None:
                inside = q[0] < OUTLET[0] - 2
                drop(c, q[0], q[1], 5.5 * TANK6[2] if inside else 5.2, 1.0, bg=LIQ if inside else WHITE)
        label(c, 500, 238, 'purify', ramp(t6, 0.9, 1.3), size=26)
        fi = ramp(t6, 2.9, 3.3)
        label(c, 792, 395, 'insulin', fi, anchor='lm')
        pointer(c, (784, 395), (772, 395), fi)

    # ---------------- captions
    for i in range(6):
        draw_caption(c, i, caption_alpha(t, i))
    return c.out()


# ------------------------------------------------------------------------------------------------ output
def _work(args):
    k, d = args
    frame(k / FPS).save(pathlib.Path(d) / f'{k:04d}.png')
    return k


def render(frames_dir):
    n = int(round(TOTAL * FPS))
    with Pool(max(1, (os.cpu_count() or 2))) as pool:
        for _ in pool.imap_unordered(_work, [(k, str(frames_dir)) for k in range(n)], chunksize=4):
            pass
    out = OUT / 'prok-insulin.mp4'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', str(frames_dir / '%04d.png'),
                    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '26', '-preset', 'veryslow',
                    '-x264-params', 'threads=1', '-movflags', '+faststart', '-an', str(out)], check=True)
    frame(0.0).save(OUT / 'prok-insulin.png')                # cover: the human DNA with the insulin gene marked
    print(f'{out.name}: {n} frames, {n / FPS:.1f} s, {out.stat().st_size // 1024} KB;  steps start at ' +
          ', '.join(f'{s:.1f}' for s in START))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--stills', type=float, nargs='*', help='write these moments (seconds) as PNGs instead of making the film')
    ap.add_argument('--frames', default=None, help='folder for the frames (default: a temporary folder, deleted afterwards)')
    ap.add_argument('--to', default=None, help='folder for --stills')
    a = ap.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    if a.stills is not None:
        d = pathlib.Path(a.to or tempfile.mkdtemp())
        d.mkdir(parents=True, exist_ok=True)
        for s in a.stills:
            frame(s).save(d / f'still-{s:05.1f}.png')
        print('stills in', d)
        return
    d = pathlib.Path(a.frames) if a.frames else pathlib.Path(tempfile.mkdtemp())
    d.mkdir(parents=True, exist_ok=True)
    try:
        render(d)
    finally:
        shutil.rmtree(d, ignore_errors=True)


if __name__ == '__main__':
    main()
