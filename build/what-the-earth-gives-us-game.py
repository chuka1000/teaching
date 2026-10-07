#!/usr/bin/env python3
"""
What The Earth Gives Us: the You Do game, What's Wrong With This? (9G and 9I). Drill rounds, on devices,
one self-contained HTML file. The source is build/what-the-earth-gives-us-game.html: every
question is a claim about a resource, judged against a fixed menu of named errors, from a game
code that is different for each student (see the comment in the file). This script copies it to
the lesson folder and checks it makes no external request and stores nothing.

Test it with build/test-what-the-earth-gives-us-game.js and
build/check-what-the-earth-gives-us-game.py (sympy over 300 games).

    python3 build/what-the-earth-gives-us-game.py
"""
import pathlib, re
HERE = pathlib.Path(__file__).parent
OUT = HERE.parent / 'out' / 'What The Earth Gives Us'
OUT.mkdir(parents=True, exist_ok=True)
html = (HERE / 'what-the-earth-gives-us-game.html').read_text(encoding='utf-8')
assert not re.search(r'https?://', html), 'external reference in the game'
assert 'localStorage' not in html and 'sessionStorage' not in html, 'the game must not store anything'
dest = OUT / 'What The Earth Gives Us game.html'
dest.write_text(html, encoding='utf-8')
print(f'{dest.name}: {len(html) // 1024} KB')
