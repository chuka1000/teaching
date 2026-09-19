#!/usr/bin/env node
/** validate.js <deck.pptx> — structural audit of an animated deck. */
const AdmZip = require('adm-zip');
const { DOMParser } = require('@xmldom/xmldom');

const file = process.argv[2];
const zip = new AdmZip(file);
const P = 'http://schemas.openxmlformats.org/presentationml/2006/main';
let fail = 0;
const problems = [];

const slides = zip.getEntries()
  .filter((e) => /^ppt\/slides\/slide\d+\.xml$/.test(e.entryName))
  .sort((a, b) => (+a.entryName.match(/(\d+)/)[1]) - (+b.entryName.match(/(\d+)/)[1]));

console.log(`deck: ${file}\nslides: ${slides.length}\n`);
console.log('  #  show  trans        clicks  groups  spids  notes');
console.log('  -  ----  -----------  ------  ------  -----  -----');

slides.forEach((e, i) => {
  const xml = zip.readAsText(e);
  let doc;
  try {
    doc = new DOMParser({ onError: (lvl, msg) => { if (lvl !== 'warning') throw new Error(msg); } })
      .parseFromString(xml, 'text/xml');
  } catch (err) { problems.push(`slide ${i + 1}: XML not well-formed — ${err.message}`); fail++; return; }

  const root = doc.documentElement;
  const show = root.getAttribute('show') === '0' ? 'HIDE' : '  · ';

  // element order inside p:sld must be cSld, clrMapOvr, transition, timing
  const order = [];
  for (let n = root.firstChild; n; n = n.nextSibling) if (n.nodeType === 1) order.push(n.localName);
  const want = ['cSld', 'clrMapOvr', 'transition', 'timing'];
  const filtered = order.filter((o) => want.includes(o));
  const sorted = [...filtered].sort((a, b) => want.indexOf(a) - want.indexOf(b));
  if (filtered.join() !== sorted.join()) {
    problems.push(`slide ${i + 1}: child order ${filtered.join(',')} violates CT_Slide sequence`);
    fail++;
  }

  const trEl = doc.getElementsByTagNameNS(P, 'transition')[0];
  let tr = '—';
  if (trEl) {
    for (let n = trEl.firstChild; n; n = n.nextSibling) {
      if (n.nodeType === 1) { tr = n.localName + (n.getAttribute('dir') ? `(${n.getAttribute('dir')})` : ''); break; }
    }
  }

  // count click groups: p:par children of the mainSeq childTnLst
  const timing = doc.getElementsByTagNameNS(P, 'timing')[0];
  let clicks = 0, auto = 0, effects = 0;
  const spids = new Set();
  if (timing) {
    const cTns = timing.getElementsByTagNameNS(P, 'cTn');
    let mainSeq = null;
    for (let k = 0; k < cTns.length; k++) if (cTns[k].getAttribute('nodeType') === 'mainSeq') mainSeq = cTns[k];
    if (!mainSeq) { problems.push(`slide ${i + 1}: timing present but no mainSeq`); fail++; }
    else {
      const lst = mainSeq.getElementsByTagNameNS(P, 'childTnLst')[0];
      for (let n = lst.firstChild; n; n = n.nextSibling) {
        if (n.nodeType !== 1 || n.localName !== 'par') continue;
        const c = n.getElementsByTagNameNS(P, 'cTn')[0];
        const cond = c.getElementsByTagNameNS(P, 'cond')[0];
        if (cond && cond.getAttribute('delay') === 'indefinite') clicks++; else auto++;
      }
    }
    const tgts = timing.getElementsByTagNameNS(P, 'spTgt');
    for (let k = 0; k < tgts.length; k++) spids.add(tgts[k].getAttribute('spid'));
    const eff = timing.getElementsByTagNameNS(P, 'cTn');
    for (let k = 0; k < eff.length; k++) if (eff[k].getAttribute('presetClass')) effects++;

    // every cTn id unique
    const ids = [];
    for (let k = 0; k < eff.length; k++) ids.push(eff[k].getAttribute('id'));
    if (new Set(ids).size !== ids.length) { problems.push(`slide ${i + 1}: duplicate p:cTn id`); fail++; }
  }

  // every animated spid must exist as a shape on the slide
  const cNvPrs = doc.getElementsByTagNameNS(P, 'cNvPr');
  const present = new Set();
  for (let k = 0; k < cNvPrs.length; k++) present.add(cNvPrs[k].getAttribute('id'));
  spids.forEach((s) => {
    if (!present.has(s)) { problems.push(`slide ${i + 1}: animation targets spid ${s} which is not on the slide`); fail++; }
  });

  const grps = doc.getElementsByTagNameNS(P, 'grpSp').length;

  // group geometry sanity: chOff/chExt must match off/ext.
  // Only real p:grpSp groups — the slide's own spTree also carries a p:grpSpPr with no xfrm.
  const allGrpPrs = doc.getElementsByTagNameNS(P, 'grpSpPr');
  const grpPrs = [];
  for (let k = 0; k < allGrpPrs.length; k++) {
    if (allGrpPrs[k].parentNode && allGrpPrs[k].parentNode.localName === 'grpSp') grpPrs.push(allGrpPrs[k]);
  }
  for (let k = 0; k < grpPrs.length; k++) {
    const A = 'http://schemas.openxmlformats.org/drawingml/2006/main';
    const off = grpPrs[k].getElementsByTagNameNS(A, 'off')[0];
    const ext = grpPrs[k].getElementsByTagNameNS(A, 'ext')[0];
    const chOff = grpPrs[k].getElementsByTagNameNS(A, 'chOff')[0];
    const chExt = grpPrs[k].getElementsByTagNameNS(A, 'chExt')[0];
    if (!off || !chOff || off.getAttribute('x') !== chOff.getAttribute('x') || off.getAttribute('y') !== chOff.getAttribute('y')
        || ext.getAttribute('cx') !== chExt.getAttribute('cx') || ext.getAttribute('cy') !== chExt.getAttribute('cy')) {
      problems.push(`slide ${i + 1}: group child-offset mapping is not identity — children will be displaced`);
      fail++;
    }
    if (+ext.getAttribute('cx') <= 0 || +ext.getAttribute('cy') <= 0) {
      problems.push(`slide ${i + 1}: group has zero or negative extent`); fail++;
    }
  }

  const notes = zip.getEntry(`ppt/notesSlides/notesSlide${i + 1}.xml`) ? 'notes' : '';
  console.log(`  ${String(i + 1).padStart(2)}  ${show}  ${tr.padEnd(11)}  ${String(clicks).padStart(6)}  ${String(grps).padStart(6)}  ${String(spids.size).padStart(5)}  ${notes}${auto ? ` auto:${auto}` : ''}`);
});

// notes coverage
const notesCount = zip.getEntries().filter((e) => /^ppt\/notesSlides\/notesSlide\d+\.xml$/.test(e.entryName)).length;
console.log(`\nspeaker notes present on ${notesCount}/${slides.length} slides`);
if (notesCount < slides.length) { problems.push(`${slides.length - notesCount} slide(s) have no speaker notes`); fail++; }

if (problems.length) {
  console.log('\nPROBLEMS:');
  problems.forEach((p) => console.log('  ✗ ' + p));
  process.exit(1);
} else {
  console.log('\n✓ all structural checks passed');
}
