import {
  SUB_SAHARAN_AFRICA_PATHS,
  SUB_SAHARAN_AFRICA_VIEWBOX,
} from '../../data/whyNow/subSaharanAfricaPaths';
import './SubSaharanAfricaMap.css';

interface SubSaharanAfricaMapProps {
  degradedPercent: number;
  animate: boolean;
  label: string;
}

export function SubSaharanAfricaMap({
  degradedPercent,
  animate,
  label,
}: SubSaharanAfricaMapProps) {
  const clipId = 'ssa-land-clip';
  const fillRatio = Math.min(100, Math.max(0, degradedPercent)) / 100;

  return (
    <figure
      className={`ssa-map${animate ? ' ssa-map--animate' : ''}`}
      aria-label={label}
      style={{ ['--fill-ratio' as string]: fillRatio }}
    >
      <svg
        viewBox={SUB_SAHARAN_AFRICA_VIEWBOX}
        className="ssa-map__svg"
        role="img"
        aria-hidden="true"
      >
        <defs>
          <clipPath id={clipId}>
            {SUB_SAHARAN_AFRICA_PATHS.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </clipPath>
          <linearGradient id="ssa-degraded-gradient" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#e85d3a" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#b84a2e" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        <g clipPath={`url(#${clipId})`}>
          <rect className="ssa-map__base" x="3" y="0" width="394" height="461" />
          <g className="ssa-map__degraded-wrap">
            <rect
              className="ssa-map__degraded"
              x="3"
              y="0"
              width="394"
              height="461"
              fill="url(#ssa-degraded-gradient)"
            />
            <line className="ssa-map__fill-edge" x1="3" y1="0" x2="397" y2="0" />
          </g>
        </g>

        <g className="ssa-map__outline">
          {SUB_SAHARAN_AFRICA_PATHS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      </svg>
    </figure>
  );
}
