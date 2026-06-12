import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './BackToTop.css';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const footer = document.getElementById('footer');
      const threshold = window.innerHeight * 1.2;
      const nearFooter = footer
        ? footer.getBoundingClientRect().top < window.innerHeight * 0.85
        : false;
      setVisible(window.scrollY > threshold || nearFooter);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          className="back-to-top field-label"
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 12, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Back to top"
        >
          <span className="back-to-top__icon" aria-hidden="true">
            ↑
          </span>
          Top
        </motion.button>
      )}
    </AnimatePresence>
  );
}
