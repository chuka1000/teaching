/** Emits spec/the-nucleus.anim.json. Flat 150 ms; no timer video for this track. */
const fs = require('fs'); const path = require('path');
const STEP = 150;
const slides = [];
const click = (...steps) => ({ steps: steps.map((s) => (typeof s === 'string' ? { target: s, effect: 'fade' } : s)) });
const beat = (t, e = 'fade') => ({ steps: t.map((x, i) => (typeof x === 'string' ? { target: x, effect: e, delay: i * STEP } : { ...x, delay: i * STEP })) });
const S = (index, o = {}) => slides.push({ index, transition: 'fade', ...o, builds: o.builds || [] });

const NUCLEUS_ATOM = (name) => [`${name}_atom`];
const NUCLEUS_CENTRE = (name) => [`${name}_nucleus`];
const NUCLEUS_DOTS = (name) => {
  const kinds = ['p0', 'n1', 'p2', 'n3', 'p4', 'n5'];
  return kinds.map((k) => `${name}_${k}`);
};

/* 1. Title — no builds, it is the opening frame. */
S(1, {});

/* 2. Today — three goal cards, then the banner. */
{
  const groups = [], builds = [];
  for (let i = 0; i < 3; i++) {
    groups.push({ name: `g${i}`, members: [`g${i}_bg`, `g${i}_dot`, `g${i}_n`, `g${i}_t`] });
    builds.push(click(`g${i}`));
  }
  builds.push(click({ target: 'obj_banner', effect: 'zoom' }));
  S(2, { groups, builds });
}

/* 3. Do Now — five answers reveal one at a time. */
S(3, { builds: [0, 1, 2, 3, 4].map((i) => click({ target: `d${i}_a`, effect: 'wipe', dir: 'left' })) });

/* 4. Hook — three options reveal together, staggered. */
{
  const groups = [];
  for (let i = 0; i < 3; i++) groups.push({ name: `h${i}`, members: [`h${i}_bg`, `h${i}_k`, `h${i}_t`] });
  S(4, { groups, builds: [beat(['h0', 'h1', 'h2'])] });
}

/* 5. New Words — two word cards. */
{
  const groups = [], builds = [];
  for (let i = 0; i < 2; i++) {
    groups.push({ name: `w${i}`, members: [`w${i}_bg`, `w${i}_icon`, `w${i}_word`, `w${i}_say`, `w${i}_meaning`] });
    builds.push(click(`w${i}`));
  }
  S(5, { groups, builds });
}

/* 6. I Do — atom, nucleus, dots, then three explanatory cards. */
{
  const groups = [
    { name: 'ido_atom', members: NUCLEUS_ATOM('ido') },
    { name: 'ido_centre', members: NUCLEUS_CENTRE('ido') },
    { name: 'ido_dots', members: [...NUCLEUS_DOTS('ido'), 'ido_plabel', 'ido_nlabel'] },
  ];
  const builds = [click('ido_atom'), click('ido_centre'), click('ido_dots')];
  for (let i = 0; i < 3; i++) {
    groups.push({ name: `i${i}`, members: [`i${i}_bg`, `i${i}_n`, `i${i}_e`, `i${i}_t`] });
    builds.push(click(`i${i}`));
  }
  S(6, { groups, builds });
}

/* 7. We Do — build again, then the three call-and-response cards. */
{
  const groups = [
    { name: 'wedo_atom', members: NUCLEUS_ATOM('wedo') },
    { name: 'wedo_centre', members: NUCLEUS_CENTRE('wedo') },
    { name: 'wedo_dots', members: NUCLEUS_DOTS('wedo') },
  ];
  const builds = [click('wedo_atom'), click('wedo_centre'), click('wedo_dots')];
  for (let i = 0; i < 3; i++) {
    groups.push({ name: `wd${i}`, members: [`wd${i}_bg`, `wd${i}_q`, `wd${i}_a`] });
    builds.push(click(`wd${i}`));
  }
  S(7, { groups, builds });
}

/* 8. Activity — three step cards, then the routine note. */
{
  const groups = [], builds = [];
  for (let i = 0; i < 3; i++) {
    groups.push({ name: `a${i}`, members: [`a${i}_bg`, `a${i}_n`, `a${i}_h`, `a${i}_b`] });
    builds.push(click(`a${i}`));
  }
  builds.push(click('a_note'));
  S(8, { groups, builds });
}

/* 9. You Do — three worksheet-preview rows. */
{
  const groups = [], builds = [];
  for (let i = 0; i < 3; i++) {
    groups.push({ name: `y${i}`, members: [`y${i}_bg`, `y${i}_k`, `y${i}_h`, `y${i}_b`] });
    builds.push(click(`y${i}`));
  }
  S(9, { groups, builds });
}

/* 10. Plenary — four pointing prompts, then the sentence, then the close. */
{
  const groups = [], builds = [];
  for (let i = 0; i < 4; i++) {
    groups.push({ name: `p${i}`, members: [`p${i}_bg`, `p${i}_n`, `p${i}_t`] });
    builds.push(click(`p${i}`));
  }
  builds.push(click({ target: 'pl_sentence', effect: 'zoom' }));
  builds.push(click('pl_next'));
  S(10, { transition: { type: 'push', dir: 'up', speed: 'med' }, groups, builds });
}

fs.writeFileSync(path.join(__dirname, '..', 'spec', 'the-nucleus.anim.json'), JSON.stringify({
  deck: 'out/The Nucleus.pptx', output: 'out/The Nucleus.pptx',
  defaults: { transition: 'fade', dur: 400 }, slides,
}, null, 2));
console.log('spec:', slides.reduce((n, s) => n + s.builds.length, 0), 'click builds');
