'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAddPerson } from '@/hooks/useTrip';

interface AddPersonFormProps {
  tripId: string;
}

export function AddPersonForm({ tripId }: AddPersonFormProps) {
  const [name, setName] = useState('');
  const addPerson = useAddPerson();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await addPerson.mutateAsync({ name: name.trim(), trip_id: tripId });
      setName('');
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to add person:', error);
      // You could add error handling here
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Traveler</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Enter traveler's name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <Button 
            type="submit" 
            disabled={addPerson.isPending || !name.trim()}
            className="w-full"
          >
            {addPerson.isPending ? 'Adding Traveler...' : 'Add Traveler'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
