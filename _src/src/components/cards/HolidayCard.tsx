import React from 'react';
import { GlassCard } from '../shared/GlassCard';
import { ReactionBar } from '../shared/ReactionBar';
import { ShareButton } from '../shared/ShareButton';
import { FavoriteButton } from '../shared/FavoriteButton';
import { HolidayData } from '../../types/DayData';

interface HolidayCardProps {
  data: HolidayData;
  dateKey: string;
  dateObj: Date;
}

export const HolidayCard: React.FC<HolidayCardProps> = ({ data, dateKey, dateObj }) => {
  const categoryId = 'holiday';
  
  return (
    <GlassCard category={categoryId} className="flex flex-col gap-4 relative overflow-hidden">
      {/* Festive confetti background */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, var(--accent-holiday) 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>

      <div className="flex justify-between items-start relative z-10">
        <div className="px-3 py-1 rounded-full bg-[var(--accent-holiday)]/20 border border-[var(--accent-holiday)]/30 text-[var(--accent-holiday)] text-[10px] font-bold tracking-wider uppercase">
          🌍 Странный праздник
        </div>
        <FavoriteButton 
          card={{
            id: `${dateKey}_${categoryId}`,
            date: dateKey,
            category: categoryId,
            title: data.holidayName,
            preview: data.purpose.substring(0, 60) + '...',
            savedAt: Date.now()
          }} 
        />
      </div>

      <div className="mt-6 relative z-10">
        <h2 className="text-[36px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-holiday)] to-white leading-[1.1] mb-6 tracking-tight text-center">
          {data.holidayName}
        </h2>
        <div className="flex justify-center gap-2 mb-6">
          {data.relatedCountries.map((emoji, i) => (
            <span key={i} className="text-2xl">{emoji}</span>
          ))}
        </div>
        <p className="text-body text-white/80 leading-relaxed text-center mb-6">
          {data.purpose}
        </p>
      </div>

      <div className="mt-4 pt-6 border-t border-white/10 relative z-10">
        <h3 className="text-sm font-bold text-[var(--accent-holiday)] uppercase tracking-wider mb-4 text-center">Как отметить?</h3>
        <div className="flex flex-col gap-3">
          {data.howToCelebrate.map((step, i) => (
            <div key={i} className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--accent-holiday)]/20 flex items-center justify-center text-[var(--accent-holiday)] font-bold text-xs">
                {i + 1}
              </div>
              <p className="text-sm text-white/90 leading-relaxed">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5 relative z-10">
        <div className="text-xs text-white/50 uppercase tracking-widest font-bold">
          {data.isOfficial ? 'Официальный' : 'Неофициальный'}
        </div>
        <div className="text-xs text-white/50 uppercase tracking-widest font-bold">
          {data.origin}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5 relative z-10">
        <ReactionBar dateKey={`${dateKey}_${categoryId}`} accentColor="var(--accent-holiday)" />
        <ShareButton cardData={data} category={categoryId} date={dateObj} />
      </div>
    </GlassCard>
  );
};
