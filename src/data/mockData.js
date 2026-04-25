// Portfolio allocation data
export const portfolioData = {
  pakistan: [
    { name: 'Pakistan Stocks (PSX)', value: 35, color: '#3b82f6', ticker: 'PSX-100' },
    { name: 'Pakistan Bonds', value: 25, color: '#22c55e', ticker: 'PIB-10Y' },
    { name: 'Gold (PKR)', value: 15, color: '#f59e0b', ticker: 'GOLD-PK' },
    { name: 'Real Estate (REIT)', value: 15, color: '#8b5cf6', ticker: 'JSCL' },
    { name: 'Cash (PKR)', value: 10, color: '#64748b', ticker: 'CASH-PK' },
  ],
  international: [
    { name: 'US Stocks (S&P 500)', value: 30, color: '#3b82f6', ticker: 'SPY' },
    { name: 'International Stocks', value: 20, color: '#06b6d4', ticker: 'VXUS' },
    { name: 'US Bonds', value: 20, color: '#22c55e', ticker: 'BND' },
    { name: 'Emerging Markets', value: 10, color: '#f59e0b', ticker: 'VWO' },
    { name: 'Gold', value: 10, color: '#eab308', ticker: 'GLD' },
    { name: 'REITs', value: 10, color: '#8b5cf6', ticker: 'VNQ' },
  ],
  both: [
    { name: 'US Stocks (S&P 500)', value: 22, color: '#3b82f6', ticker: 'SPY' },
    { name: 'Pakistan Stocks (PSX)', value: 18, color: '#06b6d4', ticker: 'PSX-100' },
    { name: 'International Stocks', value: 12, color: '#6366f1', ticker: 'VXUS' },
    { name: 'Bonds (Mixed)', value: 18, color: '#22c55e', ticker: 'BND/PIB' },
    { name: 'Gold', value: 12, color: '#f59e0b', ticker: 'GLD' },
    { name: 'Emerging Markets', value: 8, color: '#eab308', ticker: 'VWO' },
    { name: 'REITs', value: 5, color: '#8b5cf6', ticker: 'VNQ/JSCL' },
    { name: 'Cash', value: 5, color: '#64748b', ticker: 'CASH' },
  ],
};

// Wealth summary
export const wealthSummary = {
  totalWealth: 2847500,
  currency: 'USD',
  change24h: 1.8,
  changeAmount: 50455,
  invested: 2200000,
  returns: 647500,
  returnPct: 29.4,
};

// Paycheck split recommendation
export const paycheckSplit = {
  monthlyIncome: 8500,
  needs: 50,
  wants: 20,
  savings: 15,
  investments: 15,
  aiRecommendation: {
    needs: 45,
    wants: 15,
    savings: 20,
    investments: 20,
    reason: 'Based on your goal timeline and risk profile, allocating more to investments and savings accelerates your wealth growth while maintaining a comfortable lifestyle buffer.',
  },
};

// Goals data
export const goalsData = [
  {
    id: '1',
    name: 'Emergency Fund',
    target: 25000,
    current: 18750,
    deadline: '2025-06-30',
    icon: '🛡️',
    successProbability: 94,
    priority: 'high',
  },
  {
    id: '2',
    name: 'Dream Home Down Payment',
    target: 120000,
    current: 42000,
    deadline: '2028-12-31',
    icon: '🏠',
    successProbability: 78,
    priority: 'high',
  },
  {
    id: '3',
    name: 'Retirement Fund',
    target: 1500000,
    current: 285000,
    deadline: '2055-01-01',
    icon: '🏖️',
    successProbability: 88,
    priority: 'medium',
  },
  {
    id: '4',
    name: 'Children Education',
    target: 200000,
    current: 35000,
    deadline: '2040-09-01',
    icon: '🎓',
    successProbability: 82,
    priority: 'medium',
  },
  {
    id: '5',
    name: 'Dream Vacation',
    target: 15000,
    current: 9800,
    deadline: '2025-12-01',
    icon: '✈️',
    successProbability: 91,
    priority: 'low',
  },
];

// ESG Score
export const esgData = {
  overall: 76,
  environmental: 82,
  social: 71,
  governance: 75,
  breakdown: [
    { category: 'Carbon Footprint', score: 85, icon: '🌍' },
    { category: 'Clean Energy Investment', score: 78, icon: '⚡' },
    { category: 'Diversity & Inclusion', score: 72, icon: '🤝' },
    { category: 'Board Independence', score: 80, icon: '🏛️' },
    { category: 'Supply Chain Ethics', score: 68, icon: '🔗' },
    { category: 'Data Privacy', score: 74, icon: '🔒' },
  ],
};

