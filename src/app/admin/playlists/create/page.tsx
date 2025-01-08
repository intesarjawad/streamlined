"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { MagicCard } from "@/components/ui/magic-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Plus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PlaylistEditor from "@/components/admin/playlist-editor";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePlaylistStore } from "@/store/playlist-store";
import { useRouter } from "next/navigation";
import { VideoList } from "@/components/admin/video-list";
import { PlaylistPlaceholder } from "@/components/admin/playlist-placeholder";
import { PublishSuccessModal } from "@/components/admin/publish-success-modal";
import { PublishedUrlCard } from "@/components/admin/published-url-card";
import { buttonStyles } from "@/lib/button-styles";
import { useMounted } from "@/hooks/use-mounted";

interface Video {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  url: string;
}

interface PlaylistData {
  name: string;
  videos: Video[];
  tags: string[];
  description?: string;
  customThumbnail?: string;
  youtubeUrl?: string;
  thumbnail?: string;
}

export default function CreatePlaylistPage() {
  const router = useRouter();
  const { addPlaylist, updatePlaylist } = usePlaylistStore();
  const [loading, setLoading] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [playlistData, setPlaylistData] = useState<PlaylistData | null>(null);
  const { toast } = useToast();
  const [showPublishSuccess, setShowPublishSuccess] = useState(false);
  const [publishedId, setPublishedId] = useState<string | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const mounted = useMounted();

  useEffect(() => {
    if (!mounted) return;
    // Move any browser API calls here
  }, [mounted]);

  if (!mounted) {
    return null; // or a loading skeleton
  }

  const fetchPlaylistData = async () => {
    if (!playlistUrl) {
      toast({
        title: "Error",
        description: "Please enter a YouTube playlist URL",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/youtube/playlist?url=${playlistUrl}`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      const initialPlaylist: PlaylistData = {
        name: data.name || '',
        videos: data.videos || [],
        tags: [],
        description: data.description || '',
        youtubeUrl: playlistUrl,
        thumbnail: data.videos?.[0]?.thumbnail || '',
      };
      
      setPlaylistData(initialPlaylist);

      toast({
        title: "Success",
        description: "Playlist fetched successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch playlist data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: PlaylistData, isDraft: boolean) => {
    try {
      const playlistToSave = {
        ...data,
        thumbnail: data.videos[0]?.thumbnail || "",
        youtubeUrl: playlistUrl,
      };

      if (isDraft && draftId) {
        updatePlaylist(draftId, {
          ...playlistToSave,
          isDraft: true,
          updatedAt: new Date(),
        });
      } else {
        const newId = crypto.randomUUID();
        const newPlaylist = {
          ...playlistToSave,
          id: newId,
          isDraft: isDraft,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        if (isDraft) {
          setDraftId(newId);
        }
        
        addPlaylist(newPlaylist);
      }

      setPlaylistData({
        ...playlistToSave,
        tags: playlistToSave.tags || [],
      });

      if (!isDraft) {
        router.push('/admin/playlists');
      } else {
        toast({
          title: "Draft Saved",
          description: "Your playlist has been saved as a draft.",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save playlist",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-[1fr,1.5fr] gap-8 max-w-[2000px] mx-auto relative"
        layout="size"
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      >
        {!playlistData && <PlaylistPlaceholder />}

        <motion.div
          layout="position"
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          className={cn(
            "px-4 py-16 space-y-8",
            !playlistData && "relative z-10"
          )}
        >
          <motion.div 
            layout="position"
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="flex items-center gap-4"
          >
            <Link href="/admin/playlists">
              <Button 
                variant="ghost" 
                size="icon"
                className="rounded-full"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white">
                Create New{" "}
                <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                  Playlist
                </span>
              </h1>
              <p className="text-muted-foreground mt-2">
                Import a course from YouTube playlist
              </p>
            </div>
          </motion.div>

          <motion.div
            layout="position"
            initial={playlistData ? { opacity: 0, x: "100%" } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.5, 
              ease: [0.32, 0.72, 0, 1],
              layout: { duration: 0.5 }
            }}
          >
            <MagicCard 
              className="overflow-hidden border border-white/10"
              gradientColor="rgba(0, 255, 255, 0.05)"
            >
              <div className="space-y-6 p-6">
                <div className="space-y-2">
                  <label 
                    htmlFor="playlist-url" 
                    className="text-base font-medium text-foreground/90"
                  >
                    YouTube Playlist URL
                  </label>
                  <div className="flex gap-2 items-center">
                    <div className="relative flex-1">
                      <Input
                        id="playlist-url"
                        placeholder="https://youtube.com/playlist?list=..."
                        value={playlistUrl}
                        onChange={(e) => setPlaylistUrl(e.target.value)}
                        className="w-full text-base"
                        disabled={loading}
                      />
                    </div>
                    <Button 
                      onClick={fetchPlaylistData}
                      disabled={loading}
                      className={cn(
                        "shrink-0 h-9 px-4",
                        buttonStyles.secondary.default
                      )}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span>Fetching...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          <span>Fetch Playlist</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </MagicCard>
          </motion.div>

          {playlistData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.3,
                duration: 0.5,
                ease: [0.32, 0.72, 0, 1]
              }}
            >
              <PlaylistEditor
                initialData={playlistData}
                onSave={handleSave}
                onRefresh={async () => {
                  await fetchPlaylistData();
                }}
                isPublished={false}
              />
            </motion.div>
          )}
        </motion.div>

        {playlistData && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              delay: 0.2,
              duration: 0.6,
              ease: [0.32, 0.72, 0, 1]
            }}
            className={cn(
              "min-h-screen py-16 px-8 sticky top-0",
              "bg-gradient-to-b from-black/60 via-black/40 to-black/30",
              "relative overflow-hidden",
              "before:absolute before:inset-0 before:w-[1px] before:left-0",
              "before:bg-gradient-to-b before:from-transparent before:via-white/5 before:to-transparent",
              "backdrop-blur-md"
            )}
          >
            {/* Dot pattern overlay */}
            <div 
              className="absolute inset-0 opacity-[0.07]" 
              style={{ 
                backgroundImage: `
                  radial-gradient(circle at center, rgb(0, 255, 255, 0.3) 1px, transparent 1px),
                  radial-gradient(circle at center, rgb(0, 255, 255, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '24px 24px, 12px 12px',
                backgroundPosition: '0 0, 6px 6px'
              }}
            />

            {/* Animated gradient overlay */}
            <motion.div 
              className="absolute inset-0 opacity-20"
              animate={{ 
                background: [
                  'radial-gradient(circle at 0% 0%, rgba(0,255,255,0.1) 0%, transparent 50%)',
                  'radial-gradient(circle at 100% 100%, rgba(0,255,255,0.1) 0%, transparent 50%)',
                  'radial-gradient(circle at 0% 0%, rgba(0,255,255,0.1) 0%, transparent 50%)'
                ]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />

            {/* Subtle glow lines */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon-blue/20 via-transparent to-transparent" />
              <div className="absolute inset-0 opacity-10 bg-[conic-gradient(from_90deg_at_50%_50%,_var(--tw-gradient-stops))] from-neon-blue/10 via-transparent to-neon-blue/10" />
            </div>

            {/* Content */}
            <div className="relative">
              <h2 className="text-xl font-semibold mb-6">Course Videos</h2>
              <VideoList
                videos={playlistData.videos}
                onReorder={(videos) => setPlaylistData({ ...playlistData, videos })}
                onVideoUpdate={(videoId, updates) => {
                  setPlaylistData({
                    ...playlistData,
                    videos: playlistData.videos.map(v => 
                      v.id === videoId ? { ...v, ...updates } : v
                    )
                  });
                }}
                onVideoDelete={(videoId) => {
                  setPlaylistData({
                    ...playlistData,
                    videos: playlistData.videos.filter(v => v.id !== videoId)
                  });
                }}
              />
            </div>
          </motion.div>
        )}
      </motion.div>

      {showPublishSuccess && publishedId && (
        <PublishSuccessModal
          playlistId={publishedId}
          playlistName={playlistData?.name || ""}
          onClose={() => {
            setShowPublishSuccess(false);
            router.push('/admin/playlists');
          }}
        />
      )}
    </div>
  );
} 