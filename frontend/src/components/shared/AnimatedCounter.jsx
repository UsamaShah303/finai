import { useEffect, useRef } from 'react';
import { useSpring, useTransform, motion, useInView } from 'motion/react';

export default function AnimatedCounter({
  value,
  format = 'currency',
  duration = 1.2,
  delay = 0,
  className = '',
  prefix = '',
  suffix = '',
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const springValue = useSpring(0, {
    stiffness: 60,
    damping: 30,
    duration: duration * 1000,
  });

  const displayValue = useTransform(springValue, (v) => {
    if (format === 'currency') {
      return `${prefix}$${Math.round(v).toLocaleString()}${suffix}`;
    }
    if (format === 'percent') {
      const sign = v > 0 ? '+' : '';
      return `${prefix}${sign}${v.toFixed(1)}%${suffix}`;
    }
    if (format === 'number') {
      return `${prefix}${Math.round(v).toLocaleString()}${suffix}`;
    }
    if (format === 'decimal') {
      return `${prefix}${v.toFixed(2)}${suffix}`;
    }
    return `${prefix}${Math.round(v)}${suffix}`;
  });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        springValue.set(value);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, value, springValue, delay]);

  return (
    <motion.span
      ref={ref}
      className={`tabular-nums ${className}`}
    >
      {displayValue}
    </motion.span>
  );
}
