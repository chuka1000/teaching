# Lesson Toolkit

Builds 50-minute lesson decks and worksheets for Chuka, a science and maths
teacher at a British international school. Years 7–11 Science and Maths.

**This is a working system, not a starting point.** It has produced about a
dozen lessons. Most of what looks like an arbitrary choice below is a bug that
was found the hard way. Read the "Things that will bite you" section before
changing anything in `lib/`.

---

## Work out what you can't do before you start, not after

- **Before building, say what you are going to produce.** If something cannot be
  done (a missing file, an unresolvable fact, a dependency that is not there), say
  so then and stop. A question before costs one message; a half-built lesson costs a
  rebuild.
- **Never ship a deck that references a file that does not exist.** A slide pointing
  at a missing game is broken, not incomplete. (`tools/check-builds.py` fails the
  build if a slide names "<Lesson> game" and the file is not there.)
- **If a spec file you need is absent, stop and ask.** Do not fall back to an older
  shape: that produces work that has to be redone.
- **Verification scripts are part of the build, not an extra.** If numbers go in a
  deck, the script that checked them is in the repo (`build/<slug>-check.py`) and has
  been run. "Checked by hand" is not checked.

This is not about hiding uncertainty. Keep flagging what genuinely cannot be
resolved (which of two classes, a lesson number that is not written down). The rule
is about not deferring work you could have done, or asked about, first.

---

## Before you build anything

Work through this every time. Skipping it is how errors get made.

1. **Which class?** `7B` `8I` `8CN` `9G` `9I` `10A` `T3` — see `TIMETABLE.md`.
   `9G` and `9I` are always at the same point, so they are one group, **Y9**:
   one deck serves both, and "Year 9" without a code needs no question.
2. **Which track?** Science, Maths or CLIL. They are genuinely different builds
   — see "The three tracks" below.
3. **Is it a single or a double?** Four slots a fortnight are 100-minute
   doubles. Check `TIMETABLE.md`. A double is **not** two 50-minute decks.
