import { TripPreview } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface TripCardProps {
  trip: TripPreview;
}

export function TripCard({ trip }: TripCardProps) {
  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>{trip.title}</CardTitle>
        <CardDescription>
          {trip.people_count} {trip.people_count === 1 ? 'person' : 'people'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={`/trips/${trip.id}`} className="block w-full">
          <Button className="w-full">View Details</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
