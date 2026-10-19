#!/usr/bin/env python3
"""
Earth Resources revision game (Y9, 9G and 9I): the question bank. Assembles the five levels from build/earth_resources_l12.py, _l3.py and _l45.py
and writes build/earth-resources.bank.json, which build/earth-resources-game.py injects into the game. The numeric questions (the `tpl` entries) are
not in the bank: their formulas are in the game, and are re-derived with sympy by build/check-earth-resources-game.py.

    python3 build/earth-resources-bank.py

It refuses to write a bank in which a wrong answer has no named mistake, an answer is not on its own menu, or the right answer is too often the
longest option (Chuka's rule for Rank And Conquer, applied here too: length must not give the answer away).
"""
import json, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from earth_resources_l12 import LEVEL1, LEVEL2, LAND, SOIL, CITY, EARTH, LAST, DEP
from earth_resources_l3 import LEVEL3
from earth_resources_l45 import LEVEL4, LEVEL5

HERE = pathlib.Path(__file__).parent

STRANDS = {
    'soil': dict(name='What soil is made of', lesson=LAND,
                 key='Soil has four parts: broken rock, dead organic matter, water and air, and living organisms. Producers grow in it, so nearly every land food chain starts there.',
                 practise='Cover this page and write the four parts from memory. Then say what each one is or does.'),
    'time': dict(name='How fast soil forms, and how fast it is lost', lesson=f'{LAND} and {SOIL}',
                 key='Centuries to make, years to lose. A crop takes months, a few centimetres of soil take a few hundred to about a thousand years, and coal takes millions of years.',
                 practise='Write the three times in order. Then explain, in one sentence, why soil is non-renewable on a human timescale.'),
    'erosion': dict(name='Erosion and desertification', lesson=SOIL,
                    key='Erosion is soil worn away AND carried off, by water or wind. Roots and leaves protect soil. Farming that removes plant cover can lead, in dry areas, to desertification.',
                    practise='Draw the four-step chain from farming to desertification, and say what the bare tray showed.'),
    'cities': dict(name='Cities and land', lesson=CITY,
                   key='Urbanisation is a bigger share of people in towns and cities. Rain cannot soak in, so it runs off. Wuhan became a sponge city. The London Green Belt keeps a ring of land from being built on.',
                   practise='Name each place and say, in one sentence, what it did. Then explain runoff in your own words.'),
    'renew': dict(name='Natural resources, and renewable or not', lesson=EARTH,
                  key='A natural resource comes from the Earth and is not made by people. Renewable or not is about the RATE: replaced as fast as, or faster than, it is used.',
                  practise='Pick three resources. For each, say how fast it is replaced and how fast it is used, then decide.'),
    'last': dict(name='Making it last', lesson=LAST,
                 key='Conservation is careful use, not no use. A sustainable amount is no more than the resource replaces. Sustainable yield = stock × growth rate ÷ 100.',
                 practise='Do three sustainable-yield calculations. Write stock × rate ÷ 100 first, then the numbers.'),
    'deplete': dict(name='Running out', lesson=DEP,
                    key='Depletion is use outrunning replacement for long enough. Even a renewable resource can run out, and a huge number is not a safe number. Repeat a fall once for EACH period.',
                    practise='Retell the passenger pigeon story in three sentences. Then do a repeated-fall calculation one period at a time.'),
}

SKILLS = {
    'recall': 'Remembering the facts',
    'calc': 'Calculations',
    'spot': 'Spotting what is wrong',
    'explain': 'Explaining in words',
    'judge': 'Judging and choosing',
    'puzzle': 'Puzzles past the test',
}

