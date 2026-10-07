/** Emits spec/fossils-and-the-fossil-record.anim.json. Flat 150 ms. */
const fs = require('fs'); const path = require('path');
const STEP = 150;
const slides = [];
const click = (...steps) => ({ steps: steps.map((s) => (typeof s === 'string' ? { target: s, effect: 'fade' } : s)) });
const beat = (t, e = 'fade') => ({ steps: t.map((x, i) => (typeof x === 'string' ? { target: x, effect: e, delay: i * STEP } : { ...x, delay: i * STEP })) });
const S = (index, o = {}) => slides.push({ index, transition: 'fade', ...o, builds: o.builds || [] });
const range = (n) => Array.from({ length: n }, (_, i) => i);

/* 1. Do Now */
S(1, { builds: range(6).map((i) => click({ target: `d${i}_a`, effect: 'wipe', dir: 'left' })) });

/* 2. Objectives */
{
  const groups = [], builds = [];
  for (let i = 0; i < 3; i++) {
    groups.push({ name: `o${i}`, members: [`o${i}_bg`, `o${i}_badge`, `o${i}_num`, `o${i}_t`] });
    builds.push(click(`o${i}`));
  }
  builds.push(click({ target: 'obj_banner', effect: 'zoom' }));
  S(2, { groups, builds });
}

/* 3. Hook: the three options together */
{
  const groups = range(3).map((i) => ({ name: `h${i}`, members: [`h${i}_bg`, `h${i}_k`, `h${i}_icon`, `h${i}_t`] }));
  S(3, { groups, builds: [beat(['h0', 'h1', 'h2'])] });
}

/* 4. I Do 1: the animation (ON CLICK), then the five steps, then the banner */
{
  const groups = range(5).map((i) => ({ name: `fs${i}`, members: [`fs${i}_bg`, `fs${i}_badge`, `fs${i}_num`, `fs${i}_t`] }));
  S(4, { groups, builds: [
    click({ target: 'vid_formation', effect: 'play' }),
    ...range(5).map((i) => click(`fs${i}`)),
    click({ target: 'form_banner', effect: 'zoom' }),
  ] });
}

/* 5. I Do 2: the animation (ON CLICK), the order card, the gaps header, then the three gaps */
{
  const groups = [
    { name: 'ordg', members: ['ord_bg', 'ord_h', 'ord_t'] },
    { name: 'gapg', members: ['gap_bg', 'gap_h', 'gap_s'] },
  ];
  S(5, { groups, builds: [
    click({ target: 'vid_layers', effect: 'play' }),
    click('ordg'), click('gapg'),
    ...range(3).map((i) => click({ target: `gp${i}`, effect: 'zoom' })),
  ] });
}

/* 6. We Do */
S(6, { builds: range(4).map((i) => click({ target: `wd${i}_a`, effect: 'zoom' })) });

/* 7. Cold Call */
S(7, { builds: range(6).map((i) => click({ target: `c${i}_a`, effect: 'wipe', dir: 'left' })) });

/* 8. You Do: three rounds, then the note */
{
  const groups = [], builds = [];
  for (let i = 0; i < 3; i++) {
    groups.push({ name: `t${i}`, members: [`t${i}_bg`, `t${i}_h`, `t${i}_s`, `t${i}_b`] });
    builds.push(click(`t${i}`));
  }
  builds.push(click('yd_note'));
  S(8, { groups, builds });
}

/* 9. Plenary */
{
  const groups = [], builds = [];
  for (let i = 0; i < 5; i++) {
    groups.push({ name: `p${i}_stmt`, members: [`p${i}_bg`, `p${i}_q`] });
    builds.push(click(`p${i}_stmt`));
    builds.push(click({ target: `p${i}_v`, effect: 'zoom' }));
  }
  builds.push(click('pl_next'));
  S(9, { transition: { type: 'push', dir: 'up', speed: 'med' }, groups, builds });
}

fs.writeFileSync(path.join(__dirname, '..', 'spec', 'fossils-and-the-fossil-record.anim.json'), JSON.stringify({
  deck: 'out/Fossils And The Fossil Record/Fossils And The Fossil Record.pptx',
  output: 'out/Fossils And The Fossil Record/Fossils And The Fossil Record.pptx',
  defaults: { transition: 'fade', dur: 400 }, slides,
}, null, 2));
console.log('spec:', slides.reduce((n, s) => n + s.builds.length, 0), 'click builds');
