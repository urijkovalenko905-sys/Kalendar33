import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps extends HTMLMotionProps<"div"> {
  category?: 'science' | 'history' | 'cinema' | 'birthday' | 'funFact' | 'meme' | 'holiday' | 'quote';
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  category, 
  children, 
  className,
  ...props 
}) => {
  const categoryClass = category ? `glass-card--${category}` : '';
  const accentColor = category ? `var(--accent-${category})` : 'rgba(255,255,255,0.1)';

  return (
    <motion.div 
      className={cn("glass-card", categoryClass, className)}
      style={{ '--card-accent-color': accentColor } as React.CSSProperties}
      {...props}
    >
      {children}
    </motion.div>
  );
};
