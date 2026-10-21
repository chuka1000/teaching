#!/usr/bin/env python3
"""
Area With A Bracket: the rectangle pictures for the worksheet (8CN). Drawn with the same helper as Lesson 8
(build/media/shapes-and-prices-shapes.py): a labelled polygon in the Number Revision colours. For an AREA picture
the width is written on the left side and the length along the top, so "width x length" reads straight off.

  python3 build/media/area-with-a-bracket-shapes.py          # into assets/worksheets/expressions/
"""
import importlib.util, pathlib

HERE = pathlib.Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('shapes_l8', HERE / 'shapes-and-prices-shapes.py')
sh = importlib.util.module_from_spec(spec); spec.loader.exec_module(sh)
S = sh.S

R = [(110, 95), (410, 95), (410, 245), (110, 245)]


def area_rect(name, width, length, both=False):
    """Rectangle: the width on the left, the length along the top. both=True labels all four sides (a perimeter question)."""
    labels = [length, width, length, width] if both else [length, '', '', width]
    sh.draw(name, R, labels)


def crop_all(names):
    """Trim the empty bands above and below each picture, so six of them do not eat a page of paper."""
    from PIL import Image, ImageChops
    for n in names:
        im = Image.open(sh.OUT / f'{n}.png').convert('RGB')
        bbox = ImageChops.difference(im, Image.new('RGB', im.size, 'white')).getbbox()
        im.crop((0, max(0, bbox[1] - 12), im.width, min(im.height, bbox[3] + 12))).save(sh.OUT / f'{n}.png', optimize=True)


def main():
    area_rect('rt_bw', '3', 'x + 6')
    area_rect('rt_b1', '2', 'x + 7')
    area_rect('rt_b3', '5', 'x + 1')
    area_rect('rt_b4', '3', 'x + 4', both=True)
    area_rect('rt_b5', '2', 'x + 3')
    area_rect('rt_sw', '5', 'x − 3')
    area_rect('rt_s7', '4', 'x − 2')
    area_rect('rt_s9', '4', '2x − 1', both=True)
    area_rect('rt_s11', '4', 'x + 1')
    area_rect('rt_s13', '3', 'x + 4', both=True)
    area_rect('rt_gw', 'x', 'x + 4')
    area_rect('rt_g14', 'x', 'x + 7')
    area_rect('rt_g15', '2x', '3x − 1')
    area_rect('rt_g18', 'x', 'x + 5', both=True)

    # the split rectangle (Q12): 4 high, the length split into x and 5
    def split(d):
        d.line([(300 * S, 95 * S), (300 * S, 245 * S)], fill=sh.NAVY, width=4 * S)
    sh.draw('split_s12', R, ['', '', '', '4'], extra=split)
    # redraw the two top labels over the split (x over the left piece, 5 over the right piece)
    from PIL import Image, ImageDraw
    im = Image.open(sh.OUT / 'split_s12.png').convert('RGB'); d = ImageDraw.Draw(im)
    f = sh.ImageFont.truetype(sh.BOLD, 26)
    d.text((205, 62), 'x', font=f, fill=sh.BLUE, anchor='mm'); d.text((355, 62), '5', font=f, fill=sh.BLUE, anchor='mm')
    im.save(sh.OUT / 'split_s12.png', optimize=True)

    # two garden beds side by side, one width (Silver Q10): x + 2 and x + 5 long, 3 wide
    def beds(d):
        d.line([(260 * S, 95 * S), (260 * S, 245 * S)], fill=sh.NAVY, width=4 * S)
    sh.draw('beds_s10', R, ['', '', '', '3'], extra=beds)
    im = Image.open(sh.OUT / 'beds_s10.png').convert('RGB'); d = ImageDraw.Draw(im)
    d.text((185, 62), 'x + 2', font=f, fill=sh.BLUE, anchor='mm'); d.text((335, 62), 'x + 5', font=f, fill=sh.BLUE, anchor='mm')
    d.text((185, 170), 'Bed A', font=sh.ImageFont.truetype(sh.BOLD, 22), fill=sh.SOFT, anchor='mm')
    d.text((335, 170), 'Bed B', font=sh.ImageFont.truetype(sh.BOLD, 22), fill=sh.SOFT, anchor='mm')
    im.save(sh.OUT / 'beds_s10.png', optimize=True)
    crop_all(['rt_bw', 'rt_b1', 'rt_b3', 'rt_b4', 'rt_b5', 'rt_sw', 'rt_s7', 'rt_s9', 'rt_s11', 'rt_s13', 'rt_gw', 'rt_g14', 'rt_g15', 'rt_g18', 'split_s12', 'beds_s10'])


if __name__ == '__main__':
    main()
