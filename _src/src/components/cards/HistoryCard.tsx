import React from 'react';
import { GlassCard } from '../shared/GlassCard';
import { ReactionBar } from '../shared/ReactionBar';
import { ShareButton } from '../shared/ShareButton';
import { FavoriteButton } from '../shared/FavoriteButton';
import { HistoryData } from '../../types/DayData';

interface HistoryCardProps {
  data: HistoryData;
  dateKey: string;
  dateObj: Date;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({ data, dateKey, dateObj }) => {
  const categoryId = 'history';
  
  return (
    <GlassCard category={categoryId} className="flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex gap-2">
          <div className="px-3 py-1 rounded-full bg-[var(--accent-history)]/20 border border-[var(--accent-history)]/30 text-[var(--accent-history)] text-[10px] font-bold tracking-wider uppercase">
            📜 {data.importance}
          </div>
          <div className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-[10px] font-bold tracking-wider uppercase">
            {data.era.replace('_', ' ')}
          </div>
        </div>
        <FavoriteButton 
          card={{
            id: `${dateKey}_${categoryId}`,
            date: dateKey,
            category: categoryId,
            title: data.title,
            preview: data.narrative.substring(0, 60) + '...',
            savedAt: Date.now()
          }} 
        />
      </div>

      <div className="relative mt-6">
        <div className="absolute -top-12 -right-4 text-[140px] font-black text-white/[0.03] leading-none pointer-events-none select-none font-serif tracking-tighter">
          {data.year}
        </div>
        
        <div className="flex items-center justify-center mb-6">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[var(--accent-history)]/50 to-transparent"></div>
          <span className="px-4 font-serif text-2xl font-bold text-[var(--accent-history)] tracking-widest">{data.year}</span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--accent-history)]/50 via-[var(--accent-history)]/50 to-transparent"></div>
        </div>

        <h2 className="text-h2 text-white relative z-10 mb-4 leading-tight font-serif text-center">
          {data.title}
        </h2>
        <p className="text-body text-white/80 relative z-10 text-justify leading-relaxed">
          {data.narrative}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-start gap-3">
          <span className="text-xl mt-1">➡️</span>
          <div>
            <span className="text-sm font-bold text-[var(--accent-history)] uppercase tracking-wider block mb-1">Это привело к...</span>
            <p className="text-sm text-white/90 leading-relaxed">
              {data.consequence}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
        <div className="text-xs text-white/50 uppercase tracking-widest font-bold">
          🌍 {data.region}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
        <ReactionBar dateKey={`${dateKey}_${categoryId}`} accentColor="var(--accent-history)" />
        <ShareButton cardData={data} category={categoryId} date={dateObj} />
      </div>
    </GlassCard>
  );
};
