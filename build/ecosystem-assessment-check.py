#!/usr/bin/env python3
"""
Ecosystems assessment (9I and 9G). Every number in the paper, the mark scheme
and the feedback sheet is computed here with sympy BEFORE it is written into
any of them (ASSESSMENT.md: "Every numeric answer verified with sympy"). The
builders read build/ecosystem-assessment.numbers.json, so the three documents
cannot disagree.

    python3 build/ecosystem-assessment-check.py
"""
import json, pathlib
from sympy import Rational as R, Float, nsimplify

HERE = pathlib.Path(__file__).parent
n = {}
checks = 0
def eq(got, want, what):
    global checks
    assert got == want, f'{what}: got {got}, expected {want}'
    checks += 1

TEN = R(1, 10)                         # "about nine tenths is lost at each step" (Ecosystems 2)

# ---- Q5: energy through a four-link chain, 90% lost at each step ----------
E0 = 20000
steps = [E0 * TEN ** k for k in range(4)]
eq([int(s) for s in steps], [20000, 2000, 200, 20], 'Q5 chain')
n['q5'] = {'start': E0, 'steps': [int(s) for s in steps]}
eq(E0 * R(90, 100), 18000, 'Q5: 90% of 20 000 is lost at the first step, so 18 000 is lost')

# ---- Q6: the population graph (values rounded; 1950 and 2022 are the taught figures) ----
pts = {1950: R(26, 10), 1975: R(40, 10), 2000: R(61, 10), 2022: R(80, 10), 2050: R(97, 10), 2085: R(103, 10), 2100: R(103, 10)}
eq(pts[2022] - pts[1950], R(54, 10), 'Q6(b) increase 1950 to 2022')
n['q6'] = {'points': {str(k): float(v) for k, v in pts.items()}, 'y4': 1975, 'p1950': 2.6, 'p2022': 8.0, 'increase': 5.4, 'peak': 10.3}
eq(float(pts[2085]), 10.3, 'Q6 peak 10.3 billion (mid-2080s)')

# ---- Feedback variants ------------------------------------------------------
f = {}
# Q5 support: 1 000 kJ, two steps
s = [1000 * TEN ** k for k in range(3)]
eq([int(x) for x in s], [1000, 100, 10], 'F5 support'); f['q5s'] = [int(x) for x in s]
# Q5 consolidate: 50 000 kJ, three steps
c = [50000 * TEN ** k for k in range(4)]
eq([int(x) for x in c], [50000, 5000, 500, 50], 'F5 consolidate'); f['q5c'] = [int(x) for x in c]
# Q5 extend: 15 kJ in the top link; how much at the start of a four-link chain? (reverse)
eq(15 * 10 ** 3, 15000, 'F5 extend'); f['q5e'] = 15000
# Q6 support: read a table and find an increase
eq(R(80, 10) - R(61, 10), R(19, 10), 'F6 support 2022 minus 2000'); f['q6s'] = 1.9
# Q6 consolidate: increase 1975 to 2022
eq(R(80, 10) - R(40, 10), 4, 'F6 consolidate'); f['q6c'] = 4.0
# Q6 extend: percentage increase 2022 to 2050
pc = (R(97, 10) - R(80, 10)) / R(80, 10) * 100
eq(pc, R(425, 20), 'F6 extend percentage'); f['q6e'] = float(pc)
assert abs(float(pc) - 21.25) < 1e-9
n['feedback'] = f

(HERE / 'ecosystem-assessment.numbers.json').write_text(json.dumps(n, indent=1))
print(f'{checks} checks passed; numbers written')
