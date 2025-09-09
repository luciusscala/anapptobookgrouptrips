'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/loading-skeleton';
import * as React from 'react';
import { ChevronDown, User, LogOut, Settings } from 'lucide-react';

export function Header() {
  const { user, signOut, loading } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-grey-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-2xl font-bold text-black hover:text-grey-700 transition-colors"
          >
            travel app
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {loading ? (
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-24" />
              </div>
            ) : user ? (
              <>
                <Link 
                  href="/trips" 
                  className="text-grey-700 hover:text-black transition-colors font-medium"
                >
                  my trips
                </Link>
                <Button asChild>
                  <Link href="/trips/new">
                    new trip
                  </Link>
                </Button>
              </>
            ) : (
              <Button asChild>
                <Link href="/auth">
                  get started
                </Link>
              </Button>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <Skeleton className="h-10 w-32" />
            ) : user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-3"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {user.name || user.email}
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </Button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-grey-200 rounded-lg shadow-lg z-50 animate-slide-in">
                    <div className="p-4 border-b border-grey-100">
                      <p className="text-sm font-semibold text-black">
                        {user.name || 'user'}
                      </p>
                      <p className="text-xs text-grey-600 mt-1">
                        {user.email}
                      </p>
                    </div>
                    
                    <div className="py-2">
                      <Link 
                        href="/trips" 
                        className="flex items-center px-4 py-2 text-sm text-grey-700 hover:bg-grey-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-3" />
                        my trips
                      </Link>
                      <Link 
                        href="/settings" 
                        className="flex items-center px-4 py-2 text-sm text-grey-700 hover:bg-grey-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        settings
                      </Link>
                    </div>
                    
                    <div className="border-t border-grey-100 py-2">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-grey-700 hover:bg-grey-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button asChild>
                <Link href="/auth">
                  sign in
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {user && (
          <div className="md:hidden mt-4 pt-4 border-t border-grey-200">
            <div className="flex items-center justify-between">
              <Link 
                href="/trips" 
                className="text-grey-700 hover:text-black transition-colors font-medium"
              >
                my trips
              </Link>
              <Button asChild size="sm">
                <Link href="/trips/new">
                  new trip
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
