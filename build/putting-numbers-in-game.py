#!/usr/bin/env python3
"""
Putting Numbers In: the You Do game (8CN). Drill rounds, on devices, one
self-contained HTML file. The source is build/putting-numbers-in-game.html:
every question is generated from a template with random numbers, from a game
code that is different for each student (see the comment in the file). This
script copies it to the lesson folder and checks it makes no external request.

Test it with build/test-putting-numbers-in-game.js and
build/check-putting-numbers-in-game.py (sympy over hundreds of generated games).

    python3 build/putting-numbers-in-game.py
"""
import pathlib, re
HERE = pathlib.Path(__file__).parent
OUT = HERE.parent / 'out' / 'Putting Numbers In'
OUT.mkdir(parents=True, exist_ok=True)
html = (HERE / 'putting-numbers-in-game.html').read_text(encoding='utf-8')
assert not re.search(r'https?://', html), 'external reference in the game'
assert 'localStorage' not in html and 'sessionStorage' not in html, 'the game must not store anything'
dest = OUT / 'Putting Numbers In game.html'
dest.write_text(html, encoding='utf-8')
print(f'{dest.name}: {len(html) // 1024} KB')
