import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { AddFlightData, AddLodgeData, AddPersonData, CreateTripData } from '@/lib/types';

// Hook to get all trips
export function useTrips() {
  return useQuery({
    queryKey: ['trips'],
    queryFn: () => apiClient.getTrips(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to create a new trip
export function useCreateTrip() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateTripData) => apiClient.createTrip(data),
    onSuccess: () => {
      // Invalidate and refetch trips list
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
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

// Note: Individual data hooks removed - use useTrip() for complete trip data
// This simplifies the data flow and reduces API calls

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
