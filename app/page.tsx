'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/trips');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="mb-8">&quot;wherever you go, go with all your heart [and friends]&quot;</h1>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to /trips
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="mb-8">&quot;wherever you go, go with all your heart [and friends]&quot;</h1>
        <Link href="/auth">
          <Button>
            login
          </Button>
        </Link>
      </div>
    </div>
  );
}
