#!/usr/bin/env python3
"""
Independent check of the Dig Site game's generated questions (Fossils And The Fossil
Record, 8I). The browser dumps N generated games (JSON, from
build/test-fossils-game.js); this script re-derives every answer, every known-mistake
value and every line of working from the DATA each question kept (the rock layers, the
ranges, the numbers), and checks the rules: exactly one correct option in every
multiple-choice question, the right skills in the right order (the ramp), the pools for
the last two questions, and that games really differ from student to student.

    python3 build/check-fossils-game.py games.json
"""
import json, re, sys
from collections import Counter
from sympy import sympify

games = json.load(open(sys.argv[1]))
checks = 0
def fail(msg): print('FAIL:', msg); sys.exit(1)
def ok(cond, msg):
    global checks
    if not cond: fail(msg)
    checks += 1
def num(s): return sympify(s.replace('×', '*').replace('−', '-').replace('÷', '/'))

STEPS = ['The animal dies.', 'Mud and sand bury it quickly.', 'The soft parts rot away.', 'More layers build up on top.', 'Minerals seep in and the sediment turns to rock.', 'The rock is worn away and the fossil is found.']
ORG_HARD = {'clam': 'shell', 'snail': 'shell', 'crab': 'shell', 'fish': 'bones', 'shark': 'teeth', 'sea urchin': 'spiny shell'}
ORG_SOFT = ['jellyfish', 'worm', 'slug', 'sea anemone', 'caterpillar']
SIT_BURIED = ['covered in mud', 'covered by sand', 'covered by mud', 'covered by ash']
SIT_OPEN = ['left in the sun', 'left on the surface', 'left uncovered']
SOFT_PARTS = ['The skin', 'The muscles', 'The eyes', 'The blood', 'The brain', 'The stomach']
NAMES = {'spiral': 'spiral shell', 'trilo': 'trilobite', 'fish': 'fish', 'fan': 'fan shell', 'leaf': 'leaf', 'tooth': 'tooth', 'star': 'sea star', 'bone': 'bone'}

KINDS = (['likely', 'part', 'next', 'missing', 'compare', 'rate'] + ['oldest', 'olderOf', 'countBelow', 'sameTime', 'between', 'years']
         + ['correlate', 'ranges', 'overturned', 'missingCount'])
CATS = ['form'] * 6 + ['layers'] * 6 + ['puzzle'] * 3 + ['gaps', 'gaps', 'puzzle']
allowed_kind17 = {'yearsMissing', 'probChain'}; allowed_kind18 = {'correlateFlip', 'thickSum'}

def one_correct(q, where):
    o = q['options']
    ok(len(o) == 4 and len({x['text'] for x in o}) == 4, f'{where}: four different options')
    good = [i for i, x in enumerate(o) if x.get('tag') is None]
    ok(good == [q['correctIndex']], f'{where}: exactly one option is correct and it is correctIndex ({good}, {q["correctIndex"]})')
    for i, x in enumerate(o):
        if i != q['correctIndex']: ok(x.get('tag') and x.get('msg'), f'{where}: wrong option {i} needs a tag and a message')

def rng_of(row): return set(range(row['from'], row['to'] + 1))
def lab_list(layers): return [l['label'] for l in layers]
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

def distinct_species(layers, where):
    ids = [s for l in layers for s in l['species']]
    ok(all(s in NAMES for s in ids), f'{where}: unknown species')

def check_set_consistency(q, where):
    """Layers of the same stage hold the same set; layers of different stages hold different sets."""
    seen = {}
    for l in q['site1'] + q['site2']:
        key = l['stage']; s = tuple(sorted(l['species']))
        ok(seen.setdefault(key, s) == s, f'{where}: stage {key} has two different sets')
    sets = list(seen.values()); ok(len(set(sets)) == len(sets), f'{where}: two stages have the same set')

