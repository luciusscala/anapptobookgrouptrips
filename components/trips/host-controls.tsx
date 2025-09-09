'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import { JoinRequestManagement } from './join-request-management';
import { SimpleTripPayments } from '@/components/payments/simple-trip-payments';
import { apiClient } from '@/lib/api';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, AlertTriangle, CreditCard } from 'lucide-react';
import Link from 'next/link';

interface HostControlsProps {
  tripId: string;
}

export function HostControls({ tripId }: HostControlsProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  
  if (!user) return null;

  const handleDeleteTrip = async () => {
    if (!confirm('Are you sure you want to delete this trip? This action cannot be undone and will remove all trip data including flights, lodging, and participant information.')) {
      return;
    }

    const confirmText = prompt('Type "DELETE" to confirm trip deletion:');
    if (confirmText !== 'DELETE') {
      return;
    }

    setIsDeleting(true);
    try {
      await apiClient.deleteTrip(tripId, user.id);
      router.push('/trips');
    } catch (error) {
      console.error('Failed to delete trip:', error);
      alert('Failed to delete trip. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

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
            
            <div>
              <h4 className="font-semibold mb-2">Payment Management</h4>
              <p className="text-gray-600 text-sm mb-4">
                Manage trip payments, participants, and virtual cards
              </p>
              <Link href={`/trips/${tripId}/payments`}>
                <Button className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Manage Payments
                </Button>
              </Link>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2 text-red-600 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Danger Zone
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                Permanently delete this trip and all associated data
              </p>
              <Button 
                variant="destructive" 
                onClick={handleDeleteTrip}
                disabled={isDeleting}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {isDeleting ? 'Deleting...' : 'Delete Trip'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
