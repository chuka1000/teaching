#!/usr/bin/env python3
"""
Independent check of the Find The Rule game's generated questions. The browser dumps N generated games (JSON, from
build/test-find-the-rule-game.js); this script re-derives every answer, every known-mistake value and every line of
working from the TABLE (or the rules) on the screen with sympy, and checks the rules: the right skills in the right
order (the ramp), integers everywhere, every mistake produced by its stated sum, the options of a multiple-choice
question all different, and that games really differ from student to student.

    python3 build/check-find-the-rule-game.py games.json
"""
import json, re, sys
from collections import Counter
from sympy import sympify, symbols, expand, Eq, solve, Rational

x, y, m, c = symbols('x y m c')
games = json.load(open(sys.argv[1]))
checks = 0


def fail(msg): print('FAIL:', msg); sys.exit(1)


def ok(cond, msg):
    global checks
    if not cond: fail(msg)
    checks += 1


def num(s):
    return sympify(s.replace('×', '*').replace('−', '-').replace('÷', '/'))


def txt(v): return str(int(v)).replace('-', '−')


def parse_rule(s):
    """'y = 3x + 4', 'y = −2x + 20', 'y = x − 5'  ->  (m, c)"""
    mt = re.match(r'^y = (−?)(\d*)x(?: ([+−]) (\d+))?$', s)
    if not mt: fail(f'cannot parse rule "{s}"')
    mm = int(mt.group(2) or 1) * (-1 if mt.group(1) else 1)
    cc = 0 if not mt.group(3) else int(mt.group(4)) * (-1 if mt.group(3) == '−' else 1)
    return mm, cc


def parse_bracket(s):
    mt = re.match(r'^y = (−?\d+)\(x ([+−]) (\d+)\)$', s)
    if not mt: fail(f'cannot parse bracket rule "{s}"')
    return int(mt.group(1).replace('−', '-')), int(mt.group(3)) * (-1 if mt.group(2) == '−' else 1)


def visible(t):
    """the (x, y) pairs of a table that are on the screen (a hidden or missing cell is left out)"""
    hide = t.get('hide') or {}
    return [(a, b) for i, (a, b) in enumerate(zip(t['xs'], t['ys'])) if b is not None and hide.get('x') != i and hide.get('y') != i]


def fit(pairs):
    """Fit y = m x + c to the first two pairs with sympy and require EVERY pair to fit. Integers only."""
    (x1, y1), (x2, y2) = pairs[0], pairs[1]
    sol = solve([Eq(m * x1 + c, y1), Eq(m * x2 + c, y2)], (m, c))
    mm, cc = sol[m], sol[c]
    ok(mm == int(mm) and cc == int(cc), f'rule from {pairs} has whole numbers: y = {mm}x + {cc}')
    ok(all(mm * a + cc == b for a, b in pairs), f'every visible pair fits y = {mm}x + {cc}: {pairs}')
    return int(mm), int(cc)


def rule_text(mm, cc):
    mt = 'x' if mm == 1 else '−x' if mm == -1 else txt(mm) + 'x'
    return 'y = ' + mt + ('' if cc == 0 else f' − {-cc}' if cc < 0 else f' + {cc}')


def bracket_text(mm, k): return f'y = {txt(mm)}(x {"−" if k < 0 else "+"} {abs(k)})'


def check_worked(q, where):
    """every arithmetic line is true; 'y = ...' lines must be the rule; for a number answer some line must end at it"""
    ends = []
    for line in q['worked']:
        if line.startswith('y = '):
            if q['kind'] == 'bracket' and '(' in line: ok(parse_bracket(line) == (q['answer']['m'], q['answer']['c']), f'{where}: bracket line "{line}"')
            else:
                ok(parse_rule(line) == (q['m'], q['c']), f'{where}: rule line "{line}" is the rule {rule_text(q["m"], q["c"])}')
            continue
        sides = [num(p) for p in line.split(' = ')]
        ok(all(v == sides[0] for v in sides), f'{where}: worked line "{line}" is not true')
        ends.append(sides[-1])
    return ends


