import { useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { applyGoogleMapBrandTheme } from '../lib/googleMapBrandTheme';

export function MapBrandTheme() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    applyGoogleMapBrandTheme(map);
  }, [map]);

  return null;
}
