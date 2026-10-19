"""Level 3 of the Earth Resources revision game: Spot the mistake, and two steps."""
from earth_resources_helpers import *
from earth_resources_l12 import LAND, SOIL, CITY, EARTH, LAST, DEP, SOIL_PARTS


def spot(claim, right, wrongs, explain, src):
    return mc(f'A student says: “{claim}” What is wrong with this?', right, wrongs, explain, src)


LEVEL3 = {
    'name': 'Spot the mistake',
    'blurb': 'Each question gives you a claim that sounds sensible but is wrong. Find what is wrong with it. There are also two-step calculations.',
    'slots': [
        # 1. soil
        slot('soil', 'spot', 'mc', [
            spot('Soil is just crushed rock.', 'It leaves out organic matter, water and air, and living organisms.',
                 [('Nothing is wrong. Soil is crushed rock and it is nothing else at all.', 'soil-rock-only', 'Broken rock is only one of the four parts of soil.'),
                  ('Soil is not made of rock at all, so the claim is simply false.', 'soil-rock-only', 'Broken rock IS one of the four parts: rock ground down by weather over a very long time.'),
                  ('It leaves out only the water. Soil is made of rock and water.', 'soil-forget-life', 'Water and air are one part, but dead organic matter and living organisms are parts too.')],
                 [SOIL_PARTS], LAND),
            spot('Soil is just dirt. It does not really do anything.', 'Producers grow in soil and get water and nutrients from it, so land food chains start there.',
                 [('Soil only matters for building roads and houses, and for nothing that lives.', 'soil-job', 'Soil is where producers grow, and food chains start with producers.'),
                  ('Nothing is wrong, because plants get everything they need from sunlight alone.', 'soil-job', 'Plants need sunlight, but they also get water and nutrients from soil.'),
                  ('Soil matters, but only to the worms and insects that live in it, not to plants.', 'soil-job', 'Worms and insects live in soil, but producers depend on it too, and so does every land food chain.')],
                 ['Soil is not just dirt. Producers grow in it and get water and nutrients from it, so nearly every land food chain starts there.'], LAND),
        ]),
        # 2. time
        slot('time', 'spot', 'mc', [
            spot('Soil lost in a few years will be replaced in a few years.', 'A few centimetres of soil take a few hundred to about a thousand years.',
                 [('Soil is never replaced at all, however many centuries people wait.', 'time-never', 'Soil does form again, but very slowly.'),
                  ('Soil is replaced within a few months, in the same way as a crop.', 'time-fast', 'A crop takes months. Soil takes centuries.'),
                  ('Soil takes millions of years to form, in just the same way that coal does.', 'time-coal', 'That is coal. A few centimetres of soil take a few hundred to about a thousand years.')],
                 ['Centuries to make, years to lose. A few centimetres of soil take a few hundred to about a thousand years to form.'], SOIL),
            spot('Coal, soil and vegetables all form at about the same speed.', 'A crop takes months, soil takes centuries, and coal takes millions of years.',
                 [('Soil is the quickest of the three to form, then coal, then vegetables.', 'time-order', 'A crop is the quickest: months.'),
                  ('Coal is the quickest of the three, because it is dug up so fast.', 'time-order', 'How fast we dig it up is not how fast it forms. Coal takes millions of years.'),
                  ('Vegetables take longer than soil, because they are alive.', 'time-order', 'A crop takes months. Soil takes a few hundred to about a thousand years.')],
                 ['Order from quickest to slowest: a crop (months), a few centimetres of soil (centuries), coal (millions of years).'], LAND),
            spot('Erosion is not a problem, because soil is renewable.', 'New soil forms far slower than it is lost, so it is non-renewable on a human timescale.',
                 [('Soil is not renewable at all, because new soil never forms again, ever.', 'time-never', 'New soil does form, but far slower than we lose it.'),
                  ('Erosion only matters in deserts, so it is not a problem in farming areas.', 'eros-desert-only', 'Erosion happens anywhere soil is bare and water or wind can carry it off.'),
                  ('Soil forms faster than erosion removes it, so there is no need to worry.', 'time-fast', 'It is the other way round. Formation takes centuries. Loss can take years.')],
                 ['Soil can form again, but far slower than it is lost, so on a human timescale it is non-renewable.'], LAND),
        ]),
        # 3. erosion and desertification
        slot('erosion', 'spot', 'mc', [
            spot('Erosion only happens in deserts.', 'It happens anywhere soil is bare and water or wind can carry it off.',
                 [('Erosion never happens in deserts at all, only in wet places.', 'eros-desert-only', 'Erosion can happen in deserts. The claim is wrong because it also happens in many other places.'),
                  ('Erosion only happens in places where it is raining heavily.', 'eros-water-only', 'Wind carries soil off too.'),
                  ('Nothing is wrong. Erosion needs a desert to be there before it can happen.', 'eros-desert-only', 'The tray practical used ordinary soil and still lost it.')],
                 ['Erosion happens wherever soil is bare and water or wind can carry it off. The tray practical used ordinary soil.'], SOIL),
            spot('Desertification is a desert spreading by itself.', 'It is land degradation in dry areas, from climate variation AND human activity.',
                 [('Nothing is wrong. Deserts spread on their own, with no help from people.', 'desert-spreads', 'People contribute: overgrazing, over-cultivation, deforestation and poor irrigation.'),
                  ('It is caused by drought alone, and never by people.', 'desert-spreads', 'Drought makes it worse, but farming can start it.'),
                  ('It only happens in places that are already deserts.', 'desert-spreads', 'It turns fertile land in a dry area into desert-like land.')],
                 ['Desertification is land degradation in dry areas from climate variation AND human activity, such as overgrazing, over-cultivation, deforestation and poor irrigation.'], SOIL),
            spot('Ploughing does not matter, because the soil is still there.', 'Ploughed soil is bare and loose, so water and wind can carry it off.',
                 [('Ploughing makes new soil form much faster than it did before.', 'time-fast', 'Soil forms over centuries. Ploughing does not speed that up.'),
                  ('Soil that is still there in the field cannot be eroded at all by anything.', 'eros-loosen', 'It is there until water or wind carries it off, as in the bare tray.'),
                  ('Ploughing adds extra soil to the field each time it is done.', 'eros-loosen', 'Ploughing does not add soil. It leaves what is there bare and loose.')],
                 ['Ploughing leaves soil bare and loose. The soil is still there until water or wind carries it off, as it did in tray A.'], SOIL),
        ]),
        # 4. cities
        slot('cities', 'spot', 'mc', [
            spot('Rain soaks into tarmac, so cities flood less.', 'Rain cannot soak into tarmac. It runs off into drains and can flood.',
                 [('Nothing is wrong. Tarmac soaks up the rain like a big sponge.', 'runoff', 'Tarmac is sealed. Rain cannot soak in.'),
                  ('Cities flood less, because the tarmac dries out again very quickly after rain.', 'runoff', 'Rain runs off before it can dry, and can flood the streets.'),
                  ('Rain that falls on tarmac turns into soil, so the city grows.', 'runoff', 'Rain does not turn into soil.')],
                 ['Rain cannot soak into tarmac. It runs off (runoff) into drains and can flood streets.'], CITY),
            spot('A green belt is a park in the middle of a city.', 'It is a ring of land round a city, kept from being built on.',
                 [('It is a roof that is covered with grass and other plants.', 'sponge', 'That is a green roof, one thing a sponge city uses.'),
                  ('It is land that has been built on before, then left empty and unused.', 'brownfield', 'That is brownfield land.'),
                  ('It is a ring of new houses that is built round a city.', 'green-belt', 'Green belt land is kept from being built on.')],
                 ['A green belt is a ring of land round a city, kept from being built on. London’s is about 500,000 hectares.'], CITY),
            spot('Sponge cities send rain away faster.', 'They let rain soak in, using permeable paving, rain gardens and green roofs.',
                 [('They build much wider drains so that all of the rain can leave the city faster.', 'sponge', 'A sponge city does the opposite: it keeps the rain where it falls.'),
                  ('They seal the ground with concrete and tarmac so no water can get in.', 'sponge', 'Sealing is what roads do. A sponge city lets water in.'),
                  ('They only work in cities that have no rain at all, so they are rare.', 'sponge', 'They are built for rain. They let it soak in or be stored.')],
                 ['A sponge city lets rain soak in or be stored: permeable paving, rain gardens and green roofs. Wuhan is one.'], CITY),
        ]),
        # 5. renewable by rate
        slot('renew', 'spot', 'mc', [
            spot('Coal is not a natural resource, because people have to mine it before we can use it.', 'It comes from the Earth and is not made by people. Mining only gets it out.',
                 [('Coal is made in factories from other materials, so people do make it.', 'resource-def', 'Coal was not manufactured. It formed over millions of years.'),
                  ('Coal is renewable, so it is not counted as a natural resource at all by scientists.', 'resource-def', 'Coal is non-renewable, and it is still a natural resource.'),
                  ('Nothing is wrong. Anything that is mined has been made by people.', 'resource-def', 'Mining digs it out. It does not make it.')],
                 ['Coal is the natural resource. Mining just gets it out of the ground.'], EARTH),
            spot('Wood is non-renewable, because once a tree is cut down, it is gone.', 'The tree is gone, but the forest regrows. Wood is renewable if cut slowly enough.',
                 [('Wood is never renewable, however slowly the trees are cut down and replaced.', 'can-regrow', 'Cut no faster than it regrows, a forest is renewable.'),
                  ('Wood is renewable however fast the forest is cut down, as it always regrows later.', 'renewable-rate', 'It depends on the rate. Cut too fast, a forest shrinks.'),
                  ('Trees cannot regrow once they have been cut, so the wood is lost for good.', 'can-regrow', 'Forests regrow. The question is whether they regrow fast enough.')],
                 ['One tree is gone, but the resource is the forest. It is renewable if cut no faster than it regrows.'], EARTH),
            spot('Fresh water is always renewable, because rain keeps falling.', 'Rivers refill quickly, but deep, old groundwater can be pumped out far faster than it refills.',
                 [('Fresh water is never renewable, because every bit of it gets used up in the end.', 'renewable-rate', 'Water in rivers and ordinary wells is refilled quickly by rain.'),
                  ('Rain does not reach groundwater, so groundwater is never refilled by anything.', 'renewable-rate', 'Ordinary groundwater is refilled by rain. Deep, old groundwater refills very slowly.'),
                  ('Water is only renewable in cold countries, because the rain there is stored as ice.', 'renewable-rate', 'It depends on the rate of refilling against the rate of use, not on the climate.')],
                 ['The same kind of resource, water, can be renewable in one place and non-renewable in another. It is the rate that decides.'], EARTH),
            spot('Fish are a renewable resource, so a fishery can never run out.', 'Fish are renewable only if caught no faster than they breed, so a fishery can collapse.',
                 [('Fish are not renewable at all, because once a fish is caught it is gone for good.', 'renewable-rate', 'Fish can breed, so they can be renewable if caught slowly enough.'),
                  ('A fishery can run out, but only if the sea itself dries up or runs out of water.', 'renewable-rate', 'It is the catch against the breeding that decides, not the water.'),
                  ('Nothing is wrong. Fish always breed fast enough to replace whatever is caught.', 'can-regrow', 'Cod off Newfoundland fell by about 93% in thirty years.')],
                 ['Cod off Newfoundland fell by about 93% between 1962 and 1992. Renewable only if caught no faster than they breed.'], EARTH),
        ]),
        # 6. conservation
        slot('last', 'spot', 'mc', [
            spot('Conservation means never using a resource at all.', 'Conservation means careful use so the resource lasts, not no use at all.',
                 [('Conservation means using as much as possible while it lasts.', 'conserve-never', 'That would deplete it. Conservation is careful use.'),
                  ('Conservation only applies to animals, never to forests or minerals.', 'conserve-never', 'It applies to any resource that could run out.'),
                  ('Nothing is wrong. A resource must not be touched or used at all.', 'conserve-never', 'Conservation allows use, at a rate that lets the resource last.')],
                 ['Conservation is careful use so a resource is still there in future, not no use at all.'], LAST),
            spot('A forest cut at exactly its regrowth rate is not sustainable, because trees are still being cut down.', 'It is sustainable: the forest stays the same size, year after year.',
                 [('It is sustainable, but only for a year or two before the forest runs out.', 'sustainable-nothing', 'It stays the same size every year it is repeated.'),
                  ('It is not sustainable, because the forest shrinks a little.', 'sustainable-nothing', 'It does not shrink. What is cut regrows.'),
                  ('A forest can only be sustainable if no tree is ever cut.', 'sustainable-nothing', 'Sustainable means no more than is replaced, not nothing.')],
                 ['Sustainable does not mean nothing is taken. It means the stock does not shrink: cut what regrows.'], LAST),
            spot('Recycling is not resource management, because it does not stop a resource running out.', 'Recycling is management: it cuts how much new material has to be used.',
                 [('Recycling only works for plastic and paper, never for metals or glass.', 'recycle-def', 'Metals are recycled too. It cuts how much new material is needed.'),
                  ('Recycling turns a non-renewable resource into a renewable one for good.', 'recycle-def', 'It does not make it renewable. It reduces how fast new material is used.'),
                  ('Nothing is wrong. Only fishing quotas and bans count as management.', 'recycle-def', 'Quotas, bans, replanting and recycling are all ways to manage a resource.')],
                 ['Recycling is a real way to manage a resource: less new, often non-renewable, material is needed.'], LAST),
            spot('Once a resource has collapsed, like cod, conservation can never help.', 'Conservation can allow recovery, as humpback whales show, but it can take decades.',
                 [('Conservation helps at once, and the stock is back within a year or two.', 'conserve-fast', 'Whales needed decades. Conservation works, but slowly.'),
                  ('Nothing is wrong. After a collapse there is no way back for the resource at all, ever.', 'conserve-never', 'Humpback whales recovered after the 1986 ban.'),
                  ('Conservation only helps resources that have not collapsed yet, never after.', 'conserve-never', 'It helped whales that had fallen to about 450 off Brazil.')],
                 ['Humpback numbers recovered after hunting was banned in 1986, but it took decades. Protecting early works best.'], LAST),
        ]),
        # 7. depletion
        slot('deplete', 'spot', 'mc', [
            spot('Renewable resources cannot run out.', 'A renewable resource can run out if it is used too fast for long enough.',
                 [('They cannot run out, because the Sun keeps on shining and the rain falls.', 'renewable-cannot-run-out', 'Some renewable resources, such as sunlight, cannot. Fish, trees and animals can.'),
                  ('They can run out, but only if they turn into non-renewable ones first.', 'renewable-cannot-run-out', 'A renewable resource can run out if it is used too fast, with no change of kind.'),
                  ('Nothing is wrong. Renewable means that the supply is unlimited for ever.', 'renewable-cannot-run-out', 'Renewable means CAN be replaced. It does not mean it always is.')],
                 ['Passenger pigeons were renewable and they went extinct. Used faster than they could replace themselves, for long enough.'], DEP),
            spot('There were billions of passenger pigeons, so they were safe.', 'A huge number that falls faster than it regrows still reaches zero, just later.',
                 [('There were too many to kill, so something else must have wiped them out.', 'big-number-safe', 'They were used faster than they could breed, for decades.'),
                  ('They were safe for a very long time, until the last one died by accident.', 'big-number-safe', 'The loss was steady and caused by people.'),
                  ('Nothing is wrong. A very large number of animals simply cannot be used up by people.', 'big-number-safe', 'A large number only delays the end.')],
                 ['More than 3 billion in the 1870s, none by 1914. A big number is not a safe number.'], DEP),
            spot('Resource depletion only happens to things that are dug up.', 'It also happens to living things, such as fish and animals, that are used faster than they breed.',
                 [('Depletion only happens to non-renewable things such as oil, coal and gas, and never to living things.', 'deplete-def', 'The Aral Sea, bluefin tuna and bison were renewable and were depleted.'),
                  ('Depletion only happens in the sea, where fish are caught, and never to anything on land.', 'deplete-def', 'Bison were depleted on land. The Aral Sea is water diverted from rivers.'),
                  ('Nothing is wrong. Living things breed again, so they cannot be depleted by people at all.', 'renewable-cannot-run-out', 'Passenger pigeons, bison and tuna are living resources that were depleted.')],
                 ['Helium is non-renewable. Water in the Aral Sea, bluefin tuna and bison were renewable, and were still depleted.'], DEP),
        ]),
        # 8. yield left
        slot('last', 'calc', 'num', [tpl('yield_left')]),
        # 9. decline three periods
        slot('deplete', 'calc', 'num', [tpl('decline3')]),
        # 10. percentage of area covered
        slot('cities', 'calc', 'num', [tpl('cover_area')]),
        # 11. match the time
        slot('time', 'recall', 'assign', [
            assign('Match each thing to how long it takes.',
                   [('Growing a wheat crop', 'Months'), ('Forming a few centimetres of soil', 'A few hundred to about a thousand years'),
                    ('Forming coal', 'Millions of years'), ('Losing the soil from a bare, ploughed field', 'It can be as little as a few years')],
                   ['Months', 'A few hundred to about a thousand years', 'Millions of years', 'It can be as little as a few years'],
                   ['Centuries to make, years to lose. A crop takes months, a few centimetres of soil a few hundred to about a thousand years, coal millions of years. Erosion can take soil in years.'], SOIL, 'time-order'),
        ]),
        # 12. renewable in practice
        slot('renew', 'recall', 'assign', [
            assign('Choose for each: renewable, or not renewable in practice. Think about the rate.', [], ['Renewable', 'Not renewable in practice'],
                   ['Renewable or not is about the rate. Cut no faster than it regrows, or caught no faster than they breed: renewable. Pumped out, or cut, or caught far faster than it is replaced, or taking centuries to form: not renewable in practice.'],
                   EARTH, 'renew-rate'),
        ]),
    ],
    'lists': {
        'rate_pool_renew': ['A forest cut no faster than it regrows', 'A fish stock caught no faster than the fish can breed', 'A river that rain refills within months'],
        'rate_pool_not': ['A forest cut far faster than it regrows', 'Deep, old groundwater pumped out far faster than it refills', 'Soil, which takes centuries to form but can be lost in years', 'Helium, which forms far slower than we use it'],
    },
}
