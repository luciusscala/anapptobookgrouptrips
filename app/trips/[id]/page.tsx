'use client';

import { useParams } from 'next/navigation';
import { Layout } from '@/components/layout/layout';
import { useTrip } from '@/hooks/useTrip';
import { FlightCard } from '@/components/flights/flight-card';
import { LodgeCard } from '@/components/lodging/lodge-card';
import { PeopleList } from '@/components/people/people-list';
import { AddFlightForm } from '@/components/flights/add-flight-form';
import { AddLodgeForm } from '@/components/lodging/add-lodge-form';
import { AddPersonForm } from '@/components/people/add-person-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProtectedRoute } from '@/components/auth/protected-route';
import Link from 'next/link';

export default function TripDetailPage() {
  const params = useParams();
  const tripId = params.id as string;
  
  const { data: tripResponse, isLoading, error } = useTrip(tripId);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">
            Error loading trip
          </h2>
          <p className="text-gray-600 mb-4">
            {error.message}
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
            <Link href="/trips">
              <Button variant="secondary">Back to Trips</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (!tripResponse?.trip_data) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">Trip not found</h2>
          <p className="text-gray-600 mb-4">
            The trip you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/trips">
            <Button>Back to Trips</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const { trip, flights, lodges, people } = tripResponse.trip_data;

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/trips">
                <Button variant="secondary" size="small">← Back to Trips</Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold">{trip.title}</h1>
            <p className="text-gray-600">
              Created {new Date(trip.created_at).toLocaleDateString()}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Flights Section */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Flights</h2>
                {flights.length > 0 ? (
                  <div className="space-y-4">
                    {flights.map((flight) => (
                      <FlightCard key={flight.id} flight={flight} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-gray-600 text-center">
                        No flights added yet
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              <AddFlightForm tripId={tripId} />
            </div>

            {/* Lodging Section */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Lodging</h2>
                {lodges.length > 0 ? (
                  <div className="space-y-4">
                    {lodges.map((lodge) => (
                      <LodgeCard key={lodge.id} lodge={lodge} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-gray-600 text-center">
                        No lodging added yet
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              <AddLodgeForm tripId={tripId} />
            </div>

            {/* People Section */}
            <div className="space-y-6">
              <PeopleList people={people} />
              <AddPersonForm tripId={tripId} />
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
