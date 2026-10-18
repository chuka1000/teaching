# Y9 — Unit 6: Human Actions and the Atmosphere

**Class:** `Y9` (9G and 9I are always at the same point, so one deck serves both; the manifest records class `Y9`). **Four hours:** four 50-minute
singles and a 45-minute assessment (245 minutes against a unit of 240, so five over; the plan takes them from Unit 5). Palette `atmosphere`
("Upper Air": a very dark navy, clear-sky cyan, clean-air green, smog red; new for this unit; contrast checked with `tools/check-contrast.js atmosphere`).
The unit follows Water (the last lesson was Pollution Pandemic).

## What was built

| # | Lesson | Deck, worksheet | Game | We Do | You Do |
|---|---|---|---|---|---|
| 1 | What Gets Into The Air | yes | | Finish It Off | worksheet (and the particulate traps go out) |
| 2 | What It Does To Us | yes | | Rank And Conquer | worksheet, with the six traps read at a station |
| 3 | The Ozone Layer | yes | | Spot The Mistake | worksheet |
| 4 | A Warming Planet | yes | Sorter (ozone depletion, climate change, air pollution) | Rank And Conquer | game |
| | Atmosphere assessment | paper, mark scheme, feedback | | | |

Each lesson's "previous" is the lesson before it. **Lesson 1's previous is Pollution Pandemic** (Water, Lesson 4), which Chuka supplied (it was not in
`reference/`; it is there now, with his edited Making It Last). There is **no dedicated fossil-fuels deck**: What The Earth Gives Us, Resource Depletion and
Making It Last treat coal, oil and gas only as examples of non-renewable resources (millions of years), and burning is not taught, so Lesson 1 starts at
the exhaust pipe and does not assume combustion beyond "burning fuel". Human Population Growth said only: "Burning fuel for energy changes the atmosphere
for every ecosystem at once."

**Title-slide dates are left blank** on every deck (`Date: ____________`); the Do Now notes say to type it.

## Decisions

- **Rank And Conquer: the best answer is not the longest** (Chuka, 2026-10-18; now in `TEMPLATE.md`). The kit (`build/atmosphere-kit.js`) refuses to build a
  Rank And Conquer in which the best answer is the longest or the shortest, or the four differ by more than a quarter in length. The weak answers are padded
  with believable filler (a wrong idea stated confidently, a true but irrelevant detail). The three Prokaryotes R&C slides already delivered have the flaw
  (the full-marks answer is the longest in each) and were not changed.
- **The three-problems table** (gas, where, harm, fixed?) is on the Lesson 4 You Do slide, next to the game that sorts into it; the Mark slide points back to it.
- **Particulate traps.** Six microscope slides smeared with petroleum jelly, labelled A to F on the back (A car park, B kitchen extractor, C classroom, D
  windowsill, E quiet corridor or lab, F sealed in a zip bag as the control); set out in Lesson 1 (two minutes, during the You Do), read in Lesson 2 at a station
  (by eye, then under the microscope: count the specks in three fields of view). The slides collect mostly larger settling particles and will not show
  individual PM2.5, so the notes say to call it "evidence that particles are in the air". A week is a safe minimum exposure (sources say 24 hours to 7 days).
- **Lesson 3's ozone film is NASA's own**: SVS 31392, "Antarctic Ozone Hole Maximum Area, 1979-2025" (public domain), converted to 960 by 540
  (`assets/media/atm-ozone-hole.mp4`). The CFC film, smog film, acid rain film and greenhouse film are generated (`build/media/`).
- **The evidence graphs** (`build/media/a-warming-planet-graphs.py`) are drawn from the real NOAA, NASA and NOAA Paleo files in `build/atmosphere-data/`.
- The games reuse the Prokaryotes Sorter code: `build/a-warming-planet-game.html` is the template with the palette and bin names changed, and
  `check-a-warming-planet-game.py` and `test-a-warming-planet-game.js` are the same checker and Playwright test.

## Corrections to the unit plan, found by fact-checking (see the notes of each deck)

