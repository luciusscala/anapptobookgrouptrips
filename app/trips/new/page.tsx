'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/protected-route';
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
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link 
              href="/trips"
              className="bg-gray-200 text-black px-4 py-2 hover:bg-gray-300"
            >
              Back to Trips
            </Link>
          </div>
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">
              Create New Trip
            </h1>
            <p className="text-gray-600">
              Start planning your next adventure
            </p>
          </div>

          {/* Form */}
          <div className="border border-black p-6 mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">Trip Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="tripTitle" className="block text-sm font-medium text-black mb-2">
                  Trip Title
                </label>
                <input
                  id="tripTitle"
                  type="text"
                  placeholder="e.g., Summer Europe Adventure"
                  value={tripTitle}
                  onChange={(e) => setTripTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none"
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  type="submit" 
                  disabled={createTrip.isPending || !tripTitle.trim()}
                  className="bg-black text-white px-6 py-2 hover:bg-gray-800 disabled:bg-gray-400"
                >
                  {createTrip.isPending ? 'Creating Trip...' : 'Create Trip'}
                </button>
                <button 
                  type="button" 
                  onClick={() => router.back()}
                  className="bg-gray-200 text-black px-6 py-2 hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Next Steps */}
          <div>
            <h3 className="text-xl font-semibold text-black mb-4">What&apos;s next?</h3>
            
            <div className="space-y-4">
              <div className="border border-gray-300 p-4">
                <h4 className="font-medium text-black mb-1">Add Flights</h4>
                <p className="text-sm text-gray-600">
                  Paste your flight booking links to automatically extract all the details
                </p>
              </div>
              
              <div className="border border-gray-300 p-4">
                <h4 className="font-medium text-black mb-1">Book Lodging</h4>
                <p className="text-sm text-gray-600">
                  Add hotel and accommodation bookings to track your stay
                </p>
              </div>
              
              <div className="border border-gray-300 p-4">
                <h4 className="font-medium text-black mb-1">Invite Travelers</h4>
                <p className="text-sm text-gray-600">
                  Add your travel companions to keep everyone organized
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
