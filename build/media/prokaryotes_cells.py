#!/usr/bin/env python3
"""
Y8 Science, Unit 3 Prokaryotes: the two cell diagrams, drawn once and used everywhere (slides, worksheets, assessment).

  python3 build/media/prokaryotes_cells.py          # writes assets/pictures/prok_*.png and assets/pictures/prok-cells.json

Every layer is a 1500 x 1000 transparent PNG on the same canvas, so a slide can stack them and bring each part in on its own click.
  eukaryote (an animal cell):  euk_cell (membrane + cytoplasm), euk_nuc (nucleus + its DNA), euk_mito, euk_ribo, euk_full
  prokaryote (a bacterium):    prok_wall, prok_cyto (membrane + cytoplasm), prok_ribo, prok_dna (the main loop), prok_plasmid, prok_flag, prok_full
  lettered versions for worksheets:  euk_lettered, prok_lettered (colour); prok_bw_lettered, prok_bw_blank (black and white, for the assessment)
The JSON holds each part's anchor point (where a leader line ends) and a label slot, in canvas pixels, so the slide builders place real,
editable text labels in the same place every time. Nothing here is a photograph: a real micrograph goes beside it (assets/photos/bac_*.jpg).
"""
import json, math, pathlib, random
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / 'assets' / 'pictures'
OUT.mkdir(parents=True, exist_ok=True)
SS = 3
CW_, CH_ = 1500, 1000

COL = dict(
    ink='301338', cyto='F0E2F4', nuc='D6B8E2', nucline='502456', dna='4C7A12', mito='F4B3A6', mitoline='C73C28',
    wall='B5E06A', wallline='4C7A12', plasmid='167A74', ribo='502456', flag='301338', leader='301338',
)
BW = dict(
    ink='000000', cyto='F4F4F4', nuc='D9D9D9', nucline='000000', dna='000000', mito='BFBFBF', mitoline='000000',
    wall='CFCFCF', wallline='000000', plasmid='000000', ribo='000000', flag='000000', leader='000000',
)


def rgba(h, a=255):
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)


class Layer:
    def __init__(self):
        self.im = Image.new('RGBA', (CW_ * SS, CH_ * SS), (0, 0, 0, 0))
        self.d = ImageDraw.Draw(self.im)

    def pts(self, p):
        return [(x * SS, y * SS) for x, y in p]

    def poly(self, p, fill=None, outline=None, width=0):
        q = self.pts(p)
        if fill:
            self.d.polygon(q, fill=rgba(fill))
        if outline:
            self.stroke(p, width, outline, closed=True)

    def stroke(self, p, width, colour, closed=False):
        q = self.pts(p + ([p[0]] if closed else []))
        self.d.line(q, fill=rgba(colour), width=int(width * SS), joint='curve')
        r = width * SS / 2
        for x, y in ([q[0], q[-1]] if not closed else [q[0]]):
            self.d.ellipse([x - r, y - r, x + r, y + r], fill=rgba(colour))

    def dot(self, x, y, r, fill, outline=None, width=0):
        self.d.ellipse([(x - r) * SS, (y - r) * SS, (x + r) * SS, (y + r) * SS], fill=rgba(fill), outline=rgba(outline) if outline else None, width=int(width * SS))

    def finish(self):
        return self.im.resize((CW_, CH_), Image.LANCZOS)


def catmull(p, closed=False, n=14):
    """A smooth curve through the points."""
    if closed:
        pp = [p[-1]] + p + [p[0], p[1]]
    else:
        pp = [p[0]] + p + [p[-1]]
    out = []
    for i in range(1, len(pp) - 2):
        p0, p1, p2, p3 = pp[i - 1], pp[i], pp[i + 1], pp[i + 2]
        for k in range(n):
            t = k / n
            out.append(tuple(0.5 * ((2 * p1[j]) + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t * t + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t ** 3) for j in (0, 1)))
    if not closed:
        out.append(p[-1])
    return out


