#!/usr/bin/env python3
"""
The one graph on the Atmosphere assessment: annual mean carbon dioxide at Mauna Loa, 1960 to 2020 (NOAA GML, build/atmosphere-data/co2_annmean_mlo.txt).
BLACK AND WHITE (ASSESSMENT.md): a solid black line, grey gridlines, no colour. Range and years come from atmosphere-assessment.numbers.json.

    python3 build/media/atmosphere-assessment-graph.py     ->  assets/assessment/atm_co2_bw.png
"""
import json, pathlib
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

ROOT = pathlib.Path(__file__).resolve().parents[2]
N = json.load(open(ROOT / 'build' / 'atmosphere-assessment.numbers.json'))['q7']
yrs, vals = [], []
for line in open(ROOT / 'build' / 'atmosphere-data' / 'co2_annmean_mlo.txt'):
    if line.strip() and not line.startswith('#'):
        y, v, _ = line.split()
        if N['first'] <= int(y) <= N['last']:
            yrs.append(int(y)); vals.append(float(v))

fig, ax = plt.subplots(figsize=(6.4, 3.9), dpi=220)
ax.plot(yrs, vals, color='black', linewidth=1.8, solid_capstyle='round')
ax.set_xlim(N['first'], N['last']); ax.set_ylim(N['ymin'], N['ymax'])
ax.set_xticks(range(N['first'], N['last'] + 1, 10)); ax.set_xticks(range(N['first'], N['last'] + 1, 5), minor=True)
ax.set_yticks(range(N['ymin'], N['ymax'] + 1, 10)); ax.set_yticks(range(N['ymin'], N['ymax'] + 1, 5), minor=True)
ax.grid(which='major', color='#8c8c8c', linewidth=0.8); ax.grid(which='minor', color='#cfcfcf', linewidth=0.5)
ax.set_axisbelow(True)
ax.tick_params(which='both', labelsize=9, colors='black'); ax.tick_params(which='minor', length=2)
ax.set_xlabel('Year', fontsize=10.5, labelpad=6); ax.set_ylabel('Carbon dioxide in the air (ppm)', fontsize=10.5, labelpad=6)
for s in ax.spines.values():
    s.set_color('black'); s.set_linewidth(1.1)
fig.tight_layout()
out = ROOT / 'assets' / 'assessment' / 'atm_co2_bw.png'
fig.savefig(out, facecolor='white')
from PIL import Image
Image.open(out).convert('L').save(out)       # greyscale, no alpha
print('written', out)
