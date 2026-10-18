#!/usr/bin/env python3
"""
Y9 Atmosphere (Lessons 1 to 4 and the assessment). Every number that goes into a deck, a worksheet or its answers is derived HERE with sympy, from the
real data files in build/atmosphere-data/ where there are any, and written to build/atmosphere.data.json. The build scripts read that file only, so a deck
and its worksheet cannot disagree.

    python3 build/atmosphere-check.py
"""
import json, pathlib
from sympy import Rational as R, Integer, floor

HERE = pathlib.Path(__file__).parent
DATA = HERE / 'atmosphere-data'
checks = 0
D = {}


def eq(got, want, what):
    global checks
    assert got == want, f'{what}: got {got}, expected {want}'
    checks += 1


def num(x):
    """JSON-friendly: ints stay ints, other values become floats rounded to 6 places."""
    x = R(x)
    return int(x) if x.q == 1 else float(round(float(x), 6))


# ------------------------------------------------------------------------------------------------ Lesson 1
L1 = {}
# Do Now Q1 (retrieval from Pollution Pandemic: a share of a total, new numbers)
runoff, strip_pct = Integer(250), Integer(40)
caught = runoff * strip_pct / 100
eq(caught, 100, 'grass strip catches 40% of 250 kg'); L1['strip'] = dict(runoff=num(runoff), pct=num(strip_pct), caught=num(caught))
# Worksheet: the sulfur in a day's coal
coal_t, s_pct = Integer(2000), Integer(2)
sulfur_t = coal_t * s_pct / 100
eq(sulfur_t, 40, 'sulfur in 2,000 t of coal at 2%'); L1['coal'] = dict(coal=num(coal_t), pct=num(s_pct), sulfur=num(sulfur_t))
D['l1'] = L1

# ------------------------------------------------------------------------------------------------ Lesson 2
L2 = {}
# Do Now Q4: fish left after a pollutant kills 35% of 400
fish, kill = Integer(400), Integer(35)
dead = fish * kill / 100; left = fish - dead
eq((dead, left), (140, 260), '400 fish, 35% die'); L2['fish'] = dict(fish=num(fish), pct=num(kill), dead=num(dead), left=num(left))
# particles: how many times narrower than a hair is a PM2.5 particle (hair 70 micrometres, PM2.5 up to 2.5, PM10 up to 10)
hair, pm25, pm10 = Integer(70), R(5, 2), Integer(10)
eq(hair / pm25, 28, 'hair / PM2.5'); eq(hair / pm10, 7, 'hair / PM10'); L2['particles'] = dict(hair=num(hair), pm25=num(pm25), pm10=num(pm10), hair_over_pm25=num(hair / pm25), hair_over_pm10=num(hair / pm10))
# worksheet Q6 (not the Do Now's numbers): 800 fish, 15% die
f2, k2 = Integer(800), Integer(15)
d2 = f2 * k2 / 100
eq((d2, f2 - d2), (120, 680), '800 fish, 15% die'); L2['ws_fish'] = dict(fish=num(f2), pct=num(k2), dead=num(d2), left=num(f2 - d2))
# the worked example on the sheet: 600 fish, 25%
eq((Integer(600) * 25 / 100, Integer(600) - Integer(600) * 25 / 100), (150, 450), '600 fish, 25% die')
# PM2.5 against the WHO annual guideline (5 micrograms per cubic metre): Delhi 2025 (IQAir, as reported) and the UK urban background (Defra)
who, delhi, uk = Integer(5), R('99.6'), R('8.0')
eq((delhi / who, uk / who), (R('19.92'), R('1.6')), 'PM2.5 against the WHO guideline'); L2['pm'] = dict(who=num(who), delhi=num(delhi), uk=num(uk), delhi_x=num(delhi / who), uk_x=num(uk / who), delhi_round=round(float(delhi / who)))
D['l2'] = L2

# ------------------------------------------------------------------------------------------------ Lesson 3
L3 = {}
# the real NASA Ozone Watch table (1979 to 2025): mean hole area, 7 Sep to 13 Oct (million km2), and minimum ozone (DU); there is no 1995 row
OZ = {}
for line in open(DATA / 'ozone_annual_data.txt'):
    parts = line.split()
    if len(parts) == 3 and parts[0].isdigit():
        OZ[int(parts[0])] = (R(parts[1]), R(parts[2]))
