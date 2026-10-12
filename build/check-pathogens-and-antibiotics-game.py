#!/usr/bin/env python3
"""
Independent check of the True or false blitz's generated games (Pathogens And Antibiotics, 8I). The browser dumps N generated games (JSON, from
build/test-pathogens-and-antibiotics-game.js); this script re-derives, from build/pathogens-and-antibiotics.bank.json and the rules written
out again here (not from the game):

  - the bank itself: 3 rounds of 12 slots, draw 7 / 7 / 6, a different TRUE and FALSE version in every slot, unique ids (u, p and h by round),
    no em dash anywhere, and the numbers in the doubling slots (with sympy: 3 divisions in 1 hour, 12 in 4 hours, 2^12 = 4096, 2 x 12 = 24);
  - the bank's "conflicts": pairs of slots that give each other away. Every pair names two different slots of the bank, none twice;
  - every game: 20 statements in rounds of 7, 7 and 6; every slot used at most once in the game; every round draws only from ITS OWN round's
    slots; NO GAME HOLDS BOTH SLOTS OF A CONFLICTING PAIR (in one round or across rounds); exactly 10 true and 10 false in the game, with round 3 on 3 true of 6 and rounds 1 and 2 on 3 and 4 (either way round); and every
    statement word for word the bank's, with its stored truth the bank's true / false field (so the stored truth, the text and the slot agree);
  - the why and the slip carried by each statement are the bank's for that slot;
  - across the games: no two games alike, the order and the draw vary, every slot turns up as often as it should (the expected share is worked
    out here by drawing 50,000 games at random and throwing away any with a conflicting pair, the same rule the game follows), each version
    of a slot turns up about equally often,
    TRUE is not more likely at any position in a round, and both the 3 / 4 and the 4 / 3 split occur.

It prints (does not fail on) the cues in the bank a test-wise student could use: the length of true and false versions, and absolutes and negatives.

    python3 build/check-pathogens-and-antibiotics-game.py games.json
"""
import json, pathlib, random, re, sys
from collections import Counter, defaultdict
from sympy import Integer, symbols, Eq, solve

HERE = pathlib.Path(__file__).parent
BANK = json.loads((HERE / 'pathogens-and-antibiotics.bank.json').read_text(encoding='utf-8'))
games = json.load(open(sys.argv[1]))
checks = 0
def fail(msg): print('FAIL:', msg); sys.exit(1)
def ok(cond, msg):
    global checks
    if not cond: fail(msg)
    checks += 1

# ---------------- the bank ----------------
SIZES = [7, 7, 6]
ok(BANK['draw'] == SIZES and len(BANK['rounds']) == 3, 'the bank draws 7, 7 and 6 statements from 3 rounds')
SLOT = {}            # id -> (round index 0..2, slot)
for r, rd in enumerate(BANK['rounds']):
    ok(len(rd['slots']) == 12, f'round {r + 1} has 12 slots')
    for s in rd['slots']:
        ok(s['id'] not in SLOT, f'slot id {s["id"]} is unique')
        ok(s['id'][0] == 'uph'[r] and s['id'][1:].isdigit(), f'slot {s["id"]} is named for its round ({"uph"[r]})')
        ok(s['true'].strip() and s['false'].strip() and s['true'] != s['false'], f'slot {s["id"]}: a TRUE and a different FALSE version')
        ok(s['why'].strip() and s['mistake'].strip(), f'slot {s["id"]}: a why and a mistake')
        SLOT[s['id']] = (r, s)
ALL_TEXT = {s['true']: (i, 'true') for i, (_, s) in SLOT.items()}
ALL_TEXT.update({s['false']: (i, 'false') for i, (_, s) in SLOT.items()})
ok(len(ALL_TEXT) == 72, 'seventy-two different statements in the bank (36 slots, 2 versions)')
for i, (_, s) in SLOT.items():
    for key in ('true', 'false', 'why', 'mistake'):
        ok('—' not in s[key] and '–' not in s[key], f'slot {i} {key}: no dash')
ok(all(rd['name'].startswith(f'Round {r + 1}') for r, rd in enumerate(BANK['rounds'])), 'each round is named "Round n ..."')

