# Lesson Toolkit

Builds 50-minute lesson decks and worksheets for Chuka, a science and maths
teacher at a British international school. Years 7–11 Science and Maths.

**This is a working system, not a starting point.** It has produced about a
dozen lessons. Most of what looks like an arbitrary choice below is a bug that
was found the hard way. Read the "Things that will bite you" section before
changing anything in `lib/`.

---

## Before you build anything

Work through this every time. Skipping it is how errors get made.

1. **Which class?** `7B` `8I` `8CN` `9G` `9I` `10A` `T3` — see `TIMETABLE.md`.
   There are two Year 9 Science classes; if Chuka says "Year 9" without a code,
   **ask which**.
2. **Which track?** Science, Maths or CLIL. They are genuinely different builds
   — see "The three tracks" below.
3. **Is it a single or a double?** Four slots a fortnight are 100-minute
   doubles. Check `TIMETABLE.md`. A double is **not** two 50-minute decks.
4. **Does a previous lesson exist?** Look in `reference/`. If it does,
   **open it and read it** — runtime, phases, vocabulary introduced, what the
   plenary promised. **Never infer any of that.** See `reference/README.md`.
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
either file, and the two must agree.**

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

# 3. Phase minutes total 50 (single) or 95 (double)
#    The build script prints this. Check it.

# 4. Render and LOOK at every slide
```

If check 2 fails, the deck will *look* fine and the timer will not run. It is
the failure mode that hides.

---

## The lesson archetype

Fixed. Ten slides, one per phase, in this order. Total 50 minutes.

> **Two exceptions.**
>
> **`T3` Developing Science (CLIL)** — this archetype does NOT apply. Read
> `CLIL.md` first. Beginner EAL, different lesson shape entirely.
>
> **Doubles** — four slots a fortnight run 100 minutes with no bell in the
> middle (`8CN` twice, `9I` once, `T3` once). A double is one deck of about 95
> minutes with a 5-minute break slide between the halves, not two decks. Ask
> Chuka how he wants the time split before building. See `TIMETABLE.md`.

| Slide | Phase | Min |
|---|---|---|
| 1 | Do Now | 10 |
| 2 | Today | 1 |
| 3 | Hook | 2 |
| 4 | I Do | 3 |
| 5 | I Do | 3 |
| 6 | We Do | 5 |
| 7 | Cold Call | 6 |
| 8 | You Do | 14 |
| 9 | Answers | 3 |
| 10 | Plenary | 3 |

**Slide 1 (Do Now)** carries the lesson title and date. Phase pill top-left,
title centred, date right-aligned, accent rule beneath, then six question cards
in a 2×3 grid. Each card: number, question, and the **real answer** revealed on
click. Never "keep your answer for later" — show the answer.

**Slide 6 (We Do)** is always "What should be the correct answer?" with the
subtitle "Spot the mistake." A wrong statement on the left, the correction in a
box on the right. No explanation column. 16 pt.

**Slide 7 (Cold Call)** has no title, just the pill. Six questions in a 2×3
grid, 16 pt. The teacher names a student and then asks. **Students have no mini
whiteboards** — never write an instruction that needs one.

**Slide 8 (You Do)** shows `assets/classroom.png` at 62% transparency, top
right. Title is `"<Lesson Name> worksheet"`. Red subtitle: "Open Google
Classroom now." Three tier cards: Bronze / Silver / Gold.

**Slide 9 (Answers)** holds ten model answers that match worksheet questions
1–10 **exactly, in order**. Students mark their own. There is no separate
answers document.

**Slide 10 (Plenary)** is dark. Five true/false statements. Every FALSE should
be a real misconception from the lesson.

No hidden teacher slide. Everything a teacher needs goes in speaker notes, and
**every slide must have them** — `validate.js` checks this.

---

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

---

## Sequences

Most lessons follow another one. Units built so far:

- **Y7 Science, The World of Science** — 4 lessons, all built
- **Y9 Science, Ecosystems** — 4 lessons, all built (ends on Human Population Growth)
- **Y10 Science, Motion** — acceleration, motion graphs, equations of motion
- **Y8 Maths, Algebra** — collecting like terms, expanding brackets, expand and simplify
- **T3 CLIL, Atoms** — 5 lessons planned, only Lesson 1 built

Before building lesson N, read lesson N−1 from `reference/`. Take from it:

- the **actual runtime**, from the phase pills — never assume 50
- the **vocabulary and notation** already introduced, so you build on it rather
  than redefining it
- **what the plenary promised** — the next lesson has to keep that promise
- any **open decision** flagged in the speaker notes

Carry the palette and the visual conventions forward within a unit. A second
lesson in a unit should look like the first one.

---

## Facts and sources

Verify anything factual with a web search before it goes on a slide. Prefer
primary sources. Put a credits slide in decks that use photographs or figures,
with licence and attribution.

Images: Wikimedia Commons, filtered to CC or public domain. Square-crop and
inspect them before use — a "tree" that is a dot on the horizon will not read at
20 mm.

---

## What gets delivered

A deck and a worksheet. **No answers document** (answers are slide 9) and **no
key-word sheet** (they consume time neither Chuka nor the lesson has).

Filenames in plain English: `Into The Lab.pptx`, `Into The Lab worksheet.docx`.
Never coded names like `Y7_U1_L4`.

---

## Layout

```
TIMETABLE.md  classes, loads, doubles, and the T3 slot pattern
LESSON-REQUEST.md  how Chuka asks for a lesson, and what he gets back
CLIL.md       the T3 Developing Science exception — read before planning for them
reference/    DEPLOYED lessons, teacher-edited. Read before any follow-on lesson.
lib/        theme, furniture, shapes, docparts, animate, autoplay-media
tools/      validate, make-timers, make-icons, make-preview
assets/     pre-built timer videos, Google Classroom logo
examples/   complete working builds — read these before writing a new one
build/      your lesson builders go here
spec/       animation specs
out/        generated decks and worksheets
```
