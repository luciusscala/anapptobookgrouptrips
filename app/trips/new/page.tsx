'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { SimpleHeader } from '@/components/layout/simple-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCreateTrip } from '@/hooks/useTrip';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function NewTripPage() {
  const [tripTitle, setTripTitle] = useState('');
  const router = useRouter();
  const createTrip = useCreateTrip();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripTitle.trim()) return;

    try {
      // Get current user ID from Supabase auth
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Create trip using backend API
      const newTrip = await createTrip.mutateAsync({
        host_id: user.id,
        title: tripTitle.trim(),
      });
      
      // Redirect to the new trip
      router.push(`/trips/${newTrip.id}`);
    } catch (error) {
      console.error('Failed to create trip:', error);
      // You could add error handling here
    }
  };

  return (
    <ProtectedRoute>
      <div className="h-screen w-screen bg-white relative">
        <SimpleHeader />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button asChild variant="outline">
              <Link href="/trips">
                back to trips
              </Link>
            </Button>
          </div>
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2">
              create new trip
            </h1>
            <p className="text-gray-600">
              start planning your next adventure
            </p>
          </div>

          {/* Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>trip details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="tripTitle" className="block text-sm font-medium text-current mb-2">
                    trip title
                  </label>
                  <Input
                    id="tripTitle"
                    type="text"
                    placeholder="e.g., Summer Europe Adventure"
                    value={tripTitle}
                    onChange={(e) => setTripTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <Button 
                    type="submit" 
                    variant="primary"
                    disabled={createTrip.isPending || !tripTitle.trim()}
                  >
                    {createTrip.isPending ? 'creating trip...' : 'create trip'}
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => router.back()}
                    variant="link"
                  >
                    cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>what's next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="mb-1">add flights</h4>
                  <p className="text-sm text-gray-600">
                    paste your flight booking links to automatically extract all the details
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="mb-1">book lodging</h4>
                  <p className="text-sm text-gray-600">
                    add hotel and accommodation bookings to track your stay
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="mb-1">invite travelers</h4>
                  <p className="text-sm text-gray-600">
                    add your travel companions to keep everyone organized
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
