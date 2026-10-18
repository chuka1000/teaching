#!/usr/bin/env python3
"""
Shared drawing kit for the Y9 Science 'Upper Air' media (Human Actions and the Atmosphere). PIL + ffmpeg, silent.

Used by build/media/what-gets-into-the-air-media.py (atm-smog) and build/media/what-it-does-to-us-media.py (atm-acid-rain,
atm-particles, atm-haemoglobin). Same approach as pathogens-and-antibiotics-media.py:
  - everything is drawn at 3x on a transparent sprite and the finished frame is downscaled with LANCZOS;
  - a frame is a pure function of the time t, so the film is the same on every run;
  - 960 x 540, 20 fps, no sound;
  - big type for the back of the room: captions 32 px bold, labels 26 px or more.

Sp is a sprite that is drawn in the picture's own (1x) coordinates, so the scene code never has to multiply by 3.
"""
import math, os, pathlib, subprocess, sys, tempfile
from functools import lru_cache
from multiprocessing import get_context
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parents[2]
MEDIA_OUT = ROOT / 'assets' / 'media'
PIC_OUT = ROOT / 'assets' / 'pictures'
FPS, W, H, SS = 20, 960, 540, 3
FONT_B = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
FONT_R = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'

# Upper Air palette (lib/theme.js 'atmosphere') plus the media colours for the gases
DARK, ACCENT, ACCENT_INK, GREEN, ALERT, TINT = '10213D', '8FD3E8', '1B6584', '23805F', 'C2432E', 'F2F7FA'
DARK_SOFT, TINT_DEEP, INK, INK_SOFT, WHITE = '2A4A73', 'DCE9F1', '14263D', '55708A', 'FFFFFF'
SUN, HAZE, OZONE, NOX, VOC, SULFUR = 'F6C445', 'B79A6D', '7B5EA7', 'E8833A', 'A06CD5', 'D9B72B'


# ------------------------------------------------------------------------------------------------ small maths
def clamp(x, a=0.0, b=1.0): return max(a, min(b, x))
def ease(u): u = clamp(u); return u * u * (3 - 2 * u)
def lerp(a, b, u): return a + (b - a) * u
def rgb3(h): return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))
def mix(h1, h2, u): return ''.join('%02X' % round(lerp(int(h1[i:i + 2], 16), int(h2[i:i + 2], 16), clamp(u))) for i in (0, 2, 4))


def pop(u, over=1.6):
    """0 -> 1 with a small overshoot (ease-out-back): something that appears with a pop."""
    u = clamp(u)
    return 1 + (over + 1) * (u - 1) ** 3 + over * (u - 1) ** 2


def rot(pts, ang, cx=0.0, cy=0.0):
    c, s = math.cos(ang), math.sin(ang)
    return [(cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c) for x, y in pts]


def rgba(c, a=1.0):
    """'RRGGBB', ('RRGGBB', alpha) or an RGBA tuple -> an RGBA tuple."""
    if c is None: return None
    if isinstance(c, tuple) and len(c) == 2 and isinstance(c[0], str): c, a = c
    if isinstance(c, str): return (int(c[0:2], 16), int(c[2:4], 16), int(c[4:6], 16), int(round(255 * a)))
    return c


@lru_cache(maxsize=None)
def F(size, bold=True): return ImageFont.truetype(FONT_B if bold else FONT_R, int(round(size * SS)))
def tw(s, size, bold=True): return F(size, bold).getlength(s) / SS          # the width of a string, in 1x pixels


def fade(im, a):
    if a < 0.999:
        im.putalpha(im.getchannel('A').point(lambda v: int(v * a)))
    return im


