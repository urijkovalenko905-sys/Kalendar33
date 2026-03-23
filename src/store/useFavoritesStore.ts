import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CategoryId } from '../types/DayData';

export interface SavedCard {
  id: string; // date_category
  date: string;
  category: CategoryId;
  title: string;
  preview: string;
  savedAt: number;
}

interface FavoritesStore {
  favorites: SavedCard[];
  
  addFavorite: (card: SavedCard) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      addFavorite: (card) => {
        set((state) => {
          if (state.favorites.some(f => f.id === card.id)) return state;
          return { favorites: [card, ...state.favorites] };
        });
      },
      
      removeFavorite: (id) => {
        set((state) => ({
          favorites: state.favorites.filter(f => f.id !== id)
        }));
      },
      
      isFavorite: (id) => {
        return get().favorites.some(f => f.id === id);
      }
    }),
    {
      name: 'favorites-storage',
    }
  )
);
