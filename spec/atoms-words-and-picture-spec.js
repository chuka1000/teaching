/** Emits spec/atoms-words-and-picture.anim.json. Flat 150 ms. */
const fs = require('fs'); const path = require('path');
const STEP = 150;
const slides = [];
const click = (...steps) => ({ steps: steps.map((s) => (typeof s === 'string' ? { target: s, effect: 'fade' } : s)) });
const beat = (t, e = 'fade') => ({ steps: t.map((x, i) => (typeof x === 'string' ? { target: x, effect: e, delay: i * STEP } : { ...x, delay: i * STEP })) });
const S = (index, o = {}) => slides.push({ index, transition: 'fade', ...o, builds: o.builds || [] });

/* 1. Title: nothing to click */
S(1);

/* 2. Today */
{
  const groups = [], builds = [];
  for (let i = 0; i < 3; i++) {
    groups.push({ name: `o${i}`, members: [`o${i}_bg`, `o${i}_num`, `o${i}_img`, `o${i}_t`] });
    builds.push(click(`o${i}`));
  }
  S(2, { groups, builds });
}

/* 3 and 4. Look and say: picture is there, the word arrives on the click */
const wordReveal = (n) => {
  const groups = [], builds = [];
  for (let i = 0; i < n; i++) {
    groups.push({ name: `wr${i}`, members: [`w${i}_word`, `w${i}_say`, `w${i}_mean`] });
    builds.push(click(`wr${i}`));
  }
  return { groups, builds };
};
S(3, wordReveal(4));
S(4, wordReveal(4));

/* 5. proton, neutron, then the nucleus / neutron / electron strip */
{
  const { groups, builds } = wordReveal(2);
  groups.push({ name: 'pair', members: ['pair_bg', 'pair_t'] });
  builds.push(click('pair'));
  S(5, { groups, builds });
}

/* 6. Matter, part, atom, then the sentence */
{
  const groups = [], builds = [];
  for (let i = 0; i < 3; i++) {
    const members = [`pm${i}_bg`, `pm${i}_img`, `pm${i}_word`, `pm${i}_mean`, `pm${i}_say`];
    if (i === 0) for (let j = 0; j < 4; j++) members.push(`pm0_s${j}`);
    groups.push({ name: `pm${i}`, members });
    builds.push(click(`pm${i}`));
  }
  builds.push(click({ target: 'pm_banner', effect: 'zoom' }));
  S(6, { groups, builds });
}

/* 7. Draw an atom: circle, centre, outside + electrons, sentence */
{
  const step = (i) => [`st${i}_bg`, `st${i}_n`, `st${i}_t`];
  const groups = [
    { name: 'd1', members: [...step(0), 'dr_ring'] },
    { name: 'd2', members: [...step(1), 'dr_centre', 'dr_centre_t'] },
    { name: 'd3', members: [...step(2), 'dr_outside_t', 'dr_e0', 'dr_e1', 'dr_e2', 'dr_e3'] },
  ];
  S(7, { groups, builds: [click('d1'), click('d2'), click('d3'), click({ target: 'dr_banner', effect: 'zoom' })] });
}

/* 8. Inside the nucleus */
{
  const groups = [
    { name: 'ip0', members: ['ip0_bg', 'ip0_dot', 'ip0_w', 'ip0_say'] },
    { name: 'ip1', members: ['ip1_bg', 'ip1_dot', 'ip1_w', 'ip1_say'] },
  ];
  S(8, { groups, builds: [click('ip0'), click('ip1'), click({ target: 'in_sentence', effect: 'zoom' })] });
}

/* 9. You say A: the frame, four pictures, the second sentence */
{
  const groups = [];
  const builds = [click({ target: 'fr_banner', effect: 'fade' })];
  for (let i = 0; i < 4; i++) {
    groups.push({ name: `ms${i}`, members: [`ms${i}_bg`, `ms${i}_img`, `ms${i}_t`, `ms${i}_bubble`] });
    builds.push(click(`ms${i}`));
  }
  builds.push(click({ target: 'fr2_banner', effect: 'zoom' }));
  S(9, { groups, builds });
}

/* 10. You say B: each gap word on a click */
S(10, { builds: [0, 1, 2].map((i) => click({ target: `sr${i}_a`, effect: 'zoom' })) });

/* 11. You do */
{
  const groups = [], builds = [];
  for (let i = 0; i < 3; i++) {
    groups.push({ name: `t${i}`, members: [`t${i}_bg`, `t${i}_img`, `t${i}_k`, `t${i}_h`, `t${i}_b`] });
    builds.push(click(`t${i}`));
  }
  builds.push(click({ target: 'yd_banner', effect: 'zoom' }));
  S(11, { groups, builds });
}

/* 12. Say it together: two pictures per click, each with its word and tick */
{
  const groups = [], builds = [];
  for (let i = 0; i < 10; i++) groups.push({ name: `tw${i}`, members: [`tl${i}_w`, `tl${i}_tick`] });
  for (let i = 0; i < 10; i += 2) builds.push(beat([`tw${i}`, `tw${i + 1}`]));
  S(12, { transition: { type: 'push', dir: 'up', speed: 'med' }, groups, builds });
}

fs.writeFileSync(path.join(__dirname, '..', 'spec', 'atoms-words-and-picture.anim.json'), JSON.stringify({
  deck: 'out/Atoms The Words And The Picture/Atoms The Words And The Picture.pptx',
  output: 'out/Atoms The Words And The Picture/Atoms The Words And The Picture.pptx',
  defaults: { transition: 'fade', dur: 400 }, slides,
}, null, 2));
console.log('spec:', slides.reduce((n, s) => n + s.builds.length, 0), 'click builds');
