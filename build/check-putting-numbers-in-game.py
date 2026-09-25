#!/usr/bin/env python3
"""
Independent check of the game's generated questions. The browser dumps N
generated games (JSON, from build/test-putting-numbers-in-game.js); this script
re-derives every answer, every known-mistake value and every worked line with
sympy, and checks the rules: positive whole numbers only, no division, nothing
over four digits, and that games really differ from student to student.

    python3 build/check-putting-numbers-in-game.py games.json
"""
import json, re, sys
from collections import Counter
from sympy import sympify
from sympy.parsing.sympy_parser import parse_expr, standard_transformations, implicit_multiplication_application

T = standard_transformations + (implicit_multiplication_application,)
games = json.load(open(sys.argv[1]))
checks = 0

def num(s):
    return sympify(s.replace('×', '*').replace('−', '-'))

def fail(msg): print('FAIL:', msg); sys.exit(1)

for code, qs in games.items():
    if len(qs) != 18: fail(f'{code}: {len(qs)} questions')
    cats = [q['cat'] for q in qs]
    want = (['onestep'] * 6 + ['order'] * 3 + ['bracket'] * 3 + ['letters'] * 4 + ['bracket'] * 2)
    if cats != want: fail(f'{code}: category order {cats}')
    for q in qs:
        where = f"{code} R{q['round']}Q{q['n']} {q['formula']} {q['subs']}"
        # the answer, from the formula as a student would read it
        expr = parse_expr(q['formula'].replace('−', '-'), transformations=T)
        val = expr.subs({sym: q['subs'][str(sym)] for sym in expr.free_symbols})
        if int(val) != val or int(val) != q['answer']: fail(f'{where}: formula gives {val}, answer says {q["answer"]}')
        if not (0 < q['answer'] <= 9999): fail(f'{where}: answer {q["answer"]} out of range')
        if '÷' in q['formula'] or '/' in q['formula'] or '.' in q['formula']: fail(f'{where}: division or decimal in formula')
        if set(q['subs']) != {str(s) for s in expr.free_symbols}: fail(f'{where}: substitutions do not match the letters')
        if not all(isinstance(v, int) and 2 <= v <= 25 for v in q['subs'].values()): fail(f'{where}: substitution out of range')
        # the worked line: every side of every "=" is the same whole positive number
        parts = q['worked'].split(' = ')
        vals = [num(p) for p in parts]
        if not all(v == vals[0] for v in vals) or int(vals[-1]) != q['answer']: fail(f'{where}: worked line {q["worked"]}')
        if any(v < 0 for v in vals) or re.search(r'−\s*\d+\s*(?:=|$)', '') : fail(f'{where}: negative in working')
        # every known mistake: its stated sum really gives the value, and it is not the answer
        for value, w in q['wrong'].items():
            if num(w['how']) != int(value): fail(f'{where}: mistake {w["tag"]} "{w["how"]}" is not {value}')
            if int(value) == q['answer'] or int(value) <= 0: fail(f'{where}: mistake equals the answer or is not positive')
            checks += 1
        checks += 4
    # no letter clash inside a question
print(f'{len(games)} generated games, {checks} checks passed')

# variation between students
sigs = Counter(tuple((q['formula'], tuple(q['subs'].items())) for q in qs) for qs in games.values())
print(f'distinct games: {len(sigs)} of {len(games)}')
if len(sigs) != len(games): fail('two students got exactly the same game')
first = Counter(qs[0]['formula'] + str(qs[0]['subs']) for qs in games.values())
print(f'distinct Round 1 Q1 (formula and numbers): {len(first)}; most common appears {first.most_common(1)[0][1]} times in {len(games)}')
order = Counter(tuple(q['formula'] for q in qs[:6]) for qs in games.values())
same_slot = sum(1 for i in range(len(games)) for j in range(i + 1, min(i + 40, len(games))) if list(games.values())[i][0]['formula'] == list(games.values())[j][0]['formula'])
print(f'pairs of nearby students with the same Round 1 Q1 formula: {same_slot} of {sum(min(40, len(games) - i - 1) for i in range(len(games)))}')
