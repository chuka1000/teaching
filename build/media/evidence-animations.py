#!/usr/bin/env python3
"""
More Evidence: bones, embryos and DNA (8I). The two I Do animations and the worksheet
diagrams. Generated with PIL and encoded with ffmpeg (CLAUDE.md, Media, preference 1).
Silent, Galapagos colours. They play ON CLICK and PAUSE at every stage.

  evidence-limbs.mp4      four forelimbs (human, cat, whale, bat) with the same bones
                          coloured one group at a time.                        960 x 600
  evidence-embryos.mp4    three early embryos (fish, chicken, human) with the tail and the
                          pharyngeal arches marked, then the three grown-up animals.  960 x 1040
  worksheet-limbs.png     the four limbs with the bones coloured, for the worksheet.

The embryo pictures are our own SCHEMATIC, drawn from one simple shape with small differences.
They show the two features early vertebrate embryos share (a tail and pharyngeal arches). They
are not Haeckel's drawings, which exaggerated the similarity.

    python3 build/media/evidence-animations.py
"""
import pathlib, subprocess, shutil, tempfile, math, sys
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / 'assets' / 'media'
ICONS = ROOT / 'assets' / 'icons'
FPS = 20
DARK, AMBER, AMBER_INK, TEAL, RUST, CREAM, DARKSOFT, CREAM2, INK, VIOLET, GREYB = '#1F3D2B', '#DE9A4C', '#A8651F', '#3E93A3', '#C1442D', '#F5F1E6', '#3A5F44', '#E8E0CC', '#182B1E', '#7A5C99', '#B9B4A6'
ARIAL_B = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
F = lambda s: ImageFont.truetype(ARIAL_B, s)
SS = 2
smooth = lambda t: (lambda t: t * t * (3 - 2 * t))(max(0.0, min(1.0, t)))
lerp = lambda a, b, t: a + (b - a) * t
def mix(c1, c2, t):
    a = tuple(int(c1[i:i + 2], 16) for i in (1, 3, 5)); b = tuple(int(c2[i:i + 2], 16) for i in (1, 3, 5))
    return '#%02X%02X%02X' % tuple(round(lerp(a[i], b[i], t)) for i in range(3))
def canvas(w, h, bg):
    im = Image.new('RGB', (w * SS, h * SS), bg); return im, ImageDraw.Draw(im)
def R(d, box, r, **k): d.rounded_rectangle(tuple(v * SS for v in box), r * SS, **k)
def T(d, xy, text, size, fill, anchor='mm'): d.text((xy[0] * SS, xy[1] * SS), text, font=F(size * SS), fill=fill, anchor=anchor)
def POLY(d, pts, **k): d.polygon([(x * SS, y * SS) for x, y in pts], **k)
def LINE(d, pts, w, fill): d.line([(x * SS, y * SS) for x, y in pts], fill=fill, width=int(w * SS), joint='curve')
def ELL(d, box, **k): d.ellipse(tuple(v * SS for v in box), **k)
def finish(im, size): return im.resize(size, Image.LANCZOS)
def capsule(d, p1, p2, w, fill):
    LINE(d, [p1, p2], w, fill); r = w / 2
    for (x, y) in (p1, p2): ELL(d, (x - r, y - r, x + r, y + r), fill=fill)
def icon(name, size, role='dark'):
    return Image.open(ICONS / f'{name}_galapagos_{role}.png').convert('RGBA').resize((size * SS, size * SS), Image.LANCZOS)
def paste_icon(im, name, cx, cy, size, role='dark'):
    ic = icon(name, size, role); im.paste(ic, (int((cx - size / 2) * SS), int((cy - size / 2) * SS)), ic)
def caption(d, W, H, n, text, top=True):
    y0 = 24 if top else H - 118
    R(d, (30, y0, W - 30, y0 + 94), 18, fill=DARK)
    ELL(d, (48, y0 + 18, 48 + 58, y0 + 18 + 58), fill=AMBER)
    T(d, (77, y0 + 47), str(n), 34, DARK)
    T(d, (126, y0 + 47), text, 31, CREAM, 'lm')
def timeline(holds, move, first_move=0.0):
    t, out = 0.0, []
    for i, h in enumerate(holds):
        start = t; hold_from = start + (move if i else first_move)
        out.append((start, hold_from, hold_from + h)); t = hold_from + h
    return out

