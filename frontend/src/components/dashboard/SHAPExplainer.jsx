import { useState, useCallback } from 'react';
import { ChevronDown, ChevronUp, Languages, Brain, ShieldAlert, RefreshCw, Clock } from 'lucide-react';

// ---------------------------------------------------------------------------
// Time-ago helper
// ---------------------------------------------------------------------------
function timeAgo(isoString) {
  if (!isoString) return '';
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ---------------------------------------------------------------------------
// Factor map — icons + positive/negative/concern explanations
// ---------------------------------------------------------------------------
const FACTOR_MAP = {
  investment_horizon: {
    icon: '📅',
    positive: {
      title: 'You plan to invest for a long time',
      desc: 'Long term investing gives your money time to grow through market ups and downs. This strongly suits growth investments.',
      ur: 'آپ طویل مدت کے لیے سرمایہ کاری کرنا چاہتے ہیں — یہ ترقی کی سرمایہ کاری کے لیے بہت موزوں ہے',
    },
    negative: {
      title: 'You need this money soon',
      desc: 'Short time horizons mean less time to recover from market drops. Growth assets carry more risk for you.',
      ur: 'آپ کو جلد پیسے چاہییں — مارکیٹ گرنے سے سنبھلنے کا وقت کم ہے',
    },
  },
  loss_reaction: {
    icon: '💪',
    positive: {
      title: 'You stay calm when markets drop',
      desc: 'You said you would hold or buy more during a drop. This patience is exactly what growth investing requires.',
      ur: 'آپ مارکیٹ گرنے پر صبر کرتے ہیں — یہ ترقی کی سرمایہ کاری کے لیے ضروری ہے',
    },
    negative: {
      title: 'Market drops make you nervous',
      desc: 'You prefer to sell when markets fall. High volatility assets may cause stress for you.',
      ur: 'مارکیٹ گرنے پر آپ فروخت کرنا چاہتے ہیں — زیادہ اتار چڑھاؤ آپ کو پریشان کر سکتا ہے',
    },
  },
  emergency_fund: {
    icon: '🛡️',
    positive: {
      title: 'You have emergency savings',
      desc: 'Having 3-6 months expenses saved means you will not need to sell investments in an emergency. This protects your portfolio.',
      ur: 'آپ کے پاس ایمرجنسی فنڈ ہے — یعنی مشکل وقت میں سرمایہ کاری بیچنی نہیں پڑے گی',
    },
    negative: {
      title: 'You do not have emergency savings yet',
      desc: 'Without an emergency fund you may need to sell investments at a bad time. We recommend building this first.',
      ur: 'ابھی ایمرجنسی فنڈ نہیں ہے — پہلے یہ بنانا بہتر ہے',
    },
  },
  income: {
    icon: '💰',
    positive: {
      title: 'Your income supports regular investing',
      desc: 'Your monthly income allows consistent investment which builds wealth steadily over time.',
      ur: 'آپ کی آمدن باقاعدہ سرمایہ کاری کی اجازت دیتی ہے',
    },
    negative: {
      title: 'Limited monthly investment capacity',
      desc: 'Lower monthly investment means slower portfolio growth. Consider increasing gradually as income grows.',
      ur: 'ماہانہ سرمایہ کاری محدود ہے — آمدن بڑھنے کے ساتھ بڑھائیں',
    },
  },
  esg: {
    icon: '🌱',
    positive: {
      title: 'This asset scores well on ethical investing',
      desc: 'High ESG score means the company treats employees well, protects the environment and is managed honestly.',
      ur: 'یہ کمپنی ملازمین، ماحول اور ایمانداری میں اچھی ہے',
    },
    negative: {
      title: 'This asset has a lower ethical score',
      desc: 'Lower ESG means the company may have environmental or governance concerns. Still included for performance.',
      ur: 'اس کمپنی کا اخلاقی اسکور کم ہے لیکن کارکردگی کے لیے شامل ہے',
    },
  },
  currency: {
    icon: '💱',
    concern: {
      title: 'This investment is priced in US Dollars',
      desc: 'When PKR weakens against USD your returns in rupees improve. When PKR strengthens your returns may be lower.',
      ur: 'یہ سرمایہ کاری ڈالر میں ہے — روپیہ کمزور ہو تو منافع بڑھے، مضبوط ہو تو کم ہو',
    },
  },
  volatility: {
    icon: '📊',
    concern: {
      title: 'This investment goes up and down more than bonds',
      desc: 'Stocks can drop 20-30% in bad years before recovering. This is normal and expected. Long term investors benefit.',
      ur: 'یہ بانڈز سے زیادہ اوپر نیچے جاتا ہے — مختصر مدت میں نقصان ممکن ہے لیکن طویل مدت میں فائدہ ہوتا ہے',
    },
  },
};

// ---------------------------------------------------------------------------
// Mock SHAP data per asset — in production this comes from the backend
// ---------------------------------------------------------------------------
const SHAP_DATA = {
  SPY: {
    symbol: 'SPY',
    name: 'US Stocks (S&P 500)',
    allocation: '22%',
    confidence: 87,
    summary: "SPY was recommended because you plan to invest long term and stay calm during market drops. Your emergency savings protect you from needing to sell early. We've balanced it with bonds to manage the ups and downs.",
    summaryUr: 'SPY اس لیے تجویز کیا گیا کیونکہ آپ طویل مدت کے لیے سرمایہ کاری کرنا چاہتے ہیں اور مارکیٹ گرنے پر صبر کرتے ہیں۔ آپ کا ایمرجنسی فنڈ آپ کو جلد بیچنے سے بچاتا ہے۔',
    factors: [
      { key: 'investment_horizon', direction: 'positive', value: 0.48 },
      { key: 'loss_reaction', direction: 'positive', value: 0.42 },
      { key: 'esg', direction: 'positive', value: 0.25 },
      { key: 'currency', direction: 'concern', value: 0.18 },
      { key: 'volatility', direction: 'concern', value: 0.15 },
    ],
    whatIf: [
      { scenario: 'What if you needed the money in 1-2 years?', impact: 'We would reduce SPY and shift more into bonds and cash for safety.' },
      { scenario: 'What if you were uncomfortable with market drops?', impact: 'We would lower SPY allocation and add more stable fixed-income assets.' },
    ],
  },
  'PSX-100': {
    symbol: 'PSX-100',
    name: 'Pakistan Stocks (PSX)',
    allocation: '18%',
    confidence: 82,
    summary: "PSX-100 gives you exposure to Pakistan's growing economy in your home currency. Your long investment horizon and calm approach to market drops make this a good fit.",
    summaryUr: 'PSX-100 آپ کو پاکستان کی بڑھتی ہوئی معیشت میں حصہ دیتا ہے۔ آپ کا طویل سرمایہ کاری کا منصوبہ اور مارکیٹ گرنے پر صبر اسے موزوں بناتا ہے۔',
    factors: [
      { key: 'investment_horizon', direction: 'positive', value: 0.40 },
      { key: 'income', direction: 'positive', value: 0.35 },
      { key: 'loss_reaction', direction: 'positive', value: 0.30 },
      { key: 'volatility', direction: 'concern', value: 0.22 },
    ],
    whatIf: [
      { scenario: 'What if you invested 30%+ of your income?', impact: 'Higher contributions would accelerate your wealth growth in PKR assets significantly.' },
    ],
  },
  'BND/PIB': {
    symbol: 'BND/PIB',
    name: 'Bonds (Mixed)',
    allocation: '18%',
    confidence: 91,
    summary: "Bonds add stability to your portfolio. They cushion against stock market drops and provide steady income. Your preference for balanced growth makes this a strong match.",
    summaryUr: 'بانڈز آپ کے پورٹ فولیو کو مستحکم رکھتے ہیں۔ یہ اسٹاک مارکیٹ گرنے کے اثر کو کم کرتے ہیں اور مستقل آمدنی دیتے ہیں۔',
    factors: [
      { key: 'loss_reaction', direction: 'positive', value: 0.45 },
      { key: 'emergency_fund', direction: 'positive', value: 0.38 },
      { key: 'income', direction: 'positive', value: 0.28 },
    ],
    whatIf: [
      { scenario: 'What if you were comfortable with bigger swings?', impact: 'We would reduce bonds and add more growth stocks for potentially higher returns.' },
    ],
  },
  GLD: {
    symbol: 'GLD',
    name: 'Gold',
    allocation: '12%',
    confidence: 79,
    summary: "Gold protects your portfolio during uncertain times. It tends to hold value when stocks fall. For Pakistani investors, gold also hedges against PKR depreciation.",
    summaryUr: 'سونا غیر یقینی وقت میں آپ کے پورٹ فولیو کی حفاظت کرتا ہے۔ جب اسٹاک گرتے ہیں تو سونا اپنی قیمت برقرار رکھتا ہے۔',
    factors: [
      { key: 'emergency_fund', direction: 'positive', value: 0.35 },
      { key: 'esg', direction: 'negative', value: 0.15 },
      { key: 'currency', direction: 'concern', value: 0.20 },
    ],
    whatIf: [
      { scenario: 'What if PKR was very stable?', impact: 'Gold would be less important as a currency hedge, but still valuable for portfolio diversification.' },
    ],
  },
};

const ASSET_LIST = Object.keys(SHAP_DATA);

// ---------------------------------------------------------------------------
// FactorCard sub-component
// ---------------------------------------------------------------------------
function FactorCard({ factor, showUrdu }) {
  const map = FACTOR_MAP[factor.key];
  if (!map) return null;

  const data = map[factor.direction] || map.concern || map.positive;
  if (!data) return null;

  const isPositive = factor.direction === 'positive';
  const isConcern = factor.direction === 'concern';

  const barPct = Math.min(Math.round(Math.abs(factor.value) * 200), 100);
  const strengthLabel = barPct > 66 ? 'Very strong' : barPct > 40 ? 'Strong' : 'Moderate';
  const strengthLabelUr = barPct > 66 ? 'بہت مضبوط' : barPct > 40 ? 'مضبوط' : 'معتدل';

  const statusIcon = isPositive ? '✅' : isConcern ? '⚠️' : '❌';

  // Colors
  const cardBg = isPositive
    ? 'bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/20'
    : isConcern
    ? 'bg-amber-50 dark:bg-amber-500/5 border-amber-200 dark:border-amber-500/20'
    : 'bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/20';

  const iconBg = isPositive
    ? 'bg-emerald-100 dark:bg-emerald-500/15'
    : isConcern
    ? 'bg-amber-100 dark:bg-amber-500/15'
    : 'bg-red-100 dark:bg-red-500/15';

  const barColor = isPositive
    ? 'bg-emerald-500'
    : isConcern
    ? 'bg-amber-500'
    : 'bg-red-500';

  const badgeClasses = isPositive
    ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
    : isConcern
    ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'
    : 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400';

  return (
    <div className={`border rounded-xl p-4 mb-3 transition-all hover:shadow-sm ${cardBg}`}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-base ${iconBg}`}>
          {map.icon}
        </div>

        <div className="flex-1 min-w-0">
          {/* Status + Title */}
          <div className="flex items-start sm:items-center gap-1.5 mb-1">
            <span className="text-sm flex-shrink-0">{statusIcon}</span>
            <span className="text-sm font-semibold text-surface-900 dark:text-white leading-snug">
              {data.title}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-surface-600 dark:text-surface-400 leading-relaxed mb-2">
            {data.desc}
          </p>

          {/* Urdu translation */}
          {showUrdu && data.ur && (
            <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed mb-2" dir="rtl">
              {data.ur}
            </p>
          )}

          {/* Impact bar */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-surface-400 w-10 flex-shrink-0 font-semibold">
              Impact
            </span>
            <div className="flex-1 h-1.5 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
                style={{ width: `${barPct}%` }}
              />
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${badgeClasses}`}>
              {showUrdu ? strengthLabelUr : strengthLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function SHAPExplainer() {
  const [selectedAsset, setSelectedAsset] = useState(ASSET_LIST[0]);
  const [showUrdu, setShowUrdu] = useState(false);
  const [whatIfOpen, setWhatIfOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString());
  const [fromCache, setFromCache] = useState(true);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // TODO: Replace with real API call:
    // const res = await axios.get(`/api/shap/${selectedAsset}?refresh=true`);
    // setLastUpdated(res.data.calculated_at);
    // setFromCache(res.data.from_cache);
    await new Promise(r => setTimeout(r, 800)); // simulate network
    setLastUpdated(new Date().toISOString());
    setFromCache(false);
    setRefreshing(false);
  }, [selectedAsset]);

  const data = SHAP_DATA[selectedAsset];
  if (!data) return null;

  const positiveFactors = data.factors.filter(f => f.direction === 'positive');
  const concernFactors = data.factors.filter(f => f.direction === 'concern' || f.direction === 'negative');

  const confColor = data.confidence >= 75
    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20'
    : data.confidence >= 50
    ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20'
    : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20';

  const confIcon = data.confidence >= 75 ? '✅' : data.confidence >= 50 ? '⚠️' : '❌';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Brain className="w-4 h-4 text-primary-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary-500">AI Insight</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-surface-900 dark:text-white">
            Why did AI choose {data.symbol} for you?
          </h2>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
            Our AI looked at your answers and made this recommendation based on these reasons
          </p>
        </div>
        <button
          onClick={() => setShowUrdu(!showUrdu)}
          className="self-start flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200
            border-primary-300 dark:border-primary-500/30 bg-primary-50 dark:bg-primary-500/10
            text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-500/20
            hover:shadow-md hover:shadow-primary-500/10"
        >
          <Languages className="w-4 h-4" />
          {showUrdu ? 'English' : 'اردو'}
        </button>
      </div>

      {/* ── Last updated + refresh ────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-surface-400">
          <Clock className="w-3 h-3" />
          <span>
            {fromCache
              ? `Explanation from ${timeAgo(lastUpdated)}`
              : 'Just calculated fresh'
            }
          </span>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 text-xs font-medium text-primary-500 hover:text-primary-700 dark:hover:text-primary-300 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Updating...' : 'Refresh explanation'}
        </button>
      </div>

      {/* ── Asset selector pills ─────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {ASSET_LIST.map(key => {
          const asset = SHAP_DATA[key];
          const active = key === selectedAsset;
          return (
            <button
              key={key}
              onClick={() => { setSelectedAsset(key); setWhatIfOpen(false); }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200
                ${active
                  ? 'border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:border-primary-300 dark:hover:border-primary-500/40 hover:bg-surface-50 dark:hover:bg-surface-800/50'
                }`}
            >
              {asset.symbol}
              <span className="ml-1.5 text-xs font-normal opacity-60">{asset.allocation}</span>
            </button>
          );
        })}
      </div>

      {/* ── Confidence badge ─────────────────────────────────────── */}
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${confColor}`}>
        <span>{confIcon}</span>
        {data.confidence}% match with your profile
      </div>

      {/* ── Positive factors ─────────────────────────────────────── */}
      {positiveFactors.length > 0 && (
        <div className="neo-card p-6">
          <h3 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Reasons in your favor
          </h3>
          {positiveFactors.map((f, i) => (
            <FactorCard key={i} factor={f} showUrdu={showUrdu} />
          ))}
        </div>
      )}

      {/* ── Concern factors ──────────────────────────────────────── */}
      {concernFactors.length > 0 && (
        <div className="neo-card p-6">
          <h3 className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Things to keep in mind
          </h3>
          {concernFactors.map((f, i) => (
            <FactorCard key={i} factor={f} showUrdu={showUrdu} />
          ))}
        </div>
      )}

      {/* ── AI Summary ───────────────────────────────────────────── */}
      <div className="neo-card p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
            <span className="text-sm">🤖</span>
          </div>
          <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
            AI Summary
          </h3>
        </div>
        <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed">{data.summary}</p>
        {showUrdu && (
          <p className="mt-3 text-sm text-surface-600 dark:text-surface-400 leading-relaxed" dir="rtl">{data.summaryUr}</p>
        )}
      </div>

      {/* ── What-if Section ──────────────────────────────────────── */}
      {data.whatIf && data.whatIf.length > 0 && (
        <div className="neo-card overflow-hidden">
          <button
            onClick={() => setWhatIfOpen(!whatIfOpen)}
            className="w-full flex items-center justify-between p-6 text-left group transition-colors hover:bg-surface-50 dark:hover:bg-surface-800/30"
          >
            <div>
              <h3 className="text-sm font-bold text-surface-900 dark:text-white">
                What if your situation was different?
              </h3>
              <p className="text-xs text-surface-400 mt-0.5">
                See how changing your answers would affect this recommendation
              </p>
            </div>
            {whatIfOpen
              ? <ChevronUp className="w-5 h-5 text-surface-400 flex-shrink-0" />
              : <ChevronDown className="w-5 h-5 text-surface-400 flex-shrink-0" />
            }
          </button>
          {whatIfOpen && (
            <div className="px-6 pb-6 space-y-3 animate-fade-in">
              {data.whatIf.map((w, i) => (
                <div key={i} className="rounded-xl bg-surface-50 dark:bg-surface-800/50 p-4">
                  <p className="text-xs font-semibold text-surface-600 dark:text-surface-300 mb-1">🔄 {w.scenario}</p>
                  <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">{w.impact}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Disclaimer ───────────────────────────────────────────── */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700/50">
        <ShieldAlert className="w-4 h-4 text-surface-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">
          This explanation is generated by AI and is for educational purposes only. Not financial advice.
          {showUrdu && (
            <span className="block mt-1" dir="rtl">
              یہ وضاحت AI کی بنائی ہوئی ہے اور صرف تعلیمی مقاصد کے لیے ہے۔ یہ مالی مشورہ نہیں ہے۔
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
