import { TripPreview } from '@/lib/types';
import Link from 'next/link';

interface TripCardProps {
  trip: TripPreview;
}

export function TripCard({ trip }: TripCardProps) {
  return (
    <div className="border border-black p-6 hover:bg-gray-50 transition-colors">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-black mb-2">
          {trip.title}
        </h3>
        <p className="text-sm text-gray-600">
          {trip.people_count} {trip.people_count === 1 ? 'person' : 'people'}
        </p>
      </div>
      <Link 
        href={`/trips/${trip.id}`}
        className="block w-full bg-black text-white text-center py-2 hover:bg-gray-800 transition-colors"
      >
        View Details
      </Link>
    </div>
  );
}
