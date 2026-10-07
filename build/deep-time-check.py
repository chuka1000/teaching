#!/usr/bin/env python3
"""
Deep Time (8I). Every number in the deck and the worksheet is checked here with sympy BEFORE it is written anywhere. The dates come from
build/deep-time.data.json (the one copy); the worksheet's printed numbers come from build/deep-time-answers.js and must agree with what is
computed here. The game is checked separately, over 300 generated games, by build/check-deep-time-game.py.

    python3 build/deep-time-check.py
"""
import json, pathlib, subprocess
from sympy import Rational as R, floor, nsimplify
HERE = pathlib.Path(__file__).parent
D = json.loads((HERE / 'deep-time.data.json').read_text())
E = {k: nsimplify(v[1]) for k, v in D['events'].items()}
AGE = R(D['earth_age'])
checks = 0
def eq(got, want, what):
    global checks
    assert got == want, f'{what}: got {got}, expected {want}'
    checks += 1

# ---- the data hangs together ----
eras = D['eras']
eq([e[0] for e in eras], ['Precambrian', 'Palaeozoic', 'Mesozoic', 'Cenozoic'], 'four eras, oldest first')
eq(eras[0][1], D['earth_age'], 'the first era starts when Earth forms')
eq(all(eras[i][2] == eras[i + 1][1] for i in range(3)) and eras[-1][2] == 0, True, 'the eras meet end to end and reach now')
era_of = lambda t: next(n for n, a, b in eras if a >= t > b or (t == 0 and b == 0))
eq([era_of(E[k]) for k in ['life', 'oxygen', 'animals', 'fish', 'plants', 'tetrapods', 'dinosaurs', 'mammals', 'birds', 'flowers', 'humans']],
   ['Precambrian', 'Precambrian', 'Precambrian', 'Palaeozoic', 'Palaeozoic', 'Palaeozoic', 'Mesozoic', 'Mesozoic', 'Mesozoic', 'Mesozoic', 'Cenozoic'], 'each event in its era')
eq(sorted(E, key=lambda k: -E[k]), ['earth', 'life', 'oxygen', 'animals', 'fish', 'plants', 'tetrapods', 'dinosaurs', 'mammals', 'birds', 'flowers', 'asteroid', 'panama', 'finches', 'humans'], 'events oldest first')
eq([x[1] for x in D['extinctions']], [445, 372, 252, 201, 66], 'the Big Five, oldest first')
eq(all(x[2] >= 70 for x in D['extinctions']), True, 'each lost at least 70% of species')
eq(D['extinctions'][2][1] == eras[1][2] and D['extinctions'][4][1] == eras[2][2], True, 'two era boundaries are mass extinctions (end-Permian, end-Cretaceous)')

# ---- era lengths and the Precambrian's share (I Do 1, worksheet Gold 14) ----
eq([a - b for _, a, b in eras], [4061, 287, 186, 66], 'era lengths in millions of years')
share = R(4600 - 539, 4600) * 100
eq(round(float(share), 1), 88.3, 'Precambrian share of Earth history, %'); eq(int(round(float(share))), 88, 'about 88%')

# ---- Earth's history as one day (hook, I Do 1, worksheet Gold) ----
def before_midnight_s(t): return t / AGE * 24 * 3600          # seconds before midnight
def clock(t):                                                   # the clock time, to the nearest second
    s = int(round(float(24 * 3600 - before_midnight_s(t))))
    return f'{s // 3600:02d}:{s % 3600 // 60:02d}:{s % 60:02d}'
