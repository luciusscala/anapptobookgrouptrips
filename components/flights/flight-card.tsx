import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flight } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

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
      <Card className="border border-gray-200 hover:border-blue-300 transition-colors">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                <span className="text-blue-600 font-bold">✈</span>
              </div>
              <div>
                <CardTitle className="text-lg text-gray-900">
                  {getFlightTitle()}
                </CardTitle>
                <Badge variant="secondary" className="text-xs mt-1">
                  Processing
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">
                {flight.total_price ? formatCurrency(flight.total_price, flight.currency) : 'Price TBD'}
              </div>
              <div className="text-sm text-gray-600">
                {flight.trip_type || 'Flight'}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Flight information is being processed...
            </p>
          </div>
          {flight.link && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <a 
                href={flight.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
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
    <Card className="border border-gray-200 hover:border-blue-300 transition-colors">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
              <span className="text-blue-600 font-bold">✈</span>
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900">
                {getFlightTitle()}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="text-xs bg-green-100 text-green-800">
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
            <div className="text-lg font-semibold text-gray-900">
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
          {segments.map((segment, index) => (
            <div key={segment.id} className="relative">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium text-gray-900">
                    {segment.airline} {segment.flight_number}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {formatAirportCode(segment.departure_airport)} 
                    <span>→</span>
                    {formatAirportCode(segment.arrival_airport)}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Depart</span>
                      <span className="font-medium">{formatDateTime(segment.departure_time).date}</span>
                      <span>{formatDateTime(segment.departure_time).time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Arrive</span>
                      <span className="font-medium">{formatDateTime(segment.arrival_time).date}</span>
                      <span>{formatDateTime(segment.arrival_time).time}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium text-blue-600">Duration: {formatDuration(segment.duration_minutes)}</span>
                      {segment.layover_minutes && segment.layover_minutes > 0 && (
                        <span className="text-xs font-medium text-orange-600">Layover: {formatDuration(segment.layover_minutes)}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {index < segments.length - 1 && (
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2">
                  <div className="h-3 w-3 rounded-full bg-gray-300 border-2 border-white"></div>
                </div>
              )}
            </div>
          ))}
        </div>
        {flight.link && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <a 
              href={flight.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              View booking details →
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