# ------------------------------------------------------------------------------------------------ the sprite
class Sp:
    """A transparent patch covering the box (x0, y0)-(x1, y1) of the picture, drawn in the picture's own coordinates."""

    def __init__(self, x0, y0, x1, y1):
        self.x0, self.y0 = int(math.floor(x0)), int(math.floor(y0))
        w, h = int(math.ceil(x1)) - self.x0, int(math.ceil(y1)) - self.y0
        self.im = Image.new('RGBA', (max(1, w) * SS, max(1, h) * SS), (0, 0, 0, 0))
        self.d = ImageDraw.Draw(self.im)

    def q(self, x, y): return ((x - self.x0) * SS, (y - self.y0) * SS)
    def pts(self, p): return [self.q(x, y) for x, y in p]

    def ellipse(self, x0, y0, x1, y1, fill=None, outline=None, width=0):
        self.d.ellipse([self.q(x0, y0), self.q(x1, y1)], fill=rgba(fill), outline=rgba(outline), width=int(round(width * SS)))

    def circle(self, cx, cy, r, fill=None, outline=None, width=0): self.ellipse(cx - r, cy - r, cx + r, cy + r, fill, outline, width)

    def rect(self, x0, y0, x1, y1, fill=None, outline=None, width=0, r=0):
        if r > 0:
            self.d.rounded_rectangle([self.q(x0, y0), self.q(x1, y1)], radius=r * SS, fill=rgba(fill), outline=rgba(outline), width=int(round(width * SS)))
        else:
            self.d.rectangle([self.q(x0, y0), self.q(x1, y1)], fill=rgba(fill), outline=rgba(outline), width=int(round(width * SS)))

    def poly(self, p, fill=None, outline=None, width=0):
        qp = self.pts(p)
        if fill is not None: self.d.polygon(qp, fill=rgba(fill))
        if outline is not None and width > 0:
            self.d.line(qp + [qp[0]], fill=rgba(outline), width=int(round(width * SS)), joint='curve')

    def line(self, p, col, width, caps=False):
        qp = self.pts(p)
        self.d.line(qp, fill=rgba(col), width=int(round(width * SS)), joint='curve')
        if caps:
            r = width * SS / 2
            for (x, y) in (qp[0], qp[-1]): self.d.ellipse([x - r, y - r, x + r, y + r], fill=rgba(col))

    def dashed(self, x0, y0, x1, y1, col, width, dash=10, gap=7):
        L = math.hypot(x1 - x0, y1 - y0)
        if L < 1: return
        ux, uy = (x1 - x0) / L, (y1 - y0) / L
        s = 0.0
        while s < L:
            e = min(L, s + dash)
            self.line([(x0 + ux * s, y0 + uy * s), (x0 + ux * e, y0 + uy * e)], col, width)
            s += dash + gap

    def arrow(self, x0, y0, x1, y1, col, width, head=14):
        L = math.hypot(x1 - x0, y1 - y0)
        ux, uy = (x1 - x0) / L, (y1 - y0) / L
        self.line([(x0, y0), (x1 - ux * head * 0.7, y1 - uy * head * 0.7)], col, width)
        px, py = -uy, ux
        self.poly([(x1, y1), (x1 - ux * head + px * head * 0.55, y1 - uy * head + py * head * 0.55),
                   (x1 - ux * head - px * head * 0.55, y1 - uy * head - py * head * 0.55)], fill=col)

    def text(self, x, y, s, size, col, anchor='mm', bold=True, stroke=0, stroke_col=None):
        self.d.text(self.q(x, y), s, font=F(size, bold), fill=rgba(col), anchor=anchor,
                    stroke_width=int(round(stroke * SS)), stroke_fill=rgba(stroke_col) if stroke_col else None)

    def blit(self, target, alpha=1.0, dx=0.0, dy=0.0):
        """Composite onto a 3x target image, clipped to it. dx, dy move it (1x units)."""
        if alpha <= 0.002: return
        src = self.im if alpha >= 0.999 else fade(self.im.copy(), alpha)
        X, Y = int(round((self.x0 + dx) * SS)), int(round((self.y0 + dy) * SS))
        sx0, sy0 = max(0, -X), max(0, -Y)
        sx1, sy1 = min(src.width, target.width - X), min(src.height, target.height - Y)
        if sx1 > sx0 and sy1 > sy0:
            target.alpha_composite(src.crop((sx0, sy0, sx1, sy1)), (X + sx0, Y + sy0))


def canvas(w, h, col):
    return Image.new('RGBA', (w * SS, h * SS), rgba(col))


def finish(img, w=W, h=H): return img.convert('RGB').resize((w, h), Image.LANCZOS)


def vgrad(w, h, stops):
    """A vertical gradient (3x size). stops = [(fraction 0..1, 'RRGGBB'), ...] -> RGBA image."""
    ys = np.linspace(0, 1, h * SS)
    fr = [s[0] for s in stops]
    out = np.zeros((h * SS, w * SS, 4), dtype=np.uint8)
    for ch in range(3):
        col = np.interp(ys, fr, [rgb3(s[1])[ch] for s in stops])
        out[:, :, ch] = col[:, None].astype(np.uint8)
    out[:, :, 3] = 255
    return Image.fromarray(out, 'RGBA')


def alpha_grad(w, h, col, stops):
    """A vertical band of one colour whose opacity runs through stops = [(fraction, alpha), ...]."""
    ys = np.linspace(0, 1, h * SS)
    a = np.interp(ys, [s[0] for s in stops], [s[1] for s in stops])
    out = np.zeros((h * SS, w * SS, 4), dtype=np.uint8)
    out[:, :, 0], out[:, :, 1], out[:, :, 2] = rgb3(col)
    out[:, :, 3] = (a[:, None] * 255).astype(np.uint8)
    return Image.fromarray(out, 'RGBA')


