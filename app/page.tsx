import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/layout/layout';

export default function Home() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to Travel Planner
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Organize your trips, manage flights, and track your travel companions all in one place.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/trips">
              <Button size="large">View My Trips</Button>
            </Link>
            <Link href="/trips/new">
              <Button variant="secondary" size="large">Create New Trip</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>✈️ Flight Management</CardTitle>
              <CardDescription>
                Add flights by pasting booking links and automatically parse all the details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Our smart parser extracts flight information, segments, and pricing from your booking confirmations.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🏨 Lodging Tracking</CardTitle>
              <CardDescription>
                Keep track of your accommodations with check-in/out dates and costs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Add hotel and accommodation bookings to get a complete view of your trip expenses.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>👥 Travel Companions</CardTitle>
              <CardDescription>
                Manage who&apos;s coming on your trip and keep everyone organized.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Add travelers to your trips and keep track of group size for bookings.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
