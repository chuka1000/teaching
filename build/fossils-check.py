#!/usr/bin/env python3
"""
Fossils And The Fossil Record (8I). The one number in the deck (Do Now Q4) is checked here
with sympy BEFORE it is written into the slide. The game is checked separately, over 300
generated games, by build/check-fossils-game.py.

    python3 build/fossils-check.py
"""
from sympy import Rational as R
checks = 0
def eq(got, want, what):
    global checks
    assert got == want, f'{what}: got {got}, expected {want}'
    checks += 1

# Do Now Q4: sediment builds up at 2 cm every 1000 years. How long to build 10 cm?
eq(R(10, 2) * 1000, 5000, 'DN4: 10 cm at 2 cm per 1000 years')
eq(R(10, 2), 5, 'DN4 step')
eq(10 * 2, 20, 'DN4 wrong: multiplied instead of dividing')     # the mistake named in the notes
eq(R(10, 2), 5, 'DN4 wrong: forgot the 1000')
print(f'{checks} sympy checks passed')
