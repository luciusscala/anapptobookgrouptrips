# Travel Planner Frontend

A modern Next.js application for managing travel itineraries, built with TypeScript, Tailwind CSS, and TanStack Query.

## Features

- **Authentication**: Secure user authentication with Supabase
- **Google Sign-in**: One-click Google OAuth integration
- **Trip Management**: Create and organize travel plans
- **Flight Tracking**: Add flights by pasting booking links with automatic parsing
- **Lodging Management**: Track accommodations with check-in/out dates and costs
- **Travel Companions**: Manage who's coming on your trips
- **Real-time Updates**: Automatic data synchronization across components
- **Route Protection**: Secure access to authenticated features
- **Responsive Design**: Mobile-first approach for travel planning on the go

## Tech Stack

- **Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Authentication**: Supabase Auth with Google OAuth
- **State Management**: TanStack Query for server state
- **UI Components**: Custom components built with Tailwind CSS
- **API Client**: Custom fetch-based client with error handling

## Project Structure

```
app/
├── page.tsx                    # Home page
├── layout.tsx                  # Root layout with providers
├── globals.css                 # Global styles and design tokens
├── trips/
│   ├── page.tsx               # Trip list page
│   ├── new/page.tsx           # Create new trip
│   └── [id]/page.tsx          # Trip detail page
components/
├── ui/                        # Base UI components
│   ├── button.tsx
│   ├── card.tsx
│   └── input.tsx
├── layout/                    # Layout components
│   ├── header.tsx
│   └── layout.tsx
├── trips/                     # Trip-related components
│   ├── trip-card.tsx
│   └── trip-list.tsx
├── flights/                   # Flight components
│   ├── flight-card.tsx
│   └── add-flight-form.tsx
├── lodging/                   # Lodging components
│   ├── lodge-card.tsx
│   └── add-lodge-form.tsx
└── people/                    # People components
    ├── people-list.tsx
    └── add-person-form.tsx
lib/
├── types.ts                   # TypeScript interfaces
├── api.ts                     # API client
└── utils.ts                   # Utility functions
hooks/
└── useTrip.ts                 # Custom React hooks for data fetching
providers/
└── query-provider.tsx         # TanStack Query provider
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:8000`
- Supabase project with authentication enabled

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your configuration:
```
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
```

4. Set up Supabase:
   - Create a new Supabase project
   - Enable Google OAuth in Authentication > Providers
   - Add your domain to the allowed redirect URLs
   - Create the `profiles` table with the schema shown in the database screenshot

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Integration

The frontend integrates with the FastAPI backend through a centralized API client (`lib/api.ts`). The client provides:

- Type-safe API calls
- Automatic error handling
- Request/response transformation
- Consistent error formatting

### Key API Endpoints Used

- `GET /api/trips` - Fetch all trips
- `GET /api/trip/{id}` - Fetch complete trip data
- `POST /api/parse_and_insert_flight` - Add flight from booking link
- `POST /api/parse_and_insert_lodge` - Add lodging from booking link
- `POST /api/join` - Add person to trip

## State Management

The application uses TanStack Query for server state management:

- **Automatic caching** of API responses
- **Background refetching** to keep data fresh
- **Optimistic updates** for better UX
- **Error handling** with retry logic
- **Loading states** built-in

## Component Architecture

### Design Principles

1. **Composition over inheritance** - Components are built to be composable
2. **Single responsibility** - Each component has a clear purpose
3. **Type safety** - Full TypeScript coverage
4. **Accessibility** - Semantic HTML and proper ARIA attributes
5. **Responsive design** - Mobile-first approach

### Key Components

- **TripCard**: Displays trip summary with navigation
- **FlightCard**: Shows flight details with segments
- **LodgeCard**: Displays accommodation information
- **AddFlightForm**: Form for adding flights via booking links
- **AddLodgeForm**: Form for adding lodging via booking links

## Styling

The application uses Tailwind CSS with a custom design system:

- **Design tokens** defined in CSS variables
- **Dark mode support** with system preference detection
- **Consistent spacing** and typography
- **Component variants** for different states

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript strict mode enabled
- ESLint configuration for Next.js
- Consistent import ordering
- Component prop interfaces defined

## Deployment

The application is ready for deployment on platforms like Vercel, Netlify, or any Node.js hosting service.

### Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (required)

### Build Process

```bash
npm run build
```

This creates an optimized production build in the `.next` folder.

## Contributing

1. Follow the existing code style and patterns
2. Add TypeScript types for new features
3. Update documentation for API changes
4. Test components in both light and dark modes
5. Ensure responsive design works on mobile devices

## Future Enhancements

- [ ] Trip sharing functionality
- [ ] PDF itinerary export
- [ ] Calendar integration
- [ ] Push notifications for trip reminders
- [ ] Cost tracking and budget management
- [ ] Multi-user collaboration features
- [ ] Offline support with service workers
- [ ] Advanced search and filtering