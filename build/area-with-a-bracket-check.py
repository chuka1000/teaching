#!/usr/bin/env python3
"""
Area With A Bracket (8CN, Lesson 9). Every expression, table and check value in the deck, the worksheet and the
speaker notes is derived here with sympy, and the strings typed in the files are READ BACK and compared, so the
files and the check cannot drift apart.

    python3 build/area-with-a-bracket-check.py

Part 1 checks the worksheet data in build/area-with-a-bracket-answers.js (the one module the worksheet and its
upside-down answers read). Part 2 reads the finished deck and worksheet. Part 2 is skipped if they are not built yet.
"""
import json, pathlib, re, subprocess, zipfile, difflib
from sympy import symbols, Eq, solve, expand, factor, Rational as R
from sympy.parsing.sympy_parser import parse_expr, standard_transformations, implicit_multiplication_application, convert_xor

ROOT = pathlib.Path(__file__).parent.parent
LESSON = 'Area With A Bracket'
OUT = ROOT / 'out' / LESSON
x, y, m, c, d, s = symbols('x y m c d s')
TR = standard_transformations + (implicit_multiplication_application, convert_xor)
checks = 0


def ok(cond, msg):
    global checks
    assert cond, f'FAIL: {msg}'
    checks += 1
    print('ok:', msg)


def P(text):
    """Parse the deck's maths text (a real minus, ×, superscript 2) into sympy."""
    t = text.replace('−', '-').replace('×', '*').replace('÷', '/').replace('²', '**2')
    return parse_expr(t, transformations=TR, local_dict={'x': x, 'd': d, 's': s, 'm': m})


def terms(text):
    return len(re.split(r'\s[+−]\s', text))


def table_rule(xs, ys):
    sol = solve([Eq(m * xs[0] + c, ys[0]), Eq(m * xs[1] + c, ys[1])], (m, c))
    mm, cc = sol[m], sol[c]
    ok(all(mm * a + cc == b for a, b in zip(xs, ys)), f'table x = {xs}, y = {ys} is linear: y = {mm}x {"+" if cc >= 0 else "-"} {abs(cc)}')
    return mm, cc


def show(mm, cc):
    return f'y = {mm}x {"+" if cc >= 0 else "−"} {abs(cc)}'


# ------------------------------------------------------------------ the worksheet data ----
dump = subprocess.check_output(['node', '-e', "const a=require('./build/area-with-a-bracket-answers.js');console.log(JSON.stringify({a:a.A,AR:a.AREA,B:a.BOTH,E:a.EXPAND,D:a.BEDS,V:a.REVERSE,S:a.S13,T:a.T,R:a.RULE,K:a.BRACKET}))"], cwd=ROOT).decode()
D = json.loads(dump)
ANS, AREA, BOTH, EXPAND, BEDS, REVERSE, S13, TB, RULE, BRACKET = D['a'], D['AR'], D['B'], D['E'], D['D'], D['V'], D['S'], D['T'], D['R'], D['K']

for k, a in AREA.items():
    w, ln = P(a['w']), P(a['len'])
    ok(expand(w * ln) == P(a['ans']), f'area {k}: {a["w"]} × ({a["len"]}) = {expand(w * ln)}, the answer says {a["ans"]}')
    ok(terms(a['ans']) == 2, f'area {k}: the answer {a["ans"]} is collected (two terms)')
    v = a['chk']
    ok(ln.subs(x, v) > 0 and w.subs(x, v) > 0, f'area {k}: at the check value x = {v} both sides are positive ({w.subs(x, v)} and {ln.subs(x, v)})')
    ok(w.subs(x, v) * ln.subs(x, v) == P(a['ans']).subs(x, v), f'area {k}: the check x = {v} agrees: {w.subs(x, v) * ln.subs(x, v)} = {P(a["ans"]).subs(x, v)}')

