# Asking for a lesson

Plain English is fine. This template just front-loads the things Claude Code
would otherwise have to ask about, which saves a round-trip or two.

---

## The short version

Most requests only need this much:

```
8CN, single. Year 8 Maths, solving one-step equations.
Objectives: solve x + a = b and ax = b; check an answer by substituting.
Previous: reference/Expand and Simplify.pptx — they're solid on collecting
like terms but shaky on negatives.
```

Class code, slot, topic, objectives, what came before. That's enough.

---

## The full version

Use this when there's a practical, an assessment, or anything unusual.

```
CLASS:      <7B | 8I | 8CN | 9G | 9I | 10A | T3>
SLOT:       <single | double — which week/day/period>
TOPIC:      <what it's called>

OBJECTIVES:
  1. <...>
  2. <...>
  3. <...>

PREVIOUS:   <reference/<file>.pptx, or "none — first of the unit">
THEY FOUND HARD: <what went wrong last lesson, if anything>

PRACTICAL:  <what they do, what equipment, any safety concern>
ASSESSMENT: <what's being assessed, if anything>
AVOID:      <anything specific — a context, a method, a piece of kit>
```

---

## What you'll get back

A deck and a worksheet, validated and rendered, with the images shown to you.

**No answers document** (answers are slide 9) and **no key-word sheet**.

If it's a double, expect to be asked how you want the 100 minutes split before
anything gets built.

---

## Things worth saying when they apply

These change the build, and Claude Code cannot infer them:

- **"They struggled with X last lesson."** Reshapes the Do Now and often the
  We Do. The single most useful sentence you can add.
- **"This is a practice lesson, not a teaching one."** Shifts the weight to
  We Do, Cold Call and You Do, and shortens the I Do slides.
- **"There's a practical."** Needs equipment, a safety brief in the notes, and
  usually the second half of a double.
- **"This is the last lesson of the unit."** Changes the plenary and usually
  means an assessment.
- **"Pitch it low / this is a strong group."** Otherwise it aims at the middle.

---

## Asking for changes

After a build, specific beats general:

- Good: *"Slide 6 row 3 — the correction should be 'it's accelerating', not
  'the gradient is changing'. Rebuild just that slide."*
- Less good: *"The We Do isn't quite right."*

If a change is a standing preference rather than a one-off, say so — and ask
for `CLAUDE.md` to be updated in the same breath. That is what stops you
repeating yourself:

> Don't use the word "journey" in physics questions. Add that to CLAUDE.md.

The brief has grown out of exactly these corrections. Keep feeding it.

---

## A worked example

```
T3, double (W1 Tue P3–P4). Atoms Lesson 2: draw an atom, label the
centre and the outside.

Objectives:
  1. Draw a simple picture of an atom.
  2. Label the centre and the outside.
  3. Say "The [part] is in the [location]."

Previous: reference/Atoms L1.pptx — 50 min, four words already taught
(atom, matter, tiny, part). TPR gestures are in its speaker notes; reuse them.

Build Lesson 2 to 45 minutes. One deck covering both halves with a break
slide between. British spelling: centre.

The drawing is the You Do. Word bank and a writing line, not a matching task.
```
