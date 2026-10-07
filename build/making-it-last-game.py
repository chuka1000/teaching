#!/usr/bin/env python3
"""
Making It Last: the You Do game, Sustainable Yield (9G and 9I). Drill rounds, on devices,
one self-contained HTML file. The source is build/making-it-last-game.html: every question is
built from a template with a random stock, growth rate and amount taken, from a game code that
is different for each student (see the comment in the file). This script copies it to the lesson
folder and checks it makes no external request and stores nothing.

Test it with build/test-making-it-last-game.js and build/check-making-it-last-game.py (sympy
over 300 games).

    python3 build/making-it-last-game.py
"""
import pathlib, re
HERE = pathlib.Path(__file__).parent
OUT = HERE.parent / 'out' / 'Making It Last'
OUT.mkdir(parents=True, exist_ok=True)
html = (HERE / 'making-it-last-game.html').read_text(encoding='utf-8')
assert not re.search(r'https?://', html), 'external reference in the game'
assert 'localStorage' not in html and 'sessionStorage' not in html, 'the game must not store anything'
dest = OUT / 'Making It Last game.html'
dest.write_text(html, encoding='utf-8')
print(f'{dest.name}: {len(html) // 1024} KB')
