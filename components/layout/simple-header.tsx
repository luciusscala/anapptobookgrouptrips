'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';

export function SimpleHeader() {
  const { signOut } = useAuth();

  return (
    <header className="absolute top-0 right-0 p-8 z-10">
      <Button 
        onClick={() => signOut()}
        className="hover-scale"
      >
        sign out
      </Button>
    </header>
  );
}
