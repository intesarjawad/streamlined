'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import LoadingScreen from '@/app/loading';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const requireAuth = process.env.NEXT_PUBLIC_REQUIRE_AUTH === 'true';

  useEffect(() => {
    // Don't redirect if we're already on an error page
    if (pathname.startsWith('/auth/error')) {
      return;
    }

    if (requireAuth && status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router, requireAuth, pathname]);

  if (requireAuth && status === 'loading') {
    return <LoadingScreen />;
  }

  return <>{children}</>;
} 