| The plan said | What the decks say, and why |
|---|---|
| The 1952 London smog "killed around four thousand people in four days" | The smog lasted 5 to 9 December 1952. A government committee counted between 3,500 and 4,000 extra deaths, with about 4,000 the best estimate, **over the weeks ending 13 and 20 December**; a later study estimated about 12,000 from December 1952 to February 1953. "4,000 in four days" is a common error and the notes say not to say it. |
| Montreal worked because "the science was clear, there was a replacement, the harm was visible" | The risk was not easily observable. The defensible version: "the science was clear enough to act (and became clearer), industry had replacements, and the risk felt personal: skin cancer, and a hole you could see on a satellite map; richer countries paid to help poorer ones". |
| "Chlorine destroys thousands" | Sources differ: NASA Ozone Watch and the WMO say thousands; NASA's 2013 poster, UNEP and the EPA say about, up to or over 100,000. The decks say "thousands". |
| The ozone layer "absorbs most of the Sun's ultraviolet" | It absorbs all of UV-C and most of UV-B (the most harmful); most UV-A gets through. The slides say "the most harmful ultraviolet light". |
| Ozone "grows, then stops, then shrinks" | In the NASA record it grew to about 2000, then stopped growing; the season averages since 2000 show no significant trend (year-to-year changes of about 4 million km² swamp it), while the September data and the WMO say it is slowly recovering. The deck says "stopped growing and is slowly recovering"; full recovery over Antarctica is projected around 2066 (WMO 2022; the 2026 assessment is not out). The 2026 hole is running larger than recent years so far. |
| The ozone layer's height | "About 15 to 35 km" (WMO); other sources give slightly different ranges. |
| Particulates cause "asthma, bronchitis, heart disease" | UK government sources link bronchitis to sulfur dioxide, so particulates are given as asthma, heart disease and lung cancer. |
| Outdoor air pollution deaths | 4.2 million premature deaths in 2019 (WHO, outdoor only). The 6.7 or 7 million figure adds household air pollution. |
| A real greenhouse works "by stopping convection" | NOAA and the IPCC say mainly convection; NASA JPL says infrared filtering too. The notes say to avoid the claim, and "a real greenhouse also keeps warm air in, but the atmosphere works differently" if a student pushes. |
| Warming | Always give the baseline: the NASA graph is against 1951 to 1980; the IPCC gives 1.09 °C for 2011 to 2020 against 1850 to 1900; the WMO long-term level is about 1.4 °C; 2024 was likely the first year above 1.5 °C. 2025 was one of the three warmest (NASA says second, the others third). |
| Coral bleaching "ongoing" | NOAA: the fourth global event ran from early 2023 to mid-2025 and 84% of the world's reef area was hit; it has likely ended. |

## Numbers

Every number is checked in `build/atmosphere-check.py` (sympy), from the real data files where there are any; it writes `build/atmosphere.data.json`,
which the decks, worksheet answers and the assessment read. Data files (`build/atmosphere-data/`): NOAA Mauna Loa CO₂ (annual and monthly), NASA GISTEMP v4
global anomalies (relative to 1951 to 1980), the NASA Ozone Watch annual table (1979 to 2025; no 1995 row because the TOMS satellite instrument stopped in
December 1994), and the Bereiter et al. 2015 ice-core CO₂ composite (800,000 years).

## Shared code

- `build/atmosphere-kit.js`: the slide furniture and the standard slides (as the Prokaryotes kit, with the Rank And Conquer length check).
- `build/atmosphere-spec-kit.js`: the click builds for every standard slide.
- `build/atmosphere-sheet.js`: the worksheet furniture.
- Media: `build/media/what-gets-into-the-air-media.py` (photochemical smog), `what-it-does-to-us-media.py` (acid rain, the particle and haemoglobin pictures),
  `the-ozone-layer-media.py` (CFCs), `a-warming-planet-media.py` (the greenhouse effect, the layers diagram), `a-warming-planet-graphs.py` (the three graphs).
- Photographs: `assets/photos/atm_*.jpg`, with sources in `SOURCES.tsv` (public domain or Creative Commons; Wikimedia's image server refuses downloads from
  the build machine, so they came through Openverse and direct from US government sites).
