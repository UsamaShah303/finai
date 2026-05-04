import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "motion/react";
import { useRef, useState } from "react";
import { Search, Users, Compass, TrendingUp, Zap, LayoutGrid, Clock, Sparkles, BookOpen, Home, BrainCircuit, Target, CreditCard, CheckCircle2 } from "lucide-react";

const SLIDES = [
  {
    id: "ai-portfolio",
    phoneTitle: "AI Portfolio",
    phoneAccent: "#00C853",
    phoneTag: "AI-POWERED",
    phoneTagColor: "text-emerald-400",
    imageSeed: "stockmarket",
    phoneAllocs: [
      { label: "PSX Equities", pct: 45, color: "bg-emerald-400" },
      { label: "Global ETFs",  pct: 30, color: "bg-blue-400" },
      { label: "Bonds",        pct: 15, color: "bg-violet-400" },
      { label: "Cash",         pct: 10, color: "bg-slate-300" },
    ],
    phoneReturn: "+18.4%",
    phoneReturnLabel: "YTD Return",
    heading: "Invest smarter with AI-built portfolios",
    description: "Our AI analyzes thousands of market signals across PSX and international exchanges to build a portfolio tailored to your risk tolerance, timeline, and goals. Automatic rebalancing keeps your investments on track.",
    bullets: [
      "Personalized risk-matched portfolios",
      "Auto-rebalancing when drift > 5%",
      "PSX + Global ETF diversification",
      "Monte Carlo forecasting",
    ],
    accent: "#00C853",
  },
  {
    id: "goal-tracker",
    phoneTitle: "Goal Tracker",
    phoneAccent: "#7C3AED",
    phoneTag: "AI-GUIDED",
    phoneTagColor: "text-violet-400",
    imageSeed: "lahore-architecture",
    phoneAllocs: [
      { label: "Dream Home",    pct: 68, color: "bg-violet-400" },
      { label: "Hajj Savings",  pct: 45, color: "bg-emerald-400" },
      { label: "University",    pct: 32, color: "bg-blue-400" },
      { label: "Retirement",    pct: 15, color: "bg-orange-400" },
    ],
    phoneReturn: "4 Goals",
    phoneReturnLabel: "Active Goals",
    heading: "Every dream deserves a plan",
    description: "From your dream home in Lahore to your children's university fees, Hajj savings to a comfortable retirement — set any goal and watch AI chart the fastest path to reaching it.",
    bullets: [
      "Unlimited financial goals",
      "Success probability scores",
      "Smart milestone tracking",
      "Adaptive recommendations",
    ],
    accent: "#7C3AED",
  },
  {
    id: "smart-savings",
    phoneTitle: "Smart Savings",
    phoneAccent: "#0EA5E9",
    phoneTag: "HIGH YIELD",
    phoneTagColor: "text-sky-400",
    imageSeed: "piggybank",
    phoneAllocs: [
      { label: "High-Yield Savings", pct: 60, color: "bg-sky-400" },
      { label: "Emergency Fund",     pct: 20, color: "bg-emerald-400" },
      { label: "Auto-Save",          pct: 15, color: "bg-violet-400" },
      { label: "Spending",           pct: 5,  color: "bg-slate-400" },
    ],
    phoneReturn: "8.5%",
    phoneReturnLabel: "Annual Yield",
    heading: "Your money grows while you sleep",
    description: "Earn high-yield returns on your savings with AI-powered allocation. Our smart splitter automatically divides your paycheck into investing, saving, and spending — making every rupee work harder.",
    bullets: [
      "High-yield savings accounts",
      "AI paycheck splitter",
      "Auto-save rules",
      "Emergency fund protection",
    ],
    accent: "#0EA5E9",
  },
];

/* ─── Mini portfolio bar used inside the phone screen ─── */
const PhoneAllocBar = ({ allocs }) => (
  <div className="flex h-2 rounded-full overflow-hidden w-full gap-px">
    {allocs.map((a, i) => (
      <div key={i} className={`${a.color} rounded-full`} style={{ width: `${a.pct}%` }} />
    ))}
  </div>
);

