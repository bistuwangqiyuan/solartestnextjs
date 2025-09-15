import { ReactNode } from 'react';
import { Navigation } from '@/components/layout/navigation';

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navigation />
      <main className="ml-64">
        {children}
      </main>
    </div>
  );
}