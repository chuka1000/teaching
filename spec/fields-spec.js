/** Emits spec/fields.anim.json. Flat 150 ms. */
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

/* 3. Hook — one reveal click */
{
  const groups = [{ name: 'hook_reveal', members: ['hook_reveal_bg', 'hook_reveal_t', 'hook_reveal_n'] }];
  S(3, { groups, builds: [click('hook_reveal')] });
}

/* 4. I Do 1 — definition, then two columns */
{
  const groups = [
    { name: 'def', members: ['def_bg', 'def_t'] },
    { name: 'ctA', members: ['ctA_bg', 'ctA_h', 'ctA_list'] },
    {
      name: 'ctB',
      members: ['ctB_bg', 'ctB_h', 'ctB_r0_icon', 'ctB_r0_t', 'ctB_r1_icon', 'ctB_r1_t', 'ctB_r2_icon', 'ctB_r2_t'],
    },
  ];
  S(4, { groups, builds: [click('def'), click('ctA'), click('ctB')] });
}

/* 5. I Do 2 — three field cards */
{
  const rowMembers = (i) => [
    `fc${i}_bg`, `fc${i}_icon`, `fc${i}_h`, `fc${i}_rule`,
    `fc${i}_r0_l`, `fc${i}_r0_v`, `fc${i}_r1_l`, `fc${i}_r1_v`, `fc${i}_r2_l`, `fc${i}_r2_v`,
  ];
  const groups = [], builds = [];
  for (let i = 0; i < 3; i++) {
    groups.push({ name: `fc${i}`, members: rowMembers(i) });
    builds.push(click(`fc${i}`));
  }
  S(5, { groups, builds });
}

/* 6. I Do 3 — field line diagrams, one column at a time */
{
  const arrows = (name) => Array.from({ length: 8 }, (_, i) => `${name}_ln${i}`);
  const groups = [
    { name: 'fl0', members: ['fl0_h', 'g_core', 'g_lbl', ...arrows('g'), 'fl0_cap'] },
    { name: 'fl1', members: ['fl1_h', 'e_core', 'e_lbl', ...arrows('e'), 'fl1_cap'] },
    { name: 'fl2', members: ['fl2_h', 'fl2_photo', 'fl2_cap'] },
  ];
  S(6, { groups, builds: [click('fl0'), click('fl1'), click('fl2')] });
}

/* 7. Discuss — six scenario cards */
{
  const groups = [], builds = [];
  for (let i = 0; i < 6; i++) {
    groups.push({ name: `sc${i}`, members: [`sc${i}_bg`, `sc${i}_icon`, `sc${i}_t`, `sc${i}_a`] });
    builds.push(click(`sc${i}`));
  }
  S(7, { groups, builds });
}

/* 8. Closing — three recap rows, then the closing line */
{
  const groups = [], builds = [];
  for (let i = 0; i < 3; i++) {
    groups.push({ name: `cl${i}`, members: [`cl${i}_bg`, `cl${i}_icon`, `cl${i}_t`] });
    builds.push(click(`cl${i}`));
  }
  builds.push(click('pl_next'));
  S(8, { transition: { type: 'push', dir: 'up', speed: 'med' }, groups, builds });
}

fs.writeFileSync(path.join(__dirname, '..', 'spec', 'fields.anim.json'), JSON.stringify({
  deck: 'out/Introduction to Fields/Introduction to Fields.pptx',
  output: 'out/Introduction to Fields/Introduction to Fields.pptx',
  defaults: { transition: 'fade', dur: 400 }, slides,
}, null, 2));
console.log('spec:', slides.reduce((n, s) => n + s.builds.length, 0), 'click builds');
