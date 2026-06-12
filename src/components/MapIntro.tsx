import { film } from '../data/film';
import './MapIntro.css';

export function MapIntro() {
  return (
    <div className="map-intro">
      <div className="map-intro__inner">
        <h2 className="map-intro__title">
          {film.map.headlineLines.map((line) => (
            <span key={line} className="map-intro__title-line">
              {line}
            </span>
          ))}
        </h2>
        <p className="map-intro__sub field-label">{film.map.subheading}</p>
        <p className="map-intro__body">{film.map.body}</p>
      </div>
    </div>
  );
}
