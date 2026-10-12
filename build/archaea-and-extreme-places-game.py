#!/usr/bin/env python3
"""
Archaea And Extreme Places: the You Do game, the Sorter (8I). Three bins, Bacterium, Archaean or Neither, on devices, one self-contained HTML
file. The source is build/archaea-and-extreme-places-game.html; it carries no item text of its own. This script writes
build/archaea-and-extreme-places.bank.json into it (at /*DATA*/null/*END*/) as it copies it to the lesson folder, so the game and the
lesson share ONE copy of every item, answer, reason and named mistake. It also checks the game makes no external request and stores nothing.

Every game is generated from a six-character code that is different for each student (see the comment in the file).

Test it with build/test-archaea-and-extreme-places-game.js (Playwright, both viewports; it dumps 300 games) and
build/check-archaea-and-extreme-places-game.py (re-derives the draw, the answers and the named mistakes from the bank).

    python3 build/archaea-and-extreme-places-game.py
"""
import json, pathlib, re
HERE = pathlib.Path(__file__).parent
OUT = HERE.parent / 'out' / 'Archaea And Extreme Places'
OUT.mkdir(parents=True, exist_ok=True)
data = json.loads((HERE / 'archaea-and-extreme-places.bank.json').read_text(encoding='utf-8'))
data.pop('_comment', None)
html = (HERE / 'archaea-and-extreme-places-game.html').read_text(encoding='utf-8')
assert html.count('/*DATA*/null/*END*/') == 1, 'the data placeholder is missing or doubled'
# '</' would end the script block early, and U+2028 / U+2029 are line breaks in older JavaScript: neither is in the bank, but guard anyway
payload = json.dumps(data, ensure_ascii=False).replace('</', '<\\/').replace('\u2028', '\\u2028').replace('\u2029', '\\u2029')
html = html.replace('/*DATA*/null/*END*/', payload)
assert not re.search(r'https?://', html), 'external reference in the game'
assert 'localStorage' not in html and 'sessionStorage' not in html, 'the game must not store anything'
assert '\u2014' not in html, 'an em dash in the game'
dest = OUT / 'Archaea And Extreme Places game.html'
dest.write_text(html, encoding='utf-8')
print(f'{dest.name}: {len(html) // 1024} KB')