// Market sentiment
export const sentimentData = [
  { asset: 'S&P 500', sentiment: 'Positive', score: 78, emoji: '📈', color: '#22c55e' },
  { asset: 'PSX KSE-100', sentiment: 'Positive', score: 72, emoji: '📊', color: '#22c55e' },
  { asset: 'Gold', sentiment: 'Neutral', score: 55, emoji: '⚖️', color: '#f59e0b' },
  { asset: 'Bitcoin', sentiment: 'Negative', score: 35, emoji: '📉', color: '#ef4444' },
  { asset: 'Oil (Brent)', sentiment: 'Neutral', score: 48, emoji: '⚖️', color: '#f59e0b' },
  { asset: 'US Bonds', sentiment: 'Positive', score: 65, emoji: '📈', color: '#22c55e' },
];

// Backtesting data
export const backtestData = Array.from({ length: 37 }, (_, i) => {
  const date = new Date(2023, 0 + i, 1);
  const month = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  const aiBase = 100000 * (1 + 0.012 * i + Math.sin(i * 0.3) * 2000 / 100000);
  const benchBase = 100000 * (1 + 0.008 * i + Math.sin(i * 0.5) * 3000 / 100000);
  return {
    month,
    ai: Math.round(aiBase + Math.random() * 2000),
    benchmark: Math.round(benchBase + Math.random() * 1500),
  };
});

// Portfolio comparison
export const comparisonMetrics = [
  { metric: 'Total Return', ai: 44.2, sp500: 36.8, kse100: 28.5, equalWeight: 32.1 },
  { metric: 'Annualized Return', ai: 14.7, sp500: 12.3, kse100: 9.5, equalWeight: 10.7 },
  { metric: 'Sharpe Ratio', ai: 1.42, sp500: 1.18, kse100: 0.85, equalWeight: 0.94 },
  { metric: 'Max Drawdown', ai: -8.2, sp500: -12.5, kse100: -18.3, equalWeight: -14.7 },
];

export const performanceData = Array.from({ length: 37 }, (_, i) => {
  const date = new Date(2023, 0 + i, 1);
  const month = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  return {
    month,
    ai: Math.round(100 * (1 + 0.012 * i + Math.sin(i * 0.3) * 0.02)),
    sp500: Math.round(100 * (1 + 0.009 * i + Math.sin(i * 0.5) * 0.025)),
    kse100: Math.round(100 * (1 + 0.007 * i + Math.sin(i * 0.4) * 0.03)),
    equalWeight: Math.round(100 * (1 + 0.008 * i + Math.sin(i * 0.35) * 0.02)),
  };
});

