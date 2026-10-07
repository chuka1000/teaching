#!/usr/bin/env python3
"""
Independent check of the Sequencer game's generated questions (The Greatest Show On Earth, 8I). The browser dumps N generated games (JSON, from
build/test-the-greatest-show-on-earth-game.js); this script re-derives, from the DATA each question kept:

  - every SEQUENCE question's accepted orders, from a table of "this step must come before that one" written out again here (not from the
    game's own lists): the accepted orders must be exactly the orders that obey every rule. That proves the 6-step order is the only one, and
    that the 8-step questions accept exactly the two orders that differ in "gene flow stops" and "different conditions";
  - every card's text against the example it belongs to (the organism, the place, the barrier, the conditions, the selection), and every card
    that does not belong against its mistake;
  - every multiple-choice answer: the next step, the missing step, the step in the wrong place (recomputed: exactly one card can be moved to
    restore the order), the breeding test, and the family tree of three splits (recomputed from its names and times);
  - the skills and their order (the same for every student), the categories, four options with exactly one right, every wrong option named;
  - that no cue gives an answer away (the position of the right option, and whether it is the longest), and that games differ.

    python3 build/check-the-greatest-show-on-earth-game.py games.json
"""
import json, sys, itertools
from collections import Counter, defaultdict

games = json.load(open(sys.argv[1]))
checks = 0
def fail(msg): print('FAIL:', msg); sys.exit(1)
def ok(cond, msg):
    global checks
    if not cond: fail(msg)
    checks += 1

# ---- the process, written out again ----
ROLES6 = ['one', 'barrier', 'cond', 'sel', 'build', 'split']
ROLES8 = ['one', 'barrier', 'geneflow', 'cond', 'sel', 'build', 'differ', 'split']
BEFORE = [('one', 'barrier'), ('barrier', 'geneflow'), ('barrier', 'cond'), ('geneflow', 'sel'), ('cond', 'sel'), ('sel', 'build'),
          ('build', 'differ'), ('build', 'split'), ('differ', 'split')]
# transitive closure, so that a slice such as cond, sel, build, split keeps every rule between its members
closure = set(BEFORE)
while True:
    extra = {(a, d) for (a, b) in closure for (c, d) in closure if b == c} - closure
    if not extra: break
    closure |= extra
def valid_orders(roles):
    return {tuple(p) for p in itertools.permutations(roles) if all(p.index(a) < p.index(b) for (a, b) in closure if a in p and b in p)}

LABEL = {'one': 'One population, one gene pool', 'barrier': 'A barrier splits it in two', 'geneflow': 'Gene flow stops', 'cond': 'Different conditions on each side',
         'sel': 'Different natural selection in each group', 'build': 'Differences build up over many generations',
         'differ': 'The groups differ in looks, behaviour, breeding time or genes', 'split': 'They can no longer interbreed'}
PHRASE = {'one': 'One population of', 'barrier': 'A barrier forms:', 'geneflow': 'Gene flow between the two groups stops', 'cond': 'live in different conditions:',
          'sel': 'Natural selection works differently in each group:', 'build': 'differences build up in the two gene pools',
          'differ': 'After all those generations', 'split': 'can no longer interbreed'}
