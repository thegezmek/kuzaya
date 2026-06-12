import { locations, type Location } from '../data/locations';

/** Filming journey — narrative visit order (Kenya → Rwanda). */
export const JOURNEY_ORDER: string[] = [
  'nairobi',
  'homa-bay',
  'uasin-gishu',
  'kirinyaga',
  'embu',
  'kajiado',
  'thika',
  'kigali',
  'kinigi',
];

export const RWANDA_BOUNDS = {
  west: 28.861,
  south: -2.839,
  east: 30.899,
  north: -1.047,
} as const;

/** Kenya administrative extent (WGS84). */
export const KENYA_BOUNDS = {
  west: 33.9098,
  south: -4.6774,
  east: 41.9074,
  north: 5.0199,
} as const;

/** Kenya + Rwanda — map pan/zoom and corridor scroll extent. */
export const KENYA_RWANDA_BOUNDS = {
  west: RWANDA_BOUNDS.west,
  south: KENYA_BOUNDS.south,
  east: KENYA_BOUNDS.east,
  north: KENYA_BOUNDS.north,
} as const;

export const REGION_BOUNDS = KENYA_RWANDA_BOUNDS;

/** Default map centroid between Kenya and Rwanda. */
export const KENYA_RWANDA_VIEW = {
  lat: (KENYA_RWANDA_BOUNDS.south + KENYA_RWANDA_BOUNDS.north) / 2,
  lng: (KENYA_RWANDA_BOUNDS.west + KENYA_RWANDA_BOUNDS.east) / 2,
} as const;

/** Google Maps Kenya place centroid (google.com/maps/place/Kenya). */
export const KENYA_VIEW = {
  lat: -0.023559,
  lng: 37.906193,
} as const;

export const KENYA_BOUNDS_BOX: [[number, number], [number, number]] = [
  [KENYA_BOUNDS.west, KENYA_BOUNDS.south],
  [KENYA_BOUNDS.east, KENYA_BOUNDS.north],
];

export const KENYA_CENTER = {
  lat: KENYA_VIEW.lat,
  lng: KENYA_VIEW.lng,
} as const;

export const KENYA_VIEW_PADDING = {
  top: 148,
  bottom: 108,
  left: 52,
  right: 52,
} as const;

/** Margin around production pins for the composed opening cadrage. */
const MAP_OPEN_MARGIN = { lat: 0.38, lng: 0.52 };
const MAP_OPEN_MARGIN_MOBILE = { lat: 0.24, lng: 0.32 };

type MapFramePadding = { top: number; bottom: number; left: number; right: number };

function isMobileMapViewport() {
  return typeof window !== 'undefined' && window.innerWidth <= 768;
}

/** First-view frame — production corridor only (not full country extents). */
export const PRODUCTION_MAP_BOUNDS = {
  west: Math.min(...locations.map((l) => l.lng)) - MAP_OPEN_MARGIN.lng,
  south: Math.min(...locations.map((l) => l.lat)) - MAP_OPEN_MARGIN.lat,
  east: Math.max(...locations.map((l) => l.lng)) + MAP_OPEN_MARGIN.lng,
  north: Math.max(...locations.map((l) => l.lat)) + MAP_OPEN_MARGIN.lat,
} as const;

export const MAP_OPEN_CENTER = {
  lat: (PRODUCTION_MAP_BOUNDS.south + PRODUCTION_MAP_BOUNDS.north) / 2,
  lng: (PRODUCTION_MAP_BOUNDS.west + PRODUCTION_MAP_BOUNDS.east) / 2,
} as const;

/** UI-aware padding for the production map opening shot. */
export const MAP_OPEN_PADDING = {
  top: 172,
  bottom: 132,
  left: 60,
  right: 100,
} as const;

export const MAP_OPEN_MAX_ZOOM = 6.9;

/** Responsive production bounds — tighter on mobile for a closer corridor frame. */
export function getProductionMapBounds() {
  const margin = isMobileMapViewport() ? MAP_OPEN_MARGIN_MOBILE : MAP_OPEN_MARGIN;
  return {
    west: Math.min(...locations.map((l) => l.lng)) - margin.lng,
    south: Math.min(...locations.map((l) => l.lat)) - margin.lat,
    east: Math.max(...locations.map((l) => l.lng)) + margin.lng,
    north: Math.max(...locations.map((l) => l.lat)) + margin.lat,
  };
}

