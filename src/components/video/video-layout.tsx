"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { VideoPlayer } from "./video-player";
import { PlaylistSidebar } from "./playlist-sidebar";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { MagicCard } from "@/components/ui/magic-card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface VideoLayoutProps {
  playlist: {
    name: string;
    videos: Array<{
      id: string;
      title: string;
      duration: string;
      thumbnail: string;
    }>;
  };
  initialVideoIndex?: number;
}

// Add these constants at the top for consistent animations
const TRANSITION_DURATION = 0.3;
const TRANSITION_EASE = [0.1, 0.1, 0.25, 1.0]; // More linear easing

// For the sidebar specifically, let's use an even simpler easing
const SIDEBAR_TRANSITION = {
  duration: 0.3,
  ease: [0.2, 0, 0, 1], // Near-linear with slight ease-out
  layout: {
    duration: 0.3,
    ease: [0.2, 0, 0, 1]
  }
};

export function VideoLayout({ playlist, initialVideoIndex = 0 }: VideoLayoutProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(initialVideoIndex);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const currentVideo = playlist.videos[currentVideoIndex];

  const handleVideoEnd = () => {
    if (currentVideoIndex < playlist.videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects with smoother transitions */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-black via-background to-background opacity-80"
        layout
        transition={{ duration: TRANSITION_DURATION, ease: TRANSITION_EASE }}
      />

      {/* Content */}
      <div className="relative flex h-screen">
        {/* Main Content Area */}
        <motion.div
          layout
          className={cn(
            "flex-1 flex flex-col",
            "h-screen",
            "p-8"
          )}
          transition={{
            duration: 0.2,
            ease: "easeInOut"
          }}
        >
          {/* Video Container */}
          <motion.div 
            layout
            className="relative w-full"
            style={{ 
              maxHeight: "calc(100vh - 120px)",
              height: "calc((100vw - 400px) * 0.5625)"
            }}
          >
            <MagicCard className="w-full h-full">
              <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
                <VideoPlayer
                  videoId={currentVideo.id}
                  title={currentVideo.title}
                  onEnded={handleVideoEnd}
                />
              </div>
            </MagicCard>
          </motion.div>

          {/* Video Count */}
          <div className="mt-3 flex items-center gap-2 text-white/60">
            <Clock className="h-4 w-4" />
            <span>Video {currentVideoIndex + 1} of {playlist.videos.length}</span>
          </div>
        </motion.div>

        {/* Playlist Sidebar */}
        <motion.div
          layout
          className="h-screen border-l border-white/5"
          style={{
            width: isSidebarCollapsed ? '0' : '350px',
            overflow: 'hidden'
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut"
          }}
        >
          <PlaylistSidebar
            playlist={playlist}
            currentVideoIndex={currentVideoIndex}
            onVideoSelect={setCurrentVideoIndex}
            isCollapsed={isSidebarCollapsed}
            onCollapsedChange={setIsSidebarCollapsed}
            className="rounded-l-lg"
          />
        </motion.div>

        {/* Collapse Button */}
        <div className="absolute right-[350px] top-1/2 -translate-y-1/2 z-10" 
          style={{
            right: isSidebarCollapsed ? '0' : '350px',
            transition: 'right 0.2s ease-in-out'
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={cn(
              "bg-black/60 hover:bg-black/80",
              "border border-white/10 hover:border-neon-blue/30",
              "w-6 h-12 rounded-l-lg rounded-r-none",
              "transition-colors",
              "hover:text-neon-blue"
            )}
          >
            <motion.div
              animate={{ rotate: isSidebarCollapsed ? 0 : 180 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          </Button>
        </div>
      </div>

      {/* Subtle glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon-blue/20 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-10 bg-[conic-gradient(from_90deg_at_50%_50%,_var(--tw-gradient-stops))] from-neon-blue/10 via-transparent to-neon-blue/10" />
      </div>
    </div>
  );
} 