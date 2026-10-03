'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export function SiteHeader() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="text-2xl font-bold text-gray-900 hover:text-gray-700"
          >
            E-Commerce Store
          </button>
          <div className="flex gap-4 items-center">
            <Button variant="outline" onClick={() => router.push('/cart')}>
              Cart
            </Button>
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Button variant="outline" onClick={() => router.push('/admin')}>
                    Admin Dashboard
                  </Button>
                )}
                <Button variant="outline" onClick={() => router.push('/profile')}>
                  Profile
                </Button>
                <Button variant="destructive" onClick={() => logout()}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => router.push('/login')}>
                  Login
                </Button>
                <Button onClick={() => router.push('/register')}>Register</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
