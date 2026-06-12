import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { ParentSize } from '@visx/responsive';
import { scaleLinear, scalePoint } from '@visx/scale';
import { LinePath } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { fertilizerUseView } from '../../data/whyNow/fertilizerUse';
import { pesticideUseView, PESTICIDE_COUNTRY_ORDER } from '../../data/whyNow/pesticideUse';
import type { FertilizerCountryId, FertilizerPoint } from '../../data/whyNow/types';
import { useReveal } from '../../hooks/useReveal';
import './FertilizerDependence.css';

const MARGIN = { top: 28, right: 96, bottom: 36, left: 8 };
const HIT_STROKE = 18;

const COUNTRY_ORDER: FertilizerCountryId[] = [
  'kenya',
  'rwanda',
  'ethiopia',
  'tanzania',
  'uganda',
];

const COUNTRY_LABELS: Record<FertilizerCountryId, string> = {
  kenya: 'Kenya',
  rwanda: 'Rwanda',
  ethiopia: 'Ethiopia',
  tanzania: 'Tanzania',
  uganda: 'Uganda',
};

interface LinePoint {
  x: number;
  y: number;
  year: number;
  value: number;
}

interface ChartProps {
  width: number;
  height: number;
  series: Partial<Record<FertilizerCountryId, FertilizerPoint[]>>;
  countryOrder: readonly FertilizerCountryId[];
  animate: boolean;
  yMax?: number;
}

function nearestPoint(line: LinePoint[], x: number): LinePoint {
  return line.reduce((best, point) =>
    Math.abs(point.x - x) < Math.abs(best.x - x) ? point : best,
  );
}