# ------------------------------------------------------------------------------------------------ molecules and gas dots
def draw_mol(sp, cx, cy, atoms, bonds, k=1.0, rotation=0.0, ow=2.2, bond_w=5.0, bond_col=INK, alpha_scale=1.0):
    """Atoms are (x, y, radius, fill). The whole molecule is centred on (cx, cy) by its bounding box, then turned by `rotation`.
    Bonds are pairs of atom indexes, drawn first so the circles sit on top: the atoms read as JOINED circles."""
    x0 = min(x - r for x, y, r, c in atoms); x1 = max(x + r for x, y, r, c in atoms)
    y0 = min(y - r for x, y, r, c in atoms); y1 = max(y + r for x, y, r, c in atoms)
    mx, my = (x0 + x1) / 2, (y0 + y1) / 2
    P = [(cx + (x - mx) * k * math.cos(rotation) - (y - my) * k * math.sin(rotation),
          cy + (x - mx) * k * math.sin(rotation) + (y - my) * k * math.cos(rotation)) for x, y, r, c in atoms]
    for i, j in bonds: sp.line([P[i], P[j]], bond_col, bond_w * k, caps=True)
    for (x, y, r, c), (px, py) in zip(atoms, P): sp.circle(px, py, r * k, fill=c, outline=INK, width=ow * k)
    return P


def atoms_bent(rc, ro, bond, half_deg, c_col, o_col):
    a = math.radians(half_deg)
    return [(0.0, 0.0, rc, c_col), (-bond * math.sin(a), bond * math.cos(a), ro, o_col), (bond * math.sin(a), bond * math.cos(a), ro, o_col)], [(0, 1), (0, 2)]


def so2(sp, cx, cy, k=1.0, rotation=0.0):
    """Sulfur dioxide: one big yellow circle, two small joined circles."""
    a, b = atoms_bent(15, 10, 24, 59.5, SULFUR, 'F6E7A0')
    return draw_mol(sp, cx, cy, a, b, k, rotation)


def o3(sp, cx, cy, k=1.0, rotation=0.0):
    """Ozone: THREE joined violet circles, bent."""
    a, b = atoms_bent(10, 10, 19, 58.5, OZONE, OZONE)
    return draw_mol(sp, cx, cy, a, b, k, rotation)


def nox(sp, cx, cy, k=1.0):
    """Nitrogen oxides: an orange circle."""
    sp.circle(cx, cy, 14 * k, fill=NOX, outline=INK, width=2.6 * k)


def voc(sp, cx, cy, k=1.0):
    """Volatile organic compounds: a purple diamond (a different SHAPE as well as a different colour)."""
    r = 18 * k
    sp.poly([(cx, cy - r), (cx + r, cy), (cx, cy + r), (cx - r, cy)], fill=VOC, outline=INK, width=2.6 * k)


def glow(sp, cx, cy, r, strength):
    """A pale yellow halo: sunlight on the gas."""
    if strength <= 0.01: return
    for rr, a in ((r + 15, 0.22), (r + 9, 0.34), (r + 4, 0.5)):
        sp.circle(cx, cy, rr, fill=('FFF3B0', a * strength))


def cross_out(sp, cx, cy, size, col=ALERT, width=5.0):
    """A bold X (white edge under a coloured line, so it reads on any background)."""
    for c, w in ((WHITE, width + 3.4), (col, width)):
        sp.line([(cx - size, cy - size), (cx + size, cy + size)], c, w, caps=True)
        sp.line([(cx - size, cy + size), (cx + size, cy - size)], c, w, caps=True)


# ------------------------------------------------------------------------------------------------ labels, chips, captions
def label_chip(img, x, y, text_lines, sizes, cols, alpha=1.0, outline=INK, pad=12, anchor='tl', icon=None, icon_w=0, fill=WHITE, line_gap=None):
    """A white label chip with big bold text (one or two lines). anchor 'tl' = x, y is the top-left; 'tc' top-centre; 'bc' bottom-centre.
    icon(sp, cx, cy) draws a small picture at the left of the first line. Returns (x0, y0, x1, y1)."""
    widths = [tw(s, z) for s, z in zip(text_lines, sizes)]
    w = max(widths) + 2 * pad + (icon_w + 8 if icon else 0)
    gaps = line_gap if line_gap is not None else 4
    h = sum(z * 1.18 for z in sizes) + gaps * (len(sizes) - 1) + 2 * pad - 6
    if anchor == 'tc': x -= w / 2
    elif anchor == 'bc': x -= w / 2; y -= h
    elif anchor == 'bl': y -= h
    elif anchor == 'tr': x -= w
    sp = Sp(x - 4, y - 4, x + w + 4, y + h + 4)
    sp.rect(x, y, x + w, y + h, fill=fill, outline=outline, width=2.6, r=11)
    yy = y + pad - 1
    for i, (s, z, c) in enumerate(zip(text_lines, sizes, cols)):
        cy = yy + z * 0.62
        tx = x + pad + (icon_w + 8 if icon else 0)
        sp.text(tx, cy, s, z, c, 'lm')
        if i == 0 and icon: icon(sp, x + pad + icon_w / 2, cy)
        yy += z * 1.18 + gaps
    sp.blit(img, alpha)
    return (x, y, x + w, y + h)


