#!/usr/bin/env python3
"""
BIDMAS: a standalone order-of-operations game for 8CN. Drill rounds, on devices, one
self-contained HTML file. The source is build/bidmas-game.html: every question is built from a
template with random numbers, from a game code that is different for each student (see the
comment in the file). This script copies it to the game folder and checks it makes no external
request and stores nothing.

Test it with build/test-bidmas-game.js and build/check-bidmas-game.py (sympy over 300 games).

    python3 build/bidmas-game.py
"""
import pathlib, re
HERE = pathlib.Path(__file__).parent
OUT = HERE.parent / 'out' / 'BIDMAS'
OUT.mkdir(parents=True, exist_ok=True)
html = (HERE / 'bidmas-game.html').read_text(encoding='utf-8')
assert not re.search(r'https?://', html.replace('http://www.w3.org', '')), 'external reference in the game'
assert 'localStorage' not in html and 'sessionStorage' not in html, 'the game must not store anything'
dest = OUT / 'BIDMAS game.html'
dest.write_text(html, encoding='utf-8')
print(f'{dest.name}: {len(html) // 1024} KB')
