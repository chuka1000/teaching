#!/usr/bin/env python3
"""
The Ozone Layer: two animations for Y9 Science, Human Actions and the Atmosphere ('Upper Air' palette). PIL + ffmpeg, silent, 960 x 540, 20 fps.

  atm-cfc.mp4/png        How CFCs destroy ozone.  About 31 s, and it PAUSES (about 2 s) on the finished state of every step:
                           1  CFCs are harmless at ground level.        (a CFC molecule drifts up through the air; nothing happens to it)
                           2  High up, ultraviolet light breaks it apart. (UV hits it; a chlorine atom breaks off)
                           3  A chlorine atom takes an oxygen atom from ozone.   (O3 becomes O2 + Cl-O; the counter goes to 1)
                           4  The chlorine atom is free again.           (Cl-O gives its oxygen atom to a free oxygen atom: O2; the Cl is still there)
                           5  One chlorine atom destroys many ozone molecules, over and over.   (three quick repeats; the counter goes 2, 3, 4,
                                                                      then '... and thousands more'; the ozone band ends visibly thinner)

The science it keeps straight:
  - the chlorine atom is a catalyst: it is drawn coming back each time, never used up (step 4 and the loop in step 5).
  - atoms keep their identity: the oxygen atom it takes is the same atom that is later handed on to make O2. Colour follows the molecule:
    violet = in ozone (or taken from ozone), pale blue = in ordinary oxygen, O2.  Every molecule is also named by a label and by its number
    of circles (3 for O3, 2 for O2), so it never rests on colour alone.
  - no equations, and no word 'radical'.  The ozone band is thinned as molecules are destroyed (a schematic of how much ozone there is there).
  (The ozone-hole film, atm-ozone-hole, is not made here: it uses NASA's own satellite sequence instead.)

    python3 build/media/the-ozone-layer-media.py              # the CFC film
    python3 build/media/the-ozone-layer-media.py --stills 5 8 12      # just those frames, as PNGs in $ANIM_TMP / a temp folder
"""
import math, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from atmosphere_draw import *
from PIL import Image, ImageChops

# ================================================================================================ the CFC film: geometry and colours
PANEL = (12, 10, 948, 436)
GROUND_Y = 396
BAND_CY, BAND_H = 156, 76                       # the ozone layer: about two thirds of the way up the air (the air runs from y 10 to 406)
BAND_X0, BAND_X1 = 78, 938
BAND_FILL = mix(OZONE, WHITE, 0.62)
BAND_EDGE = mix(OZONE, WHITE, 0.30)
R_O, BOND = 10.5, 24.0                          # an oxygen atom, and the length of an O-O bond
R_CL, R_C, R_F = 15.0, 19.0, 11.0
UV_COL = '2E4FD1'
BOND_COL = '3F4D66'
COL_O3 = (OZONE, '3E2C66')                      # an oxygen atom in ozone (or taken from ozone)
COL_O2 = (ACCENT, ACCENT_INK)                   # an oxygen atom in ordinary oxygen
COL_CL = (CHLORINE, '1F6B2B')
COL_C = ('2B3340', '0F141C')
COL_F = ('E6F6FB', INK_SOFT)

# the timeline (seconds)
T_CFC_IN = (0.4, 0.9)
T_DRIFT1 = (0.9, 2.9)                           # step 1: up from the ground, 40 px a second
T_S2 = 4.9
T_DRIFT2 = (T_S2, 8.85)                         # step 2: on up past the ozone layer, the same 40 px a second
T_UV = (9.0, 9.7)
T_BREAK = (9.8, 11.0)
T_S3 = 13.0
T_S4 = T_S3 + 4.5
T_S5 = T_S4 + 4.4
CFC_X, CFC_Y0, CFC_Y1, CFC_Y2 = 690.0, 312.0, 232.0, 74.0
CL_HOLD = (690.0, 140.0)                        # where the chlorine atom waits after it breaks off

# the ozone molecules: (name, centre x, centre y, rotation).  Targets A to D are the ones the chlorine atom visits, left along the band.
TARGETS = [('A', 560, 154), ('B', 486, 162), ('C', 412, 150), ('D', 338, 160)]
OTHERS = [(264, 154, 0.35), (190, 162, -0.5), (116, 152, 2.4), (800, 150, 0.2), (868, 162, -2.5)]
AIR_O2 = [(846, 238, 0.4), (908, 276, -0.6), (848, 326, 0.9), (906, 362, 0.2), (778, 366, -0.3)]    # ordinary oxygen in the air
O3_REL = [(0.0, 6.25), (-20.5, -6.25), (20.5, -6.25)]                                              # centre atom, left end, right end (apex down)

