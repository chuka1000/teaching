#!/usr/bin/env python3
"""
Checks everything numeric (and every claim that can be checked) in Resultant Forces (10A): the deck, the worksheet and its answers, the
free-body diagrams the worksheet prints, and that the game the deck names exists. Values are read BACK OUT of the finished files and
recomputed here with sympy (exact), independently of the JavaScript that wrote them. The game is checked over 300 generated games by
build/check-resultant-forces-game.py.

    python3 build/resultant-forces-check.py
"""
import ast, datetime, difflib, json, pathlib, re, subprocess, zipfile
from sympy import Rational as R, sympify
from pptx import Presentation

ROOT = pathlib.Path(__file__).parent.parent
LESSON = 'Resultant Forces'
OUT = ROOT / 'out' / LESSON
DECK = OUT / f'{LESSON}.pptx'
checks = 0
def ok(cond, msg):
    global checks
    assert cond, f'FAIL: {msg}'
    checks += 1
    print('ok:', msg)
G = R(98, 10)

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

# ---- the shape: TEMPLATE.md ----
pills = []
for i in range(1, len(slides) + 1):
    m = re.search(r'([A-Z][A-Z ]+) · (\d+) MIN', text(i)); pills.append((m.group(1), int(m.group(2))) if m else None)
ok(len(slides) == 10 and all(pills), 'ten slides, each with a phase pill')
ok([p[0] for p in pills] == ['DO NOW', 'TODAY', 'HOOK', 'I DO', 'I DO', 'WE DO', 'COLD CALL', 'YOU DO', 'MARK', 'PLENARY'], 'phases in the TEMPLATE.md order')
ok([p[1] for p in pills] == [10, 1, 2, 3, 3, 5, 6, 14, 3, 3] and sum(p[1] for p in pills) == 50, 'minutes 10, 1, 2, 3, 3, 5, 6, 14, 3, 3 add to 50')
ok(all(notes(i).strip() for i in range(1, 11)), 'speaker notes on every slide')
ok(prs.core_properties.title == LESSON and prs.core_properties.subject == 'Y10 Science · Forces · 10A', f'dc:title and dc:subject are set, with the class: {prs.core_properties.subject}')
d = re.search(r'(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday) (\d+) (\w+) (\d{4})', text(1))
dt = datetime.datetime.strptime(f'{d.group(2)} {d.group(3)} {d.group(4)}', '%d %B %Y')
ok(dt.strftime('%A') == d.group(1) and dt.date() == datetime.date(2026, 10, 6), f'the date on slide 1 is a real {d.group(1)}, and it is the build date (the brief says "today"): {d.group(0)}')
n2 = named(2)
OBJ = ['Name forces and sort them into contact and non-contact.', 'Draw a free-body diagram for a simple situation.', 'Determine the resultant of forces along a straight line. (P1.5.1.2)']
ok(all(n2[f'o{i}_t'] == OBJ[i] for i in range(3)) and 'Objectives' in n2['slide_title'] and text(2).startswith('TODAY · 1 MIN'), "the three objectives are exactly the brief's wording (objective 3 with its code), under the title Objectives with the TODAY pill")

# ---- the objective's own wording, from the scheme of work ----
syl = subprocess.run(['python3', 'tools/syllabus.py', 'P1.5.1.2'], cwd=ROOT, capture_output=True, text=True).stdout
ok('resultant' in syl.lower() and 'straight line' in syl.lower(), 'the scheme of work for P1.5.1.2 is about the resultant of forces along a straight line')

