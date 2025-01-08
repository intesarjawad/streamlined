"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Search, 
  ArrowUpDown,
  Calendar,
  SortAsc,
  Tag,
  PlayCircle
} from "lucide-react";
import Link from "next/link";
import PlaylistCard from "@/components/admin/playlist-card";
import { usePlaylistStore } from "@/store/playlist-store";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { buttonStyles } from "@/lib/button-styles";
import { MagicCard } from "@/components/ui/magic-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SEMESTER_TAGS } from "@/lib/constants";

type SortOption = {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
};

const sortOptions: SortOption[] = [
  { label: "Name (A-Z)", value: "name-asc", icon: SortAsc },
  { label: "Name (Z-A)", value: "name-desc", icon: SortAsc },
  { label: "Newest First", value: "date-desc", icon: Calendar },
  { label: "Oldest First", value: "date-asc", icon: Calendar },
  { label: "Most Videos", value: "videos-desc", icon: PlayCircle },
  { label: "Fewest Videos", value: "videos-asc", icon: PlayCircle },
];

export default function AdminPlaylistsPage() {
  const router = useRouter();
  const playlists = usePlaylistStore((state) => state.playlists);
  const deletePlaylist = usePlaylistStore((state) => state.deletePlaylist);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDrafts, setFilterDrafts] = useState<boolean | null>(null);
  const [sortBy, setSortBy] = useState("date-desc");
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);

  // Filter and sort playlists
  const filteredPlaylists = useMemo(() => {
    let filtered = playlists;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(playlist => 
        playlist.name.toLowerCase().includes(query) ||
        playlist.description?.toLowerCase().includes(query) ||
        playlist.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by draft status
    if (filterDrafts !== null) {
      filtered = filtered.filter(playlist => playlist.isDraft === filterDrafts);
    }

    // Filter by semester
    if (selectedSemester) {
      filtered = filtered.filter(playlist => 
        playlist.tags?.includes(selectedSemester)
      );
    }

    // Sort playlists
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "date-desc":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case "date-asc":
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        case "videos-desc":
          return b.videos.length - a.videos.length;
        case "videos-asc":
          return a.videos.length - b.videos.length;
        default:
          return 0;
      }
    });
  }, [playlists, searchQuery, filterDrafts, sortBy, selectedSemester]);

  return (
    <div className="min-h-screen bg-black relative">
      <div className="relative">
        <div className="mx-auto max-w-[1200px] px-8 py-12">
          <div className="space-y-6">
            <MagicCard className="p-5 bg-black/20 backdrop-blur-sm border-white/[0.04]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-white">
                    Your <span className="text-neon-blue">Playlists</span>
                  </h1>
                  <p className="text-sm text-white/50 mt-1">
                    Manage your course playlists
                  </p>
                </div>
                
                <Link href="/admin/playlists/create">
                  <Button 
                    className={cn(
                      "gap-2",
                      buttonStyles.primary.default
                    )}
                  >
                    <Plus className="h-4 w-4" />
                    Create New Playlist
                  </Button>
                </Link>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <MagicCard className="overflow-hidden transition-all duration-200">
                    <div className="relative group">
                      <Search className={cn(
                        "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4",
                        "text-white/30 group-hover:text-neon-blue group-focus-within:text-neon-blue",
                        "transition-colors duration-200"
                      )} />
                      <Input
                        placeholder="Search playlists..."
                        className={cn(
                          "pl-10 border-0 bg-black/20",
                          "placeholder:text-white/30",
                          "focus-visible:ring-neon-blue/50",
                          "hover:bg-neon-blue/10",
                          "focus:bg-neon-blue/15",
                          "hover:border-neon-blue/30",
                          "transition-all duration-200"
                        )}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </MagicCard>
                </div>

                <div className="flex items-center gap-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className={cn(
                          "gap-2 bg-black/40 border-white/10",
                          "hover:bg-neon-blue/15 hover:border-neon-blue hover:text-neon-blue",
                          "hover:shadow-[0_0_20px_rgba(0,255,255,0.2),_0_0_40px_rgba(0,255,255,0.1)]",
                          "transition-all duration-200"
                        )}
                      >
                        <ArrowUpDown className="h-4 w-4" />
                        Sort
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="end" 
                      className="w-56 bg-black/90 backdrop-blur-xl border-white/10"
                    >
                      <DropdownMenuLabel className="text-white/70">Sort by</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-white/10" />
                      {sortOptions.map((option) => (
                        <DropdownMenuItem
                          key={option.value}
                          onClick={() => setSortBy(option.value)}
                          className={cn(
                            "group flex items-center gap-2",
                            "text-white/70 hover:text-neon-blue",
                            "transition-all duration-200",
                            "hover:bg-neon-blue/20",
                            "hover:shadow-[inset_0_0_30px_rgba(0,255,255,0.15)]",
                            sortBy === option.value && "bg-neon-blue/30 text-neon-blue shadow-[0_0_15px_rgba(0,255,255,0.2),_inset_0_0_20px_rgba(0,255,255,0.15)]"
                          )}
                        >
                          <option.icon className="h-4 w-4" />
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className={cn(
                          "gap-2 bg-black/40 border-white/10",
                          "hover:bg-neon-blue/15 hover:border-neon-blue hover:text-neon-blue",
                          "hover:shadow-[0_0_20px_rgba(0,255,255,0.2),_0_0_40px_rgba(0,255,255,0.1)]",
                          "transition-all duration-200"
                        )}
                      >
                        <Tag className="h-4 w-4" />
                        Semester
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="end" 
                      className="w-56 bg-black/90 backdrop-blur-xl border-white/10"
                    >
                      <DropdownMenuLabel className="text-white/70">Filter by semester</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem
                        onClick={() => setSelectedSemester(null)}
                        className={cn(
                          "group flex items-center gap-2",
                          "text-white/70 hover:text-neon-blue",
                          "transition-all duration-200",
                          "hover:bg-neon-blue/20",
                          "hover:shadow-[inset_0_0_30px_rgba(0,255,255,0.15)]",
                          selectedSemester === null && "bg-neon-blue/30 text-neon-blue shadow-[0_0_15px_rgba(0,255,255,0.2),_inset_0_0_20px_rgba(0,255,255,0.15)]"
                        )}
                      >
                        All Semesters
                      </DropdownMenuItem>
                      {SEMESTER_TAGS.map((tag) => (
                        <DropdownMenuItem
                          key={tag}
                          onClick={() => setSelectedSemester(tag)}
                          className={cn(
                            "group flex items-center gap-2",
                            "text-white/70 hover:text-neon-blue",
                            "transition-all duration-200",
                            "hover:bg-neon-blue/20",
                            "hover:shadow-[inset_0_0_30px_rgba(0,255,255,0.15)]",
                            selectedSemester === tag && "bg-neon-blue/30 text-neon-blue shadow-[0_0_15px_rgba(0,255,255,0.2),_inset_0_0_20px_rgba(0,255,255,0.15)]"
                          )}
                        >
                          {tag}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setFilterDrafts(null)}
                      className={cn(
                        "bg-black/40 border-white/10",
                        "hover:bg-neon-blue/15 hover:border-neon-blue hover:text-neon-blue hover:shadow-[0_0_15px_rgba(0,255,255,0.15)]",
                        "transition-all duration-200",
                        filterDrafts === null && "bg-neon-blue/15 border-neon-blue text-neon-blue shadow-[0_0_10px_rgba(0,255,255,0.1)]"
                      )}
                    >
                      All
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setFilterDrafts(false)}
                      className={cn(
                        "bg-black/40 border-white/10",
                        "hover:bg-neon-blue/15 hover:border-neon-blue hover:text-neon-blue hover:shadow-[0_0_15px_rgba(0,255,255,0.15)]",
                        "transition-all duration-200",
                        filterDrafts === false && "bg-neon-blue/15 border-neon-blue text-neon-blue shadow-[0_0_10px_rgba(0,255,255,0.1)]"
                      )}
                    >
                      Published
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setFilterDrafts(true)}
                      className={cn(
                        "bg-black/40 border-white/10",
                        "hover:bg-neon-blue/15 hover:border-neon-blue hover:text-neon-blue hover:shadow-[0_0_15px_rgba(0,255,255,0.15)]",
                        "transition-all duration-200",
                        filterDrafts === true && "bg-neon-blue/15 border-neon-blue text-neon-blue shadow-[0_0_10px_rgba(0,255,255,0.1)]"
                      )}
                    >
                      Drafts
                    </Button>
                  </div>
                </div>
              </div>
            </MagicCard>

            <div className="text-sm text-white/40 px-1">
              Showing {filteredPlaylists.length} {filteredPlaylists.length === 1 ? 'playlist' : 'playlists'}
            </div>

            <div className="grid grid-cols-3 gap-5">
              {filteredPlaylists.map((playlist) => (
                <motion.div
                  key={playlist.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <PlaylistCard
                    playlist={playlist}
                    onEdit={(id) => router.push(`/admin/playlists/${id}/edit`)}
                    onDelete={deletePlaylist}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 