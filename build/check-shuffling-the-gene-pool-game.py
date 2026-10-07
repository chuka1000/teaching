#!/usr/bin/env python3
"""
Independent check of the Pairs game's generated scenarios (Shuffling The Gene Pool, 8I). The browser dumps N generated games (JSON, from
build/test-shuffling-the-gene-pool-game.js); this script re-derives, from the DATA each scenario kept:
  - the right force of every scenario, from its ONE deciding fact (a new allele appeared: mutation; alleles moved between
    populations: gene flow; the trait decided who survived: natural selection; chance, with no trait involved: genetic drift),
    against a table of the scenarios written out again here, with a phrase each must contain;
  - the ramp (three scenarios of each force in every round; the tier of each round; the last board of round 3 is the hardest);
  - the board rules (each board of rounds 1 and 2 has at least three different forces; every board's force buttons are a permutation);
  - that no cue gives an answer away (position of the buttons, length, and the words "chance" and "luck"), and that games differ.

    python3 build/check-shuffling-the-gene-pool-game.py games.json
"""
import json, re, sys
from collections import Counter, defaultdict

games = json.load(open(sys.argv[1]))
checks = 0
def fail(msg): print('FAIL:', msg); sys.exit(1)
def ok(cond, msg):
    global checks
    if not cond: fail(msg)
    checks += 1

# template id -> (deciding fact, a phrase the text must contain, tier, is it one of the hardest)
TPL = {
 'm1a': ('new', 'copying mistake', 1, 0), 'm1b': ('new', 'neither of its parents', 1, 0), 'm1c': ('new', 'mutation', 1, 0), 'm1d': ('new', 'mistake when DNA is copied', 1, 0),
 'g1a': ('move', 'swim to an island', 1, 0), 'g1b': ('move', 'pollen', 1, 0), 'g1c': ('move', 'moves from one valley', 1, 0), 'g1d': ('move', 'already there', 1, 0),
 's1a': ('trait', 'harder to see', 1, 0), 's1b': ('trait', 'survive better', 1, 0), 's1c': ('trait', 'slow', 1, 0), 's1d': ('trait', 'thin fur', 1, 0),
 'd1a': ('chance', 'by chance', 1, 0), 'd1b': ('chance', 'by luck', 1, 0), 'd1c': ('chance', 'it is chance', 1, 0), 'd1d': ('chance', 'by luck alone', 1, 0),
 'm2a': ('new', 'None of its ancestors', 2, 0), 'm2b': ('new', 'Nothing came from outside', 2, 0), 'm2c': ('new', 'parents and grandparents', 2, 0), 'm2d': ('new', 'isolated', 2, 0),
 'g2a': ('move', 'bridge', 2, 0), 'g2b': ('move', 'buys', 2, 0), 'g2c': ('move', 'arrive', 2, 0), 'g2d': ('move', 'leave their group', 2, 0),
 's2a': ('trait', 'disease', 2, 0), 's2b': ('trait', 'thick fur', 2, 0), 's2c': ('trait', 'find food more easily', 2, 0), 's2d': ('trait', 'protective allele', 2, 0),
 'd2a': ('chance', 'simply lost', 2, 0), 'd2b': ('chance', 'no different from the others', 2, 0), 'd2c': ('chance', 'did not choose', 2, 0), 'd2d': ('chance', 'at random', 2, 0),
 'm3a': ('new', 'all its ancestors', 3, 1), 'm3b': ('new', 'cut off from every other pond', 3, 1), 'm3c': ('new', 'nobody has moved in', 3, 0), 'm3d': ('new', 'brand new allele', 3, 0),
 'g3a': ('move', 'floating log', 3, 1), 'g3b': ('move', 'leave to join', 3, 1), 'g3c': ('move', 'swaps', 3, 0), 'g3d': ('move', 'bridge', 3, 0),
 's3a': ('trait', 'frost resistance', 3, 1), 's3b': ('trait', 'fast running', 3, 0), 's3c': ('trait', 'thick fat', 3, 1), 's3d': ('trait', 'storing fat', 3, 0),
 'd3a': ('chance', 'does not choose', 3, 1), 'd3b': ('chance', 'not different in any way', 3, 0), 'd3c': ('chance', 'by luck', 3, 0), 'd3d': ('chance', 'pure chance', 3, 1),
}
RULE = {'new': 'mutation', 'move': 'geneflow', 'trait': 'selection', 'chance': 'drift'}
FORCES = ['mutation', 'geneflow', 'selection', 'drift']
NAME = {'mutation': 'Mutation', 'geneflow': 'Gene flow', 'selection': 'Natural selection', 'drift': 'Genetic drift'}
ok(all(t[0] in RULE for t in TPL.values()) and len(TPL) == 48, 'forty-eight scenario templates, each with one deciding fact')
# the right force is the one the deciding fact gives: a table written out again here, per initial letter of the id as a sanity check
ok(all({'m': 'new', 'g': 'move', 's': 'trait', 'd': 'chance'}[k[0]] == v[0] for k, v in TPL.items()), 'every template id starts with the force its deciding fact gives (m, g, s, d)')
ok(Counter((v[2], RULE[v[0]]) for v in TPL.values()) == {(t, f): 4 for t in (1, 2, 3) for f in FORCES}, 'four templates for each force in each tier')
ok(Counter((RULE[v[0]]) for v in TPL.values() if v[3]) == {f: 2 for f in FORCES}, 'two of the hardest templates for each force, all in round 3')

