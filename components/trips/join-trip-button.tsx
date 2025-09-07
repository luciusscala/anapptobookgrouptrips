'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useJoinRequest } from '@/hooks/useTrip';
import { useAuth } from '@/contexts/auth-context';

interface JoinTripButtonProps {
  tripId: string;
}

export function JoinTripButton({ tripId }: JoinTripButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const joinRequest = useJoinRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await joinRequest.mutateAsync({
        tripId,
        data: {
          profile_id: user.id,
          message: message.trim() || undefined,
        },
      });
      
      setIsOpen(false);
      setMessage('');
      // The page will automatically refresh due to query invalidation
    } catch (error) {
      console.error('Failed to request to join trip:', error);
      // You could add a toast notification here
    }
  };

  if (isOpen) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Request to Join Trip</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message (optional)
              </label>
              <Input
                id="message"
                type="text"
                placeholder="Tell the host why you want to join..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={joinRequest.isPending}
                className="flex-1"
              >
                {joinRequest.isPending ? 'Sending Request...' : 'Send Request'}
              </Button>
              <Button 
                type="button" 
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p className="text-yellow-800 font-medium mb-2">Want to join this trip?</p>
      <p className="text-yellow-600 text-sm mb-3">
        Send a request to the host to join this trip
      </p>
      <Button onClick={() => setIsOpen(true)}>
        Request to Join
      </Button>
    </div>
  );
}
