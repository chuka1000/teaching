#!/usr/bin/env python3
"""
From A Table To A Rule (8CN). Every number in the deck, the worksheet and the notes is checked here with sympy,
and the values are read BACK OUT of the finished deck and worksheet (not typed in again), so the files and the
check cannot drift apart. It also enforces the brief: the phrase the brief banned appears nowhere, and the
letters are x and y only (a stray n as a variable fails).

    python3 build/from-a-table-to-a-rule-check.py
"""
import datetime, difflib, json, pathlib, re, subprocess, zipfile
from sympy import symbols, Eq, solve, expand, Rational as R, simplify
from pptx import Presentation

ROOT = pathlib.Path(__file__).parent.parent
LESSON = 'From A Table To A Rule'
OUT = ROOT / 'out' / LESSON
DECK = OUT / f'{LESSON}.pptx'
x, y, m, c = symbols('x y m c')
checks = 0
def ok(cond, msg):
    global checks
    assert cond, f'FAIL: {msg}'
    checks += 1
    print('ok:', msg)

def rule_from(xs, ys):
    """Fit y = m x + c to the FIRST TWO pairs with sympy, then require every pair to fit. Returns (m, c)."""
    sol = solve([Eq(m * xs[0] + c, ys[0]), Eq(m * xs[1] + c, ys[1])], (m, c))
    mm, cc = sol[m], sol[c]
    ok(all(mm * a + cc == b for a, b in zip(xs, ys)), f'table x = {xs}, y = {ys}: linear, y = {mm}x {"+" if cc >= 0 else "-"} {abs(cc)} fits every pair')
    return mm, cc
def show(mm, cc): return f'y = {mm}x {"+" if cc >= 0 else "−"} {abs(cc)}'

# ------------------------------------------------------------------ the deck, read back ----
prs = Presentation(str(DECK))
slides = list(prs.slides)
def named(i):
    out = {}
    def go(shapes):
        for sh in shapes:
            if sh.shape_type == 6: go(sh.shapes)
            elif sh.has_text_frame and sh.text_frame.text.strip(): out[sh.name] = sh.text_frame.text
    go(slides[i - 1].shapes); return out
def text(i): return ' | '.join(v.replace('\n', ' ') for v in named(i).values())
def notes(i): return slides[i - 1].notes_slide.notes_text_frame.text

# ---- the shape: TEMPLATE.md ----
pills = []
for i in range(1, len(slides) + 1):
    mm_ = re.search(r'([A-Z][A-Z ]+) · (\d+) MIN', text(i)); pills.append((mm_.group(1), int(mm_.group(2))) if mm_ else None)
ok(len(slides) == 10 and all(pills), 'ten slides, each with a phase pill')
ok([p[0] for p in pills] == ['DO NOW', 'TODAY', 'HOOK', 'I DO', 'I DO', 'WE DO', 'COLD CALL', 'YOU DO', 'MARK', 'PLENARY'], 'phases in the TEMPLATE.md order')
ok([p[1] for p in pills] == [10, 1, 2, 3, 3, 5, 6, 14, 3, 3] and sum(p[1] for p in pills) == 50, 'minutes 10, 1, 2, 3, 3, 5, 6, 14, 3, 3 add to 50')
ok(all(notes(i).strip() for i in range(1, 11)), 'speaker notes on every slide')
ok(prs.core_properties.title == LESSON and prs.core_properties.subject == 'Y8 Maths · Algebra · Lesson 6 · 8CN', f'dc:title and dc:subject are set, with the class: {prs.core_properties.subject}')
d = re.search(r'(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday) (\d+) (\w+) (\d{4})', text(1))
dt = datetime.datetime.strptime(f'{d.group(2)} {d.group(3)} {d.group(4)}', '%d %B %Y')
ok(dt.strftime('%A') == d.group(1), f'the date on slide 1 is a real {d.group(1)}: {d.group(0)}')
ok(prs.slide_width / 914400 == 10 and abs(prs.slide_height / 914400 - 5.625) < 1e-6, 'maths canvas: 10 x 5.625')
ok('Objectives' in named(2)['slide_title'] and text(2).startswith('TODAY · 1 MIN'), 'slide 2 is titled Objectives, with the TODAY pill')
OBJ = ['Find the rule for a linear function from a table of values.', 'Write the rule as a formula.', 'Check a rule against a second pair of values.']
ok(all(named(2)[f'o{i}_t'] == OBJ[i] for i in range(3)), 'the three objectives are exactly the brief\'s wording')

