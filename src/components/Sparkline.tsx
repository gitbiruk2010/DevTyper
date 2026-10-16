import React, { useId } from 'react';

interface SparklineProps {
  values: number[];
  color?: string;
  height?: number;
}

export const Sparkline: React.FC<SparklineProps> = ({ values, color = '#22d3ee', height = 80 }) => {
  const id = useId();
  const width = 300;
  if (values.length < 2) {
    return (
      <div className="flex items-center justify-center text-sm text-mist" style={{ height }}>
        Finish a couple of exercises to see your trend
      </div>
    );
  }
  const max = Math.max(...values, 1);
  const min = Math.min(...values);
  const range = Math.max(max - min, 1);
  const points = values.map((v, i) => [
    (i / (values.length - 1)) * width,
    height - 8 - ((v - min) / range) * (height - 16),
  ]);
  const line = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const [lastX, lastY] = points[points.length - 1];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none" role="img" aria-label="WPM trend">
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${line} ${width},${height}`} fill={`url(#${id})`} />
      <polyline points={line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx={lastX} cy={lastY} r="3.5" fill={color} />
    </svg>
  );
};