HABITS = {
    'soil-parts': 'Learn the four parts of soil: broken rock, dead organic matter, water and air, and living organisms.',
    'soil-rock-only': 'Soil is not just crushed rock. Broken rock is one of four parts.',
    'soil-forget-life': 'Do not forget the living part of soil: bacteria, fungi, worms and insects, and the dead organic matter they break down.',
    'soil-job': 'Soil matters because producers grow in it and get their water and nutrients from it. Nearly every land food chain starts there.',
    'time-order': 'Learn the order: a crop takes months, a few centimetres of soil take centuries, coal takes millions of years.',
    'time-fast': 'Soil is slow: a few hundred to about a thousand years for a few centimetres. It can be LOST in years.',
    'time-coal': 'Coal is the one that takes millions of years. A few centimetres of soil take a few hundred to about a thousand years.',
    'time-soil': 'A few centimetres of soil take a few hundred to about a thousand years. Coal is far slower: millions of years.',
    'time-never': 'Soil does form again, but far slower than it is lost, so on a human timescale it is non-renewable.',
    'time-calc-add': 'To find the time for several centimetres, MULTIPLY the years for one centimetre by the number of centimetres. Do not add.',
    'time-calc-one': 'The question asks for several centimetres. Multiply the time for one centimetre by the number of centimetres.',
    'resource-def': 'A natural resource comes from the Earth and is not made by people. A thing made by people is made FROM natural resources.',
    'renew-class': 'Renewable: replaced far faster than we could use it up (sun, wind). Non-renewable: takes far longer to form than we use it (coal, oil, gas, ores).',
    'renew-rate': 'Ask for each resource: how fast is it replaced, and how fast is it used? Renewable only if it is replaced as fast as, or faster than, it is used.',
    'renewable-rate': 'Renewable or not is about the RATE, not the kind of resource: how fast it is replaced against how fast it is used.',
    'can-regrow': '"Can regrow" is not the same as "does regrow fast enough". The resource is the whole forest or stock, not one tree or one fish.',
    'renewable-cannot-run-out': 'Renewable means it CAN be replaced, not that it cannot run out. Used too fast for long enough, a renewable resource is depleted.',
    'eros-loosen': 'Erosion is soil worn away AND carried off. The soil has to leave.',
    'eros-formation': 'Erosion is soil being lost. Soil formation is the slow process that makes it.',
    'eros-agents': 'Water and wind carry soil away. Roots, leaves, worms and insects do not.',
    'eros-desert-only': 'Erosion happens anywhere that soil is bare and water or wind can carry it off, not only in deserts.',
    'eros-water-only': 'Wind carries soil away as well as water.',
    'cover': 'Roots and leaves protect soil. A bare tray loses more soil than a covered one.',
    'desert-spreads': 'Desertification is land degradation in dry areas, from climate variation AND human activity. A desert does not spread by itself.',
    'practical-order': 'Learn the order of the practical: set up fairly (same soil, same slope), predict, pour the same amount of water, then compare the catch pots.',
    'chain-order': 'Learn each chain one step at a time: cause, then effect, then the effect of that.',
    'urban-def': 'Urbanisation is towns and cities growing, with a bigger SHARE of people living in them.',
    'runoff': 'Runoff is rain that flows over the surface instead of soaking in. Roads and roofs are sealed, so rain cannot soak in.',
    'sponge': 'A sponge city lets rain soak in or be stored: permeable paving, rain gardens and green roofs.',
    'brownfield': 'Brownfield land is land that has been built on before.',
    'green-belt': 'A green belt is a ring of land round a city, kept from being built on. London’s is about 500,000 hectares.',
    'city-terms': 'Learn the places: Wuhan is a sponge city. London has a Green Belt. Brownfield land has been built on before.',
    'conserve-never': 'Conservation is careful use so a resource lasts. It is not no use at all.',
    'conserve-fast': 'Conservation can bring a resource back, but it can take decades. Protecting early works best.',
    'sustainable-nothing': 'Sustainable does not mean nothing is taken. It means no more than the resource replaces, so the stock does not shrink.',
    'recycle-def': 'Recycling is resource management: it cuts how much new, often non-renewable, material is needed.',
    'method-match': 'Match the method to the resource: quotas for fish, replanting for forests, recycling for materials that do not regrow, breeding programmes for tiny populations.',
    'prevent': 'Match the method to the kind of resource: quotas for fish, replanting for forests, recycling for materials that do not regrow, breeding programmes for populations that have fallen very low.',
    'deplete-def': 'Depletion is use outrunning replacement for long enough that not enough is left. It can happen to living resources and to dug-up ones.',
    'big-number-safe': 'A huge number is not a safe number. If it falls faster than it regrows, it still reaches zero.',
    'case-mismatch': 'Learn each real case with what actually happened: helium (hospitals rationing it), the Aral Sea (lost over 90%), bluefin tuna (quotas), bison (a few hundred left).',
    'judge-model': 'When you judge a claim, say what the evidence DID show and what it cannot show. A small, quick model shows a pattern but does not prove every real case.',
    'yield-percent': 'The growth rate is a percentage, so divide by 100. Sustainable yield = stock × rate ÷ 100.',
    'yield-flip': 'Multiply the stock by the rate. Do not divide by it. Sustainable yield = stock × rate ÷ 100.',
    'yield-compare': 'Work out the sustainable yield first (stock × rate ÷ 100). Then compare it with what is actually taken.',
    'pct-points': 'Percentage POINTS are the difference between two percentages. Do not divide by the starting percentage.',
    'pct-wrong-base': 'Percentage change = change ÷ the ORIGINAL amount × 100. Divide by the amount you started with.',
    'pct-left': 'The question asks for the percentage that was LOST, not the percentage that is left.',
    'pct-forgot100': 'A percentage of an amount is amount × percentage ÷ 100. Do not forget to divide by 100.',
    'cover-left': 'Read the question for what it asks: the area that is covered, not the area that is left.',
    'decline-stop': 'Apply the fraction once for EACH period, in turn. Do not stop early.',
    'decline-extra': 'Apply the fraction once for each period and then stop. Do not go one period too far.',
    'decline-lost': 'The question asks how much is LEFT, not how much was lost.',
    'decline-linear': 'Each period the fraction is taken from what is left NOW, not from the amount you started with.',
    'recycle-ignored': 'Recycling reduces the amount of NEW material used each year, so use the smaller yearly amount.',
    'recycle-misread': 'Recycling CUTS the new material needed. The amount used each year is what is left after the cut.',
    'ignore-growth': 'Remember the stock grows each year as well as being taken from. New stock = old stock + growth − amount taken.',
    'ignore-catch': 'Remember to take away what was caught as well as adding the growth.',
    'stop-early': 'Go on for every year the question asks about, one year at a time.',
    'growth-original': 'The growth each year is a percentage of the stock AT THE START OF THAT YEAR, so it changes as the stock falls.',
    'share-vs-number': 'A bigger SHARE of a bigger population is a different number of people. Work out how many people each time, then subtract.',
    'ratio-wrong-quantity': 'Read what the question asks for: how many TIMES longer. Divide one time by the other.',
    'reverse-flip': 'Here you are given the amount taken and need the stock. Work backwards: stock = amount taken × 100 ÷ rate.',
    'reverse-scale': 'Work backwards, and remember the 100: stock = amount taken × 100 ÷ rate.',
    'count-early': 'Work down the years one at a time until the amount is BELOW the limit. Then count the years.',
    'count-late': 'Stop in the first year that the amount is below the limit. Do not go on a year longer.',
}


