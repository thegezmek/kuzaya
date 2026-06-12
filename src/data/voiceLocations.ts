import { getVisiblePeople } from './voices';
import type { Country } from './locations';

export interface VoiceMapPoint {
  id: string;
  name: string;
  role: string;
  location: string;
  bio: string;
  lat: number;
  lng: number;
  country: Country;
  linkedin?: string;
  photoSrc?: string;
}

export const VOICE_MARKER_PREFIX = 'voice:';

export function voiceMarkerId(id: string): string {
  return `${VOICE_MARKER_PREFIX}${id}`;
}

export function isVoiceMarkerId(id: string): boolean {
  return id.startsWith(VOICE_MARKER_PREFIX);
}

export function voiceIdFromMarker(markerId: string): string {
  return markerId.slice(VOICE_MARKER_PREFIX.length);
}

export const voiceMapPoints: VoiceMapPoint[] = getVisiblePeople().map((person) => ({
  id: person.id,
  name: person.name,
  role: person.role,
  location: person.location,
  bio: person.bio,
  lat: person.map.lat,
  lng: person.map.lng,
  country: person.map.country,
  linkedin: person.linkedin,
  photoSrc: person.photoSrc,
}));
