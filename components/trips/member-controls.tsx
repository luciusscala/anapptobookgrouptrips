'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MemberControlsProps {
  tripId: string;
}

export function MemberControls({ }: MemberControlsProps) {
  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Member Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Share Trip</h4>
              <p className="text-gray-600 text-sm mb-2">
                Share this trip with others by sending them the link
              </p>
              <Button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  // You could add a toast notification here
                }}
              >
                Copy Link
              </Button>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Trip Access</h4>
              <p className="text-gray-600 text-sm">
                You can add flights, lodging, and invite others to this trip
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
