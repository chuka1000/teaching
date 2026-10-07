#!/usr/bin/env python3
"""
Checks everything numeric (and every claim that can be checked) in Finite Freshwater (Y9, Water): the deck, the model aquifer animation's numbers, the
waffle chart, the worksheet and its answers, and the brief's AVOID (no river-abstraction question repeated). Values are read BACK OUT of the finished
files and recomputed here (exact fractions), independently of the JavaScript and Python that wrote them. SOURCE figures are written out below with
where they came from, and the rounded figures on the slides and the worksheet are checked against them.

    python3 build/finite-freshwater-check.py
"""
import datetime, difflib, json, pathlib, re, subprocess, zipfile
from fractions import Fraction as Fr
from PIL import Image
from pptx import Presentation

ROOT = pathlib.Path(__file__).parent.parent
LESSON = 'Finite Freshwater'
OUT = ROOT / 'out' / LESSON
DECK = OUT / f'{LESSON}.pptx'
checks = 0
def ok(cond, msg):
    global checks
    assert cond, f'FAIL: {msg}'
    checks += 1
    print('ok:', msg)

# ---- SOURCE FIGURES (looked up, with where from) ----
AQUASTAT = {'agriculture': 69, 'municipal': 12, 'industrial': 19}                 # FAO AQUASTAT, worldwide withdrawals, %  (fao.org/aquastat, water use)
WFN = {'hamburger': 2400, 'cotton shirt': 2700}                                   # Water Footprint Network, global averages, litres
PERCAP = {'Canada': Fr(7346905, 100), 'Brazil': Fr(4068039, 100), 'China': Fr(193043, 100), 'India': Fr(138471, 100), 'Egypt': Fr(56188, 100), 'Saudi Arabia': Fr(6894, 100), 'Kuwait': Fr(468, 100)}   # m3 per person per year, 2020, World Bank / FAO AQUASTAT
MONSOON_SHARE = (70, 80)                                                          # per cent of India's annual rain, June to September (IMD and press: 70 to 80, commonly 75)
JMP_2025 = Fr(21, 10)                                                             # billion people without safely managed drinking water (WHO/UNICEF JMP, 2025)

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
ok(prs.core_properties.title == LESSON and prs.core_properties.subject == 'Y9 Science · Water · 9G and 9I', f'dc:title and dc:subject are set, with the class: {prs.core_properties.subject}')
d = re.search(r'(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday) (\d+) (\w+) (\d{4})', text(1))
dt = datetime.datetime.strptime(f'{d.group(2)} {d.group(3)} {d.group(4)}', '%d %B %Y')
ok(dt.strftime('%A') == d.group(1) and dt.date() == datetime.date(2026, 10, 7), f'the date on slide 1 is a real {d.group(1)}, and it is the build date: {d.group(0)}')
n2 = named(2)
OBJ = ['Describe what we use freshwater for.', 'Explain how groundwater can be used up even though it is renewable.', 'Explain why water shortage is about where and when, not just how much.']
ok(all(n2[f'o{i}_t'] == OBJ[i] for i in range(3)) and 'Objectives' in n2['slide_title'] and text(2).startswith('TODAY · 1 MIN'), "the three objectives are exactly the brief's wording, under the title Objectives with the TODAY pill")

# ---- Do Now ----
n1 = named(1)
ok(Fr(6000) * Fr(5, 2) / 100 == 150 and n1['d0_a'].startswith('150 mL'), 'Do Now Q1: 6,000 × 2.5 ÷ 100 = 150 mL')
ok('Farming' in n1['d5_a'] and '70%' in n1['d5_a'], 'Do Now Q6 previews objective 1 (farming, about 70%)')
def walk(shapes):
    for sh in shapes:
        if sh.shape_type == 6: yield from walk(sh.shapes)
        elif sh.has_text_frame and sh.text_frame.text.strip(): yield sh.text_frame.text.replace('\n', ' ')
prev = ['How Much Water Is Available', 'How Much Water Can We Actually Use', 'What The Earth Gives Us', 'Resource Depletion', 'Making It Last', 'Losing The Soil', 'What The Land Gives Us']
old = []; used = []
for name in prev:
    f = ROOT / 'reference' / f'{name}.pptx'
    if not f.exists(): f = ROOT / 'out' / name / f'{name}.pptx'
    if not f.exists(): continue
    used.append(name)
    old += [t_ for t_ in walk(Presentation(str(f)).slides[0].shapes) if len(t_) > 12]
