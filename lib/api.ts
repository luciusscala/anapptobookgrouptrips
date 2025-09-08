import { 
  TripsResponse,
  CompleteTripResponse,
  PublicTripResponse,
  TripMembershipResponse,
  JoinRequestResponse,
  AddFlightData,
  AddLodgeData,
  AddPersonData,
  CreateTripData,
  JoinRequestData,
  ApiError,
  Flight,
  Lodge,
  TripPerson,
  JoinRequest
} from './types';
import { supabase } from './supabase';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Get auth token
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(
          errorData.detail || `HTTP ${response.status}: ${response.statusText}`
        ) as ApiError;
        error.status = response.status;
        throw error;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error && 'status' in error) {
        throw error;
      }
      const apiError = new Error(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      ) as ApiError;
      throw apiError;
    }
  }

  // Trip endpoints - Use backend API exclusively
  async getTrips(): Promise<TripsResponse> {
    try {
      // Get current user ID from Supabase auth
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw new Error(userError.message);
      }

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Use backend API to get trips by host_id
      return this.request<TripsResponse>(`/api/trips/host/${user.id}`);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch trips');
    }
  }

  async createTrip(data: CreateTripData): Promise<{ id: string; host_id: string; title: string; created_at: string }> {
    return this.request('/api/trips', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTrip(tripId: string): Promise<CompleteTripResponse> {
    // Use backend API to get complete trip data
    return this.request<CompleteTripResponse>(`/api/trip/${tripId}`);
  }

  // New public trip endpoints
  async getPublicTrip(tripId: string, userId?: string): Promise<PublicTripResponse> {
    const url = userId 
      ? `/api/trips/${tripId}/public?profile_id=${userId}`
      : `/api/trips/${tripId}/public`;
    return this.request<PublicTripResponse>(url);
  }

  async getTripMembership(tripId: string, userId: string): Promise<TripMembershipResponse> {
    return this.request<TripMembershipResponse>(`/api/trips/${tripId}/membership?profile_id=${userId}`);
  }

  async requestToJoinTrip(tripId: string, data: JoinRequestData): Promise<JoinRequestResponse> {
    return this.request<JoinRequestResponse>(`/api/trips/${tripId}/join-request`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getJoinRequests(tripId: string, hostId: string): Promise<{ status: string; requests: JoinRequest[] }> {
    return this.request(`/api/trips/${tripId}/join-requests?host_id=${hostId}`);
  }

  async approveJoinRequest(tripId: string, requestId: string, hostId: string): Promise<{ status: string; message: string }> {
    return this.request(`/api/trips/${tripId}/approve/${requestId}`, {
      method: 'POST',
      body: JSON.stringify({ host_id: hostId }),
    });
  }

  async declineJoinRequest(tripId: string, requestId: string, hostId: string): Promise<{ status: string; message: string }> {
    return this.request(`/api/trips/${tripId}/decline/${requestId}`, {
      method: 'POST',
      body: JSON.stringify({ host_id: hostId }),
    });
  }

  // Specific data endpoints
  async getFlights(tripId?: string): Promise<{ status: string; flights: Flight[] }> {
    const url = tripId ? `/api/flights?trip_id=${tripId}` : '/api/flights';
    return this.request(url);
  }

  async getLodges(tripId?: string): Promise<{ status: string; lodges: Lodge[] }> {
    const url = tripId ? `/api/lodges?trip_id=${tripId}` : '/api/lodges';
    return this.request(url);
  }

  async getPeople(tripId?: string): Promise<{ status: string; people: TripPerson[] }> {
    const url = tripId ? `/api/people?trip_id=${tripId}` : '/api/people';
    return this.request(url);
  }

  // Flight endpoints
  async addFlight(data: AddFlightData): Promise<{ status: string; inserted_flight_ids: string[] }> {
    return this.request('/api/parse_and_insert_flight', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Lodge endpoints
  async addLodge(data: AddLodgeData): Promise<{ status: string; inserted_lodge_ids: string[] }> {
    return this.request('/api/parse_and_insert_lodge', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // People endpoints
  async addPerson(data: AddPersonData): Promise<{ status: string; person_id: string; message: string }> {
    return this.request('/api/join', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: number; version: string }> {
    return this.request('/api/health');
  }

  // Test Supabase connection
  async testSupabaseConnection(): Promise<{ status: string; message: string }> {
    try {
      // Try to get the current user to test auth
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        return { status: 'error', message: `Auth error: ${authError.message}` };
      }

      if (!user) {
        return { status: 'error', message: 'No authenticated user' };
      }

      // Try to list tables by attempting a simple query
      const { error: tableError } = await supabase
        .from('trips')
        .select('count')
        .limit(1);

      if (tableError) {
        return { status: 'error', message: `Table error: ${tableError.message}` };
      }

      return { status: 'success', message: 'Supabase connection successful' };
    } catch (error) {
      return { status: 'error', message: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  // Payment endpoints
  async removeParticipant(tripId: string, profileId: string, hostId: string): Promise<{ status: string; message: string }> {
    return this.request(`/api/trips/${tripId}/remove-participant/${profileId}?host_id=${hostId}`, {
      method: 'DELETE'
    });
  }

  async getTripPaymentInfo(tripId: string): Promise<{
    trip: { id: string; title: string; host_id: string };
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
    config?: {
      id: string;
      total_cost_cents: number;
      min_participants: number;
      virtual_card_id?: string;
      payment_threshold_met: boolean;
    };
  }> {
    return this.request(`/api/trips/${tripId}/payment-info`);
  }

  async joinTripWithPayment(tripId: string, profileId: string): Promise<{
    client_secret: string;
    amount_cents: number;
    currency: string;
  }> {
    return this.request(`/api/trips/${tripId}/join-with-payment?profile_id=${profileId}`, {
      method: 'POST'
    });
  }

  async checkVirtualCard(tripId: string, hostId: string): Promise<{
    card_id: string;
    last_four: string;
    brand: string;
    exp_month: number;
    exp_year: number;
    amount_cents: number;
    already_exists: boolean;
  }> {
    return this.request(`/api/trips/${tripId}/check-virtual-card?host_id=${hostId}`, {
      method: 'POST'
    });
  }

  async setupTripPayments(tripId: string, hostId: string, totalCostCents: number, minParticipants: number): Promise<{
    status: string;
    message: string;
    config_id: string;
  }> {
    return this.request(`/api/trips/${tripId}/setup-payments?host_id=${hostId}`, {
      method: 'POST',
      body: JSON.stringify({
        total_cost_cents: totalCostCents,
        min_participants: minParticipants
      })
    });
  }

  // Cost endpoints
  async getTripFlightCosts(tripId: string): Promise<{
    status: string;
    flight_costs: {
      trip_id: string;
      total_cost: number;
      currency: string;
      flight_count: number;
      flights: Array<{
        id: string;
        price: number;
        currency: string;
      }>;
    };
  }> {
    return this.request(`/api/trip/${tripId}/costs/flights`);
  }

  async getTripAccommodationCosts(tripId: string): Promise<{
    status: string;
    accommodation_costs: {
      trip_id: string;
      total_cost: number;
      currency: string;
      accommodation_count: number;
      accommodations: Array<{
        id: string;
        name: string;
        cost: number;
        currency: string;
      }>;
    };
  }> {
    return this.request(`/api/trip/${tripId}/costs/accommodations`);
  }

  async getTripTotalCosts(tripId: string): Promise<{
    status: string;
    total_costs: {
      trip_id: string;
      total_cost: number;
      currency: string;
      breakdown: {
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
      };
      flight_details: Array<{
        id: string;
        price: number;
        currency: string;
      }>;
      accommodation_details: Array<{
        id: string;
        name: string;
        cost: number;
        currency: string;
      }>;
    };
  }> {
    return this.request(`/api/trip/${tripId}/costs/total`);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
