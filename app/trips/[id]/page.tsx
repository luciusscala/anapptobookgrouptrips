'use client';

import { useParams } from 'next/navigation';
import { usePublicTrip } from '@/hooks/useTrip';
import { FlightCard } from '@/components/flights/flight-card';
import { LodgeCard } from '@/components/lodging/lodge-card';
import { PeopleList } from '@/components/people/people-list';
import { AddFlightForm } from '@/components/flights/add-flight-form';
import { AddLodgeForm } from '@/components/lodging/add-lodge-form';
import { AddPersonForm } from '@/components/people/add-person-form';
import { SimpleHeader } from '@/components/layout/simple-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';

// New components for conditional rendering
import { TripAccessControl } from '@/components/trips/trip-access-control';
import { HostControls } from '@/components/trips/host-controls';
import { MemberControls } from '@/components/trips/member-controls';

export default function TripDetailPage() {
  const params = useParams();
  const tripId = params.id as string;
  const { user } = useAuth();
  
  // Use the new public trip endpoint that works for everyone
  const { data: tripData, isLoading, error } = usePublicTrip(tripId, user?.id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <SimpleHeader />
        <div className="text-center">
          <p>Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  if (!tripData) {
    return (
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="flights">Flights</TabsTrigger>
            <TabsTrigger value="lodging">Lodging</TabsTrigger>
            <TabsTrigger value="people">People</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trip Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-700">Trip Title</h4>
                    <p className="text-gray-600">{trip.title}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700">Created</h4>
                    <p className="text-gray-600">{formatDate(trip.created_at)}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700">Travelers</h4>
                    <p className="text-gray-600">{people.length} {people.length === 1 ? 'person' : 'people'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Flights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{flights.length}</p>
                  <p className="text-gray-600">Flight{flights.length !== 1 ? 's' : ''} booked</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Lodging</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{lodges.length}</p>
                  <p className="text-gray-600">Place{lodges.length !== 1 ? 's' : ''} booked</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Flights Tab */}
          <TabsContent value="flights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Flight Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {flights.length > 0 ? (
                    flights.map((flight) => (
                      <FlightCard key={flight.id} flight={flight} />
                    ))
                  ) : (
                    <div className="p-6 text-center">
                      <h3 className="mb-2">No flights added yet</h3>
                      <p className="text-gray-500">Add flights to your trip</p>
                    </div>
                  )}
                </div>
                
                {/* Add Flight Form - Only for members */}
                {membership?.is_member && (
                  <>
                    <Separator className="my-6" />
                    <div>
                      <h3 className="mb-4">Add Flight</h3>
                      <AddFlightForm tripId={tripId} />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lodging Tab */}
          <TabsContent value="lodging" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lodging Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lodges.length > 0 ? (
                    lodges.map((lodge) => (
                      <LodgeCard key={lodge.id} lodge={lodge} />
                    ))
                  ) : (
                    <div className="p-6 text-center">
                      <h3 className="mb-2">No lodging added yet</h3>
                      <p className="text-gray-500">Add places to stay for your trip</p>
                    </div>
                  )}
                </div>
                
                {/* Add Lodge Form - Only for members */}
                {membership?.is_member && (
                  <>
                    <Separator className="my-6" />
                    <div>
                      <h3 className="mb-4">Add Lodging</h3>
                      <AddLodgeForm tripId={tripId} />
                    </div>
                  </>
                )}
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
                
                {/* Add Person Form - Only for members */}
                {membership?.is_member && (
                  <>
                    <Separator className="mb-6" />
                    <div>
                      <h3 className="mb-4">Add Traveler</h3>
                      <AddPersonForm tripId={tripId} />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Host Controls - Only for hosts */}
        {membership?.is_host && (
          <HostControls tripId={tripId} />
        )}

        {/* Member Controls - Only for members */}
        {membership?.is_member && !membership?.is_host && (
          <MemberControls tripId={tripId} />
        )}
      </div>
    </div>
  );
}