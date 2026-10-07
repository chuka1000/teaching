/** Emits spec/averages-graphs-and-models.anim.json. Flat 150 ms. */
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

/* 4. I Do 1: the definitions, then thermometer A (with the table frame), B, C */
{
  const groups = [
    { name: 'defg', members: ['def_bg', 'def_t'] },
    { name: 'tblg', members: ['tbl_bg', 'tbl_h', ...range(5).map((i) => `colh_${i}`)] },
    ...['A', 'B', 'C'].map((k) => ({ name: `row${k}`, members: [`r${k}_bg`, ...range(5).map((c) => `r${k}_c${c}`)] })),
  ];
  S(4, { groups, builds: [click('defg'), click('tblg', 'rowA'), click('rowB'), click('rowC')] });
}

/* 5. I Do 2: the three graph types together, then the model */
{
  const groups = [
    ...['bar', 'line', 'pie'].map((k) => ({ name: `g${k}`, members: [`g_${k}_bg`, `g_${k}_icon`, `g_${k}_h`, `g_${k}_t`, `g_${k}_e`] })),
    { name: 'modelg', members: ['model_bg', 'model_icon', 'model_h', 'model_t'] },
  ];
  S(5, { groups, builds: [beat(['gbar', 'gline', 'gpie']), click('modelg')] });
}

/* 6. We Do */
S(6, { builds: range(4).map((i) => click({ target: `wd${i}_a`, effect: 'zoom' })) });

/* 7. Cold Call */
S(7, { builds: range(6).map((i) => click({ target: `c${i}_a`, effect: 'wipe', dir: 'left' })) });

/* 8. You Do: the results stay on screen; the three jobs, then the plotting steps */
{
  const groups = [], builds = [];
  for (let i = 0; i < 3; i++) { groups.push({ name: `t${i}`, members: [`t${i}_bg`, `t${i}_h`, `t${i}_s`, `t${i}_b`] }); builds.push(click(`t${i}`)); }
  groups.push({ name: 'stepsg', members: ['steps_bg', 'steps_h', ...range(5).flatMap((i) => [`steps_b${i}`, `steps_n${i}`, `steps_t${i}`])] });
  builds.push(click('stepsg'));
  S(8, { groups, builds });
}

/* 9. Plenary */
{
  const groups = [], builds = [];
  for (let i = 0; i < 5; i++) { groups.push({ name: `p${i}_stmt`, members: [`p${i}_bg`, `p${i}_q`] }); builds.push(click(`p${i}_stmt`)); builds.push(click({ target: `p${i}_v`, effect: 'zoom' })); }
  builds.push(click('pl_next'));
  S(9, { transition: { type: 'push', dir: 'up', speed: 'med' }, groups, builds });
}

fs.writeFileSync(path.join(__dirname, '..', 'spec', 'averages-graphs-and-models.anim.json'), JSON.stringify({
  deck: 'out/Averages, Graphs And Models/Averages, Graphs And Models.pptx', output: 'out/Averages, Graphs And Models/Averages, Graphs And Models.pptx',
  defaults: { transition: 'fade', dur: 400 }, slides,
}, null, 2));
console.log('spec:', slides.reduce((n, s) => n + s.builds.length, 0), 'click builds');
