"use client";

import { motion } from "motion/react";
import { MagicCard } from "@/components/ui/magic-card";

export function PlaylistPlaceholder() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.5fr] gap-8 max-w-[2000px] mx-auto opacity-50">
      {/* Left Column Placeholder */}
      <div className="px-4 py-16 space-y-8">
        <MagicCard className="space-y-6 p-6">
          {/* Playlist Name Placeholder */}
          <div className="space-y-3">
            <div className="h-5 w-32 bg-white/10 rounded animate-pulse" />
            <div className="h-10 bg-white/5 rounded" />
          </div>

          {/* Description Placeholder */}
          <div className="space-y-3">
            <div className="h-5 w-24 bg-white/10 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-24 bg-white/5 rounded" />
            </div>
          </div>

          {/* Tags Placeholder */}
          <div className="space-y-3">
            <div className="h-5 w-16 bg-white/10 rounded animate-pulse" />
            <div className="h-10 bg-white/5 rounded" />
          </div>
        </MagicCard>
      </div>

      {/* Right Column Placeholder */}
      <div className="hidden lg:block py-16 px-8">
        <div className="space-y-4">
          <div className="h-7 w-32 bg-white/10 rounded animate-pulse" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="h-32 bg-white/5 rounded-lg border border-white/5"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 