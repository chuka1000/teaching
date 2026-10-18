#!/usr/bin/env python3
"""
Shared drawing code for the Human Actions and the Atmosphere media (Y9 Science, 'Upper Air' palette):
build/media/the-ozone-layer-media.py, a-warming-planet-media.py and atmosphere-layers-picture.py all import this.

Everything is drawn at 3x (SS) and downscaled with LANCZOS, and a frame is a pure function of the time, so the film is the same on every run.
Primitives take a Ctx (an RGBA image plus an offset in 1x units), so a translucent group can be drawn on a small sprite and fading it in
one go (Frame.g(bbox, alpha)).  Text is DejaVu Sans Bold (it has the subscripts O₂ O₃ CH₄ CO₂ and the square km²).
"""
import math, os, pathlib, subprocess, sys, tempfile
from functools import lru_cache
from multiprocessing import get_context
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT_MEDIA = ROOT / 'assets' / 'media'
OUT_PICS = ROOT / 'assets' / 'pictures'
FPS, W, H, SS = 20, 960, 540, 3
FONT_B = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'

# 'Upper Air' palette, plus the atom colours
DARK, ACCENT, ACCENT_INK, SUPPORT, ALERT, TINT = '10213D', '8FD3E8', '1B6584', '23805F', 'C2432E', 'F2F7FA'
DARK_SOFT, TINT_DEEP, INK, INK_SOFT, WHITE = '2A4A73', 'DCE9F1', '14263D', '55708A', 'FFFFFF'
SUN, OZONE, CHLORINE, IR_RED = 'F6C445', '7B5EA7', '3FA34D', 'E0533D'
OZONE_INK = '4A3578'                                   # the violet darkened so it reads as text on a light ground


# ------------------------------------------------------------------------------------------------ small maths
def clamp(x, a=0.0, b=1.0): return max(a, min(b, x))
def ease(u): u = clamp(u); return u * u * (3 - 2 * u)
def lerp(a, b, u): return a + (b - a) * u
def lerp2(p, q, u): return (p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u)
def rgb3(h): return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))
def mix(h1, h2, u): return ''.join('%02X' % round(lerp(int(h1[i:i + 2], 16), int(h2[i:i + 2], 16), clamp(u))) for i in (0, 2, 4))
def rgba(h, a=255): r, g, b = rgb3(h); return (r, g, b, a)
def rot(p, ang): c, s = math.cos(ang), math.sin(ang); return (p[0] * c - p[1] * s, p[0] * s + p[1] * c)
def add(p, q): return (p[0] + q[0], p[1] + q[1])
def dist(p, q): return math.hypot(p[0] - q[0], p[1] - q[1])


@lru_cache(maxsize=None)
def F(size): return ImageFont.truetype(FONT_B, int(round(size * SS)))

SUB = {'₂': '2', '₃': '3', '₄': '4'}          # DejaVu's own subscripts are small: they are redrawn as bigger digits, set a little lower
SUB_K, SUB_DROP = 0.74, 0.17


def runs(s):
    """Split a string into (text, is_subscript) runs."""
    out, cur, sub = [], '', False
    for ch in s:
        is_sub = ch in SUB
        if is_sub != sub and cur: out.append((cur, sub)); cur = ''
        sub = is_sub
        cur += SUB.get(ch, ch)
    if cur: out.append((cur, sub))
    return out


def text_w(s, size):
    return sum(F(size * SUB_K if sub else size).getlength(txt) for txt, sub in runs(s)) / SS


