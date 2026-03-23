import React from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useReactionsStore } from '../../store/useReactionsStore';
import { useTelegram } from '../../telegram/useTelegram';

const REACTIONS = ['🤯', '😂', '🔥', '❤️', '👏'];

interface ReactionBarProps {
  dateKey: string;
  accentColor: string;
}

export const ReactionBar: React.FC<ReactionBarProps> = ({ dateKey, accentColor }) => {
  const { reactions, userReactions, addReaction, removeReaction, hasReacted } = useReactionsStore();
  const { haptic } = useTelegram();

  const currentReactions = reactions[dateKey] || {};

  const handleReaction = (emoji: string, e: React.MouseEvent<HTMLButtonElement>) => {
    haptic.medium();
    const isReacted = hasReacted(dateKey, emoji);

    if (isReacted) {
      removeReaction(dateKey, emoji);
    } else {
      addReaction(dateKey, emoji);
      
      // Fire confetti from button position
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { x, y },
        colors: [accentColor, '#FFFFFF', '#FF6B6B'],
        disableForReducedMotion: true,
        zIndex: 100
      });
    }
  };

  return (
    <div className="flex items-center gap-2 mt-4">
      {REACTIONS.map((emoji) => {
        const count = currentReactions[emoji] || 0;
        const isReacted = hasReacted(dateKey, emoji);

        return (
          <motion.button
            key={emoji}
            onClick={(e) => handleReaction(emoji, e)}
            whileTap={{ scale: 1.5 }}
            transition={{ type: 'spring', mass: 0.3, stiffness: 400 }}
            className="flex items-center justify-center gap-1 h-9 px-2 rounded-xl transition-colors duration-200"
            style={{
              backgroundColor: isReacted ? `color-mix(in srgb, ${accentColor} 15%, transparent)` : 'rgba(255,255,255,0.05)',
              border: isReacted ? `1px solid color-mix(in srgb, ${accentColor} 35%, transparent)` : '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <span className="text-lg leading-none">{emoji}</span>
            {count > 0 && (
              <span className="text-xs font-semibold text-[var(--text-tertiary)]">
                {count}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};
