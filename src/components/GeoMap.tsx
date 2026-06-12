import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  APIProvider,
  Map,
  useMap,
  APILoadingStatus,
  useApiLoadingStatus,
} from '@vis.gl/react-google-maps';
import type { GoogleMap } from '../types/map';
import type { Location } from '../data/locations';
import { locations } from '../data/locations';
import {
  lngFromScrollProgress,
  journeyRouteCoordinates,
  isJourneyLocationId,
  scrollProgressFromLng,
} from '../lib/geo';
import {
  GOOGLE_MAPS_API_KEY,
  GOOGLE_MAP_DEFAULTS,
  fitProductionMapFrame,
  setGoogleMapPadding,
  triggerMapResize,
} from '../lib/googleMapsConfig';
import { GOOGLE_MAP_BACKGROUND, GOOGLE_MAP_STYLE } from '../lib/googleMapBrandTheme';
import { buildRouteFeatureCollection } from '../lib/journeyRoute';
import { GeoMarker } from './GeoMarker';
import { MapBrandTheme } from './MapBrandTheme';
import { MapEarthmapTint } from './MapEarthmapTint';
import type { MapHandle } from '../types/map';
import './GeoMap.css';

const PANEL_PADDING = 380;
const ROUTE_SEGMENT_MS = 420;
const NO_PADDING = { top: 0, bottom: 0, left: 0, right: 0 };

function mapPadding(panelOpen: boolean): google.maps.Padding {
  return panelOpen ? { ...NO_PADDING, right: PANEL_PADDING } : NO_PADDING;
}

export interface GeoMapCallbacks {
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  onMapMove: (center: { lat: number; lng: number }, progress: number) => void;
  onMapReady?: (map: GoogleMap) => void;
  onReset?: () => void;
}

interface GeoMapProps extends GeoMapCallbacks {
  instrumented?: boolean;
  mapHovered?: boolean;
  hoveredId: string | null;
  activeId: string | null;
  journeyHighlightId: string | null;
  journeyPassedIds: string[];
  journeyRouteEndId?: string | null;
}

interface MapEngineProps extends GeoMapProps {
  mapRef: React.MutableRefObject<GoogleMap | null>;
  handleRef: React.Ref<MapHandle>;
}

function MapApiGate({ children }: { children: React.ReactNode }) {
  const status = useApiLoadingStatus();

  if (status === APILoadingStatus.LOADING || status === APILoadingStatus.NOT_LOADED) {
    return (
      <div className="geo-map__missing-key">
        <p className="geo-map__missing-key-title">Loading map</p>
        <p className="geo-map__missing-key-body">Downloading Google Maps tiles…</p>
      </div>
    );
  }

  if (status === APILoadingStatus.FAILED || status === APILoadingStatus.AUTH_FAILURE) {
    return (
      <div className="geo-map__missing-key">
        <p className="geo-map__missing-key-title">Google Maps blocked</p>
        <p className="geo-map__missing-key-body">
          Your API key rejected this site. In Google Cloud Console → Credentials → your key →
          HTTP referrers, add:
        </p>
        <p className="geo-map__missing-key-body">
          <code>http://localhost:5173/*</code>
          <br />
          <code>http://127.0.0.1:5173/*</code>
        </p>
        <p className="geo-map__missing-key-body">
          Then hard refresh this page. The dev server always runs on port <code>5173</code>.
        </p>
      </div>
    );
  }

  return children;
}

