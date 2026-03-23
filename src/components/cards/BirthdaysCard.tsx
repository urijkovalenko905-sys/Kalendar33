import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../shared/GlassCard';
import { ReactionBar } from '../shared/ReactionBar';
import { ShareButton } from '../shared/ShareButton';
import { FavoriteButton } from '../shared/FavoriteButton';
import { Person } from '../../types/DayData';

interface BirthdaysCardProps {
  data: Person[];
  dateKey: string;
  dateObj: Date;
}

export const BirthdaysCard: React.FC<BirthdaysCardProps> = ({ data, dateKey, dateObj }) => {
  const categoryId = 'birthday';
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  return (
    <GlassCard category={categoryId} className="flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="px-3 py-1 rounded-full bg-[var(--accent-birthday)]/20 border border-[var(--accent-birthday)]/30 text-[var(--accent-birthday)] text-[10px] font-bold tracking-wider uppercase">
          🎂 Именинники
        </div>
        <FavoriteButton 
          card={{
            id: `${dateKey}_${categoryId}`,
            date: dateKey,
            category: categoryId,
            title: 'Именинники',
            preview: data.map(p => p.name).join(', ').substring(0, 60) + '...',
            savedAt: Date.now()
          }} 
        />
      </div>

      <div className="mt-4 flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 pb-4">
        {data.map((person, index) => {
          const isExpanded = expandedId === person.name;
          
          return (
            <motion.div 
              key={person.name}
              layout
              onClick={() => setExpandedId(isExpanded ? null : person.name)}
              className={`flex-shrink-0 snap-center rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col items-center text-center cursor-pointer transition-colors hover:bg-white/10 ${isExpanded ? 'w-[280px]' : 'w-[160px]'}`}
            >
              <motion.img 
                layout="position"
                src={person.avatarUrl} 
                alt={person.name} 
                className="w-[72px] h-[72px] rounded-full object-cover border-2 border-[var(--accent-birthday)]/50 mb-3"
                loading="lazy"
                crossOrigin="anonymous"
              />
              <motion.h3 layout="position" className="text-sm font-bold text-white mb-1 leading-tight">
                {person.name}
              </motion.h3>
              <motion.div layout="position" className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-2">
                {person.field}
              </motion.div>
              <motion.div layout="position" className="text-xs text-[var(--accent-birthday)] font-mono mb-2">
                {person.birthYear} — {person.deathYear || 'н.в.'}
              </motion.div>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 mt-3 border-t border-white/10 text-xs text-white/80 leading-relaxed text-left">
                      <div className="mb-2 font-bold text-white/60">{person.nationality}</div>
                      <div className="mb-2">
                        {person.isAlive ? (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-[10px] uppercase font-bold">🎉 Ещё с нами!</span>
                        ) : (
                          <span className="px-2 py-1 bg-white/10 text-white/60 rounded text-[10px] uppercase font-bold">✨ В памяти навсегда</span>
                        )}
                      </div>
                      <p className="italic mt-3">"{person.quirkyFact}"</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
        <ReactionBar dateKey={`${dateKey}_${categoryId}`} accentColor="var(--accent-birthday)" />
        <ShareButton cardData={data} category={categoryId} date={dateObj} />
      </div>
    </GlassCard>
  );
};
