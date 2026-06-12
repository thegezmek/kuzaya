import { MAP_ATTRIBUTION } from '../lib/googleMapsConfig';
import './MapSourceCredit.css';

export function MapSourceCredit() {
  return (
    <p className="map-source-credit" role="note">
      <span className="map-source-credit__label">Map sources</span>
      <span className="map-source-credit__text">{MAP_ATTRIBUTION}</span>
    </p>
  );
}