4. **Does a previous lesson exist?** Before building, consult
   `reference/INDEX.md` to find what came before for this class, then **open
   that deck and read it** — runtime, phases, vocabulary introduced, what the
   plenary promised. **Never infer any of that.** The index is built from
   `reference/MANIFEST.tsv`, which every build writes itself into (see "Build a
   lesson"); regenerate it with `python3 tools/index-reference.py` after a deck
   is added to `reference/`. **Only ask Chuka for a `PREVIOUS:` line if the index
   cannot resolve it** (a class, unit or lesson number it has no row for). See
   `reference/README.md`.
5. **For `T3`, read `CLIL.md`** before planning. The archetype does not apply.

If any of 1–5 is unclear, ask. One question costs less than a rebuilt lesson.

Chuka may write the request as prose or using the template in
`LESSON-REQUEST.md`. Either is fine — the checklist above is what you need out
of it, however it arrives.

---

## The three tracks

| Track | Classes | Canvas | Palette | Structure |
|---|---|---|---|---|
| **Science** | `7B` `8I` `9G` `9I` `10A` | 13.333 × 7.5 | per unit | The 10-phase archetype |
| **Maths** | `8CN` | **10 × 5.625** | Number Revision navy/coral | The 10-phase archetype |
| **CLIL** | `T3` | 13.333 × 7.5 | per unit | **`CLIL.md` — different shape entirely** |

Maths decks use a smaller canvas to match the school's existing Number Revision
deck. See `examples/maths-deck-10x5.625.js`. **Every numeric answer in a maths
deck and its worksheet must be checked with sympy before it is written into
either file, and the two must agree.** `build/putting-numbers-in-check.py` is a
worked example: one sympy script that checks every number, then writes the
game's question bank.

Maths timer geometry (canvas 10 wide): `x 0.20, w 0.34, y 0.20, h H − 0.40`,
content margin `M = 0.85`. Palette `maths` (Number Revision) is in
`lib/theme.js` and `lib/docparts.js`. Its coral is a shade lighter than the
school deck's so navy text on it passes contrast.

---

## Build a lesson

```bash
node build/<lesson-slug>.js          # writes out/<Lesson Name>/<Lesson Name>.pptx
node spec/<lesson-slug>-spec.js
node lib/animate.js spec/<lesson-slug>.anim.json
node lib/autoplay-media.js "out/<Lesson Name>/<Lesson Name>.pptx"
node tools/validate.js "out/<Lesson Name>/<Lesson Name>.pptx"
```

Order matters. `animate.js` writes `<p:timing>`; `autoplay-media.js` merges
into it. Run autoplay **after** animate, never before.

**Never run `build/<slug>.js` on its own once a deck exists.** That script writes
the RAW deck: no click builds, no slide transitions, no timer autoplay. Only
`node tools/build-lesson.js <slug>` adds them. Re-running the raw builder "just to
see the phase minutes" once silently stripped every reveal from a deck that was
then sent, and the Do Now answers all appeared at once. `lib/guard-raw-write.js`
now makes a raw builder refuse to overwrite an animated deck, and `build-lesson.js`
prints the phase minutes itself, so there is never a reason to. Chuka should not
have to add a single reveal by hand.

**Always set `dc:title` and `dc:subject` on a new deck** (`pptx.title` and
`pptx.subject` in pptxgenjs), with the class code in the subject. The title is
the lesson name. The subject is
`<Year> <Subject> · <Unit> · Lesson <N> · <class code>`, for example
`Y8 Maths · Algebra · Lesson 5 · 8CN` or
`Y9 Science · Ecosystems · Lesson 2 · 9G and 9I`. `tools/build-lesson.js` reads
that subject from the freshly built deck and records class, unit and lesson in
`reference/MANIFEST.tsv` through `tools/record-lesson.py`, so the index never has
to recover it from a re-saved file. A build whose class cannot be worked out
stops; a missing unit or lesson number only warns (pass `--unit` and `--lesson`
to `build-lesson.js` to set them). Y9 builds are recorded as class `Y9`.

`node tools/build-lesson.js <lesson-slug>` runs the build, spec, animate,
autoplay and validate steps in that order, then renders the deck to PDF and
PNG in `_check/`. It builds the deck only; the worksheet has its own script.

Then **look at it**. Convert to PDF, render to PNG, and open the images.
LibreOffice renders things Keynote refuses — a clean PDF is not proof.

### Output layout

**One folder per lesson, named after the lesson.** Everything Chuka opens sits
at the top of it; everything generated for checking goes in `_check/`.

```
out/
  Motion Graphs/
    Motion Graphs.pptx
    Motion Graphs worksheet.docx
    _check/                    <- PDFs and PNGs. Build artefacts, not deliverables.
```

The PDFs and PNGs exist **only** so you can look at the output before handing it
over. Chuka does not want them. Put them in `_check/` and do not mention them —
but do not skip making them either, because looking at the render is the step
that catches the errors a validator cannot.

Delete `_check/` at the end of a build if the lesson passed. Keep it if
something looked wrong and you want to show Chuka the evidence.

---

## Definition of done

A lesson is not finished until all of these pass. Run them; do not assume.

```bash
L="out/<Lesson Name>/<Lesson Name>.pptx"

# 1. Structure and speaker notes
node tools/validate.js "$L"

# 2. Timer present on every slide, and outside the click sequence
python3 tools/check-timers.py "$L"

# 2b. Every click build and transition in the spec is really in the deck.
#     Run this on the exact file you are about to send, as the LAST command
#     before sending. A deck with no builds looks fine in a render.
python3 tools/check-builds.py "$L"

# 3. Phase minutes total 50 (single) or 95 (double)
#    build-lesson.js prints this. Check it.

# 4. Render and LOOK at every slide

# 5. Palette contrast — only when a palette is new or its values changed,
#    not on every lesson build
node tools/check-contrast.js <palette-name>
```

If check 2 fails, the deck will *look* fine and the timer will not run. It is
the failure mode that hides.

If check 5 fails, the deck will *look* fine too — right up until someone
tries to read the card numbers. See "The palette" below for the accent /
accentInk split this check enforces.

---

## The lesson archetype

**The spec is `TEMPLATE.md`**: ten slides, You Do 14, Mark 3, 50 minutes, and what
goes inside each phase. Read it before building any lesson. It is the only copy
of the slide table and the per-slide rules: do not restate them here, that is how
the two drifted apart before. `PEDAGOGY.md` is the reasoning behind it, and is
referenced from `TEMPLATE.md`; nothing else enforces it.

Exceptions: `T3` (see `CLIL.md`) and doubles (one deck of about 95 minutes with a
5-minute break slide, not two decks; ask Chuka how to split the time; see
`TIMETABLE.md`).

**Standing conventions that are NOT in `TEMPLATE.md` yet.** They still apply.
Move each into `TEMPLATE.md`, or delete it here, once it is decided:

- **Speaker notes on every slide**, written to the teacher (`tools/validate.js`
  checks). No hidden teacher slide.
- **Slide 2's title is "Objectives"** but its phase pill stays "TODAY · 1 MIN".
  **Banners are one full sentence with the key words underlined.**
- **The Hook slide has no "Vote!" line.** Say it in the notes (`TEMPLATE.md` wants
  the vote and the tally on the board; that is the teacher's, not a slide line).
- **Do Now:** each question's text sits on the same vertical centre as its number
  (`qGrid`). Before writing one, check every question against the last three Do Nows
  in `reference/` (or `out/`): the same fact three lessons running has happened.
- **Students have no mini whiteboards.** Never write an instruction that needs one.
- **The answers list lives in ONE module** (`build/<slug>-answers.js`), so the
  worksheet block and the speaker notes cannot disagree; `DP.answersBlock` renders it
  upside down at the foot of the last worksheet page.
- **A content video plays on click**, not when the slide opens (see "Media").

## Layout

Science decks: **13.333 × 7.5 in**. Maths decks: **10 × 5.625 in** (matches the
school's existing Number Revision deck — see `examples/maths-deck-*.js`).

All content is shifted right to clear the timer bar:

```js
const TIMER_X = 0.34, TIMER_W = 0.50, TIMER_Y = 0.34, TIMER_H = H - 0.68;
const M = 1.28;            // content left margin
const RIGHT = W - 0.60;    // content right edge
```

On-slide text is large — this is read from the back of a classroom. Titles 32–38,
questions 16–18, card body 15–16. The "DO NOW · 10 MIN" pill is the *smallest*
text on its slide.

---

## The palette

Each unit has one, in `lib/theme.js`'s `PALETTES`. Six roles: `dark`, `accent`,
`accentInk`, `support`, `alert`, `tint`, plus the derived `darkSoft`,
`tintDeep`, `ink`, `inkSoft`, `white`.

**`accent` vs `accentInk` — they are not interchangeable.** `accent` is
chosen to pop as a **fill**: a pill, a badge, a highlighted box. Several
accents sit close to white in luminance, so `accent` used as **text on a
light background** is often close to unreadable even though it looks fine as
a fill. `accentInk` is the same hue, darkened, for exactly that case:

- **`accent`** — fills, badges, and text *on a dark background* (a pill in
  dark mode, the Plenary FALSE label).
- **`accentInk`** — text *on a light background*: card numbers, section
  letters, Answers numbering.

Mixing these up is the easiest way to ship a deck where the numbers are
technically there but nobody can read them from the back of the room.

`tools/check-contrast.js` enforces the split — WCAG contrast for every
text/background role pair the toolkit actually uses, checked against every
palette. Run it when a palette is new or its values change (see "Definition
of done"). It is not part of every lesson build; palettes do not change that
often.

---

## The timer bar

**Every lesson has one. Science, Maths and CLIL alike.** A draining bar tells
the room how long is left without anyone saying anything, which matters most
for the group with the least English.

Use `lib/timer.js`. It derives the colours from the palette and renders any
clip that does not exist yet, so any palette and any duration just works:

```js
const { addTimer } = require('../lib/timer');
PHASES.push(addTimer(pptx, s, {
  key: 'nucleus', palette: C, minutes: 4, mode: 'light', slideH: H,
}));
```

`addTimer` returns the minutes, so collect them in `PHASES` and print the total
at the end of the build. It must come to **50** for a single and **95** for a
double (the other 5 is the break).

Clips cache in `assets/timers/` and are gitignored — reproducible, not worth
versioning. `node tools/make-timers.js` warms the cache but is optional.

**Never build a deck without a timer.** If ffmpeg is missing, `timer.js` throws
with instructions. Fix ffmpeg; do not carry on without the bar.

> **This was a real bug.** Clips used to be hand-rendered per palette, so any
> lesson using a palette nobody had generated for came out with no timer at all
> and nothing failed. Three of the five palettes were affected, including the
> CLIL one. That is why generation is automatic now.

---

## Things that will bite you

Each of these cost real time to find.

**1. A timer animation gets fast-forwarded by the first click.**
Anything inside `<p:seq nodeType="mainSeq">` is on the click timeline. Clicking
to reveal the next build *completes* any still-running animation in that
sequence — so a 10-minute drain snaps to empty instantly. `autoplay-media.js`
puts a `<p:video>` node **outside** `</p:seq>`, which is its own clock. This is
the only reliable way to run something for the whole phase.

**2. ffmpeg's `drawbox` evaluates its position once, at init.**
`drawbox=y='ih*t/60'` produces a bar that never moves, silently. This build has
no `eval=frame` option. Use two colour sources and an overlay instead:

```
[0][1]overlay=x=0:y='H*t/<secs>':shortest=1
```

**3. `ImageRun` in docx 9.x needs an explicit `type`.**
Without it the media part is written as `<hash>.undefined`. LibreOffice sniffs
the bytes and renders it anyway; **Word and Keynote show nothing**. A worksheet
full of invisible images passed a PDF check this way.

```js
new ImageRun({ type: 'png', data, transformation: { width, height } })
```

**4. `addMedia`'s `cover` must be a base64 data URI**, not a file path.
A path throws at build time.

**5. Staggered builds step at a flat 150 ms.** Never an increasing delay — it
makes the build feel like it is running down. See `beat()` in the spec examples.

**6. Row blocks need vertical centring.** Compute the block height and centre it
in the available area, or you get a dead band under the content.

**7. Check answers with sympy, not mentally.** Every numeric answer in a deck
and its worksheet must agree. Write a throwaway sympy script and run it before
the numbers go into either file. This has caught real errors.

---

## Writing style

Read `examples/` for tone. In short:

- Short, plain, direct sentences. Exclamation marks where there's genuine energy.
- No similes, no dry asides, no "every time", no "worth noting".
- British English.
- Icons or photographs next to nouns students may not recognise. Match the
  picture to the word — a water droplet labelled "bottle" is worse than nothing.
- Minimise Thailand-specific references; use global examples.
- Speaker notes are written *to the teacher* and can be rich: misconceptions,
  what to say, what will go wrong, what to cut if short of time.
- **Minimise the em dash.** It had crept into nearly every sentence — titles,
  notes, question text. Reach for a full stop, a comma, or just restructuring
  the sentence first.
- **Question stems lead with the instruction, not a bare statement.**
  "A 0.5 kg mass. Find its weight." is two choppy sentences. "Find the weight
  of a 0.5 kg mass." is one. This applies to Do Now, Cold Call, and worksheet
  questions alike.
- **The Gold tier's worksheet subtitle does not get alert-red styling.**
  Bronze and Silver's italic subtitles are neutral grey (`C.soft`); Gold's
  should match, not switch to `C.alert`. The red never earned its keep —
  flagged after it showed up unhelpfully across several worksheets running.

---

## Sequences

Most lessons follow another one. Units built so far:

- **Y7 Science, The World of Science** — 4 lessons, all built
- **Y9 Science, Ecosystems** — 4 lessons, all built (ends on Human Population Growth)
- **Y10 Science, Motion** — acceleration, motion graphs, equations of motion
- **Y10 Science, Forces** — Resultant Forces (all forces along one straight line, no angles; Net Force game; 'motion' palette).; When The Resultant Is Zero (Newton's first law; Zero Or Not game; zero resultant is not no forces)
- **Y8 Maths, Algebra** — collecting like terms, expanding brackets, expand and simplify, putting numbers in, function machines, from a table to a rule
- **Y8 Science, Natural Selection** — Natural Selection, How Darwin Got There, Natural Selection In Action, Fossils And The Fossil Record, More Evidence, Small Changes Big Changes, Shuffling The Gene Pool, The Greatest Show On Earth (speciation by geographic isolation; Sequencer game), Deep Time (the geologic time scale, eras, mass extinctions; Number line game; dates in build/deep-time.data.json) (Galapagos palette)
- **Y9 Science, Water** (Catchment palette) — Lesson 1 built (How Much Water Can We Actually Use, deployed as How Much Water Is Available), then Finite Freshwater (uses, groundwater used up, where and when; lesson number not written down); Lesson 4 is eutrophication, set up by the two jars at the end of Lesson 1
- **T3 CLIL, Atoms** — 5 lessons planned, only Lesson 1 built

Before building lesson N, read lesson N−1 from `reference/`. Take from it:

- the **actual runtime**, from the phase pills — never assume 50
- the **vocabulary and notation** already introduced, so you build on it rather
  than redefining it
- **what the plenary promised** — the next lesson has to keep that promise
- any **open decision** flagged in the speaker notes

Find lesson N−1 through `reference/INDEX.md` (see "Before you build anything").

**Building several lessons in one go.** Each later lesson's Do Now draws on the
earlier ones in the batch, even though they are not in `reference/` yet: open
their builds in `out/` (and the `build/` scripts) and treat them as the previous
lessons. That means the spaced-retrieval mix and the "do not repeat what the
class has just answered" check both include the lessons built earlier in the
same batch, along with their vocabulary and what each plenary promised.

Carry the palette and the visual conventions forward within a unit. A second
lesson in a unit should look like the first one.

---

## The syllabus

`10A` follows **Cambridge IGCSE Co-ordinated Sciences 0654**. The scheme of
work is the 0654 PDF in `curriculum/` (any filename containing "0654") — 198
pages.

**Never read it whole.** Use the index and the lookup tool:

```bash
python3 tools/syllabus.py P1.4            # one sub-topic
python3 tools/syllabus.py C1 --pages      # page range only
python3 tools/syllabus.py density         # free-text across the scheme
```

`curriculum/0654-INDEX.md` maps all 37 topics to page ranges and declared
teaching hours.

For every reference the scheme gives Cambridge's own wording of the learning
objective, plus suggested activities — named practicals, PhET simulations,
Resource Plus packs, and the misconceptions Cambridge expects. **Quote the
objective wording exactly**; it is what the exam is written against. Tag every
objective on the Objectives slide with its code.

Before building any `10A` lesson, pull the relevant section and read it. It
often names the exact misconception and the exact demonstration to use, which
is better than inventing one.

---

## Media — images and video

**Use real media, and use it often.** A photograph of the thing, or a short
animation of the process, does work that a bullet point cannot. Aim for
something visual on most content slides, not one image per deck.

**But every media item must do a job.** It should show something the words
cannot: a process moving, a scale, a real specimen, a piece of apparatus
nobody in the room has seen. Decoration is worse than nothing, because it
costs attention and teaches nothing.

### In order of preference

**1. Generate the animation yourself.** Best option for anything that moves or
changes — particle motion, a wave, a graph being drawn, a circuit filling,
orbital motion. Render frames with PIL, encode with ffmpeg. It is
copyright-clean, exactly on topic, and small: eight seconds at 960×540 costs
about 100 KB.

```bash
ffmpeg -y -framerate 20 -i frames/%04d.png \
  -c:v libx264 -pix_fmt yuv420p -crf 26 -preset veryslow out.mp4
```

Match the palette. Keep it 5–15 seconds, silent, and looping-friendly.

**2. Public-domain or CC video.** NASA and ESA footage is public domain;
Wikimedia Commons has good CC demonstration video. Convert to H.264 mp4 with
`-pix_fmt yuv420p` or PowerPoint will not play it.

**3. Real photographs.** Wikimedia Commons, filtered to CC or public domain.
Square-crop, then **look at the image** before using it — a "tree" that is a
dot on the horizon will not read at 20 mm.

**4. Icons.** Only where a photograph genuinely cannot show the thing — an
atom, or an abstract property like "tiny".

### Hard rules

- **Never download video from YouTube** or use copyrighted footage. Not for
  classroom use, not "just this once".
- **Never use pptxgenjs `type: 'online'`** YouTube embeds. They need live
  internet in the room and Keynote handles them badly.
- **No credits slide, and no attribution on the slides.** Nobody in the room
  needs it, and a source can be found with a reverse image search. Still use
  only public-domain or CC material, and never copyrighted footage; that is a
  question of what is allowed, not of what is shown.
- **A content video plays ON CLICK, not when the slide opens.** The teacher says the idea first.
  In the spec use `{ "target": "<the video's objectName>", "effect": "play" }` as its own click
  (`lib/animate.js`), and give the video an `objectName` in `addMedia`. The phase timer still
  autoplays.
- **Run `lib/autoplay-media.js` after `lib/animate.js`.** It gives the phase timer (and any
  content video not set to play on click) an autoplay node.
- **A process animation is slow and it pauses.** It stops at every operation (a number reaching
  a box, a step being performed), lights the box, writes the working under it, and only then
  changes the number. Twenty seconds for three examples is right; ten seconds for four is too
  fast. A backward or reverse process is shown under the forward one, boxes lined up, so the
  reason for the opposite operation is obvious without being told.
- **Keep the deck under about 25 MB.** If media pushes past that, shorten the
  clips or drop the resolution before dropping the media.
- `tools/check-timers.py` counts videos per slide, so a content video alongside
  a timer is fine. It accepts a content video that autoplays or that plays on click,
  not both.

### Where media earns its place

- **Hook** — a photograph or a five-second clip is a better hook than a
  sentence.
- **I Do** — an animation of the process being explained.
- **Context** — the real thing: the apparatus, the organism, the place.
- Not the Do Now or the Cold Call. Those are text and need to
  stay scannable.

---

## Facts and sources

Verify anything factual with a web search before it goes on a slide. Prefer
primary sources. There is no credits slide.

Images: Wikimedia Commons, filtered to CC or public domain. Square-crop and
inspect them before use — a "tree" that is a dot on the horizon will not read at
20 mm.

---

## What gets delivered

A deck and a worksheet. **No answers document** (and no Answers slide: the answers are
upside down at the end of the worksheet) and **no key-word sheet** (they
consume time neither Chuka nor the lesson has). A game when asked, see
`GAMES.md`.

Filenames in plain English: `Into The Lab.pptx`, `Into The Lab worksheet.docx`.
Never coded names like `Y7_U1_L4`.

---

## Layout

```
TEMPLATE.md   the lesson spec: ten slides, You Do 14, Mark 3, and what goes in each.
              Read before building ANY lesson.
TIMETABLE.md  classes, loads, doubles, and the T3 slot pattern
LESSON-REQUEST.md  how Chuka asks for a lesson, and what he gets back
PEDAGOGY.md   the reasoning behind TEMPLATE.md (retrieval, fading, marking). Read when
              a change to the shape is being argued for; TEMPLATE.md is what you build to.
GAMES.md      read when a request says GAME: (or the You Do becomes a game): the
              catalogue, the build rules, per-student randomising, the hard last round
ASSESSMENT.md  read when asked for a topic assessment. Printed in black and white and
              follows different rules from decks: no palette, no media, no timer.
curriculum/   scheme of work PDFs and their indexes — look up, never read whole
CLIL.md       the T3 Developing Science exception — read before planning for them
reference/    DEPLOYED lessons, teacher-edited. INDEX.md (from MANIFEST.tsv) says what
              came before for each class: read it before any follow-on lesson.
lib/        theme, furniture, shapes, docparts, timer, animate, autoplay-media
tools/      build-lesson, validate, check-timers, check-contrast, make-timers,
            make-icons, make-preview, syllabus, record-lesson, index-reference
assets/     pre-built timer videos, Google Classroom logo
examples/   complete working builds — read these before writing a new one
build/      your lesson builders go here
spec/       animation specs
out/        one folder per lesson — see "Output layout"
```
