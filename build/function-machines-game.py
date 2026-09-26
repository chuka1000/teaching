#!/usr/bin/env python3
"""
Function Machines: the You Do game (8CN). Drill rounds, on devices, one
self-contained HTML file. The source is build/function-machines-game.html:
every question is generated from a template with random numbers, from a game
code that is different for each student (see the comment in the file). This
script copies it to the lesson folder and checks it makes no external request.

Test it with build/test-function-machines-game.js and
build/check-function-machines-game.py (sympy over 300 generated games).

    python3 build/function-machines-game.py
"""
import pathlib, re
HERE = pathlib.Path(__file__).parent
OUT = HERE.parent / 'out' / 'Function Machines'
OUT.mkdir(parents=True, exist_ok=True)
html = (HERE / 'function-machines-game.html').read_text(encoding='utf-8')
assert not re.search(r'https?://', html.replace('http://www.w3.org', '')), 'external reference in the game'
assert 'localStorage' not in html and 'sessionStorage' not in html, 'the game must not store anything'
dest = OUT / 'Function Machines game.html'
dest.write_text(html, encoding='utf-8')
print(f'{dest.name}: {len(html) // 1024} KB')
