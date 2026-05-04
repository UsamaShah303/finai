import { motion, useSpring, useTransform } from 'motion/react';
import { useEffect, useRef } from 'react';

export default function MiniRadialGauge({
  score = 0,
  maxScore = 100,
  size = 120,
  strokeWidth = 10,
  color = '#10b981',
  bgColor = '#f1f5f9',
  label = '',
  className = '',
  delay = 0,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(score / maxScore, 1);

  const springVal = useSpring(0, { stiffness: 40, damping: 25 });
  const strokeDashoffset = useTransform(
    springVal,
    (v) => circumference - v * circumference
  );

  const counterSpring = useSpring(0, { stiffness: 40, damping: 25 });
  const counterDisplay = useTransform(counterSpring, (v) => Math.round(v));

  useEffect(() => {
    const timer = setTimeout(() => {
      springVal.set(pct);
      counterSpring.set(score);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [pct, score, springVal, counterSpring, delay]);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        {/* Animated progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span className="text-2xl font-black text-slate-800 tabular-nums">
          {counterDisplay}
        </motion.span>
        {label && (
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
