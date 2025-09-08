import { TripPreview } from '@/lib/types';
import { TripCard } from '@/components/trips/trip-card';
import { TripCardSkeleton } from '@/components/ui/loading-skeleton';

interface TripListProps {
  trips: TripPreview[];
  isLoading?: boolean;
}

export function TripList({ trips, isLoading }: TripListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-wrap justify-center gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <TripCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-8">
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
  );
}
