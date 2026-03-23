import React from 'react';
import { GlassCard } from '../shared/GlassCard';
import { ReactionBar } from '../shared/ReactionBar';
import { ShareButton } from '../shared/ShareButton';
import { FavoriteButton } from '../shared/FavoriteButton';
import { FunFactData } from '../../types/DayData';

interface FunFactCardProps {
  data: FunFactData;
  dateKey: string;
  dateObj: Date;
}

export const FunFactCard: React.FC<FunFactCardProps> = ({ data, dateKey, dateObj }) => {
  const categoryId = 'funFact';
  
  return (
    <GlassCard category={categoryId} className="flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="px-3 py-1 rounded-full bg-[var(--accent-fun)]/20 border border-[var(--accent-fun)]/30 text-[var(--accent-fun)] text-[10px] font-bold tracking-wider uppercase">
          😂 Фан-факт
        </div>
        <FavoriteButton 
          card={{
            id: `${dateKey}_${categoryId}`,
            date: dateKey,
            category: categoryId,
            title: data.punchline,
            preview: data.detail.substring(0, 60) + '...',
            savedAt: Date.now()
          }} 
        />
      </div>

      <div className="mt-4">
        <h2 className="text-[32px] font-black text-transparent bg-clip-text bg-gradient-to-br from-[var(--accent-fun)] to-white leading-[1.1] mb-6 tracking-tight">
          {data.punchline}
        </h2>
        <p className="text-body text-white/80 leading-relaxed">
          {data.detail}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/50 uppercase tracking-widest font-bold">Уровень абсурда</span>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`text-lg transition-opacity ${i < data.absurdityLevel ? 'opacity-100' : 'opacity-20 grayscale'}`}>
                🤪
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/50 uppercase tracking-widest font-bold">Источник</span>
          <span className="text-sm text-white/80 font-medium">{data.source}</span>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {data.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-white/5 rounded-md text-xs text-white/60">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
        <ReactionBar dateKey={`${dateKey}_${categoryId}`} accentColor="var(--accent-fun)" />
        <ShareButton cardData={data} category={categoryId} date={dateObj} />
      </div>
    </GlassCard>
  );
};
