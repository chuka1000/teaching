#!/usr/bin/env python3
"""
Shuffling The Gene Pool: the You Do game, Pairs (8I). Match each scenario to its force (mutation, gene flow, natural selection,
genetic drift), on devices, one self-contained HTML file. The source is build/shuffling-the-gene-pool-game.html: every game is
generated from a six-character code that is different for each student (see the comment in the file). This script copies it to the
lesson folder and checks it makes no external request and stores nothing.

Test it with build/test-shuffling-the-gene-pool-game.js and build/check-shuffling-the-gene-pool-game.py (300 games).

    python3 build/shuffling-the-gene-pool-game.py
"""
import pathlib, re
HERE = pathlib.Path(__file__).parent
OUT = HERE.parent / 'out' / 'Shuffling The Gene Pool'
OUT.mkdir(parents=True, exist_ok=True)
html = (HERE / 'shuffling-the-gene-pool-game.html').read_text(encoding='utf-8')
assert not re.search(r'https?://', html), 'external reference in the game'
assert 'localStorage' not in html and 'sessionStorage' not in html, 'the game must not store anything'
dest = OUT / 'Shuffling The Gene Pool game.html'
dest.write_text(html, encoding='utf-8')
print(f'{dest.name}: {len(html) // 1024} KB')
