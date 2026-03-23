import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useDayStore } from '../../store/useDayStore';

export const ErrorState: React.FC = () => {
  const { fetchData, currentDate } = useDayStore();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-24 h-24 mb-6 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
        <AlertTriangle size={48} />
      </div>
      <h2 className="text-h2 text-white mb-3">Что-то пошло не так</h2>
      <p className="text-body text-white/60 mb-8 max-w-xs">
        Не удалось загрузить контент. Проверьте подключение к интернету.
      </p>
      <button 
        onClick={() => fetchData(currentDate)}
        className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl active:scale-95 transition-transform"
      >
        Попробовать снова
      </button>
    </div>
  );
};
