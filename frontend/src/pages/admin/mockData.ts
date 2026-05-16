
export const ADMIN_STATS = [
  { label: 'Total Users', value: '12.4k', change: '+8.2%', trend: 'up', color: 'blue' },
  { label: 'Active Sessions', value: '1,248', change: '+12.5%', trend: 'up', color: 'emerald' },
  { label: 'Total AUM', value: '$84.2M', change: '+4.1%', trend: 'up', color: 'indigo' },
  { label: 'Avg Portfolio', value: '$6.8k', change: '-1.2%', trend: 'down', color: 'rose' },
  { label: 'Growth Target', value: '94.2%', change: '+0.4%', trend: 'up', color: 'lime' },
  { label: 'Platform Status', value: 'Healthy', change: '100%', trend: 'up', color: 'teal' },
];

export const ACTIVITY_LOGS = [
  { id: 1, action: 'New Registration', user: 'usama.sh303@gmail.com', value: 'Premium Plan', timestamp: '2 mins ago', status: 'success' },
  { id: 2, action: 'Risk Quiz Completed', user: 'johndoe@example.com', value: 'Moderate (Score: 68)', timestamp: '15 mins ago', status: 'info' },
  { id: 3, action: 'Withdrawal Request', user: 'sarah.k@gmail.com', value: '$2,400', timestamp: '45 mins ago', status: 'warning' },
  { id: 4, action: 'Portfolio Rebalanced', user: 'System AI', value: 'Target: Aggressive', timestamp: '1 hour ago', status: 'success' },
  { id: 5, action: 'New Goal Created', user: 'mr.smith@pro.com', value: 'Retirement 2045', timestamp: '2 hours ago', status: 'info' },
];

export const USER_DISTRIBUTION = [
  { name: 'Free Tier', value: 45, color: '#94a3b8' },
  { name: 'Premium', value: 35, color: '#3b82f6' },
  { name: 'Enterprise', value: 15, color: '#8b5cf6' },
  { name: 'Admin', value: 5, color: '#0f172a' },
];

export const USER_GROWTH_DATA = [
  { name: 'Day 1', value: 400 },
  { name: 'Day 5', value: 800 },
  { name: 'Day 10', value: 600 },
  { name: 'Day 15', value: 1200 },
  { name: 'Day 20', value: 1000 },
  { name: 'Day 25', value: 1800 },
  { name: 'Day 30', value: 2400 },
];

export const SERVICE_HEALTH = [
  { name: 'API Gateway', status: 'Operational', uptime: '99.99', latency: '42ms', load: '12%' },
  { name: 'Auth Service', status: 'Operational', uptime: '100', latency: '18ms', load: '8%' },
  { name: 'ML Inference Service', status: 'Warning', uptime: '98.4', latency: '450ms', load: '88%' },
  { name: 'Transaction Engine', status: 'Operational', uptime: '99.98', latency: '120ms', load: '24%' },
  { name: 'Database (Primary)', status: 'Operational', uptime: '100', latency: '4ms', load: '42%' },
  { name: 'Redis Cache', status: 'Operational', uptime: '99.99', latency: '1ms', load: '15%' },
  { name: 'Notification Service', status: 'Degraded', uptime: '94.2', latency: '2.4s', load: '5%' },
  { name: 'Log Aggregator', status: 'Operational', uptime: '99.95', latency: '85ms', load: '32%' },
];

export const ERROR_LOGS = [
  { id: 'E-001', level: 'ERROR', timestamp: '2024-05-06 14:22:12', service: 'ML Service', message: 'Model drift detected in Beta-V2. Accuracy dropped below 0.85.', user: 'System' },
  { id: 'E-002', level: 'WARN', timestamp: '2024-05-06 14:18:45', service: 'API Gateway', message: 'Rate limit tripped for IP 192.168.1.42.', user: 'Anonymous' },
  { id: 'E-003', level: 'INFO', timestamp: '2024-05-06 14:15:30', service: 'Auth', message: 'Successful password reset for user ID: 8842.', user: 'usama.sh303@gmail.com' },
  { id: 'E-004', level: 'ERROR', timestamp: '2024-05-06 14:12:05', service: 'DB', message: 'Deadlock detected on table: transactions.', user: 'System' },
  { id: 'E-005', level: 'WARN', timestamp: '2024-05-06 14:05:00', service: 'Notifier', message: 'SMTP relay delay exceeded 5 seconds.', user: 'Admin' },
];

export const ANALYTICS_DATA = [
  { date: '2024-04-30', views: 2400, users: 400 },
  { date: '2024-05-01', views: 1398, users: 300 },
  { date: '2024-05-02', views: 9800, users: 2000 },
  { date: '2024-05-03', views: 3908, users: 2780 },
  { date: '2024-05-04', views: 4800, users: 1890 },
  { date: '2024-05-05', views: 3800, users: 2390 },
  { date: '2024-05-06', views: 4300, users: 3490 },
];

export const FEATURE_USAGE = [
  { name: 'Portfolio View', value: 85 },
  { name: 'Risk Quiz', value: 62 },
  { name: 'Smart Loss', value: 45 },
  { name: 'Paycheck Split', value: 38 },
  { name: 'ESG Analysis', value: 24 },
];

export const AI_PERFORMANCE = {
  latency: [
    { name: '00:00', p50: 120, p95: 250 },
    { name: '04:00', p50: 110, p95: 220 },
    { name: '08:00', p50: 180, p95: 450 },
    { name: '12:00', p50: 240, p95: 800 },
    { name: '16:00', p50: 190, p95: 600 },
    { name: '20:00', p50: 130, p95: 300 },
  ],
  distribution: [
    { name: 'Conservative', value: 400 },
    { name: 'Moderate', value: 700 },
    { name: 'Aggressive', value: 300 },
  ],
};

export const AI_PARAMS = [
  { id: 'P1', name: 'Rebalancing Threshold', value: '5%', unit: '% deviation', lastModified: '2 days ago', user: 'Admin' },
  { id: 'P2', name: 'Monte Carlo Simulations', value: '10,000', unit: 'iterations', lastModified: '5 days ago', user: 'Lead ML' },
  { id: 'P3', name: 'Sentiment Analysis Sensitivity', value: '0.75', unit: 'coefficient', lastModified: '1 hour ago', user: 'System' },
  { id: 'P4', name: 'Tax Loss Threshold', value: 'Rs 10,000', unit: 'unrealized loss', lastModified: '1 week ago', user: 'Finance Lead' },
];

export const EXTERNAL_APIS = [
  { name: 'AlphaVantage', status: 'Healthy', latency: '45ms', uptime: '99.9%', lastCheck: '2m ago' },
  { name: 'CoinGecko', status: 'Healthy', latency: '120ms', uptime: '99.7%', lastCheck: '5m ago' },
  { name: 'Plaid', status: 'Degraded', latency: '1.2s', uptime: '94.5%', lastCheck: '1m ago' },
  { name: 'Oanda FX', status: 'Healthy', latency: '28ms', uptime: '100%', lastCheck: '10s ago' },
];
