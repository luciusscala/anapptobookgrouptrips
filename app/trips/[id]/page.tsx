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
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 w-1/2 mb-8"></div>
            <div className="h-10 bg-gray-200 w-full mb-6"></div>
            <div className="h-64 bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-black mb-2">
              Error loading trip
            </h2>
            <p className="text-gray-600 mb-4">
              {error.message}
            </p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => window.location.reload()}
                className="bg-black text-white px-4 py-2 hover:bg-gray-800"
              >
                Try Again
              </button>
              <Link 
                href="/trips"
                className="bg-gray-200 text-black px-4 py-2 hover:bg-gray-300"
              >
                Back to Trips
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tripResponse?.trip_data) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-black mb-2">Trip not found</h2>
            <p className="text-gray-600 mb-4">
              The trip you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link 
              href="/trips"
              className="bg-black text-white px-4 py-2 hover:bg-gray-800"
            >
              Back to Trips
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const trip = tripResponse.trip_data.trip;
  const flights = flightsResponse?.flights || [];
  const lodges = lodgesResponse?.lodges || [];
  const people = peopleResponse?.people || [];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link 
              href="/trips"
              className="bg-gray-200 text-black px-4 py-2 hover:bg-gray-300"
            >
              Back to Trips
            </Link>
          </div>
          
          {/* Trip Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">{trip.title}</h1>
            <p className="text-gray-600">Created {formatDate(trip.created_at)}</p>
          </div>

          {/* Flights Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-black mb-4">Flights ({flights.length})</h2>
            <div className="space-y-4 mb-6">
              {flights.length > 0 ? (
                flights.map((flight) => (
                  <FlightCard key={flight.id} flight={flight} />
                ))
              ) : (
                <div className="border border-gray-300 p-6 text-center">
                  <h3 className="font-medium text-black mb-2">No flights added yet</h3>
                  <p className="text-gray-600">Add your flight information to get started</p>
                </div>
              )}
            </div>
            <div className="border-t border-gray-300 pt-6">
              <h3 className="text-lg font-semibold text-black mb-4">Add Flight</h3>
              <AddFlightForm tripId={tripId} />
            </div>
          </div>

          {/* Lodging Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-black mb-4">Lodging ({lodges.length})</h2>
            <div className="space-y-4 mb-6">
              {lodges.length > 0 ? (
                lodges.map((lodge) => (
                  <LodgeCard key={lodge.id} lodge={lodge} />
                ))
              ) : (
                <div className="border border-gray-300 p-6 text-center">
                  <h3 className="font-medium text-black mb-2">No lodging added yet</h3>
                  <p className="text-gray-600">Add your accommodation details</p>
                </div>
              )}
            </div>
            <div className="border-t border-gray-300 pt-6">
              <h3 className="text-lg font-semibold text-black mb-4">Add Lodging</h3>
              <AddLodgeForm tripId={tripId} />
            </div>
          </div>

          {/* People Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-black mb-4">People ({people.length})</h2>
            <div className="mb-6">
              {people.length > 0 ? (
                <PeopleList people={people} />
              ) : (
                <div className="border border-gray-300 p-6 text-center">
                  <h3 className="font-medium text-black mb-2">No travelers added yet</h3>
                  <p className="text-gray-600">Add people to your trip</p>
                </div>
              )}
            </div>
            <div className="border-t border-gray-300 pt-6">
              <h3 className="text-lg font-semibold text-black mb-4">Add Traveler</h3>
              <AddPersonForm tripId={tripId} />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
