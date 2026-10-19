/**
 * Playwright test for the "What Is It Made Of" sentence-builder game, at 1280x800 and 390x844.
 *
 *   node build/what-is-it-made-of-game.js
 *   NODE_PATH=/opt/node-tools/node_modules node build/test-what-is-it-made-of-game.js [shots-dir]
 *
 * Chromium is the one in PLAYWRIGHT_BROWSERS_PATH (/opt/pw-browsers here); nothing is installed.
 * Checks 300 generated games against the unit's own data (build/periodic-words.js, the answers modules), that games differ, then plays whole games
 * at both viewports: every answer right, every answer wrong (the review drop-downs read back), keyboard only, and the game code in the address.
 */
const fs = require('fs');
const path = require('path');
if (!process.env.PLAYWRIGHT_BROWSERS_PATH && fs.existsSync('/opt/pw-browsers')) process.env.PLAYWRIGHT_BROWSERS_PATH = '/opt/pw-browsers';
const { chromium } = require('playwright');
const W = require('./periodic-words');
const LIGHT = require('./does-it-light-up-answers');
const MADE = require('./what-is-it-made-of-answers');
const FILE = 'file://' + path.join(__dirname, '..', 'out', 'What Is It Made Of', 'What Is It Made Of game.html');
const SHOTS = process.argv[2];
let pass = 0, fail = 0;
const ok = (c, what) => { if (c) pass++; else { fail++; if (fail < 40) console.log('FAIL:', what); } };

const cap = (s) => s[0].toUpperCase() + s.slice(1);
const WORDS = ['element', 'symbol', 'metal', 'gas', 'non-metal', 'shiny', 'hard', 'soft', 'electricity', 'bulb', 'circuit', 'conduct', 'sort', 'full', 'recycle'];
const CONFUSE = {
  element: ['symbol'], symbol: ['element'], metal: ['non-metal'], 'non-metal': ['metal'], gas: ['full', 'non-metal'], shiny: ['hard'], hard: ['soft', 'shiny'], soft: ['hard'],
  electricity: ['bulb', 'circuit'], bulb: ['circuit', 'electricity'], circuit: ['conduct', 'bulb'], conduct: ['circuit', 'electricity'], sort: ['full', 'recycle'], full: ['sort', 'gas'], recycle: ['sort'],
};
const TODAY = ['sort', 'full', 'recycle'];
const sym = (k) => W.symbolOf(k);
const el = (k) => W.EL[sym(k)];
const SAMPLE4 = ['copper', 'carbon', 'sulfur', 'silicon'];

