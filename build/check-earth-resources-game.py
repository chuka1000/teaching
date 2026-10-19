#!/usr/bin/env python3
"""
Independent check of the Earth Resources revision game's generated questions (9G and 9I). The browser dumps N generated games (JSON, from
build/test-earth-resources-game.js); this script re-derives, from build/earth-resources.bank.json and the formulas written out again here with sympy
(not from the game):

  - every game: 54 questions in five levels of 10, 12, 12, 10 and 10; the strand, skill and kind of every slot are the bank's, in the bank's order
    (so the ramp and the diagnostic mean the same thing for every student);
  - every non-numeric question comes from the bank: the item is in that slot's pool, the right answer and the named wrong answers are the bank's, the
    options are four different texts with exactly one right, every wrong answer has a named mistake and a message, every assign row has a right answer on
    its own menu, every order has its steps in the bank's order with a shuffled display that is not the right order, every build has the four right cards
    and four distractors that are not right cards, every written answer has the bank's mark points and model answer;
  - every numeric question: the answer, every named mistake value and the sum written for it (the `how`) are recomputed with sympy from the numbers
    the question kept, all whole numbers, every mistake different from the answer and from the other mistakes, and the working ends on the answer;
  - across the games: the strands and skills in order are identical, every item of every pool is drawn (and about as often as it should be), no two
    games are alike, the right answer is in each of the four positions about a quarter of the time, and the right answer is not the longest option
    much more often than chance;
  - the feedback an all-wrong game showed in the browser (written by the test next to the dump) carries the bank's message for each wrong answer and
    the working, for every kind of question;
  - the file in the lesson folder: the bank is written into it, it makes no external request, stores nothing, has no em dash, uses the 'topsoil'
    palette and Arial and Georgia.

    python3 build/check-earth-resources-game.py games.json
"""
import json, pathlib, re, sys
from collections import Counter
from sympy import Rational as R, sympify, Integer

HERE = pathlib.Path(__file__).parent
games = json.load(open(sys.argv[1]))
play = json.load(open(sys.argv[1] + '.play.json'))
bank = json.load(open(HERE / 'earth-resources.bank.json'))
checks = 0


def fail(msg):
    print('FAIL:', msg); sys.exit(1)


def ok(cond, msg):
    global checks
    if not cond:
        fail(msg)
    checks += 1


def comma(n):
    return f'{int(n):,}'


HAB = bank['habits']
SIZES = [10, 12, 12, 10, 10]
SLOTS = [(li + 1, si + 1, sl) for li, lv in enumerate(bank['levels']) for si, sl in enumerate(lv['slots'])]
ok([len([s for s in SLOTS if s[0] == l + 1]) for l in range(5)] == SIZES, 'the bank has five levels of 10, 12, 12, 10 and 10')
SEQ = [(l, n, sl['strand'], sl['skill']) for l, n, sl in SLOTS]
KIND_OF = {'mc': 'mc', 'num': 'num', 'assign': 'assign', 'order': 'order', 'build': 'build', 'written': 'written'}

# ---------------------------------------------------------------------------------------------- the numeric templates, derived again with sympy
RESOURCE_UNITS = {'tonnes', 'hectares', 'deer', 'seals'}


def val(x):
    x = R(x)
    ok(x.q == 1, f'a whole number was expected, got {x}')
    return int(x)


