"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { usePlaylistStore } from "@/store/playlist-store";
import { VideoLayout } from "@/components/video/video-layout";
import { use } from "react";

export default function PlaylistPage({ params }: { params: { id: string } }) {
  const playlists = usePlaylistStore((state) => state.playlists);
  const [playlist, setPlaylist] = useState(null);
  const playlistId = use(params).id;

  useEffect(() => {
    const foundPlaylist = playlists.find(p => p.id === playlistId && !p.isDraft);
    if (foundPlaylist) {
      setPlaylist(foundPlaylist);
    }
  }, [playlistId, playlists]);

  if (!playlist) return null;

  return (
    <VideoLayout 
      playlist={playlist}
      initialVideoIndex={0}
    />
  );
} 