import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trip } from '@/lib/types';
import { formatDate, generateTripSummary } from '@/lib/utils';

interface TripCardProps {
  trip: Trip;
}

export function TripCard({ trip }: TripCardProps) {
  // For now, we'll use empty arrays since we don't have the full trip data
  // In a real implementation, you'd pass the complete trip data
  const tripSummary = generateTripSummary({ flights: [], lodges: [], people: [] });

  return (
    <Link href={`/trips/${trip.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader>
          <CardTitle className="text-lg">{trip.title}</CardTitle>
          <CardDescription>
            Created {formatDate(trip.created_at)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            {tripSummary}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
