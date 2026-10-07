#!/usr/bin/env python3
"""
Checks that a deck really has the animations its spec says it should: every click build, and every
slide transition.

    python3 tools/check-builds.py "out/<Lesson Name>/<Lesson Name>.pptx"

WHY: a deck with no builds LOOKS fine in a render and passes every structural check, but the Do
Now answers all show at once and the teacher has to add every reveal by hand. That shipped once,
after a raw deck builder was re-run on top of an animated deck. Run this on the exact file you are
about to send, as the LAST command before sending, and never re-run build/<slug>.js after it.

The spec is found by its "deck"/"output" path in spec/*.anim.json. The number of click builds in
the deck must equal the spec's, slide by slide.
"""
import json, pathlib, re, sys, zipfile

ROOT = pathlib.Path(__file__).parent.parent
deck = pathlib.Path(sys.argv[1]).resolve()
rel = str(deck.relative_to(ROOT)) if ROOT in deck.parents else str(deck)

spec = None
for f in sorted((ROOT / 'spec').glob('*.anim.json')):
    try: s = json.load(open(f))
    except ValueError: continue
    if (ROOT / (s.get('output') or s.get('deck') or '')).resolve() == deck: spec = (f, s); break
if not spec:
    sys.exit(f'FAIL: no spec/*.anim.json points at {rel}, so its builds cannot be checked.')

z = zipfile.ZipFile(deck)
names = sorted([n for n in z.namelist() if re.match(r'ppt/slides/slide\d+\.xml$', n)], key=lambda n: int(re.findall(r'\d+', n)[0]))
bad = []
total = 0
for sl in spec[1]['slides']:
    i = sl['index']
    xml = z.read(names[i - 1]).decode('utf8', 'ignore')
    want = len(sl.get('builds') or [])
    got = len(re.findall(r'nodeType="clickEffect"', xml))
    total += got
    if got != want: bad.append(f'slide {i}: {got} click builds in the deck, {want} in the spec')
    if sl.get('transition') and '<p:transition' not in xml and '<mc:AlternateContent' not in xml:
        bad.append(f'slide {i}: the spec asks for a transition and the deck has none')
# A slide that names a game must have that game: "<Lesson> game" needs "<Lesson> game.html" beside the deck.
# A slide pointing at a missing file is broken, not incomplete.
stem = deck.stem
for n in names:
    xml = z.read(n).decode('utf8', 'ignore')
    if f'<a:t>{stem} game</a:t>' in xml.replace('&amp;', '&') and not (deck.parent / f'{stem} game.html').exists():
        bad.append(f'{n.split("/")[-1]} names "{stem} game" but {stem} game.html is not in {deck.parent.name}/')
if len(names) != len(spec[1]['slides']):
    bad.append(f'{len(names)} slides in the deck, {len(spec[1]["slides"])} in the spec')
if bad:
    print(f'FAIL: {rel} has problems:')
    for b in bad: print('  -', b)
    print('  Run the whole pipeline:  node tools/build-lesson.js <lesson-slug>')
    sys.exit(1)
print(f'builds OK: {total} click builds and the transitions match {spec[0].name}')
