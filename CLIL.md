# CLIL — T3 Developing Science

**The 50-minute archetype in CLAUDE.md does not apply to this group.** Do Now
for 10 minutes and Cold Call for 6 both assume a level of English these
students do not have yet. Use the shape below instead.

---

## The group

Beginner EAL. Content is light, language is the work. The science in a whole
unit is usually three or four sentences long; what takes the time is being able
to say them.

They can point before they can speak, and repeat before they can produce. Every
routine below is built on that order.

---

## The timetable

Five lesson-hours per fortnight, across **four** slots:

| | Day | Period | Hours | Notes |
|---|---|---|---|---|
| Week 1 | Tuesday | P3–P4 | **2** | Double, 10:00–11:40 |
| Week 1 | Thursday | P3 | 1 | |
| Week 2 | Thursday | P3 | 1 | |
| Week 2 | Friday | P7 | 1 | 14:10–15:00, last lesson of the week |

Gaps between slots: 2 days, then **7 days**, then 1 day, then 4 days.

### What that means for planning

**One slot is a double.** Never write two separate 50-minute decks for it.
Build ONE deck covering both halves with a break slide between them — switching
files mid-lesson in front of a beginner EAL class is friction you do not need.
The break slide should carry the TPR gesture recall rather than leaving it as an
instruction in the notes. A double is the best slot in the fortnight for
anything hands-on, and the second half is where it goes.

**The 7-day gap is the problem to design around.** A beginner EAL learner loses
a lot of a new word in a week. The lesson *after* that gap should open with
heavy retrieval of the existing words — pictures, choral repetition, the
sentence frame — and introduce little or no new language. A practical works
very well here: they recover the vocabulary by using it on something.

**Friday P7 is the last lesson of the week.** Put the demonstration, the game
or the most active thing there. Do not put the assessment there.

**A 5-hour unit is exactly one fortnight.** Plan units in fives, not sixes.

---

## The Tuesday double — hard numbers

The Week 1 Tuesday slot is P3–P4, 10:00–11:40. **Break falls between P2 and P3,
so there is no bell inside the double.** It is 100 unbroken minutes and the
break is Chuka's to place.

**Atoms Lesson 1 as built runs 50 minutes**, not 48. Verified from the deck:
13 slides, 49 minutes of phase pills plus a minute on the title. Its structure
is NOT the generic shape below — it contains three phases the template does not
have: *Look and say*, *Smaller and smaller*, *I Do: everything is made of
atoms*, and *How tiny is an atom?*

So the arithmetic for that double is:

```
Lesson 1   50 min   (as built — do not retime it from the template)
Break       5 min
Lesson 2   45 min   <- build to this, not 50
           ------
          100 min
```

**Build Lesson 2 to 45 minutes.** Do not retrofit Lesson 1; it is built, taught
and paced. If Chuka would rather have a full 50 for Lesson 2, the slide to cut
is *How tiny is an atom?* — its own speaker notes nominate it ("cut this slide
first if you are behind") and it is enrichment rather than objective-critical.
Ask; do not cut it unilaterally.

**Open `reference/` and read Lesson 1 before building Lesson 2.** The runtimes
above came from the file, not from the plan. The plan was wrong.

---

## Correction to the Atoms unit

The earlier plan had **six** lessons. That is one too many — five lesson-hours
across four slots. The revised map:

| Slot | Lesson |
|---|---|
| W1 Tue P3–P4 (double) | 1. Everything is made of tiny parts (50 min, exists) + break (5) + 2. Draw an atom: centre and outside (45 min) |
| W1 Thu P3 | 3. The parts: proton and electron |
| W2 Thu P3 | 4. **Practical** — model kits (after the 7-day gap, so recover language by building) |
| W2 Fri P7 | 5. Static electricity demo, and the assessment |

Lesson 1 exists already. Lessons 2–5 do not.

---

## The CLIL lesson shape

Replace the ten-phase archetype with this:

| Phase | Purpose |
|---|---|
| Title and date | Same as any lesson. Slide 1. |
| Today | Three goals, each with a picture. No prose. |
| New words | One card per word: picture, word, syllable split, one-line meaning. Two words per card slide, maximum four new words a lesson. |
| Look and say | Teacher models, class repeats, then they produce off the picture alone. |
| Sentence frame | One frame per lesson, on screen and stays there. |
| You say | The biggest block. Whole class → half class → **pairs** → individuals. Pairs is where the speaking minutes actually are. |
| You do | Worksheet. Match, copy, write the sentence. |
| Say it together | Plenary where every answer is correct, so everyone succeeds out loud. |

For a double, run this once with new words in the first half, then a second
sentence frame or a practical in the second half, with a proper break between.

---

## Timers apply here too

**CLIL lessons get the timer bar like any other lesson.** It was missing from
Atoms Lesson 1 only because no clips existed for the `nucleus` palette — a bug,
now fixed. `lib/timer.js` renders whatever is needed.

It arguably matters more for this group than any other: a draining bar says
"this much time left" with no English in it at all.

The CLIL phases are not the archetype's, so the durations differ — 2, 3, 4, 5,
6, 7 and 8 minutes are the usual ones. `timer.js` renders any of them.

---

## Rules for this group

- **Every word has a picture. Always.** No exceptions.
- **Match the picture to the word exactly.** A water droplet labelled "bottle"
  is worse than no picture — they cannot check it against anything.
- **Photographs where a photograph can show the word**; a drawing only where it
  genuinely cannot (an atom, or an abstract property like "tiny").
- **Question order: yes/no, then either/or, then open.** Never open first.
- **One sentence frame per lesson**, reused until it is automatic.
- **No Cold Call** in the archetype sense. They are not there yet.
- **The drill routine**, thirty seconds per new word: you say it → whole class →
  half the class → three individuals → they say it off the picture with no
  prompt.
- **Agree TPR gestures in Lesson 1 and keep them all unit.**
- **Vocabulary lives on the slides and the worksheet**, not in a separate
  document.
- **Worksheets are picture-led.** No line-drawing matching tasks — hard to
  print, hard to mark, and hard for the student. Use a word bank and a writing
  line instead.
- **Speaker notes carry the pronunciation**, the drill, the gestures and the
  misconceptions. That is where the teaching actually lives for this group.
- **Gestures are agreed once and kept.** Lesson 1 fixed the TPR gestures for
  tiny, part, made of and atom. Read them out of Lesson 1's speaker notes and
  reuse them. Do not invent new ones.
- **Four new words per lesson is the ceiling, and it resets each lesson.**
  Lesson 1 spent its four on atom, matter, tiny, part. Lesson 2 has a fresh
  budget: centre and outside fit comfortably.

---

## Spelling — settled

**British English, always.** The target word is **centre**, not *center*.

The unit plan writes the American form, but the plan is a planning document and
is never shown to students. Everything they see — slides, worksheets, the board
— uses British spelling. Beginner EAL learners should meet one spelling of a
target word, and that spelling matches everything else they read in this school.

Do not raise this again; do not offer the American form as an option.