eq(clock(E['life']), '05:44:21', 'first life'); eq(clock(E['oxygen']), '11:28:42', 'oxygen')
eq(clock(E['animals']), '21:00:00', 'first animals: exactly 21:00 (575 is one eighth of 4,600)'); eq(R(575, 4600), R(1, 8), 'one eighth')
eq(clock(E['plants']), '21:32:52', 'land plants'); eq(clock(E['dinosaurs']), '22:48:00', 'first dinosaurs: exactly 22:48')
eq(R(230, 4600) * 24, R(6, 5), 'dinosaurs: 1.2 hours before midnight'); eq(R(6, 5) * 60, 72, '72 minutes')
eq(clock(E['asteroid']), '23:39:20', 'the asteroid')
eq(round(float(R(66, 4600) * 24), 3), 0.344, 'asteroid: 0.344 hours'); eq(round(float(R(66, 4600) * 24 * 60), 1), 20.7, 'asteroid: 20.7 minutes')
eq(round(0.344 * 60, 1), 20.6, 'from the rounded 0.344 hours: 20.6 minutes'); eq(int(round(20.6)), 21, 'about 21 minutes'); eq(24 * 60 - 21, 23 * 60 + 39, '24:00 less 21 minutes is 23:39')
eq(round(float(R(66, 4600) * 24 * 60)), 21, 'exactly: also about 21 minutes')
eq([clock(R(e[2])) for e in eras[:3]], ['21:11:16', '22:41:07', '23:39:20'], 'era boundaries on the one-day clock (the animation stops on these)')
eq(clock(E['humans']), '23:59:54', 'first humans'); eq(round(float(before_midnight_s(E['humans'])), 2), 5.63, 'humans: 5.63 s before midnight')
eq(int(round(float(before_midnight_s(E['humans'])))), 6, 'about 6 seconds')
eq(round(float(R(4600, 24)), 1), 191.7, 'one hour of the day is about 192 million years')

# ---- the 46 m timeline (1 m = 100 million years) ----
eq(AGE / 100, 46, '46 m'); eq(E['asteroid'] / 100, R(66, 100), 'asteroid 0.66 m from now'); eq(E['humans'] / 100 * 1000, 3, 'humans 3 mm from now')
eq(E['dinosaurs'] / 100, R(23, 10), 'first dinosaurs 2.3 m'); eq(E['life'] / 100, 35, 'first life 35 m')

# ---- gaps (We Do, worksheet Silver) ----
eq(E['asteroid'] - E['humans'], R(657, 10), 'last dinosaurs to first humans: 65.7 million years')
trex, steg = D['trex'], D['stegosaurus']
eq(steg - trex, 82, 'Stegosaurus to T. rex: 82 million years'); eq(trex - E['humans'], R(677, 10), 'T. rex to the first humans: 67.7 million years')
eq(trex - E['humans'] < steg - trex, True, 'T. rex lived closer in time to us than to Stegosaurus')

# ---- Do Now Q5 (maths): 12% of 4,600 ----
eq(R(4600 * 12, 100), 552, '4,600 × 12 ÷ 100 = 552')
eq(R(539, 4600) * 100 < 12, True, 'the last 539 million years are under 12% of Earth history')

# ---- the printed answers agree (once the answers module exists) ----
ans_js = HERE / 'deep-time-answers.js'
if ans_js.exists():
    A = json.loads(subprocess.run(['node', '-e', "const A = require('./build/deep-time-answers'); console.log(JSON.stringify({ list: A, N: A.N }))"],
                                  cwd=HERE.parent, capture_output=True, text=True, check=True).stdout)
    N = A['N']
    eq(N['dinoHours'], 1.2, 'answers: dinosaurs 1.2 h'); eq(N['dinoMin'], 72, 'answers: 72 min'); eq(N['dinoClock'], '22:48', 'answers: 22:48')
    eq(N['astHours'], 0.344, 'answers: 0.344 h'); eq(N['astMin'], 20.6, 'answers: 20.6 min'); eq(N['astClock'], '23:39', 'answers: 23:39')
    eq(N['humanSec'], 5.6, 'answers: 5.6 s'); eq(N['astM'], 0.66, 'answers: 0.66 m'); eq(N['humanMm'], 3, 'answers: 3 mm')
    eq(N['preShare'], 88.3, 'answers: 88.3%'); eq(N['trexSteg'], 82, 'answers: 82'); eq(N['trexUs'], 67.7, 'answers: 67.7'); eq(N['dinoUs'], 65.7, 'answers: 65.7')
    eq(N['meso'], [252, 66], 'answers: Mesozoic 252 to 66'); eq(N['palaeo'], [539, 252], 'answers: Palaeozoic 539 to 252')
print(f'{checks} sympy checks passed')
