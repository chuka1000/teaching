import sys, zipfile, re
z = zipfile.ZipFile(sys.argv[1])
slides = sorted([n for n in z.namelist() if re.match(r'ppt/slides/slide\d+\.xml$', n)],
                key=lambda s: int(re.findall(r'\d+', s)[0]))
mp4 = [n for n in z.namelist() if n.endswith('.mp4')]
print(f'{len(mp4)} timer clips embedded, {len(slides)} slides')
assert len(mp4) == len(slides), 'A SLIDE HAS NO TIMER'
for n in slides:
    x = z.read(n).decode()
    t = re.search(r'<p:timing>.*?</p:timing>', x, re.S)
    assert t, f'{n}: no <p:timing> — did you run animate.js?'
    t = t.group(0)
    assert '<p:video>' in t, f'{n}: no <p:video> — did you run autoplay-media.js?'
    assert t.find('<p:video>') > t.find('</p:seq>'), \
        f'{n}: <p:video> is INSIDE the click sequence; the first click will kill the timer'
    ids = re.findall(r'<p:cTn id="(\d+)"', t)
    assert len(ids) == len(set(ids)), f'{n}: duplicate cTn id'
print('timers OK: one per slide, autoplaying, outside the click sequence')
