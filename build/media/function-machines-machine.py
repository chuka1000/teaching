#!/usr/bin/env python3
"""
Function Machines: the I Do animations (8CN). Generated with PIL and encoded
with ffmpeg (CLAUDE.md, Media, preference 1). Silent, Number Revision colours.
They play ON CLICK (lib/animate.js, effect "play"), not on entering the slide,
and they PAUSE at every operation: the chip stops at a box, the box lights up,
the working ("6 × 4 = 24") is written under the machine, and the number changes.

  function-machines-forward.mp4    4n - 3:      x 4 then - 3.   Inputs 6, 2, 5.      960 x 470
  function-machines-bracket.mp4    4(n - 3):    - 3 then x 4.   Inputs 5, 9, 6.      960 x 470
  function-machines-backward.mp4   the SAME 4n - 3 on top, run forwards for 6 (6 to
                                   24 to 21); underneath, run BACKWARDS from 21 with
                                   the opposite boxes (+ 3 then / 4), the boxes lined
                                   up under the ones they undo, so it is obvious why
                                   each step is undone with its opposite.        960 x 950

    python3 build/media/function-machines-machine.py
"""
import pathlib, subprocess, shutil, tempfile
from PIL import Image, ImageDraw, ImageFont

OUT = pathlib.Path(__file__).resolve().parents[2] / 'assets' / 'media'
OUT.mkdir(parents=True, exist_ok=True)
FPS = 20
NAVY, CORAL, LAV, WHITE, SOFT, GREY = '#2B2350', '#EC6B58', '#F2F0F8', '#FFFFFF', '#5E5A70', '#CFCADF'
ARIAL = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
ARIAL_R = '/System/Library/Fonts/Supplemental/Arial.ttf'
F = lambda s, b=True: ImageFont.truetype(ARIAL if b else ARIAL_R, s)
f_title, f_sub, f_mid, f_chip, f_small, f_eq = F(64), F(28), F(44), F(42), F(28), F(42)

X_IN, X_B1, X_MID, X_B2, X_OUT = 90, 335, 460, 585, 850
BOX_W, BOX_H, CHIP_W, CHIP_H = 160, 130, 120, 72
SEG = [0.5, 0.9, 0.6, 0.9, 0.9, 0.6, 0.9, 0.8, 0.5]          # rest, move, at box 1 (before), (after), move, at box 2 (before), (after), move, rest
PER = sum(SEG)                                                # 6.6 s for one input

smooth = lambda t: (lambda t: t * t * (3 - 2 * t))(max(0.0, min(1.0, t)))
def centre(d, xy, text, font, fill): d.text(xy, text, font=font, fill=fill, anchor='mm')
def arrow(d, x0, x1, y, col=CORAL):
    d.line((x0, y, x1 - 16, y), fill=col, width=6)
    d.polygon([(x1, y), (x1 - 20, y - 12), (x1 - 20, y + 12)], fill=col)

