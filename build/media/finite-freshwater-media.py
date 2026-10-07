#!/usr/bin/env python3
"""
Finite Freshwater: the I Do 1 waffle chart and the I Do 2 animation (9G and 9I). PIL + ffmpeg, silent, 'catchment' palette.

  ff-waffle-*.png     I Do 1.  100 squares = every 100 litres of fresh water that people take: 70 farming, 20 industry, 10 homes.
                      A base grid and three transparent layers (one per use), same size, so each can be revealed on its own click.
  ff-aquifer.mp4/png  I Do 2.  A MODEL aquifer, 960 x 540, about 28 s, PLAYS ON CLICK. It holds 1,000 billion litres. Rain recharges it at
                      10 a year, wells pump out 50 a year. Net loss 50 - 10 = 40 a year, so it is empty in 1,000 / 40 = 25 years. Then:
                      if the pumping stopped, refilling at 10 a year would take 1,000 / 10 = 100 years. It PAUSES at every step.

    python3 build/media/finite-freshwater-media.py
"""
import pathlib, shutil, subprocess, tempfile
from PIL import Image, ImageDraw, ImageFont

OUT = pathlib.Path(__file__).resolve().parents[2] / 'assets' / 'media'
OUT.mkdir(parents=True, exist_ok=True)
FPS = 20
DARK, AQUA, AQUA_INK, GREEN, ROSE, MIST, WHITE = '#0A3550', '#4CC9FA', '#0369A1', '#2E9E5B', '#C23A52', '#EEF7FB', '#FFFFFF'
ORANGE = '#D9822B'
ARIAL = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
F = lambda s: ImageFont.truetype(ARIAL, s)
centre = lambda d, xy, t, f, c: d.text(xy, t, font=f, fill=c, anchor='mm')

# ---------------------------------------------------------------- I Do 1: the waffle
USES = [('agri', 70, GREEN), ('ind', 20, DARK), ('home', 10, AQUA)]
assert sum(n for _, n, _ in USES) == 100
SQ, GAP, N = 56, 6, 10
SIDE = N * SQ + (N - 1) * GAP
def square(d, i, fill, outline=None):
    r, c = divmod(i, N); x, y = c * (SQ + GAP), r * (SQ + GAP)
    d.rounded_rectangle((x, y, x + SQ, y + SQ), 8, fill=fill, outline=outline, width=3 if outline else 0)
