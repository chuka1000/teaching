#!/usr/bin/env node
/**
 * Make every embedded video on a slide play automatically, on its own clock.
 *
 * WHY THIS EXISTS
 * A shape animation lives inside <p:seq nodeType="mainSeq">, which is the
 * click-driven sequence. Clicking to reveal the next build advances that
 * sequence, and PowerPoint completes any still-running animation in it. So a
 * ten-minute "drain" animation snaps to empty on the first click.
 *
 * A <p:video> node is a SIBLING of <p:seq>, not a child. It has its own start
 * condition (delay 0) and its own timeline, so advancing the builds cannot
 * touch it. That is the structure PowerPoint itself writes for a media object
 * set to "Start: Automatically".
 *
 * A video that lib/animate.js has already set to START ON CLICK (effect "play") is left alone: it
 * has its own click node in the main sequence and must NOT also autoplay.
 *
 * Usage:  node lib/autoplay-media.js <deck.pptx>
 * Run it AFTER lib/animate.js, since it merges into the timing that adds.
 */
const AdmZip = require('adm-zip');
const { DOMParser, XMLSerializer } = require('@xmldom/xmldom');

const parse = (xml) => new DOMParser().parseFromString(xml, 'text/xml');
const ser = (doc) => new XMLSerializer().serializeToString(doc);

/** Highest id already used anywhere in the slide's timing tree. */
function maxTimingId(xml) {
  const ids = [...xml.matchAll(/<p:cTn id="(\d+)"/g)].map((m) => +m[1]);
  return ids.length ? Math.max(...ids) : 1;
}

/** spids of every <p:pic> that holds a video. */
function videoShapeIds(doc) {
  const out = [];
  const pics = doc.getElementsByTagName('p:pic');
  for (let i = 0; i < pics.length; i++) {
    const pic = pics[i];
    if (!pic.getElementsByTagName('a:videoFile').length) continue;
    const props = pic.getElementsByTagName('p:cNvPr')[0];
    if (props) out.push({ id: props.getAttribute('id'), name: props.getAttribute('name') });
  }
  return out;
}

const videoNode = (id, spid) =>
  `<p:video><p:cMediaNode vol="0"><p:cTn id="${id}" fill="hold" display="0">` +
  `<p:stCondLst><p:cond delay="0"/></p:stCondLst>` +
  `<p:endCondLst><p:cond evt="onStopAudio" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:endCondLst>` +
  `</p:cTn><p:tgtEl><p:spTgt spid="${spid}"/></p:tgtEl></p:cMediaNode></p:video>`;

const EMPTY_TIMING = (nodes) =>
  `<p:timing><p:tnLst><p:par>` +
  `<p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>` +
  `<p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq">` +
  `<p:childTnLst/></p:cTn>` +
  `<p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>` +
  `<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst>` +
  `</p:seq>${nodes}</p:childTnLst></p:cTn></p:par></p:tnLst></p:timing>`;

function run(deckPath) {
  const zip = new AdmZip(deckPath);
  const entries = zip.getEntries()
    .filter((e) => /^ppt\/slides\/slide\d+\.xml$/.test(e.entryName))
    .sort((a, b) => (+a.entryName.match(/(\d+)/)[1]) - (+b.entryName.match(/(\d+)/)[1]));

  let touched = 0;
  entries.forEach((entry, i) => {
    let xml = zip.readAsText(entry);
    const doc = parse(xml);
    const clickPlayed = new Set([...xml.matchAll(/<p:cmd type="call" cmd="playFrom[^"]*"><p:cBhvr>.*?<p:spTgt spid="(\d+)"/g)].map((m) => m[1]));
    const vids = videoShapeIds(doc).filter((v) => !clickPlayed.has(v.id));
    if (!vids.length) return;

    // EMPTY_TIMING below hardcodes cTn ids 1 and 2, so a slide with no
    // existing timing must start numbering at 3 or the ids collide.
    const hasTiming = xml.includes('<p:timing>');
    let nextId = hasTiming ? maxTimingId(xml) + 1 : 3;
    const nodes = vids.map((v) => videoNode(nextId++, v.id)).join('');

    if (hasTiming) {
      // splice the video nodes in directly after the main sequence closes
      const at = xml.lastIndexOf('</p:seq>');
      if (at === -1) throw new Error(`slide ${i + 1}: <p:timing> present but no </p:seq>`);
      xml = xml.slice(0, at + '</p:seq>'.length) + nodes + xml.slice(at + '</p:seq>'.length);
    } else {
      // CT_Slide order is cSld, clrMapOvr, transition, timing — timing goes last
      xml = xml.replace('</p:sld>', `${EMPTY_TIMING(nodes)}</p:sld>`);
    }

    zip.updateFile(entry.entryName, Buffer.from(xml, 'utf8'));
    touched++;
    console.log(`  slide ${String(i + 1).padStart(2)}  ${vids.length} video(s) set to autoplay`);
  });

  zip.writeZip(deckPath);
  console.log(`autoplay injected on ${touched} slide(s) -> ${deckPath}`);
}

const arg = process.argv[2];
if (!arg) { console.error('usage: node lib/autoplay-media.js <deck.pptx>'); process.exit(1); }
try { run(arg); } catch (e) { console.error('FAILED:', e.message); process.exit(1); }
