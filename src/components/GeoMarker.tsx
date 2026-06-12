import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useMap } from '@vis.gl/react-google-maps';
import { useGeoMarkersLayer } from '../context/geoMarkersLayer';
import { whenMapProjectionReady } from '../lib/mapProjection';

interface GeoMarkerProps {
  position: { lat: number; lng: number };
  zIndex?: number;
  children: React.ReactNode;
}

function syncSlotPosition(
  map: google.maps.Map,
  layer: HTMLElement,
  slot: HTMLElement,
  projection: google.maps.MapCanvasProjection,
  lat: number,
  lng: number,
  zIndex: number,
) {
  const pixel = projection.fromLatLngToContainerPixel(new google.maps.LatLng(lat, lng));
  if (!pixel) return;

  const mapRect = map.getDiv().getBoundingClientRect();
  const layerRect = layer.getBoundingClientRect();

  slot.style.left = `${pixel.x + mapRect.left - layerRect.left}px`;
  slot.style.top = `${pixel.y + mapRect.top - layerRect.top}px`;
  slot.style.zIndex = String(zIndex);
}

export function GeoMarker({ position, zIndex = 100, children }: GeoMarkerProps) {
  const map = useMap();
  const layer = useGeoMarkersLayer();
  const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);
  const slotRef = useRef<HTMLDivElement | null>(null);
  const positionRef = useRef(position);
  const zIndexRef = useRef(zIndex);

  positionRef.current = position;
  zIndexRef.current = zIndex;

  useEffect(() => {
    if (!map || !layer) return;

    const slot = document.createElement('div');
    slot.className = 'geo-marker-root';
    slot.style.position = 'absolute';
    layer.appendChild(slot);
    slotRef.current = slot;
    setAnchor(slot);

    const sync = () => {
      const activeSlot = slotRef.current;
      if (!activeSlot) return;

      whenMapProjectionReady(map, (projection) => {
        syncSlotPosition(
          map,
          layer,
          activeSlot,
          projection,
          positionRef.current.lat,
          positionRef.current.lng,
          zIndexRef.current,
        );
      });
    };

    sync();

    const listeners = [
      map.addListener('idle', sync),
      map.addListener('zoom_changed', sync),
      map.addListener('center_changed', sync),
      map.addListener('bounds_changed', sync),
    ];
    window.addEventListener('resize', sync);
    document.addEventListener('fullscreenchange', sync);

    return () => {
      listeners.forEach((listener) => listener.remove());
      window.removeEventListener('resize', sync);
      document.removeEventListener('fullscreenchange', sync);
      slot.remove();
      slotRef.current = null;
      setAnchor(null);
    };
  }, [map, layer]);

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot || !map) return;

    if (!layer) return;

    whenMapProjectionReady(map, (projection) => {
      syncSlotPosition(map, layer, slot, projection, position.lat, position.lng, zIndex);
    });
  }, [map, layer, position.lat, position.lng, zIndex]);

  if (!anchor) return null;

  return createPortal(
    <div className="geo-marker-slot">{children}</div>,
    anchor,
  );
}
