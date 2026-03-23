import React from 'react';
import { GlassCard } from '../shared/GlassCard';
import { ReactionBar } from '../shared/ReactionBar';
import { ShareButton } from '../shared/ShareButton';
import { FavoriteButton } from '../shared/FavoriteButton';
import { RandomizeButton } from '../shared/RandomizeButton';
import { HolidayData } from '../../types/DayData';

interface HolidayCardProps {
  data: HolidayData;
  dateKey: string;
  dateObj: Date;
  onRandomize: () => void;
  currentIndex: number;
  poolSize: number;
}

export const HolidayCard: React.FC<HolidayCardProps> = ({
  data,
  dateKey,
  dateObj,
  onRandomize,
  currentIndex,
  poolSize,
}) => {
  const categoryId = 'holiday';

  return (
    <GlassCard category={categoryId} className="relative flex flex-col gap-4 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, var(--accent-holiday) 2px, transparent 2px)', backgroundSize: '40px 40px' }}
      />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <div className="rounded-full border border-[var(--accent-holiday)]/30 bg-[var(--accent-holiday)]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--accent-holiday)]">
            🌍 Праздники даты
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
              title: data.holidayName,
              preview: data.purpose.substring(0, 80),
              savedAt: Date.now(),
            }}
          />
        </div>
      </div>

      <div className="relative z-10 mt-2">
        <h2 className="mb-4 bg-gradient-to-r from-[var(--accent-holiday)] to-white bg-clip-text text-center text-[34px] font-black leading-[1.1] tracking-tight text-transparent">
          {data.holidayName}
        </h2>
        <div className="mb-4 flex justify-center gap-2">
          {data.relatedCountries.map((item, index) => (
            <span key={`${item}-${index}`} className="text-2xl">{item}</span>
          ))}
        </div>
        <p className="text-center text-body leading-relaxed text-white/82">{data.purpose}</p>
      </div>

      <div className="relative z-10 rounded-2xl border border-white/10 bg-black/15 p-4">
        <div className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--accent-holiday)]">
          Как можно отметить
        </div>
        <div className="flex flex-col gap-3">
          {data.howToCelebrate.map((step, index) => (
            <div key={step} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent-holiday)]/20 text-xs font-bold text-[var(--accent-holiday)]">
                {index + 1}
              </div>
              <p className="text-sm leading-relaxed text-white/84">{step}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between border-t border-white/5 pt-4 text-xs font-bold uppercase tracking-widest text-white/55">
        <span>{data.isOfficial ? 'Отмечается официально' : 'Памятная дата'}</span>
        <span>{data.origin}</span>
      </div>

      <div className="relative z-10 flex items-center justify-between border-t border-white/5 pt-4">
        <ReactionBar dateKey={`${dateKey}_${categoryId}_${data.id}`} accentColor="var(--accent-holiday)" />
        <ShareButton cardData={data} category={categoryId} date={dateObj} />
      </div>
    </GlassCard>
  );
};
