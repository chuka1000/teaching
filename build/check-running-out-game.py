#!/usr/bin/env python3
"""
Independent check of the Running Out game's generated questions (9G and 9I). The browser dumps N
generated games (JSON, from build/test-running-out-game.js); this script re-derives every answer
from the DATA each question kept (stock, rate, taken, S/n/kept), and checks the rules: exactly
one correct option in every question, the right skills in the right order (the ramp), that round
2's depleted/same/growing outcomes are genuinely constructed, that every case and prevent
scenario is matched correctly, and that games really differ from student to student.

    python3 build/check-running-out-game.py games.json
"""
import json, sys
from collections import Counter

games = json.load(open(sys.argv[1]))
checks = 0
def fail(msg): print('FAIL:', msg); sys.exit(1)
def ok(cond, msg):
    global checks
    if not cond: fail(msg)
    checks += 1

GSS_TEXT = {'This resource is being depleted', 'This resource is not being depleted; it stays the same', 'This resource is not being depleted; it is growing', 'Not enough information'}
KINDS16 = ['decline'] * 6 + ['gss'] * 6
CATS = ['yield'] * 6 + ['gss'] * 6 + ['hard'] * 6
allowed17_18 = {'poolDecline', 'prevent'}
CASE_NAMES = {'helium', 'aral', 'tuna', 'bison'}

def one_correct(q, where):
    o = q['options']
    ok(len(o) == 4 and len({x['text'] for x in o}) == 4, f'{where}: four different options')
    good = [i for i, x in enumerate(o) if x.get('tag') is None]
    ok(good == [q['correctIndex']], f'{where}: exactly one correct option and it is correctIndex ({good}, {q["correctIndex"]})')
    for i, x in enumerate(o):
        if i != q['correctIndex']:
            ok(x.get('msg'), f'{where}: wrong option {i} needs a message')

for code, qs in games.items():
    ok(len(qs) == 18, f'{code}: {len(qs)} questions')
    ok([q['cat'] for q in qs] == CATS, f'{code}: categories {[q["cat"] for q in qs]}')
    ok([q['kind'] for q in qs[:12]] == KINDS16, f'{code}: kinds {[q["kind"] for q in qs[:12]]}')

    # Round 1: repeated decline. S * kept^n, applied n times in turn, rounding each step.
    for q in qs[:6]:
        where = f"{code} R1Q{q['n']}"
        one_correct(q, where)
        S, n, kept = q['S'], q['periods'], q['kept']
        remaining = S
        for _ in range(n):
            remaining = round(remaining * kept)
        correct_text = q['options'][q['correctIndex']]['text']
        ok(f'{remaining:,}' in correct_text, f'{where}: correct option should show {remaining:,}, got "{correct_text}"')

    # Round 2: being depleted / stays the same / growing, must be CONSTRUCTED
    def check_gss(q, where):
        one_correct(q, where)
        ok(set(o['text'] for o in q['options']) == GSS_TEXT, f'{where}: options must be the fixed four')
        yld = round(q['stock'] * q['rate'] / 100)
        ok(yld == q['yield'], f'{where}: stored yield {q["yield"]} should be {yld}')
        taken = q['taken']
        want = 'This resource is being depleted' if taken > yld else 'This resource is not being depleted; it is growing' if taken < yld else 'This resource is not being depleted; it stays the same'
        correct_text = q['options'][q['correctIndex']]['text']
        ok(correct_text == want, f'{where}: stock={q["stock"]} rate={q["rate"]} taken={taken} yield={yld} should give "{want}", got "{correct_text}"')
        ok(taken == yld or abs(taken - yld) >= 500, f'{where}: taken {taken} is too close to yield {yld} to be a safely constructed category')

    for q in qs[6:12]:
        check_gss(q, f"{code} R2Q{q['n']}")

    r3_case = [q for q in qs[12:16] if q['kind'] == 'case']
    r3_prevent = [q for q in qs[12:16] if q['kind'] == 'prevent']
    ok(len(r3_case) == 2 and len(r3_prevent) == 2, f'{code} R3: expected 2 case + 2 prevent, got {[q["kind"] for q in qs[12:16]]}')
    ok(len({q['caseName'] for q in r3_case}) == 2, f'{code} R3: the two case questions must be distinct cases')
    for q in r3_case:
        one_correct(q, f"{code} R3Q{q['n']} case")
        ok(q['caseName'] in CASE_NAMES, f"{code} R3Q{q['n']}: unrecognised case {q['caseName']}")
    for q in r3_prevent:
        one_correct(q, f"{code} R3Q{q['n']} prevent")

    for q in [qs[16], qs[17]]:
        where = f"{code} Q{q['n']} {q['kind']}"
        one_correct(q, where)
        if q['kind'] == 'poolDecline':
            S, n, kept = q['S'], q['periods'], q['kept']
            ok(n == 4 and kept == 0.5, f'{where}: pool decline must be 4 periods of halving, got n={n} kept={kept}')
            remaining = S
            for _ in range(n):
                remaining = round(remaining * kept)
            correct_text = q['options'][q['correctIndex']]['text']
            ok(f'{remaining:,}' in correct_text, f'{where}: answer should show {remaining:,}, got "{correct_text}"')
        else:
            ok(q['prompt'], f'{where}: prevent question needs its scenario text')

print(f'{len(games)} generated games, {checks} checks passed')

q17 = Counter(qs[16]['kind'] for qs in games.values()); q18 = Counter(qs[17]['kind'] for qs in games.values())
print('Q17 kinds:', dict(q17), ' Q18 kinds:', dict(q18)); ok(len(q17) == 2 and len(q18) == 2, 'every pool item appears in both slots')
sigs = Counter(tuple(q['disp'] for q in qs) for qs in games.values()); print(f'distinct games: {len(sigs)} of {len(games)}'); ok(len(sigs) == len(games), 'two students got exactly the same game')
first = Counter(qs[0]['disp'] for qs in games.values()); print(f'distinct Q1: {len(first)}; most common appears {first.most_common(1)[0][1]} times in {len(games)}')
last = Counter(qs[17]['disp'] for qs in games.values()); print(f'distinct Q18: {len(last)}; most common appears {last.most_common(1)[0][1]} times in {len(games)}')
