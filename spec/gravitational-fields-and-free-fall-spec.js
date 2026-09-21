/** Emits spec/gravitational-fields-and-free-fall.anim.json. Flat 150 ms. */
const fs = require('fs'); const path = require('path');
const STEP = 150;
const slides = [];
const click = (...steps) => ({ steps: steps.map((s) => (typeof s === 'string' ? { target: s, effect: 'fade' } : s)) });
const beat = (t, e = 'fade') => ({ steps: t.map((x, i) => (typeof x === 'string' ? { target: x, effect: e, delay: i * STEP } : { ...x, delay: i * STEP })) });
const S = (index, o = {}) => slides.push({ index, transition: 'fade', ...o, builds: o.builds || [] });

/* ============================== PERIOD 2 ============================== */

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

/* 4. I Do 1 — field diagram then three steps */
{
  const diagramMembers = ['fd1_ground', 'fd1_ground_lbl', 'fd1_fld0', 'fd1_fld1', 'fd1_fld2', 'fd1_fld3',
    'fd1_mass', 'fd1_mass_t', 'fd1_weight', 'fd1_weight_lbl'];
  const groups = [{ name: 'fd1_diagram', members: diagramMembers }];
  const builds = [click('fd1_diagram')];
  for (let i = 0; i < 3; i++) {
    groups.push({ name: `fw_${i}`, members: [`fw_${i}_bg`, `fw_${i}_n`, `fw_${i}_e`, `fw_${i}_t`] });
    builds.push(click(`fw_${i}`));
  }
  S(4, { groups, builds });
}

/* 5. I Do 2 — g is the field strength */
{
  const groups = [], builds = [];
  for (let i = 0; i < 4; i++) {
    groups.push({ name: `gf_${i}`, members: [`gf_${i}_bg`, `gf_${i}_n`, `gf_${i}_e`, `gf_${i}_t`] });
    builds.push(click(`gf_${i}`));
  }
  S(5, { groups, builds });
}

/* 6. We Do */
S(6, { builds: [0, 1, 2, 3].map((i) => click({ target: `wd${i}_a`, effect: 'zoom' })) });

/* 7. Cold Call */
S(7, { builds: [0, 1, 2, 3, 4, 5].map((i) => click({ target: `c${i}_a`, effect: 'wipe', dir: 'left' })) });

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

/* 9. Answers — Bronze + Silver */
{
  const groups = [], builds = [];
  for (let i = 0; i < 6; i++) groups.push({ name: `a${i}`, members: [`a${i}_bg`, `a${i}_n`, `a${i}_t`] });
  for (let i = 0; i < 6; i += 2) builds.push(beat([`a${i}`, `a${i + 1}`]));
  S(9, { groups, builds });
}

/* 10. Recap */
{
  const groups = [], builds = [];
  for (let i = 0; i < 3; i++) {
    groups.push({ name: `rc${i}`, members: [`rc${i}_bg`, `rc${i}_q`, `rc${i}_a`] });
    builds.push(click(`rc${i}`));
  }
  S(10, { groups, builds });
}

/* ============================== PERIOD 3 ============================== */

/* 11. Do Now */
S(11, { builds: [0, 1, 2, 3, 4, 5].map((i) => click({ target: `e${i}_a`, effect: 'wipe', dir: 'left' })) });

/* 12. Today */
{
  const groups = [], builds = [];
  for (let i = 0; i < 3; i++) {
    groups.push({ name: `p2o${i}`, members: [`p2o${i}_bg`, `p2o${i}_badge`, `p2o${i}_num`, `p2o${i}_t`] });
    builds.push(click(`p2o${i}`));
  }
  builds.push(click({ target: 'obj_banner2', effect: 'zoom' }));
  S(12, { groups, builds });
}

/* 13. Hook */
{
  const groups = [];
  for (let i = 0; i < 3; i++) groups.push({ name: `hk${i}`, members: [`hk${i}_bg`, `hk${i}_k`, `hk${i}_t`] });
  S(13, { groups, builds: [beat(['hk0', 'hk1', 'hk2'])] });
}

/* 14. I Do — g as acceleration */
{
  const groups = [], builds = [];
  for (let i = 0; i < 3; i++) {
    groups.push({ name: `ff_${i}`, members: [`ff_${i}_bg`, `ff_${i}_n`, `ff_${i}_e`, `ff_${i}_t`] });
    builds.push(click(`ff_${i}`));
  }
  S(14, { groups, builds });
}

/* 15. I Do — unit proof */
{
  const groups = [], builds = [];
  for (let i = 0; i < 4; i++) {
    groups.push({ name: `up_${i}`, members: [`up_${i}_bg`, `up_${i}_n`, `up_${i}_e`, `up_${i}_t`] });
    builds.push(click(`up_${i}`));
  }
  S(15, { groups, builds });
}

/* 16. We Do */
S(16, { builds: [0, 1, 2, 3].map((i) => click({ target: `we${i}_a`, effect: 'zoom' })) });

/* 17. Cold Call */
S(17, { builds: [0, 1, 2, 3, 4, 5].map((i) => click({ target: `cc${i}_a`, effect: 'wipe', dir: 'left' })) });

/* 18. You Do — Gold */
{
  const groups = [], builds = [];
  for (let i = 0; i < 4; i++) {
    groups.push({ name: `gd${i}`, members: [`gd${i}_bg`, `gd${i}_n`, `gd${i}_h`, `gd${i}_b`] });
    builds.push(click(`gd${i}`));
  }
  builds.push(click('yd_note2'));
  S(18, { groups, builds });
}

/* 19. Answers — Gold */
{
  const groups = [], builds = [];
  for (let i = 0; i < 4; i++) groups.push({ name: `ga${i}`, members: [`ga${i}_bg`, `ga${i}_n`, `ga${i}_t`] });
  for (let i = 0; i < 4; i += 2) builds.push(beat([`ga${i}`, `ga${i + 1}`]));
  S(19, { groups, builds });
}

/* 20. Plenary — true close of the double */
{
  const groups = [], builds = [];
  for (let i = 0; i < 5; i++) {
    groups.push({ name: `pl${i}_stmt`, members: [`pl${i}_bg`, `pl${i}_q`] });
    builds.push(click(`pl${i}_stmt`));
    builds.push(click({ target: `pl${i}_v`, effect: 'zoom' }));
  }
  builds.push(click('pl_next2'));
  S(20, { transition: { type: 'push', dir: 'up', speed: 'med' }, groups, builds });
}

fs.writeFileSync(path.join(__dirname, '..', 'spec', 'gravitational-fields-and-free-fall.anim.json'), JSON.stringify({
  deck: 'out/Gravitational Fields and Free Fall/Gravitational Fields and Free Fall.pptx',
  output: 'out/Gravitational Fields and Free Fall/Gravitational Fields and Free Fall.pptx',
  defaults: { transition: 'fade', dur: 400 }, slides,
}, null, 2));
console.log('spec:', slides.reduce((n, s) => n + s.builds.length, 0), 'click builds across', slides.length, 'slides');
