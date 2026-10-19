#!/usr/bin/env python3
"""
T3 Unit 8 (The Periodic Table): checks every fact the decks, worksheets and game state about an element, against the table the
unit teaches from (tools/make-periodic-table.py: 118 elements, atomic numbers, the blue / green / grey colours of lesson 1).

  python3 build/periodic-check.py

1. The table: 118 symbols, atomic numbers 1 to 118 in order, the 11 gases green, the metals blue, the rest grey.
2. The nine elements of the unit: atomic number, name and class (a gas or a grey box is a non-metal; a blue box is a metal).
3. The decks agree with each other: the sentence for each sample in Lesson 2 is the one in the Lesson 4 and 5 oral check and in the game; what
   conducts in Lesson 3 is what the game asks; each object in Lesson 4 and 5 is made of the element its tile shows.
4. Conductivity, the one place the unit makes a claim about the real world beyond the table: the metals tested conduct, sulfur does not, and
   graphite (a pencil lead, carbon) is the one non-metal that does (checked against the sources in units/T3-Periodic-Table.md).
"""
import importlib.util, json, pathlib, subprocess, sys

ROOT = pathlib.Path(__file__).parent.parent
spec = importlib.util.spec_from_file_location('pt', ROOT / 'tools' / 'make-periodic-table.py')
pt = importlib.util.module_from_spec(spec); spec.loader.exec_module(pt)

fails = []
def ok(c, what):
    if not c: fails.append(what)

def node(js):
    r = subprocess.run(['node', '-e', js], cwd=ROOT / 'build', capture_output=True, text=True)
    if r.returncode: sys.exit(r.stderr)
    return json.loads(r.stdout)

# 1. the table
ok(len(pt.SYMBOLS) == 118 and len(set(pt.SYMBOLS)) == 118, '118 different symbols')
GASES = {'H', 'He', 'N', 'O', 'F', 'Ne', 'Cl', 'Ar', 'Kr', 'Xe', 'Rn'}
ok(pt.GASES == GASES, 'the 11 gases of lesson 1')
ok(sum(1 for s in pt.SYMBOLS if pt.kind(s) == 'gas') == 11, '11 green boxes')
KNOWN_Z = {'He': 2, 'O': 8, 'Al': 13, 'Si': 14, 'C': 6, 'S': 16, 'Fe': 26, 'Cu': 29, 'Au': 79}
for s, z in KNOWN_Z.items():
    ok(pt.Z[s] == z, f'atomic number of {s} is {z}')
BLUE = {'Fe', 'Cu', 'Au', 'Al'}; GREY = {'C', 'S', 'Si'}
ok(all(pt.kind(s) == 'metal' for s in BLUE), 'Fe, Cu, Au, Al are blue')
ok(all(pt.kind(s) == 'other' for s in GREY), 'C, S, Si are grey')
ok(all(pt.kind(s) == 'gas' for s in ('He', 'O')), 'He and O are green')

# 2. the nine elements, as the words module has them
EL = node("const W=require('./periodic-words');console.log(JSON.stringify(W.EL))")
ok(set(EL) == set(KNOWN_Z), 'the unit has exactly the nine elements')
for s, e in EL.items():
    ok(e['n'] == pt.Z[s], f'{s}: atomic number {e["n"]} in the words module matches the table')
    ok(e['name'] == pt.NAMES[s].lower(), f'{s}: name {e["name"]}')
    expect = 'metal' if pt.kind(s) == 'metal' else 'non-metal'
    ok(e['cls'] == expect, f'{s}: class {e["cls"]} follows its box colour ({pt.kind(s)})')
    ok(e['table'] == {'metal': 'blue', 'gas': 'green', 'other': 'grey'}[pt.kind(s)], f'{s}: table colour')
    ok((e['form'] == 'gas') == (s in GASES), f'{s}: form')

# 3. the decks agree
L2 = node("const A=require('./metal-or-non-metal-answers');console.log(JSON.stringify(Object.fromEntries(A.SAMPLES.map(k=>[k,A.sentence(k)]))))")
L45 = node("const A=require('./what-is-it-made-of-answers');console.log(JSON.stringify({d:Object.fromEntries(A.SAMPLES.map(k=>[k,A.describe(k)])),o:Object.fromEntries(['nail','ring','wire','pan','tank','balloons'].map(k=>[k,[A.sentence(k),A.element(k)]]))}))")
ok(L2 == L45['d'], 'Lesson 2 sentences are the oral check sentences')
for k, v in L2.items():
    ok(v.startswith('This is ') and v.count('.') == 3, f'{k}: the frame')
EXPECT_OBJ = {'nail': 'Fe', 'pan': 'Fe', 'ring': 'Au', 'wire': 'Cu', 'tank': 'O', 'balloons': 'He'}
names = {s: pt.NAMES[s].lower() for s in pt.NAMES}
for k, (sent, element) in L45['o'].items():
    ok(element == names[EXPECT_OBJ[k]], f'{k} is made of {names[EXPECT_OBJ[k]]}')
    ok(sent.endswith(f'{element}.'), f'{k}: sentence ends with the element')
    ok(('is full of' in sent) == (EXPECT_OBJ[k] in GASES), f'{k}: "full of" only for a gas')

# 4. conductivity
CONDUCT = node("const A=require('./does-it-light-up-answers');console.log(JSON.stringify(Object.fromEntries(A.TESTED.map(k=>[k,[A.element(k),A.conducts(k)]]))))")
EXPECT_COND = {'wire': ('copper', True), 'nail': ('iron', True), 'aluminium': ('aluminium', True), 'sulfur': ('sulfur', False), 'pencil': ('carbon', True)}
ok({k: tuple(v) for k, v in CONDUCT.items()} == EXPECT_COND, 'what conducts: the three metals and the graphite do, sulfur does not')
metals_conduct = all(CONDUCT[k][1] for k in ('wire', 'nail', 'aluminium'))
ok(metals_conduct, 'every metal tested conducts')
nonmetals = [k for k, (e, c) in CONDUCT.items() if EL[next(s for s in EL if EL[s]['name'] == e)]['cls'] == 'non-metal']
ok(sorted(nonmetals) == ['pencil', 'sulfur'] and CONDUCT['pencil'][1] and not CONDUCT['sulfur'][1], 'the two non-metals tested: the pencil conducts (the exception), sulfur does not')
GAME = node("const fs=require('fs');const h=fs.readFileSync('../out/What Is It Made Of/What Is It Made Of game.html','utf8');const m=h.match(/var D = (\\{.*?\\});\\n/);console.log(m[1])")
ok({c['key']: (c['element'], c['conducts']) for c in GAME['conductPool']} == EXPECT_COND, 'the game asks what the decks teach')
ok(all(GAME['samples'][k]['cls'] == ('metal' if pt.kind(EL_sym) == 'metal' else 'non-metal') for k, EL_sym in
       {'copper': 'Cu', 'gold': 'Au', 'iron': 'Fe', 'aluminium': 'Al', 'sulfur': 'S', 'carbon': 'C', 'silicon': 'Si', 'helium': 'He'}.items()), 'the game classes follow the table')

if fails:
    print('FAILED:'); [print('  -', f) for f in fails]; sys.exit(1)
print('periodic-check: all facts agree (table, nine elements, objects, sentences, conductivity, game)')
