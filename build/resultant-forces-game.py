#!/usr/bin/env python3
"""
Resultant Forces: the You Do game, Net Force (10A). Free-body diagrams drawn from data, forces along ONE straight line, on devices, one
self-contained HTML file. The source is build/resultant-forces-game.html: every question is generated from a template with random forces,
names, directions and numbers, from a six-character code that is different for each student. This script copies it to the lesson folder
and checks it makes no external request and stores nothing.

Test it with build/test-resultant-forces-game.js and build/check-resultant-forces-game.py (300 games).

    python3 build/resultant-forces-game.py
"""
import pathlib, re
HERE = pathlib.Path(__file__).parent
OUT = HERE.parent / 'out' / 'Resultant Forces'
OUT.mkdir(parents=True, exist_ok=True)
html = (HERE / 'resultant-forces-game.html').read_text(encoding='utf-8')
assert not re.search(r'https?://', html), 'external reference in the game'
assert 'localStorage' not in html and 'sessionStorage' not in html, 'the game must not store anything'
dest = OUT / 'Resultant Forces game.html'
dest.write_text(html, encoding='utf-8')
print(f'{dest.name}: {len(html) // 1024} KB')
