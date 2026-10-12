#!/usr/bin/env python3
"""
Independent check of the Sorter game's generated games (Archaea And Extreme Places, 8I). The browser dumps N generated games (JSON, from
build/test-archaea-and-extreme-places-game.js); this script re-derives, from build/archaea-and-extreme-places.bank.json and the rules written
out again here (not from the game):

  - the bank itself: three bins, three rounds of 8, per_bin adds up to the draw, every id and text unique, every answer one of the three bins,
    every pool big enough, and the six named mistakes ('<right>><chosen>') are exactly the six ordered pairs of different bins;
  - every game: the bins in some order, 24 items in 3 rounds of 8, exactly per_bin items per bin per round, all drawn from that round's pool,
    EVERY core item present (or, where a bin has more core items than its count, a subset of them and nothing else), no item twice in a game,
    no item in two rounds, every stored text, answer, reason and core flag equal to the bank's, and the named mistake of every wrong bin
    equal to the bank's text for its key;
  - across the games: the order differs from game to game, the draws are the ones the rules allow (and every allowed draw turns up), each
    eligible item is drawn about as often as it should be, the bins take all six orders and each place about a third of the time, and the
    answer of an item gives no hint of its position on the list;
  - the feedback an all-wrong game showed in the browser (build/test-...js writes it next to the dump) is the bank's text for every key;
  - the lesson-folder file: the bank is written into it, it makes no external request, stores nothing, has no em dash, uses the 'culture'
    palette and Arial and Georgia, and the source file carries no item text of its own.

    python3 build/check-archaea-and-extreme-places-game.py games.json
"""
import json, pathlib, re, sys
from collections import Counter, defaultdict
from itertools import combinations, permutations
from math import comb

HERE = pathlib.Path(__file__).parent
BANK = json.loads((HERE / 'archaea-and-extreme-places.bank.json').read_text(encoding='utf-8'))
games = json.load(open(sys.argv[1]))
checks = 0
def fail(msg): print('FAIL:', msg); sys.exit(1)
def ok(cond, msg):
    global checks
    if not cond: fail(msg)
    checks += 1

BINS = ['bacterium', 'archaean', 'neither']
EM = '—'

# ------------------------------------------------------------------ the bank
ok(BANK['bins'] == BINS and set(BANK['bin_labels']) == set(BINS) and set(BANK['bin_hints']) == set(BINS), 'the bank has the three bins, with a label and a hint each')
ok(BANK['bin_labels'] == {'bacterium': 'Bacterium', 'archaean': 'Archaean', 'neither': 'Neither'}, 'the bin labels')
ok(len(BANK['rounds']) == 3 and [r['name'][:8] for r in BANK['rounds']] == ['Round 1:', 'Round 2:', 'Round 3:'], 'three rounds, named in order')
ok(len(BANK['rules']) >= 3 and all(r.strip() for r in BANK['rules']), f'the clues: {len(BANK["rules"])} rules')
ids, texts = Counter(), Counter()
POOL = {}       # round number -> {bin -> {'core': [ids], 'rest': [ids]}}
ITEM = {}       # id -> item
for ri, rd in enumerate(BANK['rounds'], 1):
    ok(rd['draw'] == 8 and sum(rd['per_bin'].values()) == rd['draw'] and set(rd['per_bin']) == set(BINS), f'round {ri}: per_bin adds up to the draw of 8')
    POOL[ri] = {b: {'core': [], 'rest': []} for b in BINS}
    for it in rd['pool']:
        ids[it['id']] += 1; texts[it['text']] += 1; ITEM[it['id']] = dict(it, round=ri)
        ok(it['id'].startswith(f'r{ri}_'), f'{it["id"]}: the id says round {ri}')
        ok(it['answer'] in BINS, f'{it["id"]}: the answer is one of the three bins')
        ok(it['text'].strip() and it['why'].strip() and isinstance(it['core'], bool), f'{it["id"]}: text, reason and core flag')
        POOL[ri][it['answer']]['core' if it['core'] else 'rest'].append(it['id'])
    for b in BINS:
        n = len(POOL[ri][b]['core']) + len(POOL[ri][b]['rest'])
        ok(n >= rd['per_bin'][b], f'round {ri}, {b}: the pool ({n}) holds at least the {rd["per_bin"][b]} the round needs')
