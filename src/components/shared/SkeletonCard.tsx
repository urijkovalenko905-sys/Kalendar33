import React from 'react';
import { motion } from 'framer-motion';

export const SkeletonCard: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full flex flex-col gap-4"
    >
      <div className="skeleton w-full h-[240px]" />
      <div className="flex gap-4">
        <div className="skeleton w-1/2 h-[80px]" />
        <div className="skeleton w-1/2 h-[80px]" />
      </div>
      <div className="skeleton w-full h-[120px]" />
    </motion.div>
  );
};
