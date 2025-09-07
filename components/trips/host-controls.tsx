'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import { JoinRequestManagement } from './join-request-management';

interface HostControlsProps {
  tripId: string;
}

export function HostControls({ tripId }: HostControlsProps) {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Host Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Manage Join Requests</h4>
              <p className="text-gray-600 text-sm mb-4">
                Review and approve requests from people who want to join your trip
              </p>
              <JoinRequestManagement tripId={tripId} hostId={user.id} />
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Share Trip</h4>
              <p className="text-gray-600 text-sm mb-2">
                Share this trip with others by sending them the link
              </p>
              <Button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  // You could add a toast notification here
                }}
              >
                Copy Link
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
