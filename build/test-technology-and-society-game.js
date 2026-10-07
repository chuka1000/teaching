/**
 * Playwright test for the Technology And Society game (a scaffolded design task), at 1280x800 and
 * 390x844. Needs playwright (not in this repo: `npm i playwright && npx playwright install chromium`
 * somewhere else, and run with NODE_PATH pointing at it).
 *
 *   NODE_PATH=/path/to/node_modules node build/test-technology-and-society-game.js [shots-dir]
 *
 * It also dumps 300 generated games to /tmp for build/check-technology-and-society-game.py.
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const FILE = 'file://' + path.join(__dirname, '..', 'out', 'Technology And Society', 'Technology And Society game.html');
const SHOTS = process.argv[2];
const DUMP = process.env.DUMP || '/tmp/tas-games.json';
let pass = 0, fail = 0;
const ok = (c, what) => { if (c) pass++; else { fail++; console.log('FAIL:', what); } };

(async () => {
  const browser = await chromium.launch();

  /* ---- generation: 300 games, dumped for the checker ---- */
  {
    const page = await (await browser.newContext()).newPage();
    await page.goto(FILE);
    const games = await page.evaluate(() => {
      const out = {}; const seen = new Set();
      while (Object.keys(out).length < 300) { const c = window.__game.newCode(); if (!seen.has(c)) { seen.add(c); const g = window.__game.generate(c); out[c] = Object.assign({}, g, { disp: window.__game.display(g) }); } }
      return { games: out, data: window.__game.data() };
    });
    fs.writeFileSync(DUMP, JSON.stringify(games));
    const a = await page.evaluate(() => JSON.stringify(window.__game.generate('K7Q2M9')));
    const b = await page.evaluate(() => JSON.stringify(window.__game.generate('K7Q2M9')));
    const c = await page.evaluate(() => JSON.stringify(window.__game.generate('K7Q2M8')));
    ok(a === b, 'same code gives the same game'); ok(a !== c, 'a different code gives a different game'); ok(Object.keys(games.games).length === 300, '300 games generated');
    await page.close();
  }

  /* ---- two students; a teacher's #CODE reproduces one ---- */
  {
    const ctx = await browser.newContext();
    const p1 = await ctx.newPage(), p2 = await ctx.newPage(), p3 = await ctx.newPage();
    await p1.goto(FILE); await p2.goto(FILE);
    const c1 = await p1.evaluate(() => window.__game.code()), c2 = await p2.evaluate(() => window.__game.code());
    ok(c1 !== c2, `two students get different codes (${c1}, ${c2})`);
    await p3.goto(FILE + '#' + c1);
    ok(await p3.evaluate(() => window.__game.code()) === c1, 'teacher opens #CODE and gets that code');
    ok(await p3.evaluate(() => window.__game.display(window.__game.game())) === await p1.evaluate(() => window.__game.display(window.__game.game())), 'teacher sees exactly the first student\'s game');
    ok(await p3.locator('#code').innerText() === c1, 'start screen shows the code');
    await ctx.close();
  }

  for (const [name, vp] of [['desktop 1280x800', { width: 1280, height: 800 }], ['phone 390x844', { width: 390, height: 844 }]]) {
    const ctx = await browser.newContext({ viewport: vp, hasTouch: name.startsWith('phone'), isMobile: name.startsWith('phone') });
    const page = await ctx.newPage();
    const external = [], errors = [];
    page.on('request', (r) => { if (!r.url().startsWith('file:') && !r.url().startsWith('data:')) external.push(r.url()); });
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    const tag = (s) => `[${name}] ${s}`, short = name.split(' ')[0];
    const noOverflow = () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    const nextDisabled = () => page.evaluate(() => document.getElementById('next').disabled);
    const shot = async (n) => { if (SHOTS) await page.screenshot({ path: `${SHOTS}/${short}-${n}.png`, fullPage: true }); };
    const draw = async () => { const b = await page.locator('#sketch').boundingBox(); await page.mouse.move(b.x + b.width * 0.2, b.y + b.height * 0.3); await page.mouse.down(); await page.mouse.move(b.x + b.width * 0.6, b.y + b.height * 0.5, { steps: 6 }); await page.mouse.move(b.x + b.width * 0.4, b.y + b.height * 0.8, { steps: 6 }); await page.mouse.up(); };
    const fillSketchLabels = async () => { for (let i = 0; i < 3; i++) { await page.fill('#part' + i, 'Part ' + i + ' name'); await page.fill('#does' + i, 'It does job number ' + i); } await page.fill('#f_cwhy', 'It follows the rule because of the materials'); };
    const writeTest = async () => { await page.fill('#f_how', 'testing it three times on the same path'); await page.fill('#f_measure', 'the distance in metres'); await page.selectOption('#f_rep', '3'); await page.fill('#f_same', 'the person and the place'); await page.fill('#f_works', 'the mean is at least 5 m'); };
    const writeSoc = async () => { await page.fill('#f_benefit', 'a student with a sore back'); await page.fill('#f_harm', 'a shop that sells old bags'); await page.fill('#f_daily', 'people would walk more easily'); await page.fill('#f_improve', 'make it cheaper to buy'); };
    const advance = async (viaKey) => { ok(!(await nextDisabled()), tag('Next is enabled after answering')); ok(!(await page.evaluate(() => document.getElementById('next').classList.contains('hide'))), tag('Next is visible after answering')); if (viaKey) await page.keyboard.press('Enter'); else await page.click('#next', { timeout: 3000 }); };
    const answerQ = async (G, i, right) => { const Q = G.qs[i]; const k = right ? Q.correctIndex : Q.options.findIndex((o, j) => j !== Q.correctIndex); await page.keyboard.press(String(k + 1)); return { Q, k }; };

    await page.goto(FILE + '#TEST22');
    ok(await noOverflow(), tag('start: no horizontal overflow'));
    await shot('start');
    const G = await page.evaluate(() => window.__game.game());

    /* play 1: everything right, every step filled in */
    await page.click('#start');
    ok((await page.locator('#briefText').innerText()) === `${G.brief.user} needs a way to ${G.brief.need}.`, tag('the brief is shown'));
    ok((await page.locator('#ruleText').innerText()) === G.constraint.text, tag('the rule is shown'));
    ok(G.brief.allowed.includes(G.constraint.id), tag('the rule is one allowed for the brief'));
    ok(G.qs[0].options.length === 3 && G.qs[1].options.length === 4, tag('the problem question has three full statements and the fair-test question has four plans'));
    await shot('brief'); await page.click('#next');
    for (const [i, name2] of [[0, 'problem']]) {
      ok((await page.locator('#qcard').getAttribute('data-display')).includes(G.statement), tag('Q1 offers the problem statement'));
      await shot('q1'); const { Q } = await answerQ(G, i, true);
      ok(await page.locator('#feedback.right').count() === 1, tag(`Q1 correct feedback (${name2})`)); ok(await noOverflow(), tag('Q1 no overflow'));
      await advance(false);
    }
    ok(await nextDisabled(), tag('step 1 writing: Next is disabled until it is filled in'));
    ok(await page.inputValue('#f_who') === G.brief.user, tag('who is filled in from the brief')); ok(await page.evaluate(() => document.getElementById('f_who').readOnly), tag('who is read only'));
    await page.fill('#f_needs', 'carry books without back pain'); ok(await nextDisabled(), tag('one box is not enough'));
    await page.fill('#f_because', 'a heavy bag strains the back'); ok(!(await nextDisabled()), tag('Next enables when both boxes are filled'));
    await shot('problem'); await page.click('#next');
    ok(await nextDisabled(), tag('sketch: Next is disabled'));
    await draw(); ok(await nextDisabled(), tag('a drawing alone is not enough (labels and rule missing)'));
    await fillSketchLabels(); ok(!(await nextDisabled()), tag('Next enables with a drawing, three labels and the rule')); ok(await noOverflow(), tag('sketch: no overflow'));
    await shot('sketch'); await page.click('#next');
    await shot('q2'); await answerQ(G, 1, true); ok(await page.locator('#feedback.right').count() === 1, tag('Q2 (fair test) correct feedback')); await advance(true);
    ok(await nextDisabled(), tag('test plan: Next is disabled')); await writeTest(); ok(!(await nextDisabled()), tag('test plan: Next enables')); await shot('test'); await page.click('#next');
    for (const i of [2, 3, 4]) { await answerQ(G, i, true); ok(await page.locator('#feedback.right').count() === 1, tag(`Q${i + 1} (society) correct feedback`)); await advance(false); }
    ok(await nextDisabled(), tag('society check: Next is disabled')); await writeSoc(); ok(!(await nextDisabled()), tag('society check: Next enables')); await shot('society'); await page.click('#next');
    const cardText = await page.locator('#designcard').innerText();
    ok((await page.locator('.score').innerText()) === '5 of 5', tag('5 of 5'));
    ok(await page.locator('#cardimg').count() === 1, tag('the sketch is on the design card'));
    for (const s of ['carry books without back pain', 'a heavy bag strains the back', 'Part 1 name', 'It does job number 2', 'the person and the place', 'the mean is at least 5 m', 'a student with a sore back', 'make it cheaper to buy', G.code, G.constraint.text]) ok(cardText.includes(s), tag(`design card shows "${s}"`));
    ok(!cardText.includes('Not done'), tag('nothing marked Not done'));
    ok((await page.locator('body').innerText()).includes('No mistakes'), tag('no mistakes'));
    const det = page.locator('#review'); ok(await det.evaluate((d) => !d.open), tag('the review starts closed')); await det.locator('summary').click();
    ok(await det.locator('.rq').count() === 5 && await det.locator('.verdict.ok').count() === 5, tag('five questions, all correct, in the review'));
    ok((await det.locator('.meta').allInnerTexts()).every((m) => /^\d+ (s|min)/.test(m)), tag('every question shows how long it took'));
    await page.evaluate(() => { window.__printed = 0; window.print = () => { window.__printed++; }; }); await page.click('#print'); ok(await page.evaluate(() => window.__printed) === 1, tag('Print or save as PDF calls print'));
    ok(await noOverflow(), tag('card: no overflow')); await shot('card');

    /* play 2: every question wrong, the paper option instead of drawing */
    await page.click('#again'); await page.click('#start');
    const G2 = await page.evaluate(() => window.__game.game());
    await page.click('#next');
    const wrongs = new Set();
    {
      const { Q, k } = await answerQ(G2, 0, false); const fb = await page.locator('#feedback').innerText();
      ok(await page.locator('#feedback.wrong').count() === 1, tag('Q1 wrong feedback')); ok(fb.includes(Q.options[k].msg) && fb.includes(Q.why), tag('Q1 names the mistake and explains')); wrongs.add(Q.options[k].tag);
      await advance(false);
    }
    await page.fill('#f_needs', 'a way to cope'); await page.fill('#f_because', 'it is hard'); await page.click('#next');
    ok(await nextDisabled(), tag('paper path: Next disabled at first')); await page.check('#paper'); for (let i = 0; i < 3; i++) { await page.fill('#part' + i, 'P' + i + 'x'); await page.fill('#does' + i, 'does thing ' + i); } await page.fill('#f_cwhy', 'because it does');
    ok(!(await nextDisabled()), tag('ticking "sketched on paper" counts instead of drawing')); await page.click('#next');
    for (const i of [1, 2, 3, 4]) {
      if (i === 2) { await writeTest(); await page.click('#next'); }
      const { Q, k } = await answerQ(G2, i, false); const fb = await page.locator('#feedback').innerText();
      ok(await page.locator('#feedback.wrong').count() === 1, tag(`Q${i + 1} wrong feedback`)); ok(fb.includes(Q.options[k].msg), tag(`Q${i + 1} message: ${Q.options[k].msg}`)); wrongs.add(Q.options[k].tag);
      await advance(false);
    }
    await writeSoc(); await page.click('#next');
    ok((await page.locator('.score').innerText()) === '0 of 5', tag('0 of 5'));
    const t2 = await page.locator('body').innerText();
    ok(/Problem or solution\s+0 of 1/.test(t2) && /Fair tests\s+0 of 1/.test(t2) && /Technology and society\s+0 of 3/.test(t2), tag('the three categories: 1, 1, 3'));
    ok(t2.includes('Sketched on paper'), tag('the paper sketch is noted')); ok(wrongs.size >= 3, tag(`several kinds of mistake were named (${[...wrongs].join(', ')})`));
    await page.locator('#review summary').click();
    ok(await page.locator('#review .verdict.no').count() === 5 && (await page.locator('#review').innerText()).includes('You wrote') && (await page.locator('#review').innerText()).includes('Better'), tag('the review shows what was written and the better answer'));
    ok((await page.locator('body').innerText()).includes('Game code ' + G2.code), tag('final shows the code'));
    ok(await page.evaluate(() => window.__game.code()) !== 'TEST22', tag('Play again gave a new game'));

    /* play 3: stop at once, then part-way */
    await page.click('#again'); await page.click('#start'); await page.click('#stop');
    const t3 = await page.locator('body').innerText();
    ok((await page.locator('.score').innerText()) === '0 of 5' && t3.includes('You did not answer any questions') && t3.includes('Not done'), tag('stopping at once: 0 of 5, nothing answered, steps marked Not done'));
    await page.click('#again'); await page.click('#start'); const G4 = await page.evaluate(() => window.__game.game()); await page.click('#next'); await answerQ(G4, 0, true); await advance(false); await page.click('#stop');
    const t4 = await page.locator('body').innerText();
    ok((await page.locator('.score').innerText()) === '1 of 5' && t4.includes('1 of 5 questions answered') && /not reached/.test(t4), tag('stopped part-way: 1 of 5, and it says what was not reached'));
    ok(await noOverflow(), tag('stopped: no overflow'));

    const small = await page.evaluate(() => [...document.querySelectorAll('button')].filter((b) => { const r = b.getBoundingClientRect(); return r.width && (r.height < 44 || r.width < 44); }).length);
    ok(small === 0, tag('every button at least 44 px'));
    ok(await page.evaluate(() => localStorage.length + sessionStorage.length) === 0, tag('nothing stored'));
    ok(external.length === 0, tag('no external requests ' + external.join(',')));
    ok(errors.length === 0, tag('no console errors ' + errors.join(' | ')));
    await ctx.close();
  }
  await browser.close();
  console.log(`${pass} checks passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
