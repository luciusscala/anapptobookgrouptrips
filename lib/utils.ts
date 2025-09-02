// Date formatting utilities
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Currency formatting
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

// Generate trip summary
export function generateTripSummary(trip: {
  flights: unknown[];
  lodges: unknown[];
  people: unknown[];
}): string {
  const flightCount = trip.flights.length;
  const lodgeCount = trip.lodges.length;
  const peopleCount = trip.people.length;
  
  const parts = [];
  if (flightCount > 0) parts.push(`${flightCount} flight${flightCount > 1 ? 's' : ''}`);
  if (lodgeCount > 0) parts.push(`${lodgeCount} lodging${lodgeCount > 1 ? 's' : ''}`);
  if (peopleCount > 0) parts.push(`${peopleCount} traveler${peopleCount > 1 ? 's' : ''}`);
  
  return parts.length > 0 ? parts.join(', ') : 'No details yet';
}
