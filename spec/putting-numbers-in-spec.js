/** Emits spec/putting-numbers-in.anim.json. Flat 150 ms. */
const fs = require('fs'); const path = require('path');
const STEP = 150;
const slides = [];
const click = (...steps) => ({ steps: steps.map((s) => (typeof s === 'string' ? { target: s, effect: 'fade' } : s)) });
const beat = (t, e = 'fade') => ({ steps: t.map((x, i) => (typeof x === 'string' ? { target: x, effect: e, delay: i * STEP } : { ...x, delay: i * STEP })) });
const S = (index, o = {}) => slides.push({ index, transition: 'fade', ...o, builds: o.builds || [] });
const range = (n) => Array.from({ length: n }, (_, i) => i);

/* 1. Do Now */
S(1, { builds: range(6).map((i) => click({ target: `d${i}_a`, effect: 'wipe', dir: 'left' })) });

/* 2. Today */
{
  const groups = [], builds = [];
  for (let i = 0; i < 3; i++) {
    groups.push({ name: `o${i}`, members: [`o${i}_bg`, `o${i}_badge`, `o${i}_num`, `o${i}_t`] });
    builds.push(click(`o${i}`));
  }
  builds.push(click({ target: 'obj_banner', effect: 'zoom' }));
  S(2, { groups, builds });
}

/* 3. Hook: the question, then the three options together */
{
  const groups = range(3).map((i) => ({ name: `h${i}`, members: [`h${i}_bg`, `h${i}_k`, `h${i}_t`] }));
  S(3, { groups, builds: [click('hook_q'), beat(['h0', 'h1', 'h2'])] });
}

/* 4. I Do 1: each line of two worked examples, then the two warnings. The machine video autoplays. */
S(4, {
  builds: [
    ...range(3).map((i) => click(`ea_l${i}`)),
    ...range(4).map((i) => click(`eb_l${i}`)),
    click({ target: 'wa', effect: 'zoom' }), click({ target: 'wb', effect: 'zoom' }),
  ].map((b) => b),
});

/* 5. I Do 2: bracket example, two-letter example, the check, three warnings */
{
  const groups = [
    { name: 'chk', members: ['chk_bg', 'chk_t'] },
  ];
  S(5, {
    groups,
    builds: [
      ...range(4).map((i) => click(`ec_l${i}`)),
      ...range(4).map((i) => click(`ed_l${i}`)),
      click('chk'),
      click({ target: 'wc', effect: 'zoom' }), click({ target: 'wd', effect: 'zoom' }), click({ target: 'we', effect: 'zoom' }),
    ],
  });
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

/* 9. Answers */
{
  const groups = [], builds = [];
  for (let i = 0; i < 10; i++) groups.push({ name: `a${i}`, members: [`a${i}_bg`, `a${i}_n`, `a${i}_t`] });
  for (let i = 0; i < 10; i += 2) builds.push(beat([`a${i}`, `a${i + 1}`]));
  S(9, { groups, builds });
}

/* 10. Plenary */
{
  const groups = [], builds = [];
  for (let i = 0; i < 5; i++) {
    groups.push({ name: `p${i}_stmt`, members: [`p${i}_bg`, `p${i}_q`] });
    builds.push(click(`p${i}_stmt`));
    builds.push(click({ target: `p${i}_v`, effect: 'zoom' }));
  }
  builds.push(click('pl_next'));
  S(10, { transition: { type: 'push', dir: 'up', speed: 'med' }, groups, builds });
}

fs.writeFileSync(path.join(__dirname, '..', 'spec', 'putting-numbers-in.anim.json'), JSON.stringify({
  deck: 'out/Putting Numbers In/Putting Numbers In.pptx',
  output: 'out/Putting Numbers In/Putting Numbers In.pptx',
  defaults: { transition: 'fade', dur: 400 }, slides,
}, null, 2));
console.log('spec:', slides.reduce((n, s) => n + s.builds.length, 0), 'click builds');
