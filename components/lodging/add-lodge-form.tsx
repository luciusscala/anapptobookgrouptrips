'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAddLodge } from '@/hooks/useTrip';
import { useToast } from '@/components/ui/toast';

interface AddLodgeFormProps {
  tripId: string;
}

export function AddLodgeForm({ tripId }: AddLodgeFormProps) {
  const [link, setLink] = useState('');
  const addLodgeMutation = useAddLodge();
  const { success, error: showError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!link.trim() || addLodgeMutation.isPending) return;

    try {
      await addLodgeMutation.mutateAsync({
        link: link.trim(),
        trip_id: tripId,
      });
      setLink('');
      success("lodging added", "lodging has been successfully added to your trip");
    } catch (error) {
      console.error('Failed to add lodge:', error);
      showError("failed to add lodging", "unable to add lodging. please check the link and try again.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>add lodging</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              id="lodge-link"
              type="url"
              placeholder="paste your accommodation booking link here..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={addLodgeMutation.isPending || !link.trim()}
            className="w-full"
          >
            {addLodgeMutation.isPending ? 'adding lodging...' : 'add lodging'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
