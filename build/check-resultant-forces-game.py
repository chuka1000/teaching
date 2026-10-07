#!/usr/bin/env python3
"""
Independent check of the Net Force game's generated questions (Resultant Forces, 10A). The browser dumps N generated
games (JSON, from build/test-resultant-forces-game.js); this script re-derives, from the DATA each question kept:
  - the right bin of every contact / non-contact item (written out again here, from the lesson's own test: do the
    two things need to touch?), and the right force in every "name the force" item;
  - the resultant of every figure (sympy, exact), the right option, and every known-mistake value ("how" must
    equal the value it explains); every line of working;
  - that every figure is along ONE line for the sum (vertical forces, if drawn, are a weight and reaction that are equal);
  - the ramp (the right skills in the right slots), the pools for the last two questions, no answer cue from the
    option text or position, and that games really differ.

    python3 build/check-resultant-forces-game.py games.json
"""
import json, re, sys
from collections import Counter
from sympy import sympify

games = json.load(open(sys.argv[1]))
checks = 0
def fail(msg): print('FAIL:', msg); sys.exit(1)
def ok(cond, msg):
    global checks
    if not cond: fail(msg)
    checks += 1
def num(s):
    s = str(s).strip().replace('×', '*').replace('−', '-').replace('÷', '/')
    if s.startswith('|') and s.endswith('|'): return abs(sympify(s[1:-1]))
    return sympify(s)

# ---- the items, written out again here: contact = the two things touch ----
CONTACT = {'friction', 'tension', 'thrust', 'air', 'reaction', 'upthrust'}
NON = {'weight', 'balloon', 'magnet', 'fall'}
ok(not (CONTACT & NON), 'no item is in both bins')
NAMES = {
    'chute': 'Air resistance', 'bucket': 'Tension', 'boat': 'Upthrust',
    'ball': 'Weight', 'box': 'Friction', 'book': 'Reaction force',
}
CONTACT_FORCES = ['Friction', 'Tension', 'Reaction force', 'Air resistance', 'Upthrust', 'Thrust', 'Drag', 'Push', 'Driving force', 'Water resistance']
NON_FORCES = ['Weight', 'Magnetic force', 'Electrostatic force']

PLAN = [(1, 'contact'), (1, 'resMCQ'), (1, 'contact'), (1, 'resMCQ'), (1, 'nameForce'), (1, 'resNum'),
        (2, 'resMCQ'), (2, 'balanced'), (2, 'contact'), (2, 'resNum'), (2, 'nameForce'), (2, 'missingBalanced'),
        (3, 'resNum'), (3, 'oddOne'), (3, 'steady'), (3, 'missingResultant')]
POOL17 = {'liftG', 'tug'}; POOL18 = {'parachute', 'missing3'}

def horizontal(forces):
    r = 0
    for f in forces:
        if f['dir'] == 'right': r += f['n']
        elif f['dir'] == 'left': r -= f['n']
    return r
def check_figure(forces, where):
    ok(all(f['n'] > 0 and f['n'] % 5 == 0 for f in forces), f'{where}: forces are positive multiples of 5')
    names = [f['name'] for f in forces]
    ok(len(set(names)) == len(names), f'{where}: force names are all different')
    vert = [f for f in forces if f['dir'] in ('up', 'down')]
    if vert:
        up = sum(f['n'] for f in vert if f['dir'] == 'up'); dn = sum(f['n'] for f in vert if f['dir'] == 'down')
        ok(up == dn, f'{where}: vertical forces balance')
        ok({f['name'] for f in vert} == {'Weight', 'Reaction force'}, f'{where}: vertical forces are weight and reaction')
def direction_text(R):
    return 'to the right' if R > 0 else 'to the left'
def check_wrong(q, where):
    ans = q['answer']
    for key, w in q['wrong'].items():
        ok(num(key) != ans, f'{where}: wrong value {key} is not the answer')
        ok(num(w['how']) == num(key), f'{where}: how "{w["how"]}" gives {num(w["how"])}, not {key}')
        ok(w['msg'], f'{where}: wrong value {key} has feedback')
    ok(len(q['wrong']) >= (1 if q['kind'] == 'tug' else 2), f'{where}: known mistakes')  # a tug with equal pulls has only one
def check_worked(lines, where):
    for line in lines:
        parts = line.split(' = ')
        if len(parts) < 2: continue
        try:
            vals = [num(re.sub(r'[^0-9.+\-*/() ]', '', p)) for p in parts]
        except Exception:
            continue
        ok(all(v == vals[-1] for v in vals), f'{where}: worked line "{line}" is not true')

