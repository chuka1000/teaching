# Assessments

One per topic. Three documents, all A4, all printed in **black and white**.

```
out/Motion Graphs assessment/
  Motion Graphs assessment.docx     <- students sit this
  Motion Graphs mark scheme.docx    <- TEACHER ONLY
  Motion Graphs feedback.docx       <- the follow-up lesson
```

**45 minutes. Around 45 marks.** One mark per minute is the exam convention and
it is what makes the timing predictable.

Build one only when asked.

---

## Black and white, and printed

Every rule below exists because this goes through a photocopier, not a
projector. **None of the deck's palette or media rules apply here.**

- **No colour. At all.** Not for headings, not for emphasis, not for table
  fills. Black text, greys for rules and shading.
- **No colour-coded diagrams.** Distinguish regions by hatching or labels;
  distinguish lines on a graph by style — solid, dashed, dotted — never by
  colour.
- **Photographs must survive greyscale.** Convert and look before using one. A
  photograph that relies on colour contrast becomes a grey rectangle.
- **Check it properly**: render the PDF, convert to greyscale, and look at
  every page.

```bash
convert -colorspace Gray assessment.pdf gray-%02d.png   # then view them
```

- **Answer space is proportional to marks.** One mark, one line. Four marks,
  five or six lines. Students read the space as a signal of how much to write.
- **Never split a question across a page break.** Use `cantSplit` on the row or
  force a page break before it.
- **Marks in brackets, right-aligned**, at the end of every part: `[3]`.
- **Front page**: title, name, class, date, total marks, time allowed, and
  "Answer all questions. Show your working."

---

## Shape of the paper

Difficulty ramps across the paper. Roughly:

| Part | Questions | Marks | Demand |
|---|---|---|---|
| Opening | 3–4 | ~10 | Recall, definitions, one-step |
| Middle | 3–4 | ~18 | Application, calculation, reading data |
| End | 2–3 | ~17 | Analysis, explanation, multi-step |

**Widen the skills deliberately.** Across one paper aim to include:

- a definition or statement of a law
- a calculation with units
- something read off a graph, table or diagram
- something drawn or completed by the student
- an explanation of *why*, not just *what*
- a misconception to diagnose — "a student says… explain what is wrong"
- a question in an unfamiliar context, applying a familiar idea

A paper that is ten calculations tests one skill ten times.

**Command words carry meaning.** *State* wants a sentence, *Describe* wants
what happens, *Explain* wants why, *Calculate* wants working. For `10A` use
Cambridge's command words with Cambridge's definitions — they are in the
syllabus and the exam is written against them.

---

## The questions come from the lessons

**Read every referenced deck before writing a single question.** The
assessment tests what was taught, in the words it was taught in.

For each deck take: the objectives from the Today slide, the worked examples
from the I Do slides, the misconceptions from the We Do, and the Answers slide.

**A question testing something not in the referenced decks is a bug**, not a
stretch. If the paper feels thin, the topic was thin — say so rather than
importing content.

Reuse numbers sparingly. A question identical to one from the worksheet tests
memory, not understanding; change the context or the values.

---

## The mark scheme

Separate document, **TEACHER ONLY** in the header, never given to students.

- **One mark point per line**, with a semicolon at the end — exam convention
  and it makes marking fast.
- **Accept and reject lists** where wording varies: *accept "goes up"; reject
  "gets bigger" without a quantity*.
- **Allow error carried forward.** If they get part (a) wrong and use their own
  wrong answer correctly in part (b), part (b) scores. Say so explicitly on
  every multi-part question.
- **Units.** State where a unit is required for the mark and where it is not.
- **The likely wrong answer, named.** For each question add one line: what most
  of the wrong answers will look like. That is what makes the feedback lesson
  plannable before the papers are marked.
- Every numeric answer verified with sympy before it is written.

---

## The feedback sheet

For the lesson after the assessment. **Three variants of every question:**

| Variant | For | What it is |
|---|---|---|
| **Support** | Got it wrong | Same skill, smaller numbers, more scaffold. Often the same question with the first step done. |
| **Consolidate** | Nearly right | Same demand, fresh context. They can do it; they need to do it again cleanly. |
| **Extend** | Full marks | Harder — an extra step, a reversal, or the same idea somewhere unfamiliar. |

Lay it out as one sheet: question number down the page, the three variants
across. A student finds their question number and does the variant their mark
directs them to.

**It is a bank, not a worklist.** Thirty items will not fit a lesson. The
teacher sends each student to the two or three that match their errors, so the
mark scheme's "likely wrong answer" line is what makes it usable.

No answers on the student sheet. Put the feedback-variant answers at the end of
the **mark scheme**, so one teacher document covers everything.

---

## Asking for one

```
ASSESSMENT: <topic name>
CLASS:      <code>
COVERS:     reference/<lesson>.pptx
            reference/<lesson>.pptx
            reference/<lesson>.pptx
NOTES:      <anything to weight, include or leave out>
```

---

## Definition of done

1. **Marks total the stated number**, and each question's marks are printed.
2. **Every referenced lesson is represented**, and nothing else is.
3. **The skills list above is covered** — check it off rather than assuming.
4. **Every numeric answer verified with sympy**, and the mark scheme agrees
   with the paper.
5. **Rendered, converted to greyscale, and looked at** — every page.
6. **No question split across a page break.**
7. **Three variants exist for every question**, with answers in the mark
   scheme.
