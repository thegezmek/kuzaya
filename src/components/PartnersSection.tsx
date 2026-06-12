import { film } from '../data/film';
import { peopleAffiliations } from '../data/peopleAffiliations';
import './PartnersSection.css';

const allPartners = [...film.partners.items, ...peopleAffiliations];

export function PartnersSection() {
  return (
    <section id="partners" className="film-section__partners" aria-labelledby="partners-title">
      <h2 id="partners-title" className="film-section__partners-title">
        {film.partners.headline}
      </h2>
      <p className="film-section__partners-sub field-label">{film.partners.subheading}</p>
      <ul className="film-section__partners-list">
        {allPartners.map((partner) => (
          <li key={partner.id}>
            <a
              className="film-section__partners-link"
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${partner.name} (opens in new tab)`}
            >
              <img
                className={`film-section__partners-logo film-section__partners-logo--${partner.id}`}
                src={partner.logoSrc}
                alt=""
                loading="lazy"
                decoding="async"
              />
              <span className="film-section__partners-tooltip" aria-hidden="true">
                {partner.name}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
