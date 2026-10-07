checks = 0
def ok(cond, msg):
    global checks
    assert cond, f'FAIL: {msg}'
    checks += 1
    print('ok:', msg)

# Do Now Q1: sustainable amount
ok(70000 * 4 / 100 == 2800, 'Do Now Q1: 70,000 x 4% = 2,800 hectares')

# Do Now Q3: repeated decline, loses a third (keeps 2/3) every 5 years, after 10 years (2 periods)
v = 90000
v = v * 2 / 3
ok(v == 60000, 'Do Now Q3 period 1: 90,000 x 2/3 = 60,000')
v = v * 2 / 3
ok(v == 40000, 'Do Now Q3 period 2: 60,000 x 2/3 = 40,000')

# Cold Call Q3: repeated decline, loses half every year, after 3 years
v = 160000
for i in range(3):
    v = v / 2
ok(v == 20000, 'Cold Call Q3: 160,000 halved 3 times = 20,000')

# I Do 1 / Hook fact: passenger pigeon population and extinction (verified by web search:
# thecollector.com, Scientific American, Cincinnati Zoo). 3-5 billion before hunting, extinct by
# 1914 (Martha, Cincinnati Zoo, 1 Sept 1914).
pop_before = 3_000_000_000
pop_1914 = 0
ok(pop_1914 == 0, 'Hook: passenger pigeons extinct (0) by 1914')
options = {'A': 1_000_000, 'B': 1_000, 'C': 0}
ok(min(options, key=lambda k: abs(options[k] - pop_1914)) == 'C', 'Hook: option C (zero) is correct')

# Worksheet Q3: loses half every year, after 2 years
v = 40000
for i in range(2):
    v = v / 2
ok(v == 10000, 'WS3: 40,000 halved twice = 10,000')

# Worksheet Q5: seal colony, sustainable yield vs taken
stock, rate, taken = 50000, 4, 2500
yld = stock * rate / 100
ok(yld == 2000, f'WS5 yield: {stock} x {rate}% = {yld}')
ok(taken > yld, 'WS5: 2,500 taken > 2,000 yield, so the colony is being depleted')

# Worksheet Q8: loses a fifth (keeps 4/5) every year, after 3 years
v = 250000
for i in range(3):
    v = v * 4 / 5
ok(v == 128000, 'WS8: 250,000 x 0.8^3 = 128,000')

# Worksheet Q9: fish stock, sustainable yield vs taken
stock2, rate2, taken2 = 90000, 6, 7000
yld2 = stock2 * rate2 / 100
ok(yld2 == 5400, f'WS9 yield: {stock2} x {rate2}% = {yld2}')
ok(taken2 > yld2, 'WS9: 7,000 taken > 5,400 yield, so the stock is being depleted')

# Facts verified by web search, used in We Do / Cold Call:
# - Helium: non-renewable (forms by radioactive decay far slower than extracted); global shortage,
#   prices risen sharply; hospitals ration liquid helium for MRI scanners over party balloons.
#   (rockymountainair.com, greenmatters.com, theindianpractitioner.com)
# - Aral Sea: lost over 90% of its volume since the 1960s after rivers were diverted for irrigation;
#   commercial fishing ended completely (1982); thousands of fishing jobs were lost.
#   (thenationalnews.com, nomadicbackpacker.com)
# - Atlantic bluefin tuna: stocks fell ~60% 1997-2007 from overfishing; strict ICCAT quotas
#   introduced; a single large tuna sold for a record $3.2 million at Tokyo's Toyosu market (Jan
#   2026). (cnn.com, nbcnews.com)
# - American bison: ~60-70 million in 1853, reduced to a few hundred by 1889; Indigenous Plains
#   nations depended on bison for food, tools and shelter, and lost their primary resource.
#   (ebsco.com, smea.uw.edu)

print(f'\n{checks} checks passed')
