'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';

export function Header() {
  const { user, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="font-bold text-xl">Travel Planner</span>
        </Link>
        
        <nav className="flex items-center space-x-4">
          {loading ? (
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
          ) : user ? (
            <>
              <Link href="/trips">
                <Button variant="secondary">My Trips</Button>
              </Link>
              <Link href="/trips/new">
                <Button>New Trip</Button>
              </Link>
              <Link href="/debug">
                <Button variant="secondary" size="small">Debug</Button>
              </Link>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {user.name || user.email}
                </span>
                <Button variant="secondary" size="small" onClick={handleSignOut}>
                  Sign out
                </Button>
              </div>
            </>
          ) : (
            <Link href="/auth">
              <Button>Sign in</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
