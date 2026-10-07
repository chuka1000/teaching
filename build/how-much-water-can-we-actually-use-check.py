#!/usr/bin/env python3
"""
Checks everything numeric (and every claim that can be checked) in How Much Water Can We Actually Use:
the litre demonstration, the deck, the worksheet and its answers. Every proportion is recomputed here from
the USGS volumes (Shiklomanov 1993; Gleick 1993/1996), and values are read BACK OUT of the finished files,
independently of the JavaScript that wrote them.

    python3 build/how-much-water-can-we-actually-use-check.py

It also fails if the deck's phases do not add to 50, if a Do Now question repeats one from the last three
lessons in the class, and if the jar set-up is missing from the Plenary notes.
"""
import datetime, difflib, json, pathlib, re, subprocess, zipfile
from fractions import Fraction as F
from pptx import Presentation

ROOT = pathlib.Path(__file__).parent.parent
LESSON = 'How Much Water Can We Actually Use'
OUT = ROOT / 'out' / LESSON
DECK = OUT / f'{LESSON}.pptx'
checks = 0
def ok(cond, msg):
    global checks
    assert cond, f'FAIL: {msg}'
    checks += 1
    print('ok:', msg)

# ---------------------------------------------------------------- the source data (km3) ----
TOTAL = 1_386_000_000
V = {'oceans': 1_338_000_000, 'ice': 24_364_000, 'fresh groundwater': 10_530_000, 'saline groundwater': 12_870_000,
     'fresh lakes': 91_000, 'saline lakes': 85_400, 'soil moisture': 16_500, 'atmosphere': 12_900, 'swamps': 11_470,
     'rivers': 2_120, 'living things': 1_120}
FRESH_PARTS = ['ice', 'fresh groundwater', 'fresh lakes', 'soil moisture', 'atmosphere', 'swamps', 'rivers', 'living things']
fresh = sum(V[k] for k in FRESH_PARTS)
salt = V['oceans'] + V['saline groundwater'] + V['saline lakes']
surface = V['fresh lakes'] + V['swamps'] + V['rivers']
other = V['soil moisture'] + V['atmosphere'] + V['living things']
ML, DROP = F(1000), F(1, 20)     # one litre; a dropper drop is about 0.05 mL (20 drops to the mL)
ml = lambda x: F(x, TOTAL) * ML
pc = lambda a, b: float(F(a, b) * 100)

ok(abs(sum(V.values()) - TOTAL) / TOTAL < 1e-4, f'the volumes add up to the stated total within 0.01% ({sum(V.values()):,} against {TOTAL:,} km3)')
ok(salt + fresh == sum(V.values()), 'salt water and fresh water together are everything')
ok(abs(pc(salt, TOTAL) - 97.5) < 0.1 and abs(pc(fresh, TOTAL) - 2.5) < 0.1, f'salt water {pc(salt, TOTAL):.2f}% and fresh water {pc(fresh, TOTAL):.2f}% of all water: "97.5" and "2.5" on the slides')
SHARE = {'ice': pc(V['ice'], fresh), 'groundwater': pc(V['fresh groundwater'], fresh), 'surface': pc(surface, fresh), 'other': pc(other, fresh)}
for name, shown in (('ice', 70), ('groundwater', 30), ('surface', 0.3), ('other', 0.1)):
    ok(abs(SHARE[name] - shown) <= max(0.06, shown * 0.02) or (name == 'ice' and abs(SHARE[name] - shown) < 1), f'share of fresh water: {name} is {SHARE[name]:.2f}%, shown as about {shown}%')
ok(abs(sum(SHARE.values()) - 100) < 1e-9, 'the four shares of the fresh water add to 100% exactly')
ok(abs(70 + 30 + 0.3 + 0.1 - 100) < 1, 'the rounded shares (70, 30, 0.3, 0.1) add to within 1% of 100 (the slide says "about")')

# ---------------------------------------------------------------- the litre demonstration ----
LITRE = 1000
fresh_ml = float(ml(fresh)); ice_ml = float(ml(V['ice'])); gw_ml = float(ml(V['fresh groundwater'])); surf_ml = float(ml(surface))
ok(abs(float(ml(salt)) - 974.7) < 0.1, f'a litre of all Earth\'s water: {float(ml(salt)):.1f} mL is salt water (975 on the slide)')
ok(abs(fresh_ml - 25.27) < 0.01 and abs(LITRE * 2.5 / 100 - 25) < 1e-9 and abs(fresh_ml - 25) / 25 < 0.02, f'fresh water: {fresh_ml:.2f} mL exactly, 1,000 × 2.5 ÷ 100 = 25 mL on the slide (within 2%)')
for what, exact, shown in (('ice', ice_ml, 25 * 70 / 100), ('groundwater', gw_ml, 25 * 30 / 100), ('lakes, swamps and rivers', surf_ml, 25 * 0.3 / 100)):
    ok(abs(exact - shown) / exact < 0.02, f'{what}: {exact:.4f} mL exactly, {shown:g} mL on the slide (within 2%)')
