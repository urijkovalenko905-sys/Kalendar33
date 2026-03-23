import React from 'react';
import { Shuffle } from 'lucide-react';
import { motion } from 'framer-motion';

interface RandomizeButtonProps {
  onClick: () => void;
  currentIndex: number;
  poolSize: number;
}

export const RandomizeButton: React.FC<RandomizeButtonProps> = ({
  onClick,
  currentIndex,
  poolSize,
}) => {
  const disabled = poolSize <= 1;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={disabled ? undefined : { scale: 0.95 }}
      disabled={disabled}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white/75 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Shuffle size={14} />
      <span>Рандомайзер</span>
      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px]">
        {Math.min(poolSize, currentIndex + 1)}/{poolSize}
      </span>
    </motion.button>
  );
};
