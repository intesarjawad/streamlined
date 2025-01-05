"use client";

import { motion } from "motion/react";
import { Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/format";
import { typographyStyles } from "@/lib/typography-styles";

interface Video {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
}

interface PlaylistSidebarProps {
  playlist: {
    name: string;
    videos: Video[];
  };
  currentVideoIndex: number;
  onVideoSelect: (index: number) => void;
}

export function PlaylistSidebar({
  playlist,
  currentVideoIndex,
  onVideoSelect,
}: PlaylistSidebarProps) {
  return (
    <div className="h-screen bg-black/20 border-l border-white/5">
      <div className="p-4 border-b border-white/5">
        <h2 className={typographyStyles.sectionTitle}>Course Videos</h2>
        <p className={typographyStyles.cardSubtitle}>
          {playlist.videos.length} {playlist.videos.length === 1 ? 'video' : 'videos'}
        </p>
      </div>

      <ScrollArea className="h-[calc(100vh-5rem)]">
        <div className="p-4 space-y-2">
          {playlist.videos.map((video, index) => (
            <motion.button
              key={video.id}
              layout
              onClick={() => onVideoSelect(index)}
              className={cn(
                "w-full flex gap-3 p-2 rounded-lg transition-colors text-left group",
                "hover:bg-white/5",
                currentVideoIndex === index && "bg-white/10"
              )}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={video.thumbnail}
                  alt=""
                  className="w-32 h-20 object-cover rounded"
                />
                <div className="absolute bottom-1 right-1 bg-black/80 px-1 rounded text-xs">
                  {formatDuration(video.duration)}
                </div>
                {currentVideoIndex === index && (
                  <div className="absolute inset-0 bg-neon-blue/20 rounded" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm line-clamp-2",
                  currentVideoIndex === index ? "text-neon-blue" : "group-hover:text-white/90"
                )}>
                  {video.title}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatDuration(video.duration)}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
} 