import './EarthmapLegend.css';

const MARKER_TYPES = [
  { id: 'location', label: 'Production locations', color: '#e85d3a' },
] as const;

export function EarthmapLegend() {
  return (
    <aside className="earthmap-legend" aria-label="Map markers">
      <p className="earthmap-legend__title">Map markers</p>
      <ul className="earthmap-legend__list earthmap-legend__list--markers">
        {MARKER_TYPES.map((item) => (
          <li key={item.id} className="earthmap-legend__item">
            <span
              className={`earthmap-legend__swatch earthmap-legend__swatch--${item.id}`}
              style={{ background: item.color }}
              aria-hidden="true"
            />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
