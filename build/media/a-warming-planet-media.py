#!/usr/bin/env python3
"""
A Warming Planet: the greenhouse-effect animation (Y9 Science, Human Actions and the Atmosphere, 'Upper Air' palette). PIL + ffmpeg, silent.

  atm-greenhouse.mp4/png   The greenhouse effect, 960 x 540, 20 fps, about 31 s, and it PAUSES (about 2 s) on the finished state of every step:
                             1  Sunlight passes through the air and warms the ground.   (straight yellow arrows from the sun to the ground; the ground warms)
                             2  The warm ground gives out infrared.                     (wavy red arrows rise from the ground)
                             3  Greenhouse gases absorb the infrared and send it out in all directions.   (the waves stop at four molecules, which flash;
                                thin red arrows leave each one in six directions, three up and three down, and the straight-down ones reach the ground)
                             4  More greenhouse gases: more infrared comes back down.    (three more molecules, so seven; seven arrows now come back down)
                           then a closing label.  A thermometer on the right rises a little at each warming and has no numbers.

The science it keeps straight:
  - sunlight is short-wave and mostly visible light, so it is drawn as straight yellow arrows; the ground gives out infrared, long-wave, so it is
    drawn as wavy red arrows.  Different shape and different colour: the two never rest on colour alone.
  - the air is mostly nitrogen and oxygen, which do not absorb infrared: they are only faint unlabelled dots.  Only the labelled greenhouse gas
    molecules (CO2: a black carbon between two red oxygen atoms; CH4: a black carbon with four small hydrogen atoms) stop the infrared.
  - absorbed energy is sent out in all directions, so about half goes back down.  It is NOT a 'blanket' or a 'lid', and nothing is trapped.
  - the thermometer shows only 'warmer', never a number.

    python3 build/media/a-warming-planet-media.py
    python3 build/media/a-warming-planet-media.py --stills 3 8 14       # just those frames, as PNGs in $ANIM_TMP / a temp folder
"""
import math, pathlib, random, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from atmosphere_draw import *
from PIL import Image, ImageChops

# ------------------------------------------------------------------------------------------------ geometry
PANEL = (12, 10, 948, 436)
SPACE_Y, GROUND_Y = 100, 396                    # space ends at SPACE_Y; the ground strip starts at GROUND_Y
SUN_POS = (86, 58)
BEAM_ENDS = [170, 310, 450, 590, 730]           # where the five sunbeams land on the ground
R_SUN = 28
THERM_X, THERM_TOP, THERM_BOT = 880, 148, 352   # the thermometer's tube
BULB_Y, BULB_R = 368, 21
YELLOW, YELLOW_EDGE = 'F6C445', 'A97800'
CO_COL, O_COL, H_COL = '23272B', 'D2402C', 'FFFFFF'
BOND_COL = '3F4D66'
WAVE_AMP, WAVE_WL = 7.0, 28.0

# the greenhouse gas molecules: x, y, kind, rotation.  Four in step 3 (the first four), three more in step 4.
MOLS = [(110, 192, 'CO2', 0.30), (290, 184, 'CH4', 0.0), (470, 200, 'CO2', -0.40), (650, 190, 'CH4', 0.0),           # step 3
        (200, 232, 'CO2', 0.55), (380, 228, 'CH4', 0.0), (560, 234, 'CO2', -0.30)]                                 # step 4: three more, so seven
N3 = 4
UP_ANG = [40, 90, 140]                          # the thin scatter arrows leave each molecule in these directions (degrees, y up) ...
DOWN_ANG = [220, 320]                           # ... and these (short), and the straight-down one that reaches the ground
SHORT, R0 = 42.0, 36.0                          # the short arrows' length; how far from the molecule's centre an arrow starts
Y_STOP2 = 256.0                                 # where the infrared has got to at the end of step 2 (just under the molecules' band)
WAVE_DX, DOWN_DX = -16.0, 16.0                  # the incoming wave and the returning arrow run side by side