CYCLE0, CYCLE = T_S5 + 0.2, 1.7                 # step 5: three quick repeats, one every 1.7 s
EV = {}                                         # timing of each visit: A slow (steps 3 and 4), B, C, D quick (step 5)
EV['A'] = dict(hop0=T_S3, hop1=T_S3 + 1.3, bond0=T_S3 + 1.3, bond1=T_S3 + 2.5, fin0=T_S4, fin1=T_S4 + 1.1, give0=T_S4 + 1.1, give1=T_S4 + 1.8,
               leave0=T_S4 + 1.8, leave1=T_S4 + 2.4, sink0=T_S5, sink1=T_S5 + 0.8)
for k, nm in enumerate('BCD'):
    c = CYCLE0 + k * CYCLE
    EV[nm] = dict(hop0=c, hop1=c + 0.50, bond0=c + 0.50, bond1=c + 0.80, fin0=c + 0.45, fin1=c + 1.05, give0=c + 1.05, give1=c + 1.30,
                  leave0=c + 1.30, leave1=c + 1.65, sink0=c + 0.80, sink1=c + 1.30)
COUNT_T = [EV[nm]['bond0'] + 0.5 * (EV[nm]['bond1'] - EV[nm]['bond0']) for nm in 'ABCD']     # the counter ticks as the oxygen atom is taken
T_MORE = EV['D']['leave1'] + 0.1                # '... and thousands more'
TOTAL_CFC = T_MORE + 0.6 + 2.6
COVER_CFC = EV['A']['bond1'] + 1.0              # the finished state of step 3: O3 has become O2 + Cl-O, counter 1

CAPS_CFC = [(0.0, 1, 'CFCs are harmless at ground level.'),
            (T_S2, 2, 'High up, ultraviolet light breaks it apart.'),
            (T_S3, 3, 'A chlorine atom takes an oxygen atom from ozone.'),
            (T_S4, 4, 'The chlorine atom is free again.'),
            (T_S5, 5, 'One chlorine atom destroys many ozone molecules, over and over.')]


# ================================================================================================ atoms and molecules
def draw_atom(c, p, r, cols, letter=None, lcol=WHITE, lsize=None):
    c.circle(p[0], p[1], r, fill=cols[0], outline=cols[1], width=2.4)
    if letter: c.text(p[0], p[1] + 1, letter, lsize or int(r * 1.15), lcol, 'mm')


def draw_bond(c, p, q, a=1.0, w=6.0, bg=None):
    col = mix(BOND_COL, bg or 'DDE8F0', 1 - a) if a < 0.999 else BOND_COL
    if a > 0.02: c.line(p, q, col, w, caps=True)


def mixcols(c1, c2, u): return (mix(c1[0], c2[0], u), mix(c1[1], c2[1], u))


def wob(i, t, amp=1.3):
    return (amp * math.sin(0.9 * t + 1.7 * i), amp * math.sin(0.7 * t + 2.3 * i + 1.0), 0.05 * math.sin(0.6 * t + 0.9 * i))


def o3_atoms(cx, cy, ang): return [add((cx, cy), rot(p, ang)) for p in O3_REL]


def draw_o3(fr, cx, cy, ang, alpha=1.0, cols=COL_O3):
    with fr.g((cx - 45, cy - 40, cx + 45, cy + 40), alpha) as c:
        a, b, e = o3_atoms(cx, cy, ang)
        draw_bond(c, a, b); draw_bond(c, a, e)
        for p in (a, b, e): draw_atom(c, p, R_O, cols)


def draw_o2(fr, cx, cy, ang, alpha=1.0, cols=COL_O2):
    with fr.g((cx - 40, cy - 40, cx + 40, cy + 40), alpha) as c:
        p, q = add((cx, cy), rot((-BOND / 2, 0), ang)), add((cx, cy), rot((BOND / 2, 0), ang))
        draw_bond(c, p, q)
        for z in (p, q): draw_atom(c, z, R_O, cols)