// Risk assessment quiz
export const quizQuestions = [
  {
    id: 1,
    question: "Imagine you just received a surprise bonus of $10,000. What would you do?",
    options: [
      { text: "Put it all in a savings account – safety first!", emoji: "🏦", score: 1 },
      { text: "Save most, invest a little bit", emoji: "📊", score: 2 },
      { text: "Split it 50/50 between savings and investments", emoji: "⚖️", score: 3 },
      { text: "Invest most of it for long-term growth", emoji: "📈", score: 4 },
      { text: "Go all-in on the stock market!", emoji: "🚀", score: 5 },
    ],
  },
  {
    id: 2,
    question: "Your investment drops 20% in one month. What do you do?",
    options: [
      { text: "Sell everything immediately – I can't handle this!", emoji: "😰", score: 1 },
      { text: "Sell some to reduce my risk", emoji: "😟", score: 2 },
      { text: "Do nothing and wait it out", emoji: "😐", score: 3 },
      { text: "Think about buying more at a discount", emoji: "🤔", score: 4 },
      { text: "Buy more – this is a great opportunity!", emoji: "🤑", score: 5 },
    ],
  },
  {
    id: 3,
    question: "When do you plan to use this money?",
    options: [
      { text: "Within the next year", emoji: "📅", score: 1 },
      { text: "In 1-3 years", emoji: "🗓️", score: 2 },
      { text: "In 3-7 years", emoji: "📆", score: 3 },
      { text: "In 7-15 years", emoji: "⏳", score: 4 },
      { text: "15+ years from now – I'm playing the long game", emoji: "🏔️", score: 5 },
    ],
  },
  {
    id: 4,
    question: "Which roller coaster would you choose?",
    options: [
      { text: "The kiddie ride – smooth and gentle", emoji: "🎠", score: 1 },
      { text: "A small coaster with a few bumps", emoji: "🎢", score: 2 },
      { text: "A medium thrill ride", emoji: "🎡", score: 3 },
      { text: "A big coaster with loops!", emoji: "🎪", score: 4 },
      { text: "The scariest ride in the park!", emoji: "💀", score: 5 },
    ],
  },
  {
    id: 5,
    question: "How much of your monthly income can you invest without affecting your lifestyle?",
    options: [
      { text: "Less than 5% – money is tight", emoji: "💰", score: 1 },
      { text: "5-10% – a little goes a long way", emoji: "💵", score: 2 },
      { text: "10-20% – I can be disciplined", emoji: "📊", score: 3 },
      { text: "20-30% – I live below my means", emoji: "🏦", score: 4 },
      { text: "30%+ – I'm a super saver!", emoji: "🦸", score: 5 },
    ],
  },
  {
    id: 6,
    question: "You're at a restaurant. How do you order?",
    options: [
      { text: "I always order my favorite dish – why risk it?", emoji: "🍕", score: 1 },
      { text: "Usually my go-to, but sometimes I try something new", emoji: "🍝", score: 2 },
      { text: "I check the specials and pick something interesting", emoji: "🍱", score: 3 },
      { text: "I love trying dishes I've never heard of", emoji: "🍜", score: 4 },
      { text: "Chef's surprise – bring me whatever!", emoji: "🎲", score: 5 },
    ],
  },
  {
    id: 7,
    question: "How would you feel if your investments went to zero?",
    options: [
      { text: "Devastating – it would ruin my finances", emoji: "💔", score: 1 },
      { text: "Very stressful – it would seriously hurt", emoji: "😢", score: 2 },
      { text: "Upset but manageable – I have other savings", emoji: "😕", score: 3 },
      { text: "Disappointed but not the end of the world", emoji: "🤷", score: 4 },
      { text: "Fine – I only invest what I can afford to lose", emoji: "💪", score: 5 },
    ],
  },
  {
    id: 8,
    question: "Which best describes your experience with investing?",
    options: [
      { text: "Complete beginner – I've never invested", emoji: "🌱", score: 1 },
      { text: "I've heard about stocks but never bought any", emoji: "📖", score: 2 },
      { text: "I have some experience with basic investments", emoji: "📚", score: 3 },
      { text: "I'm comfortable with stocks, bonds, and ETFs", emoji: "🎓", score: 4 },
      { text: "I'm an experienced investor – options, crypto, you name it", emoji: "🧠", score: 5 },
    ],
  },
  {
    id: 9,
    question: "A friend asks you to invest in their startup. What do you think?",
    options: [
      { text: "No way – too risky for me", emoji: "🚫", score: 1 },
      { text: "Maybe a very small amount to be supportive", emoji: "🤏", score: 2 },
      { text: "I'd research it first, then decide", emoji: "🔍", score: 3 },
      { text: "Sounds exciting – I'd invest a decent amount", emoji: "💡", score: 4 },
      { text: "All in! High risk, high reward!", emoji: "🚀", score: 5 },
    ],
  },
  {
    id: 10,
    question: "What's your main financial goal right now?",
    options: [
      { text: "Protect what I have – don't lose money", emoji: "🛡️", score: 1 },
      { text: "Grow my savings slowly and safely", emoji: "🌿", score: 2 },
      { text: "Balance between growth and safety", emoji: "⚖️", score: 3 },
      { text: "Grow my wealth significantly over time", emoji: "📈", score: 4 },
      { text: "Maximize returns – I want aggressive growth!", emoji: "🔥", score: 5 },
    ],
  },
];

// Monte Carlo forecast
export const forecastData = Array.from({ length: 121 }, (_, i) => {
  const month = i;
  const year = (month / 12).toFixed(1);
  const base = 284750;
  const growth = base * Math.pow(1.007, month);
  return {
    month: i % 12 === 0 ? `Year ${Math.floor(i / 12)}` : '',
    year: Math.floor(i / 12),
    p10: Math.round(growth * (0.6 + Math.random() * 0.05)),
    p25: Math.round(growth * (0.8 + Math.random() * 0.03)),
    median: Math.round(growth * (1 + Math.random() * 0.02)),
    p75: Math.round(growth * (1.25 + Math.random() * 0.04)),
    p90: Math.round(growth * (1.55 + Math.random() * 0.06)),
  };
}).filter((_, i) => i % 3 === 0);

