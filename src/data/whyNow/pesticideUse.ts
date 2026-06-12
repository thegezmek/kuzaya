import type { FertilizerCountryId, FertilizerPoint } from './types';

const YEARS = [
  2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013,
  2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023,
] as const;

const VALUES: Record<'kenya' | 'rwanda' | 'ethiopia' | 'uganda', readonly number[]> = {
  kenya: [
    0.36, 0.33, 0.3, 0.31, 0.32, 0.37, 0.38, 0.33, 0.37, 0.36, 0.45, 0.47, 0.57, 0.64, 0.66,
    0.68, 0.67, 0.77, 0.83, 0.89, 0.84, 0.7, 0.69, 0.69,
  ],
  rwanda: [
    0.11, 0.05, 0.07, 0.1, 0.11, 0.16, 0.2, 0.28, 0.22, 0.81, 0.64, 0.12, 0.6, 1.17, 1.29,
    1.56, 1.27, 1.27, 1.31, 1.35, 1.3, 1.25, 1.28, 1.35,
  ],
  ethiopia: [
    0.06, 0.06, 0.08, 0.09, 0.09, 0.1, 0.18, 0.17, 0.16, 0.25, 0.26, 0.25, 0.25, 0.25, 0.24,
    0.24, 0.24, 0.24, 0.23, 0.23, 0.22, 0.22, 0.22, 0.22,
  ],
  uganda: [
    0.22, 0.19, 0.17, 0.17, 0.2, 0.21, 0.25, 0.25, 0.26, 0.28, 0.33, 0.4, 0.48, 0.54, 0.62,
    0.69, 0.69, 0.69, 0.66, 0.69, 0.66, 0.77, 0.92, 1.05,
  ],
};

function toSeries(values: readonly number[]): FertilizerPoint[] {
  return YEARS.map((year, index) => ({ year, value: values[index] }));
}

export const PESTICIDE_COUNTRY_ORDER = [
  'kenya',
  'rwanda',
  'ethiopia',
  'uganda',
] as const satisfies readonly FertilizerCountryId[];

export type PesticideCountryId = (typeof PESTICIDE_COUNTRY_ORDER)[number];

export const pesticideUseView = {
  title: 'Pesticide use per hectare of cropland, 2000 to 2023',
  unitLabel: 'kg pesticides per hectare of cropland',
  source: 'FAO via Our World in Data',
  url: 'https://ourworldindata.org/grapher/pesticide-use-per-hectare-of-cropland?tab=line&time=2000..latest&country=KEN~RWA~UGA~ETH',
  note: 'Tanzania omitted: no pesticide use data reported to FAO for this period',
  chartFromYear: 2000,
  yMax: 1.5,
  series: Object.fromEntries(
    PESTICIDE_COUNTRY_ORDER.map((id) => [id, toSeries(VALUES[id])]),
  ) as Record<PesticideCountryId, FertilizerPoint[]>,
};
