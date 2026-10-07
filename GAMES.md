# Games

Occasionally the You Do slot becomes a game instead of the worksheet.

**The worksheet is still produced, every time.** A game replaces how the 14
minutes are spent, not the resource. Chuka needs the worksheet for absentees,
for the students who finish early, and for the ones the game does not suit.

Only build one when asked. `GAME:` in the lesson request, or a sentence saying
so.

---

## Two modes — decide this first

**Projected.** One screen, teacher drives, whole class answers together by hand
or by shouting. No student devices involved.

- Nothing can go wrong with the tech.
- Works with any class, any room, any device situation.
- Good for misconception blitzes, sorting, ordering, spot-the-error.
- The teacher sees the whole room's thinking at once.

**On devices.** Single HTML file through Google Classroom, each student plays
alone.

- Everyone answers every question, not just the confident ones.
- Self-paced, so fast finishers keep going.
- Opens straight from a laptop. **On an iPad an HTML attachment is awkward** —
  check before relying on it for a class working on tablets.
- Must work offline. No internet in the room is a normal Tuesday.

**If unsure, build projected.** It always works.

---

## The catalogue

Each of these is buildable in one pass and fits 10–14 minutes.

| Game | What it is for | Mode |
|---|---|---|
| **Sorter** | Two or three bins, items to place. Classification of any kind. | Either |
| **Drill rounds** | Timed calculations, six per round, getting harder. | Devices |
| **Spot the error** | Worked solutions shown; tap the line where it goes wrong. | Either |
| **Sequencer** | Put steps or events into the right order. | Either |
| **Pairs** | Match word to picture, or term to definition. Memory-grid or straight matching. | Either |
| **Labeller** | Drag labels onto a diagram — an atom, apparatus, graph axes. | Devices |
| **True or false blitz** | Rapid misconception fire, 20 statements against a clock. | Projected |
| **Number line** | Place a value on a scale. Densities, temperatures, orders of magnitude. | Devices |
| **Graph match** | Match a described motion or process to the right graph. | Either |
| **Sentence builder** | Word tiles assembled into a sentence frame. Built for CLIL. | Devices |

### Which to pick

- **A lesson with a classification** → Sorter.
- **A lesson with a calculation** → Drill rounds, or Spot the error if the
  method matters more than the answer.
- **A lesson with a process or a timeline** → Sequencer.
- **A lesson with new vocabulary** → Pairs. For `T3`, Pairs or Sentence
  builder, always with pictures.
- **A lesson whose misconceptions are the point** → True or false blitz.
- **A lesson with a diagram** → Labeller.
- **`T3`, any lesson** → follow the CLIL question order (yes/no, then either/or, then
  open) and use only the words and pictures already taught. Worked example:
  `build/atoms-words-and-picture-game.html` (words, then point at the parts of an
  atom, then sentence gaps, with the syllable split and the agreed gesture shown
  after every answer).

### Non-digital, when the room suits it better

- **Card sort** — print, cut, groups of three. Same content as Sorter, more
  talking. Produce as a one-page PDF of cards.
- **Loop cards** — "I have 12 N. Who has the weight of 3 kg?" Whole class, one
  chain, no winner. Very good for drilling a single equation.
- **Bingo** — students fill a grid from a word or answer bank. Good for
  vocabulary and for mental calculation.

---

## Build rules

**Single self-contained HTML file.** No CDN, no fonts, no external requests,
no build step. It must work with the wifi off.

**No login, no accounts, no data leaving the device.** Score lives in memory
and disappears. Do not use localStorage for results — a shared laptop then
shows the previous student's score.

**Two viewports, both tested:** 1280×800 and 390×844. Test with Playwright
before delivering, and say how many checks passed.

**Touch and keyboard both.** Number keys for multiple choice; taps for
everything else. Nothing that needs a hover or a right-click.

**Match the lesson palette**, from `lib/theme.js`. It should look like the
deck it came from.

**Rounds of about six.** Three rounds is right for 14 minutes. Show progress.

**Name it after the lesson**: `Measuring Properly game.html`.

**Randomised per student.** See "Every student gets a different game" below. This is a build rule, not an option.

---

## Every student gets a different game

**Never ship one fixed set of questions.** If every student sees the same
questions in the same order, the answers are shared in ten seconds and the
game measures nothing. Each game is generated from a short **game code**, random
for each student:

