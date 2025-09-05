'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import { Separator } from '@/components/ui/separator';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onToggleMode: () => void;
}

export function AuthForm({ mode, onToggleMode }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signIn, signUp, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let result;
      if (mode === 'signin') {
        result = await signIn(email, password);
      } else {
        result = await signUp(email, password, name);
      }

      if (result.error) {
        setError(result.error.message);
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await signInWithGoogle();
      if (result.error) {
        setError(result.error.message);
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center space-y-2">
        <CardTitle>
          {mode === 'signin' ? 'Welcome back' : 'Create account'}
        </CardTitle>
        <CardDescription>
          {mode === 'signin' 
            ? 'Sign in to continue planning your adventures' 
            : 'Join thousands of travelers planning their next trip'
          }
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-black">
              Full Name
            </label>
            <div className="relative">
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="pl-10 h-12"
              />
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-black">
            Email Address
          </label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10 h-12"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-black">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="pl-10 h-12"
            />
          </div>
          {mode === 'signup' && (
            <p className="text-xs text-gray-500">
              Password must be at least 6 characters long
            </p>
          )}
        </div>

        <Button 
          type="submit" 
          size="lg"
          className="w-full h-12 text-base font-medium" 
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
              Please wait...
            </>
          ) : (
            mode === 'signin' ? 'Sign In' : 'Create Account'
          )}
        </Button>
      </form>

        {/* Divider */}
        <div className="relative">
          <Separator />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-white px-4 text-sm text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Sign In */}
        <Button 
          size="lg"
          className="w-full h-12 text-base font-medium" 
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>

        {/* Toggle Mode */}
        <div className="text-center text-sm">
          {mode === 'signin' ? (
            <>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={onToggleMode}
                className="text-black hover:underline font-medium transition-colors"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={onToggleMode}
                className="text-black hover:underline font-medium transition-colors"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
