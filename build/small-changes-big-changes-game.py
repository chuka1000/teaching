#!/usr/bin/env python3
"""
Small Changes, Big Changes: the You Do game, the Sorter (8I). Two bins, microevolution or macroevolution, on devices, one
self-contained HTML file. The source is build/small-changes-big-changes-game.html: every game is generated from a
six-character code that is different for each student (see the comment in the file). This script copies it to the
lesson folder and checks it makes no external request and stores nothing.

Test it with build/test-small-changes-big-changes-game.js and build/check-small-changes-big-changes-game.py (300 games).

    python3 build/small-changes-big-changes-game.py
"""
import pathlib, re
HERE = pathlib.Path(__file__).parent
OUT = HERE.parent / 'out' / 'Small Changes, Big Changes'
OUT.mkdir(parents=True, exist_ok=True)
html = (HERE / 'small-changes-big-changes-game.html').read_text(encoding='utf-8')
assert not re.search(r'https?://', html), 'external reference in the game'
assert 'localStorage' not in html and 'sessionStorage' not in html, 'the game must not store anything'
dest = OUT / 'Small Changes, Big Changes game.html'
dest.write_text(html, encoding='utf-8')
print(f'{dest.name}: {len(html) // 1024} KB')
