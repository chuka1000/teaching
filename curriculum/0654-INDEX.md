# Cambridge IGCSE Co-ordinated Sciences 0654 — scheme of work index

The full scheme is `curriculum/0654_Scheme_of_Work.pdf`: **198 pages**.

**Do not read it whole.** Look up the topic here, then extract only those
pages. The whole document is about 250 hours of teaching; any one lesson needs
two or three pages of it.

```bash
# read one topic
pdftotext -layout -f <start> -l <end> curriculum/0654_Scheme_of_Work.pdf -

# or find a specific objective anywhere in the scheme
python3 tools/syllabus.py P1.4
```

Declared teaching time totals 253 hours across the double award.

| Code | Topic | Hours | Pages |
|---|---|---|---|
| `B1` | Characteristics of living organisms | 1 | 15–15 |
| `B2` | Cells | 3 | 16–18 |
| `B3` | Movement into and out of cells | 5 | 19–21 |
| `B4` | Biological molecules | 2 | 22–23 |
| `B5` | Enzymes | 4 | 24–25 |
| `B6` | Plant nutrition | 4 | 26–28 |
| `B7` | Human nutrition | 6 | 29–32 |
| `B8` | Transport in plants | 5 | 33–35 |
| `B9` | Transport in animals | 6 | 36–40 |
| `B10` | Diseases and immunity | 4 | 41–43 |
| `B11` | Gas exchange in humans | 4 | 44–45 |
| `B12` | Respiration | 3 | 46–47 |
| `B13` | Coordination and response | 8 | 48–51 |
| `B14` | Drugs | 2 | 52–53 |
| `B15` | Reproduction | 6 | 54–58 |
| `B16` | Inheritance | 8 | 59–62 |
| `B17` | Variation and selection | 6 | 63–64 |
| `B18` | Organisms and their environment | 4 | 65–67 |
| `B19` | Human influences on ecosystems | 4 | 68–70 |
| `C1` | States of matter | 4 | 71–74 |
| `C2` | Atoms, elements and compounds | 12 | 75–83 |
| `C3` | Stoichiometry | 10 | 84–89 |
| `C4` | Electrochemistry | 6 | 90–93 |
| `C5` | Chemical energetics | 6 | 94–96 |
| `C6` | Chemical reactions | 8 | 97–100 |
| `C7` | Acids, bases and salts | 7 | 101–105 |
| `C8` | The Periodic Table | 5 | 106–109 |
| `C9` | Metals | 7 | 110–115 |
| `C10` | Chemistry of the environment | 5 | 116–119 |
| `C11` | Organic chemistry | 8 | 120–127 |
| `C12` | Experimental techniques and chemical analysis | 6 | 128–133 |
| `P1` | Motion, forces and energy | 18 | 134–149 |
| `P2` | Thermal physics | 12 | 150–157 |
| `P3` | Waves | 16 | 158–168 |
| `P4` | Electricity and magnetism | 18 | 169–184 |
| `P5` | Nuclear physics | 10 | 185–190 |
| `P6` | Space physics | 10 | 191–197 |

## What each entry gives you

For every syllabus reference the scheme lists the **learning objective** in
Cambridge's own wording and a column of **suggested teaching activities** —
including named practicals, PhET simulations, Resource Plus teaching packs, and
the specific misconceptions Cambridge expects. Quote the objective wording
exactly; it is what the exam is written against.

## Using it for synoptic links

10A sit one course covering all three sciences, so a link across them is not a
flourish — it is the same syllabus. When building a Physics lesson, check
whether the idea appears in a B or C topic and say so. Worked examples:

- **P1.4 Density** ↔ `C1` States of matter (particle packing explains density)
  ↔ `P2` Thermal physics (convection is explained by density changes).
- **P5 Nuclear physics** ↔ `C2` Atoms, elements and compounds (same nucleus,
  two subjects).
- **P1.7 Energy** ↔ `B12` Respiration and `C5` Chemical energetics.

The Do Now is the natural place for these. See CLAUDE.md.