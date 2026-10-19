# T3 — Unit 8: The Periodic Table

**Class:** `T3` Developing Science (CLIL). **Five hours: exactly one fortnight.**
Palette `nucleus` (the one Lesson 1 was taught with, so every lesson looks like it).
Lesson 1 was taught on **Friday 9 October 2026** from a deck that was built before this
toolkit had the unit; it is `reference/The Periodic Table.pptx`. Lessons 2 to 5 were built
on 19 October 2026 from the unit plan and that deck.

| Hour | Date | Slot | Lesson | Deck |
|---|---|---|---|---|
| 1 | Fri 9 Oct | W2 Fri P7 | The Periodic Table (taught) | `reference/The Periodic Table.pptx` |
| 2 | Thu 5 Nov | W2 Thu P3, after a 7-day gap and 27 days after hour 1 | **Metal Or Non-Metal?** | `Metal Or Non-Metal.pptx` |
| 3 | Fri 6 Nov | W2 Fri P7 | **Does It Light Up?** | `Does It Light Up.pptx` |
| 4 and 5 | Tue 10 Nov | W1 Tue P3 to P4, the double | **What Is It Made Of?** | `What Is It Made Of.pptx` (one deck, 50 + 5 + 45) |

Each lesson folder in `out/` holds the deck and a worksheet; the double also holds the game
(`What Is It Made Of game.html`) and the teacher's oral-check sheet (`What Is It Made Of oral check.docx`).

**Shared code.** `build/periodic-words.js` says what every pictured thing is (its element, metal or
non-metal, what it looks like, whether it conducts) and holds the gestures; `build/periodic-kit.js` is the
slide furniture; `build/periodic-sheet.js` the worksheet furniture. `tools/make-periodic-table.py` draws the
table and the element tiles in the style of the deck taught on 9 October (blue metal, green gas, grey other).
Each lesson has its own `-answers.js` (one place for every answer, read by the deck, the worksheet and the
upside-down answers). `build/periodic-check.py` checks every fact against the table.

---

## The unit plan (from Chuka)

- **Objectives:** name common metals and non-metals. Find common parts (elements) on the big chart. Sort objects by
  what they are made of (iron, gold, oxygen).
- **Content words:** chart, metal, non-metal, element, iron, gold, oxygen. **Functional:** find, point, sort, hard, soft, shiny.
- **Structures:** "Gold is shiny." "Iron is hard." Frame: "This is [iron]." "It is a [metal]."
- **SDG 12** (Responsible Consumption and Production). **ATL:** Research skills.
- **Key activities:** examine sealed glass vials of copper, carbon, sulfur and silicon; test whether samples conduct electricity
  with simple circuit boards and bulbs.
- **Assessment:** worksheet or game; descriptive sentences (the teacher points to a sample and the student says "It is a metal. It is shiny.").

## Decisions, and corrections to the plan

- **"Chart" stays "table".** Hour 1 taught "the periodic table" (and "table" appears in the title, the slides and the worksheet), so the unit
  keeps it. The plan's "chart" is never shown to students.
- **"Non-metal" means "not a metal", and nothing more.** On the taught table the green gases and the grey elements are all "not blue". So
  `non-metal` covers helium and oxygen as well as carbon, sulfur and silicon. Lesson 2 teaches the rule on the table itself: *blue is a
  metal, not blue is a non-metal.* The class never has to learn that there are metalloids.
- **Silicon is shiny and a non-metal, on purpose.** It is grey on the table, so it is a non-metal for this class, and its vial looks like a
  metal. That is the one idea Lesson 2 spends time on: **the table decides, not the look.** (In reality silicon is a metalloid, a
  semiconductor; the notes say so for the teacher only.)
- **"Shiny / not shiny" are described from what can be SEEN through glass.** The vials are sealed, so hard and soft are taught with things
  they can touch (a rock, a teddy, a key, a spoon), and the vials are described only by colour and shininess. Copper and silicon: shiny.
  Carbon and sulfur: not shiny. **Check the real vials before the lesson** (Lesson 2 notes): carbon as graphite flakes can be shiny.
