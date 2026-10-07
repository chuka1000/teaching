checks = 0
def ok(cond, msg):
    global checks
    assert cond, f'FAIL: {msg}'
    checks += 1
    print('ok:', msg)

# Do Now Q3
before, after = 500000, 50000
pct = (before - after) / before * 100
ok(pct == 90, f'Do Now Q3: {pct}% decrease')

# Hook: humpback whales, Western South Atlantic (ScienceNews / Marine Mammal Science journal)
before_w, after_w = 450, 25000
ok(after_w > before_w, 'Hook: whale population today exceeds 1950s level')
options = {'A': 2000, 'B': 25000, 'C': 100000}
closest = min(options, key=lambda k: abs(options[k] - after_w))
ok(closest == 'B', f'Hook: option B (about 25,000) is the closest to the real figure, got {closest}')

# I Do 2: sustainable yield example
stock, rate = 200000, 10
yield_ = stock * rate / 100
ok(yield_ == 20000, f'I Do 2: {stock} x {rate}% = {yield_} tonnes')

# Cold Call Q3
stock2, rate2 = 300000, 8
yield2 = stock2 * rate2 / 100
ok(yield2 == 24000, f'Cold Call Q3: {stock2} x {rate2}% = {yield2} tonnes')

# Worksheet
ok(150000 * 6 / 100 == 9000, 'WS3: 150,000 x 6% = 9,000')
y5 = 80000 * 5 / 100
ok(y5 == 4000, 'WS5 yield: 80,000 x 5% = 4,000')
ok(3000 < y5, 'WS5: cut 3,000 < yield 4,000, grows')
y8 = 120000 * 5 / 100
ok(y8 == 6000, 'WS8 yield: 120,000 x 5% = 6,000')
ok(9000 > y8, 'WS8: catch 9,000 > yield 6,000, shrinks')
ok(60000 / 2000 == 30, 'WS9: 60,000 / 2,000 = 30 years')

print(f'\n{checks} checks passed')
