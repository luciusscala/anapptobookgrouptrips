'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useConfirmationModal } from '@/components/ui/modal';
import { useAuth } from '@/contexts/auth-context';
import { JoinRequestManagement } from './join-request-management';
import { SimpleTripPayments } from '@/components/payments/simple-trip-payments';
import { apiClient } from '@/lib/api';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, AlertTriangle, CreditCard, Share2, Users } from 'lucide-react';
import Link from 'next/link';

interface HostControlsProps {
  tripId: string;
}

export function HostControls({ tripId }: HostControlsProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const { confirm, alert, ModalComponent } = useConfirmationModal();
  
  if (!user) return null;

  const handleDeleteTrip = async () => {
    const confirmed = await confirm({
      title: 'delete trip',
      message: 'are you sure you want to delete this trip? this action cannot be undone and will remove all trip data including flights, lodging, and participant information.',
      type: 'error',
      confirmText: 'delete trip',
      cancelText: 'cancel'
    });

    if (!confirmed) return;

    // Second confirmation with text input
    const textConfirmed = await confirm({
      title: 'confirm deletion',
      message: 'type "delete" to confirm trip deletion:',
      type: 'error',
      confirmText: 'confirm',
      cancelText: 'cancel'
    });

    if (!textConfirmed) return;

    setIsDeleting(true);
    try {
      await apiClient.deleteTrip(tripId, user.id);
      await alert({
        title: 'trip deleted',
        message: 'the trip has been successfully deleted.',
        type: 'success'
      });
      router.push('/trips');
    } catch (error) {
      console.error('Failed to delete trip:', error);
      await alert({
        title: 'deletion failed',
        message: 'failed to delete trip. please try again.',
        type: 'error'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      await alert({
        title: 'link copied',
        message: 'trip link has been copied to your clipboard.',
        type: 'success'
      });
    } catch (error) {
      await alert({
        title: 'copy failed',
        message: 'failed to copy link. please try again.',
        type: 'error'
      });
    }
  };

  return (
    <>
      <div className="mt-8 space-y-6">
        {/* Join Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              manage join requests
            </CardTitle>
            <CardDescription>
              review and approve requests from people who want to join your trip
            </CardDescription>
          </CardHeader>
          <CardContent>
            <JoinRequestManagement tripId={tripId} hostId={user.id} />
          </CardContent>
        </Card>
        
        {/* Share Trip */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              share trip
            </CardTitle>
            <CardDescription>
              share this trip with others by sending them the link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleCopyLink}
              className="hover-scale"
            >
              copy link
            </Button>
          </CardContent>
        </Card>
        
        {/* Payment Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              payment management
            </CardTitle>
            <CardDescription>
              manage trip payments, participants, and virtual cards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="hover-scale">
              <Link href={`/trips/${tripId}/payments`}>
                manage payments
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        {/* Danger Zone */}
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              danger zone
            </CardTitle>
            <CardDescription className="text-red-600">
              permanently delete this trip and all associated data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="destructive" 
              onClick={handleDeleteTrip}
              disabled={isDeleting}
              className="hover-scale"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? 'deleting...' : 'delete trip'}
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <ModalComponent />
    </>
  );
}
