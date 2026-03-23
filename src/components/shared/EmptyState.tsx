import React from 'react';
import { CalendarX2 } from 'lucide-react';
import { useDayStore } from '../../store/useDayStore';

export const EmptyState: React.FC = () => {
  const { goToToday } = useDayStore();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-24 h-24 mb-6 rounded-full bg-white/5 flex items-center justify-center text-white/20">
        <CalendarX2 size={48} />
      </div>
      <h2 className="text-h2 text-white mb-3">Мы ещё не добрались до этой даты 👀</h2>
      <p className="text-body text-white/60 mb-8 max-w-xs">
        Попробуйте другую дату или вернитесь к сегодняшнему дню, чтобы узнать что-то новое.
      </p>
      <button 
        onClick={goToToday}
        className="px-6 py-3 bg-[var(--color-cta)] text-white font-bold rounded-xl active:scale-95 transition-transform"
      >
        Вернуться к сегодня
      </button>
    </div>
  );
};
