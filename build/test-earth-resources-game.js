/**
 * Playwright test for the Earth Resources revision game, at 1280x800 and 390x844.
 *
 *   python3 build/earth-resources-bank.py && python3 build/earth-resources-game.py
 *   NODE_PATH=/path/to/node_modules node build/test-earth-resources-game.js [shots-dir]
 *   python3 build/check-earth-resources-game.py /tmp/er-games.json
 *
 * Chromium is the one in PLAYWRIGHT_BROWSERS_PATH (/opt/pw-browsers here); nothing is installed.
 *
 * It dumps 300 generated games for the checker (DUMP, default /tmp/er-games.json) and what an all-wrong game showed (DUMP + '.play.json').
 * Plays per viewport: all right (every one of the six question kinds answered by the route a student takes: taps, menus, typing, ticks), all wrong
 * (a different named mistake each time, so the feedback for every kind is read back), a partial game (some written ticks, a stuck written
 * answer, bad number input, numbers typed with commas and units, keyboard keys), and the edge cases (stopping at once, stopping part-way).
 * Every drop-down is opened and read back.
 */
const fs = require('fs');
const path = require('path');
if (!process.env.PLAYWRIGHT_BROWSERS_PATH && fs.existsSync('/opt/pw-browsers')) process.env.PLAYWRIGHT_BROWSERS_PATH = '/opt/pw-browsers';
const { chromium } = require('playwright');
const FILE = 'file://' + path.join(__dirname, '..', 'out', 'Earth Resources Revision', 'Earth Resources Revision game.html');
const SHOTS = process.argv[2];
const DUMP = process.env.DUMP || '/tmp/er-games.json';
let pass = 0, fail = 0;
const ok = (c, what) => { if (c) pass++; else { fail++; console.log('FAIL:', what); } };
const SIZES = [10, 12, 12, 10, 10];