SCEN = {  # id: (organism, place, barrier, conditions, selection, real)
    'finches': ('finches', 'on one island of the Galápagos', 'some finches cross the sea', 'big, hard seeds', 'deep beaks survive', True),
    'shrimp': ('snapping shrimp', 'along the coast of Central America', 'the land of Panama rises', 'warm, clear water', 'help the shrimp survive', True),
    'beetles': ('beetles', 'in one valley', 'a lava flow', 'hot and dry', 'dark shells survive', False),
    'mice': ('mice', 'on a long peninsula', 'the sea rises', 'cold and windy', 'thick fur helps', False),
    'frogs': ('frogs', 'in one rainforest', 'a river changes course', 'deep shade', 'green skin survives', False),
    'fish': ('fish', 'in one large lake', 'the water level falls', 'salty water', 'coping with salt', False),
    'snails': ('snails', 'on one wide hillside', 'a new mountain ridge', 'bare, windy rock', 'thick shells survive', False),
    'flowers': ('flowering plants', 'across one meadow', 'a wide new road', 'many bees', 'bright petals', False),
}
SPEC = {'one': 1, 'barrier': 2, 'cond': 3, 'sel': 4}   # which SCEN field a step's text must carry (1 = place; organism is checked on 'one')
DIS = {'x_lamarck': ('lamarck', 'changes its own body'), 'x_onegen': ('onegen', 'A single mutation turns one of the'), 'x_choose': ('choose', 'decide to stop breeding'),
       'x_stillbreed': ('stillbreed', 'breeding together all the time'), 'x_needs': ('lamarck', 'change because they need to'), 'x_instant': ('instant', 'are two species at once')}
def step_ok(role, text, sc):
    s = SCEN[sc]
    if PHRASE[role] not in text: return False
    if role == 'one' and (s[0] not in text or s[1] not in text): return False
    if role in SPEC and role != 'one' and s[SPEC[role]] not in text: return False
    return True

# ---- the plan: the skill in every slot, the same for everyone ----
SLOT = [('order', {'order4'}), ('species', {'speciesDef', 'speciationDef'}), ('order', {'order6'}), ('species', {'speciesPair'}), ('steps', {'nextStep'}), ('order', {'order6'}),
        ('steps', {'missingStep'}), ('order', {'order6dis'}), ('reasons', {'whyNoInterbreed'}), ('steps', {'wrongPlace'}), ('ancestors', {'arches', 'arches2'}), ('order', {'order6dis'}),
        ('order', {'order8'}), ('reasons', {'barrierGone'}), ('reasons', {'timeTrap'}), ('species', {'squirrels', 'whichIsSpeciation'}), ('order', {'orderHard2'}),
        ('puzzle', {'splitsClosest', 'splitsOldest', 'splitsTrue'})]
NDIS = {'order4': 0, 'order6': 0, 'order8': 0, 'order6dis': 1, 'orderHard2': 2}
TAGS = set('nobarrier selbeforecond instant notfirst buildfirst order lamarck onegen choose stillbreed lookalike sameplace nofertile lifetime extinct hybrid sterile noyoung nohatch '
           'repeat skip notmoved distance turnfish coincidence gills sepisspecies sepnobreed anyway few lookdiff timeisall dna notyet regrow fromfish equal ancestor backwards '
           'oldsplit newerpair'.split())
RIGHT_PAIRS = ['a poodle and a labrador, whose puppies can have puppies', 'two groups of oak trees whose seeds grow into oaks that can make seeds',
               'a collie and a spaniel, whose puppies can breed', 'a tabby cat and a Siamese cat, whose kittens can breed']
WRONG_PAIRS = ['a horse and a donkey, whose young, a mule, cannot have young', 'a cat and a dog, which cannot have young together at all',
               'two groups of beetles that mate, but whose eggs never hatch', 'two groups of fish that mate, but whose young are all sterile']
cap = lambda s: s[0].upper() + s[1:] + '.'

# ---- the family tree, recomputed from its names and times ----
def tree_facts(T):
    p, q, r, s, t, u = (T[k] for k in 'pqrstu')
    ok(T['t1'] > T['t2'] > T['t3'] > 0, f'tree times fall: {T}')
    ok(len({p, q, r, s, t, u}) == 6 and not {p, q, r, s, t, u} & set('ABCD'), f'six different species letters, none of them an option letter: {T}')
    parent = {p: 'root', q: 'root', r: q, s: q, t: s, u: s}
    def line(x):
        out = [x]
        while out[-1] in parent: out.append(parent[out[-1]])
        return out
    def mrca_time(a, b):
        la, lb = line(a), line(b)
        anc = next(x for x in la if x in lb and x != a and x != b)
        return {'root': T['t1'], q: T['t2'], s: T['t3']}[anc]
    alive = [p, r, t, u]
    return line, mrca_time, alive

