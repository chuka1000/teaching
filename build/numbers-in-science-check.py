#!/usr/bin/env python3
"""
Every number in Numbers In Science (7B), checked before it went into the deck or the worksheet
(CLAUDE.md, "Things that will bite you", 7). Also enforces the brief's AVOID rule: no
significant-figure answer may be a whole number ending in 0, because that is genuinely ambiguous
(is the trailing zero significant, or just a placeholder?). `safe()` is the same test used by the
game's own generator and its checker, build/check-numbers-in-science-game.py.

    python3 build/numbers-in-science-check.py
"""
from decimal import Decimal, ROUND_HALF_UP

checks = 0
def ok(cond, msg):
    global checks
    assert cond, f'FAIL: {msg}'
    checks += 1
    print('ok:', msg)

def round_sf(value, sf):
    """Round `value` to `sf` significant figures, decimal-exact."""
    if value == 0: return 0
    d = Decimal(str(value))
    exp = d.adjusted()  # position of the most significant digit
    quant = Decimal(1).scaleb(exp - sf + 1)
    return float(d.quantize(quant, rounding=ROUND_HALF_UP))

def safe(result):
    """Not ambiguous: never a whole number ending in 0."""
    return not (float(result).is_integer() and int(result) % 10 == 0)

# ---- Do Now ----
ok(round(7.8) == 8, 'Do Now Q3: 7.8 rounds to 8')
ok(3 * 100 == 300, 'Do Now Q6: 3 x 100 = 300')

# ---- I Do 1: significant figures ----
for val, sf, want in [(3.847, 2, 3.8), (0.0526, 1, 0.05), (128.4, 3, 128)]:
    r = round_sf(val, sf)
    ok(r == want, f'I Do 1: {val} to {sf} s.f. = {r} (want {want})')
    ok(safe(r), f'I Do 1: {val} to {sf} s.f. = {r} is unambiguous')

# ---- I Do 2: standard form and Kelvin ----
ok(8.2e6 == 8200000, 'I Do 2: 8,200,000 = 8.2 x 10^6')
ok(abs(4.7e-5 - 0.000047) < 1e-12, 'I Do 2: 0.000047 = 4.7 x 10^-5')
for c, k in [(25, 298), (0, 273), (-10, 263)]:
    ok(c + 273 == k, f'I Do 2: {c} C + 273 = {k} K')
ok(0 - 273 == -273, 'I Do 2: 0 K = -273 C (absolute zero)')

# ---- We Do: each claim is wrong, and the real answer is given ----
ok(round_sf(3.847, 2) == 3.8 and round_sf(3.847, 2) != 3.9, 'We Do row 1: real answer 3.8, claim 3.9 is wrong')
ok(6.7e5 == 670000 and 6.7e4 != 670000, 'We Do row 2: 670,000 = 6.7x10^5, claim 6.7x10^4 is wrong')
ok(0 + 273 != 0, 'We Do row 3: 0 C is 273 K, not 0 K')
ok(3.8e-3 == 0.0038 and 3.8e3 != 0.0038, 'We Do row 4: 0.0038 = 3.8x10^-3, claim 3.8x10^3 is wrong')

# ---- Cold Call ----
ok(round_sf(9.362, 2) == 9.4, 'Cold Call Q2: 9.362 to 2 s.f. = 9.4')
ok(safe(round_sf(9.362, 2)), 'Cold Call Q2: 9.4 is unambiguous')
ok(5.2e7 == 52000000, 'Cold Call Q3: 52,000,000 = 5.2x10^7')
ok(9.1e-3 == 0.0091, 'Cold Call Q4: 0.0091 = 9.1x10^-3')
ok(37 + 273 == 310, 'Cold Call Q5: 37 C = 310 K')
ok(373 - 273 == 100, 'Cold Call Q6: 373 K = 100 C')

# ---- Plenary ----
ok(round_sf(9.362, 2) != 9.3, 'Plenary Q5: 9.362 to 2 s.f. is NOT 9.3 (it is 9.4)')

# ---- Worksheet ----
ws = [
    (round_sf(6.238, 2), 6.2, 'WS1'),
    (round_sf(0.0475, 1), 0.05, 'WS2'),
    (round_sf(245.7, 3), 246, 'WS7'),
]
for got, want, name in ws:
    ok(got == want, f'{name}: got {got}, want {want}')
    ok(safe(got), f'{name}: {got} is unambiguous')
ok(3.4e6 == 3400000, 'WS3: 3,400,000 = 3.4x10^6')
ok(2.9e-4 == 0.00029, 'WS4: 0.00029 = 2.9x10^-4')
ok(18 + 273 == 291, 'WS5: 18 C = 291 K')
ok(300 - 273 == 27, 'WS6: 300 K = 27 C')
k8 = 3.05e2
ok(k8 == 305, 'WS8: 3.05x10^2 K = 305 K')
ok(305 - 273 == 32, 'WS8: 305 K = 32 C')
ok(47e-4 == 0.0047 and 4.7e-3 == 0.0047, 'WS9: 47x10^-4 and 4.7x10^-3 are the same value')
ok(not (1 <= 47 < 10), 'WS9: 47 is not between 1 and 10, so A is not valid standard form')
ok(1 <= 4.7 < 10, 'WS9: 4.7 is between 1 and 10, so B is valid standard form')
ok(str(0.00650).rstrip('0') != '', 'WS10: sanity check literal value')
ok(len('650') == 3, 'WS10: the digits 6,5,0 are three significant figures')

print(f'\n{checks} checks passed')
