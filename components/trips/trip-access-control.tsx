'use client';

import { TripMembership, User } from '@/lib/types';
import { JoinTripButton } from '@/components/trips/join-trip-button';
import { LoginPrompt } from '@/components/trips/login-prompt';
import { PendingStatus } from '@/components/trips/pending-status';

interface TripAccessControlProps {
  membership?: TripMembership;
  user: User | null;
  tripId: string;
}

export function TripAccessControl({ membership, user, tripId }: TripAccessControlProps) {
  // Not logged in - show login prompt
  if (!user) {
    return <LoginPrompt />;
  }

  // User is the host - show host status
  if (membership?.is_host) {
    return (
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800 font-medium">You are the host of this trip</p>
        <p className="text-blue-600 text-sm">You can manage all aspects of this trip</p>
      </div>
    );
  }

  // User is a member - show member status
  if (membership?.is_member) {
    return (
      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-800 font-medium">You are a member of this trip</p>
        <p className="text-green-600 text-sm">You can add flights, lodging, and invite others</p>
      </div>
    );
  }

  // User has a pending request - show pending status
  if (membership?.has_pending_request) {
    return <PendingStatus />;
  }

  // User can join - show join button
  return (
    <div className="mt-4">
      <JoinTripButton tripId={tripId} />
    </div>
  );
}
