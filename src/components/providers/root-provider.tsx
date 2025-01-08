'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function RootProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div 
      suppressHydrationWarning
      className={cn(
        "min-h-screen bg-background text-foreground",
        mounted && "antialiased"
      )}
    >
      {children}
    </div>
  );
} 