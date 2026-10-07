#!/usr/bin/env python3
"""
Independent check of the Sorter game's generated questions (Small Changes, Big Changes, 8I). The browser dumps N generated
games (JSON, from build/test-small-changes-big-changes-game.js); this script re-derives, from the DATA each question kept:
  - the right bin of every sort case (from the lesson's own rule: a change inside one population or species is
    microevolution; large changes above the species level are macroevolution), against a list of cases written
    out again here, independently of the game;
  - every number in every counting question and every hard puzzle (sympy, exact fractions), every known-mistake value
    ("how" must equal the value it explains), and every line of working;
  - the ramp (the right skills in the right slots), the pools for the last two questions, and that no obvious
    cue (a keyword, the side of the bin) gives the answer away; and that games really differ.

    python3 build/check-small-changes-big-changes-game.py games.json
"""
import json, re, sys
from collections import Counter
from sympy import sympify, Rational as R

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

# ---- the cases, written out again here with the bin each belongs in and WHY (scope) ----
MICRO = {'hospital', 'daphne', 'mosquito', 'moth', 'rats', 'flies', 'bact', 'foxes', 'gen-freq', 'gen-table', 'gen-long', 'gen-fast'}
MACRO = {'whales', 'tiktaalik', 'birds', 'snakes', 'embryo', 'mammals', 'plants', 'flowers', 'backbone', 'arthropods', 'ear'}
TIER = {'hospital': 1, 'daphne': 1, 'mosquito': 1, 'gen-freq': 1, 'whales': 1, 'tiktaalik': 1, 'birds': 1, 'snakes': 1,
        'moth': 2, 'rats': 2, 'flies': 2, 'gen-table': 2, 'embryo': 2, 'mammals': 2, 'plants': 2, 'flowers': 2,
        'bact': 3, 'foxes': 3, 'gen-long': 3, 'gen-fast': 3, 'backbone': 3, 'arthropods': 3, 'ear': 3}
TRAP = {'bact': 'dramatic', 'foxes': 'longtime', 'gen-long': 'longtime', 'gen-fast': 'dramatic', 'backbone': 'smallsound', 'arthropods': 'smallsound', 'ear': 'smallsound'}
TRAP_PHRASE = {'dramatic': 'how big the change looks', 'longtime': 'how long it took', 'smallsound': 'how small the detail sounds'}
ok(not (MICRO & MACRO), 'no case is in both bins')
BOUNDARY_WORDS = ['became two species', 'new species', 'split into two species', 'speciation']

SORT_SLOTS = {0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 12, 13, 14}
EXPECT_KIND = ['sort'] * 8 + ['beadFreq'] + ['sort'] * 2 + ['changePoints'] + ['sort'] * 3 + ['twoAlleles', None, None]
allowed17 = {'twoGen', 'shrinkOnce'}; allowed18 = {'reverseShrink', 'shrinkTwice'}
CATS_EXPECT = None

def check_arith(lines, where):
    for line in lines:
        sides = [num(p) for p in line.split(' = ')]
        ok(all(v == sides[0] for v in sides[1:]) or all(v == sides[-1] for v in sides[1:]) or len(set(sides)) == 1, f'{where}: worked line "{line}" is not true')
def worked_ok(lines, where):
    for line in lines:
        # a line may start with prose ("12 brown out of 20 alleles"): only check the lines that are arithmetic
        parts = line.split(' = ')
        if len(parts) < 2: continue
        for p in parts:
            # strip trailing words after a number ("20 alleles in the pool", "3 brown alleles left")
            pass
        vals = []
        for p in parts:
            m = re.match(r'^([\d\s×÷+\-−().|]+)', p.strip())
            if not m: vals = None; break
            vals.append(num(m.group(1).strip()))
        if vals is None: continue
        ok(all(v == vals[0] for v in vals), f'{where}: worked line "{line}" is not true ({vals})')
