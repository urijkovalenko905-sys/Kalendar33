import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GlassCard } from '../shared/GlassCard';
import { ReactionBar } from '../shared/ReactionBar';
import { ShareButton } from '../shared/ShareButton';
import { FavoriteButton } from '../shared/FavoriteButton';
import { RandomizeButton } from '../shared/RandomizeButton';
import { Person } from '../../types/DayData';

interface BirthdaysCardProps {
  data: Person[];
  dateKey: string;
  dateObj: Date;
  onRandomize: () => void;
  currentIndex: number;
  poolSize: number;
}

export const BirthdaysCard: React.FC<BirthdaysCardProps> = ({
  data,
  dateKey,
  dateObj,
  onRandomize,
  currentIndex,
  poolSize,
}) => {
  const categoryId = 'birthday';
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <GlassCard category={categoryId} className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <div className="rounded-full border border-[var(--accent-birthday)]/30 bg-[var(--accent-birthday)]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--accent-birthday)]">
            🎂 Рождения этой даты
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/70">
            {data[0]?.occurredOnLabel ?? dateKey}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <RandomizeButton onClick={onRandomize} currentIndex={currentIndex} poolSize={poolSize} />
          <FavoriteButton
            card={{
              id: `${dateKey}_${categoryId}_${data.map((person) => person.id).join('-')}`,
              date: dateKey,
              category: categoryId,
              title: data.map((person) => person.name).join(', '),
              preview: data[0]?.summary.substring(0, 80) ?? 'Рождения этой даты',
              savedAt: Date.now(),
            }}
          />
        </div>
      </div>

      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
        {data.map((person) => {
          const isExpanded = expandedId === person.id;

          return (
            <motion.div
              key={person.id}
              layout
              onClick={() => setExpandedId(isExpanded ? null : person.id)}
              className={`flex-shrink-0 cursor-pointer snap-center rounded-2xl border border-white/10 bg-white/5 p-4 text-center transition-colors hover:bg-white/10 ${isExpanded ? 'w-[300px]' : 'w-[170px]'}`}
            >
              <motion.img
                layout="position"
                src={person.avatarUrl}
                alt={person.name}
                className="mx-auto mb-3 h-[76px] w-[76px] rounded-full border-2 border-[var(--accent-birthday)]/45 object-cover"
                loading="lazy"
                crossOrigin="anonymous"
              />
              <motion.h3 layout="position" className="mb-1 text-sm font-bold leading-tight text-white">
                {person.name}
              </motion.h3>
              <motion.div layout="position" className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/55">
                {person.field}
              </motion.div>
              <motion.div layout="position" className="text-xs font-mono text-[var(--accent-birthday)]">
                родился {person.birthYear}
              </motion.div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 border-t border-white/10 pt-3 text-left text-xs leading-relaxed text-white/78">
                      <div className="mb-2 font-bold text-white/55">{person.occurredOnLabel}</div>
                      <p className="mb-2">{person.summary}</p>
                      <div className="text-white/55">{person.nationality}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t border-white/5 pt-4">
        <ReactionBar dateKey={`${dateKey}_${categoryId}_${data.map((person) => person.id).join('-')}`} accentColor="var(--accent-birthday)" />
        <ShareButton cardData={data} category={categoryId} date={dateObj} />
      </div>
    </GlassCard>
  );
};