# ------------------------------------------------------------------ 1. the four limbs
GROUPS = ['hum', 'rad', 'carp', 'meta', 'pha']
GCOL = {'hum': RUST, 'rad': AMBER, 'carp': TEAL, 'meta': DARK, 'pha': VIOLET}
GNAME = {'hum': 'upper arm (humerus)', 'rad': 'lower arm (radius, ulna)', 'carp': 'wrist', 'meta': 'hand', 'pha': 'fingers'}
def fan(base, tips, w_m, w_p, pha_pts):
    b = []
    for tip in tips: b.append(('meta', base, tip, w_m))
    for pts, w in pha_pts:
        for a, c in zip(pts, pts[1:]): b.append(('pha', a, c, w))
    return b
LIMBS = {
  'human': {'name': 'Human', 'job': 'grasping', 'outline': None, 'bones': (
      [('hum', (110, 10), (102, 110), 16), ('rad', (98, 110), (92, 215), 8), ('rad', (108, 110), (102, 215), 8)]
      + [('carp', (x, y), None, r) for x, y, r in ((92, 228, 6), (102, 228, 6), (112, 228, 6), (88, 239, 6), (98, 239, 6), (108, 239, 6), (118, 239, 6))]
      + fan((100, 246), [(68, 285), (85, 292), (100, 295), (115, 292), (130, 280)], 7, 5,
            [([(68, 285), (50, 308), (38, 325)], 5), ([(85, 292), (80, 318), (77, 338), (75, 355)], 5), ([(100, 295), (100, 325), (100, 348), (100, 368)], 5),
             ([(115, 292), (119, 318), (121, 337), (122, 353)], 5), ([(130, 280), (140, 303), (146, 320), (150, 335)], 5)]))},
  'cat': {'name': 'Cat', 'job': 'walking', 'outline': None, 'bones': (
      [('hum', (110, 10), (105, 80), 15), ('rad', (102, 80), (104, 170), 7), ('rad', (110, 80), (110, 172), 7)]
      + [('carp', (x, y), None, r) for x, y, r in ((100, 183, 5), (110, 183, 5), (105, 193, 5))]
      + fan((105, 198), [(84, 262), (99, 268), (113, 268), (128, 262)], 6, 4,
            [([(84, 262), (82, 292), (81, 312), (81, 328)], 4), ([(99, 268), (98, 298), (98, 318), (98, 336)], 4), ([(113, 268), (114, 298), (114, 318), (114, 336)], 4), ([(128, 262), (131, 290), (132, 310), (133, 325)], 4)]))},
  'whale': {'name': 'Whale', 'job': 'swimming', 'outline': [(96, 10), (128, 12), (156, 70), (178, 150), (180, 250), (170, 320), (136, 372), (108, 378), (76, 366), (46, 330), (34, 250), (38, 190), (58, 100)], 'ocol': '#BFE0E6', 'bones': (
      [('hum', (108, 12), (106, 52), 22), ('rad', (100, 52), (98, 94), 13), ('rad', (114, 52), (112, 94), 13)]
      + [('carp', (x, y), None, r) for x, y, r in ((96, 104, 8), (108, 104, 8), (120, 104, 8), (102, 115, 8), (114, 115, 8))]
      + fan((108, 122), [(70, 160), (90, 168), (108, 170), (126, 166), (144, 158)], 8, 5,
            [([(70, 160), (62, 195), (58, 225), (56, 250), (55, 272), (54, 292)], 5), ([(90, 168), (88, 205), (86, 240), (85, 270), (85, 295), (85, 322)], 5),
             ([(108, 170), (108, 210), (108, 250), (108, 285), (108, 315), (108, 346)], 5), ([(126, 166), (129, 205), (131, 240), (132, 270), (132, 295), (132, 322)], 5),
             ([(144, 158), (150, 190), (153, 220), (155, 246), (156, 268), (156, 288)], 5)]))},
  'bat': {'name': 'Bat', 'job': 'flying', 'outline': [(82, 68), (124, 70), (126, 110), (116, 250), (150, 320), (124, 380), (80, 390), (30, 378), (-2, 352), (2, 262), (38, 204), (58, 140)], 'ocol': '#F0D9AE', 'bones': (
      [('hum', (110, 12), (96, 86), 14), ('rad', (94, 86), (64, 192), 8), ('rad', (98, 86), (86, 130), 4)]
      + [('carp', (x, y), None, r) for x, y, r in ((62, 200, 5), (72, 200, 5), (67, 209, 5))]
      + [('meta', (67, 210), (46, 226), 5)]
      + fan((69, 212), [(30, 266), (52, 296), (82, 310), (110, 300)], 5, 3,
            [([(30, 266), (16, 306), (8, 342)], 3), ([(52, 296), (42, 330), (38, 366)], 3), ([(82, 310), (80, 342), (80, 372)], 3), ([(110, 300), (120, 332), (124, 358)], 3)]))},
}
ORDER = ['human', 'cat', 'whale', 'bat']
HOLD1 = [3.2, 3.2, 3.0, 3.2, 4.4]; MOVE1 = 1.6
ST1 = timeline(HOLD1, MOVE1)
TOTAL1 = ST1[-1][2] + 1.0
CAP1 = ['Four animals. Four different jobs.', 'The same upper and lower arm bones.', 'The same wrist bones.', 'The same hand and finger bones.', 'Same bones, different jobs: a shared ancestor.']
# which groups are coloured by the END of stage i (0-based)
COLOURED = [[], ['hum', 'rad'], ['hum', 'rad', 'carp'], ['hum', 'rad', 'carp', 'meta', 'pha'], ['hum', 'rad', 'carp', 'meta', 'pha']]

