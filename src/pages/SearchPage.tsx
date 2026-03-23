import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ru } from 'date-fns/locale/ru';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDayStore } from '../store/useDayStore';
import { useTelegram } from '../telegram/useTelegram';

export const SearchPage: React.FC<{ onDateSelect: () => void }> = ({ onDateSelect }) => {
  const { currentDate, setDate } = useDayStore();
  const { haptic } = useTelegram();
  const [viewDate, setViewDate] = useState(currentDate);

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handlePrevMonth = () => {
    haptic.light();
    setViewDate(subMonths(viewDate, 1));
  };

  const handleNextMonth = () => {
    haptic.light();
    setViewDate(addMonths(viewDate, 1));
  };

  const handleDateClick = (day: Date) => {
    haptic.medium();
    setDate(day);
    onDateSelect();
  };

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  return (
    <div className="flex flex-col gap-6 pt-4">
      <h1 className="text-h1 text-white text-center mb-4">Выбрать дату</h1>
      
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-8">
          <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-bold capitalize">
            {format(viewDate, 'LLLL yyyy', { locale: ru })}
          </h2>
          <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs font-bold text-white/50 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10" />
          ))}
          
          {days.map(day => {
            const isSelected = isSameDay(day, currentDate);
            const isCurrentDay = isToday(day);
            
            return (
              <button
                key={day.toISOString()}
                onClick={() => handleDateClick(day)}
                className={`
                  h-10 w-full rounded-full flex items-center justify-center text-sm font-bold transition-all
                  ${isSelected ? 'bg-[var(--color-cta)] text-white shadow-lg shadow-[var(--color-cta)]/30 scale-110' : ''}
                  ${!isSelected && isCurrentDay ? 'bg-white/10 text-[var(--color-cta)] border border-[var(--color-cta)]/30' : ''}
                  ${!isSelected && !isCurrentDay ? 'hover:bg-white/10 text-white/80' : ''}
                `}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
