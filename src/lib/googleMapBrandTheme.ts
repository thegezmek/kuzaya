/** Reference palette — dark charcoal land, teal water, orange roads, light labels. */
export const MAP_PALETTE = {
  land: '#212121',
  water: '#2d4c4c',
  waterLabel: '#3d6060',
  roadMajor: '#e69138',
  roadMinor: '#373737',
  roadLocal: '#2c2c2c',
  label: '#cccccc',
  labelMuted: '#8a8a8a',
  labelDim: '#757575',
  border: '#9e9e9e',
  poi: '#181818',
} as const;

export const GOOGLE_MAP_BACKGROUND = MAP_PALETTE.land;

/** Snazzy-style JSON — requires no Map ID (cloud/vector IDs ignore client styles). */
export const GOOGLE_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: MAP_PALETTE.land }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: MAP_PALETTE.land }] },
  { elementType: 'labels.text.fill', stylers: [{ color: MAP_PALETTE.label }] },

  /* Hide town/street/water labels — keep country names */
  { featureType: 'administrative.locality', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.neighborhood', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.province', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  {
    featureType: 'administrative.country',
    elementType: 'labels.text.fill',
    stylers: [{ color: MAP_PALETTE.label }],
  },

  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{ color: MAP_PALETTE.border }],
  },

  { featureType: 'landscape.man_made', elementType: 'geometry', stylers: [{ color: MAP_PALETTE.land }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: MAP_PALETTE.poi }] },

  /* Hide local/minor roads — only show arterial + highway */
  { featureType: 'road.local', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry.fill', stylers: [{ color: MAP_PALETTE.land }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: MAP_PALETTE.land }] },
  { featureType: 'road', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: MAP_PALETTE.roadMinor }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: MAP_PALETTE.roadMajor }] },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: MAP_PALETTE.land }],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry',
    stylers: [{ color: MAP_PALETTE.roadMajor }],
  },

  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: MAP_PALETTE.water }] },
  { featureType: 'water', elementType: 'labels', stylers: [{ visibility: 'off' }] },
];

export function applyGoogleMapBrandTheme(map: google.maps.Map) {
  map.setOptions({
    backgroundColor: GOOGLE_MAP_BACKGROUND,
    mapTypeId: 'roadmap',
    styles: GOOGLE_MAP_STYLE,
  });
}
