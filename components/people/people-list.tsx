import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TripPerson } from '@/lib/types';

interface PeopleListProps {
  people: TripPerson[];
}

export function PeopleList({ people }: PeopleListProps) {
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
            <div key={person.id} className="flex items-center space-x-3">
              <div className="h-8 w-8 border border-black flex items-center justify-center">
                <span className="text-sm font-medium">
                  {person.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm">{person.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
