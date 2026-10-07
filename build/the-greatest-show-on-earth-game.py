#!/usr/bin/env python3
"""
The Greatest Show On Earth: the You Do game, Speciation Sequencer (8I). Sequencer, on devices, one self-contained HTML file. The source is
build/the-greatest-show-on-earth-game.html: every question is generated from a template with a different example of the same process, different
cards that do not belong and shuffled cards and options, from a game code that is different for each student (see the comment in the file). This
script copies it to the lesson folder and checks it makes no external request and stores nothing.

Test it with build/test-the-greatest-show-on-earth-game.js (Playwright, both viewports; it dumps 300 games) and
build/check-the-greatest-show-on-earth-game.py (re-derives every answer from the data each question keeps).

    python3 build/the-greatest-show-on-earth-game.py
"""
import pathlib, re
HERE = pathlib.Path(__file__).parent
OUT = HERE.parent / 'out' / 'The Greatest Show On Earth'
OUT.mkdir(parents=True, exist_ok=True)
html = (HERE / 'the-greatest-show-on-earth-game.html').read_text(encoding='utf-8')
assert not re.search(r'https?://', html), 'external reference in the game'
assert 'localStorage' not in html and 'sessionStorage' not in html, 'the game must not store anything'
dest = OUT / 'The Greatest Show On Earth game.html'
dest.write_text(html, encoding='utf-8')
print(f'{dest.name}: {len(html) // 1024} KB')
