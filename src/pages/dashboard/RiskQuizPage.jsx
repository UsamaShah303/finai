import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { quizQuestions } from '../../data/mockData';
import { ArrowRight, ArrowLeft, RotateCcw, Shield, Info, X, Sparkles } from 'lucide-react';

const TERM_DEFINITIONS = {
  investing: "Putting money into assets (like stocks or funds) with the expectation it will grow over time — instead of letting it sit idle in a bank account.",
  returns: "The money you earn (or lose) from your investments, usually shown as a percentage. A 10% return on $1,000 means you made $100.",
  volatility: "How much an investment's value jumps up and down. High volatility = big swings. Low volatility = smooth, steady movement.",
  portfolio: "Your complete collection of investments all together — stocks, bonds, savings, etc. Think of it like a personal investment basket.",
  'risk tolerance': "How comfortable you are with the possibility of losing money in the short term while aiming for long-term gains. It's deeply personal.",
  diversification: "Spreading your money across different types of investments so if one goes down, the others can cushion the fall. Never put all eggs in one basket!",
  stocks: "Tiny ownership pieces of a company you can buy. When the company grows, your stock is worth more. When it struggles, it's worth less.",
  bonds: "Loans you give to governments or companies. In return, they pay you regular interest. Generally safer than stocks, but with lower growth.",
  ETF: "Exchange-Traded Fund — a basket of many investments bundled together that you buy as one. An easy way to diversify without hand-picking stocks.",
  ESG: "Environmental, Social & Governance investing. Choosing companies that are eco-friendly, treat people well, and are run ethically.",
};

const REASSURANCE = [
  { emoji: "✨", message: "Great start! Every answer brings your perfect profile into focus." },
  { emoji: "💪", message: "Nice one! There are absolutely no wrong answers here." },
  { emoji: "🌟", message: "You're 30% through — keeping going, you're doing great!" },
  { emoji: "👍", message: "Thoughtful choice! This is helping us understand you better." },
  { emoji: "🎯", message: "Halfway there! You're doing amazing." },
  { emoji: "🚀", message: "Past the halfway mark! Just a few more to go." },
  { emoji: "🌈", message: "Great insights! Your profile is starting to take shape." },
  { emoji: "🎉", message: "So close! Just 2 more questions." },
  { emoji: "⭐", message: "Last one! You've absolutely got this." },
  { emoji: "🏆", message: "Done! Calculating your personalized risk profile..." },
];

const riskLevels = [
  {
    min: 10, max: 18, level: 'Conservative', emoji: '🛡️', color: '#3b82f6',
    tagline: 'Safety-first investor',
    desc: "You value protecting what you have over chasing big gains — and that's a completely valid strategy! We'll build a portfolio focused on stable, low-risk investments like government bonds, fixed deposits, and blue-chip stocks. Your money grows slowly but steadily, like a reliable savings account, but better.",
    traits: ['Prefers stability over growth', 'Low stress about market swings', 'Good for short-term goals'],
  },
  {
    min: 19, max: 26, level: 'Moderately Conservative', emoji: '🌿', color: '#22c55e',
    tagline: 'Steady-and-safe grower',
    desc: "You want your money to grow, but without too much worry. We'll create a balanced mix leaning toward bonds over stocks — keeping things stable while still tapping into market growth. Think of it as the tortoise winning the race: slow, steady, and reliable.",
    traits: ['Comfortable with small fluctuations', 'Prefers predictable growth', 'Good for medium-term goals'],
  },
  {
    min: 27, max: 34, level: 'Moderate', emoji: '⚖️', color: '#eab308',
    tagline: 'The balanced investor',
    desc: "You're comfortable with some ups and downs in exchange for decent growth. We'll split your portfolio roughly 50/50 between stocks and bonds — giving you both stability and upside. You're the Goldilocks investor: not too hot, not too cold, just right!",
    traits: ['Balanced approach to risk', 'Comfortable riding market cycles', 'Great for most life goals'],
  },
  {
    min: 35, max: 42, level: 'Moderately Aggressive', emoji: '📈', color: '#f59e0b',
    tagline: 'Growth-focused go-getter',
    desc: "You're willing to ride market waves for better long-term returns. Your portfolio will lean heavily toward stocks with some bonds as a safety cushion. Short-term dips don't scare you because you're focused on the bigger picture — and history shows that patience pays off.",
    traits: ['Comfortable with market swings', 'Focused on long-term wealth', 'Good for 7+ year horizons'],
  },
  {
    min: 43, max: 50, level: 'Aggressive', emoji: '🚀', color: '#ef4444',
    tagline: 'Maximum growth adventurer',
    desc: "You want maximum growth and are fully comfortable with significant market swings. Your portfolio will be heavily weighted toward stocks and growth assets. You understand that higher risk can mean higher rewards over the long term — and you've got the nerve to hold through the storms.",
    traits: ['High risk appetite', 'Long investment horizon', 'Focused on maximum wealth growth'],
  },
];

