/**
 * Playwright test for the Sequencer game (The Greatest Show On Earth), at 1280x800 and 390x844.
 *
 *   python3 build/the-greatest-show-on-earth-game.py
 *   NODE_PATH=/path/to/node_modules node build/test-the-greatest-show-on-earth-game.js [shots-dir]
 *   python3 build/check-the-greatest-show-on-earth-game.py /tmp/greatest-show-games.json
 *
 * It also dumps 300 generated games to /tmp for the checker. Three plays per viewport: all right (sequences tapped and typed, and the
 * other accepted order on the eight-step questions), all wrong (every kind of slip, then every drop-down read back), and the edge cases
 * (undo, stopping early, stopping at once).
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const FILE = 'file://' + path.join(__dirname, '..', 'out', 'The Greatest Show On Earth', 'The Greatest Show On Earth game.html');
const SHOTS = process.argv[2];
const DUMP = process.env.DUMP || '/tmp/greatest-show-games.json';
let pass = 0, fail = 0;
const ok = (c, what) => { if (c) pass++; else { fail++; console.log('FAIL:', what); } };
const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const norm = (s) => String(s).replace(/\s+/g, ' ').trim();   // innerText collapses the double spaces between steps
const CATS = { order: 'Putting the steps in order', species: 'Species and speciation', steps: 'Which step?', reasons: 'Why and how long', ancestors: 'Evidence and ancestors', puzzle: 'Hard puzzles' };
const LABEL = { one: 'One population, one gene pool', barrier: 'A barrier splits it in two', geneflow: 'Gene flow stops', cond: 'Different conditions on each side', sel: 'Different natural selection in each group', build: 'Differences build up over many generations', differ: 'The groups differ in looks, behaviour, breeding time or genes', split: 'They can no longer interbreed' };

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
      while (Object.keys(out).length < 300) { const c = window.__game.newCode(); if (!seen.has(c)) { seen.add(c); out[c] = window.__game.generate(c).map((q) => Object.assign({}, q, { disp: window.__game.display(q) })); } }
      return out;
    });
    fs.writeFileSync(DUMP, JSON.stringify(games));
    const a = await page.evaluate(() => JSON.stringify(window.__game.generate('K7Q2M9')));
    const b = await page.evaluate(() => JSON.stringify(window.__game.generate('K7Q2M9')));
    const c = await page.evaluate(() => JSON.stringify(window.__game.generate('K7Q2M8')));
    ok(a === b, 'same code gives the same game'); ok(a !== c, 'a different code gives a different game'); ok(Object.keys(games).length === 300, '300 games generated');
    await page.close();
  }

  /* ---- two students: different games; a teacher's #CODE reproduces one ---- */
  {
    const ctx = await browser.newContext();
    const p1 = await ctx.newPage(), p2 = await ctx.newPage(), p3 = await ctx.newPage();
    await p1.goto(FILE); await p2.goto(FILE);
    const code1 = await p1.evaluate(() => window.__game.code()), code2 = await p2.evaluate(() => window.__game.code());
    ok(code1 !== code2, `two students get different codes (${code1}, ${code2})`);
    const q1 = await p1.evaluate(() => JSON.stringify(window.__game.questions())), q2 = await p2.evaluate(() => JSON.stringify(window.__game.questions()));
    ok(q1 !== q2, 'two students get different questions');
    await p3.goto(FILE + '#' + code1);
    ok(await p3.evaluate(() => window.__game.code()) === code1, 'teacher opens #CODE and gets that code');
    ok(await p3.evaluate(() => JSON.stringify(window.__game.questions())) === q1, 'teacher sees exactly the first student\'s questions');
    ok(await p3.locator('#code').innerText() === code1, 'start screen shows the code');
    await ctx.close();
  }

  for (const [name, vp] of [['desktop 1280x800', { width: 1280, height: 800 }], ['phone 390x844', { width: 390, height: 844 }]]) {
    const ctx = await browser.newContext({ viewport: vp, hasTouch: name.startsWith('phone'), isMobile: name.startsWith('phone') });
    const page = await ctx.newPage();
    const external = [], errors = [];
    page.on('request', (r) => { if (!r.url().startsWith('file:') && !r.url().startsWith('data:')) external.push(r.url()); });
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    const tag = (s) => `[${name}] ${s}`;
    const noOverflow = () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    const short = name.split(' ')[0];
    const keyFor = (Q, id) => { const k = Q.cards.findIndex((c) => c.id === id) + 1; return k === 10 ? '0' : String(k); };

    await page.goto(FILE + '#TEST22');
    ok(await noOverflow(), tag('start: no horizontal overflow'));
    const startText = await page.locator('body').innerText();
    ok(/meant to be almost impossible/.test(startText) && /Some examples are real/.test(startText), tag('the start screen says round 3 is meant to be too hard, and which examples are real'));
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/${short}-start.png`, fullPage: true });

    /* ---- play 1: all right. Even questions by tapping, odd ones by the keyboard. The eight-step questions use the OTHER accepted order. ---- */
    await page.click('#start');
    let Qs = await page.evaluate(() => window.__game.questions());
    for (let r = 0; r < 3; r++) {
      for (let k = 0; k < 6; k++) {
        const i = r * 6 + k, Q = Qs[i], byKey = i % 2 === 1;
        const shown = await page.locator('#qcard').getAttribute('data-display');
        ok(shown === await page.evaluate((j) => window.__game.display(window.__game.questions()[j]), i), tag(`Q${i + 1} shows the generated question`));
        if (Q.cat === 'order') {
          const seq = Q.accept.length > 1 ? Q.accept[1] : Q.correct;
          ok(await page.locator('.cardstep').count() === Q.cards.length, tag(`Q${i + 1}: ${Q.cards.length} cards`));
          ok(await page.locator('#check').isDisabled(), tag(`Q${i + 1}: Check is off until enough cards are chosen`));
          for (const id of seq) { if (byKey) await page.keyboard.press(keyFor(Q, id)); else await page.click(`.cardstep[data-id="${id}"]`); }
          ok(!(await page.locator('#check').isDisabled()), tag(`Q${i + 1}: Check is on once ${seq.length} cards are chosen`));
          const leftOut = await page.locator('.cardstep:not(.on)').count();
          ok(leftOut === Q.distract.length, tag(`Q${i + 1}: the cards that do not belong are left out (${leftOut})`));
          if (i === 16 && SHOTS) await page.screenshot({ path: `${SHOTS}/${short}-q17-chosen.png`, fullPage: true });
          if (byKey) await page.keyboard.press('Enter'); else await page.click('#check');
        } else {
          ok(await page.locator('.opt').count() === 4, tag(`Q${i + 1}: four options`));
          if (byKey) await page.keyboard.press(String(Q.correctIndex + 1)); else await page.click(`.opt[data-o="${Q.correctIndex + 1}"]`);
        }
        ok(await page.locator('#feedback.right').count() === 1 && (await page.locator('#feedback .head').innerText()) === 'Correct.', tag(`Q${i + 1} (${Q.kind}) marked right`));
        const fb = await page.locator('#feedback').innerText();
        ok(Q.explain.every((l) => fb.includes(l)), tag(`Q${i + 1}: every line of the reasoning is shown`));
        if (Q.accept && Q.accept.length > 1) ok(fb.includes('either way round'), tag(`Q${i + 1}: says steps 3 and 4 can go either way`));
        ok(await noOverflow(), tag(`Q${i + 1}: no overflow`));
        if (i === 0 && SHOTS) await page.screenshot({ path: `${SHOTS}/${short}-q1-right.png`, fullPage: true });
        if (i === 17 && SHOTS) await page.screenshot({ path: `${SHOTS}/${short}-q18-right.png`, fullPage: true });
        if (byKey) await page.keyboard.press('Enter'); else await page.click('#nextbtn');
      }
      ok((await page.locator('.score').innerText()) === '6 of 6', tag(`round ${r + 1}: 6 of 6`));
      const det = page.locator('details.review');
      ok(await det.count() === 1 && (await det.locator('summary').innerText()).includes(`Round ${r + 1}`), tag(`round ${r + 1}: one review drop-down`));
      ok(await det.evaluate((d) => !d.open), tag('the round drop-down starts closed'));
      ok((await page.locator('body').innerText()).includes('The time does not count for anything'), tag('the round screen says the time does not count'));
      await det.locator('summary').click();
      ok(await det.locator('.rq').count() === 6 && await det.locator('.verdict.ok').count() === 6, tag('six questions, all right, in the drop-down'));
      await page.click('#roundnext');
    }
    ok((await page.locator('.score').first().innerText()) === '18 of 18', tag('final 18 of 18'));
    ok(await page.locator('details.review').count() === 3, tag('final: a drop-down for each of the three rounds'));
    for (const r of [1, 2, 3]) {
      const det = page.locator(`details.review[data-round="${r}"]`); await det.locator('summary').click();
      ok(await det.locator('.rq .meta').count() === 6 && (await det.locator('.rq .meta').allInnerTexts()).every((m) => /^\d+ (s|min)/.test(m)), tag(`round ${r}: every question shows how long it took`));
    }
    const fin = await page.locator('body').innerText();
    const per = {}; Qs.forEach((Q) => { per[Q.cat] = (per[Q.cat] || 0) + 1; });
    ok(Object.entries(per).every(([c, n]) => new RegExp(`${reEsc(CATS[c])}\\s+${n} of ${n}`).test(fin)), tag('every skill full marks: ' + JSON.stringify(per)));
    ok(fin.includes('No mistakes'), tag('no mistakes')); ok(await noOverflow(), tag('final no overflow'));

    /* ---- play 2: a wrong answer everywhere, with every kind of slip ---- */
    await page.click('#again'); await page.click('#start');
    Qs = await page.evaluate(() => window.__game.questions());
    const wrote = {};
    for (let r = 0; r < 3; r++) {
      for (let k = 0; k < 6; k++) {
        const i = r * 6 + k, Q = Qs[i];
        if (Q.cat === 'order') {
          let seq;
          if (Q.distract.length) seq = [Q.distract[0]].concat(Q.correct.slice(0, -1));          // a card that does not belong
          else if (i % 3 === 0) seq = Q.correct.slice().reverse();                              // back to front
          else if (i % 3 === 1) { seq = Q.correct.slice(); [seq[1], seq[2]] = [seq[2], seq[1]]; } // two early steps swapped (never 3 and 4)
          else { seq = Q.correct.slice(); seq.splice(1, 0, seq.pop()); }                          // the last step much too early
          for (const id of seq) await page.click(`.cardstep[data-id="${id}"]`);
          await page.click('#check');
          wrote[i] = seq.map((id, j) => `${j + 1}. ${(Q.cards.find((c) => c.id === id) || {}).label}`).join('  ');
        } else {
          const w = [0, 1, 2, 3].find((j) => j !== Q.correctIndex);
          await page.click(`.opt[data-o="${w + 1}"]`);
          wrote[i] = Q.options[w].text;
        }
        const fb = await page.locator('#feedback').innerText();
        ok(await page.locator('#feedback.wrong').count() === 1 && fb.startsWith('Not quite') && (await page.locator('#feedback .msg').innerText()).trim().length > 10, tag(`Q${i + 1} (${Q.kind}) wrong feedback names the mistake`));
        if (Q.cat !== 'order') ok(fb.includes(Q.options[Q.correctIndex].text) && fb.includes(Q.options.find((o, j) => j !== Q.correctIndex && o.text === wrote[i]).msg), tag(`Q${i + 1}: the answer and why the choice was wrong`));
        else ok(Q.explain.every((l) => fb.includes(l)), tag(`Q${i + 1}: the right order and the reason for every step`));
        if (i === 12 && SHOTS) await page.screenshot({ path: `${SHOTS}/${short}-q13-wrong.png`, fullPage: true });
        await page.click('#nextbtn');
      }
      ok((await page.locator('.score').innerText()) === '0 of 6', tag(`round ${r + 1}: 0 of 6`));
      await page.click('#roundnext');
    }
    ok((await page.locator('.score').first().innerText()) === '0 of 18', tag('final 0 of 18'));
    const results = await page.evaluate(() => window.__game.results());
    ok(results.length === 18 && results.every((x) => x && !x.ok && x.tag), tag('every answer recorded as wrong, with a named mistake'));
    for (const r of [1, 2, 3]) {
      const det = page.locator(`details.review[data-round="${r}"]`); await det.locator('summary').click();
      ok(await det.locator('.verdict.no').count() === 6, tag(`round ${r}: six wrong`));
      for (let k = 0; k < 6; k++) {
        const i = (r - 1) * 6 + k, Q = Qs[i]; const t = await det.locator(`.rq[data-q="${i + 1}"]`).innerText();
        const answer = Q.cat === 'order' ? Q.correct.map((id, j) => `${j + 1}. ${LABEL[id]}`).join('  ') : Q.options[Q.correctIndex].text;
        ok(t.includes('You wrote') && norm(t).includes(norm(wrote[i])) && t.includes('The answer is') && norm(t).includes(norm(answer)) && t.includes('How to get there') && Q.explain.every((l) => t.includes(l)) && /\d+ (s|min)/.test(t),
          tag(`review ${i + 1}: what was written, the answer, the working, the time`));
      }
    }
    const fin2 = await page.locator('body').innerText();
    ok(Object.entries(per).every(([c, n]) => new RegExp(`${reEsc(CATS[c])}\\s+0 of ${n}`).test(fin2)), tag('0 for every skill'));
    const tags = new Set(results.map((x) => x.tag));
    ok(tags.size >= 8, tag(`several kinds of mistake were named (${tags.size}: ${[...tags].join(', ')})`));
    ok((await page.locator('ul.tips li').count()) === tags.size, tag('every kind of mistake has its tip'));
    const tipText = await page.locator('ul.tips').innerText();
    ok(!tipText.includes('Read the question again'), tag('every mistake has its own tip, not the generic one'));
    const nowCode = await page.evaluate(() => window.__game.code());
    ok(nowCode !== 'TEST22' && fin2.includes('Game code ' + nowCode), tag('Play again gives a new game and shows its code'));
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/${short}-final-wrong.png`, fullPage: true });

    /* ---- play 3: the edge cases ---- */
    await page.click('#again'); await page.click('#start');
    Qs = await page.evaluate(() => window.__game.questions());
    const Q0 = Qs[0];
    await page.click(`.cardstep[data-id="${Q0.correct[0]}"]`); await page.click(`.cardstep[data-id="${Q0.correct[1]}"]`);
    ok(await page.locator('.cardstep.on').count() === 2, tag('two cards chosen'));
    await page.click(`.cardstep[data-id="${Q0.correct[0]}"]`);
    ok(await page.locator('.cardstep.on').count() === 2, tag('tapping an earlier chosen card does nothing (only the last can be taken back)'));
    await page.click(`.cardstep[data-id="${Q0.correct[1]}"]`);
    ok(await page.locator('.cardstep.on').count() === 1, tag('tapping the last chosen card takes it back'));
    await page.click('#undo');
    ok(await page.locator('.cardstep.on').count() === 0 && await page.locator('#undo').isDisabled(), tag('Undo takes the last one back, and is off with nothing chosen'));
    for (const id of Q0.correct) await page.click(`.cardstep[data-id="${id}"]`);
    ok(await page.locator('.cardstep:not(.on)').evaluateAll((bs) => bs.every((b) => b.disabled)), tag('once enough are chosen, the rest are off'));
    await page.click('#check');
    ok(await page.locator('.cardstep').evaluateAll((bs) => bs.every((b) => b.disabled)), tag('after Check the cards are locked'));
    await page.click('#stop');
    const stopText = await page.locator('body').innerText();
    ok((await page.locator('.score').innerText()) === '1 of 18' && stopText.includes('1 of 18 questions answered') && /not reached/.test(stopText), tag('stopped: 1 of 18, and it says how many were not reached'));
    await page.locator('details.review[data-round="1"] summary').click();
    ok(await page.locator('details.review[data-round="1"] .verdict.na').count() === 5 && await page.locator('details.review[data-round="1"] .verdict.ok').count() === 1, tag('stopped: the review says which were not reached'));
    await page.locator('details.review[data-round="3"] summary').click();
    ok(await page.locator('details.review[data-round="3"] .verdict.na').count() === 6, tag('stopped: round 3 all not reached'));
    await page.click('#again'); await page.click('#start'); await page.click('#stop');
    ok((await page.locator('.score').innerText()) === '0 of 18' && (await page.locator('body').innerText()).includes('You did not answer any questions'), tag('stopping at once: 0 of 18'));
    ok(await noOverflow(), tag('stopped: no overflow'));

    /* ---- the hardest two, looked at ---- */
    await page.goto(FILE + '#TEST22'); await page.reload(); await page.click('#start');
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
