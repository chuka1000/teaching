#!/usr/bin/env python3
"""
Y8 Prokaryotes (8I). Every number in the six decks, the six worksheets, the two games and the assessment is checked here with sympy BEFORE it
is written anywhere. The builders read build/prokaryotes.data.json, which this script writes, so the deck, the worksheet and the answers cannot
disagree; the games' question banks are generated from it too.

    python3 build/prokaryotes-check.py
"""
import json, pathlib
from sympy import Rational as R, Integer, log, ceiling, N, floor

HERE = pathlib.Path(__file__).parent
checks = 0


def eq(got, want, what):
    global checks
    assert got == want, f'{what}: got {got}, expected {want}'
    checks += 1


DATA = {}

# =========================================================================================================== Lesson 1: size
# 1 mm = 1,000 micrometres. Do Now Q5 and the worksheet's Gold worked example.
UM_PER_MM = 1000
BACT_UM = 2
eq(R(UM_PER_MM, BACT_UM), 500, 'bacteria 2 um long across 1 mm')
CHEEK_UM = 50
eq(R(CHEEK_UM, BACT_UM), 25, 'bacteria 2 um long across a 50 um cell')
MAG = 400
eq(BACT_UM * MAG, 800, 'a 2 um bacterium at x400 is 800 um long')
eq(R(BACT_UM * MAG, UM_PER_MM), R(4, 5), '... which is 0.8 mm')
DATA['size'] = dict(um_per_mm=UM_PER_MM, bact_um=BACT_UM, across_mm=500, cheek_um=CHEEK_UM, across_cheek=25, mag=MAG, at_mag_um=800, at_mag_mm=0.8)

# =========================================================================================================== Lesson 2: doubling
# One bacterium, one division per `gen` minutes: after t minutes there are 2 ** (t / gen) bacteria. Every figure on the slides and the sheet is here.
def cells(minutes, gen=20):
    div = R(minutes, gen)
    assert div.q == 1, f'{minutes} min is not a whole number of {gen}-minute divisions'
    return int(div), 2 ** int(div)

D2 = {}
for label, minutes, gen in [('h1', 60, 20), ('h2', 120, 20), ('h3', 180, 20), ('h4', 240, 20), ('h6', 360, 20), ('h10', 600, 20), ('h12', 720, 20), ('h2_30', 120, 30), ('h3_30', 180, 30), ('h4_30', 240, 30)]:
    D2[label] = dict(minutes=minutes, gen=gen, divisions=cells(minutes, gen)[0], cells=cells(minutes, gen)[1])