# the conflicts: pairs of slots that give each other away
CONFLICTS = BANK.get('conflicts', [])
ok(len(CONFLICTS) > 0, 'the bank lists conflicts')
for pair in CONFLICTS:
    ok(isinstance(pair, list) and len(pair) == 2 and pair[0] != pair[1] and all(i in SLOT for i in pair), f'conflict {pair}: two different slots of the bank')
ok(len({frozenset(p) for p in CONFLICTS}) == len(CONFLICTS), 'no conflict is listed twice')

# the doubling slots, with sympy: a bacterium that divides every 20 minutes, with plenty of food
minutes_per_division = Integer(20)
d1, d4 = Integer(60) / minutes_per_division, Integer(4 * 60) / minutes_per_division
ok(d1 == 3 and d4 == 12, '1 hour is 3 divisions and 4 hours is 12')
n = symbols('n')
ok(solve(Eq(n, Integer(2) ** d1), n) == [8] and Integer(2) ** d4 == 4096, 'one bacterium becomes 2^3 = 8 in 1 hour and 2^12 = 4096 in 4 hours')
ok(Integer(2) * d4 == 24 and 3 * Integer(2) == 6, 'the slips: 2 x 12 = 24 and 3 x 2 = 6 are not the doubling answers')
ok('8 bacteria in 1 hour' in SLOT['u4'][1]['true'] and '6 bacteria in 1 hour' in SLOT['u4'][1]['false'], 'u4: 8 is the true version and 6 the false one')
ok('4,096' in SLOT['h8'][1]['true'] and 'become' in SLOT['h8'][1]['true'] and ' 24.' in SLOT['h8'][1]['false'], 'h8: 4,096 is the true version and 24 the false one')
ok('4 hours' in SLOT['h8'][1]['true'] and '4 hours' in SLOT['h8'][1]['false'] and '20 minutes' in SLOT['h8'][1]['true'], 'h8: the same 4 hours and 20 minutes in both versions')

# ---------------- every game ----------------
sig_full, sig_order, draws = Counter(), Counter(), Counter()
slot_seen, version_seen = Counter(), Counter()
pos_true = defaultdict(Counter)            # (round, position) -> Counter of truth
splits = Counter()
for code, qs in games.items():
    W = f'game {code}'
    ok(len(qs) == 20, f'{W}: 20 statements')
    ok([q['n'] for q in qs] == list(range(1, 21)), f'{W}: numbered 1 to 20')
    ok([q['round'] for q in qs] == [1] * 7 + [2] * 7 + [3] * 6, f'{W}: rounds of 7, 7 and 6')
    ok([q['k'] for q in qs] == list(range(1, 8)) + list(range(1, 8)) + list(range(1, 7)), f'{W}: positions 1 to 7, 1 to 7, 1 to 6')
    ids = [q['slot'] for q in qs]
    ok(len(set(ids)) == 20, f'{W}: every slot used at most once ({Counter(ids).most_common(1)})')
    ok(len({q['text'] for q in qs}) == 20, f'{W}: 20 different statements')
    for a, b in CONFLICTS:
        ok(not (a in ids and b in ids), f'{W}: draws both {a} and {b}, which give each other away')
    ok(sum(1 for q in qs if q['truth'] is True) == 10 and sum(1 for q in qs if q['truth'] is False) == 10, f'{W}: exactly 10 true and 10 false')
    t = [sum(1 for q in qs if q['round'] == r and q['truth']) for r in (1, 2, 3)]
    ok(t[2] == 3 and sorted(t[:2]) == [3, 4], f'{W}: true statements per round {t} (round 3: 3; rounds 1 and 2: 3 and 4)')
    splits[(t[0], t[1])] += 1
    for q in qs:
        where = f'{W} statement {q["n"]} ({q["slot"]})'
        ok(q['slot'] in SLOT, f'{where}: the slot is in the bank')
        r, s = SLOT[q['slot']]
        ok(r + 1 == q['round'], f'{where}: round {q["round"]} draws only from its own round (the slot is from round {r + 1})')
        ok(isinstance(q['truth'], bool), f'{where}: the stored truth is true or false')
        ok(q['text'] in ALL_TEXT, f'{where}: the statement exists in the bank word for word')
        slot_id, field = ALL_TEXT[q['text']]
        ok(slot_id == q['slot'], f'{where}: the text belongs to this slot')
        ok(q['truth'] == (field == 'true'), f'{where}: the stored truth ({q["truth"]}) is the bank field "{field}"')
        ok(q['text'] == s['true' if q['truth'] else 'false'], f'{where}: the text is the slot\'s {"TRUE" if q["truth"] else "FALSE"} version')
        ok(q['why'] == s['why'] and q['mistake'] == s['mistake'], f'{where}: the why and the slip are the slot\'s')
        slot_seen[q['slot']] += 1
        version_seen[(q['slot'], q['truth'])] += 1
        pos_true[(q['round'], q['k'])][q['truth']] += 1
    sig_full[tuple((q['slot'], q['truth']) for q in qs)] += 1
    for r in (1, 2, 3):
        sig_order[tuple(q['slot'] for q in qs if q['round'] == r)] += 1
    draws[tuple(sorted(q['slot'] for q in qs))] += 1