# ------------------------------------------------------------------------------------------------ the timeline (seconds)
T_BEAM0, BEAM_STAG, BEAM_DUR = 0.8, 0.18, 1.6
T_GROUND1 = T_BEAM0 + 4 * BEAM_STAG + BEAM_DUR - 0.3          # the ground warms as the beams land
T_S2 = T_GROUND1 + 1.0 + 2.2
T_WAVE0, WAVE_STAG, WAVE_DUR = T_S2 + 0.5, 0.18, 1.8
T_WAVE_END = T_WAVE0 + 3 * WAVE_STAG + WAVE_DUR
T_S3 = T_WAVE_END + 2.2
T_MOL3 = T_S3 + 0.4
T_EXT3 = T_MOL3 + 1.0                                         # the waves reach the molecules
T_FLASH3 = T_EXT3 + 0.7
T_SCAT3, SCAT_DUR = T_FLASH3 + 0.5, 1.9
T_WARM3 = T_SCAT3 + SCAT_DUR - 0.6
T_S4 = T_WARM3 + 1.0 + 2.2
T_MOL4 = T_S4 + 0.4
T_WAVE4 = T_MOL4 + 0.5
T_FLASH4 = T_WAVE4 + 1.8 + 0.2
T_SCAT4 = T_FLASH4 + 0.5
T_WARM4 = T_SCAT4 + SCAT_DUR - 0.6
T_END = T_WARM4 + 1.0 + 2.2                                    # the closing label replaces the caption
TOTAL = T_END + 5.4
COVER_T = T_S4 - 0.1                                          # the finished state of step 3

# warmth keyframes: (time the change starts, duration, level).  The ground colour and the thermometer both follow it.
WARM_GROUND = [(T_GROUND1, 1.0, 0.35), (T_WARM3, 1.0, 0.65), (T_WARM4, 1.0, 1.0)]
WARM_THERM = [(T_GROUND1 + 0.2, 1.0, 0.32), (T_WARM3 + 0.2, 1.0, 0.52), (T_WARM4 + 0.2, 1.0, 0.80)]


def level2(keys, t, start):
    """The value at time t: start, then each key eases the value from where it was to its level."""
    cur = start
    for t0, dur, to in keys:
        if t < t0: break
        cur = lerp(cur, to, ease((t - t0) / dur)) if t < t0 + dur else to
    return cur


CAPS = [(0.0, 1, 'Sunlight passes through the air and warms the ground.'),
        (T_S2, 2, 'The warm ground gives out infrared.'),
        (T_S3, 3, 'Greenhouse gases absorb the infrared and send it out in all directions.'),
        (T_S4, 4, 'More greenhouse gases: more infrared comes back down.')]
END_LINES = ['The greenhouse effect keeps Earth warm.', 'Adding more gases makes it stronger.']


# ------------------------------------------------------------------------------------------------ molecules
def mol_atoms(kind, x, y, ang):
    """(position, radius, fill, outline) of every atom and the bonds as index pairs."""
    if kind == 'CO2':
        rel = [((0, 0), 13, CO_COL), ((-27, 0), 12, O_COL), ((27, 0), 12, O_COL)]
        bonds = [(0, 1), (0, 2)]
    else:
        d = 21
        rel = [((0, 0), 13, CO_COL), ((-d, -d), 8, H_COL), ((d, -d), 8, H_COL), ((-d, d), 8, H_COL), ((d, d), 8, H_COL)]
        bonds = [(0, 1), (0, 2), (0, 3), (0, 4)]
    atoms = [(add((x, y), rot(p, ang)), r, col) for p, r, col in rel]
    return atoms, bonds


def draw_molecule(c: Ctx, kind, x, y, ang):
    atoms, bonds = mol_atoms(kind, x, y, ang)
    for i, j in bonds: c.line(atoms[i][0], atoms[j][0], BOND_COL, 5.5, caps=True)
    for p, r, col in atoms:
        outline = INK if col == H_COL else mix(col, '000000', 0.45)
        c.circle(p[0], p[1], r, fill=col, outline=outline, width=2.2)


def mol_state(i, t):
    """(alpha, shake offset, flash 0..1) of molecule i."""
    x, y, kind, ang = MOLS[i]
    if i < N3:
        t_in = T_MOL3 + 0.12 * i
        flashes = [T_FLASH3]
    else:
        t_in = T_MOL4 + 0.12 * (i - N3)
        flashes = [T_FLASH4]
    a = ease((t - t_in) / 0.6)
    sh, fl = (0.0, 0.0), 0.0
    for tf in flashes:
        u = (t - (tf + 0.06 * (i % 4))) / 0.6
        if 0 <= u < 1:
            fl = max(fl, math.sin(math.pi * u))
            sh = (2.4 * math.sin(55 * t) * (1 - u), 2.0 * math.cos(47 * t) * (1 - u))
    return a, sh, fl


