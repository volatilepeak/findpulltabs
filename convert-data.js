const fs = require('fs');

// Use Function constructor to eval safely
function loadJsArray(filepath, varName) {
  const raw = fs.readFileSync(filepath, 'utf8');
  // Remove module.exports line if present
  const cleaned = raw.replace(/if\s*\(typeof module.*\n.*\n.*\}/s, '');
  const fn = new Function(cleaned + `; return ${varName};`);
  return fn();
}

const mnData = loadJsArray('/mnt/user-data/uploads/locations-data.js', 'LOCATIONS_DATA');
const akData = loadJsArray('/mnt/user-data/uploads/alaska-data.js', 'alaskaLocations');
const iaData = loadJsArray('/mnt/user-data/uploads/iowa-data.js', 'iowaLocations');
const wiData = loadJsArray('/mnt/user-data/uploads/wisconsin-data.js', 'wisconsinLocations');

console.log(`MN: ${mnData.length}, AK: ${akData.length}, IA: ${iaData.length}, WI: ${wiData.length}`);

function normalize(loc, state) {
  return {
    id: 0,
    name: loc.name || '',
    organization: loc.organization || '',
    address: loc.address || '',
    city: loc.city || 'Unknown',
    state: loc.state || state,
    county: loc.county || '',
    zip: loc.zip || '',
    type: loc.type || 'other',
    lat: loc.lat,
    lng: loc.lng,
    verified: loc.verified || false,
    confirmations: loc.confirmations || 0,
    hasBingo: loc.hasBingo || false,
    hasPullTabs: loc.hasPullTabs !== false,
  };
}

const all = [
  ...mnData.map(l => normalize(l, 'MN')),
  ...akData.map(l => normalize(l, 'AK')),
  ...iaData.map(l => normalize(l, 'IA')),
  ...wiData.map(l => normalize(l, 'WI')),
];
all.forEach((loc, i) => loc.id = i + 1);

const types = new Set();
all.forEach(l => types.add(l.type));
console.log('Types:', [...types]);
console.log(`Total: ${all.length}`);

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const index = {};
all.forEach(l => {
  const ss = l.state.toLowerCase();
  if (!index[ss]) index[ss] = {};
  const cs = slugify(l.city);
  if (!index[ss][cs]) index[ss][cs] = { name: l.city, count: 0 };
  index[ss][cs].count++;
});

Object.keys(index).forEach(s => console.log(`${s}: ${Object.keys(index[s]).length} cities`));

fs.writeFileSync('src/data/locations.json', JSON.stringify(all));
fs.writeFileSync('src/data/index.json', JSON.stringify(index, null, 2));
console.log('Done!');