for k, b in BOTH.items():
    a_, b_ = P(b['a']), P(b['b'])
    per, area = expand(2 * a_ + 2 * b_), expand(a_ * b_)
    ok(per == P(b['per']) and area == P(b['area']), f'both {k}: perimeter {per}, area {area}; the module says {b["per"]} and {b["area"]}')
    v = b['chk']
    pv, av = per.subs(x, v), area.subs(x, v)
    ok(a_.subs(x, v) > 0 and b_.subs(x, v) > 0, f'both {k}: at x = {v} the sides are {a_.subs(x, v)} and {b_.subs(x, v)}')
    ok(pv != av, f'both {k}: at the check value x = {v} the perimeter ({pv}) and the area ({av}) DIFFER, so the check can tell them apart')

for k, e in EXPAND.items():
    ok(expand(P(e['expr'])) == P(e['ans']), f'expand {k}: {e["expr"]} = {expand(P(e["expr"]))}, the module says {e["ans"]}')
ok(expand(P('5(x + 2)')) != P(EXPAND['b6']['wrong']) and expand(P('5(x + 2)') - P(EXPAND['b6']['wrong'])) == 8, 'Bronze Q6: the student\'s 5x + 2 is 8 short of 5x + 10 (the 5 never reached the 2)')
e15 = EXPAND['g15']
ok(P('2x')*P('3x - 1') == P('2*x*(3*x - 1)') and expand(P('2*x*(3*x - 1)')) == 6 * x**2 - 2 * x and (2 * 2 * (3 * 2 - 1), 6 * 4 - 2 * 2) == (20, 20), 'Gold Q15: 2x(3x − 1) = 6x² − 2x (x = 2: 4 × 5 = 20 and 24 − 4 = 20)')

ok(expand(P(BEDS['a']) + P(BEDS['b'])) == P(BEDS['ans']) and expand(P('3(x + 2) + 3(x + 5)')) == 6 * x + 21, 'Silver Q10: 3(x + 2) + 3(x + 5) = 6x + 21')
ok(3 * (BEDS['chk'] + 2) + 3 * (BEDS['chk'] + 5) == 6 * BEDS['chk'] + 21 == 33, 'Silver Q10: x = 2 gives 12 + 21 = 33')
ok(expand(P(REVERSE['w']) * P(REVERSE['len'])) == P(REVERSE['area']), 'Gold Q19: 3 × (x + 4) = 3x + 12, so the length is x + 4')
per13 = expand(2 * 3 + 2 * (x + 4)); area13 = expand(3 * (x + 4))
ok(per13 == P(S13['student']) and area13 == P(S13['real']), 'Silver Q13: the student wrote the PERIMETER (2x + 14); the area is 3x + 12')

# tables of areas: rule from the table = the expanded bracket
for k, tb in TB.items():
    mm, cc = table_rule(tb['x'], tb['y'])
    ok(show(mm, cc) == RULE[k], f'table {k}: sympy finds "{show(mm, cc)}", the module says "{RULE[k]}"')
    areas = [tb['w'] * (a_ + tb['c']) for a_ in tb['x']]
    ok(areas == tb['y'], f'table {k}: the areas {tb["w"]} × (x + {tb["c"]}) for x = {tb["x"]} are {areas}')
    ok(expand(P(BRACKET[k])) == mm * x + cc, f'table {k}: the rule {show(mm, cc)} is {BRACKET[k]} expanded')
    ok(cc != tb['y'][0], f'table {k}: the number added ({cc}) is not the first y ({tb["y"][0]})')
    ok(tb['y'][0] - mm * tb['x'][0] == cc, f'table {k}: going back to x = 0 gives {cc}, the number added')
mm, cc = table_rule([1, 2, 3], [8, 10, 12])
ok((mm, cc) == (2, 6) and TB['b5']['y'] == [8, 10, 12], 'Bronze Q5 is the table from the last lesson (8, 10, 12), now an area: y = 2x + 6 = 2(x + 3)')
ok(solve(Eq(6 * x + 12, 6 * (x + 2)), x) == True or expand(6 * (x + 2)) == 6 * x + 12, 'Gold Q16: 6x + 12 = 6(x + 2)')

