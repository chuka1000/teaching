#!/usr/bin/env python3
"""
The periodic table pictures and element tiles for T3 Unit 8 (The Periodic Table), in the style of the deck taught on
Friday 9 October 2026: three colours (blue = metal, green = gas, grey = other), one box per element, the atomic
number in the corner, and the elements a lesson is about shown as dark boxes with a yellow edge.

  python3 tools/make-periodic-table.py            # every picture below, into assets/pictures/
  python3 tools/make-periodic-table.py pt_vials   # just these

Table pictures are 2341 x 1263 PNGs with a transparent background. Modes:
  full      every box in its colour (blue / green / grey)
  faded     every box pale, so only the lit boxes stand out
  metals    metals in blue, everything else pale
  nonmetals every non-metal (green and grey) in its colour, the metals pale
A lit box is dark with a yellow edge in every mode.

Element tiles are 600 x 600: atomic number, big symbol, name, as on the table.

Which elements are metals follows the colours on the taught table (build/periodic-data.js reads this same list): the
grey elements are the solids that are not metals, the few in between (B, Si, Ge, As, Sb, Te), bromine, astatine and
104 to 118; the green ones are the 11 gases.
"""
import pathlib, sys
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).parent.parent
OUT = ROOT / 'assets' / 'pictures'

SYMBOLS = ('H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr '
           'Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu '
           'Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr '
           'Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og').split()
assert len(SYMBOLS) == 118
Z = {s: i + 1 for i, s in enumerate(SYMBOLS)}

NAMES = {'H': 'Hydrogen', 'He': 'Helium', 'C': 'Carbon', 'N': 'Nitrogen', 'O': 'Oxygen', 'Al': 'Aluminium', 'Si': 'Silicon',
         'S': 'Sulfur', 'Fe': 'Iron', 'Cu': 'Copper', 'Au': 'Gold', 'Ag': 'Silver', 'Zn': 'Zinc', 'Sn': 'Tin', 'Pb': 'Lead',
         'Na': 'Sodium', 'Ca': 'Calcium', 'Cl': 'Chlorine', 'Ne': 'Neon', 'Mg': 'Magnesium'}

GASES = {'H', 'He', 'N', 'O', 'F', 'Ne', 'Cl', 'Ar', 'Kr', 'Xe', 'Rn'}
OTHER = {'B', 'C', 'Si', 'P', 'S', 'Ge', 'As', 'Se', 'Br', 'Sb', 'Te', 'I', 'At'} | set(SYMBOLS[103:])


def kind(sym):
    return 'gas' if sym in GASES else 'other' if sym in OTHER else 'metal'


BLUE, GREEN, GREY = (156, 196, 228), (143, 220, 192), (218, 223, 227)
FADE, FADE_TEXT = (238, 242, 245), (183, 194, 203)
DARK, YELLOW, INK = (18, 59, 84), (255, 209, 102), (14, 42, 59)
FILL = {'metal': BLUE, 'gas': GREEN, 'other': GREY}
BOLD = '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'


def font(size):
    return ImageFont.truetype(BOLD, size)


def positions():
    """symbol -> (column, row) on the 18-column grid; the two long rows sit under the table."""
    pos = {}
    def put(row, cols, syms):
        for c, s in zip(cols, syms):
            pos[s] = (c, row)
    put(0, [0, 17], ['H', 'He'])
    put(1, [0, 1] + list(range(12, 18)), ['Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne'])
    put(2, [0, 1] + list(range(12, 18)), ['Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar'])
    put(3, range(18), SYMBOLS[18:36])
    put(4, range(18), SYMBOLS[36:54])
    put(5, [0, 1] + list(range(3, 18)), ['Cs', 'Ba'] + SYMBOLS[71:86])
    put(6, [0, 1] + list(range(3, 18)), ['Fr', 'Ra'] + SYMBOLS[103:118])
    put(7.4, range(2, 17), SYMBOLS[56:71])     # La to Lu
    put(8.4, range(2, 17), SYMBOLS[88:103])    # Ac to Lr
    return pos


POS = positions()
assert len(POS) == 118


