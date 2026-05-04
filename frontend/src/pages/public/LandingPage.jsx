import { Link } from 'react-router-dom';
import ParallaxShowcase from '../../components/ParallaxShowcase';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  TrendingUp, Shield, PieChart, Brain, Target,
  ArrowRight, ChevronDown, ChevronRight, ChevronLeft,
  CheckCircle, DollarSign, Lock, Eye, Users,
  BarChart3, Zap, Star, Play, Plus, Minus,
  Menu, X, Wallet, BookOpen, Award, LineChart, ClipboardList, Bot
} from 'lucide-react';

import heroDashboard from '../../assets/hero-dashboard.png';
import heroClouds from '../../assets/hero-clouds.png';
import heroCityscape from '../../assets/hero-cityscape.png';

/* ═══════════════════════════════════════════
   ACORNS-STYLE LANDING PAGE — FinAI Nexus
   ═══════════════════════════════════════════ */

/* ─── Color tokens (Acorns green palette) ─── */
const C = {
  greenDarkest: '#061D16',
  greenDark: '#0B3B2D',
  greenMid: '#1A5C45',
  green: '#2D8B6E',
  greenBright: '#00C853',
  greenLight: '#4ADE80',
  cream: '#F5F0E8',
  creamLight: '#FAF7F2',
  white: '#FFFFFF',
  textDk: '#1A1A2E',
  textMd: '#4A5568',
  textLt: '#718096',
  gold: '#FFB347',
  blue: '#4A90E2',
  purple: '#9B59B6',
};

/* ─── FAQ data ─── */
const faqItems = [
  { q: 'Is FinAI Nexus safe and secure?', a: 'Yes. We use 256-bit bank-level encryption, two-factor authentication, and comply with international security standards. Your data and money are protected with the same technology used by leading banks in Pakistan.' },
  { q: 'Do I need investing experience?', a: 'Not at all. FinAI Nexus is built for beginners and experts alike. Our 10-question risk assessment uses everyday scenarios — no financial jargon — to discover your ideal investment strategy.' },
  { q: 'Can I invest in both PSX and international markets?', a: 'Absolutely. FinAI Nexus supports Pakistani (PSX), international (S&P 500, global ETFs), or a diversified mix of both markets. We recommend the combined approach for optimal diversification.' },
  { q: 'What does "Simulation Mode" mean?', a: 'Simulation Mode lets you practice investing with virtual money and see how your portfolio would perform in real markets — completely risk-free. It\'s the perfect way to build confidence before investing real funds.' },
  { q: 'Are there any hidden fees?', a: 'No. FinAI Nexus operates with complete fee transparency. You always know exactly what you\'re paying, and we never charge hidden commissions, trading fees, or surprise costs.' },
];

/* ─── Product carousel data ─── */
const carouselProducts = [
  {
    tag: 'AI Portfolio',
    title: 'Invest smarter with AI-built portfolios',
    desc: 'Our AI analyzes thousands of market signals across PSX and international exchanges to build a portfolio tailored to your risk tolerance, timeline, and goals. Automatic rebalancing keeps your investments on track.',
    features: ['Personalized risk-matched portfolios', 'Auto-rebalancing when drift > 5%', 'PSX + Global ETF diversification', 'Monte Carlo forecasting'],
    color: C.greenBright,
  },
  {
    tag: 'Smart Savings',
    title: 'Your money grows while you sleep',
    desc: 'Earn high-yield returns on your savings with AI-powered allocation. Our smart splitter automatically divides your paycheck into investing, saving, and spending — making every rupee work harder.',
    features: ['High-yield savings accounts', 'AI paycheck splitter', 'Auto-save rules', 'Emergency fund protection'],
    color: C.gold,
  },
  {
    tag: 'Goal Tracker',
    title: 'Every dream deserves a plan',
    desc: 'From your dream home in Lahore to your children\'s university fees, Hajj savings to a comfortable retirement — set any goal and watch AI chart the fastest path to reaching it.',
    features: ['Unlimited financial goals', 'Success probability scores', 'Smart milestone tracking', 'Adaptive recommendations'],
    color: C.blue,
  },
];

/* ─── Product features grid ─── */
const productFeatures = [
  { icon: PieChart, title: 'AI Portfolio Management', desc: 'Expert-built, diversified portfolios designed for long-term growth. Start investing with just your spare change.', color: C.greenBright },
  { icon: Target, title: 'Goal Tracking', desc: 'Set financial goals — home, education, Hajj, retirement — and track progress with AI-powered success forecasting.', color: C.gold },
  { icon: Wallet, title: 'Smart Savings', desc: 'High-yield savings that earn more than traditional banks, with auto-save rules that build your nest egg automatically.', color: C.blue },
  { icon: Zap, title: 'Paycheck Splitter', desc: 'AI splits your salary into investing, saving, and spending — making every rupee work harder, automatically.', color: C.purple },
  { icon: BookOpen, title: 'Financial Learning', desc: 'Get smart about money with courses, articles, and tips for investors both experienced and new.', color: C.greenLight },
  { icon: Award, title: 'ESG Investing', desc: 'Invest responsibly with ESG scoring. Align your portfolio with your values while pursuing strong returns.', color: C.gold },
];

/* ─── Testimonials ─── */
const testimonials = [
  { quote: 'FinAI Nexus made investing feel approachable. The AI recommendations are spot on and I\'ve seen real growth in just months.', name: 'Ahmad K.', role: 'Software Engineer, Lahore', avatar: '👨‍💻' },
  { quote: 'The simulation mode gave me confidence before investing real money. Now my portfolio is up significantly in 8 months.', name: 'Fatima S.', role: 'Doctor, Karachi', avatar: '👩‍⚕️' },
  { quote: 'Finally a platform that understands Pakistani goals — Hajj fund, education, everything in one place.', name: 'Hassan R.', role: 'Business Owner, Islamabad', avatar: '👨‍💼' },
  { quote: 'The paycheck splitter is genius. It automatically allocates my salary across savings, investments, and goals.', name: 'Ayesha M.', role: 'Marketing Manager, Faisalabad', avatar: '👩‍💻' },
];