- **The sealed vials cannot go in a circuit**, so Lesson 3 tests loose samples: a copper wire, an iron nail, aluminium foil, a lump or stick
  of sulfur and a sharpened pencil. The sample set is NOT the vial set. Copper, iron, aluminium conduct; sulfur does not; **the pencil lead
  (graphite, carbon, a non-metal) does: the one exception, shown as "Surprise!"** Silicon is never tested (a semiconductor: it conducts a
  little, and the result would muddy "metals conduct"). The class sentence is "Metals conduct electricity."
- **Gases are "full of", solids "made of".** "A tank is full of oxygen" and "A balloon is full of helium", not "made of oxygen": air is mostly
  nitrogen, and oxygen is in a tank, not in the shape of one. Two sentences, both in the banner of every speaking slide in Lessons 4 and 5.
- **Iron means iron.** A real nail is steel and a pan is cast iron (mostly iron). For this class they are iron; the notes say "mostly iron" if asked.
- **The assessment is inside the double.** The unit has five hours and Friday is not for assessment, so the second half of the double
  (45 minutes) is: Goal 12 (6), the game (14), then the oral check (20) while the class plays and does worksheet page 2. The oral check IS the unit
  plan's "descriptive sentences". The ticks are the teacher's.
- **The 7-day gap, and 27 days since hour 1.** Lesson 2 opens with six minutes of retrieval of everything from hour 1 (the biggest block of the
  lesson) and uses the vials as the practical (CLIL.md: recover the words by using them). Lesson 3 follows by one day, so its retrieval is four minutes.

## Words, in the order taught (gestures fixed once and kept)

Four new words a lesson at most. Gestures from hour 1 and the Atoms unit are quoted from those decks.

| Lesson | New words | Gestures |
|---|---|---|
| Atoms (T3 Unit 2) | atom, tiny, part, made of | fingers circling · pinch · a chopping hand · hands building |
| 1 (taught) | element, symbol, metal, gas | both hands make a small box around ONE thing · write a letter in the air · knock twice on the desk with a fist · wiggle the fingers upwards and let the hands float up |
| 2 | non-metal, shiny, hard, soft | the metal knock, then sweep both hands apart · open and close both hands beside the face like a sparkle · a tight fist held up · squeeze an invisible sponge |
| 3 | electricity, bulb, circuit, conduct | a zigzag in the air · a fist above the head, then open the fingers · one finger draws a square · run a finger along the other forearm |
| 4 and 5 | sort, full (first half); recycle (second half) | sweep the hands left and right · both arms rounded, holding a big full balloon · both index fingers chase each other in a circle |

`on` and `off` are shown beside the bulb pictures in Lesson 3 and not drilled. `made of` comes from Atoms. The break slide of the double carries all
fourteen gestures of the unit (CLIL.md).

## The lessons

**Lesson 2, Metal Or Non-Metal? (50).** Title 1 · Today 2 · Remember 6 (hour 1, picture first) · New words 4 (non-metal, shiny) · New words 4 (hard, soft) ·
Look and say 4 (the four samples, with the frame "This is ___. It is a ___. It is ___.") · The table 4 (blue is a metal, not blue is a non-metal) ·
Yes or no 4 · Metal or non-metal? 5 (standing) · Look. Say. 5 (pairs, with the real vials) · You do 8 · Say it together 3 · 50 minutes.

**Lesson 3, Does It Light Up? (50).** Title 1 · Today 2 · Remember 4 · New words 3 (electricity, bulb) · New words 3 (circuit, conduct) · The film 4 (25 s, silent,
plays on click: copper in the gap, the bulb comes on; sulfur, nothing; `build/media/circuit-test.py`) · Will the bulb light up? 4 (thumbs) · How to test 3 ·
**Test! 13** (circuit boards, groups of four, five samples) · What did we find? 5 (the pencil is the surprise) · You do 5 · Say it together 3 · 50 minutes.

