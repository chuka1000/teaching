/** Emits spec/losing-the-soil.anim.json. Flat 150 ms. */
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

/* 3. Hook */
{
  const groups = [];
  for (let i = 0; i < 3; i++) groups.push({ name: `h${i}`, members: [`h${i}_bg`, `h${i}_k`, `h${i}_t`] });
  S(3, { groups, builds: [beat(['h0', 'h1', 'h2'])] });
}

/* 4. I Do 1: definition, three cards, banner */
{
  const groups = [{ name: 'def', members: ['def_bg', 'def_t'] }];
  const builds = [click('def')];
  for (let i = 0; i < 3; i++) {
    groups.push({ name: `er${i}`, members: [`er${i}_bg`, `er${i}_icon`, `er${i}_h`, `er${i}_t`] });
    builds.push(click(`er${i}`));
  }
  builds.push(click({ target: 'er_banner', effect: 'zoom' }));
  S(4, { groups, builds });
}

/* 5. Practical: trays, steps, fair-test line, "usually" */
{
  const trayMembers = (k, grass) => [
    `tr${k}_bg`, `tr${k}_h`, `tr${k}_jug`, `tr${k}_drop0`, `tr${k}_drop1`, `tr${k}_drop2`,
    `tr${k}_soil`, ...(grass ? [`tr${k}_grass`] : []), `tr${k}_pot`, `tr${k}_potlbl`, `tr${k}_juglbl`,
  ];
  const groups = [
    { name: 'trA', members: trayMembers('A', false) },
    { name: 'trB', members: trayMembers('B', true) },
  ];
  for (let i = 0; i < 4; i++) groups.push({ name: `ps${i}`, members: [`ps${i}_bg`, `ps${i}_badge`, `ps${i}_num`, `ps${i}_t`] });
  S(5, {
    groups,
    builds: [
      beat(['trA', 'trB']),
      beat(['ps0', 'ps1', 'ps2', 'ps3']),
      click({ target: 'fair_banner', effect: 'zoom' }),
      click({ target: 'look_banner', effect: 'zoom' }),
    ],
  });
}

/* 6. I Do 2: causes, chain, banner */
{
  const groups = [];
  for (let i = 0; i < 3; i++) groups.push({ name: `fc${i}`, members: [`fc${i}_bg`, `fc${i}_icon`, `fc${i}_h`, `fc${i}_t`] });
  for (let i = 0; i < 4; i++) groups.push({ name: `chain${i}`, members: i < 3 ? [`ch${i}`, `ch${i}_arrow`] : [`ch${i}`] });
  S(6, {
    groups,
    builds: [
      beat(['fc0', 'fc1', 'fc2']),
      beat(['chain0', 'chain1', 'chain2', 'chain3']),
      click({ target: 'fm_banner', effect: 'zoom' }),
    ],
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

fs.writeFileSync(path.join(__dirname, '..', 'spec', 'losing-the-soil.anim.json'), JSON.stringify({
  deck: 'out/Losing The Soil/Losing The Soil.pptx',
  output: 'out/Losing The Soil/Losing The Soil.pptx',
  defaults: { transition: 'fade', dur: 400 }, slides,
}, null, 2));
console.log('spec:', slides.reduce((n, s) => n + s.builds.length, 0), 'click builds');
