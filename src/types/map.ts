import type { Location } from '../data/locations';

export interface MapPoint {
  lat: number;
  lng: number;
}

export interface MapHandle {
  getMap: () => google.maps.Map | null;
  easeToProgress: (progress: number) => void;
  flyToLocation: (location: Location, panelOpen?: boolean) => void;
  flyToPoint: (point: MapPoint, zoom?: number) => void;
  resetView: () => void;
  frameKenya: (animated?: boolean) => void;
  setPanelPadding: (open: boolean) => void;
}

export type GoogleMap = google.maps.Map;
