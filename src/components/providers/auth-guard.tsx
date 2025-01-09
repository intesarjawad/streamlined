'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingScreen from '@/app/loading';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const requireAuth = process.env.NEXT_PUBLIC_REQUIRE_AUTH === 'true';

  useEffect(() => {
    if (requireAuth && status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router, requireAuth]);

  if (requireAuth && status === 'loading') {
    return <LoadingScreen />;
  }

  return <>{children}</>;
} 