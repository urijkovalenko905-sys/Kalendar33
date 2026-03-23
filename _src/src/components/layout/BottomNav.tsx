import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search, Heart, Settings } from 'lucide-react';
import { useTelegram } from '../../telegram/useTelegram';

const NAV_ITEMS = [
  { id: 'today',     label: 'Сегодня',   icon: Calendar },
  { id: 'search',    label: 'Поиск',     icon: Search },
  { id: 'favorites', label: 'Избранное', icon: Heart },
  { id: 'settings',  label: 'Настройки', icon: Settings },
];

interface BottomNavProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { haptic } = useTelegram();

  const handleTabClick = (id: string) => {
    if (id !== activeTab) {
      haptic.light();
      onTabChange(id);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[72px] pb-[env(safe-area-inset-bottom)] bg-[#0C0C1A]/85 backdrop-blur-xl border-t border-white/5 flex items-center justify-around z-50">
      {NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.id;
        const Icon = item.icon;
        
        return (
          <button
            key={item.id}
            onClick={() => handleTabClick(item.id)}
            className="relative flex flex-col items-center justify-center w-[60px] h-[60px] transition-transform active:scale-95"
          >
            <motion.div
              animate={{
                scale: isActive ? 1.1 : 1,
                color: isActive ? 'var(--color-cta)' : 'var(--text-tertiary)'
              }}
              transition={{ duration: 0.15 }}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </motion.div>
            <span 
              className="text-[10px] mt-1 tracking-[0.5px] transition-colors duration-150"
              style={{ color: isActive ? 'var(--color-cta)' : 'var(--text-tertiary)' }}
            >
              {item.label}
            </span>
            {isActive && (
              <motion.div
                layoutId="bottomNavIndicator"
                className="absolute -top-[1px] w-8 h-[2px] bg-[var(--color-cta)] rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
