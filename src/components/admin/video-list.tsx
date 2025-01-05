import { Reorder } from "motion/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GripVertical, Trash2, Clock } from "lucide-react";
import { formatDuration } from "@/lib/format";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Video {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  url: string;
}

interface VideoListProps {
  videos: Video[];
  onReorder: (videos: Video[]) => void;
  onVideoUpdate: (videoId: string, updates: Partial<Video>) => void;
  onVideoDelete: (videoId: string) => void;
}

export function VideoList({
  videos,
  onReorder,
  onVideoUpdate,
  onVideoDelete,
}: VideoListProps) {
  return (
    <ScrollArea className="h-[800px] pr-4">
      <Reorder.Group 
        axis="y" 
        values={videos} 
        onReorder={onReorder}
        className="space-y-4"
        layout
        transition={{
          duration: 0.2,
          ease: "easeInOut"
        }}
      >
        {videos.map((video, index) => (
          <Reorder.Item
            key={video.id}
            value={video}
            initial={false}
            animate={{
              scale: 1,
              opacity: 1,
              transition: { duration: 0.2 }
            }}
            exit={{ scale: 0.95, opacity: 0 }}
            whileDrag={{ 
              scale: 1.02,
              boxShadow: "0 8px 20px rgb(0 0 0 / 0.3)",
              cursor: "grabbing"
            }}
            dragTransition={{
              bounceStiffness: 300,
              bounceDamping: 20
            }}
            className={cn(
              "group bg-card/50 rounded-lg p-4 cursor-move transition-all duration-200",
              "hover:bg-card/80 border border-white/5 hover:border-white/10",
              "relative overflow-hidden",
              "active:scale-[1.02] active:cursor-grabbing",
              "hover:shadow-lg hover:shadow-black/20",
              "transform-gpu"
            )}
          >
            {/* Gradient hover effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-neon-blue/5 via-transparent to-transparent" />

            <div className="relative flex gap-4 items-center">
              <div className="flex items-center gap-3">
                <motion.div
                  className="flex items-center gap-3 cursor-grab active:cursor-grabbing"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </motion.div>
                <div className="w-8 h-8 rounded-full bg-neon-blue/10 text-neon-blue flex items-center justify-center text-base font-medium flex-shrink-0">
                  {index + 1}
                </div>
              </div>
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-40 h-24 object-cover rounded flex-shrink-0"
              />
              <div className="flex-1 space-y-3 min-w-0">
                <Input
                  value={video.title}
                  onChange={(e) => onVideoUpdate(video.id, { title: e.target.value })}
                  className="text-base bg-background/50"
                />
                <p className="text-base text-muted-foreground flex items-center gap-2">
                  <span className="inline-flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded">
                    <Clock className="h-4 w-4" />
                    {formatDuration(video.duration)}
                  </span>
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive flex-shrink-0 h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onVideoDelete(video.id)}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </ScrollArea>
  );
} 