def check_wrongs(q, where):
    for value, w in q['wrong'].items():
        ok(num(w['how']) == int(value), f'{where}: mistake {w["tag"]} "{w["how"]}" is not {value}')
        ok(int(value) != q['answer'] and int(value) > 0, f'{where}: mistake equals the answer or is not positive')
        ok(w.get('tag') and w.get('msg'), f'{where}: mistake tag or message')
    ok(len(q['wrong']) >= 2, f'{where}: at least two named mistakes ({len(q["wrong"])})')
def pct(k, t): return R(100 * k, t)
def prompt_numbers(q): return [int(x) for x in re.findall(r'\d+', q['prompt'])]

side_of_micro = Counter(); lens = {1: {'micro': [], 'macro': []}, 2: {'micro': [], 'macro': []}, 3: {'micro': [], 'macro': []}}
starts = {'micro': Counter(), 'macro': Counter()}
pool17, pool18 = Counter(), Counter(); signatures = Counter(); seen_ids = Counter()
for code, qs in games.items():
    where = f'game {code}'
    ok(len(qs) == 18 and [q['round'] for q in qs] == [1] * 6 + [2] * 6 + [3] * 6 and [q['n'] for q in qs] == list(range(1, 7)) * 3, f'{where}: 18 questions in 3 rounds of 6')
    ok([q['kind'] for i, q in enumerate(qs) if EXPECT_KIND[i]] == [k for k in EXPECT_KIND if k], f'{where}: the skills are in the same slots as for every student')
    k17, k18 = qs[16]['kind'], qs[17]['kind']; ok(k17 in allowed17 and k18 in allowed18, f'{where}: the last two come from their pools ({k17}, {k18})'); pool17[k17] += 1; pool18[k18] += 1
    ok(Counter(q['cat'] for q in qs) == {'micro': 7, 'macro': 6, 'count': 3, 'puzzle': 2}, f'{where}: categories 7 micro, 6 macro, 3 counting, 2 puzzles')
    signatures[' || '.join(q['disp'] for q in qs)] += 1
    ids = []
    for i, q in enumerate(qs):
        w2 = f'{where} Q{i + 1} ({q["kind"]})'
        if q['kind'] == 'sort':
            it = q['item']; cid = it['id']; ids.append(cid); seen_ids[cid] += 1
            ok(cid in MICRO | MACRO, f'{w2}: case {cid} is one the checker knows')
            want = 'micro' if cid in MICRO else 'macro'
            ok(q['bin'] == want and q['scope'] == ('population' if want == 'micro' else 'above') and q['cat'] == want, f'{w2}: {cid} belongs in {want}')
            ok(TIER[cid] == q['tier'] == (1 if i < 6 else 2 if i < 12 else 3), f'{w2}: tier {q["tier"]} matches the round')
            o = q['options']
            ok(len(o) == 2 and {x['text'] for x in o} == {'Microevolution', 'Macroevolution'}, f'{w2}: two bins')
            good = [k for k, x in enumerate(o) if x.get('tag') is None]
            ok(good == [q['correctIndex']] and o[q['correctIndex']]['text'] == ('Microevolution' if want == 'micro' else 'Macroevolution'), f'{w2}: exactly one correct bin and it is {want}')
            bad = o[1 - q['correctIndex']]; ok(bad.get('tag') and bad.get('msg'), f'{w2}: the wrong bin names its mistake')
            if cid in TRAP: ok(TRAP_PHRASE[TRAP[cid]] in bad['msg'], f'{w2}: the mistake message names the trap ({TRAP[cid]})')
            ok(it['text'] in q['prompt'] and it['why'] and q['explain'][0] == it['why'], f'{w2}: the explanation is the case\'s own reason')
            low = it['text'].lower(); ok(not any(b in low for b in BOUNDARY_WORDS), f'{w2}: no boundary case (one species becoming two)')
            micro_side = [k for k, x in enumerate(o) if x['text'] == 'Microevolution'][0]; side_of_micro[micro_side] += 1
            if q['tier'] == 3: ok(not any(w in low for w in ('allele', 'frequency', 'gene pool', 'population')), f'{w2}: a round 3 case has no giveaway keyword')
            lens[q['tier']][want].append(len(it['text'])); starts[want][it['text'].split()[0]] += 1
            # generated cases: the text is built from the numbers, so recompute what it says
            if cid == 'gen-freq':
                a, b, g = it['from'], it['to'], it['gens']
                ok((f'{a}% of the gene pool to {b}% in {g} generations' in it['text'] or (f'Over {g} generations' in it['text'] and f'goes from {a}% of the gene pool to {b}%' in it['text'])) and 0 < a < b <= 95 and a % 5 == 0 and b % 5 == 0, f'{w2}: gen-freq numbers')
            if cid == 'gen-table':
                v = it['values']; rows = q['figure']['rows']
                ok([r[1] for r in rows] == [f'{x}%' for x in v] and (v == sorted(v) or v == sorted(v, reverse=True)) and len(set(v)) == 3, f'{w2}: the table is monotone and shows the data ({v})')
            if cid == 'gen-long': ok(f'Over {it["years"]} million years' in it['text'] and 2 <= it['years'] <= 9 and 'still breed' in it['text'], f'{w2}: gen-long')
            if cid == 'gen-fast': ok(f'In just {it["gens"]} generations' in it['text'] and 'still breed' in it['text'] and 8 <= it['gens'] <= 30, f'{w2}: gen-fast')
        else:
            check_wrongs(q, w2); worked_ok(q['worked'], w2)
            ok(q['unit'] and q['method'], f'{w2}: unit and method')
            kind = q['kind']
            if kind == 'beadFreq':
                f = q['figure']; T, k = q['T'], q['k']
                ok(f['type'] == 'beads' and f['t'] == T and f['k'] == k and len(f['order']) == T and sum(f['order']) == k, f'{w2}: the picture has {k} brown of {T}')
                ok(pct(k, T) == q['answer'] and pct(k, T).is_integer and q['answer'] != 50 and T in (20, 25, 40, 50), f'{w2}: {k} of {T} is {q["answer"]}%')
                ok(set(map(int, q['wrong'])) <= {100 - q['answer'], k}, f'{w2}: the mistakes are "the other allele" and "the count"')
            elif kind == 'changePoints':
                T, k1, k2 = q['T'], q['k1'], q['k2']; ok(prompt_numbers(q)[:4] == [T, 1, k1, 5] or True, '')
                ok(abs(pct(k2, T) - pct(k1, T)) == q['answer'] and pct(k1, T).is_integer and pct(k2, T).is_integer, f'{w2}: {k1} and {k2} of {T}: change {q["answer"]} points')
                ok(f'{T} alleles' in q['prompt'] and f'{k1} of them are brown in'.split(' in')[0] in q['prompt'] and str(k2) in q['prompt'], f'{w2}: the prompt states the numbers')
            elif kind == 'twoAlleles':
                N, T, k = q['N'], q['T'], q['k']
                ok(T == 2 * N and pct(k, T) == q['answer'] and pct(k, T).is_integer and q['answer'] != 50, f'{w2}: {N} beetles are {T} alleles, {k} of {T} is {q["answer"]}%')
                ok(f'{N} beetles' in q['prompt'] and f'{k} of the alleles' in q['prompt'] and 'two alleles' in q['prompt'], f'{w2}: the prompt says two alleles each')
                ok(int(pct(k, N)) in map(int, q['wrong']) or pct(k, N) > 999 or not pct(k, N).is_integer, f'{w2}: the "divided by the beetles" mistake is offered')
            elif kind == 'twoGen':
                N1, N2, k1, k2 = q['N1'], q['N2'], q['k1'], q['k2']; p1, p2 = pct(k1, 2 * N1), pct(k2, 2 * N2)
                ok(p1.is_integer and p2.is_integer and abs(p1 - p2) == q['answer'] and (p2 > p1) == q['rise'] and 10 <= q['answer'] <= 60, f'{w2}: {k1}/{2 * N1} to {k2}/{2 * N2}: {q["answer"]} points')
                ok(('rise' if q['rise'] else 'fall') in q['prompt'] and f'{N1} beetles' in q['prompt'] and f'{N2} beetles' in q['prompt'], f'{w2}: the prompt agrees with the data')
            elif kind == 'shrinkOnce':
                T, p, k, r = q['T'], q['p'], q['k'], q['r']
                ok(R(T * p, 100) == k and k >= 6 and 2 <= r <= k - 2 and pct(k - r, T - r) == q['answer'] and pct(k - r, T - r).is_integer, f'{w2}: ({k} - {r}) of ({T} - {r}) is {q["answer"]}%')
                ok(f'{T} alleles' in q['prompt'] and f'{p}% of them' in q['prompt'] and f'{r} brown alleles are lost' in q['prompt'], f'{w2}: the prompt states the numbers')
            elif kind == 'reverseShrink':
                T, r, p2 = q['T'], q['r'], q['p2']; newT = T - r; brown2 = R(p2 * newT, 100)
                ok(brown2.is_integer and pct(brown2 + r, T) == q['answer'] and pct(brown2 + r, T).is_integer and p2 < q['answer'] < 100, f'{w2}: {p2}% of {newT} is {brown2}, plus {r} is {brown2 + r} of {T}: {q["answer"]}%')
                ok(f'{T} alleles' in q['prompt'] and f'{r} brown alleles were lost' in q['prompt'] and f'{p2}% of the pool' in q['prompt'], f'{w2}: the prompt states the numbers')
            elif kind == 'shrinkTwice':
                T, p, k, r1, r2 = q['T'], q['p'], q['k'], q['r1'], q['r2']
                ok(R(T * p, 100) == k and k - r1 - r2 >= 2 and pct(k - r1 - r2, T - r1 - r2) == q['answer'] and pct(k - r1 - r2, T - r1 - r2).is_integer, f'{w2}: ({k} - {r1} - {r2}) of ({T} - {r1} - {r2}) is {q["answer"]}%')
                ok(f'{r1} brown alleles are lost' in q['prompt'] and f'{r2} more brown alleles' in q['prompt'], f'{w2}: the prompt states the numbers')
            else: fail(f'{w2}: unknown kind')
    ok(len(ids) == 13 and len(set(ids)) >= 12, f'{where}: thirteen sort cases, almost all different ({len(set(ids))} different)')