# ---- Do Now (slide 1) ----
n1 = named(1)
ok(solve(Eq(6 * (x - 2), y), y) == [6 * x - 12] and n1['d0_a'] == 'y = 6(x − 2)' and expand(6 * (x - 2)) == 6 * x - 12, 'Do Now Q1: subtract 2 then multiply by 6 is y = 6(x − 2), which expands to 6x − 12 (not 6x − 2)')
ok(solve(Eq(3 * x - 4, 20), x) == [8] and n1['d1_a'].startswith('8.') and (20 + 4) / 3 == 8, 'Do Now Q2: 3x − 4 = 20 gives x = 8 (20 + 4 = 24, 24 ÷ 3)')
ok(expand(5 * (x + 3)) == 5 * x + 15 and expand(5 * (x + 3)) != 5 * x + 3 and '5x + 15' in n1['d2_a'], 'Do Now Q3: 5(x + 3) = 5x + 15, not 5x + 3')
ok(4 * x + 30 == 4 * x + 30 and 4 * 10 + 30 == 70 and n1['d3_a'] == '4x + 30', 'Do Now Q4: 4 pens at x pence and a 30p ruler cost 4x + 30 (check x = 10: 4 pens 40p + 30p = 70p)')
ok(R(15, 100) * 80 == 12 and R(10, 100) * 80 == 8 and R(5, 100) * 80 == 4 and n1['d4_a'].startswith('12.'), 'Do Now Q5: 15% of 80 = 8 + 4 = 12')
ys6 = [3, 5, 7, 9]
ok([b - a for a, b in zip(ys6, ys6[1:])] == [2, 2, 2] and 'go up by 2' in n1['d5_a'] and 'y = 3, 5, 7, 9' in n1['d5_q'], 'Do Now Q6: the y values 3, 5, 7, 9 go up by 2 each time')

# the Do Now must not repeat a question from the last three lessons in the class
prev = ['Function Machines', 'Putting Numbers In', 'Expand and Simplify']
old = []
for name in prev:
    pr = Presentation(str(ROOT / 'reference' / f'{name}.pptx'))
    def walk(shapes):
        for sh in shapes:
            if sh.shape_type == 6: yield from walk(sh.shapes)
            elif sh.has_text_frame and sh.text_frame.text.strip(): yield sh.text_frame.text.replace('\n', ' ')
    old += [t_ for t_ in walk(pr.slides[0].shapes) if len(t_) > 12]
mine = [n1[f'd{i}_q'] for i in range(6)]
worst = max((difflib.SequenceMatcher(None, a.lower(), b.lower()).ratio(), a, b) for a in mine for b in old)
print('closest pair:', worst[1][:80], '<>', worst[2][:80])
ok(worst[0] < 0.7, f'no Do Now question repeats one from {", ".join(prev)}: closest match {worst[0]:.2f}')

