'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { MapPin, Users, Calendar, ArrowRight } from 'lucide-react';

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
        <div className="text-center max-w-2xl mx-auto px-6">
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
            <Skeleton className="h-10 w-32 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to /trips
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-screen px-6">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-8 leading-tight">
            wherever you go, go with all your heart{" "}
            <span className="text-grey-600">[and friends]</span>
          </h1>
          
          <p className="text-xl text-grey-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            plan, organize, and share your travel adventures with friends. 
            make every trip memorable together.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button asChild size="lg" className="hover-scale">
              <Link href="/auth">
                get started
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="hover-scale">
              <Link href="/auth">
                sign in
              </Link>
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center p-6">
              <div className="mx-auto mb-4 p-3 bg-grey-100 rounded-full w-fit">
                <MapPin className="h-6 w-6 text-grey-700" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">plan trips</h3>
              <p className="text-grey-600 text-sm">
                create detailed itineraries with flights, lodging, and activities
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="mx-auto mb-4 p-3 bg-grey-100 rounded-full w-fit">
                <Users className="h-6 w-6 text-grey-700" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">invite friends</h3>
              <p className="text-grey-600 text-sm">
                collaborate with friends and manage group travel plans
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="mx-auto mb-4 p-3 bg-grey-100 rounded-full w-fit">
                <Calendar className="h-6 w-6 text-grey-700" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">stay organized</h3>
              <p className="text-grey-600 text-sm">
                keep track of dates, payments, and important details
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
