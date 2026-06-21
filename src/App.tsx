import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import type { GoogleMap } from './types/map';
import { locations } from './data/locations';
import { GeoMap } from './components/GeoMap';
import { MapChrome } from './components/MapChrome';
import { Compass } from './components/Compass';
import { ElevationGuide } from './components/ElevationGuide';
import { LocationPopup } from './components/LocationPopup';
import { LocationHoverCard } from './components/LocationHoverCard';
import { MapHint } from './components/MapHint';
import { MapControls } from './components/MapControls';
import { ExplorePrompt } from './components/ExplorePrompt';
import { FundingFunnel } from './components/FundingFunnel';
import { FilmSection } from './components/FilmSection';
import { FilmHero } from './components/FilmHero';
import { TrailerSection } from './components/TrailerSection';
import { StillsSection } from './components/StillsSection';
import { MapIntro } from './components/MapIntro';
import { SiteNav } from './components/SiteNav';
import { BackToTop } from './components/BackToTop';
import {
  bearingForLocation,
  bearingFromCenter,
  bearingLabel,
  CORRIDOR_BEARING,
  isJourneyLocationId,
  MAP_OPEN_CENTER,
  nextInJourney,
  journeyIdAtProgress,
  journeyPassedIds,
  scrollProgressFromLng,
} from './lib/geo';
import { triggerMapResize } from './lib/googleMapsConfig';
import type { MapHandle } from './types/map';
import { GeoMarkersLayerContext } from './context/geoMarkersLayer';
import { MapOverlaysContext } from './context/mapOverlays';
import './App.css';

