import { TripPreview } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface TripCardProps {
  trip: TripPreview;
}

export function TripCard({ trip }: TripCardProps) {
  return (
    <Card className="w-80">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{trip.title}</CardTitle>
          {trip.role && (
            <Badge variant={trip.role === 'host' ? 'default' : 'secondary'}>
              {trip.role === 'host' ? 'Host' : 'Member'}
            </Badge>
          )}
        </div>
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
