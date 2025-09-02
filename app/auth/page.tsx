'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthForm } from '@/components/auth/auth-form';
import { useAuth } from '@/contexts/auth-context';
import { Layout } from '@/components/layout/layout';
import { Card, CardContent } from '@/components/ui/card';
import { Plane, Sparkles } from 'lucide-react';

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="border-0 shadow-xl max-w-md mx-auto">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-gradient-to-br from-[#FF5A5F]/10 to-[#E00007]/10 flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FF5A5F] border-t-transparent"></div>
              </div>
              <p className="text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (user) {
    return null; // Will redirect
  }

  return (
    <Layout className="py-0">
      <div className="min-h-screen bg-gradient-to-br from-[#FF5A5F]/5 via-background to-[#FF5A5F]/5 flex items-center justify-center py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Branding */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-6">
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#FF5A5F] to-[#E00007] flex items-center justify-center">
                  <Plane className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-2xl text-foreground">TravelPlanner</span>
              </div>
              
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  Welcome to your
                  <span className="text-[#FF5A5F] block">travel hub</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Plan, organize, and manage all your travel adventures in one beautiful, intuitive platform.
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-foreground">Smart flight parsing from booking links</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-foreground">Track accommodations and expenses</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-foreground">Coordinate with travel companions</span>
              </div>
            </div>
          </div>

          {/* Right side - Auth Form */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md border-0 shadow-2xl">
              <div className="h-2 bg-gradient-to-r from-[#FF5A5F] to-[#E00007]"></div>
              <CardContent className="p-8">
                <AuthForm 
                  mode={mode} 
                  onToggleMode={() => setMode(mode === 'signin' ? 'signup' : 'signin')} 
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
