import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flight } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Plane, Clock, MapPin, ExternalLink, Calendar } from 'lucide-react';

interface FlightCardProps {
  flight: Flight;
}

export function FlightCard({ flight }: FlightCardProps) {
  // Add null checks and fallbacks for segments
  const segments = flight.segments || [];
  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatAirportCode = (code: string) => {
    return code.toUpperCase();
  };

  const getFlightTitle = () => {
    if (flight.flight_name) {
      return flight.flight_name;
    }
    if (firstSegment && lastSegment) {
      return `${formatAirportCode(firstSegment.departure_airport)} → ${formatAirportCode(lastSegment.arrival_airport)}`;
    }
    return 'Flight Details';
  };

  const getTotalDuration = () => {
    if (!firstSegment || !lastSegment) return null;
    const start = new Date(firstSegment.departure_time);
    const end = new Date(lastSegment.arrival_time);
    const diffMs = end.getTime() - start.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  // If no segments, show basic flight info
  if (!firstSegment || !lastSegment) {
    return (
      <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
        <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Plane className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg text-foreground">
                  {getFlightTitle()}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="info" className="text-xs">
                    Processing
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-foreground">
                {flight.total_price ? formatCurrency(flight.total_price, flight.currency) : 'Price TBD'}
              </div>
              <div className="text-sm text-muted-foreground">
                {flight.trip_type || 'Flight'}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Flight information is being processed...
              </p>
            </div>
            {flight.created_at && (
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                Added {formatDate(flight.created_at)}
              </p>
            )}
          </div>
          {flight.link && (
            <div className="mt-4 pt-4 border-t">
              <a 
                href={flight.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:text-primary/80 flex items-center gap-2 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                View booking details
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
      <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Plane className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-foreground">
                {getFlightTitle()}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="success" className="text-xs">
                  Confirmed
                </Badge>
                {getTotalDuration() && (
                  <Badge variant="outline" className="text-xs">
                    {getTotalDuration()}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-foreground">
              {formatCurrency(flight.total_price, flight.currency)}
            </div>
            <div className="text-sm text-muted-foreground">
              {flight.trip_type}
            </div>
          </div>
        </div>
        {flight.created_at && (
          <p className="text-xs text-muted-foreground flex items-center gap-2 mt-2">
            <Calendar className="h-3 w-3" />
            Added {formatDate(flight.created_at)}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {segments.map((segment, index) => (
            <div key={segment.id} className="relative">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium text-foreground">
                    {segment.airline} {segment.flight_number}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {formatAirportCode(segment.departure_airport)} → {formatAirportCode(segment.arrival_airport)}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {formatTime(segment.departure_time)} - {formatTime(segment.arrival_time)}
                </div>
              </div>
              {index < segments.length - 1 && (
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2">
                  <div className="h-4 w-4 rounded-full bg-muted border-2 border-background"></div>
                </div>
              )}
            </div>
          ))}
        </div>
        {flight.link && (
          <div className="mt-4 pt-4 border-t">
            <a 
              href={flight.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-primary hover:text-primary/80 flex items-center gap-2 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              View booking details
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
