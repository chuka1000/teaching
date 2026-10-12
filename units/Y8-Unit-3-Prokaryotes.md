# Y8 — Unit 3: Prokaryotes

**Class:** `8I`. **Six hours:** six 50-minute singles and a 45-minute assessment (345 minutes of
the 360, so 15 spare). 8I is singles only: the Year 8 doubles on the timetable belong to `8CN`.
Palette `culture` (new for this unit: plum, agar lime, cyan stain, antibiotic red; contrast
checked with `tools/check-contrast.js culture`). The unit follows Unit 2, Natural Selection
(ends on Deep Time).

## What was built

| # | Lesson | Deck, worksheet | Game | We Do | You Do |
|---|---|---|---|---|---|
| 1 | Inside A Prokaryote | yes | | Rank And Conquer | worksheet, 11 min |
| 2 | How Prokaryotes Live | yes | | Finish It Off | worksheet |
| 3 | The Bacteria | yes | | Spot The Mistake | worksheet |
| 4 | Archaea And Extreme Places | yes | Sorter (bacterium, archaean, neither) | Rank And Conquer | game |
| 5 | The Bacteria We Need | yes (yoghurt practical on the last page) | | Finish It Off | worksheet and the yoghurt set-up |
| 6 | Pathogens And Antibiotics | yes | True or false blitz (20 statements) | Rank And Conquer | game |
| | Prokaryotes assessment | paper, mark scheme, feedback | | | |

Each lesson's "previous" is the lesson before it in this table. The Do Now of each lesson was
checked against the last three Do Nows in 8I. Lesson 1's previous is Deep Time. Lesson 6's Do
Now is a natural selection retrieval (Q3, Q4), as the unit plan asked, because resistance extends
what the class has already met in Natural Selection In Action.

**Dates are left blank on every title slide** (`Date: ____________`). The speaker notes of each Do
Now say to type it.

## Decisions (and what changed from the unit plan)

- **Cells.** `reference/` has no cells lesson for 8I, and Chuka's answer was "no, or not sure", so
  Lesson 1 builds a eukaryotic cell first. The phases are Do Now 10, Today 1, Hook 2, **I Do 6**,
  **I Do 5**, **We Do 4**, **Cold Call 5**, **You Do 11**, Mark 3, Plenary 3 = 50. It is the only
  lesson in the unit that departs from the standard shape. If the class has met cells, cut I Do 1 to
  2 minutes and give the time back to the You Do.
- **Antibiotic resistance** is taught as natural selection, with the four steps the class knows
  (variation, selection, survival, inheritance), and the animation shows the individual cells
  already resistant before the drug. "Learned", "immune", "adapted" and "fought back" are named as
  words to avoid in the notes.
- **Yoghurt practical** (Chuka's choice over agar plates): set up in the Lesson 5 You Do, read at
  the start of Lesson 6. UHT milk, 40 to 43 °C, 1 to 2 spoonfuls of plain live yoghurt per 500 mL,
  9 to 24 hours; no tasting; pH paper before and after. The record table is on the last page of the
  Lesson 5 worksheet. I could not read CLEAPSS first-hand: the notes ask for it to be checked against
  MRAT-135 and the technician.
- **Both games** were asked for (Sorter in Lesson 4, True or false blitz in Lesson 6); the worksheet
  is still produced for each lesson.

### Corrections to the unit plan, found by fact-checking (see the notes of each deck)

| The plan said | What the decks say, and why |
|---|---|
| Cyanobacteria "put the oxygen in the air before anything else was alive" | "They were making oxygen billions of years before the first plants or animals." Other bacteria lived first. |
| "Without bacteria you would be dead within days" | "Life on Earth could not carry on without bacteria." Germ-free animals live in sterile conditions; the effects take months and years. |
| About 70 billion after twelve hours | 2^36 = 68,719,476,736, about 69 billion. 69 billion E. coli weigh about 0.07 g, so the honest follow-up uses the mass: if the doubling never stopped, after about 44 hours the bacteria would outweigh the Earth. |
| "The most successful cells by mass" | "The most numerous cells on Earth, in almost every habitat." Plants have far more mass than bacteria. |
| Flagellum "spins like a propeller" | "A tail that spins and pushes the cell." House style has no similes. |
| Archaea ribosomes "like eukaryotes" | Not used. The differences taught are the cell wall, the cell membrane and the DNA. |
| "Archaea are the ancient ones" | Kept as the misconception to kill: both groups are very old and neither came from the other. |
| Finish the course "because feeling better means most are dead, not all" | "Take antibiotics exactly as the doctor says." The NHS says "as directed"; the old reasoning is debated (BMJ 2017). |
| "Hand gel kills viruses" (blitz) | Not used. Alcohol gel does not reliably kill norovirus. The blitz uses "Hand gel contains antibiotics" (false). |
| Resistance takes over "within days" | Weeks to months in a patient. The doubling numbers are a best case and the notes say so. |
| Human insulin "grown in bacteria that carry the gene" | Kept, with 1978 (first made in E. coli) and 1982 (Humulin approved). The gene goes in on a plasmid. |
| Flagellum and plasmid are "the two things your cells lack" | Mark scheme accepts any two of cell wall, plasmid, flagellum. A sperm tail is a different kind of structure, and the notes say so. |

## Numbers

Every number is checked in `build/prokaryotes-check.py` (sympy), which writes
`build/prokaryotes.data.json`; the decks, worksheet answers and games read that file. The assessment
has its own check, `build/prokaryotes-assessment-check.py`. Facts were checked against NHS, WHO,
UKHSA, OpenStax, NOAA and the primary papers named in the speaker notes. TB figures are for 2024
(WHO, March 2026); WHO's next report is due late 2026, so re-check before Lesson 6.

## Shared code

- `build/prokaryotes-kit.js`: the slide furniture and the standard slides (Do Now, Objectives, Hook,
  the three We Do modes, Cold Call, You Do, Mark, Plenary). A new lesson in this unit uses it.
- `build/prokaryotes-spec-kit.js`: the click builds for every standard slide.
- `build/prokaryotes-diagram.js` with `build/media/prokaryotes_cells.py`: the two cell diagrams
  (layers, anchor points, lettered and black-and-white versions) and the three shape drawings.
- `build/prokaryotes-sheet.js`: the worksheet furniture.
- Animations (`build/media/`): `how-prokaryotes-live-media.py` (binary fission and doubling),
  `the-bacteria-we-need-media.py` (insulin), `pathogens-and-antibiotics-media.py` (resistance and
  a plasmid passing between two bacteria). All silent, 960 × 540, played on click.
- Photographs: `assets/photos/bac_*.jpg`, with sources in `SOURCES.tsv`.

## The assessment

45 marks, 45 minutes: `build/prokaryotes-assessment.js` (content in
`prokaryotes-assessment-content.js`). Weighted to Lesson 6: Q9 is the six-mark resistance
explanation (four ideas, six mark points). The Extend variant of Q9 asks why resistance spreads
between species (plasmids); Support and Consolidate do not. No Latin species names anywhere in the
paper. Printed in black and white; the cell diagram is checked in greyscale.