def capsule(x0, y0, x1, y1, n=40):
    r = (y1 - y0) / 2
    cy = (y0 + y1) / 2
    p = []
    for i in range(n + 1):
        a = -math.pi / 2 + math.pi * i / n
        p.append((x1 - r + r * math.cos(a), cy + r * math.sin(a)))
    for i in range(n + 1):
        a = math.pi / 2 + math.pi * i / n
        p.append((x0 + r + r * math.cos(a), cy + r * math.sin(a)))
    return p


def in_capsule(x, y, x0, y0, x1, y1, margin=0):
    r = (y1 - y0) / 2 - margin
    cy = (y0 + y1) / 2
    if x0 + r <= x <= x1 - r:
        return abs(y - cy) <= r
    cx = x0 + r if x < x0 + r else x1 - r
    return (x - cx) ** 2 + (y - cy) ** 2 <= r * r


# ------------------------------------------------------------------------------------------------ eukaryote
EC = (750, 500)


def euk_outline(scale=1.0):
    p = []
    for i in range(120):
        t = 2 * math.pi * i / 120
        k = 1 + 0.035 * math.sin(2 * t + 0.6) + 0.025 * math.sin(3 * t + 1.1) + 0.012 * math.sin(5 * t)
        p.append((EC[0] + 590 * k * scale * math.cos(t), EC[1] + 410 * k * scale * math.sin(t)))
    return p


NUC = (620, 470, 168)                    # x, y, r
MITOS = [(960, 380, -28), (985, 650, 24), (480, 740, -8)]   # x, y, angle
EUK_RIBO_SEED = 11


def mito_poly(x, y, ang, a=92, b=48):
    p = []
    for i in range(40):
        t = 2 * math.pi * i / 40
        px, py = a * math.cos(t), b * math.sin(t)
        c, s = math.cos(math.radians(ang)), math.sin(math.radians(ang))
        p.append((x + px * c - py * s, y + px * s + py * c))
    return p


def euk_ribosomes(n=34):
    rnd = random.Random(EUK_RIBO_SEED)
    out = []
    outline = euk_outline(0.90)
    xs = [q[0] for q in outline]; ys = [q[1] for q in outline]
    tries = 0
    while len(out) < n and tries < 4000:
        tries += 1
        x, y = rnd.uniform(min(xs), max(xs)), rnd.uniform(min(ys), max(ys))
        if ((x - EC[0]) / (590 * 0.88)) ** 2 + ((y - EC[1]) / (410 * 0.88)) ** 2 > 1:
            continue
        if (x - NUC[0]) ** 2 + (y - NUC[1]) ** 2 < (NUC[2] + 34) ** 2:
            continue
        if any(((x - mx) / 125) ** 2 + ((y - my) / 80) ** 2 < 1 for mx, my, _ in MITOS):
            continue
        if any((x - ox) ** 2 + (y - oy) ** 2 < 60 ** 2 for ox, oy in out):
            continue
        out.append((x, y))
    return out


def draw_euk(c):
    layers = {}
    L = Layer(); outline = euk_outline()
    L.poly(outline, fill=c['cyto'], outline=c['ink'], width=10); layers['euk_cell'] = L
    L = Layer(); x, y, r = NUC
    L.dot(x, y, r, c['nuc'], c['nucline'], 8)
    rnd = random.Random(5)
    for k in range(3):                                   # the DNA, coiled inside the nucleus
        pts = []
        cx, cy = x + rnd.uniform(-35, 35), y + rnd.uniform(-35, 35)
        for i in range(9):
            t = 2 * math.pi * i / 9
            rr = rnd.uniform(40, 100)
            pts.append((cx + rr * math.cos(t), cy + rr * math.sin(t)))
        L.stroke(catmull(pts, closed=True), 6, c['dna'], closed=True)
    layers['euk_nuc'] = L
    L = Layer()
    for mx, my, ang in MITOS:
        L.poly(mito_poly(mx, my, ang), fill=c['mito'], outline=c['mitoline'], width=8)
        ca, sa = math.cos(math.radians(ang)), math.sin(math.radians(ang))
        for k in (-45, -15, 15, 45):                     # the folds inside
            def rot(px, py): return (mx + px * ca - py * sa, my + px * sa + py * ca)
            L.stroke([rot(k, -30), rot(k + 10, -8), rot(k - 6, 10), rot(k + 4, 30)], 4.5, c['mitoline'])
    layers['euk_mito'] = L
    L = Layer()
    rib = euk_ribosomes()
    for x, y in rib:
        L.dot(x, y, 9, c['ribo'])
    layers['euk_ribo'] = L
    return layers, rib


