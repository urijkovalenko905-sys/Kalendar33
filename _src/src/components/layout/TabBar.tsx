import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDayStore } from '../../store/useDayStore';
import { CategoryId } from '../../types/DayData';
import { useTelegram } from '../../telegram/useTelegram';

const TABS: { id: CategoryId; label: string; emoji: string; accent: string }[] = [
  { id: 'science',  label: 'Наука',    emoji: '🔬', accent: 'var(--accent-science)'  },
  { id: 'funFact',  label: 'Факт',     emoji: '😂', accent: 'var(--accent-fun)'      },
  { id: 'history',  label: 'История',  emoji: '📜', accent: 'var(--accent-history)'  },
  { id: 'meme',     label: 'Мем',      emoji: '🐣', accent: 'var(--accent-meme)'     },
  { id: 'cinema',   label: 'Кино',     emoji: '🎬', accent: 'var(--accent-cinema)'   },
  { id: 'birthday', label: 'ДР',       emoji: '🎂', accent: 'var(--accent-birthday)' },
  { id: 'holiday',  label: 'Праздник', emoji: '🌍', accent: 'var(--accent-holiday)'  },
  { id: 'quote',    label: 'Цитата',   emoji: '💡', accent: 'var(--accent-quote)'    },
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
        block: 'nearest'
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
      className="flex items-center gap-2 overflow-x-auto no-scrollbar py-4 px-4 snap-x snap-mandatory bg-[#0C0C1A] sticky top-0 z-20 border-b border-white/5"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {TABS.map((tab) => {
        const isActive = activeCategory === tab.id;
        return (
          <button
            key={tab.id}
            ref={isActive ? activeTabRef : null}
            onClick={() => handleTabClick(tab.id)}
            className="relative flex items-center gap-2 h-10 px-4 rounded-full snap-center whitespace-nowrap transition-colors duration-300"
            style={{
              backgroundColor: isActive ? `color-mix(in srgb, ${tab.accent} 15%, transparent)` : 'transparent',
              color: isActive ? tab.accent : 'var(--text-secondary)',
              border: isActive ? `1px solid ${tab.accent}` : '1px solid transparent'
            }}
          >
            <span className="text-lg">{tab.emoji}</span>
            <span className="text-label">{tab.label}</span>
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute inset-0 rounded-full border border-current pointer-events-none"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
