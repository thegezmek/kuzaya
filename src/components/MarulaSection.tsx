import { film } from '../data/film';
import './MarulaPartnersSection.css';

export function MarulaSection() {
  return (
    <section id="marula" className="film-section__marula" aria-labelledby="marula-title">
      <h2 id="marula-title" className="film-section__marula-partners-title">
        {film.marula.headline}
      </h2>
      <div className="film-section__marula-badge">
        <img src={film.marula.logoSrc} alt="Marula Limited" loading="lazy" decoding="async" />
      </div>
      <p className="film-section__marula-partners-sub field-label">{film.marula.subheading}</p>
      <div className="funnel__marula-block">
        <p className="film-section__marula-partners-body">{film.marula.body}</p>
        {film.marula.url ? (
          <a
            href={film.marula.url}
            className="funnel__section-cta field-label"
            target="_blank"
            rel="noopener noreferrer"
          >
            {film.marula.cta}
          </a>
        ) : (
          <span className="funnel__marula-pending field-label">{film.marula.cta}</span>
        )}
      </div>
    </section>
  );
}
