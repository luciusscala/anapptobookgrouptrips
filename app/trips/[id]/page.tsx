'use client';

import { useParams } from 'next/navigation';
import { Layout } from '@/components/layout/layout';
import { useTrip, useFlights, useLodges, usePeople } from '@/hooks/useTrip';
import { FlightCard } from '@/components/flights/flight-card';
import { LodgeCard } from '@/components/lodging/lodge-card';
import { PeopleList } from '@/components/people/people-list';
import { AddFlightForm } from '@/components/flights/add-flight-form';
import { AddLodgeForm } from '@/components/lodging/add-lodge-form';
import { AddPersonForm } from '@/components/people/add-person-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function TripDetailPage() {
  const params = useParams();
  const tripId = params.id as string;
  
  // Use specific endpoints instead of complete trip info
  const { data: tripResponse, isLoading: tripLoading, error: tripError } = useTrip(tripId);
  const { data: flightsResponse, isLoading: flightsLoading, error: flightsError } = useFlights(tripId);
  const { data: lodgesResponse, isLoading: lodgesLoading, error: lodgesError } = useLodges(tripId);
  const { data: peopleResponse, isLoading: peopleLoading, error: peopleError } = usePeople(tripId);

  const isLoading = tripLoading || flightsLoading || lodgesLoading || peopleLoading;
  const error = tripError || flightsError || lodgesError || peopleError;

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-10 bg-gray-200 rounded w-full mb-6"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-6">
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
        </div>
      </Layout>
    );
  }

  if (!tripResponse?.trip_data) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-2">Trip not found</h2>
            <p className="text-gray-600 mb-4">
              The trip you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link href="/trips">
              <Button>Back to Trips</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const trip = tripResponse.trip_data.trip;
  const flights = flightsResponse?.flights || [];
  const lodges = lodgesResponse?.lodges || [];
  const people = peopleResponse?.people || [];

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/trips">
                <Button variant="secondary" size="sm">
                  ← Back to Trips
                </Button>
              </Link>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">{trip.title}</h1>
              <div className="flex items-center gap-2 text-gray-600">
                <span>Created {formatDate(trip.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="flights" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="flights">
                Flights ({flights.length})
              </TabsTrigger>
              <TabsTrigger value="lodging">
                Lodging ({lodges.length})
              </TabsTrigger>
              <TabsTrigger value="people">
                People ({people.length})
              </TabsTrigger>
            </TabsList>

            {/* Flights Tab */}
            <TabsContent value="flights" className="space-y-6">
              <div className="space-y-4">
                {flights.length > 0 ? (
                  flights.map((flight) => (
                    <FlightCard key={flight.id} flight={flight} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <span className="text-gray-400 text-4xl">✈</span>
                        <div>
                          <h3 className="font-medium text-gray-900">No flights added yet</h3>
                          <p className="text-sm text-gray-600">Add your flight information to get started</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Add Flight</h3>
                <AddFlightForm tripId={tripId} />
              </div>
            </TabsContent>

            {/* Lodging Tab */}
            <TabsContent value="lodging" className="space-y-6">
              <div className="space-y-4">
                {lodges.length > 0 ? (
                  lodges.map((lodge) => (
                    <LodgeCard key={lodge.id} lodge={lodge} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <span className="text-gray-400 text-4xl">🏠</span>
                        <div>
                          <h3 className="font-medium text-gray-900">No lodging added yet</h3>
                          <p className="text-sm text-gray-600">Add your accommodation details</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Add Lodging</h3>
                <AddLodgeForm tripId={tripId} />
              </div>
            </TabsContent>

            {/* People Tab */}
            <TabsContent value="people" className="space-y-6">
              <div>
                {people.length > 0 ? (
                  <PeopleList people={people} />
                ) : (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <span className="text-gray-400 text-4xl">👥</span>
                        <div>
                          <h3 className="font-medium text-gray-900">No travelers added yet</h3>
                          <p className="text-sm text-gray-600">Add people to your trip</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Add Traveler</h3>
                <AddPersonForm tripId={tripId} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