def derive(Q):
    """-> (answer, {mistake value: tag}, unit)"""
    p, t = Q['params'], Q['tpl']
    if t == 'time_form':
        Rr, n = R(p['R']), R(p['n'])
        ok(p['R'] in (100, 150, 200, 250, 300) and p['n'] in (2, 3, 4) and Rr * n <= 1000, f'time_form numbers {p}')
        return Rr * n, {Rr + n: 'time-calc-add', Rr: 'time-calc-one'}, 'years'
    if t == 'yield':
        S, g = R(p['S']), R(p['rate'])
        ok(p['rate'] in (2, 4, 5, 8) and p['unit'] in RESOURCE_UNITS, f'yield numbers {p}')
        return S * g / 100, {S * g: 'yield-percent', S / g: 'yield-flip'}, p['unit']
    if t == 'pctpoints':
        a, b = R(p['a']), R(p['b'])
        return b - a, {(b - a) * 100 / a: 'pct-points'}, 'percentage points'
    if t == 'pctdec':
        S, nw = R(p['S']), R(p['now'])
        pc = (S - nw) * 100 / S
        ok(pc in (20, 60, 75, 90), f'pctdec percentage {pc}')
        return pc, {(S - nw) * 100 / nw: 'pct-wrong-base', 100 - pc: 'pct-left'}, '%'
    if t == 'decline2':
        S = R(p['S']); ok(p['n'] == 2, 'decline2 has two periods')
        return S / 4, {S / 2: 'decline-stop', S * 3 / 4: 'decline-lost'}, p['unit']
    if t == 'yield_left':
        S, g, taken = R(p['S']), R(p['rate']), R(p['taken'])
        Y = S * g / 100
        ok(1000 <= Y - taken <= 3000 and p['rate'] in (4, 5, 8), f'yield_left numbers {p}')
        return Y - taken, {Y: 'yield-compare', taken: 'yield-compare'}, p['unit']
    if t == 'decline3':
        S = R(p['S']); ok(p['n'] == 3, 'decline3 has three periods')
        return S / 8, {S / 4: 'decline-stop', S / 16: 'decline-extra', S - S / 8: 'decline-lost'}, p['unit']
    if t == 'cover_area':
        A, pc = R(p['A']), R(p['p'])
        ans = A * pc / 100
        return ans, {A - ans: 'cover-left', A * pc: 'pct-forgot100'}, 'hectares'
    if t == 'decline_third2':
        S = R(p['S'])
        return S * 4 / 9, {S * 2 / 3: 'decline-stop', S * 5 / 9: 'decline-lost', S / 3: 'decline-linear'}, p['unit']
    if t == 'recycle_years':
        M, U, cut = R(p['M']), R(p['U']), R(p['cut'])
        ans = M / (U * (100 - cut) / 100)
        return ans, {M / U: 'recycle-ignored', M / (U * cut / 100): 'recycle-misread'}, 'years'
    if t == 'next_stock':
        S, g, C = R(p['S']), R(p['rate']), R(p['caught'])
        Y = S * g / 100
        ok(C > Y, 'next_stock: more is caught than the yield, so the stock falls')
        return S + Y - C, {S - C: 'ignore-growth', S + Y: 'ignore-catch'}, 'tonnes'
    if t == 'share':
        P1, p1, P2, p2 = R(p['P1']), R(p['p1']), R(p['P2']), R(p['p2'])
        ans = P2 * p2 / 100 - P1 * p1 / 100
        ok(ans > 0, 'share: more people live in cities')
        return ans, {p2 - p1: 'share-vs-number', P2 - P1: 'share-vs-number'}, 'million people'
    if t == 'linear':
        S = R(p['S'])
        ans = S * R(4, 5) ** 3
        return ans, {S * 2 / 5: 'decline-linear', S * R(4, 5) ** 2: 'decline-stop', S - ans: 'decline-lost'}, p['unit']
    if t == 'vh_ratio':
        Rr, L, Y, D = R(p['R']), R(p['L']), R(p['Y']), R(p['D'])
        lose, rebuild = D * Y / L, D * Rr
        ok(lose.q == 1, 'vh_ratio: the time to lose it is a whole number of years')
        ans = rebuild / lose
        ok(ans == Rr * L / Y, 'vh_ratio: the ratio does not depend on the depth')
        return ans, {rebuild: 'ratio-wrong-quantity', lose: 'ratio-wrong-quantity'}, 'times longer'
    if t == 'vh_reverse':
        g, H = R(p['rate']), R(p['H'])
        S = H * 100 / g
        ok(S * g / 100 == H, 'vh_reverse: the forest at that rate gives exactly that yield')
        return S, {H * g / 100: 'reverse-flip', H / g: 'reverse-scale'}, 'hectares'
    if t == 'vh_count':
        S, lim = R(p['S']), R(p['lim'])
        n, cur = 0, S
        while cur >= lim:
            cur = cur * 2 / 3; n += 1
            ok(cur.q == 1, 'vh_count: every year’s amount is a whole number')
        ok(n - 1 >= 1 and S * R(2, 3) ** (n - 1) >= lim, 'vh_count: the year before is not below the limit')
        return R(n), {R(n - 1): 'count-early', R(n + 1): 'count-late'}, 'years'
    if t == 'vh_stock2':
        S, g, H = R(p['S']), R(p['rate']), R(p['H'])
        Y = S * g / 100
        s1 = S + Y - H; s2 = s1 + s1 * g / 100 - H
        ok(H > Y and H > s1 * g / 100, 'vh_stock2: the forest shrinks')
        return s2, {S - 2 * H: 'ignore-growth', s1: 'stop-early', S + 2 * Y - 2 * H: 'growth-original'}, 'hectares'
    fail(f'unknown template {t}')


