'use client';

import { TripList } from '@/components/trips/trip-list';
import { useTrips } from '@/hooks/useTrip';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { SimpleHeader } from '@/components/layout/simple-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorState, EmptyState } from '@/components/ui/error-state';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Plane } from 'lucide-react';

export default function TripsPage() {
  const { data: tripsResponse, isLoading, error } = useTrips();

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-white">
          <SimpleHeader />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <ErrorState
              title="error loading trips"
              message={error.message}
              onRetry={() => window.location.reload()}
              variant="error"
            />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
        <SimpleHeader />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Page Header */}
          <div className="mb-16">
            <h1 className="text-4xl font-bold text-black">my trips</h1>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-8">
              <TripList trips={[]} isLoading={true} />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && (!tripsResponse?.trips || tripsResponse.trips.length === 0) && (
            <EmptyState
              title="no trips yet"
              message="start planning your next adventure by creating your first trip"
              illustration={<Plane className="w-16 h-16 text-gray-300" />}
              action={{
                label: "create your first trip",
                onClick: () => window.location.href = "/trips/new"
              }}
            />
          )}

          {/* Trips List */}
          {!isLoading && tripsResponse?.trips && tripsResponse.trips.length > 0 && (
            <div className="space-y-12">
              <TripList 
                trips={tripsResponse.trips} 
                isLoading={false} 
              />
              <div className="text-center pt-8">
                <Button asChild size="lg" variant="secondary" className="hover-scale">
                  <Link href="/trips/new">
                    add new trip
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
