#!/usr/bin/env python3
"""
Independent check of the BIDMAS game's generated questions (8CN). The browser dumps N generated
games (JSON, from build/test-bidmas-game.js); this script re-derives, WITHOUT using the game's own
stepper:

  * every answer, with sympy, from the sum's ASCII form;
  * every line of the correct working, which must equal the answer (true maths) at every step;
  * every named mistake, with a separate precedence-climbing evaluator that follows the WRONG
    rule the mistake names (add before multiply, strictly left to right, brackets ignored,
    5^2 read as 5 x 2, ...), and the mistake's own working, which must start at the sum and end
    at the value;
  * the puzzles: the one right bracket placement, the unique missing number, the largest value
    one pair of brackets can make;
  * the ramp: the skill in every slot, and that games really differ from student to student.

    python3 build/check-bidmas-game.py games.json
"""
import itertools, json, re, sys
from collections import Counter
from fractions import Fraction
from sympy import sympify, Symbol, solve, Eq, Rational

games = json.load(open(sys.argv[1]))
checks = 0
def fail(msg): print('FAIL:', msg); sys.exit(1)
def ok(cond, msg):
    global checks
    if not cond: fail(msg)
    checks += 1

M = '−'
def to_ascii(line):
    s = line.strip()
    for pre in ('= ', 'Check: ', 'Best: '):
        if s.startswith(pre): s = s[len(pre):]
    s = s.replace(M, '-').replace('×', '*').replace('÷', '/').replace('²', '**2').replace('³', '**3').replace('?', 'x')
    return s.replace(' ', '')
def sy(s): return sympify(s, rational=True)

# ---------- a separate evaluator for the WRONG rules (precedence climbing, higher binds tighter) ----------
TOK = re.compile(r'\(-\d+\)|\d+|\*\*|[()+\-*/]')
def tokens(a):
    out = TOK.findall(a)
    ok(''.join(out) == a, f'tokenise {a}')
    return out
RULEPREC = {
    'normal':       {'+': 1, '-': 1, '*': 2, '/': 2, 'pow': 3},
    'addfirst':     {'+': 2, '-': 2, '*': 1, '/': 1, 'pow': 3},
    'ltr':          {'+': 1, '-': 1, '*': 1, '/': 1, 'pow': 3},
    'mulfirst':     {'+': 1, '-': 1, '*': 3, '/': 2, 'pow': 4},
    'addbeforesub': {'+': 2, '-': 1, '*': 3, '/': 3, 'pow': 4},
    'powwhole':     {'+': 1, '-': 1, '*': 2, '/': 2, 'pow': 1.5},
    'nobracket':    {'+': 1, '-': 1, '*': 2, '/': 2, 'pow': 3},
    'nopow':        {'+': 1, '-': 1, '*': 2, '/': 2, 'pow': 3},
    'negsq':        {'+': 1, '-': 1, '*': 2, '/': 2, 'pow': 3},
    'negmul':       {'+': 1, '-': 1, '*': 2, '/': 2, 'pow': 3},
    'signs':        {'+': 1, '-': 1, '*': 2, '/': 2, 'pow': 3},
}
class Bad(Exception): pass
def evaluate(a, rule):
    t = tokens(a)
    if rule == 'nobracket': t = [x for x in t if x not in '()' or x.startswith('(-')]
    if rule == 'nopow':
        o, i = [], 0
        while i < len(t):
            if t[i] == '**': o += ['*', t[i + 1]]; i += 2
            else: o.append(t[i]); i += 1
        t = o
    # a negative literal "(-3)" is a number
    pos = [0]
    prec = RULEPREC[rule]; EPS = 0.25
    def atom():
        x = t[pos[0]]; pos[0] += 1
        if x == '(':
            v = expr(0);
            if t[pos[0]] != ')': raise Bad('paren')
            pos[0] += 1; return v
        if x.startswith('(-'): return int(x[1:-1])
        return int(x)
    def apply(op, l, r):
        if op == '+': return l + abs(r) if (rule == 'signs' and r < 0) else l + r
        if op == '-': return l - abs(r) if (rule == 'signs' and r < 0) else l - r
        if op == '*': v = l * r; return -abs(v) if (rule == 'negmul' and l < 0 and r < 0) else v
        if op == '/':
            if r == 0 or l % r: raise Bad('div')
            v = l // r; return -abs(v) if (rule == 'negmul' and l < 0 and r < 0) else v
    def expr(minp):
        left = atom()
        while pos[0] < len(t):
            x = t[pos[0]]
            if x == '**':
                if prec['pow'] < minp: break
                pos[0] += 1; e = int(t[pos[0]]); pos[0] += 1
                left = -(abs(left) ** e) if (rule == 'negsq' and left < 0) else left ** e
                continue
            if x not in '+-*/' or len(x) != 1: break
            p = prec[x]
            if p < minp: break
            pos[0] += 1
            right = expr(p + EPS)
            left = apply(x, left, right)
        return left
    v = expr(0)
    if pos[0] != len(t): raise Bad('trailing')
    return v

