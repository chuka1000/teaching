# T3 — Unit 4: What is a living organism?

**Class:** `T3` Developing Science (CLIL). **Six hours, including the assessment.**
Palette `meadow` (new for this unit). Pictures: real photographs from Wikimedia Commons
and Openverse (Flickr), all CC or public domain, fetched by `tools/fetch-photos.py`
into `assets/photos/` (the list is `PHOTOS.tsv`, the sources and licences
`SOURCES.tsv`). The same photograph is used for the same thing in every lesson, so the
pictures work for retrieval. Colour drawings (`tools/make-pictures.js`) only where no
photo fits: the park scene, routine icons, the "why?" mark.

**Not available, and not to be planned for:** stereomicroscopes, soil, seeds,
terrariums. The unit plan's two practicals (soil sorting, seed terrarium) are
replaced by picture sorting, a classroom living-things hunt, and a generated
seed-growth animation.

**Shared code.** `build/living-things-words.js` says what every pictured thing is
(living or not, plant or animal) and holds the gestures; `build/living-things-kit.js`
is the slide furniture; `build/living-things-sheet.js` the worksheet furniture. A new
lesson in this unit uses all three, so it looks like the others and a thing cannot
change sides between lessons.

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

## Timetable (confirmed: the cycle continues after half-term)

| Lesson | Date | Slot | Deck |
|---|---|---|---|
| 1 | Thu 8 Oct | W1 Thu P3 | `Living Or Non-Living` |
| (half-term) | 12 to 16 Oct | | |
| 2 | Thu 22 Oct | W2 Thu P3 | `What Living Things Need` |
| 3 | Fri 23 Oct | W2 Fri P7, last of the week | `Living Things Grow` |
| 4 and 5 | Tue 27 Oct | W1 Tue P3 to P4, the double | `Why Is It Living` (one deck: 50 + 5 + 45) |
| 6 | Thu 29 Oct | W1 Thu P3 | `Living Things assessment` (paper, mark scheme, feedback sheet) |

The assessment is not on Friday P7 (CLIL.md). Lesson 2 comes after a two-week gap, so
it opens with 15 minutes of retrieval of the Lesson 1 words, photographs and gestures.
Chuka said he thinks the cycle continues; if it turns out to restart, the dates move
but the order stays (the double would then fall on Tue 20 Oct and come first).

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

## Lessons 2 to 6 (built)

### Lesson 2: What Living Things Need

```
CLASS:      T3
SLOT:       single, Week 2 Thursday P3, Thursday 22 October 2026
TOPIC:      What Living Things Need
OBJECTIVES:
  1. Sort things: living or non-living. (Lesson 1, again)
  2. Say what living things need: food, water, air.
  3. Write: Plants need water.
PREVIOUS:   reference/Living Or Non-Living.pptx
THEY FOUND HARD: <fill in after Thursday 8 October>
```

New words: need, food, water, air. Frame: "Living things need ___." 50 minutes: Title 1,
Today 2, Remember 5, Sort again 5, New words 5, Sentence 5, You say 5 (yes/no) + 6
(either/or, pairs) + 5 (open), You do 8, Together 3. "Plants need food" is never said
(plants make their own); the notes say what to do if it comes up.

### Lesson 3: Living Things Grow

```
CLASS:      T3
SLOT:       single, Week 2 Friday P7, Friday 23 October 2026 (last lesson of the week)
TOPIC:      Living Things Grow
OBJECTIVES:
  1. Say: grow, change.
  2. Put the pictures in order.
  3. Write: A puppy grows into a dog.
PREVIOUS:   reference/What Living Things Need.pptx
```

New words: grow, change. Frame: "A ___ grows into a ___." The I Do is a generated
animation (`build/media/living-things-grow-media.py`): a seed grows over 20 days beside
a rock that does not, pausing at every stage, played on click. Friday P7, so two
stand-up games (crouch for small, stand for big; stand up if it grows) and a short
worksheet.

### Lessons 4 and 5: Why Is It Living? (the double)

```
CLASS:      T3
SLOT:       DOUBLE, Week 1 Tuesday P3 to P4, Tuesday 27 October 2026, one deck
TOPIC:      Why Is It Living?
OBJECTIVES:
  1. Say why a thing is living: A dog is living because it grows.
  2. Say why a thing is non-living: A rock is non-living because it does not eat.
  3. Find living and non-living things around me.
PREVIOUS:   reference/Living Things Grow.pptx
```

New words: eat, because (and "does not"). Gestures: eat = fingers to the mouth, then
chew; because = hook the two index fingers together. First half (50): the because
frame, right or wrong, grows or does not grow, open "why?", worksheet part 1. Break (5):
the slide carries all twelve gestures. Second half (45): the living-things hunt round
the room (the unit plan's sorting chart, filled from the room), sharing, Life on Land
(SDG 15, ATL Thinking: "What can we do?"), and a rehearsal of Thursday's paper in its
own formats. "It moves" is never a reason (the car, robot, kite and bicycle all move).

### Lesson 6: Assessment

`build/living-things-assessment.js` (content in `living-things-assessment-content.js`,
greyscale pictures from `living-things-assessment-pictures.js`). 45 marks, 45 minutes,
black and white, per ASSESSMENT.md. Ten questions, every one from Lessons 1 to 5:
yes/no, either/or, the three needs, the sorting chart, putting pictures in order, the
needs sentences, because sentences, a wrong "because it moves" to correct, a goat and an
umbrella never seen in class, and sentences from pictures. Mark scheme (TEACHER ONLY)
with the language-marking rules and the likely wrong answer for each question, and a
feedback sheet with Support, Consolidate and Extend variants of every question.
