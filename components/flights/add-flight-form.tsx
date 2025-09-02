'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAddFlight } from '@/hooks/useTrip';

interface AddFlightFormProps {
  tripId: string;
}

export function AddFlightForm({ tripId }: AddFlightFormProps) {
  const [link, setLink] = useState('');
  const addFlight = useAddFlight();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!link.trim()) return;

    try {
      await addFlight.mutateAsync({ link: link.trim(), trip_id: tripId });
      setLink('');
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to add flight:', error);
      // You could add error handling here
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Flight</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="url"
              placeholder="Paste your flight booking link here..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
            />
          </div>
          <Button 
            type="submit" 
            disabled={addFlight.isPending || !link.trim()}
            className="w-full"
          >
            {addFlight.isPending ? 'Adding Flight...' : 'Add Flight'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