eq((len(OZ), 1995 in OZ), (46, False), 'ozone table has 46 rows and no 1995')
area = lambda y: OZ[y][0]
L3['area'] = {str(y): num(area(y)) for y in (1979, 1985, 1990, 2000, 2006, 2010, 2015, 2020, 2025)}
peak_year = max(OZ, key=lambda y: OZ[y][0]); eq((peak_year, area(peak_year)), (2006, R('26.6')), 'largest mean hole area')
L3['peak'] = dict(year=peak_year, area=num(area(peak_year)))
eq(area(2006) - area(1985), R('12.4'), 'rise in hole area 1985 to 2006'); L3['rise_1985_2006'] = num(area(2006) - area(1985))
eq(area(2006) - area(2025), R('7.9'), 'fall in hole area 2006 to 2025'); L3['fall_2006_2025'] = num(area(2006) - area(2025))
# the mean of the last five years against the five before: no trend claim without the arithmetic
last5 = sum(area(y) for y in range(2021, 2026)) / 5; prev5 = sum(area(y) for y in range(2011, 2016)) / 5
L3['last5'] = num(last5); L3['prev5'] = num(prev5)
# Do Now Q2: the mean of three trap counts
counts = [Integer(36), Integer(41), Integer(28)]
eq(sum(counts) / 3, 35, 'mean of the three fields'); L3['traps'] = dict(counts=[num(c) for c in counts], mean=num(sum(counts) / 3))
eq(area(2000) - area(1979), R('24.7'), 'rise in hole area 1979 to 2000'); L3['rise_1979_2000'] = num(area(2000) - area(1979))
D['l3'] = L3
# ------------------------------------------------------------------------------------------------ Lesson 4
L4 = {}
# the greenhouse effect: with it about 15 degrees C, without it about -18 degrees C (check the sources in the unit file)
eq(15 - (-18), 33, 'the greenhouse effect warms the surface by about 33 degrees C'); L4['gh'] = dict(without=-18, with_=15, diff=33)
# Mauna Loa annual means (NOAA GML)
CO2 = {}
for line in open(DATA / 'co2_annmean_mlo.txt'):
    if line.strip() and not line.startswith('#'):
        y, m, _ = line.split(); CO2[int(y)] = R(m)
eq((CO2[1959], CO2[2025]), (R('315.98'), R('427.35')), 'Mauna Loa annual means 1959 and 2025')
L4['co2'] = dict(y1959=num(CO2[1959]), y2025=num(CO2[2025]), rise=num(CO2[2025] - CO2[1959]), pct_since_1959=round(float((CO2[2025] - CO2[1959]) / CO2[1959] * 100), 1))
eq(CO2[2025] - CO2[1959], R('111.37'), 'rise 1959 to 2025')
pre = Integer(280); eq(int(round(float((CO2[2025] - pre) / pre * 100))), 53, 'rise since pre-industrial (280 ppm)'); L4['co2']['pre'] = 280; L4['co2']['pct_since_pre'] = int(round(float((CO2[2025] - pre) / pre * 100)))
# GISTEMP annual (J-D), relative to 1951 to 1980
AN = {}
for line in open(DATA / 'gistemp_GLB.csv'):
    c = line.strip().split(',')
    if c[0].isdigit() and c[13] not in ('***', ''):
        AN[int(c[0])] = R(c[13])
eq((AN[1880], AN[2024], AN[2025]), (R('-0.17'), R('1.28'), R('1.18')), 'GISTEMP annual anomalies')
warm = sorted(AN, key=lambda y: -AN[y])[:10]
L4['temp'] = dict(y1880=num(AN[1880]), y1950=num(AN[1950]), y2000=num(AN[2000]), y2020=num(AN[2020]), y2024=num(AN[2024]), y2025=num(AN[2025]), ten_warmest=sorted(warm))
eq(AN[2024] - AN[1880], R('1.45'), 'change 1880 to 2024'); L4['temp']['rise_1880_2024'] = num(AN[2024] - AN[1880])
# ice cores (Bereiter et al. 2015): the range over the pre-industrial record
ic = []
for line in open(DATA / 'antarctica2015co2composite.txt', encoding='utf-8-sig'):
    if line.strip() and not line.startswith('#') and not line.startswith('age'):
        a_, c_, _ = line.split('\t'); ic.append((R(a_), R(c_)))
pre_ic = [c for a_, c in ic if a_ > 200]
L4['icecore'] = dict(min=num(min(pre_ic)), max=num(max(pre_ic)), oldest=num(max(a_ for a_, _ in ic)))
# the worksheet reads whole numbers off the Keeling curve and the ice-core graph
eq((Integer(427) - 316, round(float(R(111, 316) * 100))), (111, 35), 'Keeling worksheet numbers'); L4['ws'] = dict(y1959=316, y2025=427, rise=111, pct=35)
eq(Integer(427) - 299, 128, 'today against the highest ice-core value'); L4['ws']['ice_max'] = 299; L4['ws']['above_ice'] = 128
D['l4'] = L4
(HERE / 'atmosphere.data.json').write_text(json.dumps(D, indent=1))
print(f'{checks} checks passed; build/atmosphere.data.json written')
