/**
 * Y9 Science — Earth Resources, Lesson 2: Losing the soil.
 * Single, 50 minutes. Taught identically to 9G and 9I (TIMETABLE.md).
 *
 * SHAPE. The 10-phase archetype has no practical, so this deviates: Chuka
 * asked for a 10-minute erosion-trays practical, and it takes the time of
 * Cold Call (6) plus 2 minutes each from Do Now (10 -> 8) and You Do
 * (14 -> 12). Order: Do Now, Today, Hook, I Do (erosion), PRACTICAL,
 * I Do (desertification and farming), We Do, You Do, Answers, Plenary.
 * The practical sits straight after the erosion I Do so the trays are the
 * evidence for "plant cover protects soil", and before the farming slide
 * that depends on it. 8+1+2+3+10+3+5+12+3+3 = 50.
 *
 * Follows reference/What The Land Gives Us.pptx (taught Thursday 24
 * September 2026, unedited apart from Do Now Q1, which Chuka swapped for a
 * community/population retrieval). Same palette, 'topsoil'.
 *
 * THEY FOUND HARD, from the brief: how long soil and coal take to form.
 * That is not left to one slide. It comes back five times: Do Now Q1-3, the
 * Hook (put wheat, soil and coal in order), the I Do 2 banner, We Do row 3,
 * the Plenary, and worksheet Q4 and Q9. Figures: soil, a few hundred to about
 * 1,000 years per few centimetres (FAO); coal, millions of years.
 *
 * Facts checked: desertification is the UNCCD definition, "land degradation
 * in arid, semi-arid and dry sub-humid areas resulting from various factors,
 * including climatic variations and human activities". It is NOT a desert
 * spreading by itself, and the deck says so (We Do row 2). Drivers named:
 * overgrazing, over-cultivation, deforestation. Erosion: soil particles
 * detached and carried off by water or wind; ploughing leaves soil bare and
 * cuts roots. See the chat for sources.
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const THEME = require('../lib/theme');
THEME.usePalette('topsoil');
const { PALETTE: C, F, W, H } = THEME;
const { addTimer } = require('../lib/timer');
const { arrow } = require('../lib/shapes');

const DATE = 'Thursday 1 October 2026';
const LESSON = 'Losing The Soil';
const GC_LOGO = path.join(__dirname, '..', 'assets', 'classroom.png');
const ICON = (name, role = 'accentInk') => path.join(__dirname, '..', 'assets', 'icons', `${name}_topsoil_${role}.png`);

const TIMER_X = 0.34, TIMER_W = 0.50, TIMER_Y = 0.34, TIMER_H = H - 0.68;
const M = 1.28, RIGHT = W - 0.60, CW = RIGHT - M;
const PILL_Y = 0.34, PILL_H = 0.36;
const TITLE_Y = 0.92, BODY_Y = 2.10;
const SOIL = '7A5238', GRASS = '4E9A3F', WATER = '4A90C2';

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'W16x9', width: W, height: H });
pptx.layout = 'W16x9';
pptx.author = 'Chuka';
pptx.title = LESSON;
pptx.subject = 'Y9 Science · Earth Resources · Lesson 2';

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
 * 1. DO NOW · 8
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 8, 'light'));
  pill(s, 'Do Now', 8, 'light');
  s.addText(LESSON, {
    x: 3.60, y: 0.22, w: 6.20, h: 0.66, color: C.dark, fontFace: F.title, fontSize: 24,
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
    ['State how long it takes to form a few centimetres of soil.', 'A few hundred to about a thousand years.'],
    ['State roughly how long coal takes to form.', 'Millions of years.'],
    ['Does soil form faster or slower than coal?', 'Faster, but still centuries. Coal takes millions of years.'],
    ['State why soil counts as non-renewable on a human timescale.', 'It forms far slower than it is lost.'],
    ['State what happens to bare soil when heavy rain falls.', 'Some of it is washed away.'],
    ['State one thing that stops soil washing away.', 'Plants and their roots.'],
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
    'DO NOW. 8 minutes. Six clicks.\n\n'
    + 'Q1 TO Q3 ARE THE THING THEY FOUND HARD: how long soil and coal take to form. Ask all three before revealing any. Soil: a few hundred to about a thousand years for a few centimetres. Coal: millions of years. Q3 puts them side by side. If the room says soil is faster, agree, then say "but faster than millions of years is still centuries." That is the sentence to fix in their heads.\n\n'
    + 'Q4 IS LAST LESSON\'S THESIS, in one line. If it is shaky, spend the saved time here.\n\n'
    + 'Q5 AND Q6 ARE INTUITIVE, NOT TAUGHT YET. Accept any reasonable answer. They are priming today\'s erosion and practical.\n\n'
    + 'THIS LESSON IS 8 MINUTES OF DO NOW, NOT 10, to make room for the practical. TAUGHT IDENTICALLY TO 9G AND 9I. CHANGE THE DATE before you teach.'
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
    'Describe what erosion is and what causes it.',
    'Describe what desertification is.',
    'Explain how farming can cause both.',
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
  banner(s, 'Centuries to make. Years to lose.', { y: BODY_Y + 2.58, size: 18, name: 'obj_banner' });
  s.addNotes(
    'TODAY. 1 minute. Four clicks.\n\n'
    + 'THE BANNER IS THE LESSON, AND THE FIX FOR THE HARD IDEA. Soil takes centuries to make. Erosion can take it in years. Say it slowly. It comes back on I Do 2 and on the last slide.\n\n'
    + 'MENTION THE PRACTICAL NOW. "We test erosion today, with two trays of soil." It is the reason to pay attention in the next ten minutes.'
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
  s.addText('Which order is right, quickest to slowest to form?', {
    x: M, y: 0.86, w: CW, h: 1.06, color: C.dark, fontFace: F.title, fontSize: 28,
    bold: true, valign: 'middle', margin: 0, lineSpacing: 34, objectName: 'slide_title',
  });
  const OPTS = [
    ['A', 'A wheat crop, then a few cm of soil, then coal.'],
    ['B', 'Coal, then a few cm of soil, then a wheat crop.'],
    ['C', 'A few cm of soil, then a wheat crop, then coal.'],
  ];
  const cw = (CW - 2 * 0.30) / 3;
  OPTS.forEach(([k, txt], i) => {
    const x = M + i * (cw + 0.30);
    card(s, { x, y: BODY_Y + 0.62, w: cw, h: 1.90, name: `h${i}` });
    s.addText(k, {
      x: x + 0.28, y: BODY_Y + 0.84, w: 0.60, h: 0.50, color: C.alert, fontFace: F.title,
      fontSize: 26, bold: true, valign: 'middle', margin: 0, objectName: `h${i}_k`,
    });
    s.addText(txt, {
      x: x + 0.28, y: BODY_Y + 1.34, w: cw - 0.56, h: 1.0, color: C.dark, fontFace: F.title,
      fontSize: 16, bold: true, valign: 'top', margin: 0, lineSpacing: 20, objectName: `h${i}_t`,
    });
  });
  s.addNotes(
    'HOOK. 2 minutes. Four clicks.\n\n'
    + 'Hands up for each. Tally on the board. Expect a split between A and C, and a few for B.\n\n'
    + 'DO NOT REVEAL THE ANSWER HERE. Say "keep your vote, we will come back to it".\n\n'
    + 'ANSWER, FOR YOU: A. A wheat crop takes months. A few centimetres of soil takes roughly a few hundred to about a thousand years. Coal takes millions of years. This is the ordering they found hard, so it is the Hook this time, not a new idea.\n\n'
    + 'C IS THE TEMPTING WRONG ONE. Some will feel a crop must take longer than soil "because it is alive". The gap between months and centuries is the point.'
  );
}

/* ================================================================== *
 * 4. I DO · 3 — erosion
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'What erosion is', 'light');

  card(s, { x: M, y: BODY_Y + 0.05, w: CW, h: 0.95, name: 'def' });
  s.addText('Erosion is soil being worn away and carried off by water or wind.', {
    x: M + 0.30, y: BODY_Y + 0.05, w: CW - 0.60, h: 0.95, color: C.dark, fontFace: F.body,
    fontSize: 18, bold: true, valign: 'middle', margin: 0, objectName: 'def_t',
  });
  const ITEMS = [
    ['rain', 'WATER', 'Rain hits bare soil and runs downhill, carrying soil with it.'],
    ['wind', 'WIND', 'Wind lifts dry, loose soil and blows it away.'],
    ['roots', 'PLANTS PROTECT', 'Roots hold soil together. Leaves slow the rain.'],
  ];
  const cw = (CW - 2 * 0.24) / 3, cy = BODY_Y + 1.22, ch = 2.45;
  ITEMS.forEach(([icon, name, text], i) => {
    const x = M + i * (cw + 0.24);
    card(s, { x, y: cy, w: cw, h: ch, fill: i === 2 ? 'ECE1CB' : 'FFFFFF', line: i === 2 ? C.accent : 'D8DEEC', name: `er${i}` });
    s.addImage({ path: ICON(icon), x: x + 0.24, y: cy + 0.22, w: 0.55, h: 0.55, objectName: `er${i}_icon` });
    s.addText(name, {
      x: x + 0.92, y: cy + 0.22, w: cw - 1.1, h: 0.55, color: C.dark, fontFace: F.title,
      fontSize: 16, bold: true, valign: 'middle', margin: 0, objectName: `er${i}_h`,
    });
    s.addText(text, {
      x: x + 0.24, y: cy + 1.0, w: cw - 0.48, h: 1.3, color: C.ink, fontFace: F.body,
      fontSize: 15, valign: 'top', margin: 0, lineSpacing: 20, objectName: `er${i}_t`,
    });
  });
  banner(s, 'Erosion is natural. Bare soil makes it much faster.', { y: BODY_Y + 3.90, size: 16.5, name: 'er_banner' });
  s.addNotes(
    'I DO. 3 minutes. Five clicks: the definition, three cards, then the banner.\n\n'
    + 'THE DEFINITION HAS TWO PARTS: worn away AND carried off. Erosion is not just soil loosening, it is soil leaving. Say "carried off" and sweep a hand away.\n\n'
    + 'WATER AND WIND ARE THE TWO YOU NEED. Ice and gravity also move soil, mention them in one breath if someone asks, no more.\n\n'
    + 'THE THIRD CARD IS THE POINT OF THE PRACTICAL. Roots and leaves protect soil. You are about to test that. Say "predict which tray loses more soil" and leave it hanging.\n\n'
    + 'THE BANNER: erosion always happens, slowly. What farming changes is the speed. That is objective 3, set up here.'
  );
}

/* ================================================================== *
 * 5. PRACTICAL · 10 — erosion trays
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 10, 'light'));
  pill(s, 'Practical', 10, 'light');
  title(s, 'Erosion trays', 'light');

  const cw = 3.65, gap = 0.24, cy = BODY_Y - 0.05, ch = 3.30;
  function tray(k, x, label, covered) {
    const n = `tr${k}`;
    card(s, { x, y: cy, w: cw, h: ch, name: n });
    s.addText(label, {
      x: x + 0.2, y: cy + 0.12, w: cw - 0.4, h: 0.42, color: C.dark, fontFace: F.title, fontSize: 16,
      bold: true, valign: 'middle', margin: 0, objectName: `${n}_h`,
    });
    // jug and falling water
    s.addShape(S.roundRect, {
      x: x + 0.28, y: cy + 0.58, w: 0.55, h: 0.62, rectRadius: 0.08,
      fill: { color: 'DCE7EE' }, line: { color: C.dark, width: 1.2 }, objectName: `${n}_jug`,
    });
    [[0.88, 1.06], [0.98, 1.26], [1.08, 1.46]].forEach(([dx, dy], i) => {
      s.addShape(S.ellipse, {
        x: x + dx, y: cy + dy, w: 0.10, h: 0.10, fill: { color: WATER }, line: { color: WATER, width: 0 },
        objectName: `${n}_drop${i}`,
      });
    });
    // the tray, sloping down to the right
    s.addShape(S.rect, {
      x: x + 0.55, y: cy + 1.68, w: 2.5, h: 0.42, rotate: 10,
      fill: { color: SOIL }, line: { color: '4A3120', width: 1 }, objectName: `${n}_soil`,
    });
    if (covered) {
      s.addShape(S.rect, {
        x: x + 0.55, y: cy + 1.52, w: 2.5, h: 0.16, rotate: 10,
        fill: { color: GRASS }, line: { color: GRASS, width: 0 }, objectName: `${n}_grass`,
      });
    }
    // catch pot at the low end
    s.addShape(S.roundRect, {
      x: x + 2.72, y: cy + 2.42, w: 0.66, h: 0.5, rectRadius: 0.06,
      fill: { color: 'FFFFFF' }, line: { color: C.dark, width: 1.4 }, objectName: `${n}_pot`,
    });
    s.addText('catch pot', {
      x: x + 2.55, y: cy + 2.93, w: 1.0, h: 0.28, color: C.inkSoft, fontFace: F.body, fontSize: 10.5,
      align: 'center', valign: 'middle', margin: 0, objectName: `${n}_potlbl`,
    });
    s.addText('jug', {
      x: x + 0.05, y: cy + 1.36, w: 0.55, h: 0.26, color: C.inkSoft, fontFace: F.body, fontSize: 10.5,
      align: 'center', valign: 'middle', margin: 0, objectName: `${n}_juglbl`,
    });
  }
  tray('A', M, 'A   Bare soil', false);
  tray('B', M + cw + gap, 'B   Grass cover', true);

  const sx = M + 2 * cw + gap + 0.26, sw = RIGHT - sx;
  const STEPS = ['Predict: which pot gets more soil?', 'Pour the same amount of water down each tray.', 'Look at the catch pots.', 'Compare the runoff.'];
  STEPS.forEach((t, i) => {
    const y = cy + i * 0.86;
    card(s, { x: sx, y, w: sw, h: 0.72, name: `ps${i}` });
    badge(s, { x: sx + 0.14, y: y + 0.15, n: i + 1, name: `ps${i}` });
    s.addText(t, {
      x: sx + 0.68, y, w: sw - 0.8, h: 0.72, color: C.ink, fontFace: F.body, fontSize: 13,
      bold: true, valign: 'middle', margin: 0, lineSpacing: 16, objectName: `ps${i}_t`,
    });
  });
  banner(s, 'A fair test: same soil, same slope, same water. Only the cover is different.', { y: cy + ch + 0.22, h: 0.62, size: 15.5, name: 'fair_banner' });
  s.addText('Usually: the bare tray gives muddy runoff and soil in its pot. The covered tray runs clearer.', {
    shape: S.roundRect, rectRadius: 0.12,
    x: M, y: cy + ch + 0.98, w: CW, h: 0.62, fill: { color: 'ECE1CB' }, line: { color: C.accent, width: 1.5 },
    color: C.dark, fontFace: F.body, fontSize: 15, bold: true, align: 'center', valign: 'middle', margin: 0.1,
    objectName: 'look_banner',
  });
  s.addNotes(
    'PRACTICAL. 10 minutes including the comparison. Four clicks: the two trays, the steps, the fair-test line, then "usually".\n\n'
    + 'BEFORE THE LESSON (5 minutes): two shallow trays, the same depth of soil in each (about 2 cm, pressed down the same). Cut the turf or lay the leaves to cover tray B fully. Tip both trays to the same slope, a book under the same end of each, and set a catch pot at the low end of each, with a lip or a folded card gutter so the runoff goes into the pot. Fill two jugs with the same amount of water.\n\n'
    + 'IF YOU HAVE ONE SET, run it as a demonstration with two student volunteers pouring, and the class watching and predicting. If you have several sets, groups run it and the class compares. Either way the plan below fits ten minutes.\n\n'
    + 'TIMING. 2 minutes: show the setup, predict (hands up for A or B, tally). 3 minutes: pour. Same jug height, same speed, both trays at once if two people can. 3 minutes: look at the pots and compare, colour of the runoff first, then how much soil. 2 minutes: click the "usually" line, then talk through why.\n\n'
    + 'THE FAIR TEST LINE MATTERS. Same soil, same slope, same water: only the cover changes. This is the fair-test idea from earlier in the course, applied. If a group pours faster on one tray, that is the moment to say so.\n\n'
    + 'THE RESULT IS USUALLY CLEAR BUT NOT ALWAYS. The bare tray gives muddy runoff with soil in the pot. The covered tray runs clearer. If your result is muddy on both, the turf is too thin or the pour too hard: that is a real thing to discuss (roots need time and thickness), not a failed practical. Do not click "usually" if the class result disagrees. Talk about why.\n\n'
    + 'WHY IT WORKS: leaves take the force of the drops, roots hold the soil, and the plants slow the water so it carries less. Point at tray B and say "cover", at tray A and say "bare".\n\n'
    + 'CLEAR UP: soil in a bin, not the sink. Wipe the floor.'
  );
}

/* ================================================================== *
 * 6. I DO · 3 — farming, erosion and desertification
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 3, 'light'));
  pill(s, 'I Do', 3, 'light');
  title(s, 'How farming causes both', 'light');
  sub(s, 'Desertification: fertile land in a dry area turning into desert-like land.', 'light');

  const CAUSES = [
    ['tractor', 'Ploughing', 'Leaves soil bare and cuts the roots that hold it.'],
    ['cow', 'Too many animals', 'Plants are eaten down and their roots die.'],
    ['tree', 'Clearing trees and hedges', 'No roots, and no shelter from the wind.'],
  ];
  const ly = 2.42, lh = 1.10, lw = 5.3;
  CAUSES.forEach(([icon, name, text], i) => {
    const y = ly + i * (lh + 0.20);
    card(s, { x: M, y, w: lw, h: lh, name: `fc${i}` });
    s.addImage({ path: ICON(icon), x: M + 0.22, y: y + 0.26, w: 0.58, h: 0.58, objectName: `fc${i}_icon` });
    s.addText(name, {
      x: M + 0.98, y: y + 0.10, w: lw - 1.15, h: 0.42, color: C.dark, fontFace: F.title,
      fontSize: 16, bold: true, valign: 'middle', margin: 0, objectName: `fc${i}_h`,
    });
    s.addText(text, {
      x: M + 0.98, y: y + 0.52, w: lw - 1.15, h: 0.52, color: C.inkSoft, fontFace: F.body,
      fontSize: 13, valign: 'top', margin: 0, lineSpacing: 16, objectName: `fc${i}_t`,
    });
  });
  const cx0 = M + lw + 0.45, cwid = RIGHT - cx0;
  const CHAIN = ['Plant cover is removed', 'Soil is left bare', 'Wind and water erode it', 'In a dry area the land turns desert-like: desertification'];
  const bh = 0.72, bgap = 0.30;
  CHAIN.forEach((t, i) => {
    const y = ly + i * (bh + bgap);
    const last = i === CHAIN.length - 1;
    s.addText(t, {
      shape: S.roundRect, rectRadius: 0.10,
      x: cx0, y, w: cwid, h: bh + (last ? 0.06 : 0), fill: { color: last ? C.dark : 'FFFFFF' },
      line: { color: last ? C.dark : C.accent, width: 1.5 },
      color: last ? C.accent : C.dark, fontFace: F.body, fontSize: 14.5, bold: true,
      align: 'center', valign: 'middle', margin: 0.1, objectName: `ch${i}`,
    });
    if (!last) {
      arrow(pptx, s, cx0 + cwid / 2, y + bh + 0.03, cx0 + cwid / 2, y + bh + bgap - 0.03, {
        colour: C.accentInk, thickness: 0.22, objectName: `ch${i}_arrow`,
      });
    }
  });
  banner(s, 'Centuries to make. Years to lose.', { y: 6.42, h: 0.62, size: 17, name: 'fm_banner' });
  s.addNotes(
    'I DO. 3 minutes. Three clicks: the three farming causes, the chain, then the banner.\n\n'
    + 'THE CHAIN IS OBJECTIVE 3 IN FOUR BOXES. Farming removes plant cover, soil is left bare, wind and water erode it, and in a dry area the land turns desert-like. Point at each box and link it to the tray practical: "this is tray A".\n\n'
    + 'DESERTIFICATION IS NOT A DESERT SPREADING BY ITSELF. It is the UN definition, land degradation in dry areas from climate variation AND human activity, and the human causes are overgrazing, over-cultivation, deforestation and poor irrigation. Say that plainly, it is the misconception on the next slide. Drought makes it worse, but farming can start it.\n\n'
    + 'BOTH ARE THE SAME CAUSE, SHOWN TWICE. Take the cover off and erosion happens everywhere it is bare, and in dry places the loss of soil goes on until the land is desert-like. Do not present them as two unrelated problems.\n\n'
    + 'THE BANNER IS THE HARD IDEA AGAIN. A few centimetres of soil took a few hundred to about a thousand years. A season of bad practice can lose it. Say "centuries" and "years" out loud, with the hand gesture: wide arm for centuries, one finger for years.'
  );
}

/* ================================================================== *
 * 7. WE DO · 5
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 5, 'light'));
  pill(s, 'We Do', 5, 'light');
  title(s, 'What should be the correct answer?', 'light');
  sub(s, 'Spot the mistake.', 'light');
  const ROWS = [
    ['"Erosion only happens in deserts."', 'Erosion happens wherever soil is bare, including farms. Rain and wind carry the soil away.'],
    ['"Desertification is a desert spreading by itself."', 'It is fertile land in a dry area turning desert-like. People and drought both play a part.'],
    ['"Soil lost in a few years will be replaced in a few years."', 'A few cm take a few hundred to about a thousand years. Coal takes millions.'],
    ['"Ploughing does not matter, the soil is still there."', 'Ploughing leaves soil bare and cuts roots, so wind and rain remove it faster.'],
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
    + 'ROW 1 IS OBJECTIVE 1. Erosion is not a desert thing. The tray practical was on ordinary soil.\n\n'
    + 'ROW 2 IS OBJECTIVE 2 AND THE COMMON WRONG PICTURE. Desertification is not an advancing wall of sand. It is degradation of dry land, with climate and human causes together.\n\n'
    + 'ROW 3 IS THE TIMESCALE ROW, for the thing they found hard. Ask for both numbers before you click: soil, coal.\n\n'
    + 'ROW 4 IS OBJECTIVE 3. Point back at tray A: the soil was still there before the water, and then it was not.'
  );
}

/* ================================================================== *
 * 8. YOU DO · 12
 * ================================================================== */
{
  const s = pptx.addSlide();
  bg(s, 'light');
  PHASES.push(timer(s, 12, 'light'));
  pill(s, 'You Do', 12, 'light');
  s.addImage({ path: GC_LOGO, x: RIGHT - 1.70, y: 0.86, w: 1.70, h: 1.47, transparency: 62, objectName: 'gc_logo' });
  s.addText(`${LESSON} worksheet`, {
    x: M, y: 0.86, w: CW - 2.00, h: 1.14, color: C.dark, fontFace: F.title,
    fontSize: 27, bold: true, valign: 'middle', margin: 0, lineSpacing: 33, objectName: 'slide_title',
  });
  s.addText('Open Google Classroom now.', {
    x: M, y: 2.04, w: CW - 2.00, h: 0.40, color: C.alert, fontFace: F.body,
    fontSize: 17, bold: true, valign: 'middle', margin: 0, objectName: 'slide_sub',
  });
  const TIERS = [
    ['BRONZE', C.alert, 'F5E5DE', 'Describe it', 'Erosion, desertification, and the two timescales.'],
    ['SILVER', '81715F', 'F0EBE0', 'Explain it', 'Use your tray results to explain why cover protects soil.'],
    ['GOLD', C.accentInk, 'ECE1CB', 'Judge it', 'Explain how farming causes both, and judge a claim about the trays.'],
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
  s.addText('Fill in the tray results first. Then start on Silver.', {
    x: M, y: BODY_Y + 2.76, w: CW, h: 0.46, color: C.dark, fontFace: F.body,
    fontSize: 16, bold: true, valign: 'middle', margin: 0, objectName: 'yd_note',
  });
  s.addNotes(
    'YOU DO. 12 minutes. Four clicks.\n\n'
    + 'THE TRAY RESULTS TABLE COMES FIRST, while the practical is fresh: colour of the runoff and soil in the pot for tray A and tray B. It takes two minutes and Silver Q5 and Q6 depend on it.\n\n'
    + 'CIRCULATE WITH ONE QUESTION: "which tray, and how do you know?" Then, for anyone on Gold: "how long would that soil take to come back?"\n\n'
    + 'WHERE THEY WILL STALL: Gold Q10, judging the claim that the trays are only a small model. Judging a claim was hard last unit too, so nudge with "what stayed the same?" and "does the pattern match a real field?".\n\n'
    + 'THIS IS A 12-MINUTE YOU DO, not the usual 14. The practical took the difference. AT 3 MINUTES REMAINING, stop them. Answers are on the next slide.'
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
    ['1', 'Soil being worn away and carried off by water or wind.'],
    ['2', 'Any two: rain and running water, wind.'],
    ['3', 'Fertile land in a dry area turning desert-like.'],
    ['4', 'Soil: a few hundred to about 1,000 years. Coal: millions.'],
    ['5', 'Tray A. More soil in its pot, and muddier runoff.'],
    ['6', 'Roots hold the soil. Leaves slow the rain and water.'],
    ['7', 'It leaves soil bare and cuts roots, so wind and rain carry it off.'],
    ['8', 'Farming removes cover, so soil erodes, and in dry areas the land turns desert-like.'],
    ['9', 'Soil lost in years takes centuries to replace, so it is non-renewable for people.'],
    ['10', 'Partly true: small, but a fair test, and the pattern matches real fields.'],
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
      x: x + 0.82, y, w: cw - 1.04, h: rowH, color: C.ink, fontFace: F.body, fontSize: 11.5,
      valign: 'middle', margin: 0, lineSpacing: 14.5, objectName: `a${i}_t`,
    });
  });
  s.addNotes(
    'ANSWERS. 3 minutes. Five clicks, two at a time. They mark their own in a different colour.\n\n'
    + 'Q5 DEPENDS ON THE CLASS RESULT. The model answer is the usual one, tray A. If your trays gave a different result, mark against what the class saw and say so.\n\n'
    + 'Q8, Q9 AND Q10 ARE THE REAL TEST. Take two or three out loud. Q9 is the timescale idea in a farmer\'s shoes: the hard one, so listen for both numbers, centuries and years.\n\n'
    + 'Q10 HAS NO SINGLE ANSWER. Accept any judgement that says what was fair (same slope, soil and water) and what was limited (small, quick, one soil).'
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
    ['Erosion is soil being carried away by wind or water.', 'TRUE'],
    ['Desertification is a desert spreading by itself.', 'FALSE'],
    ['Bare soil loses more to erosion than soil with plants on it.', 'TRUE'],
    ['Soil forms in about the same time as coal.', 'FALSE'],
    ['Farming can cause both erosion and desertification.', 'TRUE'],
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
  s.addText('Centuries to make. Years to lose.', {
    x: M, y: H - 0.86, w: CW, h: 0.50, color: C.accent, fontFace: F.body, fontSize: 16,
    bold: true, italic: true, valign: 'middle', margin: 0, objectName: 'pl_next',
  });
  s.addNotes(
    'PLENARY. 3 minutes. Six clicks.\n\n'
    + 'Q2 IS OBJECTIVE 2 AND THE MISCONCEPTION. If it splits the room, that is the first five minutes of next lesson.\n\n'
    + 'Q4 IS THE HARD IDEA, asked plainly. If anyone says TRUE, ask for the two numbers: soil, coal.\n\n'
    + 'Q3 LINKS BACK TO THE TRAYS. Ask "how do you know?" and take "we saw it".\n\n'
    + 'The closing line is the Today banner, word for word. That repetition is deliberate.'
  );
}

const outDir = path.join(__dirname, '..', 'out', LESSON);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${LESSON}.pptx`);
pptx.writeFile({ fileName: out }).then(() => {
  console.log('deck written:', out);
  console.log('phase minutes:', PHASES.join(', '), '=', PHASES.reduce((a, b) => a + b, 0), 'min');
});
