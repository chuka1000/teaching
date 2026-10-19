"""Levels 1 and 2 of the Earth Resources revision game: Recall it, and Use it."""
from earth_resources_helpers import *

LAND, SOIL, CITY, EARTH, LAST, DEP = ('What The Land Gives Us', 'Losing The Soil', 'Cities And What Can Be Done', 'What The Earth Gives Us', 'Making It Last', 'Resource Depletion')

SOIL_PARTS = 'Soil has four parts: broken rock (ground down by weather over a very long time), dead organic matter (broken down by decomposers into humus), water and air (held in the gaps between particles) and living organisms (bacteria, fungi, worms and insects).'

# ------------------------------------------------------------------------------------------------------------------------------------- LEVEL 1
LEVEL1 = {
    'name': 'Recall it',
    'blurb': 'This is the lesson itself, one question from each part of the unit. Everyone should finish it with green dots.',
    'slots': [
        # 1. what soil is made of: tap the four parts
        slot('soil', 'recall', 'build', [
            build('Tap the four things that soil is made of.', ['Broken rock', 'Dead organic matter', 'Water and air', 'Living organisms'],
                  ['Coal', 'Concrete', 'Plastic', 'Pure sand', 'Metal', 'Salt'], 4, [SOIL_PARTS], LAND, 'soil-parts'),
        ]),
        # 2. how long things take
        slot('time', 'recall', 'order', [
            order('Put these in order, from the QUICKEST to the SLOWEST to form or grow.', ['{crop}', 'A few centimetres of soil', 'Coal'],
                  ['A crop takes months. A few centimetres of soil take a few hundred to about a thousand years. Coal takes millions of years.'], LAND, 'time-order', 'quickest', 'slowest'),
        ]),
        # 3. what a natural resource is
        slot('renew', 'recall', 'mc', [
            mc('What is a natural resource?', 'Something from the Earth, not made by people, that we use.',
               [('Anything that people use every day, such as phones and cars.', 'resource-def', 'People use phones every day, but people made them. A natural resource comes from the Earth.'),
                ('Anything made in a factory from metal or plastic.', 'resource-def', 'A natural resource is not made by people. A factory product is.'),
                ('Only things that can never run out, however much we use.', 'resource-def', 'Many natural resources can run out. That is what the rest of the unit is about.')],
               ['A natural resource comes from the Earth and is not made by people.'], EARTH),
            mc('Which of these is a natural resource itself, not something made by people?', 'Oil',
               [('A phone', 'resource-def', 'People made it. The oil, metals and minerals inside it are the natural resources.'),
                ('A plastic bottle', 'resource-def', 'People made it, from oil. The oil is the natural resource.'),
                ('A tarmac road', 'resource-def', 'People made it, from stone and oil. Those are the natural resources.')],
               ['Oil comes from the Earth and nobody made it. A phone, a bottle and a road are all made by people, from natural resources.'], EARTH),
        ]),
        # 4. renewable or non-renewable
        slot('renew', 'recall', 'assign', [
            assign('Choose renewable or non-renewable for each.', [], ['Renewable', 'Non-renewable'],
                   ['Solar and wind energy are renewable: the Sun and wind supply far more than we could ever use up. Coal, oil, natural gas and metal ores take millions of years to form, far slower than we use them, so they are non-renewable.'],
                   EARTH, 'renew-class'),
        ]),
        # 5. erosion
        slot('erosion', 'recall', 'mc', [
            mc('What is erosion?', 'Soil worn away and carried off by water or wind.',
               [('Soil getting loose when it is ploughed.', 'eros-loosen', 'Loosening is only half of it. In erosion the soil is also carried off.'),
                ('New soil forming slowly from rock.', 'eros-formation', 'That is soil formation, which takes centuries. Erosion is soil being lost.'),
                ('Fertile land in a dry area slowly turning into desert.', 'desert-spreads', 'That is desertification. Erosion is soil being worn away and carried off.')],
               ['Erosion has two parts: soil is worn away AND carried off, by water or wind.'], SOIL),
            mc('Which two things carry soil away in erosion?', 'Water and wind',
               [('Roots and leaves', 'cover', 'Roots and leaves protect soil. They hold it in place.'),
                ('Worms and insects', 'eros-agents', 'Worms and insects live in soil and help it. They do not carry it away.'),
                ('Heat and cold', 'eros-agents', 'Not the two the lesson named. Water and wind carry soil off.')],
               ['Water and wind carry soil away.'], SOIL),
        ]),
        # 6. urbanisation
        slot('cities', 'recall', 'mc', [
            mc('What is urbanisation?', 'Towns and cities growing, with a bigger share of people living in them.',
               [('Cities getting hotter and more polluted because of all the new concrete.', 'urban-def', 'Cities can be hotter, but that is an effect. Urbanisation is towns and cities growing.'),
                ('People moving out of the cities and back into the countryside.', 'urban-def', 'That is the opposite. In urbanisation a bigger share of people live in towns and cities.'),
                ('Building one new road across a large area of farmland and fields.', 'urban-def', 'One road is a change to land. Urbanisation is about the share of people in towns and cities.')],
               ['Urbanisation has two halves: towns and cities grow, AND a bigger share of people live in them.'], CITY),
            mc('In 1950 about 20 in every 100 people lived in a city. Now about 45 in every 100 do. What is this change called?', 'Urbanisation',
               [('Erosion', 'urban-def', 'Erosion is soil worn away and carried off by water or wind.'),
                ('Desertification', 'urban-def', 'Desertification is land degradation in dry areas.'),
                ('Conservation', 'urban-def', 'Conservation is using a resource carefully so it lasts.')],
               ['A bigger share of people living in towns and cities is urbanisation.'], CITY),
        ]),
        # 7. conservation and sustainable
        slot('last', 'recall', 'mc', [
            mc('What does conservation mean?', 'Managing a resource carefully so it is still there in future.',
               [('Never using a resource at all, so that it is never touched.', 'conserve-never', 'Conservation is careful use, not no use.'),
                ('Using a resource as fast as possible while it lasts.', 'conserve-never', 'That is the opposite. Conservation makes a resource last.'),
                ('Making a new natural resource in a factory from other materials.', 'resource-def', 'People cannot make a natural resource. Conservation protects what we have.')],
               ['Conservation means protecting and managing a resource carefully so it is still available in future.'], LAST),
            mc('What does it mean to take a sustainable amount of a resource?', 'No more than the resource can naturally replace.',
               [('Nothing at all, so that none is ever used.', 'sustainable-nothing', 'Sustainable does not mean nothing is taken. It means the stock does not shrink.'),
                ('As much as people want, for as long as they can get it.', 'sustainable-nothing', 'That is likely to deplete the resource. Sustainable means no more than is replaced.'),
                ('Half of whatever is left each year.', 'sustainable-nothing', 'Taking half each year would soon run it down. Sustainable means no more than is replaced.')],
               ['A sustainable amount is no more than the resource can naturally replace.'], LAST),
        ]),
        # 8. depletion
        slot('deplete', 'recall', 'mc', [
            mc('What does resource depletion mean?', 'Using a resource faster than it is replaced, until not enough is left.',
               [('A resource getting cheaper and cheaper because there is so much of it.', 'deplete-def', 'Depletion is about running low, not about price.'),
                ('A resource being moved from one country to another by ship.', 'deplete-def', 'Depletion is use outrunning replacement, wherever the resource is.'),
                ('A resource being used up completely in a single day or week.', 'deplete-def', 'It is not one event. It is use outrunning replacement for long enough.')],
               ['Depletion is use outrunning replacement for long enough that the amount left stops being enough.'], DEP),
            mc('By the 1870s one flock of passenger pigeons was thought to hold over 3 billion birds. By 1914, how many were left in the world?', 'None. They were extinct.',
               [('About 3 million birds.', 'big-number-safe', 'Far fewer. The last one, Martha, died in the Cincinnati Zoo on 1 September 1914.'),
                ('About 3,000 birds.', 'big-number-safe', 'Fewer still. By 1914 there were none.'),
                ('A few hundred birds.', 'big-number-safe', 'Fewer. The bison fell to a few hundred, but the passenger pigeon went to zero.')],
               ['The last passenger pigeon, Martha, died on 1 September 1914. Billions of birds were used faster than they could breed, until none were left.'], DEP),
        ]),
        # 9. how long soil and coal take
        slot('time', 'recall', 'mc', [
            mc('Roughly how long do a few centimetres of soil take to form?', 'A few hundred to about a thousand years.',
               [('A few months, about the same as a crop.', 'time-fast', 'That is a crop. Soil takes centuries.'),
                ('A few years, so soil is quick to replace.', 'time-fast', 'Soil can be lost in years, but it takes centuries to form.'),
                ('Millions of years, about the same as coal.', 'time-coal', 'That is coal. A few centimetres of soil take a few hundred to about a thousand years.')],
               ['A few centimetres of soil take a few hundred to about a thousand years to form.'], SOIL),
            mc('Roughly how long does coal take to form?', 'Millions of years.',
               [('A few hundred years.', 'time-soil', 'That is nearer soil: a few hundred to about a thousand years.'),
                ('A few thousand years.', 'time-soil', 'Coal is much slower than that.'),
                ('A few years.', 'time-fast', 'Coal takes millions of years. A few years would be far too fast.')],
               ['Coal takes millions of years to form. That is why it is non-renewable.'], LAND),
        ]),
        # 10. what protects soil
        slot('erosion', 'recall', 'mc', [
            mc('In the tray practical, one tray of soil was bare and one was covered with turf or leaves. Water was poured over both. Which tray usually lost more soil?', 'The bare tray.',
               [('The covered tray.', 'cover', 'Roots and leaves protect soil from the water, so the covered tray lost less.'),
                ('Both lost exactly the same.', 'cover', 'Not usually. Plant cover protects soil, so the bare tray lost more.'),
                ('Neither lost any soil.', 'cover', 'The bare tray lost soil. Water carried it into the catch pot.')],
               ['The bare tray usually loses more soil. Roots and leaves protect soil.'], SOIL),
            mc('Which of these protects soil from erosion?', 'Plant roots and leaves',
               [('Ploughing the field again and again', 'cover', 'Ploughing leaves soil bare and loose. That makes erosion easier.'),
                ('Leaving the soil bare all winter', 'cover', 'Bare soil is the easiest to erode.'),
                ('Letting too many animals graze on it', 'cover', 'Too many animals strip the plants off, and the soil is left bare.')],
               ['Roots hold soil in place and leaves shield it from rain. Remove them and the soil can be carried off.'], SOIL),
        ]),
    ],
    # level 1 draws for some of the slots (the engine reads these)
    'lists': {
        'crops': ['A wheat crop', 'A rice crop', 'A field of potatoes', 'A maize crop'],
        'renew_pool': [('Solar energy', 'Renewable'), ('Wind energy', 'Renewable')],
        'nonrenew_pool': [('Coal', 'Non-renewable'), ('Oil', 'Non-renewable'), ('Natural gas', 'Non-renewable'), ('A metal ore', 'Non-renewable')],
    },
}

