import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trip } from '@/lib/types';
import { formatDate, generateTripSummary } from '@/lib/utils';
import { Calendar, Plane, MapPin, Users, ArrowRight } from 'lucide-react';

interface TripCardProps {
  trip: Trip;
  flightsCount?: number;
  lodgesCount?: number;
  peopleCount?: number;
}

export function TripCard({ trip, flightsCount = 0, lodgesCount = 0, peopleCount = 0 }: TripCardProps) {
  const tripSummary = generateTripSummary({ flights: [], lodges: [], people: [] });

  return (
    <Link href={`/trips/${trip.id}`} className="group">
      <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg group-hover:scale-[1.02] overflow-hidden">
        {/* Header with gradient background */}
        <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-700"></div>
        
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl font-semibold text-foreground group-hover:text-blue-600 transition-colors duration-200 mb-2">
                {trip.title}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                Created {formatDate(trip.created_at)}
              </CardDescription>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Trip Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors duration-200">
              <Plane className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <div className="text-sm font-medium text-blue-900">{flightsCount}</div>
              <div className="text-xs text-blue-600">Flights</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-green-50 group-hover:bg-green-100 transition-colors duration-200">
              <MapPin className="h-5 w-5 text-green-600 mx-auto mb-1" />
              <div className="text-sm font-medium text-green-900">{lodgesCount}</div>
              <div className="text-xs text-green-600">Stays</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-purple-50 group-hover:bg-purple-100 transition-colors duration-200">
              <Users className="h-5 w-5 text-purple-600 mx-auto mb-1" />
              <div className="text-sm font-medium text-purple-900">{peopleCount}</div>
              <div className="text-xs text-purple-600">Travelers</div>
            </div>
          </div>

          {/* Trip Summary */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              {tripSummary || "Start planning your trip by adding flights, accommodations, and travel companions."}
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex justify-end mt-4">
            <Badge variant="success" className="text-xs">
              Active Trip
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
