# reference/

**Deployed lessons. Chuka has taught these, and edited them after teaching.**

These files are more authoritative than anything in `examples/` or `out/`.
`examples/` shows how the code works. This folder shows what actually went in
front of a class.

## The rule

**Before planning any lesson that follows another, open the previous lesson's
file and read it.** Never infer what a previous lesson covered, how long it
ran, or which words it introduced.

This is not a style preference. It has already caused a real error: a lesson
plan was built assuming the previous lesson ran 48 minutes with a generic
phase structure, when the actual deck ran 50 minutes with three phases the
generic structure does not contain. Every timing after that point was wrong.

## How to read one

```bash
python3 - <<'PY'
import zipfile, re
z = zipfile.ZipFile('reference/<file>.pptx')
n = sorted([x for x in z.namelist() if re.match(r'ppt/slides/slide\d+\.xml$', x)],
           key=lambda s: int(re.findall(r'\d+', s)[0]))
for i, f in enumerate(n, 1):
    ts = re.findall(r'<a:t>([^<]*)</a:t>', z.read(f).decode())
    pill = next((t for t in ts if re.match(r'^[A-Z ]+ · \d+ MIN$', t.strip())), '')
    title = next((t for t in ts if len(t) > 6 and t != pill), '')
    print(f'{i:3d}  {pill:22s}  {title[:60]}')
PY
```

That gives you the phase structure and the real runtime. Add up the pills.

For speaker notes, read `ppt/notesSlides/notesSlide*.xml`. They carry the
misconceptions, the things to say, and the "cut this first if you are behind"
markers — all of which matter when planning the next lesson.

## What to check before building a follow-on lesson

- **Total runtime** from the phase pills. Do not assume 50.
- **Which vocabulary was introduced**, and which was only mentioned.
- **What the plenary pointed forward to** — that is the promise the next lesson
  has to keep.
- **Any open decision flagged in the speaker notes.**
- **Whether the deck predates a current convention.** Older files may contain a
  hidden teacher slide or a credits slide; those are no longer used.
