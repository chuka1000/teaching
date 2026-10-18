#!/usr/bin/env python3
"""
A Warming Planet: the three evidence graphs for Lesson 4, drawn from the real data files in build/atmosphere-data/ (NOAA, NASA, NOAA Paleo).
Upper Air palette, large text for the back of the room, 1100 x 620 px, tint background.

    atm-keeling.png   CO2 at Mauna Loa, monthly, March 1958 to the latest full month (NOAA GML): the zigzag and the climb
    atm-temp.png      Global temperature anomaly each year 1880 to 2025 (NASA GISTEMP v4, relative to 1951 to 1980)
    atm-icecore.png   CO2 over the last 800,000 years from Antarctic ice cores (Bereiter et al. 2015), with today's level marked

    python3 build/media/a-warming-planet-graphs.py
"""
import pathlib
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

ROOT = pathlib.Path(__file__).resolve().parents[2]
DATA = ROOT / 'build' / 'atmosphere-data'
OUT = ROOT / 'assets' / 'pictures'
DARK, ACCENT, ACCENT_INK, ALERT, TINT, INK, SOFT, GRID = '#10213D', '#8FD3E8', '#1B6584', '#C2432E', '#F2F7FA', '#14263D', '#55708A', '#C9D8E4'
plt.rcParams.update({'font.family': 'DejaVu Sans', 'font.size': 15, 'axes.edgecolor': SOFT, 'axes.labelcolor': INK, 'xtick.color': INK, 'ytick.color': INK,
                     'axes.facecolor': 'white', 'figure.facecolor': TINT, 'savefig.facecolor': TINT, 'axes.spines.top': False, 'axes.spines.right': False})
W_IN, H_IN, DPI = 11.0, 6.2, 100


def fig():
    f, ax = plt.subplots(figsize=(W_IN, H_IN), dpi=DPI)
    ax.grid(axis='y', color=GRID, lw=1)
    ax.set_axisbelow(True)
    return f, ax


def keeling():
    rows = [l.split() for l in open(DATA / 'co2_mm_mlo.txt') if not l.startswith('#') and l.strip()]
    t = [float(r[2]) for r in rows]; avg = [float(r[3]) for r in rows]; trend = [float(r[4]) for r in rows]
    ok = [a > 0 for a in avg]
    t = [x for x, k in zip(t, ok) if k]; avg = [x for x, k in zip(avg, ok) if k]; trend = [x for x, k in zip(trend, ok) if k]
    f, ax = fig()
    ax.plot(t, avg, color=ALERT, lw=2.0, label='Each month')
    ax.set_xlim(1958, 2027); ax.set_ylim(300, 440)
    ax.set_xlabel('Year'); ax.set_ylabel('Carbon dioxide (ppm)')
    ax.annotate(f'{avg[0]:.0f} ppm\n1958', (t[0], avg[0]), xytext=(1960, 380), color=INK, fontsize=14, arrowprops=dict(arrowstyle='-', color=SOFT))
    ann = {int(l.split()[0]): float(l.split()[1]) for l in open(DATA / 'co2_annmean_mlo.txt') if l.strip() and not l.startswith('#')}
    ax.annotate(f'{ann[2025]:.0f} ppm\n2025 average', (2025.5, ann[2025]), xytext=(2000, 335), color=INK, fontsize=14, ha='left', arrowprops=dict(arrowstyle='-', color=SOFT))
    f.tight_layout(); f.savefig(OUT / 'atm-keeling.png'); plt.close(f)
    return t, avg


def temp():
    lines = [l for l in open(DATA / 'gistemp_GLB.csv') if l[:2] in ('18', '19', '20')]
    yrs, an = [], []
    for l in lines:
        c = l.strip().split(',')
        if c[13] not in ('***', '') and int(c[0]) <= 2025:
            yrs.append(int(c[0])); an.append(float(c[13]))
    f, ax = fig()
    ax.bar(yrs, an, color=[ALERT if a >= 0 else ACCENT_INK for a in an], width=0.85)
    ax.axhline(0, color=INK, lw=1.2)
    ax.set_xlim(1878, 2027)
    ax.set_xlabel('Year'); ax.set_ylabel('Temperature change (°C)')
    ax.text(1884, 1.05, 'Red: warmer than the 1951 to 1980 average\nBlue: cooler than it', fontsize=14, color=INK, va='center')
    f.tight_layout(); f.savefig(OUT / 'atm-temp.png'); plt.close(f)
    return yrs, an


def icecore():
    rows = [l.split('\t') for l in open(DATA / 'antarctica2015co2composite.txt', encoding='utf-8-sig') if l.strip() and not l.startswith('#') and not l.startswith('age')]
    age = [float(r[0]) for r in rows]; co2 = [float(r[1]) for r in rows]
    pairs = [(a, c) for a, c in zip(age, co2) if a >= 0]
    f, ax = fig()
    ax.plot([a / 1000 for a, c in pairs], [c for a, c in pairs], color=ACCENT_INK, lw=2.2)
    today = 427.35
    ax.set_xlim(810, -25); ax.set_ylim(150, 450)
    ax.axhline(today, color=ALERT, lw=2.2, ls='--')
    ax.text(805, today + 8, 'Today: about 427 ppm', color=ALERT, fontsize=15, fontweight='bold', va='bottom')
    ax.set_xlabel('Thousands of years ago'); ax.set_ylabel('Carbon dioxide (ppm)')
    f.tight_layout(); f.savefig(OUT / 'atm-icecore.png'); plt.close(f)
    return pairs


if __name__ == '__main__':
    t, a = keeling(); yrs, an = temp(); pairs = icecore()
    print('keeling', t[0], a[0], t[-1], a[-1], '| temp', yrs[0], yrs[-1], min(an), max(an), '| icecore points', len(pairs), min(c for _, c in pairs), max(c for _, c in pairs))
