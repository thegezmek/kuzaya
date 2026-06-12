import { useState } from 'react';
import { film } from '../data/film';
import { DirectorsNoteSection } from './DirectorsNoteSection';
import { RevealSection } from './RevealSection';
import './FundingFunnel.css';

export function FundingFunnel() {
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    const body = encodeURIComponent(`Please subscribe me to Kuzaya updates.\n\nEmail: ${newsletterEmail}`);
    window.location.href = `mailto:hi@gez.studio?subject=${encodeURIComponent('Kuzaya newsletter')}&body=${body}`;
  };

  return (
    <div className="funnel">
      <DirectorsNoteSection />

      <RevealSection id="support" className="funnel__section funnel__section--support">
        <div className="funnel__support-grid">
          <div className="funnel__support-main">
            <h2 className="funnel__cta-title">{film.support.headline}</h2>
            <div className="funnel__cta-lead">
              {film.support.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
            <a href={film.support.cta.href} className="funnel__cta-btn">
              {film.support.cta.label}
            </a>
          </div>

          <div id="contact" className="funnel__support-contact">
            <h3 className="funnel__support-contact-title">Contact</h3>
            <p className="funnel__section-sub field-label">For screenings, partnerships and press.</p>
            <p className="funnel__prose funnel__contact-intro">{film.contact.intro}</p>
            <div className="funnel__team funnel__team--support">
              {film.contact.people.map((person) => (
                <article key={person.linkedin} className="funnel__team-card">
                  <h4>{person.name}</h4>
                  <p className="field-label">{person.role}</p>
                  <p>
                    <a href={person.linkedin} target="_blank" rel="noopener noreferrer">
                      LinkedIn
                    </a>
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </RevealSection>

      <footer id="footer" className="funnel__footer">
        <div className="funnel__footer-inner">
          <div className="funnel__footer-newsletter">
            <p className="funnel__footer-title">{film.title}</p>
            <p className="funnel__footer-sub field-label">{film.footer.headline}</p>
            <p className="funnel__footer-newsletter-copy">{film.footer.newsletter}</p>

            <form className="funnel__newsletter" onSubmit={handleNewsletter}>
              <input
                id="newsletter-email"
                type="email"
                required
                aria-label={film.footer.newsletterPlaceholder}
                placeholder={film.footer.newsletterPlaceholder}
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="funnel__newsletter-input"
              />
              <button type="submit" className="funnel__newsletter-btn field-label">
                {film.footer.newsletterCta}
              </button>
            </form>

            <div className="funnel__footer-social">
              <a href={film.footer.social.instagram} target="_blank" rel="noopener noreferrer" className="field-label">
                Instagram
              </a>
              <a href={film.footer.social.linkedin} target="_blank" rel="noopener noreferrer" className="field-label">
                LinkedIn
              </a>
            </div>
          </div>

          <div className="funnel__footer-aside">
            <nav className="funnel__footer-nav" aria-label="Footer">
              <a href="#hero" className="field-label">
                {film.title}
              </a>
              <a href="#why-now" className="field-label">
                Why Now
              </a>
              <a href="#support" className="field-label">
                Support
              </a>
            </nav>

            <a
              href={film.footer.legalUrl}
              className="field-label funnel__footer-legal"
              target="_blank"
              rel="noopener noreferrer"
            >
              {film.footer.legal}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