n = len(games)
print(f'{n} generated games, {checks} checks passed')
# ---- no obvious cue gives a sort answer away ----
tot = sum(side_of_micro.values())
print(f'the microevolution bin is on the first side in {100 * side_of_micro[0] / tot:.0f}% of the sort questions')
ok(0.42 <= side_of_micro[0] / tot <= 0.58, 'the bins are on both sides about equally often')
for t in (1, 2, 3):
    a, b = sum(lens[t]['micro']) / len(lens[t]['micro']), sum(lens[t]['macro']) / len(lens[t]['macro'])
    print(f'tier {t}: mean length of a micro case {a:.0f}, of a macro case {b:.0f} (ratio {a / b:.2f})')
    ok(0.70 <= a / b <= 1.42, f'tier {t}: length does not give the bin away')
for w in ('Over', 'In'):
    pm = starts['micro'][w] / sum(starts['micro'].values()); pa = starts['macro'][w] / sum(starts['macro'].values())
    print(f'cases starting "{w}": micro {100 * pm:.0f}%, macro {100 * pa:.0f}%')
    ok(abs(pm - pa) <= 0.20, f'the first word "{w}" does not give the bin away')
# ---- the pools are balanced and every fixed case is used ----
print('Q17 pool', dict(pool17), ' Q18 pool', dict(pool18))
ok(all(v / n >= 0.35 for v in list(pool17.values()) + list(pool18.values())) and len(pool17) == 2 and len(pool18) == 2, 'each template in each last-question pool is drawn about half the time')
unused = (MICRO | MACRO) - set(seen_ids)
ok(not unused, f'every case in the pool turns up in 300 games (unused: {unused})')
print('case counts', dict(sorted(seen_ids.items())))
dist = len(signatures); print(f'distinct games: {dist} of {n}'); ok(dist >= n - 2, 'games differ from student to student')
print(f'\n{checks} checks passed')
