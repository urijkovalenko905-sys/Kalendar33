import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ReactionsStore {
  reactions: Record<string, Record<string, number>>;  // date_category → emoji → count
  userReactions: Record<string, string[]>;            // date_category → emoji[]
  
  addReaction: (dateKey: string, emoji: string) => void;
  removeReaction: (dateKey: string, emoji: string) => void;
  hasReacted: (dateKey: string, emoji: string) => boolean;
}

export const useReactionsStore = create<ReactionsStore>()(
  persist(
    (set, get) => ({
      reactions: {},
      userReactions: {},
      
      addReaction: (dateKey, emoji) => {
        set((state) => {
          const currentReactions = state.reactions[dateKey] || {};
          const currentUserReactions = state.userReactions[dateKey] || [];
          
          if (currentUserReactions.includes(emoji)) return state; // Already reacted
          
          return {
            reactions: {
              ...state.reactions,
              [dateKey]: {
                ...currentReactions,
                [emoji]: (currentReactions[emoji] || 0) + 1
              }
            },
            userReactions: {
              ...state.userReactions,
              [dateKey]: [...currentUserReactions, emoji]
            }
          };
        });
      },
      
      removeReaction: (dateKey, emoji) => {
        set((state) => {
          const currentReactions = state.reactions[dateKey] || {};
          const currentUserReactions = state.userReactions[dateKey] || [];
          
          if (!currentUserReactions.includes(emoji)) return state; // Hasn't reacted
          
          return {
            reactions: {
              ...state.reactions,
              [dateKey]: {
                ...currentReactions,
                [emoji]: Math.max(0, (currentReactions[emoji] || 1) - 1)
              }
            },
            userReactions: {
              ...state.userReactions,
              [dateKey]: currentUserReactions.filter(e => e !== emoji)
            }
          };
        });
      },
      
      hasReacted: (dateKey, emoji) => {
        const userReactions = get().userReactions[dateKey] || [];
        return userReactions.includes(emoji);
      }
    }),
    {
      name: 'reactions-storage',
    }
  )
);
