import { useState } from 'react';
import { MagicCard } from "@/components/ui/magic-card";
import { Button } from "@/components/ui/button";
import { 
  PlayCircle, 
  Pencil, 
  Trash2, 
  Share2, 
  ExternalLink,
  Clock,
  Calendar
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { buttonStyles } from "@/lib/button-styles";
import { motion } from "motion/react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from 'date-fns';

interface PlaylistCardProps {
  playlist: {
    id: string;
    name: string;
    description?: string;
    thumbnail?: string;
    videos: any[];
    tags?: string[];
    isDraft: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function PlaylistCard({ playlist, onEdit, onDelete }: PlaylistCardProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const playlistUrl = `${window.location.origin}/playlists/${playlist.id}`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(playlistUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Link Copied!",
      description: "Playlist URL has been copied to clipboard",
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
  };

  return (
    <MagicCard 
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative overflow-hidden transition-all duration-300",
        "hover:shadow-[0_0_25px_rgba(0,255,255,0.2)]",
        "hover:border-neon-blue/50",
        "hover:scale-[1.02]",
        "bg-black/20 backdrop-blur-sm border-white/[0.04]"
      )}
    >
      {/* Add interactive spotlight effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(
            600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            rgba(0, 255, 255, 0.06),
            transparent 40%
          )`
        }}
      />
      
      {/* Thumbnail Section */}
      <div className="relative aspect-video">
        {playlist.thumbnail ? (
          <Image
            src={playlist.thumbnail}
            alt={playlist.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-black/50" />
        )}
      </div>
      
      {/* Content Section with better spacing */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-base line-clamp-1">{playlist.name}</h3>
            {playlist.description && (
              <p className="text-sm text-white/60 line-clamp-2 mt-1">
                {playlist.description}
              </p>
            )}
          </div>
          {playlist.isDraft && (
            <span className="px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500">
              Draft
            </span>
          )}
        </div>

        {/* Tags with better spacing */}
        {playlist.tags && playlist.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {playlist.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Metadata - adjusted for single line */}
        <div className="flex items-center justify-between text-sm text-white/50">
          <span className="inline-flex items-center gap-1 shrink-0">
            <PlayCircle className="h-4 w-4" />
            {playlist.videos.length} {playlist.videos.length === 1 ? 'video' : 'videos'}
          </span>
          <span className="inline-flex items-center gap-1 shrink-0">
            <Clock className="h-4 w-4" />
            Last updated {formatDistanceToNow(new Date(playlist.updatedAt), { addSuffix: true })}
          </span>
        </div>

        {/* Combined Actions Row */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          {/* Edit/Delete Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(playlist.id)}
              className={cn("gap-2", buttonStyles.ghost.default)}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(playlist.id)}
              className={cn("gap-2", buttonStyles.ghost.destructive)}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>

          {/* Share/View Actions */}
          {!playlist.isDraft && (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className={cn("gap-2", buttonStyles.ghost.default)}
                onClick={copyToClipboard}
              >
                <Share2 className="h-4 w-4" />
                {copied ? 'Copied!' : 'Share'}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className={cn("gap-2", buttonStyles.ghost.default)}
                onClick={() => window.open(playlistUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
                View
              </Button>
            </div>
          )}
        </div>
      </div>
    </MagicCard>
  );
} 