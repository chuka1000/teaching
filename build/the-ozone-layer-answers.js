/**
 * The Ozone Layer: the worksheet answers, in ONE place. Printed UPSIDE DOWN at the foot of the worksheet's last page (there is no Answers slide).
 * Every number comes from build/atmosphere.data.json (written by build/atmosphere-check.py from the real NASA Ozone Watch table).
 */
const DATA = require('./atmosphere.data.json');
const Z = DATA.l3;

module.exports = [
  ['1', 'stratosphere. ultraviolet.'],
  ['2', 'Any two of: skin cancer, cataracts, damaged crops, damaged plankton.'],
  ['3', 'True: the ozone layer absorbs ultraviolet light; it is high up; it is a thinning, not a hole. False: it is at ground level; it lets in heat.'],
  ['4', 'CFCs are used in fridges and aerosol cans 1, CFCs drift up into the stratosphere 2, ultraviolet light breaks the CFC apart and chlorine is released 3, chlorine atoms destroy ozone 4, the ozone over Antarctica gets very thin each spring 5.'],
  ['5', '1987. It phased out CFCs, every country joined, and the ozone layer is recovering.'],
  ['6', 'chlorine. chlorine.'],
  ['7', 'CFCs do not react near the ground, so they last and slowly drift up into the stratosphere. There, ultraviolet light breaks them apart and releases chlorine, which destroys ozone.'],
  ['8', 'Any two of: it phased out CFCs; every country joined; it set dates for the ban; it helped poorer countries pay for the change.'],
  ['9', 'A thinner ozone layer lets in more ultraviolet light, not more heat. Global warming is caused by greenhouse gases trapping heat. They are different problems.'],
  ['10', 'Your own place: the beach, a sunny playground, a holiday. Protection: sunscreen, a hat, shade, covering up, and checking the UV index.'],
  ['11', `${Z.area['2000']} − ${Z.area['1979']} = ${Z.rise_1979_2000} million km².`],
  ['12', `1979 to 2000: it grew fast, from ${Z.area['1979']} to ${Z.area['2000']} million km². 2000 to 2025: it has not kept growing. It goes up and down, between about ${Z.area['2025']} and ${Z.area['2006']} million km² in the years shown.`],
  ['13', 'Any three of: the science was clear; there was a replacement chemical industry could use; the harm was easy to see (skin cancer, the map of the hole); every country agreed; there were dates, and help for poorer countries.'],
  ['14', 'Your own example: a ban or law that changed what is sold (leaded petrol, plastic bags, smoking in public places). A law helps because everyone has to follow it at the same time.'],
];
module.exports.DATA = DATA;
