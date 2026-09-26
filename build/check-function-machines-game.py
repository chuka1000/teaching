#!/usr/bin/env python3
"""
Independent check of the Function Machines game's generated questions. The
browser dumps N generated games (JSON, from build/test-function-machines-game.js);
this script re-derives every answer, every known-mistake value and every line of
working from the MACHINE ITSELF with sympy, and checks the rules: exact
division on every path, the right skills in the right order (the ramp), the
last two questions of round 3 drawn from their pools, and that games really
differ from student to student.

    python3 build/check-function-machines-game.py games.json
"""
import json, re, sys
from collections import Counter
from fractions import Fraction
from sympy import sympify, symbols, expand, Eq, solve
from sympy.parsing.sympy_parser import parse_expr, standard_transformations, implicit_multiplication_application

T = standard_transformations + (implicit_multiplication_application,)
n = symbols('n')
games = json.load(open(sys.argv[1]))
checks = 0

def fail(msg): print('FAIL:', msg); sys.exit(1)
def ok(cond, msg):
    global checks
    if not cond: fail(msg)
    checks += 1

def num(s):
    return sympify(s.replace('×', '*').replace('−', '-').replace('÷', '/'))

def ap(s, x):
    v = s['v']
    return {'mul': lambda: x * v, 'add': lambda: x + v, 'sub': lambda: x - v, 'div': lambda: x / v, 'rsub': lambda: v - x}[s['op']]()
def run(steps, x):
    x = Fraction(x) if not hasattr(x, 'free_symbols') else x
    for s in steps: x = ap(s, x)
    return x
def path(steps, x):
    x = Fraction(x); out = []
    for s in steps: x = ap(s, x); out.append(x)
    return out
def is_int(x): return Fraction(x).denominator == 1
def poly(steps):
    x = n
    for s in steps: x = ap(s, x)
    return expand(x)

CATS = ['output'] * 6 + ['rule'] * 2 + ['back'] * 4 + ['back'] + ['puzzle'] * 5
KINDS_R1 = ['output'] * 6
LBL = {'mul': '×', 'add': '+', 'sub': '−', 'div': '÷'}
def label(s): return (LBL[s['op']] + ' ' + ('?' if s['v'] is None else str(s['v']))) if s['op'] != 'rsub' else 'subtract from ' + str(s['v'])
def txt(x): return str(int(x)).replace('-', '−')
def display(q):
    steps = ' | '.join(label(s) for s in q['steps']); k = q['kind']
    if k == 'output': return f"IN {txt(q['input'])} | {steps} | OUT ?"
    if k == 'back': return f"IN ? | {steps} | OUT {txt(q['output'])}"
    if k == 'rule': return f"IN n | {steps} | OUT ?"
    if k == 'fixed': return f"IN ? | {steps} | OUT the same"
    if k == 'missing': return f"IN {txt(q['input'])} | {steps} | OUT {txt(q['output'])}"
    if k == 'table': return 'TABLE ' + ', '.join(f'{r[0]}→{r[1]}' for r in q['table']) + f" | IN {q['target']} | OUT ?"
    if k == 'equal': return f"A: {steps} | B: " + ' | '.join(label(s) for s in q['stepsB'])

def check_worked(q, where):
    vals = []
    for line in q['worked']:
        sides = [num(p) for p in line.split(' = ')]
        ok(all(v == sides[0] for v in sides), f'{where}: worked line "{line}" is not true')
        vals.append(sides[-1])
    return vals

allowed_tags = {'order', 'skip', 'sign', 'forward', 'output', 'swapped', 'brackets', 'rsub'}
steps_by_round = {1: [], 2: [], 3: []}
q17, q18 = Counter(), Counter()