eq(D2['h1']['cells'], 8, '2^3 after 1 hour'); eq(D2['h2']['cells'], 64, '2^6 after 2 hours'); eq(D2['h3']['cells'], 512, '2^9 after 3 hours')
eq(D2['h4']['cells'], 4096, '2^12 after 4 hours'); eq(D2['h6']['cells'], 262144, '2^18 after 6 hours'); eq(D2['h10']['cells'], 1073741824, '2^30 after 10 hours')
eq(D2['h12']['cells'], 68719476736, '2^36 after 12 hours'); eq(round(D2['h12']['cells'] / 1e9, 1), 68.7, '... which is 68.7 billion, about 69 billion'); eq(round(D2['h12']['cells'] / 1e9), 69, '... about 69 billion')
eq((D2['h2_30']['divisions'], D2['h2_30']['cells']), (4, 16), '30 minutes, 2 hours'); eq((D2['h3_30']['divisions'], D2['h3_30']['cells']), (6, 64), '30 minutes, 3 hours'); eq((D2['h4_30']['divisions'], D2['h4_30']['cells']), (8, 256), '30 minutes, 4 hours')
eq(3 * 60, 180, '3 h in minutes'); eq(R(180, 20), 9, '20-minute periods in 3 h')
DOUBLING_TABLE = [[m, 2 ** (m // 20)] for m in range(0, 121, 20)]
eq([c for _, c in DOUBLING_TABLE], [1, 2, 4, 8, 16, 32, 64], 'doubling table, every 20 minutes to 2 hours')
eq(D2['h3']['cells'] - D2['h3_30']['cells'], 448, '20-minute bacterium beats the 30-minute one after 3 hours by 448'); eq(D2['h10']['cells'] > 10 ** 9, True, 'over a billion after 10 hours')
# the honest follow-up: it cannot go on. One E. coli is about a trillionth of a gram (1 picogram, wet); when would the descendants outweigh the Earth?
PG_KG = R(1, 10 ** 15); EARTH_KG = R(597, 100) * 10 ** 24
n_earth = ceiling(log(EARTH_KG / PG_KG, 2))
eq(int(n_earth), 133, 'divisions until the bacteria would outweigh the Earth'); eq(float(R(int(n_earth) * 20, 60)), 44.333333333333336, '... which is about 44 hours')
eq(2 ** 133 * PG_KG > EARTH_KG and 2 ** 132 * PG_KG < EARTH_KG, True, '2^133 cells outweigh the Earth and 2^132 do not')
DATA['doubling'] = dict(D2, table=DOUBLING_TABLE, earth_divisions=int(n_earth), earth_hours=44)

# =========================================================================================================== Lesson 3: shapes and sizes
S3 = {}
eq((R(120, 15), 2 ** int(R(120, 15))), (8, 256), 'every 15 minutes for 2 hours: 8 divisions, 256 bacteria'); S3['q1'] = dict(minutes=120, gen=15, divisions=8, cells=256)
eq(R(UM_PER_MM, 8), 125, 'an 8 um spiral bacterium, end to end across 1 mm'); S3['spiral_um'] = 8; S3['spiral_across'] = 125
eq(R(UM_PER_MM, 4), 250, 'a 4 um rod, end to end across 1 mm'); S3['rod_um'] = 4; S3['rod_across'] = 250
eq(R(UM_PER_MM, 1), 1000, 'a 1 um coccus, in a row across 1 mm'); S3['coccus_um'] = 1; S3['coccus_across'] = 1000
eq((R(180, 15), 2 ** int(R(180, 15))), (12, 4096), 'every 15 minutes for 3 hours: 12 divisions, 4,096 bacteria'); S3['gold_div'] = dict(minutes=180, gen=15, divisions=12, cells=4096)
eq(2 ** 10, 1024, 'one division a day for 10 days'); S3['daily'] = dict(days=10, cells=1024)
DATA['shapes'] = S3

# =========================================================================================================== Lesson 4: archaea and extreme places
S4 = {}
eq(round(float(R(34) / R(7, 2)), 1), 9.7, 'Dead Sea (34%) against sea water (3.5%): 9.7 times saltier'); eq(int(round(float(R(34) / R(7, 2)))), 10, '... about 10 times')
eq(round(float(R(25) / R(7, 2)), 1), 7.1, 'Great Salt Lake north arm (25%) against sea water: 7.1 times'); eq(int(round(float(R(25) / R(7, 2)))), 7, '... about 7 times')
S4['dead_sea'] = dict(pct=34, sea_pct=3.5, times=10, exact=9.7); S4['gsl'] = dict(pct=25, times=7)
eq(122 - 100, 22, 'record growth temperature above the boiling point at sea level'); eq(113 - 70, 43, 'a 113 C microbe against a 70 C spring')
S4['temps'] = dict(boil=100, record=122, spring=70, vent=113, above_boil=22, over_spring=43)
eq((250 * 7, 500 * 7), (1750, 3500), 'a cow, 250 to 500 litres of methane a day, in a week'); eq((100 * 250, 100 * 500), (25000, 50000), 'a herd of 100 cows: 25,000 to 50,000 litres a day')
S4['cow'] = dict(low=250, high=500, week_low=1750, week_high=3500, herd=100, herd_low=25000, herd_high=50000)
DATA['archaea'] = S4

# =========================================================================================================== Lesson 5: the bacteria we need
S5 = {}
eq(R(2000, 500) * 2, 8, '2 spoonfuls per 500 mL, for 2 litres: 8 spoonfuls'); S5['spoons_2l'] = 8
eq(R(3000, 500) * 2, 12, '2 spoonfuls per 500 mL, for 3 litres: 12 spoonfuls'); S5['spoons_3l'] = 12
eq(round(float(R(38, 30)), 1), 1.3, 'gut: 38 trillion bacterial cells to 30 trillion human cells, about 1.3 to 1'); S5['gut_ratio'] = 1.3
eq(round(float(R(38, 38 + 30) * 100)), 56, 'bacterial share of all the cells: 38 / 68 = 56%'); S5['gut_share'] = 56
eq(R(67, 10) - R(43, 10), R(12, 5), 'milk pH 6.7 to yoghurt pH 4.3 falls by 2.4'); S5['ph_fall'] = 2.4
DATA['useful'] = S5

# =========================================================================================================== Lesson 6: pathogens and antibiotics
S6 = {}
eq(R(1000000, 100000), 10, '1 in 100,000 of a million bacteria: 10 resistant'); eq(1000000 - 10, 999990, '... the antibiotic kills 999,990'); S6['million'] = dict(total=1000000, one_in=100000, resistant=10, killed=999990)
eq(10 * 2 ** 9, 5120, '10 survivors, 9 divisions (3 hours at 20 minutes, the best case): 5,120'); eq(10 * 2 ** 18, 2621440, '10 survivors, 18 divisions: 2,621,440')
S6['grow'] = dict(survivors=10, div_3h=9, after_3h=5120, div_6h=18, after_6h=2621440)
eq((R(2000000, 500000), R(2, 1) * 0 + 4 * 2 ** 6), (4, 256), '2,000,000 bacteria, 1 in 500,000 resistant: 4; after 6 divisions: 256'); S6['two_million'] = dict(total=2000000, one_in=500000, resistant=4, divisions=6, after=256)
eq(round(float(R(123, 100) / R(107, 10) * 100)), 11, 'TB 2024: 1.23 million deaths of 10.7 million ill is about 11%'); S6['tb'] = dict(ill_m=10.7, died_m=1.23, pct=11, year=2024)
eq(round(float(R(114, 100) * 1)), 1, 'about 1 million direct deaths from drug-resistant bacterial infections (1.14 million, 2021)'); S6['amr'] = dict(direct_m=1.14, linked_m=4.71, year=2021, forecast_2050_m=1.91)
DATA['antibiotics'] = S6

# =========================================================================================================== write
DATA['_comment'] = 'Written by build/prokaryotes-check.py. Do not edit by hand.'
(HERE / 'prokaryotes.data.json').write_text(json.dumps(DATA, indent=1, ensure_ascii=False))
print(f'{checks} checks passed; build/prokaryotes.data.json written')