/* --------- invariants for one generated game, recomputed from the unit's own data --------- */
function checkGame(qs, code) {
  const w = (s) => `${code}: ${s}`;
  ok(qs.length === 18, w('18 questions'));
  const r1 = qs.slice(0, 6), r2 = qs.slice(6, 12), r3 = qs.slice(12, 18);
  ok(r1.every((q) => q.round === 1) && r2.every((q) => q.round === 2) && r3.every((q) => q.round === 3), w('rounds'));
  ok(qs.every((q, i) => q.n === i + 1), w('numbering'));
  // Round 1: yes/no first, then either/or; the two hard words in every game; one word from the double, three from earlier
  ok(r1[0].type === 'yn' && r1[1].type === 'yn' && r1.slice(2).every((q) => q.type === 'eo'), w('R1 order: yes/no, then either/or'));
  const t1 = r1.map((q) => q.word);
  ok(t1.includes('conduct') && t1.includes('non-metal') && new Set(t1).size === 6, w('R1 has the two hard words and six different words'));
  ok(t1.filter((x) => TODAY.includes(x)).length === 1, w('R1 has exactly one word from the double'));
  r1.forEach((q) => {
    ok(WORDS.includes(q.word), w('R1 word is taught'));
    if (q.type === 'yn') { ok(WORDS.includes(q.shown) && (q.truth === (q.shown === q.word)), w('yes/no truth matches')); ok(q.truth || CONFUSE[q.word].includes(q.shown), w('yes/no wrong word is confusable')); }
    else { ok(q.options.length === 2 && q.options.includes(q.word) && new Set(q.options).size === 2, w('either/or has the answer once')); ok(q.options.every((o) => WORDS.includes(o)), w('either/or options taught')); ok(q.options.filter((o) => o !== q.word).every((o) => CONFUSE[q.word].includes(o)), w('either/or wrong word is confusable')); }
  });
  ok(r1[0].truth !== r1[1].truth, w('one yes and one no'));
  // Round 2: three metal or non-metal (silicon always), then three conducts or not (sulfur and the pencil always)
  ok(r2.slice(0, 3).every((q) => q.type === 'cls') && r2.slice(3).every((q) => q.type === 'cond'), w('R2 types'));
  const cs = r2.slice(0, 3).map((q) => q.sample);
  ok(cs.includes('silicon') && new Set(cs).size === 3, w('R2 class: silicon in, three different'));
  r2.slice(0, 3).forEach((q) => {
    ok(q.truth === el(q.sample).cls, w(`R2 ${q.sample} class from the table`));
    ok(q.options.length === 2 && q.options.includes('metal') && q.options.includes('non-metal'), w('R2 options'));
  });
  ok(cs.some((k) => el(k).cls === 'metal') && cs.some((k) => el(k).cls === 'non-metal'), w('R2 class: at least one of each'));
  const cd = r2.slice(3).map((q) => q.item);
  ok(cd.includes('sulfur') && cd.includes('pencil') && new Set(cd).size === 3, w('R2 conduct: sulfur and pencil in, three different'));
  r2.slice(3).forEach((q) => {
    const yes = `${cap(LIGHT.element(q.item))} conducts electricity.`, no = `${cap(LIGHT.element(q.item))} does not conduct electricity.`;
    ok(q.truth === (LIGHT.conducts(q.item) ? yes : no) && q.options.includes(yes) && q.options.includes(no) && q.options.length === 2, w(`R2 ${q.item} sentence`));
  });
  // Round 3: made of x2, full of, a sample, conducts, a three-gap sample
  ok(r3.map((q) => q.id).join() === 'madeof1,madeof2,fullof,sample2,conducts,sample3', w('R3 order'));
  ok(r3.every((q) => q.type === 'build'), w('R3 build'));
  const [m1, m2, f, s2, cd2, s3] = r3;
  [m1, m2].forEach((q) => {
    const k = q.pics[0];
    ok(['nail', 'ring', 'wire', 'pan'].includes(k) && q.gaps[0][0] === MADE.objName(k) && q.gaps[1][0] === MADE.element(k), w(`R3 ${q.id} from the answers module`));
  });
  ok(MADE.element(m1.pics[0]) !== MADE.element(m2.pics[0]), w('the two made-of sentences use different elements'));
  ok(['tank', 'balloons'].includes(f.pics[0]) && f.gaps[0][0] === MADE.objName(f.pics[0]) && f.gaps[1][0] === MADE.element(f.pics[0]) && f.full.includes('is full of'), w('R3 full of'));
  ok(SAMPLE4.includes(s2.pics[0]) && s2.gaps[0][0] === el(s2.pics[0]).name && s2.gaps[1][0] === el(s2.pics[0]).cls, w('R3 sample2'));
  ok(SAMPLE4.includes(s3.pics[0]) && s3.pics[0] !== s2.pics[0] && s3.gaps[0][0] === el(s3.pics[0]).name && s3.gaps[1][0] === el(s3.pics[0]).cls && s3.gaps[2][0] === el(s3.pics[0]).look, w('R3 sample3'));
  const on = cd2.pics[0] === 'circuit_on';
  ok((cd2.gaps[0][0] === 'conducts') === on && cd2.full === `${on ? 'Copper conducts' : 'Sulfur does not conduct'} electricity.`, w('R3 conducts matches its picture'));
  r3.forEach((q) => {
    const need = q.gaps.flat();
    ok(need.every((n) => q.tiles.includes(n)), w(`R3 ${q.id} tiles contain the answers`));
    ok(new Set(q.tiles).size === q.tiles.length && q.tiles.length >= need.length + 2 && q.tiles.length <= 7, w(`R3 ${q.id} tiles unique, with distractors`));
    const built = q.segs.map((s) => (typeof s === 'string' ? s : q.gaps[s.gap][0])).join('');
    ok(built === q.full, w(`R3 ${q.id} sentence reads right: ${built} / ${q.full}`));
  });
  // nothing is an em dash
  ok(!JSON.stringify(qs).includes('—'), w('no em dash in the game text'));
}

