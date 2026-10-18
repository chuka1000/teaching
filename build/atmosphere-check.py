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

# ------------------------------------------------------------------------------------------------ Lesson 2
L2 = {}
# Do Now Q4: fish left after a pollutant kills 35% of 400
fish, kill = Integer(400), Integer(35)
dead = fish * kill / 100; left = fish - dead
eq((dead, left), (140, 260), '400 fish, 35% die'); L2['fish'] = dict(fish=num(fish), pct=num(kill), dead=num(dead), left=num(left))
# particles: how many times narrower than a hair is a PM2.5 particle (hair 70 micrometres, PM2.5 up to 2.5, PM10 up to 10)
hair, pm25, pm10 = Integer(70), R(5, 2), Integer(10)
eq(hair / pm25, 28, 'hair / PM2.5'); eq(hair / pm10, 7, 'hair / PM10'); L2['particles'] = dict(hair=num(hair), pm25=num(pm25), pm10=num(pm10), hair_over_pm25=num(hair / pm25), hair_over_pm10=num(hair / pm10))
# worksheet Q6 (not the Do Now's numbers): 800 fish, 15% die
f2, k2 = Integer(800), Integer(15)
d2 = f2 * k2 / 100
eq((d2, f2 - d2), (120, 680), '800 fish, 15% die'); L2['ws_fish'] = dict(fish=num(f2), pct=num(k2), dead=num(d2), left=num(f2 - d2))
# the worked example on the sheet: 600 fish, 25%
eq((Integer(600) * 25 / 100, Integer(600) - Integer(600) * 25 / 100), (150, 450), '600 fish, 25% die')
D['l2'] = L2

(HERE / 'atmosphere.data.json').write_text(json.dumps(D, indent=1))
print(f'{checks} checks passed; build/atmosphere.data.json written')
