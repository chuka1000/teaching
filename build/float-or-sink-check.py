checks = 0
def ok(cond, msg):
    global checks
    assert cond, f'FAIL: {msg}'
    checks += 1
    print('ok:', msg)

WATER = 1.00
SEAWATER = 1.03
ICE = 0.92

def floats(obj, liquid): return obj < liquid

# Do Now
ok(40/8 == 5, 'Do Now Q2: 40/8 = 5 g/cm3')
ok(1 * 1000 == 1000, 'Do Now Q3: 1 g/cm3 = 1000 kg/m3')

# I Do 1 table
for name, d, want_float in [('steel', 7.9, False), ('aluminium', 2.70, False), ('oak wood', 0.85, True), ('cork', 0.25, True)]:
    ok(floats(d, WATER) == want_float, f'I Do 1: {name} ({d}) vs water: floats={floats(d, WATER)} want {want_float}')

# I Do 2
ok(floats(ICE, WATER), f'I Do 2: ice {ICE} < water {WATER}, floats')
ok(SEAWATER > WATER, 'I Do 2: seawater denser than fresh water')

# We Do
ok(not floats(3, WATER), 'We Do row 1: 3 g/cm3 sinks, claim (floats) is wrong')
ok(floats(0.95, WATER), 'We Do row 4: 0.95 g/cm3 floats, claim (sinks) is wrong')

# Cold Call
ok(not floats(2.70, WATER), 'Cold Call Q2: aluminium 2.70 sinks')
ok(floats(0.25, WATER), 'Cold Call Q3: cork 0.25 floats')

# Plenary
ok(not floats(0.95, WATER) == False, 'sanity')
ok(floats(0.95, WATER), 'Plenary Q5: 0.95 g/cm3 floats, claim (sinks) is FALSE')

# Worksheet
ok(floats(0.7, WATER), 'WS2: 0.7 g/cm3 floats')
ok(not floats(2.5, WATER), 'WS3: 2.5 g/cm3 sinks')
d5 = 54/20
ok(d5 == 2.7, f'WS5: 54/20 = {d5} g/cm3')
ok(not floats(d5, WATER), 'WS5: 2.7 g/cm3 sinks')
d8 = 45/90
ok(d8 == 0.5, f'WS8: 45/90 = {d8} g/cm3')
ok(floats(d8, WATER), 'WS8: hollow ball 0.5 g/cm3 floats')
ok(not floats(3.0, WATER), 'WS8: solid ball 3.0 g/cm3 sinks')
ok(not floats(1.01, WATER), 'WS10: 1.01 g/cm3 sinks in fresh water')
ok(floats(1.01, SEAWATER), 'WS10: 1.01 g/cm3 floats in seawater (1.03)')

print(f'\n{checks} checks passed')
