#!/usr/bin/env python3
"""
More Evidence: the You Do game, Family Tree (8I). Drill rounds, on devices, one self-contained
HTML file. The source is build/more-evidence-game.html: every question is generated from a
template with random structures, embryo scores, DNA numbers and trees, from a game code that is
different for each student (see the comment in the file). This script copies it to the lesson
folder and checks it makes no external request and stores nothing.

Test it with build/test-more-evidence-game.js and build/check-more-evidence-game.py (sympy over 300 games).

    python3 build/more-evidence-game.py
"""
import pathlib, re
HERE = pathlib.Path(__file__).parent
OUT = HERE.parent / 'out' / 'More Evidence'
OUT.mkdir(parents=True, exist_ok=True)
html = (HERE / 'more-evidence-game.html').read_text(encoding='utf-8')
assert not re.search(r'https?://', html), 'external reference in the game'
assert 'localStorage' not in html and 'sessionStorage' not in html, 'the game must not store anything'
dest = OUT / 'More Evidence game.html'
dest.write_text(html, encoding='utf-8')
print(f'{dest.name}: {len(html) // 1024} KB')
