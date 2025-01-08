import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WatchLaterStore {
  watchLater: string[];
  addToWatchLater: (playlistId: string) => void;
  removeFromWatchLater: (playlistId: string) => void;
  isInWatchLater: (playlistId: string) => boolean;
}

export const useWatchLaterStore = create<WatchLaterStore>()(
  persist(
    (set, get) => ({
      watchLater: [],
      addToWatchLater: (playlistId) => {
        if (!get().isInWatchLater(playlistId)) {
          set((state) => ({
            watchLater: [...state.watchLater, playlistId]
          }));
        }
      },
      removeFromWatchLater: (playlistId) => {
        set((state) => ({
          watchLater: state.watchLater.filter(id => id !== playlistId)
        }));
      },
      isInWatchLater: (playlistId) => {
        return get().watchLater.includes(playlistId);
      }
    }),
    {
      name: 'watch-later-storage'
    }
  )
); 