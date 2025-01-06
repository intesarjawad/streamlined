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
      {/* Background Effects */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-black via-background to-background opacity-80"
        layout
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />

      {/* Content */}
      <div className="relative flex flex-col lg:flex-row h-screen">
        {/* Main Content Area */}
        <motion.div
          layout
          className={cn(
            "flex-1 flex flex-col",
            // Desktop sizing and padding
            "lg:p-8 lg:max-h-screen",
            // Mobile sizing and padding - reduced video height to leave room for sidebar
            "p-4 max-h-[45vh] sm:max-h-[50vh]", // Reduced from 60vh/65vh
            // Width handling
            "w-full lg:max-w-[calc(100%-350px)]",
            isSidebarCollapsed && "lg:max-w-[calc(100%-60px)]",
            "transition-all duration-300 ease-in-out"
          )}
        >
          {/* Video Container */}
          <div className="relative w-full h-full">
            <div className="absolute inset-0">
              <MagicCard className="w-full h-full">
                <div className="relative w-full h-full">
                  <VideoPlayer
                    videoId={currentVideo.id}
                    title={currentVideo.title}
                    onEnded={handleVideoEnd}
                  />
                </div>
              </MagicCard>
            </div>
          </div>

          {/* Video Count */}
          <div className="mt-4 flex items-center gap-2 text-white/60">
            <Clock className="h-4 w-4" />
            <span>Video {currentVideoIndex + 1} of {playlist.videos.length}</span>
          </div>
        </motion.div>

        {/* Playlist Sidebar */}
        <motion.div
          layout
          className={cn(
            // Mobile: Fixed height with vertical scroll
            "h-[45vh] w-full overflow-y-auto lg:overflow-visible",
            // Desktop: Full height, fixed width
            "lg:h-screen lg:flex-none lg:w-[350px]",
            // Border styles
            "border-t lg:border-l border-white/5",
            // Collapse handling
            isSidebarCollapsed && "lg:w-[60px]",
            // Transition
            "transition-all duration-300 ease-in-out"
          )}
        >
          <PlaylistSidebar
            playlist={playlist}
            currentVideoIndex={currentVideoIndex}
            onVideoSelect={setCurrentVideoIndex}
            isCollapsed={isSidebarCollapsed}
            onCollapsedChange={setIsSidebarCollapsed}
            className="h-full w-full rounded-t-lg lg:rounded-l-lg lg:rounded-t-none"
          />
        </motion.div>

        {/* Collapse Button - Desktop only */}
        <div 
          className={cn(
            "hidden lg:block absolute z-10",
            "top-1/2 -translate-y-1/2",
            isSidebarCollapsed ? "right-[60px]" : "right-[350px]",
            "transition-all duration-200 ease-in-out"
          )}
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