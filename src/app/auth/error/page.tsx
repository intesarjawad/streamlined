'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div 
        className="absolute inset-0 opacity-[0.07]" 
        style={{ 
          backgroundImage: `
            radial-gradient(circle at center, rgb(0, 255, 255, 0.3) 1px, transparent 1px),
            radial-gradient(circle at center, rgb(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px, 12px 12px',
          backgroundPosition: '0 0, 6px 6px'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md p-8 space-y-8"
      >
        <div className="flex flex-col items-center space-y-6 text-center">
          {/* Icon with glow effect */}
          <div className="relative">
            <div className="absolute inset-0 blur-xl bg-neon-blue/30 animate-pulse-glow" />
            <div className="relative w-20 h-20 rounded-full bg-black border border-neon-blue/50 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-neon-blue" />
            </div>
          </div>

          {/* Title with glitch effect */}
          <h1 className="text-3xl font-bold text-white relative group">
            <span className="relative z-10 text-white group-hover:text-neon-blue transition-colors duration-300">
              Access Denied
            </span>
            <span className="absolute inset-0 text-neon-blue opacity-50 group-hover:animate-glitch-1" aria-hidden>
              Access Denied
            </span>
            <span className="absolute inset-0 text-neon-blue opacity-50 group-hover:animate-glitch-2" aria-hidden>
              Access Denied
            </span>
          </h1>

          {/* Message */}
          <p className="text-lg text-white/60">
            {error === 'AccessDenied' 
              ? "You don't have permission to access this resource."
              : "An error occurred during authentication."}
          </p>

          {/* Button */}
          <Link href="/auth/signin" className="w-full">
            <Button
              className={cn(
                "w-full gap-2 mt-4",
                "bg-neon-blue/20 hover:bg-neon-blue/30",
                "text-neon-blue border border-neon-blue/50",
                "transition-all duration-200",
                "hover:shadow-[0_0_20px_rgba(0,255,255,0.2)]",
                "group"
              )}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Return to Sign In
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
} 