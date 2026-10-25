import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Building2 } from 'lucide-react';

export default function MarketStats({ marketData, loading }) {
  if (loading || !marketData) return null;

  const isAspiPositive = marketData.aspi_change >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* ASPI Index Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-start">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">All Share Price Index (ASPI)</span>
          <span className={`p-1.5 rounded-md ${isAspiPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            {isAspiPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          </span>
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-2xl font-black text-white">{marketData.aspi.toLocaleString()}</span>
          <span className={`text-xs font-bold ${isAspiPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isAspiPositive ? '+' : ''}{marketData.aspi_change}%
          </span>
        </div>
      </div>

      {/* S&P SL20 Index Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-start">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">S&P SL20 Index</span>
          <span className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-2xl font-black text-white">{marketData.snp_sl20.toLocaleString()}</span>
          <span className="text-xs font-bold text-emerald-400">+{marketData.snp_change}%</span>
        </div>
      </div>

      {/* Market Turnover Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-start">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Market Turnover</span>
          <span className="p-1.5 rounded-md bg-cyan-500/10 text-cyan-400">
            <DollarSign className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-2 flex items-baseline space-x-1">
          <span className="text-xl font-black text-white">LKR {(marketData.market_turnover / 1e9).toFixed(2)}B</span>
        </div>
      </div>

      {/* Companies Traded Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-start">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Companies Traded</span>
          <span className="p-1.5 rounded-md bg-amber-500/10 text-amber-400">
            <Building2 className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-2">
          <span className="text-2xl font-black text-white">{marketData.companies_traded}</span>
        </div>
      </div>

    </div>
  );
}