#!/usr/bin/env python3
"""
Independent check of the Technology And Society game (7B). The browser dumps 300 generated games
and the data the game was built with (build/test-technology-and-society-game.js); this script
re-derives, WITHOUT using the game's code:

  * the data file is the data the game contains (one copy, not two);
  * every brief is complete, its rule is one allowed for it, its problem statement is a problem
    (has a "because", no fix) and its decoys are really a solution and a vague wish;
  * every generated question has exactly one right option, the right answer is the right one
    (a fair test repeats 3 times and says to take the mean; each technology/society item is
    answered by the direction the data says), and every wrong option carries a message;
  * the three technology/society questions cover all three directions in every game;
  * no example is Thailand-specific (the brief says: keep them global);
  * the games really differ from student to student.

    python3 build/check-technology-and-society-game.py games.json
"""
import json, pathlib, re, sys
from collections import Counter

HERE = pathlib.Path(__file__).parent
dump = json.load(open(sys.argv[1]))
games, game_data = dump['games'], dump['data']
file_data = json.load((HERE / 'technology-and-society.data.json').open(encoding='utf-8')); file_data.pop('note', None)
checks = 0
def fail(m): print('FAIL:', m); sys.exit(1)
def ok(c, m):
    global checks
    if not c: fail(m)
    checks += 1

ok(game_data == file_data, 'the data inside the game is exactly build/technology-and-society.data.json')

B, C, SOC = file_data['briefs'], file_data['constraints'], file_data['society']
ok(len(B) == 13 and len(C) == 6 and len(SOC) == 8, 'thirteen briefs, six rules, eight society items')
FIELDS = ['id', 'user', 'need', 'reason', 'solutionNeed', 'vagueNeed', 'measure', 'allowed']
for b in B:
    ok(all(b.get(f) for f in FIELDS), f'{b["id"]}: every field present')
    ok(set(b['allowed']) <= set(C) and len(b['allowed']) >= 3, f'{b["id"]}: allowed rules exist and there are at least three')
    ok(len({b['need'], b['solutionNeed'], b['vagueNeed']}) == 3, f'{b["id"]}: the right need and the two decoy needs are all different')
    stmt = lambda need: f"{b['user']} needs {need}, because {b['reason']}."
    right, sol, vag = f"{b['user']} needs a way to {b['need']}, because {b['reason']}.", stmt(b['solutionNeed']), stmt(b['vagueNeed'])
    ok(b['solutionNeed'] not in right and not b['solutionNeed'].startswith('a way to'), f'{b["id"]}: the fix appears ONLY in the decoy, and the decoy really names a thing, not a way')
    ok(b['vagueNeed'].startswith('a way to') and b['need'] not in b['vagueNeed'], f'{b["id"]}: the vague decoy is a broad "way to", not the real need')
    ok(all(0.80 <= len(x) / len(right) <= 1.20 for x in (sol, vag)), f'{b["id"]}: both decoys are within 20% of the right statement\'s length ({len(sol)/len(right):.2f}, {len(vag)/len(right):.2f})')
ok(len({b['id'] for b in B}) == 13, 'brief ids are unique')
ok({d for s in SOC for d in [s['dir']]} == {'society', 'tech', 'both'} and all(sum(1 for s in SOC if s['dir'] == d) >= 2 for d in ('society', 'tech', 'both')), 'at least two society items in each direction')
ok(len({s['text'] for s in SOC}) == len(SOC), 'society items are distinct')
# AVOID (brief): Thailand-specific examples only. Every example is global.
blob = json.dumps(file_data, ensure_ascii=False).lower()
for w in ['thai', 'bangkok', 'rayong', 'baht', 'phuket', 'chiang']: ok(w not in blob, f'no Thailand-specific example ("{w}")')