QUOTE = {'1': '2x + 14', '2': '4x + 36', '3': '5x + 5', '4': '2x + 14', '6': '5x + 10', '7': '4x − 8', '8': '12x + 6', '9': '4x + 6', '10': '6x + 21',
         '12': '4x + 20', '13': '3x + 12', '14': 'x² + 7x', '15': '6x² − 2x', '16': '6(x + 2)', '18': '4x + 10', '19': 'x + 4'}
for q_, e_ in QUOTE.items():
    ok(e_ in ANS[q_], f'answer {q_} says "{e_}"')
ok('3x + 12' in ANS['4'] and '2x + 14' in ANS['4'], 'answer 4 gives both the perimeter and the area')
ok('8x − 4' in ANS['9'] and '12x − 15' in ANS['8'] and 'x² + 5x' in ANS['18'], 'answers 8, 9 and 18 give the area expansions')
ok('y = 2x + 6' in ANS['5'] and 'y = 4x + 4' in ANS['11'] and 'y = 6x + 12' in ANS['16'], 'answers 5, 11 and 16 say the rules from the tables')
ok(len(ANS) == 19 and all(ANS[str(i)] for i in range(1, 20)), 'nineteen worksheet answers, one for every question')

# the lesson's own examples
ok(expand(4 * (x + 5)) == 4 * x + 20 and 4 * (3 + 5) == 32 == 4 * 3 + 20, 'I Do 2: 4(x + 5) = 4x + 20 (x = 3: 4 × 8 = 32 and 12 + 20 = 32)')
ok(expand(2 * 4 + 2 * (x + 5)) == 2 * x + 18 and 4 + 8 + 4 + 8 == 24 == 2 * 3 + 18, 'I Do 1 perimeter: 4 + (x + 5) + 4 + (x + 5) = 2x + 18 (x = 3: 24)')
ok(32 != 24, 'I Do 1: at x = 3 the area (32) and the perimeter (24) of the garden differ')
ok(expand(5 * (x - 3)) == 5 * x - 15 and 5 * (6 - 3) == 15 == 5 * 6 - 15 and 6 - 3 > 0, 'I Do 2 minus: 5(x − 3) = 5x − 15 (x = 6: 5 × 3 = 15, 30 − 15 = 15)')
hook = [P('2x + 18'), P('4x + 5'), P('4x + 20')]
ok(expand(2 * 4 + 2 * (x + 5)) == hook[0] and expand(4 * (x + 5)) == hook[2] and hook[1] != hook[2] and expand(4 * x + 5 - 4 * (x + 5)) == -15, 'Hook: A = 2x + 18 is the PERIMETER, B = 4x + 5 forgets the 5, C = 4x + 20 is the area')
# the RAC poster: perimeter against area, so the notes can say where a number check hides a mix-up
ok(2 * 6 + 2 * (5 - 2) == 18 == 6 * (5 - 2), 'RAC notes: at x = 5 the poster\'s perimeter and area are BOTH 18 (a coincidence the notes warn about)')
ok(2 * 6 + 2 * (4 - 2) == 16 and 6 * (4 - 2) == 12, 'RAC notes: at x = 4 they differ (perimeter 16, area 12)')
ok(6 * (5 - 2) == 18 == 6 * 5 - 12 and 6 * 5 - 2 == 28, 'RAC Conquer check: x = 5 gives 18 for the area and for 6x − 12; B\'s 6x − 2 gives 28')

