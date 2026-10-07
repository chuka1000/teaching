#!/usr/bin/env python3
"""
More Evidence (8I). The numbers in the deck and the worksheet are checked here with sympy BEFORE
they are written anywhere. The game is checked separately, over 300 generated games, by
build/check-more-evidence-game.py.

    python3 build/more-evidence-check.py
"""
from sympy import Rational as R
checks = 0
def eq(got, want, what):
    global checks
    assert got == want, f'{what}: got {got}, expected {want}'
    checks += 1

# Do Now Q3: 4 of 200 DNA letters differ
eq(R(200 - 4, 200) * 100, 98, 'DN3'); eq(200 - 4, 196, 'DN3 step'); eq(R(4, 200) * 100, 2, 'DN3 wrong: 2 (the differences)')
# Do Now Q6: beak depth after the 1977 drought (from Natural Selection In Action)
eq(9.96 > 9.42, True, 'DN6: deeper')
# Worksheet Q8: 6 of 300 letters differ
eq(R(300 - 6, 300) * 100, 98, 'WS8'); eq(300 - 6, 294, 'WS8 step')
# Worksheet Q9: the fewest differences are the most closely related pair
d = {('P', 'Q'): 12, ('P', 'R'): 30, ('Q', 'R'): 28}
eq(min(d, key=d.get), ('P', 'Q'), 'WS9')
# Cold Call Q5: 99% is more alike than 90%
eq(99 > 90, True, 'CC5')
print(f'{checks} sympy checks passed')
