'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function LoginPrompt() {
  return (
    <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <p className="text-gray-800 font-medium mb-2">Want to join this trip?</p>
      <p className="text-gray-600 text-sm mb-3">
        Sign in to request to join this trip and access all features
      </p>
      <Link href="/auth">
        <Button>
          Sign In
        </Button>
      </Link>
    </div>
  );
}