def table(lit=(), mode='full', ring=()):
    W, H = 2341, 1263
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    x0, y0, pitch_x, pitch_y, tile = 41, 72, 125.8, 126.0, 117
    num_f, sym_f = font(21), font(55)

    def box(c, r, fill, edge=None, label=None, sym=None, tcol=INK, num=None):
        x, y = x0 + c * pitch_x, y0 + r * pitch_y
        d.rounded_rectangle([x, y, x + tile, y + tile], radius=11, fill=fill, outline=edge, width=7 if edge == YELLOW else 1)
        if label:
            d.text((x + tile / 2, y + tile / 2), label, font=font(30), fill=tcol, anchor='mm')
            return
        d.text((x + 8, y + 7), str(num), font=num_f, fill=tcol, anchor='la')
        d.text((x + tile / 2, y + tile / 2 + 6), sym, font=sym_f, fill=tcol, anchor='mm')

    for sym, (c, r) in POS.items():
        k = kind(sym)
        coloured = mode == 'full' or (mode == 'metals' and k == 'metal') or (mode == 'nonmetals' and k != 'metal')
        if sym in ring:      # keeps its colour (so the colour can be read) inside a dark edge and a yellow halo
            x, y = x0 + c * pitch_x, y0 + r * pitch_y
            d.rounded_rectangle([x - 8, y - 8, x + tile + 8, y + tile + 8], radius=16, fill=YELLOW)
            d.rounded_rectangle([x - 2, y - 2, x + tile + 2, y + tile + 2], radius=12, fill=DARK)
            d.rounded_rectangle([x + 4, y + 4, x + tile - 4, y + tile - 4], radius=8, fill=FILL[k])
            d.text((x + 10, y + 11), str(Z[sym]), font=num_f, fill=INK, anchor='la')
            d.text((x + tile / 2, y + tile / 2 + 6), sym, font=sym_f, fill=INK, anchor='mm')
        elif sym in lit:
            box(c, r, DARK, YELLOW, sym=sym, tcol=YELLOW, num=Z[sym])
        elif coloured:
            box(c, r, FILL[k], (170, 178, 186) if k == 'other' else None, sym=sym, num=Z[sym])
        else:
            box(c, r, FADE, (214, 221, 227), sym=sym, tcol=FADE_TEXT, num=Z[sym])
    # the two pointers to the long rows
    box(2, 5, (255, 255, 255), (130, 150, 165), label='La–Lu', tcol=(70, 100, 120))
    box(2, 6, (255, 255, 255), (130, 150, 165), label='Ac–Lr', tcol=(70, 100, 120))
    return im


def tile(sym, size=600):
    im = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=int(size * 0.09), fill=YELLOW)
    d.rounded_rectangle([size * 0.02, size * 0.02, size * 0.98, size * 0.98], radius=int(size * 0.075), fill=DARK)
    d.text((size * 0.09, size * 0.07), str(Z[sym]), font=font(int(size * 0.14)), fill=YELLOW, anchor='la')
    d.text((size / 2, size * 0.47), sym, font=font(int(size * (0.40 if len(sym) == 1 else 0.38))), fill=(255, 255, 255), anchor='mm')
    d.text((size / 2, size * 0.88), NAMES[sym], font=font(int(size * 0.105)), fill=YELLOW, anchor='mm')
    return im


# What each lesson needs. Keys are the picture names the decks use (build/periodic-kit.js).
TABLES = {
    'pt_full': dict(mode='full'),                                    # lesson 2: the table, in the colours of lesson 1
    'pt_vials_ring': dict(mode='full', ring=['Cu', 'C', 'S', 'Si']),  # lesson 2: the four sealed vials, their colours still readable
}
TILES = ['He', 'O', 'Fe', 'Cu', 'Au', 'C', 'S', 'Si', 'Al']


def main(only):
    OUT.mkdir(parents=True, exist_ok=True)
    for key, o in TABLES.items():
        if only and key not in only:
            continue
        table(lit=o.get('lit', ()), mode=o['mode'], ring=o.get('ring', ())).save(OUT / f'{key}.png', optimize=True)
        print('wrote', key)
    for s in TILES:
        key = f'tile_{s}'
        if only and key not in only:
            continue
        tile(s).save(OUT / f'{key}.png', optimize=True)
        print('wrote', key)


if __name__ == '__main__':
    main(set(sys.argv[1:]))