def leader_chip(fr, s, anchor, centre, alpha, size=26):
    """A label chip with a thin leader line to the thing it names."""
    if alpha <= 0.004: return
    w, h = chip_size(s, size)
    with fr.g((min(anchor[0], centre[0] - w / 2) - 6, min(anchor[1], centre[1] - h / 2) - 6, max(anchor[0], centre[0] + w / 2) + 6,
               max(anchor[1], centre[1] + h / 2) + 6), alpha) as c:
        if anchor is not None:
            ey = centre[1] - h / 2 if anchor[1] < centre[1] else centre[1] + h / 2
            c.line(anchor, (centre[0], ey), INK, 2.4)
        chip(c, centre[0], centre[1], s, size)


def window(t, a0, a1, b0=None, b1=None):
    """1 between a1 and b0, rising over a0..a1 and falling over b0..b1."""
    up = ease((t - a0) / max(1e-6, a1 - a0))
    if b0 is None: return up
    return up * (1 - ease((t - b0) / max(1e-6, b1 - b0)))


# ================================================================================================ the CFC molecule
CFC_REL = {'C': (0, 0), 'Cl_leave': (-32, 20), 'Cl2': (32, -22), 'F1': (-30, -26), 'F2': (32, 28)}


def cfc_centre(t):
    if t < T_DRIFT1[0]: y = CFC_Y0
    elif t < T_DRIFT1[1]: y = lerp(CFC_Y0, CFC_Y1, (t - T_DRIFT1[0]) / (T_DRIFT1[1] - T_DRIFT1[0]))
    elif t < T_DRIFT2[0]: y = CFC_Y1 + 2.0 * math.sin(1.5 * (t - T_DRIFT1[1]))
    elif t < T_DRIFT2[1]: y = lerp(CFC_Y1, CFC_Y2, (t - T_DRIFT2[0]) / (T_DRIFT2[1] - T_DRIFT2[0]))
    else: y = CFC_Y2 + 1.5 * math.sin(1.5 * (t - T_DRIFT2[1]))
    return CFC_X + 5.0 * math.sin(0.8 * t), y


def cfc_angle(t): return 0.16 * math.sin(0.9 * t)


def cfc_pos(t, key):
    cx, cy = cfc_centre(t)
    return add((cx, cy), rot(CFC_REL[key], cfc_angle(t)))


def draw_cfc(fr, t, alpha, with_cl_leave, shift=(0, 0)):
    cx, cy = cfc_centre(t)
    cx, cy = cx + shift[0], cy + shift[1]
    ang = cfc_angle(t)
    with fr.g((cx - 70, cy - 66, cx + 70, cy + 66), alpha) as c:
        P = {k: add((cx, cy), rot(v, ang)) for k, v in CFC_REL.items()}
        for k, p in P.items():
            if k == 'C' or (k == 'Cl_leave' and not with_cl_leave): continue
            draw_bond(c, P['C'], p, w=7)
        draw_atom(c, P['C'], R_C, COL_C, 'C', WHITE, 24)
        for k, cols, r, ltr, lc, ls in (('Cl2', COL_CL, R_CL, 'Cl', WHITE, 17), ('F1', COL_F, R_F, 'F', INK, 16), ('F2', COL_F, R_F, 'F', INK, 16)):
            draw_atom(c, P[k], r, cols, ltr, lc, ls)
        if with_cl_leave: draw_atom(c, P['Cl_leave'], R_CL, COL_CL, 'Cl', WHITE, 17)


