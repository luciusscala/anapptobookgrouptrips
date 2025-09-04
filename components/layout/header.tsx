'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
        </Link>
        
        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {loading ? (
            <div className="h-8 w-20 bg-muted rounded-lg animate-pulse"></div>
          ) : user ? (
            <>
              <Link href="/trips">
                <Button variant="ghost" className="text-foreground hover:text-blue-600">
                  My Trips
                </Button>
              </Link>
              <Link href="/trips/new">
                <Button variant="primary" size="sm">
                  + New Trip
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/auth">
              <Button variant="primary">Get Started</Button>
            </Link>
          )}
        </nav>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          {loading ? (
            <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-muted transition-colors duration-200"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={user.name || user.email} />
                  <AvatarFallback className="bg-blue-600 text-white text-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-background border rounded-xl shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-foreground">
                      {user.name || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  
                  <div className="py-1">
                    <Link href="/trips" className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted">
                      My Trips
                    </Link>
                    <Link href="/debug" className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted">
                      Settings
                    </Link>
                  </div>
                  
                  <Separator className="my-1" />
                  
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/auth">
                <Button variant="ghost" className="hidden sm:inline-flex">
                  Sign in
                </Button>
              </Link>
              <Link href="/auth">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {user && (
        <div className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-2 flex items-center justify-between">
            <Link href="/trips">
              <Button variant="ghost" size="sm">
                My Trips
              </Button>
            </Link>
            <Link href="/trips/new">
              <Button variant="primary" size="sm">
                + New Trip
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