def eval_how(how):
    """the sum written for a named mistake must give the value written after the equals sign"""
    if ' = ' not in how:
        return None
    left, right = how.rsplit(' = ', 1)
    if not re.fullmatch(r'[0-9,\s()+−×÷*/.-]+', left):
        return None
    expr = left.replace(',', '').replace('−', '-').replace('×', '*').replace('÷', '/')
    return sympify(expr, rational=True), R(right.replace(',', '').strip())


def check_numeric(Q, where):
    ans, mistakes, unit = derive(Q)
    ok(ans.q == 1 and ans > 0, f'{where}: the answer is a positive whole number ({ans})')
    ok(Q['answer'] == int(ans), f'{where}: {Q["tpl"]} answer {Q["answer"]} is really {ans}')
    ok(Q['unit'] == unit, f'{where}: unit {Q["unit"]} is {unit}')
    exp = {}
    for v, tag in mistakes.items():
        ok(v.q == 1 and v > 0, f'{where}: mistake value {v} is a positive whole number')
        ok(v != ans, f'{where}: a mistake ({tag}) equals the answer')
        exp[int(v)] = tag
    ok(len(exp) == len(mistakes), f'{where}: two mistakes have the same value ({list(mistakes.items())})')
    got = {m['value']: m['tag'] for m in Q['mistakes']}
    ok(got == exp, f'{where}: mistakes {got} are {exp}')
    for m in Q['mistakes']:
        ok(m['tag'] in HAB, f'{where}: tag {m["tag"]} has a habit line')
        ok(m['msg'] and m['how'], f'{where}: a mistake has a message and a sum')
        e = eval_how(m['how'])
        if e:
            ok(e[0] == e[1] == m['value'], f'{where}: the sum "{m["how"]}" gives {e[0]}, but the mistake value is {m["value"]}')
    ok(comma(Q['answer']) in Q['explain'][-1] or str(Q['answer']) in Q['explain'][-1], f'{where}: the working ends on the answer ({Q["explain"][-1]})')
    # every sum written in the working (a run of numbers and operators, an equals sign, a number) is evaluated
    for line in Q['explain']:
        for mm in re.finditer(r'([0-9(][0-9,\s()+\u2212\u00d7\u00f7.]*?) = ([0-9][0-9,]*(?:\.[0-9]+)?)(?![0-9])', line):
            e = eval_how(mm.group(1) + ' = ' + mm.group(2))
            if e:
                ok(e[0] == e[1], f'{where}: the working "{mm.group(0)}" does not add up ({e[0]} against {e[1]})')
    # the numbers in the question are the ones the question kept
    for k, v in Q['params'].items():
        if isinstance(v, int) and v >= 1000:
            ok(comma(v) in Q['prompt'], f'{where}: the prompt shows {k} = {comma(v)}')


