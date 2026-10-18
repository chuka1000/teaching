#!/usr/bin/env python3
"""
The lowest 50 km of the atmosphere, labelled (Y9 Science, Human Actions and the Atmosphere, 'Upper Air' palette). PIL, drawn at 3x and downscaled.

  assets/pictures/atm-layers.png   1000 x 760, tint background.  A vertical height axis (0 to 50 km, ticks every 10), the troposphere (0 to about 12 km)
                                   under the stratosphere (about 12 to 50 km), the ozone layer as a violet band at about 15 to 35 km, an aeroplane at
                                   10 km and a mountain and a small city at the bottom for scale.  Ultraviolet light from the sun stops at the top of the
                                   ozone layer.  Every piece of text is 30 px or bigger on the 1000 px width.

The one idea it carries: smog and acid rain are LOW down (the troposphere); ozone depletion is HIGH up (the stratosphere).
Heights are to scale on the axis (12 px a kilometre), so the whole of the weather is only a thin layer at the bottom.

    python3 build/media/atmosphere-layers-picture.py
"""
import math, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from atmosphere_draw import *

PW, PH = 1000, 760
AX = 112                                       # the height axis
Y0, KM = 640, 12.0                             # y of the ground, pixels per kilometre
X0, X1 = 124, 984                              # the plot's left and right edges


def y_of(km): return Y0 - km * KM


def plane(c: Ctx, cx, cy, s=1.0):
    """A side view of an airliner, nose to the right, centred on (cx, cy)."""
    col, edge = DARK_SOFT, DARK
    def P(x, y): return (cx + x * s, cy + y * s)
    c.poly([P(-58, -4), P(-70, -30), P(-56, -30), P(-30, -5)], fill=col, outline=edge, width=2)                        # the tail fin
    c.rrect(*P(-62, -12), *P(62, 12), 12 * s, fill=col, outline=edge, width=2.4)                                      # the fuselage
    c.poly([P(52, -12), P(66, -4), P(66, 4), P(52, 12)], fill=col)                                                    # the nose
    c.poly([P(-6, 6), P(-36, 30), P(-22, 30), P(18, 6)], fill=col, outline=edge, width=2)                            # the wing
    c.rrect(*P(-16, 12), *P(8, 22), 5 * s, fill=edge)                                                                 # an engine
    for i in range(7): c.circle(*P(-34 + i * 11, -3), 2.2 * s, fill=ACCENT)                                           # the windows


def mountain(c: Ctx, cx, base_y, h, w):
    """A snow-capped mountain: h pixels high, w wide at the base."""
    peak = (cx, base_y - h)
    c.poly([(cx - w / 2, base_y), peak, (cx + w / 2, base_y)], fill='7C8794', outline='4A5563', width=2.4)
    c.poly([peak, (cx + w / 2, base_y), (cx + 6, base_y)], fill='666F7C')
    cap = h * 0.22
    c.poly([peak, (cx - w / 2 * 0.22, base_y - h + cap), (cx - 6, base_y - h + cap * 0.7), (cx + 12, base_y - h + cap * 0.95), (cx + w / 2 * 0.2, base_y - h + cap)], fill=WHITE)


