import { Lodge } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LodgeCardProps {
  lodge: Lodge;
}

export function LodgeCard({ lodge }: LodgeCardProps) {
  if (!lodge) {
    return (
      <Card variant="nested">
        <CardContent className="text-center">
          <p className="text-gray-500">Loading lodge information...</p>
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
    <Card variant="nested">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {lodge.name || 'Accommodation'}
            </CardTitle>
            <CardDescription>Booked</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-black">
              {lodge.total_cost ? formatCurrency(lodge.total_cost, lodge.currency) : 'Price TBD'}
            </div>
            {getPricePerNight() && (
              <div className="text-sm text-gray-500">
                {formatCurrency(getPricePerNight()!, lodge.currency)}/night
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {lodge.location && (
            <div className="text-sm text-gray-500">
              {lodge.location}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            {lodge.check_in && (
              <div className="text-sm text-gray-500">
                <div className="font-medium text-black">Check-in</div>
                <div>{formatDate(lodge.check_in)}</div>
              </div>
            )}
            
            {lodge.check_out && (
              <div className="text-sm text-gray-500">
                <div className="font-medium text-black">Check-out</div>
                <div>{formatDate(lodge.check_out)}</div>
              </div>
            )}
          </div>
          
          {lodge.number_of_guests && (
            <div className="text-sm text-gray-500">
              {lodge.number_of_guests} guest{lodge.number_of_guests > 1 ? 's' : ''}
            </div>
          )}
        </div>
        
        {lodge.link && (
          <div className="mt-4 pt-4 border-t border-gray-300">
            <a 
              href={lodge.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-black hover:underline"
            >
              View booking details
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