base = Image.new('RGBA', (SIDE, SIDE), (0, 0, 0, 0)); d = ImageDraw.Draw(base)
for i in range(100): square(d, i, '#FFFFFF', '#B7D3E4')
base.save(OUT / 'ff-waffle-base.png')
start = 0
for name, n, col in USES:
    im = Image.new('RGBA', (SIDE, SIDE), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    for i in range(start, start + n): square(d, i, col)
    im.save(OUT / f'ff-waffle-{name}.png'); start += n

# ---------------------------------------------------------------- I Do 2: the model aquifer
STOCK, RECHARGE, PUMP = 1000, 10, 50
NET = PUMP - RECHARGE
YEARS_EMPTY, YEARS_REFILL = STOCK // NET, STOCK // RECHARGE
assert (NET, YEARS_EMPTY, YEARS_REFILL) == (40, 25, 100)
T_STORE, T_RAIN, T_PUMP, T_NET, T_TICK0, T_TICK1, T_REFILL, TOTAL = 3.0, 6.0, 9.0, 12.0, 14.0, 24.0, 26.0, 30.0
BOX = (40, 190, 620, 470)            # the aquifer rock
TOP_FULL, BOTTOM = 230, 470           # the water table when it is full, and the base
WELL_X, WELL_BOTTOM = 340, 440
def year(t):
    if t < T_TICK0: return 0.0
    if t >= T_TICK1: return float(YEARS_EMPTY)
    return YEARS_EMPTY * (t - T_TICK0) / (T_TICK1 - T_TICK0)
def left(y): return max(0, STOCK - NET * y)
def caption(t):
    if t < T_STORE: return 'A model aquifer, underground.'
    if t < T_RAIN: return 'It holds 1,000 billion litres.'
    if t < T_PUMP: return 'Rain soaks in: recharge 10 a year.'
    if t < T_NET: return 'Wells pump out 50 a year.'
    if t < T_TICK0: return 'Out 50, in 10: net loss 40 a year.'
    if t < T_TICK1: return 'The water table falls.'
    if t < T_REFILL: return 'Empty after 25 years.'
    return 'Refilling would take much longer.'
def arrow(d, x0, y0, x1, y1, col, w, head):
    d.line((x0, y0, x1, y1), fill=col, width=w)
    dx, dy = x1 - x0, y1 - y0; L = (dx * dx + dy * dy) ** .5; ux, uy = dx / L, dy / L; px, py = -uy, ux
    d.polygon([(x1 + ux * 2, y1 + uy * 2), (x1 - ux * head + px * head * .6, y1 - uy * head + py * head * .6), (x1 - ux * head - px * head * .6, y1 - uy * head - py * head * .6)], fill=col)
def frame(t):
    im = Image.new('RGB', (960, 540), MIST); d = ImageDraw.Draw(im)
    centre(d, (480, 36), caption(t), F(32), DARK)
    y = year(t); stock = left(y); f = stock / STOCK
    # ground, and the rock that holds the water
    d.rectangle((BOX[0], 150, BOX[2], BOX[1]), fill='#9C7B4F')
    d.rectangle(BOX, fill='#D9C6A0')
    if t >= T_STORE:
        top = BOTTOM - (BOTTOM - TOP_FULL) * f
        if f > 0: d.rectangle((BOX[0], top, BOX[2], BOTTOM), fill='#7CCBEF'); d.line((BOX[0], top, BOX[2], top), fill=AQUA_INK, width=4)
        centre(d, (BOX[0] + 100, min(top + 22, 448)), 'water table' if f > .12 else '', F(20), DARK)
    d.rectangle(BOX, outline=DARK, width=4)
    # the well and the pump
    d.rectangle((WELL_X - 9, 150, WELL_X + 9, WELL_BOTTOM), fill='#FFFFFF', outline=DARK, width=3)
    d.rectangle((WELL_X - 30, 112, WELL_X + 30, 150), fill=DARK); centre(d, (WELL_X, 131), 'pump', F(18), WHITE)
    if t >= T_STORE:
        top = BOTTOM - (BOTTOM - TOP_FULL) * f
        if f > 0 and top < WELL_BOTTOM - 4: d.rectangle((WELL_X - 6, max(top, 150), WELL_X + 6, WELL_BOTTOM - 3), fill='#7CCBEF')
    # rain and recharge (arrow width is to scale: 10 against 50)
    if t >= T_RAIN:
        d.ellipse((40, 70, 180, 118), fill='#B7D3E4'); d.ellipse((80, 52, 190, 112), fill='#B7D3E4')
        arrow(d, 90, 124, 90, 214, AQUA_INK, int(RECHARGE * .22) + 2, 22)
        d.text((112, 206), 'Recharge 10 a year', font=F(22), fill=AQUA_INK, anchor='lm')
    if t >= T_PUMP:
        arrow(d, WELL_X + 36, 131, WELL_X + 200, 131, ORANGE, int(PUMP * .22) + 2, 26)
        d.text((WELL_X + 56, 98), 'Pumped out 50 a year', font=F(22), fill=ORANGE, anchor='lm')
    # the readout
    d.rounded_rectangle((650, 90, 930, 470), 14, fill=WHITE, outline=DARK, width=3)
    centre(d, (790, 118), 'billion litres left', F(22), DARK)
    if t >= T_STORE:
        centre(d, (790, 190), f'{int(round(stock)):,}', F(64), DARK if f > 0 else ROSE)
        centre(d, (790, 262), f'Year {int(round(y))}', F(40), AQUA_INK)
        d.rectangle((690, 310, 890, 330), fill='#DDE8EF'); d.rectangle((690, 310, 690 + 200 * f, 330), fill=AQUA_INK)
    if t >= T_NET: centre(d, (790, 372), 'Net loss: 40 a year', F(26), ROSE)
    if t >= T_TICK1: centre(d, (790, 420), 'EMPTY', F(40), ROSE)
    if t >= T_NET and t < T_TICK1: centre(d, (790, 420), '1,000 ÷ 40 = 25 years', F(24), DARK)
    if t >= T_TICK1: centre(d, (480, 492), '1,000 ÷ 40 = 25 years to empty', F(28), DARK)
    if t >= T_REFILL: centre(d, (480, 522), 'Stop pumping: 1,000 ÷ 10 = 100 years to refill', F(25), AQUA_INK)
    return im
def render(name, total, fr):
    n = int(total * FPS)
    tmp = pathlib.Path(tempfile.mkdtemp())
    for i in range(n): fr(i / FPS).save(tmp / f'{i:04d}.png')
    out = OUT / f'{name}.mp4'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', str(tmp / '%04d.png'),
                    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '26', '-preset', 'veryslow', str(out)], check=True)
    fr(4.0).save(OUT / f'{name}.png')
    shutil.rmtree(tmp)
    print(f'{out.name}: {n} frames, {total:.1f} s, {out.stat().st_size // 1024} KB')
render('ff-aquifer', TOTAL, frame)
