'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function NewTripPage() {
  const [tripTitle, setTripTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripTitle.trim()) return;

    setIsCreating(true);
    try {
      // For now, we'll create a simple trip object
      // In a real implementation, you'd call an API endpoint to create a trip
      const newTrip = {
        id: crypto.randomUUID(),
        title: tripTitle.trim(),
        created_at: new Date().toISOString(),
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to the new trip
      router.push(`/trips/${newTrip.id}`);
    } catch (error) {
      console.error('Failed to create trip:', error);
      // You could add error handling here
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Create New Trip</h1>
            <p className="text-gray-600">
              Start planning your next adventure
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
              <CardDescription>
                Give your trip a memorable title to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="tripTitle" className="block text-sm font-medium mb-2">
                    Trip Title
                  </label>
                  <Input
                    id="tripTitle"
                    type="text"
                    placeholder="e.g., Summer Europe Adventure, Business Trip to NYC"
                    value={tripTitle}
                    onChange={(e) => setTripTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    disabled={isCreating || !tripTitle.trim()}
                    className="flex-1"
                  >
                    {isCreating ? 'Creating Trip...' : 'Create Trip'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">What&apos;s next?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl mb-2">✈️</div>
                    <h4 className="font-medium mb-1">Add Flights</h4>
                    <p className="text-sm text-gray-600">
                      Paste your flight booking links to automatically extract details
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🏨</div>
                    <h4 className="font-medium mb-1">Book Lodging</h4>
                    <p className="text-sm text-gray-600">
                      Add hotel and accommodation bookings to track your stay
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl mb-2">👥</div>
                    <h4 className="font-medium mb-1">Invite Travelers</h4>
                    <p className="text-sm text-gray-600">
                      Add your travel companions to keep everyone organized
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