# ------------------------------------------------------------------------------------------------ prokaryote
PO = (140, 250, 1120, 750)               # outer capsule (the wall's outer edge)
PI = (184, 294, 1076, 706)               # inner capsule (the membrane)
DNA_C = (560, 500)
PLASMIDS = [(835, 410, 34, 30), (905, 585, 30, 36), (770, 590, 28, 26)]   # x, y, rx, ry
FLAG_START = (1100, 500)


def dna_curve():
    pts = []
    for i in range(200):
        t = 2 * math.pi * i / 200
        x = DNA_C[0] + 105 * math.cos(t) + 52 * math.cos(3 * t + 0.7) + 22 * math.cos(7 * t + 2.0)
        y = DNA_C[1] + 85 * math.sin(t) + 44 * math.sin(4 * t + 1.2) + 20 * math.sin(6 * t)
        pts.append((x, y))
    return pts


def flag_curve():
    pts = [FLAG_START]
    for i in range(1, 30):
        u = i / 29
        x = FLAG_START[0] + 360 * u
        y = FLAG_START[1] + 62 * math.sin(u * 3.2 * math.pi) * (0.25 + 0.75 * u)
        pts.append((x, y))
    return pts


def prok_ribosomes(n=40):
    rnd = random.Random(7)
    out = []
    tries = 0
    while len(out) < n and tries < 6000:
        tries += 1
        x, y = rnd.uniform(PI[0], PI[2]), rnd.uniform(PI[1], PI[3])
        if not in_capsule(x, y, *PI, margin=26):
            continue
        if ((x - DNA_C[0]) / 215) ** 2 + ((y - DNA_C[1]) / 165) ** 2 < 1:
            continue
        if any(((x - px) / (rx + 28)) ** 2 + ((y - py) / (ry + 28)) ** 2 < 1 for px, py, rx, ry in PLASMIDS):
            continue
        if any((x - ox) ** 2 + (y - oy) ** 2 < 52 ** 2 for ox, oy in out):
            continue
        out.append((x, y))
    return out


def draw_prok(c, flagellum=True, plasmids=True):
    layers = {}
    L = Layer()
    L.poly(capsule(*PO), fill=c['wall'], outline=c['wallline'], width=7)
    L.d.polygon(L.pts(capsule(*PI)), fill=(0, 0, 0, 0))     # the hole: the wall is a band
    layers['prok_wall'] = L
    L = Layer()
    L.poly(capsule(*PI), fill=c['cyto'], outline=c['ink'], width=8)
    layers['prok_cyto'] = L
    rib = prok_ribosomes()
    L = Layer()
    for x, y in rib:
        L.dot(x, y, 9, c['ribo'])
    layers['prok_ribo'] = L
    L = Layer()
    L.stroke(catmull(dna_curve(), closed=True, n=2), 8, c['dna'], closed=True)
    layers['prok_dna'] = L
    L = Layer()
    if plasmids:
        for x, y, rx, ry in PLASMIDS:
            L.d.ellipse([(x - rx) * SS, (y - ry) * SS, (x + rx) * SS, (y + ry) * SS], outline=rgba(c['plasmid']), width=int(8 * SS))
    layers['prok_plasmid'] = L
    L = Layer()
    if flagellum:
        L.stroke(catmull(flag_curve(), n=6), 10, c['flag'])
        L.dot(FLAG_START[0] + 4, FLAG_START[1], 17, c['flag'])
    layers['prok_flag'] = L
    return layers, rib


def flatten(layers, order, bgcol=None):
    im = Image.new('RGBA', (CW_, CH_), rgba(bgcol) if bgcol else (0, 0, 0, 0))
    for k in order:
        im = Image.alpha_composite(im, layers[k].finish() if isinstance(layers[k], Layer) else layers[k])
    return im


def nearest(points, x, y):
    return min(points, key=lambda p: (p[0] - x) ** 2 + (p[1] - y) ** 2)


