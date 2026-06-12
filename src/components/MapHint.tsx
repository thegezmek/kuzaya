import { useEffect, useState } from 'react';
import './MapHint.css';

export function MapHint() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 8000);
    return () => clearTimeout(t);
  }, []);

  return (
    <p
      className={`map-hint field-label ${visible ? 'map-hint--visible' : 'map-hint--hidden'}`}
      aria-live="polite"
    >
      Double-click map or use Reset view
    </p>
  );
}