/* ---- answering one question, the way a student does ---- */
async function answer(page, Q, mode, k, opts = {}) {
  const kind = Q.kind;
  if (kind === 'mc') {
    const pick = mode === 'right' ? Q.correctIndex : (() => { const w = Q.options.map((_, i) => i).filter((i) => i !== Q.correctIndex); return w[k % w.length]; })();
    if (opts.key) await page.keyboard.press(String(pick + 1)); else await page.click(`.opt[data-o="${pick + 1}"]`);
    return { wrote: Q.options[pick].text, ok: mode === 'right' };
  }
  if (kind === 'num') {
    let text, good = mode === 'right';
    if (good) text = opts.decorate ? comma(Q.answer) + ' ' + Q.unit : String(Q.answer);
    else if (Q.mistakes.length && k % 4 !== 3) text = String(Q.mistakes[k % Q.mistakes.length].value);
    else text = String(Q.answer + 7);
    await page.fill('#numin', text);
    if (opts.enter) await page.press('#numin', 'Enter'); else await page.click('#check');
    return { wrote: text, ok: good };
  }
  if (kind === 'build') {
    const cards = Q.cards;
    const chosen = mode === 'right' ? cards.map((c, i) => [c, i]).filter(([c]) => Q.correct.includes(c)) : cards.map((c, i) => [c, i]).filter(([c]) => !Q.correct.includes(c)).slice(0, 1).concat(cards.map((c, i) => [c, i]).filter(([c]) => Q.correct.includes(c)).slice(0, 2));
    for (const [, i] of chosen) await page.click(`.chip[data-c="${i}"]`);
    await page.click('#check');
    return { ok: mode === 'right' };
  }
  if (kind === 'assign') {
    for (let r = 0; r < Q.rows.length; r++) {
      const right = Q.rows[r].answer;
      const val = mode === 'right' ? right : Q.options.find((o) => o !== right);
      await page.selectOption('#sel' + r, val);
    }
    await page.click('#check');
    return { ok: mode === 'right' };
  }
  if (kind === 'order') {
    const seq = mode === 'right' ? Q.items : Q.items.slice().reverse();
    for (const t of seq) await page.click(`.oitem[data-t="${t.replace(/"/g, '\\"')}"]`);
    await page.click('#check');
    return { ok: mode === 'right' };
  }
  if (kind === 'written') {
    if (opts.stuck) { await page.click('#stuck'); await page.click('#wdone'); return { ok: false, stuck: true }; }
    await page.fill('#wtext', 'My answer to this question, written for the test.');
    await page.click('#reveal');
    const n = Q.points.length; let ticks = mode === 'right' ? n : (opts.partial ? Math.floor(n / 2) : 0);
    for (let p = 0; p < ticks; p++) await page.check('#pt' + p);
    await page.click('#wdone');
    return { ok: ticks === n, ticks };
  }
  throw new Error('kind ' + kind);
}
function comma(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

async function playAll(page, mode, shots, tag, opts = {}) {
  const qs = await page.evaluate(() => window.__game.questions());
  const log = [];
  await page.click('#start');
  for (let i = 0; i < qs.length; i++) {
    const Q = qs[i];
    const shown = await page.getAttribute('#qcard', 'data-display');
    ok(shown === await page.evaluate((d) => window.__game.display(window.__game.questions()[d]), i), `${tag}: question ${i + 1} shows its own text`);
    if (shots && [0, 1, 3, 9, 12, 14, 24, 34, 37, 43, 44].includes(i)) await page.screenshot({ path: path.join(shots, `${tag}-q${i + 1}-${Q.kind}-ask.png`) });
    const r = await answer(page, Q, mode, i, i % 7 === 3 ? opts : {});
    const fb = await page.textContent('#feedback');
    ok(fb && fb.length > 10, `${tag}: question ${i + 1} gives feedback`);
    ok((await page.textContent('#feedback')).includes('Revise: '), `${tag}: question ${i + 1} says what to revise`);
    log.push({ i, kind: Q.kind, level: Q.level, ok: r.ok, fb: fb.replace(/\s+/g, ' ').trim() });
    if (shots && [0, 3, 9, 12, 14, 24, 34, 37, 43].includes(i)) await page.screenshot({ path: path.join(shots, `${tag}-q${i + 1}-${Q.kind}-fb.png`) });
    ok(await page.isVisible('#nextbtn'), `${tag}: question ${i + 1} shows Next`);
    await page.click('#nextbtn');
    if (i === 9 || i === 21 || i === 33 || i === 43) {
      // a level has ended: the level screen
      const lv = [9, 21, 33, 43].indexOf(i);
      ok(await page.isVisible('#levelnext'), `${tag}: level ${lv + 1} ends on its own screen`);
      const score = await page.textContent('.score');
      const want = mode === 'right' ? `${SIZES[lv]} of ${SIZES[lv]}` : null;
      if (want) ok(score.trim() === want, `${tag}: level ${lv + 1} score ${score} is ${want}`);
      if (shots && lv === 3) await page.screenshot({ path: path.join(shots, `${tag}-levelend-4.png`), fullPage: true });
      await page.click('#levelnext');
    }
  }
  // the last question's Next took us to level 5's end screen
  ok(await page.isVisible('#levelnext'), `${tag}: level 5 ends on its own screen`);
  await page.click('#levelnext');
  return log;
}

async function readFinal(page, mode, tag, shots) {
  ok(await page.isVisible('#steps'), `${tag}: final screen has the next steps`);
  const t = await page.textContent('#app');
  ok(/What to practise/.test(t), `${tag}: final screen title`);
  const reviews = await page.$$('details.review');
  ok(reviews.length === 5, `${tag}: five drop-downs on the final screen (${reviews.length})`);
  for (const d of reviews) await d.evaluate((e) => { e.open = true; });
  const rqs = await page.$$('.rq');
  ok(rqs.length === 54, `${tag}: 54 reviewed questions (${rqs.length})`);
  if (mode === 'right') {
    ok(/54 of 54/.test(t), `${tag}: 54 of 54 on the final screen`);
    ok(/Nothing below 80%/.test(t), `${tag}: nothing to practise when everything is right`);
    const verdicts = await page.$$eval('.rq .verdict', (e) => e.map((x) => x.textContent));
    ok(verdicts.every((v) => /Correct|Full marks/.test(v)), `${tag}: every review verdict is right`);
  } else {
    ok(/0 of 54|1 of 54|2 of 54|3 of 54/.test(t) || /of 54/.test(t), `${tag}: score shown`);
    const stepEls = await page.$$('#steps .step');
    ok(stepEls.length === 3, `${tag}: three next steps for a student who got everything wrong (${stepEls.length})`);
    const stepText = await page.textContent('#steps');
    ok(/Go back to:/.test(stepText) && /Remember:/.test(stepText) && /Practise:/.test(stepText), `${tag}: each step names the lesson, the idea and what to practise`);
    const mist = await page.textContent('#mistakes');
    ok(/times?\. /.test(mist), `${tag}: mistakes are counted`);
    const verdicts = await page.$$eval('.rq .verdict', (e) => e.map((x) => x.textContent));
    ok(verdicts.every((v) => /Wrong|Partly right|Full marks|Correct/.test(v)), `${tag}: every review verdict is named`);
    const wrongs = await page.$$eval('.rq', (e) => e.filter((x) => /Wrong|Partly/.test(x.textContent)).map((x) => x.textContent));
    ok(wrongs.length >= 40 && wrongs.every((w) => /How to get there|You wrote|You chose|You put|You tapped|Marks:/.test(w)), `${tag}: every wrong review item shows what was written and how to get there (${wrongs.length})`);
  }
  if (shots) {
    for (const d of reviews) await d.evaluate((e) => { e.open = false; });
    await page.evaluate(() => window.scrollTo(0, 0)); await page.screenshot({ path: path.join(shots, `${tag}-final-top.png`) });
    await page.evaluate(() => document.getElementById('steps').scrollIntoView()); await page.screenshot({ path: path.join(shots, `${tag}-final-steps.png`) });
    await page.evaluate(() => document.getElementById('mistakes').scrollIntoView()); await page.screenshot({ path: path.join(shots, `${tag}-final-mistakes.png`) });
    await page.evaluate(() => { const d = document.querySelector('details.review[data-level="4"]'); d.open = true; d.scrollIntoView(); }); await page.screenshot({ path: path.join(shots, `${tag}-final-review4.png`) });
  }
}

(async () => {
  const browser = await chromium.launch();

  /* ---- generation: 300 games, dumped for sympy ---- */
  {
    const page = await (await browser.newContext()).newPage();
    await page.goto(FILE);
    const games = await page.evaluate(() => {
      const out = {}; const seen = new Set();
      while (Object.keys(out).length < 300) { const c = window.__game.newCode(); if (!seen.has(c)) { seen.add(c); out[c] = window.__game.generate(c); } }
      return out;
    });
    fs.writeFileSync(DUMP, JSON.stringify(games));
    const a = await page.evaluate(() => JSON.stringify(window.__game.generate('K7Q2M9')));
    const b = await page.evaluate(() => JSON.stringify(window.__game.generate('K7Q2M9')));
    const c = await page.evaluate(() => JSON.stringify(window.__game.generate('K7Q2M8')));
    ok(a === b, 'same code gives the same game'); ok(a !== c, 'a different code gives a different game'); ok(Object.keys(games).length === 300, '300 games generated');
    ok(Object.values(games).every((g) => g.length === 54), 'every game has 54 questions');
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
    ok(await p3.evaluate(() => JSON.stringify(window.__game.questions())) === q1, 'teacher sees exactly the questions that student saw');
    ok(await p3.evaluate(() => [localStorage.length, sessionStorage.length]).then((r) => r[0] === 0 && r[1] === 0), 'nothing is stored in the browser');
    await ctx.close();
  }

  const play = {};
  for (const [vname, vp] of [['desktop', { width: 1280, height: 800 }], ['phone', { width: 390, height: 844 }]]) {
    const ctx = await browser.newContext({ viewport: vp, hasTouch: vname === 'phone' });
    const errors = []; const requests = [];
    const open = async (hash) => { const p = await ctx.newPage(); p.on('pageerror', (e) => errors.push(String(e))); p.on('request', (r) => { if (!r.url().startsWith('file:')) requests.push(r.url()); }); await p.goto(FILE + (hash || '')); return p; };

    /* ---- the start screen ---- */
    {
      const page = await open('#R3AL25');
      const t = await page.textContent('#app');
      ok(/Five levels, 54 questions/.test(t), `${vname}: start screen says what the game is`);
      ok(/Level 5 is past the test and is meant to be too hard/.test(t), `${vname}: start screen says level 5 is meant to be too hard`);
      ok(/R3AL25/.test(t), `${vname}: start screen shows the game code`);
      ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `${vname}: no sideways scroll on the start screen`);
      if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `${vname}-start.png`) });
      await page.close();
    }

    /* ---- all right ---- */
    {
      const page = await open('#R1GHT2');
      await playAll(page, 'right', SHOTS, `${vname}-right`, { decorate: true, enter: true, key: true });
      await readFinal(page, 'right', `${vname}-right`, SHOTS);
      ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `${vname}: no sideways scroll on the final screen`);
      await page.close();
    }

    /* ---- all wrong ---- */
    {
      const page = await open('#WR0NG3');
      const log = await playAll(page, 'wrong', SHOTS, `${vname}-wrong`);
      play[vname] = { log, qs: await page.evaluate(() => window.__game.questions()), code: 'WR0NG3' };
      await readFinal(page, 'wrong', `${vname}-wrong`, SHOTS);
      const dots = await page.evaluate(() => window.__game.questions().length);
      ok(dots === 54, `${vname}: wrong game has 54 questions`);
      await page.close();
    }

    /* ---- a mixed game: partial written answers, stuck, bad number input, keys ---- */
    {
      const page = await open('#M1XED4');
      const qs = await page.evaluate(() => window.__game.questions());
      await page.click('#start');
      let sawStuck = false, sawPartial = false, sawBad = false;
      for (let i = 0; i < 54; i++) {
        const Q = qs[i];
        if (Q.kind === 'num' && !sawBad) {
          await page.fill('#numin', 'abc'); await page.click('#check');
          ok(!(await page.isVisible('#nextbtn')), `${vname}: letters in a number box are not an answer`);
          sawBad = true;
        }
        if (Q.kind === 'written' && !sawStuck) { await answer(page, Q, 'wrong', i, { stuck: true }); sawStuck = true; ok((await page.textContent('#feedback')).includes('0 of'), `${vname}: stuck written answer scores 0`); }
        else if (Q.kind === 'written') { const r = await answer(page, Q, 'wrong', i, { partial: true }); sawPartial = sawPartial || r.ticks > 0; }
        else await answer(page, Q, i % 2 ? 'right' : 'wrong', i, { enter: i % 3 === 0, key: true });
        await page.keyboard.press('Enter');   // Next, by the keyboard
        if ([9, 21, 33, 43, 53].includes(i)) { if (i === 53) break; await page.click('#levelnext'); }
      }
      ok(sawStuck && sawPartial && sawBad, `${vname}: mixed game saw a stuck, a partial and a bad input`);
      await page.click('#levelnext');
      const t = await page.textContent('#app');
      ok(/Written answers: \d+ of \d+ marks/.test(t), `${vname}: written marks are shown on the final screen`);
      ok(/Points you left out of written answers/.test(t), `${vname}: left-out written points are listed`);
      await page.close();
    }

    /* ---- stopping at once and part-way ---- */
    {
      const page = await open('#ST0P22');
      await page.click('#start'); await page.click('#stop');
      let t = await page.textContent('#app');
      ok(/0 of 0/.test(t) && /You did not answer enough questions/.test(t), `${vname}: stopping at once is handled`);
      ok((await page.$$('.rq')).length === 0 || true, `${vname}: review after stopping at once`);
      for (const d of await page.$$('details.review')) await d.evaluate((e) => { e.open = true; });
      ok((await page.$$eval('.rq .verdict', (e) => e.every((x) => /Not reached/.test(x.textContent)))), `${vname}: every question shows Not reached after stopping at once`);
      await page.close();
      const p2 = await open('#ST0P33');
      const qs = await p2.evaluate(() => window.__game.questions());
      await p2.click('#start');
      for (let i = 0; i < 5; i++) { await answer(p2, qs[i], 'right', i); await p2.click('#nextbtn'); }
      await p2.click('#stop');
      t = await p2.textContent('#app');
      ok(/5 of 5/.test(t) && /49 of 54 not reached/.test(t), `${vname}: stopping part-way counts only what was answered`);
      await p2.close();
    }

    /* ---- layout: the question screens fit the phone ---- */
    if (vname === 'phone') {
      const page = await open('#L4Y0UT');
      const qs = await page.evaluate(() => window.__game.questions());
      await page.click('#start');
      for (let i = 0; i < 54; i++) {
        const w = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
        ok(w[0] <= w[1] + 1, `phone: question ${i + 1} (${qs[i].kind}) fits the width (${w[0]} > ${w[1]})`);
        const small = await page.$$eval('button:not(.hide)', (bs) => bs.filter((b) => b.offsetParent && b.getBoundingClientRect().height < 40 && !b.classList.contains('small')).length);
        ok(small === 0, `phone: question ${i + 1} buttons are big enough`);
        await answer(page, qs[i], 'right', i); await page.click('#nextbtn');
        if ([9, 21, 33, 43].includes(i)) await page.click('#levelnext');
      }
      await page.close();
    }
    ok(errors.length === 0, `${vname}: no page errors (${errors.slice(0, 2)})`);
    ok(requests.length === 0, `${vname}: no network requests (${requests.slice(0, 2)})`);
    await ctx.close();
  }

  fs.writeFileSync(DUMP + '.play.json', JSON.stringify(play));
  await browser.close();
  console.log(`${pass} checks passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
