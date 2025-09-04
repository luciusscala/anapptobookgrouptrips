'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAddLodge } from '@/hooks/useTrip';

interface AddLodgeFormProps {
  tripId: string;
}

export function AddLodgeForm({ tripId }: AddLodgeFormProps) {
  const [link, setLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addLodgeMutation = useAddLodge();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!link.trim()) return;

    setIsSubmitting(true);
    try {
      await addLodgeMutation.mutateAsync({
        link: link.trim(),
        trip_id: tripId,
      });
      setLink('');
    } catch (error) {
      console.error('Failed to add lodge:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          + Add Lodging
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="lodge-link" className="block text-sm font-medium text-gray-700 mb-2">
              Accommodation Booking Link
            </label>
            <div className="relative">
              <Input
                id="lodge-link"
                type="url"
                placeholder="Paste your accommodation booking link here..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Paste a link from your accommodation booking to automatically extract details
            </p>
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting || !link.trim()}
            className="w-full"
          >
            {isSubmitting ? 'Adding Lodging...' : 'Add Lodging'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
