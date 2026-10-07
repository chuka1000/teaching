#!/usr/bin/env python3
"""
Independent check of the Family Tree game's generated questions (More Evidence, 8I). The browser
dumps N generated games (JSON, from build/test-more-evidence-game.js); this script re-derives
every answer, every known-mistake value and every line of working from the DATA each question
kept (the structures, the score tables, the DNA matrices, the trees with their branch lengths),
and checks the rules: exactly one correct option in each multiple-choice question, the right
skills in the right order (the ramp), the pools for the last two questions, and that games
really differ from student to student.

    python3 build/check-more-evidence-game.py games.json
"""
import json, sys
from collections import Counter
from itertools import combinations
from sympy import sympify, Rational

games = json.load(open(sys.argv[1]))
checks = 0
def fail(msg): print('FAIL:', msg); sys.exit(1)
def ok(cond, msg):
    global checks
    if not cond: fail(msg)
    checks += 1
def num(s): return sympify(str(s).replace('×', '*').replace('−', '-').replace('÷', '/'))

FORELIMBS = {'human arm': 'grasping', 'cat foreleg': 'walking', 'whale flipper': 'swimming', 'bat wing': 'flying', 'horse foreleg': 'running', 'bird wing': 'flying'}
BONES = {'human arm': [1, 2, 8, 5], 'cat foreleg': [1, 2, 7, 4], 'whale flipper': [1, 2, 6, 5], 'bat wing': [1, 2, 8, 5], 'horse foreleg': [1, 2, 6, 1], 'bird wing': [1, 2, 4, 3]}
ANALOGOUS = [{'bird wing', 'butterfly wing'}, {'bat wing', 'butterfly wing'}, {'whale flipper', 'shark fin'}, {'bird wing', 'dragonfly wing'}, {'bat wing', 'dragonfly wing'}]
WINGS = {'butterfly wing', 'dragonfly wing'}
BONE_ORDER = ['the upper-arm bone', 'the two lower-arm bones', 'the wrist bones', 'the hand bones', 'the finger bones']
MISCON_R = ['Nothing turns into another animal. Early embryos share features because of a shared ancestor.', 'They are different species. They look alike early on because they share an ancestor.', 'Human embryos have pharyngeal arches, not working gills. They show a shared ancestor, not that humans are fish.']
EVIDENCE = {
    'Bones': ['Scientists compare the arm bones of a bat and a cat.', 'Scientists count the bones in a whale flipper and a human hand.', 'Scientists study the bones in the wing of a bird.'],
    'Embryos': ['Scientists watch a fish embryo and a chicken embryo grow.', 'Scientists compare the tails of very young embryos.', 'Scientists look for pharyngeal arches in a human embryo.'],
    'DNA': ['Scientists compare the DNA letters of a human and a mouse.', 'Scientists count the differences in the DNA of two species.', 'Scientists read the DNA of a bacterium.'],
    'Fossils': ['Scientists dig a shell out of a layer of rock.', 'Scientists compare the ages of two layers of rock.', 'Scientists study a fossil bone found in a cliff.']}
KIND_OF = {s: k for k, v in EVIDENCE.items() for s in v}

KINDS = ['homPair', 'term', 'classify', 'order', 'suggests', 'oddOne', 'features', 'closest', 'miscon', 'whyAlike', 'diff', 'evidence', 'percentSame', 'closestRel', 'pairMRCA', 'treeSister']
CATS = ['bones'] * 6 + ['embryos'] * 6 + ['dna'] * 3 + ['trees', 'puzzle', 'puzzle']
allowed17 = {'pathSum', 'threePoint'}; allowed18 = {'clock', 'clockGap'}

