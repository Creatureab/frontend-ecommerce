'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface AdminGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/** Redirects non-admin users away from admin routes after auth hydrates. */
export function AdminGate({ children, fallback = null }: AdminGateProps) {
  const router = useRouter();
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (!isAdmin) {
      router.replace('/');
    }
  }, [isAdmin, isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated || !isAdmin) return <>{fallback}</>;

  return <>{children}</>;
}
