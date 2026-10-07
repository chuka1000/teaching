#!/usr/bin/env python3
"""
Every number in the What The Earth Gives Us deck and worksheet, checked with sympy before it went
into either file (CLAUDE.md, "Things that will bite you", 7).

    python3 build/what-the-earth-gives-us-check.py
"""
from sympy import Rational, nsimplify

ok_count = 0
def ok(cond, msg):
    global ok_count
    assert cond, f'FAIL: {msg}'
    ok_count += 1
    print('ok:', msg)

# ---- Do Now Q2: 30% to 45%, increase in percentage points ----
before, after = 30, 45
ok(after - before == 15, f'Do Now Q2: {after} - {before} = 15 percentage points')

# ---- Hook: the Grand Banks cod stock, 1962 to 1992 ----
# Spawning biomass fell from about 1.6 million tonnes (1962) to about 110,000 tonnes (1992).
# Source: Collapse of the Atlantic northwest cod fishery (Wikipedia); Britannica, "cod fishery
# collapse of 1992". Checked the percentage fall is genuinely close to what the slide implies
# (a steep, surprising drop), and that none of the three options is closer to the true value.
before_t, after_t = Rational(16, 10) * 10**6, 110_000
fall_pct = (before_t - after_t) / before_t * 100
ok(89 < float(fall_pct) < 95, f'Hook: 1.6 million to 110,000 tonnes is a {float(fall_pct):.1f}% fall (expected roughly 90-95%)')
options = {'A': 1_000_000, 'B': 500_000, 'C': 110_000}
closest = min(options, key=lambda k: abs(options[k] - after_t))
ok(closest == 'C', f'Hook: closest option to the real 1992 figure is {closest} (must be C)')

# ---- I Do 2 / worksheet Q7: the Ogallala Aquifer's recharge and pumping rates ----
# Recharge supplies roughly 15% of current pumping in the hardest-hit parts of the aquifer, i.e.
# pumping is roughly 1/0.15 =~ 6.7x recharge there; more broadly, sources describe pumping at
# 1.5 to 3x recharge. The deck states "1.5 to 3 times faster", which is the conservative, broadly
# sourced figure (K-State Sunflower District; USDA Climate Hubs). The worksheet's own numbers
# (20,000 recharge, 55,000 pumped) are invented for a clean calculation, not read off a source, so
# check only that they are internally consistent with "pumped faster than it recharges" and land
# in the same 1.5-3x range the deck states, so the two do not contradict each other.
recharge, pumped = 20_000, 55_000
ratio = Rational(pumped, recharge)
ok(pumped > recharge, 'I Do 2 / worksheet Q7: pumped exceeds recharge')
ok(Rational(3, 2) <= ratio <= 3, f'worksheet Q7: pumping is {float(ratio):.2f}x recharge, inside the "1.5 to 3 times faster" the deck states')
diff = pumped - recharge
ok(diff == 35_000, f'worksheet Q7 answer: {pumped} - {recharge} = {diff} million litres a year')

# ---- worksheet Q9 / Cold Call precedent: maximum sustainable yield ----
stock, growth_pct = 40_000, 5
yield_ = stock * Rational(growth_pct, 100)
ok(yield_ == 2000, f'worksheet Q9 answer: {stock} x {growth_pct}% = {yield_} tonnes')

# ---- 500 to 1,300 years to refill a drained aquifer (stated fact, not computed; checked only for
#      internal consistency: a range, both ends positive, upper > lower) ----
lo, hi = 500, 1300
ok(0 < lo < hi, 'I Do 2: "500 to 1,300 years to refill" is a well-formed range')

print(f'\n{ok_count} checks passed')
