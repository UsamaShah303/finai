import { useState } from 'react';
import { ChevronDown, ChevronUp, Check, X, RefreshCw, Lightbulb, ShieldAlert, Languages, BookOpen } from 'lucide-react';

const PKR_RATE = 278.5;
const fmt = (v) => Math.round(v).toLocaleString();

const REPLACEMENTS = {
  OGDC: { symbol: 'PPL', sector: 'Oil & Gas', desc: 'Pakistan Petroleum' },
  ENGRO: { symbol: 'FATIMA', sector: 'Chemicals', desc: 'Fatima Fertilizer' },
  LUCK: { symbol: 'DGKC', sector: 'Cement', desc: 'D.G. Khan Cement' },
  HBL: { symbol: 'MCB', sector: 'Banking', desc: 'MCB Bank' },
  VEA: { symbol: 'IEFA', sector: 'Intl Developed', desc: 'iShares Intl Developed' },
  VWO: { symbol: 'IEMG', sector: 'Emerging Markets', desc: 'iShares Emerging Markets' },
  SPY: { symbol: 'IVV', sector: 'US Large Cap', desc: 'iShares S&P 500' },
  GLD: { symbol: 'IAU', sector: 'Gold', desc: 'iShares Gold Trust' },
};

const MOCK_OPPORTUNITIES = [
  { symbol: 'OGDC', shares: 500, avg_buy_price: 128, current_price: 117.4, currency: 'PKR', holding_months: 8 },
  { symbol: 'HBL', shares: 200, avg_buy_price: 145, current_price: 132.6, currency: 'PKR', holding_months: 5 },
  { symbol: 'VEA', shares: 20, avg_buy_price: 48.5, current_price: 44.1, currency: 'USD', holding_months: 10 },
];

function getCGTRate(months) {
  if (months < 12) return 0.15;
  if (months <= 24) return 0.125;
  return 0;
}

