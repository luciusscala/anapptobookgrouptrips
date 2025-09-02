import { TripCard } from './trip-card';
import { Trip } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

interface TripListProps {
  trips: Trip[];
  isLoading?: boolean;
}

export function TripList({ trips, isLoading }: TripListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="border-0 shadow-lg">
            <div className="h-2 bg-gradient-to-r from-muted to-muted animate-pulse"></div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="h-6 bg-muted animate-pulse rounded"></div>
                <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-16 bg-muted animate-pulse rounded-lg"></div>
                  <div className="h-16 bg-muted animate-pulse rounded-lg"></div>
                  <div className="h-16 bg-muted animate-pulse rounded-lg"></div>
                </div>
                <div className="h-12 bg-muted animate-pulse rounded-lg"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
  );
}
