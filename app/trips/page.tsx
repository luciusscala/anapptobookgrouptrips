'use client';

import { TripList } from '@/components/trips/trip-list';
import { useTrips } from '@/hooks/useTrip';
import { ProtectedRoute } from '@/components/auth/protected-route';
import Link from 'next/link';

export default function TripsPage() {
  const { data: tripsResponse, isLoading, error } = useTrips();

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-black mb-2">
            Error loading trips
          </h2>
          <p className="text-gray-600 mb-6">
            {error.message}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-black text-white px-4 py-2 hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">
          {/* Empty State */}
          {!isLoading && (!tripsResponse?.trips || tripsResponse.trips.length === 0) && (
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold text-black mb-2">
                No trips yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start planning your first adventure by creating a new trip.
              </p>
              <Link 
                href="/trips/new"
                className="bg-black text-white px-4 py-2 hover:bg-gray-800"
              >
                Create Your First Trip
              </Link>
            </div>
          )}

          {/* Trips List */}
          {tripsResponse?.trips && tripsResponse.trips.length > 0 && (
            <TripList 
              trips={tripsResponse.trips} 
              isLoading={isLoading} 
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
