#!/usr/bin/env python3
"""
Pull one syllabus reference out of a scheme of work without reading the whole
thing.

    python3 tools/syllabus.py P1.4          # the P1.4 section
    python3 tools/syllabus.py C1 --pages    # just the page range
    python3 tools/syllabus.py density       # free-text search

The 0654 scheme is 198 pages. Reading it whole costs far more than any lesson
is worth; this pulls the two or three pages that matter.
"""
import re, subprocess, sys, pathlib

ROOT = pathlib.Path(__file__).parent.parent
INDEX = ROOT / 'curriculum' / '0654-INDEX.md'

def find_pdf():
    """Locate the scheme however it happens to be named.

    Hardcoding '0654_Scheme_of_Work.pdf' broke the moment the file arrived with
    spaces in its name instead of underscores. Match on the syllabus number.
    """
    hits = sorted((ROOT / 'curriculum').glob('*0654*.pdf'))
    if not hits:
        sys.exit('No 0654 scheme of work PDF found in curriculum/.\n'
                 '  Put it there under any filename containing "0654".')
    return hits[0]

PDF = find_pdf()

def pages_for(topic):
    """Page range for a topic code like P1 or C12, from the index table."""
    for line in INDEX.read_text().splitlines():
        m = re.match(r'\|\s*`([BCP]\d+)`\s*\|[^|]*\|[^|]*\|\s*(\d+)[–-](\d+)', line)
        if m and m.group(1).upper() == topic.upper():
            return int(m.group(2)), int(m.group(3))
    return None

def text(first=None, last=None):
    cmd = ['pdftotext', '-layout']
    if first: cmd += ['-f', str(first), '-l', str(last)]
    return subprocess.run(cmd + [str(PDF), '-'], capture_output=True, text=True).stdout

def main():
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(1)
    q = sys.argv[1]
    topic = re.match(r'([BCP]\d+)', q, re.I)
    if topic:
        rng = pages_for(topic.group(1))
        if not rng: sys.exit(f'{topic.group(1)} not in the index')
        if '--pages' in sys.argv:
            print(f'{topic.group(1)}: pages {rng[0]}–{rng[1]}'); return
        body = text(*rng)
        if q.upper() != topic.group(1).upper():          # a sub-ref like P1.4
            lines = body.splitlines()
            hits = [i for i, l in enumerate(lines) if q.upper() in l.upper()]
            if hits:
                print('\n'.join(lines[max(0, hits[0] - 2): hits[-1] + 40])); return
            print(f'{q} not found in {topic.group(1)}; showing the topic:\n')
        print(body)
        return

    # free text across the whole scheme
    lines = text().splitlines()
    for i, l in enumerate(lines):
        if q.lower() in l.lower():
            print(f'--- line {i} ---')
            print('\n'.join(lines[max(0, i - 1): i + 4]))

main()
