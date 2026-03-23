import { create } from 'zustand';
import { addDays, subDays } from 'date-fns';
import { DayData, CategoryId } from '../types/DayData';
import { getMockDataForDate } from '../api/mockData';
import { fetchDayDataFromGemini } from '../api/geminiService';

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
  isLoading: true,
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
      // Try to fetch real data from Gemini
      const data = await fetchDayDataFromGemini(date);
      set({ data, isLoading: false });
    } catch (error) {
      console.error('Gemini fetch failed, falling back to mock data', error);
      // Fallback to mock data if Gemini fails
      const data = getMockDataForDate(date);
      set({ data, isLoading: false });
    }
  }
}));


