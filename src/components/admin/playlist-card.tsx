import { MagicCard } from "@/components/ui/magic-card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, PlayCircle } from "lucide-react";
import Image from "next/image";

interface PlaylistCardProps {
  playlist: {
    id: string;
    name: string;
    description?: string;
    thumbnail?: string;
    videoCount: number;
    isDraft: boolean;
    videos: {
      duration: string;
    }[];
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function PlaylistCard({ playlist, onEdit, onDelete }: PlaylistCardProps) {
  return (
    <MagicCard className="overflow-hidden">
      <div className="relative aspect-video">
        {playlist.thumbnail ? (
          <Image
            src={playlist.thumbnail}
            alt={playlist.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-black/50" />
        )}
      </div>
      
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{playlist.name}</h3>
          {playlist.isDraft && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500">
              Draft
            </span>
          )}
        </div>
        {playlist.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {playlist.description}
          </p>
        )}
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <span className="inline-flex items-center gap-1">
            <PlayCircle className="h-4 w-4" />
            {playlist.videos.length} {playlist.videos.length === 1 ? 'video' : 'videos'}
          </span>
          {playlist.isDraft && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500">
              Draft
            </span>
          )}
        </p>
        
        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            variant="ghost"
            className="flex-1 gap-2"
            onClick={() => onEdit(playlist.id)}
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="flex-1 gap-2 text-destructive hover:text-destructive"
            onClick={() => onDelete(playlist.id)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
    </MagicCard>
  );
} 