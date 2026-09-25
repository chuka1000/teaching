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