SYM = {'mul': '×', 'add': '+', 'sub': '−', 'div': '÷'}
def ap(op, v, x): return {'mul': x * v, 'add': x + v, 'sub': x - v, 'div': x // v}[op]
def eq_text(op, v, x): return f'{x} {SYM[op]} {v} = {ap(op, v, x)}'

def chip(d, x, y, v):
    d.rounded_rectangle((x - CHIP_W // 2, y - CHIP_H // 2, x + CHIP_W // 2, y + CHIP_H // 2), 16, fill=CORAL)
    centre(d, (x, y), str(v), f_chip, NAVY)

def box(d, x, y, label, lit):
    d.rounded_rectangle((x - BOX_W // 2, y - BOX_H // 2, x + BOX_W // 2, y + BOX_H // 2), 18, fill=NAVY, outline=CORAL if lit else NAVY, width=8 if lit else 0)
    centre(d, (x, y), label, f_mid, WHITE)

def station(d, x, y, v):
    d.rounded_rectangle((x - 44, y - 28, x + 44, y + 28), 12, fill=WHITE, outline=CORAL, width=3)
    centre(d, (x, y), str(v), F(34), NAVY)

def phase(t, dur):
    """Which segment of a run lasting PER, and how far through it, for time t within it."""
    edge = 0.0
    for i, s in enumerate(SEG):
        if t < edge + s: return i, (t - edge) / s
        edge += s
    return len(SEG) - 1, 1.0

def run_state(t, xs, values, ops):
    """Position, shown value, lit box (0/1/None) and caption index for a run along boxes at xs (start, box1, box2, end)."""
    i, u = phase(t, PER)
    x0, xb1, xb2, x1 = xs
    v0, v1, v2 = values
    if i == 0: return x0, v0, None, None
    if i == 1: return x0 + (xb1 - x0) * smooth(u), v0, None, None
    if i == 2: return xb1, v0, 0, None
    if i == 3: return xb1, v1, 0, 0
    if i == 4: return xb1 + (xb2 - xb1) * smooth(u), v1, None, 0
    if i == 5: return xb2, v1, 1, 0
    if i == 6: return xb2, v2, 1, 1
    if i == 7: return xb2 + (x1 - xb2) * smooth(u), v2, None, 1
    return x1, v2, None, 1

# ------------------------------------------------------------- a single forward machine
def draw_machine(d, y, title, sub):
    d.text((48, y - 197), title, font=f_title, fill=NAVY)
    d.text((52, y - 123), sub, font=f_sub, fill=SOFT)
    d.rounded_rectangle((40, y - 6, 920, y + 6), 6, fill=GREY)
    d.text((X_IN, y + 92), 'in', font=f_small, fill=SOFT, anchor='mm'); d.text((X_OUT, y + 92), 'out', font=f_small, fill=SOFT, anchor='mm')

def forward_frame(t, ops, inputs, title, sub, size=(960, 470)):
    W, H = size
    im = Image.new('RGB', size, LAV); d = ImageDraw.Draw(im)
    Y = 215
    labels = [f'{SYM[o]} {v}' for o, v in ops]
    draw_machine(d, Y, title, sub)
    idx = min(int(t // PER), len(inputs) - 1); tt = t - idx * PER
    n = inputs[idx]; r1 = ap(ops[0][0], ops[0][1], n); r2 = ap(ops[1][0], ops[1][1], r1)
    x, v, lit, cap = run_state(min(tt, PER - 0.001), (X_IN, X_B1, X_B2, X_OUT), (n, r1, r2), ops)
    for k, xx in enumerate((X_B1, X_B2)): box(d, xx, Y, labels[k], lit == k)
    d.text((X_B1, Y + 92), 'first', font=f_small, fill=SOFT, anchor='mm'); d.text((X_B2, Y + 92), 'then', font=f_small, fill=SOFT, anchor='mm')
    if cap is not None: centre(d, (W // 2, 348), eq_text(ops[cap][0], ops[cap][1], (n, r1)[cap]), f_eq, NAVY)
    wbox = 290
    for i2, nn in enumerate(inputs):
        x0 = 40 + i2 * (wbox + 5)
        done = (i2 < idx) or (i2 == idx and tt >= PER - 0.5)
        out = ap(ops[1][0], ops[1][1], ap(ops[0][0], ops[0][1], nn))
        if done:
            d.rounded_rectangle((x0, 392, x0 + wbox, 460), 14, fill=WHITE, outline=CORAL, width=3)
            centre(d, (x0 + 70, 426), str(nn), f_mid, NAVY); arrow(d, x0 + 116, x0 + 176, 426)
            centre(d, (x0 + 230, 426), str(out), f_mid, NAVY)
        else:
            d.rounded_rectangle((x0, 392, x0 + wbox, 460), 14, outline=GREY, width=3)
    chip(d, x, Y, v)
    return im

# ------------------------------------------------------------- forward and backward, stacked
def backward_frame(t, size=(960, 950)):
    W, H = size
    im = Image.new('RGB', size, LAV); d = ImageDraw.Draw(im)
    ops = [('mul', 4), ('sub', 3)]; n = 6; r1 = 24; r2 = 21
    YT, YB = 215, 705
    # ---- top: the same 4n - 3 as the previous slide
    draw_machine(d, YT, '4n − 3', 'multiply by 4, then subtract 3')
    d.line((40, 478, 920, 478), fill=GREY, width=4)
    # ---- bottom: backwards, the boxes lined up under the ones they undo
    draw_machine(d, YB, 'Now backwards', 'undo the last step first, with the opposite')
    tf = min(t, PER); fwd_done = t >= PER
    xf, vf, litf, capf = run_state(min(tf, PER - 0.001), (X_IN, X_B1, X_B2, X_OUT), (n, r1, r2), ops)
    back_started = t >= PER + 0.8
    tb = max(0.0, t - PER - 0.8)
    # the back run: the chip starts at OUT (21), meets '+ 3' first (under '− 3'), then '÷ 4' (under '× 4'), ends at IN
    xb, vb, litb, capb = run_state(min(tb, PER - 0.001), (X_OUT, X_B2, X_B1, X_IN), (r2, r1, n), None)
    for k, xx in enumerate((X_B1, X_B2)): box(d, xx, YT, ['× 4', '− 3'][k], (litf if not fwd_done else None) == k)
    d.text((X_B1, YT + 92), 'first', font=f_small, fill=SOFT, anchor='mm'); d.text((X_B2, YT + 92), 'then', font=f_small, fill=SOFT, anchor='mm')
    lit_b = ({0: 1, 1: 0}[litb] if (back_started and litb is not None) else None)     # litb 0 = first box met (at X_B2)
    for k, xx in enumerate((X_B1, X_B2)): box(d, xx, YB, ['÷ 4', '+ 3'][k], lit_b == k)
    d.text((X_B2, YB + 92), 'first', font=f_small, fill=SOFT, anchor='mm'); d.text((X_B1, YB + 92), 'then', font=f_small, fill=SOFT, anchor='mm')
    d.text((X_B1, YB + 124), 'undoes × 4', font=f_small, fill=SOFT, anchor='mm'); d.text((X_B2, YB + 124), 'undoes − 3', font=f_small, fill=SOFT, anchor='mm')
    # the working, written at each pause
    if not fwd_done and capf is not None: centre(d, (W // 2, YT + 133), eq_text(*ops[capf], (n, r1)[capf]), f_eq, NAVY)
    if back_started and capb is not None: centre(d, (W // 2, YB + 175), ['21 + 3 = 24', '24 ÷ 4 = 6'][capb], f_eq, NAVY)
    # the values seen on the way, lined up above the two tracks so the two runs can be compared
    def stations(y, seen):
        for (xx, v), sn in zip(((X_IN, 6), (X_MID, 24), (X_OUT, 21)), seen):
            if sn: station(d, xx, y - 62, v)
    stations(YT, (t >= 0, t >= sum(SEG[:4]) - 0.01, t >= sum(SEG[:7]) - 0.01))
    stations(YB, (back_started and tb >= sum(SEG[:7]) - 0.01, back_started and tb >= sum(SEG[:4]) - 0.01, back_started))
    if not back_started: chip(d, xf, YT, vf)
    else: chip(d, xb, YB, vb)
    if t >= PER + 0.8 + PER + 0.4:
        centre(d, (W // 2, 925), 'Same numbers, reverse order, opposite steps.', F(30), SOFT)
    return im

def render(name, frame, total, size):
    n = int(total * FPS)
    tmp = pathlib.Path(tempfile.mkdtemp())
    for i in range(n): frame(i / FPS).save(tmp / f'{i:04d}.png')
    out = OUT / f'{name}.mp4'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', str(tmp / '%04d.png'),
                    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '26', '-preset', 'veryslow', str(out)], check=True)
    frame(0.2).save(OUT / f'{name}.png')                         # the cover: the machine waiting for a click
    shutil.rmtree(tmp)
    print(f'{out.name}: {n} frames, {total:.1f} s, {out.stat().st_size // 1024} KB')

A = [('mul', 4), ('sub', 3)]; B = [('sub', 3), ('mul', 4)]
assert [ap(A[1][0], A[1][1], ap(A[0][0], A[0][1], x)) for x in (6, 2, 5)] == [21, 5, 17]
assert [ap(B[1][0], B[1][1], ap(B[0][0], B[0][1], x)) for x in (5, 9, 6)] == [8, 24, 12]
HOLD = 2.0
render('function-machines-forward', lambda t: forward_frame(t, A, [6, 2, 5], '4n − 3', 'multiply by 4, then subtract 3'), 3 * PER + HOLD, (960, 470))
render('function-machines-bracket', lambda t: forward_frame(t, B, [5, 9, 6], '4(n − 3)', 'subtract 3, then multiply by 4'), 3 * PER + HOLD, (960, 470))
render('function-machines-backward', backward_frame, 2 * PER + 0.8 + 0.4 + 3.0, (960, 950))
