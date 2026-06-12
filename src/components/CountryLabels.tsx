import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useMap } from '@vis.gl/react-google-maps';
import { useCountryLabelsLayer } from '../context/countryLabelsLayer';
import { COUNTRY_LABELS, type CountryLabel } from '../data/countryLabels';
import { projectLatLngToElement, whenMapProjectionReady } from '../lib/mapProjection';
import './CountryLabels.css';

interface LabelRenderState {
  x: number;
  y: number;
  fontSize: number;
  visible: boolean;
}

function labelVisible(label: CountryLabel, zoom: number): boolean {
  if (label.minZoom !== undefined && zoom < label.minZoom) return false;
  if (label.maxZoom !== undefined && zoom > label.maxZoom) return false;
  return true;
}

function labelFontSize(label: CountryLabel, zoom: number): number {
  const base = label.tier === 'primary' ? 2.85 : 2.05;
  const scaled = base * Math.pow(1.16, 6.15 - zoom);
  const min = label.tier === 'primary' ? 1.55 : 1.15;
  const max = label.tier === 'primary' ? 4.2 : 2.85;
  return Math.min(max, Math.max(min, scaled));
}

function computeLabelStates(
  map: google.maps.Map,
  layer: HTMLDivElement,
): Record<string, LabelRenderState> {
  const zoom = map.getZoom() ?? 6.15;
  const cw = layer.clientWidth;
  const ch = layer.clientHeight;
  const margin = 48;
  const states: Record<string, LabelRenderState> = {};

  for (const label of COUNTRY_LABELS) {
    if (!labelVisible(label, zoom)) {
      states[label.id] = { x: 0, y: 0, fontSize: 0, visible: false };
      continue;
    }

    const point = projectLatLngToElement(map, label.lat, label.lng, layer);
    if (!point) {
      states[label.id] = { x: 0, y: 0, fontSize: 0, visible: false };
      continue;
    }

    const inView =
      point.x >= -margin &&
      point.x <= cw + margin &&
      point.y >= -margin &&
      point.y <= ch + margin;

    states[label.id] = {
      x: point.x,
      y: point.y,
      fontSize: labelFontSize(label, zoom),
      visible: inView,
    };
  }

  return states;
}

export function CountryLabels() {
  const map = useMap();
  const layer = useCountryLabelsLayer();
  const [labels, setLabels] = useState<Record<string, LabelRenderState>>({});

  useEffect(() => {
    if (!map || !layer) return;

    const update = () => setLabels(computeLabelStates(map, layer));

    update();
    const releaseProjection = whenMapProjectionReady(map, update);

    const listeners = [
      map.addListener('idle', update),
      map.addListener('tilesloaded', update),
      map.addListener('bounds_changed', update),
      map.addListener('center_changed', update),
      map.addListener('zoom_changed', update),
    ];
    window.addEventListener('resize', update);

    return () => {
      releaseProjection();
      listeners.forEach((listener) => listener.remove());
      window.removeEventListener('resize', update);
    };
  }, [map, layer]);

  if (!map || !layer) return null;

  return createPortal(
    <>
      {COUNTRY_LABELS.map((label) => {
        const state = labels[label.id];
        if (!state?.visible) return null;

        return (
          <span
            key={label.id}
            className={`country-label country-label--${label.tier}`}
            style={{
              left: state.x,
              top: state.y,
              fontSize: `${state.fontSize}rem`,
            }}
          >
            {label.name}
          </span>
        );
      })}
    </>,
    layer,
  );
}