function FertilizerChart({ width, height, series, countryOrder, animate, yMax: yMaxFixed }: ChartProps) {
  const pathRefs = useRef<Partial<Record<FertilizerCountryId, SVGPathElement | null>>>({});
  const [pathLengths, setPathLengths] = useState<Partial<Record<FertilizerCountryId, number>>>({});
  const [drawReady, setDrawReady] = useState(false);
  const [activeSeries, setActiveSeries] = useState<FertilizerCountryId | null>(null);
  const [hoverPoint, setHoverPoint] = useState<LinePoint | null>(null);

  const innerWidth = width - MARGIN.left - MARGIN.right;
  const innerHeight = height - MARGIN.top - MARGIN.bottom;

  const years = useMemo(() => {
    const set = new Set<number>();
    countryOrder.forEach((id) => series[id]?.forEach((p) => set.add(p.year)));
    return [...set].sort((a, b) => a - b);
  }, [series, countryOrder]);

  const yMax = useMemo(() => {
    if (yMaxFixed !== undefined) return yMaxFixed;
    const values = countryOrder.flatMap((id) => series[id]?.map((p) => p.value) ?? []);
    return Math.ceil(Math.max(...values) * 1.12);
  }, [series, countryOrder, yMaxFixed]);

  const xScale = useMemo(
    () =>
      scalePoint<number>({
        domain: years,
        range: [0, innerWidth],
        padding: 0.5,
      }),
    [years, innerWidth],
  );

  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [0, yMax],
        range: [innerHeight, 0],
        nice: true,
      }),
    [yMax, innerHeight],
  );

  const toLine = useCallback(
    (points: FertilizerPoint[]) =>
      points
        .filter((p) => years.includes(p.year))
        .map((p) => ({
          x: xScale(p.year) ?? 0,
          y: yScale(p.value),
          year: p.year,
          value: p.value,
        })),
    [years, xScale, yScale],
  );

  const lines = useMemo(
    () =>
      Object.fromEntries(
        countryOrder.map((id) => [id, toLine(series[id] ?? [])]),
      ) as Record<FertilizerCountryId, LinePoint[]>,
    [series, toLine, countryOrder],
  );

  const firstYear = years[0];
  const lastYear = years[years.length - 1];

  useLayoutEffect(() => {
    const lengths: Partial<Record<FertilizerCountryId, number>> = {};
    countryOrder.forEach((id) => {
      lengths[id] = pathRefs.current[id]?.getTotalLength() ?? 0;
    });
    setPathLengths(lengths);
  }, [width, height, lines, countryOrder]);

  useEffect(() => {
    if (!animate) {
      setDrawReady(false);
      return;
    }

    let frame2 = 0;
    const frame1 = requestAnimationFrame(() => {
      frame2 = requestAnimationFrame(() => setDrawReady(true));
    });

    return () => {
      cancelAnimationFrame(frame1);
      cancelAnimationFrame(frame2);
    };
  }, [animate]);

  const lineStyle = (length: number, delay: string) =>
    length > 0
      ? ({
          strokeDasharray: length,
          strokeDashoffset: drawReady ? 0 : length,
          transition: `stroke-dashoffset 2.1s cubic-bezier(0.4, 0, 0.2, 1) ${delay}`,
        } as const)
      : undefined;

  const localX = (event: ReactMouseEvent<SVGPathElement>) => {
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return 0;

    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;

    const matrix = event.currentTarget.getScreenCTM()?.inverse();
    if (!matrix) return 0;

    return point.matrixTransform(matrix).x;
  };

  const handleSeriesMove = (
    seriesId: FertilizerCountryId,
    line: LinePoint[],
    event: ReactMouseEvent<SVGPathElement>,
  ) => {
    setActiveSeries(seriesId);
    setHoverPoint(nearestPoint(line, localX(event)));
  };

  const clearSeriesHover = () => {
    setActiveSeries(null);
    setHoverPoint(null);
  };

  const seriesClass = (seriesId: FertilizerCountryId) => {
    if (!activeSeries) return '';
    return activeSeries === seriesId ? ' is-active' : ' is-dimmed';
  };

  const activePoint =
    hoverPoint && activeSeries
      ? lines[activeSeries].find((p) => p.year === hoverPoint.year) ?? hoverPoint
      : null;

  return (
    <svg
      width={width}
      height={height}
      className={`fertilizer-chart${drawReady ? ' fertilizer-chart--animate' : ''}${activeSeries ? ' fertilizer-chart--hover' : ''}`}
      aria-hidden="true"
    >
      <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
        {activePoint && (
          <line
            x1={activePoint.x}
            x2={activePoint.x}
            y1={0}
            y2={innerHeight}
            className="fertilizer-chart__cursor"
          />
        )}

        {countryOrder.map((id, index) => {
          const line = lines[id];
          const length = pathLengths[id] ?? 0;
          const end = line[line.length - 1];

          return (
            <g
              key={id}
              className={`fertilizer-chart__series fertilizer-chart__series--${id}${seriesClass(id)}`}
            >
              <LinePath
                innerRef={(node) => {
                  pathRefs.current[id] = node;
                }}
                data={line}
                x={(d) => d.x}
                y={(d) => d.y}
                curve={curveMonotoneX}
                className={`fertilizer-chart__line fertilizer-chart__line--${id}`}
                style={lineStyle(length, `${0.25 + index * 0.15}s`)}
              />
              <LinePath
                data={line}
                x={(d) => d.x}
                y={(d) => d.y}
                curve={curveMonotoneX}
                className="fertilizer-chart__hit"
                strokeWidth={HIT_STROKE}
                onMouseEnter={() => setActiveSeries(id)}
                onMouseMove={(event) => handleSeriesMove(id, line, event)}
                onMouseLeave={clearSeriesHover}
              />
              {line.map((point) => (
                <circle
                  key={point.year}
                  cx={point.x}
                  cy={point.y}
                  r={hoverPoint?.year === point.year && activeSeries === id ? 4.5 : 3}
                  className={`fertilizer-chart__dot fertilizer-chart__dot--${id}`}
                  opacity={
                    activeSeries === id
                      ? hoverPoint?.year === point.year
                        ? 1
                        : 0.35
                      : 0
                  }
                />
              ))}
              {end && (
                <text
                  x={end.x + 8}
                  y={end.y + 4}
                  className={`fertilizer-chart__label fertilizer-chart__label--${id}${activeSeries === id ? ' is-active' : ''}${activeSeries && activeSeries !== id ? ' is-dimmed' : ''}`}
                >
                  {COUNTRY_LABELS[id]}
                </text>
              )}
            </g>
          );
        })}

        {activePoint && activeSeries && (
          <g
            className={`fertilizer-chart__tooltip fertilizer-chart__tooltip--${activeSeries}`}
            transform={`translate(${Math.min(activePoint.x, innerWidth - 92)}, ${activePoint.y - 14})`}
          >
            <rect x={-6} y={-22} width={88} height={26} rx={2} className="fertilizer-chart__tooltip-box" />
            <text y={-10} className="fertilizer-chart__tooltip-year">
              {activePoint.year}
            </text>
            <text y={-2} className="fertilizer-chart__tooltip-value">
              {activePoint.value.toFixed(1)}
            </text>
          </g>
        )}

        <text
          x={xScale(firstYear) ?? 0}
          y={innerHeight + 28}
          className="fertilizer-chart__axis-year"
        >
          {firstYear}
        </text>
        <text
          x={xScale(lastYear) ?? innerWidth}
          y={innerHeight + 28}
          textAnchor="end"
          className="fertilizer-chart__axis-year"
        >
          {lastYear}
        </text>
      </g>
    </svg>
  );
}