def leader(img, x0, y0, x1, y1, col=INK, width=3.0, alpha=1.0, dot=True):
    """A pointer line ending in a dot on the thing it labels."""
    pad = 10
    sp = Sp(min(x0, x1) - pad, min(y0, y1) - pad, max(x0, x1) + pad, max(y0, y1) + pad)
    sp.line([(x0, y0), (x1, y1)], WHITE, width + 3.0, caps=True)
    sp.line([(x0, y0), (x1, y1)], col, width, caps=True)
    if dot:
        sp.circle(x1, y1, 5.5, fill=col, outline=WHITE, width=1.6)
    sp.blit(img, alpha)


def draw_caption(img, num, lines, alpha, y0=444):
    """The caption band: a step number in a sky-blue badge, then the caption in 32 px bold white (two lines at most)."""
    if alpha <= 0.002: return
    n = len(lines)
    sp = Sp(0, y0, W, H)
    ys = [y0 + 48] if n == 1 else [y0 + 28, y0 + 70]
    sp.circle(48, y0 + 48, 26, fill=ACCENT)
    sp.text(48, y0 + 49, str(num), 34, DARK, 'mm')
    for s, y in zip(lines, ys): sp.text(94, y, s, 32, WHITE, 'lm')
    sp.blit(img, alpha)


def check_caption_widths(caps, limit=846):
    for k, lines in caps.items():
        assert len(lines) <= 2, (k, lines)
        for s in lines:
            assert tw(s, 32) <= limit, (k, s, tw(s, 32))


def step_captions(img, caps, starts, t, fade_t=0.35):
    """Show the caption of the current step; it fades in when the step starts, and the one before fades out."""
    n = max(i for i, s in enumerate(starts) if t >= s - 1e-9)
    a = ease((t - starts[n]) / fade_t)
    if n > 0 and a < 1: draw_caption(img, n, caps[n], 1 - a)
    draw_caption(img, n + 1, caps[n + 1], a)
    return n + 1


# ------------------------------------------------------------------------------------------------ encoding
_STATE = {}


def _work(args):
    i, folder = args
    _STATE['fn'](i / FPS).save(os.path.join(folder, '%04d.png' % i))
    return i


def encode(frame_fn, total, name, cover_t, init=None, out_dir=MEDIA_OUT):
    """Render every frame (4 worker processes), encode with ffmpeg, write <name>.mp4 and the cover <name>.png beside it.
    Command line: --stills 2.5 9 ... writes just those frames to the temp folder (ANIM_TMP) and stops."""
    if init: init()
    _STATE['fn'] = frame_fn
    tmp = pathlib.Path(os.environ.get('ANIM_TMP') or tempfile.mkdtemp())
    tmp.mkdir(parents=True, exist_ok=True)
    if '--stills' in sys.argv:
        for s in sys.argv[sys.argv.index('--stills') + 1:]:
            frame_fn(float(s)).save(tmp / ('still-%s.png' % s))
        print('stills in', tmp)
        return
    n = int(round(total * FPS))
    with get_context('fork').Pool(4) as pool:
        for k, _ in enumerate(pool.imap_unordered(_work, [(i, str(tmp)) for i in range(n)], chunksize=8)):
            if k % 120 == 0: print('frame', k, 'of', n, flush=True)
    out_dir.mkdir(parents=True, exist_ok=True)
    out = out_dir / (name + '.mp4')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', str(tmp / '%04d.png'), '-c:v', 'libx264',
                    '-pix_fmt', 'yuv420p', '-crf', '26', '-preset', 'veryslow', '-movflags', '+faststart', str(out)], check=True)
    frame_fn(cover_t).save(out_dir / (name + '.png'))
    for f in tmp.glob('*.png'): f.unlink()
    print('%s: %d frames, %.1f s, %d KB' % (out.name, n, n / FPS, out.stat().st_size // 1024))
