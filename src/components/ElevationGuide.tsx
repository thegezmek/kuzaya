import { ELEV_MAX_M, ELEV_MIN_M } from '../lib/geo';
import './ElevationGuide.css';

interface ElevationGuideProps {
  elevationM?: number;
  elevationLabel?: string;
  country?: string;
}

const TICKS = [
  { m: 4500, label: '4,500' },
  { m: 3000, label: '3,000' },
  { m: 2000, label: '2,000' },
  { m: 1000, label: '1,000' },
  { m: 500, label: '500' },
  { m: 0, label: '0 m' },
];

export function ElevationGuide({
  elevationM,
  elevationLabel,
  country,
}: ElevationGuideProps) {
  const pinTop =
    elevationM !== undefined
      ? `${((ELEV_MAX_M - elevationM) / (ELEV_MAX_M - ELEV_MIN_M)) * 100}%`
      : undefined;

  return (
    <aside className="elevation" aria-label="Elevation scale">
      <span className="elevation__label field-label">Elev. AMSL</span>
      <div className="elevation__scale">
        {TICKS.map((tick) => (
          <div key={tick.m} className="elevation__tick">
            <span className="elevation__line" />
            <span className="elevation__value">{tick.label}</span>
          </div>
        ))}
        {pinTop !== undefined && (
          <span
            className="elevation__indicator"
            style={{ top: pinTop }}
            aria-hidden="true"
          />
        )}
      </div>
      {elevationLabel && elevationM !== undefined && (
        <p className="elevation__current">
          <span className="elevation__pin" aria-hidden="true" />
          {elevationLabel}
          <span className="elevation__coords field-label">
            {elevationM} m datum
          </span>
        </p>
      )}
      {country && <p className="elevation__country field-label">{country}</p>}
    </aside>
  );
}