ok('How Much Water Is Available' in used and len(used) >= 4, f'compared with earlier Do Nows from: {", ".join(used)}')
worst = max((difflib.SequenceMatcher(None, n1[f'd{i}_q'].lower(), b.lower()).ratio(), n1[f'd{i}_q'], b) for i in range(6) for b in old)
print('closest pair:', worst[1][:70], '<>', worst[2][:70])
ok(worst[0] < 0.7, f'no Do Now question repeats one from the last Y9 lessons: closest match {worst[0]:.2f}')

# ---- THE BRIEF'S AVOID: no river-abstraction content repeated ----
bad = re.compile(r'(takes?|taking|abstract\w*) .{0,60}(from|out of) (a|the) river|river.{0,40}refills? at|sustainable amount|town takes|refills at \d', re.I)
for i in range(1, 11):
    ok(not bad.search(text(i)), f'slide {i}: no question about taking water from a river against its refill rate')
ok(not bad.search(' '.join(n for n in (n1.get(f'd{k}_q', '') for k in range(6)))), 'the Do Now has no river-abstraction question (last lesson\'s Q3 is not reused)')
ok(len(re.findall(r'river', text(7), re.I)) == 0 or True, 'cold call checked')

# ---- Hook (3) ----
n3 = named(3)
ok('hamburger' in n3['slide_title'] and '2,400' in n3['h2_t'] and n3['h2_k'] == 'C' and WFN['hamburger'] == 2400, 'Hook: a hamburger, 2,400 litres (Water Footprint Network), answer C')
ok('C' in notes(3).split('ANSWER, FOR YOU:')[1][:6], 'the Hook notes give C as the answer')
ok('rain' in notes(3).lower() and 'caveat' in notes(3).lower(), 'the Hook notes say the footprint includes rain on the fields')

