/** Emits spec/more-evidence.anim.json. Flat 150 ms. */
const fs = require('fs'); const path = require('path');
const STEP = 150;
const slides = [];
const click = (...steps) => ({ steps: steps.map((s) => (typeof s === 'string' ? { target: s, effect: 'fade' } : s)) });
const beat = (t, e = 'fade') => ({ steps: t.map((x, i) => (typeof x === 'string' ? { target: x, effect: e, delay: i * STEP } : { ...x, delay: i * STEP })) });
const S = (index, o = {}) => slides.push({ index, transition: 'fade', ...o, builds: o.builds || [] });
const range = (n) => Array.from({ length: n }, (_, i) => i);

/* 1. Do Now */
S(1, { builds: range(6).map((i) => click({ target: `d${i}_a`, effect: 'wipe', dir: 'left' })) });

/* 2. Today (Objectives) */
{
  const groups = [], builds = [];
  for (let i = 0; i < 3; i++) { groups.push({ name: `o${i}`, members: [`o${i}_bg`, `o${i}_badge`, `o${i}_num`, `o${i}_t`] }); builds.push(click(`o${i}`)); }
  builds.push(click({ target: 'obj_banner', effect: 'zoom' }));
  S(2, { groups, builds });
}

/* 3. Hook: the three options together */
{
  const groups = range(3).map((i) => ({ name: `h${i}`, members: [`h${i}_bg`, `h${i}_k`, `h${i}_t`] }));
  S(3, { groups, builds: [beat(['h0', 'h1', 'h2'])] });
}

/* 4. I Do 1: the animation (ON CLICK), the four cards, the banner */
{
  const groups = range(4).map((i) => ({ name: `hs${i}`, members: [`hs${i}_bg`, `hs${i}_badge`, `hs${i}_num`, `hs${i}_t`] }));
  S(4, { groups, builds: [click({ target: 'vid_limbs', effect: 'play' }), ...range(4).map((i) => click(`hs${i}`)), click({ target: 'hom_banner', effect: 'zoom' })] });
}

/* 5. I Do 2: the animation (ON CLICK), early development, DNA, its two bars, the two lines */
{
  const groups = [
    { name: 'embg', members: ['emb_bg', 'emb_h', 'emb_t'] },
    { name: 'dnag', members: ['dna_bg', 'dna_h', 'dna_s'] },
    { name: 'bar0', members: ['dna_l0', 'dna_t0', 'dna_b0', 'dna_p0'] },
    { name: 'bar1', members: ['dna_l1', 'dna_t1', 'dna_b1', 'dna_p1'] },
  ];
  S(5, { groups, builds: [click({ target: 'vid_embryos', effect: 'play' }), click('embg'), click('dnag'), click('bar0'), click('bar1'), click('dna_t')] });
}

/* 6. We Do */
S(6, { builds: range(4).map((i) => click({ target: `wd${i}_a`, effect: 'zoom' })) });

/* 7. Cold Call */
S(7, { builds: range(6).map((i) => click({ target: `c${i}_a`, effect: 'wipe', dir: 'left' })) });

/* 8. You Do */
{
  const groups = [], builds = [];
  for (let i = 0; i < 3; i++) { groups.push({ name: `t${i}`, members: [`t${i}_bg`, `t${i}_h`, `t${i}_s`, `t${i}_b`] }); builds.push(click(`t${i}`)); }
  builds.push(click('yd_note'));
  S(8, { groups, builds });
}

/* 9. Plenary */
{
  const groups = [], builds = [];
  for (let i = 0; i < 5; i++) { groups.push({ name: `p${i}_stmt`, members: [`p${i}_bg`, `p${i}_q`] }); builds.push(click(`p${i}_stmt`)); builds.push(click({ target: `p${i}_v`, effect: 'zoom' })); }
  builds.push(click('pl_next'));
  S(9, { transition: { type: 'push', dir: 'up', speed: 'med' }, groups, builds });
}

fs.writeFileSync(path.join(__dirname, '..', 'spec', 'more-evidence.anim.json'), JSON.stringify({
  deck: 'out/More Evidence/More Evidence.pptx', output: 'out/More Evidence/More Evidence.pptx',
  defaults: { transition: 'fade', dur: 400 }, slides,
}, null, 2));
console.log('spec:', slides.reduce((n, s) => n + s.builds.length, 0), 'click builds');
