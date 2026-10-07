#!/usr/bin/env python3
"""
Float Or Sink: the You Do game (10A). Drill rounds, on devices, one self-contained HTML file. The
source is build/float-or-sink-game.html: every question is generated from a template with random
materials and numbers, from a game code that is different for each student (see the comment in
the file). This script copies it to the lesson folder and checks it makes no external request and
stores nothing.

Test it with build/test-float-or-sink-game.js and build/check-float-or-sink-game.py (a Python
re-derivation over 300 games).

    python3 build/float-or-sink-game.py
"""
import pathlib, re
HERE = pathlib.Path(__file__).parent
OUT = HERE.parent / 'out' / 'Float Or Sink'
OUT.mkdir(parents=True, exist_ok=True)
html = (HERE / 'float-or-sink-game.html').read_text(encoding='utf-8')
assert not re.search(r'https?://', html), 'external reference in the game'
assert 'localStorage' not in html and 'sessionStorage' not in html, 'the game must not store anything'
dest = OUT / 'Float Or Sink game.html'
dest.write_text(html, encoding='utf-8')
print(f'{dest.name}: {len(html) // 1024} KB')
