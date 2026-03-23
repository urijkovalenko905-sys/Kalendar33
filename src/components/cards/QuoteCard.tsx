import React from 'react';
import { GlassCard } from '../shared/GlassCard';
import { ReactionBar } from '../shared/ReactionBar';
import { ShareButton } from '../shared/ShareButton';
import { FavoriteButton } from '../shared/FavoriteButton';
import { RandomizeButton } from '../shared/RandomizeButton';
import { QuoteData } from '../../types/DayData';

interface QuoteCardProps {
  data: QuoteData;
  dateKey: string;
  dateObj: Date;
  onRandomize: () => void;
  currentIndex: number;
  poolSize: number;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  data,
  dateKey,
  dateObj,
  onRandomize,
  currentIndex,
  poolSize,
}) => {
  const categoryId = 'quote';

  return (
    <GlassCard category={categoryId} className="flex flex-col gap-4 bg-[#0C0C1A]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <div className="rounded-full border border-[var(--accent-quote)]/30 bg-[var(--accent-quote)]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--accent-quote)]">
            🕯 Память дня
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
              title: data.author,
              preview: data.context.substring(0, 80),
              savedAt: Date.now(),
            }}
          />
        </div>
      </div>

      <div className="relative mt-6">
        <div className="absolute -left-1 -top-4 text-5xl font-serif leading-none text-[var(--accent-quote)]/20">“</div>
        <blockquote className="relative z-10 px-4 text-center text-2xl italic leading-relaxed text-white">
          {data.quoteText}
        </blockquote>
        <div className="absolute -bottom-7 right-0 text-5xl font-serif leading-none text-[var(--accent-quote)]/20">”</div>
      </div>

      <div className="mt-8 flex flex-col items-center text-center">
        <img
          src={data.portraitUrl}
          alt={data.author}
          className="mb-4 h-[72px] w-[72px] rounded-full border-2 border-[var(--accent-quote)]/45 object-cover"
          loading="lazy"
          crossOrigin="anonymous"
        />
        <div className="text-sm font-bold uppercase tracking-widest text-white">{data.author}</div>
        <div className="mt-1 text-xs font-mono text-[var(--accent-quote)]">{data.authorYears}</div>
        <p className="mt-4 max-w-[280px] text-sm leading-relaxed text-white/72">{data.context}</p>
      </div>

      <div className="flex items-center justify-between border-t border-white/5 pt-4">
        <ReactionBar dateKey={`${dateKey}_${categoryId}_${data.id}`} accentColor="var(--accent-quote)" />
        <ShareButton cardData={data} category={categoryId} date={dateObj} />
      </div>
    </GlassCard>
  );
};
