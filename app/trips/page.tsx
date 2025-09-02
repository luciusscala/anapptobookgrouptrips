'use client';

import { Layout } from '@/components/layout/layout';
import { TripList } from '@/components/trips/trip-list';
import { useTrips } from '@/hooks/useTrip';
import { Button } from '@/components/ui/button';
import { ProtectedRoute } from '@/components/auth/protected-route';
import Link from 'next/link';

export default function TripsPage() {
  const { data: tripsResponse, isLoading, error } = useTrips();

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">
            Error loading trips
          </h2>
          <p className="text-gray-600 mb-4">
            {error.message}
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Trips</h1>
              <p className="text-gray-600">
                Manage and organize your travel plans
              </p>
            </div>
            <Link href="/trips/new">
              <Button>Create New Trip</Button>
            </Link>
          </div>

          <TripList 
            trips={tripsResponse?.trips || []} 
            isLoading={isLoading} 
          />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
