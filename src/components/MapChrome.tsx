import { useRef, useCallback, useEffect, type ReactNode } from 'react';
import { film } from '../data/film';
import { locations } from '../data/locations';
import { lngFromScrollProgress, journeyProgressForId, JOURNEY_ORDER } from '../lib/geo';
import './MapChrome.css';

interface MapChromeProps {
  scrollProgress: number;
  mapCenter: { lat: number; lng: number };
  onProgressChange: (progress: number) => void;
  onCorridorDragStart?: () => void;
  onCorridorDragEnd?: () => void;
  visible: boolean;
  controls?: ReactNode;
}

export function MapChrome({
  scrollProgress,
  mapCenter,
  onProgressChange,
  onCorridorDragStart,
  onCorridorDragEnd,
  visible,
  controls,
}: MapChromeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const inKenya = scrollProgress > 0.45;

  const progressFromClientX = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      draggingRef.current = true;
      onCorridorDragStart?.();
      trackRef.current?.setPointerCapture(e.pointerId);
      onProgressChange(progressFromClientX(e.clientX));
    },
    [onProgressChange, onCorridorDragStart, progressFromClientX],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingRef.current) return;
      onProgressChange(progressFromClientX(e.clientX));
    },
    [onProgressChange, progressFromClientX],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      trackRef.current?.releasePointerCapture(e.pointerId);
      onCorridorDragEnd?.();
    },
    [onCorridorDragEnd],
  );

  useEffect(() => {
    const stop = () => {
      if (draggingRef.current) {
        draggingRef.current = false;
        onCorridorDragEnd?.();
      }
    };
    window.addEventListener('pointerup', stop);
    return () => window.removeEventListener('pointerup', stop);
  }, [onCorridorDragEnd]);

  return (
    <header className={`chrome ${visible ? 'chrome--visible' : 'chrome--hidden'}`}>
      <p className="chrome__where-lead field-label">Production map · {film.countries}</p>
      {controls ? <div className="chrome__controls">{controls}</div> : null}
      <div className="chrome__where-details">
        <p className="chrome__instruction field-label">{film.instruction}</p>
        <p className="chrome__coords field-label">
          {mapCenter.lat.toFixed(2)}° · {mapCenter.lng.toFixed(2)}°
        </p>
      </div>

      <div className="chrome__corridor">
        <span className={`chrome__country ${!inKenya ? 'chrome__country--active' : ''}`}>
          Rwanda
        </span>
        <div
          ref={trackRef}
          className="chrome__track"
          role="slider"
          aria-label="Journey corridor from Rwanda to Kenya through filming locations"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(scrollProgress * 100)}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <span className="chrome__track-fill" style={{ width: `${scrollProgress * 100}%` }} />
          {JOURNEY_ORDER.map((id) => {
            const loc = locations.find((l) => l.id === id);
            if (!loc) return null;
            const pct = journeyProgressForId(id) * 100;
            const reached = scrollProgress >= journeyProgressForId(id) - 0.01;
            return (
              <span
                key={id}
                className={`chrome__journey-tick ${reached ? 'chrome__journey-tick--reached' : ''}`}
                style={{ left: `${pct}%` }}
                title={loc.name}
                aria-hidden="true"
              />
            );
          })}
          <span className="chrome__thumb" style={{ left: `${scrollProgress * 100}%` }} />
        </div>
        <span className={`chrome__country ${inKenya ? 'chrome__country--active' : ''}`}>
          Kenya
        </span>
        <span className="chrome__scroll-lng field-label">
          {lngFromScrollProgress(scrollProgress).toFixed(1)}°E
        </span>
      </div>
    </header>
  );
}
