import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  RefreshCw,
  Target, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  Info,
  ArrowRight,
  BrainCircuit,
  Wallet,
  Zap,
  Globe
} from 'lucide-react';

interface Question {
  id: number;
  text: string;
  beginnerText: string;
  options: {
    label: string;
    description: string;
    score: number;
  }[];
  term?: string;
  definition?: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "How much experience do you have with investing?",
    beginnerText: "Think of this as your starting line. Are you just putting your shoes on, or have you run this race before?",
    options: [
      { label: "Absolute Beginner", description: "I've never invested before and want to learn the basics.", score: 1 },
      { label: "A Little Bit", description: "I know some terms but haven't done much yet.", score: 2 },
      { label: "Comfortable", description: "I've traded a few stocks or mutual funds.", score: 3 },
      { label: "Experienced", description: "I've been investing for years and understand complex strategies.", score: 4 }
    ],
    term: "Risk Tolerance",
    definition: "Your ability and willingness to lose some money in exchange for potentially earning more later."
  },
  {
    id: 2,
    text: "What is the primary goal for this investment?",
    beginnerText: "What are you saving for? Is it a rainy day fund, or a sunny future retirement?",
    options: [
      { label: "Emergency Fund", description: "Safety is key. I need this money to be there if something goes wrong.", score: 1 },
      { label: "Major Purchase", description: "Saving for a house or car in the next 2-5 years.", score: 2 },
      { label: "Retirement", description: "Long-term growth for the distant future.", score: 3 },
      { label: "Wealth Building", description: "I want to maximize my money as much as possible.", score: 4 }
    ]
  },
  {
    id: 3,
    text: "How would you react if your account value dropped 10% in a month?",
    beginnerText: "Imagine your $1,000 becomes $900 overnight. How does your stomach feel?",
    options: [
      { label: "Panic", description: "I'd sell everything immediately to prevent more loss.", score: 1 },
      { label: "Worried", description: "I'd be concerned and might stop adding money.", score: 2 },
      { label: "Patient", description: "Changes are normal. I'll wait it out.", score: 3 },
      { label: "Excited", description: "A drop is a 'sale'! I'd buy more while it's cheap.", score: 4 }
    ],
    term: "Volatility",
    definition: "How quickly and significantly the price of an investment goes up and down over time."
  },
  {
    id: 4,
    text: "How long do you plan to keep your money invested?",
    beginnerText: "When do you see yourself actually needing to spend this money?",
    options: [
      { label: "Less than 1 year", description: "I need it very soon.", score: 1 },
      { label: "1 to 3 years", description: "Short-term savings.", score: 2 },
      { label: "5 to 10 years", description: "Medium-term growth.", score: 3 },
      { label: "More than 10 years", description: "I'm in it for the long haul.", score: 4 }
    ]
  },
  {
    id: 5,
    text: "Do you care about the social and environmental impact of your investments?",
    beginnerText: "Does it matter to you if your money supports 'green' companies or fair workplaces?",
    options: [
      { label: "Not really", description: "I only care about the financial returns.", score: 1 },
      { label: "A little", description: "I prefer ethical companies if the returns are good.", score: 2 },
      { label: "Somewhat", description: "I want a balance of profit and purpose.", score: 3 },
      { label: "Very Much", description: "I only want to invest in companies doing good in the world.", score: 4 }
    ],
    term: "ESG",
    definition: "Environmental, Social, and Governance. It's a way to measure a company's impact beyond just making money."
  },
  {
    id: 6,
    text: "If you had $1,000, which outcome would you prefer?",
    beginnerText: "Which of these 'bets' feels most right for you?",
    options: [
        { label: "Safe & Steady", description: "A guaranteed $1,050 after one year.", score: 1 },
        { label: "Low Risk", description: "A high chance of $1,100, but a small chance of $950.", score: 2 },
        { label: "Moderate Risk", description: "A fair chance of $1,250, but a chance of $800.", score: 3 },
        { label: "High Risk", description: "A chance of $2,000, but a chance of losing half ($500).", score: 4 }
    ]
  },
  {
    id: 7,
    text: "How much of your monthly income can you afford to save?",
    beginnerText: "After bills and essentials, how much 'extra' room do you have?",
    options: [
      { label: "Very little", description: "I'm living mostly paycheck to paycheck.", score: 1 },
      { label: "Up to 10%", description: "I have a small buffer.", score: 2 },
      { label: "10% to 20%", description: "I have a healthy saving habit.", score: 3 },
      { label: "More than 25%", description: "I have significant disposable income.", score: 4 }
    ]
  },
  {
    id: 8,
    text: "What is your current source of income?",
    beginnerText: "Is your money coming from a steady job, or is it more unpredictable?",
    options: [
      { label: "Unemployed / Student", description: "No steady income currently.", score: 1 },
      { label: "Freelance", description: "Income changes month to month.", score: 2 },
      { label: "Steady Salary", description: "I know exactly what I'm getting every month.", score: 3 },
      { label: "Multiple Streams", description: "I have diversified income sources (rentals, side business, etc.)", score: 4 }
    ]
  },
  {
    id: 9,
    text: "How often do you plan to check your portfolio?",
    beginnerText: "Will you be watching the numbers every day, or 'setting it and forgetting it'?",
    options: [
      { label: "Multiple times a day", description: "I like being very hands-on.", score: 4 },
      { label: "Weekly", description: "I want to stay updated but not obsess.", score: 3 },
      { label: "Monthly", description: "Once a month is enough for me.", score: 2 },
      { label: "Yearly", description: "I rarely look at it; I trust the long-term process.", score: 1 }
    ],
    term: "Portfolio",
    definition: "The total collection of all your different investments (stocks, bonds, cash, etc.)"
  },
  {
    id: 10,
    text: "Are you investing mainly for yourself or for your family?",
    beginnerText: "Is this for your own future, or are you building a legacy for others?",
    options: [
      { label: "Mainly Myself", description: "This is for my personal goals and security.", score: 2 },
      { label: "Mainly Family", description: "I want to provide for children or relatives.", score: 1 },
      { label: "Both", description: "I want to take care of myself and leave something behind.", score: 3 },
      { label: "Community / Legacy", description: "I want to fund things beyond my immediate circle.", score: 4 }
    ]
  }
];

