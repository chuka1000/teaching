#!/usr/bin/env python3
"""
Earth Resources revision: the one-hour test-preparation game (Y9, 9G and 9I), on devices, one self-contained HTML file.
The source is build/earth-resources-game.html; the question bank is build/earth-resources.bank.json (written by build/earth-resources-bank.py) and is
written into the file here. Every student gets a different game from a six-character game code (see the comment in the game). This script checks the
result makes no external request and stores nothing.

Test it with build/test-earth-resources-game.js and build/check-earth-resources-game.py (sympy over 300 games).

    python3 build/earth-resources-bank.py
    python3 build/earth-resources-game.py
"""
import json, pathlib, re
HERE = pathlib.Path(__file__).parent
OUT = HERE.parent / 'out' / 'Earth Resources Revision'
OUT.mkdir(parents=True, exist_ok=True)
html = (HERE / 'earth-resources-game.html').read_text(encoding='utf-8')
bank = (HERE / 'earth-resources.bank.json').read_text(encoding='utf-8')
assert html.count('/*DATA*/null/*END*/') == 1, 'the game needs exactly one data slot'
data = json.dumps(json.loads(bank), ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
html = html.replace('/*DATA*/null/*END*/', data)
assert not re.search(r'https?://', html), 'external reference in the game'
assert 'localStorage' not in html and 'sessionStorage' not in html, 'the game must not store anything'
assert '—' not in html, 'em dash in the game'
dest = OUT / 'Earth Resources Revision game.html'
dest.write_text(html, encoding='utf-8')
print(f'{dest.name}: {len(html) // 1024} KB')
