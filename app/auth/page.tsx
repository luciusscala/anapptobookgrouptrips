'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { AuthForm } from '@/components/auth/auth-form';

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-8">
      <div className="w-full max-w-md">
        <AuthForm 
          mode={mode} 
          onToggleMode={() => setMode(mode === 'signin' ? 'signup' : 'signin')} 
        />
      </div>
    </div>
  );
}
