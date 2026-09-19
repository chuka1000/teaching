#!/usr/bin/env node
/**
 * animate.js — post-process a pptxgenjs deck to add what pptxgenjs cannot write.
 *
 *   node lib/animate.js spec/my-deck.anim.json
 *
 * For each slide named in the spec it will:
 *   • wrap named shapes in <p:grpSp> so they build and move as one object
 *   • insert <p:transition>  (fade | push | wipe | cover — the four Keynote imports cleanly)
 *   • insert <p:timing>      (fade | fly | wipe | zoom entrances, fade exits)
 *   • set show="0" on hidden slides
 *
 * Shapes are addressed by the objectName given in pptxgenjs, never by index,
 * so editing the deck does not silently rewire the animation.
 *
 * SPEC FORMAT
 * {
 *   "deck": "out/Deck.pptx",                 // read
 *   "output": "out/Deck.pptx",               // write (may be the same file)
 *   "defaults": { "transition": "fade", "dur": 500 },
 *   "slides": [
 *     { "index": 1,                          // 1-based, matches slide order
 *       "hidden": true,                      // -> show="0"
 *       "transition": { "type": "push", "dir": "u", "speed": "med" },
 *       "groups": [ { "name": "motif", "members": ["motif_trunk", "motif_leaf1"] } ],
 *       "builds": [                          // one entry per CLICK, in order
 *         { "auto": true,                    // omit for a normal click
 *           "steps": [
 *             { "target": "motif_sun", "effect": "fade", "delay": 0 },
 *             { "target": "motif", "effect": "fly", "dir": "bottom", "delay": 250 }
 *           ] },
 *         { "steps": [ { "target": "answer1", "effect": "wipe", "dir": "left" } ] }
 *       ] }
 *   ]
 * }
 *
 * effect: fade | fly | wipe | zoom | exit
 * dir:    left | right | top | bottom   (fly, wipe, push, cover)
 */

const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const { DOMParser, XMLSerializer } = require('@xmldom/xmldom');

const P_NS = 'http://schemas.openxmlformats.org/presentationml/2006/main';
const A_NS = 'http://schemas.openxmlformats.org/drawingml/2006/main';

/* ---------- direction tables -------------------------------------- */
// PowerPoint's directional bitmask: 1 = from top, 2 = from right, 4 = from bottom, 8 = from left
const DIR_SUBTYPE = { top: 1, right: 2, bottom: 4, left: 8 };
// the filter names the direction the reveal edge travels, i.e. the opposite
const WIPE_FILTER = { top: 'wipe(down)', right: 'wipe(left)', bottom: 'wipe(up)', left: 'wipe(right)' };
const FLY_FROM = {
  bottom: { x: '#ppt_x', y: '1+#ppt_h/2' },
  top:    { x: '#ppt_x', y: '0-#ppt_h/2' },
  left:   { x: '0-#ppt_w/2', y: '#ppt_y' },
  right:  { x: '1+#ppt_w/2', y: '#ppt_y' },
};
// <p:push>/<p:cover> use compass letters
const SLIDE_DIR = { top: 'd', bottom: 'u', left: 'r', right: 'l', up: 'u', down: 'd' };

/* ---------- tiny XML helpers -------------------------------------- */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function parse(xml) {
  return new DOMParser({ onError: (lvl, msg) => { if (lvl === 'error' || lvl === 'fatalError') throw new Error(msg); } })
    .parseFromString(xml, 'text/xml');
}
function serialize(doc) { return new XMLSerializer().serializeToString(doc); }

/** Parse an XML fragment string and import its root into `doc`. */
function frag(doc, xmlString) {
  const wrapped = `<w xmlns:p="${P_NS}" xmlns:a="${A_NS}">${xmlString}</w>`;
  const d = parse(wrapped);
  return doc.importNode(d.documentElement.firstChild, true);
}

function childrenNamed(node, name) {
  const out = [];
  for (let n = node.firstChild; n; n = n.nextSibling) {
    if (n.nodeType === 1 && (n.nodeName === name || n.localName === name.split(':').pop())) out.push(n);
  }
  return out;
}

/* ---------- shape index ------------------------------------------- */
/**
 * Map objectName -> { id, node } for every top-level sp/pic/graphicFrame/grpSp
 * on the slide, and track the highest id so new groups get a free one.
 */
