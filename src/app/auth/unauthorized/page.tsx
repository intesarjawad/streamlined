'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Lock, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-8 text-center"
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-neon-blue/10 flex items-center justify-center">
            <Lock className="w-8 h-8 text-neon-blue" />
          </div>
          <h1 className="text-2xl font-bold text-white">Access Denied</h1>
          <p className="text-white/60">
            You don't have permission to access this page.
          </p>
        </div>

        <Link href="/">
          <Button
            className={cn(
              "w-full gap-2",
              "bg-neon-blue/20 hover:bg-neon-blue/30",
              "text-neon-blue border border-neon-blue/50",
              "transition-all duration-200",
              "hover:shadow-[0_0_20px_rgba(0,255,255,0.2)]"
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            Return Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
} 