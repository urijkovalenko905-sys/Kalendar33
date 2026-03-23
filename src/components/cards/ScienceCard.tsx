import React from 'react';
import { GlassCard } from '../shared/GlassCard';
import { ReactionBar } from '../shared/ReactionBar';
import { ShareButton } from '../shared/ShareButton';
import { FavoriteButton } from '../shared/FavoriteButton';
import { RandomizeButton } from '../shared/RandomizeButton';
import { ScienceData } from '../../types/DayData';

interface ScienceCardProps {
  data: ScienceData;
  dateKey: string;
  dateObj: Date;
  onRandomize: () => void;
  currentIndex: number;
  poolSize: number;
}

export const ScienceCard: React.FC<ScienceCardProps> = ({
  data,
  dateKey,
  dateObj,
  onRandomize,
  currentIndex,
  poolSize,
}) => {
  const categoryId = 'science';

  return (
    <GlassCard category={categoryId} className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <div className="rounded-full border border-[var(--accent-science)]/30 bg-[var(--accent-science)]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--accent-science)]">
            {data.emoji} {data.fieldLabel}
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
              preview: data.summary.substring(0, 80),
              savedAt: Date.now(),
            }}
          />
        </div>
      </div>

      <div className="relative mt-2">
        <div className="absolute -top-8 -right-2 text-[92px] font-black leading-none tracking-tighter text-white/[0.04]">
          {data.occurredOnLabel.split(' ').at(-2)}
        </div>
        <h2 className="text-h2 mb-3 text-white">{data.title}</h2>
        <p className="text-body text-white/85">{data.summary}</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--accent-science)]">
          Почему это важно
        </div>
        <p className="text-sm leading-relaxed text-white/78">{data.whyItMatters}</p>
      </div>

      <div className="flex items-center justify-between border-t border-white/5 pt-4">
        <ReactionBar dateKey={`${dateKey}_${categoryId}_${data.id}`} accentColor="var(--accent-science)" />
        <ShareButton cardData={data} category={categoryId} date={dateObj} />
      </div>
    </GlassCard>
  );
};
