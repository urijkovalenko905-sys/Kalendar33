import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTelegram } from '../../telegram/useTelegram';
import { generateShareCard } from '../../utils/shareCard';
import { CategoryId } from '../../types/DayData';

interface ShareButtonProps {
  cardData: any;
  category: CategoryId;
  date: Date;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ cardData, category, date }) => {
  const { haptic, tg } = useTelegram();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleShare = async () => {
    haptic.medium();
    setIsGenerating(true);

    try {
      const blob = await generateShareCard(cardData, category, date);
      const file = new File([blob], `share-${category}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Весёлый Календарь',
          text: 'Смотри, что я нашёл в Весёлом Календаре!',
        });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `share-${category}.png`;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      if (tg?.showAlert) {
        tg.showAlert('Не удалось создать картинку для шеринга.');
      } else {
        window.alert('Не удалось создать картинку для шеринга.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.button
      onClick={handleShare}
      disabled={isGenerating}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 transition-colors"
    >
      <Share2 size={18} />
      <span className="text-sm font-semibold">
        {isGenerating ? 'Создаём...' : 'Поделиться'}
      </span>
    </motion.button>
  );
};
