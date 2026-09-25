#!/usr/bin/env python3
"""
Putting Numbers In (8CN). Every number in the deck, the worksheet and the game
is checked here with sympy BEFORE it is written anywhere (CLAUDE.md, "Things
that will bite you", 7). This script also writes the game's question bank,
build/putting-numbers-in.data.json, so the game and the checked numbers cannot
drift apart.

    python3 build/putting-numbers-in-check.py
"""
import json, pathlib
from sympy import symbols, sympify, expand, Integer
from sympy.parsing.sympy_parser import parse_expr, standard_transformations, implicit_multiplication_application

T = standard_transformations + (implicit_multiplication_application,)
def val(expr, **subs):
    """Evaluate a formula written as a student would write it, e.g. '3(a + b)'."""
    e = parse_expr(expr, transformations=T, local_dict={k: symbols(k) for k in subs})
    return int(e.subs({symbols(k): v for k, v in subs.items()}))

def arith(s):
    """Plain arithmetic, used to simulate a specific wrong method."""
    return int(sympify(s))

n_checks = 0
def eq(got, want, what):
    global n_checks
    assert got == want, f'{what}: got {got}, expected {want}'
    n_checks += 1

# ---- Do Now -------------------------------------------------------------
m, k, a = symbols('m k a')
eq(expand(4*(m + 3)), 4*m + 12, 'DN1')
eq(6*a + 5 + 2*a + 3, 8*a + 8, 'DN2')
eq(arith('3 + 4*5'), 23, 'DN3')
eq(arith('2*(6 + 3)'), 18, 'DN4')
eq(expand(2*(3*k + 5)), 6*k + 10, 'DN5')

# ---- Hook: a taxi costs 5 plus 3 per km, 4 km ---------------------------
eq(arith('5 + 3*4'), 17, 'hook A')
eq(arith('(5 + 3)*4'), 32, 'hook B wrong')
eq(arith('3*4'), 12, 'hook C wrong')

# ---- I Do 1 -------------------------------------------------------------
eq(val('4n', n=3), 12, 'I Do 1: 4n, n=3')
eq([val('3n + 2', n=i) for i in (1, 2, 3, 4)], [5, 8, 11, 14], 'machine 3n+2')
eq(arith('(3 + 2)*4'), 20, 'I Do 1 wrong: added first')

# ---- I Do 2 -------------------------------------------------------------
eq(val('2(n + 3)', n=4), 14, 'I Do 2: 2(n+3), n=4')
n = symbols('n')
eq(expand(2*(n + 3)), 2*n + 6, 'I Do 2 expansion')
eq(2*4 + 6, 14, 'I Do 2 check by expansion')
eq(arith('2*4 + 3'), 11, 'I Do 2 wrong: first term only')
eq(val('3a + 2b', a=5, b=4), 23, 'I Do 2: 3a+2b')
eq(arith('3*4 + 2*5'), 22, 'I Do 2 wrong: swapped')

# ---- numbers that appear only in the notes ------------------------------
eq(val('5n + 1', n=6), 31, 'I Do 1 model'); eq(val('2 + 3n', n=4), 14, 'I Do 1 quick')
eq(val('3(n + 1)', n=5), 18, 'I Do 2 model'); eq(3*5 + 3, 18, 'I Do 2 model, expanded')
eq(arith('(3 + 4)*5'), 35, 'CC3 wrong'); eq(arith('(30 - 4)*5'), 130, 'WS6 wrong'); eq(arith('(2 + 6)*3'), 24, 'WS4 wrong')
eq(arith('4*5 + 3*2'), 26, 'CC6 swapped'); eq(arith('(20 - 2)*6'), 108, 'CC4 wrong'); eq(arith('2*3 + 5'), 11, 'CC5 wrong')
eq(arith('(4 + 3)*5'), 35, 'WD2 wrong')

# ---- We Do (fresh numbers) ----------------------------------------------
eq(val('5n', n=2), 10, 'WD1')
eq(val('4n + 3', n=5), 23, 'WD2'); eq(arith('(4 + 3)*5'), 35, 'WD2 wrong')
eq(val('5(n + 2)', n=3), 25, 'WD3'); eq(arith('5*3 + 2'), 17, 'WD3 wrong')
eq(val('2a + 4b', a=6, b=3), 24, 'WD4'); eq(arith('2*3 + 4*6'), 30, 'WD4 wrong')

# ---- Cold Call ----------------------------------------------------------
for i, (f, s, want) in enumerate([
    ('n + 7', dict(n=5), 12), ('6n', dict(n=4), 24), ('3n + 4', dict(n=5), 19),
    ('20 - 2n', dict(n=6), 8), ('2(n + 5)', dict(n=3), 16), ('4a + 3b', dict(a=2, b=5), 23),
], 1):
    eq(val(f, **s), want, f'CC{i}')

