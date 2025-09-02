import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/layout/layout';
import { Plane, MapPin, Users, Calendar, ArrowRight, Star } from 'lucide-react';

export default function Home() {
  return (
    <Layout className="py-0">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-[#FF5A5F]/5 via-background to-[#FF5A5F]/5">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Plan your next
              <span className="text-[#FF5A5F] block">adventure</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Organize trips, manage flights, track accommodations, and coordinate with travel companions—all in one beautiful, intuitive platform.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/trips/new">
              <Button variant="airbnb" size="xl" className="gap-3 text-lg px-8 py-6">
                Start Planning
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/trips">
              <Button variant="outline" size="xl" className="gap-3 text-lg px-8 py-6">
                <Plane className="h-5 w-5" />
                View My Trips
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-[#FF5A5F] text-[#FF5A5F]" />
              <span>Trusted by travelers worldwide</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border"></div>
            <div>Free to use</div>
            <div className="hidden sm:block w-px h-4 bg-border"></div>
            <div>No credit card required</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything you need to travel smart
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From flight bookings to accommodation tracking, we've got your entire journey covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Plane className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Smart Flight Management</CardTitle>
                <CardDescription className="text-base">
                  Paste booking links and watch as we automatically extract all flight details, segments, and pricing.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Our intelligent parser handles complex itineraries, layovers, and multi-segment flights with ease.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Accommodation Tracking</CardTitle>
                <CardDescription className="text-base">
                  Keep track of your stays with check-in/out dates, costs, and guest information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Add hotels, Airbnb stays, and other accommodations to get a complete view of your trip expenses.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Travel Companions</CardTitle>
                <CardDescription className="text-base">
                  Manage who's coming on your trip and keep everyone organized and informed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Add travelers to your trips and keep track of group size for bookings and planning.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#FF5A5F] to-[#E00007] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to plan your next adventure?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of travelers who trust TravelPlanner to organize their journeys.
          </p>
          <Link href="/trips/new">
            <Button variant="secondary" size="xl" className="gap-3 text-lg px-8 py-6 bg-white text-[#FF5A5F] hover:bg-gray-50">
              <Calendar className="h-5 w-5" />
              Create Your First Trip
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
