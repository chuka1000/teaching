#!/usr/bin/env python3
"""
Independent check of the Number line game's generated questions (Deep Time, 8I). The browser dumps N generated games (JSON, from
build/test-deep-time-game.js); this script re-derives, from build/deep-time.data.json and the rules written out again here (not from the game):

  - the skill, scale, tolerance and pool of every slot (the same for every student), and that round 1 always holds the brief's five events;
  - every answer, with sympy: a date where it is; a clock time from (age - date) / age of the day; the last hour and the last minute; the halfway point;
  - every named mistake and its value (counting forwards from the left end; millions for billions; after midnight for before; the event for the
    halfway point), that EVERY eligible mistake is offered, and that no mistake's band touches the right answer's band;
  - the ticks (in order, labelled with their own values) and the eras behind them;
  - that the working shown contains the answer, and that games differ.

    python3 build/check-deep-time-game.py games.json
"""
import json, pathlib, sys
from collections import Counter
from sympy import Rational as R, nsimplify

HERE = pathlib.Path(__file__).parent
D = json.loads((HERE / 'deep-time.data.json').read_text())
games = json.load(open(sys.argv[1]))
AGE = D['earth_age']
MYA = {k: nsimplify(v[1]) for k, v in D['events'].items()}
MYA['permian'] = nsimplify(D['extinctions'][2][1])
LABEL = {k: v[0] for k, v in D['events'].items()}
checks = 0
def fail(msg): print('FAIL:', msg); sys.exit(1)
def ok(cond, msg):
    global checks
    if not cond: fail(msg)
    checks += 1
close = lambda a, b: abs(float(a) - float(b)) < 1e-9

BRIEF = {'life', 'plants', 'dinosaurs', 'asteroid', 'humans'}
SLOT = {  # slot: (category, kind, (L, R) or None for the zoom, tolerance rule, pool)
    **{s: ('full', 'mya', (AGE, 0), lambda L: R(L) * R(5, 100), None) for s in range(1, 7)},
    **{s: ('zoom', 'mya', None, lambda L: R(L) * R(4, 100), {'fish', 'plants', 'tetrapods', 'permian', 'dinosaurs', 'mammals', 'birds', 'flowers', 'asteroid'}) for s in range(7, 13)},
    13: ('full', 'mya', (AGE, 0), lambda L: R(L) * R(3, 100), {'life', 'oxygen', 'animals', 'plants', 'fish'}),
    14: ('zoom', 'mya', (10, 0), lambda L: R(4, 10), {'panama', 'finches'}),
    15: ('clock', 'clock', (0, 1440), lambda L: 30, {'life', 'oxygen', 'animals', 'plants', 'dinosaurs'}),
    16: ('clock', 'hour', (0, 60), lambda L: 3, {'birds', 'flowers', 'asteroid'}),
    17: ('hard', 'minute', (0, 60), lambda L: 3, {'humans', 'panama', 'finches'}),
    18: ('hard', 'half', (0, 60), lambda L: 3, {'dinosaurs', 'birds', 'flowers', 'asteroid'}),
}

def answer(kind, t):
    """The right value on the question's own scale, exactly."""
    if kind == 'mya': return t
    if kind == 'clock': return 1440 - t / AGE * 1440            # minutes after midnight
    if kind == 'hour': return 60 - t / AGE * 1440               # minutes after 23:00
    if kind == 'minute': return 60 - t / AGE * 86400            # seconds after 23:59:00
    if kind == 'half': return 60 - (t / 2) / AGE * 1440         # minutes after 23:00, halfway between t and now
def expected_mistakes(kind, t, L, Rr, tol, v):
    cand = []
    if kind == 'mya':
        cand.append(('forward', L - t))
        if t >= 1000: cand.append(('units', t / 1000))
    elif kind == 'clock': cand.append(('after', t / AGE * 1440))
    elif kind == 'hour': cand.append(('after', t / AGE * 1440))
    elif kind == 'minute': cand.append(('after', t / AGE * 86400))
    elif kind == 'half': cand += [('nohalf', 60 - t / AGE * 1440), ('after', (t / 2) / AGE * 1440)]
    lo, hi = min(L, Rr), max(L, Rr)
    kept = []
    for tag, m in cand:   # in order: inside the line, clear of the answer, clear of every mistake already kept
        if lo <= m <= hi and abs(m - v) > 2 * tol and all(abs(m - k) > 2 * tol for _, k in kept): kept.append((tag, m))
    return kept
def hhmm(minutes):
    m = int(round(float(minutes))); return '24:00' if m >= 1440 else f'{m // 60:02d}:{m % 60:02d}'

