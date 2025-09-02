'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/layout';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth-context';

export default function DebugPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const { user } = useAuth();

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testSupabaseConnection = async () => {
    try {
      addResult('Testing Supabase connection...');
      
      // Test auth
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        addResult(`Auth error: ${authError.message}`);
        return;
      }
      
      if (!authUser) {
        addResult('No authenticated user found');
        return;
      }
      
      addResult(`User authenticated: ${authUser.email}`);
      
      // Test database connection by trying to query trips table
      const { data: trips, error: tripsError } = await supabase
        .from('trips')
        .select('*')
        .limit(5);
      
      if (tripsError) {
        addResult(`Trips table error: ${tripsError.message}`);
        return;
      }
      
      addResult(`Found ${trips?.length || 0} trips in database`);
      if (trips && trips.length > 0) {
        addResult(`First trip: ${JSON.stringify(trips[0])}`);
      }
      
    } catch (error) {
      addResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testBackendAPI = async () => {
    try {
      addResult('Testing backend API...');
      
      const response = await fetch('http://localhost:8000/api/health');
      if (response.ok) {
        const data = await response.json();
        addResult(`Backend API OK: ${JSON.stringify(data)}`);
      } else {
        addResult(`Backend API error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      addResult(`Backend API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Debug Page</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Current User</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {user ? JSON.stringify(user, null, 2) : 'Not authenticated'}
          </pre>
        </div>

        <div className="mb-6 space-x-4">
          <Button onClick={testSupabaseConnection}>
            Test Supabase Connection
          </Button>
          <Button onClick={testBackendAPI}>
            Test Backend API
          </Button>
          <Button onClick={clearResults} variant="secondary">
            Clear Results
          </Button>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Test Results</h2>
          <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-500">No test results yet. Run a test to see results.</p>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="mb-2 font-mono text-sm">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
