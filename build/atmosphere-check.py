#!/usr/bin/env python3
"""
Y9 Atmosphere (Lessons 1 to 4 and the assessment). Every number that goes into a deck, a worksheet or its answers is derived HERE with sympy, from the
real data files in build/atmosphere-data/ where there are any, and written to build/atmosphere.data.json. The build scripts read that file only, so a deck
and its worksheet cannot disagree.

    python3 build/atmosphere-check.py
"""
import json, pathlib
from sympy import Rational as R, Integer, floor

HERE = pathlib.Path(__file__).parent
DATA = HERE / 'atmosphere-data'
checks = 0
D = {}


def eq(got, want, what):
    global checks
    assert got == want, f'{what}: got {got}, expected {want}'
    checks += 1


def num(x):
    """JSON-friendly: ints stay ints, other values become floats rounded to 6 places."""
    x = R(x)
    return int(x) if x.q == 1 else float(round(float(x), 6))


# ------------------------------------------------------------------------------------------------ Lesson 1
L1 = {}
# Do Now Q1 (retrieval from Pollution Pandemic: a share of a total, new numbers)
runoff, strip_pct = Integer(250), Integer(40)
caught = runoff * strip_pct / 100
eq(caught, 100, 'grass strip catches 40% of 250 kg'); L1['strip'] = dict(runoff=num(runoff), pct=num(strip_pct), caught=num(caught))
# Worksheet: the sulfur in a day's coal
coal_t, s_pct = Integer(2000), Integer(2)
sulfur_t = coal_t * s_pct / 100
eq(sulfur_t, 40, 'sulfur in 2,000 t of coal at 2%'); L1['coal'] = dict(coal=num(coal_t), pct=num(s_pct), sulfur=num(sulfur_t))
D['l1'] = L1

(HERE / 'atmosphere.data.json').write_text(json.dumps(D, indent=1))
print(f'{checks} checks passed; build/atmosphere.data.json written')
