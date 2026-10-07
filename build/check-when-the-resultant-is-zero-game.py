#!/usr/bin/env python3
"""
Independent check of the Zero Or Not game's generated questions (When The Resultant Is Zero, 10A). The browser dumps N generated games
(JSON, from build/test-when-the-resultant-is-zero-game.js); this script re-derives, from the DATA each question kept:
  - the truth of every "what happens to the speed?" question from the forces drawn (sympy-free integer sums, exact);
  - every missing force at a steady speed, every weight (mass x 9.8, exact rationals), every known-mistake value ("how" must equal
    the value it explains) and every line of working;
  - the right option of every conceptual question against the lesson's own rule (no resultant force: no change in motion; a resultant
    of zero is NOT the same as no forces), written out again here, independently of the game;
  - that "there are no forces" is only ever a RIGHT answer in deep space, and is always a marked mistake anywhere else;
  - the ramp, the pools for the last two questions, no answer cue from option length or position, and that games really differ.

    python3 build/check-when-the-resultant-is-zero-game.py games.json
"""
import json, re, sys
from collections import Counter
from sympy import sympify, Rational

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
G = Rational(98, 10)

PLAN = [(1, 'law'), (1, 'motion'), (1, 'zero'), (1, 'motion'), (1, 'rest'), (1, 'steadyNum2'),
        (2, 'stops'), (2, 'law'), (2, 'motion'), (2, 'steadyNum3'), (2, 'space'), (2, 'missingZero'),
        (3, 'odd'), (3, 'steadyState'), (3, 'skydiverNum'), (3, 'pushIncrease')]
POOL17 = {'topOfPath', 'liftSteady'}; POOL18 = {'engineOff', 'chuteNew'}
CAT = {'law': 'law', 'motion': 'motion', 'stops': 'motion', 'zero': 'noforces', 'rest': 'noforces', 'space': 'noforces', 'odd': 'noforces', 'steadyState': 'noforces',
       'steadyNum2': 'missing', 'steadyNum3': 'missing', 'missingZero': 'missing', 'skydiverNum': 'missing', 'pushIncrease': 'missing', 'topOfPath': 'puzzle', 'liftSteady': 'puzzle', 'engineOff': 'puzzle', 'chuteNew': 'puzzle'}

# ---- the lesson's rule, written out again here ----
TRUE_LAW = {'An object stays at rest, or keeps moving at a constant speed in a straight line, unless a resultant force acts on it.', 'a resultant force acts on it.'}
NO_FORCES_OK_ONLY = {'space'}           # the one place where "no forces" is a correct description
STEADY = re.compile(r'steady|rests|hangs|at rest|floats', re.I)
ZERO_SCEN = {'A car moves at a steady 20 m/s along a flat road.': 'balanced', 'A skydiver falls at a steady speed.': 'balanced', 'A train moves at a steady speed along a straight track.': 'balanced',
             'A boat sails at a steady speed in a straight line.': 'balanced', 'A car speeds up from 10 m/s to 20 m/s.': 'with', 'A ball falls and speeds up.': 'with',
             'A bus slows down as it comes to a stop.': 'against', 'A sledge slows down on rough snow.': 'against'}
ODD_ZERO = {'A book rests on a table.', 'A car moves at a steady 25 m/s on a flat road.', 'A skydiver falls at a steady speed.', 'A lift moves upwards at a steady speed.', 'A boat sails at a steady speed in a straight line.', 'A picture hangs still on a wall.'}
ODD_NOT = {'A stone falls from a cliff and speeds up.', 'A car brakes and slows down.', 'A rocket speeds up as it leaves the ground.', 'A cyclist slows down on a rough path.'}

def along(forces, d): return sum(f['n'] for f in forces if f['dir'] == d)
def check_wrong(q, w):
    ans = q['answer']
    for key, x in q['wrong'].items():
        ok(num(key) != ans, f'{w}: wrong value {key} is not the answer')
        ok(num(x['how']) == num(key), f'{w}: how "{x["how"]}" gives {num(x["how"])}, not {key}')
        ok(x['msg'], f'{w}: wrong value {key} has feedback')
    ok(len(q['wrong']) >= 1, f'{w}: at least one known mistake')
def check_worked(lines, w):
    for line in lines:
        parts = line.split(' = ')
        if len(parts) < 2: continue
        try: vals = [num(re.sub(r'[^0-9.+\-*/() ]', '', p)) for p in parts]
        except Exception: continue
        ok(all(v == vals[-1] for v in vals), f'{w}: worked line "{line}" is not true')
def one_right(q, w):
    ok(sum(1 for o in q['options'] if o['tag'] is None) == 1 and q['options'][q['correctIndex']]['tag'] is None, f'{w}: exactly one right option, and correctIndex is it')
    ok(len({o['text'] for o in q['options']}) == len(q['options']), f'{w}: options all different')
    for o in q['options']:
        if o['tag'] is not None: ok(o.get('msg'), f'{w}: every wrong option names its mistake')