def check_gss(Q, where):
    p = Q['params']
    Y = R(p['S']) * R(p['rate']) / 100
    cat = 'depleted' if p['taken'] > Y else 'same' if p['taken'] == Y else 'growing'
    ok(cat == p['cat'], f'{where}: category {p["cat"]} against the numbers')
    texts = ['This resource is being depleted', 'This resource is not being depleted; it stays the same', 'This resource is not being depleted; it is growing', 'There is not enough information to decide']
    ok(sorted(o['text'] for o in Q['options']) == sorted(texts), f'{where}: the four gss options')
    right = texts[{'depleted': 0, 'same': 1, 'growing': 2}[cat]]
    ok(Q['options'][Q['correctIndex']]['text'] == right, f'{where}: the right gss option is "{right}"')
    ok(p['S'] * p['rate'] % 100 == 0, f'{where}: whole yield')
    for o in Q['options']:
        if o['text'] != right:
            ok(o['tag'] == 'yield-compare' and comma(int(Y)) in o['msg'], f'{where}: a wrong gss option says the sustainable yield')
    ok(comma(int(Y)) in ' '.join(Q['explain']), f'{where}: gss working shows the yield')


# ---------------------------------------------------------------------------------------------- non-numeric questions, against the bank
def pool_item(slot, Q):
    for it in slot['pool']:
        if 'tpl' not in it and it['stem'] == Q['item']:
            return it
    fail(f'{Q["level"]}.{Q["n"]}: item "{Q["item"][:50]}" is not in the slot’s pool')


def check_mc(Q, it, where):
    o = Q['options']
    ok(len(o) == 4 and len({x['text'] for x in o}) == 4, f'{where}: four different options')
    good = [i for i, x in enumerate(o) if x['tag'] is None]
    ok(good == [Q['correctIndex']], f'{where}: exactly one right option and it is correctIndex')
    ok(o[Q['correctIndex']]['text'] == it['right'], f'{where}: the right option is the bank’s')
    ok(sorted(x['text'] for i, x in enumerate(o) if i != Q['correctIndex']) == sorted(w['t'] for w in it['wrongs']), f'{where}: the wrong options are the bank’s')
    by = {w['t']: w for w in it['wrongs']}
    for x in o:
        if x['tag'] is not None:
            ok(x['tag'] == by[x['text']]['tag'] and x['msg'] == by[x['text']]['m'], f'{where}: a wrong option keeps its tag and message')
            ok(x['tag'] in HAB, f'{where}: tag {x["tag"]} has a habit line')
    ok(Q['explain'] == it['explain'] and Q['prompt'] == it['stem'], f'{where}: prompt and working are the bank’s')


def check_assign(Q, it, where, slot_lists):
    ok(len(Q['rows']) == 4, f'{where}: four rows')
    ok(all(r['answer'] in Q['options'] for r in Q['rows']), f'{where}: every row’s answer is on its menu')
    ok(len(set(Q['options'])) == len(Q['options']) and set(Q['options']) == set(it['options']), f'{where}: the menu is the bank’s')
    ok(len({r['text'] for r in Q['rows']}) == 4, f'{where}: four different rows')
    ok(Q['tag'] in HAB and Q['tag'] == it['tag'], f'{where}: tag')
    if it['tag'] == 'renew-class':
        ren = {t for t, a in slot_lists['renew_pool']}; non = {t for t, a in slot_lists['nonrenew_pool']}
        rows = {r['text']: r['answer'] for r in Q['rows']}
        ok(all((r in ren and a == 'Renewable') or (r in non and a == 'Non-renewable') for r, a in rows.items()), f'{where}: renewable and non-renewable rows are right')
        ok(sum(a == 'Renewable' for a in rows.values()) == 2, f'{where}: two renewable rows')
    elif it['tag'] == 'renew-rate':
        ren = set(slot_lists['rate_pool_renew']); non = set(slot_lists['rate_pool_not'])
        rows = {r['text']: r['answer'] for r in Q['rows']}
        ok(all((r in ren and a == 'Renewable') or (r in non and a == 'Not renewable in practice') for r, a in rows.items()), f'{where}: the rate rows are right')
        ok(sum(a == 'Renewable' for a in rows.values()) == 2, f'{where}: two renewable rows')
    else:
        ok(sorted((r['text'], r['answer']) for r in Q['rows']) == sorted((r['t'], r['a']) for r in it['rows']), f'{where}: the rows are the bank’s')
        ok(len({r['answer'] for r in Q['rows']}) == 4, f'{where}: each answer is used once')


