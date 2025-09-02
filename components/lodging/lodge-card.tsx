import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lodge } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface LodgeCardProps {
  lodge: Lodge;
}

export function LodgeCard({ lodge }: LodgeCardProps) {
  // Add null checks for lodge data
  if (!lodge) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-gray-600 text-center">
            Loading lodge information...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{lodge.name || 'Lodging'}</CardTitle>
          <div className="text-right">
            <div className="text-lg font-semibold">
              {lodge.total_cost ? formatCurrency(lodge.total_cost, lodge.currency) : 'Price TBD'}
            </div>
            <div className="text-sm text-gray-600">
              {lodge.number_of_nights ? `${lodge.number_of_nights} night${lodge.number_of_nights > 1 ? 's' : ''}` : 'Duration TBD'}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {lodge.location && (
            <div className="text-sm">
              <span className="font-medium">Location:</span> {lodge.location}
            </div>
          )}
          {lodge.check_in && (
            <div className="text-sm">
              <span className="font-medium">Check-in:</span> {formatDate(lodge.check_in)}
            </div>
          )}
          {lodge.check_out && (
            <div className="text-sm">
              <span className="font-medium">Check-out:</span> {formatDate(lodge.check_out)}
            </div>
          )}
          {lodge.number_of_guests && (
            <div className="text-sm">
              <span className="font-medium">Guests:</span> {lodge.number_of_guests}
            </div>
          )}
        </div>
        {lodge.link && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <a 
              href={lodge.link} 
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
