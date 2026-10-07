#!/usr/bin/env python3
"""
Independent check of the What's Wrong With This? game's generated questions (What The Earth Gives
Us, 9G and 9I). The browser dumps N generated games (JSON, from
build/test-what-the-earth-gives-us-game.js); this script re-derives every answer, every named
error and every line of working from the DATA each question kept (which claim, which rates), and
checks the rules: exactly one correct option in every claim, the right skills in the right order
(the ramp), the two forced items in round 2, the pool for questions 17 and 18, and that games
really differ from student to student.

    python3 build/check-what-the-earth-gives-us-game.py games.json
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
def num(s): return sympify(str(s).replace(',', '').replace('×', '*').replace('−', '-').replace('÷', '/'))

ERRORS = {
    'nothing': 'Nothing is wrong with this claim.',
    'manmade': 'It confuses being processed or dug up by people with being made by people.',
    'canregrow': 'It assumes something is renewable just because a living thing involved can grow back.',
    'assumesstops': 'It assumes a natural supply eventually runs out, when it actually keeps arriving.',
    'confusesmachine': 'It blames the resource for a problem that is really about the machine or equipment.',
    'wrongreason': 'It reaches the right conclusion, but for the wrong reason.',
    'ignoresrate': 'It ignores the actual rates and jumps to a conclusion.',
    'onetree': 'It confuses one example being used up with the whole resource running out.',
    'assumesrenewable': 'It assumes a resource is renewable everywhere, ignoring places where it is not.',
    'wrongfact': 'It gets a basic fact about the resource wrong.',
    'noinfo': 'It states something for certain when not enough information is given to know.',
}
# The claim -> correct tag this script expects, keyed by a distinctive substring of the prompt
# (matching build/what-the-earth-gives-us-game.html's R1_BANK / R2_FORCED / R2_POOL).
R1_R2_TRUTH = [
    ('Coal is not a natural resource', 'manmade'),
    ('Sunlight is renewable, because the Sun', 'nothing'),
    ('Oil is renewable, because plants', 'canregrow'),
    ('Metal ore is non-renewable, because it forms', 'nothing'),
    ('Wave energy is non-renewable, because waves eventually stop', 'assumesstops'),
    ('Diamonds are non-renewable', 'nothing'),
    ('Wind is non-renewable, because turbines', 'confusesmachine'),
    ('Soil is non-renewable, because it forms', 'nothing'),
    ('Geothermal heat is renewable, because engineers', 'wrongreason'),
    ('Natural gas is non-renewable', 'nothing'),
    ('Fish are a renewable resource, so a fishery', 'ignoresrate'),
    ('Wood is non-renewable, because once a tree', 'onetree'),
    ('Fresh water is always renewable, because rain', 'assumesrenewable'),
    ('Bamboo is renewable', 'nothing'),
    ('Ancient old-growth forest is renewable, because trees can always grow back', 'canregrow'),
    ('Peat is non-renewable', 'nothing'),
    ('Farm animals are renewable', 'nothing'),
    ('Wheat is non-renewable, because a field can only be harvested once', 'wrongfact'),
    ('Deep groundwater from an aquifer that barely refills is renewable, because groundwater is part', 'wrongreason'),
    ('River water used for drinking is renewable', 'nothing'),
]
def truth_for(prompt):
    for needle, tag in R1_R2_TRUTH:
        if needle in prompt: return tag
    return None
FORCED_NEEDLES = ['Fish are a renewable resource, so a fishery', 'Wood is non-renewable, because once a tree']

KINDS = ['claim'] * 12 + ['rateForest', 'rateAquifer', 'rateFish', 'noRateGiven']
CATS = ['clear'] * 6 + ['reason'] * 6 + ['rate'] * 6
allowed17_18 = {'yieldGap', 'yearsToHalf'}

def one_correct(q, where):
    o = q['options']
    ok(len(o) == 4 and len({x['text'] for x in o}) == 4, f'{where}: four different options')
    good = [i for i, x in enumerate(o) if x.get('tag') is None]
    ok(good == [q['correctIndex']], f'{where}: exactly one correct option and it is correctIndex ({good}, {q["correctIndex"]})')
    ok(o[q['correctIndex']]['text'] == ERRORS[q['correctTag']], f'{where}: correct option text does not match its tag {q["correctTag"]}')
    for i, x in enumerate(o):
        if i != q['correctIndex']:
            ok(x.get('tag') == q['correctTag'], f'{where}: wrong option {i} should carry the QUESTION\'S tag ({q["correctTag"]}), so the end-of-game tally groups by misconception, not by which distractor was clicked')
            ok(x.get('msg'), f'{where}: wrong option {i} needs a message')

def check_arith(lines, where):
    for line in lines:
        sides = [num(p) for p in line.split(' = ')]
        ok(all(v == sides[0] for v in sides), f'{where}: worked line "{line}" is not true')
def check_wrongs(q, where):
    for value, w in q['wrong'].items():
        ok(num(w['how']) == num(value), f'{where}: mistake {w["tag"]} "{w["how"]}" is not {value}')
        ok(num(value) != num(q['answer']) and num(value) > 0, f'{where}: mistake equals the answer or is not positive')
        ok(w.get('tag') and w.get('msg'), f'{where}: mistake tag or message')
    ok(len(q['wrong']) >= 1, f'{where}: at least one named mistake')

for code, qs in games.items():
    ok(len(qs) == 18, f'{code}: {len(qs)} questions')
    ok([q['cat'] for q in qs] == CATS, f'{code}: categories {[q["cat"] for q in qs]}')
    ok([q['kind'] for q in qs[:16]] == KINDS, f'{code}: kinds {[q["kind"] for q in qs[:16]]}')
    ok(qs[16]['kind'] in allowed17_18 and qs[17]['kind'] in allowed17_18 and qs[16]['kind'] != qs[17]['kind'],
       f'{code}: Q17/Q18 must be the two different pool templates ({qs[16]["kind"]}, {qs[17]["kind"]})')

    r1_prompts = [q['prompt'] for q in qs[:6]]
    ok(len(set(r1_prompts)) == 6, f'{code}: round 1, six distinct claims')
    for q in qs[:6]:
        want = truth_for(q['prompt']); where = f"{code} R1 {q['prompt'][:40]}"
        ok(want is not None, f'{where}: unrecognised claim')
        ok(q['correctTag'] == want, f'{where}: correct tag should be {want}, got {q["correctTag"]}')
        one_correct(q, where)
    nTrue = sum(1 for p in r1_prompts if truth_for(p) == 'nothing')
    ok(2 <= nTrue <= 4, f'{code} R1: {nTrue} true claims drawn, expected 2 to 4')

    r2_prompts = [q['prompt'] for q in qs[6:12]]
    ok(len(set(r2_prompts)) == 6, f'{code}: round 2, six distinct claims')
    ok(all(any(n in p for p in r2_prompts) for n in FORCED_NEEDLES), f'{code}: round 2 must always include the two forced claims')
    for q in qs[6:12]:
        want = truth_for(q['prompt']); where = f"{code} R2 {q['prompt'][:40]}"
        ok(want is not None, f'{where}: unrecognised claim')
        ok(q['correctTag'] == want, f'{where}: correct tag should be {want}, got {q["correctTag"]}')
        one_correct(q, where)

    for q in qs[12:16]:
        k = q['kind']; where = f"{code} R3Q{q['n']} {k}"
        one_correct(q, where)
        if k == 'noRateGiven':
            ok(q['correctTag'] == 'noinfo', f'{where}: no rate given, so the tag must be noinfo')
        else:
            ok('nat' in q and 'use' in q and 'claimed' in q, f'{where}: the rates and the claimed conclusion must be kept as data')
            truth = 'Renewable' if q['nat'] >= q['use'] else 'Non-renewable'
            ok(q['truth'] == truth, f'{where}: stored truth {q["truth"]} does not match nat={q["nat"]} use={q["use"]}')
            want = 'nothing' if q['claimed'] == truth else 'ignoresrate'
            ok(q['correctTag'] == want, f'{where}: claimed={q["claimed"]} truth={truth} should give tag {want}, got {q["correctTag"]}')

    for q in [qs[16], qs[17]]:
        k = q['kind']; where = f"{code} R3Q{q['n']} {k}"
        if k == 'yieldGap':
            S, R, C = q['S'], q['R'], q['C']
            Y = S * R / 100
            ok(Y == int(Y), f'{where}: sustainable yield {Y} must be a whole number')
            ok(C > Y, f'{where}: the catch/cut must exceed the sustainable yield')
            ok(q['answer'] == C - Y, f'{where}: answer should be {C - Y}, got {q["answer"]}')
        else:  # yearsToHalf
            R, P, D = q['R'], q['P'], q['D']
            ok(P - R == D, f'{where}: P - R should equal D ({P} - {R} != {D})')
            ok(50 % D == 0, f'{where}: D={D} must divide 50 exactly for a whole-number answer')
            ok(q['answer'] == 50 / D, f'{where}: answer should be {50 / D}, got {q["answer"]}')
        check_arith(q['worked'], where); check_wrongs(q, where)
        ok(isinstance(q['answer'], (int, float)) and 0 < q['answer'] <= 999999, f'{where}: answer range')

print(f'{len(games)} generated games, {checks} checks passed')

q17 = Counter(qs[16]['kind'] for qs in games.values()); q18 = Counter(qs[17]['kind'] for qs in games.values())
print('Q17 kinds:', dict(q17), ' Q18 kinds:', dict(q18)); ok(len(q17) == 2 and len(q18) == 2, 'every pool item appears in both slots')
def named(q): return bool(q.get('options')) or len(q.get('wrong', {})) > 0
share = sum(named(q) for qs in games.values() for q in qs) / (18 * len(games)); print(f'questions with a named mistake: {100 * share:.0f}%'); ok(share > 0.99, 'nearly every question names a mistake')
sigs = Counter(tuple(q['disp'] for q in qs) for qs in games.values()); print(f'distinct games: {len(sigs)} of {len(games)}'); ok(len(sigs) == len(games), 'two students got exactly the same game')
first = Counter(qs[0]['disp'] for qs in games.values()); print(f'distinct Q1: {len(first)}; most common appears {first.most_common(1)[0][1]} times in {len(games)}')
last = Counter(qs[17]['disp'] for qs in games.values()); print(f'distinct Q18: {len(last)}; most common appears {last.most_common(1)[0][1]} times in {len(games)}')
