'use client';

import { TripList } from '@/components/trips/trip-list';
import { useTrips } from '@/hooks/useTrip';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { SimpleHeader } from '@/components/layout/simple-header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TripsPage() {
  const { data: tripsResponse, isLoading, error } = useTrips();

  if (error) {
    return (
      <ProtectedRoute>
        <div className="h-screen w-screen flex items-center justify-center bg-white relative">
          <SimpleHeader />
                  <div className="text-center">
          <h2 className="mb-2">
            Error loading trips
          </h2>
          <p className="text-gray-500 mb-6">
            {error.message}
          </p>
          <Button 
            variant="white"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="h-screen w-screen bg-gray-50 relative flex flex-col items-center justify-center">
        <SimpleHeader />
        
        {/* Empty State */}
        {!isLoading && (!tripsResponse?.trips || tripsResponse.trips.length === 0) && (
          <div className="text-center">
            <h2 className="mb-2">
              No trips yet
            </h2>
            <p className="text-gray-500 mb-6">
              Start planning your first adventure by creating a new trip.
            </p>
            <Link href="/trips/new">
              <Button variant="white">
                create your first trip
              </Button>
            </Link>
          </div>
        )}

        {/* Trips List */}
        {tripsResponse?.trips && tripsResponse.trips.length > 0 && (
          <div className="flex flex-col items-center">
            <TripList 
              trips={tripsResponse.trips} 
              isLoading={isLoading} 
            />
            <div className="mt-8">
              <Link href="/trips/new">
                <Button variant="white" size="lg">
                  Add New Trip
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
