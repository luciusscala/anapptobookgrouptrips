import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-black mb-8">Travel App</h1>
        <Link href="/auth">
          <Button className="bg-black text-white hover:bg-gray-800">
            Login
          </Button>
        </Link>
      </div>
    </div>
  );
}