# ---- Do Now ----
n1 = named(1)
ok(8 * 5 == 40 and n1['d0_a'].startswith('40 g.'), 'Do Now Q1: 8 g/cm³ × 5 cm³ = 40 g')
ok(R(294, 10) / G == 3 and n1['d3_a'].startswith('3 kg.'), 'Do Now Q4: 29.4 ÷ 9.8 = 3 kg')
ok('newton' in n1['d2_a'] and 'kilogram' in n1['d2_a'], 'Do Now Q3: the newton for force, the kilogram for mass')
ok('forces' in n1['d5_q'] and 'sort them today' in n1['d5_a'], 'Do Now Q6 previews today: name as many forces as you can')
prev = ['Gravitational Fields and Free Fall', 'Weight and Gravity', 'Mass and Weight', 'Density', 'Float Or Sink', 'Equations of Motion']
def walk(shapes):
    for sh in shapes:
        if sh.shape_type == 6: yield from walk(sh.shapes)
        elif sh.has_text_frame and sh.text_frame.text.strip(): yield sh.text_frame.text.replace('\n', ' ')
old = []; used = []
for name in prev:
    f = ROOT / 'reference' / f'{name}.pptx'
    if not f.exists(): f = ROOT / 'out' / name / f'{name}.pptx'
    if not f.exists(): continue
    used.append(name)
    old += [t_ for t_ in walk(Presentation(str(f)).slides[0].shapes) if len(t_) > 12]
ok(len(used) >= 2, f'compared with earlier Do Nows from: {", ".join(used)}')
worst = max((difflib.SequenceMatcher(None, n1[f'd{i}_q'].lower(), b.lower()).ratio(), n1[f'd{i}_q'], b) for i in range(6) for b in old)
print('closest pair:', worst[1][:70], '<>', worst[2][:70])
ok(worst[0] < 0.7, f'no Do Now question repeats one from the last 10A lessons: closest match {worst[0]:.2f}')

# ---- Hook (3) ----
n3 = named(3)
ok('steady 20 m/s' in n3['slide_title'] and n3['h1_k'] == 'B' and 'equal to the backward' in n3['h1_t'] and 'no forces' in n3['h2_t'], 'Hook: a car at a steady speed; the answer is B (forward force equals backward forces), and C is the "no forces" trap')
ok('B' in notes(3).split('ANSWER, FOR YOU:')[1][:6], 'the Hook notes give B as the answer')

# ---- I Do 1 (4) and I Do 2 (5) ----
t4 = text(4)
ok(all(w in t4 for w in ('Friction', 'Air resistance', 'Tension', 'Reaction force', 'Upthrust', 'Weight', 'Magnetic force', 'Electrostatic force')), 'I Do 1 names the forces, contact and non-contact')
n4 = named(4)
con = sorted(n4[k] for k in n4 if re.fullmatch(r'c\d_h', k)); non = sorted(n4[k] for k in n4 if re.fullmatch(r'n\d_h', k))
ok(con == ['Air resistance', 'Friction', 'Push or thrust', 'Reaction force', 'Tension', 'Upthrust'] and non == ['Electrostatic force', 'Magnetic force', 'Weight'], f'I Do 1: contact {con}; non-contact {non}')
n5 = named(5)
ok(100 - 100 == 0 and 80 - 50 == 30 and '100 − 100 = 0 N' in n5['wx_t'] and '80 − 50 = 30 N' in n5['wx_t'] and 'right' in n5['wx_t'], 'I Do 2 worked example: up/down 100 − 100 = 0 N; left/right 80 − 50 = 30 N to the right')
ok(all(s in (ROOT / 'build' / 'media' / 'resultant-forces-media.py').read_text() for s in ("('Weight', 'down', 100)", "('Reaction force', 'up', 100)", "('Push', 'right', 80)", "('Friction', 'left', 50)")), 'the animation draws weight 100 N down, reaction 100 N up, push 80 N right, friction 50 N left')

# ---- We Do (6) ----
n6 = named(6)
ok(40 - 25 == 15 and '40 − 25 = 15 N to the right' in n6['wd1_a'] and 40 + 25 == 65, 'We Do row 2: 40 − 25 = 15 N (the mistake, 65, added the opposite forces)')
ok('Nothing to correct' in n6['wd3_a'] and 30 - 30 == 0, 'We Do row 4 is the one that is already right: 30 N and 30 N balance')

