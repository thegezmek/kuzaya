import { useCallback, useLayoutEffect, useState } from 'react';
import {
  computeMarkerCardPosition,
  type MarkerCardPosition,
} from '../lib/mapCardPosition';
import { useMapOverlaysRoot } from '../context/mapOverlays';
import { whenMapProjectionReady } from '../lib/mapProjection';

interface MarkerCardSize {
  cardW: number;
  cardH: number;
  margin?: number;
}

function toAnchorPosition(
  map: google.maps.Map,
  lng: number,
  lat: number,
  { cardW, cardH, margin = 20 }: MarkerCardSize,
  portalRoot: HTMLElement | null,
): MarkerCardPosition {
  const local = computeMarkerCardPosition(map, lng, lat, { cardW, cardH, margin });
  const mapRect = map.getDiv().getBoundingClientRect();
  let x = mapRect.left + local.x;
  let y = mapRect.top + local.y;

  if (portalRoot) {
    const rootRect = portalRoot.getBoundingClientRect();
    x -= rootRect.left;
    y -= rootRect.top;
  }

  return {
    x,
    y,
    flipX: local.flipX,
    flipY: local.flipY,
  };
}

export function useMarkerCardViewportPosition(
  map: google.maps.Map,
  lng: number,
  lat: number,
  size: MarkerCardSize,
): MarkerCardPosition | null {
  const portalRoot = useMapOverlaysRoot();
  const [pos, setPos] = useState<MarkerCardPosition | null>(null);

  const update = useCallback(() => {
    whenMapProjectionReady(map, () => {
      try {
        setPos(toAnchorPosition(map, lng, lat, size, portalRoot));
      } catch {
        // Map div may be detached during teardown.
      }
    });
  }, [map, lng, lat, size.cardW, size.cardH, size.margin, portalRoot]);

  useLayoutEffect(() => {
    update();

    const listeners = [
      map.addListener('idle', update),
      map.addListener('bounds_changed', update),
      map.addListener('center_changed', update),
      map.addListener('zoom_changed', update),
    ];
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    document.addEventListener('fullscreenchange', update);

    return () => {
      listeners.forEach((listener) => listener.remove());
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      document.removeEventListener('fullscreenchange', update);
    };
  }, [map, update]);

  return pos;
}