/** HUD-aware fitBounds padding tuned per viewport. */
export function getMapOpenPadding(): MapFramePadding {
  if (typeof window === 'undefined') return MAP_OPEN_PADDING;
  if (window.innerWidth <= 480) {
    return { top: 92, bottom: 108, left: 20, right: 24 };
  }
  if (window.innerWidth <= 768) {
    return { top: 112, bottom: 118, left: 28, right: 32 };
  }
  return MAP_OPEN_PADDING;
}

export function getMapOpenMaxZoom() {
  return isMobileMapViewport() ? 7.15 : MAP_OPEN_MAX_ZOOM;
}

export const KENYA_FIT_MAX_ZOOM = 6.25;

export const KENYA_FIT_OPTIONS = {
  padding: KENYA_VIEW_PADDING,
  bearing: 0,
  pitch: 0,
  maxZoom: KENYA_FIT_MAX_ZOOM,
  duration: 0,
} as const;

export const ELEV_MIN_M = 0;
export const ELEV_MAX_M = 4500;

export const MAP_DEFAULT = {
  center: [MAP_OPEN_CENTER.lng, MAP_OPEN_CENTER.lat] as [number, number],
  zoom: 6.55,
  minZoom: 5.2,
  maxZoom: 12,
};

/** Kenya west anchor → Rwanda east (scroll / default bearing). */
export const CORRIDOR_BEARING = bearingDegrees(
  -1.0,
  REGION_BOUNDS.west + 2,
  -1.0,
  REGION_BOUNDS.east - 2,
);

export function formatElevation(meters: number): string {
  return `${meters.toLocaleString('en-GB')} m`;
}

export function elevationPinPercent(meters: number): number {
  const t = (meters - ELEV_MIN_M) / (ELEV_MAX_M - ELEV_MIN_M);
  return Math.min(100, Math.max(0, (1 - t) * 100));
}

export function bearingDegrees(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

export function bearingLabel(degrees: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const ix = Math.round(degrees / 45) % 8;
  return `${dirs[ix]} ${Math.round(degrees)}°`;
}

export function scrollProgressFromLng(lng: number): number {
  const { west, east } = REGION_BOUNDS;
  return Math.min(1, Math.max(0, (lng - west) / (east - west)));
}

export function lngFromScrollProgress(progress: number): number {
  const { west, east } = REGION_BOUNDS;
  return west + progress * (east - west);
}

/** Journey location active at corridor progress (west → east). */
export function journeyIdAtProgress(progress: number): string {
  let active = JOURNEY_ORDER[0];
  for (const id of JOURNEY_ORDER) {
    const loc = locations.find((l) => l.id === id);
    if (!loc) continue;
    if (scrollProgressFromLng(loc.lng) <= progress + 0.025) active = id;
  }
  return active;
}

/** All journey stops reached at or before this progress. */
export function journeyPassedIds(progress: number): string[] {
  return JOURNEY_ORDER.filter((id) => {
    const loc = locations.find((l) => l.id === id);
    return loc && scrollProgressFromLng(loc.lng) <= progress + 0.015;
  });
}

export function journeyProgressForId(id: string): number {
  const loc = locations.find((l) => l.id === id);
  return loc ? scrollProgressFromLng(loc.lng) : 0;
}

export function nextInJourney(id: string): Location | null {
  const i = JOURNEY_ORDER.indexOf(id);
  if (i < 0 || i >= JOURNEY_ORDER.length - 1) return null;
  return locations.find((l) => l.id === JOURNEY_ORDER[i + 1]) ?? null;
}

export function isJourneyLocationId(id: string): boolean {
  return JOURNEY_ORDER.includes(id);
}

export function journeyRouteCoordinates(upToId: string): [number, number][] {
  const endIndex = JOURNEY_ORDER.indexOf(upToId);
  if (endIndex < 0) return [];
  return JOURNEY_ORDER.slice(0, endIndex + 1).map((id) => {
    const loc = locations.find((l) => l.id === id);
    if (!loc) throw new Error(`Unknown journey location: ${id}`);
    return [loc.lng, loc.lat] as [number, number];
  });
}

export function bearingForLocation(
  loc: Location,
  mapCenter: { lat: number; lng: number },
): number {
  const next = nextInJourney(loc.id);
  if (next) {
    return bearingDegrees(loc.lat, loc.lng, next.lat, next.lng);
  }
  return bearingDegrees(mapCenter.lat, mapCenter.lng, loc.lat, loc.lng);
}

export function bearingFromCenter(
  center: { lat: number; lng: number },
  target: { lat: number; lng: number },
): number {
  return bearingDegrees(center.lat, center.lng, target.lat, target.lng);
}