# ================================================================================================ one visit of the chlorine atom
class Visit:
    """The chlorine atom meets one ozone molecule, takes an oxygen atom, hands it on to a free oxygen atom and is free again.
    Every position is a function of the time t and the timing dict ev, so a frame never depends on an earlier one."""

    def __init__(self, name, cx, cy, ev, cl_from):
        self.name, self.P, self.ev, self.cl_from = name, (cx, cy), ev, cl_from
        self.cl_until = 1e9                                              # set to the next visit's hop0: that visit takes the atom over
        P = self.P
        self.Oa0, self.Oc0, self.Ob0 = add(P, (-20.5, -6.25)), add(P, (0, 6.25)), add(P, (20.5, -6.25))
        self.touch = add(self.Ob0, (R_CL + R_O + 5.0, 0))
        self.pair_shift = (14, -9)
        self.Ob1, self.Cl1 = add(self.Ob0, self.pair_shift), add(self.touch, self.pair_shift)
        self.Oc_to = add(self.Oa0, (BOND, 0))
        self.TP = add(self.Ob1, (-3.0, -BOND + 0.2))
        self.FS = add(self.Ob1, (50, -40))
        self.leave = (-4, -22)

    def cl_final(self): return self.Cl1

    def draw(self, fr, t):
        e = self.ev
        wf = 1 - ease((t - (e['hop0'] - 0.3)) / 0.6)                     # the idle wobble dies away as the chlorine atom comes
        w = wob(ord(self.name[0]) % 7, t)
        Pw = (self.P[0] + w[0] * wf, self.P[1] + w[1] * wf)
        dP = (Pw[0] - self.P[0], Pw[1] - self.P[1])
        s = ease((t - e['bond0']) / (e['bond1'] - e['bond0']))
        k = ease((t - e['sink0']) / (e['sink1'] - e['sink0']))
        g = ease((t - e['give0']) / (e['give1'] - e['give0']))
        lv = ease((t - e['leave0']) / (e['leave1'] - e['leave0']))
        splitshift = (-8 * s, 10 * s)
        sink = (-6 * k, 58 * k)
        tot = lambda p: (p[0] + dP[0] + splitshift[0] + sink[0], p[1] + dP[1] + splitshift[1] + sink[1])
        Oa = tot(self.Oa0)
        Oc = tot(lerp2(self.Oc0, self.Oc_to, s))
        Ob_base = add(add(self.Ob0, dP), (self.pair_shift[0] * s, self.pair_shift[1] * s))
        Ob = add(Ob_base, (self.leave[0] * lv, self.leave[1] * lv))
        # the chlorine atom
        if t < e['hop0']: cl = self.cl_from
        elif t < e['hop1']:
            u = ease((t - e['hop0']) / (e['hop1'] - e['hop0']))
            cl = lerp2(self.cl_from, self.touch, u)
            cl = (cl[0], cl[1] - 9 * math.sin(math.pi * u))
        else: cl = add(self.touch, (self.pair_shift[0] * s, self.pair_shift[1] * s))
        # the free oxygen atom
        of_alpha = window(t, e['fin0'], e['fin0'] + 0.25)
        uf = ease((t - e['fin0']) / (e['fin1'] - e['fin0']))
        of = add(lerp2(self.FS, self.TP, uf), (self.leave[0] * lv, self.leave[1] * lv))
        # colours: violet in ozone, pale blue in oxygen
        c_ac = mixcols(COL_O3, COL_O2, s)
        c_b = mixcols(COL_O3, COL_O2, g)
        with fr.g((self.P[0] - 70, 70, self.P[0] + 130, 270)) as c:
            draw_bond(c, Oa, Oc)
            draw_bond(c, Oc, Ob, 1 - s)
            draw_bond(c, cl, Ob, s * (1 - g), w=6)
            if of_alpha > 0.02: draw_bond(c, Ob, of, g * of_alpha)
            for p in (Oa, Oc): draw_atom(c, p, R_O, c_ac)
            draw_atom(c, Ob, R_O, c_b)
            if e['hop0'] <= t < self.cl_until: draw_atom(c, cl, R_CL, COL_CL, 'Cl', WHITE, 17)
        if of_alpha > 0.004:
            with fr.g((of[0] - 20, of[1] - 20, of[0] + 20, of[1] + 20), of_alpha) as c:
                draw_atom(c, of, R_O, COL_O2)
        return dict(Oa=Oa, Oc=Oc, Ob=Ob, cl=cl, of=of, of_alpha=of_alpha)