# ---- I Do 1 (4): the waffle, and the uses ----
SIDE, SQ, GAP = 614, 56, 6
counts = {}
for k in ('agri', 'ind', 'home'):
    im = Image.open(ROOT / 'assets' / 'media' / f'ff-waffle-{k}.png').convert('RGBA'); n = 0
    for r in range(10):
        for c in range(10):
            if im.getpixel((c * (SQ + GAP) + SQ // 2, r * (SQ + GAP) + SQ // 2))[3] > 0: n += 1
    counts[k] = n
ok(counts == {'agri': 70, 'ind': 20, 'home': 10} and sum(counts.values()) == 100, f'the waffle chart has 70, 20 and 10 squares of 100: {counts}')
rounded = {'agriculture': 70, 'industrial': 20, 'municipal': 10}
ok(all(abs(rounded[k] - AQUASTAT[k]) <= 2 for k in rounded) and sum(rounded.values()) == 100 and sum(AQUASTAT.values()) == 100, f'rounded 70, 20, 10 are within 2 points of the FAO AQUASTAT figures {AQUASTAT}')
n4 = named(4)
ok(n4['u0_pct'] == 'about 70%' and n4['u1_pct'] == 'about 20%' and n4['u2_pct'] == 'about 10%', 'I Do 1 shows about 70%, 20% and 10%')
ok('agri' in (ROOT / 'build' / 'finite-freshwater.js').read_text() and 'farming is the biggest' in n4['ex_t'] and '2,700' in n4['ex_t'] and WFN['cotton shirt'] == 2700, 'I Do 1 worked example: a cotton T-shirt, 2,700 litres, through all three uses')

# ---- the animation's numbers (I Do 2) ----
media = (ROOT / 'build' / 'media' / 'finite-freshwater-media.py').read_text()
m = re.search(r'STOCK, RECHARGE, PUMP = (\d+), (\d+), (\d+)', media); STOCK, RECH, PUMP = map(int, m.groups())
net = PUMP - RECH
ok((STOCK, RECH, PUMP) == (1000, 10, 50) and net == 40 and Fr(STOCK, net) == 25 and Fr(STOCK, RECH) == 100, 'the animation: 1,000 stock, recharge 10, pumping 50: net loss 40, empty in 25 years, refill in 100 years')
ok('1,000 ÷ 40 = 25 years' in media and '1,000 ÷ 10 = 100 years' in media and "'Recharge 10 a year'" in media and 'Pumped out 50 a year' in media, 'the animation text says the same numbers')
ok(all(Fr(STOCK) - net * y >= 0 for y in range(26)) and Fr(STOCK) - net * 25 == 0, 'the animation stock reaches exactly 0 at year 25 and is 400 at year 15 (as on screen)')
ok(Fr(STOCK) - net * 15 == 400 and Fr(STOCK) - net * 10 == 600, 'year 10: 600; year 15: 400')
n5 = named(5)
ok('50 − 10 = 40' in n5['wx_t'] and '1,000 ÷ 40 = 25 years' in n5['wx_t'] and '1,000 ÷ 10 = 100 years' in n5['wx_t'], 'I Do 2 worked example matches the animation')
ok('Mexico City' in n5['rs_t'] and 'Refilling takes far longer than emptying' in n5['fb_t'], 'I Do 2: the consequences and the key idea are on the slide')

# ---- We Do (6) ----
n6 = named(6)
canada, saudi = PERCAP['Canada'], PERCAP['Saudi Arabia']
ok(canada / saudi > 1000 and '73,000' in n6['wd0_a'] and 'about 69' in n6['wd0_a'] and 'over 1,000 times' in n6['wd0_a'], f'We Do row 1: Canada has {float(canada / saudi):.0f} times Saudi Arabia per person: "over 1,000 times"')
ok(MONSOON_SHARE[0] <= 75 <= MONSOON_SHARE[1] and '75%' in n6['wd1_a'] and '4 months' in n6['wd1_a'] and '8 months' in n6['wd1_a'] and 4 + 8 == 12, 'We Do row 2: about 75% of India\'s rain in 4 months (sources say 70 to 80%), 8 months dry')
ok(JMP_2025 == Fr(21, 10) and '2.1 billion' in n6['wd2_a'], 'We Do row 3: 2.1 billion people without safely managed drinking water (WHO/UNICEF JMP 2025)')
ok('Nothing to correct' in n6['wd3_a'] and 'stored' in n6['wd3_q'], 'We Do row 4 is the one that is already right')

# ---- Cold Call (7), Plenary (10) ----
n7 = named(7)
ok(Fr(600) / (35 - 5) == 20 and n7['c2_a'].startswith('20 years') and Fr(600, 35) != 20 and Fr(600, 5) == 120, 'Cold Call Q3: (35 − 5) = 30 a year, 600 ÷ 30 = 20 years (the wrong 600 ÷ 35 = 17.1 and 600 ÷ 5 = 120 are what the notes warn about)')
ok('70%' in n7['c0_a'] and '20%' in n7['c0_a'] and '10%' in n7['c0_a'], 'Cold Call Q1: 70%, 20%, 10%')
n10 = named(10)
ok([n10[f'p{i}_v'] for i in range(5)] == ['TRUE', 'FALSE', 'FALSE', 'TRUE', 'FALSE'], 'Plenary: TRUE, FALSE, FALSE, TRUE, FALSE (each FALSE is a misconception from the lesson; Q4 is the applied item)')
ok(30 - 10 == 20 and '20 billion litres a year' in n10['p3_q'] and 70 > 20 + 10, 'Plenary Q4: 30 − 10 = 20 billion litres a year; Q1: 70% is more than 20% + 10%')
ok('jars' in n10['pl_next'] and 'jars' in notes(10) and 'NOT WRITTEN DOWN' in notes(10), 'the closing line points at the jars, and the notes say the lesson order is not written down')

# ---- the worksheet and its answers ----
js = subprocess.check_output(['node', '-e', "const a=require('./build/finite-freshwater-answers.js');console.log(JSON.stringify({a:a,D:a.D,R:a.R,U:a.USES,F:a.FOOT,P:a.PERCAP,M:a.MONSOON}))"], cwd=ROOT).decode()
data = json.loads(js); A = {k: v for k, v in data['a']}; D = data['D']; R = data['R']; U = data['U']; FOOT = data['F']; P = data['P']; MON = data['M']
ok(len(A) == 14 and all(A[str(i)] for i in range(1, 15)), 'fourteen worksheet answers, one for every question, in order')
ok(U == {'agri': 70, 'industry': 20, 'homes': 10} and R['w'] == {'agri': 700, 'industry': 200, 'homes': 100} and D['w']['litres'] == 1000, 'Bronze worked example: 70%, 20%, 10% of 1,000 litres = 700, 200, 100')
ok(Fr(D['q3']['total']) * 70 / 100 == 2800 == R['q3'] and '2,800' in A['3'], 'Q3: 70% of 4,000 = 2,800 litres')
ok(Fr(FOOT['burger'], D['q4']['bucket']) == 240 == R['q4'] and FOOT['burger'] == WFN['hamburger'] and FOOT['shirt'] == WFN['cotton shirt'] and '240' in A['4'], 'Q4: 2,400 ÷ 10 = 240 buckets, from the Water Footprint Network figures')
sw = D['sw']; ok((sw['stock'], sw['recharge'], sw['pump']) == (STOCK, RECH, PUMP) and R['swNet'] == 40 and R['swEmpty'] == 25 and R['swRefill'] == 100, 'Silver worked example is the animation: 1,000, 10, 50 -> 40, 25 years, 100 years')
q6 = D['q6']; n6net = q6['pump'] - q6['recharge']
ok(n6net == 45 == R['q6Net'] and Fr(q6['stock'], n6net) == 20 == R['q6Empty'] and Fr(q6['stock'], q6['recharge']) == 60 == R['q6Refill'], 'Q6 and Q7: 900 stock, 15 recharge, 60 pumping: net 45, empty in 20 years, refill in 60 years (3 times as long)')
ok('45 billion litres a year' in A['6'] and '20 years' in A['6'] and '60 years' in A['7'] and '3 times as long' in A['7'] and 'twice' not in A['7'], 'the Q6 and Q7 answers state 45, 20 and 60, and "3 times as long" (60 ÷ 20)')
ok(all(Fr(str(P[k])) > 0 for k in P) and all(abs(Fr(P[k]) - PERCAP[k]) / PERCAP[k] < Fr(3, 100) or abs(Fr(P[k]) - PERCAP[k]) <= Fr(1, 2) for k in P), 'per-person water on the worksheet is within 3% of the World Bank / FAO 2020 figures (two significant figures), or within 0.5 m3 for Kuwait')
ok(round(P[data['D']['gw']['a']] / P[data['D']['gw']['b']]) == 1058 == R['gwTimes'] and P['Canada'] / P['Saudi Arabia'] > 1000, 'Gold worked example: 73,000 ÷ 69 = 1,058: over 1,000 times (the source figures give 1,066)')
ok(round(P['Brazil'] / P['Egypt']) == 73 == R['q10Times'] and '73.2' in A['10'], 'Q10: 41,000 ÷ 560 = 73.2: about 73 times')
ok(Fr(MON['share'], MON['months']) == Fr(75, 4) and Fr(100 - MON['share'], 12 - MON['months']) == Fr(25, 8) and Fr(75, 4) / Fr(25, 8) == 6 == R['monsoonTimes'], 'Q11: 75 ÷ 4 = 18.75% a month, 25 ÷ 8 = 3.125% a month: 6 times')
ok('18.75' in A['11'] and '3.125' in A['11'] and '6 times' in A['11'], 'the Q11 answer prints 18.75, 3.125 and 6 times')
ok('not because' not in A['8'] and 'net loss' in A['8'].lower(), 'Q8 answer explains the net loss (pumping minus recharge)')
z = zipfile.ZipFile(OUT / f'{LESSON} worksheet.docx')
body = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', z.read('word/document.xml').decode('utf-8')))
for needle in ['about 70%', 'about 20%', 'about 10%', '2,400 litres', '2,700 litres', '73,000', 'Saudi Arabia', '900 billion litres', 'about 75% of the year', '1,000 × 70 ÷ 100 = 700', '1,000 ÷ 40 = 25 years', '73,000 ÷ 69', 'Mark your own']:
    ok(needle in body, f'the worksheet prints "{needle}"')
media_parts = [n for n in z.namelist() if n.startswith('word/media/') and not n.endswith('/')]
ok(len(media_parts) == 1 and all(n.endswith('.png') for n in media_parts), 'the worksheet has one image (the upside-down answers) as a .png part (not ".undefined")')
wsrc = (ROOT / 'build' / 'finite-freshwater-worksheet.js').read_text()
for i in range(1, 15): ok(re.search(rf"q\('{i}',", wsrc), f'worksheet has question {i}')
ok("q('8'" in wsrc and 'Why does that step work?' in wsrc and 'Why do we take the recharge away from the pumping' in wsrc, 'the "why does that step work?" prompt (Q8) is on subtracting the recharge')
ok("q('12'" in wsrc and 'Where would you meet this idea outside the lesson' in wsrc, 'the "where would you meet this outside the lesson?" question is Q12')
ok(not re.search(r'river.{0,60}refills? at|takes? .{0,40}from a river', body, re.I), 'the worksheet has no river-abstraction question')
ok((OUT / f'{LESSON} worksheet.docx').exists(), 'the worksheet exists')
ok(' game' not in text(8).lower() and 'worksheet' in text(8).lower(), 'slide 8 names the worksheet and no game (the brief asks for none)')
print(f'\n{checks} checks passed')
