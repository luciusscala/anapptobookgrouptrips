'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, CreditCard, CheckCircle, Clock, UserMinus, AlertTriangle } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { usePaymentOperations } from '@/hooks/usePaymentOperations';
import { PaymentInfoSkeleton } from '@/components/ui/loading-skeleton';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface SimpleTripPaymentsProps {
  tripId: string;
  userId: string;
  isHost: boolean;
}

interface TripPaymentInfo {
  trip: {
    id: string;
    title: string;
    host_id: string;
  };
  current_participants: number;
  authorized_payments: number;
  min_participants: number;
  threshold_met: boolean;
  participants: Array<{
    profile_id: string;
    payment_status: string;
    amount_cents: number;
    currency: string;
  }>;
}

interface VirtualCard {
  card_id: string;
  last_four: string;
  brand: string;
  exp_month: number;
  exp_year: number;
  amount_cents: number;
  already_exists: boolean;
}

// Payment form component
function PaymentFormInner({ tripId, userId, onSuccess, onError }: { 
  tripId: string; 
  userId: string;
  onSuccess: () => void; 
  onError: (error: string) => void; 
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [billingName, setBillingName] = useState('');
  const { joinWithPayment, isLoading, error } = usePaymentOperations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      onError('Stripe not loaded');
      return;
    }

    try {
      // Create payment intent using custom hook
      const { client_secret } = await joinWithPayment(tripId, userId);

      // Confirm payment
      const cardElement = elements.getElement(CardElement);
      const { error } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement!,
          billing_details: { name: billingName },
        }
      });

      if (error) {
        onError(error.message || 'Payment failed');
      } else {
        onSuccess();
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Payment failed');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Payment</CardTitle>
        <CardDescription>
          Preauthorize your payment to join this trip
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Cardholder Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={billingName}
              onChange={(e) => setBillingName(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Card Information</label>
            <div className="p-3 border rounded-md">
              <CardElement
                options={{
                  style: {
                    base: { fontSize: '16px', color: '#424770' },
                    invalid: { color: '#9e2146' },
                  },
                }}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !stripe}>
            {isLoading ? 'Processing...' : 'Preauthorize Payment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Main component
export function SimpleTripPayments({ tripId, userId, isHost }: SimpleTripPaymentsProps) {
  const [paymentInfo, setPaymentInfo] = useState<TripPaymentInfo | null>(null);
  const [virtualCard, setVirtualCard] = useState<VirtualCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [removingParticipant, setRemovingParticipant] = useState<string | null>(null);
  const [showSetupForm, setShowSetupForm] = useState(false);
  const [setupData, setSetupData] = useState({
    total_cost_cents: 10000, // $100 default
    min_participants: 2
  });

  // Use custom hooks for payment operations
  const {
    setupPayments,
    joinWithPayment,
    checkVirtualCard,
    removeParticipant,
    isLoading: paymentLoading,
    error: paymentError,
    clearError
  } = usePaymentOperations();

  const loadPaymentInfo = useCallback(async () => {
    try {
      const data = await apiClient.getTripPaymentInfo(tripId);
      console.log('Payment info loaded:', data);
      setPaymentInfo(data);
      
      // Check if current user needs to pay
      const userParticipant = data.participants.find((p) => p.profile_id === userId);
      console.log('User participant:', userParticipant);
      if (userParticipant && userParticipant.payment_status === 'pending') {
        console.log('Setting show payment form to true');
        setShowPaymentForm(true);
      }
    } catch (error) {
      console.error('Failed to load payment info:', error);
      // If payment config not found, show setup message for hosts
      if (error instanceof Error && error.message.includes('payment configuration not found')) {
        setPaymentInfo({
          trip: { id: tripId, title: 'Trip', host_id: '' },
          current_participants: 0,
          authorized_payments: 0,
          min_participants: 2,
          threshold_met: false,
          participants: []
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [tripId, userId]);

  const handlePaymentSuccess = () => {
    setShowPaymentForm(false);
    loadPaymentInfo(); // Refresh data
  };

  const handleIssueVirtualCard = async () => {
    try {
      const data = await apiClient.checkVirtualCard(tripId, userId);
      setVirtualCard(data);
    } catch (error) {
      console.error('Failed to issue virtual card:', error);
    }
  };

  const handleRemoveParticipant = async (profileId: string) => {
    if (!confirm('Are you sure you want to remove this participant? Their payment will be voided.')) {
      return;
    }

    setRemovingParticipant(profileId);
    
    try {
      const result = await apiClient.removeParticipant(tripId, profileId, userId);
      
      if (result.status === 'success') {
        // Refresh data to show updated participant list
        await loadPaymentInfo();
        // Clear virtual card if threshold no longer met
        setVirtualCard(null);
      } else {
        alert(`Failed to remove participant: ${result.message}`);
      }
    } catch (error) {
      console.error('Failed to remove participant:', error);
      alert('Failed to remove participant. Please try again.');
    } finally {
      setRemovingParticipant(null);
    }
  };

  const handleSetupPayments = async () => {
    try {
      await setupPayments(tripId, userId, setupData.total_cost_cents, setupData.min_participants);
      setShowSetupForm(false);
      await loadPaymentInfo(); // Refresh data
      alert('Payment configuration created successfully! You can now make your payment to join the trip.');
    } catch (error) {
      console.error('Failed to setup payments:', error);
      if (error instanceof Error && error.message.includes('already exists')) {
        // Config already exists, just refresh the data
        await loadPaymentInfo();
        setShowSetupForm(false);
        alert('Payment configuration already exists and has been updated.');
      } else {
        alert('Failed to setup payments. Please try again.');
      }
    }
  };

  useEffect(() => {
    loadPaymentInfo();
  }, [tripId, userId, loadPaymentInfo]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <PaymentInfoSkeleton />
      </div>
    );
  }

  if (!paymentInfo) {
    return <div className="text-center p-4">No payment information available</div>;
  }

  // Check if payment config exists
  const hasPaymentConfig = 'config' in paymentInfo && paymentInfo.config && Object.keys(paymentInfo.config).length > 0;

  const userParticipant = paymentInfo.participants.find(p => p.profile_id === userId);
  const needsPayment = userParticipant && userParticipant.payment_status === 'pending';
  
  console.log('Debug values:', {
    userParticipant,
    needsPayment,
    hasPaymentConfig,
    showPaymentForm,
    participants: paymentInfo.participants
  });

  return (
    <div className="space-y-4">
      {/* Setup Payments - Host Only */}
      {isHost && !hasPaymentConfig && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Setup Trip Payments
            </CardTitle>
            <CardDescription>
              Configure payment settings for this trip before participants can join
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showSetupForm ? (
              <div className="space-y-4">
                <p className="text-gray-600">
                  No payment configuration found. Set up payments to allow participants to join with payment authorization.
                </p>
                <Button onClick={() => setShowSetupForm(true)}>
                  Setup Payments
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Total Trip Cost (USD)
                  </label>
                  <input
                    type="number"
                    value={isNaN(setupData.total_cost_cents / 100) ? '' : (setupData.total_cost_cents / 100).toString()}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value)) {
                        setSetupData({
                          ...setupData,
                          total_cost_cents: Math.round(value * 100)
                        });
                      }
                    }}
                    className="w-full p-2 border rounded-md"
                    placeholder="100.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Minimum Participants
                  </label>
                  <input
                    type="number"
                    value={setupData.min_participants}
                    onChange={(e) => setSetupData({
                      ...setupData,
                      min_participants: parseInt(e.target.value)
                    })}
                    className="w-full p-2 border rounded-md"
                    placeholder="2"
                    min="2"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSetupPayments}>
                    Create Payment Config
                  </Button>
                  <Button variant="default" onClick={() => setShowSetupForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Trip Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Trip Participants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl font-bold">{paymentInfo.current_participants}</div>
            <div className="text-sm text-gray-600">
              of {paymentInfo.min_participants} minimum
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <Badge variant={paymentInfo.threshold_met ? "default" : "secondary"}>
              {paymentInfo.threshold_met ? "Threshold Met!" : "Threshold Not Met"}
            </Badge>
            <span className="text-sm text-gray-600">
              {paymentInfo.authorized_payments} authorized payments
            </span>
          </div>

          {paymentInfo.threshold_met && (
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-green-800 text-sm">
                🎉 Trip threshold reached! Virtual card can be issued for booking.
              </p>
            </div>
          )}
          
          {/* Debug refresh button */}
          <div className="mt-4">
            <Button onClick={loadPaymentInfo} variant="outline" size="sm">
              Refresh Payment Info
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form - Show if user needs to pay */}
      {needsPayment && (
        <Elements stripe={stripePromise}>
          <PaymentFormInner
            tripId={tripId}
            userId={userId}
            onSuccess={handlePaymentSuccess}
            onError={(error) => console.error('Payment error:', error)}
          />
        </Elements>
      )}

      {/* No Payment Config Message for Members */}
      {!isHost && !hasPaymentConfig && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">
              Payment configuration not set up yet. The trip host needs to configure payments before participants can join.
            </p>
          </CardContent>
        </Card>
      )}

      {/* User Payment Status */}
      {userParticipant && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Your Payment Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {userParticipant.payment_status === 'authorized' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Clock className="h-5 w-5 text-yellow-500" />
              )}
              <span className="font-medium">
                {userParticipant.payment_status.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Amount: ${(userParticipant.amount_cents / 100).toFixed(2)} {userParticipant.currency.toUpperCase()}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Participants List - Host View */}
      {isHost && paymentInfo.participants.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Participants ({paymentInfo.participants.length})
            </CardTitle>
            <CardDescription>
              Manage trip participants and their payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paymentInfo.participants.map((participant) => (
                <div key={participant.profile_id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {participant.profile_id.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">Participant</div>
                      <div className="text-sm text-gray-600">
                        {participant.payment_status === 'authorized' ? (
                          <span className="text-green-600 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Payment Authorized
                          </span>
                        ) : (
                          <span className="text-yellow-600 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Payment Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="font-medium">
                        ${(participant.amount_cents / 100).toFixed(2)} {participant.currency.toUpperCase()}
                      </div>
                    </div>
                    
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleRemoveParticipant(participant.profile_id)}
                      disabled={removingParticipant === participant.profile_id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-red-50 border-red-200"
                    >
                      {removingParticipant === participant.profile_id ? (
                        <Clock className="h-4 w-4 animate-spin" />
                      ) : (
                        <UserMinus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {paymentInfo.participants.length > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">Host Actions</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  Removing participants will void their payments and may affect the trip threshold.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Host Actions */}
      {isHost && paymentInfo.threshold_met && !virtualCard && (
        <Card>
          <CardHeader>
            <CardTitle>Host Actions</CardTitle>
            <CardDescription>
              Issue virtual card for trip bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleIssueVirtualCard} className="w-full">
              Issue Virtual Card
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Virtual Card Display */}
      {virtualCard && (
        <Card>
          <CardHeader>
            <CardTitle>Virtual Card</CardTitle>
            <CardDescription>
              Use this card for trip bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 text-white">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">{virtualCard.brand.toUpperCase()}</span>
                <Badge variant="secondary">ACTIVE</Badge>
              </div>
              <div className="text-lg font-mono tracking-wider mb-2">
                **** **** **** {virtualCard.last_four}
              </div>
              <div className="text-sm">
                Expires {virtualCard.exp_month.toString().padStart(2, '0')}/{virtualCard.exp_year}
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Available: ${(virtualCard.amount_cents / 100).toFixed(2)} USD
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
