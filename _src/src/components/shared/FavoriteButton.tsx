import React from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFavoritesStore, SavedCard } from '../../store/useFavoritesStore';
import { useTelegram } from '../../telegram/useTelegram';

interface FavoriteButtonProps {
  card: SavedCard;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ card }) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const { haptic } = useTelegram();

  const isFav = isFavorite(card.id);

  const toggleFavorite = () => {
    haptic.medium();
    if (isFav) {
      removeFavorite(card.id);
    } else {
      addFavorite(card);
    }
  };

  return (
    <motion.button
      onClick={toggleFavorite}
      whileTap={{ scale: 0.8 }}
      className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
    >
      <motion.div
        animate={{ scale: isFav ? [1, 1.2, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heart 
          size={20} 
          fill={isFav ? '#FF6B6B' : 'transparent'} 
          color={isFav ? '#FF6B6B' : 'rgba(255,255,255,0.6)'} 
        />
      </motion.div>
    </motion.button>
  );
};
