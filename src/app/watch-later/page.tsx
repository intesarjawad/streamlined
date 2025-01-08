'use client';

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { MagicCard } from "@/components/ui/magic-card";
import { Button } from "@/components/ui/button";
import { Clock, Check, PlayCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePlaylistStore } from "@/store/playlist-store";
import { ClientOnly } from "@/components/ui/client-only";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { useMounted } from "@/hooks/use-mounted";
import { useWatchLaterStore } from "@/store/watch-later-store";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { calculateTotalDuration } from "@/lib/format";

export default function WatchLaterPage() {
  const mounted = useMounted();
  const playlists = usePlaylistStore(state => state.playlists);
  const { watchLater, removeFromWatchLater } = useWatchLaterStore();
  const { toast } = useToast();
  const router = useRouter();

  // Filter playlists that are in watch later
  const watchLaterPlaylists = playlists.filter(playlist => 
    !playlist.isDraft && watchLater.includes(playlist.id)
  );

  return (
    <ClientOnly>
      <div className="min-h-screen bg-black">
        <div className="container py-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Watch Later</h1>
            <p className="text-white/60">
              {watchLaterPlaylists.length} {watchLaterPlaylists.length === 1 ? 'playlist' : 'playlists'} saved to watch later
            </p>
          </div>

          {mounted ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {watchLaterPlaylists.map((playlist) => (
                <motion.div
                  key={playlist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Link href={`/playlists/${playlist.id}`}>
                    <MagicCard className={cn(
                      "group relative overflow-hidden",
                      "hover:bg-white/[0.04]",
                      "transition-colors duration-200"
                    )}>
                      {/* Thumbnail Section */}
                      <div className="relative aspect-video">
                        {playlist.thumbnail ? (
                          <img
                            src={playlist.thumbnail}
                            alt={playlist.name}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-black/50" />
                        )}
                        
                        {/* Overlay Controls */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                            <Button
                              variant="default"
                              size="sm"
                              className={cn(
                                "bg-neon-blue hover:bg-neon-blue/90",
                                "text-black font-medium"
                              )}
                              onClick={(e) => {
                                e.preventDefault();
                                router.push(`/playlists/${playlist.id}`);
                              }}
                            >
                              Watch Now
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-white hover:text-red-400 hover:bg-black/80"
                              onClick={(e) => {
                                e.preventDefault();
                                removeFromWatchLater(playlist.id);
                                toast({
                                  title: "Removed from Watch Later",
                                  description: "This playlist has been removed from your watch later list",
                                });
                              }}
                            >
                              <Clock className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-4 space-y-3">
                        <div>
                          <h3 className="font-medium line-clamp-2 text-base">
                            {playlist.name}
                          </h3>
                          {playlist.description && (
                            <p className="text-sm text-white/60 line-clamp-2 mt-1">
                              {playlist.description}
                            </p>
                          )}
                        </div>

                        {/* Tags */}
                        {playlist.tags && playlist.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {playlist.tags.map(tag => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 rounded-full text-xs bg-neon-blue/10 text-neon-blue border border-neon-blue/20"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Metadata Row */}
                        <div className="flex items-center justify-between text-sm text-white/50">
                          <span className="flex items-center gap-1">
                            <PlayCircle className="h-4 w-4" />
                            {playlist.videos.length} {playlist.videos.length === 1 ? 'video' : 'videos'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {calculateTotalDuration(playlist.videos)}
                          </span>
                        </div>
                      </div>
                    </MagicCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <LoadingSkeleton key={i} className="aspect-[1.5] rounded-lg" />
              ))}
            </div>
          )}

          {mounted && watchLaterPlaylists.length === 0 && (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">No playlists saved yet</h2>
              <p className="text-white/60 mb-6">Add playlists to watch later to see them here</p>
              <Link href="/">
                <Button>Browse Playlists</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </ClientOnly>
  );
} 