#!/usr/bin/env python3
"""
Independent check of the Sustainable Yield game's generated questions (Making It Last, 9G and
9I). The browser dumps N generated games (JSON, from build/test-making-it-last-game.js); this
script re-derives every answer and every line of working from the DATA each question kept
(stock, rate, taken, loss), and checks the rules: exactly one correct option in every question,
the right skills in the right order (the ramp), that round 2's grows/shrinks/stays-the-same
outcomes are genuinely constructed (never a coincidence of rounding), and that games really
differ from student to student.

    python3 build/check-making-it-last-game.py games.json
"""
import json, sys
from collections import Counter
from sympy import sympify

games = json.load(open(sys.argv[1]))
checks = 0
def fail(msg): print('FAIL:', msg); sys.exit(1)
def ok(cond, msg):
    global checks
    if not cond: fail(msg)
    checks += 1
def num(s): return sympify(str(s).replace(',', '').replace('×', '*').replace('÷', '/').replace('×', '*').replace('÷', '/').replace(' tonnes', '').replace(' hectares', '').replace(' deer', '').replace(' whales', '').replace(' years', ''))

GSS_TEXT = {'The stock grows', 'The stock shrinks', 'The stock stays the same', 'Not enough information'}
KINDS16 = ['yield'] * 6 + ['gss'] * 6
CATS = ['yield'] * 6 + ['gss'] * 6 + ['hard'] * 6
allowed17_18 = {'poolYears', 'method'}

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
    ok(qs[16]['kind'] in allowed17_18 and qs[17]['kind'] in allowed17_18 and qs[16]['kind'] != qs[17]['kind'],
       f'{code}: Q17/Q18 must be the two different pool templates ({qs[16]["kind"]}, {qs[17]["kind"]})')

    # Round 1: sustainable yield = stock * rate / 100
    for q in qs[:6]:
        where = f"{code} R1Q{q['n']}"
        one_correct(q, where)
        yld = q['stock'] * q['rate'] / 100
        correct_text = q['options'][q['correctIndex']]['text']
        ok(str(round(yld)) .replace(',', '') in correct_text.replace(',', ''), f'{where}: correct option should show {round(yld)}, got "{correct_text}"')
        for line in q['explain']:
            parts = line.rstrip('.').split(' = ')
            ok(num(parts[0]) == num(parts[-1]), f'{where}: explain line "{line}" does not check out')

    # Round 2: grows / shrinks / stays the same, must be CONSTRUCTED (never a rounding coincidence)
    def check_gss(q, where):
        one_correct(q, where)
        ok(set(o['text'] for o in q['options']) == GSS_TEXT, f'{where}: options must be the fixed four')
        yld = round(q['stock'] * q['rate'] / 100)
        ok(yld == q['yield'], f'{where}: stored yield {q["yield"]} should be {yld}')
        taken = q['taken']
        want = 'The stock grows' if taken < yld else 'The stock shrinks' if taken > yld else 'The stock stays the same'
        correct_text = q['options'][q['correctIndex']]['text']
        ok(correct_text == want, f'{where}: stock={q["stock"]} rate={q["rate"]} taken={taken} yield={yld} should give "{want}", got "{correct_text}"')
        # the margin between taken and yield must never be razor-thin (never a rounding coincidence)
        ok(taken == yld or abs(taken - yld) >= 500, f'{where}: taken {taken} is too close to yield {yld} to be a safely constructed category')

    for q in qs[6:12]:
        check_gss(q, f"{code} R2Q{q['n']}")
    r3_gss = [q for q in qs[12:16] if q['kind'] == 'gss']
    r3_method = [q for q in qs[12:16] if q['kind'] == 'method']
    ok(len(r3_gss) == 2 and len(r3_method) == 2, f'{code} R3: expected 2 gss + 2 method, got {[q["kind"] for q in qs[12:16]]}')
    for q in r3_gss:
        check_gss(q, f"{code} R3Q{q['n']}")
        ok(q['options'][q['correctIndex']]['text'] in ('The stock grows', 'The stock shrinks'), f"{code} R3Q{q['n']}: hard gss items must be grows/shrinks, not equal/not-enough-info")
    for q in r3_method:
        one_correct(q, f"{code} R3Q{q['n']} method")

    for q in [qs[16], qs[17]]:
        where = f"{code} Q{q['n']} {q['kind']}"
        one_correct(q, where)
        if q['kind'] == 'poolYears':
            stock, loss = q['stock'], q['loss']
            ok(stock % loss == 0, f'{where}: stock {stock} must divide evenly by loss {loss}')
            years = stock // loss
            correct_text = q['options'][q['correctIndex']]['text']
            ok(correct_text == f'{years} years', f'{where}: answer should be {years} years, got "{correct_text}"')
        else:
            ok(q['scenario'], f'{where}: method question needs its scenario text')

print(f'{len(games)} generated games, {checks} checks passed')

q17 = Counter(qs[16]['kind'] for qs in games.values()); q18 = Counter(qs[17]['kind'] for qs in games.values())
print('Q17 kinds:', dict(q17), ' Q18 kinds:', dict(q18)); ok(len(q17) == 2 and len(q18) == 2, 'every pool item appears in both slots')
sigs = Counter(tuple(q['disp'] for q in qs) for qs in games.values()); print(f'distinct games: {len(sigs)} of {len(games)}'); ok(len(sigs) == len(games), 'two students got exactly the same game')
first = Counter(qs[0]['disp'] for qs in games.values()); print(f'distinct Q1: {len(first)}; most common appears {first.most_common(1)[0][1]} times in {len(games)}')
last = Counter(qs[17]['disp'] for qs in games.values()); print(f'distinct Q18: {len(last)}; most common appears {last.most_common(1)[0][1]} times in {len(games)}')
