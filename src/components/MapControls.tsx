import './MapControls.css';

interface MapControlsProps {
  visible: boolean;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
  onReset: () => void;
}

export function MapControls({
  visible,
  fullscreen,
  onToggleFullscreen,
  onReset,
}: MapControlsProps) {
  if (!visible) return null;

  return (
    <div className={`map-controls ${fullscreen ? 'map-controls--fullscreen' : ''}`}>
      <button
        type="button"
        className="map-controls__btn map-controls__btn--accent"
        onClick={onReset}
        aria-label="Reset map view"
      >
        Reset view
      </button>
      <button
        type="button"
        className="map-controls__btn"
        onClick={onToggleFullscreen}
        aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
      </button>
    </div>
  );
}