function indexShapes(doc) {
  const spTree = doc.getElementsByTagNameNS(P_NS, 'spTree')[0];
  if (!spTree) throw new Error('no spTree');
  const byName = new Map();
  let maxId = 1;
  const walk = (parent, topLevel) => {
    for (let n = parent.firstChild; n; n = n.nextSibling) {
      if (n.nodeType !== 1) continue;
      const ln = n.localName;
      if (!['sp', 'pic', 'graphicFrame', 'grpSp', 'cxnSp'].includes(ln)) continue;
      const cNvPr = n.getElementsByTagNameNS(P_NS, 'cNvPr')[0];
      if (cNvPr) {
        const id = parseInt(cNvPr.getAttribute('id'), 10);
        if (!isNaN(id)) maxId = Math.max(maxId, id);
        const nm = cNvPr.getAttribute('name');
        if (nm && !byName.has(nm)) byName.set(nm, { id, node: n, topLevel });
      }
      if (ln === 'grpSp') walk(n, false);
    }
  };
  walk(spTree, true);
  return { spTree, byName, maxId };
}

/* ---------- grouping ---------------------------------------------- */
function bbox(nodes) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity, found = 0;
  nodes.forEach((n) => {
    const xfrm = n.getElementsByTagNameNS(A_NS, 'xfrm')[0];
    if (!xfrm) return;
    const off = xfrm.getElementsByTagNameNS(A_NS, 'off')[0];
    const ext = xfrm.getElementsByTagNameNS(A_NS, 'ext')[0];
    if (!off || !ext) return;
    const x = +off.getAttribute('x'), y = +off.getAttribute('y');
    const cx = +ext.getAttribute('cx'), cy = +ext.getAttribute('cy');
    x0 = Math.min(x0, x); y0 = Math.min(y0, y);
    x1 = Math.max(x1, x + cx); y1 = Math.max(y1, y + cy);
    found++;
  });
  if (!found) throw new Error('cannot compute bounding box — no a:xfrm on members');
  return { x: x0, y: y0, cx: x1 - x0, cy: y1 - y0 };
}

function makeGroup(doc, idx, spec, slideLabel) {
  const members = spec.members.map((m) => {
    const hit = idx.byName.get(m);
    if (!hit) throw new Error(`${slideLabel}: group "${spec.name}" references unknown shape "${m}"`);
    if (!hit.topLevel) throw new Error(`${slideLabel}: "${m}" is already inside a group`);
    return hit.node;
  });
  const b = bbox(members);
  const gid = ++idx.maxId;
  const g = frag(doc,
    `<p:grpSp>` +
      `<p:nvGrpSpPr><p:cNvPr id="${gid}" name="${esc(spec.name)}"/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>` +
      `<p:grpSpPr><a:xfrm>` +
        `<a:off x="${b.x}" y="${b.y}"/><a:ext cx="${b.cx}" cy="${b.cy}"/>` +
        `<a:chOff x="${b.x}" y="${b.y}"/><a:chExt cx="${b.cx}" cy="${b.cy}"/>` +
      `</a:xfrm></p:grpSpPr>` +
    `</p:grpSp>`);
  idx.spTree.insertBefore(g, members[0]);
  members.forEach((m) => { m.parentNode.removeChild(m); g.appendChild(m); });
  idx.byName.set(spec.name, { id: gid, node: g, topLevel: true });
  return gid;
}

/* ---------- timing ------------------------------------------------ */
class Ids { constructor(start = 1) { this.n = start; } next() { return ++this.n; } }

function visibleSet(ids, spid, delay = 0, value = 'visible') {
  return `<p:set><p:cBhvr><p:cTn id="${ids.next()}" dur="1" fill="hold">` +
         `<p:stCondLst><p:cond delay="${delay}"/></p:stCondLst></p:cTn>` +
         `<p:tgtEl><p:spTgt spid="${spid}"/></p:tgtEl>` +
         `<p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr>` +
         `<p:to><p:strVal val="${value}"/></p:to></p:set>`;
}

