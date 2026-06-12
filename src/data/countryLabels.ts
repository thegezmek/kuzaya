export interface CountryLabel {
  id: string;
  name: string;
  lat: number;
  lng: number;
  /** Primary labels match the large country names in Google Maps regional view. */
  tier: 'primary' | 'secondary';
  minZoom?: number;
  maxZoom?: number;
}

/** Film territories — custom labels (Google labels are hidden in map style). */
export const COUNTRY_LABELS: CountryLabel[] = [
  { id: 'kenya', name: 'Kenya', lat: 0.15, lng: 37.35, tier: 'primary' },
  { id: 'rwanda', name: 'Rwanda', lat: -1.92, lng: 29.78, tier: 'primary' },
];
