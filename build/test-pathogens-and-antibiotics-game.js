/**
 * Playwright test for the True or false blitz (Pathogens And Antibiotics), at 1280x800 and 390x844.
 *
 *   python3 build/pathogens-and-antibiotics-game.py
 *   NODE_PATH=/path/to/node_modules node build/test-pathogens-and-antibiotics-game.js [shots-dir]
 *   python3 build/check-pathogens-and-antibiotics-game.py /tmp/pathogens-and-antibiotics-games.json
 *
 * The Chromium comes from PLAYWRIGHT_BROWSERS_PATH (nothing is installed). It also dumps 300 generated games for the checker. Three plays per
 * viewport: all right (answered by click or tap, by the letters T and F, and by the digits 1 and 2, then Next by click and by Enter), all wrong
 * (every drop-down read back, every slip counted) and the edge cases (stopping part-way, stopping at once, the stopwatch, keys that do nothing).
 */
const { chromium } = require('playwright');
const fs = require('fs');
const os = require('os');
const path = require('path');
const FILE = 'file://' + path.join(__dirname, '..', 'out', 'Pathogens And Antibiotics', 'Pathogens And Antibiotics game.html');
const SHOTS = process.argv[2];
if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
const DUMP = process.env.DUMP || path.join(os.tmpdir(), 'pathogens-and-antibiotics-games.json');
const BANK = JSON.parse(fs.readFileSync(path.join(__dirname, 'pathogens-and-antibiotics.bank.json'), 'utf8'));
const SLOT = {}; BANK.rounds.forEach((rd) => rd.slots.forEach((s) => { SLOT[s.id] = s; }));
const SIZES = BANK.draw, STARTS = [0, SIZES[0], SIZES[0] + SIZES[1]];
const partner = (Q) => SLOT[Q.slot][Q.truth ? 'false' : 'true'];
const W = (v) => (v ? 'TRUE' : 'FALSE');
let pass = 0, fail = 0;
const ok = (c, what) => { if (c) pass++; else { fail++; console.log('FAIL:', what); } };