function effectBody(ids, step, spid, dur) {
  const dir = step.dir || 'bottom';
  switch (step.effect) {
    case 'fade':
      return { preset: 10, cls: 'entr', sub: 0,
        xml: visibleSet(ids, spid) +
          `<p:animEffect transition="in" filter="fade"><p:cBhvr><p:cTn id="${ids.next()}" dur="${dur}"/>` +
          `<p:tgtEl><p:spTgt spid="${spid}"/></p:tgtEl></p:cBhvr></p:animEffect>` };
    case 'wipe':
      return { preset: 22, cls: 'entr', sub: DIR_SUBTYPE[dir],
        xml: visibleSet(ids, spid) +
          `<p:animEffect transition="in" filter="${WIPE_FILTER[dir]}"><p:cBhvr><p:cTn id="${ids.next()}" dur="${dur}"/>` +
          `<p:tgtEl><p:spTgt spid="${spid}"/></p:tgtEl></p:cBhvr></p:animEffect>` };
    case 'fly': {
      const f = FLY_FROM[dir];
      const anim = (attr, from, to) =>
        `<p:anim calcmode="lin" valueType="num"><p:cBhvr additive="base">` +
        `<p:cTn id="${ids.next()}" dur="${dur}" fill="hold"/>` +
        `<p:tgtEl><p:spTgt spid="${spid}"/></p:tgtEl>` +
        `<p:attrNameLst><p:attrName>${attr}</p:attrName></p:attrNameLst></p:cBhvr>` +
        `<p:tavLst><p:tav tm="0"><p:val><p:strVal val="${from}"/></p:val></p:tav>` +
        `<p:tav tm="100000"><p:val><p:strVal val="${to}"/></p:val></p:tav></p:tavLst></p:anim>`;
      return { preset: 2, cls: 'entr', sub: DIR_SUBTYPE[dir],
        xml: visibleSet(ids, spid) + anim('ppt_x', f.x, '#ppt_x') + anim('ppt_y', f.y, '#ppt_y') };
    }
    case 'zoom':
      return { preset: 23, cls: 'entr', sub: 16,
        xml: visibleSet(ids, spid) +
          `<p:animEffect transition="in" filter="fade"><p:cBhvr><p:cTn id="${ids.next()}" dur="${dur}"/>` +
          `<p:tgtEl><p:spTgt spid="${spid}"/></p:tgtEl></p:cBhvr></p:animEffect>` +
          `<p:animScale><p:cBhvr><p:cTn id="${ids.next()}" dur="${dur}" fill="hold"/>` +
          `<p:tgtEl><p:spTgt spid="${spid}"/></p:tgtEl></p:cBhvr>` +
          `<p:from x="0" y="0"/><p:to x="100000" y="100000"/></p:animScale>` };
    case 'exit':
      return { preset: 10, cls: 'exit', sub: 0,
        xml: `<p:animEffect transition="out" filter="fade"><p:cBhvr><p:cTn id="${ids.next()}" dur="${dur}"/>` +
          `<p:tgtEl><p:spTgt spid="${spid}"/></p:tgtEl></p:cBhvr></p:animEffect>` +
          visibleSet(ids, spid, Math.max(0, dur - 1), 'hidden') };
    default:
      throw new Error(`unknown effect "${step.effect}" (fade|fly|wipe|zoom|exit)`);
  }
}

function buildTiming(ids, builds, resolve, defaultDur, slideLabel) {
  const clicks = builds.map((build) => {
    const inner = build.steps.map((step, i) => {
      const spid = resolve(step.target, slideLabel);
      const dur = step.dur || defaultDur;
      const delay = step.delay || 0;
      // first step of a click group is the click trigger; the rest ride along with a delay
      const nodeType = build.auto ? 'withEffect' : (i === 0 ? 'clickEffect' : 'withEffect');
      const body = effectBody(ids, step, spid, dur);
      return `<p:par><p:cTn id="${ids.next()}" presetID="${body.preset}" presetClass="${body.cls}" ` +
             `presetSubtype="${body.sub}" fill="hold" grpId="0" nodeType="${nodeType}">` +
             `<p:stCondLst><p:cond delay="${delay}"/></p:stCondLst>` +
             `<p:childTnLst>${body.xml}</p:childTnLst></p:cTn></p:par>`;
    }).join('');

    return `<p:par><p:cTn id="${ids.next()}" fill="hold">` +
           `<p:stCondLst><p:cond delay="${build.auto ? 0 : 'indefinite'}"/></p:stCondLst>` +
           `<p:childTnLst><p:par><p:cTn id="${ids.next()}" fill="hold">` +
           `<p:stCondLst><p:cond delay="0"/></p:stCondLst>` +
           `<p:childTnLst>${inner}</p:childTnLst></p:cTn></p:par></p:childTnLst>` +
           `</p:cTn></p:par>`;
  }).join('');

  return `<p:timing><p:tnLst><p:par>` +
    `<p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>` +
    `<p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq">` +
    `<p:childTnLst>${clicks}</p:childTnLst></p:cTn>` +
    `<p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>` +
    `<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst>` +
    `</p:seq></p:childTnLst></p:cTn></p:par></p:tnLst></p:timing>`;
}

