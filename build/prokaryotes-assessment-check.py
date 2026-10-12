#!/usr/bin/env python3
"""
Prokaryotes assessment (8I). Every number on the paper, the mark scheme and the feedback sheet is derived here with sympy BEFORE it is written, and
saved to build/prokaryotes-assessment.numbers.json for build/prokaryotes-assessment-content.js to read, so the three documents cannot disagree.

    python3 build/prokaryotes-assessment-check.py
"""
import json, pathlib
from sympy import Rational as R

HERE = pathlib.Path(__file__).parent
checks = 0


def eq(got, want, what):
    global checks
    assert got == want, f'{what}: got {got}, expected {want}'
    checks += 1


N = {}
# Q4: one bacterium, one division every 20 minutes
table = {m: 2 ** (m // 20) for m in (0, 20, 40, 60, 80)}
eq(list(table.values()), [1, 2, 4, 8, 16], 'doubling table to 80 minutes')
N['q4_table'] = table
div3h = R(180, 20)
eq(div3h, 9, 'divisions in 3 hours'); eq(2 ** int(div3h), 512, '2^9 after 3 hours')
N['q4'] = dict(minutes=180, gen=20, divisions=9, bacteria=512)
# Q9: a million bacteria, one in 100,000 resistant
eq(R(1000000, 100000), 10, 'resistant bacteria'); N['q9'] = dict(total=1000000, one_in=100000, resistant=10)
# feedback variants
F = {}
F['q4s'] = dict(minutes=60, gen=20, divisions=int(R(60, 20)), bacteria=2 ** int(R(60, 20))); eq((F['q4s']['divisions'], F['q4s']['bacteria']), (3, 8), 'S: 1 hour at 20 minutes')
F['q4c'] = dict(minutes=180, gen=30, divisions=int(R(180, 30)), bacteria=2 ** int(R(180, 30))); eq((F['q4c']['divisions'], F['q4c']['bacteria']), (6, 64), 'C: 3 hours at 30 minutes')
F['q4e'] = dict(minutes=300, gen=15, divisions=int(R(300, 15)), bacteria=2 ** int(R(300, 15))); eq((F['q4e']['divisions'], F['q4e']['bacteria']), (20, 1048576), 'E: 5 hours at 15 minutes')
F['q9s'] = dict(total=2000000, one_in=500000, resistant=int(R(2000000, 500000))); eq(F['q9s']['resistant'], 4, 'S: 2,000,000 at 1 in 500,000')
F['q9c'] = dict(total=5000000, one_in=1000000, resistant=int(R(5000000, 1000000))); eq(F['q9c']['resistant'], 5, 'C: 5,000,000 at 1 in 1,000,000')
F['q9e'] = dict(total=100000, one_in=1000, resistant=int(R(100000, 1000)), pct=float(R(1, 1000) * 100)); eq((F['q9e']['resistant'], F['q9e']['pct']), (100, 0.1), 'E: 100,000 at 1 in 1,000, and the percentage')
F['q1c_size'] = dict(um_mm=1000, rod_um=4, across=int(R(1000, 4))); eq(F['q1c_size']['across'], 250, 'a 4 um rod across 1 mm')
N['feedback'] = F
(HERE / 'prokaryotes-assessment.numbers.json').write_text(json.dumps(N, indent=1))
print(f'{checks} checks passed; build/prokaryotes-assessment.numbers.json written')