for code, qs in games.items():
    ok(len(qs) == 18, f'{code}: {len(qs)} questions')
    ok([q['cat'] for q in qs] == CATS, f'{code}: category order {[q["cat"] for q in qs]}')
    ok([q['kind'] for q in qs[:6]] == KINDS_R1, f'{code}: round 1 kinds')
    ok([q['kind'] for q in qs[6:8]] == ['rule', 'rule'] and [q['kind'] for q in qs[8:12]] == ['back'] * 4, f'{code}: round 2 kinds')
    ok(qs[12]['kind'] == 'back' and sorted(q['kind'] for q in qs[13:16]) == ['fixed', 'missing', 'table'], f'{code}: round 3 puzzles')
    ok(qs[16]['kind'] in ('equal', 'back'), f'{code}: Q17 kind {qs[16]["kind"]}')
    ok(qs[17]['kind'] in ('back', 'fixed', 'output'), f'{code}: Q18 kind {qs[17]["kind"]}')
    q17[qs[16]['kind']] += 1; q18[qs[17]['kind'] + str(len(qs[17]['steps']))] += 1
    for q in qs:
        where = f"{code} R{q['round']}Q{q['n']} {q['kind']} {q['disp']}"
        ok(q['disp'] == display(q), f'{where}: display "{q["disp"]}" does not match the machine ({display(q)})')
        steps = q['steps']; k = q['kind']
        steps_by_round[q['round']].append(len(steps))
        ok(all(s['op'] in ('mul', 'add', 'sub', 'div', 'rsub') for s in steps), f'{where}: unknown op')
        ok(all(s['v'] is None or (isinstance(s['v'], int) and s['v'] > 0) for s in steps), f'{where}: step value')
        ok(isinstance(q['answer'], int) and abs(q['answer']) <= 99999, f'{where}: answer {q["answer"]}')
        vals = check_worked(q, where)
        if k == 'output':
            p = path(steps, q['input'])
            ok(all(is_int(v) for v in p), f'{where}: a non-integer on the path {p}')
            ok(p[-1] == q['answer'], f'{where}: machine gives {p[-1]}, answer says {q["answer"]}')
            ok([Fraction(int(v)) for v in vals] == p, f'{where}: working {q["worked"]} does not follow the machine {p}')
            ok(1 <= q['input'] <= 60, f'{where}: input out of range')
        elif k == 'back':
            p = path(steps, q['answer'])
            ok(all(is_int(v) for v in p), f'{where}: a non-integer on the forward path {p}')
            ok(p[-1] == q['output'], f'{where}: input {q["answer"]} gives {p[-1]}, not {q["output"]}')
            ok(vals[-1] == q['answer'], f'{where}: working does not end at the answer')
            back = [Fraction(q['answer'])] + p[:-1]
            ok([Fraction(int(v)) for v in vals] == list(reversed(back)), f'{where}: working {q["worked"]} is not the machine undone ({list(reversed(back))})')
            ok(q['answer'] >= 1 and q['output'] >= 1, f'{where}: back questions stay positive')
        elif k == 'rule':
            want = poly(steps)
            texts = [o['text'] for o in q['options']]
            forms = [expand(parse_expr(t.replace('−', '-'), transformations=T)) for t in texts]
            ok(len(set(forms)) == 4, f'{where}: two options are the same rule {texts}')
            ok([f == want for f in forms].count(True) == 1 and forms[q['correctIndex']] == want, f'{where}: the correct option is not the machine {want}')
            ok(texts[q['correctIndex']] == q['formula'] and all(o['tag'] is None for i, o in enumerate(q['options']) if i == q['correctIndex']), f'{where}: formula field')
            ok(all(o['tag'] in allowed_tags for i, o in enumerate(q['options']) if i != q['correctIndex']), f'{where}: option tags')
            ok(all(str(x) for x in [o.get('msg') for i, o in enumerate(q['options']) if i != q['correctIndex']]) and all(o.get('msg') for i, o in enumerate(q['options']) if i != q['correctIndex']), f'{where}: option messages')
            p = path(steps, q['checkInput'])
            ok([Fraction(int(v)) for v in vals] == p and all(v > 0 for v in p), f'{where}: the check working')
            ok(steps[0]['v'] != steps[1]['v'], f'{where}: equal step numbers')
        elif k == 'fixed':
            x = q['answer']; ok(run(steps, x) == x, f'{where}: {x} does not give itself')
            sol = solve(Eq(poly(steps), n), n); ok(sol == [x], f'{where}: solutions of output = input are {sol}')
            p = path(steps, x); ok(all(is_int(v) for v in p), f'{where}: a non-integer on the path')
            ok([Fraction(int(v)) for v in vals] == p, f'{where}: the check working')
        elif k == 'missing':
            holes = [i for i, s in enumerate(steps) if s['v'] is None]; ok(len(holes) == 1, f'{where}: one missing number')
            full = [dict(s, v=q['answer']) if s['v'] is None else s for s in steps]
            p = path(full, q['input']); ok(p[-1] == q['output'] and all(is_int(v) for v in p), f'{where}: the missing number does not give the output')
            m = symbols('m')
            sub = [dict(s, v=m) if s['v'] is None else s for s in steps]
            x = q['input']
            for s in sub: x = ap(s, x)
            ok(solve(Eq(expand(x), q['output']), m) == [q['answer']], f'{where}: the missing number is not unique')
            ok(vals[-1] == q['answer'], f'{where}: working does not end at the missing number')
        elif k == 'table':
            ok(len(q['table']) == 3 and all(run(steps, x) == y for x, y in q['table']), f'{where}: the table does not match the machine')
            xs = [r[0] for r in q['table']]; ok(xs == sorted(set(xs)) and max(xs) < q['target'], f'{where}: table inputs')
            ok(run(steps, q['target']) == q['answer'], f'{where}: answer {q["answer"]} is not the machine at {q["target"]}')
            (x1, y1), (x2, y2) = q['table'][0], q['table'][2]
            slope = Fraction(y2 - y1, x2 - x1); ok(slope.denominator == 1, f'{where}: slope')
            ok(all(slope * x + (y1 - slope * x1) == y for x, y in q['table']), f'{where}: the table is not one straight rule')
            ok(vals[-1] == q['answer'], f'{where}: working does not end at the answer')
        elif k == 'equal':
            x = q['answer']; a, b = run(steps, x), run(q['stepsB'], x)
            ok(a == b == q['output'], f'{where}: outputs differ ({a}, {b})')
            sol = solve(Eq(poly(steps), poly(q['stepsB'])), n); ok(sol == [x], f'{where}: solutions {sol}')
            pa, pb = path(steps, x), path(q['stepsB'], x)
            ok(all(is_int(v) for v in pa + pb), f'{where}: a non-integer on a path')
            ok([Fraction(int(v)) for v in vals] == pa + pb, f'{where}: the check working')
        # every known mistake: its stated sum really gives the value, and it is not the answer
        if k != 'rule':
            for value, w in q['wrong'].items():
                ok(num(w['how']) == int(value), f'{where}: mistake {w["tag"]} "{w["how"]}" is not {value}')
                ok(int(value) != q['answer'], f'{where}: mistake equals the answer')
                ok(w['tag'] in allowed_tags and w.get('msg'), f'{where}: mistake tag or message')
    # the ramp: more steps, later