function MapEngine({
  mapRef,
  handleRef,
  hoveredId,
  activeId,
  journeyHighlightId,
  journeyPassedIds,
  journeyRouteEndId = null,
  onHover,
  onSelect,
  onMapMove,
  onMapReady,
  onReset,
}: MapEngineProps) {
  const map = useMap();
  const panelOpenRef = useRef(false);
  const pendingKenyaFrameRef = useRef(true);
  const routeAnimRef = useRef<number | null>(null);
  const routePolylineRef = useRef<google.maps.Polyline | null>(null);
  const glowPolylineRef = useRef<google.maps.Polyline | null>(null);
  const callbacksRef = useRef({ onHover, onSelect, onMapMove, onMapReady, onReset });
  callbacksRef.current = { onHover, onSelect, onMapMove, onMapReady, onReset };

  const syncMove = useCallback(() => {
    const m = mapRef.current;
    if (!m) return;
    const center = m.getCenter();
    if (!center) return;
    callbacksRef.current.onMapMove(
      { lat: center.lat(), lng: center.lng() },
      scrollProgressFromLng(center.lng()),
    );
  }, [mapRef]);

  const applyKenyaFrame = useCallback(() => {
    const m = mapRef.current;
    if (!m) return;
    fitProductionMapFrame(m);
    pendingKenyaFrameRef.current = false;
    syncMove();
  }, [mapRef, syncMove]);

  useImperativeHandle(handleRef, () => ({
    getMap: () => mapRef.current,

    easeToProgress(progress: number) {
      const m = mapRef.current;
      if (!m) return;
      const center = m.getCenter();
      const lat = center?.lat() ?? GOOGLE_MAP_DEFAULTS.center.lat;
      m.panTo({ lat, lng: lngFromScrollProgress(progress) });
    },

    flyToLocation(location: Location, panelOpen = false) {
      const m = mapRef.current;
      if (!m) return;
      panelOpenRef.current = panelOpen;
      setGoogleMapPadding(m, mapPadding(panelOpen));
      m.panTo({ lat: location.lat, lng: location.lng });
      m.setZoom(7.8);
    },

    flyToPoint(point: { lat: number; lng: number }, zoom = 7.8) {
      const m = mapRef.current;
      if (!m) return;
      panelOpenRef.current = false;
      setGoogleMapPadding(m, NO_PADDING);
      m.panTo(point);
      m.setZoom(zoom);
    },

    resetView() {
      const m = mapRef.current;
      if (!m) return;
      panelOpenRef.current = false;
      setGoogleMapPadding(m, NO_PADDING);
      pendingKenyaFrameRef.current = false;
      fitProductionMapFrame(m);
    },

    frameKenya() {
      const m = mapRef.current;
      if (!m) return;
      panelOpenRef.current = false;
      setGoogleMapPadding(m, NO_PADDING);
      pendingKenyaFrameRef.current = false;
      fitProductionMapFrame(m);
    },

    setPanelPadding(open: boolean) {
      const m = mapRef.current;
      if (!m) return;
      panelOpenRef.current = open;
      setGoogleMapPadding(m, mapPadding(open));
    },
  }));

  useEffect(() => {
    if (!map) return;
    mapRef.current = map;

    const idleListener = map.addListener('idle', syncMove);
    applyKenyaFrame();
    map.addListener('tilesloaded', () => {
      if (pendingKenyaFrameRef.current) applyKenyaFrame();
    });

    const dblClick = map.addListener('dblclick', (e: google.maps.MapMouseEvent) => {
      e.stop();
      panelOpenRef.current = false;
      setGoogleMapPadding(map, NO_PADDING);
      fitProductionMapFrame(map);
      callbacksRef.current.onReset?.();
    });

    callbacksRef.current.onMapReady?.(map);

    const section = map.getDiv().closest('.map-section');
    let visibilityObserver: IntersectionObserver | null = null;
    if (section && 'IntersectionObserver' in window) {
      visibilityObserver = new IntersectionObserver(
        (entries) => {
          const visible = entries.some(
            (entry) => entry.isIntersecting && entry.intersectionRatio >= 0.2,
          );
          if (visible && pendingKenyaFrameRef.current) {
            requestAnimationFrame(() => applyKenyaFrame());
          }
        },
        { threshold: [0, 0.2, 0.45, 0.7] },
      );
      visibilityObserver.observe(section);
    }

    return () => {
      idleListener.remove();
      dblClick.remove();
      visibilityObserver?.disconnect();
      if (routeAnimRef.current) cancelAnimationFrame(routeAnimRef.current);
      routePolylineRef.current?.setMap(null);
      glowPolylineRef.current?.setMap(null);
      mapRef.current = null;
    };
  }, [map, mapRef, syncMove, applyKenyaFrame]);

  useEffect(() => {
    if (!map) return;

    let timer = 0;
    const refitForViewport = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        triggerMapResize(map);
        if (!panelOpenRef.current) {
          fitProductionMapFrame(map);
        }
      }, 160);
    };

    window.addEventListener('resize', refitForViewport);
    window.addEventListener('orientationchange', refitForViewport);

    return () => {
      window.removeEventListener('resize', refitForViewport);
      window.removeEventListener('orientationchange', refitForViewport);
      window.clearTimeout(timer);
    };
  }, [map]);

  useEffect(() => {
    const m = mapRef.current;
    if (!m) return;

    if (routeAnimRef.current) {
      cancelAnimationFrame(routeAnimRef.current);
      routeAnimRef.current = null;
    }

    if (!routePolylineRef.current) {
      routePolylineRef.current = new google.maps.Polyline({
        strokeColor: '#e85d3a',
        strokeOpacity: 0.9,
        strokeWeight: 2,
        zIndex: 2,
        icons: [
          {
            icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 2.5 },
            offset: '0',
            repeat: '12px',
          },
        ],
        map: m,
      });
      glowPolylineRef.current = new google.maps.Polyline({
        strokeColor: '#e85d3a',
        strokeOpacity: 0.22,
        strokeWeight: 5,
        zIndex: 1,
        map: m,
      });
    }

    const line = routePolylineRef.current;
    const glow = glowPolylineRef.current;
    if (!line || !glow) return;

    const clearRoute = () => {
      line.setPath([]);
      glow.setPath([]);
    };

    if (!journeyRouteEndId || !isJourneyLocationId(journeyRouteEndId)) {
      clearRoute();
      return;
    }

    const coords = journeyRouteCoordinates(journeyRouteEndId);
    if (coords.length < 2) {
      clearRoute();
      return;
    }

    const segmentCount = coords.length - 1;
    let segment = 0;
    let segmentStart: number | null = null;

    const toLatLng = (c: [number, number]) => ({ lat: c[1], lng: c[0] });

    const pathFromFeatureCollection = (
      fc: ReturnType<typeof buildRouteFeatureCollection>,
    ) =>
      fc.features.flatMap((feature) =>
        feature.geometry.coordinates.map(([lng, lat]) => ({ lat, lng })),
      );

    const tick = (now: number) => {
      if (segment >= segmentCount) {
        line.setPath(coords.map(toLatLng));
        glow.setPath(coords.map(toLatLng));
        routeAnimRef.current = null;
        return;
      }

      if (segmentStart === null) segmentStart = now;
      const progress = Math.min(1, (now - segmentStart) / ROUTE_SEGMENT_MS);
      const fc = buildRouteFeatureCollection(coords, segment, progress);
      const path = pathFromFeatureCollection(fc);
      line.setPath(path);
      glow.setPath(path);

      if (progress >= 1) {
        segment += 1;
        segmentStart = null;
      }

      routeAnimRef.current = requestAnimationFrame(tick);
    };

    line.setPath([]);
    glow.setPath([]);
    routeAnimRef.current = requestAnimationFrame(tick);

    return () => {
      if (routeAnimRef.current) {
        cancelAnimationFrame(routeAnimRef.current);
        routeAnimRef.current = null;
      }
    };
  }, [journeyRouteEndId, mapRef]);

  if (!map) return null;

  return (
    <>
      {locations.map((loc) => {
        const isManualHover = loc.id === hoveredId;
        const isJourneyPulse = loc.id === journeyHighlightId && !hoveredId;
        return (
          <GeoMarker
            key={loc.id}
            position={{ lat: loc.lat, lng: loc.lng }}
            zIndex={activeId === loc.id ? 600 : isManualHover ? 500 : 100}
          >
            <button
              type="button"
              className={[
                'geo-marker',
                loc.featured ? 'geo-marker--featured' : '',
                isManualHover ? 'geo-marker--hovered' : '',
                activeId === loc.id ? 'geo-marker--active' : '',
                isJourneyPulse ? 'geo-marker--journey-pulse' : '',
                journeyPassedIds.includes(loc.id) ? 'geo-marker--journey-passed' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onMouseEnter={() => onHover(loc.id)}
              onMouseLeave={() => onHover(null)}
              onClick={() => onSelect(loc.id)}
              aria-label={loc.name}
            >
              <span className="geo-marker__pin">
                <span className="geo-marker__ripple" />
                <span className="geo-marker__dot" />
              </span>
              <span className="geo-marker__label">{loc.name}</span>
            </button>
          </GeoMarker>
        );
      })}

    </>
  );
}

export const GeoMap = forwardRef<MapHandle, GeoMapProps>(function GeoMap(
  { instrumented = false, mapHovered = false, ...props },
  ref,
) {
  const mapRef = useRef<GoogleMap | null>(null);
  const handleRef = useRef<MapHandle>(null);

  useImperativeHandle(ref, () => handleRef.current as MapHandle);

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className={`geo-map geo-map--missing-key${instrumented ? ' geo-map--instrumented' : ''}`}>
        <div className="geo-map__missing-key">
          <p className="geo-map__missing-key-title">Google Maps API key required</p>
          <p className="geo-map__missing-key-body">
            Add <code>VITE_GOOGLE_MAPS_API_KEY</code> to a <code>.env</code> file and restart the
            dev server.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`geo-map${instrumented ? ' geo-map--instrumented' : ''}${mapHovered ? ' geo-map--hovered' : ''}`}
    >
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <MapApiGate>
          <Map
            className="geo-map__canvas"
            backgroundColor={GOOGLE_MAP_BACKGROUND}
            styles={GOOGLE_MAP_STYLE}
            defaultCenter={GOOGLE_MAP_DEFAULTS.center}
            defaultZoom={GOOGLE_MAP_DEFAULTS.zoom}
            minZoom={GOOGLE_MAP_DEFAULTS.minZoom}
            maxZoom={GOOGLE_MAP_DEFAULTS.maxZoom}
            mapTypeId={GOOGLE_MAP_DEFAULTS.mapTypeId}
            disableDefaultUI={GOOGLE_MAP_DEFAULTS.disableDefaultUI}
            clickableIcons={GOOGLE_MAP_DEFAULTS.clickableIcons}
            gestureHandling={GOOGLE_MAP_DEFAULTS.gestureHandling}
            disableDoubleClickZoom={GOOGLE_MAP_DEFAULTS.disableDoubleClickZoom}
            restriction={GOOGLE_MAP_DEFAULTS.restriction}
          >
            <MapBrandTheme />
            <MapEarthmapTint instrumented={instrumented} mapHovered={mapHovered} />
            <MapEngine mapRef={mapRef} handleRef={handleRef} {...props} />
          </Map>
        </MapApiGate>
      </APIProvider>
    </div>
  );
});