# ---- Hook (slide 3) and I Do 1 (slide 4) ----
n3, n4 = named(3), named(4)
HK = {1: 5, 2: 8, 3: 11}
mh, ch = rule_from(list(HK), list(HK.values()))
ok((mh, ch) == (3, 2) and mh * 10 + ch == 32 and n3['h2_t'] == '32', 'Hook: the secret rule is y = 3x + 2, so x = 10 gives 32, the third card (C)')
ok(1 + 4 == 5 and 10 + 4 == 14 and n3['h0_t'] == '14', 'Hook A: 14 is "add 4" at x = 10, a rule that fits only the first pair (1 + 4 = 5)')
ok(5 * 1 == 5 and 5 * 10 == 50 and n3['h1_t'] == '50', 'Hook B: 50 is "multiply by 5" at x = 10, a rule that fits only the first pair (5 × 1 = 5)')
ok(2 + 4 != 8 and 5 * 2 != 8, 'both wrong hook rules FAIL the second pair (2, 8): 2 + 4 = 6 and 5 × 2 = 10')
tx = [int(n4[f'tb_x{i}']) for i in range(4)]; ty = [int(n4[f'tb_y{i}']) for i in range(4)]
m4, c4 = rule_from(tx, ty)
ok((tx, ty) == ([1, 2, 3, 4], [5, 8, 11, 14]) and (m4, c4) == (3, 2), 'I Do 1 table (read from the slide) is the Hook\'s table, and its rule is y = 3x + 2')
ok([b - a for a, b in zip(tx, tx[1:])] == [1, 1, 1] and [b - a for a, b in zip(ty, ty[1:])] == [3, 3, 3], 'I Do 1: x goes up by 1 and y goes up by 3, each time')
ok(3 * 1 == 3 and 5 - 3 == 2 and 'Add 2.' in n4['ea_l2'] and '3 × 1 = 3' in n4['ea_l2'], 'I Do 1: 3 × 1 = 3 but y is 5, so add 2')
ok(n4['ea_l3'] == 'y = 3x + 2' and 'x = 10 gives 3 × 10 + 2 = 32' in n4['ea_l4'] and 3 * 10 + 2 == 32, 'I Do 1: the formula y = 3x + 2, and the Hook answer 3 × 10 + 2 = 32')
ok(all(3 * a + 2 == b for a, b in zip([1, 2, 3, 4], [5, 8, 11, 14])) and [3 * a for a in tx] == [3, 6, 9, 12] and [b - 3 * a for a, b in zip(tx, ty)] == [2, 2, 2, 2], 'the animation: the 3x row is 3, 6, 9, 12 and the gaps to y are 2, 2, 2, 2; the last pair checks (3 × 4 + 2 = 14)')

# ---- I Do 2 (slide 5): each line of each card is evaluated ----
n5 = named(5)
RULES = {'ck0': lambda v: v + 4, 'ck1': lambda v: 5 * v, 'ck2': lambda v: 3 * v + 2}
EXPECT_VERDICT = {'ck0': 'Fails', 'ck1': 'Fails', 'ck2': 'Fits every pair'}
for k, fn in RULES.items():
    lines = [n5[f'{k}_l{j}'] for j in range(3) if f'{k}_l{j}' in n5]
    verdicts = []
    for ln in lines:
        mm_ = re.match(r'Pair \((\d+), (\d+)\): (.+?) = (\d+)\s+(fits|fails)', ln)
        a, b, working, res, word = int(mm_.group(1)), int(mm_.group(2)), mm_.group(3), int(mm_.group(4)), mm_.group(5)
        ok(fn(a) == res, f'I Do 2 {k}: "{working} = {res}" is arithmetically right for x = {a}')
        ok((res == b) == (word == 'fits'), f'I Do 2 {k}: the pair ({a}, {b}) {word}, and that is true ({res} against {b})')
        verdicts.append(word)
    ok(n5[f'{k}_v'] == EXPECT_VERDICT[k] and (all(v == 'fits' for v in verdicts) == (k == 'ck2')), f'I Do 2 {k}: the card says "{n5[f"{k}_v"]}", which agrees with its lines')
ok(all(RULES['ck0'](a) == 5 if a == 1 else True for a in [1]) and RULES['ck1'](1) == 5, 'both wrong rules fit the first pair, which is the point')

# ---- We Do (slide 6): tables read from the slide; the rule is re-derived and compared with the text ----
n6 = named(6)
def table_of(cell_text):
    rows = cell_text.split('\n'); return [int(v) for v in rows[0].split()[1:]], [int(v) for v in rows[1].split()[1:]]
