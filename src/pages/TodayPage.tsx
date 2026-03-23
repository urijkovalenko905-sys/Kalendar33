import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDayStore } from '../store/useDayStore';
import { ScienceCard } from '../components/cards/ScienceCard';
import { FunFactCard } from '../components/cards/FunFactCard';
import { HistoryCard } from '../components/cards/HistoryCard';
import { MemeCard } from '../components/cards/MemeCard';
import { CinemaCard } from '../components/cards/CinemaCard';
import { BirthdaysCard } from '../components/cards/BirthdaysCard';
import { HolidayCard } from '../components/cards/HolidayCard';
import { QuoteCard } from '../components/cards/QuoteCard';
import { SkeletonCard } from '../components/shared/SkeletonCard';
import { EmptyState } from '../components/shared/EmptyState';
import { ErrorState } from '../components/shared/ErrorState';
import { useSwipeNavigation } from '../hooks/useSwipeNavigation';
import { FunCalendarDashboard } from '../components/fun/FunCalendarDashboard';

export const TodayPage: React.FC = () => {
  const {
    data,
    isLoading,
    error,
    activeCategory,
    currentDate,
    fetchData,
    setActiveCategory,
    randomizeCategory,
    selections,
    poolSizes,
  } = useDayStore();
  const containerRef = useRef<HTMLDivElement>(null);

  useSwipeNavigation(containerRef);

  useEffect(() => {
    if (!data && !isLoading) {
      fetchData(currentDate);
    }
  }, [currentDate, data, isLoading, fetchData]);

  const dateKey = currentDate.toISOString().split('T')[0];

  const renderContent = () => {
    if (isLoading) return <SkeletonCard />;
    if (error) return <ErrorState />;
    if (!data) return <EmptyState />;

    switch (activeCategory) {
      case 'science':
        return <ScienceCard data={data.science} dateKey={dateKey} dateObj={currentDate} onRandomize={() => randomizeCategory('science')} currentIndex={selections.science} poolSize={poolSizes.science} />;
      case 'funFact':
        return <FunFactCard data={data.funFact} dateKey={dateKey} dateObj={currentDate} onRandomize={() => randomizeCategory('funFact')} currentIndex={selections.funFact} poolSize={poolSizes.funFact} />;
      case 'history':
        return <HistoryCard data={data.history} dateKey={dateKey} dateObj={currentDate} onRandomize={() => randomizeCategory('history')} currentIndex={selections.history} poolSize={poolSizes.history} />;
      case 'meme':
        return <MemeCard data={data.meme} dateKey={dateKey} dateObj={currentDate} onRandomize={() => randomizeCategory('meme')} currentIndex={selections.meme} poolSize={poolSizes.meme} />;
      case 'cinema':
        return <CinemaCard data={data.cinema} dateKey={dateKey} dateObj={currentDate} onRandomize={() => randomizeCategory('cinema')} currentIndex={selections.cinema} poolSize={poolSizes.cinema} />;
      case 'birthday':
        return <BirthdaysCard data={data.birthdays} dateKey={dateKey} dateObj={currentDate} onRandomize={() => randomizeCategory('birthday')} currentIndex={selections.birthday} poolSize={poolSizes.birthday} />;
      case 'holiday':
        return <HolidayCard data={data.holiday} dateKey={dateKey} dateObj={currentDate} onRandomize={() => randomizeCategory('holiday')} currentIndex={selections.holiday} poolSize={poolSizes.holiday} />;
      case 'quote':
        return <QuoteCard data={data.quote} dateKey={dateKey} dateObj={currentDate} onRandomize={() => randomizeCategory('quote')} currentIndex={selections.quote} poolSize={poolSizes.quote} />;
      default:
        return <EmptyState />;
    }
  };

  return (
    <div ref={containerRef} className="w-full min-h-[50vh]">
      <FunCalendarDashboard
        data={data}
        dateKey={dateKey}
        activeCategory={activeCategory}
        onCategorySelect={setActiveCategory}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={`${dateKey}-${activeCategory}`}
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
