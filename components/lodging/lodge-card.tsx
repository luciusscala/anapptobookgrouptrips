import { Lodge } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface LodgeCardProps {
  lodge: Lodge;
}

export function LodgeCard({ lodge }: LodgeCardProps) {
  if (!lodge) {
    return (
      <div className="border border-black p-6 text-center">
        <p className="text-gray-600">Loading lodge information...</p>
      </div>
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
    <div className="border border-black p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-black">
            {lodge.name || 'Accommodation'}
          </h3>
          <p className="text-sm text-gray-600">Booked</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-black">
            {lodge.total_cost ? formatCurrency(lodge.total_cost, lodge.currency) : 'Price TBD'}
          </div>
          {getPricePerNight() && (
            <div className="text-sm text-gray-600">
              {formatCurrency(getPricePerNight()!, lodge.currency)}/night
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-3">
        {lodge.location && (
          <div className="text-sm text-gray-600">
            {lodge.location}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          {lodge.check_in && (
            <div className="text-sm text-gray-600">
              <div className="font-medium text-black">Check-in</div>
              <div>{formatDate(lodge.check_in)}</div>
            </div>
          )}
          
          {lodge.check_out && (
            <div className="text-sm text-gray-600">
              <div className="font-medium text-black">Check-out</div>
              <div>{formatDate(lodge.check_out)}</div>
            </div>
          )}
        </div>
        
        {lodge.number_of_guests && (
          <div className="text-sm text-gray-600">
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
    </div>
  );
}