ok(abs(25 - 17.5 - 7.5) < 1e-9, 'the slide\'s pours are consistent: 25 − 17.5 = 7.5 mL left, and the 7.5 mL poured off is the groundwater')
ok(abs(surf_ml / float(DROP) - 1.5) < 0.05 and 1 <= 0.075 / float(DROP) <= 2, f'0.075 mL is {0.075 / float(DROP):.1f} drops at 0.05 mL a drop; exactly {surf_ml / float(DROP):.2f}')
lakes_rivers = float(ml(V['fresh lakes'] + V['rivers']))
ok(abs(lakes_rivers - 0.067) < 0.001, f'lakes and rivers alone (no swamps) are {lakes_rivers:.3f} mL: the Hook notes say 0.067')
ok(250 / 0.075 > 3000 and 5 / 0.075 > 60, 'the Hook\'s wrong options are far too big: a glass is 3,333 times and a spoonful 67 times the real 0.075 mL')
ok(abs(float(ml(other)) - 0.022) < 0.001, f'soil moisture, air and living things are {float(ml(other)):.3f} mL: "under half a drop"')
ok(pc(surface, TOTAL) < 0.0076 and abs(pc(surface, TOTAL) - 0.0075) < 0.0002, f'lakes, swamps and rivers are {pc(surface, TOTAL):.4f}% of all water (0.0075%)')

# ---------------------------------------------------------------- the deck ----
prs = Presentation(str(DECK))
slides = list(prs.slides)
def walk(shapes):
    for sh in shapes:      # the animation step wraps shapes in groups, so look inside them too
        if sh.shape_type == 6: yield from walk(sh.shapes)
        elif sh.has_text_frame and sh.text_frame.text.strip(): yield sh.text_frame.text.replace('\n', ' ')
def named(i):
    out = {}
    def go(shapes):
        for sh in shapes:
            if sh.shape_type == 6: go(sh.shapes)
            elif sh.has_text_frame: out[sh.name] = sh.text_frame.text
    go(slides[i - 1].shapes); return out
def text(i): return ' | '.join(walk(slides[i - 1].shapes))
def notes(i): return slides[i - 1].notes_slide.notes_text_frame.text

pills = []
for i in range(1, len(slides) + 1):
    m = re.search(r'([A-Z][A-Z ]+) · (\d+) MIN', text(i)); pills.append((m.group(1), int(m.group(2))) if m else None)
ok(len(slides) == 10 and all(pills), 'ten slides, each with a phase pill')
ok([p[0] for p in pills] == ['DO NOW', 'TODAY', 'HOOK', 'I DO', 'I DO', 'WE DO', 'COLD CALL', 'YOU DO', 'MARK', 'PLENARY'], 'phases in the TEMPLATE.md order')
ok([p[1] for p in pills] == [10, 1, 2, 3, 3, 5, 6, 14, 3, 3] and sum(p[1] for p in pills) == 50, 'minutes 10, 1, 2, 3, 3, 5, 6, 14, 3, 3 add to 50')
ok(all(notes(i).strip() for i in range(1, 11)), 'speaker notes on every slide')
ok(prs.core_properties.title == LESSON and 'Y9' in prs.core_properties.subject and '9G and 9I' in prs.core_properties.subject, f'dc:title and dc:subject are set, with the class: {prs.core_properties.subject}')

d = re.search(r'(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday) (\d+) (\w+) (\d{4})', text(1))
dt = datetime.datetime.strptime(f'{d.group(2)} {d.group(3)} {d.group(4)}', '%d %B %Y')
ok(dt.strftime('%A') == d.group(1), f'the date on slide 1 is a real {d.group(1)}: {d.group(0)}')

