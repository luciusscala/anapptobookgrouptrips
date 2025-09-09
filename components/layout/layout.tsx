import { Header } from './header';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function Layout({ children, className }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className={`container mx-auto px-8 py-12 ${className || ''}`}>
        {children}
      </main>
    </div>
  );
}
