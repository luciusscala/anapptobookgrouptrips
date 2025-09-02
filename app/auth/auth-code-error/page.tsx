import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/layout/layout';

export default function AuthCodeErrorPage() {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-destructive">Authentication Error</CardTitle>
            <CardDescription>
              There was a problem signing you in. Please try again.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/auth">
              <Button>Try Again</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
