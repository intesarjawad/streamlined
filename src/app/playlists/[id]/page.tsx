"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { usePlaylistStore } from "@/store/playlist-store";
import { VideoPlayer } from "@/components/video/video-player";
import { PlaylistSidebar } from "@/components/video/playlist-sidebar";
import { motion } from "motion/react";

export default function PlaylistPage() {
  const params = useParams();
  const playlists = usePlaylistStore((state) => state.playlists);
  const [playlist, setPlaylist] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    const playlistId = params.id as string;
    const foundPlaylist = playlists.find(p => p.id === playlistId && !p.isDraft);
    if (foundPlaylist) {
      setPlaylist(foundPlaylist);
    }
  }, [params.id, playlists]);

  if (!playlist) return null;

  const currentVideo = playlist.videos[currentVideoIndex];

  return (
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,350px] h-screen">
        {/* Video Player Section */}
        <div className="relative flex flex-col">
          <motion.div 
            layout 
            className="w-full aspect-video bg-black"
          >
            <VideoPlayer
              key={currentVideo.id}
              videoId={currentVideo.id}
              title={currentVideo.title}
              onEnded={() => {
                if (currentVideoIndex < playlist.videos.length - 1) {
                  setCurrentVideoIndex(prev => prev + 1);
                }
              }}
            />
          </motion.div>

          <div className="p-6">
            <h1 className="text-2xl font-bold">{currentVideo.title}</h1>
            <p className="text-muted-foreground mt-2">
              Video {currentVideoIndex + 1} of {playlist.videos.length}
            </p>
          </div>
        </div>

        {/* Playlist Sidebar */}
        <PlaylistSidebar
          playlist={playlist}
          currentVideoIndex={currentVideoIndex}
          onVideoSelect={setCurrentVideoIndex}
        />
      </div>
    </div>
  );
} 