# ------------------------------------------------------------------------------------------------ drawing context
class Ctx:
    """An RGBA image at SS x, whose top-left is (ox, oy) in 1x units. Every primitive takes 1x coordinates."""

    def __init__(self, img, ox=0.0, oy=0.0):
        self.img, self.d, self.ox, self.oy = img, ImageDraw.Draw(img), ox, oy

    def pt(self, p): return ((p[0] - self.ox) * SS, (p[1] - self.oy) * SS)

    def circle(self, x, y, r, fill=None, outline=None, width=0):
        cx, cy = self.pt((x, y)); R = r * SS
        self.d.ellipse([cx - R, cy - R, cx + R, cy + R], fill=rgba(fill) if fill else None,
                       outline=rgba(outline) if outline else None, width=int(round(width * SS)))

    def line(self, p, q, col, w, caps=False):
        a, b = self.pt(p), self.pt(q)
        self.d.line([a, b], fill=rgba(col), width=max(1, int(round(w * SS))))
        if caps:
            for c in (a, b): self.d.ellipse([c[0] - w * SS / 2, c[1] - w * SS / 2, c[0] + w * SS / 2, c[1] + w * SS / 2], fill=rgba(col))

    def poly(self, pts, fill=None, outline=None, width=0):
        P = [self.pt(p) for p in pts]
        if fill: self.d.polygon(P, fill=rgba(fill))
        if outline: self.d.line(P + [P[0]], fill=rgba(outline), width=int(round(width * SS)), joint='curve')

    def path(self, pts, col, w):
        self.d.line([self.pt(p) for p in pts], fill=rgba(col), width=max(1, int(round(w * SS))), joint='curve')

    def rrect(self, x0, y0, x1, y1, r, fill=None, outline=None, width=0):
        a, b = self.pt((x0, y0)), self.pt((x1, y1))
        self.d.rounded_rectangle([a[0], a[1], b[0], b[1]], radius=r * SS, fill=rgba(fill) if fill else None,
                                 outline=rgba(outline) if outline else None, width=int(round(width * SS)))

    def text(self, x, y, s, size, col, anchor='la'):
        if not any(ch in SUB for ch in s):
            self.d.text(self.pt((x, y)), s, font=F(size), fill=rgba(col), anchor=anchor)
            return
        X, Y = self.pt((x, y))
        w = text_w(s, size) * SS
        X -= {'l': 0, 'm': w / 2, 'r': w}[anchor[0]]
        asc, desc = F(size).getmetrics()
        Y += {'a': asc, 'm': (asc - desc) / 2, 's': 0}[anchor[1]]                   # Y is now the baseline
        for txt, sub in runs(s):
            f = F(size * SUB_K if sub else size)
            self.d.text((X, Y + (size * SUB_DROP * SS if sub else 0)), txt, font=f, fill=rgba(col), anchor='ls')
            X += f.getlength(txt)

    def arrow_head(self, tip, ux, uy, col, size, outline=None, ow=0):
        nx, ny = -uy, ux
        pts = [tip, (tip[0] - ux * size + nx * size * 0.55, tip[1] - uy * size + ny * size * 0.55),
               (tip[0] - ux * size - nx * size * 0.55, tip[1] - uy * size - ny * size * 0.55)]
        self.poly(pts, fill=col, outline=outline, width=ow)


class Group:
    """A translucent group: draw on a sprite covering bbox, composite it at the end with the given alpha.
    At alpha 1 it draws straight on the frame; at alpha 0 nothing is drawn."""

    def __init__(self, fr, bbox, alpha):
        self.fr, self.alpha = fr, alpha
        x0, y0, x1, y1 = bbox
        self.box = (max(0, int(math.floor(x0))), max(0, int(math.floor(y0))), min(W, int(math.ceil(x1))), min(H, int(math.ceil(y1))))

    def __enter__(self):
        x0, y0, x1, y1 = self.box
        self.mode = 'direct' if self.alpha >= 0.999 else 'skip' if (self.alpha <= 0.004 or x1 <= x0 or y1 <= y0) else 'sprite'
        if self.mode == 'direct': return self.fr.main
        if self.mode == 'skip': return Ctx(Image.new('RGBA', (2, 2), (0, 0, 0, 0)), x0, y0)
        self.sp = Image.new('RGBA', ((x1 - x0) * SS, (y1 - y0) * SS), (0, 0, 0, 0))
        return Ctx(self.sp, x0, y0)

    def __exit__(self, *exc):
        if self.mode != 'sprite': return
        lut = [int(v * self.alpha) for v in range(256)]
        self.sp.putalpha(self.sp.getchannel('A').point(lut))
        self.fr.img.alpha_composite(self.sp, (self.box[0] * SS, self.box[1] * SS))


class Frame:
    def __init__(self, base):
        self.img = base.copy()
        self.main = Ctx(self.img)

    def g(self, bbox, alpha=1.0): return Group(self, bbox, alpha)

    def done(self): return self.img.convert('RGB').resize((W, H), Image.LANCZOS)