# ------------------------------------------------------------------------------------------------ anchors and label slots
def free_point(test, obstacles, box, step=8):
    """The point inside the region that is furthest from everything drawn there: an empty spot a leader line can end on."""
    best, bp = -1, None
    for x in range(box[0], box[2], step):
        for y in range(box[1], box[3], step):
            if not test(x, y):
                continue
            m = min((x - ox) ** 2 + (y - oy) ** 2 for ox, oy in obstacles)
            if m > best:
                best, bp = m, (x, y)
    return bp


def anchors(euk_rib, prok_rib):
    ep = euk_outline()
    mem = min(ep, key=lambda p: (p[0] - 1325) ** 2 + (p[1] - 330) ** 2)
    er = nearest(euk_rib, 330, 600)
    euk_obs = list(euk_rib) + [(NUC[0] + NUC[2] * math.cos(t / 10), NUC[1] + NUC[2] * math.sin(t / 10)) for t in range(63)]
    for mx, my, _ in MITOS:
        euk_obs += [(mx + dx, my + dy) for dx in (-90, 0, 90) for dy in (-45, 0, 45)]
    ecy = free_point(lambda x, y: ((x - EC[0]) / 500) ** 2 + ((y - EC[1]) / 340) ** 2 < 1 and x > 1000, euk_obs, (1000, 300, 1320, 700))
    dnap = dna_curve()
    prok_obs = list(prok_rib) + dnap[::3]
    for px, py, rx, ry in PLASMIDS:
        prok_obs += [(px + rx * math.cos(t / 5), py + ry * math.sin(t / 5)) for t in range(32)]
    pcy = free_point(lambda x, y: in_capsule(x, y, *PI, margin=50) and 800 < x < 1000, prok_obs, (800, 300, 1000, 700))
    pr = nearest(prok_rib, 1010, 380)
    A = {
        'euk': {
            'membrane':      dict(ax=mem[0], ay=mem[1], lx=1170, ly=90, side='R', ly_slide=250),
            'cytoplasm':     dict(ax=ecy[0], ay=ecy[1], lx=1400, ly=470, side='R', ly_slide=470),
            'nucleus':       dict(ax=520, ay=470, lx=210, ly=130, side='L', ly_slide=330),
            'mitochondrion': dict(ax=MITOS[1][0], ay=MITOS[1][1], lx=1290, ly=870, side='R', ly_slide=720),
            'ribosomes':     dict(ax=er[0], ay=er[1], lx=210, ly=870, side='L', ly_slide=620),
        },
        'prok': {
            'cell wall':     dict(ax=380, ay=272, lx=250, ly=110, side='T'),
            'cell membrane': dict(ax=330, ay=706, lx=300, ly=900, side='B'),
            'cytoplasm':     dict(ax=pcy[0], ay=pcy[1], lx=860, ly=110, side='T'),
            'ribosomes':     dict(ax=pr[0], ay=pr[1], lx=1140, ly=110, side='T'),
            'main DNA loop': dict(ax=DNA_C[0] - 8, ay=DNA_C[1] - 128, lx=560, ly=110, side='T'),
            'plasmid':       dict(ax=PLASMIDS[1][0] + PLASMIDS[1][2] - 2, ay=PLASMIDS[1][1], lx=900, ly=900, side='B'),
            'flagellum':     dict(ax=1330, ay=flag_curve()[18][1], lx=1330, ly=900, side='B'),
        },
    }
    return A


FONT = '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'


def lettered(base, parts, order, c, name):
    """The base diagram with a circled letter at each part's label slot and a leader line to its anchor."""
    im = base.copy().convert('RGBA')
    big = im.resize((CW_ * 2, CH_ * 2), Image.LANCZOS)
    d = ImageDraw.Draw(big)
    f = ImageFont.truetype(FONT, 74)
    for letter, key in zip('ABCDEFG', order):
        p = parts[key]
        ax, ay, lx, ly = [v * 2 for v in (p['ax'], p['ay'], p['lx'], p['ly'])]
        d.line([(lx, ly), (ax, ay)], fill=rgba(c['leader']), width=7)
        d.ellipse([ax - 14, ay - 14, ax + 14, ay + 14], fill=rgba(c['leader']))
        r = 62
        d.ellipse([lx - r, ly - r, lx + r, ly + r], fill=(255, 255, 255, 255), outline=rgba(c['leader']), width=7)
        d.text((lx, ly - 3), letter, font=f, fill=rgba(c['leader']), anchor='mm')
    out = big.resize((CW_, CH_), Image.LANCZOS)
    out.save(OUT / f'{name}.png')
    return out