def check_order(Q, it, where, slot_lists):
    exp = list(it['items'])
    if exp[0] == '{crop}':
        ok(Q['items'][0] in slot_lists['crops'], f'{where}: a crop from the list')
        exp[0] = Q['items'][0]
    ok(Q['items'] == exp, f'{where}: the steps are in the bank’s order')
    ok(sorted(Q['shown']) == sorted(exp) and Q['shown'] != exp, f'{where}: shown shuffled, not in the right order')
    ok(Q['tag'] in HAB, f'{where}: tag')


def check_build(Q, it, where):
    ok(sorted(Q['correct']) == sorted(it['right']), f'{where}: the right cards')
    ok(len(Q['cards']) == len(it['right']) + it['draw'] and len(set(Q['cards'])) == len(Q['cards']), f'{where}: card count')
    ok(set(Q['cards']) - set(Q['correct']) <= set(it['distractors']), f'{where}: distractors come from the bank')
    ok(all(c in Q['cards'] for c in Q['correct']), f'{where}: all four right cards are on the board')


def check_written(Q, it, where):
    ok([p['text'] for p in Q['points']] == [p['t'] for p in it['points']] and Q['model'] == it['model'] and Q['marks'] == it['marks'] == len(it['points']), f'{where}: points and model answer are the bank’s')
    ok(3 <= Q['marks'] <= 4 and all(p['miss'] for p in Q['points']), f'{where}: marks and a tip for every point')
    ok(not re.search(r'chlorine radical', Q['model'], re.I), f'{where}: no hard mechanism')


# ---------------------------------------------------------------------------------------------- every game
seq0 = None
pool_count = Counter(); tpl_prompts = {}
pos = Counter(); longest = 0; mcs = 0
for code, qs in games.items():
    ok(len(qs) == 54, f'{code}: {len(qs)} questions')
    seq = [(q['level'], q['n'], q['strand'], q['skill']) for q in qs]
    ok(seq == SEQ, f'{code}: levels, strands and skills are the bank’s, in the bank’s order')
    ok([q['idx'] for q in qs] == list(range(54)), f'{code}: indexes')
    for q, (l, n, sl) in zip(qs, SLOTS):
        where = f'{code} {l}.{n}'
        ok(q['strand'] in bank['strands'] and q['skill'] in bank['skills'], f'{where}: strand and skill exist')
        ok(q['src'], f'{where}: says what to revise')
        if q.get('tpl'):
            ok(any(it.get('tpl') == q['tpl'] for it in sl['pool']), f'{where}: template {q["tpl"]} is in the slot’s pool')
            pool_count[(l, n, q['tpl'])] += 1
            tpl_prompts.setdefault(q['tpl'], set()).add(q['prompt'])
            if q['tpl'] == 'gss':
                ok(q['kind'] == 'mc', f'{where}: gss is multiple choice'); check_gss(q, where)
            else:
                ok(q['kind'] == 'num', f'{where}: numeric'); check_numeric(q, where)
            if q['kind'] == 'mc':
                mcs += 1; pos[q['correctIndex']] += 1
            continue
        it = pool_item(sl, q)
        pool_count[(l, n, it['stem'])] += 1
        ok(q['kind'] == sl['kind'], f'{where}: kind {q["kind"]} is {sl["kind"]}')
        lists = bank['levels'][l - 1]['lists']
        if q['kind'] == 'mc':
            check_mc(q, it, where); mcs += 1; pos[q['correctIndex']] += 1
            lens = [len(x['text']) for x in q['options']]
            if lens[q['correctIndex']] == max(lens) and lens.count(max(lens)) == 1:
                longest += 1
        elif q['kind'] == 'assign': check_assign(q, it, where, lists)
        elif q['kind'] == 'order': check_order(q, it, where, lists)
        elif q['kind'] == 'build': check_build(q, it, where)
        elif q['kind'] == 'written': check_written(q, it, where)
        else: fail(f'{where}: kind {q["kind"]}')

