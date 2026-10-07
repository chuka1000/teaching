# The lesson template

What goes in each of the ten slides, and why. This is the reference when
building; `PEDAGOGY.md` is the reasoning behind it.

**The phase structure and timings do not change.** What this file settles is
what belongs *inside* each phase — which is where the last few decks have
drifted.

| # | Phase | Min | One-line purpose |
|---|---|---|---|
| 1 | Do Now | 10 | Retrieve what they already know |
| 2 | Today | 1 | Name the three things |
| 3 | Hook | 2 | Open a gap they want closed |
| 4 | I Do | 3 | Teach objective 1 |
| 5 | I Do | 3 | Teach objective 2 |
| 6 | We Do | 5 | Practise together, out loud |
| 7 | Cold Call | 6 | Check the whole room |
| 8 | You Do | 14 | Practise alone |
| 9 | Mark | 3 | Feedback while it is still warm |
| 10 | Plenary | 3 | Settle the misconceptions |

Exceptions: `T3` uses a different shape entirely — see `CLIL.md`. Doubles are
one deck of about 95 minutes with a break slide. Maths decks use the 10 × 5.625
canvas.

---

## 1 · Do Now — 10 minutes

Six questions in a 2 × 3 grid. Lesson title centred, date right, phase pill
left. Answers revealed one click at a time, and they are **real answers**, not
"keep what you wrote".

**Where the six come from:**

| Questions | From |
|---|---|
| 2 | Last lesson |
| 2 | Earlier in this unit |
| 1 | Last term, or another science |
| 1 | Previews today — unanswerable yet, settled later in the lesson |

The spacing is the point. Six questions about last lesson is a warm-up; six
questions across the term is teaching. The uncomfortable ones are the valuable
ones.

For `10A`, two of the six may come from biology or chemistry — Co-ordinated
Sciences is one course.

**Never:** new content, or a question the deck has not taught.

