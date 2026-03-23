import React from 'react';
import { GlassCard } from '../shared/GlassCard';
import { ReactionBar } from '../shared/ReactionBar';
import { ShareButton } from '../shared/ShareButton';
import { FavoriteButton } from '../shared/FavoriteButton';
import { ScienceData } from '../../types/DayData';

interface ScienceCardProps {
  data: ScienceData;
  dateKey: string;
  dateObj: Date;
}

export const ScienceCard: React.FC<ScienceCardProps> = ({ data, dateKey, dateObj }) => {
  const categoryId = 'science';
  
  return (
    <GlassCard category={categoryId} className="flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="px-3 py-1 rounded-full bg-[var(--accent-science)]/20 border border-[var(--accent-science)]/30 text-[var(--accent-science)] text-[10px] font-bold tracking-wider uppercase">
          {data.emoji} {data.category}
        </div>
        <FavoriteButton 
          card={{
            id: `${dateKey}_${categoryId}`,
            date: dateKey,
            category: categoryId,
            title: data.headline,
            preview: data.story.substring(0, 60) + '...',
            savedAt: Date.now()
          }} 
        />
      </div>

      <div className="relative mt-2">
        <div className="absolute -top-10 -right-4 text-[120px] font-black text-white/[0.04] leading-none pointer-events-none select-none font-sans tracking-tighter">
          {data.year}
        </div>
        <h2 className="text-h2 text-white relative z-10 mb-4 leading-tight">
          {data.headline}
        </h2>
        <p className="text-body text-white/80 relative z-10">
          {data.story}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">💡</span>
          <span className="text-sm font-bold text-white/90">Знаете ли вы?</span>
        </div>
        <p className="text-sm text-white/70 italic">
          {data.mindBlownFact}
        </p>
      </div>

      <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
        <ReactionBar dateKey={`${dateKey}_${categoryId}`} accentColor="var(--accent-science)" />
        <ShareButton cardData={data} category={categoryId} date={dateObj} />
      </div>
    </GlassCard>
  );
};
