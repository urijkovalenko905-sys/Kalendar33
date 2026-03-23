import React from 'react';
import { GlassCard } from '../shared/GlassCard';
import { ReactionBar } from '../shared/ReactionBar';
import { ShareButton } from '../shared/ShareButton';
import { FavoriteButton } from '../shared/FavoriteButton';
import { RandomizeButton } from '../shared/RandomizeButton';
import { FunFactData } from '../../types/DayData';

interface FunFactCardProps {
  data: FunFactData;
  dateKey: string;
  dateObj: Date;
  onRandomize: () => void;
  currentIndex: number;
  poolSize: number;
}

export const FunFactCard: React.FC<FunFactCardProps> = ({
  data,
  dateKey,
  dateObj,
  onRandomize,
  currentIndex,
  poolSize,
}) => {
  const categoryId = 'funFact';

  return (
    <GlassCard category={categoryId} className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <div className="rounded-full border border-[var(--accent-fun)]/30 bg-[var(--accent-fun)]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--accent-fun)]">
            🌀 Неочевидный факт
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
              preview: data.detail.substring(0, 80),
              savedAt: Date.now(),
            }}
          />
        </div>
      </div>

      <div>
        <h2 className="mb-5 bg-gradient-to-br from-[var(--accent-fun)] to-white bg-clip-text text-[32px] font-black leading-[1.08] tracking-tight text-transparent">
          {data.punchline}
        </h2>
        <p className="text-body leading-relaxed text-white/82">{data.detail}</p>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/15 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-white/50">Уровень неожиданности</span>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <span key={index} className={`text-lg ${index < data.absurdityLevel ? 'opacity-100' : 'opacity-20 grayscale'}`}>🤯</span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 text-sm text-white/80">
          <span className="text-xs font-bold uppercase tracking-widest text-white/50">Источник</span>
          <span className="text-right">{data.source}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {data.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/65">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/5 pt-4">
        <ReactionBar dateKey={`${dateKey}_${categoryId}_${data.id}`} accentColor="var(--accent-fun)" />
        <ShareButton cardData={data} category={categoryId} date={dateObj} />
      </div>
    </GlassCard>
  );
};
