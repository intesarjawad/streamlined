import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ContinueWatching {
  playlistId: string;
  videoIndex: number;
  lastWatched: Date;
}

interface ContinueWatchingStore {
  items: ContinueWatching[];
  addToHistory: (playlistId: string, videoIndex: number) => void;
  removeFromHistory: (playlistId: string) => void;
}

export const useContinueWatchingStore = create<ContinueWatchingStore>()(
  persist(
    (set, get) => ({
      items: [],
      addToHistory: (playlistId, videoIndex) => {
        set((state) => {
          const filtered = state.items.filter(item => item.playlistId !== playlistId);
          return {
            items: [
              {
                playlistId,
                videoIndex,
                lastWatched: new Date()
              },
              ...filtered
            ].slice(0, 20) // Keep only last 20 items
          };
        });
      },
      removeFromHistory: (playlistId) => {
        set((state) => ({
          items: state.items.filter(item => item.playlistId !== playlistId)
        }));
      }
    }),
    {
      name: 'continue-watching-storage'
    }
  )
); 