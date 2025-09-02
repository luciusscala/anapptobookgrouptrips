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
  const addLodge = useAddLodge();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!link.trim()) return;

    try {
      await addLodge.mutateAsync({ link: link.trim(), trip_id: tripId });
      setLink('');
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to add lodge:', error);
      // You could add error handling here
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Lodging</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="url"
              placeholder="Paste your lodging booking link here..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
            />
          </div>
          <Button 
            type="submit" 
            disabled={addLodge.isPending || !link.trim()}
            className="w-full"
          >
            {addLodge.isPending ? 'Adding Lodging...' : 'Add Lodging'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
