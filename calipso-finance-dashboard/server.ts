import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const JWT_SECRET = 'calipso-secret-key-123';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock database
  const users: any[] = [];
  const transactions: any[] = [];
  let virtualHoldings = [
    { symbol: 'VEA', avg_buy_price: 52.40, current_price: 48.05, shares: 100, market: 'US', currency: 'USD' },
    { symbol: 'VTI', avg_buy_price: 240.00, current_price: 245.50, shares: 10, market: 'US', currency: 'USD' },
    { symbol: 'OGDC', avg_buy_price: 155.00, current_price: 142.00, shares: 500, market: 'PK', currency: 'PKR' },
  ];

  const REPLACEMENTS: Record<string, string> = {
    "VTI": "SCHB",
    "VOO": "IVV",
    "VEA": "IEFA",
    "BND": "AGG",
    "GLD": "IAU",
    "OGDC": "PPL",
    "ENGRO": "FATIMA",
    "LUCK": "DGKC",
    "HBL": "MCB",
  };

  const getReplacement = (symbol: string) => REPLACEMENTS[symbol.toUpperCase()] || null;

  const PKR_USD_RATE = 280;

  const calculateTaxSaving = (lossAmount: number, market: string) => {
    // Pakistani capital gains tax rates
    // Held less than 1 year = 15% CGT
    const taxRate = 0.15; 
    return {
      loss_amount: Math.round(lossAmount * 100) / 100,
      tax_rate_pct: taxRate * 100,
      simulated_tax_saved: Math.round(lossAmount * taxRate * 100) / 100,
      pkr_loss: Math.round(lossAmount * PKR_USD_RATE),
      pkr_tax_saved: Math.round(lossAmount * taxRate * PKR_USD_RATE)
    };
  };

  app.get('/api/tax-loss/opportunities', (req, res) => {
    const opportunities = virtualHoldings
      .map(h => {
        const loss = (h.current_price - h.avg_buy_price) * h.shares;
        const lossPct = ((h.current_price - h.avg_buy_price) / h.avg_buy_price) * 100;
        
        if (lossPct < -5) {
          const taxSaving = calculateTaxSaving(Math.abs(loss), h.market);
          return {
            symbol: h.symbol,
            avg_buy_price: h.avg_buy_price,
            current_price: h.current_price,
            loss_amount: Math.abs(loss),
            loss_pct: Math.abs(lossPct),
            shares: h.shares,
            replacement: getReplacement(h.symbol),
            market: h.market,
            pkr_loss: taxSaving.pkr_loss,
            pkr_tax_saved: taxSaving.pkr_tax_saved
          };
        }
        return null;
      })
      .filter(Boolean);

    res.json(opportunities);
  });

  // --- Auth Middleware ---
  const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const user = users.find(u => u.id === decoded.id);
      if (!user) return res.status(401).json({ error: 'User session expired or invalid' });
      
      (req as any).user = user;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };

  // --- Auth Routes ---
  app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, country } = req.body;
    
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password: hashedPassword,
      country,
      onboardingComplete: false,
      wallet: {
        balance_usd: 0,
        balance_pkr: 0
      }
    };

    users.push(newUser);
    
    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '1d' });
    
    // Don't send password back
    const { password: _, ...userWithoutPassword } = newUser;
    res.json({ token, user: userWithoutPassword });
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
    
    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  });

  app.get('/api/auth/me', authenticate, (req, res) => {
    const user = (req as any).user;
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // --- Wallet & Investing Routes ---
  app.get('/api/wallet/balance', authenticate, (req, res) => {
    const user = (req as any).user;
    res.json(user.wallet);
  });

  app.post('/api/wallet/deposit', authenticate, (req, res) => {
    const { amount, currency } = req.body;
    const user = (req as any).user;
    
    if (currency === 'USD') user.wallet.balance_usd += amount;
    else user.wallet.balance_pkr += amount;

    const transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      type: 'DEPOSIT',
      amount,
      currency,
      timestamp: new Date().toISOString(),
      status: 'COMPLETED'
    };
    transactions.push(transaction);

    res.json({ wallet: user.wallet, transaction });
  });

  app.get('/api/wallet/transactions', authenticate, (req, res) => {
    const user = (req as any).user;
    const userTransactions = transactions.filter(t => t.userId === user.id);
    res.json(userTransactions);
  });

  app.post('/api/invest/auto', authenticate, (req, res) => {
    const { amount, currency, riskScore } = req.body;
    const user = (req as any).user;

    // Deduct from wallet
    if (currency === 'USD') {
      if (user.wallet.balance_usd < amount) return res.status(400).json({ error: 'Insufficient funds' });
      user.wallet.balance_usd -= amount;
    } else {
      if (user.wallet.balance_pkr < amount) return res.status(400).json({ error: 'Insufficient funds' });
      user.wallet.balance_pkr -= amount;
    }

    const transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      type: 'INVESTMENT',
      amount,
      currency,
      timestamp: new Date().toISOString(),
      status: 'COMPLETED'
    };
    transactions.push(transaction);

    res.json({ 
      success: true, 
      message: 'AI Portfolio successfully deployed',
      wallet: user.wallet,
      transaction
    });
  });

  app.post('/api/optimize', (req, res) => {
    const { amount, riskScore } = req.body;
    
    // Simple logic based on risk score (0-100)
    const isAggressive = riskScore > 60;
    const isModerate = riskScore > 30 && riskScore <= 60;
    
    let allocations = [];
    let expectedReturn = "";
    let esgScore = 0;

    if (isAggressive) {
      allocations = [
        { symbol: 'VTI', name: 'US Total Stock Market', weight: 0.5, category: 'ETF' },
        { symbol: 'VEA', name: 'Developed Markets', weight: 0.2, category: 'ETF' },
        { symbol: 'LUCK', name: 'Lucky Cement', weight: 0.15, category: 'PSX Stock' },
        { symbol: 'OGDC', name: 'Oil & Gas Dev', weight: 0.15, category: 'PSX Stock' }
      ];
      expectedReturn = "12% - 15%";
      esgScore = 78;
    } else if (isModerate) {
      allocations = [
        { symbol: 'VTI', name: 'US Total Stock Market', weight: 0.3, category: 'ETF' },
        { symbol: 'BND', name: 'Total Bond Market', weight: 0.4, category: 'ETF' },
        { symbol: 'HBL', name: 'Habib Bank', weight: 0.15, category: 'PSX Stock' },
        { symbol: 'ENGRO', name: 'Engro Corp', weight: 0.15, category: 'PSX Stock' }
      ];
      expectedReturn = "8% - 10%";
      esgScore = 85;
    } else {
      allocations = [
        { symbol: 'BND', name: 'Total Bond Market', weight: 0.7, category: 'ETF' },
        { symbol: 'MCB', name: 'MCB Bank', weight: 0.15, category: 'PSX Stock' },
        { symbol: 'FATIMA', name: 'Fatima Fertilizer', weight: 0.15, category: 'PSX Stock' }
      ];
      expectedReturn = "5% - 7%";
      esgScore = 92;
    }

    const holdings = allocations.map(a => ({
      ...a,
      amount: amount * a.weight
    }));

    res.json({
      holdings,
      expectedReturn,
      esgScore,
      totalAmount: amount
    });
  });

  app.get('/api/auth/profile', authenticate, (req, res) => {
    const user = (req as any).user;
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });


  app.post('/api/tax-loss-harvest', (req, res) => {
    const { symbol } = req.body;
    const holdingIndex = virtualHoldings.findIndex(h => h.symbol === symbol);

    if (holdingIndex === -1) {
      return res.status(404).json({ error: "Holding not found" });
    }

    const holding = virtualHoldings[holdingIndex];
    const loss = (holding.current_price - holding.avg_buy_price) * holding.shares;
    const replacement = getReplacement(symbol);

    if (!replacement) {
      return res.status(400).json({ error: "No replacement asset found" });
    }

    // Simulate sell
    virtualHoldings.splice(holdingIndex, 1);

    // Simulate buy replacement
    const replacementPrice = holding.current_price * 0.98; 
    const investedAmount = holding.current_price * holding.shares;
    const newShares = investedAmount / replacementPrice;

    virtualHoldings.push({
      symbol: replacement,
      shares: newShares,
      avg_buy_price: replacementPrice,
      current_price: replacementPrice,
      market: holding.market,
      currency: holding.currency
    });

    const taxSaving = calculateTaxSaving(Math.abs(loss), holding.market);

    res.json({
      message: "Smart loss strategy simulated",
      sold: symbol,
      bought: replacement,
      loss_harvested: Math.abs(loss),
      pkr_loss: taxSaving.pkr_loss,
      tax_saved: taxSaving.simulated_tax_saved,
      pkr_tax_saved: taxSaving.pkr_tax_saved,
      new_holding: replacement,
    });
  });

  // AI Explainer logic (translated from Python SHAP logic requested)
  // This simulates the SHAP calculation by applying weights to user factors
  app.get('/api/shap/:symbol', (req, res) => {
    const { symbol } = req.params;
    
    // In a real app, we'd get user answers from a database/JWT
    // Mock user profile for now (Moderately aggressive, long horizon, high income)
    // const mockUserAnswers = [3, 4, 3, 5, 2, 1, 2, 4, 3, 4];
    
    interface Factor {
      key: string;
      title: string;
      desc: string;
      ur: string;
      value: number;
      direction: 'positive' | 'concern' | 'negative';
      icon: string;
    }

    const FACTOR_MAP: Record<string, any> = {
      investment_horizon: {
        icon: "📅",
        positive: {
          title: "You plan to invest for a long time",
          desc: "Long term investing gives your money time to grow through market ups and downs. This strongly suits growth investments.",
          ur: "آپ طویل مدت کے لیے سرمایہ کاری کرنا چاہتے ہیں — یہ ترقی کی سرمایہ کاری کے لیے بہت موزوں ہے"
        },
        negative: {
          title: "You need this money soon",
          desc: "Short time horizons mean less time to recover from market drops. Growth assets carry more risk for you.",
          ur: "آپ کو جلد پیسے چاہییں — مارکیٹ گرنے سے سنبھلنے کا وقت کم ہے"
        }
      },
      loss_reaction: {
        icon: "💪",
        positive: {
          title: "You stay calm when markets drop",
          desc: "You said you would hold or buy more during a drop. This patience is exactly what growth investing requires.",
          ur: "آپ مارکیٹ گرنے پر صبر کرتے ہیں — یہ ترقی کی سرمایہ کاری کے لیے ضروری ہے"
        },
        negative: {
          title: "Market drops make you nervous",
          desc: "You prefer to sell when markets fall. High volatility assets may cause stress for you.",
          ur: "مارکیٹ گرنے پر آپ فروخت کرنا چاہتے ہیں — زیادہ اتار چڑھاؤ آپ کو پریشان کر سکتا ہے"
        }
      },
      emergency_fund: {
        icon: "🛡️",
        positive: {
          title: "You have emergency savings",
          desc: "Having 3-6 months expenses saved means you will not need to sell investments in an emergency. This protects your portfolio.",
          ur: "آپ کے پاس ایمرجنسی فنڈ ہے — یعنی مشکل وقت میں سرمایہ کاری بیچنی نہیں پڑے گی"
        },
        negative: {
          title: "You do not have emergency savings yet",
          desc: "Without an emergency fund you may need to sell investments at a bad time. We recommend building this first.",
          ur: "ابھی ایمرجنسی فنڈ نہیں ہے — پہلے یہ بنانا بہتر ہے"
        }
      },
      income: {
        icon: "💰",
        positive: {
          title: "Your income supports regular investing",
          desc: "Your monthly income allows consistent investment which builds wealth steadily over time.",
          ur: "آپ کی آمدن باقاعدہ سرمایہ کاری کی اجازت دیتی ہے"
        },
        negative: {
          title: "Limited monthly investment capacity",
          desc: "Lower monthly investment means slower portfolio growth. Consider increasing gradually as income grows.",
          ur: "ماہانہ سرمایہ کاری محدود ہے — آمدن بڑھنے کے ساتھ بڑھائیں"
        }
      },
      esg: {
        icon: "🌱",
        positive: {
          title: "This asset scores well on ethical investing",
          desc: "High ESG score means the company treats employees well, protects the environment and is managed honestly.",
          ur: "یہ کمپنی ملازمین، ماحول اور ایمانداری میں اچھی ہے"
        },
        negative: {
          title: "This asset has a lower ethical score",
          desc: "Lower ESG means the company may have environmental or governance concerns. Still included for performance.",
          ur: "اس کمپنی کا اخلاقی اسکور کم ہے لیکن کارکردگی کے لیے شامل ہے"
        }
      },
      currency: {
        icon: "💱",
        concern: {
          title: "This investment is priced in US Dollars",
          desc: "When PKR weakens against USD your returns in rupees improve. When PKR strengthens your returns may be lower.",
          ur: "یہ سرمایہ کاری ڈالر میں ہے — روپیہ کمزور ہو تو منافع بڑھے، مضبوط ہو تو کم ہو"
        }
      },
      volatility: {
        icon: "📊",
        concern: {
          title: "This investment goes up and down more than bonds",
          desc: "Stocks like VTI can drop 20-30% in bad years before recovering. This is normal and expected for long term gains.",
          ur: "یہ بانڈز سے زیادہ اوپر نیچے جاتا ہے — مختصر مدت میں نقصان ممکن ہے لیکن طویل مدت میں فائدہ ہوتا ہے"
        }
      }
    };

    const generateFactors = (sym: string): Factor[] => {
      const isIntl = ['VTI', 'BND'].includes(sym.toUpperCase());
      const factors: Factor[] = [];

      // Positive factors
      const p1 = FACTOR_MAP.investment_horizon.positive;
      factors.push({ key: 'investment_horizon', ...p1, value: 0.34, direction: 'positive', icon: FACTOR_MAP.investment_horizon.icon });
      
      const p2 = FACTOR_MAP.loss_reaction.positive;
      factors.push({ key: 'loss_reaction', ...p2, value: 0.28, direction: 'positive', icon: FACTOR_MAP.loss_reaction.icon });

      const p3 = FACTOR_MAP.emergency_fund.positive;
      factors.push({ key: 'emergency_fund', ...p3, value: 0.18, direction: 'positive', icon: FACTOR_MAP.emergency_fund.icon });

      // Concerns
      if (isIntl) {
        const c1 = FACTOR_MAP.currency.concern;
        factors.push({ key: 'currency', ...c1, value: 0.12, direction: 'concern', icon: FACTOR_MAP.currency.icon });
      }

      const c2 = FACTOR_MAP.volatility.concern;
      factors.push({ key: 'volatility', ...c2, value: 0.08, direction: 'concern', icon: FACTOR_MAP.volatility.icon });

      return factors;
    };

    const finalFactors = generateFactors(symbol);
    const confidence = symbol.toUpperCase() === 'VTI' ? 87 : Math.floor(Math.random() * (90 - 60) + 60);

    const topPositive = finalFactors.find(f => f.direction === 'positive')?.title || "";
    const topConcern = finalFactors.find(f => f.direction === 'concern')?.title || "";

    const summary_ur = `${symbol} آپ کے لیے اس لیے تجویز کیا گیا کیونکہ ${topPositive}۔ ایک بات ذہن میں رکھیں: ${topConcern}۔ مجموعی طور پر یہ آپ کی سرمایہ کاری کی ضروریات کے ساتھ اچھی طرح میل کھاتا ہے۔`;

    res.json({
      symbol: symbol.toUpperCase(),
      confidence,
      factors: finalFactors,
      summary: symbol.toUpperCase() === 'VTI' 
        ? "VTI was recommended mainly because your long investment horizon and moderate risk tolerance make broad US equity a strong fit. Its high ESG score also matched your sustainability preference. The main concern is its higher volatility compared to bonds."
        : `This asset is a ${confidence > 75 ? 'strong' : 'moderate'} match for your profile. It aligns with your long-term goals.`,
      summary_ur,
      what_if: [
        {
          scenario: "If your risk tolerance was lower",
          impact: `${symbol.toUpperCase()} allocation would drop significantly and be replaced by defensive assets.`
        },
        {
          scenario: "If your time horizon was shorter",
          impact: `${symbol.toUpperCase()} would be removed entirely and replaced with money market funds.`
        }
      ]
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Statics for production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
