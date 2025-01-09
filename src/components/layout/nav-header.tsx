'use client';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";
import { useSearchStore } from "@/store/search-store";
import { UserMenu } from "@/components/auth/user-menu";
import { useSession } from "next-auth/react";

export function NavHeader() {
  const { data: session } = useSession();
  const { searchQuery, setSearchQuery } = useSearchStore();

  // Don't render nav for signed out users
  if (!session) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.04] bg-black/95 backdrop-blur">
      <div className="max-w-[90%] mx-auto px-4 md:px-8">
        <div className="flex h-16 items-center">
          {/* Left Section - Enhanced Title */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className={cn(
                "text-4xl",
                "font-mono",
                "holo-text",
                "hover:opacity-90 transition-opacity duration-300"
              )}>
                THE MACHINE
              </span>
            </Link>
          </div>

          {/* Center Section - Search */}
          <div className="flex-1 flex justify-center px-8">
            <div className="w-full max-w-2xl flex items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  placeholder="Search playlists..."
                  className={cn(
                    "pl-10 pr-4 h-10",
                    "bg-white/[0.04] border-white/[0.08]",
                    "focus-visible:ring-neon-blue/30",
                    "placeholder:text-white/40"
                  )}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Right Section - Simplified */}
          <div className="flex items-center">
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
} 