# ------------------------------------------------------------------------------------------------------------------------------------- LEVEL 2
LEVEL2 = {
    'name': 'Use it',
    'blurb': 'One step further. Match, order, choose, and do the first calculations.',
    'slots': [
        # 1. match soil parts and descriptions
        slot('soil', 'recall', 'assign', [
            assign('Match each part of soil to what it is or does.',
                   [('Broken rock', 'Ground down by weather over a very long time'), ('Dead organic matter', 'Broken down by decomposers into humus'),
                    ('Water and air', 'Held in the gaps between particles'), ('Living organisms', 'Bacteria, fungi, worms and insects')],
                   ['Ground down by weather over a very long time', 'Broken down by decomposers into humus', 'Held in the gaps between particles', 'Bacteria, fungi, worms and insects'],
                   [SOIL_PARTS], LAND, 'soil-parts'),
            assign('Match each description to the part of soil it belongs to.',
                   [('Ground down by weather over a very long time', 'Broken rock'), ('Broken down by decomposers into humus', 'Dead organic matter'),
                    ('Held in the gaps between particles', 'Water and air'), ('Bacteria, fungi, worms and insects', 'Living organisms')],
                   ['Broken rock', 'Dead organic matter', 'Water and air', 'Living organisms'],
                   [SOIL_PARTS], LAND, 'soil-parts'),
        ]),
        # 2. one part, in a sentence
        slot('soil', 'recall', 'mc', [
            mc('Which part of soil is made when decomposers break down dead plants and animals?', 'Humus, which is dead organic matter.',
               [('Broken rock, ground down by weather.', 'soil-parts', 'Broken rock is ground down by weather over a very long time, not by decomposers.'),
                ('Water and air, held between the particles.', 'soil-parts', 'Water and air sit in the gaps between the particles. They are not made by decomposers.'),
                ('Nothing. Decomposers do not change soil at all.', 'soil-forget-life', 'Decomposers break dead organic matter into humus. It is one of the four parts of soil.')],
               ['Decomposers break dead organic matter down into humus. That is one of the four parts of soil.'], LAND),
            mc('Where are the water and the air in soil held?', 'In the gaps between the particles.',
               [('Inside the pieces of broken rock themselves.', 'soil-parts', 'The rock pieces are solid. The water and air are in the gaps between them.'),
                ('Only in the layer of dead leaves on top.', 'soil-parts', 'Water and air are throughout the soil, in the gaps between the particles.'),
                ('Nowhere. Soil is solid all the way through.', 'soil-rock-only', 'Soil has water and air in the gaps between its particles. It is one of its four parts.')],
               ['Water and air are held in the gaps between the particles of soil.'], LAND),
        ]),
        # 3. soil formation arithmetic
        slot('time', 'calc', 'num', [tpl('time_form')]),
        # 4. sustainable yield
        slot('last', 'calc', 'num', [tpl('yield')]),
        # 5. percentage points
        slot('renew', 'calc', 'num', [tpl('pctpoints')]),
        # 6. percentage decrease
        slot('renew', 'calc', 'num', [tpl('pctdec')]),
        # 7. renewable by rate
        slot('renew', 'recall', 'mc', [
            mc('A forest is cut down no faster than it regrows. Is the wood a renewable resource?', 'Yes. It is replaced as fast as it is used.',
               [('No. Once a tree is cut down it is gone for good.', 'can-regrow', 'That tree is gone, but the forest regrows. The resource is the forest.'),
                ('No. Wood can never be a renewable resource.', 'can-regrow', 'Wood can be renewable, if the forest is cut no faster than it regrows.'),
                ('It depends only on what kind of tree it is.', 'renewable-rate', 'It depends on the RATE: how fast it is replaced against how fast it is used.')],
               ['A forest cut no faster than it regrows is renewable. Renewable or not is about the rate.'], EARTH),
            mc('A fish stock is caught faster than the fish can breed. What happens to the number of fish over time?', 'It falls, and it could run out.',
               [('It stays the same, because fish are a renewable resource.', 'renewable-rate', 'Renewable does not mean it cannot run out. It means it CAN be replaced, if it is used slowly enough.'),
                ('It grows, because the fish keep breeding.', 'renewable-rate', 'Breeding is slower than the catch, so the number falls.'),
                ('It stays the same until every fish has gone.', 'renewable-rate', 'The stock falls as the fish are caught faster than they breed.')],
               ['Caught faster than they breed, the fish fall in number. Caught fast enough for long enough, the stock could run out.'], EARTH),
        ]),
        # 8. chains in order
        slot('erosion', 'recall', 'order', [
            order('Put the chain in order, from farming to desertification.',
                  ['Farmers remove the plant cover', 'The soil is left bare', 'Wind and water carry the soil away', 'In a dry area the land turns desert-like'],
                  ['Farming removes plant cover, the soil is left bare, wind and water erode it, and in a dry area the land turns desert-like. That is desertification.'], SOIL, 'chain-order', 'first', 'last'),
            order('Put the tray practical in order, from the set-up to the result.',
                  ['Set up two trays with the same soil and slope, and cover one', 'Predict which tray will lose more soil', 'Pour the same amount of water over both trays', 'Compare the soil and water in the two catch pots'],
                  ['Set up fairly (the same soil and slope), predict, pour the same amount of water, then compare what reached the catch pots. The bare tray usually loses more soil.'], SOIL, 'practical-order', 'first', 'last'),
        ]),
        # 9. runoff
        slot('cities', 'recall', 'mc', [
            mc('What is runoff?', 'Rain that flows over the ground instead of soaking in.',
               [('Rain that soaks deep down into the soil and rock.', 'runoff', 'That is the opposite. Runoff is rain that does NOT soak in.'),
                ('Rain water that is collected from roofs and stored in a tank.', 'runoff', 'Runoff is not stored. It flows over the surface.'),
                ('Soil that is washed out of a field by heavy rain.', 'eros-loosen', 'That is erosion. Runoff is the rain that flows over the surface.')],
               ['Runoff is rain that flows over the ground instead of soaking in.'], CITY),
            mc('What happens to rain that falls on a road?', 'It cannot soak in, so it runs off into the drains.',
               [('It soaks into the tarmac, like water into a sponge.', 'runoff', 'Tarmac is sealed. Rain cannot soak in.'),
                ('It turns into soil on the road surface.', 'runoff', 'Rain does not turn into soil.'),
                ('It stays where it falls for several weeks.', 'runoff', 'It runs off into drains, or floods the street.')],
               ['Rain cannot soak into a road. It runs off into the drains.'], CITY),
        ]),
        # 10. match place or word to description
        slot('cities', 'recall', 'assign', [
            assign('Match each place or word to what it is.',
                   [('Wuhan', 'A sponge city that lets rain soak in'), ('The London Green Belt', 'A ring of land kept from being built on'),
                    ('Brownfield land', 'Land that has been built on before'), ('Urbanisation', 'More of the people living in towns and cities')],
                   ['A sponge city that lets rain soak in', 'A ring of land kept from being built on', 'Land that has been built on before', 'More of the people living in towns and cities'],
                   ['Wuhan is a sponge city with permeable paving, rain gardens and green roofs. The London Green Belt is a ring of land round London kept from being built on. Brownfield land has been built on before. Urbanisation is a bigger share of people in towns and cities.'], CITY, 'city-terms'),
        ]),
        # 11. repeated decline, two periods
        slot('deplete', 'calc', 'num', [tpl('decline2')]),
        # 12. method for a problem
        slot('last', 'recall', 'assign', [
            assign('Match each problem to the method that would best prevent depletion.',
                   [('A fish stock is being caught faster than it can breed.', 'A catch quota below the sustainable yield'),
                    ('A forest is being cut faster than it regrows.', 'Replant trees at least as fast as they are cut'),
                    ('A non-renewable material is running low.', 'Recycle what has already been extracted'),
                    ('A wild species is too few to find mates easily.', 'A breeding programme to raise young and release them')],
                   ['A catch quota below the sustainable yield', 'Replant trees at least as fast as they are cut', 'Recycle what has already been extracted', 'A breeding programme to raise young and release them'],
                   ['Match the method to the kind of resource: quotas for fish that breed, replanting for forests, recycling for materials that do not regrow, breeding programmes for populations that have fallen very low.'], LAST, 'method-match'),
        ]),
    ],
}