DIRTXT = {'tech': 'Technology is changing society', 'society': 'Society is changing technology', 'both': 'Both, one after the other'}
def q1(o): good = [i for i, x in enumerate(o['options']) if x['tag'] is None]; return good
for code, g in games.items():
    where = f'{code}'
    b = next((x for x in B if x['id'] == g['brief']['id']), None)
    ok(b is not None and g['brief'] == b, f'{where}: the brief is one from the data')
    ok(g['constraint']['id'] in b['allowed'] and g['constraint']['text'] == C[g['constraint']['id']], f'{where}: the rule is allowed for the brief')
    stmt = f"{b['user']} needs a way to {b['need']}, because {b['reason']}."
    ok(g['statement'] == stmt, f'{where}: the problem statement')
    qs = g['qs']
    ok([q['id'] for q in qs] == ['problem', 'test', 'soc1', 'soc2', 'soc3'] and [q['cat'] for q in qs] == ['problem', 'test', 'society', 'society', 'society'], f'{where}: five questions in order')
    for q in qs:
        o = q['options']
        n = 4 if q['id'] == 'test' else 3
        ok(len(o) == n and len({x['text'] for x in o}) == n, f'{where} {q["id"]}: {n} different options')
        ok(q1(q) == [q['correctIndex']], f'{where} {q["id"]}: exactly one correct option and it is correctIndex')
        ok(all(x['msg'] for i, x in enumerate(o) if i != q['correctIndex']), f'{where} {q["id"]}: every wrong option says what the mistake was')
        ok(q['why'], f'{where} {q["id"]}: an explanation')
    p = qs[0]; right = f"{b['user']} needs a way to {b['need']}, because {b['reason']}."
    sol = f"{b['user']} needs {b['solutionNeed']}, because {b['reason']}."; vag = f"{b['user']} needs {b['vagueNeed']}, because {b['reason']}."
    ok({x['text']: x['tag'] for x in p['options']} == {right: None, sol: 'solution', vag: 'vague'} and right == stmt, f'{where}: three full statements: the problem, one hiding the fix, one too vague')
    ok(len(p['options']) == 3 and all(' because ' in x['text'] for x in p['options']), f'{where}: every option says who AND why, so the reason does not give the answer away')
    ok(max(len(x['text']) for x in p['options']) / min(len(x['text']) for x in p['options']) <= 1.30, f'{where}: the three statements are within 30% of each other in length')
    ok(b['solutionNeed'] in next(x['msg'] for x in p['options'] if x['tag'] == 'solution') and b['vagueNeed'] in next(x['msg'] for x in p['options'] if x['tag'] == 'vague'), f'{where}: each wrong option\'s message quotes its own flaw')
    t = qs[1]; fair = t['options'][t['correctIndex']]['text']; M = b['measure']
    ok(len(t['options']) == 4 and all(M in x['text'] and x['text'].startswith('Test it ') for x in t['options']), f'{where}: four plans, all measuring the brief\'s measure, all in the same form')
    TABLE = ' Put them in a table.'
    def bare(x): return x[:-len(TABLE)] if x.endswith(TABLE) else x
    ok(bare(fair) in (f'Test it 3 times in the same conditions. Measure {M} each time, and find the mean.', f'Test it 3 times, keeping the conditions the same. Measure {M} each time, then find the mean of all 3.'), f'{where}: the fair test repeats 3 times, same conditions, every result, a mean')
    flaws = {x['tag']: bare(x['text']) for x in t['options'] if x['tag']}
    ok(set(flaws) == {'once', 'changes', 'best'} and 'Test it once' in flaws['once'] and 'different place' in flaws['changes'] and 'best result' in flaws['best'], f'{where}: each unfair plan has exactly its one flaw (once; changing the place; best result only)')
    ok('3 times' in flaws['changes'] and 'mean' in flaws['changes'] and ('same conditions' in flaws['best'] or 'conditions the same' in flaws['best']) and '3 times' in flaws['best'], f'{where}: the unfair plans share most of the right plan\'s wording, so a skim does not find them')
    ok(max(len(x['text']) for x in t['options']) / min(len(x['text']) for x in t['options']) <= 1.35, f'{where}: the four plans are within 35% of each other in length')
    dirs = []
    for q in qs[2:]:
        item = next((s for s in SOC if s['text'] == q['statement']), None)
        ok(item is not None and q['dir'] == item['dir'], f'{where} {q["id"]}: statement and direction come from the data')
        ok({x['text'] for x in q['options']} == set(DIRTXT.values()), f'{where} {q["id"]}: the three directions are the options')
        ok(q['options'][q['correctIndex']]['text'] == DIRTXT[item['dir']], f'{where} {q["id"]}: right answer is "{DIRTXT[item["dir"]]}"')
        ok(all(x['tag'] == 'dir_' + item['dir'] for i, x in enumerate(q['options']) if i != q['correctIndex']), f'{where} {q["id"]}: wrong options carry the question\'s own tag')
        dirs.append(item['dir'])
    ok(sorted(dirs) == ['both', 'society', 'tech'] and len({q['statement'] for q in qs[2:]}) == 3, f'{where}: the three society questions cover all three directions, no repeats')

print(f'{len(games)} generated games, {checks} checks passed')
# THE BIAS: the right answer must not be the longest (or the most developed) option.
def longest_is_right(qi): return sum(1 for g in games.values() if len(g['qs'][qi]['options'][g['qs'][qi]['correctIndex']]['text']) == max(len(o['text']) for o in g['qs'][qi]['options'])) / len(games)
def shortest_is_right(qi): return sum(1 for g in games.values() if len(g['qs'][qi]['options'][g['qs'][qi]['correctIndex']]['text']) == min(len(o['text']) for o in g['qs'][qi]['options'])) / len(games)
for qi, name, n in ((0, 'problem statement', 3), (1, 'fair test', 4)):
    lo, sh = longest_is_right(qi), shortest_is_right(qi)
    print(f'{name}: the right answer is the LONGEST option in {100 * lo:.0f}% of games and the SHORTEST in {100 * sh:.0f}% (chance would be {100 / n:.0f}%)')
    ok(lo <= 1.5 / n and sh <= 1.5 / n, f'{name}: length does not give the right answer away')
ok(len({b['id'] for b in (g['brief'] for g in games.values())}) == 13, 'all thirteen briefs turn up in 300 games')
ok(len({g['constraint']['id'] for g in games.values()}) == 6, 'all six rules turn up')
sig = Counter(g['disp'] for g in games.values()); print(f'distinct games: {len(sig)} of {len(games)}'); ok(len(sig) >= 280, 'games differ from student to student')
print('brief and rule pairs used:', len({(g['brief']['id'], g['constraint']['id']) for g in games.values()}), 'of', sum(len(b['allowed']) for b in B))