def city(c: Ctx, x0, base_y):
    for dx, w, h in ((0, 14, 12), (16, 12, 20), (30, 16, 15), (48, 12, 26), (62, 14, 10), (78, 12, 17)):
        c.rrect(x0 + dx, base_y - h, x0 + dx + w, base_y, 1.5, fill=INK_SOFT, outline=INK, width=1.6)
        for k in range(int(h // 7)): c.rrect(x0 + dx + 3, base_y - h + 3 + k * 7, x0 + dx + w - 3, base_y - h + 6 + k * 7, 0.6, fill=ACCENT)


def build():
    im = Image.new('RGBA', (PW * SS, PH * SS), rgba(TINT))
    c = Ctx(im)
    # --- the layers
    y12, y15, y35, y50 = y_of(12), y_of(15), y_of(35), y_of(50)
    vgrad(c, X0, y50, X1, y12, mix(TINT_DEEP, ACCENT, 0.35), mix(ACCENT, WHITE, 0.62))                        # the stratosphere: a deeper blue the higher it is
    vgrad(c, X0, y12, X1, Y0, mix(ACCENT, WHITE, 0.45), mix(ACCENT, WHITE, 0.82))                             # the troposphere: the air we live in
    c.rrect(X0, y35, X1, y15, 0, fill=mix(OZONE, WHITE, 0.58))                                                # the ozone layer
    c.line((X0, y35), (X1, y35), mix(OZONE, WHITE, 0.15), 3)
    c.line((X0, y15), (X1, y15), mix(OZONE, WHITE, 0.15), 3)
    for yy in (y12,):                                                                                         # the boundary between the two layers (dashed)
        x = X0
        while x < X1: c.line((x, yy), (min(x + 18, X1), yy), INK, 3); x += 30
    c.d.rectangle([X0 * SS, Y0 * SS, X1 * SS, (Y0 + 22) * SS], fill=rgba('7A5A3C'))                          # the ground
    c.d.rectangle([X0 * SS, Y0 * SS, X1 * SS, (Y0 + 5) * SS], fill=rgba(SUPPORT))
    c.rrect(X0, y50, X1, Y0 + 22, 0, outline=INK, width=2.6)
    # --- the height axis
    c.line((AX, Y0 + 22), (AX, y50 - 4), INK, 4)
    c.arrow_head((AX, y50 - 14), 0, -1, INK, 16)
    for km in range(0, 51, 10):
        y = y_of(km)
        c.line((AX - 10, y), (AX + 10, y), INK, 3.4)
        c.text(AX - 16, y, str(km), 30, INK, 'rm')
    c.text(AX - 16, y50 - 26, 'km', 30, INK, 'rm')
    # --- the sun and its ultraviolet light, which stops at the top of the ozone layer
    sx, sy = 912, 78
    for i in range(14):
        a = 2 * math.pi * i / 14
        c.line((sx + 40 * math.cos(a), sy + 40 * math.sin(a)), (sx + 54 * math.cos(a), sy + 54 * math.sin(a)), 'E0A100', 4.5, caps=True)
    c.circle(sx, sy, 32, fill=SUN, outline='B07D00', width=3)
    for x0 in (850, 770, 690):
        wavy_arrow(c, (x0 + 30, 126), (x0 - 20, y35 - 4), '2E4FD1', 4.2, 4.5, 22, phase=0.4, head=14)
    chip(c, 560, 150, 'UV light', 30)
    # --- names and labels, placed on the diagram
    c.text(X0 + 20, y50 + 36, 'stratosphere', 34, INK, 'lm')
    c.text(X0 + 20, (y15 + y35) / 2 - 36, 'ozone layer:', 32, OZONE_INK, 'lm')
    c.text(X0 + 20, (y15 + y35) / 2, 'absorbs ultraviolet light', 32, OZONE_INK, 'lm')
    c.text(X0 + 20, (y15 + y35) / 2 + 36, 'about 15 to 35 km up', 30, OZONE_INK, 'lm')
    c.text(X0 + 20, y12 - 18, 'about 12 km', 30, INK, 'lm')                                                 # the top of the troposphere
    c.text(X0 + 326, y12 + 26, 'troposphere', 34, ACCENT_INK, 'lm')
    c.text(X0 + 326, y12 + 68, 'weather, air pollution,', 30, INK, 'lm')
    c.text(X0 + 326, y12 + 104, 'ground-level ozone', 30, INK, 'lm')
    # --- for scale
    mountain(c, X0 + 140, Y0, 8.8 * KM, 230)                                                                  # Mount Everest is 8.8 km high
    city(c, X0 + 268, Y0)
    plane(c, 872, y_of(10), 0.88)                                                                             # an airliner cruises at about 10 km
    # --- the take-home message
    c.rrect(24, 676, PW - 24, 750, 18, fill=DARK)
    c.text(PW / 2, 696, 'Smog and acid rain: low down.', 30, WHITE, 'mm')
    c.text(PW / 2, 732, 'Ozone depletion: high up.', 30, WHITE, 'mm')
    return im


def main():
    OUT_PICS.mkdir(parents=True, exist_ok=True)
    im = build().convert('RGB').resize((PW, PH), Image.LANCZOS)
    out = OUT_PICS / 'atm-layers.png'
    im.save(out)
    print(out, im.size)


if __name__ == '__main__':
    main()