/* ═══════ SCROLL REVEAL HOOK ═══════ */
function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed');
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

/* ═══════ COUNTER ANIMATION HOOK ═══════ */
function useCountUp(target, duration = 2000, trigger = true) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const startTime = performance.now();
    const step = (ts) => {
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) ref.current = requestAnimationFrame(step);
    };
    ref.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(ref.current);
  }, [target, duration, trigger]);
  return value;
}

/* ═══════ RADIAL AI BRAIN SVG COMPONENT ═══════ */
function RadialAIBrain() {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const segments = [
    { label: 'Portfolio', pct: 35, color: C.gold, startAngle: 0 },
    { label: 'Savings', pct: 30, color: C.greenBright, startAngle: 126 },
    { label: 'Insights', pct: 20, color: C.blue, startAngle: 234 },
    { label: 'Analysis', pct: 15, color: C.purple, startAngle: 306 },
  ];

  const createArc = (cx, cy, r, startDeg, endDeg) => {
    const toRad = (d) => (d - 90) * (Math.PI / 180);
    const x1 = cx + r * Math.cos(toRad(startDeg));
    const y1 = cy + r * Math.sin(toRad(startDeg));
    const x2 = cx + r * Math.cos(toRad(endDeg));
    const y2 = cy + r * Math.sin(toRad(endDeg));
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
  };

  const labelPosition = (cx, cy, r, startDeg, endDeg) => {
    const midDeg = (startDeg + endDeg) / 2;
    const toRad = (d) => (d - 90) * (Math.PI / 180);
    return {
      x: cx + r * 0.65 * Math.cos(toRad(midDeg)),
      y: cy + r * 0.65 * Math.sin(toRad(midDeg)),
    };
  };

  return (
    <div ref={containerRef} className="hero-svg-container relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] mx-auto">
      {/* Floating particles */}
      {[0, 1, 2, 3, 4].map(i => (
        <div key={i} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ animation: `orbit-particle ${12 + i * 4}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`, animationDelay: `${-i * 3}s` }}>
          <div className="w-2 h-2 rounded-full" style={{ background: segments[i % 4].color, opacity: 0.6, boxShadow: `0 0 8px ${segments[i % 4].color}` }} />
        </div>
      ))}

      {/* Main SVG */}
      <svg viewBox="0 0 400 400" className="w-full h-full">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={C.greenBright} stopOpacity="0.3" />
            <stop offset="100%" stopColor={C.greenBright} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background glow */}
        <circle cx="200" cy="200" r="180" fill="url(#centerGlow)" />

        {/* Segments */}
        {segments.map((seg, i) => {
          const endAngle = seg.startAngle + (seg.pct / 100) * 360;
          const pos = labelPosition(200, 200, 130, seg.startAngle, endAngle);
          return (
            <g key={seg.label} style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'scale(1)' : 'scale(0.7)',
              transformOrigin: '200px 200px',
              transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.2}s`,
            }}>
              {/* Arc segment */}
              <path d={createArc(200, 200, 140, seg.startAngle + 2, endAngle - 2)}
                fill={seg.color} fillOpacity="0.2"
                stroke={seg.color} strokeWidth="2" strokeOpacity="0.6" />
              {/* Outer ring arc */}
              <path d={createArc(200, 200, 155, seg.startAngle + 4, endAngle - 4)}
                fill="none" stroke={seg.color} strokeWidth="3" strokeOpacity="0.4"
                strokeLinecap="round" />
              {/* Label */}
              <text x={pos.x} y={pos.y - 8} textAnchor="middle" fill={C.white} fontSize="11" fontWeight="700" fontFamily="Inter, sans-serif">
                {seg.pct}%
              </text>
              <text x={pos.x} y={pos.y + 8} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="9" fontFamily="Inter, sans-serif">
                {seg.label}
              </text>
            </g>
          );
        })}

        {/* Center brain icon area */}
        <circle cx="200" cy="200" r="55" fill={C.greenDark} stroke={C.greenBright} strokeWidth="2" strokeOpacity="0.4" filter="url(#glow)" />
        <circle cx="200" cy="200" r="45" fill="none" stroke={C.greenBright} strokeWidth="1" strokeOpacity="0.2" strokeDasharray="4 4">
          <animateTransform attributeName="transform" type="rotate" from="0 200 200" to="360 200 200" dur="30s" repeatCount="indefinite" />
        </circle>

        {/* Brain icon (simplified SVG paths) */}
        <g transform="translate(180, 178)" fill="none" stroke={C.greenBright} strokeWidth="2" strokeLinecap="round">
          <path d="M20 2C12 2 6 7 6 14C6 18 8 21 11 23L11 35" />
          <path d="M20 2C28 2 34 7 34 14C34 18 32 21 29 23L29 35" />
          <path d="M11 35L29 35" />
          <path d="M14 38L26 38" />
          <circle cx="20" cy="14" r="4" fill={C.greenBright} fillOpacity="0.3" />
          <path d="M6 14L2 14" />
          <path d="M34 14L38 14" />
          <path d="M10 6L7 3" />
          <path d="M30 6L33 3" />
        </g>
      </svg>
    </div>
  );
}

/* ═══════ NAVBAR COMPONENT ═══════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  const navLinks = [
    {
      label: 'Products',
      items: [
        { name: 'AI Portfolio', desc: 'Automated investing', icon: PieChart },
        { name: 'Smart Savings', desc: 'High-yield accounts', icon: Wallet },
        { name: 'Goal Tracker', desc: 'Track every milestone', icon: Target },
        { name: 'Paycheck Splitter', desc: 'Auto-allocate salary', icon: Zap },
      ]
    },
    {
      label: 'Learn',
      items: [
        { name: 'Getting Started', desc: 'Begin your journey', icon: BookOpen },
        { name: 'Market Insights', desc: 'PSX & global news', icon: LineChart },
      ]
    },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        boxShadow: scrolled ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
      }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: C.greenBright }}>
            <TrendingUp className="w-[18px] h-[18px]" style={{ color: C.white }} />
          </div>
          <span className="text-[19px] font-extrabold tracking-[-0.02em]"
            style={{ color: C.textDk }}>
            FinAI Nexus
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map(link => (
            <div key={link.label} className="relative nav-item">
              <button className="flex items-center gap-1 px-4 py-2 text-[14px] font-semibold rounded-lg transition-colors"
                style={{ color: C.textMd }}>
                {link.label}
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>
              {/* Dropdown */}
              <div className="nav-dropdown absolute top-full left-0 pt-2 w-[280px]">
                <div className="rounded-2xl shadow-2xl border p-2"
                  style={{ background: C.white, borderColor: 'rgba(0,0,0,0.06)' }}>
                  {link.items.map(item => (
                    <Link key={item.name} to="/register"
                      className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-gray-50">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${C.greenBright}15` }}>
                        <item.icon className="w-5 h-5" style={{ color: C.greenBright }} />
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold" style={{ color: C.textDk }}>{item.name}</p>
                        <p className="text-[12px]" style={{ color: C.textLt }}>{item.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <Link to="/" className="px-4 py-2 text-[14px] font-semibold transition-colors"
            style={{ color: C.textMd }}>
            Pricing
          </Link>
          <Link to="/" className="px-4 py-2 text-[14px] font-semibold transition-colors"
            style={{ color: C.textMd }}>
            Support
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden sm:block text-[14px] font-semibold px-4 py-2 transition-colors"
            style={{ color: C.textMd }}>
            Log in
          </Link>
          <Link to="/register"
            className="px-6 py-2.5 text-[14px] font-bold rounded-full transition-all duration-200 hover:shadow-lg hover:scale-105"
            style={{ background: C.greenBright, color: C.white }}>
            Get started
          </Link>
          {/* Mobile menu toggle */}
          <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen
              ? <X className="w-6 h-6" style={{ color: C.textDk }} />
              : <Menu className="w-6 h-6" style={{ color: C.textDk }} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden px-5 pb-6 animate-fade-in" style={{ background: C.white }}>
          {navLinks.map(link => (
            <div key={link.label} className="mb-4">
              <p className="text-[12px] font-bold uppercase tracking-widest mb-2" style={{ color: C.textLt }}>{link.label}</p>
              {link.items.map(item => (
                <Link key={item.name} to="/register"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50"
                  onClick={() => setMobileOpen(false)}>
                  <item.icon className="w-5 h-5" style={{ color: C.greenBright }} />
                  <span className="text-[14px] font-semibold" style={{ color: C.textDk }}>{item.name}</span>
                </Link>
              ))}
            </div>
          ))}
          <div className="flex gap-3 mt-4">
            <Link to="/login" className="flex-1 text-center py-3 rounded-full text-[14px] font-bold border-2"
              style={{ borderColor: C.greenBright, color: C.greenBright }}>Log in</Link>
            <Link to="/register" className="flex-1 text-center py-3 rounded-full text-[14px] font-bold"
              style={{ background: C.greenBright, color: C.white }}>Get started</Link>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ═══════ COMPOUND CALCULATOR ═══════ */
function GrowthCalculator() {
  const [initial, setInitial] = useState(50000);
  const [monthly, setMonthly] = useState(10000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);
  const containerRef = useScrollReveal();

  const calculate = useCallback(() => {
    const r = rate / 100 / 12;
    const n = years * 12;
    const fvInitial = initial * Math.pow(1 + r, n);
    const fvMonthly = monthly * ((Math.pow(1 + r, n) - 1) / r);
    return Math.round(fvInitial + fvMonthly);
  }, [initial, monthly, years, rate]);

  const result = calculate();
  const totalInvested = initial + (monthly * years * 12);
  const growth = result - totalInvested;

  const formatPKR = (v) => {
    if (v >= 10000000) return `PKR ${(v / 10000000).toFixed(1)} Cr`;
    if (v >= 100000) return `PKR ${(v / 100000).toFixed(1)} Lakh`;
    return `PKR ${v.toLocaleString()}`;
  };

  return (
    <div ref={containerRef} className="reveal-up max-w-4xl mx-auto">
      <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ background: C.white }}>
        <div className="p-8 sm:p-10">
          <h3 className="text-[22px] sm:text-[26px] font-bold mb-2" style={{ color: C.textDk, fontFamily: "'DM Serif Display', serif" }}>
            See your money grow
          </h3>
          <p className="text-[14px] mb-8" style={{ color: C.textLt }}>Adjust the values to see how compounding works</p>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {[
              { label: 'Initial Investment', value: initial, set: setInitial, min: 0, max: 1000000, step: 10000, suffix: 'PKR' },
              { label: 'Monthly Contribution', value: monthly, set: setMonthly, min: 0, max: 100000, step: 1000, suffix: 'PKR' },
              { label: 'Time Horizon', value: years, set: setYears, min: 1, max: 30, step: 1, suffix: 'years' },
              { label: 'Expected Return', value: rate, set: setRate, min: 4, max: 20, step: 1, suffix: '%' },
            ].map(({ label, value, set, min, max, step, suffix }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[13px] font-semibold" style={{ color: C.textMd }}>{label}</label>
                  <span className="text-[14px] font-bold" style={{ color: C.greenDark }}>
                    {suffix === 'PKR' ? `PKR ${value.toLocaleString()}` : `${value} ${suffix}`}
                  </span>
                </div>
                <input type="range" min={min} max={max} step={step} value={value}
                  onChange={e => set(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${C.greenBright} 0%, ${C.greenBright} ${((value - min) / (max - min)) * 100}%, #E2E8F0 ${((value - min) / (max - min)) * 100}%, #E2E8F0 100%)`,
                  }} />
              </div>
            ))}
          </div>

          {/* Result */}
          <div className="rounded-2xl p-6 text-center" style={{ background: C.greenDark }}>
            <p className="text-[12px] font-semibold uppercase tracking-widest mb-2" style={{ color: C.greenLight }}>
              Projected Value in {years} Years
            </p>
            <p className="text-[2.5rem] sm:text-[3rem] font-extrabold text-white leading-none mb-3"
              style={{ animation: 'counter-glow 3s ease-in-out infinite' }}>
              {formatPKR(result)}
            </p>
            <div className="flex items-center justify-center gap-6 text-[13px]">
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>
                Invested: <strong className="text-white">{formatPKR(totalInvested)}</strong>
              </span>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>
                Growth: <strong style={{ color: C.greenBright }}>+{formatPKR(growth)}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
      <p className="text-[11px] mt-4 text-center leading-relaxed" style={{ color: C.textLt }}>
        Illustration based on initial deposit, contribution schedule, time horizon, and rate of return specified.
        Does not include fees which would reduce returns. Results do not predict or represent the performance
        of any portfolio. Investment results will vary. No guarantee any return will be achieved.
      </p>
    </div>
  );
}