- Numbers, forms and letters come from templates, not from a fixed list.
- Within each block of similar difficulty the order is shuffled. Easy blocks
  still come first, so the round still gets harder.
- The **skills and their order stay the same for everyone**, so the diagnostic
  ("brackets: 2 of 5") means the same thing for every student.
- The code is shown on the start and end screens. Opening the file with
  `#CODE` on the end of the address gives exactly that game again, so a teacher
  can see what a student saw. The code lives in memory only.
- Every wrong answer the game names as a known mistake carries the sum that
  produces it (`how`). The feedback is therefore correct for whatever numbers
  came up, not for one hard-coded case.
- Validity rules are part of the template: whole numbers only, positive results,
  no two mistakes with the same value, no mistake equal to the answer.

`build/putting-numbers-in-game.html` is the worked example (a seeded generator,
about 300 lines).

### How this carries over to science

| Game | What varies per student |
|---|---|
| **Drill rounds** (density, speed, weight, V = IR, moles) | The numbers, the units (g and cm³ against kg and m³), and the context (an object, a metal, a liquid). Each template names its slips: inverted formula, unit not converted, forgot to square. |
| **Sorter** | Draw 8 to 10 items from a pool of 14 to 18, so no two students sort the same set. Shuffle item order and bin positions. Keep the misconception items in every draw (a rule, not chance). |
| **Sequencer** | Draw a different subset of steps, or a different example process of the same shape (three food chains, not one). |
| **Pairs / Labeller** | Random subset of pairs, random card positions. Labeller: random rotation, mirror or zoom of the same diagram. |
| **Spot the error** | Generate the worked solution from numbers, then inject one error of a chosen type at a random line. Which line is wrong differs per student. |
| **Number line** | A random target value inside a band, in a scale that changes (0 to 100, 0 to 20). |
| **Graph match** | Random gradient and intercept, so the graphs are not the same picture. The description changes with them. |
| **True or false blitz** | Draw 20 statements from a bank of 30 to 40, and flip some by rewording. Options shuffled on every multiple-choice item. |

**Conceptual items with no numbers** cannot be numerically varied. Vary them
three ways instead: several phrasings of the same misconception, options shuffled,
and a bank larger than the draw. Do not pretend a single fixed question is
varied because its options are in a new order.

**Testing a random game is different.** A hand-written question can be checked
by eye; a generator cannot. Dump a few hundred generated games and check every
answer, every mistake value and every worked line with sympy
(`build/check-putting-numbers-in-game.py`), then check no two games are alike.
Then play it in a browser at both viewports
(`build/test-putting-numbers-in-game.js`).

---

## Difficulty ramps, and the top is hard

**A game must climb, and the last round must be genuinely hard.** Chuka's rule,
set after a game that the class found too easy: as the difficulty ramps up the
questions become *insanely challenging*. The lesson's own level is the middle
of the game, not the top of it.

- **Round 1 is the lesson.** Everyone should finish it with green dots.
- **Round 2 is the lesson plus one step.** A second skill, a harder form of the
  first, or the lesson's skill reversed.
- **Round 3 goes far past the lesson**, and the last two questions are meant to
  be almost impossible for the strongest student in the room: extra steps,
  puzzles that use the idea in an unfamiliar way, a template that needs a
  method nobody was taught (an unknown on both sides, a rule found from a
  table, an input that equals its own output). Negative numbers, fractions or
  larger numbers are fair game in the last one or two questions, even if the
  lesson itself avoided them. Say so in the speaker notes.
- **Fail informatively at the top too.** A student who cannot do question 17
  still gets the answer, the working and a named mistake. The working is where
  the learning is, so it must be there for every question.
- **Tell the class before they start** that round 3 is meant to be too hard, so
  nobody reads a red dot as "I am bad at maths". Put the same sentence on the
  game's start screen.
- **Let them stop.** Thirteen minutes will not finish eighteen questions like
  these. A "Stop and see my results" button on every question shows the score,
  what was not reached and the mistakes so far. No penalty for using it.
- **Keep the skills and their order fixed** for every student, as above, so the
  ramp and the diagnostic mean the same thing to everyone. Only the numbers and
  the choice of template inside a slot vary. When one slot draws from a pool
  (for example, one of two "almost impossible" questions), every template in the
  pool must be of the same difficulty and the same skill category.
