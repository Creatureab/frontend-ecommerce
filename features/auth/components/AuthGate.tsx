'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/** Prevents protected UI from rendering before local auth state is hydrated. */
export function AuthGate({ children, fallback = null }: AuthGateProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) return <>{fallback}</>;

  return <>{children}</>;
}
