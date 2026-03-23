import { create } from 'zustand';
import { addDays, subDays } from 'date-fns';
import { CategoryId, DayCategoryPools, DayData } from '../types/DayData';
import { fetchOnThisDayPools } from '../api/onThisDayService';

type CategorySelections = Record<CategoryId, number>;
type PoolSizes = Record<CategoryId, number>;

const DEFAULT_SELECTIONS: CategorySelections = {
  science: 0,
  funFact: 0,
  history: 0,
  meme: 0,
  cinema: 0,
  birthday: 0,
  holiday: 0,
  quote: 0,
};

const DEFAULT_POOL_SIZES: PoolSizes = {
  science: 1,
  funFact: 1,
  history: 1,
  meme: 1,
  cinema: 1,
  birthday: 1,
  holiday: 1,
  quote: 1,
};

interface DayStore {
  currentDate: Date;
  data: DayData | null;
  pools: DayCategoryPools | null;
  isLoading: boolean;
  error: string | null;
  activeCategory: CategoryId;
  selections: CategorySelections;
  poolSizes: PoolSizes;

  setDate: (date: Date) => void;
  navigateDay: (direction: 'prev' | 'next') => void;
  goToToday: () => void;
  setActiveCategory: (id: CategoryId) => void;
  fetchData: (date: Date) => Promise<void>;
  randomizeCategory: (id: CategoryId) => void;
}

function buildDayData(date: Date, pools: DayCategoryPools, selections: CategorySelections): DayData {
  return {
    date: date.toISOString().split('T')[0],
    science: pools.science[selections.science] ?? pools.science[0],
    funFact: pools.funFact[selections.funFact] ?? pools.funFact[0],
    history: pools.history[selections.history] ?? pools.history[0],
    meme: pools.meme[selections.meme] ?? pools.meme[0],
    cinema: pools.cinema[selections.cinema] ?? pools.cinema[0],
    birthdays: pools.birthday[selections.birthday] ?? pools.birthday[0] ?? [],
    holiday: pools.holiday[selections.holiday] ?? pools.holiday[0],
    quote: pools.quote[selections.quote] ?? pools.quote[0],
  };
}

function buildPoolSizes(pools: DayCategoryPools): PoolSizes {
  return {
    science: Math.max(1, pools.science.length),
    funFact: Math.max(1, pools.funFact.length),
    history: Math.max(1, pools.history.length),
    meme: Math.max(1, pools.meme.length),
    cinema: Math.max(1, pools.cinema.length),
    birthday: Math.max(1, pools.birthday.length),
    holiday: Math.max(1, pools.holiday.length),
    quote: Math.max(1, pools.quote.length),
  };
}

function nextRandomIndex(currentIndex: number, length: number) {
  if (length <= 1) {
    return currentIndex;
  }

  let nextIndex = currentIndex;
  while (nextIndex === currentIndex) {
    nextIndex = Math.floor(Math.random() * length);
  }

  return nextIndex;
}

export const useDayStore = create<DayStore>((set, get) => ({
  currentDate: new Date(),
  data: null,
  pools: null,
  isLoading: false,
  error: null,
  activeCategory: 'science',
  selections: DEFAULT_SELECTIONS,
  poolSizes: DEFAULT_POOL_SIZES,

  setDate: (date) => {
    set({ currentDate: date });
    void get().fetchData(date);
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
      const pools = await fetchOnThisDayPools(date);
      const selections = { ...DEFAULT_SELECTIONS };

      set({
        pools,
        selections,
        poolSizes: buildPoolSizes(pools),
        data: buildDayData(date, pools, selections),
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Failed to load date-accurate data', error);
      set({
        data: null,
        pools: null,
        isLoading: false,
        error: 'Не удалось загрузить точные события этой даты',
      });
    }
  },

  randomizeCategory: (id) => {
    const { pools, selections, currentDate } = get();

    if (!pools) {
      return;
    }

    const length = id === 'birthday' ? pools.birthday.length : pools[id].length;
    const nextSelections = {
      ...selections,
      [id]: nextRandomIndex(selections[id], length),
    } as CategorySelections;

    set({
      selections: nextSelections,
      data: buildDayData(currentDate, pools, nextSelections),
    });
  },
}));
