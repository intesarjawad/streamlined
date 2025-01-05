"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Clock, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/format";
import { Button } from "@/components/ui/button";
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
  isCollapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  className?: string;
}

export function PlaylistSidebar({ 
  playlist, 
  currentVideoIndex, 
  onVideoSelect,
  isCollapsed,
  onCollapsedChange,
  className
}: PlaylistSidebarProps) {
  return (
    <motion.div 
      layout
      className={cn(
        "h-screen bg-black/40 border-l border-white/5 relative",
        "backdrop-blur-sm rounded-lg",
        "transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[50px]" : "w-[350px]",
        className
      )}
    >
      {/* Collapse Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onCollapsedChange(!isCollapsed)}
        className={cn(
          "absolute -left-6 top-1/2 -translate-y-1/2 z-10",
          "bg-black/60 hover:bg-black/80",
          "border border-white/10 hover:border-neon-blue/30",
          "w-6 h-12 rounded-l-lg rounded-r-none",
          "transition-all duration-200",
          "hover:text-neon-blue"
        )}
      >
        <ChevronRight className={cn(
          "h-4 w-4 transition-transform duration-200",
          isCollapsed ? "rotate-0" : "rotate-180"
        )} />
      </Button>

      {/* Content */}
      <div className={cn(
        "transition-opacity duration-200",
        isCollapsed ? "opacity-0" : "opacity-100"
      )}>
        <div className="p-4 border-b border-white/5 bg-black/20">
          <h2 className={cn(
            typographyStyles.sectionTitle,
            "bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent"
          )}>
            {playlist.name}
          </h2>
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
    </motion.div>
  );
} 