#!/usr/bin/env python3
"""
A Warming Planet: the You Do game, the Sorter (Y9). Three bins, Ozone depletion, Climate change or Air pollution, on devices, one self-contained HTML
file. The source is build/a-warming-planet-game.html; it carries no item text of its own. This script writes
build/a-warming-planet.bank.json into it (at /*DATA*/null/*END*/) as it copies it to the lesson folder, so the game and the
lesson share ONE copy of every item, answer, reason and named mistake. It also checks the game makes no external request and stores nothing.

Every game is generated from a six-character code that is different for each student (see the comment in the file).

Test it with build/test-a-warming-planet-game.js (Playwright, both viewports; it dumps 300 games) and
build/check-a-warming-planet-game.py (re-derives the draw, the answers and the named mistakes from the bank).

    python3 build/a-warming-planet-game.py
"""
import json, pathlib, re
HERE = pathlib.Path(__file__).parent
OUT = HERE.parent / 'out' / 'A Warming Planet'
OUT.mkdir(parents=True, exist_ok=True)
data = json.loads((HERE / 'a-warming-planet.bank.json').read_text(encoding='utf-8'))
data.pop('_comment', None)
html = (HERE / 'a-warming-planet-game.html').read_text(encoding='utf-8')
assert html.count('/*DATA*/null/*END*/') == 1, 'the data placeholder is missing or doubled'
# '</' would end the script block early, and U+2028 / U+2029 are line breaks in older JavaScript: neither is in the bank, but guard anyway
payload = json.dumps(data, ensure_ascii=False).replace('</', '<\\/').replace('\u2028', '\\u2028').replace('\u2029', '\\u2029')
html = html.replace('/*DATA*/null/*END*/', payload)
assert not re.search(r'https?://', html), 'external reference in the game'
assert 'localStorage' not in html and 'sessionStorage' not in html, 'the game must not store anything'
assert '\u2014' not in html, 'an em dash in the game'
dest = OUT / 'A Warming Planet game.html'
dest.write_text(html, encoding='utf-8')
print(f'{dest.name}: {len(html) // 1024} KB')
