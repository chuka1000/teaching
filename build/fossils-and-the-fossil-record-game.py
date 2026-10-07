#!/usr/bin/env python3
"""
Fossils And The Fossil Record: the You Do game, Dig Site (8I). Drill rounds, on devices, one
self-contained HTML file. The source is build/fossils-and-the-fossil-record-game.html: every
question is generated from a template with random organisms, rock layers and numbers, from a
game code that is different for each student (see the comment in the file). This script copies
it to the lesson folder and checks it makes no external request and stores nothing.

Test it with build/test-fossils-game.js and build/check-fossils-game.py (sympy over 300 games).

    python3 build/fossils-and-the-fossil-record-game.py
"""
import pathlib, re
HERE = pathlib.Path(__file__).parent
OUT = HERE.parent / 'out' / 'Fossils And The Fossil Record'
OUT.mkdir(parents=True, exist_ok=True)
html = (HERE / 'fossils-and-the-fossil-record-game.html').read_text(encoding='utf-8')
assert not re.search(r'https?://', html), 'external reference in the game'
assert 'localStorage' not in html and 'sessionStorage' not in html, 'the game must not store anything'
dest = OUT / 'Fossils And The Fossil Record game.html'
dest.write_text(html, encoding='utf-8')
print(f'{dest.name}: {len(html) // 1024} KB')
