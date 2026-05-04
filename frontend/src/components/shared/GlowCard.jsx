import { motion } from 'motion/react';

export default function GlowCard({
  children,
  className = '',
  accent = 'emerald',
  delay = 0,
  hoverScale = 1.015,
  noPadding = false,
}) {
  const accentMap = {
    emerald: 'from-emerald-400/20 via-teal-300/10 to-cyan-400/20',
    violet: 'from-violet-400/20 via-purple-300/10 to-fuchsia-400/20',
    amber: 'from-amber-400/20 via-orange-300/10 to-yellow-400/20',
    blue: 'from-blue-400/20 via-indigo-300/10 to-cyan-400/20',
    rose: 'from-rose-400/20 via-pink-300/10 to-red-400/20',
  };

  const glowMap = {
    emerald: 'hover:shadow-emerald-200/40',
    violet: 'hover:shadow-violet-200/40',
    amber: 'hover:shadow-amber-200/40',
    blue: 'hover:shadow-blue-200/40',
    rose: 'hover:shadow-rose-200/40',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 28,
        delay,
      }}
      whileHover={{ scale: hoverScale, y: -2 }}
      className={`
        relative group rounded-2xl overflow-hidden
        bg-white/80 backdrop-blur-xl
        border border-white/60
        shadow-lg shadow-black/[0.03]
        ${glowMap[accent] || glowMap.emerald}
        hover:shadow-xl
        transition-shadow duration-500
        ${className}
      `}
    >
      {/* Animated gradient border overlay */}
      <div className={`
        absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
        transition-opacity duration-500
        bg-gradient-to-br ${accentMap[accent] || accentMap.emerald}
        pointer-events-none
      `} />

      {/* Content */}
      <div className={`relative z-10 ${noPadding ? '' : 'p-6'}`}>
        {children}
      </div>
    </motion.div>
  );
}
