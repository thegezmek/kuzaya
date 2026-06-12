import './Compass.css';

interface CompassProps {
  bearing: number;
  bearingText: string;
  regionLabel?: string;
  targetHint?: string;
}

export function Compass({ bearing, bearingText, regionLabel, targetHint }: CompassProps) {
  return (
    <aside className="compass" aria-label={`Compass: ${bearingText}`}>
      <svg viewBox="0 0 80 80" className="compass__rose" aria-hidden="true">
        <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="40" cy="40" r="28" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.5" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <line
            key={deg}
            x1="40"
            y1="8"
            x2="40"
            y2={deg % 90 === 0 ? 14 : 11}
            stroke="currentColor"
            strokeWidth={deg % 90 === 0 ? 0.8 : 0.4}
            transform={`rotate(${deg} 40 40)`}
          />
        ))}
        <g transform={`rotate(${bearing} 40 40)`}>
          <path d="M40 12 L44 36 L40 32 L36 36 Z" fill="var(--accent)" />
        </g>
        <text x="40" y="6" textAnchor="middle" className="compass__cardinal">
          N
        </text>
      </svg>
      <p className="compass__bearing field-label">{bearingText}</p>
      {regionLabel && <p className="compass__region">{regionLabel}</p>}
      {targetHint && <p className="compass__hint field-label">{targetHint}</p>}
    </aside>
  );
}
