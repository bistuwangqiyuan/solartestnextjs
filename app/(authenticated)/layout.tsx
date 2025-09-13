'use client';

import { useEffect } from 'react';
import { Navigation } from '@/components/layout/navigation';
import { useAuthStore } from '@/lib/store/auth-store';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="flex h-screen">
      <div className="w-64 flex-shrink-0">
        <Navigation />
      </div>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}