/* ---------- transition -------------------------------------------- */
function transitionXml(t) {
  if (!t) return '';
  const spec = typeof t === 'string' ? { type: t } : t;
  const speed = spec.speed || 'med';
  let inner;
  switch (spec.type) {
    case 'fade':  inner = '<p:fade/>'; break;
    case 'push':  inner = `<p:push dir="${SLIDE_DIR[spec.dir] || 'u'}"/>`; break;
    case 'wipe':  inner = `<p:wipe dir="${SLIDE_DIR[spec.dir] || 'd'}"/>`; break;
    case 'cover': inner = `<p:cover dir="${SLIDE_DIR[spec.dir] || 'd'}"/>`; break;
    default: throw new Error(`transition "${spec.type}" is not one of fade|push|wipe|cover`);
  }
  return `<p:transition spd="${speed}">${inner}</p:transition>`;
}

/* ---------- main --------------------------------------------------- */
function run(specPath) {
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const root = path.dirname(path.resolve(specPath));
  const resolvePath = (p) => path.resolve(root, '..', p);
  const deckPath = resolvePath(spec.deck);
  const outPath = resolvePath(spec.output || spec.deck);
  const defDur = (spec.defaults && spec.defaults.dur) || 500;
  const defTrans = spec.defaults && spec.defaults.transition;

  const zip = new AdmZip(deckPath);
  const entries = zip.getEntries()
    .filter((e) => /^ppt\/slides\/slide\d+\.xml$/.test(e.entryName))
    .sort((a, b) => (+a.entryName.match(/(\d+)/)[1]) - (+b.entryName.match(/(\d+)/)[1]));

  const report = [];
  spec.slides.forEach((sl) => {
    const entry = entries[sl.index - 1];
    if (!entry) throw new Error(`spec references slide ${sl.index} but the deck has ${entries.length}`);
    const label = `slide ${sl.index}`;
    const doc = parse(zip.readAsText(entry));
    const idx = indexShapes(doc);

    (sl.groups || []).forEach((g) => makeGroup(doc, idx, g, label));

    const resolve = (name, lbl) => {
      const hit = idx.byName.get(name);
      if (!hit) throw new Error(`${lbl}: build references unknown shape "${name}"`);
      return hit.id;
    };

    const sld = doc.documentElement;
    if (sl.hidden) sld.setAttribute('show', '0');

    // CT_Slide order: cSld, clrMapOvr, transition, timing — append in that order
    const tx = transitionXml(sl.transition !== undefined ? sl.transition : defTrans);
    if (tx) sld.appendChild(frag(doc, tx));

    let clicks = 0;
    if (sl.builds && sl.builds.length) {
      const ids = new Ids(2);
      sld.appendChild(frag(doc, buildTiming(ids, sl.builds, resolve, defDur, label)));
      clicks = sl.builds.filter((b) => !b.auto).length;
    }

    zip.updateFile(entry.entryName, Buffer.from(serialize(doc), 'utf8'));
    report.push({ slide: sl.index, hidden: !!sl.hidden, groups: (sl.groups || []).length, clicks,
                  auto: (sl.builds || []).filter((b) => b.auto).length });
  });

  zip.writeZip(outPath);
  return { outPath, report, total: entries.length };
}

if (require.main === module) {
  const specArg = process.argv[2];
  if (!specArg) { console.error('usage: node lib/animate.js <spec.json>'); process.exit(1); }
  try {
    const r = run(specArg);
    console.log(`animated ${r.report.length}/${r.total} slides -> ${r.outPath}`);
    r.report.forEach((x) => console.log(
      `  slide ${String(x.slide).padStart(2)}  clicks:${String(x.clicks).padStart(2)}  auto:${x.auto}  groups:${x.groups}${x.hidden ? '  [HIDDEN]' : ''}`));
  } catch (e) { console.error('FAILED:', e.message); process.exit(1); }
}

module.exports = { run };
