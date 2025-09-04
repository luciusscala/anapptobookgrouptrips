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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addFlightMutation = useAddFlight();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!link.trim()) return;

    setIsSubmitting(true);
    try {
      await addFlightMutation.mutateAsync({
        link: link.trim(),
        trip_id: tripId,
      });
      setLink('');
    } catch (error) {
      console.error('Failed to add flight:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          + Add Flight
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="flight-link" className="block text-sm font-medium text-gray-700 mb-2">
              Flight Booking Link
            </label>
            <div className="relative">
              <Input
                id="flight-link"
                type="url"
                placeholder="Paste your flight booking link here..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Paste a link from your flight booking to automatically extract details
            </p>
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting || !link.trim()}
            className="w-full"
          >
            {isSubmitting ? 'Adding Flight...' : 'Add Flight'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