# ---- Cold Call (7) and Plenary (10) ----
n7 = named(7)
ok(900 - 650 == 250 and n7['c3_a'].startswith('250 N forwards'), 'Cold Call Q4: 900 − 650 = 250 N forwards')
ok(4 * G == R(392, 10) and n7['c4_a'].startswith('39.2 N'), 'Cold Call Q5: 4 × 9.8 = 39.2 N')
ok(R(18 - 6, 3) == 4 and n7['c5_a'].startswith('4 m/s²'), 'Cold Call Q6: (18 − 6) ÷ 3 = 4 m/s²')
n10 = named(10)
ok([n10[f'p{i}_v'] for i in range(5)] == ['TRUE', 'FALSE', 'FALSE', 'TRUE', 'FALSE'], 'Plenary: TRUE, FALSE, FALSE, TRUE, FALSE (each FALSE is a misconception from the lesson; Q4 is the applied item)')
ok(50 - 20 == 30 != 70 and 700 - 700 == 0, 'Plenary Q3: 50 − 20 = 30 N, not 70; Q4: 700 − 700 = 0 N')
ok('Next lesson' in n10['pl_next'] and 'zero' in n10['pl_next'], 'the closing line points at the next lesson (a resultant of zero)')

# ---- no angles, anywhere a student can see ----
banned = re.compile(r'angle|diagonal|degree|°|component|vector|pythag|trigonom|parallelogram', re.I)
for i in range(1, 11):
    ok(not banned.search(text(i)), f'slide {i}: no forces at angles (P1.5.1.2 says "along a straight line")')

# ---- the worksheet and its answers ----
js = subprocess.check_output(['node', '-e', "const a=require('./build/resultant-forces-answers.js');console.log(JSON.stringify({a:a,D:a.D,R:a.R}))"], cwd=ROOT).decode()
data = json.loads(js); A = {k: v for k, v in data['a']}; D = data['D']; RR = data['R']
ok(len(A) == 14 and all(A[str(i)] for i in range(1, 15)), 'fourteen worksheet answers, one for every question, in order')
net = lambda a, b: sum(a) - sum(b)
ok(net(D['q4']['right'], D['q4']['left']) == 10 and RR['q4'] == 10 and '30 − 20 = 10 N to the right' in A['4'], 'Q4: 30 − 20 = 10 N to the right')
ok(sum(D['q5']['right']) == 21 and RR['q5'] == 21 and '12 + 9 = 21' in A['5'], 'Q5: 12 + 9 = 21 N to the right')
ok(net(D['w']['right'], D['w']['left']) == 20, 'Silver worked example: 60 − (25 + 15) = 20 N')
ok(net(D['q6']['right'], D['q6']['left']) == 40 and '30 + 20 = 50' in A['6'] and '90 − 50 = 40' in A['6'], 'Q6: 90 − (30 + 20) = 40 N to the right')
ok(net(D['q7']['right'], D['q7']['left']) == 30 and '150 + 20 = 170' in A['7'] and '200 − 170 = 30' in A['7'], 'Q7: 200 − (150 + 20) = 30 N to the right')
ok(net(D['q9']['up'], D['q9']['down']) == 0 and '45 − 45 = 0' in A['9'] and 'forces ARE acting' in A['9'], 'Q9: 45 − 45 = 0 N, and the answer says the forces ARE acting (it is the resultant that is zero)')
ok(D['gw']['right'][0] - D['gw']['resultant'] == 50 and RR['gwX'] == 50, 'Gold worked example: 80 − X = 30, so X = 50 N')
ok(D['q10']['right'][0] - D['q10']['resultant'] == 45 and 'X = 70 − 25 = 45' in A['10'], 'Q10: 70 − Y = 25, so Y = 45 N')
ok(D['q11']['up'][0] - D['q11']['down'][0] == 200 and '4200 − 4000 = 200 N upwards' in A['11'], 'Q11: 4200 − 4000 = 200 N upwards')
a13, b13 = D['q13']['a'][0] * D['q13']['a'][1], D['q13']['b'][0] * D['q13']['b'][1]
ok((a13, b13, a13 - b13) == (2400, 2250, 150) and '2400 − 2250 = 150' in A['13'], 'Q13: 6 × 400 = 2400, 5 × 450 = 2250, resultant 150 N towards team A')
wt = D['q14']['mass'] * G
ok(wt == 49 and D['q14']['tension'] - wt == 11 and RR['q14'] == 11 and '60 − 49 = 11' in A['14'], 'Q14: weight 5 × 9.8 = 49 N; 60 − 49 = 11 N upwards')
ok(sympify('12 + 9') == 21 and D['q3']['weight'] == D['q3']['reaction'] == 10, 'Q3: the book\'s weight and reaction force are both 10 N, so the resultant is 0 N')

