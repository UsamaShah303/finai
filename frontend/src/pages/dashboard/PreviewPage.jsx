import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import {
  ArrowRight, RotateCcw, TrendingUp, Leaf, Zap,
  Globe, Building2, Info, Sparkles, Lock, CheckCircle,
} from 'lucide-react';

// ─── Mock optimization data per risk profile ───────────────────────────────
const OPTIMIZATION_DATA = {
  Conservative: {
    color: '#3b82f6', emoji: '🛡️', tagline: 'Capital-protected, income-focused',
    returnMin: 5, returnMax: 7,
    esgScore: 74,
    etfs: [
      { ticker: 'BND',  name: 'Vanguard Total Bond Market ETF',  pct: 38, color: '#3b82f6', esg: 78 },
      { ticker: 'VGIT', name: 'Vanguard Intermediate-Term Treasury', pct: 24, color: '#06b6d4', esg: 82 },
      { ticker: 'VYM',  name: 'Vanguard High Dividend Yield ETF',    pct: 20, color: '#22c55e', esg: 71 },
      { ticker: 'GLD',  name: 'SPDR Gold Shares',                    pct: 12, color: '#f59e0b', esg: 65 },
      { ticker: 'CASH', name: 'Cash Reserve',                        pct:  6, color: '#64748b', esg: 100 },
    ],
    psx: [
      { ticker: 'HBL',  name: 'Habib Bank Limited',     pct: 50, color: '#3b82f6', esg: 70 },
      { ticker: 'OGDC', name: 'Oil & Gas Dev. Company', pct: 30, color: '#06b6d4', esg: 58 },
      { ticker: 'LUCK', name: 'Lucky Cement',           pct: 20, color: '#22c55e', esg: 62 },
    ],
    etfWeight: 80, psxWeight: 20,
  },
  'Moderately Conservative': {
    color: '#22c55e', emoji: '🌿', tagline: 'Steady growth with a safety net',
    returnMin: 6, returnMax: 9,
    esgScore: 71,
    etfs: [
      { ticker: 'BND',  name: 'Vanguard Total Bond Market ETF',   pct: 32, color: '#22c55e', esg: 78 },
      { ticker: 'VYM',  name: 'Vanguard High Dividend Yield ETF', pct: 28, color: '#3b82f6', esg: 71 },
      { ticker: 'VTI',  name: 'Vanguard Total Stock Market ETF',  pct: 22, color: '#06b6d4', esg: 69 },
      { ticker: 'GLD',  name: 'SPDR Gold Shares',                 pct: 12, color: '#f59e0b', esg: 65 },
      { ticker: 'VGIT', name: 'Vanguard Intermediate Treasury',   pct:  6, color: '#64748b', esg: 82 },
    ],
    psx: [
      { ticker: 'HBL',   name: 'Habib Bank Limited', pct: 40, color: '#22c55e', esg: 70 },
      { ticker: 'ENGRO', name: 'Engro Corporation',  pct: 35, color: '#3b82f6', esg: 68 },
      { ticker: 'MCB',   name: 'MCB Bank',           pct: 25, color: '#06b6d4', esg: 66 },
    ],
    etfWeight: 75, psxWeight: 25,
  },
  Moderate: {
    color: '#eab308', emoji: '⚖️', tagline: 'Balanced growth across markets',
    returnMin: 8, returnMax: 11,
    esgScore: 68,
    etfs: [
      { ticker: 'VTI',  name: 'Vanguard Total Stock Market ETF',  pct: 30, color: '#3b82f6', esg: 69 },
      { ticker: 'BND',  name: 'Vanguard Total Bond Market ETF',   pct: 25, color: '#22c55e', esg: 78 },
      { ticker: 'VXUS', name: 'Vanguard Total Intl Stock ETF',    pct: 20, color: '#06b6d4', esg: 67 },
      { ticker: 'VNQ',  name: 'Vanguard Real Estate ETF',         pct: 15, color: '#8b5cf6', esg: 61 },
      { ticker: 'GLD',  name: 'SPDR Gold Shares',                 pct: 10, color: '#f59e0b', esg: 65 },
    ],
    psx: [
      { ticker: 'ENGRO', name: 'Engro Corporation', pct: 35, color: '#eab308', esg: 68 },
      { ticker: 'OGDC',  name: 'Oil & Gas Dev.',    pct: 25, color: '#3b82f6', esg: 58 },
      { ticker: 'PSO',   name: 'Pakistan State Oil', pct: 20, color: '#06b6d4', esg: 55 },
      { ticker: 'MCB',   name: 'MCB Bank',           pct: 20, color: '#22c55e', esg: 66 },
    ],
    etfWeight: 70, psxWeight: 30,
  },
  'Moderately Aggressive': {
    color: '#f59e0b', emoji: '📈', tagline: 'Growth-tilted, globally diversified',
    returnMin: 10, returnMax: 14,
    esgScore: 63,
    etfs: [
      { ticker: 'VTI',  name: 'Vanguard Total Stock Market ETF', pct: 40, color: '#3b82f6', esg: 69 },
      { ticker: 'VXUS', name: 'Vanguard Total Intl Stock ETF',   pct: 25, color: '#06b6d4', esg: 67 },
      { ticker: 'BND',  name: 'Vanguard Total Bond Market ETF',  pct: 15, color: '#22c55e', esg: 78 },
      { ticker: 'VNQ',  name: 'Vanguard Real Estate ETF',        pct: 10, color: '#8b5cf6', esg: 61 },
      { ticker: 'VWO',  name: 'Vanguard Emerging Markets ETF',   pct: 10, color: '#f59e0b', esg: 58 },
    ],
    psx: [
      { ticker: 'ENGRO',  name: 'Engro Corporation', pct: 30, color: '#f59e0b', esg: 68 },
      { ticker: 'LUCK',   name: 'Lucky Cement',      pct: 25, color: '#3b82f6', esg: 62 },
      { ticker: 'NESTLE', name: 'Nestlé Pakistan',   pct: 25, color: '#22c55e', esg: 75 },
      { ticker: 'TRG',    name: 'TRG Pakistan',      pct: 20, color: '#06b6d4', esg: 66 },
    ],
    etfWeight: 65, psxWeight: 35,
  },
  Aggressive: {
    color: '#ef4444', emoji: '🚀', tagline: 'Maximum growth, high conviction',
    returnMin: 12, returnMax: 18,
    esgScore: 57,
    etfs: [
      { ticker: 'VTI',  name: 'Vanguard Total Stock Market ETF', pct: 42, color: '#3b82f6', esg: 69 },
      { ticker: 'VXUS', name: 'Vanguard Total Intl Stock ETF',   pct: 22, color: '#06b6d4', esg: 67 },
      { ticker: 'VWO',  name: 'Vanguard Emerging Markets ETF',   pct: 20, color: '#ef4444', esg: 58 },
      { ticker: 'ARKK', name: 'ARK Innovation ETF',              pct: 10, color: '#8b5cf6', esg: 52 },
      { ticker: 'SCHG', name: 'Schwab US Large-Cap Growth ETF',  pct:  6, color: '#f59e0b', esg: 64 },
    ],
    psx: [
      { ticker: 'TRG',   name: 'TRG Pakistan', pct: 35, color: '#ef4444', esg: 66 },
      { ticker: 'SYS',   name: 'Systems Ltd',  pct: 30, color: '#3b82f6', esg: 70 },
      { ticker: 'UNITY', name: 'Unity Foods',  pct: 20, color: '#f59e0b', esg: 55 },
      { ticker: 'MLCF', name: 'Maple Leaf Cement', pct: 15, color: '#06b6d4', esg: 50 },
    ],
    etfWeight: 60, psxWeight: 40,
  },
};