const REASSURANCES = [
  "Doing great! We're learning so much about your style.",
  "Almost halfway there. Your future self will thank you for this.",
  "Keep going! Your answers are helping us build your custom plan.",
  "You're a natural! Just a few more to go.",
  "Final stretch! Let's find your perfect risk score."
];

interface RiskQuizProps {
  onComplete: (profile: RiskProfile) => void;
}

export interface RiskProfile {
  score: number;
  category: 'Conservative' | 'Moderate' | 'Aggressive' | 'Very Aggressive';
  description: string;
}

export const RiskQuiz: React.FC<RiskQuizProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [showTooltips, setShowTooltips] = useState(false);
  const [showReassurance, setShowReassurance] = useState(false);
  
  const reassuranceMessages = [
    "Great start! We're building your profile.",
    "Your future self will thank you for this.",
    "Almost there, stay focused!",
    "This helps the AI understand your unique needs.",
    "Brilliant choice. Consistency is key."
  ];

  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;
  const currentQuestion = QUESTIONS[currentStep];

  const handleSelect = (score: number) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = score;
    setAnswers(newAnswers);

    setShowReassurance(true);

    if (currentStep < QUESTIONS.length - 1) {
      setTimeout(() => {
        setShowReassurance(false);
        setCurrentStep(prev => prev + 1);
      }, 1000); 
    } else {
      setTimeout(() => {
        setIsFinished(true);
      }, 1200);
    }
  };

  const getProfile = (): RiskProfile => {
    const total = answers.reduce((acc, curr) => acc + curr, 0);
    const avg = total / QUESTIONS.length;

    if (avg < 1.8) {
      return {
        score: Math.round(avg * 25),
        category: 'Conservative',
        description: 'You value security above all else. Your ideal portfolio focuses on preserving wealth with steady, low-risk growth.'
      };
    } else if (avg < 2.8) {
      return {
        score: Math.round(avg * 25),
        category: 'Moderate',
        description: 'You like a balance. You are comfortable with some ups and downs in exchange for better growth over time.'
      };
    } else if (avg < 3.5) {
      return {
        score: Math.round(avg * 25),
        category: 'Aggressive',
        description: 'You are looking for strong growth and understand that bigger rewards require taking bigger risks.'
      };
    } else {
      return {
        score: Math.round(avg * 25),
        category: 'Very Aggressive',
        description: 'You are a high-speed investor. You aim for maximum returns and are ready to ride out significant market swings.'
      };
    }
  };

  const [isCompleting, setIsCompleting] = useState(false);

  const handleFinish = () => {
    if (isCompleting) return;
    setIsCompleting(true);
    
    // Calculate profile immediately
    const profile = getProfile();
    
    // Short delay for visual feedback before calling parent
    setTimeout(() => {
      onComplete(profile);
    }, 600);
  };

  if (isFinished) {
    const profile = getProfile();
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-mesh z-[300] flex flex-col items-center justify-center p-6 text-center"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: window.innerHeight + 100,
                opacity: Math.random() * 0.5 + 0.2,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{ 
                y: -100,
                rotate: 360
              }}
              transition={{ 
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 10
              }}
              className="absolute w-2 h-2 bg-primary rounded-full blur-[1px]"
            />
          ))}
        </div>

        <motion.div
           initial={{ scale: 0.8, opacity: 0, y: 40 }}
           animate={{ scale: 1, opacity: 1, y: 0 }}
           transition={{ type: "spring", damping: 20, stiffness: 100 }}
           className="relative z-10 w-full max-w-2xl bg-white/40 backdrop-blur-3xl rounded-[64px] border border-white/60 p-16 shadow-2xl flex flex-col items-center"
        >
          <motion.div
             initial={{ scale: 0, rotate: -45 }}
             animate={{ scale: 1, rotate: 0 }}
             transition={{ delay: 0.4, type: "spring", bounce: 0.6 }}
             className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-10 border border-gray-50"
          >
             <Sparkles className="w-12 h-12 text-primary" />
          </motion.div>
          
          <h2 className="text-xs font-black text-primary uppercase tracking-[0.5em] mb-4">Financial DNA Complete</h2>
          <h1 className="text-6xl font-black text-gray-900 mb-10 tracking-tighter leading-none">
            {profile.category} <span className="text-primary">Profile</span>
          </h1>
          
          <div className="w-full bg-white/60 rounded-[48px] p-10 border border-white/80 shadow-sm mb-12 flex flex-col md:flex-row items-center gap-12">
             <div className="relative">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-gray-100"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={364}
                    initial={{ strokeDashoffset: 364 }}
                    animate={{ strokeDashoffset: 364 - (364 * profile.score) / 100 }}
                    transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                    className="text-primary"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <span className="text-3xl font-black text-gray-900">{profile.score}</span>
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Score</span>
                </div>
             </div>
             
             <div className="flex-1 text-left">
                <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                   <ShieldCheck className="w-4 h-4 text-emerald-500" />
                   Investor Persona
                </h4>
                <p className="text-gray-600 font-bold leading-relaxed text-lg tracking-tight italic">
                   "{profile.description}"
                </p>
             </div>
          </div>

          <motion.button
            disabled={isCompleting}
            whileHover={{ scale: isCompleting ? 1 : 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: isCompleting ? 1 : 0.95 }}
            onClick={handleFinish}
            className="bg-gray-900 text-white px-16 py-6 rounded-[32px] font-black uppercase tracking-[0.2em] text-xs flex items-center gap-4 group disabled:opacity-70"
          >
            {isCompleting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                Synchronizing...
              </>
            ) : (
              <>
                Access Intelligence Hub
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
              </>
            )}
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="fixed inset-0 bg-mesh z-[300] flex flex-col items-center justify-center overflow-y-auto">
      {/* Background SVG Layers for depth */}
      <div className="absolute inset-x-0 top-0 h-full overflow-hidden pointer-events-none opacity-40">
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="absolute top-0 transform scale-150 rotate-12 opacity-30">
          <circle cx="500" cy="0" r="500" fill="url(#quiz-grad-1)" />
          <defs>
            <radialGradient id="quiz-grad-1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <div className="w-full max-w-2xl px-6 py-12 relative z-10">
        
        {/* Progress Header */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-6">
                {currentStep > 0 && (
                   <motion.button 
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     whileHover={{ x: -4 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={() => setCurrentStep(prev => prev - 1)}
                     className="w-12 h-12 bg-white/40 backdrop-blur-xl rounded-2xl shadow-sm border border-white flex items-center justify-center text-gray-400 hover:text-primary transition-all"
                   >
                     <ChevronLeft className="w-6 h-6" />
                   </motion.button>
                )}
                <motion.div 
                   key={currentStep}
                   initial={{ scale: 0.8 }}
                   animate={{ scale: 1 }}
                   className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center"
                >
                   <Target className="w-6 h-6 text-primary" />
                </motion.div>
                <div>
                   <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1">Risk Assessment</h3>
                   <span className="text-xl font-black text-gray-900 tracking-tight">Question {currentStep + 1} <span className="text-gray-300 font-medium">/ {QUESTIONS.length}</span></span>
                </div>
             </div>
          </div>
          
          <div className="flex gap-2.5 h-2 w-full">
            {QUESTIONS.map((_, idx) => (
              <div 
                key={idx}
                className="flex-1 rounded-full overflow-hidden bg-gray-200/20 relative cursor-default"
              >
                <motion.div 
                  className="absolute inset-0 bg-primary"
                  initial={false}
                  animate={{ 
                    opacity: idx < currentStep ? 1 : idx === currentStep ? 0.3 : 0,
                    x: idx <= currentStep ? '0%' : '-100%'
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Question Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="space-y-12"
          >
            <div>
               <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-[1] mb-8">
                 {currentQuestion.text}
               </h1>
               <div className="inline-flex flex-col gap-4">
                  <div className="inline-flex gap-4 p-5 bg-white/40 backdrop-blur-md rounded-[28px] border border-white/60 shadow-sm">
                     <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <BrainCircuit className="w-5 h-5" />
                     </div>
                     <p className="text-gray-600 font-bold leading-relaxed italic text-sm py-1">
                        "{currentQuestion.beginnerText}"
                     </p>
                  </div>
                  
                  {currentQuestion.term && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center gap-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center">
                        <Info className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{currentQuestion.term}</span>
                        <p className="text-xs font-bold text-indigo-900/70">{currentQuestion.definition}</p>
                      </div>
                    </motion.div>
                  )}
               </div>
            </div>

            <div className="grid gap-4 relative">
               <AnimatePresence>
                 {showReassurance && (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.9, y: 10 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 1.1, y: -10 }}
                     className="absolute inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-[32px] border border-white"
                   >
                     <div className="flex flex-col items-center gap-4 text-center p-8">
                        <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
                           <Sparkles className="w-8 h-8" />
                        </div>
                        <p className="text-xl font-black text-gray-900 tracking-tight">
                           {reassuranceMessages[currentStep % reassuranceMessages.length]}
                        </p>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
               {currentQuestion.options.map((opt, idx) => (
                 <motion.button
                   key={idx}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: idx * 0.1 }}
                   whileHover={{ x: 10, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                   whileTap={{ scale: 0.98 }}
                   onClick={() => handleSelect(opt.score)}
                   className={`w-full text-left p-8 rounded-[40px] border transition-all flex items-center justify-between group relative overflow-hidden ${answers[currentStep] === opt.score ? 'bg-white border-primary shadow-xl shadow-primary/10' : 'bg-white/60 backdrop-blur-sm border-white/80 hover:border-primary/30'}`}
                 >
                   <div className="flex-1 relative z-10">
                      <span className={`text-xl font-black block mb-2 tracking-tight ${answers[currentStep] === opt.score ? 'text-primary' : 'text-gray-900'}`}>{opt.label}</span>
                      <span className="text-sm font-bold text-gray-500/80 leading-relaxed max-w-md block">{opt.description}</span>
                   </div>
                   <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all relative z-10 ${answers[currentStep] === opt.score ? 'bg-primary border-primary text-white scale-110 rotate-12 shadow-lg shadow-primary/30' : 'border-gray-200 text-transparent group-hover:border-primary/30 group-hover:text-primary/30'}`}>
                      <ChevronRight className="w-6 h-6" />
                   </div>
                 </motion.button>
               ))}
            </div>

            {/* Term Tooltip */}
            {currentQuestion.term && (
              <div className="relative">
                <motion.button 
                  onMouseEnter={() => setShowTooltips(true)}
                  onMouseLeave={() => setShowTooltips(false)}
                  className="flex items-center gap-3 group cursor-help mt-8 px-5 py-3 bg-white/30 backdrop-blur-sm rounded-2xl border border-white/50 w-fit"
                >
                   <div className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary">
                      <Info className="w-4 h-4" />
                   </div>
                   <span className="text-xs font-black text-gray-500 uppercase tracking-widest group-hover:text-primary transition-all">
                      Explain {currentQuestion.term}
                   </span>
                </motion.button>
                
                <AnimatePresence>
                  {showTooltips && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-full left-0 mb-6 w-80 p-6 bg-gray-900/95 backdrop-blur-xl rounded-[32px] shadow-2xl z-50 border border-white/10"
                    >
                      <div className="flex items-center gap-3 mb-3">
                         <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-primary" />
                         </div>
                         <h5 className="text-xs font-black text-white uppercase tracking-widest">{currentQuestion.term}</h5>
                      </div>
                      <p className="text-xs text-white/60 font-bold leading-relaxed">
                        {currentQuestion.definition}
                      </p>
                      <div className="absolute -bottom-1.5 left-8 w-3 h-3 bg-gray-900/95 rotate-45 border-r border-b border-white/10" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Reassurance Message */}
            {currentStep % 2 === 1 && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="flex flex-col items-center gap-4 justify-center pt-8"
               >
                  <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-lime-500 animate-pulse" />
                    <span className="text-xs font-black text-gray-400 uppercase tracking-[0.4em]">
                       {REASSURANCES[Math.floor(currentStep / 2)]}
                    </span>
                  </div>
               </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

