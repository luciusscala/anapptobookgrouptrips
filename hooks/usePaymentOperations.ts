/**
 * Custom hook for payment operations
 * Extracts complex payment logic from components
 */

import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';

export function usePaymentOperations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setupPayments = useCallback(async (
    tripId: string, 
    hostId: string, 
    totalCostCents: number, 
    minParticipants: number
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await apiClient.setupTripPayments(tripId, hostId, totalCostCents, minParticipants);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to setup payments';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const joinWithPayment = useCallback(async (tripId: string, profileId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await apiClient.joinTripWithPayment(tripId, profileId);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to join with payment';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkVirtualCard = useCallback(async (tripId: string, hostId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await apiClient.checkVirtualCard(tripId, hostId);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check virtual card';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeParticipant = useCallback(async (tripId: string, profileId: string, hostId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await apiClient.removeParticipant(tripId, profileId, hostId);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove participant';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    setupPayments,
    joinWithPayment,
    checkVirtualCard,
    removeParticipant,
    isLoading,
    error,
    clearError: () => setError(null)
  };
}
