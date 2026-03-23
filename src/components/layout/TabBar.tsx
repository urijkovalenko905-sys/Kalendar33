import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useDayStore } from '../../store/useDayStore';
import { CategoryId } from '../../types/DayData';
import { useTelegram } from '../../telegram/useTelegram';

const TABS: { id: CategoryId; label: string; emoji: string; accent: string }[] = [
  { id: 'science', label: 'Наука', emoji: '🔬', accent: 'var(--accent-science)' },
  { id: 'funFact', label: 'Факт', emoji: '🌀', accent: 'var(--accent-fun)' },
  { id: 'history', label: 'История', emoji: '📜', accent: 'var(--accent-history)' },
  { id: 'meme', label: 'Поп', emoji: '🐣', accent: 'var(--accent-meme)' },
  { id: 'cinema', label: 'Кино', emoji: '🎬', accent: 'var(--accent-cinema)' },
  { id: 'birthday', label: 'Рожд.', emoji: '🎂', accent: 'var(--accent-birthday)' },
  { id: 'holiday', label: 'Праздн.', emoji: '🌍', accent: 'var(--accent-holiday)' },
  { id: 'quote', label: 'Память', emoji: '🕯', accent: 'var(--accent-quote)' },
];

export const TabBar: React.FC = () => {
  const { activeCategory, setActiveCategory } = useDayStore();
  const { haptic } = useTelegram();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [activeCategory]);

  const handleTabClick = (id: CategoryId) => {
    if (id !== activeCategory) {
      haptic.light();
      setActiveCategory(id);
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      className="no-scrollbar sticky top-0 z-20 flex items-center gap-2 overflow-x-auto border-b border-white/5 bg-[#0C0C1A] px-4 py-4 snap-x snap-mandatory"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {TABS.map((tab) => {
        const isActive = activeCategory === tab.id;

        return (
          <button
            key={tab.id}
            ref={isActive ? activeTabRef : null}
            onClick={() => handleTabClick(tab.id)}
            className="relative flex h-10 snap-center items-center gap-2 whitespace-nowrap rounded-full px-4 transition-colors duration-300"
            style={{
              backgroundColor: isActive ? `color-mix(in srgb, ${tab.accent} 15%, transparent)` : 'transparent',
              color: isActive ? tab.accent : 'var(--text-secondary)',
              border: isActive ? `1px solid ${tab.accent}` : '1px solid transparent',
            }}
          >
            <span className="text-lg">{tab.emoji}</span>
            <span className="text-label">{tab.label}</span>
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                className="pointer-events-none absolute inset-0 rounded-full border border-current"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
