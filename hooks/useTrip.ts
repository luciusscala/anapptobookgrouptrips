import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { AddFlightData, AddLodgeData, AddPersonData } from '@/lib/types';

// Hook to get all trips
export function useTrips() {
  return useQuery({
    queryKey: ['trips'],
    queryFn: () => apiClient.getTrips(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to get a specific trip with all related data
export function useTrip(tripId: string) {
  return useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => apiClient.getTrip(tripId),
    enabled: !!tripId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook to get flights for a trip
export function useFlights(tripId: string) {
  return useQuery({
    queryKey: ['flights', tripId],
    queryFn: () => apiClient.getFlights(tripId),
    enabled: !!tripId,
    staleTime: 2 * 60 * 1000,
  });
}

// Hook to get lodges for a trip
export function useLodges(tripId: string) {
  return useQuery({
    queryKey: ['lodges', tripId],
    queryFn: () => apiClient.getLodges(tripId),
    enabled: !!tripId,
    staleTime: 2 * 60 * 1000,
  });
}

// Hook to get people for a trip
export function usePeople(tripId: string) {
  return useQuery({
    queryKey: ['people', tripId],
    queryFn: () => apiClient.getPeople(tripId),
    enabled: !!tripId,
    staleTime: 2 * 60 * 1000,
  });
}

// Hook to add a flight to a trip
export function useAddFlight() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: AddFlightData) => apiClient.addFlight(data),
    onSuccess: (_, variables) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['trip', variables.trip_id] });
      queryClient.invalidateQueries({ queryKey: ['flights', variables.trip_id] });
    },
  });
}

// Hook to add a lodge to a trip
export function useAddLodge() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: AddLodgeData) => apiClient.addLodge(data),
    onSuccess: (_, variables) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['trip', variables.trip_id] });
      queryClient.invalidateQueries({ queryKey: ['lodges', variables.trip_id] });
    },
  });
}

// Hook to add a person to a trip
export function useAddPerson() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: AddPersonData) => apiClient.addPerson(data),
    onSuccess: (_, variables) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['trip', variables.trip_id] });
      queryClient.invalidateQueries({ queryKey: ['people', variables.trip_id] });
    },
  });
}
