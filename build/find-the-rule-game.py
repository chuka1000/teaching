#!/usr/bin/env python3
"""
Find The Rule: the standalone practice game (8CN). Five levels of eight questions on one skill, finding the rule
y = mx + c from a table, on devices, one self-contained HTML file. The source is build/find-the-rule-game.html: every
question is generated from a template with random numbers, from a game code that is different for each student (see the
comment in the file). This script copies it to the lesson folder and checks it makes no external request and stores nothing.

Test it with build/test-find-the-rule-game.js and build/check-find-the-rule-game.py (sympy over 300 generated games).

    python3 build/find-the-rule-game.py
"""
import pathlib, re
HERE = pathlib.Path(__file__).parent
OUT = HERE.parent / 'out' / 'Find The Rule'
OUT.mkdir(parents=True, exist_ok=True)
html = (HERE / 'find-the-rule-game.html').read_text(encoding='utf-8')
assert not re.search(r'https?://', html), 'external reference in the game'
assert 'localStorage' not in html and 'sessionStorage' not in html, 'the game must not store anything'
dest = OUT / 'Find The Rule game.html'
dest.write_text(html, encoding='utf-8')
print(f'{dest.name}: {len(html) // 1024} KB')
