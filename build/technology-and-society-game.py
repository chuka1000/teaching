#!/usr/bin/env python3
"""
Technology And Society: the You Do game (7B), a scaffolded design task. One self-contained HTML
file. The source is build/technology-and-society-game.html; the design briefs, rules and
technology-and-society items are build/technology-and-society.data.json, injected here so there is
ONE copy of them (the worksheet reads the same file). Checks the result makes no external request
and stores nothing.

Test it with build/test-technology-and-society-game.js and
build/check-technology-and-society-game.py.

    python3 build/technology-and-society-game.py
"""
import json, pathlib, re
HERE = pathlib.Path(__file__).parent
OUT = HERE.parent / 'out' / 'Technology And Society'
OUT.mkdir(parents=True, exist_ok=True)
src = (HERE / 'technology-and-society-game.html').read_text(encoding='utf-8')
data = json.load((HERE / 'technology-and-society.data.json').open(encoding='utf-8'))
data.pop('note', None)
assert src.count('/*DATA_JSON*/null') == 1, 'placeholder missing'
html = src.replace('/*DATA_JSON*/null', json.dumps(data, ensure_ascii=False))
assert not re.search(r'https?://', html.replace('http://www.w3.org', '')), 'external reference in the game'
assert 'localStorage' not in html and 'sessionStorage' not in html, 'the game must not store anything'
dest = OUT / 'Technology And Society game.html'
dest.write_text(html, encoding='utf-8')
print(f'{dest.name}: {len(html) // 1024} KB')