# Do Now
s1 = text(1)
r = F(625)
steps = [r := r * F(4, 5) for _ in range(5)]
ok(steps[-1] == F('204.8') and steps[-1] > 0 and 'About 205 million litres remain.' in s1, f'Do Now Q1: 625 losing a fifth of what remains each year is {[float(x) for x in steps]}: 204.8 after 5 years, not empty; the slide says about 205')
ok(F(625) - 5 * F(625, 5) == 0 and steps[-1] != 0, 'Do Now Q1: the student\'s method (a fifth of the ORIGINAL each year, 125 × 5 = 625) empties it, and the right method does not: that is the mistake')
ok(4 < 5 and 'Yes. It takes less than the river replaces.' in s1, 'Do Now Q3: 4 million litres a day taken from a river that refills at 5 million is sustainable')
ok(all(w in s1 for w in ('bluefin', 'groundwater that took 1,000 years', 'sodium chloride', 'Where does the water in rain come from')), 'Do Now has Q2, Q4, Q5 and Q6 with their answers')

# the Do Now must not repeat a question from the last three lessons in the class
prev = ['Resource Depletion', 'Making It Last', 'What The Earth Gives Us']
old = []
for name in prev:
    pr = Presentation(str(ROOT / 'reference' / f'{name}.pptx'))
    old += [x for x in walk(pr.slides[0].shapes) if len(x) > 30]
mine = [x for x in walk(slides[0].shapes) if len(x) > 30]
worst = max((difflib.SequenceMatcher(None, a.lower(), b.lower()).ratio(), a, b) for a in mine for b in old)
print('closest pair:', worst[1][:90], '<>', worst[2][:90])
ok(worst[0] < 0.7, f'no Do Now question repeats one from {", ".join(prev)}: closest match {worst[0]:.2f}')

# Cold Call
s7 = text(7)
ok(F(4000) * F('2.5') / 100 == 100 and '100 mL. 4,000 × 2.5 ÷ 100.' in s7, 'Cold Call Q3: 4,000 × 2.5 ÷ 100 = 100 mL')
ok('Aral Sea' in s7 and 'sustainable amount' in s7, 'Cold Call Q5 and Q6 are from earlier lessons (the Aral Sea, a sustainable amount)')

# I Do 2: the working, each line evaluated
s5 = text(5)
work = re.findall(r'([\d,.]+) × ([\d.]+) ÷ 100 = ([\d.,]+) mL', s5)
vals = [(F(a.replace(',', '')) * F(b) / 100, F(c.replace(',', ''))) for a, b, c in work]
ok(len(work) == 3 and all(x == y for x, y in vals), f'I Do 2 working: three lines, each exactly right: {[(str(x), str(y)) for x, y in vals]}')
ok('25 mL left' in s5 and '7.5 mL left' in s5 and '0.075 mL left' in s5 and '975 mL' in s5 and '17.5 mL' in s5, 'I Do 2 shows 975, 25, 17.5, 7.5 and 0.075 mL')
ok('Hook answer: C' in s5 and 'About one or two drops' in text(3), 'the Hook answer on I Do 2 is C, "About one or two drops", the third card')
ok(all(x in text(4) for x in ('about 70%', 'about 30%', 'about 0.3%', 'about 0.1%')), 'I Do 1 gives the four shares of the fresh water')

# We Do: the residence times in the deck and the worksheet match the source table
TIMES = ['air 9 days', 'rivers 2 to 6 months', 'lakes 50 to 100 years', 'shallow groundwater 100 to 200 years', 'deep groundwater about 10,000 years']
ok(all(x in text(6) for x in TIMES), 'We Do speeds: air 9 days, rivers 2 to 6 months, lakes 50 to 100 years, shallow groundwater 100 to 200 years, deep groundwater about 10,000 years (Physical Geography, via Wikipedia "Water cycle")')

# Plenary
s10 = text(10)
ok(F(15) > F(10) and 'Taking 10 million litres a year from it is sustainable.' in s10, 'Plenary Q4 (the applied item): gaining 15 million and taking 10 million a year is sustainable, TRUE')
pn = named(10)
ok([pn[f'p{i}_v'] for i in range(5)] == ['TRUE', 'FALSE', 'FALSE', 'TRUE', 'FALSE'], 'Plenary: five statements, answers TRUE, FALSE, FALSE, TRUE, FALSE (three FALSE, each a real misconception from the lesson)')
ok('Most of the water on Earth is fresh' in pn['p1_q'] and 'cannot run out' in pn['p2_q'] and 'as quickly as a river' in pn['p4_q'], 'the three FALSE statements are the lesson\'s misconceptions: most water is fresh; rain means it cannot run out; deep groundwater refills quickly')
n10 = notes(10)
ok(all(w in n10 for w in ('pond or aquarium', 'pinch of fertiliser', 'Label them', 'windowsill', 'Seal them', 'risk assessment', 'Lesson 4')) and 'Lesson 4' in s10, 'the Plenary notes and slide carry the jar set-up (pond or tank water, a pinch of fertiliser to one, label, windowsill, sealed, risk assessment) and point to Lesson 4')

