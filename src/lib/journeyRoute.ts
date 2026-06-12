import type { FeatureCollection, LineString } from 'geojson';

export function buildRouteFeatureCollection(
  coords: [number, number][],
  completedSegments: number,
  currentSegmentProgress: number,
): FeatureCollection<LineString> {
  const features: FeatureCollection<LineString>['features'] = [];

  for (let i = 0; i < completedSegments; i++) {
    features.push({
      type: 'Feature',
      properties: { segment: i },
      geometry: { type: 'LineString', coordinates: [coords[i], coords[i + 1]] },
    });
  }

  if (completedSegments < coords.length - 1 && currentSegmentProgress > 0) {
    const a = coords[completedSegments];
    const b = coords[completedSegments + 1];
    const t = Math.min(1, currentSegmentProgress);
    features.push({
      type: 'Feature',
      properties: { segment: completedSegments, animating: true },
      geometry: {
        type: 'LineString',
        coordinates: [a, [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]],
      },
    });
  }

  return { type: 'FeatureCollection', features };
}

export const EMPTY_ROUTE: FeatureCollection<LineString> = {
  type: 'FeatureCollection',
  features: [],
};
