// TypeScript interfaces matching backend models

export interface Trip {
  id: string;
  title: string;
  host_id: string;
  created_at: string;
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
  name: string;
}

export interface CompleteTripData {
  trip: Trip;
  flights: Flight[];
  lodges: Lodge[];
  people: TripPerson[];
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

// Utility types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ApiError {
  message: string;
  status?: number;
}