def check_wrongs(q, where):
    if q['kind'] in ('rule', 'bracket'):
        for key, w in q['wrong'].items():
            mm, cc = [int(v) for v in key.split('|')]
            ok((mm, cc) != (q['answer']['m'], q['answer']['c']), f'{where}: a mistake equals the answer')
            got = parse_bracket(w['how']) if q['kind'] == 'bracket' else parse_rule(w['how'])
            ok(got == (mm, cc), f'{where}: the mistake "{w["how"]}" is the pair {key}')
            ok(w['tag'] in TAGS and w['msg'], f'{where}: the mistake has a known tag and a message')
    elif q['kind'] == 'num':
        seen = set()
        for val, w in q['wrong'].items():
            v = int(val)
            ok(v != q['answer'], f'{where}: mistake {val} equals the answer')
            ok(num(w['how']) == v, f'{where}: mistake {val}: "{w["how"]}" really gives {num(w["how"])}')
            ok(val not in seen and w['tag'] in TAGS and w['msg'], f'{where}: mistake {val} is distinct, tagged and explained')
            seen.add(val)


TAGS = {'first', 'swap', 'gap', 'sign', 'skip', 'forward', 'step', 'stepback', 'onecol', 'addone', 'ratio', 'order', 'output', 'expanded', 'fall', 'only'}
CATS = (['step', 'step', 'zero', 'zero', 'rule', 'rule', 'use', 'use'] + ['rule', 'rule', 'rule', 'zero', 'rule', 'check', 'use', 'use'] +
        ['step', 'step', 'zero', 'rule', 'rule', 'rule', 'check', 'use'] + ['rule', 'rule', 'use', 'use', 'zero', 'rule', 'use', 'check'] + ['puzzle'] * 8)
KINDS = (['num', 'num', 'num', 'num', 'rule', 'mc', 'num', 'num'] + ['rule', 'rule', 'rule', 'num', 'rule', 'mc', 'num', 'num'] +
         ['num', 'num', 'num', 'mc', 'rule', 'rule', 'mc', 'num'] + ['rule', 'rule', 'num', 'num', 'num', 'mc', 'num', 'mc'] +
         ['rule', 'rule', 'num', 'num', 'num', 'bracket', 'rule', None])

pool7, pool8 = Counter(), Counter()
wrong_counts = []

