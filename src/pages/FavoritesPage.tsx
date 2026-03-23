import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Heart } from 'lucide-react';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { useTelegram } from '../telegram/useTelegram';

export const FavoritesPage: React.FC = () => {
  const { favorites, removeFavorite } = useFavoritesStore();
  const { haptic } = useTelegram();

  const handleRemove = (id: string) => {
    haptic.medium();
    removeFavorite(id);
  };

  const groupedFavorites = favorites.reduce((acc, card) => {
    if (!acc[card.date]) acc[card.date] = [];
    acc[card.date].push(card);
    return acc;
  }, {} as Record<string, typeof favorites>);

  return (
    <div className="flex flex-col gap-6 pt-4 pb-24">
      <h1 className="text-h1 text-white text-center mb-4">Избранное</h1>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-24 h-24 mb-6 rounded-full bg-white/5 flex items-center justify-center text-[var(--color-cta)]/50">
            <Heart size={48} />
          </div>
          <h2 className="text-h2 text-white mb-3">Здесь пока пусто</h2>
          <p className="text-body text-white/60 mb-8 max-w-xs">
            Сохраняйте интересные карточки, нажав ❤️, чтобы вернуться к ним позже.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {Object.entries(groupedFavorites).map(([date, cards]) => (
            <div key={date} className="flex flex-col gap-4">
              <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest px-2">
                {date}
              </h3>
              <div className="flex flex-col gap-3">
                <AnimatePresence>
                  {cards.map(card => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-bold text-[var(--accent-science)] uppercase tracking-wider mb-1">
                          {card.category}
                        </div>
                        <h4 className="text-white font-bold truncate mb-1">{card.title}</h4>
                        <p className="text-xs text-white/60 truncate">{card.preview}</p>
                      </div>
                      <button
                        onClick={() => handleRemove(card.id)}
                        className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
