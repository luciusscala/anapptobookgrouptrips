import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lodge } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface LodgeCardProps {
  lodge: Lodge;
}

export function LodgeCard({ lodge }: LodgeCardProps) {
  if (!lodge) {
    return (
      <Card className="border border-gray-200">
        <CardContent className="pt-6 text-center">
          <p className="text-gray-600">Loading lodge information...</p>
        </CardContent>
      </Card>
    );
  }

  const getTotalNights = () => {
    if (!lodge.check_in || !lodge.check_out) return null;
    const checkIn = new Date(lodge.check_in);
    const checkOut = new Date(lodge.check_out);
    const diffTime = checkOut.getTime() - checkIn.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPricePerNight = () => {
    if (!lodge.total_cost || !lodge.number_of_nights) return null;
    return lodge.total_cost / lodge.number_of_nights;
  };

  return (
    <Card className="border border-gray-200 hover:border-green-300 transition-colors">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
              <span className="text-green-600 font-bold">🏠</span>
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900">
                {lodge.name || 'Accommodation'}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="text-xs bg-green-100 text-green-800">
                  Booked
                </Badge>
                {lodge.number_of_nights && (
                  <Badge variant="outline" className="text-xs">
                    {lodge.number_of_nights} night{lodge.number_of_nights > 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">
              {lodge.total_cost ? formatCurrency(lodge.total_cost, lodge.currency) : 'Price TBD'}
            </div>
            {getPricePerNight() && (
              <div className="text-sm text-gray-600">
                {formatCurrency(getPricePerNight()!, lodge.currency)}/night
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {lodge.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{lodge.location}</span>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            {lodge.check_in && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div>
                  <div className="font-medium text-gray-900">Check-in</div>
                  <div>{formatDate(lodge.check_in)}</div>
                </div>
              </div>
            )}
            
            {lodge.check_out && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div>
                  <div className="font-medium text-gray-900">Check-out</div>
                  <div>{formatDate(lodge.check_out)}</div>
                </div>
              </div>
            )}
          </div>
          
          {lodge.number_of_guests && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{lodge.number_of_guests} guest{lodge.number_of_guests > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
        
        {lodge.link && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <a 
              href={lodge.link} 
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
