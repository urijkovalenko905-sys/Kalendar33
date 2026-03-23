import React from 'react';
import { GlassCard } from '../shared/GlassCard';
import { ReactionBar } from '../shared/ReactionBar';
import { ShareButton } from '../shared/ShareButton';
import { FavoriteButton } from '../shared/FavoriteButton';
import { QuoteData } from '../../types/DayData';

interface QuoteCardProps {
  data: QuoteData;
  dateKey: string;
  dateObj: Date;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ data, dateKey, dateObj }) => {
  const categoryId = 'quote';
  
  return (
    <GlassCard category={categoryId} className="flex flex-col gap-4 bg-[#0C0C1A]">
      <div className="flex justify-between items-start">
        <div className="px-3 py-1 rounded-full bg-[var(--accent-quote)]/20 border border-[var(--accent-quote)]/30 text-[var(--accent-quote)] text-[10px] font-bold tracking-wider uppercase">
          💡 Цитата дня
        </div>
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 rounded bg-white/5 border border-white/10 text-white/50 text-[10px] uppercase tracking-widest font-bold">
            {data.mood}
          </div>
          <FavoriteButton 
            card={{
              id: `${dateKey}_${categoryId}`,
              date: dateKey,
              category: categoryId,
              title: data.author,
              preview: data.quoteText.substring(0, 60) + '...',
              savedAt: Date.now()
            }} 
          />
        </div>
      </div>

      <div className="mt-8 relative">
        <div className="absolute -top-6 -left-2 text-6xl text-[var(--accent-quote)]/20 font-serif leading-none select-none">
          "
        </div>
        <blockquote className="text-2xl md:text-3xl font-serif italic text-white leading-relaxed text-center px-4 relative z-10">
          {data.quoteText}
        </blockquote>
        <div className="absolute -bottom-8 -right-2 text-6xl text-[var(--accent-quote)]/20 font-serif leading-none select-none">
          "
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center justify-center">
        <div className="relative mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-[var(--accent-quote)]/50 scale-110"></div>
          <img 
            src={data.portraitUrl} 
            alt={data.author} 
            className="w-16 h-16 rounded-full object-cover relative z-10"
            loading="lazy"
            crossOrigin="anonymous"
          />
        </div>
        <div className="text-sm font-bold text-white uppercase tracking-widest mb-1">
          {data.author}
        </div>
        <div className="text-xs text-[var(--accent-quote)] font-mono mb-4">
          {data.authorYears}
        </div>
        <p className="text-xs text-white/60 text-center max-w-[250px] leading-relaxed">
          {data.context}
        </p>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
        <ReactionBar dateKey={`${dateKey}_${categoryId}`} accentColor="var(--accent-quote)" />
        <ShareButton cardData={data} category={categoryId} date={dateObj} />
      </div>
    </GlassCard>
  );
};
