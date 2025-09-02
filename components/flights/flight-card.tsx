import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flight } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

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

  // If no segments, show basic flight info
  if (!firstSegment || !lastSegment) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">
              {getFlightTitle()}
            </CardTitle>
            <div className="text-right">
              <div className="text-lg font-semibold">
                {flight.total_price ? formatCurrency(flight.total_price, flight.currency) : 'Price TBD'}
              </div>
              <div className="text-sm text-gray-600">
                {flight.trip_type || 'Flight'}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Flight information is being processed...
            </p>
            {flight.created_at && (
              <p className="text-xs text-gray-500">
                Added {formatDate(flight.created_at)}
              </p>
            )}
          </div>
          {flight.link && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <a 
                href={flight.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                View booking details →
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
            <CardTitle className="text-lg">
              {getFlightTitle()}
            </CardTitle>
            {flight.created_at && (
              <p className="text-xs text-gray-500 mt-1">
                Added {formatDate(flight.created_at)}
              </p>
            )}
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold">
              {formatCurrency(flight.total_price, flight.currency)}
            </div>
            <div className="text-sm text-gray-600">
              {flight.trip_type}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {segments.map((segment) => (
            <div key={segment.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-sm font-medium">
                  {segment.airline} {segment.flight_number}
                </div>
                <div className="text-sm text-gray-600">
                  {formatAirportCode(segment.departure_airport)} → {formatAirportCode(segment.arrival_airport)}
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {formatTime(segment.departure_time)} - {formatTime(segment.arrival_time)}
              </div>
            </div>
          ))}
        </div>
        {flight.link && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <a 
              href={flight.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              View booking details →
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