def blank(bg=TINT):
    return Image.new('RGBA', (W * SS, H * SS), rgba(bg))


def vgrad(c: Ctx, x0, y0, x1, y1, top, bottom):
    """A vertical gradient rectangle, pasted straight on the context's image."""
    w, h = int(round((x1 - x0) * SS)), int(round((y1 - y0) * SS))
    t = np.linspace(0, 1, h)[:, None, None]
    a, b = np.array(rgb3(top), float)[None, None, :], np.array(rgb3(bottom), float)[None, None, :]
    arr = (a + (b - a) * t).repeat(w, axis=1).astype(np.uint8)
    im = Image.fromarray(arr, 'RGB').convert('RGBA')
    c.img.paste(im, (int(round((x0 - c.ox) * SS)), int(round((y0 - c.oy) * SS))))


def rounded_mask(box, r):
    m = Image.new('L', (W * SS, H * SS), 0)
    ImageDraw.Draw(m).rounded_rectangle([box[0] * SS, box[1] * SS, box[2] * SS, box[3] * SS], radius=r * SS, fill=255)
    return m


# ------------------------------------------------------------------------------------------------ shapes shared by the films
def chip(c: Ctx, cx, cy, s, size=26, col=INK, fill=WHITE, border=INK, pad=13, alpha_unused=None):
    """A label chip (white, ink border) centred on (cx, cy). Returns (width, height)."""
    w, h = text_w(s, size) + 2 * pad, size * 1.5
    c.rrect(cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2, 11, fill=fill, outline=border, width=2.4)
    c.text(cx, cy + 1, s, size, col, 'mm')
    return w, h


def chip_size(s, size=26, pad=13): return text_w(s, size) + 2 * pad, size * 1.5


def straight_arrow(c: Ctx, p0, p1, col, w, head, u=1.0, outline=None, ow=2.5):
    """A straight arrow from p0 towards p1, drawn up to the fraction u of its length (the head rides the tip)."""
    L = dist(p0, p1)
    if L < 1 or u <= 0: return
    ux, uy = (p1[0] - p0[0]) / L, (p1[1] - p0[1]) / L
    Lc = L * clamp(u)
    tip = (p0[0] + ux * Lc, p0[1] + uy * Lc)
    base = (tip[0] - ux * head * 0.8, tip[1] - uy * head * 0.8) if Lc > head else p0
    if outline: c.line(p0, base, outline, w + 2 * ow * 0.5, caps=True)
    c.line(p0, base, col, w, caps=True)
    if Lc > head * 0.9: c.arrow_head(tip, ux, uy, col, head, outline=outline, ow=ow * 0.7 if outline else 0)


def wavy_arrow(c: Ctx, p0, p1, col, w, amp, wl, phase=0.0, head=14, u=1.0):
    """A wavy arrow (a sine wave along p0 -> p1) drawn up to the fraction u; the wave dies away at both ends so the head sits on the line."""
    L = dist(p0, p1)
    if L < 1 or u <= 0: return
    ux, uy = (p1[0] - p0[0]) / L, (p1[1] - p0[1]) / L
    nx, ny = -uy, ux
    Lc = L * clamp(u)
    n = max(8, int(Lc / 1.5))
    pts = []
    for i in range(n + 1):
        s = Lc * i / n
        env = min(1.0, s / (wl * 0.6)) * min(1.0, max(0.0, (Lc - s)) / (wl * 0.9))
        off = amp * env * math.sin(2 * math.pi * s / wl + phase)
        pts.append((p0[0] + ux * s + nx * off, p0[1] + uy * s + ny * off))
    c.path(pts, col, w)
    c.arrow_head((p0[0] + ux * Lc, p0[1] + uy * Lc), ux, uy, col, head)


def ring_pulse(c: Ctx, x, y, r0, r1, u, col, w=3.5):
    """An expanding ring that fades (the caller fades it with a group)."""
    r = lerp(r0, r1, ease(u))
    c.circle(x, y, r, outline=col, width=w)


