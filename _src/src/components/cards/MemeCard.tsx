import React from 'react';
import { GlassCard } from '../shared/GlassCard';
import { ReactionBar } from '../shared/ReactionBar';
import { ShareButton } from '../shared/ShareButton';
import { FavoriteButton } from '../shared/FavoriteButton';
import { MemeData } from '../../types/DayData';

interface MemeCardProps {
  data: MemeData;
  dateKey: string;
  dateObj: Date;
}

export const MemeCard: React.FC<MemeCardProps> = ({ data, dateKey, dateObj }) => {
  const categoryId = 'meme';
  
  return (
    <GlassCard category={categoryId} className="flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="px-3 py-1 rounded-full bg-[var(--accent-meme)]/20 border border-[var(--accent-meme)]/30 text-[var(--accent-meme)] text-[10px] font-bold tracking-wider uppercase">
          🐣 Мем дня
        </div>
        <FavoriteButton 
          card={{
            id: `${dateKey}_${categoryId}`,
            date: dateKey,
            category: categoryId,
            title: data.memeName,
            preview: data.originStory.substring(0, 60) + '...',
            savedAt: Date.now()
          }} 
        />
      </div>

      <div className="mt-4">
        <div className="relative rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl bg-black/50 aspect-video flex items-center justify-center">
          <img 
            src={data.imageUrl} 
            alt={data.memeName} 
            className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
            loading="lazy"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex justify-between items-end">
            <h3 className="text-xl font-black text-white drop-shadow-md tracking-tight">{data.memeName}</h3>
            <span className="text-sm font-bold text-[var(--accent-meme)] drop-shadow-md">{data.year}</span>
          </div>
          <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md border border-white/20 text-xs font-bold text-white/90 uppercase tracking-widest">
            {data.platform}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${data.stillUsed ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/10 text-white/60 border border-white/20'}`}>
          {data.stillUsed ? '✅ Живёт по сей день' : '👻 Легенда прошлого'}
        </span>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-bold text-[var(--accent-meme)] uppercase tracking-wider mb-2">История создания:</h4>
        <p className="text-body text-white/80 leading-relaxed">
          {data.originStory}
        </p>
      </div>

      {data.relatedMemes.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <h4 className="text-xs text-white/50 uppercase tracking-widest font-bold mb-3">Связанные мемы:</h4>
          <div className="flex flex-wrap gap-2">
            {data.relatedMemes.map(meme => (
              <span key={meme} className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs text-white/70 font-medium">
                {meme}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
        <ReactionBar dateKey={`${dateKey}_${categoryId}`} accentColor="var(--accent-meme)" />
        <ShareButton cardData={data} category={categoryId} date={dateObj} />
      </div>
    </GlassCard>
  );
};
