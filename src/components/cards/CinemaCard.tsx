import React from 'react';
import { GlassCard } from '../shared/GlassCard';
import { ReactionBar } from '../shared/ReactionBar';
import { ShareButton } from '../shared/ShareButton';
import { FavoriteButton } from '../shared/FavoriteButton';
import { RandomizeButton } from '../shared/RandomizeButton';
import { CinemaData } from '../../types/DayData';

interface CinemaCardProps {
  data: CinemaData;
  dateKey: string;
  dateObj: Date;
  onRandomize: () => void;
  currentIndex: number;
  poolSize: number;
}

export const CinemaCard: React.FC<CinemaCardProps> = ({
  data,
  dateKey,
  dateObj,
  onRandomize,
  currentIndex,
  poolSize,
}) => {
  const categoryId = 'cinema';

  return (
    <GlassCard category={categoryId} className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <div className="rounded-full border border-[var(--accent-cinema)]/30 bg-[var(--accent-cinema)]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--accent-cinema)]">
            🎬 Кино и музыка
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
              title: data.title,
              preview: data.funFact.substring(0, 80),
              savedAt: Date.now(),
            }}
          />
        </div>
      </div>

      <div className="mt-1 flex gap-4">
        <div className="relative aspect-[2/3] w-1/3 overflow-hidden rounded-xl border border-white/10 bg-black/30">
          <img
            src={data.posterUrl}
            alt={data.title}
            className="h-full w-full object-cover"
            loading="lazy"
            crossOrigin="anonymous"
          />
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <h2 className="mb-2 text-2xl font-black leading-tight text-white">{data.title}</h2>
          <div className="mb-3 text-sm text-white/65">{data.mediaType}</div>
          <div className="mb-3 text-sm leading-relaxed text-white/75">{data.people}</div>
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white/60">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--accent-cinema)]">
          Что произошло в эту дату
        </div>
        <p className="text-sm leading-relaxed text-white/82">{data.funFact}</p>
      </div>

      <div className="flex items-center justify-between border-t border-white/5 pt-4">
        <ReactionBar dateKey={`${dateKey}_${categoryId}_${data.id}`} accentColor="var(--accent-cinema)" />
        <ShareButton cardData={data} category={categoryId} date={dateObj} />
      </div>
    </GlassCard>
  );
};
