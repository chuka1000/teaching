/** Emits spec/measuring-and-recording-honestly.anim.json. Flat 150 ms. */
const fs = require('fs'); const path = require('path');
const STEP = 150;
const slides = [];
const click = (...steps) => ({ steps: steps.map((s) => (typeof s === 'string' ? { target: s, effect: 'fade' } : s)) });
const beat = (t, e = 'fade') => ({ steps: t.map((x, i) => (typeof x === 'string' ? { target: x, effect: e, delay: i * STEP } : { ...x, delay: i * STEP })) });
const S = (index, o = {}) => slides.push({ index, transition: 'fade', ...o, builds: o.builds || [] });
const range = (n) => Array.from({ length: n }, (_, i) => i);
const dbMembers = (n) => range(4).map((i) => `${n}_ring${i}`).concat(range(5).map((i) => `${n}_dot${i}`));

/* 1. Do Now */
S(1, { builds: range(6).map((i) => click({ target: `d${i}_a`, effect: 'wipe', dir: 'left' })) });

/* 2. Today (Objectives) */
{
  const groups = [], builds = [];
  for (let i = 0; i < 3; i++) { groups.push({ name: `o${i}`, members: [`o${i}_bg`, `o${i}_badge`, `o${i}_num`, `o${i}_t`] }); builds.push(click(`o${i}`)); }
  builds.push(click({ target: 'obj_banner', effect: 'zoom' }));
  S(2, { groups, builds });
}

/* 3. Hook: four dartboards together */
{
  const groups = range(4).map((i) => ({ name: `db${i}g`, members: dbMembers(`db${i}`).concat([`db${i}_label`]) }));
  S(3, { groups, builds: [beat(['db0g', 'db1g', 'db2g', 'db3g'])] });
}

/* 4. I Do 1: the definition, the broken-ruler card, the instrument card */
{
  const groups = [
    { name: 'def', members: ['def_bg', 'def_t'] },
    { name: 'brg', members: ['br_bg', 'br_icon', 'br_h', 'br_t'] },
    { name: 'chg', members: ['ch_bg', 'ch_icon', 'ch_h', 'ch_t'] },
  ];
  S(4, { groups, builds: [click('def'), click('brg'), click('chg')] });
}

/* 5. I Do 2: the definition, then the four labelled boards together */
{
  const groups = [
    { name: 'pdef', members: ['pdef_bg', 'pdef_t'] },
    ...range(4).map((i) => ({ name: `pb${i}g`, members: dbMembers(`pb${i}`).concat([`pb${i}_label`]) })),
  ];
  S(5, { groups, builds: [click('pdef'), beat(['pb0g', 'pb1g', 'pb2g', 'pb3g']), click({ target: 'p_note', effect: 'zoom' })] });
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

fs.writeFileSync(path.join(__dirname, '..', 'spec', 'measuring-and-recording-honestly.anim.json'), JSON.stringify({
  deck: 'out/Measuring And Recording Honestly/Measuring And Recording Honestly.pptx', output: 'out/Measuring And Recording Honestly/Measuring And Recording Honestly.pptx',
  defaults: { transition: 'fade', dur: 400 }, slides,
}, null, 2));
console.log('spec:', slides.reduce((n, s) => n + s.builds.length, 0), 'click builds');
