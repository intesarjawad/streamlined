"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PublishSuccessModalProps {
  playlistId: string;
  playlistName: string;
  onClose: () => void;
}

export function PublishSuccessModal({ playlistId, playlistName, onClose }: PublishSuccessModalProps) {
  const [copied, setCopied] = useState(false);
  const playlistUrl = `${window.location.origin}/playlists/${playlistId}`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(playlistUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card border border-white/10 rounded-lg p-6 max-w-md w-full mx-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
            <Check className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold">Playlist Published!</h2>
        </div>

        <p className="text-muted-foreground mb-6">
          "{playlistName}" has been published successfully. Share this link with your audience:
        </p>

        <div className="flex items-center gap-2 mb-6">
          <code className="flex-1 bg-black/20 px-3 py-2 rounded border border-white/5 text-sm">
            {playlistUrl}
          </code>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyToClipboard}
            className={cn(
              "transition-colors",
              copied && "text-green-500 border-green-500/50"
            )}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1"
          >
            Close
          </Button>
          <Link href={playlistUrl} className="flex-1">
            <Button 
              className="w-full gap-2 bg-neon-blue/10 hover:bg-neon-blue/20 text-neon-blue border border-neon-blue/50"
            >
              <ExternalLink className="h-4 w-4" />
              View Playlist
            </Button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
} 