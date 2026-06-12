import { film } from '../data/film';
import './ProductionSection.css';

export function ProductionSection() {
  return (
    <section id="production-team" className="film-section__production" aria-labelledby="production-team-title">
      <h2 id="production-team-title" className="film-section__production-title">
        Production Team
      </h2>
      <p className="film-section__production-sub field-label">Status: {film.status}</p>

      <div className="film-section__credits">
        <p>
          <span className="field-label">{film.credits.director.role}</span>
          <br />
          {film.credits.director.name}
        </p>
        <p>
          <span className="field-label">{film.credits.producer.role}</span>
          <br />
          {film.credits.producer.name}
        </p>
        <p>
          <span className="field-label">Executive Producers</span>
          <br />
          {film.credits.executive.join(' · ')}
        </p>

        <div className="film-section__production-partners">
          <p>
            <span className="field-label">Production</span>
            <br />
            <a
              href={film.credits.productionUrl}
              className="film-section__credits-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {film.credits.production}
            </a>
          </p>
          <p>
            <span className="field-label">Co-Production</span>
            <br />
            {film.credits.coProduction}
          </p>
        </div>
      </div>
    </section>
  );
}