def wave_top(i):
    """y of the top of molecule i's incoming wave (just under the molecule)."""
    return MOLS[i][1] + 30


# ------------------------------------------------------------------------------------------------ the static background
def make_base():
    im = blank(TINT)
    panel = Image.new('RGBA', (W * SS, H * SS), (0, 0, 0, 0))
    pc = Ctx(panel)
    vgrad(pc, PANEL[0], PANEL[1], PANEL[2], SPACE_Y, DARK, DARK_SOFT)
    vgrad(pc, PANEL[0], SPACE_Y, PANEL[2], GROUND_Y, mix(ACCENT, WHITE, 0.34), mix(ACCENT, WHITE, 0.88))
    panel.putalpha(ImageChops.multiply(panel.getchannel('A'), rounded_mask(PANEL, 26)))
    im.alpha_composite(panel)
    c = Ctx(im)
    rnd = random.Random(4)
    for _ in range(34):                                                    # a few stars
        x, y = rnd.uniform(150, 840), rnd.uniform(22, 88)
        c.circle(x, y, rnd.choice((1.4, 1.8, 2.2)), fill=mix(WHITE, DARK_SOFT, 0.2))
    for _ in range(46):                                                    # nitrogen and oxygen: faint, unlabelled, they do not absorb infrared
        x, y = rnd.uniform(36, 824), rnd.uniform(112, 384)
        a = rnd.uniform(0, math.pi)
        for sgn in (-1, 1):
            c.circle(x + sgn * 4.5 * math.cos(a), y + sgn * 4.5 * math.sin(a), 3.6, fill=mix('9FB6C7', '9FD0E0', 0.5))
    # the sun, top left, in space
    for i in range(14):
        a = 2 * math.pi * i / 14
        c.line((SUN_POS[0] + 34 * math.cos(a), SUN_POS[1] + 34 * math.sin(a)), (SUN_POS[0] + 46 * math.cos(a), SUN_POS[1] + 46 * math.sin(a)), YELLOW, 4.5, caps=True)
    c.circle(SUN_POS[0], SUN_POS[1], R_SUN, fill=YELLOW, outline=YELLOW_EDGE, width=3)
    c.text(880, 36, 'space', 26, WHITE, 'mm')
    c.rrect(*PANEL, 26, outline=INK, width=3)
    return im


def make_glow():
    """A strip of warm light above the ground: opaque at the ground, clear 70 px up. Its alpha is scaled by the warmth each frame."""
    h = 60 * SS
    w = (PANEL[2] - PANEL[0]) * SS
    arr = np.zeros((h, w, 4), np.uint8)
    arr[..., 0], arr[..., 1], arr[..., 2] = 255, 128, 40
    arr[..., 3] = (255 * (1 - np.linspace(0, 1, h)[:, None]) ** 1.6).repeat(w, axis=1).astype(np.uint8)
    return Image.fromarray(arr, 'RGBA')


# ------------------------------------------------------------------------------------------------ one frame
def draw_ground(fr, wl):
    """The ground strip (it gets warmer: brown to a hot orange-brown), clipped to the panel's rounded corners, and the glow above it."""
    col = mix('6B4F3A', 'C0501F', wl)
    strip = Image.new('RGBA', (W * SS, (PANEL[3] - GROUND_Y + 4) * SS), (0, 0, 0, 0))
    d = ImageDraw.Draw(strip)
    d.rectangle([0, 0, W * SS, strip.height], fill=rgba(col))
    d.line([PANEL[0] * SS, 1.5 * SS, PANEL[2] * SS, 1.5 * SS], fill=rgba(mix(col, '000000', 0.35)), width=3 * SS)
    strip.putalpha(ImageChops.multiply(strip.getchannel('A'), MASK.crop((0, GROUND_Y * SS, W * SS, (PANEL[3] + 4) * SS))))
    sp = GLOW.copy()
    sp.putalpha(sp.getchannel('A').point([int(v * 0.85 * wl) for v in range(256)]))
    fr.img.alpha_composite(sp, (PANEL[0] * SS, (GROUND_Y - 60) * SS))
    fr.img.alpha_composite(strip, (0, GROUND_Y * SS))
    fr.main.text(40, GROUND_Y + 21, 'Earth’s surface', 26, WHITE, 'lm')