def draw_limb(d, key, ox, oy, colour_of, scale=1.0):
    L = LIMBS[key]
    P = lambda p: (ox + p[0] * scale, oy + p[1] * scale)
    if L['outline']: POLY(d, [P(p) for p in L['outline']], fill=L['ocol'])
    for g, a, b, w in L['bones']:
        col = colour_of(g)
        if b is None: ELL(d, (P(a)[0] - w * scale, P(a)[1] - w * scale, P(a)[0] + w * scale, P(a)[1] + w * scale), fill=col)
        else: capsule(d, P(a), P(b), w * scale, col)

def frame_limbs(t, size=(960, 600), final=False):
    W, H = size
    im, d = canvas(W, H, CREAM)
    stage = [i for i in range(5) if t >= ST1[i][0]][-1]
    prog = {}
    for g in GROUPS:                                                   # how coloured each group is (0 grey .. 1 colour)
        first = next((i for i in range(5) if g in COLOURED[i]), None)
        prog[g] = 0.0 if first is None else (1.0 if stage > first else smooth((t - ST1[first][0]) / MOVE1) if stage == first else 0.0)
    colour_of = lambda g: mix(GREYB, GCOL[g], prog[g])
    for i, key in enumerate(ORDER):
        ox = 20 + i * 232
        R(d, (ox - 4, 130, ox + 220, 552), 16, fill='#FFFFFF', outline=CREAM2, width=2 * SS)
        draw_limb(d, key, ox + 12, 142, colour_of, 0.88)
        T(d, (ox + 108, 536), LIMBS[key]['name'], 26, DARK)
    # the job under each name from the start; the legend from stage 2
    for i, key in enumerate(ORDER): T(d, (20 + i * 232 + 108, 574), LIMBS[key]['job'], 24, AMBER_INK)
    caption(d, W, H, stage + 1, CAP1[stage])
    return finish(im, (W, H))

# ------------------------------------------------------------------ 2. the embryos
W2, H2 = 960, 1040
HOLD2 = [3.4, 3.6, 3.6, 4.4]; ST2 = timeline(HOLD2, 1.8, first_move=1.2); TOTAL2 = ST2[-1][2] + 1.0
CAP2 = ['Early on, they all look alike.', 'A tail and pharyngeal arches: in all three.', 'Later they grow into very different animals.', 'Similar early development suggests a shared ancestor.']

def embryo(d, cx, cy, kind, tail_col, arch_col, scale=1.0):
    """A curved embryo (a comma): head at the top, a tail curling round. One shape, small differences."""
    pts_c = []
    n = 60
    for k in range(n + 1):
        u = k / n; a = math.radians(-70 + u * 300)
        r = lerp(74, 26, u) * scale
        pts_c.append((cx + r * math.cos(a), cy + r * math.sin(a) * 1.05))
    widths = [lerp(64, 8, (k / n) ** 0.9) * scale for k in range(n + 1)]
    body = mix('#E9C9A0', '#D2A26E', 0.35)
    for k in range(n + 1):
        w = widths[k]; x, y = pts_c[k]
        ELL(d, (x - w / 2, y - w / 2, x + w / 2, y + w / 2), fill=body)
    hx, hy = pts_c[3]
    ELL(d, (hx - 12 * scale, hy - 6 * scale, hx + 6 * scale, hy + 12 * scale), fill=INK)                                    # the eye
    if kind == 'chicken': POLY(d, [(hx + 26 * scale, hy - 10 * scale), (hx + 52 * scale, hy + 2 * scale), (hx + 26 * scale, hy + 12 * scale)], fill='#D9A441')   # a beak bud
    if kind == 'fish': POLY(d, [(hx + 20 * scale, hy - 16 * scale), (hx + 44 * scale, hy - 2 * scale), (hx + 20 * scale, hy + 10 * scale)], fill='#C9B79A')          # a snout
    return pts_c, widths

