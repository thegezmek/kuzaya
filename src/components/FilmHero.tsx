import { motion } from 'framer-motion';
import { film } from '../data/film';
import './FilmHero.css';

interface FilmHeroProps {
  onSupport: () => void;
}

const HERO_GIF = '/hero/bg.gif';
const HERO_POSTER = '/hero/poster.jpg';

export function FilmHero({ onSupport }: FilmHeroProps) {
  return (
    <section id="hero" className="film-hero">
      <div className="film-hero__frame">
        <div className="film-hero__bg" aria-hidden="true">
          <img className="film-hero__gif" src={HERO_GIF} alt="" decoding="async" fetchPriority="high" />
          <img className="film-hero__poster" src={HERO_POSTER} alt="" decoding="async" />
          <div className="film-hero__scrim" />
        </div>

        <div className="film-hero__content">
        <motion.p
          className="film-hero__kicker field-label"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {film.countries}
        </motion.p>

        <motion.h1
          className="film-hero__title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {film.title}
        </motion.h1>

        <motion.p
          className="film-hero__headline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
        >
          {film.headline}
        </motion.p>

        <motion.p
          className="film-hero__subheading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.55 }}
        >
          {film.subheading}
        </motion.p>

        <motion.div
          className="film-hero__meta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.65 }}
        >
          <span className="field-label">{film.runtime}</span>
          <span className="film-hero__meta-dot" aria-hidden="true" />
          <span className="field-label">{film.status}</span>
          <span className="film-hero__meta-dot" aria-hidden="true" />
          <span className="field-label">{film.year}</span>
        </motion.div>

        <motion.div
          className="film-hero__actions"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
        >
          <motion.button
            type="button"
            className="film-hero__btn film-hero__btn--primary"
            onClick={onSupport}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {film.support.heroCta}
          </motion.button>
        </motion.div>
        </div>
      </div>
    </section>
  );
}
