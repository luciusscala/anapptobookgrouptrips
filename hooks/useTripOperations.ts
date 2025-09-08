/**
 * Custom hook for trip operations
 * Extracts complex trip logic from components
 */

import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import { CreateTripData, AddFlightData, AddLodgeData, AddPersonData } from '@/lib/types';

export function useTripOperations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTrip = useCallback(async (data: CreateTripData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await apiClient.createTrip(data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create trip';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addFlight = useCallback(async (data: AddFlightData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await apiClient.addFlight(data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add flight';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addLodge = useCallback(async (data: AddLodgeData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await apiClient.addLodge(data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add lodge';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addPerson = useCallback(async (data: AddPersonData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await apiClient.addPerson(data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add person';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createTrip,
    addFlight,
    addLodge,
    addPerson,
    isLoading,
    error,
    clearError: () => setError(null)
  };
}
