#!/usr/bin/env python3
"""Make a QA copy of a deck with show="0" stripped, so slide 1 renders.

Written as a script rather than an inline one-liner because the obvious
one-liner is wrong:

    open(p, 'w').write(open(p).read().replace(...))

Python evaluates open(p, 'w') first, which truncates the file, so the inner
read returns an empty string and the slide is silently blanked. That cost a
round of visual QA.
"""
import os
import shutil
import sys
import tempfile
import zipfile

if len(sys.argv) != 3:
    sys.exit("usage: make-preview.py <deck.pptx> <preview.pptx>")

src, dst = sys.argv[1], sys.argv[2]
work = tempfile.mkdtemp()
with zipfile.ZipFile(src) as z:
    z.extractall(work)

slide1 = os.path.join(work, "ppt/slides/slide1.xml")
with open(slide1, encoding="utf-8") as fh:
    xml = fh.read()
if not xml.strip():
    sys.exit("refusing to continue: slide1.xml is empty in the source deck")
stripped = xml.replace(' show="0"', "")
with open(slide1, "w", encoding="utf-8") as fh:
    fh.write(stripped)

with zipfile.ZipFile(dst, "w", zipfile.ZIP_DEFLATED) as zo:
    for root, _, files in os.walk(work):
        for f in files:
            full = os.path.join(root, f)
            zo.write(full, os.path.relpath(full, work))

# prove it worked rather than assuming
with zipfile.ZipFile(dst) as z:
    out = z.read("ppt/slides/slide1.xml").decode("utf-8")
assert out.strip(), "preview slide1 came out empty"
assert 'show="0"' not in out, "show=0 still present"
print("preview: %s  (slide1 %d bytes, %d shapes, un-hidden)"
      % (dst, len(out), out.count("<p:sp>")))
