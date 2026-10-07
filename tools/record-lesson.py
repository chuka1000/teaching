#!/usr/bin/env python3
"""
Record a lesson in the manifest, at build time.

    python3 tools/record-lesson.py --class 7B --unit "Unit 2" --lesson 4 \
        --title "Numbers in Science" --file "Numbers In Science.pptx"

WHY THIS EXISTS
The first version of the index read class, unit and lesson number out of the
pptx metadata. That fails: when a deck is opened and re-saved in Keynote or
PowerPoint the metadata is rewritten, and 30 of 37 decks had lost it. Anything
recovered from the file afterwards is lossy.

So the facts are written down once, at build time, into a text file that is
version controlled and that nothing else touches. Re-saving a deck cannot
damage it.
"""
import argparse, csv, pathlib, datetime, re, sys, zipfile

ROOT = pathlib.Path(__file__).parent.parent
MAN = ROOT / 'reference' / 'MANIFEST.tsv'
COLS = ['class', 'unit', 'lesson', 'title', 'file', 'built']

# 9G and 9I are always at the same point, so they are one group in the manifest.
Y9 = ('9G', '9I', '9G/9I', '9G and 9I', 'Y9')
CODES = r'\b(7B|8I|8CN|9G|9I|10A|T3)\b'
YEAR_RULES = [
    (r'\bCLIL\b|Developing Science',  'T3'),
    (r'\bY7\b|Year 7',                '7B'),
    (r'\bY8\b.*Maths|Maths.*\bY8\b',  '8CN'),
    (r'\bY8\b',                       '8I'),
    (r'\bY10\b|Year 10',              '10A'),
    (r'\bY9\b|Year 9',                'Y9'),
]

def norm_class(c):
    return 'Y9' if c in Y9 else c

def from_deck(path):
    """title, class, unit, lesson from a deck's own dc:title and dc:subject.
    Meant for a deck that has JUST been built, before anything has re-saved it.
    Subject format: '<Year> <Subject> · <Unit> · Lesson <N> · <class code>'."""
    z = zipfile.ZipFile(path)
    core = z.read('docProps/core.xml').decode()
    grab = lambda t: (re.search(rf'<{t}>([^<]*)</{t}>', core) or [0, ''])[1]
    title, subject = grab('dc:title') or pathlib.Path(path).stem, grab('dc:subject')
    codes = re.findall(CODES, subject)
    cls = ('Y9' if any(c in ('9G', '9I') for c in codes) else codes[0]) if codes else \
        next((c for pat, c in YEAR_RULES if re.search(pat, subject, re.I)), '')
    parts = [x.strip() for x in subject.split('\u00b7')]
    unit = next((x for x in parts[1:] if x and not re.fullmatch(rf'(Lesson \d+( of \d+)?|{CODES}( and {CODES})*)', x)), '')
    m = re.search(r'Lesson (\d+)', subject, re.I)
    return title, cls, unit, m.group(1) if m else ''

def load():
    if not MAN.exists(): return []
    with MAN.open() as f:
        return list(csv.DictReader(f, delimiter='\t'))

def save(rows):
    MAN.parent.mkdir(parents=True, exist_ok=True)
    rows.sort(key=lambda r: (r['class'], r['unit'], int(r['lesson'] or 99)))
    with MAN.open('w', newline='') as f:
        w = csv.DictWriter(f, COLS, delimiter='\t', lineterminator='\n')
        w.writeheader(); w.writerows(rows)

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--deck', help='a freshly built deck: title, class, unit and lesson are read from its dc:title/dc:subject')
    for c in ('class', 'unit', 'lesson', 'title', 'file'):
        p.add_argument('--' + c)
    a = p.parse_args()
    cls, unit, lesson, title, file = getattr(a, 'class'), a.unit, a.lesson, a.title, a.file
    if a.deck:
        t, c, u, l = from_deck(a.deck)
        cls, unit, lesson, title = cls or c, unit or u, lesson or l, title or t
        file = file or pathlib.Path(a.deck).name
    if not (cls and title and file):
        sys.exit('record-lesson: need a class, a title and a file. For --deck, put the class code in dc:subject '
                 "('<Year> <Subject> \u00b7 <Unit> \u00b7 Lesson <N> \u00b7 <class>') or pass --class.")
    cls = norm_class(cls)
    old = next((r for r in load() if r['file'] == file), None)
    if old:                         # a rebuild must not wipe what was recorded earlier
        unit, lesson = unit or old['unit'], lesson or old['lesson']
    rows = [r for r in load() if r['file'] != file]      # replace, don't duplicate
    rows.append({'class': cls, 'unit': unit or '', 'lesson': lesson or '',
                 'title': title, 'file': file, 'built': datetime.date.today().isoformat()})
    save(rows)
    dash = '\u2014'
    print(f'recorded: {cls} \u00b7 {unit or dash} \u00b7 L{lesson or dash} \u00b7 {title}')
    if not unit or not lesson:
        print('  note: unit and/or lesson number missing. Set them in dc:subject, or pass --unit/--lesson.')

main()
