import { TripPreview } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Users } from 'lucide-react';

interface TripCardProps {
  trip: TripPreview;
}

export function TripCard({ trip }: TripCardProps) {
  return (
    <Card className="w-80">
      <CardHeader>
        <div className="flex items-start justify-between mb-3">
          <CardTitle className="text-lg leading-tight">
            {trip.title}
          </CardTitle>
          {trip.role && (
            <Badge 
              variant={trip.role === 'host' ? 'default' : 'secondary'}
              className="ml-2 flex-shrink-0"
            >
              {trip.role === 'host' ? 'host' : 'member'}
            </Badge>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-grey-600">
            <Users className="h-4 w-4 mr-2" />
            <span>
              {trip.people_count} {trip.people_count === 1 ? 'person' : 'people'}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Button asChild className="w-full">
          <Link href={`/trips/${trip.id}`}>
            view details
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
