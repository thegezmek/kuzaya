import { createContext, useContext } from 'react';

export const GeoMarkersLayerContext = createContext<HTMLDivElement | null>(null);

export function useGeoMarkersLayer() {
  return useContext(GeoMarkersLayerContext);
}
