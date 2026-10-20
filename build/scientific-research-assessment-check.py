#!/usr/bin/env python3
"""
Scientific Research and Technology assessment (7B). Every number in the paper, the mark scheme and the feedback sheet is computed here with
sympy BEFORE it is written into any of them. The builders read build/scientific-research-assessment.numbers.json.

    python3 build/scientific-research-assessment-check.py
"""
import json, pathlib
from sympy import Rational as R, Float, Symbol, symbols, Eq, solve, nsimplify, simplify

HERE = pathlib.Path(__file__).parent
n = {}
checks = 0
def eq(got, want, what):
    global checks
    assert got == want, f'{what}: got {got}, expected {want}'
    checks += 1
def sig(x, s):
    """x rounded to s significant figures (round half up), as an exact Rational."""
    x = R(x)
    from sympy import floor, log, Integer
    e = int(floor(log(abs(x), 10)))
    q = R(10) ** (e - s + 1)
    return floor(x / q + R(1, 2)) * q
def sci(x):
    """standard form: (A, power) with 1 <= A < 10, exact"""
    x = R(x); p = 0
    while abs(x) >= 10: x /= 10; p += 1
    while abs(x) < 1: x *= 10; p -= 1
    return x, p
K = lambda c: c + 273

# ---- Q1: quick recall (Numbers in Science) ----
eq(sig(R('7.463'), 2), R('7.5'), 'Q1.1 7.463 to 2 s.f.')
eq(sci(R('0.00062')), (R('6.2'), -4), 'Q1.2 0.00062 in standard form')
eq(K(20), 293, 'Q1.3 20 C in kelvin'); eq(330 - 273, 57, 'Q1.4 330 K in C')

# ---- Q8: accurate and precise (Measuring and Recording Honestly): true value 50.0 g ----
TRUE = R(50)
sets = {'A': [46, 50, 54], 'B': [R('49.9'), R('50.0'), R('50.1')], 'C': [42, 45, 48], 'D': [R('47.9'), R('48.0'), R('48.1')]}
def cls(rs):
    mean = sum(rs) / len(rs); rng = max(rs) - min(rs)
    precise = rng <= 1          # readings within 1 g of each other
    accurate = abs(mean - TRUE) <= 1   # mean within 1 g of the true value
    return {(True, True): 'BOTH', (True, False): 'PRECISE', (False, True): 'ACCURATE', (False, False): 'NEITHER'}[(precise, accurate)], mean, rng
res = {k: cls(v) for k, v in sets.items()}
eq({k: v[0] for k, v in res.items()}, {'A': 'ACCURATE', 'B': 'BOTH', 'C': 'NEITHER', 'D': 'PRECISE'}, 'Q8 classes')
# nothing sits near a boundary: ranges are 8, 0.2, 6, 0.2 and the means are 50, 50, 45, 48
eq({k: (float(v[1]), float(v[2])) for k, v in res.items()}, {'A': (50.0, 8.0), 'B': (50.0, 0.2), 'C': (45.0, 6.0), 'D': (48.0, 0.2)}, 'Q8 means and ranges')
n['q8'] = {k: {'cls': v[0], 'mean': float(v[1]), 'range': float(v[2]), 'readings': [float(x) for x in sets[k]]} for k, v in res.items()}

# ---- Q10: the bouncing ball. Drop height (cm) -> three bounce heights (cm) ----
trials = {20: [11, 12, 13], 40: [24, 25, 26], 60: [34, 38, 36], 80: [45, 49, 50]}
means = {h: R(sum(v), 3) for h, v in trials.items()}
eq(means, {20: 12, 40: 25, 60: 36, 80: 48}, 'Q10 means')
eq(max(trials[80]) - min(trials[80]), 5, 'Q10 range at 80 cm')
eq(max(trials[60]) - min(trials[60]), 4, 'Q10 range at 60 cm')
# the line of best fit through the four means (least squares): the estimate at 50 cm
xs, ys = list(means.keys()), list(means.values())
xb, yb = R(sum(xs), 4), sum(ys) / 4
slope = sum((x - xb) * (y - yb) for x, y in zip(xs, ys)) / sum((x - xb) ** 2 for x in xs)
icpt = yb - slope * xb
eq((slope, icpt), (R(119, 200), R(1, 2)), 'Q10 fit')
est50 = slope * 50 + icpt
eq(est50, R(121, 4), 'Q10 estimate at 50 cm is 30.25')
assert 29 <= est50 <= 32; checks += 1
# every plotted mean lies within 1 cm of the best-fit line: it really is a "line through the middle"
assert all(abs(slope * x + icpt - y) < 1 for x, y in means.items()); checks += 1
n['q10'] = {'trials': {str(k): v for k, v in trials.items()}, 'means': {str(k): float(v) for k, v in means.items()}, 'range80': 5,
            'slope': float(slope), 'icpt': float(icpt), 'est50': float(est50)}

