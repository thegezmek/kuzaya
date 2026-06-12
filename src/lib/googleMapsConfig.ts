import {
  KENYA_RWANDA_BOUNDS,
  MAP_DEFAULT,
  MAP_OPEN_CENTER,
  getMapOpenMaxZoom,
  getMapOpenPadding,
  getProductionMapBounds,
} from './geo';

export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';
/** Required for Advanced Markers. */
export const GOOGLE_MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID ?? 'DEMO_MAP_ID';

export const MAP_ATTRIBUTION = 'Map data © Google';

/** Hard limit — pan/zoom cannot leave Kenya + Rwanda. */
export const GOOGLE_REGION_BOUNDS: google.maps.LatLngBoundsLiteral = {
  west: KENYA_RWANDA_BOUNDS.west,
  south: KENYA_RWANDA_BOUNDS.south,
  east: KENYA_RWANDA_BOUNDS.east,
  north: KENYA_RWANDA_BOUNDS.north,
};

export function kenyaRwandaLatLngBounds(): google.maps.LatLngBounds {
  return new google.maps.LatLngBounds(
    { lat: KENYA_RWANDA_BOUNDS.south, lng: KENYA_RWANDA_BOUNDS.west },
    { lat: KENYA_RWANDA_BOUNDS.north, lng: KENYA_RWANDA_BOUNDS.east },
  );
}

export function productionMapLatLngBounds(): google.maps.LatLngBounds {
  const bounds = getProductionMapBounds();
  return new google.maps.LatLngBounds(
    { lat: bounds.south, lng: bounds.west },
    { lat: bounds.north, lng: bounds.east },
  );
}

/** Composed opening cadrage — all production pins in frame, HUD-aware padding. */
export function fitProductionMapFrame(map: google.maps.Map) {
  map.fitBounds(productionMapLatLngBounds(), getMapOpenPadding());

  const maxZoom = getMapOpenMaxZoom();
  const listener = map.addListener('idle', () => {
    listener.remove();
    const zoom = map.getZoom();
    if (zoom !== undefined && zoom > maxZoom) {
      map.setZoom(maxZoom);
    }
  });
}

/** @deprecated Use fitProductionMapFrame — kept as alias for reset paths. */
export function fitKenyaOnGoogleMap(map: google.maps.Map) {
  fitProductionMapFrame(map);
}

export function setGoogleMapPadding(map: google.maps.Map, padding: google.maps.Padding) {
  map.setOptions({ padding } as google.maps.MapOptions);
}

export function triggerMapResize(map: google.maps.Map) {
  google.maps.event.trigger(map, 'resize');
}

export const GOOGLE_MAP_DEFAULTS = {
  center: { lat: MAP_OPEN_CENTER.lat, lng: MAP_OPEN_CENTER.lng },
  zoom: MAP_DEFAULT.zoom,
  minZoom: MAP_DEFAULT.minZoom,
  maxZoom: MAP_DEFAULT.maxZoom,
  mapTypeId: 'roadmap' as google.maps.MapTypeId,
  disableDefaultUI: true,
  clickableIcons: false,
  gestureHandling: 'greedy' as const,
  disableDoubleClickZoom: true,
  restriction: {
    latLngBounds: GOOGLE_REGION_BOUNDS,
    strictBounds: true,
  },
};
