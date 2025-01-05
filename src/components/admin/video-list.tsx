"use client";

import { motion, Reorder, AnimatePresence } from "motion/react";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/format";
import { buttonStyles } from "@/lib/button-styles";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { typographyStyles } from "@/lib/typography-styles";

interface Video {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
}

interface VideoListProps {
  videos: Video[];
  onReorder: (videos: Video[]) => void;
  onVideoUpdate?: (id: string, updates: Partial<Video>) => void;
  onVideoDelete?: (id: string) => void;
}

export function VideoList({ videos, onReorder, onVideoUpdate, onVideoDelete }: VideoListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <Reorder.Group 
      axis="y" 
      values={videos} 
      onReorder={onReorder}
      className="space-y-3"
    >
      <AnimatePresence mode="popLayout">
        {videos.map((video) => (
          <Reorder.Item
            key={video.id}
            value={video}
            className="relative"
            layoutId={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileDrag={{ 
              scale: 1.02,
              boxShadow: "0 8px 20px rgb(0 0 0 / 0.3)",
              cursor: "grabbing"
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              mass: 0.8,
              layout: {
                type: "spring",
                stiffness: 300,
                damping: 30
              }
            }}
          >
            <motion.div
              className={cn(
                "flex items-center gap-4 p-3 rounded-lg",
                "bg-black/40 border border-white/5",
                "group hover:bg-black/60 hover:border-white/10",
                "transition-colors relative overflow-hidden",
                "active:scale-[1.02] active:cursor-grabbing",
              )}
              layout
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-neon-blue/5 via-transparent to-transparent" />

              <div className="relative flex items-center gap-4 w-full">
                <div
                  className={cn(
                    "p-2 -m-2",
                    "text-white/40 hover:text-white/60",
                    "cursor-grab active:cursor-grabbing",
                    "transition-colors"
                  )}
                >
                  <GripVertical className="h-5 w-5" />
                </div>

                <div className="relative flex-shrink-0">
                  <img
                    src={video.thumbnail}
                    alt=""
                    className="w-32 h-20 object-cover rounded"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/80 px-1 rounded text-xs">
                    {formatDuration(video.duration)}
                  </div>
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  {editingId === video.id ? (
                    <Input
                      autoFocus
                      defaultValue={video.title}
                      className={cn(
                        "text-base text-white/90",
                        "bg-black/60",
                        "border-neon-blue/30",
                        "focus-visible:ring-neon-blue/30"
                      )}
                      onBlur={(e) => {
                        setEditingId(null);
                        if (e.target.value !== video.title) {
                          onVideoUpdate?.(video.id, { title: e.target.value });
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.currentTarget.blur();
                        }
                        if (e.key === 'Escape') {
                          setEditingId(null);
                        }
                      }}
                    />
                  ) : (
                    <p className="text-base text-white/90 truncate">
                      {video.title}
                    </p>
                  )}
                  <p className="text-sm text-white/50">
                    {formatDuration(video.duration)}
                  </p>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {onVideoUpdate && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className={buttonStyles.ghost.default}
                      onClick={() => setEditingId(video.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  {onVideoDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className={buttonStyles.ghost.destructive}
                      onClick={() => onVideoDelete(video.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </Reorder.Item>
        ))}
      </AnimatePresence>
    </Reorder.Group>
  );
} 