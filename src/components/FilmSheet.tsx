import { motion } from 'framer-motion';
import { film } from '../data/film';
import { centralQuestion } from '../data/locations';
import './Sheet.css';
import './FilmSheet.css';

interface FilmSheetProps {
  onClose: () => void;
}

export function FilmSheet({ onClose }: FilmSheetProps) {
  return (
    <motion.div
      className="sheet-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="sheet"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.75, ease: [0.33, 0, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="film-sheet-title"
      >
        <button type="button" className="sheet__close field-label" onClick={onClose}>
          Close
        </button>

        <div className="sheet__content">
          <header className="sheet__header">
            <h2 id="film-sheet-title" className="sheet__title">
              {film.title}
            </h2>
            <p className="sheet__tagline field-label">{film.tagline}</p>
            <p className="sheet__meta field-label">
              {film.countries} · {film.year} · {film.runtime} · {film.status}
            </p>
          </header>

          <section>
            <h3 className="field-label">Synopsis</h3>
            <p>{film.heroBody}</p>
          </section>

          <section>
            <h3 className="field-label">The Story</h3>
            <p>{film.story}</p>
          </section>

          <blockquote className="sheet__question">
            <p>{centralQuestion}</p>
          </blockquote>

          <section>
            <h3 className="field-label">Why This Film Now</h3>
            <p>{film.whyNow}</p>
          </section>

          <section>
            <h3 className="field-label">Filmmaking Approach</h3>
            <p>{film.approach}</p>
          </section>

          <section>
            <h3 className="field-label">Areas of Focus</h3>
            <ul className="sheet__tags">
              {film.focusAreas.map((area) => (
                <li key={area} className="field-label">
                  {area}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="field-label">Key Contributors</h3>
            <dl className="sheet__contributors">
              {film.voices.people.map((c) => (
                <div key={c.id}>
                  <dt className="field-label">{c.name}</dt>
                  <dd>{c.bio}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="sheet__credits">
            <h3 className="field-label">Credits</h3>
            <p>
              <span className="field-label">Director-Editor</span>
              <br />
              {film.credits.director.name}
            </p>
            <p>
              <span className="field-label">Producer</span>
              <br />
              {film.credits.producer.name}
            </p>
            <p>
              <span className="field-label">Executive Producers</span>
              <br />
              {film.credits.executive.join(' · ')}
            </p>
            <p>
              <span className="field-label">Production</span>
              <br />
              {film.credits.production}
            </p>
          </section>

          <p className="sheet__footer field-label">
            {film.branding.footer}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
