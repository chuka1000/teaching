const { PALETTE: C, F, W, H, M, PILL_Y, PILL_H, TITLE_Y } = require('./theme');

/** Light or dark background for a slide. */
function bg(slide, mode) {
  slide.background = { color: mode === 'dark' ? C.dark : C.tint };
}

/** Phase pill, top-left: "WE DO · 6 MIN" */
function pill(pptx, slide, label, mins, mode) {
  const text = `${label.toUpperCase()} · ${mins} MIN`;
  const w = Math.max(1.55, 0.16 * text.length + 0.42);
  slide.addText(text, {
    shape: pptx.ShapeType.roundRect, rectRadius: 0.19,
    x: M, y: PILL_Y, w, h: PILL_H,
    fill: { color: mode === 'dark' ? C.accent : C.dark },
    color: mode === 'dark' ? C.dark : C.tint,
    fontFace: F.body, fontSize: 11, bold: true, charSpacing: 1.1,
    align: 'center', valign: 'middle', margin: 0,
    objectName: 'phase_pill',
  });
}

/** Key words introduced on this slide, top-right. */
function keywords(pptx, slide, words, mode) {
  if (!words || !words.length) return;
  const text = words.join('   ·   ');
  slide.addText(text, {
    x: W - M - 6.4, y: PILL_Y, w: 6.4, h: PILL_H,
    color: mode === 'dark' ? C.accent : C.support,
    fontFace: F.body, fontSize: 11.5, bold: true, italic: true,
    align: 'right', valign: 'middle', margin: 0,
    objectName: 'keyword_strip',
  });
}

/** Slide title (Georgia) with optional kicker line underneath. */
function title(pptx, slide, text, mode, opts = {}) {
  slide.addText(text, {
    x: M, y: opts.y ?? TITLE_Y, w: opts.w ?? (W - 2 * M), h: opts.h ?? 0.72,
    color: mode === 'dark' ? C.tint : C.dark,
    fontFace: F.title, fontSize: opts.fontSize ?? 30, bold: true,
    align: 'left', valign: 'middle', margin: 0,
    objectName: opts.objectName || 'slide_title',
  });
  if (opts.kicker) {
    slide.addText(opts.kicker, {
      x: M, y: (opts.y ?? TITLE_Y) + (opts.h ?? 0.72) - 0.02, w: opts.w ?? (W - 2 * M), h: 0.42,
      color: mode === 'dark' ? C.accent : C.inkSoft,
      fontFace: F.body, fontSize: 14.5, align: 'left', valign: 'middle', margin: 0,
      objectName: 'slide_kicker',
    });
  }
}

/** A soft content card. Returns nothing; add text separately if you need finer control. */
function card(pptx, slide, o) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x: o.x, y: o.y, w: o.w, h: o.h, rectRadius: 0.14,
    fill: { color: o.fill || 'FFFFFF' },
    line: { color: o.line || C.tintDeep, width: o.lineWidth ?? 1.25 },
    objectName: o.objectName,
  });
}

/** Card with a bold heading and body text, as two objects sharing a name prefix. */
function textCard(pptx, slide, o) {
  card(pptx, slide, { ...o, objectName: `${o.objectName}_bg` });
  let y = o.y + 0.18;
  if (o.head) {
    slide.addText(o.head, {
      x: o.x + 0.22, y, w: o.w - 0.44, h: 0.38,
      color: o.headColor || C.dark, fontFace: F.body, fontSize: o.headSize ?? 15, bold: true,
      align: o.align || 'left', valign: 'middle', margin: 0,
      objectName: `${o.objectName}_head`,
    });
    y += 0.40;
  }
  if (o.body) {
    slide.addText(o.body, {
      x: o.x + 0.22, y, w: o.w - 0.44, h: o.y + o.h - y - 0.16,
      color: o.bodyColor || C.inkSoft, fontFace: F.body, fontSize: o.bodySize ?? 13,
      align: o.align || 'left', valign: 'top', margin: 0, lineSpacing: o.lineSpacing ?? 18,
      objectName: `${o.objectName}_body`,
    });
  }
}

/** Footer strip used on light slides. */
function footer(pptx, slide, text) {
  slide.addText(text, {
    x: M, y: H - 0.52, w: W - 2 * M, h: 0.32,
    color: C.inkSoft, fontFace: F.body, fontSize: 10.5, italic: true,
    align: 'left', valign: 'middle', margin: 0, objectName: 'footer_note',
  });
}

module.exports = { bg, pill, keywords, title, card, textCard, footer };