def frame_embryos(t, size=(W2, H2)):
    W, H = size
    im, d = canvas(W, H, CREAM)
    stage = [i for i in range(4) if t >= ST2[i][0]][-1]
    show_marks = stage >= 1
    later = smooth((t - ST2[2][0]) / 1.8) if stage >= 2 else 0.0
    T(d, (60, 150), 'Early embryos', 34, DARK, 'lm')
    kinds = [('fish', 'Fish'), ('chicken', 'Chicken'), ('human', 'Human')]
    for i, (k, nm) in enumerate(kinds):
        cx = 170 + i * 310
        R(d, (cx - 142, 180, cx + 142, 560), 16, fill='#FFFFFF', outline=CREAM2, width=2 * SS)
        pts, widths = embryo(d, cx - 6, 385, k, RUST, TEAL, 1.2)
        if show_marks:
            a = smooth((t - ST2[1][0]) / 1.2)
            # the tail: the tip of the comma
            tx, ty = pts[-1]
            ELL(d, (tx - 16, ty - 16, tx + 16, ty + 16), outline=RUST, width=6 * SS)
            LINE(d, [(tx + 16, ty + 16), (tx + 52, ty + 46)], 4, RUST); T(d, (tx + 86, ty + 58), 'tail', 24, RUST, 'mm')
            # pharyngeal arches: three short bars across the neck
            for j in range(3):
                bx, by = pts[7 + j * 4]
                LINE(d, [(bx - 24, by - 6), (bx + 24, by + 12)], 6, TEAL)
            T(d, (cx - 60, 222), 'arches', 24, TEAL, 'mm'); LINE(d, [(cx - 40, 236), (pts[9][0] - 6, pts[9][1] - 36)], 3, TEAL)
        T(d, (cx, 585), nm, 30, DARK)
    # the grown-up animals
    if stage >= 2:
        a = later
        T(d, (60, 630), 'Later', 34, DARK, 'lm')
        LINE(d, [(170, 610), (170, 632)], 6, AMBER_INK)
        POLY(d, [(170, 648), (154, 626), (186, 626)], fill=AMBER_INK)
        for i, (k, nm) in enumerate(kinds):
            cx = 170 + i * 310
            R(d, (cx - 142, 660, cx + 142, 895), 16, fill='#FFFFFF', outline=CREAM2, width=2 * SS)
            ic = {'fish': 'fish', 'chicken': 'chicken', 'human': 'person'}[k]
            paste_icon(im, ic, cx, 778, int(150 * a) or 1)
            T(d, (cx, 880), '', 1, DARK)
    caption(d, W, H, stage + 1, CAP2[stage], top=False)
    return finish(im, (W, H))

def render(name, frame, total, size):
    n = int(total * FPS); tmp = pathlib.Path(tempfile.mkdtemp())
    for i in range(n): frame(i / FPS).save(tmp / f'{i:04d}.png')
    out = OUT / f'{name}.mp4'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', str(tmp / '%04d.png'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '26', '-preset', 'veryslow', str(out)], check=True)
    frame(0.3).save(OUT / f'{name}.png'); shutil.rmtree(tmp)
    print(f'{out.name}: {n} frames, {total:.1f} s, {out.stat().st_size // 1024} KB')

def worksheet_limbs():
    """The four limbs with every bone group coloured, and a legend, for the worksheet (colour is fine on paper for this class)."""
    W, H = 900, 560
    im, d = canvas(W, H, '#FFFFFF')
    for i, key in enumerate(ORDER):
        ox = 24 + i * 218
        draw_limb(d, key, ox, 20, lambda g: GCOL[g], 0.95)
        T(d, (ox + 100, 400), LIMBS[key]['name'], 26, DARK)
        T(d, (ox + 100, 432), LIMBS[key]['job'], 22, AMBER_INK)
    for j, g in enumerate(GROUPS):
        x = 30 + j * 172
        R(d, (x, 480, x + 22, 502), 4, fill=GCOL[g]); T(d, (x + 30, 492), {'hum': 'humerus', 'rad': 'radius, ulna', 'carp': 'wrist bones', 'meta': 'hand bones', 'pha': 'finger bones'}[g], 18, INK, 'lm')
    finish(im, (W, H)).save(OUT / 'evidence-worksheet-limbs.png'); print('evidence-worksheet-limbs.png')

if __name__ == '__main__':
    arg = sys.argv[1] if len(sys.argv) > 1 else ''
    if arg == 'still':
        for i in range(5): frame_limbs(ST1[i][2] - 0.3).save(f'/tmp/e1_{i}.png')
        for i in range(4): frame_embryos(ST2[i][2] - 0.3).save(f'/tmp/e2_{i}.png')
        worksheet_limbs()
    else:
        render('evidence-limbs', frame_limbs, TOTAL1, (960, 600))
        render('evidence-embryos', frame_embryos, TOTAL2, (W2, H2))
        worksheet_limbs()
