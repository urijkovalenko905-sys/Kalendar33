import React from 'react';
import { GlassCard } from '../shared/GlassCard';
import { ReactionBar } from '../shared/ReactionBar';
import { ShareButton } from '../shared/ShareButton';
import { FavoriteButton } from '../shared/FavoriteButton';
import { CinemaData } from '../../types/DayData';

interface CinemaCardProps {
  data: CinemaData;
  dateKey: string;
  dateObj: Date;
}

export const CinemaCard: React.FC<CinemaCardProps> = ({ data, dateKey, dateObj }) => {
  const categoryId = 'cinema';
  
  return (
    <GlassCard category={categoryId} className="flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="px-3 py-1 rounded-full bg-[var(--accent-cinema)]/20 border border-[var(--accent-cinema)]/30 text-[var(--accent-cinema)] text-[10px] font-bold tracking-wider uppercase">
          🎬 Кино и Музыка
        </div>
        <FavoriteButton 
          card={{
            id: `${dateKey}_${categoryId}`,
            date: dateKey,
            category: categoryId,
            title: data.title,
            preview: data.funFact.substring(0, 60) + '...',
            savedAt: Date.now()
          }} 
        />
      </div>

      <div className="mt-4 flex gap-4">
        <div className="w-1/3 aspect-[2/3] rounded-xl overflow-hidden shadow-lg border border-white/10 relative">
          <img 
            src={data.posterUrl} 
            alt={data.title} 
            className="w-full h-full object-cover"
            loading="lazy"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1">
            {data.genre.slice(0, 2).map(g => (
              <span key={g} className="px-1.5 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[8px] font-bold text-white/90 uppercase tracking-wider">
                {g}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-2xl font-black text-white leading-tight mb-1 tracking-tight">
            {data.title}
          </h2>
          <div className="text-sm text-white/60 font-medium mb-3">
            {data.year}, {data.creator}
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-[var(--accent-cinema)]">
              {Array.from({ length: 10 }).map((_, i) => (
                <span key={i} className={`text-sm ${i < Math.round(data.rating) ? 'opacity-100' : 'opacity-30'}`}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm font-bold text-white">{data.rating.toFixed(1)}</span>
          </div>
          
          <div className="px-2 py-1 bg-white/5 rounded border border-white/10 text-[10px] font-bold text-white/50 uppercase tracking-widest self-start">
            {data.type}
          </div>
        </div>
      </div>

      {data.quote && (
        <div className="mt-6 pt-4 border-t border-white/10">
          <blockquote className="text-quote text-white/90 border-l-4 border-[var(--accent-cinema)] pl-4 py-1">
            «{data.quote}»
          </blockquote>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🎬</span>
          <span className="text-sm font-bold text-white/90">Интересный факт:</span>
        </div>
        <p className="text-sm text-white/70 leading-relaxed">
          {data.funFact}
        </p>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
        <ReactionBar dateKey={`${dateKey}_${categoryId}`} accentColor="var(--accent-cinema)" />
        <ShareButton cardData={data} category={categoryId} date={dateObj} />
      </div>
    </GlassCard>
  );
};
