// TypeScript interfaces matching backend models

export interface Trip {
  id: string;
  title: string;
  host_id: string;
  created_at: string;
  is_public: boolean;
  requires_approval: boolean;
}

export interface TripPreview {
  id: string;
  title: string;
  people_count: number;
}

export interface FlightSegment {
  id: string;
  flight_id: string;
  segment_index: number;
  airline: string;
  flight_number: string;
  departure_airport: string;
  arrival_airport: string;
  departure_time: string;
  arrival_time: string;
  duration_minutes: number;
  layover_minutes?: number;
}

export interface Flight {
  id: string;
  trip_id: string;
  trip_type: string;
  total_price: number;
  currency: string;
  link?: string;
  flight_name?: string;
  created_at: string;
  segments: FlightSegment[];
}

export interface Lodge {
  id: string;
  trip_id: string;
  name: string;
  location: string;
  total_cost: number;
  currency: string;
  number_of_guests: number;
  number_of_nights: number;
  check_in: string;
  check_out: string;
  link?: string;
}

export interface TripPerson {
  id: string;
  trip_id: string;
  profile_id: string;
  status: 'pending' | 'approved' | 'declined';
  requested_at: string;
  approved_at?: string;
  approved_by?: string;
  payment_status?: 'pending' | 'authorized' | 'captured' | 'voided' | 'failed';
  payment_intent_id?: string;
  amount_cents?: number;
  currency?: string;
}

export interface CompleteTripData {
  trip: Trip;
  flights: Flight[];
  lodges: Lodge[];
  people: TripPerson[];
}

// New types for join request system
export interface JoinRequest {
  id: string;
  trip_id: string;
  profile_id: string;
  status: 'pending' | 'approved' | 'declined';
  requested_at: string;
  approved_at?: string;
  approved_by?: string;
  message?: string;
}

export interface TripMembership {
  is_host: boolean;
  is_member: boolean;
  has_pending_request: boolean;
  membership_status?: 'pending' | 'approved' | 'declined';
  join_request_id?: string;
}

export interface PublicTripData {
  trip: Trip;
  flights: Flight[];
  lodges: Lodge[];
  people: TripPerson[];
  membership?: TripMembership;
}

// API Response types
export interface ApiResponse<T> {
  status: string;
  [key: string]: T | string;
}

export interface FlightsResponse extends ApiResponse<Flight[]> {
  flights: Flight[];
}

export interface LodgesResponse extends ApiResponse<Lodge[]> {
  lodges: Lodge[];
}

export interface PeopleResponse extends ApiResponse<TripPerson[]> {
  people: TripPerson[];
}

export interface TripsResponse extends ApiResponse<TripPreview[]> {
  trips: TripPreview[];
}

export interface CompleteTripResponse extends ApiResponse<CompleteTripData> {
  trip_data: CompleteTripData;
}

export interface PublicTripResponse {
  trip: Trip;
  flights: Flight[];
  lodges: Lodge[];
  people: TripPerson[];
  membership?: TripMembership;
}

export interface TripMembershipResponse {
  trip: Trip;
  membership: TripMembership;
}

export interface JoinRequestResponse {
  id: string;
  trip_id: string;
  profile_id: string;
  status: string;
  requested_at: string;
  message?: string;
}

// Form data types
export interface CreateTripData {
  host_id: string;
  title: string;
}

export interface AddFlightData {
  link: string;
  trip_id: string;
}

export interface AddLodgeData {
  link: string;
  trip_id: string;
}

export interface AddPersonData {
  name: string;
  trip_id: string;
}

export interface JoinRequestData {
  profile_id: string;
  message?: string;
}

export interface HostActionData {
  host_id: string;
}

// Authentication types
export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}

// Simple payment types for core functionality only
export interface TripPaymentInfo {
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
  config?: {
    id: string;
    total_cost_cents: number;
    min_participants: number;
    virtual_card_id?: string;
    payment_threshold_met: boolean;
  };
}

export interface VirtualCard {
  card_id: string;
  last_four: string;
  brand: string;
  exp_month: number;
  exp_year: number;
  amount_cents: number;
  already_exists: boolean;
}

// Utility types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ApiError {
  message: string;
  status?: number;
}
