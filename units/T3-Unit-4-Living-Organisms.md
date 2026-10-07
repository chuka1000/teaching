# T3 — Unit 4: What is a living organism?

**Class:** `T3` Developing Science (CLIL). **Six hours, including the assessment.**
Palette `meadow` (new for this unit). Pictures: `assets/pictures/` (Noto colour
emoji, made by `tools/make-pictures.js`). Wikimedia was blocked from the build
environment, so there are no photographs yet. If Chuka allows
`upload.wikimedia.org` and `commons.wikimedia.org` in the environment's network
settings, swap in photographs where a photograph shows the word better.

**Not available, and not to be planned for:** stereomicroscopes, soil, seeds,
terrariums. The unit plan's two practicals (soil sorting, seed terrarium) are
replaced by picture sorting, a classroom "look around" sort, and a generated
seed-growth animation.

---

## The unit plan (from Chuka)

- **Objectives:** sort things into living and non-living groups. Name what
  living things need (food, water, air). Show how living things grow and change
  over time.
- **Content words:** plant, animal, air, water, food.
- **Functional words:** living, non-living, grow, need, change.
- **Structures:** "Living things need [water]." · "A dog is living because it
  grows." · "A rock is non-living because it does not eat."
- **SDG 15** (Life on Land). **ATL:** Thinking skills.
- **Assessment:** Because sentences ("A [plant] is living because it [grows].")
  and the Specimen Sorting Chart (Living / Non-living).

Ten words across the unit, at most four new ones a lesson:

| Lesson | New words | Frame |
|---|---|---|
| 1 | living, non-living, plant, animal | A ___ is living. / A ___ is non-living. |
| 2 | need, food, water, air | Living things need ___. |
| 3 | grow, change | A ___ grows. / A ___ changes. |
| 4 | (because, does not: structure, not vocabulary) | A ___ is living because it ___. |

---

## Gestures, fixed in Lesson 1 and kept all unit

From the notes of `Living Or Non-Living` (slides 3 and 4):

- **living:** both hands up, wiggle all ten fingers.
- **non-living:** two fists, one on top of the other, held completely still.
- **plant:** palms together at the chest, then open them upwards like two leaves.
- **animal:** hands as paws, scratch the air twice.

Proposed for the later words. Fix each one the first time the word is taught,
then keep it:

- **need:** both hands pull in towards the chest.
- **food:** fingers to the mouth.
- **water:** drink from an invisible cup.
- **air:** a big breath in, hands rising up the chest.
- **grow:** a flat palm rising slowly from the desk to above the head.
- **change:** hands rolling over each other.

---

## Timetable: one question still open

Lesson 1 is Thursday 8 October (Week 1 Thursday P3). Half-term is 12 to 16
October. That leaves five hours after half-term, and they depend on whether the
two-week cycle **continues** (19 October is Week 2) or **restarts** (19 October
is Week 1):

| | Continues | Restarts |
|---|---|---|
| L2 | Thu 22 Oct, W2 Thu P3 | Tue 20 Oct, W1 double (L2 + L3) |
| L3 | Fri 23 Oct, W2 Fri P7 | (second half of the double) |
| L4 | Tue 27 Oct, W1 double (L4 + L5) | Thu 22 Oct, W1 Thu P3 |
| L5 | (second half of the double) | Thu 29 Oct, W2 Thu P3: **assessment** |
| L6 | Thu 29 Oct, W1 Thu P3: **assessment** | Fri 30 Oct, W2 Fri P7: feedback and a game |

The assessment never goes on Friday P7 (CLIL.md). Either way, the first lesson
after half-term comes after a gap of 12 days or more, so it opens with heavy
retrieval of the Lesson 1 words, pictures and gestures before anything new.

---

## Lesson 1 (built)

