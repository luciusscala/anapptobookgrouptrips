'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAddFlight } from '@/hooks/useTrip';
import { useToast } from '@/components/ui/toast';

interface AddFlightFormProps {
  tripId: string;
}

export function AddFlightForm({ tripId }: AddFlightFormProps) {
  const [link, setLink] = useState('');
  const addFlightMutation = useAddFlight();
  const { success, error: showError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!link.trim() || addFlightMutation.isPending) return;

    try {
      await addFlightMutation.mutateAsync({
        link: link.trim(),
        trip_id: tripId,
      });
      setLink('');
      success("flight added", "flight has been successfully added to your trip");
    } catch (error) {
      console.error('Failed to add flight:', error);
      showError("failed to add flight", "unable to add flight. please check the link and try again.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>add flight</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              id="flight-link"
              type="url"
              placeholder="paste your flight booking link here..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={addFlightMutation.isPending || !link.trim()}
            className="w-full"
          >
            {addFlightMutation.isPending ? 'adding flight...' : 'add flight'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