def draw_shapes():
    """The three bacterial shapes, one cell each: coccus (sphere), bacillus (rod), spirillum (spiral). Lime body, dark green outline."""
    out = {}
    L = Layer(); L.dot(750, 500, 235, COL['wall'], COL['wallline'], 14); L.dot(750, 500, 150, COL['cyto'], COL['ink'], 8); out['shape_coccus'] = L
    L = Layer(); L.poly(capsule(330, 340, 1170, 660), fill=COL['wall'], outline=COL['wallline'], width=14); L.poly(capsule(400, 405, 1100, 595), fill=COL['cyto'], outline=COL['ink'], width=8); out['shape_bacillus'] = L
    L = Layer()
    dense = [(190 + 1120 * i / 900, 500 + 150 * math.sin(i / 900 * 4.5 * math.pi)) for i in range(901)]
    for r, col in ((54, COL['wallline']), (42, COL['wall']), (22, COL['cyto'])):
        for x, y in dense:
            L.dot(x, y, r, col)
    out['shape_spirillum'] = L
    return out


def main():
    euk, erib = draw_euk(COL)
    prok, prib = draw_prok(COL)
    for k, L in {**euk, **prok}.items():
        L.finish().save(OUT / f'{k}.png')
    flatten(euk, ['euk_cell', 'euk_nuc', 'euk_mito', 'euk_ribo']).save(OUT / 'euk_full.png')
    prok_full = flatten(prok, ['prok_wall', 'prok_cyto', 'prok_ribo', 'prok_dna', 'prok_plasmid', 'prok_flag'])
    prok_full.save(OUT / 'prok_full.png')
    A = anchors(erib, prib)
    (OUT / 'prok-cells.json').write_text(json.dumps({'canvas': [CW_, CH_], 'anchors': A}, indent=1))
    # lettered (worksheet) versions, on white
    ef = flatten(euk, ['euk_cell', 'euk_nuc', 'euk_mito', 'euk_ribo'], 'FFFFFF')
    pf = flatten(prok, ['prok_wall', 'prok_cyto', 'prok_ribo', 'prok_dna', 'prok_plasmid', 'prok_flag'], 'FFFFFF')
    lettered(ef, A['euk'], ['nucleus', 'membrane', 'cytoplasm', 'mitochondrion', 'ribosomes'], COL, 'euk_lettered')
    PORDER = ['cell wall', 'ribosomes', 'plasmid', 'cell membrane', 'main DNA loop', 'flagellum', 'cytoplasm']
    lettered(pf, A['prok'], PORDER, COL, 'prok_lettered')
    # black and white, for the assessment
    ebw, erib2 = draw_euk(BW)
    pbw, prib2 = draw_prok(BW)
    flatten(pbw, ['prok_wall', 'prok_cyto', 'prok_ribo', 'prok_dna', 'prok_plasmid', 'prok_flag'], 'FFFFFF').convert('L').save(OUT / 'prok_bw_blank.png')
    pbw_f = flatten(pbw, ['prok_wall', 'prok_cyto', 'prok_ribo', 'prok_dna', 'prok_plasmid', 'prok_flag'], 'FFFFFF')
    lettered(pbw_f, A['prok'], PORDER, BW, 'prok_bw_lettered')
    Image.open(OUT / 'prok_bw_lettered.png').convert('L').save(OUT / 'prok_bw_lettered.png')
    flatten(ebw, ['euk_cell', 'euk_nuc', 'euk_mito', 'euk_ribo'], 'FFFFFF').convert('L').save(OUT / 'euk_bw_blank.png')
    for k, L in draw_shapes().items():
        L.finish().save(OUT / f'{k}.png')
    print('cells written to', OUT)


if __name__ == '__main__':
    main()