# ================================================================================================ the static background
def make_base():
    im = blank(TINT)
    # the panel: sky gradient and the ground strip, clipped to the rounded rectangle
    panel = Image.new('RGBA', (W * SS, H * SS), (0, 0, 0, 0))
    pc = Ctx(panel)
    vgrad(pc, PANEL[0], PANEL[1], PANEL[2], GROUND_Y, mix(ACCENT, WHITE, 0.30), mix(ACCENT, WHITE, 0.88))
    pc.d.rectangle([PANEL[0] * SS, GROUND_Y * SS, PANEL[2] * SS, PANEL[3] * SS], fill=rgba('7A5A3C'))
    pc.d.rectangle([PANEL[0] * SS, GROUND_Y * SS, PANEL[2] * SS, (GROUND_Y + 6) * SS], fill=rgba(SUPPORT))
    panel.putalpha(ImageChops.multiply(panel.getchannel('A'), rounded_mask(PANEL, 26)))
    im.alpha_composite(panel)
    c = Ctx(im)
    c.rrect(*PANEL, 26, outline=INK, width=3)
    # the sun, top right
    sx, sy = 872, 70
    for i in range(14):
        a = 2 * math.pi * i / 14
        c.line((sx + 38 * math.cos(a), sy + 38 * math.sin(a)), (sx + 52 * math.cos(a), sy + 52 * math.sin(a)), 'E0A100', 4.5, caps=True)
    c.circle(sx, sy, 30, fill=SUN, outline='B07D00', width=3)
    # the altitude axis, with 'height' written up it, and 'ground' in the strip
    c.line((60, GROUND_Y - 4), (60, 50), INK, 4)
    c.arrow_head((60, 38), 0, -1, INK, 16)
    lab = Image.new('RGBA', (int(text_w('height', 26) * SS) + 8, 40 * SS), (0, 0, 0, 0))
    ImageDraw.Draw(lab).text((4, 20 * SS), 'height', font=F(26), fill=rgba(INK), anchor='lm')
    lab = lab.rotate(90, expand=True)
    im.alpha_composite(lab, (int(33 * SS - lab.width / 2), int(230 * SS - lab.height / 2)))
    c.text(92, GROUND_Y + 22, 'ground', 26, WHITE, 'lm')
    # the name of the ozone layer, above its left end
    c.text(92, 30, 'ozone layer,', 26, OZONE_INK, 'lm')
    c.text(92, 58, 'high in the stratosphere', 26, OZONE_INK, 'lm')
    c.line((100, 74), (100, BAND_CY - BAND_H / 2 - 8), OZONE_INK, 3)
    c.arrow_head((100, BAND_CY - BAND_H / 2 - 2), 0, 1, OZONE_INK, 11)
    return im


# ================================================================================================ one frame of the CFC film
def draw_legend(fr, alpha):
    """The key: what the circles mean. It fades away when the counter makes room for '... and thousands more'."""
    with fr.g((80, 234, 372, 330), alpha) as c:
        c.rrect(84, 238, 368, 326, 14, fill=WHITE, outline=INK, width=2.4)
        for yy, nm, cols, n in ((266, 'ozone, O₃', COL_O3, 3), (302, 'oxygen, O₂', COL_O2, 2)):
            if n == 3:
                pts = o3_atoms(120, yy + 3, 0.0)
                draw_bond(c, pts[0], pts[1]); draw_bond(c, pts[0], pts[2])
                for p in pts: draw_atom(c, p, R_O, cols)
            else:
                p, q = (108, yy), (108 + BOND, yy)
                draw_bond(c, p, q)
                for z in (p, q): draw_atom(c, z, R_O, cols)
            c.text(168, yy, nm, 26, INK, 'lm')


def draw_band(fr, t):
    """The ozone layer: a violet band that thins where molecules have been destroyed."""
    c = fr.main
    xs = list(range(BAND_X0, BAND_X1 + 1, 4))
    dips = []
    for nm, cx, cy in TARGETS:
        u = ease((t - EV[nm]['bond0']) / 1.0)
        dips.append((cx, u))
    top, bot = [], []
    for x in xs:
        d = sum(0.34 * u * math.exp(-((x - cx) / 56.0) ** 2) for cx, u in dips)
        h = BAND_H * (1 - min(0.62, d))
        top.append((x, BAND_CY - h / 2)); bot.append((x, BAND_CY + h / 2))
    c.poly(top + bot[::-1], fill=BAND_FILL)
    c.path(top, BAND_EDGE, 2.4); c.path(bot, BAND_EDGE, 2.4)


def counter(fr, t):
    n = sum(1 for tt in COUNT_T if t >= tt)
    bump = max([max(0.0, 1 - (t - tt) / 0.45) for tt in COUNT_T if t >= tt] or [0.0])
    extra = ease((t - T_MORE) / 0.5)
    h = 52 + 40 * extra
    y0, y1 = 396 - h, 396
    c = fr.main
    c.rrect(84, y0, 590, y1, 14, fill=WHITE, outline=INK, width=2.6)
    c.text(100, y0 + 27, 'Ozone molecules destroyed:', 26, INK, 'lm')
    c.text(574, y0 + 27, str(n), int(round(40 * (1 + 0.3 * bump))), ALERT, 'rm')
    if extra > 0.01:
        with fr.g((84, y0, 590, y1), extra) as cc:
            cc.text(100, y0 + 66, '... and thousands more', 26, ALERT, 'lm')


