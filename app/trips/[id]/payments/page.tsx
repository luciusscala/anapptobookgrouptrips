'use client';

import { useParams, useRouter } from 'next/navigation';
import { usePublicTrip } from '@/hooks/useTrip';
import { SimpleHeader } from '@/components/layout/simple-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CreditCard, Users, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';
import { SimpleTripPayments } from '@/components/payments/simple-trip-payments';
import { PaymentInfoSkeleton } from '@/components/ui/loading-skeleton';

export default function TripPaymentsPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.id as string;
  const { user } = useAuth();
  
  // Use the public trip endpoint to get trip data
  const { data: tripData, isLoading, error } = usePublicTrip(tripId, user?.id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <SimpleHeader />
        <div className="max-w-4xl mx-auto p-8">
          <PaymentInfoSkeleton />
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
  const membership = tripData.membership;

  // Check if user has access to payments
  if (!membership?.is_member && !membership?.is_host) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <SimpleHeader />
        <div className="text-center">
          <h2 className="mb-2">Access Denied</h2>
          <p className="mb-4">You need to be a member of this trip to access payment information.</p>
          <Link href={`/trips/${tripId}`}>
            <Button>Back to Trip</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <SimpleHeader />
        <div className="text-center">
          <h2 className="mb-2">Authentication Required</h2>
          <p className="mb-4">Please log in to access payment information.</p>
          <Link href="/auth">
            <Button>Log In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SimpleHeader />
      <div className="p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href={`/trips/${tripId}`}>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Trip
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <CreditCard className="h-8 w-8" />
            Trip Payments
          </h1>
          <p className="text-gray-600">
            Payment management for <strong>{trip.title}</strong>
          </p>
        </div>

        {/* Payment Information */}
        <div className="space-y-6">
          <SimpleTripPayments 
            tripId={tripId} 
            userId={user.id} 
            isHost={membership?.is_host || false} 
          />
        </div>
      </div>
    </div>
  );
}