for code, qs in games.items():
    ok(len(qs) == 18, f'{code}: {len(qs)} questions')
    ok([q['cat'] for q in qs] == CATS, f'{code}: categories {[q["cat"] for q in qs]}')
    ok([q['kind'] for q in qs[:16]] == KINDS, f'{code}: kinds {[q["kind"] for q in qs[:16]]}')
    ok(qs[16]['kind'] in allowed_kind17 and qs[17]['kind'] in allowed_kind18, f'{code}: pools {qs[16]["kind"]}, {qs[17]["kind"]}')
    for q in qs:
        k = q['kind']; where = f"{code} R{q['round']}Q{q['n']} {k}"
        if 'options' in q: one_correct(q, where)
        if k == 'likely':
            combos = set()
            for x in q['options']:
                name = next((n for n in list(ORG_HARD) + ORG_SOFT if x['text'].startswith('A ' + n + ' ') or x['text'].startswith('A ' + n + ' that')), None)
                ok(name is not None, f'{where}: organism in "{x["text"]}"')
                ok(x['hard'] == (name in ORG_HARD), f'{where}: hard flag for {name}')
                b = any(s in x['text'] for s in SIT_BURIED); o = any(s in x['text'] for s in SIT_OPEN)
                ok(b != o and x['buried'] == b, f'{where}: buried flag for "{x["text"]}"')
                combos.add((x['hard'], x['buried']))
            ok(combos == {(True, True), (False, True), (True, False), (False, False)}, f'{where}: one option of each kind')
            ok([i for i, x in enumerate(q['options']) if x['hard'] and x['buried']] == [q['correctIndex']], f'{where}: the only option with both is correct')
        elif k == 'part':
            org = q['organism']; ok(org in ORG_HARD, f'{where}: organism')
            hard = [x for x in q['options'] if x['text'] == 'The ' + ORG_HARD[org]]
            ok(len(hard) == 1 and q['options'][q['correctIndex']] is hard[0], f'{where}: the hard part is correct')
            ok(all(x['text'] in SOFT_PARTS for x in q['options'] if x is not hard[0]), f'{where}: the others are soft parts')
        elif k == 'next':
            s = q['shown']; ok(0 <= s <= 4 and q['showText'] == STEPS[s], f'{where}: shown step')
            for i, x in enumerate(q['options']):
                ok(x['text'] == STEPS[x['idx']], f'{where}: option text matches its step')
                ok((x['idx'] == s + 1) == (i == q['correctIndex']), f'{where}: correct option is the next step')
                ok(x['idx'] != s, f'{where}: an option repeats the shown step')
                if i != q['correctIndex']: ok(x['tag'] == ('earlier' if x['idx'] < s else 'later'), f'{where}: earlier/later tag')
        elif k == 'missing':
            ok(q['hard'] != q['buried'], f'{where}: exactly one condition is missing')
            want = 'hard' if not q['hard'] else 'burial'
            codes = sorted(x['code'] for x in q['options']); ok(codes == ['burial', 'hard', 'irrelevant', 'irrelevant'], f'{where}: option codes')
            ok(q['options'][q['correctIndex']]['code'] == want, f'{where}: the missing condition')
            name = next(n for n in list(ORG_HARD) + ORG_SOFT if q['prompt'].startswith('A ' + n + ' '))
            ok((name in ORG_HARD) == q['hard'], f'{where}: the organism matches the hard flag')
            b = any(s in q['prompt'] for s in SIT_BURIED); ok(b == q['buried'], f'{where}: the situation matches the buried flag')
        elif k == 'compare':
            X, Y = q['X'], q['Y']
            good = [w for w, a in (('X', X), ('Y', Y)) if a['hard'] and a['buried']]; ok(len(good) == 1, f'{where}: exactly one winner')
            w = good[0]; a, b = (X, Y) if w == 'X' else (Y, X)
            ok((a['hard'] != b['hard']) != (a['buried'] != b['buried']), f'{where}: the animals differ in exactly one thing')
            differ = 'hard' if a['hard'] != b['hard'] else 'buried'; ok(q['differ'] == differ, f'{where}: differ field')
            o = q['options'][q['correctIndex']]; ok(o['who'] == w and o['reason'] == differ, f'{where}: correct = winner + differing reason')
            for who, an in (('X', X), ('Y', Y)):
                ok(f'Animal {who} is a {an["name"]}. It dies and ' + ('is quickly covered in mud.' if an['buried'] else 'is left on the surface.') in q['prompt'], f'{where}: prompt describes animal {who}')
        elif k == 'rate':
            check_arith(q['worked'], where); check_wrongs(q, where)
            if q['form'] == 'thickness':
                ok(q['answer'] * 10 == q['rate'] * q['years'], f'{where}: mm to cm'); ok(f'{q["rate"]} mm' in q['prompt'] and f'{q["years"]} years' in q['prompt'], f'{where}: prompt numbers')
            else:
                ok(q['answer'] == q['thickness'] // q['rate'] * 1000 and q['thickness'] % q['rate'] == 0, f'{where}: years'); ok(f'{q["rate"]} cm every 1000' in q['prompt'] and f'{q["thickness"]} cm' in q['prompt'], f'{where}: prompt numbers')
        elif k in ('oldest', 'olderOf', 'countBelow', 'between'):
            ly = q['layers']; distinct_species(ly, where); ok(len(ly) >= 5 and len({l['label'] for l in ly}) == len(ly), f'{where}: layers')
            sp = [l['species'][0] for l in ly]; ok(len(set(sp)) == len(sp), f'{where}: each species once')
            ok(q['figure']['sites'][0]['layers'] == ly, f'{where}: the picture is the layer list')
            if k == 'oldest':
                ok(q['options'][q['correctIndex']]['label'] == ly[-1]['label'], f'{where}: the bottom layer')
                ok(all(x['label'] in lab_list(ly) for x in q['options']), f'{where}: option labels exist')
            elif k == 'olderOf':
                X, Y = q['pair']; ix, iy = sp.index(X), sp.index(Y); ok(ix != iy, f'{where}: two different fossils')
                deeper = X if ix > iy else Y
                o = q['options'][q['correctIndex']]; ok(o.get('sp') == deeper, f'{where}: the deeper fossil is older')
                ok(sorted(x['code'] for x in q['options']) == ['X', 'Y', 'same', 'unknown'], f'{where}: option codes')
            elif k == 'countBelow':
                ok(q['answer'] == len(ly) - 1 - sp.index(q['species']), f'{where}: layers below'); check_arith(q['worked'], where); check_wrongs(q, where)
            else:
                lo, hi = q['pair']; il, ih = sp.index(lo), sp.index(hi)
                ok(il - ih == 2, f'{where}: the two named layers have one between them')
                ok(q['options'][q['correctIndex']]['label'] == ly[il - 1]['label'], f'{where}: the layer between')
        elif k == 'sameTime':
            rows = q['chart']['rows']; X = rows[0]; ok(q['target'] == X['id'], f'{where}: target is the first row')
            ok(q['figure']['rows'] == rows and len({r['id'] for r in rows}) == 5, f'{where}: five species, and the picture is the chart')
            ok(all(1 <= r['from'] <= r['to'] <= q['chart']['stages'] for r in rows), f'{where}: ranges')
            over = [r for r in rows[1:] if rng_of(r) & rng_of(X)]; ok(len(over) == 1, f'{where}: exactly one overlaps')
            ok(q['options'][q['correctIndex']]['id'] == over[0]['id'] and {x['id'] for x in q['options']} == {r['id'] for r in rows[1:]}, f'{where}: the overlapping fossil is correct')
        elif k == 'years':
            ok(q['answer'] == q['thickness'] // q['rate'] * 1000 and q['thickness'] % q['rate'] == 0, f'{where}: years'); check_arith(q['worked'], where); check_wrongs(q, where)
        elif k in ('correlate', 'correlateFlip'):
            s1, s2 = q['site1'], q['site2']; check_set_consistency(q, where)
            ok(q['figure']['sites'][0]['layers'] == s1 and q['figure']['sites'][1]['layers'] == s2, f'{where}: the picture is the two layer lists')
            st1 = [l['stage'] for l in s1]; ok(st1 == sorted(st1, reverse=True), f'{where}: site 1 is youngest first')
            st2 = [l['stage'] for l in s2]; ok(st2 == (sorted(st2) if k == 'correlateFlip' else sorted(st2, reverse=True)), f'{where}: site 2 orientation')
            tgt = [l for l in s1 if l['label'] == q['targetLabel']][0]
            match = [l for l in s2 if sorted(l['species']) == sorted(tgt['species'])]
            o = q['options'][q['correctIndex']]
            if match: ok(len(match) == 1 and o['label'] == match[0]['label'], f'{where}: the matching layer')
            else: ok(o['label'] is None, f'{where}: no layer matches, so the answer is None')
            ok(all(x['label'] in lab_list(s2) or x['label'] is None for x in q['options']), f'{where}: option labels')
        elif k == 'ranges':
            r = {row['id']: row for row in q['chart']['rows']}; X, Y, Z = (r[q['roles'][c]] for c in 'XYZ')
            good = [s for s in range(1, 10) if s in rng_of(X) and s in rng_of(Z) and s not in rng_of(Y)]; ok(good == [q['answer']], f'{where}: layers with X and Z and not Y: {good}')
            check_wrongs(q, where)
        elif k == 'overturned':
            ref, ly = q['ref'], q['layers']; sp = [l['species'][0] for l in ly]; ok(len(ref) == 4 and sorted(sp) == sorted(ref), f'{where}: the same four fossils')
            ok(sp == (ref if q['flipped'] else ref[::-1]), f'{where}: the layers are {"upside down" if q["flipped"] else "the right way up"}')
            oldest = [l for l in ly if l['species'][0] == ref[0]][0]
            ok(q['options'][q['correctIndex']]['label'] == oldest['label'], f'{where}: the layer with the oldest known fossil')
            ok(q['figure']['ref'] == ref and q['figure']['sites'][0]['layers'] == ly, f'{where}: the picture')
        elif k in ('missingCount', 'yearsMissing'):
            ref, ly = q['ref'], q['layers']; ok(len(set(ref)) == 8 and len(ly) == 4, f'{where}: eight known, four in the rock')
            idx = [ref.index(l['species'][0]) for l in ly][::-1]; ok(idx == sorted(idx) and len(set(idx)) == 4, f'{where}: increasing places')
            missing = idx[-1] - idx[0] + 1 - 4; ok(1 <= missing <= 3, f'{where}: 1 to 3 missing')
            ans = missing * (q['T'] if k == 'yearsMissing' else 1); ok(q['answer'] == ans, f'{where}: answer {q["answer"]} vs {ans}')
            check_arith(q['worked'], where); check_wrongs(q, where)
            if k == 'yearsMissing': ok(f'{q["T"]} thousand years' in q['prompt'], f'{where}: T in the prompt')
        elif k == 'probChain':
            N, A, C = q['N'], q['A'], q['C']; ok(N % A == 0 and (N // A) % 2 == 0 and (N // A // 2) % C == 0, f'{where}: whole numbers all the way')
            ok(q['answer'] == N // A // 2 // C, f'{where}: chain'); check_arith(q['worked'], where); check_wrongs(q, where)
            ok(f'1 in {A} ' in q['prompt'] and f'1 in {C} ' in q['prompt'], f'{where}: numbers in the prompt')
        elif k == 'thickSum':
            ly = q['layers']; R = q['rate']; sp = [l['species'][0] for l in ly]
            ok(all(l['thick'] % R == 0 and l['thick'] > 0 for l in ly), f'{where}: thickness is a whole number of {R} cm')
            il, ih = sp.index(q['lowSp']), sp.index(q['highSp']); ok(il > ih and il - ih >= 2, f'{where}: the two fossils')
            layers_between = ly[ih:il]                                   # above the low layer, up to and including the high layer
            ok(q['answer'] == sum(l['thick'] for l in layers_between) // R, f'{where}: answer'); check_arith(q['worked'], where); check_wrongs(q, where)
            ok(q['figure']['sites'][0]['layers'] == ly, f'{where}: the picture')
        else: fail(f'{where}: unknown kind')
        if 'unit' in q and 'options' not in q and not q.get('noArith'): pass
        if 'answer' in q and 'options' not in q: ok(isinstance(q['answer'], int) and 0 < q['answer'] <= 999999, f'{where}: answer range')
print(f'{len(games)} generated games, {checks} checks passed')

q17 = Counter(qs[16]['kind'] for qs in games.values()); q18 = Counter(qs[17]['kind'] for qs in games.values())
print('Q17 kinds:', dict(q17), ' Q18 kinds:', dict(q18)); ok(len(q17) == 2 and len(q18) == 2, 'every pool item appears')
def named(q): return ('options' in q) or len(q.get('wrong', {})) > 0
share = sum(named(q) for qs in games.values() for q in qs) / (18 * len(games)); print(f'questions with a named mistake: {100 * share:.0f}%'); ok(share > 0.99, 'nearly every question names a mistake')
sigs = Counter(tuple(q['disp'] for q in qs) for qs in games.values()); print(f'distinct games: {len(sigs)} of {len(games)}'); ok(len(sigs) == len(games), 'two students got exactly the same game')
first = Counter(qs[0]['disp'] for qs in games.values()); print(f'distinct Q1: {len(first)}; most common appears {first.most_common(1)[0][1]} times in {len(games)}')
last = Counter(qs[17]['disp'] for qs in games.values()); print(f'distinct Q18: {len(last)}; most common appears {last.most_common(1)[0][1]} times in {len(games)}')