# ---- Worksheet ----------------------------------------------------------
ws = [
    ('4n', dict(n=7), 28), ('12 - n', dict(n=5), 7), ('5n + 3', dict(n=4), 23), ('2 + 6n', dict(n=3), 20),
    ('4(n + 2)', dict(n=3), 20), ('30 - 4n', dict(n=5), 10), ('5a + 2b', dict(a=3, b=4), 23),
    ('2(l + w)', dict(l=8, w=5), 26),
]
for i, (f, s, want) in enumerate(ws, 1):
    eq(val(f, **s), want, f'WS{i}')
eq(val('3(x + 2)', x=4), 18, 'WS9 correct'); eq(arith('3*4 + 2'), 14, 'WS9 student')
eq(expand(5*(n + 3)), 5*n + 15, 'WS10 expansion')
eq(val('5(n + 3)', n=4), 35, 'WS10 original'); eq(5*4 + 15, 35, 'WS10 expanded')

# ---- Plenary ------------------------------------------------------------
eq(val('4n', n=3), 12, 'PL1 (43 is wrong)')
eq(val('3n + 2', n=4), 14, 'PL2')
eq(val('5 + 3n', n=2), 11, 'PL3'); eq(arith('(5 + 3)*2'), 16, 'PL3 wrong')
eq(val('2(n + 4)', n=3), 14, 'PL4'); eq(arith('2*3 + 4'), 10, 'PL4 wrong')
eq(arith('5 + 3*4'), 17, 'PL5 taxi')

# ---- The game: 3 rounds of 6 --------------------------------------------
# (formula, substitutions, category, {wrong answer: error tag})
ROUNDS = [
    ('One-step formulas', [
        ('n + 7',  dict(n=5),  'onestep', {}),
        ('6n',     dict(n=4),  'onestep', {64: 'join'}),
        ('n - 3',  dict(n=9),  'onestep', {12: 'operation'}),
        ('8n',     dict(n=7),  'onestep', {87: 'join'}),
        ('15 - n', dict(n=6),  'onestep', {21: 'operation'}),
        ('3n',     dict(n=12), 'onestep', {312: 'join'}),
    ]),
    ('Two steps and brackets', [
        ('3n + 2',   dict(n=4), 'order',   {20: 'addfirst'}),
        ('2 + 5n',   dict(n=3), 'order',   {21: 'addfirst'}),
        ('20 - 2n',  dict(n=6), 'order',   {108: 'subfirst'}),
        ('2(n + 3)', dict(n=4), 'bracket', {11: 'bracket'}),
        ('5(n + 2)', dict(n=3), 'bracket', {17: 'bracket'}),
        ('4(n + 1)', dict(n=6), 'bracket', {25: 'bracket'}),
    ]),
    ('Two letters', [
        ('3a + b',    dict(a=2, b=5), 'letters', {17: 'swapped'}),
        ('2x + 3y',   dict(x=4, y=3), 'letters', {18: 'swapped'}),
        ('ab',        dict(a=4, b=6), 'letters', {46: 'join'}),
        ('5m + 2n',   dict(m=3, n=4), 'letters', {26: 'swapped'}),
        ('3(a + b)',  dict(a=2, b=5), 'bracket', {11: 'bracket'}),
        ('2(l + 3w)', dict(l=4, w=2), 'bracket', {14: 'bracket'}),
    ]),
]
# how each wrong answer is produced, so the feedback is not a guess
WRONG_METHOD = {
    ('6n', 64): '64', ('8n', 87): '87', ('3n', 312): '312', ('ab', 46): '46',
    ('n - 3', 12): '9 + 3', ('15 - n', 21): '15 + 6',
    ('3n + 2', 20): '(3 + 2)*4', ('2 + 5n', 21): '(2 + 5)*3', ('20 - 2n', 108): '(20 - 2)*6',
    ('2(n + 3)', 11): '2*4 + 3', ('5(n + 2)', 17): '5*3 + 2', ('4(n + 1)', 25): '4*6 + 1',
    ('3a + b', 17): '3*5 + 2', ('2x + 3y', 18): '2*3 + 3*4', ('5m + 2n', 26): '5*4 + 2*3',
    ('3(a + b)', 11): '3*2 + 5', ('2(l + 3w)', 14): '2*4 + 3*2',
}
bank = []
for r, (rname, qs) in enumerate(ROUNDS, 1):
    for i, (f, s, cat, wrongs) in enumerate(qs, 1):
        ans = val(f, **s)
        assert ans > 0, 'AVOID negatives'
        for w, tag in wrongs.items():
            assert (f, w) in WRONG_METHOD, (f, w)
            eq(arith(WRONG_METHOD[(f, w)]), w, f'game R{r}Q{i} wrong {w}')
            assert w != ans
        bank.append(dict(round=r, roundName=rname, n=i, formula=f, subs=s, category=cat, answer=ans,
                         wrong={str(w): tag for w, tag in wrongs.items()}))
        n_checks += 1
pathlib.Path(__file__).with_name('putting-numbers-in.data.json').write_text(json.dumps(bank, indent=1))
print(f'{n_checks} checks passed; {len(bank)} game questions written')