pos = Counter(); signatures = Counter(); lens = defaultdict(lambda: defaultdict(list)); chance_words = defaultdict(Counter)
for code, qs in games.items():
    where = f'game {code}'
    ok(len(qs) == 36 and [q['round'] for q in qs] == [1] * 12 + [2] * 12 + [3] * 12 and [q['board'] for q in qs] == sum([[b] * 4 for _ in range(3) for b in (1, 2, 3)], []) and [q['pos'] for q in qs] == [1, 2, 3, 4] * 9, f'{where}: 36 scenarios in 3 rounds of 3 boards of 4')
    signatures[' || '.join(q['disp'] for q in qs)] += 1
    for r in (1, 2, 3):
        rq = qs[(r - 1) * 12:r * 12]
        ok(Counter(q['force'] for q in rq) == {f: 3 for f in FORCES}, f'{where} round {r}: exactly three scenarios of each force')
        ok(all(q['tier'] == r and TPL[q['tid']][2] == r for q in rq), f'{where} round {r}: every scenario is a round {r} scenario')
        for f in FORCES:
            tids = [q['tid'] for q in rq if q['force'] == f]
            ok(len(set(tids)) == 3, f'{where} round {r}: three different {f} templates ({tids})')
        for b in range(3):
            bq = rq[b * 4:b * 4 + 4]
            ok(len({tuple(q['order']) for q in bq}) == 1 and sorted(bq[0]['order']) == sorted(FORCES), f'{where} round {r} board {b + 1}: one force order, a permutation of the four forces')
            for i, f in enumerate(bq[0]['order']): pos[(f, i)] += 1
            if r < 3: ok(len({q['force'] for q in bq}) >= 3, f'{where} round {r} board {b + 1}: at least three different forces on a board')
        if r == 3:
            ok(all(q['top'] for q in rq[8:]) and not any(q['top'] for q in rq[:8]) and sorted(q['force'] for q in rq[8:]) == sorted(FORCES), f'{where}: the last board is one of each force, all from the hardest templates')
    for i, q in enumerate(qs):
        w2 = f'{where} Q{i + 1} ({q["tid"]})'
        fact, phrase, tier, top = TPL[q['tid']]
        ok(q['attr'] == fact and q['force'] == RULE[fact] and q['cat'] == q['force'], f'{w2}: the deciding fact is "{fact}", so the force is {RULE[fact]}')
        ok(phrase.lower() in q['text'].lower(), f'{w2}: the text contains "{phrase}"')
        ok(bool(q['top']) == bool(top), f'{w2}: the hardest flag')
        ok('{' not in q['text'] and '}' not in q['text'] and '  ' not in q['text'] and q['text'][0].isupper() and q['text'].endswith('.'), f'{w2}: the text is filled in cleanly')
        ok(not re.search(r'\ba (?=[aeiouAEIOU])', q['text']) and not re.search(r'\ban (?=[^aeiouAEIOU\W])', q['text']), f'{w2}: a / an agree')
        ok(not re.search(r'(?:^|\. )[a-z]', q['text']), f'{w2}: every sentence starts with a capital')
        ok(q['why'] and q['kind'] == 'match', f'{w2}: a reason')
        if tier == 3: ok(q['trap'], f'{w2}: a round 3 scenario explains its trap')
        ok(not re.search(r'\d', q['text']), f'{w2}: numbers are written as words')
        lens[tier][q['force']].append(len(q['text']))
        if re.search(r'chance|luck', q['text'], re.I): chance_words[tier][q['force']] += 1
        else: chance_words[tier]['none-' + q['force']] += 1

n = len(games)
print(f'{n} generated games, {checks} checks passed')
# ---- no cue gives an answer away ----
for f in FORCES:
    shares = [pos[(f, i)] / sum(pos[(f, j)] for j in range(4)) for i in range(4)]
    print(f'{NAME[f]:18s} button position shares', [f'{100 * s:.0f}%' for s in shares])
    ok(all(0.20 <= s <= 0.30 for s in shares), f'{f}: the force is on each of the four buttons about equally often')
for t in (1, 2, 3):
    means = {f: sum(v) / len(v) for f, v in lens[t].items()}
    print(f'tier {t}: mean text length by force', {NAME[f]: round(m) for f, m in means.items()}, f'(max/min {max(means.values()) / min(means.values()):.2f})')
    ok(max(means.values()) / min(means.values()) <= 1.35, f'tier {t}: length does not give the force away')
for t in (1, 2, 3):
    withw = {f: chance_words[t][f] for f in FORCES}; tot = sum(withw.values())
    share = withw['drift'] / tot if tot else 0
    print(f'tier {t}: scenarios with "chance" or "luck": {withw} (drift is {100 * share:.0f}% of them)')
ok(0.35 <= (lambda t: (chance_words[t]['drift'] / max(1, sum(chance_words[t][f] for f in FORCES))))(3) <= 0.85, 'round 3: the words "chance" and "luck" are NOT a safe cue for drift (they also appear in selection scenarios)')
ok(any(chance_words[3]['selection'] > 0 for _ in [0]), 'round 3: selection scenarios do use the word "chance" or "luck" (the misleading cue)')
seen = Counter(q['tid'] for qs in games.values() for q in qs)
ok(set(seen) == set(TPL), f'every template turns up in 300 games (missing: {set(TPL) - set(seen)})')
ok(all(seen[t] / n >= 0.5 for t in TPL if TPL[t][2] < 3 or not TPL[t][3]), 'every ordinary template is drawn in at least half of the games')
dist = len(signatures); print(f'distinct games: {dist} of {n}'); ok(dist >= n - 2, 'games differ from student to student')
print(f'\n{checks} checks passed')
