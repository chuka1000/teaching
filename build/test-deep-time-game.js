/**
 * Playwright test for the Number line game (Deep Time), at 1280x800 and 390x844.
 *
 *   python3 build/deep-time-game.py
 *   NODE_PATH=/path/to/node_modules node build/test-deep-time-game.js [shots-dir]
 *   python3 build/check-deep-time-game.py /tmp/deep-time-games.json
 *
 * It also dumps 300 generated games for the checker. Three plays per viewport: all right (tapped or clicked on the line, and by the keyboard),
 * all wrong (on a named mistake where there is one, so every kind of mistake is exercised, then every drop-down read back), and the edge cases
 * (Check off until placed, arrow keys, dragging, stopping early, stopping at once).
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const FILE = 'file://' + path.join(__dirname, '..', 'out', 'Deep Time', 'Deep Time game.html');
const SHOTS = process.argv[2];
const DUMP = process.env.DUMP || '/tmp/deep-time-games.json';
let pass = 0, fail = 0;
const ok = (c, what) => { if (c) pass++; else { fail++; console.log('FAIL:', what); } };
const CATS = { full: 'The whole timeline', zoom: 'Zoomed timelines', clock: 'Earth as one day', hard: 'Hard puzzles' };
const posOf = (Q, x) => (x - Q.scale.L) / (Q.scale.R - Q.scale.L);

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
    ok(a === b, 'same code gives the same game'); ok(a !== c, 'a different code gives a different game'); ok(Object.keys(games).length === 300, '300 games generated');
    const html = fs.readFileSync(FILE.replace('file://', ''), 'utf8');
    ok(!html.includes('/*DATA*/null/*END*/'), 'the dates were written into the game');
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
    const phone = name.startsWith('phone');
    const ctx = await browser.newContext({ viewport: vp, hasTouch: phone, isMobile: phone });
    const page = await ctx.newPage();
    const external = [], errors = [];
    page.on('request', (r) => { if (!r.url().startsWith('file:') && !r.url().startsWith('data:')) external.push(r.url()); });
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    const tag = (s) => `[${name}] ${s}`;
    const noOverflow = () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    const short = name.split(' ')[0];
    const tapAt = async (p) => {
      const box = await page.locator('#track').boundingBox();
      await page.locator('#track').scrollIntoViewIfNeeded();
      const b2 = await page.locator('#track').boundingBox();
      const x = b2.x + p * b2.width, y = b2.y + b2.height / 2;
      if (phone) await page.touchscreen.tap(x, y); else await page.mouse.click(x, y);
      return box;
    };

    await page.goto(FILE + '#TEST22');
    ok(await noOverflow(), tag('start: no horizontal overflow'));
    const startText = await page.locator('body').innerText();
    ok(/meant to be almost impossible/.test(startText), tag('the start screen says round 3 is meant to be too hard'));
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/${short}-start.png`, fullPage: true });

    /* ---- play 1: all right. Even questions tapped or clicked; odd ones placed and checked by the keyboard. ---- */
    await page.click('#start');
    let Qs = await page.evaluate(() => window.__game.questions().map((q) => Object.assign({}, q, { ans: window.__game.answerText(q) })));
    for (let r = 0; r < 3; r++) {
      for (let k = 0; k < 6; k++) {
        const i = r * 6 + k, Q = Qs[i], p = posOf(Q, Q.value);
        ok(await page.locator('#check').isDisabled(), tag(`Q${i + 1}: Check is off until the line is tapped`));
        ok((await page.locator('#legend').count()) === (Q.bands ? 1 : 0), tag(`Q${i + 1}: the era key is shown in rounds 1 and 2 only`));
        if (i % 2 === 0) { await tapAt(p); await page.click('#check'); }
        else { await page.focus('#track'); await page.keyboard.press('ArrowRight'); await page.evaluate((pp) => window.__game.place(pp), p); await page.keyboard.press('Enter'); }
        const head = await page.locator('#feedback .head').innerText();
        ok(await page.locator('#feedback.right').count() === 1 && head.startsWith('Correct'), tag(`Q${i + 1} (${Q.kind} ${Q.key}) marked right: ${head}`));
        const fb = await page.locator('#feedback').innerText();
        ok(Q.explain.every((l) => fb.includes(l)), tag(`Q${i + 1}: the working is shown`));
        ok(await page.locator('.ok-band').count() === 1 && await page.locator('.truth').count() === 1 && await page.locator('#pin.right').count() === 1, tag(`Q${i + 1}: the band, the answer line and a green marker`));
        ok(await noOverflow(), tag(`Q${i + 1}: no overflow`));
        if (SHOTS && (i === 0 || i === 14 || i === 16)) await page.screenshot({ path: `${SHOTS}/${short}-q${i + 1}-right.png`, fullPage: true });
        if (i % 2 === 0) await page.click('#nextbtn'); else await page.keyboard.press('Enter');
      }
      ok((await page.locator('.score').innerText()) === '6 of 6', tag(`round ${r + 1}: 6 of 6`));
      const det = page.locator('details.review');
      ok(await det.count() === 1 && await det.evaluate((d) => !d.open), tag(`round ${r + 1}: one closed review drop-down`));
      ok((await page.locator('body').innerText()).includes('The time does not count for anything'), tag('the round screen says the time does not count'));
      await det.locator('summary').click();
      ok(await det.locator('.rq').count() === 6 && await det.locator('.verdict.ok').count() === 6, tag('six questions, all right, in the drop-down'));
      await page.click('#roundnext');
    }
    ok((await page.locator('.score').first().innerText()) === '18 of 18', tag('final 18 of 18'));
    ok(await page.locator('details.review').count() === 3, tag('final: a drop-down for each round'));
    for (const r of [1, 2, 3]) {
      const det = page.locator(`details.review[data-round="${r}"]`); await det.locator('summary').click();
      ok(await det.locator('.rq .meta').count() === 6 && (await det.locator('.rq .meta').allInnerTexts()).every((m) => /^\d+ (s|min)/.test(m)), tag(`round ${r}: every question shows how long it took`));
    }
    const fin = await page.locator('body').innerText();
    const per = {}; Qs.forEach((Q) => { per[Q.cat] = (per[Q.cat] || 0) + 1; });
    ok(Object.entries(per).every(([c, n]) => new RegExp(`${CATS[c]}\\s+${n} of ${n}`).test(fin)), tag('every skill full marks ' + JSON.stringify(per)));
    ok(fin.includes('No mistakes'), tag('no mistakes'));

    /* ---- play 2: all wrong, on a named mistake where there is one ---- */
    await page.click('#again'); await page.click('#start');
    Qs = await page.evaluate(() => window.__game.questions().map((q) => Object.assign({}, q, { ans: window.__game.answerText(q) })));
    const expectTag = {};
    for (let r = 0; r < 3; r++) {
      for (let k = 0; k < 6; k++) {
        const i = r * 6 + k, Q = Qs[i];
        let p;
        const eraOf = (x) => Q.bands ? ['Precambrian', 'Palaeozoic', 'Mesozoic', 'Cenozoic'][[[4600, 539], [539, 252], [252, 66], [66, 0]].findIndex(([a, b]) => x <= a && x > b)] : null;
        if (Q.bands && i % 3 === 2) {            // a wrong ERA, away from the answer and from every named mistake
          const x = eraOf(Q.value) === 'Precambrian' ? 30 : Q.scale.L - 10;
          p = posOf(Q, x);
          const near = Q.mistakes.find((m) => Math.abs(m.value - x) <= Q.scale.tol);
          expectTag[i] = near ? near.tag : 'era';
        } else if (Q.mistakes.length) { const m = Q.mistakes[i % Q.mistakes.length]; p = posOf(Q, m.value); expectTag[i] = m.tag; }
        else { p = posOf(Q, Q.value) < 0.5 ? 1 : 0; }
        await page.evaluate((pp) => window.__game.place(pp), p);
        await page.click('#check');
        const fb = await page.locator('#feedback').innerText();
        ok(await page.locator('#feedback.wrong').count() === 1 && fb.startsWith('Not quite') && fb.includes(Q.ans), tag(`Q${i + 1} (${Q.kind} ${Q.key}) wrong, and the answer is named (${Q.ans})`));
        if (expectTag[i] && expectTag[i] !== 'era') { const m = Q.mistakes.find((x) => x.tag === expectTag[i]); ok(fb.includes(m.msg) && fb.includes(m.how), tag(`Q${i + 1}: the mistake "${m.tag}" is named with its sum`)); }
        if (expectTag[i] === 'era') ok(fb.includes('You put it in the') && fb.includes('is in the ' + eraOf(Q.value)), tag(`Q${i + 1}: the wrong era is named, and the right one`));
        if (SHOTS && i === 0) await page.screenshot({ path: `${SHOTS}/${short}-q1-wrong.png`, fullPage: true });
        await page.click('#nextbtn');
      }
      ok((await page.locator('.score').innerText()) === '0 of 6', tag(`round ${r + 1}: 0 of 6`));
      await page.click('#roundnext');
    }
    ok((await page.locator('.score').first().innerText()) === '0 of 18', tag('final 0 of 18'));
    const results = await page.evaluate(() => window.__game.results());
    ok(results.length === 18 && results.every((x) => x && !x.ok && x.tag), tag('every answer wrong, each with a named mistake'));
    ok(Object.entries(expectTag).every(([i, t]) => results[i].tag === t), tag('each placement on a named mistake is diagnosed as that mistake'));
    for (const r of [1, 2, 3]) {
      const det = page.locator(`details.review[data-round="${r}"]`); await det.locator('summary').click();
      ok(await det.locator('.verdict.no').count() === 6, tag(`round ${r}: six wrong`));
      for (let k = 0; k < 6; k++) {
        const i = (r - 1) * 6 + k, Q = Qs[i]; const t = await det.locator(`.rq[data-q="${i + 1}"]`).innerText();
        ok(t.includes('You placed it at') && t.includes(results[i].wrote) && t.includes('The answer is') && t.includes(Q.ans) && t.includes('How to get there') && Q.explain.every((l) => t.includes(l)) && /\d+ (s|min)/.test(t),
          tag(`review ${i + 1}: where it was placed, the answer, the working, the time`));
      }
    }
    const fin2 = await page.locator('body').innerText();
    ok(Object.entries(per).every(([c, n]) => new RegExp(`${CATS[c]}\\s+0 of ${n}`).test(fin2)), tag('0 for every skill'));
    const tags = new Set(results.map((x) => x.tag));
    ok(tags.size >= 3 && tags.has('era') && tags.has('forward'), tag(`several kinds of mistake were named (${[...tags].join(', ')})`));
    ok((await page.locator('ul.tips li').count()) === tags.size, tag('every kind of mistake has its tip'));
    const nowCode = await page.evaluate(() => window.__game.code());
    ok(nowCode !== 'TEST22' && fin2.includes('Game code ' + nowCode), tag('Play again gives a new game and shows its code'));
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/${short}-final-wrong.png`, fullPage: true });

    /* ---- play 3: the edge cases ---- */
    await page.click('#again'); await page.click('#start');
    ok(await page.locator('#check').isDisabled() && await page.locator('#pin.hide').count() === 1, tag('no marker and no Check before the line is touched'));
    const pinLeft = async () => parseFloat((await page.locator('#pin').getAttribute('style')).match(/left:\s*([\d.]+)%/)[1]);
    await page.focus('#track'); await page.keyboard.press('ArrowRight');
    ok(Math.abs(await pinLeft() - 50) < 1e-6, tag('the first arrow key puts the marker in the middle'));
    await page.keyboard.press('Shift+ArrowRight');
    ok(Math.abs(await pinLeft() - 55) < 1e-6, tag('Shift and an arrow key moves it 5%'));
    await page.keyboard.press('ArrowLeft');
    ok(Math.abs(await pinLeft() - 54.5) < 1e-6, tag('an arrow key alone moves it 0.5%'));
    // drag: press at 20%, move to 80%, release
    await page.locator('#track').scrollIntoViewIfNeeded();
    const bx = await page.locator('#track').boundingBox();
    if (!phone) {
      await page.mouse.move(bx.x + 0.2 * bx.width, bx.y + bx.height / 2); await page.mouse.down();
      await page.mouse.move(bx.x + 0.8 * bx.width, bx.y + bx.height / 2, { steps: 5 }); await page.mouse.up();
      const left = parseFloat((await page.locator('#pin').getAttribute('style')).match(/left:\s*([\d.]+)%/)[1]);
      ok(Math.abs(left - 80) < 1, tag(`dragging moves the marker (${left}%)`));
    } else {
      await page.touchscreen.tap(bx.x + 0.3 * bx.width, bx.y + bx.height / 2);
      const left = parseFloat((await page.locator('#pin').getAttribute('style')).match(/left:\s*([\d.]+)%/)[1]);
      ok(Math.abs(left - 30) < 1, tag(`a tap moves the marker (${left}%)`));
    }
    await page.click('#check');
    ok(await page.locator('#check').isDisabled(), tag('after Check the question is locked'));
    await page.evaluate(() => window.__game.place(0.1));
    ok((await page.evaluate(() => window.__game.results()[0].placed)) !== null && await page.locator('.truth').count() === 1, tag('a checked question cannot be moved again'));
    await page.click('#stop');
    const stopText = await page.locator('body').innerText();
    ok((await page.locator('.score').innerText()).endsWith('of 18') && stopText.includes('1 of 18 questions answered') && /not reached/.test(stopText), tag('stopped: 1 answered, and it says how many were not reached'));
    await page.locator('details.review[data-round="1"] summary').click();
    ok(await page.locator('details.review[data-round="1"] .verdict.na').count() === 5, tag('stopped: the review says which were not reached'));
    await page.click('#again'); await page.click('#start'); await page.click('#stop');
    ok((await page.locator('.score').innerText()) === '0 of 18' && (await page.locator('body').innerText()).includes('You did not answer any questions'), tag('stopping at once: 0 of 18'));
    ok(await noOverflow(), tag('stopped: no overflow'));

    await page.goto(FILE + '#TEST22'); await page.reload(); await page.click('#start');
    const small = await page.evaluate(() => [...document.querySelectorAll('button')].filter((b) => { const r = b.getBoundingClientRect(); return r.width && (r.height < 44 || r.width < 44); }).length);
    ok(small === 0, tag('every button at least 44 px'));
    const trackH = await page.evaluate(() => document.getElementById('track').getBoundingClientRect().height);
    ok(trackH >= 44, tag(`the timeline is a big enough target (${trackH} px)`));
    ok(await page.evaluate(() => localStorage.length + sessionStorage.length) === 0, tag('nothing stored'));
    ok(external.length === 0, tag('no external requests ' + external.join(',')));
    ok(errors.length === 0, tag('no console errors ' + errors.join(' | ')));
    await ctx.close();
  }
  await browser.close();
  console.log(`${pass} checks passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
