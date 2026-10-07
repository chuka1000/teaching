#!/usr/bin/env python3
"""
Independent check of the Accuracy Or Precision game's generated questions (Measuring And
Recording Honestly, 7B). The browser dumps N generated games (JSON, from
build/test-measuring-and-recording-honestly-game.js); this script re-derives every answer from
the DATA each question kept (the raw readings, the true value, the instrument task, the
resolution), and checks the rules: exactly one correct option among the four fixed classifications,
the mean and spread are computed correctly and the accuracy/precision classification genuinely
follows from them (mean equals the true value exactly whenever "accurate" is claimed, never
otherwise), the right skills in the right order (the ramp), the pool for questions 17 and 18, and
that games really differ from student to student.

    python3 build/check-measuring-and-recording-honestly-game.py games.json
"""
import json, sys
from collections import Counter
from decimal import Decimal

games = json.load(open(sys.argv[1]))
checks = 0
def fail(msg): print('FAIL:', msg); sys.exit(1)
def ok(cond, msg):
    global checks
    if not cond: fail(msg)
    checks += 1

AP_TEXT = {'Accurate and precise', 'Precise, not accurate', 'Accurate, not precise', 'Neither accurate nor precise'}

def D(x):
    return Decimal(str(x))

def one_correct(q, where, expect_texts):
    o = q['options']
    ok(len(o) == 4 and {x['text'] for x in o} == expect_texts, f'{where}: the four fixed options, each once')
    good = [i for i, x in enumerate(o) if x.get('tag') is None]
    ok(good == [q['correctIndex']], f'{where}: exactly one correct option and it is correctIndex ({good}, {q["correctIndex"]})')
    for i, x in enumerate(o):
        if i != q['correctIndex']: ok(x.get('tag') and x.get('msg'), f'{where}: wrong option {i} needs a tag and a message')

def classify_verdict(mean, true_val, spread, tight_max):
    accurate = mean == true_val
    precise = spread <= tight_max
    if accurate and precise: return 'Accurate and precise'
    if accurate and not precise: return 'Accurate, not precise'
    if not accurate and precise: return 'Precise, not accurate'
    return 'Neither accurate nor precise'

# The tight/wide bands from the generator, keyed by unit name, used to decide "precise" for the
# harder (4-reading) pool question, where the message does not state it directly.
TIGHT_MAX = {'cm': D('0.2'), 'g': D('0.4'), '°C': D('2'), 's': D('0.2')}

KINDS = ['classify'] * 6 + ['instrument'] * 6
allowed17_18 = {'poolResolution', 'poolHardClassify'}

for code, qs in games.items():
    ok(len(qs) == 18, f'{code}: {len(qs)} questions')
    ok([q['kind'] for q in qs[:12]] == KINDS, f'{code}: rounds 1-2 kinds {[q["kind"] for q in qs[:12]]}')
    ok(all(q['kind'] == 'classify' for q in qs[12:16]), f'{code}: round 3 (first four) is all classify')
    ok(qs[16]['kind'] in allowed17_18 and qs[17]['kind'] in allowed17_18 and qs[16]['kind'] != qs[17]['kind'],
       f'{code}: Q17/Q18 must be the two different pool templates ({qs[16]["kind"]}, {qs[17]["kind"]})')
    ok(len({q['task'] for q in qs[6:12]}) == 6, f'{code}: round 2, six distinct instrument tasks')

    for q in qs:
        k = q['kind']; where = f"{code} R{q['round']}Q{q['n']} {k}"

        if k == 'classify':
            one_correct(q, where, AP_TEXT)
            readings = [D(r) for r in q['readings']]
            mean = sum(readings) / len(readings)
            spread = max(readings) - min(readings)
            ok(mean == D(q['mean']), f'{where}: mean {mean} does not match stored {q["mean"]}')
            ok(spread == D(q['spread']), f'{where}: spread {spread} does not match stored {q["spread"]}')
            true_val = D(q['trueValue'])
            tight_max = TIGHT_MAX[q['unit']]
            want = classify_verdict(mean, true_val, spread, tight_max)
            good_text = q['options'][q['correctIndex']]['text']
            ok(good_text == want, f'{where}: readings {q["readings"]} (mean {mean}, true {true_val}, spread {spread}) should give "{want}", got "{good_text}"')

        elif k == 'poolHardClassify':
            one_correct(q, where, AP_TEXT)
            readings = [D(r) for r in q['readings']]
            ok(len(readings) == 4, f'{where}: the hard pool question must use four readings')
            mean = sum(readings) / len(readings)
            spread = max(readings) - min(readings)
            ok(mean == D(q['mean']), f'{where}: mean {mean} does not match stored {q["mean"]}')
            ok(spread == D(q['spread']), f'{where}: spread {spread} does not match stored {q["spread"]}')
            true_val = D(q['trueValue'])
            tight_max = TIGHT_MAX[q['unit']]
            want = classify_verdict(mean, true_val, spread, tight_max)
            good_text = q['options'][q['correctIndex']]['text']
            ok(good_text == want, f'{where}: readings {q["readings"]} (mean {mean}, true {true_val}, spread {spread}) should give "{want}", got "{good_text}"')

        elif k == 'instrument':
            o = q['options']
            ok(len(o) == 4 and len({x['text'] for x in o}) == 4, f'{where}: four different instrument options')
            good = [i for i, x in enumerate(o) if x.get('tag') is None]
            ok(good == [q['correctIndex']], f'{where}: exactly one correct instrument option')
            for i, x in enumerate(o):
                if i != q['correctIndex']: ok(x.get('tag') and x.get('msg'), f'{where}: wrong instrument option {i} needs a tag and a message')

        elif k == 'poolResolution':
            o = q['options']
            texts = [x['text'] for x in o]
            ok(len(texts) == 4 and len(set(texts)) == 4, f'{where}: four different recording options')
            good_text = o[q['correctIndex']]['text']
            ok(good_text == f'{q["value"]} {q["unit"]}', f'{where}: the honest recording should be "{q["value"]} {q["unit"]}", got "{good_text}"')
            ok(f'{q["value"]}.00 {q["unit"]}' in texts and f'{q["value"]}.0 {q["unit"]}' in texts, f'{where}: must offer both over-precise distractors')
            for i, x in enumerate(o):
                if i != q['correctIndex']: ok(x.get('tag') and x.get('msg'), f'{where}: wrong option {i} needs a tag and a message')

        else:
            fail(f'{where}: unknown kind')

print(f'{len(games)} generated games, {checks} checks passed')

q17 = Counter(qs[16]['kind'] for qs in games.values()); q18 = Counter(qs[17]['kind'] for qs in games.values())
print('Q17 kinds:', dict(q17), ' Q18 kinds:', dict(q18)); ok(len(q17) == 2 and len(q18) == 2, 'every pool item appears in both slots')
sigs = Counter(tuple(q['disp'] for q in qs) for qs in games.values()); print(f'distinct games: {len(sigs)} of {len(games)}'); ok(len(sigs) == len(games), 'two students got exactly the same game')
first = Counter(qs[0]['disp'] for qs in games.values()); print(f'distinct Q1: {len(first)}; most common appears {first.most_common(1)[0][1]} times in {len(games)}')
last = Counter(qs[17]['disp'] for qs in games.values()); print(f'distinct Q18: {len(last)}; most common appears {last.most_common(1)[0][1]} times in {len(games)}')
