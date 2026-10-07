#!/usr/bin/env python3
"""
Deep Time: the You Do game, Place It In Time (8I). A Number line, on devices, one self-contained HTML file. The source is
build/deep-time-game.html; it carries no dates of its own. This script writes build/deep-time.data.json into it (at /*DATA*/null/*END*/) as it
copies it to the lesson folder, so the game, the deck and the worksheet share ONE copy of every date. It also checks the game makes no external
request and stores nothing.

Test it with build/test-deep-time-game.js (Playwright, both viewports; it dumps 300 games) and build/check-deep-time-game.py (re-derives every
answer, band and named mistake from the data).

    python3 build/deep-time-game.py
"""
import json, pathlib, re
HERE = pathlib.Path(__file__).parent
OUT = HERE.parent / 'out' / 'Deep Time'
OUT.mkdir(parents=True, exist_ok=True)
data = json.loads((HERE / 'deep-time.data.json').read_text(encoding='utf-8'))
data.pop('_comment', None)
html = (HERE / 'deep-time-game.html').read_text(encoding='utf-8')
assert html.count('/*DATA*/null/*END*/') == 1, 'the data placeholder is missing or doubled'
html = html.replace('/*DATA*/null/*END*/', json.dumps(data, ensure_ascii=False))
assert not re.search(r'https?://', html), 'external reference in the game'
assert 'localStorage' not in html and 'sessionStorage' not in html, 'the game must not store anything'
dest = OUT / 'Deep Time game.html'
dest.write_text(html, encoding='utf-8')
print(f'{dest.name}: {len(html) // 1024} KB')
