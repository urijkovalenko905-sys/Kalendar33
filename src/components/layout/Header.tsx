import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDayStore } from '../../store/useDayStore';
import { formatRussianDate, formatRussianDayOfWeek, getRelativeDateLabel, getMonthGradient } from '../../utils/dateHelpers';
import { useTelegram } from '../../telegram/useTelegram';

export const Header: React.FC = () => {
  const { currentDate, navigateDay } = useDayStore();
  const { haptic } = useTelegram();

  const handlePrev = () => {
    haptic.light();
    navigateDay('prev');
  };

  const handleNext = () => {
    haptic.light();
    navigateDay('next');
  };

  const dayOfWeek = formatRussianDayOfWeek(currentDate);
  const formattedDate = formatRussianDate(currentDate);
  const relativeLabel = getRelativeDateLabel(currentDate);
  const bgGradient = getMonthGradient(currentDate);

  return (
    <div 
      className="relative w-full h-[140px] flex flex-col justify-center items-center overflow-hidden transition-all duration-500"
      style={{ background: bgGradient }}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-black/20 animate-hue-rotate pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-4 flex items-center justify-between">
        <button 
          onClick={handlePrev}
          className="w-11 h-11 flex items-center justify-center text-white/60 hover:text-white transition-colors active:scale-90"
        >
          <ChevronLeft size={28} />
        </button>

        <div className="flex flex-col items-center text-center flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDate.toISOString()}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="text-caption text-white/70 mb-1 tracking-[3px] uppercase">
                {dayOfWeek}
              </div>
              <div className="text-display text-white mb-2">
                {formattedDate.split(' ')[0]} {formattedDate.split(' ')[1]}
              </div>
              <div className="text-h3 text-white/90">
                {formattedDate.split(' ')[2]}
              </div>
            </motion.div>
          </AnimatePresence>

          {relativeLabel === 'СЕГОДНЯ' && (
            <div className="mt-2 px-3 py-1 bg-[#FF6B6B] text-white text-[10px] font-bold rounded-lg tracking-wider" style={{ animation: 'todayPulse 2s infinite' }}>
              ● {relativeLabel}
            </div>
          )}
        </div>

        <button 
          onClick={handleNext}
          className="w-11 h-11 flex items-center justify-center text-white/60 hover:text-white transition-colors active:scale-90"
        >
          <ChevronRight size={28} />
        </button>
      </div>
    </div>
  );
};
