'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import * as React from 'react';

export function Header() {
  const { user, signOut, loading } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
  };

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-black">
          Travel App
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          {loading ? (
            <div className="h-8 w-20 bg-gray-200 animate-pulse"></div>
          ) : user ? (
            <>
              <Link href="/trips" className="text-black hover:text-gray-600">
                My Trips
              </Link>
              <Link href="/trips/new" className="bg-black text-white px-4 py-2 hover:bg-gray-800">
                New Trip
              </Link>
            </>
          ) : (
            <Link href="/auth" className="bg-black text-white px-4 py-2 hover:bg-gray-800">
              Get Started
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {loading ? (
            <div className="h-8 w-20 bg-gray-200 animate-pulse"></div>
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="text-black hover:text-gray-600"
              >
                {user.name || user.email}
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-black py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-300">
                    <p className="text-sm font-medium text-black">
                      {user.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-600">
                      {user.email}
                    </p>
                  </div>
                  
                  <div className="py-1">
                    <Link href="/trips" className="block px-4 py-2 text-sm text-black hover:bg-gray-100">
                      My Trips
                    </Link>
                    <Link href="/debug" className="block px-4 py-2 text-sm text-black hover:bg-gray-100">
                      Settings
                    </Link>
                  </div>
                  
                  <div className="border-t border-gray-300 my-1"></div>
                  
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth" className="bg-black text-white px-4 py-2 hover:bg-gray-800">
              Sign In
            </Link>
          )}
        </div>
      </div>

      {user && (
        <div className="md:hidden border-t bg-white">
          <div className="container mx-auto px-4 py-2 flex items-center justify-between">
            <Link href="/trips" className="text-black hover:text-gray-600">
              My Trips
            </Link>
            <Link href="/trips/new" className="bg-black text-white px-4 py-2 hover:bg-gray-800">
              New Trip
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
