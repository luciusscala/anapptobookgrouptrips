'use client';

import { useParams } from 'next/navigation';
import { useTrip, useFlights, useLodges, usePeople } from '@/hooks/useTrip';
import { FlightCard } from '@/components/flights/flight-card';
import { LodgeCard } from '@/components/lodging/lodge-card';
import { PeopleList } from '@/components/people/people-list';
import { AddFlightForm } from '@/components/flights/add-flight-form';
import { AddLodgeForm } from '@/components/lodging/add-lodge-form';
import { AddPersonForm } from '@/components/people/add-person-form';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { SimpleHeader } from '@/components/layout/simple-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
      <ProtectedRoute>
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
          <SimpleHeader />
          <div className="text-center">
            <p>Loading trip details...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
          <SimpleHeader />
          <div className="text-center">
            <h2 className="mb-2">Error loading trip</h2>
            <p className="mb-4">{error.message}</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
              <Link href="/trips">
                <Button variant="link">Back to Trips</Button>
              </Link>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!tripResponse?.trip_data) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
          <SimpleHeader />
          <div className="text-center">
            <h2 className="mb-2">Trip not found</h2>
            <p className="mb-4">The trip you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/trips">
              <Button>Back to Trips</Button>
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const trip = tripResponse.trip_data.trip;
  const flights = flightsResponse?.flights || [];
  const lodges = lodgesResponse?.lodges || [];
  const people = peopleResponse?.people || [];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
        <SimpleHeader />
        <div className="p-8 max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/trips">
              <Button variant="link">Back to Trips</Button>
            </Link>
          </div>
          
          {/* Trip Title */}
          <div className="mb-8">
            <h1 className="mb-2">{trip.title}</h1>
            <p>Created {formatDate(trip.created_at)}</p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="flights" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="flights">Flights ({flights.length})</TabsTrigger>
              <TabsTrigger value="accommodation">Accommodation ({lodges.length})</TabsTrigger>
              <TabsTrigger value="people">People ({people.length})</TabsTrigger>
            </TabsList>

            {/* Flights Tab */}
            <TabsContent value="flights" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Flight Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    {flights.length > 0 ? (
                      flights.map((flight) => (
                        <FlightCard key={flight.id} flight={flight} />
                      ))
                    ) : (
                      <div className="p-6 text-center">
                        <h3 className="mb-2">No flights added yet</h3>
                        <p className="text-gray-500">Add your flight information to get started</p>
                      </div>
                    )}
                  </div>
                  <Separator className="mb-6" />
                  <div>
                    <h3 className="mb-4">Add Flight</h3>
                    <AddFlightForm tripId={tripId} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Accommodation Tab */}
            <TabsContent value="accommodation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Accommodation Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    {lodges.length > 0 ? (
                      lodges.map((lodge) => (
                        <LodgeCard key={lodge.id} lodge={lodge} />
                      ))
                    ) : (
                      <div className="p-6 text-center">
                        <h3 className="mb-2">No lodging added yet</h3>
                        <p className="text-gray-500">Add your accommodation details</p>
                      </div>
                    )}
                  </div>
                  <Separator className="mb-6" />
                  <div>
                    <h3 className="mb-4">Add Lodging</h3>
                    <AddLodgeForm tripId={tripId} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* People Tab */}
            <TabsContent value="people" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Travelers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    {people.length > 0 ? (
                      <PeopleList people={people} />
                    ) : (
                      <div className="p-6 text-center">
                        <h3 className="mb-2">No travelers added yet</h3>
                        <p className="text-gray-500">Add people to your trip</p>
                      </div>
                    )}
                  </div>
                  <Separator className="mb-6" />
                  <div>
                    <h3 className="mb-4">Add Traveler</h3>
                    <AddPersonForm tripId={tripId} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}
