#!/usr/bin/env python3
"""
Independent check of the Numbers Drill game's generated questions (Numbers In Science, 7B). The
browser dumps N generated games (JSON, from build/test-numbers-in-science-game.js); this script
re-derives every answer from the DATA each question kept (the value, the significant figures, the
coefficient and exponent, the Celsius or Kelvin reading), and checks the rules: exactly one
correct option, no significant-figure answer is a whole number ending in 0 (the brief's AVOID
rule), the right skills in the right order (the ramp), the pool for questions 17 and 18, and that
games really differ from student to student.

    python3 build/check-numbers-in-science-game.py games.json
"""
import json, sys
from collections import Counter
from decimal import Decimal, ROUND_HALF_UP

games = json.load(open(sys.argv[1]))
checks = 0
def fail(msg): print('FAIL:', msg); sys.exit(1)
def ok(cond, msg):
    global checks
    if not cond: fail(msg)
    checks += 1

def round_sf(value, sf):
    if value == 0: return Decimal(0)
    d = Decimal(str(value))
    exp = d.adjusted()
    quant = Decimal(1).scaleb(exp - sf + 1)
    return d.quantize(quant, rounding=ROUND_HALF_UP)

def safe(d):
    """Not ambiguous: never a whole number ending in 0 (the brief's AVOID rule)."""
    return not (d == d.to_integral_value() and d != 0 and int(d) % 10 == 0)

def numtext(d):
    """The same plain-text formatting the game uses: no trailing zeros, no exponent."""
    s = format(d.normalize(), 'f')
    return s

KINDS = ['sigfig'] * 6 + ['toSN', 'toSN', 'toSN', 'fromSN', 'fromSN', 'fromSN']  # round 2 is drawn in a shuffled ORDER of 3+3, so check as a multiset instead
CATS = ['sf'] * 6 + ['sn'] * 6 + ['ck'] * 6
allowed17_18 = {'poolKelvinSN', 'poolRoundedC'}

def one_correct(q, where):
    o = q['options']
    ok(len(o) == 4 and len({x['text'] for x in o}) == 4, f'{where}: four different options')
    good = [i for i, x in enumerate(o) if x.get('tag') is None]
    ok(good == [q['correctIndex']], f'{where}: exactly one correct option and it is correctIndex ({good}, {q["correctIndex"]})')
    for i, x in enumerate(o):
        if i != q['correctIndex']: ok(x.get('tag') and x.get('msg'), f'{where}: wrong option {i} needs a tag and a message')

for code, qs in games.items():
    ok(len(qs) == 18, f'{code}: {len(qs)} questions')
    ok([q['cat'] for q in qs] == CATS, f'{code}: categories {[q["cat"] for q in qs]}')
    ok(all(q['kind'] == 'sigfig' for q in qs[:6]), f'{code}: round 1 is all sigfig')
    ok(Counter(q['kind'] for q in qs[6:12]) == Counter({'toSN': 3, 'fromSN': 3}), f'{code}: round 2 is three toSN and three fromSN')
    ok(Counter(q['kind'] for q in qs[12:16]) == Counter({'toK': 2, 'toC': 2}), f'{code}: round 3 (first four) is two toK and two toC')
    ok(qs[16]['kind'] in allowed17_18 and qs[17]['kind'] in allowed17_18 and qs[16]['kind'] != qs[17]['kind'],
       f'{code}: Q17/Q18 must be the two different pool templates ({qs[16]["kind"]}, {qs[17]["kind"]})')

    for q in qs:
        k = q['kind']; where = f"{code} R{q['round']}Q{q['n']} {k}"
        one_correct(q, where)
        good_text = q['options'][q['correctIndex']]['text']

        if k == 'sigfig':
            r = round_sf(q['value'], q['sf'])
            ok(safe(r), f'{where}: answer {r} is a whole number ending in 0 (the AVOID rule)')
            ok(numtext(r) == q['answer'] == good_text, f'{where}: answer should be {numtext(r)}, got {q["answer"]}/{good_text}')

        elif k == 'toSN':
            coeff, exp = Decimal(str(q['coeff'])), q['exp']
            ok(1 <= coeff < 10, f'{where}: coefficient {coeff} must be between 1 and 10')
            want = f'{coeff:.1f} × 10' + str(exp).translate(str.maketrans('0123456789-', '⁰¹²³⁴⁵⁶⁷⁸⁹⁻'))
            ok(good_text == want, f'{where}: correct option should be "{want}", got "{good_text}"')

        elif k == 'fromSN':
            coeff, exp = Decimal(str(q['coeff'])), q['exp']
            plain = (coeff * (Decimal(10) ** exp))
            ok(numtext(plain.normalize()) in good_text.replace(',', '') or good_text.replace(',', '') == numtext(plain), f'{where}: {coeff}x10^{exp} should read as {plain}, got "{good_text}"')

        elif k == 'toK':
            ok(good_text == f'{q["c"] + 273} K', f'{where}: {q["c"]} + 273 should be {q["c"] + 273} K, got {good_text}')

        elif k == 'toC':
            ok(good_text == f'{q["k"] - 273}°C', f'{where}: {q["k"]} - 273 should be {q["k"] - 273}°C, got {good_text}')

        elif k == 'poolKelvinSN':
            ok(good_text == f'{q["k"] - 273}°C', f'{where}: {q["k"]} - 273 should be {q["k"] - 273}°C, got {good_text}')

        elif k == 'poolRoundedC':
            c = Decimal(str(q['k'])) - 273
            r = round_sf(c, 2)
            ok(safe(r), f'{where}: rounded answer {r} is a whole number ending in 0 (the AVOID rule)')
            ok(r != c, f'{where}: rounding to 2 s.f. must actually change the value ({c} -> {r})')
            ok(good_text == numtext(r) + '°C', f'{where}: answer should be {numtext(r)}°C, got {good_text}')

        else:
            fail(f'{where}: unknown kind')

print(f'{len(games)} generated games, {checks} checks passed')

q17 = Counter(qs[16]['kind'] for qs in games.values()); q18 = Counter(qs[17]['kind'] for qs in games.values())
print('Q17 kinds:', dict(q17), ' Q18 kinds:', dict(q18)); ok(len(q17) == 2 and len(q18) == 2, 'every pool item appears in both slots')
sigs = Counter(tuple(q['disp'] for q in qs) for qs in games.values()); print(f'distinct games: {len(sigs)} of {len(games)}'); ok(len(sigs) == len(games), 'two students got exactly the same game')
first = Counter(qs[0]['disp'] for qs in games.values()); print(f'distinct Q1: {len(first)}; most common appears {first.most_common(1)[0][1]} times in {len(games)}')
last = Counter(qs[17]['disp'] for qs in games.values()); print(f'distinct Q18: {len(last)}; most common appears {last.most_common(1)[0][1]} times in {len(games)}')