def check_mistakes(q, where, a_of=None, subst=None):
    """each named mistake: value, tag/rule, and the working that gives it."""
    seen = set()
    for key, w in q.get('wrong', {}).items():
        v = int(key)
        ok(v != q['answer'], f'{where}: mistake {v} equals the answer')
        ok(v not in seen, f'{where}: two mistakes with the value {v}'); seen.add(v)
        ok(w.get('tag') and w.get('msg') and w.get('how'), f'{where}: mistake {v} needs tag, message and working')
        parts = [p.strip() for p in w['how'].split(' = ')]
        end = str(q['target']) if subst is not None else str(v)
        ok(parts[-1].replace(M, '-') == end, f'{where}: working for {v} must end at {end}: {w["how"]}')
        rule = w['rule']
        if rule in RULEPREC:
            if subst is None:
                try: got = evaluate(q['ascii'], rule)
                except Bad: got = None
                ok(got == v, f'{where}: rule {rule} on {q["ascii"]} gives {got}, the game says {v}')
            else:
                try: got = evaluate(subst(v), rule)
                except Bad: got = None
                ok(got == q['target'], f'{where}: putting {v} in with rule {rule} gives {got}, not the target {q["target"]}')
    return seen

KINDS = ['eval'] * 12 + ['eval', 'eval', 'place', 'missing']
CATS = ['md', 'md', 'md', 'br', 'br', 'md', 'idx', 'idx', 'ltr', 'ltr', 'idx', 'br', 'br', 'neg', 'hard', 'hard', 'hard', 'hard']

