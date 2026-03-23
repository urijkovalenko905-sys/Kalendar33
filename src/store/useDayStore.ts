import { create } from 'zustand';
import { addDays, subDays } from 'date-fns';
import { DayData, CategoryId } from '../types/DayData';
import { getMockDataForDate } from '../api/mockData';

interface DayStore {
  currentDate: Date;
  data: DayData | null;
  isLoading: boolean;
  error: string | null;
  activeCategory: CategoryId;
  
  setDate: (date: Date) => void;
  navigateDay: (direction: 'prev' | 'next') => void;
  goToToday: () => void;
  setActiveCategory: (id: CategoryId) => void;
  fetchData: (date: Date) => Promise<void>;
}

export const useDayStore = create<DayStore>((set, get) => ({
  currentDate: new Date(),
  data: null,
  isLoading: false,
  error: null,
  activeCategory: 'science',
  
  setDate: (date) => {
    set({ currentDate: date });
    get().fetchData(date);
  },
  
  navigateDay: (direction) => {
    const newDate = direction === 'next' 
      ? addDays(get().currentDate, 1) 
      : subDays(get().currentDate, 1);
    get().setDate(newDate);
  },
  
  goToToday: () => {
    get().setDate(new Date());
  },
  
  setActiveCategory: (id) => set({ activeCategory: id }),
  
  fetchData: async (date) => {
    set({ isLoading: true, error: null });
    try {
      const data = getMockDataForDate(date);
      set({ data, isLoading: false, error: null });
    } catch (error) {
      console.error('Failed to prepare day data', error);
      set({ data: null, isLoading: false, error: 'Не удалось загрузить данные дня' });
    }
  }
}));