sigs = set(); first_correct = Counter()
for code, qs in games.items():
    ok(len(qs) == 18, f'{code}: 18 questions')
    ok(len(set(q['prompt'] + str(q.get('forces')) for q in qs)) == 18, f'{code}: no two questions the same')
    for i, q in enumerate(qs):
        w = f'{code} Q{i+1} ({q["kind"]})'
        if i < len(PLAN):
            ok((q['round'], q['kind']) == PLAN[i], f'{w}: ramp slot is {PLAN[i]}')
        elif i == 16: ok(q['kind'] in POOL17 and q['round'] == 3, f'{w}: Q17 from pool')
        else: ok(q['kind'] in POOL18 and q['round'] == 3, f'{w}: Q18 from pool')
        k = q['kind']
        if k == 'contact':
            it = q['item']
            ok(it['id'] in CONTACT | NON, f'{w}: known item {it["id"]}')
            want = 'contact' if it['id'] in CONTACT else 'non'
            ok(it['bin'] == want, f'{w}: {it["id"]} is {want}')
            ok(q['options'][q['correctIndex']]['bin'] == want, f'{w}: right option is {want}')
            ok(sum(1 for o in q['options'] if o['bin'] == want) == 1, f'{w}: exactly one right option')
        elif k == 'nameForce':
            it = q['item']
            ok(NAMES[it['id']] == it['right'], f'{w}: right force for {it["id"]}')
            ok(q['options'][q['correctIndex']]['text'] == it['right'], f'{w}: right option text')
            ok(len({o['text'] for o in q['options']}) == len(q['options']), f'{w}: options all different')
        elif k == 'oddOne':
            names = q['names']
            odd = [n for n in names if n in NON_FORCES]
            ok(len(odd) == 1 and q['odd'] == odd[0], f'{w}: exactly one non-contact force, and it is the odd one')
            ok(all(n in CONTACT_FORCES for n in names if n != q['odd']), f'{w}: the other three are contact forces')
            ok(q['options'][q['correctIndex']]['text'] == q['odd'], f'{w}: right option is the odd one')
        elif k in ('resMCQ', 'balanced', 'resNum'):
            check_figure(q['forces'], w)
            R = horizontal(q['forces'])
            ok(R == q['R'] or abs(R) == abs(q['R']), f'{w}: resultant {R}')
            if k == 'resMCQ':
                right = q['options'][q['correctIndex']]['text']
                if R == 0: ok('0 N' in right and 'alanced' in right, f'{w}: zero option')
                else: ok(right == f'{abs(R)} N {direction_text(R)}', f'{w}: right option "{right}" for {R}')
                texts = [o['text'] for o in q['options']]
                ok(sum(1 for t in texts if t == right) == 1, f'{w}: right option appears once')
                for o in q['options']:
                    if o['text'] != right: ok(o.get('msg'), f'{w}: wrong option has feedback')
            elif k == 'balanced':
                right = q['options'][q['correctIndex']]['text']
                if R == 0: ok(right.startswith('Balanced'), f'{w}: balanced')
                else:
                    ok(right.startswith('Not balanced'), f'{w}: not balanced')
                    ok(right.endswith('right' if R > 0 else 'left'), f'{w}: direction {R}')
            else:
                ok(q['answer'] == abs(R), f'{w}: answer is |{R}|')
                check_wrong(q, w); check_worked(q['worked'], w)
        elif k == 'steady':
            ok('0 N' in q['options'][q['correctIndex']]['text'] and str(q['W']) in q['options'][q['correctIndex']]['text'], f'{w}: right option says 0 N and the weight')
            ok(sum(1 for o in q['options'] if o['tag'] is None) == 1, f'{w}: one right option')
            ok(any(o['tag'] == 'noforces' for o in q['options']), f'{w}: the "no forces" mistake is offered')
        elif k == 'missingBalanced':
            ok(q['answer'] == q['a'] + q['b'] - q['c'], f'{w}: answer')
            ok(q['answer'] > 0, f'{w}: positive'); check_wrong(q, w); check_worked(q['worked'], w)
        elif k == 'missingResultant':
            ok(q['answer'] == q['A'] - q['R'] - q['B'] and q['answer'] > 0, f'{w}: answer')
            check_wrong(q, w); check_worked(q['worked'], w)
        elif k == 'tug':
            hi, lo = q['a'] * q['p'], q['b'] * q['q']
            ok(q['answer'] == abs(hi - lo) and hi != lo, f'{w}: answer')
            check_wrong(q, w); check_worked(q['worked'], w)
        elif k == 'liftG':
            from sympy import Rational
            wt = num(str(q['m'])) * Rational(98, 10)
            ok(wt == q['Wt'], f'{w}: weight {wt}')
            ok(q['answer'] == abs(q['T'] - wt), f'{w}: answer')
            check_wrong(q, w); check_worked(q['worked'], w)
        elif k == 'parachute':
            ok(q['answer'] == q['Wt'] - q['R1'] and q['answer'] > 0, f'{w}: answer')
            check_wrong(q, w); check_worked(q['worked'], w)
        elif k == 'missing3':
            ok(q['answer'] == q['A'] - q['R'] - q['B'] - q['C'] and q['answer'] > 0, f'{w}: answer')
            check_wrong(q, w); check_worked(q['worked'], w)
        else:
            fail(f'{w}: unknown kind')
        if 'correctIndex' in q: first_correct[q['correctIndex']] += 1
        # no cue: the right option is not the longest every time (checked in bulk below)
    sigs.add(tuple(q['prompt'] for q in qs))

ok(len(sigs) > 250, f'games really differ ({len(sigs)} different out of {len(games)})')
tot = sum(first_correct.values())
for idx, c in first_correct.items():
    ok(c / tot > 0.15, f'right answer position {idx} is used {c}/{tot}')
# the right MCQ option is not always the longest
longest = 0; mcq = 0
for qs in games.values():
    for q in qs:
        if 'options' in q and q['kind'] in ('resMCQ', 'steady', 'balanced'):
            mcq += 1
            L = [len(o['text']) for o in q['options']]
            if L[q['correctIndex']] == max(L) and L.count(max(L)) == 1: longest += 1
ok(longest / mcq < 0.6, f'right option is the longest in {longest}/{mcq} (too many)')
print(f'{checks} checks passed across {len(games)} games; right option is the longest in {longest}/{mcq}')