# ---- Feedback ----
fb = {}
# Q1
eq(sig(R('4.32'), 2), R('4.3'), 'FB1 S 4.32'); eq(sci(R('0.004')), (4, -3), 'FB1 S 0.004'); eq(K(10), 283, 'FB1 S 10 C'); eq(300 - 273, 27, 'FB1 S 300 K')
eq(sig(R('8.157'), 2), R('8.2'), 'FB1 C 8.157'); eq(sci(R('0.00047')), (R('4.7'), -4), 'FB1 C 0.00047'); eq(K(40), 313, 'FB1 C 40 C'); eq(280 - 273, 7, 'FB1 C 280 K')
eq(sci(sig(R('0.00003062'), 2)), (R('3.1'), -5), 'FB1 E 0.00003062'); eq(250 - 273, -23, 'FB1 E 250 K'); assert -300 < -273; checks += 1
# Q5 / Q6 have no numbers. Q8 feedback: true value 10 g, 20.0 cm
def c8(true, rs):
    mean = sum(rs) / len(rs); rng = max(rs) - min(rs)
    return mean, rng
eq(c8(10, [10, 10, 10]), (10, 0), 'FB8 S X'); eq(c8(10, [12, 12, 12]), (12, 0), 'FB8 S Y')
fb['q8c'] = {}
sets_c = {'P': [R('19.9'), R('20.0'), R('20.1')], 'Q': [R('21.9'), R('22.0'), R('22.1')], 'R': [17, 20, 23], 'S': [R('16.0'), 18, 20]}
TRUE_C = R(20)
def cls_c(rs):
    mean = sum(rs) / 3; rng = max(rs) - min(rs)
    return {(True, True): 'BOTH', (True, False): 'PRECISE', (False, True): 'ACCURATE', (False, False): 'NEITHER'}[(rng <= 1, abs(mean - TRUE_C) <= 1)]
eq({k: cls_c(v) for k, v in sets_c.items()}, {'P': 'BOTH', 'Q': 'PRECISE', 'R': 'ACCURATE', 'S': 'NEITHER'}, 'FB8 C classes')
fb['q8c'] = {k: [float(x) for x in v] for k, v in sets_c.items()}
# Q8 E: a thermometer 2 C too high at the boiling point (readings 102, 102, 102): range 0, mean 102, so precise not accurate; corrected readings
eq([r - 2 for r in (102, 102, 102)], [100, 100, 100], 'FB8 E corrected'); eq(c8(100, [102, 102, 102]), (102, 0), 'FB8 E')
# Q10 S: three trials 12, 14, 16 -> mean 14, range 4
eq(R(12 + 14 + 16, 3), 14, 'FB10 S mean'); eq(16 - 12, 4, 'FB10 S range')
# Q10 C: heights 10, 20, 30 cm; trials (7,8,9), (15,16,17)... a fresh table, two means to find
c10 = {10: [7, 8, 9], 20: [14, 18, 16], 30: [22, 25, 25], 40: [31, 33, 32]}
cm = {h: R(sum(v), 3) for h, v in c10.items()}
eq({h: float(v) for h, v in cm.items()}, {10: 8.0, 20: 16.0, 30: 24.0, 40: 32.0}, 'FB10 C means'); eq(max(c10[30]) - min(c10[30]), 3, 'FB10 C range')
fb['q10c'] = {str(h): v for h, v in c10.items()}
# Q10 E: four trials, an outlier, predict beyond the data: bounce = 0.8 x drop height for these means, so 100 cm -> 80 cm (and a warning: outside the range)
e10 = {20: [15, 16, 17, 16], 40: [31, 33, 32, 32], 60: [47, 48, 49, 48]}
em = {h: R(sum(v), 4) for h, v in e10.items()}
eq({h: float(v) for h, v in em.items()}, {20: 16.0, 40: 32.0, 60: 48.0}, 'FB10 E means')
eq(em[60] / 60, R(4, 5), 'FB10 E ratio'); eq(R(4, 5) * 100, 80, 'FB10 E prediction at 100')
fb['q10e'] = {str(h): v for h, v in e10.items()}
# Q4 etc: none. Q9: honest recording: mean of 2.1, 2.2, 3.4 if the odd one is kept vs 2.1, 2.2, 2.1
eq(R(21 + 22 + 34, 30), R(77, 30), 'FB9 mean with the odd result'); fb['q9'] = {'mean_with': round(float(R(77, 30)), 2), 'mean_without': round(float(R(21 + 22, 20)), 3)}
eq(R(21 + 22, 20), R(43, 20), 'FB9 mean without the odd one')
n['feedback'] = fb

(HERE / 'scientific-research-assessment.numbers.json').write_text(json.dumps(n, indent=2))
print(f'{checks} sympy checks passed; numbers written.')