def lint(levels):
    problems = []
    longest_right, total = 0, 0
    for li, lv in enumerate(levels, 1):
        for si, sl in enumerate(lv['slots'], 1):
            for it in sl['pool']:
                where = f'level {li} slot {si}'
                if 'tpl' in it:
                    continue
                if sl['kind'] == 'mc':
                    texts = [it['right']] + [w['t'] for w in it['wrongs']]
                    if len(set(texts)) != 4:
                        problems.append(f'{where}: options are not all different: {it["stem"][:50]}')
                    lens = [len(t) for t in texts]
                    if max(lens) / min(lens) > 2.4 and max(lens) > 25:
                        problems.append(f'{where}: option lengths {lens} differ too much: {it["stem"][:50]}')
                    total += 1
                    if lens[0] == max(lens) and lens.count(max(lens)) == 1 and lens[0] > 1.12 * sorted(lens)[-2]:
                        longest_right += 1
                    for w in it['wrongs']:
                        if w['tag'] not in HABITS:
                            problems.append(f'{where}: no habit for tag {w["tag"]}')
                if sl['kind'] in ('assign', 'order', 'build') and it['tag'] not in HABITS:
                    problems.append(f'{where}: no habit for tag {it["tag"]}')
                if sl['kind'] == 'written':
                    if not 3 <= it['marks'] <= 4:
                        problems.append(f'{where}: written answer worth {it["marks"]}')
    return problems, longest_right, total


levels = [LEVEL1, LEVEL2, LEVEL3, LEVEL4, LEVEL5]
for lv in levels:
    for sl in lv['slots']:
        assert sl['strand'] in STRANDS, sl['strand']
        assert sl['skill'] in SKILLS, sl['skill']
SIZES = [len(l['slots']) for l in levels]
assert SIZES == [10, 12, 12, 10, 10], SIZES

problems, longest_right, total = lint(levels)
share = longest_right / total
print(f'{total} multiple-choice items; the right answer is clearly the longest in {longest_right} of them ({share:.0%})')
if share > 0.30:
    problems.append(f'the right answer is clearly the longest in {share:.0%} of items (limit 30%)')
if problems:
    print('\n'.join(problems)); sys.exit(1)

bank = {'strands': STRANDS, 'skills': SKILLS, 'habits': HABITS,
        'levels': [{'name': l['name'], 'blurb': l['blurb'], 'slots': l['slots'], 'lists': l.get('lists', {})} for l in levels]}
(HERE / 'earth-resources.bank.json').write_text(json.dumps(bank, indent=1, ensure_ascii=False))
nitems = sum(len(sl['pool']) for l in levels for sl in l['slots'])
print(f'earth-resources.bank.json: {sum(SIZES)} questions, {nitems} items in the pools')