ok(max(ids.values()) == 1 and max(texts.values()) == 1, 'every id and every text in the bank is unique, so no item is in two rounds')
KEYS = {f'{a}>{c}' for a in BINS for c in BINS if a != c}
ok(set(BANK['mistakes']) == KEYS, 'the named mistakes are exactly the six ordered pairs of different bins')
ok(all(v.strip() for v in BANK['mistakes'].values()), 'every named mistake has text')
def strings(o):
    if isinstance(o, str): yield o
    elif isinstance(o, dict):
        for k, v in o.items(): yield from strings(k); yield from strings(v)
    elif isinstance(o, list):
        for v in o: yield from strings(v)
ok(not any(EM in s for s in strings(BANK)), 'no em dash anywhere in the bank')
ok(not any(re.search(r'\b(color|gray|center|behavior|favor|organization|fiber|liter)\b', s, re.I) for s in strings(BANK)), 'British spelling in the bank (no color, gray, center, behavior, favor, organization, fiber, liter)')

# what the rules allow for one round and one bin: every core item, then the rest from the others (or a subset of the core if there are too many)
def allowed_sets(ri, b):
    need, core, rest = BANK['rounds'][ri - 1]['per_bin'][b], POOL[ri][b]['core'], POOL[ri][b]['rest']
    if len(core) >= need: return {frozenset(c) for c in combinations(core, need)}
    return {frozenset(core) | frozenset(c) for c in combinations(rest, need - len(core))}
def chance(ri, b, item_id):
    """The probability that an item is drawn, from the rules."""
    sets = allowed_sets(ri, b); return sum(item_id in s for s in sets) / len(sets)

# ------------------------------------------------------------------ every game
perms, place, signatures = Counter(), defaultdict(Counter), Counter()
draws = {(ri, b): Counter() for ri in (1, 2, 3) for b in BINS}
drawn_count = Counter(); orders_by_set = defaultdict(set); games_by_set = Counter()
pos_answer = defaultdict(Counter); used_keys = Counter()
for code, g in games.items():
    W = f'game {code}'
    ok(code == g['code'] and re.fullmatch(r'[A-HJ-NP-Z2-9]{6}', code), f'{W}: the code is six characters from the clear alphabet')
    bo, qs = g['binOrder'], g['qs']
    ok(sorted(bo) == sorted(BINS), f'{W}: the bins are placed in some order ({bo})')
    perms[tuple(bo)] += 1
    for k, b in enumerate(bo): place[b][k] += 1
    ok(len(qs) == 24 and [q['round'] for q in qs] == [1] * 8 + [2] * 8 + [3] * 8 and [q['n'] for q in qs] == list(range(1, 9)) * 3 and [q['idx'] for q in qs] == list(range(24)), f'{W}: 24 items, 3 rounds of 8')
    ok(len({q['id'] for q in qs}) == 24 and len({q['text'] for q in qs}) == 24, f'{W}: no item twice in a game, and none in two rounds')
    signatures[tuple(q['id'] for q in qs)] += 1
    for ri in (1, 2, 3):
        rq = [q for q in qs if q['round'] == ri]; rd = BANK['rounds'][ri - 1]
        ok(all(q['id'] in {i['id'] for i in rd['pool']} for q in rq), f'{W} round {ri}: every item is from that round\'s pool')
        for q in rq:
            b = ITEM[q['id']]
            ok(q['text'] == b['text'] and q['answer'] == b['answer'] and q['why'] == b['why'] and q['core'] == b['core'], f'{W} {q["id"]}: text, answer, reason and core flag are the bank\'s')
            ok(q['answer'] in BINS, f'{W} {q["id"]}: the stored answer is one of the three bins')
            ok(set(q['mistakes']) == set(BINS) - {q['answer']}, f'{W} {q["id"]}: a named mistake for each of the two wrong bins, and no other')
            for chosen, m in q['mistakes'].items():
                key = f'{q["answer"]}>{chosen}'
                ok(m['key'] == key and m['msg'] == BANK['mistakes'][key], f'{W} {q["id"]}: choosing {chosen} gives mistake {key} and the bank\'s text')
                used_keys[key] += 1
        for b in BINS:
            mine = {q['id'] for q in rq if q['answer'] == b}
            ok(len(mine) == rd['per_bin'][b], f'{W} round {ri}: exactly {rd["per_bin"][b]} {b} items (got {len(mine)})')
            ok(frozenset(mine) in allowed_sets(ri, b), f'{W} round {ri}, {b}: the draw is one the rules allow (every core item, the rest from the others)')
            core = set(POOL[ri][b]['core'])
            if len(core) <= rd['per_bin'][b]: ok(core <= mine, f'{W} round {ri}, {b}: every core item is present')
            else: ok(mine <= core, f'{W} round {ri}, {b}: more core items than places, so only core items are drawn')
            draws[(ri, b)][frozenset(mine)] += 1
            for i in mine: drawn_count[i] += 1
        sset = frozenset(q['id'] for q in rq); games_by_set[(ri, sset)] += 1; orders_by_set[(ri, sset)].add(tuple(q['id'] for q in rq))
        for q in rq: pos_answer[(ri, q['n'])][q['answer']] += 1

