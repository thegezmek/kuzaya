import { projectLatLngToContainer } from './mapProjection';

export interface MarkerCardPosition {
  x: number;
  y: number;
  flipX: boolean;
  flipY: boolean;
}

interface MarkerCardOptions {
  cardW: number;
  cardH: number;
  margin?: number;
  pinGap?: number;
}

export function computeMarkerCardPosition(
  map: google.maps.Map,
  lng: number,
  lat: number,
  { cardW, cardH, margin = 16, pinGap = 14 }: MarkerCardOptions,
): MarkerCardPosition {
  const p = projectLatLngToContainer(map, lat, lng);
  if (!p) {
    return { x: 0, y: 0, flipX: false, flipY: false };
  }
  const container = map.getDiv();
  const cw = container.clientWidth;
  const ch = container.clientHeight;

  const spaceAbove = p.y;
  const spaceBelow = ch - p.y;
  const spaceRight = cw - p.x;
  const spaceLeft = p.x;

  const flipY = spaceAbove < cardH + pinGap + margin && spaceBelow > spaceAbove;
  const flipX = spaceRight < cardW / 2 + margin && spaceLeft > spaceRight;

  return { x: p.x, y: p.y, flipX, flipY };
}
