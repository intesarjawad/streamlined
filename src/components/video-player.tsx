'use client';

import { useEffect } from 'react';
import { useContinueWatchingStore } from "@/store/continue-watching-store";

interface VideoPlayerProps {
  playlistId: string;
  videoIndex: number;
  // ... other props
}

export function VideoPlayer({ playlistId, videoIndex, ...props }: VideoPlayerProps) {
  const { addToHistory } = useContinueWatchingStore();

  useEffect(() => {
    // Update continue watching when video starts
    addToHistory(playlistId, videoIndex);
  }, [playlistId, videoIndex, addToHistory]);

  return (
    // ... existing video player code
  );
} 