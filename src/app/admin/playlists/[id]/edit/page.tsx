"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import PlaylistEditor from "@/components/admin/playlist-editor";
import { usePlaylistStore } from "@/store/playlist-store";
import { VideoList } from "@/components/admin/video-list";
import { cn } from "@/lib/utils";
import { MagicCard } from "@/components/ui/magic-card";
import { Input } from "@/components/ui/input";
import { PublishSuccessModal } from "@/components/admin/publish-success-modal";
import { PublishedUrlCard } from "@/components/admin/published-url-card";
import { buttonStyles } from "@/lib/button-styles";
import { useMounted } from "@/hooks/use-mounted";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { ClientOnly } from "@/components/ui/client-only";

export default function EditPlaylistPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [playlist, setPlaylist] = useState<PlaylistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [showPublishSuccess, setShowPublishSuccess] = useState(false);
  
  const updatePlaylist = usePlaylistStore((state) => state.updatePlaylist);
  const playlists = usePlaylistStore((state) => state.playlists);
  const deletePlaylist = usePlaylistStore((state) => state.deletePlaylist);
  const mounted = useMounted();

  useEffect(() => {
    if (!mounted) return;
    
    const playlistId = params.id as string;
    const foundPlaylist = playlists.find(p => p.id === playlistId);
    
    if (foundPlaylist) {
      setPlaylist(foundPlaylist);
      setPlaylistUrl(foundPlaylist.youtubeUrl || "");
    }
    setLoading(false);
  }, [mounted, params.id, playlists]);

  const handleSave = async (data: PlaylistData, isDraft: boolean) => {
    try {
      const isUnpublishing = !playlist.isDraft && isDraft;
      
      const updatedPlaylist = {
        ...data,
        id: playlist.id,
        isDraft: isDraft,
        youtubeUrl: playlistUrl,
        updatedAt: new Date(),
      };

      setPlaylist(updatedPlaylist);
      updatePlaylist(playlist.id, updatedPlaylist);
      
      toast({
        title: isUnpublishing 
          ? "Playlist Unpublished" 
          : isDraft 
            ? "Draft Updated" 
            : "Playlist Published",
        description: isUnpublishing
          ? "Your playlist has been unpublished and saved as a draft."
          : isDraft 
            ? "Your changes have been saved."
            : "Your playlist has been published successfully!",
        variant: "success",
      });

      if (!isDraft && !isUnpublishing && hasChanges) {
        setShowPublishSuccess(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update playlist",
        variant: "destructive",
      });
    }
  };

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

      const updatedPlaylist = {
        ...data,
        id: playlist.id,
        isDraft: playlist.isDraft,
        youtubeUrl: playlistUrl,
        updatedAt: new Date(),
      };
      
      setPlaylist(updatedPlaylist);
      updatePlaylist(playlist.id, updatedPlaylist);
      
      toast({
        title: "Success",
        description: "Playlist updated successfully!",
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

  const handleDiscard = async () => {
    try {
      deletePlaylist(playlist.id);
      toast({
        title: "Draft Discarded",
        description: "Your draft has been discarded.",
        variant: "success",
      });
      router.push('/admin/playlists');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to discard draft",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      deletePlaylist(playlist.id);
      toast({
        title: "Playlist Deleted",
        description: "Your playlist has been deleted.",
        variant: "success",
      });
      router.push('/admin/playlists');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete playlist",
        variant: "destructive",
      });
    }
  };

  if (!mounted || loading) {
    return <LoadingSkeleton className="min-h-screen" />;
  }

  if (!playlist) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Playlist Not Found</h2>
          <p className="text-white/60 mb-4">This playlist may have been deleted or doesn't exist.</p>
          <Link href="/admin/playlists">
            <Button>
              Back to Playlists
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ClientOnly>
      <div className="min-h-screen bg-background">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-[1fr,1.5fr] gap-8 max-w-[2000px] mx-auto relative"
          layout="size"
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        >
          {/* Left Column */}
          <div className="px-4 py-16 space-y-8">
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
                  Edit{" "}
                  <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                    Playlist
                  </span>
                </h1>
                <p className="text-muted-foreground mt-2">
                  Make changes to your playlist
                </p>
              </div>
            </motion.div>

            {/* Playlist URL Input */}
            <motion.div
              layout="position"
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
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
                          buttonStyles.primary.default
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

            {/* Playlist Editor */}
            {playlist && (
              <PlaylistEditor
                initialData={playlist}
                onSave={handleSave}
                onRefresh={fetchPlaylistData}
                isPublished={!playlist.isDraft}
                onDiscard={playlist.isDraft ? handleDiscard : undefined}
                onDelete={!playlist.isDraft ? handleDelete : undefined}
              />
            )}
          </div>

          {/* Right Column - Videos */}
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
                videos={playlist.videos}
                onReorder={(videos) => {
                  const updatedPlaylist = { ...playlist, videos };
                  setPlaylist(updatedPlaylist);
                  updatePlaylist(playlist.id, updatedPlaylist);
                }}
                onVideoUpdate={(videoId, updates) => {
                  const updatedPlaylist = {
                    ...playlist,
                    videos: playlist.videos.map(v => 
                      v.id === videoId ? { ...v, ...updates } : v
                    )
                  };
                  setPlaylist(updatedPlaylist);
                  updatePlaylist(playlist.id, updatedPlaylist);
                }}
                onVideoDelete={(videoId) => {
                  const updatedPlaylist = {
                    ...playlist,
                    videos: playlist.videos.filter(v => v.id !== videoId)
                  };
                  setPlaylist(updatedPlaylist);
                  updatePlaylist(playlist.id, updatedPlaylist);
                }}
              />
            </div>
          </motion.div>
        </motion.div>

        {showPublishSuccess && (
          <PublishSuccessModal
            playlistId={params.id as string}
            playlistName={playlist.name}
            onClose={() => {
              setShowPublishSuccess(false);
              router.push('/admin/playlists');
            }}
          />
        )}
      </div>
    </ClientOnly>
  );
} 