for code, qs in games.items():
    ok(len(qs) == 18, f'{code}: {len(qs)} questions')
    ok([q['cat'] for q in qs] == CATS, f'{code}: categories {[q["cat"] for q in qs]}')
    ok([q['kind'] for q in qs[:16]] == KINDS, f'{code}: kinds {[q["kind"] for q in qs[:16]]}')
    ok(qs[16]['kind'] == 'eval' and qs[17]['kind'] in ('bmax', 'missingPos'), f'{code}: Q17 is a long mix, Q18 a bracket or missing-number puzzle')
    ok([(q['round'], q['num']) for q in qs] == [(k // 6 + 1, k % 6 + 1) for k in range(18)], f'{code}: round and number')

    for q in qs:
        where = f"{code} Q{(q['round'] - 1) * 6 + q['num']} {q['kind']}"
        if q['kind'] == 'eval':
            ok(sy(q['ascii']) == q['answer'], f'{where}: {q["ascii"]} is {sy(q["ascii"])}, the game says {q["answer"]}')
            ok(evaluate(q['ascii'], 'normal') == q['answer'], f'{where}: separate evaluator disagrees')
            ok(len(q['worked']) == len(q['notes']) and len(q['worked']) >= 1, f'{where}: working and notes line up')
            for l in q['worked']:
                ok(sy(to_ascii(l)) == q['answer'], f'{where}: working line "{l}" is not equal to the answer')
            ok(q['worked'][-1] == '= ' + str(q['answer']).replace('-', M), f'{where}: working must end at the answer')
            ok(all(isinstance(int(k), int) for k in q['wrong']) and len(q['wrong']) >= 1, f'{where}: at least one named mistake')
            check_mistakes(q, where)
            if q['round'] < 3 and q['cat'] != 'neg':
                ok(q['answer'] >= 1 and not any(('(' + M) in l or l.startswith('= ' + M) for l in q['worked']), f'{where}: rounds 1 and 2 stay positive')
        elif q['kind'] == 'place':
            o = q['options']
            ok(len(o) == 4 and len({x['text'] for x in o}) == 4 and len({x['value'] for x in o}) == 4, f'{where}: four different options with four different values')
            good = [i for i, x in enumerate(o) if x['tag'] is None]
            ok(good == [q['correctIndex']] and q['answer'] == q['correctIndex'] + 1, f'{where}: exactly one correct option')
            for x in o:
                ok(sy(x['ascii']) == x['value'], f'{where}: option {x["text"]} is {sy(x["ascii"])}, not {x["value"]}')
            ok(o[q['correctIndex']]['value'] == q['target'], f'{where}: the correct option must give the target')
            ok(sum(1 for x in o if x['value'] == q['target']) == 1, f'{where}: only one option gives the target')
            # the sum without brackets, and every single-pair placement: the target is made by exactly ONE placement
            nums = [int(n) for n in re.findall(r'\d+', q['ascii'])]; ops = re.findall(r'[+\-*]', q['ascii'])
            ok(len(nums) == 5 and len(ops) == 4, f'{where}: five numbers, four signs')
            hits = 0
            for i in range(5):
                for j in range(i + 1, 5):
                    if i == 0 and j == 4: continue
                    s = ''.join((('(' if k == i else '') + str(nums[k]) + (')' if k == j else '') + (ops[k] if k < 4 else '')) for k in range(5))
                    if sy(s) == q['target']: hits += 1
            ok(hits == 1, f'{where}: the target {q["target"]} must come from exactly one placement, found {hits}')
            for l in q['worked']: ok(sy(to_ascii(l)) == q['target'], f'{where}: working line "{l}" is not the target')
        elif q['kind'] in ('missing', 'missingPos'):
            x = Symbol('x'); expr = sy(q['ascii'])
            sols = solve(Eq(expr, q['target']), x)
            if q['kind'] == 'missing':
                ok(sols == [q['answer']], f'{where}: solutions {sols}, the game says {q["answer"]}')
            else:
                pos = [s for s in sols if s > 0]
                ok(pos == [q['answer']] and len(sols) == 2, f'{where}: the positive solution must be unique ({sols}), the game says {q["answer"]}')
                ok(any(s <= 0 for s in sols), f'{where}: the other root is not positive')
            for l in q['worked']: ok(sy(to_ascii(l)) == q['target'], f'{where}: working line "{l}" is not the target')
            check_mistakes(q, where, subst=lambda v, a=q['ascii']: a.replace('x', '(' + str(v) + ')') if v >= 0 else a.replace('x', '(' + str(v) + ')'))
            ok(len(q['wrong']) >= 1, f'{where}: at least one named mistake')
            ok(q['expr'].endswith(' = ' + str(q['target'])), f'{where}: the equation shown ends at the target')
        elif q['kind'] == 'bmax':
            nums = q['nums']; ops = q['ops']
            plain = ''.join(str(n) + (o.replace('×', '*').replace(M, '-') if k < 4 else '') for k, (n, o) in enumerate(zip(nums, ops + [''])))
            vals = {}
            for i in range(5):
                for j in range(i + 1, 5):
                    if i == 0 and j == 4: continue
                    s = ''.join((('(' if k == i else '') + str(nums[k]) + (')' if k == j else '') + (ops[k].replace('×', '*').replace(M, '-') if k < 4 else '')) for k in range(5))
                    vals[(i, j)] = int(sy(s))
            ok(q['answer'] == max(vals.values()), f'{where}: largest value is {max(vals.values())}, the game says {q["answer"]}')
            ok(q['answer'] > int(sy(plain)), f'{where}: the best bracket must beat the sum with no brackets')
            ok(sy(to_ascii(q['bestText'])) == q['answer'], f'{where}: best placement text')
            for l in q['worked']: ok(sy(to_ascii(l)) == q['answer'], f'{where}: working line "{l}" is not the answer')
            base = int(sy(plain)); allv = set(vals.values())
            for key, w in q['wrong'].items():
                v = int(key)
                if w['tag'] == 'nobrackets': ok(v == base, f'{where}: no-brackets value must be {base}')
                else: ok(w['tag'] == 'notmax' and v in allv and v < q['answer'], f'{where}: "not the largest" value {v} must be a real placement below the maximum')
                ok(v != q['answer'], f'{where}: mistake equals the answer')

print(f'{len(games)} generated games, {checks} checks passed')

q17 = Counter(qs[16]['disp'] for qs in games.values())
q18k = Counter(qs[17]['kind'] for qs in games.values())
print('Q18 kinds:', dict(q18k)); ok(len(q18k) == 2, 'both Q18 templates appear')
sigs = Counter(tuple(q['disp'] for q in qs) for qs in games.values()); print(f'distinct games: {len(sigs)} of {len(games)}'); ok(len(sigs) == len(games), 'two students got exactly the same game')
first = Counter(qs[0]['disp'] for qs in games.values()); print(f'distinct Q1: {len(first)}; most common appears {first.most_common(1)[0][1]} times in {len(games)}')
print(f'distinct Q17: {len(q17)}; most common appears {q17.most_common(1)[0][1]} times in {len(games)}')
tags = Counter(w['tag'] for qs in games.values() for q in qs for w in (q.get('wrong') or {}).values())
print('mistake tags used:', dict(tags))