def one_correct(q, where):
    o = q['options']
    ok(len(o) == 4 and len({x['text'] for x in o}) == 4, f'{where}: four different options')
    good = [i for i, x in enumerate(o) if x.get('tag') is None]
    ok(good == [q['correctIndex']], f'{where}: exactly one correct option and it is correctIndex ({good}, {q["correctIndex"]})')
    for i, x in enumerate(o):
        if i != q['correctIndex']: ok(x.get('tag') and x.get('msg'), f'{where}: wrong option {i} needs a tag and a message')

def check_arith(lines, where):
    for line in lines:
        sides = [num(p) for p in line.split(' = ')]
        ok(all(v == sides[0] for v in sides), f'{where}: worked line "{line}" is not true')
def check_wrongs(q, where):
    for value, w in q['wrong'].items():
        ok(num(w['how']) == int(value), f'{where}: mistake {w["tag"]} "{w["how"]}" is not {value}')
        ok(int(value) != q['answer'] and int(value) > 0, f'{where}: mistake equals the answer or is not positive')
        ok(w.get('tag') and w.get('msg'), f'{where}: mistake tag or message')
    ok(len(q['wrong']) >= 1, f'{where}: at least one named mistake')
    ok(str(q['answer']) not in q['wrong'], f'{where}: answer listed as a mistake')

# ---- trees ----
def leaves(t): return [t['n']] if 'n' in t else sum((leaves(k) for k in t['k']), [])
def path_to(t, x):
    """list of edge lengths from the root down to leaf x"""
    if 'n' in t: return [] if t['n'] == x else None
    for k, l in zip(t['k'], t['l']):
        r = path_to(k, x)
        if r is not None: return [l] + r
    return None
def tdist(t, a, b):
    if 'n' in t: return None
    for k in t['k']:
        if a in leaves(k) and b in leaves(k): return tdist(k, a, b)
    return sum(path_to(t, a)) + sum(path_to(t, b))
def sister(t, x):
    if 'n' in t: return None
    for i in (0, 1):
        if 'n' in t['k'][i] and t['k'][i]['n'] == x: return t['k'][1 - i].get('n')
        r = sister(t['k'][i], x)
        if r: return r
    return None
def path_terms(t, a, b):
    if 'n' in t: return []
    for k in t['k']:
        if a in leaves(k) and b in leaves(k): return path_terms(k, a, b)
    pa, pb = path_to(t, a), path_to(t, b)
    return list(reversed(pa)) + pb

