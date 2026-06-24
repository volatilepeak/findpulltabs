/**
 * Run from your project folder:
 *   node scripts/merge-florida.js
 * 
 * Merges Florida venues into src/data/locations.json
 */
const fs = require('fs');
const path = require('path');

const locPath = path.join(__dirname, '..', 'src', 'data', 'locations.json');
const flPath = path.join(__dirname, 'fl-locations.json');

const existing = JSON.parse(fs.readFileSync(locPath, 'utf8'));
const flVenues = JSON.parse(fs.readFileSync(flPath, 'utf8'));

console.log(`Existing locations: ${existing.length}`);
console.log(`Florida venues to add: ${flVenues.length}`);

const maxId = Math.max(...existing.map(l => l.id));
flVenues.forEach((v, i) => { v.id = maxId + 1 + i; });

const merged = [...existing, ...flVenues];
console.log(`Merged total: ${merged.length}`);

fs.writeFileSync(locPath, JSON.stringify(merged));
console.log('Updated src/data/locations.json');

const states = {};
merged.forEach(l => { states[l.state] = (states[l.state]||0)+1; });
console.log('By state:', states);