def draw_thermometer(fr, lv):
    c = fr.main
    x0, x1 = THERM_X - 13, THERM_X + 13
    c.text(THERM_X, 122, 'warmth', 26, INK, 'mm')
    c.rrect(x0, THERM_TOP, x1, THERM_BOT + 6, 13, fill=WHITE, outline=INK, width=3)
    c.circle(THERM_X, BULB_Y, BULB_R, fill=IR_RED, outline=INK, width=3)
    top = THERM_BOT - (THERM_BOT - THERM_TOP - 12) * lv
    c.rrect(THERM_X - 6, top, THERM_X + 6, BULB_Y, 6, fill=IR_RED)
    c.circle(THERM_X, BULB_Y, BULB_R - 3, fill=IR_RED)
    for k in range(1, 6):                                                  # unlabelled tick marks
        y = THERM_BOT - (THERM_BOT - THERM_TOP - 12) * k / 6
        c.line((x1 + 5, y), (x1 + 14, y), INK, 2.4)


def draw_beams(fr, t, alpha):
    for i, ex in enumerate(BEAM_ENDS):
        u = ease((t - (T_BEAM0 + i * BEAM_STAG)) / BEAM_DUR)
        if u <= 0: continue
        dx, dy = ex - SUN_POS[0], GROUND_Y - 4 - SUN_POS[1]
        L = math.hypot(dx, dy)
        p0 = (SUN_POS[0] + dx / L * 44, SUN_POS[1] + dy / L * 44)
        p1 = (ex, GROUND_Y - 4)
        tip = lerp2(p0, p1, u)
        with fr.g((min(p0[0], tip[0]) - 20, min(p0[1], tip[1]) - 20, max(p0[0], tip[0]) + 20, max(p0[1], tip[1]) + 20), alpha) as c:
            straight_arrow(c, p0, p1, YELLOW, 6, 20, u=u, outline=YELLOW_EDGE, ow=3)


def wave_tips(t):
    """(x, y of the tip) of every infrared wave that exists at time t. A wave is drawn from the ground to its tip."""
    G = GROUND_Y - 4
    out = []
    for k in range(N3):                                                    # steps 2 and 3: under the first four molecules
        x = MOLS[k][0] + WAVE_DX
        u2 = ease((t - (T_WAVE0 + k * WAVE_STAG)) / WAVE_DUR)
        tip = lerp(G, Y_STOP2, u2) if t < T_EXT3 else lerp(Y_STOP2, wave_top(k), ease((t - T_EXT3) / 0.7))   # step 2 stops short of the band
        out.append((x, tip))
    for k in range(N3, len(MOLS)):                                         # step 4: new columns, from the ground to the new molecules
        x = MOLS[k][0] + WAVE_DX
        out.append((x, lerp(G, wave_top(k), ease((t - (T_WAVE4 + 0.1 * (k - N3))) / 1.5))))
    return [(x, tip) for x, tip in out if tip < G - 8]


def draw_waves(fr, t):
    """Infrared rising from the ground: wavy red arrows (long waves), drawn from the ground to the tip."""
    G = GROUND_Y - 4
    for x, tip in wave_tips(t):
        with fr.g((x - 24, tip - 20, x + 24, G + 2)) as c:
            wavy_arrow(c, (x, G), (x, tip), IR_RED, 5.5, WAVE_AMP, WAVE_WL, phase=-2 * math.pi * 1.2 * t, head=15)


def scatter_params(i):
    """The six thin arrows that leave molecule i: (start, end) pairs, three going up and three going down."""
    x, y, kind, ang = MOLS[i]
    out = []
    for a in UP_ANG:
        r = math.radians(a)
        L = SHORT if a != 90 else max(SHORT, (y - R0) - 112)
        out.append(((x + R0 * math.cos(r), y - R0 * math.sin(r)), (x + (R0 + L) * math.cos(r), y - (R0 + L) * math.sin(r)), 'up'))
    for a in DOWN_ANG:
        r = math.radians(a)
        out.append(((x + R0 * math.cos(r), y - R0 * math.sin(r)), (x + (R0 + SHORT) * math.cos(r), y - (R0 + SHORT) * math.sin(r)), 'down'))
    out.append(((x + DOWN_DX, y + 30), (x + DOWN_DX, GROUND_Y - 4), 'ground'))                 # the one that comes back to the ground
    return out


