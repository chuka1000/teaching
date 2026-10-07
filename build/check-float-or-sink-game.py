#!/usr/bin/env python3
"""
Independent check of the Float Or Sink game's generated questions (10A). The browser dumps N
generated games (JSON, from build/test-float-or-sink-game.js); this script re-derives every
answer from the DATA each question kept (the material's density, the mass and volume, the real
and the wrong volume), and checks the rules: exactly one correct option among the four fixed
answers, the density comparison is done correctly (including the genuine "stays suspended" tie and
the "not enough information" trap never being correct when a comparison IS possible), the right
skills in the right order (the ramp), the pool for questions 17 and 18, and that games really
differ from student to student.

    python3 build/check-float-or-sink-game.py games.json
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

MATERIALS = {'cork': '0.25', 'oak wood': '0.85', 'ice': '0.92', 'aluminium': '2.70', 'steel': '7.90', 'gold': '19.3', 'pine wood': '0.50', 'glass': '2.50'}
LIQUIDS = {'water': Decimal('1.00'), 'seawater': Decimal('1.03'), 'mercury': Decimal('13.6')}

def verdict(obj, liq):
    return 'Floats' if obj < liq else 'Sinks' if obj > liq else 'Stays suspended'

def round2(x):
    return Decimal(x).quantize(Decimal('0.01'))

KINDS = ['compare'] * 6 + ['calc'] * 6
allowed17_18 = {'poolSuspended', 'poolReverse'}

def one_correct(q, where):
    o = q['options']
    ok(len(o) == 4 and {x['text'] for x in o} == {'Floats', 'Sinks', 'Stays suspended', 'Not enough information'}, f'{where}: the four fixed options, each once')
    good = [i for i, x in enumerate(o) if x.get('tag') is None]
    ok(good == [q['correctIndex']], f'{where}: exactly one correct option and it is correctIndex ({good}, {q["correctIndex"]})')
    for i, x in enumerate(o):
        if i != q['correctIndex']: ok(x.get('tag') and x.get('msg'), f'{where}: wrong option {i} needs a tag and a message')

for code, qs in games.items():
    ok(len(qs) == 18, f'{code}: {len(qs)} questions')
    ok([q['kind'] for q in qs[:12]] == KINDS, f'{code}: rounds 1-2 kinds {[q["kind"] for q in qs[:12]]}')
    ok(Counter(q['kind'] for q in qs[12:16]) == Counter({'hollow': 2, 'switch': 2}), f'{code}: round 3 (first four) is two hollow and two switch')
    ok(qs[16]['kind'] in allowed17_18 and qs[17]['kind'] in allowed17_18 and qs[16]['kind'] != qs[17]['kind'],
       f'{code}: Q17/Q18 must be the two different pool templates ({qs[16]["kind"]}, {qs[17]["kind"]})')

    for q in qs:
        k = q['kind']; where = f"{code} R{q['round']}Q{q['n']} {k}"
        one_correct(q, where)
        good_text = q['options'][q['correctIndex']]['text']

        if k == 'compare':
            density = Decimal(MATERIALS[q['material']])
            ok(density == round2(q['density']), f'{where}: stored density does not match {q["material"]}')
            liq = LIQUIDS[q['liquid']]
            v = verdict(density, liq)
            ok(v != 'Stays suspended', f'{where}: round 1 should never be an exact tie')
            ok(good_text == v, f'{where}: {density} vs {liq} should give {v}, got {good_text}')

        elif k == 'calc':
            mass, volume, liq = Decimal(str(q['mass'])), Decimal(q['volume']), LIQUIDS[q['liquid']]
            density = round2(mass / volume)
            v = verdict(density, liq)
            ok(v != 'Stays suspended', f'{where}: round 2 should never be an exact tie')
            ok(good_text == v, f'{where}: {mass}/{volume}={density} vs {liq} should give {v}, got {good_text}')

        elif k == 'hollow':
            mass, volume = Decimal(q['mass']), Decimal(q['volume'])
            density = round2(mass / volume)
            v = verdict(density, Decimal('1.00'))
            ok(v != 'Stays suspended', f'{where}: should not be an exact tie')
            ok(good_text == v, f'{where}: {mass}/{volume}={density} vs 1.00 should give {v}, got {good_text}')

        elif k == 'switch':
            density = Decimal(str(q['density']))
            fresh_v = verdict(density, Decimal('1.00'))
            ok(fresh_v == q['freshVerdict'], f'{where}: stored fresh-water verdict does not match')
            sea_v = verdict(density, Decimal('1.03'))
            ok(sea_v != 'Stays suspended', f'{where}: should not be an exact tie in seawater')
            ok(fresh_v != sea_v, f'{where}: the outcome must actually switch between fresh water and seawater')
            ok(good_text == sea_v, f'{where}: {density} vs seawater 1.03 should give {sea_v}, got {good_text}')

        elif k == 'poolSuspended':
            mass, volume = Decimal(q['mass']), Decimal(q['volume'])
            ok(mass == volume, f'{where}: mass must equal volume for an exact 1.00 g/cm3 density')
            ok(good_text == 'Stays suspended', f'{where}: exact tie must give "Stays suspended", got {good_text}')

        elif k == 'poolReverse':
            material, mass = q['material'], Decimal(q['mass'])
            real_density = round2(mass / Decimal(q['trueVolume']))
            ok(real_density == Decimal(MATERIALS[material]), f'{where}: real density {real_density} should equal {material}\'s listed density')
            v = verdict(real_density, Decimal('1.00'))
            ok(v != 'Stays suspended', f'{where}: should not be an exact tie')
            ok(good_text == v, f'{where}: the REAL volume should give {v}, got {good_text}')
            wrong_density = round2(mass / Decimal(q['wrongVolume']))
            ok(wrong_density != Decimal('1.00'), f'{where}: the wrong-volume density must not itself be an exact tie')

        else:
            fail(f'{where}: unknown kind')

print(f'{len(games)} generated games, {checks} checks passed')

q17 = Counter(qs[16]['kind'] for qs in games.values()); q18 = Counter(qs[17]['kind'] for qs in games.values())
print('Q17 kinds:', dict(q17), ' Q18 kinds:', dict(q18)); ok(len(q17) == 2 and len(q18) == 2, 'every pool item appears in both slots')
sigs = Counter(tuple(q['disp'] for q in qs) for qs in games.values()); print(f'distinct games: {len(sigs)} of {len(games)}'); ok(len(sigs) == len(games), 'two students got exactly the same game')
first = Counter(qs[0]['disp'] for qs in games.values()); print(f'distinct Q1: {len(first)}; most common appears {first.most_common(1)[0][1]} times in {len(games)}')
last = Counter(qs[17]['disp'] for qs in games.values()); print(f'distinct Q18: {len(last)}; most common appears {last.most_common(1)[0][1]} times in {len(games)}')
