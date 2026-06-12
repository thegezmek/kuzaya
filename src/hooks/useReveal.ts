import { useEffect, useRef, useState } from 'react';

export interface UseRevealOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useReveal(options: UseRevealOptions = {}) {
  const { threshold = 0.15, rootMargin = '0px 0px -8% 0px' } = options;
  const ref = useRef<HTMLElement>(null);
  const captureMode =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('capture') === '1';
  const [visible, setVisible] = useState(captureMode);

  useEffect(() => {
    if (captureMode) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, captureMode]);

  return { ref, visible };
}