// News sentiment data
export const newsData = [
  {
    id: 1,
    title: "Federal Reserve Signals Potential Rate Cut in Q3 2026",
    source: "Reuters",
    time: "2 hours ago",
    sentiment: "Positive",
    score: 82,
    summary: "Fed Chair indicates easing monetary policy as inflation cools, boosting equity markets outlook.",
    impact: "Stocks, Bonds",
  },
  {
    id: 2,
    title: "PSX KSE-100 Hits All-Time High Amid Strong Corporate Earnings",
    source: "Business Recorder",
    time: "4 hours ago",
    sentiment: "Positive",
    score: 88,
    summary: "Pakistan stock exchange surges as leading companies report record quarterly earnings.",
    impact: "PSX Stocks",
  },
  {
    id: 3,
    title: "Oil Prices Fluctuate on OPEC+ Production Uncertainty",
    source: "Bloomberg",
    time: "6 hours ago",
    sentiment: "Neutral",
    score: 50,
    summary: "Brent crude hovers around $78 as markets await OPEC+ meeting outcome.",
    impact: "Commodities",
  },
  {
    id: 4,
    title: "Tech Sector Faces Headwinds as AI Regulation Looms",
    source: "Financial Times",
    time: "8 hours ago",
    sentiment: "Negative",
    score: 32,
    summary: "New regulatory frameworks proposed in EU and US could impact AI-heavy tech valuations.",
    impact: "Tech Stocks",
  },
  {
    id: 5,
    title: "Gold Prices Steady as Global Uncertainty Persists",
    source: "CNBC",
    time: "10 hours ago",
    sentiment: "Neutral",
    score: 55,
    summary: "Safe-haven demand keeps gold prices supported near recent highs.",
    impact: "Gold, Commodities",
  },
  {
    id: 6,
    title: "Pakistan Cement Sector Shows Strong Recovery Signals",
    source: "Dawn Business",
    time: "12 hours ago",
    sentiment: "Positive",
    score: 75,
    summary: "Infrastructure spending boost drives cement demand, lifting sector valuations.",
    impact: "PSX Industrials",
  },
];

// Asset breakdown for portfolio page
export const assetBreakdown = [
  { name: 'Vanguard S&P 500 ETF', ticker: 'VOO', allocation: 22, value: 626450, change: 2.3, drift: 1.2 },
  { name: 'Pakistan KSE-100 ETF', ticker: 'PSX-ETF', allocation: 18, value: 512550, change: 1.8, drift: -0.5 },
  { name: 'Vanguard Total Intl', ticker: 'VXUS', allocation: 12, value: 341700, change: -0.4, drift: 0.3 },
  { name: 'Aggregate Bond Fund', ticker: 'BND', allocation: 18, value: 512550, change: 0.2, drift: -1.8 },
  { name: 'SPDR Gold Shares', ticker: 'GLD', allocation: 12, value: 341700, change: 1.1, drift: 2.1 },
  { name: 'Emerging Markets ETF', ticker: 'VWO', allocation: 8, value: 227800, change: -0.8, drift: -0.4 },
  { name: 'Vanguard Real Estate', ticker: 'VNQ', allocation: 5, value: 142375, change: 0.5, drift: 0.7 },
  { name: 'Cash Reserve', ticker: 'CASH', allocation: 5, value: 142375, change: 0.0, drift: -5.2 },
];

// Admin data
export const adminKPIs = {
  totalUsers: 12847,
  activeUsers: 3421,
  activeSessions: 892,
  totalAUM: 284750000,
  avgPortfolioSize: 22150,
  platformStatus: 'Operational',
  lastUpdated: '2026-04-12 01:25:00',
  userGrowth: 12.5,
  revenueGrowth: 18.2,
};

export const healthData = [
  { service: 'API Gateway', status: 'Operational', uptime: 99.97, latency: 45 },
  { service: 'Portfolio Engine', status: 'Operational', uptime: 99.95, latency: 120 },
  { service: 'ML Inference Service', status: 'Operational', uptime: 99.89, latency: 340 },
  { service: 'Database (Primary)', status: 'Operational', uptime: 99.99, latency: 12 },
  { service: 'Database (Replica)', status: 'Operational', uptime: 99.98, latency: 15 },
  { service: 'Redis Cache', status: 'Operational', uptime: 99.96, latency: 3 },
  { service: 'News Aggregator', status: 'Warning', uptime: 98.50, latency: 890 },
  { service: 'PDF Generator', status: 'Operational', uptime: 99.90, latency: 250 },
];

