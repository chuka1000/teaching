checks = 0
def ok(cond, msg):
    global checks
    assert cond, f'FAIL: {msg}'
    checks += 1
    print('ok:', msg)

# Do Now
ok(round(6.4) == 6, 'Do Now Q4: 6.4 rounds to 6')

# Worksheet Q5: accurate and precise
r5 = [20.1, 20.0, 19.9]; t5 = 20.0
mean5 = sum(r5) / len(r5)
spread5 = max(r5) - min(r5)
ok(abs(mean5 - t5) < 1e-9, f'WS5: mean {mean5} equals true value {t5} (accurate)')
ok(spread5 <= 0.3, f'WS5: spread {spread5:.2f} is tight (precise)')

# Worksheet Q6: accurate, not precise
r6 = [12.8, 15.3, 17.8]; t6 = 15.3
mean6 = sum(r6) / len(r6)
spread6 = max(r6) - min(r6)
ok(abs(mean6 - t6) < 1e-9, f'WS6: mean {mean6} equals true value {t6} (accurate)')
ok(spread6 >= 2.0, f'WS6: spread {spread6:.2f} is wide (not precise)')

# Worksheet Q9: Student A (accurate and precise) vs Student B (precise, not accurate)
a = [99, 100, 101, 99, 101]; t9 = 100
meanA = sum(a) / len(a); spreadA = max(a) - min(a)
ok(meanA == t9, f'WS9 A: mean {meanA} equals true value {t9}')
ok(spreadA <= 2, f'WS9 A: spread {spreadA} is tight')

b = [97, 97, 98, 97, 98]
meanB = sum(b) / len(b); spreadB = max(b) - min(b)
ok(abs(meanB - t9) >= 2, f'WS9 B: mean {meanB} is clearly displaced from true value {t9}')
ok(spreadB <= 2, f'WS9 B: spread {spreadB} is tight (precise, despite being inaccurate)')

print(f'\n{checks} checks passed')
