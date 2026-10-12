#!/usr/bin/env python3
"""
Pathogens And Antibiotics: the You Do game, True Or False Blitz (8I). A True or false blitz, on devices, one self-contained HTML file. The
source is build/pathogens-and-antibiotics-game.html; it carries no statement text of its own. This script writes
build/pathogens-and-antibiotics.bank.json into it (at /*DATA*/null/*END*/) as it copies it to the lesson folder, so the game and the bank
share ONE copy of every statement. It also checks the game makes no external request and stores nothing.

Test it with build/test-pathogens-and-antibiotics-game.js (Playwright, both viewports; it dumps 300 games) and
build/check-pathogens-and-antibiotics-game.py (re-derives the round sizes, the 10 true and 10 false, that no game draws both slots of a
conflicting pair from the bank's "conflicts" list, and every statement from the bank).

    python3 build/pathogens-and-antibiotics-game.py
"""
import json, pathlib, re
HERE = pathlib.Path(__file__).parent
OUT = HERE.parent / 'out' / 'Pathogens And Antibiotics'
OUT.mkdir(parents=True, exist_ok=True)
data = json.loads((HERE / 'pathogens-and-antibiotics.bank.json').read_text(encoding='utf-8'))
data.pop('_comment', None)
assert data['draw'] == [7, 7, 6] and len(data['rounds']) == 3, 'the bank must draw 7, 7 and 6 statements from 3 rounds'
ids = {s['id'] for rd in data['rounds'] for s in rd['slots']}
assert all(len(p) == 2 and p[0] != p[1] and set(p) <= ids for p in data.get('conflicts', [])), 'every conflict must be a pair of two different slot ids in the bank'
html = (HERE / 'pathogens-and-antibiotics-game.html').read_text(encoding='utf-8')
assert html.count('/*DATA*/null/*END*/') == 1, 'the data placeholder is missing or doubled'
html = html.replace('/*DATA*/null/*END*/', json.dumps(data, ensure_ascii=False))
assert not re.search(r'https?://', html), 'external reference in the game'
assert 'localStorage' not in html and 'sessionStorage' not in html, 'the game must not store anything'
assert '—' not in html, 'an em dash in the game'
dest = OUT / 'Pathogens And Antibiotics game.html'
dest.write_text(html, encoding='utf-8')
print(f'{dest.name}: {len(html) // 1024} KB')
