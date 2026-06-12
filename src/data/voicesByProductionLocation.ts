import { voicePeople, type Voice } from './voices';
import { voiceMapPlaceForLocation, type VoiceMapPlace } from './voiceMapPlaces';

/** Voice map hub → nearest production location pin on the map. */
const VOICE_PLACE_TO_PRODUCTION_ID: Record<VoiceMapPlace, string> = {
  kajiado: 'kajiado',
  'homa-bay': 'homa-bay',
  'uasin-gishu': 'uasin-gishu',
  embu: 'embu',
  nairobi: 'nairobi',
  icipe: 'nairobi',
  kabete: 'nairobi',
  mukuru: 'nairobi',
  karen: 'nairobi',
  riverside: 'nairobi',
  rosslyn: 'nairobi',
  naivasha: 'nairobi',
  kiambu: 'thika',
  kigali: 'kigali',
  kinigi: 'kinigi',
};

export function productionLocationIdForVoice(voice: Voice): string {
  const place = voiceMapPlaceForLocation(voice.location);
  return VOICE_PLACE_TO_PRODUCTION_ID[place];
}

export function voicesForProductionLocation(locationId: string): Voice[] {
  return voicePeople.filter(
    (person) => productionLocationIdForVoice(person) === locationId,
  );
}