# ---- Do Now ----
ok(expand(2 * (x + 6) + 2 * (3 * x)) == 8 * x + 12 and 7 + 3 + 7 + 3 == 20 == 8 + 12, 'Do Now Q1: x + 6 and 3x give 8x + 12 (x = 1: sides 7 and 3, 20)')
ok(expand(d + (d + 5) + 4 * d) == 6 * d + 5, 'Do Now Q2: d + (d + 5) + 4d = 6d + 5')
mm_, cc_ = table_rule([1, 2, 3], [14, 18, 22])
ok((mm_, cc_) == (4, 10) and cc_ != 14, 'Do Now Q3: x = 1, 2, 3 and y = 14, 18, 22 gives y = 4x + 10')
ok(expand(3 * (x + 4) - (x - 2)) == 2 * x + 14, 'Do Now Q4: 3(x + 4) − (x − 2) = 2x + 14')
ok(8 * 5 == 40, 'Do Now Q5: 8 × 5 = 40 cm²')
ok(5 * x == P('5x'), 'Do Now Q6: 5 cm wide and x cm long has area 5x cm²')
# ---- Cold Call ----
ok(7 * (x + 2) == P('7(x + 2)') and expand(7 * (x + 2)) == 7 * x + 14, 'Cold Call Q1 and Q2: 7(x + 2) = 7x + 14')
ok(expand(3 * (2 * x - 1)) == 6 * x - 3 and 3 * (2 * 2 - 1) == 9 == 6 * 2 - 3, 'Cold Call Q3: 3(2x − 1) = 6x − 3 (x = 2: 9)')
ok(expand(2 * 5 + 2 * (x + 3)) == 2 * x + 16 and expand(5 * (x + 3)) == 5 * x + 15 and (2 * 3 + 16, 5 * 3 + 15) == (22, 30), 'Cold Call Q4: sides 5 and x + 3 give perimeter 2x + 16 and area 5x + 15 (x = 3: 22 and 30)')
mm_, cc_ = table_rule([1, 2, 3], [9, 13, 17])
ok((mm_, cc_) == (4, 5) and 9 - 4 == 5, 'Cold Call Q5: x = 1, 2, 3 and y = 9, 13, 17 gives y = 4x + 5, and y = 5 when x = 0')
ok(expand(-7 * (x - 4)) == -7 * x + 28, 'Cold Call Q6: −7(x − 4) = −7x + 28')
# ---- Plenary ----
ok(expand(2 * 4 + 2 * (x + 5)) != expand(4 * (x + 5)), 'Plenary Q1 is FALSE: 2x + 18 is the perimeter, not the area')
ok(expand(4 * (x + 5)) == 4 * x + 20, 'Plenary Q2 is TRUE')
ok(expand(6 * (x - 2)) != 6 * x - 2 and expand(6 * (x - 2)) == 6 * x - 12, 'Plenary Q3 is FALSE: 6(x − 2) = 6x − 12')
ok(table_rule([1, 2, 3], [9, 13, 17]) == (4, 5) and (4, 9) != (4, 5), 'Plenary Q4 is FALSE: the rule is 4x + 5, not 4x + 9')
ok([3 * (k + 2) for k in (1, 2, 3)] == [9, 12, 15] and table_rule([1, 2, 3], [9, 12, 15]) == (3, 6), 'Plenary Q5 is TRUE: a 3 by (x + 2) rectangle has areas 9, 12, 15 and the rule y = 3x + 6')

