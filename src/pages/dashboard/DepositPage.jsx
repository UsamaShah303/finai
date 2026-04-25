import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Zap, Shield, Building, CreditCard,
  Smartphone, CheckCircle, Lock, ArrowRight, Info,
} from 'lucide-react';

const AMOUNTS = [10, 50, 100, 500, 1000];

const METHODS = [
  {
    id: 'bank',
    icon: Building,
    label: 'Bank Transfer',
    sub: 'HBL, UBL, MCB, Allied, Meezan',
    badge: 'Recommended',
    badgeColor: '#22c55e',
    fee: 'Free',
    time: '1–2 business days',
  },
  {
    id: 'jazz',
    icon: Smartphone,
    label: 'JazzCash / Easypaisa',
    sub: 'Mobile wallet',
    badge: 'Instant',
    badgeColor: '#3b82f6',
    fee: '0.5%',
    time: 'Instant',
  },
  {
    id: 'card',
    icon: CreditCard,
    label: 'Debit Card',
    sub: 'Visa / Mastercard',
    badge: null,
    badgeColor: null,
    fee: '1.5%',
    time: 'Instant',
  },
];

export default function DepositPage() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank');
  const [submitted, setSubmitted] = useState(false);

  const numAmount = parseFloat(amount) || 0;
  const selectedMethod = METHODS.find((m) => m.id === method);
  const fee = method === 'jazz' ? numAmount * 0.005 : method === 'card' ? numAmount * 0.015 : 0;
  const total = numAmount + fee;
  const valid = numAmount >= 10;

  const handleSubmit = () => {
    if (!valid) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto animate-slide-up text-center py-8">
        <div className="glass-card p-8">
          <div className="w-20 h-20 rounded-3xl gradient-primary mx-auto mb-5 flex items-center justify-center animate-float">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-black text-surface-900 dark:text-white mb-2">Deposit Initiated!</h2>
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-6">
            Your <strong className="text-surface-700 dark:text-surface-200">${numAmount.toFixed(2)}</strong> deposit via{' '}
            <strong className="text-surface-700 dark:text-surface-200">{selectedMethod.label}</strong> is on its way.
            We'll notify you the moment your portfolio is activated.
          </p>

          <div className="space-y-2 mb-6 text-left">
            {[
              { label: 'Amount sent', value: `$${numAmount.toFixed(2)}` },
              { label: 'Processing fee', value: fee > 0 ? `$${fee.toFixed(2)}` : 'Free' },
              { label: 'ETA', value: selectedMethod.time },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-surface-500">{label}</span>
                <span className="font-semibold text-surface-900 dark:text-white">{value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-bold hover:shadow-lg hover:shadow-primary-500/25 transition-all group text-sm"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/preview')}
              className="text-sm text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 transition-colors py-2"
            >
              Back to portfolio preview
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      {/* Back */}
      <button
        onClick={() => navigate('/preview')}
        className="flex items-center gap-2 text-sm text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to portfolio preview
      </button>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-4 h-4 text-primary-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary-500">Activate Portfolio</span>
        </div>
        <h1 className="text-2xl font-black text-surface-900 dark:text-white">Add Funds</h1>
        <p className="text-sm text-surface-500 mt-1">Minimum deposit is $10. Your portfolio activates instantly on arrival.</p>
      </div>

      {/* Amount */}
      <div className="glass-card p-5 mb-4">
        <label className="block text-sm font-bold text-surface-700 dark:text-surface-300 mb-3">
          How much would you like to deposit?
        </label>

        {/* Quick pick */}
        <div className="flex flex-wrap gap-2 mb-4">
          {AMOUNTS.map((a) => (
            <button
              key={a}
              onClick={() => setAmount(String(a))}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                Number(amount) === a
                  ? 'gradient-primary text-white shadow-md'
                  : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'
              }`}
            >
              ${a}
            </button>
          ))}
        </div>

        {/* Custom input */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 font-bold">$</span>
          <input
            type="number"
            min="10"
            placeholder="Custom amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full pl-8 pr-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white font-bold text-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
          />
        </div>
        {numAmount > 0 && numAmount < 10 && (
          <p className="text-xs text-red-500 mt-2">Minimum deposit is $10</p>
        )}
      </div>

      {/* Payment method */}
      <div className="glass-card p-5 mb-4">
        <label className="block text-sm font-bold text-surface-700 dark:text-surface-300 mb-3">
          Payment method
        </label>
        <div className="space-y-2">
          {METHODS.map((m) => {
            const Icon = m.icon;
            const selected = method === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  selected
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10'
                    : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  selected ? 'gradient-primary' : 'bg-surface-100 dark:bg-surface-800'
                }`}>
                  <Icon className={`w-4 h-4 ${selected ? 'text-white' : 'text-surface-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${selected ? 'text-primary-700 dark:text-primary-300' : 'text-surface-700 dark:text-surface-300'}`}>
                      {m.label}
                    </span>
                    {m.badge && (
                      <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ color: m.badgeColor, backgroundColor: `${m.badgeColor}18` }}>
                        {m.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-surface-400">{m.sub}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-semibold text-surface-700 dark:text-surface-300">{m.fee}</p>
                  <p className="text-xs text-surface-400">{m.time}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      {valid && (
        <div className="glass-card p-4 mb-4 animate-slide-up">
          <p className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-3">Order Summary</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-surface-500">Deposit amount</span>
              <span className="font-semibold text-surface-900 dark:text-white">${numAmount.toFixed(2)}</span>
            </div>
            {fee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Processing fee ({method === 'jazz' ? '0.5%' : '1.5%'})</span>
                <span className="font-semibold text-surface-900 dark:text-white">${fee.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-surface-100 dark:border-surface-800 pt-2 flex justify-between">
              <span className="text-sm font-bold text-surface-900 dark:text-white">Total charged</span>
              <span className="text-sm font-black text-surface-900 dark:text-white">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Security note */}
      <div className="flex items-start gap-2 px-3 py-2 mb-4 rounded-lg bg-surface-50 dark:bg-surface-800/50">
        <Lock className="w-3.5 h-3.5 text-surface-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-surface-400 leading-relaxed">
          Secured with 256-bit encryption. SECP regulated. Your funds are held in a segregated account — FinAI never has direct access.
        </p>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!valid}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl gradient-primary text-white font-bold text-base hover:shadow-xl hover:shadow-primary-500/30 transition-all group disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Shield className="w-5 h-5" />
        {valid ? `Deposit $${numAmount.toFixed(2)} Securely` : 'Enter an amount to continue'}
        {valid && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
      </button>
    </div>
  );
}
