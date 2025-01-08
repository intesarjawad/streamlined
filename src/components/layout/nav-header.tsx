'use client';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, Plus, Settings, LayoutDashboard, Library } from "lucide-react";
import Link from "next/link";
import { buttonStyles } from "@/lib/button-styles";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSearchStore } from "@/store/search-store";

export function NavHeader() {
  const { searchQuery, setSearchQuery } = useSearchStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.04] bg-black/95 backdrop-blur">
      <div className="max-w-[90%] mx-auto px-4 md:px-8">
        <div className="flex h-14 items-center">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hover:bg-white/5">
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-semibold">Streamlined</span>
            </Link>
          </div>

          {/* Center Section - Search */}
          <div className="flex-1 flex justify-center px-4">
            <div className="w-full max-w-2xl flex items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  placeholder="Search playlists..."
                  className={cn(
                    "pl-10 pr-4 h-9 bg-white/[0.04] border-white/[0.08]",
                    "focus-visible:ring-neon-blue/30",
                    "placeholder:text-white/40"
                  )}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-white/5">
                  <Library className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href="/admin/playlists">
                  <DropdownMenuItem>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/admin/playlists/create">
              <Button className={cn("gap-2", buttonStyles.primary.default)}>
                <Plus className="h-4 w-4" />
                Create
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
} 