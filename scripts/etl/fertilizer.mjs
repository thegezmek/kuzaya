import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, '../../public/data/view2-fertilizer.json');
const API_URL =
  'https://api.worldbank.org/v2/country/KEN;RWA;ETH;TZA;UGA/indicator/AG.CON.FERT.ZS?format=json&per_page=500';

const ISO_MAP = {
  KEN: 'kenya',
  RWA: 'rwanda',
  ETH: 'ethiopia',
  TZA: 'tanzania',
  UGA: 'uganda',
};

function seriesForCountry(records, iso) {
  return records
    .filter((r) => r.countryiso3code === iso && r.value != null)
    .map((r) => ({ year: Number(r.date), value: Number(r.value) }))
    .sort((a, b) => a.year - b.year);
}

const res = await fetch(API_URL);
if (!res.ok) throw new Error(`World Bank API failed: ${res.status}`);

const [, records] = await res.json();
const series = {};

for (const [iso, key] of Object.entries(ISO_MAP)) {
  series[key] = seriesForCountry(records, iso);
}

const payload = {
  generatedAt: new Date().toISOString().slice(0, 10),
  indicator: 'AG.CON.FERT.ZS',
  label: 'Fertilizer consumption (kg nutrients per hectare of arable land)',
  unit: 'kg/ha',
  source: 'Our World in Data (FAO-sourced via World Bank)',
  url: 'https://ourworldindata.org/grapher/fertilizer-use-per-area-of-cropland',
  chartFromYear: 2000,
  series,
};

writeFileSync(OUT_PATH, `${JSON.stringify(payload, null, 2)}\n`);

const counts = Object.entries(series)
  .map(([k, v]) => `${k}: ${v.length}`)
  .join(', ');
console.log(`Wrote ${OUT_PATH} (${counts})`);
