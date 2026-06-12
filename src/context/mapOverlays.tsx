import { createContext, useContext } from 'react';

export const MapOverlaysContext = createContext<HTMLDivElement | null>(null);

export function useMapOverlaysRoot() {
  return useContext(MapOverlaysContext);
}

export function useMapCardPortalTarget(): HTMLElement {
  const root = useMapOverlaysRoot();
  return root ?? document.body;
}
