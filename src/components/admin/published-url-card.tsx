"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check, Copy, ExternalLink, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/ui/magic-card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonStyles } from "@/lib/button-styles";

interface PublishedUrlCardProps {
  playlistId: string;
}

export function PublishedUrlCard({ playlistId }: PublishedUrlCardProps) {
  const [copied, setCopied] = useState(false);
  const playlistUrl = `${window.location.origin}/playlists/${playlistId}`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(playlistUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <MagicCard 
      className="relative overflow-hidden group"
      gradientColor="rgba(0, 255, 255, 0.05)"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-neon-blue/10 via-transparent to-transparent" />
      
      <div className="relative p-4 flex items-start gap-4">
        <div className="h-10 w-10 rounded-full bg-neon-blue/10 flex items-center justify-center flex-shrink-0">
          <LinkIcon className="h-5 w-5 text-neon-blue" />
        </div>
        
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Published URL</p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={copyToClipboard}
                className={cn(
                  "h-8 w-8 transition-colors",
                  buttonStyles.ghost.default,
                  copied && buttonStyles.primary.success
                )}
              >
                {copied ? (
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Check className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Link href={playlistUrl} target="_blank">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8 transition-colors",
                    buttonStyles.ghost.default
                  )}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          
          <div 
            className={cn(
              "px-3 py-2 rounded bg-black/40 border border-white/5 font-mono text-sm break-all transition-colors",
              "group-hover:border-neon-blue/20"
            )}
          >
            {playlistUrl}
          </div>
        </div>
      </div>
    </MagicCard>
  );
} 