const MOCK_AMOUNT = 1000;

// Simulate a portfolio optimization API call
function fetchOptimization(riskProfile) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(OPTIMIZATION_DATA[riskProfile] || OPTIMIZATION_DATA['Moderate']);
    }, 1800);
  });
}

// ─── Sub-components ────────────────────────────────────────────────────────

function EsgBar({ score }) {
  const color = score >= 70 ? '#22c55e' : score >= 55 ? '#eab308' : '#ef4444';
  const label = score >= 70 ? 'Strong' : score >= 55 ? 'Moderate' : 'Developing';
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-surface-500">ESG Score</span>
        <span className="text-xs font-bold" style={{ color }}>{score}/100 · {label}</span>
      </div>
      <div className="h-2 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      <p className="text-xs text-surface-400 mt-1">Environmental, Social & Governance rating of your portfolio</p>
    </div>
  );
}

function AllocationRow({ item, totalAmount, weight }) {
  const dollars = ((item.pct / 100) * totalAmount * (weight / 100)).toFixed(2);
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-surface-100 dark:border-surface-800 last:border-0">
      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-surface-900 dark:text-white">{item.ticker}</span>
          <span className="text-xs text-surface-400 truncate hidden sm:block">{item.name}</span>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-xs font-bold text-surface-900 dark:text-white">{item.pct}%</div>
        <div className="text-xs text-surface-400">${dollars}</div>
      </div>
    </div>
  );
}

