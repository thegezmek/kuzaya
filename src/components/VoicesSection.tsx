import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { VoicePortrait } from './VoicePortrait';
import {
  getPeopleForCategory,
  getVisibleCategories,
  voicesSectionCopy,
  type Voice,
} from '../data/voices';
import { VoiceRoleLines } from './VoiceRoleLines';
import './VoicesSection.css';

function formatCategoryLens(lens: string): string {
  const trimmed = lens.trim();
  if (!trimmed) return '';

  const sentence = trimmed.endsWith('.') ? trimmed : `${trimmed}.`;

  return `“${sentence}”`;
}

function VoiceCard({ person }: { person: Voice }) {
  return (
    <article className="funnel__voice-card voices-section__card" role="listitem">
      <VoicePortrait person={person} />
      <div className="funnel__voice-body">
        <h3 className="funnel__voice-name">{person.name}</h3>
        <VoiceRoleLines role={person.role} className="voice-role-lines--card" />
        <p className="funnel__voice-bio">{person.bio}</p>
      </div>
    </article>
  );
}

export function VoicesSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const visibleCategories = useMemo(() => getVisibleCategories(), []);
  const [activeFilter, setActiveFilter] = useState(
    () => visibleCategories[0]?.id ?? 'farmers',
  );
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const filteredPeople = useMemo(
    () => getPeopleForCategory(activeFilter),
    [activeFilter],
  );

  const activeCategory = visibleCategories.find((category) => category.id === activeFilter);

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const { scrollLeft, scrollWidth, clientWidth } = track;
    setCanScrollPrev(scrollLeft > 8);
    setCanScrollNext(scrollLeft < scrollWidth - clientWidth - 8);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: 0, behavior: 'smooth' });
    updateScrollState();
    track.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      track.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [activeFilter, updateScrollState]);

  const scrollByCard = useCallback((direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>('.voices-section__card');
    const gap = 16;
    const amount = card ? card.offsetWidth + gap : track.clientWidth * 0.8;
    track.scrollBy({ left: direction * amount, behavior: 'smooth' });
  }, []);

  return (
    <section id="voices" className="film-section__voices" aria-labelledby="voices-title">
      <h2 id="voices-title" className="film-section__voices-title">{voicesSectionCopy.headline}</h2>
      <p className="funnel__section-sub field-label">{voicesSectionCopy.subheading}</p>
      <p className="funnel__prose funnel__voices-intro">{voicesSectionCopy.intro}</p>

      <div className="voices-section__toolbar">
        <nav className="voices-section__nav" aria-label="Filter voices by category">
          <div className="voices-section__nav-scroll">
            {visibleCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                className="voices-section__chip"
                aria-pressed={activeFilter === category.id}
                onClick={() => setActiveFilter(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="voices-section__controls">
          <button
            type="button"
            className="voices-section__nav-btn"
            onClick={() => scrollByCard(-1)}
            disabled={!canScrollPrev}
            aria-label="Previous voices"
          >
            ←
          </button>
          <button
            type="button"
            className="voices-section__nav-btn"
            onClick={() => scrollByCard(1)}
            disabled={!canScrollNext}
            aria-label="Next voices"
          >
            →
          </button>
        </div>
      </div>

      {activeCategory && (
        <AnimatePresence mode="wait">
          <motion.p
            key={activeFilter}
            className="voices-section__lens"
            aria-live="polite"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: [0.33, 0, 0.2, 1] }}
          >
            {formatCategoryLens(activeCategory.lens)}
          </motion.p>
        </AnimatePresence>
      )}

      <div className="voices-section__rail">
        <div ref={trackRef} className="voices-section__track">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              className="voices-section__track-row"
              role="list"
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.45, ease: [0.33, 0, 0.2, 1] }}
            >
              {filteredPeople.map((person) => (
                <VoiceCard key={person.id} person={person} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
