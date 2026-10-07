/**
 * Refuses to let a raw (un-animated) deck builder overwrite a deck that has already been through the
 * pipeline.
 *
 * build/<slug>.js writes the RAW deck: no click builds, no slide transitions, no timer autoplay.
 * lib/animate.js and lib/autoplay-media.js add those afterwards, and only
 * `node tools/build-lesson.js <slug>` runs the whole chain. Running a build script on its own
 * after that (to "just check the phase minutes", say) silently strips every reveal from the
 * deck. That shipped once: a Do Now with no answers revealing one at a time.
 *
 * Every deck builder requires lib/theme.js, which requires this. build-lesson.js sets
 * LESSON_PIPELINE=1, which is the only thing that lets a raw write replace an animated deck.
 */
const fs = require('fs');
const JSZip = require('jszip');
const PptxGenJS = require('pptxgenjs');

const original = PptxGenJS.prototype.writeFile;
PptxGenJS.prototype.writeFile = async function (props) {
  const file = typeof props === 'string' ? props : props && props.fileName;
  if (file && !process.env.LESSON_PIPELINE && fs.existsSync(file)) {
    let animated = false;
    try {
      const zip = await JSZip.loadAsync(fs.readFileSync(file));
      for (const name of Object.keys(zip.files)) {
        if (/^ppt\/slides\/slide\d+\.xml$/.test(name) && (await zip.files[name].async('string')).includes('<p:timing')) { animated = true; break; }
      }
    } catch (e) { /* not a readable deck: let the write go ahead */ }
    if (animated) {
      const msg = `REFUSED: ${file} has animations, and this raw builder would replace it with a deck that has none.\n`
        + '        Run the whole pipeline instead:  node tools/build-lesson.js <lesson-slug>';
      console.error('\n' + msg + '\n');
      throw new Error(msg);
    }
  }
  return original.call(this, props);
};
