'use client';

export function PendingStatus() {
  return (
    <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
      <p className="text-orange-800 font-medium">Request Pending</p>
      <p className="text-orange-600 text-sm">
        Your request to join this trip is pending approval from the host
      </p>
    </div>
  );
}
