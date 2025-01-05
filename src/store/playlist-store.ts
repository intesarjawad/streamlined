import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Video {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  url: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  videos: Video[];
  tags?: string[];
  isDraft: boolean;
  createdAt: Date;
  updatedAt: Date;
  youtubeUrl: string;
}

interface PlaylistStore {
  playlists: Playlist[];
  addPlaylist: (playlist: Omit<Playlist, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePlaylist: (id: string, playlist: Partial<Playlist>) => void;
  deletePlaylist: (id: string) => void;
}

export const usePlaylistStore = create<PlaylistStore>()(
  persist(
    (set) => ({
      playlists: [],
      addPlaylist: (playlist) => 
        set((state) => ({
          playlists: [
            ...state.playlists,
            {
              ...playlist,
              id: crypto.randomUUID(),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        })),
      updatePlaylist: (id, updatedPlaylist) =>
        set((state) => ({
          playlists: state.playlists.map((playlist) => 
            playlist.id === id 
              ? {
                  ...playlist,
                  ...updatedPlaylist,
                  isDraft: updatedPlaylist.isDraft,
                  updatedAt: new Date()
                }
              : playlist
          ),
        })),
      deletePlaylist: (id) =>
        set((state) => ({
          playlists: state.playlists.filter((p) => p.id !== id),
        })),
    }),
    {
      name: 'playlist-storage',
    }
  )
); 