/* --------- helpers to play --------- */
const exact = (t) => new RegExp('^' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$');
async function answerRight(page, q) {
  if (q.type === 'yn') await page.locator(`.yn .choice[data-k="${q.truth ? 'yes' : 'no'}"]`).click();
  else if (q.type === 'eo') await page.locator('.choices .choice', { hasText: exact(q.word) }).click();
  else if (q.type === 'cls' || q.type === 'cond') await page.locator('.choices .choice', { hasText: exact(q.truth) }).click();
  else {
    for (const g of q.gaps) await page.locator(`.tile[data-t="${g[0]}"]`).click();
    await page.locator('#check').click();
  }
}
async function answerWrong(page, q) {
  if (q.type === 'yn') await page.locator(`.yn .choice[data-k="${q.truth ? 'no' : 'yes'}"]`).click();
  else if (q.type === 'eo') await page.locator('.choices .choice').filter({ hasNotText: exact(q.word) }).first().click();
  else if (q.type === 'cls') await page.locator('.choices .choice').filter({ hasNotText: exact(q.truth) }).first().click();
  else if (q.type === 'cond') { const t = q.options.find((o) => o !== q.truth); await page.locator('.choices .choice', { hasText: exact(t) }).click(); }
  else {
    const used = new Set();
    for (let i = 0; i < q.gaps.length; i++) {
      const pickT = q.tiles.find((t) => !q.gaps[i].includes(t) && !used.has(t)) || q.tiles.find((t) => !used.has(t));
      used.add(pickT); await page.locator(`.tile[data-t="${pickT}"]`).click();
    }
    await page.locator('#check').click();
  }
}
async function playGame(page, mode) {
  const qs = await page.evaluate(() => window.__game.questions());
  await page.locator('#start').click();
  const feedbacks = [];
  for (let i = 0; i < 18; i++) {
    const q = qs[i];
    ok(await page.locator('.pill').textContent().then((t) => t.includes(`Round ${q.round}`)), `pill shows round ${q.round}`);
    ok(await page.locator('img.pic').first().evaluate((im) => im.complete && im.naturalWidth > 0), `Q${i + 1} picture loads`);
    if (mode === 'right') await answerRight(page, q); else await answerWrong(page, q);
    const cls = await page.locator('#feedback').getAttribute('class');
    ok(cls === (mode === 'right' ? 'right' : 'wrong'), `Q${i + 1} ${mode}: feedback ${cls}`);
    const text = await page.locator('#feedback').innerText();
    feedbacks.push(text.replace(/\s+/g, ' '));
    ok(await page.locator('#next').isVisible(), `Q${i + 1} next shown`);
    await page.locator('#next').click();
    if (i % 6 === 5) {
      const h = await page.locator('h2').first().textContent();
      ok(h.includes(`Round ${q.round} done`), 'round screen');
      const det = page.locator('details.rev');
      ok(await det.count() === 1, 'round review present');
      ok(await det.evaluate((d) => !d.open), 'review starts closed');
      await det.locator('summary').click();
      const items = await det.locator('li').allInnerTexts();
      ok(items.length === 6, 'six review lines');
      ok(items.every((t) => t.includes(mode === 'right' ? 'Right' : 'Wrong') && /\d+ s|min/.test(t)), 'review lines say right or wrong, with a time');
      if (mode === 'wrong') ok(items.every((t) => t.includes('You chose:') && t.includes('Right answer:')), 'wrong lines show what was chosen and the right answer');
      ok((await page.locator('.small').allInnerTexts()).some((t) => t.includes('does not count')), 'time does not count');
      await page.locator('#roundnext').click();
    }
  }
  ok((await page.locator('.score').first().textContent()).trim() === (mode === 'right' ? '18 of 18' : '0 of 18'), `final score ${mode}`);
  ok(await page.locator('details.rev').count() === 3, 'three review drop-downs on the last screen');
  const lines = await page.locator('details.rev li').allInnerTexts();
  ok(lines.length === 18, '18 review lines in all');
  return { qs, feedbacks, final: await page.locator('#app').innerText() };
}

(async () => {
  const browser = await chromium.launch();
  const ctx0 = await browser.newContext();
  const page0 = await ctx0.newPage();
  const errors = [];
  page0.on('pageerror', (e) => errors.push(String(e))); page0.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page0.goto(FILE);

  /* generation: 300 games */
  const games = await page0.evaluate(() => { const g = []; for (let i = 0; i < 300; i++) { const c = window.__game.newCode(); g.push([c, window.__game.generate(c)]); } return g; });
  games.forEach(([c, qs]) => checkGame(qs, c));
  const distinct = new Set(games.map(([, qs]) => JSON.stringify(qs.map((q) => [q.type, q.word, q.shown, q.sample, q.item, q.pics, q.tiles])))).size;
  ok(distinct >= 290, `300 games are different from each other (${distinct} distinct)`);
  // the same code gives the same game
  const a = await page0.evaluate(() => JSON.stringify(window.__game.generate('ABC234'))), b = await page0.evaluate(() => JSON.stringify(window.__game.generate('ABC234')));
  ok(a === b, 'a code is repeatable');

  const wrongFeedback = {};
  for (const vp of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
    const tag = `${vp.width}`;
    for (const mode of ['right', 'wrong']) {
      const ctx = await browser.newContext({ viewport: vp });
      const page = await ctx.newPage();
      page.on('pageerror', (e) => errors.push(String(e))); page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
      await page.goto(FILE);
      const r = await playGame(page, mode);
      ok(!r.final.includes('—'), 'no em dash on the last screen');
      if (mode === 'wrong') { wrongFeedback[tag] = r.feedbacks; ok(r.final.includes('Say these words again') && r.final.includes('Look again'), 'wrong game: words and habits listed'); }
      else ok(r.final.includes('Every word was right'), 'right game: every word right');
      // no horizontal scroll on a phone
      ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `${tag} ${mode}: no sideways scroll`);
      if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); await page.screenshot({ path: path.join(SHOTS, `final-${tag}-${mode}.png`), fullPage: true }); }
      await ctx.close();
    }
  }
  // every kind of question gave its own feedback text when wrong
  const fb = wrongFeedback['1280'];
  ok(fb.some((t) => t.includes('Say it out loud')) && fb.some((t) => t.includes('Gesture')), 'wrong feedback names the gesture and says say it out loud');

  /* a game opened with its code on the end of the address is that game */
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    await page.goto(FILE + '#QX7K2M');
    ok((await page.locator('#code').textContent()) === 'QX7K2M', 'the code from the address is used');
    const q1 = await page.evaluate(() => JSON.stringify(window.__game.questions()));
    ok(q1 === await page.evaluate(() => JSON.stringify(window.__game.generate('QX7K2M'))), 'and it is the same game');
    await page.goto(FILE + '#bad');
    ok((await page.locator('#code').textContent()).length === 6, 'a bad code is ignored');
    /* keyboard only: Start with Enter, then the keys */
    await page.keyboard.press('Enter');
    const qs = await page.evaluate(() => window.__game.questions());
    for (let i = 0; i < 18; i++) {
      const q = qs[i];
      if (q.type === 'yn') await page.keyboard.press(q.truth ? 'y' : 'n');
      else if (q.type === 'eo') await page.keyboard.press(String(q.options.indexOf(q.word) + 1));
      else if (q.type === 'cls') await page.keyboard.press(String(q.options.indexOf(q.truth) + 1));
      else if (q.type === 'cond') await page.keyboard.press(String(q.options.indexOf(q.truth) + 1));
      else {
        for (const g of q.gaps) await page.keyboard.press(String(q.tiles.indexOf(g[0]) + 1));
        await page.keyboard.press('Enter');
      }
      await page.keyboard.press('Enter');
      if (i % 6 === 5) await page.locator('#roundnext').click();
    }
    ok((await page.locator('.score').first().textContent()).trim() === '18 of 18', 'keyboard only: 18 of 18');
    await ctx.close();
  }
  ok(errors.length === 0, 'no page errors: ' + errors.join('; '));
  await browser.close();
  console.log(`${pass} checks passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