const BEATS_CHART_HEIGHT = 196;

export function FertilizerDependence({ beatsLayout = false }: { beatsLayout?: boolean }) {
  const { ref, visible } = useReveal({ threshold: 0.25 });

  const chartSeries = useMemo(() => {
    const from = fertilizerUseView.chartFromYear;
    const series = Object.fromEntries(
      COUNTRY_ORDER.map((id) => [
        id,
        fertilizerUseView.series[id].filter((p) => p.year >= from),
      ]),
    ) as Record<FertilizerCountryId, FertilizerPoint[]>;

    return {
      series,
      generatedAt: fertilizerUseView.generatedAt,
      source: fertilizerUseView.source,
      url: fertilizerUseView.url,
      unit: fertilizerUseView.unit,
    };
  }, []);

  const pesticideSeries = useMemo(() => {
    const from = pesticideUseView.chartFromYear;
    return Object.fromEntries(
      PESTICIDE_COUNTRY_ORDER.map((id) => [
        id,
        pesticideUseView.series[id].filter((p) => p.year >= from),
      ]),
    ) as Record<FertilizerCountryId, FertilizerPoint[]>;
  }, []);

  const chartHeight = (width: number, measuredHeight = 0) => {
    if (beatsLayout) return BEATS_CHART_HEIGHT;
    return measuredHeight > 0
      ? Math.max(176, Math.floor(measuredHeight))
      : Math.min(252, Math.max(188, width * 0.36));
  };

  return (
    <section
      ref={ref}
      className={`fertilizer-view${beatsLayout ? ' fertilizer-view--beats' : ''}`}
      aria-labelledby="fertilizer-view-title"
    >
      <h3 id="fertilizer-view-title" className="fertilizer-view__title">
        The Rising Dependence
      </h3>

      <p className="fertilizer-view__headline">
        Fertilizer use per hectare has climbed steadily across East Africa since 2000.
      </p>

      <div className="fertilizer-view__chart-stack">
        <div className="fertilizer-view__chart-block">
          <div className="fertilizer-view__chart-wrap">
            <p className="fertilizer-view__chart-unit field-label">
              kg nutrients per hectare of arable land
            </p>
            <div className="fertilizer-view__chart-canvas">
              <ParentSize debounceTime={beatsLayout ? 0 : 10}>
                {({ width, height }) =>
                  width > 0 ? (
                    <FertilizerChart
                      width={width}
                      height={chartHeight(width, height)}
                      series={chartSeries.series}
                      countryOrder={COUNTRY_ORDER}
                      animate={visible}
                    />
                  ) : null
                }
              </ParentSize>
            </div>
          </div>
        </div>

        <div className="fertilizer-view__chart-block">
          <p className="fertilizer-view__headline fertilizer-view__headline--sub">
            {pesticideUseView.title}
          </p>
          <div className="fertilizer-view__chart-wrap">
            <p className="fertilizer-view__chart-unit field-label">{pesticideUseView.unitLabel}</p>
            <div className="fertilizer-view__chart-canvas">
              <ParentSize debounceTime={beatsLayout ? 0 : 10}>
                {({ width, height }) =>
                  width > 0 ? (
                    <FertilizerChart
                      width={width}
                      height={chartHeight(width, height)}
                      series={pesticideSeries}
                      countryOrder={PESTICIDE_COUNTRY_ORDER}
                      animate={visible}
                      yMax={pesticideUseView.yMax}
                    />
                  ) : null
                }
              </ParentSize>
            </div>
          </div>
          <p className="fertilizer-view__chart-note">{pesticideUseView.note}</p>
        </div>
      </div>

      <p className="fertilizer-view__source field-label">
        Source:{' '}
        <a href={chartSeries.url} target="_blank" rel="noopener noreferrer">
          {chartSeries.source}
        </a>
        {chartSeries.generatedAt && (
          <span className="fertilizer-view__retrieved"> · Data as of {chartSeries.generatedAt}</span>
        )}
      </p>
    </section>
  );
}
