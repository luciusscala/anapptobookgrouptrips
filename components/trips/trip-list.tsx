import { TripPreview } from '@/lib/types';
import { TripCard } from '@/components/trips/trip-card';

interface TripListProps {
  trips: TripPreview[];
  isLoading?: boolean;
}

export function TripList({ trips, isLoading }: TripListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-wrap justify-center gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border border-gray-300 p-8 animate-pulse min-h-[200px] w-[400px]">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-5 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
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