export const errorLogs = [
  { id: 1, timestamp: '2026-04-12 01:22:15', level: 'ERROR', service: 'News Aggregator', message: 'Timeout connecting to Finnhub API after 30s', user: '[REDACTED]' },
  { id: 2, timestamp: '2026-04-12 01:18:42', level: 'WARN', service: 'ML Inference', message: 'Model inference latency exceeded threshold (>500ms)', user: 'system' },
  { id: 3, timestamp: '2026-04-12 01:15:20', level: 'ERROR', service: 'Portfolio Engine', message: 'Failed to fetch real-time price for ticker [REDACTED]', user: '[REDACTED]' },
  { id: 4, timestamp: '2026-04-12 00:58:33', level: 'INFO', service: 'Auth Service', message: 'Successful admin login from IP [REDACTED]', user: 'admin@finai.com' },
  { id: 5, timestamp: '2026-04-12 00:45:11', level: 'WARN', service: 'API Gateway', message: 'Rate limit approaching for endpoint /api/forecast', user: 'system' },
  { id: 6, timestamp: '2026-04-11 23:30:00', level: 'ERROR', service: 'PDF Generator', message: 'Failed to generate report: memory allocation error', user: '[REDACTED]' },
  { id: 7, timestamp: '2026-04-11 22:15:44', level: 'INFO', service: 'Database', message: 'Automated backup completed successfully', user: 'system' },
  { id: 8, timestamp: '2026-04-11 21:00:00', level: 'WARN', service: 'ML Inference', message: 'Model drift detected: feature distribution shift > 5%', user: 'system' },
];

export const usageAnalytics = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2026, 3, i + 1);
  return {
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    pageViews: Math.round(2000 + Math.random() * 3000),
    uniqueUsers: Math.round(500 + Math.random() * 800),
    portfolioViews: Math.round(300 + Math.random() * 500),
    riskQuiz: Math.round(50 + Math.random() * 100),
    forecasts: Math.round(100 + Math.random() * 200),
  };
});

export const aiPerformance = {
  avgInferenceTime: 245,
  p95InferenceTime: 480,
  p99InferenceTime: 720,
  modelAccuracy: 87.3,
  driftScore: 3.2,
  inferenceHistory: Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    latency: Math.round(200 + Math.random() * 200),
    requests: Math.round(50 + Math.random() * 150),
  })),
  outputDistribution: [
    { label: 'Conservative', count: 1823, color: '#3b82f6' },
    { label: 'Moderate', count: 4521, color: '#22c55e' },
    { label: 'Aggressive', count: 2103, color: '#f59e0b' },
    { label: 'Very Aggressive', count: 876, color: '#ef4444' },
  ],
};

export const externalAPIs = [
  { name: 'yfinance', status: 'Operational', latency: 120, uptime: 99.8, lastCheck: '1 min ago', calls24h: 45200 },
  { name: 'Finnhub', status: 'Degraded', latency: 890, uptime: 96.5, lastCheck: '1 min ago', calls24h: 12800 },
  { name: 'Alpha Vantage', status: 'Operational', latency: 200, uptime: 99.5, lastCheck: '2 min ago', calls24h: 8900 },
  { name: 'NewsAPI', status: 'Operational', latency: 180, uptime: 99.2, lastCheck: '1 min ago', calls24h: 5600 },
  { name: 'OpenAI API', status: 'Operational', latency: 450, uptime: 99.9, lastCheck: '1 min ago', calls24h: 3200 },
  { name: 'SendGrid (Email)', status: 'Operational', latency: 95, uptime: 99.95, lastCheck: '3 min ago', calls24h: 1200 },
];

export const aiParameters = [
  { id: 1, name: 'Rebalancing Threshold', value: '5%', category: 'Portfolio', description: 'Trigger rebalance when drift exceeds this', lastModified: '2026-04-10', modifiedBy: 'admin@finai.com' },
  { id: 2, name: 'Risk Score Weight - Volatility', value: '0.35', category: 'Risk Model', description: 'Weight of volatility in risk scoring', lastModified: '2026-04-08', modifiedBy: 'admin@finai.com' },
  { id: 3, name: 'Monte Carlo Simulations', value: '10000', category: 'Forecast', description: 'Number of simulation runs', lastModified: '2026-04-05', modifiedBy: 'admin@finai.com' },
  { id: 4, name: 'Sentiment Score Threshold', value: '0.6', category: 'NLP', description: 'Min confidence for sentiment signals', lastModified: '2026-04-01', modifiedBy: 'admin@finai.com' },
  { id: 5, name: 'Max Portfolio Concentration', value: '30%', category: 'Portfolio', description: 'Max allocation to single asset class', lastModified: '2026-03-28', modifiedBy: 'admin@finai.com' },
  { id: 6, name: 'ESG Minimum Score', value: '50', category: 'ESG', description: 'Minimum ESG score for inclusion', lastModified: '2026-03-25', modifiedBy: 'admin@finai.com' },
];
