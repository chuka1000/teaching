/**
 * Y9 Science — Earth Resources, Lesson 3: Cities, and what can be done.
 * Single, 50 minutes. Standard archetype. Taught identically to 9G and 9I
 * (TIMETABLE.md). 'topsoil' palette, same unit as What The Land Gives Us and
 * Losing The Soil.
 *
 * Follows reference/Losing The Soil.pptx. That deck was taught unchanged
 * except for a handful of edits by Chuka, and the edits are the evidence for
 * THEY FOUND HARD, which the brief left blank:
 *  - he added "(what collects in the catch pots)" after "runoff" on the
 *    practical slide, so the WORD runoff did not land. Runoff is retrieved in
 *    Do Now and defined in brackets every time it appears today;
 *  - he softened the Hook and reworded the timescale answers, and marked the
 *    I Do 2 banner "Again", so soil vs coal timescales were still being
 *    carried. Today they come back where they earn their place: soil sealed
 *    under a road is lost for centuries;
 *  - last lesson's own notes flagged Gold Q10, judging a claim, as the stall
 *    point. Gold Q9 is a judged claim again, scaffolded (what is true in it,
 *    what is not, what is your example).
 * Say so if the guess is wrong.
 *
 * AVOID, per the brief: ending on damage, and objective 3 needing real
 * examples rather than "we should recycle". So the order is damage first
 * (I Do 1), then the fix (I Do 2), and every phase after that leans on the
 * fix: We Do, Cold Call, You Do Silver Q6-7, Gold Q9-10, and a Plenary whose
 * last statements and closing line are the positive ones. The two examples
 * are real and checked:
 *  - Wuhan, China, a "sponge city": pilot projects from 2015 (288 in the
 *    demonstration areas) using permeable paving, rain gardens and green
 *    roofs; China's national target was for 80% of urban areas to soak up and
 *    reuse at least 70% of rainwater by 2020. Presented as a design aim, not
 *    a proven result.
 *  - London Green Belt: about 500,000 hectares (sources run from 486,000 to
 *    513,000), formalised by the 1947 Town and Country Planning Act to check
 *    sprawl, with "recycling of derelict and other urban land" among its stated
 *    purposes.
 * Urbanisation figures: UN World Urbanization Prospects 2025, 45% of the
 * world's 8.2 billion in cities, 36% in towns, 19% rural; in 1950 about 20%
 * lived in cities. The 2025 edition uses the Degree of Urbanization (a city
 * is at least 50,000 people at 1,500 per square kilometre), not national
 * definitions, which is why older "57% urban" figures look different.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('topsoil');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');

const DATE = 'Thursday 8 October 2026';
const LESSON = 'Cities And What Can Be Done';
const GC_LOGO = path.join(__dirname, '..', 'assets', 'classroom.png');
const ICON = (name, role = 'accentInk') => path.join(__dirname, '..', 'assets', 'icons', `${name}_topsoil_${role}.png`);

const TIMER_X = 0.34, TIMER_W = 0.50, TIMER_Y = 0.34, TIMER_H = H - 0.68;
const M = 1.28, RIGHT = W - 0.60, CW = RIGHT - M;
const PILL_Y = 0.34, PILL_H = 0.36;
const TITLE_Y = 0.92, BODY_Y = 2.10;

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'W16x9', width: W, height: H });
pptx.layout = 'W16x9';
pptx.author = 'Chuka';
pptx.title = LESSON;
pptx.subject = 'Y9 Science · Earth Resources · Lesson 3';

const S = pptx.ShapeType;
const _addSlide = pptx.addSlide.bind(pptx);
pptx.addSlide = function (...args) {
  const sl = _addSlide(...args);
  const _addText = sl.addText.bind(sl);
  sl.addText = (txt, opts = {}) => _addText(txt, opts.shape ? { ...opts } : { ...opts, isTextBox: true });
  return sl;
};

const bg = (slide, mode) => { slide.background = { color: mode === 'dark' ? C.dark : C.tint }; };
function timer(slide, minutes, mode) {
  return addTimer(pptx, slide, {
    key: 'topsoil', palette: C, minutes, mode, slideH: H,
    x: TIMER_X, y: TIMER_Y, w: TIMER_W, h: TIMER_H,
  });
}
function pill(slide, label, minutes, mode) {
  const text = `${label.toUpperCase()} · ${minutes} MIN`;
  slide.addText(text, {
    shape: S.roundRect, rectRadius: 0.16,
    x: M, y: PILL_Y, w: Math.max(1.6, 0.098 * text.length + 0.60), h: PILL_H,
    fill: { color: mode === 'dark' ? C.accent : C.dark },
    color: mode === 'dark' ? C.dark : 'FFFFFF',
    fontFace: F.body, fontSize: 11, bold: true, charSpacing: 1.2,
    align: 'center', valign: 'middle', margin: 0, objectName: 'phase_pill',
  });
}
const title = (slide, text, mode, size = 32) => slide.addText(text, {
  x: M, y: TITLE_Y, w: CW, h: 0.80, color: mode === 'dark' ? C.tint : C.dark,
  fontFace: F.title, fontSize: size, bold: true, valign: 'middle', margin: 0, objectName: 'slide_title',
});
const sub = (slide, text, mode) => slide.addText(text, {
  x: M, y: TITLE_Y + 0.80, w: CW, h: 0.40, color: mode === 'dark' ? C.tintDeep : C.inkSoft,
  fontFace: F.body, fontSize: 16, valign: 'middle', margin: 0, objectName: 'slide_sub',
});
function card(slide, o) {
  slide.addShape(S.roundRect, {
    x: o.x, y: o.y, w: o.w, h: o.h, rectRadius: 0.10,
    fill: { color: o.fill || 'FFFFFF' }, line: { color: o.line || 'D8DEEC', width: o.lineWidth || 1.3 },
    objectName: `${o.name}_bg`,
  });
}
function badge(slide, o) {
  slide.addShape(S.ellipse, {
    x: o.x, y: o.y, w: 0.42, h: 0.42, fill: { color: C.accent }, line: { color: C.accent, width: 0 },
    objectName: `${o.name}_badge`,
  });
  slide.addText(String(o.n), {
    x: o.x, y: o.y, w: 0.42, h: 0.42, color: C.dark, fontFace: F.title, fontSize: 14,
    bold: true, align: 'center', valign: 'middle', margin: 0, objectName: `${o.name}_num`,
  });
}
function banner(slide, text, o) {
  slide.addText(text, {
    shape: S.roundRect, rectRadius: 0.12,
    x: o.x ?? M, y: o.y, w: o.w ?? CW, h: o.h ?? 0.70, fill: { color: C.dark }, line: { color: C.dark, width: 0 },
    color: C.accent, fontFace: F.body, fontSize: o.size ?? 16, bold: true,
    align: 'center', valign: 'middle', margin: 0.1, objectName: o.name,
  });
}

const PHASES = [];

/* ================================================================== *
 * 1. DO NOW · 10
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 10, 'light'));
  pill(s, 'Do Now', 10, 'light');
  s.addText(LESSON, {
    x: 3.20, y: 0.22, w: 6.90, h: 0.66, color: C.dark, fontFace: F.title, fontSize: 22,
    bold: true, align: 'center', valign: 'middle', margin: 0, objectName: 'lesson_title',
  });
  s.addText(DATE, {
    x: RIGHT - 3.40, y: PILL_Y, w: 3.40, h: PILL_H, color: C.inkSoft, fontFace: F.body,
    fontSize: 13, align: 'right', valign: 'middle', margin: 0, objectName: 'lesson_date',
  });
  s.addShape(S.rect, {
    x: M, y: 0.98, w: CW, h: 0.04, fill: { color: C.accent }, line: { color: C.accent, width: 0 }, objectName: 'rule',
  });
  const QS = [
    ['Describe what erosion is.', 'Soil worn away and carried off by water or wind.'],
    ['State what runoff is.', 'Rain that flows over the ground instead of soaking in.'],
    ['State how long a few centimetres of soil take to form.', 'A few hundred to about a thousand years.'],
    ['Name one way farming can cause erosion.', 'Ploughing, too many animals, or clearing trees.'],
    ['State what happens to rain that falls on a road.', 'It cannot soak in. It runs off into drains.'],
    ['Do more people live in towns and cities, or in the countryside?', 'Towns and cities.'],
  ];
  const cw = (CW - 0.30) / 2, ch = 1.62;
  QS.forEach(([q, a], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * (cw + 0.30), y = 1.24 + row * (ch + 0.20);
    card(s, { x, y, w: cw, h: ch, name: `d${i}` });
    badge(s, { x: x + 0.22, y: y + 0.18, n: i + 1, name: `d${i}` });
    s.addText(q, {
      x: x + 0.80, y: y + 0.14, w: cw - 1.02, h: 0.78, color: C.ink, fontFace: F.body,
      fontSize: 15, valign: 'middle', margin: 0, lineSpacing: 19, objectName: `d${i}_q`,
    });
    s.addText(a, {
      shape: S.roundRect, rectRadius: 0.10, x: x + 0.22, y: y + 1.00, w: cw - 0.44, h: 0.48,
      fill: { color: 'ECE1CB' }, line: { color: C.accent, width: 1.3 },
      color: C.dark, fontFace: F.body, fontSize: 12.5, bold: true,
      align: 'left', valign: 'middle', margin: 0.08, objectName: `d${i}_a`,
    });
  });
  s.addNotes(
    'DO NOW. 10 minutes. Six clicks.\n\n'
    + 'Q1 TO Q4 ARE RETRIEVAL FROM LOSING THE SOIL. Q2 is deliberate: "runoff" was the word that did not land last lesson (you had to add "what collects in the catch pots" to the practical slide). It comes back in this lesson, so get it secure now. The answer: rain that flows over the surface instead of soaking in.\n\n'
    + 'Q3 IS THE TIMESCALE, ONCE MORE. Soil is still the idea they carry least securely, and today it does real work: soil sealed under concrete is lost for centuries.\n\n'
    + 'Q5 AND Q6 ARE PRIMING, NOT TAUGHT YET. Q5 is the whole of today\'s second objective in one everyday picture. Q6: accept any answer, the Hook gives the actual figures.\n\n'
    + 'TAUGHT IDENTICALLY TO 9G AND 9I. CHANGE THE DATE before you teach.'
  );
}

/* ================================================================== *
 * 2. TODAY · 1
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 1, 'light'));
  pill(s, 'Today', 1, 'light');
  title(s, 'Today', 'light');
  const GOALS = [
    'Describe what urbanisation is.',
    'Explain how building on land changes it.',
    'Describe two things that reduce damage to land.',
  ];
  const cw = (CW - 2 * 0.30) / 3;
  GOALS.forEach((g, i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.30, w: cw, h: 1.96, name: `o${i}` });
    badge(s, { x: x + 0.26, y: BODY_Y + 0.52, n: i + 1, name: `o${i}` });
    s.addText(g, {
      x: x + 0.26, y: BODY_Y + 1.08, w: cw - 0.52, h: 1.00, color: C.ink, fontFace: F.body,
      fontSize: 15.5, bold: true, valign: 'top', margin: 0, lineSpacing: 20, objectName: `o${i}_t`,
    });
  });
  banner(s, 'Cities change land. They can also be built to protect it.', { y: BODY_Y + 2.58, size: 17, name: 'obj_banner' });
  s.addNotes(
    'TODAY. 1 minute. Four clicks.\n\n'
    + 'THE BANNER GIVES THE SHAPE OF THE LESSON, and it deliberately does not end on damage. Objectives 1 and 2 are what cities do to land. Objective 3 is what can be done, with real places, and it is where the lesson finishes.\n\n'
    + 'SAY "URBANISATION" OUT LOUD AND HAVE THEM SAY IT. It is a long word, and the whole lesson depends on it.'
  );
}

/* ================================================================== *
 * 3. HOOK · 2
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 2, 'light'));
  pill(s, 'Hook', 2, 'light');
  s.addText('In 1950, about 20 in every 100 people lived in a city. How many do now?', {
    x: M, y: 0.86, w: CW, h: 1.06, color: C.dark, fontFace: F.title, fontSize: 26,
    bold: true, valign: 'middle', margin: 0, lineSpacing: 32, objectName: 'slide_title',
  });
  const OPTS = [['A', 'About 25 in 100'], ['B', 'About 45 in 100'], ['C', 'About 70 in 100']];
  const cw = (CW - 2 * 0.30) / 3;
  OPTS.forEach(([k, txt], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.62, w: cw, h: 1.70, name: `h${i}` });
    s.addText(k, {
      x: x + 0.28, y: BODY_Y + 0.84, w: 0.60, h: 0.50, color: C.alert, fontFace: F.title,
      fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_k`,
    });
    s.addText(txt, {
      x: x + 0.28, y: BODY_Y + 1.34, w: cw - 0.56, h: 0.70, color: C.dark, fontFace: F.title,
      fontSize: 20, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_t`,
    });
  });
  s.addNotes(
    'HOOK. 2 minutes. Four clicks.\n\n'
    + 'Hands up for each. Tally on the board. Expect a spread, and a lot of C: most people think cities hold most of the world already.\n\n'
    + 'DO NOT REVEAL THE ANSWER HERE. I Do 1 gives it.\n\n'
    + 'ANSWER, FOR YOU: B. The UN\'s World Urbanization Prospects 2025 puts 45% of the 8.2 billion people in cities, another 36% in towns and 19% in rural areas. In 1950 it was about 20% in cities. Two thirds of the growth to 2050 is expected in cities.\n\n'
    + 'IF A STUDENT QUOTES 57% URBAN (an older figure), they are not wrong. Older figures use each country\'s own definition of "urban". The 2025 report uses one common definition: a city is at least 50,000 people at 1,500 or more per square kilometre. Say so in one sentence and move on.'
  );
}

/* ================================================================== *
 * 4. I DO · 3 — urbanisation, and what it does to land
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Urbanisation, and what it does to land', 'light', 30);

  card(s, { x: M, y: BODY_Y + 0.02, w: CW, h: 1.02, name: 'def' });
  s.addText([
    { text: 'Urbanisation: towns and cities grow, and a bigger share of people live in them.', options: { bold: true, fontSize: 16, color: C.dark, breakLine: true } },
    { text: 'Hook answer: B. About 45 in 100 people now live in cities, and another 36 in 100 in towns.', options: { bold: false, fontSize: 13.5, color: C.inkSoft } },
  ], {
    x: M + 0.30, y: BODY_Y + 0.02, w: CW - 0.60, h: 1.02, fontFace: F.body,
    valign: 'middle', margin: 0, lineSpacing: 21, objectName: 'def_t',
  });
  const ITEMS = [
    ['road', 'COVERED', 'Concrete and tarmac cover the soil. Soil under a road cannot grow anything, and takes centuries to form again.'],
    ['rain', 'RUNOFF', 'Rain cannot soak in. It runs off quickly over the surface (runoff) into drains, and can flood streets.'],
    ['thermometer', 'HOTTER', 'Dark surfaces soak up heat and there are fewer plants, so a big city can be several degrees warmer than the countryside.'],
    ['tree', 'HABITAT LOST', 'Trees and fields are cleared, so wildlife loses its home.'],
  ];
  const cw = (CW - 3 * 0.20) / 4, cy = BODY_Y + 1.26, ch = 2.62;
  ITEMS.forEach(([icon, name, text], i) => {
    const x = M + i * (cw + 0.20);
    card(s, { x, y: cy, w: cw, h: ch, name: `ch${i}` });
    s.addImage({ path: ICON(icon), x: x + 0.20, y: cy + 0.20, w: 0.5, h: 0.5, objectName: `ch${i}_icon` });
    s.addText(name, {
      x: x + 0.82, y: cy + 0.20, w: cw - 0.95, h: 0.5, color: C.dark, fontFace: F.title,
      fontSize: 14, bold: true, valign: 'middle', margin: 0, objectName: `ch${i}_h`,
    });
    s.addText(text, {
      x: x + 0.20, y: cy + 0.86, w: cw - 0.40, h: ch - 1.0, color: C.ink, fontFace: F.body,
      fontSize: 12.5, valign: 'top', margin: 0, lineSpacing: 16, objectName: `ch${i}_t`,
    });
  });
  banner(s, 'That is the damage. Next: what reduces it.', { y: BODY_Y + 4.12, h: 0.62, size: 17, name: 'ido_banner' });
  s.addNotes(
    'I DO. 3 minutes. Six clicks: the definition, the four changes, then the bridge.\n\n'
    + 'THE DEFINITION HAS TWO HALVES: cities grow, AND a bigger share of people live in them. It is a share, not just a number. The Hook figures (20 in 100 in 1950, 45 in 100 now) are the share going up.\n\n'
    + 'COVERED IS THE ONE TO SLOW DOWN ON. This is where last lesson comes back: a few centimetres of soil took a few hundred to about a thousand years to form, and once it is under concrete it cannot do its job (grow plants, soak up rain). It is not "destroyed" in a moment, it is sealed, and for anyone alive that is the same as gone. Say "centuries to make", and let them finish the line: "years to lose".\n\n'
    + 'RUNOFF: say the word and give the bracket every time. Runoff is rain that flows over the surface instead of soaking in. It is the tray practical, on a road. Bare tray, fast runoff.\n\n'
    + 'HOTTER: the city is warmer because dark surfaces soak up heat and there are fewer plants to cool the air by giving off water. Do not give a number: it varies a great deal (a few degrees on average, much more on some evenings).\n\n'
    + 'THE BRIDGE BANNER IS THE POINT OF THE SLIDE. Stop here for one second, then click. The next slide is what can be done, and the lesson is not going to end on this one.'
  );
}

/* ================================================================== *
 * 5. I DO · 3 — two things that reduce the damage
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'Two things that reduce the damage', 'light');

  const CARDS = [
    {
      icon: 'water', head: 'Let rain soak in',
      what: 'Permeable paving, rain gardens and green roofs let rain soak in or be stored, instead of running off. (Permeable: water can pass through.)',
      place: 'Real example: Wuhan, China',
      ex: 'A "sponge city". From 2015 it ran 288 pilot projects with permeable paving, rain gardens and green roofs. China\'s target: soak up and reuse at least 70% of rain.',
      gain: 'Less runoff. Less flooding.',
    },
    {
      icon: 'tree', head: 'Keep land from being built on',
      what: 'A green belt keeps a ring of land around a city open. New building goes first on land already built on (brownfield).',
      place: 'Real example: the London Green Belt',
      ex: 'About 500,000 hectares kept open around London since the 1947 planning law. The aim: stop the city spreading over fields.',
      gain: 'Fields and soil stay as they are.',
    },
  ];
  const cw = (CW - 0.30) / 2, y = BODY_Y - 0.05, ch = 4.15;
  CARDS.forEach((c, i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y, w: cw, h: ch, name: `rd${i}` });
    s.addImage({ path: ICON(c.icon), x: x + 0.24, y: y + 0.20, w: 0.5, h: 0.5, objectName: `rd${i}_icon` });
    s.addText(c.head, {
      x: x + 0.90, y: y + 0.20, w: cw - 1.1, h: 0.5, color: C.dark, fontFace: F.title,
      fontSize: 18, bold: true, valign: 'middle', margin: 0, objectName: `rd${i}_h`,
    });
    s.addText(c.what, {
      x: x + 0.28, y: y + 0.90, w: cw - 0.56, h: 0.95, color: C.ink, fontFace: F.body,
      fontSize: 13.5, valign: 'top', margin: 0, lineSpacing: 18, objectName: `rd${i}_w`,
    });
    s.addShape(S.roundRect, {
      x: x + 0.22, y: y + 1.92, w: cw - 0.44, h: 1.52, rectRadius: 0.08,
      fill: { color: 'ECE1CB' }, line: { color: C.accent, width: 1.3 }, objectName: `rd${i}_exbg`,
    });
    s.addText(c.place, {
      x: x + 0.40, y: y + 1.98, w: cw - 0.8, h: 0.38, color: C.accentInk, fontFace: F.body,
      fontSize: 13, bold: true, valign: 'middle', margin: 0, objectName: `rd${i}_place`,
    });
    s.addText(c.ex, {
      x: x + 0.40, y: y + 2.36, w: cw - 0.8, h: 1.02, color: C.dark, fontFace: F.body,
      fontSize: 12.5, valign: 'top', margin: 0, lineSpacing: 16, objectName: `rd${i}_ex`,
    });
    s.addText(c.gain, {
      x: x + 0.28, y: y + 3.56, w: cw - 0.56, h: 0.46, color: C.support, fontFace: F.body,
      fontSize: 15, bold: true, italic: true, valign: 'middle', margin: 0, objectName: `rd${i}_gain`,
    });
  });
  banner(s, 'Cities change land. They can also be built to protect it.', { y: 6.42, h: 0.62, size: 17, name: 'rd_banner' });
  s.addNotes(
    'I DO. 3 minutes. Three clicks: the first thing, the second thing, then the banner. This is the closing note of the lesson, per the brief, so give it the room.\n\n'
    + 'BOTH ARE REAL PLACES WITH REAL NUMBERS. Neither is "we should recycle". Point at the map if you have one: Wuhan, central China. London, and the ring of land round it.\n\n'
    + 'LET RAIN SOAK IN, IN ONE LINE: everything on I Do 1 that went wrong (runoff, floods, heat) is because rain cannot soak in. Sponge cities try to undo exactly that. Rain gardens are planted dips that collect roof and road water, permeable paving has gaps or pores that let water through, green roofs are planted roofs that hold water. Say what each one looks like.\n\n'
    + 'BE HONEST ABOUT WUHAN. It is a real programme, and 288 pilot projects from 2015 is a real figure. The 70% is a national TARGET that China set, not a proven result, and how well projects have worked varies. Teach it as a design aim that makes physical sense, not as a solved problem. That honesty is part of the judging skill on Gold.\n\n'
    + 'KEEP LAND FROM BEING BUILT ON, IN ONE LINE: the soil that is not built on is soil that is not sealed. The London Green Belt is about 500,000 hectares (sources put it between 486,000 and 513,000). It came from the 1947 planning law and its stated aims include stopping sprawl and encouraging the reuse of derelict urban land. Brownfield means land that has been built on before. Be fair: the green belt protects OPEN land, and it is argued about, because people also need housing. You do not need to settle that, just do not claim it is perfect.\n\n'
    + 'THE BANNER CLOSES THE LOOP WITH TODAY. Point back to the first slide. The rest of the lesson practises these two and ends on them.'
  );
}

/* ================================================================== *
 * 6. WE DO · 5
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 5, 'light'));
  pill(s, 'We Do', 5, 'light');
  title(s, 'What should be the correct answer?', 'light');
  sub(s, 'Spot the mistake.', 'light');
  const ROWS = [
    ['"Urbanisation means cities are getting hotter."', 'Urbanisation means towns and cities growing, with a bigger share of people living in them.'],
    ['"Rain soaks into tarmac, so cities flood less."', 'Rain cannot soak in. It runs off (runoff) into drains, and can flood streets.'],
    ['"Sponge cities send rain away faster."', 'The opposite. They let rain soak in or be stored, with permeable paving, rain gardens and green roofs.'],
    ['"A green belt is a park in the middle of a city."', 'It is a ring of land round a city, kept from being built on. London\'s is about 500,000 hectares.'],
  ];
  const rowH = 0.92, gap = 0.20;
  ROWS.forEach(([wrong, right], i) => {
    const y = BODY_Y + 0.44 + i * (rowH + gap);
    card(s, { x: M, y, w: CW, h: rowH, name: `wd${i}` });
    s.addText(wrong, {
      x: M + 0.28, y, w: 6.30, h: rowH, color: C.ink, fontFace: F.body, fontSize: 14,
      valign: 'middle', margin: 0, lineSpacing: 18, objectName: `wd${i}_q`,
    });
    s.addText(right, {
      shape: S.roundRect, rectRadius: 0.10,
      x: M + 6.80, y: y + 0.08, w: CW - 6.90, h: 0.76,
      fill: { color: 'ECE1CB' }, line: { color: C.alert, width: 1.5 },
      color: C.dark, fontFace: F.body, fontSize: 11.5, bold: true,
      align: 'center', valign: 'middle', margin: 0.06, objectName: `wd${i}_a`,
    });
  });
  s.addNotes(
    'WE DO. 5 minutes. Four clicks. Take answers from the room first.\n\n'
    + 'ROW 1 IS OBJECTIVE 1. "Urbanisation" is the word they will mix with "hotter" or "pollution", because cities sound like those.\n\n'
    + 'ROW 2 IS OBJECTIVE 2 AND THE RUNOFF WORD. Use the bracket. Point back at the tray practical: a bare tray is a road.\n\n'
    + 'ROWS 3 AND 4 ARE OBJECTIVE 3. Row 3 should be easy, because "sponge" already suggests soaking up. Row 4 is the trap: "green belt" sounds like a park, so expect a wrong answer. Take the green belt one slowly and say it is a RING of land round a city.\n\n'
    + 'THE ORDER IS ON PURPOSE: the two rows that describe what reduces the damage come last, so the room finishes on them.'
  );
}

/* ================================================================== *
 * 7. COLD CALL · 6
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 6, 'light'));
  pill(s, 'Cold Call', 6, 'light');
  const QS = [
    ['Describe what urbanisation is.', 'Towns and cities grow; more people live in them.'],
    ['State what happens to rain that falls on concrete.', 'It cannot soak in. It runs off.'],
    ['State why soil sealed under a road is lost for so long.', 'It takes a few hundred to about a thousand years to form.'],
    ['Name two things a sponge city uses.', 'Any two: permeable paving, rain gardens, green roofs.'],
    ['State what the London Green Belt does.', 'Keeps a ring of land round London from being built on.'],
    ['State what brownfield land is.', 'Land that has been built on before.'],
  ];
  const cw = (CW - 0.26) / 2, ch = 1.52;
  QS.forEach(([q, a], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * (cw + 0.26), y = 1.06 + row * (ch + 0.22);
    card(s, { x, y, w: cw, h: ch, name: `c${i}` });
    badge(s, { x: x + 0.22, y: y + 0.18, n: i + 1, name: `c${i}` });
    s.addText(q, {
      x: x + 0.80, y: y + 0.14, w: cw - 1.02, h: 0.70, color: C.ink, fontFace: F.body,
      fontSize: 14, valign: 'middle', margin: 0, lineSpacing: 17, objectName: `c${i}_q`,
    });
    s.addText(a, {
      shape: S.roundRect, rectRadius: 0.10, x: x + 0.22, y: y + 0.92, w: cw - 0.44, h: 0.44,
      fill: { color: 'ECE1CB' }, line: { color: C.accent, width: 1.3 },
      color: C.dark, fontFace: F.body, fontSize: 11.5, bold: true,
      align: 'left', valign: 'middle', margin: 0.08, objectName: `c${i}_a`,
    });
  });
  s.addNotes(
    'COLD CALL. 6 minutes. Six clicks. Name a student, then ask. Thinking time before the answer.\n\n'
    + 'Q1 AND Q2 ARE OBJECTIVES 1 AND 2, cold. Q3 IS THE TIMESCALE, in the setting where it now matters.\n\n'
    + 'Q4 TO Q6 ARE OBJECTIVE 3 AND ARE THE LAST THREE ON PURPOSE. If Q4 or Q5 is shaky, say the real place name again (Wuhan, London), the examples are what makes it stick.\n\n'
    + 'Q4 HAS SEVERAL RIGHT ANSWERS. Take two or three. Q6 is the one new word of the lesson (brownfield): say it, define it, and have them say it back once.'
  );
}

/* ================================================================== *
 * 8. YOU DO · 14
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 14, 'light'));
  pill(s, 'You Do', 14, 'light');
  s.addImage({ path: GC_LOGO, x: RIGHT - 1.70, y: 0.86, w: 1.70, h: 1.47, transparency: 62, objectName: 'gc_logo' });
  s.addText(`${LESSON} worksheet`, {
    x: M, y: 0.86, w: CW - 2.00, h: 1.14, color: C.dark, fontFace: F.title,
    fontSize: 25, bold: true, valign: 'middle', margin: 0, lineSpacing: 30, objectName: 'slide_title',
  });
  s.addText('Open Google Classroom now.', {
    x: M, y: 2.04, w: CW - 2.00, h: 0.40, color: C.alert, fontFace: F.body,
    fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: 'slide_sub',
  });
  const TIERS = [
    ['BRONZE', C.alert, 'F5E5DE', 'Describe it', 'Urbanisation, runoff, and what happens to sealed soil.'],
    ['SILVER', '81715F', 'F0EBE0', 'Explain it', 'Why cities flood, and how Wuhan and London reduce the damage.'],
    ['GOLD', C.accentInk, 'ECE1CB', 'Judge it', 'Compare two choices, and judge a claim using a real example.'],
  ];
  const cw = (CW - 2 * 0.30) / 3;
  TIERS.forEach(([n, col, fill, subh, body], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.44, w: cw, h: 2.00, fill, line: col, lineWidth: 1.6, name: `t${i}` });
    s.addText(n, {
      x: x + 0.26, y: BODY_Y + 0.62, w: cw - 0.52, h: 0.40, color: col, fontFace: F.body,
      fontSize: 15, bold: true, charSpacing: 1.2, valign: 'middle', margin: 0, objectName: `t${i}_h`,
    });
    s.addText(subh, {
      x: x + 0.26, y: BODY_Y + 1.02, w: cw - 0.52, h: 0.36, color: C.dark, fontFace: F.body,
      fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: `t${i}_s`,
    });
    s.addText(body, {
      x: x + 0.26, y: BODY_Y + 1.40, w: cw - 0.52, h: 0.90, color: C.inkSoft, fontFace: F.body,
      fontSize: 14, valign: 'top', margin: 0, lineSpacing: 18, objectName: `t${i}_b`,
    });
  });
  s.addText('Runoff means rain that flows over the surface instead of soaking in.', {
    x: M, y: BODY_Y + 2.76, w: CW, h: 0.46, color: C.dark, fontFace: F.body,
    fontSize: 16, bold: true, valign: 'middle', margin: 0, objectName: 'yd_note',
  });
  s.addNotes(
    'YOU DO. 14 minutes. Four clicks.\n\n'
    + 'THE NOTE ON THE SLIDE IS THE WORD THEY FOUND HARD. Leave it up while they work.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "which place is that, and what did they actually do?" Wuhan and London are the answers to almost every Silver and Gold question. If a student writes "we should plant more trees", ask for the place and the number.\n\n'
    + 'WHERE THEY WILL STALL: Gold Q9, judging the claim. Last lesson\'s notes flagged judging a claim as the stall point, so scaffold it without giving the answer: "what is true in that claim?" then "what is not?" then "which real place shows it?".\n\n'
    + 'AT 3 MINUTES REMAINING, stop them. Answers are on the next slide.'
  );
}

/* ================================================================== *
 * 9. ANSWERS · 3
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'Answers', 3, 'light');
  title(s, 'Answers', 'light');
  const ANS = [
    ['1', 'Towns and cities growing, and a bigger share of people living in them.'],
    ['2', 'Any two: soil covered, less soaks in so more runoff, hotter, habitat lost.'],
    ['3', 'Rain that flows over the surface instead of soaking in.'],
    ['4', 'It is sealed. It cannot grow plants, and takes centuries to form again.'],
    ['5', 'Roofs and roads let no rain in, so it all runs off at once into drains. A field soaks up much of it.'],
    ['6', 'Sponge cities, e.g. Wuhan (from 2015): permeable paving, rain gardens, green roofs let rain soak in.'],
    ['7', 'Green belts, e.g. London (about 500,000 ha, 1947): keep a ring of land free of building.'],
    ['8', 'Permeable paving lets rain soak in and cuts runoff. Tarmac seals the ground. Accept reasoned cost points.'],
    ['9', 'Partly true, but "nothing can be done" is false: Wuhan and London are real examples.'],
    ['10', 'Sealed soil takes centuries to replace, so preventing the loss beats repairing it.'],
  ];
  const cw = (CW - 0.26) / 2, rowH = 0.72, gap = 0.10;
  ANS.forEach(([n, a], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * (cw + 0.26), y = 2.00 + row * (rowH + gap);
    card(s, { x, y, w: cw, h: rowH, name: `a${i}` });
    s.addText(n, {
      x: x + 0.24, y, w: 0.50, h: rowH, color: C.accentInk, fontFace: F.title, fontSize: 18,
      bold: true, valign: 'middle', margin: 0, objectName: `a${i}_n`,
    });
    s.addText(a, {
      x: x + 0.82, y, w: cw - 1.04, h: rowH, color: C.ink, fontFace: F.body, fontSize: 11,
      valign: 'middle', margin: 0, lineSpacing: 13.5, objectName: `a${i}_t`,
    });
  });
  s.addNotes(
    'ANSWERS. 3 minutes. Five clicks, two at a time. They mark their own in a different colour.\n\n'
    + 'Q6 AND Q7 NEED THE PLACE NAME AND ONE FACT. Wuhan with paving, gardens or roofs; London with the ring of land. "Plant more trees" with no place is not a full answer, mark it as half.\n\n'
    + 'Q8, Q9 AND Q10 ARE THE REAL TEST. Take two or three out loud. Q9 has no single answer: accept any judgement that says what is true in the claim (cities do cover soil and cause runoff) AND what is not (real places have reduced the damage).\n\n'
    + 'Q10 IS THE TIMESCALE FROM THE START OF THE UNIT, in one sentence. Listen for "centuries" and "years".'
  );
}

/* ================================================================== *
 * 10. PLENARY · 3
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'dark');
  PHASES.push(timer(s, 3, 'dark'));
  pill(s, 'Plenary', 3, 'dark');
  title(s, 'True or false?', 'dark');
  const QS = [
    ['Urbanisation means more people living in towns and cities.', 'TRUE'],
    ['Rain soaks into concrete and tarmac.', 'FALSE'],
    ['Soil sealed under a road is soon replaced.', 'FALSE'],
    ['A sponge city lets rain soak in instead of running off.', 'TRUE'],
    ['A green belt keeps land around a city from being built on.', 'TRUE'],
  ];
  const rowH = 0.70, gap = 0.18;
  QS.forEach(([q, v], i) => {
    const y = BODY_Y + 0.30 + i * (rowH + gap);
    s.addShape(S.roundRect, {
      x: M, y, w: CW - 2.10, h: rowH, rectRadius: 0.10,
      fill: { color: C.darkSoft }, line: { color: C.darkSoft, width: 1 }, objectName: `p${i}_bg`,
    });
    s.addText(q, {
      x: M + 0.28, y, w: CW - 2.50, h: rowH, color: C.tint, fontFace: F.body,
      fontSize: 15, valign: 'middle', margin: 0, objectName: `p${i}_q`,
    });
    s.addText(v, {
      x: RIGHT - 1.90, y, w: 1.90, h: rowH, color: v === 'TRUE' ? C.support : C.accent,
      fontFace: F.body, fontSize: 17, bold: true, charSpacing: 1, valign: 'middle', margin: 0, objectName: `p${i}_v`,
    });
  });
  s.addText('Cities change land. They can also be built to protect it.', {
    x: M, y: H - 0.86, w: CW, h: 0.50, color: C.accent, fontFace: F.body, fontSize: 16,
    bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next',
  });
  s.addNotes(
    'PLENARY. 3 minutes. Six clicks.\n\n'
    + 'THE ORDER FINISHES ON THE POSITIVE. The two wrong statements are in the middle, and the last two are the solutions, so the last thing the room says is true about Wuhan and London.\n\n'
    + 'Q3 IS THE TIMESCALE. If anyone says TRUE, ask for the numbers: a few hundred to about a thousand years for a few centimetres.\n\n'
    + 'Q4 AND Q5: ask "where?" and take "Wuhan" and "London". If they can name the place, objective 3 landed.\n\n'
    + 'The closing line is the Today banner, word for word, and this time it is the last thing on the last slide. That is the point of it.'
  );
}

const outDir = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
});