WE = []
for i in range(3):
    xs, ys = table_of(n6[f'wf{i}_0_q']); mm_, cc_ = rule_from(xs, ys); WE.append((xs, ys, mm_, cc_))
    formula = n6.get(f'wf{i}_2_q') if n6.get(f'wf{i}_2_q') != '?' else n6[f'wf{i}_2_a']
    ok(formula == show(mm_, cc_).replace('+ 2', '+ 2') or formula == f'y = {mm_}x {"+" if cc_ >= 0 else "−"} {abs(cc_)}', f'We Do row {i + 1}: the formula on the slide ("{formula}") is the rule from its table')
    words = n6.get(f'wf{i}_1_q') if n6.get(f'wf{i}_1_q') != '?' else n6[f'wf{i}_1_a']
    ok(words == f'× {mm_}, then {"+" if cc_ >= 0 else "−"} {abs(cc_)}', f'We Do row {i + 1}: the words on the slide ("{words}") say × {mm_}, then {"+" if cc_ >= 0 else "−"} {abs(cc_)}')
    chk = n6.get(f'wf{i}_3_q') if n6.get(f'wf{i}_3_q') != '?' else n6[f'wf{i}_3_a']
    mc = re.match(r'x = (\d+): (\d+) × (\d+) ([+−]) (\d+) = (\d+)\. It fits\.', chk)
    cx = int(mc.group(1)); res = int(mc.group(6))
    ok(int(mc.group(2)) == mm_ and int(mc.group(3)) == cx and int(mc.group(5)) == abs(cc_) and mm_ * cx + cc_ == res and cx in xs and ys[xs.index(cx)] == res, f'We Do row {i + 1}: the check "{chk}" is right and uses a pair that is in the table')
