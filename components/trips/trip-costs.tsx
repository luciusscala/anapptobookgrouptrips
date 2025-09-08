'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';

interface TripCostsProps {
  tripId: string;
}

interface FlightCost {
  id: string;
  price: number;
  currency: string;
}

interface AccommodationCost {
  id: string;
  name: string;
  cost: number;
  currency: string;
}

interface CostBreakdown {
  flights: {
    total_cost: number;
    currency: string;
    count: number;
  };
  accommodations: {
    total_cost: number;
    currency: string;
    count: number;
  };
}

interface TotalCosts {
  trip_id: string;
  total_cost: number;
  currency: string;
  breakdown: CostBreakdown;
  flight_details: FlightCost[];
  accommodation_details: AccommodationCost[];
}

export function TripCosts({ tripId }: TripCostsProps) {
  const [totalCosts, setTotalCosts] = useState<TotalCosts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getTripTotalCosts(tripId);
        setTotalCosts(response.total_costs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load costs');
      } finally {
        setLoading(false);
      }
    };

    fetchCosts();
  }, [tripId]);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton className="h-32" />
        <LoadingSkeleton className="h-48" />
        <LoadingSkeleton className="h-32" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Costs</h3>
          <p className="text-gray-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!totalCosts) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">No Cost Data</h3>
          <p className="text-gray-600">Cost information is not available for this trip.</p>
        </CardContent>
      </Card>
    );
  }

  const { breakdown, flight_details, accommodation_details, total_cost, currency } = totalCosts;

  return (
    <div className="space-y-6">
      {/* Total Cost Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Total Trip Cost</span>
            <Badge variant="outline" className="text-lg font-bold">
              {formatCurrency(total_cost, currency)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700">Flights</h4>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(breakdown.flights.total_cost, breakdown.flights.currency)}
              </p>
              <p className="text-sm text-gray-500">
                {breakdown.flights.count} flight{breakdown.flights.count !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700">Accommodations</h4>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(breakdown.accommodations.total_cost, breakdown.accommodations.currency)}
              </p>
              <p className="text-sm text-gray-500">
                {breakdown.accommodations.count} place{breakdown.accommodations.count !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flight Details */}
      {flight_details.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Flight Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {flight_details.map((flight) => (
                <div key={flight.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Flight {flight.id.slice(-8)}</p>
                    <p className="text-sm text-gray-500">Flight booking</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">
                      {formatCurrency(flight.price, flight.currency)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Accommodation Details */}
      {accommodation_details.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Accommodation Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {accommodation_details.map((accommodation) => (
                <div key={accommodation.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{accommodation.name || `Accommodation ${accommodation.id.slice(-8)}`}</p>
                    <p className="text-sm text-gray-500">Lodging booking</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      {formatCurrency(accommodation.cost, accommodation.currency)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Costs Message */}
      {flight_details.length === 0 && accommodation_details.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">No Costs Added Yet</h3>
            <p className="text-gray-600">
              Add flights and accommodations to see cost breakdowns for this trip.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
