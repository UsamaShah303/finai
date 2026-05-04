import { motion } from 'motion/react';

export default function SparkLine({
  data = [],
  width = 100,
  height = 32,
  color = '#10b981',
  strokeWidth = 2,
  filled = true,
  className = '',
}) {
  if (!data.length) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 4) - 2;
    return { x, y };
  });

  const pathD = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(' ');

  const fillD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  const trend = data[data.length - 1] >= data[0];
  const lineColor = color || (trend ? '#10b981' : '#ef4444');

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ overflow: 'visible' }}
    >
      {filled && (
        <defs>
          <linearGradient id={`spark-fill-${lineColor.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
          </linearGradient>
        </defs>
      )}
      {filled && (
        <motion.path
          d={fillD}
          fill={`url(#spark-fill-${lineColor.replace('#', '')})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      )}
      <motion.path
        d={pathD}
        fill="none"
        stroke={lineColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
      {/* End dot */}
      <motion.circle
        cx={points[points.length - 1]?.x}
        cy={points[points.length - 1]?.y}
        r={3}
        fill={lineColor}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: 'spring', stiffness: 300 }}
      />
    </svg>
  );
}