def draw_scatter(fr, t):
    for i in range(len(MOLS)):
        t0 = (T_SCAT3 if i < N3 else T_SCAT4) + 0.08 * (i % 5)
        u = ease((t - t0) / SCAT_DUR)
        if u <= 0: continue
        for (p0, p1, kind) in scatter_params(i):
            uu = u if kind != 'ground' else ease((t - t0 - 0.1) / (SCAT_DUR * 1.1))
            with fr.g((min(p0[0], p1[0]) - 16, min(p0[1], p1[1]) - 16, max(p0[0], p1[0]) + 16, max(p0[1], p1[1]) + 16)) as c:
                straight_arrow(c, p0, p1, IR_RED, 3.6, 12, u=uu)


def draw_molecules(fr, t):
    for i, (x, y, kind, ang) in enumerate(MOLS):
        a, sh, fl = mol_state(i, t)
        if a <= 0.004: continue
        with fr.g((x - 70, y - 70, x + 70, y + 70), a) as c:
            if fl > 0.02:                                                  # the flash: a warm glow and a ring
                c.circle(x, y, 34 + 10 * fl, fill=mix('FFFFFF', SUN, 0.5 * fl))
                c.circle(x, y, 40 + 18 * (1 - fl), outline=IR_RED, width=3.2)
            draw_molecule(c, kind, x + sh[0], y + sh[1], ang)


def draw_key(fr, t):
    """What the two molecules are called: a small key, in the free space on the right of the air."""
    a = ease((t - (T_MOL3 + 0.2)) / 0.6)
    with fr.g((722, 138, 860, 330), a) as c:
        c.rrect(730, 144, 852, 322, 14, fill=WHITE, outline=INK, width=2.4)
        for y_s, y_t, kind in ((172, 204, 'CO2'), (250, 304, 'CH4')):
            draw_molecule(c, kind, 791, y_s, 0.0)
            c.text(791, y_t, 'CO₂' if kind == 'CO2' else 'CH₄', 26, INK, 'mm')


def frame(t):
    fr = Frame(BASE)
    wl = level2(WARM_GROUND, t, 0.0)
    lv = level2(WARM_THERM, t, 0.16)
    draw_ground(fr, wl)
    draw_thermometer(fr, lv)
    # the sunbeams stay on the picture, dimmed once step 2 begins so the infrared stands out
    draw_beams(fr, t, 1 - 0.72 * ease((t - T_S2) / 0.5))
    a_sun = ease((t - (T_BEAM0 + 0.5)) / 0.3) * (1 - ease((t - T_S2) / 0.3))
    if a_sun > 0.004:
        with fr.g((150, 30, 300, 90), a_sun) as c: chip(c, 222, 60, 'sunlight')
    draw_waves(fr, t)
    a_ir = ease((t - (T_WAVE0 + 0.9)) / 0.3) * (1 - ease((t - T_S3) / 0.3))   # the 'infrared' chip: step 2 only
    if a_ir > 0.004:
        with fr.g((560, 300, 780, 360), a_ir) as c:
            c.line((MOLS[3][0] + WAVE_DX + 12, 334), (628, 334), INK, 2.4)
            chip(c, 700, 334, 'infrared')
    draw_scatter(fr, t)
    draw_molecules(fr, t)
    draw_key(fr, t)
    caption(fr, CAPS, t, stop=T_END)
    a_end = ease((t - T_END) / 0.5)
    if a_end > 0.004:
        with fr.g((10, 440, W - 10, 536), a_end) as c:
            c.rrect(24, 446, W - 24, 530, 18, fill=DARK)
            for ln, y in zip(END_LINES, (470, 507)):
                assert text_w(ln, 30) < W - 90, ln
                c.text(W / 2, y, ln, 30, WHITE, 'mm')
    return fr.done()


BASE = None
GLOW = None
MASK = None


def init():
    global BASE, GLOW, MASK
    BASE, GLOW, MASK = make_base(), make_glow(), rounded_mask(PANEL, 26)


def main():
    init()
    if '--stills' in sys.argv:
        stills(frame, sys.argv[sys.argv.index('--stills') + 1:])
        return
    render_film(frame, TOTAL, 'atm-greenhouse', COVER_T)


if __name__ == '__main__':
    main()