ok(WE[2][0][1] - WE[2][0][0] == 2 and (WE[2][1][1] - WE[2][1][0]) // 2 == WE[2][2], 'We Do row 3: x goes up by 2 and y by 4, so the multiplier is 4 ÷ 2 = 2 (not 4)')
ok(WE[1][0] == [1, 2, 3, 4] and WE[1][1] == [2, 7, 12, 17], 'We Do row 2 is the table the I Do notes model on the board (2, 7, 12, 17)')

# ---- Cold Call (slide 7) ----
n7 = named(7)
ok(R(10, 2) == 5 and n7['c0_a'].startswith('5.'), 'Cold Call Q1: x up 2, y up 10: multiplier 10 ÷ 2 = 5')
ok(n7['c1_a'] == 'y = 6x − 2' and expand(6 * (x - 2)) != 6 * x - 2, 'Cold Call Q2: multiply by 6 then subtract 2 is y = 6x − 2 (and 6(x − 2) is a different rule)')
ok(2 * 3 + 5 == 11 and 11 != 12 and n7['c2_a'].startswith('No. 2 × 3 + 5 = 11, not 12'), 'Cold Call Q3: y = 2x + 5 at x = 3 is 11, not 12, so it does not fit')
q4 = solve(Eq(4 * 1 + c, 7), c)[0]
ok(q4 == 3 and n7['c3_a'].startswith('y = 4x + 3') and 4 * 1 + 3 == 7, 'Cold Call Q4: multiplier 4, 4 × 1 = 4, and 7 − 4 = 3, so y = 4x + 3')
ok(solve(Eq(4 * x + 6, 30), x) == [6] and (30 - 6) / 4 == 6 and n7['c4_a'].startswith('6.'), 'Cold Call Q5: × 4 then + 6 gives 30 from x = 6 (30 − 6 = 24, 24 ÷ 4)')
ok(expand(3 * (x - 4)) == 3 * x - 12 and n7['c5_a'].startswith('3x − 12'), 'Cold Call Q6: 3(x − 4) = 3x − 12')
ok(sum(1 for i in range(6) if f'c{i}_a' in n7) == 6, 'Cold Call has six questions with answers')

# ---- Plenary (slide 10): each statement is evaluated, and the deck's label must agree ----
n10 = named(10)
xs1, ys1 = [1, 2, 3], [4, 7, 10]
m1, c1 = rule_from(xs1, ys1)
truth = [
    (m1, c1) == (3, 1),                                                            # Q1 the table gives y = 3x + 1
    False,                                                                         # Q2 a rule that fits the first pair must be right: the Hook's y = x + 4 fits (1, 5) and is wrong
    R(6, 2) == 6,                                                                  # Q3 x up 2, y up 6: multiplier 6? (it is 3)
    True,                                                                          # Q4 x up 1, y up 5: rule starts y = 5x (the multiplier is the gap in y)
    expand(2 * (x + 3)) == 2 * x + 3,                                              # Q5 the same rule? (2x + 6)
]
ok(1 + 4 == 5 and 2 + 4 != 8, 'Plenary Q2 is FALSE: y = x + 4 fits the first pair (1, 5) of the Hook\'s table and is still wrong')
ok(R(6, 2) == 3, 'Plenary Q3: the multiplier is 6 ÷ 2 = 3, not 6')
ok(expand(2 * (x + 3)) == 2 * x + 6, 'Plenary Q5: 2(x + 3) = 2x + 6, so it is not 2x + 3')
ok(all(n10[f'p{i}_v'] == ('TRUE' if truth[i] else 'FALSE') for i in range(5)), f'Plenary: the five labels ({[n10[f"p{i}_v"] for i in range(5)]}) agree with the maths ({["TRUE" if v else "FALSE" for v in truth]})')
ok(m1 * xs1[-1] + c1 == ys1[-1] == 10, 'Plenary Q1 check: 3 × 3 + 1 = 10, the last pair')
ok(n10['p0_q'].endswith('gives the rule y = 3x + 1.') and 'y = 4, 7, 10' in n10['p0_q'], 'Plenary Q1 states the table (4, 7, 10) and the rule it asks about')

# ---- the worksheet and its answers ----
js = subprocess.check_output(['node', '-e', "const a=require('./build/from-a-table-to-a-rule-answers.js');console.log(JSON.stringify({a:a,T:a.T}))"], cwd=ROOT).decode()
data = json.loads(js); A = {k: v for k, v in data['a']}; TB = data['T']
ok(len(A) == 14 and all(A[str(i)] for i in range(1, 15)), 'fourteen worksheet answers, one for every question, in order')
EXPECT = {'bw': (4, 2), 'b1': (3, 1), 'b3': (5, -2), 'sw': (2, 1), 's6': (3, 2), 's7': (4, 3), 's9': (4, 5), 'gw': (3, 6), 'g10': (4, -4), 'g11': (3, -1)}
for k, tb in TB.items():
    mm_, cc_ = rule_from(tb['x'], tb['y'])
    ok((mm_, cc_) == EXPECT[k], f'worksheet table {k}: sympy finds y = {mm_}x {"+" if cc_ >= 0 else "−"} {abs(cc_)}')
# the answers quote those rules
for q_, k in (('1', 'b1'), ('3', 'b3'), ('6', 's6'), ('7', 's7'), ('9', 's9'), ('11', 'g11')):
    ok(show(*EXPECT[k]) in A[q_], f'answer {q_} says "{show(*EXPECT[k])}"')
ok(show(*EXPECT['g10']) in A['10'] and '4x − 4' in A['10'] and expand(4 * (x - 1)) == 4 * x - 4 and TB['g10']['y'] == [4 * a - 4 for a in TB['g10']['x']], 'answer 10: 4(x − 1) expands to 4x − 4, and the table is 0, 4, 8')
ok(expand(3 * (x + 2)) == 3 * x + 6 and TB['gw']['y'] == [3 * a + 6 for a in TB['gw']['x']], 'Gold worked example: 3(x + 2) = 3x + 6, and its table is 9, 12, 15')
ok(5 * 6 + 2 == 32, 'answer 4: 5 × 6 + 2 = 32'); ok('32' in A['4'], 'answer 4 says 32')
ok(3 * 5 + 2 == 17 and 'Yes' in A['5'], 'answer 5: y = 3x + 2 fits (5, 17)')
ok(5 * 1 - 4 == 1 and 'y = 5x − 4' in A['2'], 'answer 2: × 5 then − 4 is y = 5x − 4')
fail = 8 * 2 + 1
ok(fail == 17 and fail != 13 and 8 * 1 + 1 == 9 and f'8 × 2 + 1 = {fail}, not 13' in A['9'], 'answer 9: the student\'s y = 8x + 1 fits the first pair (9) and fails the second (17, not 13)')
ok(R(4, 2) == 2 and 'ONE step' in A['8'] and '4 ÷ 2 = 2' in A['8'], 'answer 8: 4 ÷ 2 = 2 is the change in y for ONE step of x')
sol14 = solve(Eq(6 * x - 5, 31), x)
ok(sol14 == [6] and 6 * 6 - 5 == 31 and 'x = 6' in A['14'] and '36 ÷ 6 = 6' in A['14'], 'answer 14: 6x − 5 = 31 gives x = 6 (31 + 5 = 36, 36 ÷ 6)')
ok(2 * (1 + 3) == 8 and 2 * 1 + 3 == 5 and 2 * (2 + 3) == 10 and 2 * 2 + 3 == 7 and expand(2 * (x + 3)) == 2 * x + 6, 'answer 12: x = 1 gives 8 and 5, x = 2 gives 10 and 7, and 2(x + 3) = 2x + 6')

z = zipfile.ZipFile(OUT / f'{LESSON} worksheet.docx')
body = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', z.read('word/document.xml').decode('utf-8')))
for k, tb in TB.items():
    if k in ('g10',): continue
    ok(all(re.search(rf'\b{v}\b', body) for v in tb['x'] + tb['y']), f'the worksheet prints table {k}: x = {tb["x"]}, y = {tb["y"]}')
ok('y = 4x + 2' in body and '4 × 4 + 2 = 18' in body, 'the Bronze worked example is printed: y = 4x + 2, checked with x = 4 (18)')
ok('y = 2x + 1' in body and '4 ÷ 2 = 2' in body, 'the Silver worked example is printed: y = 2x + 1, and 4 ÷ 2 = 2')
ok('3x + 6' in body and '3(x + 2)' in body, 'the Gold worked example is printed: 3(x + 2) = 3x + 6')
src = (ROOT / 'build' / 'from-a-table-to-a-rule-worksheet.js').read_text()
for i in range(1, 15): ok(re.search(rf"q\('{i}',", src), f'worksheet has question {i}')
ok("q('8'" in src and 'Why does that step work?' in src, 'the "why does that step work?" prompt is Q8, on the division by the gap in x')
ok("q('13'" in src and 'Where would you meet this idea outside the lesson' in src, 'the "where would you meet this outside the lesson?" question is Q13')
ok(f'{LESSON} worksheet' in text(8) and 'game' not in text(8).lower(), 'slide 8 is the worksheet, and there is no game')
ok((OUT / f'{LESSON} worksheet.docx').exists(), 'the worksheet exists')
ok((ROOT / 'assets' / 'media' / 'from-a-table-to-a-rule-table.mp4').exists(), 'the I Do 1 animation file exists')

# ---- the brief: the banned phrase and the letters ----
everything = {'deck text': ' '.join(text(i) for i in range(1, 11)), 'speaker notes': ' '.join(notes(i) for i in range(1, 11)), 'worksheet': body}
for f in ['build/from-a-table-to-a-rule.js', 'build/from-a-table-to-a-rule-answers.js', 'build/from-a-table-to-a-rule-worksheet.js', 'spec/from-a-table-to-a-rule-spec.js', 'build/media/from-a-table-to-a-rule-table.py']:
    everything[f] = (ROOT / f).read_text(encoding='utf-8')
ban = 'nth'
ok(all(ban not in v.lower() for v in everything.values()), f'the brief\'s banned phrase appears nowhere ({", ".join(everything)})')
stray = {}
for name in ('deck text', 'worksheet'):
    stray[name] = re.findall(r'(?<![A-Za-z0-9])\d*n(?![A-Za-z0-9])', everything[name])
ok(not any(stray.values()), f'no letter n is used as a variable on the slides or the worksheet (only x and y): {stray}')
print(f'\n{checks} checks passed')
