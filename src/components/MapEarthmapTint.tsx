import { useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

interface MapEarthmapTintProps {
  instrumented?: boolean;
  mapHovered?: boolean;
}

export function MapEarthmapTint({ instrumented = false, mapHovered = false }: MapEarthmapTintProps) {
  const map = useMap();
  const tintRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<google.maps.OverlayView | null>(null);

  useEffect(() => {
    if (!map) return;
    const mapInstance = map;

    class TintOverlay extends google.maps.OverlayView {
      onAdd() {
        const div = document.createElement('div');
        div.className = 'geo-map__earthmap-tint';
        div.setAttribute('aria-hidden', 'true');
        tintRef.current = div;
        const pane = this.getPanes()?.overlayLayer as HTMLElement | undefined;
        if (pane) {
          pane.style.pointerEvents = 'none';
          pane.appendChild(div);
        }
      }

      draw() {
        const div = tintRef.current;
        if (!div) return;

        div.style.position = 'absolute';
        div.style.left = '0';
        div.style.top = '0';
        div.style.width = '100%';
        div.style.height = '100%';
      }

      onRemove() {
        tintRef.current?.remove();
        tintRef.current = null;
      }
    }

    const overlay = new TintOverlay();
    overlay.setMap(mapInstance);
    overlayRef.current = overlay;

    const redraw = () => overlay.draw();
    const listeners = [
      mapInstance.addListener('bounds_changed', redraw),
      mapInstance.addListener('idle', redraw),
      mapInstance.addListener('zoom_changed', redraw),
    ];

    return () => {
      listeners.forEach((listener) => listener.remove());
      overlay.setMap(null);
      overlayRef.current = null;
    };
  }, [map]);

  useEffect(() => {
    const div = tintRef.current;
    if (!div) return;
    div.classList.toggle('geo-map__earthmap-tint--instrumented', instrumented);
    div.classList.toggle('geo-map__earthmap-tint--hovered', mapHovered);
    overlayRef.current?.draw();
  }, [instrumented, mapHovered]);

  return null;
}
