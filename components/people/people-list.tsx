import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TripPerson } from '@/lib/types';
import { UserMinus, Clock } from 'lucide-react';
import { useState } from 'react';
import { apiClient } from '@/lib/api';

interface PeopleListProps {
  people: TripPerson[];
  tripId?: string;
  isHost?: boolean;
  hostId?: string;
}

export function PeopleList({ people, tripId, isHost, hostId }: PeopleListProps) {
  const [removingParticipant, setRemovingParticipant] = useState<string | null>(null);

  const handleRemoveParticipant = async (profileId: string) => {
    if (!tripId || !hostId) return;
    
    if (!confirm('Are you sure you want to remove this participant? Their payment will be voided.')) {
      return;
    }

    setRemovingParticipant(profileId);
    
    try {
      const result = await apiClient.removeParticipant(tripId, profileId, hostId);
      
      if (result.status === 'success') {
        // Refresh the page to show updated participant list
        window.location.reload();
      } else {
        alert(`Failed to remove participant: ${result.message}`);
      }
    } catch (error) {
      console.error('Failed to remove participant:', error);
      alert('Failed to remove participant. Please try again.');
    } finally {
      setRemovingParticipant(null);
    }
  };

  if (people.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Travelers</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No travelers added yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Travelers ({people.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {people.map((person) => (
            <div key={person.id} className="flex items-center justify-between p-2 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 border border-black flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {person.profile_id.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm">User {person.profile_id.slice(0, 8)}</span>
              </div>
              
              {/* Remove button for hosts */}
              {isHost && tripId && hostId && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleRemoveParticipant(person.profile_id)}
                  disabled={removingParticipant === person.profile_id}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-red-50 border-red-200"
                >
                  {removingParticipant === person.profile_id ? (
                    <Clock className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserMinus className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
