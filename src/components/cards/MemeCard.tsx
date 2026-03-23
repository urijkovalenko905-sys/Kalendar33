import React from 'react';
import { GlassCard } from '../shared/GlassCard';
import { ReactionBar } from '../shared/ReactionBar';
import { ShareButton } from '../shared/ShareButton';
import { FavoriteButton } from '../shared/FavoriteButton';
import { RandomizeButton } from '../shared/RandomizeButton';
import { MemeData } from '../../types/DayData';

interface MemeCardProps {
  data: MemeData;
  dateKey: string;
  dateObj: Date;
  onRandomize: () => void;
  currentIndex: number;
  poolSize: number;
}

export const MemeCard: React.FC<MemeCardProps> = ({
  data,
  dateKey,
  dateObj,
  onRandomize,
  currentIndex,
  poolSize,
}) => {
  const categoryId = 'meme';

  return (
    <GlassCard category={categoryId} className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <div className="rounded-full border border-[var(--accent-meme)]/30 bg-[var(--accent-meme)]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--accent-meme)]">
            🐣 Поп-культура даты
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/70">
            {data.occurredOnLabel}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <RandomizeButton onClick={onRandomize} currentIndex={currentIndex} poolSize={poolSize} />
          <FavoriteButton
            card={{
              id: `${dateKey}_${categoryId}_${data.id}`,
              date: dateKey,
              category: categoryId,
              title: data.memeName,
              preview: data.originStory.substring(0, 80),
              savedAt: Date.now(),
            }}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
        <div className="relative aspect-video">
          <img
            src={data.imageUrl}
            alt={data.memeName}
            className="h-full w-full object-cover opacity-92"
            loading="lazy"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-4">
            <div className="text-xl font-black tracking-tight text-white">{data.memeName}</div>
            <div className="mt-1 flex items-center justify-between text-sm text-white/75">
              <span>{data.platform}</span>
              <span>{data.year}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-body leading-relaxed text-white/82">{data.originStory}</p>

      <div className="flex items-center gap-2">
        <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${data.stillUsed ? 'border-green-500/30 bg-green-500/15 text-green-400' : 'border-white/20 bg-white/5 text-white/55'}`}>
          {data.stillUsed ? 'До сих пор узнаётся' : 'Исторический культурный момент'}
        </span>
      </div>

      {data.relatedMemes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.relatedMemes.map((item) => (
            <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              {item}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-white/5 pt-4">
        <ReactionBar dateKey={`${dateKey}_${categoryId}_${data.id}`} accentColor="var(--accent-meme)" />
        <ShareButton cardData={data} category={categoryId} date={dateObj} />
      </div>
    </GlassCard>
  );
};
