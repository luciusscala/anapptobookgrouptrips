'use client';

import { useParams } from 'next/navigation';
import { usePublicTrip } from '@/hooks/useTrip';
import { FlightCard } from '@/components/flights/flight-card';
import { LodgeCard } from '@/components/lodging/lodge-card';
import { PeopleList } from '@/components/people/people-list';
import { AddFlightForm } from '@/components/flights/add-flight-form';
import { AddLodgeForm } from '@/components/lodging/add-lodge-form';
import { SimpleHeader } from '@/components/layout/simple-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ErrorState, EmptyState, LoadingState } from '@/components/ui/error-state';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// New components for conditional rendering
import { TripAccessControl } from '@/components/trips/trip-access-control';
import { HostControls } from '@/components/trips/host-controls';
import { MemberControls } from '@/components/trips/member-controls';
import { TripCosts } from '@/components/trips/trip-costs';

export default function TripDetailPage() {
  const params = useParams();
  const tripId = params.id as string;
  const { user } = useAuth();
  
  // Use the new public trip endpoint that works for everyone
  const { data: tripData, isLoading, error } = usePublicTrip(tripId, user?.id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <SimpleHeader />
        <div className="container mx-auto px-6 py-12">
          <LoadingState message="loading trip details..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <SimpleHeader />
        <div className="container mx-auto px-6 py-12">
          <ErrorState
            title="error loading trip"
            message={error.message}
            onRetry={() => window.location.reload()}
            variant="error"
          />
          <div className="mt-6 text-center">
            <Link href="/trips">
              <Button variant="outline">back to trips</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!tripData) {
    return (
      <div className="min-h-screen bg-white">
        <SimpleHeader />
        <div className="container mx-auto px-6 py-12">
          <ErrorState
            title="trip not found"
            message="the trip you're looking for doesn't exist"
            variant="not-found"
          />
          <div className="mt-6 text-center">
            <Link href="/trips">
              <Button>back to trips</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const trip = tripData.trip;
  const flights = tripData.flights || [];
  const lodges = tripData.lodges || [];
  const people = tripData.people || [];
  const membership = tripData.membership;

  return (
    <div className="min-h-screen bg-white">
      <SimpleHeader />
      <div className="p-8 max-w-4xl mx-auto">
        {/* Trip Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/trips">
              <Button variant="default" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Trips
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-2">{trip.title}</h1>
          <p className="text-gray-600">
            Created on {formatDate(trip.created_at)}
          </p>
          
          {/* Conditional Access Controls */}
          <TripAccessControl 
            membership={membership} 
            user={user}
            tripId={tripId}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">overview</TabsTrigger>
            <TabsTrigger value="flights">flights</TabsTrigger>
            <TabsTrigger value="lodging">lodging</TabsTrigger>
            <TabsTrigger value="people">people</TabsTrigger>
            <TabsTrigger value="costs">costs</TabsTrigger>
            <TabsTrigger value="controls">actions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>trip details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-label mb-1">trip title</div>
                    <div className="text-value">{trip.title}</div>
                  </div>
                  <div>
                    <div className="text-label mb-1">created</div>
                    <div className="text-value">{formatDate(trip.created_at)}</div>
                  </div>
                  <div>
                    <div className="text-label mb-1">travelers</div>
                    <div className="text-value">{people.length} {people.length === 1 ? 'person' : 'people'}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>flights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-display text-black mb-1">{flights.length}</div>
                  <div className="text-body-sm text-grey-600">{flights.length} flight{flights.length !== 1 ? 's' : ''} booked</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>lodging</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-display text-black mb-1">{lodges.length}</div>
                  <div className="text-body-sm text-grey-600">{lodges.length} place{lodges.length !== 1 ? 's' : ''} booked</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Flights Tab */}
          <TabsContent value="flights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>flight details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {flights.length > 0 ? (
                    flights.map((flight) => (
                      <FlightCard key={flight.id} flight={flight} />
                    ))
                  ) : (
                    <EmptyState
                      title="no flights added yet"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Add Flight Form - Only for hosts */}
            {membership?.is_host && (
              <AddFlightForm tripId={tripId} />
            )}
          </TabsContent>

          {/* Lodging Tab */}
          <TabsContent value="lodging" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>lodging details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lodges.length > 0 ? (
                    lodges.map((lodge) => (
                      <LodgeCard key={lodge.id} lodge={lodge} />
                    ))
                  ) : (
                    <EmptyState
                      title="no lodging added yet"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Add Lodge Form - Only for hosts */}
            {membership?.is_host && (
              <AddLodgeForm tripId={tripId} />
            )}
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
                    <PeopleList 
                      people={people} 
                      tripId={tripId}
                      isHost={membership?.is_host}
                      hostId={user?.id}
                    />
                  ) : (
                    <EmptyState
                      title="no travelers added yet"
                    />
                  )}
                </div>
                
              </CardContent>
            </Card>
          </TabsContent>

          {/* Costs Tab */}
          <TabsContent value="costs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trip Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <TripCosts tripId={tripId} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Controls Tab */}
          <TabsContent value="controls" className="space-y-6">
            {/* Host Controls - Only for hosts */}
            {membership?.is_host && (
              <HostControls tripId={tripId} />
            )}

            {/* Member Controls - Only for members */}
            {membership?.is_member && !membership?.is_host && (
              <MemberControls tripId={tripId} />
            )}

            {/* No access message */}
            {!membership?.is_host && !membership?.is_member && (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-600">
                    You need to be a member of this trip to access controls.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}