# ---------------------------------------------------------------------------------------------- across the games
N = len(games)
ok(len({json.dumps(q) for q in games.values()}) == N, 'no two games are alike')
for l, n, sl in SLOTS:
    for it in sl['pool']:
        key = (l, n, it['tpl'] if 'tpl' in it else it['stem'])
        c = pool_count[key]
        want = N / len(sl['pool'])
        ok(c > 0, f'level {l} slot {n}: item "{key[2][:40]}" is never drawn')
        ok(0.55 * want < c < 1.45 * want, f'level {l} slot {n}: item "{key[2][:40]}" is drawn {c} times in {N} games, expected about {want:.0f}')
total = sum(pos.values())
for k in range(4):
    ok(0.17 < pos[k] / total < 0.33, f'the right answer is in position {k + 1} {pos[k] / total:.0%} of the time')
ok(longest / mcs < 0.25, f'the right answer is the longest option in {longest / mcs:.0%} of the multiple-choice questions drawn')
for t, ps in tpl_prompts.items():
    ok(len(ps) >= 4, f'template {t} produced only {len(ps)} different questions in {N} games')
print(f'{N} games: the right answer is the longest option in {longest / mcs:.0%} of the {mcs} multiple-choice questions; positions {[round(pos[k] / total, 2) for k in range(4)]}')

# ---------------------------------------------------------------------------------------------- what an all-wrong game showed in the browser
for vname, pl in play.items():
    qs, log = pl['qs'], pl['log']
    ok(len(log) == 54, f'{vname}: the all-wrong game logged 54 answers')
    for e in log:
        i = e['i']; Q = qs[i]; fb = e['fb']; where = f'{vname} wrong game question {i + 1}'
        ok('Revise: ' in fb, f'{where}: names the lesson to revise')
        k = i
        if Q['kind'] == 'mc':
            w = [j for j in range(4) if j != Q['correctIndex']]
            o = Q['options'][w[k % len(w)]]
            ok(Q['options'][Q['correctIndex']]['text'] in fb, f'{where}: shows the right answer')
            ok(re.sub(r'\s+', ' ', o['msg']) in fb, f'{where}: shows the message for the wrong option chosen')
            ok(Q['explain'][0] in fb, f'{where}: shows the working')
        elif Q['kind'] == 'num':
            ok(f'The answer is {comma(Q["answer"])} {Q["unit"]}.' in fb, f'{where}: shows the right answer')
            if Q['mistakes'] and k % 4 != 3:
                m = Q['mistakes'][k % len(Q['mistakes'])]
                ok(m['msg'] in fb and m['how'] in fb, f'{where}: shows the named mistake and the sum behind it')
            else:
                ok('That is not the answer' in fb, f'{where}: an unnamed wrong answer is handled')
            ok(Q['explain'][-1] in fb, f'{where}: shows the working')
        elif Q['kind'] in ('build', 'assign', 'order'):
            ok(Q['explain'][0][:60] in fb, f'{where}: shows the working')
        elif Q['kind'] == 'written':
            ok('0 of ' in fb and all(p['miss'] in fb for p in Q['points']), f'{where}: shows a tip for every missed point')

# ---------------------------------------------------------------------------------------------- the file in the lesson folder
html = (HERE.parent / 'out' / 'Earth Resources Revision' / 'Earth Resources Revision game.html').read_text(encoding='utf-8')
m = re.search(r'var BANK = (\{.*?\});\n', html, re.S)
ok(m and json.loads(m.group(1).replace('<\\/', '</')) == bank, 'the bank is written into the game file')
ok(not re.search(r'https?://', html), 'no external request')
ok('localStorage' not in html and 'sessionStorage' not in html and 'indexedDB' not in html, 'nothing is stored')
ok('—' not in html, 'no em dash')
for hexv in ('3D2B1F', 'C99A3D', '8F6D2A', '6A8C9A', 'B5482E', 'F2EBDD', 'E4D8BE'):
    ok(hexv.lower() in html.lower(), f'palette colour {hexv}')
ok('Arial' in html and 'Georgia' in html, 'fonts')
ok(html.count('/*DATA*/') == 0, 'the data slot is filled')
ok('chlorine radical' not in html.lower(), 'no chlorine radical mechanism (this game is not about the atmosphere)')
print(f'{checks} checks passed')
