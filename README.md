# Lesson Toolkit — setup

This folder is a working lesson-building system lifted out of a Claude chat. It
has produced roughly a dozen lessons. The point of moving it to Claude Code is
that the code now **stays on your Mac** instead of being rewritten from scratch
every conversation — which is where most of the cost was going.

---

## One-time setup

**1. Install the prerequisites.**

```bash
# Node (if you don't have it)
brew install node

# ffmpeg, for the timer bars
brew install ffmpeg

# LibreOffice, for previewing decks as PDF
brew install --cask libreoffice
```

**2. Put this folder somewhere sensible** — `~/Documents/lesson-toolkit` is fine.

**3. Install the Node packages.**

```bash
cd ~/Documents/lesson-toolkit
npm install
```

**4. Start Claude Code in the folder.**

```bash
claude
```

It reads `CLAUDE.md` automatically. That file is the standing brief — the
archetype, the layout rules, the writing style, and the list of bugs that cost
real time to find.

**5. Make it a git repo.** Worth five minutes:

```bash
git init && git add -A && git commit -m "Lesson toolkit, ported from chat"
```

Then when a change breaks a deck you can see exactly what changed.

---

## Building a lesson

Tell Claude Code the year group, the topic and the objectives. For example:

> Year 9 Science, Chemical Reactions. Objectives: describe what a chemical
> reaction is; identify the signs one has happened; write a word equation.
> They have already met elements and compounds.

It should produce a deck and a worksheet, validate both, render them, and show
you the result.

**Ask to see the rendered images before you accept a deck.** The single most
useful habit from the chat work was looking at every slide rather than trusting
that the code was right.

---

## What's in here

| Folder | What it is |
|---|---|
| `CLAUDE.md` | The standing brief. Claude Code reads this every session. |
| `lib/` | The engine: palettes, slide furniture, shapes, docx helpers, the OOXML animator, the media autoplay injector. |
| `tools/` | Validator, timer-video generator, icon renderer, preview builder. |
| `assets/timers/` | Pre-built timer videos. You only need to regenerate these for a new palette. |
| `examples/` | Six complete, working builds — two decks, three worksheets, one animation spec. These are the reference. |

---

## The first session

Don't start with a new lesson. Start with this:

> Read CLAUDE.md and the files in examples/. Then rebuild the "Equations of
> Motion" lesson from scratch using the toolkit, and show me the rendered
> slides. I want to confirm the port works before we build anything new.

If that comes out matching what you already have, the port is good and
everything after it is cheap.

---

## Things worth knowing

**The timer bars are videos.** They only play in presentation mode — in the
editor you'll see a full bar, which is the cover image. If Keynote asks about
embedded media on import, say yes.

**Regenerating timers** is only needed for a new colour scheme:
`node tools/make-timers.js`. Each clip is about 5 KB per minute.

**The validator is not optional.** `tools/validate.js` checks structure and that
every slide has speaker notes. There's a second, stricter one in the Claude
sandbox that isn't available locally — so locally, rendering and looking at the
output matters more, not less.

**If something renders fine as a PDF but breaks in Keynote**, suspect the two
classic causes first: a missing `type` on an image, or an animation that landed
inside the main click sequence. Both are described in `CLAUDE.md`.

---

## Known-good baseline

This kit was tested end to end before packaging: `templates/deck-template.js`
builds a complete ten-slide lesson, the animator and autoplay injector run over
it, and both validators pass. Two bugs were found and fixed during that test —
one of them a cTn id collision in `autoplay-media.js` that only appears on a
deck built from a fresh checkout. So the first build you run should work.
