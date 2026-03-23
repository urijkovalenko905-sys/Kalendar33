import React from 'react';
import { GlassCard } from '../shared/GlassCard';
import { ReactionBar } from '../shared/ReactionBar';
import { ShareButton } from '../shared/ShareButton';
import { FavoriteButton } from '../shared/FavoriteButton';
import { RandomizeButton } from '../shared/RandomizeButton';
import { HistoryData } from '../../types/DayData';

interface HistoryCardProps {
  data: HistoryData;
  dateKey: string;
  dateObj: Date;
  onRandomize: () => void;
  currentIndex: number;
  poolSize: number;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({
  data,
  dateKey,
  dateObj,
  onRandomize,
  currentIndex,
  poolSize,
}) => {
  const categoryId = 'history';

  return (
    <GlassCard category={categoryId} className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <div className="rounded-full border border-[var(--accent-history)]/30 bg-[var(--accent-history)]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--accent-history)]">
            📜 {data.importance}
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/70">
            {data.occurredOnLabel}
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/50">
            {data.era}
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
              preview: data.narrative.substring(0, 80),
              savedAt: Date.now(),
            }}
          />
        </div>
      </div>

      <div className="relative mt-2">
        <div className="mb-5 flex items-center justify-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--accent-history)]/50 to-transparent" />
          <span className="text-2xl font-bold tracking-widest text-[var(--accent-history)]">{data.year}</span>
          <div className="h-px flex-1 bg-gradient-to-r from-[var(--accent-history)]/50 via-[var(--accent-history)]/50 to-transparent" />
        </div>

        <h2 className="mb-4 text-center font-serif text-h2 text-white">{data.title}</h2>
        <p className="text-body text-justify leading-relaxed text-white/82">{data.narrative}</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--accent-history)]">
          Что это изменило
        </div>
        <p className="text-sm leading-relaxed text-white/82">{data.consequence}</p>
      </div>

      <div className="flex items-center justify-between border-t border-white/5 pt-4 text-xs font-bold uppercase tracking-widest text-white/50">
        <span>🌍 {data.region}</span>
        <span>{data.sourceTitle}</span>
      </div>

      <div className="flex items-center justify-between border-t border-white/5 pt-4">
        <ReactionBar dateKey={`${dateKey}_${categoryId}_${data.id}`} accentColor="var(--accent-history)" />
        <ShareButton cardData={data} category={categoryId} date={dateObj} />
      </div>
    </GlassCard>
  );
};
