import fs from 'fs';
import { feature, mesh } from 'topojson-client';
import { geoAlbersUsa, geoPath } from 'd3-geo';
const us = JSON.parse(fs.readFileSync('node_modules/us-atlas/states-10m.json'));
const states = feature(us, us.objects.states);
const proj = geoAlbersUsa().fitExtent([[60, 60], [1240, 760]], states);
const path = geoPath(proj);
const nation = path(feature(us, us.objects.nation));
const borders = path(mesh(us, us.objects.states, (a, b) => a !== b));
const cities = { Dallas: [-96.797, 32.777], Plano: [-96.699, 33.020], Tucson: [-110.975, 32.222], Charlotte: [-80.843, 35.227],
  Denver: [-104.990, 39.739], 'Los Angeles': [-118.244, 34.052], 'San Diego': [-117.161, 32.716], Phoenix: [-112.074, 33.448], Seattle: [-122.33, 47.61], Chicago: [-87.63, 41.88], Manchester: [-72.52, 41.78], Tampa: [-82.46, 27.95], 'Long Island': [-73.3, 40.79], Houston: [-95.37, 29.76], Sacramento: [-121.49, 38.58], Detroit: [-83.05, 42.33], 'Auburn Hills': [-83.23, 42.69], Roanoke: [-79.94, 37.27], Raleigh: [-78.64, 35.78] };
const pts = Object.fromEntries(Object.entries(cities).map(([k, v]) => [k, proj(v).map(n => Math.round(n))]));
const byName = {};
for (const f of states.features) byName[f.properties.name] = path(f);
fs.writeFileSync('usmap.json', JSON.stringify({ w: 1300, h: 820, nation, borders, pts, states: byName }));
console.log('ok', Object.keys(byName).length, pts);
