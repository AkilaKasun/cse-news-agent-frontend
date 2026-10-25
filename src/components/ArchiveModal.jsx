import React from 'react';
import { ExternalLink, Layers, Sparkles } from 'lucide-react';

export default function StoriesFeed({ stories }) {
  return (
    <div className="space-y-4">
      {stories.map((story) => (
        <div key={story.id} className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="bg-cyan-500/10 text-cyan-400 font-semibold px-2 py-0.5 rounded border border-cyan-500/20">
              {story.sector}
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 font-medium">{story.primary_source}</span>
              <span>•</span>
              <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                Seen on {story.duplicate_count} site(s)
              </span>
            </div>
          </div>

          <h3 className="text-base font-bold text-white hover:text-cyan-400 transition-colors">
            {story.title}
          </h3>

          <div className="mt-3 bg-slate-950/50 p-3 rounded-lg border border-slate-800/60 text-xs space-y-1">
            <div className="flex items-center space-x-1.5 text-cyan-400 font-semibold">
              <Sparkles className="w-3 h-3" />
              <span>AI Analyst Reasoning</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{story.reasoning}</p>
          </div>
        </div>
      ))}
    </div>
  );
}