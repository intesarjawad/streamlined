"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Plus, Search, X } from "lucide-react";
import Link from "next/link";
import PlaylistCard from "@/components/admin/playlist-card";
import { usePlaylistStore } from "@/store/playlist-store";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function AdminPlaylistsPage() {
  const router = useRouter();
  const playlists = usePlaylistStore((state) => state.playlists);
  const deletePlaylist = usePlaylistStore((state) => state.deletePlaylist);
  const [searchQuery, setSearchQuery] = useState("");

  const handleEdit = (id: string) => {
    router.push(`/admin/playlists/${id}/edit`);
  };

  // Filter playlists based on search query
  const filteredPlaylists = useMemo(() => {
    if (!searchQuery.trim()) return playlists;

    const query = searchQuery.toLowerCase();
    return playlists.filter(playlist => 
      playlist.name.toLowerCase().includes(query) ||
      playlist.description?.toLowerCase().includes(query) ||
      playlist.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  }, [playlists, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white">
                Your <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                  Playlists
                </span>
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your course playlists
              </p>
            </div>
            
            <Link href="/admin/playlists/create">
              <Button 
                className="gap-2 bg-neon-blue/10 hover:bg-neon-blue/20 text-neon-blue border border-neon-blue/50"
              >
                <Plus className="h-4 w-4" />
                Create New Playlist
              </Button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search playlists by name, description, or tags..."
                className={cn(
                  "pl-10 pr-10 py-6 text-base",
                  "bg-black/40 border-white/5",
                  "focus:ring-1 focus:ring-neon-blue/50",
                  "placeholder:text-muted-foreground"
                )}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Results Count */}
          {searchQuery && (
            <div className="text-center text-sm text-muted-foreground">
              Found {filteredPlaylists.length} {filteredPlaylists.length === 1 ? 'playlist' : 'playlists'}
              {filteredPlaylists.length > 0 && ' matching your search'}
            </div>
          )}

          {/* Playlists Grid */}
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
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
                  onEdit={() => handleEdit(playlist.id)}
                  onDelete={() => deletePlaylist(playlist.id)}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Empty States */}
          {playlists.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No playlists yet. Create your first playlist to get started.
              </p>
              <Link href="/admin/playlists/create" className="mt-4 inline-block">
                <Button 
                  className="gap-2 bg-neon-blue/10 hover:bg-neon-blue/20 text-neon-blue border border-neon-blue/50"
                >
                  <Plus className="h-4 w-4" />
                  Create New Playlist
                </Button>
              </Link>
            </div>
          ) : filteredPlaylists.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No playlists found matching your search.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 text-sm text-neon-blue hover:text-neon-blue/80"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 