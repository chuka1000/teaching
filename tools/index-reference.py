#!/usr/bin/env python3
"""
Index everything in reference/ so a lesson can find its own predecessors.

    python3 tools/index-reference.py

Writes reference/INDEX.md: one row per deck, grouped by class and ordered
within a unit. That is what makes a PREVIOUS: line optional — look the class
up, take the lesson before the one being built, and open it.

Everything is read from metadata, not guessed. Every deck the toolkit builds
sets dc:title and dc:subject; keep doing that, with the class code in the
subject, and this stays exact.

The facts live in reference/MANIFEST.tsv, written at build time by
tools/record-lesson.py (build-lesson.js calls it). The manifest wins. Only a
deck with no row falls back to whatever is left in its file metadata, which
re-saving in Keynote or PowerPoint usually destroys.

9G and 9I are always at the same point, so Year 9 is one group: Y9.
"""
import re, sys, zipfile, pathlib, datetime

ROOT = pathlib.Path(__file__).parent.parent
REF = ROOT / 'reference'
MONTHS = ('january february march april may june july august september '
          'october november december').split()

# subject line -> class code (used only when a deck has no manifest row).
EXPLICIT = r'\b(7B|8I|8CN|9B|9G|9I|10A|T3)\b'   # an actual class code, wherever it appears

CLASS_RULES = [
    (r'\bCLIL\b|Developing Science',  'T3'),
    (r'\bY7\b|Year 7',                '7B'),
    (r'\bY8\b.*Maths|Maths.*\bY8\b',  '8CN'),
    (r'\bY8\b',                       '8I'),
    (r'\bY10\b|Year 10',              '10A'),
    (r'\bY9\b|Year 9',                'Y9'),
]

def core(z):
    try: return z.read('docProps/core.xml').decode()
    except KeyError: return ''

def field(c, tag):
    m = re.search(rf'<{tag}>([^<]*)</{tag}>', c)
    return m.group(1) if m else ''

def slides(z):
    return sorted([n for n in z.namelist() if re.match(r'ppt/slides/slide\d+\.xml$', n)],
                  key=lambda s: int(re.findall(r'\d+', s)[0]))

def texts(z, s):
    return re.findall(r'<a:t>([^<]*)</a:t>', z.read(s).decode('utf-8', 'ignore'))

def parse_date(s):
    m = re.search(r'(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})', s)
    if not m: return None
    try:
        return datetime.date(int(m.group(3)), MONTHS.index(m.group(2).lower()) + 1, int(m.group(1)))
    except ValueError:
        return None

def read(path):
    z = zipfile.ZipFile(path)
    c = core(z)
    subject = field(c, 'dc:subject')
    sl = slides(z)
    codes = []
    for m in re.findall(EXPLICIT, subject):
        if m not in codes: codes.append(m)
    cls = ('Y9' if any(x in ('9G', '9I') for x in codes) else codes[0]) if codes else \
        next((cl for pat, cl in CLASS_RULES if re.search(pat, subject, re.I)), '?')
    parts = [x.strip() for x in subject.split('\u00b7')]
    unit = next((x for x in parts[1:] if x and not re.fullmatch(rf'(Lesson \d+( of \d+)?|{EXPLICIT}( and {EXPLICIT})*)', x)), '')
    rec = {'file': path.name,
           'title': field(c, 'dc:title') or path.stem,
           'subject': subject,
           'cls': cls, 'lesson': None, 'unit': unit, 'source': 'file',
           'date': None, 'minutes': 0, 'phases': [], 'objectives': []}

    m = re.search(r'Lesson (\d+)', subject, re.I)
    if m: rec['lesson'] = int(m.group(1))

    rec['slides'] = len(sl)
    today_next = False
    for i, s in enumerate(sl, 1):
        ts = texts(z, s)
        pill = next((t for t in ts if re.match(r'^[A-Z][A-Z ]+ · \d+ MIN$', t.strip())), None)
        if pill:
            label, mins = pill.rsplit(' · ', 1)
            rec['minutes'] += int(re.findall(r'\d+', mins)[0])
            rec['phases'].append(label.title())
            today_next = label.strip().upper() in ('TODAY', 'OBJECTIVES')
        else:
            today_next = False
        if i == 1:
            for t in ts:
                d = parse_date(t)
                if d: rec['date'] = d
        if today_next:
            rec['objectives'] = [t for t in ts
                                 if len(t) > 18 and t != pill and not re.match(r'^[A-Z][A-Z ]+ ·', t)][:4]
    return rec

def manifest():
    """The build-time record. Authoritative — a re-saved deck cannot damage it."""
    m = REF / 'MANIFEST.tsv'
    if not m.exists(): return {}
    import csv
    with m.open() as f:
        return {r['file']: r for r in csv.DictReader(f, delimiter='\t')}

def main():
    if not REF.exists(): sys.exit('No reference/ folder.')
    man = manifest()
    decks = [read(p) for p in sorted(REF.glob('*.pptx'))]
    # The manifest wins over anything scraped from the file.
    unknown = []
    for d in decks:
        r = man.get(d['file'])
        if r:
            d['source'] = 'manifest'
            d['cls'] = r['class'] or d['cls']
            d['unit'] = r['unit'] or d['unit']
            d['lesson'] = int(r['lesson']) if r['lesson'] else d['lesson']
            d['title'] = r['title'] or d['title']
        elif d['cls'] == '?' or d['lesson'] is None:
            unknown.append(d['file'])
    if not decks: sys.exit('No decks in reference/.')
    decks.sort(key=lambda r: (r['cls'], r['unit'], r['lesson'] if r['lesson'] else 99,
                              r['date'] or datetime.date(1900, 1, 1)))

    out = ['# reference/ — what has been taught', '',
           f'Generated by `tools/index-reference.py` from {len(decks)} deck(s). '
           'Re-run after adding one.', '',
           '**Use this instead of asking for a PREVIOUS: line.** Find the class, take the '
           'lesson immediately before the one being built, and open it. This index is a '
           'map, not a substitute — the deck itself is the source of truth for runtime, '
           'vocabulary and what the plenary promised.', '']
    cur = None
    for d in decks:
        if d['cls'] != cur:
            cur = d['cls']
            out += ['', f'## {cur}', '', '| # | Lesson | Unit | Date | Slides | Min | Meta | File |',
                    '|---|---|---|---|---|---|---|---|']
        out.append(f"| {d['lesson'] or '—'} | {d['title']} | {d['unit'] or '—'} | "
                   f"{d['date'] or '—'} | {d['slides']} | {d['minutes']} | {d['source']} | `{d['file']}` |")
    out += ['', '## Objectives', '']
    for d in decks:
        out.append(f"**{d['cls']} · {d['title']}** — `{d['file']}`")
        for o in d['objectives'] or ['(no Today slide found)']:
            out.append(f'- {o}')
        out.append('')
    (REF / 'INDEX.md').write_text('\n'.join(out))
    print(f'reference/INDEX.md written — {len(decks)} deck(s)')
    if unknown:
        print(f'\n  {len(unknown)} deck(s) not in MANIFEST.tsv and not resolvable from the file.')
        print('  Record them:  python3 tools/record-lesson.py --class .. --unit .. '
              '--lesson .. --title .. --file ..')
        for u in unknown[:8]: print('   ', u)
        print()
    for d in decks:
        print(f"  {d['cls']:26s} L{str(d['lesson'] or '-'):2s} {d['minutes']:3d}min  {d['title'][:42]}")

main()
