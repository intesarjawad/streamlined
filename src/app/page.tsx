'use client';

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { MagicCard } from "@/components/ui/magic-card";
import { Button } from "@/components/ui/button";
import { Clock, Check, PlayCircle, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePlaylistStore } from "@/store/playlist-store";
import { ClientOnly } from "@/components/ui/client-only";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { useMounted } from "@/hooks/use-mounted";
import { useWatchLaterStore } from "@/store/watch-later-store";
import { useToast } from "@/hooks/use-toast";
import { SEMESTER_TAGS } from "@/lib/constants";
import { useSearchStore } from "@/store/search-store";
import { useRouter } from "next/navigation";
import { calculateTotalDuration } from "@/lib/format";
import type { Video } from "@/types";
import { useContinueWatchingStore } from "@/store/continue-watching-store";

export default function HomePage() {
  const mounted = useMounted();
  const playlists = usePlaylistStore(state => state.playlists);
  const { 
    addToWatchLater, 
    removeFromWatchLater, 
    isInWatchLater,
    watchLater 
  } = useWatchLaterStore();
  const { toast } = useToast();
  const { searchQuery } = useSearchStore();
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const router = useRouter();
  const { items: continueWatchingItems, removeFromHistory } = useContinueWatchingStore();

  // Reset tag selection when searching
  useEffect(() => {
    if (searchQuery) {
      setSelectedTag("All");
    }
  }, [searchQuery]);

  // Filter playlists
  const filteredPlaylists = playlists.filter(playlist => {
    if (playlist.isDraft) return false;
    
    const matchesSearch = searchQuery === "" || 
      playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag = selectedTag === "All" || 
      playlist.tags?.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  // Get playlists for continue watching
  const continueWatchingPlaylists = playlists.filter(playlist => 
    !playlist.isDraft && continueWatchingItems.some(item => item.playlistId === playlist.id)
  ).sort((a, b) => {
    const aDate = continueWatchingItems.find(item => item.playlistId === a.id)?.lastWatched || new Date(0);
    const bDate = continueWatchingItems.find(item => item.playlistId === b.id)?.lastWatched || new Date(0);
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });

  // Get watch later playlists
  const watchLaterPlaylists = playlists.filter(playlist => 
    !playlist.isDraft && watchLater.includes(playlist.id)
  );

  return (
    <ClientOnly>
      <div className="min-h-screen bg-black">
        {/* Semester Tags Filter - Full width with subtle padding */}
        <div className="border-b border-white/[0.04] overflow-x-auto">
          <div className="max-w-[90%] mx-auto px-4 md:px-8">
            <div className="flex py-3 gap-2">
              <Button
                key="all"
                variant="ghost"
                size="sm"
                className={cn(
                  "rounded-full whitespace-nowrap",
                  "hover:bg-neon-blue/10 hover:text-neon-blue hover:border-neon-blue/30",
                  "text-sm font-normal",
                  "transition-all duration-300 ease-in-out",
                  "border border-transparent",
                  selectedTag === "All" 
                    ? "bg-neon-blue/20 text-neon-blue border-neon-blue/50 shadow-[0_0_10px_rgba(0,255,255,0.1)]"
                    : "text-white/70"
                )}
                onClick={() => setSelectedTag("All")}
              >
                All
              </Button>
              {SEMESTER_TAGS.map((tag) => (
                <Button
                  key={tag}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "rounded-full whitespace-nowrap",
                    "hover:bg-neon-blue/10 hover:text-neon-blue hover:border-neon-blue/30",
                    "text-sm font-normal",
                    "transition-all duration-300 ease-in-out",
                    "border border-transparent",
                    selectedTag === tag 
                      ? "bg-neon-blue/20 text-neon-blue border-neon-blue/50 shadow-[0_0_10px_rgba(0,255,255,0.1)]"
                      : "text-white/70"
                  )}
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content - More elegant spacing */}
        <div className="max-w-[90%] mx-auto px-4 md:px-8">
          <div className="py-8 space-y-16"> {/* Increased vertical spacing */}
            {/* Continue Watching Section */}
            {mounted && continueWatchingPlaylists.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  Continue Watching
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {continueWatchingPlaylists.map((playlist) => (
                    <motion.div
                      key={playlist.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Link href={`/playlists/${playlist.id}?v=${
                        continueWatchingItems.find(item => item.playlistId === playlist.id)?.videoIndex || 0
                      }`}>
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
                                    router.push(`/playlists/${playlist.id}?v=${
                                      continueWatchingItems.find(item => item.playlistId === playlist.id)?.videoIndex || 0
                                    }`);
                                  }}
                                >
                                  Continue Watching
                                </Button>
                                
                                {/* Only show the remove button */}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-white/60 hover:text-red-400 hover:bg-black/80"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    removeFromHistory(playlist.id);
                                    toast({
                                      title: "Removed from Continue Watching",
                                      description: "This playlist has been removed from your continue watching list",
                                    });
                                  }}
                                >
                                  <X className="h-4 w-4" />
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

                          {/* Progress Bar */}
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                            <div 
                              className="h-full bg-neon-blue"
                              style={{ 
                                width: `${(
                                  (continueWatchingItems.find(item => item.playlistId === playlist.id)?.videoIndex || 0) 
                                  / playlist.videos.length
                                ) * 100}%` 
                              }}
                            />
                          </div>
                        </MagicCard>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* My List Section */}
            {mounted && watchLaterPlaylists.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  My List
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {watchLaterPlaylists.map((playlist) => (
                    <motion.div
                      key={playlist.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
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
                                  className={cn(
                                    "text-white hover:text-neon-blue",
                                    "hover:bg-black/80",
                                    isInWatchLater(playlist.id) && "text-neon-blue"
                                  )}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (isInWatchLater(playlist.id)) {
                                      removeFromWatchLater(playlist.id);
                                      toast({
                                        title: "Removed from My List",
                                        description: "This playlist has been removed from your list",
                                      });
                                    } else {
                                      addToWatchLater(playlist.id);
                                      toast({
                                        title: "Added to My List",
                                        description: "This playlist has been added to your list",
                                      });
                                    }
                                  }}
                                >
                                  {isInWatchLater(playlist.id) ? (
                                    <>
                                      <Check className="h-4 w-4 mr-2" />
                                      Added
                                    </>
                                  ) : (
                                    <>
                                      <Clock className="h-4 w-4 mr-2" />
                                      Add to My List
                                    </>
                                  )}
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
              </section>
            )}

            {/* All Playlists Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">
                All Playlists
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mounted ? (
                  filteredPlaylists.map((playlist) => (
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
                                  className={cn(
                                    "text-white hover:text-neon-blue",
                                    "hover:bg-black/80",
                                    isInWatchLater(playlist.id) && "text-neon-blue"
                                  )}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (isInWatchLater(playlist.id)) {
                                      removeFromWatchLater(playlist.id);
                                      toast({
                                        title: "Removed from My List",
                                        description: "This playlist has been removed from your list",
                                      });
                                    } else {
                                      addToWatchLater(playlist.id);
                                      toast({
                                        title: "Added to My List",
                                        description: "This playlist has been added to your list",
                                      });
                                    }
                                  }}
                                >
                                  {isInWatchLater(playlist.id) ? (
                                    <>
                                      <Check className="h-4 w-4 mr-2" />
                                      Added
                                    </>
                                  ) : (
                                    <>
                                      <Clock className="h-4 w-4 mr-2" />
                                      Add to My List
                                    </>
                                  )}
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
                  ))
                ) : (
                  // Loading skeletons...
                  Array(12).fill(0).map((_, i) => (
                    <LoadingSkeleton key={i} className="aspect-[1.5] rounded-lg" />
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}