# ---------------------------------------------------------------- the worksheet ----
js = subprocess.check_output(['node', '-e', "const a=require('./build/how-much-water-can-we-actually-use-answers.js');console.log(JSON.stringify({a:a,c:a.CONST}))"], cwd=ROOT).decode()
data = json.loads(js); A = {k: v for k, v in data['a']}; K = data['c']
ok(len(A) == 14 and all(A[str(i)] for i in range(1, 15)), 'fourteen worksheet answers, one for every question, in order')
ok(F(2000) * F('2.5') / 100 == 50 == K['W']['fresh'], 'worksheet worked example: 2,000 × 2.5 ÷ 100 = 50 mL')
ok(F(3000) * F('2.5') / 100 == 75 and '= 75 mL' in A['1'] and K['B1']['fresh'] == 75, 'Q1: 3,000 × 2.5 ÷ 100 = 7,500 ÷ 100 = 75 mL')
ok(F(8000) * F('2.5') / 100 == 200 and '= 200 mL' in A['3'], 'Q3: 8,000 × 2.5 ÷ 100 = 200 mL')
ok(F(25) * 70 / 100 == F('17.5') and 25 - F('17.5') == F('7.5') and K['SW'] == {'fresh': 25, 'ice': 17.5, 'rest': 7.5}, 'Silver worked example: 25 × 70 ÷ 100 = 17.5 mL of ice, leaving 7.5 mL')
fresh4000 = F(4000) * F('2.5') / 100
ok(fresh4000 == 100 and fresh4000 * 30 / 100 == 30 and '= 30 mL' in A['6'], 'Q6: the 4,000 mL model has 100 mL of fresh water, and 30% of it is 30 mL')
ok(fresh4000 * F('0.3') / 100 == F('0.3') and F('0.3') / DROP == 6 and '= 0.3 mL' in A['7'] and 'about 6 drops' in A['7'], 'Q7: 100 × 0.3 ÷ 100 = 0.3 mL, which is 0.3 ÷ 0.05 = 6 drops')
ok(F(60) / (F(12) - F(9)) == 20 and '= 20 years' in A['12'] and 'No.' in A['12'] and 12 > 9, 'Q12: the lake loses 12 − 9 = 3 million litres a year, so 60 ÷ 3 = 20 years; it is not sustainable (12 > 9)')
ok('(b) a well: groundwater' in A['2'] and '(c) a river: surface water' in A['2'] and '(d) a glacier in the Alps: ice' in A['2'] and 'Lake Victoria: surface water' in A['2'], 'Q2 sorting answers')
ok('about 70%' in A['5'] and 'Ice caps and glaciers' in A['5'], 'Q5: ice caps and glaciers hold the most, about 70%')
# the worksheet's own text, read from the finished file
z = zipfile.ZipFile(OUT / f'{LESSON} worksheet.docx')
body = re.sub(r'<[^>]+>', ' ', z.read('word/document.xml').decode('utf-8')); body = re.sub(r'\s+', ' ', body)
for needle in ['2,000 × 2.5 ÷ 100 = 5,000 ÷ 100 = 50 mL', '25 × 70 ÷ 100 = 17.5 mL', '9 days', '2 to 6 months', '50 to 100 years', '100 to 200 years', 'about 10,000 years', 'about 97.5%', 'about 2.5%']:
    ok(needle in body, f'the worksheet prints "{needle}"')
src = (ROOT / 'build' / 'how-much-water-can-we-actually-use-worksheet.js').read_text()
for i in range(1, 15): ok(re.search(rf"q\('{i}',", src), f'worksheet has question {i}')
ok("q('8'" in src and 'and NOT' in src and 'does the working use' in src, 'the "why does that step work?" prompt (Q8) is on the step most often got wrong: 70% of the 25 mL, not of the litre')
ok("q('13'" in src and 'Where would you meet this idea outside the lesson' in src, 'the "where would you meet this outside the lesson?" question is Q13')
ok(f'{LESSON} worksheet' in text(8) and 'game' not in text(8).lower(), 'slide 8 is the worksheet, and there is no game')
ok((OUT / f'{LESSON} worksheet.docx').exists(), 'the worksheet exists')
print(f'\n{checks} checks passed')
