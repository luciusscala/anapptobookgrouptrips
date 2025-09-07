'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useJoinRequests, useApproveJoinRequest, useDeclineJoinRequest } from '@/hooks/useTrip';
import { formatDate } from '@/lib/utils';

interface JoinRequestManagementProps {
  tripId: string;
  hostId: string;
}

export function JoinRequestManagement({ tripId, hostId }: JoinRequestManagementProps) {
  const { data: requestsData, isLoading } = useJoinRequests(tripId, hostId);
  const approveRequest = useApproveJoinRequest();
  const declineRequest = useDeclineJoinRequest();

  const requests = requestsData?.requests || [];

  const handleApprove = async (requestId: string) => {
    try {
      await approveRequest.mutateAsync({ tripId, requestId, hostId });
    } catch (error) {
      console.error('Failed to approve request:', error);
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      await declineRequest.mutateAsync({ tripId, requestId, hostId });
    } catch (error) {
      console.error('Failed to decline request:', error);
    }
  };

  if (isLoading) {
    return <p className="text-gray-600">Loading join requests...</p>;
  }

  if (requests.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No pending join requests</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id}>
          <CardContent className="pt-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium">Join Request</p>
                <p className="text-sm text-gray-600">
                  Requested on {formatDate(request.requested_at)}
                </p>
                {request.message && (
                  <p className="text-sm text-gray-700 mt-2 italic">
                    &ldquo;{request.message}&rdquo;
                  </p>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <Button
                  size="sm"
                  onClick={() => handleApprove(request.id)}
                  disabled={approveRequest.isPending}
                >
                  {approveRequest.isPending ? 'Approving...' : 'Approve'}
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleDecline(request.id)}
                  disabled={declineRequest.isPending}
                >
                  {declineRequest.isPending ? 'Declining...' : 'Decline'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
