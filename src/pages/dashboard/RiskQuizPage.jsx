import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { quizQuestions } from '../../data/mockData';
import { ArrowRight, ArrowLeft, CheckCircle, RotateCcw, Shield } from 'lucide-react';

const riskLevels = [
  { min: 10, max: 18, level: 'Conservative', emoji: '🛡️', color: '#3b82f6', desc: "You prefer safety over high returns. We'll build a portfolio focused on stable investments like bonds, fixed deposits, and blue-chip stocks. Your money grows slowly but steadily – like a reliable savings account, but better!" },
  { min: 19, max: 26, level: 'Moderately Conservative', emoji: '🌿', color: '#22c55e', desc: "You want growth but without too much worry. We'll create a balanced mix with more bonds than stocks, keeping your portfolio stable while still tapping into market growth. Think of it as the tortoise winning the race." },
  { min: 27, max: 34, level: 'Moderate', emoji: '⚖️', color: '#eab308', desc: "You're comfortable with some ups and downs in exchange for decent growth. We'll split between stocks and bonds roughly equally. You're the balanced investor – not too hot, not too cold, just right!" },
  { min: 35, max: 42, level: 'Moderately Aggressive', emoji: '📈', color: '#f59e0b', desc: "You're willing to ride market waves for better returns. Your portfolio will lean heavier on stocks with some bonds as a cushion. Short-term drops don't scare you because you're focused on the bigger picture." },
  { min: 43, max: 50, level: 'Aggressive', emoji: '🚀', color: '#ef4444', desc: "You want maximum growth and are comfortable with significant market swings. Your portfolio will be heavily weighted in stocks and growth assets. You understand that higher risk can mean higher rewards over the long term!" },
];

export default function RiskQuizPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const progress = ((currentQ + 1) / quizQuestions.length) * 100;
  const question = quizQuestions[currentQ];

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const riskLevel = riskLevels.find((r) => totalScore >= r.min && totalScore <= r.max) || riskLevels[2];

  const handleSelect = (score) => {
    const newAnswers = { ...answers, [currentQ]: score };
    setAnswers(newAnswers);

    if (currentQ < quizQuestions.length - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 300);
    } else {
      setTimeout(() => setShowResult(true), 300);
    }
  };

  const handleSaveResult = () => {
    updateUser({ riskProfile: riskLevel.level });
    navigate('/dashboard');
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentQ(0);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="max-w-2xl mx-auto animate-slide-up">
        <div className="glass-card p-8 text-center">
          <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center text-5xl" style={{ backgroundColor: `${riskLevel.color}15` }}>
            {riskLevel.emoji}
          </div>
          <h1 className="text-3xl font-black text-surface-900 dark:text-white mb-2">Your Risk Profile</h1>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-bold mb-6" style={{ backgroundColor: `${riskLevel.color}15`, color: riskLevel.color }}>
            <Shield className="w-5 h-5" />
            {riskLevel.level}
          </div>
          <p className="text-surface-600 dark:text-surface-400 leading-relaxed mb-8 max-w-lg mx-auto">
            {riskLevel.desc}
          </p>

          {/* Score breakdown */}
          <div className="mb-8 p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-surface-500">Risk Score</span>
              <span className="font-bold text-surface-900 dark:text-white">{totalScore} / 50</span>
            </div>
            <div className="h-3 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${(totalScore / 50) * 100}%`, backgroundColor: riskLevel.color }} />
            </div>
            <div className="flex justify-between text-xs text-surface-400 mt-1">
              <span>Conservative</span>
              <span>Aggressive</span>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button onClick={handleRestart} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 font-semibold hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </button>
            <button onClick={handleSaveResult} className="flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-bold hover:shadow-lg hover:shadow-primary-500/25 transition-all group">
              Save & Continue
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-surface-500 dark:text-surface-400 mb-2">
          <span>Question {currentQ + 1} of {quizQuestions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="h-2 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
          <div className="h-full rounded-full gradient-primary transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="glass-card p-8 animate-slide-up" key={currentQ}>
        <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-6 leading-relaxed">
          {question.question}
        </h2>

        <div className="space-y-3">
          {question.options.map(({ text, emoji, score }, i) => {
            const selected = answers[currentQ] === score;
            return (
              <button
                key={i}
                onClick={() => handleSelect(score)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200 group
                  ${selected
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10 shadow-lg shadow-primary-500/10'
                    : 'border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-500/30 hover:bg-surface-50 dark:hover:bg-surface-800/50'
                  }`}
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">{emoji}</span>
                <span className={`text-sm font-medium flex-1 ${selected ? 'text-primary-700 dark:text-primary-300' : 'text-surface-700 dark:text-surface-300'}`}>
                  {text}
                </span>
                {selected && <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
            disabled={currentQ === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 disabled:opacity-30 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>
          {answers[currentQ] !== undefined && currentQ < quizQuestions.length - 1 && (
            <button
              onClick={() => setCurrentQ(currentQ + 1)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