function TermPill({ term }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-500/20 hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors"
      >
        <Info className="w-3 h-3" />
        {term}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute z-50 bottom-full left-0 mb-2 w-72 p-4 bg-surface-900 dark:bg-surface-800 rounded-xl shadow-2xl border border-surface-700">
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">{term}</span>
              <button onClick={() => setOpen(false)} className="text-surface-400 hover:text-white transition-colors flex-shrink-0">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-surface-300 leading-relaxed">{TERM_DEFINITIONS[term]}</p>
            <div className="absolute top-full left-4 border-4 border-transparent border-t-surface-900 dark:border-t-surface-800" />
          </div>
        </>
      )}
    </span>
  );
}

function ReassuranceToast({ message, emoji, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-surface-900 dark:bg-surface-800 text-white shadow-2xl border border-surface-700">
        <span className="text-2xl">{emoji}</span>
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}

export default function RiskQuizPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [reassurance, setReassurance] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [scoreBarWidth, setScoreBarWidth] = useState(0);
  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const progress = ((currentQ) / quizQuestions.length) * 100;
  const question = quizQuestions[currentQ];
  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const riskLevel = riskLevels.find((r) => totalScore >= r.min && totalScore <= r.max) || riskLevels[2];

  useEffect(() => {
    if (showResult) {
      const t = setTimeout(() => setScoreBarWidth((totalScore / 50) * 100), 400);
      return () => clearTimeout(t);
    }
  }, [showResult, totalScore]);

  const handleSelect = (score) => {
    if (animating) return;
    const newAnswers = { ...answers, [currentQ]: score };
    setAnswers(newAnswers);
    setAnimating(true);

    const msg = REASSURANCE[currentQ];
    setReassurance(msg);

    const delay = currentQ < quizQuestions.length - 1 ? 1500 : 1500;
    setTimeout(() => {
      setReassurance(null);
      if (currentQ < quizQuestions.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        setShowResult(true);
      }
      setAnimating(false);
    }, delay);
  };

  const handleSaveResult = () => {
    updateUser({ riskProfile: riskLevel.level });
    navigate('/preview');
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentQ(0);
    setShowResult(false);
    setScoreBarWidth(0);
  };

  if (showResult) {
    return (
      <div className="max-w-2xl mx-auto animate-slide-up">
        <div className="glass-card p-8 text-center">
          {/* Animated emoji */}
          <div
            className="w-24 h-24 rounded-3xl mx-auto mb-5 flex items-center justify-center text-6xl animate-float shadow-lg"
            style={{ backgroundColor: `${riskLevel.color}18` }}
          >
            {riskLevel.emoji}
          </div>

          <div className="mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-surface-400">Your Risk Profile</span>
          </div>
          <h1 className="text-4xl font-black text-surface-900 dark:text-white mb-1">{riskLevel.level}</h1>
          <p className="text-sm font-semibold mb-6" style={{ color: riskLevel.color }}>{riskLevel.tagline}</p>

          <p className="text-surface-600 dark:text-surface-400 leading-relaxed mb-6 max-w-lg mx-auto text-sm">
            {riskLevel.desc}
          </p>

          {/* Traits */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {riskLevel.traits.map((t) => (
              <span key={t} className="text-xs px-3 py-1.5 rounded-full font-medium text-surface-600 dark:text-surface-400 bg-surface-100 dark:bg-surface-800">
                ✓ {t}
              </span>
            ))}
          </div>

          {/* Score bar */}
          <div className="mb-8 p-5 rounded-2xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700/50">
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-surface-500 font-medium">Your Risk Score</span>
              <span className="font-black text-surface-900 dark:text-white text-lg">{totalScore} <span className="text-surface-400 font-normal text-sm">/ 50</span></span>
            </div>
            <div className="h-4 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden mb-2">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${scoreBarWidth}%`, backgroundColor: riskLevel.color }}
              />
            </div>
            <div className="flex justify-between text-xs text-surface-400">
              <span>🛡️ Conservative</span>
              <span>⚖️ Moderate</span>
              <span>🚀 Aggressive</span>
            </div>
          </div>

          {/* Spectrum visual */}
          <div className="flex gap-1 mb-8 rounded-xl overflow-hidden h-2">
            {riskLevels.map((r) => (
              <div
                key={r.level}
                className="flex-1 transition-all duration-700"
                style={{
                  backgroundColor: r.level === riskLevel.level ? r.color : `${r.color}40`,
                  transform: r.level === riskLevel.level ? 'scaleY(1.5)' : 'scaleY(1)',
                }}
              />
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 font-semibold hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </button>
            <button
              onClick={handleSaveResult}
              className="flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-bold hover:shadow-lg hover:shadow-primary-500/25 transition-all group text-sm"
            >
              <Sparkles className="w-4 h-4" />
              See My Portfolio
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-4 h-4 text-primary-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary-500">Risk Assessment</span>
        </div>
        <h1 className="text-2xl font-black text-surface-900 dark:text-white">Let's understand your investing style</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">10 quick questions. No finance degree needed.</p>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-surface-400 mb-2">
          <span>Question {currentQ + 1} of {quizQuestions.length}</span>
          <span className="font-semibold">{Math.round((currentQ / quizQuestions.length) * 100)}% complete</span>
        </div>
        <div className="h-2 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
          <div
            className="h-full rounded-full gradient-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* Step dots */}
        <div className="flex justify-between mt-2 px-0.5">
          {quizQuestions.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i <= currentQ
                  ? 'bg-primary-500'
                  : 'bg-surface-300 dark:bg-surface-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question card */}
      <div className="glass-card p-7 animate-fade-in" key={currentQ}>
        {/* Hint */}
        {question.hint && (
          <p className="text-xs text-surface-500 dark:text-surface-400 mb-4 italic leading-relaxed bg-surface-50 dark:bg-surface-800/50 px-3 py-2 rounded-lg border-l-2 border-primary-300 dark:border-primary-600">
            💡 {question.hint}
          </p>
        )}

        <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-4 leading-relaxed">
          {question.question}
        </h2>

        {/* Term pills */}
        {question.terms && question.terms.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="text-xs text-surface-400 self-center">📖 Learn:</span>
            {question.terms.map((term) => (
              <TermPill key={term} term={term} />
            ))}
          </div>
        )}

        {/* Options */}
        <div className="space-y-2.5">
          {question.options.map(({ text, emoji, score }, i) => {
            const selected = answers[currentQ] === score;
            return (
              <button
                key={i}
                onClick={() => handleSelect(score)}
                disabled={animating}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200 group disabled:cursor-not-allowed
                  ${selected
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10 shadow-md shadow-primary-500/10 scale-[1.01]'
                    : 'border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-500/40 hover:bg-surface-50 dark:hover:bg-surface-800/50 hover:scale-[1.005]'
                  }`}
              >
                <span className="text-2xl group-hover:scale-110 transition-transform flex-shrink-0">{emoji}</span>
                <span className={`text-sm font-medium flex-1 leading-snug ${
                  selected
                    ? 'text-primary-700 dark:text-primary-300'
                    : 'text-surface-700 dark:text-surface-300'
                }`}>
                  {text}
                </span>
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                  selected
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-surface-300 dark:border-surface-600'
                }`}>
                  {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-surface-100 dark:border-surface-700/50">
          <button
            onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
            disabled={currentQ === 0 || animating}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-surface-400 hover:text-surface-700 dark:hover:text-surface-300 disabled:opacity-30 transition-colors rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <span className="text-xs text-surface-400">Select an answer to continue</span>

          {answers[currentQ] !== undefined && currentQ < quizQuestions.length - 1 && (
            <button
              onClick={() => !animating && setCurrentQ(currentQ + 1)}
              disabled={animating}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors rounded-lg hover:bg-primary-50 dark:hover:bg-primary-500/10"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Reassurance toast */}
      {reassurance && (
        <ReassuranceToast
          emoji={reassurance.emoji}
          message={reassurance.message}
          onDone={() => setReassurance(null)}
        />
      )}
    </div>
  );
}
