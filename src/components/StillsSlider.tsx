import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './StillsGallery.css';
import './StillsSection.css';

export interface StillsSliderItem {
  id: string;
  src: string;
  alt: string;
}

interface StillsSliderProps {
  title: string;
  stills: StillsSliderItem[];
  className?: string;
  prevLabel?: string;
  nextLabel?: string;
  viewLabel?: (alt: string) => string;
}

export function StillsSlider({
  title,
  stills,
  className = '',
  prevLabel = 'Previous stills',
  nextLabel = 'Next stills',
  viewLabel = (alt) => `View still: ${alt}`,
}: StillsSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

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
    updateScrollState();
    track.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      track.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState, stills.length]);

  const scrollBySlide = useCallback((direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.querySelector<HTMLElement>('.stills-slider__slide');
    const gap = 12;
    const amount = slide ? slide.offsetWidth + gap : track.clientWidth * 0.75;
    track.scrollBy({ left: direction * amount, behavior: 'smooth' });
  }, []);

  const close = useCallback(() => setOpenIndex(null), []);
  const goPrev = useCallback(() => {
    setOpenIndex((i) => (i === null ? null : (i - 1 + stills.length) % stills.length));
  }, [stills.length]);
  const goNext = useCallback(() => {
    setOpenIndex((i) => (i === null ? null : (i + 1) % stills.length));
  }, [stills.length]);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openIndex, close, goPrev, goNext]);

  const active = openIndex !== null ? stills[openIndex] : null;

  return (
    <>
      <div className={`stills-slider${className ? ` ${className}` : ''}`}>
        <div className="stills-slider__header">
          <h2 className="stills-section__title">{title}</h2>
          <div className="stills-slider__controls">
            <button
              type="button"
              className="stills-slider__nav"
              onClick={() => scrollBySlide(-1)}
              disabled={!canScrollPrev}
              aria-label={prevLabel}
            >
              ←
            </button>
            <button
              type="button"
              className="stills-slider__nav"
              onClick={() => scrollBySlide(1)}
              disabled={!canScrollNext}
              aria-label={nextLabel}
            >
              →
            </button>
          </div>
        </div>

        <div ref={trackRef} className="stills-slider__track" role="list">
          {stills.map((still, index) => (
            <button
              key={still.id}
              type="button"
              className="stills-slider__slide"
              role="listitem"
              onClick={() => setOpenIndex(index)}
              aria-label={viewLabel(still.alt)}
            >
              <img src={still.src} alt={still.alt} loading="lazy" decoding="async" draggable={false} />
            </button>
          ))}
        </div>
      </div>

      {createPortal(
        <AnimatePresence>
          {active && openIndex !== null && (
            <motion.div
              className="stills-lightbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              role="dialog"
              aria-modal="true"
              aria-label={active.alt}
            >
              <button type="button" className="stills-lightbox__backdrop" onClick={close} aria-label="Close" />
              <div className="stills-lightbox__inner">
                <div className="stills-lightbox__header">
                  <div className="stills-lightbox__rule" aria-hidden="true" />
                  <button type="button" className="stills-lightbox__close field-label" onClick={close}>
                    Close
                  </button>
                </div>
                <div className="stills-lightbox__stage">
                  <button
                    type="button"
                    className="stills-lightbox__nav stills-lightbox__nav--prev"
                    onClick={goPrev}
                    aria-label="Previous still"
                  >
                    ←
                  </button>
                  <figure className="stills-lightbox__figure">
                    <img src={active.src} alt={active.alt} />
                  </figure>
                  <button
                    type="button"
                    className="stills-lightbox__nav stills-lightbox__nav--next"
                    onClick={goNext}
                    aria-label="Next still"
                  >
                    →
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
