import { TripPreview } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface TripCardProps {
  trip: TripPreview;
}

export function TripCard({ trip }: TripCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-blue-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
          {trip.title}
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>{trip.people_count} {trip.people_count === 1 ? 'person' : 'people'}</span>
        </div>
      </CardHeader>
      <CardContent>
        <Link href={`/trips/${trip.id}`}>
          <Button className="w-full group-hover:bg-blue-600 transition-colors">
            View Details →
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
