#!/usr/bin/env python3
"""
The Greatest Show On Earth (8I). Every number in the deck and the worksheet is checked here with sympy, and the values the worksheet and its
answers print (build/the-greatest-show-on-earth-answers.js) are read back from that module and must agree. The game is checked separately, over
300 generated games, by build/check-the-greatest-show-on-earth-game.py.

    python3 build/the-greatest-show-on-earth-check.py
"""
import json, pathlib, subprocess
from sympy import Rational as R
checks = 0
def eq(got, want, what):
    global checks
    assert got == want, f'{what}: got {got}, expected {want}'
    checks += 1

HERE = pathlib.Path(__file__).parent
A = json.loads(subprocess.run(['node', '-e', "const A = require('./build/the-greatest-show-on-earth-answers'); console.log(JSON.stringify({ list: A, D: A.D, R: A.R, ORDER: A.ORDER, SHOWN: A.SHOWN, NUMBERS: A.NUMBERS }))"],
                              cwd=HERE.parent, capture_output=True, text=True, check=True).stdout)
ans = dict(A['list'])

# ---- the deck ----
# Do Now Q5 (another science): a runner covers 120 m in 20 s
eq(R(120, 20), 6, 'DN5: 120 m in 20 s')
# I Do 1 notes: horse 64, donkey 62, so a mule has 32 + 31 = 63, an odd number
eq(R(64, 2) + R(62, 2), 63, 'mule chromosomes'); eq(63 % 2, 1, 'odd')

# ---- the worksheet: generations = years apart / years per generation ----
for key, years, length, want in [('gen', 3_000_000, 2, 1_500_000), ('q10', 2_000_000, 4, 500_000), ('q11', 120_000, 2, 60_000)]:
    eq(A['D'][key], {'years': years, 'length': length}, f'{key}: the data the sheet prints')
    eq(R(years, length), want, f'{key}: {years} / {length}')
    eq(A['R'][key], want, f'{key}: the answers module agrees')
eq(ans['10'], '2,000,000 ÷ 4 = 500,000 generations.', 'answer 10 as printed')
eq(ans['11'].startswith('120,000 ÷ 2 = 60,000 generations.'), True, 'answer 11 as printed')
# the mistakes a student is likely to make, so the marking notes can name them
eq(2_000_000 * 4, 8_000_000, 'Q10 wrong: multiplied')
eq(R(120_000, 2) != 120_000 * 2, True, 'Q11: dividing and multiplying differ')

# ---- worksheet Q5: the six jumbled steps, numbered in the order they happen ----
ORDER = ['one', 'barrier', 'cond', 'sel', 'build', 'split']          # written out again
eq(A['ORDER'], ORDER, 'Q5: the steps in order')
shown = A['SHOWN']
eq(sorted(shown), list(range(6)), 'Q5: every step printed once')
eq(shown != list(range(6)), True, 'Q5: the printed order is jumbled')
want = [ORDER.index(ORDER[k]) + 1 for k in shown]
eq(A['NUMBERS'], want, 'Q5: the step number for each printed line')
eq(ans['5'].startswith('Line a = %d, b = %d, c = %d, d = %d, e = %d, f = %d.' % tuple(want)), True, 'Q5: the printed answer')

print(f'{checks} sympy checks passed')