function App() {
  const mapRef = useRef<MapHandle>(null);
  const mapSectionRef = useRef<HTMLElement>(null);
  const mapKenyaFramedRef = useRef(false);
  const [mapInstance, setMapInstance] = useState<GoogleMap | null>(null);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(() =>
    scrollProgressFromLng(MAP_OPEN_CENTER.lng),
  );
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: MAP_OPEN_CENTER.lat,
    lng: MAP_OPEN_CENTER.lng,
  });
  const [mapChromeVisible, setMapChromeVisible] = useState(false);
  const [hasExploredMap, setHasExploredMap] = useState(false);
  const [corridorDragging, setCorridorDragging] = useState(false);
  const [navVariant, setNavVariant] = useState<'hero' | 'map' | 'content'>('hero');
  const [mapFullscreen, setMapFullscreen] = useState(false);
  const [mapExpandedCss, setMapExpandedCss] = useState(false);
  const [mapStageHovered, setMapStageHovered] = useState(false);
  const [geoMarkersLayer, setGeoMarkersLayer] = useState<HTMLDivElement | null>(null);
  const [mapOverlaysEl, setMapOverlaysEl] = useState<HTMLDivElement | null>(null);

  const journeyHighlightId = useMemo(
    () => journeyIdAtProgress(scrollProgress),
    [scrollProgress],
  );
  const passedIds = useMemo(
    () => journeyPassedIds(scrollProgress),
    [scrollProgress],
  );

  const hoveredLocation = hoveredId
    ? (locations.find((l) => l.id === hoveredId) ?? null)
    : null;
  const activeLocation = activeId
    ? (locations.find((l) => l.id === activeId) ?? null)
    : null;
  const journeyHighlightLocation =
    locations.find((l) => l.id === journeyHighlightId) ?? null;
  const uiLocation =
    activeLocation ?? hoveredLocation ?? (corridorDragging ? journeyHighlightLocation : null);

  const hoverCardLocation = useMemo(() => {
    if (activeId) return null;
    if (hoveredLocation) return hoveredLocation;
    if (corridorDragging && journeyHighlightLocation) return journeyHighlightLocation;
    return null;
  }, [activeId, hoveredLocation, corridorDragging, journeyHighlightLocation]);

  const handleMapMove = useCallback(
    (center: { lat: number; lng: number }, progress: number) => {
      setMapCenter(center);
      setScrollProgress(progress);
    },
    [],
  );

  const handleMapReady = useCallback((map: GoogleMap) => {
    setMapInstance(map);
    triggerMapResize(map);
  }, []);

  const handleMapReset = useCallback(() => {
    setActiveId(null);
    setHoveredId(null);
    mapRef.current?.resetView();
  }, []);

  const toggleMapFullscreen = useCallback(async () => {
    const section = mapSectionRef.current;
    if (!section) return;

    const nativeActive = document.fullscreenElement === section;

    if (nativeActive || mapExpandedCss) {
      if (nativeActive) {
        await document.exitFullscreen();
      }
      setMapExpandedCss(false);
      return;
    }

    try {
      if (section.requestFullscreen) {
        await section.requestFullscreen();
        return;
      }
    } catch {
      // iOS Safari often rejects element fullscreen — fall back below.
    }

    setMapExpandedCss(true);
  }, [mapExpandedCss]);

  const handleProgressChange = useCallback((progress: number) => {
    setScrollProgress(progress);
    mapRef.current?.easeToProgress(progress);
  }, []);

  const handleCorridorDragStart = useCallback(() => {
    setCorridorDragging(true);
    setHoveredId(null);
  }, []);

  const handleCorridorDragEnd = useCallback(() => {
    setCorridorDragging(false);
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const offset = id === 'film' ? 96 : 24;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }, []);

  const scrollPastMap = useCallback(() => {
    setHasExploredMap(true);
    scrollToSection('film');
  }, [scrollToSection]);

  const scrollToSupport = useCallback(() => {
    scrollToSection('support');
  }, [scrollToSection]);

  const handleSelect = useCallback((id: string) => {
    const loc = locations.find((l) => l.id === id);
    if (!loc) return;
    setActiveId(id);
    setHoveredId(null);
    mapRef.current?.flyToLocation(loc, true);
  }, []);

  const handleClosePopup = useCallback(() => {
    setActiveId(null);
    setHoveredId(null);
  }, []);

  const { bearing, bearingText, targetHint } = useMemo(() => {
    if (uiLocation) {
      const next = nextInJourney(uiLocation.id);
      const deg = bearingForLocation(uiLocation, mapCenter);
      return {
        bearing: deg,
        bearingText: bearingLabel(deg),
        targetHint: next
          ? `→ ${next.name} (${bearingLabel(bearingFromCenter(uiLocation, next))})`
          : `→ ${uiLocation.name}`,
      };
    }
    const towardRwanda = scrollProgress > 0.55;
    const corridorBearing =
      CORRIDOR_BEARING + (scrollProgress - 0.5) * 8 + (towardRwanda ? 180 : 0);
    const deg = ((corridorBearing % 360) + 360) % 360;
    return {
      bearing: deg,
      bearingText: bearingLabel(deg),
      targetHint: towardRwanda ? '→ Rwanda' : '→ Kenya corridor',
    };
  }, [uiLocation, mapCenter, scrollProgress]);

  useEffect(() => {
    const onFullscreenChange = () => {
      const nativeActive = document.fullscreenElement === mapSectionRef.current;
      setMapFullscreen(nativeActive || mapExpandedCss);
      if (!nativeActive && !mapExpandedCss) {
        setMapExpandedCss(false);
      }
      const resizeMap = () => {
        const map = mapRef.current?.getMap();
        if (map) triggerMapResize(map);
      };
      window.setTimeout(resizeMap, 50);
      window.setTimeout(resizeMap, 250);
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, [mapExpandedCss]);

  useEffect(() => {
    setMapFullscreen(mapExpandedCss || document.fullscreenElement === mapSectionRef.current);
  }, [mapExpandedCss]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (activeId) {
        setActiveId(null);
        setHoveredId(null);
        return;
      }
      if (document.fullscreenElement) {
        void document.exitFullscreen();
        return;
      }
      if (mapExpandedCss) {
        setMapExpandedCss(false);
        return;
      }
      setHoveredId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeId, mapExpandedCss]);

  useEffect(() => {
    const stage = mapSectionRef.current?.querySelector<HTMLElement>('.map-section__stage');
    if (!stage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        const active = entry.isIntersecting && entry.intersectionRatio >= 0.45;
        setMapChromeVisible(active);
        if (active) {
          const map = mapRef.current?.getMap();
          if (map) triggerMapResize(map);
        }
      },
      { threshold: [0, 0.25, 0.45, 0.6, 0.8, 1], rootMargin: '-8% 0px -8% 0px' },
    );

    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const mapSection = mapSectionRef.current;
      if (!mapSection) return;

      const scrollY = window.scrollY;
      const mapTop = mapSection.offsetTop;
      const trailerBottom =
        (document.getElementById('trailer')?.offsetTop ?? 0) +
        (document.getElementById('trailer')?.offsetHeight ?? 0);

      setNavVariant(
        scrollY < trailerBottom - 80 ? 'hero' : mapChromeVisible ? 'map' : 'content',
      );

      if (scrollY > mapTop + mapSection.offsetHeight * 0.35) {
        setHasExploredMap(true);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [mapChromeVisible]);

  const instrumentsVisible = mapChromeVisible || mapFullscreen;

  useEffect(() => {
    if (!mapChromeVisible || mapKenyaFramedRef.current) return;
    const timer = window.setTimeout(() => {
      mapRef.current?.frameKenya(false);
      mapKenyaFramedRef.current = true;
    }, 120);
    return () => window.clearTimeout(timer);
  }, [mapChromeVisible]);

  useEffect(() => {
    if (!instrumentsVisible) return;
    const map = mapRef.current?.getMap();
    if (!map) return;
    const timer = window.setTimeout(() => {
      triggerMapResize(map);
    }, 150);
    return () => window.clearTimeout(timer);
  }, [instrumentsVisible]);

  useEffect(() => {
    if (!mapFullscreen && !mapExpandedCss) return;
    const map = mapRef.current?.getMap();
    if (!map) return;
    const timer = window.setTimeout(() => triggerMapResize(map), 200);
    return () => window.clearTimeout(timer);
  }, [mapFullscreen, mapExpandedCss]);

  useEffect(() => {
    if (!mapExpandedCss && !activeId) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mapExpandedCss, activeId]);

  return (
    <div className="app">
      <header className="site-header">
        <SiteNav variant={navVariant} />
      </header>

      <FilmHero onSupport={scrollToSupport} />

      <TrailerSection />
      <StillsSection />

      <section
        ref={mapSectionRef}
        className={`map-section${activeId ? ' map-section--panel-open' : ''}${mapExpandedCss ? ' map-section--expanded' : ''}`}
        id="map"
      >
        <MapIntro />

        <MapOverlaysContext.Provider value={mapOverlaysEl}>
        <div
          className="map-section__stage"
          onMouseEnter={() => setMapStageHovered(true)}
          onMouseLeave={() => setMapStageHovered(false)}
        >
          <GeoMarkersLayerContext.Provider value={geoMarkersLayer}>
            <div className="map-section__viewport">
              <div className="map-section__inner">
                <GeoMap
                  ref={mapRef}
                  instrumented={instrumentsVisible}
                  mapHovered={mapStageHovered}
                  hoveredId={hoveredId}
                  activeId={activeId}
                  journeyHighlightId={journeyHighlightId}
                  journeyPassedIds={passedIds}
                  journeyRouteEndId={
                    activeLocation && isJourneyLocationId(activeLocation.id)
                      ? activeLocation.id
                      : null
                  }
                  onHover={setHoveredId}
                  onSelect={handleSelect}
                  onMapMove={handleMapMove}
                  onMapReady={handleMapReady}
                  onReset={handleMapReset}
                />
              </div>

              <div
                className={`map-section__atmosphere${instrumentsVisible ? ' map-section__atmosphere--active' : ''}`}
                aria-hidden="true"
              >
                <div className="map-section__veil" />
                <div className="map-section__shade-top" />
                <div className="map-section__fade" />
              </div>

              <div className="map-section__viewport-gradient" aria-hidden="true" />
            </div>

            <div className="map-section__instruments">
            {instrumentsVisible && (
              <div className="map-section__hud">
                <MapChrome
                  visible={instrumentsVisible}
                  scrollProgress={scrollProgress}
                  mapCenter={mapCenter}
                  onProgressChange={handleProgressChange}
                  onCorridorDragStart={handleCorridorDragStart}
                  onCorridorDragEnd={handleCorridorDragEnd}
                  controls={
                    <MapControls
                      visible={instrumentsVisible}
                      fullscreen={mapFullscreen}
                      onToggleFullscreen={toggleMapFullscreen}
                      onReset={handleMapReset}
                    />
                  }
                />
              </div>
            )}

            {instrumentsVisible && (
              <>
                <Compass
                  bearing={bearing}
                  bearingText={bearingText}
                  regionLabel={
                    uiLocation
                      ? `${uiLocation.name} · ${uiLocation.lat.toFixed(2)}°, ${uiLocation.lng.toFixed(2)}°`
                      : scrollProgress > 0.55
                        ? 'Kenya sector'
                        : 'Rwanda sector'
                  }
                  targetHint={targetHint}
                />
                <ElevationGuide
                  elevationM={uiLocation?.elevationM}
                  elevationLabel={uiLocation?.elevation}
                  country={
                    uiLocation?.country === 'rwanda' ? 'Rwanda' : uiLocation ? 'Kenya' : undefined
                  }
                />
                <MapHint />
                <ExplorePrompt
                  visible={!mapFullscreen && !hasExploredMap && !activeId}
                  onExplore={scrollPastMap}
                  label="Continue"
                />
              </>
            )}

            {instrumentsVisible && (
              <LocationHoverCard location={hoverCardLocation} map={mapInstance} />
            )}

            {activeLocation && mapInstance && (
              <LocationPopup
                key={activeLocation.id}
                location={activeLocation}
                map={mapInstance}
                onClose={handleClosePopup}
              />
            )}

            </div>

            <div
              ref={setGeoMarkersLayer}
              className={`map-section__markers${instrumentsVisible ? ' map-section__markers--instrumented' : ''}${mapStageHovered ? ' map-section__markers--hovered' : ''}`}
            />
          </GeoMarkersLayerContext.Provider>
        </div>

        <div ref={setMapOverlaysEl} className="map-section__overlays" aria-hidden={!activeId && !hoverCardLocation} />
        </MapOverlaysContext.Provider>
      </section>

      <FilmSection />

      <FundingFunnel />

      <BackToTop />
    </div>
  );
}

export default App;
