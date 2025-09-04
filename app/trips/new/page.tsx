'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { useCreateTrip } from '@/hooks/useTrip';
import { supabase } from '@/lib/supabase';

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
      <Layout>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-gradient-to-br from-blue-500/10 to-blue-600/10 flex items-center justify-center">
              <span className="text-blue-600 text-3xl">✨</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Create New Trip
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start planning your next adventure with a memorable title
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-xl">
                <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-700"></div>
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl">Trip Details</CardTitle>
                  <CardDescription className="text-base">
                    Give your trip a memorable title that captures the essence of your adventure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="tripTitle" className="text-sm font-medium text-foreground">
                        Trip Title
                      </label>
                      <Input
                        id="tripTitle"
                        type="text"
                        placeholder="e.g., Summer Europe Adventure, Business Trip to NYC, Family Reunion in Hawaii"
                        value={tripTitle}
                        onChange={(e) => setTripTitle(e.target.value)}
                        required
                        className="h-12 text-base"
                      />
                      <p className="text-xs text-muted-foreground">
                        Choose a name that will help you remember this special trip
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <Button 
                        type="submit" 
                        disabled={createTrip.isPending || !tripTitle.trim()}
                        variant="primary"
                        size="lg"
                        className="flex-1 gap-2"
                      >
                        {createTrip.isPending ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            Creating Trip...
                          </>
                        ) : (
                          <>
                            Create Trip →
                          </>
                        )}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="lg"
                        onClick={() => router.back()}
                        className="sm:w-auto"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Next Steps */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-foreground">What&apos;s next?</h3>
              
              <div className="space-y-4">
                <Card className="group hover:shadow-lg transition-all duration-200 border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <span className="text-white text-xl">✈</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Add Flights</h4>
                        <p className="text-sm text-muted-foreground">
                          Paste your flight booking links to automatically extract all the details
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="group hover:shadow-lg transition-all duration-200 border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <span className="text-white text-xl">🏠</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Book Lodging</h4>
                        <p className="text-sm text-muted-foreground">
                          Add hotel and accommodation bookings to track your stay
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="group hover:shadow-lg transition-all duration-200 border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <span className="text-white text-xl">👥</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Invite Travelers</h4>
                        <p className="text-sm text-muted-foreground">
                          Add your travel companions to keep everyone organized
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
