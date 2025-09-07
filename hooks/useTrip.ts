import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { AddFlightData, AddLodgeData, AddPersonData, CreateTripData, JoinRequestData, HostActionData } from '@/lib/types';

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

// Individual data hooks for specific endpoints
export function useFlights(tripId: string) {
  return useQuery({
    queryKey: ['flights', tripId],
    queryFn: () => apiClient.getFlights(tripId),
    enabled: !!tripId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useLodges(tripId: string) {
  return useQuery({
    queryKey: ['lodges', tripId],
    queryFn: () => apiClient.getLodges(tripId),
    enabled: !!tripId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function usePeople(tripId: string) {
  return useQuery({
    queryKey: ['people', tripId],
    queryFn: () => apiClient.getPeople(tripId),
    enabled: !!tripId,
    staleTime: 2 * 60 * 1000, // 2 minutes
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

// New hooks for public trip system
export function usePublicTrip(tripId: string, userId?: string) {
  return useQuery({
    queryKey: ['publicTrip', tripId, userId],
    queryFn: () => apiClient.getPublicTrip(tripId, userId),
    enabled: !!tripId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useTripMembership(tripId: string, userId: string) {
  return useQuery({
    queryKey: ['tripMembership', tripId, userId],
    queryFn: () => apiClient.getTripMembership(tripId, userId),
    enabled: !!tripId && !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useJoinRequest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ tripId, data }: { tripId: string; data: JoinRequestData }) => 
      apiClient.requestToJoinTrip(tripId, data),
    onSuccess: (_, variables) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['publicTrip', variables.tripId] });
      queryClient.invalidateQueries({ queryKey: ['tripMembership', variables.tripId] });
    },
  });
}

export function useJoinRequests(tripId: string, hostId: string) {
  return useQuery({
    queryKey: ['joinRequests', tripId, hostId],
    queryFn: () => apiClient.getJoinRequests(tripId, hostId),
    enabled: !!tripId && !!hostId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useApproveJoinRequest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ tripId, requestId, hostId }: { tripId: string; requestId: string; hostId: string }) => 
      apiClient.approveJoinRequest(tripId, requestId, hostId),
    onSuccess: (_, variables) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['joinRequests', variables.tripId] });
      queryClient.invalidateQueries({ queryKey: ['publicTrip', variables.tripId] });
      queryClient.invalidateQueries({ queryKey: ['people', variables.tripId] });
    },
  });
}

export function useDeclineJoinRequest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ tripId, requestId, hostId }: { tripId: string; requestId: string; hostId: string }) => 
      apiClient.declineJoinRequest(tripId, requestId, hostId),
    onSuccess: (_, variables) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['joinRequests', variables.tripId] });
      queryClient.invalidateQueries({ queryKey: ['publicTrip', variables.tripId] });
    },
  });
}