def frame_cfc(t):
    fr = Frame(BASE_CFC)
    c = fr.main
    draw_band(fr, t)
    draw_legend(fr, 1 - ease((t - (T_MORE - 0.1)) / 0.4))
    # ordinary oxygen drifting in the air
    for i, (x, y, a) in enumerate(AIR_O2):
        w = wob(20 + i, t)
        draw_o2(fr, x + w[0], y + w[1], a + w[2])
    # ozone molecules the chlorine atom never reaches
    for i, (x, y, a) in enumerate(OTHERS):
        w = wob(10 + i, t)
        draw_o3(fr, x + w[0], y + w[1], a + w[2])
    # the four visited by the chlorine atom (each draws the chlorine atom while it has it)
    st = {nm: VISITS[nm].draw(fr, t) for nm, _, _ in TARGETS}
    A = st['A']
    # --- the CFC, and the chlorine atom between the break and the first visit
    appear = ease((t - T_CFC_IN[0]) / (T_CFC_IN[1] - T_CFC_IN[0]))
    tb = T_BREAK[0]
    if t < tb: draw_cfc(fr, t, appear, True)
    if t >= tb:                                                                  # the rest of the molecule drifts off and fades
        u = ease((t - tb) / 1.5)
        fade_out = 1 - 0.4 * ease((t - T_BREAK[1]) / 1.5) - 0.6 * ease((t - T_S3) / 0.6)
        cx, cy = cfc_centre(tb)
        with fr.g((cx - 60, cy - 60, cx + 90, cy + 60), clamp(fade_out)) as cc:
            ang = cfc_angle(tb)
            P = {k: add((cx + 16 * u, cy - 9 * u), rot(v, ang)) for k, v in CFC_REL.items()}
            for k, p in P.items():
                if k not in ('C', 'Cl_leave'): draw_bond(cc, P['C'], p, w=7)
            draw_atom(cc, P['C'], R_C, COL_C, 'C', WHITE, 24)
            draw_atom(cc, P['Cl2'], R_CL, COL_CL, 'Cl', WHITE, 17)
            for k in ('F1', 'F2'): draw_atom(cc, P[k], R_F, COL_F, 'F', INK, 16)
    if tb <= t < EV['A']['hop0']:
        p0 = cfc_pos(tb, 'Cl_leave')
        p = lerp2(p0, CL_HOLD, ease((t - T_BREAK[0]) / (T_BREAK[1] - T_BREAK[0])))
        p = (p[0], p[1] + 2.0 * math.sin(2.0 * (t - T_BREAK[1])) * ease((t - T_BREAK[1]) / 0.4))
        with fr.g((p[0] - 30, p[1] - 30, p[0] + 30, p[1] + 30)) as cc:
            draw_atom(cc, p, R_CL, COL_CL, 'Cl', WHITE, 17)
    # --- UV light, the flash, and the labels
    if t >= T_UV[0]:
        cx, cy = cfc_centre(t)
        u = ease((t - T_UV[0]) / (T_UV[1] - T_UV[0]))
        a_uv = 1 - ease((t - T_S3) / 0.5)
        with fr.g((cx + 20, 20, 860, 130), a_uv) as cc:
            for dy, ey in ((-9, -17), (0, 0), (9, 17)):
                wavy_arrow(cc, (836, 70 + dy), (cx + 52, cy + ey), UV_COL, 4.2, 4.5, 22, phase=-2 * math.pi * 1.4 * t, head=13, u=u)
        if a_uv > 0.004:
            with fr.g((760, 12, 850, 58), a_uv * window(t, T_UV[0] + 0.1, T_UV[0] + 0.4)) as cc: chip(cc, 802, 34, 'UV')
    imp = (t - (T_UV[1] - 0.05)) / 0.55
    if 0 <= imp < 1:
        cx, cy = cfc_centre(t)
        with fr.g((cx - 30, cy - 70, cx + 120, cy + 70), 1 - imp) as cc:
            ring_pulse(cc, cx + 48, cy, 8, 40, imp, SUN, 4.5)
            for j in range(8):
                a = 2 * math.pi * j / 8 + 0.2
                r0, r1 = 10 + 20 * ease(imp), 20 + 34 * ease(imp)
                cc.line((cx + 48 + r0 * math.cos(a), cy + r0 * math.sin(a)), (cx + 48 + r1 * math.cos(a), cy + r1 * math.sin(a)), 'E0A100', 4, caps=True)
    # chips that follow the story
    cx, cy = cfc_centre(t)
    a_cfc = window(t, T_CFC_IN[1], T_CFC_IN[1] + 0.3, T_UV[1] - 0.1, T_UV[1] + 0.2)
    if a_cfc > 0.004:
        with fr.g((cx - 60, cy + 40, cx + 60, cy + 100), a_cfc) as cc: chip(cc, cx, cy + 66, 'CFC')
    leader_chip(fr, 'chlorine atom', (CL_HOLD[0], CL_HOLD[1] + R_CL + 3), (CL_HOLD[0], 232), window(t, T_BREAK[1] - 0.1, T_BREAK[1] + 0.3, T_S3, T_S3 + 0.3))
    V = VISITS['A']
    e = EV['A']
    leader_chip(fr, 'O₃', (V.P[0], V.P[1] + 20), (V.P[0], 232), window(t, e['hop0'] + 0.5, e['hop0'] + 0.8, e['bond0'] - 0.1, e['bond0'] + 0.2))
    leader_chip(fr, 'O₂', (V.Oa0[0] + 4, V.Oa0[1] + 24), (500, 232), window(t, e['bond1'] - 0.1, e['bond1'] + 0.2, T_S4, T_S4 + 0.3))
    leader_chip(fr, 'Cl–O', (V.Cl1[0], V.Cl1[1] + R_CL + 3), (632, 232), window(t, e['bond1'] - 0.1, e['bond1'] + 0.2, T_S4, T_S4 + 0.3))
    # step 4: the free oxygen atom, then the new O2, then the chlorine atom that is still there
    of = A['of']
    leader_chip(fr, 'oxygen atom', (of[0], of[1] - R_O - 2), (of[0] + 36, 52), window(t, e['fin0'] + 0.2, e['fin0'] + 0.5, e['give0'] - 0.1, e['give0'] + 0.2))
    Ob = A['Ob']
    leader_chip(fr, 'O₂', (Ob[0] - 3, V.TP[1] + V.leave[1] - R_O - 2), (Ob[0] - 3, 46), window(t, e['leave1'] - 0.1, e['leave1'] + 0.2, T_S5, T_S5 + 0.3))
    leader_chip(fr, 'chlorine atom', (V.Cl1[0], V.Cl1[1] + R_CL + 3), (V.Cl1[0] + 18, 232), window(t, e['leave1'] + 0.1, e['leave1'] + 0.4, T_S5, T_S5 + 0.3))
    # the pulse round the chlorine atom when it is free again (step 4), and the small contact flashes
    for nm in 'ABCD':
        ev, Vn = EV[nm], VISITS[nm]
        for (t0, pos, big) in ((ev['hop1'], Vn.touch, False), (ev['give1'], Vn.Cl1, nm == 'A')):
            u = (t - t0) / (0.8 if big else 0.45)
            if 0 <= u < 1:
                with fr.g((pos[0] - 80, pos[1] - 80, pos[0] + 80, pos[1] + 80), (1 - u) ** 0.8) as cc:
                    ring_pulse(cc, pos[0], pos[1], R_CL + 4, R_CL + (30 if big else 16), u, CHLORINE, 4.0 if big else 3.0)
    counter(fr, t)
    caption(fr, CAPS_CFC, t)
    return fr.done()


VISITS = {}
BASE_CFC = None


def init_cfc():
    global BASE_CFC
    BASE_CFC = make_base()
    cl_from, prev = CL_HOLD, None
    for nm, cx, cy in TARGETS:
        V = Visit(nm, cx, cy, EV[nm], cl_from)
        VISITS[nm] = V
        if prev: prev.cl_until = EV[nm]['hop0']
        prev, cl_from = V, V.Cl1


# ================================================================================================ main
def main():
    init_cfc()
    if '--stills' in sys.argv:
        stills(frame_cfc, sys.argv[sys.argv.index('--stills') + 1:])
        return
    render_film(frame_cfc, TOTAL_CFC, 'atm-cfc', COVER_CFC)


if __name__ == '__main__':
    main()
