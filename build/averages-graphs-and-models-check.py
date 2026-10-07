"""
Checks every number in Averages, Graphs And Models (the deck, the worksheet and its answers).
The ramp results are FABRICATED (see the data file). Means, ranges, the line of best fit and the
predictions are recomputed here with sympy, independently of the JavaScript, and the printed
answers are compared with them.

    python3 build/averages-graphs-and-models-check.py
"""
import json, subprocess, pathlib
from sympy import Rational, symbols, Eq, solve, sympify
HERE = pathlib.Path(__file__).parent
D = json.load(open(HERE / 'averages-graphs-and-models.data.json'))
checks = 0
def ok(cond, msg):
    global checks
    assert cond, f'FAIL: {msg}'
    checks += 1
    print('ok:', msg)

H, T = D['heights'], D['trials']
means = [Rational(sum(t), len(t)) for t in T]
ranges = [max(t) - min(t) for t in T]
ok(all(m.q == 1 for m in means), f'every mean is a whole number: {[int(m) for m in means]}')
ok([int(m) for m in means] == [44, 80, 115, 154, 191], 'means 44, 80, 115, 154, 191')
ok(ranges == [3, 5, 6, 8, 7], f'ranges {ranges}')
ok(ranges.index(min(ranges)) == 0 and ranges.count(min(ranges)) == 1, 'the smallest range is at 10 cm only (worksheet Q3)')
ok(all(len(t) == 3 for t in T), 'three trials per height')
# the means rise steadily: a straight-line model is honest
diffs = [means[i + 1] - means[i] for i in range(4)]
ok(all(34 <= d <= 40 for d in diffs), f'steady rise per 10 cm: {[int(d) for d in diffs]}')

# least-squares line through the five means
n = 5; mx = Rational(sum(H), n); my = sum(means) / n
slope = sum((x - mx) * (y - my) for x, y in zip(H, means)) / sum((x - mx) ** 2 for x in H)
icpt = my - slope * mx
ok(slope == Rational(92, 25) and icpt == Rational(32, 5), f'line of best fit d = {float(slope)}h + {float(icpt)}')
ok(all(abs(slope * h + icpt - m) <= 2 for h, m in zip(H, means)), 'every mean is within 2 cm of the line')
p35, p100 = slope * 35 + icpt, slope * 100 + icpt
ok(130 <= p35 <= 140 and round(p35) == 135, f'35 cm predicts {float(p35)} (accept 130 to 140)')
ok(350 <= p100 <= 400 and round(p100) == 374, f'100 cm predicts {float(p100)} (accept 350 to 400)')

# thermometers (I Do 1): true value 100
Th = D['thermometers']
tm = {k: Rational(sum(v), 3) for k, v in Th.items()}; tr = {k: max(v) - min(v) for k, v in Th.items()}
ok(tm == {'A': 100, 'B': 96, 'C': 100} and tr == {'A': 2, 'B': 2, 'C': 12}, f'thermometers: means {dict(tm)}, ranges {tr}')
ok(tm['A'] == 100 and tr['A'] == tr['B'] and tm['B'] != 100 and tr['C'] > tr['A'] and tm['C'] == 100, 'A accurate and precise, B precise but not accurate, C accurate (mean) but not precise')

# Do Now
ok(Rational(12 + 15 + 18, 3) == 15, 'Do Now Q2: mean of 12, 15, 18 is 15')
ok(sympify('0.00072') == sympify('7.2e-4'), 'Do Now Q1: 0.00072 = 7.2 x 10^-4')
ok(len('405'.lstrip('0')) == 3, 'Do Now Q4: 0.0405 has 3 significant figures (4, 0, 5)')
# We Do
ok(Rational(4 + 7 + 13, 3) == 8 and 4 + 7 + 13 == 24, 'We Do row 1: 4, 7, 13 total 24, mean 8')
# Cold Call
ok(Rational(5 + 8 + 9 + 14, 4) == 9, 'Cold Call Q1: mean of 5, 8, 9, 14 is 9')
ok(max(23, 31, 27, 19) - min(23, 31, 27, 19) == 12, 'Cold Call Q2: range of 23, 31, 27, 19 is 12')
ok(78 + 21 + 1 == 100, 'Cold Call Q4: air is about 78% + 21% + 1% = 100% (pie chart)')

# the printed answers agree with all of the above
out = subprocess.check_output(['node', '-e', "const a=require('./build/averages-graphs-and-models-answers.js');console.log(JSON.stringify(a))"], cwd=HERE.parent).decode()
ans = {k: v for k, v in json.loads(out)}
ok('44, 80, 115, 154 and 191' in ans['1'] and '(45 + 42 + 45) ÷ 3 = 44' in ans['1'], 'answer 1')
ok('3, 5, 6, 8 and 7' in ans['2'] and '45 − 42 = 3' in ans['2'], 'answer 2')
ok('10 cm' in ans['3'] and 'range, 3 cm' in ans['3'], 'answer 3')
ok('(10, 44), (20, 80), (30, 115), (40, 154), (50, 191)' in ans['6'], 'answer 6 points')
ok('About 135 cm' in ans['8'] and 'About 374 cm' in ans['9'], 'answers 8 and 9 predictions')
print(f'\n{checks} checks passed')