for code, qs in games.items():
    ok(len(qs) == 18, f'{code}: {len(qs)} questions')
    ok([q['cat'] for q in qs] == CATS, f'{code}: categories {[q["cat"] for q in qs]}')
    ok([q['kind'] for q in qs[:16]] == KINDS, f'{code}: kinds {[q["kind"] for q in qs[:16]]}')
    ok(qs[16]['kind'] in allowed17 and qs[17]['kind'] in allowed18, f'{code}: pools {qs[16]["kind"]}, {qs[17]["kind"]}')
    for q in qs:
        k = q['kind']; where = f"{code} R{q['round']}Q{q['n']} {k}"
        if 'options' in q: one_correct(q, where)
        good = q['options'][q['correctIndex']] if 'options' in q else None
        if k == 'homPair':
            a, b = good['pair']; ok(a in FORELIMBS and b in FORELIMBS and FORELIMBS[a] != FORELIMBS[b] and a != b, f'{where}: correct pair is two limbs with different jobs')
            ok(BONES[a][:2] == BONES[b][:2], f'{where}: same upper and lower bone counts')
            for i, o in enumerate(q['options']):
                if i != q['correctIndex']: ok({*o['pair']} in ANALOGOUS, f'{where}: distractor is a known analogous pair')
        elif k == 'term':
            ok(good['word'] == 'homologous', f'{where}: homologous is right')
        elif k == 'classify':
            a, b = q['pair']
            if a in FORELIMBS and b in FORELIMBS and FORELIMBS[a] != FORELIMBS[b]: want = 'Homologous'
            elif {a, b} in ANALOGOUS: want = 'Analogous'
            else: want = 'Neither'
            ok(good['word'] == want, f'{where}: {a} / {b} is {want}, not {good["word"]}')
        elif k == 'order':
            ok(good['order'] == BONE_ORDER, f'{where}: bone order')
            for i, o in enumerate(q['options']):
                if i != q['correctIndex']: ok(o['order'] != BONE_ORDER and sorted(o['order']) == sorted(BONE_ORDER), f'{where}: distractor is a shuffle')
        elif k == 'suggests':
            ok(good['text'] == 'They share a common ancestor.', f'{where}: common ancestor')
            a, b = q['pair']; ok(a in FORELIMBS and b in FORELIMBS and FORELIMBS[a] != FORELIMBS[b], f'{where}: pair is homologous')
        elif k == 'oddOne':
            rows = q['rows']; zero = [r['n'] for r in rows if r['b'] == [0, 0, 0, 0]]
            ok(len(zero) == 1 and zero[0] in WINGS and good['name'] == zero[0], f'{where}: odd one out is the one with no bones')
            for r in rows:
                if r['n'] not in WINGS: ok(r['b'] == BONES[r['n']], f'{where}: bone counts for {r["n"]}')
            ok(len(q['figure']['rows']) == 4, f'{where}: table rows')
        elif k == 'features':
            ok(good['text'] == 'A tail and pharyngeal arches.', f'{where}: features')
        elif k == 'closest':
            rows = q['rows']; best = max(rows, key=lambda r: r['s'])
            ok(len({r['s'] for r in rows}) == len(rows) and good['name'] == best['n'], f'{where}: highest score wins')
            ok([[r['n'].capitalize(), r['s']] for r in rows] == q['figure']['rows'], f'{where}: the table shows the rows')
        elif k == 'miscon':
            ok(good['text'] == MISCON_R[q['statement']], f'{where}: rebuttal matches its statement')
        elif k == 'whyAlike':
            ok(good['text'] == 'They share a common ancestor.', f'{where}: common ancestor')
        elif k == 'diff':
            rows = q['rows']; sc = [r['s'] for r in rows]
            ok(sc == sorted(sc, reverse=True) and q['answer'] == sc[0] - sc[2], f'{where}: answer')
            check_arith(q['worked'], where); check_wrongs(q, where)
        elif k == 'evidence':
            ok(good['kind'] == KIND_OF[q['statement']], f'{where}: kind of evidence')
        elif k == 'percentSame':
            T, N = q['T'], q['N']; ok(T in (200, 500, 1000) and 0 < N < T and (N * 100) % T == 0, f'{where}: T, N')
            ok(q['answer'] == Rational((T - N) * 100, T), f'{where}: answer'); check_arith(q['worked'], where); check_wrongs(q, where)
        elif k in ('closestRel', 'pairMRCA'):
            m, names = q['matrix'], q['names']
            ok(all(m[a][a] == 0 and m[a][b] == m[b][a] and (a == b or m[a][b] > 0) for a in names for b in names), f'{where}: matrix symmetric')
            ok(all(m[a][b] % 2 == 0 for a in names for b in names), f'{where}: even differences (clock)')
            for a, b, c in combinations(names, 3):   # a steady clock: the two biggest of any three are equal
                d = sorted([m[a][b], m[a][c], m[b][c]]); ok(d[1] == d[2], f'{where}: not a clock-like table {a}{b}{c}')
            if k == 'closestRel':
                x = q['target']; ds = sorted((m[x][o], o) for o in names if o != x)
                ok(ds[0][0] < ds[1][0] and good['name'] == ds[0][1], f'{where}: closest relative')
            else:
                pairs = sorted((m[a][b], a, b) for a, b in combinations(names, 2))
                ok(pairs[0][0] < pairs[1][0] and {*good['pair']} == {pairs[0][1], pairs[0][2]}, f'{where}: pair with fewest differences')
            ok(len(q['figure']['rows']) == 5, f'{where}: table')
        elif k == 'treeSister':
            t = q['tree']; ok(len(leaves(t)) == 5 and len(set(leaves(t))) == 5, f'{where}: five species'); ok(q['figure']['tree'] == t, f'{where}: picture is the tree')
            s = sister(t, q['target']); ok(s is not None and good['name'] == s, f'{where}: sister')
        elif k == 'pathSum':
            t = q['tree']; a, b = q['pair']; ok(q['figure']['tree'] == t and q['figure']['showLen'], f'{where}: picture is the tree')
            d = tdist(t, a, b); ok(q['answer'] == d, f'{where}: answer {q["answer"]} vs {d}')
            terms = path_terms(t, a, b); ok(sum(terms) == d and len(terms) >= 3, f'{where}: path terms')
            check_arith(q['worked'], where); ok(q['worked'][0].split(' = ')[0] == ' + '.join(map(str, terms)), f'{where}: working shows the path'); check_wrongs(q, where)
        elif k == 'threePoint':
            t3 = q['tree3']; A, B, C = t3['A'], t3['B'], t3['C']; tr = q['figure']['tree']
            ok(tdist(tr, A, B) == t3['x'] and tdist(tr, A, C) == t3['y'] and tdist(tr, B, C) == t3['z'], f'{where}: the numbers agree with the tree')
            anc = [(tr['k'][i]) for i in (0, 1) if 'n' not in tr['k'][i]][0]        # the node joining B and C
            ok({*leaves(anc)} == {B, C}, f'{where}: B and C are joined below the root')
            ok(q['answer'] == Rational(t3['x'] + t3['y'] - t3['z'], 2) and q['answer'] == sum(tr['l'][i] for i in (0, 1) if 'n' in tr['k'][i]) + tr['l'][[i for i in (0, 1) if 'n' not in tr['k'][i]][0]], f'{where}: answer')
            check_arith(q['worked'], where); check_wrongs(q, where)
        elif k == 'clock':
            D, R = q['D'], q['R']; ok(D % 2 == 0 and q['answer'] == Rational(D, 2) * R, f'{where}: answer'); check_arith(q['worked'], where); check_wrongs(q, where)
        elif k == 'clockGap':
            x, z, R = q['x'], q['z'], q['R']; T1, T2 = Rational(x, 2), Rational(z, 2)
            ok(T1 > T2 >= 1 and q['answer'] == (T1 - T2) * R, f'{where}: answer'); check_arith(q['worked'], where); check_wrongs(q, where)
        else: fail(f'{where}: unknown kind')
        if 'answer' in q and 'options' not in q: ok(isinstance(q['answer'], int) and 0 < q['answer'] <= 999999, f'{where}: answer range')
print(f'{len(games)} generated games, {checks} checks passed')

q17 = Counter(qs[16]['kind'] for qs in games.values()); q18 = Counter(qs[17]['kind'] for qs in games.values())
print('Q17 kinds:', dict(q17), ' Q18 kinds:', dict(q18)); ok(len(q17) == 2 and len(q18) == 2, 'every pool item appears')
def named(q): return ('options' in q) or len(q.get('wrong', {})) > 0
share = sum(named(q) for qs in games.values() for q in qs) / (18 * len(games)); print(f'questions with a named mistake: {100 * share:.0f}%'); ok(share > 0.99, 'nearly every question names a mistake')
sigs = Counter(tuple(q['disp'] for q in qs) for qs in games.values()); print(f'distinct games: {len(sigs)} of {len(games)}'); ok(len(sigs) == len(games), 'two students got exactly the same game')
first = Counter(qs[0]['disp'] for qs in games.values()); print(f'distinct Q1: {len(first)}; most common appears {first.most_common(1)[0][1]} times in {len(games)}')
last = Counter(qs[17]['disp'] for qs in games.values()); print(f'distinct Q18: {len(last)}; most common appears {last.most_common(1)[0][1]} times in {len(games)}')
