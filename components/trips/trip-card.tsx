import { TripPreview } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface TripCardProps {
  trip: TripPreview;
}

export function TripCard({ trip }: TripCardProps) {
  return (
    <Card className="min-h-[200px] w-[400px] flex flex-col justify-between">
      <CardHeader>
        <CardTitle>
          {trip.title}
        </CardTitle>
        <CardDescription>
          {trip.people_count} {trip.people_count === 1 ? 'person' : 'people'}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <Link href={`/trips/${trip.id}`} className="block w-full">
          <Button variant="card" className="w-full" size="lg">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
