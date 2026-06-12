import type { ReactNode } from 'react';
import { useReveal, type UseRevealOptions } from '../hooks/useReveal';
import './RevealSection.css';

interface RevealSectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
  /** Trigger reveal before the section fully enters the viewport (e.g. right after the map). */
  revealEarly?: boolean;
  revealOptions?: UseRevealOptions;
}

export function RevealSection({
  id,
  className = '',
  children,
  revealEarly = false,
  revealOptions,
}: RevealSectionProps) {
  const { ref, visible } = useReveal(
    revealOptions ??
      (revealEarly
        ? { threshold: 0.02, rootMargin: '0px 0px 24% 0px' }
        : undefined),
  );

  return (
    <section
      id={id}
      ref={ref}
      className={`reveal-section${revealEarly ? ' reveal-section--early' : ''} ${visible ? 'reveal-section--visible' : ''} ${className}`}
    >
      {children}
    </section>
  );
}