function PieTooltip({ active, payload }) {
  if (active && payload?.length) {
    return (
      <div className="px-3 py-2 rounded-lg bg-surface-900 text-white text-xs shadow-xl">
        <span className="font-bold">{payload[0].payload.ticker}</span>
        <span className="ml-2 text-surface-300">{payload[0].value}%</span>
      </div>
    );
  }
  return null;
}

function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-xl bg-surface-200 dark:bg-surface-700 ${className}`} />;
}

// ─── Main page ─────────────────────────────────────────────────────────────

export default function PreviewPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('etf');
  const [returnBarWidth, setReturnBarWidth] = useState(0);
  const [esgBarWidth, setEsgBarWidth] = useState(0);

  const riskProfile = user?.riskProfile || 'Moderate';

  useEffect(() => {
    setLoading(true);
    fetchOptimization(riskProfile).then((result) => {
      setData(result);
      setLoading(false);
      setTimeout(() => {
        setReturnBarWidth(((result.returnMax - 4) / 20) * 100);
        setEsgBarWidth(result.esgScore);
      }, 300);
    });
  }, [riskProfile]);

  // Pie chart data merges ETFs and PSX weighted
  const pieData = data
    ? [
        ...data.etfs.map((e) => ({ ...e, value: Math.round(e.pct * data.etfWeight / 100) })),
        ...data.psx.map((p) => ({ ...p, value: Math.round(p.pct * data.psxWeight / 100) })),
      ]
    : [];

  const etfDollars = data ? (MOCK_AMOUNT * data.etfWeight / 100).toFixed(0) : 0;
  const psxDollars = data ? (MOCK_AMOUNT * data.psxWeight / 100).toFixed(0) : 0;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">

      {/* ── Preview banner ── */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20 mb-6">
        <Sparkles className="w-4 h-4 text-primary-500 flex-shrink-0" />
        <p className="text-xs text-primary-700 dark:text-primary-300 font-medium leading-relaxed">
          <strong>Demo preview</strong> — this shows what your portfolio <em>would</em> look like with $1,000.
          No real money involved. Add funds to activate it.
        </p>
      </div>

      {/* ── Hero ── */}
      <div className="neo-card p-6 mb-6 relative overflow-hidden" style={{ borderColor: data ? `${data.color}30` : undefined }}>
        {data && (
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ background: `radial-gradient(circle at 60% 0%, ${data.color}, transparent 70%)` }}
          />
        )}
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-4 flex-1">
            {loading ? (
              <Skeleton className="w-14 h-14 flex-shrink-0" />
            ) : (
              <div
                className="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl animate-float"
                style={{ backgroundColor: `${data.color}18` }}
              >
                {data.emoji}
              </div>
            )}
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary-500">Your Portfolio Preview</span>
              {loading ? (
                <>
                  <Skeleton className="h-6 w-48 mt-1 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </>
              ) : (
                <>
                  <h1 className="text-xl font-black text-surface-900 dark:text-white">{riskProfile} Profile</h1>
                  <p className="text-xs text-surface-500">{data.tagline}</p>
                </>
              )}
            </div>
          </div>

          {/* Mock amount badge */}
          <div className="flex-shrink-0 text-center px-4 py-2 rounded-xl bg-surface-100 dark:bg-surface-800">
            <p className="text-xs text-surface-500 mb-0.5">Demo amount</p>
            <p className="text-2xl font-black text-surface-900 dark:text-white">$1,000</p>
          </div>
        </div>
      </div>

      {/* ── Return range + ESG ── */}
      {loading ? (
        <div className="neo-card p-5 mb-6 grid sm:grid-cols-2 gap-5">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : (
        <div className="neo-card p-5 mb-6 grid sm:grid-cols-2 gap-6">
          {/* Return range */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4" style={{ color: data.color }} />
              <span className="text-xs font-bold text-surface-700 dark:text-surface-300">Expected Annual Return</span>
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-3xl font-black" style={{ color: data.color }}>{data.returnMin}–{data.returnMax}%</span>
              <span className="text-xs text-surface-400">per year</span>
            </div>
            <div className="h-2 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${returnBarWidth}%`, backgroundColor: data.color }}
              />
            </div>
            <p className="text-xs text-surface-400 mt-1">Historical average, not guaranteed</p>
          </div>

          {/* ESG */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="w-4 h-4 text-accent-500" />
              <span className="text-xs font-bold text-surface-700 dark:text-surface-300">Portfolio ESG Score</span>
              <span className="relative group ml-auto">
                <Info className="w-3.5 h-3.5 text-surface-400 cursor-help" />
                <div className="absolute z-10 right-0 bottom-full mb-2 w-56 p-3 rounded-xl bg-surface-900 text-white text-xs leading-relaxed shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  ESG = Environmental, Social & Governance. Measures how responsibly your investments behave. Higher is better.
                </div>
              </span>
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-3xl font-black text-surface-900 dark:text-white">{data.esgScore}</span>
              <span className="text-xs text-surface-400">/ 100</span>
            </div>
            <EsgBar score={data.esgScore} />
          </div>
        </div>
      )}

      {/* ── Holdings tabs ── */}
      <div className="neo-card mb-6 overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-surface-100 dark:border-surface-800">
          <button
            onClick={() => setActiveTab('etf')}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-colors ${
              activeTab === 'etf'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500 bg-primary-50/50 dark:bg-primary-500/5'
                : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
            }`}
          >
            <Globe className="w-4 h-4" />
            Global ETFs
            {data && <span className="text-xs font-normal text-surface-400">({data.etfWeight}% · ${etfDollars})</span>}
          </button>
          <button
            onClick={() => setActiveTab('psx')}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-colors ${
              activeTab === 'psx'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500 bg-primary-50/50 dark:bg-primary-500/5'
                : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
            }`}
          >
            <Building2 className="w-4 h-4" />
            PSX Stocks
            {data && <span className="text-xs font-normal text-surface-400">({data.psxWeight}% · ${psxDollars})</span>}
          </button>
          <button
            onClick={() => setActiveTab('chart')}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-colors ${
              activeTab === 'chart'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500 bg-primary-50/50 dark:bg-primary-500/5'
                : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Overview
          </button>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-10" />
              ))}
            </div>
          ) : activeTab === 'etf' ? (
            <div>
              <p className="text-xs text-surface-500 mb-3 leading-relaxed">
                These globally-diversified ETFs form the international core of your portfolio.
                Each tracks hundreds of companies, giving you instant diversification.
              </p>
              {data.etfs.map((e) => (
                <AllocationRow key={e.ticker} item={e} totalAmount={MOCK_AMOUNT} weight={data.etfWeight} />
              ))}
              <div className="mt-3 px-3 py-2 rounded-lg bg-surface-50 dark:bg-surface-800/50 flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-accent-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-surface-500">ETFs are bought on US exchanges. FX conversion is automatic.</p>
              </div>
            </div>
          ) : activeTab === 'psx' ? (
            <div>
              <p className="text-xs text-surface-500 mb-3 leading-relaxed">
                These Pakistan Stock Exchange (PSX) picks give you local market exposure,
                adding a growth kicker and PKR diversification to your portfolio.
              </p>
              {data.psx.map((p) => (
                <AllocationRow key={p.ticker} item={p} totalAmount={MOCK_AMOUNT} weight={data.psxWeight} />
              ))}
              <div className="mt-3 px-3 py-2 rounded-lg bg-surface-50 dark:bg-surface-800/50 flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-accent-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-surface-500">PSX stocks are held in a NCCPL-registered account on your behalf.</p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs text-surface-500 mb-4">Full breakdown of your $1,000 across all holdings.</p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={1.5}
                    dataKey="value"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 mt-3">
                {pieData.map((item) => (
                  <div key={item.ticker} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-surface-500 truncate">{item.ticker}</span>
                    <span className="text-xs font-bold text-surface-900 dark:text-white ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Primary CTA ── */}
      <div className="neo-card p-6 mb-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none gradient-primary" />
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl gradient-primary mx-auto mb-3 flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-lg font-black text-surface-900 dark:text-white mb-1">Ready to make it real?</h2>
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-5 max-w-sm mx-auto">
            Add funds to activate this portfolio. Start with as little as $10.
            Your money gets invested automatically the moment it arrives.
          </p>

          {/* Lock badge */}
          <div className="flex items-center justify-center gap-2 mb-5">
            {['Bank-grade security', 'SECP regulated', 'Withdraw anytime'].map((t) => (
              <span key={t} className="flex items-center gap-1 text-xs text-surface-500">
                <Lock className="w-3 h-3" />
                {t}
              </span>
            ))}
          </div>

          <button
            onClick={() => navigate('/deposit')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl gradient-primary text-white font-bold text-base hover:shadow-xl hover:shadow-primary-500/30 transition-all group"
          >
            <Zap className="w-5 h-5" />
            Add Funds to Activate
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* ── Retake quiz ── */}
      <div className="text-center">
        <button
          onClick={() => navigate('/risk-quiz')}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Retake quiz to change my profile
        </button>
      </div>
    </div>
  );
}