n = len(games)
print(f'{n} generated games, {checks} checks passed')

# ------------------------------------------------------------------ across the games
ok(len(signatures) == n, f'every game is different ({len(signatures)} of {n})')
for ri in (1, 2, 3):
    sets_ri = {s for (r, s) in games_by_set if r == ri}
    for s in sets_ri:
        games_here = games_by_set[(ri, s)]
        ok(len(orders_by_set[(ri, s)]) >= games_here - 1, f'round {ri}: games with the same eight items still show them in different orders ({len(orders_by_set[(ri, s)])} orders in {games_here} games)')
first = Counter(tuple(q['id'] for q in g['qs'][:8]) for g in games.values())
ok(len(first) > n // 2, f'round 1\'s order varies ({len(first)} different orders)')
ok(len({g['qs'][0]['id'] for g in games.values()}) >= 5 and len({g['qs'][8]['id'] for g in games.values()}) >= 5, 'the first item of a round is not always the same')

# bin shuffles vary: all six orders, each about a sixth; each bin in each place about a third
ok(len(perms) == 6 and set(perms) == set(permutations(BINS)), f'the bins take all six orders ({len(perms)} seen)')
ok(all(abs(c / n - 1 / 6) < 0.08 for c in perms.values()), f'the six orders are about equally common {dict(perms)}')
ok(all(abs(place[b][k] / n - 1 / 3) < 0.1 for b in BINS for k in range(3)), 'each bin is in each place about a third of the time')

# the draws: every allowed draw turns up, and each eligible item is drawn about as often as the rules say
never = []
for ri in (1, 2, 3):
    for b in BINS:
        allowed = allowed_sets(ri, b)
        ok(set(draws[(ri, b)]) <= allowed, f'round {ri}, {b}: every draw seen is allowed')
        ok(set(draws[(ri, b)]) == allowed, f'round {ri}, {b}: every allowed draw ({len(allowed)}) turns up in {n} games ({len(draws[(ri, b)])} seen)')
        for i in POOL[ri][b]['core'] + POOL[ri][b]['rest']:
            p = chance(ri, b, i); got = drawn_count[i] / n
            ok(abs(got - p) < 0.12, f'{i}: drawn in {got:.2f} of the games, the rules say {p:.2f}')
            if p == 0: never.append(i)
            else: ok(drawn_count[i] > 0, f'{i}: can be drawn, and was')
            if ITEM[i]['core'] and len(POOL[ri][b]['core']) <= BANK['rounds'][ri - 1]['per_bin'][b]: ok(drawn_count[i] == n, f'{i}: a core item is in every game')
# the answer of an item tells you nothing about where it sits on the list
for (ri, k), c in pos_answer.items():
    per = BANK['rounds'][ri - 1]['per_bin']
    for b in BINS: ok(abs(c[b] / n - per[b] / 8) < 0.13, f'round {ri}, place {k}: {b} items there {c[b] / n:.2f} of the time, {per[b] / 8:.2f} expected')
# the named mistakes: every key is used by items of the right kind, and none is unused
ok(set(used_keys) == KEYS == set(BANK['mistakes']), 'every named mistake in the bank is the one for some item and some wrong bin, and none is unused')

# ------------------------------------------------------------------ what an all-wrong game showed in the browser
play_file = pathlib.Path(sys.argv[1] + '.play.json')
if play_file.exists():
    plays = json.loads(play_file.read_text(encoding='utf-8'))
    ok(len(plays) >= 48, f'the all-wrong games were logged ({len(plays)} placements)')
    for e in plays:
        it = ITEM[e['id']]
        ok(it['answer'] == e['answer'] and e['chosen'] != e['answer'] and e['key'] == f'{e["answer"]}>{e["chosen"]}', f'play {e["id"]}: the key is right>chosen')
        ok(e['shown'] == BANK['mistakes'][e['key']] and e['why'] == it['why'], f'play {e["id"]}: the screen showed the bank\'s mistake and the item\'s reason')
    ok({e['key'] for e in plays} == KEYS, 'the all-wrong games between them showed all six named mistakes')
else: print('(no play log found: skipped the on-screen feedback check)')

# ------------------------------------------------------------------ the files
src = (HERE / 'archaea-and-extreme-places-game.html').read_text(encoding='utf-8')
out = (HERE.parent / 'out' / 'Archaea And Extreme Places' / 'Archaea And Extreme Places game.html').read_text(encoding='utf-8')
ok(src.count('/*DATA*/null/*END*/') == 1 and '/*DATA*/null/*END*/' not in out, 'the data placeholder is in the source once and gone from the lesson-folder file')
m = re.search(r'var DATA = (\{.*?\});\n  var ALPHABET', out, re.S)
ok(m is not None, 'the bank is written into the lesson-folder file')
embedded = json.loads(m.group(1).replace('<\\/', '</'))
want = {k: v for k, v in BANK.items() if k != '_comment'}
ok(embedded == want, 'the bank written into the game is the bank, item for item')
ok(not any(it['text'] in src for it in ITEM.values()) and not any(it['why'] in src for it in ITEM.values()), 'the source file carries no item text or reason of its own')
ok(not re.search(r'https?://', out) and 'localStorage' not in out and 'sessionStorage' not in out and 'indexedDB' not in out and 'XMLHttpRequest' not in out and 'fetch(' not in out, 'no external request, and nothing stored')
ok(EM not in out, 'no em dash in the game file')
ok(all(h.lower() in out.lower() for h in ('301338', 'B5E06A', '4C7A12', '167A74', 'C73C28', 'F6F1F5', '24122A')), 'the culture palette is used')
ok("Georgia" in out and "Arial" in out and 'lang="en-GB"' in out, 'Georgia for titles, Arial for body, British English')
ok(re.search(r'<details class="review"', out) and 'Stop and see my results' in out and 'Play again with a new code' in out and 'meant to be too hard' in out, 'the review drop-downs, the stop button, the play-again button and the round 3 warning are in the file')

print(f'{checks} checks passed')
if never:
    print('NOTE, items the draw rules can never pick (every place in their bin is taken by core items):', ', '.join(never))
cover = {ri: [len(allowed_sets(ri, b)) for b in BINS] for ri in (1, 2, 3)}
print('different sets of items a round can show (bacterium x archaean x neither):', {ri: v[0] * v[1] * v[2] for ri, v in cover.items()})