- **Test the top.** The sympy checker must cover the hardest templates exactly
  as it covers the easiest: exact division on every path, the answer unique,
  every mistake value produced by its stated sum.

Worked example: `build/function-machines-game.html` (Round 3 is a three-step
reversal, an input equal to its own output, a missing number, a rule from a
table, then two questions drawn from small pools of very hard templates, with
negative numbers and "subtract from" in the last).

---

## The review: a drop-down for every round

**At the end of each round, and again on the last screen, every game shows a
drop-down for each round.** Chuka's request, set after the Function Machines game
and now standard. Each drop-down lists the questions with:

- **how long it took** to answer (in seconds, or minutes and seconds);
- **whether it was right or wrong**;
- for a wrong one, **what the student wrote** and **how to get to the right
  answer**: the working, line by line, or the reasoning in sentences, and the
  method in one line;
- for a question not reached (the student stopped early), "Not reached".

Times are information, not marks: say "the time does not count for anything" on
the round screen. The drop-downs start closed and are native `<details>`
elements, so they work by keyboard and touch with no script. Worked examples:
`build/function-machines-game.html` (numbers) and
`build/fossils-and-the-fossil-record-game.html` (multiple choice and numbers, with
a picture for each question). The Playwright test opens every drop-down in an
all-correct game and an all-wrong game and checks the text.

---

## A science game that has no numbers to vary

The rule above ("conceptual items cannot be numerically varied") does not mean
a science game must be a fixed quiz. `build/fossils-and-the-fossil-record-game.html`
(Dig Site) varies the content itself: every rock-layer picture is generated from a
list of layers, so the question, the picture and the answer come from the same
data. A checker recomputes each answer from that data (which layer is oldest,
which layers match at two sites, how many stages are missing). Where a question
can be built from attributes (hard parts, quick burial), generate four options
from attribute combinations, so that exactly one is right by construction. Use
invented fossils and an invented order when the puzzle is about the reasoning, and
say so on the start screen, so that no puzzle contradicts real chronology.

`build/more-evidence-game.html` (Family Tree) does the same with tables and
trees. A tree is kept as data (leaves and branch lengths), drawn to SVG from that
data, and the checker recomputes distances and sisters from it independently. Where
a table must imply a family tree (closest relative, most recent common ancestor),
build it from a clock-like tree (differences = twice the height of the common
ancestor) so the table cannot contradict any tree. The checker asserts that
property for every table.

---

## Pull questions from more than today

A game is retrieval practice with a scoreboard, so the rules in `PEDAGOGY.md`
apply to it.

- **Span lessons.** Roughly half the items on today's content, the rest from
  earlier in the unit. Retrieving something half-forgotten is worth more than
  retrieving something fresh.
- **Interleave within a round.** Mixing the types forces them to work out which
  method applies, which is the skill. A round of six identical items tests the
  method once.
- **Make them produce, not recognise, where you can.** Typing or placing an
  answer beats picking from four. Multiple choice is fine when speed matters;
  it is the weaker test.

## What makes a game worth the 14 minutes

**It has to be diagnostic.** At the end it must show what was got wrong, not
just a score. "You missed 4 of 6 on unit conversion" is worth the lesson time;
"You scored 14" is not.

**It has to fail informatively.** A wrong answer should say what the error was,
in the same words the deck used. The game is the We Do slide with a scoreboard.

**It should get harder.** Round one everyone can do. Round three separates.

**No penalties for slowness.** A timer that punishes creates panic in exactly
the students who need the practice most. Time the round, not the question.

---

## What not to build

- **Anything needing accounts, servers or internet.**
- **Leaderboards across students.** Public ranking in a mixed-ability room
  teaches the bottom third to stop trying.
- **Sound effects.** Thirty devices chiming at once is a room you cannot
  recover.
- **Anything where the game mechanic is harder than the science.** If the
  instructions take two minutes, it is not a 14-minute activity.
- **Lives, hearts or game-over.** Being locked out of practice for getting
  things wrong is precisely backwards.

---

## Delivery

Alongside the deck and the worksheet, in the lesson folder:

```
out/Measuring Properly/
  Measuring Properly.pptx
  Measuring Properly worksheet.docx
  Measuring Properly game.html
```

Change the You Do slide to point at the game rather than the worksheet, keeping
the Google Classroom logo and the heading. Say in the speaker notes that the
worksheet is the fallback.