# ---------------------------------------------------------------- part 2: the finished files ----
DECK = OUT / f'{LESSON}.pptx'
SHEET = OUT / f'{LESSON} worksheet.docx'
if DECK.exists():
    from pptx import Presentation
    prs = Presentation(str(DECK)); slides = list(prs.slides)

    def named(i):
        out = {}
        def go(shapes):
            for sh in shapes:
                if sh.shape_type == 6: go(sh.shapes)
                elif sh.has_text_frame and sh.text_frame.text.strip(): out[sh.name] = sh.text_frame.text
        go(slides[i - 1].shapes); return out
    def text(i): return ' | '.join(v.replace('\n', ' ') for v in named(i).values())
    def notes(i): return slides[i - 1].notes_slide.notes_text_frame.text

    pills = []
    for i in range(1, len(slides) + 1):
        mm = re.search(r'([A-Z][A-Z ]+) · (\d+) MIN', text(i)); pills.append((mm.group(1), int(mm.group(2))) if mm else None)
    ok(len(slides) == 10 and all(pills), 'ten slides, each with a phase pill')
    ok([p_[0] for p_ in pills] == ['DO NOW', 'TODAY', 'HOOK', 'I DO', 'I DO', 'WE DO', 'COLD CALL', 'YOU DO', 'MARK', 'PLENARY'], 'phases in the TEMPLATE.md order')
    ok([p_[1] for p_ in pills] == [10, 1, 2, 3, 3, 5, 6, 14, 3, 3] and sum(p_[1] for p_ in pills) == 50, 'minutes 10, 1, 2, 3, 3, 5, 6, 14, 3, 3 add to 50')
    ok(all(notes(i).strip() for i in range(1, 11)), 'speaker notes on every slide')
    ok(prs.core_properties.title == LESSON and prs.core_properties.subject == 'Y8 Maths · Algebra · Lesson 9 · 8CN', f'dc:title and dc:subject are set, with the class: {prs.core_properties.subject}')
    ok('Date: ____' in text(1), 'slide 1 leaves the date for the teacher to type')
    ok(prs.slide_width / 914400 == 10 and abs(prs.slide_height / 914400 - 5.625) < 1e-6, 'maths canvas: 10 x 5.625')
    ok('Objectives' in named(2)['slide_title'], 'slide 2 is titled Objectives')

    n1 = named(1)
    ok(n1['d0_a'] == '2(x + 6) + 2(3x) = 8x + 12', f'Do Now Q1 on the slide: "{n1["d0_a"]}"')
    ok(n1['d1_a'] == 'd + (d + 5) + 4d = 6d + 5', f'Do Now Q2 on the slide: "{n1["d1_a"]}"')
    ok('y = 4x + 10' in n1['d2_a'] and 'y = 14, 18, 22' in n1['d2_q'], f'Do Now Q3 on the slide: "{n1["d2_a"]}"')
    ok(n1['d3_a'] == '3x + 12 − x + 2 = 2x + 14', f'Do Now Q4 on the slide: "{n1["d3_a"]}"')
    ok(n1['d4_a'] == '8 × 5 = 40 cm²', f'Do Now Q5 on the slide: "{n1["d4_a"]}"')
    ok(n1['d5_a'].startswith('5x cm²') and 'Suggest' in n1['d5_q'], f'Do Now Q6 (the preview) on the slide: "{n1["d5_a"]}"')

    prev = ['Expressions From Shapes And Prices', 'Function Machines', 'Putting Numbers In', 'Expand and Simplify', 'Brackets and Beyond']
    old = []
    for name in prev:
        f_ = ROOT / 'reference' / f'{name}.pptx'
        if not f_.exists(): f_ = ROOT / 'out' / name / f'{name}.pptx'
        pr = Presentation(str(f_))
        for sl in ([pr.slides[0]] + ([pr.slides[6]] if len(pr.slides) > 6 else [])):
            for sh in sl.shapes:
                if sh.has_text_frame and len(sh.text_frame.text.strip()) > 12: old.append(sh.text_frame.text.replace('\n', ' '))
    mine = [n1[f'd{i}_q'] for i in range(6)] + [named(7)[f'c{i}_q'] for i in range(6)]
    digits = lambda s_: re.findall(r'\d+', s_)
    repeats = [(a_, b_) for a_ in mine for b_ in old if digits(a_) and digits(a_) == digits(b_) and difflib.SequenceMatcher(None, a_.lower(), b_.lower()).ratio() > 0.5]
    ok(not repeats, f'no Do Now or Cold Call question repeats one from the last lessons ({", ".join(prev)}): same skills, new numbers; repeats: {repeats}')

    n3 = named(3)
    ok([n3['h0_t'], n3['h1_t'], n3['h2_t']] == ['2x + 18', '4x + 5', '4x + 20'], 'Hook options on the slide: 2x + 18, 4x + 5, 4x + 20')
    n4 = named(4)
    ok(n4['ar_l1'].endswith('4(x + 5)') and n4['pe_l1'] == '= 2x + 18' and 'm²' in n4['ar_l3'], 'I Do 1 on the slide: the area 4(x + 5), the perimeter 2x + 18, the unit m²')
    n5 = named(5)
    ok(n5['ex_l2'].endswith('4x + 20 m²') and n5['ex_l6'].endswith('5x − 15 m²'), f'I Do 2 on the slide: "{n5["ex_l2"]}" and "{n5["ex_l6"]}"')
    ok('4 × 8 = 32, and 12 + 20 = 32' in n5['ex_l3'] and '5 × 3 = 15, and 30 − 15 = 15' in n5['ex_l7'], 'I Do 2 checks on the slide agree with the numbers')

    # the Rank And Conquer: marks counted from the text, ranking from the marks, lengths
    n6 = named(6)
    texts = [n6[f'rc{i}_t'] for i in range(4)]
    def marks(txt):
        m1 = '6(x − 2)' in txt
        result = txt.split('=')[-1].split('.')[0].strip().split(' cm')[0]
        m2 = '6x' in result
        m3 = P(result) == 6 * x - 12
        m4 = 'cm²' in txt
        return int(m1) + int(m2) + int(m3) + int(m4)
    got = [marks(t_) for t_ in texts]
    stated = [int(re.match(r'(\d) marks?', n6[f'rc{i}_why']).group(1)) for i in range(4)]
    chips = [n6[f'rc{i}_rank'] for i in range(4)]
    ok(got == stated, f'RAC: marks counted from the answers {got} agree with the marks on the slide {stated}')
    order = sorted(range(4), key=lambda i: -got[i])
    ok([chips[i] for i in order] == ['1st', '2nd', '3rd', '4th'] and len(set(got)) == 4, f'RAC: ranking by marks gives C, D, A, B ({chips})')
    lens = [len(t_) for t_ in texts]
    ok(lens[order[0]] < max(lens) and lens[order[0]] > min(lens) and max(lens) / min(lens) <= 1.3, f'RAC: the best answer is neither the longest nor the shortest, and the lengths are within a quarter: {lens}')
    ok(P(n6['rc_conquer'].split('B. ')[1].split('=')[2].split(' cm')[0]) == 6 * x - 12 and 'cm²' in n6['rc_conquer'], 'RAC: the upgraded answer is 6x − 12 cm²')

    n7 = named(7)
    CC = {0: '7(x + 2) m²', 1: '7x + 14', 2: '6x − 3 cm²', 3: 'Perimeter 2x + 16. Area 5x + 15.', 4: 'y = 4x + 5', 5: '−7x + 28'}
    for i, e_ in CC.items(): ok(e_ in n7[f'c{i}_a'], f'Cold Call Q{i + 1} on the slide says "{e_}"')
    n10 = named(10)
    truth = [False, True, False, False, True]
    ok([n10[f'p{i}_v'] for i in range(5)] == ['TRUE' if t_ else 'FALSE' for t_ in truth], f'Plenary labels agree with the maths: {[n10[f"p{i}_v"] for i in range(5)]}')