def wrap_lines(s, size, maxw):
    """Fit s into lines no wider than maxw; when two lines are needed, split them as evenly as possible (no one-word second line)."""
    if text_w(s, size) <= maxw: return [s]
    words = s.split()
    best = None
    for i in range(1, len(words)):
        a, b = ' '.join(words[:i]), ' '.join(words[i:])
        m = max(text_w(a, size), text_w(b, size))
        if best is None or m < best[0]: best = (m, [a, b])
    if best and best[0] <= maxw: return best[1]
    lines, cur = [], ''                                                       # three or more lines: plain greedy
    for wd in words:
        t = (cur + ' ' + wd).strip()
        if text_w(t, size) <= maxw or not cur: cur = t
        else: lines.append(cur); cur = wd
    lines.append(cur)
    return lines


def caption(fr: Frame, items, t, badge=True, size=32, x=104, maxw=820, col=INK, ymid=488, stop=None):
    """The caption band at the foot of the frame. items = [(t0, number, text), ...]. The caption of a step appears when the step starts
    (0.35 s fade); the one before it fades out. Returns the lines used (for checks)."""
    idx = max([i for i, it in enumerate(items) if t >= it[0]] or [0])
    t0, num, s = items[idx]
    a = ease((t - t0) / 0.35) * (1 - ease((t - stop) / 0.3) if stop is not None else 1.0)
    prev = items[idx - 1] if idx > 0 else None
    out = []

    def one(it, alpha):
        _, n, txt = it
        lines = wrap_lines(txt, size, maxw)
        assert len(lines) <= 2, ('caption too long', txt)
        for ln in lines: assert text_w(ln, size) <= maxw + 1, ('caption line too wide', ln)
        ys = [ymid] if len(lines) == 1 else [ymid - 21, ymid + 21]
        with fr.g((10, ymid - 50, W - 10, ymid + 50), alpha) as c:
            if badge:
                c.circle(52, ymid, 25, fill=INK)
                c.text(52, ymid + 1, str(n), 32, WHITE, 'mm')
            for ln, y in zip(lines, ys): c.text(x if badge else 40, y, ln, size, col, 'lm')
        out.append(lines)

    if prev is not None and t - t0 < 0.25: one(prev, (1 - (t - t0) / 0.25) * (1 - ease((t - stop) / 0.3) if stop is not None else 1.0))
    one(items[idx], a)
    return out


# ------------------------------------------------------------------------------------------------ encoding
_FN, _TMP = None, None


def _work(i):
    _FN(i / FPS).save(_TMP / ('%04d.png' % i))
    return i


def render_film(frame_fn, total, name, cover_t, pool=4, out_dir=None):
    """Render every frame (in parallel), encode with ffmpeg (H.264, yuv420p, crf 26, veryslow), write the cover PNG next to it."""
    global _FN, _TMP
    out_dir = out_dir or OUT_MEDIA
    out_dir.mkdir(parents=True, exist_ok=True)
    _TMP = pathlib.Path(os.environ.get('ANIM_TMP') or tempfile.mkdtemp())
    _TMP.mkdir(parents=True, exist_ok=True)
    _FN = frame_fn
    n = int(round(total * FPS))
    with get_context('fork').Pool(pool) as p:
        for k, _ in enumerate(p.imap_unordered(_work, range(n), chunksize=8)):
            if k % 100 == 0: print('frame', k, 'of', n, flush=True)
    out = out_dir / (name + '.mp4')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', str(_TMP / '%04d.png'), '-c:v', 'libx264',
                    '-pix_fmt', 'yuv420p', '-crf', '26', '-preset', 'veryslow', '-movflags', '+faststart', '-an', str(out)], check=True)
    frame_fn(cover_t).save(out_dir / (name + '.png'))
    for f in _TMP.glob('*.png'): f.unlink()
    print('%s: %d frames, %.1f s, %d KB' % (out.name, n, n / FPS, out.stat().st_size // 1024))
    return out


def stills(frame_fn, times):
    """Write the frames at the given times (seconds) as PNGs into $ANIM_TMP (or a temp folder) and print where."""
    tmp = pathlib.Path(os.environ.get('ANIM_TMP') or tempfile.mkdtemp())
    tmp.mkdir(parents=True, exist_ok=True)
    for t in times: frame_fn(float(t)).save(tmp / ('still-%06.2f.png' % float(t)))
    print('stills in', tmp)