```
CLASS:      T3
SLOT:       single, Week 1 Thursday P3, Thursday 8 October 2026
TOPIC:      Living Or Non-Living

OBJECTIVES:
  1. Say living, non-living, plant and animal.
  2. Sort things: living or non-living.
  3. Write the sentence: A dog is living.

PREVIOUS:   none in this unit (reference/Atoms The Words And The Picture.pptx
            was the last T3 deck; its gestures are not reused)
THEY FOUND HARD: (first lesson of the unit)
AVOID:      Specimens, soil, seeds. "Dead" and "once living" (a wooden chair is
            non-living today). Mushrooms. "Because" (Lesson 4).
```

Built as `build/living-or-non-living.js`, 50 minutes: Title 1, Today 2, New
words 5 + 5, Sentence (the teacher sorts) 6, You say 5 (yes/no) + 7 (either/or,
pairs) + 6 (open, a park scene), You do 10, Together 3. The plenary promises
"Next lesson: what do living things need?"

Misconceptions planted on purpose: plants are not living (they do not move);
things that move are living (car, robot, bicycle, clock, kite, sun, cloud);
things that look like animals are living (teddy).

---

## Lessons 2 to 6 (to build once the timetable is confirmed)

The content below holds whichever way the timetable goes. The SLOT lines are
filled in from the table above.

### Lesson 2: What living things need

```
CLASS:      T3
SLOT:       <first slot after half-term>
TOPIC:      What Living Things Need

OBJECTIVES:
  1. Sort things: living or non-living. (Lesson 1, again)
  2. Say what living things need: food, water, air.
  3. Write: Living things need water.

PREVIOUS:   reference/Living Or Non-Living.pptx (open it and read it)
THEY FOUND HARD: <fill in after Thursday 8 October>
AVOID:      More than four new words. Starting with new language: the first
            15 minutes are retrieval (pictures, gestures, the Lesson 1 frame).
```

New words: need, food, water, air. Plants need water and air too (and light,
which is not a unit word: do not add it). Misconception: plants do not need
food. Keep to the unit's three needs; if light comes up, say "yes, and light"
without drilling it.

### Lesson 3: Living things grow and change

```
CLASS:      T3
SLOT:       <second slot>
TOPIC:      Living Things Grow

OBJECTIVES:
  1. Say: living things grow.
  2. Put pictures in order: seed, seedling, plant; egg, chick, chicken; baby, child, adult.
  3. Write: A [seed] grows into a [plant].

PREVIOUS:   reference/What Living Things Need.pptx
AVOID:      Seeds and terrariums (not available). Life cycles by name.
```

New words: grow, change. A generated animation of a seed growing (PIL frames,
ffmpeg, plays on click), and a rock that does not change, side by side. If this
is the Friday P7 slot, the You say is a standing-up ordering game.

### Lesson 4: Because

```
CLASS:      T3
SLOT:       <the double, first half, or a single>
TOPIC:      Living Because

OBJECTIVES:
  1. Say why a thing is living: A dog is living because it grows.
  2. Say why a thing is non-living: A rock is non-living because it does not eat.
  3. Sort and say: a living / non-living chart with a because sentence for each.

PREVIOUS:   reference/Living Things Grow.pptx
```

No new content words: the new thing is the structure "because it ___" and
"does not". This is the unit assessment's task, rehearsed. If it is the double,
the second half is the hands-on part: a classroom sort (everything they can see
or hold) onto a big Living / Non-living chart, with SDG 15 (Life on Land) as the
close: living things on land need food, water and air, so we look after them.

### Lesson 5: Say it all

Retrieval of all ten words and both structures, as a game or an active sort.
Rehearses the assessment's format exactly (point, wait, they answer). Not the
assessment slot itself.

### Lesson 6: Assessment

Per ASSESSMENT.md, adapted for CLIL: picture-led, black and white, questions
only from the decks of Lessons 1 to 5. Because sentences and the Specimen
Sorting Chart (pictures, not specimens). Not on Friday P7.
