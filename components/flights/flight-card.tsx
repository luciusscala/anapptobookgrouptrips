import { Flight } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FlightCardProps {
  flight: Flight;
}

export function FlightCard({ flight }: FlightCardProps) {
  const segments = flight.segments || [];
  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    };
  };

  const formatAirportCode = (code: string) => {
    return code.toUpperCase();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getFlightTitle = () => {
    if (flight.flight_name) {
      return flight.flight_name;
    }
    if (firstSegment && lastSegment) {
      return `${formatAirportCode(firstSegment.departure_airport)} to ${formatAirportCode(lastSegment.arrival_airport)}`;
    }
    return 'Flight Details';
  };

  // If no segments, show basic flight info
  if (!firstSegment || !lastSegment) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{getFlightTitle()}</CardTitle>
              <CardDescription>Processing</CardDescription>
            </div>
            <div className="text-right">
              <div className="font-semibold">
                {flight.total_price ? formatCurrency(flight.total_price, flight.currency) : 'Price TBD'}
              </div>
              <Badge variant="secondary" className="mt-1">
                {flight.trip_type || 'Flight'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-3 border border-black">
            <p className="text-sm">
              Flight information is being processed...
            </p>
          </div>
          {flight.link && (
            <div className="mt-4 pt-4 border-t border-black">
              <a 
                href={flight.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm underline"
              >
                View booking details
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{getFlightTitle()}</CardTitle>
            <CardDescription>Confirmed</CardDescription>
          </div>
          <div className="text-right">
            <div className="font-semibold">
              {formatCurrency(flight.total_price, flight.currency)}
            </div>
            <Badge variant="secondary" className="mt-1">
              {flight.trip_type}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {segments.map((segment) => (
            <div key={segment.id} className="p-3 border border-black">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium">
                    {segment.airline} {segment.flight_number}
                  </div>
                  <div className="text-sm">
                    {formatAirportCode(segment.departure_airport)} to {formatAirportCode(segment.arrival_airport)}
                  </div>
                </div>
                <div className="text-sm text-right">
                  <div className="font-medium">{formatDateTime(segment.departure_time).date} {formatDateTime(segment.departure_time).time}</div>
                  <div>{formatDateTime(segment.arrival_time).date} {formatDateTime(segment.arrival_time).time}</div>
                  <div className="text-xs mt-1">Duration: {formatDuration(segment.duration_minutes)}</div>
                  {segment.layover_minutes && segment.layover_minutes > 0 && (
                    <div className="text-xs">Layover: {formatDuration(segment.layover_minutes)}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {flight.link && (
          <div className="mt-4 pt-4 border-t border-black">
            <a 
              href={flight.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm underline"
            >
              View booking details
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