signatures, r1orders, zooms = Counter(), Counter(), Counter()
for code, qs in games.items():
    W = f'game {code}'
    ok(len(qs) == 18 and [q['slot'] for q in qs] == list(range(1, 19)) and [q['round'] for q in qs] == [1] * 6 + [2] * 6 + [3] * 6, f'{W}: 18 questions, 3 rounds')
    signatures[' || '.join(q['prompt'] for q in qs)] += 1
    r1 = [q['key'] for q in qs[:6]]
    r1orders[tuple(r1)] += 1
    ok(BRIEF <= set(r1) and len(set(r1)) == 6 and (set(r1) - BRIEF) <= {'oxygen', 'animals', 'fish'}, f'{W}: round 1 holds the brief\'s five events and one more ({r1})')
    r2 = [q['key'] for q in qs[6:12]]
    ok(len(set(r2)) == 6, f'{W}: six different events in round 2')
    ok(len({q['scale']['L'] for q in qs[6:12]}) == 1 and qs[6]['scale']['L'] in (600, 650, 700), f'{W}: one zoom for all of round 2 (600, 650 or 700)')
    zooms[qs[6]['scale']['L']] += 1
    ok(qs[16]['key'] != qs[13]['key'], f'{W}: the last minute does not repeat the 10-million-year event')
    for q in qs:
        s = q['slot']; where = f"{W} Q{s} ({q['kind']} {q['key']})"
        cat, kind, LR, tolrule, pool = SLOT[s]
        sc = q['scale']
        L, Rr = (sc['L'], sc['R'])
        ok(q['cat'] == cat and q['kind'] == kind, f'{where}: slot {s} is {cat}/{kind}')
        if LR: ok((L, Rr) == LR, f'{where}: the scale runs {LR}')
        else: ok(Rr == 0 and L in (600, 650, 700), f'{where}: a zoom from 600, 650 or 700 to now')
        tol = tolrule(L)
        ok(close(sc['tol'], tol), f'{where}: tolerance {tol}')
        if pool: ok(q['key'] in pool, f'{where}: the event is from the slot\'s pool')
        ok(q['bands'] == (s <= 12), f'{where}: eras shown in rounds 1 and 2 only')
        t = MYA[q['key']]
        ok(close(q['mya'], t), f'{where}: the date is the data\'s ({t})')
        v = answer(kind, t)
        ok(close(q['value'], v), f'{where}: the answer is {float(v)}')
        lo, hi = min(L, Rr), max(L, Rr)
        ok(lo <= v <= hi, f'{where}: the answer is on the line')
        # the mistakes: exactly the eligible ones, each clear of the answer's band
        got = sorted((m['tag'], round(float(m['value']), 9)) for m in q['mistakes'])
        want = sorted((tag, round(float(m), 9)) for tag, m in expected_mistakes(kind, t, L, Rr, tol, v))
        ok(got == want, f'{where}: the named mistakes {got} are {want}')
        ok(all(m['msg'].strip() and m['how'].strip() and abs(m['value'] - float(v)) > 2 * float(tol) for m in q['mistakes']), f'{where}: every mistake is named, has its sum, and is clear of the answer')
        ok(all(abs(a['value'] - b['value']) > 2 * float(tol) for i_, a in enumerate(q['mistakes']) for b in q['mistakes'][i_ + 1:]), f'{where}: no two mistakes overlap')
        # the ticks: in order along the line, each labelled with its own value
        ticks = sc['ticks']
        posn = [(x - L) / (Rr - L) for x, _ in ticks]
        ok(posn == sorted(posn) and posn[0] == 0 and posn[-1] == 1, f'{where}: the ticks run from one end to the other')
        for x, lab in ticks:
            if kind == 'mya': ok(lab == ('now' if x == 0 else f'{x:,}'), f'{where}: tick {x} labelled {lab}')
            elif kind == 'clock': ok(lab == hhmm(x), f'{where}: clock tick {x} labelled {lab}')
            elif kind in ('hour', 'half'): ok(lab == hhmm(1380 + x), f'{where}: last-hour tick {x} labelled {lab}')
            else: ok(lab in ('23:59:00', ':20', ':40', '24:00:00'), f'{where}: last-minute tick labelled {lab}')
        # the working contains the answer
        ex = ' '.join(q['explain'])
        if kind == 'mya': ok(f"{float(t):g}" in ex.replace(',', ''), f'{where}: the working names the date')
        elif kind == 'clock': ok(hhmm(v) in ex, f'{where}: the working ends on {hhmm(v)}')
        elif kind in ('hour', 'half'): ok(hhmm(1380 + v) in ex, f'{where}: the working ends on {hhmm(1380 + v)}')
        else:
            sec = int(round(float(86340 + v))); want_t = f'{sec // 3600:02d}:{sec % 3600 // 60:02d}:{sec % 60:02d}'
            ok(want_t in ex, f'{where}: the working ends on {want_t}')
        ok(f"{float(t):g}" in q['prompt'].replace(',', ''), f'{where}: the prompt gives the date')

ok(len(signatures) == len(games), f'every game is different ({len(signatures)} of {len(games)})')
ok(len(r1orders) > len(games) // 2, 'round 1\'s order varies')
ok(set(zooms) == {600, 650, 700}, f'all three zooms occur {dict(zooms)}')

# sympy spot checks of the clock times the game teaches
ok(hhmm(answer('clock', R(575))) == '21:00' and hhmm(answer('clock', R(230))) == '22:48' and hhmm(1380 + answer('hour', R(66))) == '23:39', 'clock: first animals 21:00, dinosaurs 22:48, asteroid 23:39')
ok(round(float(answer('minute', R(3, 10))), 2) == 54.37, 'last minute: first humans at 23:59:54.4')
ok(hhmm(1380 + answer('half', R(230))) == '23:24', 'halfway to the first dinosaurs: 23:24')
print(f'{len(games)} games, {checks} checks passed')