**How the answers look** (Chuka's edits to The Greatest Show On Earth, 8I, 2026-10-07):

- **A numeric answer is the working, then the answer and its unit: `120 ÷ 20 = 6 m/s`.**
  No full stops, and never the other way round ("6 m/s. 120 ÷ 20."). The same goes for
  any numeric answer in the Cold Call's answer boxes.
- **The preview question uses the command word "Suggest"** wherever it fits ("Suggest
  why…"). The class has not been taught it yet, so they suggest; they do not state.
- **The preview question's card is shaded**, so the room can see the answer is new. Its
  card and answer box swap colours: the card takes a warm tint with a darker accent
  border, and its answer box goes white. Galapagos values: card `F3E7CB`, border
  `A86E32`, answer box `FFFFFF`. For another palette, fill the card with that deck's
  answer-box tint and outline it in the palette's `accentInk`. Worked example:
  `qGrid(..., { preview: 5 })` in `build/the-greatest-show-on-earth.js`.

---

## 2 · Today — 1 minute

Three objectives, verb-led — *calculate*, *explain*, *describe*, *sort*. One
banner line underneath saying what the lesson is actually for.

Read them and move on. This slide is a contents page, not a lesson.

---

## 3 · Hook — 2 minutes

**A question with a gap in it, not an announcement of a topic.** "On 21 August
2017 a total eclipse crossed the USA. The time it would reach each town had
been published years earlier. How did they know?" is a hook. "Today we are
learning about models" is not.

Three options, A B C. **Take a vote and tally it on the board.** The commitment
matters: an answer you got wrong while feeling sure is corrected far more
strongly than one you were unsure about.

**Settle it later in the lesson, explicitly, pointing at the tally.** A hook
that is never resolved teaches students that hooks are decoration.

---

## 4 and 5 · I Do — 3 minutes each

**One objective per slide.** Not three. The commonest failure in recent decks
is an I Do that defines the thing in one sentence and then spends the rest of
the slide on something else.

Each one needs:

- **A worked example**, not just a definition. Show the thing being done.
- **Something visual** if the idea moves, changes or has a shape. Generate the
  animation — see the media section of `CLAUDE.md`.
- **Labels on the diagram itself.** Never a key, never text narrating what the
  picture already shows.
- **The same layout across both slides** where the two ideas contrast, so the
  difference is structural and not just verbal.

End one of them by pointing forward to where the idea reappears — in the next
lesson, or in another science.

---

## 6 · We Do — 5 minutes

Guided practice, out loud, with the teacher. **There are three modes, and the We
Do is always one of them.** Pick the one that fits the lesson, and never the same
one two lessons running in a unit (check the previous deck in `reference/`).

**Every mode needs a decision or a reason from the room, never the recall of one
word.** A We Do that can be answered with single words reads as condescending to a
secondary class (Chuka's feedback on The Greatest Show On Earth, 2026-10-07).

**Spot The Mistake** — four statements, each with its correction. Best when the
lesson has sharp misconceptions.

- **One of the four must already be correct**, so the task is *check this*
  rather than *find a flaw*. A student who says "this one is fine" has done
  better work than one who invents an error.
- **They commit before each reveal.**
- **Ask what the student did**, not what the right answer is. Naming the error
  is what stops them repeating it.
- Use real errors from the previous lesson's marking where you have them.

**Finish It Off** — three partially worked solutions; students supply what is
missing. Best when the lesson is a method (a calculation, a procedure), not a
concept. This is the rung between watching and doing.

- On a concept lesson the blanks shrink to single words. If it is used there, every
  blank gets a follow-up that needs thinking ("which step is that?", "why must it
  come there?"), and the notes say what it is.

**Rank And Conquer** — four answers to one exam-style question, written to differ
in quality in known ways: one with a wrong idea, one that is incomplete, one
missing a step, one that would get full marks. Best for "explain" objectives and
for evidence.

- **Rank.** The class commits to the weakest and the strongest by a show of hands.
  The slide then reveals the ranking one card at a time, each with one reason.
- **Conquer.** Take the answer that holds the lesson's main misconception and
  upgrade it together until it would rank first. The upgraded answer is the last
  click.
- The ranking must come from the mark scheme, not taste. Count what each answer
  has (for speciation: the barrier, different selection, many generations, the
  test), and put the count in the notes.

Rotate the three across a unit. A unit of nothing but Spot The Mistake teaches
error-hunting.

---

## 7 · Cold Call — 6 minutes

Six questions, no slide title, 16 pt. Name a student, *then* ask. Thinking time
before the answer. No hands up, no whiteboards.

If a student cannot answer, take it elsewhere and come back to them to repeat
it — nobody gets to leave the conversation.

**Two of the six should come from earlier lessons**, not today's.

---

## 8 · You Do — 14 minutes

The worksheet, or a game if asked. Google Classroom logo at 62% transparency,
heading matching the lesson name.

Three tiers — Bronze, Silver, Gold — and students choose. The choice is
deliberate: being able to pick is one of the few levers that reliably sustains
effort.

**Aim for about four right out of five on Bronze.** Much lower and they stop.
If Bronze is producing lots of errors, the problem is the I Do.

---

## 9 · Mark — 3 minutes

**Turn to the back. Mark your own in a different colour.**

Answers are printed upside down at the foot of the last worksheet page.

This phase is not optional and does not get absorbed into a longer You Do.
Marking straight after doing is a retrieval event and a feedback event at once;
without it, a student who has been making an error has practised it for
fourteen minutes and still does not know.

---

## 10 · Plenary — 3 minutes

Dark background. Five true/false statements.

- **Every FALSE is a real misconception from this lesson** — the ones named on
  the We Do and in the teacher notes.
- **At least one requires applying the idea**, not just recalling it. Five
  recall items check attendance, not understanding.
- Closing line: what the next lesson does, or — if this is the last of a unit —
  what the unit added up to.

---

## The worksheet

**Structure of each tier:**

1. **Fully worked.** Read it; do not solve it. Reading a correct solution is
   how a method is learned.
2. **Half worked.** First steps given, last step missing.
3. **Onwards.** Blank.

**Interleave, do not block.** Ten of the same question teaches the arithmetic
but never *choosing the method*, because the student knows what to do before
reading. Mix the types so each question requires a decision. Say so on the
sheet, or it looks like a mistake.

**Every worksheet carries:**

- One **"why does that step work?"** prompt, on the step most often got wrong.
- One **"where would you meet this outside the lesson?"** per topic, answered
  in their own words. Writing your own reason works where being given one does
  not, and it helps the students furthest behind the most.
- A RAG grid against the three objectives, start and end.
- **Answers upside down**, foot of the last page, under a rule.

---

## Before it is finished

- Phase minutes total 50, printed by the build script.
- Do Now spans more than last lesson; one question previews today.
- Each I Do teaches exactly one objective, with a worked example.
- We Do is Spot The Mistake, Finish It Off or Rank And Conquer, not last lesson's
  mode; it needs a decision or a reason, not one word; students commit before each
  reveal (Spot The Mistake: one row already correct).
- Do Now: numeric answers as `working = answer unit`, no full stops; the preview
  question says "Suggest" and has the shaded card.
- Cold Call includes two questions from earlier lessons.
- Worksheet interleaved, with a worked and a half-worked example per tier.
- "Why does that step work?" and "where would you meet this?" both present.
- Answers upside down on the last page.
- Plenary has at least one applied item.
- Hook is settled explicitly, pointing at the tally.
- Timer on every slide; `tools/check-timers.py` passes.
- Rendered, and every slide looked at.