const ParallaxShowcase = () => {
  const containerRef = useRef(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const navigate = (dir) => {
    setDirection(dir);
    setSlideIndex((prev) => (prev + dir + SLIDES.length) % SLIDES.length);
  };

  const slide = SLIDES[slideIndex];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

  const scale   = useSpring(useTransform(scrollYProgress, [0.1, 0.35], [0.6, 1]),   springConfig);
  const rotate  = useSpring(useTransform(scrollYProgress, [0.1, 0.35], [10, 0]),    springConfig);
  const y       = useSpring(useTransform(scrollYProgress, [0.1, 0.35], [150, 0]),   springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0.1, 0.25], [0, 1]),     springConfig);

  // ═══ Card Parallax ═══
  const invX   = useSpring(useTransform(scrollYProgress, [0.2, 0.4],   [-500, -380]), springConfig);
  const invY   = useSpring(useTransform(scrollYProgress, [0.2, 0.4],   [50, 0]),      springConfig);
  const bonusX = useSpring(useTransform(scrollYProgress, [0.22, 0.42], [-250, -180]), springConfig);
  const bonusY = useSpring(useTransform(scrollYProgress, [0.22, 0.42], [-400, -280]), springConfig);
  const kidsX  = useSpring(useTransform(scrollYProgress, [0.24, 0.44], [400, 280]),   springConfig);
  const kidsY  = useSpring(useTransform(scrollYProgress, [0.24, 0.44], [-350, -220]), springConfig);
  const bankX  = useSpring(useTransform(scrollYProgress, [0.26, 0.46], [500, 380]),   springConfig);
  const bankY  = useSpring(useTransform(scrollYProgress, [0.26, 0.46], [150, 120]),   springConfig);
  const retX   = useSpring(useTransform(scrollYProgress, [0.28, 0.48], [-400, -280]), springConfig);
  const retY   = useSpring(useTransform(scrollYProgress, [0.28, 0.48], [350, 240]),   springConfig);
  const learnX = useSpring(useTransform(scrollYProgress, [0.3, 0.5],   [250, 180]),   springConfig);
  const learnY = useSpring(useTransform(scrollYProgress, [0.3, 0.5],   [400, 300]),   springConfig);

  const rawCardOpacity    = useTransform(scrollYProgress, [0.2, 0.35, 0.45, 0.52], [0, 1, 1, 0]);
  const cardOpacity       = useSpring(rawCardOpacity, springConfig);
  const cardPointerEvents = useTransform(scrollYProgress, (v) => (v > 0.45 ? "none" : "auto"));

  const rawFeatureUIOpacity  = useTransform(scrollYProgress, [0.45, 0.52], [0, 1]);
  const featureUIOpacity     = useSpring(rawFeatureUIOpacity, springConfig);
  const rawFeatureUIPosition = useTransform(scrollYProgress, [0.45, 0.52], [60, 0]);
  const featureUIPosition    = useSpring(rawFeatureUIPosition, springConfig);
  const rawInvestUIOpacity   = useTransform(scrollYProgress, [0.45, 0.52], [1, 0]);
  const investUIOpacity      = useSpring(rawInvestUIOpacity, springConfig);

  const rawSectionOpacity  = useTransform(scrollYProgress, [0.45, 0.52], [0, 1]);
  const sectionOpacity     = useSpring(rawSectionOpacity, springConfig);
  const rawSectionY        = useTransform(scrollYProgress, [0.45, 0.52], [40, 0]);
  const sectionY           = useSpring(rawSectionY, springConfig);
  const sectionPointer     = useTransform(scrollYProgress, (v) => (v < 0.45 ? "none" : "auto"));

  return (
    <section ref={containerRef} className="relative h-[250vh] bg-white overflow-visible">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center overflow-hidden">

        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center -z-10">
          <div className="w-[600px] h-[600px] bg-[#f0f4ef] rounded-full blur-[100px] opacity-60" />
        </div>

        {/* Heading */}
        <div className="text-center pt-16 pb-4 shrink-0 z-20">
          <motion.h2 style={{ opacity }} className="text-4xl md:text-5xl font-extrabold text-[#1a1a1a] mb-3">
            Invest for <span className="text-[#00C853]">everyone</span>.
          </motion.h2>
          <motion.p style={{ opacity }} className="text-slate-500 max-w-md mx-auto font-medium">
            A suite of tools designed to help you and your family grow wealth together.
          </motion.p>
        </div>

        {/* ═══ Phone + Cards ═══ */}
        <div className="relative flex-1 flex flex-col items-center justify-center w-full scale-75 sm:scale-[0.85] md:scale-90 lg:scale-100">

          {/* Phone — outer div carries transforms only, inner div owns the clip */}
          <motion.div
            style={{ scale, rotate, y }}
            className="relative w-[320px] h-[660px] rounded-[4.5rem] shadow-[0_80px_160px_-40px_rgba(0,0,0,0.5)]"
          >
            {/* translateZ(0) forces a GPU compositor layer so overflow-hidden + border-radius clips correctly even inside a transformed parent */}
            <div
              className="absolute inset-0 bg-[#121212] rounded-[4.5rem] border-[14px] border-[#222] overflow-hidden flex flex-col "
              style={{ transform: 'translateZ(0)', WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
            >
              {/* Camera notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-[#222] rounded-b-[2rem] z-[100]" />

              {/* ── UI State 1: Learn / Invest (dark) ── */}
              <motion.div style={{ opacity: investUIOpacity }} className="absolute inset-0 z-10 bg-[#121212] rounded-[calc(4.5rem-14px)] overflow-hidden p-7 flex flex-col">
                <div className="pt-10 flex items-center justify-between mb-10">
                  <Search className="w-7 h-7 text-white/30" />
                  <span className="text-white font-bold text-lg tracking-tight">Learn</span>
                  <div className="w-7" />
                </div>
                <div className="flex gap-4 mb-10">
                  <div className="bg-white px-5 py-2.5 rounded-full text-xs font-bold text-black shadow-lg">Just for you</div>
                  <div className="bg-white/10 px-5 py-2.5 rounded-full text-xs font-bold text-white border border-white/5">Investing</div>
                </div>
                <div className="relative rounded-[3rem] overflow-hidden aspect-[4/5] bg-slate-800 shadow-2xl">
                  <img src="https://picsum.photos/seed/person/600/800" className="absolute inset-0 w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute top-5 left-5 bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-full text-[10px] font-black text-white tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> LIVE SESSION
                  </div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-3xl font-black text-white mb-3 leading-tight tracking-tight">The American Dream isn't dead</h3>
                    <div className="flex items-center gap-3 text-[#00C853] font-bold text-xs">
                      <Compass className="w-5 h-5" /> Join Audio
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ── UI State 2: Feature screen (light) ── */}
              <motion.div
                style={{ opacity: featureUIOpacity, y: featureUIPosition }}
                className="absolute inset-0 z-20 bg-[#0f0f0f] rounded-[calc(4.5rem-14px)] overflow-hidden flex flex-col"
              >
                {/* Phone header */}
                <div className="pt-12 px-6 pb-5 flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                    <BrainCircuit className="w-5 h-5 text-white/60" />
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={slideIndex + "-phone-title"}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22 }}
                      className="text-center"
                    >
                      <p className="text-[15px] font-black text-white tracking-tight leading-none mb-1">{slide.phoneTitle}</p>
                      <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${slide.phoneTagColor}`}>{slide.phoneTag}</p>
                    </motion.div>
                  </AnimatePresence>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={slideIndex + "-phone-return"}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.22 }}
                      className="text-right"
                    >
                      <p className="text-[14px] font-black text-white leading-none" style={{ color: slide.phoneAccent }}>{slide.phoneReturn}</p>
                      <p className="text-[8px] text-white/40 font-semibold mt-0.5">{slide.phoneReturnLabel}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Allocation bar */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={slideIndex + "-bar"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 mb-4"
                  >
                    <PhoneAllocBar allocs={slide.phoneAllocs} />
                  </motion.div>
                </AnimatePresence>

                {/* Hero image card with metric overlay */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={slideIndex + "-hero"}
                    initial={{ opacity: 0, x: direction * 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction * -30 }}
                    transition={{ duration: 0.32 }}
                    className="px-6 mb-4"
                  >
                    <div className="relative h-[120px] rounded-[1.5rem] overflow-hidden">
                      <img
                        src={`https://picsum.photos/seed/${slide.imageSeed}/400/240`}
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                      {/* Accent tint overlay */}
                      <div className="absolute inset-0 opacity-20 rounded-[1.5rem]" style={{ background: `linear-gradient(135deg, ${slide.phoneAccent}55 0%, transparent 60%)` }} />
                      <div className="absolute bottom-4 left-4">
                        <p className="text-[30px] font-black text-white leading-none tracking-tighter">{slide.phoneReturn}</p>
                        <p className="text-[9px] text-white/55 font-semibold mt-0.5 uppercase tracking-wider">{slide.phoneReturnLabel}</p>
                      </div>
                      <div
                        className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-wider"
                        style={{ backgroundColor: slide.phoneAccent + "30", color: slide.phoneAccent }}
                      >
                        {slide.phoneTag}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Allocation rows */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={slideIndex + "-rows"}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3, delay: 0.05 }}
                    className="px-6 flex flex-col gap-3 flex-1"
                  >
                    {slide.phoneAllocs.map((a, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-2.5 h-2.5 rounded-full ${a.color}`} />
                          <span className="text-[12px] text-white/70 font-semibold">{a.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${a.color}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${a.pct}%` }}
                              transition={{ duration: 0.6, delay: i * 0.07 }}
                            />
                          </div>
                          <span className="text-[11px] font-black text-white/50 w-8 text-right">{a.pct}%</span>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Bottom nav */}
                <div className="h-24 border-t border-white/5 flex items-center justify-between px-10 shrink-0">
                  {[Home, TrendingUp, Zap, Compass, LayoutGrid].map((Icon, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                      <Icon className={`w-6 h-6 ${i === 1 ? "text-white stroke-[3]" : "text-white/25 stroke-[1.5]"}`} />
                      <div className={`w-1 h-1 rounded-full ${i === 1 ? "bg-white" : "bg-transparent"}`} />
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>
          </motion.div>

          {/* ═══ 1. INVESTING card ═══ */}
          <motion.div style={{ x: invX, y: invY, opacity: cardOpacity, pointerEvents: cardPointerEvents }} whileHover={{ y: -5 }}
            className="absolute w-[240px] h-[240px] bg-[#3a4d39] rounded-[40px] p-8 shadow-xl flex flex-col justify-between overflow-hidden cursor-pointer">
            <div className="flex items-center gap-2 text-white">
              <TrendingUp className="w-6 h-6" />
              <span className="text-2xl font-medium tracking-tight">Investing</span>
            </div>
            <div className="flex items-end gap-1.5 h-32">
              {[20,25,30,35,45,55,65,75,85,95,100].map((h, i) => (
                <motion.div key={i} animate={{ height:[`${h}%`,`${h+(Math.sin(i)*5)}%`,`${h}%`] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.1 }}
                  className="flex-1 bg-emerald-400/80 rounded-t-sm shadow-[0_0_15px_rgba(52,211,153,0.3)]" />
              ))}
            </div>
          </motion.div>

          {/* ═══ 2. BONUS INVESTMENTS pill ═══ */}
          <motion.div style={{ x: bonusX, y: bonusY, opacity: cardOpacity, pointerEvents: cardPointerEvents }} whileHover={{ y: -283 }}
            className="absolute w-[180px] h-[70px] bg-[#2D2D2D] rounded-[22px] p-4 shadow-xl flex items-center gap-3 overflow-hidden cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-emerald-400/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span className="text-[12px] font-bold text-emerald-400 block leading-tight">Bonus</span>
              <span className="text-[10px] font-semibold text-emerald-400/60 leading-tight">investments</span>
            </div>
          </motion.div>

          {/* ═══ 3. KIDS card ═══ */}
          <motion.div style={{ x: kidsX, y: kidsY, opacity: cardOpacity, pointerEvents: cardPointerEvents }} whileHover={{ y: -225 }}
            className="absolute w-[220px] h-[200px] bg-gradient-to-br from-[#7C3AED] to-[#9333EA] rounded-[40px] p-8 shadow-xl flex flex-col overflow-hidden cursor-pointer">
            <div className="flex items-center gap-2 text-white mb-3">
              <Users className="w-6 h-6 text-purple-200" />
              <span className="text-2xl font-medium tracking-tight">Kids</span>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity }} className="flex gap-3 text-[44px]">
                <span>🐿️</span><span className="mt-3">🐿️</span>
              </motion.div>
            </div>
          </motion.div>

          {/* ═══ 4. BANKING card ═══ */}
          <motion.div style={{ x: bankX, y: bankY, opacity: cardOpacity, pointerEvents: cardPointerEvents }} whileHover={{ y: 115 }}
            className="absolute w-[240px] h-[240px] bg-[#438a1f] rounded-[50px] p-8 shadow-xl flex flex-col justify-between overflow-hidden cursor-pointer">
            <div className="flex items-center gap-2 text-white">
              <LayoutGrid className="w-6 h-6" />
              <span className="text-2xl font-medium tracking-tight">Banking</span>
            </div>
            <div className="relative mt-4 h-28 w-40 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl shadow-lg self-end p-4 border border-white/20"
              style={{ transform: "perspective(600px) rotateY(-12deg) rotateX(6deg) rotate(12deg)" }}>
              <div className="w-8 h-6 bg-yellow-200/50 rounded-md" />
              <span className="absolute bottom-4 right-4 text-[10px] font-bold text-white/80 italic tracking-wider">VISA</span>
            </div>
          </motion.div>

          {/* ═══ 5. RETIREMENT card ═══ */}
          <motion.div style={{ x: retX, y: retY, opacity: cardOpacity, pointerEvents: cardPointerEvents }} whileHover={{ y: 235 }}
            className="absolute w-[240px] h-[180px] bg-gradient-to-br from-[#b5a590] to-[#c4b59f] rounded-[40px] p-8 shadow-xl flex flex-col overflow-hidden cursor-pointer">
            <div className="flex items-center gap-2 text-white mb-1">
              <Clock className="w-5 h-5 text-white/80" />
              <span className="text-xl font-medium tracking-tight">Retirement</span>
            </div>
            <div className="flex items-baseline mt-auto">
              <span className="text-[60px] font-black text-white/20 leading-none tracking-tight">3%</span>
            </div>
          </motion.div>

          {/* ═══ 6. LEARNING card ═══ */}
          <motion.div style={{ x: learnX, y: learnY, opacity: cardOpacity, pointerEvents: cardPointerEvents }} whileHover={{ y: 295 }}
            className="absolute w-[160px] h-[140px] bg-[#1a1a1a] rounded-[32px] p-6 shadow-xl flex flex-col items-center justify-center overflow-hidden cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5 text-white/70" />
            </div>
            <span className="text-[16px] font-bold text-white">Learning</span>
          </motion.div>

          {/* ═══ LEFT TOGGLES ═══ */}
          <motion.div
            style={{ opacity: sectionOpacity, y: sectionY, pointerEvents: sectionPointer }}
            className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-6 z-20 md:-ml-[280px] lg:-ml-[360px]"
          >
            <button className="w-[85px] h-[85px] rounded-full bg-[#18181b] text-white flex flex-col items-center justify-center text-[10px] font-black tracking-[0.15em] hover:scale-105 transition-transform shadow-2xl border border-white/10 uppercase">
              <span>FOR</span><span>YOU</span>
            </button>
            <button className="w-[85px] h-[85px] rounded-full bg-[#d4d4d3] text-white flex flex-col items-center justify-center text-[10px] font-black tracking-[0.15em] hover:scale-105 transition-transform shadow-lg border border-black/5 uppercase">
              <span>FOR YOUR</span><span>FAMILY</span>
            </button>
          </motion.div>

          {/* ═══ RIGHT TEXT BLOCK ═══ */}
          <motion.div
            style={{ opacity: sectionOpacity, y: sectionY, pointerEvents: sectionPointer }}
            className="absolute left-1/2 top-1/2 -translate-y-1/2 hidden md:block max-w-[340px] lg:max-w-[400px] text-left z-20 md:ml-[220px] lg:ml-[260px]"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={slideIndex}
                initial={{ opacity: 0, x: direction * 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -24 }}
                transition={{ duration: 0.32 }}
              >
                {/* Section label */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: slide.accent }} />
                  <span className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: slide.accent }}>
                    {slide.phoneTag}
                  </span>
                </div>

                {/* Heading */}
                <h3 className="text-[32px] lg:text-[38px] font-bold text-[#1A1A1A] mb-4 tracking-tight leading-[1.1]">
                  {slide.heading}
                </h3>

                {/* Description */}
                <p className="text-[#5A5A5A] text-[14px] lg:text-[15px] leading-[1.7] mb-6">
                  {slide.description}
                </p>

                {/* Bullet points */}
                <ul className="flex flex-col gap-2.5 mb-8">
                  {slide.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: slide.accent }} />
                      <span className="text-[13px] lg:text-[14px] text-[#3a3a3a] font-medium leading-snug">{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>

            {/* Learn more + arrows (outside AnimatePresence so they don't re-animate) */}
            <button
              className="font-bold text-[14px] mb-8 flex items-center gap-1.5 transition-opacity hover:opacity-70"
              style={{ color: slide.accent }}
            >
              Learn more
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>

            <div className="flex gap-5 items-center">
              <motion.button
                whileHover={{ scale: 1.15, x: -2 }}
                whileTap={{ scale: 0.88 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={() => navigate(-1)}
                className="cursor-pointer"
                style={{ color: slide.accent }}
                aria-label="Previous"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              </motion.button>

              <div className="flex gap-1.5 items-center">
                {SLIDES.map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ width: i === slideIndex ? 20 : 6, opacity: i === slideIndex ? 1 : 0.3 }}
                    transition={{ duration: 0.25 }}
                    className="h-1.5 rounded-full cursor-pointer"
                    style={{ backgroundColor: slide.accent }}
                    onClick={() => { setDirection(i > slideIndex ? 1 : -1); setSlideIndex(i); }}
                  />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.15, x: 2 }}
                whileTap={{ scale: 0.88 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={() => navigate(1)}
                className="cursor-pointer"
                style={{ color: slide.accent }}
                aria-label="Next"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </motion.button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ParallaxShowcase;