print(f'{len(games)} generated games, {checks} checks passed')

def mean(a): return sum(a) / len(a)
print('mean number of steps per question, by round:', {r: round(mean(v), 2) for r, v in steps_by_round.items()})
ok(mean(steps_by_round[1]) < mean(steps_by_round[2]) + 0.6 and mean(steps_by_round[3]) > mean(steps_by_round[1]), 'the rounds get harder')
print('Q17 kinds:', dict(q17), ' Q18 kinds:', dict(q18))
ok(len(q17) == 2 and len(q18) == 3, 'every pool item appears across 300 games')
known = sum(len(q['wrong']) > 0 or q['kind'] == 'rule' for qs in games.values() for q in qs) / (18 * len(games))
print(f'questions with at least one named mistake: {100 * known:.0f}%')
ok(known > 0.95, 'nearly every question names a mistake')

# variation between students
sigs = Counter(tuple(q['disp'] for q in qs) for qs in games.values())
print(f'distinct games: {len(sigs)} of {len(games)}')
ok(len(sigs) == len(games), 'two students got exactly the same game')
first = Counter(qs[0]['disp'] for qs in games.values())
print(f'distinct Q1: {len(first)}; most common appears {first.most_common(1)[0][1]} times in {len(games)}')
last = Counter(qs[17]['disp'] for qs in games.values())
print(f'distinct Q18: {len(last)}; most common appears {last.most_common(1)[0][1]} times in {len(games)}')