(async () => {
  const browser = await chromium.launch();

  /* ---- generation: 300 games, dumped for the checker ---- */
  {
    const page = await (await browser.newContext()).newPage();
    const errs = []; page.on('pageerror', (e) => errs.push(String(e)));
    await page.goto(FILE);
    ok(errs.length === 0, 'the page loads with no error ' + errs.join(' | '));
    const games = await page.evaluate(() => {
      const out = {}; const seen = new Set();
      while (Object.keys(out).length < 300) { const c = window.__game.newCode(); if (!seen.has(c)) { seen.add(c); out[c] = JSON.parse(JSON.stringify(window.__game.generate(c))); } }
      return out;
    });
    fs.writeFileSync(DUMP, JSON.stringify(games));
    const a = await page.evaluate(() => JSON.stringify(window.__game.generate('K7Q2M9')));
    const b = await page.evaluate(() => JSON.stringify(window.__game.generate('K7Q2M9')));
    const c = await page.evaluate(() => JSON.stringify(window.__game.generate('K7Q2M8')));
    const CONF = BANK.conflicts || [];
    ok(CONF.length > 0 && JSON.stringify(await page.evaluate(() => window.__game.data.conflicts)) === JSON.stringify(CONF), 'the game holds the bank\'s conflicts');
    const clashes = Object.values(games).filter((qs) => { const ids = new Set(qs.map((q) => q.slot)); return CONF.some(([x, y]) => ids.has(x) && ids.has(y)); }).length;
    ok(clashes === 0, `no game draws both slots of a conflicting pair (${clashes} of 300 do)`);
    ok(a === b, 'same code gives the same game'); ok(a !== c, 'a different code gives a different game'); ok(Object.keys(games).length === 300, '300 games generated');
    const html = fs.readFileSync(FILE.replace('file://', ''), 'utf8');
    ok(!html.includes('/*DATA*/null/*END*/'), 'the statements were written into the game');
    ok(JSON.stringify(await page.evaluate(() => window.__game.data.draw)) === JSON.stringify([7, 7, 6]), 'the game holds the bank (draw 7, 7, 6)');
    await page.close();
  }

  /* ---- two students: different games; a teacher's #CODE reproduces one ---- */
  {
    const ctx = await browser.newContext();
    const p1 = await ctx.newPage(), p2 = await ctx.newPage(), p3 = await ctx.newPage(), p4 = await ctx.newPage();
    await p1.goto(FILE); await p2.goto(FILE);
    const code1 = await p1.evaluate(() => window.__game.code()), code2 = await p2.evaluate(() => window.__game.code());
    ok(code1 !== code2, `two students get different codes (${code1}, ${code2})`);
    ok(/^[A-HJ-NP-Z2-9]{6}$/.test(code1), 'the code is six characters');
    const q1 = await p1.evaluate(() => JSON.stringify(window.__game.questions())), q2 = await p2.evaluate(() => JSON.stringify(window.__game.questions()));
    ok(q1 !== q2, 'two students get different statements');
    await p3.goto(FILE + '#' + code1);
    ok(await p3.evaluate(() => window.__game.code()) === code1, 'teacher opens #CODE and gets that code');
    ok(await p3.evaluate(() => JSON.stringify(window.__game.questions())) === q1, 'teacher sees exactly the first student\'s statements');
    ok(await p3.locator('#code').innerText() === code1, 'start screen shows the code');
    await p3.click('#start');
    ok(await p3.locator('#stmt').innerText() === JSON.parse(q1)[0].text, 'the first statement on screen is the first of that game');
    await p4.goto(FILE + '#' + code1.toLowerCase());
    ok(await p4.evaluate(() => JSON.stringify(window.__game.questions())) === q1, 'a lower-case #code gives the same game');
    await ctx.close();
  }

  for (const [name, vp] of [['desktop 1280x800', { width: 1280, height: 800 }], ['phone 390x844', { width: 390, height: 844 }]]) {
    const phone = name.startsWith('phone');
    const ctx = await browser.newContext({ viewport: vp, hasTouch: phone, isMobile: phone });
    const page = await ctx.newPage();
    const external = [], errors = [];
    page.on('request', (r) => { if (!r.url().startsWith('file:') && !r.url().startsWith('data:')) external.push(r.url()); });
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    const tag = (s) => `[${name}] ${s}`;
    const short = name.split(' ')[0];
    const shot = async (n, full) => { if (SHOTS) await page.screenshot({ path: `${SHOTS}/${short}-${n}.png`, fullPage: !!full }); };
    const noOverflow = () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    const bodyText = () => page.locator('body').innerText();
    const small = () => page.evaluate(() => [...document.querySelectorAll('button, summary')].filter((b) => { const r = b.getBoundingClientRect(); return r.width && (r.height < 44 || r.width < 44); }).map((b) => b.id || b.textContent.slice(0, 24)));
    const getQs = () => page.evaluate(() => JSON.parse(JSON.stringify(window.__game.questions())));
    const getResults = () => page.evaluate(() => JSON.parse(JSON.stringify(window.__game.results())));
    const press = async (k) => { await page.keyboard.press(k); };
    let tallest = 0;

    /* the start screen */
    await page.goto(FILE + '#TEST22');
    ok(await noOverflow(), tag('start: no horizontal overflow'));
    let t = await bodyText();
    ok(t.includes('True Or False Blitz') && t.toLowerCase().includes('pathogens and antibiotics'), tag('start: the title'));
    ok(/meant to be too hard/.test(t) && /Round 3/.test(t), tag('start: says round 3 is meant to be too hard'));
    ok(/The time does not count for anything/.test(t) && /stopwatch/.test(t), tag('start: says the stopwatch time does not count for anything'));
    ok(/Stop and see my results/.test(t), tag('start: says the Stop button exists'));
    const explain = await page.locator('#explain').innerText();
    ok(explain.split(/(?<=[.!?])\s+/).length === 2 && /TRUE/.test(explain) && /FALSE/.test(explain), tag('start: the game is explained in two sentences'));
    ok(await page.locator('#code').innerText() === 'TEST22' && t.includes('Game code TEST22'), tag('start: shows the game code'));
    const Q0s = await getQs();
    ok(Q0s.every((Q) => !t.includes(Q.text) && !t.includes(partner(Q))), tag('start: no statement is on the start screen'));
    ok(!t.includes('—'), tag('start: no em dash'));
    ok((await small()).length === 0, tag(`start: every button at least 44 px (${await small()})`));
    ok(await page.evaluate(() => document.activeElement && document.activeElement.id) === 'start', tag('start: the Start button has the focus'));
    await shot('start', true);

    /* the checks a statement screen has to pass */
    const checkStatement = async (i, Q, answered) => {
      const W_ = tag(`S${i + 1} (${Q.slot})`);
      ok((await page.locator('#stmt').innerText()) === Q.text && (await page.locator('#qcard').getAttribute('data-display')) === Q.text, `${W_}: shows the statement`);
      const body = await bodyText();
      ok(!body.includes(partner(Q)), `${W_}: the other version of the slot is not on the screen`);
      ok(!body.includes(Q.why) && !body.includes(Q.mistake), `${W_}: the why and the slip are not on the screen before the answer`);
      ok((await page.locator('.prog').innerText()) === `Statement ${i + 1} of 20 · Round ${Q.round} of 3`, `${W_}: progress text`);
      ok(await page.locator('.dot').count() === 20 && await page.locator('.dot.right, .dot.wrong').count() === answered && await page.locator('.dot.now').count() === 1, `${W_}: twenty dots, ${answered} marked, one current`);
      ok(JSON.stringify(await page.locator('.tf .lbl').allInnerTexts()) === '["TRUE","FALSE"]', `${W_}: two big buttons, TRUE and FALSE`);
      ok(/^\d+:\d\d$/.test(await page.locator('#clock').innerText()) && (await page.locator('.watch').innerText()).includes('The time does not count'), `${W_}: a stopwatch that says the time does not count`);
      ok((await page.locator('.pill').innerText()).toLowerCase() === BANK.rounds[Q.round - 1].name.toLowerCase(), `${W_}: the round name`);
      ok(await page.locator('#stop').count() === 1 && (await page.locator('#stop').innerText()) === 'Stop and see my results', `${W_}: the Stop button`);
      ok(await page.locator('#feedback.right, #feedback.wrong').count() === 0 && await page.locator('#nextbtn:not(.hide)').count() === 0, `${W_}: no feedback before the answer`);
      ok(await noOverflow(), `${W_}: no horizontal overflow`);
      ok(!body.includes('—'), `${W_}: no em dash`);
      if (phone) { const bad = await small(); ok(bad.length === 0, `${W_}: tap targets at least 44 px (${bad})`); }
    };
    const checkFeedback = async (i, Q, said) => {
      const W_ = tag(`S${i + 1} (${Q.slot})`), right = said === Q.truth;
      const txt = await page.locator('#feedback').innerText();
      ok(await page.locator(right ? '#feedback.right' : '#feedback.wrong').count() === 1, `${W_}: ${right ? 'right (green)' : 'wrong (red)'} feedback`);
      ok(txt.startsWith(right ? `Right. The statement is ${W(Q.truth)}.` : `Not quite. You said ${W(said)}, but the statement is ${W(Q.truth)}.`), `${W_}: the headline "${txt.split('\n')[0]}"`);
      ok(txt.includes('Why: ' + Q.why), `${W_}: the why is shown`);
      ok(right ? !txt.includes('A common slip') : txt.includes('A common slip: ' + Q.mistake), `${W_}: ${right ? 'no slip on a right answer' : 'the common slip is shown'}`);
      ok(await page.locator('.tf.correct').count() === 1 && await page.locator('.tf.correct').getAttribute('data-v') === String(Q.truth), `${W_}: the right button is marked`);
      ok(right ? await page.locator('.tf.picked').count() === 0 : (await page.locator('.tf.picked').count() === 1 && await page.locator('.tf.picked').getAttribute('data-v') === String(said)), `${W_}: the wrong button is marked only when wrong`);
      ok(await page.locator('.tf:not([disabled])').count() === 0, `${W_}: the answer buttons are locked`);
      const label = Q.k === SIZES[Q.round - 1] ? (Q.round === 3 ? 'See results' : 'Finish round') : 'Next';
      ok((await page.locator('#nextbtn').innerText()) === label, `${W_}: the Next button reads "${label}"`);
      const res = await getResults();
      ok(res.length === i + 1 && res[i].ok === right && res[i].said === said && res[i].truth === Q.truth && res[i].secs >= 1, `${W_}: the result is stored once`);
      ok(await page.locator('.dot').nth(i).evaluate((d, r) => d.classList.contains(r ? 'right' : 'wrong'), right), `${W_}: its dot is ${right ? 'green' : 'red'}`);
      for (const k of ['T', 'f', '1', '2', 'F', 't']) await press(k);
      const res2 = await getResults();
      ok(res2.length === i + 1 && JSON.stringify(res2[i]) === JSON.stringify(res[i]), `${W_}: pressing more keys does not change the answer`);
      const body = await bodyText();
      ok(!body.includes(partner(Q)), `${W_}: the feedback does not show the other version`);
      ok(!body.includes('—'), `${W_}: no em dash in the feedback`);
      const fb = await page.locator('#feedback').boundingBox(), nx = await page.locator('#nextbtn').boundingBox();
      ok(fb.y >= 0 && nx.y + nx.height <= vp.height + 1, `${W_}: the feedback and the Next button are both on screen (${Math.round(fb.y)}, ${Math.round(nx.y + nx.height)} of ${vp.height})`);
      tallest = Math.max(tallest, await page.evaluate(() => document.documentElement.scrollHeight));
      ok(await noOverflow(), `${W_}: no overflow after the answer`);
      if (phone) { const bad = await small(); ok(bad.length === 0, `${W_}: tap targets after the answer (${bad})`); }
    };
    const answerBy = async (method, said) => {
      const sel = said ? '#btn-true' : '#btn-false';
      if (method === 'click') { if (phone) await page.locator(sel).tap(); else await page.click(sel); }
      else if (method === 'letter') await press(said ? 'T' : 'F');
      else if (method === 'digit') await press(said ? '1' : '2');
      else await press(said ? 't' : 'f');
    };
    const METHODS = ['click', 'letter', 'digit', 'lower'];

    /* the checks a round-end or final drop-down has to pass */
    const checkReview = async (det, r, Qs, resultOf, label) => {
      const cnt = SIZES[r];
      ok(await det.locator('.rq').count() === cnt, tag(`${label}: ${cnt} statements in the drop-down`));
      const metas = await det.locator('.rq .meta').allInnerTexts();
      for (let k = 0; k < cnt; k++) {
        const Q = Qs[STARTS[r] + k], x = resultOf(STARTS[r] + k), item = det.locator(`.rq[data-q="${STARTS[r] + k + 1}"]`), it = await item.innerText();
        ok(it.includes(Q.text) && !it.includes(partner(Q)), tag(`${label} #${STARTS[r] + k + 1}: the statement, and not its pair`));
        if (!x) { ok(it.includes('Not reached') && !it.includes('You answered') && !it.includes('correct answer') && !it.includes(Q.why) && await item.locator('.verdict.na').count() === 1, tag(`${label} #${STARTS[r] + k + 1}: Not reached`)); continue; }
        ok(await item.locator(x.ok ? '.verdict.ok' : '.verdict.no').count() === 1 && it.includes(x.ok ? 'Right' : 'Wrong'), tag(`${label} #${STARTS[r] + k + 1}: ${x.ok ? 'Right' : 'Wrong'}`));
        ok(it.includes(`You answered ${W(x.said)}. The correct answer is ${W(Q.truth)}.`), tag(`${label} #${STARTS[r] + k + 1}: what was answered and the correct answer`));
        ok(/^\d+ s$/.test(await item.locator('.meta').innerText()), tag(`${label} #${STARTS[r] + k + 1}: the time taken in seconds`));
        if (x.ok) ok(!it.includes('Why:') && !it.includes('A common slip'), tag(`${label} #${STARTS[r] + k + 1}: a right answer has no why or slip`));
        else ok(it.includes('Why: ' + Q.why) && it.includes('A common slip: ' + Q.mistake), tag(`${label} #${STARTS[r] + k + 1}: a wrong answer has the why and the slip`));
      }
      return metas;
    };
    const countsOf = (Qs, results) => { const c = {}; results.forEach((x, i) => { if (x && !x.ok) c[Qs[i].mistake] = (c[Qs[i].mistake] || 0) + 1; }); return c; };

    /* ============ play 1: all right ============ */
    await page.click('#start');
    let Qs = await getQs();
    ok(Qs.length === 20 && Qs.filter((q) => q.truth).length === 10, tag('TEST22: 20 statements, 10 true'));
    for (let r = 0; r < 3; r++) {
      for (let k = 0; k < SIZES[r]; k++) {
        const i = STARTS[r] + k, Q = Qs[i];
        await checkStatement(i, Q, i);
        if (k === 0) ok(/^0:0\d$/.test(await page.locator('#clock').innerText()), tag(`round ${r + 1}: the stopwatch starts again from 0:0x (${await page.locator('#clock').innerText()})`));
        if (i === 3) { await press('Enter'); ok((await getResults()).length === 3 && (await page.locator('.prog').innerText()).startsWith('Statement 4'), tag('Enter before answering does nothing')); }
        if (i === 0) await shot('statement', true);
        await answerBy(METHODS[i % 4], Q.truth);
        await checkFeedback(i, Q, Q.truth);
        if (i === 0) await shot('right', true);
        if (i % 2 === 0) { if (phone) await page.locator('#nextbtn').tap(); else await page.click('#nextbtn'); } else await press('Enter');
        if (k < SIZES[r] - 1) ok((await page.locator('.prog').innerText()).startsWith(`Statement ${i + 2} `), tag(`S${i + 1}: Next goes to statement ${i + 2}`));
      }
      // the round screen
      ok(await page.locator('.score').innerText() === `${SIZES[r]} of ${SIZES[r]}`, tag(`round ${r + 1}: ${SIZES[r]} of ${SIZES[r]}`));
      const det = page.locator('details.review');
      ok(await det.count() === 1 && await det.evaluate((d) => !d.open), tag(`round ${r + 1}: one closed drop-down`));
      const body = await bodyText();
      ok(body.includes('The time does not count for anything') && /Round time \d+ min \d+ s/.test(body), tag(`round ${r + 1}: says the time does not count for anything`));
      ok((await det.locator('summary').innerText()).startsWith(BANK.rounds[r].name + ' · ' + SIZES[r] + ' of ' + SIZES[r]), tag(`round ${r + 1}: the drop-down is named for the round and the score`));
      ok(await page.locator('#feedback, .tf').count() === 0, tag(`round ${r + 1}: no statement buttons on the round screen`));
      await det.locator('summary').click();
      if (r === 0) await shot('round-end-open', true);
      await checkReview(det, r, Qs, (n) => ({ ok: true, said: Qs[n].truth }), `round ${r + 1} drop-down`);
      ok(!(await bodyText()).includes('—') && await noOverflow(), tag(`round ${r + 1}: no em dash, no overflow`));
      if (phone) ok((await small()).length === 0, tag(`round ${r + 1}: tap targets (${await small()})`));
      await press('T'); await press('Enter'); await press('1');
      ok(await page.locator('.score').count() === 1 && await page.locator('#roundnext').count() === 1, tag(`round ${r + 1}: keys do nothing on the round screen`));
      ok((await page.locator('#roundnext').innerText()) === (r < 2 ? `Start round ${r + 2}` : 'See my results'), tag(`round ${r + 1}: the next button`));
      await page.click('#roundnext');
    }
    // the last screen
    ok(await page.locator('.score').first().innerText() === '20 of 20', tag('final: 20 of 20'));
    ok(await page.locator('details.review').count() === 3 && await page.locator('details.review[open]').count() === 0, tag('final: a closed drop-down for each round'));
    for (const r of [0, 1, 2]) {
      const det = page.locator(`details.review[data-round="${r + 1}"]`); await det.locator('summary').click();
      await checkReview(det, r, Qs, (n) => ({ ok: true, said: Qs[n].truth }), `final round ${r + 1}`);
    }
    let fin = await bodyText();
    ok(fin.includes('No slips'), tag('final: no slips'));
    ok(/True statements\s+10 of 10/.test(fin) && /False statements\s+10 of 10/.test(fin), tag('final: 10 of 10 true and 10 of 10 false'));
    ok(BANK.rounds.every((rd, r) => new RegExp(rd.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + `\\s+${SIZES[r]} of ${SIZES[r]}`).test(fin)), tag('final: each round scored out of its own size'));
    ok(Qs.every((Q) => !fin.includes(partner(Q))), tag('final: no statement\'s pair is anywhere on the page'));
    ok(fin.includes('Game code TEST22') && (await page.locator('#again').innerText()) === 'Play again with a new code', tag('final: the code, and the Play again button'));
    ok(!fin.includes('—') && await noOverflow(), tag('final: no em dash, no overflow'));
    if (phone) ok((await small()).length === 0, tag(`final: tap targets (${await small()})`));
    await shot('final-right', true);

    /* ============ play 2: all wrong ============ */
    await page.click('#again');
    const code2 = await page.evaluate(() => window.__game.code());
    ok(code2 !== 'TEST22' && (await bodyText()).includes('Game code ' + code2), tag('Play again gives a new game and shows its code'));
    await page.click('#start');
    Qs = await getQs();
    ok(Qs.filter((q) => q.truth).length === 10, tag('the new game has 10 true statements'));
    for (let r = 0; r < 3; r++) {
      for (let k = 0; k < SIZES[r]; k++) {
        const i = STARTS[r] + k, Q = Qs[i];
        await checkStatement(i, Q, i);
        await answerBy(METHODS[(i + 1) % 4], !Q.truth);
        await checkFeedback(i, Q, !Q.truth);
        if (i === 0) await shot('wrong', true);
        if (i === 14) await shot('wrong-round3', true);
        if (i % 2 === 0) await press('Enter'); else await page.click('#nextbtn');
      }
      ok(await page.locator('.score').innerText() === `0 of ${SIZES[r]}`, tag(`round ${r + 1}: 0 of ${SIZES[r]}`));
      const det = page.locator('details.review'); await det.locator('summary').click();
      ok(await det.locator('.verdict.no').count() === SIZES[r] && await det.locator('.verdict.ok').count() === 0, tag(`round ${r + 1}: every statement wrong in the drop-down`));
      await checkReview(det, r, Qs, (n) => ({ ok: false, said: !Qs[n].truth }), `round ${r + 1} drop-down (wrong)`);
      if (r === 2) { await shot('round3-end-open', true); ok((await bodyText()).includes('Round 3 was meant to be too hard'), tag('round 3 end: says it was meant to be too hard')); }
      await page.click('#roundnext');
    }
    ok(await page.locator('.score').first().innerText() === '0 of 20', tag('final: 0 of 20'));
    for (const r of [0, 1, 2]) {
      const det = page.locator(`details.review[data-round="${r + 1}"]`); await det.locator('summary').click();
      await checkReview(det, r, Qs, (n) => ({ ok: false, said: !Qs[n].truth }), `final round ${r + 1} (wrong)`);
    }
    fin = await bodyText();
    ok(/True statements\s+0 of 10/.test(fin) && /False statements\s+0 of 10/.test(fin), tag('final: 0 of 10 true and 0 of 10 false'));
    const want = countsOf(Qs, Qs.map(() => ({ ok: false })));
    const lis = await page.locator('ul.tips li').allInnerTexts();
    ok(lis.length === Object.keys(want).length, tag(`final: one line for each of the ${Object.keys(want).length} slips`));
    ok(Object.entries(want).every(([m, n]) => lis.some((l) => l === `${n} ${n === 1 ? 'time' : 'times'}. ${m}`)), tag('final: every slip is listed with its count, in the bank\'s words'));
    ok(lis.reduce((a, l) => a + parseInt(l, 10), 0) === 20, tag('final: the slip counts add up to 20'));
    ok(parseInt(lis[0], 10) === Math.max(...Object.values(want)), tag('final: the most frequent slip comes first'));
    ok(Qs.every((Q) => !fin.includes(partner(Q))), tag('final: no statement\'s pair is anywhere on the page (all wrong)'));
    ok(!fin.includes('—') && await noOverflow(), tag('final (wrong): no em dash, no overflow'));
    if (phone) ok((await small()).length === 0, tag(`final (wrong): tap targets (${await small()})`));
    await shot('final-wrong', true);

    /* ============ play 3: the edge cases ============ */
    await page.click('#again'); await page.click('#start');
    Qs = await getQs();
    await answerBy('letter', Qs[0].truth); await press('Enter');            // statement 1 right
    await answerBy('digit', !Qs[1].truth);                                  // statement 2 wrong
    await press('Enter'); await press('Enter');                             // the second Enter, on an unanswered statement, must not skip it
    ok((await page.locator('.prog').innerText()).startsWith('Statement 3 ') && (await getResults()).length === 2, tag('Enter moves on once per press (now statement 3, unanswered)'));
    await answerBy('click', Qs[2].truth);
    await press('Enter');
    ok((await page.locator('.prog').innerText()).startsWith('Statement 4 '), tag('now on statement 4'));
    const c1 = await page.locator('#clock').innerText();
    const secs = (s) => { const [m, x] = s.split(':').map(Number); return m * 60 + x; };
    await page.waitForTimeout(1400);
    const c2 = await page.locator('#clock').innerText();
    ok(secs(c2) > secs(c1), tag(`the stopwatch runs (${c1} then ${c2})`));
    await page.click('#stop');
    const stopText = await bodyText();
    ok(await page.locator('.score').first().innerText() === '2 of 20', tag('stopped: 2 of 20'));
    ok(stopText.includes('3 of 20 statements answered, 17 not reached.'), tag('stopped: says 3 answered and 17 not reached'));
    const sres = await getResults();
    const swant = countsOf(Qs, sres);
    ok(Object.keys(swant).length === 1 && (await page.locator('ul.tips li').count()) === 1 && (await page.locator('ul.tips li').innerText()) === `1 time. ${Qs[1].mistake}`, tag('stopped: the one slip so far is listed'));
    ok(/Round 1: [^\n]*\s+2 of 7 \(4 not reached\)/.test(stopText) && /\(7 not reached\)/.test(stopText) && /\(6 not reached\)/.test(stopText), tag('stopped: not reached counted per round'));
    for (const r of [0, 1, 2]) { await page.locator(`details.review[data-round="${r + 1}"] summary`).click(); }
    await checkReview(page.locator('details.review[data-round="1"]'), 0, Qs, (n) => sres[n] || null, 'stopped round 1');
    await checkReview(page.locator('details.review[data-round="2"]'), 1, Qs, () => null, 'stopped round 2');
    await checkReview(page.locator('details.review[data-round="3"]'), 2, Qs, () => null, 'stopped round 3');
    ok(await page.locator('details.review[data-round="1"] .verdict.na').count() === 4 && await page.locator('.verdict.na').count() === 17, tag('stopped: 17 are Not reached'));
    ok((await page.locator('details.review[data-round="2"] summary').innerText()).includes('Not reached'), tag('stopped: round 2\'s summary says Not reached'));
    ok(!(await bodyText()).includes('—') && await noOverflow(), tag('stopped: no em dash, no overflow'));
    await shot('stopped', true);
    // stopping at once
    await page.click('#again'); await page.click('#start'); await page.click('#stop');
    ok(await page.locator('.score').first().innerText() === '0 of 20' && (await bodyText()).includes('You did not answer any statements.') && (await bodyText()).includes('0 of 20 statements answered, 20 not reached.'), tag('stopping at once: 0 of 20'));
    ok(await noOverflow(), tag('stopping at once: no overflow'));
    // stopping in round 3, after finishing rounds 1 and 2
    await page.click('#again'); await page.click('#start');
    Qs = await getQs();
    for (let i = 0; i < 14; i++) { await answerBy('letter', Qs[i].truth); await press('Enter'); if (i === 6 || i === 13) await page.click('#roundnext'); }
    ok((await page.locator('.prog').innerText()).startsWith('Statement 15 of 20 · Round 3'), tag('rounds 1 and 2 played, now round 3'));
    ok(await page.locator('.pill.hard').count() === 1, tag('round 3 has the red pill'));
    await answerBy('digit', !Qs[14].truth);
    await page.click('#stop');
    ok(await page.locator('.score').first().innerText() === '14 of 20' && (await bodyText()).includes('15 of 20 statements answered, 5 not reached.'), tag('stopped in round 3: 14 of 20, 15 answered, 5 not reached'));
    ok(await page.locator('details.review[data-round="3"] summary').innerText().then((s) => s.includes('0 right, 1 answered')), tag('stopped in round 3: the round summary says 0 right, 1 answered'));

    /* the why of h8 names the false value (24): it must not be on screen until h8 is answered, whichever version h8 shows */
    for (const truth of [true, false]) {
      const code = await page.evaluate((tr) => { for (let a = 0; a < 20000; a++) { const c = window.__game.newCode(); const q = window.__game.generate(c).find((x) => x.slot === 'h8'); if (q && q.truth === tr) return c; } return null; }, truth);
      ok(!!code, tag(`found a game that shows the ${W(truth)} version of h8`));
      await page.goto(FILE + '#' + code); await page.reload(); await page.click('#start');
      const gq = await getQs(), target = gq.findIndex((q) => q.slot === 'h8'), H = gq[target];
      for (let i = 0; i < target; i++) { await press(gq[i].truth ? 'T' : 'F'); await press('Enter'); if (i === 6 || i === 13) await page.click('#roundnext'); }
      const before = await bodyText();
      ok((await page.locator('#stmt').innerText()) === H.text && H.round === 3, tag(`h8 (${W(truth)} version) is on screen`));
      ok(!before.includes('24 is what you get') && !before.includes(H.why) && !before.includes(partner(H)), tag(`h8 (${W(truth)} version): its why, which names the false value, is not on screen before the answer`));
      await press(H.truth ? 'T' : 'F');
      ok((await page.locator('#feedback').innerText()).includes('Why: ' + H.why), tag(`h8 (${W(truth)} version): the why appears after the answer`));
    }

    /* the page as a whole */
    await page.goto(FILE + '#TEST22'); await page.reload(); await page.click('#start');
    ok((await small()).length === 0, tag(`every button at least 44 px (${await small()})`));
    const tfBox = await page.locator('#btn-true').boundingBox(), tfBox2 = await page.locator('#btn-false').boundingBox();
    ok(tfBox.height >= 70 && tfBox2.height >= 70 && tfBox.width >= 120 && tfBox.y === tfBox2.y, tag(`the TRUE and FALSE buttons are big and side by side (${Math.round(tfBox.width)} x ${Math.round(tfBox.height)})`));
    ok(await page.evaluate(() => localStorage.length + sessionStorage.length) === 0, tag('nothing stored'));
    ok(external.length === 0, tag('no external requests ' + external.join(',')));
    ok(errors.length === 0, tag('no console errors ' + errors.join(' | ')));
    console.log(`[${name}] tallest page after an answer: ${tallest}px (viewport ${vp.height})`);
    await ctx.close();
  }
  await browser.close();
  console.log(`${pass} checks passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
