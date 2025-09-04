'use client';

import { Layout } from '@/components/layout/layout';
import { TripList } from '@/components/trips/trip-list';
import { useTrips } from '@/hooks/useTrip';
import { Button } from '@/components/ui/button';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function TripsPage() {
  const { data: tripsResponse, isLoading, error } = useTrips();

  if (error) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center py-20">
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <span className="text-destructive text-2xl">⚠</span>
              </div>
              <h2 className="text-2xl font-semibold text-destructive mb-2">
                Error loading trips
              </h2>
              <p className="text-muted-foreground mb-6">
                {error.message}
              </p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  My Trips
                </h1>
                <p className="text-xl text-muted-foreground">
                  Manage and organize your travel adventures
                </p>
              </div>
              <Link href="/trips/new">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  + Create New Trip
                </Button>
              </Link>
            </div>
          </div>

          {/* Empty State */}
          {!isLoading && (!tripsResponse?.trips || tripsResponse.trips.length === 0) && (
            <div className="text-center py-20">
              <Card className="max-w-md mx-auto border-0 shadow-lg">
                <CardContent className="pt-8 pb-8">
                  <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-gradient-to-br from-blue-500/10 to-blue-600/10 flex items-center justify-center">
                    <span className="text-blue-600 text-3xl">✈</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground mb-2">
                    No trips yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Start planning your first adventure by creating a new trip.
                  </p>
                  <Link href="/trips/new">
                    <Button variant="primary" size="lg">
                      + Create Your First Trip
                    </Button>
                  </Link>
                </CardContent>
              </Card>
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
      </Layout>
    </ProtectedRoute>
  );
}
