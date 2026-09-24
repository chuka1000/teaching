/** Emits spec/natural-selection-in-action.anim.json. Flat 150 ms. */
const fs = require('fs'); const path = require('path');
const STEP = 150;
const slides = [];
const click = (...steps) => ({ steps: steps.map((s) => (typeof s === 'string' ? { target: s, effect: 'fade' } : s)) });
const beat = (t, e = 'fade') => ({ steps: t.map((x, i) => (typeof x === 'string' ? { target: x, effect: e, delay: i * STEP } : { ...x, delay: i * STEP })) });
const S = (index, o = {}) => slides.push({ index, transition: 'fade', ...o, builds: o.builds || [] });

/* 1. Do Now */
S(1, { builds: [0, 1, 2, 3, 4, 5].map((i) => click({ target: `d${i}_a`, effect: 'wipe', dir: 'left' })) });

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

/* 3. Hook: the finch picture is static, the three answers arrive together */
{
  const groups = [];
  for (let i = 0; i < 3; i++) groups.push({ name: `h${i}`, members: [`h${i}_bg`, `h${i}_k`, `h${i}_t`] });
  S(3, { groups, builds: [beat(['h0', 'h1', 'h2'])] });
}

/* 4. I Do 1: four steps, then banner */
{
  const groups = [], builds = [];
  for (let i = 0; i < 4; i++) {
    groups.push({ name: `st${i}`, members: [`st${i}_bg`, `st${i}_badge`, `st${i}_num`, `st${i}_h`, `st${i}_t`] });
    builds.push(click(`st${i}`));
  }
  builds.push(click({ target: 'dm_banner', effect: 'zoom' }));
  S(4, { groups, builds });
}

/* 5. Practical: beaks and food, steps, model line, discussion line */
{
  const groups = [
    { name: 'beaks', members: [
      ...[0, 1, 2].flatMap((i) => [`bk${i}_bg`, `bk${i}_icon`, `bk${i}_h`, `bk${i}_s`]),
      'food_bg', 'food_icon', 'food_t',
    ] },
  ];
  for (let i = 0; i < 4; i++) groups.push({ name: `ps${i}`, members: [`ps${i}_bg`, `ps${i}_badge`, `ps${i}_num`, `ps${i}_t`] });
  S(5, {
    groups,
    builds: [
      click('beaks'),
      beat(['ps0', 'ps1', 'ps2', 'ps3']),
      click({ target: 'model_banner', effect: 'zoom' }),
      click({ target: 'look_banner', effect: 'zoom' }),
    ],
  });
}

/* 6. I Do 2: four stages, then both facts, then banner */
{
  const groups = [];
  const vis = [6, 1, 1, 6];
  for (let i = 0; i < 4; i++) {
    const m = [`sg${i}_bg`, `sg${i}_badge`, `sg${i}_num`, `sg${i}_h`, `sg${i}_t`];
    for (let k = 0; k < vis[i]; k++) m.push(`sg${i}_b${k}`);
    groups.push({ name: `sg${i}`, members: m });
  }
  for (let i = 0; i < 2; i++) groups.push({ name: `stat${i}`, members: [`stat${i}_bg`, `stat${i}_big`, `stat${i}_t`] });
  S(6, {
    groups,
    builds: [click('sg0'), click('sg1'), click('sg2'), click('sg3'), beat(['stat0', 'stat1']), click({ target: 'ab_banner', effect: 'zoom' })],
  });
}

/* 7. We Do */
S(7, { builds: [0, 1, 2, 3].map((i) => click({ target: `wd${i}_a`, effect: 'zoom' })) });

/* 8. You Do */
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

fs.writeFileSync(path.join(__dirname, '..', 'spec', 'natural-selection-in-action.anim.json'), JSON.stringify({
  deck: 'out/Natural Selection In Action/Natural Selection In Action.pptx',
  output: 'out/Natural Selection In Action/Natural Selection In Action.pptx',
  defaults: { transition: 'fade', dur: 400 }, slides,
}, null, 2));
console.log('spec:', slides.reduce((n, s) => n + s.builds.length, 0), 'click builds');
