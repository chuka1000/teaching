# Y9 — Earth Resources revision game (test preparation, about one hour)

**Class:** `Y9` (9G and 9I). A single self-contained HTML file for students on their own devices (Google Classroom), built for a whole lesson of test
preparation. It covers all six Earth Resources lessons: What The Land Gives Us, Losing The Soil, Cities And What Can Be Done, What The Earth Gives Us,
Making It Last and Resource Depletion. There is no deck or worksheet: it replaces the lesson, not a You Do. Palette `topsoil`.

`out/Earth Resources Revision/Earth Resources Revision game.html`, built by `python3 build/earth-resources-bank.py && python3 build/earth-resources-game.py`.

## The five levels (54 questions, about 60 to 70 minutes at a normal pace; nobody is expected to finish)

| Level | Name | Questions | What it is |
|---|---|---|---|
| 1 | Recall it | 10 | One question from each part of the unit. Everyone should finish with green dots. |
| 2 | Use it | 12 | Match, order and choose; the first calculations (soil formation, sustainable yield, percentage points, percentage decrease, repeated halving). |
| 3 | Spot the mistake | 12 | The claim sounds right but is wrong: find what is wrong. Two-step sums. |
| 4 | Say it in words | 10 | The questions that look like the test. Four are **written answers**: the student types an answer, sees a model answer and **ticks the mark points** that the answer made. Honest self-marking, not auto-marking. |
| 5 | Past the test | 10 | Meant to be too hard (the house rule). Unfamiliar contexts, judging a claim, and two final puzzles drawn from pools of equal difficulty (a reversed sustainable-yield sum or a rate ratio; a multi-year count or a two-year stock with growth and cutting). |

Every level has the same skills in the same order for every student, so the diagnostic means the same thing for all of them. Only the item in each slot's
pool, the options' order and the numbers change from student to student (the game code on the start and end screens; add `#CODE` to the file's address to
see exactly what a student saw).

## What soil is made of (the teacher asked for this to be in the game)

Broken rock, dead organic matter (decomposed into humus), water and air (held in the gaps between particles) and living organisms (bacteria, fungi, worms,
insects): as taught in What The Land Gives Us, slide "What soil actually is". The unit request said "broken soil"; the deck's word is **broken rock**, so the
game says broken rock. It appears six times: tap the four parts (Level 1), match each part to what it is or does (Level 2), where water and air are held (Level 2),
"soil is just crushed rock" (Level 3), two written answers (Level 4) and the farmer who burns plant remains and the estate that seals soil (Level 5).

## Showing students how to improve

- Every wrong answer says what the mistake probably was, shows the working, and names the lesson to revise.
- After each level, a drop-down lists every question with the time taken, what the student wrote, and how to get to the answer.
- At the end: **your next steps**, the three weakest topics in Levels 1 to 4 (Level 5 is past the test, so it is not counted), each with the lesson to go
  back to, the idea to remember and what to practise; a bar for each topic and each kind of question; the mistakes the student made most, with the habit that
  fixes each; and the written mark points that were left out.
- "Print or save my plan" opens every drop-down and prints.

## Design decisions

- **The right answer is not the longest** (Chuka's Rank And Conquer rule, applied to every multiple-choice question here): `build/earth-resources-bank.py`
  refuses a bank where the right answer is clearly the longest in more than 30% of the items; the checker measures it across 300 games (20%, chance is 25%).
- All numbers are hypothetical where the deck did not give them (the soil formation rate per centimetre, the city and mine figures), and consistent with the deck:
  a few centimetres of soil take a few hundred to about a thousand years, so no soil-formation question has a total above 1,000 years in Levels 2 and 3.
- No timer on questions; "Stop and see my results" on every question; no storage; no network; offline.
- Real cases (helium, the Aral Sea, bluefin tuna, bison, passenger pigeons, humpback whales, cod) are taken from Resource Depletion, Making It Last and
  What The Earth Gives Us and say only what those decks say.

## Files

`build/earth-resources-game.html` (the engine and the numeric templates), `earth-resources-bank.py` with `earth_resources_helpers.py`, `earth_resources_l12.py`,
`earth_resources_l3.py` and `earth_resources_l45.py` (the questions, all five levels), `earth-resources.bank.json` (the generated bank),
`earth-resources-game.py` (writes the bank into the file), `test-earth-resources-game.js` (Playwright, 1280 by 800 and 390 by 844) and
`check-earth-resources-game.py` (sympy and structure over 300 generated games).