opt_pos = defaultdict(Counter); longest = defaultdict(Counter); signatures = Counter(); scen_use = Counter(); kinds = Counter()
for code, qs in games.items():
    W = f'game {code}'
    ok(len(qs) == 18 and [q['round'] for q in qs] == [1] * 6 + [2] * 6 + [3] * 6 and [q['n'] for q in qs] == list(range(1, 7)) * 3, f'{W}: 18 questions in 3 rounds of 6')
    signatures[' || '.join(q['disp'] for q in qs)] += 1
    used = []
    for i, q in enumerate(qs):
        where = f"{W} Q{i + 1} ({q['kind']})"
        cat, allowed = SLOT[i]
        ok(q['cat'] == cat and q['kind'] in allowed, f'{where}: the slot is {cat} {sorted(allowed)}')
        kinds[(i + 1, q['kind'])] += 1
        ok(isinstance(q.get('explain'), list) and len(q['explain']) >= 1 and all(isinstance(x, str) and x.strip() for x in q['explain']), f'{where}: has the working / reasons')
        if 'scen' in q:
            ok(q['scen'] in SCEN and q['real'] == SCEN[q['scen']][5], f'{where}: a known example, real or invented as recorded')
            ok(('invented' in q['scenName']) != q['real'], f'{where}: the example says whether it is real or invented')
            used.append(q['scen'])

        if q['cat'] == 'order':
            roles = q['roles']
            if q['kind'] == 'order4':
                ok(any(roles == ROLES6[s:s + 4] for s in range(3)), f'{where}: four consecutive steps of the six')
            elif q['kind'] in ('order6', 'order6dis'):
                ok(roles == ROLES6, f'{where}: the six steps')
            else:
                ok(roles == ROLES8, f'{where}: the eight steps')
            ok(q['correct'] == roles, f'{where}: the model order is the steps in order')
            ok({tuple(a) for a in q['accept']} == valid_orders(roles) and len(q['accept']) == len(valid_orders(roles)), f'{where}: the accepted orders are exactly the orders that obey every rule ({len(valid_orders(roles))})')
            ok(len(q['accept']) == (2 if len(roles) == 8 else 1), f'{where}: one accepted order, or two for the eight steps')
            nd = NDIS[q['kind']]
            ok(len(q['distract']) == nd and len({DIS[d][0] for d in q['distract']}) == nd, f'{where}: {nd} card(s) that do not belong, each a different mistake')
            ids = [c['id'] for c in q['cards']]
            ok(sorted(ids) == sorted(roles + q['distract']) and len(set(ids)) == len(ids), f'{where}: the cards are the steps plus the cards that do not belong')
            ok(len({c['text'] for c in q['cards']}) == len(ids), f'{where}: no two cards say the same')
            for c in q['cards']:
                if c['id'] in DIS:
                    ok(DIS[c['id']][1] in c['text'] and SCEN[q['scen']][0] in c['text'], f'{where}: the card that does not belong is about this example and says its mistake: {c["text"]}')
                else:
                    ok(step_ok(c['id'], c['text'], q['scen']) and c['label'] == LABEL[c['id']], f'{where}: the card for "{c["id"]}" fits the example: {c["text"]}')
            ok(len(q['explain']) == len(roles) + (1 if len(q['accept']) > 1 else 0) and all(q['explain'][k].startswith(f'{k + 1}. {LABEL[r]}.') for k, r in enumerate(roles)),
               f'{where}: the explanation gives every step and its reason')
            continue

        # ---- multiple choice ----
        opts, ci = q['options'], q['correctIndex']
        texts = [o['text'] for o in opts]
        ok(len(opts) == 4 and len(set(texts)) == 4 and 0 <= ci < 4, f'{where}: four different options')
        ok(opts[ci]['tag'] is None and all(o['tag'] in TAGS and o['msg'].strip() for k, o in enumerate(opts) if k != ci), f'{where}: one right option, every wrong one named and explained')
        right, wrongs = texts[ci], [t for k, t in enumerate(texts) if k != ci]
        opt_pos[q['kind']][ci] += 1
        longest[q['kind']]['n'] += 1
        if len(right) > max(len(w) for w in wrongs): longest[q['kind']]['right longest'] += 1
        k = q['kind']
        if k == 'speciesDef':
            ok(right == 'A group of living things that can breed together and produce fertile offspring.' and not any('fertile' in w for w in wrongs), f'{where}: the definition needs fertile offspring')
        elif k == 'speciationDef':
            ok(right == 'The formation of a new species from an existing one.', f'{where}: speciation defined')
        elif k == 'speciesPair':
            ok(right in [cap(x) for x in RIGHT_PAIRS] and all(w in [cap(x) for x in WRONG_PAIRS] for w in wrongs) and q['right'] in RIGHT_PAIRS, f'{where}: the one pair with fertile young is the right one')
        elif k == 'nextStep':
            kk = len(q['shownRoles'])
            ok(2 <= kk <= 4 and q['shownRoles'] == ROLES6[:kk] and q['nextRole'] == ROLES6[kk] and right == LABEL[ROLES6[kk]], f'{where}: the next step after {kk} steps')
            ok(all(step_ok(r, s, q['scen']) for r, s in zip(q['shownRoles'], q['shown'])), f'{where}: the steps shown fit the example')
            inv = {v: r for r, v in LABEL.items()}
            for o in opts:
                if o['tag'] is None: continue
                r = inv.get(o['text'])
                ok(r in ROLES6 and r != q['nextRole'] and o['tag'] == ('repeat' if r in q['shownRoles'] else 'skip'), f'{where}: a wrong option is a step already done (repeat) or a later one (skip)')
        elif k == 'missingStep':
            g = q['gap']
            ok(1 <= g <= 4 and q['removedRole'] == ROLES6[g] and q['shown'][g] is None, f'{where}: the gap is a middle step')
            ok(all(step_ok(r, s, q['scen']) for j, (r, s) in enumerate(zip(ROLES6, q['shown'])) if j != g), f'{where}: the other steps are shown in order and fit the example')
            ok(step_ok(q['removedRole'], right, q['scen']), f'{where}: the right option is the missing step for this example')
            tags = [o['tag'] for o in opts if o['tag']]
            ok(len(set(tags)) == 3 and all(any(DIS[d][1] in w for d in DIS) and SCEN[q['scen']][0] in w for w in wrongs), f'{where}: the wrong options are three different mistakes about this example')
        elif k == 'wrongPlace':
            seq = q['seqRoles']
            ok(sorted(seq) == sorted(ROLES6) and seq != ROLES6, f'{where}: a jumbled order of the six steps')
            fixers = set()
            for e in range(6):
                rest = seq[:e] + seq[e + 1:]
                if any(rest[:p] + [seq[e]] + rest[p:] == ROLES6 for p in range(6)): fixers.add(seq[e])
            ok(fixers == {q['movedRole']} and right == LABEL[q['movedRole']], f'{where}: exactly one step can be moved to fix the order, and it is the answer ({fixers})')
            ok(abs(ROLES6.index(q['movedRole']) - seq.index(q['movedRole'])) >= 2, f'{where}: the step is at least two places out')
            ok(q['shown'] == [LABEL[r] for r in seq] and all(o['tag'] == 'notmoved' and o['text'] in LABEL.values() for o in opts if o['tag']), f'{where}: the options are steps that are in the right place')
        elif k == 'whyNoInterbreed':
            ok(right.startswith('Differences built up') and 'sterile' in right, f'{where}: the differences built up')
        elif k in ('arches', 'arches2'):
            ok('ancestor' in right and 'kept' in right and not any('ancestor had' in w for w in wrongs), f'{where}: inherited from a shared ancestor')
        elif k == 'barrierGone':
            ok('stay one species' in right and 'gene pools mix' in right, f'{where}: they mix again')
        elif k == 'timeTrap':
            ok(right.startswith('Many generations'), f'{where}: many generations')
        elif k == 'squirrels':
            ok(right.startswith('One species') and 'they breed and their young are fertile' in q['prompt'], f'{where}: fertile young, so one species')
        elif k == 'whichIsSpeciation':
            ok('sterile' in right and 'fertile' not in right.replace('sterile', '') and all('young are fertile' in w for w in wrongs), f'{where}: only the sterile young mean speciation is complete')
        elif k.startswith('splits'):
            T = q['tree']; line, mt, alive = tree_facts(T)
            ok(all(f'{T[x]} split into' in q['prompt'] or f'split into {T[x]}' in q['prompt'] for x in 'pqs') and f'{T["t1"]} million years ago' in q['prompt'], f'{where}: the story states the tree')
            if k == 'splitsClosest':
                tg = q['target']; others = [a for a in alive if a != tg]
                times = {a: mt(a, tg) for a in others}
                best = min(times, key=times.get)
                ok(tg == T['t'] and list(times.values()).count(times[best]) == 1 and right == best, f'{where}: the closest living relative of {tg} is {best} ({times})')
                ok(set(wrongs) == ({a for a in others if a != best} | {f'All three are equally closely related to {tg}.'}), f'{where}: the other options are the other species, and "equally related"')
            elif k == 'splitsOldest':
                def pair(s): a, b = s.split(' and '); return mt(a, b)
                times = [pair(o) for o in texts]
                ok(times.count(max(times)) == 1 and times.index(max(times)) == ci, f'{where}: exactly one pair shares the oldest ancestor, and it is the right one ({times})')
            else:
                p, r, s, t, u = (T[x] for x in 'prstu')
                def truth(st):
                    if st == f'{r} is more closely related to {t} than {p} is.': return mt(r, t) < mt(p, t)
                    if st == f'{p} is the ancestor of {r}.': return p in line(r)[1:]
                    if st == f'The split into {t} and {u} happened before the split into {r} and {s}.': return T['t3'] > T['t2']
                    if st == f'{p} is more closely related to {u} than {t} is.': return mt(p, u) < mt(t, u)
                    fail(f'{where}: a statement the checker does not know: {st}')
                vals = [truth(o) for o in texts]
                ok(vals.count(True) == 1 and vals.index(True) == ci, f'{where}: exactly one statement is true, and it is the right one ({vals})')
        else:
            fail(f'{where}: a kind the checker does not know')

    # examples within a game
    ok(all(a != b for a, b in zip(used, used[1:])), f'{W}: no example twice in a row')
    for r in range(3):
        rs = [qs[i]['scen'] for i in range(r * 6, r * 6 + 6) if 'scen' in qs[i]]
        ok(len(set(rs)) == len(rs), f'{W} round {r + 1}: a different example in every question')
    ok({'finches', 'shrimp'} <= set(used), f'{W}: both real examples come up')
    scen_use.update(used)

# ---- no cue gives an answer away ----
for k, c in opt_pos.items():
    n = sum(c.values())
    ok(all(0.12 <= c[j] / n <= 0.38 for j in range(4)), f'{k}: the right option is spread over A to D ({dict(c)})')
for k, c in longest.items():
    ok(c['right longest'] / c['n'] <= 0.6, f'{k}: the right option is not usually the longest ({c["right longest"]} of {c["n"]})')
ok(len(signatures) == len(games), f'every game is different ({len(signatures)} of {len(games)})')
ok(all(scen_use[s] > 0 for s in SCEN), 'every example is used')

print(f'{len(games)} games, {checks} checks passed')
print('right option strictly the longest, by kind:', {k: f"{v['right longest']}/{v['n']}" for k, v in sorted(longest.items())})
