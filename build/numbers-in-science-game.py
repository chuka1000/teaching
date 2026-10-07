#!/usr/bin/env python3
"""
Numbers In Science: the You Do game, Numbers Drill (7B). Drill rounds, on devices, one
self-contained HTML file. The source is build/numbers-in-science-game.html: every question is
generated from a template with random digits, from a game code that is different for each student
(see the comment in the file). This script copies it to the lesson folder and checks it makes no
external request and stores nothing.

Test it with build/test-numbers-in-science-game.js and build/check-numbers-in-science-game.py
(a Python re-derivation over 300 games).

    python3 build/numbers-in-science-game.py
"""
import pathlib, re
HERE = pathlib.Path(__file__).parent
OUT = HERE.parent / 'out' / 'Numbers In Science'
OUT.mkdir(parents=True, exist_ok=True)
html = (HERE / 'numbers-in-science-game.html').read_text(encoding='utf-8')
assert not re.search(r'https?://', html), 'external reference in the game'
assert 'localStorage' not in html and 'sessionStorage' not in html, 'the game must not store anything'
dest = OUT / 'Numbers In Science game.html'
dest.write_text(html, encoding='utf-8')
print(f'{dest.name}: {len(html) // 1024} KB')