/* ═══════════════════════════════════════════
   MAIN LANDING PAGE COMPONENT
   ═══════════════════════════════════════════ */
export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [tickerVisible, setTickerVisible] = useState(false);
  const tickerRef = useRef(null);

  // Parallax Hero State
  const sceneRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!sceneRef.current) return;
        const rect = sceneRef.current.getBoundingClientRect();
        setScrollY(-rect.top);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const py = (factor) => `translate3d(0, ${scrollY * factor}px, 0)`;
  const pyx = (yFactor, xOffset = 0) =>
    `translate3d(${xOffset}px, ${scrollY * yFactor}px, 0)`;

  // Ticker visibility
  useEffect(() => {
    const el = tickerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setTickerVisible(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Scroll reveal refs
  const heroRef = useScrollReveal();
  const productsRef = useScrollReveal();
  const featuresRef = useScrollReveal();
  const testimonialsRef = useScrollReveal();
  const ctaRef = useScrollReveal();

  const stat1 = useCountUp(12800, 2000, tickerVisible);
  const stat2 = useCountUp(42, 2000, tickerVisible);
  const stat3 = useCountUp(29, 2000, tickerVisible);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      <Navbar />

      {/* ═══════ HERO SECTION ═══════ */}
      <section className="relative overflow-hidden pb-12 pt-[104px]">
        {/* Full-section sky — cityscape image as background */}
        <img
          src={heroCityscape}
          aria-hidden="true"
          alt=""
          className="pointer-events-none absolute inset-0 w-full h-full select-none object-cover object-top z-0"
        />

        {/* Headline block */}
        <div ref={heroRef} className="reveal-up relative z-20 mx-auto max-w-6xl px-6 pt-10 text-center md:pt-16">
          <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.28em]" style={{ color: '#1a3a2e' }}>
            — Own your future —
          </p>
          <h1 className="font-display text-[2.8rem] font-light leading-[0.95] sm:text-6xl md:text-7xl lg:text-[8rem]" style={{ color: '#0f1f2e' }}>
            Your <span className="italic" style={{ color: '#1a5c45' }}>Investments</span>,
            <br className="hidden sm:block" />
            <span className="relative inline-block italic" style={{ color: '#0f1f2e' }}>
              One Link Away.
              <svg
                aria-hidden="true"
                viewBox="0 0 600 24"
                className="absolute -bottom-1 sm:-bottom-3 left-0 w-full text-brand-green"
                preserveAspectRatio="none"
              >
                <path
                  d="M5 14 C 120 4, 280 22, 420 8 S 580 16, 595 12"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>
          <p className="mx-auto mt-10 max-w-md text-base" style={{ color: '#2d4a3e' }}>
            One quiet app to hold every position, every market, every move — all in a tap.
          </p>
          
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 relative z-50">
            <Link to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 text-[16px] font-bold rounded-full transition-all duration-300 hover:shadow-green-glow shadow-soft"
              style={{ background: 'var(--acorn-green-bright)', color: '#fff' }}>
              Get started — it's free
              <ArrowRight className="w-5 h-5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Scene */}
        <div
          ref={sceneRef}
          className="relative mx-auto mt-16 h-[520px] w-full sm:h-[620px] md:h-[720px] md:mt-20"
        >
          {/* Dashed center guide */}
          <div
            aria-hidden="true"
            className="dashed-guide pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 opacity-50"
          />

          {/* === PARALLAX BACKDROP === */}

          {/* Cloud layer — back, behind city */}
          <img
            src={heroClouds}
            alt=""
            aria-hidden="true"
            width={1920}
            height={1024}
            className="animate-drift-slow pointer-events-none absolute top-[2%] left-0 z-0 h-[45%] w-[200%] -translate-x-[25%] select-none object-cover object-top opacity-70 will-change-transform"
            style={{ transform: py(-0.05) }}
          />



          {/* Cloud layer — foreground, in front of city */}
          <img
            src={heroClouds}
            alt=""
            aria-hidden="true"
            width={1920}
            height={1024}
            className="animate-drift-reverse pointer-events-none absolute top-[10%] left-0 z-[2] h-[38%] w-[220%] -translate-x-[30%] select-none object-cover object-top opacity-55 will-change-transform"
            style={{ transform: pyx(-0.15) }}
          />

          {/* Tiny floating tickers — left */}
          <div className="absolute left-4 top-24 z-10 rounded-2xl border border-border/60 bg-white/80 px-4 py-3 text-xs shadow-soft backdrop-blur md:block">
            <div className="flex items-center gap-3">
              <span className="font-display text-base text-foreground">AAPL</span>
              <span className="rounded-full bg-brand-green-soft px-2 py-0.5 font-medium text-brand-green-deep">+1.82%</span>
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              Live · NASDAQ
            </div>
          </div>

          {/* Tiny floating tickers — right */}
          <div className="absolute right-4 top-40 z-10 rounded-2xl border border-border/60 bg-white/80 px-4 py-3 text-xs shadow-soft backdrop-blur md:block">
            <div className="flex items-center gap-3">
              <span className="font-display text-base text-foreground">€ EUR</span>
              <span className="font-medium text-foreground">1.0842</span>
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              FX · Spot
            </div>
          </div>

          {/* Dashboard laptop (foreground, centered) */}
          <div className="animate-float relative z-10 mx-auto flex h-full items-end justify-center pb-2">
            <img
              src={heroDashboard}
              alt="Finlink dashboard on a laptop showing portfolio balance, performance chart, stat cards and a watchlist"
              width={1600}
              height={1216}
              className="h-auto w-[92%] max-w-4xl shadow-phone relative z-10 drop-shadow-[0_40px_60px_hsl(222_40%_11%/0.18)] sm:w-[88%] md:w-[82%]"
              fetchpriority="high"
            />
          </div>
        </div>

        {/* Scroll cue */}
        <div className="relative z-10 mx-auto -mt-6 flex max-w-7xl items-center justify-between px-6 pb-12 text-[11px] uppercase tracking-[0.28em] text-muted-foreground md:px-10">
          <span>est. 2026</span>
          <span className="hidden md:inline">scroll ↓</span>
          <span>iOS · Android</span>
        </div>
      </section>

      {/* ═══════ SOCIAL PROOF TICKER ═══════ */}
      <section ref={tickerRef} className="py-4 overflow-hidden" style={{ background: C.greenBright }}>
        <div className="marquee-track">
          {[0, 1].map(dup => (
            <div key={dup} className="flex items-center gap-12 px-6 whitespace-nowrap">
              {[
                { val: `${stat1.toLocaleString()}+`, label: 'Active Users' },
                { sep: true },
                { val: `PKR ${stat2}B+`, label: 'Assets Managed' },
                { sep: true },
                { val: '4.9 ★', label: 'User Rating' },
                { sep: true },
                { val: `${stat3}.4%`, label: 'Avg. Returns' },
                { sep: true },
                { val: 'Forbes', label: 'Top FinTech 2025' },
                { sep: true },
                { val: 'CNBC', label: 'Best AI Finance App' },
                { sep: true },
              ].map((item, i) => (
                item.sep
                  ? <span key={`sep-${dup}-${i}`} className="text-white/40 text-[20px]">·</span>
                  : <div key={`item-${dup}-${i}`} className="flex items-center gap-2">
                    <span className="text-[15px] sm:text-[16px] font-extrabold text-white">{item.val}</span>
                    <span className="text-[12px] font-medium text-white/70">{item.label}</span>
                  </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ VIDEO SECTION ═══════ */}
      <section className="py-20 sm:py-28 px-5 sm:px-8" style={{ background: C.greenDarkest }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-[2rem] sm:text-[2.6rem] font-bold text-white leading-tight tracking-[-0.01em]"
              style={{ fontFamily: "'DM Serif Display', serif" }}>
              See how it works
            </h2>
          </div>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video group cursor-pointer"
            style={{ background: `linear-gradient(135deg, ${C.greenDark}, ${C.greenMid})` }}
            onClick={(e) => {
              const video = e.currentTarget.querySelector('video');
              const overlay = e.currentTarget.querySelector('.video-overlay');
              if (video.paused) {
                video.play();
                overlay.style.opacity = '0';
              } else {
                video.pause();
                overlay.style.opacity = '1';
              }
            }}>
            <video
              className="w-full h-full object-cover"
              src="/videos/brand-video.mp4"
              preload="metadata"
              playsInline
              controls={false}
              onEnded={(e) => {
                const overlay = e.currentTarget.parentElement.querySelector('.video-overlay');
                overlay.style.opacity = '1';
              }}
            />
            {/* Play overlay */}
            <div className="video-overlay absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500"
              style={{ background: 'rgba(6,29,22,0.5)' }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '2px solid rgba(255,255,255,0.3)' }}>
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
              <p className="text-[16px] font-semibold text-white/80">Watch the video</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ PARALLAX CONSTELLATION SHOWCASE ═══════ */}
      <ParallaxShowcase />

      {/* ═══════ FEATURE DETAIL CARDS (DARK GLASS GRID) ═══════ */}
      <section className="py-24 sm:py-32 px-5 sm:px-8 relative overflow-hidden" style={{ background: C.greenDarkest }}>
        {/* Background glow effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#00C853] opacity-[0.04] blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#00C853] opacity-[0.04] blur-[100px] rounded-full pointer-events-none" />

        <div ref={featuresRef} className="reveal-up max-w-[1200px] mx-auto relative z-10">
          <div className="text-center mb-20">
            <p className="text-[12px] font-black uppercase tracking-[0.25em] mb-4 text-[#00C853]">
              Built for your goals
            </p>
            <h2 className="text-[2.5rem] sm:text-[3.5rem] font-bold leading-tight tracking-[-0.02em] text-white"
              style={{ fontFamily: "'DM Serif Display', serif" }}>
              Everything you need in one place
            </h2>
            <p className="max-w-2xl mx-auto mt-6 text-[16px] leading-relaxed text-white/50">
              Powerful, AI-driven tools engineered to automate your wealth creation and secure your financial future.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productFeatures.map(({ icon: Icon, title, desc, color }, i) => (
              <div key={title}
                className="group relative p-8 sm:p-10 rounded-[2rem] border overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] flex flex-col justify-between min-h-[320px]"
                style={{ 
                  background: 'rgba(255,255,255,0.02)',
                  borderColor: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(20px)'
                }}>
                
                {/* Hover Glow Background */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${color}15, transparent 70%)` }} />
                
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                      <Icon className="w-6 h-6 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" strokeWidth={1.5} style={{ color }} />
                    </div>
                    
                    <h3 className="text-[20px] font-bold mb-3 text-white tracking-tight">{title}</h3>
                    <p className="text-[15px] leading-[1.7] text-white/50 mb-8">{desc}</p>
                  </div>

                  <div>
                    <span className="inline-flex items-center gap-2 text-[14px] font-bold group-hover:gap-3 transition-all"
                      style={{ color }}>
                      Learn more <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="py-24 sm:py-32 px-5 sm:px-8 relative overflow-hidden" style={{ background: '#f8fafc' }}>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-24 relative">
            <p className="text-[11px] font-black uppercase tracking-[0.25em] mb-4" style={{ color: C.greenBright }}>
              GETTING STARTED
            </p>
            <h2 className="text-[2.5rem] sm:text-[3.5rem] font-bold leading-tight tracking-[-0.02em] text-[#0f172a]"
              style={{ fontFamily: "'Inter', sans-serif" }}>
              Three steps to financial <span className="italic" style={{ color: C.greenBright }}>peace of mind</span>
            </h2>
          </div>

          <div className="relative">
            {/* Horizontal connection line */}
            <div className="absolute top-[60px] left-[15%] right-[15%] h-[1px] hidden md:block -z-10" style={{ backgroundColor: '#e2e8f0' }} />

            <div className="grid md:grid-cols-3 gap-16 md:gap-8">
              {[
                { 
                  num: '01', 
                  title: 'Tell us about yourself', 
                  desc: 'Answer 10 simple, jargon-free questions using real-life scenarios. We\'ll discover your investor personality in under 5 minutes.', 
                  icon: <ClipboardList className="w-8 h-8" style={{ color: '#f59e0b' }} />,
                  color: '#f59e0b',
                  bg: '#fef3c7',
                  label: 'STEP 01'
                },
                { 
                  num: '02', 
                  title: 'Get your AI portfolio', 
                  desc: 'Our AI builds a personalized portfolio across PSX and global markets, matched precisely to your risk tolerance and timeline.', 
                  icon: <Bot className="w-8 h-8" style={{ color: '#8b5cf6' }} />,
                  color: '#8b5cf6',
                  bg: '#ede9fe',
                  label: 'STEP 02'
                },
                { 
                  num: '03', 
                  title: 'Watch your wealth grow', 
                  desc: 'Track progress, review recommendations, and let AI handle rebalancing — while you focus on living your best life.', 
                  icon: <LineChart className="w-8 h-8" style={{ color: '#3b82f6' }} />,
                  color: '#3b82f6',
                  bg: '#dbeafe',
                  label: 'STEP 03'
                },
              ].map(({ num, title, desc, icon, color, bg, label }) => (
                <div key={num} className="flex flex-col items-center text-center relative">
                  {/* Icon Box */}
                  <div className="relative w-[120px] h-[120px] flex items-center justify-center mb-8">
                    {/* Soft glowing aura */}
                    <div className="absolute inset-0 rounded-[2.5rem] opacity-50 blur-2xl" style={{ backgroundColor: bg }} />
                    {/* Main perfectly rounded squircle */}
                    <div className="relative w-full h-full bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center justify-center p-3 z-10 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgb(0,0,0,0.08)]">
                      <div className="w-full h-full rounded-[2rem] flex items-center justify-center" style={{ backgroundColor: bg }}>
                        {icon}
                      </div>
                    </div>
                    {/* Badge */}
                    <div className="absolute -top-1 right-0 w-8 h-8 bg-[#0f172a] rounded-full flex items-center justify-center text-white text-[11px] font-black shadow-lg border-2 border-white z-20">
                      {num}
                    </div>
                  </div>

                  {/* Text Content */}
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] mb-4" style={{ color: color }}>
                    {label}
                  </span>
                  <h3 className="text-[22px] font-bold mt-1 mb-4 text-[#0f172a] leading-tight tracking-tight">
                    {title}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-slate-500 max-w-[280px]">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ COMPOUND GROWTH CALCULATOR ═══════ */}
      <section className="py-20 sm:py-28 px-5 sm:px-8" style={{ background: C.creamLight }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: C.greenDark }}>
              The power of compounding
            </p>
            <h2 className="text-[2rem] sm:text-[2.6rem] font-bold leading-tight tracking-[-0.01em]"
              style={{ color: C.textDk, fontFamily: "'DM Serif Display', serif" }}>
              Watch your money multiply
            </h2>
          </div>
          <GrowthCalculator />
        </div>
      </section>

      {/* ═══════ TRUST / SECURITY ═══════ */}
      <section className="py-20 sm:py-24 px-5 sm:px-8"
        style={{ background: `linear-gradient(180deg, ${C.greenDark}, ${C.greenDarkest})` }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-[2rem] sm:text-[2.4rem] font-bold text-white leading-tight tracking-[-0.01em]"
              style={{ fontFamily: "'DM Serif Display', serif" }}>
              Your trust is our foundation
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Lock, title: 'Bank-grade security', desc: '256-bit encryption and SOC 2 compliance protect every transaction.' },
              { icon: Eye, title: 'Transparent AI', desc: 'Every recommendation comes with a plain-English explanation.' },
              { icon: DollarSign, title: 'Zero hidden fees', desc: 'Clear, upfront pricing. No surprise charges, ever.' },
              { icon: Users, title: 'Built for Pakistan', desc: 'Local goals, local markets, local understanding.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1"
                style={{ background: `${C.greenMid}60` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <Icon className="w-5 h-5" style={{ color: C.greenBright }} />
                </div>
                <h3 className="text-[15px] font-bold mb-2 text-white">{title}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section className="py-24 sm:py-32 px-5 sm:px-8 relative overflow-hidden" style={{ background: C.greenDarkest }}>
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00C853] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
        
        <div ref={testimonialsRef} className="reveal-up max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-12 items-center">
            
            {/* Left Column: Heading & Value Prop */}
            <div className="lg:col-span-5 text-center lg:text-left">
              <p className="text-[11px] font-black uppercase tracking-[0.25em] mb-4" style={{ color: C.greenBright }}>
                SOCIAL PROOF
              </p>
              <h2 className="text-[2.5rem] sm:text-[3.5rem] font-bold leading-tight tracking-[-0.02em] text-white mb-6"
                style={{ fontFamily: "'Inter', sans-serif" }}>
                Loved by <span className="italic" style={{ color: C.greenBright }}>12,800+</span><br/> Pakistani families.
              </h2>
              <p className="text-[16px] leading-relaxed mb-10 text-white/50 max-w-md mx-auto lg:mx-0">
                Don't just take our word for it. Here's how FinAI Nexus is helping people across the country secure their future and achieve financial freedom.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
                <div className="flex -space-x-4">
                  {testimonials.map((t, i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-[#061D16] flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 text-[18px] shadow-lg focus:outline-none">
                      {t.avatar}
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full border-2 border-[#061D16] flex items-center justify-center bg-white/5 backdrop-blur-md text-white text-[12px] font-bold shadow-lg">
                    +12k
                  </div>
                </div>
                <div className="flex flex-col items-center sm:items-start">
                  <div className="flex gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-[#FBBF24] drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]" />
                    ))}
                  </div>
                  <span className="text-white/80 text-[12px] font-bold tracking-wide">4.9/5 Average Rating</span>
                </div>
              </div>
            </div>

            {/* Right Column: Staggered Masonry Grid */}
            <div className="lg:col-span-7 relative">
              <div className="grid sm:grid-cols-2 gap-6 relative">
                {/* Visual connecting grid lines behind cards */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[1px] bg-white/5 hidden sm:block rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-[120%] bg-white/5 hidden sm:block rounded-full" />
                
                <div className="flex flex-col gap-6 relative z-10">
                  {testimonials.slice(0, 2).map((t, idx) => (
                    <div key={idx} className="p-8 rounded-[2rem] bg-white/5 backdrop-blur-2xl border border-white/10 hover:bg-white/10 transition-colors duration-500 group shadow-2xl">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1A5C45] to-[#0B3B2D] flex items-center justify-center text-2xl shadow-inner border border-white/5 group-hover:scale-110 transition-transform duration-500">
                          {t.avatar}
                        </div>
                        <div>
                          <p className="text-white font-bold text-[15px] tracking-tight">{t.name}</p>
                          <p className="text-white/50 text-[11px] font-medium uppercase tracking-wider">{t.role}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current text-[#FBBF24] opacity-90 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]" />
                        ))}
                      </div>
                      <p className="text-[14.5px] leading-[1.8] text-white/70 relative">
                        <span className="absolute -top-3 -left-2 text-[40px] text-white/10 font-serif leading-none">"</span>
                        <span className="relative z-10 italic">{t.quote}</span>
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col gap-6 sm:mt-16 relative z-10">
                  {testimonials.slice(2, 4).map((t, idx) => (
                    <div key={idx} className="p-8 rounded-[2rem] bg-white/5 backdrop-blur-2xl border border-white/10 hover:bg-white/10 transition-colors duration-500 group shadow-2xl">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1A5C45] to-[#0B3B2D] flex items-center justify-center text-2xl shadow-inner border border-white/5 group-hover:scale-110 transition-transform duration-500">
                          {t.avatar}
                        </div>
                        <div>
                          <p className="text-white font-bold text-[15px] tracking-tight">{t.name}</p>
                          <p className="text-white/50 text-[11px] font-medium uppercase tracking-wider">{t.role}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current text-[#FBBF24] opacity-90 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]" />
                        ))}
                      </div>
                      <p className="text-[14.5px] leading-[1.8] text-white/70 relative">
                        <span className="absolute -top-3 -left-2 text-[40px] text-white/10 font-serif leading-none">"</span>
                        <span className="relative z-10 italic">{t.quote}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* ═══════ PRICING ═══════ */}
      <section className="py-20 sm:py-28 px-5 sm:px-8" style={{ background: C.white }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: C.greenDark }}>
              Pricing
            </p>
            <h2 className="text-[2rem] sm:text-[2.6rem] font-bold leading-tight tracking-[-0.01em] mb-4"
              style={{ color: C.textDk, fontFamily: "'DM Serif Display', serif" }}>
              Simple, transparent pricing
            </h2>
            <p className="text-[16px] max-w-xl mx-auto" style={{ color: C.textMd }}>
              Start free, upgrade when you're ready. No hidden fees, no surprises — ever.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {/* FREE */}
            <div className="rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg shadow-md"
              style={{ background: C.creamLight }}>
              <div className="mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wide"
                  style={{ background: C.cream, color: C.textMd }}>Free</span>
              </div>
              <div className="mb-6">
                <span className="text-[3rem] font-extrabold leading-none" style={{ color: C.textDk }}>PKR 0</span>
                <span className="text-[14px] ml-1" style={{ color: C.textLt }}>/month</span>
              </div>
              <p className="text-[14px] leading-relaxed mb-8" style={{ color: C.textMd }}>
                Perfect for beginners exploring AI-powered investing.
              </p>
              <ul className="space-y-3 mb-8">
                {['Simulation Mode (paper trading)', 'Basic risk assessment', '1 goal tracker', 'Market news feed', 'Community access'].map(f => (
                  <li key={f} className="flex items-start gap-2.5">
                    <CheckCircle className="w-[18px] h-[18px] mt-0.5 flex-shrink-0" style={{ color: C.greenBright }} />
                    <span className="text-[14px]" style={{ color: C.textMd }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register"
                className="w-full flex items-center justify-center py-3.5 rounded-full text-[14px] font-bold border-2 transition-all hover:shadow-md"
                style={{ borderColor: C.greenBright, color: C.greenBright }}>
                Get started free
              </Link>
            </div>

            {/* PRO — Highlighted */}
            <div className="rounded-2xl p-8 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl shadow-xl"
              style={{ background: C.greenDark }}>
              <div className="absolute top-0 right-0">
                <div className="px-4 py-1.5 rounded-bl-xl text-[11px] font-bold uppercase tracking-wide"
                  style={{ background: C.greenBright, color: C.white }}>Most Popular</div>
              </div>
              <div className="mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wide"
                  style={{ background: 'rgba(255,255,255,0.1)', color: C.greenBright }}>
                  <Zap className="w-3.5 h-3.5" /> Pro
                </span>
              </div>
              <div className="mb-6">
                <span className="text-[3rem] font-extrabold text-white leading-none">PKR 1,499</span>
                <span className="text-[14px] ml-1" style={{ color: 'rgba(255,255,255,0.5)' }}>/month</span>
              </div>
              <p className="text-[14px] leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
                For serious investors who want AI-managed portfolios.
              </p>
              <ul className="space-y-3 mb-8">
                {['Everything in Free', 'Real portfolio management', 'PSX + International markets', 'Unlimited goal trackers', 'AI paycheck splitter', 'Auto-rebalancing', 'Priority support'].map(f => (
                  <li key={f} className="flex items-start gap-2.5">
                    <CheckCircle className="w-[18px] h-[18px] mt-0.5 flex-shrink-0" style={{ color: C.greenBright }} />
                    <span className="text-[14px]" style={{ color: 'rgba(255,255,255,0.75)' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-[14px] font-bold transition-all hover:brightness-110 hover:shadow-lg"
                style={{ background: C.greenBright, color: C.white }}>
                Start 14-day free trial
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* ELITE */}
            <div className="rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg shadow-md"
              style={{ background: C.creamLight }}>
              <div className="mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wide"
                  style={{ background: `${C.gold}20`, color: C.gold }}>
                  <Star className="w-3.5 h-3.5" /> Elite
                </span>
              </div>
              <div className="mb-6">
                <span className="text-[3rem] font-extrabold leading-none" style={{ color: C.textDk }}>PKR 3,999</span>
                <span className="text-[14px] ml-1" style={{ color: C.textLt }}>/month</span>
              </div>
              <p className="text-[14px] leading-relaxed mb-8" style={{ color: C.textMd }}>
                Premium wealth management with advanced analytics.
              </p>
              <ul className="space-y-3 mb-8">
                {['Everything in Pro', 'Monte Carlo forecasting', 'Advanced ESG scoring', 'Tax-loss harvesting', 'Custom asset allocation', 'Family account linking', 'Dedicated account manager'].map(f => (
                  <li key={f} className="flex items-start gap-2.5">
                    <CheckCircle className="w-[18px] h-[18px] mt-0.5 flex-shrink-0" style={{ color: C.gold }} />
                    <span className="text-[14px]" style={{ color: C.textMd }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register"
                className="w-full flex items-center justify-center py-3.5 rounded-full text-[14px] font-bold border-2 transition-all hover:shadow-md"
                style={{ borderColor: C.greenDark, color: C.greenDark }}>
                Start 14-day free trial
              </Link>
            </div>
          </div>

          <p className="text-center text-[13px] mt-8" style={{ color: C.textLt }}>
            All plans include bank-grade encryption • Cancel anytime • No credit card required for Free plan
          </p>
        </div>
      </section>

      {/* ═══════ FAQ ═══════ */}
      <section className="py-20 sm:py-28 px-5 sm:px-8"
        style={{ background: `linear-gradient(180deg, ${C.greenDark}, ${C.greenDarkest})` }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-[2rem] sm:text-[2.4rem] font-bold text-white text-center leading-tight tracking-[-0.01em] mb-12"
            style={{ fontFamily: "'DM Serif Display', serif" }}>
            Common questions
          </h2>

          <div className="space-y-0">
            {faqItems.map(({ q, a }, i) => (
              <div key={i} className="border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left group"
                >
                  <span className="text-[16px] font-semibold text-white pr-8">{q}</span>
                  <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{ background: openFaq === i ? C.greenBright : 'rgba(255,255,255,0.08)' }}>
                    {openFaq === i
                      ? <Minus className="w-4 h-4 text-white" />
                      : <Plus className="w-4 h-4 text-white" />}
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40 pb-5' : 'max-h-0'}`}>
                  <p className="text-[14px] leading-relaxed pr-12" style={{ color: 'rgba(255,255,255,0.6)' }}>{a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FINAL CTA ═══════ */}
      <section ref={ctaRef} className="reveal-up py-24 sm:py-32 px-5 sm:px-8 relative overflow-hidden"
        style={{ background: C.greenBright }}>
        {/* Decorative circle */}
        <div className="absolute -right-20 sm:right-[10%] top-1/2 -translate-y-1/2 w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] rounded-full opacity-20"
          style={{ background: C.white }} />

        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-[2.2rem] sm:text-[3rem] lg:text-[3.5rem] font-bold text-white leading-[1.1] tracking-[-0.02em] mb-6"
            style={{ fontFamily: "'DM Serif Display', serif" }}>
            Start growing your{' '}
            <br className="hidden sm:block" />
            future today
          </h2>
          <p className="text-[17px] leading-relaxed mb-10 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Join 12,800+ Pakistani families already building generational wealth
            with intelligent, transparent, and affordable financial planning.
          </p>
          <Link to="/register"
            className="inline-flex items-center gap-2 px-10 py-4 text-[16px] font-bold rounded-full transition-all duration-200 hover:shadow-xl hover:scale-105 group"
            style={{ background: C.white, color: C.greenDark }}>
            Get started — it's free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <p className="text-[13px] mt-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
            No credit card required • Free simulation mode • Cancel anytime
          </p>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="px-5 sm:px-8 pt-16 pb-10" style={{ background: C.greenDarkest }}>
        <div className="max-w-6xl mx-auto">
          {/* Footer links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-14">
            {[
              { title: 'Invest', links: ['AI Portfolios', 'PSX Investing', 'International ETFs', 'ESG Investing', 'Risk Assessment'] },
              { title: 'Plan', links: ['Paycheck Splitter', 'Goal Tracking', 'Compound Calculator', 'Monte Carlo Forecast', 'Market Insights'] },
              { title: 'Resources', links: ['Help Center', 'Blog', 'Financial Guides', 'Market Updates', 'API Docs'] },
              { title: 'Company', links: ['About Us', 'Careers', 'Press', 'Contact', 'Legal'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="text-[13px] font-bold text-white mb-4">{title}</h4>
                <ul className="space-y-2.5">
                  {links.map(l => (
                    <li key={l}>
                      <span className="text-[13px] cursor-pointer transition-colors hover:text-white/80"
                        style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {l}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: C.greenBright }}>
                  <TrendingUp className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-[15px] font-bold text-white">FinAI Nexus</span>
              </div>
              <div className="flex gap-5 text-[12px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <span className="cursor-pointer hover:text-white/70 transition-colors">Privacy Policy</span>
                <span className="cursor-pointer hover:text-white/70 transition-colors">Terms of Service</span>
                <span className="cursor-pointer hover:text-white/70 transition-colors">Risk Disclosure</span>
              </div>
            </div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.3)' }}>
              FinAI Nexus is a financial planning and simulation tool. It does not provide direct investment services, brokerage,
              or custody of assets. Past performance and simulated results do not guarantee future returns. All investing involves risk, including
              the possible loss of principal. The information provided is for educational purposes only and should not be considered
              personalized financial advice. Users should consult a qualified financial advisor registered with SECP before making
              any investment decisions. © 2026 FinAI Nexus. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}