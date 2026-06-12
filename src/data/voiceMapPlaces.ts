import type { Country } from './locations';

export interface VoiceMapPosition {
  lat: number;
  lng: number;
  country: Country;
}

/** Map hubs derived from kuzaya-voices-profiles.md (2026-06-10). */
export type VoiceMapPlace =
  | 'kajiado'
  | 'homa-bay'
  | 'uasin-gishu'
  | 'embu'
  | 'nairobi'
  | 'icipe'
  | 'kabete'
  | 'mukuru'
  | 'karen'
  | 'riverside'
  | 'rosslyn'
  | 'naivasha'
  | 'kiambu'
  | 'kigali'
  | 'kinigi';

/** Profile `location` field → map hub (kuzaya-voices-profiles.md). */
export const VOICE_LOCATION_TO_PLACE: Record<string, VoiceMapPlace> = {
  'Kajiado (Tinga)': 'kajiado',
  'Homa Bay': 'homa-bay',
  'Eldoret (Uasin Gishu)': 'uasin-gishu',
  'Embu (Bata)': 'embu',
  Embu: 'embu',
  'Nairobi (ICIPE, Kasarani)': 'icipe',
  'Nairobi (ICIPE)': 'icipe',
  'Nairobi (Mukuru & Githurai)': 'mukuru',
  'Nairobi (likely University of Nairobi — not confirmed)': 'nairobi',
  'Nairobi (UoN Kabete)': 'kabete',
  Naivasha: 'naivasha',
  'Nairobi (also Rwanda)': 'nairobi',
  'Nairobi (Holland Greentech HQ)': 'nairobi',
  'Nairobi (and Busia nursery)': 'nairobi',
  'Kinigi, Rwanda': 'kinigi',
  'Nairobi area (Kiambu)': 'kiambu',
  'Nairobi (Riverside)': 'riverside',
  'Nairobi (Karen)': 'karen',
  'Kigali, Rwanda': 'kigali',
  'Nairobi (Rosslyn)': 'rosslyn',
  Nairobi: 'nairobi',
  'Nairobi (Rosslyn Farmers Market)': 'rosslyn',
};

/** Voice-only anchors — production city pins in locations.ts stay untouched. */
const MAP_PLACES: Record<VoiceMapPlace, VoiceMapPosition> = {
  kajiado: { lat: -2.098, lng: 36.782, country: 'kenya' },
  'homa-bay': { lat: -0.5273, lng: 34.4571, country: 'kenya' },
  'uasin-gishu': { lat: 0.5143, lng: 35.2698, country: 'kenya' },
  embu: { lat: -0.5395, lng: 37.4574, country: 'kenya' },
  nairobi: { lat: -1.2864, lng: 36.8172, country: 'kenya' },
  icipe: { lat: -1.2195, lng: 36.8946, country: 'kenya' },
  kabete: { lat: -1.246, lng: 36.741, country: 'kenya' },
  mukuru: { lat: -1.305, lng: 36.878, country: 'kenya' },
  karen: { lat: -1.3194, lng: 36.7078, country: 'kenya' },
  riverside: { lat: -1.269, lng: 36.799, country: 'kenya' },
  rosslyn: { lat: -1.198, lng: 36.803, country: 'kenya' },
  naivasha: { lat: -0.717, lng: 36.431, country: 'kenya' },
  kiambu: { lat: -1.0333, lng: 37.0693, country: 'kenya' },
  kigali: { lat: -1.9403, lng: 30.0588, country: 'rwanda' },
  kinigi: { lat: -1.4721, lng: 29.5564, country: 'rwanda' },
};

/** Hubs that share coordinates with orange production pins — voices cluster nearby, not on top. */
const PRODUCTION_HUB_NUDGE: Partial<Record<VoiceMapPlace, { lat: number; lng: number }>> = {
  kajiado: { lat: 0.016, lng: 0.022 },
  'homa-bay': { lat: 0.014, lng: -0.02 },
  'uasin-gishu': { lat: -0.013, lng: 0.021 },
  embu: { lat: 0.015, lng: -0.017 },
  kiambu: { lat: -0.014, lng: 0.019 },
  kigali: { lat: 0.012, lng: -0.018 },
  kinigi: { lat: -0.015, lng: 0.016 },
  nairobi: { lat: 0.011, lng: 0.02 },
};

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

function hubSeed(place: VoiceMapPlace): number {
  return place.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

/** Irregular tight cluster — keeps voices near their hub without stacking. */
function voiceSpreadOffset(place: VoiceMapPlace, slot: number): { lat: number; lng: number } {
  const seed = hubSeed(place);
  const angle = slot * GOLDEN_ANGLE + seed * 0.13;
  const radius = 0.0085 * Math.sqrt(slot + 1);

  return {
    lat: Math.cos(angle) * radius,
    lng: Math.sin(angle) * radius * 1.12,
  };
}

export function voiceMapPlaceForLocation(location: string): VoiceMapPlace {
  const place = VOICE_LOCATION_TO_PLACE[location];
  if (!place) {
    throw new Error(`Unknown voice location in profiles: "${location}"`);
  }
  return place;
}

export function voiceMapPosition(place: VoiceMapPlace, slot = 0): VoiceMapPosition {
  const base = MAP_PLACES[place];
  const nudge = PRODUCTION_HUB_NUDGE[place] ?? { lat: 0, lng: 0 };
  const spread = voiceSpreadOffset(place, slot);

  return {
    lat: base.lat + nudge.lat + spread.lat,
    lng: base.lng + nudge.lng + spread.lng,
    country: base.country,
  };
}

export function voiceMapPositionForLocation(location: string, slot = 0): VoiceMapPosition {
  return voiceMapPosition(voiceMapPlaceForLocation(location), slot);
}

/** Assign spread slots for voices sharing the same map hub. */
export function assignVoiceMapPositions<T extends { location: string }>(
  people: T[],
): (T & { map: VoiceMapPosition })[] {
  const hubSlots = new Map<VoiceMapPlace, number>();

  return people.map((person) => {
    const place = voiceMapPlaceForLocation(person.location);
    const slot = hubSlots.get(place) ?? 0;
    hubSlots.set(place, slot + 1);
    return { ...person, map: voiceMapPosition(place, slot) };
  });
}