if SHEET.exists():
    z = zipfile.ZipFile(SHEET)
    body = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', z.read('word/document.xml').decode('utf-8')))
    for k in ('bw', 'b1', 'b3', 'sw', 's7', 'gw', 'g14'):
        a = AREA[k]
        ok(a['len'] in body and a['w'] in body, f'the worksheet prints the rectangle {k}: {a["w"]} by ({a["len"]})')
    for k, b in BOTH.items(): ok(b['b'] in body, f'the worksheet prints the sides of {k}: {b["a"]} and {b["b"]}')
    BLANK = {'b5'}
    for k, tb in TB.items():
        vals = tb['x'] if k in BLANK else tb['x'] + tb['y']
        ok(all(re.search(rf'\b{v}\b', body) for v in vals), f'the worksheet prints table {k}: x = {tb["x"]}' + ('' if k in BLANK else f', y = {tb["y"]}'))
    src = (ROOT / 'build' / 'area-with-a-bracket-worksheet.js').read_text(encoding='utf-8')
    for i in range(1, 20): ok(re.search(rf"q\('{i}',", src), f'worksheet has question {i}')
    ok("q('12'" in src and 'Why does that step work?' in src, 'the "why does that step work?" prompt is Q12, on the 4 multiplying the 5')
    ok("q('17'" in src and 'Where would you meet this' in src, 'the "where would you meet this outside the lesson?" question is Q17')
    ok('FINISHER' in src and 'swap with a partner' in src.lower() or 'Swap with a partner' in src, 'the Period 2 finisher (draw, swap, simplify the other\'s perimeter) is on the last page')

print(f'\n{checks} checks passed')