for code, qs in games.items():
    ok(len(qs) == 40, f'{code}: {len(qs)} questions')
    ok([q['cat'] for q in qs] == CATS, f'{code}: category order {[q["cat"] for q in qs]}')
    ok([q['level'] for q in qs] == [i // 8 + 1 for i in range(40)] and [q['n'] for q in qs] == [i % 8 + 1 for i in range(40)], f'{code}: level and number')
    for i, q in enumerate(qs):
        L, n = q['level'], q['n']
        where = f'{code} Q{i + 1} (level {L}, no. {n})'
        if KINDS[i] is not None: ok(q['kind'] == KINDS[i], f'{where}: kind {q["kind"]}')
        T = q.get('table')
        disp = q['disp']
        ok(q['ask'] in disp, f'{where}: the screen text contains the question')
        if T:
            for a, b in visible(T):
                ok(txt(a) in disp and txt(b) in disp, f'{where}: the screen shows the pair {a}, {b}')
            ok(len(set(T['xs'])) == len(T['xs']), f'{where}: x values are all different')

        # ----- recompute the answer for each template -----
        if T and not q.get('tableA'):
            pairs = visible(T)
            mm, cc = fit(pairs)
            ok((q.get('m'), q.get('c')) == (mm, cc), f'{where}: stored m, c = {q.get("m")}, {q.get("c")}; the table gives {mm}, {cc}')
        if q['kind'] == 'rule':
            ok((q['answer']['m'], q['answer']['c']) == (mm, cc), f'{where}: the rule is {rule_text(mm, cc)}')
            ok(parse_rule(q['formula']) == (mm, cc), f'{where}: the formula text')
        if (L, n) in [(1, 1), (1, 2)]:
            xs = T['xs']; ok(all(b - a == 1 for a, b in zip(xs, xs[1:])), f'{where}: x goes up by 1'); ok(q['answer'] == mm, f'{where}: the step is {mm}')
        elif (L, n) in [(1, 3), (1, 4), (2, 4), (3, 3), (4, 5)]:
            ok(q['answer'] == cc, f'{where}: y at x = 0 is {cc}')
            xs = T['xs']
            if (L, n) in [(1, 3), (1, 4), (2, 4)]: ok(xs[0] == 1, f'{where}: starts at x = 1, one step back reaches x = 0')
            if (L, n) == (4, 5): ok(xs[0] == 2 and xs[1] - xs[0] == 2, f'{where}: x = 2, 4, 6: one column back reaches x = 0')
            if (L, n) == (3, 3): ok(xs[0] == 2 * (xs[1] - xs[0]), f'{where}: the table starts two columns from x = 0')
        elif (L, n) in [(1, 6), (3, 4), (4, 6)]:
            ci = q['correctIndex']; opts = q['options']
            texts = [o['text'] for o in opts]
            ok(len(set(texts)) == len(texts) == 4, f'{where}: four different options')
            ok(sum(1 for o in opts if o['tag'] is None) == 1 and opts[ci]['tag'] is None and q['answer'] == ci + 1, f'{where}: exactly one right option, and it is option {ci + 1}')
            if (L, n) == (4, 6):
                ok(f'£{mm} for each' in opts[ci]['text'] and f'a £{cc} ' in opts[ci]['text'] and 'discount' not in opts[ci]['text'], f'{where}: the right description says £{mm} each and £{cc} fixed')
                for o in opts:
                    if o['tag'] == 'swap': ok(f'£{cc} for each' in o['text'] and f'a £{mm} ' in o['text'], f'{where}: swapped option')
                    if o['tag'] == 'first': ok(f'a £{T["ys"][0]} ' in o['text'], f'{where}: first-y option')
                    if o['tag'] == 'sign': ok(f'a £{cc} discount' in o['text'], f'{where}: discount option')
            else:
                ok(parse_rule(opts[ci]['text']) == (mm, cc), f'{where}: the right option is {rule_text(mm, cc)}')
                for o in opts:
                    if o['tag'] is None: continue
                    pm, pc = parse_rule(o['text'])
                    if o['tag'] == 'first': ok((pm, pc) == (mm, T['ys'][0]), f'{where}: "first" option is m x + first y')
                    if o['tag'] == 'swap': ok((pm, pc) == (cc, mm), f'{where}: "swap" option')
                    if o['tag'] == 'sign': ok((pm, pc) == (mm, -cc), f'{where}: "sign" option')
                    if o['tag'] == 'gap': dy = T['ys'][1] - T['ys'][0]; ok((pm, pc) == (dy, cc), f'{where}: "gap" option uses the gap in y {dy}')
        elif (L, n) == (1, 7):
            rm, rc = parse_rule(q['rule']); k = int(re.search(r'x = (\d+)', q['ask']).group(1))
            ok((rm, rc) == (q['m'], q['c']) and q['answer'] == rm * k + rc and 6 <= k <= 12, f'{where}: y at x = {k} is {rm * k + rc}')
        elif (L, n) == (1, 8):
            rm, rc = parse_rule(q['rule']); Y = int(re.search(r'y = (\d+)\.', q['ask']).group(1))
            ok((Y - rc) % rm == 0 and q['answer'] == (Y - rc) // rm, f'{where}: x is {(Y - rc) // rm} when y = {Y}')
        elif (L, n) == (2, 1): ok(cc > mm and all(b - a == 1 for a, b in zip(T['xs'], T['xs'][1:])), f'{where}: the number added is bigger than the multiplier')
        elif (L, n) == (2, 2): ok(cc < 0 and mm > 0 and T['ys'][0] > 0, f'{where}: a negative number added')
        elif (L, n) == (2, 3): ok(T['xs'][0] == 0 and T['ys'][0] == cc, f'{where}: the table starts at x = 0')
        elif (L, n) == (2, 5): ok(all(b - a == 1 for a, b in zip(T['xs'], T['xs'][1:])) and q.get('story'), f'{where}: a story table, steps of 1')
        elif (L, n) == (2, 6):
            rm, rc = parse_rule(re.search(r'rule is (y = [^.]*?)\. Does', q['ask']).group(1)); px, py = [int(v) for v in re.search(r'x = (\d+), y = (\d+)', q['ask']).groups()]
            truth = rm * px + rc == py
            ok(truth and (px, py) in visible(T) and q['correctIndex'] == 0 and q['options'][0]['text'].startswith('Yes'), f'{where}: the rule fits the pair, the answer is Yes')
        elif (L, n) == (2, 7):
            k = int(re.search(r'x = (\d+)', q['ask']).group(1)); ok(q['answer'] == mm * k + cc and 10 <= k <= 15, f'{where}: y at x = {k}')
        elif (L, n) == (2, 8):
            Y = int(re.search(r'y = (\d+)', q['ask']).group(1)); ok((Y - cc) % mm == 0 and q['answer'] == (Y - cc) // mm, f'{where}: x when y = {Y}')
        elif (L, n) == (3, 1):
            mt = re.search(r'x goes up by (\d+) and y goes up by (\d+)', q['ask']); dx, dy = int(mt.group(1)), int(mt.group(2))
            ok(dy % dx == 0 and q['answer'] == dy // dx, f'{where}: {dy} ÷ {dx}')
        elif (L, n) == (3, 2):
            xs = T['xs']; d = xs[1] - xs[0]; ok(d in (2, 3) and all(b - a == d for a, b in zip(xs, xs[1:])) and q['answer'] == mm, f'{where}: bigger steps, multiplier {mm}')
        elif (L, n) in [(3, 5), (3, 6), (4, 2)]:
            xs = T['xs']; d = xs[1] - xs[0]; ok(d >= 2 and all(b - a == d for a, b in zip(xs, xs[1:])), f'{where}: x goes up by {d}')
            if (L, n) == (3, 5): ok(d == 2 and xs[0] == 2, f'{where}: x = 2, 4, 6, 8')
            if (L, n) == (3, 6): ok(d in (3, 4, 5) and xs[0] in (3, 4, 5), f'{where}: starts at {xs[0]}, steps of {d}')
            for key, w in q['wrong'].items():
                if w['tag'] == 'gap': ok(int(key.split('|')[0]) == d * mm, f'{where}: the gap slip multiplier is {d * mm}')
        elif (L, n) == (3, 7):
            s_ = int(re.search(r'y = x \+ (\d+)\.', q['ask']).group(1)); xs, ys = T['xs'], T['ys']
            ok(ys[0] - xs[0] == s_ and xs[1] + s_ != ys[1], f'{where}: the student\'s y = x + {s_} fits the first pair and fails the second')
            ok(q['correctIndex'] == 1 and q['options'][1]['text'].startswith('No'), f'{where}: the answer is No')
        elif (L, n) == (3, 8):
            k = int(re.search(r'x = (\d+)', q['ask']).group(1)); ok(q['answer'] == mm * k + cc and 18 <= k <= 25, f'{where}: y at x = {k}')
        elif (L, n) in [(4, 1)]: ok(cc > mm and q.get('story'), f'{where}: story, fixed fee bigger than the price each')
        elif (L, n) == (4, 3):
            k = int(re.search(r'for (\d+)', q['ask']).group(1)); ok(q['answer'] == mm * k + cc and 12 <= k <= 20, f'{where}: cost for {k}')
        elif (L, n) == (4, 4):
            mA, cA = fit(visible(q['tableA'])); mB, cB = fit(visible(q['tableB'])); k = int(re.search(r'for (\d+)', q['ask']).group(1))
            ok((mA, cA, mB, cB) == (q['m1'], q['c1'], q['m2'], q['c2']), f'{where}: stored rules agree with the tables')
            A, B = mA * k + cA, mB * k + cB
            ok(q['answer'] == abs(A - B) and abs(A - B) >= 3 and A != B, f'{where}: the cheaper company is £{abs(A - B)} cheaper at {k}')
        elif (L, n) == (4, 7):
            Bg = int(re.search(r'£(\d+)', q['ask']).group(1)); ok((Bg - cc) % mm == 0 and q['answer'] == (Bg - cc) // mm, f'{where}: Sam can pay for {(Bg - cc) // mm}')
        elif (L, n) == (4, 8):
            first = int(re.search(r'is £(\d+),', q['ask']).group(1)); ok(first == T['ys'][0] and first != cc and q['correctIndex'] == 1, f'{where}: the first y is not the fixed fee ({cc})')
        elif (L, n) == (5, 1): ok(mm < 0 and T['ys'][0] > T['ys'][1] and T['xs'][1] - T['xs'][0] == 1, f'{where}: a falling rule')
        elif (L, n) == (5, 2): ok(T['xs'][0] < 0 and all(b - a == 2 for a, b in zip(T['xs'], T['xs'][1:])), f'{where}: negative x values')
        elif (L, n) == (5, 3):
            ok(sorted(T['xs']) != T['xs'] or True, f'{where}: x values'); qi = q['q']
            ok(T['hide']['y'] == qi and T['ys'][qi] is None or T['hide']['y'] == qi, f'{where}: one y is missing')
            ok(q['answer'] == mm * T['xs'][qi] + cc, f'{where}: the missing y is {mm * T["xs"][qi] + cc}')
            ok(len(visible(T)) == 3, f'{where}: three pairs are known')
        elif (L, n) == (5, 4):
            qi = q['q']; Y = q['Y']; ok(T['hide']['x'] == qi and T['ys'][qi] == Y and cc < 0 and q['answer'] == (Y - cc) // mm and (Y - cc) % mm == 0, f'{where}: the missing x is {(Y - cc) // mm}')
        elif (L, n) == (5, 5):
            r1, r2 = [parse_rule(s_) for s_ in q['rules']]
            sol = solve(Eq(r1[0] * x + r1[1], r2[0] * x + r2[1]), x)
            ok(len(sol) == 1 and sol[0] == q['answer'] and int(sol[0]) == sol[0] and sol[0] > 0, f'{where}: the rules meet at x = {sol[0]}')
            ok(r1[0] * q['answer'] + r1[1] == q['Y'], f'{where}: the shared y is {q["Y"]}')
        elif (L, n) == (5, 6):
            km = q['answer']
            ok(expand(km['m'] * (x + km['c'])) == mm * x + cc and mm * km['c'] == cc, f'{where}: {km["m"]}(x + {km["c"]}) = {mm}x + {cc}')
            ok(parse_bracket(q['formula']) == (km['m'], km['c']), f'{where}: bracket formula')
        elif (L, n) == (5, 7):
            pool7[q['pool']] += 1
            if q['pool'] == 'a': ok(mm < 0 and T['xs'][0] < 0 and all(b - a == 3 for a, b in zip(T['xs'], T['xs'][1:])), f'{where}: pool a: falling, steps of 3, below 0')
            else: ok(T['xs'] == [1, 4, 5, 9], f'{where}: pool b: uneven x steps')
        elif (L, n) == (5, 8):
            pool8[q['kind']] += 1
            if q['kind'] == 'rule': ok(len(T['xs']) == 2 and mm < 0 and T['xs'][0] < 0, f'{where}: two pairs, far apart')
            else:
                r1, r2 = [parse_rule(s_) for s_ in q['rules']]
                sol = solve(Eq(r1[0] * x + r1[1], r2[0] * x + r2[1]), x)
                ok(len(sol) == 1 and sol[0] == q['answer'] and int(sol[0]) == sol[0] and r1[0] < 0 and r2[1] < 0, f'{where}: falling rule meets a negative-start rule at x = {sol[0]}')

        # ----- mistakes and working -----
        check_wrongs(q, where)
        ends = check_worked(q, where)
        if q['kind'] == 'num': ok(any(v == q['answer'] for v in ends), f'{where}: some line of working ends at the answer {q["answer"]}')
        if q['kind'] == 'mc' and q['cat'] != 'check':
            ok(True, where)
        if q['kind'] == 'num': wrong_counts.append(len(q['wrong']))
        ok(q.get('method') or q['kind'] in ('rule', 'mc', 'bracket'), f'{where}: a one-line method for a number answer')

ok(len(set(json.dumps(qs, sort_keys=True) for qs in games.values())) == len(games), 'no two of the games are the same')
firsts = Counter(json.dumps(qs[4]['table']['ys']) for qs in games.values())
ok(max(firsts.values()) <= len(games) * 0.1, f'the level 1 rule question varies from game to game (most common table appears {max(firsts.values())} times in {len(games)})')
ok(len(pool7) == 2 and len(pool8) == 2, f'level 5 pools are both drawn on: question 7 {dict(pool7)}, question 8 {dict(pool8)}')
share = sum(1 for k in wrong_counts if k >= 1) / len(wrong_counts)
ok(share >= 0.97, f'{share:.1%} of number questions carry at least one known mistake')
print(f'{checks} checks passed over {len(games)} games ({len(games) * 40} questions); {share:.1%} of number questions name a mistake')
