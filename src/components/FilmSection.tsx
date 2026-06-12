import { useState } from 'react';
import { film } from '../data/film';
import { WhyNowSection } from './whyNow/WhyNowSection';
import { ApproachBtsOpener } from './ApproachBtsOpener';
import { RevealSection } from './RevealSection';
import { MapTerritoryBand } from './MapTerritoryBand';
import { MarulaSection } from './MarulaSection';
import { PartnersSection } from './PartnersSection';
import { ProductionSection } from './ProductionSection';
import { VoicesSection } from './VoicesSection';
import './FilmSection.css';

function quoteInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function PullQuotePortrait({ src, name }: { src: string; name: string }) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const showPhoto = !photoFailed;

  return (
    <div className="film-section__quote-portrait" aria-hidden="true">
      {showPhoto ? (
        <img
          src={src}
          alt=""
          className="film-section__quote-photo"
          loading="lazy"
          decoding="async"
          onError={() => setPhotoFailed(true)}
        />
      ) : (
        <span className="film-section__quote-portrait-initials">{quoteInitials(name)}</span>
      )}
    </div>
  );
}

export function FilmSection() {
  return (
    <div className="funnel">
      <RevealSection id="film" className="film-section" revealEarly>
        <div className="film-section__inner">
          <div className="film-section__main">
            <MapTerritoryBand />
            <header className="film-section__masthead">
              <p className="film-section__eyebrow field-label">
                {film.countries} · {film.runtime} · {film.year}
              </p>
              <h2 className="film-section__title">The Film</h2>
              <p className="film-section__deck">{film.headline}</p>
            </header>

            <div className="film-section__editorial">
              <div className="film-section__topic-label" aria-hidden="true">
                <span className="film-section__topic-num field-label">01</span>
                <span className="film-section__topic-name">The Story</span>
              </div>
              <p className="film-section__panel-body">{film.story}</p>
            </div>
          </div>

          <hr className="film-section__story-divider" aria-hidden="true" />

          <WhyNowSection />

          <section className="film-section__approach" aria-labelledby="film-approach-title">
            <header className="film-section__approach-header">
              <p className="film-section__approach-num field-label">03</p>
              <p className="film-section__approach-kicker field-label">
                Observational · Cross-sector · East Africa
              </p>
              <h3 id="film-approach-title" className="film-section__approach-title">
                The Approach
              </h3>
              <span className="film-section__approach-badge field-label">Core</span>
            </header>

            <div className="film-section__approach-body">
              <p className="film-section__approach-text">{film.approach}</p>
            </div>
          </section>

          <ApproachBtsOpener />
        </div>

        <div className="film-section__inner">
          <div className="film-section__focus">
            <h3 className="film-section__focus-label field-label">Areas of focus</h3>
            <ul className="film-section__focus-list">
              {film.focusAreas.map((area) => (
                <li key={area} className="film-section__focus-item field-label">
                  {area}
                </li>
              ))}
            </ul>
          </div>

          <figure className="film-section__quote">
            <p className="film-section__quote-kicker field-label">{film.pullQuote.kicker}</p>
            <blockquote>&ldquo;{film.pullQuote.text}&rdquo;</blockquote>
            <figcaption className="film-section__quote-cite">
              <div className="film-section__quote-cite-row">
                <PullQuotePortrait src={film.pullQuote.photoSrc} name={film.pullQuote.name} />
                <div className="film-section__quote-cite-text">
                  <cite>{film.pullQuote.name}</cite>
                  <span className="film-section__quote-role field-label">{film.pullQuote.role}</span>
                </div>
              </div>
            </figcaption>
          </figure>

          <VoicesSection />
          <PartnersSection />

          <div className="film-section__team-row">
            <ProductionSection />
            <MarulaSection />
          </div>
        </div>
      </RevealSection>
    </div>
  );
}
