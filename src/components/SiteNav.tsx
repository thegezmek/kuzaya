import { film } from '../data/film';
import './SiteNav.css';

interface SiteNavProps {
  variant?: 'hero' | 'map' | 'content';
}

export function SiteNav({ variant = 'hero' }: SiteNavProps) {
  return (
    <nav className={`site-nav site-nav--${variant}`} aria-label="Site">
      <a href="#hero" className="site-nav__link field-label">
        {film.title}
      </a>
      <a href="#why-now" className="site-nav__link field-label">
        Why Now
      </a>
      <a href="#support" className="site-nav__link field-label">
        Support
      </a>
    </nav>
  );
}
