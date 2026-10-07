#!/usr/bin/env python3
"""
Running Out: the You Do game (9G and 9I). Drill rounds, on devices, one self-contained HTML file.
The source is build/running-out-game.html: every question is built from a template with a random
stock, rate or amount, from a game code that is different for each student (see the comment in
the file). This script copies it to the lesson folder and checks it makes no external request and
stores nothing.

Test it with build/test-running-out-game.js and build/check-running-out-game.py (sympy over 300
games).

    python3 build/running-out-game.py
"""
import pathlib, re
HERE = pathlib.Path(__file__).parent
OUT = HERE.parent / 'out' / 'Running Out'
OUT.mkdir(parents=True, exist_ok=True)
html = (HERE / 'running-out-game.html').read_text(encoding='utf-8')
assert not re.search(r'https?://', html), 'external reference in the game'
assert 'localStorage' not in html and 'sessionStorage' not in html, 'the game must not store anything'
dest = OUT / 'Running Out game.html'
dest.write_text(html, encoding='utf-8')
print(f'{dest.name}: {len(html) // 1024} KB')