def nofig_forces(f, w):
    ok(all(x['n'] > 0 and x['n'] % 5 == 0 for x in f), f'{w}: forces are positive multiples of 5')
    ok(len({x['name'] for x in f}) == len(f), f'{w}: force names all different')

sigs = set(); pos = Counter(); longest = 0; mcq = 0; lg = Counter(); sht = Counter(); cnt = Counter()
for code, qs in games.items():
    ok(len(qs) == 18, f'{code}: 18 questions')
    ok(len({q['prompt'] + str(q.get('forces')) for q in qs}) == 18, f'{code}: no two questions the same')
    for i, q in enumerate(qs):
        w = f'{code} Q{i+1} ({q["kind"]})'; k = q['kind']
        if i < 16: ok((q['round'], k) == PLAN[i], f'{w}: ramp slot is {PLAN[i]}')
        elif i == 16: ok(k in POOL17 and q['round'] == 3, f'{w}: Q17 from its pool')
        else: ok(k in POOL18 and q['round'] == 3, f'{w}: Q18 from its pool')
        ok(q['cat'] == CAT[k], f'{w}: category {CAT[k]}')
        if 'options' in q:
            one_right(q, w); pos[q['correctIndex']] += 1
            L = [len(o['text']) for o in q['options']]; mcq += 1
            if L[q['correctIndex']] == max(L) and L.count(max(L)) == 1: longest += 1; lg[k] += 1
            if L[q['correctIndex']] == min(L) and L.count(min(L)) == 1: sht[k] += 1
            cnt[k] += 1
        right = q['options'][q['correctIndex']]['text'] if 'options' in q else None
        if k == 'law':
            ok(right in TRUE_LAW, f'{w}: the right option is the first law')
            for o in q['options']:
                if o['text'] not in TRUE_LAW: ok(o['tag'] in ('needforce', 'anyforce', 'natural', 'balancedchange', 'noforces'), f'{w}: known mistake {o["tag"]}')
            ok(any(o['tag'] == 'anyforce' for o in q['options']), f'{w}: the "any force" mistake is offered (a resultant, not just any force)')
        elif k == 'motion':
            f = q['forces']; nofig_forces(f, w); d = q['moving']; other = 'left' if d == 'right' else 'right'
            R = along(f, d) - along(f, other)
            ok(all(x['dir'] in ('left', 'right') for x in f), f'{w}: all forces along one line')
            ok(R == q['R'], f'{w}: resultant {R}')
            truth = 'same' if R == 0 else 'up' if R > 0 else 'down'
            ok(truth == q['truth'], f'{w}: truth {truth}')
            want = {'same': 'It stays at the same speed.', 'up': 'It speeds up.', 'down': 'It slows down.'}[truth]
            ok(right == want, f'{w}: right option "{right}" for a resultant of {R} ({d} is the way it moves)')
            ok(q['figure']['moving'] == d and f'to the {d}' in q['prompt'], f'{w}: the prompt and the figure agree on the way it moves')
            ok(sum(1 for x in f if x['dir'] == d) >= 1 and sum(1 for x in f if x['dir'] == other) >= 1, f'{w}: forces both ways')
        elif k == 'stops':
            ok(right.startswith('A resultant force acts against its motion'), f'{w}: right option is a resultant force against the motion')
            ok(any(o['tag'] == 'noforcesstops' for o in q['options']), f'{w}: the "no forces, so it stops" mistake is offered')
        elif k == 'zero':
            truth = ZERO_SCEN[q['item']['text']]; ok(truth == q['truth'], f'{w}: truth {truth}')
            R = {'balanced': 'Zero. The forces are balanced.', 'with': 'Not zero. The resultant force is in the direction of motion.', 'against': 'Not zero. The resultant force is against the direction of motion.'}[truth]
            ok(right == R, f'{w}: right option')
            none = [o for o in q['options'] if o['text'] == 'Zero. There are no forces on it.']
            ok(len(none) == 1 and none[0]['tag'] == 'noforces', f'{w}: "there are no forces" is offered, and marked as the mistake')
        elif k == 'rest':
            ok(right.startswith('Weight acts down and') and right.endswith('They are equal, so the resultant is 0 N.'), f'{w}: right option: weight down, an up force, equal, resultant 0')
            ok(any(o['tag'] == 'noforces' for o in q['options']), f'{w}: the "no forces" mistake is offered')
        elif k == 'steadyState':
            ok(f'{q["D"]} N, the same as the driving force' in right and '0 N' in right and q['D'] % 100 == 0, f'{w}: right option says the resistive forces equal the driving force, {q["D"]} N')
            ok(any(o['tag'] == 'noforces' for o in q['options']) and any(o['tag'] == 'drivebigger' for o in q['options']), f'{w}: both big mistakes are offered')
        elif k == 'space':
            ok(right == f'It keeps moving at {q["v"]} {q["item"]["unit"]} in a straight line, as nothing acts on it.' and q['v'] in q['item']['vals'], f'{w}: right option keeps the speed in a straight line')
            ok('far from every star and planet' in q['prompt'], f'{w}: the prompt says it is far from everything')
        elif k == 'odd':
            ok(q['notzero'] in ODD_NOT and len(q['zero']) == 3 and all(z in ODD_ZERO for z in q['zero']), f'{w}: three zero-resultant cases and one that is not')
            ok(right == q['notzero'], f'{w}: right option is the one with a resultant')
        elif k in ('topOfPath', 'engineOff', 'chuteNew'):
            if k == 'topOfPath': ok(right.startswith('Only the weight acts.') and any(o['tag'] == 'restzero' for o in q['options']), f'{w}: right option: only the weight acts; "at rest, so zero" offered as the mistake')
            if k == 'engineOff': ok(right == f'It keeps moving at {q["s2"]} km/s in a straight line.' and q['s2'] > q['s1'], f'{w}: keeps the NEW speed')
            if k == 'chuteNew': ok(right.startswith('It is equal to her weight'), f'{w}: air resistance equals the weight')
        elif k == 'steadyNum2':
            f = q['forces']; ok(len(f) == 2 and f[0]['n'] == f[1]['n'] == q['P'] == q['answer'], f'{w}: steady speed, so the two forces are equal')
            ok(f[1]['label'].endswith(' X') and f[0]['dir'] == 'right' and f[1]['dir'] == 'left', f'{w}: the unknown is labelled X')
            check_wrong(q, w); check_worked(q['worked'], w)
            ok(any(x['tag'] == 'noforces' for x in q['wrong'].values()), f'{w}: the "no force" mistake (0) is a known mistake')
        elif k == 'steadyNum3':
            f = q['forces']; nofig_forces([dict(x) for x in f], w)
            ok(along(f, 'right') == along(f, 'left') and q['answer'] == q['D'] - q['A'] and q['answer'] > 0, f'{w}: balanced diagram, X = {q["D"]} − {q["A"]}')
            ok(f[2]['n'] == q['answer'] and f[2]['label'].endswith(' X'), f'{w}: the unknown arrow is drawn to scale and labelled X')
            check_wrong(q, w); check_worked(q['worked'], w)
        elif k == 'missingZero':
            f = q['forces']; ok(along(f, 'right') == along(f, 'left') and q['answer'] == q['a'] + q['b'] - q['c'] > 0, f'{w}: balanced, X = {q["a"]} + {q["b"]} − {q["c"]}')
            ok(f[3]['n'] == q['answer'] and f[3]['label'] == 'Drag X', f'{w}: unknown arrow to scale')
            check_wrong(q, w); check_worked(q['worked'], w)
        elif k == 'skydiverNum':
            ok(num(str(q['m'])) * G == q['Wt'] == q['answer'], f'{w}: weight {q["m"]} × 9.8'); check_wrong(q, w); check_worked(q['worked'], w)
            ok(str(q['m']) in q['wrong'] and str(10 * q['m']) in q['wrong'], f'{w}: mass and g = 10 are the known mistakes')
        elif k == 'liftSteady':
            ok(num(str(q['m'])) * G == q['Wt'] == q['answer'], f'{w}: tension = weight = {q["m"]} × 9.8'); check_wrong(q, w); check_worked(q['worked'], w)
        elif k == 'pushIncrease':
            ok(q['answer'] == q['N2'] - q['P'] > 0 and q['N2'] > q['P'], f'{w}: {q["N2"]} − {q["P"]}'); check_wrong(q, w); check_worked(q['worked'], w)
            ok('0' in q['wrong'] and q['wrong']['0']['tag'] == 'stillsteady', f'{w}: "still zero" is a known mistake')
        # "there are no forces" is only RIGHT in deep space
        if 'options' in q and k not in NO_FORCES_OK_ONLY:
            ok(not re.search(r'\bno forces?\b', right, re.I) or k == 'law' and 'there are no forces' in right and False, f'{w}: the right option never says "no forces" outside deep space')
            for o in q['options']:
                if re.search(r'\bno forces?\b', o['text'], re.I): ok(o['tag'] is not None, f'{w}: "{o["text"]}" is marked as a mistake')
    sigs.add(tuple(q['prompt'] for q in qs))

ok(len(sigs) > 250, f'games really differ ({len(sigs)} different out of {len(games)})')
tot = sum(pos.values())
for idx, c in pos.items(): ok(c / tot > 0.15, f'right answer position {idx} is used {c}/{tot}')
ok(longest / mcq < 0.6, f'the right option is the longest in {longest}/{mcq} (too many)')
for kk in cnt:
    ok(lg[kk] / cnt[kk] < 0.75 and sht[kk] / cnt[kk] < 0.75, f'{kk}: option length is no cue (longest {lg[kk]}/{cnt[kk]}, shortest {sht[kk]}/{cnt[kk]})')
print(f'{checks} checks passed across {len(games)} games; right option is the longest in {longest}/{mcq}')
