import { film } from '../data/film';
import './MapTerritoryBand.css';

const STATS = [
  { value: '2', label: 'Countries filmed' },
  { value: '9', label: 'Production locations' },
  { value: '60', label: 'Minutes runtime' },
  { value: film.year, label: 'Release year' },
];

export function MapTerritoryBand() {
  return (
    <div className="map-territory" aria-label="Production scope">
      <ul className="map-territory__stats">
        {STATS.map((s) => (
          <li key={s.label} className="map-territory__stat">
            <span className="map-territory__value">{s.value}</span>
            <span className="map-territory__label field-label">{s.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