// ---------------------------------------------------------------------------
// Opportunity Card
// ---------------------------------------------------------------------------
function OpportunityCard({ h, showUrdu }) {
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(false);
  const [harvested, setHarvested] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const isPKR = h.currency === 'PKR';
  const lossPer = (h.current_price - h.avg_buy_price) * h.shares;
  const lossPKR = isPKR ? Math.abs(lossPer) : Math.abs(lossPer) * PKR_RATE;
  const lossPct = Math.abs(((h.current_price - h.avg_buy_price) / h.avg_buy_price) * 100);
  const cgtRate = getCGTRate(h.holding_months);
  const taxSaved = lossPKR * cgtRate;
  const repl = REPLACEMENTS[h.symbol];
  const valuePKR = isPKR ? h.current_price * h.shares : h.current_price * h.shares * PKR_RATE;

  const handleHarvest = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setHarvested(true);
    setLoading(false);
  };

  if (dismissed) return null;

  // ── SUCCESS STATE ──────────────────────────────────────────
    if (harvested) {
      return (
        <div className="neo-card border-emerald-200/50 dark:border-emerald-500/20 p-6 animate-fade-in relative overflow-hidden group">
          {/* Success Graphic */}
          <svg className="absolute -top-10 -right-10 w-48 h-48 opacity-[0.03] text-emerald-600 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700 pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="40" strokeWidth="4" stroke="currentColor" fill="none" strokeDasharray="10 10"/>
            <path d="M 30 50 L 45 65 L 75 35" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="flex items-center gap-3 mb-5 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 border border-emerald-300/50"><Check className="w-5 h-5 text-white" strokeWidth={3} /></div>
            <h4 className="text-[15px] font-extrabold text-slate-800 dark:text-white tracking-tight">Smart loss strategy applied</h4>
          </div>

        {/* Before / After */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="rounded-xl bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 p-4">
            <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-2">Before</p>
            <p className="text-sm font-bold text-surface-900 dark:text-white">{h.symbol}</p>
            <p className="text-xs text-surface-500">{repl?.sector}</p>
            <p className="text-xs text-surface-500 mt-1">PKR {fmt(valuePKR)}</p>
          </div>
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20 p-4">
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2">After</p>
            <p className="text-sm font-bold text-surface-900 dark:text-white">{repl?.symbol}</p>
            <p className="text-xs text-surface-500">{repl?.sector}</p>
            <p className="text-xs text-surface-500 mt-1">PKR {fmt(valuePKR)}</p>
          </div>
        </div>

        <p className="text-xs text-surface-600 dark:text-surface-400 leading-relaxed mb-4">
          You are still invested in <strong>{repl?.sector}</strong>. Nothing really changed — except:
        </p>

        <div className="space-y-2 mb-4">
          {[
            ['📉 Loss booked', `PKR ${fmt(lossPKR)}`],
            ['💰 Tax saved', <span className="text-emerald-600 dark:text-emerald-400 font-bold">PKR {fmt(taxSaved)}</span>],
            ['📊 Portfolio', 'Same sector exposure'],
          ].map(([l, v], i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-surface-500 dark:text-surface-400">{l}</span>
              <span className="text-surface-900 dark:text-white">{v}</span>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-emerald-100 dark:bg-emerald-500/10 p-3">
          <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
            In real investing, this PKR {fmt(taxSaved)} would stay in your pocket instead of going to FBR.
          </p>
          {showUrdu && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 leading-relaxed mt-2" dir="rtl">
              حقیقی سرمایہ کاری میں یہ PKR {fmt(taxSaved)} آپ کی جیب میں رہتے بجائے FBR کو جانے کے۔
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── OPPORTUNITY STATE ──────────────────────────────────────
  return (
    <div className="neo-card p-6 animate-fade-in relative overflow-hidden group">
      {/* Premium Background Graphic */}
      <svg className="absolute -bottom-6 -right-6 w-32 h-32 opacity-[0.03] text-sky-900 transform group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-700 pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
        <path d="M43.7,-70.7C55.4,-64.1,62.8,-48.9,71.2,-34.5C79.6,-20.1,89,-6.4,87.6,6.3C86.1,18.9,73.8,30.5,62.9,41.9C52.1,53.2,42.7,64.3,30.2,71.1C17.7,77.9,2,80.3,-12.3,77.8C-26.6,75.3,-39.5,67.8,-51.8,58.8C-64.1,49.8,-75.8,39.3,-80.7,26.1C-85.6,12.9,-83.8,-3.1,-78.3,-17.8C-72.8,-32.5,-63.6,-45.9,-51.1,-52.1C-38.6,-58.3,-22.8,-57.4,-7.8,-45.2C7.2,-33,22.4,-15,32.1,-77.4L43.7,-70.7Z" transform="translate(50 50) scale(1.1)" />
      </svg>
      {/* Header */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-[16px] bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-300/50 transition-transform duration-300 group-hover:scale-110">
            <Lightbulb className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-surface-900 dark:text-white">Smart loss opportunity — {h.symbol}</h4>
            <p className="text-xs text-surface-500 dark:text-surface-400">{h.symbol} is down {lossPct.toFixed(1)}% from when you bought it</p>
          </div>
        </div>
        <button onClick={() => setDismissed(true)} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"><X className="w-4 h-4 text-surface-400" /></button>
      </div>

      {/* Level 1 — always visible */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-surface-500 dark:text-surface-400">Your loss</span>
          <span className="font-semibold text-red-500">PKR {fmt(lossPKR)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-surface-500 dark:text-surface-400">Tax you could save this year</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            PKR {fmt(taxSaved)}
            <span className="text-xs font-normal text-surface-400 ml-1">(FBR CGT {(cgtRate * 100)}%)</span>
          </span>
        </div>
        {cgtRate === 0 && (
          <p className="text-xs text-emerald-500 italic">Held over 2 years — 0% CGT applies. No tax saving in this case.</p>
        )}
      </div>

      {/* Level 2 toggle */}
      <button
        onClick={() => setLevel(level >= 2 ? 1 : 2)}
        className="flex items-center gap-1.5 text-xs font-semibold text-primary-500 hover:text-primary-700 dark:hover:text-primary-300 mb-3 transition-colors"
      >
        {level >= 2 ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        {level >= 2 ? 'Hide explanation' : 'How does this work?'}
      </button>

      {level >= 2 && (
        <div className="rounded-xl bg-surface-50 dark:bg-surface-800/50 p-4 mb-4 animate-fade-in">
          <p className="text-xs text-surface-700 dark:text-surface-300 leading-relaxed mb-2">
            You sell <strong>{h.symbol}</strong> now and lock in the PKR {fmt(lossPKR)} loss on paper.
            You immediately buy <strong>{repl?.symbol}</strong> — {repl?.desc} — a similar {repl?.sector} investment, so you stay invested in the same sector.
          </p>
          <p className="text-xs text-surface-700 dark:text-surface-300 leading-relaxed mb-2">
            FBR lets you use this loss to reduce tax on your other gains this year. That saves you <strong>PKR {fmt(taxSaved)}</strong>.
          </p>
          {showUrdu && (
            <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed mt-2" dir="rtl">
              آپ ابھی {h.symbol} بیچیں اور PKR {fmt(lossPKR)} نقصان ریکارڈ کریں۔ فوراً {repl?.symbol} خریدیں — وہی سیکٹر۔ FBR آپ کو اس نقصان سے دوسرے منافعوں پر ٹیکس کم کرنے دیتا ہے۔
            </p>
          )}
          <p className="text-[10px] text-surface-400 mt-2 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" /> This is a simulation. In a real portfolio consult your tax advisor.
          </p>

          {/* Level 3 toggle */}
          <button
            onClick={() => setLevel(level >= 3 ? 2 : 3)}
            className="flex items-center gap-1.5 text-xs font-semibold text-primary-500 hover:text-primary-700 dark:hover:text-primary-300 mt-3 transition-colors"
          >
            {level >= 3 ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {level >= 3 ? 'Less detail' : 'Tell me more — FBR CGT rules'}
          </button>

          {level >= 3 && (
            <div className="mt-3 rounded-xl bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/20 p-4 animate-fade-in">
              <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> CGT Rules in Pakistan (FBR)</p>
              <div className="space-y-1.5 text-xs">
                {[
                  ['Held less than 1 year', '15% tax on profit', false],
                  ['Held 1 to 2 years', '12.5% tax on profit', false],
                  ['Held more than 2 years', '0% tax on profit ✅', true],
                ].map(([period, rate, green], i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-400">{period}</span>
                    <span className={`font-semibold ${green ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-700 dark:text-blue-400'}`}>{rate}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-blue-400 mt-2 leading-relaxed">Source: FBR Finance Act. Rates apply to listed securities on PSX. Always consult a tax advisor.</p>
              {showUrdu && (
                <p className="text-[10px] text-blue-400 mt-1 leading-relaxed" dir="rtl">
                  ماخذ: FBR فنانس ایکٹ۔ یہ شرحیں PSX پر درج سیکیورٹیز پر لاگو ہوتی ہیں۔ اپنے ٹیکس مشیر سے مشورہ کریں۔
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2.5">
        <button
          onClick={handleHarvest}
          disabled={loading || cgtRate === 0}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all bg-amber-500 text-white hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/20 disabled:opacity-50"
        >
          {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Processing...</> : 'Try this simulation'}
        </button>
        <button onClick={() => setDismissed(true)} className="px-4 py-2.5 rounded-xl text-sm font-medium border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
          Not now
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
export default function TaxLossPage() {
  const [showUrdu, setShowUrdu] = useState(false);

  const opps = MOCK_OPPORTUNITIES;
  const totalLossPKR = opps.reduce((s, h) => {
    const l = Math.abs((h.current_price - h.avg_buy_price) * h.shares);
    return s + (h.currency === 'PKR' ? l : l * PKR_RATE);
  }, 0);
  const totalTaxSaved = opps.reduce((s, h) => {
    const l = Math.abs((h.current_price - h.avg_buy_price) * h.shares);
    const pkr = h.currency === 'PKR' ? l : l * PKR_RATE;
    return s + pkr * getCGTRate(h.holding_months);
  }, 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-500/10 flex items-center justify-center">
              <Lightbulb className="w-4.5 h-4.5 text-sky-600" strokeWidth={2.5} />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-sky-600">Smart Strategy</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">Smart Loss Strategy</h2>
          <p className="text-[15px] font-medium text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Find losses in your portfolio and use them to save on your FBR tax bill.
          </p>
        </div>
        <button onClick={() => setShowUrdu(!showUrdu)}
          className="self-start flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all border-sky-200 dark:border-sky-500/30 bg-white dark:bg-slate-800/50 text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 shadow-sm hover:shadow-md hover:-translate-y-0.5">
          <Languages className="w-4.5 h-4.5" />{showUrdu ? 'English' : 'اردو'}
        </button>
      </div>

      {/* Summary */}
      <div className="neo-card p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/50 dark:divide-slate-700/50">
          <div className="pt-4 sm:pt-0 sm:px-4 first:pt-0 first:px-0">
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Opportunities</p>
            <p className="text-3xl font-black text-slate-800 dark:text-white">{opps.length}</p>
          </div>
          <div className="pt-4 sm:pt-0 sm:px-4">
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Total Loss</p>
            <p className="text-3xl font-black text-red-500">PKR {fmt(totalLossPKR)}</p>
          </div>
          <div className="pt-4 sm:pt-0 sm:px-4">
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Potential Tax Saved</p>
            <p className="text-3xl font-black text-emerald-500 dark:text-emerald-400">PKR {fmt(totalTaxSaved)}</p>
          </div>
        </div>
      </div>

      {/* Analogy */}
      <div className="neo-card p-5">
        <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">Think of it like this</h3>
        <div className="rounded-xl bg-surface-50 dark:bg-surface-800/50 p-4">
          <p className="text-xs text-surface-700 dark:text-surface-300 leading-relaxed">
            You bought a plot for <strong>PKR 10 lakh</strong>. Its value dropped to <strong>PKR 8 lakh</strong>.
            A smart investor sells it, books the <strong>PKR 2 lakh loss</strong>, then buys a similar plot nearby.
            Why? Because that PKR 2 lakh loss reduces the tax they pay on <strong>other profits</strong> this year.
            Your portfolio can do the same thing.
          </p>
          {showUrdu && (
            <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed mt-3" dir="rtl">
              آپ نے ایک پلاٹ 10 لاکھ میں خریدا۔ اس کی قیمت 8 لاکھ ہو گئی۔ سمجھدار سرمایہ کار اسے بیچ کر 2 لاکھ کا نقصان ریکارڈ کرتا ہے، پھر قریب ہی ایسا ہی پلاٹ خرید لیتا ہے۔ کیوں؟ کیونکہ وہ 2 لاکھ کا نقصان اس سال دوسرے منافعوں پر ٹیکس کم کر دیتا ہے۔
            </p>
          )}
        </div>
      </div>

      {/* Opportunity cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" /> Current Opportunities ({opps.length})
        </h3>
        {opps.map(h => <OpportunityCard key={h.symbol} h={h} showUrdu={showUrdu} />)}
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700/50">
        <ShieldAlert className="w-4 h-4 text-surface-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">
          This is a simulation for educational purposes only. No real money is traded and no actual tax benefit is generated. Consult a tax advisor for your real portfolio. Pakistan CGT rates may vary by holding period under FBR rules.
          {showUrdu && <span className="block mt-1" dir="rtl">یہ صرف تعلیمی مقاصد کے لیے ایک سمولیشن ہے۔ اپنے حقیقی پورٹ فولیو کے لیے ٹیکس مشیر سے مشورہ کریں۔</span>}
        </p>
      </div>
    </div>
  );
}
