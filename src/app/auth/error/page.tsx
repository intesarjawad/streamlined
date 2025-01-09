'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = () => {
    switch (error) {
      case 'AccessDenied':
        return 'You need to be a verified member to access this site.';
      case 'Verification':
        return 'Unable to verify your Discord account.';
      default:
        return 'An error occurred during authentication.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-8 text-center"
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">Authentication Error</h1>
          <p className="text-white/60">
            {getErrorMessage()}
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