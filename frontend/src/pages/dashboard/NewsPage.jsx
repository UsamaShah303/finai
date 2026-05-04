import { newsData, sentimentData } from '../../data/mockData';
import { Newspaper, ExternalLink, TrendingUp, TrendingDown, Minus, Clock, Filter } from 'lucide-react';
import { useState } from 'react';

export default function NewsPage() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? newsData : newsData.filter(n => n.sentiment.toLowerCase() === filter);

  const getSentimentIcon = (s) => {
    if (s === 'Positive') return <TrendingUp className="w-4 h-4" />;
    if (s === 'Negative') return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getSentimentStyle = (s) => {
    if (s === 'Positive') return 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
    if (s === 'Negative') return 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400';
    return 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-surface-900 dark:text-white">News & Sentiment</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">AI-analyzed market news with sentiment scores.</p>
        </div>
        <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200/50 dark:border-slate-700/50">
          <Filter className="w-4 h-4 text-slate-400 ml-2" />
          {['all', 'positive', 'neutral', 'negative'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                filter === f
                  ? 'bg-[#ccff00] text-slate-900 shadow-md shadow-[#ccff00]/20'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Market Sentiment Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {sentimentData.map(({ asset, sentiment, score, emoji, color }) => (
          <div key={asset} className="neo-card p-3 text-center">
            <span className="text-2xl">{emoji}</span>
            <p className="text-xs font-bold text-surface-900 dark:text-white mt-1">{asset}</p>
            <p className="text-xs font-semibold mt-0.5" style={{ color }}>{score}%</p>
          </div>
        ))}
      </div>

      {/* News Feed */}
      <div className="space-y-4">
        {filtered.map((news) => (
          <div key={news.id} className="neo-card p-5 group hover:shadow-lg transition-all">
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${getSentimentStyle(news.sentiment)}`}>
                    {getSentimentIcon(news.sentiment)}
                    {news.sentiment}
                  </span>
                  <span className="text-xs text-surface-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {news.time}
                  </span>
                  <span className="text-xs text-surface-400">• {news.source}</span>
                </div>
                <h3 className="text-[17px] font-extrabold text-slate-800 dark:text-white group-hover:text-slate-600 dark:group-hover:text-[#ccff00] transition-colors tracking-tight">
                  {news.title}
                </h3>
                <p className="text-[14px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed font-medium">{news.summary}</p>
                <div className="flex items-center gap-3 mt-4">
                  <span className="text-[11px] px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 font-bold uppercase tracking-widest shadow-sm">
                    Impact: {news.impact}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: news.sentiment === 'Positive' ? '#22c55e20' : news.sentiment === 'Negative' ? '#ef444420' : '#f59e0b20',
                  }}>
                  <span className="text-2xl font-black"
                    style={{
                      color: news.sentiment === 'Positive' ? '#22c55e' : news.sentiment === 'Negative' ? '#ef4444' : '#f59e0b',
                    }}>
                    {news.score}
                  </span>
                </div>
                <span className="text-[10px] text-surface-400">AI Score</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
