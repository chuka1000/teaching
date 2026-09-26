#!/usr/bin/env python3
"""
How Science Works assessment (7B). Every number in the paper, the mark scheme
and the feedback sheet is computed here with sympy BEFORE it is written into
any of them. The builders read build/how-science-works-assessment.numbers.json.

    python3 build/how-science-works-assessment-check.py
"""
import json, pathlib
from sympy import Rational as R

HERE = pathlib.Path(__file__).parent
n = {}
checks = 0
def eq(got, want, what):
    global checks
    assert got == want, f'{what}: got {got}, expected {want}'
    checks += 1

# ---- Q10: the turkey's confidence, Laplace (n+1)/(n+2), as in Inductive Reasoning ----
conf = lambda d: R(d + 1, d + 2) * 100
eq(conf(0), 50, 'day 0')
eq(round(float(conf(20))), 95, 'day 20 is about 95%')
eq(round(float(conf(50))), 98, 'day 50 is about 98%')
eq(round(float(conf(100)), 1), 99.0, 'day 100 is about 99%')
n['q10'] = {'day20': float(conf(20)), 'day50': float(conf(50)), 'curve': [[d, float(conf(d))] for d in range(0, 101)]}
# the curve rises by less and less: successive 10-day gains shrink
gains = [conf(d + 10) - conf(d) for d in range(0, 100, 10)]
assert all(gains[i] > gains[i + 1] for i in range(len(gains) - 1)); checks += 1

# ---- Feedback ----
fb = {}
# Q10 feedback tables
tbl = {d: round(float(conf(d))) for d in (0, 2, 10, 50)}
eq(tbl, {0: 50, 2: 75, 10: 92, 50: 98}, 'FB Q10 C table'); fb['q10c'] = tbl
eq(conf(8), 90, 'FB Q10 E: 8 days -> 9/10'); eq(conf(98), 99, 'FB Q10 E: 98 days -> 99/100')
fb['q10e'] = [float(conf(8)), float(conf(98))]
tblS = {d: round(float(conf(d))) for d in (0, 1, 5, 20)}
eq(tblS, {0: 50, 1: 67, 5: 86, 20: 95}, 'FB Q10 S table'); fb['q10s'] = tblS
n['feedback'] = fb

(HERE / 'how-science-works-assessment.numbers.json').write_text(json.dumps(n, indent=2))
print(f'{checks} sympy checks passed; numbers written.')
