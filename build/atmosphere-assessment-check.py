#!/usr/bin/env python3
"""
Y9 Atmosphere assessment. Every number on the paper, the mark scheme and the feedback sheet is derived here with sympy from the real NOAA Mauna Loa
annual file BEFORE it is written, and saved to build/atmosphere-assessment.numbers.json for build/atmosphere-assessment-content.js to read, so the three
documents and the graph cannot disagree.

    python3 build/atmosphere-assessment-check.py
"""
import json, pathlib
from sympy import Rational as R, Integer

HERE = pathlib.Path(__file__).parent
checks = 0


def eq(got, want, what):
    global checks
    assert got == want, f'{what}: got {got}, expected {want}'
    checks += 1


CO2 = {}
for line in open(HERE / 'atmosphere-data' / 'co2_annmean_mlo.txt'):
    if line.strip() and not line.startswith('#'):
        y, v, _ = line.split(); CO2[int(y)] = R(v)


def r(y):
    """the whole-number ppm a student reads off the graph for year y"""
    return int(round(float(CO2[y])))


N = {}
# Q7: the graph, 1960 to 2020 (annual means, NOAA Mauna Loa). (a) the value in 2000, (c) the rise from 2000 to 2020.
y1, y2 = 2000, 2020
v1, v2 = r(y1), r(y2)
eq((v1, v2), (370, 414), 'whole-number readings for 2000 and 2020')
eq(v2 - v1, 44, 'rise 2000 to 2020')
# a reading that is within 1 ppm of a gridline (the graph has a gridline every 5 ppm) is easy to read: check both
assert abs(CO2[y1] - 370) < 1 and abs(CO2[y2] - 415) < 1.5
checks += 1
N['q7'] = dict(y1=y1, v1=v1, y2=y2, v2=v2, rise=v2 - v1, read_lo=368, read_hi=372, rise_lo=42, rise_hi=47,
               start=r(1960), end=r(2020), first=1960, last=2020, ymin=310, ymax=420)
# the graph is always rising: every year is higher than the one before (so "rises steadily" is true; no dip to trap anyone)
ys = sorted(k for k in CO2 if 1960 <= k <= 2020)
assert all(CO2[b] > CO2[a] for a, b in zip(ys, ys[1:])); checks += 1
# the rises per decade increase (so "faster over time" is true, and an Extend student can say it)
dec = [CO2[y + 10] - CO2[y] for y in (1960, 1970, 1980, 1990, 2000, 2010)]
eq([round(float(x), 1) for x in dec], [8.8, 13.1, 15.7, 15.3, 20.4, 24.1], 'rise in each decade')
N['decade_rise'] = [round(float(x), 1) for x in dec]
# the rate: 1960 to 1970 against 2010 to 2020
assert dec[-1] > 2 * dec[0]; checks += 1

F = {}
# feedback: Support (1980 to 2000, read off the graph), Consolidate (1960 to 1990), Extend (percentage rise 1960 to 2020, and against the ice-core maximum of 299)
s1, s2 = r(1980), r(2000); eq((s1, s2, s2 - s1), (339, 370, 31), 'S: 1980 to 2000')
c1, c2 = r(1960), r(1990); eq((c1, c2, c2 - c1), (317, 354, 37), 'C: 1960 to 1990')
e1, e2 = r(1960), r(2020); pct = R(e2 - e1, e1) * 100
eq((e1, e2, e2 - e1), (317, 414, 97), 'E: 1960 to 2020'); eq(int(round(float(pct))), 31, 'E: percentage rise, to the nearest whole number')
ice = Integer(300); eq(e2 - ice, 114, 'E: 2020 against the ice-core ceiling of about 300 ppm')
F['q7s'] = dict(y1=1980, v1=s1, y2=2000, v2=s2, rise=s2 - s1)
F['q7c'] = dict(y1=1960, v1=c1, y2=1990, v2=c2, rise=c2 - c1)
F['q7e'] = dict(y1=1960, v1=e1, y2=2020, v2=e2, rise=e2 - e1, pct=int(round(float(pct))), ice=300, above_ice=int(e2 - ice))
N['feedback'] = F
(HERE / 'atmosphere-assessment.numbers.json').write_text(json.dumps(N, indent=1))
print(f'{checks} checks passed; build/atmosphere-assessment.numbers.json written')
