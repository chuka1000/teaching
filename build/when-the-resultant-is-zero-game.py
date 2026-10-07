#!/usr/bin/env python3
"""Copy the game source to the lesson's output folder, under the name the deck's slide uses."""
import pathlib, shutil
ROOT = pathlib.Path(__file__).resolve().parent.parent
dest = ROOT / 'out' / 'When The Resultant Is Zero'
dest.mkdir(parents=True, exist_ok=True)
shutil.copyfile(ROOT / 'build' / 'when-the-resultant-is-zero-game.html', dest / 'When The Resultant Is Zero game.html')
print('When The Resultant Is Zero game.html:', (dest / 'When The Resultant Is Zero game.html').stat().st_size // 1024, 'KB')