**Lessons 4 and 5, What Is It Made Of? (95).** First half (50): Title 1 · Today 2 · Remember 6 · New words 3 (sort, full) · Look and say 6 (nail, ring, wire, pan, tank, balloon) ·
Yes or no 4 · Iron, gold, copper or gas? 6 · What is it made of? 5 · Sort 6 (iron, gold, gas) · You do 8 (worksheet page 1) · Say it together 3. Break 5.
Second half (45): Part 2 title 2 · **Goal 12 6** (recycle metal; cans and bales of cans) · **Game 14** (the sentence builder; worksheet page 2 for anyone without a device) ·
**Show me 20** (the oral check of the four vials, pairs called to the sample table) · Say it together 3. There is no "next lesson": it is the last of the unit.

## The game, and the check

`What Is It Made Of game.html`: three rounds of six (CLIL order: yes/no then either/or in round 1; metal or non-metal and "does the bulb light up?" in round 2;
sentences built from word tiles in round 3). Different for every student (a six-letter code, repeatable with `#CODE` on the address), spread over all five
lessons (half the words from the double and Lesson 3, half from earlier), silicon and the pencil lead in every game, the two hardest words
(non-metal, conduct) in every game, syllable split and gesture after every answer, a review drop-down for every round, nothing stored, no sound.
Tested with Playwright at 1280×800 and 390×844 (`build/test-what-is-it-made-of-game.js`: 21,398 checks, 300 generated games checked against the unit's
own data, all-right, all-wrong and keyboard-only games, the drop-downs read back).

`What Is It Made Of oral check.docx`: for the teacher only. A page of instructions and the four samples with the sentence to listen for, then
25 rows: name, says the name, metal or non-metal, shiny or not shiny, whole sentence (each 2, 1 or 0), vial, notes. Total out of 8.

## Facts checked

Atomic numbers and the colours of the table: `build/periodic-check.py` (against `tools/make-periodic-table.py`, which draws the table taught in hour 1).
Graphite is the one non-metal that conducts electricity along its layers; silicon is a metalloid and a semiconductor with a metallic lustre; sulfur is a
non-conductor (the demonstration with a battery and bulb is on [ChemEd X](https://chemedx.org/JCESoft/jcesoftSubscriber/CCA/CCA1/R1MAIN/CD1R3040.HTM)).
SDG 12.5: "substantially reduce waste generation through prevention, reduction, recycling and reuse" ([UN SDG 12](https://sdgs.un.org/goals/goal12)).

## Pictures

Real photographs (Wikimedia Commons and Openverse, CC or public domain; sources in `assets/photos/SOURCES.tsv` and in the speaker notes of the slide that
uses each): native copper, charcoal, sulfur on gypsum, polycrystalline silicon, aluminium foil, galvanised nails, a gold ring, a cast-iron pan, cans in a
collection cage and a bale of pressed cans, a lit bulb, lightning. The gold bars, helium balloons, oxygen tank, iron filings and copper wire are the ones
from hour 1 (credits from its notes). The element tiles and the table are drawn (`tools/make-periodic-table.py`); the circuit is drawn
(`build/media/circuit-test.py`); the recycle symbol, controller and clipboard are Noto emoji (`tools/make-pictures.js`).

## Open for Chuka

- **Check the four vials** against the slides (Lesson 2 and the double): copper shiny, carbon not shiny, sulfur not shiny, silicon shiny. If a vial looks different,
  trust the vial and change that answer in `build/metal-or-non-metal-answers.js` (and rebuild).
- **Check the circuit boards** with the five loose samples before Friday: sulfur must keep the bulb off and the pencil lead must light it.
- **Class size for the oral check:** the sheet has 25 rows.
