import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  Layers,
  Newspaper,
  Minus,
} from 'lucide-react';

/**
 * Automatically highlights percentages (+4.5%, -1.2%), currency values (LKR, Rs., USD, Bn, Mn),
 * basis points (bps), and keyCSE terms (CBSL, IMF, ASPI) inside argument text.
 */
function highlightKeyMetrics(text) {
  if (!text) return <span className="italic text-slate-500">No major signals recorded.</span>;

  const pattern =
    /([+-]?\d+(?:\.\d+)?%|\b(?:LKR|Rs\.?|USD|\$)\s?\d+(?:,\d{3})*(?:\.\d+)?(?:\s?(?:Bn|Mn|Tr|B|M|K|billion|million))?\b|\b\d+(?:\.\d+)?\s?(?:bps|basis points|Bn|Mn)\b|\b(?:CBSL|IMF|ASPI|S&P SL20)\b)/gi;

  const parts = text.split(pattern);

  return parts.map((part, i) => {
    if (!part) return null;
    if (pattern.test(part)) {
      pattern.lastIndex = 0; // Reset regex state
      const isNegative = part.trim().startsWith('-');
      const isPositive = part.trim().startsWith('+');

      let badgeStyle = 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      if (isPositive) badgeStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      if (isNegative) badgeStyle = 'bg-rose-500/20 text-rose-300 border-rose-500/40';

      return (
        <span
          key={i}
          className={`inline-block font-mono font-bold px-1.5 py-0.2 mx-0.5 rounded border text-xs tracking-tight ${badgeStyle}`}
        >
          {part}
        </span>
      );
    }
    return part;
  });
}

/**
 * Maps confidence level (HIGH, MEDIUM, LOW) to distinct visual badge styles
 */
function getConfidenceStyle(confidence = '') {
  const level = confidence.toUpperCase();
  if (level === 'HIGH') {
    return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
  }
  if (level === 'MEDIUM') {
    return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
  }
  return 'bg-slate-800 text-slate-300 border-slate-700';
}

export default function SectorGrid({ sectors = [] }) {
  if (!sectors.length) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
        <Layers className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <p className="text-base font-semibold text-slate-300">No Sector Evidence Available</p>
        <p className="text-sm text-slate-500 mt-1">
          Select another trade date or run the CSE classifier pipeline to populate sector scores.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {sectors.map((sec, index) => {
        const rawScore = Number(sec.score || 0);
        const isPositive = rawScore > 0.05;
        const isNegative = rawScore < -0.05;

        // Normalize score (-1.0 to +1.0) to a 0% - 100% progress bar width
        const meterPercent = Math.min(100, Math.max(8, Math.round(Math.abs(rawScore) * 100)));

        // Dynamic theme colors based on sentiment direction
        const cardAccent = isPositive
          ? 'hover:border-emerald-500/40 before:bg-gradient-to-r before:from-emerald-500 before:to-cyan-500'
          : isNegative
          ? 'hover:border-rose-500/40 before:bg-gradient-to-r before:from-rose-500 before:to-amber-500'
          : 'hover:border-slate-700 before:bg-slate-700';

        const scoreBadge = isPositive
          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-sm shadow-emerald-950'
          : isNegative
          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30 shadow-sm shadow-rose-950'
          : 'bg-slate-800/90 text-slate-300 border-slate-700';

        const sentimentLabel = isPositive ? 'BULLISH' : isNegative ? 'BEARISH' : 'NEUTRAL';

        return (
          <div
            key={sec.sector || index}
            className={`relative overflow-hidden bg-slate-900/90 backdrop-blur-sm border border-slate-800/90 rounded-2xl p-6 shadow-xl transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between before:absolute before:top-0 before:left-0 before:right-0 before:h-1 ${cardAccent}`}
          >
            <div>
              {/* 1. Sector Title & Prominent Score Pill */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800/90">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      <Layers className="w-4 h-4" />
                    </span>
                    <h3 className="text-lg font-extrabold tracking-tight text-white">
                      {sec.sector}
                    </h3>
                  </div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 pl-9">
                    Signal: <span className={isPositive ? 'text-emerald-400' : isNegative ? 'text-rose-400' : 'text-slate-300'}>{sentimentLabel}</span>
                  </p>
                </div>

                {/* Highlighted Score & Price/Sentiment Change Badge */}
                <div
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl border font-mono text-base font-black tracking-tight shrink-0 ${scoreBadge}`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isNegative ? (
                    <TrendingDown className="w-4 h-4 text-rose-400 shrink-0" />
                  ) : (
                    <Minus className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span>
                    {rawScore > 0 ? '+' : ''}
                    {rawScore.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* 2. Visual Sentiment Strength Bar */}
              <div className="mt-3.5 mb-5">
                <div className="flex justify-between items-center text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  <span>Sentiment Intensity</span>
                  <span className="text-slate-300 font-bold">{meterPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isPositive
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : isNegative
                        ? 'bg-gradient-to-r from-rose-500 to-orange-400'
                        : 'bg-slate-600'
                    }`}
                    style={{ width: `${meterPercent}%` }}
                  />
                </div>
              </div>

              {/* 3. High-Contrast Evidence Callout Boxes */}
              <div className="space-y-3.5">
                {/* Bullish / In Favour Box */}
                <div className="rounded-xl bg-emerald-950/25 border border-emerald-500/20 p-3.5 transition-colors hover:border-emerald-500/35">
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                      Bullish Drivers (In Favour)
                    </span>
                  </div>
                  <p className="text-sm text-slate-100 leading-relaxed font-normal pl-7">
                    {highlightKeyMetrics(sec.arguments_for)}
                  </p>
                </div>

                {/* Bearish / Against Box */}
                <div className="rounded-xl bg-rose-950/25 border border-rose-500/20 p-3.5 transition-colors hover:border-rose-500/35">
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span className="p-1 rounded-md bg-rose-500/20 text-rose-400">
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-rose-400">
                      Risk Factors (Against)
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed font-normal pl-7">
                    {highlightKeyMetrics(sec.arguments_against)}
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Footer Metrics Bar */}
            <div className="mt-6 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-slate-400 font-medium">Confidence:</span>
                <span
                  className={`px-2.5 py-0.5 rounded-md font-mono font-bold text-[11px] uppercase border ${getConfidenceStyle(
                    sec.confidence
                  )}`}
                >
                  {sec.confidence || 'N/A'}
                </span>
              </div>

              <div className="flex items-center space-x-1.5 bg-slate-800/90 border border-slate-700/80 px-3 py-1 rounded-lg text-slate-200 font-semibold">
                <Newspaper className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-mono font-bold text-white">{sec.article_count}</span>
                <span className="text-slate-400">
                  {sec.article_count === 1 ? 'story' : 'stories'}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}