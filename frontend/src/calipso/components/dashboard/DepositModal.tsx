import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Wallet, 
  ChevronRight, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  DollarSign, 
  TrendingUp,
  BrainCircuit,
  Sparkles,
  PieChart
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  riskScore: number;
}

type Step = 'AMOUNT' | 'CONFIRM' | 'INVESTING' | 'SUCCESS';

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, onSuccess, riskScore }) => {
  const [step, setStep] = useState<Step>('AMOUNT');
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<'USD' | 'PKR'>('USD');
  const [loading, setLoading] = useState(false);
  const { updateUser, user } = useAuth();
  
  const presets = currency === 'USD' ? [100, 500, 1000, 5000] : [25000, 50000, 100000, 500000];
  const exchangeRate = 280; // 1 USD = 280 PKR for simulation

  const handleDeposit = async () => {
    setLoading(true);
    const numericAmount = parseFloat(amount);

    setStep('INVESTING');
    await new Promise(resolve => setTimeout(resolve, 2400));

    const currentWallet = user?.wallet || { balance_usd: 112650, balance_pkr: 0 };
    updateUser({
      wallet: {
        balance_usd: currency === 'USD' ? currentWallet.balance_usd + numericAmount : currentWallet.balance_usd,
        balance_pkr: currency === 'PKR' ? currentWallet.balance_pkr + numericAmount : currentWallet.balance_pkr,
      },
      onboardingComplete: true,
    });

    setStep('SUCCESS');
    setLoading(false);
  };

  const getStepProgress = () => {
    switch(step) {
      case 'AMOUNT': return 25;
      case 'CONFIRM': return 50;
      case 'INVESTING': return 75;
      case 'SUCCESS': return 100;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-xl bg-white rounded-[48px] shadow-2xl overflow-hidden min-h-[600px] flex flex-col"
        >
          {/* Header */}
          <div className="p-8 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Wallet className="w-5 h-5" />
               </div>
               <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">Virtual Wallet</h3>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Secure AI Bridge</p>
               </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-8 mb-8">
             <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={false}
                  animate={{ width: `${getStepProgress()}%` }}
                  className="h-full bg-primary" 
                />
             </div>
          </div>

          {/* Body */}
          <div className="flex-1 px-8 pb-10 flex flex-col">
            <AnimatePresence mode="wait">
              {step === 'AMOUNT' && (
                <motion.div
                  key="amount"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <h2 className="text-3xl font-black text-gray-900 mb-2">Set Deposit Amount</h2>
                    <p className="text-gray-500 font-medium">How much would you like to invest through AI?</p>
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="flex justify-center">
                      <div className="inline-flex bg-gray-100 p-1 rounded-2xl">
                        <button 
                          onClick={() => setCurrency('USD')}
                          className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${currency === 'USD' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                        >USD</button>
                        <button 
                          onClick={() => setCurrency('PKR')}
                          className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${currency === 'PKR' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                        >PKR</button>
                      </div>
                    </div>

                    <div className="relative group">
                       <span className="absolute left-8 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-500 group-focus-within:text-primary transition-colors">
                          {currency === 'USD' ? '$' : '₨'}
                       </span>
                       <input 
                         type="number"
                         autoFocus
                         value={amount}
                         onChange={(e) => setAmount(e.target.value)}
                         placeholder="0.00"
                         className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-[32px] py-10 pl-16 pr-8 text-5xl font-black text-gray-900 outline-none transition-all placeholder:text-gray-200"
                       />
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                       {presets.map(p => (
                         <button 
                           key={p}
                           onClick={() => setAmount(p.toString())}
                           className="py-3 bg-white border border-gray-100 rounded-2xl text-xs font-black text-gray-600 hover:border-primary/30 hover:text-primary transition-all shadow-sm"
                         >
                            +{p}
                         </button>
                       ))}
                    </div>

                    {currency === 'PKR' && amount && (
                      <div className="flex items-center justify-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-widest">
                         ≈ ${(parseFloat(amount) / exchangeRate).toFixed(2)} USD
                      </div>
                    )}
                  </div>

                  <button
                    disabled={!amount || parseFloat(amount) <= 0}
                    onClick={() => setStep('CONFIRM')}
                    className="w-full bg-gray-900 text-white py-6 rounded-[28px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-gray-800 transition-all disabled:opacity-50 mt-4 group"
                  >
                    Review Transaction
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </motion.div>
              )}

              {step === 'CONFIRM' && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  <div className="text-center">
                    <h2 className="text-3xl font-black text-gray-900 mb-2">Confirm Deposit</h2>
                    <p className="text-gray-500 font-medium">Verify your investment details</p>
                  </div>

                  <div className="bg-gray-50 rounded-[40px] p-8 space-y-6">
                     <div className="flex justify-between items-center pb-6 border-b border-gray-200/60">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Amount</span>
                        <span className="text-3xl font-black text-gray-900">
                          {currency === 'USD' ? '$' : '₨'}{parseFloat(amount).toLocaleString()}
                        </span>
                     </div>
                     <div className="flex justify-between items-center pb-6 border-b border-gray-200/60">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Strategy</span>
                        <span className="flex items-center gap-2 text-gray-900 font-black">
                           <ShieldCheck className="w-4 h-4 text-primary" />
                           Optimized Growth
                        </span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Target</span>
                        <span className="text-gray-900 font-black">AI Managed Portfolio</span>
                     </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <button
                      onClick={handleDeposit}
                      className="w-full bg-primary text-white py-6 rounded-[28px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl shadow-primary/20"
                    >
                      Authorize & Invest
                      <Zap className="w-4 h-4 fill-white" />
                    </button>
                    <button
                      onClick={() => setStep('AMOUNT')}
                      className="w-full text-gray-500 py-4 font-black uppercase tracking-widest text-[10px] hover:text-gray-900 transition-all"
                    >
                      Back to edit
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'INVESTING' && (
                <motion.div
                  key="investing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20"
                >
                  <div className="relative mb-12">
                    <motion.div 
                       animate={{ rotate: 360 }}
                       transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                       className="w-48 h-48 rounded-full border-2 border-dashed border-primary/30"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <motion.div
                         animate={{ scale: [1, 1.1, 1] }}
                         transition={{ duration: 2, repeat: Infinity }}
                         className="w-32 h-32 bg-primary flex items-center justify-center rounded-[40px] shadow-2xl shadow-primary/40"
                       >
                          <BrainCircuit className="w-16 h-16 text-white" />
                       </motion.div>
                    </div>
                    {/* Animated Particles */}
                    <div className="absolute inset-0">
                       {[...Array(6)].map((_, i) => (
                         <motion.div
                           key={i}
                           animate={{ 
                             x: Math.cos(i * 60 * Math.PI / 180) * 80,
                             y: Math.sin(i * 60 * Math.PI / 180) * 80,
                             opacity: [0, 1, 0]
                           }}
                           transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                           className="absolute top-1/2 left-1/2 w-2 h-2 bg-primary rounded-full"
                         />
                       ))}
                    </div>
                  </div>

                  <div className="text-center space-y-3">
                     <h2 className="text-3xl font-black text-gray-900">AI At Work</h2>
                     <div className="flex flex-col gap-2">
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="text-gray-500 font-bold"
                        >Processing order via global bridge...</motion.p>
                        <div className="flex items-center justify-center gap-6 mt-4">
                           <div className="flex flex-col items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                                 <Sparkles className="w-4 h-4" />
                              </div>
                              <span className="text-[10px] font-black uppercase text-gray-300">Cleaning</span>
                           </div>
                           <ChevronRight className="w-4 h-4 text-gray-200" />
                           <div className="flex flex-col items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                                 <PieChart className="w-4 h-4" />
                              </div>
                              <span className="text-[10px] font-black uppercase text-gray-300">Allocating</span>
                           </div>
                           <ChevronRight className="w-4 h-4 text-gray-200" />
                           <div className="flex flex-col items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                 <TrendingUp className="w-4 h-4" />
                              </div>
                              <span className="text-[10px] font-black uppercase text-primary">Executing</span>
                           </div>
                        </div>
                     </div>
                  </div>
                </motion.div>
              )}

              {step === 'SUCCESS' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center space-y-8 py-10"
                >
                  <div className="w-24 h-24 bg-emerald-500 rounded-[32px] flex items-center justify-center text-white shadow-2xl shadow-emerald-500/30 mb-4">
                     <CheckCircle2 className="w-12 h-12" />
                  </div>
                  
                  <div>
                    <h2 className="text-4xl font-black text-gray-900 mb-2">Investment Active!</h2>
                    <p className="text-gray-500 font-medium max-w-[280px] mx-auto">
                      Your {currency === 'USD' ? '$' : '₨'}{amount} has been successfully deployed.
                    </p>
                  </div>

                  <div className="bg-emerald-50 rounded-[32px] p-8 w-full border border-emerald-100/50">
                     <div className="flex items-center justify-between font-black text-emerald-900">
                        <span className="text-xs uppercase tracking-widest">New Balance</span>
                        <span className="text-2xl">
                          {currency === 'USD' 
                            ? `$${user?.wallet?.balance_usd.toLocaleString()}` 
                            : `₨${user?.wallet?.balance_pkr.toLocaleString()}`}
                        </span>
                     </div>
                  </div>

                  <button
                    onClick={() => {
                      onSuccess();
                      onClose();
                    }}
                    className="w-full bg-gray-900 text-white py-6 rounded-[28px] font-black uppercase tracking-widest text-xs"
                  >
                    Done
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
