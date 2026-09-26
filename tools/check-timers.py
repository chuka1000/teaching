import sys, zipfile, re

EMU = 914400
TIMER_MAX_W = 0.60 * EMU        # the phase timer bar is 0.50 in wide, at the left edge
TIMER_MAX_X = 0.60 * EMU

z = zipfile.ZipFile(sys.argv[1])
slides = sorted([n for n in z.namelist() if re.match(r'ppt/slides/slide\d+\.xml$', n)],
                key=lambda s: int(re.findall(r'\d+', s)[0]))
mp4 = [n for n in z.namelist() if n.endswith('.mp4')]

timers_total = content_total = click_total = 0
for n in slides:
    x = z.read(n).decode()
    t = re.search(r'<p:timing>.*?</p:timing>', x, re.S)
    assert t, f'{n}: no <p:timing> — did you run animate.js?'
    t = t.group(0)

    # every video on the slide, split into the phase timer and content video
    pics = [p for p in re.findall(r'<p:pic>.*?</p:pic>', x, re.S) if 'a:videoFile' in p]
    timer_pics, content_pics = [], []
    for p in pics:
        spid = re.search(r'<p:cNvPr id="(\d+)"', p).group(1)
        off = re.search(r'<a:off x="(\d+)"', p)
        ext = re.search(r'<a:ext cx="(\d+)"', p)
        is_timer = off and ext and int(off.group(1)) < TIMER_MAX_X and int(ext.group(1)) <= TIMER_MAX_W
        (timer_pics if is_timer else content_pics).append(spid)
    assert len(timer_pics) == 1, f'{n}: {len(timer_pics)} phase timers (need exactly one)'

    # the phase timer autoplays, outside the click sequence. A content video either autoplays too,
    # or is started ON CLICK by a media call inside the click sequence (lib/animate.js, effect "play").
    nodes = re.findall(r'<p:video>.*?</p:video>', t, re.S)
    auto = set(re.findall(r'<p:spTgt spid="(\d+)"', ''.join(nodes)))
    seq_end = t.find('</p:seq>')
    clicks = re.findall(r'<p:cmd type="call" cmd="playFrom[^"]*"><p:cBhvr>.*?<p:spTgt spid="(\d+)"', t, re.S)
    assert set(timer_pics) <= auto, f'{n}: the phase timer has no autoplay node — did you run autoplay-media.js after animate.js?'
    for spid in content_pics:
        assert (spid in auto) != (spid in clicks), f'{n}: content video {spid} must either autoplay or play on click, and not both'
    assert auto <= set(timer_pics + content_pics), f'{n}: an autoplay node targets the wrong shape'
    if nodes: assert t.find('<p:video>') > seq_end, f'{n}: <p:video> is INSIDE the click sequence; the first click will kill the timer'
    for m in re.finditer(r'<p:cmd type="call" cmd="playFrom', t): assert m.start() < seq_end, f'{n}: a click-to-play command is outside the click sequence'
    click_total += len(clicks)
    ids = re.findall(r'<p:cTn id="(\d+)"', t)
    assert len(ids) == len(set(ids)), f'{n}: duplicate cTn id'
    timers_total += len(timer_pics); content_total += len(content_pics)

print(f'{len(slides)} slides, {timers_total} phase timers, {content_total} content videos ({click_total} start on click), {len(mp4)} mp4 files embedded')
print('timers OK: one per slide, autoplaying outside the click sequence; content videos autoplay or play on click')