# ---------------- across the games ----------------
N = len(games)
ok(len(sig_full) == N, f'every game is different ({len(sig_full)} of {N})')
ok(len(draws) > N * 0.95, f'the draw of slots varies ({len(draws)} different draws in {N} games)')
orders = {r: len({tuple(q['slot'] for q in qs if q['round'] == r) for qs in games.values()}) for r in (1, 2, 3)}
ok(all(v > N * 0.9 for v in orders.values()), f'the order inside each round varies {orders}')
ok(set(splits) == {(3, 4), (4, 3)} and all(0.35 * N <= v <= 0.65 * N for v in splits.values()), f'the 3 / 4 split and the 4 / 3 split are both common {dict(splits)}')
ok(set(slot_seen) == set(SLOT), f'every slot turns up (missing: {set(SLOT) - set(slot_seen)})')
# the share of games that should draw each slot: draw at random as the rules say, and keep only the draws with no conflicting pair
rng = random.Random(20261012)
by_round = [[s['id'] for s in rd['slots']] for rd in BANK['rounds']]
kept, hits = 0, Counter()
for _ in range(50000):
    draw = [rng.sample(by_round[r], SIZES[r]) for r in range(3)]
    chosen = {i for rd in draw for i in rd}
    if any(a in chosen and b in chosen for a, b in CONFLICTS): continue
    kept += 1
    hits.update(chosen)
ok(kept > 1000, f'{kept} of 50000 random draws have no conflicting pair, so the rule can always be met')
EXPECT = {i: hits[i] / kept for i in SLOT}
for i, (r, s) in SLOT.items():
    expect = EXPECT[i]                                        # the chance that a slot is in a game that has no conflicting pair
    share = slot_seen[i] / N
    ok(abs(share - expect) < 0.12, f'slot {i}: drawn in {share:.0%} of games (expected {expect:.0%} once conflicting pairs are left out)')
    tshare = version_seen[(i, True)] / max(1, slot_seen[i])
    ok(0.30 <= tshare <= 0.70, f'slot {i}: its TRUE version is shown in {tshare:.0%} of the games that draw it')
for (r, k), c in sorted(pos_true.items()):
    share = c[True] / (c[True] + c[False])
    ok(0.33 <= share <= 0.67, f'round {r} statement {k}: TRUE {share:.0%} of the time (position does not give the answer away)')
ok(True, 'done')

# ---------------- cues in the bank (printed, not failed) ----------------
T = [s['true'] for _, s in SLOT.values()]; F = [s['false'] for _, s in SLOT.values()]
mean = lambda L: sum(map(len, L)) / len(L)
absolutes = re.compile(r"\b(all|only|never|no|nothing|none|every|always|just)\b", re.I)
negatives = re.compile(r"\b(not|never|neither)\b", re.I)
print(f'{N} games, {checks} checks passed')
print(f'cue report: mean length TRUE {mean(T):.0f} characters, FALSE {mean(F):.0f}; '
      f'negatives TRUE {sum(bool(negatives.search(x)) for x in T)} of 36, FALSE {sum(bool(negatives.search(x)) for x in F)} of 36; '
      f'absolute words TRUE {sum(bool(absolutes.search(x)) for x in T)} of 36, FALSE {sum(bool(absolutes.search(x)) for x in F)} of 36')