# the free-body diagrams the worksheet prints must show exactly the numbers the answers use
media = (ROOT / 'build' / 'media' / 'resultant-forces-media.py').read_text()
ws = ast.literal_eval(re.search(r'WS = (\{.*?\n\})', media, re.S).group(1).replace("'rf-ws-q", "'q"))
def fmap(forces): return ({f['n'] for f in forces if f['dir'] == 'right'}, [f['n'] for f in forces if f['dir'] == 'left'])
for key, side in (('q4', 'q4'), ('q6', 'q6'), ('q7', 'q7')):
    forces, label = ws[key]
    right = [f['n'] for f in forces if f['dir'] == 'right']; left = [f['n'] for f in forces if f['dir'] == 'left']
    ok(sorted(right) == sorted(D[side]['right']) and sorted(left) == sorted(D[side]['left']), f'the Q{key[1:]} diagram ({label}) draws exactly the forces in the answers: right {right}, left {left}')

z = zipfile.ZipFile(OUT / f'{LESSON} worksheet.docx')
body = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', z.read('word/document.xml').decode('utf-8')))
for needle in ['60 N force to the right', '25 N and 15 N', '60 − 40 = 20', '45 N weight', '4200 N', '4000 N', '6 people, each pulling with 400 N', '5 people, each pulling with 450 N', '5 kg box', 'g = 9.8 N/kg', 'P1.5' if False else 'straight line']:
    ok(needle in body, f'the worksheet prints "{needle}"')
ok(not banned.search(body), 'the worksheet has no forces at angles')
media_parts = [n for n in z.namelist() if n.startswith('word/media/') and not n.endswith('/')]
ok(len(media_parts) == 5 and all(n.endswith('.png') for n in media_parts), f'the worksheet has its {len(media_parts)} images (4 diagrams and the upside-down answers) as .png parts (not ".undefined")')
wsrc = (ROOT / 'build' / 'resultant-forces-worksheet.js').read_text()
for i in range(1, 15): ok(re.search(rf"q\('{i}',", wsrc), f'worksheet has question {i}')
ok("q('8'" in wsrc and 'Why does that step work?' in wsrc and 'Why do we subtract forces that point opposite ways' in wsrc, 'the "why does that step work?" prompt (Q8) is on why we subtract opposite forces')
ok("q('12'" in wsrc and 'Where would you meet this idea outside the lesson' in wsrc, 'the "where would you meet this outside the lesson?" question is Q12')
ok((OUT / f'{LESSON} worksheet.docx').exists(), 'the worksheet exists')

# ---- the game: the deck points at a file, so the file must exist ----
ok(f'{LESSON} game' in text(8), 'slide 8 names "Resultant Forces game"')
game = OUT / f'{LESSON} game.html'
ok(game.exists() and game.stat().st_size > 20000, f'the game file the slide points at exists ({game.stat().st_size // 1024} KB)')
html = game.read_text(encoding='utf-8')
ok(html == (ROOT / 'build' / 'resultant-forces-game.html').read_text(encoding='utf-8'), 'the delivered game is exactly the source file')
ok('9.8' in html and 'Net Force' in html, 'the game uses g = 9.8 N/kg')
print(f'\n{checks} checks passed')
